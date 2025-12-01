import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { GradientButton } from '@/app/components/GradientButton'
import { ArrowLeft, Pencil, Trash2, Mail, FileText, MapPin } from 'lucide-react'
import { useNavigation } from '@/app/context/NavigationContext'
import { ConfirmDialog } from '@/app/components/confirm-dialog'
import { QuotesDataTable } from '@/app/data-tables/quotes-data-table'
import type { Quote } from '@/app/types/quote' 
import type { Customer } from '@/app/types/customer' 
import { toast } from 'sonner'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useQuotesList } from '../hooks/use-quotes-list'

export default function CustomerDetail() {

    const {
      handleView,
      handleEdit,
      handleGeneratePDF,
      handleSendEmail,
      handleDelete,
    } = useQuotesList()

  const { navigateTo, params } = useNavigation()
  const queryClient = useQueryClient()
  const customer = params.customer as Customer 

  const [customerDeleteDialogOpen, setCustomerDeleteDialogOpen] = useState(false)
  const [quoteDeleteDialogOpen, setQuoteDeleteDialogOpen] = useState(false)
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null)

  const {
    data: quotes,
    isLoading: isQuotesLoading,
  } = useQuery({
    queryKey: ['quotes', customer.id],
    queryFn: () => window.conveyor.quotes.getByCustomerId(customer.id),
    enabled: !!customer, 
    initialData: [],
  })


  const deleteCustomerMutation = useMutation({
    mutationFn: (id: number) => window.conveyor.customers.delete(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Cliente eliminato con successo')
        queryClient.invalidateQueries({ queryKey: ['customers'] })
        navigateTo('customers')
      } else {
        toast.error("Errore nell'eliminazione del cliente", {
          description: result.error,
        })
      }
    },
    onError: (err: Error) => {
      toast.error('Errore di rete', { description: err.message })
    },
  })

  const deleteQuoteMutation = useMutation({
    mutationFn: (id: number) => window.conveyor.quotes.delete(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Preventivo eliminato con successo')
        queryClient.invalidateQueries({ queryKey: ['quotes', customer.id] })
      } else {
        toast.error("Errore nell'eliminazione del preventivo", {
          description: result.error,
        })
      }
    },
    onError: (err: Error) => {
      toast.error('Errore di rete', { description: err.message })
    },
  })

  const handleDeleteCustomer = () => {
    setCustomerDeleteDialogOpen(true)
  }

  const confirmCustomerDelete = () => {
    if (!customer?.id) return
    deleteCustomerMutation.mutate(customer.id)
    setCustomerDeleteDialogOpen(false)
  }

  const confirmQuoteDelete = () => {
    if (!quoteToDelete?.id) return
    deleteQuoteMutation.mutate(quoteToDelete.id)
    setQuoteDeleteDialogOpen(false)
    setQuoteToDelete(null)
  }

  const getInitials = () => {
    return customer.businessName
      .split(' ')
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }

  if (!customer) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Cliente non esistente</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('customers')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dettaglio Cliente</h1>
            <p className="text-muted-foreground mt-1">Visualizza e gestisci le informazioni del cliente</p>
          </div>
        </div>
        <div className="flex gap-2">
          <GradientButton size="sm" onClick={() => navigateTo('create-quote', { customerId: customer.id })} />
          <Button variant="outline" size="sm" onClick={() => navigateTo('customer-update', { customer: customer })}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifica
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDeleteCustomer}
            disabled={deleteCustomerMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteCustomerMutation.isPending ? 'Eliminazione...' : 'Elimina'}
          </Button>
        </div>
      </div>

      {/* Customer Detail Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                { getInitials() }
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{customer.businessName}</CardTitle>
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
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>

            {/* VAT Number */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Partita IVA</p>
                <p className="font-medium">{customer.vatNumber}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Indirizzo</p>
                <p className="font-medium">{customer.address || 'Non specificato'}</p>
                {(customer.zipCode || customer.city) && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {customer.zipCode} {customer.city}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Section */}
      <Card>
        <CardContent className="pt-6">
          {isQuotesLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Caricamento preventivi...</p>
            </div>
          ) : quotes.length > 0 ? (
            <QuotesDataTable
              data={quotes}
              onView={handleView}
              onEdit={handleEdit}
              onGeneratePDF={handleGeneratePDF}
              onSendEmail={handleSendEmail}
              onDelete={handleDelete}
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
              <GradientButton size="lg" onClick={() => navigateTo('create-quote', { customerId: customer.id })} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Delete Dialog */}
      <ConfirmDialog
        open={customerDeleteDialogOpen}
        onOpenChange={setCustomerDeleteDialogOpen}
        onConfirm={confirmCustomerDelete}
        title="Elimina Cliente"
        description={`Sei sicuro di voler eliminare ${
          customer?.businessName || 'questo cliente'
        }? Questa azione non può essere annullata.`}
        confirmText={deleteCustomerMutation.isPending ? 'Eliminazione...' : 'Elimina'}
        cancelText="Annulla"
        variant="destructive"
      />

      <ConfirmDialog
        open={quoteDeleteDialogOpen}
        onOpenChange={setQuoteDeleteDialogOpen}
        onConfirm={confirmQuoteDelete}
        title="Elimina Preventivo"
        description={`Sei sicuro di voler eliminare questo preventivo? Questa azione non può essere annullata.`}
        confirmText={deleteQuoteMutation.isPending ? 'Eliminazione...' : 'Elimina'}
        cancelText="Annulla"
        variant="destructive"
      />
    </div>
  )
}
