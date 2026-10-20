import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SRC = "SarungardIceborn";
const SHAMAN_SRC = "SarungardShaman";
const CLASS = "Sorcerer";
const CLASS_SRC = "PHB";
const SHORT = "Iceborn";
const BREW_VERSION = "1.0.0";
const PUBLISHED_AT = Math.floor(Date.now() / 1000);
const OUT_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "Sarungard; Iceborn.json");

const scf = (name, level) => `${name}|${CLASS}|${CLASS_SRC}|${SHORT}|${SRC}|${level}`;
const SORCERY_POINTS_UID = "Sorcery Points|Sorcerer|PHB|2";

const recovery = (...periods) => periods.map(period => ({ period, type: "recoverAll" }));
const usesSystem = (max, ...periods) => ({ "uses.max": max, "uses.recovery": recovery(...periods) });
const ownUses = (value = "1") => ({ type: "itemUses", value: String(value) });
const sorceryPoints = (value, scaling) => ({
  type: "itemUses", value: String(value), target: { prop: "classFeature", uid: SORCERY_POINTS_UID },
  ...(scaling ? { scaling } : {})
});
const fromSorcererLevel = min => ({ visibility: { identifier: "sorcerer", level: { min } } });
const sideData = (name, level, extra) => ({
  name, source: SRC, className: CLASS, classSource: CLASS_SRC, subclassShortName: SHORT, subclassSource: SRC, level,
  ignoreSrdActivities: true, ignoreSrdEffects: true, migrationVersion: 3, ...extra
});
const oneRoundEffect = (foundryId, name, description, changes = []) => ({
  foundryId, name, description, duration: { rounds: 1 }, ...(changes.length ? { changes } : {})
});
const list = items => ({ type: "list", items });
const feature = (name, level, entries, extra = {}) => ({
  name, source: SRC, page: 2, className: CLASS, classSource: CLASS_SRC, subclassShortName: SHORT, subclassSource: SRC, level,
  ...(level === 1 && name !== SHORT ? { header: 1 } : {}), entries, ...extra
});

const ORIGIN_SPELLS = {
  1: ["cold outburst|sarungardshaman", "ice knife|xge"],
  3: ["ice fan|sarungardshaman", "winter blast|sarungardshaman"],
  5: ["hail strike|sarungardshaman", "sleet storm"],
  7: ["cryogenic stasis|sarungardshaman", "ice storm"],
  9: ["cone of cold", "hail storm|sarungardshaman"]
};
const spellTag = uid => {
  const [name, source] = uid.split("|");
  const display = name.replace(/\b\w/g, c => c.toUpperCase());
  return source ? `{@spell ${name}|${source === "sarungardshaman" ? SHAMAN_SRC : source.toUpperCase()}|${display}}` : `{@spell ${name}}`;
};
const ordinal = n => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

const meta = {
  sources: [{
    json: SRC, abbreviation: "ICEB", full: "Iceborn (Sarungard)",
    authors: ["Sarungard"], convertedBy: ["Claudius"], version: BREW_VERSION, color: "5b8fb9"
  }],
  edition: "classic",
  dateAdded: Date.UTC(2026, 9, 20) / 1000,
  dateLastModified: PUBLISHED_AT
};

const subclass = {
  name: "Iceborn", shortName: SHORT, source: SRC, className: CLASS, classSource: CLASS_SRC, page: 2, edition: "classic",
  additionalSpells: [{ known: ORIGIN_SPELLS }],
  subclassFeatures: [scf(SHORT, 1), scf("Cold Capsule", 6), scf("Curse of Winter", 14), scf("Icicle Storm", 18)],
  foundrySystem: { identifier: "iceborn" }
};

const subclassFeatures = [
  feature(SHORT, 1, [
    "A more chilling sorcerous origin for the cool guys.",
    ...["Spell List", "Lingering Chill", "Arctic Outburst"].map(name => ({ type: "refSubclassFeature", subclassFeature: scf(name, 1) }))
  ]),
  feature("Spell List", 1, [
    "Starting at 1st level, you learn additional spells when you reach certain levels in this class, as shown on the Origin Spells table. Each of these spells counts as a sorcerer spell for you, but it doesn't count against the number of sorcerer spells you know.",
    {
      type: "table", caption: "Origin Spells",
      colLabels: ["Sorcerer Level", "Spells"], colStyles: ["col-3 text-center", "col-9"],
      rows: Object.entries(ORIGIN_SPELLS).map(([lvl, uids]) => [ordinal(Number(lvl)), uids.map(spellTag).join(", ")])
    }
  ]),
  feature("Lingering Chill", 1, [
    "Starting at 1st level, when you deal cold damage with a spell or sorcerer feature, you can choose one of the creatures that took damage this way and apply one of the following effects to it. You gain more options when you reach certain levels in this class, as shown below:",
    list([
      "The target's speed is also reduced by 15 feet until the end of your next turn. If the spell or sorcerer feature already reduces the target's speed, use whichever reduction is greater.",
      "The target can't take reactions until the end of your next turn.",
      "{@b (6th Level)} The target has disadvantage on the next attack roll it makes before the end of its next turn.",
      "{@b (14th Level)} The target has vulnerability to cold damage until the end of your next turn. If it has resistance to cold damage, that resistance is suspended for the duration."
    ]),
    "You can use this feature a number of times equal to your Charisma modifier (minimum of once). You regain all expended uses when you finish a short or long rest. Additionally, you can expend 1 sorcery point to regain one use of this feature."
  ]),
  feature("Arctic Outburst", 1, [
    "Starting at 1st level, when you spend sorcery points, you can use your reaction to concentrate the remaining magical energies into an arctic outburst, emanating a cold breeze. If you do, each creature of your choice within 10 feet of you takes cold damage equal to half your sorcerer level (rounded up) + the number of sorcery points spent."
  ]),
  feature("Cold Capsule", 6, [
    "At 6th level, you gain resistance to cold damage.",
    "You also gain the ability to defend yourself by momentarily forming crystalline scales on your body. As a reaction when you are hit by an attack and take bludgeoning, piercing, or slashing damage from it, you can reduce that damage by an amount equal to your sorcerer level + your Charisma modifier. Until the start of your next turn, you have vulnerability to fire damage and resistance to bludgeoning, piercing, and slashing damage.",
    "Once you use this feature, you can't use it again until you finish a short or long rest, unless you spend 2 sorcery points to use it again."
  ]),
  feature("Curse of Winter", 14, [
    "Starting at 14th level, you can choose any number of creatures instead of one when selecting targets for your Lingering Chill feature."
  ]),
  feature("Icicle Storm", 18, [
    "Starting at 18th level, whenever you cast a spell of 6th level or higher, you can use your reaction to emit an icicle storm around one creature the spell targets. Each creature in a 10-foot-radius sphere centered on the target must succeed on a Constitution saving throw or take {@damage 4d6} cold damage plus an extra {@dice 1d6} for each level of the spell. This damage ignores resistances and immunities.",
    "Once you use this feature, you can't use it again until you finish a long rest, unless you spend sorcery points equal to 2 + the triggering spell's level."
  ])
];

const chillActivity = (name, foundryId, minLevel) => ({
  name, type: "utility",
  activation: { type: "special", condition: "You deal cold damage with a spell or sorcerer feature" },
  consumption: { targets: [ownUses()] },
  target: { affects: { type: "creature", count: "1" } },
  effects: [{ foundryId }],
  ...(minLevel ? fromSorcererLevel(minLevel) : {})
});
const crystallineScales = (name, consumption) => ({
  name, type: "utility",
  activation: { type: "reaction", condition: "You are hit by an attack and take bludgeoning, piercing, or slashing damage" },
  consumption: { targets: consumption },
  target: { affects: { type: "self" } },
  roll: { formula: "@classes.sorcerer.levels + @abilities.cha.mod", name: "Damage Reduction", visible: true },
  effects: [{ foundryId: "crystallineScale" }]
});
const icicleStorm = (name, consumption) => ({
  name, type: "save",
  activation: { type: "reaction", condition: "You cast a spell of 6th level or higher" },
  consumption: { targets: consumption, scaling: { allowed: true, max: "3" } },
  target: { template: { type: "sphere", size: "10", units: "ft" } },
  save: { ability: ["con"], dc: { calculation: "spellcasting" } },
  damage: { onSave: "none", parts: [{ custom: { enabled: true, formula: "(9 + @scaling)d6" }, types: ["cold"] }] },
  descriptionChat: "Scale up once per spell level above 6th (6th = 10d6, 9th = 13d6). This damage ignores resistances and immunities; apply it as true damage."
});

const foundrySubclassFeature = [
  sideData("Lingering Chill", 1, {
    system: usesSystem("max(1, @abilities.cha.mod)", "sr"),
    activities: [
      chillActivity("Chill: Slow", "lingeringChillSl"),
      chillActivity("Chill: No Reactions", "lingeringChillRe"),
      chillActivity("Chill: Numb Attack", "lingeringChillAt", 6),
      chillActivity("Chill: Brittle", "lingeringChillBr", 14),
      {
        name: "Regain Use (1 Sorcery Point)", type: "utility",
        activation: { type: "special" },
        consumption: { targets: [ownUses("-1"), sorceryPoints(1)] },
        target: { affects: { type: "self" } }
      }
    ],
    effects: [
      oneRoundEffect("lingeringChillSl", "Lingering Chill: Slowed", "Speed reduced by 15 feet until the end of the sorcerer's next turn (the greater reduction applies if the spell already slows)."),
      oneRoundEffect("lingeringChillRe", "Lingering Chill: No Reactions", "Can't take reactions until the end of the sorcerer's next turn."),
      oneRoundEffect("lingeringChillAt", "Lingering Chill: Numbed", "Disadvantage on the next attack roll made before the end of its next turn."),
      oneRoundEffect("lingeringChillBr", "Lingering Chill: Brittle", "Vulnerable to cold damage until the end of the sorcerer's next turn; cold resistance is suspended (remove it by hand).",
        [{ key: "system.traits.dv.value", mode: "ADD", value: "cold" }])
    ]
  }),
  sideData("Arctic Outburst", 1, {
    activities: [{
      name: "Arctic Outburst", type: "damage",
      activation: { type: "reaction", condition: "You spend sorcery points" },
      consumption: { targets: [], scaling: { allowed: true, max: "@classes.sorcerer.levels - 1" } },
      target: { affects: { type: "creature", choice: true }, template: { type: "radius", size: "10", units: "ft" } },
      damage: { parts: [{ custom: { enabled: true, formula: "ceil(@classes.sorcerer.levels / 2) + @scaling" }, types: ["cold"] }] },
      descriptionChat: "Scale to the number of sorcery points you just spent (1 = no scaling)."
    }]
  }),
  sideData("Cold Capsule", 6, {
    system: usesSystem("1", "sr"),
    activities: [
      crystallineScales("Crystalline Scales", [ownUses()]),
      crystallineScales("Crystalline Scales (2 Sorcery Points)", [sorceryPoints(2)])
    ],
    effects: [
      { name: "Cold Capsule: Cold Resistance", transfer: true, changes: [{ key: "system.traits.dr.value", mode: "ADD", value: "cold" }] },
      oneRoundEffect("crystallineScale", "Crystalline Scales", "Vulnerable to fire damage and resistant to bludgeoning, piercing, and slashing damage until the start of your next turn.", [
        { key: "system.traits.dv.value", mode: "ADD", value: "fire" },
        { key: "system.traits.dr.value", mode: "ADD", value: "bludgeoning" },
        { key: "system.traits.dr.value", mode: "ADD", value: "piercing" },
        { key: "system.traits.dr.value", mode: "ADD", value: "slashing" }
      ])
    ]
  }),
  sideData("Icicle Storm", 18, {
    system: usesSystem("1", "lr"),
    activities: [
      icicleStorm("Icicle Storm", [ownUses()]),
      icicleStorm("Icicle Storm (Sorcery Points)", [sorceryPoints(8, { mode: "amount", formula: "1" })])
    ]
  })
];

const homebrew = {
  _meta: meta,
  subclass: [subclass],
  subclassFeature: subclassFeatures,
  foundrySubclassFeature
};

fs.writeFileSync(OUT_FILE, JSON.stringify(homebrew, null, "\t") + "\n");
console.log(`Wrote ${OUT_FILE}`);
