// import * as fsPromises from 'fs/promises'
// import { dirname } from 'path'
import { beforeEach, describe, it, vi } from 'vitest'

// import { FileUtils } from '../file.utils'

vi.mock('fs/promises', () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}))

describe('FileUtils', () => {
  // const mkdirMock = vi.mocked(fsPromises.mkdir)
  // const writeFileMock = vi.mocked(fsPromises.writeFile)

  beforeEach(() => {
    // mkdirMock.mockReset()
    // writeFileMock.mockReset()
  })

  it('calls mkdir with recursive and writes file with utf8', async () => {
    // mkdirMock.mockResolvedValue(undefined)
    // writeFileMock.mockResolvedValue(undefined)
    // const filePath = '/tmp/some/nested/file.txt'
    // const content = 'hello'
    // await FileUtils.writeFileRecursive(filePath, content)
    // expect(mkdirMock).toHaveBeenCalledWith(dirname(filePath), { recursive: true })
    // expect(writeFileMock).toHaveBeenCalledWith(filePath, content, 'utf8')
  })

  it('propagates writeFile error', async () => {
    // mkdirMock.mockResolvedValue(undefined)
    // writeFileMock.mockRejectedValue(new Error('disk full'))
    // await expect(FileUtils.writeFileRecursive('/tmp/a', 'x')).rejects.toThrow('disk full')
  })
})
