import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search, Pencil, Trash2, MoreVertical, Eye, FileText, Mail } from "lucide-react"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Preventivo } from "@/app/types/preventivo"

interface PreventiviDataTableProps {
  data: Preventivo[]
  onView?: (preventivo: Preventivo) => void
  onEdit?: (preventivo: Preventivo) => void
  onGeneratePDF?: (preventivo: Preventivo) => void
  onSendEmail?: (preventivo: Preventivo) => void
  onDelete?: (preventivo: Preventivo) => void
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    draft: { label: "Bozza", variant: "secondary" },
    sent: { label: "Inviato", variant: "default" },
    accepted: { label: "Accettato", variant: "outline" },
    rejected: { label: "Rifiutato", variant: "destructive" },
  }

  const config = variants[status] || { label: status, variant: "secondary" }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function PreventiviDataTable({
  data,
  onView,
  onEdit,
  onGeneratePDF,
  onSendEmail,
  onDelete,
}: PreventiviDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const columns: ColumnDef<Preventivo>[] = [
    {
      accessorKey: "numero",
      header: "Numero",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono font-semibold">
          {row.getValue("numero")}
        </Badge>
      ),
    },
    {
      accessorKey: "data",
      header: "Data",
      cell: ({ row }) => {
        const date = new Date(row.getValue("data"))
        return <div className="font-medium">{date.toLocaleDateString('it-IT')}</div>
      },
    },
    {
      accessorKey: "clienteBusinessName",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("clienteBusinessName")}</div>
      ),
    },
    {
      accessorKey: "total",
      header: "Totale",
      cell: ({ row }) => {
        const total = parseFloat(row.getValue("total"))
        const formatted = new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        }).format(total)
        return <div className="font-semibold text-center">{formatted}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Stato",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const preventivo = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onGeneratePDF?.(preventivo)}
                className="bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:text-white focus:text-white hover:from-slate-800 hover:to-slate-900 focus:from-slate-800 focus:to-slate-900 font-bold cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4 stroke-[2.5]" />
                Genera PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSendEmail?.(preventivo)}
                className="cursor-pointer"
              >
                <Mail className="mr-2 h-4 w-4" />
                Invia Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView?.(preventivo)}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizza
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(preventivo)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifica
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(preventivo)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca preventivi..."
            value={(table.getColumn("numero")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("numero")?.setFilterValue(event.target.value)
            }
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nessun preventivo trovato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Precedente
          </Button>
          <div className="text-sm">
            Pagina {table.getState().pagination.pageIndex + 1} di{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Successiva
          </Button>
        </div>
      </div>
    </div>
  )
}
