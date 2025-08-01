import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem } from "@/components/ui/select";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ScrollView, Dimensions, StyleSheet, Alert, Platform, Modal, FlatList } from "react-native";
import { Calendar, Clock, MapPin, ArrowLeft, Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "@/components/ui/image";

const { width } = Dimensions.get("window");

// Define location types
type LocationType = "my_location" | "their_location" | "other";

// Define time slot interface
interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// Sample time slots
const timeSlots: TimeSlot[] = [
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

// Sample durations
const durations = ["30 minutes", "1 hour", "1.5 hours", "2 hours"];

// Define the ScheduleScreen component
const ScheduleScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const params = useLocalSearchParams();
  const memberId = params.memberId as string;
  const memberName = params.memberName as string;
  
  // States
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(durations[1]);
  const [locationType, setLocationType] = useState<LocationType>("my_location");
  const [customLocation, setCustomLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Format date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Generate calendar dates for current month view
  const generateCalendarDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Calculate total days to show (previous month days + current month days)
    const totalDays = daysFromPrevMonth + lastDay.getDate();
    
    // Calculate rows needed (7 days per row)
    const rows = Math.ceil(totalDays / 7);
    
    // Generate dates array
    const dates = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 1);
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      dates.push(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i));
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i));
    }
    
    // Add days from next month to complete the grid
    const nextMonth = new Date(year, month + 1, 1);
    const remainingDays = rows * 7 - dates.length;
    
    for (let i = 1; i <= remainingDays; i++) {
      dates.push(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i));
    }
    
    return dates;
  };
  
  // Navigation functions for month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  // Helper functions for date comparison
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
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
  
  // Select date
  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };
  
  // Show date picker modal
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };
  
  // Handle location type change
  const handleLocationTypeChange = (value: string) => {
    setLocationType(value as LocationType);
  };
  
  // Handle submit
  const handleSubmit = () => {
    // Validate form
    if (!selectedTimeSlot) {
      Alert.alert("Please select a time slot");
      return;
    }
    
    if (locationType === "other" && !customLocation.trim()) {
      Alert.alert("Please enter a custom location");
      return;
    }
    
    // In a real app, you would send the request to the API
    Alert.alert(
      "Meeting Request Sent",
      `Your meeting request with ${memberName} has been sent.`,
      [
        {
          text: "OK",
          onPress: () => router.push("/(main)/meetings"),
        },
      ]
    );
  };
  
  // Go back
  const goBack = () => {
    router.back();
  };
  
  // Custom date picker component
  const renderDatePicker = () => {
    const dates = generateCalendarDates();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    return (
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
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
                        disabled={date < new Date() && !isTodayDate}
                      >
                        <Text
                          className={`${isTodayDate ? "font-bold" : "font-normal"}`}
                          style={{
                            color: !isCurrentMonthDate
                              ? colorScheme === "dark" ? "#555555" : "#CCCCCC"
                              : date < new Date() && !isTodayDate
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
  
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 72 }}>
      <Stack.Screen
        options={{
          title: "Schedule Meeting",
        }}
      />
      
      <Box className="p-4">
        {/* Member Info */}
        <Box
          className="rounded-xl p-4 mb-6"
          style={{
            backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
          }}
        >
          <Text className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
            Schedule a One-on-One with
          </Text>
          
          <Text className="text-xl font-bold" style={{ color: theme.tint }}>
            {memberName}
          </Text>
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
          onPress={showDatePickerModal}
          activeOpacity={0.7}
        >
          <CalendarIcon size={24} color={theme.tint} />
          <Text className="ml-3 flex-1" style={{ color: theme.text }}>
            {formatDate(selectedDate)}
          </Text>
          <ChevronDown size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
        </TouchableOpacity>
        
        {/* Custom Date Picker Modal */}
        {renderDatePicker()}
        
        {/* Time Slots */}
        <Text className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
          Select Time
        </Text>
        
        <Box className="flex-row flex-wrap mb-6">
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              className="m-1 px-4 py-2 rounded-full"
              style={{
                backgroundColor: selectedTimeSlot === slot.id
                  ? theme.tint
                  : colorScheme === "dark"
                  ? "rgba(42, 42, 42, 0.8)"
                  : "rgba(245, 245, 245, 0.8)",
                borderWidth: 1,
                borderColor: selectedTimeSlot === slot.id
                  ? theme.tint
                  : colorScheme === "dark"
                  ? "rgba(80, 80, 80, 0.3)"
                  : "rgba(0, 0, 0, 0.05)",
                opacity: slot.available ? 1 : 0.5,
              }}
              onPress={() => slot.available && handleTimeSlotSelect(slot.id)}
              disabled={!slot.available}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: selectedTimeSlot === slot.id
                    ? "#FFFFFF"
                    : theme.text,
                }}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </Box>
        
        {/* Duration */}
        <Text className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
          Duration
        </Text>
        
        <Box className="mb-6">
          <Select
            selectedValue={selectedDuration}
            onValueChange={(value) => setSelectedDuration(value)}
          >
            <SelectTrigger
              className="rounded-xl px-6 py-2 h-fit "
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box className="flex-row items-center h-fit">
                <Clock size={24} color={theme.tint} />
                <SelectInput
                  className="ml-3 flex-1"
                  style={{ color: theme.text }}
                  placeholder="Select Duration"
                />
                <ChevronDown size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
              </Box>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent className="pb-32">
                {durations.map((duration) => (
                  <SelectItem key={duration} label={duration} value={duration} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </Box>
        
        {/* Location */}
        <Text className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
          Location
        </Text>
        
        <Box className="mb-6">
          <Select
            selectedValue={locationType}
            onValueChange={handleLocationTypeChange}
          >
            <SelectTrigger
              className="rounded-xl px-6 py-2 mb-3 h-fit"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box className="flex-row items-center">
                <MapPin size={24} color={theme.tint} />
                <SelectInput
                  className="ml-3 flex-1"
                  style={{ color: theme.text }}
                  placeholder="Select Location Type"
                />
                <ChevronDown size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
              </Box>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent className="pb-32">
                <SelectItem label="My Location" value="my_location" />
                <SelectItem label="Their Location" value="their_location" />
                <SelectItem label="Other Location" value="other" />
              </SelectContent>
            </SelectPortal>
          </Select>
          
          {locationType === "other" && (
            <Input
              className="rounded-xl"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <InputField
                placeholder="Enter location details"
                placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
                value={customLocation}
                onChangeText={setCustomLocation}
                style={{ color: theme.text }}
              />
            </Input>
          )}
        </Box>
        
        {/* Purpose */}
        <Text className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
          Meeting Purpose (Optional)
        </Text>
        
        <Textarea
          className="rounded-xl mb-8"
          style={{
            backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
          }}
        >
          <TextareaInput
            placeholder="Enter the purpose of this meeting..."
            placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
            value={purpose}
            onChangeText={setPurpose}
            style={{ color: theme.text }}
            numberOfLines={4}
          />
        </Textarea>
        
        {/* Submit Button */}
        <Button
          className="h-14 rounded-xl"
          style={{ backgroundColor: theme.tint }}
          onPress={handleSubmit}
        >
          <ButtonText style={{ color: "#FFFFFF" }}>
            Send Meeting Request
          </ButtonText>
        </Button>
      </Box>
    </ScrollView>
  );
};

// Add displayName to the component
ScheduleScreen.displayName = "ScheduleScreen";

// Export the component
export default ScheduleScreen; 