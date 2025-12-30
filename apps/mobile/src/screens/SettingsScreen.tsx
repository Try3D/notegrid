import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { uuid, clearUUID } = useAuth();
  const { data } = useData();
  const { theme, isDark, toggleTheme } = useTheme();

  const [showUUID, setShowUUID] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUUID = async () => {
    if (uuid) {
      await Clipboard.setStringAsync(uuid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async () => {
    if (!data) return;

    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
    };

    try {
      await Share.share({
        message: JSON.stringify(exportData, null, 2),
        title: 'NoteGrid Data Export',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This will permanently delete all your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUUID();
            } catch (error) {
              console.error('Failed to delete account:', error);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => clearUUID() },
    ]);
  };

  const maskedUUID = uuid ? uuid.replace(/./g, '*') : '';

  const styles = createStyles(theme);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Secret Code Section */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Secret Code</Text>
          <Text style={[styles.sectionDesc, { color: theme.muted }]}>
            This is your unique identifier. Keep it safe - it's the only way to access your data.
          </Text>

          <View style={[styles.uuidDisplay, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={[styles.uuidText, { color: theme.text }]} selectable>
              {showUUID ? uuid : maskedUUID}
            </Text>
            <View style={styles.uuidActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowUUID(!showUUID)}>
                <Text style={[styles.iconBtnText, { color: theme.muted }]}>
                  {showUUID ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleCopyUUID}>
                <Text style={[styles.iconBtnText, { color: theme.muted }]}>
                  {copied ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          <TouchableOpacity
            style={[styles.settingsBtn, { borderColor: theme.border }]}
            onPress={toggleTheme}
          >
            <Text style={[styles.settingsBtnText, { color: theme.text }]}>
              {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Export Section */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Export Data</Text>
          <Text style={[styles.sectionDesc, { color: theme.muted }]}>
            Download all your tasks and links as a JSON file for backup.
          </Text>
          <TouchableOpacity
            style={[styles.settingsBtn, { borderColor: theme.border }]}
            onPress={handleExport}
          >
            <Text style={[styles.settingsBtnText, { color: theme.text }]}>Export as JSON</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View
          style={[styles.section, styles.dangerSection, { backgroundColor: theme.card, borderColor: theme.danger }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.danger }]}>Danger Zone</Text>
          <Text style={[styles.sectionDesc, { color: theme.muted }]}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </Text>
          <TouchableOpacity
            style={[styles.dangerBtn, { borderColor: theme.danger, backgroundColor: theme.danger }]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerBtnText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: theme.border }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutBtnText, { color: theme.blue }]}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.muted }]}>
            {data?.tasks.length || 0} tasks, {data?.links.length || 0} links
          </Text>
          <Text style={[styles.footerText, { color: theme.muted, marginTop: 8 }]}>
            Made with love by try3d
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'ShortStack_400Regular',
    },
    content: {
      padding: 20,
      paddingTop: 0,
    },
    section: {
      borderWidth: 2,
      borderRadius: 2,
      padding: 20,
      marginBottom: 20,
    },
    dangerSection: {},
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'ShortStack_400Regular',
      marginBottom: 8,
    },
    sectionDesc: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
      lineHeight: 20,
      marginBottom: 16,
    },
    uuidDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderRadius: 2,
      padding: 14,
    },
    uuidText: {
      flex: 1,
      fontSize: 11,
      fontFamily: 'monospace',
      letterSpacing: 1,
    },
    uuidActions: {
      flexDirection: 'row',
      gap: 8,
    },
    iconBtn: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    iconBtnText: {
      fontSize: 12,
      fontFamily: 'ShortStack_400Regular',
    },
    settingsBtn: {
      padding: 14,
      borderWidth: 2,
      borderRadius: 2,
      alignItems: 'center',
    },
    settingsBtnText: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    dangerBtn: {
      padding: 14,
      borderWidth: 2,
      borderRadius: 2,
      alignItems: 'center',
    },
    dangerBtnText: {
      color: '#ffffff',
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
      fontWeight: '600',
    },
    logoutBtn: {
      padding: 14,
      borderWidth: 2,
      borderRadius: 2,
      alignItems: 'center',
      marginBottom: 20,
    },
    logoutBtnText: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
      fontWeight: '600',
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 30,
    },
    footerText: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
    },
  });
