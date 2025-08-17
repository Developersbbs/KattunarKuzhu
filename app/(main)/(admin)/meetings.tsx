import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ScrollView, SafeAreaView, StatusBar, FlatList, ActivityIndicator, Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import Gradient from "@/assets/Icons/Gradient";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Search, Plus, Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { fetchMeetings, createMeeting } from "@/services/meetings";

// Meeting types
export type MeetingType = "general" | "special" | "training";
export type MeetingStatus = "current" | "upcoming" | "past";
export type RecurrenceType = "none" | "weekly" | "monthly";

// Meeting interface for client-side display
export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  date: string;
  isoDate?: string; // ISO format date (YYYY-MM-DD)
  time: string;
  location: string;
  description?: string;
  attendees?: number;
  recurrence?: RecurrenceType;
  groupId?: string; // Added to support server integration
}

// Server response interface
export interface ServerMeeting {
  _id: string;
  title: string;
  description?: string;
  type: MeetingType;
  startTime: string;
  endTime: string;
  location: string;
  group: {
    _id: string;
    name: string;
  };
  attendees: any[];
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  recurrence?: RecurrenceType;
}

// Admin Meeting Card Component
interface AdminMeetingCardProps {
  meeting: Meeting;
  onPress: () => void;
}

const AdminMeetingCard: React.FC<AdminMeetingCardProps> = ({ meeting, onPress }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  // Get background color based on meeting status
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
  
  // Get status badge color
  const getStatusBadgeColor = () => {
    switch (meeting.status) {
      case "current":
        return colorScheme === "dark" ? "rgba(76, 175, 80, 0.2)" : "rgba(46, 125, 50, 0.1)";
      case "upcoming":
        return colorScheme === "dark" ? "rgba(33, 150, 243, 0.2)" : "rgba(13, 71, 161, 0.1)";
      case "past":
        return colorScheme === "dark" ? "rgba(158, 158, 158, 0.2)" : "rgba(97, 97, 97, 0.1)";
      default:
        return colorScheme === "dark" ? "rgba(80, 80, 80, 0.2)" : "rgba(0, 0, 0, 0.05)";
    }
  };
  
  // Get status badge text color
  const getStatusBadgeTextColor = () => {
    switch (meeting.status) {
      case "current":
        return colorScheme === "dark" ? "#4CAF50" : "#2E7D32";
      case "upcoming":
        return colorScheme === "dark" ? "#2196F3" : "#0D47A1";
      case "past":
        return colorScheme === "dark" ? "#9E9E9E" : "#616161";
      default:
        return theme.text;
    }
  };
  
  // Get status label
  const getStatusLabel = () => {
    switch (meeting.status) {
      case "current":
        return "Now";
      case "upcoming":
        return "Upcoming";
      case "past":
        return "Past";
      default:
        return "Unknown";
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
            
            <Box
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: getStatusBadgeColor() }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: getStatusBadgeTextColor() }}
              >
                {getStatusLabel()}
              </Text>
            </Box>
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
                {meeting.recurrence && meeting.recurrence !== "none" && (
                  <Text
                    style={{ 
                      color: colorScheme === "dark" ? "#A076F9" : theme.tint,
                      fontWeight: "500"
                    }}
                  >
                    {" • "}
                    {meeting.recurrence === "weekly" ? "Weekly" : "Monthly"}
                  </Text>
                )}
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
            
            {meeting.attendees !== undefined && (
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
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

// No mock data - we'll fetch real data from the API

export default function Meetings() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Start with loading state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  
  // Form state for creating a new meeting
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingDescription, setNewMeetingDescription] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [newMeetingLocation, setNewMeetingLocation] = useState("");
  const [newMeetingType, setNewMeetingType] = useState<MeetingType>("general");
  const [newMeetingRecurrence, setNewMeetingRecurrence] = useState<RecurrenceType>("none");
  const [creating, setCreating] = useState(false);
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // Fetch meetings from API
  const loadMeetings = async () => {
    try {
      setLoading(true);
      const data = await fetchMeetings();
      
      if (data && Array.isArray(data)) {
        console.log(`Loaded ${data.length} meetings from API`);
        setMeetings(data);
      } else {
        console.warn('API returned unexpected data format:', data);
        setMeetings([]);
        Alert.alert('Warning', 'Received unexpected data format from server. Please contact support if this persists.');
      }
    } catch (error: any) {
      console.error('Error loading meetings:', error);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error:', error.response.status, error.response.data);
        Alert.alert(
          'Server Error', 
          `Failed to load meetings (${error.response.status}). ${error.response.data?.message || 'Please try again later.'}`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network error - no response received');
        Alert.alert(
          'Network Error', 
          'Unable to connect to the server. Please check your internet connection and try again.'
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert.alert('Error', `Failed to load meetings: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load meetings on component mount
  useEffect(() => {
    loadMeetings();
  }, []);
  
  // Filter meetings based on search query
  const filteredMeetings = meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Date picker helper functions
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear();
  };
  
  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };
  
  const generateCalendarDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate how many days from the previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Calculate the first date to show on the calendar
    const firstDateToShow = new Date(year, month, 1 - daysFromPrevMonth);
    
    // Generate 42 dates (6 rows of 7 days)
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(firstDateToShow);
      date.setDate(firstDateToShow.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };
  
  const selectDate = (date: Date) => {
    setSelectedDate(date);
    
    // Format the date
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    console.log("Selected date:", formattedDate);
    
    // Also store the ISO date string for easier parsing
    const isoDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Store both formats - the formatted one for display and ISO for data
    setNewMeetingDate(formattedDate);
    
    console.log("Date selected:", { formatted: formattedDate, iso: isoDate });
  };
  
  // Time slots for time picker
  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
  ];
  
  const selectTimeSlot = (time: string) => {
    setSelectedTimeSlot(time);
    const endTime = getEndTime(time);
    const timeRange = `${time} - ${endTime}`;
    console.log("Setting time range:", timeRange);
    setNewMeetingTime(timeRange);
    setShowTimePicker(false);
  };
  
  const getEndTime = (startTime: string) => {
    // Parse the start time and add 1 hour
    const [time, period] = startTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    
    // Add 1 hour
    hours += 1;
    
    // Convert back to 12-hour format
    let newPeriod = "AM";
    if (hours >= 12) {
      newPeriod = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    }
    if (hours === 0) {
      hours = 12;
    }
    
    // Format the time
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${newPeriod}`;
  };
  
  // Handle meeting card press
  const handleMeetingPress = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailsModalOpen(true);
  };
  
  // Render meeting item
  const renderMeetingItem = ({ item }: { item: Meeting }) => (
    <AdminMeetingCard 
      meeting={item} 
      onPress={() => handleMeetingPress(item)} 
    />
  );
  
  // Handle meeting creation
  const handleCreateMeeting = async () => {
    // Validate required fields
    if (!newMeetingTitle.trim()) {
      Alert.alert("Missing Information", "Please enter a meeting title.");
      return;
    }
    
    if (!newMeetingDate) {
      Alert.alert("Missing Information", "Please select a meeting date.");
      return;
    }
    
    if (!newMeetingTime) {
      Alert.alert("Missing Information", "Please select a meeting time.");
      return;
    }
    
    if (!newMeetingLocation.trim()) {
      Alert.alert("Missing Information", "Please enter a meeting location.");
      return;
    }
    
    setCreating(true);
    
    try {
      // For demo purposes, we're using a fixed groupId
      // In a real app, you would select the group or get it from context
      const groupId = "60d21b4667d0d8992e610c85"; // Example group ID
      
      // Create ISO date string from selectedDate if available
      const isoDate = selectedDate ? selectedDate.toISOString().split('T')[0] : undefined;
      
      const newMeetingData = {
        title: newMeetingTitle.trim(),
        type: newMeetingType,
        date: newMeetingDate,
        isoDate: isoDate, // Add ISO format date for more reliable parsing
        time: newMeetingTime,
        location: newMeetingLocation.trim(),
        description: newMeetingDescription.trim() || undefined,
        recurrence: newMeetingType === "general" ? newMeetingRecurrence : "none",
      };
      
      console.log("Creating meeting with data:", JSON.stringify(newMeetingData, null, 2));
      
      try {
        // Call the API to create the meeting
        const createdMeeting = await createMeeting(newMeetingData, groupId);
        
        if (createdMeeting) {
          // Add new meeting to the list
          setMeetings([createdMeeting as Meeting, ...meetings]);
          
          // Reset form and close modal
          setNewMeetingTitle("");
          setNewMeetingDescription("");
          setNewMeetingDate("");
          setNewMeetingTime("");
          setNewMeetingLocation("");
          setNewMeetingType("general");
          setNewMeetingRecurrence("none");
          setSelectedDate(null);
          setSelectedTimeSlot(null);
          setIsCreateModalOpen(false);
          
          // Show success message
          Alert.alert("Success", "Meeting created successfully!");
          
          // Refresh the meetings list to ensure we have the latest data
          loadMeetings();
        } else {
          throw new Error("Failed to create meeting - no data returned");
        }
      } catch (apiError: any) {
        console.error("API error creating meeting:", apiError);
        
        // Handle different types of errors
        if (apiError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Server error:', apiError.response.status, apiError.response.data);
          Alert.alert(
            'Server Error', 
            `Failed to create meeting (${apiError.response.status}). ${apiError.response.data?.message || 'Please try again later.'}`
          );
        } else if (apiError.request) {
          // The request was made but no response was received
          console.error('Network error - no response received');
          Alert.alert(
            'Network Error', 
            'Unable to connect to the server. Please check your internet connection and try again.'
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          Alert.alert('Error', `Failed to create meeting: ${apiError.message}`);
        }
      }
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      Alert.alert("Error", `Failed to create meeting: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };
  
  // Reset form when modal closes
  const handleCloseCreateModal = () => {
    setNewMeetingTitle("");
    setNewMeetingDescription("");
    setNewMeetingDate("");
    setNewMeetingTime("");
    setNewMeetingLocation("");
    setNewMeetingType("general");
    setNewMeetingRecurrence("none");
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setIsCreateModalOpen(false);
  };
  
  // Date picker component
  const renderDatePicker = () => {
    const dates = generateCalendarDates();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    return (
      <Modal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
      >
        <Box
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Box
            className="w-[90%] rounded-xl p-4"
            style={{
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {/* Header */}
            <Box className="flex-row justify-between items-center mb-4">
              <TouchableOpacity onPress={goToPreviousMonth} activeOpacity={0.7}>
                <ChevronLeft size={24} color={theme.text} />
              </TouchableOpacity>
              
              <Text className="text-lg font-semibold" style={{ color: theme.text }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              
              <TouchableOpacity onPress={goToNextMonth} activeOpacity={0.7}>
                <ChevronRight size={24} color={theme.text} />
              </TouchableOpacity>
            </Box>
            
            {/* Calendar Container - Fixed width to ensure alignment */}
            <Box className="mx-auto" style={{ width: 308 }}>
              {/* Day Names */}
              <Box className="flex-row mb-2">
                {dayNames.map((day, index) => (
                  <Box key={index} style={{ width: 44, height: 30 }} className="items-center justify-center">
                    <Text 
                      className="text-xs font-medium"
                      style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                    >
                      {day}
                    </Text>
                  </Box>
                ))}
              </Box>
              
              {/* Calendar Grid */}
              <Box className="flex-row flex-wrap">
                {dates.map((date, index) => {
                  const isCurrentMonthDate = isCurrentMonth(date);
                  const isTodayDate = isToday(date);
                  const isSelectedDateValue = isSelectedDate(date);
                  const today = new Date();
                  const isPastDate = date < today && !isTodayDate;
                  
                  return (
                    <Box key={index} style={{ width: 44, height: 44 }} className="items-center justify-center">
                      <TouchableOpacity 
                        className="items-center justify-center"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: isSelectedDateValue 
                            ? colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.15)"
                            : "transparent",
                        }}
                        onPress={() => selectDate(date)}
                        activeOpacity={0.7}
                        disabled={isPastDate}
                      >
                        <Text
                          className={`${isTodayDate ? "font-bold" : "font-normal"}`}
                          style={{
                            color: !isCurrentMonthDate
                              ? colorScheme === "dark" ? "#555555" : "#CCCCCC"
                              : isPastDate
                              ? colorScheme === "dark" ? "#555555" : "#CCCCCC"
                              : isTodayDate
                              ? colorScheme === "dark" ? "#A076F9" : "#2D1248"
                              : theme.text,
                          }}
                        >
                          {date.getDate()}
                        </Text>
                      </TouchableOpacity>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            
            {/* Buttons */}
            <Box className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="px-4 py-2 mr-2 rounded"
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={{ color: theme.text }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="px-4 py-2 rounded"
                style={{ backgroundColor: theme.tint }}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={{ color: "#FFFFFF" }}>Done</Text>
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  };
  
  // Time picker component
  const renderTimePicker = () => {
    return (
      <Modal
        isOpen={showTimePicker}
        onClose={() => setShowTimePicker(false)}
      >
        <Box
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Box
            className="w-[90%] rounded-xl p-4"
            style={{
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
              Select Time
            </Text>
            
            <Box className="flex-row flex-wrap justify-between">
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  className="mb-3 rounded-xl items-center justify-center"
                  style={{
                    width: '30%',
                    height: 44,
                    backgroundColor: selectedTimeSlot === time
                      ? colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.15)"
                      : colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    borderWidth: 1,
                    borderColor: selectedTimeSlot === time
                      ? colorScheme === "dark" ? "#A076F9" : theme.tint
                      : colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                  }}
                  onPress={() => selectTimeSlot(time)}
                >
                  <Text
                    style={{
                      color: selectedTimeSlot === time
                        ? colorScheme === "dark" ? "#A076F9" : theme.tint
                        : theme.text,
                      fontWeight: selectedTimeSlot === time ? "600" : "normal",
                    }}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </Box>
            
            <Box className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="px-4 py-2 mr-2 rounded"
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={{ color: theme.text }}>Cancel</Text>
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
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

        <Box className="flex-1 pt-12 px-6">
          {/* Header */}
          <Box className="flex-row items-center justify-between mb-6">
            <Text
              className="text-3xl font-bold"
              style={{ color: theme.text }}
            >
              Meetings
            </Text>
            <TouchableOpacity
              onPress={() => setIsCreateModalOpen(true)}
              className="p-2 rounded-full flex-row items-center gap-2 px-3"
              style={{
                backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
              }}
            >
              <Text style={{ color: "#FFFFFF" }}>Create Meeting</Text>
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </Box>

          {/* Search Bar */}
          <Box className="mb-6 mt-2">
            <Input
              variant="outline"
              size="lg"
              className="rounded-xl"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderColor: "transparent",
              }}
            >
              <InputSlot className="pl-3">
                <InputIcon>
                  <Search size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                </InputIcon>
              </InputSlot>
              <InputField
                placeholder="Search meetings..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
                style={{ color: theme.text }}
              />
            </Input>
          </Box>

          {/* Meetings List */}
          {loading ? (
            <Box className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
              <Text
                className="mt-4 text-center"
                style={{ color: theme.text }}
              >
                Loading meetings...
              </Text>
            </Box>
          ) : filteredMeetings.length > 0 ? (
            <FlatList
              data={filteredMeetings}
              renderItem={renderMeetingItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              refreshing={loading}
              onRefresh={loadMeetings}
            />
          ) : (
            <Box className="flex-1 items-center justify-center">
              <Calendar size={64} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
              <Text
                className="text-xl font-semibold mt-4 text-center"
                style={{ color: theme.text }}
              >
                {searchQuery ? "No matching meetings found" : "No meetings yet"}
              </Text>
              <Text
                className="text-sm text-center mt-2"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                {searchQuery 
                  ? "Try a different search term or create a new meeting" 
                  : "Create your first meeting to get started"}
              </Text>
              {searchQuery && (
                <Button
                  className="mt-4 rounded-xl"
                  style={{
                    backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
                  }}
                  onPress={() => setSearchQuery("")}
                >
                  <ButtonText style={{ color: "#FFFFFF" }}>
                    Clear Search
                  </ButtonText>
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Create Meeting Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal}>
        <ModalBackdrop />
        <ModalContent
          style={{
            backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
            borderRadius: 24,
            width: "90%",
            maxHeight: "80%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: colorScheme === "dark" ? 0.5 : 0.2,
            shadowRadius: 20,
            elevation: 10,
            overflow: "hidden",
          }}
        >
          {/* Header with Gradient Background */}
          <Box
            style={{
              backgroundColor: colorScheme === "dark" ? "#2D1248" : theme.tint,
              paddingVertical: 20,
              paddingHorizontal: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative Elements */}
            <Box
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <Box
              style={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              }}
            />
            
            <Box className="flex-row items-center">
              <Box className="bg-white/20 p-2 rounded-full mr-3">
                <Calendar size={24} color="#FFFFFF" />
              </Box>
              <Text
                className="text-2xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                Create New Meeting
              </Text>
            </Box>
            
            <Text
              className="text-sm mt-2 opacity-80"
              style={{ color: "#FFFFFF" }}
            >
              Schedule a new meeting for members
            </Text>
            
            <TouchableOpacity
              onPress={handleCloseCreateModal}
              className="absolute right-4 top-4 bg-white/20 rounded-full p-1"
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Box>
          
          <ModalBody>
            <ScrollView className="p-6 space-y-6">
              {/* Meeting Title Input */}
              <Box className="space-y-3">
                <Box className="flex-row items-center">
                  <Text className="text-base font-medium" style={{ color: theme.text }}>
                    Meeting Title
                  </Text>
                  <Text className="text-xs ml-1" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                    (required)
                  </Text>
                </Box>
                <Input
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                  style={{
                    backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                    borderWidth: 1,
                  }}
                >
                  <InputField
                    placeholder="Enter meeting title"
                    value={newMeetingTitle}
                    onChangeText={setNewMeetingTitle}
                    placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
                    style={{ color: theme.text, fontSize: 16 }}
                  />
                </Input>
              </Box>

              {/* Meeting Type Selection */}
              <Box className="space-y-3">
                <Box className="flex-row items-center">
                  <Text className="text-base font-medium" style={{ color: theme.text }}>
                    Meeting Type
                  </Text>
                  <Text className="text-xs ml-1" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                    (required)
                  </Text>
                </Box>
                <Box className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => setNewMeetingType("general")}
                    style={{
                      backgroundColor: newMeetingType === "general" 
                        ? (colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.15)") 
                        : (colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"),
                      borderWidth: 1,
                      borderColor: newMeetingType === "general"
                        ? (colorScheme === "dark" ? "#A076F9" : theme.tint)
                        : (colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)"),
                      borderRadius: 12,
                      padding: 12,
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text 
                      style={{ 
                        color: newMeetingType === "general" 
                          ? (colorScheme === "dark" ? "#A076F9" : theme.tint) 
                          : theme.text,
                        fontWeight: newMeetingType === "general" ? "600" : "normal",
                      }}
                    >
                      General
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setNewMeetingType("special")}
                    style={{
                      backgroundColor: newMeetingType === "special" 
                        ? (colorScheme === "dark" ? "rgba(0, 120, 220, 0.3)" : "rgba(0, 120, 220, 0.15)") 
                        : (colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"),
                      borderWidth: 1,
                      borderColor: newMeetingType === "special"
                        ? (colorScheme === "dark" ? "#2196F3" : "#0D47A1")
                        : (colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)"),
                      borderRadius: 12,
                      padding: 12,
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text 
                      style={{ 
                        color: newMeetingType === "special" 
                          ? (colorScheme === "dark" ? "#2196F3" : "#0D47A1") 
                          : theme.text,
                        fontWeight: newMeetingType === "special" ? "600" : "normal",
                      }}
                    >
                      Special
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => setNewMeetingType("training")}
                    style={{
                      backgroundColor: newMeetingType === "training" 
                        ? (colorScheme === "dark" ? "rgba(0, 150, 80, 0.3)" : "rgba(0, 150, 80, 0.15)") 
                        : (colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"),
                      borderWidth: 1,
                      borderColor: newMeetingType === "training"
                        ? (colorScheme === "dark" ? "#4CAF50" : "#2E7D32")
                        : (colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)"),
                      borderRadius: 12,
                      padding: 12,
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text 
                      style={{ 
                        color: newMeetingType === "training" 
                          ? (colorScheme === "dark" ? "#4CAF50" : "#2E7D32") 
                          : theme.text,
                        fontWeight: newMeetingType === "training" ? "600" : "normal",
                      }}
                    >
                      Training
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Box>

              {/* Recurrence Options (only for General meetings) */}
              {newMeetingType === "general" && (
                <Box className="space-y-3">
                  <Box className="flex-row items-center">
                    <Text className="text-base font-medium" style={{ color: theme.text }}>
                      Recurrence
                    </Text>
                    <Text className="text-xs ml-1" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                      (optional)
                    </Text>
                  </Box>
                  <Box className="flex-row space-x-3">
                    <TouchableOpacity
                      onPress={() => setNewMeetingRecurrence("none")}
                      style={{
                        backgroundColor: newMeetingRecurrence === "none" 
                          ? (colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.15)") 
                          : (colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"),
                        borderWidth: 1,
                        borderColor: newMeetingRecurrence === "none"
                          ? (colorScheme === "dark" ? "#A076F9" : theme.tint)
                          : (colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)"),
                        borderRadius: 12,
                        padding: 12,
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <Text 
                        style={{ 
                          color: newMeetingRecurrence === "none" 
                            ? (colorScheme === "dark" ? "#A076F9" : theme.tint) 
                            : theme.text,
                          fontWeight: newMeetingRecurrence === "none" ? "600" : "normal",
                        }}
                      >
                        One-time
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => setNewMeetingRecurrence("weekly")}
                      style={{
                        backgroundColor: newMeetingRecurrence === "weekly" 
                          ? (colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.15)") 
                          : (colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"),
                        borderWidth: 1,
                        borderColor: newMeetingRecurrence === "weekly"
                          ? (colorScheme === "dark" ? "#A076F9" : theme.tint)
                          : (colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)"),
                        borderRadius: 12,
                        padding: 12,
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <Text 
                        style={{ 
                          color: newMeetingRecurrence === "weekly" 
                            ? (colorScheme === "dark" ? "#A076F9" : theme.tint) 
                            : theme.text,
                          fontWeight: newMeetingRecurrence === "weekly" ? "600" : "normal",
                        }}
                      >
                        Weekly
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => setNewMeetingRecurrence("monthly")}
                      style={{
                        backgroundColor: newMeetingRecurrence === "monthly" 
                          ? (colorScheme === "dark" ? "rgba(160, 118, 249, 0.3)" : "rgba(45, 18, 72, 0.15)") 
                          : (colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"),
                        borderWidth: 1,
                        borderColor: newMeetingRecurrence === "monthly"
                          ? (colorScheme === "dark" ? "#A076F9" : theme.tint)
                          : (colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)"),
                        borderRadius: 12,
                        padding: 12,
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <Text 
                        style={{ 
                          color: newMeetingRecurrence === "monthly" 
                            ? (colorScheme === "dark" ? "#A076F9" : theme.tint) 
                            : theme.text,
                          fontWeight: newMeetingRecurrence === "monthly" ? "600" : "normal",
                        }}
                      >
                        Monthly
                      </Text>
                    </TouchableOpacity>
                  </Box>
                  <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                    Set how often this meeting should repeat
                  </Text>
                </Box>
              )}

              {/* Meeting Date Input */}
              <Box className="space-y-3">
                <Box className="flex-row items-center">
                  <Text className="text-base font-medium" style={{ color: theme.text }}>
                    Meeting Date
                  </Text>
                  <Text className="text-xs ml-1" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                    (required)
                  </Text>
                </Box>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Box
                    className="rounded-xl p-4 flex-row items-center justify-between"
                    style={{
                      backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                      borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: newMeetingDate ? theme.text : (colorScheme === "dark" ? "#AAAAAA" : "#666666"),
                        fontSize: 16,
                      }}
                    >
                      {newMeetingDate || "Select date"}
                    </Text>
                    <Calendar size={20} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                  </Box>
                </TouchableOpacity>
              </Box>

              {/* Meeting Time Input */}
              <Box className="space-y-3">
                <Box className="flex-row items-center">
                  <Text className="text-base font-medium" style={{ color: theme.text }}>
                    Meeting Time
                  </Text>
                  <Text className="text-xs ml-1" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                    (required)
                  </Text>
                </Box>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <Box
                    className="rounded-xl p-4 flex-row items-center justify-between"
                    style={{
                      backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                      borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: newMeetingTime ? theme.text : (colorScheme === "dark" ? "#AAAAAA" : "#666666"),
                        fontSize: 16,
                      }}
                    >
                      {newMeetingTime || "Select time"}
                    </Text>
                    <Clock size={20} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                  </Box>
                </TouchableOpacity>
              </Box>

              {/* Meeting Location Input */}
              <Box className="space-y-3">
                <Box className="flex-row items-center">
                  <Text className="text-base font-medium" style={{ color: theme.text }}>
                    Meeting Location
                  </Text>
                  <Text className="text-xs ml-1" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                    (required)
                  </Text>
                </Box>
                <Input
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                  style={{
                    backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                    borderWidth: 1,
                  }}
                >
                  <InputField
                    placeholder="Enter location"
                    value={newMeetingLocation}
                    onChangeText={setNewMeetingLocation}
                    placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
                    style={{ color: theme.text, fontSize: 16 }}
                  />
                </Input>
                <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                  In a real app, this would include Google Maps integration
                </Text>
              </Box>

              {/* Meeting Description Input */}
              <Box className="space-y-3">
                <Box className="flex-row items-center">
                  <Text className="text-base font-medium" style={{ color: theme.text }}>
                    Meeting Description
                  </Text>
                  <Text className="text-xs ml-1" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                    (optional)
                  </Text>
                </Box>
                <Textarea
                  size="md"
                  className="rounded-xl h-[100px]"
                  style={{
                    backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                    borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                    borderWidth: 1,
                  }}
                >
                  <TextareaInput
                    placeholder="Enter meeting description"
                    value={newMeetingDescription}
                    onChangeText={setNewMeetingDescription}
                    placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
                    style={{ color: theme.text, fontSize: 16 }}
                  />
                </Textarea>
              </Box>

              {/* Attendees Note */}
              <Box className="p-4 rounded-xl" style={{ backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.1)" : "rgba(45, 18, 72, 0.05)" }}>
                <Box className="flex-row items-center mb-2">
                  <Users size={16} color={colorScheme === "dark" ? "#A076F9" : theme.tint} style={{ marginRight: 8 }} />
                  <Text className="font-medium" style={{ color: theme.text }}>
                    Attendees
                  </Text>
                </Box>
                <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                  Attendees will be added automatically when they mark attendance for this meeting.
                </Text>
              </Box>
            </ScrollView>
          </ModalBody>
          
          {/* Footer with Create Button */}
          <Box 
            style={{
              borderTopWidth: 1,
              borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              paddingVertical: 16,
              paddingHorizontal: 24,
            }}
          >
            <Box className="flex-row items-center justify-end space-x-3 gap-3">
              <Button
                className="rounded-xl px-5 py-3 h-fit"
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.5)" : "rgba(45, 18, 72, 0.2)",
                }}
                onPress={handleCloseCreateModal}
              >
                <ButtonText style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                  Cancel
                </ButtonText>
              </Button>
              <Button
                className="rounded-xl px-5 py-3 h-fit"
                style={{
                  backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
                  opacity: (!newMeetingTitle.trim() || !newMeetingDate || !newMeetingTime || !newMeetingLocation.trim() || creating) ? 0.6 : 1,
                }}
                onPress={handleCreateMeeting}
                isDisabled={!newMeetingTitle.trim() || !newMeetingDate || !newMeetingTime || !newMeetingLocation.trim() || creating}
              >
                {creating ? (
                  <Box className="flex-row items-center">
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                    <ButtonText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                      Creating...
                    </ButtonText>
                  </Box>
                ) : (
                  <ButtonText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    Create Meeting
                  </ButtonText>
                )}
              </Button>
            </Box>
          </Box>
        </ModalContent>
      </Modal>
      
      {/* Meeting Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
        <ModalBackdrop />
        {selectedMeeting && (
          <ModalContent
            style={{
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 24,
              width: "90%",
              maxHeight: "80%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: colorScheme === "dark" ? 0.5 : 0.2,
              shadowRadius: 20,
              elevation: 10,
              overflow: "hidden",
            }}
          >
            {/* Header with Meeting Type Color */}
            <Box
              style={{
                backgroundColor: selectedMeeting.type === "general" 
                  ? (colorScheme === "dark" ? "#2D1248" : theme.tint)
                  : selectedMeeting.type === "special"
                  ? (colorScheme === "dark" ? "#0D47A1" : "#1976D2")
                  : (colorScheme === "dark" ? "#2E7D32" : "#388E3C"),
                paddingVertical: 20,
                paddingHorizontal: 24,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative Elements */}
              <Box
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              />
              <Box
                style={{
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                }}
              />
              
              {/* Meeting Type Badge */}
              <Box
                className="px-3 py-1 rounded-full self-start mb-2"
                style={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: "#FFFFFF" }}
                >
                  {selectedMeeting.type === "general" ? "General Meeting" : 
                   selectedMeeting.type === "special" ? "Special Meeting" : "Training Session"}
                </Text>
              </Box>
              
              <Text
                className="text-2xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                {selectedMeeting.title}
              </Text>
              
              <Box className="flex-row items-center mt-2">
                <Calendar size={16} color="#FFFFFF" style={{ opacity: 0.9 }} />
                <Text
                  className="text-sm ml-2"
                  style={{ color: "#FFFFFF", opacity: 0.9 }}
                >
                  {selectedMeeting.date}
                  {selectedMeeting.recurrence && selectedMeeting.recurrence !== "none" && (
                    <Text
                      style={{ 
                        color: "#FFFFFF",
                        fontWeight: "600"
                      }}
                    >
                      {" • "}
                      {selectedMeeting.recurrence === "weekly" ? "Repeats Weekly" : "Repeats Monthly"}
                    </Text>
                  )}
                </Text>
              </Box>
              
              <TouchableOpacity
                onPress={() => setIsDetailsModalOpen(false)}
                className="absolute right-4 top-4 bg-white/20 rounded-full p-1"
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Box>
            
            <ModalBody>
              <ScrollView className="p-6">
                {/* Meeting Details */}
                <Box className="space-y-6">
                  {/* Time and Location */}
                  <Box className="space-y-4">
                    <Box className="flex-row items-center">
                      <Box className="h-10 w-10 rounded-full items-center justify-center mr-3"
                        style={{
                          backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.1)" : "rgba(45, 18, 72, 0.05)",
                        }}
                      >
                        <Clock size={20} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                      </Box>
                      <Box>
                        <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                          Time
                        </Text>
                        <Text className="text-base font-medium" style={{ color: theme.text }}>
                          {selectedMeeting.time}
                        </Text>
                      </Box>
                    </Box>
                    
                    <Box className="flex-row items-center">
                      <Box className="h-10 w-10 rounded-full items-center justify-center mr-3"
                        style={{
                          backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.1)" : "rgba(45, 18, 72, 0.05)",
                        }}
                      >
                        <MapPin size={20} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                      </Box>
    <Box>
                        <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                          Location
                        </Text>
                        <Text className="text-base font-medium" style={{ color: theme.text }}>
                          {selectedMeeting.location}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  
                  {/* Recurrence Info (if applicable) */}
                  {selectedMeeting.recurrence && selectedMeeting.recurrence !== "none" && (
                    <Box className="space-y-2">
                      <Text className="text-base font-medium" style={{ color: theme.text }}>
                        Recurrence
                      </Text>
                      <Box 
                        className="p-3 rounded-xl"
                        style={{
                          backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.1)" : "rgba(45, 18, 72, 0.05)",
                        }}
                      >
                        <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                          {selectedMeeting.recurrence === "weekly" 
                            ? `This meeting repeats every week on the same day and time.` 
                            : `This meeting repeats every month on the same date and time.`
                          }
                        </Text>
                      </Box>
                    </Box>
                  )}
                  
                  {/* Description */}
                  {selectedMeeting.description && (
                    <Box className="space-y-2">
                      <Text className="text-base font-medium" style={{ color: theme.text }}>
                        Description
                      </Text>
                      <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                        {selectedMeeting.description}
                      </Text>
                    </Box>
                  )}
                  
                  {/* Attendees Section */}
                  <Box className="space-y-3">
                    <Box className="flex-row items-center justify-between">
                      <Text className="text-base font-medium" style={{ color: theme.text }}>
                        Attendees
                      </Text>
                      <Box
                        className="px-3 py-1 rounded-full"
                        style={{ 
                          backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.1)" : "rgba(45, 18, 72, 0.05)",
                        }}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}
                        >
                          {selectedMeeting.attendees || 0} Members
                        </Text>
                      </Box>
                    </Box>
                    
                    {/* Mock Attendees List */}
                    {selectedMeeting.attendees && selectedMeeting.attendees > 0 ? (
                      <Box className="space-y-3 mt-2">
                        {/* Sample attendees - in a real app, this would come from API */}
                        {[...Array(Math.min(5, selectedMeeting.attendees))].map((_, index) => (
                          <Box 
                            key={index}
                            className="flex-row items-center p-3 rounded-xl"
                            style={{
                              backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                              borderWidth: 1,
                              borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <Box 
                              className="h-10 w-10 rounded-full mr-3 items-center justify-center"
                              style={{
                                backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)",
                              }}
                            >
                              <Text style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                                {["A", "R", "S", "K", "P"][index]}
                              </Text>
                            </Box>
                            <Box className="flex-1">
                              <Text className="font-medium" style={{ color: theme.text }}>
                                {["Arjunan", "Ramesh", "Suresh", "Karthik", "Priya"][index]}
                              </Text>
                              <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                                Marked attendance at {["10:05 AM", "10:10 AM", "10:12 AM", "10:15 AM", "10:20 AM"][index]}
                              </Text>
                            </Box>
                            <Box 
                              className="h-8 w-8 rounded-full items-center justify-center"
                              style={{
                                backgroundColor: colorScheme === "dark" ? "rgba(76, 175, 80, 0.1)" : "rgba(76, 175, 80, 0.1)",
                              }}
                            >
                              <CheckCircle size={16} color={colorScheme === "dark" ? "#4CAF50" : "#2E7D32"} />
                            </Box>
                          </Box>
                        ))}
                        
                        {selectedMeeting.attendees > 5 && (
                          <Box className="items-center py-2">
                            <Text style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                              + {selectedMeeting.attendees - 5} more attendees
                            </Text>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box className="items-center py-6">
                        <Users size={48} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} style={{ opacity: 0.5 }} />
                        <Text
                          className="text-sm mt-2 text-center"
                          style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                        >
                          No attendees have marked attendance yet
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              </ScrollView>
            </ModalBody>
            
            {/* Footer with Actions */}
            <Box 
              style={{
                borderTopWidth: 1,
                borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                paddingVertical: 16,
                paddingHorizontal: 24,
              }}
            >
              <Box className="flex-row items-center justify-between">
                <Button
                  className="rounded-xl px-4 py-2 h-fit"
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.5)" : "rgba(45, 18, 72, 0.2)",
                  }}
                  onPress={() => setIsDetailsModalOpen(false)}
                >
                  <ButtonText style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                    Close
                  </ButtonText>
                </Button>
                
                <Button
                  className="rounded-xl px-4 py-2 h-fit"
                  style={{
                    backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
                  }}
                  onPress={() => {
                    setIsDetailsModalOpen(false);
                    // In a real app, this would open an edit meeting modal
                    Alert.alert("Edit Meeting", "This would open the edit meeting form in a real app.");
                  }}
                >
                  <ButtonText style={{ color: "#FFFFFF" }}>
                    Edit Meeting
                  </ButtonText>
                </Button>
              </Box>
    </Box>
          </ModalContent>
        )}
      </Modal>
      
      {/* Date Picker Modal */}
      {renderDatePicker()}
      
      {/* Time Picker Modal */}
      {renderTimePicker()}
    </SafeAreaView>
  );
}