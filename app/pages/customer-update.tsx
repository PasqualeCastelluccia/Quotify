import { useEffect } from 'react'
import { type ClienteFormData } from '@/lib/validations/cliente'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ClienteForm from '@/app/forms/ClienteForm'
import { useNavigation } from '@/app/context/NavigationContext'
import { toast } from 'sonner'
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { Customer } from '@/app/types/customer' 

export default function CustomerUpdate() {
  const { navigateTo, params } = useNavigation()
  const queryClient = useQueryClient()
  
  const customer = params?.customer as Customer | undefined

  const updateMutation = useMutation({
    mutationFn: (data: ClienteFormData) => 
      window.conveyor.customers.update(customer!.id, data),
    
    onSuccess: (result, data) => {
      if (result.success) {
        toast.success('Cliente aggiornato con successo', {
          description: `${data.businessName} è stato aggiornato`,
        })
        
        queryClient.invalidateQueries({ queryKey: ['customers'] })
        queryClient.invalidateQueries({ queryKey: ['customer', customer!.id] })
        
        navigateTo('clienti')
      } else {
        toast.error("Errore nell'aggiornamento del cliente", {
          description: result.error || "Si è verificato un errore durante l'aggiornamento",
        })
      }
    },
    onError: (error: Error) => {
      toast.error('Errore imprevisto', {
        description: error.message || 'Si è verificato un errore imprevisto',
      })
    },
  })

  useEffect(() => {
    if (!customer) {
      toast.error('Errore', {
        description: 'Dati cliente non trovati',
      })
      navigateTo('clienti')
      return
    }
  }, [customer, navigateTo])

  const handleSubmit = (data: ClienteFormData) => {
    if (!customer) return 
    updateMutation.mutate(data)
  }

  if (!customer) {
    return null 
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigateTo('clienti')}>
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
          <CardDescription>
            Modifica i dettagli del cliente. I campi contrassegnati con * sono obbligatori.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClienteForm
            onSubmit={handleSubmit}
            defaultValues={{
              businessName: customer.businessName,
              email: customer.email,
              vatNumber: customer.vatNumber,
              address: customer.address || '',
              zipCode: customer.zipCode || '',
              city: customer.city || '',
            }}
            isEditMode
          />
        </CardContent>
      </Card>
    </div>
  )
}