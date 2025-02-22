import { createClient } from '@/app/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { VoteType } from '@/app/utils/db'

export async function POST(request: NextRequest) {
  try {
    const { communityId, voteType } = await request.json()
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from('community_votes')
      .select('vote_type')
      .eq('community_id', communityId)
      .eq('profile_id', user.id)
      .single()

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking the same button
        await supabase
          .from('community_votes')
          .delete()
          .eq('community_id', communityId)
          .eq('profile_id', user.id)
      } else {
        // Update vote if changing vote type
        await supabase
          .from('community_votes')
          .update({ vote_type: voteType })
          .eq('community_id', communityId)
          .eq('profile_id', user.id)
      }
    } else {
      // Insert new vote
      await supabase
        .from('community_votes')
        .insert({
          community_id: communityId,
          profile_id: user.id,
          vote_type: voteType as VoteType
        })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}
