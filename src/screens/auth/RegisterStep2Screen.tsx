import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { AuthStackParamList } from '../../types';
import { signUp } from '../../services';
import {
  Card,
  FieldInput,
  PrimaryButton,
  Toast,
  TopGradientHeader,
} from '../../components/common';
import { Feather } from '@expo/vector-icons';

type RegisterStep2RouteProp = RouteProp<AuthStackParamList, 'RegisterStep2'>;
type RegisterStep2NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterStep2'>;

const RegisterStep2Screen: React.FC = () => {
  const route = useRoute<RegisterStep2RouteProp>();
  const navigation = useNavigation<RegisterStep2NavigationProp>();
  const { email, password, fullName } = route.params;

  const [formData, setFormData] = useState({
    country: 'Chile',
    language: 'Español',
    renewalReminders: true,
    productNews: false,
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMedicalData: false,
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const hasToast = useMemo(() => toastMessage.length > 0, [toastMessage]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const countries = ['Chile', 'México', 'Colombia', 'Argentina'];
  const languages = ['Español', 'English', 'Português'];

  const handleRegister = async () => {
    if (!formData.acceptTerms || !formData.acceptPrivacy || !formData.acceptMedicalData) {
      showToast('Debes aceptar todos los consentimientos.');
      return;
    }

    setLoading(true);

    try {
      const [firstName, ...lastNameParts] = fullName.trim().split(' ');
      const { error } = await signUp(email, password, {
        country: formData.country,
        language: formData.language,
        first_name: firstName || '',
        last_name: lastNameParts.join(' '),
        phone: '',
      });

      if (error) {
        showToast(error.message);
      } else {
        showToast('Cuenta creada. Revisa tu correo para verificar.');
        setTimeout(() => navigation.navigate('Login'), 1500);
      }
    } catch (error) {
      showToast('No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TopGradientHeader
            title="Configuración"
            subtitle="Paso 2 de 2 · Consentimientos"
          />

          <Card style={styles.card}>
            <FieldInput
              label="País"
              iconName="map-pin"
              value={formData.country}
              onChangeText={(value) => updateFormData('country', value)}
              placeholder="Tu país"
            />
            <View style={styles.selectRow}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country}
                  style={[
                    styles.selectPill,
                    formData.country === country && styles.selectPillActive,
                  ]}
                  onPress={() => updateFormData('country', country)}
                >
                  <Text
                    style={[
                      styles.selectText,
                      formData.country === country && styles.selectTextActive,
                    ]}
                  >
                    {country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FieldInput
              label="Idioma"
              iconName="globe"
              value={formData.language}
              onChangeText={(value) => updateFormData('language', value)}
              placeholder="Idioma preferido"
            />
            <View style={styles.selectRow}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.selectPill,
                    formData.language === lang && styles.selectPillActive,
                  ]}
                  onPress={() => updateFormData('language', lang)}
                >
                  <Text
                    style={[
                      styles.selectText,
                      formData.language === lang && styles.selectTextActive,
                    ]}
                  >
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleTitle}>Recordatorios de renovación</Text>
                <Text style={styles.toggleSubtitle}>Recibe avisos de tu suscripción.</Text>
              </View>
              <Switch
                value={formData.renewalReminders}
                onValueChange={(value) => updateFormData('renewalReminders', value)}
                trackColor={{ true: Colors.teal, false: Colors.border }}
                thumbColor={Colors.surface}
              />
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleTitle}>Novedades</Text>
                <Text style={styles.toggleSubtitle}>Actualizaciones y tips de salud.</Text>
              </View>
              <Switch
                value={formData.productNews}
                onValueChange={(value) => updateFormData('productNews', value)}
                trackColor={{ true: Colors.teal, false: Colors.border }}
                thumbColor={Colors.surface}
              />
            </View>

            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Consentimientos obligatorios</Text>

              {[
                {
                  key: 'acceptTerms',
                  label: 'Acepto los Términos y Condiciones de Lifeband',
                },
                {
                  key: 'acceptPrivacy',
                  label: 'Acepto la Política de Privacidad y tratamiento de datos',
                },
                {
                  key: 'acceptMedicalData',
                  label: 'Autorizo el manejo de información médica sensible',
                },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.checkboxRow}
                  onPress={() =>
                    updateFormData(
                      item.key,
                      !formData[item.key as keyof typeof formData]
                    )
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      formData[item.key as keyof typeof formData] && styles.checkboxChecked,
                    ]}
                  >
                    {formData[item.key as keyof typeof formData] ? (
                      <Feather name="check" size={16} color={Colors.surface} />
                    ) : null}
                  </View>
                  <Text style={styles.checkboxText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <PrimaryButton
              title={loading ? 'Creando cuenta...' : 'Crear cuenta'}
              onPress={handleRegister}
              disabled={
                loading ||
                !formData.acceptTerms ||
                !formData.acceptPrivacy ||
                !formData.acceptMedicalData
              }
            />
          </Card>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast message={toastMessage} visible={hasToast} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  card: {
    gap: Spacing.lg,
  },
  selectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  selectPill: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  selectPillActive: {
    backgroundColor: 'rgba(15, 118, 110, 0.12)',
    borderColor: Colors.teal,
  },
  selectText: {
    ...Typography.caption,
    color: Colors.muted,
  },
  selectTextActive: {
    color: Colors.teal,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.md,
  },
  toggleTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  toggleSubtitle: {
    ...Typography.small,
    color: Colors.muted,
  },
  termsSection: {
    gap: Spacing.md,
  },
  termsTitle: {
    ...Typography.subheading,
    color: Colors.text,
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  checkboxText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  backButton: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.teal,
    fontWeight: '600',
  },
});

export default RegisterStep2Screen;
