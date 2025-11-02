import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import { GradientButton } from "@/app/components/GradientButton"
import { ArrowLeft, Pencil, Trash2, Mail, Phone, MapPin, FileText } from "lucide-react"
import { useNavigation } from "@/app/context/NavigationContext"
import { ConfirmDialog } from "@/app/components/ConfirmDialog"
import { PreventiviDataTable } from "@/app/data-tables/PreventiviDataTable"
import type { Cliente } from "@/app/types/cliente"
import type { Preventivo } from "@/app/types/preventivo"
import { toast } from "sonner"

export default function ClienteDettaglio() {
  const { navigateTo, params } = useNavigation()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [preventivi, setPreventivi] = useState<Preventivo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPreventiviLoading, setIsPreventiviLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const clienteId = params.clienteId

  useEffect(() => {
    loadCliente()
    loadPreventivi()
  }, [clienteId])

  const loadCliente = async () => {
    if (!clienteId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await window.conveyor.clienti.getById(clienteId)
      setCliente(data)
    } catch (error) {
      console.error("Errore nel caricamento del cliente:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPreventivi = async () => {
    if (!clienteId) {
      setIsPreventiviLoading(false)
      return
    }

    try {
      setIsPreventiviLoading(true)
      const allPreventivi = await window.conveyor.preventivi.getAll()
      // Filtra solo i preventivi di questo cliente
      const clientePreventivi = allPreventivi.filter(
        (p: Preventivo) => p.clienteId === clienteId
      )
      setPreventivi(clientePreventivi)
    } catch (error) {
      console.error("Errore nel caricamento dei preventivi:", error)
    } finally {
      setIsPreventiviLoading(false)
    }
  }

  const handleView = (preventivo: Preventivo) => {
    // TODO: implementare visualizzazione preventivo
    console.log("Visualizza preventivo:", preventivo)
  }

  const handleEdit = (preventivo: Preventivo) => {
    // TODO: implementare modifica preventivo
    console.log("Modifica preventivo:", preventivo)
  }

  const handleGeneratePDF = async (preventivo: Preventivo) => {
    try {
      const result = await window.conveyor.pdf.generate(preventivo.id)
      if (result.success) {
        toast.success("PDF generato con successo")
      } else {
        toast.error("Errore nella generazione del PDF", {
          description: result.error
        })
      }
    } catch (error) {
      toast.error("Errore nella generazione del PDF")
    }
  }

  const handleSendEmail = async (preventivo: Preventivo) => {
    // TODO: implementare invio email
    console.log("Invia email preventivo:", preventivo)
    toast.info("Funzionalità in arrivo")
  }

  const handleDeletePreventivo = async (preventivo: Preventivo) => {
    try {
      const result = await window.conveyor.preventivi.delete(preventivo.id)
      if (result.success) {
        toast.success("Preventivo eliminato con successo")
        // Ricarica la lista
        await loadPreventivi()
      } else {
        toast.error("Errore nell'eliminazione del preventivo", {
          description: result.error
        })
      }
    } catch (error) {
      toast.error("Errore nell'eliminazione del preventivo")
    }
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!cliente?.id) return

    try {
      const result = await window.conveyor.clienti.delete(cliente.id)
      if (result.success) {
        // Navigate back to list
        navigateTo("clienti")
      } else {
        console.error("Errore nell'eliminazione:", result.error)
      }
    } catch (error) {
      console.error("Errore nell'eliminazione del cliente:", error)
    }
  }

  // Ottieni iniziali per l'avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map(word => word[0])
      .join("")
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Cliente non trovato</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header con bottoni */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateTo("clienti")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dettaglio Cliente</h1>
            <p className="text-muted-foreground mt-1">Visualizza e gestisci le informazioni del cliente</p>
          </div>
        </div>
        <div className="flex gap-2">
          <GradientButton
            size="sm"
            onClick={() => navigateTo("crea-preventivo", { clienteId: cliente.id })}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo("modifica-cliente", { clienteId: cliente.id })}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Modifica
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Elimina
          </Button>
        </div>
      </div>

      {/* Card Dettagli Cliente */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(cliente.businessName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{cliente.businessName}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">Cliente Attivo</Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{cliente.email}</p>
              </div>
            </div>

            {/* Partita IVA */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Partita IVA</p>
                <p className="font-medium">{cliente.vatNumber}</p>
              </div>
            </div>

            {/* Indirizzo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Indirizzo</p>
                <p className="font-medium">{cliente.address || "Non specificato"}</p>
                {(cliente.zipCode || cliente.city) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cliente.zipCode} {cliente.city}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sezione Preventivi - Full Width */}
      <Card>
        <CardContent className="pt-6">
          {isPreventiviLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Caricamento preventivi...</p>
            </div>
          ) : preventivi.length > 0 ? (
            <PreventiviDataTable
              data={preventivi}
              onView={handleView}
              onEdit={handleEdit}
              onGeneratePDF={handleGeneratePDF}
              onSendEmail={handleSendEmail}
              onDelete={handleDeletePreventivo}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Nessun preventivo ancora</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                I preventivi inviati a questo cliente appariranno qui. Inizia creando il tuo primo preventivo!
              </p>
              <GradientButton
                size="lg"
                onClick={() => navigateTo("crea-preventivo", { clienteId: cliente.id })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Elimina Cliente"
        description={`Sei sicuro di voler eliminare ${cliente?.businessName || "questo cliente"}? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
        variant="destructive"
      />
    </div>
  )
}
