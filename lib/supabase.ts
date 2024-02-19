import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://mckrtibqncfcwqxcwilt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ja3J0aWJxbmNmY3dxeGN3aWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgxNTY2MjcsImV4cCI6MjAyMzczMjYyN30.-TdDYPg_4JA2tAng1DGGLxlNecZ3tKNnxn6XJ_R2-v8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})