# PartnerLink

Application complète de gestion et suivi de liens partenaires avec codes promo.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4)

## Fonctionnalités principales

- 🔐 **Authentification complète** - Email/password + Magic Link via Supabase Auth
- 🔗 **Génération de liens** - Créez des liens partenaires personnalisés avec codes promo
- 📊 **Analytics en temps réel** - Suivez les clics, inscriptions et achats
- 🎯 **Tracking automatique** - Chaque clic est automatiquement enregistré
- 👥 **Multi-utilisateurs** - Chaque partenaire a son propre dashboard
- 🛡️ **Sécurisé** - Row Level Security (RLS) avec Supabase
- 🌐 **Multi-domaines** - Support pour alixia.ch et solvin.ch
- 📈 **Dashboard admin** - Vue globale de tous les partenaires et liens
- 💾 **Export de données** - Export JSON des statistiques

## Stack technique

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Charts**: Recharts
- **Déploiement**: Vercel

## Démarrage rapide

### Prérequis

- Node.js 18+
- Un compte Supabase
- Un compte Vercel (pour le déploiement)

### Installation

1. Clonez le repository

```bash
git clone <votre-repo>
cd Partner-Link
```

2. Installez les dépendances

```bash
npm install
```

3. Configurez les variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
NEXT_PUBLIC_APP_URL=https://alixia.ch
```

4. Configurez la base de données

Exécutez le script SQL `supabase/migrations/001_init.sql` dans votre projet Supabase.

5. Lancez le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Déploiement

Consultez [SETUP.md](./SETUP.md) pour un guide complet de déploiement sur Vercel.

### Déploiement rapide sur Vercel

```bash
npm install -g vercel
vercel --prod
```

## Structure du projet

```
├── app/
│   ├── api/              # API Routes
│   │   ├── links/        # Gestion des liens partenaires
│   │   ├── stats/        # Statistiques
│   │   └── track/        # Tracking des clics et conversions
│   ├── auth/             # Pages d'authentification
│   ├── dashboard/        # Dashboard utilisateur
│   ├── admin/            # Dashboard administrateur
│   ├── promo/[id]/       # Redirection des liens
│   └── components/       # Composants React réutilisables
├── lib/
│   ├── supabase.ts       # Configuration Supabase
│   ├── database.types.ts # Types TypeScript
│   └── db-init.ts        # Initialisation DB
├── supabase/
│   └── migrations/       # Migrations SQL
└── public/               # Assets statiques
```

## Utilisation

### Créer un compte

1. Allez sur `/auth/register`
2. Remplissez le formulaire d'inscription
3. Vous serez redirigé vers votre dashboard

### Générer un lien partenaire

1. Depuis votre dashboard, remplissez le formulaire :
   - Nom du partenaire
   - Code promo
   - Domaine (alixia.ch ou solvin.ch)
2. Cliquez sur "Créer le lien"
3. Votre lien sera généré au format : `https://alixia.ch/promo/abc12345`

### Suivre les statistiques

Les statistiques sont mises à jour en temps réel :
- Nombre de clics
- Inscriptions
- Achats
- Graphiques de conversion

### Accéder au dashboard admin

1. Un utilisateur doit être marqué comme admin dans la base de données
2. Exécutez dans Supabase :

```sql
UPDATE partners SET is_admin = TRUE WHERE email = 'admin@example.com';
```

3. Accédez à `/admin`

## API

### Tracker un clic

```javascript
POST /api/track/click
Body: { "linkId": "uuid" }
```

### Tracker une conversion

```javascript
POST /api/track/conversion
Body: {
  "linkId": "uuid",
  "type": "signup" | "purchase",
  "metadata": { /* optional */ }
}
```

### Récupérer les statistiques

```javascript
GET /api/stats
GET /api/stats?linkId=uuid
Headers: { "Authorization": "Bearer <token>" }
```

## Sécurité

- **RLS activé** sur toutes les tables
- **Authentification requise** pour accéder aux dashboards
- **Service Role Key** utilisée uniquement côté serveur
- **Validation** de toutes les entrées utilisateur
- **HTTPS uniquement** en production

## Développé pour

- **Alixia** - [alixia.ch](https://alixia.ch)
- **Solvin** - [solvin.ch](https://solvin.ch)

## Documentation complète

Consultez [SETUP.md](./SETUP.md) pour la documentation complète incluant :
- Configuration détaillée de Supabase
- Guide de déploiement Vercel
- Configuration DNS
- Dépannage
- Roadmap future

## Licence

Propriétaire - Alixia & Solvin

## Support

Pour toute question, consultez la documentation ou contactez l'équipe de développement.

---

Fait avec ❤️ par Claude Code
