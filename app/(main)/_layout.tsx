import React from "react";
import { Stack, usePathname } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import BottomNavBar from "@/components/BottomNavBar";
import { View } from "react-native";

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const pathname = usePathname();
  
  // Check if current screen is the home screen
  const isHomeScreen = pathname === "/(main)" || pathname === "/(main)/";

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
            headerShown: false, // Hide header on home screen
          }}
        />
        <Stack.Screen
          name="meetings"
          options={{
            title: "Meetings",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            title: "Search",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="referrals"
          options={{
            title: "Referrals",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="posts"
          options={{
            title: "Posts",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="requirements"
          options={{
            title: "Requirements",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="groups"
          options={{
            title: "Groups",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="members"
          options={{
            title: "Members",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="messages"
          options={{
            title: "Messages",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="announcements"
          options={{
            title: "Announcements",
            headerShown: false, // Hide header on admin pages
          }}
        />
        <Stack.Screen
          name="general"
          options={{
            title: "Settings",
            headerShown: false, // Hide header on admin pages
          }}
        />
      </Stack>
      <BottomNavBar />
    </View>
  );
}
