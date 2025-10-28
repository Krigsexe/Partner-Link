import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-sky-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-6">
            PartnerLink
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-12">
            Gérez et suivez vos liens partenaires en toute simplicité
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold mb-2">Génération de liens</h3>
              <p className="text-slate-400">
                Créez des liens personnalisés avec codes promo pour vos partenaires
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Statistiques en temps réel</h3>
              <p className="text-slate-400">
                Suivez les clics, conversions et performances de vos liens
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">Sécurisé</h3>
              <p className="text-slate-400">
                Authentification robuste et données protégées avec Supabase
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/register"
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>

      <footer className="text-center py-6 text-sm text-slate-600">
        <p>&copy; {new Date().getFullYear()} Alixia & Solvin. All rights reserved.</p>
      </footer>
    </div>
  )
}
