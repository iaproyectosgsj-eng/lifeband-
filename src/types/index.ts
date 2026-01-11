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

export interface InfoMedica {
  id: string;
  portador_id: string;
  blood_type: string;
  insurance_type?: string;
  insurer_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface Alergia {
  id: string;
  infomedica_id: string;
  allergy: string;
  treatment: string;
  created_at: string;
  updated_at: string;
}

export interface CondicionMedica {
  id: string;
  infomedica_id: string;
  condition: string;
  treatment: string;
  created_at: string;
  updated_at: string;
}

export interface MedicamentoPermanente {
  id: string;
  infomedica_id: string;
  medication: string;
  dose: string;
  recurrence: string;
  created_at: string;
  updated_at: string;
}

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

export interface ApoyoEmocional {
  id: string;
  infomedica_id: string;
  full_name: string;
  relation: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CondicionPsicologica {
  id: string;
  infomedica_id: string;
  condition: string;
  created_at: string;
  updated_at: string;
}

export interface CrisisSensibilidad {
  id: string;
  infomedica_id: string;
  trigger: string;
  behavior: string;
  recommendations: string;
  created_at: string;
  updated_at: string;
}

export interface HistorialQuirurgico {
  id: string;
  infomedica_id: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ContactoMedico {
  id: string;
  infomedica_id: string;
  full_name: string;
  specialty: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface AntecedentesMedicos {
  id: string;
  infomedica_id: string;
  record: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface DispositivosImplantados {
  id: string;
  infomedica_id: string;
  device: string;
  implanted_at: string;
  created_at: string;
  updated_at: string;
}

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

export interface AuthState {
  user: Admin | null;
  session: any | null;
  loading: boolean;
}

export interface RootStackParamList {
  AuthStack: undefined;
  AppStack: undefined;
}

export interface AuthStackParamList {
  Login: undefined;
  RegisterStep1: undefined;
  RegisterStep2: { email: string };
  [key: string]: any;
}

export interface AppStackParamList {
  Dashboard: undefined;
  PortadorDetail: { portadorId: string };
  AddPortadorWizard: undefined;
  EditPortadorWizard: { portadorId: string };
  Subscription: { portadorId: string };
  Settings: undefined;
  [key: string]: any;
}
