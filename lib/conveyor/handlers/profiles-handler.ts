import { handle } from '@/lib/main/shared'
import { prisma } from '@/lib/database/prisma'
import { encryptString, decryptString } from '@/lib/main/utils/encryption'

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
  smtpSecure?: boolean
  smtpUser?: string
  smtpPassword?: string
  smtpFromEmail?: string
  smtpFromName?: string
  isDefault?: boolean
  createdAt?: number
  updatedAt?: number
}

interface CompanyProfileCreate {
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
}

interface CompanyProfileUpdate extends Partial<CompanyProfileCreate> {
  id: number
}

export const registerProfilesHandlers = () => {
  // Get all profiles
  handle('quotify-profiles:getAll', async () => {
    try {
      const profiles = await prisma.companyProfile.findMany({
        orderBy: [{ isDefault: 'desc' }, { profileName: 'asc' }],
      })

      console.log('[profiles:getAll] Raw profiles from DB:', JSON.stringify(profiles, null, 2))

      return profiles.map((profile) => ({
        ...profile,
        smtpPassword: profile.smtpPassword ? '********' : undefined,
      }))
    } catch (error) {
      console.error('Error fetching profiles:', error)
      return []
    }
  })

  // Get profile by ID
  handle('quotify-profiles:getById', async (id: number) => {
    try {
      const profile = await prisma.companyProfile.findUnique({
        where: { id },
      })

      console.log('[profiles:getById] Raw profile from DB:', JSON.stringify(profile, null, 2))

      if (!profile) return null

      return {
        ...profile,
        smtpPassword: profile.smtpPassword ? '********' : undefined,
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  })

  // Get default profile
  handle('quotify-profiles:getDefault', async () => {
    try {
      const profile = await prisma.companyProfile.findFirst({
        where: { isDefault: 1 },
      })

      if (!profile) {
        const firstProfile = await prisma.companyProfile.findFirst({
          orderBy: { id: 'asc' },
        })

        if (!firstProfile) return null

        return firstProfile
      }

      return profile
    } catch (error) {
      console.error('Error fetching default profile:', error)
      return null
    }
  })

  // Create profile
  handle('quotify-profiles:create', async (profileData: CompanyProfileCreate) => {
    try {
      // If this is set as default, unset all other defaults
      if (profileData.isDefault) {
        await prisma.companyProfile.updateMany({
          data: { isDefault: 0 },
        })
      }

      // Encrypt password if provided
      const encryptedPassword = profileData.smtpPassword ? encryptString(profileData.smtpPassword) : null

      const result = await prisma.companyProfile.create({
        data: {
          profileName: profileData.profileName,
          businessName: profileData.businessName,
          vatNumber: profileData.vatNumber,
          address: profileData.address || null,
          zipCode: profileData.zipCode || null,
          city: profileData.city || null,
          phone: profileData.phone || null,
          email: profileData.email || null,
          smtpHost: profileData.smtpHost || null,
          smtpPort: profileData.smtpPort || 587,
          smtpSecure: profileData.smtpSecure ? 1 : 0,
          smtpUser: profileData.smtpUser || null,
          smtpPassword: encryptedPassword,
          smtpFromEmail: profileData.smtpFromEmail || null,
          smtpFromName: profileData.smtpFromName || null,
          isDefault: profileData.isDefault ? 1 : 0,
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000),
        },
      })

      return {
        success: true,
        id: result.id,
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Update profile
  handle('quotify-profiles:update', async (profileData: CompanyProfileUpdate) => {
    try {
      // If this is set as default, unset all other defaults
      if (profileData.isDefault) {
        await prisma.companyProfile.updateMany({
          where: { id: { not: profileData.id } },
          data: { isDefault: 0 },
        })
      }

      const fieldsToUpdate: any = {}

      if (profileData.profileName !== undefined) fieldsToUpdate.profileName = profileData.profileName
      if (profileData.businessName !== undefined) fieldsToUpdate.businessName = profileData.businessName
      if (profileData.vatNumber !== undefined) fieldsToUpdate.vatNumber = profileData.vatNumber
      if (profileData.address !== undefined) fieldsToUpdate.address = profileData.address || null
      if (profileData.zipCode !== undefined) fieldsToUpdate.zipCode = profileData.zipCode || null
      if (profileData.city !== undefined) fieldsToUpdate.city = profileData.city || null
      if (profileData.phone !== undefined) fieldsToUpdate.phone = profileData.phone || null
      if (profileData.email !== undefined) fieldsToUpdate.email = profileData.email || null
      if (profileData.smtpHost !== undefined) fieldsToUpdate.smtpHost = profileData.smtpHost || null
      if (profileData.smtpPort !== undefined) fieldsToUpdate.smtpPort = profileData.smtpPort
      if (profileData.smtpSecure !== undefined) fieldsToUpdate.smtpSecure = profileData.smtpSecure ? 1 : 0
      if (profileData.smtpUser !== undefined) fieldsToUpdate.smtpUser = profileData.smtpUser || null

      if (profileData.smtpPassword !== undefined && profileData.smtpPassword !== '********') {
        fieldsToUpdate.smtpPassword = profileData.smtpPassword ? encryptString(profileData.smtpPassword) : null
      }

      if (profileData.smtpFromEmail !== undefined) fieldsToUpdate.smtpFromEmail = profileData.smtpFromEmail || null
      if (profileData.smtpFromName !== undefined) fieldsToUpdate.smtpFromName = profileData.smtpFromName || null
      if (profileData.isDefault !== undefined) fieldsToUpdate.isDefault = profileData.isDefault ? 1 : 0

      if (Object.keys(fieldsToUpdate).length === 0) {
        return { success: true }
      }

      fieldsToUpdate.updatedAt = Math.floor(Date.now() / 1000)

      await prisma.companyProfile.update({
        where: { id: profileData.id },
        data: fieldsToUpdate,
      })

      return {
        success: true,
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Delete profile
  handle('quotify-profiles:delete', async (id: number) => {
    try {
      console.log('[quotify-profiles:delete] Deleting profile:', id)

      await prisma.companyProfile.delete({
        where: { id },
      })

      console.log('[quotify-profiles:delete] Profile deleted successfully')

      const defaultCount = await prisma.companyProfile.count({
        where: { isDefault: 1 },
      })

      if (defaultCount === 0) {
        const firstProfile = await prisma.companyProfile.findFirst({
          orderBy: { id: 'asc' },
        })

        if (firstProfile) {
          console.log('[quotify-profiles:delete] Setting new default profile:', firstProfile.id)
          await prisma.companyProfile.update({
            where: { id: firstProfile.id },
            data: { isDefault: 1 },
          })
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      console.error('[quotify-profiles:delete] Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile not found',
      }
    }
  })

  // Set default profile
  handle('quotify-profiles:setDefault', async (id: number) => {
    try {
      await prisma.companyProfile.updateMany({
        data: { isDefault: 0 },
      })

      await prisma.companyProfile.update({
        where: { id },
        data: { isDefault: 1 },
      })

      return {
        success: true,
      }
    } catch (error) {
      console.error('Error setting default profile:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}
