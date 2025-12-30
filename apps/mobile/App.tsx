import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts, ShortStack_400Regular } from '@expo-google-fonts/short-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { DataProvider } from './src/context/DataContext';

import LoginScreen from './src/screens/LoginScreen';
import TodosScreen from './src/screens/TodosScreen';
import MatrixScreen from './src/screens/MatrixScreen';
import LinksScreen from './src/screens/LinksScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.blue,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: {
          fontFamily: 'ShortStack_400Regular',
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Todos"
        component={TodosScreen}
        options={{
          tabBarLabel: 'Todos',
        }}
      />
      <Tab.Screen
        name="Matrix"
        component={MatrixScreen}
        options={{
          tabBarLabel: 'Matrix',
        }}
      />
      <Tab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          tabBarLabel: 'Links',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { uuid, loading: authLoading } = useAuth();
  const { theme, isDark } = useTheme();

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator size="large" color={theme.blue} />
      </View>
    );
  }

  if (!uuid) {
    return <LoginScreen />;
  }

  return (
    <DataProvider>
      <NavigationContainer
        theme={{
          dark: isDark,
          colors: {
            primary: theme.blue,
            background: theme.bg,
            card: theme.card,
            text: theme.text,
            border: theme.border,
            notification: theme.orange,
          },
          fonts: {
            regular: {
              fontFamily: 'ShortStack_400Regular',
              fontWeight: 'normal' as const,
            },
            medium: {
              fontFamily: 'ShortStack_400Regular',
              fontWeight: '500' as const,
            },
            bold: {
              fontFamily: 'ShortStack_400Regular',
              fontWeight: 'bold' as const,
            },
            heavy: {
              fontFamily: 'ShortStack_400Regular',
              fontWeight: '900' as const,
            },
          },
        }}
      >
        <TabNavigator />
      </NavigationContainer>
    </DataProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ShortStack_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdf7f1' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <StatusBar style="auto" />
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
