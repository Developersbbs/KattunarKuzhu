import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Clock, MapPin, Calendar, Users, CheckCircle, AlertCircle } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

// Define meeting types
export type MeetingType = "general" | "special" | "training";
export type MeetingStatus = "current" | "upcoming" | "past";
export type AttendanceStatus = "early" | "on_time" | "late";

// Meeting interface
export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  date: string;
  time: string;
  location: string;
  attendees?: number;
  attendance?: {
    status: AttendanceStatus;
    timestamp: string;
  };
  description?: string;
}

interface MeetingCardProps {
  meeting: Meeting;
  onPress?: () => void;
  onMarkAttendance?: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ 
  meeting, 
  onPress, 
  onMarkAttendance 
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  // Get background color based on meeting type and status
  const getBackgroundColor = () => {
    if (meeting.status === "current") {
      return colorScheme === "dark" ? "rgba(160, 118, 249, 0.15)" : "rgba(45, 18, 72, 0.08)";
    }
    
    if (meeting.status === "upcoming") {
      return colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)";
    }
    
    return colorScheme === "dark" ? "rgba(30, 30, 30, 0.8)" : "rgba(245, 245, 245, 0.8)";
  };
  
  // Get border color based on meeting type
  const getBorderColor = () => {
    switch (meeting.type) {
      case "general":
        return colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.15)";
      case "special":
        return colorScheme === "dark" ? "rgba(0, 120, 220, 0.3)" : "rgba(0, 120, 220, 0.15)";
      case "training":
        return colorScheme === "dark" ? "rgba(0, 150, 80, 0.3)" : "rgba(0, 150, 80, 0.15)";
      default:
        return colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)";
    }
  };
  
  // Get badge color based on meeting type
  const getBadgeColor = () => {
    switch (meeting.type) {
      case "general":
        return colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)";
      case "special":
        return colorScheme === "dark" ? "rgba(0, 120, 220, 0.2)" : "rgba(0, 120, 220, 0.1)";
      case "training":
        return colorScheme === "dark" ? "rgba(0, 150, 80, 0.2)" : "rgba(0, 150, 80, 0.1)";
      default:
        return colorScheme === "dark" ? "rgba(80, 80, 80, 0.2)" : "rgba(0, 0, 0, 0.05)";
    }
  };
  
  // Get badge text color based on meeting type
  const getBadgeTextColor = () => {
    switch (meeting.type) {
      case "general":
        return colorScheme === "dark" ? "#A076F9" : "#2D1248";
      case "special":
        return colorScheme === "dark" ? "#2196F3" : "#0D47A1";
      case "training":
        return colorScheme === "dark" ? "#4CAF50" : "#2E7D32";
      default:
        return theme.text;
    }
  };
  
  // Get attendance status color
  const getAttendanceStatusColor = () => {
    switch (meeting.attendance?.status) {
      case "early":
        return colorScheme === "dark" ? "#4CAF50" : "#2E7D32";
      case "on_time":
        return colorScheme === "dark" ? "#2196F3" : "#0D47A1";
      case "late":
        return colorScheme === "dark" ? "#F44336" : "#C62828";
      default:
        return colorScheme === "dark" ? "#FFC107" : "#F57C00";
    }
  };
  
  // Get meeting type label
  const getMeetingTypeLabel = () => {
    switch (meeting.type) {
      case "general":
        return "General";
      case "special":
        return "Special";
      case "training":
        return "Training";
      default:
        return "Meeting";
    }
  };
  
  // Get attendance status icon
  const getAttendanceStatusIcon = () => {
    switch (meeting.attendance?.status) {
      case "early":
        return <CheckCircle size={16} color={getAttendanceStatusColor()} />;
      case "on_time":
        return <CheckCircle size={16} color={getAttendanceStatusColor()} />;
      case "late":
        return <AlertCircle size={16} color={getAttendanceStatusColor()} />;
      default:
        return <Clock size={16} color={getAttendanceStatusColor()} />;
    }
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Box
        className="rounded-xl mb-4 overflow-hidden"
        style={{
          backgroundColor: getBackgroundColor(),
          borderWidth: 1,
          borderColor: getBorderColor(),
        }}
      >
        {/* Meeting Header */}
        <Box className="p-4">
          <Box className="flex-row justify-between items-center mb-2">
            <Box
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: getBadgeColor() }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: getBadgeTextColor() }}
              >
                {getMeetingTypeLabel()}
              </Text>
            </Box>
            
            {meeting.status === "current" && (
              <Box
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: colorScheme === "dark" ? "#A076F9" : "#2D1248" }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: "#FFFFFF" }}
                >
                  Now
                </Text>
              </Box>
            )}
            
            {meeting.attendance && (
              <Box className="flex-row items-center">
                {getAttendanceStatusIcon()}
                <Text
                  className="text-xs font-medium ml-1"
                  style={{ color: getAttendanceStatusColor() }}
                >
                  {meeting.attendance.status === "early" ? "Early" :
                   meeting.attendance.status === "on_time" ? "On-time" : "Late"}
                  {' at '}
                  {new Date(meeting.attendance.timestamp).toLocaleTimeString()}
                </Text>
              </Box>
            )}
          </Box>
          
          {/* Meeting Title */}
          <Text
            className="text-lg font-semibold mb-2"
            style={{ color: theme.text }}
          >
            {meeting.title}
          </Text>
          
          {/* Meeting Details */}
          <Box className="space-y-2">
            <Box className="flex-row items-center">
              <Calendar size={16} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
              <Text
                className="text-sm ml-2"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                {meeting.date}
              </Text>
            </Box>
            
            <Box className="flex-row items-center">
              <Clock size={16} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
              <Text
                className="text-sm ml-2"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                {meeting.time}
              </Text>
            </Box>
            
            <Box className="flex-row items-center">
              <MapPin size={16} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
              <Text
                className="text-sm ml-2"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                {meeting.location}
              </Text>
            </Box>
            
            {meeting.attendees && (
              <Box className="flex-row items-center">
                <Users size={16} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                <Text
                  className="text-sm ml-2"
                  style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                >
                  {meeting.attendees} Attendees
                </Text>
              </Box>
            )}
          </Box>
          
          {/* Description if available */}
          {meeting.description && (
            <Text
              className="text-sm mt-3"
              style={{ color: theme.text }}
              numberOfLines={2}
            >
              {meeting.description}
            </Text>
          )}
          
          {/* Mark Attendance Button for current meetings */}
          {meeting.status === "current" && !meeting.attendance && onMarkAttendance && (
            <Button
              className="mt-4 h-10 rounded-lg"
              style={{ backgroundColor: colorScheme === "dark" ? "#A076F9" : "#2D1248" }}
              onPress={onMarkAttendance}
            >
              <ButtonText style={{ color: "#FFFFFF" }}>
                Mark Attendance
              </ButtonText>
            </Button>
          )}
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default MeetingCard; 