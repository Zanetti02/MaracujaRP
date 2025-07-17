/*
  # Schema completo per MaracujaRP

  1. Tabelle
    - `rule_sections` - Sezioni delle regole
    - `rules` - Regole individuali
    - `admin_users` - Utenti amministratori
    - `activity_logs` - Log delle attività

  2. Sicurezza
    - RLS abilitato su tutte le tabelle
    - Politiche per lettura pubblica e scrittura autenticata

  3. Funzionalità
    - Gestione completa sezioni e regole
    - Sistema di ordinamento
    - Log delle attività
    - Gestione utenti admin
*/

-- Estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabella sezioni regole
CREATE TABLE IF NOT EXISTS rule_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'Shield',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Tabella regole
CREATE TABLE IF NOT EXISTS rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES rule_sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Tabella utenti admin
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'moderator')),
  last_login timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Tabella log attività
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  details jsonb,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_rules_section_id ON rules(section_id);
CREATE INDEX IF NOT EXISTS idx_rules_order ON rules(order_index);
CREATE INDEX IF NOT EXISTS idx_sections_order ON rule_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per updated_at
DROP TRIGGER IF EXISTS update_rule_sections_updated_at ON rule_sections;
CREATE TRIGGER update_rule_sections_updated_at
    BEFORE UPDATE ON rule_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rules_updated_at ON rules;
CREATE TRIGGER update_rules_updated_at
    BEFORE UPDATE ON rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE rule_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Politiche per rule_sections
CREATE POLICY "Sezioni visibili a tutti"
  ON rule_sections
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Solo utenti autenticati possono modificare sezioni"
  ON rule_sections
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiche per rules
CREATE POLICY "Regole visibili a tutti"
  ON rules
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Solo utenti autenticati possono modificare regole"
  ON rules
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiche per admin_users
CREATE POLICY "Admin users visibili solo agli autenticati"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo utenti autenticati possono gestire admin"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Politiche per activity_logs
CREATE POLICY "Log visibili solo agli autenticati"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo utenti autenticati possono creare log"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Dati iniziali
INSERT INTO rule_sections (title, description, icon, order_index) VALUES
  ('Regolamento Generale', 'Regole base della comunità tropicale', 'Shield', 1),
  ('Regole di Roleplay', 'Linee guida per il gioco di ruolo', 'Users', 2),
  ('Comportamento', 'Norme di comportamento nella comunità', 'Heart', 3),
  ('Sanzioni', 'Sistema di sanzioni e procedure', 'AlertTriangle', 4)
ON CONFLICT DO NOTHING;

-- Regole iniziali per la sezione generale
INSERT INTO rules (section_id, title, content, order_index)
SELECT 
  s.id,
  'Benvenuto in MaracujaRP! 🌴',
  '<h3>🌴 Benvenuto su Maracuja Roleplay!</h3>
  <p>Benvenuto nella nostra <strong>comunità tropicale</strong>! Qui troverai tutte le regole necessarie per goderti al meglio la tua esperienza di roleplay.</p>
  
  <h4>🎯 Cosa troverai qui:</h4>
  <ul>
    <li><strong>Regole chiare</strong> - Tutto quello che devi sapere</li>
    <li><strong>Linee guida</strong> - Per un roleplay di qualità</li>
    <li><strong>Procedure</strong> - Come comportarsi in ogni situazione</li>
    <li><strong>Supporto</strong> - Il nostro team è sempre disponibile</li>
  </ul>
  
  <blockquote>
    💡 <em>Ricorda: Il rispetto reciproco è la base di ogni bella esperienza di roleplay!</em>
  </blockquote>
  
  <p>🏝️ <strong>Buona permanenza nel nostro paradiso tropicale!</strong> 🌺</p>',
  1
FROM rule_sections s 
WHERE s.title = 'Regolamento Generale'
ON CONFLICT DO NOTHING;

INSERT INTO rules (section_id, title, content, order_index)
SELECT 
  s.id,
  'Rispetto e Fair Play ⚖️',
  '<h3>⚖️ Principi Fondamentali</h3>
  <p>Il <strong>rispetto reciproco</strong> e il <strong>fair play</strong> sono i pilastri della nostra comunità.</p>
  
  <h4>✅ Comportamenti Positivi:</h4>
  <ul>
    <li>🤝 <strong>Rispetto</strong> - Tratta tutti con cortesia</li>
    <li>🎭 <strong>Roleplay di qualità</strong> - Interpreta il tuo personaggio</li>
    <li>💬 <strong>Comunicazione</strong> - Usa i canali appropriati</li>
    <li>🆘 <strong>Aiuto</strong> - Supporta i nuovi giocatori</li>
  </ul>
  
  <h4>❌ Comportamenti Vietati:</h4>
  <ul>
    <li>🚫 Insulti o linguaggio offensivo</li>
    <li>🚫 Metagaming o powergaming</li>
    <li>🚫 Disturbo del roleplay altrui</li>
    <li>🚫 Spam nelle chat</li>
  </ul>
  
  <div style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid #22c55e; padding: 12px; margin: 16px 0;">
    <strong>🌟 Ricorda:</strong> Una comunità sana è responsabilità di tutti! 🏝️
  </div>',
  2
FROM rule_sections s 
WHERE s.title = 'Regolamento Generale'
ON CONFLICT DO NOTHING;