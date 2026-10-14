/**
 * Icon Registry for Raid: Shadow Legends Buffs & Debuffs
 * 
 * Automatically discovers, registers, and serves all icons located in `src/assets/icons/`.
 * If an icon is not registered/available, smoothly falls back to the configured default icon.
 */

// Dynamically import all webp, png, and svg icons located in `src/assets/icons/` via Vite
const iconModules = import.meta.glob<string>(
  '/src/assets/icons/*.{webp,png,svg}',
  { eager: true, import: 'default' }
);

// Map normalized filename (without directory and extension) to Vite's resolved asset URL
const REGISTERED_ICONS = new Map<string, string>();

for (const [path, url] of Object.entries(iconModules)) {
  const match = path.match(/\/([^/]+)\.(?:webp|png|svg)$/i);
  if (match) {
    const filename = match[1].toLowerCase();
    REGISTERED_ICONS.set(filename, url);
  }
}

// Configured default icons
export const DEFAULT_BUFF_ICON: string =
  REGISTERED_ICONS.get('default-buff') || '/assets/buffs/default-buff.svg';

export const DEFAULT_DEBUFF_ICON: string =
  REGISTERED_ICONS.get('default-debuff') || '/assets/buffs/default-debuff.svg';

export interface BuffIconResolution {
  /** The final URL to display (either the registered icon or the default configured icon) */
  url: string;
  /** Whether this icon was found among the registered icons */
  isRegistered: boolean;
  /** Friendly human-readable label */
  label: string;
  /** Whether this effect is classified as a debuff */
  isDebuff: boolean;
}

// Canonical human-readable labels for known effects
const EFFECT_LABELS: Record<string, string> = {
  'escudo-habilidad': 'Escudo (Habilidad)',
  'escudo-set': 'Escudo (Set)',
  'escudo-de-magma': 'Escudo de Magma',
  'interceptar': 'Inmutable (Interceptar)',
  'bloquear-dano': 'Bloquear Daño',
  'inmortal': 'Inmortal (Unkillable)',
  'bloquear-debufos': 'Bloquear Debufos',
  'bloquear-bufos': 'Bloquear Bufos',
  'aumentar-vel-2': '+30% Velocidad',
  'aumentar-vel-1': '+15% Velocidad',
  'aumentar-def-2': '+60% Defensa',
  'aumentar-def-1': '+30% Defensa',
  'aumentar-atk-2': '+50% Ataque',
  'aumentar-atk-1': '+25% Ataque',
  'fortalecer-2': 'Fortalecer (25%)',
  'fortalecer-1': 'Fortalecer (15%)',
  'proteccion-de-aliado-2': 'Protección de Aliados (50%)',
  'proteccion-de-aliado-1': 'Protección de Aliados (25%)',
  'curacion-continua-2': 'Curación Continua (15%)',
  'curacion-continua-1': 'Curación Continua (7.5%)',
  'contraataque': 'Contraataque',
  'revivir-al-morir': 'Revivir al Morir',
  'velo-perfecto': 'Velo Perfecto',
  'velo': 'Velo',
  'aumentar-p-crit-2': '+30% Prob. Crítica',
  'aumentar-p-crit-1': '+15% Prob. Crítica',
  'aumentar-d-crit-2': '+30% Daño Crítico',
  'aumentar-d-crit-1': '+15% Daño Crítico',
  'aumentar-punt-2': '+50% Puntería',
  'aumentar-punt-1': '+25% Puntería',
  'reflejar-dano-2': 'Reflejar Daño (30%)',
  'reflejar-dano-1': 'Reflejar Daño (15%)',
};

// Aliases mapping game/technical names to the registered icon filenames
const ALIAS_TO_FILENAME: Record<string, string> = {
  // Shields
  'shield': 'escudo-habilidad',
  'escudo': 'escudo-habilidad',
  'shield-skill': 'escudo-habilidad',
  'shield-set': 'escudo-set',
  'divine_shield': 'escudo-set',
  'shield_alt': 'escudo-set',
  'escudo-de-magma': 'escudo-de-magma',
  'magma_shield': 'escudo-de-magma',

  // Immuntability / Intercept
  'intercept': 'interceptar',
  'inmutable': 'interceptar',
  'interceptar': 'interceptar',

  // Block Damage & Unkillable
  'block-damage': 'bloquear-dano',
  'block_damage': 'bloquear-dano',
  'block_dmg': 'bloquear-dano',
  'bloquear-dano': 'bloquear-dano',
  'unkillable': 'inmortal',
  'inmortal': 'inmortal',

  // Block Debuffs & Block Buffs
  'block-debuffs': 'bloquear-debufos',
  'block_debuffs': 'bloquear-debufos',
  'block_debuff': 'bloquear-debufos',
  'bloquear-debufos': 'bloquear-debufos',
  'block-buffs': 'bloquear-bufos',
  'block_buffs': 'bloquear-bufos',
  'blockbuff': 'bloquear-bufos',
  'bloquear-bufos': 'bloquear-bufos',

  // Speed
  'speed-buff': 'aumentar-vel-2',
  'speedup': 'aumentar-vel-2',
  'spd_2': 'aumentar-vel-2',
  'aumentar-vel-2': 'aumentar-vel-2',
  'aumentar-vel': 'aumentar-vel-2',
  'spd_1': 'aumentar-vel-1',
  'aumentar-vel-1': 'aumentar-vel-1',

  // Defense
  'def-buff': 'aumentar-def-2',
  'defup': 'aumentar-def-2',
  'def_2': 'aumentar-def-2',
  'aumentar-def-2': 'aumentar-def-2',
  'aumentar-def': 'aumentar-def-2',
  'def_1': 'aumentar-def-1',
  'aumentar-def-1': 'aumentar-def-1',

  // Attack
  'atk-buff': 'aumentar-atk-2',
  'atkup': 'aumentar-atk-2',
  'atk_2': 'aumentar-atk-2',
  'aumentar-atk-2': 'aumentar-atk-2',
  'aumentar-atk': 'aumentar-atk-2',
  'atk_1': 'aumentar-atk-1',
  'aumentar-atk-1': 'aumentar-atk-1',

  // Strengthen
  'strengthen': 'fortalecer-2',
  'strengthen_2': 'fortalecer-2',
  'fortalecer': 'fortalecer-2',
  'fortalecer-2': 'fortalecer-2',
  'str': 'fortalecer-2',
  'strengthen_1': 'fortalecer-1',
  'fortalecer-1': 'fortalecer-1',

  // Ally Protection
  'ally-protect': 'proteccion-de-aliado-2',
  'ally_protect_2': 'proteccion-de-aliado-2',
  'proteccion-de-aliado': 'proteccion-de-aliado-2',
  'proteccion-de-aliado-2': 'proteccion-de-aliado-2',
  'ally_protect_1': 'proteccion-de-aliado-1',
  'proteccion-de-aliado-1': 'proteccion-de-aliado-1',

  // Continuous Heal
  'continuous-heal': 'curacion-continua-2',
  'heal_2': 'curacion-continua-2',
  'curacion-continua': 'curacion-continua-2',
  'curacion-continua-2': 'curacion-continua-2',
  'heal_1': 'curacion-continua-1',
  'curacion-continua-1': 'curacion-continua-1',

  // Counterattack & Revive on Death
  'counterattack': 'contraataque',
  'contraataque': 'contraataque',
  'revive_on_death': 'revivir-al-morir',
  'revivir': 'revivir-al-morir',
  'revivir-al-morir': 'revivir-al-morir',

  // Veil & Perfect Veil
  'pveil': 'velo-perfecto',
  'velo-perfecto': 'velo-perfecto',
  'veil': 'velo',
  'velo': 'velo',

  // Critical Rate & Critical Damage
  'crate_2': 'aumentar-p-crit-2',
  'aumentar-p-crit-2': 'aumentar-p-crit-2',
  'aumentar-p-crit': 'aumentar-p-crit-2',
  'crate_1': 'aumentar-p-crit-1',
  'aumentar-p-crit-1': 'aumentar-p-crit-1',
  'cdmg_2': 'aumentar-d-crit-2',
  'aumentar-d-crit-2': 'aumentar-d-crit-2',
  'aumentar-d-crit': 'aumentar-d-crit-2',
  'cdmg_1': 'aumentar-d-crit-1',
  'aumentar-d-crit-1': 'aumentar-d-crit-1',

  // Accuracy
  'acc_2': 'aumentar-punt-2',
  'aumentar-punt-2': 'aumentar-punt-2',
  'aumentar-punt': 'aumentar-punt-2',
  'acc_1': 'aumentar-punt-1',
  'aumentar-punt-1': 'aumentar-punt-1',

  // Reflect Damage
  'reflect_damage': 'reflejar-dano-2',
  'reflect_damage_2': 'reflejar-dano-2',
  'reflejar-dano': 'reflejar-dano-2',
  'reflejar-dano-2': 'reflejar-dano-2',
  'reflect_damage_1': 'reflejar-dano-1',
  'reflejar-dano-1': 'reflejar-dano-1',
};

/**
 * Checks if a given effect name is classified as a debuff.
 */
export function isDebuffEffect(name: string, type?: 'buff' | 'debuff'): boolean {
  if (type === 'debuff') return true;
  const clean = (name || '').toLowerCase();
  return (
    clean.includes('debuff') ||
    clean.includes('down') ||
    clean.includes('red-') ||
    clean.includes('reduccion') ||
    clean.includes('poison') ||
    clean.includes('veneno') ||
    clean.includes('burn') ||
    clean.includes('quemar') ||
    clean.includes('stun') ||
    clean.includes('aturdir') ||
    clean.includes('sleep') ||
    clean.includes('dormir') ||
    clean.includes('freeze') ||
    clean.includes('congelar') ||
    clean.includes('provoke') ||
    clean.includes('incitar') ||
    clean.includes('weaken') ||
    clean.includes('debilitar') ||
    clean.includes('hex') ||
    clean.includes('maleficio') ||
    clean.includes('bomba') ||
    clean.includes('bomb') ||
    clean.includes('leech') ||
    clean.includes('chupar-vida') ||
    clean.includes('bloquear-bufos') ||
    clean.includes('block-buffs')
  );
}

/**
 * Resolves an icon URL for a given buff/debuff.
 * Uses the registered icons in `src/assets/icons/` whenever available.
 * If not available/registered, gracefully returns the default configured icon.
 */
export function resolveRaidBuffIcon(
  rawName: string,
  type?: 'buff' | 'debuff',
  customDefaultUrl?: string
): BuffIconResolution {
  const clean = (rawName || '').trim().toLowerCase();
  const isDebuff = isDebuffEffect(clean, type);

  // 1. Try direct registered filename match
  if (REGISTERED_ICONS.has(clean)) {
    return {
      url: REGISTERED_ICONS.get(clean)!,
      isRegistered: true,
      label: EFFECT_LABELS[clean] || rawName,
      isDebuff,
    };
  }

  // 2. Try alias map
  const targetFile = ALIAS_TO_FILENAME[clean];
  if (targetFile && REGISTERED_ICONS.has(targetFile)) {
    return {
      url: REGISTERED_ICONS.get(targetFile)!,
      isRegistered: true,
      label: EFFECT_LABELS[targetFile] || rawName,
      isDebuff,
    };
  }

  // 3. Try partial substring matching against alias map
  const partialEntry = Object.entries(ALIAS_TO_FILENAME).find(
    ([alias]) => clean.includes(alias) || alias.includes(clean)
  );
  if (partialEntry && REGISTERED_ICONS.has(partialEntry[1])) {
    const filename = partialEntry[1];
    return {
      url: REGISTERED_ICONS.get(filename)!,
      isRegistered: true,
      label: EFFECT_LABELS[filename] || rawName,
      isDebuff,
    };
  }

  // 4. Icon is NOT in registered icons -> Fallback to the configured default icon
  const defaultUrl = customDefaultUrl || (isDebuff ? DEFAULT_DEBUFF_ICON : DEFAULT_BUFF_ICON);

  return {
    url: defaultUrl,
    isRegistered: false,
    label: rawName || (isDebuff ? 'Debufo' : 'Bufo'),
    isDebuff,
  };
}

/**
 * Returns a list of all icon keys currently registered in `src/assets/icons/`.
 */
export function getRegisteredIconKeys(): string[] {
  return Array.from(REGISTERED_ICONS.keys());
}
