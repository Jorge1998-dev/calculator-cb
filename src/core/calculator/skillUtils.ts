import type { ChampionData, SkillConfig } from '../../types';

/**
 * Parses and categorizes champion skills from datamined compendium:
 * 1. Filters out phantom internal engine skills (e.g. 'Skill 47105 name') and Auras.
 * 2. Distinguishes active turn-based skills (A1, A2, A3, A4) from situational passive skills (P1).
 * 3. Sets isPassive: true on passives, preventing active turn priority requirements.
 * 4. Initializes booked cooldowns and priorities.
 */
export function parseChampionSkills(champ: ChampionData | null): SkillConfig[] {
  if (!champ || !champ.skills || champ.skills.length === 0) {
    return [
      { id: 'A1', alias: 'A1', name: 'A1: Ataque Básico', priority: 1, cooldown: 0, delay: 0, isPassive: false, disabled: false, isOpener: false },
      { id: 'A2', alias: 'A2', name: 'A2: Habilidad Especial 1', priority: 2, cooldown: 3, delay: 0, isPassive: false, disabled: false, isOpener: false },
      { id: 'A3', alias: 'A3', name: 'A3: Habilidad Especial 2', priority: 3, cooldown: 4, delay: 0, isPassive: false, disabled: false, isOpener: false },
    ];
  }

  // Filter out auras and internal placeholders
  const validSkills = champ.skills.filter((s) => {
    if (!s || !s.name) return false;
    const name = s.name.trim().toLowerCase();
    const desc = (s.description || '').toLowerCase();
    if (name === 'aura' || desc.includes('aura')) return false;
    if (/^skill \d+ name$/i.test(name)) return false;
    if (/^skill \d+ description$/i.test(desc)) return false;
    return true;
  });

  const parsed: SkillConfig[] = [];
  let activeIdx = 1;
  let passiveIdx = 1;

  for (const s of validSkills) {
    const nameLower = s.name.toLowerCase();
    const descLower = (s.description || '').toLowerCase();

    const isPassive =
      nameLower.includes('passive') ||
      nameLower.includes('[passive]') ||
      (Array.isArray(s.passive) && s.passive.length > 0) ||
      (Array.isArray(s.damage_based_on) && s.damage_based_on.includes('Passive')) ||
      descLower.startsWith('passive effect') ||
      descLower.startsWith('passive:') ||
      descLower.startsWith('passive');

    if (isPassive) {
      parsed.push({
        id: `P${passiveIdx}`,
        alias: `P${passiveIdx}`,
        name: s.name,
        priority: 0,
        cooldown: s.booked_cooldown || s.cooldown || 0,
        delay: 0,
        isPassive: true,
        disabled: false,
        isOpener: false,
      });
      passiveIdx++;
    } else {
      if (activeIdx <= 4) {
        const dmgBasedOn = Array.isArray(s.damage_based_on) ? s.damage_based_on.map((x) => String(x).toUpperCase().trim()) : [];
        let statScaling: import('../../types').DamageStatScaling | undefined;
        const hasDef = dmgBasedOn.some((d) => d.includes('DEF'));
        const hasHp = dmgBasedOn.some((d) => d.includes('HP'));
        const hasAtk = dmgBasedOn.some((d) => d.includes('ATK'));
        if (hasDef && hasHp) statScaling = 'DEF_HP';
        else if (hasAtk && hasDef) statScaling = 'ATK_DEF';
        else if (hasAtk && hasHp) statScaling = 'ATK_HP';
        else if (hasDef) statScaling = 'DEF';
        else if (hasHp) statScaling = 'HP';
        else if (hasAtk) statScaling = 'ATK';

        parsed.push({
          id: `A${activeIdx}`,
          alias: `A${activeIdx}`,
          name: s.name,
          priority: activeIdx === 1 ? 1 : activeIdx,
          cooldown: s.booked_cooldown || s.cooldown || 0,
          delay: 0,
          isPassive: false,
          disabled: false,
          isOpener: false,
          damageBasedOn: dmgBasedOn,
          damageStat: statScaling,
        });
        activeIdx++;
      }
    }
  }

  return parsed.length > 0 ? parsed : [
    { id: 'A1', alias: 'A1', name: 'A1: Ataque Básico', priority: 1, cooldown: 0, delay: 0, isPassive: false, disabled: false, isOpener: false },
  ];
}
