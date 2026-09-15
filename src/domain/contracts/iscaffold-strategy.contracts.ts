import { type BaseOptions, type ScaffoldingOptions } from '@/shared'

import { type IGenerator } from './igenerator.contracts'

export interface IScaffoldStrategy {
  promptOptions(targetDir: string): Promise<ScaffoldingOptions>
  getGenerators<T extends BaseOptions>(options: ScaffoldingOptions): Promise<IGenerator<T>[]>
}
