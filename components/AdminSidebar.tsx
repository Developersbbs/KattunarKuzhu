import React from "react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from "@/components/ui/drawer";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { Pressable } from "@/components/ui/pressable";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  User,
  MessageSquare,
  Megaphone,
  Settings,
  ChevronDown,
  X,
} from "lucide-react-native";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "expo-router";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    category: "Analytics",
    items: [
      { name: "Dashboard", icon: LayoutDashboard },
      { name: "Meetings", icon: Calendar },
      { name: "Referrals", icon: Users },
      { name: "Requirements", icon: FileText },
    ],
  },
  {
    category: "Management",
    items: [
      { name: "Groups", icon: Users },
      { name: "Members", icon: User },
    ],
  },
  {
    category: "Communications",
    items: [
      { name: "Messages", icon: MessageSquare },
      { name: "Announcements", icon: Megaphone },
    ],
  },
  {
    category: "Settings",
    items: [{ name: "General", icon: Settings }],
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerBackdrop />
      <DrawerContent style={{ backgroundColor: theme.background, width: '80%' }}>
        <DrawerHeader>
          <Box className="flex-row items-center gap-4 p-4">
            <Image
              alt="logo"
              source={require("@/assets/images/logo.png")}
              className="h-12 w-12 rounded-full"
            />
            <Box>
              <Heading size="lg" style={{ color: theme.text }}>
                Admin Panel
              </Heading>
              <Text size="sm" style={{ color: theme.text }}>
                Kattunar Kuzhu
              </Text>
            </Box>
          </Box>
          <DrawerCloseButton>
            <X size={24} color={theme.text} />
          </DrawerCloseButton>
        </DrawerHeader>
        <DrawerBody>
          {menuItems.map((menu, index) => (
            <Box key={index} className="p-4">
              <Text className="text-sm font-bold uppercase" style={{ color: theme.text }}>
                {menu.category}
              </Text>
              {menu.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  className="flex-row items-center gap-4 p-3 rounded-md mt-2"
                  onPress={() => {
                    router.push(`/(main)/(admin)/${item.name.toLowerCase()}`);
                    onClose(); // Close sidebar after navigation
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? theme.background : 'transparent',
                  })}
                >
                  <item.icon size={20} color={theme.text} />
                  <Text className="text-lg" style={{ color: theme.text }}>
                    {item.name}
                  </Text>
                </Pressable>
              ))}
            </Box>
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default AdminSidebar;
