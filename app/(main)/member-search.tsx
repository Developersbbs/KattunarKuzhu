import React, { useState, useEffect, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useRouter, Stack } from "expo-router";
import { ScrollView, Dimensions, StyleSheet, ActivityIndicator, FlatList, TextInput } from "react-native";
import { Search, ArrowLeft, User, Building, MapPin, ChevronRight } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "@/components/ui/image";

const { width } = Dimensions.get("window");

// Define member interface
interface Member {
  id: string;
  name: string;
  company: string;
  location: string;
  avatar: string;
  role?: string;
}

// Sample member data
const sampleMembers: Member[] = [
  {
    id: "1",
    name: "John Smith",
    company: "ABC Technologies",
    location: "T.Nagar, Chennai",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "CEO"
  },
  {
    id: "2",
    name: "Sarah Williams",
    company: "XYZ Solutions",
    location: "Velachery, Chennai",
    avatar: "https://i.pravatar.cc/150?img=2",
    role: "Marketing Director"
  },
  {
    id: "3",
    name: "Michael Johnson",
    company: "Johnson & Co.",
    location: "Adyar, Chennai",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Business Consultant"
  },
  {
    id: "4",
    name: "Emily Davis",
    company: "Tech Innovators",
    location: "Anna Nagar, Chennai",
    avatar: "https://i.pravatar.cc/150?img=4",
    role: "CTO"
  },
  {
    id: "5",
    name: "Robert Wilson",
    company: "Global Enterprises",
    location: "Nungambakkam, Chennai",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "Sales Director"
  },
  {
    id: "6",
    name: "Jennifer Lee",
    company: "Creative Solutions",
    location: "Mylapore, Chennai",
    avatar: "https://i.pravatar.cc/150?img=6",
    role: "Product Manager"
  },
  {
    id: "7",
    name: "David Brown",
    company: "Brown Industries",
    location: "Guindy, Chennai",
    avatar: "https://i.pravatar.cc/150?img=7",
    role: "Founder"
  }
];

export default function MemberSearchScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>(sampleMembers.slice(0, 3));
  
  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Filter members based on search query
    const filteredMembers = sampleMembers.filter(member => 
      member.name.toLowerCase().includes(text.toLowerCase()) ||
      member.company.toLowerCase().includes(text.toLowerCase()) ||
      member.location.toLowerCase().includes(text.toLowerCase())
    );
    
    setSearchResults(filteredMembers);
  };
  
  // Handle member selection
  const handleMemberSelect = (member: Member) => {
    router.push({
      pathname: "/schedule",
      params: { memberId: member.id, memberName: member.name }
    });
  };
  
  // Go back
  const goBack = () => {
    router.back();
  };
  
  // Render member item
  const renderMemberItem = ({ item }: { item: Member }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b"
      style={{
        borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
      }}
      onPress={() => handleMemberSelect(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.avatar }}
        className="w-12 h-12 rounded-full"
        alt={item.name}
      />
      
      <Box className="flex-1 ml-3">
        <Text className="font-semibold" style={{ color: theme.text }}>
          {item.name}
        </Text>
        
        <Box className="flex-row items-center mt-1">
          <Building size={12} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
          <Text
            className="text-xs ml-1"
            style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
          >
            {item.company}
            {item.role && ` • ${item.role}`}
          </Text>
        </Box>
        
        <Box className="flex-row items-center mt-1">
          <MapPin size={12} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
          <Text
            className="text-xs ml-1"
            style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
          >
            {item.location}
          </Text>
        </Box>
      </Box>
      
      <ChevronRight size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
    </TouchableOpacity>
  );
  
  return (
    <Box className="flex-1">
      <Stack.Screen
        options={{
          title: "Find Members",
        }}
      />
      
      <Box className="p-4">
        {/* Search Bar */}
        <Box className="relative mb-4">
          <Input
            className="rounded-full h-12"
            style={{
              backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(245, 245, 245, 0.8)",
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
            }}
          >
            <InputSlot className="pl-4">
              <Search size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
            </InputSlot>
            <InputField
              ref={searchInputRef as any}
              placeholder="Search members by name, company..."
              placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </Input>
        </Box>
        
        {/* Search Results */}
        {isSearching ? (
          searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <Box className="items-center justify-center py-10">
              <User size={60} color={colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} />
              <Text
                className="text-lg font-semibold mt-4"
                style={{ color: theme.text }}
              >
                No members found
              </Text>
              <Text
                className="text-center mt-2"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                Try a different search term
              </Text>
            </Box>
          )
        ) : (
          <>
            {/* Recent Members */}
            <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
              Recent Members
            </Text>
            
            <Box
              className="rounded-xl overflow-hidden mb-6"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              {recentMembers.map((member, index) => (
                <TouchableOpacity
                  key={member.id}
                  className="flex-row items-center p-4"
                  style={{
                    borderBottomWidth: index < recentMembers.length - 1 ? 1 : 0,
                    borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
                  }}
                  onPress={() => handleMemberSelect(member)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: member.avatar }}
                    className="w-12 h-12 rounded-full"
                    alt={member.name}
                  />
                  
                  <Box className="flex-1 ml-3">
                    <Text className="font-semibold" style={{ color: theme.text }}>
                      {member.name}
                    </Text>
                    
                    <Text
                      className="text-sm"
                      style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                    >
                      {member.company}
                    </Text>
                  </Box>
                  
                  <ChevronRight size={20} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                </TouchableOpacity>
              ))}
            </Box>
            
            {/* All Members */}
            <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
              All Members
            </Text>
            
            <Box
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <FlatList
                data={sampleMembers}
                renderItem={renderMemberItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 0 }}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
} 