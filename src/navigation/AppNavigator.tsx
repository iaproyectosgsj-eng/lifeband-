import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from '../services/supabase';
import { ensureAdminProfile } from '../services/database';
import { Admin, AuthState } from '../types';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

// Root stack defines whether the user sees auth or app routes.
export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// AppNavigator watches auth state and routes accordingly.
const AppNavigator: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Load current session and ensure admin profile exists.
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { user } = session;
        const metadata = user.user_metadata || {};
        const admin = await ensureAdminProfile({
          id: user.id,
          first_name: metadata.first_name || metadata.name || 'Admin',
          last_name: metadata.last_name || metadata.family_name || '',
          email: user.email ?? '',
          password_hash: 'supabase_auth',
          status: 'active',
          country: metadata.country || 'Desconocido',
          language: metadata.language || 'Español',
        });

        setAuthState({
          user: admin,
          session,
          loading: false,
        });
      } else {
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      }
    };

    checkAuth();

    // Subscribe to auth changes to keep navigation in sync.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { user } = session;
          const metadata = user.user_metadata || {};
          const admin = await ensureAdminProfile({
            id: user.id,
            first_name: metadata.first_name || metadata.name || 'Admin',
            last_name: metadata.last_name || metadata.family_name || '',
            email: user.email ?? '',
            password_hash: 'supabase_auth',
            status: 'active',
            country: metadata.country || 'Desconocido',
            language: metadata.language || 'Español',
          });

          setAuthState({
            user: admin,
            session,
            loading: false,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (authState.loading) {
    return null; // Or loading spinner
  }

  // MODO DESARROLLO: Comentar para requerir autenticación
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {authState.session && authState.user ? (
          <RootStack.Screen name="AppStack" component={AppStack} />
        ) : (
          <RootStack.Screen name="AuthStack" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );

  // MODO DESARROLLO: Ir directamente a AppStack
  // return (
  //   <NavigationContainer>
  //     <RootStack.Navigator screenOptions={{ headerShown: false }}>
  //       <RootStack.Screen name="AppStack" component={AppStack} />
  //     </RootStack.Navigator>
  //   </NavigationContainer>
  // );
};

export default AppNavigator;
