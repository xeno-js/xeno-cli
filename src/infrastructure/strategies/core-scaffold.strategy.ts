// src/strategies/core.strategy.ts
import prompts from 'prompts'

import type { IFileService, IGenerator, IScaffoldStrategy } from '../../domain'
import type { CoreOptions } from '../../shared'
import { CORE_CONSTANTS, TARGET_ENV_CONSTANTS } from '../../shared'

export class CoreScaffoldStrategy implements IScaffoldStrategy<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}
  public async promptOptions(targetDir: string): Promise<CoreOptions> {
    const response = await prompts([
      { type: 'confirm', name: 'axios', message: 'Install Axios?', initial: true },
      { type: 'confirm', name: 'cockatiel', message: 'Install Cockatiel?', initial: true },
      { type: 'confirm', name: 'supabase', message: 'Install Supabase Auth?', initial: true },
      {
        type: 'select',
        name: 'database',
        message: 'Select database type',
        choices: [
          { title: 'Drizzle PostgreSQL', value: 'drizzle' },
          { title: 'SQL Lite', value: 'sqlLite' },
          { title: 'None', value: 'none' },
        ],
      },
      { type: 'confirm', name: 'pino', message: 'Install Pino Logger?', initial: true },
      { type: 'confirm', name: 'sentry', message: 'Install Sentry Logger?', initial: true },
      { type: 'confirm', name: 'redis', message: 'Install Redis?', initial: true },
      { type: 'confirm', name: 'zod', message: 'Install Zod?', initial: true },
      {
        type: 'select',
        name: 'targetEnv',
        message: 'Select target environment',
        choices: [
          { title: 'Console', value: 'console' },
          { title: 'Vercel (Serverless)', value: 'vercel' },
          { title: 'Fastify (Standalone)', value: 'fastify' },
        ],
      },
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

  public async getGenerators(options: CoreOptions): Promise<IGenerator<CoreOptions>[]> {
    // Lazy Loading: Importiamo i moduli solo se servono!
    const generators: IGenerator<CoreOptions>[] = []

    const { PackageJsonCoreGenerator } = await import('../generators/core/packagejson.generator.js')
    const { BootstrapGenerator } = await import('../generators/core/bootstrap.generator.js')
    const { EnvGenerator } = await import('../generators/core/env.generator.js')
    const { GitIgnoreGenerator } = await import('../generators/gitignore.generator.js')
    const { ReadmeGenerator } = await import('../generators/core/readme.generator.js')
    const { RegistryGenerator } = await import('../generators/core/registry.generator.js')
    const { TsconfigGenerator } = await import('../generators/core/tsconfig.generator.js')

    generators.push(new PackageJsonCoreGenerator(this._fileService))
    generators.push(new BootstrapGenerator(this._fileService))
    generators.push(new EnvGenerator(this._fileService))
    generators.push(new GitIgnoreGenerator(this._fileService))
    generators.push(new ReadmeGenerator(this._fileService))
    generators.push(new RegistryGenerator(this._fileService))
    generators.push(new TsconfigGenerator(this._fileService))

    if (options.database !== CORE_CONSTANTS.NONE) {
      if (options.database === CORE_CONSTANTS.DRIZZLE) {
        const { DrizzleGenerator } = await import('../generators/core/drizzle.generator.js')
        generators.push(new DrizzleGenerator(this._fileService))
      } else if (options.database === CORE_CONSTANTS.SQL_LITE) {
        const { DrizzleSqlLiteGenerator } =
          await import('../generators/core/drizzle-sql-lite.generator.js')
        generators.push(new DrizzleSqlLiteGenerator(this._fileService))
      }
    }

    if (options.targetEnv === TARGET_ENV_CONSTANTS.CONSOLE) {
      const { MainGenerator } = await import('../generators/core/main.generator.js')
      generators.push(new MainGenerator(this._fileService))
    }
    // else if (options.targetEnv === CORE_CONSTANTS.VERCEL) {
    //   const { VercelJsonGenerator } = await import('../generators');
    //   generators.push(new VercelJsonGenerator());
    // } else if (options.targetEnv === CORE_CONSTANTS.FASTIFY) {
    //   const { FastifysonGenerator } = await import('../generators');
    //   generators.push(new FastifysonGenerator());
    // }

    return generators
  }
}
