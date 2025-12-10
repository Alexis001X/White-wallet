import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { sanitize } from '@/lib/sanitize'
import { validation } from '@/lib/validation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Loader2 } from 'lucide-react'

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated: () => void
}

export default function CreateUserDialog({
  open,
  onOpenChange,
  onUserCreated,
}: CreateUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    age: '',
    description: '',
    transaction_pin: '',
    confirm_pin: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar email
    const emailError = validation.email(formData.email)
    if (emailError) newErrors.email = emailError

    // Validar contraseña con requisitos mejorados
    const passwordError = validation.password(formData.password)
    if (passwordError) newErrors.password = passwordError

    // Validar nombre
    const nameError = validation.textLength(formData.full_name, 2, 100, 'El nombre')
    if (nameError) newErrors.full_name = nameError

    // Validar edad
    const ageError = validation.age(parseInt(formData.age))
    if (ageError) newErrors.age = ageError

    // Validar PIN
    const pinError = validation.pin(formData.transaction_pin)
    if (pinError) newErrors.transaction_pin = pinError

    // Validar confirmación de PIN
    if (formData.transaction_pin !== formData.confirm_pin) {
      newErrors.confirm_pin = 'Los PINs no coinciden'
    }

    // Validar descripción si existe
    if (formData.description) {
      const descError = validation.textLength(formData.description, 0, 500, 'La descripción')
      if (descError) newErrors.description = descError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // Sanitizar inputs antes de enviar
      const sanitizedEmail = sanitize.email(formData.email)
      const sanitizedFullName = sanitize.text(formData.full_name)
      const sanitizedDescription = formData.description ? sanitize.text(formData.description) : null

      logger.info('🚀 Iniciando creación de usuario')

      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: formData.password,
        options: {
          data: {
            full_name: sanitizedFullName,
          },
          emailRedirectTo: undefined,
        },
      })

      if (authError) {
        // Manejar error de email duplicado
        if (authError.message.includes('already registered') ||
            authError.message.includes('User already registered')) {
          throw new Error('Este email ya está registrado. Por favor usa otro email.')
        }
        throw authError
      }

      if (!authData.user) throw new Error('No se pudo crear el usuario')

      logger.sensitive('✅ Usuario creado en Auth')

      // 2. Esperar a que el trigger cree el perfil base
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 3. Actualizar el perfil con todos los datos
      logger.info('📝 Actualizando perfil')

      const { data: updateResult, error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: sanitizedFullName,
          age: parseInt(formData.age),
          description: sanitizedDescription,
          avatar_url: null,
        })
        .eq('id', authData.user.id)
        .select()

      if (profileError) {
        logger.error('❌ Error al actualizar perfil', profileError)
        throw new Error('Error al actualizar el perfil: ' + profileError.message)
      }

      if (!updateResult || updateResult.length === 0) {
        logger.warn('⚠️ UPDATE no afectó ninguna fila. Verificando si el perfil existe...')

        // Verificar si el perfil existe
        const { error: checkError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (checkError) {
          logger.error('❌ Error al verificar perfil', checkError)
        } else {
          logger.info('🔍 Perfil encontrado en DB')
        }
      } else {
        logger.success('✅ Perfil actualizado correctamente')
      }

      // 4. Establecer el PIN de transacciones
      logger.sensitive('🔐 Estableciendo PIN')

      const { error: pinError } = await supabase.rpc('set_transaction_pin', {
        pin_code: formData.transaction_pin,
        user_id: authData.user.id, // Pasar el user_id explícitamente
      })

      if (pinError) {
        logger.error('❌ Error al establecer PIN', pinError)
        throw new Error('Error al establecer el PIN de seguridad: ' + pinError.message)
      }

      logger.success('✅ PIN establecido correctamente')

      // 5. Éxito - limpiar formulario y notificar
      onUserCreated()
      onOpenChange(false)

      setFormData({
        email: '',
        password: '',
        full_name: '',
        age: '',
        description: '',
        transaction_pin: '',
        confirm_pin: '',
      })
    } catch (error: any) {
      logger.error('Error al crear usuario', error)
      const errorMessage = error.message || 'Error al crear el usuario. Intenta de nuevo.'
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Crear Nuevo Usuario
          </DialogTitle>
          <DialogDescription>
            Completa tus datos para comenzar a gestionar tus ahorros
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mín. 8 caracteres, mayúscula, número y especial"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Juan Pérez"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                disabled={loading}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad *</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                disabled={loading}
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Cuéntanos sobre ti..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction_pin">PIN de Transacciones *</Label>
              <Input
                id="transaction_pin"
                type="password"
                placeholder="4 dígitos"
                maxLength={4}
                pattern="[0-9]{4}"
                value={formData.transaction_pin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transaction_pin: e.target.value.replace(/\D/g, ''),
                  })
                }
                disabled={loading}
              />
              {errors.transaction_pin && (
                <p className="text-sm text-red-500">{errors.transaction_pin}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_pin">Confirmar PIN *</Label>
              <Input
                id="confirm_pin"
                type="password"
                placeholder="4 dígitos"
                maxLength={4}
                pattern="[0-9]{4}"
                value={formData.confirm_pin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirm_pin: e.target.value.replace(/\D/g, ''),
                  })
                }
                disabled={loading}
              />
              {errors.confirm_pin && (
                <p className="text-sm text-red-500">{errors.confirm_pin}</p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Usuario'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
