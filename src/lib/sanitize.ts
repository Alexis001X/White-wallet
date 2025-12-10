/**
 * Utilidades de sanitización para prevenir XSS
 *
 * Limpia inputs de usuario antes de guardarlos o mostrarlos
 */
import DOMPurify from 'dompurify'

export const sanitize = {
  /**
   * Sanitiza texto plano - remueve TODO el HTML
   * Usar para: nombres, descripciones, notas, etc.
   */
  text: (input: string): string => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML permitido
      ALLOWED_ATTR: []
    }).trim()
  },

  /**
   * Sanitiza URLs - solo permite http/https
   * Usar para: image_url, avatar_url
   */
  url: (input: string): string | null => {
    const cleaned = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    }).trim()

    // Validar que sea URL válida con http/https
    try {
      const url = new URL(cleaned)
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return cleaned
      }
      return null
    } catch {
      return null
    }
  },

  /**
   * Sanitiza números - remueve caracteres no numéricos
   * Usar para: montos, edades
   */
  number: (input: string): string => {
    return input.replace(/[^0-9.]/g, '')
  },

  /**
   * Sanitiza emails - formato básico
   */
  email: (input: string): string => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    }).trim().toLowerCase()
  }
}
