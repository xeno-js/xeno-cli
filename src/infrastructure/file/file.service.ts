import { mkdir, writeFile } from 'fs/promises'
import { dirname } from 'path'

import { type IFileService } from '../../domain'

export class FileUtils implements IFileService {
  public async writeFileRecursive(filePath: string, content: string): Promise<void> {
    const dir = dirname(filePath)

    await mkdir(dir, { recursive: true })

    await writeFile(filePath, content, 'utf8')
  }
}
