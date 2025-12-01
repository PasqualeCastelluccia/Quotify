import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Customer } from '@/app/types/customer'
import type { QuoteItemUI, QuoteItem } from '../types/quote-item'
import type { Quote } from '../types/quote'
import type { Product } from '@/app/types/product'
import type { CompanyProfile } from '@/lib/conveyor/api/profiles-api'
import { createQuoteSchema } from '@/app/schemas/quote-schema'

export function useCreateQuote(customerIdFromParams?: number, quoteIdFromParams?: number) {
  const [quoteId, setQuoteId] = useState<number | null>(null)
  const [rows, setRows] = useState<QuoteItemUI[]>([])
  const [quoteNumber, setQuoteNumber] = useState<number>(0)
  const [quoteRevision, setQuoteRevision] = useState<number>(0)
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<number>()
  const [selectedProfile, setSelectedProfile] = useState<CompanyProfile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    loadProfiles()
    if (quoteIdFromParams) {
      loadExistingQuote(quoteIdFromParams)
    } else {
      loadNextQuoteNumber()
    }
  }, [])

  useEffect(() => {
    if (customerIdFromParams && !quoteIdFromParams) {
      loadCustomer(customerIdFromParams)
    }
  }, [customerIdFromParams, quoteIdFromParams])

  useEffect(() => {
    if (selectedProfileId) {
      const profile = profiles.find((p) => p.id === selectedProfileId)
      setSelectedProfile(profile || null)
    }
  }, [selectedProfileId, profiles])

  const loadExistingQuote = async (existingQuoteId: number) => {
    try {
      setIsEditMode(true)
      const quote = await window.conveyor.quotes.getById(existingQuoteId)

      console.log('📦 Loaded quote:', quote)

      if (!quote) {
        toast.error('Errore', { description: 'Preventivo non trovato' })
        return
      }

      // Get the next available revision for this quote number
      const nextRevisionResult = await window.conveyor.quotes.getNextRevision(quote.number)
      const nextRevision = nextRevisionResult.success ? nextRevisionResult.revision : quote.revision + 1

      console.log('🔢 Next revision for quote', quote.number, ':', nextRevision)

      // Set quote data with incremented revision
      // DO NOT set quoteId so that a new quote will be created
      setQuoteNumber(quote.number)
      setQuoteRevision(nextRevision)
      setQuoteDate(quote.date)
      setNotes(quote.notes || '')
      setSelectedProfileId(quote.companyProfileId || undefined)

      // Load customer data
      if (quote.customerId) {
        const customer = await window.conveyor.customers.getById(quote.customerId)
        if (customer) {
          setSelectedCustomerId(customer.id)
          setSelectedCustomer(customer)
        }
      }

      // Load items and convert them to UI format
      console.log('🔍 Quote items:', quote.items)
      console.log('🔍 Is array:', Array.isArray(quote.items))

      if (quote.items && Array.isArray(quote.items)) {
        console.log('📊 Converting items, length:', quote.items.length)
        const uiItems: QuoteItemUI[] = quote.items.map((item: any, index: number) => ({
          id: Date.now() + index,
          productId: item.productId,
          code: item.code,
          measure: item.measure,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          discount1: item.discount1,
          discount2: item.discount2,
          discount3: item.discount3,
          netUnitPrice: item.netUnitPrice,
          netLineTotal: item.netLineTotal,
        }))
        console.log('✅ UI Items created:', uiItems)
        setRows(uiItems)
      } else {
        console.log('❌ No items found or not an array')
      }
    } catch (error) {
      console.error('Error loading quote:', error)
      toast.error('Errore', { description: 'Impossibile caricare il preventivo' })
    }
  }

  const loadCustomer = async (customerId: number) => {
    const customer = await window.conveyor.customers.getById(customerId)
    if (customer) {
      setSelectedCustomerId(customer.id)
      setSelectedCustomer(customer)
    }
  }

  const loadProfiles = async () => {
    const data = await window.conveyor.profiles.getAll()
    setProfiles(data)

    const defaultProfile = data.find((p: CompanyProfile) => p.isDefault)
    if (defaultProfile) {
      setSelectedProfileId(defaultProfile.id)
      setSelectedProfile(defaultProfile)
    } else if (data.length > 0) {
      setSelectedProfileId(data[0].id)
      setSelectedProfile(data[0])
    }
  }

  const loadNextQuoteNumber = async () => {
    const result = await window.conveyor.quotes.getNextNumber()
    if (result.success && result.number) {
      setQuoteNumber(result.number)
    }
  }

  const handleCustomerChange = (customerId: number | undefined, customer: Customer | null) => {
    setSelectedCustomerId(customerId)
    setSelectedCustomer(customer)
  }

  const calculateNetUnitPrice = (
    unitPrice: number,
    discount1: number,
    discount2: number,
    discount3: number
  ): number => {
    let price = unitPrice
    if (discount1 > 0) price = price - (price * discount1) / 100
    if (discount2 > 0) price = price - (price * discount2) / 100
    if (discount3 > 0) price = price - (price * discount3) / 100
    return Number(price.toFixed(2))
  }

  const addRow = (product: Product, config: QuoteItemUI) => {
    const netUnitPrice = calculateNetUnitPrice(
      product.price, 
      config.discount1, 
      config.discount2, 
      config.discount3
    )
    const lineTotal = Number((config.quantity * product.price).toFixed(2))
    const netLineTotal = Number((config.quantity * netUnitPrice).toFixed(2))

    const newRow: QuoteItemUI = {
      id: Number(Date.now().toString()),
      productId: product.id,
      code: product.code,
      measure: product.measure,
      description: product.description,
      unit: config.unit,
      quantity: config.quantity,
      unitPrice: config.unitPrice,
      lineTotal: lineTotal,
      discount1: config.discount1,
      discount2: config.discount2,
      discount3: config.discount3,
      netUnitPrice: netUnitPrice,
      netLineTotal: netLineTotal,
    }

    setRows((prev) => [...prev, newRow])
  }

  const updateRow = (rowId: number, product: Product, config: QuoteItemUI) => {
    const netUnitPrice = calculateNetUnitPrice(product.price, config.discount1, config.discount2, config.discount3)
    const lineTotal = Number((config.quantity * product.price).toFixed(2))
    const netLineTotal = Number((config.quantity * netUnitPrice).toFixed(2))

    setRows((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            quantity: config.quantity,
            unit: config.unit,
            discount1: config.discount1,
            discount2: config.discount2,
            discount3: config.discount3,
            lineTotal: lineTotal,
            netUnitPrice: netUnitPrice,
            netLineTotal: netLineTotal,
          }
        }
        return row
      })
    )
  }

  const deleteRow = (rowId: number) => {
    setRows((prev) => prev.filter((row) => row.id !== rowId))
  }

  const updateNetUnitPrice = (rowId: number, newNetUnitPrice: number) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          // Recalculate only netLineTotal
          const netLineTotal = Number((row.quantity * newNetUnitPrice).toFixed(2))

          return {
            ...row,
            netUnitPrice: newNetUnitPrice,
            netLineTotal,
          }
        }
        return row
      })
    )
  }

  const calculateTotals = (rows: QuoteItemUI[]) => {
    const subtotal = rows.reduce((acc, row) => acc + row.netLineTotal, 0)
    const totalVat = rows.reduce((acc, row) => {
      const vatAmount = (row.netLineTotal * 22) / 100
      return acc + vatAmount
    }, 0)
    const total = subtotal + totalVat

    return {
      subtotal: Number(subtotal.toFixed(2)),
      totalVat: Number(totalVat.toFixed(2)),
      total: Number(total.toFixed(2)),
    }
  }

  const validateForm = () => {
    const formData = {
      quoteNumber,
      quoteDate,
      selectedProfileId,
      selectedCustomer,
      rows,
    }

    console.log('Validating form data:', formData)

    const result = createQuoteSchema.safeParse(formData)

    if (!result.success) {
      console.log('Validation error object:', result.error)
      console.log('Validation errors array:', result.error)

      const errors = result.error || result.error.issues || []
      if (errors.length > 0) {
        return errors[0].message
      }

      return 'Errore di validazione'
    }

    return null
  }

  const convertRowsToQuoteItems = (
    rows: QuoteItemUI[]
  ): Omit<QuoteItem, 'id' | 'quoteId' | 'createdAt' | 'updatedAt'>[] => {
    return rows.map((row, index) => {
      const vatAmount = (row.netLineTotal * 22) / 100

      return {
        ordering: index,
        productId: row.productId,
        code: row.code,
        measure: row.measure || null,
        description: row.description,
        unit: row.unit,
        quantity: row.quantity,
        unitPrice: row.unitPrice,
        lineTotal: row.lineTotal,
        discount1: row.discount1,
        discount2: row.discount2,
        discount3: row.discount3,
        netUnitPrice: row.netUnitPrice,
        netLineTotal: row.netLineTotal,
        vatRate: 22.0,
        vatAmount: Number(vatAmount.toFixed(2)),
      }
    })
  }

  const saveQuote = async (): Promise<Omit<Quote, 'id' | 'createdAt' | 'updatedAt'> | null> => {
    const validationError = validateForm()
    if (validationError) {
      toast.error('Errore validazione', { description: validationError })
      return null
    }

    setIsSaving(true)

    try {
      console.log('Starting saveQuote...')
      const totals = calculateTotals(rows)
      console.log('Totals calculated:', totals)

      if (!quoteId) {
        console.log('Creating new quote...')
        const items = convertRowsToQuoteItems(rows)
        console.log('Items converted:', items)

        const quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'> = {
          number: quoteNumber,
          revision: quoteRevision,
          date: quoteDate,
          companyProfileId: selectedProfileId!,
          customerId: selectedCustomer!.id,
          customerBusinessName: selectedCustomer!.businessName,
          customerEmail: selectedCustomer!.email,
          customerVatNumber: selectedCustomer!.vatNumber,
          customerAddress: selectedCustomer!.address,
          customerZipCode: selectedCustomer!.zipCode,
          customerCity: selectedCustomer!.city,
          subtotal: totals.subtotal,
          totalVat: totals.totalVat,
          total: totals.total,
          notes: notes,
          metadata: "",
          status: 'draft',
        }

        console.log('Quote data prepared:', quoteData)
        const result = await window.conveyor.quotes.create(quoteData, items)
        console.log('Create result:', result)

        if (!result.success) {
          toast.error('Errore salvataggio', { description: result.error || 'Errore sconosciuto' })
          return null
        }

        setQuoteId(result.id!)
        toast.success('Preventivo salvato', { description: `Preventivo ${quoteNumber} creato con successo` })
      }

      if (selectedProfile && selectedCustomer) {
        const quoteWithItems: any = {
          id: quoteId || 0,
          number: quoteNumber,
          revision: quoteRevision,
          date: quoteDate,
          companyProfileId: selectedProfileId!,
          customerId: selectedCustomer.id,
          customerBusinessName: selectedCustomer.businessName,
          customerEmail: selectedCustomer.email,
          customerVatNumber: selectedCustomer.vatNumber,
          customerAddress: selectedCustomer.address,
          customerZipCode: selectedCustomer.zipCode,
          customerCity: selectedCustomer.city,
          subtotal: totals.subtotal,
          totalVat: totals.totalVat,
          total: totals.total,
          notes: notes,
          metadata: '',
          status: 'draft',
          companyProfile: selectedProfile,
          customer: selectedCustomer,
          items: rows,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        return quoteWithItems
      }

      return null
    } catch (error) {
      console.error('Error in saveQuote:', error)
      toast.error('Errore', { description: 'Si è verificato un errore durante il salvataggio' })
      return null
    } finally {
      setIsSaving(false)
    }
  }

  return {
    quoteId,
    rows,
    quoteNumber,
    quoteRevision,
    quoteDate,
    notes,
    selectedCustomerId,
    selectedCustomer,
    profiles,
    selectedProfileId,
    selectedProfile,
    isSaving,
    setQuoteRevision,
    setQuoteDate,
    setNotes,
    setSelectedProfileId,
    handleCustomerChange,
    addRow,
    updateRow,
    deleteRow,
    updateNetUnitPrice,
    calculateTotals,
    saveQuote,
  }
}
