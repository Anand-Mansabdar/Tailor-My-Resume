# Test Registration API
Write-Host "Testing Registration API..." -ForegroundColor Cyan
Write-Host ""

$body = @{
    email = "test@example.com"
    username = "testuser"
    password = "testpass123"
} | ConvertTo-Json

Write-Host "Request body:"
Write-Host $body
Write-Host ""

try {
    $response = Invoke-WebRequest `
        -Uri "http://localhost:8000/api/auth/register" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "✓ Success! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "✗ Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Response:"
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    Write-Host $responseBody
}
