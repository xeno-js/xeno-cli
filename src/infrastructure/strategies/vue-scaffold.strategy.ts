// src/strategies/core.strategy.ts
import prompts from 'prompts'

import type { IFileService, IGenerator, IScaffoldStrategy } from '../../domain'
import type { VueOptions } from '../../shared'

export class VueScaffoldStrategy implements IScaffoldStrategy<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}
  public async promptOptions(targetDir: string): Promise<VueOptions> {
    const response = await prompts([
      { type: 'confirm', name: 'axios', message: 'Install Axios?', initial: true },
      { type: 'confirm', name: 'cockatiel', message: 'Install Cockatiel?', initial: true },
      { type: 'confirm', name: 'supabase', message: 'Install Supabase Auth?', initial: true },
      { type: 'confirm', name: 'sentry', message: 'Install Sentry Logger?', initial: true },
      { type: 'confirm', name: 'pinia', message: 'Install Pinia?', initial: true },
      { type: 'confirm', name: 'router', message: 'Install vue-router?', initial: true },
      { type: 'confirm', name: 'tailwind', message: 'Install tailwind?', initial: true },
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
      projectType: 'core',
      ...response,
    }
  }

  public async getGenerators(_options: VueOptions): Promise<IGenerator<VueOptions>[]> {
    // Lazy Loading: Importiamo i moduli solo se servono!
    const generators: IGenerator<VueOptions>[] = []

    // const { PackageJsonVueGenerator } = await import('../generators');
    // const { ViteconfigGenerator } = await import('../generators');

    // generators.push(new PackageJsonVueGenerator());
    // generators.push(new ViteconfigGenerator());

    return generators
  }
}
