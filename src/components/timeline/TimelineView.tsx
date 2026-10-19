import React, { useState, useMemo } from 'react';
import type { SimulationResult, SimulationTurnLog } from '../../types';
import { ChampionAvatar } from '../champion/ChampionAvatar';
import { RaidBuffIcon } from '../common/RaidBuffIcon';

interface TimelineViewProps {
  simulation: SimulationResult;
}

export interface DeadwoodJediStep {
  bossTurnNumber: number; // 0, 1, 2, 3...
  phase: 'AOE1' | 'AOE2' | 'STUN';
  championActions: SimulationTurnLog[];
  bossAction: SimulationTurnLog | null;
}

export interface DeadwoodJediCycle {
  cycleIndex: number; // 0, 1, 2...
  aoe1: DeadwoodJediStep;
  aoe2: DeadwoodJediStep;
  stun: DeadwoodJediStep;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ simulation }) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');
  const [selectedChampFilter, setSelectedChampFilter] = useState<string>('all');
  const [inspectedStep, setInspectedStep] = useState<DeadwoodJediStep | null>(null);

  // Extract unique champion names in simulation
  const uniqueChampionNames = useMemo(() => {
    const set = new Set<string>();
    simulation.turns.forEach((t) => {
      if (!t.isBoss && t.actorName) set.add(t.actorName);
    });
    return Array.from(set);
  }, [simulation.turns]);

  // Group simulation turns into 3-column cycles (DeadwoodJedi canonical format: AOE1 | AOE2 | STUN)
  const groupedCycles = useMemo(() => {
    const steps: DeadwoodJediStep[] = [];
    let currentChamps: SimulationTurnLog[] = [];
    let bossTurnCount = 0;

    for (const turn of simulation.turns) {
      if (turn.isBoss) {
        bossTurnCount++;
        if (bossTurnCount > 50) break; // Límite estricto canónico: Rondas 1 al 50

        const turnNum = bossTurnCount;
        const mod3 = turnNum % 3;
        const phase: 'AOE1' | 'AOE2' | 'STUN' =
          mod3 === 1 ? 'AOE1' : mod3 === 2 ? 'AOE2' : 'STUN';

        steps.push({
          bossTurnNumber: turnNum,
          phase,
          championActions: currentChamps,
          bossAction: turn,
        });

        currentChamps = [];
      } else {
        if (bossTurnCount < 50) {
          currentChamps.push(turn);
        }
      }
    }

    // Group steps into 3-column cycles (AOE1, AOE2, STUN)
    const cycles: DeadwoodJediCycle[] = [];
    for (let i = 0; i < steps.length; i += 3) {
      const cycleIdx = Math.floor(i / 3);
      cycles.push({
        cycleIndex: cycleIdx,
        aoe1: steps[i] || {
          bossTurnNumber: cycleIdx * 3 + 1,
          phase: 'AOE1',
          championActions: [],
          bossAction: null,
        },
        aoe2: steps[i + 1] || {
          bossTurnNumber: cycleIdx * 3 + 2,
          phase: 'AOE2',
          championActions: [],
          bossAction: null,
        },
        stun: steps[i + 2] || {
          bossTurnNumber: cycleIdx * 3 + 3,
          phase: 'STUN',
          championActions: [],
          bossAction: null,
        },
      });
    }

    return cycles;
  }, [simulation.turns]);

  // Helper to render native Raid: Shadow Legends active buff icons with turn duration
  const renderEffectsPills = (action: SimulationTurnLog) => {
    if (!action.effectsSnapshot || action.effectsSnapshot.length === 0) return null;

    // Filter relevant effects for this actor
    const relevantEffects = action.effectsSnapshot.filter(
      (e) => e.targetName === action.actorName
    );

    if (relevantEffects.length === 0) return null;

    // Consolidar efectos únicos por nombre de forma rápida y sin memory leak
    const uniqueMap: Record<string, (typeof relevantEffects)[0]> = {};
    for (let i = 0; i < relevantEffects.length; i++) {
      const eff = relevantEffects[i];
      if (!uniqueMap[eff.name] || eff.duration > uniqueMap[eff.name].duration) {
        uniqueMap[eff.name] = eff;
      }
    }
    const consolidatedEffects = Object.values(uniqueMap);

    return (
      <div className="dwj-effects-cluster">
        {consolidatedEffects.map((eff, idx) => (
          <RaidBuffIcon
            key={`${eff.name}-${idx}`}
            name={eff.name}
            type={eff.type}
            duration={eff.name === 'intercept' ? (eff.amount || 2) : eff.duration}
            amount={eff.amount}
            size="sm"
          />
        ))}
      </div>
    );
  };

  // Helper to render native Raid: Shadow Legends active debuffs on Clan Boss
  const renderBossDebuffs = (step: DeadwoodJediStep) => {
    let debuffs = step.bossAction?.bossDebuffs;

    if (!debuffs || debuffs.length === 0) {
      if (step.bossAction?.effectsSnapshot) {
        debuffs = step.bossAction.effectsSnapshot
          .filter((e) => e.targetName === 'Clan Boss' || e.targetName.toLowerCase().includes('boss'))
          .map((e) => ({ name: e.name, type: 'debuff' as const, duration: e.duration, amount: e.amount }));
      } else if (step.championActions.length > 0) {
        const lastChamp = step.championActions[step.championActions.length - 1];
        if (lastChamp.bossDebuffs && lastChamp.bossDebuffs.length > 0) {
          debuffs = lastChamp.bossDebuffs;
        } else if (lastChamp.effectsSnapshot) {
          debuffs = lastChamp.effectsSnapshot
            .filter((e) => e.targetName === 'Clan Boss' || e.targetName.toLowerCase().includes('boss'))
            .map((e) => ({ name: e.name, type: 'debuff' as const, duration: e.duration, amount: e.amount }));
        }
      }
    }

    if (!debuffs || debuffs.length === 0) return null;

    return (
      <div className="dwj-boss-debuffs" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700, marginRight: '2px' }}>
          {debuffs.length}/10
        </span>
        {debuffs.slice(0, 10).map((eff, idx) => (
          <RaidBuffIcon
            key={`boss-${eff.name}-${idx}`}
            name={eff.name}
            type="debuff"
            duration={eff.duration}
            size="xs"
          />
        ))}
      </div>
    );
  };

  // Helper to render a single step cell in DeadwoodJedi 3-column format
  const renderStepCell = (step: DeadwoodJediStep) => {
    if (step.bossTurnNumber > 50) {
      return (
        <div
          className="dwj-step-cell dwj-step-completed"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80px',
            background: 'rgba(15, 23, 42, 0.4)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '12px',
            textAlign: 'center',
            gap: '4px',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🏁</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#facc15' }}>
            Fin de Batalla (Turno 50)
          </span>
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
            Límite canónico completado
          </span>
        </div>
      );
    }

    const isStun = step.phase === 'STUN';
    const isAoe2 = step.phase === 'AOE2';

    const phaseColor = isStun ? '#facc15' : isAoe2 ? '#fb923c' : '#f87171';
    const phaseBg = isStun
      ? 'rgba(250, 204, 21, 0.12)'
      : isAoe2
      ? 'rgba(251, 146, 60, 0.12)'
      : 'rgba(248, 113, 113, 0.12)';

    // Precalcular cuántas veces actúa cada campeón antes de este ataque del Boss
    const totalActionsPerChamp: Record<string, number> = {};
    for (let i = 0; i < step.championActions.length; i++) {
      const a = step.championActions[i];
      totalActionsPerChamp[a.actorName] = (totalActionsPerChamp[a.actorName] || 0) + 1;
    }

    // Estado de sincronización matemática de este paso
    const totalStepActions = step.championActions.length;
    const isStep2to1 = totalStepActions === 10;
    const isStep1to1 = totalStepActions === 5;

    // Rastrear ocurrencias de turnos por campeón en este paso
    const champOccurrences: Record<string, number> = {};

    const stunTarget = step.bossAction?.stunTarget;
    const stunResult = step.bossAction?.stunResult;

    return (
      <div className={`dwj-step-cell ${step.phase.toLowerCase()}`}>
        {/* Champion Actions Stack */}
        <div className="dwj-champs-stack">
          {step.championActions.map((action, aIdx) => {
            const isMatch =
              selectedChampFilter === 'all' ||
              action.actorName.toLowerCase() === selectedChampFilter.toLowerCase();

            // Indicador de Turno Cuadrado en base a Velocidad Real
            const count = (champOccurrences[action.actorName] || 0) + 1;
            champOccurrences[action.actorName] = count;
            const totalForThisChamp = totalActionsPerChamp[action.actorName] || 1;

            let turnLabel = `T${count}/2 [2:1]`;
            let turnBadgeStyle = {
              color: '#4ade80',
              backgroundColor: 'rgba(74, 222, 128, 0.15)',
              border: '1px solid rgba(74, 222, 128, 0.4)',
            };
            let turnTitle = `Turno ${count} de 2 antes del golpe del Boss (Sincronía 2:1 Cuadrada)`;

            if (totalForThisChamp >= 2) {
              turnLabel = `T${count}/2 [2:1]`;
              turnBadgeStyle = {
                color: '#4ade80',
                backgroundColor: 'rgba(74, 222, 128, 0.15)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
              };
              turnTitle = `Turno ${count} de 2 antes del golpe del Boss (Sincronía 2:1 Cuadrada)`;
            } else if (totalStepActions >= 6) {
              // El equipo está intentando ciclo 2:1 pero este campeón sólo metió 1 acción -> DESCUADRADO
              turnLabel = `⚠️ T1/1 (Descuadrado)`;
              turnBadgeStyle = {
                color: '#f87171',
                backgroundColor: 'rgba(239, 68, 68, 0.22)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
              };
              turnTitle = `⚠️ Descuadre en Ticks: este campeón sólo obtuvo 1 turno antes del ataque del Boss en lugar de 2`;
            } else if (totalStepActions === 5) {
              turnLabel = `T1/1 [1:1]`;
              turnBadgeStyle = {
                color: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.15)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
              };
              turnTitle = `Turno único antes del golpe del Boss (Sincronía 1:1 Cuadrada)`;
            } else {
              turnLabel = `T${count}`;
              turnBadgeStyle = {
                color: '#cbd5e1',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              };
              turnTitle = `Turno de acción`;
            }

            const alias = action.skillUsed.alias;
            const skillIcon =
              alias.includes('A1') ? '⚔️' : alias.includes('A2') ? '🛡️' : alias.includes('A3') ? '✨' : alias === 'STUN' ? '⚠️' : '🌟';

            return (
              <div
                key={`act-${action.turnIndex}-${aIdx}`}
                className={`dwj-champ-row ${!isMatch ? 'dimmed' : ''}`}
                style={{
                  borderLeft: `4px solid ${action.color}`,
                  background: action.isStunnedTurnSkipped
                    ? 'rgba(239, 68, 68, 0.18)'
                    : action.color
                    ? `linear-gradient(90deg, ${action.color}3a 0%, ${action.color}1e 100%)`
                    : 'rgba(30, 58, 138, 0.5)',
                  borderColor: action.isStunnedTurnSkipped
                    ? '#ef4444'
                    : action.color
                    ? `${action.color}55`
                    : 'rgba(59, 130, 246, 0.3)',
                }}
              >
                {/* Left: Champion Name only (Avatar removed per user directive) */}
                <div className="dwj-champ-left">
                  <span className="dwj-champ-name" title={action.actorName}>
                    {action.actorName}
                  </span>
                </div>

                {/* Middle: Buffs & Durations (Punto 3) */}
                <div className="dwj-champ-mid">
                  {action.isStunnedTurnSkipped ? (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#f87171',
                        backgroundColor: 'rgba(239, 68, 68, 0.25)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                      }}
                    >
                      ⚠️ Turno Perdido (Aturdido - Cooldowns Congelados)
                    </span>
                  ) : (
                    renderEffectsPills(action)
                  )}
                </div>

                {/* Right: Skill Tag & Turn Indicator */}
                <div className="dwj-champ-right">
                  <span
                    className={`dwj-skill-tag ${action.isOpenerUsed ? 'opener-used' : ''}`}
                    style={{
                      color: action.isStunnedTurnSkipped
                        ? '#f87171'
                        : action.isOpenerUsed
                        ? '#fbbf24'
                        : action.color || '#93c5fd',
                      borderColor: action.isStunnedTurnSkipped
                        ? '#ef4444'
                        : action.isOpenerUsed
                        ? '#f59e0b'
                        : `${action.color || '#3b82f6'}60`,
                      backgroundColor: action.isOpenerUsed
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(0, 0, 0, 0.45)',
                    }}
                    title={`${action.skillUsed.name} (${action.skillUsed.alias})${
                      action.isOpenerUsed ? ' • ★ Habilidad Inicial (Opener)' : ''
                    }`}
                  >
                    <span className="dwj-skill-icon">{action.isOpenerUsed ? '★' : skillIcon}</span>
                    <span>{action.skillUsed.alias}</span>
                    {action.isOpenerUsed && (
                      <span
                        style={{
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          color: '#fef08a',
                          marginLeft: '2px',
                        }}
                      >
                        Ini
                      </span>
                    )}
                  </span>
                  <span
                    className={`dwj-turn-text ${count > 1 ? 'extra-turn' : ''}`}
                    style={turnBadgeStyle}
                    title={turnTitle}
                  >
                    {turnLabel}
                  </span>
                </div>
              </div>
            );
          })}

          {step.championActions.length === 0 && (
            <div className="dwj-empty-actions">
              <span>— Sin turnos de escuadrón antes del Boss —</span>
            </div>
          )}
        </div>

        {/* Clan Boss Action Bar at Bottom of Cell */}
        <div className="dwj-boss-bar">
          <div className="dwj-boss-left">
            <span className="dwj-boss-icon">💀</span>
            <span className="dwj-boss-name">Clanboss</span>
            {renderBossDebuffs(step)}
          </div>

          <div className="dwj-boss-right">
            {/* Badge de Cuadre de este Paso */}
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid',
                backgroundColor: isStep2to1
                  ? 'rgba(74, 222, 128, 0.15)'
                  : isStep1to1
                  ? 'rgba(96, 165, 250, 0.15)'
                  : 'rgba(239, 68, 68, 0.2)',
                borderColor: isStep2to1
                  ? 'rgba(74, 222, 128, 0.4)'
                  : isStep1to1
                  ? 'rgba(96, 165, 250, 0.4)'
                  : 'rgba(239, 68, 68, 0.5)',
                color: isStep2to1
                  ? '#4ade80'
                  : isStep1to1
                  ? '#60a5fa'
                  : '#f87171',
              }}
              title={
                isStep2to1
                  ? 'Sincronía 2:1 Cuadrada (10 acciones de campeones)'
                  : isStep1to1
                  ? 'Sincronía 1:1 Cuadrada (5 acciones de campeones)'
                  : `⚠️ Descuadre de Velocidad: ${totalStepActions} acciones antes de este ataque del Boss`
              }
            >
              {isStep2to1
                ? '🟢 2:1 (10)'
                : isStep1to1
                ? '🔵 1:1 (5)'
                : `⚠️ Descuadre (${totalStepActions})`}
            </span>

            {isStun && stunTarget && (
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid',
                  backgroundColor:
                    stunResult === 'blocked'
                      ? 'rgba(34, 197, 94, 0.15)'
                      : stunResult === 'intercepted'
                      ? 'rgba(168, 85, 247, 0.2)'
                      : 'rgba(239, 68, 68, 0.25)',
                  borderColor:
                    stunResult === 'blocked'
                      ? 'rgba(34, 197, 94, 0.4)'
                      : stunResult === 'intercepted'
                      ? 'rgba(168, 85, 247, 0.5)'
                      : 'rgba(239, 68, 68, 0.6)',
                  color:
                    stunResult === 'blocked'
                      ? '#4ade80'
                      : stunResult === 'intercepted'
                      ? '#c084fc'
                      : '#f87171',
                }}
                title={`Stun dirigido a ${stunTarget} • Resultado: ${stunResult}`}
              >
                {stunResult === 'blocked'
                  ? `🛡️ Bloqueado: ${stunTarget}`
                  : stunResult === 'intercepted'
                  ? `🟣 Interceptado: ${stunTarget}`
                  : `⚠️ Aturdido: ${stunTarget}`}
              </span>
            )}

            <button
              type="button"
              className="dwj-inspect-step-btn"
              onClick={() => setInspectedStep(step)}
              title="Inspeccionar bufos y supervivencia del escuadrón"
            >
              🔬 Bufos
            </button>
            <span
              className="dwj-boss-phase-tag"
              style={{
                color: phaseColor,
                backgroundColor: phaseBg,
                borderColor: `${phaseColor}50`,
              }}
            >
              {step.phase}
            </span>
            <span
              className="dwj-boss-turn-num"
              style={{ color: phaseColor }}
            >
              Turno {step.bossTurnNumber}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dwj-timeline-wrapper">
      {/* Infinite Shield & Team Damage Banner */}
      {simulation.isInfiniteShieldSetup && (
        <div
          style={{
            marginBottom: '4px',
            padding: '12px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.22) 0%, rgba(168, 85, 247, 0.18) 100%)',
            border: '1px solid rgba(234, 179, 8, 0.5)',
            boxShadow: '0 4px 20px rgba(234, 179, 8, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🛡️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fde047', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Configuración de Escudos Infinitos Detectada (Wixwell + Extensores de Bufos)</span>
                <span style={{ fontSize: '0.65rem', backgroundColor: '#eab308', color: '#000', padding: '1px 6px', borderRadius: '4px', fontWeight: 900 }}>
                  META HYDRA / BRUTAL / UNM
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
                Los escudos de Wixwell se extienden y crecen de forma continua. El equipo es inmune a muerte por turnos del Boss y escala el daño de Titus Plumanegra exponencialmente.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {simulation.totalTeamDamage !== undefined && simulation.totalTeamDamage > 0 && (
              <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Daño Proyectado Equipo
                </span>
                <span style={{ fontSize: '1.15rem', color: '#f87171', fontWeight: 900 }}>
                  {(simulation.totalTeamDamage / 1_000_000).toFixed(1)}M
                </span>
              </div>
            )}
            <span style={{ fontSize: '0.78rem', color: '#a78bfa', fontWeight: 700, background: 'rgba(168, 85, 247, 0.15)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              ⚡ 50 Rondas Canónicas Garantizadas
            </span>
          </div>
        </div>
      )}

      {/* PANEL DE RENDIMIENTO: ESTIMADO DE TURNOS Y DAÑO POR CAMPEÓN (RONDAS 1 AL 50) */}
      <div className="dwj-performance-dashboard">
        <div className="dwj-perf-header">
          <div className="dwj-perf-title-area">
            <h3 className="dwj-perf-title">
              <span>📊</span> Resumen de Rendimiento (Turnos 1 al 50 del Clan Boss)
            </h3>
            <p className="dwj-perf-sub">
              Cálculo y desglose canónico de turnos estimados y daño acumulado para {simulation.bossDifficulty || 'Clan Boss'} ({simulation.bossSpeed} SPD).
            </p>
          </div>

          <div className="dwj-perf-kpis">
            {simulation.totalTeamDamage !== undefined && simulation.totalTeamDamage > 0 && (
              <div className="dwj-perf-kpi-pill">
                <span className="dwj-perf-kpi-label">Daño Total Proyectado</span>
                <span className="dwj-perf-kpi-val" style={{ color: '#f87171' }}>
                  {(simulation.totalTeamDamage / 1_000_000).toFixed(1)}M
                </span>
              </div>
            )}

            <div className="dwj-perf-kpi-pill">
              <span className="dwj-perf-kpi-label">Turnos Totales de Escuadrón</span>
              <span className="dwj-perf-kpi-val" style={{ color: '#38bdf8' }}>
                {simulation.championSyncMetrics
                  ? simulation.championSyncMetrics.reduce((acc, m) => acc + m.turnsTaken, 0)
                  : simulation.turns.filter((t) => !t.isBoss).length}{' '}
                Turnos
              </span>
            </div>

            <div className="dwj-perf-kpi-pill">
              <span className="dwj-perf-kpi-label">Rondas de Clan Boss</span>
              <span className="dwj-perf-kpi-val" style={{ color: '#facc15' }}>
                {Math.min(simulation.totalBossTurns, 50)} / 50
              </span>
            </div>

            {(() => {
              const allSynced =
                simulation.championSyncMetrics && simulation.championSyncMetrics.length > 0
                  ? simulation.championSyncMetrics.every((m) => m.isSynced)
                  : false;
              return (
                <div
                  className="dwj-perf-kpi-pill"
                  style={{
                    borderColor: allSynced ? 'rgba(74, 222, 128, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                    background: allSynced ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <span className="dwj-perf-kpi-label">Estado de Sintonía</span>
                  <span
                    className="dwj-perf-kpi-val"
                    style={{ color: allSynced ? '#4ade80' : '#f87171', fontSize: '0.9rem' }}
                  >
                    {allSynced ? '✓ 5/5 Cuadrados' : '⚠️ Descuadre Detectado'}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 5-Champion Cards Grid */}
        <div className="dwj-perf-champs-grid">
          {(simulation.championSyncMetrics || []).map((metric) => {
            const dmgFormatted =
              metric.damageDealt !== undefined
                ? metric.damageDealt >= 1_000_000
                  ? `${(metric.damageDealt / 1_000_000).toFixed(1)}M`
                  : `${(metric.damageDealt / 1_000).toFixed(0)}k`
                : '0';

            const isTitus = metric.championName.toLowerCase().includes('titus');
            const isWixwell = metric.championName.toLowerCase().includes('wixwell');

            return (
              <div
                key={`metric-slot-${metric.slotIndex}`}
                className="dwj-perf-champ-card"
                style={{
                  borderLeft: `4px solid ${metric.slotColor || '#38bdf8'}`,
                  borderColor: metric.isSynced
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(239, 68, 68, 0.45)',
                }}
              >
                {/* Header: Avatar, Name, Speed */}
                <div className="dwj-perf-champ-header">
                  <ChampionAvatar
                    name={metric.championName}
                    size="xs"
                    slotColor={metric.slotColor}
                    showAffinity={false}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexGrow: 1 }}>
                    <span className="dwj-perf-champ-name" title={metric.championName}>
                      {metric.championName}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600 }}>
                      {isTitus ? 'DEF + HP Híbrido' : isWixwell ? 'Escudos / DEF' : 'Slot ' + (metric.slotIndex + 1)}
                    </span>
                  </div>
                  <span className="dwj-perf-champ-spd" title="Velocidad real (True Speed)">
                    {metric.trueSpeed} SPD
                  </span>
                </div>

                {/* Metrics Row: Turnos Estimados & Daño Estimado */}
                <div className="dwj-perf-metrics-row">
                  {/* Metric 1: Turnos Estimados */}
                  <div className="dwj-perf-metric-box">
                    <span className="dwj-perf-metric-lbl">Turnos Est.</span>
                    <span className="dwj-perf-metric-num" style={{ color: '#38bdf8' }}>
                      {metric.turnsTaken}
                    </span>
                    <span className="dwj-perf-metric-sub">
                      {metric.turnsPerBossTurn.toFixed(2)}x / ronda
                    </span>
                  </div>

                  {/* Metric 2: Daño Estimado */}
                  <div className="dwj-perf-metric-box">
                    <span className="dwj-perf-metric-lbl">Daño Est.</span>
                    <span className="dwj-perf-metric-num" style={{ color: '#f87171' }}>
                      {dmgFormatted}
                    </span>
                    <span className="dwj-perf-metric-sub">
                      {metric.damagePercent || 0}% del total
                    </span>
                  </div>
                </div>

                {/* Sintonía Status Badge */}
                <div
                  className="dwj-perf-sync-badge"
                  style={{
                    backgroundColor: metric.isSynced
                      ? 'rgba(74, 222, 128, 0.15)'
                      : 'rgba(239, 68, 68, 0.18)',
                    borderColor: metric.isSynced
                      ? 'rgba(74, 222, 128, 0.4)'
                      : 'rgba(239, 68, 68, 0.5)',
                    color: metric.isSynced ? '#4ade80' : '#f87171',
                  }}
                  title={metric.syncLabel}
                >
                  {metric.isSynced
                    ? metric.turnsPerBossTurn >= 1.9
                      ? '🟢 2:1 Cuadrado'
                      : metric.turnsPerBossTurn >= 1.25
                      ? '🟢 4:3 Cuadrado'
                      : '🔵 1:1 Cuadrado'
                    : '⚠️ Descuadrado'}
                </div>

                {/* Damage Contribution Progress Bar */}
                <div className="dwj-perf-dmg-bar-container" title={`Contribución al daño: ${metric.damagePercent || 0}%`}>
                  <div
                    className="dwj-perf-dmg-bar-fill"
                    style={{
                      width: `${Math.min(100, Math.max(2, metric.damagePercent || 0))}%`,
                      background: metric.slotColor
                        ? `linear-gradient(90deg, ${metric.slotColor} 0%, #f87171 100%)`
                        : 'linear-gradient(90deg, #38bdf8 0%, #f87171 100%)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Header Bar */}
      <div className="dwj-header-bar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="dwj-title">
              <span>⚔️</span> Matriz de Combate (DeadwoodJedi Speed Engine)
            </h2>
            {(() => {
              const allSynced = simulation.championSyncMetrics && simulation.championSyncMetrics.length > 0
                ? simulation.championSyncMetrics.every((m) => m.isSynced)
                : false;
              const diffLabel = simulation.bossDifficulty || 'Clan Boss';
              const spdLabel = simulation.bossSpeed ? `${simulation.bossSpeed} SPD` : '';
              return (
                <span
                  className="dwj-sync-badge"
                  style={{
                    backgroundColor: allSynced ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    borderColor: allSynced ? 'rgba(74, 222, 128, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                    color: allSynced ? '#4ade80' : '#f87171',
                  }}
                  title={
                    allSynced
                      ? `Sintonía cuadrada para ${diffLabel} (${spdLabel})`
                      : `Rotación descuadrada en ${diffLabel} (${spdLabel}): los campeones pierden turnos`
                  }
                >
                  {allSynced
                    ? `✓ ${Math.min(simulation.totalBossTurns, 50)} Rondas Cuadradas (${diffLabel})`
                    : `⚠️ Descuadrado en ${diffLabel} (${spdLabel})`}
                </span>
              );
            })()}
            {simulation.totalTeamDamage !== undefined && simulation.totalTeamDamage > 0 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#f87171',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                Daño: {(simulation.totalTeamDamage / 1_000_000).toFixed(1)}M
              </span>
            )}
          </div>
          <p className="dwj-subtitle">
            Ciclo canónico de 3 columnas del Clan Boss: <strong>AOE1</strong> → <strong>AOE2</strong> → <strong>STUN</strong>.
          </p>
        </div>

        {/* View Mode Controls & Total Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="dwj-view-toggle">
            <button
              type="button"
              className={`dwj-toggle-btn ${viewMode === 'matrix' ? 'active' : ''}`}
              onClick={() => setViewMode('matrix')}
              title="Vista en 3 columnas oficial de DeadwoodJedi"
            >
              🔲 Matriz 3 Columnas
            </button>
            <button
              type="button"
              className={`dwj-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vista de lista lineal"
            >
              📋 Lista
            </button>
          </div>

          <span className="dwj-actions-counter">
            {simulation.turns.filter((t) => t.bossRound <= 50).length} Acciones
          </span>
        </div>
      </div>

      {/* Champion Filter Pills */}
      <div className="dwj-filter-bar">
        <span className="dwj-filter-label">Resaltar Campeón:</span>
        <button
          type="button"
          className={`dwj-filter-pill ${selectedChampFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedChampFilter('all')}
        >
          Todos ({uniqueChampionNames.length})
        </button>

        {uniqueChampionNames.map((name) => (
          <button
            key={name}
            type="button"
            className={`dwj-filter-pill ${selectedChampFilter.toLowerCase() === name.toLowerCase() ? 'active' : ''}`}
            onClick={() =>
              setSelectedChampFilter(
                selectedChampFilter.toLowerCase() === name.toLowerCase() ? 'all' : name
              )
            }
          >
            {name}
          </button>
        ))}
      </div>

      {/* 3-COLUMN MATRIX VIEW (Exact DeadwoodJedi Format) */}
      {viewMode === 'matrix' && (
        <div className="dwj-matrix-container">
          {/* Sticky 3-Column Headers: AOE1 | AOE2 | STUN */}
          <div className="dwj-columns-header">
            <div className="dwj-col-header aoe1">
              <span className="dwj-col-title">AOE1</span>
              <span className="dwj-col-desc">Ataque en Área 1 (Turnos 1, 4, 7, 10...)</span>
            </div>
            <div className="dwj-col-header aoe2">
              <span className="dwj-col-title">AOE2</span>
              <span className="dwj-col-desc">Ataque en Área 2 (Turnos 2, 5, 8, 11...)</span>
            </div>
            <div className="dwj-col-header stun">
              <span className="dwj-col-title">STUN</span>
              <span className="dwj-col-desc">Aturdimiento Único (Turnos 3, 6, 9, 12...)</span>
            </div>
          </div>

          {/* Cycles Rows (Each row contains 1 complete 3-turn rotation) */}
          <div className="dwj-cycles-rows">
            {groupedCycles.map((cycle) => (
              <div key={`cycle-${cycle.cycleIndex}`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 8px', fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>
                  <span>🔄 Ciclo {cycle.cycleIndex + 1}</span>
                  <span>Rondas {cycle.cycleIndex * 3 + 1} - {Math.min((cycle.cycleIndex + 1) * 3, 50)}</span>
                </div>
                <div className="dwj-cycle-row">
                  {/* Column 1: AOE1 */}
                  <div className="dwj-cycle-cell">
                    {renderStepCell(cycle.aoe1)}
                  </div>

                  {/* Column 2: AOE2 */}
                  <div className="dwj-cycle-cell">
                    {renderStepCell(cycle.aoe2)}
                  </div>

                  {/* Column 3: STUN */}
                  <div className="dwj-cycle-cell">
                    {renderStepCell(cycle.stun)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LINEAR LIST VIEW (Fallback) */}
      {viewMode === 'list' && (
        <div className="timeline-grid-container">
          {groupedCycles.flatMap((c) => [c.aoe1, c.aoe2, c.stun]).filter((s) => s.bossTurnNumber <= 50).map((step) => (
            <div
              key={`list-step-${step.bossTurnNumber}`}
              className="boss-round-card"
            >
              <div className="boss-round-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`boss-phase-badge ${step.phase.toLowerCase()}`}>
                    {step.phase}
                  </span>
                  <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.85rem' }}>
                    Clan Boss — Turno {step.bossTurnNumber}
                  </span>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  Acciones: {step.championActions.length}
                </span>
              </div>

              <div className="round-actions-list">
                {step.championActions.map((action, aIdx) => (
                  <div
                    key={`list-act-${action.turnIndex}-${aIdx}`}
                    className="action-chip"
                    style={{ borderLeft: `3px solid ${action.color}` }}
                  >
                    <span className="action-slot-dot" style={{ backgroundColor: action.color }} />
                    <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{action.actorName}</span>
                    <span className="skill-tag" style={{ color: action.color }}>{action.skillUsed.alias}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tactical Buff Analysis Modal (Punto 3: Análisis exacto de bufos y supervivencia) */}
      {inspectedStep && (
        <div className="dwj-modal-overlay" onClick={() => setInspectedStep(null)}>
          <div className="dwj-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dwj-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>🔬</span>
                <div>
                  <h3 className="dwj-modal-title">
                    Análisis Táctico de Bufos — Turno {inspectedStep.bossTurnNumber} ({inspectedStep.phase})
                  </h3>
                  <p className="dwj-modal-sub">
                    Revisión de turnos restantes de bufos activos y cobertura ante el ataque del Clan Boss.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="dwj-modal-close"
                onClick={() => setInspectedStep(null)}
              >
                ✕
              </button>
            </div>

            <div className="dwj-modal-body">
              <div className="dwj-modal-table-wrapper">
                <table className="dwj-analysis-table">
                  <thead>
                    <tr>
                      <th>Campeón</th>
                      <th>Turnos en Fase</th>
                      <th>Bufos Activos y Duración</th>
                      <th>Estado de Supervivencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueChampionNames.map((champName) => {
                      const actionsInStep = inspectedStep.championActions.filter(
                        (a) => a.actorName.toLowerCase() === champName.toLowerCase()
                      );
                      const lastAction = actionsInStep[actionsInStep.length - 1] || null;
                      const rawEffects = lastAction
                        ? (lastAction.effectsSnapshot || []).filter((e) => e.targetName === champName)
                        : (inspectedStep.bossAction?.effectsSnapshot || []).filter((e) => e.targetName === champName);

                      // Consolidar efectos únicos por nombre (Raid no muestra duplicados del mismo bufo)
                      const uniqueEffectsMap = new Map<string, (typeof rawEffects)[0]>();
                      for (const eff of rawEffects) {
                        const existing = uniqueEffectsMap.get(eff.name);
                        if (!existing || eff.duration > existing.duration) {
                          uniqueEffectsMap.set(eff.name, eff);
                        }
                      }
                      const effects = Array.from(uniqueEffectsMap.values());

const formatBuffLabel = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('shield_alt')) return 'Escudo Reforzado';
  if (n.includes('shield')) return 'Escudo';
  if (n.includes('intercept') || n.includes('inmutable')) return 'Inmutable';
  if (n.includes('speed') || n.includes('spd')) return '+30% Velocidad';
  if (n.includes('def') || n.includes('defup')) return '+60% Defensa';
  if (n.includes('block-damage') || n.includes('block_dmg')) return 'Bloquear Daño';
  if (n.includes('unkillable') || n.includes('inmortal')) return 'Inmortal';
  if (n.includes('block-debuff')) return 'Bloquear Debufos';
  if (n.includes('strengthen')) return 'Fortalecer';
  if (n.includes('counterattack')) return 'Contraataque';
  if (n.includes('revive')) return 'Revivir al Morir';
  if (n.includes('ally_protect') || n.includes('ally-protect')) return 'Protección Aliado';
  return name;
};

                      const hasBlockDamage = effects.some((e) => e.name.includes('block-damage') || e.name.includes('block_dmg') || e.name.includes('invuln'));
                      const hasUnkillable = effects.some((e) => e.name.includes('unkillable') || e.name.includes('inmortal'));
                      const hasShield = effects.some((e) => e.name.includes('shield'));
                      const hasIntercept = effects.some((e) => e.name.includes('intercept') || e.name.includes('inmutable'));
                      const hasDefBuff = effects.some((e) => e.name.includes('def-buff') || e.name.includes('defup'));
                      const expiringBuffs = effects.filter((e) => e.duration === 1);

                      return (
                        <tr key={champName}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <ChampionAvatar name={champName} size="xs" />
                              <span style={{ fontWeight: 700, color: '#f8fafc' }}>{champName}</span>
                            </div>
                          </td>
                          <td>
                            {actionsInStep.length > 0 ? (
                              <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                                {actionsInStep.length} {actionsInStep.length === 1 ? 'acción' : 'acciones'}
                              </span>
                            ) : (
                              <span style={{ color: '#64748b' }}>0 acciones</span>
                            )}
                          </td>
                          <td>
                            {effects.length > 0 ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {effects.map((eff, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      background: 'rgba(255, 255, 255, 0.05)',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      border:
                                        eff.duration === 1
                                          ? '1px solid rgba(239, 68, 68, 0.6)'
                                          : '1px solid rgba(255, 255, 255, 0.08)',
                                    }}
                                  >
                                    <RaidBuffIcon
                                      name={eff.name}
                                      type={eff.type}
                                      duration={eff.duration}
                                      size="sm"
                                      showDuration={false}
                                    />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f8fafc' }}>
                                      {formatBuffLabel(eff.name)}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        fontFamily: 'monospace',
                                        color: eff.duration === 1 ? '#f87171' : '#34d399',
                                      }}
                                    >
                                      {eff.duration}T
                                    </span>
                                    {eff.duration === 1 && (
                                      <span title="¡Expira al terminar este turno!">⚠️</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.75rem' }}>
                                Sin bufos activos
                              </span>
                            )}
                          </td>
                          <td>
                            {hasBlockDamage ? (
                              <span className="survival-tag safe">🌟 Inmune (Bloqueo Daño)</span>
                            ) : hasUnkillable ? (
                              <span className="survival-tag safe">💀 Inmortal (Unkillable)</span>
                            ) : hasIntercept && inspectedStep.phase === 'STUN' ? (
                              <span className="survival-tag safe">⏳ Inmutable (Inmune a Stun)</span>
                            ) : hasShield ? (
                              <span className="survival-tag shield">🛡️ Escudo Activo</span>
                            ) : hasDefBuff ? (
                              <span className="survival-tag def">🛡️ +60% DEF</span>
                            ) : (
                              <span className="survival-tag danger">⚠️ Sin Mitigación</span>
                            )}
                            {expiringBuffs.length > 0 && (
                              <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '2px', fontWeight: 600 }}>
                                ⚠️ {expiringBuffs.length} bufo{expiringBuffs.length === 1 ? '' : 's'} expira{expiringBuffs.length === 1 ? '' : 'n'} en este turno
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dwj-modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setInspectedStep(null)}
              >
                Cerrar Análisis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
