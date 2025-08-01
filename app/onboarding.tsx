import React, { useState, useRef, useCallback } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { FlatList, Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import Gradient from '@/assets/Icons/Gradient';
import DocumentDataIcon from '@/assets/Icons/DocumentData';
import LightbulbPersonIcon from '@/assets/Icons/LightbulbPerson';
import RocketIcon from '@/assets/Icons/Rocket';
import { ChevronRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Updated slides with Tamil translations
const slides = [
  {
    id: '1',
    icon: 'document',
    title: { 
      en: 'Welcome to Kattunar Kuzhu',
      ta: 'கட்டுனார் குழுவிற்கு வரவேற்கிறோம்'
    },
    description: {
      en: 'Discover a new way to manage your community tasks and stay organized.',
      ta: 'உங்கள் சமூக பணிகளை நிர்வகிக்க புதிய வழியைக் கண்டறியுங்கள்.'
    }
  },
  {
    id: '2',
    icon: 'lightbulb',
    title: {
      en: 'Smart Community Management',
      ta: 'திறமையான சமூக மேலாண்மை'
    },
    description: {
      en: 'Create, track, and complete your community goals with ease.',
      ta: 'உங்கள் சமூக இலக்குகளை எளிதாக உருவாக்கி, கண்காணித்து, நிறைவு செய்யுங்கள்.'
    }
  },
  {
    id: '3',
    icon: 'rocket',
    title: {
      en: 'Get Started Today',
      ta: 'இன்றே தொடங்குங்கள்'
    },
    description: {
      en: 'Join us and take control of your community productivity!',
      ta: 'எங்களுடன் இணைந்து உங்கள் சமூக உற்பத்தித்திறனை கட்டுப்படுத்துங்கள்!'
    }
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTamil, setIsTamil] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const viewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(auth)/login');
    }
  }, [currentIndex, router]);
  
  const scrollToIndex = useCallback((index: number) => {
    slidesRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const toggleLanguage = useCallback((value: boolean) => {
    setIsTamil(value);
  }, []);
  
  // Function to render the appropriate icon
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'document':
        return <DocumentDataIcon />;
      case 'lightbulb':
        return <LightbulbPersonIcon />;
      case 'rocket':
        return <RocketIcon />;
      default:
        return null;
    }
  };

  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background }}>
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Gradient />
      </View>
      
      {/* Language Toggle */}
      <Box className="absolute top-12 right-6 z-10 flex-row items-center">
        <Text className="text-sm font-medium mr-2" style={{ color: theme.text }}>EN</Text>
        <Switch
          value={isTamil}
          onValueChange={toggleLanguage}
          trackColor={{ false: theme.icon, true: theme.tint }}
          thumbColor={theme.background}
        />
        <Text className="text-sm font-medium ml-2" style={{ color: theme.text }}>தமிழ்</Text>
      </Box>
      
      {/* Carousel Section */}
      <Box className="flex-1 w-full">
        <FlatList
          data={slides}
          renderItem={({ item }) => (
            <Box style={{ width, height: height * 0.7 }} className="px-6">
              <Box className="flex-1 items-center justify-center mb-8">
                {/* Icon Container */}
                <Box 
                  className="w-full h-3/4 rounded-b-[40px] items-center justify-center"
                  style={{ 
                    backgroundColor: colorScheme === 'dark' ? 'rgba(160, 118, 249, 0.1)' : 'rgba(45, 18, 72, 0.1)'
                  }}
                >
                  <View style={{ 
                    transform: [{ scale: 3 }],
                    opacity: 0.9
                  }}>
                    {renderIcon(item.icon)}
                  </View>
                </Box>
                
                <Box className="absolute bottom-0 left-0 right-0 p-6 items-center">
                  <Text 
                    className="text-2xl font-bold mb-2 text-center"
                    style={{ color: theme.text }}
                  >
                    {isTamil ? item.title.ta : item.title.en}
                  </Text>
                  <Text 
                    className="text-base text-center"
                    style={{ color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }}
                  >
                    {isTamil ? item.description.ta : item.description.en}
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </Box>
      
      {/* Dot indicators */}
      <Box className="flex-row justify-center mb-6">
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <TouchableOpacity key={index} onPress={() => scrollToIndex(index)}>
              <Animated.View 
                className="h-2 rounded-full mx-1.5"
                style={[{ 
                  width: dotWidth, 
                  opacity, 
                  backgroundColor: theme.tint 
                }]} 
              />
            </TouchableOpacity>
          );
        })}
      </Box>
      
      {/* Bottom Action */}
      <Box className="w-full px-6 pb-10">
        <Button 
          onPress={scrollTo} 
          className="w-full h-14 rounded-full"
          style={{ backgroundColor: theme.tint }}
        >
          <ButtonText 
            className="text-lg font-bold"
            style={{ color: theme.background }}
          >
            {currentIndex === slides.length - 1 
              ? (isTamil ? 'தொடங்குங்கள்' : 'Get Started') 
              : (isTamil ? 'அடுத்து' : 'Next')}
          </ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
