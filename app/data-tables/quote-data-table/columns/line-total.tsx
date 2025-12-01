import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'


export const lineTotalColumn: ColumnDef<QuoteItemUI> = {
  accessorKey: 'lineTotal',
  header: 'Tot. List.',
  size: 75,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full text-xs px-1">€{row.original.lineTotal.toFixed(2)}</div>
  ),
}
