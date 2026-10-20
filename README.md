# Sarungard's Almanach

Sarungard's homebrew for Foundry VTT dnd5e, imported with Plutonium. Converted from the Homebrewery brews.

| File | What it is |
|------|------------|
| `Sarungard; Shaman.json` | **Shaman** class: the class, the 6 councils, the focus and fighting style options, and the 15 homebrew spells. |
| `Sarungard; Iceborn.json` | **Iceborn**, a sorcerous origin for the PHB Sorcerer. It uses the Shaman file's frost spells, so load both. |
| `sarungard-shaman/` | Small Foundry module, required by the Shaman for its spell slot table and Natural Armor. Iceborn doesn't need it. |
| `build/build-shaman.mjs`, `build/build-iceborn.mjs` | Generators for the two JSON files. Edit one and run it with `node` to rebuild. |

Targets **dnd5e 6.x on Foundry v14** (what The Forge runs when kept on the newest versions). Checked against the dnd5e 6.0.6 source.

## Homebrew links for Plutonium

Add both under **Game Settings → Configure Settings → Plutonium → Open Config Editor → Data Sources → Additional Homebrew Files**, then reload Foundry (F5):

- `https://raw.githubusercontent.com/Sarungard/sarungard-almanach/main/Sarungard%3B%20Shaman.json`
- `https://raw.githubusercontent.com/Sarungard/sarungard-almanach/main/Sarungard%3B%20Iceborn.json`

Plutonium keeps homebrew in memory only, so this setting is what makes the files load in every session, before anything looks them up. Pick them from the homebrew sources in the importers, not "Custom URL", which would load them a second time.

# Shaman

## Install

1. Install the companion module from its manifest URL:
   `https://github.com/Sarungard/sarungard-almanach/releases/latest/download/module.json`
   - **Foundry:** go to Setup → Add-on Modules → Install Module, and paste it into "Manifest URL".
   - **The Forge:** open forge-vtt.com/bazaar and choose **Install from Manifest**. Paste it, and untick "Install from the Bazaar if the package is found".
   - **Offline:** download `sarungard-shaman.zip` from the latest release and unzip it into `Data/modules/sarungard-shaman/`, or use The Forge's Import Wizard.
2. Enable **Shaman Class Support (Sarungard)** in the world's module settings.
3. Register the Shaman homebrew link (see "Homebrew links for Plutonium" above) and reload Foundry.
4. In Plutonium's Class importer, pick the Shaman from the homebrew sources and import.
   - Plutonium asks for a Shamanic Focus at level 1 and a Fighting Style at level 3.
5. Plutonium 2.19+ supports dnd5e 6 on Foundry v14. Note that the Plutonium wiki lists The Forge as an unsupported host.

### Updating

Updates arrive by themselves: Plutonium fetches the link fresh on every load. After a new version is pushed, reload Foundry (GitHub's cache can take about 5 minutes) and re-import the class on a character to pick up the changes.

## How spell slots work

Foundry has no "two-thirds caster" progression, so the module adds a **Shaman** progression:

- **Single-classed shaman:** gets the exact slots from the class table, up to 7th-level slots at level 18.
- **Multiclassed with another full, half or third caster:** the shaman adds floor(2/3 × shaman level) to the multiclass table. For example, a shaman 3 / wizard 4 is a 6th-level caster.
- **Warlock Pact Magic** stays separate, as usual.
- **Manual slot overrides** on the character sheet still win.

The class item's Spellcasting Progression should read "Shaman (own table, 2/3 when multiclassed)". The module sets it automatically when a class with identifier `shaman` is created. If it shows "None", pick it in the class item's dropdown.

## What is automated

- **Natural Armor:** the module adds two AC calculations, "armor + Wisdom modifier (capped by the armor's Dexterity cap)" in light or medium armor and "10 + Wisdom modifier" without armor. dnd5e 6 picks them whenever they beat the normal AC; heavy armor is unaffected. They show as "Natural Armor (Shaman)" in the AC breakdown. Requires the module.
- **Limited uses with recharge:** Resonance (1/2/3 by level), Harmony (regains a Resonance use), Totemic Focus (1/SR, 2/SR at 7th), Imposing Chant (PB/SR), Blood Harvest, Embodiment of Wrath, Festival of Immortals, Dissimilate, Battle Trance, and Instinctive Portents (1 + Wisdom modifier per long rest).
- **Pools:** Psionic Points (2/4/6/8/10) and the Harvest soul jar (Bounded Spirits, max = Wisdom modifier, minimum 1). Every psionic and soul ability spends from the right pool.
- **Hit-dice features:** Commanded Sanguinity, Bloodlust and Blood Harvest spend d8 Hit Dice and roll the necrotic damage. Use the scaling slider to choose how many dice (Sanguinity allows 2/3/4 by level). Shielded by Fate spends 1/2/3 Hit Dice by level and gives each target the rolled temporary hit points; its short-rest use also spends a Resonance use.
- **Rolls:** Soul Drain (scale = the soul's CR), Soulstorm (three saves), Dissimilate, Astral Blast, Interception, the fire familiar burst, and Alter Fate's 33% check.
- **Cast activities:** Spiritual Focus casts Healing Spirit, Hold Person, Enhance Ability or Magic Weapon at 2nd level once per long rest. Elemental Resonance casts Find Familiar for 2 Resonance uses. Surface the Shroud casts Banishment for 3 psionic points.
- **Summon:** Festival of Immortals summons Specters, one per point of the soul's CR.
- **Effects:**
  - Battle Trance stance effects; Ancient Teachings gets all stances plus Wisdom to AC.
  - Ancient Teachings: +2 Str/Wis, maximum 22.
  - Instinctive Portents: proficiency bonus to initiative.
  - Blind Fighting blindsight.
  - Mind's Eye (advantage on Perception and darkvision 60).
  - Surface the Shroud (condition immunities, fly and hover, resistance to nonmagical physical damage).
  - Soulstorm's incapacitated and frightened conditions.
  - Deliberate Defenses (dodging).
- **Always-prepared spells:** Find Familiar (Elements), Hex and Bestow Curse (Harvest), and the Council of Shrouds and Council of Omens spell tables. Omens also gets Augury (1/day) and Divination (1/long rest, from 6th) as free casts, and the Guidance and Resistance cantrips at 9th.
- **Spellbook:** when you reach a shaman level that unlocks a new spell level (2, 4, 6, 9, 12, 15 and 18), Plutonium adds every shaman spell of that level to the sheet. They arrive **marked prepared**, so untick them down to your limit (Wisdom modifier + half your shaman level). Plutonium's usual spell picker can't be used here: it depends on a standard caster progression, which would also overwrite the Shaman slot table.
- **Homebrew spells:** Plutonium builds their activities (attacks, saves, damage) from the spell data when you import them.

## Known approximations

- **Overwhelming Stance** adds proficiency bonus to *all* melee weapon damage. Turn the effect off for non-shaman weapons.
- **Surface the Shroud** automates resistance to nonmagical bludgeoning, piercing and slashing only. Foundry can't express "all nonmagical damage except psychic". The Banishment disadvantage against creatures not native to the Astral Plane is a reminder.
- **Archon of Fundaments** recharges after 1d8 days, and **Alter Fate** recharges when you reach your last reset point. Restore their uses by hand.
- **Aura and trigger features** are reminders with buttons, not automatic triggers: Embodiment of Wrath's aura, Destructive Resonance, Grim Echoes, Voice of Forthcomings' cantrip effects and Flicker of Fate's haste.
- **Bonecarver's Tools** is not a standard 5e tool, so the proficiency is text only.
- **Wild Cunning** is an Unearthed Arcana spell (UA: Starter Spells). It only resolves if that UA source is loaded in Plutonium.

## Choices made during conversion

- Spelling and grammar were cleaned up. Mechanics are unchanged.
- **Natural Armor:** "Wisdom score" is read as the Wisdom **modifier**.
- **Commanded Sanguinity:** the source is missing a word. The bonus goes to the attack's **damage roll**.
- **Resonance:** says "You can use your Resonance once" at 3rd level, matching the table's "Resonance(x1)".
- **Council of Omens:** its Council Spells text pointed at the "Council of Shrouds Spells table"; it now points at the Omens table. "Divinitation" is read as Divination.
- **Higher-level damage:** Electric Discharge, Vacuum Touch, Blinding Radiance, Closed Circuit, Blinding Squall, Fossil Strike and Decaying Touch increase their damage by 1dX **for each slot level** above the spell's level (the brew text omitted "for each slot level"; confirmed by Sarungard). Closed Circuit and Blinding Squall list an unspecified material component.
- **Fossil Strike** is on the 2nd-level shaman list, following its own "Spell lists" line.
- **Not included yet:** Slow Current (its text is a copy of Hail Strike), the Council of Torture (placeholder), and the Ritualistic background (its "Endurance" skill doesn't exist in 5e).
- **Multiclass proficiencies:** the source doesn't say what you gain when multiclassing *into* Shaman. As decided: light armor, shields, and one musical instrument.
- **Fighting styles:** Blind Fighting and Interception (*Tasha's Cauldron of Everything*) and Tunnel Fighter (UA: *Light, Dark, Underdark!*) are not reproduced here. They are `_copy` links to the official entries. The file declares `TCE` and `UALightDarkUnderdark` as `optionalfeature` dependencies. Without those, Plutonium can't find the entries to copy. `UALightDarkUnderdark` is fetched from the 5etools UA repository. Great Weapon Fighting, Protection and Two-Weapon Fighting are SRD 5.1 text.

# Iceborn (sorcerous origin)

A frost origin for the **PHB Sorcerer** (features at 1st, 6th, 14th and 18th level). Plutonium also copies 2014 origins onto the 2024 Sorcerer, but the sorcery-point links below target the PHB Sorcerer's pool.

## Install

1. Register **both** homebrew links (see "Homebrew links for Plutonium" above): Iceborn's Origin Spells include six of the Shaman file's spells (Cold Outburst, Ice Fan, Winter Blast, Hail Strike, Cryogenic Stasis, Hail Storm).
2. Reload Foundry, then pick Iceborn as the Sorcerer's subclass in Plutonium's Class importer. The companion module is not needed.

## What is automated

- **Origin Spells:** added at sorcerer levels 1, 3, 5, 7 and 9; they don't count against spells known.
- **Lingering Chill:** uses = Charisma modifier (minimum 1), back on a short or long rest. One button per effect (slow, no reactions, numbed attack from 6th, brittle cold vulnerability from 14th), each applying a 1-round effect to the target, plus "Regain Use (1 Sorcery Point)".
- **Arctic Outburst:** cold damage to creatures of your choice within 10 feet; scale it to the sorcery points you just spent (half your sorcerer level, rounded up, + points).
- **Cold Capsule:** permanent cold resistance; Crystalline Scales rolls the damage reduction (sorcerer level + Charisma modifier) and applies fire vulnerability plus bludgeoning, piercing and slashing resistance until your next turn. Once per short rest, or 2 sorcery points.
- **Icicle Storm:** Constitution save against your spell save DC for 4d6 + 1d6 per spell level (scale once per spell level above 6th). Once per long rest, or 2 + spell level sorcery points.

## Known approximations

- **Speed, reactions and disadvantage** from Lingering Chill are effect reminders; only the cold vulnerability is applied automatically, and a target's cold resistance has to be removed by hand while it lasts.
- **Curse of Winter** (any number of targets) means using the Lingering Chill buttons once per target.
- **Icicle Storm ignores resistances and immunities**: apply its damage by hand as true damage. Its save DC isn't stated in the brew, so it uses your spell save DC.

## Choices made during conversion

- **Cold Capsule:** the brew says "Charisma score"; as decided, it is the Charisma **modifier**.
- **Lingering Chill:** "minimum of once" added, as decided.

## License

Both the Shaman class and Iceborn are © Sarungard and licensed under [CC BY-NC 4.0](LICENSE). It includes SRD 5.1 material by Wizards of the Coast LLC, used under CC BY 4.0 (see [LICENSE](LICENSE)).
