import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Modal, ModalBackdrop, ModalContent, ModalBody, ModalFooter } from "@/components/ui/modal";
import { CheckCircle2, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface StepFourProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StepFour({ isOpen, onClose }: StepFourProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const handleClose = () => {
    onClose();
    // Navigate to the login screen
    router.replace("/(auth)/login");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent 
        style={{ 
          borderRadius: 24,
          backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
          width: "90%",
          maxWidth: 400,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: colorScheme === "dark" ? 0.5 : 0.2,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {/* Header with colored background */}
        <Box
          style={{
            backgroundColor: colorScheme === "dark" ? "#2D1248" : theme.tint,
            paddingTop: 30,
            paddingBottom: 30,
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative Elements */}
          <Box
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          />
          <Box
            style={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
          />
          
          <Box 
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 50,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Clock size={40} color="#FFFFFF" />
          </Box>
          
          <Text 
            className="text-2xl font-bold text-center"
            style={{ color: "#FFFFFF" }}
          >
            Registration Pending
          </Text>
        </Box>
        
        <ModalBody
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 30,
            paddingHorizontal: 24,
          }}
        >
          <Text 
            className="text-lg font-medium text-center mb-4"
            style={{ color: theme.text }}
          >
            Thank you for registering!
          </Text>
          
          <Text 
            className="text-base text-center mb-2"
            style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
          >
            Your registration has been submitted successfully and is awaiting admin approval.
          </Text>
          
          <Text 
            className="text-base text-center"
            style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
          >
            You will be able to log in once your account has been verified and approved.
          </Text>
          
          <Box 
            style={{
              marginTop: 20,
              padding: 16,
              backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.1)" : "rgba(45, 18, 72, 0.05)",
              borderRadius: 16,
              width: "100%",
            }}
          >
            <Text 
              className="text-sm text-center"
              style={{ color: colorScheme === "dark" ? "#A076F9" : theme.tint }}
            >
              This process usually takes 24-48 hours. You'll receive a notification when your account is approved.
            </Text>
          </Box>
          
        </ModalBody>
        
        <ModalFooter
          style={{
            borderTopWidth: 1,
            borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            padding: 16,
          }}
        >
          <Button
            className="rounded-xl h-14 w-full"
            style={{
              backgroundColor: colorScheme === "dark" ? "#A076F9" : theme.tint,
            }}
            onPress={handleClose}
          >
            <ButtonText 
              style={{ 
                color: "#FFFFFF", 
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Go to Login
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
