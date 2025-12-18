'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState, useEffect, useRef } from 'react';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { registerUser, googleAuth } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getDashboardRoute } from '@/utils/routing';
import { User, Briefcase, ChevronRight, ArrowLeft } from 'lucide-react';
import type { UserRole } from '@/services/types';

const RegisterPage = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const googleLoginRef = useRef<HTMLDivElement>(null);

  const roles = [
    {
      value: 'user' as UserRole,
      icon: User,
      titleKey: 'auth.roles.user.title',
      descKey: 'auth.roles.user.description',
      gradient: 'from-brandBlue to-brandBlueDark',
    },
    {
      value: 'recruiter' as UserRole,
      icon: Briefcase,
      titleKey: 'auth.roles.recruiter.title',
      descKey: 'auth.roles.recruiter.description',
      gradient: 'from-brandOrange to-orange-600',
    },
  ];

  // Reset selected languages when role changes
  useEffect(() => {
    if (selectedRole !== 'user') {
      setSelectedLanguages([]);
    }
  }, [selectedRole]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!selectedRole) {
        setError(t('auth.selectRole') || 'Please select a role');
        setLoading(false);
        return;
      }

      if (!credentialResponse.credential) {
        setError(t('auth.googleError') || 'Google token alınamadı.');
        setLoading(false);
        return;
      }

      console.log('🔄 [GOOGLE_AUTH] Attempting Google authentication with role:', selectedRole);
      const response = await googleAuth(credentialResponse.credential, selectedRole);
      console.log('✅ [GOOGLE_AUTH] Success:', response.data);
      setAuth({ ...response.data, rememberMe: true });
      const dashboardRoute = getDashboardRoute(response.data.user.role);
      router.push(dashboardRoute);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 
        axiosError.message || 
        t('auth.googleRegisterError') || 
        'Google ile kayıt yapılırken bir hata oluştu.';
      console.error('❌ [GOOGLE_AUTH] Error:', error);
      console.error('❌ [GOOGLE_AUTH] Error response:', axiosError.response?.data);
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(t('auth.googleRegisterError') || 'Google ile kayıt yapılırken bir hata oluştu.');
    setLoading(false);
  };

  // Function to trigger Google login programmatically
  const triggerGoogleLogin = () => {
    // Try multiple methods to find and click the Google button
    const methods = [
      // Method 1: Find in ref
      () => {
        if (!googleLoginRef.current) return false;
        const button = googleLoginRef.current.querySelector('button, [role="button"], div[role="button"]') as HTMLElement;
        if (button) {
          button.click();
          return true;
        }
        return false;
      },
      // Method 2: Find by iframe (GoogleLogin might use iframe)
      () => {
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of Array.from(iframes)) {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              const button = iframeDoc.querySelector('button, [role="button"]') as HTMLElement;
              if (button) {
                button.click();
                return true;
              }
            }
          } catch (e) {
            // Cross-origin iframe, skip
          }
        }
        return false;
      },
      // Method 3: Search entire document
      () => {
        const allButtons = document.querySelectorAll('button, [role="button"]');
        for (const btn of Array.from(allButtons)) {
          const btnElement = btn as HTMLElement;
          const parent = btnElement.parentElement;
          if (
            btnElement.getAttribute('aria-labelledby')?.includes('google') ||
            parent?.id?.includes('google') ||
            parent?.className?.includes('google') ||
            btnElement.closest('[id*="google"], [class*="google"]')
          ) {
            btnElement.click();
            return true;
          }
        }
        return false;
      },
      // Method 4: Try to find by data attributes
      () => {
        const googleElements = document.querySelectorAll('[data-google], [id*="google"], [class*="google"]');
        for (const el of Array.from(googleElements)) {
          const button = el.querySelector('button, [role="button"]') as HTMLElement;
          if (button) {
            button.click();
            return true;
          }
        }
        return false;
      }
    ];

    // Try each method
    for (const method of methods) {
      if (method()) return true;
    }

    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRole) {
      setError(t('auth.selectRole') || 'Please select a role');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      languages: selectedRole === 'user' ? selectedLanguages : [],
      role: selectedRole,
    };

    try {
      setLoading(true);
      const response = await registerUser(payload);
      setAuth(response.data);
      const dashboardRoute = getDashboardRoute(response.data.user.role);
      router.push(dashboardRoute);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="page-container py-20 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brandNavy dark:text-slate-100 mb-4">{t('auth.selectRegisterType')}</h1>
          <p className="text-lg text-brandGray dark:text-slate-300">{t('auth.selectRegisterTypeDesc')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className="glass-panel p-8 text-center card-hover group animate-fade-in"
                style={{ animationDelay: `${roles.indexOf(role) * 0.1}s` }}
              >
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${role.gradient} text-white transition-transform duration-300 group-hover:scale-110`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-brandNavy dark:text-slate-100 mb-2">{t(role.titleKey)}</h3>
                <p className="text-sm text-brandGray dark:text-slate-300 mb-4">{t(role.descKey)}</p>
                <div className="flex items-center justify-center gap-2 text-brandBlue font-semibold">
                  <span>{t('auth.continue')}</span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-brandGray dark:text-slate-300 mb-2">
            {t('auth.adminRegisterNote')}
          </p>
          <p className="text-sm text-brandGray dark:text-slate-300">
            {t('auth.loginPrompt')}{' '}
            <Link href="/login" className="font-semibold text-brandBlue hover:underline">
              {t('nav.login')}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const selectedRoleData = roles.find((r) => r.value === selectedRole);
  const IconComponent = selectedRoleData?.icon || User;

  return (
    <div className="page-container py-20 animate-fade-in">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[40px] border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 shadow-card md:flex-row animate-scale-in">
        <div className={`flex flex-1 flex-col justify-center gap-6 bg-gradient-to-br ${selectedRoleData?.gradient || 'from-brandBlue to-brandBlueDark'} px-10 py-12 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent opacity-50" />
          <div className="relative animate-slide-up">
            <button
              onClick={() => setSelectedRole(null)}
              className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{t('auth.backToRoleSelection')}</span>
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <IconComponent className="h-8 w-8" />
              </div>
              <div>
                <p className="text-2xl font-semibold leading-tight">{t('auth.registerTitle')}</p>
                <p className="text-white/80 text-sm mt-1">{t(selectedRoleData?.descKey || 'hero.subtitle')}</p>
              </div>
            </div>
            <Image src="/assets/logo.jpeg" alt="PrestaLink logo" width={64} height={64} className="drop-shadow-md animate-scale-in rounded-lg opacity-90" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 px-10 py-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div>
            <h2 className="text-2xl font-bold text-brandNavy dark:text-slate-100 mb-2">{t('auth.register')}</h2>
            <p className="text-sm text-brandGray dark:text-slate-300">{t('auth.registerSubtitle')}</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-brandGray dark:text-slate-300">{t('auth.name')}</label>
              <input name="name" type="text" required className="input mt-1" placeholder={t('auth.namePlaceholder') || 'Adınız'} />
            </div>
            <div>
              <label className="text-sm font-semibold text-brandGray dark:text-slate-300">{t('auth.phone')}</label>
              <input name="phone" type="tel" required className="input mt-1" placeholder="+90 555 123 45 67" />
            </div>
            <div>
              <label className="text-sm font-semibold text-brandGray dark:text-slate-300">{t('auth.email')}</label>
              <input name="email" type="email" required className="input mt-1" placeholder="ornek@email.com" />
            </div>
            <div>
              <label className="text-sm font-semibold text-brandGray dark:text-slate-300">{t('auth.password')}</label>
              <input name="password" type="password" required className="input mt-1" placeholder="••••••••" minLength={6} />
            </div>
            {selectedRole === 'user' && (
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-brandGray dark:text-slate-300 mb-2 block">
                  {t('auth.languages')?.replace('(virgülle ayırın)', '') || 'Diller'}
                </label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {[
                    { code: 'EN', label: 'English' },
                    { code: 'TR', label: 'Türkçe' },
                    { code: 'FR', label: 'Français' },
                    { code: 'AR', label: 'العربية' },
                  ].map((lang) => (
                    <label
                      key={lang.code}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(lang.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLanguages([...selectedLanguages, lang.code]);
                          } else {
                            setSelectedLanguages(selectedLanguages.filter((l) => l !== lang.code));
                          }
                        }}
                        className="w-4 h-4 text-brandBlue border-slate-300 rounded focus:ring-brandBlue focus:ring-2 cursor-pointer"
                      />
                      <span className="text-sm text-brandGray dark:text-slate-300 group-hover:text-brandBlue dark:group-hover:text-brandBlue transition-colors">
                        {lang.code} - {lang.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {error && (
              <div className="sm:col-span-2">
                <p className="text-sm text-red-500 dark:text-red-400 animate-fade-in">{error}</p>
              </div>
            )}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('auth.loading')}
                  </span>
                ) : (
                  t('auth.register')
                )}
              </button>
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white dark:bg-slate-800 text-brandGray dark:text-slate-300 font-medium">
                        {t('auth.or') || 'veya'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative group w-full">
                      {/* Hidden GoogleLogin for OAuth flow - Must be rendered for OAuth to work */}
                      <div ref={googleLoginRef} className="absolute opacity-0 pointer-events-none overflow-hidden" style={{ width: '1px', height: '1px', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleError}
                          useOneTap={false}
                          locale={t('auth.locale') || 'tr'}
                        />
                      </div>
                      
                      {/* Custom Modern Google Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          // Try immediately with all methods
                          if (triggerGoogleLogin()) return;
                          
                          // Wait a bit and try again (GoogleLogin might be async)
                          setTimeout(() => {
                            if (triggerGoogleLogin()) return;
                            
                            // If still not found, show error
                            setError('Google login could not be triggered. Please ensure Google Client ID is configured.');
                            console.error('Google login button not found after multiple attempts');
                          }, 300);
                        }}
                        className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-slate-300 dark:hover:border-slate-500 active:scale-[0.98] overflow-hidden"
                      >
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-red-50 to-yellow-50 dark:from-blue-950/20 dark:via-red-950/20 dark:to-yellow-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Google Logo/Icon */}
                        <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center">
                          <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        </div>
                        
                        {/* Text */}
                        <span className="relative text-base font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                          {t('auth.googleSignIn') || 'Google ile kayıt ol'}
                        </span>
                        
                        {/* Hover effect arrow */}
                        <div className="relative flex-shrink-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                          <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                        
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </button>
                    </div>
                  </div>
                </>
              )}
              <p className="mt-3 text-center text-sm text-brandGray dark:text-slate-300">
                {t('auth.loginPrompt')}{' '}
                <Link href="/login" className="font-semibold text-brandBlue hover:underline">
                  {t('nav.login')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

