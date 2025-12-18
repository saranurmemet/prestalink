'use client';

import Image from 'next/image';
import { FormEvent, useState, useEffect, useRef } from 'react';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, googleAuth } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getDashboardRoute } from '@/utils/routing';
import Link from 'next/link';
import { User, Briefcase, Shield, ShieldCheck, ChevronRight } from 'lucide-react';
import type { UserRole } from '@/services/types';

const LoginPage = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null); // Show role selection first
  const [rememberMe, setRememberMe] = useState(true); // Default to true (beni hatırla)
  const formRef = useRef<HTMLFormElement>(null);
  const autoLoginAttempted = useRef(false);
  const googleLoginRef = useRef<HTMLDivElement>(null);
  const [retryCount, setRetryCount] = useState(0);

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
    {
      value: 'admin' as UserRole,
      icon: Shield,
      titleKey: 'auth.roles.admin.title',
      descKey: 'auth.roles.admin.description',
      gradient: 'from-purple-600 to-purple-800',
    },
    {
      value: 'superadmin' as UserRole,
      icon: ShieldCheck,
      titleKey: 'auth.roles.superadmin.title',
      descKey: 'auth.roles.superadmin.description',
      gradient: 'from-red-600 to-red-800',
    },
  ];

  // URL parametrelerinden otomatik doldurma (hook'lar her zaman aynı sırada olmalı)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role') as UserRole | null;
    const emailParam = params.get('email');
    const passwordParam = params.get('password');
    const autoParam = params.get('auto') === 'true';

    if (roleParam && roles.find(r => r.value === roleParam)) {
      setSelectedRole(roleParam);
    }

    // Otomatik giriş (sadece bir kez, selectedRole set edildikten sonra)
    if (autoParam && roleParam && emailParam && passwordParam && !autoLoginAttempted.current) {
      autoLoginAttempted.current = true;
      // Form render olmasını bekle
      setTimeout(() => {
        if (formRef.current) {
          const emailInput = formRef.current.querySelector('input[name="email"]') as HTMLInputElement;
          const passwordInput = formRef.current.querySelector('input[name="password"]') as HTMLInputElement;
          const submitButton = formRef.current.querySelector('button[type="submit"]') as HTMLButtonElement;

          if (emailInput) {
            emailInput.value = emailParam;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          if (passwordInput) {
            passwordInput.value = passwordParam;
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
          }

          // Otomatik submit
          if (emailInput?.value && passwordInput?.value && submitButton) {
            setTimeout(() => {
              submitButton.click();
            }, 500);
          }
        }
      }, 1500);
    }
  }, []); // Sadece mount'ta çalış

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!selectedRole) {
        setError('Please select a role');
        setLoading(false);
        return;
      }

      if (!credentialResponse.credential) {
        setError(t('auth.googleError') || 'Google token alınamadı.');
        setLoading(false);
        return;
      }

      const response = await googleAuth(credentialResponse.credential, selectedRole);
      setAuth({ ...response.data, rememberMe: true });
      const dashboardRoute = getDashboardRoute(response.data.user.role);
      router.push(dashboardRoute);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message || 
        t('auth.googleError') || 
        'Google ile giriş yapılırken bir hata oluştu.'
      );
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(t('auth.googleError') || 'Google ile giriş yapılırken bir hata oluştu.');
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

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      setError(null);
      setLoading(true);
      setRetryCount(0); // Reset retry count on new attempt
      
      // Rol seçilmediğini kontrol et
      if (!selectedRole) {
        setError('Please select a role');
        setLoading(false);
        return;
      }
      
      // Seçilen rolü gönder - backend doğrulaması yapacak
      // Admin kartı için hem admin hem superadmin denemesi yapılıyor
      let response;
      if (selectedRole === 'admin') {
        try {
          // Önce admin olarak dene
          response = await loginUser({ email, password }, 'admin');
        } catch (adminError: any) {
          // Eğer admin olarak giriş yapılamazsa, superadmin olarak dene
          if (adminError.response?.status === 403) {
            try {
              response = await loginUser({ email, password }, 'superadmin');
            } catch (superadminError: any) {
              // Her ikisi de başarısız olursa ilk hatayı göster
              throw adminError;
            }
          } else {
            throw adminError;
          }
        }
      } else {
        response = await loginUser({ email, password }, selectedRole);
      }
      
      setAuth({ ...response.data, rememberMe });
      const dashboardRoute = getDashboardRoute(response.data.user.role);
      router.push(dashboardRoute);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      
      // Daha açıklayıcı hata mesajları
      if (!axiosError.response) {
        // Network hatası - backend'e bağlanılamıyor
        // Render free tier cold start için özel mesaj
        const errorMessage = (axiosError as any).userMessage || 
          (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')
            ? 'Server is starting up. This may take up to 60 seconds. Please wait and try again.'
            : 'Cannot connect to server. Please check your internet connection and try again.');
        setError(
          t('auth.networkError') || errorMessage
        );
        // Retry için count artır (max 2 retry)
        if (retryCount < 2 && (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout'))) {
          setRetryCount(retryCount + 1);
          // 5 saniye sonra otomatik retry
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.requestSubmit();
            }
          }, 5000);
        }
      } else if (axiosError.response.status === 401) {
        setError(
          axiosError.response.data?.message || 
          t('auth.invalidCredentials') || 
          'Email veya şifre hatalı. Lütfen tekrar deneyin.'
        );
      } else if (axiosError.response.status === 403) {
        setError(
          axiosError.response.data?.message || 
          t('auth.forbidden') || 
          'Bu rol için giriş yapma yetkiniz yok.'
        );
      } else if (axiosError.response.status >= 500) {
        setError(
          t('auth.serverError') || 
          'Sunucu hatası. Lütfen daha sonra tekrar deneyin.'
        );
      } else {
        setError(
          axiosError.response?.data?.message || 
          t('auth.error') || 
          'Bir hata oluştu. Lütfen tekrar deneyin.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="page-container py-20 animate-fade-in px-4 sm:px-6">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-brandNavy dark:text-slate-100 mb-4">{t('auth.selectLoginType')}</h1>
          <p className="text-base sm:text-lg text-brandGray dark:text-slate-300">{t('auth.selectLoginTypeDesc')}</p>
        </div>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <button
                key={role.value}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedRole(role.value);
                }}
                className="glass-panel p-5 sm:p-6 md:p-8 text-center card-hover group animate-fade-in relative overflow-hidden cursor-pointer"
                style={{ animationDelay: `${roles.indexOf(role) * 0.1}s` }}
              >
                <div className={`mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${role.gradient} text-white transition-transform duration-300 group-hover:scale-110 shadow-lg pointer-events-none`}>
                  <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" strokeWidth={2.5} />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-brandNavy dark:text-slate-100 mb-2 pointer-events-none">{t(role.titleKey)}</h3>
                <p className="text-xs sm:text-sm text-brandGray dark:text-slate-300 mb-3 sm:mb-4 leading-relaxed min-h-[3rem] sm:min-h-[3.5rem] pointer-events-none">{t(role.descKey)}</p>
                <div className="flex items-center justify-center gap-2 text-brandBlue font-semibold text-xs sm:text-sm md:text-base mt-auto pointer-events-none">
                  <span>{t('auth.continue')}</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
        <div className="text-center mt-8 sm:mt-10 px-4">
          <p className="text-sm sm:text-base text-brandGray dark:text-slate-300">
            {t('auth.registerPrompt')}{' '}
            <Link href="/register" className="font-semibold text-brandBlue hover:underline">
              {t('auth.register')}
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
              <span>←</span>
              <span>{t('auth.backToRoleSelection')}</span>
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <IconComponent className="h-8 w-8" />
              </div>
              <div>
                <p className="text-2xl font-semibold leading-tight">{t(selectedRoleData?.titleKey || 'auth.loginTitle')}</p>
                <p className="text-white/80 text-sm mt-1">{t(selectedRoleData?.descKey || 'hero.subtitle')}</p>
              </div>
            </div>
            <Image src="/assets/logo.jpeg" alt="PrestaLink logo" width={64} height={64} className="drop-shadow-md animate-scale-in rounded-lg opacity-90" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 px-10 py-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div>
            <h2 className="text-2xl font-bold text-brandNavy dark:text-slate-100 mb-2">{t('auth.login')}</h2>
            <p className="text-sm text-brandGray dark:text-slate-300">{t('auth.loginSubtitle')}</p>
          </div>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-brandGray dark:text-slate-300">{t('auth.email')}</label>
              <input name="email" type="email" required className="input mt-1" placeholder="ornek@email.com" />
            </div>
            <div>
              <label className="text-sm font-semibold text-brandGray dark:text-slate-300">{t('auth.password')}</label>
              <input name="password" type="password" required className="input mt-1" placeholder="••••••••" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-brandBlue border-slate-300 rounded focus:ring-brandBlue focus:ring-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-brandGray dark:text-slate-300 cursor-pointer">
                {t('auth.rememberMe')}
              </label>
            </div>
            {error && <p className="text-sm text-red-500 dark:text-red-400 animate-fade-in">{error}</p>}
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
                t('auth.login')
              )}
            </button>
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (selectedRole === 'user' || selectedRole === 'recruiter') && (
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
                          
                          // Method 1: Try to find and click GoogleLogin button in ref
                          const tryClickGoogleButton = () => {
                            if (!googleLoginRef.current) return false;
                            
                            // Try various selectors
                            const selectors = [
                              'button',
                              '[role="button"]',
                              'div[role="button"]',
                              'div > button',
                              'div > div > button',
                              '[id*="google"] button',
                              '[class*="google"] button'
                            ];
                            
                            for (const selector of selectors) {
                              const button = googleLoginRef.current.querySelector(selector) as HTMLElement;
                              if (button && button.offsetParent !== null) {
                                button.click();
                                return true;
                              }
                            }
                            
                            // Try to find by traversing all children
                            const allButtons = googleLoginRef.current.querySelectorAll('button, [role="button"]');
                            for (const btn of Array.from(allButtons)) {
                              const btnElement = btn as HTMLElement;
                              if (btnElement.offsetParent !== null || btnElement.style.display !== 'none') {
                                btnElement.click();
                                return true;
                              }
                            }
                            
                            return false;
                          };
                          
                          // Method 2: Search entire document for Google OAuth button
                          const searchDocument = () => {
                            const allButtons = document.querySelectorAll('button, [role="button"]');
                            for (const btn of Array.from(allButtons)) {
                              const btnElement = btn as HTMLElement;
                              const parent = btnElement.closest('div');
                              
                              // Check if it's likely a Google OAuth button
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
                          };
                          
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
                          {t('auth.googleSignIn') || 'Google ile devam et'}
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
            <p className="text-center text-sm text-brandGray dark:text-slate-300">
              {t('auth.registerPrompt')}{' '}
              <Link href="/register" className="font-semibold text-brandBlue hover:underline">
                {t('auth.register')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

