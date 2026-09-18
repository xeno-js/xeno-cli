import pc from 'picocolors'

import type { ICliCommand } from '../../domain'
import { Guards } from '../../shared'
import { COMMAND_CONSTANTS } from '../../shared/constants/command.constants'
import { FileUtils } from '../file'

export class GenerateCommand implements ICliCommand {
  public readonly name: string = 'generate'
  public readonly aliases: string[] = ['g']

  public async execute(args: string[]): Promise<void> {
    const type = args[0] // "command" o "query"
    const componentName = args[1] // es: "User"
    const isCore = args.includes('--core')
    const isVue = args.includes('--vue')

    if (Guards.isNullOrEmpty(type) || Guards.isNullOrEmpty(componentName)) {
      throw new Error(`Invalid syntax. Usage: xeno-js g [command | query] <Name> [--core | --vue]`)
    }

    let outputPath: string | undefined = undefined
    const outputIndex = args.findIndex((arg) => arg === '--output' || arg === '-o' || arg === '--o')
    if (outputIndex !== -1 && args.length > outputIndex + 1) {
      outputPath = args[outputIndex + 1]
    }

    const targetDir = process.cwd()
    const fileService = new FileUtils()

    if (type === COMMAND_CONSTANTS.COMMAND) {
      if (isCore || !isVue) {
        const { GenerateCommandCoreGenerator } =
          await import('../generators/core/command/generate-command.generator.js')
        const generator = new GenerateCommandCoreGenerator(fileService)
        await generator.generate(targetDir, componentName, outputPath)
        console.info(pc.green(`\n  Successfully generated command component '${componentName}'!`))
      } else if (isVue) {
        throw new Error('Generate Command for --vue will be implemented soon.')
      }
    } else if (type === COMMAND_CONSTANTS.QUERY) {
      throw new Error('Generate Query will be implemented with AST modifiers soon.')
    } else {
      throw new Error(`Unsupported generator type: '${type}'. Use 'command' or 'query'.`)
    }
  }
}
