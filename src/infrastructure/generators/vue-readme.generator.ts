// src/infrastructure/generators/vue-readme.generator.ts
import path from 'node:path'

import { type IFileService, type IGenerator } from '../../domain'
import type { VueOptions } from '../../shared'

export class ReadmeVueGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: VueOptions): Promise<void> {
    const content = `# ${options.targetDir}

Enterprise-grade Vue SPA scaffolded with **Xeno**.

## Architecture & Integration

This project is pre-configured with \`@xeno-js/vue\` to enforce pure Dependency Injection and CQRS patterns directly in the browser. 

The application initialization is handled in \`src/main.ts\` via \`XenoAppBuilder\`. The resulting IoC container is injected into the Vue component tree using Provide/Inject under the \`XENO_SERVICES_KEY\`.

### Recommended Component Usage (Composition API)

\`\`\`html
<script setup lang="ts">
import { inject } from 'vue';
import { XENO_SERVICES_KEY, ContainerUtils } from '@xeno-js/vue';
import type { MyRegistry } from '@/registry';

const container = inject(XENO_SERVICES_KEY);

if (!container) {
  throw new Error("Xeno Container not provided!");
}

// Safely resolve your dependencies
const myService = ContainerUtils.resolveServiceScoped('MY_CUSTOM_SERVICE_TOKEN', container);
</script>
\`\`\`

## Scripts

- \`npm run dev\`: Starts the Vite development server.
- \`npm run build\`: Type-checks and builds the production application.
- \`npm run preview\`: Previews the production build locally.
`
    await this._fileService.writeFileRecursive(path.join(projectPath, 'README.md'), content)
  }
}
