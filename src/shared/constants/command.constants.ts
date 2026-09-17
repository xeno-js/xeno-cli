export const ARGS_CONSTANTS = Object.freeze({
  HELP: '--help',
  VUE: '--vue',
  CORE: '--core',
  CONSOLE: '--console',
} as const)

export const COMMAND_CONSTANTS = Object.freeze({
  HELP: 'help',
  COMMAND: 'command',
  QUERY: 'query',
} as const)

export const TARGET_ENV_CONSTANTS = Object.freeze({
  CONSOLE: 'console',
  VERCEL: 'vercel',
  FASTIFY: 'fastify',
} as const)
