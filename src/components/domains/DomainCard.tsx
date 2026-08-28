import React from 'react';
import { Save, Play, Plus, GitBranch, MoreVertical, Edit3, Trash2, Zap, BookmarkCheck, Clock, Flame } from 'lucide-react';
import { Domain, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';
import { gamification } from '../../services/gamification';

interface DomainCardProps {
  domain: Domain;
  questCount: number;
  skillCount: number;
  currentTheme: AppTheme;
  onOpenSaveState: (domain: Domain) => void;
  onViewSaveState: (domain: Domain) => void;
  onOpenNewQuest: (domainId: string) => void;
  onSelectDomainSkills: (domainId: string) => void;
  onEditDomain: (domain: Domain) => void;
  onDeleteDomain: (domainId: string) => void;
  onQuickLogEffort: (domain: Domain) => void;
}

export const DomainCard: React.FC<DomainCardProps> = ({
  domain,
  questCount,
  skillCount,
  currentTheme,
  onOpenSaveState,
  onViewSaveState,
  onOpenNewQuest,
  onSelectDomainSkills,
  onEditDomain,
  onDeleteDomain,
  onQuickLogEffort
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const theme = THEMES[currentTheme];
  const levelInfo = gamification.calculateLevel(domain.totalXp);
  const isActive = domain.status === 'active';

  return (
    <div
      className={`group relative rounded-2xl ${theme.cardBg} border ${theme.cardBorder} p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
        isActive ? 'ring-1 ring-cyan-500/30' : 'opacity-85 hover:opacity-100'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-2xl shadow-lg text-white font-bold`}>
            {domain.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition">
                {domain.name}
              </h4>
            </div>
            
            {/* Status Pill */}
            <div className="flex items-center gap-2 mt-0.5">
              {isActive ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" /> Active Sprint
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  💤 Dormant Shelf
                </span>
              )}

              {domain.saveState && (
                <button
                  onClick={() => onViewSaveState(domain)}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                  title="View Saved State"
                >
                  <BookmarkCheck className="w-3 h-3 text-cyan-400 mr-1" /> Save State
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-30 animate-in fade-in">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEditDomain(domain);
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Edit3 className="w-3.5 h-3.5 mr-2 text-cyan-400" /> Edit Domain
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDeleteDomain(domain.id);
                }}
                className="w-full flex items-center px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Domain
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {domain.description && (
        <p className="text-xs text-slate-400 mt-3 line-clamp-2">
          {domain.description}
        </p>
      )}

      {/* Save State Next Action Callout (if present) */}
      {domain.saveState && (
        <div 
          onClick={() => onViewSaveState(domain)}
          className="mt-3.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
        >
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" /> Resume Next:
          </div>
          <div className="text-xs text-slate-200 truncate mt-0.5 font-medium">
            {domain.saveState.nextStepAction}
          </div>
        </div>
      )}

      {/* Progress & Level Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <span>Level {levelInfo.level}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {domain.totalXp} XP ({levelInfo.progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full bg-gradient-to-r ${domain.color} transition-all duration-500`}
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 gap-2 mt-3 text-center">
        <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <div className="text-xs font-bold text-white">{questCount}</div>
          <div className="text-[10px] text-slate-400">Quests</div>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <div className="text-xs font-bold text-white">{skillCount}</div>
          <div className="text-[10px] text-slate-400">Skill Nodes</div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80">
        
        {/* Anti-guilt Save State Action */}
        {isActive ? (
          <button
            onClick={() => onOpenSaveState(domain)}
            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
            title="Freeze context and switch to Dormant"
          >
            <Save className="w-3.5 h-3.5 text-purple-400" />
            <span>Freeze State</span>
          </button>
        ) : (
          <button
            onClick={() => onViewSaveState(domain)}
            className="flex-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-400" />
            <span>Load Save State</span>
          </button>
        )}

        {/* Quick Log Practice Effort */}
        <button
          onClick={() => onQuickLogEffort(domain)}
          className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition active:scale-95"
          title="Quick Log Practice Minutes"
        >
          <Clock className="w-4 h-4" />
        </button>

        {/* View Skill Tree */}
        <button
          onClick={() => onSelectDomainSkills(domain.id)}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-cyan-400 transition active:scale-95"
          title="Open Skill Tree"
        >
          <GitBranch className="w-4 h-4" />
        </button>

        {/* Add Quest */}
        <button
          onClick={() => onOpenNewQuest(domain.id)}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition active:scale-95"
          title="Add Quest"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
