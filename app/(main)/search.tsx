import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Search } from "lucide-react-native";

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Box className="flex-1 items-center justify-center">
      <Box className="items-center p-6">
        <Search size={60} color={theme.tint} />
        <Text
          className="text-2xl font-bold mt-4"
          style={{ color: theme.text }}
        >
          Search
        </Text>
        <Text
          className="text-base text-center mt-2"
          style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
        >
          Search for members, posts, and more
        </Text>
      </Box>
    </Box>
  );
} 