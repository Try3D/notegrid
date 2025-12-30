import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from '../types';

export default function LinksScreen() {
  const { links, addLink, deleteLink, loading } = useData();
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddLink = async () => {
    const url = urlInput.trim();
    if (!url) return;

    setSaving(true);

    try {
      let title = url;
      let favicon = '';

      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
        title = urlObj.hostname;
      } catch {}

      addLink({ url: url.startsWith('http') ? url : `https://${url}`, title, favicon });
      setUrlInput('');
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (link: Link) => {
    Alert.alert('Delete Link', `Delete "${link.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteLink(link.id) },
    ]);
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Links</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.muted }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Links</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {links.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              No links yet. Add one to get started!
            </Text>
          </View>
        ) : (
          links.map((link) => (
            <View
              key={link.id}
              style={[styles.linkItem, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <TouchableOpacity style={styles.linkContent} onPress={() => handleOpenLink(link.url)}>
                <Text style={[styles.linkTitle, { color: theme.text }]} numberOfLines={1}>
                  {link.title}
                </Text>
                <Text style={[styles.linkUrl, { color: theme.muted }]} numberOfLines={1}>
                  {link.url}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteBtn, { borderColor: theme.danger, backgroundColor: theme.danger }]}
                onPress={() => handleDelete(link)}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={[styles.addButton, { borderColor: theme.border }]}
          onPress={() => setShowModal(true)}
        >
          <Text style={[styles.addButtonText, { color: theme.muted }]}>+ Add Link</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Link Modal */}
      <Modal visible={showModal} animationType="fade" transparent>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add Link</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={[styles.closeButton, { color: theme.muted }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }]}
              placeholder="Paste URL here..."
              placeholderTextColor={theme.muted}
              value={urlInput}
              onChangeText={setUrlInput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              autoFocus
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: theme.blue, borderColor: theme.blue }]}
                onPress={handleAddLink}
                disabled={saving}
              >
                <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: theme.border }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
      flex: 1,
    },
    contentContainer: {
      padding: 20,
      paddingTop: 0,
    },
    emptyState: {
      padding: 50,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
      textAlign: 'center',
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderWidth: 2,
      borderRadius: 2,
      marginBottom: 10,
    },
    linkContent: {
      flex: 1,
    },
    linkTitle: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
      fontWeight: '600',
      marginBottom: 4,
    },
    linkUrl: {
      fontSize: 12,
      fontFamily: 'ShortStack_400Regular',
    },
    deleteBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 2,
      borderRadius: 2,
      marginLeft: 12,
    },
    deleteBtnText: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
    },
    addButton: {
      padding: 14,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderRadius: 2,
      alignItems: 'center',
      marginTop: 6,
    },
    addButtonText: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      maxWidth: 420,
      borderWidth: 3,
      borderRadius: 2,
      padding: 24,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'ShortStack_400Regular',
    },
    closeButton: {
      fontSize: 24,
      padding: 4,
    },
    input: {
      borderWidth: 2,
      borderRadius: 2,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
    },
    saveBtn: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderWidth: 2,
      borderRadius: 2,
    },
    saveBtnText: {
      color: '#ffffff',
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
      fontWeight: '500',
    },
    cancelBtn: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderWidth: 2,
      borderRadius: 2,
    },
    cancelBtnText: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
  });
