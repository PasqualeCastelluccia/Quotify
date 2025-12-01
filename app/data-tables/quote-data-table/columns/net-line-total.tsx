import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'


export const netLineTotalColumn: ColumnDef<QuoteItemUI> = {
  accessorKey: 'netLineTotal',
  header: 'Netto Riga',
  size: 85,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full text-xs px-1">€{row.original.netLineTotal.toFixed(2)}</div>
  ),
}
