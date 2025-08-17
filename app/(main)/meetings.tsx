import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Calendar as CalendarIcon, Users, UserPlus, Clock, MapPin, CheckCircle, Calendar as CalendarComponent, ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react-native";
import { TouchableOpacity, ScrollView, Dimensions, View, Alert, Modal, ActivityIndicator } from "react-native";
import MeetingCard, { Meeting, MeetingType, MeetingStatus } from "@/components/MeetingCard";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { fetchMeetings } from "@/services/meetings";

const { width } = Dimensions.get("window");

type TabType = "calendar" | "meetings" | "one-on-ones";

// We'll load real meeting data from the API

// Define one-on-one meeting interface
interface OneOnOne {
  id: string;
  personName: string;
  personCompany?: string;
  status: "pending_sent" | "pending_received" | "confirmed" | "completed" | "declined" | "in_progress";
  date?: string;
  time?: string;
  location?: string;
  selfieUploaded?: boolean;
}

// We'll load one-on-ones data from API in the future
// For now, we'll use an empty array and prepare the structure for API integration
const sampleOneOnOnes: OneOnOne[] = [];

// Sample time slots for reschedule
const rescheduleTimeSlots = [
  { id: "1", time: "09:00 AM", available: true },
  { id: "2", time: "10:00 AM", available: true },
  { id: "3", time: "11:00 AM", available: false },
  { id: "4", time: "12:00 PM", available: true },
  { id: "5", time: "01:00 PM", available: true },
  { id: "6", time: "02:00 PM", available: false },
  { id: "7", time: "03:00 PM", available: true },
  { id: "8", time: "04:00 PM", available: true },
  { id: "9", time: "05:00 PM", available: true },
];

export default function MeetingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [activeTab, setActiveTab] = useState<TabType>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const [meetingsForSelectedDate, setMeetingsForSelectedDate] = useState<Meeting[]>([]);
  const router = useRouter();
  
  // API data states
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // States for reschedule modal
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(new Date());
  const [rescheduleTime, setRescheduleTime] = useState<string | null>(null);
  const [rescheduleOneOnOneId, setRescheduleOneOnOneId] = useState<string | null>(null);
  const [showRescheduleDatePicker, setShowRescheduleDatePicker] = useState(false);
  const [currentRescheduleMonth, setCurrentRescheduleMonth] = useState(new Date());
  
  // Load meetings from API
  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMeetings();
      console.log(`Loaded ${data.length} meetings from API`);
      setMeetings(data);
    } catch (err) {
      console.error('Error loading meetings:', err);
      setError('Failed to load meetings. Please try again.');
      Alert.alert('Error', 'Failed to load meetings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load meetings on component mount
  useEffect(() => {
    loadMeetings();
  }, []);

  // Generate calendar dates for current month view
  useEffect(() => {
    generateCalendarDates();
  }, [selectedDate]);
  
  // Filter meetings for selected date
  useEffect(() => {
    filterMeetingsForSelectedDate();
  }, [selectedDate, meetings]);
  
  const generateCalendarDates = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Generate array of dates for the month view
    const dates: Date[] = [];
    
    // Add dates from previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      dates.push(new Date(year, month - 1, prevMonthLastDay - i));
    }
    
    // Add dates from current month
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    
    // Add dates from next month to fill the last week
    const remainingDays = 42 - dates.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      dates.push(new Date(year, month + 1, i));
    }
    
    setCalendarDates(dates);
  };
  
  const filterMeetingsForSelectedDate = () => {
    if (!meetings.length) {
      setMeetingsForSelectedDate([]);
      return;
    }
    
    // Filter meetings for the selected date
    const selectedDateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const filteredMeetings = meetings.filter(meeting => {
      // Extract date part from meeting date string
      // This assumes meeting.date is in format like "Tuesday, August 19, 2025"
      try {
        // Parse the meeting date to check if it matches the selected date
        const meetingDateParts = meeting.date.split(',');
        if (meetingDateParts.length < 2) return false;
        
        const datePart = meetingDateParts[1].trim(); // "August 19"
        const yearPart = meetingDateParts.length > 2 ? meetingDateParts[2].trim() : new Date().getFullYear().toString();
        
        // Parse the date parts
        const [month, day] = datePart.split(' ');
        const monthIndex = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ].indexOf(month);
        
        if (monthIndex === -1) return false;
        
        const dayNum = parseInt(day.replace(',', ''), 10);
        const yearNum = parseInt(yearPart, 10);
        
        if (isNaN(dayNum) || isNaN(yearNum)) return false;
        
        // Create Date object for the meeting date
        const meetingDate = new Date(yearNum, monthIndex, dayNum);
        
        // Check if the meeting date matches the selected date
        return (
          meetingDate.getDate() === selectedDate.getDate() &&
          meetingDate.getMonth() === selectedDate.getMonth() &&
          meetingDate.getFullYear() === selectedDate.getFullYear()
        );
      } catch (error) {
        console.error("Error parsing meeting date:", error, meeting.date);
        return false;
      }
    });
    
    setMeetingsForSelectedDate(filteredMeetings);
  };
  
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };
  
  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth();
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isSelectedDate = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  const hasMeetings = (date: Date) => {
    if (!meetings.length) return false;
    
    // Check if any meeting is on this date
    return meetings.some(meeting => {
      try {
        // Parse the meeting date to check if it matches the given date
        const meetingDateParts = meeting.date.split(',');
        if (meetingDateParts.length < 2) return false;
        
        const datePart = meetingDateParts[1].trim(); // "August 19"
        const yearPart = meetingDateParts.length > 2 ? meetingDateParts[2].trim() : new Date().getFullYear().toString();
        
        // Parse the date parts
        const [month, day] = datePart.split(' ');
        const monthIndex = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ].indexOf(month);
        
        if (monthIndex === -1) return false;
        
        const dayNum = parseInt(day.replace(',', ''), 10);
        const yearNum = parseInt(yearPart, 10);
        
        if (isNaN(dayNum) || isNaN(yearNum)) return false;
        
        // Check if the meeting date matches the given date
        return (
          date.getDate() === dayNum &&
          date.getMonth() === monthIndex &&
          date.getFullYear() === yearNum
        );
      } catch (error) {
        return false;
      }
    });
  };
  
  // Handle mark attendance
  const handleMarkAttendance = (meetingId: string) => {
    console.log("Mark attendance for meeting:", meetingId);
    // Navigate to attendance marking screen
    router.push({
      pathname: "/mark-attendance",
      params: { meetingId }
    });
  };

  // Open reschedule modal
  const openRescheduleModal = (oneOnOneId: string) => {
    setRescheduleOneOnOneId(oneOnOneId);
    setRescheduleDate(new Date());
    setRescheduleTime(null);
    setCurrentRescheduleMonth(new Date());
    setShowRescheduleModal(true);
  };

  // Close reschedule modal
  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setRescheduleOneOnOneId(null);
  };

  // Show reschedule date picker
  const showRescheduleDatePickerModal = () => {
    setShowRescheduleDatePicker(true);
  };

  // Generate calendar dates for reschedule date picker
  const generateRescheduleDates = () => {
    const year = currentRescheduleMonth.getFullYear();
    const month = currentRescheduleMonth.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Generate array of dates for the month view
    const dates: Date[] = [];
    
    // Add dates from previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      dates.push(new Date(year, month - 1, prevMonthLastDay - i));
    }
    
    // Add dates from current month
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    
    // Add dates from next month to fill the last week
    const remainingDays = 42 - dates.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      dates.push(new Date(year, month + 1, i));
    }
    
    return dates;
  };

  // Navigation functions for reschedule month
  const goToPreviousRescheduleMonth = () => {
    const prevMonth = new Date(currentRescheduleMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentRescheduleMonth(prevMonth);
  };

  const goToNextRescheduleMonth = () => {
    const nextMonth = new Date(currentRescheduleMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentRescheduleMonth(nextMonth);
  };

  // Helper functions for reschedule date comparison
  const isCurrentRescheduleMonth = (date: Date) => {
    return date.getMonth() === currentRescheduleMonth.getMonth();
  };

  const isRescheduleSelectedDate = (date: Date) => {
    return date.getDate() === rescheduleDate.getDate() &&
           date.getMonth() === rescheduleDate.getMonth() &&
           date.getFullYear() === rescheduleDate.getFullYear();
  };

  // Select reschedule date
  const selectRescheduleDate = (date: Date) => {
    setRescheduleDate(date);
    setShowRescheduleDatePicker(false);
  };

  // Handle reschedule time slot selection
  const handleRescheduleTimeSelect = (slotId: string) => {
    setRescheduleTime(slotId);
  };

  // Submit reschedule request
  const submitRescheduleRequest = () => {
    if (!rescheduleTime) {
      Alert.alert("Please select a time slot");
      return;
    }

    const selectedTimeSlot = rescheduleTimeSlots.find(slot => slot.id === rescheduleTime);
    
    Alert.alert(
      "Reschedule Request Sent",
      `Your reschedule request has been sent for ${rescheduleDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at ${selectedTimeSlot?.time}.`,
      [
        { text: "OK", onPress: () => closeRescheduleModal() }
      ]
    );
    
    console.log("Reschedule request sent:", {
      oneOnOneId: rescheduleOneOnOneId,
      date: rescheduleDate,
      time: selectedTimeSlot?.time
    });
  };

  // Function to render the tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "calendar":
        return renderCalendarTab();
      case "meetings":
        return renderMeetingsTab();
      case "one-on-ones":
        return renderOneOnOnesTab();
      default:
        return null;
    }
  };

  // Calendar Tab
  const renderCalendarTab = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Show loading state
    if (loading) {
      return (
        <Box className="flex-1 p-4 items-center justify-center">
          <ActivityIndicator size="large" color={theme.tint} />
          <Text className="mt-4" style={{ color: theme.text }}>Loading meetings...</Text>
        </Box>
      );
    }
    
    // Show error state
    if (error) {
      return (
        <Box className="flex-1 p-4 items-center justify-center">
          <Text className="text-red-500 mb-4">{error}</Text>
          <Button 
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: theme.tint }}
            onPress={loadMeetings}
          >
            <ButtonText style={{ color: "#FFFFFF" }}>Retry</ButtonText>
          </Button>
        </Box>
      );
    }
    
    return (
      <Box className="flex-1 p-4">
        {/* Month Navigation */}
        <Box className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={goToPreviousMonth} activeOpacity={0.7}>
            <ChevronLeft size={24} color={theme.text} />
          </TouchableOpacity>
          
          <Text className="text-lg font-semibold" style={{ color: theme.text }}>
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
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
            {calendarDates.map((date, index) => {
              const isCurrentMonthDate = isCurrentMonth(date);
              const isTodayDate = isToday(date);
              const isSelectedDateValue = isSelectedDate(date);
              const hasMeetingsOnDate = hasMeetings(date);
              
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
                  >
                    <Text
                      className={`${isTodayDate ? "font-bold" : "font-normal"}`}
                      style={{
                        color: !isCurrentMonthDate
                          ? colorScheme === "dark" ? "#555555" : "#CCCCCC"
                          : isTodayDate
                          ? colorScheme === "dark" ? "#A076F9" : "#2D1248"
                          : theme.text,
                      }}
                    >
                      {date.getDate()}
                    </Text>
                    
                    {/* Meeting indicator */}
                    {hasMeetingsOnDate && isCurrentMonthDate && (
                      <View
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: isTodayDate
                            ? colorScheme === "dark" ? "#A076F9" : "#2D1248"
                            : colorScheme === "dark" ? "#AAAAAA" : "#666666",
                          marginTop: 2,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </Box>
              );
            })}
          </Box>
        </Box>
        
        {/* Selected Date Meetings */}
        <Box className="mt-6">
          <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
            Meetings for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
          
          {meetingsForSelectedDate.length > 0 ? (
            meetingsForSelectedDate.map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onPress={() => console.log("Meeting pressed:", meeting.id)}
                onMarkAttendance={() => handleMarkAttendance(meeting.id)}
              />
            ))
          ) : (
            <Box className="items-center justify-center py-10 rounded-xl"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <CalendarIcon size={40} color={colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} />
              <Text
                className="text-base mt-3"
                style={{ color: colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                No meetings scheduled for this day
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // Meetings Tab
  const renderMeetingsTab = () => {
    // Show loading state
    if (loading) {
      return (
        <Box className="flex-1 p-4 items-center justify-center">
          <ActivityIndicator size="large" color={theme.tint} />
          <Text className="mt-4" style={{ color: theme.text }}>Loading meetings...</Text>
        </Box>
      );
    }
    
    // Show error state
    if (error) {
      return (
        <Box className="flex-1 p-4 items-center justify-center">
          <Text className="text-red-500 mb-4">{error}</Text>
          <Button 
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: theme.tint }}
            onPress={loadMeetings}
          >
            <ButtonText style={{ color: "#FFFFFF" }}>Retry</ButtonText>
          </Button>
        </Box>
      );
    }
    
    // Filter meetings by status
    const currentMeetings = meetings.filter(meeting => meeting.status === "current");
    const upcomingMeetings = meetings.filter(meeting => meeting.status === "upcoming");
    const pastMeetings = meetings.filter(meeting => meeting.status === "past");
    
    return (
      <Box className="flex-1 p-4">
        {/* Current Meetings Section */}
        <Box className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
            Current Meetings
          </Text>
          
          {currentMeetings.length > 0 ? (
            currentMeetings.map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onPress={() => console.log("Meeting pressed:", meeting.id)}
                onMarkAttendance={() => handleMarkAttendance(meeting.id)}
              />
            ))
          ) : (
            <Box className="items-center justify-center py-6 rounded-xl"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Text
                className="text-base"
                style={{ color: colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                No meetings happening right now
              </Text>
            </Box>
          )}
        </Box>
        
        {/* Upcoming Meetings Section */}
        <Box className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
            Upcoming Meetings
          </Text>
          
          {upcomingMeetings.length > 0 ? (
            upcomingMeetings.map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onPress={() => console.log("Meeting pressed:", meeting.id)}
              />
            ))
          ) : (
            <Box className="items-center justify-center py-6 rounded-xl"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Text
                className="text-base"
                style={{ color: colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                No upcoming meetings scheduled
              </Text>
            </Box>
          )}
        </Box>
        
        {/* Past Meetings Section */}
        <Box className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
            Past Meetings
          </Text>
          
          {pastMeetings.length > 0 ? (
            pastMeetings.map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onPress={() => console.log("Meeting pressed:", meeting.id)}
              />
            ))
          ) : (
            <Box className="items-center justify-center py-6 rounded-xl"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Text
                className="text-base"
                style={{ color: colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                No past meetings found
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // One-on-Ones Tab
  const renderOneOnOnesTab = () => {
    // State for one-on-ones data (will be loaded from API in the future)
    const [oneOnOnes, setOneOnOnes] = useState<OneOnOne[]>([]);
    const [loadingOneOnOnes, setLoadingOneOnOnes] = useState(false);
    
    // Show loading state
    if (loadingOneOnOnes) {
      return (
        <Box className="flex-1 p-4 items-center justify-center">
          <ActivityIndicator size="large" color={theme.tint} />
          <Text className="mt-4" style={{ color: theme.text }}>Loading one-on-ones...</Text>
        </Box>
      );
    }
    
    // Filter one-on-ones by status
    const pendingSent = oneOnOnes.filter(item => item.status === "pending_sent");
    const pendingReceived = oneOnOnes.filter(item => item.status === "pending_received");
    const confirmed = oneOnOnes.filter(item => item.status === "confirmed");
    const inProgress = oneOnOnes.filter(item => item.status === "in_progress");
    const completed = oneOnOnes.filter(item => item.status === "completed");
    const declined = oneOnOnes.filter(item => item.status === "declined");
    
    // Combine pending sent and received for the requests section
    const pendingRequests = [...pendingSent, ...pendingReceived];
    // Combine confirmed and in-progress for the upcoming section
    const upcomingOneOnOnes = [...confirmed, ...inProgress];
    // Combine completed and declined for the past section
    const pastOneOnOnes = [...completed, ...declined];
    
    return (
      <Box className="flex-1 p-4">
        {/* Schedule Button */}
        <Button
          className="mb-6 h-12 rounded-lg"
          style={{ backgroundColor: theme.tint }}
          onPress={() => router.push("/member-search")}
        >
          <UserPlus size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <ButtonText style={{ color: "#FFFFFF" }}>Schedule a One-on-One</ButtonText>
        </Button>
        
        {/* Pending Requests Section */}
        <Box className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
            Pending Requests
          </Text>
          
          {pendingRequests.length > 0 ? (
            pendingRequests.map(oneOnOne => renderOneOnOneCard(oneOnOne))
          ) : (
            <Box className="items-center justify-center py-6 rounded-xl"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Text
                className="text-base"
                style={{ color: colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                No pending requests
              </Text>
            </Box>
          )}
        </Box>
        
        {/* Upcoming One-on-Ones Section */}
        <Box className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
            Upcoming One-on-Ones
          </Text>
          
          {upcomingOneOnOnes.length > 0 ? (
            upcomingOneOnOnes.map(oneOnOne => renderOneOnOneCard(oneOnOne))
          ) : (
            <Box className="items-center justify-center py-6 rounded-xl"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Text
                className="text-base"
                style={{ color: colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                No upcoming one-on-ones
              </Text>
            </Box>
          )}
        </Box>
        
        {/* Past One-on-Ones Section */}
        <Box className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
            Past One-on-Ones
          </Text>
          
          {pastOneOnOnes.length > 0 ? (
            pastOneOnOnes.map(oneOnOne => renderOneOnOneCard(oneOnOne))
          ) : (
            <Box className="items-center justify-center py-6 rounded-xl"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Text
                className="text-base"
                style={{ color: colorScheme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
              >
                No past one-on-ones
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  };
  
  // Helper function to render a one-on-one card
  const renderOneOnOneCard = (oneOnOne: OneOnOne) => {
    // Get background color based on status
    const getBackgroundColor = () => {
      switch (oneOnOne.status) {
        case "pending_sent":
        case "pending_received":
          return colorScheme === "dark" ? "rgba(180, 100, 0, 0.2)" : "rgba(240, 140, 0, 0.1)";
        case "confirmed":
          return colorScheme === "dark" ? "rgba(0, 120, 220, 0.2)" : "rgba(0, 120, 220, 0.1)";
        case "completed":
          return colorScheme === "dark" ? "rgba(0, 120, 60, 0.2)" : "rgba(0, 150, 80, 0.1)";
        case "declined":
          return colorScheme === "dark" ? "rgba(180, 0, 0, 0.2)" : "rgba(220, 0, 0, 0.1)";
        case "in_progress":
          return colorScheme === "dark" ? "rgba(0, 120, 220, 0.4)" : "rgba(0, 120, 220, 0.2)";
        default:
          return colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)";
      }
    };
    
    // Get status badge color
    const getBadgeColor = () => {
      switch (oneOnOne.status) {
        case "pending_sent":
        case "pending_received":
          return colorScheme === "dark" ? "#FFC107" : "#F57C00";
        case "confirmed":
          return colorScheme === "dark" ? "#2196F3" : "#0D47A1";
        case "completed":
          return colorScheme === "dark" ? "#4CAF50" : "#2E7D32";
        case "declined":
          return colorScheme === "dark" ? "#F44336" : "#C62828";
        case "in_progress":
          return colorScheme === "dark" ? "#00BCD4" : "#0097A7";
        default:
          return theme.text;
      }
    };
    
    // Get status label
    const getStatusLabel = () => {
      switch (oneOnOne.status) {
        case "pending_sent":
          return "Request Sent";
        case "pending_received":
          return "Request Received";
        case "confirmed":
          return "Confirmed";
        case "completed":
          return "Completed";
        case "declined":
          return "Declined";
        case "in_progress":
          return "In Progress";
        default:
          return "Unknown";
      }
    };
    
    // Render action buttons based on status
    const renderActionButtons = () => {
      switch (oneOnOne.status) {
        case "pending_sent":
          return (
            <Box className="flex-row justify-end mt-3 space-x-2 gap-4">
              <TouchableOpacity
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(244, 67, 54, 0.2)" : "rgba(244, 67, 54, 0.1)",
                }}
                activeOpacity={0.7}
                onPress={() => console.log("Cancel request:", oneOnOne.id)}
              >
                <Text
                  className="text-sm"
                  style={{ color: colorScheme === "dark" ? "#F44336" : "#C62828" }}
                >
                  Cancel Request
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(33, 150, 243, 0.2)" : "rgba(33, 150, 243, 0.1)",
                }}
                activeOpacity={0.7}
                onPress={() => openRescheduleModal(oneOnOne.id)}
              >
                <Text
                  className="text-sm"
                  style={{ color: colorScheme === "dark" ? "#2196F3" : "#0D47A1" }}
                >
                  Reschedule
                </Text>
              </TouchableOpacity>
            </Box>
          );
        case "pending_received":
          return (
            <Box className="flex-row justify-end mt-3 space-x-2 gap-4">
              <TouchableOpacity
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(244, 67, 54, 0.2)" : "rgba(244, 67, 54, 0.1)",
                }}
                activeOpacity={0.7}
                onPress={() => console.log("Decline request:", oneOnOne.id)}
              >
                <Text
                  className="text-sm"
                  style={{ color: colorScheme === "dark" ? "#F44336" : "#C62828" }}
                >
                  Decline
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(33, 150, 243, 0.2)" : "rgba(33, 150, 243, 0.1)",
                }}
                activeOpacity={0.7}
                onPress={() => openRescheduleModal(oneOnOne.id)}
              >
                <Text
                  className="text-sm"
                  style={{ color: colorScheme === "dark" ? "#2196F3" : "#0D47A1" }}
                >
                  Reschedule
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)",
                }}
                activeOpacity={0.7}
                onPress={() => console.log("Accept request:", oneOnOne.id)}
              >
                <Text
                  className="text-sm"
                  style={{ color: colorScheme === "dark" ? "#4CAF50" : "#2E7D32" }}
                >
                  Accept
                </Text>
              </TouchableOpacity>
            </Box>
          );
        case "confirmed":
          return (
            <Box className="flex-row justify-end mt-3">
              <TouchableOpacity
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(33, 150, 243, 0.2)" : "rgba(33, 150, 243, 0.1)",
                }}
                activeOpacity={0.7}
                onPress={() => openRescheduleModal(oneOnOne.id)}
              >
                <Text
                  className="text-sm"
                  style={{ color: colorScheme === "dark" ? "#2196F3" : "#0D47A1" }}
                >
                  Reschedule
                </Text>
              </TouchableOpacity>
            </Box>
          );
        case "in_progress":
          return (
            <Box className="flex-row justify-end mt-3">
              <TouchableOpacity
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(0, 188, 212, 0.2)" : "rgba(0, 151, 167, 0.1)",
                }}
                activeOpacity={0.7}
                onPress={() => router.push({
                  pathname: "/(main)/one-on-one-selfie",
                  params: { oneOnOneId: oneOnOne.id, personName: oneOnOne.personName }
                })}
              >
                <Text
                  className="text-sm"
                  style={{ color: colorScheme === "dark" ? "#00BCD4" : "#0097A7" }}
                >
                  Take Selfie
                </Text>
              </TouchableOpacity>
            </Box>
          );
        case "completed":
          if (!oneOnOne.selfieUploaded) {
            return (
              <Box className="flex-row justify-end mt-3">
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: colorScheme === "dark" ? "rgba(33, 150, 243, 0.2)" : "rgba(33, 150, 243, 0.1)",
                  }}
                  activeOpacity={0.7}
                  onPress={() => router.push({
                    pathname: "/(main)/one-on-one-selfie",
                    params: { oneOnOneId: oneOnOne.id, personName: oneOnOne.personName }
                  })}
                >
                  <Text
                    className="text-sm"
                    style={{ color: colorScheme === "dark" ? "#2196F3" : "#0D47A1" }}
                  >
                    Upload Selfie
                  </Text>
                </TouchableOpacity>
              </Box>
            );
          }
          return null;
        default:
          return null;
      }
    };
    
    return (
      <TouchableOpacity
        key={oneOnOne.id}
        activeOpacity={0.7}
        onPress={() => console.log("One-on-one pressed:", oneOnOne.id)}
        className="mb-4"
      >
        <Box
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: getBackgroundColor(),
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box className="p-4">
            {/* Header with status badge */}
            <Box className="flex-row justify-between items-center mb-3">
              <Text
                className="text-lg font-semibold"
                style={{ color: theme.text }}
              >
                {oneOnOne.personName}
              </Text>
              
              <Box
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: colorScheme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.5)" }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: getBadgeColor() }}
                >
                  {getStatusLabel()}
                </Text>
              </Box>
            </Box>
            
            {/* Company name if available */}
            {oneOnOne.personCompany && (
              <Text
                className="text-sm mb-3"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                {oneOnOne.personCompany}
              </Text>
            )}
            
            {/* Meeting details if available */}
            {oneOnOne.date && (
              <Box className="flex-row items-center mb-1">
                <CalendarIcon size={16} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                <Text
                  className="text-sm ml-2"
                  style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                >
                  {oneOnOne.date}
                </Text>
              </Box>
            )}
            
            {oneOnOne.time && (
              <Box className="flex-row items-center mb-1">
                <Clock size={16} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                <Text
                  className="text-sm ml-2"
                  style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                >
                  {oneOnOne.time}
                </Text>
              </Box>
            )}
            
            {oneOnOne.location && (
              <Box className="flex-row items-center mb-1">
                <MapPin size={16} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                <Text
                  className="text-sm ml-2"
                  style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                >
                  {oneOnOne.location}
                </Text>
              </Box>
            )}
            
            {/* Action buttons */}
            {renderActionButtons()}
          </Box>
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <Box className="flex-1">
      {/* Tab Navigation */}
      <Box 
        className="flex-row justify-around py-2 border-b"
        style={{ 
          borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        }}
      >
        {/* Calendar Tab */}
        <TouchableOpacity
          className="items-center px-4 py-2"
          onPress={() => setActiveTab("calendar")}
          activeOpacity={0.7}
        >
          <Box 
            className="flex-row items-center"
            style={{
              opacity: activeTab === "calendar" ? 1 : 0.6,
            }}
          >
            <CalendarIcon 
              size={20} 
              color={theme.text} 
              style={{ 
                marginRight: 6,
              }}
            />
            <Text 
              className="font-medium"
              style={{ 
                color: theme.text,
                borderBottomWidth: activeTab === "calendar" ? 2 : 0,
                borderBottomColor: theme.tint,
                paddingBottom: 2,
              }}
            >
              Calendar
            </Text>
          </Box>
        </TouchableOpacity>

        {/* Meetings Tab */}
        <TouchableOpacity
          className="items-center px-4 py-2"
          onPress={() => setActiveTab("meetings")}
          activeOpacity={0.7}
        >
          <Box 
            className="flex-row items-center"
            style={{
              opacity: activeTab === "meetings" ? 1 : 0.6,
            }}
          >
            <Users 
              size={20} 
              color={theme.text} 
              style={{ 
                marginRight: 6,
              }}
            />
            <Text 
              className="font-medium"
              style={{ 
                color: theme.text,
                borderBottomWidth: activeTab === "meetings" ? 2 : 0,
                borderBottomColor: theme.tint,
                paddingBottom: 2,
              }}
            >
              Meetings
            </Text>
          </Box>
        </TouchableOpacity>

        {/* One-on-Ones Tab */}
        <TouchableOpacity
          className="items-center px-4 py-2"
          onPress={() => setActiveTab("one-on-ones")}
          activeOpacity={0.7}
        >
          <Box 
            className="flex-row items-center"
            style={{
              opacity: activeTab === "one-on-ones" ? 1 : 0.6,
            }}
          >
            <UserPlus 
              size={20} 
              color={theme.text} 
              style={{ 
                marginRight: 6,
              }}
            />
            <Text 
              className="font-medium"
              style={{ 
                color: theme.text,
                borderBottomWidth: activeTab === "one-on-ones" ? 2 : 0,
                borderBottomColor: theme.tint,
                paddingBottom: 2,
              }}
            >
              One-on-Ones
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>

      {/* Tab Content */}
      <ScrollView className="flex-1">
        {renderTabContent()}
      </ScrollView>

      {/* Reschedule Modal */}
      <Modal
        visible={showRescheduleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRescheduleModal}
      >
        <Box
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Box
            className="rounded-t-3xl p-4"
            style={{
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.25,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Box className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold" style={{ color: theme.text }}>
                Request Reschedule
              </Text>
              <TouchableOpacity onPress={closeRescheduleModal}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </Box>

            {/* Date Selection */}
            <Text className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
              Select Date
            </Text>
            
            <TouchableOpacity
              className="flex-row items-center p-4 rounded-xl mb-6"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
              onPress={showRescheduleDatePickerModal}
              activeOpacity={0.7}
            >
              <CalendarIcon size={24} color={theme.tint} />
              <Text className="ml-3 flex-1" style={{ color: theme.text }}>
                {rescheduleDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
              <ChevronDown size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
            </TouchableOpacity>
            
            {/* Time Slots */}
            <Text className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
              Select Time
            </Text>
            
            <Box className="flex-row flex-wrap mb-6">
              {rescheduleTimeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  className="m-1 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: rescheduleTime === slot.id
                      ? theme.tint
                      : colorScheme === "dark"
                      ? "rgba(42, 42, 42, 0.8)"
                      : "rgba(245, 245, 245, 0.8)",
                    borderWidth: 1,
                    borderColor: rescheduleTime === slot.id
                      ? theme.tint
                      : colorScheme === "dark"
                      ? "rgba(80, 80, 80, 0.3)"
                      : "rgba(0, 0, 0, 0.05)",
                    opacity: slot.available ? 1 : 0.5,
                  }}
                  onPress={() => slot.available && handleRescheduleTimeSelect(slot.id)}
                  disabled={!slot.available}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      color: rescheduleTime === slot.id
                        ? "#FFFFFF"
                        : theme.text,
                    }}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </Box>
            
            {/* Submit Button */}
            <Button
              className="h-14 rounded-xl"
              style={{ backgroundColor: theme.tint }}
              onPress={submitRescheduleRequest}
            >
              <ButtonText style={{ color: "#FFFFFF" }}>
                Send Reschedule Request
              </ButtonText>
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showRescheduleDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRescheduleDatePicker(false)}
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
              <TouchableOpacity onPress={goToPreviousRescheduleMonth} activeOpacity={0.7}>
                <ChevronLeft size={24} color={theme.text} />
              </TouchableOpacity>
              
              <Text className="text-lg font-semibold" style={{ color: theme.text }}>
                {currentRescheduleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              
              <TouchableOpacity onPress={goToNextRescheduleMonth} activeOpacity={0.7}>
                <ChevronRight size={24} color={theme.text} />
              </TouchableOpacity>
            </Box>
            
            {/* Calendar Container - Fixed width to ensure alignment */}
            <Box className="mx-auto" style={{ width: 308 }}>
              {/* Day Names */}
              <Box className="flex-row mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
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
                {generateRescheduleDates().map((date, index) => {
                  const isCurrentMonthDate = isCurrentRescheduleMonth(date);
                  const isTodayDate = isToday(date);
                  const isSelectedDateValue = isRescheduleSelectedDate(date);
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
                        onPress={() => selectRescheduleDate(date)}
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
                onPress={() => setShowRescheduleDatePicker(false)}
              >
                <Text style={{ color: theme.text }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="px-4 py-2 rounded"
                style={{ backgroundColor: theme.tint }}
                onPress={() => setShowRescheduleDatePicker(false)}
              >
                <Text style={{ color: "#FFFFFF" }}>Done</Text>
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
} 