import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { ArrowLeft, Save, Loader2, ArrowRight, Eye } from "lucide-react"
import { useNavigation } from "@/app/context/NavigationContext"
import { PreventivoDataTable } from "@/app/data-tables/PreventivoDataTable"
import { RigaPreventivo } from "@/app/types/preventivo"
import { ClienteCombobox } from "@/app/components/ClienteCombobox"
import { toast } from "sonner"
import type { Cliente } from "@/app/types/cliente"
import type { Preventivo, PreventivoItem } from "@/app/types/preventivo"
import type { CompanyProfile } from "@/lib/conveyor/api/profiles-api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { generatePreventivoHTML } from "@/lib/utils/preventivo-html-generator"

export default function CreaPreventivo() {
  const { navigateTo, params } = useNavigation()
  const [currentStep, setCurrentStep] = useState(1)
  const [preventivoId, setPreventivoId] = useState<number | null>(null)
  const [righe, setRighe] = useState<RigaPreventivo[]>([])
  const [numeroPreventivo, setNumeroPreventivo] = useState("")
  const [dataPreventivo, setDataPreventivo] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState("")
  const [selectedClienteId, setSelectedClienteId] = useState<number | undefined>()
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<number | undefined>()
  const [selectedProfile, setSelectedProfile] = useState<CompanyProfile | null>(null)
  const [previewHTML, setPreviewHTML] = useState<string>("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Load profiles and next preventivo number on mount
  useEffect(() => {
    loadProfiles()
    loadNextPreventivoNumber()
  }, [])

  // Load preselected client if clienteId is passed via params
  useEffect(() => {
    const clienteId = params?.clienteId as number | undefined
    if (clienteId) {
      loadCliente(clienteId)
    }
  }, [params?.clienteId])

  const loadCliente = async (clienteId: number) => {
    try {
      const cliente = await window.conveyor.clienti.getById(clienteId)
      if (cliente) {
        setSelectedClienteId(cliente.id)
        setSelectedCliente(cliente)
      }
    } catch (error) {
      console.error("Error loading cliente:", error)
      toast.error("Errore", {
        description: "Impossibile caricare il cliente",
      })
    }
  }

  const loadProfiles = async () => {
    try {
      const data = await window.conveyor.profiles.getAll()
      setProfiles(data)

      // Auto-select default profile
      const defaultProfile = data.find((p: CompanyProfile) => p.isDefault)
      if (defaultProfile) {
        setSelectedProfileId(defaultProfile.id)
        setSelectedProfile(defaultProfile)
      } else if (data.length > 0) {
        setSelectedProfileId(data[0].id)
        setSelectedProfile(data[0])
      }
    } catch (error) {
      console.error("Error loading profiles:", error)
    }
  }

  const loadNextPreventivoNumber = async () => {
    try {
      const result = await window.conveyor.preventivi.getNextNumber()
      if (result.success && result.numero) {
        setNumeroPreventivo(result.numero)
      }
    } catch (error) {
      console.error("Error loading next preventivo number:", error)
      toast.error("Errore", {
        description: "Impossibile generare il numero preventivo",
      })
    }
  }

  // Update selected profile when profileId changes
  useEffect(() => {
    if (selectedProfileId) {
      const profile = profiles.find(p => p.id === selectedProfileId)
      setSelectedProfile(profile || null)
    }
  }, [selectedProfileId, profiles])

  const handleClienteChange = (clienteId: number | undefined, cliente: Cliente | null) => {
    setSelectedClienteId(clienteId)
    setSelectedCliente(cliente)
  }

  const calculateTotals = (righe: RigaPreventivo[]) => {
    const subtotal = righe.reduce((acc, riga) => acc + riga.nettoRiga, 0)
    const totalVat = righe.reduce((acc, riga) => {
      const vatAmount = (riga.nettoRiga * 22) / 100
      return acc + vatAmount
    }, 0)
    const total = subtotal + totalVat

    return {
      subtotal: Number(subtotal.toFixed(2)),
      totalVat: Number(totalVat.toFixed(2)),
      total: Number(total.toFixed(2)),
    }
  }

  const validateForm = (): string | null => {
    if (!numeroPreventivo.trim()) {
      return "Numero preventivo obbligatorio"
    }
    if (!dataPreventivo) {
      return "Data preventivo obbligatoria"
    }
    if (!selectedProfileId) {
      return "Seleziona un profilo aziendale"
    }
    if (!selectedCliente) {
      return "Cliente obbligatorio"
    }
    if (righe.length === 0) {
      return "Aggiungi almeno una riga al preventivo"
    }
    return null
  }

  const convertRigheToItems = (righe: RigaPreventivo[]): Omit<PreventivoItem, 'id' | 'preventivoId' | 'createdAt' | 'updatedAt'>[] => {
    return righe.map((riga, index) => {
      const vatAmount = (riga.nettoRiga * 22) / 100

      return {
        ordering: index,
        prodottoId: undefined,
        code: riga.codice,
        measure: riga.misura || undefined,
        description: riga.descrizione,
        unit: riga.um,
        quantity: riga.quantita,
        unitPrice: riga.listinoCad,
        lineTotal: riga.totListinoRiga,
        discount1: riga.sc1,
        discount2: riga.sc2,
        discount3: riga.sc3,
        netUnitPrice: riga.nettoUnitario,
        netLineTotal: riga.nettoRiga,
        vatRate: 22.0,
        vatAmount: Number(vatAmount.toFixed(2)),
      }
    })
  }

  const handleSaveAndPreview = async () => {
    const validationError = validateForm()
    if (validationError) {
      toast.error("Errore validazione", {
        description: validationError,
      })
      return
    }

    setIsSaving(true)

    try {
      const totals = calculateTotals(righe)

      // Se il preventivo non è ancora stato salvato, salvalo
      if (!preventivoId) {
        const items = convertRigheToItems(righe)

        const preventivoData: Omit<Preventivo, 'id' | 'createdAt' | 'updatedAt'> = {
          numero: numeroPreventivo,
          data: dataPreventivo,
          companyProfileId: selectedProfileId,
          clienteId: selectedCliente!.id,
          clienteBusinessName: selectedCliente!.businessName,
          clienteEmail: selectedCliente!.email || undefined,
          clienteVatNumber: selectedCliente!.vatNumber || undefined,
          clienteAddress: selectedCliente!.address || undefined,
          clienteZipCode: selectedCliente!.zipCode || undefined,
          clienteCity: selectedCliente!.city || undefined,
          subtotal: totals.subtotal,
          totalVat: totals.totalVat,
          total: totals.total,
          notes: note || undefined,
          metadata: undefined,
          status: 'draft',
        }

        const result = await window.conveyor.preventivi.create(preventivoData, items)

        if (!result.success) {
          toast.error("Errore salvataggio", {
            description: result.error || "Errore sconosciuto",
          })
          setIsSaving(false)
          return
        }

        setPreventivoId(result.id!)
        toast.success("Preventivo salvato", {
          description: `Preventivo ${numeroPreventivo} creato con successo`,
        })
      }

      // Generate HTML preview (sempre, anche se già salvato)
      if (selectedProfile && selectedCliente) {
        const companyCity = [selectedProfile.zipCode, selectedProfile.city].filter(Boolean).join(' ')
        const clientCity = [selectedCliente.zipCode, selectedCliente.city].filter(Boolean).join(' ')

        const html = generatePreventivoHTML({
          numero: numeroPreventivo,
          data: dataPreventivo,
          company: {
            name: selectedProfile.businessName,
            address: selectedProfile.address || '-',
            city: companyCity || '-',
            vat: selectedProfile.vatNumber,
            phone: selectedProfile.phone || '-',
            email: selectedProfile.email || '-',
          },
          client: {
            businessName: selectedCliente.businessName,
            address: selectedCliente.address,
            city: clientCity,
            email: selectedCliente.email,
            vatNumber: selectedCliente.vatNumber,
          },
          items: righe,
          subtotal: totals.subtotal,
          totalVat: totals.totalVat,
          total: totals.total,
          notes: note,
        })

        setPreviewHTML(html)
        setCurrentStep(2)
      }
    } catch (error) {
      toast.error("Errore", {
        description: error instanceof Error ? error.message : "Errore durante il salvataggio",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleBackToEdit = () => {
    setCurrentStep(1)
  }

  const handleContinue = () => {
    // Initialize email with default subject and body
    const defaultSubject = `Preventivo N. ${numeroPreventivo} - ${selectedProfile?.businessName || ''}`
    const defaultBody = `Gentile Cliente,

in allegato troverete il preventivo N. ${numeroPreventivo} come richiesto.

Restiamo a disposizione per qualsiasi chiarimento.

Cordiali saluti,
${selectedProfile?.businessName || ''}
${selectedProfile?.email || ''}
${selectedProfile?.phone || ''}`

    setEmailSubject(defaultSubject)
    setEmailBody(defaultBody)
    setCurrentStep(3)
  }

  const handleBackToPreview = () => {
    setCurrentStep(2)
  }

  const handleSendEmail = async () => {
    if (!selectedProfile?.email) {
      toast.error("Errore", {
        description: "Il profilo selezionato non ha un indirizzo email configurato",
      })
      return
    }

    if (!selectedCliente?.email) {
      toast.error("Errore", {
        description: "Il cliente selezionato non ha un indirizzo email",
      })
      return
    }

    if (!preventivoId) {
      toast.error("Errore", {
        description: "Preventivo non salvato",
      })
      return
    }

    if (!emailSubject.trim()) {
      toast.error("Errore", {
        description: "Inserisci l'oggetto dell'email",
      })
      return
    }

    if (!emailBody.trim()) {
      toast.error("Errore", {
        description: "Inserisci il testo dell'email",
      })
      return
    }

    setIsSending(true)

    try {
      const result = await window.conveyor.email.sendPreventivo({
        preventivoId: preventivoId,
        to: selectedCliente.email,
        subject: emailSubject,
        body: emailBody,
      })

      if (result.success) {
        toast.success("Email inviata", {
          description: `Email inviata con successo a ${selectedCliente.email}`,
        })

        // Navigate back to preventivi list
        setTimeout(() => {
          navigateTo('preventivi')
        }, 1500)
      } else {
        toast.error("Errore invio", {
          description: result.error || "Errore durante l'invio dell'email",
        })
      }
    } catch (error) {
      toast.error("Errore invio", {
        description: error instanceof Error ? error.message : "Errore durante l'invio dell'email",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 bg-muted/30">
      {/* Header con azioni */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (currentStep === 1) navigateTo("preventivi")
              else if (currentStep === 2) handleBackToEdit()
              else if (currentStep === 3) handleBackToPreview()
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentStep === 1 && "Crea Preventivo"}
              {currentStep === 2 && "Anteprima Preventivo"}
              {currentStep === 3 && "Invia Email"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentStep === 1 && "Compila i dettagli del preventivo"}
              {currentStep === 2 && "Verifica i dati prima di procedere all'invio"}
              {currentStep === 3 && "Componi l'email da inviare al cliente"}
            </p>
          </div>
        </div>
        {currentStep === 1 && (
          <div className="flex gap-2">
            <Button onClick={handleSaveAndPreview} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Salva e Anteprima
                </>
              )}
            </Button>
          </div>
        )}
        {currentStep === 2 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToEdit}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Indietro - Modifica
            </Button>
            <Button onClick={handleContinue}>
              Continua
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        {currentStep === 3 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackToPreview}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Indietro
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  Invia Email
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Step 1: Form preventivo */}
      {currentStep === 1 && (
        <>
          {/* Informazioni preventivo */}
          <Card className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="profilo" className="mb-2 block">
                  Profilo Aziendale <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedProfileId?.toString()}
                  onValueChange={(value) => setSelectedProfileId(parseInt(value))}
                >
                  <SelectTrigger className="!h-12 w-full">
                    <SelectValue placeholder="Seleziona profilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id.toString()}>
                        {profile.profileName}
                        {profile.isDefault && " ⭐"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="numero" className="mb-2 block">
                  Numero Preventivo
                </Label>
                <Input
                  id="numero"
                  value={numeroPreventivo}
                  readOnly
                  disabled
                  className="bg-muted"
                  placeholder="Generazione automatica..."
                />
              </div>
              <div>
                <Label htmlFor="data" className="mb-2 block">
                  Data <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={dataPreventivo}
                  onChange={(e) => setDataPreventivo(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cliente" className="mb-2 block">
                  Cliente <span className="text-red-500">*</span>
                </Label>
                <ClienteCombobox
                  value={selectedClienteId}
                  onChange={handleClienteChange}
                  placeholder="Seleziona cliente..."
                />
              </div>
            </div>
          </Card>

          {/* Tabella prodotti/servizi */}
          <Card className="p-4 flex-1">
            <PreventivoDataTable data={righe} onDataChange={setRighe} />
          </Card>

          {/* Note */}
          <Card className="p-4">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Aggiungi note o condizioni particolari..."
              className="mt-2"
              rows={3}
            />
          </Card>
        </>
      )}

      {/* Step 2: Anteprima HTML */}
      {currentStep === 2 && (
        <Card className="p-6 flex-1 overflow-hidden">
          <div className="w-full h-full overflow-auto bg-white p-8">
            <iframe
              srcDoc={previewHTML}
              className="w-full h-full border-0"
              style={{ minHeight: '800px' }}
              title="Anteprima Preventivo"
            />
          </div>
        </Card>
      )}

      {/* Step 3: Composizione Email */}
      {currentStep === 3 && (
        <Card className="p-6 flex-1">
          <div className="space-y-4 max-w-4xl">
            {/* Da */}
            <div>
              <Label htmlFor="emailFrom" className="text-sm font-medium text-muted-foreground">
                Da
              </Label>
              <Input
                id="emailFrom"
                value={selectedProfile?.email || ''}
                disabled
                className="mt-1 bg-muted"
              />
            </div>

            {/* A */}
            <div>
              <Label htmlFor="emailTo" className="text-sm font-medium text-muted-foreground">
                A
              </Label>
              <Input
                id="emailTo"
                value={selectedCliente?.email || ''}
                disabled
                className="mt-1 bg-muted"
              />
            </div>

            {/* Oggetto */}
            <div>
              <Label htmlFor="emailSubject" className="text-sm font-medium text-muted-foreground">
                Oggetto
              </Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="mt-1"
                placeholder="Oggetto dell'email"
              />
            </div>

            {/* Corpo email */}
            <div className="flex-1">
              <Label htmlFor="emailBody" className="text-sm font-medium text-muted-foreground">
                Messaggio
              </Label>
              <Textarea
                id="emailBody"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="mt-1 min-h-[300px] font-sans"
                placeholder="Scrivi il testo dell'email..."
              />
            </div>

            {/* Allegato info */}
            <div className="bg-muted/50 border border-border rounded-md p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Allegato:</strong> Preventivo_{numeroPreventivo}.pdf
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
