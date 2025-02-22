import { NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: topics, error } = await supabase
      .from('topics')
      .select('id, name, description, icon_url, created_at')
      .order('name')

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return NextResponse.json(topics, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
