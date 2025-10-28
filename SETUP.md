# PartnerLink - Guide de déploiement

Application complète de gestion et suivi de liens partenaires avec codes promo, développée avec Next.js 14 et Supabase.

## Fonctionnalités

- ✅ Authentification complète (email/password + Magic Link)
- ✅ Génération de liens partenaires personnalisés
- ✅ Codes promo intégrés
- ✅ Tracking automatique des clics
- ✅ Suivi des conversions (inscriptions & achats)
- ✅ Dashboard utilisateur avec statistiques en temps réel
- ✅ Dashboard administrateur global
- ✅ Support multi-domaines (alixia.ch & solvin.ch)
- ✅ Export de données (JSON)
- ✅ Row Level Security (RLS) avec Supabase

## Prérequis

- Node.js 18+
- Un compte Supabase (gratuit)
- Un compte Vercel (gratuit)

## 1. Configuration Supabase

### 1.1 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et vos clés API

### 1.2 Configurer la base de données

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Exécutez le script SQL situé dans `supabase/migrations/001_init.sql`
3. Ce script va créer :
   - Les tables nécessaires (partners, partner_links, link_clicks, conversions)
   - Les index pour optimiser les performances
   - Les politiques RLS pour la sécurité
   - Les triggers pour les timestamps automatiques

### 1.3 Configurer l'authentification

1. Dans Supabase, allez dans **Authentication > Providers**
2. Activez **Email** provider
3. Configurez les templates d'emails si souhaité
4. Pour Magic Link, assurez-vous que **Enable email confirmations** est configuré selon vos besoins

### 1.4 Créer un utilisateur admin (optionnel)

Pour créer le premier utilisateur admin, après inscription :

```sql
UPDATE partners
SET is_admin = TRUE
WHERE email = 'votre@email.com';
```

## 2. Configuration de l'application

### 2.1 Cloner et installer

```bash
git clone <votre-repo>
cd Partner-Link
npm install
```

### 2.2 Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
NEXT_PUBLIC_APP_URL=https://alixia.ch
```

**Important** :
- La `SUPABASE_SERVICE_ROLE_KEY` doit rester secrète (côté serveur uniquement)
- Les variables avec `NEXT_PUBLIC_` sont exposées côté client

### 2.3 Développement local

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 3. Déploiement sur Vercel

### 3.1 Via l'interface Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre repository GitHub
3. Importez le projet
4. Configurez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
5. Déployez !

### 3.2 Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### 3.3 Configuration des domaines

1. Dans Vercel, allez dans **Settings > Domains**
2. Ajoutez vos domaines personnalisés :
   - `alixia.ch`
   - `solvin.ch` (si applicable)
3. Configurez les DNS selon les instructions Vercel

## 4. Configuration DNS pour les liens partenaires

Pour que les liens générés fonctionnent correctement :

### Pour alixia.ch

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Pour solvin.ch (optionnel)

Même configuration que ci-dessus.

## 5. Utilisation

### 5.1 Créer un compte

1. Visitez `/auth/register`
2. Créez votre compte
3. Vous serez automatiquement connecté

### 5.2 Générer un lien partenaire

1. Depuis `/dashboard`
2. Remplissez le formulaire :
   - Nom du partenaire (ex: "Campagne Printemps 2025")
   - Code promo (ex: "SAVE20")
   - Domaine (alixia.ch ou solvin.ch)
3. Le lien sera généré automatiquement

### 5.3 Partager le lien

Le lien généré aura le format :
```
https://alixia.ch/promo/abc12345
```

Quand quelqu'un clique :
1. Le clic est automatiquement tracké
2. L'utilisateur est redirigé vers la destination avec le code promo
3. Les statistiques sont mises à jour en temps réel

### 5.4 Tracker les conversions

Pour enregistrer une conversion (inscription ou achat), faites une requête POST :

```javascript
fetch('https://alixia.ch/api/track/conversion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    linkId: 'uuid-du-lien',
    type: 'signup', // ou 'purchase'
    metadata: { /* données optionnelles */ }
  })
})
```

### 5.5 Dashboard Admin

Accédez à `/admin` pour :
- Voir tous les partenaires
- Voir tous les liens
- Statistiques globales
- Activer/désactiver des liens ou partenaires
- Exporter les données

## 6. Architecture

```
app/
├── api/
│   ├── links/          # CRUD des liens partenaires
│   ├── stats/          # Statistiques et analytics
│   └── track/          # Tracking des clics et conversions
├── auth/
│   ├── login/          # Page de connexion
│   └── register/       # Page d'inscription
├── dashboard/          # Dashboard utilisateur
├── admin/              # Dashboard admin
├── promo/[id]/         # Redirection des liens partenaires
└── components/         # Composants réutilisables

lib/
├── supabase.ts         # Client Supabase
├── database.types.ts   # Types TypeScript générés
└── db-init.ts          # Initialisation DB (si besoin)

supabase/
└── migrations/
    └── 001_init.sql    # Migration initiale
```

## 7. Sécurité

### Row Level Security (RLS)

Toutes les tables utilisent RLS :
- Les partenaires ne voient que leurs propres liens
- Les admins ont accès à tout
- Le tracking est anonyme (pas d'auth requise)

### Variables d'environnement

- **Jamais** commiter `.env.local`
- Utiliser les secrets Vercel en production
- La service role key doit rester côté serveur uniquement

## 8. Maintenance

### Vérifier les logs

```bash
vercel logs
```

### Mettre à jour les dépendances

```bash
npm update
npm audit fix
```

### Backup de la base de données

Depuis Supabase Dashboard :
1. **Database > Backups**
2. Téléchargez un backup manuel ou configurez les backups automatiques

## 9. Dépannage

### Les migrations ne s'exécutent pas

Exécutez manuellement le SQL depuis le SQL Editor de Supabase.

### Erreur d'authentification

Vérifiez que :
- Les variables d'environnement sont correctes
- L'URL Supabase est valide
- Les clés API sont les bonnes

### Les clics ne sont pas trackés

Vérifiez que :
- Les politiques RLS permettent l'insertion dans `link_clicks`
- Le lien est actif (`is_active = true`)

## 10. Support

Pour toute question ou problème :
- Documentation Supabase : [supabase.com/docs](https://supabase.com/docs)
- Documentation Next.js : [nextjs.org/docs](https://nextjs.org/docs)
- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)

## 11. Roadmap future

- [ ] Analytics avancées avec graphiques temporels
- [ ] API webhooks pour notifications
- [ ] Intégration Stripe pour suivi des paiements
- [ ] Export CSV en plus de JSON
- [ ] Filtres et recherche dans l'admin
- [ ] Dark/Light mode toggle
- [ ] Multi-langue (i18n)

---

Développé avec ❤️ pour Alixia & Solvin
