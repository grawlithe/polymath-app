import React, { useState, useEffect } from 'react';
import { X, GitBranch, Sparkles } from 'lucide-react';
import { SkillNode, Domain, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';

interface SkillNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: Domain;
  existingSkills: SkillNode[];
  onSaveSkill: (skill: Partial<SkillNode>) => void;
  skillToEdit?: SkillNode | null;
  defaultParentId?: string | null;
  currentTheme: AppTheme;
}

export const SkillNodeModal: React.FC<SkillNodeModalProps> = ({
  isOpen,
  onClose,
  domain,
  existingSkills,
  onSaveSkill,
  skillToEdit,
  defaultParentId,
  currentTheme
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [maxLevel, setMaxLevel] = useState(10);

  const theme = THEMES[currentTheme];

  useEffect(() => {
    if (skillToEdit) {
      setName(skillToEdit.name);
      setDescription(skillToEdit.description || '');
      setParentId(skillToEdit.parentId || '');
      setMaxLevel(skillToEdit.maxLevel || 10);
    } else {
      setName('');
      setDescription('');
      setParentId(defaultParentId || '');
      setMaxLevel(10);
    }
  }, [skillToEdit, isOpen, defaultParentId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveSkill({
      domainId: domain.id,
      name: name.trim(),
      description: description.trim(),
      parentId: parentId || null,
      maxLevel,
      level: skillToEdit ? skillToEdit.level : 1,
      xp: skillToEdit ? skillToEdit.xp : 0,
      xpToNext: skillToEdit ? skillToEdit.xpToNext : 50
    });
    onClose();
  };

  const domainSkills = existingSkills.filter((s) => s.domainId === domain.id && (!skillToEdit || s.id !== skillToEdit.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`w-full max-w-md rounded-3xl ${theme.cardBg} border ${theme.cardBorder} p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="text-2xl">{domain.icon}</div>
          <div>
            <h3 className="text-xl font-extrabold text-white">
              {skillToEdit ? 'Edit Skill Node' : 'Add Skill Tree Node'}
            </h3>
            <p className="text-xs text-slate-400">
              Branching mastery for <strong className="text-cyan-300">{domain.name}</strong>.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Skill / Technique Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alternate Picking, Collision Physics, State Machines"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Description / Objectives
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What mastery looks like for this skill..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Parent Skill (Hierarchy) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>Parent Skill Node (Optional)</span>
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
            >
              <option value="">🌳 Root Level (Direct Domain Child)</option>
              {domainSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  ↳ Sub-node of: {s.name} (Lvl {s.level})
                </option>
              ))}
            </select>
          </div>

          {/* Max Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Max Mastery Level
            </label>
            <div className="flex items-center space-x-2">
              {[5, 10, 20, 50].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setMaxLevel(lvl)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-mono font-bold transition ${
                    maxLevel === lvl
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Lvl {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
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
              {skillToEdit ? 'Save Node' : 'Add Skill Node'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
