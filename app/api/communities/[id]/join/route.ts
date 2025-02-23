import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('community_memberships')
      .insert({
        community_id: params.id,
        profile_id: user.id,
        role: 'member',
        status: 'pending'
      })
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json(data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
