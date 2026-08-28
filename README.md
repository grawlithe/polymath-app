# 🌟 Polymath OS — Personal Mastery App for Multi-Passionate Minds

A purpose-built productivity and mastery system designed specifically for polymaths, multi-passionate creators, and autodidacts. Built with React, TypeScript, Tailwind CSS, and Capacitor for seamless **Android mobile export** and instant offline web use.

---

## ⚡ Core Philosophy & Pillars

Standard productivity apps punish polymaths with overdue badges and guilt whenever life or work causes interests to rotate. **Polymath OS** is designed around 4 rotational pillars:

### 1. 💤 The "Save State" Rotator (Anti-Guilt System)
- **Active Sprints vs. Dormant Shelf**: Domains are either in focus or safely paused. Zero overdue badges, zero anxiety.
- **Save State Snapshot**: When putting an interest to sleep (e.g. GameMaker or Guitar), capture a rich snapshot:
  - *Context Dump*: Exactly where you left off.
  - *Workspace Reference*: Project file, tutorial link, or book chapter.
  - *Single Next Action*: One friction-free step to resume (takes < 30s to load back in).

### 2. ⚡ The Energy-Matched "What Now?" Engine
- Eliminate decision fatigue when tired or short on time.
- Input your current battery (**⚡ Low**, **⚡⚡ Medium**, **⚡⚡⚡ High**) and available time (**15m, 30m, 45m, 1h, 2h**).
- The engine instantly rolls a curated micro-quest from your active domains and launches a built-in focus timer.

### 3. 🌳 Visual Skill Trees & Atomic Progress
- **Skill Tree Hierarchy**: Break infinite domains into clear technique nodes (e.g. *Music &rarr; Guitar &rarr; Alternate Picking, CAGED System*).
- **Direct Practice & XP**: Log atomic practice sessions into specific nodes, level them up, and earn XP with level-up fanfares and confetti celebrations.

### 4. 🕸️ The Knowledge Mesh (Cross-Pollination)
- Supercharge the polymath advantage of connecting disparate disciplines.
- Markdown notes with real-time `[[wiki-links]]` auto-discovery.
- **2D Interactive Force-Directed Canvas Graph**: Drag, explore, and visualize links between programming, music, writing, and science.

### 5. 📊 Atomic Activity Ledger & 140-Day Heatmap
- GitHub-style contribution matrix tracking consistency and total hours invested across all domains.

---

## 🎨 Multi-Theme Visual Switcher
Switch anytime via the palette icon in the top navigation bar:
- **Cyber Arcade**: High-energy synthwave with glowing cyan & neon accents.
- **Obsidian Zen**: Matte charcoal & emerald focus.
- **Midnight Nebula**: Cosmic violet deep space aesthetic.
- **Matrix Core**: Phosphor terminal emerald.
- **Polymath Studio Light**: Crisp daylight high-contrast focus mode.

---

## 🚀 Getting Started

### 1. Run Web App Locally
```bash
# In Polymath App directory:
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build Production Bundle
```bash
npm run build
```

---

## 📱 Exporting to Android App (Capacitor)

Polymath OS is fully configured with Capacitor to generate native Android APKs.

### Prerequisites:
- **Android Studio** installed with Android SDK
- **Java JDK 17+**

### Steps to Build Android APK:

1. **Build web assets & sync to Android project:**
   ```bash
   npm run cap:sync
   ```

2. **Open the project in Android Studio:**
   ```bash
   npm run cap:open
   # or: npx cap open android
   ```

3. **Generate the APK:**
   - In Android Studio, go to: **Build &rarr; Build Bundle(s) / APK(s) &rarr; Build APK(s)**
   - The compiled APK will be located at:
     `android/app/build/outputs/apk/debug/app-debug.apk`
   - Sideload onto your Android phone and install!

---

## 💾 Data Persistence & Backup
- **Offline-First**: All data is automatically saved locally using browser / WebView storage.
- **JSON Backup / Restore**: Export complete portable backups or restore anytime via the Database icon.
- **Optional Supabase Cloud Sync**: Configure your Supabase project URL and Anon Key in the backup modal to sync data across all your devices.
