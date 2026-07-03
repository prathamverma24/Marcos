type EnvMap = Record<string, string | undefined>

function clean(value: string | undefined) {
  return value?.trim() || ''
}

function hasPasswordPlaceholder(value: string) {
  return value.includes('[YOUR-PASSWORD]') || value.includes('<YOUR-PASSWORD>')
}

export function getDatabaseUrl(env: EnvMap = process.env) {
  const explicitUrl = clean(env.DATABASE_URL) || clean(env.SUPABASE_DATABASE_URL)

  if (explicitUrl && !hasPasswordPlaceholder(explicitUrl)) {
    return explicitUrl
  }

  const projectRef = clean(env.SUPABASE_PROJECT_REF)
  const password = clean(env.SUPABASE_DB_PASSWORD)

  if (!projectRef || !password || hasPasswordPlaceholder(password)) {
    return undefined
  }

  return `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`
}
