import { useState } from "react"
import { type ClienteFormData } from "@/lib/validations/cliente"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ClienteForm from "@/app/forms/ClienteForm"
import { useNavigation } from "@/app/context/NavigationContext"
import { toast } from "sonner"

export default function AggiungiCliente() {
  const { navigateTo } = useNavigation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ClienteFormData) => {
    try {
      setIsSubmitting(true)
      const result = await window.conveyor.clienti.create(data)

      if (result.success) {
        toast.success("Cliente creato con successo", {
          description: `${data.businessName} è stato aggiunto alla lista clienti`,
        })
        navigateTo("clienti")
      } else {
        toast.error("Errore nella creazione del cliente", {
          description: result.error || "Si è verificato un errore durante la creazione del cliente",
        })
      }
    } catch (error) {
      toast.error("Errore imprevisto", {
        description: error instanceof Error ? error.message : "Si è verificato un errore imprevisto",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header con pulsante indietro */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateTo("clienti")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aggiungi Nuovo Cliente</h1>
          <p className="text-muted-foreground mt-2">Crea un nuovo profilo cliente per la generazione dei preventivi</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informazioni Cliente</CardTitle>
          <CardDescription>Inserisci i dettagli del cliente. I campi contrassegnati con * sono obbligatori.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClienteForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
