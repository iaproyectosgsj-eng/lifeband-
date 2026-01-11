import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import EmptyDashboardScreen from '../screens/app/EmptyDashboardScreen';
import PortadorDetailScreen from '../screens/app/PortadorDetailScreen';
import AddPortadorWizardScreen from '../screens/app/AddPortadorWizardScreen';
import EditPortadorWizardScreen from '../screens/app/EditPortadorWizardScreen';
import SubscriptionScreen from '../screens/app/SubscriptionScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import { Colors } from '../constants';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: true,
        contentStyle: {
          backgroundColor: Colors.bg,
        },
        headerStyle: {
          backgroundColor: Colors.teal,
        },
        headerTintColor: Colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={EmptyDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PortadorDetail" 
        component={PortadorDetailScreen}
        options={{ title: 'Detalle del Portador' }}
      />
      <Stack.Screen 
        name="AddPortadorWizard" 
        component={AddPortadorWizardScreen}
        options={{ title: 'Agregar Portador' }}
      />
      <Stack.Screen 
        name="EditPortadorWizard" 
        component={EditPortadorWizardScreen}
        options={{ title: 'Editar Portador' }}
      />
      <Stack.Screen 
        name="Subscription" 
        component={SubscriptionScreen}
        options={{ title: 'Suscripción' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Ajustes' }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
