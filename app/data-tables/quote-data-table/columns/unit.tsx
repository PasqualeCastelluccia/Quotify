import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'


export const unitColumn: ColumnDef<QuoteItemUI> = {
  accessorKey: 'unit',
  header: 'U.M',
  size: 55,
  cell: ({ row }) => <div className="flex items-center justify-center h-full text-xs px-1">{row.original.unit}</div>,
}
