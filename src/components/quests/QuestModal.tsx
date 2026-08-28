import React, { useState, useEffect } from 'react';
import { X, Sparkles, Zap, Clock, Compass } from 'lucide-react';
import { Quest, Domain, SkillNode, EnergyLevel, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  domains: Domain[];
  skills: SkillNode[];
  onSaveQuest: (quest: Partial<Quest>) => void;
  questToEdit?: Quest | null;
  defaultDomainId?: string;
  currentTheme: AppTheme;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  domains,
  skills,
  onSaveQuest,
  questToEdit,
  defaultDomainId,
  currentTheme
}) => {
  const [domainId, setDomainId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(1);
  const [durationMins, setDurationMins] = useState(15);
  const [skillNodeId, setSkillNodeId] = useState<string>('');

  const theme = THEMES[currentTheme];

  useEffect(() => {
    if (questToEdit) {
      setDomainId(questToEdit.domainId);
      setTitle(questToEdit.title);
      setDescription(questToEdit.description || '');
      setEnergyLevel(questToEdit.energyLevel);
      setDurationMins(questToEdit.durationMins);
      setSkillNodeId(questToEdit.skillNodeId || '');
    } else {
      const activeDomains = domains.filter((d) => d.status === 'active');
      setDomainId(defaultDomainId || (activeDomains.length > 0 ? activeDomains[0].id : (domains[0]?.id || '')));
      setTitle('');
      setDescription('');
      setEnergyLevel(1);
      setDurationMins(15);
      setSkillNodeId('');
    }
  }, [questToEdit, isOpen, defaultDomainId, domains]);

  if (!isOpen) return null;

  // Calculate dynamic suggested XP
  const calculatedXp = Math.round(durationMins * energyLevel * 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !domainId) return;

    onSaveQuest({
      domainId,
      title: title.trim(),
      description: description.trim(),
      energyLevel,
      durationMins,
      xpReward: calculatedXp,
      skillNodeId: skillNodeId || undefined,
      status: questToEdit ? questToEdit.status : 'open'
    });
    onClose();
  };

  const domainSkills = skills.filter((s) => s.domainId === domainId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`w-full max-w-lg rounded-3xl ${theme.cardBg} border ${theme.cardBorder} p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-extrabold text-white mb-1">
          {questToEdit ? 'Edit Quest' : 'Create Micro-Quest'}
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Atomic, bite-sized tasks tailored for fast focus sessions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Domain Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Interest Domain *
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
                  {d.icon} {d.name} {d.status === 'dormant' ? '(Dormant)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Quest Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Practice alternate picking to metronome at 100bpm"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Context / Details (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Links, goals, or instructions for this session..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Required Energy Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 1 as EnergyLevel, label: 'Low', icon: '⚡' },
                { level: 2 as EnergyLevel, label: 'Medium', icon: '⚡⚡' },
                { level: 3 as EnergyLevel, label: 'High', icon: '⚡⚡⚡' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.level}
                  onClick={() => setEnergyLevel(item.level)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    energyLevel === item.level
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Estimated Duration
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[15, 30, 45, 60, 120].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDurationMins(mins)}
                  className={`py-2 rounded-xl border text-xs font-mono font-bold transition ${
                    durationMins === mins
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Link to Skill Node (Optional) */}
          {domainSkills.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Link to Skill Node (Optional)
              </label>
              <select
                value={skillNodeId}
                onChange={(e) => setSkillNodeId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="">None (Domain General XP)</option>
                {domainSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    🌳 {s.name} (Lvl {s.level})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* XP Preview */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Completion XP Bounty:</span>
            </span>
            <span className="text-sm font-extrabold text-amber-300 font-mono">
              +{calculatedXp} XP
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition active:scale-95"
            >
              {questToEdit ? 'Save Quest' : 'Add Quest'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
