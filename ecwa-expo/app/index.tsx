import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'expo-router';

import Splash from '../src/pages/Splash';
import { getAccessToken, isTokenExpired, removeTokens, updateLastActivity, userApi } from '../src/lib/api';
import { useAppState } from '@/src/lib/app-state-manager';

const splashLogo = require('../src/assets/ecwa-logo.png');

// Global flag to ensure navigation only happens once across all instances
let globalNavigationLock = false;

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const { restoreAppState } = useAppState();
  const hasNavigated = useRef(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only run if we're actually on the index route
    if (pathname !== '/') {
      return;
    }

    // Prevent multiple executions - both local and global
    if (hasNavigated.current || globalNavigationLock || isInitialized.current) {
      return;
    }
    
    isInitialized.current = true;
    globalNavigationLock = true;
    let isMounted = true;
    
    const checkAuthAndRedirect = async () => {
      try {
        // Wait for splash screen (1.5 seconds to match web)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (!isMounted || hasNavigated.current) {
          globalNavigationLock = false;
          return;
        }
        
        // Check for access token
        const accessToken = await getAccessToken();
        
        if (!isMounted || hasNavigated.current) {
          globalNavigationLock = false;
          return;
        }
        
        if (accessToken) {
          // User has a token, check if it's expired (30 days inactivity)
          const expired = await isTokenExpired();
          
          if (!isMounted || hasNavigated.current) {
            globalNavigationLock = false;
            return;
          }
          
          if (expired) {
            // Token expired due to inactivity, remove tokens and require login
            await removeTokens();
            if (isMounted && !hasNavigated.current) {
              hasNavigated.current = true;
              router.replace('/auth');
            }
            globalNavigationLock = false;
            return;
          }
          
          // Token is valid, update last activity
          try {
            await updateLastActivity();
          } catch (_error) {
            // Ignore update activity errors
          }
          
          if (!isMounted || hasNavigated.current) {
            globalNavigationLock = false;
            return;
          }
          
          // Try to restore previous navigation state (if app was killed)
          let savedState = null;
          try {
            savedState = await restoreAppState();
          } catch (_error) {
            // If restore fails, continue with default navigation
          }
          
          if (!isMounted || hasNavigated.current) {
            globalNavigationLock = false;
            return;
          }
          
          if (savedState && savedState.pathname && savedState.pathname !== '/') {
            // Check if saved pathname is within tabs group
            const isTabRoute = savedState.pathname.startsWith('/(tabs)/') || 
                              savedState.pathname === '/dashboard' ||
                              savedState.pathname === '/manuals' ||
                              savedState.pathname === '/hymns' ||
                              savedState.pathname === '/quiz' ||
                              savedState.pathname === '/more' ||
                              savedState.pathname === '/profile' ||
                              savedState.pathname === '/payment-history' ||
                              savedState.pathname === '/settings' ||
                              savedState.pathname === '/help-support' ||
                              savedState.pathname === '/about';
            
            // Convert old routes to tab routes if needed
            let targetPath = savedState.pathname;
            if (targetPath === '/dashboard') targetPath = '/(tabs)/dashboard';
            else if (targetPath === '/manuals') targetPath = '/(tabs)/manuals';
            else if (targetPath === '/hymns') targetPath = '/(tabs)/hymns';
            else if (targetPath === '/quiz') targetPath = '/(tabs)/quiz';
            else if (targetPath === '/more') targetPath = '/(tabs)/more';
            else if (targetPath === '/profile') targetPath = '/(tabs)/profile';
            else if (targetPath === '/payment-history') targetPath = '/(tabs)/payment-history';
            else if (targetPath === '/settings') targetPath = '/(tabs)/settings';
            else if (targetPath === '/help-support') targetPath = '/(tabs)/help-support';
            else if (targetPath === '/about') targetPath = '/(tabs)/about';
            else if (!isTabRoute) targetPath = '/(tabs)/dashboard';
            
            hasNavigated.current = true;
            
            // Navigate with params if available
            if (Object.keys(savedState.params).length > 0) {
              router.replace({
                pathname: targetPath as any,
                params: savedState.params,
              });
            } else {
              router.replace(targetPath as any);
            }
          } else {
            // No saved state, go to dashboard
            hasNavigated.current = true;
            
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
          if (isMounted && !hasNavigated.current) {
            hasNavigated.current = true;
            router.replace('/auth');
          }
        }
        
        globalNavigationLock = false;
      } catch (_error) {
        // If there's an error, default to auth page
        if (isMounted && !hasNavigated.current) {
          hasNavigated.current = true;
          router.replace('/auth');
        }
        globalNavigationLock = false;
      }
    };

    checkAuthAndRedirect();
    
    return () => {
      isMounted = false;
      // Don't reset globalNavigationLock here - let it reset after navigation completes
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <Splash logoSource={splashLogo} />;
}
