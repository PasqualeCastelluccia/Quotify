import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Card } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { Search, Package, Ruler, ArrowLeft, Plus } from "lucide-react"
import { Prodotto } from "@/app/types/prodotto"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

interface SelezioneProdottoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProdotto: (prodotto: Prodotto, config: { quantita: number, um: string, sc1: number, sc2: number, sc3: number }) => void
  editMode?: boolean
  initialData?: {
    codice: string
    misura?: string
    descrizione: string
    prezzo: number
    quantita: number
    um: string
    sc1: number
    sc2: number
    sc3: number
  }
}

// Funzione per evidenziare il testo che matcha con il termine di ricerca
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

export function SelezioneProdottoDialog({ open, onOpenChange, onSelectProdotto, editMode = false, initialData }: SelezioneProdottoDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Step 2: Configurazione prodotto
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedProdotto, setSelectedProdotto] = useState<Prodotto | null>(null)
  const [quantita, setQuantita] = useState(1)
  const [um, setUm] = useState("PZ")
  const [sc1, setSc1] = useState(0)
  const [sc2, setSc2] = useState(0)
  const [sc3, setSc3] = useState(0)

  // Aggiorna lo stato quando il dialog si apre in modalità modifica
  useEffect(() => {
    if (open && editMode && initialData) {
      setStep(2)
      setSelectedProdotto({
        id: 0,
        codice: initialData.codice,
        misura: initialData.misura,
        descrizione: initialData.descrizione,
        prezzo: initialData.prezzo,
        createdAt: 0,
        updatedAt: 0
      } as Prodotto)
      setQuantita(initialData.quantita)
      setUm(initialData.um)
      setSc1(initialData.sc1)
      setSc2(initialData.sc2)
      setSc3(initialData.sc3)
    } else if (open && !editMode) {
      // Reset per modalità aggiunta
      setStep(1)
      setSelectedProdotto(null)
      setQuantita(1)
      setUm("PZ")
      setSc1(0)
      setSc2(0)
      setSc3(0)
    }
  }, [open, editMode, initialData])

  // Effettua la ricerca quando cambia il termine di ricerca
  useEffect(() => {
    const searchProdotti = async () => {
      // Inizia la ricerca solo se ci sono almeno 3 caratteri
      if (searchTerm.length < 3) {
        setProdotti([])
        return
      }

      setIsLoading(true)
      try {
        const result = await window.conveyor.prodotti.getPaginated(1, 50, searchTerm)
        setProdotti(result.data)
      } catch (error) {
        console.error("Errore nella ricerca dei prodotti:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce della ricerca per evitare troppe chiamate
    const debounceTimer = setTimeout(() => {
      searchProdotti()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Calcoli in tempo reale
  const totListinoRiga = selectedProdotto ? quantita * selectedProdotto.prezzo : 0

  const calcolaNettoUnitario = () => {
    if (!selectedProdotto) return 0
    let prezzo = selectedProdotto.prezzo
    if (sc1 > 0) prezzo = prezzo - (prezzo * sc1 / 100)
    if (sc2 > 0) prezzo = prezzo - (prezzo * sc2 / 100)
    if (sc3 > 0) prezzo = prezzo - (prezzo * sc3 / 100)
    return Number(prezzo.toFixed(2))
  }

  const nettoUnitario = calcolaNettoUnitario()
  const nettoRiga = quantita * nettoUnitario

  // Quando clicchi su un prodotto, passa allo step 2
  const handleSelectProdottoCard = (prodotto: Prodotto) => {
    setSelectedProdotto(prodotto)
    setStep(2)
  }

  // Aggiungi il prodotto configurato alla tabella
  const handleAggiungiProdotto = () => {
    if (!selectedProdotto) return

    onSelectProdotto(selectedProdotto, { quantita, um, sc1, sc2, sc3 })

    // Chiudi e resetta
    handleClose()
  }

  // Torna indietro allo step 1
  const handleBack = () => {
    setStep(1)
    setSelectedProdotto(null)
    // Reset valori
    setQuantita(1)
    setUm("PZ")
    setSc1(0)
    setSc2(0)
    setSc3(0)
  }

  // Chiudi e resetta tutto
  const handleClose = () => {
    setStep(1)
    setSelectedProdotto(null)
    setSearchTerm("")
    setProdotti([])
    setQuantita(1)
    setUm("PZ")
    setSc1(0)
    setSc2(0)
    setSc3(0)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-7xl max-h-[85vh] flex flex-col">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Seleziona Prodotto</DialogTitle>
              <DialogDescription>
                Cerca un prodotto per codice o descrizione (minimo 3 caratteri)
              </DialogDescription>
            </DialogHeader>

        {/* Barra di ricerca */}
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

        {/* Risultati */}
        <div className="flex-1 overflow-y-auto pr-2">
          {searchTerm.length > 0 && searchTerm.length < 3 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Inserisci almeno 3 caratteri per iniziare la ricerca
            </div>
          )}

          {searchTerm.length >= 3 && isLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Ricerca in corso...
            </div>
          )}

          {searchTerm.length >= 3 && !isLoading && prodotti.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nessun prodotto trovato
            </div>
          )}

          {/* Griglia a 2 colonne */}
          <div className="grid grid-cols-2 gap-3">
            {prodotti.map((prodotto) => (
              <Card
                key={prodotto.id}
                className="p-4 cursor-pointer hover:bg-muted/50 hover:border-primary transition-all"
                onClick={() => handleSelectProdottoCard(prodotto)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-3 min-w-0">
                    {/* Codice grande in evidenza */}
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-2xl font-bold text-primary truncate">
                        {highlightText(prodotto.codice, searchTerm)}
                      </span>
                    </div>

                    {/* Descrizione - in un box separato per distinguerla */}
                    <div className="bg-muted/30 rounded-md p-3 border-l-2 border-primary/30">
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {highlightText(prodotto.descrizione || "", searchTerm)}
                      </p>
                    </div>

                    {/* Misura come Badge - spostata sotto */}
                    {prodotto.misura && (
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-xs font-medium">
                          Misura: {highlightText(prodotto.misura, searchTerm)}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Prezzo */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-muted-foreground mb-1">Prezzo</div>
                    <div className="text-xl font-bold text-primary whitespace-nowrap">
                      €{prodotto.prezzo.toFixed(2)}
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
            {/* STEP 2: Configurazione Prodotto */}
            <DialogHeader>
              <DialogTitle>{editMode ? 'Modifica Riga' : 'Configura Prodotto'}</DialogTitle>
              <DialogDescription>
                {editMode ? 'Modifica quantità e sconti della riga' : 'Imposta quantità e sconti per il prodotto selezionato'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Riepilogo prodotto selezionato */}
              {selectedProdotto && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="text-xl font-bold text-primary">{selectedProdotto.codice}</span>
                      </div>
                      <p className="text-sm text-foreground">{selectedProdotto.descrizione}</p>
                      {selectedProdotto.misura && (
                        <Badge variant="secondary" className="text-xs">
                          Misura: {selectedProdotto.misura}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Listino Cad.</div>
                      <div className="text-2xl font-bold text-primary">€{selectedProdotto.prezzo.toFixed(2)}</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Form quantità e sconti - Layout a 2 colonne */}
              <div className="grid grid-cols-2 gap-6">
                {/* Colonna sinistra: Input */}
                <div className="space-y-4">
                  {/* Quantità e Unità di Misura */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="quantita" className="mb-2 block">
                        Quantità <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="quantita"
                        type="number"
                        value={quantita}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1
                          setQuantita(Math.max(1, value))
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
                      <Select value={um} onValueChange={setUm}>
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

                  {/* Sconti sulla stessa riga */}
                  <div>
                    <Label className="mb-2 block">Sconti (%)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="sc1" className="text-xs text-muted-foreground mb-1 block">SC1</Label>
                        <Input
                          id="sc1"
                          type="number"
                          value={sc1}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            setSc1(Math.min(Math.max(value, 0), 100))
                          }}
                          step="0.1"
                          min="0"
                          max="100"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sc2" className="text-xs text-muted-foreground mb-1 block">SC2</Label>
                        <Input
                          id="sc2"
                          type="number"
                          value={sc2}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            setSc2(Math.min(Math.max(value, 0), 100))
                          }}
                          step="0.1"
                          min="0"
                          max="100"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sc3" className="text-xs text-muted-foreground mb-1 block">SC3</Label>
                        <Input
                          id="sc3"
                          type="number"
                          value={sc3}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            setSc3(Math.min(Math.max(value, 0), 100))
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

                {/* Colonna destra: Riepilogo tipo checkout */}
                <div>
                  <Card className="p-4 bg-muted/20">
                    <div className="space-y-3">
                      {/* Prima riga: Codice prodotto x Quantità | Sconti */}
                      <div className="flex items-center justify-between text-sm font-medium pb-3 border-b">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">{selectedProdotto?.codice}</span>
                          <span className="text-muted-foreground">×{quantita}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={sc1 > 0 ? "text-green-600 font-semibold" : "text-muted-foreground"}>
                            SC1: {sc1}%
                          </span>
                          <span className={sc2 > 0 ? "text-green-600 font-semibold" : "text-muted-foreground"}>
                            SC2: {sc2}%
                          </span>
                          <span className={sc3 > 0 ? "text-green-600 font-semibold" : "text-muted-foreground"}>
                            SC3: {sc3}%
                          </span>
                        </div>
                      </div>

                      {/* Valori calcolati */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Listino Cad.</span>
                          <span className="font-medium">€{selectedProdotto?.prezzo.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Tot. Listino</span>
                          <span className="font-medium">€{totListinoRiga.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Netto Unitario</span>
                          <span className="font-medium">€{nettoUnitario.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm pt-2 border-t">
                          <span className="text-muted-foreground">Netto Riga</span>
                          <span className="font-medium">€{nettoRiga.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Azioni Step 2 */}
            <div className="flex justify-between pt-4 border-t">
              {!editMode && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Indietro
                </Button>
              )}
              <Button onClick={handleAggiungiProdotto} size="lg" className={editMode ? "ml-auto" : ""}>
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
