# compliance.ts Change Summary

**File:** `/home/user/workspace/door-compliance/client/src/lib/compliance.ts`
**Date:** 2025-06

---

## Changes Applied

### 1. dormakaba model: ED600 / Slimdrive SL → ED600 / ESA 200 (line 1685)

**Before:**
```ts
model: "ED600 / Slimdrive SL",
rationale: "Slim header profile ideal for retrofit; pre-cycle fault monitor standard; A156.10-2024 compliant.",
crosswalkHint: "→ View full product-standard crosswalk for ED600 / Slimdrive SL",
```

**After:**
```ts
model: "ED600 / ESA 200",
rationale: "Slim header profile ideal for retrofit; pre-cycle fault monitor standard; A156.10-2024 compliant. dormakaba ES 200/250 series.",
crosswalkHint: "→ View full product-standard crosswalk for ED600 / ESA 200",
```

**Reason:** "Slimdrive" is a GEZE trademark — not a dormakaba product. dormakaba's slim-profile sliding door is the ESA/ES 200/250 series.

---

### 2. dormakaba HVHZ note: ES200 + Slimdrive → ES 200/250 (line 1600)

**Before:**
```ts
"Some ES200 and Slimdrive products are FL-approved for non-HVHZ; HVHZ coverage is limited. Verify NOA for each specific product configuration before specifying for Miami-Dade or Broward."
```

**After:**
```ts
"Some dormakaba ES 200/250 products are FL-approved for non-HVHZ; HVHZ coverage is limited. Verify NOA for each specific product configuration before specifying for Miami-Dade or Broward."
```

**Reason:** Removes the GEZE trademark "Slimdrive"; correctly attributes the ES 200/250 series to dormakaba.

---

## No-Change Items (verified clean in compliance.ts)

### 3. June 14 / 62-day / NOA-25-0816 / June 2026 references
Not present in `compliance.ts`. These fabricated references exist in `ComplianceChecker.tsx` (lines 1083 and 1701), which is outside the scope of this task.

### 4. FBC edition framing
All FBC references in `compliance.ts` correctly frame FBC 9th Edition as the **upcoming transition** taking effect December 31, 2026. No "FBC 8th Edition expires" framing found. No correction needed.

### 5. Windcord
No "Windcord" references exist anywhere in `compliance.ts`. No action taken.

### 6. UL 325
No "UL 325" or "UL325" references exist in `compliance.ts`. No action taken.

---

## Out-of-Scope Issues Identified (in other files)

- **`ComplianceChecker.tsx` line 1083:** Fabricated alert `"NOA-25-0816.11 (SL500 R104 HVHZ) expires June 14 2026 · 62 days · $4.2M FL revenue at risk"` — requires correction per task instructions (NOA numbers should be 25-0311.04 to .10, expiry 2030-2031).
- **`ComplianceChecker.tsx` line 1701:** `"Note: NOA-25-0816.11 for the SL500 R104 expires June 14 2026."` — same fabricated NOA number.
- **`index.html` (client and dist):** Meta description references "FBC 8th Edition" — should be updated to reference FBC 9th Edition cycle.
