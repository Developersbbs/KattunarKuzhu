import React, { useState, useMemo } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { FileText, Globe, User, Plus } from "lucide-react-native";
import { TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import RequirementPostCard, { RequirementPost } from "@/components/RequirementPostCard";
import RequirementFilters, { RequirementFilters as Filters } from "@/components/RequirementFilters";

const { width } = Dimensions.get("window");

type TabType = "public" | "my-requirements";

// Sample data for requirement posts
const sampleRequirementPosts: RequirementPost[] = [
  {
    id: "1",
    title: "Need skilled painters for apartment project",
    description: "Looking for experienced painters for a 20-flat apartment painting project in Anna Nagar. Work to start within 2 weeks.",
    type: "public",
    category: "Painting",
    timeline: "2 weeks",
    budget: 120000,
    postedDate: "10 Aug 2023",
    postedBy: {
      id: "user1",
      name: "Karthikeyan",
    },
    status: "active",
    views: 24,
    responses: 5
  },
  {
    id: "2",
    title: "Website development needed",
    description: "Need a professional to develop a business website with e-commerce capabilities.",
    type: "private",
    category: "Services",
    timeline: "1 month",
    budget: 5000,
    postedDate: "8 Aug 2023",
    postedBy: {
      id: "user1",
      name: "John Doe",
    },
    status: "active",
    views: 0,
    responses: 0,
    taggedMembers: [
      {
        id: "user2",
        name: "Jane Smith",
        status: "read"
      },
      {
        id: "user3",
        name: "Mike Johnson",
        status: "delivered"
      },
      {
        id: "user4",
        name: "Sarah Williams",
        status: "accepted"
      }
    ]
  },
  {
    id: "3",
    title: "Office space for rent",
    description: "Looking for a 2000 sq ft office space in the business district for 6 months.",
    type: "public",
    category: "Real Estate",
    timeline: "1 month",
    budget: 8000,
    postedDate: "5 Aug 2023",
    postedBy: {
      id: "user5",
      name: "Robert Brown",
    },
    status: "active",
    views: 42,
    responses: 8
  },
  {
    id: "4",
    title: "Marketing consultant needed",
    description: "Need an experienced marketing consultant for a product launch campaign.",
    type: "public",
    category: "Consulting",
    timeline: "2 months",
    budget: 3500,
    postedDate: "1 Aug 2023",
    postedBy: {
      id: "user1",
      name: "John Doe",
    },
    status: "active",
    views: 36,
    responses: 12
  },
  {
    id: "5",
    title: "Graphic design for brochures",
    description: "Need a graphic designer to create marketing brochures and flyers.",
    type: "private",
    category: "Design",
    timeline: "2 weeks",
    budget: 1200,
    postedDate: "30 Jul 2023",
    postedBy: {
      id: "user1",
      name: "John Doe",
    },
    status: "closed",
    views: 0,
    responses: 0,
    taggedMembers: [
      {
        id: "user6",
        name: "Lisa Chen",
        status: "rejected"
      },
      {
        id: "user7",
        name: "David Kim",
        status: "accepted"
      }
    ]
  }
];

export default function PostsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabType>("public");
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    status: [],
    timeframe: "all"
  });
  
  // Extract all available categories and statuses for filter options
  const availableCategories = useMemo(() => {
    return [...new Set(sampleRequirementPosts.map(post => post.category))];
  }, []);
  
  const availableStatuses = useMemo(() => {
    return [...new Set(sampleRequirementPosts.map(post => post.status))];
  }, []);
  
  // Apply filters to the requirements
  const filteredRequirements = useMemo(() => {
    let filtered = [...sampleRequirementPosts];
    
    // Filter by type based on active tab
    filtered = filtered.filter(post => {
      if (activeTab === "public") {
        return post.type === "public";
      } else {
        // My requirements tab - show all posts by the current user
        return post.postedBy.id === "user1"; // Assuming current user is user1
      }
    });
    
    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(post => filters.categories.includes(post.category));
    }
    
    // Apply status filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(post => filters.status.includes(post.status));
    }
    
    // Apply timeframe filter
    if (filters.timeframe !== "all") {
      const now = new Date();
      const postDate = (dateStr: string) => {
        const parts = dateStr.split(" ");
        const day = parseInt(parts[0]);
        const month = parts[1];
        const year = parseInt(parts[2]);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return new Date(year, months.indexOf(month), day);
      };
      
      filtered = filtered.filter(post => {
        const date = postDate(post.postedDate);
        switch (filters.timeframe) {
          case "today":
            return date.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return date >= weekAgo;
          case "month":
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            return date >= monthAgo;
          case "3months":
            const threeMonthsAgo = new Date(now);
            threeMonthsAgo.setMonth(now.getMonth() - 3);
            return date >= threeMonthsAgo;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [activeTab, filters, sampleRequirementPosts]);
  
  const publicRequirements = useMemo(() => {
    return activeTab === "public" ? filteredRequirements : [];
  }, [activeTab, filteredRequirements]);
  
  const myRequirements = useMemo(() => {
    return activeTab === "my-requirements" ? filteredRequirements : [];
  }, [activeTab, filteredRequirements]);
  
  const handleCreateRequirement = () => {
    Alert.alert("Create Requirement", "This feature is coming soon!");
    // Future implementation: router.push("/(requirements)/create");
  };
  
  const handleRequirementPress = (requirementId: string) => {
    router.push(`/${requirementId}`);
  };
  
  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "public":
        return renderPublicFeedTab();
      case "my-requirements":
        return renderMyRequirementsTab();
      default:
        return null;
    }
  };
  
  const renderPublicFeedTab = () => {
    if (publicRequirements.length === 0) {
      return (
        <Box className="flex-1 items-center justify-center p-6">
          <FileText size={60} color={theme.tint} opacity={0.5} />
          <Text className="text-xl font-bold mt-4" style={{ color: theme.text }}>
            No public requirements
          </Text>
          <Text className="text-base text-center mt-2" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
            Check back later for new requirements
          </Text>
        </Box>
      );
    }
    
    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Box className="p-4">
          <Text className="text-lg font-bold mb-3" style={{ color: theme.text }}>
            Public Requirements
          </Text>
          
          {publicRequirements.map((requirement) => (
            <RequirementPostCard
              key={requirement.id}
              requirement={requirement}
              onPress={handleRequirementPress}
              isOwner={false}
            />
          ))}
        </Box>
      </ScrollView>
    );
  };
  
  const renderMyRequirementsTab = () => {
    if (myRequirements.length === 0) {
      return (
        <Box className="flex-1 items-center justify-center p-6">
          <FileText size={60} color={theme.tint} opacity={0.5} />
          <Text className="text-xl font-bold mt-4" style={{ color: theme.text }}>
            No requirements posted
          </Text>
          <Text className="text-base text-center mt-2" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
            Create your first requirement post
          </Text>
          <Button
            className="mt-4"
            style={{ backgroundColor: theme.tint }}
            onPress={handleCreateRequirement}
          >
            <ButtonText>Create Requirement</ButtonText>
          </Button>
        </Box>
      );
    }
    
    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Box className="p-4">
          <Text className="text-lg font-bold mb-3" style={{ color: theme.text }}>
            My Requirements
          </Text>
          
          {myRequirements.map((requirement) => (
            <RequirementPostCard
              key={requirement.id}
              requirement={requirement}
              onPress={handleRequirementPress}
              isOwner={true}
            />
          ))}
        </Box>
      </ScrollView>
    );
  };
  
  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <Box className="pt-4 pb-2 px-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold" style={{ color: theme.text }}>
          Requirements
        </Text>
        <TouchableOpacity
          onPress={handleCreateRequirement}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.tint }}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Box>
      
      {/* Tab Navigation */}
      <Box 
        className="flex-row mb-2 px-4"
        style={{ borderBottomWidth: 1, borderBottomColor: colorScheme === "dark" ? "#333333" : "#E0E0E0" }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("public")}
          className="mr-4 pb-2"
          style={{
            borderBottomWidth: 2,
            borderBottomColor: activeTab === "public" ? theme.tint : "transparent"
          }}
        >
          <Box className="flex-row items-center">
            <Globe size={16} color={activeTab === "public" ? theme.tint : theme.tabIconDefault} />
            <Text 
              className="ml-1 font-medium"
              style={{ color: activeTab === "public" ? theme.tint : theme.tabIconDefault }}
            >
              Public Feed
            </Text>
          </Box>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab("my-requirements")}
          className="pb-2"
          style={{
            borderBottomWidth: 2,
            borderBottomColor: activeTab === "my-requirements" ? theme.tint : "transparent"
          }}
        >
          <Box className="flex-row items-center">
            <User size={16} color={activeTab === "my-requirements" ? theme.tint : theme.tabIconDefault} />
            <Text 
              className="ml-1 font-medium"
              style={{ color: activeTab === "my-requirements" ? theme.tint : theme.tabIconDefault }}
            >
              My Requirements
            </Text>
          </Box>
        </TouchableOpacity>
        
        {/* Filter Button */}
        <Box className="flex-1 flex-row justify-end">
          <RequirementFilters 
            onApplyFilters={handleApplyFilters}
            availableCategories={availableCategories}
            availableStatuses={availableStatuses}
          />
        </Box>
      </Box>
      
      {/* Tab Content */}
      <Box className="flex-1">
        {renderTabContent()}
      </Box>
    </Box>
  );
} 