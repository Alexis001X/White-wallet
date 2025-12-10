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
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import type { TransactionType } from '@/types/database'

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTransactionAdded: () => void
  goalId: string
  userId: string
  goalTitle: string
  currentAmount: number
  targetAmount: number
}

export default function AddTransactionDialog({
  open,
  onOpenChange,
  onTransactionAdded,
  goalId,
  userId,
  goalTitle,
  currentAmount,
  targetAmount,
}: AddTransactionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [transactionType, setTransactionType] = useState<TransactionType>('ingreso')
  const [formData, setFormData] = useState({
    amount: '',
    note: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar monto
    const amountError = validation.amount(parseFloat(formData.amount))
    if (amountError) {
      newErrors.amount = amountError
    }

    // Validar que el retiro no exceda el saldo actual
    if (transactionType === 'retiro') {
      const amount = parseFloat(formData.amount)
      if (amount > currentAmount) {
        newErrors.amount = `No puedes retirar más de ${formatCurrency(currentAmount)}`
      }
    }

    // Validar nota si existe (máx 500 caracteres)
    if (formData.note) {
      const noteError = validation.textLength(formData.note, 0, 500, 'La nota')
      if (noteError) newErrors.note = noteError
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
      const amount = parseFloat(formData.amount)
      const sanitizedNote = formData.note ? sanitize.text(formData.note) : null

      logger.info('💸 Creando transacción')

      const { error } = await supabase
        .from('transactions')
        .insert({
          goal_id: goalId,
          user_id: userId,
          amount,
          type: transactionType,
          note: sanitizedNote,
        })
        .select()

      if (error) {
        logger.error('❌ Error al crear transacción', error)
        throw error
      }

      logger.success('✅ Transacción creada exitosamente')

      // Limpiar formulario
      setFormData({ amount: '', note: '' })
      setTransactionType('ingreso')

      onTransactionAdded()
      onOpenChange(false)
    } catch (error: any) {
      logger.error('Error al crear transacción', error)
      setErrors({
        submit: error.message || 'Error al crear la transacción. Intenta de nuevo.',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getTypeInfo = () => {
    switch (transactionType) {
      case 'ingreso':
        return {
          label: 'Agregar Ahorro',
          icon: TrendingUp,
          color: 'from-green-600 to-emerald-500',
          description: 'Aumenta el saldo de tu meta',
        }
      case 'retiro':
        return {
          label: 'Retirar Dinero',
          icon: TrendingDown,
          color: 'from-red-600 to-rose-500',
          description: 'Disminuye el saldo de tu meta',
        }
      case 'gasto_externo':
        return {
          label: 'Registrar Gasto Externo',
          icon: AlertCircle,
          color: 'from-orange-600 to-amber-500',
          description: 'Registra un gasto sin afectar el saldo',
        }
    }
  }

  const typeInfo = getTypeInfo()
  const Icon = typeInfo.icon
  const newAmount =
    transactionType === 'ingreso'
      ? currentAmount + (parseFloat(formData.amount) || 0)
      : transactionType === 'retiro'
      ? currentAmount - (parseFloat(formData.amount) || 0)
      : currentAmount

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className={`text-2xl bg-gradient-to-r ${typeInfo.color} bg-clip-text text-transparent`}>
            {typeInfo.label}
          </DialogTitle>
          <DialogDescription>Meta: {goalTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Transacción */}
          <div className="space-y-2">
            <Label>Tipo de Operación *</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTransactionType('ingreso')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  transactionType === 'ingreso'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
                disabled={loading}
              >
                <TrendingUp
                  className={`h-5 w-5 mx-auto mb-1 ${
                    transactionType === 'ingreso' ? 'text-green-600' : 'text-gray-400'
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    transactionType === 'ingreso' ? 'text-green-700' : 'text-gray-600'
                  }`}
                >
                  Ingreso
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTransactionType('retiro')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  transactionType === 'retiro'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
                disabled={loading}
              >
                <TrendingDown
                  className={`h-5 w-5 mx-auto mb-1 ${
                    transactionType === 'retiro' ? 'text-red-600' : 'text-gray-400'
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    transactionType === 'retiro' ? 'text-red-700' : 'text-gray-600'
                  }`}
                >
                  Retiro
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTransactionType('gasto_externo')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  transactionType === 'gasto_externo'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                disabled={loading}
              >
                <AlertCircle
                  className={`h-5 w-5 mx-auto mb-1 ${
                    transactionType === 'gasto_externo' ? 'text-orange-600' : 'text-gray-400'
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    transactionType === 'gasto_externo' ? 'text-orange-700' : 'text-gray-600'
                  }`}
                >
                  Gasto
                </p>
              </button>
            </div>
            <p className="text-xs text-gray-500">{typeInfo.description}</p>
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              disabled={loading}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          {/* Nota */}
          <div className="space-y-2">
            <Label htmlFor="note">Nota (opcional)</Label>
            <Textarea
              id="note"
              placeholder="Ej: Ahorro de la semana, compra de café..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Saldo actual:</span>
              <span className="font-semibold">{formatCurrency(currentAmount)}</span>
            </div>
            {formData.amount && parseFloat(formData.amount) > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {transactionType === 'ingreso' ? '+' : transactionType === 'retiro' ? '-' : '±'}{' '}
                    Monto:
                  </span>
                  <span
                    className={`font-semibold ${
                      transactionType === 'ingreso'
                        ? 'text-green-600'
                        : transactionType === 'retiro'
                        ? 'text-red-600'
                        : 'text-orange-600'
                    }`}
                  >
                    {formatCurrency(parseFloat(formData.amount))}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Nuevo saldo:</span>
                    <span className="font-bold text-purple-600">{formatCurrency(newAmount)}</span>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Meta objetivo:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(targetAmount)}</span>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
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
              disabled={loading || !formData.amount}
              className={`bg-gradient-to-r ${typeInfo.color} hover:opacity-90`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Icon className="mr-2 h-4 w-4" />
                  Confirmar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
