import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from "@/components/ui/select";
import { Image } from "@/components/ui/image";
import { Pressable, ActivityIndicator, ScrollView } from "react-native";
import { X, ChevronDown, Camera, Edit2, AlertCircle } from "lucide-react-native";
import { Controller, Control } from "react-hook-form";
import * as ImagePicker from 'expo-image-picker';
import { RegisterFormData } from "@/types/register";
import { fetchGroups, Group } from "@/services/groups";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

// Country codes for dropdown
const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "Singapore" },
];

interface StepOneProps {
  control: Control<RegisterFormData>;
  errors: any;
}

export default function StepOne({ control, errors }: StepOneProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [image, setImage] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch groups from server when component mounts
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGroups();
        setGroups(data);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
        setError('Failed to load groups. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // SelectIcon component
  const SelectIcon = ({ children }: { children: React.ReactNode }) => (
    <Box className="ml-2">{children}</Box>
  );

  return (
    <Box className="w-full px-4 flex-1">
      <Text className="text-xl font-bold text-center mb-6">
        Personal Information
      </Text>

      {/* Profile Picture */}
      <Box className="items-center mb-6">
        <Controller
          control={control}
          name="profilePic"
          render={({ field: { onChange, value } }) => (
            <Pressable 
              onPress={pickImage}
              className="relative"
            >
              <Box 
                className="h-24 w-24 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-2 border-gray-300"
              >
                {image || value ? (
                  <Image 
                    source={{ uri: image || value }} 
                    className="h-full w-full" 
                    alt="Profile"
                  />
                ) : (
                  <Camera size={40} color="#666" />
                )}
              </Box>
              <Box className="absolute bottom-0 right-0 bg-black rounded-full p-2">
                <Edit2 size={16} color="white" />
              </Box>
            </Pressable>
          )}
        />
        <Text className="text-sm text-gray-500 mt-2">
          Tap to upload profile picture
        </Text>
      </Box>

      {/* Member Name */}
      <FormControl isInvalid={!!errors.name} className="mb-4">
        <FormControlLabel>
          <FormControlLabelText className="text-base font-medium mb-1">
            Full Name*
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="h-14 rounded-full bg-white border border-gray-300"
              size="md"
            >
              <InputField
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className="h-14 text-base px-5"
              />
            </Input>
          )}
        />
        {errors.name && (
          <FormControlError>
            <FormControlErrorText>{errors.name.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Phone Number */}
      <FormControl isInvalid={!!errors.phoneNumber} className="mb-4">
        <FormControlLabel>
          <FormControlLabelText className="text-base font-medium mb-1">
            Phone Number*
          </FormControlLabelText>
        </FormControlLabel>
        <Box className="flex-row w-full">
          {/* Country Code Selector */}
          <Controller
            control={control}
            name="countryCode"
            render={({ field: { onChange, value } }) => (
              <Select
                selectedValue={value}
                onValueChange={onChange}
                className="w-1/4 mr-2"
              >
                <SelectTrigger className="h-14 rounded-l-full bg-white border border-gray-300">
                  <SelectInput className="h-14 rounded-full" />
                  <SelectIcon>
                    <ChevronDown size={20} color="black" />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {countryCodes.map((country) => (
                      <SelectItem
                        key={country.code}
                        label={`${country.code} (${country.country})`}
                        value={country.code}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />

          {/* Phone Number Input */}
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="h-14 rounded-r-full flex-1 bg-white border border-gray-300"
                size="md"
              >
                <InputField
                  placeholder="Enter mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={value}
                  onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
                  onBlur={onBlur}
                  className="h-14 text-base"
                />
                {value && (
                  <InputSlot>
                    <Pressable onPress={() => onChange("")} className="pr-4">
                      <InputIcon as={X} color="black" size="md" />
                    </Pressable>
                  </InputSlot>
                )}
              </Input>
            )}
          />
        </Box>
        {errors.phoneNumber && (
          <FormControlError>
            <FormControlErrorText>{errors.phoneNumber.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Email */}
      <FormControl isInvalid={!!errors.email} className="mb-4">
        <FormControlLabel>
          <FormControlLabelText className="text-base font-medium mb-1">
            Email (Optional)
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="h-14 rounded-full bg-white border border-gray-300"
              size="md"
            >
              <InputField
                placeholder="Enter your email address"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className="h-14 text-base px-5"
              />
              {value && (
                <InputSlot>
                  <Pressable onPress={() => onChange("")} className="pr-4">
                    <InputIcon as={X} color="black" size="md" />
                  </Pressable>
                </InputSlot>
              )}
            </Input>
          )}
        />
        {errors.email && (
          <FormControlError>
            <FormControlErrorText>{errors.email.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Group */}
      <FormControl isInvalid={!!errors.group} className="mb-4">
        <FormControlLabel>
          <FormControlLabelText className="text-base font-medium mb-1">
            Group*
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="group"
          render={({ field: { onChange, value } }) => (
            <Select
              selectedValue={value}
              onValueChange={onChange}
              placeholder="Select a group"
              className="w-full"
            >
              <SelectTrigger 
                className="h-14 rounded-full bg-white border border-gray-300 flex items-center justify-between px-5"
                disabled={loading}
              >
                <SelectInput 
                  className="h-14 rounded-full" 
                  placeholder={loading ? "Loading groups..." : "Select a group"} 
                  placeholderTextColor="gray" 
                />
                <SelectIcon>
                  {loading ? (
                    <ActivityIndicator size="small" color={colorScheme === "dark" ? "#A076F9" : theme.tint} />
                  ) : (
                    <ChevronDown size={20} color="black" />
                  )}
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent style={{ maxHeight: '80%' }}>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {error ? (
                    <Box className="p-4 items-center">
                      <AlertCircle size={24} color="red" />
                      <Text className="text-center mt-2 text-red-500">{error}</Text>
                    </Box>
                  ) : groups.length === 0 && !loading ? (
                    <Box className="p-4 items-center">
                      <Text className="text-center">No groups available</Text>
                    </Box>
                  ) : (
                    <Box>
                      {groups.map((group) => (
                        <SelectItem
                          key={group._id}
                          label={group.name}
                          value={group._id}
                        />
                      ))}
                    </Box>
                  )}
                </SelectContent>
              </SelectPortal>
            </Select>
          )}
        />
        {errors.group && (
          <FormControlError>
            <FormControlErrorText>{errors.group.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
    </Box>
  );
}