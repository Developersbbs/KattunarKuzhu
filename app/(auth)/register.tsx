import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Platform, View } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "expo-router";
import { RegisterFormData } from "@/types/register";
import { initRecaptchaVerifier, sendVerificationCode, signInWithCode } from "@/services/auth";

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
  businessEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  businessLocation: z.string().min(1, "Business location is required"),

  // Step 3 - OTP Verification
  otp: z.array(z.string()).length(6).refine((val) => val.every(digit => digit !== ""), {
    message: "Please enter the complete 6-digit OTP"
  }),
});

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const recaptchaContainerRef = useRef<View>(null);
  const toast = useToast();

  // Initialize form with react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
    getValues,
    watch
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
        initRecaptchaVerifier("recaptcha-container-register");
      } catch (error) {
        console.error("Error initializing reCAPTCHA:", error);
      }
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
        const result = await signInWithCode(verificationId, enteredOtp);

        if (!result.success) {
          throw new Error(result.error || "OTP verification failed.");
        }

        showToast("success", "OTP verified successfully");
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
        fieldsToValidate = ["businessName", "businessCategory", "businessLocation"];
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

      if (Platform.OS !== "web" && recaptchaContainerRef.current) {
        initRecaptchaVerifier(recaptchaContainerRef.current);
      }

      const result = await sendVerificationCode(fullPhoneNumber);

      if (result.error) {
        throw new Error(result.error);
      }

      setVerificationId(result.verificationId);
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
      const result = await sendVerificationCode(fullPhoneNumber);

      if (result.error) {
        throw new Error(result.error);
      }

      setVerificationId(result.verificationId);
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
          <Toast
            nativeID={id}
            action={type}
            className="bg-black rounded-full"
          >
            <ToastTitle className="text-white">{message}</ToastTitle>
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
    <Box className="flex-1 bg-white">
      {/* Hidden reCAPTCHA container */}
      <View
        ref={Platform.OS !== 'web' ? recaptchaContainerRef : null}
        id="recaptcha-container-register" 
        style={{ height: 0, width: 0, opacity: 0 }} 
      />

      {/* Header with Stepper */}
      <Box className="pt-16 pb-4 bg-white">
        <Stepper steps={steps} currentStep={currentStep} />
      </Box>

      {/* Form Content */}
      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ 
          paddingBottom: 100,
          paddingTop: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <Box className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Box className="flex-row justify-between">
          {currentStep > 0 ? (
            <Button
              className="bg-white border border-black rounded-full h-14 w-[48%]"
              onPress={handleBack}
            >
              <ButtonText className="text-black font-semibold text-base">
                Back
              </ButtonText>
            </Button>
          ) : (
            <Link href="/login" asChild>
              <Button
                className="bg-white border border-black rounded-full h-14 w-[48%]"
              >
                <ButtonText className="text-black font-semibold text-base">
                  Cancel
                </ButtonText>
              </Button>
            </Link>
          )}
          
          <Button
            className="bg-black rounded-full h-14 w-[48%]"
            onPress={handleNext}
            isDisabled={isLoading}
          >
            <ButtonText className="text-white font-semibold text-base">
              {isLoading && currentStep === 2 ? "Verifying..." :
               isLoading ? "Sending..." :
               currentStep === steps.length - 2 ? "Submit" : "Next"}
            </ButtonText>
          </Button>
        </Box>
      </Box>

      {/* Confirmation Modal */}
      <StepFour 
        isOpen={showConfirmation} 
        onClose={() => setShowConfirmation(false)} 
      />
    </Box>
  );
}