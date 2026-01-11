import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { Portador, AppStackParamList } from '../../types';
import { getPortador, updatePortador } from '../../services';

type PortadorDetailRouteProp = RouteProp<AppStackParamList, 'PortadorDetail'>;
type PortadorDetailNavigationProp = NativeStackNavigationProp<AppStackParamList, 'PortadorDetail'>;

const PortadorDetailScreen: React.FC = () => {
  const route = useRoute<PortadorDetailRouteProp>();
  const navigation = useNavigation<PortadorDetailNavigationProp>();
  const { portadorId } = route.params;
  const [portador, setPortador] = useState<Portador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortador();
  }, [portadorId]);

  const loadPortador = async () => {
    try {
      const data = await getPortador(portadorId);
      setPortador(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información del portador');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'suspended': return Colors.warning;
      case 'lost': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'suspended': return 'Suspendido';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  const handleMarkAsLost = () => {
    Alert.alert(
      'Marcar como Perdido',
      '¿Estás seguro que quieres marcar esta pulsera como perdida?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Marcar como Perdida',
          style: 'destructive',
          onPress: async () => {
            if (portador) {
              try {
                await updatePortador(portador.id, { lifeband_status: 'lost' });
                loadPortador();
                Alert.alert('Éxito', 'Pulsera marcada como perdida');
              } catch (error) {
                Alert.alert('Error', 'No se pudo actualizar el estado');
              }
            }
          },
        },
      ]
    );
  };

  const handleShareLink = async () => {
    if (portador?.qr_token) {
      const publicUrl = `https://api.lifeband.app/p/${portador.qr_token}`;
      try {
        await Share.share({
          message: publicUrl,
          title: 'Link de Emergencia de Lifeband',
        });
      } catch (error) {
        Alert.alert('Error', 'No se pudo compartir el link');
      }
    }
  };

  const handleViewPDF = () => {
    if (portador?.public_pdf_url) {
      // TODO: Implement PDF viewer
      Alert.alert('PDF', `Ver PDF: ${portador.public_pdf_url}`);
    } else {
      Alert.alert('PDF', 'No hay PDF disponible');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!portador) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el portador</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <Text style={styles.name}>
            {portador.first_name} {portador.last_name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(portador.lifeband_status) }]}>
            <Text style={styles.statusText}>{getStatusText(portador.lifeband_status)}</Text>
          </View>
        </View>
        <Text style={styles.info}>
          {portador.birth_date} • {portador.nationality}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Acceso</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Token QR:</Text>
          <Text style={styles.infoValue}>{portador.qr_token}</Text>
        </View>
        {portador.nfc_uid && (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>UID NFC:</Text>
            <Text style={styles.infoValue}>{portador.nfc_uid}</Text>
          </View>
        )}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Acceso Público:</Text>
          <Text style={styles.infoValue}>
            {portador.public_access_enabled ? 'Habilitado' : 'Deshabilitado'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleViewPDF}>
          <Text style={styles.actionButtonText}>Ver PDF Médico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShareLink}>
          <Text style={styles.actionButtonText}>Compartir Link de Emergencia</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]} 
          onPress={handleMarkAsLost}
        >
          <Text style={styles.dangerButtonText}>Marcar Pulsera como Perdida</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditPortadorWizard', { portadorId })}
        >
          <Text style={styles.editButtonText}>Editar Información</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    ...Typography.title,
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    ...Typography.small,
    color: Colors.background,
    fontWeight: '600',
  },
  info: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoCard: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    ...Typography.body,
    color: Colors.text,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  dangerButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  editButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
});

export default PortadorDetailScreen;
