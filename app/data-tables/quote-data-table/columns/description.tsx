import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'

export const descriptionColumn: ColumnDef<QuoteItemUI> = {
  accessorKey: 'description',
  header: 'Descrizione',
  size: 200,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full text-xs px-2 py-1 text-center break-words whitespace-normal">
      {row.original.description}
    </div>
  ),
}
