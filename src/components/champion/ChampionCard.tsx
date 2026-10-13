import React, { useState, useMemo } from 'react';
import type { TeamMemberConfig, ChampionData, AuraType, EquippedSet } from '../../types';
import { detectChampionAura } from '../../core/calculator/auraUtils';
import { parseChampionSkills } from '../../core/calculator/skillUtils';
import { ChampionAvatar } from './ChampionAvatar';

interface ChampionCardProps {
  member: TeamMemberConfig;
  allChampions: ChampionData[];
  onUpdate: (updated: TeamMemberConfig) => void;
  onSetAsLeader: (slotIndex: number) => void;
  leaderAuraType: AuraType;
  leaderAuraPercent: number;
}

interface SetMeta {
  id: string;
  name: string;
  category: '1-9p' | '4p' | '2p' | '1-3p';
  basePieces: number;
  maxPieces: number;
  bonus: string;
}

const AVAILABLE_SETS: SetMeta[] = [
  // Sets Variables (1-9 Piezas)
  { id: 'protection', name: 'Protección / Protection (1-9p)', category: '1-9p', basePieces: 1, maxPieces: 9, bonus: '+12% a +24% SPD' },
  { id: 'supersonic', name: 'Supersónico / Supersonic (1-9p)', category: '1-9p', basePieces: 1, maxPieces: 9, bonus: '+12% a +44% SPD' },
  { id: 'stoneskin', name: 'Piel de Piedra / Stoneskin (1-9p)', category: '1-9p', basePieces: 1, maxPieces: 9, bonus: 'Inmunidad Piel de Piedra' },
  { id: 'merciless', name: 'Despiadado / Merciless (1-9p)', category: '1-9p', basePieces: 1, maxPieces: 9, bonus: '+ATK, +C.DMG, Cooldown' },
  { id: 'slayer', name: 'Degollador / Slayer (1-9p)', category: '1-9p', basePieces: 1, maxPieces: 9, bonus: '+C.RATE, +C.DMG, TM Fill' },
  { id: 'pinpoint', name: 'Pinpoint (1-9p)', category: '1-9p', basePieces: 1, maxPieces: 9, bonus: '+ACC, +SPD' },

  // Sets de 4 Piezas
  { id: 'swift_parry', name: 'Parada Precipitada / Swift Parry (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: '+18% SPD, Imp. Morir' },
  { id: 'stalwart', name: 'Inquebrantable / Stalwart (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: '-30% Daño AoE' },
  { id: 'lifesteal', name: 'Robo de Vida / Lifesteal (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: 'Cura 30% del daño' },
  { id: 'savage', name: 'Salvaje / Savage (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: 'Ignora 25% DEF' },
  { id: 'lethal', name: 'Letal / Lethal (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: 'Ignora 25% DEF' },
  { id: 'toxic', name: 'Tóxico / Toxic (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: 'Venenos 2.5%' },
  { id: 'reflex', name: 'Reflejos / Reflex (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: '40% Reducción CD' },
  { id: 'relentless', name: 'Implacable / Relentless (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: 'Turno Extra 18%' },
  { id: 'guardian', name: 'Guardián / Guardian (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: 'Absorbe 10% daño' },
  { id: 'bolster', name: 'Refuerzo / Bolster (4p)', category: '4p', basePieces: 4, maxPieces: 4, bonus: 'Escudo protegido' },

  // Sets de 2 Piezas
  { id: 'speed', name: 'Velocidad / Speed (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+12% SPD (Lore +15%)' },
  { id: 'perception', name: 'Percepción / Perception (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+5% SPD, +40 ACC' },
  { id: 'righteous', name: 'Justiciero / Righteous (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+10% SPD, +40 RES' },
  { id: 'divine_speed', name: 'Velocidad Divina / Divine Speed (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+12% SPD, Escudo' },
  { id: 'killstroke', name: 'Golpe Mortal / Killstroke (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+5% SPD, +20% C.DMG' },
  { id: 'defense', name: 'Defensa / Defense (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+15% DEF (Lore +15%)' },
  { id: 'defiant', name: 'Desafiante / Defiant (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+10% DEF, -15% AoE' },
  { id: 'resilience', name: 'Resiliencia / Resilience (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+10% HP/DEF' },
  { id: 'life', name: 'Vida / Life (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+15% HP' },
  { id: 'immortal', name: 'Inmortal / Immortal (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+15% HP, Cura 3%' },
  { id: 'cruel', name: 'Cruel / Cruel (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+15% ATK, Ig. 5% DEF' },
  { id: 'accuracy', name: 'Puntería / Accuracy (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+40 ACC' },
  { id: 'resistance', name: 'Resistencia / Resistance (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+50 RES' },
  { id: 'critical_rate', name: 'Tasa Crítica / Crit Rate (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+12% C.Rate' },
  { id: 'critical_damage', name: 'Daño Crítico / Crit Dmg (2p)', category: '2p', basePieces: 2, maxPieces: 6, bonus: '+20% C.Dmg' },

  // Accesorios Especiales (1-3 Piezas)
  { id: 'refresh_accessory', name: 'Accesorios Refresco (1-3p)', category: '1-3p', basePieces: 1, maxPieces: 3, bonus: '5% CD Reset/pieza' },
  { id: 'cleansing_accessory', name: 'Accesorios Limpieza (1-3p)', category: '1-3p', basePieces: 1, maxPieces: 3, bonus: '8% Limpieza/pieza' },
  { id: 'bloodshield_accessory', name: 'Accesorios Escudo Sangre (1-3p)', category: '1-3p', basePieces: 1, maxPieces: 3, bonus: 'Escudo por daño' },
  { id: 'reaction_accessory', name: 'Accesorios Reacción (1-3p)', category: '1-3p', basePieces: 1, maxPieces: 3, bonus: 'Crítico a normal' },
  { id: 'revenge_accessory', name: 'Accesorios Venganza (1-3p)', category: '1-3p', basePieces: 1, maxPieces: 3, bonus: 'Contraataque' },
];

const AURA_PRESETS: Record<AuraType, number[]> = {
  none: [],
  spd: [15, 19, 24, 28, 30],
  def: [20, 25, 28, 30, 33, 42],
  hp: [25, 30, 33, 40],
  atk: [25, 30, 33, 40],
  acc: [40, 50, 60, 70, 80],
  res: [50, 60, 70, 80],
  crate: [15, 19, 24],
};

export const ChampionCard: React.FC<ChampionCardProps> = ({
  member,
  allChampions,
  onUpdate,
  onSetAsLeader,
  leaderAuraType,
  leaderAuraPercent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showArtifactsSection, setShowArtifactsSection] = useState(false);

  // Filter champions for autocomplete (supports Spanish, English, Factions & Senda slugs)
  const filteredChampions = useMemo(() => {
    if (!searchTerm.trim()) return allChampions.slice(0, 40);
    const term = searchTerm.toLowerCase().trim();
    return allChampions
      .filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.spanishName?.toLowerCase().includes(term) ||
          c.englishName?.toLowerCase().includes(term) ||
          c.spanishFaction?.toLowerCase().includes(term) ||
          c.class?.faction?.toLowerCase().includes(term) ||
          c.sendaSlug?.toLowerCase().includes(term)
      )
      .slice(0, 40);
  }, [allChampions, searchTerm]);

  // Handle selecting a champion from list
  const handleSelectChampion = (champ: ChampionData) => {
    const baseSpd = champ.stats.spd || 100;
    const baseDef = champ.stats.def || 1000;
    const detected = detectChampionAura(champ);
    const newSkillConfigs = parseChampionSkills(champ);

    onUpdate({
      ...member,
      championName: champ.name,
      championData: champ,
      baseSpeed: baseSpd,
      totalSpeed: Math.max(member.totalSpeed, baseSpd),
      baseDefense: baseDef,
      totalDefense: Math.max(member.totalDefense, baseDef),
      hasNativeAura: detected.hasAura,
      nativeAuraDesc: detected.description,
      auraType: member.isLeader ? detected.type : member.auraType,
      auraPercent: member.isLeader ? detected.percent : member.auraPercent,
      customAuraPercent: member.isLeader && detected.type === 'spd' ? detected.percent : member.customAuraPercent,
      customDefAuraPercent: member.isLeader && detected.type === 'def' ? detected.percent : member.customDefAuraPercent,
      skillConfigs: newSkillConfigs,
    });

    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // 9-Piece Equipment Management
  const equippedSets = member.equippedSets || [];
  const totalPieces = equippedSets.reduce((acc, s) => acc + s.pieces, 0);

  // Add a new set if under 9 pieces
  const handleAddSet = () => {
    if (totalPieces >= 9) return;
    const availableSlots = 9 - totalPieces;
    const defaultPieces = availableSlots >= 2 ? 2 : 1;
    const defaultSet = availableSlots >= 2 ? 'speed' : 'protection';
    const newSet: EquippedSet = {
      id: `es-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      set: defaultSet,
      pieces: defaultPieces,
    };
    onUpdate({
      ...member,
      equippedSets: [...equippedSets, newSet],
    });
  };

  // Update a specific equipped set
  const handleUpdateEquippedSet = (idx: number, updated: EquippedSet) => {
    const newSets = [...equippedSets];
    newSets[idx] = updated;
    onUpdate({
      ...member,
      equippedSets: newSets,
    });
  };

  // Remove a set
  const handleRemoveSet = (idx: number) => {
    const newSets = equippedSets.filter((_, i) => i !== idx);
    onUpdate({
      ...member,
      equippedSets: newSets,
    });
  };

  // Clear all sets
  const handleClearSets = () => {
    onUpdate({
      ...member,
      equippedSets: [],
      set1: 'none',
      set2: 'none',
      set3: 'none',
    });
  };

  // Effective Aura calculations
  const effectiveAuraType = member.isLeader
    ? member.auraType
    : member.overrideAura
    ? member.auraType
    : leaderAuraType;

  const effectiveAuraPercent = member.isLeader
    ? member.auraPercent
    : member.overrideAura
    ? member.auraPercent
    : leaderAuraPercent;

  const spdAuraBonus = effectiveAuraType === 'spd' ? (effectiveAuraPercent / 100) * member.baseSpeed : 0;
  const defAuraBonus = effectiveAuraType === 'def' ? Math.round((effectiveAuraPercent / 100) * member.baseDefense) : 0;

  return (
    <div
      className="champion-card"
      style={{
        borderLeft: `4px solid ${member.color}`,
      }}
    >
      {/* Top Bar: Slot, Champion Name & Leader Toggle */}
      <div className="card-top">
        <div
          className="slot-indicator"
          style={{ backgroundColor: member.color }}
          title={`Slot ${member.slotIndex + 1}`}
        >
          {member.slotIndex + 1}
        </div>

        {/* Small Champion Avatar Portrait (Punto 1) */}
        <ChampionAvatar
          name={member.championName}
          rarity={member.championData?.class.rarity || 'Legendary'}
          affinity={member.championData?.class.affinity || 'Void'}
          avatarUrl={member.championData?.avatarUrl}
          size="md"
          slotColor={member.color}
        />

        <div className="champion-selector-wrapper">
          <input
            type="text"
            className="stat-input"
            style={{ fontWeight: 700 }}
            placeholder="Seleccionar Campeón (1,211 catálogo SendaPlays)..."
            value={isDropdownOpen ? searchTerm : (member.championData?.spanishName || member.championName)}
            onFocus={() => {
              setIsDropdownOpen(true);
              setSearchTerm('');
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                maxHeight: '260px',
                overflowY: 'auto',
                background: '#161d2b',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                zIndex: 100,
                boxShadow: '0 8px 30px rgba(0,0,0,0.85)',
              }}
            >
              {filteredChampions.map((c) => {
                const displayName = c.spanishName || c.name;
                const altName = c.name !== displayName ? c.name : (c.englishName && c.englishName !== displayName ? c.englishName : null);
                return (
                  <div
                    key={`${c.name}-${c.spanishFaction || ''}`}
                    onClick={() => handleSelectChampion(c)}
                    style={{
                      padding: '7px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#232d42')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <ChampionAvatar
                        name={c.spanishName || c.name}
                        rarity={c.class?.rarity}
                        affinity={c.class?.affinity}
                        avatarUrl={c.avatarUrl}
                        size="xs"
                        showAffinity={false}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {displayName}
                        </span>
                        {altName && (
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {altName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                        {c.spanishFaction || c.class?.faction}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color:
                            c.class.rarity === 'Mythical'
                              ? '#ff2244'
                              : c.class.rarity === 'Legendary'
                              ? '#f59e0b'
                              : c.class.rarity === 'Epic'
                              ? '#a855f7'
                              : c.class.rarity === 'Rare'
                              ? '#3b82f6'
                              : '#94a3b8',
                        }}
                      >
                        {c.class.rarity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leader Toggle Button */}
        <button
          type="button"
          className={`leader-toggle-btn ${member.isLeader ? 'active' : ''}`}
          onClick={() => onSetAsLeader(member.slotIndex)}
          title="Seleccionar como Líder del equipo"
        >
          👑 {member.isLeader ? 'Líder' : 'Hacer Líder'}
        </button>
      </div>

      {/* Aura Section */}
      {member.isLeader ? (
        <div className="leader-aura-banner">
          <div className="leader-aura-title">
            <span>👑 AURA DE LÍDER (Afecta a todo el Escuadrón)</span>
            {member.hasNativeAura ? (
              <span className="native-aura-badge active" title={member.nativeAuraDesc}>
                ⚡ {member.nativeAuraDesc || 'Aura Nativa Activa'}
              </span>
            ) : (
              <span className="native-aura-badge none">⚪ Sin Aura nativa</span>
            )}
          </div>

          <div className="aura-controls-row">
            {/* Aura Type Selector */}
            <div className="aura-input-group">
              <label className="stat-label">Tipo de Aura</label>
              <select
                className="select-input select-full"
                value={member.auraType}
                onChange={(e) => {
                  const newType = e.target.value as AuraType;
                  const defaultVal = newType === 'none' ? 0 : (AURA_PRESETS[newType][1] || AURA_PRESETS[newType][0] || 0);
                  onUpdate({
                    ...member,
                    auraType: newType,
                    auraPercent: defaultVal,
                    customAuraPercent: newType === 'spd' ? defaultVal : 0,
                    customDefAuraPercent: newType === 'def' ? defaultVal : 0,
                  });
                }}
              >
                <option value="none">⚪ Sin Aura (0%)</option>
                <option value="spd">⚡ Velocidad (SPD %)</option>
                <option value="def">🛡️ Defensa (DEF %)</option>
                <option value="hp">❤️ Vida (HP %)</option>
                <option value="atk">⚔️ Ataque (ATK %)</option>
                <option value="acc">🎯 Puntería (ACC plano)</option>
                <option value="res">🛡️ Resistencia (RES plano)</option>
                <option value="crate">💥 Prob. Crítico (C.RATE %)</option>
              </select>
            </div>

            {/* Aura Value / Percentage (Shown only if auraType !== 'none') */}
            {member.auraType !== 'none' ? (
              <div className="aura-input-group">
                <label className="stat-label">
                  Valor {member.auraType === 'acc' || member.auraType === 'res' ? '(Pts)' : '(%)'}
                </label>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <input
                    type="number"
                    className="stat-input"
                    style={{ width: '60px' }}
                    value={member.auraPercent}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      onUpdate({
                        ...member,
                        auraPercent: val,
                        customAuraPercent: member.auraType === 'spd' ? val : 0,
                        customDefAuraPercent: member.auraType === 'def' ? val : 0,
                      });
                    }}
                  />
                  <div className="aura-quick-pills">
                    {(AURA_PRESETS[member.auraType] || []).map((preset) => (
                      <button
                        key={`preset-${preset}`}
                        type="button"
                        className={`pill-btn ${member.auraPercent === preset ? 'active' : ''}`}
                        onClick={() =>
                          onUpdate({
                            ...member,
                            auraPercent: preset,
                            customAuraPercent: member.auraType === 'spd' ? preset : 0,
                            customDefAuraPercent: member.auraType === 'def' ? preset : 0,
                          })
                        }
                      >
                        {preset}{member.auraType === 'acc' || member.auraType === 'res' ? '' : '%'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="aura-input-group" style={{ justifyContent: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  ⚪ No aplica bonificación de Aura al escuadrón.
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="inherited-aura-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {leaderAuraType === 'none' ? (
              <span style={{ color: '#94a3b8' }}>⚪ Sin Aura de Líder activa en el Escuadrón</span>
            ) : (
              <span>
                👑 <strong>Aura Líder:</strong> +{leaderAuraPercent}
                {leaderAuraType === 'acc' || leaderAuraType === 'res' ? ' ' : '% '}
                {leaderAuraType.toUpperCase()}
                {spdAuraBonus > 0 && <span style={{ color: '#38bdf8' }}> (+{spdAuraBonus.toFixed(1)} SPD)</span>}
                {defAuraBonus > 0 && <span style={{ color: '#34d399' }}> (+{defAuraBonus} DEF)</span>}
              </span>
            )}
          </div>
          <label style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!member.overrideAura}
              onChange={(e) =>
                onUpdate({
                  ...member,
                  overrideAura: e.target.checked,
                  auraType: e.target.checked ? member.auraType : leaderAuraType,
                  auraPercent: e.target.checked ? member.auraPercent : leaderAuraPercent,
                })
              }
            />
            <span>Aura Propia</span>
          </label>
        </div>
      )}

      {/* Override Aura Controls if enabled for non-leader */}
      {!member.isLeader && member.overrideAura && (
        <div className="leader-aura-banner" style={{ borderColor: 'rgba(56, 189, 248, 0.3)', background: 'rgba(56, 189, 248, 0.05)' }}>
          <div className="aura-controls-row">
            <div className="aura-input-group">
              <label className="stat-label">Tipo de Aura Individual</label>
              <select
                className="select-input select-full"
                value={member.auraType}
                onChange={(e) => {
                  const newType = e.target.value as AuraType;
                  const defaultVal = newType === 'none' ? 0 : (AURA_PRESETS[newType][1] || AURA_PRESETS[newType][0] || 0);
                  onUpdate({
                    ...member,
                    auraType: newType,
                    auraPercent: defaultVal,
                  });
                }}
              >
                <option value="none">⚪ Sin Aura (0%)</option>
                <option value="spd">⚡ Velocidad (SPD %)</option>
                <option value="def">🛡️ Defensa (DEF %)</option>
                <option value="hp">❤️ Vida (HP %)</option>
                <option value="atk">⚔️ Ataque (ATK %)</option>
                <option value="acc">🎯 Puntería (ACC)</option>
                <option value="res">🛡️ Resistencia (RES)</option>
                <option value="crate">💥 Prob. Crítico (C.RATE %)</option>
              </select>
            </div>
            {member.auraType !== 'none' && (
              <div className="aura-input-group">
                <label className="stat-label">Valor Individual</label>
                <input
                  type="number"
                  className="stat-input"
                  value={member.auraPercent}
                  onChange={(e) =>
                    onUpdate({ ...member, auraPercent: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Stats Row: Base SPD, Total SPD, Base DEF, Total DEF */}
      <div className="stats-grid-4">
        <div className="stat-field">
          <label className="stat-label">Base SPD</label>
          <input
            type="number"
            className="stat-input"
            value={member.baseSpeed}
            onChange={(e) =>
              onUpdate({ ...member, baseSpeed: Math.max(1, parseInt(e.target.value) || 0) })
            }
          />
        </div>

        <div className="stat-field">
          <label className="stat-label">Total SPD</label>
          <input
            type="number"
            className="stat-input"
            value={member.totalSpeed}
            onChange={(e) =>
              onUpdate({ ...member, totalSpeed: Math.max(1, parseInt(e.target.value) || 0) })
            }
          />
        </div>

        <div className="stat-field">
          <label className="stat-label">Base DEF</label>
          <input
            type="number"
            className="stat-input"
            value={member.baseDefense}
            onChange={(e) =>
              onUpdate({ ...member, baseDefense: Math.max(0, parseInt(e.target.value) || 0) })
            }
          />
        </div>

        <div className="stat-field">
          <label className="stat-label">Total DEF</label>
          <input
            type="number"
            className="stat-input"
            value={member.totalDefense}
            onChange={(e) =>
              onUpdate({ ...member, totalDefense: Math.max(0, parseInt(e.target.value) || 0) })
            }
          />
        </div>
      </div>

      {/* Previsión & Métricas Tácticas en Vivo */}
      <div className="forecasting-panel">
        <div className="forecasting-metric">
          <span className="forecasting-label">⚡ True Speed</span>
          <span className="forecasting-value" style={{ color: '#38bdf8' }}>
            {member.trueSpeed.toFixed(2)}
          </span>
          <span className="forecasting-sub">
            {spdAuraBonus > 0 ? `+${spdAuraBonus.toFixed(1)} Aura` : 'Sin Aura SPD'}
          </span>
        </div>

        <div className="forecasting-metric">
          <span className="forecasting-label">🛡️ DEF Efectiva</span>
          <span className="forecasting-value" style={{ color: '#34d399' }}>
            {member.effectiveDefense.toLocaleString()}
          </span>
          <span className="forecasting-sub">
            {defAuraBonus > 0 ? `+${defAuraBonus} Aura` : 'Base + Eq'}
          </span>
        </div>

        <div className="forecasting-metric">
          <span className="forecasting-label">Mitigación CB</span>
          <span className="forecasting-value" style={{ color: '#fbbf24' }}>
            {member.damageMitigation.toFixed(1)}%
          </span>
          <span className="forecasting-sub">vs Clan Boss</span>
        </div>

        <div className="forecasting-metric">
          <span className="forecasting-label">Factor Escudo</span>
          <span className="forecasting-value" style={{ color: '#c084fc' }}>
            x{member.shieldMultiplier.toFixed(2)}
          </span>
          <span className="forecasting-sub">EHP Escudo</span>
        </div>
      </div>

      {/* Collapsible Artifact & Accessories Sets Section (Punto 2: Oculto por defecto ya que Velocidad y DEF son directas) */}
      <div className="sets-toggle-container">
        <button
          type="button"
          className="sets-toggle-btn"
          onClick={() => setShowArtifactsSection(!showArtifactsSection)}
          title="Velocidad y Defensa ya se configuran directamente arriba. Puedes expandir si requieres sets para Lore of Steel o True Speed."
        >
          <span className="sets-toggle-text">
            {showArtifactsSection ? '▼ Ocultar Sets y Lore of Steel' : '🛡️ Configurar Sets y Lore of Steel (Opcional)'}
          </span>
          <span className="sets-toggle-badge">
            {totalPieces > 0 ? `${totalPieces} piezas activas` : 'Oculto'}
          </span>
        </button>
      </div>

      {showArtifactsSection && (
        <div className="sets-section">
          <div className="sets-header">
            <div className="sets-header-title">
              <span>🛡️ Equipamiento (6 Artefactos + 3 Accesorios):</span>
              {totalPieces === 0 ? (
                <span className="badge-tag empty">⚪ 9 Piezas Sueltas (Sin Sets)</span>
              ) : totalPieces === 9 ? (
                <span className="badge-tag active">🛡️ 9/9 Piezas Equipadas (Lleno)</span>
              ) : (
                <span className="badge-tag active">✨ {totalPieces}/9 Piezas en Sets ({9 - totalPieces} sueltas)</span>
              )}
            </div>
            {totalPieces > 0 && (
              <button
                type="button"
                className="clear-sets-btn"
                onClick={handleClearSets}
                title="Vaciar todos los conjuntos a piezas sueltas"
              >
                ❌ Vaciar Todo
              </button>
            )}
          </div>

          {/* Dynamic Equipped Sets List */}
          {equippedSets.length > 0 && (
            <div className="equipped-sets-list">
              {equippedSets.map((eqSet, idx) => {
                const meta = AVAILABLE_SETS.find((s) => s.id === eqSet.set) || AVAILABLE_SETS[0];
                const remainingWithoutThis = 9 - (totalPieces - eqSet.pieces);
                const maxPossibleForSet = Math.min(meta.maxPieces, remainingWithoutThis);

                // Guarantee piece options from 1 up to maxPossibleForSet (never empty)
                const pieceOptions = Array.from(
                  { length: Math.max(1, maxPossibleForSet) },
                  (_, i) => i + 1
                );

                return (
                  <div key={eqSet.id} className="equipped-set-row">
                    {/* Set Selector */}
                    <select
                      className="select-input select-full"
                      value={eqSet.set}
                      onChange={(e) => {
                        const newSetId = e.target.value;
                        const newMeta = AVAILABLE_SETS.find((s) => s.id === newSetId) || AVAILABLE_SETS[0];
                        const maxForNew = Math.min(newMeta.maxPieces, remainingWithoutThis);
                        let newPieces = eqSet.pieces;
                        if (newMeta.category === '4p' && remainingWithoutThis >= 4 && newPieces < 4) {
                          newPieces = 4;
                        } else if (newMeta.category === '2p' && remainingWithoutThis >= 2 && newPieces < 2) {
                          newPieces = 2;
                        }
                        newPieces = Math.max(1, Math.min(newPieces, maxForNew));
                        handleUpdateEquippedSet(idx, { ...eqSet, set: newSetId, pieces: newPieces });
                      }}
                    >
                      <optgroup label="🌟 Sets Variables (1 a 9 Piezas)">
                        {AVAILABLE_SETS.filter((s) => s.category === '1-9p').map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🦅 Sets de 4 Piezas">
                        {AVAILABLE_SETS.filter((s) => s.category === '4p').map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="⚡ Sets de 2 Piezas">
                        {AVAILABLE_SETS.filter((s) => s.category === '2p').map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="💍 Accesorios Especiales (1 a 3 Piezas)">
                        {AVAILABLE_SETS.filter((s) => s.category === '1-3p').map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>

                    {/* Pieces Selector */}
                    <select
                      className="select-input"
                      style={{ width: '130px' }}
                      value={Math.min(eqSet.pieces, maxPossibleForSet)}
                      onChange={(e) => {
                        const p = parseInt(e.target.value, 10) || 1;
                        handleUpdateEquippedSet(idx, { ...eqSet, pieces: p });
                      }}
                    >
                      {pieceOptions.map((opt) => {
                        let label = `${opt} ${opt === 1 ? 'pieza' : 'piezas'}`;
                        if (meta.category === '2p') {
                          if (opt === 2) label = '2 piezas (1 set)';
                          else if (opt === 4) label = '4 piezas (2 sets)';
                          else if (opt === 6) label = '6 piezas (3 sets)';
                          else label = `${opt} ${opt === 1 ? 'pieza' : 'piezas'} (suelta)`;
                        } else if (meta.category === '4p') {
                          if (opt === 4) label = '4 piezas (1 set)';
                          else label = `${opt} ${opt === 1 ? 'pieza' : 'piezas'} (suelta)`;
                        } else if (meta.category === '1-3p') {
                          label = `${opt} ${opt === 1 ? 'pieza' : 'piezas'} (acc.)`;
                        }
                        return (
                          <option key={opt} value={opt}>
                            {label}
                          </option>
                        );
                      })}
                    </select>

                    {/* Delete Set Button */}
                    <button
                      type="button"
                      className="delete-set-btn"
                      onClick={() => handleRemoveSet(idx)}
                      title="Eliminar este conjunto"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Set Button (HIDDEN when totalPieces >= 9) */}
          {totalPieces >= 9 ? (
            <div className="max-sets-notice">
              <span>🛡️ Límite de 9 piezas alcanzado (6 artefactos + 3 accesorios equipados)</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '3px' }}>
                💡 Para aumentar piezas en un conjunto, reduce o elimina piezas de otro conjunto.
              </span>
            </div>
          ) : (
            <button type="button" className="add-set-btn" onClick={handleAddSet}>
              ➕ Añadir Conjunto ({9 - totalPieces} {9 - totalPieces === 1 ? 'ranura libre' : 'ranuras libres'})
            </button>
          )}

          {/* Footer: Lore of Steel toggle */}
          <div className="sets-footer">
            <label
              className="lore-toggle"
              title="Sabiduría del Mal (+15% a bonus de conjuntos básicos de 2 piezas)"
            >
              <input
                type="checkbox"
                checked={member.hasLoreOfSteel}
                onChange={(e) => onUpdate({ ...member, hasLoreOfSteel: e.target.checked })}
              />
              <span>Lore of Steel (+15% a conjuntos de 2p)</span>
            </label>
          </div>
        </div>
      )}

      {/* Compact High-Density Skills Section */}
      <div className="compact-skills-section">
        <div className="compact-skills-header">
          <span className="compact-skills-title">
            ⚡ Habilidades ({member.skillConfigs.filter((s) => !s.isPassive).length} Activas{member.skillConfigs.some((s) => s.isPassive) ? `, ${member.skillConfigs.filter((s) => s.isPassive).length} Pasiva` : ''}):
          </span>
          <span className="compact-skills-hint">Rotación, Inicial y Bloqueo</span>
        </div>

        <div className="compact-skills-list">
          {member.skillConfigs.map((skill, sIdx) => {
            const isPassive = !!skill.isPassive;
            const isBlocked = !!skill.disabled;

            return (
              <div
                key={skill.id}
                className={`compact-skill-row ${isBlocked ? 'blocked' : ''} ${isPassive ? 'passive' : ''}`}
              >
                {/* Left: Badge & Name */}
                <div className="compact-skill-left">
                  <span
                    className="compact-skill-badge"
                    style={{
                      backgroundColor: isPassive ? 'rgba(56, 189, 248, 0.2)' : `${member.color}25`,
                      color: isPassive ? '#38bdf8' : member.color,
                      borderColor: isPassive ? 'rgba(56, 189, 248, 0.4)' : `${member.color}60`,
                    }}
                  >
                    {skill.alias}
                  </span>
                  <span
                    className="compact-skill-name"
                    title={skill.name}
                    style={{
                      textDecoration: isBlocked ? 'line-through' : 'none',
                      color: isBlocked ? '#94a3b8' : isPassive ? '#e2e8f0' : '#cbd5e1',
                    }}
                  >
                    {skill.name}
                  </span>
                </div>

                {/* Right: Inline Controls Cluster */}
                <div className="compact-skill-right">
                  {isPassive ? (
                    <div className="compact-passive-info">
                      <span className="compact-passive-pill">🛡️ Pasiva</span>
                      {skill.cooldown > 0 && (
                        <span className="compact-passive-cd">{skill.cooldown}T</span>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* State Button */}
                      <button
                        type="button"
                        className={`compact-state-btn ${isBlocked ? 'blocked' : 'active'}`}
                        title={isBlocked ? 'Habilitar habilidad en rotación' : 'Bloquear habilidad (No usar)'}
                        onClick={() => {
                          const newSkills = [...member.skillConfigs];
                          newSkills[sIdx] = {
                            ...skill,
                            disabled: !isBlocked,
                            priority: !isBlocked ? 0 : (skill.priority === 0 ? 1 : skill.priority),
                            isOpener: !isBlocked ? false : skill.isOpener,
                          };
                          onUpdate({ ...member, skillConfigs: newSkills });
                        }}
                      >
                        {isBlocked ? '🚫 Bloq' : '✅ Activa'}
                      </button>

                      {/* Inline Opener, Priority, CD, Delay */}
                      {!isBlocked && (
                        <div className="compact-inputs-cluster">
                          {/* Opener / Habilidad Inicial Toggle */}
                          <button
                            type="button"
                            className={`compact-opener-btn ${skill.isOpener ? 'active' : ''}`}
                            title={
                              skill.isOpener
                                ? '★ Habilidad Inicial activa (Opener): Se usará obligatoriamente en el primer turno y luego seguirá el orden de prioridad acordado. Clic para desactivar.'
                                : 'Configurar como Habilidad Inicial (Opener): Se usará en el primer turno y luego seguirá la prioridad acordada.'
                            }
                            onClick={() => {
                              const isNowOpener = !skill.isOpener;
                              const newSkills = member.skillConfigs.map((s, idx) => ({
                                ...s,
                                isOpener: idx === sIdx ? isNowOpener : false,
                              }));
                              onUpdate({ ...member, skillConfigs: newSkills });
                            }}
                          >
                            {skill.isOpener ? '★ Inicial' : '☆ Inicial'}
                          </button>

                          <label className="compact-input-item" title="Prioridad de ejecución (1 = Máxima)">
                            <span className="compact-mini-label">P:</span>
                            <select
                              className="compact-select"
                              value={skill.priority}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                const newSkills = [...member.skillConfigs];
                                newSkills[sIdx] = {
                                  ...skill,
                                  priority: val,
                                  disabled: val === 0,
                                  isOpener: val === 0 ? false : skill.isOpener,
                                };
                                onUpdate({ ...member, skillConfigs: newSkills });
                              }}
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="0">🚫</option>
                            </select>
                          </label>

                          <label className="compact-input-item" title="Tiempo de reutilización (Cooldown en turnos)">
                            <span className="compact-mini-label">CD:</span>
                            <input
                              type="number"
                              className="compact-number-input"
                              min="0"
                              value={skill.cooldown}
                              onChange={(e) => {
                                const newSkills = [...member.skillConfigs];
                                newSkills[sIdx] = {
                                  ...skill,
                                  cooldown: Math.max(0, parseInt(e.target.value) || 0),
                                };
                                onUpdate({ ...member, skillConfigs: newSkills });
                              }}
                            />
                          </label>

                          <label className="compact-input-item" title="Retraso inicial (Delay antes del primer uso)">
                            <span className="compact-mini-label">Del:</span>
                            <input
                              type="number"
                              className="compact-number-input"
                              min="0"
                              value={skill.delay}
                              onChange={(e) => {
                                const newSkills = [...member.skillConfigs];
                                newSkills[sIdx] = {
                                  ...skill,
                                  delay: Math.max(0, parseInt(e.target.value) || 0),
                                };
                                onUpdate({ ...member, skillConfigs: newSkills });
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
