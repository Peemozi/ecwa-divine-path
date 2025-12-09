# API Temporarily Disabled

The API base URL and authentication endpoints have been temporarily disabled due to backend configuration issues.

## Current Status

- ✅ API calls are disabled
- ✅ App will show error message: "API is temporarily disabled. Backend configuration is being updated."
- ✅ No network requests will be made

## How to Re-enable API

When the backend is ready, follow these steps:

### Step 1: Enable API in Code

Open `ecwa-expo/src/lib/api.ts` and change:

```typescript
const USE_API = false; // Change this to true
```

### Step 2: Configure API Base URL

You have two options:

#### Option A: Environment Variable (Recommended)
Create a `.env` file in `ecwa-expo/` directory:
```
EXPO_PUBLIC_API_BASE_URL=http://your-backend-url.com/api
```

#### Option B: Update app.json
Edit `ecwa-expo/app.json`:
```json
"extra": {
  "apiBaseUrl": "http://your-backend-url.com/api"
}
```

### Step 3: Restart Development Server

```bash
npm run start:clear
```

## What Was Changed

1. **`src/lib/api.ts`**:
   - Added `USE_API` flag (currently set to `false`)
   - All API requests check this flag and throw a clear error message if disabled
   - Easy to re-enable by setting `USE_API = true`

2. **`app.json`**:
   - Added comment noting API is temporarily disabled

## Testing After Re-enabling

1. Open the app in Expo Go
2. Navigate to the auth page
3. Try sending a login code
4. Check the console for the API Base URL being used
5. Verify network requests are working

## Notes

- Token storage functions (`getApiToken`, `setApiToken`, `removeApiToken`) still work
- Only the actual API network calls are disabled
- All API service methods are preserved and ready to use once re-enabled

