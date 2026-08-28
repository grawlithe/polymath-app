import React, { useState } from 'react';
import { X, Zap, Clock, Sparkles, RefreshCw, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { Domain, Quest, EnergyLevel, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';

interface WhatNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  domains: Domain[];
  quests: Quest[];
  onStartQuestTimer: (quest: Quest) => void;
  onQuickCompleteQuest: (quest: Quest) => void;
  onOpenNewQuest: () => void;
  currentTheme: AppTheme;
}

export const WhatNowModal: React.FC<WhatNowModalProps> = ({
  isOpen,
  onClose,
  domains,
  quests,
  onStartQuestTimer,
  onQuickCompleteQuest,
  onOpenNewQuest,
  currentTheme
}) => {
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>(1);
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [suggestedQuest, setSuggestedQuest] = useState<Quest | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const theme = THEMES[currentTheme];

  if (!isOpen) return null;

  const activeDomainIds = new Set(domains.filter((d) => d.status === 'active').map((d) => d.id));

  const getAvailableQuests = () => {
    return quests.filter((q) => {
      if (q.status === 'completed') return false;
      if (!activeDomainIds.has(q.domainId)) return false;
      if (selectedDomainId !== 'all' && q.domainId !== selectedDomainId) return false;
      if (q.energyLevel > selectedEnergy) return false;
      if (q.durationMins > selectedDuration) return false;
      return true;
    });
  };

  const handleRoll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const candidates = getAvailableQuests();
      if (candidates.length === 0) {
        setSuggestedQuest(null);
      } else {
        // Pick a random quest, prefer different one if multiple exist
        const available = candidates.length > 1 && suggestedQuest
          ? candidates.filter((q) => q.id !== suggestedQuest.id)
          : candidates;
        const randomPick = available[Math.floor(Math.random() * available.length)];
        setSuggestedQuest(randomPick);
      }
      setIsRolling(false);
    }, 250);
  };

  const currentMatchedQuest = suggestedQuest || getAvailableQuests()[0] || null;
  const currentDomain = currentMatchedQuest
    ? domains.find((d) => d.id === currentMatchedQuest.domainId)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`w-full max-w-lg rounded-3xl ${theme.cardBg} border ${theme.cardBorder} p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>"What Now?" Engine</span>
            </h3>
            <p className="text-xs text-slate-400">
              Kill decision fatigue. Match what you do right now to your available energy & time.
            </p>
          </div>
        </div>

        {/* Energy Selector */}
        <div className="space-y-4 my-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              1. How is your energy level right now?
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { level: 1 as EnergyLevel, label: 'Low Energy', icon: '⚡', desc: 'Light drills, videos, 15m' },
                { level: 2 as EnergyLevel, label: 'Medium', icon: '⚡⚡', desc: 'Balanced focus & study' },
                { level: 3 as EnergyLevel, label: 'High Focus', icon: '⚡⚡⚡', desc: 'Deep work & flow state' }
              ].map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => {
                    setSelectedEnergy(item.level);
                    setSuggestedQuest(null);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedEnergy === item.level
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md scale-102'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-base sm:text-lg mb-1">{item.icon}</div>
                  <div className="font-bold text-xs sm:text-sm text-white">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Available */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              2. How much time do you have?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[15, 30, 45, 60, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    setSelectedDuration(mins);
                    setSuggestedQuest(null);
                  }}
                  className={`py-2 rounded-xl border text-center font-mono font-bold text-xs sm:text-sm transition-all ${
                    selectedDuration === mins
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md scale-102'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Domain Filter */}
          {domains.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                3. Focus Domain (Optional)
              </label>
              <select
                value={selectedDomainId}
                onChange={(e) => {
                  setSelectedDomainId(e.target.value);
                  setSuggestedQuest(null);
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="all">Any Active Domain ({domains.filter((d) => d.status === 'active').length} active)</option>
                {domains.filter((d) => d.status === 'active').map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.icon} {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Suggestion Display Card */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Quest</span>
            </span>

            <button
              onClick={handleRoll}
              disabled={isRolling}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
              <span>Reroll Suggestion</span>
            </button>
          </div>

          {currentMatchedQuest && currentDomain ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{currentDomain.icon}</span>
                  <span className="text-xs font-bold text-cyan-300">{currentDomain.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    +{currentMatchedQuest.xpReward} XP
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {currentMatchedQuest.durationMins}m
                  </span>
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentMatchedQuest.title}
              </h4>

              {currentMatchedQuest.description && (
                <p className="text-xs text-slate-400">
                  {currentMatchedQuest.description}
                </p>
              )}

              {/* Action Buttons for the Quest */}
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onQuickCompleteQuest(currentMatchedQuest);
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Done Already</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onStartQuestTimer(currentMatchedQuest);
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 flex items-center gap-1.5 transition active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Focus Session</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="text-xs sm:text-sm font-semibold text-slate-300">
                No matching open quests found for this energy/time window.
              </div>
              <p className="text-[11px] text-slate-500">
                Try raising the energy or time filter, or add a quick micro-quest for your active domains.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewQuest();
                }}
                className="mt-2 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition"
              >
                + Create Quick Quest
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
