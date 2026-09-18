import path from 'node:path'

import { type IFileService, type IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class BootstrapGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
    // 4. src/bootstrap.ts
    let builderNodes = `  const builder = XenoAppBuilder.create<MyRegistry>()\n    .addContext(() => {})`

    if (options.supabase) {
      builderNodes += `\n    .addAuth((opts, config) => {
      opts.url = config.getOrThrow('VITE_SUPABASE_URL');
      opts.key = config.getOrThrow('VITE_SUPABASE_KEY');
    })`
    }

    if (options.sentry) {
      builderNodes += `\n    .addLogger((opts, config) => {
      opts.console = config.get('VITE_APP_ENV') === 'development';
      opts.sentry = {
        dsn: config.getOrThrow('VITE_SENTRY_DSN'),
        env: config.getOrThrow('VITE_APP_ENV')
      };
    })`
    } else {
      builderNodes += `\n    .addLogger((opts, config) => {
      opts.console = config.get('VITE_APP_ENV') === 'development';
    })`
    }

    builderNodes += `\n    .addServices((config, register) => {
      // Register custom stores, API clients, and CQRS services here
    })`

    const bootstrapTs = `import { XenoAppBuilder } from '@xeno-js/vue';
import type { MyRegistry } from './registry';

export async function bootstrap(app: any, router: any) {
${builderNodes}

  return await builder.build();
}
`
    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'src', 'bootstrap.ts'),
      bootstrapTs,
    )
  }
}
