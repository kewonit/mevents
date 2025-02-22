import { NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: topics, error } = await supabase
      .from('topics')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(topics)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 })
  }
}
