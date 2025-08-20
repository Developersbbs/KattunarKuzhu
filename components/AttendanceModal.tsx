import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { X } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import MapView, { Marker } from 'react-native-maps';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  meetingLocation: { latitude: number; longitude: number };
  userLocation: { latitude: number; longitude: number };
  distance: number;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  meetingLocation,
  userLocation,
  distance,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box
        style={{
          backgroundColor: theme.background,
          borderRadius: 24,
          width: '90%',
          maxHeight: '80%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: colorScheme === 'dark' ? 0.5 : 0.2,
          shadowRadius: 20,
          elevation: 10,
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            backgroundColor: theme.tint,
            paddingVertical: 20,
            paddingHorizontal: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            Confirm Attendance
          </Text>
          <Button
            onPress={onClose}
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 999,
              padding: 4,
            }}
          >
            <X size={20} color="#FFFFFF" />
          </Button>
        </Box>
        <Box style={{ padding: 24 }}>
          <Text>Date & Time: {new Date().toLocaleString()}</Text>
          <Text>Distance from meeting: {distance.toFixed(2)} km</Text>
          <MapView
            style={{ height: 200, marginTop: 16 }}
            initialRegion={{
              ...userLocation,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={userLocation} title="Your Location" />
            <Marker
              coordinate={meetingLocation}
              title="Meeting Location"
              pinColor="blue"
            />
          </MapView>
          <Button onPress={onConfirm} style={{ marginTop: 24 }}>
            <ButtonText>Confirm Attendance</ButtonText>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AttendanceModal;