import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import Splash from '../src/pages/Splash';
import { getAccessToken, isTokenExpired, removeTokens, updateLastActivity, userApi } from '../src/lib/api';

const splashLogo = require('../src/assets/ecwa-logo.png');

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Wait for splash screen (1.5 seconds to match web)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check for access token
      const accessToken = await getAccessToken();
      
      if (accessToken) {
        // User has a token, check if it's expired (30 days inactivity)
        const expired = await isTokenExpired();
        
        if (expired) {
          // Token expired due to inactivity, remove tokens and require login
          await removeTokens();
          router.replace('/auth');
        } else {
          // Token is valid, update last activity
          await updateLastActivity();
          
          // Pre-fetch dashboard data immediately for logged-in users
          // This ensures data is ready when dashboard component mounts
          userApi.getDashboard().catch(() => {
            // Silently fail - dashboard component will retry
          });
          
          // Navigate to dashboard
          router.replace('/(tabs)/dashboard');
        }
      } else {
        // User not authenticated, go to auth page
        router.replace('/auth');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return <Splash logoSource={splashLogo} />;
}
