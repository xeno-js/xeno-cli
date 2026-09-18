// src/infrastructure/generators/viteconfig.generator.ts
import path from 'node:path'

import { type IFileService, type IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class ViteconfigGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
    const tailwindImport = options.tailwind ? `\nimport tailwindcss from '@tailwindcss/vite';` : ''
    const tailwindPlugin = options.tailwind ? `\n    tailwindcss(),` : ''

    const content = `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';${tailwindImport}
import path from 'node:path';

export default defineConfig({
  plugins: [
    vue(),${tailwindPlugin}
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  }
});
`
    const filePath = path.join(projectPath, 'vite.config.ts')
    await this._fileService.writeFileRecursive(filePath, content)
  }
}
