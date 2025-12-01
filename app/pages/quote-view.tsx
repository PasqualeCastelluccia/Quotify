import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigation } from '@/app/context/NavigationContext'
import { StepPreview } from './create-quote/step-preview'
import { toast } from 'sonner'

export default function QuoteView() {
  const { navigateTo, params } = useNavigation()
  const quoteId = params?.quoteId as number | undefined
  const [previewHTML, setPreviewHTML] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuotePreview()
  }, [quoteId])

  const loadQuotePreview = async () => {
    if (!quoteId) {
      toast.error('Errore', { description: 'ID preventivo non trovato' })
      navigateTo('quotes')
      return
    }

    try {
      setLoading(true)

      // Load quote with all details
      const quote = await window.conveyor.quotes.getById(quoteId)

      if (!quote) {
        toast.error('Errore', { description: 'Preventivo non trovato' })
        navigateTo('quotes')
        return
      }

      // Generate HTML preview
      const result = await window.conveyor.quotes.generatePreviewHTML(quote, quote.items || [])

      if (result.success && result.html) {
        setPreviewHTML(result.html)
      } else {
        toast.error('Errore', { description: 'Impossibile generare anteprima' })
      }
    } catch (error) {
      console.error('Error loading quote preview:', error)
      toast.error('Errore', { description: 'Errore durante il caricamento del preventivo' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('quotes')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Visualizza Preventivo</h1>
            <p className="text-muted-foreground mt-1">Anteprima del preventivo</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <StepPreview previewHTML={previewHTML} />
      )}
    </div>
  )
}
