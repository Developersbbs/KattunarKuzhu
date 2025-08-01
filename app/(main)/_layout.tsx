import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import BottomNavBar from "@/components/BottomNavBar";
import { View } from "react-native";

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Stack.Screen
          name="meetings"
          options={{
            title: "Meetings",
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            title: "Search",
          }}
        />
        <Stack.Screen
          name="referrals"
          options={{
            title: "Referrals",
          }}
        />
        <Stack.Screen
          name="posts"
          options={{
            title: "Posts",
          }}
        />
      </Stack>
      <BottomNavBar />
    </View>
  );
}
