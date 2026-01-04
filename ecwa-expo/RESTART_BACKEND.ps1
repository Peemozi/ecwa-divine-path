# Script to restart Laravel backend with network access
# This allows mobile devices to connect to the API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restarting Laravel Backend for Network Access" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Backend directory
$backendPath = "C:\Users\DELL\ECWA APP BACKEND\hymnadmin"
$phpPath = "C:\tools\php82\php.exe"

Write-Host "Backend Path: $backendPath" -ForegroundColor Yellow
Write-Host "PHP Path: $phpPath" -ForegroundColor Yellow
Write-Host ""

# Check if directory exists
if (-not (Test-Path $backendPath)) {
    Write-Host "ERROR: Backend directory not found: $backendPath" -ForegroundColor Red
    Write-Host "Please update the path in this script." -ForegroundColor Red
    exit 1
}

# Check if PHP exists
if (-not (Test-Path $phpPath)) {
    Write-Host "ERROR: PHP not found: $phpPath" -ForegroundColor Red
    Write-Host "Please update the PHP path in this script." -ForegroundColor Red
    exit 1
}

Write-Host "Changing to backend directory..." -ForegroundColor Green
Set-Location $backendPath

Write-Host ""
Write-Host "Starting Laravel server with network access..." -ForegroundColor Green
Write-Host "Command: $phpPath artisan serve --host=0.0.0.0 --port=8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
& $phpPath artisan serve --host=0.0.0.0 --port=8000
