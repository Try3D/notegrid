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
} from 'react-native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { Task, COLORS, COLOR_NAMES, QUADRANT_LABELS } from '../types';

export default function TodosScreen() {
  const { tasks, addTask, updateTask, deleteTask, loading } = useData();
  const { theme } = useTheme();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Local state for drawer form
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [quadrant, setQuadrant] = useState<string>('');
  const [color, setColor] = useState<string>(COLORS[0]);

  const grouped = tasks.reduce(
    (acc, task) => {
      if (!acc[task.color]) acc[task.color] = [];
      acc[task.color].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  const sortedColors = COLORS.filter((c) => grouped[c]);

  const openDrawer = (task: Task | null) => {
    if (task) {
      setActiveTask(task);
      setTitle(task.title);
      setNote(task.note);
      setTags(task.tags.join(', '));
      setQuadrant(task.q || '');
      setColor(task.color);
    } else {
      // New task
      const newTask = addTask({
        title: '',
        note: '',
        tags: [],
        color: COLORS[0],
        q: null,
        completed: false,
      });
      setActiveTask(newTask);
      setTitle('');
      setNote('');
      setTags('');
      setQuadrant('');
      setColor(COLORS[0]);
    }
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setActiveTask(null);
  };

  const handleUpdate = (field: string, value: any) => {
    if (!activeTask) return;

    let updates: Partial<Task> = {};
    switch (field) {
      case 'title':
        setTitle(value);
        updates = { title: value };
        break;
      case 'note':
        setNote(value);
        updates = { note: value };
        break;
      case 'tags':
        setTags(value);
        updates = { tags: value.split(',').map((t: string) => t.trim()).filter(Boolean) };
        break;
      case 'quadrant':
        setQuadrant(value);
        updates = { q: value || null };
        break;
      case 'color':
        setColor(value);
        updates = { color: value };
        break;
    }
    updateTask(activeTask.id, updates);
  };

  const handleDelete = () => {
    if (!activeTask) return;
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(activeTask.id);
          closeDrawer();
        },
      },
    ]);
  };

  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, { completed: !task.completed });
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Todos</Text>
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Todos</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {sortedColors.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              No todos yet. Add one to get started!
            </Text>
          </View>
        ) : (
          sortedColors.map((colorKey) => (
            <View
              key={colorKey}
              style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={[styles.groupHeader, { borderBottomColor: theme.border }]}>
                <View style={[styles.groupDot, { backgroundColor: colorKey }]} />
                <Text style={[styles.groupTitle, { color: theme.text }]}>
                  {COLOR_NAMES[colorKey] || 'Other'}
                </Text>
              </View>
              {grouped[colorKey].map((task, index) => (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.todoItem,
                    index < grouped[colorKey].length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.hover,
                    },
                  ]}
                  onPress={() => openDrawer(task)}
                >
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      { borderColor: theme.border, backgroundColor: theme.card },
                    ]}
                    onPress={() => handleToggleComplete(task)}
                  >
                    {task.completed && <Text style={[styles.checkmark, { color: theme.text }]}>*</Text>}
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.todoTitle,
                      { color: theme.text },
                      task.completed && styles.completedText,
                    ]}
                    numberOfLines={1}
                  >
                    {task.title || 'Untitled'}
                  </Text>
                  {task.q && (
                    <View style={[styles.badge, { backgroundColor: getBadgeColor(task.q) }]}>
                      <Text style={styles.badgeText}>{QUADRANT_LABELS[task.q]}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}

        <TouchableOpacity
          style={[styles.addButton, { borderColor: theme.border }]}
          onPress={() => openDrawer(null)}
        >
          <Text style={[styles.addButtonText, { color: theme.muted }]}>+ Add Todo</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Task Drawer Modal */}
      <Modal visible={drawerVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.drawer, { backgroundColor: theme.card }]}>
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color: theme.text }]}>Task Details</Text>
              <TouchableOpacity onPress={closeDrawer}>
                <Text style={[styles.closeButton, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerContent}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }]}
                placeholder="Title"
                placeholderTextColor={theme.muted}
                value={title}
                onChangeText={(v) => handleUpdate('title', v)}
              />

              <TextInput
                style={[styles.textArea, { backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }]}
                placeholder="Note"
                placeholderTextColor={theme.muted}
                value={note}
                onChangeText={(v) => handleUpdate('note', v)}
                multiline
                numberOfLines={4}
              />

              <TextInput
                style={[styles.input, { backgroundColor: theme.bg, color: theme.text, borderColor: theme.border }]}
                placeholder="Tags (comma separated)"
                placeholderTextColor={theme.muted}
                value={tags}
                onChangeText={(v) => handleUpdate('tags', v)}
              />

              <Text style={[styles.label, { color: theme.muted }]}>Eisenhower Quadrant</Text>
              <View style={styles.quadrantPicker}>
                {[
                  { value: '', label: 'Not assigned' },
                  { value: 'do', label: 'Do First' },
                  { value: 'decide', label: 'Schedule' },
                  { value: 'delegate', label: 'Delegate' },
                  { value: 'delete', label: 'Eliminate' },
                ].map((q) => (
                  <TouchableOpacity
                    key={q.value}
                    style={[
                      styles.quadrantOption,
                      { borderColor: theme.border },
                      quadrant === q.value && { backgroundColor: theme.blue, borderColor: theme.blue },
                    ]}
                    onPress={() => handleUpdate('quadrant', q.value)}
                  >
                    <Text
                      style={[
                        styles.quadrantOptionText,
                        { color: quadrant === q.value ? '#ffffff' : theme.text },
                      ]}
                    >
                      {q.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: theme.muted }]}>Color</Text>
              <View style={styles.colorPicker}>
                {COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c, borderColor: theme.border },
                      color === c && { borderColor: theme.text, borderWidth: 3 },
                    ]}
                    onPress={() => handleUpdate('color', c)}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.deleteButton, { borderColor: theme.danger, backgroundColor: theme.danger }]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete Task</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getBadgeColor(q: string): string {
  switch (q) {
    case 'do':
      return '#ef4444';
    case 'decide':
      return '#22c55e';
    case 'delegate':
      return '#f97316';
    case 'delete':
      return '#3b82f6';
    default:
      return '#6b7280';
  }
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
    group: {
      borderWidth: 2,
      borderRadius: 2,
      marginBottom: 20,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 2,
    },
    groupDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      marginRight: 10,
    },
    groupTitle: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
      fontWeight: '600',
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      paddingHorizontal: 16,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderWidth: 2,
      borderRadius: 2,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmark: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    todoTitle: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    completedText: {
      textDecorationLine: 'line-through',
      opacity: 0.6,
    },
    badge: {
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 2,
      marginLeft: 8,
    },
    badgeText: {
      color: '#ffffff',
      fontSize: 10,
      fontFamily: 'ShortStack_400Regular',
    },
    addButton: {
      padding: 14,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderRadius: 2,
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    drawer: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '80%',
    },
    drawerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    drawerTitle: {
      fontSize: 18,
      fontFamily: 'ShortStack_400Regular',
    },
    closeButton: {
      fontSize: 24,
      padding: 4,
    },
    drawerContent: {
      padding: 20,
    },
    input: {
      borderWidth: 2,
      borderRadius: 2,
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    textArea: {
      borderWidth: 2,
      borderRadius: 2,
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
      minHeight: 100,
      textAlignVertical: 'top',
    },
    label: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
      marginBottom: 8,
    },
    quadrantPicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    quadrantOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 2,
      borderRadius: 2,
    },
    quadrantOptionText: {
      fontSize: 12,
      fontFamily: 'ShortStack_400Regular',
    },
    colorPicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 24,
    },
    colorDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
    },
    deleteButton: {
      padding: 14,
      borderWidth: 2,
      borderRadius: 2,
      alignItems: 'center',
      marginBottom: 40,
    },
    deleteButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
      fontWeight: '600',
    },
  });
