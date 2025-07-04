import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: albums, error } = await supabase
      .from('Album')
      .select('*')
      .order('title')
    
    if (error) {
      console.error('Error fetching albums:', error)
      return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 })
    }
    
    return NextResponse.json(albums || [])
  } catch (error) {
    console.error('Error in GET /api/albums:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
