# My Tasks - React Native Mobile Application

**Developer:** Princeraj Parmar

## Description

My Tasks is a comprehensive task management mobile application built with React Native and Expo. The app provides users with an intuitive interface to create, manage, and track their daily tasks with smart notification reminders. Key features include task prioritization, local data persistence, and a modern user interface with smooth animations.

## Features

### Core Functionality
- Task Input: Clean text input with multi-line support
- Task List Display: Scrollable list with professional UI
- Task Completion: Toggle completion with visual feedback
- Delete Task: Remove tasks with confirmation dialog
- Local Notifications: Automatic reminders using Expo Notifications
- Notification Cancellation: Smart cancellation when tasks are completed

### Enhanced Features
- Data Persistence: Tasks saved locally using AsyncStorage
- Edit Tasks: Modify existing task text with modal interface
- Task Prioritization: Three-level priority system (High/Medium/Low)
- Priority Filtering: Filter tasks by priority level
- Enhanced UI/UX: Smooth animations, modern design, and intuitive interactions

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo Go app installed on your mobile device
- iOS Simulator or Android Emulator (optional)

### Installation Steps

1. **Navigate to the project directory**
```bash
cd AFFWORLD
```

2. **Install required dependencies**
```bash
npm install expo-notifications @react-native-async-storage/async-storage @expo/vector-icons
```

3. **Replace app/index.jsx**
- Copy the provided enhanced task management code
- Replace the entire content of `app/index.jsx` with the new code

4. **Start the development server**
```bash
npx expo start
```

5. **Run the application**

**Option A: Physical Device (Recommended)**
- Open Expo Go app on your phone
- Scan the QR code displayed in the terminal
- The app will load automatically

**Option B: Simulator/Emulator**
- Press `i` for iOS Simulator
- Press `a` for Android Emulator

## Testing the Application

### Basic Functionality Test
1. Add a new task with different priority levels
2. Toggle task completion status
3. Edit existing tasks using the pencil icon
4. Delete tasks (confirmation dialog will appear)
5. Filter tasks by priority using the filter buttons

### Notification Testing
1. Add a task with High priority (30-second reminder)
2. Keep the app open or minimize it
3. Wait 30 seconds - notification should appear
4. Mark the task as complete to cancel future notifications

## Technical Implementation

### Architecture Decisions

**Single File Structure**: The application is contained in one main component file for simplicity and easy evaluation. In a production environment, this would be split into multiple components for better maintainability.

**State Management**: Uses React hooks (useState, useEffect) for efficient state management. The app maintains separate state for tasks, input fields, modal visibility, and animations.

**Data Persistence Strategy**: Implements AsyncStorage for local data persistence with automatic saving on state changes and error handling for storage failures.

### Challenges Faced and Solutions

**Challenge 1: Notification Lifecycle Management**
Managing notification scheduling, cancellation, and cleanup proved complex. The solution involved storing notification IDs with each task and implementing proper cleanup in all task operations (completion, deletion, editing).

**Challenge 2: Priority-Based User Experience**
Creating an intuitive priority system required careful consideration of visual indicators, notification timing, and task sorting. The solution uses color-coded priorities with different notification delays (High: 30s, Medium: 60s, Low: 120s).

**Challenge 3: Data Consistency**
Ensuring data persistence works reliably across app restarts and handles edge cases. The solution implements try-catch blocks around all AsyncStorage operations with graceful error handling.

**Challenge 4: Performance Optimization**
Managing smooth animations while maintaining list performance with many tasks. The solution uses FlatList for efficient rendering, native driver for animations, and optimized state updates.

### Interesting Design Choices

**Animated UI Elements**: Implemented fade-in animations to enhance user experience and provide visual feedback for user actions.

**Priority-Based Notification Timing**: Different priority levels trigger notifications at different intervals, making high-priority tasks more urgent and low-priority tasks less intrusive.

**Confirmation Dialogs**: Added confirmation dialogs for destructive actions (delete) to prevent accidental data loss.

**Modal-Based Editing**: Chose modal interface for task editing to maintain context while providing a focused editing experience.

**Smart Notification Cancellation**: Automatically cancels pending notifications when tasks are marked complete, preventing unnecessary interruptions.

## Project Structure

```
AFFWORLD/
├── app/
│   ├── _layout.tsx        # Layout configuration
│   └── index.jsx          # Main application component (replace this file)
├── assets/                # Static assets
├── node_modules/          # Dependencies
├── .gitignore            
├── app.json              # Expo configuration
├── eslint.config.js      # ESLint configuration
├── package.json          # Dependencies and scripts
├── README.md             # This file
└── tsconfig.json         # TypeScript configuration
```

## Dependencies

The following packages are required and will be installed with the setup command:

- `expo-notifications`: Local notification management
- `@react-native-async-storage/async-storage`: Local data persistence
- `@expo/vector-icons`: Icon library for UI elements

## Troubleshooting

**Notifications not appearing:**
- Ensure notification permissions are granted when prompted
- Test on a physical device for best results
- Check device notification settings

**App crashes on startup:**
- Run `npm install` to ensure all dependencies are installed
- Clear Expo cache with `npx expo start -c`
- Verify the code is properly placed in `app/index.jsx`

**Tasks not persisting:**
- Check console for AsyncStorage errors
- Restart the app to test persistence
- Ensure sufficient device storage space

## Platform Compatibility

- **iOS**: Full functionality including notifications
- **Android**: Full functionality including notifications  
- **Web**: Basic functionality (notifications may be limited)

## Future Enhancements

- Cloud synchronization for cross-device access
- Task categories and tags
- Due date management with calendar integration
- Task sharing and collaboration features
- Dark mode theme support
- Widget support for quick task access

---

This application demonstrates proficiency in React Native development, state management, local notifications, data persistence, and modern mobile UI/UX design principles.
