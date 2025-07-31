import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <Box className="flex-1 justify-center items-center bg-background-0">
      <Text className="text-2xl mb-4">Onboarding Screen</Text>
      <Button className="bg-[#E1E4DD]" onPress={() => router.replace("/")}>
        <ButtonText>Get Started</ButtonText>
      </Button>
    </Box>
  );
}
