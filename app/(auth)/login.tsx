import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Colors } from '@/constants/Colors';
import Logo from '@/assets/Icons/Logo';
import Gradient from '@/assets/Icons/Gradient';
import { useToast, Toast, ToastTitle } from '@/components/ui/toast';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  SelectIcon,
} from '@/components/ui/select';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { countries } from '../../constants/Countries';
import { ChevronDownIcon } from 'lucide-react-native';
import { Country } from '@/constants/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'expo-router';
import { Divider } from '@/components/ui/divider';

const { height, width } = Dimensions.get('window');

const Login = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<Country>(countries[0]);
  const [showOtpView, setShowOtpView] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const toast = useToast();
  const router = useRouter();
  
  // Create refs for OTP inputs
  const otpInputRefs = useRef<Array<React.RefObject<any>>>([]);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  
  // Initialize refs for OTP inputs
  useEffect(() => {
    otpInputRefs.current = Array(6)
      .fill(0)
      .map((_, i) => otpInputRefs.current[i] || React.createRef());
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtpView && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [showOtpView, countdown]);

  const validatePhone = () => {
    if (!phone || phone.length < 10) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSendOTP = () => {
    if (!validatePhone()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowOtpView(true);
      setCountdown(30);
      setIsResendDisabled(true);
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          return (
            <Toast nativeID={id} variant="solid" action="success">
              <ToastTitle>OTP sent successfully</ToastTitle>
            </Toast>
          );
        },
      });
    }, 1000);
  };
  
  const handleOtpChange = (text: string, index: number) => {
    // Update the OTP value at the specified index
    const newOtpValues = [...otpValues];
    newOtpValues[index] = text;
    setOtpValues(newOtpValues);
    
    // Combine all OTP values
    setOtp(newOtpValues.join(''));
    
    // Auto-advance to next input if current input is filled
    if (text.length === 1 && index < 5) {
      otpInputRefs.current[index + 1]?.current?.focus();
    }
  };
  
  const handleOtpKeyPress = (e: any, index: number) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otpValues[index]) {
      otpInputRefs.current[index - 1]?.current?.focus();
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          return (
            <Toast nativeID={id} variant="solid" action="error">
              <ToastTitle>Please enter a valid 6-digit OTP</ToastTitle>
            </Toast>
          );
        },
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/');
    }, 1500);
  };

  const handleResendOTP = () => {
    if (isResendDisabled) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCountdown(30);
      setIsResendDisabled(true);
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          return (
            <Toast nativeID={id} variant="solid" action="success">
              <ToastTitle>OTP resent successfully</ToastTitle>
            </Toast>
          );
        },
      });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View style={StyleSheet.absoluteFillObject}>
        <Gradient />
      </View>
      
      <Box className="flex-1 justify-center items-center pt-12">
        <Logo />
        <Text className="text-2xl font-bold mt-4" style={{ color: colors.text }}>
          Welcome Back
        </Text>
      </Box>
      
      <Box 
        className="rounded-t-3xl px-6 py-8 items-center"
        style={{ 
          backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : colors.tint,
          minHeight: height * 0.45,
        }}
      >
        {!showOtpView ? (
          <>
            <Box className="w-full mb-4">
              <Text className="text-sm mb-2" style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}>
                Phone Number
              </Text>
              
              {/* Phone input with country code selector */}
              <Box className="flex-row items-center w-full">
                {/* Country code selector */}
                <Box 
                  className="h-14 rounded-l-lg justify-center"
                  style={{
                    backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF',
                    width: 100,
                    borderRightWidth: 1,
                    borderRightColor: colorScheme === 'dark' ? '#3A3A3A' : '#E5E5E5',
                  }}
                >
                  <Select
                    onValueChange={(value) => {
                      const selectedCountry = countries.find(
                        (c: Country) => c.code === value
                      );
                      if (selectedCountry) {
                        setCountry(selectedCountry);
                      }
                    }}
                    selectedValue={country.code}
                  >
                    <SelectTrigger
                      className="h-full justify-center items-center px-2"
                    >
                      <SelectInput
                        placeholder="Code"
                        style={{ 
                          color: colorScheme === 'dark' ? '#FFFFFF' : colors.text,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                        value={`${country.flag} ${country.code}`}
                      />
                      <SelectIcon as={ChevronDownIcon} size="sm" />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        {countries.map((c: Country) => (
                          <SelectItem
                            key={c.code}
                            label={`${c.flag} ${c.name} (${c.code})`}
                            value={c.code as string}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </Box>
                
                {/* Phone number input */}
                <Input
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  style={{
                    backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF',
                    borderColor: phoneError ? '#FF4D4F' : 'transparent',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderRadius: 8,
                    height: 56,
                  }}
                >
                  <InputField
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    onChangeText={(text) => {
                      setPhone(text);
                      if (phoneError) validatePhone();
                    }}
                    value={phone}
                    placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
                    style={{
                      color: colorScheme === 'dark' ? '#FFFFFF' : colors.text,
                      fontSize: 16,
                    }}
                  />
                </Input>
              </Box>
              
              {phoneError ? (
                <Text className="text-xs ml-2 mt-1" style={{ color: '#FF4D4F' }}>
                  {phoneError}
                </Text>
              ) : null}
            </Box>
            
            <Button 
              className="w-full h-14 rounded-xl mt-4"
              style={{ 
                backgroundColor: colorScheme === 'dark' ? '#A076F9' : '#FFFFFF',
              }}
              onPress={handleSendOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner size="small" color={colorScheme === 'dark' ? '#FFFFFF' : colors.tint} />
              ) : (
                <ButtonText 
                  className="font-bold"
                  style={{ 
                    color: colorScheme === 'dark' ? '#FFFFFF' : colors.tint,
                  }}
                >
                  Send OTP
                </ButtonText>
              )}
            </Button>
          </>
        ) : (
          <>
            <Box className="w-full mb-4">
              <Text className="text-sm mb-2" style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF' }}>
                Verification Code
              </Text>
              
              {/* Custom OTP input */}
              <Box className="flex-row justify-between w-full my-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    variant="outline"
                    size="lg"
                    style={{
                      backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF',
                      borderColor: colorScheme === 'dark' ? '#3A3A3A' : '#E5E5E5',
                      borderRadius: 8,
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
                      value={otpValues[index]}
                      placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
                      style={{
                        color: colorScheme === 'dark' ? '#FFFFFF' : colors.text,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                        padding: 0,
                      }}
                    />
                  </Input>
                ))}
              </Box>
              
              <Text className="text-xs text-center mt-2" style={{ color: colorScheme === 'dark' ? '#AAAAAA' : 'rgba(255,255,255,0.7)' }}>
                Enter the 6-digit code sent to {country.code} {phone}
              </Text>
            </Box>
            
            <Button 
              className="w-full h-14 rounded-xl mt-4"
              style={{ 
                backgroundColor: colorScheme === 'dark' ? '#A076F9' : '#FFFFFF',
              }}
              onPress={handleVerifyOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner size="small" color={colorScheme === 'dark' ? '#FFFFFF' : colors.tint} />
              ) : (
                <ButtonText 
                  className="font-bold"
                  style={{ 
                    color: colorScheme === 'dark' ? '#FFFFFF' : colors.tint,
                  }}
                >
                  Verify OTP
                </ButtonText>
              )}
            </Button>
            
            <Box className="flex-row justify-center mt-6">
              <Text style={{ color: colorScheme === 'dark' ? '#DDDDDD' : '#FFFFFF' }}>
                Didn't receive OTP?{' '}
              </Text>
              <TouchableOpacity disabled={isResendDisabled} onPress={handleResendOTP}>
                <Text
                  style={{
                    color: isResendDisabled 
                      ? (colorScheme === 'dark' ? '#666666' : 'rgba(255,255,255,0.5)') 
                      : (colorScheme === 'dark' ? '#A076F9' : '#FFFFFF'),
                    fontWeight: 'bold',
                  }}
                >
                  Resend {isResendDisabled ? `in ${countdown}s` : ''}
                </Text>
              </TouchableOpacity>
            </Box>
          </>
        )}
        
        <Box className="flex-row justify-center mt-8">
          <Text style={{ color: colorScheme === 'dark' ? '#DDDDDD' : '#FFFFFF' }}>
            Not a member?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
            <Text
              style={{
                color: colorScheme === 'dark' ? '#A076F9' : '#FFFFFF',
                fontWeight: 'bold',
              }}
            >
              Register membership
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default Login;
