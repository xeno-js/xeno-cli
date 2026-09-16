import path from 'node:path'

import { type IFileService, type IGenerator } from '../../domain'
import { CORE_CONSTANTS, type CoreOptions } from '../../shared'
import { FileUtils } from '../file/file.service'

export class EnvGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: CoreOptions): Promise<void> {
    const fileUtils = new FileUtils()

    let content = `# ─────────────────────────────────────────────────────────────────────────────
# Xeno APPLICATION ENVIRONMENT VARIABLES
# ─────────────────────────────────────────────────────────────────────────────
NODE_ENV=development
`

    // Configurazione Database
    if (options.database !== CORE_CONSTANTS.NONE) {
      if (options.database === CORE_CONSTANTS.DRIZZLE) {
        content += `\n# --- Database (PostgreSQL) ---
    DATABASE_URL=postgres://postgres:password@localhost:5432/xeno_db
    `
      } else if (options.database === CORE_CONSTANTS.SQL_LITE) {
        content += `\n# --- Database (SQLite) ---
    SQLITE_DATABASE_URL=file:./dev.sqlite
    `
      }
    }

    if (options.axios) {
      content += `\n# --- Axios ---
BASE_URL=
`
    }

    // Configurazione Redis (Caching, Idempotenza, Concorrenza)
    if (options.redis) {
      content += `\n# --- Cache (Redis) ---
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_USERNAME=
REDIS_TLS=false
`
    }

    // Configurazione Supabase (Autenticazione)
    if (options.supabase) {
      content += `\n# --- Authentication (Supabase) ---
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
`
    }

    // Configurazione Logging & Observability
    if (options.sentry) {
      content += `\n# --- Error Tracking (Sentry) ---
SENTRY_DSN=https://your-sentry-dsn@o0.ingest.sentry.io/0
SENTRY_ENVIRONMENT=development
`
    }

    // Creiamo sia il file effettivo che il file di esempio
    const envPath = path.join(projectPath, '.env')
    const envExamplePath = path.join(projectPath, '.env.example')

    await fileUtils.writeFileRecursive(envPath, content)
    await fileUtils.writeFileRecursive(envExamplePath, content)
  }
}
