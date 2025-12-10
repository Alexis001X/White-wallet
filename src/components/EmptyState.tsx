import { Button } from './ui/button'
import { Plus } from 'lucide-react'

interface EmptyStateProps {
  onCreateUser: () => void
}

export default function EmptyState({ onCreateUser }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">
            Bienvenido a White.Wallet
          </h2>
          <p className="text-lg text-gray-600">
            Comienza a gestionar tus metas de ahorro de manera inteligente
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onCreateUser}
            size="lg"
            className="gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Crear Usuario
          </Button>
        </div>

        <div className="pt-8 space-y-4">
          <div className="grid gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Crea tu perfil</h3>
                <p className="text-sm text-gray-600">
                  Configura tu información personal para comenzar
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Define tus metas</h3>
                <p className="text-sm text-gray-600">
                  Establece objetivos de ahorro claros y alcanzables
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Alcanza tus sueños</h3>
                <p className="text-sm text-gray-600">
                  Sigue tu progreso y alcanza tus objetivos financieros
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
