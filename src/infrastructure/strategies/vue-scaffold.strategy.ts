import prompts from 'prompts'

import type { IFileService, IGenerator, IScaffoldStrategy } from '../../domain'
import type { VueOptions } from '../../shared'

export class VueScaffoldStrategy implements IScaffoldStrategy<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async promptOptions(targetDir: string): Promise<VueOptions> {
    const response = await prompts([
      { type: 'confirm', name: 'axios', message: 'Install Axios?', initial: true },
      {
        type: 'confirm',
        name: 'cockatiel',
        message: 'Install Cockatiel (Resilience)?',
        initial: true,
      },
      { type: 'confirm', name: 'supabase', message: 'Install Supabase Auth?', initial: true },
      { type: 'confirm', name: 'sentry', message: 'Install Sentry Logger?', initial: true },
      {
        type: 'confirm',
        name: 'pinia',
        message: 'Install Pinia (State Management)?',
        initial: true,
      },
      { type: 'confirm', name: 'router', message: 'Install vue-router?', initial: true },
      { type: 'confirm', name: 'tailwind', message: 'Install Tailwind CSS?', initial: true },
      { type: 'confirm', name: 'zod', message: 'Install Zod Validator?', initial: true },
      {
        type: 'confirm',
        name: 'gitInit',
        message: 'Initialize a new Git repository?',
        initial: true,
      },
    ])

    return {
      targetDir,
      projectType: 'vue',
      ...response,
    }
  }

  public async getGenerators(_options: VueOptions): Promise<IGenerator<VueOptions>[]> {
    const generators: IGenerator<VueOptions>[] = []

    const { PackageJsonVueGenerator } = await import('../generators/vue/packagejson.generator.js')
    const { ViteconfigGenerator } = await import('../generators/vue/vite-config.generator.js')
    const { EnvVueGenerator } = await import('../generators/vue/env.generator.js')
    const { TsconfigVueGenerator } = await import('../generators/vue/tsconfig.generator.js')
    const { ReadmeVueGenerator } = await import('../generators/vue/readme.generator.js')
    const { GitIgnoreGenerator } = await import('../generators/gitignore.generator.js')
    const { AppVueGenerator } = await import('../generators/vue/app-vue.generator.js')
    const { BootstrapGenerator } = await import('../generators/vue/bootstrap-ts.generator.js')
    const { IndexVueGenerator } = await import('../generators/vue/index-html.generator.js')
    const { MainGenerator } = await import('../generators/vue/main.generator.js')
    const { RegistryGenerator } = await import('../generators/vue/registry-ts.generator.js')
    const { RouterGenerator } = await import('../generators/vue/router.generator.js')
    const { TailwindGenerator } = await import('../generators/vue/tailwind.generator.js')

    generators.push(new PackageJsonVueGenerator(this._fileService))
    generators.push(new ViteconfigGenerator(this._fileService))
    generators.push(new EnvVueGenerator(this._fileService))
    generators.push(new TsconfigVueGenerator(this._fileService))
    generators.push(new AppVueGenerator(this._fileService))
    generators.push(new BootstrapGenerator(this._fileService))
    generators.push(new IndexVueGenerator(this._fileService))
    generators.push(new MainGenerator(this._fileService))
    generators.push(new RegistryGenerator(this._fileService))
    generators.push(new RouterGenerator(this._fileService))
    generators.push(new TailwindGenerator(this._fileService))
    generators.push(new ReadmeVueGenerator(this._fileService))
    generators.push(new GitIgnoreGenerator(this._fileService))

    return generators
  }
}
