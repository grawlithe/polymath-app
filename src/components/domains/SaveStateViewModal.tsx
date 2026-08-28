import React from 'react';
import { X, Play, Bookmark, Compass, Zap, Calendar, ExternalLink } from 'lucide-react';
import { Domain, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface SaveStateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: Domain;
  onWakeUpDomain: (domainId: string) => void;
  onEditSaveState: (domain: Domain) => void;
  currentTheme: AppTheme;
}

export const SaveStateViewModal: React.FC<SaveStateViewModalProps> = ({
  isOpen,
  onClose,
  domain,
  onWakeUpDomain,
  onEditSaveState,
  currentTheme
}) => {
  const theme = THEMES[currentTheme];
  const saveState = domain.saveState;

  if (!isOpen || !saveState) return null;

  const timeAgo = formatDistanceToNow(parseISO(saveState.savedAt), { addSuffix: true });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className={`w-full max-w-lg rounded-2xl ${theme.cardBg} border ${theme.cardBorder} p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="text-3xl p-2 rounded-2xl bg-slate-950/80 border border-slate-800">
            {domain.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">{domain.name}</h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Save State Loaded
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" /> Saved {timeAgo}
            </p>
          </div>
        </div>

        <div className="space-y-4 my-5">
          {/* Next Immediate Action */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>Next Immediate Step to Resume</span>
            </div>
            <div className="text-sm font-semibold text-white">
              {saveState.nextStepAction}
            </div>
          </div>

          {/* Context Dump */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span>Last Known Mental State & Progress</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {saveState.contextDump}
            </div>
          </div>

          {/* Workspace Reference */}
          {saveState.lastWorkspace && (
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Compass className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Workspace / Resource</div>
                  <div className="text-xs font-mono text-amber-200 truncate max-w-[280px]">
                    {saveState.lastWorkspace}
                  </div>
                </div>
              </div>
              {saveState.lastWorkspace.startsWith('http') && (
                <a
                  href={saveState.lastWorkspace}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEditSaveState(domain);
            }}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 underline"
          >
            Update Save State
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Close
            </button>
            {domain.status === 'dormant' && (
              <button
                type="button"
                onClick={() => {
                  onWakeUpDomain(domain.id);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Wake Up & Activate Domain</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
