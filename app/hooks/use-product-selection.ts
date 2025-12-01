import { useState, useEffect } from 'react'
import type { Product } from '@/app/types/product'
import type { QuoteItemUI } from '@/app/types/quote-item'

interface UseProductSelectionProps {
  open: boolean
  editMode?: boolean
  initialData?: QuoteItemUI
}

export function useProductSelection({ open, editMode = false, initialData }: UseProductSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [step, setStep] = useState<1 | 2>(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('PZ')
  const [discount1, setDiscount1] = useState(0)
  const [discount2, setDiscount2] = useState(0)
  const [discount3, setDiscount3] = useState(0)

  useEffect(() => {
    if (open && editMode && initialData) {
      setStep(2)
      setSelectedProduct({
        id: initialData.productId || 0,
        code: initialData.code,
        measure: initialData.measure || '',
        description: initialData.description,
        price: initialData.unitPrice,
        createdAt: 0,
        updatedAt: 0,
      })
      setQuantity(initialData.quantity)
      setUnit(initialData.unit)
      setDiscount1(initialData.discount1)
      setDiscount2(initialData.discount2)
      setDiscount3(initialData.discount3)
    } else if (open && !editMode) {
      resetToSearch()
    }
  }, [open, editMode, initialData])

  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 3) {
        setProducts([])
        return
      }

      setIsLoading(true)
      try {
        const result = await window.conveyor.products.getPaginated(1, 50, searchTerm)
        const productsConverted: Product[] = result.data.map((p) => ({
          id: p.id,
          code: p.code,
          description: p.description,
          measure: p.measure,
          price: p.price,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }))
        setProducts(productsConverted)
      } catch (error) {
        console.error('Error searching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      searchProducts()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const totalListPrice = selectedProduct ? quantity * selectedProduct.price : 0

  const calculateNetUnitPrice = () => {
    if (!selectedProduct) return 0
    let price = selectedProduct.price
    if (discount1 > 0) price = price - (price * discount1) / 100
    if (discount2 > 0) price = price - (price * discount2) / 100
    if (discount3 > 0) price = price - (price * discount3) / 100
    return Number(price.toFixed(2))
  }

  const netUnitPrice = calculateNetUnitPrice()
  const netLineTotal = quantity * netUnitPrice

  const selectProduct = (product: Product) => {
    setSelectedProduct(product)
    setStep(2)
  }

  const goBackToSearch = () => {
    setStep(1)
    setSelectedProduct(null)
    setQuantity(1)
    setUnit('PZ')
    setDiscount1(0)
    setDiscount2(0)
    setDiscount3(0)
  }

  const resetToSearch = () => {
    setStep(1)
    setSelectedProduct(null)
    setSearchTerm('')
    setProducts([])
    setQuantity(1)
    setUnit('PZ')
    setDiscount1(0)
    setDiscount2(0)
    setDiscount3(0)
  }

  const getConfiguration = (): Omit<QuoteItemUI, 'id'> => {
    if (!selectedProduct) {
      throw new Error('No product selected')
    }

    return {
      productId: selectedProduct.id,
      code: selectedProduct.code,
      measure: selectedProduct.measure || null,
      description: selectedProduct.description || null,
      unit,
      quantity,
      unitPrice: selectedProduct.price,
      lineTotal: totalListPrice,
      discount1,
      discount2,
      discount3,
      netUnitPrice,
      netLineTotal,
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    products,
    isLoading,
    step,
    selectedProduct,
    quantity,
    setQuantity,
    unit,
    setUnit,
    discount1,
    setDiscount1,
    discount2,
    setDiscount2,
    discount3,
    setDiscount3,
    totalListPrice,
    netUnitPrice,
    netLineTotal,
    selectProduct,
    goBackToSearch,
    resetToSearch,
    getConfiguration,
  }
}
