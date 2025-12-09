# API Setup Complete ✅

## Environment Configuration

### Web App
- ✅ `.env` file created with `VITE_API_BASE_URL=http://localhost:8000/api`
- ✅ `.env.example` template created for reference
- ✅ `.gitignore` updated to exclude `.env` files
- ✅ API service configured to read from environment variable

### React Native App
- ✅ `app.json` updated with `extra.apiBaseUrl` configuration
- ✅ Default value: `http://localhost:8000/api`
- ✅ Can be overridden with `EXPO_PUBLIC_API_BASE_URL` environment variable

## API Integration Status

### ✅ Completed
1. **Authentication Flow**
   - Send login code: `POST /api/user/login/send-code`
   - Verify login code: `POST /api/user/login/verify`
   - Token storage: `apiToken` in localStorage (web) / AsyncStorage (RN)

2. **API Service Layer**
   - Web: `src/lib/api.ts`
   - React Native: `ecwa-expo/src/lib/api.ts`
   - Both include full API methods for auth and user management

3. **Updated Pages**
   - Auth pages (web & RN) - using real API
   - VerifyToken pages (web & RN) - using real API
   - Splash screens - checking for `apiToken`
   - Profile & Menu pages - using `removeApiToken()` for logout

## Configuration Files

### Web App
- **Environment File**: `.env` (created)
- **Example File**: `.env.example` (created)
- **API Service**: `src/lib/api.ts`

### React Native App
- **Config File**: `ecwa-expo/app.json` (updated)
- **API Service**: `ecwa-expo/src/lib/api.ts`

## Testing the Setup

### 1. Start the Backend API
Make sure your backend is running on `http://localhost:8000/api`

### 2. Test Web App
```bash
cd ecwa-divine-path
npm run dev
```
- Navigate to the auth page
- Enter an email
- Check email for verification code
- Enter code to complete login

### 3. Test React Native App
```bash
cd ecwa-divine-path/ecwa-expo
npm start
```
- Run on your device/emulator
- Test the same authentication flow

## Production Setup

### Web App
Update `.env` file:
```
VITE_API_BASE_URL=https://your-domain.com/api
```

### React Native App
Update `ecwa-expo/app.json`:
```json
"extra": {
  "apiBaseUrl": "https://your-domain.com/api"
}
```

Or set environment variable:
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-domain.com/api
```

## API Endpoints Available

### Authentication
- `authApi.sendLoginCode(email)` - Send login code
- `authApi.verifyLoginCode(email, code)` - Verify and login
- `authApi.authenticateByEmail(email)` - Check if user exists
- `authApi.login(email, password)` - Login with password
- `authApi.register(userData)` - Register new user
- `authApi.getAuthUser()` - Get authenticated user
- `authApi.sendPasswordResetCode(email)` - Send reset code
- `authApi.resetPassword(email, code, password)` - Reset password

### User Management
- `userApi.getUserById(id)` - Get user by ID
- `userApi.updateProfile(profileData)` - Update profile
- `userApi.getDashboard()` - Get dashboard data
- `userApi.markHasLatestUpdate(id)` - Mark latest update

## Token Management

### Web
```typescript
import { getApiToken, setApiToken, removeApiToken } from '@/lib/api';

// Get token
const token = getApiToken();

// Set token (after login)
setApiToken(user.api_token);

// Remove token (on logout)
removeApiToken();
```

### React Native
```typescript
import { getApiToken, setApiToken, removeApiToken } from '@/lib/api';

// Get token
const token = await getApiToken();

// Set token (after login)
await setApiToken(user.api_token);

// Remove token (on logout)
await removeApiToken();
```

## Notes

- All API requests automatically include the `apiToken` header for authenticated endpoints
- Error handling is built into the API service layer
- Token is stored securely and checked on app startup
- All authentication flows are now using the real backend API

