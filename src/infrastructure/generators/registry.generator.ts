import path from 'node:path'

import { type IFileService, type IGenerator } from '../../domain'
import { CORE_CONSTANTS, type CoreOptions } from '../../shared'

export class RegistryGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: CoreOptions): Promise<void> {
    let dbImport = ''
    let registryType = ''
    if (options.database !== CORE_CONSTANTS.NONE) {
      if (options.database === CORE_CONSTANTS.DRIZZLE) {
        dbImport = `import type { DbSchema } from './schema';`
        registryType = `XenoRegistry<DbSchema>`
      } else if (options.database === CORE_CONSTANTS.SQL_LITE) {
        dbImport = `import type { SqliteSchema } from './schema';`
        registryType = `XenoRegistry<SqliteSchema>`
      }
    } else {
      registryType = `XenoRegistry`
    }

    const content = `import type { XenoRegistry } from '@xeno-js/core';
${dbImport}

/**
 * @file registry.ts
 * @description Centralized Type Contract for Dependency Injection.
 */
export interface MyRegistry extends ${registryType} {
    // Add your application injection tokens here
    // e.g., USER_REPOSITORY: IUserRepository;
}
`

    const filePath = path.join(projectPath, 'src', 'registry.ts')
    await this._fileService.writeFileRecursive(filePath, content)
  }
}
