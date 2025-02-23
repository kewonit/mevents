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
    console.log('Received request body:', body) // Add debug logging

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Community name is required' },
        { status: 400 }
      )
    }

    if (!body.type) {
      return NextResponse.json(
        { error: 'Community type is required' },
        { status: 400 }
      )
    }

    if (!body.topicId) {
      return NextResponse.json(
        { error: `Topic selection is required (received: ${body.topicId})` },
        { status: 400 }
      )
    }

    // Check if community name already exists for this topic
    const { data: existingCommunity } = await supabase
      .from('communities')
      .select('id')
      .eq('topic_id', body.topicId)
      .ilike('name', body.name.trim())
      .single()

    if (existingCommunity) {
      return NextResponse.json(
        { error: 'A community with this name already exists in this topic' },
        { status: 400 }
      )
    }

    // Create the community with pending status
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: body.name.trim(),
        description: body.description?.trim() || null,
        type: body.type,
        topic_id: body.topicId,
        created_by: user.id,
        approval_status: 'pending'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Also create a membership for the creator as admin
    await supabase
      .from('community_memberships')
      .insert({
        community_id: data.id,
        profile_id: user.id,
        role: 'admin',
        status: 'approved'
      })

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    )
  }
}
