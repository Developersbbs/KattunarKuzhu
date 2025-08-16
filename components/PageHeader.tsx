import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "react-native";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightElement,
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <Box
        style={{
          backgroundColor: theme.background,
          paddingTop: 60, // Account for status bar
          paddingBottom: 16,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        }}
      >
        <Box style={{ flexDirection: "row", alignItems: "center" }}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <ChevronLeft
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>
          )}
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: theme.text,
            }}
          >
            {title}
          </Text>
        </Box>
        {rightElement && (
          <Box>
            {rightElement}
          </Box>
        )}
      </Box>
    </>
  );
};

export default PageHeader;
