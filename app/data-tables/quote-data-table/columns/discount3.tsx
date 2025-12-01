import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'


export const discount3Column: ColumnDef<QuoteItemUI> = {
  accessorKey: 'discount3',
  header: 'SC3%',
  size: 60,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full text-xs px-1">{row.original.discount3}%</div>
  ),
}
