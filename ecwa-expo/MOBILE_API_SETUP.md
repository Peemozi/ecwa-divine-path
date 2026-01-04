# Mobile API Setup Guide

## Problem: Network Request Failed on Mobile

When testing on Expo Go, you may see "NETWORK REQUEST FAILED" errors because the app is trying to connect to `localhost`, which doesn't work on mobile devices.

## Solution: Use Your Computer's IP Address

### Step 1: Find Your Computer's IP Address

**Windows:**
1. Open Command Prompt or PowerShell
2. Run: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.x.x.x)

**Mac/Linux:**
1. Open Terminal
2. Run: `ifconfig` or `ip addr`
3. Look for your local IP address (usually starts with 192.168.x.x or 10.x.x.x)

### Step 2: Update API URL

**Good News:** The app now automatically detects your computer's IP address when running on mobile devices! 

However, if automatic detection doesn't work, you have these options:

#### Option A: Manual IP Override (Easiest)

1. Find your computer's IP address (see Step 1 above)
2. Set an environment variable when starting Expo:
   ```bash
   # Windows PowerShell
   $env:EXPO_PUBLIC_API_IP="192.168.1.100"; npx expo start
   
   # Windows CMD
   set EXPO_PUBLIC_API_IP=192.168.1.100 && npx expo start
   
   # Mac/Linux
   EXPO_PUBLIC_API_IP=192.168.1.100 npx expo start
   ```
   Replace `192.168.1.100` with your actual IP address.

#### Option B: Create .env File (Alternative)

1. Create a `.env` file in the `ecwa-expo` directory (if it doesn't exist)
2. Add this line (replace with your actual IP address):
   ```
   EXPO_PUBLIC_API_IP=192.168.1.100
   ```
   Or set the full URL:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000/api
   ```
3. Restart your Expo development server

#### Option B: Update app.json

1. Open `ecwa-expo/app.json`
2. Update the `apiBaseUrl` in the `extra` section:
   ```json
   "extra": {
     "apiBaseUrl": "http://192.168.1.100:8000/api"
   }
   ```
3. Restart your Expo development server

### Step 3: Ensure Backend is Accessible

1. Make sure your backend API server is running on port 8000
2. Verify your backend accepts connections from your local network (not just localhost)
3. If using Laravel/PHP, check that it's bound to `0.0.0.0:8000` instead of `127.0.0.1:8000`
   - Example: `php artisan serve --host=0.0.0.0 --port=8000`

### Step 4: Clear Cache and Restart

1. Stop your Expo development server (Ctrl+C)
2. Clear the cache:
   ```bash
   npx expo start --clear
   ```
   Or use the provided script:
   ```bash
   npm run clear-cache
   ```
3. Restart Expo Go on your device

## Troubleshooting

### Still seeing "Network Request Failed"?

1. **Check your IP address hasn't changed** - IP addresses can change when you reconnect to WiFi
2. **Verify firewall settings** - Your computer's firewall might be blocking port 8000
3. **Check both devices are on the same network** - Your phone and computer must be on the same WiFi network
4. **Test the API URL directly** - Open `http://YOUR_IP:8000/api` in your phone's browser to verify it's accessible
5. **Check backend logs** - Make sure the backend is receiving requests

### Authentication Flow Not Showing?

1. **Clear Expo Go cache:**
   - On iOS: Shake device → "Reload"
   - On Android: Shake device → "Reload" or press `r` in terminal
2. **Clear AsyncStorage:**
   - The app might have cached authentication state
   - Uninstall and reinstall Expo Go, or clear app data
3. **Check console logs:**
   - Look for any routing errors in the Expo development server terminal

### Quick Test

To verify your setup is working:

1. Open the Expo Go app
2. You should see the splash screen, then the authentication page
3. Enter your email and click "Send Login Link"
4. Check the Expo development server terminal for any errors
5. If successful, you should see a success message and be redirected to the verification page

## Production Setup

For production builds, update the API URL to your production server:

```json
"extra": {
  "apiBaseUrl": "https://your-production-domain.com/api"
}
```

Or set the environment variable:
```
EXPO_PUBLIC_API_BASE_URL=https://your-production-domain.com/api
```

