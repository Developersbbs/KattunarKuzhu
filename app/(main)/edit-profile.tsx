import React, { useState, useEffect, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { ScrollView } from "@/components/ui/scroll-view";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { FormControl } from "@/components/ui/form-control";
import { FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { FormControlError, FormControlErrorText } from "@/components/ui/form-control";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectInput, SelectIcon } from "@/components/ui/select";
import { SelectPortal, SelectBackdrop, SelectContent } from "@/components/ui/select";
import { SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";
import { Spinner } from "@/components/ui/spinner";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { useToast } from "@/components/ui/toast";
import { 
  Image,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ChevronDown, Camera, Upload, ArrowLeft, Save } from "lucide-react-native";
import { getUserProfile, updateUserProfile, UserProfile, UpdateProfileData } from "@/services/user";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import LocationSearchInput from "@/components/LocationSearchInput";

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalData, setOriginalData] = useState<UserProfile | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    businessCategory: "",
    businessAddress: "",
    businessLocation: {
      address: "",
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    businessPhone: "",
    businessEmail: "",
    businessWebsite: "",
    businessDescription: "",
    profileImageUrl: "",
    logoUrl: "",
    coverImageUrl: "",
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    businessName: "",
    businessCategory: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    businessWebsite: "",
  });
  
  // Images
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);

  // Business categories
  const categories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Food & Beverage",
    "Manufacturing",
    "Real Estate",
    "Marketing",
    "Other",
  ];

  // Load user profile on mount
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setIsLoading(true);
        const profile = await getUserProfile();
        setOriginalData(profile);
        
        // Populate form data
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          profileImageUrl: profile.profileImageUrl || "",
          businessName: profile.business?.name || "",
          businessCategory: profile.business?.category || "",
          businessAddress: profile.business?.address || "",
          businessLocation: {
            address: profile.business?.address || "",
            coordinates: {
              // Default coordinates to center of India if not available
              latitude: 20.5937,
              longitude: 78.9629
            }
          },
          businessPhone: profile.business?.phoneNumber || profile.phoneNumber || "",
          businessEmail: profile.business?.email || profile.email || "",
          businessWebsite: profile.business?.website || "",
          businessDescription: profile.business?.description || "",
          logoUrl: profile.business?.logoUrl || "",
          coverImageUrl: profile.business?.coverImageUrl || "",
        });
        
        // Set default images from fetched URLs or placeholders
        setProfileImage(profile.profileImageUrl || "https://placekitten.com/300/300");
        setCoverImage(profile.business?.coverImageUrl || "https://marketplace.canva.com/EAECJXaRRew/3/0/1600w/canva-do-what-is-right-starry-sky-facebook-cover-4SpKW5MtQl4.jpg");
        setBusinessLogo(profile.business?.logoUrl || "https://img.freepik.com/free-vector/quill-pen-logo-template_23-2149852429.jpg?semt=ais_hybrid&w=740&q=80");
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => {
            return (
              <Toast nativeID={id} action="error" variant="solid">
                <ToastTitle>Error Loading Profile</ToastTitle>
                <ToastDescription>Unable to load your profile. Please try again later.</ToastDescription>
              </Toast>
            );
          },
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserProfile();
  }, [user?.uid]);

  // Handle form input changes
  const handleChange = (name: string, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Simulate uploading an image and return a mock URL
  const uploadImage = async (uri: string): Promise<string> => {
    console.log(`Simulating upload for image: ${uri}`);
    // In a real app, you would upload to a service like Firebase Storage or S3
    // For this demo, we'll just return a placeholder URL after a short delay
    return new Promise(resolve => {
      setTimeout(() => {
        // Create a dynamic placeholder URL to show a different image
        const randomId = Math.floor(Math.random() * 1000);
        const mockUrl = `https://placekitten.com/400/${400 + randomId}`;
        console.log(`"Upload" complete. Mock URL: ${mockUrl}`);
        resolve(mockUrl);
      }, 1500); // Simulate 1.5 second upload time
    });
  };

  // Handle profile image selection
  const handlePickProfileImage = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => {
            return (
              <Toast nativeID={id} action="warning" variant="solid">
                <ToastTitle>Permission Required</ToastTitle>
                <ToastDescription>Permission to access media is required to change your profile picture.</ToastDescription>
              </Toast>
            );
          },
        });
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri); // Show local image immediately
        const uploadedUrl = await uploadImage(result.assets[0].uri);
        handleChange("profileImageUrl", uploadedUrl); // Save the uploaded URL to form state
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };
  
  // Handle business logo selection
  const handlePickBusinessLogo = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => {
            return (
              <Toast nativeID={id} action="warning" variant="solid">
                <ToastTitle>Permission Required</ToastTitle>
                <ToastDescription>Permission to access media is required to change your business logo.</ToastDescription>
              </Toast>
            );
          },
        });
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setBusinessLogo(result.assets[0].uri); // Show local image immediately
        const uploadedUrl = await uploadImage(result.assets[0].uri);
        handleChange("logoUrl", uploadedUrl); // Save the uploaded URL to form state
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };
  
  // Handle cover image selection
  const handlePickCoverImage = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => {
            return (
              <Toast nativeID={id} action="warning" variant="solid">
                <ToastTitle>Permission Required</ToastTitle>
                <ToastDescription>Permission to access media is required to change your cover image.</ToastDescription>
              </Toast>
            );
          },
        });
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setCoverImage(result.assets[0].uri); // Show local image immediately
        const uploadedUrl = await uploadImage(result.assets[0].uri);
        handleChange("coverImageUrl", uploadedUrl); // Save the uploaded URL to form state
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      email: "",
      businessName: "",
      businessCategory: "",
      businessAddress: "",
      businessPhone: "",
      businessEmail: "",
      businessWebsite: "",
    };
    
    let isValid = true;
    
    // Required fields from backend schema
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    // Email validation (unique in backend)
    if (formData.email.trim()) {
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = "Please enter a valid email";
        isValid = false;
      } else if (formData.email !== originalData?.email) {
        // Only validate uniqueness if email changed
        console.log('Email changed, should check uniqueness with backend');
      }
    }
    
    // Required business fields
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
      isValid = false;
    }
    
    if (!formData.businessCategory.trim()) {
      newErrors.businessCategory = "Please select a business category";
      isValid = false;
    }
    
    if (!formData.businessLocation.address.trim()) {
      newErrors.businessAddress = "Business address is required";
      isValid = false;
    }
    
    // Optional field validations
    if (formData.businessPhone.trim()) {
      if (!formData.businessPhone.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)) {
        newErrors.businessPhone = "Please enter a valid phone number";
        isValid = false;
      }
    }
    
    if (formData.businessEmail.trim()) {
      if (!formData.businessEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.businessEmail = "Please enter a valid business email";
        isValid = false;
      }
    }
    
    if (formData.businessWebsite.trim()) {
      // Allow URLs with or without protocol
      const urlPattern = /^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i;
      if (!formData.businessWebsite.match(urlPattern)) {
        newErrors.businessWebsite = "Please enter a valid website URL";
        isValid = false;
      }
    }
    
    // Validate coordinates if location selected
    if (formData.businessLocation.coordinates) {
      const { latitude, longitude } = formData.businessLocation.coordinates;
      if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
          latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        newErrors.businessAddress = "Invalid location coordinates";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;
    
    try {
      setIsSaving(true);
      
      // Only include changed fields in the update
      const updateData: UpdateProfileData = {
        name: formData.name !== originalData?.name ? formData.name : undefined,
        email: formData.email !== originalData?.email ? formData.email : undefined,
        profileImageUrl: formData.profileImageUrl !== originalData?.profileImageUrl ? formData.profileImageUrl : undefined,
      };
      
      // Check if any business fields changed
      const businessChanged = (
        formData.businessName !== originalData?.business?.name ||
        formData.businessCategory !== originalData?.business?.category ||
        formData.businessLocation.address !== originalData?.business?.address ||
        formData.businessPhone !== originalData?.business?.phoneNumber ||
        formData.businessEmail !== originalData?.business?.email ||
        formData.businessWebsite !== originalData?.business?.website ||
        formData.businessDescription !== originalData?.business?.description ||
        formData.logoUrl !== originalData?.business?.logoUrl ||
        formData.coverImageUrl !== originalData?.business?.coverImageUrl ||
        JSON.stringify(formData.businessLocation.coordinates) !== JSON.stringify(originalData?.business?.coordinates)
      );
      
      if (businessChanged) {
        updateData.business = {
          name: formData.businessName,
          category: formData.businessCategory,
          address: formData.businessLocation.address,
          coordinates: formData.businessLocation.coordinates,
          phoneNumber: formData.businessPhone || undefined,
          email: formData.businessEmail || undefined,
          website: formData.businessWebsite || undefined,
          description: formData.businessDescription || undefined,
          logoUrl: formData.logoUrl || undefined,
          coverImageUrl: formData.coverImageUrl || undefined,
        };
      }
      
      // Check if there is anything to update
      const hasUserChanges = Object.values(updateData).some(v => v !== undefined && typeof v !== 'object');
      const hasBusinessChanges = updateData.business && Object.values(updateData.business).some(v => v !== undefined);

      if (!hasUserChanges && !hasBusinessChanges) {
        toast.show({
          placement: "top",
          render: ({ id }: { id: string }) => {
            return (
              <Toast nativeID={id} action="info" variant="solid">
                <ToastTitle>No Changes</ToastTitle>
                <ToastDescription>There are no changes to save.</ToastDescription>
              </Toast>
            );
          },
        });
        setIsSaving(false);
        return;
      }
      
      console.log('Submitting profile update:', updateData);
      
      // Call the API to update the profile
      const updatedProfile = await updateUserProfile(updateData);
      console.log('✅ Profile update API call successful. Received updated profile:', updatedProfile);
      
      // Update the original data to reflect changes
      setOriginalData(updatedProfile);
      
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => {
          return (
            <Toast nativeID={id} action="success" variant="solid">
              <ToastTitle>Profile Updated</ToastTitle>
              <ToastDescription>Your profile has been successfully updated.</ToastDescription>
            </Toast>
          );
        },
      });
      
      // Navigate back to profile page after success
      setTimeout(() => {
        router.back();
      }, 1000);
      
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      
      // Handle specific error cases
      let errorMessage = "Unable to update your profile. Please try again later.";
      
      if (error.response?.status === 409) {
        // Conflict - likely duplicate email
        errorMessage = "This email address is already in use. Please use a different email.";
      } else if (error.response?.status === 400) {
        // Validation error
        errorMessage = error.response.data.message || "Please check your input and try again.";
      } else if (error.response?.status === 404) {
        // Not found - user or business doesn't exist
        errorMessage = "Your profile information could not be found. Please try logging in again.";
      }
      
      toast.show({
        placement: "top",
        render: ({ id }: { id: string }) => {
          return (
            <Toast nativeID={id} action="error" variant="solid">
              <ToastTitle>Update Failed</ToastTitle>
              <ToastDescription>{errorMessage}</ToastDescription>
            </Toast>
          );
        },
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Go back to profile page
  const handleGoBack = (): void => {
    router.back();
  };

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <Spinner size="large" color={theme.tint} />
        <Text className="mt-4 text-lg" style={{ color: theme.text }}>Loading your profile...</Text>
      </Box>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
        <Box className="p-4 flex-row items-center">
          <TouchableOpacity onPress={handleGoBack} className="p-2 rounded-full bg-white/20">
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text className="text-xl font-bold ml-4" style={{ color: theme.text }}>Edit Profile</Text>
        </Box>
        
        {/* Cover Image */}
        <Box className="w-full h-[120px] relative">
          <Image
            source={{ uri: coverImage || "https://via.placeholder.com/800x400" }}
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
          <TouchableOpacity 
            onPress={handlePickCoverImage}
            className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full"
          >
            <Camera size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Box>
        
        {/* Profile Image */}
        <Box className="items-center -mt-16">
          <Box className="w-32 h-32 rounded-full border-4 border-white relative overflow-hidden">
            <Image
              source={{ uri: profileImage || "https://via.placeholder.com/300" }}
              className="w-full h-full"
              style={{ resizeMode: "cover" }}
            />
            <TouchableOpacity 
              onPress={handlePickProfileImage}
              className="absolute bottom-0 w-full bg-black/50 py-2 items-center"
            >
              <Upload size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Box>
        </Box>
        
        {/* Form */}
        <Box className="px-4 py-6">
          <VStack space="lg">
            {/* Personal Information Section */}
            <Box className="mb-6">
              <Text className="text-lg font-bold mb-4" style={{ color: theme.text }}>
                Personal Information
              </Text>
              
              {/* Name */}
              <FormControl isRequired isInvalid={!!errors.name} className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText style={{ color: theme.text }}>Name</FormControlLabelText>
                </FormControlLabel>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-white/10 rounded-full h-14"
                >
                  <InputField
                    value={formData.name}
                    onChangeText={(value) => handleChange("name", value)}
                    placeholder="Your full name"
                    style={{ color: theme.text }}
                  />
                </Input>
                {errors.name ? (
                  <FormControlError>
                    <FormControlErrorText>{errors.name}</FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              
              {/* Email */}
              <FormControl isInvalid={!!errors.email} className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText style={{ color: theme.text }}>Email</FormControlLabelText>
                </FormControlLabel>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-white/10 rounded-full h-14"
                >
                  <InputField
                    value={formData.email}
                    onChangeText={(value) => handleChange("email", value)}
                    placeholder="your.email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ color: theme.text }}
                  />
                </Input>
                {errors.email ? (
                  <FormControlError>
                    <FormControlErrorText>{errors.email}</FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
            </Box>
            
            <Divider />
            
            {/* Business Information Section */}
            <Box className="mt-6">
              <Text className="text-lg font-bold mb-4" style={{ color: theme.text }}>
                Business Information
              </Text>
              
              {/* Business Logo */}
              <Box className="flex-row items-center mb-6">
                <Box className="mr-4">
                  <Box className="w-16 h-16 rounded-2xl overflow-hidden">
                    <Image
                      source={{ uri: businessLogo || "https://via.placeholder.com/100" }}
                      className="w-full h-full"
                      style={{ resizeMode: "cover" }}
                    />
                  </Box>
                </Box>
                <Box className="flex-1">
                  <Text className="text-sm mb-2" style={{ color: theme.text }}>Business Logo</Text>
                  <TouchableOpacity 
                    onPress={handlePickBusinessLogo}
                    className="bg-gray-200 py-2 px-4 rounded-full flex-row items-center"
                  >
                    <Upload size={16} color={colorScheme === "dark" ? "#333" : "#666"} />
                    <Text className="ml-2" style={{ color: colorScheme === "dark" ? "#333" : "#666" }}>
                      Choose Image
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Box>
              
              {/* Business Name */}
              <FormControl isRequired isInvalid={!!errors.businessName} className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText style={{ color: theme.text }}>Business Name</FormControlLabelText>
                </FormControlLabel>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-white/10 rounded-full h-14"
                >
                  <InputField
                    value={formData.businessName}
                    onChangeText={(value) => handleChange("businessName", value)}
                    placeholder="Your business name"
                    style={{ color: theme.text }}
                  />
                </Input>
                {errors.businessName ? (
                  <FormControlError>
                    <FormControlErrorText>{errors.businessName}</FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              
              {/* Business Category */}
              <FormControl isRequired isInvalid={!!errors.businessCategory} className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText style={{ color: theme.text }}>Business Category</FormControlLabelText>
                </FormControlLabel>
                <Select
                  onValueChange={(value) => handleChange("businessCategory", value)}
                  selectedValue={formData.businessCategory}
                >
                  <SelectTrigger
                    variant="outline"
                    size="md"
                    className="bg-white/10 rounded-full h-14"
                  >
                    <SelectInput 
                      placeholder="Select a category"
                      style={{ color: theme.text }}
                    />
                    <SelectIcon style={{ marginRight: 12 }}>
                      <Icon as={ChevronDown} />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {categories.map((category) => (
                        <SelectItem key={category} label={category} value={category} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
                {errors.businessCategory ? (
                  <FormControlError>
                    <FormControlErrorText>{errors.businessCategory}</FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              
              {/* Business Location */}
              <FormControl className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText style={{ color: theme.text }}>Business Location</FormControlLabelText>
                </FormControlLabel>
                <LocationSearchInput
                  initialAddress={formData.businessLocation.address}
                  onLocationSelect={(location) => {
                    setFormData(prev => ({
                      ...prev,
                      businessLocation: location,
                      businessAddress: location.address // Keep this for backward compatibility
                    }));
                  }}
                  placeholder="Search for your business address"
                  backgroundColor={colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
                  textColor={theme.text}
                  iconColor={theme.tint}
                />
              </FormControl>
              
              {/* Business Phone */}
              <FormControl isInvalid={!!errors.businessPhone} className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText style={{ color: theme.text }}>Business Phone</FormControlLabelText>
                </FormControlLabel>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-white/10 rounded-full h-14"
                >
                  <InputField
                    value={formData.businessPhone}
                    onChangeText={(value) => handleChange("businessPhone", value)}
                    placeholder="+1 234 567 8900"
                    keyboardType="phone-pad"
                    style={{ color: theme.text }}
                  />
                </Input>
                {errors.businessPhone ? (
                  <FormControlError>
                    <FormControlErrorText>{errors.businessPhone}</FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              
              {/* Business Email */}
              <FormControl isInvalid={!!errors.businessEmail} className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText style={{ color: theme.text }}>Business Email</FormControlLabelText>
                </FormControlLabel>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-white/10 rounded-full h-14"
                >
                  <InputField
                    value={formData.businessEmail}
                    onChangeText={(value) => handleChange("businessEmail", value)}
                    placeholder="business@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ color: theme.text }}
                  />
                </Input>
                {errors.businessEmail ? (
                  <FormControlError>
                    <FormControlErrorText>{errors.businessEmail}</FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              
              {/* Business Website */}
              <FormControl isInvalid={!!errors.businessWebsite} className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText style={{ color: theme.text }}>Business Website</FormControlLabelText>
                </FormControlLabel>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-white/10 rounded-full h-14"
                >
                  <InputField
                    value={formData.businessWebsite}
                    onChangeText={(value) => handleChange("businessWebsite", value)}
                    placeholder="www.yourbusiness.com"
                    autoCapitalize="none"
                    style={{ color: theme.text }}
                  />
                </Input>
                {errors.businessWebsite ? (
                  <FormControlError>
                    <FormControlErrorText>{errors.businessWebsite}</FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              
              {/* Business Description */}
              <FormControl className="mb-6">
                <FormControlLabel>
                  <FormControlLabelText style={{ color: theme.text }}>Business Description</FormControlLabelText>
                </FormControlLabel>
                <Textarea
                  size="md"
                  className="bg-white/10 rounded-2xl h-32"
                >
                  <TextareaInput
                    value={formData.businessDescription}
                    onChangeText={(value) => handleChange("businessDescription", value)}
                    placeholder="Describe your business, services, and unique value proposition..."
                    style={{ color: theme.text }}
                  />
                </Textarea>
              </FormControl>
            </Box>
          </VStack>
          
          {/* Submit Buttons */}
          <HStack space="md" className="mt-8">
            <Button
              variant="outline"
              className="flex-1 border-2 rounded-full h-16"
              style={{ borderColor: theme.tint }}
              onPress={handleGoBack}
            >
              <ButtonText style={{ color: theme.tint }}>Cancel</ButtonText>
            </Button>
            <Button
              variant="solid"
              className="flex-1 rounded-full h-16"
              style={{ backgroundColor: theme.tint }}
              onPress={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? (
                <Spinner color="white" size="small" />
              ) : (
                <HStack space="xs" style={{ alignItems: "center" }}>
                  <Save size={18} color="white" />
                  <ButtonText>Save Changes</ButtonText>
                </HStack>
              )}
            </Button>
          </HStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
