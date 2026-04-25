// ─────────────────────────────────────────────────────────────────────────────
// DoorSpec Compliance Library — Engineering-Grade Reference
// Standards: ANSI/BHMA A156.10-2024, A156.19-2019, A156.38-2019, A156.27-2019
//            ADA Standards for Accessible Design (2010)
//            IBC 2024, FBC 9th Edition (eff. 12/31/2026)
//            FGI Guidelines 2022, NFPA 101 (2021), IECC 2024 C402.5.6
//            ASHRAE 90.1-2022, ICC A117.1-2017, ASTM E1886/E1996, ASTM F842-17
//            Miami-Dade NOA / TAS 201 / TAS 202 / TAS 203
// ─────────────────────────────────────────────────────────────────────────────

// ─── Primitive Types ──────────────────────────────────────────────────────────

export type DoorType =
  | "sliding"
  | "swinging"
  | "folding"
  | "revolving"
  | "telescoping"
  | "hermetic"
  | "ICU"
  | "power_assist";

export type ActivationMethod = "sensor" | "knowing_act" | "both";
export type EnergyLevel = "full" | "low";

/**
 * EnergyClass consolidates the three-standard matrix:
 *   full_energy      → A156.10-2024  (sensor-activated, any speed)
 *   low_energy       → A156.19-2019  (swinging, knowing act) or A156.38-2019 (sliding/folding)
 *   power_assist     → A156.19-2019  §3 (power-assist — motor merely reduces opening force)
 */
export type EnergyClass = "full_energy" | "low_energy" | "power_assist";

export type County = "miami_dade" | "broward" | "palm_beach" | "monroe" | "other_florida" | "non_florida";

/** IECC 2024 Climate Zone classification for Florida counties */
export type IECCClimateZone = "1A" | "2A" | "non_florida";

export type OccupancyType = "A" | "B" | "E" | "I" | "M" | "R1" | "other";

// ─── Code Reference ───────────────────────────────────────────────────────────

export interface CodeReference {
  /** e.g. "ADA 2010" | "IBC 2024" | "FBC 9th Ed." | "FGI 2022" | "NFPA 101" */
  code: string;
  section: string;
  requirement: string;
  /** Which door types this reference applies to; empty array means universal */
  applicability: DoorType[];
  url?: string;
}

// ─── Sensor Specification ─────────────────────────────────────────────────────

export type SensorTechnology =
  | "microwave_kband"
  | "pir"
  | "active_infrared"
  | "photoelectric_beam"
  | "radar_dual_tech"
  | "safety_mat"
  | "door_mounted_safety"
  | "push_plate"
  | "wave_sensor"
  | "card_reader"
  | "pre_cycle_monitor"
  | "time_delay_relay";

export interface SensorSpec {
  type: string;
  technology: SensorTechnology;
  requirement: string;
  /** ANSI/BHMA or FBC section governing this sensor */
  standard: string;
  heightSpec?: string;
  coverageZone?: string;
  adjustmentNote?: string;
  monitoring: boolean;
  severity: "required" | "not_required" | "recommended";
}

// ─── Force / Timing Specification ─────────────────────────────────────────────

export interface ForceTimingSpec {
  label: string;
  value: string;
  unit: string;
  standard: string;
  /** Edition year of the standard this value comes from */
  editionYear: number;
  note?: string;
}

// ─── Signage Requirement ──────────────────────────────────────────────────────

export interface SignageReq {
  text: string;
  standard: string;
  /** Letter/figure height requirement */
  size: string;
  placement: string;
  background?: string;
  letterColor?: string;
  severity: "required" | "conditional" | "recommended";
}

// ─── Compliance Flag ──────────────────────────────────────────────────────────

export interface ComplianceFlag {
  level: "critical" | "warning" | "info";
  title: string;
  detail: string;
  standard?: string;
}

// ─── Guide Rail Requirement ───────────────────────────────────────────────────

export interface GuideRailSpec {
  required: boolean;
  side: string;
  minHeight: string;
  extent: string;
  standard: string;
  note?: string;
}

// ─── Standard Reference (legacy alias, preserved for backward compat) ─────────

export interface StandardRef {
  code: string;
  section: string;
  description: string;
  url?: string;
}

// ─── Spec Sheet ───────────────────────────────────────────────────────────────

export interface SpecSheet {
  projectName?: string;
  doorType: DoorType;
  energyClass: EnergyClass;
  location: string;
  occupancyType: OccupancyType;
  generatedDate: string;
  requiredSensors: SensorSpec[];
  forceTimingSpecs: ForceTimingSpec[];
  signageRequirements: SignageReq[];
  codeReferences: CodeReference[];
  complianceFlags: ComplianceFlag[];
  guideRailSpec: GuideRailSpec | null;
  recommendedProducts: EnhancedProduct[];
  /** PM-facing plain-language insights about this configuration */
  pmNotes: string[];
}

// ─── Door Config (input to generateSpecSheet) ────────────────────────────────

export interface DoorConfig {
  projectName?: string;
  doorType: DoorType;
  energyClass: EnergyClass;
  activationMethod: ActivationMethod;
  county: County;
  occupancyType: OccupancyType;
  occupantLoad: number;
  isExterior: boolean;
  isEgressPath: boolean;
  isFireRated: boolean;
  hasVestibule: boolean;
  isHealthcareFacility: boolean;
  hasAccessControl?: boolean;
  location?: string;
}

// ─── Config Input (legacy alias, preserved for backward compat) ───────────────

export interface ConfigInput {
  doorType: DoorType;
  activationMethod: ActivationMethod;
  energyLevel: EnergyLevel;
  county: County;
  occupancyType: OccupancyType;
  occupantLoad: number;
  isExterior: boolean;
  isEgressPath: boolean;
  isFireRated: boolean;
  hasVestibule: boolean;
}

// ─── Compliance Result ────────────────────────────────────────────────────────

export interface ComplianceResult {
  applicableStandards: StandardRef[];
  signageRequirements: SignageReq[];
  sensorRequirements: SensorSpec[];
  forceRequirements: ForceTimingSpec[];
  codeReferences: CodeReference[];
  guideRailSpec: GuideRailSpec | null;
  flags: ComplianceFlag[];
  summaryLabel: string;
  primaryStandard: string;
  recommendedProducts: EnhancedProduct[];
}

// ═════════════════════════════════════════════════════════════════════════════
// IECC 2024 / ASHRAE 90.1-2022 VESTIBULE RESULT
// ═════════════════════════════════════════════════════════════════════════════

export interface IECCVestibuleResult {
  climateZone: IECCClimateZone;
  isExempt: boolean;
  exemptionNote: string;
  ashrae901Note: string;
  energyBenefitNote: string;
  leedNote: string;
  applicableCode: string;
}

/** Determine IECC 2024 Climate Zone for a Florida county */
export function getIECCClimateZone(county: County): IECCClimateZone {
  if (county === "non_florida") return "non_florida";
  // Zone 1A: Miami-Dade, Monroe, Broward, Palm Beach (southernmost FL)
  if (county === "miami_dade" || county === "monroe" || county === "broward" || county === "palm_beach") return "1A";
  // All other FL counties are Zone 2A
  return "2A";
}

/**
 * Evaluate IECC 2024 C402.5.6 vestibule requirements for a Florida project.
 * Florida (Zones 1A and 2A) is entirely exempt from mandatory vestibule requirements.
 */
export function evaluateIECCVestibule(county: County): IECCVestibuleResult {
  const zone = getIECCClimateZone(county);
  const isFL = zone !== "non_florida";
  const isExempt = isFL; // Zones 1 and 2 are exempt per IECC 2024 C402.5.6

  const zoneLabel = zone === "1A" ? "1A (Hot-Humid)" : zone === "2A" ? "2A (Mixed-Humid)" : "N/A";

  return {
    climateZone: zone,
    isExempt,
    exemptionNote: isFL
      ? `IECC 2024 Vestibule Exemption: This project location is in Climate Zone ${zoneLabel} — vestibule is not mandatory per IECC 2024 C402.5.6. Florida occupancies in Climate Zones 1–2 are fully exempt from vestibule mandates.`
      : "IECC 2024 C402.5.6 vestibule requirements may apply for non-Florida Climate Zones 3 and above. Verify with local AHJ.",
    ashrae901Note:
      "ASHRAE 90.1-2022 recognizes revolving doors as vestibule equivalents. If your project targets LEED or ENERGY STAR, a revolving door entry can satisfy vestibule requirements while providing up to 26% HVAC load reduction vs. a traditional vestibule.",
    energyBenefitNote:
      "Even where vestibules are not mandatory (Florida), revolving doors and air curtains reduce conditioned air infiltration by 60–90% compared to swing or sliding doors. Quantify this as an energy-model credit in LEED EA Credit: Optimize Energy Performance.",
    leedNote:
      "Revolving door installations in FL projects can earn LEED credit by reducing HVAC load. Document infiltration reduction in the energy model using ASHRAE 90.1-2022 Appendix G protocols.",
    applicableCode: "IECC 2024 C402.5.6 / ASHRAE 90.1-2022 §5.4.3",
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// IBC 2024 CHAPTER 10 EGRESS COMPLIANCE CHECKS
// ═════════════════════════════════════════════════════════════════════════════

export interface EgressComplianceCheck {
  id: string;
  title: string;
  detail: string;
  standard: string;
  level: "critical" | "warning" | "info";
  applicableTo: DoorType[];
}

export interface EgressComplianceResult {
  checks: EgressComplianceCheck[];
  reducedManeuvering?: {
    latchSidePull: string;
    latchSidePush: string;
    note: string;
    standard: string;
  };
  vestibuleSizing?: {
    minDepth: string;
    preferredDepth: string;
    note: string;
    standard: string;
  };
}

export function evaluateEgressCompliance(
  doorType: DoorType,
  energyClass: EnergyClass,
  hasAccessControl: boolean,
  isEgressPath: boolean,
  hasVestibule: boolean
): EgressComplianceResult {
  const checks: EgressComplianceCheck[] = [];

  // 1. Access-controlled door in egress path
  if (hasAccessControl && isEgressPath) {
    checks.push({
      id: "EGRESS-AC-01",
      title: "Access-Controlled Door — Sensor-Release or Delayed Egress Required",
      detail:
        "Electrically locked doors in egress paths must use sensor-release mag-locks (fail-safe on loss of power) OR delayed egress (15-second maximum delay per A156.10-2023 Sect. 13 + IBC 2024 §1010.1.9.9). Fire alarm must automatically unlock. 'PUSH TO EXIT' device required at 40–48 in. AFF within 5 ft of door on egress side.",
      standard: "IBC 2024 §1010.1.9.9 / A156.10-2023 Sect. 13 / FBC §1010.2.12",
      level: "critical",
      applicableTo: ["sliding", "swinging", "folding", "telescoping", "hermetic", "ICU", "power_assist"],
    });
  }

  // 2. Power-operated door reduced maneuvering clearance
  if (energyClass === "full_energy" && (doorType === "swinging" || doorType === "ICU" || doorType === "power_assist")) {
    checks.push({
      id: "EGRESS-ADA-02",
      title: "Reduced ADA Maneuvering Clearance — Power-Operated Swing Door Benefit",
      detail:
        "Automatic power-operated doors require only 12\" latch-side clearance on the pull side (vs. 18\" for manual doors) and 0\" latch-side clearance on the push side. This reduced clearance requirement is a significant design benefit in constrained vestibule or corridor conditions. ICC A117.1 §404.3.6.",
      standard: "ICC A117.1-2017 §404.3.6 / ADA 2010 §404.3",
      level: "info",
      applicableTo: ["swinging", "ICU", "power_assist"],
    });
  }

  // 3. Revolving door egress — adjacent bypass required
  if (doorType === "revolving" && isEgressPath) {
    checks.push({
      id: "EGRESS-REV-03",
      title: "Revolving Door Egress — Adjacent Accessible Bypass Door Required",
      detail:
        "Per IBC 2024, revolving doors in egress paths require an adjacent accessible door bypass — either a full-energy automatic sliding door or a swinging door providing minimum 32\" clear width. The revolving door alone cannot serve as the sole means of egress. Adjacent bypass door must be within 10 ft of revolving door entry.",
      standard: "IBC 2024 §1010.1.4 / ADA 2010 §402.2",
      level: "critical",
      applicableTo: ["revolving"],
    });
  }

  const result: EgressComplianceResult = { checks };

  // 4. Power-operated reduced clearance detail
  if (energyClass === "full_energy" && (doorType === "swinging" || doorType === "ICU" || doorType === "power_assist")) {
    result.reducedManeuvering = {
      latchSidePull: "12\" (vs. 18\" for manual doors)",
      latchSidePush: "0\" (automatic — no clearance required on push side)",
      note: "This reduced maneuvering clearance applies only to full-energy (A156.10) power-operated doors. Low-energy and power-assist doors still require full ADA maneuvering clearances.",
      standard: "ICC A117.1-2017 §404.3.6",
    };
  }

  // 5. Vestibule sizing
  if (hasVestibule) {
    result.vestibuleSizing = {
      minDepth: "48 in. + door width (between door faces)",
      preferredDepth: "60 in. — preferred for full ADA wheelchair turning clearance",
      note: "ICC A117.1-2017 §404.3.6: When both vestibule doors are power-operated, no turning space is required inside the vestibule. When only one door is power-operated, 60 in. turning diameter required inside.",
      standard: "ICC A117.1-2017 §404.3.6 / FBC §1010.2.4",
    };
  }

  return result;
}

// ═════════════════════════════════════════════════════════════════════════════
// ICC A117.1 / ADA COMPLIANCE RESULT
// ═════════════════════════════════════════════════════════════════════════════

export interface ADAComplianceItem {
  category: string;
  requirement: string;
  value: string;
  standard: string;
  level: "required" | "recommended" | "info";
  note?: string;
}

export interface ADAComplianceResult {
  clearOpeningWidth: {
    minimum: string;
    recommended: string;
    healthcareOrGovtFlag: boolean;
    note: string;
    standard: string;
  };
  activationRequirements: ADAComplianceItem[];
  openingForce: {
    category: string;
    limit: string;
    note: string;
    standard: string;
    assaAbloySolutions: string[];
  };
  thresholdRequirements: {
    maxHeight: string;
    bevelRule: string;
    note: string;
    standard: string;
  };
  items: ADAComplianceItem[];
}

export function evaluateADACompliance(
  doorType: DoorType,
  energyClass: EnergyClass,
  occupancyType: OccupancyType,
  hasAccessControl: boolean
): ADAComplianceResult {
  const isHealthcareOrGovt = occupancyType === "I" || occupancyType === "B";
  const isFullAuto = energyClass === "full_energy";
  const isSliding = doorType === "sliding" || doorType === "telescoping";

  const activationItems: ADAComplianceItem[] = [];

  // Motion sensor activation
  if (isFullAuto) {
    activationItems.push({
      category: "Activation — Motion Sensor",
      requirement: "Sensor must cover full approach path with minimum 5 ft (60 in.) activation zone from door face. Hold-open time: minimum 5 seconds after sensor clears for knowing-act doors; 1.5 sec for full-energy after zone clears.",
      value: "5 ft activation zone minimum",
      standard: "ADA 2010 §404.3 / A156.10-2024 §7.1",
      level: "required",
      note: "Calibrate activation zone annually. AAADM inspection must verify coverage to 28 in. AFF across full door width.",
    });
  }

  // Access control reach range
  if (hasAccessControl) {
    activationItems.push({
      category: "Access Control — Credential Reader Placement",
      requirement: "Credential reader (card, keypad, biometric) must be within reach range 15\"–48\" AFF. Side approach clearance: 18\" minimum from the reader to the nearest obstruction on the latch side.",
      value: "15\"–48\" AFF / 18\" side clearance",
      standard: "ADA 2010 §308 / ICC A117.1-2017 §309",
      level: "required",
      note: "Place credential readers on the latch side of the door — never on the hinge side. Confirm reach range does not exceed 48\" for forward reach or 46\" for side reach.",
    });
  }

  const allItems: ADAComplianceItem[] = [
    ...activationItems,
    {
      category: "Clear Opening Width",
      requirement: isSliding
        ? "Automated sliding doors: minimum 32\" clear at 90° (or slide position). Recommended 36\" for primary accessible entry."
        : "Swinging automated doors: minimum 32\" clear at 90°. Recommended 36\" for primary entry.",
      value: isHealthcareOrGovt ? "36\" minimum recommended" : "32\" minimum",
      standard: "ADA 2010 §404.2.3 / FGI 2022 Table 2.1-2",
      level: isHealthcareOrGovt ? "recommended" : "required",
      note: isHealthcareOrGovt
        ? "Healthcare and government occupancies: 36\" clear width recommended per FGI 2022 for bed/gurney passage and ADA best practice."
        : undefined,
    },
    {
      category: "Opening Force",
      requirement: isFullAuto
        ? "Power-operated sliding and swing doors: exempt from opening force limits since they open automatically. Activation hardware (push plate if provided): ≤ 5 lbf."
        : "Low-energy swing doors (A156.38): activation force at push plate ≤ 5 lbf for interior. Inherent door speed/force complies due to ≤ 15 lbf and ≤ 12 in./sec limits.",
      value: isFullAuto ? "Exempt (automatic)" : "≤ 5 lbf at push plate",
      standard: "ADA 2010 §404.2.9 / A156.19-2019 §4.4 / A156.38-2019 §3.6",
      level: "required",
    },
    {
      category: "Threshold",
      requirement: "Maximum threshold height: ½\" per ADA §303. Any threshold between ¼\" and ½\" must be beveled at maximum 1:2 slope (27° angle). Threshold ≤ ¼\" requires no bevel.",
      value: "≤ ½\" max / beveled if > ¼\"",
      standard: "ADA 2010 §303 / ICC A117.1-2017 (A156.21-2025)",
      level: "required",
      note: "Flush threshold (0\" or ≤ ¼\") strongly recommended for wheeled equipment (gurneys, carts, wheelchairs). Anti-trip strip at finish-floor transition.",
    },
  ];

  return {
    clearOpeningWidth: {
      minimum: "32\" (automated doors, single leaf)",
      recommended: "36\" for primary accessible entry",
      healthcareOrGovtFlag: isHealthcareOrGovt,
      note: isHealthcareOrGovt
        ? "Healthcare (Group I) and Government (Group B): 36\" minimum clear width recommended per FGI 2022 Table 2.1-2 for gurney/bed passage."
        : "32\" minimum applies; specify 36\" for optimal accessibility and future-proofing.",
      standard: "ADA 2010 §404.2.3 / ICC A117.1-2017 §404",
    },
    activationRequirements: activationItems,
    openingForce: {
      category: isFullAuto ? "Full-Energy Automatic" : "Low-Energy / Power-Assist",
      limit: isFullAuto ? "Exempt (door opens automatically)" : "≤ 5 lbf at push plate; door travel ≤ 15 lbf",
      note: isFullAuto
        ? "Full-energy automatic doors (A156.10) are exempt from ADA opening force limits because the door opens without physical effort. Zero-force entry."
        : "Low-energy doors must ensure activation hardware requires ≤ 5 lbf. ASSA ABLOY low-energy products meet this via calibrated electromechanical closers.",
      standard: "ADA 2010 §404.2.9 / A156.19-2019 §4.4",
      assaAbloySolutions: isFullAuto
        ? ["SL500 Full-Energy Sliding — zero-force entry", "VersaMax ICU Swing — zero-force, hands-free", "SW200i Full-Energy Swing — zero-force"]
        : ["LCN 4640 Low-Energy Swing — ≤ 5 lbf activation", "SW100 Power Assist — reduces force to ≤ 5 lbf"],
    },
    thresholdRequirements: {
      maxHeight: "½\" maximum per ADA §303",
      bevelRule: "Any threshold between ¼\" and ½\" must be beveled at maximum 1:2 slope (27°). Threshold ≤ ¼\" requires no bevel.",
      note: "Per ANSI A156.21-2025: thresholds for accessible routes must be flush or beveled. Aluminum saddle thresholds with integral beveled edges are standard on ASSA ABLOY automatic door systems.",
      standard: "ADA 2010 §303 / ICC A117.1-2017 §303 / ANSI A156.21-2025",
    },
    items: allItems,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// MASTER CODE REFERENCE LIBRARY
// ═════════════════════════════════════════════════════════════════════════════

export const CODE_REFERENCES: CodeReference[] = [
  // ── ADA ──────────────────────────────────────────────────────────────────
  {
    code: "ADA 2010",
    section: "§404.3",
    requirement:
      "Power door openers: activation hardware ≤ 15 lbf; opening time ≥ 1.5 sec to 60° (exterior) or 70° (interior); time before reclosing ≥ 5 sec (known act); sensing zone present on latch side.",
    applicability: ["swinging", "sliding", "power_assist"],
    url: "https://www.ada.gov/law-and-regs/design-standards/2010-stds/",
  },
  {
    code: "ADA 2010",
    section: "§404.2.9",
    requirement:
      "Door opening force (non-powered, swinging): ≤ 5 lbf for interior fire doors; ≤ 8.5 lbf for exterior doors. Power-operated doors must comply with §404.3 instead.",
    applicability: ["swinging", "power_assist"],
    url: "https://www.ada.gov/law-and-regs/design-standards/2010-stds/",
  },
  {
    code: "ADA 2010",
    section: "§404.2.3",
    requirement:
      "Clear width: ≥ 32 in. (815 mm) at 90°; double-leaf doors: one active leaf ≥ 32 in. Revolving doors, gates, and turnstiles may not be the sole accessible means of passage.",
    applicability: ["sliding", "swinging", "folding", "telescoping", "hermetic", "ICU", "power_assist"],
    url: "https://www.ada.gov/law-and-regs/design-standards/2010-stds/",
  },
  {
    code: "ADA 2010",
    section: "§402.2 / §404.2.4",
    requirement:
      "Revolving doors: not permitted as the only accessible entrance; an accessible gate or door must be provided adjacent. Door clear width ≥ 32 in. does not apply to revolving doors.",
    applicability: ["revolving"],
    url: "https://www.ada.gov/law-and-regs/design-standards/2010-stds/",
  },

  // ── IBC 2024 ─────────────────────────────────────────────────────────────
  {
    code: "IBC 2024",
    section: "§1010.1.4",
    requirement:
      "Power-operated doors in means of egress: must open from egress side on loss of power using ≤ 50 lbf; revolving doors must collapse to provide ≥ 36 in. aggregate clear width using ≤ 130 lbf on any one panel.",
    applicability: ["sliding", "swinging", "folding", "revolving", "telescoping", "hermetic", "ICU"],
    url: "https://codes.iccsafe.org/content/IBC2024",
  },
  {
    code: "IBC 2024",
    section: "§1105.1.1",
    requirement:
      "Mandatory power-operated or low-energy door at accessible public entrances for Assembly (occupant load > 300) and other high-traffic occupancies > 500. At least one door per accessible entrance; vestibule requires one auto door each side.",
    applicability: ["sliding", "swinging", "folding", "telescoping", "power_assist"],
    url: "https://codes.iccsafe.org/content/IBC2024",
  },
  {
    code: "IBC 2024",
    section: "§1010.1.1",
    requirement:
      "Means of egress doors: minimum 32 in. clear width, maximum 48 in. leaf width. Power-operated doors must conform to ANSI/BHMA A156.10, A156.19, or A156.38 as applicable.",
    applicability: ["sliding", "swinging", "folding", "telescoping", "hermetic", "ICU", "power_assist"],
    url: "https://codes.iccsafe.org/content/IBC2024",
  },

  // ── FBC 9th Edition ───────────────────────────────────────────────────────
  {
    code: "FBC 9th Ed.",
    section: "§1010.3.2",
    requirement:
      "Florida: Full-energy power-operated doors must comply with ANSI/BHMA A156.10-2024. Manual override from egress side ≤ 50 lbf. Swinging automatic doors must have guide rails.",
    applicability: ["sliding", "swinging", "folding", "telescoping", "hermetic", "ICU"],
    url: "https://floridabuilding.org/bc/bc_default.aspx",
  },
  {
    code: "FBC 9th Ed.",
    section: "§1010.3.3",
    requirement:
      "Florida: Low-energy power-operated doors (A156.19/A156.38) — manual override force ≤ 30 lbf to set in motion and ≤ 15 lbf to open to minimum required width.",
    applicability: ["sliding", "swinging", "folding", "power_assist"],
    url: "https://floridabuilding.org/bc/bc_default.aspx",
  },
  {
    code: "FBC 9th Ed.",
    section: "§1709.5",
    requirement:
      "HVHZ (Miami-Dade + Broward exterior): NOA required on all exterior doors. Permanent NOA label must remain visible post-installation. Label must include NOA number, manufacturer, design pressures, and TAS test standards.",
    applicability: ["sliding", "swinging", "folding", "telescoping", "hermetic"],
    url: "https://floridabuilding.org/bc/bc_default.aspx",
  },
  {
    code: "FBC 9th Ed. (HB 911)",
    section: "§1609",
    requirement:
      "HVHZ wind speed: 160 mph basic wind speed envelope. Exterior doors must meet DP ratings per ASCE 7-22. HVHZ typical exterior: +50/−70 psf minimum design pressure for automatic sliding doors.",
    applicability: ["sliding", "swinging", "folding", "telescoping"],
    url: "https://floridabuilding.org/bc/bc_default.aspx",
  },

  // ── FGI 2022 ─────────────────────────────────────────────────────────────
  {
    code: "FGI 2022",
    section: "§2.1-2.3.2",
    requirement:
      "Healthcare: ICU patient room doors minimum 3 ft 8 in. clear width to accommodate hospital beds. Doors shall swing out or be sliding. Power-operated preferred; manual operation must not require > 8.5 lbf.",
    applicability: ["ICU", "swinging", "sliding"],
    url: "https://www.fgiguidelines.org/",
  },
  {
    code: "FGI 2022",
    section: "§2.1-2.5.1",
    requirement:
      "Hermetic/pressurized rooms (isolation, OR): doors must seal to maintain room pressure differential ≥ 0.01 in. wg. HEPA filtration, positive/negative pressure per infection-control zone.",
    applicability: ["hermetic", "ICU"],
    url: "https://www.fgiguidelines.org/",
  },
  {
    code: "FGI 2022",
    section: "§2.1-8.2",
    requirement:
      "All patient care areas: automatic doors must include hands-free activation (motion sensor, foot pedal, or elbow plate). Knowing-act push plates must be touchless-option or cleanable surface.",
    applicability: ["ICU", "hermetic", "sliding", "swinging"],
    url: "https://www.fgiguidelines.org/",
  },

  // ── NFPA 101 ─────────────────────────────────────────────────────────────
  {
    code: "NFPA 101 (2021)",
    section: "§7.2.1.9",
    requirement:
      "Life safety: power-operated doors in means of egress must open from egress side on power failure using ≤ 50 lbf. Sliding automatic doors in egress must have a breakout feature with 'IN EMERGENCY PUSH TO OPEN' signage.",
    applicability: ["sliding", "swinging", "folding", "telescoping", "hermetic", "ICU"],
    url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=101",
  },
  {
    code: "NFPA 101 (2021)",
    section: "§7.2.1.9.1.2",
    requirement:
      "Breakout force for sliding automatic doors in egress: ≤ 50 lbf applied at the leading edge of any door panel shall swing the panel open in the direction of egress travel.",
    applicability: ["sliding", "telescoping"],
    url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=101",
  },

  // ── IECC / Energy ────────────────────────────────────────────────────────
  {
    code: "IECC 2021 / ASHRAE 90.1",
    section: "C402.5",
    requirement:
      "Commercial buildings: air infiltration through automatic doors must not exceed 1.0 CFM/ft² at 1.57 psf (75 Pa) for vestibule doors. Revolving doors count as compliant air barrier. Sliding door pairs in vestibule configuration recommended for energy compliance.",
    applicability: ["sliding", "revolving", "telescoping"],
    url: "https://codes.iccsafe.org/content/IECC2021",
  },

  // ── ANSI/BHMA Standards ───────────────────────────────────────────────────
  {
    code: "ANSI/BHMA A156.10-2024",
    section: "§8.3",
    requirement:
      "Pre-cycle fault monitor (2017+ requirement): sensor system must verify functionality of all required sensors before each closing cycle. If any sensor fault is detected, the door must not close until fault is corrected.",
    applicability: ["sliding", "swinging", "folding", "telescoping", "hermetic", "ICU"],
    url: "https://buildershardware.com/ANSI-BHMA-Standards/",
  },
  {
    code: "ANSI/BHMA A156.10-2024",
    section: "§10.9",
    requirement:
      "Sliding door leading edge: photoelectric presence beam or equivalent required within 8 in. of leading edge. Door must reverse upon contact with obstruction during closing.",
    applicability: ["sliding", "telescoping"],
    url: "https://buildershardware.com/ANSI-BHMA-Standards/",
  },
  {
    code: "ANSI/BHMA A156.27-2019",
    section: "§4–§7",
    requirement:
      "Revolving doors: max speed 4 RPM; max wing sweep force 130 lbf to break out; collapsed egress width ≥ 36 in. aggregate; slow-speed mode required for ADA compliance; diameter sized for wheelchair passage.",
    applicability: ["revolving"],
    url: "https://buildershardware.com/ANSI-BHMA-Standards/",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// FORCE / TIMING TABLES (A156.10-2024, A156.19-2019, A156.38-2019, A156.27-2019)
// ═════════════════════════════════════════════════════════════════════════════

/** Returns authoritative force/timing specs for the given door type and energy class */
export function getForceTimingSpecs(
  doorType: DoorType,
  energyClass: EnergyClass
): ForceTimingSpec[] {
  const specs: ForceTimingSpec[] = [];

  // ── SLIDING — Full Energy (A156.10-2024) ──────────────────────────────────
  if (doorType === "sliding" && energyClass === "full_energy") {
    specs.push({
      label: "Maximum opening speed",
      value: "2.5",
      unit: "ft/s",
      standard: "A156.10-2024 §10.8",
      editionYear: 2024,
      note: "Measured at the leading edge of the panel during normal operation.",
    });
    specs.push({
      label: "Maximum closing speed — general",
      value: "1.5",
      unit: "ft/s",
      standard: "A156.10-2024 §10.10",
      editionYear: 2024,
    });
    specs.push({
      label: "Maximum closing speed — final 1 ft before closed",
      value: "0.75",
      unit: "ft/s",
      standard: "A156.10-2024 §10.10",
      editionYear: 2024,
      note: "Speed must slow significantly in final travel zone.",
    });
    specs.push({
      label: "Dynamic force at leading edge (during closing)",
      value: "≤ 30",
      unit: "lbf",
      standard: "A156.10-2024 §10.9",
      editionYear: 2024,
      note: "Reduced from 40 lbf (2011 edition). Door must reverse upon contact.",
    });
    specs.push({
      label: "Presence sensor inactive zone from leading edge",
      value: "8",
      unit: "in.",
      standard: "A156.10-2024 §7.2",
      editionYear: 2024,
      note: "Sensor must not trigger from door panel motion within this zone.",
    });
    specs.push({
      label: "Minimum hold-open time after sensor clears",
      value: "≥ 1.5",
      unit: "sec",
      standard: "A156.10-2024 §10.12",
      editionYear: 2024,
    });
    specs.push({
      label: "Obstruction reversal",
      value: "Mandatory",
      unit: "",
      standard: "A156.10-2024 §10.11",
      editionYear: 2024,
      note: "Door must reverse to fully open upon contact with obstruction during closing cycle.",
    });
    specs.push({
      label: "Manual breakout force (egress side, power failure)",
      value: "≤ 50",
      unit: "lbf",
      standard: "FBC §1010.3.2 / NFPA 101 §7.2.1.9.1.2",
      editionYear: 2024,
    });
  }

  // ── SWINGING — Full Energy (A156.10-2024) ─────────────────────────────────
  if (doorType === "swinging" && energyClass === "full_energy") {
    specs.push({
      label: "Minimum opening time to 80°",
      value: "≥ 1.5",
      unit: "sec",
      standard: "A156.10-2024 §10.3",
      editionYear: 2024,
    });
    specs.push({
      label: "Closing force — last 10° of travel",
      value: "≤ 30",
      unit: "lbf",
      standard: "A156.10-2024 §10.4",
      editionYear: 2024,
      note: "Updated value in 2024 edition (was 40 lbf in 2011 edition).",
    });
    specs.push({
      label: "Minimum time to close through final 10°",
      value: "≥ 1.5",
      unit: "sec",
      standard: "A156.10-2024 §10.3",
      editionYear: 2024,
      note: "Door shall not close through final 10° faster than 1.5 seconds.",
    });
    specs.push({
      label: "Safety zone — swing side (beyond leading edge at full open)",
      value: "≥ 5",
      unit: "in.",
      standard: "A156.10-2024 §6.1",
      editionYear: 2024,
      note: "Clear zone required on the push/swing side beyond leading edge of fully open door.",
    });
    specs.push({
      label: "Guide rail height — swing side",
      value: "≥ 30",
      unit: "in.",
      standard: "A156.10-2024 §6.2",
      editionYear: 2024,
      note: "Guide rails on swing side must project to the leading edge of the fully open door.",
    });
    specs.push({
      label: "Minimum hold-open time after sensor clears",
      value: "≥ 1.5",
      unit: "sec",
      standard: "A156.10-2024 §10.3",
      editionYear: 2024,
    });
    specs.push({
      label: "Manual override force (power failure, egress side)",
      value: "≤ 50",
      unit: "lbf",
      standard: "FBC §1010.3.2",
      editionYear: 2024,
    });
  }

  // ── SWINGING — Low Energy (A156.19-2019) ──────────────────────────────────
  if (doorType === "swinging" && energyClass === "low_energy") {
    specs.push({
      label: "Maximum opening speed",
      value: "≤ 12",
      unit: "in/sec (30.5 cm/s)",
      standard: "A156.19-2019 §4.1",
      editionYear: 2019,
    });
    specs.push({
      label: "Minimum closing time (door to latch)",
      value: "≥ 5",
      unit: "sec",
      standard: "A156.19-2019 §4.2",
      editionYear: 2019,
      note: "Entire closing travel must take minimum 5 seconds.",
    });
    specs.push({
      label: "Minimum hold-open after activation release",
      value: "≥ 5",
      unit: "sec",
      standard: "A156.19-2019 §4.3",
      editionYear: 2019,
    });
    specs.push({
      label: "Force to prevent movement (opening or closing)",
      value: "≤ 15",
      unit: "lbf",
      standard: "A156.19-2019 §4.4",
      editionYear: 2019,
      note: "Measured at 1 in. from latch edge.",
    });
    specs.push({
      label: "Manual override force (power failure) — FBC",
      value: "≤ 30 to set in motion; ≤ 15 to open to min width",
      unit: "lbf",
      standard: "FBC §1010.3.3",
      editionYear: 2024,
    });
    specs.push({
      label: "Knowing-act activation placement",
      value: "36–48",
      unit: "in. AFF",
      standard: "A156.19-2019 §5.1",
      editionYear: 2019,
      note: "Push plate / wave sensor must be within 12 ft of door center.",
    });
    specs.push({
      label: "Cycle test durability",
      value: "300,000",
      unit: "cycles",
      standard: "A156.19-2019",
      editionYear: 2019,
      note: "Timing must remain within −10%/+20% of initial values throughout.",
    });
  }

  // ── SWINGING — Power Assist (A156.19-2019 §3) ─────────────────────────────
  if (doorType === "power_assist" || (doorType === "swinging" && energyClass === "power_assist")) {
    specs.push({
      label: "Force to set door in motion (power assisted)",
      value: "≤ 5",
      unit: "lbf",
      standard: "A156.19-2019 §3.2 / ADA §404.3",
      editionYear: 2019,
      note: "Motor assists the push — door does not open autonomously.",
    });
    specs.push({
      label: "Maximum door opening speed",
      value: "≤ 12",
      unit: "in/sec",
      standard: "A156.19-2019 §3.3",
      editionYear: 2019,
    });
    specs.push({
      label: "Closing time (back to rest)",
      value: "≥ 3",
      unit: "sec",
      standard: "A156.19-2019 §3.4",
      editionYear: 2019,
    });
  }

  // ── FOLDING — Full Energy (A156.10-2024) ──────────────────────────────────
  if (doorType === "folding" && energyClass === "full_energy") {
    specs.push({
      label: "Minimum opening time to back-check",
      value: "≥ 1.5",
      unit: "sec",
      standard: "A156.10-2024 §10.3",
      editionYear: 2024,
    });
    specs.push({
      label: "Dynamic force at last 10° of travel",
      value: "≤ 40",
      unit: "lbf",
      standard: "A156.10-2024 §10.4",
      editionYear: 2024,
      note: "Folding door retains 40 lbf max (swinging type updated to 30 lbf in 2024).",
    });
    specs.push({
      label: "Minimum closing time through final 2 in.",
      value: "≥ 1.5",
      unit: "sec",
      standard: "A156.10-2024 §10.5",
      editionYear: 2024,
    });
    specs.push({
      label: "Emergency egress — max applied force at leading edge",
      value: "≤ 50",
      unit: "lbf",
      standard: "FBC §1010.3.2 / NFPA 101 §7.2.1.9",
      editionYear: 2024,
      note: "Applied at leading edge to pivot door open for egress.",
    });
    specs.push({
      label: "Guide rails — fold side",
      value: "Required",
      unit: "",
      standard: "A156.10-2024 §6.3",
      editionYear: 2024,
      note: "Unless protected by adjacent wall within 4 in. of fold path.",
    });
  }

  // ── FOLDING — Low Energy (A156.38-2019) ───────────────────────────────────
  if (doorType === "folding" && energyClass === "low_energy") {
    specs.push({
      label: "Force to prevent movement",
      value: "≤ 15",
      unit: "lbf",
      standard: "A156.38-2019 §3.6",
      editionYear: 2019,
    });
    specs.push({
      label: "Manual override force (FBC)",
      value: "≤ 30 to set in motion; ≤ 15 to open to min width",
      unit: "lbf",
      standard: "FBC §1010.3.3",
      editionYear: 2024,
    });
    specs.push({
      label: "Cycle test durability",
      value: "300,000",
      unit: "cycles",
      standard: "A156.38-2019 §5",
      editionYear: 2019,
    });
  }

  // ── REVOLVING (A156.27-2019) ──────────────────────────────────────────────
  if (doorType === "revolving") {
    specs.push({
      label: "Maximum rotational speed",
      value: "≤ 4",
      unit: "RPM",
      standard: "A156.27-2019 §4.1",
      editionYear: 2019,
    });
    specs.push({
      label: "Force to break out any one wing (collapse for egress)",
      value: "≤ 130",
      unit: "lbf",
      standard: "A156.27-2019 §5.2 / IBC §1010.1.4",
      editionYear: 2019,
    });
    specs.push({
      label: "Aggregate egress width when collapsed",
      value: "≥ 36",
      unit: "in.",
      standard: "A156.27-2019 §5.1 / IBC §1010.1.4",
      editionYear: 2019,
      note: "Sum of clear widths of all collapsed leaf passages.",
    });
    specs.push({
      label: "Slow-speed mode (ADA wheelchair use)",
      value: "Required",
      unit: "",
      standard: "A156.27-2019 §4.4 / ADA §402.2",
      editionYear: 2019,
      note: "Speed reduced to ≤ 2 RPM in slow mode; activation by switch or sensor.",
    });
    specs.push({
      label: "Diameter — minimum for wheelchair passage",
      value: "≥ 72",
      unit: "in.",
      standard: "A156.27-2019 §3.1",
      editionYear: 2019,
      note: "Larger diameters (≥ 96 in.) allow simultaneous occupancy and improve throughput.",
    });
  }

  // ── TELESCOPING — Full Energy (A156.10-2024 + extended) ───────────────────
  if (doorType === "telescoping") {
    specs.push({
      label: "Maximum opening speed (each panel)",
      value: "2.5",
      unit: "ft/s",
      standard: "A156.10-2024 §10.8",
      editionYear: 2024,
      note: "Telescoping panels stack — leading panel governs speed.",
    });
    specs.push({
      label: "Maximum closing speed — final 1 ft",
      value: "0.75",
      unit: "ft/s",
      standard: "A156.10-2024 §10.10",
      editionYear: 2024,
    });
    specs.push({
      label: "Dynamic force at leading edge (during closing)",
      value: "≤ 30",
      unit: "lbf",
      standard: "A156.10-2024 §10.9",
      editionYear: 2024,
    });
    specs.push({
      label: "Obstruction reversal",
      value: "Mandatory — all panels",
      unit: "",
      standard: "A156.10-2024 §10.11",
      editionYear: 2024,
    });
    specs.push({
      label: "Manual breakout force (egress side)",
      value: "≤ 50",
      unit: "lbf",
      standard: "NFPA 101 §7.2.1.9.1.2",
      editionYear: 2021,
    });
    specs.push({
      label: "Minimum hold-open after sensor clears",
      value: "≥ 1.5",
      unit: "sec",
      standard: "A156.10-2024 §10.12",
      editionYear: 2024,
    });
  }

  // ── HERMETIC (A156.10-2024 + pressure/seal requirements) ─────────────────
  if (doorType === "hermetic") {
    specs.push({
      label: "Maximum opening speed",
      value: "1.5",
      unit: "ft/s",
      standard: "A156.10-2024 §10.8 (modified for seal contact)",
      editionYear: 2024,
      note: "Reduced to prevent seal damage on contact.",
    });
    specs.push({
      label: "Closing force at seal contact",
      value: "≤ 30",
      unit: "lbf",
      standard: "A156.10-2024 §10.9",
      editionYear: 2024,
    });
    specs.push({
      label: "Pressure differential capability",
      value: "≥ 0.01",
      unit: "in. wg. (2.5 Pa)",
      standard: "FGI 2022 §2.1-2.5.1",
      editionYear: 2022,
      note: "Required for isolation/OR rooms; positive or negative per infection-control zone.",
    });
    specs.push({
      label: "Air infiltration at 75 Pa",
      value: "≤ 1.0",
      unit: "CFM/ft²",
      standard: "IECC C402.5",
      editionYear: 2021,
    });
    specs.push({
      label: "Manual override force (egress, power failure)",
      value: "≤ 50",
      unit: "lbf",
      standard: "FBC §1010.3.2 / NFPA 101 §7.2.1.9",
      editionYear: 2024,
    });
    specs.push({
      label: "Minimum hold-open after sensor clears",
      value: "≥ 1.5",
      unit: "sec",
      standard: "A156.10-2024 §10.12",
      editionYear: 2024,
    });
  }

  // ── ICU DOOR (A156.10-2024 + FGI 2022) ───────────────────────────────────
  if (doorType === "ICU") {
    specs.push({
      label: "Minimum clear width",
      value: "≥ 44 (preferred ≥ 56)",
      unit: "in.",
      standard: "FGI 2022 §2.1-2.3.2",
      editionYear: 2022,
      note: "44 in. for standard bed passage; 56 in. recommended for ICU/critical care.",
    });
    specs.push({
      label: "Maximum opening speed",
      value: "2.5",
      unit: "ft/s",
      standard: "A156.10-2024 §10.8",
      editionYear: 2024,
    });
    specs.push({
      label: "Closing force at last 10° / 2 in.",
      value: "≤ 30",
      unit: "lbf",
      standard: "A156.10-2024 §10.4",
      editionYear: 2024,
    });
    specs.push({
      label: "Hands-free activation required",
      value: "Required",
      unit: "",
      standard: "FGI 2022 §2.1-8.2",
      editionYear: 2022,
      note: "Motion sensor, foot pedal, or elbow plate. Touch activation may be secondary only.",
    });
    specs.push({
      label: "Manual override force (power failure)",
      value: "≤ 50",
      unit: "lbf",
      standard: "FBC §1010.3.2",
      editionYear: 2024,
    });
    specs.push({
      label: "Minimum hold-open after sensor clears",
      value: "≥ 1.5",
      unit: "sec",
      standard: "A156.10-2024 §10.12",
      editionYear: 2024,
    });
  }

  return specs;
}

// ═════════════════════════════════════════════════════════════════════════════
// SENSOR SPECIFICATIONS
// ═════════════════════════════════════════════════════════════════════════════

/** Returns all required and recommended sensor specs for a given door type and energy class */
export function getSensorSpecs(
  doorType: DoorType,
  energyClass: EnergyClass
): SensorSpec[] {
  const sensors: SensorSpec[] = [];
  const isFullEnergy = energyClass === "full_energy";
  const isLowEnergy = energyClass === "low_energy";
  const isPowerAssist = energyClass === "power_assist";

  // ── ALL FULL-ENERGY TYPES (A156.10) ───────────────────────────────────────
  if (isFullEnergy) {

    // 1. Overhead Microwave Activation Sensor
    sensors.push({
      type: "Overhead Microwave Activation Sensor",
      technology: "microwave_kband",
      requirement:
        "Must detect a person ≥ 28 in. tall moving ≥ 6 in./sec toward the door. Activation zone: minimum 43 in. from door face at center. Effective coverage must extend to within 5 in. of door face. Sensor must not activate from door panel motion (microwave exclusion zone).",
      standard: "A156.10-2024 §7.1",
      heightSpec: "Mounted to ceiling or overhead frame; coverage ≥ 28 in. AFF",
      coverageZone: "43 in. min from door face; lateral coverage full door width + 6 in. each side",
      adjustmentNote: "Adjust sensitivity after installation to eliminate false triggers from HVAC, traffic, and door panel motion.",
      monitoring: true,
      severity: "required",
    });

    // 2. Overhead IR Presence Sensor
    sensors.push({
      type: "Overhead IR Presence Sensor",
      technology: "active_infrared",
      requirement:
        "Detects presence in the hold-open zone (door opening area). Maintains door open while person is present in zone. Pattern must cover the full door width and extend from the door face to 36 in. beyond the door face on each side. Door must remain open ≥ 1.5 sec after sensor clears.",
      standard: "A156.10-2024 §7.2 / §10.12",
      heightSpec: "Overhead mounting; detection zone extends to floor level",
      coverageZone: "Full door width + 36 in. beyond door face on approach side",
      monitoring: true,
      severity: "required",
    });

    // 3. Pre-Cycle Fault Monitor (2017+ requirement)
    sensors.push({
      type: "Pre-Cycle Fault Monitor",
      technology: "pre_cycle_monitor",
      requirement:
        "Electronic monitoring circuit must verify functionality of all required sensors before each closing cycle. If any sensor reports a fault, the door must remain open and must not initiate a closing cycle until the fault is corrected. Required for all A156.10-compliant systems installed after 2017.",
      standard: "A156.10-2024 §8.3",
      monitoring: true,
      severity: "required",
    });

    // Door-type-specific sensors
    if (doorType === "sliding" || doorType === "telescoping") {

      // 4. Photoelectric Beam Pairs — Leading Edge Detection
      sensors.push({
        type: "Photoelectric Beam Pair — Leading Edge Detection",
        technology: "photoelectric_beam",
        requirement:
          "Required within 8 in. of leading edge of the door panel. Lower beam: 6–28 in. AFF (detects child/wheelchair). Upper beam: 45–55 in. AFF (detects standing adult). Both beams must be active from fully open position until door is within 6 in. of closed. Door must reverse on beam interruption during closing cycle.",
        standard: "A156.10-2024 §10.9 / §7.2",
        heightSpec: "Lower: 6–28 in. AFF | Upper: 45–55 in. AFF",
        coverageZone: "Within 8 in. of leading edge, active when door is moving",
        monitoring: true,
        severity: "required",
      });
    }

    if (doorType === "swinging" || doorType === "ICU") {

      // 5. Door-Mounted Presence/Safety Sensor (DMPS)
      sensors.push({
        type: "Door-Mounted Presence/Safety Sensor (DMPS)",
        technology: "door_mounted_safety",
        requirement:
          "Must detect a person ≥ 28 in. tall anywhere in the swing path from 0° to fully open. Upon detection during closing: door must stop and reverse, or slow to ≤ 4 in./sec at the latch edge. Safety zone on swing side must be ≥ 5 in. beyond leading edge of fully open door. Sensor must be active from initiation of closing cycle to within 6 in. of closed.",
        standard: "A156.10-2024 §7.4 / §6.1",
        heightSpec: "Detection minimum 28 in. AFF; coverage full swing path",
        coverageZone: "Full swing path + safety zone ≥ 5 in. beyond leading edge at open position",
        monitoring: true,
        severity: "required",
      });
    }

    if (doorType === "hermetic" || doorType === "ICU") {

      // 6. Radar / Dual-Tech Sensor (Healthcare — Hands-Free Activation)
      sensors.push({
        type: "Radar / Dual-Technology Sensor (Hands-Free)",
        technology: "radar_dual_tech",
        requirement:
          "Combines microwave radar and passive IR for reliable activation in healthcare environments. Reduces false triggers from HVAC airflow common in pressurized clinical spaces. Required per FGI 2022 §2.1-8.2 for hands-free activation. Adjustable sensitivity for OR/ICU environments.",
        standard: "FGI 2022 §2.1-8.2 / A156.10-2024 §7.1",
        heightSpec: "Overhead mount, 8–12 ft AFF typical",
        coverageZone: "Minimum 43 in. from door face, full door width",
        monitoring: true,
        severity: "required",
      });
    }

    // 7. Safety Mat (recommended for high-traffic or freight)
    if (doorType !== "revolving") {
      sensors.push({
        type: "Safety Mat (Pressure-Sensitive Floor Mat)",
        technology: "safety_mat",
        requirement:
          "When used: minimum 24 in. depth from door face, full door clear width. Activates if any person/object presses on mat surface during a closing cycle — holds door open. Not a substitute for overhead presence sensor but adds redundancy for low-profile obstructions (luggage, carts).",
        standard: "A156.10-2024 §7 (supplemental)",
        heightSpec: "Floor level",
        coverageZone: "24 in. min. depth × full door clear width, centered on door",
        monitoring: true,
        severity: "recommended",
      });
    }
  }

  // ── LOW-ENERGY — KNOWING ACT (A156.19 or A156.38) ────────────────────────
  if (isLowEnergy) {
    sensors.push({
      type: "Knowing-Act Activation Device",
      technology: "push_plate",
      requirement:
        "A manually initiated device (push plate, wave/touchless sensor, or card reader) is required. Automatic motion-sensing activation is not permitted for A156.19/A156.38 low-energy doors. Device must be mounted 36–48 in. AFF, visible from the door, within 12 ft of door center.",
      standard: isLowEnergy ? "A156.19-2019 §5.1 / A156.38-2019 §5.1" : "A156.19-2019 §5.1",
      heightSpec: "36–48 in. AFF",
      monitoring: false,
      severity: "required",
    });

    sensors.push({
      type: "Wave / Touchless Sensor (optional knowing-act)",
      technology: "wave_sensor",
      requirement:
        "Touchless wave sensor is an acceptable knowing-act device for low-energy doors. Must require a deliberate hand motion within 3–8 in. of sensor. Must not be mounted where ambient traffic creates inadvertent activation. Used in healthcare and food-service environments.",
      standard: "A156.19-2019 §5.1",
      heightSpec: "36–48 in. AFF, lateral 12 in. from door jamb",
      monitoring: false,
      severity: "recommended",
    });

    sensors.push({
      type: "Presence Sensor (Safety — Optional but Recommended)",
      technology: "active_infrared",
      requirement:
        "NOT required by A156.19 or A156.38 — door's inherently low speed (≤ 12 in./sec) and low force (≤ 15 lbf) provide passive safety. However, adding an IR presence sensor to prevent closing on pedestrians is strongly recommended in high-traffic locations.",
      standard: "A156.19-2019 (not mandated); A156.10-2024 if added",
      monitoring: false,
      severity: "recommended",
    });
  }

  // ── POWER ASSIST (A156.19-2019 §3) ───────────────────────────────────────
  if (isPowerAssist || doorType === "power_assist") {
    sensors.push({
      type: "Knowing-Act Activation (or push force trigger)",
      technology: "push_plate",
      requirement:
        "Power-assist doors open only when a person pushes the door. The motor reduces opening force to ≤ 5 lbf. No automatic activation sensor required. Optional: wave sensor or push plate to pre-activate motor before door is pushed.",
      standard: "A156.19-2019 §3.2",
      heightSpec: "36–48 in. AFF if separate device used",
      monitoring: false,
      severity: "required",
    });
  }

  // ── REVOLVING (A156.27) ───────────────────────────────────────────────────
  if (doorType === "revolving") {
    sensors.push({
      type: "Wing Speed / RPM Monitor",
      technology: "pre_cycle_monitor",
      requirement:
        "Electronic speed controller must limit rotation to ≤ 4 RPM at all times. Speed sensor monitors wing velocity and applies braking if overspeed detected. Slow-speed mode (≤ 2 RPM) must be manually selectable.",
      standard: "A156.27-2019 §4.1–§4.4",
      monitoring: true,
      severity: "required",
    });

    sensors.push({
      type: "Presence Sensor — Wing Interior",
      technology: "active_infrared",
      requirement:
        "Detects persons in each wing compartment. If person detected near wing leading edge during rotation, system reduces speed or stops. Prevents compression injuries during rotation cycle.",
      standard: "A156.27-2019 §7",
      monitoring: true,
      severity: "required",
    });
  }

  return sensors;
}

// ═════════════════════════════════════════════════════════════════════════════
// GUIDE RAIL SPECIFICATIONS
// ═════════════════════════════════════════════════════════════════════════════

export function getGuideRailSpec(
  doorType: DoorType,
  energyClass: EnergyClass
): GuideRailSpec | null {
  if (doorType === "swinging" && energyClass === "full_energy") {
    return {
      required: true,
      side: "Swing side (push side)",
      minHeight: "30 in.",
      extent: "Must project to the leading edge of the door in its fully open position",
      standard: "A156.10-2024 §6.2",
      note: "Guide rails prevent persons from walking into the swing path. Must be sturdy enough to deflect a person; top rail 30 in. min, with vertical elements ≤ 4 in. apart (or solid panel).",
    };
  }

  if (doorType === "folding" && energyClass === "full_energy") {
    return {
      required: true,
      side: "Fold side",
      minHeight: "30 in.",
      extent: "Extends along the fold path from jamb to leading edge of folded position",
      standard: "A156.10-2024 §6.3",
      note: "Not required if fold path is protected by an adjacent wall within 4 in.",
    };
  }

  if (doorType === "revolving") {
    return {
      required: true,
      side: "Both sides of revolving door entry/exit",
      minHeight: "36 in.",
      extent: "Channeling guides to direct traffic into/out of wing compartments",
      standard: "A156.27-2019 §6.1",
      note: "Guide rails also serve as sight-lines to prevent persons from walking into rotating wings.",
    };
  }

  // Sliding, telescoping, hermetic, ICU, low-energy: no guide rails required
  if (energyClass === "low_energy" || energyClass === "power_assist") {
    return {
      required: false,
      side: "N/A",
      minHeight: "N/A",
      extent: "N/A",
      standard: "A156.19-2019 / A156.38-2019",
      note: "Guide rails are not required for low-energy or power-assist doors.",
    };
  }

  return null;
}

// ═════════════════════════════════════════════════════════════════════════════
// SIGNAGE REQUIREMENTS
// ═════════════════════════════════════════════════════════════════════════════

export function getSignageRequirements(
  doorType: DoorType,
  energyClass: EnergyClass,
  activationMethod: ActivationMethod,
  isEgressPath: boolean,
  isExterior: boolean,
  county: County
): SignageReq[] {
  const signs: SignageReq[] = [];
  const isFullEnergy = energyClass === "full_energy";
  const isLowEnergy = energyClass === "low_energy";
  const isPowerAssist = energyClass === "power_assist";

  // ── Full Energy (A156.10) Signs ───────────────────────────────────────────
  if (isFullEnergy) {
    signs.push({
      text: "AUTOMATIC DOOR",
      standard: "A156.10-2024 §11.1",
      size: "Letters ≥ ½ in. (12.7 mm) high",
      placement: "Both sides of door, clearly visible to approaching person",
      severity: "required",
    });

    if (doorType === "sliding" || doorType === "telescoping") {
      signs.push({
        text: "IN EMERGENCY PUSH TO OPEN",
        standard: "A156.10-2024 §11.3.1 / NFPA 101 §7.2.1.9.1.2",
        size: "Letters ≥ 1 in. (25.4 mm) high",
        placement: "Adjacent to lock stile, 36–60 in. AFF, egress side of door",
        background: "Red",
        letterColor: "White or yellow (contrasting)",
        severity: "required",
      });
    }

    if (doorType === "swinging" || doorType === "ICU" || doorType === "hermetic") {
      signs.push({
        text: "CAUTION — AUTOMATIC SWING DOOR",
        standard: "A156.10-2024 §11.2",
        size: "Letters ≥ ½ in. (12.7 mm) high",
        placement: "Swing side of door at eye level, 55–70 in. AFF",
        severity: "required",
      });
    }

    signs.push({
      text: "AAADM Annual Inspection Label",
      standard: "AAADM / A156.10-2024",
      size: "Standard AAADM label format (pre-printed)",
      placement: "Protected, visible location on door frame; includes compliance date and AAADM inspector number",
      severity: "required",
    });
  }

  // ── Low Energy (A156.19 / A156.38) Signs ─────────────────────────────────
  if (isLowEnergy) {
    const std = doorType === "swinging" ? "A156.19-2019 §6.3" : "A156.38-2019 §6.3";
    signs.push({
      text: "AUTOMATIC CAUTION DOOR",
      standard: std,
      size: "≥ 6 in. (152 mm) diameter circular sign; letters ≥ 5/8 in. (16 mm) high",
      placement: "Both sides of door, sign centerline at 50 in. ± 12 in. AFF",
      background: "Yellow",
      letterColor: "Black",
      severity: "required",
    });

    signs.push({
      text: "ACTIVATE SWITCH TO OPERATE",
      standard: std,
      size: "Letters ≥ 5/8 in. (16 mm) high",
      placement: "Mounted at or adjacent to the knowing-act activation device",
      severity: "required",
    });
  }

  // ── Power Assist Signs ────────────────────────────────────────────────────
  if (isPowerAssist) {
    signs.push({
      text: "POWER ASSISTED DOOR",
      standard: "A156.19-2019 §6.2",
      size: "Letters ≥ ½ in. (12.7 mm) high",
      placement: "Both sides of door at eye level",
      severity: "required",
    });
  }

  // ── Revolving Door Signs ──────────────────────────────────────────────────
  if (doorType === "revolving") {
    signs.push({
      text: "DO NOT PUSH ON GLASS PANELS — DO NOT RUN",
      standard: "A156.27-2019 §9.1",
      size: "Letters ≥ ½ in. high; pictograms recommended",
      placement: "At each wing entry, visible from outside before entering",
      severity: "required",
    });
    signs.push({
      text: "SLOW SPEED — PRESS FOR ACCESSIBILITY MODE",
      standard: "A156.27-2019 §4.4 / ADA §404.2",
      size: "Letters ≥ ½ in. high; International Symbol of Access",
      placement: "At door entry, adjacent to slow-speed activation control",
      severity: "required",
    });
  }

  // ── Egress Signs ──────────────────────────────────────────────────────────
  if (isEgressPath) {
    signs.push({
      text: "PUSH TO EXIT",
      standard: "FBC §1010.2.12",
      size: "Clearly visible lettering",
      placement: "Manual unlock/override device, 40–48 in. AFF, within 5 ft of door on egress side",
      severity: "conditional",
    });
  }

  // ── Florida HVHZ NOA Label ────────────────────────────────────────────────
  if (isExterior && (county === "miami_dade" || county === "broward")) {
    signs.push({
      text: "Miami-Dade NOA Label",
      standard: "FBC §1709.5",
      size: "Permanent, damage-proof label (factory-applied or AHJ-approved equivalent)",
      placement:
        "Visible on frame or jamb post-installation; must include NOA number, manufacturer name, approved design pressures, and TAS test standard(s)",
      severity: "required",
    });
  }

  return signs;
}

// ═════════════════════════════════════════════════════════════════════════════
// FLORIDA (FBC) HVHZ DETERMINATION LOGIC
// ═════════════════════════════════════════════════════════════════════════════

export interface FloridaHVHZResult {
  isHVHZ: boolean;
  county: County;
  requiresNOA: boolean;
  designPressure: string;
  tasStandards: string[];
  astmStandards: string[];
  forcedEntryStandard: string;
  noaLabelRequired: boolean;
  sl500R104Callout: string | null;
  brandGuidance: {
    brand: string;
    hvhzStatus: string;
    note: string;
  }[];
  windSpeed: string;
  notes: string[];
}

export function evaluateFloridaHVHZ(
  county: County,
  isExterior: boolean
): FloridaHVHZResult {
  const isHVHZ = county === "miami_dade" || county === "broward";
  const requiresNOA = isHVHZ && isExterior;

  return {
    isHVHZ,
    county,
    requiresNOA,
    designPressure: isHVHZ
      ? "+50 psf / −70 psf minimum (typical HVHZ exterior automatic door)"
      : "+35 psf / −45 psf (typical FL non-HVHZ exterior)",
    tasStandards: isHVHZ
      ? ["TAS 201 (impact resistance)", "TAS 202 (structural load)", "TAS 203 (water infiltration — FBC 9th Ed.)"]
      : [],
    astmStandards: isHVHZ
      ? [
          "ASTM E1886-19 (Standard Test Method for Performance of Exterior Windows, Curtain Walls, Doors, and Impact Protective Systems Impacted by Missile and Exposed to Cyclic Pressure Differentials)",
          "ASTM E1996-22 (Standard Specification for Performance of Exterior Windows, Curtain Walls, Doors, and Impact Protective Systems Hit by Windborne Debris in Hurricanes)",
        ]
      : [],
    forcedEntryStandard: isHVHZ
      ? "ASTM F842-17 (Standard Test Methods for Measuring the Forced Entry Resistance of Sliding Door Assemblies, Excluding Glazing Impact) — applicable for HVHZ-adjacent security applications and government/institutional projects in Miami-Dade."
      : "",
    noaLabelRequired: requiresNOA,
    sl500R104Callout: isHVHZ
      ? "ASSA ABLOY SL500 Resilience R104: ASTM E1886/E1996 certified with Miami-Dade NOA — the only automatic sliding door in its class tested to these standards. Full TAS 201/202/203 compliance. Specify ASSA ABLOY SL500 R104 for HVHZ exterior automatic sliding door applications."
      : null,
    windSpeed: isHVHZ
      ? "160 mph basic wind speed (FBC 9th Ed. / ASCE 7-22)"
      : "Up to 150 mph per AHJ zone (non-HVHZ FL)",
    brandGuidance: [
      {
        brand: "ASSA ABLOY",
        hvhzStatus: "Recommended for HVHZ",
        note:
          "Most exterior automatic door products (SL500, ST, Besam) carry NOA certification; TAS 201/202/203 tested. Verify specific model NOA number on FL Product Approval website before bidding.",
      },
      {
        brand: "dormakaba",
        hvhzStatus: "Limited HVHZ coverage — verify before bidding",
        note:
          "Some dormakaba ES 200/250 products are FL-approved for non-HVHZ; HVHZ coverage is limited. Verify NOA for each specific product configuration before specifying for Miami-Dade or Broward.",
      },
      {
        brand: "Stanley Access Technologies",
        hvhzStatus: "Dura-Storm line rated for HVHZ; standard line FL-compliant but limited HVHZ",
        note:
          "Stanley Dura-Storm products are specifically impact- and pressure-rated (Impact Class D/E); appropriate for HVHZ. Standard QDC and SL series are FL-compliant for non-HVHZ counties.",
      },
      {
        brand: "Horton Automatics",
        hvhzStatus: "Verify NOA per product — legacy series not typically HVHZ-rated",
        note:
          "Horton 4000 and 6000 series may have FL product approval. Legacy 2000 series is generally not HVHZ-rated. Confirm active NOA number on FL DCA website; product must be tested in the exact configuration as installed.",
      },
    ],
    notes: isHVHZ
      ? [
          "Interior automatic doors in HVHZ do NOT require NOA (hurricane product approval applies to building envelope only).",
          "NOA label must remain permanently visible post-installation per FBC §1709.5.",
          "FBC 9th Edition (eff. December 31, 2026) adds TAS 203 water infiltration requirement in addition to TAS 201/202.",
          "HVHZ design pressure is verified by the AHJ (building official); project-specific wind loads may exceed the minimum DP rating.",
        ]
      : [
          "Non-HVHZ Florida counties require FL Product Approval (simvpq.floridabuilding.org) for exterior doors, but not the full Miami-Dade NOA process.",
          "Interior doors in any Florida county do not require product approval for wind/impact.",
        ],
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// RECOMMENDED PRODUCTS DATABASE
// ═════════════════════════════════════════════════════════════════════════════

export interface EnhancedProduct {
  brand: string;
  model: string;
  rationale: string;
  standardsMet: string[];
  complianceScore: number; // 0-100: % of relevant compliance requirements this product addresses
  isPrimaryRecommendation: boolean;
  crosswalkHint?: string;
}

function getRecommendedProducts(
  doorType: DoorType,
  energyClass: EnergyClass,
  county: County,
  isExterior: boolean,
  isHealthcareFacility: boolean
): EnhancedProduct[] {
  const products: EnhancedProduct[] = [];
  const isHVHZ = county === "miami_dade" || county === "broward";

  if (doorType === "sliding" && energyClass === "full_energy") {
    if (isHVHZ && isExterior) {
      products.push({
        brand: "ASSA ABLOY",
        model: "SL500 Resilience R104 (HVHZ-rated)",
        rationale: "ASTM E1886/E1996 certified with Miami-Dade NOA — the only automatic sliding door in its class tested to these standards. Full TAS 201/202/203 compliance. Pre-cycle fault monitor. A156.10-2024 full sensor suite.",
        standardsMet: ["A156.10-2024", "Miami-Dade NOA", "TAS 201", "TAS 202", "TAS 203", "ASTM E1886", "ASTM E1996", "FBC 9th Ed.", "ADA 2010"],
        complianceScore: 98,
        isPrimaryRecommendation: true,
        crosswalkHint: "→ View full product-standard crosswalk for SL500 Resilience R104",
      });
      products.push({
        brand: "Stanley Access Technologies",
        model: "Dura-Storm SD (Impact Class D/E)",
        rationale: "Specifically engineered for HVHZ; impact-laminated glass options; full NOA documentation package.",
        standardsMet: ["A156.10-2024", "Miami-Dade NOA", "TAS 201", "TAS 202", "FBC 9th Ed."],
        complianceScore: 82,
        isPrimaryRecommendation: false,
        crosswalkHint: "→ View full product-standard crosswalk for Dura-Storm SD",
      });
    } else {
      products.push({
        brand: "ASSA ABLOY",
        model: "Besam SL500 / SL600",
        rationale: "Industry benchmark for A156.10 full-energy sliding; integrated pre-cycle fault monitor; AAADM-certified tech network covers all FL counties.",
        standardsMet: ["A156.10-2024", "ADA 2010 §404.3", "FBC 9th Ed.", "IBC 2024", "NFPA 101"],
        complianceScore: 95,
        isPrimaryRecommendation: true,
        crosswalkHint: "→ View full product-standard crosswalk for SL500 / SL600",
      });
      products.push({
        brand: "dormakaba",
        model: "ED600 / ESA 200",
        rationale: "Slim header profile ideal for retrofit; pre-cycle fault monitor standard; A156.10-2024 compliant. dormakaba ES 200/250 series.",
        standardsMet: ["A156.10-2024", "ADA 2010", "FBC 9th Ed."],
        complianceScore: 85,
        isPrimaryRecommendation: false,
        crosswalkHint: "→ View full product-standard crosswalk for ED600 / ESA 200",
      });
      products.push({
        brand: "Horton Automatics",
        model: "Horton 4000 Series",
        rationale: "High-traffic durability; standard sensor package included; strong FL product approval outside HVHZ.",
        standardsMet: ["A156.10-2024", "ADA 2010", "FL Product Approval"],
        complianceScore: 80,
        isPrimaryRecommendation: false,
        crosswalkHint: "→ View full product-standard crosswalk for Horton 4000 Series",
      });
    }
  }

  if (doorType === "swinging" && energyClass === "full_energy") {
    products.push({
      brand: "ASSA ABLOY",
      model: "Besam SW200i / SW300",
      rationale: "Full A156.10 swing door operator; DMPS sensor included; guide rail kit available; pre-cycle fault monitor.",
      standardsMet: ["A156.10-2024", "ADA 2010 §404.3", "FBC 9th Ed.", "IBC 2024"],
      complianceScore: 93,
      isPrimaryRecommendation: true,
      crosswalkHint: "→ View full product-standard crosswalk for SW200i / SW300",
    });
    products.push({
      brand: "dormakaba",
      model: "BTS 80 Series",
      rationale: "High-cycle rated; integrated presence/safety sensor; BTS 84 variant for heavy-traffic applications.",
      standardsMet: ["A156.10-2024", "ADA 2010", "FBC 9th Ed."],
      complianceScore: 84,
      isPrimaryRecommendation: false,
      crosswalkHint: "→ View full product-standard crosswalk for BTS 80 Series",
    });
  }

  if (doorType === "swinging" && energyClass === "low_energy") {
    products.push({
      brand: "LCN",
      model: "LCN 4640 / Softcheck",
      rationale: "AAADM-listed A156.19 low-energy operator; ADA §404.3 compliant; surface or concealed mount options.",
      standardsMet: ["A156.19-2019", "ADA 2010 §404.3", "FBC 9th Ed."],
      complianceScore: 88,
      isPrimaryRecommendation: true,
      crosswalkHint: "→ View full product-standard crosswalk for LCN 4640",
    });
    products.push({
      brand: "Norton",
      model: "Norton 5700 Series",
      rationale: "Reliable low-energy swinger; adjustable hold-open; push plate and wave sensor accessories available.",
      standardsMet: ["A156.19-2019", "ADA 2010"],
      complianceScore: 80,
      isPrimaryRecommendation: false,
      crosswalkHint: "→ View full product-standard crosswalk for Norton 5700 Series",
    });
  }

  if (doorType === "revolving") {
    products.push({
      brand: "ASSA ABLOY (Boon Edam)",
      model: "Tourniket / TQ series",
      rationale: "A156.27 compliant; speed control to ≤ 4 RPM; ADA slow-speed mode; breakout wings rated ≤ 130 lbf. ASHRAE 90.1-2022 vestibule equivalent; up to 26% HVAC load reduction.",
      standardsMet: ["A156.27-2019", "IBC 2024 §1010.1.4", "ADA 2010 §402.2", "ASHRAE 90.1-2022", "IECC 2024"],
      complianceScore: 92,
      isPrimaryRecommendation: true,
      crosswalkHint: "→ View full product-standard crosswalk for Tourniket / TQ series",
    });
    products.push({
      brand: "dormakaba",
      model: "KTV / Argenta",
      rationale: "Modular revolving door; integrated radar sensor; breakout tested to IBC §1010.1.4; energy-efficient seal.",
      standardsMet: ["A156.27-2019", "IBC 2024", "ADA 2010"],
      complianceScore: 82,
      isPrimaryRecommendation: false,
      crosswalkHint: "→ View full product-standard crosswalk for KTV / Argenta",
    });
  }

  if (doorType === "hermetic") {
    products.push({
      brand: "ASSA ABLOY",
      model: "Besam Hermetic / Hygena",
      rationale: "Certified hermetic seal; pressure differential ≥ 0.01 in. wg; surgical suite and isolation room rated. NFPA 101-2024 life safety compliant. ASHRAE 170-2021 pressure differential verified.",
      standardsMet: ["A156.10-2024", "FGI 2022", "NFPA 101-2024", "ASHRAE 170-2021", "ADA 2010"],
      complianceScore: 96,
      isPrimaryRecommendation: true,
      crosswalkHint: "→ View full product-standard crosswalk for Besam Hermetic / Hygena",
    });
    products.push({
      brand: "Horton Automatics",
      model: "Horton 7000 Series Hermetic",
      rationale: "HEPA-room rated; full seal engagement on close; A156.10 + FGI 2022 compliant.",
      standardsMet: ["A156.10-2024", "FGI 2022", "ADA 2010"],
      complianceScore: 85,
      isPrimaryRecommendation: false,
      crosswalkHint: "→ View full product-standard crosswalk for Horton 7000 Hermetic",
    });
  }

  if (doorType === "ICU") {
    if (isHealthcareFacility) {
      products.push({
        brand: "ASSA ABLOY",
        model: "VersaMax ICU / Hygienic SW",
        rationale: "FGI 2022 §2.1-2.3.2 compliant; 56 in. clear width available; touchless wave sensor; hands-free rated. NFPA 101-2024 life safety and ASHRAE 170-2021 pressure differential requirements met. Antimicrobial surface finishes.",
        standardsMet: ["A156.10-2024", "FGI 2022", "NFPA 101-2024", "ASHRAE 170-2021", "ADA 2010", "ICC A117.1-2017"],
        complianceScore: 97,
        isPrimaryRecommendation: true,
        crosswalkHint: "→ View full product-standard crosswalk for VersaMax ICU / Hygienic SW",
      });
      products.push({
        brand: "dormakaba",
        model: "ED250 / ICU variant",
        rationale: "Cleanroom-grade surfaces; foot-pedal activation option; full A156.10 + FGI compliance.",
        standardsMet: ["A156.10-2024", "FGI 2022", "ADA 2010"],
        complianceScore: 83,
        isPrimaryRecommendation: false,
        crosswalkHint: "→ View full product-standard crosswalk for ED250 ICU",
      });
    }
  }

  if (doorType === "telescoping") {
    products.push({
      brand: "ASSA ABLOY",
      model: "Besam SL500T (telescoping)",
      rationale: "Multi-panel telescoping; maximizes clear opening in constrained header space; full A156.10 sensor suite; breakout egress feature.",
      standardsMet: ["A156.10-2024", "ADA 2010", "FBC 9th Ed.", "NFPA 101", "IBC 2024"],
      complianceScore: 93,
      isPrimaryRecommendation: true,
      crosswalkHint: "→ View full product-standard crosswalk for SL500T Telescoping",
    });
    products.push({
      brand: "Stanley Access Technologies",
      model: "QDC 3000T Telescoping",
      rationale: "Compact header; 3- and 4-panel options; breakout for egress; standard FL product approval.",
      standardsMet: ["A156.10-2024", "ADA 2010", "FL Product Approval"],
      complianceScore: 80,
      isPrimaryRecommendation: false,
      crosswalkHint: "→ View full product-standard crosswalk for QDC 3000T",
    });
  }

  if (doorType === "power_assist") {
    products.push({
      brand: "LCN",
      model: "LCN 4600 Series Power Assist",
      rationale: "A156.19-2019 §3 power-assist; reduces opening force to ≤ 5 lbf; ideal for ADA compliance without full automation.",
      standardsMet: ["A156.19-2019 §3", "ADA 2010 §404.2.9", "FBC 9th Ed."],
      complianceScore: 86,
      isPrimaryRecommendation: true,
      crosswalkHint: "→ View full product-standard crosswalk for LCN 4600 Series",
    });
    products.push({
      brand: "Norton",
      model: "Norton 5900 Series",
      rationale: "Surface-mounted power-assist; ADA compliant; minimal cost vs. full-energy auto door.",
      standardsMet: ["A156.19-2019 §3", "ADA 2010"],
      complianceScore: 78,
      isPrimaryRecommendation: false,
      crosswalkHint: "→ View full product-standard crosswalk for Norton 5900 Series",
    });
  }

  return products;
}

// ═════════════════════════════════════════════════════════════════════════════
// SPEC SHEET GENERATOR
// ═════════════════════════════════════════════════════════════════════════════

export function generateSpecSheet(config: DoorConfig): SpecSheet {
  const {
    projectName,
    doorType,
    energyClass,
    activationMethod,
    county,
    occupancyType,
    occupantLoad,
    isExterior,
    isEgressPath,
    isFireRated,
    hasVestibule,
    isHealthcareFacility,
    location,
  } = config;

  // Gather all spec data
  const requiredSensors = getSensorSpecs(doorType, energyClass);
  const forceTimingSpecs = getForceTimingSpecs(doorType, energyClass);
  const signageRequirements = getSignageRequirements(
    doorType,
    energyClass,
    activationMethod,
    isEgressPath,
    isExterior,
    county
  );
  const guideRailSpec = getGuideRailSpec(doorType, energyClass);
  const recommendedProducts = getRecommendedProducts(
    doorType,
    energyClass,
    county,
    isExterior,
    isHealthcareFacility
  );

  // Filter code references by door type
  const codeReferences = CODE_REFERENCES.filter(
    (ref) =>
      ref.applicability.length === 0 ||
      ref.applicability.includes(doorType)
  );

  // Build compliance flags
  const flags: ComplianceFlag[] = [];

  // HVHZ Flag
  if (isExterior && (county === "miami_dade" || county === "broward")) {
    flags.push({
      level: "critical",
      title: "HVHZ — Miami-Dade NOA Required",
      detail:
        "Exterior automatic doors in Miami-Dade and Broward counties (High-Velocity Hurricane Zone) require a valid Notice of Acceptance (NOA). Products must pass TAS 201 (impact), TAS 202 (structural), and TAS 203 (water infiltration, added FBC 9th Ed.) testing. Design pressure minimum: +50/−70 psf. Permanent NOA label must remain visible post-installation per FBC §1709.5. Interior doors do NOT require NOA.",
      standard: "FBC §1709.5 / Miami-Dade Product Control",
    });
  }

  // Fire-Rated Flag
  if (isFireRated) {
    flags.push({
      level: "critical",
      title: "Fire-Rated Door Assembly",
      detail:
        "Automatic door operators on fire door assemblies must comply with UL 10C (positive pressure fire test) or NFPA 252. The operator must be listed by a nationally recognized testing laboratory (NRTL). Fire door assemblies must include door coordinator and listed closer; automatic operators must be listed for use with fire door assemblies. Consult the AHJ.",
      standard: "A156.10 / UL 10C / NFPA 252 / IBC §716",
    });
  }

  // Breakout Required — Egress Sliding/Telescoping
  if (isEgressPath && (doorType === "sliding" || doorType === "telescoping")) {
    flags.push({
      level: "critical",
      title: "Breakout Feature Required (Egress Path)",
      detail:
        'Automatic sliding and telescoping doors in the means of egress must include a breakout ("swing-out") feature. ≤ 50 lbf applied at the leading edge of any panel must swing the panel open in the direction of egress travel. Required signage: "IN EMERGENCY PUSH TO OPEN." Breakout function must work without power.',
      standard: "FBC §1010.3.2 / NFPA 101 §7.2.1.9.1.2",
    });
  }

  // Revolving Door — Accessible Bypass
  if (doorType === "revolving") {
    flags.push({
      level: "critical",
      title: "ADA Bypass Door Required Adjacent to Revolving Door",
      detail:
        "Revolving doors may not be the sole accessible means of entry per ADA §404.2. A compliant accessible door (sliding or swinging, ≥ 32 in. clear width) must be provided adjacent. Revolving doors may not serve as the only egress from an occupied space.",
      standard: "ADA 2010 §402.2 / IBC §1010.1.4",
    });
    flags.push({
      level: "warning",
      title: "Revolving Door Collapse Test",
      detail:
        "Each wing must break out using ≤ 130 lbf of applied force. Collapsed position must provide ≥ 36 in. aggregate clear egress width. Test and document collapse force annually.",
      standard: "A156.27-2019 §5 / IBC §1010.1.4",
    });
  }

  // Hermetic / ICU — FGI Healthcare
  if (doorType === "hermetic" || doorType === "ICU" || isHealthcareFacility) {
    flags.push({
      level: "warning",
      title: "FGI 2022 Healthcare Requirements Apply",
      detail:
        "FGI 2022 Guidelines apply to this healthcare door configuration. ICU patient room doors: ≥ 44 in. clear width minimum (56 in. preferred). Hands-free activation required (motion sensor, foot pedal, or elbow plate). Hermetic doors must maintain ≥ 0.01 in. wg pressure differential. Consult Infection Prevention team for isolation vs. positive-pressure rooms.",
      standard: "FGI 2022 §2.1-2.3.2 / §2.1-2.5.1",
    });
  }

  // Egress Sensor-Release Lock
  if (isEgressPath) {
    flags.push({
      level: "warning",
      title: "Sensor-Release Egress Lock (if applicable)",
      detail:
        "If using electrically locked egress doors with sensor release: sensor must be UL 294 listed; lock must unlock on loss of power to sensor; manual 'PUSH TO EXIT' device required at 40–48 in. AFF within 5 ft of door; fire alarm must automatically unlock per FBC §1010.2.12.",
      standard: "FBC §1010.2.12",
    });
  }

  // Occupancy-Triggered Mandatory Auto Door
  const triggerLoad =
    occupancyType === "A" ? 300 : ["B", "M", "R1"].includes(occupancyType) ? 500 : null;
  if (triggerLoad && occupantLoad > triggerLoad) {
    flags.push({
      level: "warning",
      title: "Mandatory Automatic Door at Accessible Entrance",
      detail: `IBC 2024 §1105.1.1 (adopted in FBC 9th Edition, effective December 31, 2026): Occupancy Group ${occupancyType} with occupant load > ${triggerLoad} must have at least one power-operated or low-energy door at each accessible public entrance. Vestibules require one auto door on each side.`,
      standard: "IBC 2024 §1105.1.1 / FBC 9th Ed.",
    });
  }

  // Vestibule — Doors in Series
  if (hasVestibule) {
    flags.push({
      level: "info",
      title: "Vestibule — Doors in Series",
      detail:
        "Minimum 48 in. between sliding power-operated doors in series (FBC §1010.2.4). Both vestibule doors must meet the applicable standard. No turning space required inside vestibule if both doors are power-operated or low-energy (ICC A117.1 §404.3.6). Vestibule configuration improves IECC C402.5 air infiltration compliance.",
      standard: "FBC §1010.2.4 / ICC A117.1 §404.3.6 / IECC C402.5",
    });
  }

  // AAADM Installation
  if (energyClass === "full_energy") {
    flags.push({
      level: "info",
      title: "AAADM Certified Installation Required",
      detail:
        "A156.10 compliance requires installation and adjustment by a factory-authorized AAADM (American Association of Automatic Door Manufacturers) certified technician. Annual compliance inspection required; AAADM label must be affixed to door frame. Retain inspection records for AHJ review.",
      standard: "A156.10-2024 / AAADM",
    });
  }

  // Low-Energy — No Safety Sensors Required
  if (energyClass === "low_energy") {
    flags.push({
      level: "info",
      title: "Low-Energy Door — Knowing Act Only",
      detail:
        "A156.19 and A156.38 govern knowing-act doors. Safety sensors are NOT mandated because the pedestrian consciously initiates the door cycle and the maximum force (≤ 15 lbf) and speed (≤ 12 in./sec) are inherently safe. This reduces sensor maintenance obligations compared to A156.10 full-energy systems.",
      standard: "A156.19-2019 / A156.38-2019",
    });
  }

  // Knowing-Act Device Placement
  if (energyClass === "full_energy" && activationMethod === "knowing_act") {
    flags.push({
      level: "warning",
      title: "Knowing-Act Device — A156.10 Placement Requirements",
      detail:
        "When a knowing-act device is used on a full-energy door: device must be visible from the door, mounted 36–48 in. AFF, within 12 ft of door center. Door must remain open ≥ 5 sec after activation. If device is > 12 ft away, add 1 sec per additional foot of distance.",
      standard: "A156.10-2024 §9.1",
    });
  }

  // PM Notes
  const pmNotes: string[] = [];

  if (doorType === "sliding" || doorType === "telescoping") {
    pmNotes.push(
      "Coordinate header depth with architect early — sliding/telescoping operators require 3–8 in. header height depending on model."
    );
    pmNotes.push(
      "Confirm rough opening dimensions before ordering; telescoping doors require less wall space but need precisely sized pocket."
    );
  }

  if (doorType === "swinging") {
    pmNotes.push(
      "Guide rail installation adds 2–3 ft of protected clear space on the swing side — verify floor plan allows this before finalizing door location."
    );
  }

  if (doorType === "revolving") {
    pmNotes.push(
      "Revolving doors must be paired with an accessible bypass door (ADA). Budget for both units in every revolving door location."
    );
    pmNotes.push(
      "Annual breakout-force testing and speed certification is required. Build maintenance contract into project closeout."
    );
  }

  if (doorType === "hermetic" || doorType === "ICU") {
    pmNotes.push(
      "Hermetic/ICU doors require coordination with MEP for pressure differential testing. Schedule commissioning with Infection Prevention before punch list."
    );
  }

  if (isExterior && (county === "miami_dade" || county === "broward")) {
    pmNotes.push(
      "Confirm NOA number validity on FL DCA website before product delivery — NOAs expire and must be active at time of inspection."
    );
    pmNotes.push(
      "FBC 9th Ed. (effective 12/31/2026) adds TAS 203 water infiltration to HVHZ requirements. Specify TAS 201/202/203 compliance in RFQ."
    );
  }

  if (energyClass === "full_energy") {
    pmNotes.push(
      "Schedule AAADM pre-installation site review and final inspection. AAADM label date must match inspection date — coordinate with closeout schedule."
    );
  }

  if (isFireRated) {
    pmNotes.push(
      "Fire-rated automatic door assemblies require a complete listed system (door, frame, operator, hardware). Mixing components from different manufacturers may void the listing — verify with the operator manufacturer."
    );
  }

  return {
    projectName,
    doorType,
    energyClass,
    location: location ?? "Not specified",
    occupancyType,
    generatedDate: new Date().toISOString(),
    requiredSensors,
    forceTimingSpecs,
    signageRequirements,
    codeReferences,
    complianceFlags: flags,
    guideRailSpec,
    recommendedProducts,
    pmNotes,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// LEGACY runComplianceCheck (backward-compatible — maps to new structures)
// ═════════════════════════════════════════════════════════════════════════════

export function runComplianceCheck(input: ConfigInput): ComplianceResult {
  // Map legacy EnergyLevel + ActivationMethod → EnergyClass
  let energyClass: EnergyClass;
  if (input.energyLevel === "full" || input.activationMethod === "sensor" || input.activationMethod === "both") {
    energyClass = "full_energy";
  } else if (input.doorType === "swinging" || input.doorType === "sliding" || input.doorType === "folding") {
    energyClass = "low_energy";
  } else {
    energyClass = "power_assist";
  }

  const spec = generateSpecSheet({
    doorType: input.doorType,
    energyClass,
    activationMethod: input.activationMethod,
    county: input.county,
    occupancyType: input.occupancyType,
    occupantLoad: input.occupantLoad,
    isExterior: input.isExterior,
    isEgressPath: input.isEgressPath,
    isFireRated: input.isFireRated,
    hasVestibule: input.hasVestibule,
    isHealthcareFacility: input.occupancyType === "I",
  });

  // Derive primaryStandard and summaryLabel
  let primaryStandard = "ANSI/BHMA A156.10-2024";
  if (energyClass === "low_energy" && input.doorType === "swinging") {
    primaryStandard = "ANSI/BHMA A156.19-2019";
  } else if (energyClass === "low_energy" && (input.doorType === "sliding" || input.doorType === "folding")) {
    primaryStandard = "ANSI/BHMA A156.38-2019";
  } else if (input.doorType === "revolving") {
    primaryStandard = "ANSI/BHMA A156.27-2019";
  } else if (energyClass === "power_assist") {
    primaryStandard = "ANSI/BHMA A156.19-2019 §3";
  }

  // Build legacy StandardRef[] from CodeReference[]
  const applicableStandards: StandardRef[] = spec.codeReferences.map((ref) => ({
    code: ref.code,
    section: ref.section,
    description: ref.requirement,
    url: ref.url,
  }));

  // Ensure primary standard is first
  applicableStandards.unshift({
    code: primaryStandard,
    section: spec.codeReferences[0]?.section ?? "",
    description: "Primary governing standard",
  });

  // Always add FBC reference
  if (!applicableStandards.some((s) => s.code.includes("FBC"))) {
    applicableStandards.push({
      code: "FBC 9th Ed. §1010.3.2",
      section: "Chapter 10",
      description: "Florida Building Code — Power-Operated Doors in Means of Egress",
      url: "https://floridabuilding.org/bc/bc_default.aspx",
    });
  }

  const summaryLabel =
    energyClass === "full_energy" && input.doorType === "swinging"
      ? `${primaryStandard} (dual: also A156.19 if low-energy mode configured)`
      : primaryStandard;

  return {
    applicableStandards,
    signageRequirements: spec.signageRequirements,
    sensorRequirements: spec.requiredSensors,
    forceRequirements: spec.forceTimingSpecs,
    codeReferences: spec.codeReferences,
    guideRailSpec: spec.guideRailSpec,
    flags: spec.complianceFlags,
    summaryLabel,
    primaryStandard,
    recommendedProducts: spec.recommendedProducts,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// LABEL DICTIONARIES
// ═════════════════════════════════════════════════════════════════════════════

export const DOOR_TYPE_LABELS: Record<DoorType, string> = {
  sliding: "Sliding (A156.10)",
  swinging: "Swinging (A156.10 / A156.19)",
  folding: "Folding (A156.10 / A156.38)",
  revolving: "Revolving (A156.27)",
  telescoping: "Telescoping (A156.10)",
  hermetic: "Hermetic / Pressurized (A156.10 + FGI 2022)",
  ICU: "ICU / Patient Room (A156.10 + FGI 2022)",
  power_assist: "Power Assist (A156.19 §3)",
};

export const ENERGY_CLASS_LABELS: Record<EnergyClass, string> = {
  full_energy: "Full Energy — Sensor-Activated (A156.10-2024)",
  low_energy: "Low Energy — Knowing Act (A156.19-2019 / A156.38-2019)",
  power_assist: "Power Assist — Motor-Assisted Push (A156.19-2019 §3)",
};

export const ACTIVATION_LABELS: Record<ActivationMethod, string> = {
  sensor: "Sensor-activated (automatic, no action required)",
  knowing_act: "Knowing act (push plate, wave sensor, card reader)",
  both: "Both (sensor + knowing act fallback)",
};

/** @deprecated Use ENERGY_CLASS_LABELS instead */
export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  full: "Full energy",
  low: "Low energy",
};

export const COUNTY_LABELS: Record<County, string> = {
  miami_dade: "Miami-Dade County (HVHZ)",
  broward: "Broward County (HVHZ)",
  palm_beach: "Palm Beach County (non-HVHZ)",
  monroe: "Monroe County (Florida Keys / HVHZ-adjacent)",
  other_florida: "Other Florida County (non-HVHZ)",
  non_florida: "Non-Florida Jurisdiction",
};

export const OCCUPANCY_LABELS: Record<OccupancyType, string> = {
  A: "Group A — Assembly (theaters, restaurants, houses of worship)",
  B: "Group B — Business (offices, banks, clinics)",
  E: "Group E — Educational (schools, daycare)",
  I: "Group I — Institutional (hospitals, healthcare, detention)",
  M: "Group M — Mercantile (retail, stores, malls)",
  R1: "Group R-1 — Residential Transient (hotels, motels)",
  other: "Other Occupancy",
};

// ═════════════════════════════════════════════════════════════════════════════
// UTILITY: Primary Standard Resolver
// ═════════════════════════════════════════════════════════════════════════════

export function resolvePrimaryStandard(doorType: DoorType, energyClass: EnergyClass): string {
  if (doorType === "revolving") return "ANSI/BHMA A156.27-2019";
  if (energyClass === "full_energy") return "ANSI/BHMA A156.10-2024";
  if (energyClass === "power_assist") return "ANSI/BHMA A156.19-2019 §3 (Power Assist)";
  if (energyClass === "low_energy") {
    if (doorType === "swinging") return "ANSI/BHMA A156.19-2019";
    if (doorType === "sliding" || doorType === "folding" || doorType === "telescoping") return "ANSI/BHMA A156.38-2019";
  }
  return "ANSI/BHMA A156.10-2024";
}

// ─── AAADM ───────────────────────────────────────────────────────────────────

export interface AAADMRequirement {
  doorType: DoorType;
  certificationRequired: boolean;          // true for full-energy A156.10, revolving A156.27
  certificationScope: string;              // what AAADM cert covers for this door type
  whoMustBeCertified: string;              // "Any technician adjusting electronic/sensor systems"
  prerequisite: string;                    // "6 months in automatic door industry OR 90 days + factory training"
  renewalFrequency: string;               // "Annual — online exam + renewal fee"
  inspectionFrequency: string;            // "Annual (recommended), semi-annual for high-traffic"
  facilityStaffAllowed: boolean;          // can facility maintenance staff certify? NO
  mechanicalOnlyExemption: string;        // what mechanical work doesn't require AAADM cert
  liabilityNote: string;                  // litigation note about last service record
}

export interface AAADMInspectionChecklist {
  category: string;
  items: AAADMChecklistItem[];
}

export interface AAADMChecklistItem {
  id: string;
  item: string;
  referenceStandard: string;              // "A156.10-2024 §8.3" or "A156.10-2024 §10.2"
  testMethod: string;                     // how the inspector tests this
  passFailCriteria: string;               // specific pass/fail values
  failureAction: string;                  // what happens if it fails
}

export const AAADM_REQUIREMENTS: Record<DoorType, AAADMRequirement> = {
  sliding: {
    doorType: "sliding",
    certificationRequired: true,
    certificationScope: "Sensor adjustment, speed/force settings, controller programming, safety system verification",
    whoMustBeCertified: "Any technician adjusting electronic systems, sensors, speed/force, or controller settings",
    prerequisite: "6 months in automatic door industry OR 90 days + AAADM member factory training course",
    renewalFrequency: "Annual — online exam + renewal fee required to maintain certification",
    inspectionFrequency: "Annual minimum; semi-annual for hospitals, grocery, high-traffic commercial",
    facilityStaffAllowed: false,
    mechanicalOnlyExemption: "Glass replacement, cylinder rekeying, mechanical hardware replacement (locks, hinges, pull handles) do not require AAADM cert — electronic adjustments DO",
    liabilityNote: "In litigation, the last service record is subpoenaed first. Any technician who touched the door's electronic systems is subject to A156.10 compliance liability regardless of certification status."
  },
  swinging: {
    doorType: "swinging",
    certificationRequired: true,
    certificationScope: "Sensor adjustment, speed/force settings, operator programming, safety system verification per A156.10-2024",
    whoMustBeCertified: "Any technician adjusting electronic systems, sensors, speed/force, or operator settings",
    prerequisite: "6 months in automatic door industry OR 90 days + AAADM member factory training course",
    renewalFrequency: "Annual — online exam + renewal fee required to maintain certification",
    inspectionFrequency: "Annual minimum; semi-annual for high-traffic or healthcare environments",
    facilityStaffAllowed: false,
    mechanicalOnlyExemption: "Cylinder rekeying, mechanical hardware replacement (hinges, closers, locks) do not require AAADM cert — electronic operator and sensor adjustments DO",
    liabilityNote: "In litigation, the last service record is subpoenaed first. Any technician who touched the door's electronic systems is subject to A156.10 compliance liability regardless of certification status."
  },
  folding: {
    doorType: "folding",
    certificationRequired: true,
    certificationScope: "Sensor adjustment, speed/force settings, controller programming per A156.10-2024 / A156.38-2019",
    whoMustBeCertified: "Any technician adjusting electronic systems, sensors, speed/force, or controller settings",
    prerequisite: "6 months in automatic door industry OR 90 days + AAADM member factory training course",
    renewalFrequency: "Annual — online exam + renewal fee required to maintain certification",
    inspectionFrequency: "Annual minimum; semi-annual for high-traffic installations",
    facilityStaffAllowed: false,
    mechanicalOnlyExemption: "Mechanical hinge/fold hardware replacement and track lubrication do not require AAADM cert — electronic adjustments DO",
    liabilityNote: "In litigation, the last service record is subpoenaed first. Any technician who touched the door's electronic systems is subject to compliance liability regardless of certification status."
  },
  revolving: {
    doorType: "revolving",
    certificationRequired: true,
    certificationScope: "Governed by A156.27 — AAADM certification covers revolving door inspection per A156.27 provisions",
    whoMustBeCertified: "Any technician servicing or adjusting the revolving door drive system, sensors, or speed controls",
    prerequisite: "6 months in automatic door industry OR 90 days + AAADM member factory training course",
    renewalFrequency: "Annual — online exam + renewal fee required to maintain certification",
    inspectionFrequency: "Annual minimum per A156.27; semi-annual for airports, hotels, high-traffic lobbies",
    facilityStaffAllowed: false,
    mechanicalOnlyExemption: "Cosmetic wing glass replacement by glazier does not require AAADM cert — speed control, sensor, and drive system work DO",
    liabilityNote: "Revolving door collapses and entrapments are high-profile litigation events. A156.27 compliance documentation and AAADM-certified service records are essential defense evidence."
  },
  telescoping: {
    doorType: "telescoping",
    certificationRequired: true,
    certificationScope: "Same as sliding — A156.10 governs, AAADM cert required for electronic adjustments",
    whoMustBeCertified: "Any technician adjusting electronic systems, sensors, speed/force, or controller settings",
    prerequisite: "6 months in automatic door industry OR 90 days + AAADM member factory training course",
    renewalFrequency: "Annual — online exam + renewal fee required to maintain certification",
    inspectionFrequency: "Annual minimum; semi-annual for transit, hospital, or very high-traffic installations",
    facilityStaffAllowed: false,
    mechanicalOnlyExemption: "Panel glass replacement, mechanical carrier hardware replacement do not require AAADM cert — electronic adjustments DO",
    liabilityNote: "In litigation, the last service record is subpoenaed first. Any technician who touched the door's electronic systems is subject to A156.10 compliance liability regardless of certification status."
  },
  hermetic: {
    doorType: "hermetic",
    certificationRequired: true,
    certificationScope: "A156.10 + FGI 2022 — additional infection-control training recommended; AAADM cert required for sensor/speed/force",
    whoMustBeCertified: "Any technician adjusting electronic systems, sensors, speed/force, or controller settings; infection-control coordinator must be notified",
    prerequisite: "6 months in automatic door industry OR 90 days + AAADM member factory training; FGI 2022 healthcare familiarity strongly recommended",
    renewalFrequency: "Annual — online exam + renewal fee; healthcare facilities may require additional competency verification",
    inspectionFrequency: "Semi-annual minimum for operating suites and cleanrooms; annual for other hermetic applications",
    facilityStaffAllowed: false,
    mechanicalOnlyExemption: "Seal gasket inspection by facility staff is permitted; electronic sensor and speed adjustments require AAADM cert",
    liabilityNote: "Hermetic door failures in OR/cleanroom environments carry significant patient-safety liability. Documented AAADM inspections and co-sign by facility infection-control officer are strongly recommended."
  },
  ICU: {
    doorType: "ICU",
    certificationRequired: true,
    certificationScope: "A156.10 + FGI 2022 — AAADM cert required; healthcare facility compliance officer must co-sign inspection report",
    whoMustBeCertified: "Any technician adjusting electronic systems, sensors, speed/force, or controller settings in patient care areas",
    prerequisite: "6 months in automatic door industry OR 90 days + AAADM member factory training; FGI 2022 healthcare requirement familiarity required",
    renewalFrequency: "Annual — online exam + renewal fee; hospital credentialing may require additional verification",
    inspectionFrequency: "Semi-annual minimum for ICU and patient room applications per FGI 2022 recommendations",
    facilityStaffAllowed: false,
    mechanicalOnlyExemption: "Basic visual inspection by nursing staff is permitted; all electronic adjustments require AAADM-certified technician with hospital escort",
    liabilityNote: "ICU door failures affect patient safety and Joint Commission accreditation. Facility compliance officer co-signature on inspection reports provides institutional liability protection."
  },
  power_assist: {
    doorType: "power_assist",
    certificationRequired: false,
    certificationScope: "A156.19 — AAADM certification strongly recommended but not mandatory; knowing-act device adjustment only",
    whoMustBeCertified: "No mandatory certification; AAADM certification strongly recommended for professional service documentation",
    prerequisite: "No mandatory prerequisite; AAADM certification: 6 months in automatic door industry OR 90 days + factory training",
    renewalFrequency: "Not mandatory; if AAADM certified, annual renewal required",
    inspectionFrequency: "Annual recommended; semi-annual for ADA path-of-travel critical installations",
    facilityStaffAllowed: true,
    mechanicalOnlyExemption: "All adjustments on A156.19 power-assist can be performed by non-AAADM staff; however AAADM inspection for compliance documentation is recommended",
    liabilityNote: "Although certification is not required, documented inspections by qualified personnel provide ADA compliance evidence and protect against slip-and-fall or ADA lawsuit liability."
  }
};

export const AAADM_INSPECTION_CHECKLIST: AAADMInspectionChecklist[] = [
  {
    category: "Sensor Verification",
    items: [
      { id: "SEN-01", item: "Activation sensor coverage zone verified per A156.10 §8.1", referenceStandard: "A156.10-2024 §8.1", testMethod: "Walk test with test disc at all activation zone grid points", passFailCriteria: "Door activates for all test disc positions in activation zone, no activation outside zone", failureAction: "Adjust sensor sensitivity/aim; re-test before returning door to service" },
      { id: "SEN-02", item: "Presence sensor inactive zone ≤ 8 in. from leading edge", referenceStandard: "A156.10-2024 §8.2", testMethod: "Measure inactive zone with tape measure from leading edge of door panel", passFailCriteria: "Inactive zone ≤ 8 in.", failureAction: "Reposition or recalibrate presence sensor" },
      { id: "SEN-03", item: "Pre-cycle fault monitor verified (sensor confirmed active before each close cycle)", referenceStandard: "A156.10-2024 §8.3", testMethod: "Disconnect one sensor; verify door does not attempt close cycle (fails safe)", passFailCriteria: "Door holds open when sensor fault detected; fault indicator active", failureAction: "Controller firmware update or replacement required; do not return to service" },
      { id: "SEN-04", item: "Safety sensor coverage verified — full door width at 28 in. AFF", referenceStandard: "A156.10-2024 §8.2", testMethod: "Test disc at 28 in. height across full clear opening width", passFailCriteria: "Detection at all points 28 in. AFF across full COW", failureAction: "Adjust safety sensor mount height and aim" },
      { id: "SEN-05", item: "Photo beam alignment verified (if installed)", referenceStandard: "A156.10-2024 §8.3.2", testMethod: "Verify lower beam at 6–28 in. AFF, upper beam at 45–55 in. AFF; beams active from full open to within 6 in. of closed", passFailCriteria: "Both beams active throughout full door travel range except last 6 in.", failureAction: "Re-align beam transmitter/receiver; confirm mounting heights" }
    ]
  },
  {
    category: "Force & Timing",
    items: [
      { id: "FT-01", item: "Closing force in last 10 deg ≤ 30 lbf (2024 standard)", referenceStandard: "A156.10-2024 §10.2", testMethod: "Calibrated force gauge at leading edge, last 10 degrees of travel", passFailCriteria: "≤ 30 lbf (≤ 133 N) — note: 2024 reduced from 40 lbf", failureAction: "Adjust closing force on controller; re-test; if unable to reach ≤ 30 lbf, document and flag for manufacturer service" },
      { id: "FT-02", item: "Opening time to 80 deg ≥ 1.5 seconds (swing door)", referenceStandard: "A156.10-2024 §9.1", testMethod: "Stopwatch from initiation to 80-degree open position", passFailCriteria: "≥ 1.5 seconds", failureAction: "Reduce opening speed on controller" },
      { id: "FT-03", item: "Hold-open time ≥ 1.5 seconds after sensor clears (A156.10)", referenceStandard: "A156.10-2024 §9.3", testMethod: "Stopwatch from sensor clear to initiation of close cycle", passFailCriteria: "≥ 1.5 seconds", failureAction: "Adjust hold-open timer on controller" },
      { id: "FT-04", item: "Low-energy hold-open ≥ 5 seconds after knowing-act release (A156.19)", referenceStandard: "A156.19-2023 §7.2", testMethod: "Release push plate; stopwatch to close initiation", passFailCriteria: "≥ 5 seconds", failureAction: "Adjust hold-open timer" },
      { id: "FT-05", item: "Breakout force ≤ 50 lbf (sliding panels, means of egress)", referenceStandard: "IBC 2024 §1010.1.4.2 / A156.10-2024", testMethod: "Apply force at 1 in. from leading edge at mid-height; measure force required to break out panel", passFailCriteria: "≤ 50 lbf (222 N)", failureAction: "Adjust breakaway device; if structural, notify AHJ" }
    ]
  },
  {
    category: "Signage",
    items: [
      { id: "SGN-01", item: "AUTOMATIC DOOR sign present both sides, correct height", referenceStandard: "A156.10-2024 §11.5", testMethod: "Visual inspection; measure centerline height AFF", passFailCriteria: "Sign present both sides; centerline at 50 in. AFF; black on yellow; min 6 in. diameter", failureAction: "Replace/reposition non-compliant signage; AAADM-compliant signs available from AAADM.com" },
      { id: "SGN-02", item: "CAUTION AUTOMATIC DOOR sign on low-energy doors", referenceStandard: "A156.19-2023 §11.1", testMethod: "Visual inspection both sides", passFailCriteria: "Present both sides, correct format", failureAction: "Install correct signage" }
    ]
  },
  {
    category: "Hardware & Safety",
    items: [
      { id: "HW-01", item: "Guide rails present and correct height (A156.10 swing)", referenceStandard: "A156.10-2024 §6.1", testMethod: "Measure guide rail height from floor and extent beyond leading edge in open position", passFailCriteria: "Min 30 in. height; extends to leading edge of door in open position", failureAction: "Repair or replace guide rails" },
      { id: "HW-02", item: "Emergency stop button functional (if installed)", referenceStandard: "A156.10-2024 §13", testMethod: "Activate emergency stop; verify door stops within 1 second", passFailCriteria: "Door stops within 1 second of E-stop activation", failureAction: "Inspect wiring and E-stop switch; replace if defective" },
      { id: "HW-03", item: "Threshold condition — no trip hazard, max 1/2 in. height", referenceStandard: "ADA 2010 §303 / A156.10", testMethod: "Visual and tactile inspection; measure threshold height", passFailCriteria: "≤ 1/2 in. height; beveled if between 1/4 in. and 1/2 in.", failureAction: "Replace threshold; add beveled ramp insert" },
      { id: "HW-04", item: "Power failure egress — door opens with ≤ 30 lbf manual force", referenceStandard: "IBC 2024 §1010.1.4.2(b)", testMethod: "Disconnect power; apply force at latch edge; measure force to open", passFailCriteria: "≤ 30 lbf in direction of egress travel", failureAction: "Check spring tension and breakaway device; adjust or replace" }
    ]
  },
  {
    category: "Documentation",
    items: [
      { id: "DOC-01", item: "AAADM inspection report completed and provided to owner", referenceStandard: "AAADM Inspection Protocol", testMethod: "Review completed report form", passFailCriteria: "All sections complete; pass/fail recorded per item; technician cert number included", failureAction: "Complete report before leaving site" },
      { id: "DOC-02", item: "Certificate of compliance issued (if all items pass)", referenceStandard: "AAADM Inspection Protocol", testMethod: "Verify all checklist items passed", passFailCriteria: "Zero failing items", failureAction: "Issue conditional certificate noting open items; schedule follow-up" },
      { id: "DOC-03", item: "AAADM Daily Safety Check label affixed to door", referenceStandard: "AAADM Safety Guidelines", testMethod: "Visual inspection", passFailCriteria: "Label present, legible, current year", failureAction: "Obtain and affix new label from AAADM" }
    ]
  }
];

export function getAAADMRequirement(doorType: DoorType): AAADMRequirement {
  return AAADM_REQUIREMENTS[doorType];
}

export function getAAADMChecklist(): AAADMInspectionChecklist[] {
  return AAADM_INSPECTION_CHECKLIST;
}

// ─── Architectural Specifications ─────────────────────────────────────────────

export interface ArchSpec {
  doorType: DoorType;
  roughOpening: RoughOpeningSpec;
  headerSpec: HeaderSpec;
  thresholdSpec: ThresholdSpec;
  sideliteOptions: SideliteOption[];
  clearanceRequirements: ClearanceReq[];
  materialSpecs: MaterialSpec[];
  frameSpec: FrameSpec;
  glazingSpec: GlazingSpec;
  csiSection: string;
}

export interface RoughOpeningSpec {
  widthFormula: string;
  heightFormula: string;
  minimumWidth: string;
  minimumHeight: string;
  notes: string;
}

export interface HeaderSpec {
  standardDepth: string;
  standardHeight: string;
  maxSpan: string;
  material: string;
  accessPanel: string;
  sensorCapHeight: string;
}

export interface ThresholdSpec {
  maxHeight: string;
  material: string;
  width: string;
  bevelRequired: string;
  adaNote: string;
}

export interface SideliteOption {
  name: string;
  description: string;
  minWidth: string;
}

export interface ClearanceReq {
  location: string;
  dimension: string;
  referenceCode: string;
  note: string;
}

export interface MaterialSpec {
  component: string;
  material: string;
  minThickness: string;
  finish: string;
  note: string;
}

export interface FrameSpec {
  profileDepth: string;
  profileHeight: string;
  wallThickness: string;
  material: string;
  anchorage: string;
  thermalBreak: string;
}

export interface GlazingSpec {
  minThickness: string;
  type: string;
  edgeDistance: string;
  sealant: string;
  impactRating: string;
  insulated: string;
}

export const ARCH_SPECS: Record<DoorType, ArchSpec> = {
  sliding: {
    doorType: "sliding",
    roughOpening: {
      widthFormula: "Clear Opening Width + 8 in. (surface mount) or + 4.5 in. (recessed track)",
      heightFormula: "Door height + header depth (4.5–6 in.) + 2 in. structural clearance",
      minimumWidth: "36 in. COW minimum (ADA path of travel); 48 in. recommended commercial",
      minimumHeight: "84 in. finished opening (7 ft) minimum; 96 in. (8 ft) preferred for commercial",
      notes: "Add 2 in. each side for biparting (center-open) configurations. Verify header support structure for spans > 10 ft COW — consult structural engineer."
    },
    headerSpec: {
      standardDepth: "4.5 in. (standard systems) or 6 in. (SL500 / heavy-duty)",
      standardHeight: "8 in. total including sensor cap; 4.5–6 in. housing + sensor cap above",
      maxSpan: "16 ft without intermediate support (SL500 with 1/4 in. tempered glass panels)",
      material: "Extruded aluminum 6063-T5, 0.125 in. min wall thickness; clear anodized or custom finish",
      accessPanel: "Hinged access panel full header width for controller and carrier service",
      sensorCapHeight: "Sensor cap spans full COW; total header assembly 8 in. AFF to underside of structure"
    },
    thresholdSpec: {
      maxHeight: "1/2 in. max per ADA §303; 1/4 in. preferred for high-traffic ADA paths",
      material: "Continuous extruded aluminum, full header width — integral bottom track",
      width: "4.5 in. standard / 6 in. for wider heavy-duty systems",
      bevelRequired: "Required if threshold height > 1/4 in. — max 1:2 slope bevel (27°)",
      adaNote: "Threshold must not exceed 1/2 in. for accessible route; 1/4 in. or less preferred for wheelchair clearance"
    },
    sideliteOptions: [
      { name: "Fixed sidelite", description: "Stationary glazed panel adjacent to sliding door within same frame", minWidth: "12 in." },
      { name: "Secondary sliding panel", description: "Additional sliding panel for wider openings or vestibule configuration", minWidth: "24 in." },
      { name: "No sidelite", description: "Flush jamb to wall — header spans clear opening only", minWidth: "N/A" }
    ],
    clearanceRequirements: [
      { location: "Approach side — latch/leading edge", dimension: "18 in. min ADA maneuvering clearance", referenceCode: "ADA 2010 §404.2.4", note: "Wall or obstruction must not encroach within 18 in. of leading edge on approach side" },
      { location: "Header above", dimension: "Minimum 8 in. structural clearance above door panel height", referenceCode: "A156.10-2024 / Manufacturer specs", note: "Allows sensor cap and header housing; verify soffit or beam height" },
      { location: "Side jamb to wall", dimension: "2 in. min (surface mount) or flush (recessed)", referenceCode: "Manufacturer specs", note: "Recessed track requires wall cavity min 4.5 in. deep" }
    ],
    materialSpecs: [
      { component: "Door panel frame", material: "Extruded aluminum 6063-T5", minThickness: "0.125 in. wall", finish: "Clear anodized (Class I) or painted; powder coat optional", note: "Lock stiles: 2-1/8 in. standard; 5 in. wide stile option for heavy glass" },
      { component: "Glass panel", material: "Tempered safety glass (ASTM C1048 Kind FT)", minThickness: "1/4 in. (6mm) minimum; 3/8 in. for panels > 36 in. wide", finish: "Clear or Low-E coating", note: "Insulated hermetically sealed units required for exterior applications — IECC C402.5" },
      { component: "Header housing", material: "Extruded aluminum 6063-T5", minThickness: "0.125 in.", finish: "Match door panel finish", note: "Hinged access panel full width; controller and carrier mounted internally" },
      { component: "Threshold / bottom track", material: "Extruded aluminum", minThickness: "3/16 in. web", finish: "Mill finish or anodized", note: "Integral track; anti-slip tread surface at high-traffic installations" }
    ],
    frameSpec: {
      profileDepth: "4.5 in. or 6 in. (matches header depth selection)",
      profileHeight: "Full floor-to-soffit or floor-to-structural span",
      wallThickness: "0.125 in. minimum extruded aluminum",
      material: "6063-T5 aluminum extrusion",
      anchorage: "Anchor to structural substrate at 24 in. max o.c.; expansion bolts into concrete or through-bolt into steel",
      thermalBreak: "Polyamide thermal break required for IECC commercial energy compliance (exterior applications)"
    },
    glazingSpec: {
      minThickness: "1/4 in. (6mm) tempered — 3/8 in. for panels wider than 36 in.",
      type: "Tempered safety glass per ASTM C1048, CPSC 16 CFR Part 1201 Category II",
      edgeDistance: "1/2 in. min glass bite into aluminum framing channel",
      sealant: "Structural glazing sealant (silicone) per ASTM C1184; glazing tape at lite pockets",
      impactRating: "HVHZ: Miami-Dade NOA / TAS 201/202/203 approval required for Broward and Miami-Dade",
      insulated: "Exterior: dual-pane insulated unit (IGU) required for energy code compliance; interior: single pane acceptable"
    },
    csiSection: "08 42 29"
  },
  swinging: {
    doorType: "swinging",
    roughOpening: {
      widthFormula: "Door leaf width + 2 in. each side for frame and clearance",
      heightFormula: "Door height + 1 in. top clearance for frame and closure",
      minimumWidth: "32 in. clear opening (ADA); 36 in. door leaf typical for 32 in. clear",
      minimumHeight: "80 in. (6 ft 8 in.) minimum; 84 in. preferred for commercial with overhead closer",
      notes: "Double doors: each leaf width + combined 4 in. frame allowance. Surface-mount operator adds 3 in. to effective header length each side."
    },
    headerSpec: {
      standardDepth: "Operator housing: 4.75 in. deep × 3.75 in. high (surface-applied above frame); OHC extrusion: 5.5 in. deep × 6 in. high",
      standardHeight: "3.75 in. surface-applied operator; add to frame height — total AFF varies by door height",
      maxSpan: "Operator spans door opening width + 3 in. each side for bracket attachment",
      material: "Extruded aluminum housing; typically powder-coated to match frame finish",
      accessPanel: "End-cap removal or hinged cover for spring/fluid adjustment access",
      sensorCapHeight: "Operator-integrated sensor; sensor arm extends 4–6 in. above door frame top"
    },
    thresholdSpec: {
      maxHeight: "1/2 in. max per ADA §303",
      material: "Aluminum saddle threshold or interlocking weatherstrip at exterior; flush at interior",
      width: "Match door leaf width (typ. 1-3/4 in. door + frame = 4–5 in. total)",
      bevelRequired: "Required if threshold > 1/4 in. height; max 1:2 slope (27°)",
      adaNote: "At accessible entrance, threshold ≤ 1/4 in. preferred; 1/4–1/2 in. must be beveled"
    },
    sideliteOptions: [
      { name: "Fixed sidelite (hinge side)", description: "Glazed fixed lite on pull/hinge side within same frame unit", minWidth: "12 in." },
      { name: "Fixed sidelite (latch side)", description: "Glazed fixed lite on latch side; maintain 18 in. clearance to leading edge", minWidth: "18 in." },
      { name: "Transom", description: "Fixed glazed panel above door within same frame; adds natural light without height increase", minWidth: "Full door width" }
    ],
    clearanceRequirements: [
      { location: "Latch side — pull approach", dimension: "18 in. min (ADA §404.2.4.1)", referenceCode: "ADA 2010 §404.2.4.1", note: "Wall must not encroach within 18 in. of latch edge on the pull/approach side" },
      { location: "Hinge side — pull approach", dimension: "12 in. min (ADA §404.2.4.1)", referenceCode: "ADA 2010 §404.2.4.1", note: "12 in. clearance on hinge side when door has push/pull hardware" },
      { location: "Maneuvering clearance", dimension: "60 in. min perpendicular to door on pull side", referenceCode: "ADA 2010 §404.2.4", note: "60 in. × 18 in. latch side clearance zone must be clear of obstructions" },
      { location: "Overhead — operator", dimension: "1-1/8 in. above door frame top for operator mounting; spindle 8.25 in. from hinge centerline", referenceCode: "Manufacturer specs (LCN 4040XP / similar)", note: "Verify structural header can accept operator mounting bolts at 16–24 in. o.c." }
    ],
    materialSpecs: [
      { component: "Door panel", material: "Aluminum (hollow metal) or solid-core wood (interior)", minThickness: "1-3/4 in. (full commercial)", finish: "Powder coat, anodized, or factory painted", note: "Rated pairs: UL-listed door and frame per NFPA 80 required for fire-rated openings" },
      { component: "Frame", material: "Hollow metal steel or aluminum", minThickness: "16 ga steel (hollow metal); 0.125 in. aluminum", finish: "Primer + paint; anodized for aluminum", note: "Knock-down or welded; set in masonry or bolted to structural framing" },
      { component: "Operator", material: "Cast aluminum housing; steel arm and spindle", minThickness: "N/A (manufactured assembly)", finish: "Powder coat — bronze, silver, gold, black, or custom", note: "Surface-applied: LCN 4040XP, Dorma ED series or equivalent" },
      { component: "Glazing (if applicable)", material: "Tempered safety glass ASTM C1048 Kind FT", minThickness: "1/4 in. (6mm) minimum", finish: "Clear or Low-E for exterior", note: "Wire glass only where fire-rated; ceramic-frit or vision-lite options" }
    ],
    frameSpec: {
      profileDepth: "4.75 in. operator depth above frame; door frame: 5-3/4 in. to 7-1/4 in. std profiles",
      profileHeight: "Frame height matches rough opening height minus 1 in.",
      wallThickness: "16 ga. hollow metal or 0.125 in. aluminum",
      material: "Hollow metal or aluminum extrusion",
      anchorage: "Expansion anchors into masonry at 18 in. o.c.; strap anchors to stud framing at 16 in. o.c.",
      thermalBreak: "Thermal break required at exterior openings; aluminum frames: polyamide or pour-and-debridge"
    },
    glazingSpec: {
      minThickness: "1/4 in. (6mm) tempered safety glass",
      type: "Tempered ASTM C1048 for any glass > 9 sq ft or within 18 in. of floor",
      edgeDistance: "1/2 in. min glass bite",
      sealant: "Glazing tape + silicone perimeter seal at exterior; wet glaze or tape at interior",
      impactRating: "HVHZ counties: NOA / TAS 201/202/203 required",
      insulated: "IGU at exterior openings for IECC compliance; single pane at interior"
    },
    csiSection: "08 71 13"
  },
  telescoping: {
    doorType: "telescoping",
    roughOpening: {
      widthFormula: "Clear Opening Width + 8 in. (each additional panel fold adds ~2 in.); verify with manufacturer panel count",
      heightFormula: "Door height + header depth (4.5–6 in.) + 2 in. structural clearance",
      minimumWidth: "48 in. COW minimum for telescoping (bi-parting typical); 60 in.+ preferred",
      minimumHeight: "84 in. (7 ft) minimum; 96 in. (8 ft) standard for commercial",
      notes: "Telescoping systems span wider than standard sliding — additional carrier support required for spans > 12 ft per leaf. Consult structural engineer for openings > 16 ft COW."
    },
    headerSpec: {
      standardDepth: "4.5 in. or 6 in. deep (same header as standard sliding)",
      standardHeight: "8 in. total including sensor cap",
      maxSpan: "16 ft+ with intermediate carrier support column; verify manufacturer specs for panel count and glass weight",
      material: "Extruded aluminum 6063-T5, 0.125 in. min wall thickness",
      accessPanel: "Hinged access panel full width; additional access at carrier support if intermediate post used",
      sensorCapHeight: "Sensor cap spans full COW; 8 in. total header height"
    },
    thresholdSpec: {
      maxHeight: "1/2 in. max per ADA §303",
      material: "Continuous aluminum multi-track threshold — additional track channels per panel count",
      width: "6 in. standard for telescoping (wider track configuration); custom per manufacturer",
      bevelRequired: "Required if threshold > 1/4 in.; max 1:2 slope",
      adaNote: "Multi-track threshold must remain flush with finish floor; anti-trip transition strip recommended"
    },
    sideliteOptions: [
      { name: "Fixed end panel", description: "Fixed glazed panel at end of telescoping run — common at transit and industrial", minWidth: "12 in." },
      { name: "Full telescoping array", description: "All panels telescoping — maximizes clear opening; requires pocket space on both sides", minWidth: "Per panel count × leaf width" }
    ],
    clearanceRequirements: [
      { location: "Panel pocket — each side", dimension: "Panel stack depth per side = (COW / 2) × 0.45 (approx. per leaf overlap)", referenceCode: "Manufacturer specs", note: "Pocket space must be clear of structure, MEP, and other hardware" },
      { location: "Approach — leading edge", dimension: "18 in. min ADA maneuvering clearance at leading edge approach", referenceCode: "ADA 2010 §404.2.4", note: "Wall or obstruction must not encroach" },
      { location: "Overhead — structural", dimension: "Intermediate carrier support column: 8–12 in. wide × full height", referenceCode: "Manufacturer specs", note: "Column location per panel count and span; coordinate with architect" }
    ],
    materialSpecs: [
      { component: "Door panels", material: "Extruded aluminum 6063-T5 frame with tempered glass", minThickness: "0.125 in. frame wall; 1/4 in. (6mm) glass min", finish: "Anodized or powder coat", note: "Lock stile: 2-1/8 in. or 5 in. wide option for heavy glass or wide spans" },
      { component: "Carrier / trolley", material: "Hardened steel carriers with nylon or steel wheels", minThickness: "N/A (manufactured assembly)", finish: "Zinc-plated or stainless for corrosive environments", note: "Heavy-duty carriers required for panels > 200 lbs; verify rated panel weight" },
      { component: "Header", material: "Extruded aluminum 6063-T5", minThickness: "0.125 in.", finish: "Match door panel finish", note: "Intermediate carrier post at spans > 16 ft" }
    ],
    frameSpec: {
      profileDepth: "6 in. (standard for telescoping heavy-duty systems)",
      profileHeight: "Full floor-to-structure height",
      wallThickness: "0.125 in. minimum",
      material: "6063-T5 aluminum extrusion",
      anchorage: "Anchor to structural substrate at 16 in. max o.c.; intermediate support welded plate to structure",
      thermalBreak: "Required at exterior; polyamide thermal break"
    },
    glazingSpec: {
      minThickness: "1/4 in. (6mm) tempered minimum; 3/8 in. for wide panels",
      type: "Tempered safety glass ASTM C1048 Kind FT",
      edgeDistance: "1/2 in. min glass bite",
      sealant: "Structural silicone ASTM C1184 + glazing tape",
      impactRating: "HVHZ: Miami-Dade NOA / TAS 201/202/203 required for exterior",
      insulated: "IGU required at exterior for IECC compliance"
    },
    csiSection: "08 42 29.23"
  },
  revolving: {
    doorType: "revolving",
    roughOpening: {
      widthFormula: "Drum diameter + 12 in. each side for drum integration and framing",
      heightFormula: "Door height (min 7 ft) + drum top clearance 3 in. + structural bearing plate",
      minimumWidth: "6 ft 6 in. (78 in.) diameter drum minimum for ADA-compliant pass (requires bypassing with adjacent door)",
      minimumHeight: "7 ft (84 in.) clear opening height; 8 ft for hotel/airport standard",
      notes: "ADA: revolving doors are NOT accessible — a min. 36 in. clear swing or sliding door must be provided adjacent. Coordinate drum diameter with wing speed requirements (A156.27 §5.1)."
    },
    headerSpec: {
      standardDepth: "Drum canopy depth varies by manufacturer: 10–18 in. typical for full canopy with sensor housing",
      standardHeight: "Ceiling height or canopy height per architectural design; min 3 in. clearance above drum",
      maxSpan: "Drum is self-supporting; overhead canopy structure spans drum diameter + side jambs",
      material: "Cast aluminum or steel drum housing; canopy: aluminum or stainless steel",
      accessPanel: "Access panel in drum center column for motor/drive; canopy access panel for sensor and controller",
      sensorCapHeight: "Integrated presence sensors in drum ceiling; activation sensors at entry each side"
    },
    thresholdSpec: {
      maxHeight: "Flush threshold required — 0 in. height change preferred; 1/4 in. max at drum entry",
      material: "Bronze or stainless steel threshold ring at drum perimeter",
      width: "Continuous ring at full drum circumference; 2–4 in. wide flat",
      bevelRequired: "No bevel — flush transition required at revolving door",
      adaNote: "Revolving doors are NOT part of ADA accessible route. Adjacent accessible door required (ADA 2010 §404.3)"
    },
    sideliteOptions: [
      { name: "Fixed sidelite at entry", description: "Fixed glass panel beside drum opening — guides pedestrians into drum", minWidth: "12 in." },
      { name: "Collapsible wings", description: "Wings fold flat in emergency to form 60+ in. egress path per A156.27", minWidth: "N/A — emergency egress feature" }
    ],
    clearanceRequirements: [
      { location: "Adjacent accessible door", dimension: "36 in. clear minimum swing or sliding door beside revolving door", referenceCode: "ADA 2010 §404.3 / IBC 2024 §1010.1.4.1", note: "Wheelchair users and mobility-impaired must have accessible bypass; ADA requires it" },
      { location: "Wing clearance — drum wall", dimension: "1.5 in. minimum from wing tip to drum wall (curved glass)", referenceCode: "A156.27-2019 §5.2", note: "Prevents finger entrapment between wing and drum wall" },
      { location: "Approach zone", dimension: "60 in. × 60 in. clear floor space at each entry face", referenceCode: "Manufacturer / good practice", note: "Allows user to stop before entering; prevents rushing into rotating drum" }
    ],
    materialSpecs: [
      { component: "Drum housing", material: "Aluminum or stainless steel", minThickness: "0.190 in. wall", finish: "Brushed stainless, anodized, or painted", note: "Curved glass drum: laminated safety glass per A156.27 §4.1" },
      { component: "Wings", material: "Aluminum framing with tempered or laminated glass", minThickness: "1/4 in. glass", finish: "Match drum finish", note: "Collapsible wing mechanism required per A156.27 for means of egress locations" },
      { component: "Drive system", material: "Electric motor with encoder; manual release override", minThickness: "N/A", finish: "Internal — painted or zinc-plated", note: "Speed: governed by A156.27 §5.1 — 0–15 RPM adjustable" }
    ],
    frameSpec: {
      profileDepth: "Varies by drum diameter — drum is structural element",
      profileHeight: "Floor-to-ceiling or canopy height",
      wallThickness: "0.190 in. drum wall minimum",
      material: "Aluminum or stainless steel",
      anchorage: "Central drive post anchored to structural floor slab; perimeter canopy to overhead structure",
      thermalBreak: "Thermal drum seal gasket at drum base ring; canopy: insulated panel if exterior-facing"
    },
    glazingSpec: {
      minThickness: "1/4 in. (6mm) laminated safety glass minimum; 3/8 in. preferred for curved drum glass",
      type: "Laminated safety glass or tempered — A156.27 §4.1; curved glass custom-bent to drum radius",
      edgeDistance: "3/4 in. min glass bite in curved aluminum channels",
      sealant: "Silicone compatible with curved glass; drum perimeter gasket seal",
      impactRating: "HVHZ: NOA required for exterior revolving; curved impact-resistant laminated glass",
      insulated: "Not typically applicable — drum glass is single pane; canopy sections may be insulated"
    },
    csiSection: "08 45 13"
  },
  folding: {
    doorType: "folding",
    roughOpening: {
      widthFormula: "Full clear opening width when extended + fold pocket depth on one or both sides",
      heightFormula: "Door height + 1 in. top clearance + header depth (if powered header used)",
      minimumWidth: "36 in. clear opening (ADA); wider configurations per panel count",
      minimumHeight: "80 in. (6 ft 8 in.) minimum; 84 in. for commercial",
      notes: "Fold pocket requires unobstructed wall space = 1/2 total opening width (one side) or 1/4 each side (biparting). Coordinate pocket location with electrical, plumbing, and structural elements."
    },
    headerSpec: {
      standardDepth: "4.5 in. (surface-mount track) or 6 in. (recessed track with housing)",
      standardHeight: "4.5–6 in. track housing; sensor cap adds 2 in. if sensor-activated",
      maxSpan: "12 ft max for standard fold systems; heavy-duty systems to 16 ft with engineered support",
      material: "Extruded aluminum 6063-T5 top track; continuous support required",
      accessPanel: "Track access at end cap or removable cover panel",
      sensorCapHeight: "Sensor at header if automated; 6.5 in. total header with sensor"
    },
    thresholdSpec: {
      maxHeight: "1/2 in. max ADA; 0 in. preferred (bottom pivot only, no track)",
      material: "No floor track preferred (bottom pivot); if track: aluminum, max 1/2 in. height",
      width: "Bottom pivot or guide: 2 in. wide max",
      bevelRequired: "Any floor track > 1/4 in. must be beveled",
      adaNote: "Trackless folding systems preferred for ADA paths — bottom pivot eliminates floor track trip hazard"
    },
    sideliteOptions: [
      { name: "Fixed end panel", description: "Fixed panel at terminus of fold stack, same frame as fold system", minWidth: "12 in." },
      { name: "Both-side fold", description: "Panels fold to both sides — maximum clear opening", minWidth: "Full opening width / 2 per side stack" }
    ],
    clearanceRequirements: [
      { location: "Fold pocket — each side", dimension: "1/2 opening width clear pocket per side (one-directional); 1/4 each side (biparting)", referenceCode: "Manufacturer specs", note: "Pocket must be full height, clear of structure and MEP" },
      { location: "Leading edge approach", dimension: "18 in. min ADA maneuvering clearance", referenceCode: "ADA 2010 §404.2.4", note: "At ADA-accessible opening" },
      { location: "Overhead track clear", dimension: "Track centered on opening; 2 in. each side of track to obstruction", referenceCode: "Manufacturer specs", note: "Track must span full opening width plus fold pocket" }
    ],
    materialSpecs: [
      { component: "Door panels", material: "Extruded aluminum with tempered glass, solid panel, or partial glass", minThickness: "0.100 in. frame; 1/4 in. glass", finish: "Anodized or powder coat", note: "Panel width typically 16–24 in. each for manageable fold; narrow panels increase panel count" },
      { component: "Top track", material: "Extruded aluminum 6063-T5", minThickness: "0.125 in.", finish: "Match panel finish", note: "Continuous full span; no splices in structural track span" },
      { component: "Hinges", material: "Steel or stainless steel bi-fold hinges", minThickness: "N/A (manufactured hardware)", finish: "Zinc-plated, stainless, or painted", note: "Rated for panel weight; stainless for exterior/high-humidity" }
    ],
    frameSpec: {
      profileDepth: "4.5 in. or 6 in. track depth",
      profileHeight: "Full opening height",
      wallThickness: "0.125 in. aluminum",
      material: "Aluminum 6063-T5",
      anchorage: "Top track anchor to structural header at 16 in. o.c.; bottom pivot anchor to slab",
      thermalBreak: "Required at exterior — panel frame thermal break and weatherstrip perimeter seals"
    },
    glazingSpec: {
      minThickness: "1/4 in. (6mm) tempered",
      type: "Tempered safety glass ASTM C1048 — required for any glass within 18 in. of floor or > 9 sq ft",
      edgeDistance: "1/2 in. glass bite minimum",
      sealant: "Glazing tape + silicone perimeter",
      impactRating: "HVHZ: impact-rated glazing, NOA approval required for exterior",
      insulated: "IGU at exterior for IECC; single pane acceptable at interior"
    },
    csiSection: "08 42 19"
  },
  hermetic: {
    doorType: "hermetic",
    roughOpening: {
      widthFormula: "Clear Opening Width + 8 in. (standard sliding) + 2 in. each side for perimeter seal compression zone",
      heightFormula: "Door height + header depth + 2 in. structural clearance + 1 in. seal compression allowance",
      minimumWidth: "48 in. COW minimum for gurney/bed passage (FGI 2022 Table 2.1-2); 60 in. for ICU",
      minimumHeight: "84 in. (7 ft) minimum; 96 in. for bed/gurney clearance per FGI 2022",
      notes: "Hermetic seals add ~1 in. to each dimension vs. standard sliding. Positive pressure differential (20–60 Pa typical) requires structural wall capable of withstanding differential loads. Coordinate with mechanical engineer."
    },
    headerSpec: {
      standardDepth: "6 in. deep minimum — hermetic header is larger than standard sliding to house seal mechanism",
      standardHeight: "10 in. total including seal actuator and sensor cap; verify with manufacturer",
      maxSpan: "12 ft COW maximum recommended — structural integrity of seal at greater spans requires engineering review",
      material: "Extruded aluminum 6063-T5 with full-perimeter seal actuator mechanism; stainless hardware",
      accessPanel: "Full-width hinged access panel for seal actuator, controller, and carrier service",
      sensorCapHeight: "Sensor cap integrated into header; total header 10 in. AFF to structure"
    },
    thresholdSpec: {
      maxHeight: "Hermetic threshold includes drop-down bottom seal — finished floor to floor when open; seal engages at closed",
      material: "Aluminum threshold with drop-down neoprene or silicone perimeter seal — automatic on door close",
      width: "6 in. standard; seal gasket full door width",
      bevelRequired: "No bevel — floor must be level ±1/16 in. across full COW for seal to engage flush",
      adaNote: "Hermetic threshold drop-seal is flush when door is open; ADA compliance maintained for accessible route. Floor flatness tolerance critical."
    },
    sideliteOptions: [
      { name: "Fixed hermetic sidelite", description: "Fixed glazed panel with hermetic seal gasket — extends sealed envelope around adjacent fixed glass", minWidth: "12 in." },
      { name: "No sidelite (flush wall seal)", description: "Door seals directly to wall partition — most common for cleanroom and OR", minWidth: "N/A" }
    ],
    clearanceRequirements: [
      { location: "Seal compression zone", dimension: "1 in. each side — no obstructions in perimeter seal path", referenceCode: "Manufacturer specs", note: "Protruding hardware, conduit, or wall finishes must not contact seal gasket travel path" },
      { location: "Approach side ADA", dimension: "18 in. min latch-side maneuvering clearance", referenceCode: "ADA 2010 §404.2.4", note: "Healthcare: maintain 18 in. on approach side for wheelchair and gurney approach" },
      { location: "Overhead mechanical", dimension: "Seal actuator requires 2 in. clearance above header to HVAC duct or structure", referenceCode: "Manufacturer specs", note: "Hermetic header taller than standard — coordinate with HVAC ceiling penetrations" }
    ],
    materialSpecs: [
      { component: "Door panel", material: "Extruded aluminum 6063-T5 with integral seal channel", minThickness: "0.125 in. frame; 1/4 in. glass min", finish: "Powder coat or painted — infection-control rated, easily cleanable", note: "No exposed fasteners on patient-side face — smooth cleanable surface required per FGI 2022" },
      { component: "Perimeter seal", material: "Neoprene or silicone inflatable or compression gasket", minThickness: "N/A — seal specification per differential pressure rating", finish: "N/A", note: "Pressure differential rating must be stated in Pa or in. w.g.; typical 20–60 Pa" },
      { component: "Header/controls", material: "Aluminum housing; stainless hardware", minThickness: "0.125 in.", finish: "Powder coat", note: "Controller: autoclave/wipe-down compatible if in sterile field" }
    ],
    frameSpec: {
      profileDepth: "6 in. hermetic frame — wider than standard to accommodate seal channels",
      profileHeight: "Full opening height with seal perimeter",
      wallThickness: "0.125 in. minimum; 0.190 in. recommended for hermetic pressure loading",
      material: "Aluminum 6063-T5 with integral seal groove",
      anchorage: "Anchor to structural wall at 12 in. o.c.; hermetic door frame requires rigid, non-deflecting substrate",
      thermalBreak: "Thermal break required; infection-control environments may require sealed thermal break to prevent condensation in cavity"
    },
    glazingSpec: {
      minThickness: "1/4 in. (6mm) tempered minimum; hermetic systems typically use 3/8 in. for rigidity",
      type: "Tempered safety glass ASTM C1048 — laminated option for OR environments with radiation shielding",
      edgeDistance: "3/4 in. glass bite with hermetic compression gasket at lite pocket",
      sealant: "Structural silicone + compression gasket — hermetically sealed lite pocket",
      impactRating: "HVHZ: impact-rated glazing with NOA for exterior-facing hermetic doors",
      insulated: "IGU standard for any hermetically-sealed exterior envelope door; interior OR doors: single pane with hermetic gasket"
    },
    csiSection: "08 42 29"
  },
  ICU: {
    doorType: "ICU",
    roughOpening: {
      widthFormula: "Clear Opening Width per FGI 2022 Table 2.1-2 + 8 in. frame allowance",
      heightFormula: "Door height (84 in. min per FGI for patient rooms) + header depth + 2 in. clearance",
      minimumWidth: "44.5 in. clear (FGI 2022 Table 2.1-2 for ICU patient room on 8 ft frame); 60 in. COW for full bed pass",
      minimumHeight: "84 in. (7 ft) minimum per FGI 2022; 96 in. preferred for ICU bed clearance",
      notes: "FGI 2022 Table 2.1-2 requires minimum 44 in. clear width for ICU patient rooms. Infection-control materials required on door and frame surfaces per FGI. Coordinate with hospital infection-control coordinator before design."
    },
    headerSpec: {
      standardDepth: "6 in. deep — standard or hermetic header depending on room pressure requirement",
      standardHeight: "8–10 in. depending on seal type; 8 in. standard, 10 in. hermetic variant",
      maxSpan: "12 ft COW maximum for healthcare-grade systems; structural engineer review required for wider",
      material: "Aluminum 6063-T5; stainless hardware; infection-control rated finishes",
      accessPanel: "Full-width hinged access panel; access from corridor side only (not patient room side)",
      sensorCapHeight: "8 in. total header; sensor integrated with infection-control housing — wipeable surfaces"
    },
    thresholdSpec: {
      maxHeight: "Flush threshold required — 0 in. preferred; 1/4 in. max for wheeled equipment passage",
      material: "Aluminum flush threshold with antimicrobial coating or stainless steel",
      width: "6 in. wide threshold — full door width",
      bevelRequired: "Any change in floor level > 1/16 in. requires ramped transition — no abrupt edges for gurney wheels",
      adaNote: "All ICU room doors must be ADA-accessible; flush threshold critical for gurney/wheelchair passage"
    },
    sideliteOptions: [
      { name: "Fixed observation sidelite", description: "Fixed glazed sidelite for corridor observation of patient room — common in ICU", minWidth: "12 in." },
      { name: "No sidelite (privacy/infection control)", description: "Solid wall each side — infection-control or privacy requirement", minWidth: "N/A" }
    ],
    clearanceRequirements: [
      { location: "FGI clear width", dimension: "44.5 in. clear (ICU patient room, FGI 2022 Table 2.1-2)", referenceCode: "FGI 2022 Table 2.1-2", note: "Measured in clear from door face to opposite jamb face, door in open position" },
      { location: "Approach — corridor side ADA", dimension: "18 in. min latch-side maneuvering clearance", referenceCode: "ADA 2010 §404.2.4", note: "Corridor must be free of obstructions within maneuvering clearance zone" },
      { location: "Patient room approach", dimension: "60 in. min in room perpendicular to door swing or slide", referenceCode: "FGI 2022 §2.1-2.5", note: "Bed position and medical equipment must not block door operation" }
    ],
    materialSpecs: [
      { component: "Door panel", material: "Aluminum or stainless steel — infection-control finish", minThickness: "0.125 in. frame; 1/4 in. glass", finish: "Smooth, non-porous, easily cleanable — no exposed fasteners on patient side", note: "FGI 2022: surfaces must be impervious to moisture and compatible with hospital-grade disinfectants" },
      { component: "Frame", material: "Aluminum with stainless trim; or stainless steel frame", minThickness: "0.125 in.", finish: "Smooth, sealed — no surface voids", note: "Frame corners sealed — no gaps where pathogens can accumulate" },
      { component: "Hardware", material: "Stainless steel 316 — lever handles, push/pull hardware", minThickness: "N/A", finish: "Satin stainless — no chrome plating that can flake", note: "Antimicrobial hardware available (copper alloy lever handles proven effective)" }
    ],
    frameSpec: {
      profileDepth: "6 in. — healthcare-grade with infection-control frame seal",
      profileHeight: "Full opening height — no gaps at head or jamb",
      wallThickness: "0.125 in. min; 0.190 in. for hermetic variant",
      material: "Aluminum 6063-T5 or stainless; all crevices sealed",
      anchorage: "Anchor at 12 in. o.c.; frame rigidity critical for gurney impact resistance",
      thermalBreak: "Required at exterior; interior ICU: vapor barrier at frame perimeter to prevent interstitial condensation"
    },
    glazingSpec: {
      minThickness: "1/4 in. (6mm) tempered; 3/8 in. recommended for durability in healthcare",
      type: "Tempered safety glass ASTM C1048; laminated for shatter containment in patient areas",
      edgeDistance: "3/4 in. glass bite with sealed glazing gasket — no open joints",
      sealant: "Silicone — hospital-grade, low-VOC, antimicrobial formulation; hermetic seal at lite pocket",
      impactRating: "Not typically HVHZ (interior); if exterior-facing: NOA impact-rated required",
      insulated: "IGU at exterior; interior: single pane with sealed frame — no air gaps in patient room envelope"
    },
    csiSection: "08 42 29"
  },
  power_assist: {
    doorType: "power_assist",
    roughOpening: {
      widthFormula: "Standard door opening — no additional width for operator (surface-mounted to existing frame)",
      heightFormula: "Standard door height — operator mounts to existing door frame head; no header increase",
      minimumWidth: "32 in. clear (ADA §404.2.3); 36 in. door leaf typical",
      minimumHeight: "80 in. (6 ft 8 in.) standard; same as manual door",
      notes: "Power-assist operator mounts to existing or new door frame — no dedicated header required. Operator housing typically 4.75 in. deep × 3.75 in. high surface-applied. Existing frames can be retrofitted."
    },
    headerSpec: {
      standardDepth: "4.75 in. deep × 3.75 in. high — surface-applied to door frame head or wall above frame",
      standardHeight: "3.75 in. operator housing + frame height; total varies by door height",
      maxSpan: "Operator spans door opening width; no extended span required",
      material: "Aluminum casting or extruded housing; steel arm and spindle",
      accessPanel: "End-cap or cover plate removal for spring/fluid adjustment",
      sensorCapHeight: "Push plate or wave sensor at standard mounting height; no sensor cap on door header"
    },
    thresholdSpec: {
      maxHeight: "1/2 in. max per ADA §303 — same as manual door",
      material: "Standard saddle threshold or no threshold (ADA accessible preferred)",
      width: "Match door leaf width",
      bevelRequired: "Required if > 1/4 in.; max 1:2 slope",
      adaNote: "Power-assist specifically designed for ADA accessibility; flush threshold strongly recommended"
    },
    sideliteOptions: [
      { name: "Fixed sidelite", description: "Standard fixed sidelite — operator unaffected by sidelite presence", minWidth: "12 in." },
      { name: "No sidelite", description: "Standard configuration — operator on door frame head", minWidth: "N/A" }
    ],
    clearanceRequirements: [
      { location: "Latch side ADA", dimension: "18 in. min maneuvering clearance at latch side on pull approach", referenceCode: "ADA 2010 §404.2.4.1", note: "Power-assist reduces opening force but maneuvering clearance still required" },
      { location: "Hinge side ADA", dimension: "12 in. min on hinge side at pull approach", referenceCode: "ADA 2010 §404.2.4.1", note: "Required even with power assist — user must still approach door" },
      { location: "Operator arm swing", dimension: "Operator arm: 5–6 in. clearance above door top in open position", referenceCode: "Manufacturer specs", note: "Verify ceiling/soffit height allows full operator arm travel in open position" }
    ],
    materialSpecs: [
      { component: "Operator unit", material: "Cast aluminum housing; steel spindle and arm", minThickness: "N/A (manufactured assembly)", finish: "Powder coat — bronze, silver, gold, black standard; custom RAL colors", note: "A156.19 §3 power-assist — motor reduces opening force only; door still requires manual push" },
      { component: "Door panel", material: "Hollow metal steel or solid-core wood — standard door, any material", minThickness: "1-3/4 in. (standard full-commercial)", finish: "Paint, stain, or factory prime", note: "Power-assist compatible with any standard door type — retrofit or new" },
      { component: "Push plate / activation", material: "Stainless steel or brushed aluminum push plate; wave sensor optional", minThickness: "0.050 in. (16 ga. SS)", finish: "Satin stainless or brushed aluminum", note: "A156.19 §3: knowing-act activation required — push plate or wave sensor" }
    ],
    frameSpec: {
      profileDepth: "Standard door frame — no modification required for power-assist",
      profileHeight: "Standard door height",
      wallThickness: "Standard hollow metal or aluminum — 16 ga. min",
      material: "Hollow metal steel or aluminum extrusion",
      anchorage: "Existing frame anchorage; operator brackets anchor to frame head at 3 points min",
      thermalBreak: "Per existing frame specification"
    },
    glazingSpec: {
      minThickness: "1/4 in. (6mm) tempered for any glass in door panel per CPSC 16 CFR Part 1201",
      type: "Tempered safety glass ASTM C1048 Kind FT — applicable if door has vision lite",
      edgeDistance: "1/2 in. min glass bite at lite pocket",
      sealant: "Glazing tape + silicone at vision lite perimeter",
      impactRating: "HVHZ: NOA required if exterior-facing door with glass; power-assist door same glazing requirements as standard swing door",
      insulated: "IGU at exterior vision lites for IECC compliance; interior: single pane acceptable"
    },
    csiSection: "08 71 13"
  }
};

export function getArchSpec(doorType: DoorType): ArchSpec {
  return ARCH_SPECS[doorType];
}

export function getAllArchSpecs(): ArchSpec[] {
  return Object.values(ARCH_SPECS);
}
