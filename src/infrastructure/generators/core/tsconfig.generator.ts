import path from 'node:path'

import type { IFileService, IGenerator } from '../../../domain'
import type { CoreOptions } from '../../../shared'

export class TsconfigGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, _options: CoreOptions): Promise<void> {
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

    const filePath = path.join(projectPath, 'tsconfig.json')
    await this._fileService.writeFileRecursive(filePath, JSON.stringify(tsconfig, null, 2))
  }
}
