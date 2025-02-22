import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // First, get topics with their communities
  const { data: topics, error } = await supabase
    .from('topics')
    .select(`
      id,
      name,
      description,
      icon_url,
      created_at,
      communities (
        id,
        member_count
      )
    `)
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Then, get vote counts separately
  const { data: voteStats, error: voteError } = await supabase
    .from('community_votes')
    .select('community_id')

  if (voteError) {
    return NextResponse.json({ error: voteError.message }, { status: 500 })
  }

  // Create a map of community vote counts
  const communityVoteCounts = voteStats.reduce((acc, vote) => {
    acc[vote.community_id] = (acc[vote.community_id] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topicsWithStats = topics.map(topic => {
    // Ensure communities is an array
    const communities = Array.isArray(topic.communities) ? topic.communities : []
    
    // Use Number() for conversion, matching the slug page's quick stats logic
    const totalMembers = communities.reduce((acc, community) => {
      const mem = Number(community.member_count)
      return acc + (isNaN(mem) ? 0 : mem)
    }, 0)

    // Calculate total votes for all communities in this topic
    const totalVotes = communities.reduce((acc, community) => {
      return acc + (communityVoteCounts[community.id] || 0)
    }, 0)

    return {
      ...topic,
      total_members: totalMembers,
      total_communities: communities.length,
      total_votes: totalVotes
    }
  })

  return NextResponse.json(topicsWithStats)
}
