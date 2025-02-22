import { createClient } from '@/app/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommunityGrid } from '@/app/topics/[slug]/components/CommunityGrid'
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

  const { data: communities } = await supabase
    .from('community_stats_mv')
    .select('*')
    .eq('topic_id', topicData.id)
    .order('member_count', { ascending: false })

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
        <CommunityGrid communities={communities as CommunityWithStats[] || []} />
      </div>
    </div>
  )
}
