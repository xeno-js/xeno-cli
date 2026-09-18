import fs from 'node:fs/promises'
import path from 'node:path'

import type { IFileService } from '../../../../domain'
import { COMMAND_CONSTANTS, Guards, StringUtils } from '../../../../shared'

export class CqrsGenerator {
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

    let hasZod = false
    let hasDrizzle = false

    try {
      const pkgJsonStr = await fs.readFile(path.join(targetDir, 'package.json'), 'utf8')
      const pkgJson = JSON.parse(pkgJsonStr) as {
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
      }
      const deps = { ...(pkgJson.dependencies ?? {}), ...(pkgJson.devDependencies ?? {}) }
      hasZod = !!Guards.isDefined(deps['zod'])
      hasDrizzle = !!Guards.isDefined(deps['drizzle-orm'])
    } catch (error) {
      console.warn(
        '  Warning: Could not read package.json. Assuming Zod and Drizzle are not installed.',
        error,
      )
    }

    switch (type) {
      case COMMAND_CONSTANTS.COMMAND: {
        const { GenerateCommandCoreGenerator } = await import('./generate-command.generator.js')
        const generator = new GenerateCommandCoreGenerator(this._fileService)
        return generator.generate(
          pascalName,
          lowerName,
          tokenPrefix,
          componentDir,
          hasZod,
          hasDrizzle,
        )
      }
      case COMMAND_CONSTANTS.QUERY: {
        const { GenerateQueryCoreGenerator } = await import('./generate-query.generator.js')
        const generatorQuery = new GenerateQueryCoreGenerator(this._fileService)
        return generatorQuery.generate(pascalName, lowerName, tokenPrefix, componentDir, hasZod)
      }
      default:
        throw new Error(`Unsupported generator type: '${String(type)}'. Use 'command' or 'query'.`)
    }
  }
}
