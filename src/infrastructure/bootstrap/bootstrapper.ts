// // src/core/bootstrapper.ts
// import { mkdir } from 'node:fs/promises'
// import { resolve } from 'node:path'

// import pc from 'picocolors'

// import type { IGenerator } from '@/domain'
// import { type BaseOptions, type ScaffoldingOptions } from '@/shared'

// export class Bootstrapper<T extends BaseOptions = ScaffoldingOptions> {
//   constructor(private readonly _generators: IGenerator<T>[]) {}

//   public async run(projectPath: string, options: T): Promise<void> {
//     console.info(pc.cyan('\n🚀 Initializing scaffolding...'))

//     const absolutePath = resolve(process.cwd(), projectPath)
//     await mkdir(absolutePath, { recursive: true })

//     for (const generator of this._generators) {
//       try {
//         await generator.generate(absolutePath, options)
//       } catch (error) {
//         console.error(pc.red(`\n❌ Error during execution of ${generator.constructor.name}`))
//         throw error
//       }
//     }

//     console.info(pc.green('\n✨ Scaffolding completed succesfully!'))
//   }
// }
