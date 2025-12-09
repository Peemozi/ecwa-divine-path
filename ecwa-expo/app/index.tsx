import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Splash from '../src/pages/Splash';

const splashLogo = require('../src/assets/ecwa-logo.png');

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Wait for splash screen (1.5 seconds to match web)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check for token (matches web flow exactly)
      const apiToken = await AsyncStorage.getItem('apiToken');
      
      if (apiToken) {
        // User is authenticated, go to dashboard
        router.replace('/(tabs)/dashboard');
      } else {
        // User not authenticated, go to auth page (matches web)
        router.replace('/auth');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return <Splash logoSource={splashLogo} />;
}
