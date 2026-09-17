export interface IFileService {
  writeFileRecursive(filePath: string, content: string): Promise<void>
}
