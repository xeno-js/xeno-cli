import path from 'node:path'

import { type IFileService, type IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class RouterGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
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
  }
}
