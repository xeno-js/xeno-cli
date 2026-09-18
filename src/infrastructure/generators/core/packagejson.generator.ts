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
        'typescript': '^5.4.0',
      } as Record<string, string>,
    }

    // Database & ORM
    if (options.database !== CORE_CONSTANTS.NONE) {
      if (options.database === CORE_CONSTANTS.DRIZZLE) {
        packageJson.dependencies['drizzle-orm'] = '^0.45.2'
        packageJson.dependencies['pg'] = '^8.22.0'
        packageJson.dependencies['postgres'] = '^3.4.9'
        packageJson.devDependencies['@types/pg'] = '^8.11.0'
        packageJson.devDependencies['drizzle-kit'] = '^0.31.10'
        packageJson.scripts['db:migrate'] = 'drizzle-kit migrate'
      } else if (options.database === CORE_CONSTANTS.SQL_LITE) {
        packageJson.dependencies['drizzle-orm'] = '^0.45.2'
        packageJson.dependencies['@libsql/client'] = '^0.14.0'
        packageJson.devDependencies['drizzle-kit'] = '^0.31.10'
      }
      packageJson.scripts['db:generate'] = 'drizzle-kit generate'
      packageJson.scripts['db:push'] = 'drizzle-kit push'
    }

    // HTTP / External Calls
    if (options.axios) packageJson.dependencies['axios'] = '^1.16.1'
    if (options.cockatiel) packageJson.dependencies['cockatiel'] = '^4.0.0'

    // Logging & Observability
    if (options.pino) {
      packageJson.dependencies['pino'] = '^10.3.1'
      packageJson.devDependencies['pino-pretty'] = '^11.2.2'
    }
    if (options.sentry) packageJson.dependencies['@sentry/node'] = '^7.64.0'

    // Services
    if (options.redis) packageJson.dependencies['ioredis'] = '^5.3.1'
    if (options.supabase) packageJson.dependencies['@supabase/supabase-js'] = '^2.35.0'
    if (options.zod) packageJson.dependencies['zod'] = '^4.4.3'

    const filePath = path.join(projectPath, 'package.json')
    await this._fileService.writeFileRecursive(filePath, JSON.stringify(packageJson, null, 2))
  }
}
