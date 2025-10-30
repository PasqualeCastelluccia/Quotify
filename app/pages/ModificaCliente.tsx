import { useState, useEffect } from "react"
import { type ClienteFormData } from "@/lib/validations/cliente"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ClienteForm from "@/app/forms/ClienteForm"
import { useNavigation } from "@/app/context/NavigationContext"
import { toast } from "sonner"
import { Cliente } from "@/app/types/cliente"

export default function ModificaCliente() {
  const { navigateTo, params } = useNavigation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clienteId = params?.clienteId as number | undefined

  useEffect(() => {
    if (!clienteId) {
      toast.error("Errore", {
        description: "ID cliente non trovato",
      })
      navigateTo("clienti")
      return
    }

    const loadCliente = async () => {
      try {
        setIsLoading(true)
        const data = await window.conveyor.clienti.getById(clienteId)
        if (data) {
          setCliente(data)
        } else {
          toast.error("Errore", {
            description: "Cliente non trovato",
          })
          navigateTo("clienti")
        }
      } catch (error) {
        toast.error("Errore", {
          description: "Impossibile caricare i dati del cliente",
        })
        navigateTo("clienti")
      } finally {
        setIsLoading(false)
      }
    }

    loadCliente()
  }, [clienteId, navigateTo])

  const handleSubmit = async (data: ClienteFormData) => {
    if (!clienteId) return

    try {
      setIsSubmitting(true)
      const result = await window.conveyor.clienti.update(clienteId, data)

      if (result.success) {
        toast.success("Cliente aggiornato con successo", {
          description: `${data.businessName} è stato aggiornato`,
        })
        navigateTo("clienti")
      } else {
        toast.error("Errore nell'aggiornamento del cliente", {
          description: result.error || "Si è verificato un errore durante l'aggiornamento del cliente",
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

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateTo("clienti")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Caricamento...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!cliente) {
    return null
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
          <h1 className="text-3xl font-bold tracking-tight">Modifica Cliente</h1>
          <p className="text-muted-foreground mt-2">Aggiorna le informazioni del cliente</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informazioni Cliente</CardTitle>
          <CardDescription>Modifica i dettagli del cliente. I campi contrassegnati con * sono obbligatori.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClienteForm
            onSubmit={handleSubmit}
            defaultValues={{
              businessName: cliente.businessName,
              email: cliente.email,
              vatNumber: cliente.vatNumber,
              address: cliente.address || "",
              zipCode: cliente.zipCode || "",
              city: cliente.city || "",
            }}
            isEditMode
          />
        </CardContent>
      </Card>
    </div>
  )
}
