import path from 'node:path'

import { type IFileService, type IGenerator } from '../../domain'
import { CORE_CONSTANTS, type CoreOptions } from '../../shared'

export class GitIgnoreGenerator implements IGenerator<CoreOptions> {
  constructor(private readonly _fileService: IFileService) {}

  public async generate(projectPath: string, options: CoreOptions): Promise<void> {
    let content = `# Dependencies
node_modules/

# Build artifacts
dist/
out/
build/

# Environment variables
# We ignore actual .env files for security, but keep .env.example for documentation
.env
.env.local
.env.*
!.env.example

# Logs
*.log
logs/
npm-debug.log*

# Test coverage
coverage/
.nyc_output/

# OS and IDE
.DS_Store
Thumbs.db
.vscode/
.idea/
`

    if (options.database === CORE_CONSTANTS.SQL_LITE) {
      content += `\n# SQLite Database
*.sqlite
*.sqlite3
*.sqlite-journal
`
    }

    // Ignora la cartella di compilazione locale di Vercel se l'ambiente lo richiede
    if (options.targetEnv === CORE_CONSTANTS.VERCEL) {
      content += `\n# Vercel
.vercel/
`
    }

    const filePath = path.join(projectPath, '.gitignore')
    await this._fileService.writeFileRecursive(filePath, content)
  }
}
