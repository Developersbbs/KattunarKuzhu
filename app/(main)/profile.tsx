import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import {
  ScrollView,
  Linking,
  Platform,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { getUserProfile } from "@/services/user";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { Avatar } from "@/components/ui/avatar";
import { Center } from "@/components/ui/center";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  FileText,
  Users,
  ArrowRight,
  ChevronRight,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Pencil,
} from "lucide-react-native";
import { router } from "expo-router";

// Define TypeScript interfaces
interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

interface Service {
  id: string;
  title: string;
  tagline: string;
  thumbnail?: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface Business {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  completionPercentage: number;
  categories: string[];
  services: Service[];
  stats: {
    meetings: number;
    referrals: number;
    requirements: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  socialLinks: SocialLink[];
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  member: Member;
}

// Mock data
const mockBusiness: Business = {
  id: "b123",
  name: "Stellar Digital Solutions",
  logo: "https://img.freepik.com/free-vector/quill-pen-logo-template_23-2149852429.jpg?semt=ais_hybrid&w=740&q=80",
  coverImage:
    "https://marketplace.canva.com/EAECJXaRRew/3/0/1600w/canva-do-what-is-right-starry-sky-facebook-cover-4SpKW5MtQl4.jpg",
  description:
    "Stellar Digital Solutions is a full-service digital agency specializing in web development, mobile applications, and digital marketing strategies. We help businesses transform their digital presence with innovative solutions tailored to their unique needs and goals.",
  completionPercentage: 85,
  categories: [
    "Technology",
    "Web Development",
    "Digital Marketing",
    "Mobile Apps",
  ],
  services: [
    {
      id: "s1",
      title: "Website Development",
      tagline: "Custom websites built for performance",
      thumbnail: "https://placekitten.com/120/120",
    },
    {
      id: "s2",
      title: "Mobile App Development",
      tagline: "Native and cross-platform mobile applications",
      thumbnail: "https://placekitten.com/121/121",
    },
    {
      id: "s3",
      title: "SEO Optimization",
      tagline: "Boost your visibility in search results",
      thumbnail: "https://placekitten.com/122/122",
    },
  ],
  stats: {
    meetings: 24,
    referrals: 17,
    requirements: 8,
  },
  contact: {
    phone: "+1234567890",
    email: "contact@stellardigital.com",
    website: "www.stellardigital.com",
  },
  socialLinks: [
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/company/stellar-digital",
      icon: <Linkedin size={20} />,
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/stellardigital",
      icon: <Instagram size={20} />,
    },
    {
      platform: "Facebook",
      url: "https://facebook.com/stellardigital",
      icon: <Facebook size={20} />,
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/stellardigital",
      icon: <Twitter size={20} />,
    },
  ],
  location: {
    address: "123 Tech Park, Innovation Ave, San Francisco, CA 94107",
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  member: {
    id: "m123",
    name: "Rajesh Kumar",
    phone: "+1234567890",
    email: "rajesh@stellardigital.com",
    avatar: "https://placekitten.com/300/300",
  },
};

// Utility functions for handling actions
const handleCall = (phone: string) => {
  Linking.openURL(`tel:${phone}`);
};

const handleEmail = (email: string) => {
  Linking.openURL(`mailto:${email}`);
};

const handleWebsite = (website: string) => {
  Linking.openURL(`https://${website}`);
};

const handleOpenMap = (latitude: number, longitude: number, label: string) => {
  const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
  const url =
    Platform.OS === "ios"
      ? `${scheme}?q=${label}&ll=${latitude},${longitude}`
      : `${scheme}${latitude},${longitude}?q=${label}`;

  Linking.openURL(url);
};

const handleOpenSocialLink = (url: string) => {
  Linking.openURL(url);
};

// Component: ProfileCard
const ProfileCard = ({
  member,
  business,
  showEditButton = false,
}: {
  member: Member;
  business: Business;
  showEditButton?: boolean;
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { width: screenWidth } = Dimensions.get("window");

  return (
    <Box className="w-full h-[360px] my-4 bg-white rounded-3xl">
        <Box className="w-full h-3/6 rounded-t-3xl overflow-hidden">
            <Image source={{ uri: business.coverImage }} className="w-full h-full" />
        </Box>
        <Box className="w-full">
            <Box className="rounded-full p-2 absolute -top-16 left-1/3 drop-shadow-2xl">
                <Image source={{uri: business.logo}} className="w-28 h-28 rounded-full" />
            </Box>
            <Box className="w-full flex flex-col items-center justify-center mt-12">
                <Text className="text-3xl font-bold text-center">{business.member.name}</Text>
                <Text className="text-lg text-center mt-2">{business.member.phone}</Text>
                
                {showEditButton && (
                  <Pressable 
                    className="mt-4 bg-violet-600 py-2 px-6 rounded-full flex flex-row items-center"
                    onPress={() => router.push('/edit-profile')}
                  >
                    <Box className="flex flex-row items-center space-x-2">
                      <Pencil size={16} color="#FFFFFF" />
                      <Text className="text-white font-semibold">Edit Profile</Text>
                    </Box>
                  </Pressable>
                )}
            </Box>
        </Box>
    </Box>
  );
};

// Component: BusinessHighlight
const BusinessHighlight = ({ business }: { business: Business }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Box
      style={{
        padding: 20,
        backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#F5F5F5",
        borderRadius: 12,
      }}
    >
      <HStack space="md" style={{ alignItems: "center" }}>
        <Image
          source={{ uri: business.logo }}
          alt="Business Logo"
          style={{ width: 50, height: 50, borderRadius: 8 }}
        />
        <VStack>
          <Text
            style={{
              color: theme.text,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {business.name}
          </Text>
          <ProfileCompletion completion={business.completionPercentage} />
        </VStack>
      </HStack>
    </Box>
  );
};

// Component: ProfileCompletion
const ProfileCompletion = ({ completion }: { completion: number }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <HStack space="sm" style={{ marginTop: 4, alignItems: "center" }}>
      <Box style={{ flex: 1 }}>
        <Progress
          value={completion}
          style={{
            backgroundColor: colorScheme === "dark" ? "#333" : "#E0E0E0",
          }}
        />
      </Box>
      <Text style={{ color: theme.text, fontWeight: "600" }}>
        {completion}%
      </Text>
    </HStack>
  );
};

// Component: QuickStats
const QuickStats = ({ stats }: { stats: Business["stats"] }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <HStack
      style={{
        paddingVertical: 20,
        marginTop: 16,
        borderRadius: 12,
        backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#F5F5F5",
        justifyContent: "space-evenly",
      }}
    >
      <VStack style={{ alignItems: "center" }}>
        <Calendar size={24} color={theme.tint} />
        <Text style={{ color: theme.text, marginTop: 4, fontWeight: "600" }}>
          {stats.meetings}
        </Text>
        <Text style={{ color: theme.text, fontSize: 12 }}>Meetings</Text>
      </VStack>

      <VStack style={{ alignItems: "center" }}>
        <Users size={24} color={theme.tint} />
        <Text style={{ color: theme.text, marginTop: 4, fontWeight: "600" }}>
          {stats.referrals}
        </Text>
        <Text style={{ color: theme.text, fontSize: 12 }}>Referrals</Text>
      </VStack>

      <VStack style={{ alignItems: "center" }}>
        <FileText size={24} color={theme.tint} />
        <Text style={{ color: theme.text, marginTop: 4, fontWeight: "600" }}>
          {stats.requirements}
        </Text>
        <Text style={{ color: theme.text, fontSize: 12 }}>Requirements</Text>
      </VStack>
    </HStack>
  );
};

// Component: CategoryChips
const CategoryChips = ({ categories }: { categories: string[] }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 16 }}
    >
      {categories.map((category, index) => (
        <Box
          key={index}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 8,
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(160, 118, 249, 0.15)"
                : "rgba(45, 18, 72, 0.1)",
          }}
        >
          <Text style={{ color: theme.tint }}>{category}</Text>
        </Box>
      ))}
    </ScrollView>
  );
};

// Component: DescriptionSection
const DescriptionSection = ({ description }: { description: string }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Box style={{ marginTop: 16 }}>
      <Text
        style={{
          color: theme.text,
          fontWeight: "bold",
          fontSize: 16,
          marginBottom: 8,
        }}
      >
        About the Business
      </Text>
      <Text
        numberOfLines={expanded ? undefined : 3}
        style={{ color: theme.text }}
      >
        {description}
      </Text>
      {description.length > 120 && (
        <Pressable onPress={() => setExpanded(!expanded)}>
          <Text style={{ color: theme.tint, marginTop: 4 }}>
            {expanded ? "Read less" : "Read more"}
          </Text>
        </Pressable>
      )}
    </Box>
  );
};

// Component: ServicesGrid
const ServicesGrid = ({ services }: { services: Service[] }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Box style={{ marginTop: 20 }}>
      <Text
        style={{
          color: theme.text,
          fontWeight: "bold",
          fontSize: 16,
          marginBottom: 12,
        }}
      >
        Services & Products
      </Text>

      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </Box>
  );
};

// Component: ServiceCard
const ServiceCard = ({ service }: { service: Service }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <HStack
      space="md"
      style={{
        alignItems: "center",
        padding: 12,
        backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#F5F5F5",
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      {service.thumbnail && (
        <Image
          source={{ uri: service.thumbnail }}
          alt={service.title}
          style={{ width: 60, height: 60, borderRadius: 8 }}
        />
      )}
      <VStack style={{ flex: 1 }}>
        <Text
          style={{
            color: theme.text,
            fontWeight: "bold",
          }}
        >
          {service.title}
        </Text>
        <Text
          style={{
            color: theme.tabIconDefault,
            fontSize: 13,
          }}
        >
          {service.tagline}
        </Text>
      </VStack>
      <ChevronRight size={20} color={theme.tabIconDefault} />
    </HStack>
  );
};

// Component: ContactInfoList
const ContactInfoList = ({ contact }: { contact: Business["contact"] }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Box className="mt-4 bg-white rounded-3xl p-4">
      <Text
        style={{
          color: theme.text,
          fontWeight: "bold",
          fontSize: 16,
          marginBottom: 12,
        }}
      >
        Contact Information
      </Text>

      <Pressable
        onPress={() => handleCall(contact.phone)}
        style={{ paddingVertical: 8 }}
        accessibilityLabel="Call business number"
      >
        <HStack space="md" style={{ alignItems: "center" }}>
          <Phone size={20} color={theme.tint} />
          <Text style={{ color: theme.text }}>{contact.phone}</Text>
        </HStack>
      </Pressable>

      <Pressable
        onPress={() => handleEmail(contact.email)}
        style={{ paddingVertical: 8 }}
        accessibilityLabel="Send email to business"
      >
        <HStack space="md" style={{ alignItems: "center" }}>
          <Mail size={20} color={theme.tint} />
          <Text style={{ color: theme.text }}>{contact.email}</Text>
        </HStack>
      </Pressable>

      <Pressable
        onPress={() => handleWebsite(contact.website)}
        style={{ paddingVertical: 8 }}
        accessibilityLabel="Visit website"
      >
        <HStack space="md" style={{ alignItems: "center" }}>
          <Globe size={20} color={theme.tint} />
          <Text style={{ color: theme.text }}>{contact.website}</Text>
        </HStack>
      </Pressable>
    </Box>
  );
};

// Component: SocialLinksRow
const SocialLinksRow = ({ socialLinks }: { socialLinks: SocialLink[] }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Box style={{ marginTop: 20 }}>
      <Text
        style={{
          color: theme.text,
          fontWeight: "bold",
          fontSize: 16,
          marginBottom: 12,
        }}
      >
        Connect on Social Media
      </Text>

      <HStack style={{ justifyContent: "space-around" }}>
        {socialLinks.map((link, index) => (
          <Pressable
            key={index}
            onPress={() => handleOpenSocialLink(link.url)}
            accessibilityLabel={`Open ${link.platform}`}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#F5F5F5",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {React.cloneElement(link.icon as React.ReactElement, {
              color: theme.tint,
            })}
          </Pressable>
        ))}
      </HStack>
    </Box>
  );
};

// Component: LocationMapPreview
const LocationMapPreview = ({
  location,
}: {
  location: Business["location"];
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Box className="pb-12" style={{ marginTop: 20, marginBottom: 40 }}>
      <Text
        style={{
          color: theme.text,
          fontWeight: "bold",
          fontSize: 16,
          marginBottom: 12,
        }}
      >
        Business Location
      </Text>

      <Pressable
        onPress={() =>
          handleOpenMap(
            location.coordinates.latitude,
            location.coordinates.longitude,
            location.address
          )
        }
        accessibilityLabel="Open business location in maps"
      >
        <Box
          style={{
            height: 150,
            backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#F5F5F5",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <MapPin size={32} color={theme.tint} />
          <Text style={{ color: theme.tint, marginTop: 8 }}>Map Preview</Text>
        </Box>
      </Pressable>

      <Text style={{ color: theme.text }}>{location.address}</Text>

      <Button
        className="rounded-full h-16"
        onPress={() =>
          handleOpenMap(
            location.coordinates.latitude,
            location.coordinates.longitude,
            location.address
          )
        }
        style={{
          marginTop: 12,
          backgroundColor: theme.tint,
        }}
        accessibilityLabel="Get directions to business"
      >
        <HStack space="sm" style={{ alignItems: "center" }}>
          <ButtonText>Get Directions</ButtonText>
          <ArrowRight size={16} color="white" />
        </HStack>
      </Button>
    </Box>
  );
};

// Main BusinessProfile screen
export default function Profile() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { user } = useAuth();
  const toast = useToast();
  
  // State for business profile data
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user profile on mount
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch user profile data from API
        const userProfile = await getUserProfile();
        console.log('Fetched user profile:', userProfile);
        
        // Map API response to Business interface
        const mappedBusiness: Business = {
          id: userProfile.business?.name ? 'b-' + Date.now() : 'unknown',
          name: userProfile.business?.name || userProfile.name + "'s Business",
          logo: "https://img.freepik.com/free-vector/quill-pen-logo-template_23-2149852429.jpg?semt=ais_hybrid&w=740&q=80", // Default logo
          coverImage: "https://marketplace.canva.com/EAECJXaRRew/3/0/1600w/canva-do-what-is-right-starry-sky-facebook-cover-4SpKW5MtQl4.jpg", // Default cover
          description: userProfile.business ? `${userProfile.business.name} specializes in ${userProfile.business.category}` : 'No business description available.',
          completionPercentage: userProfile.business ? 85 : 30, // Mock completion percentage
          categories: userProfile.business?.category ? [userProfile.business.category] : ['General'],
          services: [], // We'll populate this if available in the API response
          stats: {
            meetings: 0, // These would be fetched from separate API endpoints
            referrals: 0,
            requirements: 0,
          },
          contact: {
            phone: userProfile.phoneNumber,
            email: userProfile.email || '',
            website: '',
          },
          socialLinks: [], // We'll populate this if available in the API response
          location: {
            address: userProfile.business?.address || 'No address specified',
            coordinates: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
          },
          member: {
            id: 'u-' + Date.now().toString(),
            name: userProfile.name,
            phone: userProfile.phoneNumber,
            email: userProfile.email || '',
            avatar: "https://placekitten.com/300/300", // Default avatar
          },
        };
        
        // Add default social links for now
        mappedBusiness.socialLinks = [
          {
            platform: "LinkedIn",
            url: "https://linkedin.com/",
            icon: <Linkedin size={20} />,
          },
          {
            platform: "Instagram",
            url: "https://instagram.com/",
            icon: <Instagram size={20} />,
          },
          {
            platform: "Facebook",
            url: "https://facebook.com/",
            icon: <Facebook size={20} />,
          },
          {
            platform: "Twitter",
            url: "https://twitter.com/",
            icon: <Twitter size={20} />,
          },
        ];
        
        // Add default services if none exist
        if (!mappedBusiness.services || mappedBusiness.services.length === 0) {
          mappedBusiness.services = [
            {
              id: "s1",
              title: userProfile.business?.name || "Services",
              tagline: "Your business services will appear here",
              thumbnail: "https://placekitten.com/120/120",
            },
          ];
        }
        
        setBusiness(mappedBusiness);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. ' + (err.message || ''));
        toast.show({
          placement: "top",
          render: ({ id }) => {
            return (
              <Toast nativeID={id} action="error" variant="solid">
                <ToastTitle>Failed to load profile</ToastTitle>
                <ToastDescription>{err.message || 'Please check your connection'}</ToastDescription>
              </Toast>
            );
          },
        });
        
        // Fall back to mock data when API fails
        setBusiness(mockBusiness);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [user?.uid]);
  
  // Show loading state
  if (isLoading) {
    return (
      <Box 
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        }}
      >
        <Spinner size="large" color={theme.tint} />
        <Text style={{ color: theme.text, marginTop: 16 }}>Loading your profile...</Text>
      </Box>
    );
  }
  
  // Show error state (with mock data fallback)
  if (error && !business) {
    return (
      <Box 
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: theme.background,
        }}
      >
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Unable to load profile</Text>
        <Text style={{ color: theme.text, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <Button onPress={() => window.location.reload()} style={{ backgroundColor: theme.tint }}>
          <ButtonText>Try Again</ButtonText>
        </Button>
      </Box>
    );
  }

  // If business is null (shouldn't happen with our fallbacks, but just in case)
  if (!business) {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>No profile data available</Text>
      </Box>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <ProfileCard member={business.member} business={business} showEditButton={true} />
      <BusinessHighlight business={business} />
      <QuickStats stats={business.stats} />
      <CategoryChips categories={business.categories} />
      <DescriptionSection description={business.description} />
      <ServicesGrid services={business.services} />
      <ContactInfoList contact={business.contact} />
      <SocialLinksRow socialLinks={business.socialLinks} />
      <LocationMapPreview location={business.location} />
    </ScrollView>
  );
}
