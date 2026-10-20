# Shaman (Sarungard) for Foundry VTT dnd5e + Plutonium

Converted from the revised Shaman brew on Homebrewery (`Shaman Class - Revised.pdf`).

| File | What it is |
|------|------------|
| `Sarungard; Shaman.json` | 5etools homebrew file. Plutonium imports the class, the 6 councils, the focus and fighting style options, and the 15 homebrew spells from it. |
| `sarungard-shaman/` | Small Foundry module. It is required for the Shaman spell slot table and for Natural Armor. |
| `build/build-shaman.mjs` | Generator for the JSON. Edit it and run `node build/build-shaman.mjs` to rebuild. |

Targets **dnd5e 6.x on Foundry v14** (what The Forge runs when kept on the newest versions). Checked against the dnd5e 6.0.6 source. Homebrew version 2.0.0 is the revised edition; module 1.2.0 goes with it.

## Install

1. Install the companion module from its manifest URL:
   `https://github.com/Sarungard/sarungard-shaman/releases/latest/download/module.json`
   - **Foundry:** go to Setup → Add-on Modules → Install Module, and paste it into "Manifest URL".
   - **The Forge:** open forge-vtt.com/bazaar and choose **Install from Manifest**. Paste it, and untick "Install from the Bazaar if the package is found".
   - **Offline:** download `sarungard-shaman.zip` from the latest release and unzip it into `Data/modules/sarungard-shaman/`, or use The Forge's Import Wizard.
2. Enable **Shaman Class Support (Sarungard)** in the world's module settings.
3. Register the homebrew with Plutonium: **Game Settings → Configure Settings → Plutonium → Open Config Editor → Data Sources → Additional Homebrew Files**, add
   `https://raw.githubusercontent.com/Sarungard/sarungard-shaman/main/Sarungard%3B%20Shaman.json`
   and reload Foundry (F5). Plutonium keeps homebrew in memory only, so this setting is what makes it load in every session, before anything looks the Shaman up.
4. In Plutonium's Class importer, pick the Shaman from the homebrew sources (not "Custom URL", which would load it a second time) and import.
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
- **Spells as written:** Electric Discharge, Vacuum Touch, Blinding Radiance, Closed Circuit, Blinding Squall, Fossil Strike and Decaying Touch say the damage "increases by 1dX" at higher levels without "for each slot level"; that is kept literally. Closed Circuit and Blinding Squall list an unspecified material component.
- **Fossil Strike** is on the 2nd-level shaman list, following its own "Spell lists" line.
- **Not included yet:** Slow Current (its text is a copy of Hail Strike), the Council of Torture (placeholder), and the Ritualistic background (its "Endurance" skill doesn't exist in 5e).
- **Multiclass proficiencies:** the source doesn't say what you gain when multiclassing *into* Shaman. As decided: light armor, shields, and one musical instrument.
- **Fighting styles:** Blind Fighting and Interception (*Tasha's Cauldron of Everything*) and Tunnel Fighter (UA: *Light, Dark, Underdark!*) are not reproduced here. They are `_copy` links to the official entries. The file declares `TCE` and `UALightDarkUnderdark` as `optionalfeature` dependencies. Without those, Plutonium can't find the entries to copy. `UALightDarkUnderdark` is fetched from the 5etools UA repository. Great Weapon Fighting, Protection and Two-Weapon Fighting are SRD 5.1 text.

## License

The Shaman class is © Sarungard and licensed under [CC BY-NC 4.0](LICENSE). It includes SRD 5.1 material by Wizards of the Coast LLC, used under CC BY 4.0 (see [LICENSE](LICENSE)).
