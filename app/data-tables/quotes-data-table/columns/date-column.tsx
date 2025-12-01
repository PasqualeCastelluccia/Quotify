import { ColumnDef } from '@tanstack/react-table'
import type { Quote } from '@/app/types/quote' 

export const dateColumn: ColumnDef<Quote> = {
  accessorKey: 'date',
  header: () => <div className="text-center">Data</div>,
  cell: ({ row }) => {
    const date = new Date(row.getValue('date'))
    return <div className="font-medium text-center">{date.toLocaleDateString('it-IT')}</div>
  },
}
