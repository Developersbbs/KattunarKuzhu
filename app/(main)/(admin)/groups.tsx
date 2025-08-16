import React, { useState, useRef, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ScrollView, SafeAreaView, StatusBar, FlatList, Animated, ActivityIndicator, Alert } from "react-native";
import { Image } from "@/components/ui/image";
import { Users, Plus, Search, X, ChevronDown, Filter, Info, AlertCircle } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import Gradient from "@/assets/Icons/Gradient";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchGroups, createGroup, Group as GroupType, CreateGroupDto } from "@/services/groups";

// Sample data for members - in a real app, this would come from an API
const sampleMembers = [
  { id: "1", name: "Arjunan", role: "Admin" },
  { id: "2", name: "Ramesh", role: "Member" },
  { id: "3", name: "Suresh", role: "Member" },
  { id: "4", name: "Karthik", role: "Group Head" },
  { id: "5", name: "Priya", role: "Member" },
];

export default function GroupsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedGroupHead, setSelectedGroupHead] = useState("");
  
  // State for groups data
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  
  // Animation values for create button
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Animation for button press
  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };
  
  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  // Fetch groups on component mount
  useEffect(() => {
    loadGroups();
  }, []);

  // Function to load groups from API
  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGroups();
      setGroups(data);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      setError('Failed to load groups. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle group creation
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    const groupData: CreateGroupDto = {
      name: newGroupName.trim(),
    };
    
    if (newGroupDescription?.trim()) {
      groupData.description = newGroupDescription.trim();
    }
    
    if (selectedGroupHead) {
      groupData.groupHead = selectedGroupHead;
    }
    
    try {
      setCreating(true);
      const newGroup = await createGroup(groupData);
      
      // Add the new group to the state
      setGroups(prevGroups => [...prevGroups, newGroup]);
      
      // Reset form and close modal
      setNewGroupName("");
      setNewGroupDescription("");
      setSelectedGroupHead("");
      setIsCreateModalOpen(false);
      
      // Show success message
      Alert.alert('Success', 'Group created successfully');
    } catch (err) {
      console.error('Failed to create group:', err);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const renderGroupItem = ({ item }: { item: GroupType }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => console.log(`View group ${item._id}`)}
    >
      <Box
        className="p-4 rounded-xl mb-4 flex-row items-center"
        style={{
          backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box className="mr-4">
          <Box 
            className="h-16 w-16 rounded-full items-center justify-center"
            style={{
              backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)",
            }}
          >
            <Users size={24} color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
          </Box>
        </Box>
        <Box className="flex-1">
          <Text className="text-lg font-semibold" style={{ color: theme.text }}>
            {item.name}
          </Text>
          <Box className="flex-row items-center mt-1">
            <Users size={14} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
            <Text
              className="ml-1 text-sm"
              style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
            >
              {item.members?.length || 0} members
            </Text>
          </Box>
          {item.groupHead && (
            <Text
              className="text-sm mt-1"
              style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}
            >
              Group Head: {item.groupHead}
            </Text>
          )}
          {item.description && (
            <Text
              className="text-sm mt-1"
              style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              numberOfLines={1}
            >
              {item.description}
            </Text>
          )}
        </Box>
      </Box>
    </TouchableOpacity>
  );

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
              Groups
            </Text>
            <TouchableOpacity
              onPress={() => setIsCreateModalOpen(true)}
              className="p-2 rounded-full flex-row items-center gap-2 px-3"
              style={{
                backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
              }}
            >
              <Text style={{ color: "#FFFFFF" }}>Create Group</Text>
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
                placeholder="Search groups..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
                style={{ color: theme.text }}
              />
            </Input>
          </Box>

          {/* Groups List */}
          {loading ? (
            <Box className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
              <Text
                className="mt-4 text-center"
                style={{ color: theme.text }}
              >
                Loading groups...
              </Text>
            </Box>
          ) : error ? (
            <Box className="flex-1 items-center justify-center p-4">
              <AlertCircle size={64} color={colorScheme === "dark" ? "#ff6b6b" : "#d63031"} />
              <Text
                className="text-xl font-semibold mt-4 text-center"
                style={{ color: theme.text }}
              >
                Something went wrong
              </Text>
              <Text
                className="text-sm text-center mt-2 mb-4"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                {error}
              </Text>
              <Button
                className="rounded-xl px-4 py-2"
                style={{
                  backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
                }}
                onPress={loadGroups}
              >
                <ButtonText style={{ color: "#FFFFFF" }}>
                  Try Again
                </ButtonText>
              </Button>
            </Box>
          ) : filteredGroups.length > 0 ? (
            <FlatList
              data={filteredGroups}
              renderItem={renderGroupItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              refreshing={loading}
              onRefresh={loadGroups}
            />
          ) : (
            <Box className="flex-1 items-center justify-center">
              <Users size={64} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
              <Text
                className="text-xl font-semibold mt-4 text-center"
                style={{ color: theme.text }}
              >
                {searchQuery ? "No matching groups found" : "No groups yet"}
              </Text>
              <Text
                className="text-sm text-center mt-2"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                {searchQuery 
                  ? "Try a different search term or create a new group" 
                  : "Create your first group to get started"}
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

        {/* Create Group Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <ModalBackdrop />
          <ModalContent
            style={{
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
              borderRadius: 24,
              width: "90%",
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
                  <Users size={24} color="#FFFFFF" />
                </Box>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: "#FFFFFF" }}
                >
                  Create New Group
                </Text>
              </Box>
              
              <Text
                className="text-sm mt-2 opacity-80"
                style={{ color: "#FFFFFF" }}
              >
                Create a new group to connect members with similar interests
              </Text>
              
              <TouchableOpacity
                onPress={() => setIsCreateModalOpen(false)}
                className="absolute right-4 top-4 bg-white/20 rounded-full p-1"
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Box>
            
            <ModalBody>
              <Box className="p-6 space-y-6">
                {/* Group Name Input */}
                <Box className="space-y-3">
                  <Box className="flex-row items-center">
                    <Text className="text-base font-medium" style={{ color: theme.text }}>
                      Group Name
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
                      placeholder="Enter group name"
                      value={newGroupName}
                      onChangeText={setNewGroupName}
                      placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
                      style={{ color: theme.text, fontSize: 16 }}
                    />
                  </Input>
                </Box>

                {/* Group Head Selection */}
                <Box className="space-y-3">
                  <Box className="flex-row items-center">
                    <Text className="text-base font-medium" style={{ color: theme.text }}>
                      Group Head
                    </Text>
                    <Text className="text-xs ml-1" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                      (optional)
                    </Text>
                  </Box>
                  <Select
                    selectedValue={selectedGroupHead}
                    onValueChange={(value) => setSelectedGroupHead(value)}
                  >
                    <SelectTrigger
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                        borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
                        borderWidth: 1,
                      }}
                    >
                      <SelectInput
                        placeholder="Select a member (optional)"
                        style={{ color: theme.text, fontSize: 16 }}
                      />
                      <SelectIcon>
                        <ChevronDown size={20} color={theme.text} />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        {sampleMembers.map((member) => (
                          <SelectItem
                            key={member.id}
                            label={`${member.name} (${member.role})`}
                            value={member.id}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  <Text className="text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                    You can assign a group head later if you prefer
                  </Text>
                </Box>
              </Box>
            </ModalBody>
            
            {/* Footer with Progress Indicator */}
            <Box 
              style={{
                borderTopWidth: 1,
                borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                paddingVertical: 16,
                paddingHorizontal: 24,
              }}
            >
              <Box className="flex-row items-center justify-between mb-4 gap-2">
                <Box className="flex-row items-center">
                  <Box 
                    className="h-2 w-2 rounded-full mr-2" 
                    style={{ 
                      backgroundColor: newGroupName.trim() ? 
                        (colorScheme === "dark" ? "#A076F9" : theme.tint) : 
                        (colorScheme === "dark" ? "#555555" : "#CCCCCC") 
                    }} 
                  />
                  <Text 
                    className="text-xs" 
                    style={{ 
                      color: newGroupName.trim() ? 
                        (colorScheme === "dark" ? "#A076F9" : theme.tint) : 
                        (colorScheme === "dark" ? "#AAAAAA" : "#666666") 
                    }}
                  >
                    Group Name
                  </Text>
                </Box>
                
                <Box className="flex-row items-center justify-end space-x-3 gap-3">
                  <Button
                    className="rounded-xl px-5 py-3 h-fit"
                    style={{
                      backgroundColor: "transparent",
                      borderWidth: 1,
                      borderColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.5)" : "rgba(45, 18, 72, 0.2)",
                    }}
                    onPress={() => setIsCreateModalOpen(false)}
                  >
                    <ButtonText style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}>
                      Cancel
                    </ButtonText>
                  </Button>
                  <Button
                    className="rounded-xl px-5 py-3 h-fit"
                    style={{
                      backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
                      opacity: !newGroupName.trim() || creating ? 0.6 : 1,
                    }}
                    onPress={handleCreateGroup}
                    isDisabled={!newGroupName.trim() || creating}
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
                        Create Group
                      </ButtonText>
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </ModalContent>
        </Modal>
      </Box>
    </SafeAreaView>
  );
}
