import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

// Create a Turso client
const libsql = createClient({
  // url: 'file:./dev.db',
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})

// Adapter for Turso
const adapter = new PrismaLibSQL(libsql)

// Initialize Prisma Client
const prisma = new PrismaClient({
  adapter,
})

export default prisma
