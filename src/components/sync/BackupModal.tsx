import React, { useState, useRef } from 'react';
import { X, Download, Upload, Database, Cloud, RefreshCw, Check, AlertCircle, Key, ShieldCheck } from 'lucide-react';
import { AppTheme } from '../../types';
import { THEMES } from '../../services/theme';
import { storage } from '../../services/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
  currentTheme: AppTheme;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
  currentTheme
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('polymath_sb_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('polymath_sb_key') || '');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const theme = THEMES[currentTheme];

  if (!isOpen) return null;

  const handleExportJson = () => {
    try {
      const dataStr = storage.exportAllData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `polymath_os_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatusMsg({ text: 'Backup exported successfully!' });
    } catch (e) {
      setStatusMsg({ text: 'Failed to export backup', isError: true });
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = storage.importAllData(content);
        if (success) {
          setStatusMsg({ text: 'All data restored successfully!' });
          onDataRestored();
        } else {
          setStatusMsg({ text: 'Invalid backup file format', isError: true });
        }
      } catch (err) {
        setStatusMsg({ text: 'Error reading backup file', isError: true });
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSupabaseConfig = () => {
    localStorage.setItem('polymath_sb_url', supabaseUrl.trim());
    localStorage.setItem('polymath_sb_key', supabaseKey.trim());
    setStatusMsg({ text: 'Supabase credentials saved locally!' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`w-full max-w-xl rounded-3xl ${theme.cardBg} border ${theme.cardBorder} p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Data Backup & Cloud Sync</h3>
            <p className="text-xs text-slate-400">
              Your data is offline-first. Export backups or sync via Supabase.
            </p>
          </div>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div
            className={`my-4 p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
              statusMsg.isError
                ? 'bg-rose-950/50 border-rose-800 text-rose-300'
                : 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
            }`}
          >
            {statusMsg.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="space-y-6 my-5">
          
          {/* Section 1: Offline JSON Backup & Restore */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Offline JSON Backup & Restore</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export all domains, quests, skill trees, atomic logs, and notes into a portable JSON snapshot.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={handleExportJson}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup (JSON)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Restore Backup (JSON)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </div>
          </div>

          {/* Section 2: Optional Cloud Sync (Supabase) */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-purple-400" />
              <span>Optional Supabase Cloud Sync</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your personal Supabase project for real-time multi-device cloud synchronization.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Project URL
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Anon (Public) Key
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setKeySafe(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveSupabaseConfig}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition active:scale-95"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Save Supabase Settings</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );

  function setKeySafe(val: string) {
    setSupabaseKey(val);
  }
};
