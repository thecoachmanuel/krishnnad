"use client"

import * as React from "react"
import { 
  Save, Globe, Phone, Mail, Truck, Info, 
  Layout, MessageSquare, FileText, Share2, 
  Plus, Trash2, Image as ImageIcon 
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { MediaSelectorModal } from "@/components/admin/MediaSelectorModal"

type CMSSection = 'branding' | 'homepage' | 'testimonials' | 'pages' | 'contact'

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = React.useState<CMSSection>('branding')
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false)
  const [mediaTarget, setMediaTarget] = React.useState<string | null>(null)

  // Robust CMS State
  const [sections, setSections] = React.useState<any>({
    branding: { siteName: "", tagline: "", announcement: "", logoUrl: "" },
    homepage: { heroTitle: "", heroSubtitle: "", heroCtaMain: "", heroCtaSecondary: "", featuresTitle: "", features: [], ctaTitle: "", ctaSubtitle: "" },
    testimonials: [],
    page_about: { title: "", subtitle: "", storyTitle: "", storyText: "", missionItems: [], imageUrl: "", quote: "" },
    page_contact: { title: "", subtitle: "", address: "", whatsapp: "", email: "", instagram: "", supportText: "" }
  })

  const supabase = createClient()

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("site_settings").select("*")
      if (error) throw error
      
      const newSections = { ...sections }
      data.forEach(s => {
        if (newSections[s.key] !== undefined || s.key === 'page_about' || s.key === 'page_contact') {
          newSections[s.key] = s.value
        }
      })
      setSections(newSections)
    } catch (err) {
      console.error("Error fetching settings:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSettings()
  }, [])

  const handleUpdate = (section: string, field: string, value: any) => {
    setSections((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = Object.entries(sections).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from("site_settings")
        .upsert(updates, { onConflict: "key" })

      if (error) throw error
      toast({ title: "Success", description: "Syndicate CMS updated." })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const openMediaModal = (target: string) => {
    setMediaTarget(target)
    setIsMediaModalOpen(true)
  }

  const handleMediaSelect = (url: string) => {
    if (!mediaTarget) return
    const [section, field] = mediaTarget.split('.')
    handleUpdate(section, field, url)
    setIsMediaModalOpen(false)
  }

  if (loading) return <div className="p-12 animate-pulse font-black text-[var(--accent)] uppercase tracking-tighter">Initializing Syndicate CMS...</div>

  return (
    <div className="max-w-6xl space-y-8 pb-40">
      
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-[var(--foreground)] tracking-tight">Syndicate CMS</h1>
          <p className="text-[var(--muted)] font-medium">Coordinate the entire frontend narrative from a single workspace.</p>
        </div>
        <div className="flex items-center gap-3 bg-[var(--surface)] p-2 rounded-full border border-[var(--border)] shadow-xl">
           <Button 
            onClick={handleSave} 
            disabled={saving}
            className="rounded-full px-10 h-12 font-black shadow-lg shadow-[var(--accent)]/20"
           >
              {saving ? "Syncing..." : <><Save className="h-4 w-4 mr-2" /> Publish Changes</>}
           </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
         {[
           { id: 'branding', icon: Layout, label: 'Branding' },
           { id: 'homepage', icon: Globe, label: 'Homepage' },
           { id: 'testimonials', icon: MessageSquare, label: 'Reviews' },
           { id: 'pages', icon: FileText, label: 'About Page' },
           { id: 'contact', icon: Share2, label: 'Contact & Social' }
         ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as CMSSection)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                activeSection === tab.id 
                ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' 
                : 'bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[var(--surface)]'
              }`}
            >
               <tab.icon className="h-4 w-4" />
               {tab.label}
            </button>
         ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         
         {/* Branding Section */}
         {activeSection === 'branding' && (
            <div className="space-y-6">
               <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)] shadow-inner">
                  <CardHeader>
                     <CardTitle>Core Identity</CardTitle>
                     <CardDescription>Managed site-wide headers and branding.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-8 sm:grid-cols-2">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Site Name</label>
                        <Input 
                          value={sections.branding.siteName} 
                          onChange={(e) => handleUpdate('branding', 'siteName', e.target.value)}
                          className="rounded-2xl h-12"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Primary Tagline</label>
                        <Input 
                          value={sections.branding.tagline} 
                          onChange={(e) => handleUpdate('branding', 'tagline', e.target.value)}
                          className="rounded-2xl h-12"
                        />
                     </div>
                     <div className="sm:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Announcement Bar Notice</label>
                        <Input 
                          placeholder="Ex: New Doberman litter coming soon!"
                          value={sections.branding.announcement} 
                          onChange={(e) => handleUpdate('branding', 'announcement', e.target.value)}
                          className="rounded-2xl h-12 bg-[var(--accent)]/5 border-[var(--accent)]/20 text-[var(--accent)] font-bold"
                        />
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {/* Homepage Section */}
         {activeSection === 'homepage' && (
            <div className="space-y-8">
               <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader>
                     <CardTitle>Main Stage (Hero)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Hero Headline</label>
                        <Input 
                          value={sections.homepage.heroTitle} 
                          onChange={(e) => handleUpdate('homepage', 'heroTitle', e.target.value)}
                          className="rounded-2xl h-14 text-xl font-black"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Sub-Headline Text</label>
                        <textarea 
                          rows={4}
                          className="flex w-full rounded-3xl border border-[var(--border)] bg-[var(--background)] px-6 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] resize-none"
                          value={sections.homepage.heroSubtitle} 
                          onChange={(e) => handleUpdate('homepage', 'heroSubtitle', e.target.value)}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Main CTA Button</label>
                           <Input value={sections.homepage.heroCtaMain} onChange={(e) => handleUpdate('homepage', 'heroCtaMain', e.target.value)} className="rounded-2xl h-12" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Secondary Button</label>
                           <Input value={sections.homepage.heroCtaSecondary} onChange={(e) => handleUpdate('homepage', 'heroCtaSecondary', e.target.value)} className="rounded-2xl h-12" />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {/* Testimonials Section */}
         {activeSection === 'testimonials' && (
            <div className="space-y-6">
               <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader className="flex flex-row items-center justify-between">
                     <div>
                        <CardTitle>Owner Testimonials</CardTitle>
                        <CardDescription>Verified client feedback shown on homepage.</CardDescription>
                     </div>
                     <Button 
                      variant="outline" 
                      className="rounded-full gap-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black font-black uppercase text-[10px]"
                      onClick={() => {
                        const newReview = { author: "New Owner", role: "Location", quote: "Excellence in every puppy.", rating: 5 }
                        setSections((prevValue: any) => ({ ...prevValue, testimonials: [...prevValue.testimonials, newReview] }))
                      }}
                     >
                        <Plus className="h-4 w-4" /> Add Review
                     </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {sections.testimonials.map((t: any, i: number) => (
                        <div key={i} className="p-6 rounded-[2rem] border border-[var(--border)] bg-[var(--background)] space-y-4 group">
                           <div className="flex justify-between">
                              <div className="grid grid-cols-2 gap-4 flex-1">
                                 <Input 
                                  value={t.author} 
                                  onChange={(e) => {
                                    const updated = [...sections.testimonials]; updated[i].author = e.target.value;
                                    setSections((prev: any) => ({ ...prev, testimonials: updated }))
                                  }}
                                  className="rounded-xl h-10 font-bold"
                                  placeholder="Author Name"
                                 />
                                 <Input 
                                  value={t.role} 
                                  onChange={(e) => {
                                    const updated = [...sections.testimonials]; updated[i].role = e.target.value;
                                    setSections((prev: any) => ({ ...prev, testimonials: updated }))
                                  }}
                                  className="rounded-xl h-10"
                                  placeholder="City / Role"
                                 />
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-[var(--danger)]/50 hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
                                onClick={() => {
                                  const updated = sections.testimonials.filter((_: any, idx: number) => idx !== i)
                                  setSections((prev: any) => ({ ...prev, testimonials: updated }))
                                }}
                              >
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                           <textarea 
                             className="w-full bg-transparent border-none focus:ring-0 text-sm italic text-[var(--muted)] leading-relaxed resize-none"
                             value={t.quote}
                             onChange={(e) => {
                                const updated = [...sections.testimonials]; updated[i].quote = e.target.value;
                                setSections((prev: any) => ({ ...prev, testimonials: updated }))
                             }}
                             rows={2}
                           />
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </div>
         )}

         {/* Pages Section */}
         {activeSection === 'pages' && (
            <div className="space-y-6">
               <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader>
                     <CardTitle>About Our Story</CardTitle>
                     <CardDescription>Manage your mission statement and brand narrative.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Page Title</label>
                        <Input value={sections.page_about.title} onChange={(e) => handleUpdate('page_about', 'title', e.target.value)} className="rounded-2xl h-12" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Story Narration</label>
                        <textarea 
                          rows={6}
                          className="flex w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-6 py-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] resize-none"
                          value={sections.page_about.storyText} 
                          onChange={(e) => handleUpdate('page_about', 'storyText', e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Story Cover Image</label>
                        <div className="flex items-center gap-4">
                           <div className="h-20 w-32 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
                              {sections.page_about.imageUrl && <img src={sections.page_about.imageUrl} className="w-full h-full object-cover" />}
                           </div>
                           <Button onClick={() => openMediaModal('page_about.imageUrl')} variant="outline" className="rounded-full">Select Image</Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {/* Contact Section */}
         {activeSection === 'contact' && (
            <div className="space-y-6">
               <Card className="rounded-[2.5rem] border-[var(--border)] bg-[var(--surface)]">
                  <CardHeader>
                     <CardTitle>Reach Out & Social</CardTitle>
                     <CardDescription>Global support channels and handles.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 sm:grid-cols-2">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">WhatsApp Number</label>
                        <Input value={sections.page_contact.whatsapp} onChange={(e) => handleUpdate('page_contact', 'whatsapp', e.target.value)} className="rounded-2xl h-12" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Official Email</label>
                        <Input value={sections.page_contact.email} onChange={(e) => handleUpdate('page_contact', 'email', e.target.value)} className="rounded-2xl h-12" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Physical Studio Address</label>
                        <Input value={sections.page_contact.address} onChange={(e) => handleUpdate('page_contact', 'address', e.target.value)} className="rounded-2xl h-12" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Instagram Handle</label>
                        <Input value={sections.page_contact.instagram} onChange={(e) => handleUpdate('page_contact', 'instagram', e.target.value)} className="rounded-2xl h-12" />
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

      </div>

      <MediaSelectorModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  )
}
