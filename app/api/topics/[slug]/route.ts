import { createClient } from '@/app/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const slug = context.params.slug // The param is already resolved here
    const searchName = slug.replace(/-/g, ' ')
    const supabase = await createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Get topic data
    const { data: topicData, error: topicError } = await supabase
      .from('topics')
      .select('*')
      .ilike('name', searchName)
      .single()

    if (topicError || !topicData) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    // Get communities
    const { data: communities } = await supabase
      .from('communities')
      .select('*')
      .eq('topic_id', topicData.id)
      .order('member_count', { ascending: false })

    // Get votes
    const { data: votes } = await supabase
      .from('community_votes')
      .select('community_id, vote_type')
      .in('community_id', (communities || []).map(c => c.id))

    // Get user votes if logged in
    const { data: userVotes } = user ? await supabase
      .from('community_votes')
      .select('community_id, vote_type')
      .eq('profile_id', user.id) : { data: null }

    // Calculate stats
    const communitiesWithStats = (communities || []).map(community => {
      const communityVotes = votes?.filter(v => v.community_id === community.id) || []
      const upvotes = communityVotes.filter(v => v.vote_type === 'upvote').length
      const downvotes = communityVotes.filter(v => v.vote_type === 'downvote').length
      const userVote = userVotes?.find(v => v.community_id === community.id)?.vote_type || null

      return {
        ...community,
        upvotes,
        downvotes,
        vote_score: upvotes - downvotes,
        user_vote: userVote
      }
    })

    return NextResponse.json({
      topic: topicData,
      communities: communitiesWithStats,
      votesCount: votes?.length || 0
    })
  } catch (error) {
    console.error('Error in topic API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topic data' },
      { status: 500 }
    )
  }
}
