import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ [Supabase] Variables de entorno no configuradas')
  console.warn('  NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'configurada ✅' : 'faltante ❌')
  console.warn('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'configurada ✅' : 'faltante ❌')
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo: typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Log de inicialización
if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
  console.log('✅ [Supabase] Cliente inicializado correctamente')
  console.log('   URL:', supabaseUrl)
}

export default supabase
