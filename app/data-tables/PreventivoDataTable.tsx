import * as React from "react"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { RigaPreventivo } from "@/app/types/preventivo"
import { SelezioneProdottoDialog } from "@/app/components/SelezioneProdottoDialog"
import { Prodotto } from "@/app/types/prodotto"

interface PreventivoDataTableProps {
  data: RigaPreventivo[]
  onDataChange: (data: RigaPreventivo[]) => void
}

// Funzione per calcolare il netto unitario dopo gli sconti
function calcolaNettoUnitario(listinoCad: number, sc1: number, sc2: number, sc3: number): number {
  let prezzo = listinoCad
  if (sc1 > 0) prezzo = prezzo - (prezzo * sc1 / 100)
  if (sc2 > 0) prezzo = prezzo - (prezzo * sc2 / 100)
  if (sc3 > 0) prezzo = prezzo - (prezzo * sc3 / 100)
  return Number(prezzo.toFixed(2))
}

export function PreventivoDataTable({ data, onDataChange }: PreventivoDataTableProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingRow, setEditingRow] = React.useState<RigaPreventivo | null>(null)

  // Funzione per aggiungere un prodotto dalla selezione
  const handleSelectProdotto = (prodotto: Prodotto, config: { quantita: number, um: string, sc1: number, sc2: number, sc3: number }) => {
    // Calcola netto unitario con gli sconti
    let nettoUnitario = prodotto.prezzo
    if (config.sc1 > 0) nettoUnitario = nettoUnitario - (nettoUnitario * config.sc1 / 100)
    if (config.sc2 > 0) nettoUnitario = nettoUnitario - (nettoUnitario * config.sc2 / 100)
    if (config.sc3 > 0) nettoUnitario = nettoUnitario - (nettoUnitario * config.sc3 / 100)
    nettoUnitario = Number(nettoUnitario.toFixed(2))

    const totListinoRiga = Number((config.quantita * prodotto.prezzo).toFixed(2))
    const nettoRiga = Number((config.quantita * nettoUnitario).toFixed(2))

    // Se siamo in modalità modifica, aggiorna la riga esistente
    if (editingRow) {
      const updatedData = data.map(row => {
        if (row.id === editingRow.id) {
          return {
            ...row,
            quantita: config.quantita,
            um: config.um,
            sc1: config.sc1,
            sc2: config.sc2,
            sc3: config.sc3,
            totListinoRiga: totListinoRiga,
            nettoUnitario: nettoUnitario,
            nettoRiga: nettoRiga,
          }
        }
        return row
      })
      onDataChange(updatedData)
      setEditingRow(null)
    } else {
      // Altrimenti aggiungi una nuova riga
      const newRow: RigaPreventivo = {
        id: Date.now().toString(),
        codice: prodotto.codice,
        misura: prodotto.misura,
        descrizione: prodotto.descrizione,
        um: config.um,
        quantita: config.quantita,
        listinoCad: prodotto.prezzo,
        totListinoRiga: totListinoRiga,
        sc1: config.sc1,
        sc2: config.sc2,
        sc3: config.sc3,
        nettoUnitario: nettoUnitario,
        nettoRiga: nettoRiga,
      }
      onDataChange([...data, newRow])
    }
  }

  // Funzione per aprire il dialog di selezione prodotto
  const openSelezioneProdotto = () => {
    setEditingRow(null)
    setDialogOpen(true)
  }

  // Funzione per modificare una riga esistente
  const handleRowClick = (row: RigaPreventivo) => {
    setEditingRow(row)
    setDialogOpen(true)
  }

  // Funzione per eliminare una riga
  const deleteRow = (rowId: string) => {
    onDataChange(data.filter(row => row.id !== rowId))
  }

  const columns: ColumnDef<RigaPreventivo>[] = [
    {
      accessorKey: "codice",
      header: "Codice",
      size: 80,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          {row.original.codice}
        </div>
      ),
    },
    {
      accessorKey: "misura",
      header: "Misura",
      size: 70,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          {row.original.misura}
        </div>
      ),
    },
    {
      accessorKey: "descrizione",
      header: "Descrizione",
      size: 200,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-2 py-1 text-center break-words whitespace-normal">
          {row.original.descrizione}
        </div>
      ),
    },
    {
      accessorKey: "um",
      header: "U.M",
      size: 55,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          {row.original.um}
        </div>
      ),
    },
    {
      accessorKey: "quantita",
      header: "Q.tà",
      size: 60,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          {row.original.quantita}
        </div>
      ),
    },
    {
      accessorKey: "listinoCad",
      header: "List. Cad.",
      size: 75,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          €{row.original.listinoCad.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "totListinoRiga",
      header: "Tot. List.",
      size: 75,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          €{row.original.totListinoRiga.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "sc1",
      header: "SC1%",
      size: 60,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          {row.original.sc1}%
        </div>
      ),
    },
    {
      accessorKey: "sc2",
      header: "SC2%",
      size: 60,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          {row.original.sc2}%
        </div>
      ),
    },
    {
      accessorKey: "sc3",
      header: "SC3%",
      size: 60,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          {row.original.sc3}%
        </div>
      ),
    },
    {
      accessorKey: "nettoUnitario",
      header: "Netto Un.",
      size: 75,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          €{row.original.nettoUnitario.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "nettoRiga",
      header: "Netto Riga",
      size: 85,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full text-xs px-1">
          €{row.original.nettoRiga.toFixed(2)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 40,
      cell: ({ row }) => (
        <div className="flex items-center justify-center h-full">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => deleteRow(row.original.id)}
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Calcola i totali
  const subtotale = data.reduce((acc, row) => acc + row.nettoRiga, 0)
  const iva = subtotale * 0.22 // 22% IVA
  const totale = subtotale + iva

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <Button onClick={openSelezioneProdotto} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Riga
        </Button>
      </div>

      {/* Table */}
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/20 h-12 cursor-pointer" onClick={() => handleRowClick(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="p-0 border-r border-b h-12"
                      onClick={(e) => {
                        // Non propagare il click se clicco sul bottone elimina
                        if (cell.column.id === "actions") {
                          e.stopPropagation()
                        }
                      }}
                    >
                      <div className={cell.column.id === "descrizione" ? "" : "h-12"}>
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

      {/* Totali */}
      <div className="w-full space-y-2 mt-4 pt-4 border-t">
        <div className="flex justify-between items-center text-base">
          <span className="text-muted-foreground">Subtotale:</span>
          <span className="font-semibold">€{subtotale.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="text-muted-foreground">IVA (22%):</span>
          <span className="font-semibold">€{iva.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Totale:</span>
            <span className="text-2xl font-bold text-primary">€{totale.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Dialog per la selezione del prodotto */}
      <SelezioneProdottoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelectProdotto={handleSelectProdotto}
        editMode={!!editingRow}
        initialData={editingRow ? {
          codice: editingRow.codice,
          misura: editingRow.misura,
          descrizione: editingRow.descrizione,
          prezzo: editingRow.listinoCad,
          quantita: editingRow.quantita,
          um: editingRow.um,
          sc1: editingRow.sc1,
          sc2: editingRow.sc2,
          sc3: editingRow.sc3,
        } : undefined}
      />
    </div>
  )
}
