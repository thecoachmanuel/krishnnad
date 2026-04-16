"use client"

import * as React from "react"
import { Shield, Key, Mail, User, Save } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/Toast"

export default function AccountSettingsPage() {
  const [loading, setLoading] = React.useState(false)
  const [passwords, setPasswords] = React.useState({
    newPassword: "",
    confirmPassword: ""
  })
  const supabase = createClient()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" })
      return
    }

    if (passwords.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      })

      if (error) throw error

      toast({ title: "Success", description: "Password updated successfully." })
      setPasswords({ newPassword: "", confirmPassword: "" })
    } catch (err: any) {
      console.error("Password change error:", err)
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">Account Settings</h1>
        <p className="text-[var(--muted)] mt-1">Manage your security and profile preferences.</p>
      </div>

      {/* Security Section */}
      <Card className="bg-[var(--surface-2)]">
         <CardHeader>
           <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--accent)]" />
              <CardTitle>Security</CardTitle>
           </div>
           <CardDescription>Update your login credentials.</CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                    <Input 
                      type="password" 
                      className="pl-9" 
                      placeholder="••••••••" 
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                    <Input 
                      type="password" 
                      className="pl-9" 
                      placeholder="••••••••" 
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    />
                  </div>
               </div>
               <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "Updating..." : <><Save className="h-4 w-4" /> Change Password</>}
               </Button>
            </form>
         </CardContent>
      </Card>

      {/* Account Info (Static for now as email is in Auth) */}
      <Card className="opacity-70">
         <CardHeader>
           <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[var(--muted)]" />
              <CardTitle>Profile Information</CardTitle>
           </div>
         </CardHeader>
         <CardContent className="space-y-4">
            <p className="text-sm text-[var(--muted)] italic">
               Note: To change your primary email or delete your account, please contact support at hello@krishnnad.com
            </p>
         </CardContent>
      </Card>
    </div>
  )
}
