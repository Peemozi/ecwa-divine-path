# PowerShell script to clear Expo cache and restart
Write-Host "Clearing Expo cache..." -ForegroundColor Yellow

# Remove .expo directory
if (Test-Path .expo) {
    Remove-Item -Recurse -Force .expo
    Write-Host "✓ Removed .expo directory" -ForegroundColor Green
}

# Remove node_modules cache
if (Test-Path node_modules\.cache) {
    Remove-Item -Recurse -Force node_modules\.cache
    Write-Host "✓ Removed node_modules cache" -ForegroundColor Green
}

# Clear Metro bundler cache directory
if (Test-Path $env:TEMP\metro-*) {
    Get-ChildItem -Path $env:TEMP -Filter "metro-*" -Directory | Remove-Item -Recurse -Force
    Write-Host "✓ Removed Metro cache from temp" -ForegroundColor Green
}

# Clear watchman cache (if watchman is installed)
$watchmanPath = Get-Command watchman -ErrorAction SilentlyContinue
if ($watchmanPath) {
    watchman watch-del-all 2>$null
    Write-Host "✓ Cleared watchman cache" -ForegroundColor Green
}

# Clear Android build cache (if exists)
if (Test-Path android\.gradle) {
    Remove-Item -Recurse -Force android\.gradle -ErrorAction SilentlyContinue
    Write-Host "✓ Cleared Android gradle cache" -ForegroundColor Green
}

if (Test-Path android\app\build) {
    Remove-Item -Recurse -Force android\app\build -ErrorAction SilentlyContinue
    Write-Host "✓ Cleared Android build directory" -ForegroundColor Green
}

Write-Host "`nCache cleared! Starting Expo with cleared cache..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Cyan

# Start Expo with cleared cache
npx expo start --clear

