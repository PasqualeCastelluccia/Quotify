import { BrowserWindow, app } from 'electron'
import path from 'path'
import fs from 'fs'
import { prisma } from '@/lib/database/prisma'

interface QuoteData {
  quote: {
    id: number
    number: number
    revision: number
    date: string
    companyProfileId?: number
    customerBusinessName: string
    customerEmail?: string
    customerVatNumber?: string
    customerAddress?: string
    customerZipCode?: string
    customerCity?: string
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

function generateItemsHTML(items: QuoteData['items']): string {
  return items
    .map((item) => {
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
    })
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

async function renderQuoteHTML(data: QuoteData): Promise<string> {
  let companyData = DEFAULT_COMPANY_DATA

  if (data.quote.companyProfileId) {
    try {
      const profile = await prisma.companyProfile.findUnique({
        where: { id: data.quote.companyProfileId },
      })

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
    }
  } else {
    try {
      const profile = await prisma.companyProfile.findFirst({
        where: { isDefault: 1 },
      })

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
    }
  }

  let templatePath: string

  if (app.isPackaged) {
    templatePath = path.join(process.resourcesPath, 'lib', 'preventivo.html')
  } else {
    templatePath = path.join(__dirname, '../..', 'lib', 'templates', 'preventivo.html')
  }

  console.log('🔍 Template path:', templatePath)
  console.log('📁 Template exists:', fs.existsSync(templatePath))

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at: ${templatePath}`)
  }

  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8')

  const customerCity = [data.quote.customerZipCode, data.quote.customerCity].filter(Boolean).join(' ')

  htmlTemplate = htmlTemplate
    .replace(/{{COMPANY_NAME}}/g, companyData.name)
    .replace(/{{COMPANY_ADDRESS}}/g, companyData.address)
    .replace(/{{COMPANY_CITY}}/g, companyData.city)
    .replace(/{{COMPANY_VAT}}/g, companyData.vat)
    .replace(/{{COMPANY_PHONE}}/g, companyData.phone)
    .replace(/{{COMPANY_EMAIL}}/g, companyData.email)
    .replace(/{{NUMERO}}/g, String(data.quote.number))
    .replace(/{{REVISIONE}}/g, String(data.quote.revision))
    .replace(/{{DATA}}/g, formatDate(data.quote.date))
    .replace(/{{CLIENTE_NAME}}/g, data.quote.customerBusinessName)
    .replace(/{{CLIENTE_ADDRESS}}/g, data.quote.customerAddress || '-')
    .replace(/{{CLIENTE_CITY}}/g, customerCity || '-')
    .replace(/{{CLIENTE_EMAIL}}/g, data.quote.customerEmail || '-')
    .replace(/{{CLIENTE_VAT}}/g, data.quote.customerVatNumber || '-')
    .replace(/{{ITEMS}}/g, generateItemsHTML(data.items))
    .replace(/{{SUBTOTAL}}/g, formatCurrency(data.quote.subtotal))
    .replace(/{{VAT}}/g, formatCurrency(data.quote.totalVat))
    .replace(/{{TOTAL}}/g, formatCurrency(data.quote.total))
    .replace(/{{NOTES_SECTION}}/g, generateNotesSection(data.quote.notes))
    .replace(/{{METADATA_SECTION}}/g, generateMetadataSection(data.quote.metadata))
    .replace(/{{GENERATED_DATE}}/g, new Date().toLocaleString('it-IT'))

  return htmlTemplate
}

export async function generateQuotePDF(data: QuoteData): Promise<string> {
  const htmlTemplate = await renderQuoteHTML(data)

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

  const fileName = `preventivo_${data.quote.number}_rev${data.quote.revision}.pdf`
  const outputPath = path.join(pdfsDir, fileName)

  fs.writeFileSync(outputPath, pdfData)

  return outputPath
}

export const generatePreventivoPDF = generateQuotePDF

// Export HTML rendering function for preview
export { renderQuoteHTML as generateQuoteHTML }
