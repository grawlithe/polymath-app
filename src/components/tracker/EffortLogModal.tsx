import React, { useState } from 'react';
import { X, Clock, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { Domain, SkillNode, EffortLog, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';
import { gamification, audioFX } from '../../services/gamification';

interface EffortLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  domains: Domain[];
  skills: SkillNode[];
  defaultDomainId?: string;
  onSaveEffort: (log: Partial<EffortLog>) => void;
  currentTheme: AppTheme;
}

export const EffortLogModal: React.FC<EffortLogModalProps> = ({
  isOpen,
  onClose,
  domains,
  skills,
  defaultDomainId,
  onSaveEffort,
  currentTheme
}) => {
  const [domainId, setDomainId] = useState(defaultDomainId || (domains[0]?.id || ''));
  const [skillNodeId, setSkillNodeId] = useState('');
  const [minutesSpent, setMinutesSpent] = useState(30);
  const [notes, setNotes] = useState('');

  const theme = THEMES[currentTheme];

  React.useEffect(() => {
    if (defaultDomainId) {
      setDomainId(defaultDomainId);
    } else if (domains.length > 0 && !domainId) {
      setDomainId(domains[0].id);
    }
  }, [defaultDomainId, domains, domainId]);

  if (!isOpen) return null;

  const selectedDomain = domains.find((d) => d.id === domainId);
  const domainSkills = skills.filter((s) => s.domainId === domainId);
  const selectedSkill = skills.find((s) => s.id === skillNodeId);

  const xpEarned = minutesSpent * 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainId || minutesSpent <= 0) return;

    gamification.triggerCelebration();
    audioFX.playQuestComplete();

    onSaveEffort({
      domainId,
      domainName: selectedDomain?.name || 'General',
      skillNodeId: skillNodeId || undefined,
      skillName: selectedSkill?.name || undefined,
      minutesSpent,
      xpGained: xpEarned,
      notes: notes.trim(),
      timestamp: new Date().toISOString()
    });

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

        <div className="flex items-center space-x-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Log Atomic Practice</h3>
            <p className="text-xs text-slate-400">
              Record input & focused effort towards your mastery.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Domain Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Domain *
            </label>
            <select
              required
              value={domainId}
              onChange={(e) => {
                setDomainId(e.target.value);
                setSkillNodeId('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
            >
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon} {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Skill Node */}
          {domainSkills.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Specific Skill Node (Optional)
              </label>
              <select
                value={skillNodeId}
                onChange={(e) => setSkillNodeId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="">General Domain Practice</option>
                {domainSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    🌳 {s.name} (Lvl {s.level})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Duration Minutes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Minutes Practiced
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {[15, 30, 45, 60, 90].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMinutesSpent(m)}
                  className={`py-2 rounded-xl border text-xs font-mono font-bold transition ${
                    minutesSpent === m
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              max="600"
              value={minutesSpent}
              onChange={(e) => setMinutesSpent(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              placeholder="Or enter custom minutes..."
            />
          </div>

          {/* Session Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Practice Notes & Key Takeaways
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Debugged tilemap collision mask, working smoothly."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* XP Preview */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Earned Experience:</span>
            </span>
            <span className="text-sm font-extrabold text-amber-300 font-mono">
              +{xpEarned} XP
            </span>
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white shadow-lg shadow-orange-500/20 flex items-center gap-1.5 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Effort</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
