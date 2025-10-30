import { safeStorage } from 'electron'

/**
 * Encrypts a string using Electron's safeStorage
 * @param plainText - The string to encrypt
 * @returns Base64 encoded encrypted string, or null if encryption is not available
 */
export function encryptString(plainText: string): string | null {
  if (!plainText) return null

  if (!safeStorage.isEncryptionAvailable()) {
    console.warn('Encryption is not available on this system')
    return plainText // Fallback to plain text if encryption not available
  }

  try {
    const encrypted = safeStorage.encryptString(plainText)
    return encrypted.toString('base64')
  } catch (error) {
    console.error('Error encrypting string:', error)
    return null
  }
}

/**
 * Decrypts a base64 encoded string using Electron's safeStorage
 * @param encryptedBase64 - The base64 encoded encrypted string
 * @returns Decrypted string, or null if decryption fails
 */
export function decryptString(encryptedBase64: string): string | null {
  if (!encryptedBase64) return null

  if (!safeStorage.isEncryptionAvailable()) {
    console.warn('Encryption is not available on this system')
    return encryptedBase64 // Fallback: assume it's plain text
  }

  try {
    const buffer = Buffer.from(encryptedBase64, 'base64')
    const decrypted = safeStorage.decryptString(buffer)
    return decrypted
  } catch (error) {
    console.error('Error decrypting string:', error)
    // Fallback: might be plain text from older version
    return encryptedBase64
  }
}
