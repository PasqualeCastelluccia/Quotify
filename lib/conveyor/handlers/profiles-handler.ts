import { handle } from '@/lib/main/shared'
import { db } from '@/lib/database/db'
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
  handle('profiles:getAll', async () => {
    try {
      const stmt = db.prepare('SELECT * FROM company_profiles ORDER BY isDefault DESC, profileName ASC')
      const profiles = stmt.all() as CompanyProfile[]

      // Decrypt passwords for display (we'll show masked in UI)
      return profiles.map((profile) => ({
        ...profile,
        smtpSecure: profile.smtpSecure === 1,
        isDefault: profile.isDefault === 1,
        // Don't send decrypted password to frontend for security
        smtpPassword: profile.smtpPassword ? '********' : undefined,
      }))
    } catch (error) {
      console.error('Error fetching profiles:', error)
      return []
    }
  })

  // Get profile by ID
  handle('profiles:getById', async (id: number) => {
    try {
      const stmt = db.prepare('SELECT * FROM company_profiles WHERE id = ?')
      const profile = stmt.get(id) as CompanyProfile | undefined

      if (!profile) return null

      // Don't decrypt password, just mask it for security
      // Password will only be updated if user enters a new one
      return {
        ...profile,
        smtpSecure: profile.smtpSecure === 1,
        isDefault: profile.isDefault === 1,
        smtpPassword: profile.smtpPassword ? '********' : undefined,
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  })

  // Get default profile
  handle('profiles:getDefault', async () => {
    try {
      const stmt = db.prepare('SELECT * FROM company_profiles WHERE isDefault = 1 LIMIT 1')
      const profile = stmt.get() as CompanyProfile | undefined

      if (!profile) {
        // If no default, get the first one
        const firstStmt = db.prepare('SELECT * FROM company_profiles ORDER BY id ASC LIMIT 1')
        const firstProfile = firstStmt.get() as CompanyProfile | undefined

        if (!firstProfile) return null

        return {
          ...firstProfile,
          smtpSecure: firstProfile.smtpSecure === 1,
          isDefault: firstProfile.isDefault === 1,
        }
      }

      return {
        ...profile,
        smtpSecure: profile.smtpSecure === 1,
        isDefault: true,
      }
    } catch (error) {
      console.error('Error fetching default profile:', error)
      return null
    }
  })

  // Create profile
  handle('profiles:create', async (profileData: CompanyProfileCreate) => {
    try {
      // If this is set as default, unset all other defaults
      if (profileData.isDefault) {
        db.prepare('UPDATE company_profiles SET isDefault = 0').run()
      }

      // Encrypt password if provided
      const encryptedPassword = profileData.smtpPassword
        ? encryptString(profileData.smtpPassword)
        : null

      const dataToInsert = {
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
      }

      const stmt = db.prepare(`
        INSERT INTO company_profiles (
          profileName, businessName, vatNumber, address, zipCode, city, phone, email,
          smtpHost, smtpPort, smtpSecure, smtpUser, smtpPassword, smtpFromEmail, smtpFromName,
          isDefault
        )
        VALUES (
          @profileName, @businessName, @vatNumber, @address, @zipCode, @city, @phone, @email,
          @smtpHost, @smtpPort, @smtpSecure, @smtpUser, @smtpPassword, @smtpFromEmail, @smtpFromName,
          @isDefault
        )
      `)

      const result = stmt.run(dataToInsert)

      return {
        success: true,
        id: result.lastInsertRowid as number,
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
  handle('profiles:update', async (profileData: CompanyProfileUpdate) => {
    try {
      // If this is set as default, unset all other defaults
      if (profileData.isDefault) {
        db.prepare('UPDATE company_profiles SET isDefault = 0 WHERE id != ?').run(profileData.id)
      }

      // Build update query dynamically based on provided fields
      const updates: string[] = []
      const params: Record<string, any> = { id: profileData.id }

      if (profileData.profileName !== undefined) {
        updates.push('profileName = @profileName')
        params.profileName = profileData.profileName
      }
      if (profileData.businessName !== undefined) {
        updates.push('businessName = @businessName')
        params.businessName = profileData.businessName
      }
      if (profileData.vatNumber !== undefined) {
        updates.push('vatNumber = @vatNumber')
        params.vatNumber = profileData.vatNumber
      }
      if (profileData.address !== undefined) {
        updates.push('address = @address')
        params.address = profileData.address || null
      }
      if (profileData.zipCode !== undefined) {
        updates.push('zipCode = @zipCode')
        params.zipCode = profileData.zipCode || null
      }
      if (profileData.city !== undefined) {
        updates.push('city = @city')
        params.city = profileData.city || null
      }
      if (profileData.phone !== undefined) {
        updates.push('phone = @phone')
        params.phone = profileData.phone || null
      }
      if (profileData.email !== undefined) {
        updates.push('email = @email')
        params.email = profileData.email || null
      }
      if (profileData.smtpHost !== undefined) {
        updates.push('smtpHost = @smtpHost')
        params.smtpHost = profileData.smtpHost || null
      }
      if (profileData.smtpPort !== undefined) {
        updates.push('smtpPort = @smtpPort')
        params.smtpPort = profileData.smtpPort
      }
      if (profileData.smtpSecure !== undefined) {
        updates.push('smtpSecure = @smtpSecure')
        params.smtpSecure = profileData.smtpSecure ? 1 : 0
      }
      if (profileData.smtpUser !== undefined) {
        updates.push('smtpUser = @smtpUser')
        params.smtpUser = profileData.smtpUser || null
      }
      if (profileData.smtpPassword !== undefined && profileData.smtpPassword !== '********') {
        // Only update password if it's not the masked value
        updates.push('smtpPassword = @smtpPassword')
        params.smtpPassword = profileData.smtpPassword ? encryptString(profileData.smtpPassword) : null
      }
      if (profileData.smtpFromEmail !== undefined) {
        updates.push('smtpFromEmail = @smtpFromEmail')
        params.smtpFromEmail = profileData.smtpFromEmail || null
      }
      if (profileData.smtpFromName !== undefined) {
        updates.push('smtpFromName = @smtpFromName')
        params.smtpFromName = profileData.smtpFromName || null
      }
      if (profileData.isDefault !== undefined) {
        updates.push('isDefault = @isDefault')
        params.isDefault = profileData.isDefault ? 1 : 0
      }

      if (updates.length === 0) {
        return { success: true }
      }

      updates.push('updatedAt = unixepoch()')

      const query = `UPDATE company_profiles SET ${updates.join(', ')} WHERE id = @id`
      const stmt = db.prepare(query)
      const result = stmt.run(params)

      if (result.changes === 0) {
        return {
          success: false,
          error: 'Profile not found',
        }
      }

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
  handle('profiles:delete', async (id: number) => {
    try {
      console.log('[profiles:delete] Deleting profile:', id)

      const stmt = db.prepare('DELETE FROM company_profiles WHERE id = ?')
      const result = stmt.run(id)

      if (result.changes === 0) {
        console.log('[profiles:delete] Profile not found')
        return {
          success: false,
          error: 'Profilo non trovato',
        }
      }

      console.log('[profiles:delete] Profile deleted successfully')

      // If we deleted the default profile, set another one as default (if any profiles remain)
      const defaultCheck = db.prepare('SELECT COUNT(*) as count FROM company_profiles WHERE isDefault = 1')
      const { count: defaultCount } = defaultCheck.get() as { count: number }

      if (defaultCount === 0) {
        // Try to set the first remaining profile as default
        const firstProfileStmt = db.prepare('SELECT id FROM company_profiles ORDER BY id ASC LIMIT 1')
        const firstProfile = firstProfileStmt.get() as { id: number } | undefined

        if (firstProfile) {
          console.log('[profiles:delete] Setting new default profile:', firstProfile.id)
          const updateStmt = db.prepare('UPDATE company_profiles SET isDefault = 1 WHERE id = ?')
          updateStmt.run(firstProfile.id)
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      console.error('[profiles:delete] Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
      }
    }
  })

  // Set default profile
  handle('profiles:setDefault', async (id: number) => {
    try {
      // Unset all defaults
      db.prepare('UPDATE company_profiles SET isDefault = 0').run()

      // Set new default
      const stmt = db.prepare('UPDATE company_profiles SET isDefault = 1 WHERE id = ?')
      const result = stmt.run(id)

      if (result.changes === 0) {
        return {
          success: false,
          error: 'Profile not found',
        }
      }

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
