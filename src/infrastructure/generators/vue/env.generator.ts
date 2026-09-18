// src/infrastructure/generators/env-vue.generator.ts
import path from 'node:path'

import { type IFileService, type IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class EnvVueGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
    let content = `# ─────────────────────────────────────────────────────────────────────────────
# Xeno VUE APPLICATION ENVIRONMENT VARIABLES
# ─────────────────────────────────────────────────────────────────────────────
VITE_APP_ENV=development
`

    if (options.axios) {
      content += `\n# --- Axios ---
VITE_API_BASE_URL=http://localhost:3000
`
    }

    if (options.supabase) {
      content += `\n# --- Authentication (Supabase) ---
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
`
    }

    if (options.sentry) {
      content += `\n# --- Error Tracking (Sentry) ---
VITE_SENTRY_DSN=https://your-sentry-dsn@o0.ingest.sentry.io/0
`
    }

    await this._fileService.writeFileRecursive(path.join(projectPath, '.env'), content)
    await this._fileService.writeFileRecursive(path.join(projectPath, '.env.example'), content)
  }
}
