import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase'
import { TrackClick } from '@/app/components/TrackClick'

export default async function PromoLinkPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin()

  // Rechercher le lien par son ID court dans l'URL
  const { data: link } = await supabase
    .from('partner_links')
    .select('*')
    .ilike('url', `%/${params.id}`)
    .single()

  if (!link || !link.is_active) {
    // Rediriger vers une page d'erreur ou la page d'accueil
    redirect('/')
  }

  // Le tracking sera effectué côté client via le composant TrackClick
  // puis redirection vers la destination finale

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h1 className="text-2xl font-bold mb-2">Redirection en cours...</h1>
        <p className="text-slate-400">
          Vous allez être redirigé avec le code promo <strong>{link.promo_code}</strong>
        </p>
        <TrackClick linkId={link.id} promoCode={link.promo_code} />
      </div>
    </div>
  )
}
