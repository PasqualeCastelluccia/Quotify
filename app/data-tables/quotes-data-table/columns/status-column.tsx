import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/app/components/ui/badge'
import type { Quote } from '@/app/types/quote' 

const getStatusBadge = (status: string) => {
  const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    draft: { label: 'Bozza', variant: 'secondary' },
    sent: { label: 'Inviato', variant: 'default' },
    accepted: { label: 'Accettato', variant: 'outline' },
    rejected: { label: 'Rifiutato', variant: 'destructive' },
  }

  const config = variants[status] || { label: status, variant: 'secondary' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export const statusColumn: ColumnDef<Quote> = {
  accessorKey: 'status',
  header: () => <div className="text-center">Stato</div>,
  cell: ({ row }) => <div className="text-center">{getStatusBadge(row.getValue('status'))}</div>,
}
