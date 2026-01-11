import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { AuthStackParamList } from '../../types';
import {
  Card,
  Divider,
  FieldInput,
  PrimaryButton,
  SecondaryButton,
  Toast,
  TopGradientHeader,
} from '../../components/common';
import { Feather } from '@expo/vector-icons';

type RegisterStep1NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterStep1'>;

const RegisterStep1Screen: React.FC = () => {
  const navigation = useNavigation<RegisterStep1NavigationProp>();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; fullName?: string; password?: string }>({});
  const [toastMessage, setToastMessage] = useState('');

  const hasToast = useMemo(() => toastMessage.length > 0, [toastMessage]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    const nextErrors: { email?: string; fullName?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.fullName) {
      nextErrors.fullName = 'Ingresa tu nombre completo.';
    }
    if (!formData.email || !emailRegex.test(formData.email)) {
      nextErrors.email = 'Ingresa un email válido.';
    }
    if (!formData.password || formData.password.length < 8) {
      nextErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showToast('Revisa los datos para continuar.');
      return;
    }

    navigation.navigate('RegisterStep2', {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TopGradientHeader
            title="Crear cuenta"
            subtitle="Administra a tu familia con seguridad y calma."
          />

          <SecondaryButton
            title="Continuar con Google"
            onPress={() => showToast('Google estará disponible pronto.')}
          />

          <Divider label="o" />

          <Card style={styles.card}>
            <FieldInput
              label="Nombre y apellido"
              iconName="user"
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
              placeholder="Tu nombre completo"
              autoCapitalize="words"
              error={errors.fullName}
            />

            <FieldInput
              label="Email"
              iconName="mail"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <FieldInput
              label="Contraseña"
              iconName="lock"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              placeholder="Mínimo 8 caracteres"
              secureTextEntry
              showToggle
              error={errors.password}
            />

            <Card style={styles.passwordCard} shadow={false}>
              <Text style={styles.passwordTitle}>Fortaleza de contraseña</Text>
              {[
                'Mínimo 8 caracteres',
                'Incluye números o símbolos',
                'Usa mayúsculas y minúsculas',
              ].map((item, index) => (
                <View style={styles.passwordItem} key={`${item}-${index}`}>
                  <Feather name="check-circle" size={16} color={Colors.muted} />
                  <Text style={styles.passwordText}>{item}</Text>
                </View>
              ))}
            </Card>

            <PrimaryButton title="Continuar" onPress={handleContinue} />
          </Card>

          <TouchableOpacity
            style={styles.footer}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.footerText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  card: {
    gap: Spacing.md,
  },
  passwordCard: {
    backgroundColor: Colors.bg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  passwordTitle: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '600',
  },
  passwordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  passwordText: {
    ...Typography.caption,
    color: Colors.muted,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  footerText: {
    ...Typography.body,
    color: Colors.teal,
    fontWeight: '600',
  },
});

export default RegisterStep1Screen;
