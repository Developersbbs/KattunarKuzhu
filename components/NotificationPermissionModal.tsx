import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Modal, ModalBackdrop, ModalContent, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { VStack } from '@/components/ui/vstack';
import { Link, LinkText } from '@/components/ui/link';
import { Box } from './ui/box';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
}

const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  isOpen,
  onClose,
  onAllow,
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'text');
  const linkColor = useThemeColor({}, 'accent');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent className={"rounded-3xl"} style={{ backgroundColor }}>
        <ModalBody>
          <VStack className="my-4" space="md" style={{ alignItems: 'center' }}>
            <Image
              source={require('../assets/images/notification-request.png')}
              alt="Notification Request Image"
              style={{ width: 300, height: 300, marginBottom: 16 }}
            />
            <Heading style={{ color: textColor }}>Stay in the Loop</Heading>
            <Text style={{ textAlign: 'center', color: secondaryTextColor }}>
              Enable notifications to receive updates on your network, projects, and direct
              messages.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <VStack space="md" style={{ width: '100%' }}>
            <Button onPress={onAllow} size="lg" className='rounded-full'>
              <ButtonText>Allow Notifications</ButtonText>
            </Button>
            <Box className='w-full flex items-center'>
              <Link onPress={onClose}>
                <LinkText style={{ color: linkColor }}>Skip for Now</LinkText>
              </Link>
            </Box>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NotificationPermissionModal;