'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Créer ou mettre à jour l'entrée dans la table partners
      const { data: partnerData } = await supabase
        .from('partners')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!partnerData) {
        await supabase.from('partners').insert({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.email!.split('@')[0],
        })
      }

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Veuillez entrer votre email')
      return
    }

    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      setMagicLinkSent(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold mb-4">Vérifiez vos emails</h2>
          <p className="text-slate-400 mb-6">
            Nous vous avons envoyé un lien de connexion magique à <strong>{email}</strong>
          </p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="text-sky-400 hover:text-sky-300 transition-colors"
          >
            Renvoyer le lien
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-sky-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-2">
            Connexion
          </h1>
          <p className="text-slate-400">Accédez à votre tableau de bord</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800/50 text-slate-400">ou</span>
              </div>
            </div>

            <button
              onClick={handleMagicLink}
              disabled={loading}
              className="mt-4 w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
            >
              Connexion par Magic Link
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            Pas encore de compte?{' '}
            <Link href="/auth/register" className="text-sky-400 hover:text-sky-300 font-semibold">
              Créer un compte
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-400 hover:text-slate-300 text-sm">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
