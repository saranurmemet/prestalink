'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedPage from '@/components/layout/ProtectedPage';
import UserLayout from '@/components/layout/UserLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { fetchProfile, updateProfile } from '@/services/api';
import type { User } from '@/services/types';
import { 
  AlertCircle, 
  CheckCircle2, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Briefcase, 
  FileText, 
  Upload, 
  Camera,
  Award,
  Save,
  X,
  Check
} from 'lucide-react';
import { getProfilePhotoUrl } from '@/utils/apiUrl';

const UserProfile = () => {
  const { user, setUser } = useAuthStore();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    languages: [] as string[],
    experienceLevel: '',
    bio: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        country: (user as any).country || '',
        city: (user as any).city || '',
        languages: user.languages || [],
        experienceLevel: (user as any).experienceLevel || '',
        bio: (user as any).bio || '',
      });
    }
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      formData.name,
      formData.email,
      formData.phone,
      formData.country,
      formData.city,
      formData.languages.length > 0,
      formData.experienceLevel,
      formData.bio,
      user?.profilePhoto,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const isProfileComplete = () => {
    return (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.country &&
      formData.languages.length > 0
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      if (formData.country) submitData.append('country', formData.country);
      if (formData.city) submitData.append('city', formData.city);
      formData.languages.forEach((lang) => submitData.append('languages[]', lang));
      if (formData.experienceLevel) submitData.append('experienceLevel', formData.experienceLevel);
      if (formData.bio) submitData.append('bio', formData.bio);
      if (profilePhoto) submitData.append('profilePhoto', profilePhoto);
      if (cv) submitData.append('cv', cv);
      certificates.forEach((cert) => submitData.append('certificates', cert));

      const response = await updateProfile(submitData);
      setUser(response.data.user);
      setMessage({ type: 'success', text: t('userProfile.saved') });
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || t('userProfile.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  const availableLanguages = [
    { code: 'TR', flag: '🇹🇷' },
    { code: 'EN', flag: '🇬🇧' },
    { code: 'FR', flag: '🇫🇷' },
    { code: 'DE', flag: '🇩🇪' },
    { code: 'AR', flag: '🇩🇿' },
    { code: 'ES', flag: '🇪🇸' },
    { code: 'IT', flag: '🇮🇹' },
  ];

  const experienceLevels = [
    { value: 'entry', labelKey: 'userProfile.experienceLevels.entry', icon: '🌱' },
    { value: 'mid', labelKey: 'userProfile.experienceLevels.mid', icon: '📈' },
    { value: 'senior', labelKey: 'userProfile.experienceLevels.senior', icon: '⭐' },
  ];

  const profileCompletion = calculateProfileCompletion();
  const currentPhoto = profilePhotoPreview || getProfilePhotoUrl(user?.profilePhoto);

  const content = (
    <UserLayout>
      <div className="page-container py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Professional Header */}
          <div className="mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-brandBlue to-brandBlue/80 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                {/* Profile Photo Section */}
                <div className="relative flex-shrink-0">
                  <div className="relative">
                    <img
                      src={currentPhoto}
                      alt={formData.name || 'Profile'}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white/30 shadow-2xl object-cover"
                    />
                    <label className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 rounded-full p-1.5 sm:p-2 shadow-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-brandBlue group-hover:scale-110 transition-transform" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                {/* Header Info */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                    {formData.name || t('userProfile.title')}
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg mb-3 md:mb-4">{t('userProfile.subtitle')}</p>
                  {/* Profile Completion */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-medium text-white/90">{t('userProfile.profileCompletion')}</span>
                      <span className="text-xs sm:text-sm font-bold text-white">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-lg"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {!isProfileComplete() && (
              <div className="mb-4 md:mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-l-4 border-yellow-500 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3 shadow-md">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                    {t('userProfile.profileIncomplete')}
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                    {t('userProfile.incompleteWarning')}
                  </p>
                </div>
              </div>
            )}

            {message && (
              <div
                className={`mb-4 md:mb-6 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-lg border-l-4 ${
                  message.type === 'success'
                    ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-500'
                    : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-500'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    message.type === 'success'
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Personal Information - Enhanced */}
            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brandBlue/10 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-brandBlue" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {t('userProfile.personalInformation')}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-brandBlue" />
                    {t('userProfile.fields.fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-brandBlue transition-all"
                    placeholder={t('userProfile.placeholders.name')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-brandBlue" />
                    {t('userProfile.fields.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-brandBlue transition-all"
                    placeholder={t('userProfile.placeholders.email')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-brandBlue" />
                    {t('userProfile.fields.phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-brandBlue transition-all"
                    placeholder={t('userProfile.placeholders.phone')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-brandBlue" />
                    {t('userProfile.fields.country')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder={t('userProfile.placeholders.country')}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-brandBlue transition-all"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-brandBlue" />
                    {t('userProfile.city')}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={t('userProfile.placeholders.city')}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-brandBlue transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Languages - Enhanced */}
            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {t('userProfile.fields.languages')} *
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {availableLanguages.map((lang) => {
                  const isSelected = formData.languages.includes(lang.code);
                  return (
                    <label
                      key={lang.code}
                      className={`
                        flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all
                        ${isSelected
                          ? 'border-brandBlue bg-brandBlue/10 dark:bg-brandBlue/20 shadow-md'
                          : 'border-slate-300 dark:border-slate-600 hover:border-brandBlue/50 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              languages: [...formData.languages, lang.code],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              languages: formData.languages.filter((l) => l !== lang.code),
                            });
                          }
                        }}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-brandBlue border-slate-300 rounded focus:ring-brandBlue flex-shrink-0"
                      />
                      <span className="text-xl sm:text-2xl flex-shrink-0">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{lang.code}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                          {t(`userProfile.languageNames.${lang.code}`)}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-brandBlue flex-shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Experience & Bio - Enhanced */}
            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {t('userProfile.careerInformation')}
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 text-brandBlue" />
                    {t('userProfile.fields.experienceLevel')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {experienceLevels.map((level) => {
                      const isSelected = formData.experienceLevel === level.value;
                      return (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, experienceLevel: level.value })}
                          className={`
                            p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all text-left
                            ${isSelected
                              ? 'border-brandBlue bg-brandBlue/10 dark:bg-brandBlue/20 shadow-md'
                              : 'border-slate-300 dark:border-slate-600 hover:border-brandBlue/50 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <span className="text-xl sm:text-2xl">{level.icon}</span>
                            {isSelected && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-brandBlue ml-auto" />}
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {t(level.labelKey)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brandBlue" />
                    {t('userProfile.fields.bio')}
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={5}
                    placeholder={t('userProfile.placeholders.bio')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brandBlue focus:border-brandBlue transition-all resize-none"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">
                    {formData.bio.length} / 500 {t('userProfile.characters')}
                  </p>
                </div>
              </div>
            </div>

            {/* Files - Enhanced */}
            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {t('userProfile.filesAndDocuments')}
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    {t('userProfile.fields.profilePhoto')}
                  </label>
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={currentPhoto}
                        alt="Profile"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl object-cover border-2 border-slate-300 dark:border-slate-600"
                      />
                    </div>
                    <label className="flex-1 w-full cursor-pointer">
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-brandBlue hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10 transition-all group">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 group-hover:text-brandBlue transition-colors" />
                          <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-brandBlue text-center">
                            {t('userProfile.upload.photo')}
                          </span>
                          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 text-center">
                            {t('userProfile.upload.photoHint')}
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    {t('userProfile.fields.cv')}
                  </label>
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-brandBlue hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10 transition-all group">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-brandBlue/10 flex items-center justify-center group-hover:bg-brandBlue/20 transition-colors flex-shrink-0">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-brandBlue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brandBlue truncate">
                            {cv ? cv.name : t('userProfile.upload.cv')}
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                            {t('userProfile.upload.cvHint')}
                          </p>
                        </div>
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-brandBlue flex-shrink-0" />
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setCv(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                    {t('userProfile.fields.certificates')}
                  </label>
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-brandBlue hover:bg-brandBlue/5 dark:hover:bg-brandBlue/10 transition-all group">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors flex-shrink-0">
                          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brandBlue truncate">
                            {certificates.length > 0 
                              ? `${certificates.length} ${t('userProfile.upload.certificatesSelected')}`
                              : t('userProfile.upload.certificates')
                            }
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                            {t('userProfile.upload.certificatesHint')}
                          </p>
                        </div>
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-brandBlue flex-shrink-0" />
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCertificates(Array.from(e.target.files || []))}
                      className="hidden"
                    />
                  </label>
                  {certificates.length > 0 && (
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-2">
                      {certificates.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-brandBlue/10 dark:bg-brandBlue/20 rounded-lg text-xs sm:text-sm"
                        >
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-brandBlue flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px] sm:max-w-none">{cert.name}</span>
                          <button
                            type="button"
                            onClick={() => setCertificates(certificates.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-brandBlue to-brandBlue/90 text-white rounded-lg sm:rounded-xl font-semibold hover:from-brandBlue/90 hover:to-brandBlue/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] sm:hover:scale-105 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('auth.loading')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('userProfile.save')}
                  </>
                )}
              </button>
              <Link
                href="/user/dashboard"
                className="flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all shadow-md text-sm sm:text-base"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('userProfile.cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );

  return <ProtectedPage roles={['user']}>{content}</ProtectedPage>;
};

export default UserProfile;
