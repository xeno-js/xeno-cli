import path from 'node:path'

import type { IFileService, IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class PackageJsonVueGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
    const packageJson = {
      name: options.targetDir,
      version: '1.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vue-tsc -b && vite build',
        preview: 'vite preview',
        g: 'xeno-js generate',
      } as Record<string, string>,
      dependencies: {
        '@xeno-js/vue': 'latest',
        'vue': '^3.5.43',
      } as Record<string, string>,
      devDependencies: {
        '@types/node': '^20.0.0',
        '@vitejs/plugin-vue': '^5.1.0',
        'typescript': '^5.8.0',
        'vite': '^5.4.0',
        'vue-tsc': '^3.3.11',
      } as Record<string, string>,
    }

    if (options.axios) packageJson.dependencies['axios'] = '^1.20.0'
    if (options.cockatiel) packageJson.dependencies['cockatiel'] = '^4.0.0'
    if (options.supabase) packageJson.dependencies['@supabase/supabase-js'] = '^2.117.1'
    if (options.sentry) packageJson.dependencies['@sentry/vue'] = '^10.75.2'
    if (options.pinia) packageJson.dependencies['pinia'] = '^2.2.0'
    if (options.router) packageJson.dependencies['vue-router'] = '^4.6.4'
    if (options.zod) packageJson.dependencies['zod'] = '^4.6.5'

    if (options.tailwind) {
      packageJson.devDependencies['tailwindcss'] = '^4.0.0'
      packageJson.devDependencies['@tailwindcss/vite'] = '^4.0.0'
    }

    const filePath = path.join(projectPath, 'package.json')
    await this._fileService.writeFileRecursive(filePath, JSON.stringify(packageJson, null, 2))
  }
}
