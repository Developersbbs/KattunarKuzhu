import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Home, Calendar, Search, Users, FileText } from "lucide-react-native";

const { width } = Dimensions.get("window");

type NavItem = {
  name: string;
  icon: React.ElementType;
  path: string;
};

const navItems: NavItem[] = [
  {
    name: "Home",
    icon: Home,
    path: "/(main)",
  },
  {
    name: "Meetings",
    icon: Calendar,
    path: "/(main)/meetings",
  },
  {
    name: "Search",
    icon: Search,
    path: "/(main)/search",
  },
  {
    name: "Referrals",
    icon: Users,
    path: "/(main)/referrals",
  },
  {
    name: "Posts",
    icon: FileText,
    path: "/(main)/posts",
  },
];

const BottomNavBar = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if the current path matches a nav item path
  const isActive = (path: string) => {
    if (path === "/(main)" && pathname === "/(main)") {
      return true;
    }
    return pathname.startsWith(path);
  };

  return (
    <Box style={styles.container}>
      <Box
        style={[
          styles.navBar,
          {
            backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 5,
          },
        ]}
      >
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          const IconComponent = item.icon;
          
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={() => router.push(item.path as any)}
              activeOpacity={0.7}
            >
              <Box
                style={[
                  styles.iconContainer,
                  active && {
                    backgroundColor: colorScheme === "dark" 
                      ? "rgba(160, 118, 249, 0.15)" 
                      : "rgba(45, 18, 72, 0.1)",
                  },
                ]}
              >
                <IconComponent
                  size={22}
                  color={
                    active
                      ? theme.tint
                      : colorScheme === "dark"
                      ? "#AAAAAA"
                      : "#888888"
                  }
                  strokeWidth={active ? 2.5 : 2}
                />
              </Box>
              <Text
                className="text-xs mt-1"
                style={{
                  color: active
                    ? theme.tint
                    : colorScheme === "dark"
                    ? "#AAAAAA"
                    : "#888888",
                  fontWeight: active ? "600" : "normal",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.92,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BottomNavBar; 