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
                    <div className="w-full">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false}
                        locale={t('auth.locale') || 'tr'}
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                      />
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

