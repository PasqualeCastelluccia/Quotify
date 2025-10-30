import { useState, useEffect } from "react"
import { Prodotto } from "@/app/types/prodotto"
import { ProdottiDataTable } from "@/app/data-tables/ProdottiDataTable"
import { Button } from "@/app/components/ui/button"
import { Plus, ArrowLeft, FileSpreadsheet } from "lucide-react"
import { useNavigation } from "@/app/context/NavigationContext"
import { ConfirmDialog } from "@/app/components/ConfirmDialog"

export default function ProdottiList() {
  const { navigateTo } = useNavigation()
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [prodottoToDelete, setProdottoToDelete] = useState<Prodotto | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const pageSize = 10

  // Load prodotti on mount and when page or search changes
  useEffect(() => {
    loadProdotti()
  }, [currentPage, searchTerm])

  const loadProdotti = async () => {
    try {
      setIsLoading(true)
      const result = await window.conveyor.prodotti.getPaginated(currentPage, pageSize, searchTerm)
      setProdotti(result.data)
      setTotalPages(result.totalPages)
      setTotalProducts(result.total)
    } catch (error) {
      console.error("Errore nel caricamento dei prodotti:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // Reset to page 1 when searching
    setCurrentPage(1)
  }

  const handleDelete = (prodotto: Prodotto) => {
    setProdottoToDelete(prodotto)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!prodottoToDelete?.id) return

    try {
      const result = await window.conveyor.prodotti.delete(prodottoToDelete.id)
      if (result.success) {
        // If current page becomes empty after delete, go to previous page
        if (prodotti.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          // Reload the current page
          await loadProdotti()
        }
      } else {
        console.error("Errore nell'eliminazione:", result.error)
      }
    } catch (error) {
      console.error("Errore nell'eliminazione del prodotto:", error)
    } finally {
      setProdottoToDelete(null)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
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
            className="cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prodotti</h1>
            <p className="text-muted-foreground mt-2">Gestisci il tuo listino prodotti</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigateTo("importa-prodotti")} className="cursor-pointer">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Importa da File
          </Button>
          <Button onClick={() => navigateTo("aggiungi-prodotto")} className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi Prodotto
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <ProdottiDataTable
          data={prodotti}
          onDelete={handleDelete}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Pagina {currentPage} di {totalPages} - Totale: {totalProducts} prodotti
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || isLoading}
              >
                Precedente
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || isLoading}
              >
                Successiva
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Elimina Prodotto"
        description={`Sei sicuro di voler eliminare ${prodottoToDelete?.descrizione || "questo prodotto"}? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
        variant="destructive"
      />
    </div>
  )
}
