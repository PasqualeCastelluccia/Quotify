import * as React from 'react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import { QuoteItemUI } from '@/app/types/quote-item'
import { ProductSelectionDialog } from '@/app/components/product-selection-dialog'
import { Product } from '@/app/types/product'
import { codeColumn } from '@/app/data-tables/quote-data-table/columns/code'
import { measureColumn } from './columns/measure'
import { descriptionColumn } from './columns/description'
import { unitColumn } from './columns/unit'
import { quantityColumn } from './columns/quantity'
import { unitPriceColumn } from './columns/unit-price'
import { lineTotalColumn } from './columns/line-total'
import { discount1Column } from './columns/discount1'
import { discount2Column } from './columns/discount2'
import { discount3Column } from './columns/discount3'
import { createNetUnitPriceColumn } from './columns/net-unit-price'
import { netLineTotalColumn } from './columns/net-line-total'
import { createActionsColumn } from './columns/actions'

interface QuoteDataTableProps {
  rows: QuoteItemUI[]
  onAddRow: (product: Product, config: QuoteItemUI) => void
  onUpdateRow: (rowId: number, product: Product, config: QuoteItemUI) => void
  onDeleteRow: (rowId: number) => void
  onUpdateNetUnitPrice: (rowId: number, newNetPrice: number) => void
}

export function QuoteDataTable({ rows, onAddRow, onUpdateRow, onDeleteRow, onUpdateNetUnitPrice }: QuoteDataTableProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingRow, setEditingRow] = React.useState<QuoteItemUI | null>(null)

  const handleSelectProduct = (product: Product, config: QuoteItemUI) => {
    if (editingRow) {
      onUpdateRow(editingRow.id, product, config)
      setEditingRow(null)
    } else {
      onAddRow(product, config)
    }
  }

  const openProductSelection = () => {
    setEditingRow(null)
    setDialogOpen(true)
  }

  const handleRowClick = (row: QuoteItemUI) => {
    setEditingRow(row)
    setDialogOpen(true)
  }

  const columns = [
    codeColumn,
    measureColumn,
    descriptionColumn,
    unitColumn,
    quantityColumn,
    unitPriceColumn,
    lineTotalColumn,
    discount1Column,
    discount2Column,
    discount3Column,
    createNetUnitPriceColumn(onUpdateNetUnitPrice),
    netLineTotalColumn,
    createActionsColumn(onDeleteRow),
  ]

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const subtotal = rows.reduce((acc, row) => acc + row.netLineTotal, 0)
  const vat = subtotal * 0.22
  const total = subtotal + vat

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Button onClick={openProductSelection} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Riga
        </Button>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.getSize() }}
                    className="text-xs font-semibold py-2 px-1 bg-muted/50 border-r border-b text-center"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/20 h-12 cursor-pointer"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="p-0 border-r border-b h-12"
                      onClick={(e) => {
                        // Don't open dialog when clicking on editable cells or actions
                        if (cell.column.id === 'actions' || cell.column.id === 'netUnitPrice') {
                          e.stopPropagation()
                        }
                      }}
                    >
                      <div className={cell.column.id === 'description' ? '' : 'h-12'}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground border-b">
                  Nessuna riga presente. Clicca su "Aggiungi Riga" per iniziare.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full space-y-2 mt-4 pt-4 border-t">
        <div className="flex justify-between items-center text-base">
          <span className="text-muted-foreground">Subtotale:</span>
          <span className="font-semibold">€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="text-muted-foreground">IVA (22%):</span>
          <span className="font-semibold">€{vat.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Totale:</span>
            <span className="text-2xl font-bold text-primary">€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <ProductSelectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelectProduct={handleSelectProduct}
        editMode={!!editingRow}
        initialData={editingRow || undefined}
      />
    </div>
  )
}
