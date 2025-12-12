'use client';

import { LayoutDashboard, Briefcase, FileText, MessageCircle, Settings, TrendingUp, Users, Clock, CheckCircle2 } from 'lucide-react';

const UIMockups = () => {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Illustration-style Dashboard Mockup */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-8 shadow-2xl overflow-hidden">
        
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl" />
        
        <div className="relative flex gap-4">
          {/* Left Sidebar Navigation */}
          <div className="w-16 bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-3 shadow-lg flex flex-col items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-brandBlue to-purple-600 rounded-xl mb-2 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-md" />
            </div>
            
            {/* Menu Icons */}
            <button className="w-10 h-10 rounded-xl bg-brandBlue text-white flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Briefcase className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <FileText className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 relative">
              <MessageCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="flex-1" />
            
            <button className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Dashboard Overview</h3>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Active Jobs Card */}
              <div className="bg-white/90 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-brandBlue" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Active Jobs</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">150+</p>
                  </div>
                </div>
              </div>
              
              {/* Applications Card */}
              <div className="bg-white/90 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Applications</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">48</p>
                  </div>
                </div>
              </div>
              
              {/* Interviews Card */}
              <div className="bg-white/90 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Interviews</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">12</p>
                  </div>
                </div>
              </div>
              
              {/* Offers Card */}
              <div className="bg-white/90 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-brandOrange" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Offers</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">5</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Application Progress Chart */}
            <div className="bg-white/90 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Application Progress</h4>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-end gap-2 h-20">
                <div className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg" style={{ height: '60%' }} />
                <div className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg" style={{ height: '80%' }} />
                <div className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg" style={{ height: '90%' }} />
                <div className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style={{ height: '70%' }} />
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white/90 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-brandBlue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">New Application</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">Interview Scheduled</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-brandOrange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">Offer Received</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">3 days ago</p>
                  </div>
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
