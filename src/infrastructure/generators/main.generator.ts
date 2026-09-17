import path from 'node:path'

import { type IFileService, type IGenerator } from '../../domain'
import type { CoreOptions } from '../../shared'

export class MainGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: CoreOptions): Promise<void> {
    const content = `import 'dotenv/config';
import { bootstrap } from './bootstrap';
import { TOKENS } from '@xeno-js/core';

/**
 * Main Application Entry Point
 */
async function main() {
  try {
    console.info('⏳ Bootstrapping ${options.targetDir} application...');
    
    // Initialize the dependency injection container and infrastructure modules
    const container = await bootstrap();
    
    const logger = container.resolve(TOKENS.LOGGER)
    logger.info('✅ Application started successfully!');

    // TODO: Implement your logic here
    
  } catch (error) {
    console.error('❌ Critical error during startup:', error);
    process.exit(1);
  }
}

main();
`

    const filePath = path.join(projectPath, 'src', 'main.ts')
    await this._fileService.writeFileRecursive(filePath, content)
  }
}
