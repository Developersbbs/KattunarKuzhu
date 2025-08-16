import React from "react";
import { Slot, Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native";
import Gradient from "@/assets/Icons/Gradient";
import { Box } from "@/components/ui/box";

export default function AdminLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

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
        <Stack 
          screenOptions={{
            headerShown: false,
            animation: "none"
          }}
        />
      </Box>
    </SafeAreaView>
  );
}
