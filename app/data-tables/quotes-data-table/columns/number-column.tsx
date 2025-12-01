import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/app/components/ui/badge'
import type { Quote } from '@/app/types/quote' 

export const numberColumn: ColumnDef<Quote> = {
  accessorKey: 'number',
  header: () => <div className="text-center">Numero</div>,
  cell: ({ row }) => (
    <div className="text-center">
      <Badge variant="outline" className="font-mono font-semibold">
        {row.getValue('number')}
      </Badge>
    </div>
  ),
}
