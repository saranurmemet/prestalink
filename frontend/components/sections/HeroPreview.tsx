"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, FileText, CheckCircle2, TrendingUp } from "lucide-react";

export default function HeroPreview() {
  return (
    <div className="relative w-full max-w-xl">
      <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-orange-500/15 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-[28px] border border-slate-200/70 bg-white/80 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40"
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-500/15">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Live Hiring Dashboard
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-300">
                Jobs • Applications • Status
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
              <Briefcase className="h-4 w-4" /> Matched Jobs
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
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">Applications sent: 72%</div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <FileText className="h-4 w-4" /> CV Score
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
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">Success rate: 63%</div>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-2">
          <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-xs text-slate-700 dark:bg-white/5 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recruiters online
            </div>
            <span className="font-semibold">+18</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-xs text-slate-700 dark:bg-white/5 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Interview scheduled
            </div>
            <span className="text-slate-500 dark:text-slate-300">5m ago</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
