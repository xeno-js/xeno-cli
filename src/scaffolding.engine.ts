// import { mkdir } from 'fs/promises'
// import { resolve } from 'path'
// import pc from 'picocolors'

// import { type IGenerator } from './generator.contracts'
// import { type ScaffoldingOptions } from './generator.contracts'

// /**
//  * @class ScaffoldingEngine
//  * @description The ScaffoldingEngine orchestrates the execution of multiple generators based on user-selected options.
//  * It ensures that each generator is executed in the correct order and handles any errors that may arise during the scaffolding process.
//  *
//  * @author Xeno
//  * @version 1.0.0
//  * @license ISC
//  * @since 2025-09-30
//  * @link https://github.com/Mattia-Carcione/xeno-js
//  */
// export class ScaffoldingEngine {
//   /**
//    * Creates an instance of ScaffoldingEngine.
//    * @param generators - An array of generators to be executed during the scaffolding process.
//    *
//    * @author Xeno
//    * @version 1.0.0
//    * @license ISC
//    * @since 2025-09-30
//    * @link https://github.com/Mattia-Carcione/xeno-js
//    */
//   constructor(private readonly generators: IGenerator[]) {}

//   /**
//    * Executes the scaffolding process by running each generator that should be executed based on the provided options.
//    * It creates the target directory if it does not exist and handles any errors that occur during the execution of generators.
//    *
//    * @param projectPath - The relative path of the target directory
//    * @param options - The user-selected options
//    *
//    * @author Xeno
//    * @version 1.0.0
//    * @license ISC
//    * @since 2025-09-30
//    * @link https://github.com/Mattia-Carcione/xeno-js
//    */
//   async run(projectPath: string, options: ScaffoldingOptions): Promise<void> {
//     console.info(pc.cyan('\n🔨 Starting scaffolding process...'))

//     const absolutePath = resolve(process.cwd(), projectPath)

//     await mkdir(absolutePath, { recursive: true })

//     for (const generator of this.generators) {
//       if (generator.shouldGenerate(options)) {
//         try {
//           await generator.generate(absolutePath, options)
//         } catch (error: unknown) {
//           console.error(pc.red(`\n❌ Failed to execute generator: ${String(error)}`))
//           throw error
//         }
//       }
//     }

//     console.info(pc.green('\n✨ Scaffolding completed successfully!'))
//   }
// }
