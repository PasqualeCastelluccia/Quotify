import { PrismaClient } from '@prisma/client'
import { app } from 'electron'
import path from 'path'

let prismaInstance: PrismaClient | null = null

function getDatabaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'quotify.db')
    return `file:${dbPath}`
  }
  return process.env.DATABASE_URL || 'file:./dev.db'
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaInstance) {
      const databaseUrl = getDatabaseUrl()
      console.log('Prisma Client connecting to:', databaseUrl)

      prismaInstance = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    }
    return prismaInstance[prop as keyof PrismaClient]
  },
})

export const initializePrisma = async () => {
  try {
    await prisma.$connect()
    console.log('Prisma Client connected successfully')
  } catch (error) {
    console.error('Failed to connect Prisma Client:', error)
    throw error
  }
}

export const closePrisma = async () => {
  try {
    if (prismaInstance) {
      await prismaInstance.$disconnect()
      console.log('Prisma Client disconnected')
    }
  } catch (error) {
    console.error('Error disconnecting Prisma Client:', error)
  }
}
