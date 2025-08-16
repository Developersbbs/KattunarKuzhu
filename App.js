import { registerRootComponent } from 'expo';
import { Text, View, LogBox } from 'react-native';
import { ExpoRoot } from 'expo-router';

// Ignore a specific warning message
LogBox.ignoreLogs([
  'FirebaseRecaptcha: Support for defaultProps will be removed from function components in a future major release.'
]);

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} initialRoute="/" />;
}

registerRootComponent(App); 