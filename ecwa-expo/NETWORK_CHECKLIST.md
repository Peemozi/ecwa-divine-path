# Network Connectivity Checklist

## ✅ Requirements (from your image):

1. **Mobile device and server must be on the same WiFi network**
2. **Frontend should use: `http://192.168.1.198:8000/api` (not localhost)**

## Current Status Check:

### 1. ✅ Frontend Configuration
- [x] Using correct IP: `192.168.1.198` (not localhost)
- [x] Using correct port: `8000`
- [x] Using correct path: `/api`
- [x] `.env` file updated with: `EXPO_PUBLIC_API_IP=192.168.1.198`
- [x] Token is present and valid (60 characters)

### 2. ⚠️ Backend Server Status
**Check if backend is accessible:**

```powershell
# Check if port 8000 is listening on all interfaces
netstat -an | Select-String ":8000"
```

**Should show:**
```
TCP    0.0.0.0:8000         0.0.0.0:0              LISTENING
```

**If it shows `127.0.0.1:8000` instead, restart backend:**
```bash
cd "C:\Users\DELL\ECWA APP BACKEND\hymnadmin"
& "C:\tools\php82\php.exe" artisan serve --host=0.0.0.0 --port=8000
```

### 3. ⚠️ Network Connectivity Test

**Test from your phone's browser:**
1. Open browser on your phone
2. Go to: `http://192.168.1.198:8000/api`
3. If it loads (even with an error), network is working ✅
4. If it doesn't load, check:
   - Phone and computer on same WiFi? ❌
   - Firewall blocking port 8000? ❌
   - Backend not running? ❌

### 4. ⚠️ WiFi Network Verification

**On your computer:**
```powershell
# Check your WiFi network name
netsh wlan show profile
```

**On your phone:**
- Settings → WiFi
- Verify you're connected to the SAME network as your computer

### 5. ⚠️ Firewall Check

**Windows Firewall might be blocking port 8000:**

1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port "8000"
6. Allow the connection
7. Apply to all profiles

## Quick Test Commands:

```powershell
# 1. Check backend is running
netstat -an | Select-String ":8000"

# 2. Test backend locally
curl http://localhost:8000/api

# 3. Check your IP
ipconfig | Select-String "IPv4"

# 4. Verify .env file
Get-Content .env
```

## Expected Console Output (when working):

```
[API] Configuration:
[API] Raw API Base URL: http://localhost:8000/api
[API] Detected LAN Host: 192.168.1.198
[API] Final API Base URL: http://192.168.1.198:8000/api
[API] ───────────────────────────────────────────────────
[API] Making request to: http://192.168.1.198:8000/api/user/dashboard
[API] Response status: 200 OK
```

## If Still Not Working:

1. **Restart Expo:** `npx expo start --clear`
2. **Restart Backend:** Use the RESTART_BACKEND.ps1 script
3. **Check backend logs** for any errors
4. **Test from phone browser** first before testing in app
