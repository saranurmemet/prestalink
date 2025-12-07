#!/bin/bash

# PrestaLink Kurulum Script'i
# Bu script projeyi otomatik olarak kurar

echo "====================================="
echo "  PrestaLink Kurulum Başlatılıyor"
echo "====================================="
echo ""

# Node.js kontrolü
echo "[1/6] Node.js kontrol ediliyor..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js bulundu: $NODE_VERSION"
else
    echo "✗ Node.js bulunamadı! Lütfen Node.js'i yükleyin."
    exit 1
fi

# npm kontrolü
echo "[2/6] npm kontrol ediliyor..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm bulundu: $NPM_VERSION"
else
    echo "✗ npm bulunamadı!"
    exit 1
fi

# Backend .env dosyası oluşturma
echo "[3/6] Backend .env dosyası oluşturuluyor..."
if [ -f "backend/.env.example" ]; then
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        echo "✓ Backend .env dosyası oluşturuldu"
        echo "  ⚠ Lütfen backend/.env dosyasını düzenleyin!"
    else
        echo "✓ Backend .env dosyası zaten mevcut"
    fi
else
    echo "✗ backend/.env.example dosyası bulunamadı!"
fi

# Frontend .env.local dosyası oluşturma
echo "[4/6] Frontend .env.local dosyası oluşturuluyor..."
if [ -f "frontend/.env.example" ]; then
    if [ ! -f "frontend/.env.local" ]; then
        cp frontend/.env.example frontend/.env.local
        echo "✓ Frontend .env.local dosyası oluşturuldu"
        echo "  ⚠ Lütfen frontend/.env.local dosyasını düzenleyin!"
    else
        echo "✓ Frontend .env.local dosyası zaten mevcut"
    fi
else
    echo "✗ frontend/.env.example dosyası bulunamadı!"
fi

# Backend dependencies kurulumu
echo "[5/6] Backend dependencies kuruluyor..."
cd backend
if [ -d "node_modules" ]; then
    echo "✓ Backend node_modules zaten mevcut"
    echo "  Güncellemek için: cd backend && npm install"
else
    echo "  npm install çalıştırılıyor (bu biraz zaman alabilir)..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✓ Backend dependencies kuruldu"
    else
        echo "✗ Backend dependencies kurulumunda hata!"
    fi
fi
cd ..

# Frontend dependencies kurulumu
echo "[6/6] Frontend dependencies kuruluyor..."
cd frontend
if [ -d "node_modules" ]; then
    echo "✓ Frontend node_modules zaten mevcut"
    echo "  Güncellemek için: cd frontend && npm install"
else
    echo "  npm install çalıştırılıyor (bu biraz zaman alabilir)..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✓ Frontend dependencies kuruldu"
    else
        echo "✗ Frontend dependencies kurulumunda hata!"
    fi
fi
cd ..

echo ""
echo "====================================="
echo "  Kurulum Tamamlandı!"
echo "====================================="
echo ""
echo "Sonraki Adımlar:"
echo ""
echo "1. Environment dosyalarını düzenleyin:"
echo "   - backend/.env"
echo "   - frontend/.env.local"
echo ""
echo "2. MongoDB'yi başlatın"
echo ""
echo "3. Backend'i başlatın:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. Frontend'i başlatın (yeni terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. (İsteğe bağlı) Test verileri için:"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo "Detaylı bilgi için KURULUM_REHBERI.md dosyasına bakın."
echo ""
