-- 002_enable_rls_and_policies.sql
-- Enable Row Level Security and create policies aligned with the Lifeband rules

-- ADMINS: only the authenticated user matching admins.id can access their admin row
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins: self access" ON admins
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- PORTADORES: authenticated admins can CRUD only their portadores
ALTER TABLE portadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portadores: select" ON portadores
  FOR SELECT
  USING (admin_id = auth.uid());
CREATE POLICY "Portadores: insert" ON portadores
  FOR INSERT
  WITH CHECK (admin_id = auth.uid());
CREATE POLICY "Portadores: update" ON portadores
  FOR UPDATE
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());
CREATE POLICY "Portadores: delete" ON portadores
  FOR DELETE
  USING (admin_id = auth.uid());

-- INFO_MEDICA: only admin owning the portador can access
ALTER TABLE info_medica ENABLE ROW LEVEL SECURITY;
CREATE POLICY "InfoMedica: admin access" ON info_medica
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM portadores p WHERE p.id = portador_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portadores p WHERE p.id = portador_id AND p.admin_id = auth.uid()
    )
  );

-- Tables linked to info_medica: allow admin if the info_medica belongs to a portador of the admin
-- Alergias
ALTER TABLE alergias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Alergias: admin access" ON alergias
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = alergias.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = alergias.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Condiciones medicas
ALTER TABLE condiciones_medicas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CondicionesMedicas: admin access" ON condiciones_medicas
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = condiciones_medicas.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = condiciones_medicas.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Medicamentos permanentes
ALTER TABLE medicamentos_permanentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "MedicamentosPermanentes: admin access" ON medicamentos_permanentes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = medicamentos_permanentes.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = medicamentos_permanentes.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Historial quirurgico
ALTER TABLE historial_quirurgico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "HistorialQuirurgico: admin access" ON historial_quirurgico
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = historial_quirurgico.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = historial_quirurgico.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Contacto medico
ALTER TABLE contacto_medico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ContactoMedico: admin access" ON contacto_medico
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = contacto_medico.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = contacto_medico.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Antecedentes medicos
ALTER TABLE antecedentes_medicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AntecedentesMedicos: admin access" ON antecedentes_medicos
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = antecedentes_medicos.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = antecedentes_medicos.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Dispositivos implantados
ALTER TABLE dispositivos_implantados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "DispositivosImplantados: admin access" ON dispositivos_implantados
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = dispositivos_implantados.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = dispositivos_implantados.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Condiciones psicologicas
ALTER TABLE condiciones_psicologicas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CondicionesPsicologicas: admin access" ON condiciones_psicologicas
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = condiciones_psicologicas.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = condiciones_psicologicas.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Crisis sensibilidades
ALTER TABLE crisis_sensibilidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CrisisSensibilidades: admin access" ON crisis_sensibilidades
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = crisis_sensibilidades.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = crisis_sensibilidades.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Apoyo emocional
ALTER TABLE apoyo_emocional ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ApoyoEmocional: admin access" ON apoyo_emocional
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = apoyo_emocional.infomedica_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM info_medica im JOIN portadores p ON p.id = im.portador_id
      WHERE im.id = apoyo_emocional.infomedica_id AND p.admin_id = auth.uid()
    )
  );

-- Contactos de emergencia (tied to portador)
ALTER TABLE contactos_emergencia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ContactosEmergencia: admin access" ON contactos_emergencia
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM portadores p WHERE p.id = contactos_emergencia.portador_id AND p.admin_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portadores p WHERE p.id = contactos_emergencia.portador_id AND p.admin_id = auth.uid()
    )
  );

-- Subscription por portador
ALTER TABLE subscription_portador ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SubscriptionPortador: admin access" ON subscription_portador
  FOR ALL
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

-- NOTE: Do NOT create broad public policies here. Public/QR access should be implemented via a dedicated Edge Function or controlled view that enforces business rules (lifeband_status/public_access_enabled).
