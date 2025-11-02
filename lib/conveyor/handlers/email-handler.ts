import { handle } from '@/lib/main/shared'
import { db } from '@/lib/database/db'
import { generatePreventivoPDF } from '@/lib/main/utils/pdf-generator'
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

interface Preventivo {
  id: number
  numero: string
  data: string
  companyProfileId?: number
  clienteBusinessName: string
  clienteEmail?: string
  clienteVatNumber?: string
  clienteAddress?: string
  clienteZipCode?: string
  clienteCity?: string
  subtotal: number
  totalVat: number
  total: number
  notes?: string
  metadata?: string
  status: string
}

interface PreventivoItem {
  code: string
  measure?: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  discount1: number
  discount2: number
  discount3: number
  netUnitPrice: number
  netLineTotal: number
}

interface EmailData {
  preventivoId: number
  to: string
  subject: string
  body: string
}

export const registerEmailHandlers = () => {
  handle('email:sendPreventivo', async (emailData: EmailData) => {
    try {
      // Get preventivo from database
      const preventivoStmt = db.prepare('SELECT * FROM preventivi WHERE id = ?')
      const preventivo = preventivoStmt.get(emailData.preventivoId) as Preventivo | undefined

      if (!preventivo) {
        return {
          success: false,
          error: 'Preventivo not found',
        }
      }

      // Get company profile
      if (!preventivo.companyProfileId) {
        return {
          success: false,
          error: 'Preventivo does not have a company profile assigned',
        }
      }

      const profileStmt = db.prepare('SELECT * FROM company_profiles WHERE id = ?')
      const profile = profileStmt.get(preventivo.companyProfileId) as CompanyProfile | undefined

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

      // Get preventivo items
      const itemsStmt = db.prepare('SELECT * FROM preventivi_items WHERE preventivoId = ? ORDER BY ordering')
      const items = itemsStmt.all(emailData.preventivoId) as PreventivoItem[]

      // Generate PDF
      const pdfPath = await generatePreventivoPDF({
        preventivo,
        items,
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

      console.log('[email:sendPreventivo] SMTP Configuration:')
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
            filename: `Preventivo_${preventivo.numero}.pdf`,
            path: pdfPath,
          },
        ],
      })

      // Update preventivo status to 'sent'
      const updateStmt = db.prepare('UPDATE preventivi SET status = ?, updatedAt = unixepoch() WHERE id = ?')
      updateStmt.run('sent', emailData.preventivoId)

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
