import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 })
    }

    const { dogId } = await request.json()
    if (!dogId) {
      return NextResponse.json({ error: 'Dog ID is required' }, { status: 400 })
    }

    // Validate dog availability
    const { data: dog, error: dogError } = await supabase
      .from('dogs')
      .select('price, status, name')
      .eq('id', dogId)
      .single()

    if (dogError || !dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 })
    }

    if (dog.status !== 'Available') {
      return NextResponse.json({ error: 'This dog is no longer available' }, { status: 400 })
    }

    // Generate unique reference
    const reference = `TRX_${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`

    // Take customer snapshot (for historical data)
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', user.id)
      .single()

    // Insert pending order
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        dog_id: dogId,
        customer_id: user.id,
        paystack_reference: reference,
        amount_paid: 0, // 0 until confirmed by webhook
        currency: 'NGN',
        status: 'pending',
        customer_snapshot: profile
      })

    if (orderError) {
      return NextResponse.json({ error: 'Failed to initialize checkout' }, { status: 500 })
    }

    // Return init payload for Paystack Popup JS
    return NextResponse.json({
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: profile?.email || user.email,
      amount: dog.price * 100, // Kobo
      reference: reference,
      currency: 'NGN',
    }, { status: 200 })

  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: 'Checkout server error' }, { status: 500 })
  }
}
