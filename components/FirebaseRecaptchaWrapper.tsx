import React, { forwardRef } from 'react';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { FirebaseOptions } from 'firebase/app';

// Define the props interface
interface FirebaseRecaptchaWrapperProps {
  firebaseConfig: FirebaseOptions;
  attemptInvisibleVerification?: boolean;
  languageCode?: string;
  title?: string;
  cancelLabel?: string;
}

// Create a forwardRef wrapper component
const FirebaseRecaptchaWrapper = forwardRef<any, FirebaseRecaptchaWrapperProps>(
  (props, ref) => {
    const {
      firebaseConfig,
      attemptInvisibleVerification = true,
      languageCode = 'en',
      title = 'Verify Phone Number',
      cancelLabel = 'Cancel',
    } = props;

    // Use the component with explicitly passed props instead of relying on defaultProps
    return (
      <FirebaseRecaptchaVerifierModal
        ref={ref}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
        languageCode={languageCode}
        title={title}
        cancelLabel={cancelLabel}
      />
    );
  }
);

// Add a display name for better debugging
FirebaseRecaptchaWrapper.displayName = 'FirebaseRecaptchaWrapper';

export default FirebaseRecaptchaWrapper;
