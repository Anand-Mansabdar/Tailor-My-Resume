# Authentication System Test Script
Write-Host "========================================"
Write-Host "Authentication System Setup Verification"
Write-Host "========================================"
Write-Host ""

# Check Python
Write-Host "Checking Python..."
try {
    $pythonVersion = python --version 2>&1
    Write-Host "OK Python installed: $pythonVersion"
} catch {
    Write-Host "ERROR Python not found"
    exit 1
}

# Check Node
Write-Host "Checking Node.js..."
try {
    $nodeVersion = node --version 2>&1
    Write-Host "OK Node.js installed: $nodeVersion"
} catch {
    Write-Host "ERROR Node.js not found"
    exit 1
}

# Check backend .env
Write-Host ""
Write-Host "Checking Backend Configuration..."
if (Test-Path "backend\.env") {
    Write-Host "OK Backend .env file exists"
} else {
    Write-Host "WARNING Backend .env file not found"
    Write-Host "Run: cd backend; copy .env.example .env"
}

# Check frontend .env
Write-Host ""
Write-Host "Checking Frontend Configuration..."
if (Test-Path "frontend\.env") {
    Write-Host "OK Frontend .env file exists"
} else {
    Write-Host "WARNING Frontend .env file not found"
    Write-Host "Run: cd frontend; copy .env.example .env"
}

Write-Host ""
Write-Host "========================================"
Write-Host "Setup verification complete!"
Write-Host "See AUTHENTICATION_SETUP.md for detailed instructions"
Write-Host "========================================"
