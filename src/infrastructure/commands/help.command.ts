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

    // --- NEW PROJECT ---
    console.info(pc.bold(pc.blue('1. Create a new project:')))
    console.info(`  xeno-js new ${pc.yellow('<name>')} ${pc.cyan('[--vue | --core]')}`)
    console.info(`  ${pc.gray('•')} ${pc.yellow('<name>')}: The name of your project directory.`)
    console.info(
      `  ${pc.gray('•')} ${pc.cyan('[--vue | --core]')}: Project type. ${pc.gray('(Default: --core)')}`,
    )
    console.info(`    - ${pc.cyan('--core')}: Initializes a Backend project (Node.js/TS).`)
    console.info(`    - ${pc.cyan('--vue')}: Initializes a Frontend project (Vue.js).\n`)

    // --- GENERATE ---
    console.info(pc.bold(pc.blue('2. Generate CQRS components:')))
    console.info(
      `  xeno-js generate ${pc.magenta('<type>')} ${pc.yellow('<Name>')} ${pc.cyan('[--vue | --core]')} ${pc.green('[--output <path>]')}`,
    )
    console.info(
      `  ${pc.gray('•')} ${pc.magenta('<type>')}: Component type to generate (${pc.magenta('command')} | ${pc.magenta('query')}).`,
    )
    console.info(
      `  ${pc.gray('•')} ${pc.yellow('<Name>')}: The name of the component (e.g., UserCreate).`,
    )
    console.info(
      `  ${pc.gray('•')} ${pc.cyan('[--vue | --core]')}: Target context. ${pc.gray('(Default: --core)')}`,
    )
    console.info(
      `    - ${pc.cyan('--core')}: Generates Controller, Handler, Command/Query, Module, and Zod/DB schemas.`,
    )
    console.info(
      `    - ${pc.cyan('--vue')}: Generates frontend-specific files (Stores, Services, etc.).`,
    )
    console.info(
      `  ${pc.gray('•')} ${pc.green('[--output | -o]')}: Custom destination path inside 'src/'. ${pc.gray('(Default: src/<name-in-lowercase>)')}`,
    )
    console.info(
      `  ${pc.gray('Alias:')} ${pc.gray('xeno-js g <type> <Name> [--vue | --core] [-o | --o <path>]')}\n`,
    )

    // --- HELP ---
    console.info(pc.bold(pc.blue('3. Help:')))
    console.info(`  xeno-js --help     ${pc.gray('Displays this guide.')}`)
    console.info(`  ${pc.gray('Alias:')} ${pc.gray('xeno-js --h | -h')}\n`)

    // --- DOCS ---
    console.info(pc.bold(pc.blue('Documentation:')))
    console.info(`  ${pc.underline('https://www.xeno-js.it')}\n`)
  }
}
