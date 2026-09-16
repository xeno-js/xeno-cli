export interface ICliCommand {
  /** Il nome principale del comando (es. 'new', 'generate') */
  get name(): string

  /** Eventuali alias (es. 'g' per 'generate') */
  get aliases(): string[]

  /**
   * Il metodo esecutivo.
   * Riceve solo gli argomenti di pertinenza (escludendo il nome del comando stesso).
   */
  execute(args: string[]): Promise<void>
}
