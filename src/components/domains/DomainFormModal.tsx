import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Domain, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';

interface DomainFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (domain: Partial<Domain>) => void;
  domainToEdit?: Domain | null;
  currentTheme: AppTheme;
}

const COLOR_PRESETS = [
  { label: 'Cyber Cyan', value: 'from-cyan-500 to-blue-600', border: 'border-cyan-500' },
  { label: 'Emerald Mint', value: 'from-emerald-500 to-teal-600', border: 'border-emerald-500' },
  { label: 'Cosmic Violet', value: 'from-purple-500 to-indigo-600', border: 'border-purple-500' },
  { label: 'Solar Amber', value: 'from-amber-500 to-orange-600', border: 'border-amber-500' },
  { label: 'Neon Pink', value: 'from-pink-500 to-rose-600', border: 'border-pink-500' },
  { label: 'Ruby Flame', value: 'from-red-500 to-amber-600', border: 'border-red-500' },
  { label: 'Deep Blue', value: 'from-blue-600 to-indigo-800', border: 'border-blue-500' },
  { label: 'Hacker Green', value: 'from-lime-500 to-emerald-700', border: 'border-lime-500' },
];

const ICON_PRESETS = [
  '🎮', '🎸', '💻', '🎨', '📚', '🧪', '🧠', '✍️', '🎹', '🥋', 
  '🚀', '📷', '🌐', '🛠️', '♟️', '🔬', '💡', '🎧', '🎯', '🌱'
];

export const DomainFormModal: React.FC<DomainFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  domainToEdit,
  currentTheme
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎮');
  const [color, setColor] = useState(COLOR_PRESETS[0].value);
  const [status, setStatus] = useState<'active' | 'dormant'>('active');

  const theme = THEMES[currentTheme];

  useEffect(() => {
    if (domainToEdit) {
      setName(domainToEdit.name);
      setDescription(domainToEdit.description || '');
      setIcon(domainToEdit.icon || '🎮');
      setColor(domainToEdit.color || COLOR_PRESETS[0].value);
      setStatus(domainToEdit.status);
    } else {
      setName('');
      setDescription('');
      setIcon('🎮');
      setColor(COLOR_PRESETS[0].value);
      setStatus('active');
    }
  }, [domainToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className={`w-full max-w-lg rounded-2xl ${theme.cardBg} border ${theme.cardBorder} p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">
          {domainToEdit ? 'Edit Domain' : 'Create New Interest Domain'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          A domain is a high-level area of mastery (e.g. Game Dev, Guitar, Japanese, AI Engineering).
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Domain Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Game Development, Guitar Mastery, Creative Writing"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Vision / Purpose
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this matters to you or current long-term aspiration..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm resize-none"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Choose Icon / Emoji
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
              {ICON_PRESETS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-transform ${
                    icon === ic ? 'bg-cyan-500/30 border-2 border-cyan-400 scale-110' : 'hover:bg-slate-800'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color Gradient Preset */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Color Gradient Theme
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((cp) => (
                <button
                  type="button"
                  key={cp.value}
                  onClick={() => setColor(cp.value)}
                  className={`h-10 rounded-xl bg-gradient-to-r ${cp.value} p-1 flex items-center justify-center border-2 transition-all ${
                    color === cp.value ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  {color === cp.value && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Initial Focus State
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  status === 'active'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Sprint
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Ready for daily/weekly focus & quest suggestions.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus('dormant')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  status === 'dormant'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-sm text-white flex items-center gap-1.5">
                  💤 Dormant Shelf
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Stored safely. Zero guilt, zero overdue notifications.
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition active:scale-95"
            >
              {domainToEdit ? 'Save Changes' : 'Create Domain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
