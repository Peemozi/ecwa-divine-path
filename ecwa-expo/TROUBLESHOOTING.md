# Network Request Failed - Troubleshooting Guide

## Quick Checklist

If you're seeing "Network request failed" errors, follow these steps:

### 1. ✅ Verify .env File Exists
- Location: `ecwa-expo/.env`
- Should contain: `EXPO_PUBLIC_API_IP=10.82.40.187`
- ✅ Already created!

### 2. 🔄 Restart Expo Server (REQUIRED)
The `.env` file is only loaded when Expo starts. You MUST restart:

```powershell
# Stop current Expo server (Ctrl+C)
# Then restart with cache cleared:
cd "c:\Users\DELL\ECWA MOBILE APP PROJECT\ecwa-divine-path\ecwa-expo"
npx expo start --clear
```

**Important:** The `--clear` flag clears the cache so the new environment variable is loaded.

### 3. 📱 Check Console Logs
When the app starts, look for these logs in your terminal:

```
[API] Configuration:
[API] Raw API Base URL: http://localhost:8000/api
[API] Detected LAN Host: 10.82.40.187
[API] Final API Base URL: http://10.82.40.187:8000/api
```

If you see `Detected LAN Host: none (using localhost)`, the `.env` file wasn't loaded. Restart Expo.

### 4. 🖥️ Verify Backend Server is Running
Make sure your backend API server is running on port 8000:

```bash
# Check if server is running
# Test in browser: http://localhost:8000/api
```

### 5. 🌐 Test API from Mobile Device
On your phone's browser, try:
```
http://10.82.40.187:8000/api
```

If this doesn't work, the backend isn't accessible from your network.

### 6. 🔥 Check Firewall
Windows Firewall might be blocking port 8000. To allow it:

1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port "8000"
6. Allow the connection
7. Apply to all profiles

### 7. 🔌 Verify Backend Server Configuration
Your backend must listen on `0.0.0.0`, not just `127.0.0.1`:

**Laravel/PHP:**
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

**Node.js/Express:**
```javascript
app.listen(8000, '0.0.0.0', () => {
  console.log('Server running on 0.0.0.0:8000');
});
```

### 8. 📶 Same Network
Ensure your phone and computer are on the same WiFi network.

### 9. 🔄 IP Address Changed?
If your IP address changed (after reconnecting to WiFi), update `.env`:

```powershell
# Find new IP
ipconfig | Select-String "IPv4"

# Update .env file with new IP
# Then restart Expo
```

## Still Not Working?

### Option A: Set Environment Variable Directly
Instead of `.env` file, set it when starting Expo:

```powershell
$env:EXPO_PUBLIC_API_IP="10.82.40.187"; npx expo start --clear
```

### Option B: Update app.json
Temporarily hardcode the IP in `app.json`:

```json
"extra": {
  "apiBaseUrl": "http://10.82.40.187:8000/api"
}
```

Then update `api.ts` to use `Constants.expoConfig?.extra?.apiBaseUrl` directly.

### Option C: Check Backend Logs
Look at your backend server logs to see if requests are reaching it. If no requests appear, the network connection is blocked.

## Diagnostic Commands

Run these to verify your setup:

```powershell
# 1. Check .env file
Get-Content .env

# 2. Check IP address
ipconfig | Select-String "IPv4"

# 3. Test backend locally
curl http://localhost:8000/api

# 4. Check if port 8000 is listening
netstat -an | Select-String ":8000"
```

## Expected Behavior

When everything is working:
1. Expo starts and loads `.env` file
2. Console shows: `[API] Using manual IP from EXPO_PUBLIC_API_IP: 10.82.40.187`
3. Final API URL: `http://10.82.40.187:8000/api`
4. Login requests succeed
5. No "Network request failed" errors
