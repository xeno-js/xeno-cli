import { type IDispatcher } from '../../domain'
import { GenerateCommandQuery, HelpCommand, NewProjectCommand } from '../commands'
import { CliDispatcher } from '../dispatcher'

export class Builder {
  public static getDispatcher(): IDispatcher {
    const dispatcher = new CliDispatcher([
      new NewProjectCommand(),
      new GenerateCommandQuery(),
      new HelpCommand(),
    ])

    return dispatcher
  }
}
