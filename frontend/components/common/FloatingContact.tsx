'use client';

import { MessageCircle, Phone, Settings, Mail, Headphones } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useFloatingContactStore } from '@/store/useFloatingContactStore';

interface FloatingContactProps {
  phoneNumber?: string;
  telegramUsername?: string;
  viberNumber?: string;
  message?: string;
  showSettingsHint?: boolean;
}

const FloatingContact = ({ 
  phoneNumber = '+213555555667',
  telegramUsername = '+213555555667',
  viberNumber = '+213555555667',
  message,
  showSettingsHint = true
}: FloatingContactProps) => {
  const { isOpen, toggle, close } = useFloatingContactStore();
  const [showHint, setShowHint] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  
  // Telefon diline göre mesaj seç
  const getDefaultMessage = () => {
    if (message) return message;
    
    // Telefon dilini tespit et
    const browserLang = typeof window !== 'undefined' 
      ? (navigator.language || navigator.languages?.[0] || 'en').toLowerCase()
      : 'en';
    
    // Dil koduna göre mesaj seç
    if (browserLang.startsWith('ar')) {
      return t('contact.whatsappMessage') || 'مرحباً، أود الحصول على معلومات حول PrestaLink.';
    } else if (browserLang.startsWith('fr')) {
      return t('contact.whatsappMessage') || 'Bonjour, je souhaite obtenir des informations sur PrestaLink.';
    } else if (browserLang.startsWith('tr')) {
      return t('contact.whatsappMessage') || 'Merhaba, PrestaLink hakkında bilgi almak istiyorum.';
    } else {
      return t('contact.whatsappMessage') || 'Hello, I would like to get information about PrestaLink.';
    }
  };
  
  const defaultMessage = getDefaultMessage();

  // User dashboard pages already have a bottom nav.
  // Hide the floating launcher there and let the bottom nav trigger the panel.
  const hideLauncher = !!pathname?.startsWith('/user');
  const containerBottomClass = hideLauncher ? 'bottom-20' : 'bottom-4';
  
  const handleWhatsApp = () => {
    const msg = message || defaultMessage;
    const encodedMessage = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleTelegram = () => {
    const msg = message || defaultMessage;
    const encodedMessage = encodeURIComponent(msg);
    // Telefon numarası ile
    const tel = phoneNumber.replace(/[^0-9]/g, '');
    const telegramUrl = `https://t.me/+${tel}?text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
  };

  const handleViber = () => {
    const msg = message || defaultMessage;
    const encodedMessage = encodeURIComponent(msg);
    const tel = viberNumber.replace(/[^0-9]/g, '') || phoneNumber.replace(/[^0-9]/g, '');
    // Viber desktop/web için - mesaj parametresi ekle
    const viberWebUrl = `https://vb.me/${tel}?text=${encodedMessage}`;
    // Önce web versiyonunu dene, mobil cihazlarda otomatik uygulamaya yönlendirir
    window.open(viberWebUrl, '_blank');
  };

  const handlePhone = () => {
    const tel = phoneNumber.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${tel}`;
  };

  const handleSettingsClick = () => {
    router.push('/user/settings');
    setShowHint(false);
  };

  return (
    <div className={`fixed ${containerBottomClass} right-4 sm:bottom-6 sm:right-6 z-50`}>
      {/* Settings Hint Message */}
      {showSettingsHint && showHint && !isOpen && !hideLauncher && (
        <div className="mb-2 mr-12 sm:mr-16 flex items-center animate-fade-in">
          <button
            onClick={handleSettingsClick}
            className="text-slate-300 dark:text-slate-400 text-xs sm:text-sm hover:text-slate-200 dark:hover:text-slate-300 transition-colors"
            onMouseEnter={() => setShowHint(true)}
          >
            Ayarlar'a gidin.
          </button>
        </div>
      )}

      {/* Contact Buttons - Kurumsal Tasarım */}
      {isOpen && (
        <div className="mb-3 sm:mb-4 space-y-2 sm:space-y-3 animate-fade-in">
          <button
            onClick={handlePhone}
            className="group flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brandBlue to-blue-700 text-white shadow-lg border border-blue-400/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:from-blue-600 hover:to-blue-800"
            title="Telefon ile arayın"
            aria-label="Telefon"
          >
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </button>

          <button
            onClick={handleWhatsApp}
            className="group flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg border border-emerald-400/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:from-emerald-500 hover:to-emerald-600"
            title="WhatsApp ile iletişime geç"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </button>
          
          <button
            onClick={handleTelegram}
            className="group flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border border-blue-300/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:from-blue-400 hover:to-blue-500"
            title="Telegram ile iletişime geç"
            aria-label="Telegram"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </button>

          <button
            onClick={() => window.location.href = 'mailto:info@prestalink.com'}
            className="group flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-lg border border-slate-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:from-slate-600 hover:to-slate-700"
            title="E-posta gönder"
            aria-label="E-posta"
          >
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Main Toggle Button - Kurumsal Tasarım */}
      {!hideLauncher && (
      <div className="relative">
        <button
          onClick={() => {
            toggle();
            if (!isOpen) setShowHint(false);
          }}
          className={`group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
            isOpen 
              ? 'bg-brandOrange rotate-90' 
              : 'bg-gradient-to-br from-brandBlue to-blue-700 hover:from-blue-600 hover:to-blue-800 border-2 border-blue-400/30'
          }`}
          aria-label="İletişim seçenekleri"
          title="İletişime geç"
        >
          {isOpen ? (
            <span className="text-xl sm:text-2xl font-bold" onClick={close}>×</span>
          ) : (
            <>
              <Headphones className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center">
                <span className="absolute h-4 w-4 sm:h-5 sm:w-5 animate-ping rounded-full bg-red-500 opacity-60"></span>
                <span className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500 border-2 border-white"></span>
              </span>
            </>
          )}
        </button>
      </div>
      )}
    </div>
  );
};

export default FloatingContact;

