import { useState, useMemo, useEffect, useDeferredValue } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { raidDarkTheme } from './styles/muiTheme';
import './styles/global.css';
import rawChampions from './data/champions.json';
import type {
  ChampionData,
  ClanBossDifficulty,
  ClanBossAffinity,
  TeamMemberConfig,
  ArtifactSetChoice,
} from './types';
import {
  calculateTrueSpeed,
  calculateEffectiveDefense,
  calculateDamageMitigation,
  calculateShieldMultiplier,
  runClanBossSimulation,
  BOSS_SPEED_BY_DIFFICULTY,
} from './core/calculator/engine';
import { ChampionCard } from './components/champion/ChampionCard';
import { TimelineView } from './components/timeline/TimelineView';
import { SidebarNavigation, type NavView } from './components/navigation/SidebarNavigation';
import { ConfirmResetDialog } from './components/dialogs/ConfirmResetDialog';
import { PresetConfirmDialog } from './components/dialogs/PresetConfirmDialog';
import { HelpGuideDialog } from './components/dialogs/HelpGuideDialog';
import { ArtifactsExplorerView } from './components/views/ArtifactsExplorerView';
import { ChampionCompendiumView } from './components/views/ChampionCompendiumView';
import { SettingsView } from './components/views/SettingsView';
import { detectChampionAura } from './core/calculator/auraUtils';
import { parseChampionSkills } from './core/calculator/skillUtils';

const allChampions = rawChampions as unknown as ChampionData[];

const DEFAULT_SLOT_COLORS = [
  { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' }, // Slot 0: Blue
  { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' }, // Slot 1: Purple
  { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }, // Slot 2: Green
  { color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' }, // Slot 3: Yellow
  { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' }, // Slot 4: Orange
];

const INITIAL_TEAM: TeamMemberConfig[] = DEFAULT_SLOT_COLORS.map((cfg, idx) => ({
  id: `slot-${idx}`,
  slotIndex: idx,
  color: cfg.color,
  colorAccent: cfg.bg,
  championName: '',
  championData: null,
  isLeader: idx === 0,
  baseSpeed: 100,
  totalSpeed: 190 + idx * 5,
  baseDefense: 1000,
  totalDefense: 2500,
  baseHP: 18000,
  totalHP: 45000,
  baseAttack: 1000,
  totalAttack: 2500,
  baseCritRate: 15,
  totalCritRate: 100,
  baseCritDamage: 50,
  totalCritDamage: 200,
  primaryStat: (idx === 4 ? 'DEF_HP' : idx === 3 ? 'DEF' : 'ATK') as import('./types').DamageStatScaling,
  auraType: idx === 0 ? 'spd' : 'none',
  auraPercent: idx === 0 ? 19 : 0,
  hasNativeAura: idx === 0,
  nativeAuraDesc: idx === 0 ? 'Aura de Velocidad +19%' : undefined,
  customAuraPercent: idx === 0 ? 19 : 0,
  customDefAuraPercent: 0,
  overrideAura: false,
  hasLoreOfSteel: false,
  equippedSets: [],
  set1: 'none' as ArtifactSetChoice,
  set2: 'none' as ArtifactSetChoice,
  set3: 'none' as ArtifactSetChoice,
  trueSpeed: 190 + idx * 5,
  effectiveDefense: 2500,
  damageMitigation: 67.57,
  shieldMultiplier: 3.08,
  skillConfigs: [
    { id: 'A1', alias: 'A1', name: 'Habilidad Básica', priority: 1, cooldown: 0, delay: 0, isPassive: false, disabled: false, isOpener: false },
    { id: 'A2', alias: 'A2', name: 'Habilidad Especial 1', priority: 2, cooldown: 3, delay: 0, isPassive: false, disabled: false, isOpener: false },
    { id: 'A3', alias: 'A3', name: 'Habilidad Especial 2', priority: 3, cooldown: 4, delay: 0, isPassive: false, disabled: false, isOpener: false },
  ],
}));

export function App() {
  const [currentView, setCurrentView] = useState<NavView>('calculator');
  const [difficulty, setDifficulty] = useState<ClanBossDifficulty>('Brutal');
  const [affinity, setAffinity] = useState<ClanBossAffinity>('Void');
  const [maxBossTurns, setMaxBossTurns] = useState<number>(50);

  // Dialogs state (100% Spanish)
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [presetToConfirm, setPresetToConfirm] = useState<string | null>(null);

  const [teamMembers, setTeamMembers] = useState<TeamMemberConfig[]>(() => {
    try {
      const saved = localStorage.getItem('calculat_cb_team');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback to initial
    }
    return INITIAL_TEAM;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('calculat_cb_team', JSON.stringify(teamMembers));
    } catch {
      // ignore
    }
  }, [teamMembers]);

  // Handle setting a member as leader
  const handleSetAsLeader = (selectedSlot: number) => {
    setTeamMembers((prev) =>
      prev.map((m) => {
        const isNowLeader = m.slotIndex === selectedSlot;
        if (isNowLeader && m.championData) {
          const detected = detectChampionAura(m.championData);
          return {
            ...m,
            isLeader: true,
            hasNativeAura: detected.hasAura,
            auraType: detected.type,
            auraPercent: detected.percent,
            nativeAuraDesc: detected.description,
            customAuraPercent: detected.type === 'spd' ? detected.percent : 0,
            customDefAuraPercent: detected.type === 'def' ? detected.percent : 0,
          };
        }
        return {
          ...m,
          isLeader: isNowLeader,
        };
      })
    );
  };

  // Update a specific team member
  const handleUpdateMember = (updated: TeamMemberConfig) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.slotIndex === updated.slotIndex ? updated : m))
    );
  };

  // Assign champion to slot from Compendium
  const handleEquipChampionInSlot = (champ: ChampionData, slotIdx: number) => {
    const baseSpd = champ.stats.spd || 100;
    const baseDef = champ.stats.def || 1000;
    const baseHp = champ.stats.hp || 18000;
    const baseAtk = champ.stats.atk || 1000;
    const baseCrate = champ.stats.crate || 15;
    const baseCdmg = champ.stats.cmdg || 50;
    const isTitus = champ.name.toLowerCase().includes('titus') || (champ.spanishName || '').toLowerCase().includes('titus');
    const newSkills = parseChampionSkills(champ);
    const hasDefSkill = newSkills.some((s) => s.damageStat === 'DEF' || s.damageStat === 'DEF_HP');
    const hasHpSkill = newSkills.some((s) => s.damageStat === 'HP' || s.damageStat === 'DEF_HP');
    let primaryStat: import('./types').DamageStatScaling = 'ATK';
    if (isTitus || (hasDefSkill && hasHpSkill)) {
      primaryStat = 'DEF_HP';
    } else if (hasDefSkill || champ.class.role === 'Defense') {
      primaryStat = 'DEF';
    } else if (hasHpSkill || champ.class.role === 'Health') {
      primaryStat = 'HP';
    }
    const detected = detectChampionAura(champ);

    setTeamMembers((prev) =>
      prev.map((m) => {
        if (m.slotIndex !== slotIdx) return m;
        return {
          ...m,
          championName: champ.name,
          championData: champ,
          baseSpeed: baseSpd,
          totalSpeed: Math.max(m.totalSpeed, baseSpd),
          baseDefense: baseDef,
          totalDefense: Math.max(m.totalDefense, baseDef),
          baseHP: baseHp,
          totalHP: m.totalHP && m.totalHP > baseHp ? m.totalHP : Math.round(baseHp * 2.3),
          baseAttack: baseAtk,
          totalAttack: m.totalAttack && m.totalAttack > baseAtk ? m.totalAttack : Math.round(baseAtk * 2.5),
          baseCritRate: baseCrate,
          totalCritRate: m.totalCritRate ? m.totalCritRate : 100,
          baseCritDamage: baseCdmg,
          totalCritDamage: m.totalCritDamage && m.totalCritDamage > baseCdmg ? m.totalCritDamage : 200,
          primaryStat,
          hasNativeAura: detected.hasAura,
          nativeAuraDesc: detected.description,
          auraType: m.isLeader ? detected.type : m.auraType,
          auraPercent: m.isLeader ? detected.percent : m.auraPercent,
          customAuraPercent: m.isLeader && detected.type === 'spd' ? detected.percent : m.customAuraPercent,
          customDefAuraPercent: m.isLeader && detected.type === 'def' ? detected.percent : m.customDefAuraPercent,
          skillConfigs: newSkills,
        };
      })
    );

    // Switch to calculator view so user sees their updated team
    setCurrentView('calculator');
  };

  // Compute active team leader aura
  const activeLeader = teamMembers.find((m) => m.isLeader) || teamMembers[0];
  const leaderAuraType = activeLeader?.auraType || 'none';
  const leaderAuraPercent = activeLeader?.auraPercent || 0;

  // Compute live True Speed and Effective Stats for each champion reactively
  const teamWithLiveSpeeds = useMemo(() => {
    return teamMembers.map((m) => {
      const auraTypeToUse = m.overrideAura ? m.auraType : leaderAuraType;
      const auraPercentToUse = m.overrideAura ? m.auraPercent : leaderAuraPercent;

      const spdAuraVal = auraTypeToUse === 'spd' ? auraPercentToUse : 0;
      const defAuraVal = auraTypeToUse === 'def' ? auraPercentToUse : 0;
      const atkAuraVal = auraTypeToUse === 'atk' ? auraPercentToUse : 0;
      const hpAuraVal = auraTypeToUse === 'hp' ? auraPercentToUse : 0;
      const crateAuraVal = auraTypeToUse === 'crate' ? auraPercentToUse : 0;

      const sets = [m.set1, m.set2, m.set3];
      const trueSpd = calculateTrueSpeed(
        m.baseSpeed,
        m.totalSpeed,
        sets,
        m.hasLoreOfSteel,
        spdAuraVal,
        0,
        0,
        m.equippedSets
      );
      const effDef = calculateEffectiveDefense(
        m.baseDefense,
        m.totalDefense,
        defAuraVal
      );
      const effAtk = Math.round((m.totalAttack ?? 2000) + (atkAuraVal / 100) * (m.baseAttack || 1000));
      const effHP = Math.round((m.totalHP ?? 40000) + (hpAuraVal / 100) * (m.baseHP || 18000));
      const effCrate = Math.min(100, (m.totalCritRate ?? 100) + crateAuraVal);
      const effCdmg = m.totalCritDamage ?? 0;
      const mitigation = calculateDamageMitigation(effDef);
      const shieldMult = calculateShieldMultiplier(effDef);

      return {
        ...m,
        trueSpeed: trueSpd,
        effectiveDefense: effDef,
        effectiveAttack: effAtk,
        effectiveHP: effHP,
        effectiveCritRate: effCrate,
        effectiveCritDamage: effCdmg,
        damageMitigation: mitigation,
        shieldMultiplier: shieldMult,
      };
    });
  }, [teamMembers, leaderAuraType, leaderAuraPercent]);

  // Run deterministic simulation reactively with configurable max turns
  const simulationResult = useMemo(() => {
    return runClanBossSimulation(teamWithLiveSpeeds, difficulty, affinity, maxBossTurns);
  }, [teamWithLiveSpeeds, difficulty, affinity, maxBossTurns]);

  // Use deferred value to guarantee typing in inputs is 100% fluid and non-blocking
  const deferredSimulation = useDeferredValue(simulationResult);

  // Presets loader
  const handleConfirmApplyPreset = (presetName: string) => {
    if (presetName === 'wixwell-titus' || presetName === 'wixwell-infinity') {
      // Configuración legendaria de Wixwell + Titus Plumanegra (Escudo Infinito 900M+)
      const champNames = [
        'Lady Mikage',
        'Lydia the Deathsiren',
        'Anchorite',
        'Vault Keeper Wixwell',
        'Titus Plumanegra',
      ];
      const speeds = [248, 245, 242, 238, 215];
      setDifficulty('Brutal');
      setMaxBossTurns(50); // 50 rondas canónicas del Boss
      setTeamMembers((prev) =>
        prev.map((m, idx) => {
          const targetName = champNames[idx];
          const found = allChampions.find(
            (c) =>
              c.name.toLowerCase() === targetName.toLowerCase() ||
              (c.spanishName && c.spanishName.toLowerCase().includes(targetName.toLowerCase())) ||
              (c.englishName && c.englishName.toLowerCase().includes(targetName.toLowerCase()))
          );
          const baseSpd = found?.stats.spd || 100;
          const baseDef = found?.stats.def || 1400;
          const skills = parseChampionSkills(found || null);
          const tunedSkills = skills.map((sk) => {
            if (sk.id === 'A3') return { ...sk, isOpener: true, priority: 2 };
            if (sk.id === 'A2') return { ...sk, isOpener: false, priority: 3 };
            if (sk.id === 'A1') return { ...sk, priority: 1 };
            return sk;
          });
          const baseHp = found?.stats.hp || (idx === 0 ? 21645 : idx === 3 ? 18500 : idx === 4 ? 18495 : 19155);
          const baseAtk = found?.stats.atk || (idx === 0 ? 1200 : idx === 3 ? 850 : idx === 4 ? 837 : 1046);
          const baseCrate = found?.stats.crate || 15;
          const baseCdmg = found?.stats.cmdg || (idx === 3 || idx === 4 ? 63 : 50);
          const primaryStat = (idx === 4 ? 'DEF_HP' : idx === 3 ? 'DEF' : 'ATK') as import('./types').DamageStatScaling;

          const totalHp = idx === 3 ? 52000 : idx === 4 ? 48000 : idx === 0 ? 44000 : idx === 1 ? 48000 : 50000;
          const totalAtk = idx === 0 ? 4200 : idx === 1 ? 3100 : idx === 2 ? 2200 : idx === 3 ? 1600 : 1800;
          const totalCrate = idx === 3 ? 85 : idx === 2 ? 75 : 100;
          const totalCdmg = idx === 4 ? 240 : idx === 0 ? 220 : idx === 1 ? 200 : idx === 3 ? 180 : 150;

          return {
            ...m,
            championName: found?.spanishName || targetName,
            championData: found || null,
            baseSpeed: baseSpd,
            totalSpeed: speeds[idx],
            baseDefense: baseDef,
            totalDefense: idx === 3 ? 4600 : idx === 4 ? 3800 : 3200,
            baseHP: baseHp,
            totalHP: totalHp,
            baseAttack: baseAtk,
            totalAttack: totalAtk,
            baseCritRate: baseCrate,
            totalCritRate: totalCrate,
            baseCritDamage: baseCdmg,
            totalCritDamage: totalCdmg,
            primaryStat,
            isLeader: idx === 3, // Wixwell Líder
            auraType: idx === 3 ? 'def' : 'none', // Aura de Defensa como en la captura
            auraPercent: idx === 3 ? 30 : 0,
            hasNativeAura: idx === 3,
            nativeAuraDesc: idx === 3 ? 'Aumenta DEF de Aliados en Todas las Batallas un 30%' : undefined,
            customAuraPercent: 0,
            customDefAuraPercent: idx === 3 ? 30 : 0,
            overrideAura: false,
            equippedSets: [],
            set1: 'none',
            set2: 'none',
            set3: 'none',
            skillConfigs: tunedSkills,
          };
        })
      );
    } else if (presetName === 'myth-heir') {
      const champNames = ['Demytha', 'Heiress', 'Seeker', 'Deacon Armstrong', 'Ninja'];
      const speeds = [274, 245, 180, 185, 156];
      setTeamMembers((prev) =>
        prev.map((m, idx) => {
          const found = allChampions.find(
            (c) => c.name.toLowerCase() === champNames[idx].toLowerCase()
          );
          const baseSpd = found?.stats.spd || 100;
          const baseDef = found?.stats.def || 1000;
          return {
            ...m,
            championName: champNames[idx],
            championData: found || null,
            baseSpeed: baseSpd,
            totalSpeed: speeds[idx],
            baseDefense: baseDef,
            totalDefense: 2800,
            isLeader: idx === 3, // Deacon Armstrong 19% Speed aura lead
            auraType: idx === 3 ? 'spd' : 'none',
            auraPercent: idx === 3 ? 19 : 0,
            hasNativeAura: idx === 3,
            nativeAuraDesc: idx === 3 ? 'Increases Ally Speed in All Battles by 19%' : undefined,
            customAuraPercent: idx === 3 ? 19 : 0,
            customDefAuraPercent: 0,
            overrideAura: false,
            equippedSets: [],
            set1: 'none',
            set2: 'none',
            set3: 'none',
            skillConfigs: parseChampionSkills(found || null),
          };
        })
      );
    } else if (presetName === 'bateater') {
      const champNames = ['Maneater', 'Maneater', 'Seeker', 'Pain Keeper', 'Dracomorph'];
      const speeds = [265, 239, 248, 246, 220];
      setTeamMembers((prev) =>
        prev.map((m, idx) => {
          const found = allChampions.find(
            (c) => c.name.toLowerCase() === champNames[idx].toLowerCase()
          );
          const baseSpd = found?.stats.spd || 100;
          const baseDef = found?.stats.def || 1000;
          return {
            ...m,
            championName: champNames[idx],
            championData: found || null,
            baseSpeed: baseSpd,
            totalSpeed: speeds[idx],
            baseDefense: baseDef,
            totalDefense: 2600,
            isLeader: idx === 0,
            auraType: 'none',
            auraPercent: 0,
            hasNativeAura: false,
            customAuraPercent: 0,
            customDefAuraPercent: 0,
            overrideAura: false,
            equippedSets: [],
            set1: 'none',
            set2: 'none',
            set3: 'none',
            skillConfigs: parseChampionSkills(found || null),
          };
        })
      );
    }
    setCurrentView('calculator');
  };

  const bossSpeed = BOSS_SPEED_BY_DIFFICULTY[difficulty];

  return (
    <ThemeProvider theme={raidDarkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#070b14', color: '#f8fafc' }}>
        {/* Material Design Navigation Drawer on the Left */}
        <SidebarNavigation
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenHelpDialog={() => setIsHelpOpen(true)}
          onOpenResetDialog={() => setIsResetOpen(true)}
          bossDifficulty={difficulty}
        />

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
          {/* Top Navbar Header */}
          <header className="app-header">
            <div className="brand-section">
              <div>
                <h1 className="brand-logo">⚔️ CALCULAT-BOSS-CLAN</h1>
                <span className="brand-subtitle">Simulador Táctico de Clan Boss (50 Rondas Deterministas)</span>
              </div>
            </div>

            {/* Boss Controls Header */}
            <div className="boss-controls">
              <div className="control-group">
                <span className="control-label">Dificultad:</span>
                <select
                  className="select-input"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as ClanBossDifficulty)}
                >
                  <option value="Ultra-Nightmare">Ultra-Pesadilla (UNM)</option>
                  <option value="Nightmare">Pesadilla (NM)</option>
                  <option value="Brutal">Brutal</option>
                  <option value="Hard">Difícil (Hard)</option>
                  <option value="Normal">Normal</option>
                  <option value="Easy">Fácil (Easy)</option>
                </select>
              </div>

              <div className="control-group">
                <span className="control-label">Afinidad:</span>
                <select
                  className="select-input"
                  value={affinity}
                  onChange={(e) => setAffinity(e.target.value as ClanBossAffinity)}
                >
                  <option value="Void">Vacío (Void)</option>
                  <option value="Spirit">Espíritu (Spirit)</option>
                  <option value="Force">Fuerza (Force)</option>
                  <option value="Magic">Magia (Magic)</option>
                </select>
              </div>

              <div className="control-group">
                <span className="control-label">Rondas:</span>
                <select
                  className="select-input"
                  value={maxBossTurns}
                  onChange={(e) => setMaxBossTurns(Number(e.target.value))}
                >
                  <option value={50}>50 Rondas (Estándar Canónico)</option>
                  <option value={100}>100 Rondas</option>
                  <option value={150}>150 Rondas (Máx)</option>
                </select>
              </div>

              <div className="boss-speed-badge">
                <span>⚡ SPD Boss:</span>
                <span>{bossSpeed.toFixed(2)}</span>
              </div>

              {/* Preset Compositions Button */}
              <div className="control-group">
                <select
                  className="select-input"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'reset') {
                      setIsResetOpen(true);
                    } else if (val) {
                      setPresetToConfirm(val);
                    }
                    e.target.value = '';
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Cargar Sintonía Rápida...
                  </option>
                  <option value="wixwell-titus">🛡️ Wixwell + Titus Infinito (900M+ Brutal)</option>
                  <option value="myth-heir">Myth-Heir (Demytha 3:1)</option>
                  <option value="bateater">BatEater (2x Maneater 2:1)</option>
                  <option value="reset">↺ Restablecer Escuadrón</option>
                </select>
              </div>
            </div>
          </header>

          {/* Dynamic Views Rendering based on Navigation */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {currentView === 'calculator' && (
              <main className="workspace-grid">
                {/* Left Panel: 5 Champions Config */}
                <section className="left-panel">
                  <div className="panel-header">
                    <h2 className="panel-title">
                      <span>🛡️</span> Escuadrón (5 Campeones)
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Catálogo: {allChampions.length} campeones disponibles
                    </span>
                  </div>

                  {teamWithLiveSpeeds.map((member) => (
                    <ChampionCard
                      key={member.id}
                      member={member}
                      allChampions={allChampions}
                      onUpdate={handleUpdateMember}
                      onSetAsLeader={handleSetAsLeader}
                      leaderAuraType={leaderAuraType}
                      leaderAuraPercent={leaderAuraPercent}
                      bossSpeed={bossSpeed}
                      bossDifficulty={difficulty}
                      bossAffinity={affinity}
                    />
                  ))}
                </section>

                {/* Right Panel: Combat Timeline Matrix */}
                <section>
                  <TimelineView simulation={deferredSimulation} />
                </section>
              </main>
            )}

            {currentView === 'timeline' && (
              <Box sx={{ p: 2 }}>
                <TimelineView simulation={deferredSimulation} />
              </Box>
            )}

            {currentView === 'artifacts' && (
              <ArtifactsExplorerView />
            )}

            {currentView === 'champions' && (
              <ChampionCompendiumView
                allChampions={allChampions}
                onEquipInSlot={handleEquipChampionInSlot}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                affinity={affinity}
                onAffinityChange={setAffinity}
                onOpenPresetDialog={(key) => setPresetToConfirm(key)}
                onOpenResetDialog={() => setIsResetOpen(true)}
              />
            )}
          </Box>
        </Box>

        {/* Material Design Dialogs in Spanish */}
        <ConfirmResetDialog
          open={isResetOpen}
          onClose={() => setIsResetOpen(false)}
          onConfirm={() => setTeamMembers(INITIAL_TEAM)}
        />

        <PresetConfirmDialog
          open={Boolean(presetToConfirm)}
          presetKey={presetToConfirm}
          onClose={() => setPresetToConfirm(null)}
          onConfirm={handleConfirmApplyPreset}
        />

        <HelpGuideDialog
          open={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
