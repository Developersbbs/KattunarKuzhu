import React, { useEffect, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Pressable } from "react-native";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { RegisterFormData } from "@/types/register";

interface StepThreeProps {
  control: Control<RegisterFormData>;
  errors: any;
  setValue: UseFormSetValue<RegisterFormData>;
  resendOtp: () => void;
  resendTimer: number;
  isResendDisabled: boolean;
  phoneNumber: string;
  countryCode: string;
}

export default function StepThree({ 
  control, 
  errors, 
  setValue,
  resendOtp,
  resendTimer,
  isResendDisabled,
  phoneNumber,
  countryCode
}: StepThreeProps) {
  const otpInputRefs = useRef<Array<React.RefObject<any>>>([]);

  // Initialize OTP input refs
  useEffect(() => {
    otpInputRefs.current = Array(6)
      .fill(0)
      .map(() => React.createRef());
  }, []);

  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.charAt(0);
    }
    
    // Update the specific OTP digit
    setValue(`otp[${index}]` as any, text);
    
    // Auto-focus next input
    if (text && index < 5) {
      otpInputRefs.current[index + 1]?.current?.focus();
    }
  };

  // Handle OTP input backspace
  const handleOtpKeyPress = (e: any, index: number, value: string) => {
    if (e.nativeEvent.key === "Backspace" && !value && index > 0) {
      otpInputRefs.current[index - 1]?.current?.focus();
    }
  };

  return (
    <Box className="w-full px-4 flex-1">
      <Text className="text-xl font-bold text-center mb-6">
        Verification
      </Text>
      
      <Text className="text-base font-medium mb-6 text-center">
        Enter the 6-digit code sent to {countryCode} {phoneNumber}
      </Text>

      {/* OTP Input Boxes */}
      <FormControl isInvalid={!!errors.otp} className="mb-8">
        <Box className="flex-row justify-between mb-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Controller
              key={index}
              control={control}
              name={`otp[${index}]` as any}
              render={({ field: { onChange, value } }) => (
                <Input
                  className="h-14 w-14 rounded-full bg-white border border-gray-300 mx-1"
                  size="md"
                >
                  <InputField
                    ref={otpInputRefs.current[index]}
                    value={value as string}
                    onChangeText={(text) => {
                      onChange(text);
                      handleOtpChange(text, index);
                    }}
                    onKeyPress={(e) => handleOtpKeyPress(e, index, value as string)}
                    keyboardType="number-pad"
                    maxLength={1}
                    className="h-14 text-center text-lg font-bold"
                    textAlign="center"
                  />
                </Input>
              )}
            />
          ))}
        </Box>
        {errors.otp && (
          <FormControlError>
            <FormControlErrorText className="text-center">{errors.otp.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Resend OTP */}
      <Box className="flex-row justify-center items-center mb-6">
        <Text className="text-gray-600 mr-2">
          Didn't receive the code?
        </Text>
        <Pressable onPress={resendOtp} disabled={isResendDisabled}>
          <Text
            className={`font-semibold ${
              isResendDisabled ? "text-gray-400" : "text-black"
            }`}
          >
            {isResendDisabled ? `Resend in ${resendTimer}s` : "Resend OTP"}
          </Text>
        </Pressable>
      </Box>

      {/* Change Number Option */}
      <Box className="items-center">
        <Button
          variant="link"
          onPress={() => {
            // This will be handled in the parent component
          }}
        >
          <ButtonText className="text-black font-semibold">
            Change Phone Number
          </ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
