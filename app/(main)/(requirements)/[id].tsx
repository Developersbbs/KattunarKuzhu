import React, { useState } from 'react';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { RequirementPost, TaggedMember } from "@/components/RequirementPostCard";
import { Calendar, DollarSign, Clock, MessageSquare, User, Send, X, Check, AlertCircle } from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallbackText } from "@/components/ui/avatar";
import { Stack } from "expo-router";

// Sample data for requirement posts (same as in posts.tsx)
const sampleRequirementPosts: RequirementPost[] = [
  {
    id: "1",
    title: "Need 10 new laptops for office",
    description: "Looking for 10 business laptops with i5 processor, 16GB RAM, and 512GB SSD. Needed within 2 weeks.",
    type: "public",
    category: "Office Supplies",
    timeline: "2 weeks",
    budget: 15000,
    postedDate: "10 Aug 2023",
    postedBy: {
      id: "user1",
      name: "John Doe",
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

// Sample responses for public requirements
interface RequirementResponse {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  quote?: string | number;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const sampleResponses: Record<string, RequirementResponse[]> = {
  "1": [
    {
      id: "resp1",
      userId: "user2",
      userName: "Jane Smith",
      message: "I can provide 10 Dell laptops with the specified configuration.",
      quote: 14500,
      date: "11 Aug 2023",
      status: "pending"
    },
    {
      id: "resp2",
      userId: "user3",
      userName: "Mike Johnson",
      message: "We have HP laptops in stock that match your requirements. Can deliver within 3 days.",
      quote: 13800,
      date: "12 Aug 2023",
      status: "pending"
    },
    {
      id: "resp3",
      userId: "user4",
      userName: "Sarah Williams",
      message: "I can offer Lenovo ThinkPad laptops with i7 processors at the same price point.",
      quote: 15000,
      date: "12 Aug 2023",
      status: "pending"
    }
  ],
  "3": [
    {
      id: "resp4",
      userId: "user8",
      userName: "Alex Thompson",
      message: "I have an office space available in T.Nagar business district. 2200 sq ft, fully furnished.",
      quote: 7500,
      date: "6 Aug 2023",
      status: "pending"
    },
    {
      id: "resp5",
      userId: "user9",
      userName: "Emily Davis",
      message: "2000 sq ft space available in Anna Nagar with parking facilities.",
      quote: 8200,
      date: "7 Aug 2023",
      status: "pending"
    }
  ],
  "4": [
    {
      id: "resp6",
      userId: "user10",
      userName: "Daniel Wilson",
      message: "I'm a marketing consultant with 10 years of experience in product launches.",
      quote: 3200,
      date: "2 Aug 2023",
      status: "pending"
    }
  ]
};

export default function RequirementDetailScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [responseText, setResponseText] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
  
  // Find the requirement post by ID
  const requirement = sampleRequirementPosts.find(post => post.id === id);
  
  // Get responses for this requirement
  const responses = sampleResponses[id as string] || [];
  
  // Check if current user is the owner of this requirement
  const isOwner = requirement?.postedBy.id === "user1"; // Assuming current user is user1
  
  // Handle submitting a response
  const handleSubmitResponse = () => {
    if (!responseText.trim()) {
      Alert.alert("Error", "Please enter a response message");
      return;
    }
    
    Alert.alert("Response Submitted", "Your response has been submitted successfully.");
    setResponseText("");
    setQuoteAmount("");
    setShowResponseForm(false);
  };
  
  // Handle accepting a response
  const handleAcceptResponse = () => {
    Alert.alert("Response Accepted", "You have accepted this response. The provider will be notified.");
    setShowAcceptModal(false);
  };
  
  // Get status badge background color
  const getStatusBgColor = () => {
    if (!requirement) return colorScheme === "dark" ? "#333333" : "#F0F0F0";
    
    switch (requirement.status) {
      case "active":
        return colorScheme === "dark" ? "#1E3A2F" : "#E6F4EA";
      case "closed":
        return colorScheme === "dark" ? "#3E2A2A" : "#FDEDED";
      case "expired":
        return colorScheme === "dark" ? "#333333" : "#F0F0F0";
      default:
        return colorScheme === "dark" ? "#333333" : "#F0F0F0";
    }
  };
  
  // Get status badge text color
  const getStatusTextColor = () => {
    if (!requirement) return colorScheme === "dark" ? "#AAAAAA" : "#666666";
    
    switch (requirement.status) {
      case "active":
        return colorScheme === "dark" ? "#81C995" : "#137333";
      case "closed":
        return colorScheme === "dark" ? "#F28B82" : "#C5221F";
      case "expired":
        return colorScheme === "dark" ? "#AAAAAA" : "#666666";
      default:
        return colorScheme === "dark" ? "#AAAAAA" : "#666666";
    }
  };
  
  // Get member status badge background color
  const getMemberStatusBgColor = (status: TaggedMember['status']) => {
    switch (status) {
      case "accepted":
        return colorScheme === "dark" ? "#1E3A2F" : "#E6F4EA";
      case "rejected":
        return colorScheme === "dark" ? "#3E2A2A" : "#FDEDED";
      case "read":
        return colorScheme === "dark" ? "#2F3A4A" : "#E8F0FE";
      case "delivered":
        return colorScheme === "dark" ? "#333333" : "#F0F0F0";
      default:
        return colorScheme === "dark" ? "#333333" : "#F0F0F0";
    }
  };
  
  // Get member status badge text color
  const getMemberStatusTextColor = (status: TaggedMember['status']) => {
    switch (status) {
      case "accepted":
        return colorScheme === "dark" ? "#81C995" : "#137333";
      case "rejected":
        return colorScheme === "dark" ? "#F28B82" : "#C5221F";
      case "read":
        return colorScheme === "dark" ? "#8AB4F8" : "#1A73E8";
      case "delivered":
        return colorScheme === "dark" ? "#AAAAAA" : "#666666";
      default:
        return colorScheme === "dark" ? "#AAAAAA" : "#666666";
    }
  };
  
  // Render the accept response modal
  const renderAcceptModal = () => {
    if (!selectedResponseId) return null;
    
    const response = responses.find(r => r.id === selectedResponseId);
    if (!response) return null;
    
    return (
      <Modal
        visible={showAcceptModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAcceptModal(false)}
      >
        <Box 
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Box 
            className="m-5 p-5 rounded-xl"
            style={{ backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF" }}
          >
            <Box className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold" style={{ color: theme.text }}>
                Accept Response
              </Text>
              <TouchableOpacity onPress={() => setShowAcceptModal(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </Box>
            
            <Box className="mb-4">
              <Text className="mb-2" style={{ color: theme.text }}>
                You are about to accept the response from:
              </Text>
              <Text className="font-bold mb-1" style={{ color: theme.text }}>
                {response.userName}
              </Text>
              <Text className="mb-2" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
                Quote: ₹{response.quote}
              </Text>
              <Text style={{ color: theme.text }}>
                "{response.message}"
              </Text>
            </Box>
            
            <Box className="flex-row justify-end">
              <Button
                className="mr-2"
                variant="outline"
                onPress={() => setShowAcceptModal(false)}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                style={{ backgroundColor: theme.tint }}
                onPress={handleAcceptResponse}
              >
                <ButtonText>Accept</ButtonText>
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  };
  
  // If requirement not found
  if (!requirement) {
    return (
      <Box className="flex-1 items-center justify-center p-6">
        <AlertCircle size={60} color={theme.tint} opacity={0.5} />
        <Text className="text-xl font-bold mt-4" style={{ color: theme.text }}>
          Requirement Not Found
        </Text>
        <Text className="text-base text-center mt-2" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
          The requirement you're looking for doesn't exist or has been removed
        </Text>
        <Button
          className="mt-4"
          style={{ backgroundColor: theme.tint }}
          onPress={() => router.back()}
        >
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }
  
  return (
    <Box className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: requirement.title,
        }}
      />
        {/* Requirement Details Section */}
        <Box className="p-4">
          {/* Category and Status */}
          <Box className="flex-row justify-between mb-3">
            <Box 
              className="px-3 py-1 rounded-md self-start"
              style={{ backgroundColor: colorScheme === "dark" ? "#2D1248" : "#E8DDFF" }}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: colorScheme === "dark" ? "#FFFFFF" : "#2D1248" }}
              >
                {requirement.category}
              </Text>
            </Box>
            
            <Box 
              className="px-3 py-1 rounded-md self-start"
              style={{ backgroundColor: getStatusBgColor() }}
            >
              <Text 
                className="text-sm"
                style={{ color: getStatusTextColor() }}
              >
                {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
              </Text>
            </Box>
          </Box>
          
          {/* Title */}
          <Text 
            className="text-2xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            {requirement.title}
          </Text>
          
          {/* Posted By and Date */}
          <Box className="flex-row justify-between mb-4">
            <Box className="flex-row items-center">
              <User size={16} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
              <Text 
                className="ml-1 text-sm"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                Posted by {requirement.postedBy.name}
              </Text>
            </Box>
            
            <Text 
              className="text-sm"
              style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
            >
              {requirement.postedDate}
            </Text>
          </Box>
          
          {/* Description */}
          <Box 
            className="p-4 mb-4 rounded-lg"
            style={{ 
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "#333333" : "#E0E0E0"
            }}
          >
            <Text style={{ color: theme.text }}>
              {requirement.description}
            </Text>
          </Box>
          
          {/* Details Grid */}
          <Box className="flex-row flex-wrap mb-4">
            {/* Timeline */}
            <Box 
              className="w-1/2 mb-3 pr-1"
              style={{ 
                borderRightWidth: 1,
                borderRightColor: colorScheme === "dark" ? "#333333" : "#E0E0E0"
              }}
            >
              <Box className="flex-row items-center mb-1">
                <Clock size={16} color={theme.tint} />
                <Text 
                  className="ml-2 font-medium"
                  style={{ color: theme.text }}
                >
                  Timeline
                </Text>
              </Box>
              <Text style={{ color: theme.text }}>
                {requirement.timeline}
              </Text>
            </Box>
            
            {/* Budget */}
            <Box className="w-1/2 mb-3 pl-3">
              <Box className="flex-row items-center mb-1">
                <DollarSign size={16} color={theme.tint} />
                <Text 
                  className="ml-2 font-medium"
                  style={{ color: theme.text }}
                >
                  Budget
                </Text>
              </Box>
              <Text style={{ color: theme.text }}>
                ₹{requirement.budget}
              </Text>
            </Box>
            
            {/* Type */}
            <Box className="w-1/2 pr-1">
              <Box className="flex-row items-center mb-1">
                <MessageSquare size={16} color={theme.tint} />
                <Text 
                  className="ml-2 font-medium"
                  style={{ color: theme.text }}
                >
                  Type
                </Text>
              </Box>
              <Text style={{ color: theme.text }}>
                {requirement.type.charAt(0).toUpperCase() + requirement.type.slice(1)}
              </Text>
            </Box>
            
            {/* Posted Date */}
            <Box className="w-1/2 pl-3">
              <Box className="flex-row items-center mb-1">
                <Calendar size={16} color={theme.tint} />
                <Text 
                  className="ml-2 font-medium"
                  style={{ color: theme.text }}
                >
                  Posted Date
                </Text>
              </Box>
              <Text style={{ color: theme.text }}>
                {requirement.postedDate}
              </Text>
            </Box>
          </Box>
          
          {/* Tagged Members Section (for private requirements) */}
          {requirement.type === "private" && requirement.taggedMembers && (
            <Box className="mb-4">
              <Text 
                className="text-lg font-bold mb-2"
                style={{ color: theme.text }}
              >
                Tagged Members
              </Text>
              
              <Box className="flex-row flex-wrap">
                {requirement.taggedMembers.map((member) => (
                  <Box 
                    key={member.id}
                    className="mr-2 mb-2 px-3 py-2 rounded-full flex-row items-center"
                    style={{ backgroundColor: getMemberStatusBgColor(member.status) }}
                  >
                    <Text 
                      className="text-sm"
                      style={{ color: getMemberStatusTextColor(member.status) }}
                    >
                      {member.name} • {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          
          {/* Responses Section (for public requirements or if owner) */}
          {(requirement.type === "public" || isOwner) && (
            <Box className="mt-4">
              <Box className="flex-row justify-between items-center mb-3">
                <Text 
                  className="text-lg font-bold"
                  style={{ color: theme.text }}
                >
                  Responses ({responses.length})
                </Text>
                
                {!isOwner && requirement.type === "public" && requirement.status === "active" && (
                  <Button
                    size="sm"
                    style={{ backgroundColor: theme.tint }}
                    onPress={() => setShowResponseForm(true)}
                  >
                    <ButtonText>Respond</ButtonText>
                  </Button>
                )}
              </Box>
              
              {/* Response Form */}
              {showResponseForm && (
                <Box 
                  className="p-4 mb-4 rounded-lg"
                  style={{ 
                    backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
                    borderWidth: 1,
                    borderColor: colorScheme === "dark" ? "#333333" : "#E0E0E0"
                  }}
                >
                  <Text 
                    className="text-base font-bold mb-2"
                    style={{ color: theme.text }}
                  >
                    Your Response
                  </Text>
                  
                  <Input
                    className="mb-3"
                    style={{ 
                      borderWidth: 1,
                      borderColor: colorScheme === "dark" ? "#333333" : "#E0E0E0",
                      backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
                    }}
                  >
                    <InputField
                      placeholder="Enter your message"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      value={responseText}
                      onChangeText={setResponseText}
                      style={{ color: theme.text }}
                    />
                  </Input>
                  
                  <Input
                    className="mb-3"
                    style={{ 
                      borderWidth: 1,
                      borderColor: colorScheme === "dark" ? "#333333" : "#E0E0E0",
                      backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
                    }}
                  >
                    <InputField
                      placeholder="Your quote amount (optional)"
                      keyboardType="numeric"
                      value={quoteAmount}
                      onChangeText={setQuoteAmount}
                      style={{ color: theme.text }}
                    />
                  </Input>
                  
                  <Box className="flex-row justify-end">
                    <Button
                      className="mr-2"
                      variant="outline"
                      onPress={() => setShowResponseForm(false)}
                    >
                      <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                      style={{ backgroundColor: theme.tint }}
                      onPress={handleSubmitResponse}
                    >
                      <ButtonText>Submit</ButtonText>
                    </Button>
                  </Box>
                </Box>
              )}
              
              {/* Response List */}
              {responses.length > 0 ? (
                responses.map((response) => (
                  <Box 
                    key={response.id}
                    className="mb-3 p-4 rounded-lg"
                    style={{ 
                      backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
                      borderWidth: 1,
                      borderColor: colorScheme === "dark" ? "#333333" : "#E0E0E0"
                    }}
                  >
                    <Box className="flex-row justify-between items-center mb-2">
                      <Box className="flex-row items-center">
                        <Avatar>
                          <AvatarFallbackText>{response.userName}</AvatarFallbackText>
                        </Avatar>
                        <Box className="ml-2">
                          <Text 
                            className="font-medium"
                            style={{ color: theme.text }}
                          >
                            {response.userName}
                          </Text>
                          <Text 
                            className="text-xs"
                            style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                          >
                            {response.date}
                          </Text>
                        </Box>
                      </Box>
                      
                      {response.quote && (
                        <Box 
                          className="px-3 py-1 rounded-md"
                          style={{ backgroundColor: colorScheme === "dark" ? "#2D1248" : "#E8DDFF" }}
                        >
                          <Text 
                            className="text-sm font-medium"
                            style={{ color: colorScheme === "dark" ? "#FFFFFF" : "#2D1248" }}
                          >
                            ₹{response.quote}
                          </Text>
                        </Box>
                      )}
                    </Box>
                    
                    <Text 
                      className="mb-3"
                      style={{ color: theme.text }}
                    >
                      {response.message}
                    </Text>
                    
                    {isOwner && requirement.status === "active" && (
                      <Box className="flex-row justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="mr-2"
                          onPress={() => {
                            setSelectedResponseId(response.id);
                            setShowAcceptModal(true);
                          }}
                        >
                          <ButtonText>Accept</ButtonText>
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Box 
                  className="p-4 items-center justify-center rounded-lg"
                  style={{ 
                    backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
                    borderWidth: 1,
                    borderColor: colorScheme === "dark" ? "#333333" : "#E0E0E0"
                  }}
                >
                  <MessageSquare size={40} color={theme.tint} opacity={0.5} />
                  <Text 
                    className="mt-2 text-base"
                    style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                  >
                    No responses yet
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </ScrollView>
      
      {/* Action Button (for public requirements) */}
      {requirement.type === "public" && requirement.status === "active" && !isOwner && !showResponseForm && (
        <Box 
          className="p-4"
          style={{ 
            borderTopWidth: 1,
            borderTopColor: colorScheme === "dark" ? "#333333" : "#E0E0E0",
            backgroundColor: theme.background
          }}
        >
          <Button
            style={{ backgroundColor: theme.tint }}
            onPress={() => setShowResponseForm(true)}
          >
            <Send size={16} color="#FFFFFF" className="mr-2" />
            <ButtonText>Respond to Requirement</ButtonText>
          </Button>
        </Box>
      )}
      
      {/* Accept Response Modal */}
      {renderAcceptModal()}
    </Box>
  );
} 