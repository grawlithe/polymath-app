import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Flame, Sparkles, Plus, Bookmark } from 'lucide-react';
import { Quest, Domain, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';
import { gamification, audioFX } from '../../services/gamification';

interface QuestTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: Quest;
  domain?: Domain;
  onFinishQuest: (questId: string, minutesSpent: number, notes: string) => void;
  currentTheme: AppTheme;
}

export const QuestTimerModal: React.FC<QuestTimerModalProps> = ({
  isOpen,
  onClose,
  quest,
  domain,
  onFinishQuest,
  currentTheme
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(quest.durationMins * 60);
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState('');
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);

  const theme = THEMES[currentTheme];
  const initialTotalSeconds = quest.durationMins * 60;

  useEffect(() => {
    setSecondsRemaining(quest.durationMins * 60);
    setTotalSecondsElapsed(0);
    setIsActive(true);
    setNotes('');
  }, [quest, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
        setTotalSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      audioFX.playQuestComplete();
      gamification.triggerCelebration();
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const progressPercent = Math.min(100, Math.max(0, ((initialTotalSeconds - secondsRemaining) / initialTotalSeconds) * 100));

  const handleFinish = () => {
    const minutesPracticed = Math.max(1, Math.round(totalSecondsElapsed / 60));
    gamification.triggerCelebration();
    audioFX.playQuestComplete();
    onFinishQuest(quest.id, minutesPracticed, notes.trim());
    onClose();
  };

  const handleAddFiveMinutes = () => {
    setSecondsRemaining((prev) => prev + 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className={`w-full max-w-md rounded-3xl ${theme.cardBg} border ${theme.cardBorder} p-6 sm:p-8 shadow-2xl relative text-center`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Domain Badge */}
        {domain && (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-bold text-cyan-300 mb-2">
            <span>{domain.icon}</span>
            <span>{domain.name}</span>
          </div>
        )}

        {/* Quest Title */}
        <h3 className="text-lg sm:text-xl font-extrabold text-white mb-6 line-clamp-2">
          {quest.title}
        </h3>

        {/* Big Timer Display */}
        <div className="relative w-48 h-48 mx-auto my-4 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-800 fill-none"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-cyan-400 fill-none transition-all duration-1000"
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-wider">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
            <div className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3" /> +{quest.xpReward} XP Reward
            </div>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center space-x-3 my-5">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`p-4 rounded-2xl text-white font-bold shadow-lg transition active:scale-95 ${
              isActive
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-cyan-500/25'
            }`}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
          </button>

          <button
            onClick={handleAddFiveMinutes}
            className="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 transition active:scale-95"
            title="Extend focus session by 5 minutes"
          >
            <Plus className="w-4 h-4" /> 5m
          </button>
        </div>

        {/* Practice Notes input */}
        <div className="my-4 text-left">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <Bookmark className="w-3 h-3 text-cyan-400" /> Focus Note (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Practiced chord transitions at 90bpm..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Complete Action Button */}
        <button
          onClick={handleFinish}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-95"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Finish Session & Claim XP</span>
        </button>

      </div>
    </div>
  );
};
