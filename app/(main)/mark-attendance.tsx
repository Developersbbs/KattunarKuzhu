import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ScrollView, Dimensions, StyleSheet, ActivityIndicator, Alert, View, Animated } from "react-native";
import { MapPin, Check, AlertCircle, ArrowLeft, Clock, Users, Calendar, Navigation } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import MeetingCard, { Meeting } from "@/components/MeetingCard";

// Mock meeting data - in a real app, this would be fetched from an API
const mockMeeting: Meeting = {
  id: "1",
  title: "Weekly Business Network",
  type: "general",
  status: "current",
  date: "Today, 15 Aug 2023",
  time: "10:00 AM - 12:00 PM",
  location: "Business Center, T.Nagar",
  attendees: 24,
  description: "Regular weekly meeting for business networking and knowledge sharing."
};

const { width, height } = Dimensions.get("window");

// Simulated coordinates for the meeting location
const meetingCoordinates = {
  latitude: 13.0416, 
  longitude: 80.2339 // T.Nagar, Chennai coordinates
};

export default function MarkAttendanceScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const { meetingId } = useLocalSearchParams();
  
  // States
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<"checking" | "success" | "error" | "not_started">("not_started");
  const [distanceToMeeting, setDistanceToMeeting] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<"verify" | "confirm" | "success">("verify");
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number}>({
    latitude: meetingCoordinates.latitude,
    longitude: meetingCoordinates.longitude
  });
  
  // Animation values for the pulsating effect
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  // Start pulsating animation
  useEffect(() => {
    if (locationStatus === "checking") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [locationStatus, pulseAnim]);
  
  // Fetch meeting data
  useEffect(() => {
    // In a real app, you would fetch the meeting data from an API
    // For this example, we'll use the mock data
    setTimeout(() => {
      setMeeting(mockMeeting);
      setIsLoading(false);
    }, 1000);
  }, [meetingId]);
  
  // Start location verification
  const startLocationVerification = () => {
    setLocationStatus("checking");
    
    // In a real app, you would use the device's GPS to get the user's location
    // and compare it with the meeting location
    // For this example, we'll simulate the process
    
    // Show map immediately with loading state
    setUserLocation({
      latitude: meetingCoordinates.latitude,
      longitude: meetingCoordinates.longitude
    });
    
    setTimeout(() => {
      // Simulate getting user's location (slightly different from meeting location)
      // In a real app, this would come from the device's GPS
      const simulatedUserLocation = {
        latitude: meetingCoordinates.latitude + (Math.random() * 0.01 - 0.005),
        longitude: meetingCoordinates.longitude + (Math.random() * 0.01 - 0.005)
      };
      
      setUserLocation(simulatedUserLocation);
      
      // Calculate distance (simplified for simulation)
      // In a real app, you would use the Haversine formula or a mapping API
      const latDiff = Math.abs(simulatedUserLocation.latitude - meetingCoordinates.latitude);
      const lonDiff = Math.abs(simulatedUserLocation.longitude - meetingCoordinates.longitude);
      
      // Rough approximation of distance in meters (not accurate, just for simulation)
      const roughDistance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111000;
      setDistanceToMeeting(roughDistance);
      
      setTimeout(() => {
        if (roughDistance <= 500) {
          // User is within 500 meters of the meeting location
          setLocationStatus("success");
        } else {
          // User is too far from the meeting location
          setLocationStatus("error");
        }
      }, 1000);
    }, 2000);
  };
  
  // Confirm attendance
  const confirmAttendance = () => {
    setCurrentStep("confirm");
  };
  
  // Submit attendance
  const submitAttendance = () => {
    // In a real app, you would send the attendance data to an API
    
    // Simulate API call
    setTimeout(() => {
      setCurrentStep("success");
    }, 1000);
  };
  
  // Go back to meetings
  const goBackToMeetings = () => {
    router.push("/(main)/meetings");
  };
  
  // Render the map UI
  const renderMapUI = () => {
    return (
      <Box className="h-[200px] rounded-lg overflow-hidden mb-4 relative">
        {/* Simulated map background */}
        <Box
          className="absolute inset-0"
          style={{
            backgroundColor: colorScheme === "dark" ? "#242f3e" : "#e5e9ec",
          }}
        >
          {/* Simulated map grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: i * 20,
                height: 1,
                backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              }}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: i * 20,
                width: 1,
                backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              }}
            />
          ))}
          
          {/* Simulated roads */}
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 80,
              height: 8,
              backgroundColor: colorScheme === "dark" ? "#3d4e61" : "#c9d1d9",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 120,
              width: 8,
              backgroundColor: colorScheme === "dark" ? "#3d4e61" : "#c9d1d9",
            }}
          />
          
          {/* Meeting location marker */}
          <Box
            className="absolute items-center justify-center"
            style={{
              left: width * 0.5,
              top: height * 0.1,
              width: 40,
              height: 40,
              transform: [{ translateX: -20 }, { translateY: -20 }],
            }}
          >
            <Box
              className="rounded-full items-center justify-center"
              style={{
                width: 40,
                height: 40,
                backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)",
              }}
            >
              <MapPin size={24} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
            </Box>
            <Text
              className="text-xs mt-1 font-medium"
              style={{
                color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
                backgroundColor: colorScheme === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
                paddingHorizontal: 4,
                paddingVertical: 1,
                borderRadius: 4,
              }}
            >
              Meeting
            </Text>
          </Box>
          
          {/* User location marker (only shown after location check starts) */}
          {userLocation && (
            <Animated.View
              style={{
                position: "absolute",
                left: width * 0.3,
                top: height * 0.15,
                width: 40,
                height: 40,
                transform: [
                  { translateX: -20 },
                  { translateY: -20 },
                  { scale: locationStatus === "checking" ? pulseAnim : 1 }
                ],
              }}
            >
              <Box
                className="rounded-full items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: locationStatus === "success"
                    ? colorScheme === "dark" ? "rgba(74, 222, 128, 0.2)" : "rgba(34, 197, 94, 0.2)"
                    : locationStatus === "error"
                    ? colorScheme === "dark" ? "rgba(255, 107, 107, 0.2)" : "rgba(255, 59, 48, 0.2)"
                    : colorScheme === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(14, 165, 233, 0.2)",
                }}
              >
                <Navigation
                  size={24}
                  color={
                    locationStatus === "success"
                      ? colorScheme === "dark" ? "#4ADE80" : "#22C55E"
                      : locationStatus === "error"
                      ? colorScheme === "dark" ? "#FF6B6B" : "#FF3B30"
                      : colorScheme === "dark" ? "#3B82F6" : "#0EA5E9"
                  }
                />
              </Box>
              <Text
                className="text-xs mt-1 font-medium"
                style={{
                  color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
                  backgroundColor: colorScheme === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 4,
                }}
              >
                You
              </Text>
            </Animated.View>
          )}
          
          {/* Distance line between markers */}
          {userLocation && (
            <View
              style={{
                position: "absolute",
                left: width * 0.3 + 20 - 20,
                top: height * 0.15 + 20 - 20,
                width: width * 0.2,
                height: 2,
                backgroundColor: locationStatus === "success"
                  ? colorScheme === "dark" ? "#4ADE80" : "#22C55E"
                  : locationStatus === "error"
                  ? colorScheme === "dark" ? "#FF6B6B" : "#FF3B30"
                  : colorScheme === "dark" ? "#3B82F6" : "#0EA5E9",
                transform: [{ rotate: "45deg" }],
                transformOrigin: "left",
              }}
            />
          )}
          
          {/* Map attribution (simulated) */}
          <Text
            className="absolute bottom-1 right-1 text-[10px]"
            style={{ color: colorScheme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
          >
            Map data © 2023
          </Text>
        </Box>
      </Box>
    );
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={theme.tint} />
        <Text className="mt-4" style={{ color: theme.text }}>Loading meeting details...</Text>
      </Box>
    );
  }
  
  // Render error state if meeting not found
  if (!meeting) {
    return (
      <Box className="flex-1 items-center justify-center p-4">
        <AlertCircle size={60} color={colorScheme === "dark" ? "#FF6B6B" : "#FF3B30"} />
        <Text className="text-xl font-bold mt-4" style={{ color: theme.text }}>Meeting Not Found</Text>
        <Text className="text-center mt-2" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
          The meeting you're looking for could not be found. Please go back and try again.
        </Text>
        <Button
          className="mt-6 w-full h-12"
          style={{ backgroundColor: theme.tint }}
          onPress={goBackToMeetings}
        >
          <ButtonText style={{ color: "#FFFFFF" }}>Go Back to Meetings</ButtonText>
        </Button>
      </Box>
    );
  }
  
  // Render verification step
  if (currentStep === "verify") {
    return (
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <Stack.Screen options={{ 
          title: "Mark Attendance",
        }} />
        
        <Box className="p-4">
          
          {/* Meeting details */}
          <MeetingCard meeting={meeting} />
          
          {/* Location verification */}
          <Box
            className="rounded-xl p-4 mt-4"
            style={{
              backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
            }}
          >
            <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
              Location Verification
            </Text>
            
            <Text className="mb-4" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
              To mark your attendance, we need to verify that you are at the meeting location. 
              Please ensure your device's location services are enabled.
            </Text>
            
            {/* Map UI - always show the map */}
            {renderMapUI()}
            
            {locationStatus === "not_started" && (
              <Button
                className="mt-2 h-12"
                style={{ backgroundColor: theme.tint }}
                onPress={startLocationVerification}
              >
                <MapPin size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <ButtonText style={{ color: "#FFFFFF" }}>Verify My Location</ButtonText>
              </Button>
            )}
            
            {locationStatus === "checking" && (
              <Box className="items-center justify-center py-4">
                <Text className="text-center" style={{ color: theme.text }}>
                  Verifying your location...
                </Text>
              </Box>
            )}
            
            {locationStatus === "success" && (
              <Box className="p-4 rounded-lg bg-green-100 dark:bg-green-900">
                <Box className="flex-row items-center">
                  <Check size={24} color={colorScheme === "dark" ? "#4ADE80" : "#22C55E"} />
                  <Text
                    className="ml-2 font-semibold"
                    style={{ color: colorScheme === "dark" ? "#4ADE80" : "#22C55E" }}
                  >
                    Location Verified
                  </Text>
                </Box>
                <Text className="mt-2" style={{ color: theme.text }}>
                  You are at the meeting location. Distance: {distanceToMeeting?.toFixed(0)} meters.
                </Text>
                <Button
                  className="mt-4 h-12"
                  style={{ backgroundColor: colorScheme === "dark" ? "#4ADE80" : "#22C55E" }}
                  onPress={confirmAttendance}
                >
                  <ButtonText style={{ color: "#FFFFFF" }}>Continue</ButtonText>
                </Button>
              </Box>
            )}
            
            {locationStatus === "error" && (
              <Box className="p-4 rounded-lg bg-red-100 dark:bg-red-900">
                <Box className="flex-row items-center">
                  <AlertCircle size={24} color={colorScheme === "dark" ? "#FF6B6B" : "#FF3B30"} />
                  <Text
                    className="ml-2 font-semibold"
                    style={{ color: colorScheme === "dark" ? "#FF6B6B" : "#FF3B30" }}
                  >
                    Location Verification Failed
                  </Text>
                </Box>
                <Text className="mt-2" style={{ color: theme.text }}>
                  You seem to be {distanceToMeeting?.toFixed(0)} meters away from the meeting location. 
                  Please ensure you are at the correct location.
                </Text>
                <Button
                  className="mt-4 h-12"
                  style={{ backgroundColor: colorScheme === "dark" ? "#FF6B6B" : "#FF3B30" }}
                  onPress={startLocationVerification}
                >
                  <ButtonText style={{ color: "#FFFFFF" }}>Try Again</ButtonText>
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </ScrollView>
    );
  }
  
  // Render confirmation step
  if (currentStep === "confirm") {
    return (
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <Stack.Screen options={{ 
          title: "Confirm Attendance",
          headerLeft: () => (
            <TouchableOpacity onPress={() => setCurrentStep("verify")}>
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
          )
        }} />
        
        <Box className="p-4">
          <Text className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
            Confirm Attendance
          </Text>
          
          <Box
            className="rounded-xl p-4"
            style={{
              backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
            }}
          >
            <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
              Attendance Summary
            </Text>
            
            {/* Map UI (smaller version) */}
            <Box className="h-[120px] rounded-lg overflow-hidden mb-4 relative">
              {/* Simulated map background */}
              <Box
                className="absolute inset-0"
                style={{
                  backgroundColor: colorScheme === "dark" ? "#242f3e" : "#e5e9ec",
                }}
              >
                {/* Meeting location marker */}
                <Box
                  className="absolute items-center justify-center"
                  style={{
                    left: width * 0.5,
                    top: height * 0.05,
                    width: 30,
                    height: 30,
                    transform: [{ translateX: -15 }, { translateY: -15 }],
                  }}
                >
                  <Box
                    className="rounded-full items-center justify-center"
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)",
                    }}
                  >
                    <MapPin size={18} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                  </Box>
                </Box>
                
                {/* User location marker */}
                <Box
                  className="absolute items-center justify-center"
                  style={{
                    left: width * 0.3,
                    top: height * 0.07,
                    width: 30,
                    height: 30,
                    transform: [{ translateX: -15 }, { translateY: -15 }],
                  }}
                >
                  <Box
                    className="rounded-full items-center justify-center"
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: colorScheme === "dark" ? "rgba(74, 222, 128, 0.2)" : "rgba(34, 197, 94, 0.2)",
                    }}
                  >
                    <Navigation size={18} color={colorScheme === "dark" ? "#4ADE80" : "#22C55E"} />
                  </Box>
                </Box>
                
                {/* Distance line between markers */}
                <View
                  style={{
                    position: "absolute",
                    left: width * 0.3 + 15 - 15,
                    top: height * 0.07 + 15 - 15,
                    width: width * 0.2,
                    height: 2,
                    backgroundColor: colorScheme === "dark" ? "#4ADE80" : "#22C55E",
                    transform: [{ rotate: "45deg" }],
                    transformOrigin: "left",
                  }}
                />
              </Box>
            </Box>
            
            <Box className="space-y-3 mb-4">
              <Box className="flex-row items-center">
                <Calendar size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                <Text className="ml-2" style={{ color: theme.text }}>
                  {meeting.date}
                </Text>
              </Box>
              
              <Box className="flex-row items-center">
                <Clock size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                <Text className="ml-2" style={{ color: theme.text }}>
                  {meeting.time}
                </Text>
              </Box>
              
              <Box className="flex-row items-center">
                <MapPin size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                <Text className="ml-2" style={{ color: theme.text }}>
                  {meeting.location} (Distance: {distanceToMeeting?.toFixed(0)} m)
                </Text>
              </Box>
              
              <Box className="flex-row items-center">
                <Users size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                <Text className="ml-2" style={{ color: theme.text }}>
                  {meeting.attendees} Attendees
                </Text>
              </Box>
            </Box>
            
            <Box className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900 mb-4">
              <Text style={{ color: theme.text }}>
                By confirming your attendance, you acknowledge that you are physically present at this meeting. 
                Your attendance will be recorded with your current timestamp and location.
              </Text>
            </Box>
            
            <Button
              className="h-12"
              style={{ backgroundColor: theme.tint }}
              onPress={submitAttendance}
            >
              <Check size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <ButtonText style={{ color: "#FFFFFF" }}>Confirm My Attendance</ButtonText>
            </Button>
          </Box>
        </Box>
      </ScrollView>
    );
  }
  
  // Render success step
  return (
    <Box className="flex-1 items-center justify-center p-4">
      <Stack.Screen options={{ headerShown: false }} />
      
      <Box
        className="rounded-full p-6 mb-6"
        style={{
          backgroundColor: colorScheme === "dark" ? "rgba(74, 222, 128, 0.2)" : "rgba(34, 197, 94, 0.1)",
        }}
      >
        <Check size={60} color={colorScheme === "dark" ? "#4ADE80" : "#22C55E"} />
      </Box>
      
      <Text className="text-2xl font-bold mb-2 text-center" style={{ color: theme.text }}>
        Attendance Marked Successfully!
      </Text>
      
      <Text className="text-center mb-8" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
        Your attendance has been recorded for {meeting.title}.
      </Text>
      
      <Button
        className="w-full h-12 mb-4"
        style={{ backgroundColor: theme.tint }}
        onPress={goBackToMeetings}
      >
        <ButtonText style={{ color: "#FFFFFF" }}>Back to Meetings</ButtonText>
      </Button>
    </Box>
  );
} 