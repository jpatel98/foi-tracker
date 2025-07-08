import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const region = searchParams.get('region')
    const agency = searchParams.get('agency')

    let query = supabase
      .from('foi_requests')
      .select(`
        *,
        notes (*),
        reminders (*),
        files (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (region) {
      query = query.eq('region', region)
    }
    if (agency) {
      query = query.ilike('agency', `%${agency}%`)
    }

    const { data: foiRequests, error } = await query

    if (error) {
      console.error('Error fetching FOI requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch FOI requests' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      foi_requests: foiRequests 
    })

  } catch (error) {
    console.error('Error in FOI list:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 