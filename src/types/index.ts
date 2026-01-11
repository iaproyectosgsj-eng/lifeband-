// Admin profile stored in Supabase `admins`.
export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at?: string;
  password_hash: string;
  status: 'active' | 'suspended' | 'deleted';
  last_login_at?: string;
  country: string;
  phone?: string;
  language: string;
  last_password_change_at?: string;
  created_at: string;
  updated_at: string;
}

// Portador (wearer) managed by the admin.
export interface Portador {
  id: string;
  admin_id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  sex_biological: 'male' | 'female' | 'other';
  nationality: string;
  primary_language: string;
  secondary_language?: string;
  lifeband_status: 'active' | 'suspended' | 'lost';
  photo_url?: string;
  qr_token: string;
  nfc_uid?: string;
  public_access_enabled: boolean;
  public_pdf_url?: string;
  public_pdf_updated_at?: string;
  created_at: string;
  updated_at: string;
}

// Medical info header (1:1 with portador).
export interface InfoMedica {
  id: string;
  portador_id: string;
  blood_type: string;
  insurance_type?: string;
  insurer_contact?: string;
  created_at: string;
  updated_at: string;
}

// Allergy item (1:N with info_medica).
export interface Alergia {
  id: string;
  infomedica_id: string;
  allergy: string;
  treatment: string;
  created_at: string;
  updated_at: string;
}

// Medical condition item (1:N with info_medica).
export interface CondicionMedica {
  id: string;
  infomedica_id: string;
  condition: string;
  treatment: string;
  created_at: string;
  updated_at: string;
}

// Long-term medication item (1:N with info_medica).
export interface MedicamentoPermanente {
  id: string;
  infomedica_id: string;
  medication: string;
  dose: string;
  recurrence: string;
  created_at: string;
  updated_at: string;
}

// Emergency contact (1:N with portador).
export interface ContactoEmergencia {
  id: string;
  portador_id: string;
  full_name: string;
  relation: string;
  phone: string;
  priority: 1 | 2;
  created_at: string;
  updated_at: string;
}

// Emotional support contact (1:N with info_medica).
export interface ApoyoEmocional {
  id: string;
  infomedica_id: string;
  full_name: string;
  relation: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

// Psychological condition item (1:N with info_medica).
export interface CondicionPsicologica {
  id: string;
  infomedica_id: string;
  condition: string;
  created_at: string;
  updated_at: string;
}

// Crisis trigger/sensitivity item (1:N with info_medica).
export interface CrisisSensibilidad {
  id: string;
  infomedica_id: string;
  trigger: string;
  behavior: string;
  recommendations: string;
  created_at: string;
  updated_at: string;
}

// Surgical history item (1:N with info_medica).
export interface HistorialQuirurgico {
  id: string;
  infomedica_id: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

// Medical contact item (1:N with info_medica).
export interface ContactoMedico {
  id: string;
  infomedica_id: string;
  full_name: string;
  specialty: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

// Medical record item (1:N with info_medica).
export interface AntecedentesMedicos {
  id: string;
  infomedica_id: string;
  record: string;
  date: string;
  created_at: string;
  updated_at: string;
}

// Implanted device item (1:N with info_medica).
export interface DispositivosImplantados {
  id: string;
  infomedica_id: string;
  device: string;
  implanted_at: string;
  created_at: string;
  updated_at: string;
}

// Per-portador subscription.
export interface SubscriptionPortador {
  id: string;
  admin_id: string;
  portador_id: string;
  plan: 'annual';
  status: 'active' | 'past_due' | 'canceled';
  provider_customer_id?: string;
  provider_subscription_id?: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

// Auth state used by AppNavigator.
export interface AuthState {
  user: Admin | null;
  session: any | null;
  loading: boolean;
}

// Root navigator params.
export interface RootStackParamList {
  AuthStack: undefined;
  AppStack: undefined;
}

// Auth stack route params.
export interface AuthStackParamList {
  Login: undefined;
  RegisterStep1: undefined;
  RegisterStep2: { email: string; password: string; fullName: string };
  [key: string]: any;
}

// App stack route params.
export interface AppStackParamList {
  Dashboard: undefined;
  PortadorDetail: { portadorId: string };
  AddPortadorWizard: undefined;
  EditPortadorWizard: { portadorId: string };
  Subscription: { portadorId: string };
  Settings: undefined;
  [key: string]: any;
}
