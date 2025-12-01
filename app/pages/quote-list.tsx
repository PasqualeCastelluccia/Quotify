import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { Plus, ArrowLeft } from 'lucide-react'
import { useNavigation } from '@/app/context/NavigationContext'
import { QuotesDataTable } from '@/app/data-tables/quotes-data-table'
import { useQuotesList } from '@/app/hooks/use-quotes-list'

export default function QuotesList() {
  const { navigateTo } = useNavigation()
  const {
    quotes,
    loading,
    handleView,
    handleEdit,
    handleGeneratePDF,
    handleSendEmail,
  } = useQuotesList()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('dashboard')} className="cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Preventivi</h1>
            <p className="text-muted-foreground mt-2">Gestisci i tuoi preventivi</p>
          </div>
        </div>
        <Button onClick={() => navigateTo('create-quote')} className="cursor-pointer">
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
          <QuotesDataTable
            data={quotes}
            onView={handleView}
            onEdit={handleEdit}
            onGeneratePDF={handleGeneratePDF}
            onSendEmail={handleSendEmail}
          />
        )}
      </Card>
    </div>
  )
}
