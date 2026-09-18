// src/infrastructure/generators/vue-source-files.generator.ts
import path from 'node:path'

import { type IFileService, type IGenerator } from '../../domain'
import type { VueOptions } from '../../shared'

export class VueSourceFilesGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
    // 1. index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${options.targetDir}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`
    await this._fileService.writeFileRecursive(path.join(projectPath, 'index.html'), indexHtml)

    // 2. src/App.vue
    const appVue = `<script setup lang="ts">
</script>

<template>
  <div id="xeno-app">
    ${options.router ? '<router-view />' : '<h1>Welcome to Xeno Vue App</h1>'}
  </div>
</template>`
    await this._fileService.writeFileRecursive(path.join(projectPath, 'src', 'App.vue'), appVue)

    // 3. src/registry.ts
    const registryTs = `import type { XenoVueRegistry } from '@xeno-js/vue';

/**
 * @file registry.ts
 * @description Centralized Type Contract for Dependency Injection in Vue.
 */
export interface MyRegistry extends XenoVueRegistry {
  // Add your frontend injection tokens here
  // e.g., USER_DATA_SOURCE: IUserDataSource;
}
`
    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'src', 'registry.ts'),
      registryTs,
    )

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

    // 5. src/main.ts
    const routerImport = options.router ? `\nimport router from './router';` : ''
    const piniaImport = options.pinia ? `\nimport { createPinia } from 'pinia';` : ''
    const tailwindImport = options.tailwind ? `\nimport './assets/style.css';` : ''

    const mainTs = `import { createApp } from 'vue';
import App from './App.vue';
import { bootstrap } from './bootstrap';
import { XENO_SERVICES_KEY } from '@xeno-js/vue';${routerImport}${piniaImport}${tailwindImport}

async function mountApp() {
  try {
    const container = await bootstrap();
    const app = createApp(App);

    // Provide the Xeno IoC container globally to all components
    app.provide(XENO_SERVICES_KEY, container);
${options.pinia ? '\n    app.use(createPinia());' : ''}${options.router ? '\n    app.use(router);' : ''}

    app.mount('#app');
  } catch (error) {
    console.error('Critical error during frontend bootstrap:', error);
  }
}

mountApp();
`
    await this._fileService.writeFileRecursive(path.join(projectPath, 'src', 'main.ts'), mainTs)

    // 6. Optional router and assets
    if (options.router) {
      const routerTs = `import { createRouter, createWebHistory } from 'vue-router';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    }
  ]
});`
      await this._fileService.writeFileRecursive(
        path.join(projectPath, 'src', 'router', 'index.ts'),
        routerTs,
      )
      await this._fileService.writeFileRecursive(
        path.join(projectPath, 'src', 'views', 'HomeView.vue'),
        `<template>\n  <h1>Home View</h1>\n</template>`,
      )
    }

    if (options.tailwind) {
      await this._fileService.writeFileRecursive(
        path.join(projectPath, 'src', 'assets', 'style.css'),
        `@import "tailwindcss";\n`,
      )
    }
  }
}
