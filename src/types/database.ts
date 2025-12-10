export interface Profile {
  id: string
  full_name: string | null
  age: number | null
  avatar_url: string | null
  description: string | null
  transaction_pin: string | null
  updated_at: string
}

export interface CreateProfileData {
  full_name: string
  age: number
  avatar_url?: string
  description?: string
  transaction_pin: string
}

export interface UpdateProfileData {
  full_name?: string
  age?: number
  avatar_url?: string
  description?: string
}

// Tipos para Metas de Ahorro
export type SavingMethod = 'libre' | 'semanal' | 'mensual' | 'anual'
export type GoalStatus = 'activa' | 'completada' | 'pausada'
export type TransactionType = 'ingreso' | 'retiro' | 'gasto_externo'

export interface SavingGoal {
  id: string
  user_id: string
  title: string
  image_url: string | null
  target_amount: number
  current_amount: number
  deadline: string | null
  method: SavingMethod
  fixed_amount: number | null
  status: GoalStatus
  created_at: string
}

export interface CreateSavingGoalData {
  title: string
  target_amount: number
  deadline?: string
  method?: SavingMethod
  fixed_amount?: number
  image_url?: string
}

export interface Transaction {
  id: string
  goal_id: string
  user_id: string
  amount: number
  type: TransactionType
  note: string | null
  created_at: string
}
