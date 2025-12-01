import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'


export const measureColumn: ColumnDef<QuoteItemUI> = {
  accessorKey: 'measure',
  header: 'Misura',
  size: 70,
  cell: ({ row }) => <div className="flex items-center justify-center h-full text-xs px-1">{row.original.measure}</div>,
}
