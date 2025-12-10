import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Loader2, Wallet, Lock } from 'lucide-react'

interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  description: string | null
  total_saved?: number
}

interface UserCardListProps {
  onUserSelect: (userId: string) => void
}

export default function UserCardList({ onUserSelect }: UserCardListProps) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllUsers()
  }, [])

  const loadAllUsers = async () => {
    try {
      console.log('🔍 Intentando cargar usuarios desde Supabase...')

      // Cargar usuarios
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, description')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('❌ Error al cargar usuarios:', error)
        throw error
      }

      console.log('✅ Usuarios cargados:', profiles)

      // Cargar el total ahorrado de cada usuario
      const usersWithSavings = await Promise.all(
        (profiles || []).map(async (profile) => {
          try {
            const { data: goals, error: goalsError } = await supabase
              .from('saving_goals')
              .select('current_amount')
              .eq('user_id', profile.id)

            if (goalsError) {
              console.error(`❌ Error al cargar metas del usuario ${profile.id}:`, goalsError)
              return { ...profile, total_saved: 0 }
            }

            const totalSaved = goals?.reduce((sum, goal) => sum + (goal.current_amount || 0), 0) || 0
            console.log(`💰 Total ahorrado de ${profile.full_name}: $${totalSaved}`)

            return { ...profile, total_saved: totalSaved }
          } catch (err) {
            console.error('Error al calcular ahorro:', err)
            return { ...profile, total_saved: 0 }
          }
        })
      )

      setUsers(usersWithSavings)
    } catch (error) {
      console.error('❌ Error completo al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="max-w-md space-y-6">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <Wallet className="h-12 w-12 text-purple-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Bienvenido a White.Wallet
            </h2>
            <p className="text-lg text-gray-600">
              Crea tu primer usuario para comenzar a gestionar tus ahorros
            </p>
          </div>
          <div className="pt-4">
            <p className="text-sm text-gray-500">
              Usa el botón <span className="text-purple-600 font-semibold">+</span> para crear un nuevo usuario
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selecciona tu Perfil
        </h1>
        <p className="text-gray-600">
          Elige un usuario para acceder a tu cartera de ahorros
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-gray-100 hover:border-purple-300 group hover:scale-105 duration-300"
          >
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex flex-col items-center gap-3 relative z-10">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'Usuario'} />
                  <AvatarFallback className="text-2xl bg-white text-purple-600">
                    {getInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-center">
                  {user.full_name || 'Sin nombre'}
                </h3>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {user.description && (
                <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                  {user.description}
                </p>
              )}

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Wallet className="h-4 w-4 text-purple-600" />
                  <p className="text-xs text-gray-600 font-medium">Ahorro Total</p>
                </div>
                <p className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(user.total_saved || 0)}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-purple-600 group-hover:text-purple-700">
                <Lock className="h-4 w-4" />
                <p className="text-sm font-medium">Click para ingresar PIN</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-6 py-3 text-center group-hover:bg-purple-50 transition-colors">
              <p className="text-xs text-gray-500 group-hover:text-purple-700 font-medium">
                Acceder a cartera →
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          {users.length} {users.length === 1 ? 'usuario registrado' : 'usuarios registrados'}
        </p>
      </div>
    </div>
  )
}
