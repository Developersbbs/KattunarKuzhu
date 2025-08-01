import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Image, useWindowDimensions } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type OnboardingItemProps = {
  item: {
    id: string;
    image: any;
    title: string;
    subtitle: string;
  };
};

const OnboardingItem = ({ item }: OnboardingItemProps) => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Box style={{ width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: theme.background }}>
      <Image alt='onboarding-item' source={item.image} style={{ width: width * 0.8, height: width * 0.8, marginBottom: 40 }} resizeMode="contain" />
      <Text className="text-3xl font-bold text-center mb-4" style={{ color: theme.text }}>{item.title}</Text>
      <Text className="text-lg text-center" style={{ color: theme.text }}>{item.subtitle}</Text>
    </Box>
  );
};

export default OnboardingItem;