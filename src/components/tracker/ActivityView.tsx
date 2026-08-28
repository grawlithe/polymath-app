import React, { useState } from 'react';
import { Activity, Flame, Clock, Sparkles, Plus, Calendar, Shield, Trash2, Search } from 'lucide-react';
import { EffortLog, Domain, SkillNode, UserStats, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';
import { gamification } from '../../services/gamification';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

interface ActivityViewProps {
  logs: EffortLog[];
  domains: Domain[];
  skills: SkillNode[];
  stats: UserStats;
  currentTheme: AppTheme;
  onOpenLogEffort: () => void;
  onDeleteLog: (logId: string) => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  logs,
  domains,
  skills,
  stats,
  currentTheme,
  onOpenLogEffort,
  onDeleteLog
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = THEMES[currentTheme];

  const domainMap = new Map(domains.map((d) => [d.id, d]));
  const levelInfo = gamification.calculateLevel(stats.totalXp);

  // Generate last 180 days for activity heatmap
  const daysToShow = 140; // 20 weeks x 7 days
  const today = new Date();
  const pastDays = Array.from({ length: daysToShow }, (_, i) => {
    const day = subDays(today, daysToShow - 1 - i);
    const dayLogs = logs.filter((l) => isSameDay(parseISO(l.timestamp), day));
    const totalMins = dayLogs.reduce((acc, l) => acc + l.minutesSpent, 0);
    return {
      date: day,
      formatted: format(day, 'MMM d, yyyy'),
      minutes: totalMins,
      count: dayLogs.length
    };
  });

  // Calculate total minutes by domain
  const domainMinutesMap = new Map<string, number>();
  logs.forEach((l) => {
    domainMinutesMap.set(l.domainId, (domainMinutesMap.get(l.domainId) || 0) + l.minutesSpent);
  });

  const totalHours = (stats.totalMinutes / 60).toFixed(1);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.domainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.notes && l.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.skillName && l.skillName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const getHeatmapColor = (minutes: number) => {
    if (minutes === 0) return 'bg-slate-900 border-slate-800/80';
    if (minutes < 20) return 'bg-emerald-950 border-emerald-800 text-emerald-300';
    if (minutes < 45) return 'bg-emerald-700 border-emerald-600 text-white';
    if (minutes < 90) return 'bg-emerald-500 border-emerald-400 text-white';
    return 'bg-cyan-400 border-cyan-300 text-slate-950';
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Atomic Progress & Ledger
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Record actual hours invested rather than checking off arbitrary finish lines. Effort is cumulative.
          </p>
        </div>

        <button
          onClick={onOpenLogEffort}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Log Practice Effort</span>
        </button>
      </div>

      {/* High-Level Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Polymath Level */}
        <div className={`p-4 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} shadow`}>
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" /> Polymath Level
          </div>
          <div className="text-2xl font-extrabold text-white">
            Lvl {levelInfo.level}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {stats.totalXp} Total XP
          </div>
        </div>

        {/* Total Hours */}
        <div className={`p-4 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} shadow`}>
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Total Time
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono">
            {totalHours}h
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {stats.totalMinutes} minutes invested
          </div>
        </div>

        {/* Total Focus Sessions */}
        <div className={`p-4 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} shadow`}>
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" /> Effort Logs
          </div>
          <div className="text-2xl font-extrabold text-white">
            {logs.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Atomic practice sessions
          </div>
        </div>

        {/* Current Active Domains */}
        <div className={`p-4 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} shadow`}>
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 text-emerald-400" /> Active Sprints
          </div>
          <div className="text-2xl font-extrabold text-emerald-300">
            {domains.filter((d) => d.status === 'active').length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {domains.filter((d) => d.status === 'dormant').length} dormant
          </div>
        </div>

      </div>

      {/* GitHub-Style 140-Day Activity Heatmap */}
      <div className={`p-5 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl space-y-3`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Consistency Matrix (Last 20 Weeks)</span>
          </h3>
          <div className="flex items-center space-x-1 text-[10px] text-slate-400">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-700" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded bg-cyan-400" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[500px]">
            {pastDays.map((d, idx) => (
              <div
                key={idx}
                title={`${d.formatted}: ${d.minutes} minutes (${d.count} sessions)`}
                className={`w-3.5 h-3.5 rounded-sm border transition-transform hover:scale-125 cursor-pointer ${getHeatmapColor(
                  d.minutes
                )}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Domain Time Allocation */}
      {domains.length > 0 && (
        <div className={`p-5 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl space-y-4`}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Effort Investment By Domain
          </h3>
          <div className="space-y-3">
            {domains.map((domain) => {
              const mins = domainMinutesMap.get(domain.id) || 0;
              const percent = stats.totalMinutes > 0 ? Math.round((mins / stats.totalMinutes) * 100) : 0;
              return (
                <div key={domain.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span>{domain.icon}</span>
                      <span className="font-bold text-white">{domain.name}</span>
                    </div>
                    <span className="text-slate-400 font-mono">
                      {(mins / 60).toFixed(1)}h ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full bg-gradient-to-r ${domain.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chronological Effort Logs Journal */}
      <div className={`p-5 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Practice History & Session Notes ({logs.length})
          </h3>

          <div className="relative max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search session logs..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs sm:text-sm">
            No effort logs recorded yet. Complete a quest timer or click 'Log Practice Effort'.
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No logs matched your search.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredLogs.map((log) => {
              const domain = domainMap.get(log.domainId);
              return (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3 group">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                        {domain?.icon || 'Ψ'} {log.domainName}
                      </span>

                      {log.skillName && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold text-amber-300 bg-amber-950/40 border border-amber-800/40">
                          🌳 {log.skillName}
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500 font-mono">
                        {format(parseISO(log.timestamp), 'MMM d, yyyy • h:mm a')}
                      </span>
                    </div>

                    {log.notes && (
                      <p className="text-xs text-slate-300 font-mono leading-relaxed">
                        {log.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 self-center">
                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-400 font-mono">
                        +{log.xpGained} XP
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {log.minutesSpent}m
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
