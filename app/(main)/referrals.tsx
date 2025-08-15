import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Users } from "lucide-react-native";

export default function ReferralsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Box className="flex-1 items-center justify-center">
      <Box className="items-center p-6">
        <Users size={60} color={theme.tint} />
        <Text
          className="text-2xl font-bold mt-4"
          style={{ color: theme.text }}
        >
          Referrals
        </Text>
        <Text
          className="text-base text-center mt-2"
          style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
        >
          No referrals yet created
        </Text>
      </Box>
    </Box>
  );
} 