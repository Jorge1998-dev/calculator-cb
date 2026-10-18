function detectChampionAura(champ) {
  if (!champ) return { hasAura: false, type: "none", percent: 0, description: "Sin campe\xF3n" };
  const auraSkill = champ.skills?.find(
    (s) => s.name.toLowerCase() === "aura" || s.description.toLowerCase().includes("aura")
  );
  if (!auraSkill) {
    return { hasAura: false, type: "none", percent: 0, description: "Este campe\xF3n no posee Aura" };
  }
  const desc = auraSkill.description.toLowerCase();
  let type = "none";
  let percent = 0;
  const effectObj = Array.isArray(auraSkill.effect) ? auraSkill.effect[0] : auraSkill.effect;
  if (effectObj && typeof effectObj === "object" && "amount" in effectObj && typeof effectObj.amount === "number") {
    percent = effectObj.amount;
  } else {
    const match = auraSkill.description.match(/(\d+)%/);
    if (match) {
      percent = parseInt(match[1], 10);
    } else {
      const flatMatch = auraSkill.description.match(/(\d+)/);
      if (flatMatch) percent = parseInt(flatMatch[1], 10);
    }
  }
  if (desc.includes("speed") || desc.includes("spd") || desc.includes("velocidad")) {
    type = "spd";
  } else if (desc.includes("defence") || desc.includes("defense") || desc.includes("defensa")) {
    type = "def";
  } else if (desc.includes("health") || desc.includes("hp") || desc.includes("vida")) {
    type = "hp";
  } else if (desc.includes("attack") || desc.includes("atk") || desc.includes("ataque")) {
    type = "atk";
  } else if (desc.includes("accuracy") || desc.includes("acc") || desc.includes("punter\xEDa") || desc.includes("punteria")) {
    type = "acc";
  } else if (desc.includes("resistance") || desc.includes("res") || desc.includes("resistencia")) {
    type = "res";
  } else if (desc.includes("critical") || desc.includes("crit") || desc.includes("cr\xEDtico") || desc.includes("critico")) {
    type = "crate";
  }
  return {
    hasAura: type !== "none",
    type,
    percent,
    description: auraSkill.description
  };
}
export {
  detectChampionAura
};
