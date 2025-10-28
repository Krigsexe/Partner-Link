'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LinkGenerator } from '@/app/components/LinkGenerator'
import { LinkCard } from '@/app/components/LinkCard'
import { Icon } from '@/app/components/Icon'

interface PartnerLink {
  id: string
  name: string
  promo_code: string
  url: string
  created_at: string
  is_active: boolean
}

interface LinkStats {
  [linkId: string]: {
    clicks: number
    signups: number
    purchases: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [links, setLinks] = useState<PartnerLink[]>([])
  const [stats, setStats] = useState<LinkStats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }
    setUser(session.user)
    loadData(session.access_token)
  }

  const loadData = async (token: string) => {
    setLoading(true)
    try {
      // Charger les liens
      const linksResponse = await fetch('/api/links', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (linksResponse.ok) {
        const linksData = await linksResponse.json()
        setLinks(linksData.links || [])

        // Charger les stats globales
        const statsResponse = await fetch('/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          const statsMap: LinkStats = {}
          statsData.linkStats?.forEach((stat: any) => {
            statsMap[stat.linkId] = {
              clicks: stat.clicks,
              signups: stat.signups,
              purchases: stat.purchases,
            }
          })
          setStats(statsMap)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleLinkCreated = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      loadData(session.access_token)
    }
  }

  const handleToggleActive = async (linkId: string, isActive: boolean) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      const response = await fetch('/api/links', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ linkId, isActive }),
      })

      if (response.ok) {
        loadData(session.access_token)
      }
    } catch (error) {
      console.error('Error toggling link:', error)
    }
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
                PartnerLink
              </h1>
              <p className="text-sm text-slate-400">Bonjour, {user?.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Icon name="settings" className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
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

      <main className="container mx-auto max-w-6xl p-4 md:p-6 mt-6">
        <LinkGenerator onLinkCreated={handleLinkCreated} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Mes liens partenaires</h2>
          {links.length > 0 ? (
            <div className="space-y-6">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  stats={stats[link.id] || { clicks: 0, signups: 0, purchases: 0 }}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl">
              <h3 className="text-xl font-semibold text-white">Aucun lien pour le moment</h3>
              <p className="text-slate-400 mt-2">
                Utilisez le formulaire ci-dessus pour créer votre premier lien partenaire
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-slate-600 mt-12">
        <p>&copy; {new Date().getFullYear()} Alixia & Solvin. All rights reserved.</p>
      </footer>
    </div>
  )
}
