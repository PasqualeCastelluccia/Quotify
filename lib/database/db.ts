import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

// Get the user data directory
const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, 'quotify.db')

// Ensure the directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

// Initialize database
export const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize database schema
export const initializeDatabase = () => {
  // Create clienti table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clienti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      businessName TEXT NOT NULL,
      email TEXT NOT NULL,
      vatNumber TEXT NOT NULL,
      address TEXT,
      zipCode TEXT,
      city TEXT,
      createdAt INTEGER DEFAULT (unixepoch()),
      updatedAt INTEGER DEFAULT (unixepoch())
    )
  `)

  // Create prodotti table
  db.exec(`
    CREATE TABLE IF NOT EXISTS prodotti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codice TEXT NOT NULL,
      descrizione TEXT,
      misura TEXT,
      prezzo REAL NOT NULL,
      createdAt INTEGER DEFAULT (unixepoch()),
      updatedAt INTEGER DEFAULT (unixepoch())
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS preventivi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT NOT NULL UNIQUE,
      data TEXT NOT NULL,
      clienteId INTEGER,
      clienteBusinessName TEXT NOT NULL,
      clienteEmail TEXT,
      clienteVatNumber TEXT,
      clienteAddress TEXT,
      clienteZipCode TEXT,
      clienteCity TEXT,
      subtotal REAL NOT NULL,
      totalVat REAL NOT NULL,
      total REAL NOT NULL,
      notes TEXT,
      metadata TEXT,
      status TEXT DEFAULT 'draft',
      createdAt INTEGER DEFAULT (unixepoch()),
      updatedAt INTEGER DEFAULT (unixepoch()),
      FOREIGN KEY (clienteId) REFERENCES clienti(id) ON DELETE SET NULL
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS preventivi_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      preventivoId INTEGER NOT NULL,
      ordering INTEGER NOT NULL DEFAULT 0,
      prodottoId INTEGER,
      code TEXT NOT NULL,
      measure TEXT,
      description TEXT NOT NULL,
      unit TEXT NOT NULL,
      quantity REAL NOT NULL,
      unitPrice REAL NOT NULL,
      lineTotal REAL NOT NULL,
      discount1 REAL DEFAULT 0,
      discount2 REAL DEFAULT 0,
      discount3 REAL DEFAULT 0,
      netUnitPrice REAL NOT NULL,
      netLineTotal REAL NOT NULL,
      vatRate REAL DEFAULT 22.0,
      vatAmount REAL NOT NULL,
      createdAt INTEGER DEFAULT (unixepoch()),
      updatedAt INTEGER DEFAULT (unixepoch()),
      FOREIGN KEY (preventivoId) REFERENCES preventivi(id) ON DELETE CASCADE,
      FOREIGN KEY (prodottoId) REFERENCES prodotti(id) ON DELETE SET NULL
    )
  `)

  // Create company_profiles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS company_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profileName TEXT NOT NULL UNIQUE,
      businessName TEXT NOT NULL,
      vatNumber TEXT NOT NULL,
      address TEXT,
      zipCode TEXT,
      city TEXT,
      phone TEXT,
      email TEXT,
      smtpHost TEXT,
      smtpPort INTEGER DEFAULT 587,
      smtpSecure INTEGER DEFAULT 0,
      smtpUser TEXT,
      smtpPassword TEXT,
      smtpFromEmail TEXT,
      smtpFromName TEXT,
      isDefault INTEGER DEFAULT 0,
      createdAt INTEGER DEFAULT (unixepoch()),
      updatedAt INTEGER DEFAULT (unixepoch())
    )
  `)

  // Add companyProfileId to preventivi table if it doesn't exist
  const preventiviColumns = db.pragma('table_info(preventivi)')
  const hasCompanyProfileId = preventiviColumns.some((col: any) => col.name === 'companyProfileId')

  if (!hasCompanyProfileId) {
    db.exec(`
      ALTER TABLE preventivi ADD COLUMN companyProfileId INTEGER REFERENCES company_profiles(id) ON DELETE SET NULL
    `)
  }

  console.log('Database initialized successfully at:', dbPath)
}

// Graceful shutdown
export const closeDatabase = () => {
  db.close()
  console.log('Database closed')
}
