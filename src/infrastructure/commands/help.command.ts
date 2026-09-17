import pc from 'picocolors'

import type { ICliCommand } from '../../domain'
import { ARGS_CONSTANTS, COMMAND_CONSTANTS } from '../../shared'

export class HelpCommand implements ICliCommand {
  public get name(): string {
    return COMMAND_CONSTANTS.HELP
  }
  public get aliases(): string[] {
    return [ARGS_CONSTANTS.HELP, '-h']
  }

  public async execute(): Promise<void> {
    console.info(pc.greenBright('\n🚀 Xeno CLI - Usage Guide\n'))

    console.info(pc.bold('Create a new project:'))
    console.info(`  xeno-js new [my-app] [--vue | --core]\n`)

    console.info(pc.bold('Generate CQRS components in existing project:'))
    console.info(`  xeno-js generate command [Name]   ${pc.gray('(Alias: xeno-js g command)')}`)
    console.info(`  xeno-js generate query [Name]     ${pc.gray('(Alias: xeno-js g query)')}\n`)

    console.info(pc.bold('Help:'))
    console.info(`  xeno-js --help     ${pc.gray('(Alias: xeno-js --h | -h)')}\n`)

    console.info(pc.bold('See documentation:'))
    console.info(`  https://www.xeno-js.it\n`)
  }
}
