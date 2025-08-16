import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/components/useColorScheme";
import { Slot, useRouter, useSegments } from "expo-router";
import { getItem } from "expo-secure-store";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import "../global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Define the initial route to be the custom home screen
export const unstable_settings = {
  initialRouteName: "(main)",
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
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      const firstTime = await getItem("isFirstTime");
      if (firstTime === "false") {
        setIsFirstTime(false);
      } else {
        setIsFirstTime(true);
      }
    };
    checkFirstTime();
  }, []);

  if (isFirstTime === null) {
    return <></>;
  }

  return (
    <AuthProvider>
      <AuthStateListener initialIsFirstTime={isFirstTime} />
      <GluestackUIProvider mode="light">
        <ThemeProvider value={DefaultTheme}>
          <Slot />
        </ThemeProvider>
      </GluestackUIProvider>
    </AuthProvider>
  );
}

// Auth state listener component for navigation control
function AuthStateListener({ initialIsFirstTime }: { initialIsFirstTime: boolean | null }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(initialIsFirstTime);

  // Check if the user has completed onboarding
  useEffect(() => {
    const checkFirstTime = async () => {
      const firstTime = await getItem("isFirstTime");
      setIsFirstTime(firstTime === "false" ? false : true);
    };
    checkFirstTime();
    
    // Set up a listener to check for changes to isFirstTime
    const interval = setInterval(checkFirstTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoading || isFirstTime === null) {
      // Still loading, don't redirect yet
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";
    const currentPath = segments.join('/');
    
    console.log('Navigation check:', { isFirstTime, isAuthenticated, inAuthGroup, inOnboarding, currentPath });

    // Don't redirect if already at the correct location
    if (isFirstTime && inOnboarding) {
      return;
    }
    
    if (inAuthGroup && currentPath === "(auth)/login") {
      return;
    }

    if (isFirstTime) {
      // First time user should see onboarding
      console.log('Redirecting to onboarding');
      router.replace("/onboarding");
    } else if (!isAuthenticated) {
      // Unauthenticated user should go to login
      console.log('Redirecting to login');
      router.replace("/(auth)/login");
    } else if (isAuthenticated && (inAuthGroup || inOnboarding)) {
      // Authenticated user should go to main app
      console.log('Redirecting to main');
      router.replace("/(main)");
    }
  }, [isAuthenticated, isLoading, segments, isFirstTime, router]);

  return null;
}