import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import { useNavigation } from '@/app/context/NavigationContext'
import { StepSendEmail } from './create-quote/step-send-email'
import { useSendQuoteEmail } from '@/app/hooks/use-send-quote-email'
import { toast } from 'sonner'
import type { Customer } from '@/app/types/customer'
import type { CompanyProfile } from '@/lib/conveyor/api/profiles-api'

export default function SendQuoteEmail() {
  const { navigateTo, params } = useNavigation()
  const quoteId = params?.quoteId as number | undefined
  const [loading, setLoading] = useState(true)
  const [quoteNumber, setQuoteNumber] = useState<number>(0)
  const [quoteRevision, setQuoteRevision] = useState<number>(0)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [profile, setProfile] = useState<CompanyProfile | null>(null)

  const { emailSubject, emailBody, isSending, setEmailSubject, setEmailBody, prepareEmail, sendEmail } =
    useSendQuoteEmail()

  useEffect(() => {
    loadQuoteData()
  }, [quoteId])

  const loadQuoteData = async () => {
    if (!quoteId) {
      toast.error('Errore', { description: 'ID preventivo non trovato' })
      navigateTo('quotes')
      return
    }

    try {
      setLoading(true)

      // Load quote
      const quote = await window.conveyor.quotes.getById(quoteId)

      if (!quote) {
        toast.error('Errore', { description: 'Preventivo non trovato' })
        navigateTo('quotes')
        return
      }

      setQuoteNumber(quote.number)
      setQuoteRevision(quote.revision)

      // Load customer
      const customerData = await window.conveyor.customers.getById(quote.customerId)
      if (!customerData) {
        toast.error('Errore', { description: 'Cliente non trovato' })
        navigateTo('quotes')
        return
      }
      setCustomer(customerData)

      // Load company profile
      if (quote.companyProfileId) {
        const profileData = await window.conveyor.profiles.getById(quote.companyProfileId)
        if (profileData) {
          setProfile(profileData)

          // Prepare email with default subject and body
          prepareEmail({
            quoteNumber: quote.number,
            quoteRevision: quote.revision,
            profile: profileData,
            customer: customerData,
          })
        }
      }
    } catch (error) {
      console.error('Error loading quote data:', error)
      toast.error('Errore', { description: 'Errore durante il caricamento dei dati' })
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!quoteId || !profile || !customer) {
      toast.error('Errore', { description: 'Dati mancanti per invio email' })
      return
    }

    const success = await sendEmail({
      quoteId,
      quoteNumber,
      quoteRevision,
      profile,
      customer,
    })

    if (success) {
      setTimeout(() => {
        navigateTo('quotes')
      }, 1500)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6 bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('quotes')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invia Email</h1>
            <p className="text-muted-foreground mt-1">Componi l'email da inviare al cliente</p>
          </div>
        </div>
        <Button onClick={handleSendEmail} disabled={isSending || loading}>
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Invio in corso...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Invia Email
            </>
          )}
        </Button>
      </div>

      {/* Email Form */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <StepSendEmail
          emailFrom={profile?.email || ''}
          emailTo={customer?.email || ''}
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
