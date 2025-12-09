# Backend Code Temporarily Removed

All backend-related code has been removed from the authentication flow to fix UI display issues.

## What Was Changed

### 1. **Auth.tsx** (`src/pages/Auth.tsx`)
- ✅ Removed `authApi` import
- ✅ Removed API call to `sendLoginCode()`
- ✅ Replaced with mock delay (1 second) and direct navigation
- ✅ UI now works without backend

### 2. **VerifyToken.tsx** (`src/pages/VerifyToken.tsx`)
- ✅ Removed `authApi` and `setApiToken` imports
- ✅ Removed API call to `verifyLoginCode()`
- ✅ Removed API token check on mount
- ✅ Replaced with mock login that stores:
  - `userEmail` in AsyncStorage
  - `userName` (extracted from email)
  - `apiToken` as "mock-token-temp"
- ✅ UI now works without backend

### 3. **index.tsx** (`app/index.tsx`)
- ✅ Still checks for `apiToken` in AsyncStorage (works with mock token)
- ✅ Navigation flow preserved

### 4. **Profile.tsx** (`src/pages/Profile.tsx`)
- ✅ Removed `removeApiToken` import
- ✅ Logout now only removes AsyncStorage items directly

### 5. **MenuPage.tsx** (`src/pages/MenuPage.tsx`)
- ✅ Removed `removeApiToken` import
- ✅ Logout now only removes AsyncStorage items directly

## Current Authentication Flow (Mock)

1. **Auth Page**: User enters email → Click "Send Login Link"
   - No API call made
   - After 1 second delay, navigates to verify-token page
   - Shows success toast

2. **Verify Token Page**: User enters any code → Click "Verify & Login"
   - No API call made
   - After 1 second delay:
     - Stores email as `userEmail`
     - Stores email prefix as `userName`
     - Stores "mock-token-temp" as `apiToken`
   - Navigates to dashboard
   - Shows success toast

3. **App Startup**: Checks for `apiToken` in AsyncStorage
   - If found → Go to dashboard
   - If not found → Go to auth page

## How to Re-enable Backend

When ready to restore backend functionality:

1. **Re-enable API in `src/lib/api.ts`**:
   ```typescript
   const USE_API = true; // Change from false
   ```

2. **Restore API calls in Auth.tsx**:
   ```typescript
   import { authApi } from "@/src/lib/api";
   // ... in handleSendToken:
   await authApi.sendLoginCode(email);
   ```

3. **Restore API calls in VerifyToken.tsx**:
   ```typescript
   import { authApi, setApiToken } from "@/src/lib/api";
   // ... in handleVerify:
   const user = await authApi.verifyLoginCode(email, token);
   await setApiToken(user.api_token);
   ```

4. **Restore API imports in Profile.tsx and MenuPage.tsx**:
   ```typescript
   import { removeApiToken } from "@/src/lib/api";
   // ... in logout:
   await removeApiToken();
   ```

## Notes

- ✅ All UI components are preserved and working
- ✅ Navigation flow is intact
- ✅ No network requests are made
- ✅ Mock authentication allows full app navigation
- ✅ All backend code is commented/removed but structure preserved for easy restoration

## Testing

The authentication interface should now display correctly without any backend dependencies. You can:
- Enter any email on the auth page
- Enter any code on the verify token page
- Successfully navigate to the dashboard
- Use all app features that don't require backend API calls

