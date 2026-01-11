import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { signOut } from '../../services';

// Settings screen with account and support options.
const SettingsScreen: React.FC = () => {
  // Sign out of the current session.
  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled by AppNavigator auth state change
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  // Placeholder for account deletion flow.
  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción eliminará permanentemente tu cuenta y todos tus datos. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Cuenta',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert('Funcionalidad por implementar');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ajustes</Text>
          <Text style={styles.subtitle}>Gestiona tu cuenta y preferencias.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Editar Perfil</Text>
            <Text style={styles.menuItemHint}>Nombre, email y teléfono</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Cambiar Contraseña</Text>
            <Text style={styles.menuItemHint}>Actualiza tu clave de acceso</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Preferencias de Idioma</Text>
            <Text style={styles.menuItemHint}>Define tu idioma principal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Centro de Ayuda</Text>
            <Text style={styles.menuItemHint}>Guías rápidas y preguntas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Contactar Soporte</Text>
            <Text style={styles.menuItemHint}>Escríbenos cuando lo necesites</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Términos y Condiciones</Text>
            <Text style={styles.menuItemHint}>Última actualización</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Política de Privacidad</Text>
            <Text style={styles.menuItemHint}>Cómo usamos tu información</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicación</Text>
          
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>Versión 1.0.0</Text>
            <Text style={styles.menuItemHint}>Última actualización</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.menuItem, styles.dangerItem]} 
            onPress={handleSignOut}
          >
            <Text style={styles.dangerItemText}>Cerrar Sesión</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.dangerItem]} 
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerItemText}>Eliminar Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    ...Typography.subheading,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  menuItem: {
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuItemText: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  menuItemHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  dangerItem: {
    backgroundColor: Colors.card,
    borderBottomWidth: 0,
  },
  dangerItemText: {
    ...Typography.body,
    color: Colors.error,
    fontWeight: '600',
  },
});

export default SettingsScreen;
