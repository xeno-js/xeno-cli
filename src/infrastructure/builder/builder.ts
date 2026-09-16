import { type IDispatcher } from '../../domain'
import { GenerateCommand, HelpCommand, NewProjectCommand } from '../commands'
import { CliDispatcher } from '../dispatcher'

export class Builder {
  public static getDispatcher(): IDispatcher {
    const dispatcher = new CliDispatcher([
      new NewProjectCommand(),
      new GenerateCommand(),
      new HelpCommand(),
    ])

    return dispatcher
  }
}
