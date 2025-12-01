import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { ArrowLeft, Loader2, ArrowRight, Eye } from 'lucide-react'
import { useNavigation } from '@/app/context/NavigationContext'
import { useCreateQuote } from '@/app/hooks/use-create-quote'
import { useQuotePreview } from '@/app/hooks/use-quote-preview'
import { useSendQuoteEmail } from '@/app/hooks/use-send-quote-email'
import { StepCreation } from './step-creation'
import { StepPreview } from './step-preview'
import { StepSendEmail } from './step-send-email'

export default function CreateQuote() {
  const { navigateTo, params } = useNavigation()
  const customerIdFromParams = params?.customerId as number | undefined
  const quoteIdFromParams = params?.quoteId as number | undefined

  const [currentStep, setCurrentStep] = useState(1)

  const {
    quoteId,
    rows,
    quoteNumber,
    quoteRevision,
    quoteDate,
    notes,
    selectedCustomerId,
    selectedCustomer,
    profiles,
    selectedProfileId,
    selectedProfile,
    isSaving,
    setQuoteRevision,
    setQuoteDate,
    setNotes,
    setSelectedProfileId,
    handleCustomerChange,
    addRow,
    updateRow,
    deleteRow,
    updateNetUnitPrice,
    saveQuote,
  } = useCreateQuote(customerIdFromParams, quoteIdFromParams)

  const { previewHTML, generatePreview } = useQuotePreview()

  const { emailSubject, emailBody, isSending, setEmailSubject, setEmailBody, prepareEmail, sendEmail } =
    useSendQuoteEmail()

  const handleSaveAndPreview = async () => {
    const quoteData = await saveQuote()
    if (quoteData) {
      generatePreview(quoteData)
      setCurrentStep(2)
    }
  }

  const handleContinue = () => {
    if (selectedProfile && selectedCustomer) {
      prepareEmail({
        quoteNumber,
        quoteRevision,
        profile: selectedProfile,
        customer: selectedCustomer,
      })
    }
    setCurrentStep(3)
  }

  const handleSendEmail = async () => {
    if (!selectedProfile || !selectedCustomer || !quoteId) {
      return
    }

    const success = await sendEmail({
      quoteId,
      quoteNumber,
      quoteRevision,
      profile: selectedProfile,
      customer: selectedCustomer,
    })

    if (success) {
      setTimeout(() => {
        navigateTo('quotes')
      }, 1500)
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      navigateTo('quotes')
    } else if (currentStep === 2) {
      setCurrentStep(1)
    } else if (currentStep === 3) {
      setCurrentStep(2)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 bg-muted/30">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentStep === 1 && 'Crea Preventivo'}
              {currentStep === 2 && 'Anteprima Preventivo'}
              {currentStep === 3 && 'Invia Email'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentStep === 1 && 'Compila i dettagli del preventivo'}
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
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
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
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
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

      {/* Step 1: Creation */}
      {currentStep === 1 && (
        <StepCreation
          quoteNumber={quoteNumber}
          quoteRevision={quoteRevision}
          quoteDate={quoteDate}
          notes={notes}
          rows={rows}
          selectedCustomerId={selectedCustomerId}
          selectedProfileId={selectedProfileId}
          profiles={profiles}
          onQuoteRevisionChange={setQuoteRevision}
          onQuoteDateChange={setQuoteDate}
          onNotesChange={setNotes}
          onAddRow={addRow}
          onUpdateRow={updateRow}
          onDeleteRow={deleteRow}
          onUpdateNetUnitPrice={updateNetUnitPrice}
          onCustomerChange={handleCustomerChange}
          onProfileChange={setSelectedProfileId}
        />
      )}

      {/* Step 2: Preview */}
      {currentStep === 2 && <StepPreview previewHTML={previewHTML} />}

      {/* Step 3: Send Email */}
      {currentStep === 3 && (
        <StepSendEmail
          emailFrom={selectedProfile?.email || ''}
          emailTo={selectedCustomer?.email || ''}
          emailSubject={emailSubject}
          emailBody={emailBody}
          quoteNumber={quoteNumber}
          quoteRevision={quoteRevision}
          onSubjectChange={setEmailSubject}
          onBodyChange={setEmailBody}
        />
      )}
    </div>
  )
}
