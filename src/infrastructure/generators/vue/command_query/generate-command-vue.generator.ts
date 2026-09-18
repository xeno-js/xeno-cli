import path from 'node:path'

import type { IFileService } from '../../../../domain'

export class GenerateCommandVueGenerator {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(
    pascalName: string,
    lowerName: string,
    tokenPrefix: string,
    componentDir: string,
  ): Promise<void> {
    // 1. Command (Application)
    const commandContent = `import { Command } from '@xeno-js/vue';

export class ${pascalName}Command extends Command {
    constructor() {
        super('${tokenPrefix}_COMMAND');
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.command.ts`),
      commandContent,
    )

    // 2. Composable (Presentation)
    const composableContent = `import { ref } from 'vue';
import { Result, type ApiResponseDto } from '@xeno-js/vue';
import { ServicesUtils } from '@/use-app';
import { ${pascalName}Command } from './${lowerName}.command';
import type { ${pascalName}Request, ${pascalName}Response } from './${lowerName}.model';

export function use${pascalName}() {
    const loading = ref(false);
    const error = ref<string | null>(null);

    const execute = async (payload: ${pascalName}Request): Promise<Result<${pascalName}Response>> => {
        if (loading.value) return Result.fail(new Error('Already executing'));
        loading.value = true;
        error.value = null;

        try {
            const { mediator } = ServicesUtils.useApp();
            const command = new ${pascalName}Command();

            const result = await mediator.send(command, async () => {
                //TODO: your logic here
            });

            if (!result.isOk()) {
                error.value = result.getErrorOrThrow().message;
            }

            return result;
        } finally {
            loading.value = false;
        }
    };

    return { loading, error, execute };
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `use-${lowerName}.composable.ts`),
      composableContent,
    )

    // 3. Domain Model (Domain)
    const modelContent = `export interface ${pascalName}Request {
    // TODO: Define your request payload properties here
}

export interface ${pascalName}Response {
    // TODO: Define your response properties here
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.model.ts`),
      modelContent,
    )
  }
}
