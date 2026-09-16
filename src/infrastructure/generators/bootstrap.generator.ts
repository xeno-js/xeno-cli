import path from 'node:path'

import { type IFileService, type IGenerator } from '../../domain'
import { CORE_CONSTANTS, type CoreOptions } from '../../shared'

export class BootstrapGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: CoreOptions): Promise<void> {
    // Costruisce in modo flessibile i nodi di configurazione
    let builderNodes = `
  const builder = new AppBuilder<MyRegistry>()
    .addContext()
    .addMiddlewares((opts) => {
      // Add your options here
    })
    .addPipeline((opts) => {
      // Add your options here
    })`

    if (options.database !== CORE_CONSTANTS.NONE) {
      if (options.database === CORE_CONSTANTS.DRIZZLE) {
        builderNodes += `
        .addDb((opts, config) => {
          opts.enableSqlLite = false
          opts.connectionString = config.getOrThrow('DATABASE_URL');
        })`
      } else if (options.database === CORE_CONSTANTS.SQL_LITE) {
        builderNodes += `
        .addDb((opts, config) => {
          opts.enableSqlLite = true;
          opts.connectionString = config.getOrThrow('SQLITE_DATABASE_URL');
        })`
      }
    }

    if (options.redis) {
      builderNodes += `
    .addCache((opts, config) => {
      const isDev = config.get('NODE_ENV') === 'development';
      opts.inMemory = isDev;
      opts.redis = !isDev ? {
        host: config.getOrThrow('REDIS_HOST'),
        port: config.getNumber('REDIS_PORT') ?? 6379,
        username: config.get('REDIS_USERNAME') ?? '',
        password: config.get('REDIS_PASSWORD') ?? '',
        tls: config.getBoolean('REDIS_TLS') ?? false,
        maxRetriesPerRequest: 3
      } : undefined
    })`
    } else {
      // Default in-memory cache if no redis selected but CQRS pipeline exists
      builderNodes += `
    .addCache((opts) => {
      opts.inMemory = true;
    })`
    }

    if (options.supabase) {
      builderNodes += `
    .addAuth((opts, config) => {
      opts.url = config.getOrThrow('SUPABASE_URL');
      opts.key = config.getOrThrow('SUPABASE_KEY');
    })`
    }

    if (options.pino || options.sentry) {
      const pinoConfig = options.pino
        ? `opts.pino.config = !isDev ? { env: config.getOrThrow('NODE_ENV'), destination: 'stdout', prettyPrint: false } : undefined;`
        : ''
      const sentryConfig = options.sentry
        ? `opts.sentry.config = !isDev ? { dsn: config.getOrThrow('SENTRY_DSN'), environment: config.getOrThrow('NODE_ENV') } : undefined;`
        : ''

      builderNodes += `
    .addLogger((opts, config) => {
      const isDev = config.get('NODE_ENV') === 'development';
      opts.level = LOG_LEVEL.INFO;
      opts.console = isDev;
      ${pinoConfig}
      ${sentryConfig}
    })`
    }

    builderNodes += `
    .addServices((opts, config) => {
      // Register custom repositories and handlers here
    });`

    const content = `import type { IServiceContainer } from '@xeno-js/core';
import { AppBuilder, LOG_LEVEL, Nullable, TOKENS } from '@xeno-js/core';
import type { MyRegistry } from './registry';

let containerPromise: Nullable<Promise<IServiceContainer<MyRegistry>>> = null;

export async function bootstrap() {
  if (!containerPromise) {
    containerPromise = (async () => {
      const builder = getContainer();
      return await builder.build();
    })().catch((err) => {
      containerPromise = null;
      throw err;
    });
  }
  return containerPromise;
}

function getContainer() {
${builderNodes}
  return builder;
}
`

    const filePath = path.join(projectPath, 'src', 'bootstrap.ts')
    await this._fileService.writeFileRecursive(filePath, content)
  }
}
