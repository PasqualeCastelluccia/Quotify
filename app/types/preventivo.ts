export interface RigaPreventivo {
  id: string
  codice: string
  misura: string
  descrizione: string
  um: string
  quantita: number
  listinoCad: number
  totListinoRiga: number
  sc1: number
  sc2: number
  sc3: number
  nettoUnitario: number
  nettoRiga: number
}

export interface PreventivoItem {
  id: number
  preventivoId: number
  ordering: number
  prodottoId?: number
  code: string
  measure?: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  lineTotal: number
  discount1: number
  discount2: number
  discount3: number
  netUnitPrice: number
  netLineTotal: number
  vatRate: number
  vatAmount: number
  createdAt?: number
  updatedAt?: number
}

export interface Preventivo {
  id: number
  numero: string
  data: string
  companyProfileId?: number
  clienteId?: number
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
  createdAt?: number
  updatedAt?: number
}

export interface PreventivoWithItems extends Preventivo {
  items: PreventivoItem[]
}
