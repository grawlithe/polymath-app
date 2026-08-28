import React, { useState } from 'react';
import { Sparkles, Flame, Shield, Palette, Database, Plus, RefreshCw, Zap, Moon, Sun, Monitor } from 'lucide-react';
import { UserStats, AppTheme } from '../../types';
import { THEMES, ThemeConfig } from '../../services/theme';
import { gamification } from '../../services/gamification';

interface NavbarProps {
  stats: UserStats;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  onOpenWhatNow: () => void;
  onOpenNewDomain: () => void;
  onOpenBackup: () => void;
  todayMinutes: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  currentTheme,
  onSelectTheme,
  onOpenWhatNow,
  onOpenNewDomain,
  onOpenBackup,
  todayMinutes
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const theme = THEMES[currentTheme];
  const levelInfo = gamification.calculateLevel(stats.totalXp);

  return (
    <header className={`sticky top-0 z-40 border-b ${theme.cardBorder} ${theme.cardBg} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Level */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.accentGradient} flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-lg`}>
              Ψ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Polymath OS
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Lvl {levelInfo.level}
                </span>
              </div>
              
              {/* Level XP mini-bar */}
              <div className="flex items-center space-x-2 mt-0.5">
                <div className="w-24 sm:w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
                  <div
                    className={`h-full bg-gradient-to-r ${theme.accentGradient} transition-all duration-500`}
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Center / Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Today's Focus Pill */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/70 text-xs text-slate-300">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Today:</span>
              <span className="font-bold text-amber-300 font-mono">{todayMinutes}m</span>
            </div>

            {/* "What Now?" Quick Decision Engine Launcher */}
            <button
              onClick={onOpenWhatNow}
              className="relative group px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition-all duration-200 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>What Now?</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
            </button>

            {/* Quick Add Domain */}
            <button
              onClick={onOpenNewDomain}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>New Domain</span>
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
                title="Switch Theme"
              >
                <Palette className="w-4 h-4" />
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-1">
                    Visual Aesthetic
                  </div>
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                        currentTheme === t.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-[10px] text-slate-400">{t.description}</div>
                      </div>
                      {currentTheme === t.id && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Backup & Sync */}
            <button
              onClick={onOpenBackup}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
              title="Backup & Cloud Sync"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
