/**
 * Validaciones mejoradas para formularios
 *
 * Incluye validaciones más estrictas para seguridad
 */

export const validation = {
  /**
   * Valida contraseña con requisitos de seguridad mejorados
   * - Mínimo 8 caracteres
   * - Al menos una mayúscula
   * - Al menos una minúscula
   * - Al menos un número
   * - Al menos un carácter especial
   */
  password: (password: string): string | null => {
    if (!password) {
      return 'La contraseña es requerida'
    }

    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }

    if (!/[A-Z]/.test(password)) {
      return 'Debe contener al menos una letra mayúscula'
    }

    if (!/[a-z]/.test(password)) {
      return 'Debe contener al menos una letra minúscula'
    }

    if (!/[0-9]/.test(password)) {
      return 'Debe contener al menos un número'
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Debe contener al menos un carácter especial (!@#$%^&*)'
    }

    return null
  },

  /**
   * Valida email
   */
  email: (email: string): string | null => {
    if (!email) {
      return 'El email es requerido'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Email inválido'
    }

    return null
  },

  /**
   * Valida PIN de 4 dígitos
   */
  pin: (pin: string): string | null => {
    if (!pin) {
      return 'El PIN es requerido'
    }

    if (!/^\d{4}$/.test(pin)) {
      return 'El PIN debe ser de exactamente 4 dígitos'
    }

    // Evitar PINs muy débiles
    const weakPins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321']
    if (weakPins.includes(pin)) {
      return 'PIN muy débil. Evita secuencias simples'
    }

    return null
  },

  /**
   * Valida edad
   */
  age: (age: number): string | null => {
    if (!age) {
      return 'La edad es requerida'
    }

    if (age < 1 || age > 120) {
      return 'La edad debe estar entre 1 y 120 años'
    }

    return null
  },

  /**
   * Valida monto de dinero
   */
  amount: (amount: number, min = 0.01, max = 999999999): string | null => {
    if (!amount || isNaN(amount)) {
      return 'El monto es requerido'
    }

    if (amount < min) {
      return `El monto debe ser mayor a ${min}`
    }

    if (amount > max) {
      return `El monto no puede exceder ${max}`
    }

    return null
  },

  /**
   * Valida longitud de texto
   */
  textLength: (text: string, min: number, max: number, fieldName = 'Este campo'): string | null => {
    if (!text) {
      return `${fieldName} es requerido`
    }

    if (text.length < min) {
      return `${fieldName} debe tener al menos ${min} caracteres`
    }

    if (text.length > max) {
      return `${fieldName} no puede exceder ${max} caracteres`
    }

    return null
  },

  /**
   * Valida URL
   */
  url: (url: string): string | null => {
    if (!url) {
      return null // URL es opcional
    }

    try {
      const urlObj = new URL(url)
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return 'La URL debe comenzar con http:// o https://'
      }
      return null
    } catch {
      return 'URL inválida'
    }
  }
}
