// Ensure React Native core polyfills (including global console) are
// installed before any other modules execute.
import 'react-native/Libraries/Core/InitializeCore';

// Hand off to Expo Router’s standard entry.
import 'expo-router/entry';

