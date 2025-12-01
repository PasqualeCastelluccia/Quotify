import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/app/components/ui/badge'
import type { Quote } from '@/app/types/quote'

export const revisionColumn: ColumnDef<Quote> = {
  accessorKey: 'revision',
  header: () => <div className="text-center">Rev.</div>,
  cell: ({ row }) => (
    <div className="text-center">
      <Badge variant="secondary" className="font-mono">
        {row.getValue('revision')}
      </Badge>
    </div>
  ),
}
