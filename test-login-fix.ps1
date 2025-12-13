# Test Login Fix
Write-Host "Testing Login Role Fix" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

$users = @(
    @{name="Sara"; email="sara@prestalink.app"; pass="sara"},
    @{name="Mehmet"; email="mehmet@prestalink.app"; pass="mehmet"},
    @{name="Ahmet"; email="ahmet@prestalink.app"; pass="ahmet"},
    @{name="Sarad"; email="sarad@prestalink.app"; pass="sarad"}
)

foreach ($user in $users) {
    Write-Host "`n👤 $($user.name):" -ForegroundColor Yellow
    
    # Test user role
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/user/login" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body ("{`"email`":`"$($user.email)`",`"password`":`"$($user.pass)`"}") `
            -UseBasicParsing
        $json = $response.Content | ConvertFrom-Json
        Write-Host "  ✅ user role -> $($json.user.role)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ user role failed" -ForegroundColor Red
    }
    
    # Test recruiter role
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/recruiter/login" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body ("{`"email`":`"$($user.email)`",`"password`":`"$($user.pass)`"}") `
            -UseBasicParsing
        $json = $response.Content | ConvertFrom-Json
        Write-Host "  ✅ recruiter role -> $($json.user.role)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ recruiter role failed" -ForegroundColor Red
    }
    
    # Test admin role
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/admin/login" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body ("{`"email`":`"$($user.email)`",`"password`":`"$($user.pass)`"}") `
            -UseBasicParsing
        $json = $response.Content | ConvertFrom-Json
        Write-Host "  ✅ admin role -> $($json.user.role)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ admin role failed" -ForegroundColor Red
    }
}

Write-Host "`n✅ All tests completed!" -ForegroundColor Green
