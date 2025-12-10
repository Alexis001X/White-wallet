import { Plus } from 'lucide-react'
import { Button } from './ui/button'

interface FloatingAddButtonProps {
  onClick: () => void
}

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 z-50"
    >
      <Plus className="h-8 w-8 text-white" />
    </Button>
  )
}
