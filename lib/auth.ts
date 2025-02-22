import { createClient } from '@/app/utils/supabase/server'

export async function getAuthSession() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    return null
  }
  return user
}
