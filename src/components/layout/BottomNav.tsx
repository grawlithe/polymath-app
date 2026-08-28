import React from 'react';
import { Layers, Compass, GitBranch, Share2, Activity, Zap } from 'lucide-react';
import { AppTheme } from '../../types';
import { THEMES } from '../../services/theme';

export type TabId = 'domains' | 'quests' | 'skills' | 'notes' | 'tracker';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  currentTheme: AppTheme;
  activeDomainCount: number;
  openQuestCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  currentTheme,
  activeDomainCount,
  openQuestCount
}) => {
  const theme = THEMES[currentTheme];

  const navItems = [
    {
      id: 'domains' as TabId,
      label: 'Domains',
      icon: Layers,
      badge: activeDomainCount > 0 ? `${activeDomainCount} active` : undefined
    },
    {
      id: 'quests' as TabId,
      label: 'Quests',
      icon: Compass,
      badge: openQuestCount > 0 ? `${openQuestCount}` : undefined
    },
    {
      id: 'skills' as TabId,
      label: 'Skill Trees',
      icon: GitBranch
    },
    {
      id: 'notes' as TabId,
      label: 'Knowledge Mesh',
      icon: Share2
    },
    {
      id: 'tracker' as TabId,
      label: 'Activity',
      icon: Activity
    }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 border-t ${theme.cardBorder} ${theme.cardBg} transition-colors duration-200 pb-[env(safe-area-inset-bottom,0px)]`}>
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `${theme.activeNav} scale-105 font-bold`
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? theme.accent : ''}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-500 text-slate-950 font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight truncate max-w-[70px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
