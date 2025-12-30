import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API_URL } from '../types';

type ViewType = 'main' | 'generate' | 'enter';

export default function LoginScreen() {
  const [view, setView] = useState<ViewType>('main');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { setUUID, generateUUID, isValidUUID } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleGenerate = () => {
    const newUUID = generateUUID();
    setGeneratedCode(newUUID);
    setSaved(false);
    setView('generate');
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = async () => {
    if (!saved) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: generatedCode }),
      });

      const result = await response.json();
      if (result.success) {
        await setUUID(generatedCode);
      } else {
        setError('Failed to register. Please try again.');
      }
    } catch {
      setError('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const code = codeInput.trim();

    if (!isValidUUID(code)) {
      setError('Invalid code format. Please check and try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const existsRes = await fetch(`${API_URL}/api/exists/${code}`);
      const existsData = await existsRes.json();

      if (!existsData.data?.exists) {
        await fetch(`${API_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid: code }),
        });
      }

      await setUUID(code);
    } catch {
      setError('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>NoteGrid</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Your personal productivity companion
        </Text>

        {view === 'main' && (
          <View style={styles.viewContainer}>
            <Text style={[styles.description, { color: theme.text }]}>
              This app uses a simple secret code instead of username/password. Your code is your
              identity - keep it safe!
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { borderColor: theme.blue }]}
              onPress={handleGenerate}
            >
              <Text style={styles.primaryButtonText}>Generate New Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { borderColor: theme.border }]}
              onPress={() => {
                setView('enter');
                setError('');
                setCodeInput('');
              }}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>I Have a Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {view === 'generate' && (
          <View style={styles.viewContainer}>
            <View style={[styles.warning, { borderColor: isDark ? '#f59e0b' : '#f59e0b' }]}>
              <Text style={[styles.warningText, { color: isDark ? '#fcd34d' : '#92400e' }]}>
                This is your secret code. Save it somewhere safe - you won't see it again!
              </Text>
            </View>

            <View style={[styles.codeDisplay, { backgroundColor: theme.bg, borderColor: theme.border }]}>
              <Text style={[styles.code, { color: theme.text }]} selectable>
                {generatedCode}
              </Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <Text style={[styles.copyButtonText, { color: theme.muted }]}>
                  {copied ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSaved(!saved)}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: theme.border, backgroundColor: theme.card },
                  saved && { backgroundColor: theme.blue, borderColor: theme.blue },
                ]}
              >
                {saved && <Text style={styles.checkmark}>*</Text>}
              </View>
              <Text style={[styles.checkboxLabel, { color: theme.text }]}>
                I have saved my code safely
              </Text>
            </TouchableOpacity>

            {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { borderColor: theme.blue },
                (!saved || loading) && styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!saved || loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Continue to App</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { borderColor: theme.border }]}
              onPress={() => setView('main')}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {view === 'enter' && (
          <View style={styles.viewContainer}>
            <Text style={[styles.description, { color: theme.text }]}>
              Enter your secret code to access your data.
            </Text>

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.bg, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              placeholderTextColor={theme.muted}
              value={codeInput}
              onChangeText={setCodeInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { borderColor: theme.blue },
                loading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Login</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { borderColor: theme.border }]}
              onPress={() => setView('main')}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Text style={[styles.themeToggleText, { color: theme.muted }]}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      borderWidth: 3,
      borderRadius: 3,
      padding: 30,
    },
    title: {
      fontSize: 28,
      fontFamily: 'ShortStack_400Regular',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
      textAlign: 'center',
      marginBottom: 24,
    },
    viewContainer: {
      marginTop: 8,
    },
    description: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
      lineHeight: 22,
      marginBottom: 20,
    },
    button: {
      padding: 14,
      borderWidth: 2,
      borderRadius: 2,
      marginBottom: 12,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
    },
    primaryButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
    },
    secondaryButtonText: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    disabledButton: {
      opacity: 0.5,
    },
    warning: {
      backgroundColor: '#fef3c7',
      borderWidth: 2,
      borderRadius: 2,
      padding: 12,
      marginBottom: 20,
    },
    warningText: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
      lineHeight: 20,
    },
    codeDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderRadius: 2,
      padding: 12,
      marginBottom: 20,
    },
    code: {
      flex: 1,
      fontSize: 12,
      fontFamily: 'ShortStack_400Regular',
    },
    copyButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    copyButtonText: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderWidth: 2,
      borderRadius: 2,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmark: {
      color: '#ffffff',
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    checkboxLabel: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
    },
    input: {
      borderWidth: 2,
      borderRadius: 2,
      padding: 12,
      marginBottom: 12,
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
    },
    error: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
      marginBottom: 12,
    },
    themeToggle: {
      marginTop: 20,
      alignItems: 'center',
    },
    themeToggleText: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
    },
  });
