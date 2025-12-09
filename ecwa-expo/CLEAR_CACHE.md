# How to Clear Expo Cache and See Updated Authentication Flow

If you're not seeing the updated authentication flow, try these steps:

## Method 1: Clear Metro Bundler Cache
```bash
# Stop the Expo server (Ctrl+C)
# Then run:
npx expo start --clear
```

## Method 2: Clear All Caches
```bash
# Stop the Expo server
# Clear Metro cache
npx expo start --clear

# Clear watchman cache (if installed)
watchman watch-del-all

# Clear node_modules and reinstall (if needed)
rm -rf node_modules
npm install
```

## Method 3: Reset Expo Cache
```bash
# Stop the Expo server
# Clear Expo cache
rm -rf .expo
npx expo start --clear
```

## Method 4: Full Reset (Windows PowerShell)
```powershell
# Stop the Expo server
# Clear all caches
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
npx expo start --clear
```

## Method 5: Reload in Expo Go
1. Shake your device (or press `Cmd+D` on iOS simulator / `Cmd+M` on Android emulator)
2. Select "Reload" from the developer menu
3. Or press `r` in the terminal where Expo is running

## Method 6: Restart Development Build
If using a development build:
1. Stop the Expo server
2. Close the app completely on your device
3. Restart Expo: `npx expo start --clear`
4. Reopen the app

## Verify the Update
After clearing cache, you should see:
- ✅ Updated Auth page with "Email Address" label
- ✅ Updated VerifyToken page with "Verification Code" label (no logo)
- ✅ Proper spacing and styling matching the web version
- ✅ Real API integration (not mock data)

## If Still Not Working
1. Check that you're on the `/auth` route
2. Verify the files are saved: `src/pages/Auth.tsx` and `src/pages/VerifyToken.tsx`
3. Check for any console errors in the Expo terminal
4. Try deleting the app and reinstalling it

