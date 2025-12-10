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
import { Loader2 } from 'lucide-react'
import type { SavingMethod } from '@/types/database'

interface CreateGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGoalCreated: () => void
  userId: string
}

export default function CreateGoalDialog({
  open,
  onOpenChange,
  onGoalCreated,
  userId,
}: CreateGoalDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    deadline: '',
    method: 'libre' as SavingMethod,
    fixed_amount: '',
    image_url: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar título
    const titleError = validation.textLength(formData.title, 3, 100, 'El título')
    if (titleError) newErrors.title = titleError

    // Validar monto objetivo
    const amountError = validation.amount(parseFloat(formData.target_amount))
    if (amountError) newErrors.target_amount = amountError

    // Validar monto fijo si el método lo requiere
    if (formData.method !== 'libre') {
      const fixedAmountError = validation.amount(parseFloat(formData.fixed_amount))
      if (fixedAmountError) newErrors.fixed_amount = fixedAmountError
    }

    // Validar URL de imagen si existe
    if (formData.image_url) {
      const urlError = validation.url(formData.image_url)
      if (urlError) newErrors.image_url = urlError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // Sanitizar inputs
      const sanitizedTitle = sanitize.text(formData.title)
      const sanitizedImageUrl = formData.image_url ? sanitize.url(formData.image_url) : null

      logger.info('💰 Creando meta de ahorro')

      const goalData = {
        user_id: userId,
        title: sanitizedTitle,
        target_amount: parseFloat(formData.target_amount),
        deadline: formData.deadline || null,
        method: formData.method,
        fixed_amount: formData.fixed_amount
          ? parseFloat(formData.fixed_amount)
          : null,
        image_url: sanitizedImageUrl,
        status: 'activa' as const,
      }

      const { error } = await supabase
        .from('saving_goals')
        .insert(goalData)
        .select()

      if (error) {
        logger.error('❌ Error al crear meta', error)
        throw error
      }

      logger.success('✅ Meta creada exitosamente')

      onGoalCreated()
      onOpenChange(false)

      // Limpiar formulario
      setFormData({
        title: '',
        target_amount: '',
        deadline: '',
        method: 'libre',
        fixed_amount: '',
        image_url: '',
      })
    } catch (error: any) {
      logger.error('Error al crear meta', error)
      setErrors({ submit: error.message || 'Error al crear la meta. Intenta de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Nueva Meta de Ahorro
          </DialogTitle>
          <DialogDescription>
            Define tu objetivo y comienza a ahorrar de forma organizada
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Meta *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Ej: Vacaciones 2025"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_amount">Monto Objetivo *</Label>
            <Input
              id="target_amount"
              type="number"
              step="0.01"
              placeholder="1000.00"
              value={formData.target_amount}
              onChange={(e) =>
                setFormData({ ...formData, target_amount: e.target.value })
              }
              disabled={loading}
            />
            {errors.target_amount && (
              <p className="text-sm text-red-500">{errors.target_amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Método de Ahorro *</Label>
            <select
              id="method"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.method}
              onChange={(e) =>
                setFormData({ ...formData, method: e.target.value as SavingMethod })
              }
              disabled={loading}
            >
              <option value="libre">Libre (sin monto fijo)</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          {formData.method !== 'libre' && (
            <div className="space-y-2">
              <Label htmlFor="fixed_amount">
                Monto {formData.method === 'semanal' ? 'Semanal' : formData.method === 'mensual' ? 'Mensual' : 'Anual'} *
              </Label>
              <Input
                id="fixed_amount"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={formData.fixed_amount}
                onChange={(e) =>
                  setFormData({ ...formData, fixed_amount: e.target.value })
                }
                disabled={loading}
              />
              {errors.fixed_amount && (
                <p className="text-sm text-red-500">{errors.fixed_amount}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image_url">URL de Imagen (opcional)</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              disabled={loading}
            />
            {errors.image_url && (
              <p className="text-sm text-red-500">{errors.image_url}</p>
            )}
            <p className="text-xs text-gray-500">
              Link de la imagen del artículo o motivo del ahorro
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Fecha Límite (opcional)</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              disabled={loading}
            />
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
                'Crear Meta'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
