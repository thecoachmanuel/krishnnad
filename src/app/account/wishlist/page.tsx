"use client"

import * as React from "react"
import { Heart, ShoppingBag } from "lucide-react"
import { DogCard } from "@/components/DogCard"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const supabase = createClient()

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          dog:dogs(
            id,
            name,
            price,
            status,
            age_months,
            gender,
            breed:breeds(name),
            images:dog_images(url)
          )
        `)
        .eq("user_id", session.user.id)
      
      if (error) throw error
      
      // Flatten the data
      const items = data
        ?.map((item: any) => item.dog)
        .filter(Boolean) || []
      
      setWishlistItems(items)
    } catch (err) {
      console.error("Error fetching wishlist:", err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchWishlist()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">My Wishlist</h1>
        <p className="text-[var(--muted)] mt-1">Dogs you've saved for later.</p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-[4/5] rounded-2xl bg-[var(--surface-2)] animate-pulse" />
          ))}
        </div>
      ) : wishlistItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((dog) => (
            <DogCard
              key={dog.id}
              id={dog.id}
              name={dog.name}
              breed={dog.breed?.name || "Unknown"}
              price={dog.price}
              imageUrl={dog.images?.[0]?.url || ""}
              status={dog.status}
              age={`${dog.age_months} Months`}
              gender={dog.gender}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)]/30">
          <div className="h-20 w-20 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)]">
            <Heart className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">Your wishlist is empty</h3>
            <p className="text-[var(--muted)] mt-2 max-w-xs">
              Explore our collection and heart your favorite dogs to see them here.
            </p>
          </div>
          <Link href="/dogs">
            <Button className="gap-2">
              <ShoppingBag className="h-4 w-4" /> Browse Collection
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
