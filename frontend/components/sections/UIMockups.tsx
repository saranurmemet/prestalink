'use client';

import { User, Briefcase, BarChart3, Check, Clock, Circle } from 'lucide-react';

const UIMockups = () => {

  // Web/Desktop mockup items
  const desktopItems = [
    { title: 'John Doe', subtitle: 'Software Engineer', status: 'active', badge: 'NEW' },
    { title: 'Sarah Miller', subtitle: 'UX Designer', status: 'review', badge: null },
    { title: 'Ahmed Hassan', subtitle: 'Data Analyst', status: 'active', badge: null },
    { title: 'Maria Garcia', subtitle: 'Product Manager', status: 'pending', badge: null },
  ];

  // Mobile app items
  const mobileItems = [
    { title: 'Senior Developer', location: 'Berlin, DE', salary: '€65K' },
    { title: 'Product Designer', location: 'Paris, FR', salary: '€55K' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center animate-fade-in">
      {/* Desktop/Web Mockup */}
      <div className="relative w-full max-w-sm">
        <div className="glass-panel rounded-2xl p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200/80 dark:border-slate-700/80 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-brandBlue/20 dark:bg-brandBlue/30 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-brandBlue" />
              </div>
              <span className="text-xs font-semibold text-brandGray dark:text-slate-300">Dashboard</span>
            </div>
            <div className="h-2 w-2 rounded-full bg-brandGray/30 dark:bg-slate-500/30"></div>
          </div>

          {/* List Items */}
          <div className="space-y-3">
            {desktopItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/80 dark:bg-slate-700/80 border border-white/60 dark:border-slate-600/60 hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-brandBlue/10 dark:bg-brandBlue/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-brandBlue" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-brandNavy dark:text-slate-100 truncate">{item.title}</p>
                    {item.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brandOrange/20 text-brandOrange font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brandGray dark:text-slate-300 truncate">{item.subtitle}</p>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      item.status === 'active'
                        ? 'bg-green-500/20 text-green-700'
                        : item.status === 'review'
                        ? 'bg-orange-500/20 text-orange-700'
                        : 'bg-brandBlue/20 text-brandBlue'
                    }`}
                  >
                    {item.status === 'active' ? (
                      <Check className="h-4 w-4" />
                    ) : item.status === 'review' ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile App Mockup */}
      <div className="relative w-full max-w-[280px] animate-scale-in" style={{ animationDelay: '0.2s' }}>
        <div className="relative">
          {/* Phone Frame */}
          <div className="relative bg-gradient-to-br from-brandBlue to-brandBlueDark rounded-[3rem] p-3 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black/30 rounded-b-2xl"></div>
            
            {/* Screen */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden min-h-[520px] flex flex-col">
              {/* Status Bar */}
              <div className="h-8 bg-gradient-to-r from-brandBlue/10 to-transparent dark:from-brandBlue/20 dark:to-transparent flex items-center justify-between px-4 pt-1">
                <span className="text-xs font-semibold text-brandNavy dark:text-slate-100">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-brandNavy"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-brandNavy"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-brandGray/50"></div>
                </div>
              </div>

              {/* App Header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-brandBlue/10 dark:bg-brandBlue/20 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-brandBlue" />
                  </div>
                  <span className="text-sm font-semibold text-brandNavy dark:text-slate-100">Jobs</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {mobileItems.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="h-12 w-12 rounded-xl bg-brandBlue/10 dark:bg-brandBlue/20 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-6 w-6 text-brandBlue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-brandNavy dark:text-slate-100 mb-1">{item.title}</p>
                        <p className="text-xs text-brandGray dark:text-slate-300">{item.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-600">
                      <span className="text-sm font-bold text-brandOrange">{item.salary}</span>
                      <button className="text-xs font-semibold text-brandBlue dark:text-brandBlue px-3 py-1.5 rounded-full bg-brandBlue/10 dark:bg-brandBlue/20">
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Navigation */}
              <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
                <div className="flex items-center justify-around">
                  <div className="h-8 w-8 rounded-full bg-brandGray/20 dark:bg-slate-600/20"></div>
                  <div className="h-8 w-8 rounded-full bg-brandGray/20 dark:bg-slate-600/20"></div>
                  <div className="h-8 w-8 rounded-full bg-brandBlue/20 dark:bg-brandBlue/30"></div>
                  <div className="h-8 w-8 rounded-full bg-brandGray/20 dark:bg-slate-600/20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIMockups;

