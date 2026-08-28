import { Domain, Quest, SkillNode, EffortLog, KnowledgeNote, AppTheme, UserStats } from '../types';

const STORAGE_KEYS = {
  DOMAINS: 'polymath_domains_v1',
  QUESTS: 'polymath_quests_v1',
  SKILLS: 'polymath_skills_v1',
  LOGS: 'polymath_logs_v1',
  NOTES: 'polymath_notes_v1',
  THEME: 'polymath_theme_v1',
  USER_STATS: 'polymath_user_stats_v1',
  SUPABASE_CONFIG: 'polymath_supabase_cfg_v1'
};

export const storage = {
  getDomains(): Domain[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOMAINS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading domains:', e);
      return [];
    }
  },

  saveDomains(domains: Domain[]): void {
    localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(domains));
  },

  getQuests(): Quest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading quests:', e);
      return [];
    }
  },

  saveQuests(quests: Quest[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  },

  getSkillNodes(): SkillNode[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SKILLS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading skill nodes:', e);
      return [];
    }
  },

  saveSkillNodes(nodes: SkillNode[]): void {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(nodes));
  },

  getLogs(): EffortLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading logs:', e);
      return [];
    }
  },

  saveLogs(logs: EffortLog[]): void {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  getNotes(): KnowledgeNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading notes:', e);
      return [];
    }
  },

  saveNotes(notes: KnowledgeNote[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getTheme(): AppTheme {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME) as AppTheme;
    return theme || 'cyber';
  },

  saveTheme(theme: AppTheme): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getUserStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      return data ? JSON.parse(data) : {
        totalXp: 0,
        polymathLevel: 1,
        streakDays: 0,
        totalMinutes: 0
      };
    } catch (e) {
      return { totalXp: 0, polymathLevel: 1, streakDays: 0, totalMinutes: 0 };
    }
  },

  saveUserStats(stats: UserStats): void {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  },

  exportAllData(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      domains: this.getDomains(),
      quests: this.getQuests(),
      skills: this.getSkillNodes(),
      logs: this.getLogs(),
      notes: this.getNotes(),
      userStats: this.getUserStats(),
      theme: this.getTheme()
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.domains) this.saveDomains(parsed.domains);
      if (parsed.quests) this.saveQuests(parsed.quests);
      if (parsed.skills) this.saveSkillNodes(parsed.skills);
      if (parsed.logs) this.saveLogs(parsed.logs);
      if (parsed.notes) this.saveNotes(parsed.notes);
      if (parsed.userStats) this.saveUserStats(parsed.userStats);
      if (parsed.theme) this.saveTheme(parsed.theme);
      return true;
    } catch (e) {
      console.error('Failed to import backup data:', e);
      return false;
    }
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
