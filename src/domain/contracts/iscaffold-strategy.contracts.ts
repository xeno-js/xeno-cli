import { type BaseOptions, type ScaffoldingOptions } from '../../shared'
import { type IGenerator } from './igenerator.contracts'

export interface IScaffoldStrategy<T extends BaseOptions> {
  promptOptions(targetDir: string): Promise<ScaffoldingOptions>
  getGenerators(options: ScaffoldingOptions): Promise<IGenerator<T>[]>
}
