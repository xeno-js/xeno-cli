import { type BaseOptions, type ScaffoldingOptions } from '../../shared'

export interface IGenerator<T extends BaseOptions = ScaffoldingOptions> {
  generate(projectPath: string, options: T): Promise<void>
}
