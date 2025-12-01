import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'

export const unitPriceColumn: ColumnDef<QuoteItemUI> = {
  accessorKey: 'unitPrice',
  header: 'List. Cad.',
  size: 75,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full text-xs px-1">€{row.original.unitPrice.toFixed(2)}</div>
  ),
}
