import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 })
    }

    // 1. Verify transaction with Paystack API
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json({ 
        error: 'Payment verification failed', 
        details: data.message || 'Transaction not successful' 
      }, { status: 400 })
    }

    const paystackData = data.data
    const amountPaid = paystackData.amount / 100 // Kobo to NGN
    const transactionId = paystackData.id

    // 2. Initialize Supabase Admin client
    const supabaseAdmin = createAdminClient()

    // 3. Fetch Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('paystack_reference', reference)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // 4. If already successful, return success early (Idempotency)
    if (order.status === 'successful') {
      return NextResponse.json({ success: true, message: 'Order already processed' }, { status: 200 })
    }

    // 5. Update Order and Dog Status
    // We use a transaction-like sequence with the admin client
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'successful',
        paystack_transaction_id: transactionId.toString(),
        amount_paid: amountPaid,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)

    if (updateError) {
      throw new Error(`Failed to update order: ${updateError.message}`)
    }

    // Mark dog as Sold
    const { error: dogError } = await supabaseAdmin
      .from('dogs')
      .update({ status: 'Sold' })
      .eq('id', order.dog_id)

    if (dogError) {
       console.warn('Payment verified but failed to mark dog as Sold:', dogError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified and order updated successfully' 
    }, { status: 200 })

  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ 
      error: 'An internal error occurred during verification',
      details: error.message 
    }, { status: 500 })
  }
}
