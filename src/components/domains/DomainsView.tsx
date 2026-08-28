import React, { useState } from 'react';
import { Plus, Layers, Flame, Moon, Search, Sparkles, Filter } from 'lucide-react';
import { Domain, Quest, SkillNode, AppTheme } from '../../types';
import { DomainCard } from './DomainCard';
import { THEMES } from '../../services/theme';

interface DomainsViewProps {
  domains: Domain[];
  quests: Quest[];
  skills: SkillNode[];
  currentTheme: AppTheme;
  onOpenNewDomain: () => void;
  onOpenSaveState: (domain: Domain) => void;
  onViewSaveState: (domain: Domain) => void;
  onOpenNewQuest: (domainId: string) => void;
  onSelectDomainSkills: (domainId: string) => void;
  onEditDomain: (domain: Domain) => void;
  onDeleteDomain: (domainId: string) => void;
  onQuickLogEffort: (domain: Domain) => void;
}

export const DomainsView: React.FC<DomainsViewProps> = ({
  domains,
  quests,
  skills,
  currentTheme,
  onOpenNewDomain,
  onOpenSaveState,
  onViewSaveState,
  onOpenNewQuest,
  onSelectDomainSkills,
  onEditDomain,
  onDeleteDomain,
  onQuickLogEffort
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'dormant'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const theme = THEMES[currentTheme];

  const filteredDomains = domains.filter((d) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && d.status === 'active') ||
      (filter === 'dormant' && d.status === 'dormant');

    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const activeDomains = filteredDomains.filter((d) => d.status === 'active');
  const dormantDomains = filteredDomains.filter((d) => d.status === 'dormant');

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner / Philosophy reminder */}
      <div className={`p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Domains & Save States</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Multi-passionate minds cycle through interests. Move hobbies to <strong className="text-purple-300">Dormant</strong> when work is busy without any overdue guilt, then reload your <strong className="text-cyan-300">Save State</strong> instantly when you return.
          </p>
        </div>

        <button
          onClick={onOpenNewDomain}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Interest Domain</span>
        </button>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domains..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({domains.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              filter === 'active'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Active Sprints ({domains.filter((d) => d.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('dormant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              filter === 'dormant'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3 h-3 text-purple-400" />
            Dormant ({domains.filter((d) => d.status === 'dormant').length})
          </button>
        </div>
      </div>

      {/* Empty State */}
      {domains.length === 0 ? (
        <div className={`text-center py-16 px-4 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} max-w-lg mx-auto shadow-xl`}>
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-3xl">
            ✨
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Domains Added Yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Create your first interest domain (e.g. <em>Game Dev</em>, <em>Music / Guitar</em>, <em>Game Design</em>, <em>Writing</em>) to start mastering your passions.
          </p>
          <button
            onClick={onOpenNewDomain}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 inline-flex items-center gap-2 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Domain</span>
          </button>
        </div>
      ) : filteredDomains.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No domains matched your search filter.
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Active Sprints Section */}
          {(filter === 'all' || filter === 'active') && activeDomains.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Focus Sprints</span>
                  <span className="text-xs text-slate-500 font-mono">({activeDomains.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeDomains.map((domain) => (
                  <DomainCard
                    key={domain.id}
                    domain={domain}
                    questCount={quests.filter((q) => q.domainId === domain.id && q.status !== 'completed').length}
                    skillCount={skills.filter((s) => s.domainId === domain.id).length}
                    currentTheme={currentTheme}
                    onOpenSaveState={onOpenSaveState}
                    onViewSaveState={onViewSaveState}
                    onOpenNewQuest={onOpenNewQuest}
                    onSelectDomainSkills={onSelectDomainSkills}
                    onEditDomain={onEditDomain}
                    onDeleteDomain={onDeleteDomain}
                    onQuickLogEffort={onQuickLogEffort}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Dormant Section */}
          {(filter === 'all' || filter === 'dormant') && dormantDomains.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-400" />
                  <span>Dormant Shelf (Safely Paused)</span>
                  <span className="text-xs text-slate-500 font-mono">({dormantDomains.length})</span>
                </h3>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Click 'Load Save State' on any card to resume whenever you are ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dormantDomains.map((domain) => (
                  <DomainCard
                    key={domain.id}
                    domain={domain}
                    questCount={quests.filter((q) => q.domainId === domain.id && q.status !== 'completed').length}
                    skillCount={skills.filter((s) => s.domainId === domain.id).length}
                    currentTheme={currentTheme}
                    onOpenSaveState={onOpenSaveState}
                    onViewSaveState={onViewSaveState}
                    onOpenNewQuest={onOpenNewQuest}
                    onSelectDomainSkills={onSelectDomainSkills}
                    onEditDomain={onEditDomain}
                    onDeleteDomain={onDeleteDomain}
                    onQuickLogEffort={onQuickLogEffort}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
