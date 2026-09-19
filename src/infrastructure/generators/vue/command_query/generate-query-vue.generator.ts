import path from 'node:path'

import type { IFileService } from '../../../../domain'

export class GenerateQueryVueGenerator {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(
    pascalName: string,
    lowerName: string,
    tokenPrefix: string,
    componentDir: string,
  ): Promise<void> {
    // 1. Query (Application)
    const queryContent = `import { Query } from '@xeno-js/vue';
import type { ${pascalName}Response } from './${lowerName}.model';

export class ${pascalName}Query extends Query<${pascalName}Response> {
    constructor() {
        super('${tokenPrefix}_QUERY', {
            ttl: 60,
            cacheKey: \`${lowerName}.query\`,
            bypassCache: false,
            consistentRead: false,
            isUserScoped: true
        });
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.query.ts`),
      queryContent,
    )

    const handlerContent = `import type { IHandler, ResultType } from '@xeno-js/vue';
import { AppError, Result } from '@xeno-js/vue';
import type { ${pascalName}Query } from './${lowerName}.query';
import type { ${pascalName}Response } from './${lowerName}.model';

    /*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 *
 * Please register your handler in the IoC container (e.g. src/bootstrap.ts) and add its token to MyRegistry.
 *
 * 1. In src/registry.ts:
 * ${tokenPrefix}_HANDLER: IHandler<${pascalName}Query, ${pascalName}Response>;
 * 
 * 2. In src/bootstrap.ts:
 * .addServices((config, register) => {
 *     register('${tokenPrefix}_HANDLER', new ${pascalName}Handler());
 * });
 */
export class ${pascalName}Handler implements IHandler<${pascalName}Query, ${pascalName}Response> {
    constructor(
        // TODO: Inject your remote DataSources or other services here
    ) {}

    public async handle(query: ${pascalName}Query, signal: AbortSignal): Promise<ResultType<${pascalName}Response>> {
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

    // 2. Composable (Presentation)
    const composableContent = `import { ref } from 'vue';
import { AppError, Result, type ApiResponseDto, type ResultType } from '@xeno-js/vue';
import { ServicesUtils } from '@/use-app';
import { ${pascalName}Query } from './${lowerName}.query';
import type { ${pascalName}Response } from './${lowerName}.model';

export function use${pascalName}() {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const data = ref<${pascalName}Response | null>(null);

    /*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 *
 * Please register your handler in the IoC container (e.g. src/bootstrap.ts) and add its token to MyRegistry.
 *
 * 1. In src/registry.ts:
 * ${tokenPrefix}_HANDLER: IHandler<${pascalName}Query, ${pascalName}Response>;
 * 
 * 2. In src/bootstrap.ts:
 * .addServices((config, register) => {
 *     register('${tokenPrefix}_HANDLER', new ${pascalName}Handler());
 * });
 */
    const fetch = async (): Promise<ResultType<${pascalName}Response>> => {
        if (loading.value) return Result.fail(AppError.create({
            name: '${pascalName}Query',
            message: '${pascalName}Query is already in progress',
            code: '${tokenPrefix}_QUERY_ALREADY_IN_PROGRESS',
            status: 500,
            cause: new Error('${tokenPrefix}_QUERY_ALREADY_IN_PROGRESS'),
        }));
        loading.value = true;
        error.value = null;

        try {
            try {
            // Resolve mediator and handler from the container
            const { mediator, ${tokenPrefix}_HANDLER: handler } = ServicesUtils.useApp();
            const query = new ${pascalName}Query();

            const result = await mediator.query(query, async () => {
                const signal = new AbortController().signal;
                return await handler.handle(query, signal);
            });

            if (result.isOk()) {
                data.value = result.getValueOrThrow();
            } else {
                error.value = result.getErrorOrThrow().message;
            }

            return result;
        } finally {
            loading.value = false;
        }
    };

    return { loading, error, data, fetch };
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `use-${lowerName}.composable.ts`),
      composableContent,
    )

    // 3. Domain Model (Domain)
    const modelContent = `export interface ${pascalName}Response {
    // TODO: Define your response properties here
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.model.ts`),
      modelContent,
    )
  }
}
