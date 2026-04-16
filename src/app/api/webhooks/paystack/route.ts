import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// In a real API router setting, webhooks need to bypass Next.js default body parsing 
// to verify the raw signature. However, Next.js App Router exposes `request.text()`.
export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
       return NextResponse.json({ error: 'Missing Paystack Signature' }, { status: 400 })
    }

    // Verify signature
    const secret = process.env.PAYSTACK_SECRET_KEY || ''
    const expectedSignature = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex')

    if (signature !== expectedSignature) {
       return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)
    console.log('Paystack Webhook received:', event.event, 'Reference:', event.data?.reference)
    
    // Handle idempotency & successful charge
    if (event.event === 'charge.success') {
      const reference = event.data.reference
      const transactionId = event.data.id
      const amountPaid = event.data.amount / 100 // Convert Kobo to NGN

      // Initialize Supabase Admin client to bypass RLS for webhook operations
      const supabaseAdmin = createAdminClient()

      // Fetch existing order using reference
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('paystack_reference', reference)
        .single()
        
      if (orderError || !order) {
        console.error('Webhook Error: Order not found for reference:', reference, orderError)
        return NextResponse.json({ status: 'Order not found, continuing' }, { status: 200 })
      }

      // If already fulfilled, return 200 early (Idempotency check)
      if (order.status === 'successful') {
        console.log('Webhook: Order already processed, skipping.')
        return NextResponse.json({ status: 'Already processed' }, { status: 200 })
      }

      console.log('Webhook: Updating order', order.id, 'to successful. Amount:', amountPaid)

      // 1. Update Order Status
      await supabaseAdmin
        .from('orders')
        .update({
           status: 'successful',
           paystack_transaction_id: transactionId.toString(),
           amount_paid: amountPaid
        })
        .eq('id', order.id)

      // 2. Mark Dog as Sold
      await supabaseAdmin
        .from('dogs')
        .update({ status: 'Sold' })
        .eq('id', order.dog_id)

      return NextResponse.json({ status: 'Success' }, { status: 200 })
    }

    // Return 200 OK to Paystack for other events automatically so it doesn't retry
    return NextResponse.json({ status: 'Ignored' }, { status: 200 })
    
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
