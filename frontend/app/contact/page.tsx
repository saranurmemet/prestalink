'use client';

import { FormEvent, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import { submitContact } from '@/services/api';

const ContactPage = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Telefon diline göre WhatsApp mesajı seç
  const getWhatsAppMessage = () => {
    if (typeof window === 'undefined') return t('contact.whatsappMessage') || 'Hello, I would like to get information about PrestaLink.';
    
    const browserLang = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase();
    
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
  
  const whatsappMessage = getWhatsAppMessage();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    try {
      await submitContact({ name, email, message });
      setStatus({ type: 'success', message: t('contact.success') });
      event.currentTarget.reset();
    } catch (error: any) {
      console.error('Contact form error:', error);
      const errorMessage = error.response?.data?.message || error.userMessage || error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-20 animate-fade-in">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="glass-panel space-y-4 p-8 animate-slide-up">
          <h1 className="section-title dark:text-white">{t('contact.title')}</h1>
          <p className="text-lg text-brandGray dark:text-slate-200">{t('contact.subtitle')}</p>
          <div className="space-y-4 mt-6">
            <a
              href="mailto:hello@prestalink.com"
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10 hover:border-brandBlue/30 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brandBlue/10 dark:bg-brandBlue/20 group-hover:bg-brandBlue group-hover:scale-110 transition-all">
                <Mail className="h-6 w-6 text-brandBlue group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm text-brandGray dark:text-slate-400">Email</p>
                <p className="font-semibold text-brandNavy dark:text-slate-100 group-hover:text-brandBlue transition-colors">hello@prestalink.com</p>
              </div>
            </a>
            
            <a
              href="tel:+213555555667"
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10 hover:border-brandBlue/30 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brandBlue/10 dark:bg-brandBlue/20 group-hover:bg-brandBlue group-hover:scale-110 transition-all">
                <Phone className="h-6 w-6 text-brandBlue group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm text-brandGray dark:text-slate-400">Telefon</p>
                <p className="font-semibold text-brandNavy dark:text-slate-100 group-hover:text-brandBlue transition-colors">+213 555 55 56 67</p>
              </div>
            </a>

            <a
              href={`https://wa.me/213555555667?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-[#25D366]/10 hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/20 group-hover:bg-[#25D366] group-hover:scale-110 transition-all">
                <MessageCircle className="h-6 w-6 text-[#25D366] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm text-brandGray dark:text-slate-400">WhatsApp</p>
                <p className="font-semibold text-brandNavy dark:text-slate-100 group-hover:text-[#25D366] transition-colors">WhatsApp ile Hızlı İletişim</p>
              </div>
            </a>

            <a
              href="https://t.me/+213555555667"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 hover:border-[#0088cc]/50 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0088cc]/20 group-hover:bg-[#0088cc] group-hover:scale-110 transition-all">
                <svg className="h-6 w-6 text-[#0088cc] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-brandGray dark:text-slate-400">Telegram</p>
                <p className="font-semibold text-brandNavy dark:text-slate-100 group-hover:text-[#0088cc] transition-colors">Telegram ile İletişime Geç</p>
              </div>
            </a>

            <a
              href="https://vb.me/213555555667"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-[#665CAC]/10 hover:bg-[#665CAC]/20 hover:border-[#665CAC]/50 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#665CAC]/20 group-hover:bg-[#665CAC] group-hover:scale-110 transition-all">
                <svg className="h-6 w-6 text-[#665CAC] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.066 0C7.26 0 2.506 4.645 2.506 10.351c0 3.177 1.707 5.965 4.264 7.495l-1.751 3.782c-.15.326.02.709.354.809l4.209 1.393c.144-.322.308-.63.485-.924.805-.792 1.88-1.31 3.093-1.455.484-.058 1.53-.018 2.276.27.948.37 1.89 1.004 2.606 1.869a9.803 9.803 0 002.674-.663l.084-.03-1.75-3.782c2.521-1.53 4.22-4.298 4.22-7.495C23.494 4.645 18.86 0 13.066 0zm5.975 13.526c-.163.4-.807.684-1.238.788-.43.104-2.71.527-3.133.557-.424.028-.746.04-1.076-.115-.33-.155-.76-.477-1.082-.82-.348-.366-.738-.775-1.03-1.16-.348-.447-.028-.691.256-.92.284-.23.765-.598 1.148-.898.385-.3.514-.497.78-.822.27-.325.15-.616-.075-.896-.225-.28-1.99-1.93-2.724-2.638-.927-.91-.194-1.41.145-1.857.282-.376.634-.98.847-1.31.213-.33.046-.62-.112-.896-.157-.276-.443-.652-.595-.887-.155-.235-.32-.195-.443-.12-.125.075-.267.195-.368.3-.15.157-.32.323-.453.544-.134.22-.267.475-.053.793.214.32.955 1.848 2.065 2.966 1.402 1.37 2.588 1.794 2.905 2.008.32.214.507.172.69-.08.184-.253.785-1.004.995-1.348.213-.344.428-.287.726-.175.3.11 1.903 1.072 2.227 1.265.326.195.55.293.632.457.083.163.083.947-.075 1.348z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-brandGray dark:text-slate-400">Viber</p>
                <p className="font-semibold text-brandNavy dark:text-slate-100 group-hover:text-[#665CAC] transition-colors">Viber ile İletişime Geç</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brandBlue/10 dark:bg-brandBlue/20">
                <MapPin className="h-6 w-6 text-brandBlue" />
              </div>
              <div>
                <p className="text-sm text-brandGray dark:text-slate-400">Konum</p>
                <p className="font-semibold text-brandNavy dark:text-slate-100">Brussels, Belgium</p>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="glass-panel space-y-4 p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div>
            <label className="text-sm font-semibold text-brandGray dark:text-slate-300">{t('contact.name')}</label>
            <input name="name" type="text" required className="input mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brandGray dark:text-slate-300">{t('contact.email')}</label>
            <input name="email" type="email" required className="input mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brandGray dark:text-slate-300">{t('contact.message')}</label>
            <textarea name="message" required rows={5} className="input mt-1 resize-none" />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-full bg-brandBlue py-3 font-semibold text-white shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brandBlue/30 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('common.loading') || 'Gönderiliyor...' : t('contact.submit')}
          </button>
          {status && (
            <p className={`text-sm animate-fade-in ${
              status.type === 'success' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;

