# MongoDB Status Checker
Write-Host "Checking MongoDB status..." -ForegroundColor Cyan
Write-Host ""

# Check if mongod is installed
try {
    $version = mongod --version 2>&1 | Select-String "db version"
    if ($version) {
        Write-Host "✓ MongoDB is installed: $version" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ MongoDB is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community"
    Write-Host "2. Use MongoDB Atlas (free cloud): https://www.mongodb.com/cloud/atlas"
    exit 1
}

# Check if MongoDB service is running
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService) {
    if ($mongoService.Status -eq "Running") {
        Write-Host "✓ MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠ MongoDB service exists but is not running" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To start MongoDB service (run as Administrator):" -ForegroundColor Cyan
        Write-Host "  net start MongoDB"
        Write-Host ""
    }
} else {
    Write-Host "⚠ MongoDB service not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Try starting MongoDB manually:" -ForegroundColor Cyan
    Write-Host "  mongod --dbpath C:\data\db"
    Write-Host ""
}

# Try to connect to MongoDB
Write-Host "Testing MongoDB connection..." -ForegroundColor Cyan
try {
    $testConnection = mongosh --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Successfully connected to MongoDB" -ForegroundColor Green
        Write-Host "  MongoDB version: $testConnection"
    } else {
        Write-Host "✗ Could not connect to MongoDB" -ForegroundColor Red
        Write-Host "  Make sure MongoDB is running on localhost:27017"
    }
} catch {
    Write-Host "✗ Could not connect to MongoDB" -ForegroundColor Red
    Write-Host "  Make sure MongoDB is running on localhost:27017"
}

Write-Host ""
Write-Host "Ready to start the backend server!" -ForegroundColor Green
