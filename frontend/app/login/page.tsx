'use client';

import Image from 'next/image';
import { FormEvent, useState, useEffect, useRef } from 'react';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getDashboardRoute } from '@/utils/routing';
import Link from 'next/link';
import { User, Briefcase, Shield, ChevronRight } from 'lucide-react';
import type { UserRole } from '@/services/types';

const LoginPage = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const autoLoginAttempted = useRef(false);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      setLoading(true);
      setError(null);
      // Rol parametresi gönderme - backend kullanıcının rolünü döndürecek
      const response = await loginUser({ email, password });
      setAuth(response.data);
      const dashboardRoute = getDashboardRoute(response.data.user.role);
      router.push(dashboardRoute);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      
      // Daha açıklayıcı hata mesajları
      if (!axiosError.response) {
        // Network hatası - backend'e bağlanılamıyor
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'https://prestalink.onrender.com/api');
        setError(
          t('auth.networkError') || 
          `Backend'e bağlanılamıyor. Lütfen backend'in çalıştığından emin olun. (API: ${apiUrl})`
        );
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
      <div className="page-container py-20 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brandNavy dark:text-slate-100 mb-4">{t('auth.selectLoginType')}</h1>
          <p className="text-lg text-brandGray dark:text-slate-300">{t('auth.selectLoginTypeDesc')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
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
          <p className="text-sm text-brandGray dark:text-slate-300">
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

