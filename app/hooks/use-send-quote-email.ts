import { useState } from 'react'
import { toast } from 'sonner'
import type { CompanyProfile } from '@/lib/conveyor/api/profiles-api'
import type { Customer } from '@/app/types/customer'

interface SendEmailParams {
  quoteId: number
  quoteNumber: number
  quoteRevision: number
  profile: CompanyProfile
  customer: Customer
}

export function useSendQuoteEmail() {
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [isSending, setIsSending] = useState(false)

  const prepareEmail = ({ quoteNumber, quoteRevision, profile, customer }: Omit<SendEmailParams, 'quoteId'>) => {
    const defaultSubject = `Preventivo N. ${quoteNumber} Rev. ${quoteRevision} - ${profile.businessName || ''}`
    const defaultBody = `Gentile Cliente,

in allegato troverete il preventivo N. ${quoteNumber} Rev. ${quoteRevision} come richiesto.

Restiamo a disposizione per qualsiasi chiarimento.

Cordiali saluti,
${profile.businessName || ''}
${profile.email || ''}
${profile.phone || ''}`

    setEmailSubject(defaultSubject)
    setEmailBody(defaultBody)
  }

  const validateEmail = (params: SendEmailParams): string | null => {
    if (!params.profile.email) {
      return 'Il profilo selezionato non ha un indirizzo email configurato'
    }

    if (!params.customer.email) {
      return 'Il cliente selezionato non ha un indirizzo email'
    }

    if (!params.quoteId) {
      return 'Preventivo non salvato'
    }

    if (!emailSubject.trim()) {
      return "Inserisci l'oggetto dell'email"
    }

    if (!emailBody.trim()) {
      return "Inserisci il testo dell'email"
    }

    return null
  }

  const sendEmail = async (params: SendEmailParams): Promise<boolean> => {
    const validationError = validateEmail(params)
    if (validationError) {
      toast.error('Errore', { description: validationError })
      return false
    }

    setIsSending(true)

    try {
      const result = await window.conveyor.email.sendQuote({
        quoteId: params.quoteId,
        to: params.customer.email!,
        subject: emailSubject,
        body: emailBody,
      })

      if (result.success) {
        toast.success('Email inviata', {
          description: `Email inviata con successo a ${params.customer.email}`,
        })
        return true
      } else {
        toast.error('Errore invio', {
          description: result.error || "Errore durante l'invio dell'email",
        })
        return false
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Errore', {
        description: "Si è verificato un errore durante l'invio dell'email",
      })
      return false
    } finally {
      setIsSending(false)
    }
  }

  return {
    emailSubject,
    emailBody,
    isSending,
    setEmailSubject,
    setEmailBody,
    prepareEmail,
    sendEmail,
  }
}
