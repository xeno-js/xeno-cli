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
    const appDir = path.join(componentDir, 'application')
    const infraDir = path.join(componentDir, 'infrastructure')
    const domainDir = path.join(componentDir, 'domain')
    const presDir = path.join(componentDir, 'presentation')

    const queryContent = `import { Query } from '@xeno-js/core';
export interface ${pascalName}Payload {
    // TODO: Define your command payload properties here
}

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Please replace <void> with your specific payload and response types.
 */
export class ${pascalName}Query extends Query<void> {
    constructor(public readonly payload: ${pascalName}Payload) {
        super(
            '${tokenPrefix}_QUERY_HANDLER', 
            // Default cache options:
            {
                ttl: 60,
                cacheKey: \`${lowerName}:\${JSON.stringify(payload)}\`,
                bypassCache: false,
                consistentRead: false,
                isUserScoped: false,
            }
        );
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(appDir, `${lowerName}.query.ts`),
      queryContent,
    )

    // 2. Handler
    const handlerContent = `import type { IFactory, ResultType, UserContext } from '@xeno-js/core';
import { AppError, BaseHandler, Result } from '@xeno-js/core';
import { ${pascalName}Query } from './${lowerName}.query';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Please replace <void> with your specific response type.
 */
export class ${pascalName}Handler extends BaseHandler<${pascalName}Query, void> {
    constructor(
        identityFactory: IFactory<void, UserContext>
        // TODO: Inject your ReadDao or DataSource here
    ) {
        super(identityFactory);
    }

    protected async executeAsync(request: ${pascalName}Query, singal: AbortSignal): Promise<ResultType<void>> {
        // TODO: Implement your query logic here

        return Result.ok();
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(appDir, `${lowerName}.handler.ts`),
      handlerContent,
    )

    // 3. Controller
    const controllerContent = `import type { IContextAccessor, IMediator, RequestContext, ResponseDto } from '@xeno-js/core';
import { BaseController } from '@xeno-js/core';
import { ${pascalName}Query, ${pascalName}Payload } from '../application/${lowerName}.query';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Please replace <${pascalName}Payload, void> with your specific request and response types.
 */
export class ${pascalName}Controller extends BaseController<${pascalName}Payload, void> {
    constructor(
        requestContext: IContextAccessor<RequestContext>,
        mediator: IMediator,
    ) {
        super(requestContext, mediator);
    }

    public async handle(request: ${pascalName}Payload, signal: AbortSignal): Promise<ResponseDto<void>> {
        const query = new ${pascalName}Query(request);
        const result = await this._query(query, signal);

        if (!result.isOk()) {
            return this.fail(result.getErrorOrThrow(), 'Error during ${pascalName} operation');
        }

        return this.ok(result.getValueOrThrow());
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(presDir, `${lowerName}.controller.ts`),
      controllerContent,
    )

    const entityContent = `import { Entity } from '@xeno-js/core';
        
        export interface ${pascalName}Props {
            // TODO: Define your entity properties
        }
        
        /*
         * ⚠️ WARNING: ACTION REQUIRED ⚠️
         * Adjust the properties and types according to your domain logic.
         */
        export class ${pascalName} extends Entity<${pascalName}Props> {
            private constructor(props: ${pascalName}Props, id?: string) {
                super(props, id);
            }
        
            static create(props: ${pascalName}Props, id?: string): ${pascalName} {
                return new ${pascalName}(props, id);
            }
        }
        `
    await this._fileService.writeFileRecursive(
      path.join(domainDir, `${lowerName}.entity.ts`),
      entityContent,
    )

    // 4. Schema Zod
    if (hasZod) {
      const zodContent = `import { z } from 'zod';
import { ZodUtils } from '@xeno-js/shared/zod';

/**
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Define the actual Zod validation schema for your command payload.
 */
export const ${pascalName}Schema = ZodUtils.createCommandSchema('${tokenPrefix}_QUERY_HANDLER', {
    payload: z.object({
        // TODO: Define strict validation rules here, e.g.:
        // email: z.string().email(),
        // name: z.string().min(1),
    }),
});
`
      await this._fileService.writeFileRecursive(
        path.join(infraDir, `${lowerName}.schema-zod.ts`),
        zodContent,
      )
    }

    // 5. Module
    const moduleContent = `import type { IServiceContainer, IConfigurationService } from '@xeno-js/core';
import { TOKENS } from '@xeno-js/core';
import { ${pascalName}Controller } from './presentation/${lowerName}.controller';
import { ${pascalName}Handler } from './application/${lowerName}.handler';

export const ${pascalName}Module = Object.freeze({
    register(opts: IServiceContainer<any>, _config: IConfigurationService): void {
        /*
         * ⚠️ WARNING: ACTION REQUIRED ⚠️
         * Please copy and paste the following tokens to your MyRegistry interface (usually in src/registry.ts):
         *
         * ${tokenPrefix}_QUERY_CONTROLLER: IController<${pascalName}Query, void>;
         * ${tokenPrefix}_QUERY_HANDLER: IHandler<${pascalName}Query, void>;
         * 
         * Remember to replace void with the actual return type of your command/controller handler
         */
        opts.addTransient('${tokenPrefix}_QUERY_CONTROLLER', (c) => new ${pascalName}Controller(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)));
        opts.addScoped('${tokenPrefix}_QUERY_HANDLER', (c) => new ${pascalName}Handler(c.resolve('USER_CONTEXT_FACTORY')));
    }
} as const);
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.module.ts`),
      moduleContent,
    )
  }
}
