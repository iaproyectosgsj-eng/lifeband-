import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';
import { Portador, SubscriptionPortador, AppStackParamList } from '../../types';
import { getPortadores, getCurrentAdminId } from '../../services';
import { Button, Card } from '../../components/common';

type DashboardNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const [portadores, setPortadores] = useState<Portador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortadores();
  }, []);

  // Refresh when screen comes into focus (after adding a portador)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPortadores();
    });
    return unsubscribe;
  }, [navigation]);

  const loadPortadores = async () => {
    try {
      const adminId = await getCurrentAdminId();
      const data = await getPortadores(adminId);
      setPortadores(data);
    } catch (error) {
      console.error('Error loading portadores:', error);
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', message || 'No se pudieron cargar los portadores');
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

  const renderPortadorCard = ({ item }: { item: Portador }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PortadorDetail', { portadorId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.portadorName}>
          {item.first_name} {item.last_name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.lifeband_status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.lifeband_status)}</Text>
        </View>
      </View>
      <Text style={styles.portadorInfo}>
        {item.birth_date} • {item.nationality}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.qrText}>QR: {item.qr_token.slice(0, 8)}...</Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('PortadorDetail', { portadorId: item.id })}
        >
          <Text style={styles.viewButtonText}>Ver</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Lifeband</Text>
      <Button
        title="Settings"
        onPress={() => navigation.navigate('Settings')}
        variant="outline"
        size="small"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPortadorWizard')}
      >
        <Text style={styles.addButtonText}>+ Agregar Portador</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : portadores.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No tienes portadores</Text>
          <Text style={styles.emptyDescription}>
            Agrega tu primer portador para comenzar a usar Lifeband
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('AddPortadorWizard')}
          >
            <Text style={styles.primaryButtonText}>Agregar Primer Portador</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={portadores}
          renderItem={renderPortadorCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
  list: {
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  portadorName: {
    ...Typography.heading,
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
  portadorInfo: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrText: {
    ...Typography.caption,
    color: Colors.textLight,
    flex: 1,
  },
  viewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  viewButtonText: {
    ...Typography.caption,
    color: Colors.background,
    fontWeight: '600',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  primaryButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
});

export default DashboardScreen;
