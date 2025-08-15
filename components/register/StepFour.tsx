import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Modal, ModalBackdrop, ModalContent, ModalBody, ModalFooter } from "@/components/ui/modal";
import { CheckCircle2 } from "lucide-react-native";
import { useRouter } from "expo-router";

interface StepFourProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StepFour({ isOpen, onClose }: StepFourProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    // Navigate to the home screen or login screen
    router.push("/(tabs)/home");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="rounded-3xl bg-white">
        <ModalBody
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 32,
          }}
        >
          <Box className="items-center justify-center mb-6">
            <CheckCircle2 size={80} color="#000" />
          </Box>
          <Text className="text-2xl font-bold text-center mb-2">
            Registration Submitted
          </Text>
          <Text className="text-base text-gray-600 text-center px-6">
            Your registration has been sent for admin approval. You will be notified once it's approved.
          </Text>
        </ModalBody>
        <ModalFooter className="border-t border-gray-100">
          <Button
            className="bg-black rounded-full h-14 w-full"
            onPress={handleClose}
          >
            <ButtonText className="text-white font-semibold text-base">
              Close
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
