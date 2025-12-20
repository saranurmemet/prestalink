const axios = require('axios');

async function testJobsAPI() {
  try {
    console.log('🔍 API Test Başlatılıyor...\n');
    
    const apiUrl = 'http://localhost:5000/api/jobs';
    console.log(`📡 API URL: ${apiUrl}\n`);
    
    const response = await axios.get(apiUrl, {
      timeout: 5000,
      validateStatus: (status) => status < 500
    });
    
    console.log(`📊 Status Code: ${response.status}`);
    console.log(`📋 İş İlanı Sayısı: ${response.data?.length || 0}\n`);
    
    if (response.data && response.data.length > 0) {
      console.log('✅ İlk 3 İş İlanı:');
      response.data.slice(0, 3).forEach((job, i) => {
        console.log(`${i + 1}. ${job.title} - ${job.location}`);
      });
    } else {
      console.log('❌ API yanıt verdi ama iş ilanı yok');
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend çalışmıyor!');
      console.error('💡 Backend\'i başlatmak için: cd backend && npm run dev');
    } else if (error.code === 'ECONNABORTED') {
      console.error('❌ Backend yanıt vermiyor (timeout)');
    } else {
      console.error('❌ Hata:', error.message);
    }
  }
}

testJobsAPI();

