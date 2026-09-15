export type ProjectType = 'core' | 'vue'

export interface BaseOptions {
  targetDir: string
  projectType: ProjectType
}

export interface CoreOptions extends BaseOptions {
  database: boolean
  sqlLite: boolean
  http: boolean
  supabase: boolean
  logging: boolean
  sentry: boolean
  redis: boolean
  targetEnv: 'node' | 'vercel' | 'fastify'
  zod: boolean
}

export interface VueOptions extends BaseOptions {
  router: boolean
  pinia: boolean
  tailwind: boolean
  ssr: boolean
}

export type ScaffoldingOptions = CoreOptions | VueOptions
