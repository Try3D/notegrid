import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { Task, COLORS } from '../types';

type Quadrant = 'do' | 'decide' | 'delegate' | 'delete' | 'unassigned';

const QUADRANTS: { id: Quadrant; title: string; subtitle: string; color: string }[] = [
  { id: 'do', title: 'Important & Urgent', subtitle: 'Do First', color: '#ef4444' },
  { id: 'decide', title: 'Important & Not Urgent', subtitle: 'Schedule', color: '#22c55e' },
  { id: 'delegate', title: 'Not Important & Urgent', subtitle: 'Delegate', color: '#f97316' },
  { id: 'delete', title: 'Not Important & Not Urgent', subtitle: 'Eliminate', color: '#3b82f6' },
];

export default function MatrixScreen() {
  const { tasks, updateTask, deleteTask, loading } = useData();
  const { theme } = useTheme();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Local state for drawer form
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState<string>(COLORS[0]);

  const getTasksByQuadrant = (q: Quadrant) => {
    if (q === 'unassigned') {
      return tasks.filter((t) => !t.q);
    }
    return tasks.filter((t) => t.q === q);
  };

  const openDrawer = (task: Task) => {
    setActiveTask(task);
    setTitle(task.title);
    setNote(task.note);
    setTags(task.tags.join(', '));
    setColor(task.color);
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

  const handleMoveToQuadrant = (task: Task, quadrant: Quadrant) => {
    const newQ = quadrant === 'unassigned' ? null : quadrant;
    updateTask(task.id, { q: newQ });
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Eisenhower Matrix</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.muted }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  const renderTask = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={[
        styles.task,
        { backgroundColor: theme.taskBg, borderColor: theme.border },
        task.completed && styles.taskCompleted,
      ]}
      onPress={() => openDrawer(task)}
    >
      <TouchableOpacity
        style={[styles.checkbox, { borderColor: theme.border, backgroundColor: theme.card }]}
        onPress={() => handleToggleComplete(task)}
      >
        {task.completed && <Text style={[styles.checkmark, { color: theme.text }]}>*</Text>}
      </TouchableOpacity>
      <View style={[styles.taskColor, { backgroundColor: task.color }]} />
      <Text
        style={[styles.taskTitle, { color: theme.text }, task.completed && styles.completedText]}
        numberOfLines={1}
      >
        {task.title || 'Untitled'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Eisenhower Matrix</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Unassigned Section */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.cardHeader, { backgroundColor: theme.muted }]}>
            <Text style={styles.cardTitle}>Unassigned</Text>
            <Text style={styles.cardSubtitle}>Tap task to assign</Text>
          </View>
          <View style={styles.taskList}>
            {getTasksByQuadrant('unassigned').length === 0 ? (
              <Text style={[styles.emptyCardText, { color: theme.muted }]}>No unassigned tasks</Text>
            ) : (
              getTasksByQuadrant('unassigned').map(renderTask)
            )}
          </View>
        </View>

        {/* Matrix Grid */}
        {QUADRANTS.map((q) => (
          <View
            key={q.id}
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.cardHeader, { backgroundColor: q.color }]}>
              <Text style={styles.cardTitle}>{q.title}</Text>
              <Text style={styles.cardSubtitle}>{q.subtitle}</Text>
            </View>
            <View style={styles.taskList}>
              {getTasksByQuadrant(q.id).length === 0 ? (
                <Text style={[styles.emptyCardText, { color: theme.muted }]}>No tasks</Text>
              ) : (
                getTasksByQuadrant(q.id).map(renderTask)
              )}
            </View>
          </View>
        ))}
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

              <Text style={[styles.label, { color: theme.muted }]}>Move to Quadrant</Text>
              <View style={styles.quadrantButtons}>
                <TouchableOpacity
                  style={[styles.quadrantBtn, { backgroundColor: theme.muted }]}
                  onPress={() => {
                    if (activeTask) handleMoveToQuadrant(activeTask, 'unassigned');
                  }}
                >
                  <Text style={styles.quadrantBtnText}>Unassigned</Text>
                </TouchableOpacity>
                {QUADRANTS.map((q) => (
                  <TouchableOpacity
                    key={q.id}
                    style={[styles.quadrantBtn, { backgroundColor: q.color }]}
                    onPress={() => {
                      if (activeTask) handleMoveToQuadrant(activeTask, q.id);
                    }}
                  >
                    <Text style={styles.quadrantBtnText}>{q.subtitle}</Text>
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
    card: {
      borderWidth: 3,
      borderRadius: 3,
      marginBottom: 16,
    },
    cardHeader: {
      padding: 14,
    },
    cardTitle: {
      color: '#ffffff',
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    cardSubtitle: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: 12,
      fontFamily: 'ShortStack_400Regular',
      marginTop: 2,
    },
    taskList: {
      padding: 12,
      minHeight: 60,
    },
    emptyCardText: {
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
      textAlign: 'center',
      padding: 12,
    },
    task: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderWidth: 2,
      borderRadius: 2,
      marginBottom: 8,
    },
    taskCompleted: {
      opacity: 0.6,
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
      fontSize: 16,
      fontFamily: 'ShortStack_400Regular',
    },
    taskColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 10,
    },
    taskTitle: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'ShortStack_400Regular',
    },
    completedText: {
      textDecorationLine: 'line-through',
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
    quadrantButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    quadrantBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 2,
    },
    quadrantBtnText: {
      color: '#ffffff',
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
