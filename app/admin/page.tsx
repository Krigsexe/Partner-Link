'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Icon } from '@/app/components/Icon'

interface Partner {
  id: string
  email: string
  name: string
  created_at: string
  is_active: boolean
  is_admin: boolean
}

interface AdminLink {
  id: string
  partner_id: string
  name: string
  promo_code: string
  url: string
  domain: string
  created_at: string
  is_active: boolean
}

interface AdminStats {
  totalPartners: number
  totalLinks: number
  totalClicks: number
  totalSignups: number
  totalPurchases: number
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [partners, setPartners] = useState<Partner[]>([])
  const [links, setLinks] = useState<AdminLink[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalPartners: 0,
    totalLinks: 0,
    totalClicks: 0,
    totalSignups: 0,
    totalPurchases: 0,
  })

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }

    setUser(session.user)

    // Vérifier si l'utilisateur est admin
    const { data: partner } = await supabase
      .from('partners')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (!partner?.is_admin) {
      // Pas admin, rediriger vers le dashboard normal
      router.push('/dashboard')
      return
    }

    setIsAdmin(true)
    loadAdminData(session.access_token)
  }

  const loadAdminData = async (token: string) => {
    setLoading(true)
    try {
      // Charger tous les partenaires
      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false })

      setPartners(partnersData || [])

      // Charger tous les liens
      const { data: linksData } = await supabase
        .from('partner_links')
        .select('*')
        .order('created_at', { ascending: false })

      setLinks(linksData || [])

      // Calculer les stats globales
      if (linksData) {
        const linkIds = linksData.map(l => l.id)

        const { count: totalClicks } = await supabase
          .from('link_clicks')
          .select('*', { count: 'exact', head: true })
          .in('link_id', linkIds)

        const { data: conversions } = await supabase
          .from('conversions')
          .select('type')
          .in('link_id', linkIds)

        setStats({
          totalPartners: partnersData?.length || 0,
          totalLinks: linksData.length,
          totalClicks: totalClicks || 0,
          totalSignups: conversions?.filter(c => c.type === 'signup').length || 0,
          totalPurchases: conversions?.filter(c => c.type === 'purchase').length || 0,
        })
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePartnerStatus = async (partnerId: string, isActive: boolean) => {
    try {
      await supabase
        .from('partners')
        .update({ is_active: isActive })
        .eq('id', partnerId)

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        loadAdminData(session.access_token)
      }
    } catch (error) {
      console.error('Error toggling partner status:', error)
    }
  }

  const handleToggleLinkStatus = async (linkId: string, isActive: boolean) => {
    try {
      await supabase
        .from('partner_links')
        .update({ is_active: isActive })
        .eq('id', linkId)

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        loadAdminData(session.access_token)
      }
    } catch (error) {
      console.error('Error toggling link status:', error)
    }
  }

  const handleExportData = () => {
    const exportData = {
      partners,
      links,
      stats,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `partnerlink-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-sky-400 opacity-20 blur-[100px]"></div>
      </div>

      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-400">Vue globale de PartnerLink</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Icon name="user" className="w-4 h-4" />
                <span className="hidden sm:inline">Mon Dashboard</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Icon name="logout" className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl p-4 md:p-6 mt-6">
        {/* Stats globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="user" className="w-6 h-6 text-sky-400" />
              <h3 className="text-sm font-medium text-slate-400">Partenaires</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalPartners}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="link" className="w-6 h-6 text-green-400" />
              <h3 className="text-sm font-medium text-slate-400">Liens</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalLinks}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="click" className="w-6 h-6 text-blue-400" />
              <h3 className="text-sm font-medium text-slate-400">Clics</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalClicks.toLocaleString()}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="user" className="w-6 h-6 text-purple-400" />
              <h3 className="text-sm font-medium text-slate-400">Inscriptions</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalSignups.toLocaleString()}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="cart" className="w-6 h-6 text-indigo-400" />
              <h3 className="text-sm font-medium text-slate-400">Achats</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalPurchases.toLocaleString()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <button
            onClick={handleExportData}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Exporter les données (JSON)
          </button>
        </div>

        {/* Liste des partenaires */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Partenaires</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left p-4 text-slate-400 font-semibold">Nom</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Email</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Créé le</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Statut</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-t border-slate-700">
                      <td className="p-4 text-white">
                        {partner.name}
                        {partner.is_admin && (
                          <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-300">{partner.email}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(partner.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            partner.is_active
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {partner.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleTogglePartnerStatus(partner.id, !partner.is_active)}
                          className={`text-sm px-3 py-1 rounded ${
                            partner.is_active
                              ? 'bg-red-600 hover:bg-red-500'
                              : 'bg-green-600 hover:bg-green-500'
                          } text-white transition-colors`}
                        >
                          {partner.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Liste des liens */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Tous les liens</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left p-4 text-slate-400 font-semibold">Nom</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Code Promo</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Domaine</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">URL</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Créé le</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Statut</th>
                    <th className="text-left p-4 text-slate-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} className="border-t border-slate-700">
                      <td className="p-4 text-white">{link.name}</td>
                      <td className="p-4">
                        <span className="text-sky-400 font-mono text-sm bg-sky-900/50 px-2 py-1 rounded">
                          {link.promo_code}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{link.domain}</td>
                      <td className="p-4 text-slate-400 text-sm font-mono truncate max-w-xs">
                        {link.url}
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(link.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            link.is_active
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {link.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleLinkStatus(link.id, !link.is_active)}
                          className={`text-sm px-3 py-1 rounded ${
                            link.is_active
                              ? 'bg-yellow-600 hover:bg-yellow-500'
                              : 'bg-green-600 hover:bg-green-500'
                          } text-white transition-colors`}
                        >
                          {link.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-slate-600 mt-12">
        <p>&copy; {new Date().getFullYear()} Alixia & Solvin. All rights reserved.</p>
      </footer>
    </div>
  )
}
