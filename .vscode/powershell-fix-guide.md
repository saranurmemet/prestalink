# PowerShell Editor Services Bağlantı Hatası - Çözüm Rehberi

## Sorun
VS Code'da PowerShell Editor Services bağlantı hatası:
- "Connection failed. If the problem persists, please check your internet connection or VPN"
- "PowerShell Editor Services Client: couldn't create connection to server"

## Uygulanan Çözümler

### 1. HTTP/2 Devre Dışı Bırakıldı ✅
- `http.experimental.enableHttp2: false` ayarı eklendi
- Bu, PowerShell Editor Services'ın HTTP/2 protokolü ile yaşadığı uyumluluk sorunlarını çözer

### 2. Proxy/VPN Ayarları Yapılandırıldı ✅
- `http.proxySupport: "off"` - Proxy desteği kapatıldı
- `http.proxy: ""` - Proxy ayarı temizlendi
- `http.proxyStrictSSL: false` - SSL doğrulama gevşetildi

### 3. PowerShell Yürütülebilir Yolu Doğrulandı ✅
- Sistemde PowerShell 7 (pwsh.exe) bulunamadı
- Windows PowerShell 5.1 yolu ayarlandı: `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`

### 4. Editor Services Ayarları Optimize Edildi ✅
- Profile loading devre dışı bırakıldı (başlangıç hızlandırması)
- Loglama seviyesi "Normal" olarak ayarlandı (hata tespiti için)

## Manuel Adımlar (VS Code'da)

### Adım 1: PowerShell Eklentisini Yeniden Başlat
1. VS Code'da `Ctrl+Shift+X` ile Extensions panelini açın
2. "PowerShell" (ms-vscode.powershell) eklentisini bulun
3. "Disable" tıklayın, sonra "Enable" tıklayın
4. VS Code'u yeniden başlatın

### Adım 2: Output Loglarını Kontrol Et
1. `View > Output` menüsünü açın
2. Dropdown'dan "PowerShell" seçin
3. Hata mesajlarını kontrol edin

### Adım 3: PowerShell Eklentisini Yeniden Yükle (Gerekirse)
1. Extensions panelinde PowerShell eklentisini bulun
2. "Uninstall" tıklayın
3. VS Code'u yeniden başlatın
4. Eklentiyi tekrar yükleyin: `ms-vscode.powershell`

## Sorunun Tekrar Etmemesi İçin Öneriler

### 1. PowerShell 7 Yükleme (Önerilen)
PowerShell 7 daha modern ve stabil:
```powershell
# Winget ile yükleme
winget install --id Microsoft.PowerShell --source winget

# Veya Chocolatey ile
choco install powershell-core
```

Yüklendikten sonra `.vscode/settings.json` dosyasında şu satırı güncelleyin:
```json
"powershell.powerShellDefaultVersion": "PowerShell 7",
"powershell.powerShellAdditionalExePaths": {
  "PowerShell 7": "C:\\Program Files\\PowerShell\\7\\pwsh.exe"
}
```

### 2. VPN/Proxy Kontrolü
- VPN aktifse, VS Code'u çalıştırırken geçici olarak kapatmayı deneyin
- Kurumsal proxy kullanıyorsanız, IT departmanınızdan PowerShell Editor Services için gerekli portları açmalarını isteyin

### 3. Firewall Kontrolü
PowerShell Editor Services şu portları kullanır:
- Dinamik portlar (genellikle 50000-60000 arası)
- Windows Firewall'da bu portları kontrol edin

### 4. Antivirus Kontrolü
- Bazı antivirus yazılımları PowerShell Editor Services'ı engelleyebilir
- VS Code ve PowerShell'i antivirus istisnalarına ekleyin

## Hata Tespiti

### Log Dosyaları
PowerShell Editor Services logları şu konumda:
```
%USERPROFILE%\.vscode\extensions\ms-vscode.powershell-*\logs\
```

### Yaygın Hatalar ve Çözümleri

1. **"Connection timeout"**
   - Çözüm: Firewall/antivirus kontrolü yapın

2. **"HTTP/2 protocol error"**
   - Çözüm: `http.experimental.enableHttp2: false` ayarı zaten uygulandı ✅

3. **"Proxy authentication required"**
   - Çözüm: Proxy ayarlarını kontrol edin, gerekirse kapatın

4. **"Port already in use"**
   - Çözüm: VS Code'u tamamen kapatıp yeniden başlatın

## Test
Ayarları uyguladıktan sonra:
1. VS Code'u yeniden başlatın
2. Bir `.ps1` dosyası açın
3. PowerShell terminalini açın (`Ctrl+`` veya `Terminal > New Terminal`)
4. Output panelinde PowerShell loglarını kontrol edin

## İletişim
Sorun devam ederse:
- VS Code GitHub Issues: https://github.com/PowerShell/vscode-powershell/issues
- PowerShell Editor Services: https://github.com/PowerShell/PowerShellEditorServices



