import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { COUNTRIES } from '../../constants/countries';
import { LANGUAGES } from '../../constants/languages';
import { AuthStackParamList } from '../../types';
import { ensureAdminProfile, signUp } from '../../services';
import { SearchableDropdown } from '../../components/common';

type RegisterStep2RouteProp = RouteProp<AuthStackParamList, 'RegisterStep2'>;
type RegisterStep2NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterStep2'>;

// Registration step 2: credentials, country/language, consents.
const RegisterStep2Screen: React.FC = () => {
  const route = useRoute<RegisterStep2RouteProp>();
  const navigation = useNavigation<RegisterStep2NavigationProp>();
  const { email, firstName, lastName } = route.params;

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    country: '',
    language: '',
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMedicalData: false,
  });

  const [loading, setLoading] = useState(false);

  // Validate inputs and create Supabase user + admin profile.
  const handleRegister = async () => {
    if (!formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!formData.country) {
      Alert.alert('Error', 'Por favor selecciona tu país');
      return;
    }

    if (!formData.language) {
      Alert.alert('Error', 'Por favor selecciona tu idioma');
      return;
    }

    if (!formData.acceptTerms || !formData.acceptPrivacy || !formData.acceptMedicalData) {
      Alert.alert('Error', 'Debes aceptar todos los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(email, formData.password, {
        country: formData.country,
        language: formData.language,
        first_name: firstName,
        last_name: lastName,
        phone: '',
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        if (data?.user?.id) {
          await ensureAdminProfile({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email,
            password_hash: 'supabase_auth',
            status: 'active',
            country: formData.country,
            language: formData.language,
          });
        }
        Alert.alert(
          'Registro Exitoso',
          'Por favor revisa tu email para verificar tu cuenta',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  };

  // Update local form state.
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Completa tu registro</Text>
          <Text style={styles.subtitle}>Email: {email}</Text>

          <View style={styles.card}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirmar Contraseña *</Text>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                placeholder="Repite tu contraseña"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <SearchableDropdown
              label="País *"
              value={formData.country}
              onChange={(value) => updateFormData('country', value)}
              options={COUNTRIES}
              placeholder="Selecciona tu país"
            />

            <SearchableDropdown
              label="Idioma Preferido *"
              value={formData.language}
              onChange={(value) => updateFormData('language', value)}
              options={LANGUAGES}
              placeholder="Selecciona tu idioma"
            />

            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Consentimientos Obligatorios</Text>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => updateFormData('acceptTerms', !formData.acceptTerms)}
              >
                <View style={[styles.checkbox, formData.acceptTerms && styles.checkboxChecked]}>
                  {formData.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>
                  Acepto los Términos y Condiciones de Lifeband
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => updateFormData('acceptPrivacy', !formData.acceptPrivacy)}
              >
                <View style={[styles.checkbox, formData.acceptPrivacy && styles.checkboxChecked]}>
                  {formData.acceptPrivacy && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>
                  Acepto la Política de Privacidad y tratamiento de datos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => updateFormData('acceptMedicalData', !formData.acceptMedicalData)}
              >
                <View style={[styles.checkbox, formData.acceptMedicalData && styles.checkboxChecked]}>
                  {formData.acceptMedicalData && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>
                  Autorizo el manejo de información médica sensible de los portadores
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Registrando...' : 'Completar Registro'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Atrás</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.card,
    ...Typography.body,
    color: Colors.text,
  },
  termsSection: {
    marginBottom: Spacing.xl,
  },
  termsTitle: {
    ...Typography.subheading,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkboxText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.textLight,
  },
  registerButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.primary,
  },
});

export default RegisterStep2Screen;
