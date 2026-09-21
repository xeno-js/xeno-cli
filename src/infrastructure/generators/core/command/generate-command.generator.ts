import path from 'node:path'

import type { IFileService } from '../../../../domain'

export class GenerateCommandCoreGenerator {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(
    pascalName: string,
    lowerName: string,
    tokenPrefix: string,
    componentDir: string,
    hasZod: boolean,
    hasDrizzle: boolean,
  ): Promise<void> {
    // 1. Command
    const commandContent = `import { Command } from '@xeno-js/core';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Please replace <any> with your specific payload and response types.
 */
export class ${pascalName}Command extends Command<any> {
    constructor(public readonly payload: any) {
        super('${tokenPrefix}_COMMAND_HANDLER');
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(componentDir, `${lowerName}.command.ts`),
      commandContent,
    )

    // 2. Handler
    const handlerContent = `import type { IFactory, ResultType, UserContext } from '@xeno-js/core';
import { AppError, BaseHandler, Result } from '@xeno-js/core';
import { ${pascalName}Command } from './${lowerName}.command';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Please replace <any> with your specific response type.
 */
export class ${pascalName}Handler extends BaseHandler<${pascalName}Command, any> {
    constructor(
        identityFactory: IFactory<void, UserContext>
    ) {
        super(identityFactory);
    }

    public async executeAsync(request: ${pascalName}Command, singal: AbortSignal): Promise<ResultType<any>> {
        // TODO: Implement your business logic here

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
import { ${pascalName}Command } from './${lowerName}.command';

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
        const cmd = new ${pascalName}Command(request);
        const result = await this._send(cmd);

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

    // 4. Entity
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
      path.join(componentDir, `${lowerName}.entity.ts`),
      entityContent,
    )

    // 5. Schema Zod (Condizionale)
    if (hasZod) {
      const zodContent = `import { z } from 'zod';
import { ZodUtils } from '@xeno-js/core';

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Define the actual Zod validation schema for your command payload.
 */
export const ${pascalName}Schema = ZodUtils.createCommandSchema({
    payload: z.any() // TODO: Update with strict validation
});
`
      await this._fileService.writeFileRecursive(
        path.join(componentDir, `${lowerName}.schema-zod.ts`),
        zodContent,
      )
    }

    // 6. Schema DB (Condizionale)
    if (hasDrizzle) {
      const dbContent = `import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
// Note: If you are using SQLite, change the import to 'drizzle-orm/sqlite-core' and update the table definition.

/*
 * ⚠️ WARNING: ACTION REQUIRED ⚠️
 * Update the schema definition with your actual database columns.
 */
export const ${lowerName}s = pgTable('${lowerName}s', {
    id: text('id').primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export type ${pascalName}Dto = typeof ${lowerName}s.$inferSelect;
export type New${pascalName}Dto = typeof ${lowerName}s.$inferInsert;
`
      await this._fileService.writeFileRecursive(
        path.join(componentDir, `${lowerName}.schema-db.ts`),
        dbContent,
      )
    }

    // 7. Module
    const moduleContent = `import type { IServiceContainer, IConfigurationService } from '@xeno-js/core';
import { TOKENS } from '@xeno-js/core';
import { ${pascalName}Controller } from './${lowerName}.controller';
import { ${pascalName}Handler } from './${lowerName}.handler';

export const ${pascalName}Module = Object.freeze({
    register(opts: IServiceContainer<any>, _config: IConfigurationService): void {
        opts.addTransient('${tokenPrefix}_COMMAND_CONTROLLER', (c) => new ${pascalName}Controller(c.resolve(TOKENS.REQUEST_CONTEXT), c.resolve(TOKENS.MEDIATOR)));
        opts.addScoped('${tokenPrefix}_COMMAND_HANDLER', (c) => new ${pascalName}Handler(c.resolve(TOKENS.USER_CONTEXT_FACTORY)));

        /*
         * ⚠️ WARNING: ACTION REQUIRED ⚠️
         * Please copy and paste the following tokens to your MyRegistry interface (usually in src/registry.ts):
         *
         * ${tokenPrefix}_COMMAND_CONTROLLER: IController<any, any>;
         * ${tokenPrefix}_COMMAND_HANDLER: IHandler<${pascalName}Command, any>;
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
