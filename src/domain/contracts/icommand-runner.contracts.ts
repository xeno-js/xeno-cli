export interface ICommandRunner {
  run(command: string, args: string[], cwd: string): Promise<void>
}
