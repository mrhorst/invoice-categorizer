import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

// Create a Turso client
const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})

declare global {
  var prisma: PrismaClient | undefined
}

// Adapter for Turso
const adapter = new PrismaLibSQL(libsql)

// Initialize Prisma Client
const prisma = global.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma // Cache Prisma client in development
}

export default prisma
