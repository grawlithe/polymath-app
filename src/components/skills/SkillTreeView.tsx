import React, { useState } from 'react';
import { GitBranch, Plus, Sparkles, Flame, Shield, Play, Edit3, Trash2, ChevronRight } from 'lucide-react';
import { SkillNode, Domain, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';
import { gamification } from '../../services/gamification';

interface SkillTreeViewProps {
  domains: Domain[];
  skills: SkillNode[];
  selectedDomainId?: string;
  onSelectDomain: (domainId: string) => void;
  onOpenAddSkill: (domainId: string, parentId?: string | null) => void;
  onOpenPracticeSkill: (skill: SkillNode, domain: Domain) => void;
  onEditSkill: (skill: SkillNode) => void;
  onDeleteSkill: (skillId: string) => void;
  currentTheme: AppTheme;
}

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  domains,
  skills,
  selectedDomainId,
  onSelectDomain,
  onOpenAddSkill,
  onOpenPracticeSkill,
  onEditSkill,
  onDeleteSkill,
  currentTheme
}) => {
  const theme = THEMES[currentTheme];

  const activeDomain = domains.find((d) => d.id === selectedDomainId) || domains[0] || null;
  const currentDomainSkills = activeDomain ? skills.filter((s) => s.domainId === activeDomain.id) : [];

  // Group skills by hierarchy: root skills (parentId === null or '') and child skills
  const rootSkills = currentDomainSkills.filter((s) => !s.parentId);
  const getChildren = (parentId: string) => currentDomainSkills.filter((s) => s.parentId === parentId);

  const domainLevelInfo = activeDomain ? gamification.calculateLevel(activeDomain.totalXp) : { level: 1, currentLevelXp: 0, nextLevelXp: 100, progressPercent: 0 };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border ${theme.cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Visual Skill Trees
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Break down infinite domains like guitar or programming into clear technique nodes. Watching individual branches level up gives you atomic dopamine.
          </p>
        </div>

        {activeDomain && (
          <button
            onClick={() => onOpenAddSkill(activeDomain.id, null)}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill Node</span>
          </button>
        )}
      </div>

      {/* Domain Selection Tabs */}
      {domains.length > 0 ? (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {domains.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelectDomain(d.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                activeDomain?.id === d.id
                  ? `bg-gradient-to-r ${d.color} text-white shadow-lg scale-102`
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{d.icon}</span>
              <span>{d.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 font-mono">
                Lvl {gamification.calculateLevel(d.totalXp).level}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className={`p-8 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} text-center`}>
          <div className="text-slate-400 text-sm">Please create a Domain first to view its skill tree.</div>
        </div>
      )}

      {/* Active Domain Tree Dashboard */}
      {activeDomain && (
        <div className="space-y-6">
          
          {/* Domain Mastery Header Card */}
          <div className={`p-5 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeDomain.color} flex items-center justify-center text-3xl shadow-lg text-white font-bold`}>
                {activeDomain.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white">{activeDomain.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Lvl {domainLevelInfo.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentDomainSkills.length} branches mapped • {activeDomain.totalXp} Total Domain XP
                </p>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Progress to Lvl {domainLevelInfo.level + 1}</span>
                <span className="text-cyan-400 font-mono font-bold">{domainLevelInfo.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${activeDomain.color} transition-all duration-500`}
                  style={{ width: `${domainLevelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Skill Nodes Branch Visual Canvas / Cards */}
          {currentDomainSkills.length === 0 ? (
            <div className={`p-12 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} text-center space-y-4`}>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-2xl">
                🌳
              </div>
              <h4 className="text-base font-bold text-white">No Skill Nodes Added for {activeDomain.name}</h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Add nodes to break this domain down (e.g. <em>Music &rarr; Rhythm, Chords, Alternate Picking</em>).
              </p>
              <button
                onClick={() => onOpenAddSkill(activeDomain.id, null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 inline-flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Root Skill Node</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {rootSkills.map((rootNode) => {
                const rootLevelInfo = gamification.calculateSkillLevel(rootNode.xp);
                const children = getChildren(rootNode.id);

                return (
                  <div
                    key={rootNode.id}
                    className={`p-5 rounded-3xl ${theme.cardBg} border ${theme.cardBorder} shadow-lg space-y-4`}
                  >
                    {/* Root Node Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-lg text-cyan-400 shadow">
                          🌳
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-base text-white">{rootNode.name}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Lvl {rootLevelInfo.level}
                            </span>
                          </div>
                          {rootNode.description && (
                            <p className="text-xs text-slate-400 mt-0.5">{rootNode.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center space-x-2 self-end sm:self-auto">
                        <button
                          onClick={() => onOpenPracticeSkill(rootNode, activeDomain)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow flex items-center gap-1 transition active:scale-95"
                          title="Log Practice for this skill"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>+ Practice ({rootNode.xp} XP)</span>
                        </button>

                        <button
                          onClick={() => onOpenAddSkill(activeDomain.id, rootNode.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1 transition"
                          title="Add sub-technique"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Sub-Skill</span>
                        </button>

                        <button
                          onClick={() => onEditSkill(rootNode)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSkill(rootNode.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Root Node Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>XP Progress to Level {rootLevelInfo.level + 1}</span>
                        <span className="font-mono text-cyan-300">{rootLevelInfo.currentXp} / {rootLevelInfo.maxLevelXp} XP</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${rootLevelInfo.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Sub-skills Branching Cards (Grandchildren & Children) */}
                    {children.length > 0 && (
                      <div className="pt-2 pl-2 sm:pl-6 border-l-2 border-slate-800/80 space-y-3">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Branch Techniques ({children.length})</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {children.map((child) => {
                            const childLevelInfo = gamification.calculateSkillLevel(child.xp);
                            return (
                              <div
                                key={child.id}
                                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-xs sm:text-sm text-white">
                                        {child.name}
                                      </span>
                                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                        Lvl {childLevelInfo.level}
                                      </span>
                                    </div>
                                    {child.description && (
                                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                        {child.description}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={() => onEditSkill(child)}
                                      className="p-1 text-slate-400 hover:text-white"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => onDeleteSkill(child.id)}
                                      className="p-1 text-rose-400 hover:text-rose-300"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Child Progress */}
                                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                                  <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                                    style={{ width: `${childLevelInfo.progressPercent}%` }}
                                  />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-[10px] font-mono text-slate-500">
                                    {child.xp} XP
                                  </span>
                                  <button
                                    onClick={() => onOpenPracticeSkill(child, activeDomain)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition"
                                  >
                                    <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                                    <span>Practice</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
