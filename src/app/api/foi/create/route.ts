import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { calculateDeadline } from '@/lib/deadline-calculator'
import { addDays, format } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, agency, region, submitted_date, notes } = body

    // Validate required fields
    if (!title || !agency || !region || !submitted_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate deadline based on region
    const deadline_date = calculateDeadline(submitted_date, region)

    // Create FOI request
    const { data: foiRequest, error: foiError } = await supabaseAdmin
      .from('foi_requests')
      .insert({
        user_id: userId,
        title,
        agency,
        region,
        submitted_date,
        deadline_date,
        status: 'submitted'
      })
      .select()
      .single()

    if (foiError) {
      console.error('Error creating FOI request:', foiError)
      return NextResponse.json(
        { error: 'Failed to create FOI request' },
        { status: 500 }
      )
    }

    // Add note if provided
    if (notes) {
      await supabaseAdmin
        .from('notes')
        .insert({
          foi_id: foiRequest.id,
          text: notes
        })
    }

    // Schedule reminders
    const reminders = [
      {
        foi_id: foiRequest.id,
        reminder_type: 'deadline',
        remind_at: format(addDays(new Date(deadline_date), -7), 'yyyy-MM-dd HH:mm:ss')
      },
      {
        foi_id: foiRequest.id,
        reminder_type: 'follow-up',
        remind_at: format(addDays(new Date(submitted_date), 15), 'yyyy-MM-dd HH:mm:ss')
      }
    ]

    await supabaseAdmin
      .from('reminders')
      .insert(reminders)

    return NextResponse.json({ 
      success: true, 
      foi_request: foiRequest 
    })

  } catch (error) {
    console.error('Error in FOI creation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 