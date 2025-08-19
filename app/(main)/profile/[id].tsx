import React, { useEffect, useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ScrollView, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { getUserProfileById, UserProfile } from '@/services/user';
import { getConnectionStatus, sendConnectionRequest } from '@/services/connection';
import { ConnectionStatus } from '@/types/connections';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Image } from '@/components/ui/image';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import {
  Building2, MapPin, Globe, Phone, Mail, MessageCircle, Star, Users, Trophy,
  Bookmark, Share2, Tag, Clock, CheckCircle, Award, Briefcase,
  Facebook, Instagram, Linkedin, Twitter, ExternalLink
} from 'lucide-react-native';

// Mock data to supplement what's not in the backend yet, based on the reference file.
const mockBusinessData = {
  verified: true,
  establishedYear: 2018,
  expertise: ["Digital Transformation", "Enterprise Solutions", "Cloud Computing"],
  stats: {
    rating: 4.8,
    reviews: 32,
    connections: 156,
    referrals: 45,
    requirements: 12,
  },
  highlights: [
    { icon: Trophy, title: "Top Contributor 2024", description: "Awarded for exceptional business networking" },
    { icon: Star, title: "4.8/5 Rating", description: "Based on 32 member reviews" },
    { icon: Users, title: "Active Community Member", description: "156+ business connections" },
  ],
  services: [
    { name: "Custom Software Development", description: "End-to-end custom software development services tailored to your business needs." },
    { name: "Cloud Solutions", description: "Comprehensive cloud services including migration, optimization, and management." },
    { name: "IT Consulting", description: "Strategic IT consulting to help businesses optimize their technology infrastructure." },
  ],
  requirements: [
    { title: "Senior Software Developer", description: "Looking for experienced React/Node.js developer with 5+ years of experience.", priority: "High" },
    { title: "Office Space Required", description: "Need 2000 sq ft office space in Anna Nagar.", priority: "Medium" },
  ],
  testimonials: [
    { name: "Raj Kumar", company: "Global Traders", content: "Exceptional service and professional team.", rating: 5 },
    { name: "Priya Sharma", company: "Healthcare Plus", content: "Great experience working with Tech Solutions.", rating: 4.5 },
  ],
  socials: {
    facebook: "techsolutions",
    instagram: "techsolutions_in",
    linkedin: "tech-solutions-inc",
    twitter: "techsolutions"
  }
};

const StatCard = ({ icon: Icon, value, label }: { icon: any, value: string | number, label: string }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    return (
        <Box className="flex-1 items-center p-4 rounded-2xl" style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}}>
            <Icon size={24} color={theme.tint} />
            <Text className="text-xl font-bold mt-2" style={{ color: theme.text }}>{value}</Text>
            <Text className="text-xs" style={{ color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }}>{label}</Text>
        </Box>
    )
}

const Section = ({ title, children, noPadding = false }: { title: string, children: React.ReactNode, noPadding?: boolean }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  return (
    <Box className="mt-8">
      <Text className="text-2xl font-bold mb-4 px-1" style={{ color: theme.text }}>{title}</Text>
      <Box className={`rounded-3xl ${noPadding ? '' : 'p-5'}`} style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(42,42,42,0.8)' : '#fff' }}>
        {children}
      </Box>
    </Box>
  )
};

const TabButton = ({ label, isActive, onPress }: { label: string, isActive: boolean, onPress: () => void }) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    return (
        <TouchableOpacity 
          onPress={onPress} 
          className="flex-1 py-3 px-4 items-center justify-center rounded-full" 
          style={{ backgroundColor: isActive ? theme.tint : 'transparent' }}
        >
            <Text style={{ color: isActive ? '#fff' : theme.text, fontWeight: isActive ? 'bold' : '600' }}>{label}</Text>
        </TouchableOpacity>
    )
}

export default function BusinessProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const isOwnProfile = currentUser?.uid === id;

  useEffect(() => {
    if (id) {
      const fetchProfileAndStatus = async () => {
        try {
          setIsLoading(true);
          // Fetch profile and status in parallel
          const [userProfile, statusResponse] = await Promise.all([
            getUserProfileById(id),
            // Only fetch connection status if it's not our own profile
            isOwnProfile ? Promise.resolve(null) : getConnectionStatus(id)
          ]);
          setProfile(userProfile);
          if (statusResponse) {
            setConnectionStatus(statusResponse.status);
          }
        } catch (error) {
          console.error("Failed to fetch profile or status:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfileAndStatus();
    }
  }, [id]);
  
  const handleConnect = async () => {
    if (!id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await sendConnectionRequest(id);
      setConnectionStatus(ConnectionStatus.PENDING);
      // You can show a success toast here
    } catch (error) {
      console.error('Failed to send connection request:', error);
      // You can show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConnectButton = () => {
    switch (connectionStatus) {
      case ConnectionStatus.PENDING:
        return (
          <Button size="xl" variant='outline' className="flex-1 rounded-full" disabled>
            <ButtonText>Request Sent</ButtonText>
          </Button>
        );
      case ConnectionStatus.ACCEPTED:
         return (
          <Button size="xl" className="flex-1 rounded-full bg-green-500">
            <ButtonText>Connected</ButtonText>
          </Button>
        );
      default:
        return (
          <Button size="xl" className="flex-1 rounded-full" onPress={handleConnect} disabled={isSubmitting}>
            <ButtonText>{isSubmitting ? 'Sending...' : 'Connect'}</ButtonText>
          </Button>
        );
    }
  }

  // Combine fetched data with mock data
  const combinedData = {
    ...profile,
    business: {
      ...profile?.business,
      ...mockBusinessData
    }
  }

  if (isLoading) {
    return <Box className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}><ActivityIndicator size="large" color={theme.tint} /></Box>;
  }

  if (!profile) {
    return <Box className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}><Text>Profile not found.</Text></Box>;
  }
  
  const { name, profileImageUrl, business } = combinedData;

  return (
    <>
      <Stack.Screen options={{ title: business.name || 'Business Profile', headerBackTitle: "Search" }} />
      <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={{ paddingBottom: 32, paddingTop: 16, paddingHorizontal: 16 }}>
        
        {/* --- Business Header Card --- */}
        <Box className="rounded-3xl overflow-hidden" style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(42,42,42,0.8)' : '#fff' }}>
          <ImageBackground source={{ uri: business.coverImageUrl || 'https://via.placeholder.com/400x200' }} resizeMode="cover" style={{ width: '100%', height: 208 }}>
             <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </ImageBackground>
          <Box className="p-4 flex-row items-center -mt-16">
            <Avatar className="w-28 h-28 border-4 rounded-3xl" style={{ borderColor: theme.background }}>
              <AvatarImage source={{ uri: business.logoUrl }} />
              <AvatarFallbackText>{business.name?.charAt(0)}</AvatarFallbackText>
            </Avatar>
            <Box className="ml-4 flex-1 mt-12">
              <Text className="text-3xl font-bold" style={{ color: colorScheme === 'dark' ? '#fff' : '#111' }}>{business.name}</Text>
              <Text className="text-base mt-1" style={{ color: colorScheme === 'dark' ? '#ccc' : '#555' }}>Est. {business.establishedYear}</Text>
            </Box>
          </Box>
          <Box className="px-5 pb-5">
             <Text className="text-md leading-6" style={{ color: colorScheme === 'dark' ? '#b0b0b0' : '#4f4f4f', marginBottom: 16 }}>{business.description}</Text>
             <Box className="flex-row flex-wrap gap-3">
                {business.expertise.map(skill => (
                    <Box key={skill} className="px-4 py-2 rounded-full" style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}}>
                        <Text className="text-sm font-medium" style={{ color: theme.text }}>{skill}</Text>
                    </Box>
                ))}
             </Box>
          </Box>
          <Divider />
          <Box className="p-5 flex-row justify-end items-center">
             <Box className="flex-row gap-3">
                <Button variant="outline" size="lg" className="rounded-full p-3 h-12 w-12"><Bookmark size={20} color={theme.text}/></Button>
                <Button variant="outline" size="lg" className="rounded-full p-3 h-12 w-12"><Share2 size={20} color={theme.text}/></Button>
             </Box>
          </Box>
        </Box>
        
        {/* --- Stats Section --- */}
        <Section title="Business Stats">
            <Box className="flex-row gap-3">
                <StatCard icon={Star} value={`${business.stats.rating} (${business.stats.reviews})`} label="Rating" />
                <StatCard icon={Users} value={business.stats.connections} label="Connections" />
            </Box>
            <Box className="flex-row gap-3 mt-3">
                <StatCard icon={Briefcase} value={business.stats.referrals} label="Referrals" />
                <StatCard icon={Tag} value={business.stats.requirements} label="Requirements" />
            </Box>
        </Section>


        {/* --- Owner Details --- */}
        <Section title="Owner Details">
             <Box className="flex-row items-center">
                <Avatar className="w-16 h-16 rounded-full">
                    <AvatarImage source={{ uri: profileImageUrl }} />
                    <AvatarFallbackText>{name?.charAt(0)}</AvatarFallbackText>
                </Avatar>
                <Box className="ml-4 flex-1">
                    <Text className="font-bold text-xl" style={{color: theme.text}}>{name}</Text>
                    <Text className="text-base" style={{color: colorScheme === "dark" ? "#AAAAAA" : "#666666"}}>Business Owner</Text>
                </Box>
             </Box>
             <Box className="flex-row mt-5 gap-4">
                {isOwnProfile ? (
                  <Link href="/(main)/edit-profile" asChild>
                    <Button size="xl" variant="outline" className="flex-1 rounded-full">
                      <ButtonText>Edit Profile</ButtonText>
                    </Button>
                  </Link>
                ) : (
                  <>
                    {renderConnectButton()}
                    <Button size="xl" variant='outline' className="flex-1 rounded-full"><ButtonText>Call Now</ButtonText></Button>
                  </>
                )}
             </Box>
        </Section>
        
        {/* --- Highlights --- */}
        <Section title="Highlights">
            {business.highlights.map(highlight => (
                <Box key={highlight.title} className="flex-row items-center mb-4">
                    <Box className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}}>
                        <highlight.icon size={24} color={theme.tint} />
                    </Box>
                    <Box className="flex-1">
                        <Text className="font-semibold text-base" style={{ color: theme.text }}>{highlight.title}</Text>
                        <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>{highlight.description}</Text>
                    </Box>
                </Box>
            ))}
        </Section>

        {/* --- Tab Interface --- */}
        <Box className="mt-8 px-1">
            <Box 
              className="flex-row rounded-full p-1" 
              style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
            >
                <TabButton label="Overview" isActive={activeTab === 'overview'} onPress={() => setActiveTab('overview')} />
                <TabButton label="Services" isActive={activeTab === 'services'} onPress={() => setActiveTab('services')} />
                <TabButton label="Needs" isActive={activeTab === 'needs'} onPress={() => setActiveTab('needs')} />
            </Box>
        </Box>

        {/* --- Tab Content --- */}
        <Box className='mb-14'>
            {activeTab === 'overview' && (
                <Box>
                    {/* --- Contact Info --- */}
                    <Section title="Contact">
                        <Box className="space-y-3">
                            <Box className="p-4 flex-row items-center justify-between rounded-2xl" style={{backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}}>
                                <Box className="flex-row items-center">
                                    <Globe size={20} color={theme.tint}/>
                                    <Text className="ml-4 text-base">{business.website}</Text>
                                </Box>
                                <ExternalLink size={18} color={theme.text} />
                            </Box>
                             <Box className="p-4 flex-row items-center justify-between rounded-2xl" style={{backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}}>
                                <Box className="flex-row items-center">
                                    <Phone size={20} color={theme.tint}/>
                                    <Text className="ml-4 text-base">{business.phoneNumber}</Text>
                                </Box>
                                <Button size="sm" variant="outline" className="rounded-full"><ButtonText>Call</ButtonText></Button>
                            </Box>
                             <Box className="p-4 flex-row items-center justify-between rounded-2xl" style={{backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}}>
                                <Box className="flex-row items-center">
                                    <Mail size={20} color={theme.tint}/>
                                    <Text className="ml-4 text-base">{business.email}</Text>
                                </Box>
                                <Button size="sm" variant="outline" className="rounded-full"><ButtonText>Email</ButtonText></Button>
                            </Box>
                        </Box>
                    </Section>
                    {/* --- Location --- */}
                    <Section title="Location">
                        <Box className="flex-row items-start">
                            <MapPin size={20} color={theme.tint} className="mt-1"/>
                            <Text className="ml-4 flex-1 text-lg leading-7">{business.address}</Text>
                        </Box>
                        {/* Map placeholder */}
                        <Box className="mt-4 h-48 bg-gray-100 rounded-2xl flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-gray-400" />
                        </Box>
                        <Button size="xl" variant="outline" className="mt-5 rounded-full"><ButtonText>Get Directions</ButtonText></Button>
                    </Section>

                     {/* --- Socials --- */}
                    <Section title="Connect With Us">
                        <Box className="flex-row justify-center gap-4">
                            <TouchableOpacity className="w-16 h-16 rounded-full items-center justify-center" style={{backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}}>
                                <Facebook size={28} color={theme.tint} />
                            </TouchableOpacity>
                             <TouchableOpacity className="w-16 h-16 rounded-full items-center justify-center" style={{backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}}>
                                <Instagram size={28} color={theme.tint} />
                            </TouchableOpacity>
                             <TouchableOpacity className="w-16 h-16 rounded-full items-center justify-center" style={{backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}}>
                                <Linkedin size={28} color={theme.tint} />
                            </TouchableOpacity>
                             <TouchableOpacity className="w-16 h-16 rounded-full items-center justify-center" style={{backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}}>
                                <Twitter size={28} color={theme.tint} />
                            </TouchableOpacity>
                        </Box>
                    </Section>
                </Box>
            )}

            {activeTab === 'services' && (
                 <Section title="Our Services" noPadding>
                    {business.services.map(service => (
                        <Box key={service.name} className="p-4 border-b" style={{ borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                           <Text className="font-bold" style={{color: theme.text}}>{service.name}</Text>
                           <Text className="text-sm mt-1" style={{color: colorScheme === "dark" ? "#AAAAAA" : "#666666"}}>{service.description}</Text>
                        </Box>
                    ))}
                 </Section>
            )}

            {activeTab === 'needs' && (
                 <Section title="Active Requirements" noPadding>
                    {business.requirements.map(req => (
                        <Box key={req.title} className="p-5 border-b" style={{ borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                           <Box className="flex-row justify-between items-start">
                             <Text className="font-bold text-xl flex-1 mr-3" style={{color: theme.text}}>{req.title}</Text>
                             <Box className="px-3 py-1 rounded-full" style={{ backgroundColor: req.priority === 'High' ? 'rgba(255,100,100,0.2)' : 'rgba(255,255,255,0.1)' }}>
                                <Text className="text-sm font-semibold" style={{ color: req.priority === 'High' ? '#ff8888' : theme.text }}>{req.priority}</Text>
                             </Box>
                           </Box>
                           <Text className="text-base mt-2 leading-6" style={{color: colorScheme === "dark" ? "#AAAAAA" : "#666666"}}>{req.description}</Text>
                        </Box>
                    ))}
                </Section>
            )}
        </Box>

      </ScrollView>
    </>
  );
}
