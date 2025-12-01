import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'

export const codeColumn: ColumnDef<QuoteItemUI> = {
  accessorKey: 'code',
  header: 'Codice',
  size: 80,
  cell: ({ row }) => <div className="flex items-center justify-center h-full text-xs px-1">{row.original.code}</div>,
}
