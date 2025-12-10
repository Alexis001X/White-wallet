import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'
import { Plus, Target, Calendar, TrendingUp, Wallet, History } from 'lucide-react'
import CreateGoalDialog from './CreateGoalDialog'
import AddTransactionDialog from './AddTransactionDialog'
import TransactionHistoryDialog from './TransactionHistoryDialog'
import type { SavingGoal } from '@/types/database'

interface WalletDashboardProps {
  userId: string
}

export default function WalletDashboard({ userId }: WalletDashboardProps) {
  const [goals, setGoals] = useState<SavingGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null)

  useEffect(() => {
    loadGoals()
  }, [userId])

  const loadGoals = async () => {
    try {
      console.log('💰 Cargando metas de ahorro para usuario:', userId)

      const { data, error } = await supabase
        .from('saving_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error al cargar metas:', error)
        throw error
      }

      console.log('✅ Metas cargadas:', data)
      setGoals(data || [])
    } catch (error) {
      console.error('Error completo al cargar metas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoalCreated = () => {
    loadGoals()
  }

  const handleTransactionAdded = () => {
    loadGoals()
  }

  const handleAddTransaction = (goal: SavingGoal) => {
    setSelectedGoal(goal)
    setShowTransactionDialog(true)
  }

  const handleShowHistory = (goal: SavingGoal) => {
    setSelectedGoal(goal)
    setShowHistoryDialog(true)
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getMethodLabel = (method: string) => {
    const labels = {
      libre: 'Libre',
      semanal: 'Semanal',
      mensual: 'Mensual',
      anual: 'Anual',
    }
    return labels[method as keyof typeof labels] || method
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0)
  const activeGoals = goals.filter((g) => g.status === 'activa').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Wallet className="h-12 w-12 animate-pulse text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando cartera...</p>
        </div>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="max-w-md space-y-6">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
              <Target className="h-12 w-12 text-purple-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Tu Cartera de Ahorros
              </h2>
              <p className="text-lg text-gray-600">
                Comienza definiendo tu primera meta de ahorro
              </p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Meta
            </Button>
          </div>
        </div>

        <CreateGoalDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onGoalCreated={handleGoalCreated}
          userId={userId}
        />
      </>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Resumen General */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mi Cartera</h2>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Meta
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-purple-600" />
              <p className="text-sm font-medium text-purple-900">Total Ahorrado</p>
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {formatCurrency(totalSaved)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Metas Activas</p>
            </div>
            <p className="text-2xl font-bold text-blue-700">{activeGoals}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">Total de Metas</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{goals.length}</p>
          </div>
        </div>
      </div>

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current_amount, goal.target_amount)

          return (
            <div
              key={goal.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
            >
              {/* Header con gradiente */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-4 text-white">
                <h3 className="text-xl font-bold truncate">{goal.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {getMethodLabel(goal.method)}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      goal.status === 'activa'
                        ? 'bg-green-500/80'
                        : goal.status === 'completada'
                        ? 'bg-blue-500/80'
                        : 'bg-yellow-500/80'
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-4">
                {/* Imagen del Artículo */}
                {goal.image_url && (
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={goal.image_url}
                      alt={goal.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Progreso */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-semibold text-purple-600">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Montos */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Actual:</span>
                    <span className="font-bold text-purple-600">
                      {formatCurrency(goal.current_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Meta:</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(goal.target_amount)}
                    </span>
                  </div>
                  {goal.fixed_amount && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monto {getMethodLabel(goal.method)}:</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(goal.fixed_amount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Fecha Límite */}
                {goal.deadline && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(goal.deadline)}</span>
                  </div>
                )}

                {/* Botones de Acción */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    onClick={() => handleAddTransaction(goal)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Ahorro
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                    onClick={() => handleShowHistory(goal)}
                  >
                    <History className="mr-2 h-4 w-4" />
                    Historial de Transacciones
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <CreateGoalDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onGoalCreated={handleGoalCreated}
        userId={userId}
      />

      {selectedGoal && (
        <>
          <AddTransactionDialog
            open={showTransactionDialog}
            onOpenChange={setShowTransactionDialog}
            onTransactionAdded={handleTransactionAdded}
            goalId={selectedGoal.id}
            userId={userId}
            goalTitle={selectedGoal.title}
            currentAmount={selectedGoal.current_amount}
            targetAmount={selectedGoal.target_amount}
          />

          <TransactionHistoryDialog
            open={showHistoryDialog}
            onOpenChange={setShowHistoryDialog}
            goalId={selectedGoal.id}
            goalTitle={selectedGoal.title}
          />
        </>
      )}
    </div>
  )
}
