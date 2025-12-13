"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, FileText, CheckCircle2, TrendingUp, Award, Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function HeroPreview() {
  const { t } = useLanguage();
  
  return (
    <div className="relative w-full max-w-2xl">
      {/* Animated floating cards in background */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute -left-4 top-8 z-0 w-48 rounded-2xl border border-slate-200/50 bg-white/60 p-4 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/40"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
            <Award className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-300">Yeni Teklif</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">€3,200</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute -right-4 bottom-12 z-0 w-52 rounded-2xl border border-slate-200/50 bg-white/60 p-4 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/40"
      >
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mb-2">
          <MapPin className="h-3 w-3" />
          <span>Yeni İş Fırsatı</span>
        </div>
        <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Elektrikçi</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Münih, Almanya</div>
        <div className="mt-2 flex items-center gap-1">
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full w-3/4 rounded-full bg-orange-500"></div>
          </div>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">75%</span>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute -inset-8 rounded-[36px] bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-orange-500/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 rounded-[28px] border border-slate-200/70 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60"
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-500/15">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('heroPreview.title')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-300">
                {t('heroPreview.subtitle')}
              </div>
            </div>
          </div>

          <div className="rounded-full border border-slate-200/70 bg-white/70 px-3 py-1.5 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <span className="font-semibold text-emerald-600">●</span> 128 online
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Briefcase className="h-4 w-4" /> {t('heroPreview.matchedJobs')}
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">24</div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-900/10 dark:bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-blue-600/80 dark:bg-blue-500/80"
                initial={{ width: "0%" }}
                animate={{ width: "72%" }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">{t('heroPreview.applicationsSent')}: 72%</div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <FileText className="h-4 w-4" /> {t('heroPreview.cvScore')}
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">86%</div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-900/10 dark:bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-orange-500/80 dark:bg-orange-400/80"
                initial={{ width: "0%" }}
                animate={{ width: "63%" }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
              />
            </div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">{t('heroPreview.successRate')}: 63%</div>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-xs text-slate-700 dark:bg-white/5 dark:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('heroPreview.recruitersOnline')}
            </div>
            <span className="font-semibold">+18</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-xs text-slate-700 dark:bg-white/5 dark:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {t('heroPreview.interviewScheduled')}
            </div>
            <span className="text-slate-500 dark:text-slate-300">{t('heroPreview.timeAgo')}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-3 py-2 text-xs border border-blue-200/50 dark:border-blue-700/50"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-200">Aktif Başvuru</span>
            </div>
            <span className="font-semibold text-blue-700 dark:text-blue-300">12</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-6 flex items-center justify-around rounded-2xl border border-slate-200/50 bg-white/60 p-4 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/40"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">150+</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Aktif İş</div>
        </div>
        <div className="h-10 w-px bg-slate-300 dark:bg-slate-600"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">94%</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Başarı Oranı</div>
        </div>
        <div className="h-10 w-px bg-slate-300 dark:bg-slate-600"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">48h</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Ort. Yanıt</div>
        </div>
      </motion.div>
    </div>
  );
}
