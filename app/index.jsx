/**
 * My Tasks - React Native Mobile Application (Web-Optimized)
 * 
 * A comprehensive task management app with local notifications,
 * data persistence, and priority-based organization.
 * 
 * Features:
 * - Task CRUD operations
 * - Priority-based notifications
 * - Data persistence with AsyncStorage/localStorage
 * - Modern UI with animations
 * - Task filtering and sorting
 * - Web-optimized interactions
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";

// ===========================
// CONSTANTS & CONFIGURATION
// ===========================

const STORAGE_KEY = 'myTasks';
const IS_WEB = Platform.OS === 'web';

const PRIORITY_CONFIG = {
  high: {
    color: '#dc3545',
    label: 'High',
    icon: 'alert-circle',
    notificationDelay: 30, // seconds
  },
  medium: {
    color: '#ffc107',
    label: 'Medium',
    icon: 'time',
    notificationDelay: 60,
  },
  low: {
    color: '#28a745',
    label: 'Low',
    icon: 'checkmark-circle',
    notificationDelay: 120,
  }
};

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: !IS_WEB, // No sound on web
    shouldSetBadge: false,
  }),
});

// ===========================
// MAIN COMPONENT
// ===========================

export default function App() {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // Edit modal state
  const [editingTask, setEditingTask] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTaskText, setEditTaskText] = useState("");
  
  // Delete confirmation modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Animation
  const [fadeAnim] = useState(new Animated.Value(0));

  // ===========================
  // LIFECYCLE & SETUP
  // ===========================

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const initializeApp = async () => {
    if (!IS_WEB) {
      await requestNotificationPermissions();
    }
    await loadTasks();
    startFadeInAnimation();
  };

  const startFadeInAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // ===========================
  // PERMISSIONS & SETUP
  // ===========================

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Notifications Disabled",
          "Enable notifications in settings to receive task reminders.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  // ===========================
  // WEB-OPTIMIZED ALERT SYSTEM
  // ===========================

  const showAlert = (title, message, buttons = [{ text: "OK" }]) => {
    if (IS_WEB) {
      // Use custom modal for web instead of native Alert
      if (buttons.length > 1) {
        // For confirmation dialogs, we'll use our custom modal
        return Promise.resolve();
      } else {
        // For simple alerts, use browser alert
        alert(`${title}\n\n${message}`);
        return Promise.resolve();
      }
    } else {
      Alert.alert(title, message, buttons);
    }
  };

  // ===========================
  // DATA PERSISTENCE
  // ===========================

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
        console.log(`Loaded ${parsedTasks.length} tasks from storage`);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      showAlert('Storage Error', 'Failed to load saved tasks.');
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // ===========================
  // TASK OPERATIONS
  // ===========================

  const addTask = async () => {
    // Validation
    if (taskInput.trim() === "") {
      showAlert("Invalid Input", "Please enter a task description.");
      return;
    }

    const newTask = createNewTask();
    
    try {
      let notificationId = null;
      
      // Only schedule notifications on mobile or if browser supports it
      if (!IS_WEB) {
        notificationId = await scheduleTaskNotification(newTask);
      } else {
        // For web, try browser notifications
        try {
          notificationId = await scheduleBrowserNotification(newTask);
        } catch (error) {
          console.log('Browser notifications not supported:', error);
        }
      }
      
      newTask.notificationId = notificationId;
      
      setTasks(prevTasks => [newTask, ...prevTasks]);
      resetInputForm();
      showTaskAddedConfirmation(newTask.priority);
      
    } catch (error) {
      console.error("Error scheduling notification:", error);
      // Add task even if notification fails
      setTasks(prevTasks => [newTask, ...prevTasks]);
      resetInputForm();
    }
  };

  const createNewTask = () => ({
    id: Date.now().toString(),
    text: taskInput.trim(),
    completed: false,
    priority: selectedPriority,
    createdAt: new Date().toISOString(),
    notificationId: null,
  });

  const scheduleTaskNotification = async (task) => {
    const priorityConfig = PRIORITY_CONFIG[task.priority];
    
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: `${priorityConfig.label} Priority Task! 📝`,
        body: `Time to complete: ${task.text}`,
        sound: true,
        data: { taskId: task.id },
      },
      trigger: { seconds: priorityConfig.notificationDelay },
    });
  };

  const scheduleBrowserNotification = async (task) => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const priorityConfig = PRIORITY_CONFIG[task.priority];
        setTimeout(() => {
          new Notification(`${priorityConfig.label} Priority Task! 📝`, {
            body: `Time to complete: ${task.text}`,
            icon: '/favicon.ico', // You can add an icon
          });
        }, priorityConfig.notificationDelay * 1000);
        return 'browser-notification';
      }
    }
    return null;
  };

  const resetInputForm = () => {
    setTaskInput("");
    setSelectedPriority('medium');
  };

  const showTaskAddedConfirmation = (priority) => {
    const delay = PRIORITY_CONFIG[priority].notificationDelay;
    const message = IS_WEB 
      ? `Task added! ${delay < 60 ? delay + ' seconds' : Math.floor(delay/60) + ' minutes'} reminder set.`
      : `You'll receive a reminder in ${delay} seconds.`;
    
    showAlert("Task Added Successfully!", message);
  };

  const toggleTaskCompletion = async (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed: !task.completed };
          
          // Cancel notification if task is completed
          if (updatedTask.completed && task.notificationId) {
            cancelTaskNotification(task.notificationId);
          }
          
          return updatedTask;
        }
        return task;
      })
    );
  };

  const cancelTaskNotification = async (notificationId) => {
    try {
      if (!IS_WEB && notificationId !== 'browser-notification') {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      // For browser notifications, we can't cancel them once scheduled
    } catch (error) {
      console.warn("Error cancelling notification:", error);
    }
  };

  // ===========================
  // WEB-OPTIMIZED DELETE FUNCTIONALITY
  // ===========================

  const deleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (IS_WEB) {
      // Use custom modal for web
      setTaskToDelete(task);
      setDeleteModalVisible(true);
    } else {
      // Use native Alert for mobile
      Alert.alert(
        "Delete Task",
        "Are you sure you want to delete this task?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: () => performTaskDeletion(taskId)
          }
        ]
      );
    }
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      performTaskDeletion(taskToDelete.id);
    }
    setDeleteModalVisible(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setTaskToDelete(null);
  };

  const performTaskDeletion = async (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    // Cancel associated notification
    if (taskToDelete?.notificationId) {
      await cancelTaskNotification(taskToDelete.notificationId);
    }
    
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // ===========================
  // EDIT FUNCTIONALITY
  // ===========================

  const editTask = (task) => {
    setEditingTask(task);
    setEditTaskText(task.text);
    setEditModalVisible(true);
  };

  const saveEditedTask = () => {
    if (editTaskText.trim() === "") {
      showAlert("Invalid Input", "Task description cannot be empty.");
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editingTask.id
          ? { ...task, text: editTaskText.trim() }
          : task
      )
    );

    closeEditModal();
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingTask(null);
    setEditTaskText("");
  };

  // ===========================
  // FILTERING & SORTING
  // ===========================

  const getFilteredTasks = () => {
    if (filterPriority === 'all') return tasks;
    return tasks.filter(task => task.priority === filterPriority);
  };

  const getSortedTasks = () => {
    const filteredTasks = getFilteredTasks();
    const completed = filteredTasks.filter(task => task.completed);
    const incomplete = filteredTasks.filter(task => !task.completed);
    
    // Sort incomplete tasks by priority (high -> medium -> low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    incomplete.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    return [...incomplete, ...completed];
  };

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

  const getTaskStats = () => {
    const filteredTasks = getFilteredTasks();
    return {
      completed: filteredTasks.filter(task => task.completed).length,
      incomplete: filteredTasks.filter(task => !task.completed).length,
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // ===========================
  // RENDER METHODS
  // ===========================

  const renderPrioritySelector = () => (
    <View style={styles.priorityContainer}>
      <Text style={styles.priorityLabel}>Priority:</Text>
      {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
        <TouchableOpacity
          key={priority}
          style={[
            styles.priorityButton,
            { borderColor: config.color },
            selectedPriority === priority && { backgroundColor: config.color }
          ]}
          onPress={() => setSelectedPriority(priority)}
          accessibilityLabel={`Set priority to ${config.label}`}
        >
          <Text style={[
            styles.priorityButtonText,
            selectedPriority === priority && { color: '#fff' }
          ]}>
            {config.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterPriority === 'all' && styles.filterButtonActive
        ]}
        onPress={() => setFilterPriority('all')}
        accessibilityLabel="Show all tasks"
      >
        <Text style={[
          styles.filterButtonText,
          filterPriority === 'all' && styles.filterButtonTextActive
        ]}>All</Text>
      </TouchableOpacity>
      
      {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
        <TouchableOpacity
          key={priority}
          style={[
            styles.filterButton,
            filterPriority === priority && styles.filterButtonActive
          ]}
          onPress={() => setFilterPriority(priority)}
          accessibilityLabel={`Filter ${config.label} priority tasks`}
        >
          <Text style={[
            styles.filterButtonText,
            filterPriority === priority && styles.filterButtonTextActive
          ]}>
            {config.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTaskItem = ({ item }) => {
    const priorityConfig = PRIORITY_CONFIG[item.priority];
    
    return (
      <Animated.View
        style={[
          styles.taskItem,
          { 
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          }
        ]}
      >
        <View style={styles.taskContent}>
          <TouchableOpacity
            style={[
              styles.checkbox, 
              item.completed && styles.checkboxCompleted
            ]}
            onPress={() => toggleTaskCompletion(item.id)}
            accessibilityLabel={item.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {item.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
          </TouchableOpacity>

          <View style={styles.taskInfo}>
            <View style={styles.taskHeader}>
              <Ionicons 
                name={priorityConfig.icon} 
                size={16} 
                color={priorityConfig.color} 
              />
              <Text style={[styles.priorityText, { color: priorityConfig.color }]}>
                {priorityConfig.label}
              </Text>
            </View>
            
            <Text
              style={[styles.taskText, item.completed && styles.taskTextCompleted]}
              numberOfLines={2}
            >
              {item.text}
            </Text>
            
            <Text style={styles.taskDate}>
              Created: {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.taskActions}>
          <TouchableOpacity
            style={[styles.editButton, IS_WEB && styles.webOptimizedButton]}
            onPress={() => editTask(item)}
            accessibilityLabel="Edit task"
          >
            <Ionicons name="pencil" size={18} color="#007bff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.deleteButton, IS_WEB && styles.webOptimizedButton]}
            onPress={() => deleteTask(item.id)}
            accessibilityLabel="Delete task"
          >
            <Ionicons name="trash-outline" size={18} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => {
    const isEmpty = filterPriority === 'all';
    
    return (
      <View style={styles.emptyState}>
        <Ionicons name="clipboard-outline" size={64} color="#ccc" />
        <Text style={styles.emptyStateText}>
          {isEmpty ? 'No tasks yet!' : `No ${PRIORITY_CONFIG[filterPriority]?.label.toLowerCase()} priority tasks!`}
        </Text>
        <Text style={styles.emptyStateSubtext}>
          {isEmpty ? 'Add your first task above' : 'Try a different filter or add new tasks'}
        </Text>
      </View>
    );
  };

  const renderEditModal = () => (
    <Modal
      visible={editModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={closeEditModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Task</Text>
          
          <TextInput
            style={styles.modalInput}
            value={editTaskText}
            onChangeText={setEditTaskText}
            placeholder="Enter task text..."
            multiline={true}
            maxLength={200}
            autoFocus={true}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={closeEditModal}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={saveEditedTask}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDeleteModal = () => (
    <Modal
      visible={deleteModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={cancelDelete}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete Task</Text>
          
          <Text style={styles.deleteModalText}>
            Are you sure you want to delete this task?
          </Text>
          
          {taskToDelete && (
            <Text style={styles.deleteModalTaskText}>
              "{taskToDelete.text}"
            </Text>
          )}
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={cancelDelete}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteConfirmButton]}
              onPress={confirmDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ===========================
  // MAIN RENDER
  // ===========================

  const sortedTasks = getSortedTasks();
  const { completed, incomplete } = getTaskStats();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <Text style={styles.headerSubtitle}>
          {incomplete} pending • {completed} completed
          {IS_WEB && <Text style={styles.webIndicator}> • Web Version</Text>}
        </Text>
      </View>

      {/* Filter Buttons */}
      {renderFilterButtons()}

      {/* Task Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a new task..."
            value={taskInput}
            onChangeText={setTaskInput}
            onSubmitEditing={addTask}
            multiline={true}
            maxLength={200}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              taskInput.trim() === "" && styles.addButtonDisabled,
              IS_WEB && styles.webOptimizedButton,
            ]}
            onPress={addTask}
            disabled={taskInput.trim() === ""}
            accessibilityLabel="Add task"
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {renderPrioritySelector()}
      </View>

      {/* Tasks List */}
      <View style={styles.listContainer}>
        {sortedTasks.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={sortedTasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Edit Task Modal */}
      {renderEditModal()}

      {/* Delete Confirmation Modal */}
      {renderDeleteModal()}
    </SafeAreaView>
  );
}

// ===========================
// STYLES
// ===========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6c757d",
  },
  webIndicator: {
    color: "#007bff",
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  inputSection: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 10,
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    maxHeight: 80,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonDisabled: {
    backgroundColor: "#adb5bd",
  },
  webOptimizedButton: {
    minWidth: 44,
    minHeight: 44,
    cursor: 'pointer',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  priorityLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 10,
    fontWeight: '500',
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#dee2e6",
    marginRight: 12,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#28a745",
    borderColor: "#28a745",
  },
  taskInfo: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  taskText: {
    fontSize: 16,
    color: "#212529",
    lineHeight: 22,
    marginBottom: 4,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#6c757d",
  },
  taskDate: {
    fontSize: 11,
    color: '#adb5bd',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6c757d",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#adb5bd",
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 10,
  },
  deleteModalTaskText: {
    fontSize: 14,
    color: '#212529',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44, // Better touch target for web
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  saveButton: {
    backgroundColor: '#007bff',
    marginLeft: 10,
  },
  deleteConfirmButton: {
    backgroundColor: '#dc3545',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#6c757d',
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});