import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { Plus, ArrowLeft } from "lucide-react"
import { useNavigation } from "@/app/context/NavigationContext"
import { PreventiviDataTable } from "@/app/data-tables/PreventiviDataTable"
import { ConfirmDialog } from "@/app/components/ConfirmDialog"
import { toast } from "sonner"
import type { Preventivo } from "@/app/types/preventivo"

export default function PreventiviList() {
  const { navigateTo } = useNavigation()
  const [preventivi, setPreventivi] = useState<Preventivo[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [preventivoToDelete, setPreventivoToDelete] = useState<Preventivo | null>(null)

  const loadPreventivi = async () => {
    try {
      setLoading(true)
      const data = await window.conveyor.preventivi.getAll()
      setPreventivi(data)
    } catch (error) {
      console.error("Error loading preventivi:", error)
      toast.error("Errore", {
        description: "Impossibile caricare i preventivi",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPreventivi()
  }, [])

  const handleView = (preventivo: Preventivo) => {
    console.log("View preventivo:", preventivo)
  }

  const handleEdit = (preventivo: Preventivo) => {
    console.log("Edit preventivo:", preventivo)
  }

  const handleGeneratePDF = async (preventivo: Preventivo) => {
    try {
      toast.loading("Generazione PDF in corso...", { id: 'pdf-generation' })

      const result = await window.conveyor.pdf.generatePreventivo(preventivo.id)

      if (result.success) {
        toast.success("PDF generato", {
          id: 'pdf-generation',
          description: `PDF del preventivo ${preventivo.numero} aperto con successo`,
        })
      } else {
        toast.error("Errore generazione PDF", {
          id: 'pdf-generation',
          description: result.error || "Impossibile generare il PDF",
        })
      }
    } catch (error) {
      toast.error("Errore", {
        id: 'pdf-generation',
        description: "Errore durante la generazione del PDF",
      })
    }
  }

  const handleSendEmail = (preventivo: Preventivo) => {
    console.log("Send email:", preventivo)
    toast.info("Funzionalità in arrivo", {
      description: "Invio email in fase di sviluppo",
    })
  }

  const handleDelete = (preventivo: Preventivo) => {
    setPreventivoToDelete(preventivo)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!preventivoToDelete) return

    try {
      const result = await window.conveyor.preventivi.delete(preventivoToDelete.id)

      if (result.success) {
        toast.success("Preventivo eliminato", {
          description: `Preventivo ${preventivoToDelete.numero} eliminato con successo`,
        })
        loadPreventivi()
      } else {
        toast.error("Errore", {
          description: result.error || "Impossibile eliminare il preventivo",
        })
      }
    } catch (error) {
      toast.error("Errore", {
        description: "Errore durante l'eliminazione",
      })
    } finally {
      setDeleteDialogOpen(false)
      setPreventivoToDelete(null)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateTo("dashboard")}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Preventivi</h1>
            <p className="text-muted-foreground mt-2">Gestisci i tuoi preventivi</p>
          </div>
        </div>
        <Button onClick={() => navigateTo("crea-preventivo")} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Crea Preventivo
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Caricamento preventivi...</p>
          </div>
        ) : (
          <PreventiviDataTable
            data={preventivi}
            onView={handleView}
            onEdit={handleEdit}
            onGeneratePDF={handleGeneratePDF}
            onSendEmail={handleSendEmail}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Elimina preventivo"
        description={`Sei sicuro di voler eliminare il preventivo ${preventivoToDelete?.numero}? Questa azione non può essere annullata.`}
      />
    </div>
  )
}
