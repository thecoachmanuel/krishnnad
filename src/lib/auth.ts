import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Fetches the current user's role from the database.
 * Returns null if not logged in or profile doesn't exist.
 */
export async function getUserRole(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role || null
}

/**
 * Checks if the current user has the 'admin' role.
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'admin'
}

/**
 * Ensures the current user is an admin.
 * If not, redirects to the specified path or throws an error.
 * Use this in Server Components and Server Actions.
 */
export async function requireAdmin(redirectTo: string = '/auth/login') {
  const role = await getUserRole()
  
  if (role !== 'admin') {
    if (redirectTo) {
      redirect(redirectTo)
    }
    throw new Error('Unauthorized: Admin access required')
  }
}
