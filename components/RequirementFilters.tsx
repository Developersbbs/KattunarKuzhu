import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity, ScrollView, Modal } from "react-native";
import { Filter, X, Check, Calendar, Tag, Clock } from "lucide-react-native";
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react-native";

// Define filter types
export interface RequirementFilters {
  categories: string[];
  status: string[];
  timeframe: string;
}

interface RequirementFiltersProps {
  onApplyFilters: (filters: RequirementFilters) => void;
  availableCategories: string[];
  availableStatuses: string[];
}

export default function RequirementFilters({ onApplyFilters, availableCategories, availableStatuses }: RequirementFiltersProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  
  const timeframeOptions = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Last 3 Months", value: "3months" },
  ];
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };
  
  const handleApplyFilters = () => {
    onApplyFilters({
      categories: selectedCategories,
      status: selectedStatuses,
      timeframe: selectedTimeframe
    });
    setIsModalVisible(false);
  };
  
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSelectedTimeframe("all");
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (selectedStatuses.length > 0) count++;
    if (selectedTimeframe !== "all") count++;
    return count;
  };
  
  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="flex-row items-center"
        activeOpacity={0.7}
      >
        <Box 
          className="flex-row items-center px-3 py-2 rounded-full"
          style={{ 
            backgroundColor: getActiveFiltersCount() > 0 
              ? (colorScheme === "dark" ? "#2D1248" : "#E8DDFF") 
              : (colorScheme === "dark" ? "#333333" : "#F0F0F0")
          }}
        >
          <Filter 
            size={16} 
            color={getActiveFiltersCount() > 0 
              ? (colorScheme === "dark" ? "#FFFFFF" : "#2D1248") 
              : (colorScheme === "dark" ? "#AAAAAA" : "#666666")
            } 
          />
          <Text 
            className="ml-1 font-medium"
            style={{ 
              color: getActiveFiltersCount() > 0 
                ? (colorScheme === "dark" ? "#FFFFFF" : "#2D1248") 
                : (colorScheme === "dark" ? "#AAAAAA" : "#666666")
            }}
          >
            {getActiveFiltersCount() > 0 ? `Filters (${getActiveFiltersCount()})` : "Filter"}
          </Text>
        </Box>
      </TouchableOpacity>
      
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Box 
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Box 
            className="rounded-t-xl p-4"
            style={{ backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF" }}
          >
            {/* Header */}
            <Box className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold" style={{ color: theme.text }}>
                Filter Requirements
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </Box>
            
            <ScrollView className="max-h-96">
              {/* Categories Section */}
              <Box className="mb-4">
                <Box className="flex-row items-center mb-2">
                  <Tag size={18} color={theme.text} />
                  <Text className="text-lg font-bold ml-2" style={{ color: theme.text }}>
                    Categories
                  </Text>
                </Box>
                
                <Box className="flex-row flex-wrap">
                  {availableCategories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => toggleCategory(category)}
                      activeOpacity={0.7}
                    >
                      <Box 
                        className="mr-2 mb-2 px-3 py-2 rounded-full flex-row items-center"
                        style={{ 
                          backgroundColor: selectedCategories.includes(category) 
                            ? (colorScheme === "dark" ? "#2D1248" : "#E8DDFF") 
                            : (colorScheme === "dark" ? "#333333" : "#F0F0F0")
                        }}
                      >
                        {selectedCategories.includes(category) && (
                          <Check size={14} color={colorScheme === "dark" ? "#FFFFFF" : "#2D1248"} className="mr-1" />
                        )}
                        <Text 
                          className="text-sm"
                          style={{ 
                            color: selectedCategories.includes(category) 
                              ? (colorScheme === "dark" ? "#FFFFFF" : "#2D1248") 
                              : (colorScheme === "dark" ? "#AAAAAA" : "#666666")
                          }}
                        >
                          {category}
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  ))}
                </Box>
              </Box>
              
              {/* Status Section */}
              <Box className="mb-4">
                <Box className="flex-row items-center mb-2">
                  <Clock size={18} color={theme.text} />
                  <Text className="text-lg font-bold ml-2" style={{ color: theme.text }}>
                    Status
                  </Text>
                </Box>
                
                <Box className="flex-row flex-wrap">
                  {availableStatuses.map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => toggleStatus(status)}
                      activeOpacity={0.7}
                    >
                      <Box 
                        className="mr-2 mb-2 px-3 py-2 rounded-full flex-row items-center"
                        style={{ 
                          backgroundColor: selectedStatuses.includes(status) 
                            ? (colorScheme === "dark" ? "#2D1248" : "#E8DDFF") 
                            : (colorScheme === "dark" ? "#333333" : "#F0F0F0")
                        }}
                      >
                        {selectedStatuses.includes(status) && (
                          <Check size={14} color={colorScheme === "dark" ? "#FFFFFF" : "#2D1248"} className="mr-1" />
                        )}
                        <Text 
                          className="text-sm"
                          style={{ 
                            color: selectedStatuses.includes(status) 
                              ? (colorScheme === "dark" ? "#FFFFFF" : "#2D1248") 
                              : (colorScheme === "dark" ? "#AAAAAA" : "#666666")
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  ))}
                </Box>
              </Box>
              
              {/* Timeframe Section */}
              <Box className="mb-4">
                <Box className="flex-row items-center mb-2">
                  <Calendar size={18} color={theme.text} />
                  <Text className="text-lg font-bold ml-2" style={{ color: theme.text }}>
                    Timeframe
                  </Text>
                </Box>
                
                <Select
                  selectedValue={selectedTimeframe}
                  onValueChange={(value) => setSelectedTimeframe(value)}
                >
                  <SelectTrigger
                    className="w-full p-2 rounded-lg mb-2"
                    style={{
                      borderWidth: 1,
                      borderColor: colorScheme === "dark" ? "#333333" : "#E0E0E0",
                      backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
                    }}
                  >
                    <SelectInput
                      placeholder="Select Timeframe"
                      style={{ color: theme.text }}
                    />
                    <SelectIcon mr="$3">
                      {({ isPressed }) => {
                        return isPressed ? (
                          <ChevronUp size={20} color={theme.text} />
                        ) : (
                          <ChevronDown size={20} color={theme.text} />
                        );
                      }}
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      {timeframeOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </Box>
            </ScrollView>
            
            {/* Action Buttons */}
            <Box className="flex-row justify-between mt-4">
              <Button
                className="flex-1 mr-2"
                variant="outline"
                onPress={resetFilters}
              >
                <ButtonText>Reset</ButtonText>
              </Button>
              
              <Button
                className="flex-1 ml-2"
                style={{ backgroundColor: theme.tint }}
                onPress={handleApplyFilters}
              >
                <ButtonText>Apply Filters</ButtonText>
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
} 