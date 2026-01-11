import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';

const SubscriptionScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suscripción</Text>
      <Text style={styles.subtitle}>Funcionalidad por implementar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

export default SubscriptionScreen;
