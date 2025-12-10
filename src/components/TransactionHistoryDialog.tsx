import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { TrendingUp, TrendingDown, AlertCircle, Calendar, Loader2 } from 'lucide-react'
import type { Transaction } from '@/types/database'

interface TransactionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goalId: string
  goalTitle: string
}

export default function TransactionHistoryDialog({
  open,
  onOpenChange,
  goalId,
  goalTitle,
}: TransactionHistoryDialogProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      loadTransactions()
    }
  }, [open, goalId])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      console.log('📜 Cargando historial de transacciones para meta:', goalId)

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error al cargar transacciones:', error)
        throw error
      }

      console.log('✅ Transacciones cargadas:', data)
      setTransactions(data || [])
    } catch (error) {
      console.error('Error completo al cargar transacciones:', error)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'ingreso':
        return {
          label: 'Ingreso',
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        }
      case 'retiro':
        return {
          label: 'Retiro',
          icon: TrendingDown,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        }
      case 'gasto_externo':
        return {
          label: 'Gasto Externo',
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
        }
      default:
        return {
          label: type,
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        }
    }
  }

  const totalIngresos = transactions
    .filter((t) => t.type === 'ingreso')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalRetiros = transactions
    .filter((t) => t.type === 'retiro')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalGastos = transactions
    .filter((t) => t.type === 'gasto_externo')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Historial de Transacciones
          </DialogTitle>
          <DialogDescription>Meta: {goalTitle}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No hay transacciones aún</p>
            <p className="text-sm text-gray-500 mt-2">
              Las transacciones aparecerán aquí cuando agregues ahorros, retires o registres gastos
            </p>
          </div>
        ) : (
          <>
            {/* Resumen de Transacciones */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-xs font-medium text-green-700">Ingresos</p>
                </div>
                <p className="text-lg font-bold text-green-600">{formatCurrency(totalIngresos)}</p>
                <p className="text-xs text-green-600">
                  {transactions.filter((t) => t.type === 'ingreso').length} transacciones
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <p className="text-xs font-medium text-red-700">Retiros</p>
                </div>
                <p className="text-lg font-bold text-red-600">{formatCurrency(totalRetiros)}</p>
                <p className="text-xs text-red-600">
                  {transactions.filter((t) => t.type === 'retiro').length} transacciones
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <p className="text-xs font-medium text-orange-700">Gastos</p>
                </div>
                <p className="text-lg font-bold text-orange-600">{formatCurrency(totalGastos)}</p>
                <p className="text-xs text-orange-600">
                  {transactions.filter((t) => t.type === 'gasto_externo').length} transacciones
                </p>
              </div>
            </div>

            {/* Lista de Transacciones */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {transactions.map((transaction) => {
                const typeInfo = getTypeInfo(transaction.type)
                const Icon = typeInfo.icon

                return (
                  <div
                    key={transaction.id}
                    className={`${typeInfo.bgColor} ${typeInfo.borderColor} border rounded-lg p-4 transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`${typeInfo.color} p-2 rounded-full bg-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-semibold ${typeInfo.color}`}>{typeInfo.label}</p>
                            <span className="text-xs text-gray-500">
                              {formatDate(transaction.created_at)}
                            </span>
                          </div>
                          {transaction.note && (
                            <p className="text-sm text-gray-600 mt-1">{transaction.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${typeInfo.color}`}>
                          {transaction.type === 'retiro' ? '-' : ''}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer con total de transacciones */}
            <div className="pt-4 border-t mt-4">
              <p className="text-center text-sm text-gray-600">
                Total: {transactions.length}{' '}
                {transactions.length === 1 ? 'transacción' : 'transacciones'}
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
