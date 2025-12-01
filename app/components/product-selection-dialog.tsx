import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Card } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { Search, Package, ArrowLeft, Plus } from 'lucide-react'
import { Product } from '@/app/types/product'
import { QuoteItemUI } from '@/app/types/quote-item'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { useProductSelection } from '@/app/hooks/use-product-selection'

interface ProductSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProduct: (product: Product, config: QuoteItemUI) => void
  editMode?: boolean
  initialData?: QuoteItemUI
}

function highlightText(text: string, searchTerm: string) {
  if (!searchTerm || !text) return <span>{text}</span>

  const regex = new RegExp(`(${searchTerm})`, 'gi')
  const parts = text.split(regex)

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 font-semibold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  )
}

export function ProductSelectionDialog({
  open,
  onOpenChange,
  onSelectProduct,
  editMode = false,
  initialData,
}: ProductSelectionDialogProps) {
  const {
    searchTerm,
    setSearchTerm,
    products,
    isLoading,
    step,
    selectedProduct,
    quantity,
    setQuantity,
    unit,
    setUnit,
    discount1,
    setDiscount1,
    discount2,
    setDiscount2,
    discount3,
    setDiscount3,
    totalListPrice,
    netUnitPrice,
    netLineTotal,
    selectProduct,
    goBackToSearch,
    resetToSearch,
    getConfiguration,
  } = useProductSelection({ open, editMode, initialData })

  const handleAddProduct = () => {
    if (!selectedProduct) return
    onSelectProduct(selectedProduct, getConfiguration())
    handleClose()
  }

  const handleClose = () => {
    resetToSearch()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-7xl max-h-[85vh] flex flex-col">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Seleziona Prodotto</DialogTitle>
              <DialogDescription>Cerca un prodotto per codice o descrizione (minimo 3 caratteri)</DialogDescription>
            </DialogHeader>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca per codice o descrizione..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {searchTerm.length > 0 && searchTerm.length < 3 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Inserisci almeno 3 caratteri per iniziare la ricerca
                </div>
              )}

              {searchTerm.length >= 3 && isLoading && (
                <div className="text-center py-8 text-muted-foreground text-sm">Ricerca in corso...</div>
              )}

              {searchTerm.length >= 3 && !isLoading && products.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">Nessun prodotto trovato</div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 cursor-pointer hover:bg-muted/50 hover:border-primary transition-all"
                    onClick={() => selectProduct(product)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-2xl font-bold text-primary truncate">
                            {highlightText(product.code, searchTerm)}
                          </span>
                        </div>

                        <div className="bg-muted/30 rounded-md p-3 border-l-2 border-primary/30">
                          <p className="text-sm font-medium text-foreground leading-relaxed">
                            {highlightText(product.description || '', searchTerm)}
                          </p>
                        </div>

                        {product.measure && (
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="text-xs font-medium">
                              Misura: {highlightText(product.measure, searchTerm)}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-muted-foreground mb-1">Prezzo</div>
                        <div className="text-xl font-bold text-primary whitespace-nowrap">
                          €{product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Modifica Riga' : 'Configura Prodotto'}</DialogTitle>
              <DialogDescription>
                {editMode
                  ? 'Modifica quantità e sconti della riga'
                  : 'Imposta quantità e sconti per il prodotto selezionato'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-6">
              {selectedProduct && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="text-xl font-bold text-primary">{selectedProduct.code}</span>
                      </div>
                      <p className="text-sm text-foreground">{selectedProduct.description}</p>
                      {selectedProduct.measure && (
                        <Badge variant="secondary" className="text-xs">
                          Misura: {selectedProduct.measure}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Listino Cad.</div>
                      <div className="text-2xl font-bold text-primary">€{selectedProduct.price.toFixed(2)}</div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantita" className="mb-2 block">
                        Quantità <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="quantita"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1
                          setQuantity(Math.max(1, value))
                        }}
                        step="1"
                        min="1"
                        className="!h-12 w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="um" className="mb-2 block">
                        U.M. <span className="text-red-500">*</span>
                      </Label>
                      <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger className="!h-12 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PZ">PZ (pezzi)</SelectItem>
                          <SelectItem value="mt">mt (metri)</SelectItem>
                          <SelectItem value="lt">lt (litri)</SelectItem>
                          <SelectItem value="mq">mq (metri quadri)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Sconti (%)</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="sc1" className="text-xs text-muted-foreground mb-1 block">
                          SC1
                        </Label>
                        <Input
                          id="sc1"
                          type="number"
                          value={discount1}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            setDiscount1(Math.min(Math.max(value, 0), 100))
                          }}
                          step="0.1"
                          min="0"
                          max="100"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sc2" className="text-xs text-muted-foreground mb-1 block">
                          SC2
                        </Label>
                        <Input
                          id="sc2"
                          type="number"
                          value={discount2}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            setDiscount2(Math.min(Math.max(value, 0), 100))
                          }}
                          step="0.1"
                          min="0"
                          max="100"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sc3" className="text-xs text-muted-foreground mb-1 block">
                          SC3
                        </Label>
                        <Input
                          id="sc3"
                          type="number"
                          value={discount3}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            setDiscount3(Math.min(Math.max(value, 0), 100))
                          }}
                          step="0.1"
                          min="0"
                          max="100"
                          className="text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <Card className="p-4 bg-muted/20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-medium pb-3 border-b">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">{selectedProduct?.code}</span>
                          <span className="text-muted-foreground">×{quantity}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={discount1 > 0 ? 'text-green-600 font-semibold' : 'text-muted-foreground'}>
                            SC1: {discount1}%
                          </span>
                          <span className={discount2 > 0 ? 'text-green-600 font-semibold' : 'text-muted-foreground'}>
                            SC2: {discount2}%
                          </span>
                          <span className={discount3 > 0 ? 'text-green-600 font-semibold' : 'text-muted-foreground'}>
                            SC3: {discount3}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Listino Cad.</span>
                          <span className="font-medium">€{selectedProduct?.price.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Tot. Listino</span>
                          <span className="font-medium">€{totalListPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Netto Unitario</span>
                          <span className="font-medium">€{netUnitPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm pt-2 border-t">
                          <span className="text-muted-foreground">Netto Riga</span>
                          <span className="font-medium">€{netLineTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              {!editMode && (
                <Button variant="outline" onClick={goBackToSearch}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Indietro
                </Button>
              )}
              <Button onClick={handleAddProduct} size="lg" className={editMode ? 'ml-auto' : ''}>
                <Plus className="h-4 w-4 mr-2" />
                {editMode ? 'Salva Modifiche' : 'Aggiungi al Preventivo'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
