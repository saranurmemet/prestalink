import api from './api';

// Device ID oluştur veya al
const getDeviceId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let deviceId = localStorage.getItem('prestalink-device-id');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('prestalink-device-id', deviceId);
  }
  return deviceId;
};

// Platform tespit et
const getPlatform = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/windows|mac|linux/.test(ua)) return 'desktop';
  return 'unknown';
};

// PWA yükleme kaydı
export const trackPWAInstall = async (version?: string) => {
  try {
    const deviceId = getDeviceId();
    const platform = getPlatform();
    
    await api.post('/analytics/pwa/install', {
      deviceId,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      platform,
      version: version || '3.0.0',
    });
  } catch (error) {
    console.error('PWA install tracking error:', error);
  }
};

// PWA heartbeat (aktif kullanıcı takibi)
export const sendPWAHeartbeat = async () => {
  try {
    const deviceId = getDeviceId();
    await api.post('/analytics/pwa/heartbeat', { deviceId });
  } catch (error) {
    // Sessizce hata yok say (analytics kritik değil)
  }
};

// İstatistikleri getir
export const getAnalytics = async () => {
  const response = await api.get('/analytics/stats');
  return response.data;
};

