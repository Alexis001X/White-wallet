import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Loader2, Lock } from 'lucide-react'

interface PinVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (userId: string) => void
  selectedUserId: string | null
}

export default function PinVerificationDialog({
  open,
  onOpenChange,
  onSuccess,
  selectedUserId,
}: PinVerificationDialogProps) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length !== 4) {
      setError('El PIN debe tener 4 dígitos')
      return
    }

    if (!selectedUserId) {
      setError('No se ha seleccionado un usuario')
      return
    }

    setLoading(true)
    setError('')

    try {
      logger.sensitive('🔐 Verificando PIN')

      // Verificar el PIN usando RPC pasando el user_id
      const { data, error: rpcError } = await supabase.rpc('verify_transaction_pin', {
        input_pin: pin,
        user_id: selectedUserId,
      })

      if (rpcError) {
        logger.error('❌ Error al verificar PIN', rpcError)
        throw rpcError
      }

      if (data === true) {
        logger.success('✅ PIN correcto, acceso concedido')
        onSuccess(selectedUserId)
        onOpenChange(false)
        setPin('')
      } else {
        logger.warn('⚠️ PIN incorrecto')
        setError('PIN incorrecto. Intenta de nuevo.')
        setPin('')
      }
    } catch (error: any) {
      logger.error('Error al verificar PIN', error)
      setError('PIN incorrecto. Intenta de nuevo.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setPin(value)
    setError('')
  }

  const handleClose = () => {
    setPin('')
    setError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Verificación de Seguridad
          </DialogTitle>
          <DialogDescription className="text-center">
            Ingresa tu PIN de 4 dígitos para acceder a tu dashboard de ahorro
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              type="password"
              inputMode="numeric"
              placeholder="••••"
              value={pin}
              onChange={handlePinChange}
              maxLength={4}
              className="text-center text-2xl tracking-widest font-bold"
              disabled={loading}
              autoFocus
            />
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full transition-all ${
                    pin.length > i
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || pin.length !== 4}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar PIN'
              )}
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Tu PIN es el que configuraste al crear tu cuenta
        </p>
      </DialogContent>
    </Dialog>
  )
}
