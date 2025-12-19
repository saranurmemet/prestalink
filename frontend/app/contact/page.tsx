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
              href={`https://vb.me/213555555667?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-[#665CAC]/10 hover:bg-[#665CAC]/20 hover:border-[#665CAC]/50 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#665CAC]/20 group-hover:bg-[#665CAC] group-hover:scale-110 transition-all">
                <svg className="h-6 w-6 text-[#665CAC] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="currentColor"/>
                  <path d="M10.5 8.5c-.83 0-1.5.67-1.5 1.5v4c0 .83.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5h-3zm0 1h3c.28 0 .5.22.5.5v4c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5v-4c0-.28.22-.5.5-.5z" fill="white"/>
                  <path d="M11.5 10.5h1v3h-1v-3z" fill="currentColor" opacity="0.2"/>
                  <circle cx="8.5" cy="7.5" r="1" fill="white" opacity="0.8"/>
                  <circle cx="15.5" cy="7.5" r="1" fill="white" opacity="0.8"/>
                  <path d="M17.5 6.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-7 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" fill="white" opacity="0.5"/>
                  <path d="M18.5 5.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-7 0c0 .83-.67 1.5-1.5 1.5S8 6.33 8 5.5 8.67 4 9.5 4s1.5.67 1.5 1.5z" fill="white" opacity="0.3"/>
                  <path d="M16.5 6.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zm-5 0c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5z" fill="white" opacity="0.6"/>
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

