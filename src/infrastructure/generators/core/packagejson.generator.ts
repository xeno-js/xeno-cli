import path from 'node:path'

import type { IFileService, IGenerator } from '../../../domain'
import { CORE_CONSTANTS, type CoreOptions } from '../../../shared'

export class PackageJsonCoreGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: CoreOptions): Promise<void> {
    const packageJson = {
      name: options.targetDir,
      version: '1.0.0',
      private: true,
      main: './dist/index.js',
      module: './dist/index.js',
      types: './dist/index.d.ts',
      scripts: {
        start: 'tsx src/main.ts',
        build: 'tsc --project tsconfig.json',
        g: 'xeno-js generate',
      } as Record<string, string>,
      dependencies: {
        '@xeno-js/core': 'latest',
        'dotenv': '^16.4.5',
      } as Record<string, string>,
      devDependencies: {
        '@types/node': '^20.0.0',
        'tsx': '^4.7.0',
        'typescript': '^5.8.0',
      } as Record<string, string>,
    }

    // Database & ORM
    if (options.database !== CORE_CONSTANTS.NONE) {
      packageJson.dependencies['drizzle-orm'] = '^0.45.3'
      packageJson.dependencies['pg'] = '^8.23.0'
      packageJson.dependencies['postgres'] = '^3.4.9'
      packageJson.devDependencies['@types/pg'] = '^8.23.1'
      packageJson.devDependencies['drizzle-kit'] = '^0.31.11'
      packageJson.scripts['db:migrate'] = 'drizzle-kit migrate'
      packageJson.dependencies['drizzle-orm'] = '^0.45.3'
      packageJson.devDependencies['drizzle-kit'] = '^0.31.11'
      packageJson.dependencies['@libsql/client'] = '^0.14.0'
      packageJson.scripts['db:generate'] = 'drizzle-kit generate'
      packageJson.scripts['db:push'] = 'drizzle-kit push'
    }

    // HTTP / External Calls
    if (options.axios) packageJson.dependencies['axios'] = '^1.20.0'
    if (options.cockatiel) packageJson.dependencies['cockatiel'] = '^4.0.0'

    // Logging & Observability
    if (options.pino) {
      packageJson.dependencies['pino'] = '^10.3.1'
      packageJson.devDependencies['pino-pretty'] = '^11.2.2'
    }
    if (options.sentry) packageJson.dependencies['@sentry/node'] = '^11.0.0'

    // Services
    if (options.redis) packageJson.dependencies['ioredis'] = '^6.0.0'
    if (options.supabase) {
      packageJson.dependencies['@supabase/supabase-js'] = '^2.117.1'
      packageJson.dependencies['@supabase/ssr'] = '^0.12.7'
    }
    if (options.zod) packageJson.dependencies['zod'] = '^4.6.5'

    const filePath = path.join(projectPath, 'package.json')
    await this._fileService.writeFileRecursive(filePath, JSON.stringify(packageJson, null, 2))
  }
}
