import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    const searchParams = request.nextUrl.searchParams
    const linkId = searchParams.get('linkId')

    if (!linkId) {
      // Récupérer les stats globales de l'utilisateur
      const { data: links } = await supabase
        .from('partner_links')
        .select('id')
        .eq('partner_id', user.id)

      if (!links || links.length === 0) {
        return NextResponse.json({
          totalClicks: 0,
          totalSignups: 0,
          totalPurchases: 0,
          linkStats: [],
        })
      }

      const linkIds = links.map(l => l.id)

      // Récupérer les clics
      const { count: totalClicks } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .in('link_id', linkIds)

      // Récupérer les conversions
      const { data: conversions } = await supabase
        .from('conversions')
        .select('type')
        .in('link_id', linkIds)

      const totalSignups = conversions?.filter(c => c.type === 'signup').length || 0
      const totalPurchases = conversions?.filter(c => c.type === 'purchase').length || 0

      // Stats par lien
      const linkStats = await Promise.all(
        links.map(async (link) => {
          const { count: clicks } = await supabase
            .from('link_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('link_id', link.id)

          const { data: linkConversions } = await supabase
            .from('conversions')
            .select('type')
            .eq('link_id', link.id)

          const signups = linkConversions?.filter(c => c.type === 'signup').length || 0
          const purchases = linkConversions?.filter(c => c.type === 'purchase').length || 0

          return {
            linkId: link.id,
            clicks: clicks || 0,
            signups,
            purchases,
          }
        })
      )

      return NextResponse.json({
        totalClicks: totalClicks || 0,
        totalSignups,
        totalPurchases,
        linkStats,
      })
    } else {
      // Stats pour un lien spécifique
      const { data: link } = await supabase
        .from('partner_links')
        .select('*')
        .eq('id', linkId)
        .eq('partner_id', user.id)
        .single()

      if (!link) {
        return NextResponse.json({ error: 'Link not found' }, { status: 404 })
      }

      const { count: clicks } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('link_id', linkId)

      const { data: conversions } = await supabase
        .from('conversions')
        .select('*')
        .eq('link_id', linkId)

      const signups = conversions?.filter(c => c.type === 'signup').length || 0
      const purchases = conversions?.filter(c => c.type === 'purchase').length || 0

      // Récupérer l'historique des clics (derniers 30 jours)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: clickHistory } = await supabase
        .from('link_clicks')
        .select('clicked_at')
        .eq('link_id', linkId)
        .gte('clicked_at', thirtyDaysAgo.toISOString())

      return NextResponse.json({
        clicks: clicks || 0,
        signups,
        purchases,
        clickHistory: clickHistory || [],
      })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
