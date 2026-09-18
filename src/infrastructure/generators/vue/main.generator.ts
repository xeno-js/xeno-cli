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

    const mainTs = `import { createApp } from 'vue';
import App from './App.vue';
import { bootstrap } from './bootstrap';
import { XENO_SERVICES_KEY } from '@xeno-js/vue';${routerImport}${piniaImport}${tailwindImport}

async function mountApp() {
  try {
    const app = createApp(App);
    ${options.pinia ? '\n    app.use(createPinia());' : ''}
    const container = await bootstrap(app, router);
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
