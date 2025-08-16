import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Platform, View, KeyboardAvoidingView } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useRouter } from "expo-router";
import { RegisterFormData } from "@/types/register";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {
  verifyPhoneNumber,
  confirmVerificationCode,
} from "@/services/auth";
import { registerUser } from "@/services/registration";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import Gradient from "@/assets/Icons/Gradient";
import { Text } from "@/components/ui/text";
import { app } from "@/services/firebase";

// Import step components
import Stepper from "@/components/register/Stepper";
import StepOne from "@/components/register/StepOne";
import StepTwo from "@/components/register/StepTwo";
import StepThree from "@/components/register/StepThree";
import StepFour from "@/components/register/StepFour";

// Define step titles
const steps = ["Personal", "Business", "Verify", "Done"];

// Define form validation schema
const registerSchema = z.object({
  // Step 1 - Personal Information
  profilePic: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  countryCode: z.string().default("+91"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  group: z.string().min(1, "Please select a group"),

  // Step 2 - Business Information
  businessName: z.string().min(1, "Business name is required"),
  businessCategory: z.string().min(1, "Please select a business category"),
  businessPhone: z.string().optional().or(z.literal("")),
  businessEmail:
    z.string().email("Invalid email format").optional().or(z.literal("")),
  businessLocation: z.string().min(1, "Business location is required"),

  // Step 3 - OTP Verification
  otp: z
    .array(z.string())
    .length(6)
    .refine((val) => val.every((digit) => digit !== ""), {
      message: "Please enter the complete 6-digit OTP",
    }),
});

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifier = useRef(null);
  const toast = useToast();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // Initialize form with react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
    getValues,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema) as any,
    mode: "onChange",
    defaultValues: {
      profilePic: "",
      name: "",
      countryCode: "+91",
      phoneNumber: "",
      email: "",
      group: "",
      businessName: "",
      businessCategory: "",
      businessPhone: "",
      businessEmail: "",
      businessLocation: "",
      otp: ["", "", "", "", "", ""],
    },
  });

  // Watch phone number and country code for OTP verification
  const phoneNumber = watch("phoneNumber");
  const countryCode = watch("countryCode");

  // Initialize reCAPTCHA verifier
  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        // initRecaptchaVerifier("recaptcha-container-register"); // This line is removed
      } catch (error) {
        console.error("Error initializing reCAPTCHA:", error);
      }
    } else {
      // initRecaptchaVerifier(recaptchaContainerRef.current); // This line is removed
    }
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentStep === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep, resendTimer]);

  // Handle form submission for each step
  const onSubmit = async (data: any) => {
    if (currentStep === steps.length - 2) {
      // If on the verification step, verify OTP and show confirmation
      const enteredOtp = data.otp.join("");

      if (enteredOtp.length !== 6) {
        showToast("error", "Please enter the complete 6-digit OTP");
        return;
      }

      if (!verificationId) {
        showToast("error", "Verification session expired. Please resend OTP.");
        return;
      }

      try {
        setIsLoading(true);
        const result = await confirmVerificationCode(verificationId, enteredOtp, true); // true = skipSignIn

        if (!result.success) {
          throw new Error(result.error || "OTP verification failed.");
        }

        // OTP is verified, now send the rest of the data to your backend
        const registrationData = {
          name: data.name,
          phoneNumber: `${data.countryCode}${data.phoneNumber}`,
          email: data.email,
          group: data.group,
          businessName: data.businessName,
          businessCategory: data.businessCategory,
          businessPhone: data.businessPhone,
          businessEmail: data.businessEmail,
          businessLocation: data.businessLocation
        };

        await registerUser(registrationData);
        
        // Show success confirmation modal
        setShowConfirmation(true);
      } catch (error: any) {
        showToast("error", error.message);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    // Move to the next step
    setCurrentStep((prev) => prev + 1);
  };

  // Handle next button click
  const handleNext = async () => {
    let fieldsToValidate: Array<keyof RegisterFormData> = [];

    // Define fields to validate based on current step
    switch (currentStep) {
      case 0:
        fieldsToValidate = ["name", "phoneNumber", "group"];
        break;
      case 1:
        fieldsToValidate = [
          "businessName",
          "businessCategory",
          "businessLocation",
        ];
        break;
      case 2:
        fieldsToValidate = ["otp"];
        break;
    }

    // Trigger validation for the fields
    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid) {
      if (currentStep === 2) {
        // If on the verification step, submit the form
        handleSubmit(onSubmit)();
      } else {
        // Otherwise, move to the next step
        setCurrentStep((prev) => prev + 1);

        // If moving to the verification step, simulate sending OTP
        if (currentStep === 1) {
          sendOtp();
        }
      }
    } else {
      // Show error toast if validation fails
      showToast("error", "Please fill in all required fields correctly");
    }
  };

  // Handle back button click
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  // Handle OTP send
  const sendOtp = async () => {
    try {
      setIsLoading(true);
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;

      const result = await verifyPhoneNumber(fullPhoneNumber, recaptchaVerifier);

      if (!result.success || result.error) {
        throw new Error(result.error || "Failed to send OTP");
      }

      if (result.verificationId) {
        setVerificationId(result.verificationId);
      } else {
        throw new Error("Failed to get verification ID");
      }
      setResendTimer(30);
      setIsResendDisabled(true);
      showToast("success", "OTP sent successfully");
    } catch (error: any) {
      showToast("error", error.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP resend
  const resendOtp = async () => {
    try {
      setIsLoading(true);
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const result = await verifyPhoneNumber(fullPhoneNumber, recaptchaVerifier);

      if (!result.success || result.error) {
        throw new Error(result.error || "Failed to resend OTP");
      }

      if (result.verificationId) {
        setVerificationId(result.verificationId);
      } else {
        throw new Error("Failed to get verification ID");
      }
      setResendTimer(30);
      setIsResendDisabled(true);
      showToast("success", "OTP resent successfully");
    } catch (error: any) {
      showToast("error", error.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show toast notification
  const showToast = (type: "success" | "error" | "info", message: string) => {
    toast.show({
      placement: "top",
      render: ({ id }) => {
        return (
          <Toast nativeID={id} action={type} className="rounded-full">
            <ToastTitle>{message}</ToastTitle>
          </Toast>
        );
      },
    });
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepOne control={control} errors={errors} />;
      case 1:
        return <StepTwo control={control} errors={errors} />;
      case 2:
        return (
          <StepThree
            control={control}
            errors={errors}
            setValue={setValue}
            resendOtp={resendOtp}
            resendTimer={resendTimer}
            isResendDisabled={isResendDisabled}
            phoneNumber={phoneNumber}
            countryCode={countryCode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Box className="flex-1 w-full h-full bg-background">
        {/* Background Gradient */}
        <Box className="absolute top-0 left-0 right-0 bottom-0">
          <Gradient />
        </Box>

        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={app.options}
          attemptInvisibleVerification={true}
        />

        {/* Header */}
        <Box className="pt-16 pb-4 items-center">
          <Text className="text-3xl font-bold" style={{ color: theme.text }}>
            Create Account
          </Text>
          <Text
            className="text-base mt-1"
            style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
          >
            Join our community of builders
          </Text>
        </Box>

        {/* Bottom Sheet */}
        <Box
          className="flex-1 rounded-t-[32px] px-6 pt-6"
          style={{
            backgroundColor:
              colorScheme === "dark" ? "rgba(30,30,30,0.9)" : "rgba(255,255,255,0.9)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          {/* Stepper */}
          <Box className="py-4">
            <Stepper steps={steps} currentStep={currentStep} />
          </Box>

          {/* Form Content */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingBottom: 120, // Increased padding to avoid overlap
              paddingTop: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {renderStepContent()}
          </ScrollView>

          {/* Navigation Buttons */}
          <Box
            className="absolute bottom-0 left-0 right-0 p-4"
            style={{
              backgroundColor:
                colorScheme === "dark" ? "rgba(30,30,30,0.9)" : "rgba(255,255,255,0.9)",
              borderTopWidth: 1,
              borderTopColor:
                colorScheme === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
            }}
          >
            <Box className="flex-row justify-between">
              {currentStep > 0 ? (
                <Button
                  className="rounded-full h-14 w-[48%]"
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor:
                      colorScheme === "dark" ? theme.tint : theme.text,
                  }}
                  onPress={handleBack}
                >
                  <ButtonText
                    style={{
                      color: colorScheme === "dark" ? theme.tint : theme.text,
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    Back
                  </ButtonText>
                </Button>
              ) : (
                <Button
                  className="rounded-full h-14 w-[48%]"
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor:
                      colorScheme === "dark" ? theme.tint : theme.text,
                  }}
                  onPress={() => router.replace("/(auth)/login")}
                >
                  <ButtonText
                    style={{
                      color: colorScheme === "dark" ? theme.tint : theme.text,
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    Cancel
                  </ButtonText>
                </Button>
              )}

              <Button
                className="rounded-full h-14 w-[48%]"
                style={{
                  backgroundColor: theme.tint,
                }}
                onPress={handleNext}
                isDisabled={isLoading}
              >
                <ButtonText
                  style={{
                    color: colorScheme === "dark" ? "#000" : "#FFF",
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  {isLoading && currentStep === 2
                    ? "Verifying..."
                    : isLoading
                    ? "Sending..."
                    : currentStep === steps.length - 2
                    ? "Submit"
                    : "Next"}
                </ButtonText>
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Confirmation Modal */}
        <StepFour
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
        />
      </Box>
    </KeyboardAvoidingView>
  );
}