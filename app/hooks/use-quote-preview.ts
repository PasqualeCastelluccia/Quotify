import { useState } from 'react'

export function useQuotePreview() {
  const [previewHTML, setPreviewHTML] = useState<string>('')

  const generatePreview = async (quoteData: any): Promise<string> => {
    try {
      // Prepare items array from quoteData
      const items = quoteData.items || []

      // Call backend to generate HTML using the template
      const result = await window.conveyor.quotes.generatePreviewHTML(quoteData, items)

      if (result.success && result.html) {
        setPreviewHTML(result.html)
        return result.html
      } else {
        console.error('Failed to generate preview:', result.error)
        return ''
      }
    } catch (error) {
      console.error('Error generating preview:', error)
      return ''
    }
  }

  const clearPreview = () => {
    setPreviewHTML('')
  }

  return {
    previewHTML,
    generatePreview,
    clearPreview,
  }
}
