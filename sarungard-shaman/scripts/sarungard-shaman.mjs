const PROGRESSION = "shaman";
const SPELL_METHOD = "spell";
const NATURAL_ARMOR = "shamanNatural";

const SHAMAN_SLOT_TABLE = [
  [],
  [2],
  [2],
  [2, 1],
  [2, 1],
  [2, 1, 1],
  [3, 1, 1],
  [3, 2, 1],
  [3, 2, 1, 1],
  [3, 2, 1, 1],
  [3, 2, 2, 1],
  [4, 3, 2, 1, 1],
  [4, 3, 2, 2, 1],
  [4, 3, 3, 2, 1],
  [4, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 1, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1]
];

Hooks.once("init", registerShamanProgression);
Hooks.once("init", registerNaturalArmor);
Hooks.on("dnd5e.computeSpellProgression", computeShamanProgression);
Hooks.on("dnd5e.prepareSpellSlots", prepareShamanSlots);
Hooks.on("preCreateItem", assignShamanProgression);

function registerShamanProgression() {
  CONFIG.DND5E.spellcasting[SPELL_METHOD].progression[PROGRESSION] = {
    label: "Shaman (own table, 2/3 when multiclassed)",
    divisor: 1
  };
}

function computeShamanProgression(progression, actor, cls, spellcasting, count) {
  if ( spellcasting?.progression !== PROGRESSION ) return;
  if ( count > 1 ) progression[SPELL_METHOD] += multiclassCasterLevels(spellcasting.levels);
  return false;
}

function multiclassCasterLevels(shamanLevels) {
  return Math.floor((shamanLevels * 2) / 3);
}

function prepareShamanSlots(spells, actor, progression) {
  const shaman = soleShamanSpellcasting(actor);
  if ( !shaman ) return;
  applySlotRow(spells, shamanSlotRow(shaman.levels));
  return false;
}

function soleShamanSpellcasting(actor) {
  const casters = actor?.itemTypes?.class?.filter(cls => cls.spellcasting?.type === SPELL_METHOD) ?? [];
  if ( casters.length !== 1 ) return null;
  const spellcasting = casters[0].spellcasting;
  return spellcasting.progression === PROGRESSION ? spellcasting : null;
}

function shamanSlotRow(levels) {
  const level = Math.clamp(Number(levels) || 0, 0, SHAMAN_SLOT_TABLE.length);
  return level ? SHAMAN_SLOT_TABLE[level - 1] : [];
}

function applySlotRow(spells, row) {
  const model = CONFIG.DND5E.spellcasting[SPELL_METHOD];
  for ( const level of Array.fromRange(Object.keys(CONFIG.DND5E.spellLevels).length - 1, 1) ) {
    const slot = spells[model.getSpellSlotKey(level)] ??= { value: 0 };
    slot.label = model.getLabel({ level });
    slot.level = level;
    slot.max = Number.isNumeric(slot.override) ? Math.max(parseInt(slot.override), 0) : row[level - 1] ?? 0;
    slot.type = model.key;
  }
}

function assignShamanProgression(item) {
  if ( (item.type !== "class") || (item.system.identifier !== PROGRESSION) ) return;
  if ( item.system.spellcasting?.progression !== "none" ) return;
  item.updateSource({ "system.spellcasting.progression": PROGRESSION, "system.spellcasting.ability": "wis" });
}

function registerNaturalArmor() {
  CONFIG.DND5E.armorClasses[NATURAL_ARMOR] = {
    label: "Natural Armor (Shaman)",
    formula: "@attributes.ac.armor + @attributes.ac.clamped.con",
    armored: true
  };
}
