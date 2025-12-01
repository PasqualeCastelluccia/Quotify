import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Product } from '@/app/types/product'
import { ProductsDataTable } from '@/app/data-tables/ProductsDataTable'
import { Button } from '@/app/components/ui/button'
import { Plus, ArrowLeft, FileSpreadsheet } from 'lucide-react'
import { useNavigation } from '@/app/context/NavigationContext'
import { ConfirmDialog } from '@/app/components/confirm-dialog'

// Define a type for the paginated response structure
type PaginatedProductsResponse = {
  data: Product[]
  totalPages: number
  total: number
}

export default function Products() {
  const { navigateTo } = useNavigation()
  const queryClient = useQueryClient()

  // State for UI controls
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // State for the delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const pageSize = 10

  // --- React Query ---

  // Query to fetch paginated products
  // The query key includes dependencies: 'products', currentPage, and searchTerm
  const { data: paginatedData, isLoading } = useQuery<PaginatedProductsResponse>({
    queryKey: ['products', currentPage, searchTerm],
    queryFn: () => window.conveyor.products.getPaginated(currentPage, pageSize, searchTerm),
  })

  // Extract data for the component
  const products = paginatedData?.data || []
  const totalPages = paginatedData?.totalPages || 0
  const totalProducts = paginatedData?.total || 0

  // Mutation to delete a product
  const deleteMutation = useMutation({
    mutationFn: (productId: number) => window.conveyor.products.delete(productId),
    onSuccess: (result) => {
      if (result.success) {
        // If the last item on a page was deleted, go to the previous page
        if (products.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          // Otherwise, just refetch the current page
          queryClient.invalidateQueries({ queryKey: ['products'] })
        }
      } else {
        console.error("Errore nell'eliminazione:", result.error)
      }
    },
    onError: (error) => {
      // Fix: Changed single quotes to double quotes to handle the apostrophe
      console.error("Errore nell'eliminazione del prodotto:", error)
    },
    onSettled: () => {
      // Always close the dialog and clear the selected product
      setProductToDelete(null)
      setDeleteDialogOpen(false)
    },
  })

  // --- Event Handlers ---

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // Reset to page 1 when starting a new search
    setCurrentPage(1)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    // We only trigger the mutation if productToDelete and its id exist
    if (productToDelete?.id) {
      deleteMutation.mutate(productToDelete.id)
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

  const isPaginating = isLoading || deleteMutation.isPending

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('dashboard')} className="cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prodotti</h1>
            <p className="text-muted-foreground mt-2">Gestisci il tuo listino prodotti</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigateTo('import-products-from-file')} className="cursor-pointer">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Importa da File
          </Button>
          <Button onClick={() => navigateTo('create-product')} className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi Prodotto
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <ProductsDataTable
          data={products}
          onDelete={handleDeleteClick}
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
                disabled={currentPage === 1 || isPaginating}
              >
                Precedente
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || isPaginating}
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
        onConfirm={handleConfirmDelete}
        title="Elimina Prodotto"
        description={`Sei sicuro di voler eliminare ${productToDelete?.code || 'questo prodotto'}? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
        variant="destructive"
      />
    </div>
  )
}

