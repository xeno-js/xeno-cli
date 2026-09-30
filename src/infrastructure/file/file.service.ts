import path from 'node:path'

import { access, mkdir, writeFile } from 'fs/promises'

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

    const dirPath = path.dirname(filePath)
    await mkdir(dirPath, { recursive: true })
    await writeFile(filePath, content, 'utf8')
  }
}
