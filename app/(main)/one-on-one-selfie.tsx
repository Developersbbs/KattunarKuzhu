import React, { useState, useRef, useEffect } from 'react';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { StyleSheet, View, TouchableOpacity, Image, Platform, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Camera as CameraIcon, X, RotateCcw, Check, Upload, Image as ImageIcon } from 'lucide-react-native';

export default function OneOnOneSelfieScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();
  const { oneOnOneId, personName } = useLocalSearchParams();
  // Use Tamil builder-related name if personName is not provided
  const displayName = personName || 'Arulraj (Builder)';
  
  // Camera states
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Camera reference
  const cameraRef = useRef<Camera | null>(null);
  
  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  // Toggle camera type (front/back)
  const toggleCameraType = () => {
    setType(current => (current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
  };
  
  // Take a photo
  const takePhoto = async () => {
    if (cameraRef.current) {
      setIsLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        
        // Process the image (resize and compress)
        const processedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        setPhoto(processedImage.uri);
      } catch (error) {
        console.log('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Retake photo
  const retakePhoto = () => {
    setPhoto(null);
  };
  
  // Upload photo
  const uploadPhoto = async () => {
    if (!photo) return;
    
    setUploading(true);
    
    // In a real app, you would upload the photo to a server
    // For this example, we'll simulate the upload with a timeout
    setTimeout(() => {
      setUploading(false);
      Alert.alert(
        'Upload Successful',
        'Your selfie has been uploaded successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to meetings screen
              router.push("/(main)/meetings");
            },
          },
        ]
      );
    }, 2000);
  };
  
  // Go back to meetings
  const goBack = () => {
    router.back();
  };
  
  // Render loading state
  if (hasPermission === null) {
    return (
      <Box className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={theme.tint} />
        <Text className="mt-4" style={{ color: theme.text }}>Requesting camera permission...</Text>
      </Box>
    );
  }
  
  // Render permission denied state
  if (hasPermission === false) {
    return (
      <Box className="flex-1 p-4">
        <Stack.Screen options={{ 
          title: "Upload Selfie",
        }} />
        
        <Box className="flex-1 items-center justify-center">
          <CameraIcon size={60} color={theme.text} style={{ opacity: 0.5 }} />
          <Text className="text-xl font-bold mt-4 text-center" style={{ color: theme.text }}>
            Camera Permission Required
          </Text>
          <Text className="text-center mt-2" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
            Please enable camera access in your device settings to take a selfie.
          </Text>
          <Button
            className="mt-6 w-full h-12"
            style={{ backgroundColor: theme.tint }}
            onPress={goBack}
          >
            <ButtonText style={{ color: "#FFFFFF" }}>Go Back</ButtonText>
          </Button>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box className="flex-1">
      <Stack.Screen options={{ 
        title: "Upload Selfie",
        headerLeft: () => (
          <TouchableOpacity onPress={goBack}>
            <X size={24} color={theme.text} />
          </TouchableOpacity>
        )
      }} />
      
      <Box className="flex-1">
        {/* Meeting info */}
        <Box className="p-4">
          <Text className="text-lg font-semibold" style={{ color: theme.text }}>
            One-on-One with {displayName}
          </Text>
          <Text className="text-xs mt-1" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
            (Eg: Arulraj (Builder), Karthikeyan (Painter), Selvi (Interior Decorator))
          </Text>
          <Text className="text-sm" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}>
            Take a selfie to confirm your meeting with your builder or service provider
          </Text>
        </Box>
        
        {/* Camera or Photo Preview */}
        <Box className="flex-1 mx-4 mb-4 overflow-hidden rounded-xl">
          {photo ? (
            // Photo preview
            <Image
              source={{ uri: photo }}
              style={styles.camera}
              resizeMode="cover"
            />
          ) : (
            // Camera
            <Camera
              ref={cameraRef}
              type={type}
              style={styles.camera}
              ratio="16:9"
            >
              {isLoading && (
                <Box className="absolute inset-0 items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </Box>
              )}
            </Camera>
          )}
        </Box>
        
        {/* Controls */}
        <Box className="p-4 flex-row items-center justify-between">
          {photo ? (
            // Photo taken - show retake and upload buttons
            <>
              <TouchableOpacity
                className="items-center justify-center w-16 h-16 rounded-full"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(244, 67, 54, 0.2)" : "rgba(244, 67, 54, 0.1)",
                }}
                onPress={retakePhoto}
              >
                <RotateCcw size={28} color={colorScheme === "dark" ? "#F44336" : "#C62828"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                className="items-center justify-center w-16 h-16 rounded-full"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)",
                }}
                onPress={uploadPhoto}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color={colorScheme === "dark" ? "#4CAF50" : "#2E7D32"} />
                ) : (
                  <Upload size={28} color={colorScheme === "dark" ? "#4CAF50" : "#2E7D32"} />
                )}
              </TouchableOpacity>
            </>
          ) : (
            // Camera mode - show flip and capture buttons
            <>
              <TouchableOpacity
                className="items-center justify-center w-16 h-16 rounded-full"
                style={{
                  backgroundColor: colorScheme === "dark" ? "rgba(33, 150, 243, 0.2)" : "rgba(33, 150, 243, 0.1)",
                }}
                onPress={toggleCameraType}
              >
                <RotateCcw size={28} color={colorScheme === "dark" ? "#2196F3" : "#0D47A1"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                className="items-center justify-center w-16 h-16 rounded-full"
                style={{
                  backgroundColor: theme.tint,
                }}
                onPress={takePhoto}
                disabled={isLoading}
              >
                <CameraIcon size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%',
  },
}); 