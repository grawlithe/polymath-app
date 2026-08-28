import React, { useState, useEffect } from 'react';
import { X, Share2, Tag, Link2, Bookmark } from 'lucide-react';
import { KnowledgeNote, Domain, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  domains: Domain[];
  allNotes: KnowledgeNote[];
  onSaveNote: (note: Partial<KnowledgeNote>) => void;
  noteToEdit?: KnowledgeNote | null;
  defaultDomainId?: string;
  currentTheme: AppTheme;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  domains,
  allNotes,
  onSaveNote,
  noteToEdit,
  defaultDomainId,
  currentTheme
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [domainId, setDomainId] = useState<string>('');
  const [tagsInput, setTagsInput] = useState('');
  const [linkedNoteIds, setLinkedNoteIds] = useState<string[]>([]);

  const theme = THEMES[currentTheme];

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setDomainId(noteToEdit.domainId || '');
      setTagsInput(noteToEdit.tags.join(', '));
      setLinkedNoteIds(noteToEdit.linkedNoteIds || []);
    } else {
      setTitle('');
      setContent('');
      setDomainId(defaultDomainId || '');
      setTagsInput('');
      setLinkedNoteIds([]);
    }
  }, [noteToEdit, isOpen, defaultDomainId]);

  if (!isOpen) return null;

  // Real-time wiki link parser: detect [[Note Title]] in content
  const detectedWikiLinks = allNotes.filter((n) => {
    if (noteToEdit && n.id === noteToEdit.id) return false;
    const wikiTag = `[[${n.title.toLowerCase()}]]`;
    return content.toLowerCase().includes(wikiTag);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Combine manually linked notes and automatically detected wiki links
    const detectedIds = detectedWikiLinks.map((n) => n.id);
    const combinedLinkedIds = Array.from(new Set([...linkedNoteIds, ...detectedIds]));

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onSaveNote({
      title: title.trim(),
      content: content.trim(),
      domainId: domainId || null,
      tags,
      linkedNoteIds: combinedLinkedIds
    });
    onClose();
  };

  const toggleLinkNote = (id: string) => {
    setLinkedNoteIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className={`w-full max-w-2xl rounded-3xl ${theme.cardBg} border ${theme.cardBorder} p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">
              {noteToEdit ? 'Edit Knowledge Node' : 'New Knowledge Node'}
            </h3>
            <p className="text-xs text-slate-400">
              Cross-pollinate ideas across disciplines with <code className="text-cyan-300">[[Wiki Links]]</code>.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Concept / Note Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. State Machines in Games vs Music Theory Modulation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
          </div>

          {/* Domain (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Primary Domain
            </label>
            <select
              value={domainId}
              onChange={(e) => setDomainId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
            >
              <option value="">🌐 Cross-Domain Interdisciplinary (General)</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon} {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content (Markdown) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Content & Insights (Markdown)
              </label>
              <span className="text-[11px] text-slate-400">
                Tip: Type <code className="text-cyan-300 font-mono">[[Other Note Title]]</code> to link notes
              </span>
            </div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, formulas, code snippets, or cross-domain insights..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed resize-y"
            />
          </div>

          {/* Auto-detected Wiki Links Callout */}
          {detectedWikiLinks.length > 0 && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Link2 className="w-3.5 h-3.5" />
                <span>Auto-Discovered Wiki Links:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detectedWikiLinks.map((n) => (
                  <span
                    key={n.id}
                    className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold"
                  >
                    [[{n.title}]]
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="patterns, logic, rhythm, game-design, theory"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Connect to existing notes manually */}
          {allNotes.filter((n) => !noteToEdit || n.id !== noteToEdit.id).length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Link Directly to Other Concepts</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                {allNotes
                  .filter((n) => !noteToEdit || n.id !== noteToEdit.id)
                  .map((other) => {
                    const isLinked = linkedNoteIds.includes(other.id);
                    return (
                      <button
                        type="button"
                        key={other.id}
                        onClick={() => toggleLinkNote(other.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          isLinked
                            ? 'bg-purple-500/30 text-purple-200 border border-purple-400'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {other.title}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 transition active:scale-95"
            >
              {noteToEdit ? 'Save Node' : 'Create Knowledge Node'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
