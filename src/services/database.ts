import { supabase } from './supabase';
import { Admin, Portador, InfoMedica, ContactoEmergencia } from '../types';

// Admin operations
export const getAdminProfile = async (adminId: string): Promise<Admin | null> => {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('id', adminId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateAdminProfile = async (adminId: string, updates: Partial<Admin>) => {
  const { data, error } = await supabase
    .from('admins')
    .update(updates)
    .eq('id', adminId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Portador operations
export const getPortadores = async (adminId: string): Promise<Portador[]> => {
  const { data, error } = await supabase
    .from('portadores')
    .select('*')
    .eq('admin_id', adminId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getPortador = async (portadorId: string): Promise<Portador | null> => {
  const { data, error } = await supabase
    .from('portadores')
    .select('*')
    .eq('id', portadorId)
    .single();
  
  if (error) throw error;
  return data;
};

export const createPortador = async (portador: Omit<Portador, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('portadores')
    .insert(portador)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePortador = async (portadorId: string, updates: Partial<Portador>) => {
  const { data, error } = await supabase
    .from('portadores')
    .update(updates)
    .eq('id', portadorId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePortador = async (portadorId: string) => {
  const { error } = await supabase
    .from('portadores')
    .delete()
    .eq('id', portadorId);
  
  if (error) throw error;
};

// Info Médica operations
export const getInfoMedica = async (portadorId: string): Promise<InfoMedica | null> => {
  const { data, error } = await supabase
    .from('info_medica')
    .select('*')
    .eq('portador_id', portadorId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data;
};

export const createOrUpdateInfoMedica = async (infoMedica: Omit<InfoMedica, 'id' | 'created_at' | 'updated_at'>) => {
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
};

// Contactos de Emergencia operations
export const getContactosEmergencia = async (portadorId: string): Promise<ContactoEmergencia[]> => {
  const { data, error } = await supabase
    .from('contactos_emergencia')
    .select('*')
    .eq('portador_id', portadorId)
    .order('priority', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const createContactoEmergencia = async (contacto: Omit<ContactoEmergencia, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('contactos_emergencia')
    .insert(contacto)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateContactoEmergencia = async (contactoId: string, updates: Partial<ContactoEmergencia>) => {
  const { data, error } = await supabase
    .from('contactos_emergencia')
    .update(updates)
    .eq('id', contactoId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteContactoEmergencia = async (contactoId: string) => {
  const { error } = await supabase
    .from('contactos_emergencia')
    .delete()
    .eq('id', contactoId);
  
  if (error) throw error;
};

// PDF generation trigger
export const triggerPdfGeneration = async (portadorId: string) => {
  const { data, error } = await supabase.functions.invoke('generate-pdf', {
    body: { portadorId },
  });
  
  if (error) throw error;
  return data;
};
