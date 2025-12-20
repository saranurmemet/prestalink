// Frontend hazır olana kadar bekleyip test başlatır
const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function waitForFrontend(maxAttempts = 60) {
  console.log('⏳ Frontend bekleniyor...');
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await axios.get('http://localhost:3000', { timeout: 3000 });
      if (response.status === 200) {
        console.log('✅ Frontend hazır!');
        return true;
      }
    } catch (e) {
      // Henüz hazır değil
    }
    process.stdout.write(`\r   Deneme ${i + 1}/${maxAttempts}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log('\n❌ Frontend hazır değil!');
  return false;
}

async function main() {
  console.log('\n🚀 PRESTALINK AUTO-TEST');
  console.log('='.repeat(60));
  
  // Backend kontrolü
  try {
    await axios.get('http://localhost:5000', { timeout: 3000 });
    console.log('✅ Backend hazır!');
  } catch (e) {
    console.log('❌ Backend hazır değil!');
    console.log('   Lütfen: cd backend && node server.js');
    process.exit(1);
  }
  
  // Frontend bekleniyor
  const frontendReady = await waitForFrontend();
  
  if (!frontendReady) {
    console.log('\n💡 Frontend\'i manuel başlatın:');
    console.log('   cd frontend');
    console.log('   npm run dev');
    console.log('\n   Sonra test script\'ini çalıştırın:');
    console.log('   node scripts/comprehensive-test.js');
    process.exit(1);
  }
  
  // Test başlat
  console.log('\n🚀 Test başlatılıyor (tarayıcı açılacak)...');
  console.log('🌐 Tarayıcı otomatik açılacak ve testler çalışacak\n');
  
  const { exec } = require('child_process');
  const testProcess = exec('node scripts/comprehensive-test.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Test hatası: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Test stderr: ${stderr}`);
    }
  });
  
  testProcess.stdout.pipe(process.stdout);
  testProcess.stderr.pipe(process.stderr);
}

main().catch(console.error);













