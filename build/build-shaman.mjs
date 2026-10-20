import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SRC = "SarungardShaman";
const BREW_VERSION = "2.0.1";
const PUBLISHED_AT = Math.floor(Date.now() / 1000);
const CLASS = "Shaman";
const OUT_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "Sarungard; Shaman.json");

const cf = (name, level) => `${name}|${CLASS}|${SRC}|${level}`;
const scf = (name, short, level) => `${name}|${CLASS}|${SRC}|${short}|${SRC}|${level}`;
const subclassTag = (name, short) => `{@subclass ${name}|${CLASS}|${SRC}|${short}|${SRC}}`;

const recovery = (...periods) => periods.map(period => ({ period, type: "recoverAll" }));
const usesSystem = (max, ...periods) => ({ "uses.max": max, "uses.recovery": recovery(...periods) });
const ownUses = (value = "1") => ({ type: "itemUses", value: String(value) });
const linkedUses = (prop, uid, value = "1") => ({ type: "itemUses", value: String(value), target: { prop, uid } });
const shamanHitDie = ({ scaling } = {}) => ({
  type: "hitDice", target: "d8", value: "1", ...(scaling ? { scaling: { mode: "amount", formula: "1" } } : {})
});
const activityUses = (max, ...periods) => ({ uses: { max: String(max), recovery: recovery(...periods) } });
const fromShamanLevel = min => ({ visibility: { identifier: "shaman", level: { min } } });
const range = (value, units = "ft") => ({ range: units === "ft" ? { value: String(value), units } : { units } });
const duration = (value, units) => ({ duration: { value: String(value), units } });
const d8Necrotic = () => ({ number: 1, denomination: 8, types: ["necrotic"], scaling: { mode: "whole", number: 1 } });
const castAtSecond = (spellUid, name) => ({
  name, type: "cast",
  activation: { type: "action", override: true },
  consumption: { targets: [{ type: "activityUses", value: "1" }] },
  ...activityUses(1, "lr"),
  spell: { uuid: `@spell[${spellUid}]`, level: 2 },
  ...fromShamanLevel(14)
});
const sideData = (extra) => ({ ignoreSrdActivities: true, ignoreSrdEffects: true, migrationVersion: 3, ...extra });
const classSide = (name, level, extra) => sideData({ name, source: SRC, className: CLASS, classSource: SRC, level, ...extra });
const subclassSide = (name, short, level, extra) => sideData({
  name, source: SRC, className: CLASS, classSource: SRC, subclassShortName: short, subclassSource: SRC, level, ...extra
});

const list = items => ({ type: "list", items });
const named = (name, entries) => ({ type: "item", name, entries: [].concat(entries) });
const section = (name, entries) => ({ type: "entries", name, entries });

const ASI_TEXT = "When you reach 4th level, and again at 8th, 12th, 16th, and 19th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.";

const SLOT_ROWS = [
  [0,0,0,0,0,0,0], [2,0,0,0,0,0,0], [2,0,0,0,0,0,0], [2,1,0,0,0,0,0], [2,1,0,0,0,0,0],
  [2,1,1,0,0,0,0], [3,1,1,0,0,0,0], [3,2,1,0,0,0,0], [3,2,1,1,0,0,0], [3,2,1,1,0,0,0],
  [3,2,2,1,0,0,0], [4,3,2,1,1,0,0], [4,3,2,2,1,0,0], [4,3,3,2,1,0,0], [4,3,3,2,1,1,0],
  [4,3,3,3,1,1,0], [4,3,3,3,2,1,0], [4,3,3,3,2,1,1], [4,3,3,3,2,1,1], [4,3,3,3,2,1,1]
];

const PSIONIC_POINTS = { 2: 2, 5: 4, 10: 6, 14: 8, 17: 10 };

const SHAMAN_SPELLS_BY_LEVEL = {
  1: [
    "absorb elements|xge",
    "blinding radiance|sarungardshaman",
    "burning hands",
    "cold outburst|sarungardshaman",
    "comprehend languages",
    "create or destroy water",
    "cure wounds",
    "decaying touch|sarungardshaman",
    "detect evil and good",
    "detect magic",
    "earth tremor|xge",
    "electric discharge|sarungardshaman",
    "ensnaring strike",
    "entangle",
    "faerie fire",
    "fog cloud",
    "frost fingers|idrotf",
    "ice knife|xge",
    "jump",
    "longstrider",
    "protection from evil and good",
    "purify food and drink",
    "snare|xge",
    "speak with animals",
    "thunderwave",
    "wild cunning (ua)|uastarterspells",
    "zephyr strike|xge"
  ],
  2: [
    "aid",
    "animal messenger",
    "augury",
    "barkskin",
    "beast sense",
    "blinding squall|sarungardshaman",
    "continual flame",
    "dust devil|xge",
    "earthbind|xge",
    "enhance ability",
    "enlarge/reduce",
    "flame blade",
    "flaming sphere",
    "fossil strike|sarungardshaman",
    "gust of wind",
    "ice fan|sarungardshaman",
    "locate animals or plants",
    "magic weapon",
    "misty step",
    "silence",
    "skywrite|xge",
    "spike growth",
    "transmogrify|sarungardshaman",
    "warding wind|xge",
    "winter blast|sarungardshaman"
  ],
  3: [
    "call lightning",
    "daylight",
    "elemental weapon",
    "erratic wisp|sarungardshaman",
    "erupting earth|xge",
    "fireball",
    "flame arrows|xge",
    "gaseous form",
    "hail strike|sarungardshaman",
    "haste",
    "lightning bolt",
    "meld into stone",
    "plant growth",
    "remove curse",
    "slow",
    "speak with plants",
    "thunder step|xge",
    "tidal wave|xge",
    "vacuum touch|sarungardshaman",
    "wall of sand|xge",
    "wall of water|xge",
    "water breathing",
    "water walk",
    "wind wall"
  ],
  4: [
    "conjure minor elementals",
    "conjure woodland beings",
    "control water",
    "cryogenic stasis|sarungardshaman",
    "divination",
    "elemental bane|xge",
    "fire shield",
    "freedom of movement",
    "grasping vine",
    "guardian of nature|xge",
    "ice storm",
    "stone shape",
    "stoneskin",
    "storm sphere|xge",
    "summon elemental|tce",
    "wall of fire",
    "watery sphere|xge"
  ],
  5: [
    "commune",
    "commune with nature",
    "cone of cold",
    "conjure elemental",
    "contact other plane",
    "dawn|xge",
    "dispel evil and good",
    "far step|xge",
    "flame strike",
    "hail storm|sarungardshaman",
    "immolation|xge",
    "maelstrom|xge",
    "steel wind strike|xge",
    "transmute rock|xge",
    "tree stride",
    "wall of stone",
    "wrath of nature|xge"
  ],
  6: [
    "bones of the earth|xge",
    "chain lightning",
    "closed circuit|sarungardshaman",
    "flesh to stone",
    "investiture of flame|xge",
    "investiture of ice|xge",
    "investiture of stone|xge",
    "investiture of wind|xge",
    "move earth",
    "primordial ward|xge",
    "sunbeam",
    "wall of ice",
    "wall of thorns",
    "wind walk"
  ],
  7: [
    "fire storm",
    "plane shift",
    "regenerate",
    "whirlwind|xge"
  ]
};

const firstLevelWithSlot = spellLevel => SLOT_ROWS.findIndex(row => row[spellLevel - 1] > 0) + 1;
const classSpellRefs = () => Object.values(SHAMAN_SPELLS_BY_LEVEL).flat();
const spellsLearnedAsSlotsUnlock = () => [{
  name: "Shaman Spells",
  known: Object.fromEntries(Object.entries(SHAMAN_SPELLS_BY_LEVEL).map(([spellLevel, uids]) => [firstLevelWithSlot(Number(spellLevel)), uids]))
}];

const meta = {
  sources: [{
    json: SRC,
    abbreviation: "SHMN",
    full: "Shaman Class (Sarungard)",
    authors: ["Sarungard"],
    convertedBy: ["Claudius"],
    version: BREW_VERSION,
    color: "4f6b2f"
  }],
  edition: "classic",
  dependencies: { optionalfeature: ["TCE", "UALightDarkUnderdark"] },
  optionalFeatureTypes: {
    "FS:SHM": "Fighting Style; Shaman",
    "SF:SHM": "Shamanic Focus"
  },
  dateAdded: Date.UTC(2026, 9, 13) / 1000,
  dateLastModified: PUBLISHED_AT
};

const classFluff = {
  entries: [
    section("Shaman", [
      "As the tattooed man stands still with his weapon in hand and cold eyes, a gentle breeze broods over the scene. For a moment, he is in the way of an ogre's club; in the next, a chilling gust of wind displaces him behind his target, and with one precise strike, he strikes it down.",
      "Storm rages and lightning strikes the earth as a small group of wood elves tries to defend their home and family. An embercat leaps forward, dancing through the invading hordes of goblins, causing chaos and covering the place in the smell of burnt flesh. Strong winds blow toward the goblins to keep their arrows at bay.",
      "Ships skim the waves at full sail as a hulking orc raises his flag. As he starts chanting, his fleet falls into a strange state of fury; they don't wait to reach the shore, but throw themselves into the tides and swim ashore, tearing and biting at the waves as they charge the defenders.",
      "A strange figure cloaked in black is gathering plants with her sickle. An aura of bizarre energies emanates from her; her touch causes the plants to wither, and animals whimper and whine as she reaches them, then die. As she looks at you, even her mere presence causes unease, and a voice from within pleads with you to flee.",
      "Whether calling ancient primordials, entrapping deceased souls, or using their own essence to empower their allies, shamans gather fundamental power through forgotten techniques and ask ancestral spirits for aid. Once the connection is set and those spirits answer, there is only so much one can do against them.",
      "Be it combat or sacred rituals, they wield weapons and magic with equal deadliness.",
      section("Ancient Rituals", [
        "Shamans are the mediums between the spirit world and the material plane. They often serve as the hosts of supernatural creatures, and only they know how to communicate with them.",
        "Whether those beings are elder elementals, distant ancestors of people, or some extraplanar entity, the ritual is often kept secret, and only certain members of different councils have the knowledge to accomplish it. To become a shaman, one must learn about the world around and beyond us just as deeply as a wizard learns about magic; it takes years of dedication and an understanding of the fundamentals of nature and of our surroundings.",
        "Shamans often rely on the power of their bound spirit; they can unleash destructive elemental spells, perform rituals in a pinch, enter a battle trance that guides them through combat, or even embody an incarnation of something vile beyond our understanding."
      ]),
      section("Hosts of the Supernatural", [
        "For most shamans, the spirit world is their mental home. They often delve deep and form bonds with beings that have ever existed, whether from the Material Plane or not. Elder primordials and their own ancestors are just as likely to contact them as otherworldly beings. To that extent, what a shaman is capable of is mysterious, often fearsome, and powerful."
      ]),
      section("Creating a Shaman", [
        "When creating a shaman, consider your allegiances. What spirits are you communicating with? Do you and the elementals only try to preserve nature in its own sanctity? Do your ancestors guide you to protect your consecrated ground from defilers? Or are you calling bloodthirsty spirits and enraging others into a mindless fury to destroy? Whom do you serve? Who serves you?",
        "Shamans tend to be reclusive individuals, communing with the elements and living off the land. There are, however, many reasons why a shaman would join a group of adventurers or require the resources of towns. Perhaps they want friends, perhaps they need traveling companions, or maybe they require sacrifices for a less than reputable elemental.",
        section("Quick Build", [
          "You can make a shaman quickly by following these suggestions. First, Wisdom should be your highest ability score, followed by either Strength or Constitution. Second, choose the {@background hermit} or ritualistic background."
        ])
      ])
    ])
  ]
};

const shamanClass = {
  name: CLASS,
  source: SRC,
  page: 3,
  edition: "classic",
  hd: { number: 1, faces: 8 },
  proficiency: ["wis", "cha"],
  spellcastingAbility: "wis",
  preparedSpells: "<$level$> / 2 + <$wis_mod$>",
  preparedSpellsChange: "restLong",
  optionalfeatureProgression: [
    { name: "Shamanic Focus", featureType: ["SF:SHM"], progression: { 1: 1 } },
    { name: "Fighting Style", featureType: ["FS:SHM"], progression: { 3: 1 } }
  ],
  startingProficiencies: {
    armor: ["light", "shield"],
    armorProficiencies: [{ light: true, shield: true }],
    weapons: ["simple", "{@item battleaxe|phb|battleaxes}", "{@item longsword|phb|longswords}"],
    weaponProficiencies: [{ simple: true, "battleaxe|phb": true, "longsword|phb": true }],
    tools: ["One {@item musical instrument|phb} of your choice"],
    toolProficiencies: [{ anyMusicalInstrument: 1 }],
    skills: [{
      nature: true,
      choose: { from: ["arcana", "athletics", "investigation", "medicine", "perception", "performance", "survival"], count: 1 }
    }]
  },
  startingEquipment: {
    additionalFromBackground: true,
    default: [
      "(a) a {@item shield|phb} and a {@item club|phb}, (b) a {@item longsword|phb}, or (c) a {@item battleaxe|phb}",
      "(a) a {@item shortbow|phb} and {@item arrows (20)|phb|20 arrows} or (b) two {@filter simple weapons|items|source=phb|category=basic|type=simple weapon}",
      "(a) an {@item explorer's pack|phb} or (b) a {@item dungeoneer's pack|phb}",
      "{@item Leather armor|phb} and a {@item quarterstaff|phb}"
    ],
    defaultData: [
      { a: ["shield|phb", "club|phb"], b: ["longsword|phb"], c: ["battleaxe|phb"] },
      { a: ["shortbow|phb", "arrows (20)|phb"], b: [{ equipmentType: "weaponSimple", quantity: 2 }] },
      { a: ["explorer's pack|phb"], b: ["dungeoneer's pack|phb"] },
      { _: ["leather armor|phb", "quarterstaff|phb"] }
    ]
  },
  multiclassing: {
    requirements: { str: 13, wis: 13 },
    proficienciesGained: {
      armor: ["light", "shield"],
      armorProficiencies: [{ light: true, shield: true }],
      tools: ["One {@item musical instrument|phb} of your choice"],
      toolProficiencies: [{ anyMusicalInstrument: 1 }]
    },
    entries: [
      "If you multiclass into another spellcasting class, add two-thirds of your shaman levels (rounded down) to your levels in your other spellcasting classes to determine your available spell slots. For example, a shaman 3/wizard 4 counts as a 6th-level caster for determining spell slots."
    ]
  },
  classTableGroups: [{
    title: "Spell Slots per Spell Level",
    colLabels: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"].map((label, i) =>
      `{@filter ${label}|spells|level=${i + 1}|class=${CLASS}}`),
    rowsSpellProgression: SLOT_ROWS
  }],
  classFeatures: [
    cf("Natural Armor", 1),
    cf("Shamanic Focus", 1),
    { classFeature: cf("Ancient Council", 2), gainSubclassFeature: true },
    cf("Spellcasting", 2),
    cf("Fighting Style", 3),
    cf("Resonance", 3),
    cf("Ability Score Improvement", 4),
    { classFeature: cf("Council Heritage Feature", 5), gainSubclassFeature: true },
    cf("Resonance (x2)", 6),
    cf("Improved Focus", 7),
    cf("Ability Score Improvement", 8),
    { classFeature: cf("Council Heritage Feature", 9), gainSubclassFeature: true },
    cf("Resonance (x3)", 12),
    cf("Ability Score Improvement", 12),
    { classFeature: cf("Council Heritage Feature", 14), gainSubclassFeature: true },
    cf("Spiritual Focus", 14),
    cf("Ability Score Improvement", 16),
    cf("Harmony", 17),
    cf("Ability Score Improvement", 19),
    { classFeature: cf("Council Heritage Feature", 20), gainSubclassFeature: true }
  ],
  subclassTitle: "Ancient Council",
  classSpells: classSpellRefs(),
  additionalSpells: spellsLearnedAsSlotsUnlock(),
  fluff: classFluff,
  foundrySystem: {
    identifier: "shaman",
    "spellcasting.progression": "shaman",
    "spellcasting.ability": "wis",
    "spellcasting.preparation.formula": "max(1, @abilities.wis.mod + floor(@classes.shaman.levels / 2))"
  },
  foundryAdvancement: [{
    type: "ScaleValue",
    title: "Resonance Uses",
    configuration: { identifier: "resonance", type: "number", scale: { 3: { value: 1 }, 6: { value: 2 }, 12: { value: 3 } } }
  }]
};

const FOCUS_IMPROVED = {
  instrumental: "Creatures who can hear your song during the short rest can forgo up to two Hit Dice rolls instead of one to regain the maximum instead.",
  mnemonic: "Once per short rest, whenever you cast a spell using your focus, you can have one of the creatures the spell targets roll its saving throw with disadvantage.",
  totemic: "The wearer of the talisman can add the {@dice d4} to its AC if an attack would hit it. In addition, your talisman can be used twice instead of once per short rest.",
  weaponic: "Whenever you take the {@action Attack} action while wielding a shaman weapon, you can attack twice instead of once."
};
const FOCUS_SPIRITUAL = {
  instrumental: "You can cast {@spell healing spirit|XGE} at 2nd level as an action without expending a spell slot once per long rest.",
  mnemonic: "You can cast {@spell hold person} at 2nd level as an action without expending a spell slot once per long rest.",
  totemic: "You can cast {@spell enhance ability} at 2nd level as an action without expending a spell slot once per long rest.",
  weaponic: "You can cast {@spell magic weapon} at 2nd level as an action without expending a spell slot once per long rest."
};

const FOCUS_OPTIONS = ["Instrumental Focus", "Mnemonic Focus", "Totemic Focus", "Weaponic Focus"];
const FIGHTING_STYLES = ["Blind Fighting", "Great Weapon Fighting", "Interception", "Protection", "Tunnel Fighter", "Two-Weapon Fighting"];
const FOCUS_INTRO = "At 1st level, you choose an object as your shamanic focus, which helps you communicate with the spirits of this world. Unless stated otherwise, your focus can be a tool or just a small trinket, but not a weapon, a piece of armor, or a shield.";
const FOCUS_REBOND = "If you lose your focus, you can perform a 1-hour ceremony to bond with another item. This ceremony can be performed during a short or long rest, and it destroys the previous focus.";
const FIGHTING_STYLE_INTRO = "At 3rd level, you adopt a particular style of fighting as your specialty.";
const FIGHTING_STYLE_ONCE = "You can't take a Fighting Style option more than once, even if you later get to choose again.";
const optionRefs = names => ({
  type: "options", count: 1,
  entries: names.map(name => ({ type: "refOptionalfeature", optionalfeature: `${name}|${SRC}` }))
});

const classFeatures = [
  {
    name: "Natural Armor", source: SRC, page: 4, className: CLASS, classSource: SRC, level: 1,
    entries: ["While you are not wearing heavy armor, you can use your Wisdom modifier instead of your Dexterity modifier when calculating your Armor Class."]
  },
  {
    name: "Shamanic Focus", source: SRC, page: 4, className: CLASS, classSource: SRC, level: 1,
    entries: [`${FOCUS_INTRO} Select one of the following options:`, optionRefs(FOCUS_OPTIONS), FOCUS_REBOND]
  },
  {
    name: "Ancient Council", source: SRC, page: 4, className: CLASS, classSource: SRC, level: 2,
    entries: [
      `At 2nd level, you choose to identify with a council of shamans: the ${subclassTag("Council of Blood", "Blood")}, the ${subclassTag("Council of Elements", "Elements")}, the ${subclassTag("Council of Harvest", "Harvest")}, the ${subclassTag("Council of Shrouds", "Shrouds")}, the ${subclassTag("Council of Traditions", "Traditions")}, or the ${subclassTag("Council of Omens", "Omens")}. Your choice grants you features at 2nd level and again at 5th, 9th, 14th, and 20th level.`,
      section("Ancient Councils", [
        "Though shamans are often members of small tribes or larger hordes, they are also part of another society. This society spans the land, ignoring political borders, and connects shamans through their rituals and thus through the spirits. At a local scale, shamans are organized into councils, Ancient Councils that share and preserve the same heritage over generations."
      ])
    ]
  },
  {
    name: "Spellcasting", source: SRC, page: 4, className: CLASS, classSource: SRC, level: 2,
    entries: [
      `Harnessing the pure spiritual essence of abiding spirits themselves, you can cast spells to shape that power to your will. See {@filter the shaman spell list|spells|class=${CLASS}} below for the spells available to you.`,
      section("Preparing and Casting Spells", [
        "The Shaman table shows how many spell slots you have to cast your shaman spells of 1st level and higher. To cast one of these spells, you must expend a slot of the spell's level or higher. You regain all expended spell slots when you finish a long rest.",
        "You prepare the list of shaman spells that are available for you to cast, choosing from the shaman spell list. When you do so, choose a number of shaman spells equal to your Wisdom modifier + half your shaman level, rounded down (minimum of one spell). The spells must be of a level for which you have spell slots.",
        "For example, if you are a 4th-level shaman, you have two 1st-level and one 2nd-level spell slots. With a Wisdom of 16, your list of prepared spells can include five spells of 1st or 2nd level, in any combination. If you prepare the 1st-level spell {@spell cure wounds}, you can cast it using a 1st-level or 2nd-level slot. Casting the spell doesn't remove it from your list of prepared spells.",
        "You can change your list of prepared spells when you finish a long rest. Preparing a new list of shaman spells requires time spent in meditation: at least 1 minute per spell level for each spell on your list."
      ]),
      section("Spellcasting Ability", [
        "Wisdom is your spellcasting ability for your shaman spells, since your magic draws upon ancient techniques practiced in secret by different councils and relies on understanding how rituals invoke the power of spirits. You use your Wisdom whenever a spell refers to your spellcasting ability. In addition, you use your Wisdom modifier when setting the saving throw DC for a shaman spell you cast and when making an attack roll with one.",
        { type: "abilityDc", name: "Spell", attributes: ["wis"] },
        { type: "abilityAttackMod", name: "Spell", attributes: ["wis"] }
      ]),
      section("Ritual Casting", [
        "You can cast a shaman spell as a ritual if that spell has the ritual tag and you have the spell prepared."
      ]),
      section("Multiclassing", [
        "If you multiclass into another spellcasting class, add two-thirds of your shaman levels (rounded down) to your levels in your other spellcasting classes to determine your available spell slots. For example, a shaman 3/wizard 4 counts as a 6th-level caster for determining spell slots."
      ])
    ]
  },
  {
    name: "Fighting Style", source: SRC, page: 5, className: CLASS, classSource: SRC, level: 3,
    entries: [`${FIGHTING_STYLE_INTRO} Choose one of the following options. ${FIGHTING_STYLE_ONCE}`, optionRefs(FIGHTING_STYLES)]
  },
  {
    name: "Resonance", source: SRC, page: 5, className: CLASS, classSource: SRC, level: 3,
    entries: [
      "Your link with the spirit realm helps you when you draw power from it.",
      "Starting at 3rd level, you can use your Resonance to ritual cast a shaman spell as a full-round action instead of taking extended time, as the spirits of nature help you deliver your magic. You can use your Resonance once.",
      "Beginning at 6th level, you can use your Resonance twice between rests, and beginning at 12th level, you can use it three times between rests. When you finish a long rest, you regain your expended uses.",
      section("Full-Round Actions", [
        "To take a full-round action, you have to sacrifice all of the resources available to you in a single round: your action, bonus action, reaction, and movement. You can take a full-round action only if you haven't spent any of your action, bonus action, or reaction this turn and you haven't moved during this turn, and after you use the full-round action, your speed is 0 until the end of the current turn."
      ])
    ]
  },
  ...[4, 8, 12, 16, 19].map(level => ({
    name: "Ability Score Improvement", source: SRC, page: 5, className: CLASS, classSource: SRC, level, entries: [ASI_TEXT]
  })),
  ...[5, 9, 14, 20].map(level => ({
    name: "Council Heritage Feature", source: SRC, page: 6, className: CLASS, classSource: SRC, level,
    entries: [`At ${level}th level, you gain a feature granted by your Ancient Council.`]
  })),
  {
    name: "Resonance (x2)", source: SRC, page: 5, className: CLASS, classSource: SRC, level: 6,
    entries: [`Beginning at 6th level, you can use your {@classFeature Resonance|${CLASS}|${SRC}|3} twice between long rests.`]
  },
  {
    name: "Improved Focus", source: SRC, page: 5, className: CLASS, classSource: SRC, level: 7,
    entries: [
      "Beginning at 7th level, you learn advanced uses of your focus as you bond with it.",
      list([
        named("Instrumental Focus.", FOCUS_IMPROVED.instrumental),
        named("Mnemonic Focus.", FOCUS_IMPROVED.mnemonic),
        named("Totemic Focus.", FOCUS_IMPROVED.totemic),
        named("Weaponic Focus.", FOCUS_IMPROVED.weaponic)
      ])
    ]
  },
  {
    name: "Resonance (x3)", source: SRC, page: 5, className: CLASS, classSource: SRC, level: 12,
    entries: [`Beginning at 12th level, you can use your {@classFeature Resonance|${CLASS}|${SRC}|3} three times between long rests.`]
  },
  {
    name: "Spiritual Focus", source: SRC, page: 5, className: CLASS, classSource: SRC, level: 14,
    entries: [
      "Starting at 14th level, you can invoke a spirit bound to your focus:",
      list([
        named("Instrumental Focus.", FOCUS_SPIRITUAL.instrumental),
        named("Mnemonic Focus.", FOCUS_SPIRITUAL.mnemonic),
        named("Totemic Focus.", FOCUS_SPIRITUAL.totemic),
        named("Weaponic Focus.", FOCUS_SPIRITUAL.weaponic)
      ])
    ]
  },
  {
    name: "Harmony", source: SRC, page: 5, className: CLASS, classSource: SRC, level: 17,
    entries: [`At 17th level, you reach perfect harmony with your inner nature and the world around you. Once per day, when you finish a short rest and you have no uses of your {@classFeature Resonance|${CLASS}|${SRC}|3} remaining, you can regain one use.`]
  }
];

const focusOption = (name, page, base, key) => ({
  name, source: SRC, page, featureType: ["SF:SHM"],
  entries: [
    base,
    section("Improved Focus (7th Level)", [FOCUS_IMPROVED[key]]),
    section("Spiritual Focus (14th Level)", [FOCUS_SPIRITUAL[key]])
  ]
});

const optionalFeatures = [
  {
    ...focusOption("Instrumental Focus", 4, "Your shamanic focus is an instrument of calm. During a short rest, you can play this focus. If you do, each ally who can hear it and spends at least one Hit Die during this rest can forgo one roll and instead regain the maximum number of hit points the die can restore. This instrument must be an instrument you are proficient with.", "instrumental"),
    foundryActivities: [castAtSecond("healing spirit|xge", "Spiritual Focus: Healing Spirit")]
  },
  {
    ...focusOption("Mnemonic Focus", 4, "Your shamanic focus is an object of remembrance. You can use this focus as a spellcasting focus for your shaman spells.", "mnemonic"),
    foundryActivities: [
      {
        name: "Improved Focus: Disadvantage on Save", type: "utility",
        activation: { type: "special", condition: "When you cast a spell using your focus" },
        consumption: { targets: [{ type: "activityUses", value: "1" }] },
        ...activityUses(1, "sr"),
        target: { affects: { type: "creature", count: "1" } },
        ...fromShamanLevel(7)
      },
      castAtSecond("hold person|phb", "Spiritual Focus: Hold Person")
    ]
  },
  {
    ...focusOption("Totemic Focus", 4, "Your shamanic focus is a totem of willpower, a piece of jewelry of some sort. Once per short rest, you can bolster a creature by giving it your totem to reinforce its resolve. If it fails an ability check while in possession of your totem, it can add a {@dice d4} to the roll, potentially turning the roll into a success.", "totemic"),
    foundrySystem: usesSystem("1 + min(1, floor(@classes.shaman.levels / 7))", "sr"),
    foundryActivities: [
      {
        name: "Bolster", type: "utility",
        activation: { type: "special", condition: "Give your totem to a creature" },
        consumption: { targets: [ownUses()] },
        target: { affects: { type: "creature", count: "1" } },
        roll: { formula: "1d4", name: "Totem Die", visible: true },
        effects: [{ foundryId: "shamanTotem00000" }]
      },
      castAtSecond("enhance ability|phb", "Spiritual Focus: Enhance Ability")
    ],
    foundryEffects: [{
      foundryId: "shamanTotem00000",
      name: "Shaman's Totem",
      description: "While holding the shaman's totem, when this creature fails an ability check it can add a d4 to the roll, potentially turning it into a success. If the shaman is 7th level or higher, the holder can instead add the d4 to its AC when an attack would hit it."
    }]
  },
  {
    ...focusOption("Weaponic Focus", 4, "Your shamanic focus is a tool of warfare: a melee weapon you are proficient with that has the versatile or two-handed property but lacks the heavy and special properties. It counts as a shaman weapon for you, and when you wield this weapon, you can add your Wisdom modifier to the first damage roll you make with it each turn.", "weaponic"),
    foundryActivities: [castAtSecond("magic weapon|phb", "Spiritual Focus: Magic Weapon")]
  },
  {
    name: "Blind Fighting", source: SRC, page: 5, featureType: ["FS:SHM"],
    _copy: { name: "Blind Fighting", source: "TCE" },
    foundryEffects: [{
      name: "Blind Fighting", transfer: true,
      changes: [{ key: "system.attributes.senses.ranges.blindsight", mode: "UPGRADE", value: "10" }]
    }]
  },
  {
    name: "Great Weapon Fighting", source: SRC, page: 5, featureType: ["FS:SHM"],
    entries: ["When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit."]
  },
  {
    name: "Interception", source: SRC, page: 5, featureType: ["FS:SHM"],
    _copy: { name: "Interception", source: "TCE" },
    foundryActivities: [{
      name: "Intercept", type: "utility",
      activation: { type: "reaction", condition: "A creature you can see hits a target other than you within 5 feet of you" },
      ...range(5),
      target: { affects: { type: "ally", count: "1" } },
      roll: { formula: "1d10 + @prof", name: "Damage Reduction", visible: true }
    }]
  },
  {
    name: "Protection", source: SRC, page: 5, featureType: ["FS:SHM"],
    entries: ["When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield."],
    foundryActivities: [{
      name: "Protect", type: "utility",
      activation: { type: "reaction", condition: "A creature you can see attacks a target other than you within 5 feet of you" },
      ...range(5),
      target: { affects: { type: "ally", count: "1" } }
    }]
  },
  {
    name: "Tunnel Fighter", source: SRC, page: 5, featureType: ["FS:SHM"],
    _copy: { name: "Tunnel Fighter", source: "UALightDarkUnderdark" },
    foundryActivities: [{
      name: "Defensive Stance", type: "utility",
      activation: { type: "bonus" },
      ...duration(1, "round"),
      target: { affects: { type: "self" } },
      effects: [{ foundryId: "tunnelFighterSta" }]
    }],
    foundryEffects: [{
      foundryId: "tunnelFighterSta",
      name: "Defensive Stance",
      duration: { rounds: 1 },
      description: "Tunnel Fighter stance is active until your next turn starts. See the Tunnel Fighter feature for its rules."
    }]
  },
  {
    name: "Two-Weapon Fighting", source: SRC, page: 5, featureType: ["FS:SHM"],
    entries: ["When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack."]
  }
];

const subclassHeader = (name, short, page, flavor, refs) => ({
  name, source: SRC, page, className: CLASS, classSource: SRC, subclassShortName: short, subclassSource: SRC, level: 2,
  entries: [flavor, ...refs.map(ref => ({ type: "refSubclassFeature", subclassFeature: scf(ref, short, 2) }))]
});
const subFeature = (name, short, level, page, entries, extra = {}) => ({
  name, source: SRC, page, className: CLASS, classSource: SRC, subclassShortName: short, subclassSource: SRC, level,
  ...(level === 2 ? { header: 1 } : {}), entries, ...extra
});

const subclasses = [
  {
    name: "Council of Blood", shortName: "Blood", source: SRC, className: CLASS, classSource: SRC, page: 6, edition: "classic",
    subclassFeatures: [scf("Council of Blood", "Blood", 2), scf("Commanded Sanguinity", "Blood", 5), scf("Bloodlust", "Blood", 9), scf("Blood Harvest", "Blood", 14), scf("Embodiment of Wrath", "Blood", 20)],
    foundrySystem: { identifier: "blood" },
    foundryAdvancement: [{
      type: "ScaleValue", title: "Sanguinity Hit Dice",
      configuration: { identifier: "sanguinity", type: "number", scale: { 5: { value: 2 }, 11: { value: 3 }, 17: { value: 4 } } }
    }]
  },
  {
    name: "Council of Elements", shortName: "Elements", source: SRC, className: CLASS, classSource: SRC, page: 6, edition: "classic",
    additionalSpells: [{ prepared: { 2: ["find familiar|phb"] } }],
    subclassFeatures: [scf("Council of Elements", "Elements", 2), scf("Destructive Resonance", "Elements", 5), scf("Elemental Resonance", "Elements", 9), scf("Improved Elemental Familiar", "Elements", 14), scf("Archon of Fundaments", "Elements", 20)],
    foundrySystem: { identifier: "elements" }
  },
  {
    name: "Council of Harvest", shortName: "Harvest", source: SRC, className: CLASS, classSource: SRC, page: 7, edition: "classic",
    additionalSpells: [{ prepared: { 2: ["hex|phb"], 8: ["bestow curse|phb"] } }],
    subclassFeatures: [scf("Council of Harvest", "Harvest", 2), scf("Grim Echoes", "Harvest", 5), scf("Undying Servitude", "Harvest", 9), scf("Festival of Immortals", "Harvest", 14), scf("Soulstorm", "Harvest", 20)],
    foundrySystem: { identifier: "harvest" }
  },
  {
    name: "Council of Shrouds", shortName: "Shrouds", source: SRC, className: CLASS, classSource: SRC, page: 8, edition: "classic",
    additionalSpells: [{
      prepared: {
        2: ["shield|phb", "tasha's hideous laughter|phb"],
        4: ["mind spike|xge", "tasha's mind whip|tce"],
        6: ["blink|phb", "pulse wave|egw"],
        9: ["banishment|phb", "phantasmal killer|phb"],
        12: ["synaptic static|xge", "temporal shunt|egw"]
      }
    }],
    subclassTableGroups: [{
      subclasses: [{ name: "Council of Shrouds", source: SRC }],
      colLabels: ["Psionic Points"],
      rows: Array.from({ length: 20 }, (_, i) => [psionicPointsAt(i + 1)])
    }],
    subclassFeatures: [scf("Council of Shrouds", "Shrouds", 2), scf("Empowered Psionics", "Shrouds", 5), scf("Dissimilate", "Shrouds", 9), scf("Take into the Veil", "Shrouds", 14), scf("Surface the Shroud", "Shrouds", 20)],
    foundrySystem: { identifier: "shrouds" },
    foundryAdvancement: [{
      type: "ScaleValue", title: "Psionic Points",
      configuration: {
        identifier: "psionic-points", type: "number",
        scale: Object.fromEntries(Object.entries(PSIONIC_POINTS).map(([lvl, value]) => [lvl, { value }]))
      }
    }]
  },
  {
    name: "Council of Traditions", shortName: "Traditions", source: SRC, className: CLASS, classSource: SRC, page: 9, edition: "classic",
    subclassFeatures: [scf("Council of Traditions", "Traditions", 2), scf("Battle Meditation", "Traditions", 5), scf("Emboldening Trance", "Traditions", 9), scf("Relentless Trance", "Traditions", 14), scf("Ancient Teachings", "Traditions", 20)],
    foundrySystem: { identifier: "traditions" }
  },
  {
    name: "Council of Omens", shortName: "Omens", source: SRC, className: CLASS, classSource: SRC, page: 10, edition: "classic",
    additionalSpells: [{
      ability: "wis",
      prepared: {
        2: ["alarm", "gift of alacrity|egw"],
        4: ["augury", "warding bond"],
        6: ["glyph of warding", "remove curse"],
        9: ["death ward", "divination"],
        12: ["commune", "contact other plane"]
      },
      innate: {
        2: { daily: { 1: ["augury"] } },
        6: { daily: { 1: ["divination"] } }
      },
      known: { 9: ["guidance", "resistance"] }
    }],
    subclassFeatures: [scf("Council of Omens", "Omens", 2), scf("Shielded by Fate", "Omens", 5), scf("Voice of Forthcomings", "Omens", 9), scf("Flicker of Fate", "Omens", 14), scf("Alter Fate", "Omens", 20)],
    foundrySystem: { identifier: "omens" },
    foundryAdvancement: [{
      type: "ScaleValue", title: "Shielded by Fate Hit Dice",
      configuration: { identifier: "fate-dice", type: "number", scale: { 5: { value: 1 }, 11: { value: 2 }, 17: { value: 3 } } }
    }]
  }
];

function psionicPointsAt(level) {
  return Object.entries(PSIONIC_POINTS).reduce((points, [lvl, value]) => (level >= Number(lvl) ? value : points), 0);
}

const SOULS_UID = scf("Bounded Spirits", "Harvest", 2);
const PSI_UID = scf("Psionic Reserves", "Shrouds", 2);
const TRANCE_UID = scf("Battle Trance", "Traditions", 2);
const RESONANCE_UID = cf("Resonance", 3);
const fromSouls = (value = "1") => linkedUses("subclassFeature", SOULS_UID, value);
const fromPsi = value => linkedUses("subclassFeature", PSI_UID, value);
const fateShieldActivity = (name, activation, extraTargets) => ({
  name, type: "heal",
  activation,
  consumption: { targets: [...extraTargets, { type: "hitDice", target: "d8", value: "@scale.omens.fate-dice" }] },
  target: { affects: { type: "creature", count: "@prof" } },
  healing: { custom: { enabled: true, formula: "(@scale.omens.fate-dice)d8" }, types: ["temphp"] },
  descriptionChat: "Each target gains temporary hit points equal to the rolled Hit Dice."
});

const subclassFeatures = [
  subclassHeader("Council of Blood", "Blood", 6,
    "You see the goblin as he draws his scimitar, eyes bloodshot, emitting inarticulate cries of fury as he starts the massacre. His babbling lingers as the battle rages and only later calms down, never realizing that what caused his rage was the work of their shaman, a member of the Council of Blood. These shamans often use their own essence to infuriate their allies, driving them into a fearless berserk fury and causing carnage.",
    ["Imposing Chant"]),
  subFeature("Imposing Chant", "Blood", 2, 6, [
    "At 2nd level, during your turn, you can use a bonus action to expend one of your Hit Dice and roll it. If you do, a target creature you can see within 30 feet of you can move a number of feet up to the number rolled without provoking opportunity attacks.",
    "You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a short rest."
  ]),
  subFeature("Commanded Sanguinity", "Blood", 5, 6, [
    "Starting at 5th level, whenever a creature you can see within 30 feet of you makes a melee attack, you can expend up to two of your Hit Dice and roll them. You grant that creature a bonus to the attack's damage roll equal to the result, and both of you take that much necrotic damage. You can't use this feature if you don't have available Hit Dice.",
    "The maximum number of Hit Dice you can roll at once increases by one when you reach 11th level (3) and 17th level (4)."
  ]),
  subFeature("Bloodlust", "Blood", 9, 6, [
    "Starting at 9th level, whenever you hit a creature with a melee weapon attack, if that creature is missing any of its hit points, you can expend and roll up to two of your Hit Dice to deal that much extra necrotic damage to it."
  ]),
  subFeature("Blood Harvest", "Blood", 14, 6, [
    "When you reach 14th level, you gain the ability to channel your life force toward other creatures, corrupting their essence and driving them into a mad fury.",
    "Choose any number of creatures other than you that can hear you within 60 feet of you, up to your proficiency bonus. Expend and roll that many Hit Dice; you take necrotic damage equal to the result, and your hit point maximum is reduced by that amount until you finish a long rest. The chosen creatures have an additional action on their next turn.",
    "When you use this feature, you can't do so again until you finish a long rest."
  ]),
  subFeature("Embodiment of Wrath", "Blood", 20, 6, [
    "When you reach 20th level, you embody the wrath that boils in the blood of both the fallen and the living.",
    "As an action, you can undergo a transformation. For 1 minute, you gain the following benefits:",
    list([
      "You emanate an aura of fury in a 30-foot radius. Whenever a friendly creature other than you makes a weapon attack, you can use your reaction to make that creature move a number of feet equal to the number of your expended Hit Dice without provoking opportunity attacks, then make another attack as part of that action. You can use your reaction this way even if you have already expended your reaction this round, but not if you have already used your reaction this turn.",
      "Whenever you roll one or more Hit Dice, a creature of your choice within 60 feet of you takes necrotic damage equal to the result rolled."
    ]),
    "The transformation ends early if you are incapacitated or if you die, and you can't use it again until you finish a long rest."
  ]),

  subclassHeader("Council of Elements", "Elements", 6,
    "Shamans practicing in the Council of Elements are amazed by the sheer power of the ancient primordials and often seek to understand them. Their rituals summon elemental familiars who are ready to help them channel destructive energies on those who threaten their sacred nodes of power.",
    ["Elemental Familiar"]),
  subFeature("Elemental Familiar", "Elements", 2, 6, [
    "Starting at 2nd level, you learn the {@spell find familiar} spell, and it counts as a shaman spell for you. You always have it prepared, and it doesn't count against the number of spells you can prepare.",
    "In addition, when you cast the {@spell find familiar} spell, you can choose for your familiar to be an elemental instead of a celestial, fey, or fiend. If you do, choose one of the following:",
    list([
      named("Air Elemental.", "Your familiar gains extra movement speed equal to five times your proficiency bonus."),
      named("Earth Elemental.", "Your familiar gains temporary hit points equal to your shaman level."),
      named("Fire Elemental.", "If your familiar is reduced to 0 hit points, it deals fire damage equal to your shaman level in a 5-foot radius around it."),
      named("Water Elemental.", "Your familiar gains a bonus to its AC equal to your proficiency bonus.")
    ])
  ]),
  subFeature("Destructive Resonance", "Elements", 5, 6, [
    "At 5th level, you gain the ability to channel the destructive forces of nature through your spells while resonating with the elemental spirits around you.",
    `Whenever you cast a spell that deals cold, fire, lightning, or thunder damage, you can expend any number of uses of your {@classFeature Resonance|${CLASS}|${SRC}|3} to make that spell ignore resistance to the damage types listed above. The spell's level can't be higher than twice the number of Resonance uses you expended.`
  ]),
  subFeature("Elemental Resonance", "Elements", 9, 7, [
    `At 9th level, you can expend two uses of your {@classFeature Resonance|${CLASS}|${SRC}|3} to cast the {@spell find familiar} spell. If you cast the spell this way, you can cast it as a ritual and finish it as a full-round action, and you can choose for your familiar to appear in the form of a storm elemental, a crystal elemental, a blazing elemental, or an ice elemental. While in this form, your familiar can attack as if it were one of those elementals.`,
    "Your familiar stays in this form for 2 hours before it changes back to its original form."
  ]),
  subFeature("Improved Elemental Familiar", "Elements", 14, 7, [
    "Starting at 14th level, your connection with the spirits of the elements strengthens. When you cast {@spell find familiar} and choose for it to be an elemental, you can choose one of the following:",
    list([
      named("Fiery Malice.", "If you chose Fire Elemental as your Elemental Familiar, it can use its action to attack normally, as represented on the creature's stat block; otherwise, it deals fire damage equal to your shaman level in a 5-foot radius around it if it's reduced to 0 hit points."),
      named("Magmatic Sturdiness.", "If you chose Earth Elemental as your Elemental Familiar, it gains resistance to nonmagical attacks; otherwise, it gains temporary hit points equal to your shaman level."),
      named("Storm's Tempest.", "If you chose Air Elemental as your Elemental Familiar, it gains a flying speed equal to its movement speed and can hover; otherwise, it gains extra movement speed equal to five times your proficiency bonus."),
      named("Tidal Furor.", "If you chose Water Elemental as your Elemental Familiar, it can use its reaction to take damage instead of you if you are within 30 feet of each other; otherwise, it gains a bonus to its AC equal to your proficiency bonus.")
    ])
  ]),
  subFeature("Archon of Fundaments", "Elements", 20, 7, [
    "When you reach 20th level, you gain the ability to dissolve your physical body into the four fundamental elements of the world. As an action, you can undergo a transformation to split into four creatures: an {@creature air elemental}, an {@creature earth elemental}, a {@creature fire elemental}, and a {@creature water elemental}, and you gain the following effects:",
    list([
      "You can't concentrate on spells, and if you were concentrating on one, the spell immediately ends.",
      "For the duration, your body is nonexistent and your mind can't be affected; however, you perceive the world through the senses of all four of them.",
      "In combat, they share your initiative count, but you take their turns separately, as if you were each of them. You decide in which order they act when entering combat.",
      "When one of them is reduced to 0 hit points, it disappears. If all of them are killed, you appear in the position of the last one, reduced to 0 hit points and dying."
    ]),
    "This transformation lasts for 1 hour or until you end it as an action, and then you appear in the place of one of them of your choice. Then you gain one level of {@condition exhaustion}.",
    "Once used, you can't use this feature again for {@dice 1d8} days."
  ]),

  subclassHeader("Council of Harvest", "Harvest", 7,
    "There are shamans who seek power through the spirits of the deceased. Those bound to the Council of Harvest are often considered evil by others. Their goal is to gather power by enslaving the souls of fallen people and using them as weapons of destruction. They are not necessarily ill-intentioned, but they are certainly fascinated by the sheer power the dead can provide, and when the opportunity arises, these twisted mediums don't shy away from using souls as their instruments of destruction.",
    ["Bounded Spirits", "Soul Drain", "Harvester's Grimoire"]),
  subFeature("Bounded Spirits", "Harvest", 2, 7, [
    "At 2nd level, when you align with this council, you learn how to bind creatures to your Shamanic Focus. Whenever you reduce a creature to 0 hit points, you can enslave its soul and store it inside your focus.",
    "You can't enslave the souls of undead, constructs, or creatures with a challenge rating higher than your proficiency bonus, and you can store a number of souls up to your Wisdom modifier (minimum of 1)."
  ]),
  subFeature("Soul Drain", "Harvest", 2, 7, [
    "At 2nd level, you can consume one soul from your shamanic focus and make a ranged spell attack against a creature you can see within 60 feet of you. If the attack hits, the target takes poison damage equal to your shaman level + {@dice 1d6}, a number of times equal to the challenge rating the consumed soul had (minimum of 1)."
  ]),
  subFeature("Harvester's Grimoire", "Harvest", 2, 7, [
    "Also at 2nd level, you learn the {@spell hex} spell and always have it prepared. It counts as a shaman spell for you.",
    "At 8th level, you also learn the {@spell bestow curse} spell and always have it prepared. It counts as a shaman spell for you."
  ]),
  subFeature("Grim Echoes", "Harvest", 5, 7, [
    "Starting at 5th level, when you deal damage with a shaman spell, you can consume a soul from your shamanic focus and add its challenge rating to the damage."
  ]),
  subFeature("Undying Servitude", "Harvest", 9, 7, [
    "Starting at 9th level, whenever you are subjected to a saving throw to maintain concentration on a shaman spell, you can use your reaction to consume a soul and add its challenge rating to the roll. You can do this only before you roll.",
    "In addition, whenever a creature dies, if it was affected by your {@spell hex} or {@spell bestow curse} spell, you enslave its soul even if you did not kill it."
  ]),
  subFeature("Festival of Immortals", "Harvest", 14, 7, [
    "At 14th level, you can use your stored souls to twist their spirits and force them to obey your bidding. As an action, you can consume one soul from your shamanic focus and summon a number of {@creature specter|mm|specters} equal to the consumed creature's challenge rating (minimum of 1). In combat, they share your initiative and take their turns after yours. They remain by your side until they die or you finish a long rest.",
    "Once used, you can't use this feature again until you finish a long rest."
  ]),
  subFeature("Soulstorm", "Harvest", 20, 8, [
    "At 20th level, if your shamanic focus is full of souls, you can release your captured souls at once, creating a soulstorm centered on a point you can see within 60 feet of you. Each creature in a 20-foot radius must make a Dexterity, a Constitution, and a Wisdom saving throw against your shaman spell save DC.",
    list([
      "On a failed Dexterity save, a creature takes {@damage 4d6} necrotic damage for each soul released, or half as much on a successful one.",
      "On a failed Constitution save, a creature gains 2 levels of {@condition exhaustion}, or one level on a successful one.",
      "On a failed Wisdom save, a creature is {@condition incapacitated} for 1 minute, or {@condition frightened} of you on a successful one."
    ]),
    "Once used, your shamanic focus goes dormant and can't store souls again until you finish a long rest."
  ]),

  subclassHeader("Council of Shrouds", "Shrouds", 8,
    "Not all shamans are fascinated by the spirits of their world. Those who seek beings beyond the veil are affiliated with the Council of Shrouds. Seekers of the truth they are, and their minds have often been twisted by aberrant creatures like mind flayers. They gain psionic powers as they serve as hosts of spirits from the Astral Plane. Often considered outcasts by other shamans, members of the Council of Shrouds are proud of their powers, which are feared by many, as they can enhance their own mortal husk. Legends say that some who delved too deep into the mysteries of the Astral Plane ended up as the host of an aberration. Forever.",
    ["Council Spells", "Psionic Reserves", "Veiled Powers"]),
  subFeature("Council Spells", "Shrouds", 2, 8, [
    "When you align with this council, and later at 4th, 6th, 9th, and 12th level, you gain access to the spells listed for that level in the Council of Shrouds Spells table. Once you gain access to one of these spells, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the shaman spell list, the spell is nonetheless a shaman spell for you.",
    {
      type: "table", caption: "Council of Shrouds Spells",
      colLabels: ["Shaman Level", "Spells"], colStyles: ["col-3 text-center", "col-9"],
      rows: [
        ["2nd", "{@spell shield}, {@spell Tasha's hideous laughter}"],
        ["4th", "{@spell mind spike|XGE}, {@spell Tasha's mind whip|TCE}"],
        ["6th", "{@spell blink}, {@spell pulse wave|EGW}"],
        ["9th", "{@spell banishment}, {@spell phantasmal killer}"],
        ["12th", "{@spell synaptic static|XGE}, {@spell temporal shunt|EGW}"]
      ]
    }
  ]),
  subFeature("Psionic Reserves", "Shrouds", 2, 8, [
    "At 2nd level, when you align with this council, you gain two psionic points. These are used to fuel your council heritage abilities, and you regain all expended psionic points when you finish a long rest.",
    "You gain two additional psionic points when you reach 5th level and again at 10th, 14th, and 17th level."
  ]),
  subFeature("Veiled Powers", "Shrouds", 2, 8, [
    "Also at 2nd level, you gain three uses of your psionic reserves:",
    list([
      named("Lay on Minds.", "You can spend two psionic points as an action to end one of the following conditions on a creature you touch: {@condition blinded}, {@condition charmed}, {@condition deafened}, or {@condition frightened}."),
      named("Deliberate Defenses.", "You can spend one psionic point as a bonus action to take the {@action Dodge} action."),
      named("Psionic Emboldening.", "When a creature other than you within 30 feet of you fails a saving throw or ability check, you can use your reaction to spend one psionic point and make that creature reroll the roll. It must use the new roll.")
    ])
  ]),
  subFeature("Empowered Psionics", "Shrouds", 5, 8, [
    "Starting at 5th level, when you roll psychic or force damage for any of your shaman spells or features, you can reroll any of those damage dice that roll a 1, but you must use the new roll."
  ]),
  subFeature("Dissimilate", "Shrouds", 9, 8, [
    "Starting at 9th level, you can use your bonus action and spend 2 psionic points to vanish from your current plane of existence and appear in the Ethereal Plane. At the start of your next turn, if you are on the Ethereal Plane, you return to an unoccupied space of your choice that you can see within 30 feet of the space you vanished from. Then each creature within a 15-foot radius must succeed on a Dexterity saving throw against your shaman spell save DC or take force damage equal to {@damage 3d6} + your shaman level, or half as much on a successful one.",
    "Once you use this feature, you can't use it again until you finish a short rest."
  ]),
  subFeature("Take into the Veil", "Shrouds", 14, 8, [
    "At 14th level, your understanding of the Astral Plane strengthens as you grasp more of the strange connection you share with the spirits dwelling there, granting you the following benefits:",
    list([
      named("Mind's Eye.", "You can use your action and spend 4 psionic points to bolster the senses of a creature within 30 feet of you. For 1 hour, that creature has advantage on Wisdom ({@skill Perception}) checks that rely on hearing or sight and can see normally in darkness, both magical and nonmagical, to a distance of 60 feet."),
      named("Mute Flesh.", "You can use your action and spend 4 psionic points to touch a creature. For the next 10 minutes, having 0 hit points or fewer does not knock that creature {@condition unconscious}, as your psionic powers mute its physical body and it doesn't feel pain. It still must make death saving throws, and it suffers the normal effects of taking damage while at 0 hit points; as such, it can still die.")
    ]),
    "Only one of these effects can be active at a time, and once you use one, you can use it again only after its effect has faded."
  ]),
  subFeature("Surface the Shroud", "Shrouds", 20, 9, [
    "At 20th level, you can undergo a transformation, and your body becomes the host of a spirit from the Astral Plane. As an action, you can spend 5 psionic points to gain the following benefits:",
    list([
      "You can't be {@condition blinded}, {@condition charmed}, {@condition deafened}, or {@condition frightened}.",
      "You gain a flying speed equal to your movement speed, and you can hover.",
      "You gain resistance to all damage except psychic damage or damage dealt by magical sources.",
      "You can use your action to spend 1 psionic point to deal {@damage 3d10} psychic damage to a target creature you can see within 60 feet of you.",
      "You can use your action to spend 3 psionic points to cast the {@spell banishment} spell without expending a spell slot. If the target is not native to the Astral Plane, it rolls its saving throw with disadvantage."
    ]),
    "You remain in this form for 1 minute. It ends early if you are incapacitated, if you die, or if you dismiss it as a bonus action."
  ]),

  subclassHeader("Council of Traditions", "Traditions", 9,
    "Shamans who often seek guidance from their ancestors are the members of the Council of Traditions. They preserve sacred pleas and ancient teachings of combat mastery passed down for generations. These shamans often enter a trance when their predecessors claim their body and guide them through the fights they are forced to take, leaving devastated enemies behind. For each defeated enemy and each fallen ancestor, they get runes tattooed over their body.",
    ["Council Martial Training", "Battle Trance"]),
  subFeature("Council Martial Training", "Traditions", 2, 9, [
    "At 2nd level, when you align with this council, you gain proficiency with medium armor and one martial melee weapon of your choice. That weapon counts as a shaman weapon for you, as if you had chosen it as your shamanic focus."
  ]),
  subFeature("Battle Trance", "Traditions", 2, 9, [
    "Also at 2nd level, you learn the ability to immerse yourself in a forced meditative state, where your instincts act instead of your senses. As a bonus action, you enter the trance and choose one of the following benefits:",
    list([
      named("Overwhelming Stance.", "When you attack with a shaman weapon, you add your proficiency bonus to the damage dealt."),
      named("Parrying Stance.", "While in the trance, you can use your reaction to give an attack against you disadvantage if it does not have advantage."),
      named("Agile Stance.", "While in the trance, you can use your bonus action to take the {@action Dash} or {@action Disengage} action.")
    ]),
    "Your Battle Trance lasts for 1 minute. It ends early if you are incapacitated, if you die, or if you dismiss it as a bonus action. Once you use this feature, you can't use it again until you finish a short rest."
  ]),
  subFeature("Battle Meditation", "Traditions", 5, 9, [
    "Starting at 5th level, you can use your Battle Trance to help you focus your concentration on a spell you cast. You gain the following option to choose from when entering your trance:",
    list([
      named("Meditative Stance.", "If you cast a shaman spell that requires concentration during your Battle Trance, you can maintain your concentration even if you fail the saving throw for taking damage, but the spell immediately ends when your trance ends.")
    ])
  ]),
  subFeature("Emboldening Trance", "Traditions", 9, 9, [
    "Starting at 9th level, immediately after you enter your Battle Trance, you can make a weapon attack.",
    "During your Battle Trance, when you take the {@action Attack} action with a shaman weapon on your turn, you can make an attack with a shaman weapon as a bonus action, assuming you haven't already taken a bonus action this turn."
  ]),
  subFeature("Relentless Trance", "Traditions", 14, 9, [
    "Starting at 14th level, whenever you kill a creature while your Battle Trance is active, you can use a bonus action to reset the duration of your Battle Trance as if you had just used the feature this turn. If you reset the duration this way, you can't choose another stance."
  ]),
  subFeature("Ancient Teachings", "Traditions", 20, 9, [
    "At 20th level, through practicing the ancient traditions, you find your revelation and embrace the teachings of an ancient warrior. Your Strength and Wisdom scores increase by 2. Your maximum for those scores is now 22.",
    "In addition, you gain the following benefits while your Battle Trance is active:",
    list([
      "You gain a bonus to your AC equal to your Wisdom modifier (minimum of +1).",
      "You apply all stances; you don't have to choose between them."
    ])
  ]),

  subclassHeader("Council of Omens", "Omens", 10,
    "While most shamans try to find harmony in the present or search for the teachings of the past, some of them turn their gaze to broader horizons. A few of them seek guidance from the future. Bone-reading rituals help them see clearly what is yet to come, using that knowledge to their own (or their allies') benefit, eventually mastering fate itself.",
    ["Council Spells", "Bone-Reading", "Instinctive Portents"]),
  subFeature("Council Spells", "Omens", 2, 10, [
    "When you align with this council, and later at 4th, 6th, 9th, and 12th level, you gain access to the spells listed for that level in the Council of Omens Spells table. Once you gain access to one of these spells, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the shaman spell list, the spell is nonetheless a shaman spell for you.",
    {
      type: "table", caption: "Council of Omens Spells",
      colLabels: ["Shaman Level", "Spells"], colStyles: ["col-3 text-center", "col-9"],
      rows: [
        ["2nd", "{@spell alarm}, {@spell gift of alacrity|EGW}"],
        ["4th", "{@spell augury}, {@spell warding bond}"],
        ["6th", "{@spell glyph of warding}, {@spell remove curse}"],
        ["9th", "{@spell death ward}, {@spell divination}"],
        ["12th", "{@spell commune}, {@spell contact other plane}"]
      ]
    }
  ]),
  subFeature("Bone-Reading", "Omens", 2, 10, [
    "At 2nd level, you learn how to read the bones, whether they mean weal or woe. You gain proficiency with Bonecarver's Tools, and you can designate a set of bones to be your augury. While you are in possession of your augury, you can use it to cast the {@spell augury} spell without using a spell slot. If you cast the spell this way, there is no chance of getting a random reading, regardless of whether it is the first time you cast the spell.",
    "Once you use this feature, you can't do so again until the next dawn.",
    "When you reach 6th level in this class, you can also cast {@spell divination} using your augury once per long rest."
  ]),
  subFeature("Instinctive Portents", "Omens", 2, 10, [
    "Also at 2nd level, you are able to act quickly on instinct while you can perceive your surroundings. As long as you are not incapacitated, you can add your proficiency bonus to your initiative rolls.",
    "In addition, immediately after you roll initiative, you can swap your initiative with that of one willing ally you can see who has a lower initiative in the same combat. You can't make this swap if you or the ally is incapacitated, or if you can't see each other.",
    "You can use this feature a number of times equal to 1 + your Wisdom modifier. You regain all expended uses when you finish a long rest."
  ]),
  subFeature("Shielded by Fate", "Omens", 5, 10, [
    "At 5th level, after you finish a long rest, if you are in possession of your augury, you can target a number of other creatures equal to your proficiency bonus and expend and roll one of your Hit Dice. Each target gains temporary hit points equal to the result.",
    `In addition, after you finish a short rest, you can use an action to expend one use of your {@classFeature Resonance|${CLASS}|${SRC}|3} to use this feature again.`,
    "The number of Hit Dice you spend when using this feature increases by 1 when you reach 11th level (2 Hit Dice) and 17th level (3 Hit Dice)."
  ]),
  subFeature("Voice of Forthcomings", "Omens", 9, 10, [
    "At 9th level, you gain proficiency in the Persuasion and Intimidation skills, and you learn the {@spell guidance} and {@spell resistance} cantrips. They count as shaman spells for you, and Wisdom is your spellcasting ability for them.",
    "In addition, while you aren't incapacitated, creatures that have temporary hit points remaining from your Shielded by Fate feature have the effects of both cantrips applied."
  ]),
  subFeature("Flicker of Fate", "Omens", 14, 10, [
    "Starting at 14th level, while you aren't incapacitated, creatures that have temporary hit points remaining from your Shielded by Fate feature take their turns in combat as if they were under the effect of the {@spell haste} spell."
  ]),
  subFeature("Alter Fate", "Omens", 20, 10, [
    "At 20th level, you can forge your own destiny. In your time of need, you can avoid what lies beyond you with the help of what's left behind. When you gain this feature, and once a year after that, you can designate an event you have lived through as your setting point.",
    "Later, you can use your action to restore reality and set time back to your designated point; however, only you retain any memories of what occurred during the reset time. Everything else is restored according to that point, including possessions, boons, and banes.",
    "Once you use this feature, you can't use it again until you reach the point in time where you last used it, and there is a 33 percent chance that you can never use this feature again."
  ])
];

const stanceEffect = (foundryId, name, description, changes = []) => ({
  foundryId, name, description, duration: { seconds: 60, rounds: 10 }, ...(changes.length ? { changes } : {})
});
const OVERWHELMING_CHANGE = { key: "system.rolls.damage.mwak.bonus", mode: "ADD", value: "+@prof" };
const stanceActivity = (name, foundryId, minLevel) => ({
  name, type: "utility",
  activation: { type: "bonus" },
  consumption: { targets: [ownUses()] },
  ...duration(1, "minute"),
  target: { affects: { type: "self" } },
  effects: [{ foundryId }],
  ...(minLevel ? fromShamanLevel(minLevel) : {})
});

const foundryClassFeature = [
  classSide("Shamanic Focus", 1, {
    entries: [`${FOCUS_INTRO} You choose one Shamanic Focus option when you gain this feature.`, FOCUS_REBOND]
  }),
  classSide("Fighting Style", 3, {
    entries: [`${FIGHTING_STYLE_INTRO} ${FIGHTING_STYLE_ONCE}`]
  }),
  classSide("Natural Armor", 1, {
    effects: [{
      name: "Natural Armor", transfer: true,
      description: "Requires the Shaman Class Support module: adds two AC calculations, 'armor + Wisdom modifier (capped by the armor's Dexterity cap)' in light or medium armor and '10 + Wisdom modifier' without armor. dnd5e uses them whenever they beat the normal calculation; heavy armor is unaffected.",
      changes: [
        { key: "system.attributes.ac.calcs", mode: "ADD", value: "shamanNatural" },
        { key: "system.attributes.ac.calcs", mode: "ADD", value: "shamanNaturalUnarmored" }
      ]
    }]
  }),
  classSide("Resonance", 3, {
    system: usesSystem("@scale.shaman.resonance", "lr"),
    activities: [{
      name: "Quick Ritual", type: "utility",
      activation: { type: "action", condition: "Finish a shaman ritual spell as a full-round action" },
      consumption: { targets: [ownUses()] },
      target: { affects: { type: "self" } }
    }]
  }),
  classSide("Harmony", 17, {
    system: usesSystem("1", "day"),
    activities: [{
      name: "Regain Resonance", type: "utility",
      activation: { type: "special", condition: "When you finish a short rest with no Resonance uses remaining" },
      consumption: { targets: [ownUses(), linkedUses("classFeature", RESONANCE_UID, "-1")] },
      target: { affects: { type: "self" } }
    }]
  })
];

const foundrySubclassFeature = [
  subclassSide("Imposing Chant", "Blood", 2, {
    system: usesSystem("@prof", "sr"),
    activities: [{
      name: "Imposing Chant", type: "utility",
      activation: { type: "bonus" },
      consumption: { targets: [ownUses(), shamanHitDie()] },
      ...range(30),
      target: { affects: { type: "creature", count: "1" } },
      roll: { formula: "1d8", name: "Feet of Free Movement", visible: true }
    }]
  }),
  subclassSide("Commanded Sanguinity", "Blood", 5, {
    activities: [{
      name: "Commanded Sanguinity", type: "damage",
      activation: { type: "special", condition: "A creature you can see within 30 feet of you makes a melee attack" },
      consumption: {
        targets: [shamanHitDie({ scaling: true })],
        scaling: { allowed: true, max: "@scale.blood.sanguinity - 1" }
      },
      ...range(30),
      target: { affects: { type: "creature", count: "1" } },
      damage: { parts: [d8Necrotic()] },
      descriptionChat: "Add the result to the creature's damage roll. The creature and the shaman each take that much necrotic damage."
    }]
  }),
  subclassSide("Bloodlust", "Blood", 9, {
    activities: [{
      name: "Bloodlust", type: "damage",
      activation: { type: "special", condition: "You hit a creature that is missing hit points with a melee weapon attack" },
      consumption: { targets: [shamanHitDie({ scaling: true })], scaling: { allowed: true, max: "1" } },
      target: { affects: { type: "creature", count: "1" } },
      damage: { parts: [d8Necrotic()] }
    }]
  }),
  subclassSide("Blood Harvest", "Blood", 14, {
    system: usesSystem("1", "lr"),
    activities: [{
      name: "Blood Harvest", type: "damage",
      activation: { type: "special" },
      consumption: {
        targets: [ownUses(), shamanHitDie({ scaling: true })],
        scaling: { allowed: true, max: "@prof - 1" }
      },
      ...range(60),
      target: { affects: { type: "creature", count: "@prof", choice: true } },
      damage: { parts: [d8Necrotic()] },
      descriptionChat: "Scale up once per extra creature chosen. The shaman takes the rolled necrotic damage and their hit point maximum is reduced by the same amount until a long rest. Each chosen creature has an additional action on its next turn."
    }]
  }),
  subclassSide("Embodiment of Wrath", "Blood", 20, {
    system: usesSystem("1", "lr"),
    activities: [{
      name: "Embody Wrath", type: "utility",
      activation: { type: "action" },
      consumption: { targets: [ownUses()] },
      ...duration(1, "minute"),
      target: { affects: { type: "self" }, template: { type: "radius", size: "30", units: "ft" } },
      effects: [{ foundryId: "embodimentOfWrat" }]
    }],
    effects: [{
      foundryId: "embodimentOfWrat",
      name: "Embodiment of Wrath",
      duration: { seconds: 60, rounds: 10 },
      description: "Aura of fury (30 ft): when a friendly creature makes a weapon attack, use your reaction to let it move feet equal to your expended Hit Dice without provoking opportunity attacks, then make another attack. Whenever you roll Hit Dice, a creature of your choice within 60 feet takes necrotic damage equal to the result."
    }]
  }),

  subclassSide("Elemental Familiar", "Elements", 2, {
    activities: [{
      name: "Fire Familiar Burst", type: "damage",
      activation: { type: "special", condition: "Your fire elemental familiar is reduced to 0 hit points" },
      target: { template: { type: "radius", size: "5", units: "ft" } },
      damage: { parts: [{ custom: { enabled: true, formula: "@classes.shaman.levels" }, types: ["fire"] }] }
    }]
  }),
  subclassSide("Destructive Resonance", "Elements", 5, {
    activities: [{
      name: "Destructive Resonance", type: "utility",
      activation: { type: "special", condition: "You cast a spell that deals cold, fire, lightning, or thunder damage" },
      consumption: {
        targets: [linkedUses("classFeature", RESONANCE_UID, "1")],
        scaling: { allowed: true, max: "@scale.shaman.resonance - 1" }
      },
      descriptionChat: "The spell ignores resistance to cold, fire, lightning, and thunder damage. The spell's level can't exceed twice the Resonance uses expended."
    }]
  }),
  subclassSide("Elemental Resonance", "Elements", 9, {
    activities: [{
      name: "Elemental Resonance", type: "cast",
      activation: { type: "action", override: true, condition: "Cast as a ritual, finished as a full-round action" },
      consumption: { targets: [linkedUses("classFeature", RESONANCE_UID, "2")] },
      spell: { uuid: "@spell[find familiar|phb]" }
    }]
  }),
  subclassSide("Archon of Fundaments", "Elements", 20, {
    system: { "uses.max": "1" },
    activities: [{
      name: "Dissolve into the Elements", type: "utility",
      activation: { type: "action" },
      consumption: { targets: [ownUses()] },
      ...duration(1, "hour"),
      target: { affects: { type: "self" } },
      roll: { formula: "1d8", name: "Days Until You Can Use This Again", visible: true },
      effects: [{ foundryId: "archonOfFundamen" }]
    }],
    effects: [{
      foundryId: "archonOfFundamen",
      name: "Archon of Fundaments",
      duration: { seconds: 3600 },
      description: "You are split into an air, earth, fire, and water elemental. You can't concentrate on spells. When the transformation ends, you gain one level of exhaustion. Restore this feature's use manually after the rolled number of days."
    }]
  }),

  subclassSide("Bounded Spirits", "Harvest", 2, {
    system: { "uses.max": "max(1, @abilities.wis.mod)" },
    activities: [{
      name: "Enslave Soul", type: "utility",
      activation: { type: "special", condition: "You reduce a creature (not undead or construct) with CR no higher than your proficiency bonus to 0 hit points" },
      consumption: { targets: [ownUses("-1")] },
      target: { affects: { type: "creature", count: "1" } }
    }]
  }),
  subclassSide("Soul Drain", "Harvest", 2, {
    activities: [{
      name: "Soul Drain", type: "attack",
      activation: { type: "action" },
      consumption: { targets: [fromSouls()], scaling: { allowed: true, max: "@prof - 1" } },
      ...range(60),
      target: { affects: { type: "creature", count: "1" } },
      attack: { ability: "spellcasting", type: { value: "ranged", classification: "spell" } },
      damage: {
        includeBase: false,
        parts: [{ custom: { enabled: true, formula: "(@scaling)d6 + (@scaling * @classes.shaman.levels)" }, types: ["poison"] }]
      },
      descriptionChat: "Scale up to the consumed soul's challenge rating (minimum 1): the damage is your shaman level + 1d6, once per point of CR."
    }]
  }),
  subclassSide("Grim Echoes", "Harvest", 5, {
    activities: [{
      name: "Grim Echoes", type: "utility",
      activation: { type: "special", condition: "You deal damage with a shaman spell" },
      consumption: { targets: [fromSouls()] },
      descriptionChat: "Add the consumed soul's challenge rating to the spell's damage."
    }]
  }),
  subclassSide("Undying Servitude", "Harvest", 9, {
    activities: [{
      name: "Undying Servitude", type: "utility",
      activation: { type: "reaction", condition: "Before you roll a concentration save for a shaman spell" },
      consumption: { targets: [fromSouls()] },
      target: { affects: { type: "self" } },
      descriptionChat: "Add the consumed soul's challenge rating to the concentration saving throw."
    }]
  }),
  subclassSide("Festival of Immortals", "Harvest", 14, {
    system: usesSystem("1", "lr"),
    activities: [{
      name: "Festival of Immortals", type: "summon",
      activation: { type: "action" },
      consumption: { targets: [ownUses(), fromSouls()], scaling: { allowed: true, max: "@prof - 1" } },
      target: { affects: { type: "space" } },
      profiles: [{ uuid: "@creature[specter|mm]", count: "@scaling" }],
      descriptionChat: "Scale up to the consumed soul's challenge rating (minimum 1) to summon that many specters. They share your initiative and act after you until they die or you finish a long rest."
    }]
  }),
  subclassSide("Soulstorm", "Harvest", 20, {
    activities: [
      {
        name: "Soulstorm: Dexterity", type: "save",
        activation: { type: "action", condition: "Your shamanic focus is full of souls" },
        consumption: { targets: [fromSouls("max(1, @abilities.wis.mod)")] },
        ...range(60),
        target: { template: { type: "radius", size: "20", units: "ft" } },
        save: { ability: ["dex"], dc: { calculation: "spellcasting" } },
        damage: { onSave: "half", parts: [{ custom: { enabled: true, formula: "(4 * max(1, @abilities.wis.mod))d6" }, types: ["necrotic"] }] }
      },
      {
        name: "Soulstorm: Constitution", type: "save",
        activation: { type: "special", condition: "Part of Soulstorm" },
        target: { template: { type: "radius", size: "20", units: "ft" } },
        save: { ability: ["con"], dc: { calculation: "spellcasting" } },
        descriptionChat: "Failed save: 2 levels of exhaustion. Successful save: 1 level of exhaustion."
      },
      {
        name: "Soulstorm: Wisdom", type: "save",
        activation: { type: "special", condition: "Part of Soulstorm" },
        target: { template: { type: "radius", size: "20", units: "ft" } },
        save: { ability: ["wis"], dc: { calculation: "spellcasting" } },
        effects: [{ foundryId: "soulstormIncapac" }, { foundryId: "soulstormFrighte", onSave: true }]
      }
    ],
    effects: [
      { foundryId: "soulstormIncapac", name: "Soulstorm: Incapacitated", statuses: ["incapacitated"], duration: { seconds: 60, rounds: 10 } },
      { foundryId: "soulstormFrighte", name: "Soulstorm: Frightened", statuses: ["frightened"], description: "Frightened of the shaman (successful Wisdom save against Soulstorm)." }
    ]
  }),

  subclassSide("Psionic Reserves", "Shrouds", 2, {
    system: usesSystem("@scale.shrouds.psionic-points", "lr")
  }),
  subclassSide("Veiled Powers", "Shrouds", 2, {
    activities: [
      {
        name: "Lay on Minds", type: "utility",
        activation: { type: "action" },
        consumption: { targets: [fromPsi("2")] },
        ...range(null, "touch"),
        target: { affects: { type: "creature", count: "1" } },
        descriptionChat: "End one condition on the creature: blinded, charmed, deafened, or frightened."
      },
      {
        name: "Deliberate Defenses", type: "utility",
        activation: { type: "bonus" },
        consumption: { targets: [fromPsi("1")] },
        ...duration(1, "round"),
        target: { affects: { type: "self" } },
        effects: [{ foundryId: "deliberateDefens" }]
      },
      {
        name: "Psionic Emboldening", type: "utility",
        activation: { type: "reaction", condition: "A creature other than you within 30 feet fails a saving throw or ability check" },
        consumption: { targets: [fromPsi("1")] },
        ...range(30),
        target: { affects: { type: "creature", count: "1" } },
        descriptionChat: "The creature rerolls the failed roll and must use the new roll."
      }
    ],
    effects: [{ foundryId: "deliberateDefens", name: "Dodging", statuses: ["dodging"], duration: { rounds: 1 } }]
  }),
  subclassSide("Dissimilate", "Shrouds", 9, {
    system: usesSystem("1", "sr"),
    activities: [{
      name: "Dissimilate", type: "save",
      activation: { type: "bonus" },
      consumption: { targets: [ownUses(), fromPsi("2")] },
      target: { template: { type: "radius", size: "15", units: "ft" } },
      save: { ability: ["dex"], dc: { calculation: "spellcasting" } },
      damage: { onSave: "half", parts: [{ number: 3, denomination: 6, bonus: "@classes.shaman.levels", types: ["force"] }] },
      descriptionChat: "Roll the damage when you return from the Ethereal Plane at the start of your next turn."
    }]
  }),
  subclassSide("Take into the Veil", "Shrouds", 14, {
    activities: [
      {
        name: "Mind's Eye", type: "utility",
        activation: { type: "action" },
        consumption: { targets: [fromPsi("4")] },
        ...duration(1, "hour"),
        ...range(30),
        target: { affects: { type: "creature", count: "1" } },
        effects: [{ foundryId: "mindsEye00000000" }]
      },
      {
        name: "Mute Flesh", type: "utility",
        activation: { type: "action" },
        consumption: { targets: [fromPsi("4")] },
        ...duration(10, "minute"),
        ...range(null, "touch"),
        target: { affects: { type: "creature", count: "1" } },
        effects: [{ foundryId: "muteFlesh0000000" }]
      }
    ],
    effects: [
      {
        foundryId: "mindsEye00000000", name: "Mind's Eye", duration: { seconds: 3600 },
        description: "Advantage on Wisdom (Perception) checks that rely on hearing or sight; sees normally in magical and nonmagical darkness to 60 feet.",
        changes: [
          { key: "system.skills.prc.roll.mode", mode: "ADD", value: "1" },
          { key: "system.attributes.senses.ranges.darkvision", mode: "UPGRADE", value: "60" }
        ]
      },
      {
        foundryId: "muteFlesh0000000", name: "Mute Flesh", duration: { seconds: 600 },
        description: "Having 0 hit points does not knock this creature unconscious. It still makes death saving throws and suffers the normal effects of taking damage at 0 hit points, so it can still die."
      }
    ]
  }),
  subclassSide("Surface the Shroud", "Shrouds", 20, {
    activities: [
      {
        name: "Surface the Shroud", type: "utility",
        activation: { type: "action" },
        consumption: { targets: [fromPsi("5")] },
        ...duration(1, "minute"),
        target: { affects: { type: "self" } },
        effects: [{ foundryId: "surfaceTheShroud" }]
      },
      {
        name: "Astral Blast", type: "damage",
        activation: { type: "action", condition: "While Surface the Shroud is active" },
        consumption: { targets: [fromPsi("1")] },
        ...range(60),
        target: { affects: { type: "creature", count: "1" } },
        damage: { parts: [{ number: 3, denomination: 10, types: ["psychic"] }] }
      },
      {
        name: "Astral Banishment", type: "cast",
        activation: { type: "action", override: true, condition: "While Surface the Shroud is active" },
        consumption: { targets: [fromPsi("3")] },
        spell: { uuid: "@spell[banishment|phb]" },
        descriptionChat: "A target not native to the Astral Plane rolls its saving throw with disadvantage."
      }
    ],
    effects: [{
      foundryId: "surfaceTheShroud", name: "Surface the Shroud", duration: { seconds: 60, rounds: 10 },
      description: "Immune to blinded, charmed, deafened, and frightened. Flying speed equal to your walking speed, and you can hover. Resistance to all damage except psychic damage and damage from magical sources (only nonmagical bludgeoning, piercing, and slashing is automated; apply other nonmagical resistances by hand).",
      changes: [
        { key: "system.traits.ci.value", mode: "ADD", value: "blinded" },
        { key: "system.traits.ci.value", mode: "ADD", value: "charmed" },
        { key: "system.traits.ci.value", mode: "ADD", value: "deafened" },
        { key: "system.traits.ci.value", mode: "ADD", value: "frightened" },
        { key: "system.attributes.movement.speeds.fly", mode: "OVERRIDE", value: "@attributes.movement.speeds.walk" },
        { key: "system.attributes.movement.hover", mode: "OVERRIDE", value: "true" },
        { key: "system.traits.dr.value", mode: "ADD", value: "bludgeoning" },
        { key: "system.traits.dr.value", mode: "ADD", value: "piercing" },
        { key: "system.traits.dr.value", mode: "ADD", value: "slashing" },
        { key: "system.traits.dr.bypasses", mode: "ADD", value: "mgc" }
      ]
    }]
  }),

  subclassSide("Council Martial Training", "Traditions", 2, {
    entryData: {
      armorProficiencies: [{ medium: true }],
      weaponProficiencies: [{ choose: { fromFilter: "type=martial weapon|miscellaneous=mundane|property=melee weapon", count: 1 } }]
    }
  }),
  subclassSide("Battle Trance", "Traditions", 2, {
    system: usesSystem("1", "sr"),
    activities: [
      stanceActivity("Overwhelming Stance", "overwhelmingStan"),
      stanceActivity("Parrying Stance", "parryingStance00"),
      stanceActivity("Agile Stance", "agileStance00000"),
      stanceActivity("Meditative Stance", "meditativeStance", 5),
      stanceActivity("All Stances (Ancient Teachings)", "ancientTeachTran", 20)
    ],
    effects: [
      stanceEffect("overwhelmingStan", "Battle Trance: Overwhelming Stance", "Add your proficiency bonus to damage when you attack with a shaman weapon (automated for all melee weapon attacks; remove it by hand for non-shaman weapons).", [OVERWHELMING_CHANGE]),
      stanceEffect("parryingStance00", "Battle Trance: Parrying Stance", "Use your reaction to give an attack against you disadvantage if it does not have advantage."),
      stanceEffect("agileStance00000", "Battle Trance: Agile Stance", "Use your bonus action to take the Dash or Disengage action."),
      stanceEffect("meditativeStance", "Battle Trance: Meditative Stance", "You can keep concentrating on a shaman spell cast during the trance even if you fail the saving throw for taking damage, but the spell ends when the trance ends."),
      stanceEffect("ancientTeachTran", "Battle Trance: All Stances", "All stances apply at once, and you gain a bonus to AC equal to your Wisdom modifier (minimum +1).", [
        OVERWHELMING_CHANGE,
        { key: "system.attributes.ac.bonus", mode: "ADD", value: "+max(1, @abilities.wis.mod)" }
      ])
    ]
  }),
  subclassSide("Relentless Trance", "Traditions", 14, {
    activities: [{
      name: "Reset Battle Trance", type: "utility",
      activation: { type: "bonus", condition: "You kill a creature while your Battle Trance is active" },
      target: { affects: { type: "self" } },
      descriptionChat: "Reset the Battle Trance duration to 1 minute (reapply the same stance effect). You can't choose another stance."
    }]
  }),
  subclassSide("Ancient Teachings", "Traditions", 20, {
    effects: [{
      name: "Ancient Teachings", transfer: true,
      changes: [
        { key: "system.abilities.str.value", mode: "ADD", value: "2" },
        { key: "system.abilities.wis.value", mode: "ADD", value: "2" },
        { key: "system.abilities.str.max", mode: "UPGRADE", value: "22" },
        { key: "system.abilities.wis.max", mode: "UPGRADE", value: "22" }
      ]
    }]
  }),

  subclassSide("Instinctive Portents", "Omens", 2, {
    system: usesSystem("1 + @abilities.wis.mod", "lr"),
    activities: [{
      name: "Swap Initiative", type: "utility",
      activation: { type: "special", condition: "Immediately after rolling initiative, with a willing ally you can see who has a lower initiative" },
      consumption: { targets: [ownUses()] },
      target: { affects: { type: "ally", count: "1" } }
    }],
    effects: [{
      name: "Instinctive Portents", transfer: true,
      description: "Add your proficiency bonus to initiative rolls while you are not incapacitated.",
      changes: [{ key: "system.attributes.init.roll.bonus", mode: "ADD", value: "@prof" }]
    }]
  }),
  subclassSide("Shielded by Fate", "Omens", 5, {
    activities: [
      fateShieldActivity("Shielded by Fate", { type: "special", condition: "After you finish a long rest, holding your augury" }, []),
      fateShieldActivity("Shielded by Fate (Resonance)", { type: "action", condition: "After you finish a short rest" }, [linkedUses("classFeature", RESONANCE_UID, "1")])
    ]
  }),
  subclassSide("Voice of Forthcomings", "Omens", 9, {
    entryData: { skillProficiencies: [{ persuasion: true, intimidation: true }] }
  }),
  subclassSide("Alter Fate", "Omens", 20, {
    system: { "uses.max": "1" },
    activities: [{
      name: "Alter Fate", type: "utility",
      activation: { type: "action" },
      consumption: { targets: [ownUses()] },
      target: { affects: { type: "self" } },
      roll: { formula: "1d100", name: "33 or lower: never usable again", visible: true },
      descriptionChat: "Time resets to your designated point; only you remember the reset time. Restore this feature's use by hand when you reach the point where you last used it."
    }]
  })
];

const FREEZING_SURFACES = "Nonmagical susceptible surfaces, such as any liquid, freeze inside the spell's area, becoming difficult terrain.";
const ACTION = [{ number: 1, unit: "action" }];
const feet = amount => ({ type: "point", distance: { type: "feet", amount } });
const selfArea = (type, amount) => ({ type, distance: { type: "feet", amount } });
const TOUCH = { type: "point", distance: { type: "touch" } };
const INSTANT = [{ type: "instant" }];
const timed = (amount, type = "minute", concentration = false) => [{ type: "timed", duration: { type, amount }, ...(concentration ? { concentration: true } : {}) }];
const higherLevels = text => [{ type: "entries", name: "At Higher Levels", entries: [text] }];
const spellLists = (...names) => ({
  fromClassList: names.map(name => (name === CLASS ? { name: CLASS, source: SRC } : { name, source: "PHB" }))
});
const homebrewSpell = ({ name, page, level, school, time = ACTION, range, components, duration, entries, higher, lists, ...tags }) => ({
  name, source: SRC, page, level, school, time, range, components, duration, entries,
  ...(higher ? { entriesHigherLevel: higherLevels(higher) } : {}),
  classes: spellLists(...lists),
  ...tags
});

const spells = [
  homebrewSpell({
    name: "Transmogrify", page: 15, level: 2, school: "T",
    time: [{ number: 1, unit: "reaction", condition: "which you take when you see a creature within 60 feet of you casting a spell that deals damage" }],
    range: feet(60), components: { s: true }, duration: INSTANT,
    entries: [
      "Your spell twists the original spell's energy. If the creature is casting a spell of 2nd level or lower, choose acid, cold, fire, lightning, or thunder. The spell deals damage of the chosen type instead of its original type. If the spell deals more than one type of damage, the first type to occur is replaced.",
      "If it is casting a spell of 3rd level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, choose acid, cold, fire, lightning, or thunder. The spell deals damage of the chosen type instead of its original type. If the spell deals more than one type of damage, the first type to occur is replaced."
    ],
    higher: "When you cast this spell using a spell slot of 3rd level or higher, the interrupted spell has its first damage type changed if its level is less than or equal to the level of the spell slot you used.",
    lists: [CLASS, "Sorcerer"],
    miscTags: ["SGT"]
  }),
  homebrewSpell({
    name: "Erratic Wisp", page: 15, level: 3, school: "T",
    time: [{ number: 1, unit: "bonus" }],
    range: TOUCH, components: { v: true, s: true, m: "a pinch of moth dust" }, duration: timed(1, "minute", true),
    entries: [
      "You touch a willing creature and make its body unstable, swirling in clouds. For the duration, after the target takes damage, it teleports to a random spot around itself. To determine the direction, roll a {@dice d8} and assign a direction to each die face. To determine the distance, roll a {@dice d6} and multiply it by 5, then choose the closest unoccupied space in the given direction and distance. The chosen space must be on a surface or in a liquid that can support the target without the target having to squeeze.",
      "The target can dismiss this spell as an action."
    ],
    lists: [CLASS],
    miscTags: ["TP"]
  }),
  homebrewSpell({
    name: "Electric Discharge", page: 15, level: 1, school: "V",
    range: feet(60), components: { v: true, s: true }, duration: INSTANT,
    entries: ["You unleash a jolt of energy from your hands toward your opponent. Make a ranged spell attack against a creature you can see within range. On a hit, the target takes {@damage 3d6} lightning damage and is {@condition stunned} until the start of its next turn."],
    higher: "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by {@scaledamage 3d6|1-9|1d6} for each slot level above 1st, and the target is stunned until the end of your next turn.",
    lists: [CLASS, "Sorcerer", "Wizard"],
    damageInflict: ["lightning"], conditionInflict: ["stunned"], spellAttack: ["R"]
  }),
  homebrewSpell({
    name: "Vacuum Touch", page: 15, level: 3, school: "V",
    range: TOUCH,
    components: { v: true, s: true, m: { text: "a pinch of gold dust worth 1 gp, which the spell consumes", cost: 100, consume: true } },
    duration: timed(1),
    entries: [
      "Make a melee spell attack against a creature. On a hit, that creature takes {@damage 3d8} lightning damage, and if it needs to breathe, it must succeed on a Constitution saving throw. On a failed save, its breath leaves it and it begins suffocating. It can repeat the saving throw at the end of each of its turns, ending the effect on a success.",
      "The spell ends early if the creature becomes incapacitated or is dying."
    ],
    higher: "When you cast this spell using a spell slot of 4th level or higher, the damage increases by {@scaledamage 3d8|3-9|1d8} for each slot level above 3rd.",
    lists: [CLASS, "Sorcerer", "Warlock"],
    damageInflict: ["lightning"], savingThrow: ["constitution"], spellAttack: ["M"]
  }),
  homebrewSpell({
    name: "Blinding Radiance", page: 15, level: 1, school: "V",
    range: selfArea("cube", 15), components: { v: true, s: true }, duration: timed(1, "minute", true),
    entries: [
      "Eye-piercing light erupts from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. A creature takes {@damage 2d6} radiant damage on a failed save, or half as much damage on a successful one.",
      "In addition, for the duration of the spell, you shed bright light in a 5-foot radius and dim light for an additional 10 feet. Creatures standing in the bright light are {@condition blinded} by it."
    ],
    higher: "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by {@scaledamage 2d6|1-9|1d6} for each slot level above 1st.",
    lists: [CLASS, "Sorcerer"],
    damageInflict: ["radiant"], savingThrow: ["constitution"], conditionInflict: ["blinded"], miscTags: ["LGT"]
  }),
  homebrewSpell({
    name: "Closed Circuit", page: 15, level: 6, school: "C",
    range: selfArea("radius", 10), components: { v: true, s: true, m: true }, duration: timed(1, "minute", true),
    entries: [
      "The air explodes around you as you let out an unnatural pressure of air. Each creature within 10 feet of you must make a Constitution saving throw. A creature takes {@damage 8d8} lightning damage on a failed save, or half as much damage on a successful one.",
      "The spell creates a 5-foot-wide ring of black clouds at the edge of the circle. For the duration, whenever a creature enters the cloud or starts its turn there, it must succeed on a Constitution saving throw or become {@condition stunned} for the duration. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
    ],
    higher: "When you cast this spell using a spell slot of 7th level or higher, the damage increases by {@scaledamage 8d8|6-9|1d8} for each slot level above 6th.",
    lists: ["Druid", CLASS, "Sorcerer", "Warlock"],
    damageInflict: ["lightning"], savingThrow: ["constitution"], conditionInflict: ["stunned"]
  }),
  homebrewSpell({
    name: "Blinding Squall", page: 16, level: 2, school: "C",
    range: feet(60), components: { v: true, s: true, m: true }, duration: timed(1),
    entries: ["You conjure a raging storm around a point you choose within range. Each creature in a 10-foot-radius circle around the chosen point must make a Dexterity saving throw. A creature takes {@damage 2d6} lightning damage on a failed save, or half as much damage on a successful one. Then those creatures must make a Constitution saving throw or be {@condition blinded} until the end of their next turn."],
    higher: "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by {@scaledamage 2d6|2-9|1d6} for each slot level above 2nd.",
    lists: ["Druid", CLASS, "Sorcerer"],
    damageInflict: ["lightning"], savingThrow: ["dexterity", "constitution"], conditionInflict: ["blinded"]
  }),
  homebrewSpell({
    name: "Fossil Strike", page: 16, level: 2, school: "C",
    range: feet(60), components: { s: true, m: "a small stone" }, duration: INSTANT,
    entries: ["You summon a globe of mud and oil and hurl it toward your enemies. Choose a point within range. Each creature within 10 feet of that point must make a Dexterity saving throw. A creature takes {@damage 3d8} bludgeoning damage on a failed save, or half as much damage on a successful one. As the globe explodes, oil splatters around, making the affected area difficult terrain."],
    higher: "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by {@scaledamage 3d8|2-9|1d8} for each slot level above 2nd.",
    lists: ["Druid", CLASS, "Sorcerer"],
    damageInflict: ["bludgeoning"], savingThrow: ["dexterity"]
  }),
  homebrewSpell({
    name: "Decaying Touch", page: 16, level: 1, school: "N",
    range: TOUCH, components: { s: true }, duration: timed(1),
    entries: [
      "Make a melee spell attack against a creature you can reach. On a hit, the target takes {@damage 2d8} necrotic damage and must succeed on a Constitution saving throw or be decayed by this spell's curse for 1 minute.",
      "If a decayed creature would regain hit points, it takes that much necrotic damage instead. A decayed creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
    ],
    higher: "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by {@scaledamage 2d8|1-9|1d8} for each slot level above 1st.",
    lists: ["Druid", CLASS, "Sorcerer", "Warlock"],
    damageInflict: ["necrotic"], savingThrow: ["constitution"], spellAttack: ["M"]
  }),
  homebrewSpell({
    name: "Ice Fan", page: 16, level: 2, school: "V",
    range: feet(120), components: { v: true, s: true }, duration: INSTANT,
    entries: ["You create three fans of ice and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each fan. On a hit, the target takes {@damage 1d8} cold damage, and its speed is reduced by 10 feet until the start of your next turn."],
    higher: "When you cast this spell using a spell slot of 3rd level or higher, you create one additional fan for each slot level above 2nd.",
    lists: ["Druid", CLASS, "Sorcerer"],
    damageInflict: ["cold"], spellAttack: ["R"]
  }),
  homebrewSpell({
    name: "Winter Blast", page: 16, level: 2, school: "C",
    range: feet(90), components: { v: true, s: true, m: "a pinch of cinnamon and a cup of water" }, duration: INSTANT,
    entries: [
      "You conjure the power of winter cold to unleash on your enemies in a 10-foot-tall cylinder with a 10-foot radius centered on a point you choose within range. Each creature in the cylinder must make a Constitution saving throw. A creature takes {@damage 3d8} cold damage on a failed save, or half as much damage on a successful one.",
      FREEZING_SURFACES
    ],
    higher: "When you cast this spell using a spell slot of 3rd level or higher, the damage increases by {@scaledamage 3d8|2-9|1d8} for each slot level above 2nd.",
    lists: ["Druid", CLASS, "Sorcerer", "Wizard"],
    damageInflict: ["cold"], savingThrow: ["constitution"], areaTags: ["Y"]
  }),
  homebrewSpell({
    name: "Hail Strike", page: 16, level: 3, school: "C",
    range: feet(120), components: { v: true, s: true, m: "a drop of water and a piece of glass" }, duration: INSTANT,
    entries: [
      "White crystals of ice plummet to the ground at three different points you can see within range, within 10 feet of each other. Each creature in a 5-foot radius centered on each point you choose must make a Dexterity saving throw. A creature takes {@damage 2d8} cold damage on a failed save, or half as much damage on a successful one. A creature in the area of more than one icy burst can be affected more than once by this spell.",
      FREEZING_SURFACES
    ],
    higher: "When you cast this spell using a spell slot of 5th level or higher, the damage increases by {@dice 1d8} for every two slot levels above 3rd.",
    lists: [CLASS, "Sorcerer", "Wizard"],
    damageInflict: ["cold"], savingThrow: ["dexterity"]
  }),
  homebrewSpell({
    name: "Cryogenic Stasis", page: 17, level: 4, school: "V",
    range: feet(60), components: { v: true, s: true }, duration: timed(1, "round"),
    entries: ["Choose a creature you can see within range. If the creature is willing, you can freeze it for 1 round. While frozen this way, the creature is {@condition incapacitated}, has a speed of 0, and has resistance to every damage type except fire. At the start of your next turn, the creature regains {@dice 3d8} hit points as the ice melts."],
    higher: "When you cast this spell using a spell slot of 5th level or higher, the healing increases by {@scaledice 3d8|4-9|1d8} for each slot level above 4th.",
    lists: ["Druid", CLASS, "Sorcerer"],
    conditionInflict: ["incapacitated"], miscTags: ["HL"]
  }),
  homebrewSpell({
    name: "Cold Outburst", page: 17, level: 1, school: "C",
    range: feet(30), components: { v: true, s: true }, duration: INSTANT,
    entries: [
      "You emit an outburst of cold originating from you. Each creature around you within range must succeed on a Constitution saving throw or take {@damage 1d8} cold damage and have its speed reduced by 5 feet until the end of its next turn.",
      FREEZING_SURFACES
    ],
    higher: "When you cast this spell using a spell slot of 2nd level or higher, the damage increases by {@scaledamage 1d8|1-9|1d8} for each slot level above 1st.",
    lists: ["Druid", CLASS, "Sorcerer", "Wizard"],
    damageInflict: ["cold"], savingThrow: ["constitution"]
  }),
  homebrewSpell({
    name: "Hail Storm", page: 17, level: 5, school: "C",
    range: selfArea("radius", 20), components: { v: true, s: true, m: "a drop of water" }, duration: timed(1, "minute", true),
    entries: [
      "You evoke the power of the ancient frost as shards of icy glass rain down. When you cast the spell, and on each of your subsequent turns for the duration, you can use your bonus action to choose two points within range. Each creature within 5 feet of those points must succeed on a Dexterity saving throw or take {@damage 3d8} cold damage.",
      FREEZING_SURFACES
    ],
    higher: "When you cast this spell using a spell slot of 6th level or higher, the damage increases by {@dice 1d8} for every two slot levels above 5th.",
    lists: ["Druid", CLASS, "Sorcerer"],
    damageInflict: ["cold"], savingThrow: ["dexterity"]
  })
];

const homebrew = {
  _meta: meta,
  class: [shamanClass],
  subclass: subclasses,
  classFeature: classFeatures,
  subclassFeature: subclassFeatures,
  optionalfeature: optionalFeatures,
  spell: spells,
  foundryClassFeature,
  foundrySubclassFeature
};

fs.writeFileSync(OUT_FILE, JSON.stringify(homebrew, null, "\t") + "\n");
console.log(`Wrote ${OUT_FILE}`);
