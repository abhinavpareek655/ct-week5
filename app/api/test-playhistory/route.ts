import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    console.log('🧪 Testing PlayHistory table...')
    
    // Test 1: Check if PlayHistory table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'PlayHistory')
    
    console.log('Tables found:', tables)
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError)
      return NextResponse.json({ 
        error: 'Failed to check tables', 
        details: tablesError.message 
      }, { status: 500 })
    }
    
    // Test 2: Check PlayHistory table structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'PlayHistory')
      .eq('table_schema', 'public')
    
    console.log('PlayHistory columns:', columns)
    
    // Test 3: Try to select from PlayHistory
    const { data: existingData, error: selectError } = await supabase
      .from('PlayHistory')
      .select('*')
      .limit(5)
    
    console.log('Existing PlayHistory data:', existingData)
    
    // Test 4: Check if Song table exists and has data
    const { data: songs, error: songsError } = await supabase
      .from('Song')
      .select('id, title, artist')
      .limit(3)
    
    console.log('Sample songs:', songs)
    
    return NextResponse.json({
      status: 'PlayHistory test completed',
      results: {
        tableExists: tables && tables.length > 0,
        columns: columns || [],
        existingRecords: existingData?.length || 0,
        sampleRecords: existingData?.slice(0, 2) || [],
        sampleSongs: songs || [],
        errors: {
          tables: tablesError?.message,
          columns: columnsError?.message,
          select: selectError?.message,
          songs: songsError?.message
        }
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      }
    })
    
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing PlayHistory insert...')
    
    const { userId, songId } = await request.json()
    
    if (!userId || !songId) {
      return NextResponse.json({
        error: 'Missing userId or songId for test'
      }, { status: 400 })
    }
    
    const testData = {
      userId,
      songId: parseInt(songId),
      playedAt: new Date().toISOString()
    }
    
    console.log('Test insert data:', testData)
    
    const { data, error } = await supabase
      .from('PlayHistory')
      .insert(testData)
      .select()
    
    if (error) {
      console.error('Insert test failed:', error)
      return NextResponse.json({
        error: 'Insert test failed',
        details: error.message,
        code: error.code,
        hint: error.hint,
        testData
      }, { status: 500 })
    }
    
    console.log('✅ Test insert successful:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Test insert successful',
      data,
      testData
    })
    
  } catch (error) {
    console.error('Test insert error:', error)
    return NextResponse.json({
      error: 'Test insert error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
