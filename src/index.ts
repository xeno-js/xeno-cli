#!/usr/bin/env node
import pc from 'picocolors'

import { Builder } from './infrastructure/builder'

/**
 * @function init
 * @description Initializes the scaffolding process for a new Xeno project.
 *
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
async function init() {
  try {
    const dispatcher = Builder.getDispatcher()

    const rawArgs = process.argv.slice(2)

    await dispatcher.dispatch(rawArgs)
  } catch (error) {
    console.error(pc.red('\n❌ Execution interrupted:'))
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

init().catch(console.error)
