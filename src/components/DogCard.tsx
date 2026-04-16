"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, Heart, ShieldCheck, Award } from "lucide-react"

import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export interface DogListingProps {
  id: string
  name: string
  breed: string
  price: number
  age: string
  gender: "Male" | "Female"
  status: "Available" | "Reserved" | "Sold"
  imageUrl: string
}

export function DogCard({
  id,
  name,
  breed,
  price,
  age,
  gender,
  status,
  imageUrl,
}: DogListingProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const supabase = createClient()
  const router = useRouter()

  const fetchWishlistStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const { data } = await supabase
      .from("wishlists")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("dog_id", id)
      .maybeSingle()
    
    setIsWishlisted(!!data)
  }

  React.useEffect(() => {
    fetchWishlistStatus()
  }, [id])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please log in to save items to your wishlist.",
      })
      router.push("/auth/login")
      return
    }

    setLoading(true)
    try {
      if (isWishlisted) {
        await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", session.user.id)
          .eq("dog_id", id)
        setIsWishlisted(false)
        toast({ description: "Removed from wishlist." })
      } else {
        await supabase
          .from("wishlists")
          .insert([{ user_id: session.user.id, dog_id: id }])
        setIsWishlisted(true)
        toast({ description: "Added to wishlist!" })
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Format price as NGN
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price)

  const isSold = status === "Sold"

  return (
    <Card className="group relative overflow-hidden transition-all hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/10">
      
      {/* Image Container with hover zoom */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-2)]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* Wishlist Toggle */}
        <button 
          onClick={toggleWishlist}
          disabled={loading}
          className={`absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${
            isWishlisted 
              ? "bg-[var(--accent)] text-white" 
              : "bg-black/20 text-white hover:bg-black/40"
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 flex flex-col gap-2 z-10">
          <Badge className="bg-black/50 text-[var(--foreground)] backdrop-blur-md border border-white/10 hover:bg-black/70 font-medium">
            {breed}
          </Badge>
          {!isSold && status === "Reserved" && (
            <Badge variant="warning" className="w-fit shadow-md">Reserved</Badge>
          )}
          {isSold && (
            <Badge variant="destructive" className="w-fit shadow-md">Sold Out</Badge>
          )}
        </div>

        {/* Quick View Button (appears on hover) */}
        {!isSold && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Link href={`/dogs/${id}`}>
              <Button variant="default" className="gap-2 shadow-xl shadow-[var(--accent)]/20">
                <Eye className="h-4 w-4" /> View Details
              </Button>
            </Link>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[var(--foreground)]">{name}</h3>
          <span className="font-mono text-lg font-bold text-[var(--accent)]">{formattedPrice}</span>
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm text-[var(--muted)]">
          <div className="flex items-center gap-1.5">
             <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" />
             {age}
          </div>
          <div className="flex items-center gap-1.5">
             <Award className="h-3.5 w-3.5 text-[var(--accent)]" />
             {gender}
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Link href={`/dogs/${id}`} className="w-full">
            <Button 
               variant={isSold ? "secondary" : "outline"} 
               className="w-full h-11 font-bold uppercase tracking-tight text-xs"
               disabled={isSold}
            >
               {isSold ? "Sold Out" : "Check Health Docs"}
            </Button>
           </Link>
        </div>
      </CardContent>
    </Card>
  )
}
