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
    const queryContent = `import { BaseQuery } from '@xeno-js/vue';
import type { ${pascalName}Response } from './${lowerName}.model';

export class ${pascalName}Query extends BaseQuery<${pascalName}Response> {
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

    // 2. Composable (Presentation)
    const composableContent = `import { ref } from 'vue';
import { Result, type ApiResponseDto } from '@xeno-js/core';
import { ServicesUtils } from '@/use-app';
import { ${pascalName}Query } from './${lowerName}.query';
import type { ${pascalName}Response } from './${lowerName}.model';

export function use${pascalName}() {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const data = ref<${pascalName}Response | null>(null);

    const fetch = async (): Promise<Result<${pascalName}Response>> => {
        if (loading.value) return Result.fail(new Error('Already fetching'));
        loading.value = true;
        error.value = null;

        try {
            const { mediator } = ServicesUtils.useApp();
            const query = new ${pascalName}Query();

            const result = await mediator.query(query, async () => {
                //TODO: your logic here
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
