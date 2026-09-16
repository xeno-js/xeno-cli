import pc from 'picocolors'

import type { ICliCommand } from '../../domain'
import type { IScaffoldStrategy } from '../../domain'
import { type ScaffoldingOptions } from '../../shared'
import { Bootstrapper } from '../bootstrap'
import { FileUtils } from '../file'
import { CommandRunner } from './command-runner.service'

export class NewProjectCommand implements ICliCommand {
  public readonly name: string = 'new'
  public readonly aliases: string[] = []

  public async execute(args: string[]): Promise<void> {
    const targetDir = args.find((arg) => !arg.startsWith('--')) ?? 'my-xeno-app'
    const isVue = args.includes('--vue')
    const fileService = new FileUtils()

    let strategy: IScaffoldStrategy<ScaffoldingOptions>

    if (isVue) {
      const { VueScaffoldStrategy } = await import('../strategies/vue-scaffold.strategy.js')
      strategy = new VueScaffoldStrategy(fileService)
    } else {
      const { CoreScaffoldStrategy } = await import('../strategies/core-scaffold.strategy.js')
      strategy = new CoreScaffoldStrategy(fileService)
    }

    const options = await strategy.promptOptions(targetDir)

    const generators = await strategy.getGenerators(options)
    const bootstrapper = new Bootstrapper(generators)
    await bootstrapper.run(targetDir, options)

    const commandRunner = new CommandRunner()
    if (options.gitInit) {
      console.info(pc.greenBright('\n🗂️ Initializing Git repository...'))
      await commandRunner.run('git', ['init'], targetDir)
    }
    console.info(pc.greenBright('\n📦 Installing dependencies...'))
    const isWin = process.platform === 'win32'
    await commandRunner.run('npm', ['install'], targetDir, isWin)

    console.info(pc.green(`\n✅ Project successfully created in ./${targetDir}`))
    console.info(pc.white(`\nNext steps:\n  cd ${targetDir}\n  npm run start\n`))
  }
}
