import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useNavigation } from '@/app/context/NavigationContext'
import type { Quote } from '@/app/types/quote' 

export function useQuotesList() {
  const { navigateTo } = useNavigation()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null)

  const loadQuotes = async () => {
    try {
      setLoading(true)
      const data = await window.conveyor.quotes.getAll()
      setQuotes(data)
    } catch (error) {
      console.error('Error loading quotes:', error)
      toast.error('Errore', {
        description: 'Impossibile caricare i preventivi',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuotes()
  }, [])

  const handleView = (quote: Quote) => {
    navigateTo('quote-view', { quoteId: quote.id })
  }

  const handleEdit = (quote: Quote) => {
    navigateTo('create-quote', { quoteId: quote.id })
  }

  const handleGeneratePDF = async (quote: Quote) => {
    try {
      toast.loading('Generazione PDF in corso...', { id: 'pdf-generation' })

      const result = await window.conveyor.pdf.generateQuote(quote.id)

      if (result.success) {
        toast.success('PDF generato', {
          id: 'pdf-generation',
          description: `PDF del Quote ${quote.number} aperto con successo`,
        })
      } else {
        toast.error('Errore generazione PDF', {
          id: 'pdf-generation',
          description: result.error || 'Impossibile generare il PDF',
        })
      }
    } catch (error) {
      toast.error('Errore', {
        id: 'pdf-generation',
        description: 'Errore durante la generazione del PDF',
      })
    }
  }

  const handleSendEmail = (quote: Quote) => {
    navigateTo('send-quote-email', { quoteId: quote.id })
  }

  const handleDelete = (quote: Quote) => {
    setQuoteToDelete(quote)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!quoteToDelete) return

    try {
      const result = await window.conveyor.quotes.delete(quoteToDelete.id)

      if (result.success) {
        toast.success('Quote eliminato', {
          description: `Quote ${quoteToDelete.number} eliminato con successo`,
        })
        loadQuotes()
      } else {
        toast.error('Errore', {
          description: result.error || 'Impossibile eliminare il Quote',
        })
      }
    } catch (error) {
      toast.error('Errore', {
        description: "Errore durante l'eliminazione",
      })
    } finally {
      setDeleteDialogOpen(false)
      setQuoteToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setQuoteToDelete(null)
  }

  return {
    quotes,
    loading,
    deleteDialogOpen,
    quoteToDelete,
    setDeleteDialogOpen,
    handleView,
    handleEdit,
    handleGeneratePDF,
    handleSendEmail,
    handleDelete,
    confirmDelete,
    cancelDelete,
  }
}
