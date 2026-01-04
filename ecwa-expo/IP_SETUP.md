# Quick IP Address Setup for Mobile Devices

## Automatic Detection (Recommended)

The app **automatically detects** your computer's IP address when you connect via Expo Go. No configuration needed!

Just make sure:
1. Your phone and computer are on the same WiFi network
2. Your backend API server is running
3. Check the console logs - you'll see: `[API] Detected LAN host from Expo hostUri: 192.168.x.x`

## Manual Setup (If Auto-Detection Doesn't Work)

### Step 1: Find Your IP Address

**Windows:**
```powershell
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# Or
ip addr | grep "inet "
```

### Step 2: Set the IP Address

**Option A: Environment Variable (Temporary)**
```bash
# Windows PowerShell
$env:EXPO_PUBLIC_API_IP="192.168.1.100"; npx expo start

# Windows CMD
set EXPO_PUBLIC_API_IP=192.168.1.100 && npx expo start

# Mac/Linux
EXPO_PUBLIC_API_IP=192.168.1.100 npx expo start
```

**Option B: .env File (Permanent)**
1. Create `.env` file in `ecwa-expo/` directory
2. Add: `EXPO_PUBLIC_API_IP=192.168.1.100`
3. Replace with your actual IP address
4. Restart Expo server

**Option C: Full URL Override**
If you want to set the complete URL:
```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000/api npx expo start
```

### Step 3: Verify

Check the console logs when the app starts:
```
[API] Raw API Base URL: http://localhost:8000/api
[API] Detected LAN Host: 192.168.1.100
[API] Final API Base URL: http://192.168.1.100:8000/api
```

## Important Notes

1. **IP Address Changes**: Your IP may change when you reconnect to WiFi. If API stops working, check your IP again.

2. **Backend Server**: Make sure your backend accepts connections from your network:
   ```bash
   # Laravel/PHP
   php artisan serve --host=0.0.0.0 --port=8000
   
   # Node.js/Express
   # Make sure server listens on 0.0.0.0, not just 127.0.0.1
   ```

3. **Firewall**: Ensure your firewall allows connections on port 8000

4. **Same Network**: Phone and computer must be on the same WiFi network

## Troubleshooting

**Still seeing "Network request failed"?**
1. Verify IP address hasn't changed
2. Test in phone browser: `http://YOUR_IP:8000/api`
3. Check backend is running and accessible
4. Verify firewall settings
5. Check console logs for detected IP address
