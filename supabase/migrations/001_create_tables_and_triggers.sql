-- 001_create_tables_and_triggers.sql
-- Create extensions, helper functions, tables and triggers for Lifeband

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  email_verified_at timestamptz,
  password_hash text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  last_login_at timestamptz,
  country text NOT NULL,
  phone text,
  language text NOT NULL,
  last_password_change_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER admins_set_updated_at
BEFORE UPDATE ON admins
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Portadores
CREATE TABLE IF NOT EXISTS portadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  birth_date date NOT NULL,
  sex_biological text NOT NULL,
  nationality text NOT NULL,
  primary_language text NOT NULL,
  secondary_language text,
  lifeband_status text NOT NULL DEFAULT 'active',
  photo_url text,
  qr_token text NOT NULL UNIQUE,
  nfc_uid text,
  public_access_enabled boolean NOT NULL DEFAULT false,
  public_pdf_url text,
  public_pdf_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER portadores_set_updated_at
BEFORE UPDATE ON portadores
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Info médica
CREATE TABLE IF NOT EXISTS info_medica (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portador_id uuid NOT NULL REFERENCES portadores(id) ON DELETE CASCADE,
  blood_type text NOT NULL,
  insurance_type text,
  insurer_contact text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER info_medica_set_updated_at
BEFORE UPDATE ON info_medica
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Alergias
CREATE TABLE IF NOT EXISTS alergias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  allergy text NOT NULL,
  treatment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER alergias_set_updated_at
BEFORE UPDATE ON alergias
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Condiciones médicas
CREATE TABLE IF NOT EXISTS condiciones_medicas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  condition text NOT NULL,
  treatment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER condiciones_medicas_set_updated_at
BEFORE UPDATE ON condiciones_medicas
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Medicamentos permanentes
CREATE TABLE IF NOT EXISTS medicamentos_permanentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  medication text NOT NULL,
  dose text,
  recurrence text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER medicamentos_permanentes_set_updated_at
BEFORE UPDATE ON medicamentos_permanentes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Historial quirúrgico
CREATE TABLE IF NOT EXISTS historial_quirurgico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  description text NOT NULL,
  date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER historial_quirurgico_set_updated_at
BEFORE UPDATE ON historial_quirurgico
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Contacto médico
CREATE TABLE IF NOT EXISTS contacto_medico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  specialty text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER contacto_medico_set_updated_at
BEFORE UPDATE ON contacto_medico
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Antecedentes medicos
CREATE TABLE IF NOT EXISTS antecedentes_medicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  record text NOT NULL,
  date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER antecedentes_medicos_set_updated_at
BEFORE UPDATE ON antecedentes_medicos
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Dispositivos implantados
CREATE TABLE IF NOT EXISTS dispositivos_implantados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  device text NOT NULL,
  implanted_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER dispositivos_implantados_set_updated_at
BEFORE UPDATE ON dispositivos_implantados
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Condiciones psicologicas
CREATE TABLE IF NOT EXISTS condiciones_psicologicas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  condition text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER condiciones_psicologicas_set_updated_at
BEFORE UPDATE ON condiciones_psicologicas
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Crisis y sensibilidades
CREATE TABLE IF NOT EXISTS crisis_sensibilidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  trigger text,
  behavior text,
  recommendations text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER crisis_sensibilidades_set_updated_at
BEFORE UPDATE ON crisis_sensibilidades
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Apoyo emocional
CREATE TABLE IF NOT EXISTS apoyo_emocional (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infomedica_id uuid NOT NULL REFERENCES info_medica(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  relation text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER apoyo_emocional_set_updated_at
BEFORE UPDATE ON apoyo_emocional
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Contactos de emergencia
CREATE TABLE IF NOT EXISTS contactos_emergencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portador_id uuid NOT NULL REFERENCES portadores(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  relation text,
  phone text NOT NULL,
  priority smallint NOT NULL DEFAULT 2,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER contactos_emergencia_set_updated_at
BEFORE UPDATE ON contactos_emergencia
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Subscription por portador
CREATE TABLE IF NOT EXISTS subscription_portador (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  portador_id uuid NOT NULL REFERENCES portadores(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'annual',
  status text NOT NULL DEFAULT 'active',
  provider_customer_id text,
  provider_subscription_id text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  auto_renew boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER subscription_portador_set_updated_at
BEFORE UPDATE ON subscription_portador
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portadores_admin_id ON portadores(admin_id);
CREATE INDEX IF NOT EXISTS idx_info_medica_portador_id ON info_medica(portador_id);
