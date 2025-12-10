import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Profile, UpdateProfileData } from '@/types/database'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Loader2, Save, X, Camera, LogOut } from 'lucide-react'

interface ProfileSectionProps {
  userId: string
  onClose?: () => void
  onLogout?: () => void
}

export default function ProfileSection({ userId, onClose, onLogout }: ProfileSectionProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    description: '',
    avatar_url: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      setProfile(data)
      setFormData({
        full_name: data.full_name || '',
        age: data.age?.toString() || '',
        description: data.description || '',
        avatar_url: data.avatar_url || '',
      })
    } catch (error) {
      console.error('Error al cargar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name) newErrors.full_name = 'El nombre es requerido'
    if (!formData.age) newErrors.age = 'La edad es requerida'
    if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120)
      newErrors.age = 'La edad debe estar entre 1 y 120'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)

    try {
      const updateData: UpdateProfileData = {
        full_name: formData.full_name,
        age: parseInt(formData.age),
        description: formData.description || undefined,
        avatar_url: formData.avatar_url || undefined,
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)

      if (error) throw error

      await loadProfile()
      setEditing(false)
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      setErrors({ submit: 'Error al actualizar el perfil. Intenta de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        description: profile.description || '',
        avatar_url: profile.avatar_url || '',
      })
    }
    setEditing(false)
    setErrors({})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
                  <AvatarFallback className="text-2xl bg-white text-purple-600">
                    {formData.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 text-purple-600 hover:bg-gray-100 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile?.full_name || 'Sin nombre'}</h2>
                <p className="text-purple-100">
                  {profile?.age ? `${profile.age} años` : 'Sin edad'}
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {editing ? (
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_full_name">Nombre Completo *</Label>
                  <Input
                    id="edit_full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    disabled={saving}
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-500">{errors.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_age">Edad *</Label>
                  <Input
                    id="edit_age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    disabled={saving}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_avatar_url">URL del Avatar (opcional)</Label>
                <Input
                  id="edit_avatar_url"
                  type="url"
                  placeholder="https://ejemplo.com/avatar.jpg"
                  value={formData.avatar_url}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar_url: e.target.value })
                  }
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_description">Descripción</Label>
                <Textarea
                  id="edit_description"
                  placeholder="Cuéntanos sobre ti..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={saving}
                  rows={4}
                />
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errors.submit}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Información Personal
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nombre Completo</p>
                    <p className="font-medium">{profile?.full_name || 'Sin nombre'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Edad</p>
                    <p className="font-medium">
                      {profile?.age ? `${profile.age} años` : 'Sin edad'}
                    </p>
                  </div>
                </div>
              </div>

              {profile?.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Descripción
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{profile.description}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <Button
                  onClick={() => setEditing(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  Editar Perfil
                </Button>
                {onLogout && (
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-gray-500 text-center">
              Última actualización:{' '}
              {profile?.updated_at
                ? new Date(profile.updated_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Desconocida'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
