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

# Clear Metro bundler cache
Write-Host "`nStarting Expo with cleared cache..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop, then run: npx expo start --clear" -ForegroundColor Cyan

# Start Expo with cleared cache
npx expo start --clear

