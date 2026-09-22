import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node20',
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  bundle: true,
  outExtension: () => ({ js: '.js' }),
})