import { BrowserWindow, app } from 'electron'
import path from 'path'
import fs from 'fs'
import { db } from '@/lib/database/db'

interface PreventivoData {
  preventivo: {
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
  items: Array<{
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
  }>
}

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
}

// Fallback company data if no profile is found
const DEFAULT_COMPANY_DATA = {
  name: 'ACME Solutions S.r.l.',
  address: 'Via Roma 123',
  city: '00100 Roma (RM)',
  vat: '12345678901',
  phone: '+39 06 1234567',
  email: 'info@acmesolutions.it',
}

function formatCurrency(value: number): string {
  return value.toFixed(2).replace('.', ',')
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDiscount(discount: number): string {
  return discount > 0 ? discount.toFixed(2) + '%' : '-'
}

function calculateLineTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice
}

function generateItemsHTML(items: PreventivoData['items']): string {
  return items
    .map(
      (item) => {
        const lineTotal = calculateLineTotal(item.quantity, item.unitPrice)
        return `
    <tr>
      <td class="item-code">${item.code}</td>
      <td>${item.measure || '-'}</td>
      <td class="item-description">${item.description}</td>
      <td class="center">${item.unit}</td>
      <td class="right">${item.quantity.toFixed(2)}</td>
      <td class="right">€ ${formatCurrency(item.unitPrice)}</td>
      <td class="right">€ ${formatCurrency(lineTotal)}</td>
      <td class="right">${formatDiscount(item.discount1)}</td>
      <td class="right">${formatDiscount(item.discount2)}</td>
      <td class="right">${formatDiscount(item.discount3)}</td>
      <td class="right">€ ${formatCurrency(item.netUnitPrice)}</td>
      <td class="right"><strong>€ ${formatCurrency(item.netLineTotal)}</strong></td>
    </tr>
  `
      }
    )
    .join('')
}

function generateNotesSection(notes?: string): string {
  if (!notes || notes.trim() === '') return ''

  return `
  <div class="notes">
    <div class="notes-title">Note</div>
    <div class="notes-content">${notes}</div>
  </div>
  `
}

function generateMetadataSection(metadata?: string): string {
  if (!metadata || metadata.trim() === '') return ''

  return `
  <div class="metadata">
    <strong>Metadata:</strong> ${metadata}
  </div>
  `
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Bozza',
    sent: 'Inviato',
    accepted: 'Accettato',
    rejected: 'Rifiutato',
  }
  return labels[status] || status
}

export async function generatePreventivoPDF(data: PreventivoData): Promise<string> {
  // Get company profile from database
  let companyData = DEFAULT_COMPANY_DATA

  if (data.preventivo.companyProfileId) {
    try {
      const stmt = db.prepare('SELECT * FROM company_profiles WHERE id = ?')
      const profile = stmt.get(data.preventivo.companyProfileId) as CompanyProfile | undefined

      if (profile) {
        const companyCity = [profile.zipCode, profile.city].filter(Boolean).join(' ')
        companyData = {
          name: profile.businessName,
          address: profile.address || '-',
          city: companyCity || '-',
          vat: profile.vatNumber,
          phone: profile.phone || '-',
          email: profile.email || '-',
        }
      }
    } catch (error) {
      console.error('Error loading company profile:', error)
      // Continue with default data
    }
  } else {
    // Try to get default profile if no profile specified
    try {
      const stmt = db.prepare('SELECT * FROM company_profiles WHERE isDefault = 1 LIMIT 1')
      const profile = stmt.get() as CompanyProfile | undefined

      if (profile) {
        const companyCity = [profile.zipCode, profile.city].filter(Boolean).join(' ')
        companyData = {
          name: profile.businessName,
          address: profile.address || '-',
          city: companyCity || '-',
          vat: profile.vatNumber,
          phone: profile.phone || '-',
          email: profile.email || '-',
        }
      }
    } catch (error) {
      console.error('Error loading default profile:', error)
      // Continue with default data
    }
  }

let templatePath: string

if (app.isPackaged) {
  // In produzione: resources/lib/preventivo.html
  templatePath = path.join(process.resourcesPath, 'lib', 'preventivo.html')
} else {
  // In sviluppo
  templatePath = path.join(__dirname, '../..', 'lib', 'templates', 'preventivo.html')
}

// Debug (opzionale, rimuovi dopo il test)
console.log('🔍 Template path:', templatePath)
console.log('📁 Template exists:', fs.existsSync(templatePath))

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at: ${templatePath}`)
  }

  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8')

  const clientCity = [data.preventivo.clienteZipCode, data.preventivo.clienteCity]
    .filter(Boolean)
    .join(' ')

  htmlTemplate = htmlTemplate
    .replace(/{{COMPANY_NAME}}/g, companyData.name)
    .replace(/{{COMPANY_ADDRESS}}/g, companyData.address)
    .replace(/{{COMPANY_CITY}}/g, companyData.city)
    .replace(/{{COMPANY_VAT}}/g, companyData.vat)
    .replace(/{{COMPANY_PHONE}}/g, companyData.phone)
    .replace(/{{COMPANY_EMAIL}}/g, companyData.email)
    .replace(/{{NUMERO}}/g, data.preventivo.numero)
    .replace(/{{DATA}}/g, formatDate(data.preventivo.data))
    .replace(/{{CLIENTE_NAME}}/g, data.preventivo.clienteBusinessName)
    .replace(/{{CLIENTE_ADDRESS}}/g, data.preventivo.clienteAddress || '-')
    .replace(/{{CLIENTE_CITY}}/g, clientCity || '-')
    .replace(/{{CLIENTE_EMAIL}}/g, data.preventivo.clienteEmail || '-')
    .replace(/{{CLIENTE_VAT}}/g, data.preventivo.clienteVatNumber || '-')
    .replace(/{{ITEMS}}/g, generateItemsHTML(data.items))
    .replace(/{{SUBTOTAL}}/g, formatCurrency(data.preventivo.subtotal))
    .replace(/{{VAT}}/g, formatCurrency(data.preventivo.totalVat))
    .replace(/{{TOTAL}}/g, formatCurrency(data.preventivo.total))
    .replace(/{{NOTES_SECTION}}/g, generateNotesSection(data.preventivo.notes))
    .replace(/{{METADATA_SECTION}}/g, generateMetadataSection(data.preventivo.metadata))
    .replace(/{{GENERATED_DATE}}/g, new Date().toLocaleString('it-IT'))

  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: true,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlTemplate)}`)

  await new Promise((resolve) => setTimeout(resolve, 500))

  const pdfData = await win.webContents.printToPDF({
    marginsType: 0,
    pageSize: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    landscape: false,
  })

  win.close()

  const userDataPath = app.getPath('userData')
  const pdfsDir = path.join(userDataPath, 'pdfs')

  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true })
  }

  const fileName = `${data.preventivo.numero.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`
  const outputPath = path.join(pdfsDir, fileName)

  fs.writeFileSync(outputPath, pdfData)

  return outputPath
}
