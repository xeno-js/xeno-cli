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

    const handlerContent = `import type { IHandler, ResultType } from '@xeno-js/vue';
import { AppError, Result } from '@xeno-js/vue';
import type { ${pascalName}Command } from './${lowerName}.command';
import type { ${pascalName}Response } from './${lowerName}.model';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * 
 * Please register your handler in the IoC container (e.g. src/bootstrap.ts) and add its token to MyRegistry.
 *
 * 1. In src/registry.ts:
 * ${tokenPrefix}_HANDLER: IHandler<${pascalName}Command, ${pascalName}Response>;
 * 
 * 2. In src/bootstrap.ts:
 * .addServices((config, register) => {
 *     register('${tokenPrefix}_HANDLER', new ${pascalName}Handler());
 * });
 */
export class ${pascalName}Handler implements IHandler<${pascalName}Command, ${pascalName}Response> {
    constructor(
        // TODO: Inject your remote DataSources or other services here
    ) {}

    public async handle(command: ${pascalName}Command, signal: AbortSignal): Promise<ResultType<${pascalName}Response>> {
        AppError.throwIfAborted(signal, this.constructor.name);

        // TODO: Implement your frontend business logic or API calls here
        return Result.ok();
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.handler.ts`),
      handlerContent,
    )

    const composableContent = `import { ref } from 'vue';
import { AppError, Result, type ApiResponseDto, type ResultType } from '@xeno-js/vue';
import { ServicesUtils } from '@/use-app';
import { ${pascalName}Command } from './${lowerName}.command';
import type { ${pascalName}Request, ${pascalName}Response } from './${lowerName}.model';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 *
 * Please register your handler in the IoC container (e.g. src/bootstrap.ts) and add its token to MyRegistry.
 *
 * 1. In src/registry.ts:
 * ${tokenPrefix}_HANDLER: IHandler<${pascalName}Command, ${pascalName}Response>;
 * 
 * 2. In src/bootstrap.ts:
 * .addServices((config, register) => {
 *     register('${tokenPrefix}_HANDLER', new ${pascalName}Handler());
 * });
 */
export function use${pascalName}() {
    const loading = ref(false);
    const error = ref<string | null>(null);

    const execute = async (payload: ${pascalName}Request): Promise<ResultType<${pascalName}Response>> => {
        if (loading.value) return Result.fail(AppError.create({
            name: '${pascalName}Command',
            message: '${pascalName}Command is already in progress',
            code: '${tokenPrefix}_COMMAND_ALREADY_IN_PROGRESS',
            status: 500,
            cause: new Error('${tokenPrefix}_COMMAND_ALREADY_IN_PROGRESS'),
        }));
        loading.value = true;
        error.value = null;

        try {
            // Resolve mediator and handler from the container
            const { mediator, ${tokenPrefix}_HANDLER: handler } = ServicesUtils.useApp();
            const command = new ${pascalName}Command();

            const result = await mediator.send(command, async () => {
                const signal = new AbortController().signal;
                return await handler.handle(command, signal);
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
