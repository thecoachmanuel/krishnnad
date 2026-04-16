"use server"

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim()
  const password = formData.get("password") as string
  
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  
  const isAdminCredentials = email === adminEmail && password === adminPassword
  
  console.log('Login attempt for:', email, 'IsAdminCredentials:', isAdminCredentials)
  
  if (isAdminCredentials) {
    if (!adminEmail || !adminPassword) {
      console.error('Admin env variables are missing!')
      return { error: "Admin setup incomplete. Please check environment variables." }
    }

    try {
      const adminClient = createAdminClient()
      
      console.log('Admin sync: checking for existing account...')
      const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers()
      
      if (listError) {
        console.error('Admin sync: failed to list users:', listError)
        return { error: `Admin login failed: sync initialization error. (${listError.message})` }
      }
      
      const adminUser = usersData.users.find(u => u.email === adminEmail)
      
      if (!adminUser) {
        console.log('Admin sync: user not found, creating new admin...')
        const { data: created, error: createError } = await adminClient.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: { role: 'admin' }
        })
        
        if (createError) {
          console.error('Admin sync: creation failed:', createError)
          return { error: `Admin login failed: could not create admin record. (${createError.message})` }
        }
        
        // Insert profile
        if (created.user) {
          const { error: pError } = await adminClient.from('profiles').upsert({
            id: created.user.id,
            role: 'admin',
            email: adminEmail,
            full_name: 'Administrator'
          })
          if (pError) console.warn('Admin sync: profile creation warning:', pError)
        }
      } else {
        console.log('Admin sync: user found, updating credentials and profile...')
        // Force update password to match .env.local
        const { error: updateError } = await adminClient.auth.admin.updateUserById(adminUser.id, {
          password: adminPassword,
          user_metadata: { role: 'admin' }
        })
        
        if (updateError) {
          console.error('Admin sync: password update failed:', updateError)
          return { error: `Admin login failed: could not sync admin password. (${updateError.message})` }
        }

        const { error: pError } = await adminClient.from('profiles').upsert({
          id: adminUser.id,
          role: 'admin',
          email: adminEmail
        })
        if (pError) console.warn('Admin sync: profile update warning:', pError)
      }
    } catch (e) {
      console.error('Admin sync: unexpected error:', e)
      return { error: "An unexpected error occurred during admin authentication." }
    }
  }
  
  // 2. Standard sign in (works for both normal users and the now-synced admin)
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) return { error: error.message }
  
  // 3. Get profile for role-based routing
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()
    
  return { 
    success: true, 
    user: data.user,
    role: isAdminCredentials ? 'admin' : (profile?.role || 'user')
  }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
