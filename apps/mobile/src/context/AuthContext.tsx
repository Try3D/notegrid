import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const AUTH_KEY = 'eisenhower_uuid';

interface AuthContextType {
  uuid: string | null;
  loading: boolean;
  setUUID: (uuid: string) => Promise<void>;
  clearUUID: () => Promise<void>;
  generateUUID: () => string;
  isValidUUID: (uuid: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [uuid, setUUIDState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUUID();
  }, []);

  const loadUUID = async () => {
    try {
      const storedUUID = await SecureStore.getItemAsync(AUTH_KEY);
      if (storedUUID) {
        setUUIDState(storedUUID);
      }
    } catch (error) {
      console.error('Failed to load UUID:', error);
    } finally {
      setLoading(false);
    }
  };

  const setUUID = async (newUUID: string) => {
    await SecureStore.setItemAsync(AUTH_KEY, newUUID);
    setUUIDState(newUUID);
  };

  const clearUUID = async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY);
    setUUIDState(null);
  };

  const generateUUID = () => {
    return Crypto.randomUUID();
  };

  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  return (
    <AuthContext.Provider value={{ uuid, loading, setUUID, clearUUID, generateUUID, isValidUUID }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
