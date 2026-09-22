import { spawn } from 'node:child_process'

import { type ICommandRunner } from '../../domain'

/**
 * @class CommandUtils
 * @description Utility class for executing shell commands in a cross-platform manner.
 *
 * @author Xeno
 * @version 1.0.0
 * @license ISC
 * @since 2025-09-30
 * @link https://github.com/xeno-js/xeno-js
 */
export class CommandRunner implements ICommandRunner {
  public async run(command: string, args: string[], cwd: string, isWin = false): Promise<void> {
    return new Promise((resolve, reject) => {
      const cmd = isWin ? `${command}.cmd` : command

      const child = spawn(cmd, args, {
        cwd,
        stdio: 'inherit',
        shell: false,
      })

      child.on('error', (error) => {
        reject(new Error(`Error during execution of the command ${command}: ${error.message}`))
      })

      child.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`Command ${command} failed with code ${code}`))
      })
    })
  }
}
