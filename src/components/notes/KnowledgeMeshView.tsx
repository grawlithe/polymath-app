import React, { useState } from 'react';
import { Share2, Plus, Search, Tag, Link2, Network, List, Edit3, Trash2, BookOpen } from 'lucide-react';
import { KnowledgeNote, Domain, AppTheme } from '../../types';
import { GraphCanvas } from './GraphCanvas';
import { THEMES } from '../../services/theme';

interface KnowledgeMeshViewProps {
  notes: KnowledgeNote[];
  domains: Domain[];
  currentTheme: AppTheme;
  onOpenNewNote: () => void;
  onSelectNote: (note: KnowledgeNote) => void;
  onDeleteNote: (noteId: string) => void;
}

export const KnowledgeMeshView: React.FC<KnowledgeMeshViewProps> = ({
  notes,
  domains,
  currentTheme,
  onOpenNewNote,
  onSelectNote,
  onDeleteNote
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const theme = THEMES[currentTheme];
  const domainMap = new Map(domains.map((d) => [d.id, d]));

  const filteredNotes = notes.filter((n) => {
    const matchesDomain = selectedDomainId === 'all' || n.domainId === selectedDomainId;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Share2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              The Knowledge Mesh
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            The superpower of polymaths is cross-pollination. Link ideas across gaming, music, science, and code using <code className="text-cyan-300">[[wiki-links]]</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-bold transition ${
                viewMode === 'list' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`p-2 rounded-lg text-xs font-bold transition ${
                viewMode === 'graph' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-white'
              }`}
              title="2D Interactive Graph"
            >
              <Network className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewNote}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 transition active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Domain filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, tags, or content..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        {domains.length > 0 && (
          <select
            value={selectedDomainId}
            onChange={(e) => setSelectedDomainId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs sm:text-sm focus:outline-none focus:border-purple-400 self-start sm:self-auto"
          >
            <option value="all">All Disciplines & Domains</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Graph View vs List View */}
      {viewMode === 'graph' ? (
        <GraphCanvas
          notes={filteredNotes}
          domains={domains}
          onSelectNote={onSelectNote}
          currentTheme={currentTheme}
        />
      ) : notes.length === 0 ? (
        <div className={`text-center py-16 px-4 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} max-w-lg mx-auto shadow-xl`}>
          <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 text-3xl">
            🕸️
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Knowledge Mesh is Empty</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Record notes that bridge your interests. Use [[links]] to discover hidden patterns between unrelated skills.
          </p>
          <button
            onClick={onOpenNewNote}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/25 inline-flex items-center gap-2 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No knowledge notes match the search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const domain = note.domainId ? domainMap.get(note.domainId) : null;
            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`group rounded-2xl ${theme.cardBg} border ${theme.cardBorder} p-5 transition-all duration-200 hover:shadow-xl hover:border-purple-500/50 cursor-pointer space-y-3 relative`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    {domain ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                        {domain.icon} {domain.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-950/50 text-purple-300 border border-purple-800/40">
                        🌐 Cross-Domain
                      </span>
                    )}

                    <h4 className="font-bold text-base text-white group-hover:text-purple-300 transition">
                      {note.title}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/40 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-mono">
                  {note.content}
                </p>

                {/* Tags & Links Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[10px]">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {note.linkedNoteIds.length > 0 && (
                    <span className="flex items-center gap-1 text-purple-300 font-semibold font-mono">
                      <Link2 className="w-3 h-3" /> {note.linkedNoteIds.length} linked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
