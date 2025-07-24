# My Tasks - React Native Mobile Application

A feature-rich task management mobile application built with React Native and Expo, featuring local notifications, data persistence, and priority-based task organization.

## Important File Location

**Main Application Code**: `app/index.jsx`  
Replace the content of this file with the provided enhanced task management code.

## Features

### Core Functionality
- ✅ **Task Input**: Clean text input with multi-line support
- ✅ **Task List Display**: Scrollable list with professional UI
- ✅ **Task Completion**: Toggle completion with visual feedback
- ✅ **Delete Task**: Remove tasks with confirmation dialog
- ✅ **Local Notifications**: Automatic reminders using Expo Notifications
- ✅ **Notification Cancellation**: Smart cancellation when tasks are completed

### Bonus Features
- **Data Persistence**: Tasks saved locally using AsyncStorage
- **Edit Tasks**: Modify existing task text with modal interface
- **Task Prioritization**: Three-level priority system (High/Medium/Low)
- **Priority Filtering**: Filter tasks by priority level
- **Enhanced UI/UX**: Smooth animations, modern design, and intuitive interactions

## Quick Start

### Prerequisites
- Node.js (v14 or higher) ✅ *Already installed*
- npm or yarn ✅ *Already available*
- Expo CLI ✅ *Already configured*
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

1. **Navigate to your existing project**
```bash
cd AFFWORLD
```

2. **Install required dependencies**
```bash
npm install expo-notifications @react-native-async-storage/async-storage @expo/vector-icons
```

3. **Replace the app/index.jsx with the provided code**
- Copy the enhanced code into your `app/index.jsx` file

4. **Start the development server**
```bash
npx expo start
```

5. **Run on device/simulator**
- Press `i` for iOS Simulator
- Press `a` for Android Emulator  
- Scan QR code with Expo Go app on physical device

## Dependencies

Add these to your existing `package.json`:

```json
{
  "dependencies": {
    "expo-notifications": "~0.23.0",
    "@react-native-async-storage/async-storage": "1.18.2",
    "@expo/vector-icons": "^13.0.0"
  }
}
```

**Installation command:**
```bash
npm install expo-notifications @react-native-async-storage/async-storage @expo/vector-icons
```

## Project Structure

```
AFFWORLD/
├── expo/
├── .vscode/
├── app/
│   ├── _layout.tsx        # Layout configuration
│   └── index.jsx          # Main application component
├── assets/                # Images, fonts, and other static assets
├── node_modules/          # Dependencies
├── .gitignore            # Git ignore rules
├── app.json              # Expo configuration
├── eslint.config.js      # ESLint configuration
├── expo-env.d.ts         # TypeScript environment definitions
├── package-lock.json     # Dependency lock file
├── package.json          # Dependencies and scripts
├── README.md             # This file
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Configuration

### Existing Configuration
Your project already has:
- ✅ **Expo Router**: App directory routing configured
- ✅ **TypeScript**: Type definitions and tsconfig.json
- ✅ **ESLint**: Code quality and formatting rules
- ✅ **Expo Environment**: Development environment ready

### Notification Permissions
The app automatically requests notification permissions on first launch. For testing:
- **iOS**: Permissions dialog appears automatically
- **Android**: Permissions are granted by default in development

### Notification Timing
- **High Priority**: 30 seconds after task creation
- **Medium Priority**: 60 seconds after task creation  
- **Low Priority**: 120 seconds after task creation

## 📖 Usage Guide

### Adding Tasks
1. Type your task in the input field
2. Select priority level (High/Medium/Low)
3. Tap the "+" button or press Enter
4. Receive confirmation with reminder timing

### Managing Tasks
- **Complete**: Tap checkbox to mark as done
- **Edit**: Tap pencil icon to modify task text
- **Delete**: Tap trash icon (with confirmation dialog)
- **Filter**: Use priority filter buttons at top

### Priority System
- 🔴 **High**: Urgent tasks (red indicator)
- 🟡 **Medium**: Normal tasks (yellow indicator)  
- 🟢 **Low**: Optional tasks (green indicator)

## Testing Notifications

1. Add a task with any priority
2. Wait for the specified time (30-120 seconds)
3. Notification should appear with task details
4. Mark task complete to cancel pending notifications

## Design Highlights

### User Experience
- **Smooth Animations**: Fade-in effects for visual appeal
- **Intuitive Interface**: Clean, modern design following platform conventions
- **Visual Feedback**: Clear indicators for task states and priorities
- **Responsive Layout**: Optimized for various screen sizes

### Code Quality
- **Component Architecture**: Single-file structure for simplicity
- **State Management**: Efficient use of React hooks
- **Error Handling**: Proper exception handling for notifications and storage
- **Performance**: Optimized rendering with FlatList

## 🔍 Code Architecture

### Key Components
```javascript
// State Management
const [tasks, setTasks] = useState([]);           // Task list
const [taskInput, setTaskInput] = useState("");   // Input field
const [editingTask, setEditingTask] = useState(null); // Edit modal state

// Core Functions
addTask()              // Creates new task with notification
toggleTaskCompletion() // Handles completion toggle
deleteTask()           // Removes task with confirmation
editTask()             // Opens edit modal
```

### Data Structure
```javascript
const task = {
  id: "unique_timestamp",
  text: "Task description",
  completed: false,
  priority: "high|medium|low",
  createdAt: "ISO_string",
  notificationId: "expo_notification_id"
}
```

##Troubleshooting

### Common Issues

**Notifications not working:**
- Ensure permissions are granted
- Check device notification settings
- Verify app is in foreground/background as expected

**Tasks not persisting:**
- AsyncStorage permissions issue (rare)
- Check console for storage errors

**App crashes on start:**
- Verify all dependencies are installed: `npm install`
- Clear expo cache: `npx expo start -c`
- Check if TypeScript compilation is successful
- Ensure app/index.jsx has the correct export structure

### Development Tips
- Your project already has TypeScript support configured
- ESLint is already set up for code quality
- Use `npx expo start -c` to clear cache if issues occur
- Test notifications on physical device for best results
- Check console logs for detailed error messages
- The app uses Expo Router (app directory structure)

## Platform Compatibility

- ✅ **iOS**: Full functionality including notifications
- ✅ **Android**: Full functionality including notifications
- 🌐 **Web**: Basic functionality (notifications limited)

## Future Enhancements

Potential improvements for production use:
- [ ] Cloud synchronization
- [ ] Task categories/tags
- [ ] Due date management
- [ ] Task sharing functionality
- [ ] Dark mode support
- [ ] Widget support

## Support

For issues or questions:
1. Check this README.md first
2. Verify all dependencies are correctly installed
3. Test on a clean Expo project if problems persist
4. Check Expo documentation for platform-specific issues

## License

This project is created for evaluation purposes. Feel free to use and modify as needed.

---

