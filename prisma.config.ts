import { defineConfig } from 'prisma/config'
import fs from 'node:fs'
import path from 'node:path'

function loadEnvFile(fileName: string) {
  const filePath = path.join(process.cwd(), fileName)

  if (!fs.existsSync(filePath)) {
    return
  }

  const content = fs.readFileSync(filePath, 'utf8')

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      return
    }

    const separator = trimmed.indexOf('=')
    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '')

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  })
}

loadEnvFile('.env.local')
loadEnvFile('.env')

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/marcos_water?schema=public',
  },
})
