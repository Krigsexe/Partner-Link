import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    const { linkId, type, metadata } = body

    if (!linkId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: linkId, type' },
        { status: 400 }
      )
    }

    if (!['signup', 'purchase'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either signup or purchase' },
        { status: 400 }
      )
    }

    // Vérifier que le lien existe
    const { data: link } = await supabase
      .from('partner_links')
      .select('*')
      .eq('id', linkId)
      .single()

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Enregistrer la conversion
    const { error } = await supabase.from('conversions').insert({
      link_id: linkId,
      type,
      metadata: metadata || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
