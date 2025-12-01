import type { Customer } from '@/app/types/customer'
import { CustomersDataTable } from '@/app/data-tables/customer-data-table'
import { Button } from '@/app/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import { useNavigation } from '@/app/context/NavigationContext'
import { ConfirmDialog } from '@/app/components/confirm-dialog'
import { useState } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

export default function Customers() {
  const { navigateTo } = useNavigation()
  const queryClient = useQueryClient()

  const {
    data: customers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: () => window.conveyor.customers.getAll(),
    initialData: [],
  })

  const deleteMutation = useMutation({
    mutationFn: (customerId: number) =>
      window.conveyor.customers.delete(customerId),
    onSuccess: (result) => {
      if (result.success) {
        console.log('Customer deleted, refetching list...')
        queryClient.invalidateQueries({ queryKey: ['customers'] })
      } else {
        console.error('API Error deleting customer:', result.error)
      }
    },
    onError: (err: Error) => {
      console.error('Network error deleting customer:', err)
    },
  })

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)

  const handleView = (customer: Customer) => {
    navigateTo('customer', {
      customer: customer,
    })
  }

  const handleEdit = (customer: Customer) => {
    navigateTo('customer-update', {
      customer: customer,
    })
  }

  const handleSendQuote = (customer: Customer) => {
    navigateTo('create-quote', {
      customerId: customer.id,
    })
  }

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!customerToDelete?.id) return

    deleteMutation.mutate(customerToDelete.id)

    setDeleteDialogOpen(false)
    setCustomerToDelete(null)
  }

  if (error) {
    return (
      <div className="p-6">
        Errore nel caricamento dei clienti: {error.message}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateTo('dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clienti</h1>
            <p className="text-muted-foreground mt-2">Gestisci i tuoi clienti</p>
          </div>
        </div>
        <Button
          onClick={() => navigateTo('customer-create')}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Aggiungi Cliente
        </Button>
      </div>

      {isLoading ? (
        <div>Caricamento dati...</div>
      ) : (
        <CustomersDataTable
          data={customers}
          onView={handleView}
          onEdit={handleEdit}
          onSendQuote={handleSendQuote}
          onDelete={handleDelete}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Elimina Cliente"
        description={`Sei sicuro di voler eliminare ${
          customerToDelete?.businessName || 'questo cliente'
        }? Questa azione non può essere annullata.`}
        confirmText={deleteMutation.isPending ? 'Eliminazione...' : 'Elimina'}
        cancelText="Annulla"
        variant="destructive"
      />
    </div>
  )
}