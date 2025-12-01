import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'


export const quantityColumn: ColumnDef<QuoteItemUI> = {
  accessorKey: 'quantity',
  header: 'Q.tà',
  size: 60,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full text-xs px-1">{row.original.quantity}</div>
  ),
}
