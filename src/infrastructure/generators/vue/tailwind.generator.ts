import path from 'node:path'

import { type IFileService, type IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class TailwindGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
    if (options.tailwind) {
      await this._fileService.writeFileRecursive(
        path.join(projectPath, 'src', 'assets', 'style.css'),
        `@import "tailwindcss";\n`,
      )
    }
  }
}
