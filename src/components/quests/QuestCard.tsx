import React from 'react';
import { CheckCircle2, Circle, Clock, Zap, Play, Trash2, Edit3, GitBranch } from 'lucide-react';
import { Quest, Domain, SkillNode, AppTheme } from '../../types';
import { THEMES } from '../../services/theme';

interface QuestCardProps {
  quest: Quest;
  domain?: Domain;
  skillNode?: SkillNode;
  currentTheme: AppTheme;
  onToggleComplete: (quest: Quest) => void;
  onStartTimer: (quest: Quest) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  domain,
  skillNode,
  currentTheme,
  onToggleComplete,
  onStartTimer,
  onEditQuest,
  onDeleteQuest
}) => {
  const theme = THEMES[currentTheme];
  const isCompleted = quest.status === 'completed';

  const energyIcons = ['⚡', '⚡⚡', '⚡⚡⚡'];
  const energyLabels = ['Low', 'Med', 'High'];

  return (
    <div
      className={`group rounded-2xl ${theme.cardBg} border ${theme.cardBorder} p-4 transition-all duration-200 hover:shadow-lg ${
        isCompleted ? 'opacity-50 hover:opacity-75' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggleComplete(quest)}
          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition"
          title={isCompleted ? 'Mark uncompleted' : 'Complete Quest'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          ) : (
            <Circle className="w-5 h-5 hover:border-emerald-400" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {/* Domain Pill */}
            {domain && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                <span className="mr-1">{domain.icon}</span> {domain.name}
              </span>
            )}

            {/* Energy Badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
              <span>{energyIcons[quest.energyLevel - 1]}</span>
              <span className="ml-1 hidden sm:inline">{energyLabels[quest.energyLevel - 1]}</span>
            </span>

            {/* Duration Badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800">
              <Clock className="w-3 h-3 mr-1 text-slate-500" />
              {quest.durationMins}m
            </span>

            {/* Skill Node Link */}
            {skillNode && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40">
                <GitBranch className="w-3 h-3 mr-1" /> {skillNode.name}
              </span>
            )}
          </div>

          <h4 className={`text-sm font-bold text-white leading-snug ${isCompleted ? 'line-through text-slate-400' : ''}`}>
            {quest.title}
          </h4>

          {quest.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {quest.description}
            </p>
          )}
        </div>

        {/* XP Bounty */}
        <div className="flex flex-col items-end justify-between self-stretch">
          <span className="text-xs font-extrabold text-amber-300 font-mono">
            +{quest.xpReward} XP
          </span>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditQuest(quest)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteQuest(quest.id)}
              className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/50 transition"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Start Timer footer button if not completed */}
      {!isCompleted && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-end">
          <button
            onClick={() => onStartTimer(quest)}
            className="px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <Play className="w-3 h-3 fill-cyan-400 text-cyan-400" />
            <span>Launch Timer ({quest.durationMins}m)</span>
          </button>
        </div>
      )}

    </div>
  );
};
