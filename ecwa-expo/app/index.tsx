import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Splash from '../src/pages/Splash';

const splashLogo = require('../src/assets/ecwa-logo.png');

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Wait for splash screen (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user is already authenticated
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (authToken) {
        // User is authenticated, go to dashboard
        router.replace('/(tabs)/dashboard');
      } else {
        // User not authenticated, go to verify token
        router.replace('/verify-token');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return <Splash logoSource={splashLogo} />;
}
