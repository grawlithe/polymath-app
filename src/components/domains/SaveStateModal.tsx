import React, { useState } from 'react';
import { X, Save, Zap, Compass, Bookmark } from 'lucide-react';
import { Domain, SaveState, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';
import { audioFX } from '../../services/gamification';

interface SaveStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: Domain;
  onSaveState: (domainId: string, saveState: SaveState) => void;
  currentTheme: AppTheme;
}

export const SaveStateModal: React.FC<SaveStateModalProps> = ({
  isOpen,
  onClose,
  domain,
  onSaveState,
  currentTheme
}) => {
  const [contextDump, setContextDump] = useState(domain.saveState?.contextDump || '');
  const [lastWorkspace, setLastWorkspace] = useState(domain.saveState?.lastWorkspace || '');
  const [nextStepAction, setNextStepAction] = useState(domain.saveState?.nextStepAction || '');

  const theme = THEMES[currentTheme];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contextDump.trim() || !nextStepAction.trim()) return;

    const newSaveState: SaveState = {
      id: crypto.randomUUID(),
      domainId: domain.id,
      contextDump: contextDump.trim(),
      lastWorkspace: lastWorkspace.trim() || undefined,
      nextStepAction: nextStepAction.trim(),
      savedAt: new Date().toISOString()
    };

    audioFX.playSaveState();
    onSaveState(domain.id, newSaveState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className={`w-full max-w-lg rounded-2xl ${theme.cardBg} border ${theme.cardBorder} p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="text-2xl">{domain.icon}</div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Save State Snapshot</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Anti-Guilt
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Freezing <span className="text-cyan-300 font-semibold">{domain.name}</span> so you can cycle back anytime with zero restart friction.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          
          {/* Context Dump */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span>Where did you leave off? (Context Dump) *</span>
            </label>
            <textarea
              required
              rows={3}
              value={contextDump}
              onChange={(e) => setContextDump(e.target.value)}
              placeholder="e.g. Finished video 4 of the platformer series. Implemented jumping and gravity, next is player collision script."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm"
              autoFocus
            />
          </div>

          {/* Last Workspace Reference */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Workspace / File / Chapter / Tutorial Link (Optional)</span>
            </label>
            <input
              type="text"
              value={lastWorkspace}
              onChange={(e) => setLastWorkspace(e.target.value)}
              placeholder="e.g. obj_player.gml, CAGED Book Page 42, https://youtube.com/watch?v=..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm"
            />
          </div>

          {/* Single Next Action */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Single Friction-Free Next Action *</span>
            </label>
            <input
              type="text"
              required
              value={nextStepAction}
              onChange={(e) => setNextStepAction(e.target.value)}
              placeholder="e.g. Write collision code for solid walls in obj_player"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              💡 Keep this so small that opening the project in 3 months takes less than 30 seconds of thinking.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 flex items-center gap-1.5 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Freeze & Save State</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
