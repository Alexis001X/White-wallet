import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Logs de diagnóstico para Vercel
console.log('🚀 White.Wallet iniciando...')
console.log('📍 Modo:', import.meta.env.MODE)
console.log('🔧 Supabase URL configurada:', !!import.meta.env.VITE_SUPABASE_URL)
console.log('🔑 Supabase Key configurada:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ ERROR: Faltan variables de entorno de Supabase')
  console.error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Vercel')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log('✅ App montada correctamente')
