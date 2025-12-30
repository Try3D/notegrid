import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const THEME_KEY = 'theme_pref';

export const lightTheme = {
  bg: '#fdf7f1',
  card: '#ffffff',
  border: '#3c3c3c',
  text: '#3c3c3c',
  muted: '#6b7280',
  hover: '#f5ebe0',
  taskBg: '#fefcfa',
  taskBgAlt: '#fdf7f1',
  red: '#ef4444',
  green: '#22c55e',
  orange: '#f97316',
  blue: '#3b82f6',
  danger: '#dc2626',
};

export const darkTheme = {
  bg: '#1a1a1a',
  card: '#252525',
  border: '#e0e0e0',
  text: '#f0f0f0',
  muted: '#a0a0a0',
  hover: '#333333',
  taskBg: '#252525',
  taskBgAlt: '#2a2a2a',
  red: '#ef4444',
  green: '#22c55e',
  orange: '#f97316',
  blue: '#3b82f6',
  danger: '#dc2626',
};

export type Theme = typeof lightTheme;

interface ThemeContextType {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved) {
        setIsDark(saved === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    await AsyncStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
