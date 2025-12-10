import { useState } from 'react'
import Header from './components/Header'
import ProfileSection from './components/ProfileSection'
import CreateUserDialog from './components/CreateUserDialog'
import UserCardList from './components/UserCardList'
import PinVerificationDialog from './components/PinVerificationDialog'
import FloatingAddButton from './components/FloatingAddButton'
import WalletDashboard from './components/WalletDashboard'

function App() {
  const [activeUserId, setActiveUserId] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(false)
  const [refreshList, setRefreshList] = useState(0)

  const handleUserCreated = () => {
    // Refrescar la lista de usuarios
    setRefreshList(prev => prev + 1)
    setShowCreateDialog(false)
  }

  const handleCreateUserClick = () => {
    setShowCreateDialog(true)
  }

  const handleAvatarClick = () => {
    setShowProfile(true)
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
    setShowPinDialog(true)
  }

  const handlePinSuccess = (userId: string) => {
    setActiveUserId(userId)
    setIsDashboardUnlocked(true)
  }

  const handleLogout = () => {
    setActiveUserId(null)
    setShowProfile(false)
    setIsDashboardUnlocked(false)
    setSelectedUserId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        hasUser={!!activeUserId}
        onAvatarClick={handleAvatarClick}
        userId={activeUserId}
      />
      <main className="container mx-auto px-4 py-8">
        {showProfile && activeUserId ? (
          <ProfileSection
            userId={activeUserId}
            onClose={() => setShowProfile(false)}
            onLogout={handleLogout}
          />
        ) : isDashboardUnlocked && activeUserId ? (
          <WalletDashboard userId={activeUserId} />
        ) : (
          <UserCardList key={refreshList} onUserSelect={handleUserSelect} />
        )}
      </main>

      {/* Botón flotante para agregar usuario */}
      {!showProfile && !isDashboardUnlocked && (
        <FloatingAddButton onClick={handleCreateUserClick} />
      )}

      <CreateUserDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onUserCreated={handleUserCreated}
      />

      <PinVerificationDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        onSuccess={handlePinSuccess}
        selectedUserId={selectedUserId}
      />
    </div>
  )
}

export default App
