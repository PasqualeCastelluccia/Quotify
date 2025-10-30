import { useState, useEffect } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Building2, Mail, Plus, Trash2, Star } from "lucide-react"
import { toast } from "sonner"
import type { CompanyProfile } from "@/lib/conveyor/api/profiles-api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"

type Tab = "company" | "smtp"

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("company")
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<CompanyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState<1 | 2>(1)

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    profileName: "",
    businessName: "",
    vatNumber: "",
    address: "",
    zipCode: "",
    city: "",
    phone: "",
    email: "",
  })

  // SMTP form state
  const [smtpForm, setSmtpForm] = useState({
    smtpHost: "",
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: "",
    smtpPassword: "",
    smtpFromEmail: "",
    smtpFromName: "",
  })

  // Load profiles on mount
  useEffect(() => {
    loadProfiles()
  }, [])

  // Load profile data when selected
  useEffect(() => {
    if (selectedProfileId) {
      loadProfileData(selectedProfileId)
    }
  }, [selectedProfileId])

  const loadProfiles = async () => {
    try {
      setIsLoading(true)
      const data = await window.conveyor.profiles.getAll()
      setProfiles(data)

      if (data.length === 0) {
        // No profiles, enter creation mode
        setIsCreatingNew(true)
        setSelectedProfileId(null)
        setSelectedProfile(null)
      } else if (!selectedProfileId) {
        // Select default or first profile
        const defaultProfile = data.find((p: CompanyProfile) => p.isDefault) || data[0]
        setSelectedProfileId(defaultProfile.id)
      }
    } catch (error) {
      toast.error("Errore nel caricamento dei profili")
    } finally {
      setIsLoading(false)
    }
  }

  const loadProfileData = async (id: number) => {
    try {
      setIsLoading(true)
      const profile = await window.conveyor.profiles.getById(id)

      if (profile) {
        setSelectedProfile(profile)
        setCompanyForm({
          profileName: profile.profileName || "",
          businessName: profile.businessName || "",
          vatNumber: profile.vatNumber || "",
          address: profile.address || "",
          zipCode: profile.zipCode || "",
          city: profile.city || "",
          phone: profile.phone || "",
          email: profile.email || "",
        })
        setSmtpForm({
          smtpHost: profile.smtpHost || "",
          smtpPort: profile.smtpPort || 587,
          smtpSecure: profile.smtpSecure || false,
          smtpUser: profile.smtpUser || "",
          smtpPassword: profile.smtpPassword || "",
          smtpFromEmail: profile.smtpFromEmail || "",
          smtpFromName: profile.smtpFromName || "",
        })
        setIsCreatingNew(false)
      }
    } catch (error) {
      toast.error("Errore nel caricamento del profilo")
    } finally {
      setIsLoading(false)
    }
  }

  const validateCompanyData = (): string | null => {
    if (!companyForm.profileName.trim()) {
      return "Nome profilo obbligatorio"
    }
    if (!companyForm.businessName.trim()) {
      return "Ragione sociale obbligatoria"
    }
    if (!companyForm.vatNumber.trim()) {
      return "P.IVA obbligatoria"
    }
    return null
  }

  const handleWizardNext = () => {
    const validationError = validateCompanyData()
    if (validationError) {
      toast.error("Errore validazione", {
        description: validationError
      })
      return
    }
    setWizardStep(2)
  }

  const handleWizardSkipSMTP = async () => {
    await handleSave(true) // Skip SMTP
  }

  const handleSave = async (skipSMTP = false) => {
    // Validation
    const validationError = validateCompanyData()
    if (validationError) {
      toast.error("Errore validazione", {
        description: validationError
      })
      return
    }

    try {
      setIsSaving(true)

      const profileData = {
        ...companyForm,
        ...(skipSMTP ? {} : smtpForm),
      }

      if (isCreatingNew) {
        const result = await window.conveyor.profiles.create(profileData)

        if (result.success) {
          toast.success("Profilo creato con successo")
          await loadProfiles()
          setSelectedProfileId(result.id)
          setIsCreatingNew(false)
          setWizardStep(1) // Reset wizard
        } else {
          toast.error("Errore creazione profilo", {
            description: result.error || "Errore sconosciuto"
          })
        }
      } else if (selectedProfileId) {
        const result = await window.conveyor.profiles.update({
          id: selectedProfileId,
          ...profileData,
        })

        if (result.success) {
          toast.success("Profilo aggiornato con successo")
          await loadProfiles()
          await loadProfileData(selectedProfileId)
        } else {
          toast.error("Errore aggiornamento profilo", {
            description: result.error || "Errore sconosciuto"
          })
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error("Errore nel salvataggio", {
        description: error instanceof Error ? error.message : "Errore imprevisto"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleNewProfile = () => {
    setIsCreatingNew(true)
    setSelectedProfileId(null)
    setSelectedProfile(null)
    setWizardStep(1) // Start from step 1
    setCompanyForm({
      profileName: "",
      businessName: "",
      vatNumber: "",
      address: "",
      zipCode: "",
      city: "",
      phone: "",
      email: "",
    })
    setSmtpForm({
      smtpHost: "",
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: "",
      smtpPassword: "",
      smtpFromEmail: "",
      smtpFromName: "",
    })
    setActiveTab("company")
  }

  const handleDelete = async () => {
    if (!selectedProfileId) return

    try {
      const result = await window.conveyor.profiles.delete(selectedProfileId)
      if (result.success) {
        toast.success("Profilo eliminato con successo")
        setDeleteDialogOpen(false)
        await loadProfiles()
        // loadProfiles will handle setting isCreatingNew if no profiles remain
      } else {
        toast.error("Errore eliminazione", {
          description: result.error || "Errore sconosciuto"
        })
        setDeleteDialogOpen(false)
      }
    } catch (error) {
      console.error('Error deleting profile:', error)
      toast.error("Errore eliminazione", {
        description: error instanceof Error ? error.message : "Errore imprevisto"
      })
      setDeleteDialogOpen(false)
    }
  }

  const handleSetDefault = async () => {
    if (!selectedProfileId) return

    try {
      const result = await window.conveyor.profiles.setDefault(selectedProfileId)
      if (result.success) {
        toast.success("Profilo predefinito impostato")
        await loadProfiles()
        await loadProfileData(selectedProfileId)
      } else {
        toast.error(result.error || "Errore nell'impostazione del profilo predefinito")
      }
    } catch (error) {
      toast.error("Errore nell'impostazione del profilo predefinito")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Impostazioni</h1>
        <p className="text-muted-foreground mt-2">
          Gestisci i profili aziendali e le configurazioni SMTP
        </p>
      </div>

      {/* Profile selector and actions - Only show if there are existing profiles */}
      {profiles.length > 0 && (
        <div className="flex items-center gap-3">
          {isCreatingNew ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
              <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Creazione Nuovo Profilo
              </span>
            </div>
          ) : (
            <Select
              value={selectedProfileId?.toString() || ""}
              onValueChange={(value) => setSelectedProfileId(parseInt(value))}
            >
              <SelectTrigger className="w-[300px]">
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
          )}

          {!isCreatingNew && (
            <Button onClick={handleNewProfile} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Profilo
            </Button>
          )}

          {selectedProfile && !isCreatingNew && (
            <>
              {!selectedProfile.isDefault && (
                <Button onClick={handleSetDefault} variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Imposta Predefinito
                </Button>
              )}
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Elimina
              </Button>
            </>
          )}

          {isCreatingNew && (
            <Button
              onClick={() => {
                setIsCreatingNew(false)
                const defaultProfile = profiles.find((p) => p.isDefault) || profiles[0]
                setSelectedProfileId(defaultProfile.id)
              }}
              variant="ghost"
              size="sm"
            >
              Annulla
            </Button>
          )}
        </div>
      )}

      {/* Main content */}
      {isCreatingNew ? (
        // WIZARD MODE - Profile creation (first time or new profile)
        <Card className="p-8">
          {/* Wizard Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${wizardStep === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  wizardStep === 1
                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  1
                </div>
                <span className="font-medium">Dati Azienda</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className={`flex items-center gap-2 ${wizardStep === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  wizardStep === 2
                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  2
                </div>
                <span className="font-medium">Configurazione SMTP</span>
              </div>
            </div>
          </div>

          {/* Step 1: Company Data */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {profiles.length === 0 ? 'Crea il tuo primo profilo aziendale' : 'Crea nuovo profilo aziendale'}
                </h2>
                <p className="text-muted-foreground">Inserisci i dati della tua azienda. Questi verranno utilizzati nei preventivi.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="col-span-2">
                  <label className="text-sm font-medium">Nome Profilo *</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={companyForm.profileName}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, profileName: e.target.value })
                    }
                    placeholder="Es: ACME Solutions"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Nome identificativo del profilo</p>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Ragione Sociale *</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={companyForm.businessName}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, businessName: e.target.value })
                    }
                    placeholder="Es: ACME Solutions S.r.l."
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">P.IVA *</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={companyForm.vatNumber}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, vatNumber: e.target.value })
                    }
                    placeholder="IT12345678901"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Indirizzo</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={companyForm.address}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, address: e.target.value })
                    }
                    placeholder="Via Roma 123"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">CAP</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={companyForm.zipCode}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, zipCode: e.target.value })
                    }
                    placeholder="00100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Città</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={companyForm.city}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, city: e.target.value })
                    }
                    placeholder="Roma"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Telefono</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={companyForm.phone}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, phone: e.target.value })
                    }
                    placeholder="+39 06 1234567"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={companyForm.email}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, email: e.target.value })
                    }
                    placeholder="info@acme.it"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <Button onClick={handleWizardNext}>
                  Avanti - Configura SMTP
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: SMTP */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Configurazione SMTP (Opzionale)</h2>
                <p className="text-muted-foreground">
                  Configura il server SMTP per l'invio automatico delle email. Puoi saltare questo passaggio e configurarlo in seguito.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="col-span-2">
                  <label className="text-sm font-medium">Host SMTP</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={smtpForm.smtpHost}
                    onChange={(e) =>
                      setSmtpForm({ ...smtpForm, smtpHost: e.target.value })
                    }
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Porta</label>
                  <input
                    type="number"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={smtpForm.smtpPort}
                    onChange={(e) =>
                      setSmtpForm({ ...smtpForm, smtpPort: parseInt(e.target.value) })
                    }
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={smtpForm.smtpSecure}
                      onChange={(e) =>
                        setSmtpForm({ ...smtpForm, smtpSecure: e.target.checked })
                      }
                    />
                    <span className="text-sm font-medium">SSL/TLS</span>
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Username</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={smtpForm.smtpUser}
                    onChange={(e) =>
                      setSmtpForm({ ...smtpForm, smtpUser: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={smtpForm.smtpPassword}
                    onChange={(e) =>
                      setSmtpForm({ ...smtpForm, smtpPassword: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Email Mittente</label>
                  <input
                    type="email"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={smtpForm.smtpFromEmail}
                    onChange={(e) =>
                      setSmtpForm({ ...smtpForm, smtpFromEmail: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Nome Mittente</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={smtpForm.smtpFromName}
                    onChange={(e) =>
                      setSmtpForm({ ...smtpForm, smtpFromName: e.target.value })
                    }
                    placeholder="ACME Solutions"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-8 pt-6 border-t">
                <Button variant="ghost" onClick={() => setWizardStep(1)}>
                  Indietro
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleWizardSkipSMTP} disabled={isSaving}>
                    Inserisci in Seguito
                  </Button>
                  <Button onClick={() => handleSave(false)} disabled={isSaving}>
                    {isSaving ? "Salvataggio..." : "Completa Configurazione"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      ) : (
        // NORMAL MODE - Tabs view
        <div className="flex gap-6">
          {/* Vertical tabs */}
          <Card className="w-[200px] h-fit p-2">
            <div className="flex flex-col gap-1">
              <Button
                variant={activeTab === "company" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("company")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Dati Azienda
              </Button>
              <Button
                variant={activeTab === "smtp" ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("smtp")}
              >
                <Mail className="h-4 w-4 mr-2" />
                SMTP
              </Button>
            </div>
          </Card>

          {/* Form content */}
          <Card className="flex-1 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">Caricamento...</p>
              </div>
            ) : (
              <>
              {activeTab === "company" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Informazioni Azienda</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Nome Profilo *</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={companyForm.profileName}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, profileName: e.target.value })
                        }
                        placeholder="Es: ACME Solutions"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">Ragione Sociale *</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={companyForm.businessName}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, businessName: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">P.IVA *</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={companyForm.vatNumber}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, vatNumber: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">Indirizzo</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={companyForm.address}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, address: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">CAP</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={companyForm.zipCode}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, zipCode: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Città</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={companyForm.city}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, city: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Telefono</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={companyForm.phone}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, phone: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={companyForm.email}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "smtp" && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Configurazione SMTP</h2>
                    <p className="text-sm text-muted-foreground">
                      Configura il server SMTP per l'invio delle email (funzionalità futura)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Host SMTP</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={smtpForm.smtpHost}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, smtpHost: e.target.value })
                        }
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Porta</label>
                      <input
                        type="number"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={smtpForm.smtpPort}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, smtpPort: parseInt(e.target.value) })
                        }
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={smtpForm.smtpSecure}
                          onChange={(e) =>
                            setSmtpForm({ ...smtpForm, smtpSecure: e.target.checked })
                          }
                        />
                        <span className="text-sm font-medium">SSL/TLS</span>
                      </label>
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">Username</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={smtpForm.smtpUser}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, smtpUser: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">Password</label>
                      <input
                        type="password"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={smtpForm.smtpPassword}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, smtpPassword: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">Email Mittente</label>
                      <input
                        type="email"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={smtpForm.smtpFromEmail}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, smtpFromEmail: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">Nome Mittente</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={smtpForm.smtpFromName}
                        onChange={(e) =>
                          setSmtpForm({ ...smtpForm, smtpFromName: e.target.value })
                        }
                        placeholder="ACME Solutions"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save button */}
              <div className="mt-6 flex justify-end">
                <Button onClick={() => handleSave(false)} disabled={isSaving}>
                  {isSaving ? "Salvataggio..." : "Salva Modifiche"}
                </Button>
              </div>
            </>
          )}
        </Card>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il profilo "{selectedProfile?.profileName}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il profilo e tutti i suoi dati (inclusa la configurazione SMTP) verranno eliminati definitivamente.
              {profiles.length === 1 && (
                <span className="block mt-2 font-medium text-orange-600 dark:text-orange-400">
                  Attenzione: Stai eliminando l'ultimo profilo. Dovrai crearne uno nuovo per utilizzare l'applicazione.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
