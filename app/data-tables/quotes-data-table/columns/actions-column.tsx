import { ColumnDef } from '@tanstack/react-table'
import { Pencil, MoreVertical, Eye, FileText, Mail } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import type { Quote } from '@/app/types/quote'

interface ActionsColumnProps {
  onView?: (quote: Quote) => void
  onEdit?: (quote: Quote) => void
  onGeneratePDF?: (quote: Quote) => void
  onSendEmail?: (quote: Quote) => void
}

export const createActionsColumn = ({
  onView,
  onEdit,
  onGeneratePDF,
  onSendEmail,
}: ActionsColumnProps): ColumnDef<Quote> => ({
  id: 'actions',
  header: '',
  cell: ({ row }) => {
    const quote = row.original

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onGeneratePDF?.(quote)}
            className="bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:text-white focus:text-white hover:from-slate-800 hover:to-slate-900 focus:from-slate-800 focus:to-slate-900 font-bold cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4 stroke-[2.5]" />
            Genera PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSendEmail?.(quote)} className="cursor-pointer">
            <Mail className="mr-2 h-4 w-4" />
            Invia Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onView?.(quote)}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizza
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit?.(quote)}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifica
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
})
