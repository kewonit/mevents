import { createClient } from '@/app/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommunityGrid } from './components/CommunityGrid'
import { CommunityWithStats } from '@/app/utils/db'

export const revalidate = 0

interface TopicPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params
  const searchName = slug.replace(/-/g, ' ')
  
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  const { data: topicData, error } = await supabase
    .from('topics')
    .select('*')
    .ilike('name', searchName)
    .single()

  if (error || !topicData) {
    notFound()
  }

  // First fetch communities
  const { data: communities } = await supabase
    .from('communities')
    .select('*')
    .eq('topic_id', topicData.id)
    .order('member_count', { ascending: false })

  // Then fetch votes for all communities
  const { data: votes } = await supabase
    .from('community_votes')
    .select('community_id, vote_type')
    .in('community_id', (communities || []).map(c => c.id))

  // Fetch user's votes if logged in
  const { data: userVotes } = user ? await supabase
    .from('community_votes')
    .select('community_id, vote_type')
    .eq('profile_id', user.id) : { data: null }

  // Calculate stats and add user's vote
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
  }) as CommunityWithStats[]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-16">
      {/* Sidebar - extend above with negative margin */}
      <aside className="w-full lg:w-1/3 bg-[#f3f1ea] p-4 lg:p-8 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] -mt-16">
        <div className="space-y-4 lg:space-y-6 pt-20 lg:pt-0">
          <Link href="/topics">
            <Button variant="ghost" className="bg-white/60 hover:bg-white/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Topics
            </Button>
          </Link>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 space-y-4">
            <h1 className="font-instrument-serif text-4xl text-gray-900">
              {topicData.name}
            </h1>
            <p className="text-gray-600">
              {topicData.description}
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl">
                <div className="text-2xl font-bold">{communities?.length || 0}</div>
                <div className="text-sm text-gray-500">Communities</div>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <div className="text-2xl font-bold">{votes?.length || 0}</div>
                <div className="text-sm text-gray-500">Total Votes</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - now 2/3 width */}
      <main className="w-full lg:w-2/3 p-4 lg:p-8">
        <div className="space-y-6 lg:space-y-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-8">
            <h2 className="font-instrument-serif text-2xl text-gray-900 mb-6">
              Communities
            </h2>
            <CommunityGrid communities={communitiesWithStats} />
          </div>
        </div>
      </main>
    </div>
  )
}
