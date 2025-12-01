import { ColumnDef } from '@tanstack/react-table'
import { QuoteItemUI } from '@/app/types/quote-item'
import { Button } from '@/app/components/ui/button'
import { Trash2 } from 'lucide-react'

export const createActionsColumn = (onDelete: (rowId: number) => void): ColumnDef<QuoteItemUI> => ({
  id: 'actions',
  header: '',
  size: 40,
  cell: ({ row }) => (
    <div className="flex items-center justify-center h-full">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(row.original.id)}>
        <Trash2 className="h-3 w-3 text-red-500" />
      </Button>
    </div>
  ),
})
