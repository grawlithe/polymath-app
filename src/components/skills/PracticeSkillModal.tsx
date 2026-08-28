import React, { useState } from 'react';
import { X, Clock, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { SkillNode, Domain, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';
import { gamification, audioFX } from '../../services/gamification';

interface PracticeSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: SkillNode;
  domain: Domain;
  onLogPractice: (skillId: string, minutes: number, notes: string) => void;
  currentTheme: AppTheme;
}

export const PracticeSkillModal: React.FC<PracticeSkillModalProps> = ({
  isOpen,
  onClose,
  skill,
  domain,
  onLogPractice,
  currentTheme
}) => {
  const [minutes, setMinutes] = useState(20);
  const [notes, setNotes] = useState('');

  const theme = THEMES[currentTheme];

  if (!isOpen) return null;

  const xpEarned = minutes * 2;
  const currentSkillInfo = gamification.calculateSkillLevel(skill.xp);
  const newSkillInfo = gamification.calculateSkillLevel(skill.xp + xpEarned);
  const didLevelUp = newSkillInfo.level > currentSkillInfo.level;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (minutes <= 0) return;

    if (didLevelUp) {
      gamification.triggerLevelUpCelebration();
    } else {
      gamification.triggerCelebration();
      audioFX.playQuestComplete();
    }

    onLogPractice(skill.id, minutes, notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`w-full max-w-md rounded-3xl ${theme.cardBg} border ${theme.cardBorder} p-6 sm:p-8 shadow-2xl relative`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            {domain.icon}
          </div>
          <div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {domain.name}
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {skill.name}
            </h3>
            <div className="text-xs text-slate-400 mt-0.5">
              Current: <strong className="text-amber-300">Level {currentSkillInfo.level}</strong> ({skill.xp} Total XP)
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Minutes Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Practice Duration
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[15, 20, 30, 45, 60].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMinutes(m)}
                  className={`py-2 rounded-xl border text-xs font-mono font-bold transition ${
                    minutes === m
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Practice Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Atomic Focus Log (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Practiced chord transitions at 90bpm, clean sound."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
          </div>

          {/* XP & Level Preview */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Earned XP Bounty:</span>
              </span>
              <span className="font-extrabold text-amber-300 font-mono">
                +{xpEarned} XP
              </span>
            </div>

            {didLevelUp && (
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>LEVEL UP! Reaching Level {newSkillInfo.level}!</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Practice & Level Up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
