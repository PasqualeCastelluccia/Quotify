import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle, AlertTriangle } from "lucide-react"
import { useNavigation } from "@/app/context/NavigationContext"
import { Badge } from "@/app/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"

interface ColumnMapping {
  codice?: string
  descrizione?: string
  misura?: string
  prezzo?: string
}

export default function ImportaProdotti() {
  const { navigateTo } = useNavigation()
  const [step, setStep] = useState<'upload' | 'mapping' | 'completed'>('upload')
  const [filePath, setFilePath] = useState<string>('')
  const [columns, setColumns] = useState<string[]>([])
  const [columnLetters, setColumnLetters] = useState<string[]>([])
  const [previewData, setPreviewData] = useState<any[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const handleSelectFile = async () => {
    try {
      setIsLoading(true)
      setError('')
      const result = await window.conveyor.import.selectExcel()

      if (result.success && result.filePath) {
        setFilePath(result.filePath)
        setColumns(result.columns || [])
        setColumnLetters(result.columnLetters || [])
        setPreviewData(result.previewData || [])
        setTotalRows(result.totalRows || 0)
        setStep('mapping')
      } else {
        setError(result.error || 'Errore nella selezione del file')
      }
    } catch (error) {
      setError('Errore imprevisto durante il caricamento del file')
      console.error('Errore:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (!filePath) return

    try {
      const result = await window.conveyor.import.importProducts(filePath, columnMapping)

      if (result.success) {
        // Navigate directly to products list after successful import
        navigateTo('prodotti')
      } else {
        setError(result.error || 'Errore nell\'importazione')
      }
    } catch (error) {
      setError('Errore imprevisto durante l\'importazione')
      console.error('Errore:', error)
    }
  }

  const updateMapping = (field: keyof ColumnMapping, value: string) => {
    // If value is empty, set to undefined
    if (value === '') {
      setColumnMapping(prev => ({
        ...prev,
        [field]: undefined
      }))
      return
    }

    // Find the column index and use the correct letter from backend
    const colIndex = columns.indexOf(value)
    if (colIndex !== -1 && columnLetters[colIndex]) {
      const mappedValue = `${value}|${columnLetters[colIndex]}`
      setColumnMapping(prev => ({
        ...prev,
        [field]: mappedValue
      }))
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateTo("prodotti")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Importa Prodotti da File</h1>
          <p className="text-muted-foreground mt-2">Carica un file e mappa le colonne ai campi prodotto</p>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Seleziona File</CardTitle>
            <CardDescription>Carica un file (.xlsx, .xls, .csv) contenente i prodotti da importare</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileSpreadsheet className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-6">Clicca per selezionare un file</p>
            <Button onClick={handleSelectFile} disabled={isLoading}>
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? 'Caricamento...' : 'Seleziona File'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Dialog */}
      <AlertDialog open={!!error} onOpenChange={(open) => !open && setError('')}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Attenzione
            </AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError('')}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Step 2: Mapping */}
      {step === 'mapping' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Informazioni File</CardTitle>
              <CardDescription>Il file contiene {totalRows} righe di dati</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <strong>File:</strong> {filePath.split('/').pop()}
              </div>
              <div className="text-sm mt-2">
                <strong>Colonne trovate:</strong> {columns.join(', ')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mappa le Colonne</CardTitle>
              <CardDescription>Seleziona quale colonna dell'Excel corrisponde a ogni campo del prodotto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Codice - Obbligatorio */}
                <div className="space-y-2">
                  <Label htmlFor="codice">
                    Codice <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={columnMapping.codice?.split('|')[0] || ''}
                    onValueChange={(value) => updateMapping('codice', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-- Seleziona colonna --" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prezzo - Obbligatorio */}
                <div className="space-y-2">
                  <Label htmlFor="prezzo">
                    Prezzo <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={columnMapping.prezzo?.split('|')[0] || ''}
                    onValueChange={(value) => updateMapping('prezzo', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-- Seleziona colonna --" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Descrizione */}
                <div className="space-y-2">
                  <Label htmlFor="descrizione">Descrizione</Label>
                  <Select
                    value={columnMapping.descrizione?.split('|')[0] || ''}
                    onValueChange={(value) => updateMapping('descrizione', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-- Seleziona colonna --" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Misura */}
                <div className="space-y-2">
                  <Label htmlFor="misura">Misura</Label>
                  <Select
                    value={columnMapping.misura?.split('|')[0] || ''}
                    onValueChange={(value) => updateMapping('misura', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-- Seleziona colonna --" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {previewData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Anteprima Dati</CardTitle>
                <CardDescription>Prime 5 righe del file</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    {/* Row 1: Column Letters (A, B, C...) */}
                    <TableRow>
                      {columns.map((_, idx) => (
                        <TableHead key={`letter-${idx}`} className="text-center text-xs font-semibold text-muted-foreground bg-muted/30">
                          {String.fromCharCode(65 + idx)}
                        </TableHead>
                      ))}
                    </TableRow>
                    {/* Row 2: Column Names */}
                    <TableRow>
                      {columns.map((col, idx) => (
                        <TableHead key={`name-${idx}`} className="font-medium">
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row: any, idx) => (
                      <TableRow key={idx}>
                        {columns.map((col, colIdx) => (
                          <TableCell key={colIdx}>{row[col]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setStep('upload')} disabled={isLoading}>
              Indietro
            </Button>
            <Button
              onClick={handleImport}
              disabled={!columnMapping.codice || !columnMapping.prezzo || isLoading}
            >
              Importa Prodotti
            </Button>
          </div>
        </>
      )}

    </div>
  )
}
