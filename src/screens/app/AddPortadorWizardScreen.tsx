import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { AppStackParamList } from '../../types';
import { Button, Input, Card, DatePicker, SearchableDropdown } from '../../components/common';
import { COUNTRIES } from '../../constants/countries';
import { LANGUAGES } from '../../constants/languages';
import { createPortador, createOrUpdateInfoMedica, createContactoEmergencia, getCurrentAdminId } from '../../services/database';

type AddPortadorNavigationProp = NativeStackNavigationProp<AppStackParamList, 'AddPortadorWizard'>;

interface PortadorFormData {
  // Step 1: Identidad
  first_name: string;
  last_name: string;
  birth_date: string;
  sex_biological: 'male' | 'female' | 'other';
  nationality: string;
  primary_language: string;
  secondary_language: string;
  photo_url?: string;
  
  // Step 2: Médico crítico
  blood_type: string;
  insurance_type: string;
  insurer_contact: string;
  allergies: string[];
  medical_conditions: string[];
  permanent_medications: string[];
  
  // Step 3: Contactos de emergencia
  emergency_contacts: Array<{
    full_name: string;
    relation: string;
    phone: string;
    priority: 1 | 2;
  }>;
  
  // Step 4: Psicológico
  psychological_conditions: string;
  crisis_triggers: string;
  crisis_behavior: string;
  crisis_recommendations: string;
  emotional_support: Array<{
    full_name: string;
    relation: string;
    phone: string;
  }>;
}

const AddPortadorWizardScreen: React.FC = () => {
  const navigation = useNavigation<AddPortadorNavigationProp>();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PortadorFormData>({
    first_name: '',
    last_name: '',
    birth_date: '',
    sex_biological: 'male',
    nationality: '',
    primary_language: '',
    secondary_language: '',
    blood_type: '',
    insurance_type: '',
    insurer_contact: '',
    allergies: [],
    medical_conditions: [],
    permanent_medications: [],
    emergency_contacts: [],
    psychological_conditions: '',
    crisis_triggers: '',
    crisis_behavior: '',
    crisis_recommendations: '',
    emotional_support: [],
  });

  const steps = [
    { id: 1, title: 'Identidad', description: 'Información básica del portador' },
    { id: 2, title: 'Médico Crítico', description: 'Datos médicos esenciales' },
    { id: 3, title: 'Contactos', description: 'Contactos de emergencia' },
    { id: 4, title: 'Psicológico', description: 'Apoyo emocional y crisis' },
  ];

  const updateFormData = (field: keyof PortadorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.birth_date) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const adminId = await getCurrentAdminId();
      
      // Generate QR token
      const qrToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Create portador
      const portadorData = {
        admin_id: adminId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        birth_date: formData.birth_date,
        sex_biological: formData.sex_biological,
        nationality: formData.nationality,
        primary_language: formData.primary_language,
        secondary_language: formData.secondary_language || undefined,
        lifeband_status: 'active' as const,
        qr_token: qrToken,
        public_access_enabled: true,
      };

      const newPortador = await createPortador(portadorData);

      // Create medical info if provided
      if (formData.blood_type || formData.insurance_type || formData.insurer_contact) {
        const infoMedicaData = {
          portador_id: newPortador.id,
          blood_type: formData.blood_type,
          insurance_type: formData.insurance_type || undefined,
          insurer_contact: formData.insurer_contact || undefined,
        };
        await createOrUpdateInfoMedica(infoMedicaData);
      }

      // Create emergency contacts if provided
      for (const contact of formData.emergency_contacts) {
        if (contact.full_name && contact.phone) {
          const contactoData = {
            portador_id: newPortador.id,
            full_name: contact.full_name,
            relation: contact.relation,
            phone: contact.phone,
            priority: contact.priority,
          };
          await createContactoEmergencia(contactoData);
        }
      }

      Alert.alert('Éxito', 'Portador creado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating portador:', error);
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', message || 'No se pudo crear el portador. Por favor intenta nuevamente.');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Información de Identidad</Text>
      
      <Input
        label="Nombre *"
        value={formData.first_name}
        onChangeText={(value) => updateFormData('first_name', value)}
        placeholder="Nombre del portador"
      />

      <Input
        label="Apellido *"
        value={formData.last_name}
        onChangeText={(value) => updateFormData('last_name', value)}
        placeholder="Apellido del portador"
      />

      <DatePicker
        label="Fecha de Nacimiento *"
        value={formData.birth_date}
        onChange={(value) => updateFormData('birth_date', value)}
        placeholder="Seleccionar fecha de nacimiento"
      />

      <View style={styles.formGroup}>
        <Text style={styles.label}>Sexo Biológico</Text>
        <View style={styles.radioGroup}>
          {['male', 'female', 'other'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.radioButton,
                formData.sex_biological === option && styles.radioButtonSelected,
              ]}
              onPress={() => updateFormData('sex_biological', option as any)}
            >
              <Text style={[
                styles.radioText,
                formData.sex_biological === option && styles.radioTextSelected,
              ]}>
                {option === 'male' ? 'Masculino' : option === 'female' ? 'Femenino' : 'Otro'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <SearchableDropdown
        label="País *"
        value={formData.nationality}
        onChange={(value) => updateFormData('nationality', value)}
        options={COUNTRIES}
        placeholder="Seleccionar país"
      />

      <SearchableDropdown
        label="Idioma Principal *"
        value={formData.primary_language}
        onChange={(value) => updateFormData('primary_language', value)}
        options={LANGUAGES}
        placeholder="Seleccionar idioma principal"
      />

      <SearchableDropdown
        label="Idioma Secundario"
        value={formData.secondary_language}
        onChange={(value) => updateFormData('secondary_language', value)}
        options={LANGUAGES}
        placeholder="Seleccionar idioma secundario (opcional)"
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Información Médica Crítica</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Tipo de Sangre *</Text>
        <TextInput
          style={styles.input}
          value={formData.blood_type}
          onChangeText={(value) => updateFormData('blood_type', value)}
          placeholder="Ej: O+, A-, B+, AB-"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tipo de Seguro</Text>
        <TextInput
          style={styles.input}
          value={formData.insurance_type}
          onChangeText={(value) => updateFormData('insurance_type', value)}
          placeholder="Tipo de seguro médico"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contacto del Seguro</Text>
        <TextInput
          style={styles.input}
          value={formData.insurer_contact}
          onChangeText={(value) => updateFormData('insurer_contact', value)}
          placeholder="Teléfono o contacto del seguro"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Alergias (separadas por comas)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.allergies.join(', ')}
          onChangeText={(value) => updateFormData('allergies', value.split(',').map(a => a.trim()).filter(Boolean))}
          placeholder="Penicilina, Látex, Maníes..."
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Condiciones Médicas (separadas por comas)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.medical_conditions.join(', ')}
          onChangeText={(value) => updateFormData('medical_conditions', value.split(',').map(c => c.trim()).filter(Boolean))}
          placeholder="Diabetes, Hipertensión, Asma..."
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Medicamentos Permanentes (separados por comas)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.permanent_medications.join(', ')}
          onChangeText={(value) => updateFormData('permanent_medications', value.split(',').map(m => m.trim()).filter(Boolean))}
          placeholder="Insulina, Metformina, Lisinopril..."
          multiline
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Contactos de Emergencia</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Contacto 1 (Prioridad Alta)</Text>
        <TextInput
          style={styles.input}
          value={formData.emergency_contacts[0]?.full_name || ''}
          onChangeText={(value) => {
            const contacts = [...formData.emergency_contacts];
            if (contacts[0]) {
              contacts[0].full_name = value;
            } else {
              contacts[0] = { full_name: value, relation: '', phone: '', priority: 1 };
            }
            updateFormData('emergency_contacts', contacts);
          }}
          placeholder="Nombre completo"
        />
        <TextInput
          style={styles.input}
          value={formData.emergency_contacts[0]?.relation || ''}
          onChangeText={(value) => {
            const contacts = [...formData.emergency_contacts];
            if (contacts[0]) {
              contacts[0].relation = value;
            } else {
              contacts[0] = { full_name: '', relation: value, phone: '', priority: 1 };
            }
            updateFormData('emergency_contacts', contacts);
          }}
          placeholder="Relación (Padre, Madre, Esposo/a...)"
        />
        <TextInput
          style={styles.input}
          value={formData.emergency_contacts[0]?.phone || ''}
          onChangeText={(value) => {
            const contacts = [...formData.emergency_contacts];
            if (contacts[0]) {
              contacts[0].phone = value;
            } else {
              contacts[0] = { full_name: '', relation: '', phone: value, priority: 1 };
            }
            updateFormData('emergency_contacts', contacts);
          }}
          placeholder="Teléfono"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contacto 2 (Prioridad Media)</Text>
        <TextInput
          style={styles.input}
          value={formData.emergency_contacts[1]?.full_name || ''}
          onChangeText={(value) => {
            const contacts = [...formData.emergency_contacts];
            if (contacts[1]) {
              contacts[1].full_name = value;
            } else {
              contacts[1] = { full_name: value, relation: '', phone: '', priority: 2 };
            }
            updateFormData('emergency_contacts', contacts);
          }}
          placeholder="Nombre completo"
        />
        <TextInput
          style={styles.input}
          value={formData.emergency_contacts[1]?.relation || ''}
          onChangeText={(value) => {
            const contacts = [...formData.emergency_contacts];
            if (contacts[1]) {
              contacts[1].relation = value;
            } else {
              contacts[1] = { full_name: '', relation: value, phone: '', priority: 2 };
            }
            updateFormData('emergency_contacts', contacts);
          }}
          placeholder="Relación"
        />
        <TextInput
          style={styles.input}
          value={formData.emergency_contacts[1]?.phone || ''}
          onChangeText={(value) => {
            const contacts = [...formData.emergency_contacts];
            if (contacts[1]) {
              contacts[1].phone = value;
            } else {
              contacts[1] = { full_name: '', relation: '', phone: value, priority: 2 };
            }
            updateFormData('emergency_contacts', contacts);
          }}
          placeholder="Teléfono"
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Apoyo Psicológico y Crisis</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Condiciones Psicológicas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.psychological_conditions}
          onChangeText={(value) => updateFormData('psychological_conditions', value)}
          placeholder="Ansiedad, Depresión, TDAH, Autismo..."
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Disparadores de Crisis</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.crisis_triggers}
          onChangeText={(value) => updateFormData('crisis_triggers', value)}
          placeholder="Ruidos fuertes, multitudes, cambios de rutina..."
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Comportamiento en Crisis</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.crisis_behavior}
          onChangeText={(value) => updateFormData('crisis_behavior', value)}
          placeholder="Se retrae, se agita, verbaliza incomodidad..."
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Recomendaciones de Comunicación</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.crisis_recommendations}
          onChangeText={(value) => updateFormData('crisis_recommendations', value)}
          placeholder="Hablar en tono bajo, ofrecer espacio, usar frases específicas..."
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Apoyo Emocional</Text>
        <TextInput
          style={styles.input}
          value={formData.emotional_support[0]?.full_name || ''}
          onChangeText={(value) => {
            const support = [...formData.emotional_support];
            if (support[0]) {
              support[0].full_name = value;
            } else {
              support[0] = { full_name: value, relation: '', phone: '' };
            }
            updateFormData('emotional_support', support);
          }}
          placeholder="Nombre del contacto de apoyo"
        />
        <TextInput
          style={styles.input}
          value={formData.emotional_support[0]?.relation || ''}
          onChangeText={(value) => {
            const support = [...formData.emotional_support];
            if (support[0]) {
              support[0].relation = value;
            } else {
              support[0] = { full_name: '', relation: value, phone: '' };
            }
            updateFormData('emotional_support', support);
          }}
          placeholder="Relación"
        />
        <TextInput
          style={styles.input}
          value={formData.emotional_support[0]?.phone || ''}
          onChangeText={(value) => {
            const support = [...formData.emotional_support];
            if (support[0]) {
              support[0].phone = value;
            } else {
              support[0] = { full_name: '', relation: '', phone: value };
            }
            updateFormData('emotional_support', support);
          }}
          placeholder="Teléfono"
        />
      </View>
    </View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBackText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Agregar Portador</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.dashboardButton}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        {steps.map((step) => (
          <View
            key={step.id}
            style={[
              styles.progressStep,
              currentStep === step.id && styles.activeStep,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep === step.id && styles.activeStepNumber,
              ]}
            >
              {step.id}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.stepInfo}>
          <Text style={styles.stepTitle}>{steps[currentStep - 1].title}</Text>
          <Text style={styles.stepDescription}>{steps[currentStep - 1].description}</Text>
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={prevStep}
            disabled={currentStep === 1}
          >
            <Text style={styles.backButtonText}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={nextStep}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 4 ? 'Guardar' : 'Siguiente'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBackText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  title: {
    ...Typography.heading,
    color: Colors.text,
  },
  dashboardButton: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  activeStep: {},
  stepNumber: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  activeStepNumber: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  stepContent: {
    paddingBottom: Spacing.xl,
  },
  stepTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  stepDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.card,
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card,
  },
  radioButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  radioText: {
    ...Typography.body,
    color: Colors.text,
  },
  radioTextSelected: {
    color: Colors.background,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  stepInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  navButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextButton: {
    backgroundColor: Colors.primary,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  nextButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
});

export default AddPortadorWizardScreen;
