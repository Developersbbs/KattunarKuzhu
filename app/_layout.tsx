import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useCallback } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/components/useColorScheme";
import { Slot, useRouter, useSegments, useFocusEffect } from "expo-router";
import { getItem } from "expo-secure-store";  
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";
import { LogBox } from 'react-native';

import "../global.css";

// Ignore specific warning
LogBox.ignoreLogs([
  'Warning: FirebaseRecaptcha: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.',
]);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Define the initial route to be the custom home screen
export const unstable_settings = {
  initialRouteName: "(main)",
  // Configure nested layouts
  "/(main)": {
    initialRouteName: "index",
  },
  "/(main)/(admin)": {
    headerShown: false,
    navigationBarHidden: true
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [styleLoaded, setStyleLoaded] = useState(false);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <OnboardingProvider>
        <GluestackUIProvider mode={colorScheme === 'dark' ? 'dark' : 'light'}>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <InitialLayout />
          </ThemeProvider>
        </GluestackUIProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}

// Auth state listener component for navigation control
function InitialLayout() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isFirstTime, completeOnboarding } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading || isFirstTime === null) {
      // Still loading, don't redirect yet
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";

    if (isFirstTime) {
      // First time user should see onboarding
      if (!inOnboarding) {
        router.replace("/onboarding");
      }
    } else if (!isAuthenticated) {
      // Unauthenticated user should go to login
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else {
      // Authenticated user should go to main app
      if (inAuthGroup || inOnboarding) {
        router.replace("/(main)");
      }
    }
  }, [isAuthenticated, isAuthLoading, segments, isFirstTime, router]);

  return <Slot />;
}