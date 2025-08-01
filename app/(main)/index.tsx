import React, { useState, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import Gradient from "@/assets/Icons/Gradient";
import { ScrollView, SafeAreaView, StatusBar, View, PanResponder, Animated, Dimensions, Appearance } from "react-native";
import { Image } from "@/components/ui/image";
import { Bell, Settings, Users, FileText, Calendar, Clock, X, Sun, Moon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  // Meeting alert state
  const [showMeetingAlert, setShowMeetingAlert] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  
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
                <Image source={require("@/assets/images/default-user.png")} className="h-16 w-16" />
              </Box>
              <Box>
                <Text className="text-2xl font-bold" style={{ color: theme.text }}>
                  Arjunan
                </Text>
                <Text className="text-sm" style={{ color: theme.text }}>Sanguine Blue Business Solutions</Text>
              </Box>
            </Box>
            <Box className="flex-row items-center gap-4">
              <TouchableOpacity>
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
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
