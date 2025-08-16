import React, { useState, useRef, useEffect } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  SelectIcon,
} from "@/components/ui/select";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import Gradient from "@/assets/Icons/Gradient";
import {
  TouchableOpacity,
  View,
  Dimensions,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import { X, ChevronDown } from "lucide-react-native";
import {
  verifyPhoneNumber,
  confirmVerificationCode,
} from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { app } from "@/services/firebase";

const { width, height } = Dimensions.get("window");

// Country codes array
const countryCodes = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
];

const Login = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const toast = useToast();

  // States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  // OTP input refs
  const otpInputRefs = useRef<Array<React.RefObject<any>>>([]);
  const recaptchaContainerRef = useRef<View>(null);

  // Initialize reCAPTCHA verifier
  useEffect(() => {
    if (Platform.OS === "web") {
      // initRecaptchaVerifier("recaptcha-container-login"); // This line is removed as per the new_code
    } else {
      // initRecaptchaVerifier(recaptchaContainerRef.current); // This line is removed as per the new_code
    }
  }, []);

  // Initialize OTP input refs
  useEffect(() => {
    otpInputRefs.current = Array(6)
      .fill(0)
      .map((_, i) => otpInputRefs.current[i] || React.createRef());
  }, []);

  // Timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpRequested && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpRequested, timeLeft]);

  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next input
    if (text.length === 1 && index < 5) {
      otpInputRefs.current[index + 1]?.current?.focus();
    }
  };

  // Handle OTP key press for backspace
  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      otpInputRefs.current[index - 1]?.current?.focus();
    }
  };

  // reCAPTCHA verifier reference
  const recaptchaVerifier = useRef(null);

  // Request OTP handler
  const handleRequestOtp = async () => {
    if (phoneNumber.length !== 10) {
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Please enter a valid phone number</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Format phone number with country code
      const formattedPhoneNumber = `${countryCode.code}${phoneNumber}`;
      
      // Send verification code
      const result = await verifyPhoneNumber(
        formattedPhoneNumber,
        recaptchaVerifier
      );
      
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId);
        setIsOtpRequested(true);
        setTimeLeft(30);
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => (
            <Toast nativeID={id} variant="solid" action="success">
              <ToastTitle>OTP sent successfully</ToastTitle>
            </Toast>
          ),
        });
      } else {
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle>
                {result.error || "Failed to send OTP. Please try again."}
              </ToastTitle>
            </Toast>
          ),
        });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>An error occurred. Please try again.</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Please enter a valid 6-digit OTP</ToastTitle>
          </Toast>
        ),
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (!verificationId) {
        throw new Error("Verification ID is missing.");
      }
      // Sign in with the verification code
      const result = await confirmVerificationCode(verificationId, otpValue, false); // false = don't skip sign in
      
      if (result.success) {
        // Authentication successful
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => (
            <Toast nativeID={id} variant="solid" action="success">
              <ToastTitle>Authentication successful</ToastTitle>
            </Toast>
          ),
        });
        
        // Navigate to main app
        router.replace("/(main)");
      } else {
        // Authentication failed
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle>
                {result.error ||
                  "Invalid verification code. Please try again."}
              </ToastTitle>
            </Toast>
          ),
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>An error occurred during verification. Please try again.</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset phone number
  const resetPhoneNumber = () => {
    setPhoneNumber("");
  };

  // Change phone number
  const changePhoneNumber = () => {
    setIsOtpRequested(false);
    setOtp(["", "", "", "", "", ""]);
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

        {/* Logo Section */}
        <Box className="flex-1 justify-center items-center pt-16 gap-6">
          <Image
            alt="logo"
            source={require("@/assets/images/logo.png")}
            className="w-28 h-28 rounded-full"
            resizeMode="contain"
          />
          <Box className="items-center mb-12">
            <Text className="text-3xl font-bold" style={{ color: theme.text }}>
              கட்டுனர் குழு
            </Text>
            <Text
              className="text-base mt-1"
              style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
            >
              Welcome back!
            </Text>
          </Box>
        </Box>

        {/* Bottom Sheet */}
        <Box
          className="rounded-t-[32px] px-6 pb-8 pt-6"
          style={{
            backgroundColor: colorScheme === "dark" ? "#1E1E1E" : theme.tint,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Box className="space-y-4">
            <Box className="space-y-1">
              <Text
                className="text-2xl font-semibold"
                style={{
                  color: colorScheme === "dark" ? "#FFFFFF" : "#FFFFFF",
                }}
              >
                Login
              </Text>
              <Text
                className="text-sm mb-2"
                style={{
                  color:
                    colorScheme === "dark"
                      ? "#DDDDDD"
                      : "rgba(255,255,255,0.8)",
                }}
              >
                {!isOtpRequested
                  ? "Enter your mobile number to receive OTP"
                  : "Enter the OTP sent to your mobile"}
              </Text>
            </Box>

            {!isOtpRequested ? (
              <Box className="flex flex-col gap-5">
                <Box className="flex flex-col gap-3">
                  <Box className="flex-row items-center gap-1">
                    {/* Country Code Selector */}
                    <Box
                      className="h-14 rounded-l-xl justify-center overflow-hidden"
                      style={{
                        backgroundColor:
                          colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
                        width: 90,
                        borderRightWidth: 1,
                        borderTopLeftRadius: 32,
                        borderBottomLeftRadius: 32,
                        borderRightColor:
                          colorScheme === "dark" ? "#3A3A3A" : "#E5E5E5",
                      }}
                    >
                      <Select
                        onValueChange={(value) => {
                          const selected = countryCodes.find(
                            (c) => c.code === value
                          );
                          if (selected) setCountryCode(selected);
                        }}
                        selectedValue={countryCode.code}
                      >
                        <SelectTrigger className="h-full justify-center items-center px-2">
                          <SelectInput
                            placeholder="Code"
                            style={{
                              color:
                                colorScheme === "dark" ? "#FFFFFF" : "#000000",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                            value={`${countryCode.flag} ${countryCode.code}`}
                          />
                          <SelectIcon className="size-4" as={ChevronDown} />
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectBackdrop />
                          <SelectContent>
                            {countryCodes.map((c) => (
                              <SelectItem
                                key={c.code}
                                label={`${c.flag} ${c.name} (${c.code})`}
                                value={c.code}
                              />
                            ))}
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </Box>

                    {/* Phone Input */}
                    <Box className="flex-1 relative">
                      <Input
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        style={{
                          backgroundColor:
                            colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
                          borderColor: "transparent",
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          borderRadius: 32,
                          height: 56,
                        }}
                      >
                        <InputField
                          placeholder="Enter mobile number"
                          keyboardType="phone-pad"
                          maxLength={10}
                          onChangeText={setPhoneNumber}
                          value={phoneNumber}
                          placeholderTextColor={
                            colorScheme === "dark" ? "#AAAAAA" : "#888888"
                          }
                          style={{
                            color:
                              colorScheme === "dark" ? "#FFFFFF" : "#000000",
                            fontSize: 16,
                          }}
                        />
                      </Input>

                      {phoneNumber.length > 0 && (
                        <TouchableOpacity
                          onPress={resetPhoneNumber}
                          style={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: [{ translateY: -12 }],
                          }}
                        >
                          <X
                            size={20}
                            color={
                              colorScheme === "dark" ? "#AAAAAA" : "#888888"
                            }
                          />
                        </TouchableOpacity>
                      )}
                    </Box>
                  </Box>

                  <Text
                    className="text-xs ml-2"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? "#AAAAAA"
                          : "rgba(255,255,255,0.7)",
                    }}
                  >
                    We'll send you a one-time password
                  </Text>
                </Box>

                <Button
                  className="w-full h-14 rounded-full"
                  style={{
                    backgroundColor:
                      colorScheme === "dark" ? "#A076F9" : "#FFFFFF",
                    opacity: phoneNumber.length !== 10 ? 0.5 : 1,
                  }}
                  onPress={handleRequestOtp}
                  disabled={phoneNumber.length !== 10 || isLoading}
                >
                  {isLoading ? (
                    <Spinner
                      size="small"
                      color={colorScheme === "dark" ? "#FFFFFF" : theme.tint}
                    />
                  ) : (
                    <ButtonText
                      className="font-bold"
                      style={{
                        color: colorScheme === "dark" ? "#FFFFFF" : theme.tint,
                      }}
                    >
                      Get OTP
                    </ButtonText>
                  )}
                </Button>
              </Box>
            ) : (
              <Box className="flex flex-col gap-5">
                {/* OTP Input */}
                <Box className="flex-row justify-between w-full my-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      variant="outline"
                      size="lg"
                      style={{
                        backgroundColor:
                          colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
                        borderColor:
                          colorScheme === "dark" ? "#3A3A3A" : "#E5E5E5",
                        borderRadius: 12,
                        height: 56,
                        width: width * 0.12,
                      }}
                    >
                      <InputField
                        ref={otpInputRefs.current[index]}
                        keyboardType="number-pad"
                        maxLength={1}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        value={otp[index]}
                        placeholderTextColor={
                          colorScheme === "dark" ? "#AAAAAA" : "#888888"
                        }
                        style={{
                          color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
                          textAlign: "center",
                          fontSize: 18,
                          fontWeight: "bold",
                          padding: 0,
                        }}
                      />
                    </Input>
                  ))}
                </Box>

                <Box className="flex-row justify-between items-center">
                  <Text
                    className="text-xs"
                    style={{
                      color:
                        colorScheme === "dark"
                          ? "#AAAAAA"
                          : "rgba(255,255,255,0.7)",
                    }}
                  >
                    OTP sent to {countryCode.code} {phoneNumber}
                  </Text>

                  {timeLeft > 0 ? (
                    <Text
                      className="text-xs"
                      style={{
                        color:
                          colorScheme === "dark"
                            ? "#AAAAAA"
                            : "rgba(255,255,255,0.7)",
                      }}
                    >
                      Resend OTP in {timeLeft}s
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={handleRequestOtp}
                      disabled={isLoading}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{
                          color: colorScheme === "dark" ? "#A076F9" : "#FFFFFF",
                        }}
                      >
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  )}
                </Box>

                <Button
                  className="w-full h-14 rounded-full"
                  style={{
                    backgroundColor:
                      colorScheme === "dark" ? "#A076F9" : "#FFFFFF",
                    opacity: otp.join("").length !== 6 ? 0.5 : 1,
                  }}
                  onPress={handleVerifyOtp}
                  disabled={otp.join("").length !== 6 || isLoading}
                >
                  {isLoading ? (
                    <Spinner
                      size="small"
                      color={colorScheme === "dark" ? "#FFFFFF" : theme.tint}
                    />
                  ) : (
                    <ButtonText
                      className="font-bold"
                      style={{
                        color: colorScheme === "dark" ? "#FFFFFF" : theme.tint,
                      }}
                    >
                      Verify OTP
                    </ButtonText>
                  )}
                </Button>

                <TouchableOpacity
                  onPress={changePhoneNumber}
                  disabled={isLoading}
                  className="items-center py-2"
                >
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: colorScheme === "dark" ? "#A076F9" : "#FFFFFF",
                    }}
                  >
                    Change mobile number
                  </Text>
                </TouchableOpacity>
              </Box>
            )}

            {/* Registration Link */}
            <Box className="items-center mt-4">
              <Box className="flex-row">
                <Text
                  className="text-sm"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? "#DDDDDD"
                        : "rgba(255,255,255,0.8)",
                  }}
                >
                  Not a member?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/register" as any)}>
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: colorScheme === "dark" ? "#A076F9" : "#FFFFFF",
                    }}
                  >
                    Register here
                  </Text>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default Login;
