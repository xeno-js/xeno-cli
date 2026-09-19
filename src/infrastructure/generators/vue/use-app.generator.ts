import path from 'node:path'

import { type IFileService, type IGenerator } from '../../../domain'
import type { VueOptions } from '../../../shared'

export class UseAppVueGenerator implements IGenerator<VueOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, _options: VueOptions): Promise<void> {
    const content = `import type { Nullable } from "@xeno-js/vue";
import { Guards, XENO_SERVICES_KEY } from "@xeno-js/vue";
import { inject } from "vue";
import type { MyRegistry } from "./registry";

let globalServices: Nullable<MyRegistry> = null;

export const ServicesUtils = Object.freeze({
    // Metodo per registrare i servizi al bootstrap
    setGlobalServices(services: MyRegistry) {
        globalServices = services;
    },
    useApp(): MyRegistry {
        if (Guards.isDefined(globalServices))
            return globalServices;

        const services = inject<MyRegistry>(XENO_SERVICES_KEY);
        if (!services)
            throw new Error(
                '[Xeno Error]: XenoServices not found. Did you provide them using app.provide(XENO_SERVICES_KEY, services)?',
            );

        return services;
    }
} as const);
`
    await this._fileService.writeFileRecursive(path.join(projectPath, 'src', 'use-app.ts'), content)
  }
}
