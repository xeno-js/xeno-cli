export type ProjectType = 'core' | 'vue'

export interface BaseOptions {
  targetDir: string
  projectType: ProjectType
  gitInit: boolean
}

export interface CoreOptions extends BaseOptions {
  axios: boolean
  cockatiel: boolean
  database: 'drizzle' | 'sqlLite' | 'none'
  supabase: boolean
  pino: boolean
  sentry: boolean
  redis: boolean
  targetEnv: 'console' | 'vercel' | 'fastify'
  zod: boolean
}

export interface VueOptions extends BaseOptions {
  axios: boolean
  cockatiel: boolean
  router: boolean
  pinia: boolean
  tailwind: boolean
  sentry: boolean
  supabase: boolean
  zod: boolean
}

export type ScaffoldingOptions = CoreOptions | VueOptions

/**
 * @description Represents a value that may be `null`.
 * Prefer this over `T | null` in all public APIs so intent is self-documenting.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Nullable<T> = T | null

/**
 * @description Represents a value that may be either `null` or `undefined`.
 * Use when a value is absent regardless of the reason.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Maybe<T> = T | null | undefined

/**
 * @description A plain-object dictionary with string keys and uniform value type.
 * Prefer over `{ [key: string]: V }` for self-documenting intent.

   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
export type Dictionary<V = unknown> = Record<string, V>
