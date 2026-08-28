export type DomainStatus = 'active' | 'dormant';

export interface SaveState {
  id: string;
  domainId: string;
  contextDump: string; // e.g. "Paused tutorial at video 4. Workspace: obj_player.gml"
  lastWorkspace?: string; // file path, URL, book chapter, or tool name
  nextStepAction: string; // single friction-free action to resume, e.g. "Write collision script"
  savedAt: string; // ISO string
}

export interface Domain {
  id: string;
  name: string;
  description?: string;
  icon: string; // Lucide icon identifier or emoji
  color: string; // Tailwind color class or hex, e.g. "from-cyan-500 to-blue-600"
  status: DomainStatus;
  saveState?: SaveState;
  totalXp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export type EnergyLevel = 1 | 2 | 3; // 1 = Low, 2 = Medium, 3 = High

export type QuestStatus = 'open' | 'in_progress' | 'completed';

export interface Quest {
  id: string;
  domainId: string;
  title: string;
  description?: string;
  energyLevel: EnergyLevel; // 1: Low, 2: Medium, 3: High
  durationMins: number; // 15, 30, 45, 60, 120
  status: QuestStatus;
  xpReward: number;
  skillNodeId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SkillNode {
  id: string;
  domainId: string;
  name: string;
  description?: string;
  icon?: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  parentId?: string | null; // For hierarchical skill trees
  unlocked?: boolean;
}

export interface EffortLog {
  id: string;
  domainId: string;
  domainName: string;
  questId?: string;
  questTitle?: string;
  skillNodeId?: string;
  skillName?: string;
  minutesSpent: number;
  xpGained: number;
  notes: string;
  timestamp: string; // ISO string
}

export interface KnowledgeNote {
  id: string;
  domainId?: string | null; // Optional if cross-domain
  title: string;
  content: string; // Markdown supported
  tags: string[];
  linkedNoteIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type AppTheme = 'cyber' | 'obsidian' | 'midnight' | 'matrix' | 'light';

export interface UserStats {
  totalXp: number;
  polymathLevel: number;
  streakDays: number;
  lastActiveDate?: string;
  totalMinutes: number;
}
