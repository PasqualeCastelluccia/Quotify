import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'


export const discount2Column: ColumnDef<QuoteItemUI> = {
  accessorKey: 'discount2',
  header: 'SC2%',
  size: 60,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full text-xs px-1">{row.original.discount2}%</div>
  ),
}
