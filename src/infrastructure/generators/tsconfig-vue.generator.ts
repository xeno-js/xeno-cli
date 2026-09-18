// src/infrastructure/generators/tsconfig-vue.generator.ts
import path from 'node:path'

import { type IFileService, type IGenerator } from '../../domain'
import type { VueOptions } from '../../shared'

export class TsconfigVueGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, _options: VueOptions): Promise<void> {
    const tsconfig = {
      compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        jsx: 'preserve',
        resolveJsonModule: true,
        isolatedModules: true,
        esModuleInterop: true,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        skipLibCheck: true,
        noEmit: true,
        types: ['vite/client'],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue'],
    }

    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2),
    )
  }
}
