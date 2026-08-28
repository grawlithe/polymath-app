import React, { useState } from 'react';
import { Plus, Zap, Compass, Filter, Search, CheckCircle2, Clock, Flame } from 'lucide-react';
import { Quest, Domain, SkillNode, EnergyLevel, AppTheme } from '../../types';
import { QuestCard } from './QuestCard';
import { THEMES } from '../../services/theme';

interface QuestBoardViewProps {
  quests: Quest[];
  domains: Domain[];
  skills: SkillNode[];
  currentTheme: AppTheme;
  onOpenNewQuest: () => void;
  onOpenWhatNow: () => void;
  onToggleCompleteQuest: (quest: Quest) => void;
  onStartTimer: (quest: Quest) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
}

export const QuestBoardView: React.FC<QuestBoardViewProps> = ({
  quests,
  domains,
  skills,
  currentTheme,
  onOpenNewQuest,
  onOpenWhatNow,
  onToggleCompleteQuest,
  onStartTimer,
  onEditQuest,
  onDeleteQuest
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'open' | 'completed' | 'all'>('open');
  const [searchQuery, setSearchQuery] = useState('');

  const theme = THEMES[currentTheme];

  const domainMap = new Map(domains.map((d) => [d.id, d]));
  const skillMap = new Map(skills.map((s) => [s.id, s]));

  const filteredQuests = quests.filter((q) => {
    const matchesDomain = selectedDomainId === 'all' || q.domainId === selectedDomainId;
    const matchesEnergy = selectedEnergy === 'all' || q.energyLevel.toString() === selectedEnergy;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'open' && q.status !== 'completed') ||
      (statusFilter === 'completed' && q.status === 'completed');
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesEnergy && matchesStatus && matchesSearch;
  });

  const openQuestsCount = quests.filter((q) => q.status !== 'completed').length;
  const completedQuestsCount = quests.filter((q) => q.status === 'completed').length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner with "What Now?" Engine Trigger */}
      <div className={`p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Energy-Matched Quest Board
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pick tasks based on your current physical & mental battery rather than artificial deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={onOpenWhatNow}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition active:scale-95 whitespace-nowrap"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>"What Now?" Engine</span>
          </button>

          <button
            onClick={onOpenNewQuest}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Quest</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'open'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Open ({openQuestsCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Completed ({completedQuestsCount})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({quests.length})
            </button>
          </div>
        </div>

        {/* Energy & Domain Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Energy Filter */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 font-bold px-2 uppercase">Energy:</span>
            {['all', '1', '2', '3'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedEnergy(lvl)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  selectedEnergy === lvl
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'all' ? 'All' : lvl === '1' ? '⚡ Low' : lvl === '2' ? '⚡⚡ Med' : '⚡⚡⚡ High'}
              </button>
            ))}
          </div>

          {/* Domain Filter */}
          {domains.length > 0 && (
            <select
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Domains</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon} {d.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Quests List */}
      {quests.length === 0 ? (
        <div className={`text-center py-16 px-4 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} max-w-lg mx-auto shadow-xl`}>
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-3xl">
            ⚔️
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Quest Board is Empty</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Break down your interests into 15–30 minute micro-quests. Tag each with required energy to make starting effortless.
          </p>
          <button
            onClick={onOpenNewQuest}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 inline-flex items-center gap-2 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Quest</span>
          </button>
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No quests match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              domain={domainMap.get(quest.domainId)}
              skillNode={quest.skillNodeId ? skillMap.get(quest.skillNodeId) : undefined}
              currentTheme={currentTheme}
              onToggleComplete={onToggleCompleteQuest}
              onStartTimer={onStartTimer}
              onEditQuest={onEditQuest}
              onDeleteQuest={onDeleteQuest}
            />
          ))}
        </div>
      )}

    </div>
  );
};
