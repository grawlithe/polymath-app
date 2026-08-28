import React, { useState, useEffect } from 'react';
import { Domain, Quest, SkillNode, EffortLog, KnowledgeNote, AppTheme, UserStats, SaveState } from './types';
import { storage } from './services/storage';
import { THEMES } from './services/theme';
import { gamification, audioFX } from './services/gamification';

// Layout
import { Navbar } from './components/layout/Navbar';
import { BottomNav, TabId } from './components/layout/BottomNav';

// Views
import { DomainsView } from './components/domains/DomainsView';
import { QuestBoardView } from './components/quests/QuestBoardView';
import { SkillTreeView } from './components/skills/SkillTreeView';
import { KnowledgeMeshView } from './components/notes/KnowledgeMeshView';
import { ActivityView } from './components/tracker/ActivityView';

// Modals
import { DomainFormModal } from './components/domains/DomainFormModal';
import { SaveStateModal } from './components/domains/SaveStateModal';
import { SaveStateViewModal } from './components/domains/SaveStateViewModal';
import { WhatNowModal } from './components/quests/WhatNowModal';
import { QuestTimerModal } from './components/quests/QuestTimerModal';
import { QuestModal } from './components/quests/QuestModal';
import { SkillNodeModal } from './components/skills/SkillNodeModal';
import { PracticeSkillModal } from './components/skills/PracticeSkillModal';
import { NoteModal } from './components/notes/NoteModal';
import { EffortLogModal } from './components/tracker/EffortLogModal';
import { BackupModal } from './components/sync/BackupModal';

export const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<TabId>('domains');
  const [theme, setTheme] = useState<AppTheme>(() => storage.getTheme());
  const [domains, setDomains] = useState<Domain[]>(() => storage.getDomains());
  const [quests, setQuests] = useState<Quest[]>(() => storage.getQuests());
  const [skills, setSkills] = useState<SkillNode[]>(() => storage.getSkillNodes());
  const [logs, setLogs] = useState<EffortLog[]>(() => storage.getLogs());
  const [notes, setNotes] = useState<KnowledgeNote[]>(() => storage.getNotes());
  const [stats, setStats] = useState<UserStats>(() => storage.getUserStats());

  // Modal states
  const [isDomainFormOpen, setIsDomainFormOpen] = useState(false);
  const [domainToEdit, setDomainToEdit] = useState<Domain | null>(null);

  const [isSaveStateModalOpen, setIsSaveStateModalOpen] = useState(false);
  const [domainForSaveState, setDomainForSaveState] = useState<Domain | null>(null);

  const [isSaveStateViewOpen, setIsSaveStateViewOpen] = useState(false);
  const [domainForSaveStateView, setDomainForSaveStateView] = useState<Domain | null>(null);

  const [isWhatNowOpen, setIsWhatNowOpen] = useState(false);

  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [questToEdit, setQuestToEdit] = useState<Quest | null>(null);
  const [defaultDomainIdForQuest, setDefaultDomainIdForQuest] = useState<string>('');

  const [activeTimerQuest, setActiveTimerQuest] = useState<Quest | null>(null);

  const [selectedDomainIdForSkills, setSelectedDomainIdForSkills] = useState<string>('');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<SkillNode | null>(null);
  const [skillParentId, setSkillParentId] = useState<string | null>(null);

  const [activePracticeSkill, setActivePracticeSkill] = useState<{ skill: SkillNode; domain: Domain } | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<KnowledgeNote | null>(null);

  const [isEffortLogModalOpen, setIsEffortLogModalOpen] = useState(false);
  const [defaultDomainIdForEffort, setDefaultDomainIdForEffort] = useState<string>('');

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Sync to local storage on change
  useEffect(() => {
    storage.saveDomains(domains);
  }, [domains]);

  useEffect(() => {
    storage.saveQuests(quests);
  }, [quests]);

  useEffect(() => {
    storage.saveSkillNodes(skills);
  }, [skills]);

  useEffect(() => {
    storage.saveLogs(logs);
  }, [logs]);

  useEffect(() => {
    storage.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    storage.saveUserStats(stats);
  }, [stats]);

  useEffect(() => {
    storage.saveTheme(theme);
    // Apply body theme class
    const tConfig = THEMES[theme];
    document.body.className = `${tConfig.bgClass} antialiased selection:bg-cyan-500 selection:text-white overflow-x-hidden min-h-screen`;
  }, [theme]);

  // Today's total focus minutes
  const today = new Date().toISOString().slice(0, 10);
  const todayMinutes = logs
    .filter((l) => l.timestamp.startsWith(today))
    .reduce((acc, l) => acc + l.minutesSpent, 0);

  // Reload all data after restore
  const handleDataRestored = () => {
    setDomains(storage.getDomains());
    setQuests(storage.getQuests());
    setSkills(storage.getSkillNodes());
    setLogs(storage.getLogs());
    setNotes(storage.getNotes());
    setStats(storage.getUserStats());
    setTheme(storage.getTheme());
  };

  // Gamification helper: award XP to user, domain, and optional skill node
  const awardExperience = (
    domainId: string,
    minutes: number,
    xpGained: number,
    skillNodeId?: string,
    questId?: string,
    notesText: string = ''
  ) => {
    const domain = domains.find((d) => d.id === domainId);
    const skill = skills.find((s) => s.id === skillNodeId);

    // 1. Update Domain XP
    setDomains((prev) =>
      prev.map((d) => {
        if (d.id === domainId) {
          const newXp = d.totalXp + xpGained;
          const newLevel = gamification.calculateLevel(newXp).level;
          return { ...d, totalXp: newXp, level: newLevel, updatedAt: new Date().toISOString() };
        }
        return d;
      })
    );

    // 2. Update Skill Node XP if present
    if (skillNodeId) {
      setSkills((prev) =>
        prev.map((s) => {
          if (s.id === skillNodeId) {
            const newXp = s.xp + xpGained;
            const newLevel = gamification.calculateSkillLevel(newXp).level;
            return { ...s, xp: newXp, level: newLevel };
          }
          return s;
        })
      );
    }

    // 3. Record Effort Log
    const newLog: EffortLog = {
      id: crypto.randomUUID(),
      domainId,
      domainName: domain?.name || 'General',
      skillNodeId,
      skillName: skill?.name,
      questId,
      minutesSpent: minutes,
      xpGained,
      notes: notesText,
      timestamp: new Date().toISOString()
    };
    setLogs((prev) => [newLog, ...prev]);

    // 4. Update User Stats
    setStats((prev) => {
      const newTotalXp = prev.totalXp + xpGained;
      const newPolyLevel = gamification.calculateLevel(newTotalXp).level;
      return {
        ...prev,
        totalXp: newTotalXp,
        polymathLevel: newPolyLevel,
        totalMinutes: prev.totalMinutes + minutes,
        lastActiveDate: new Date().toISOString()
      };
    });
  };

  // --- Domain Handlers ---
  const handleSaveDomain = (domainData: Partial<Domain>) => {
    if (domainToEdit) {
      setDomains((prev) =>
        prev.map((d) =>
          d.id === domainToEdit.id
            ? { ...d, ...domainData, updatedAt: new Date().toISOString() }
            : d
        )
      );
    } else {
      const newDomain: Domain = {
        id: crypto.randomUUID(),
        name: domainData.name || 'Untitled Domain',
        description: domainData.description || '',
        icon: domainData.icon || '🎮',
        color: domainData.color || 'from-cyan-500 to-blue-600',
        status: domainData.status || 'active',
        totalXp: 0,
        level: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDomains((prev) => [newDomain, ...prev]);
      if (!selectedDomainIdForSkills) {
        setSelectedDomainIdForSkills(newDomain.id);
      }
    }
  };

  const handleDeleteDomain = (domainId: string) => {
    if (confirm('Are you sure you want to delete this domain and its associated skill nodes?')) {
      setDomains((prev) => prev.filter((d) => d.id !== domainId));
      setQuests((prev) => prev.filter((q) => q.domainId !== domainId));
      setSkills((prev) => prev.filter((s) => s.domainId !== domainId));
    }
  };

  // --- Save State Handlers ---
  const handleSaveState = (domainId: string, saveState: SaveState) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.id === domainId
          ? {
              ...d,
              status: 'dormant', // Anti-guilt: freeze domain safely to dormant
              saveState,
              updatedAt: new Date().toISOString()
            }
          : d
      )
    );
  };

  const handleWakeUpDomain = (domainId: string) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.id === domainId
          ? { ...d, status: 'active', updatedAt: new Date().toISOString() }
          : d
      )
    );
    audioFX.playQuestComplete();
  };

  // --- Quest Handlers ---
  const handleSaveQuest = (questData: Partial<Quest>) => {
    if (questToEdit) {
      setQuests((prev) =>
        prev.map((q) => (q.id === questToEdit.id ? { ...q, ...questData } as Quest : q))
      );
    } else {
      const newQuest: Quest = {
        id: crypto.randomUUID(),
        domainId: questData.domainId || (domains[0]?.id || ''),
        title: questData.title || 'Untitled Quest',
        description: questData.description,
        energyLevel: questData.energyLevel || 1,
        durationMins: questData.durationMins || 15,
        status: 'open',
        xpReward: questData.xpReward || 30,
        skillNodeId: questData.skillNodeId,
        createdAt: new Date().toISOString()
      };
      setQuests((prev) => [newQuest, ...prev]);
    }
  };

  const handleToggleCompleteQuest = (quest: Quest) => {
    const isNowCompleted = quest.status !== 'completed';
    setQuests((prev) =>
      prev.map((q) =>
        q.id === quest.id
          ? {
              ...q,
              status: isNowCompleted ? 'completed' : 'open',
              completedAt: isNowCompleted ? new Date().toISOString() : undefined
            }
          : q
      )
    );

    if (isNowCompleted) {
      gamification.triggerCelebration();
      audioFX.playQuestComplete();
      awardExperience(
        quest.domainId,
        quest.durationMins,
        quest.xpReward,
        quest.skillNodeId,
        quest.id,
        `Completed quest: ${quest.title}`
      );
    }
  };

  const handleDeleteQuest = (questId: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  const handleFinishTimerQuest = (questId: string, minutesSpent: number, notesText: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: 'completed', completedAt: new Date().toISOString() }
          : q
      )
    );

    awardExperience(
      quest.domainId,
      minutesSpent,
      quest.xpReward,
      quest.skillNodeId,
      quest.id,
      notesText || `Focus session: ${quest.title}`
    );
  };

  // --- Skill Tree Handlers ---
  const handleSaveSkill = (skillData: Partial<SkillNode>) => {
    if (skillToEdit) {
      setSkills((prev) =>
        prev.map((s) => (s.id === skillToEdit.id ? { ...s, ...skillData } as SkillNode : s))
      );
    } else {
      const newSkill: SkillNode = {
        id: crypto.randomUUID(),
        domainId: skillData.domainId || '',
        name: skillData.name || 'Untitled Skill',
        description: skillData.description,
        level: 1,
        maxLevel: skillData.maxLevel || 10,
        xp: 0,
        xpToNext: 50,
        parentId: skillData.parentId || null
      };
      setSkills((prev) => [...prev, newSkill]);
    }
  };

  const handleDeleteSkill = (skillId: string) => {
    if (confirm('Delete this skill node and its sub-branches?')) {
      setSkills((prev) => prev.filter((s) => s.id !== skillId && s.parentId !== skillId));
    }
  };

  const handleLogSkillPractice = (skillId: string, minutes: number, notesText: string) => {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) return;
    const xpGained = minutes * 2;
    awardExperience(skill.domainId, minutes, xpGained, skill.id, undefined, notesText);
  };

  // --- Note Handlers ---
  const handleSaveNote = (noteData: Partial<KnowledgeNote>) => {
    if (noteToEdit) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteToEdit.id
            ? { ...n, ...noteData, updatedAt: new Date().toISOString() } as KnowledgeNote
            : n
        )
      );
    } else {
      const newNote: KnowledgeNote = {
        id: crypto.randomUUID(),
        title: noteData.title || 'Untitled Note',
        content: noteData.content || '',
        domainId: noteData.domainId || null,
        tags: noteData.tags || [],
        linkedNoteIds: noteData.linkedNoteIds || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // --- Effort Log Handlers ---
  const handleSaveManualEffort = (logData: Partial<EffortLog>) => {
    if (!logData.domainId) return;
    awardExperience(
      logData.domainId,
      logData.minutesSpent || 30,
      logData.xpGained || 60,
      logData.skillNodeId,
      undefined,
      logData.notes || ''
    );
  };

  const handleDeleteLog = (logId: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* Top Navbar */}
      <Navbar
        stats={stats}
        currentTheme={theme}
        onSelectTheme={setTheme}
        onOpenWhatNow={() => setIsWhatNowOpen(true)}
        onOpenNewDomain={() => {
          setDomainToEdit(null);
          setIsDomainFormOpen(true);
        }}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        todayMinutes={todayMinutes}
      />

      {/* Main Tab Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1">
        
        {activeTab === 'domains' && (
          <DomainsView
            domains={domains}
            quests={quests}
            skills={skills}
            currentTheme={theme}
            onOpenNewDomain={() => {
              setDomainToEdit(null);
              setIsDomainFormOpen(true);
            }}
            onOpenSaveState={(dom) => {
              setDomainForSaveState(dom);
              setIsSaveStateModalOpen(true);
            }}
            onViewSaveState={(dom) => {
              setDomainForSaveStateView(dom);
              setIsSaveStateViewOpen(true);
            }}
            onOpenNewQuest={(domId) => {
              setDefaultDomainIdForQuest(domId);
              setQuestToEdit(null);
              setIsQuestModalOpen(true);
            }}
            onSelectDomainSkills={(domId) => {
              setSelectedDomainIdForSkills(domId);
              setActiveTab('skills');
            }}
            onEditDomain={(dom) => {
              setDomainToEdit(dom);
              setIsDomainFormOpen(true);
            }}
            onDeleteDomain={handleDeleteDomain}
            onQuickLogEffort={(dom) => {
              setDefaultDomainIdForEffort(dom.id);
              setIsEffortLogModalOpen(true);
            }}
          />
        )}

        {activeTab === 'quests' && (
          <QuestBoardView
            quests={quests}
            domains={domains}
            skills={skills}
            currentTheme={theme}
            onOpenNewQuest={() => {
              setQuestToEdit(null);
              setDefaultDomainIdForQuest('');
              setIsQuestModalOpen(true);
            }}
            onOpenWhatNow={() => setIsWhatNowOpen(true)}
            onToggleCompleteQuest={handleToggleCompleteQuest}
            onStartTimer={(q) => setActiveTimerQuest(q)}
            onEditQuest={(q) => {
              setQuestToEdit(q);
              setIsQuestModalOpen(true);
            }}
            onDeleteQuest={handleDeleteQuest}
          />
        )}

        {activeTab === 'skills' && (
          <SkillTreeView
            domains={domains}
            skills={skills}
            selectedDomainId={selectedDomainIdForSkills || domains[0]?.id}
            onSelectDomain={setSelectedDomainIdForSkills}
            onOpenAddSkill={(domId, parentId) => {
              setSelectedDomainIdForSkills(domId);
              setSkillParentId(parentId || null);
              setSkillToEdit(null);
              setIsSkillModalOpen(true);
            }}
            onOpenPracticeSkill={(sk, dom) => {
              setActivePracticeSkill({ skill: sk, domain: dom });
            }}
            onEditSkill={(sk) => {
              setSkillToEdit(sk);
              setIsSkillModalOpen(true);
            }}
            onDeleteSkill={handleDeleteSkill}
            currentTheme={theme}
          />
        )}

        {activeTab === 'notes' && (
          <KnowledgeMeshView
            notes={notes}
            domains={domains}
            currentTheme={theme}
            onOpenNewNote={() => {
              setNoteToEdit(null);
              setIsNoteModalOpen(true);
            }}
            onSelectNote={(n) => {
              setNoteToEdit(n);
              setIsNoteModalOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeTab === 'tracker' && (
          <ActivityView
            logs={logs}
            domains={domains}
            skills={skills}
            stats={stats}
            currentTheme={theme}
            onOpenLogEffort={() => {
              setDefaultDomainIdForEffort('');
              setIsEffortLogModalOpen(true);
            }}
            onDeleteLog={handleDeleteLog}
          />
        )}

      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentTheme={theme}
        activeDomainCount={domains.filter((d) => d.status === 'active').length}
        openQuestCount={quests.filter((q) => q.status !== 'completed').length}
      />

      {/* --- MODALS --- */}
      
      {/* Domain Form Modal */}
      <DomainFormModal
        isOpen={isDomainFormOpen}
        onClose={() => setIsDomainFormOpen(false)}
        onSave={handleSaveDomain}
        domainToEdit={domainToEdit}
        currentTheme={theme}
      />

      {/* Save State Snapshot Modal */}
      {domainForSaveState && (
        <SaveStateModal
          isOpen={isSaveStateModalOpen}
          onClose={() => {
            setIsSaveStateModalOpen(false);
            setDomainForSaveState(null);
          }}
          domain={domainForSaveState}
          onSaveState={handleSaveState}
          currentTheme={theme}
        />
      )}

      {/* Save State View / Restore Modal */}
      {domainForSaveStateView && (
        <SaveStateViewModal
          isOpen={isSaveStateViewOpen}
          onClose={() => {
            setIsSaveStateViewOpen(false);
            setDomainForSaveStateView(null);
          }}
          domain={domainForSaveStateView}
          onWakeUpDomain={handleWakeUpDomain}
          onEditSaveState={(dom) => {
            setIsSaveStateViewOpen(false);
            setDomainForSaveState(dom);
            setIsSaveStateModalOpen(true);
          }}
          currentTheme={theme}
        />
      )}

      {/* "What Now?" Engine Modal */}
      <WhatNowModal
        isOpen={isWhatNowOpen}
        onClose={() => setIsWhatNowOpen(false)}
        domains={domains}
        quests={quests}
        onStartQuestTimer={(q) => setActiveTimerQuest(q)}
        onQuickCompleteQuest={handleToggleCompleteQuest}
        onOpenNewQuest={() => {
          setQuestToEdit(null);
          setIsQuestModalOpen(true);
        }}
        currentTheme={theme}
      />

      {/* Quest Timer Modal */}
      {activeTimerQuest && (
        <QuestTimerModal
          isOpen={!!activeTimerQuest}
          onClose={() => setActiveTimerQuest(null)}
          quest={activeTimerQuest}
          domain={domains.find((d) => d.id === activeTimerQuest.domainId)}
          onFinishQuest={handleFinishTimerQuest}
          currentTheme={theme}
        />
      )}

      {/* Quest Modal */}
      <QuestModal
        isOpen={isQuestModalOpen}
        onClose={() => setIsQuestModalOpen(false)}
        domains={domains}
        skills={skills}
        onSaveQuest={handleSaveQuest}
        questToEdit={questToEdit}
        defaultDomainId={defaultDomainIdForQuest}
        currentTheme={theme}
      />

      {/* Skill Node Modal */}
      {domains.length > 0 && (
        <SkillNodeModal
          isOpen={isSkillModalOpen}
          onClose={() => setIsSkillModalOpen(false)}
          domain={domains.find((d) => d.id === (selectedDomainIdForSkills || domains[0]?.id)) || domains[0]}
          existingSkills={skills}
          onSaveSkill={handleSaveSkill}
          skillToEdit={skillToEdit}
          defaultParentId={skillParentId}
          currentTheme={theme}
        />
      )}

      {/* Direct Skill Practice Modal */}
      {activePracticeSkill && (
        <PracticeSkillModal
          isOpen={!!activePracticeSkill}
          onClose={() => setActivePracticeSkill(null)}
          skill={activePracticeSkill.skill}
          domain={activePracticeSkill.domain}
          onLogPractice={handleLogSkillPractice}
          currentTheme={theme}
        />
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        domains={domains}
        allNotes={notes}
        onSaveNote={handleSaveNote}
        noteToEdit={noteToEdit}
        currentTheme={theme}
      />

      {/* Manual Effort Log Modal */}
      <EffortLogModal
        isOpen={isEffortLogModalOpen}
        onClose={() => setIsEffortLogModalOpen(false)}
        domains={domains}
        skills={skills}
        defaultDomainId={defaultDomainIdForEffort}
        onSaveEffort={handleSaveManualEffort}
        currentTheme={theme}
      />

      {/* Backup & Cloud Sync Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={handleDataRestored}
        currentTheme={theme}
      />

    </div>
  );
};

export default App;
