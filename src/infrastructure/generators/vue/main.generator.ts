import path from 'node:path'

import { type IFileService, type IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class MainGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
    // 5. src/main.ts
    const routerImport = options.router ? `\nimport router from './router';` : ''
    const piniaImport = options.pinia ? `\nimport { createPinia } from 'pinia';` : ''
    const tailwindImport = options.tailwind ? `\nimport './assets/style.css';` : ''

    let builderNodes = `  const builder = XenoAppBuilder.create<MyRegistry>()\n    .addContext(() => {})`

    if (options.supabase) {
      builderNodes += `\n    .addAuth((opts, config) => {
      opts.url = config.getOrThrow('VITE_SUPABASE_URL');
      opts.key = config.getOrThrow('VITE_SUPABASE_KEY');
    })`
    }

    if (options.sentry) {
      builderNodes += `\n    .addLogger((opts, config) => {
      const env = config.get('APP_ENV') ?? 'development'
      const isDev = env.toLowerCase() === 'development'
      opts.console = isDev
      if (!isDev) {
        opts.sentry = {
            dsn: config.getOrThrow('VITE_SENTRY_DSN'),
            env,
            app,
            tracesSampleRate: 0.2,
            level: LOG_LEVEL.WARN,
        };
      }
    })`
    } else {
      builderNodes += `\n    .addLogger((opts, config) => {
      opts.console = config.get('VITE_APP_ENV') === 'development';
    })`
    }

    builderNodes += `\n    .addServices((config, register) => {
      // Register custom stores, API clients, and CQRS services here
    })`

    const mainTs = `import { createApp } from 'vue';
import App from './App.vue';
import { XenoAppBuilder, LOG_LEVEL } from '@xeno-js/vue';
import type { MyRegistry } from './registry';
import { XENO_SERVICES_KEY } from '@xeno-js/vue';${routerImport}${piniaImport}${tailwindImport}

async function mountApp() {
  try {
    const app = createApp(App);
    ${options.pinia ? '\n    app.use(createPinia());' : ''}
    
    ${builderNodes}

    const container = await builder.build()
    
    app.use(router);

    // Provide the Xeno IoC container globally to all components
    app.provide(XENO_SERVICES_KEY, container);

    ${options.router ? '\n    app.use(router);' : ''}
    

    // Provide the Xeno IoC container globally to all components
    app.provide(XENO_SERVICES_KEY, container);

    app.mount('#app');
  } catch (error) {
    console.error('Critical error during frontend bootstrap:', error);
  }
}

mountApp();
`
    await this._fileService.writeFileRecursive(path.join(projectPath, 'src', 'main.ts'), mainTs)
  }
}
