'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { getConnectionStatus } from '@/services/api';

const ConnectionStatus = () => {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const currentStatus = await getConnectionStatus();
      setStatus(currentStatus);
      setShow(currentStatus === 'offline');
    };

    // Check immediately
    checkStatus();

    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    // Check on online/offline events
    const handleOnline = () => checkStatus();
    const handleOffline = () => {
      setStatus('offline');
      setShow(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!show && status === 'online') return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
        status === 'offline'
          ? 'bg-red-500 text-white'
          : status === 'checking'
          ? 'bg-yellow-500 text-white'
          : 'bg-green-500 text-white'
      }`}
    >
      {status === 'checking' ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Bağlantı kontrol ediliyor...</span>
        </>
      ) : status === 'offline' ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Backend bağlantısı yok</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm">Bağlantı kuruldu</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;

