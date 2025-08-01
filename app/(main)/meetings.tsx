import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Calendar as CalendarIcon, Users, UserPlus, Clock, MapPin, CheckCircle, Calendar as CalendarComponent, ChevronLeft, ChevronRight } from "lucide-react-native";
import { TouchableOpacity, ScrollView, Dimensions, View } from "react-native";
import MeetingCard, { Meeting, MeetingType, MeetingStatus } from "@/components/MeetingCard";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";

const { width } = Dimensions.get("window");

type TabType = "calendar" | "meetings" | "one-on-ones";

// Sample data for meetings
const sampleMeetings: Meeting[] = [
  {
    id: "1",
    title: "Weekly Business Network",
    type: "general",
    status: "current",
    date: "Today, 15 Aug 2023",
    time: "10:00 AM - 12:00 PM",
    location: "Business Center, T.Nagar",
    attendees: 24,
    description: "Regular weekly meeting for business networking and knowledge sharing."
  },
  {
    id: "2",
    title: "Product Showcase",
    type: "special",
    status: "upcoming",
    date: "Tomorrow, 16 Aug 2023",
    time: "10:00 AM - 11:30 AM",
    location: "Conference Hall, Velachery",
    attendees: 18,
  },
  {
    id: "3",
    title: "Digital Marketing Workshop",
    type: "training",
    status: "upcoming",
    date: "18 Aug 2023",
    time: "2:00 PM - 5:00 PM",
    location: "Training Center, Tambaram",
    attendees: 15,
  },
  {
    id: "4",
    title: "Monthly Review",
    type: "general",
    status: "past",
    date: "01 Aug 2023",
    time: "11:00 AM - 1:00 PM",
    location: "Business Center, T.Nagar",
    attendees: 22,
    attendanceStatus: "present",
  },
  {
    id: "5",
    title: "Sales Strategy Session",
    type: "special",
    status: "past",
    date: "28 Jul 2023",
    time: "3:00 PM - 4:30 PM",
    location: "Meeting Room 3, K.K.Nagar",
    attendees: 12,
    attendanceStatus: "absent",
  }
];

// Define one-on-one meeting interface
interface OneOnOne {
  id: string;
  personName: string;
  personCompany?: string;
  status: "pending_sent" | "pending_received" | "confirmed" | "completed" | "declined";
  date?: string;
  time?: string;
  location?: string;
  selfieUploaded?: boolean;
}

// Sample data for one-on-ones
const sampleOneOnOnes: OneOnOne[] = [
  {
    id: "1",
    personName: "John Smith",
    personCompany: "ABC Technologies",
    status: "pending_sent",
  },
  {
    id: "2",
    personName: "Sarah Williams",
    personCompany: "XYZ Solutions",
    status: "pending_received",
  },
  {
    id: "3",
    personName: "Michael Johnson",
    personCompany: "Johnson & Co.",
    status: "confirmed",
    date: "Tomorrow, 16 Aug 2023",
    time: "2:30 PM - 3:30 PM",
    location: "Coffee Shop, T.Nagar",
  },
  {
    id: "4",
    personName: "Emily Davis",
    personCompany: "Davis Enterprises",
    status: "completed",
    date: "05 Aug 2023",
    time: "11:00 AM - 12:00 PM",
    location: "Business Center, Velachery",
    selfieUploaded: true,
  },
  {
    id: "5",
    personName: "Robert Wilson",
    personCompany: "Wilson Consulting",
    status: "declined",
    date: "03 Aug 2023",
  }
];

export default function MeetingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [activeTab, setActiveTab] = useState<TabType>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const [meetingsForSelectedDate, setMeetingsForSelectedDate] = useState<Meeting[]>([]);
  const router = useRouter();
  
  // Generate calendar dates for current month view
  useEffect(() => {
    generateCalendarDates();
  }, [selectedDate]);
  
  // Filter meetings for selected date
  useEffect(() => {
    filterMeetingsForSelectedDate();
  }, [selectedDate]);
  
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
    // In a real app, you would filter meetings based on the actual date
    // For this example, we'll just use the sample data and filter based on status
    const filteredMeetings = sampleMeetings.filter(meeting => {
      if (meeting.status === "current") return true;
      if (meeting.status === "upcoming" && Math.random() > 0.7) return true;
      if (meeting.status === "past" && Math.random() > 0.8) return true;
      return false;
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
    // In a real app, you would check if there are meetings on this date
    // For this example, we'll just return a random boolean
    return Math.random() > 0.7;
  };
  
  const handleMarkAttendance = (meetingId: string) => {
    console.log("Mark attendance for meeting:", meetingId);
    // Navigate to attendance marking screen
    router.push({
      pathname: "/(attendance)/mark-attendance",
      params: { meetingId }
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
        
        {/* Day Names */}
        <Box className="flex-row justify-between mb-2">
          {dayNames.map((day, index) => (
            <Box key={index} className="flex-1 items-center">
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
              <TouchableOpacity 
                key={index}
                className="items-center justify-center"
                style={{
                  width: width / 7 - 8,
                  height: width / 7 - 8,
                  margin: 4,
                  borderRadius: width / 14,
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
            );
          })}
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
    // Filter meetings by status
    const currentMeetings = sampleMeetings.filter(meeting => meeting.status === "current");
    const upcomingMeetings = sampleMeetings.filter(meeting => meeting.status === "upcoming");
    const pastMeetings = sampleMeetings.filter(meeting => meeting.status === "past");
    
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
    // Filter one-on-ones by status
    const pendingSent = sampleOneOnOnes.filter(item => item.status === "pending_sent");
    const pendingReceived = sampleOneOnOnes.filter(item => item.status === "pending_received");
    const confirmed = sampleOneOnOnes.filter(item => item.status === "confirmed");
    const completed = sampleOneOnOnes.filter(item => item.status === "completed");
    const declined = sampleOneOnOnes.filter(item => item.status === "declined");
    
    // Combine pending sent and received for the requests section
    const pendingRequests = [...pendingSent, ...pendingReceived];
    // Combine completed and declined for the past section
    const pastOneOnOnes = [...completed, ...declined];
    
    return (
      <Box className="flex-1 p-4">
        {/* Schedule Button */}
        <Button
          className="mb-6 h-12 rounded-lg"
          style={{ backgroundColor: theme.tint }}
          onPress={() => router.push("/(one-on-one)/member-search")}
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
          
          {confirmed.length > 0 ? (
            confirmed.map(oneOnOne => renderOneOnOneCard(oneOnOne))
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
        default:
          return "Unknown";
      }
    };
    
    // Render action buttons based on status
    const renderActionButtons = () => {
      switch (oneOnOne.status) {
        case "pending_sent":
          return (
            <Box className="flex-row justify-end mt-3">
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
            </Box>
          );
        case "pending_received":
          return (
            <Box className="flex-row justify-end mt-3 space-x-2">
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
                onPress={() => console.log("Reschedule:", oneOnOne.id)}
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
                  onPress={() => console.log("Upload selfie:", oneOnOne.id)}
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
    </Box>
  );
} 