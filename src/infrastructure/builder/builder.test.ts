import { describe, expect, it, vi } from 'vitest'

import { GenerateCommand, HelpCommand, NewProjectCommand } from '../commands'
import { CliDispatcher } from '../dispatcher'
import { Builder } from './builder'

describe('Builder', () => {
  it('should create a dispatcher with the CLI commands registered', () => {
    const dispatcher = Builder.getDispatcher()

    expect(dispatcher).toBeInstanceOf(CliDispatcher)
  })

  it('should dispatch the registered commands through the built dispatcher', async () => {
    const dispatcher = Builder.getDispatcher()

    const newSpy = vi.spyOn(NewProjectCommand.prototype, 'execute').mockResolvedValue()
    const generateSpy = vi.spyOn(GenerateCommand.prototype, 'execute').mockResolvedValue()
    const helpSpy = vi.spyOn(HelpCommand.prototype, 'execute').mockResolvedValue()

    await dispatcher.dispatch(['new', 'demo-app'])
    await dispatcher.dispatch(['generate', 'command', 'User'])
    await dispatcher.dispatch(['--help'])
    await dispatcher.dispatch(['-h'])

    expect(newSpy).toHaveBeenCalledWith(['demo-app'])
    expect(generateSpy).toHaveBeenCalledWith(['command', 'User'])
    expect(helpSpy).toHaveBeenCalledTimes(2)
    expect(helpSpy).toHaveBeenNthCalledWith(1, [])
    expect(helpSpy).toHaveBeenNthCalledWith(2, [])

    newSpy.mockRestore()
    generateSpy.mockRestore()
    helpSpy.mockRestore()
  })
})
