# competitors.ts Corrections Summary

Applied to: `/home/user/workspace/battle-cards/client/src/lib/competitors.ts`
Date: 2025

---

## 1. Slimdrive Attribution Fixes (CRITICAL — 20+ edits)

**Root issue:** "Slimdrive" is a GEZE trademark. dormakaba's sliding line is the ES series (ESA100–ESA500). Multiple locations in the file incorrectly attributed Slimdrive to dormakaba.

### 1a. dormakaba `keyProducts` — Removed Slimdrive ES and Slimdrive F
- **Removed:** `{ name: "Slimdrive ES", ... }` — was wrongly listed as a dormakaba product
- **Removed:** `{ name: "Slimdrive F", ... }` — was wrongly listed as a dormakaba product
- ESA500 was already present in the list; no new entry was needed (task's suggested ESA500 entry was already there)

### 1b. dormakaba `primaryStrengths`
- **Changed:** `"Slimdrive family (global) — industry-leading 70 mm header depth for glass facades"` → `"ES series sliding (ESA100–ESA500) — comprehensive North American sliding portfolio with value-to-spec pricing"`

### 1c. dormakaba `primaryWeaknesses`
- **Changed:** `"Slimdrive family is primarily a global/European product — US-spec ESA series is competitive but not leading on header depth"` → `"ES series header depth not class-leading vs. GEZE Slimdrive (70 mm) — ESA series is competitive but slim-profile glass facade commercial favors GEZE"`

### 1d. ASSA ABLOY's own `primaryWeaknesses`
- **Changed:** `"Slim-profile sliding header depth vs. dormakaba Slimdrive (7cm)"` → `"Slim-profile sliding header depth vs. GEZE Slimdrive (70mm)"` — dormakaba was wrongly cited as the Slimdrive owner

### 1e. dormakaba `thinkAboutThis`
- **Changed:** `"Lose to them on header depth (Slimdrive)"` → `"Lose to them on header depth (ES series vs. GEZE Slimdrive)"`

### 1f. dormakaba (general) `differentiators`
- **Changed:** `"Slimdrive ES at 70mm is industry minimum — class-leading"` → `"ES series competitive but not class-leading on header depth; GEZE Slimdrive (70mm) leads this dimension"`

### 1g. dormakaba (general) `objectionHandlers`
- **Changed objection:** `"dormakaba's Slimdrive looks better for our all-glass facade."` → `"dormakaba's ES series looks better for our all-glass facade."`
- **Changed response:** Clarified that Slimdrive is GEZE's, ES series is dormakaba's; correctly notes GEZE Slimdrive leads at 70mm

### 1h. dormakaba (general) `landmines`
- **Changed topic:** `"Slimdrive head-to-head aesthetics"` → `"ES series header depth vs. GEZE Slimdrive"`

### 1i. dormakaba (general) `talkTrack`
- **Changed:** `"dormakaba makes good products — Slimdrive is beautiful and their European pedigree is real."` → `"dormakaba makes good products — their European pedigree is real."` (removed the false Slimdrive attribution)

### 1j. dormakaba (general) `loseSignals`
- **Changed:** `"Project is spec'd to Slimdrive by name on an EOR-preferred basis"` → `"Project is spec'd to GEZE Slimdrive or dormakaba ES series by name on an EOR-preferred basis"`

### 1k. dormakaba × engineering `differentiators`
- **Changed:** `"Slimdrive ES at 70mm is industry minimum"` → `"ES series competitive; GEZE Slimdrive (70mm) leads this dimension — not dormakaba"`

### 1l. dormakaba × engineering `objectionHandlers`
- **Changed objection:** `"Slimdrive is thinner — the architect prefers it for the curtain wall."` → `"GEZE Slimdrive is thinner — the architect prefers it for the curtain wall."`
- **Changed response:** Explicitly identified Slimdrive as GEZE's product, not dormakaba's

- **Changed response in CE compliance objection:** `"dormakaba's global Slimdrive or ESA-CE variants"` → `"dormakaba's ESA-CE variants (or GEZE Slimdrive)"` — removes false attribution

### 1m. dormakaba × engineering `landmines`
- **Changed:** `"Slimdrive genuinely leads on this dimension"` → `"GEZE Slimdrive genuinely leads on this dimension; dormakaba ES series is competitive but not class-leading"`

### 1n. dormakaba × engineering `loseSignals`
- **Changed:** `"Architect has designed to Slimdrive 70mm header depth"` → `"Architect has designed to GEZE Slimdrive 70mm header depth"`

### 1o. dormakaba × pm_interview `winThemes` (product-market fit detail)
- **Changed:** `"dormakaba's Slimdrive wins in glass-facade commercial"` → `"dormakaba's ES series competes on value-to-spec in glass-facade commercial; GEZE Slimdrive leads on header depth in this segment"`

### 1p. dormakaba × pm_interview `differentiators`
- **Changed:** `"Slimdrive is reference spec in this segment"` → `"ES series competes on value-to-spec; GEZE Slimdrive (not dormakaba) is reference spec on header depth"`

### 1q. dormakaba × pm_interview `objectionHandlers`
- **Changed:** `"The slim-profile header gap vs. Slimdrive"` → `"The slim-profile header gap vs. GEZE Slimdrive (and to a lesser extent dormakaba's ES series)"`

### 1r. dormakaba × pm_interview `talkTrack`
- **Changed:** `"Their Slimdrive wins on aesthetics in glass-facade commercial"` → `"Their ES series competes on value-to-spec in glass-facade commercial — that's a genuine strength (note: GEZE Slimdrive, not dormakaba, leads on header depth in this segment)"`

### 1s. dormakaba × pm_interview `loseSignals`
- **Changed:** `"You can't name dormakaba's strongest products (Slimdrive, ED250, KTV) by SKU"` → `"You can't name dormakaba's strongest products (ESA series, ED250, KTV) by SKU — or you incorrectly attribute GEZE's Slimdrive to dormakaba"`

### 1t. dormakaba × distributor `landmines`
- **Changed topic:** `"Slimdrive pull in architectural accounts"` → `"GEZE Slimdrive / dormakaba ES series pull in architectural accounts"`
- **Changed risk text:** Updated to correctly separate GEZE Slimdrive from dormakaba ES series

### 1u. dormakaba × distributor `loseSignals`
- **Changed:** `"spec's Slimdrive by preference"` → `"spec's GEZE Slimdrive or dormakaba ES series by preference"`

### 1v. GEZE `keyProducts` — Slimdrive product note corrected
- **Changed:** `"Same profile as dormakaba Slimdrive"` → `"GEZE trademark product"` — removed the false comparison to a non-existent dormakaba Slimdrive

---

## 2. Horton Automatics Parentage Note

**Added** to `marketPosition`:
> "Division of Overhead Door Corporation (Sanwa Holdings, Japan)."

Prepended to the beginning of Horton's marketPosition string. The `parentCompany` field already correctly listed "Overhead Door Corporation / Sanwa Holdings" — the new addition ensures the marketPosition also surfaces this corporate structure.

---

## 3. GEZE NA Distribution Presence

**Added** new first entry to `primaryWeaknesses`:
> "No direct US/Canada subsidiary — sold through distributors in NA. Market presence is specification-driven; limited direct sales force."

This replaces the vague implication of "thin service network" with a precise statement about GEZE's distributor-only NA model.

---

## 4. STANLEY/Allegion Acquisition Details

**Updated** `founded` field:
- Before: `"Allegion acquired Stanley Access Technologies July 2022 for $900M"`
- After: `"Allegion acquired Stanley Access Technologies July 5, 2022 for $900M"`

**Updated** `marketPosition`:
- Before: `"Stanley Access Technologies was acquired by Allegion plc in July 2022 for $900M"`
- After: `"Stanley Access Technologies was acquired by Allegion plc on July 5, 2022 for $900M, with the brand retained as 'Stanley Access Technologies'"`

Price ($900M) and brand retention note are now explicit.

---

## 5. dormakaba Sliding Pricing Tier

**No change needed.** The dormakaba sliding tier entry was already:
```
{ competitor: "dormakaba", tier: "Mid", note: "ESA100–500; value-to-spec strength", tierRank: 2 }
```
This correctly references the ESA series with no Slimdrive mention.

**GEZE sliding tier** at line 271 was left intact:
```
{ competitor: "GEZE", tier: "Premium", note: "Slimdrive 70mm; myGEZE IoT premium", tierRank: 1 }
```
This is correct — Slimdrive IS GEZE's product.

---

## 6. A156.27 Sliding Product Review

**No changes needed.** After reviewing all 27 occurrences of A156.27 in the file, every instance correctly applies to revolving door products:
- ASSA ABLOY RD series (RD3, RD3A, RD300, RD600, RD700)
- dormakaba KTV/KTC revolving series
- Boon Edam Tourlock 180, Crystal, Lifeline, BoonAssist TL
- Battle card differentiators and talk tracks about "Allegion/Stanley has no A156.27 products" and "Horton has no A156.27 products"

No occurrences of A156.27 were found misapplied to SL500, TSA, VersaMax, or any other sliding door product.
