import path from 'node:path'

import type { IFileService, IGenerator } from '../../../domain'
import { CORE_CONSTANTS, type CoreOptions } from '../../../shared'

export class TsconfigGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: CoreOptions): Promise<void> {
    const tsconfig = {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        outDir: './dist',
        rootDir: './src',
        types: ['node'],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src/**/*.ts'],
    }

    if (
      options.database === CORE_CONSTANTS.DRIZZLE ||
      options.database === CORE_CONSTANTS.SQL_LITE
    ) {
      tsconfig.include.push('drizzle.config.ts')
    }

    const filePath = path.join(projectPath, 'tsconfig.json')
    await this._fileService.writeFileRecursive(filePath, JSON.stringify(tsconfig, null, 2))
  }
}
