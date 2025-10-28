-- Table des partenaires
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Table des liens partenaires
CREATE TABLE IF NOT EXISTS partner_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  promo_code TEXT NOT NULL,
  domain TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Table des clics sur les liens
CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES partner_links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referer TEXT,
  user_agent TEXT,
  ip_address TEXT
);

-- Table des conversions
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES partner_links(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('signup', 'purchase')),
  converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_partner_links_partner_id ON partner_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_links_promo_code ON partner_links(promo_code);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON link_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_conversions_link_id ON conversions(link_id);
CREATE INDEX IF NOT EXISTS idx_conversions_type ON conversions(type);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_links_updated_at ON partner_links;
CREATE TRIGGER update_partner_links_updated_at
  BEFORE UPDATE ON partner_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour partners
DROP POLICY IF EXISTS "Partners can view their own data" ON partners;
CREATE POLICY "Partners can view their own data" ON partners
  FOR SELECT USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Admins can view all partners" ON partners;
CREATE POLICY "Admins can view all partners" ON partners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM partners WHERE id = auth.uid()::text AND is_admin = TRUE
    )
  );

-- Politiques RLS pour partner_links
DROP POLICY IF EXISTS "Partners can view their own links" ON partner_links;
CREATE POLICY "Partners can view their own links" ON partner_links
  FOR SELECT USING (partner_id = auth.uid()::text);

DROP POLICY IF EXISTS "Partners can insert their own links" ON partner_links;
CREATE POLICY "Partners can insert their own links" ON partner_links
  FOR INSERT WITH CHECK (partner_id = auth.uid()::text);

DROP POLICY IF EXISTS "Partners can update their own links" ON partner_links;
CREATE POLICY "Partners can update their own links" ON partner_links
  FOR UPDATE USING (partner_id = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can view all links" ON partner_links;
CREATE POLICY "Admins can view all links" ON partner_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM partners WHERE id = auth.uid()::text AND is_admin = TRUE
    )
  );

-- Politiques RLS pour link_clicks (lecture seule pour les propriétaires)
DROP POLICY IF EXISTS "Partners can view clicks on their links" ON link_clicks;
CREATE POLICY "Partners can view clicks on their links" ON link_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM partner_links WHERE id = link_clicks.link_id AND partner_id = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Service can insert clicks" ON link_clicks;
CREATE POLICY "Service can insert clicks" ON link_clicks
  FOR INSERT WITH CHECK (TRUE);

-- Politiques RLS pour conversions
DROP POLICY IF EXISTS "Partners can view conversions on their links" ON conversions;
CREATE POLICY "Partners can view conversions on their links" ON conversions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM partner_links WHERE id = conversions.link_id AND partner_id = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Service can insert conversions" ON conversions;
CREATE POLICY "Service can insert conversions" ON conversions
  FOR INSERT WITH CHECK (TRUE);
