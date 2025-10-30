import { useState, useEffect } from "react"
import { Cliente } from "@/app/types/cliente"
import { ClientiDataTable } from "@/app/data-tables/ClientiDataTable"
import { Button } from "@/app/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { useNavigation } from "@/app/context/NavigationContext"
import { ConfirmDialog } from "@/app/components/ConfirmDialog"

export default function ClientiList() {
  const { navigateTo } = useNavigation()
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null)

  useEffect(() => {
    loadClienti()
  }, [])

  const loadClienti = async () => {
    try {
      setIsLoading(true)
      const data = await window.conveyor.clienti.getAll()
      setClienti(data)
    } catch (error) {
      console.error("Errore nel caricamento dei clienti:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleView = (cliente: Cliente) => {
    navigateTo("dettaglio-cliente", {
      clienteId: cliente.id,
      clienteBusinessName: cliente.businessName
    })
  }

  const handleEdit = (cliente: Cliente) => {
    navigateTo("modifica-cliente", {
      clienteId: cliente.id,
    })
  }

  const handleSendQuote = (cliente: Cliente) => {
    navigateTo("crea-preventivo", {
      clienteId: cliente.id,
    })
  }

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!clienteToDelete?.id) return

    try {
      const result = await window.conveyor.clienti.delete(clienteToDelete.id)
      if (result.success) {
        // Reload the list
        await loadClienti()
      } else {
        console.error("Errore nell'eliminazione:", result.error)
      }
    } catch (error) {
      console.error("Errore nell'eliminazione del cliente:", error)
    } finally {
      setClienteToDelete(null)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header con pulsante indietro */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateTo("dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clienti</h1>
            <p className="text-muted-foreground mt-2">Gestisci i tuoi clienti</p>
          </div>
        </div>
        <Button onClick={() => navigateTo("aggiungi-cliente")} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Aggiungi Cliente
        </Button>
      </div>

      <ClientiDataTable
        data={clienti}
        onView={handleView}
        onEdit={handleEdit}
        onSendQuote={handleSendQuote}
        onDelete={handleDelete}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Elimina Cliente"
        description={`Sei sicuro di voler eliminare ${clienteToDelete?.businessName || "questo cliente"}? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
        variant="destructive"
      />
    </div>
  )
}
