import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { songId, userId } = await request.json()
    
    if (!songId || !userId) {
      return NextResponse.json(
        { error: 'Song ID and User ID are required' },
        { status: 400 }
      )
    }

    // Record the play in PlayHistory
    const { error: playHistoryError } = await supabase
      .from('PlayHistory')
      .insert({
        userId,
        songId,
        playedAt: new Date().toISOString()
      })

    if (playHistoryError) {
      console.error('Error recording play history:', playHistoryError)
      return NextResponse.json(
        { error: 'Failed to record play history' },
        { status: 500 }
      )
    }

    // Increment the plays count for the song
    const { error: updateError } = await supabase
      .from('Song')
      .update({ plays: supabase.rpc('increment_plays') })
      .eq('id', songId)

    if (updateError) {
      console.error('Error updating song plays:', updateError)
      // Don't fail the request if this fails, just log it
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in play recording:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 