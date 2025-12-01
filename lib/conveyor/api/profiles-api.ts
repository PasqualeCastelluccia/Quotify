import { ConveyorApi } from '@/lib/preload/shared'

export interface CompanyProfile {
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
  smtpSecure?: boolean
  smtpUser?: string
  smtpPassword?: string
  smtpFromEmail?: string
  smtpFromName?: string
  isDefault?: boolean
  createdAt?: number
  updatedAt?: number
}

export type CompanyProfileCreate = Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt'>
export type CompanyProfileUpdate = Partial<CompanyProfileCreate> & { id: number }

export class ProfilesApi extends ConveyorApi {
  getAll = () => this.invoke('quotify-profiles:getAll')

  getById = (id: number) => this.invoke('quotify-profiles:getById', id)

  getDefault = () => this.invoke('quotify-profiles:getDefault')

  create = (profileData: CompanyProfileCreate) => this.invoke('quotify-profiles:create', profileData)

  update = (profileData: CompanyProfileUpdate) => this.invoke('quotify-profiles:update', profileData)

  delete = (id: number) => this.invoke('quotify-profiles:delete', id)

  setDefault = (id: number) => this.invoke('quotify-profiles:setDefault', id)
}
