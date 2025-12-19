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
            onClick={handleViber}
            className="group flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#665CAC] to-[#7B6FB8] text-white shadow-lg border border-[#665CAC]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:from-[#7B6FB8] hover:to-[#8B7FC8]"
            title="Viber ile iletişime geç"
            aria-label="Viber"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.066 0C7.26 0 2.506 4.645 2.506 10.351c0 3.177 1.707 5.965 4.264 7.495l-1.751 3.782c-.15.326.02.709.354.809l4.209 1.393c.144-.322.308-.63.485-.924.805-.792 1.88-1.31 3.093-1.455.484-.058 1.53-.018 2.276.27.948.37 1.89 1.004 2.606 1.869a9.803 9.803 0 002.674-.663l.084-.03-1.75-3.782c2.521-1.53 4.22-4.298 4.22-7.495C23.494 4.645 18.86 0 13.066 0zm5.975 13.526c-.163.4-.807.684-1.238.788-.43.104-2.71.527-3.133.557-.424.028-.746.04-1.076-.115-.33-.155-.76-.477-1.082-.82-.348-.366-.738-.775-1.03-1.16-.348-.447-.028-.691.256-.92.284-.23.765-.598 1.148-.898.385-.3.514-.497.78-.822.27-.325.15-.616-.075-.896-.225-.28-1.99-1.93-2.724-2.638-.927-.91-.194-1.41.145-1.857.282-.376.634-.98.847-1.31.213-.33.046-.62-.112-.896-.157-.276-.443-.652-.595-.887-.155-.235-.32-.195-.443-.12-.125.075-.267.195-.368.3-.15.157-.32.323-.453.544-.134.22-.267.475-.053.793.214.32.955 1.848 2.065 2.966 1.402 1.37 2.588 1.794 2.905 2.008.32.214.507.172.69-.08.184-.253.785-1.004.995-1.348.213-.344.428-.287.726-.175.3.11 1.903 1.072 2.227 1.265.326.195.55.293.632.457.083.163.083.947-.075 1.348z"/>
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

