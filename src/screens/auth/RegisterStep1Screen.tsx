import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { AuthStackParamList } from '../../types';
import { Button, Input } from '../../components/common';

type RegisterStep1NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterStep1'>;

const RegisterStep1Screen: React.FC = () => {
  const navigation = useNavigation<RegisterStep1NavigationProp>();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    // Navegar a RegisterStep2 con el email
    navigation.navigate('RegisterStep2', { email: formData.email });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Paso 1 de 2</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre"
            value={formData.firstName}
            onChangeText={(value) => updateFormData('firstName', value)}
            placeholder="Tu nombre"
            autoCapitalize="words"
          />

          <Input
            label="Apellido"
            value={formData.lastName}
            onChangeText={(value) => updateFormData('lastName', value)}
            placeholder="Tu apellido"
            autoCapitalize="words"
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button
            title="Continuar"
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Volver al Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.title,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  continueButton: {
    marginBottom: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
  },
  backText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default RegisterStep1Screen;
