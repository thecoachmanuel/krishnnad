"use client"

import * as React from "react"
import { Save, Globe, Phone, Mail, Truck, Info } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [settings, setSettings] = React.useState({
    heroHeadline: "Experience the Pinnacle of Dog Pedigree",
    heroSubheadline: "At Krishnnad Syndicate, we don't just breed dogs; we curate legacies.",
    contactWhatsApp: "+234 800 000 0000",
    contactEmail: "hello@krishnnad.com",
    baseDeliveryFee: "50000",
    siteNotice: "New litter of German Shepherds coming soon!"
  })

  const supabase = createClient()

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("site_settings").select("*")
      if (error) throw error
      
      const mapped = { ...settings }
      data.forEach(s => {
        if ((mapped as any)[s.key] !== undefined) {
          (mapped as any)[s.key] = s.value
        }
      })
      setSettings(mapped)
    } catch (err) {
      console.error("Error fetching settings:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from("site_settings")
        .upsert(updates, { onConflict: "key" })

      if (error) throw error
      
      toast({ title: "Success", description: "Site settings updated globally." })
    } catch (err: any) {
      console.error("Save error:", err)
      toast({ title: "Error", description: err.message || "Failed to save settings.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 animate-pulse text-[var(--muted)]">Loading configuration...</div>

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">Site Settings</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Configure global site content and business variables.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Homepage Hero */}
        <Card className="bg-[var(--surface-2)]">
           <CardHeader>
             <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--accent)]" />
                <CardTitle>Homepage Hero</CardTitle>
             </div>
             <CardDescription>Main headline and subtext shown on the home page.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Hero Headline</label>
                 <Input 
                   value={settings.heroHeadline}
                   onChange={(e) => setSettings({...settings, heroHeadline: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Hero Subheadline</label>
                 <textarea 
                   rows={3}
                   className="flex w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] resize-none"
                   value={settings.heroSubheadline}
                   onChange={(e) => setSettings({...settings, heroSubheadline: e.target.value})}
                 />
              </div>
           </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-[var(--surface-2)]">
           <CardHeader>
             <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[var(--accent)]" />
                <CardTitle>Contact Channels</CardTitle>
             </div>
             <CardDescription>Linked phone numbers and support emails.</CardDescription>
           </CardHeader>
           <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                 <label className="text-sm font-medium">WhatsApp Phone</label>
                 <Input 
                   value={settings.contactWhatsApp}
                   onChange={(e) => setSettings({...settings, contactWhatsApp: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Support Email</label>
                 <Input 
                   value={settings.contactEmail}
                   onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                 />
              </div>
           </CardContent>
        </Card>

        {/* Logistics & Business */}
        <Card className="bg-[var(--surface-2)]">
           <CardHeader>
             <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--accent)]" />
                <CardTitle>Logistics & Delivery</CardTitle>
             </div>
           </CardHeader>
           <CardContent className="space-y-6">
              <div className="space-y-2 max-w-sm">
                 <label className="text-sm font-medium">Base Delivery Fee (₦)</label>
                 <Input 
                   type="number"
                   value={settings.baseDeliveryFee}
                   onChange={(e) => setSettings({...settings, baseDeliveryFee: e.target.value})}
                 />
                 <p className="text-[10px] text-[var(--muted)] flex items-center gap-1">
                    <Info className="h-3 w-3" /> Standard fee applied to new orders.
                 </p>
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-medium">Site-wide Announcement Notice</label>
                 <Input 
                   placeholder="Optional notice bar content..."
                   value={settings.siteNotice}
                   onChange={(e) => setSettings({...settings, siteNotice: e.target.value})}
                 />
              </div>
           </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
           <Button type="button" variant="ghost" onClick={fetchSettings}>Reset Changes</Button>
           <Button type="submit" size="lg" className="w-48 gap-2 shadow-xl shadow-[var(--accent)]/20" disabled={saving}>
              {saving ? "Saving..." : <><Save className="h-4 w-4" /> Save Settings</>}
           </Button>
        </div>
      </form>
    </div>
  )
}
