import React, { useRef, useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Image } from '@/components/ui/image';
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react-native';
import PagerView from 'react-native-pager-view';
import { onboardingPages } from '@/constants/onboarding';
import NotificationPermissionModal from '@/components/NotificationPermissionModal';
import { useOnboarding } from '@/context/OnboardingContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [page, setPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { completeOnboarding } = useOnboarding();

  const handleNext = () => {
    if (page < onboardingPages.length - 1) {
      pagerRef.current?.setPage(page + 1);
    }
  };

  const handleBack = () => {
    if (page > 0) {
      pagerRef.current?.setPage(page - 1);
    }
  };

  const handleAllowNotifications = async () => {
    console.log('Notification permission allowed');
    setIsModalVisible(false);
    await completeOnboarding();
  };

  const handleSkipNotifications = async () => {
    console.log('Skipping notifications');
    setIsModalVisible(false);
    await completeOnboarding();
  };

  return (
    <Box className="flex-1 items-center justify-center h-full w-full">
      <PagerView
        ref={pagerRef}
        style={{ flex: 1, width: '100%', height: '100%' }}
        initialPage={0}
        onPageSelected={(e: any) => setPage(e.nativeEvent.position)}
      >
        {onboardingPages.map((item, index) => (
          <Box key={index} className="flex-1 items-center justify-center w-full">
            <Image source={item.image} className="h-full w-full" alt={item.title} />
          </Box>
        ))}
      </PagerView>
      <Box className="flex items-center justify-center w-full py-10 px-4 gap-4">
        <Text className="text-4xl font-bold text-center">{onboardingPages[page].title}</Text>
        <Text className="text-md text-gray-500">
          {onboardingPages[page].description}
        </Text>
        <Box className="flex-row items-center justify-center mt-4">
          {onboardingPages.map((_, index) => (
            <Box
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                page === index ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          ))}
        </Box>
        <Box className="flex flex-row items-end justify-between w-full mt-10 px-4 h-16 gap-5">
          {page > 0 && (
            <Button
              className="border border-black bg-transparent rounded-full px-5 py-5 h-full"
              onPress={handleBack}
            >
              <ChevronLeftIcon className="w-2 h-2" color={colors.text} />
            </Button>
          )}
          {page < onboardingPages.length - 1 ? (
            <Button
              className="bg-black rounded-full flex-1 gap-1 w-fit px-8 py-4 h-full self-end"
              onPress={handleNext}
            >
              <ButtonText className="font-semibold text-white text-lg vertical-center">
                Next
              </ButtonText>
              <ChevronRightIcon className="w-2 h-2" color={colors.background} />
            </Button>
          ) : (
            <Button
              className="bg-black rounded-full flex-1 py-4 h-full"
              onPress={() => setIsModalVisible(true)}
            >
              <ButtonText className="font-semibold text-white text-lg">
                Get Started
              </ButtonText>
            </Button>
          )}
        </Box>
      </Box>
      <NotificationPermissionModal
        isOpen={isModalVisible}
        onClose={handleSkipNotifications}
        onAllow={handleAllowNotifications}
      />
    </Box>
  );
}