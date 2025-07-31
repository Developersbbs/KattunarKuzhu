import React, { useState, useRef } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { FlatList, Animated, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import OnboardingItem from '@/components/OnboardingItem';
import Paginator from '@/components/Paginator';
import Gradient from '@/assets/Icons/Gradient';

const { width } = Dimensions.get('window');

const data = [
  {
    id: '1',
    image: require('../assets/images/icon.png'),
    title: 'Welcome to the App!',
    subtitle: 'Discover a new way to manage your tasks and stay organized.',
  },
  {
    id: '2',
    image: require('../assets/images/logo.svg'),
    title: 'Stay Productive',
    subtitle: 'Create, track, and complete your goals with ease.',
  },
  {
    id: '3',
    image: require('../assets/images/splash.png'),
    title: 'Get Started',
    subtitle: 'Join us and take control of your productivity today!',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < data.length - 1) {
      if (slidesRef.current) {
        slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
      }
    } else {
      router.replace('/login');
    }
  };

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Box className="flex-1 items-center" style={{ backgroundColor: theme.background }}>
      <Box style={{ flex: 3 }}>
        <FlatList
          data={data}
          renderItem={({ item }) => <OnboardingItem item={item} />}
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
      <Box style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 20 }}>
        <Paginator data={data} scrollX={scrollX} />
        <Button onPress={scrollTo} className='w-full h-16 rounded-full' style={{ backgroundColor: theme.tint, width: '80%' }}>
            <ButtonText className='w-full text-center' style={{ color: theme.background }}>
            {currentIndex === data.length - 1 ? 'Get Started' : 'Next'}
            </ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
