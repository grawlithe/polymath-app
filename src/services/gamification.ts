import confetti from 'canvas-confetti';

// Audio Synthesizer via Web Audio API
class AudioFX {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playQuestComplete() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Audio errors silenced gracefully
    }
  }

  playLevelUp() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Ignore
    }
  }

  playSaveState() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }
}

export const audioFX = new AudioFX();

export const gamification = {
  calculateLevel(totalXp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
    // XP progression curve: Level 1 = 0, Level 2 = 100, Level 3 = 250, Level 4 = 450, etc.
    let level = 1;
    let requiredForNext = 100;
    let accumulatedXp = 0;

    while (totalXp >= accumulatedXp + requiredForNext) {
      accumulatedXp += requiredForNext;
      level++;
      requiredForNext = Math.round(100 * Math.pow(level, 1.4));
    }

    const currentLevelXp = totalXp - accumulatedXp;
    const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / requiredForNext) * 100)));

    return {
      level,
      currentLevelXp,
      nextLevelXp: requiredForNext,
      progressPercent
    };
  },

  calculateSkillLevel(xp: number): { level: number; currentXp: number; maxLevelXp: number; progressPercent: number } {
    let level = 1;
    let needed = 50;
    let acc = 0;

    while (xp >= acc + needed) {
      acc += needed;
      level++;
      needed = Math.round(50 * Math.pow(level, 1.3));
    }

    const currentXp = xp - acc;
    const progressPercent = Math.min(100, Math.max(0, Math.round((currentXp / needed) * 100)));

    return {
      level,
      currentXp,
      maxLevelXp: needed,
      progressPercent
    };
  },

  triggerCelebration() {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
    });
  },

  triggerLevelUpCelebration() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981']
    });
    audioFX.playLevelUp();
  }
};
