import React, { useState } from 'react';

interface RaidBuffIconProps {
  name: string;
  type?: 'buff' | 'debuff';
  duration?: number;
  size?: 'xs' | 'sm' | 'md';
  showDuration?: boolean;
}

const BUFF_IMAGE_MAP: Record<string, { path: string; label: string }> = {
  // Escudo (Shield - Habilidad y Set de Artefactos)
  'shield': { path: '/assets/buffs/escudo-habilidad.webp', label: 'Escudo' },
  'escudo': { path: '/assets/buffs/escudo-habilidad.webp', label: 'Escudo' },
  'shield-skill': { path: '/assets/buffs/escudo-habilidad.webp', label: 'Escudo (Habilidad)' },
  'shield-set': { path: '/assets/buffs/escudo-set.webp', label: 'Escudo (Set)' },
  'divine_shield': { path: '/assets/buffs/escudo-set.webp', label: 'Escudo Divino' },
  'shield_alt': { path: '/assets/buffs/escudo-set.webp', label: 'Escudo Reforzado' },

  // Inmutable / Interceptar (Wixwell)
  'intercept': { path: '/assets/buffs/interceptar.webp', label: 'Inmutable (Interceptar)' },
  'inmutable': { path: '/assets/buffs/interceptar.webp', label: 'Inmutable (Interceptar)' },
  'interceptar': { path: '/assets/buffs/interceptar.webp', label: 'Inmutable (Interceptar)' },

  // Bloquear Daño (Block Damage)
  'block-damage': { path: '/assets/buffs/bloquear-dano.webp', label: 'Bloquear Daño' },
  'block_damage': { path: '/assets/buffs/bloquear-dano.webp', label: 'Bloquear Daño' },
  'block_dmg': { path: '/assets/buffs/bloquear-dano.webp', label: 'Bloquear Daño' },

  // Inmortal (Unkillable)
  'unkillable': { path: '/assets/buffs/inmortal.webp', label: 'Inmortal (Unkillable)' },
  'inmortal': { path: '/assets/buffs/inmortal.webp', label: 'Inmortal (Unkillable)' },

  // Bloquear Debufos (Block Debuffs)
  'block-debuffs': { path: '/assets/buffs/bloquear-debufos.webp', label: 'Bloquear Debufos' },
  'block_debuffs': { path: '/assets/buffs/bloquear-debufos.webp', label: 'Bloquear Debufos' },
  'block_debuff': { path: '/assets/buffs/bloquear-debufos.webp', label: 'Bloquear Debufos' },

  // Aumentar Velocidad (Increase SPD)
  'speed-buff': { path: '/assets/buffs/aumentar-vel-2.webp', label: '+30% Velocidad' },
  'speedup': { path: '/assets/buffs/aumentar-vel-2.webp', label: '+30% Velocidad' },
  'spd_2': { path: '/assets/buffs/aumentar-vel-2.webp', label: '+30% Velocidad' },
  'spd_1': { path: '/assets/buffs/aumentar-vel-1.webp', label: '+15% Velocidad' },

  // Aumentar Defensa (Increase DEF)
  'def-buff': { path: '/assets/buffs/aumentar-def-2.webp', label: '+60% Defensa' },
  'defup': { path: '/assets/buffs/aumentar-def-2.webp', label: '+60% Defensa' },
  'def_2': { path: '/assets/buffs/aumentar-def-2.webp', label: '+60% Defensa' },
  'def_1': { path: '/assets/buffs/aumentar-def-1.webp', label: '+30% Defensa' },

  // Aumentar Ataque (Increase ATK)
  'atk-buff': { path: '/assets/buffs/aumentar-atk-2.webp', label: '+50% Ataque' },
  'atkup': { path: '/assets/buffs/aumentar-atk-2.webp', label: '+50% Ataque' },
  'atk_2': { path: '/assets/buffs/aumentar-atk-2.webp', label: '+50% Ataque' },
  'atk_1': { path: '/assets/buffs/aumentar-atk-1.webp', label: '+25% Ataque' },

  // Fortalecer (Strengthen)
  'strengthen': { path: '/assets/buffs/fortalecer-2.webp', label: 'Fortalecer (25%)' },
  'strengthen_2': { path: '/assets/buffs/fortalecer-2.webp', label: 'Fortalecer (25%)' },
  'fortalecer': { path: '/assets/buffs/fortalecer-2.webp', label: 'Fortalecer (25%)' },
  'fortalecer-2': { path: '/assets/buffs/fortalecer-2.webp', label: 'Fortalecer (25%)' },
  'str': { path: '/assets/buffs/fortalecer-2.webp', label: 'Fortalecer (25%)' },
  'strengthen_1': { path: '/assets/buffs/fortalecer-1.webp', label: 'Fortalecer (15%)' },
  'fortalecer-1': { path: '/assets/buffs/fortalecer-1.webp', label: 'Fortalecer (15%)' },

  // Protección de Aliados (Ally Protection)
  'ally-protect': { path: '/assets/buffs/proteccion-de-aliado-2.webp', label: 'Protección de Aliados (50%)' },
  'ally_protect_2': { path: '/assets/buffs/proteccion-de-aliado-2.webp', label: 'Protección de Aliados (50%)' },
  'ally_protect_1': { path: '/assets/buffs/proteccion-de-aliado-1.webp', label: 'Protección de Aliados (25%)' },

  // Curación Continua (Continuous Heal)
  'continuous-heal': { path: '/assets/buffs/curacion-continua-2.webp', label: 'Curación Continua (15%)' },
  'heal_2': { path: '/assets/buffs/curacion-continua-2.webp', label: 'Curación Continua (15%)' },
  'heal_1': { path: '/assets/buffs/curacion-continua-1.webp', label: 'Curación Continua (7.5%)' },

  // Contraataque y Revivir
  'counterattack': { path: '/assets/buffs/contraataque.webp', label: 'Contraataque' },
  'contraataque': { path: '/assets/buffs/contraataque.webp', label: 'Contraataque' },
  'revive_on_death': { path: '/assets/buffs/revivir-al-morir.webp', label: 'Revivir al Morir' },
  'revivir': { path: '/assets/buffs/revivir-al-morir.webp', label: 'Revivir al Morir' },

  // Velo y Velo Perfecto
  'pveil': { path: '/assets/buffs/velo-perfecto.webp', label: 'Velo Perfecto' },
  'velo-perfecto': { path: '/assets/buffs/velo-perfecto.webp', label: 'Velo Perfecto' },
  'veil': { path: '/assets/buffs/velo.webp', label: 'Velo' },
  'velo': { path: '/assets/buffs/velo.webp', label: 'Velo' },

  // Otros Bufos Nativos
  'stone_skin': { path: '/assets/buffs/piel-de-piedra.webp', label: 'Piel de Piedra' },
  'piel-de-piedra': { path: '/assets/buffs/piel-de-piedra.webp', label: 'Piel de Piedra' },
  'reflect_damage': { path: '/assets/buffs/reflejar-dano-2.webp', label: 'Reflejar Daño (30%)' },
  'reflejar-dano': { path: '/assets/buffs/reflejar-dano-2.webp', label: 'Reflejar Daño (30%)' },
  'crate_2': { path: '/assets/buffs/aumentar-p-crit-2.webp', label: '+30% Prob. Crítica' },
  'crate_1': { path: '/assets/buffs/aumentar-p-crit-1.webp', label: '+15% Prob. Crítica' },
  'cdmg_2': { path: '/assets/buffs/aumentar-d-crit-2.webp', label: '+30% Daño Crítico' },
  'cdmg_1': { path: '/assets/buffs/aumentar-d-crit-1.webp', label: '+15% Daño Crítico' },
  'acc_2': { path: '/assets/buffs/aumentar-punt-2.webp', label: '+50% Puntería' },
  'acc_1': { path: '/assets/buffs/aumentar-punt-1.webp', label: '+25% Puntería' },
  'taunt': { path: '/assets/buffs/burlon.webp', label: 'Burlón' },
  'burlon': { path: '/assets/buffs/burlon.webp', label: 'Burlón' },
  'guardia-total': { path: '/assets/buffs/guardia-total.webp', label: 'Guardia Total' },

  // =====================
  // DEBUFOS OFICIALES (Imágenes nativas rojas)
  // =====================
  'speed-debuff': { path: '/assets/buffs/red-vel-2.webp', label: '-30% Velocidad' },
  'speeddown': { path: '/assets/buffs/red-vel-2.webp', label: '-30% Velocidad' },
  'red-vel': { path: '/assets/buffs/red-vel-2.webp', label: '-30% Velocidad' },
  'red-vel-1': { path: '/assets/buffs/red-vel-1.webp', label: '-15% Velocidad' },
  'red-vel-2': { path: '/assets/buffs/red-vel-2.webp', label: '-30% Velocidad' },

  'def-debuff': { path: '/assets/buffs/red-def-2.webp', label: '-60% Defensa' },
  'defdown': { path: '/assets/buffs/red-def-2.webp', label: '-60% Defensa' },
  'red-def': { path: '/assets/buffs/red-def-2.webp', label: '-60% Defensa' },
  'red-def-1': { path: '/assets/buffs/red-def-1.webp', label: '-30% Defensa' },
  'red-def-2': { path: '/assets/buffs/red-def-2.webp', label: '-60% Defensa' },

  'atk-debuff': { path: '/assets/buffs/red-atk-2.webp', label: '-50% Ataque' },
  'atkdown': { path: '/assets/buffs/red-atk-2.webp', label: '-50% Ataque' },
  'red-atk': { path: '/assets/buffs/red-atk-2.webp', label: '-50% Ataque' },
  'red-atk-1': { path: '/assets/buffs/red-atk-1.webp', label: '-25% Ataque' },
  'red-atk-2': { path: '/assets/buffs/red-atk-2.webp', label: '-50% Ataque' },

  'weaken': { path: '/assets/buffs/debilitar-2.webp', label: 'Debilitar (+25% daño recibido)' },
  'weak': { path: '/assets/buffs/debilitar-2.webp', label: 'Debilitar (+25% daño recibido)' },
  'debilitar': { path: '/assets/buffs/debilitar-2.webp', label: 'Debilitar (+25% daño recibido)' },

  'poison': { path: '/assets/buffs/veneno-2.webp', label: 'Veneno (5%)' },
  'veneno': { path: '/assets/buffs/veneno-2.webp', label: 'Veneno (5%)' },
  'hp-burn': { path: '/assets/buffs/quemar-hp.webp', label: 'Quemar HP' },
  'quemar-hp': { path: '/assets/buffs/quemar-hp.webp', label: 'Quemar HP' },
  'stun': { path: '/assets/buffs/aturdir.webp', label: 'Aturdir' },
  'aturdir': { path: '/assets/buffs/aturdir.webp', label: 'Aturdir' },
  'sleep': { path: '/assets/buffs/dormir.webp', label: 'Dormir' },
  'freeze': { path: '/assets/buffs/congelar.webp', label: 'Congelar' },
  'provoke': { path: '/assets/buffs/incitar.webp', label: 'Incitar' },
  'incitar': { path: '/assets/buffs/incitar.webp', label: 'Incitar' },
  'block-buffs': { path: '/assets/buffs/bloquear-bufos.webp', label: 'Bloquear Bufos' },
  'block_buffs': { path: '/assets/buffs/bloquear-bufos.webp', label: 'Bloquear Bufos' },
  'blockbuff': { path: '/assets/buffs/bloquear-bufos.webp', label: 'Bloquear Bufos' },
  'bloquear-bufos': { path: '/assets/buffs/bloquear-bufos.webp', label: 'Bloquear Bufos' },
  'block-active-skills': { path: '/assets/buffs/bloquear-habilidades-activas.webp', label: 'Bloquear Habilidades Activas' },
  'block_active_skills': { path: '/assets/buffs/bloquear-habilidades-activas.webp', label: 'Bloquear Habilidades Activas' },
  'bloquear-habilidades-activas': { path: '/assets/buffs/bloquear-habilidades-activas.webp', label: 'Bloquear Habilidades Activas' },
  'block-passive-skills': { path: '/assets/buffs/bloquear-habilidades-pasivas.webp', label: 'Bloquear Habilidades Pasivas' },
  'bomb': { path: '/assets/buffs/bomba.webp', label: 'Bomba' },
  'leech': { path: '/assets/buffs/chupar-vida.webp', label: 'Chupar Vida' },
  'poison-sensitivity': { path: '/assets/buffs/sensibilidad-al-veneno-2.webp', label: 'Sensibilidad al Veneno (25%)' },
  'poison_sense': { path: '/assets/buffs/sensibilidad-al-veneno-2.webp', label: 'Sensibilidad al Veneno (25%)' },
  'poison_sensitivity': { path: '/assets/buffs/sensibilidad-al-veneno-2.webp', label: 'Sensibilidad al Veneno (25%)' },
  'sensibilidad-al-veneno': { path: '/assets/buffs/sensibilidad-al-veneno-2.webp', label: 'Sensibilidad al Veneno (25%)' },
  'sensibilidad-al-veneno-2': { path: '/assets/buffs/sensibilidad-al-veneno-2.webp', label: 'Sensibilidad al Veneno (25%)' },
  'hex': { path: '/assets/buffs/maleficio.webp', label: 'Maleficio' },
  'fear': { path: '/assets/buffs/miedo.webp', label: 'Miedo' },
  'true-fear': { path: '/assets/buffs/miedo-de-verdad.webp', label: 'Miedo de Verdad' },
};

export const RaidBuffIcon: React.FC<RaidBuffIconProps> = ({
  name,
  type = 'buff',
  duration = 0,
  size = 'sm',
  showDuration = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const cleanName = (name || '').toLowerCase();
  const matched = BUFF_IMAGE_MAP[cleanName] ||
    Object.entries(BUFF_IMAGE_MAP).find(([k]) => cleanName.includes(k))?.[1] || {
      path: '/assets/buffs/aumentar-vel-2.webp',
      label: name,
    };

  const isDebuff = type === 'debuff' || cleanName.includes('debuff') || cleanName.includes('down') || cleanName.includes('red-');
  const isExpiring = duration === 1;

  // Sizing
  const px = size === 'xs' ? 18 : size === 'md' ? 28 : 22;

  const tooltipText = `${matched.label}${
    duration > 0
      ? ` — ${duration} turno${duration === 1 ? ' restante (⚠️ ¡Expira al terminar este turno!)' : 's restantes'}`
      : ''
  }`;

  return (
    <div
      className={`raid-buff-container ${isDebuff ? 'debuff' : 'buff'} ${isExpiring ? 'expiring' : ''}`}
      style={{
        position: 'relative',
        width: `${px}px`,
        height: `${px}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        borderRadius: '3px',
      }}
      title={tooltipText}
    >
      {!imgError ? (
        <img
          src={matched.path}
          alt={matched.label}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            borderRadius: '3px',
          }}
          loading="lazy"
        />
      ) : (
        <span style={{ fontSize: '0.7rem' }}>{isDebuff ? '🔻' : '⚡'}</span>
      )}

      {/* In-game Turn Counter Badge (Overlay at bottom-right corner) */}
      {showDuration && duration > 0 && (
        <span
          className="raid-buff-counter"
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-3px',
            fontSize: size === 'xs' ? '8px' : '9.5px',
            fontWeight: 800,
            lineHeight: 1,
            color: isExpiring ? '#fca5a5' : '#ffffff',
            backgroundColor: isExpiring ? 'rgba(220, 38, 38, 0.9)' : 'rgba(0, 0, 0, 0.85)',
            border: `1px solid ${isExpiring ? '#ef4444' : 'rgba(255, 255, 255, 0.3)'}`,
            padding: '1px 2px',
            borderRadius: '2px',
            fontFamily: 'monospace',
            textShadow: '0 1px 2px #000000',
            userSelect: 'none',
          }}
        >
          {duration}
        </span>
      )}
    </div>
  );
};
