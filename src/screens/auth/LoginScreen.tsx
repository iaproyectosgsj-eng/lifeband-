import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { AuthStackParamList } from '../../types';
import { signIn, signInWithGoogle } from '../../services';
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

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

// Login screen for admin users.
const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [toastMessage, setToastMessage] = useState('');

  const hasToast = useMemo(() => toastMessage.length > 0, [toastMessage]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Email/password sign-in.
  const handleLogin = async () => {
    const nextErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    setLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        showToast(error.message);
      }
      // Navigation will be handled by AppNavigator auth state change
    } catch (error) {
      showToast('No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth sign-in (handled by Supabase).
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        showToast(error.message);
      }
      // Navigation will be handled by AppNavigator auth state change
    } catch (error) {
      showToast('No se pudo iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  // Update local form state.
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            title="Inicia sesión"
            subtitle="Tu info médica, lista cuando más importa."
          />

          <Card style={styles.card}>
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
              placeholder="Tu contraseña"
              secureTextEntry
              showToggle
              error={errors.password}
            />

            <View style={styles.rememberRow}>
              <View style={styles.rememberText}>
                <Text style={styles.rememberTitle}>Recordarme</Text>
                <Text style={styles.rememberSubtitle}>Mantener sesión activa</Text>
              </View>
              <Switch
                value={remember}
                onValueChange={setRemember}
                trackColor={{ true: Colors.teal, false: Colors.border }}
                thumbColor={Colors.surface}
              />
            </View>

            <PrimaryButton
              title={loading ? 'Entrando...' : 'Entrar'}
              onPress={handleLogin}
              disabled={loading}
              style={styles.primaryButton}
            />

            <Divider label="o" />

            <SecondaryButton
              title="Continuar con Google"
              onPress={handleGoogleLogin}
              disabled={loading}
              style={styles.secondaryButton}
            />
            <SecondaryButton
              title="Continuar con Apple"
              onPress={() => showToast('Apple estará disponible pronto.')}
              disabled={loading}
            />

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => showToast('Recuperación de contraseña en camino.')}
            >
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </Card>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterStep1')}>
              <Text style={styles.footerLink}>Crear cuenta</Text>
            </TouchableOpacity>
            <View style={styles.securityRow}>
              <View style={styles.securityIcon}>
                <Feather name="shield" size={14} color={Colors.teal} />
              </View>
              <Text style={styles.securityText}>Datos protegidos y cifrados</Text>
            </View>
          </View>
        </ScrollView>
        <Toast message={toastMessage} visible={hasToast} />
      </KeyboardAvoidingView>
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
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  rememberText: {
    gap: 2,
  },
  rememberTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  rememberSubtitle: {
    ...Typography.small,
    color: Colors.muted,
  },
  primaryButton: {
    marginTop: Spacing.xs,
  },
  secondaryButton: {
    marginBottom: Spacing.sm,
  },
  linkButton: {
    alignSelf: 'center',
    marginTop: Spacing.sm,
  },
  linkText: {
    ...Typography.caption,
    color: Colors.teal,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  footerLink: {
    ...Typography.body,
    color: Colors.teal,
    fontWeight: '600',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  securityIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(15, 118, 110, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityText: {
    ...Typography.caption,
    color: Colors.muted,
  },
});

export default LoginScreen;
