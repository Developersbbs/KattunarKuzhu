import React, { useState, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import Gradient from "@/assets/Icons/Gradient";
import { ScrollView, SafeAreaView, StatusBar, View, PanResponder, Animated, Dimensions, Appearance } from "react-native";
import { Image } from "@/components/ui/image";
import { Bell, Users, FileText, Calendar, Clock, X, Sun, Moon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import NotificationPanel from "@/components/NotificationPanel";

// Define the NotificationType
type NotificationType = 'info' | 'success' | 'warning' | 'meeting';

// Define the Notification type
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  // Meeting alert state
  const [showMeetingAlert, setShowMeetingAlert] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  
  // Sample notifications data
  const sampleNotifications: Notification[] = [
    {
      id: '1',
      type: 'meeting',
      title: 'Weekly Business Meet',
      message: 'Your meeting starts in 30 minutes. Don\'t forget to prepare your presentation.',
      time: 'Today 09:30 AM',
      read: false,
    },
    {
      id: '2',
      type: 'success',
      title: 'Referral Accepted',
      message: 'John Smith has accepted your business referral for IT services.',
      time: 'Today 08:15 AM',
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'New Connection Request',
      message: 'You have a new connection request from Sarah Williams.',
      time: 'Yesterday 03:45 PM',
      read: true,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Subscription Expiring',
      message: 'Your premium membership will expire in 3 days. Renew now to avoid interruption.',
      time: 'Yesterday 10:20 AM',
      read: true,
    },
    {
      id: '5',
      type: 'meeting',
      title: 'Product Showcase',
      message: 'You are invited to attend the product showcase tomorrow at 10:00 AM.',
      time: 'Yesterday 09:00 AM',
      read: true,
    },
  ];

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.timing(scale, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
        
        if (gestureState.dy > 100) {
          // Swipe down to dismiss
          Animated.timing(translateY, {
            toValue: 500,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowMeetingAlert(false);
            translateY.setValue(0);
          });
        } else {
          // Return to original position
          Animated.spring(translateY, {
            toValue: 0,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleNotificationPress = (notification: Notification) => {
    console.log('Notification pressed:', notification);
    // Handle notification press logic here
    setShowNotificationPanel(false);
  };

  const handleClearAllNotifications = () => {
    console.log('Clear all notifications');
    // Handle clear all notifications logic here
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <Box className="flex-1">
        <Box className="absolute top-0 left-0 right-0 bottom-0">
          <Gradient />
        </Box>
        
        <ScrollView className="flex-1 w-full pt-12 px-6">
          {/* Header */}
          <Box className="flex-1 w-full flex-row items-center justify-between py-4">
            <Box className="flex-row items-center gap-4">
              <Box className="rounded-full">
                <Image alt="default-user" source={require("@/assets/images/default-user.png")} className="h-16 w-16" />
              </Box>
              <Box>
                <Text className="text-2xl font-bold" style={{ color: theme.text }}>
                  Arjunan
                </Text>
                <Text className="text-sm font-medium" style={{ color: theme.text }}>Sanguine Blue Business Solutions</Text>
              </Box>
            </Box>
            <Box className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => setShowNotificationPanel(true)}>
                <Bell size={24} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                // Toggle between light and dark mode
                const nextColorScheme = colorScheme === "dark" ? "light" : "dark";
                Appearance.setColorScheme(nextColorScheme);
              }}>
                {colorScheme === "dark" ? (
                  <Sun size={24} color={theme.text} />
                ) : (
                  <Moon size={24} color={theme.text} />
                )}
              </TouchableOpacity>
            </Box>
          </Box>
          
          {/* Meeting Alert Card */}
          {showMeetingAlert && (
            <Box className="px-1 py-2">
              <Animated.View
                style={{
                  transform: [
                    { translateY },
                    { scale }
                  ],
                }}
                {...panResponder.panHandlers}
              >
                <Box
                  className="rounded-xl p-4 relative overflow-hidden"
                  style={{
                    backgroundColor: colorScheme === "dark" ? "#2A2A2A" : theme.tint,
                    shadowColor: colorScheme === "dark" ? "#000000" : "rgba(0,0,0,0.3)",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: colorScheme === "dark" ? 0.3 : 0.2,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  {/* Swipe indicator */}
                  <Box 
                    className="absolute top-2 left-1/2 h-1 rounded-full w-12"
                    style={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: [{ translateX: -24 }]
                    }}
                  />
                  
                  {/* Close button */}
                  <TouchableOpacity
                    className="absolute top-3 right-3"
                    onPress={() => setShowMeetingAlert(false)}
                  >
                    <X size={18} color="rgba(255, 255, 255, 0.7)" />
                  </TouchableOpacity>
                  
                  <Box className="mt-4">
                    {/* Meeting Time */}
                    <Box className="flex-row items-center mb-3">
                      <Clock size={16} color="rgba(255, 255, 255, 0.9)" />
                      <Text 
                        className="text-sm font-medium ml-2"
                        style={{ color: "rgba(255, 255, 255, 0.9)" }}
                      >
                        Today's Meeting
                      </Text>
                    </Box>
                    
                    {/* Meeting Details */}
                    <Box className="space-y-2">
                      <Text 
                        className="text-lg font-semibold"
                        style={{ color: "#FFFFFF" }}
                      >
                        Weekly Business Meet
                      </Text>
                      
                      <Box className="flex-row items-center justify-between">
                        <Box className="flex-row items-center">
                          <Box className="flex-row">
                            {[1, 2, 3].map((i) => (
                              <Box
                                key={i}
                                className="w-6 h-6 rounded-full items-center justify-center"
                                style={{
                                  backgroundColor: colorScheme === "dark" ? "#4A4A4A" : "rgba(255, 255, 255, 0.2)",
                                  borderWidth: 2,
                                  borderColor: colorScheme === "dark" ? "#2A2A2A" : theme.tint,
                                  marginLeft: i > 1 ? -8 : 0,
                                  zIndex: 4 - i,
                                }}
                              >
                                <Text className="text-xs" style={{ color: "#FFFFFF" }}>{i}</Text>
                              </Box>
                            ))}
                          </Box>
                          <Text 
                            className="text-sm ml-2"
                            style={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            +12 members
                          </Text>
                        </Box>
                        
                        <Box className="items-end">
                          <Text 
                            className="text-lg font-semibold"
                            style={{ color: "#FFFFFF" }}
                          >
                            10:00 AM
                          </Text>
                          <Text 
                            className="text-sm"
                            style={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            2 hours
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Action Button */}
                    <Button
                      className="w-full mt-4 h-12 rounded-lg"
                      style={{ 
                        backgroundColor: colorScheme === "dark" ? "#A076F9" : "#FFFFFF",
                      }}
                      onPress={() => {
                        // Handle attendance marking
                        console.log("Marking attendance");
                      }}
                    >
                      <ButtonText 
                        className="font-semibold"
                        style={{ 
                          color: colorScheme === "dark" ? "#FFFFFF" : theme.tint,
                        }}
                      >
                        Mark Attendance
                      </ButtonText>
                    </Button>
                  </Box>
                </Box>
              </Animated.View>
            </Box>
          )}
          
          {/* Dashboard Cards */}
          <Box className="mt-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-4"
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              {/* Referrals Card */}
              <Box 
                className="p-4 w-[280px] mr-4 backdrop-blur-sm rounded-xl drop-shadow-xl" 
                style={{ 
                  backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                  borderWidth: 1,
                  borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                }}
              >
                <Box className="flex-row justify-between">
                  <Box>
                    <Box className="flex-row items-center gap-2">
                      <Box 
                        className="p-2 rounded-xl" 
                        style={{ 
                          backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)",
                        }}
                      >
                        <Users size={16} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                      </Box>
                      <Text className="text-sm font-medium" style={{ color: theme.text }}>
                        Referrals
                      </Text>
                    </Box>
                    <Text className="text-2xl font-semibold mt-2" style={{ color: theme.text }}>248</Text>
                    <Box className="flex-row items-center gap-1 mt-1">
                      <Text className="text-xs font-medium" style={{ color: '#146331' }}>+12%</Text>
                      <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>vs last week</Text>
                    </Box>
                  </Box>
                  <Box className="items-end">
                    <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>This month</Text>
                    <Text className="text-lg font-medium mt-1" style={{ color: theme.text }}>+45</Text>
                    <Text className="text-xs mt-1" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>vs 32 last month</Text>
                  </Box>
                </Box>
              </Box>

              {/* Requirements Posts Card */}
              <Box 
                className="p-4 w-[280px] mr-4 backdrop-blur-sm rounded-xl drop-shadow-xl"
                style={{ 
                  backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                  borderWidth: 1,
                  borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                }}
              >
                <Box className="flex-row justify-between">
                  <Box>
                    <Box className="flex-row items-center gap-2">
                      <Box 
                        className="p-2 rounded-xl" 
                        style={{ 
                          backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)",
                        }}
                      >
                        <FileText size={16} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                      </Box>
                      <Text className="text-sm font-medium" style={{ color: theme.text }}>
                        Requirements
                      </Text>
                    </Box>
                    <Text className="text-2xl font-semibold mt-2" style={{ color: theme.text }}>156</Text>
                    <Box className="flex-row items-center gap-1 mt-1">
                      <Text className="text-xs font-medium" style={{ color: '#146331' }}>+8%</Text>
                      <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>vs last week</Text>
                    </Box>
                  </Box>
                  <Box className="items-end">
                    <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>This month</Text>
                    <Text className="text-lg font-medium mt-1" style={{ color: theme.text }}>+28</Text>
                    <Text className="text-xs mt-1" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>vs 24 last month</Text>
                  </Box>
                </Box>
              </Box>

              {/* Active Meetings Card */}
              <Box 
                className="p-4 w-[280px] backdrop-blur-sm rounded-xl drop-shadow-xl"
                style={{ 
                  backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                  borderWidth: 1,
                  borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                }}
              >
                <Box className="flex-row justify-between">
        <Box>
                    <Box className="flex-row items-center gap-2">
                      <Box 
                        className="p-2 rounded-xl" 
                        style={{ 
                          backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)",
                        }}
                      >
                        <Calendar size={16} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                      </Box>
                      <Text className="text-sm font-medium" style={{ color: theme.text }}>
                        Active Meetings
                      </Text>
                    </Box>
                    <Text className="text-2xl font-semibold mt-2" style={{ color: theme.text }}>42</Text>
                    <Box className="flex-row items-center gap-1 mt-1">
                      <Text className="text-xs font-medium" style={{ color: '#146331' }}>+15%</Text>
                      <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>vs last week</Text>
                    </Box>
                  </Box>
                  <Box className="items-end">
                    <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>This month</Text>
                    <Text className="text-lg font-medium mt-1" style={{ color: theme.text }}>+12</Text>
                    <Text className="text-xs mt-1" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>vs 8 last month</Text>
                  </Box>
                </Box>
              </Box>

            </ScrollView>
          </Box>
          
          {/* Requirements Post Chart Section */}
          <Box className="mt-6 px-1">
            <Box className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold" style={{ color: theme.text }}>
                Requirements
              </Text>
              <TouchableOpacity>
                <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                  View All
                </Text>
              </TouchableOpacity>
            </Box>
            
            {/* Chart Container */}
            <Box 
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Chart Header */}
              <Box className="flex-row justify-between items-center mb-4">
          <Box>
                  <Text className="text-sm font-medium" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                    Total Requirements
                  </Text>
                  <Text className="text-2xl font-bold mt-1" style={{ color: theme.text }}>
                    156
                  </Text>
                </Box>
                <Box 
                  className="flex-row items-center py-1 px-3 rounded-full"
                  style={{ 
                    backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.15)" : "rgba(45, 18, 72, 0.08)",
                  }}
                >
                  <Text className="text-xs font-medium" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                    Last 30 days
                  </Text>
                </Box>
              </Box>
              
              {/* Chart Visualization */}
              <Box className="h-[180px] mt-2">
                <Box className="flex-row justify-between items-end h-[140px] mb-1">
                  {[28, 45, 32, 38, 52, 40, 48].map((value, index) => {
                    // Calculate height percentage (max height is 140px)
                    const heightPercentage = (value / 52) * 100;
                    const barHeight = (heightPercentage / 100) * 140;
                    
                    // Determine if this is the highest bar
                    const isHighest = value === 52;
                    
                    return (
                      <Box 
                        key={index} 
                        className="rounded-t-md w-[32px]"
                        style={{
                          height: barHeight,
                          backgroundColor: isHighest 
                            ? colorScheme === "dark" ? "#A076F9" : theme.tint
                            : colorScheme === "dark" ? "rgba(160, 118, 249, 0.4)" : "rgba(45, 18, 72, 0.3)",
                        }}
                      />
                    );
                  })}
                </Box>
                
                {/* X-axis labels */}
                <Box className="flex-row justify-between">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <Text 
                      key={index} 
                      className="text-xs text-center w-[32px]"
                      style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                    >
                      {day}
                    </Text>
                  ))}
                </Box>
              </Box>
              
              {/* Chart Legend */}
              <Box className="flex-row justify-between mt-4 pt-4 border-t" style={{ borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }}>
                <Box className="flex-row items-center">
                  <Box className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint }} />
                  <Text className="text-xs" style={{ color: theme.text }}>New Requirements</Text>
                </Box>
                <Box className="flex-row items-center">
                  <Box className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.4)" : "rgba(45, 18, 72, 0.3)" }} />
                  <Text className="text-xs" style={{ color: theme.text }}>Average</Text>
                </Box>
              </Box>
            </Box>
            
            {/* Recent Requirements */}
            <Box className="mt-4">
              <Text className="text-base font-medium mb-3" style={{ color: theme.text }}>
                Recent Requirements
              </Text>
              
              {[
                { title: "Looking for Java Developer", category: "IT", time: "2h ago", responses: 12 },
                { title: "Need Accountant for Tax Filing", category: "Finance", time: "5h ago", responses: 8 },
                { title: "Marketing Specialist Required", category: "Marketing", time: "1d ago", responses: 15 }
              ].map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  activeOpacity={0.7}
                >
                  <Box 
                    className="p-3 rounded-xl mb-3 flex-row justify-between items-center"
                    style={{ 
                      backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                      borderWidth: 1,
                      borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <Box className="flex-1">
                      <Text 
                        className="font-medium" 
                        style={{ color: theme.text }}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Box className="flex-row items-center mt-1">
                        <Box 
                          className="px-2 py-0.5 rounded-full mr-2"
                          style={{ 
                            backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.15)" : "rgba(45, 18, 72, 0.08)",
                          }}
                        >
                          <Text 
                            className="text-xs"
                            style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}
                          >
                            {item.category}
                          </Text>
                        </Box>
                        <Text 
                          className="text-xs"
                          style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                        >
                          {item.time}
                        </Text>
                      </Box>
                    </Box>
                    <Box 
                      className="px-2 py-1 rounded-lg"
                      style={{ 
                        backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.15)" : "rgba(45, 18, 72, 0.08)",
                      }}
                    >
                      <Text 
                        className="text-xs font-medium"
                        style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}
                      >
                        {item.responses} responses
                      </Text>
                    </Box>
                  </Box>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                className="mt-2 items-center py-3"
                activeOpacity={0.7}
              >
                <Text style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                  View All Requirements
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>

          {/* Quick Actions Card Section */}
          <Box className="mt-6 px-1 mb-40">
            <Box 
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Quick Actions Header */}
              <Box className="flex-row items-center justify-between">
                <Box className="flex-row items-center gap-2">
                  <Box 
                    className="p-2 rounded-xl"
                    style={{ 
                      backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.15)" : "rgba(45, 18, 72, 0.08)",
                    }}
                  >
                    <Users size={16} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
          </Box>
          <Box>
                    <Text className="font-medium" style={{ color: theme.text }}>Quick Actions</Text>
                    <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>Manage referrals</Text>
                  </Box>
                </Box>
              </Box>

              <Box className="mt-4">
                {/* Referral Actions */}
                <Box className="flex-row items-center gap-3">
                  <TouchableOpacity 
                    className="flex-1 h-10 rounded-full items-center justify-center"
                    style={{ 
                      borderWidth: 1,
                      borderColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.2)",
                      backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.5)" : "rgba(255, 255, 255, 0.5)",
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: theme.text }}>Given</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="flex-1 h-10 rounded-full items-center justify-center"
                    style={{ 
                      borderWidth: 1,
                      borderColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.2)",
                      backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.5)" : "rgba(255, 255, 255, 0.5)",
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: theme.text }}>Taken</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="h-10 w-10 rounded-full items-center justify-center"
                    style={{ 
                      backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
                    }}
                    activeOpacity={0.7}
                  >
                    <Text className="text-xl" style={{ color: "#FFFFFF", marginTop: -3 }}>+</Text>
                  </TouchableOpacity>
                </Box>

                {/* Upcoming Meetings Section */}
                <Box className="mt-8 pt-6" style={{ borderTopWidth: 1, borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }}>
                  <Box className="flex-row items-center justify-between mb-4">
                    <Box className="flex-row items-center gap-2">
                      <Box 
                        className="p-2 rounded-xl"
                        style={{ 
                          backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.15)" : "rgba(45, 18, 72, 0.08)",
                        }}
                      >
                        <Calendar size={16} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                      </Box>
                      <Text className="text-sm font-medium" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                        Upcoming Meetings
                      </Text>
                    </Box>
                    <TouchableOpacity 
                      className="px-2 py-1 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                        View All
                      </Text>
                    </TouchableOpacity>
                  </Box>

                  <Box className="space-y-3">
                    {/* Today's Meeting */}
                    <TouchableOpacity activeOpacity={0.7}>
                      <Box 
                        className="rounded-xl overflow-hidden"
                        style={{ 
                          backgroundColor: colorScheme === "dark" ? "rgba(30, 30, 30, 0.8)" : "rgba(245, 245, 245, 0.8)",
                        }}
                      >
                        <Box className="p-4">
                          <Box className="flex-row items-center justify-between mb-2">
                            <Box className="flex-row items-center gap-2">
                              <Box 
                                className="h-2 w-2 rounded-full" 
                                style={{ backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint }}
                              />
                              <Text className="text-xs font-medium" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                                Today
                              </Text>
                            </Box>
                            <Box 
                              className="px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
                              }}
                            >
                              <Text className="text-xs" style={{ color: "#FFFFFF" }}>
                                Now
                              </Text>
                            </Box>
                          </Box>
                          
                          <Text className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                            Weekly Business Network
                          </Text>
                          
                          <Box className="flex-row items-center gap-2">
                            <Clock size={12} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                            <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                              10:00 AM - 12:00 PM
                            </Text>
                          </Box>
                          
                          <Box 
                            className="flex-row items-center justify-end mt-3 pt-2" 
                            style={{ 
                              borderTopWidth: 1, 
                              borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" 
                            }}
                          >
                            <TouchableOpacity 
                              className="px-4 h-7 rounded-lg items-center justify-center"
                              style={{ 
                                backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
                              }}
                              activeOpacity={0.7}
                            >
                              <Text className="text-xs font-medium" style={{ color: "#FFFFFF" }}>
                                Mark Attendance
                              </Text>
                            </TouchableOpacity>
                          </Box>
                        </Box>
                      </Box>
                    </TouchableOpacity>

                    {/* Tomorrow's Meeting */}
                    <TouchableOpacity activeOpacity={0.7}>
                      <Box 
                        className="rounded-xl overflow-hidden"
                        style={{ 
                          backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                          borderWidth: 1,
                          borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <Box className="p-4">
                          <Box className="flex-row items-center justify-between mb-2">
                            <Box className="flex-row items-center gap-2">
                              <Box 
                                className="h-2 w-2 rounded-full" 
                                style={{ backgroundColor: colorScheme === "dark" ? "#555555" : "#CCCCCC" }}
                              />
                              <Text className="text-xs font-medium" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                                Tomorrow
                              </Text>
                            </Box>
                            <Box 
                              className="px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.15)" : "rgba(45, 18, 72, 0.08)",
                              }}
                            >
                              <Text className="text-xs font-medium" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                                10:00 AM
                              </Text>
                            </Box>
                          </Box>
                          
                          <Text className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                            Product Showcase
                          </Text>
                          
                          <Box className="flex-row items-center gap-2">
                            <Clock size={12} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                            <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                              10:00 AM - 11:30 AM
                            </Text>
                          </Box>
                          
                          <Box 
                            className="flex-row items-center justify-end mt-3 pt-2" 
                            style={{ 
                              borderTopWidth: 1, 
                              borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" 
                            }}
                          >
                            <TouchableOpacity 
                              className="px-4 h-7 rounded-lg items-center justify-center"
                              style={{ 
                                borderWidth: 1,
                                borderColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.2)",
                                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.5)" : "rgba(255, 255, 255, 0.5)",
                              }}
                              activeOpacity={0.7}
                            >
                              <Text className="text-xs font-medium" style={{ color: theme.text }}>
                                Remind Me
                              </Text>
                            </TouchableOpacity>
                          </Box>
                        </Box>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>
          </Box>
        </Box>
      </ScrollView>
    </Box>

      {/* Notification Panel */}
      <NotificationPanel 
        isVisible={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
        notifications={sampleNotifications}
        onNotificationPress={handleNotificationPress}
        onClearAll={handleClearAllNotifications}
      />
    </SafeAreaView>
  );
}
