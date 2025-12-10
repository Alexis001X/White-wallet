import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Loader2, Wallet } from 'lucide-react'

interface UserCardProps {
  userId: string
  onClick: () => void
}

interface UserData {
  full_name: string | null
  avatar_url: string | null
  description: string | null
}

export default function UserCard({ userId, onClick }: UserCardProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, description')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUserData(data)
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = () => {
    if (!userData?.full_name) return 'U'
    return userData.full_name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 hover:border-purple-200 group"
      >
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={userData?.avatar_url || ''} alt={userData?.full_name || 'Usuario'} />
              <AvatarFallback className="text-2xl bg-white text-purple-600">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {userData?.full_name || 'Sin nombre'}
              </h2>
              {userData?.description && (
                <p className="text-purple-100 text-sm line-clamp-2">
                  {userData.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">
                Ahorro Total Activo
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-4">
            <p className="text-sm text-gray-600 mb-1">Saldo Total</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              $0.00
            </p>
            <p className="text-xs text-gray-500 mt-1">
              0 metas de ahorro activas
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-800">
              🔒 Haz click en esta tarjeta para acceder a tu dashboard de ahorro
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Se te pedirá tu PIN de seguridad
            </p>
          </div>
        </div>

        {/* Footer con efecto hover */}
        <div className="border-t bg-gray-50 px-6 py-3 text-center group-hover:bg-purple-50 transition-colors">
          <p className="text-sm text-gray-600 group-hover:text-purple-700 font-medium">
            Click para continuar →
          </p>
        </div>
      </div>
    </div>
  )
}
