import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  BackHandler,
  Platform,
  StatusBar,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { X, Bell, CheckCircle, AlertCircle, Info, Calendar, Clock } from 'lucide-react-native';
import { ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

type NotificationType = 'info' | 'success' | 'warning' | 'meeting';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  isVisible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationPress?: (notification: Notification) => void;
  onClearAll?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isVisible,
  onClose,
  notifications,
  onNotificationPress,
  onClearAll,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const slideAnim = useRef(new Animated.Value(width)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Handle back button press on Android
  useEffect(() => {
    const backAction = () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isVisible, onClose]);

  // Handle animation when visibility changes
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, backdropOpacity]);

  // Function to get icon based on notification type
  const getNotificationIcon = (type: NotificationType, color: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={color} />;
      case 'warning':
        return <AlertCircle size={20} color={color} />;
      case 'meeting':
        return <Calendar size={20} color={color} />;
      case 'info':
      default:
        return <Info size={20} color={color} />;
    }
  };

  // Function to get notification background color based on type and theme
  const getNotificationBgColor = (type: NotificationType, read: boolean) => {
    if (read) {
      return colorScheme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(245, 245, 245, 0.8)';
    }

    switch (type) {
      case 'success':
        return colorScheme === 'dark' ? 'rgba(0, 120, 60, 0.2)' : 'rgba(0, 150, 80, 0.1)';
      case 'warning':
        return colorScheme === 'dark' ? 'rgba(180, 100, 0, 0.2)' : 'rgba(240, 140, 0, 0.1)';
      case 'meeting':
        return colorScheme === 'dark' ? 'rgba(160, 118, 249, 0.2)' : 'rgba(45, 18, 72, 0.1)';
      case 'info':
      default:
        return colorScheme === 'dark' ? 'rgba(0, 100, 180, 0.2)' : 'rgba(0, 120, 220, 0.1)';
    }
  };

  // Function to get notification icon color based on type
  const getNotificationIconColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return colorScheme === 'dark' ? '#4CAF50' : '#2E7D32';
      case 'warning':
        return colorScheme === 'dark' ? '#FFC107' : '#F57C00';
      case 'meeting':
        return colorScheme === 'dark' ? '#A076F9' : theme.tint;
      case 'info':
      default:
        return colorScheme === 'dark' ? '#2196F3' : '#0D47A1';
    }
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups: Record<string, Notification[]>, notification) => {
    const date = notification.time.split(' ')[0]; // Extract date part
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  if (!isVisible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
            backgroundColor: colorScheme === 'dark' ? '#000000' : '#000000',
          },
        ]}
        onTouchEnd={onClose}
      />

      {/* Panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateX: slideAnim }],
            backgroundColor: colorScheme === 'dark' ? theme.background : '#FFFFFF',
            paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
          },
        ]}
      >
        {/* Header */}
        <Box className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <Box className="flex-row items-center">
            <Bell size={22} color={theme.text} />
            <Text className="text-lg font-semibold ml-2" style={{ color: theme.text }}>
              Notifications
            </Text>
          </Box>
          <Box className="flex-row items-center">
            <TouchableOpacity 
              className="px-3 py-1 rounded-lg mr-2" 
              style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(160, 118, 249, 0.2)' : 'rgba(45, 18, 72, 0.1)' }}
              onPress={onClearAll}
            >
              <Text className="text-sm" style={{ color: colorScheme === 'dark' ? '#A076F9' : theme.tint }}>
                Clear All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={theme.text} />
            </TouchableOpacity>
          </Box>
        </Box>

        {/* Notifications List */}
        <ScrollView className="flex-1">
          {Object.keys(groupedNotifications).length > 0 ? (
            Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <Box key={date} className="mb-4">
                <Box className="px-4 py-2">
                  <Text className="text-sm font-medium" style={{ color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }}>
                    {date}
                  </Text>
                </Box>

                {dateNotifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    className="px-4 py-3 border-b"
                    style={{ 
                      borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      backgroundColor: getNotificationBgColor(notification.type, notification.read),
                    }}
                    onPress={() => onNotificationPress?.(notification)}
                    activeOpacity={0.7}
                  >
                    <Box className="flex-row">
                      <Box className="mr-3 mt-1">
                        {getNotificationIcon(notification.type, getNotificationIconColor(notification.type))}
                      </Box>
                      <Box className="flex-1">
                        <Box className="flex-row items-center justify-between">
                          <Text className="font-semibold" style={{ color: theme.text }}>
                            {notification.title}
                          </Text>
                          <Box className="flex-row items-center">
                            <Clock size={12} color={colorScheme === 'dark' ? '#AAAAAA' : '#666666'} />
                            <Text className="text-xs ml-1" style={{ color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }}>
                              {notification.time.split(' ')[1]} {/* Extract time part */}
                            </Text>
                          </Box>
                        </Box>
                        <Text className="text-sm mt-1" style={{ color: theme.text }}>
                          {notification.message}
                        </Text>
                      </Box>
                    </Box>
                  </TouchableOpacity>
                ))}
              </Box>
            ))
          ) : (
            <Box className="flex-1 items-center justify-center py-20">
              <Bell size={40} color={colorScheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} />
              <Text className="mt-4 text-base" style={{ color: colorScheme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                No notifications yet
              </Text>
            </Box>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width,
    height: height,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default NotificationPanel; 