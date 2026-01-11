import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from '../services/supabase';
import { Admin, AuthState } from '../types';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch admin profile
        const { data: admin } = await supabase
          .from('admins')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: admin } = await supabase
            .from('admins')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
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
