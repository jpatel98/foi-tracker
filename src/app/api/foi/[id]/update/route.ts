import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, response_date, notes } = body

    // Verify the FOI request belongs to the user
    const { data: existingRequest, error: fetchError } = await supabaseAdmin
      .from('foi_requests')
      .select('id, user_id')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !existingRequest) {
      return NextResponse.json(
        { error: 'FOI request not found' },
        { status: 404 }
      )
    }

    // Update the FOI request
    const updateData: any = {}
    if (status) updateData.status = status
    if (response_date) updateData.response_date = response_date

    const { data: updatedRequest, error: updateError } = await supabaseAdmin
      .from('foi_requests')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating FOI request:', updateError)
      return NextResponse.json(
        { error: 'Failed to update FOI request' },
        { status: 500 }
      )
    }

    // Add note if provided
    if (notes) {
      await supabaseAdmin
        .from('notes')
        .insert({
          foi_id: params.id,
          text: notes
        })
    }

    return NextResponse.json({ 
      success: true, 
      foi_request: updatedRequest 
    })

  } catch (error) {
    console.error('Error in FOI update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 