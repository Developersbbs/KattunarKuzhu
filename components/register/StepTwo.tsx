import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from "@/components/ui/select";
import { Pressable } from "react-native";
import { X, ChevronDown } from "lucide-react-native";
import { Controller, Control } from "react-hook-form";
import { RegisterFormData, LocationData } from "@/types/register";
import LocationSearchInput from "@/components/LocationSearchInput";

// Business categories for dropdown
const businessCategories = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Retail" },
  { id: "3", name: "Food & Beverage" },
  { id: "4", name: "Healthcare" },
  { id: "5", name: "Education" },
  { id: "6", name: "Finance" },
  { id: "7", name: "Manufacturing" },
  { id: "8", name: "Services" },
  { id: "9", name: "Other" },
];

interface StepTwoProps {
  control: Control<RegisterFormData>;
  errors: any;
  setValue: (name: keyof RegisterFormData, value: any) => void;
}

export default function StepTwo({ control, errors, setValue }: StepTwoProps) {
  
  // SelectIcon component
  const SelectIcon = ({ children }: { children: React.ReactNode }) => (
    <Box className="ml-2">{children}</Box>
  );

  return (
    <Box className="w-full px-4 flex-1">
      <Text className="text-xl font-bold text-center mb-6">
        Business Information
      </Text>

      {/* Business Name */}
      <FormControl isInvalid={!!errors.businessName} className="mb-4">
        <FormControlLabel>
          <FormControlLabelText className="text-base font-medium mb-1">
            Business Name*
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="businessName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="h-14 rounded-full bg-white border border-gray-300"
              size="md"
            >
              <InputField
                placeholder="Enter business name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className="h-14 text-base"
              />
            </Input>
          )}
        />
        {errors.businessName && (
          <FormControlError>
            <FormControlErrorText>{errors.businessName.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Business Category */}
      <FormControl isInvalid={!!errors.businessCategory} className="mb-4">
        <FormControlLabel>
          <FormControlLabelText className="text-base font-medium mb-1">
            Business Category*
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="businessCategory"
          render={({ field: { onChange, value } }) => (
            <Select
              selectedValue={value}
              onValueChange={onChange}
              placeholder="Select business category"
              className="w-full"
            >
              <SelectTrigger className="h-14 rounded-full bg-white border border-gray-300 flex items-center justify-between pr-5 pl-2">
                <SelectInput className="h-14 rounded-full" placeholder="Select business category" placeholderTextColor="gray" defaultValue="1" />
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
                  {businessCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      label={category.name}
                      value={category.id}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          )}
        />
        {errors.businessCategory && (
          <FormControlError>
            <FormControlErrorText>{errors.businessCategory.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Business Phone */}
      <FormControl isInvalid={!!errors.businessPhone} className="mb-4">
        <FormControlLabel>
          <FormControlLabelText className="text-base font-medium mb-1">
            Business Phone (Optional)
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="businessPhone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="h-14 rounded-full bg-white border border-gray-300"
              size="md"
            >
              <InputField
                placeholder="Enter business phone number"
                keyboardType="phone-pad"
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
        {errors.businessPhone && (
          <FormControlError>
            <FormControlErrorText>{errors.businessPhone.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Business Email */}
      <FormControl isInvalid={!!errors.businessEmail} className="mb-4">
        <FormControlLabel>
          <FormControlLabelText className="text-base font-medium mb-1">
            Business Email (Optional)
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="businessEmail"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="h-14 rounded-full bg-white border border-gray-300"
              size="md"
            >
              <InputField
                placeholder="Enter business email"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
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
        {errors.businessEmail && (
          <FormControlError>
            <FormControlErrorText>{errors.businessEmail.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Business Location with Google Places */}
      <FormControl isInvalid={!!errors.businessLocation} className="mb-4">
        <FormControlLabel>
          <FormControlLabelText className="text-base font-medium mb-1">
            Business Location*
          </FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="businessLocation"
          render={({ field: { onChange, value } }) => {
            return (
              <LocationSearchInput
                initialAddress={value}
                onLocationSelect={(location) => {
                  
                  // Store the address in the original field for backward compatibility
                  onChange(location.address);
                  
                  // Also store the full location data with coordinates
                  setValue('businessLocationData', location as LocationData);
                }}
                placeholder="Search for your business location"
                backgroundColor="white"
                textColor="black"
                iconColor="#666"
              />
            );
          }}
        />
        {errors.businessLocation && (
          <FormControlError>
            <FormControlErrorText>{errors.businessLocation.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
    </Box>
  );
}