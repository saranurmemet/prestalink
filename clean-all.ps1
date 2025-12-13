# Tam Temizlik Scripti (Sorun yaşandığında kullanın)
Write-Host "================================" -ForegroundColor Red
Write-Host "TAM TEMİZLİK" -ForegroundColor Red
Write-Host "================================" -ForegroundColor Red
Write-Host ""

# 1. Servisleri durdur
Write-Host "1. Servisler durduruluyor..." -ForegroundColor Yellow
.\stop-dev.ps1

# 2. Cache temizle
Write-Host "2. Cache'ler temizleniyor..." -ForegroundColor Yellow
$cachePaths = @(
    ".\frontend\.next",
    ".\frontend\out",
    ".\frontend\.cache"
)

foreach ($path in $cachePaths) {
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   $(Split-Path $path -Leaf) silindi" -ForegroundColor Green
    }
}

# 3. node_modules temizleme seçeneği
Write-Host ""
$clean = Read-Host "node_modules'leri de temizle? (npm install gerekecek) [E/H]"
if ($clean -eq 'E' -or $clean -eq 'e') {
    Write-Host "3. node_modules temizleniyor..." -ForegroundColor Yellow
    
    @(".\frontend\node_modules", ".\backend\node_modules", ".\node_modules") | ForEach-Object {
        if (Test-Path $_) {
            Remove-Item -Path $_ -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "   $_ silindi" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "Yeniden başlatmak için: .\start-dev.ps1" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Temizlik tamamlandı!" -ForegroundColor Green
