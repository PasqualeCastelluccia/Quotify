import { useState } from 'react'
import { type ProdottoFormData } from '@/lib/validations/prodotto'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ProdottoForm from '@/app/forms/ProdottoForm'
import { useNavigation } from '@/app/context/NavigationContext'

export default function CreateProduct() {
  const { navigateTo } = useNavigation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ProdottoFormData) => {
    try {
      setIsSubmitting(true)
      const result = await window.conveyor.prodotti.create(data)

      if (result.success) {
        console.log('Prodotto creato con ID:', result.id)
        // Navigate back to the list
        navigateTo('prodotti')
      } else {
        console.error('Errore nella creazione:', result.error)
        // TODO: Mostrare errore all'utente con toast/alert
      }
    } catch (error) {
      console.error('Errore nella creazione del prodotto:', error)
      // TODO: Mostrare errore all'utente con toast/alert
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header con pulsante indietro */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigateTo('prodotti')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aggiungi Nuovo Prodotto</h1>
          <p className="text-muted-foreground mt-2">Crea un nuovo prodotto per il tuo listino</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informazioni Prodotto</CardTitle>
          <CardDescription>
            Inserisci i dettagli del prodotto. I campi contrassegnati con * sono obbligatori.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProdottoForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
