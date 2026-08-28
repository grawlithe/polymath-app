import { AppTheme } from '../types';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  description: string;
  bgClass: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
  accentGradient: string;
  textMuted: string;
  badgeBg: string;
  activeNav: string;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  cyber: {
    id: 'cyber',
    name: 'Cyber Arcade',
    description: 'High-energy dark synthwave with cyan & neon accents',
    bgClass: 'bg-slate-950 text-slate-100',
    cardBg: 'bg-slate-900/90 backdrop-blur-md',
    cardBorder: 'border-slate-800/80 hover:border-cyan-500/50',
    accent: 'text-cyan-400',
    accentGradient: 'from-cyan-500 to-indigo-600',
    textMuted: 'text-slate-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    activeNav: 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border-cyan-500/40'
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Zen',
    description: 'Deep matte minimalist dark with emerald focus',
    bgClass: 'bg-zinc-950 text-zinc-100',
    cardBg: 'bg-zinc-900/95 backdrop-blur-md',
    cardBorder: 'border-zinc-800 hover:border-emerald-500/40',
    accent: 'text-emerald-400',
    accentGradient: 'from-emerald-500 to-teal-600',
    textMuted: 'text-zinc-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    activeNav: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Nebula',
    description: 'Cosmic violet deep space aesthetic',
    bgClass: 'bg-[#090b14] text-purple-100',
    cardBg: 'bg-[#111424]/90 backdrop-blur-md',
    cardBorder: 'border-purple-900/40 hover:border-purple-500/50',
    accent: 'text-purple-400',
    accentGradient: 'from-purple-500 to-pink-600',
    textMuted: 'text-purple-300/70',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    activeNav: 'bg-purple-600/20 text-purple-300 border-purple-500/50'
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Core',
    description: 'Phosphor green terminal aesthetic',
    bgClass: 'bg-[#040d08] text-green-100',
    cardBg: 'bg-[#0a180f]/90 backdrop-blur-md',
    cardBorder: 'border-green-900/50 hover:border-green-500/50',
    accent: 'text-green-400',
    accentGradient: 'from-green-500 to-emerald-600',
    textMuted: 'text-green-300/60',
    badgeBg: 'bg-green-500/15 text-green-400 border-green-500/30',
    activeNav: 'bg-green-500/20 text-green-300 border-green-500/40'
  },
  light: {
    id: 'light',
    name: 'Polymath Studio Light',
    description: 'Crisp, high-contrast daylight focus mode',
    bgClass: 'bg-slate-50 text-slate-900',
    cardBg: 'bg-white/95 shadow-sm backdrop-blur-md',
    cardBorder: 'border-slate-200 hover:border-indigo-400',
    accent: 'text-indigo-600',
    accentGradient: 'from-indigo-600 to-blue-600',
    textMuted: 'text-slate-500',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    activeNav: 'bg-indigo-50 text-indigo-700 border-indigo-300'
  }
};
