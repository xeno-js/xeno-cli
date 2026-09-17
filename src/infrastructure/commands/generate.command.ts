// src/cli/commands/generate.command.ts
// import pc from 'picocolors';
import type { ICliCommand } from '../../domain'
// import { Bootstrapper } from '../bootstrap';
// import type { IScaffoldStrategy } from '../../domain';
// import { BaseOptions, Guards } from '../../shared';
import { Guards } from '../../shared'
import { COMMAND_CONSTANTS } from '../../shared/constants/command.constants'

export class GenerateCommand implements ICliCommand {
  public readonly name: string = 'generate'
  public readonly aliases: string[] = ['g']

  public async execute(args: string[]): Promise<void> {
    const type = args[0] // "command" o "query"
    const componentName = args[1] // es: "User"

    if (Guards.isNullOrEmpty(type) || Guards.isNullOrEmpty(componentName)) {
      throw new Error(`Invalid syntax. Usage: xeno-js g [command | query] <Name>`)
    }

    // const targetDir = process.cwd();
    // let strategy: IScaffoldStrategy<BaseOptions>;

    if (type === COMMAND_CONSTANTS.COMMAND) {
      // NOTE: Qui importeremo la GenerateCommandStrategy (quando sarà creata con ts-morph)
      // const { GenerateCommandStrategy } = await import('@/infrastructure/strategies/generate-command.strategy');
      // strategy = new GenerateCommandStrategy(componentName);
      throw new Error('Generate Command will be implemented with AST modifiers soon.')
    } else if (type === COMMAND_CONSTANTS.QUERY) {
      throw new Error('Generate Query will be implemented with AST modifiers soon.')
    } else {
      throw new Error(`Unsupported generator type: '${type}'. Use 'command' or 'query'.`)
    }

    // const options = await strategy.promptOptions(targetDir);
    // const generators = await strategy.getGenerators(options);

    // const bootstrapper = new Bootstrapper(generators);
    // await bootstrapper.run(targetDir, options);
  }
}
