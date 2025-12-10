import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface HeaderProps {
  hasUser: boolean
  onAvatarClick?: () => void
  userId?: string | null
}

export default function Header({ hasUser, onAvatarClick, userId }: HeaderProps) {
  const [userName, setUserName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (userId) {
      loadUserProfile()
    }
  }, [userId])

  const loadUserProfile = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (data) {
        setUserName(data.full_name || '')
        setAvatarUrl(data.avatar_url || '')
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error)
    }
  }

  const getInitials = () => {
    if (!userName) return 'U'
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              White.Wallet
            </h1>
          </div>
        </div>

        {hasUser && (
          <div className="flex items-center gap-3">
            {userName && (
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {userName}
              </span>
            )}
            <Avatar
              className="cursor-pointer hover:opacity-80 transition-opacity hover:ring-2 hover:ring-purple-500"
              onClick={onAvatarClick}
            >
              <AvatarImage src={avatarUrl} alt={userName || 'Usuario'} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  )
}
