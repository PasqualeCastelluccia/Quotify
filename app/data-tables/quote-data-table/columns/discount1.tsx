import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'


export const discount1Column: ColumnDef<QuoteItemUI> = {
  accessorKey: 'discount1',
  header: 'SC1%',
  size: 60,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full text-xs px-1">{row.original.discount1}%</div>
  ),
}
