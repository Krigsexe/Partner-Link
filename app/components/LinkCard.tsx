'use client'

import { useState, useEffect } from 'react'
import { Icon } from './Icon'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface LinkCardProps {
  link: {
    id: string
    name: string
    promo_code: string
    url: string
    created_at: string
    is_active: boolean
  }
  stats: {
    clicks: number
    signups: number
    purchases: number
  }
  onToggleActive?: (linkId: string, isActive: boolean) => void
}

export function LinkCard({ link, stats, onToggleActive }: LinkCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url)
    setCopied(true)
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const chartData = [
    { name: 'Sign Ups', value: stats.signups, fill: '#38bdf8' },
    { name: 'Purchases', value: stats.purchases, fill: '#818cf8' },
  ]

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl shadow-slate-950/30 overflow-hidden animate-fade-in">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">{link.name}</h3>
              {!link.is_active && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                  Inactif
                </span>
              )}
            </div>
            <p className="text-sm text-sky-400 font-mono bg-sky-900/50 inline-block px-2 py-1 rounded-md mt-1">
              {link.promo_code}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Créé le {new Date(link.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          {onToggleActive && (
            <button
              onClick={() => onToggleActive(link.id, !link.is_active)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                link.is_active
                  ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                  : 'bg-green-600 hover:bg-green-500 text-white'
              }`}
            >
              {link.is_active ? 'Désactiver' : 'Activer'}
            </button>
          )}
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 flex items-center justify-between gap-4 mb-6">
          <Icon name="link" className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            readOnly
            value={link.url}
            className="bg-transparent text-slate-300 w-full text-sm font-mono focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 p-2 rounded-md transition-all duration-200 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {copied ? <Icon name="check" className="w-4 h-4" /> : <Icon name="clipboard" className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4">
            <div className="p-3 rounded-full bg-sky-500/80">
              <Icon name="click" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Clics</p>
              <p className="text-white text-2xl font-bold">{stats.clicks.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-500/80">
              <Icon name="user" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Inscriptions</p>
              <p className="text-white text-2xl font-bold">{stats.signups.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4">
            <div className="p-3 rounded-full bg-indigo-500/80">
              <Icon name="cart" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Achats</p>
              <p className="text-white text-2xl font-bold">{stats.purchases.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {(stats.signups > 0 || stats.purchases > 0) && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <Icon name="chart" className="w-5 h-5 mr-2 text-slate-400" />
              Tunnel de conversion
            </h4>
            <div className="h-64 w-full bg-slate-900/20 p-2 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      color: '#f1f5f9',
                    }}
                    cursor={{ fill: '#334155' }}
                  />
                  <Bar dataKey="value" barSize={40} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
