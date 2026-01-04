# Fix: Backend Server Not Accessible from Network

## Problem
Your backend server is only listening on `127.0.0.1:8000` (localhost), which means it can't accept connections from your phone.

## Solution: Restart Backend to Listen on All Interfaces

### For Laravel/PHP Backend:

1. **Stop your current backend server** (Ctrl+C in the terminal where it's running)

2. **Restart with network access:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

3. **Verify it's listening correctly:**
   ```powershell
   netstat -an | Select-String ":8000"
   ```
   
   You should see:
   ```
   TCP    0.0.0.0:8000         0.0.0.0:0              LISTENING
   ```
   (NOT `127.0.0.1:8000`)

### For Node.js/Express Backend:

1. **Find your server file** (usually `server.js`, `app.js`, or `index.js`)

2. **Update the listen call:**
   ```javascript
   // OLD (only localhost):
   app.listen(8000, '127.0.0.1', () => {
     console.log('Server running');
   });
   
   // NEW (all interfaces):
   app.listen(8000, '0.0.0.0', () => {
     console.log('Server running on 0.0.0.0:8000');
   });
   
   // OR simply (defaults to 0.0.0.0):
   app.listen(8000, () => {
     console.log('Server running on port 8000');
   });
   ```

3. **Restart your server**

### For Python/Django Backend:

```bash
python manage.py runserver 0.0.0.0:8000
```

### For Python/Flask Backend:

```python
app.run(host='0.0.0.0', port=8000)
```

## Verify It's Working

After restarting, check:

1. **Port is listening on all interfaces:**
   ```powershell
   netstat -an | Select-String ":8000"
   ```
   Should show: `TCP    0.0.0.0:8000`

2. **Test from phone's browser:**
   Open: `http://10.82.40.187:8000/api`
   Should connect (even if it shows an error, connection means it's working)

3. **Check firewall:**
   If still not working, Windows Firewall might be blocking. See TROUBLESHOOTING.md

## Quick Test

Once restarted, try logging in again from your phone. The network request should succeed!
