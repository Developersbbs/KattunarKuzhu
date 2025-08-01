# Kattunar Kuzhu App

A business networking app built with Expo, React Native, and GlueStack UI.

## Features

- Multi-step onboarding with pagination and animations
- Phone-based OTP login system with country code selection
- Dark/Light theme support with system preference detection
- File-based routing with Expo Router
- Custom UI components built with GlueStack UI
- Responsive design for various screen sizes

## New Components

### NotificationPanel

A full-screen notification panel that slides in from the right side. The panel displays notifications grouped by date and supports different notification types with appropriate styling.

#### Usage

```tsx
import NotificationPanel from "@/components/NotificationPanel";
import { useState } from "react";

// Define notification types
type NotificationType = 'info' | 'success' | 'warning' | 'meeting';

// Define notification interface
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

function MyScreen() {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  
  // Sample notifications
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'meeting',
      title: 'Weekly Business Meet',
      message: 'Your meeting starts in 30 minutes.',
      time: 'Today 09:30 AM',
      read: false,
    },
    // More notifications...
  ];

  const handleNotificationPress = (notification: Notification) => {
    console.log('Notification pressed:', notification);
    setShowNotificationPanel(false);
  };

  return (
    <>
      {/* Your screen content */}
      <Button onPress={() => setShowNotificationPanel(true)}>
        Show Notifications
      </Button>

      {/* Notification Panel */}
      <NotificationPanel 
        isVisible={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
        notifications={notifications}
        onNotificationPress={handleNotificationPress}
        onClearAll={() => console.log('Clear all')}
      />
    </>
  );
}
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| isVisible | boolean | Controls the visibility of the notification panel |
| onClose | () => void | Function called when the panel is closed |
| notifications | Notification[] | Array of notification objects to display |
| onNotificationPress | (notification: Notification) => void | Optional callback when a notification is pressed |
| onClearAll | () => void | Optional callback when "Clear All" is pressed |

#### Notification Types

The component supports four notification types, each with its own styling:

- `info`: General information notifications (blue)
- `success`: Success or completion notifications (green)
- `warning`: Warning or alert notifications (orange/yellow)
- `meeting`: Meeting-related notifications (purple, matches app theme)

## Development

### Running the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### Environment Variables

- `DARK_MODE=media` - Controls theme based on system preferences
