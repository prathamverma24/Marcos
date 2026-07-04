type EnvMap = Record<string, string | undefined>

function clean(value: string | undefined) {
  return value?.trim() || ''
}

function hasPasswordPlaceholder(value: string) {
  return value.includes('[YOUR-PASSWORD]') || value.includes('<YOUR-PASSWORD>')
}

function buildSupabasePoolerUrl(env: EnvMap, projectRef: string, password: string) {
  const poolerHost = clean(env.SUPABASE_POOLER_HOST)

  if (!poolerHost) {
    return undefined
  }

  const poolerPort = clean(env.SUPABASE_POOLER_PORT) || '6543'
  const poolerUser = clean(env.SUPABASE_POOLER_USER) || `postgres.${projectRef}`

  return `postgresql://${encodeURIComponent(poolerUser)}:${encodeURIComponent(password)}@${poolerHost}:${poolerPort}/postgres`
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

  const poolerUrl = buildSupabasePoolerUrl(env, projectRef, password)

  if (poolerUrl) {
    return poolerUrl
  }

  return `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`
}
