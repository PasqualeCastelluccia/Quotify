import type { RigaPreventivo } from '@/app/types/preventivo'

interface CompanyData {
  name: string
  address: string
  city: string
  vat: string
  phone: string
  email: string
}

interface ClientData {
  businessName: string
  address?: string
  city?: string
  email?: string
  vatNumber?: string
}

interface PreventivoPreviewData {
  numero: string
  data: string
  company: CompanyData
  client: ClientData
  items: RigaPreventivo[]
  subtotal: number
  totalVat: number
  total: number
  notes?: string
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

function generateItemsHTML(items: RigaPreventivo[]): string {
  return items
    .map((item) => {
      return `
    <tr>
      <td class="item-code">${item.codice}</td>
      <td>${item.misura || '-'}</td>
      <td class="item-description">${item.descrizione}</td>
      <td class="center">${item.um}</td>
      <td class="right">${item.quantita.toFixed(2)}</td>
      <td class="right">€ ${formatCurrency(item.listinoCad)}</td>
      <td class="right">€ ${formatCurrency(item.totListinoRiga)}</td>
      <td class="right">${formatDiscount(item.sc1)}</td>
      <td class="right">${formatDiscount(item.sc2)}</td>
      <td class="right">${formatDiscount(item.sc3)}</td>
      <td class="right">€ ${formatCurrency(item.nettoUnitario)}</td>
      <td class="right"><strong>€ ${formatCurrency(item.nettoRiga)}</strong></td>
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

export function generatePreventivoHTML(data: PreventivoPreviewData): string {
  const template = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preventivo ${data.numero}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: A4;
      margin: 10mm 8mm;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 8pt;
      line-height: 1.3;
      color: #1a1a1a;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #1a1a1a;
    }

    .header-left {
      display: flex;
      align-items: baseline;
      gap: 5px;
    }

    .header-right {
      display: flex;
      align-items: baseline;
    }

    .document-title {
      font-size: 14pt;
      font-weight: bold;
      color: #1a1a1a;
    }

    .document-number {
      font-size: 14pt;
      color: #1a1a1a;
      font-weight: 600;
    }

    .document-date {
      font-size: 10pt;
      color: #1a1a1a;
    }

    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 9pt;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e5e7eb;
    }

    .parties-container {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }

    .party-box {
      flex: 1;
      background: #f9fafb;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #d1d5db;
    }

    .party-title {
      font-size: 8pt;
      font-weight: bold;
      color: #6b7280;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .party-name {
      font-size: 10pt;
      font-weight: bold;
      margin-bottom: 6px;
      color: #1a1a1a;
    }

    .party-details {
      font-size: 7pt;
      color: #666;
      line-height: 1.6;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 7pt;
      border: 1px solid #9ca3af;
    }

    thead {
      background: #1a1a1a;
      color: white;
    }

    th {
      padding: 6px 2px;
      text-align: center;
      font-weight: 600;
      font-size: 7pt;
      border: 1px solid #9ca3af;
    }

    th.right, td.right {
      text-align: center;
    }

    th.center, td.center {
      text-align: center;
    }

    tbody tr {
      border: 1px solid #9ca3af;
    }

    tbody tr:hover {
      background: #f9fafb;
    }

    td {
      padding: 6px 2px;
      color: #1a1a1a;
      border: 1px solid #9ca3af;
      text-align: center;
    }

    .item-code {
      font-family: 'Courier New', monospace;
      color: #1a1a1a;
      font-weight: 600;
    }

    .item-description {
      color: #4b5563;
      line-height: 1.5;
    }

    .totals {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .totals-table {
      width: 250px;
      font-size: 8pt;
    }

    .totals-table tr {
      border-bottom: 1px solid #e5e7eb;
    }

    .totals-table td {
      padding: 6px 10px;
    }

    .totals-table .label {
      font-weight: 500;
      color: #4b5563;
      text-align: center;
    }

    .totals-table .value {
      text-align: center;
      font-weight: 600;
      color: #1a1a1a;
    }

    .totals-table .total-row {
      background: #1a1a1a;
      color: white !important;
      font-size: 10pt;
    }

    .totals-table .total-row td {
      font-weight: bold;
      padding: 8px 10px;
      color: white !important;
    }

    .notes {
      margin-top: 30px;
      padding: 15px;
      background: #fffbeb;
      border-left: 3px solid #f59e0b;
      border-radius: 6px;
    }

    .notes-title {
      font-weight: bold;
      color: #92400e;
      margin-bottom: 8px;
    }

    .notes-content {
      color: #78350f;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 8pt;
      color: #9ca3af;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <span class="document-title">PREVENTIVO N.</span>
      <span class="document-number">${data.numero}</span>
    </div>
    <div class="header-right">
      <span class="document-date">${formatDate(data.data)}</span>
    </div>
  </div>

  <div class="section">
    <div class="parties-container">
      <div class="party-box">
        <div class="party-title">Spett.le</div>
        <div class="party-info">
          <div class="party-name">${data.client.businessName}</div>
          <div class="party-details">
            ${data.client.address || '-'}<br>
            ${data.client.city || '-'}<br>
            ${data.client.email || '-'}<br>
            P.IVA: ${data.client.vatNumber || '-'}
          </div>
        </div>
      </div>
      <div class="party-box">
        <div class="party-title">Da</div>
        <div class="party-info">
          <div class="party-name">${data.company.name}</div>
          <div class="party-details">
            ${data.company.address}<br>
            ${data.company.city}<br>
            ${data.company.email}<br>
            ${data.company.phone}<br>
            P.IVA: ${data.company.vat}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Dettaglio Offerta</div>
    <table>
      <thead>
        <tr>
          <th style="width: 5.5%">Codice</th>
          <th style="width: 4.5%">Misura</th>
          <th style="width: 18%">Descrizione</th>
          <th class="center" style="width: 4%">U.M.</th>
          <th class="right" style="width: 5%">Q.tà</th>
          <th class="right" style="width: 8%">List. Cad.</th>
          <th class="right" style="width: 8%">Tot. List.</th>
          <th class="right" style="width: 4.5%">SC1%</th>
          <th class="right" style="width: 4.5%">SC2%</th>
          <th class="right" style="width: 4.5%">SC3%</th>
          <th class="right" style="width: 9.5%">Netto Un.</th>
          <th class="right" style="width: 10%">Netto Riga</th>
        </tr>
      </thead>
      <tbody>
        ${generateItemsHTML(data.items)}
      </tbody>
    </table>
  </div>

  <div class="totals">
    <table class="totals-table">
      <tr>
        <td class="label">Subtotale</td>
        <td class="value">€ ${formatCurrency(data.subtotal)}</td>
      </tr>
      <tr>
        <td class="label">IVA (22%)</td>
        <td class="value">€ ${formatCurrency(data.totalVat)}</td>
      </tr>
      <tr class="total-row">
        <td>TOTALE</td>
        <td>€ ${formatCurrency(data.total)}</td>
      </tr>
    </table>
  </div>

  ${generateNotesSection(data.notes)}

  <div class="footer">
    <p>Documento generato automaticamente il ${new Date().toLocaleString('it-IT')}</p>
    <p>${data.company.name} - P.IVA ${data.company.vat}</p>
  </div>
</body>
</html>`

  return template
}
