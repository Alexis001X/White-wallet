/**
 * Logger seguro que previene exposición de datos sensibles
 *
 * - En desarrollo: muestra logs en consola
 * - En producción: solo registra errores críticos
 * - Nunca expone IDs de usuario, PINs, o datos personales
 */

const isDev = import.meta.env.DEV

export const logger = {
  /**
   * Log general de información (solo en desarrollo)
   */
  info: (message: string, data?: any) => {
    if (isDev) {
      console.log(message, data)
    }
  },

  /**
   * Log de errores (en desarrollo y producción)
   */
  error: (message: string, error?: any) => {
    if (isDev) {
      console.error(message, error)
    } else {
      // En producción, enviar a servicio de monitoring
      // TODO: Integrar con Sentry u otro servicio
      console.error(message, '[Error details hidden in production]')
    }
  },

  /**
   * Log para operaciones con datos sensibles
   * NUNCA muestra los datos reales, solo el mensaje
   */
  sensitive: (message: string) => {
    if (isDev) {
      console.log(message, '[DATOS SENSIBLES OCULTOS]')
    }
  },

  /**
   * Log de éxito (solo en desarrollo)
   */
  success: (message: string) => {
    if (isDev) {
      console.log(message)
    }
  },

  /**
   * Log de advertencia
   */
  warn: (message: string, data?: any) => {
    if (isDev) {
      console.warn(message, data)
    }
  }
}
