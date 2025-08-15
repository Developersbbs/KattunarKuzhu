import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { Eye, MessageSquare } from "lucide-react-native";

// Define types
export type RequirementType = "public" | "private";
export type RequirementStatus = "active" | "closed" | "expired";
export type MemberStatus = "delivered" | "read" | "accepted" | "rejected";

export interface TaggedMember {
  id: string;
  name: string;
  avatar?: string;
  status: MemberStatus;
}

export interface RequirementPost {
  id: string;
  title: string;
  description: string;
  type: RequirementType;
  category: string;
  timeline: string;
  budget: string | number;
  postedDate: string;
  postedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: RequirementStatus;
  views: number;
  responses: number;
  taggedMembers?: TaggedMember[];
}

interface RequirementPostCardProps {
  requirement: RequirementPost;
  onPress: (id: string) => void;
  isOwner?: boolean;
}

export default function RequirementPostCard({ requirement, onPress, isOwner = false }: RequirementPostCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  // Get category badge background color
  const getCategoryBgColor = () => {
    return colorScheme === "dark" ? "#2D1248" : "#E8DDFF";
  };
  
  // Get category badge text color
  const getCategoryTextColor = () => {
    return colorScheme === "dark" ? "#FFFFFF" : "#2D1248";
  };
  
  // Get status badge background color
  const getStatusBgColor = () => {
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
  const getMemberStatusBgColor = (status: MemberStatus) => {
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
  const getMemberStatusTextColor = (status: MemberStatus) => {
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
  
  // Render the card content
  return (
    <TouchableOpacity 
      onPress={() => onPress(requirement.id)}
      activeOpacity={0.7}
    >
      <Box 
        className="mb-4 p-4 rounded-xl"
        style={{ 
          backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "#333333" : "#E0E0E0"
        }}
      >
        {/* Header with category and date/type */}
        <Box className="flex-row justify-between mb-2">
          {/* Category badge */}
          <Box 
            className="px-2 py-1 rounded-md self-start"
            style={{ backgroundColor: getCategoryBgColor() }}
          >
            <Text 
              className="text-xs font-medium"
              style={{ color: getCategoryTextColor() }}
            >
              {requirement.category}
            </Text>
          </Box>
          
          {/* Date or type badge for owner view */}
          {isOwner ? (
            <Box 
              className="px-2 py-1 rounded-md self-start"
              style={{ 
                backgroundColor: requirement.type === "private" 
                  ? (colorScheme === "dark" ? "#333333" : "#F0F0F0") 
                  : "transparent"
              }}
            >
              <Text 
                className="text-xs"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                {requirement.type === "private" ? "Private" : "Public"}
              </Text>
            </Box>
          ) : (
            <Text 
              className="text-xs"
              style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
            >
              {requirement.postedDate}
            </Text>
          )}
        </Box>
        
        {/* Title */}
        <Text 
          className="text-base font-bold mb-2"
          style={{ color: theme.text }}
        >
          {requirement.title}
        </Text>
        
        {/* Status badge if owner view */}
        {isOwner && (
          <Box 
            className="px-2 py-1 rounded-md self-start mb-2"
            style={{ backgroundColor: getStatusBgColor() }}
          >
            <Text 
              className="text-xs"
              style={{ color: getStatusTextColor() }}
            >
              {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
            </Text>
          </Box>
        )}
        
        {/* Footer with stats */}
        <Box className="flex-row justify-between mt-2">
          {/* Date (if not owner view) or empty */}
          {!isOwner ? (
            <Box className="flex-row items-center">
              <Text 
                className="text-xs"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                By {requirement.postedBy.name}
              </Text>
            </Box>
          ) : (
            <Text 
              className="text-xs"
              style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
            >
              {requirement.postedDate}
            </Text>
          )}
          
          {/* Views and responses for public requirements */}
          {requirement.type === "public" && (
            <Box className="flex-row items-center">
              {!isOwner && (
                <Box className="flex-row items-center mr-4">
                  <Eye size={14} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                  <Text 
                    className="text-xs ml-1"
                    style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                  >
                    {requirement.views} views
                  </Text>
                </Box>
              )}
              
              <Box className="flex-row items-center">
                <MessageSquare size={14} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
                <Text 
                  className="text-xs ml-1"
                  style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                >
                  {requirement.responses} responses
                </Text>
              </Box>
            </Box>
          )}
          
          {/* Tagged members view status for private requirements */}
          {requirement.type === "private" && requirement.taggedMembers && (
            <Box className="flex-row items-center">
              <Text 
                className="text-xs"
                style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
              >
                {requirement.taggedMembers.filter(m => m.status === "read" || m.status === "accepted").length}/{requirement.taggedMembers.length} Viewed
              </Text>
            </Box>
          )}
        </Box>
        
        {/* Tagged members section for private requirements */}
        {requirement.type === "private" && requirement.taggedMembers && (
          <Box className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colorScheme === "dark" ? "#333333" : "#E0E0E0" }}>
            <Box className="flex-row flex-wrap">
              {requirement.taggedMembers.map((member) => (
                <Box 
                  key={member.id}
                  className="mr-2 mb-2 px-2 py-1 rounded-full flex-row items-center"
                  style={{ backgroundColor: getMemberStatusBgColor(member.status) }}
                >
                  <Text 
                    className="text-xs"
                    style={{ color: getMemberStatusTextColor(member.status) }}
                  >
                    {member.name} • {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </TouchableOpacity>
  );
} 