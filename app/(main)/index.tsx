import React, { useState, useRef, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import Gradient from "@/assets/Icons/Gradient";
import { ScrollView, SafeAreaView, StatusBar, View, PanResponder, Animated, Dimensions, Appearance, Pressable, TouchableOpacity } from "react-native";
import { Image } from "@/components/ui/image";
import { Bell, Users, FileText, Calendar, Clock, X, Sun, Moon, Menu, TrendingUp, ArrowRight } from "lucide-react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import NotificationPanel from "@/components/NotificationPanel";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, getCachedProfile, setCachedProfile } from "@/services/user";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { router } from "expo-router";

// Define the NotificationType
type NotificationType = 'info' | 'success' | 'warning' | 'meeting';

// Define the Notification type
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const { width } = Dimensions.get("window");

// --- Mock Data ---
const statsData = [
  { type: 'Referrals', value: 248, trend: '+12%', icon: Users },
  { type: 'Requirements', value: 156, trend: '+8%', icon: FileText },
  { type: 'Meetings', value: 42, trend: '+15%', icon: Calendar },
];
const requirementsData = [
  { title: "Karthik Looking for Interior Decorator", category: "Interior Decorator", time: "2h ago", responses: 12 },
  { title: "Ramesh needs a Painter", category: "Painter", time: "5h ago", responses: 8 },
  { title: "Suresh Requires a Builder", category: "Builder", time: "1d ago", responses: 15 },
];
const upcomingMeetings = [
    { title: 'Weekly Business Network', time: '10:00 AM - 12:00 PM', isNow: true, day: 'Today' },
    { title: 'Product Showcase', time: '10:00 AM - 11:30 AM', isNow: false, day: 'Tomorrow' },
];

// --- Reusable Components ---
const SectionHeader = ({ title, onSeeAll }: { title: string, onSeeAll?: () => void }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    return (
        <Box className="flex-row justify-between items-center mb-4 px-1">
          <Text className="text-2xl font-bold" style={{ color: theme.text }}>{title}</Text>
          {onSeeAll && (
            <TouchableOpacity onPress={onSeeAll}>
              <Text className="text-sm font-medium" style={{ color: theme.tint }}>See All</Text>
            </TouchableOpacity>
          )}
        </Box>
    );
};

// --- Main Screen Sub-components ---

const Header = ({ onMenuPress, onNotificationPress, onThemeToggle, userProfile, isLoading, theme, colorScheme } : any) => (
    <Box className="flex-row items-center justify-between py-4">
        <Box className="flex-row items-center gap-3">
            <TouchableOpacity onPress={onMenuPress} className="p-2">
                <Menu size={28} color={theme.text} />
            </TouchableOpacity>
            <Pressable onPress={() => router.push("/(main)/profile")} className="flex-row items-center gap-3">
                 <Avatar className="w-14 h-14">
                    <AvatarImage alt="default-user" source={require("@/assets/images/default-user.png")} />
                    <AvatarFallbackText>{userProfile.name.charAt(0)}</AvatarFallbackText>
                </Avatar>
                {isLoading ? (
                    <Box>
                        <Box className="h-6 w-32 mb-2 rounded bg-gray-300" style={{ opacity: 0.5 }} />
                        <Box className="h-4 w-40 rounded bg-gray-300" style={{ opacity: 0.5 }} />
                    </Box>
                ) : (
                    <Box>
                        <Text className="text-xl font-bold" style={{ color: theme.text }}>{userProfile.name}</Text>
                        <Text className="text-sm" style={{ color: theme.text }}>{userProfile.businessName || 'Member'}</Text>
                    </Box>
                )}
            </Pressable>
        </Box>
        <Box className="flex-row items-center gap-3">
            <TouchableOpacity onPress={onNotificationPress} className="p-2">
                <Bell size={24} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onThemeToggle} className="p-2">
                {colorScheme === "dark" ? <Sun size={24} color={theme.text} /> : <Moon size={24} color={theme.text} />}
            </TouchableOpacity>
        </Box>
    </Box>
);

const MeetingAlert = ({ onDismiss } : any) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    return (
        <Box className="rounded-2xl p-5 relative overflow-hidden my-4" style={{ backgroundColor: theme.tint }}>
            <TouchableOpacity className="absolute top-3 right-3" onPress={onDismiss}>
                <X size={18} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
            <Box className="flex-row items-center mb-3">
                <Clock size={16} color="#fff" />
                <Text className="text-sm font-medium ml-2" style={{ color: "#fff" }}>Today's Meeting</Text>
            </Box>
            <Text className="text-2xl font-bold" style={{ color: "#fff" }}>Weekly Business Meet</Text>
            <Box className="flex-row items-center justify-between mt-3">
                 <Text className="text-lg font-semibold" style={{ color: "#fff" }}>10:00 AM</Text>
                 <Button size="sm" className="rounded-full" style={{ backgroundColor: '#fff' }} onPress={() => console.log("Marking attendance")}>
                    <ButtonText className="font-bold" style={{ color: theme.tint }}>Mark Attendance</ButtonText>
                 </Button>
            </Box>
        </Box>
    );
};

const StatsCarousel = ({ data, theme, colorScheme } : any) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, paddingLeft: 4 }}>
        {data.map((stat : any, index : number) => (
            <Box key={index} className="p-5 w-48 mr-4 rounded-2xl" style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(42,42,42,0.8)' : '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 }}>
                <Box className="flex-row items-center justify-between">
                    <Box className="p-2 rounded-full" style={{ backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)" }}>
                        <stat.icon size={20} color={theme.tint} />
                    </Box>
                    <Box className="flex-row items-center p-1 px-2 rounded-full" style={{ backgroundColor: 'rgba(20, 99, 49, 0.1)' }}>
                        <TrendingUp size={12} color="#146331" />
                        <Text className="text-xs font-bold ml-1" style={{ color: '#146331' }}>{stat.trend}</Text>
                    </Box>
                </Box>
                <Text className="text-4xl font-bold mt-3" style={{ color: theme.text }}>{stat.value}</Text>
                <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>{stat.type}</Text>
            </Box>
        ))}
    </ScrollView>
);

const RecentRequirements = ({ data, theme, colorScheme } : any) => (
    <Box className="mt-8">
        <SectionHeader title="Recent Requirements" onSeeAll={() => console.log("See all requirements")} />
        <Box className="space-y-3">
            {data.map((item: any, index: number) => (
                <TouchableOpacity key={index} activeOpacity={0.8}>
                    <Box className="p-4 rounded-2xl flex-row items-center my-2" style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(42,42,42,0.8)' : '#fff' }}>
                         <Box className="p-3 rounded-full mr-4" style={{ backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)" }}>
                            <FileText size={20} color={theme.tint} />
                        </Box>
                        <Box className="flex-1">
                            <Text className="font-bold" style={{ color: theme.text }} numberOfLines={1}>{item.title}</Text>
                            <Text className="text-xs mt-1" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>{item.category} • {item.time}</Text>
                        </Box>
                        <ArrowRight size={20} color={theme.text} />
                    </Box>
                </TouchableOpacity>
            ))}
        </Box>
    </Box>
);

const QuickActions = ({ meetings, theme, colorScheme }: any) => (
     <Box className="mt-8 mb-32">
        <SectionHeader title="Quick Actions" />
        <Box className="rounded-2xl p-5" style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(42,42,42,0.8)' : '#fff' }}>
            <Box className="flex-row gap-3">
                 <Button size="lg" className="flex-1 rounded-full"><ButtonText>Given Referrals</ButtonText></Button>
                 <Button size="lg" variant="outline" className="flex-1 rounded-full"><ButtonText>Taken Referrals</ButtonText></Button>
            </Box>
            <Box className="mt-6 pt-6 border-t" style={{ borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                <Text className="font-bold mb-3" style={{ color: theme.text }}>Upcoming Meetings</Text>
                {meetings.map((meeting: any, index: number) => (
                     <TouchableOpacity key={index} activeOpacity={0.8} className="flex-row items-center justify-between p-3 rounded-lg" style={{ backgroundColor: meeting.isNow ? theme.tint : 'transparent' }}>
                        <Box>
                            <Text className="font-bold" style={{ color: meeting.isNow ? '#fff' : theme.text }}>{meeting.title}</Text>
                            <Text className="text-sm" style={{ color: meeting.isNow ? 'rgba(255,255,255,0.8)' : theme.text }}>{meeting.time}</Text>
                        </Box>
                        {meeting.isNow ? 
                            <Text className="font-bold text-xs" style={{ color: '#fff' }}>JOIN NOW</Text> : 
                            <Text className="text-xs" style={{ color: theme.text }}>{meeting.day}</Text>
                        }
                    </TouchableOpacity>
                ))}
            </Box>
        </Box>
    </Box>
);

// --- Main Home Screen Component ---
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { user } = useAuth();
  const toast = useToast();
  
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({ name: "User", business: { name: null } });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showMeetingAlert, setShowMeetingAlert] = useState(true);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    if (user) fetchUserProfile();
  }, [user]);

  const handleThemeToggle = () => {
    const nextColorScheme = colorScheme === "dark" ? "light" : "dark";
    // This is a simplified way to toggle, for a better UX you'd persist this choice
    require("react-native").Appearance.setColorScheme(nextColorScheme);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, marginTop: 56 }}>
        
        <Header 
            className="mt-10"
            onMenuPress={() => setIsSidebarOpen(true)}
            onNotificationPress={() => setShowNotificationPanel(true)}
            onThemeToggle={handleThemeToggle}
            userProfile={{name: userProfile.name, businessName: userProfile.business?.name}}
            isLoading={isLoadingProfile}
            theme={theme}
            colorScheme={colorScheme}
        />
        
        {showMeetingAlert && <MeetingAlert onDismiss={() => setShowMeetingAlert(false)} />}
        
        <StatsCarousel data={statsData} theme={theme} colorScheme={colorScheme} />
        
        <RecentRequirements data={requirementsData} theme={theme} colorScheme={colorScheme} />

        <QuickActions meetings={upcomingMeetings} theme={theme} colorScheme={colorScheme} />

      </ScrollView>

      {/* Notification Panel */}
      <NotificationPanel 
        isVisible={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
        notifications={[]} // Pass real notifications here
        onNotificationPress={() => {}}
        onClearAll={() => {}}
      />
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </SafeAreaView>
  );
}
