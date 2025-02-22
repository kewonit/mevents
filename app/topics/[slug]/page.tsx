import { notFound } from 'next/navigation'
import { TopicPageContent } from './components/TopicPageContent'

export const revalidate = 0

interface TopicPageProps {
  params: {
    slug: string
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/topics/${params.slug}`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    notFound()
  }

  const data = await response.json()

  return (
    <TopicPageContent
      topicData={data.topic}
      communities={data.communities}
      votesCount={data.votesCount}
    />
  )
}
