import path from 'node:path'

import { type IFileService, type IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class AppVueGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
    // 2. src/App.vue
    const appVue = `<script setup lang="ts">
</script>

<template>
  <div id="xeno-app">
    ${options.router ? '<router-view />' : '<h1>Welcome to Xeno Vue App</h1>'}
  </div>
</template>`
    await this._fileService.writeFileRecursive(path.join(projectPath, 'src', 'App.vue'), appVue)
  }
}
