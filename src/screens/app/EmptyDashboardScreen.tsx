import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { Card, PrimaryButton, SecondaryButton } from '../../components/common';

const EmptyDashboardScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, Andrea</Text>
            <Text style={styles.subtitle}>Tu panel de seguridad familiar</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Feather name="settings" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <Card style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Feather name="activity" size={20} color={Colors.teal} />
          </View>
          <Text style={styles.heroTitle}>Todo listo para empezar</Text>
          <Text style={styles.heroText}>
            Agrega el primer portador para guardar información médica y accesos rápidos.
          </Text>
          <PrimaryButton title="Agregar portador" onPress={() => {}} />
          <TouchableOpacity>
            <Text style={styles.heroLink}>¿Cómo funciona Lifeband?</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.subscriptionCard}>
          <Text style={styles.subscriptionTitle}>Estado de suscripción</Text>
          <Text style={styles.subscriptionText}>
            Tu plan está listo para activarse. Puedes gestionar renovaciones desde ajustes.
          </Text>
          <SecondaryButton title="Ver detalles" onPress={() => {}} />
        </Card>
      </View>
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
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...Typography.heading,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.muted,
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    gap: Spacing.md,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(15, 118, 110, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...Typography.subheading,
    color: Colors.text,
  },
  heroText: {
    ...Typography.body,
    color: Colors.muted,
  },
  heroLink: {
    ...Typography.caption,
    color: Colors.teal,
    fontWeight: '600',
  },
  subscriptionCard: {
    gap: Spacing.md,
  },
  subscriptionTitle: {
    ...Typography.subheading,
    color: Colors.text,
  },
  subscriptionText: {
    ...Typography.body,
    color: Colors.muted,
  },
});

export default EmptyDashboardScreen;
