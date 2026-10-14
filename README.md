# Shaman (Sarungard) for Foundry VTT dnd5e + Plutonium

Converted from `Shaman Class - The Homebrewery.pdf`.

| File | What it is |
|------|------------|
| `Sarungard; Shaman.json` | 5etools homebrew file. Plutonium imports the class, the 5 councils, the focus and fighting style options, and the 2 new spells from it. |
| `sarungard-shaman/` | Small Foundry module. It is required for the Shaman spell slot table and for Natural Armor. |
| `build/build-shaman.mjs` | Generator for the JSON. Edit it and run `node build/build-shaman.mjs` to rebuild. |

Targets **dnd5e 6.x on Foundry v14** (what The Forge runs when kept on the newest versions). Checked against the dnd5e 6.0.6 source. Module version 1.1.0 needs dnd5e 6. Version 1.0.0 was the dnd5e 5.x build.

## Install

1. Install the companion module from its manifest URL:
   `https://github.com/Sarungard/sarungard-shaman/releases/latest/download/module.json`
   - **Foundry:** go to Setup → Add-on Modules → Install Module, and paste it into "Manifest URL".
   - **The Forge:** open forge-vtt.com/bazaar and choose **Install from Manifest**. Paste it, and untick "Install from the Bazaar if the package is found".
   - **Offline:** download `sarungard-shaman.zip` from the latest release and unzip it into `Data/modules/sarungard-shaman/`, or use The Forge's Import Wizard.
2. Enable **Shaman Class Support (Sarungard)** in the world's module settings.
3. In Plutonium, load the homebrew file. You can load it from a local copy of `Sarungard; Shaman.json` or from its raw URL:
   `https://raw.githubusercontent.com/Sarungard/sarungard-shaman/main/Sarungard%3B%20Shaman.json` Then import the **Shaman** class with the Class importer. Plutonium 2.19+ supports dnd5e 6 on Foundry v14. Note that the Plutonium wiki lists The Forge as an unsupported host.
   - Plutonium asks for a Shamanic Focus at level 1 and a Fighting Style at level 3.
4. Import the shaman spells you want with Plutonium's Spell importer. Transmogrify and Erratic Wisp come from the same file. The other spells come from the official books.

## How spell slots work

Foundry has no "two-thirds caster" progression, so the module adds a **Shaman** progression:

- **Single-classed shaman:** gets the exact slots from the PDF table, up to 7th-level slots at level 18.
- **Multiclassed with another full, half or third caster:** the shaman adds floor(2/3 × shaman level) to the multiclass table. For example, a shaman 3 / wizard 4 is a 6th-level caster.
- **Warlock Pact Magic** stays separate, as usual.
- **Manual slot overrides** on the character sheet still win.

The class item's Spellcasting Progression should read "Shaman (own table, 2/3 when multiclassed)". The module sets it automatically when a class with identifier `shaman` is created. If it shows "None", pick it in the class item's dropdown.

## What is automated

- **Natural Armor:** the module adds an armored-only AC calculation, "armor + Constitution modifier (capped by the armor's Dexterity cap)". dnd5e 6 picks it whenever it beats the normal armored AC. It shows as "Natural Armor (Shaman)" in the AC breakdown. Requires the module.
- **Limited uses with recharge:** Resonance (1/2/3 by level), Harmony (regains a Resonance use), Totemic Focus (1/SR, 2/SR at 7th), Imposing Chant (PB/SR), Blood Harvest, Embodiment of Wrath, Festival of Immortals, Dissimilate, and Battle Trance.
- **Pools:** Psionic Points (2/4/6/8/10) and the Harvest soul jar (Bounded Spirits, max = Wisdom modifier, minimum 1). Every psionic and soul ability spends from the right pool.
- **Hit-dice features:** Commanded Sanguinity, Bloodlust and Blood Harvest spend d8 Hit Dice and roll the necrotic damage. Use the scaling slider to choose how many dice (Sanguinity allows 2/3/4 by level).
- **Rolls:** Soul Drain (scale = the soul's CR), Soulstorm (three saves), Dissimilate, Astral Blast, Interception, and the fire familiar burst.
- **Cast activities:** Spiritual Focus casts Healing Spirit, Hold Person, Enhance Ability or Magic Weapon at 2nd level once per long rest. Elemental Resonance casts Find Familiar for 2 Resonance uses.
- **Summon:** Festival of Immortals summons Specters, one per point of the soul's CR.
- **Effects:**
  - Battle Trance stance effects; Ancient Teachings gets all stances plus Wisdom to AC.
  - Ancient Teachings: +2 Str/Wis, maximum 22.
  - Blind Fighting blindsight.
  - Mind's Eye (advantage on Perception and darkvision 60).
  - Surface the Shroud (condition immunities, fly and hover, resistance to nonmagical physical damage).
  - Soulstorm's incapacitated and frightened conditions.
  - Deliberate Defenses (dodging).
- **Always-prepared spells:** Find Familiar (Elements), Hex and Bestow Curse (Harvest), and the Council of Shrouds spell table.
- **Spellbook:** when you reach a shaman level that unlocks a new spell level (2, 4, 6, 9, 12, 15 and 18), Plutonium adds every shaman spell of that level to the sheet. They arrive **marked prepared**, so untick them down to your limit (Wisdom modifier + half your shaman level). Plutonium's usual spell picker can't be used here: it depends on a standard caster progression, which would also overwrite the Shaman slot table.

## Known approximations

- **Overwhelming Stance** adds proficiency bonus to *all* melee weapon damage. Turn the effect off for non-shaman weapons.
- **Surface the Shroud** automates resistance to nonmagical bludgeoning, piercing and slashing only. Foundry can't express "all nonmagical damage except psychic".
- **Archon of Fundaments** recharges after 1d8 days. Restore its use by hand.
- **Aura and trigger features** are reminders with buttons, not automatic triggers: Embodiment of Wrath's aura, Destructive Resonance and Grim Echoes.
- **Wild Cunning** is an Unearthed Arcana spell (UA: Starter Spells). It only resolves if that UA source is loaded in Plutonium.

## Choices made during conversion

- Spelling and grammar were cleaned up. Mechanics are unchanged.
- **Commanded Sanguinity:** the PDF is missing a word. The bonus goes to the attack's **damage roll**.
- **Resonance:** says "You can use your Resonance once" at 3rd level, matching the table's "Resonance(x1)".
- **Not included:** the WIP **Ritualistic** background (its "Endurance" skill doesn't exist and its Ideals have no text) and the unfinished Council of Omens.
- **Multiclass proficiencies:** the PDF doesn't say what you gain when multiclassing *into* Shaman. As decided: light armor, shields, and one musical instrument.
- **Fighting styles:** Blind Fighting and Interception (*Tasha's Cauldron of Everything*) and Tunnel Fighter (UA: *Light, Dark, Underdark!*) are not reproduced here. They are `_copy` links to the official entries. The file declares `TCE` and `UALightDarkUnderdark` as `optionalfeature` dependencies. Without those, Plutonium can't find the entries to copy. `UALightDarkUnderdark` is fetched from the 5etools UA repository. Great Weapon Fighting, Protection and Two-Weapon Fighting are SRD 5.1 text.

## License

The Shaman class is © Sarungard and licensed under [CC BY-NC 4.0](LICENSE). It includes SRD 5.1 material by Wizards of the Coast LLC, used under CC BY 4.0 (see [LICENSE](LICENSE)).
