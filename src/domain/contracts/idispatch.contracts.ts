export interface IDispatcher {
  dispatch(rawArgs: string[]): Promise<void>
}
