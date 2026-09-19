import path from 'node:path'

import type { IFileService } from '../../../../domain'

export class GenerateQueryCoreGenerator {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(
    pascalName: string,
    lowerName: string,
    tokenPrefix: string,
    componentDir: string,
    hasZod: boolean,
  ): Promise<void> {
    const queryContent = `import { BaseQuery } from '@xeno-js/core';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Please replace <any> with your specific payload and response types.
 */
export class ${pascalName}Query extends BaseQuery<any> {
    constructor(public readonly payload: any) {
        super(
            '${tokenPrefix}_QUERY_HANDLER', 
            // Default cache options:
            {
                ttl: 60,
                cacheKey: \`${lowerName}:\${JSON.stringify(payload)}\`,
                bypassCache: false,
                consistentRead: false
                isUserScoped: false,
            }
        );
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.query.ts`),
      queryContent,
    )

    // 2. Handler
    const handlerContent = `import type { IFactory, ResultType, UserContext } from '@xeno-js/core';
import { AppError, BaseHandler, Result } from '@xeno-js/core';
import { ${pascalName}Query } from './${lowerName}.query';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Please replace <any> with your specific response type.
 */
export class ${pascalName}Handler extends BaseHandler<${pascalName}Query, any> {
    constructor(
        identityFactory: IFactory<void, UserContext>
        // TODO: Inject your ReadDao or DataSource here
    ) {
        super(identityFactory);
    }

    public async executeAsync(request: ${pascalName}Query, singal: AbortSignal): Promise<ResultType<any>> {
        // TODO: Implement your query logic here

        return Result.ok();
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.handler.ts`),
      handlerContent,
    )

    // 3. Controller
    const controllerContent = `import type { IContextAccessor, IMediator, RequestContext, ResponseDto } from '@xeno-js/core';
import { BaseController } from '@xeno-js/core';
import { ${pascalName}Query } from './${lowerName}.query';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Please replace <any, any> with your specific request and response types.
 */
export class ${pascalName}Controller extends BaseController<any, any> {
    constructor(
        requestContext: IContextAccessor<RequestContext>,
        mediator: IMediator,
    ) {
        super(requestContext, mediator);
    }

    public async handle(request: any): Promise<ResponseDto<any>> {
        const query = new ${pascalName}Query(request);
        const result = await this._query(query);

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Error during ${pascalName} operation');
        }

        return this.ok(result.getValueOrThrow());
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.controller.ts`),
      controllerContent,
    )

    // 4. Schema Zod
    if (hasZod) {
      const zodContent = `import { z } from 'zod';
import { ZodUtils } from '@xeno-js/core';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Define the actual Zod validation schema for your query payload.
 */
export const ${pascalName}Schema = ZodUtils.createQuerySchema({
    payload: z.any() // TODO: Update with strict validation
});
`
      await this._fileService.writeFileRecursive(
        path.join(componentDir, `${lowerName}.schema-zod.ts`),
        zodContent,
      )
    }

    // 5. Module
    const moduleContent = `import type { IServiceContainer, IConfigurationService } from '@xeno-js/core';
import { TOKENS } from '@xeno-js/core';
import { ${pascalName}Controller } from './${lowerName}.controller';
import { ${pascalName}Handler } from './${lowerName}.handler';

export const ${pascalName}Module = Object.freeze({
    register(opts: IServiceContainer<any>, _config: IConfigurationService): void {
        opts.addScoped('${tokenPrefix}_QUERY_CONTROLLER', (c) => new ${pascalName}Controller(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)));
        opts.addScoped('${tokenPrefix}_QUERY_HANDLER', (c) => new ${pascalName}Handler(c.resolve(TOKENS.USER_CONTEXT_FACTORY)));

        /*
         * ⚠️ WARNING: ACTION REQUIRED ⚠️
         * Please copy and paste the following tokens to your MyRegistry interface (usually in src/registry.ts):
         *
         * ${tokenPrefix}_QUERY_CONTROLLER: IController<any, any>;
         * ${tokenPrefix}_QUERY_HANDLER: IHandler<${pascalName}Query, any>;
         */
    }
} as const);
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.module.ts`),
      moduleContent,
    )
  }
}
