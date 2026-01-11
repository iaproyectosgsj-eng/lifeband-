import { supabase } from './supabase';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { 
  Admin, 
  Portador, 
  InfoMedica, 
  ContactoEmergencia,
  Alergia,
  CondicionMedica,
  MedicamentoPermanente,
  HistorialQuirurgico,
  ContactoMedico,
  AntecedentesMedicos,
  DispositivosImplantados,
  CondicionPsicologica,
  CrisisSensibilidad,
  ApoyoEmocional
} from '../types';

const LOCAL_ADMIN_ID_KEY = 'lifeband_local_admin_id';
const LOCAL_ADMINS_KEY = 'lifeband_admins';
const LOCAL_PORTADORES_KEY = 'lifeband_portadores';
const LOCAL_INFO_MEDICA_KEY = 'lifeband_info_medica';
const LOCAL_CONTACTOS_EMERGENCIA_KEY = 'lifeband_contactos_emergencia';

const memoryStore = new Map<string, string>();

const storageGetItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      const ls = (globalThis as any)?.localStorage;
      const value = ls ? (ls.getItem(key) as string | null) : null;
      if (value != null) memoryStore.set(key, value);
      return value ?? memoryStore.get(key) ?? null;
    } catch {
      return memoryStore.get(key) ?? null;
    }
  }

  try {
    const value = await SecureStore.getItemAsync(key);
    if (value != null) memoryStore.set(key, value);
    return value ?? memoryStore.get(key) ?? null;
  } catch {
    return memoryStore.get(key) ?? null;
  }
};

const storageSetItem = async (key: string, value: string): Promise<void> => {
  memoryStore.set(key, value);
  if (Platform.OS === 'web') {
    try {
      const ls = (globalThis as any)?.localStorage;
      if (ls) ls.setItem(key, value);
    } catch {
      // ignore
    }
    return;
  }

  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // ignore
  }
};

const isSupabaseConfigured = () => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('your-project.supabase.co')) return false;
  if (key === 'your-anon-key') return false;
  return true;
};

const getLocalJson = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await storageGetItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const setLocalJson = async (key: string, value: any) => {
  await storageSetItem(key, JSON.stringify(value));
};

const generateLocalId = (prefix: string) => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const getCurrentAdminId = async (): Promise<string> => {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (session?.user?.id) return session.user.id;
  } catch {
    // ignore
  }

  const existing = await storageGetItem(LOCAL_ADMIN_ID_KEY);
  if (existing) return existing;

  const id = generateLocalId('local_admin');
  await storageSetItem(LOCAL_ADMIN_ID_KEY, id);
  return id;
};

// Admin operations
export const getAdminProfile = async (adminId: string): Promise<Admin | null> => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single();
    
    if (error) throw error;
    return data;
  }

  const all = await getLocalJson<Admin[]>(LOCAL_ADMINS_KEY, []);
  return all.find((a) => a.id === adminId) || null;
};

 export const updateAdminProfile = async (adminId: string, updates: Partial<Admin>) => {
   if (isSupabaseConfigured()) {
     const { data, error } = await supabase
       .from('admins')
       .update(updates)
       .eq('id', adminId)
       .select()
       .single();
 
     if (error) throw error;
     return data;
   }

   const all = await getLocalJson<Admin[]>(LOCAL_ADMINS_KEY, []);
   const now = new Date().toISOString();
   const existing = all.find((a) => a.id === adminId);
   const nextRecord: Admin = existing
     ? ({ ...existing, ...updates, updated_at: now } as Admin)
     : ({ id: adminId, ...updates, created_at: now, updated_at: now } as Admin);

   const next = existing
     ? all.map((a) => (a.id === adminId ? nextRecord : a))
     : [nextRecord, ...all];
   await setLocalJson(LOCAL_ADMINS_KEY, next);
   return nextRecord;
 };

// Portador operations
export const getPortadores = async (adminId: string): Promise<Portador[]> => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('portadores')
      .select('*')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  const all = await getLocalJson<Portador[]>(LOCAL_PORTADORES_KEY, []);
  return all
    .filter((p) => p.admin_id === adminId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
};

export const getPortador = async (portadorId: string): Promise<Portador | null> => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('portadores')
      .select('*')
      .eq('id', portadorId)
      .single();
    
    if (error) throw error;
    return data;
  }

  const all = await getLocalJson<Portador[]>(LOCAL_PORTADORES_KEY, []);
  return all.find((p) => p.id === portadorId) || null;
};

export const createPortador = async (portador: Omit<Portador, 'id' | 'created_at' | 'updated_at'>) => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('portadores')
      .insert(portador)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  const now = new Date().toISOString();
  const record: Portador = {
    id: generateLocalId('portador'),
    ...portador,
    created_at: now,
    updated_at: now,
  } as Portador;

  const all = await getLocalJson<Portador[]>(LOCAL_PORTADORES_KEY, []);
  const next = [record, ...all];
  await setLocalJson(LOCAL_PORTADORES_KEY, next);
  return record;
};

export const updatePortador = async (portadorId: string, updates: Partial<Portador>) => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('portadores')
      .update(updates)
      .eq('id', portadorId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  const all = await getLocalJson<Portador[]>(LOCAL_PORTADORES_KEY, []);
  const now = new Date().toISOString();
  const next = all.map((p) => (p.id === portadorId ? { ...p, ...updates, updated_at: now } : p));
  await setLocalJson(LOCAL_PORTADORES_KEY, next);
  return next.find((p) => p.id === portadorId) || null;
};

export const deletePortador = async (portadorId: string) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('portadores')
      .delete()
      .eq('id', portadorId);
    
    if (error) throw error;
    return;
  }

  const all = await getLocalJson<Portador[]>(LOCAL_PORTADORES_KEY, []);
  const next = all.filter((p) => p.id !== portadorId);
  await setLocalJson(LOCAL_PORTADORES_KEY, next);
};

// Info Médica operations
export const getInfoMedica = async (portadorId: string): Promise<InfoMedica | null> => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('info_medica')
      .select('*')
      .eq('portador_id', portadorId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  const all = await getLocalJson<InfoMedica[]>(LOCAL_INFO_MEDICA_KEY, []);
  return all.find((i) => i.portador_id === portadorId) || null;
};

export const createOrUpdateInfoMedica = async (infoMedica: Omit<InfoMedica, 'id' | 'created_at' | 'updated_at'>) => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('info_medica')
      .upsert(infoMedica, {
        onConflict: 'portador_id',
        ignoreDuplicates: false
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  const all = await getLocalJson<InfoMedica[]>(LOCAL_INFO_MEDICA_KEY, []);
  const now = new Date().toISOString();
  const existing = all.find((i) => i.portador_id === infoMedica.portador_id);
  const nextRecord: InfoMedica = existing
    ? ({ ...existing, ...infoMedica, updated_at: now } as InfoMedica)
    : ({ id: generateLocalId('infomedica'), ...infoMedica, created_at: now, updated_at: now } as InfoMedica);

  const next = existing
    ? all.map((i) => (i.portador_id === infoMedica.portador_id ? nextRecord : i))
    : [nextRecord, ...all];
  await setLocalJson(LOCAL_INFO_MEDICA_KEY, next);
  return nextRecord;
};

// Contactos de Emergencia operations
export const getContactosEmergencia = async (portadorId: string): Promise<ContactoEmergencia[]> => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('contactos_emergencia')
      .select('*')
      .eq('portador_id', portadorId)
      .order('priority', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  const all = await getLocalJson<ContactoEmergencia[]>(LOCAL_CONTACTOS_EMERGENCIA_KEY, []);
  return all
    .filter((c) => c.portador_id === portadorId)
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
};

export const createContactoEmergencia = async (contacto: Omit<ContactoEmergencia, 'id' | 'created_at' | 'updated_at'>) => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('contactos_emergencia')
      .insert(contacto)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  const now = new Date().toISOString();
  const record: ContactoEmergencia = {
    id: generateLocalId('contacto_emergencia'),
    ...contacto,
    created_at: now,
    updated_at: now,
  } as ContactoEmergencia;

  const all = await getLocalJson<ContactoEmergencia[]>(LOCAL_CONTACTOS_EMERGENCIA_KEY, []);
  const next = [record, ...all];
  await setLocalJson(LOCAL_CONTACTOS_EMERGENCIA_KEY, next);
  return record;
};

export const updateContactoEmergencia = async (contactoId: string, updates: Partial<ContactoEmergencia>) => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('contactos_emergencia')
      .update(updates)
      .eq('id', contactoId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  const all = await getLocalJson<ContactoEmergencia[]>(LOCAL_CONTACTOS_EMERGENCIA_KEY, []);
  const now = new Date().toISOString();
  const next = all.map((c) => (c.id === contactoId ? { ...c, ...updates, updated_at: now } : c));
  await setLocalJson(LOCAL_CONTACTOS_EMERGENCIA_KEY, next);
  return next.find((c) => c.id === contactoId) || null;
};

export const deleteContactoEmergencia = async (contactoId: string) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('contactos_emergencia')
      .delete()
      .eq('id', contactoId);
    
    if (error) throw error;
    return;
  }

  const all = await getLocalJson<ContactoEmergencia[]>(LOCAL_CONTACTOS_EMERGENCIA_KEY, []);
  const next = all.filter((c) => c.id !== contactoId);
  await setLocalJson(LOCAL_CONTACTOS_EMERGENCIA_KEY, next);
};

// PDF generation trigger
export const triggerPdfGeneration = async (portadorId: string) => {
  const { data, error } = await supabase.functions.invoke('generate-pdf', {
    body: { portadorId },
  });
  
  if (error) throw error;
  return data;
};

// Alergias operations
export const getAlergias = async (infoMedicaId: string): Promise<Alergia[]> => {
  const { data, error } = await supabase
    .from('alergias')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createAlergia = async (alergia: Omit<Alergia, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('alergias')
    .insert(alergia)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateAlergia = async (alergiaId: string, updates: Partial<Alergia>) => {
  const { data, error } = await supabase
    .from('alergias')
    .update(updates)
    .eq('id', alergiaId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteAlergia = async (alergiaId: string) => {
  const { error } = await supabase
    .from('alergias')
    .delete()
    .eq('id', alergiaId);
  
  if (error) throw error;
};

// Condiciones Médicas operations
export const getCondicionesMedicas = async (infoMedicaId: string): Promise<CondicionMedica[]> => {
  const { data, error } = await supabase
    .from('condiciones_medicas')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createCondicionMedica = async (condicion: Omit<CondicionMedica, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('condiciones_medicas')
    .insert(condicion)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCondicionMedica = async (condicionId: string, updates: Partial<CondicionMedica>) => {
  const { data, error } = await supabase
    .from('condiciones_medicas')
    .update(updates)
    .eq('id', condicionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCondicionMedica = async (condicionId: string) => {
  const { error } = await supabase
    .from('condiciones_medicas')
    .delete()
    .eq('id', condicionId);
  
  if (error) throw error;
};

// Medicamentos Permanentes operations
export const getMedicamentosPermanentes = async (infoMedicaId: string): Promise<MedicamentoPermanente[]> => {
  const { data, error } = await supabase
    .from('medicamentos_permanentes')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createMedicamentoPermanente = async (medicamento: Omit<MedicamentoPermanente, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('medicamentos_permanentes')
    .insert(medicamento)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateMedicamentoPermanente = async (medicamentoId: string, updates: Partial<MedicamentoPermanente>) => {
  const { data, error } = await supabase
    .from('medicamentos_permanentes')
    .update(updates)
    .eq('id', medicamentoId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteMedicamentoPermanente = async (medicamentoId: string) => {
  const { error } = await supabase
    .from('medicamentos_permanentes')
    .delete()
    .eq('id', medicamentoId);
  
  if (error) throw error;
};

// Historial Quirúrgico operations
export const getHistorialQuirurgico = async (infoMedicaId: string): Promise<HistorialQuirurgico[]> => {
  const { data, error } = await supabase
    .from('historial_quirurgico')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createHistorialQuirurgico = async (historial: Omit<HistorialQuirurgico, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('historial_quirurgico')
    .insert(historial)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateHistorialQuirurgico = async (historialId: string, updates: Partial<HistorialQuirurgico>) => {
  const { data, error } = await supabase
    .from('historial_quirurgico')
    .update(updates)
    .eq('id', historialId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteHistorialQuirurgico = async (historialId: string) => {
  const { error } = await supabase
    .from('historial_quirurgico')
    .delete()
    .eq('id', historialId);
  
  if (error) throw error;
};

// Contacto Médico operations
export const getContactosMedicos = async (infoMedicaId: string): Promise<ContactoMedico[]> => {
  const { data, error } = await supabase
    .from('contactos_medicos')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createContactoMedico = async (contacto: Omit<ContactoMedico, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('contactos_medicos')
    .insert(contacto)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateContactoMedico = async (contactoId: string, updates: Partial<ContactoMedico>) => {
  const { data, error } = await supabase
    .from('contactos_medicos')
    .update(updates)
    .eq('id', contactoId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteContactoMedico = async (contactoId: string) => {
  const { error } = await supabase
    .from('contactos_medicos')
    .delete()
    .eq('id', contactoId);
  
  if (error) throw error;
};

// Antecedentes Médicos operations
export const getAntecedentesMedicos = async (infoMedicaId: string): Promise<AntecedentesMedicos[]> => {
  const { data, error } = await supabase
    .from('antecedentes_medicos')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createAntecedenteMedico = async (antecedente: Omit<AntecedentesMedicos, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('antecedentes_medicos')
    .insert(antecedente)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateAntecedenteMedico = async (antecedenteId: string, updates: Partial<AntecedentesMedicos>) => {
  const { data, error } = await supabase
    .from('antecedentes_medicos')
    .update(updates)
    .eq('id', antecedenteId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteAntecedenteMedico = async (antecedenteId: string) => {
  const { error } = await supabase
    .from('antecedentes_medicos')
    .delete()
    .eq('id', antecedenteId);
  
  if (error) throw error;
};

// Dispositivos Implantados operations
export const getDispositivosImplantados = async (infoMedicaId: string): Promise<DispositivosImplantados[]> => {
  const { data, error } = await supabase
    .from('dispositivos_implantados')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('implanted_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createDispositivoImplantado = async (dispositivo: Omit<DispositivosImplantados, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('dispositivos_implantados')
    .insert(dispositivo)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateDispositivoImplantado = async (dispositivoId: string, updates: Partial<DispositivosImplantados>) => {
  const { data, error } = await supabase
    .from('dispositivos_implantados')
    .update(updates)
    .eq('id', dispositivoId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteDispositivoImplantado = async (dispositivoId: string) => {
  const { error } = await supabase
    .from('dispositivos_implantados')
    .delete()
    .eq('id', dispositivoId);
  
  if (error) throw error;
};

// Condiciones Psicológicas operations
export const getCondicionesPsicologicas = async (infoMedicaId: string): Promise<CondicionPsicologica[]> => {
  const { data, error } = await supabase
    .from('condiciones_psicologicas')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createCondicionPsicologica = async (condicion: Omit<CondicionPsicologica, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('condiciones_psicologicas')
    .insert(condicion)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCondicionPsicologica = async (condicionId: string, updates: Partial<CondicionPsicologica>) => {
  const { data, error } = await supabase
    .from('condiciones_psicologicas')
    .update(updates)
    .eq('id', condicionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCondicionPsicologica = async (condicionId: string) => {
  const { error } = await supabase
    .from('condiciones_psicologicas')
    .delete()
    .eq('id', condicionId);
  
  if (error) throw error;
};

// Crisis y Sensibilidades operations
export const getCrisisSensibilidades = async (infoMedicaId: string): Promise<CrisisSensibilidad[]> => {
  const { data, error } = await supabase
    .from('crisis_sensibilidades')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createCrisisSensibilidad = async (crisis: Omit<CrisisSensibilidad, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('crisis_sensibilidades')
    .insert(crisis)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCrisisSensibilidad = async (crisisId: string, updates: Partial<CrisisSensibilidad>) => {
  const { data, error } = await supabase
    .from('crisis_sensibilidades')
    .update(updates)
    .eq('id', crisisId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCrisisSensibilidad = async (crisisId: string) => {
  const { error } = await supabase
    .from('crisis_sensibilidades')
    .delete()
    .eq('id', crisisId);
  
  if (error) throw error;
};

// Apoyo Emocional operations
export const getApoyoEmocional = async (infoMedicaId: string): Promise<ApoyoEmocional[]> => {
  const { data, error } = await supabase
    .from('apoyo_emocional')
    .select('*')
    .eq('infomedica_id', infoMedicaId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createApoyoEmocional = async (apoyo: Omit<ApoyoEmocional, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('apoyo_emocional')
    .insert(apoyo)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateApoyoEmocional = async (apoyoId: string, updates: Partial<ApoyoEmocional>) => {
  const { data, error } = await supabase
    .from('apoyo_emocional')
    .update(updates)
    .eq('id', apoyoId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteApoyoEmocional = async (apoyoId: string) => {
  const { error } = await supabase
    .from('apoyo_emocional')
    .delete()
    .eq('id', apoyoId);
  
  if (error) throw error;
};
