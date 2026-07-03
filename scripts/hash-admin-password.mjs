import { hash } from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "your-admin-password"')
  process.exit(1)
}

const passwordHash = await hash(password, 12)
console.log(passwordHash)
