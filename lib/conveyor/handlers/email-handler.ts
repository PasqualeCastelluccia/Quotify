import { handle } from '@/lib/main/shared'
import { prisma } from '@/lib/database/prisma'
import { generateQuotePDF } from '@/lib/main/utils/pdf-generator'
import nodemailer from 'nodemailer'
import { decryptString } from '@/lib/main/utils/encryption'

interface CompanyProfile {
  id: number
  profileName: string
  businessName: string
  vatNumber: string
  address?: string
  zipCode?: string
  city?: string
  phone?: string
  email?: string
  smtpHost?: string
  smtpPort?: number
  smtpSecure?: number
  smtpUser?: string
  smtpPassword?: string
  smtpFromEmail?: string
  smtpFromName?: string
}

interface EmailData {
  quoteId: number
  to: string
  subject: string
  body: string
}

export const registerEmailHandlers = () => {
  handle('email:sendQuote', async (emailData: EmailData) => {
    try {
      // Get quote from database
      const quote = await prisma.quote.findUnique({
        where: { id: emailData.quoteId },
        include: { items: true },
      })

      if (!quote) {
        return {
          success: false,
          error: 'Quote not found',
        }
      }

      // Get company profile
      if (!quote.companyProfileId) {
        return {
          success: false,
          error: 'Quote does not have a company profile assigned',
        }
      }

      const profile = await prisma.companyProfile.findUnique({
        where: { id: quote.companyProfileId },
      })

      if (!profile) {
        return {
          success: false,
          error: 'Company profile not found',
        }
      }

      // Validate SMTP configuration
      if (!profile.smtpHost || !profile.smtpPort || !profile.smtpUser || !profile.smtpPassword) {
        return {
          success: false,
          error: 'SMTP configuration is incomplete for this profile',
        }
      }

      // Decrypt SMTP password
      const smtpPassword = profile.smtpPassword ? decryptString(profile.smtpPassword) : null

      if (!smtpPassword) {
        return {
          success: false,
          error: 'Failed to decrypt SMTP password',
        }
      }

      // Generate PDF
      const pdfPath = await generateQuotePDF({
        quote: {
          id: quote.id,
          revision: quote.revision,
          number: quote.number,
          date: quote.date,
          companyProfileId: quote.companyProfileId || undefined,
          customerBusinessName: quote.customerBusinessName,
          customerEmail: quote.customerEmail || undefined,
          customerVatNumber: quote.customerVatNumber || undefined,
          customerAddress: quote.customerAddress || undefined,
          customerZipCode: quote.customerZipCode || undefined,
          customerCity: quote.customerCity || undefined,
          subtotal: quote.subtotal,
          totalVat: quote.totalVat,
          total: quote.total,
          notes: quote.notes || undefined,
          metadata: quote.metadata || undefined,
          status: quote.status,
        },
        items: quote.items.map((item) => ({
          code: item.code,
          measure: item.measure || undefined,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount1: item.discount1 || 0,
          discount2: item.discount2 || 0,
          discount3: item.discount3 || 0,
          netUnitPrice: item.netUnitPrice,
          netLineTotal: item.netLineTotal,
        })),
      })

      // Create SMTP transporter
      const smtpConfig = {
        host: profile.smtpHost,
        port: profile.smtpPort,
        secure: profile.smtpSecure === 1, // true for 465, false for other ports
        auth: {
          user: profile.smtpUser,
          pass: smtpPassword,
        },
      }

      console.log('[email:sendQuote] SMTP Configuration:')
      console.log('  Host:', smtpConfig.host)
      console.log('  Port:', smtpConfig.port)
      console.log('  Secure:', smtpConfig.secure)
      console.log('  User:', smtpConfig.auth.user)
      console.log('  Password:', smtpPassword ? `(${smtpPassword.length} chars)` : '(empty)')

      const transporter = nodemailer.createTransport(smtpConfig)

      // Verify SMTP connection
      try {
        await transporter.verify()
      } catch (error) {
        console.error('SMTP verification failed:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return {
          success: false,
          error: `Failed to connect to SMTP server: ${errorMessage}`,
        }
      }

      // Send email
      const fromEmail = profile.smtpFromEmail || profile.email || profile.smtpUser
      const fromName = profile.smtpFromName || profile.businessName

      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body,
        attachments: [
          {
            filename: `Quote_${quote.number}.pdf`,
            path: pdfPath,
          },
        ],
      })

      // Update quote status to 'sent'
      await prisma.quote.update({
        where: { id: emailData.quoteId },
        data: {
          status: 'sent',
          updatedAt: Math.floor(Date.now() / 1000),
        },
      })

      return {
        success: true,
      }
    } catch (error) {
      console.error('Error sending email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}
