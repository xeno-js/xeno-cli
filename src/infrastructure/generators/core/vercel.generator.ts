import path from 'node:path'

import type { IFileService, IGenerator } from '../../../domain'
import type { CoreOptions } from '../../../shared'

export class VercelGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, _options: CoreOptions): Promise<void> {
    const vercelJson = {
      version: 2,
      functions: {
        'api/**/*.ts': {
          maxDuration: 30,
          includeFiles: 'src/**/*',
        },
      },
      routes: [
        {
          handle: 'filesystem',
        },
        {
          src: '/api/(.*)',
          dest: '/api/$1.ts',
        },
        {
          src: '/(.*)',
          dest: '/404.html',
          status: 404,
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
        
        logger.info('Vercel function executed successfully at /api/hello-world');

        return res.status(200).json({ 
            success: true, 
            message: 'Hello World! From Xeno Vercel Serverless Function!' 
        });
    } catch (error) {
        console.error('Error during Vercel execution:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
`
    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'api', 'hello-world.ts'),
      apiContent,
    )
    const notFound = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Page not found  404</title>
    <style>
      body{font-family:Inter,system-ui,Arial,Helvetica,sans-serif;background:#f6f8fa;color:#0f172a;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
      .card{max-width:720px;padding:36px;border-radius:12px;background:#ffffff;box-shadow:0 6px 24px rgba(15,23,42,.08)}
      h1{margin:0 0 8px;font-size:28px}
      p{margin:0 0 16px;color:#475569}
      a{color:#0ea5e9;text-decoration:none;font-weight:600}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>404  Page Not Found</h1>
      <p>The request page was not found. Check the URL or return to the <a href="/">homepage</a>.</p>
    </div>
  </body>
  </html>`

    await this._fileService.writeFileRecursive(
      path.join(projectPath, 'public', '404.html'),
      notFound,
    )
  }
}
