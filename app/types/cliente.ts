export interface Cliente {
  id: number
  businessName: string
  email: string
  vatNumber: string
  address?: string | null
  zipCode?: string | null
  city?: string | null
  createdAt?: number
  updatedAt?: number
}
