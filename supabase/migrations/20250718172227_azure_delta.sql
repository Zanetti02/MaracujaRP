/*
  # Sistema completo per Regole e Sezioni MaracujaRP

  1. Nuove Tabelle
    - `rule_sections` - Sezioni delle regole con ordinamento
    - `rules` - Regole con contenuto HTML e ordinamento
    - `admin_users` - Utenti amministratori
    - `activity_logs` - Log delle attività per audit

  2. Sicurezza
    - RLS abilitato su tutte le tabelle
    - Policy per lettura pubblica delle regole
    - Policy per modifica solo da utenti autenticati

  3. Funzionalità
    - Ordinamento drag & drop
    - Contenuto HTML ricco
    - Sistema di audit completo
    - Gestione icone personalizzate
*/

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Tabella admin users
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
CREATE INDEX IF NOT EXISTS idx_sections_order ON rule_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_rules_section_id ON rules(section_id);
CREATE INDEX IF NOT EXISTS idx_rules_order ON rules(order_index);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);

-- Trigger per updated_at
DROP TRIGGER IF EXISTS update_rule_sections_updated_at ON rule_sections;
CREATE TRIGGER update_rule_sections_updated_at
    BEFORE UPDATE ON rule_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rules_updated_at ON rules;
CREATE TRIGGER update_rules_updated_at
    BEFORE UPDATE ON rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE rule_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy per sezioni (lettura pubblica, modifica solo autenticati)
DROP POLICY IF EXISTS "Sezioni visibili a tutti" ON rule_sections;
CREATE POLICY "Sezioni visibili a tutti"
    ON rule_sections FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Solo utenti autenticati possono modificare sezioni" ON rule_sections;
CREATE POLICY "Solo utenti autenticati possono modificare sezioni"
    ON rule_sections FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy per regole (lettura pubblica, modifica solo autenticati)
DROP POLICY IF EXISTS "Regole visibili a tutti" ON rules;
CREATE POLICY "Regole visibili a tutti"
    ON rules FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Solo utenti autenticati possono modificare regole" ON rules;
CREATE POLICY "Solo utenti autenticati possono modificare regole"
    ON rules FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy per admin users
DROP POLICY IF EXISTS "Admin users visibili solo agli autenticati" ON admin_users;
CREATE POLICY "Admin users visibili solo agli autenticati"
    ON admin_users FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Solo utenti autenticati possono gestire admin" ON admin_users;
CREATE POLICY "Solo utenti autenticati possono gestire admin"
    ON admin_users FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy per activity logs
DROP POLICY IF EXISTS "Log visibili solo agli autenticati" ON activity_logs;
CREATE POLICY "Log visibili solo agli autenticati"
    ON activity_logs FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Solo utenti autenticati possono creare log" ON activity_logs;
CREATE POLICY "Solo utenti autenticati possono creare log"
    ON activity_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Inserisci dati di esempio se le tabelle sono vuote
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM rule_sections LIMIT 1) THEN
        -- Inserisci sezioni di esempio
        INSERT INTO rule_sections (title, description, icon, order_index) VALUES
        ('Regole Generali', 'Regole fondamentali del server', 'Shield', 1),
        ('Roleplay', 'Linee guida per il gioco di ruolo', 'Users', 2),
        ('Comportamento', 'Norme di comportamento nella comunità', 'Heart', 3),
        ('Sanzioni', 'Sistema sanzionatorio del server', 'AlertTriangle', 4);

        -- Inserisci regole di esempio
        INSERT INTO rules (section_id, title, content, order_index)
        SELECT 
            s.id,
            CASE 
                WHEN s.title = 'Regole Generali' AND r.rn = 1 THEN 'Rispetto reciproco'
                WHEN s.title = 'Regole Generali' AND r.rn = 2 THEN 'Divieto di cheating'
                WHEN s.title = 'Roleplay' AND r.rn = 1 THEN 'Mantieni il personaggio'
                WHEN s.title = 'Roleplay' AND r.rn = 2 THEN 'Divieto di metagaming'
                WHEN s.title = 'Comportamento' AND r.rn = 1 THEN 'Linguaggio appropriato'
                WHEN s.title = 'Sanzioni' AND r.rn = 1 THEN 'Sistema di warning'
            END as title,
            CASE 
                WHEN s.title = 'Regole Generali' AND r.rn = 1 THEN '<p>Tutti i giocatori devono trattarsi con <strong>rispetto reciproco</strong>. Non sono tollerati insulti, discriminazioni o comportamenti offensivi di alcun tipo.</p><ul><li>Mantieni sempre un atteggiamento rispettoso</li><li>Evita linguaggio offensivo o discriminatorio</li><li>Rispetta le opinioni altrui</li></ul>'
                WHEN s.title = 'Regole Generali' AND r.rn = 2 THEN '<p>È <strong>severamente vietato</strong> l''uso di cheat, hack, mod non autorizzate o qualsiasi forma di vantaggio sleale.</p><blockquote>⚠️ <em>Qualsiasi forma di cheating comporta ban immediato e permanente</em></blockquote>'
                WHEN s.title = 'Roleplay' AND r.rn = 1 THEN '<p>Devi sempre rimanere <strong>nel personaggio (IC - In Character)</strong> durante il gioco. Evita riferimenti al mondo reale.</p><h4>Cosa significa:</h4><ul><li>Parla e agisci come il tuo personaggio</li><li>Non menzionare elementi esterni al gioco</li><li>Mantieni la coerenza del personaggio</li></ul>'
                WHEN s.title = 'Roleplay' AND r.rn = 2 THEN '<p>Non utilizzare informazioni ottenute <strong>fuori dal gioco (OOC)</strong> per avvantaggiarti nel roleplay.</p><p>Esempi di metagaming:</p><ul><li>Usare informazioni da Discord nel gioco</li><li>Conoscere nomi senza presentazioni IC</li><li>Agire su informazioni non ottenute in gioco</li></ul>'
                WHEN s.title = 'Comportamento' AND r.rn = 1 THEN '<p>Utilizza un <strong>linguaggio appropriato</strong> in tutte le chat. Evita spam, caps lock eccessivo e messaggi ripetitivi.</p><div style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid #22c55e; padding: 12px; margin: 16px 0;"><strong>💡 Ricorda:</strong> Una comunicazione pulita rende l''esperienza migliore per tutti! 🌴</div>'
                WHEN s.title = 'Sanzioni' AND r.rn = 1 THEN '<p>Il server utilizza un <strong>sistema di warning progressivo</strong> per gestire le infrazioni.</p><h4>🎯 Sistema:</h4><ol><li><strong>1° Warning:</strong> Richiamo verbale</li><li><strong>2° Warning:</strong> Kick temporaneo</li><li><strong>3° Warning:</strong> Ban temporaneo (24h)</li><li><strong>4° Warning:</strong> Ban permanente</li></ol><p><em>Le infrazioni gravi possono comportare ban immediato</em></p>'
            END as content,
            r.rn as order_index
        FROM rule_sections s
        CROSS JOIN (
            SELECT 1 as rn UNION SELECT 2 
            UNION SELECT 3 WHERE EXISTS (SELECT 1 FROM rule_sections WHERE title IN ('Roleplay', 'Comportamento', 'Sanzioni'))
        ) r
        WHERE (s.title = 'Regole Generali' AND r.rn <= 2)
           OR (s.title = 'Roleplay' AND r.rn <= 2)
           OR (s.title = 'Comportamento' AND r.rn = 1)
           OR (s.title = 'Sanzioni' AND r.rn = 1);
    END IF;
END $$;