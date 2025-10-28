import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Récupérer les liens de l'utilisateur
    const { data: links, error } = await supabase
      .from('partner_links')
      .select('*')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ links })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, promoCode, domain } = body

    if (!name || !promoCode || !domain) {
      return NextResponse.json(
        { error: 'Missing required fields: name, promoCode, domain' },
        { status: 400 }
      )
    }

    // Valider le domaine
    const allowedDomains = ['alixia.ch', 'solvin.ch']
    if (!allowedDomains.includes(domain)) {
      return NextResponse.json(
        { error: 'Domain must be either alixia.ch or solvin.ch' },
        { status: 400 }
      )
    }

    // Générer un ID court pour le lien
    const linkId = uuidv4().slice(0, 8)
    const url = `https://${domain}/promo/${linkId}`

    // Créer le lien dans la base de données
    const { data: link, error } = await supabase
      .from('partner_links')
      .insert({
        partner_id: user.id,
        name,
        promo_code: promoCode.toUpperCase(),
        domain,
        url,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ link })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { linkId, isActive } = body

    if (!linkId) {
      return NextResponse.json({ error: 'Missing linkId' }, { status: 400 })
    }

    // Vérifier que le lien appartient à l'utilisateur
    const { data: existingLink } = await supabase
      .from('partner_links')
      .select('*')
      .eq('id', linkId)
      .eq('partner_id', user.id)
      .single()

    if (!existingLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Mettre à jour le lien
    const { data: link, error } = await supabase
      .from('partner_links')
      .update({ is_active: isActive })
      .eq('id', linkId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ link })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
