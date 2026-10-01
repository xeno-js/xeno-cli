import path from 'node:path'

import type { IFileService, IGenerator } from '../../../domain'
import type { CoreOptions } from '../../../shared'

export class VercelGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, _options: CoreOptions): Promise<void> {
    const vercelJson = {
      version: 2,
      builds: [
        {
          src: 'api/**/*.ts',
          use: '@vercel/node',
        },
      ],
    }
    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'vercel.json'),
      JSON.stringify(vercelJson, null, 2),
    )

    const apiContent = `import type { VercelRequest, VercelResponse } from '@vercel/node';
import { XenoApp } from '../src/bootstrap';
import { TOKENS } from '@xeno-js/core';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const container = await XenoApp();
        const logger = container.resolve(TOKENS.LOGGER);

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
        
        logger.info('Vercel function executed successfully at /api/hello-worlds');

        return res.status(200).json({ 
            success: true, 
            message: 'Hello from Xeno Vercel Serverless Function!' 
        });
    } catch (error) {
        console.error('Error during Vercel execution:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'api', 'hello-worlds.ts'),
      apiContent,
    )
  }
}
