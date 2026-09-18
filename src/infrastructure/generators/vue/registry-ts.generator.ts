import path from 'node:path'

import { type IFileService, type IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class RegistryGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, _options: VueOptions): Promise<void> {
    const registryTs = `import type { XenoVueRegistry } from '@xeno-js/vue';

/**
 * @file registry.ts
 * @description Centralized Type Contract for Dependency Injection in Vue.
 */
export interface MyRegistry extends XenoVueRegistry {
  // Add your frontend injection tokens here
  // e.g., USER_DATA_SOURCE: IUserDataSource;
}
`
    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'src', 'registry.ts'),
      registryTs,
    )
  }
}
