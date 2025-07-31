import { registerRootComponent } from 'expo';
import { Text, View } from 'react-native';
import { ExpoRoot } from 'expo-router';

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} initialRoute="/" />;
}

registerRootComponent(App); 