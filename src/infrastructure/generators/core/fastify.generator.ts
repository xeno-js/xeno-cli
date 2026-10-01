import path from 'node:path'

import type { IFileService, IGenerator } from '../../../domain'
import type { CoreOptions } from '../../../shared'

export class FastifyGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: CoreOptions): Promise<void> {
    const mainContent = `import 'dotenv/config';
import Fastify from 'fastify';
import { XenoApp } from './bootstrap';
import { TOKENS } from '@xeno-js/core';

async function main() {
    console.info('  Bootstrapping ${options.targetDir} Fastify application...');

    const fastify = Fastify({ logger: true });

    // Initialize the container and resolve the logger
    const container = await XenoApp();
    const logger = container.resolve(TOKENS.LOGGER);

    fastify.get('/', async (req, reply) => {
        logger.info('  Fastify received GET request on /');

        // IN A REAL SCENARIO YOU WOULD USE THE CONTAINER TO RESOLVE THE SERVICE
        /** EXAMPLE: 
        * const action = async () => {
        * //ContainerUtils from @xeno-js/core
        *    const controller = ContainerUtils.resolveServiceScoped('YOUR_TOKEN_CONTROLLER', container)
        *    return await controller.handle(req.body | req.params | undefined, new AbortSignal())
        * }
        *
        * const response = await ContainerUtils.runExecute(res, req, container, action)
        * if(!response.ok)
        * {
        *   return {
        *     success: false,
        *     message: 'Error executing request'
        *   }
        * }
        */ 
        
        return { 
            success: true, 
            message: 'Welcome to Xeno.JS with Fastify!' 
        };
    });

    const port = Number(process.env.PORT) || 3000;

    try {
        await fastify.listen({ port, host: '0.0.0.0' });
        logger.info(\`  Xeno Fastify server is running on http://localhost:\${port}\`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

main();
`

    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'src', 'main.ts'),
      mainContent,
    )
  }
}
