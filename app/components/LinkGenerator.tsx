'use client'

import { useState } from 'react'
import { Icon } from './Icon'

interface LinkGeneratorProps {
  onLinkCreated: () => void
}

export function LinkGenerator({ onLinkCreated }: LinkGeneratorProps) {
  const [name, setName] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [domain, setDomain] = useState('alixia.ch')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !promoCode.trim()) {
      setError('Tous les champs sont requis')
      return
    }

    setError('')
    setLoading(true)

    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession()

      if (!session) {
        setError('Vous devez être connecté')
        return
      }

      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          promoCode: promoCode.trim(),
          domain,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la création du lien')
      }

      setName('')
      setPromoCode('')
      onLinkCreated()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 md:p-8 shadow-2xl shadow-slate-950/30">
      <h2 className="text-2xl font-bold text-white mb-1">Générer un lien partenaire</h2>
      <p className="text-slate-400 mb-6">Créez un nouveau lien trackable pour vos partenaires</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nom du partenaire
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Campagne Printemps 2025"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="promoCode" className="block text-sm font-medium text-slate-300 mb-2">
            Code promo
          </label>
          <input
            id="promoCode"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="ex: SAVE20"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors uppercase"
          />
        </div>

        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-slate-300 mb-2">
            Domaine
          </label>
          <select
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          >
            <option value="alixia.ch">alixia.ch</option>
            <option value="solvin.ch">solvin.ch</option>
          </select>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
        >
          <Icon name="plus" className="w-5 h-5 mr-2" />
          {loading ? 'Création...' : 'Créer le lien'}
        </button>
      </form>
    </div>
  )
}
