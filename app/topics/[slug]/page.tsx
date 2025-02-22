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

  // Calculate stats
  const communitiesWithStats = (communities || []).map(community => {
    const communityVotes = votes?.filter(v => v.community_id === community.id) || []
    const upvotes = communityVotes.filter(v => v.vote_type === 'upvote').length
    const downvotes = communityVotes.filter(v => v.vote_type === 'downvote').length

    return {
      ...community,
      upvotes,
      downvotes,
      vote_score: upvotes - downvotes
    }
  }) as CommunityWithStats[]

  console.log('Communities found:', communities?.length)
  console.log('Votes found:', votes?.length)

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="mb-8">
        <Link href="/topics">
          <Button variant="ghost" className="bg-[#f3f1ea] hover:bg-[#e0d8c3]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Button>
        </Link>
      </div>
      <div className="space-y-8">
        <div></div>
          <h1 className="font-instrument-serif text-4xl text-gray-900 mb-4">
            {topicData.name}
          </h1>
          <p className="text-gray-600">
            {topicData.description}
          </p>
        </div>
        
        <div className="mt-12">
          <h2 className="font-instrument-serif text-2xl text-gray-900 mb-6">
            Communities
          </h2>
          <CommunityGrid communities={communitiesWithStats} />
        </div>
      </div>
  )
}
