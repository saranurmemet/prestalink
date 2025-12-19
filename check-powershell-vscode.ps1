# PowerShell Editor Services Durum Kontrolü
# Bu script VS Code PowerShell eklentisi durumunu kontrol eder

Write-Host "=== PowerShell Editor Services Durum Kontrolü ===" -ForegroundColor Cyan
Write-Host ""

# 1. PowerShell Yolları Kontrolü
Write-Host "1. PowerShell Yürütülebilir Yolları:" -ForegroundColor Yellow
$pwsh7 = "C:\Program Files\PowerShell\7\pwsh.exe"
$pwsh5 = "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"

if (Test-Path $pwsh7) {
    Write-Host "   ✓ PowerShell 7 bulundu: $pwsh7" -ForegroundColor Green
    $pwsh7Version = & $pwsh7 -Command '$PSVersionTable.PSVersion.ToString()'
    Write-Host "     Versiyon: $pwsh7Version" -ForegroundColor Gray
} else {
    Write-Host "   ✗ PowerShell 7 bulunamadı" -ForegroundColor Red
    Write-Host "     Önerilen: winget install --id Microsoft.PowerShell" -ForegroundColor Gray
}

if (Test-Path $pwsh5) {
    Write-Host "   ✓ Windows PowerShell 5.1 bulundu: $pwsh5" -ForegroundColor Green
    $pwsh5Version = $PSVersionTable.PSVersion.ToString()
    Write-Host "     Versiyon: $pwsh5Version" -ForegroundColor Gray
} else {
    Write-Host "   ✗ Windows PowerShell bulunamadı" -ForegroundColor Red
}

Write-Host ""

# 2. VS Code Settings Kontrolü
Write-Host "2. VS Code Ayarları Kontrolü:" -ForegroundColor Yellow
$settingsPath = ".\.vscode\settings.json"
if (Test-Path $settingsPath) {
    Write-Host "   ✓ settings.json bulundu" -ForegroundColor Green
    $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json
    
    if ($settings.'http.experimental.enableHttp2' -eq $false) {
        Write-Host "   ✓ HTTP/2 devre dışı" -ForegroundColor Green
    } else {
        Write-Host "   ✗ HTTP/2 aktif (sorun kaynağı olabilir)" -ForegroundColor Red
    }
    
    if ($settings.'http.proxySupport' -eq "off") {
        Write-Host "   ✓ Proxy desteği kapalı" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Proxy ayarları kontrol edilmeli" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✗ settings.json bulunamadı" -ForegroundColor Red
}

Write-Host ""

# 3. PowerShell Eklentisi Kontrolü
Write-Host "3. VS Code PowerShell Eklentisi:" -ForegroundColor Yellow
$extensionsPath = "$env:USERPROFILE\.vscode\extensions"
$psExtension = Get-ChildItem -Path $extensionsPath -Filter "ms-vscode.powershell-*" -Directory -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($psExtension) {
    Write-Host "   ✓ PowerShell eklentisi bulundu" -ForegroundColor Green
    Write-Host "     Konum: $($psExtension.FullName)" -ForegroundColor Gray
    Write-Host "     Versiyon: $($psExtension.Name -replace 'ms-vscode.powershell-', '')" -ForegroundColor Gray
    
    # Log dosyalarını kontrol et
    $logPath = Join-Path $psExtension.FullName "logs"
    if (Test-Path $logPath) {
        $latestLog = Get-ChildItem -Path $logPath -Filter "*.log" -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($latestLog) {
            Write-Host "     Son log: $($latestLog.Name) ($($latestLog.LastWriteTime))" -ForegroundColor Gray
            Write-Host "     Log konumu: $($latestLog.FullName)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ✗ PowerShell eklentisi bulunamadı" -ForegroundColor Red
    Write-Host "     VS Code'da 'ms-vscode.powershell' eklentisini yükleyin" -ForegroundColor Gray
}

Write-Host ""

# 4. Port Kontrolü (Editor Services için)
Write-Host "4. Port Durumu:" -ForegroundColor Yellow
$commonPorts = @(50000, 50001, 50002, 60000, 60001)
$usedPorts = @()
foreach ($port in $commonPorts) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $usedPorts += $port
    }
}
if ($usedPorts.Count -gt 0) {
    Write-Host "   ⚠ Kullanımda olan portlar: $($usedPorts -join ', ')" -ForegroundColor Yellow
    Write-Host "     Bu normal olabilir (Editor Services bu portları kullanır)" -ForegroundColor Gray
} else {
    Write-Host "   ✓ Yaygın portlar boş" -ForegroundColor Green
}

Write-Host ""

# 5. Firewall Kontrolü
Write-Host "5. Windows Firewall:" -ForegroundColor Yellow
$firewallStatus = Get-NetFirewallProfile | Where-Object { $_.Enabled -eq $true }
if ($firewallStatus) {
    Write-Host "   ⚠ Firewall aktif" -ForegroundColor Yellow
    Write-Host "     VS Code ve PowerShell'i firewall istisnalarına ekleyin" -ForegroundColor Gray
} else {
    Write-Host "   ✓ Firewall devre dışı veya sorun yok" -ForegroundColor Green
}

Write-Host ""

# 6. Proxy/VPN Kontrolü
Write-Host "6. Proxy/VPN Durumu:" -ForegroundColor Yellow
$proxy = [System.Net.WebRequest]::GetSystemWebProxy()
$proxySettings = $proxy.GetProxy("http://www.microsoft.com")
if ($proxySettings -ne "http://www.microsoft.com/") {
    Write-Host "   ⚠ Proxy aktif: $proxySettings" -ForegroundColor Yellow
    Write-Host "     PowerShell Editor Services için proxy'yi geçici olarak kapatmayı deneyin" -ForegroundColor Gray
} else {
    Write-Host "   ✓ Proxy yok" -ForegroundColor Green
}

Write-Host ""

# Özet ve Öneriler
Write-Host "=== Özet ve Öneriler ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Yapılacaklar:" -ForegroundColor Yellow
Write-Host "1. VS Code'u tamamen kapatıp yeniden başlatın" -ForegroundColor White
Write-Host "2. PowerShell eklentisini disable/enable yapın" -ForegroundColor White
Write-Host "3. Output > PowerShell panelinden logları kontrol edin" -ForegroundColor White
Write-Host "4. Bir .ps1 dosyası açarak Editor Services'ın başladığını doğrulayın" -ForegroundColor White
Write-Host ""
Write-Host "Detaylı rehber: .vscode\powershell-fix-guide.md" -ForegroundColor Cyan
Write-Host ""




