import { access, writeFile } from 'fs/promises'

import { type IFileService } from '../../domain'

export class FileUtils implements IFileService {
  public async writeFileRecursive(filePath: string, content: string): Promise<void> {
    try {
      await access(filePath)
      throw new Error(`[Xeno CLI Error]: Aborted. File already exists at path: ${filePath}`)
    } catch (error: unknown) {
      if ((error as { code?: string }).code !== 'ENOENT') {
        throw error
      }
    }

    await writeFile(filePath, content, 'utf8')
  }
}
