import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Sign out from Supabase (clears cookies)
  await supabase.auth.signOut()

  // Redirect to login page
  return NextResponse.redirect(new URL('/auth/login', request.url), {
    status: 302,
  })
}
