import { PrismaClient } from '@prisma/client'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

let prismaInstance: PrismaClient | null = null

async function ensureDatabaseExists(dbPath: string) {
  const dbExists = fs.existsSync(dbPath)
  
  console.log('Controllo database:', dbPath)
  console.log('Database esiste:', dbExists)
  
  // Verifica che il database esista
  if (!dbExists) {
    throw new Error(`Database non trovato in: ${dbPath}. Creare il database prima di avviare l'applicazione.`)
  }
  
  // Verifica i permessi
  try {
    fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK)
    console.log('✓ Permessi di lettura/scrittura OK')
  } catch (error) {
    console.error('✗ Errore permessi sul database:', error)
    throw new Error(`Nessun permesso di lettura/scrittura sul database: ${dbPath}`)
  }
  
  // Rimuovi file di lock se esistono
  const lockFiles = [
    `${dbPath}-journal`,
    `${dbPath}-wal`,
    `${dbPath}-shm`
  ]
  
  for (const lockFile of lockFiles) {
    if (fs.existsSync(lockFile)) {
      try {
        fs.unlinkSync(lockFile)
        console.log('✓ Rimosso file di lock:', lockFile)
      } catch (error) {
        console.warn('⚠ Impossibile rimuovere lock file:', lockFile, error)
      }
    }
  }
  
  console.log('✓ Database esistente e accessibile')
}

async function applyMigrationsIfNeeded(prismaClient: PrismaClient, dbPath: string) {
  try {
    // Verifica se le tabelle esistono provando una query semplice
    await prismaClient.customer.findFirst()
    console.log('Le tabelle esistono già')
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('Tabelle non trovate, applicazione schema...')
      
      // Esegui db push per creare le tabelle
      const { execSync } = require('child_process')
      
      try {
        const schemaPath = app.isPackaged 
          ? path.join(process.resourcesPath, 'prisma', 'schema.prisma')
          : path.join(__dirname, '../../prisma/schema.prisma')
        
        console.log('Schema path:', schemaPath)
        console.log('Esecuzione: prisma db push')
        
        // Esegui prisma db push
        execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
          env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
          stdio: 'inherit'
        })
        
        console.log('Schema applicato con successo!')
      } catch (pushError) {
        console.error('Errore durante l\'applicazione dello schema:', pushError)
        throw pushError
      }
    } else {
      throw error
    }
  }
}

function getDatabaseUrl(): string {
  if (app.isPackaged || !process.defaultApp) {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'prisma_quotify.db')
    console.log('Production mode - Database path:', dbPath)
    return `file:${dbPath}`
  }
  
  // Trova la root del progetto e costruisci il path assoluto
  const projectRoot = path.resolve(__dirname, '../..') // Vai alla root del progetto
  const devDbPath = path.join(projectRoot, 'prisma', 'prisma_quotify.db')
  console.log('Development mode - Database path:', devDbPath)
  console.log('Project root:', projectRoot)
  return `file:${devDbPath}`
}

// Imposta DATABASE_URL SUBITO all'avvio
const DATABASE_URL = getDatabaseUrl()
process.env.DATABASE_URL = DATABASE_URL
console.log('DATABASE_URL impostata:', process.env.DATABASE_URL)

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaInstance) {
      console.log('Creazione PrismaClient con DATABASE_URL:', process.env.DATABASE_URL)

      prismaInstance = new PrismaClient({
        log: ['query', 'error', 'warn'],
      })
    }
    return prismaInstance[prop as keyof PrismaClient]
  },
})

export const initializePrisma = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL!
    const dbPath = dbUrl.replace('file:', '')
    
    console.log('=== Inizializzazione Prisma ===')
    console.log('Database path:', dbPath)
    
    // Step 1: Assicurati che la directory esista
    await ensureDatabaseExists(dbPath)
    
    // Step 2: Connetti a Prisma
    console.log('Connessione a Prisma Client...')
    await prisma.$connect()
    console.log('Prisma Client connesso')
    
    // Step 3: Applica le migrazioni se necessario
    await applyMigrationsIfNeeded(prisma, dbPath)
    
    console.log('Prisma Client inizializzato con successo!')
  } catch (error) {
    console.error('Errore durante l\'inizializzazione di Prisma:', error)
    throw error
  }
}

export const closePrisma = async () => {
  try {
    if (prismaInstance) {
      await prismaInstance.$disconnect()
      console.log('Prisma Client disconnesso')
    }
  } catch (error) {
    console.error('Errore durante la disconnessione di Prisma:', error)
  }
}