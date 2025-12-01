import { ColumnDef } from '@tanstack/react-table'
import type { Quote } from '@/app/types/quote' 

export const totalColumn: ColumnDef<Quote> = {
  accessorKey: 'total',
  header: () => <div className="text-center">Totale</div>,
  cell: ({ row }) => {
    const total = parseFloat(row.getValue('total'))
    const formatted = new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(total)
    return <div className="font-semibold text-center">{formatted}</div>
  },
}
