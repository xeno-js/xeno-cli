import { Guards } from './guards.utils'

export const StringUtils = Object.freeze({
  /**
   * @description Inserisce un underscore (_) tra la fine di una parola e l'inizio della successiva in formato camelCase o PascalCase.
   * @param input Stringa in input (es. "CreateUser").
   * @returns Stringa separata da underscore (es. "Create_User").
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2026-09-18
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  splitCamelCaseWithUnderscore(input: string): string {
    if (!Guards.isString(input) || Guards.isNullOrEmpty(input)) return input
    return input.replace(/([a-z])([A-Z])/g, '$1_$2')
  },
  /**
   * @description Converts a string to camelCase.
   * @param input Input string (supports snake_case, kebab-case, or space-separated).
   * @returns camelCase string.
  
   * 
   * @author Xeno
   * @version 1.0.0
   * @since 2025-09-30
   * @link https://github.com/Mattia-Carcione/xeno-js 
   */
  camelCase(input: string): string {
    const segments = input.split(/[-_\s]+/)
    const [first, ...rest] = segments
    const head = Guards.isDefined(first) ? first.toLowerCase() : ''
    return head + rest.map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1)).join('')
  },
  /**
   * @description Converts a string to PascalCase.
   * @param input Input string (supports snake_case, kebab-case, space-separated, or camelCase).
   * @returns PascalCase string.
   *
   * @author Xeno
   * @version 1.0.0
   * @since 2026-09-18
   * @link https://github.com/Mattia-Carcione/xeno-js
   */
  pascalCase(input: string): string {
    if (!Guards.isString(input) || Guards.isNullOrEmpty(input)) return ''

    const segments = input.split(/[-_\s]+/)

    return segments
      .filter((seg) => seg.length > 0)
      .map((seg) => {
        // Se il segmento è tutto maiuscolo (es. CREATE), lo normalizziamo in minuscolo per evitare cREATE.
        // Altrimenti, preserviamo il casing interno originale (es. UserService resta UserService).
        const normalized = seg === seg.toUpperCase() ? seg.toLowerCase() : seg
        return normalized.charAt(0).toUpperCase() + normalized.slice(1)
      })
      .join('')
  },
} as const)
