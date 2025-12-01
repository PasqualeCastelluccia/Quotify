import { ColumnDef } from '@tanstack/react-table'
import type { Quote } from '@/app/types/quote' 

export const customerColumn: ColumnDef<Quote> = {
  accessorKey: 'customerBusinessName',
  header: () => <div className="text-center">Cliente</div>,
  cell: ({ row }) => <div className="font-semibold text-center">{row.getValue('customerBusinessName')}</div>,
}
