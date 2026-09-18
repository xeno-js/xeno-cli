import path from 'node:path'

import type { IFileService } from '../../../../domain'
import { COMMAND_CONSTANTS, StringUtils } from '../../../../shared'

export class CqrsVueGenerator {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(
    targetDir: string,
    name: string,
    type: 'command' | 'query',
    outputPath?: string,
  ): Promise<void> {
    const pascalName = StringUtils.pascalCase(name)
    const tokenPrefix = StringUtils.splitCamelCaseWithUnderscore(pascalName).toUpperCase()
    const lowerName = name.toLowerCase()
    const destinationFolder = outputPath ?? lowerName
    const componentDir = path.join(targetDir, 'src', destinationFolder)

    switch (type) {
      case COMMAND_CONSTANTS.COMMAND: {
        const { GenerateCommandVueGenerator } = await import('./generate-command-vue.generator.js')
        const generator = new GenerateCommandVueGenerator(this._fileService)
        return generator.generate(pascalName, lowerName, tokenPrefix, componentDir)
      }
      case COMMAND_CONSTANTS.QUERY: {
        const { GenerateQueryVueGenerator } = await import('./generate-query-vue.generator.js')
        const generatorQuery = new GenerateQueryVueGenerator(this._fileService)
        return generatorQuery.generate(pascalName, lowerName, tokenPrefix, componentDir)
      }
      default:
        throw new Error(`Unsupported generator type: '${String(type)}'. Use 'command' or 'query'.`)
    }
  }
}
