import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'
import { CommunityType } from '@/app/utils/db'

interface CreateCommunityBody {
  name: string
  description?: string
  type: CommunityType
  topicId: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json() as CreateCommunityBody

    // Validate required fields
    if (!body.name || !body.type || !body.topicId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: body.name,
        description: body.description,
        type: body.type,
        topic_id: body.topicId,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 })
  }
}
