import pc from 'picocolors'

import type { ICliCommand, IDispatcher } from '../../domain'
import { ARGS_CONSTANTS, COMMAND_CONSTANTS, Guards } from '../../shared'

export class CliDispatcher implements IDispatcher {
  private readonly _commands = new Map<string, ICliCommand>()

  constructor(commands: ICliCommand[]) {
    for (const command of commands) {
      this._commands.set(command.name, command)
      for (const alias of command.aliases) {
        this._commands.set(alias, command)
      }
    }
  }

  public async dispatch(rawArgs: string[]): Promise<void> {
    const action = rawArgs[0]

    if (
      !Guards.isDefined(action) ||
      action === ARGS_CONSTANTS.HELP ||
      action === '-h' ||
      action === '--h'
    ) {
      const helpCommand = this._commands.get(COMMAND_CONSTANTS.HELP)
      await helpCommand?.execute([])
      return
    }

    const command = this._commands.get(action)

    if (!Guards.isDefined(command)) {
      console.error(pc.red(`\n❌ '${action}' is not a command`))
      console.info(
        pc.yellow(`See 'xeno-js --help' for cli usage guide or https://www.xeno-js.it for docs.\n`),
      )
      process.exit(1)
    }

    const commandArgs = rawArgs.slice(1)
    await command.execute(commandArgs)
  }
}
