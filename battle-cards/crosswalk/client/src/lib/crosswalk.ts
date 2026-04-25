// ─────────────────────────────────────────────────────────────────────────────
// Product-Standard Crosswalk Data Library
// Maps ASSA ABLOY, dormakaba, Stanley Access, and Horton Automatics to:
//   — ANSI/BHMA certifications (A156.10, A156.19, A156.38)
//   — Sensor ecosystem (activation, presence, safety)
//   — Florida approvals (NOA, TAS, Miami-Dade HVHZ)
//   — Key specs and PM interview angles
//   — Market verticals, competitive threats, price positioning
// ─────────────────────────────────────────────────────────────────────────────

export type BrandId = "assa_abloy" | "dormakaba" | "stanley" | "horton";
export type DoorMotion = "sliding" | "swing" | "folding" | "revolving" | "telescoping" | "hermetic";
export type EnergyClass = "full-energy" | "low-energy" | "power-assist" | "manual-open";
export type CertStatus = "certified" | "partial" | "not-listed" | "verify";
export type FloridaStatus = "noa-certified" | "hvhz-listed" | "noa-pending" | "not-certified" | "verify";
export type MarketVertical = "retail" | "healthcare" | "hospitality" | "airport" | "industrial" | "government" | "qsr" | "education";
export type PriceRange = "economy" | "mid" | "premium" | "ultra-premium";
export type InstalledBase = "dominant" | "strong" | "moderate" | "niche";

// ── Standard certification detail ─────────────────────────────────────────────
export interface StandardCert {
  standard: "A156.10" | "A156.19" | "A156.38";
  edition: string;
  status: CertStatus;
  notes: string;
  keyRequirements?: string[];
}

// ── Sensor ecosystem entry ────────────────────────────────────────────────────
export interface SensorSpec {
  category: "activation" | "presence" | "safety" | "obstruction";
  type: string;
  standard?: string;
  notes: string;
  optional?: boolean;
}

// ── Florida compliance data ───────────────────────────────────────────────────
export interface FloridaApproval {
  status: FloridaStatus;
  noaNumber?: string;
  testStandards?: string[];
  designPressure?: string;
  hvhz: boolean;
  fbc9thNotes?: string;
  notes: string;
}

// ── Interview / PM angle ─────────────────────────────────────────────────────
export interface PMAngle {
  topic: string;
  insight: string;
  useIn?: "interview" | "strategy" | "both";
}

// ── Core product record ──────────────────────────────────────────────────────
export interface Product {
  id: string;
  brand: BrandId;
  name: string;
  fullName: string;
  motion: DoorMotion;
  energyClass: EnergyClass;
  primaryApplication: string[];
  description: string;
  standardCerts: StandardCert[];
  sensorSpecs: SensorSpec[];
  floridaApproval: FloridaApproval;
  keySpecs: Record<string, string>;
  pmAngles: PMAngle[];
  productUrl?: string;
  discontinued?: boolean;
  // New fields
  marketVerticals: MarketVertical[];
  priceRange: PriceRange;
  installedBase: InstalledBase;
  keyDifferentiators: string[];
  competitiveThreats: string[];
  knownLimitations: string[];
  discontinuedOrLegacy?: boolean;
  flKeyNote?: string;
  sensorCompatibility?: string[];
}

// ── Brand market coverage map ─────────────────────────────────────────────────
export interface BrandMarketMap {
  brand: BrandId;
  verticalStrength: Record<MarketVertical, "dominant" | "strong" | "moderate" | "weak" | "absent">;
  flHvhzReady: boolean;
  usServiceFootprint: "national" | "regional" | "limited";
  priceIndex: number; // 1–10, relative to competitors
  certificationDepth: "full" | "partial" | "limited";
}

// ── Standards gap analysis entry ──────────────────────────────────────────────
export interface StandardsGapEntry {
  standard: string; // e.g. "ANSI/BHMA A156.10", "Florida NOA / TAS 201/202/203 (HVHZ)"
  description: string;
  coveredProductIds: string[];
  notCoveredProductIds: string[];
  verifyProductIds: string[];
}

// ── Competitive displacement pair ─────────────────────────────────────────────
export interface CompetitiveDisplacement {
  productId: string;
  displacesProductIds: string[]; // other brand product IDs that directly compete
  differentiator: string;
}

// ── Brand metadata ─────────────────────────────────────────────────────────
export interface Brand {
  id: BrandId;
  name: string;
  fullName: string;
  parent?: string;
  hq: string;
  color: string;
  accentClass: string;
  marketPosition: string;
  usStrength: string;
  flStrength: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRANDS
// ═══════════════════════════════════════════════════════════════════════════════

export const BRANDS: Record<BrandId, Brand> = {
  assa_abloy: {
    id: "assa_abloy",
    name: "ASSA ABLOY",
    fullName: "ASSA ABLOY Entrance Systems",
    hq: "New Haven, CT (US HQ); Stockholm, Sweden (Global)",
    color: "#003087",
    accentClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    marketPosition:
      "Global #1 in door opening solutions. Widest portfolio, deepest US field-service network, strongest NOA/HVHZ-certified product lineup in Florida. ecoLOGIC AI module signals IoT/connected-building strategy.",
    usStrength:
      "National field-service footprint, AAADM-certified coverage all 50 states, broadest full-energy to low-energy spectrum, deepest revolving door line",
    flStrength:
      "NOA-certified exterior products, TAS 201/202/203 tested, HVHZ-ready for Miami-Dade & Broward",
  },
  dormakaba: {
    id: "dormakaba",
    name: "dormakaba",
    fullName: "dormakaba Group",
    parent: "Publicly traded (SIX: DOKA)",
    hq: "Rümlang, Switzerland",
    color: "#C8102E",
    accentClass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    marketPosition:
      "Global #2 in access & security. Strong European heritage. Deep revolving door portfolio (KTV/KTC). ESA sliding line covers full commercial spectrum. ED operator family competitive on price/capability.",
    usStrength:
      "ESA sliding family breadth, ED operator competitive pricing, KTV/KTC revolving depth, curved sliding specialty (BST/FBST)",
    flStrength:
      "Limited HVHZ-certified exterior door portfolio; verify NOA coverage before FL HVHZ bids",
  },
  stanley: {
    id: "stanley",
    name: "Stanley Access",
    fullName: "Stanley Access Technologies",
    parent: "Stanley Black & Decker",
    hq: "Farmington, CT",
    color: "#FFB900",
    accentClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    marketPosition:
      "US retail/commercial market leader in automatic sliding doors. Dura-Glide is the entrenched reference product for grocery and big-box. M-Force swing operator targets heavy doors. Specialty products cover hurricane, blast, healthcare, and QSR.",
    usStrength:
      "Dura-Glide installed base dominance in US retail, massive distributor/service network, strong GC relationships, ICC ESR listing for M-Force",
    flStrength:
      "Dura-Storm line provides HVHZ-rated hurricane impact sliding; standard products are Florida-compliant; limited NOA portfolio vs. ASSA ABLOY",
  },
  horton: {
    id: "horton",
    name: "Horton Automatics",
    fullName: "Horton Automatics (Division of Overhead Door Corporation)",
    parent: "Overhead Door Corporation / Sanwa Holdings",
    hq: "Corpus Christi, TX",
    color: "#E87722",
    accentClass: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    marketPosition:
      "Legacy US automatic door brand with massive retail and grocery installed base (Horton 2000). Strong drive-thru/QSR niche. Healthcare ICU/CCU specialty line. Regional service network.",
    usStrength:
      "Horton 2000 installed base in US retail/grocery, strong QSR drive-thru niche (S8000 window), healthcare ICU line, Overhead Door dealer network",
    flStrength:
      "Standard Florida FBC compliance; limited HVHZ exterior NOA portfolio; verify for HVHZ projects",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND MARKET MAPS
// ═══════════════════════════════════════════════════════════════════════════════

export const BRAND_MARKET_MAPS: Record<BrandId, BrandMarketMap> = {
  assa_abloy: {
    brand: "assa_abloy",
    verticalStrength: {
      retail: "strong",
      healthcare: "dominant",
      hospitality: "dominant",
      airport: "strong",
      industrial: "moderate",
      government: "strong",
      qsr: "weak",
      education: "moderate",
    },
    flHvhzReady: true,
    usServiceFootprint: "national",
    priceIndex: 8,
    certificationDepth: "full",
  },
  dormakaba: {
    brand: "dormakaba",
    verticalStrength: {
      retail: "moderate",
      healthcare: "strong",
      hospitality: "strong",
      airport: "strong",
      industrial: "moderate",
      government: "moderate",
      qsr: "absent",
      education: "moderate",
    },
    flHvhzReady: false,
    usServiceFootprint: "regional",
    priceIndex: 6,
    certificationDepth: "partial",
  },
  stanley: {
    brand: "stanley",
    verticalStrength: {
      retail: "dominant",
      healthcare: "strong",
      hospitality: "moderate",
      airport: "moderate",
      industrial: "strong",
      government: "strong",
      qsr: "strong",
      education: "moderate",
    },
    flHvhzReady: true,
    usServiceFootprint: "national",
    priceIndex: 6,
    certificationDepth: "full",
  },
  horton: {
    brand: "horton",
    verticalStrength: {
      retail: "dominant",
      healthcare: "strong",
      hospitality: "weak",
      airport: "weak",
      industrial: "moderate",
      government: "weak",
      qsr: "dominant",
      education: "weak",
    },
    flHvhzReady: false,
    usServiceFootprint: "regional",
    priceIndex: 4,
    certificationDepth: "partial",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════

export const PRODUCTS: Product[] = [

  // ────────────────────────────────────────────────────────────────────────────
  // ASSA ABLOY ENTRANCE SYSTEMS
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: "aa-sl500",
    brand: "assa_abloy",
    name: "SL500",
    fullName: "ASSA ABLOY SL500 Sliding Automatic Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "commercial", "healthcare", "hospitality"],
    description:
      "High-traffic full-energy automatic sliding door operator. ASSA ABLOY's core US commercial sliding product. Available in bi-parting, single-slide, and telescoping configurations. Max 200 kg/leaf (bi-part) or 240 kg (single). Clear opening width 1000–3000 mm. Operating speed up to 1.7 m/s. NOA/HVHZ certified for exterior Florida use.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes:
          "Full ANSI/BHMA A156.10-2024 certification. Meets 30 lbf dynamic force limit at last 10°, 8 in. inactive sensor zone, and §8.3 electronic sensor fault monitoring.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Pre-cycle sensor fault check §8.3",
          "Presence sensor 8 in. inactive zone",
          "50 in. AFF signage",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave (motion) sensor — overhead mount",
        standard: "A156.10 §8.1",
        notes: "Standard activation zone; adjustable range for bi-parting and single-slide. Dual-sensor configuration for high-traffic lobbies.",
      },
      {
        category: "presence",
        type: "Overhead IR presence or safety mat",
        standard: "A156.10 §8.2",
        notes: "Holds door open while occupant is in detection zone. Required for power-operated configurations.",
      },
      {
        category: "safety",
        type: "Electronic pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3 (2017+)",
        notes: "Verifies sensor function before each closing cycle. Fault = door held open or safe-state.",
      },
      {
        category: "obstruction",
        type: "Kinetic/force reversal",
        standard: "A156.10 §6.x",
        notes: "Door reverses on obstruction. Max 30 lbf at last 10° (2024 ed., down from 40 lbf in 2011).",
      },
    ],
    floridaApproval: {
      status: "noa-certified",
      noaNumber: "Verify current NOA with ASSA ABLOY ENS / Miami-Dade BOAF",
      testStandards: ["TAS 201", "TAS 202", "TAS 203"],
      designPressure: "Verify product-specific NOA for design pressure ratings",
      hvhz: true,
      fbc9thNotes:
        "FBC 9th Edition takes effect Dec 31, 2026. Permits issued on/after that date must reference 9th Edition cycle approvals. HB 911 mandates 160 mph envelope. Verify current NOA covers 160 mph; re-test may be required if existing NOA is rated below new threshold.",
      notes:
        "ASSA ABLOY ENS exterior automatic sliding doors carry Miami-Dade NOA and TAS 201/202/203 for HVHZ (Miami-Dade + Broward). Permanent NOA label required per FBC §1709.5.",
    },
    keySpecs: {
      "Max door weight (bi-parting)": "200 kg per leaf",
      "Max door weight (single)": "240 kg",
      "Clear opening width": "1000–3000 mm",
      "Operating speed": "Up to 1.7 m/s",
      "Configurations": "Bi-parting, single-slide, telescoping",
      "Certification": "A156.10 certified; NOA/HVHZ (exterior)",
    },
    pmAngles: [
      {
        topic: "Force reduction as PM signal",
        insight:
          "The 2024 A156.10 30 lbf limit (down from 40 lbf) required controller and motor updates. PM framing: how does a standards change propagate through firmware, test certification, and install-base advisory processes?",
        useIn: "interview",
      },
      {
        topic: "NOA as a market access gate",
        insight:
          "Florida NOA certification is a binary market-access requirement for exterior HVHZ doors. Products without it cannot be permitted. This is a durable moat — ASSA ABLOY's NOA investment limits fast-following competitors in Florida.",
        useIn: "strategy",
      },
      {
        topic: "SL500 vs. Dura-Glide 2000 displacement strategy",
        insight:
          "At replacement time in retail, the SL500 competes directly against the Dura-Glide 2000 installed base. ASSA ABLOY's NOA advantage matters for Florida projects; Stanley's brand recognition and GC relationships matter elsewhere.",
        useIn: "both",
      },
    ],
    marketVerticals: ["retail", "healthcare", "hospitality", "airport"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "NOA/HVHZ certified for exterior Florida use — key market access advantage",
      "1.7 m/s operating speed — among fastest in class",
      "Handles up to 240 kg single-slide panels — wide heavy-door coverage",
      "Broadest configuration matrix: bi-part, single, telescoping in one platform",
      "Backed by national AAADM-certified service network",
    ],
    competitiveThreats: ["st-dura-glide-2000", "st-dura-glide-3000", "dk-esa100", "dk-esa200", "horton-2000"],
    knownLimitations: [
      "Header depth is standard (not slim-profile) — loses on aesthetics vs. dormakaba ESA line in architect-driven specs",
      "Price positioned higher than Horton and dormakaba; GC value-engineering often targets this",
      "NOA re-certification required when FBC 9th Ed. 160 mph mandate takes effect Dec 2026",
    ],
    flKeyNote: "NOA certified for HVHZ. Verify NOA number and design pressure rating for project-specific requirements before FBC 9th Ed. transition deadline.",
    productUrl: "https://www.assaabloyentrance.com/us/en/products/automatic-door-systems/",
  },

  {
    id: "aa-sl500cr",
    brand: "assa_abloy",
    name: "SL500 Clean Room",
    fullName: "ASSA ABLOY SL500 Clean Room Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["healthcare", "pharma", "labs"],
    description:
      "Clean Room variant of the SL500 platform. ISO 3 (Class 1) rated. Flush header eliminates particle-trapping ledges. Dual tandem carriage wheels reduce particulate generation. 20% faster opening cycle vs. standard SL500. Optimized for aseptic pharmaceutical manufacturing, BSL labs, and hospital sterile processing.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified. All standard force, sensor, and signage requirements apply. Flush header modification does not affect certification.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3", "8 in. inactive zone"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor — flush-mounted",
        standard: "A156.10 §8.1",
        notes: "Flush-mount sensor integration to maintain cleanroom particle profile. No protruding sensor housings.",
      },
      {
        category: "presence",
        type: "Overhead IR presence — flush integrated",
        standard: "A156.10 §8.2",
        notes: "Integrated sensor minimizes ledges and protrusions that would trap particles in cleanroom environment.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Required electronic fault check before each closing cycle.",
      },
      {
        category: "obstruction",
        type: "Kinetic reversal — low-particulate mechanism",
        standard: "A156.10 §6.x",
        notes: "Standard force reversal with particulate-optimized internal mechanism.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Clean Room variant is typically interior-only in controlled-environment facilities. HVHZ NOA not typically required. Verify if any exterior cleanroom application requires NOA.",
    },
    keySpecs: {
      "ISO cleanroom rating": "ISO 3 (Class 1) — particle-free header design",
      "Opening speed": "20% faster than standard SL500",
      "Carriage wheels": "Dual tandem — reduces particulate generation",
      "Header design": "Flush — no ledges, particle traps eliminated",
      "Primary markets": "Pharma manufacturing, BSL labs, hospital sterile processing, ORs",
    },
    pmAngles: [
      {
        topic: "Cleanroom rating as vertical-market lock-in",
        insight:
          "ISO 3 certification on an automatic door is a rare, high-barrier qualification. Once a pharma facility standardizes on a cleanroom-rated door system, switching costs are enormous (re-validation, regulatory documentation). This creates durable installed-base retention.",
        useIn: "strategy",
      },
      {
        topic: "Feature prioritization: speed vs. particle control",
        insight:
          "The 20% faster opening speed reduces the time the door is held open, which directly reduces air exchange between cleanroom and adjacent spaces — a functional benefit, not just a performance spec. PM framing: understanding how product specs translate to customer operational outcomes.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare"],
    priceRange: "premium",
    installedBase: "niche",
    keyDifferentiators: [
      "ISO 3 (Class 1) cleanroom rating — only automatic sliding door at this certification level",
      "Flush header eliminates particle traps — required for aseptic environments",
      "20% faster cycle reduces air exchange events",
      "Dual tandem carriage wheels minimize particulate from mechanical wear",
    ],
    competitiveThreats: ["st-dura-glide-3000"],
    knownLimitations: [
      "Interior-only application — no HVHZ NOA",
      "Requires cleanroom-qualified installation and validation process",
      "Premium pricing; limited to pharma/lab/hospital sterile processing verticals",
      "Small addressable market vs. standard commercial SL500",
    ],
  },

  {
    id: "aa-sl521",
    brand: "assa_abloy",
    name: "SL521 Telescoping",
    fullName: "ASSA ABLOY SL521 Telescoping Sliding Door",
    motion: "telescoping",
    energyClass: "full-energy",
    primaryApplication: ["airports", "hospitals", "high-traffic commercial"],
    description:
      "4-leaf telescopic sliding door for high-traffic and extreme-environment applications. Delivers maximum clear opening width (COW 4+ meters) in a constrained header pocket. Heavy-duty construction for airports, hospital main entrances, and high-volume transit facilities.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for telescoping configuration. All sensor, force, and signage requirements apply across all telescoping panels.",
        keyRequirements: [
          "30 lbf limit across all panel edges",
          "Sensor coverage for full extended opening width",
          "Sensor fault monitoring §8.3",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Wide-angle microwave motion sensor",
        standard: "A156.10 §8.1",
        notes: "Wide-angle coverage required for 4+ meter opening width. Dual-sensor configuration typical.",
      },
      {
        category: "presence",
        type: "Multiple presence sensors — full width coverage",
        standard: "A156.10 §8.2",
        notes: "Sensor array must cover full extended COW to prevent close-on-pedestrian events.",
      },
      {
        category: "safety",
        type: "Sensor fault check + edge sensors on each panel",
        standard: "A156.10 §8.3",
        notes: "All telescoping panel leading edges require obstruction detection. Pinch-point protection between stacking panels.",
      },
      {
        category: "obstruction",
        type: "Force reversal on all panel edges",
        standard: "A156.10 §6.x",
        notes: "30 lbf max on all leading edges. Panel-to-panel pinch detection also required.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Telescoping configurations require separate NOA from standard bi-parting. Verify product-specific NOA for exterior HVHZ applications. Airport/hospital main entrances in FL HVHZ require specific validation.",
    },
    keySpecs: {
      "Configuration": "4-leaf telescopic (2 panels per side)",
      "Clear opening width": "COW up to 4+ meters",
      "Traffic rating": "Extreme-duty — airports, hospital main entries",
      "Panel capacity": "Heavy-duty construction",
      "Primary markets": "Airports, hospitals, transit hubs, large retail anchors",
    },
    pmAngles: [
      {
        topic: "Telescoping as sensor-coverage design challenge",
        insight:
          "A 4-meter telescoping opening requires sensor arrays covering a very wide zone with no gaps. Each panel stack creates potential edge-detection gaps. This is an interesting product engineering challenge — the sensor system complexity scales non-linearly with opening width.",
        useIn: "interview",
      },
      {
        topic: "Airport and hospital main entry as a high-margin niche",
        insight:
          "Telescoping configurations for airport and hospital main entrances are infrequent but high-value projects. Winning one airport main entry spec typically generates years of service contract revenue. The installed base is small but the per-unit value is very high.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["airport", "healthcare"],
    priceRange: "premium",
    installedBase: "niche",
    keyDifferentiators: [
      "4-leaf configuration delivers widest possible opening in a constrained header",
      "Extreme-duty construction rated for airport and hospital main entry volume",
      "Unified platform with SL500 — common parts and service infrastructure",
    ],
    competitiveThreats: ["st-dura-glide-tele", "dk-esa300t", "dk-esa500", "horton-9000"],
    knownLimitations: [
      "Higher installation complexity — requires precise track and header dimensioning",
      "Separate NOA required for HVHZ exterior vs. standard SL500 NOA",
      "Deeper header pocket than standard bi-parting — may not fit retrofit openings",
    ],
  },

  {
    id: "aa-sw100",
    brand: "assa_abloy",
    name: "SW100",
    fullName: "ASSA ABLOY SW100 Low-Energy Swing Door Operator",
    motion: "swing",
    energyClass: "low-energy",
    primaryApplication: ["light commercial", "ADA-path retrofits"],
    description:
      "Cost-effective, adaptable low-energy swing door operator. Designed for new construction and retrofit ADA-path applications where full-energy operation is not required. A156.19 certified.",
    standardCerts: [
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "ANSI/BHMA A156.19-2019 certified. Low-energy swing. AUTOMATIC CAUTION DOOR signage required: 6 in. diameter, yellow, 50 in. AFF.",
        keyRequirements: [
          "AUTOMATIC CAUTION DOOR sign — 6 in. diam., yellow, 50 in. AFF",
          "Max 15 lbf opening force from latched",
          "Max 5 lbf in-motion",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push-plate (primary) or low-energy hand-wave sensor",
        standard: "A156.19",
        notes: "User-actuated activation. Push-and-go operation. Motion sensor optional for retrofit.",
        optional: true,
      },
      {
        category: "presence",
        type: "Optional overhead presence",
        standard: "A156.19",
        notes: "Optional presence to hold door open. Slow open speed reduces injury risk without full presence detection.",
        optional: true,
      },
      {
        category: "safety",
        type: "Force-limited slow-open cycle",
        standard: "A156.19",
        notes: "A156.19 low-energy doors rely on slow open speed (≤7 in./sec) to limit contact forces rather than kinetic reversal.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior or non-HVHZ exterior. For HVHZ exterior swing, full-energy A156.10 product with NOA required.",
    },
    keySpecs: {
      "Opening force": "Max 15 lbf from latched",
      "In-motion force": "Max 5 lbf",
      "Opening speed": "≤7 in./sec (A156.19 limit)",
      "Mounting": "Surface mount",
      "Target use": "ADA accessible entrances, interior vestibule, light commercial",
    },
    pmAngles: [
      {
        topic: "A156.19 vs. A156.10 selection — the first spec decision",
        insight:
          "Every swing door project begins with this decision. A156.19 is less costly and appropriate for low-traffic ADA paths. A156.10 is required for high-traffic and full hands-free operation. Different standards create different market segments with different price points.",
        useIn: "both",
      },
    ],
    marketVerticals: ["retail", "healthcare", "education"],
    priceRange: "economy",
    installedBase: "moderate",
    keyDifferentiators: [
      "Low cost — economy entry point for ADA compliance",
      "Retrofit-friendly surface mount installation",
      "A156.19 certified for code compliance",
    ],
    competitiveThreats: ["dk-ed50", "dk-ed100", "st-magic-access", "horton-4000"],
    knownLimitations: [
      "Not appropriate for high-traffic doors — low-energy activation requires user initiation",
      "AUTOMATIC CAUTION DOOR signage required — less preferred aesthetically",
      "Cannot be used as-is for HVHZ exterior applications",
    ],
  },

  {
    id: "aa-sw200i-surface",
    brand: "assa_abloy",
    name: "SW200i Surface",
    fullName: "ASSA ABLOY SW200i Surface-Mount Full-Energy Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["healthcare", "hospitality", "high-traffic commercial"],
    description:
      "Full-energy surface-mount swing door operator with 24V DC motor and electromechanical control. Handles wind and stack pressure compensation. A156.10 certified. Primary workhorse for healthcare corridor and hospitality entrance applications.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "Full A156.10-2024 certification. 24V DC motor. Wind/stack pressure compensation. Force, sensor, and signage requirements met.",
        keyRequirements: ["30 lbf closing force limit", "Sensor fault monitoring §8.3", "50 in. AFF signage"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push-plate, wave sensor, or overhead motion",
        standard: "A156.10 §8.1",
        notes: "Multiple activation methods. Hands-free wave sensor for healthcare and food service.",
      },
      {
        category: "presence",
        type: "Overhead presence sensor — swing arc coverage",
        standard: "A156.10 §8.2",
        notes: "Covers full door swing arc. Holds door open while occupant detected.",
      },
      {
        category: "safety",
        type: "Electronic sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle sensor check. Fault = safe-state hold or slow-close.",
      },
      {
        category: "obstruction",
        type: "Kinetic reversal on obstruction contact",
        standard: "A156.10 §6.x",
        notes: "30 lbf maximum at last 10° of travel.",
      },
    ],
    floridaApproval: {
      status: "noa-certified",
      testStandards: ["TAS 201", "TAS 202", "TAS 203"],
      hvhz: true,
      notes: "Exterior swing configurations available with NOA for HVHZ. Verify current NOA number and design pressure for specific project. Interior-only use does not require NOA.",
    },
    keySpecs: {
      "Motor": "24V DC electromechanical",
      "Wind/stack compensation": "Included — adjusts force dynamically",
      "Mounting": "Surface — top-of-door header mount",
      "Certification": "A156.10 full-energy",
      "Primary markets": "Healthcare corridor, hospitality lobby, commercial main entry",
    },
    pmAngles: [
      {
        topic: "Wind/stack compensation as spec differentiator",
        insight:
          "High-rise and airport buildings have significant stack pressure on entrance doors. An operator without wind/stack compensation will fight the building pressure on every cycle, increasing wear and inconsistent operation. This is a spec-level differentiator that matters enormously in tall buildings.",
        useIn: "interview",
      },
      {
        topic: "Healthcare corridor swing door as regulatory-driven market",
        insight:
          "ADA §404.2.9 requires max 5 lbf interior door operating force. Hospital corridors have wide, heavy fire-rated doors. The combination of weight, fire rating, and ADA force limit creates the market for full-energy swing operators in healthcare — it cannot be solved without powered operation.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["healthcare", "hospitality", "retail"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "Wind/stack pressure compensation — required for high-rise and airport applications",
      "24V DC motor — quieter and more controllable than AC motors",
      "Full-energy A156.10 certified — meets high-traffic hospital corridor requirements",
      "NOA-certified exterior configurations available",
    ],
    competitiveThreats: ["dk-ed250", "dk-ed-ohc", "st-magic-force", "st-m-force"],
    knownLimitations: [
      "Surface mount is visible — less aesthetic than OHC or in-ground options",
      "Requires header space above door — may not fit all retrofit openings",
      "Premium over SW100 low-energy — specify correctly to avoid cost escalation",
    ],
  },

  {
    id: "aa-sw200i-ig",
    brand: "assa_abloy",
    name: "SW200i In-Ground",
    fullName: "ASSA ABLOY SW200i-IG In-Ground Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["glass facades", "high-end lobbies"],
    description:
      "In-ground (concealed under-floor) full-energy swing door operator. The most architecturally invisible swing solution available. All hardware is below the floor surface — only the door is visible. A156.10 certified. Primary for high-end glass facade lobbies, corporate headquarters, and hospitality.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10 full-energy. All force, sensor, and timing requirements apply. In-ground mounting does not exempt from standard compliance.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Floor-level motion sensor or integrated push-plate",
        standard: "A156.10 §8.1",
        notes: "Activation sensor must be carefully positioned given under-floor operator placement.",
      },
      {
        category: "presence",
        type: "Overhead presence sensor",
        standard: "A156.10 §8.2",
        notes: "Overhead sensor positioned on glazing or soffit — no door-header mounting possible.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Required electronic check before each cycle.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "In-ground operators are primarily used in exterior glass facades. Verify NOA requirement for HVHZ applications — door leaf must meet HVHZ requirements independently of operator.",
    },
    keySpecs: {
      "Installation": "Concealed under-floor — all hardware below finish floor",
      "Door weight capacity": "Full-energy — heavy glass panels supported",
      "Aesthetics": "Maximum — zero visible hardware above floor",
      "Primary markets": "Corporate lobbies, 5-star hotels, luxury retail, glass curtain-wall entrances",
    },
    pmAngles: [
      {
        topic: "In-ground operator as an architect-pull product",
        insight:
          "In-ground operators are specified by architects, not building owners or contractors. They win bids by making it onto the spec sheet — the path to purchase is entirely through architect relationships and design community presence. Classic push-vs-pull product channel insight.",
        useIn: "strategy",
      },
      {
        topic: "Installation complexity as a service moat",
        insight:
          "Under-floor operator installation requires coordination with structural and MEP trades before the slab is poured. Mistakes are costly to correct. Brands that provide excellent pre-construction support (templates, coordination docs, early BIM coordination) win loyal installer relationships.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["hospitality", "retail", "government"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Only fully concealed option — zero visible hardware above floor",
      "Maximum architectural flexibility for glass facade design",
      "Full-energy A156.10 performance in invisible package",
    ],
    competitiveThreats: ["dk-ed-ig"],
    knownLimitations: [
      "Must be coordinated before slab pour — no retrofit option without major disruption",
      "Maintenance access requires floor access — more complex service than surface mount",
      "Ultra-premium pricing — very small addressable market",
      "Not suitable for HVHZ exterior use without separate door leaf NOA",
    ],
  },

  {
    id: "aa-sw200-ohc",
    brand: "assa_abloy",
    name: "SW200 OHC",
    fullName: "ASSA ABLOY SW200 Overhead-Concealed Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["premium commercial", "healthcare"],
    description:
      "Overhead-concealed full-energy swing door operator. All hardware is concealed inside the door header — only a thin reveal is visible. More discreet than surface mount without the slab-coordination complexity of in-ground. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "Full-energy A156.10-2024. Concealed mounting does not affect certification requirements.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push-plate, wave sensor, or overhead motion",
        standard: "A156.10 §8.1",
        notes: "Activation hardware must be surface-mounted externally since operator is concealed in header.",
      },
      {
        category: "presence",
        type: "Overhead presence sensor — concealed or surface",
        standard: "A156.10 §8.2",
        notes: "Presence sensor may be integrated into concealed header unit or surface-mounted nearby.",
      },
      {
        category: "safety",
        type: "Electronic sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Required pre-cycle check. Fault response: hold or safe slow-close.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify NOA for exterior HVHZ swing door applications. Door leaf must be separately NOA-certified; operator mounting method does not impact leaf certification.",
    },
    keySpecs: {
      "Mounting": "Overhead concealed — hardware inside door header",
      "Visibility": "Minimal — narrow reveal only",
      "Full-energy capacity": "A156.10 full-energy certified",
      "Primary markets": "Premium commercial lobbies, upscale healthcare, high-end hospitality",
    },
    pmAngles: [
      {
        topic: "OHC as a mid-premium tier between surface and in-ground",
        insight:
          "OHC operators serve premium projects that want discreet hardware but cannot coordinate in-ground installation. They're the 'good-better-best' middle option in the swing operator spectrum. PM framing: understanding price-tier product ladders and when customers trade up.",
        useIn: "both",
      },
    ],
    marketVerticals: ["healthcare", "hospitality", "government"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "Concealed header installation — more discreet than surface mount",
      "No slab coordination needed vs. in-ground",
      "Full-energy A156.10 performance in discreet package",
    ],
    competitiveThreats: ["dk-ed-ohc", "st-magic-force"],
    knownLimitations: [
      "Requires sufficient header depth — retrofit constraints in existing buildings",
      "More complex installation than surface mount",
      "Service access requires opening header — more involved than surface mount maintenance",
    ],
  },

  {
    id: "aa-sw300",
    brand: "assa_abloy",
    name: "SW300",
    fullName: "ASSA ABLOY SW300 Full-Energy Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["all commercial applications"],
    description:
      "Slim, compact full-energy (and low-energy variant) swing door operator. 6.5 in. deep × 2.75 in. high housing with 24V, 1/4 HP motor. Handles doors up to 621 lb and 48 in. wide. A156.10 (full) and A156.19 (low-energy variant). Wind/stack/torque control. BAU 2025 debut of SW300-S with app-based configuration.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "Full-energy variant certified to A156.10-2024. All force, sensor, and signage requirements met.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3", "Wind/stack/torque compensation"],
      },
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "Low-energy variant certified to A156.19-2019. AUTOMATIC CAUTION DOOR signage required.",
        keyRequirements: ["AUTOMATIC CAUTION DOOR sign", "Max 15 lbf from latched"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push-plate, wave sensor, or motion (configurable)",
        standard: "A156.10 §8.1",
        notes: "App-configurable activation modes on SW300-S variant. Simplifies commissioning.",
      },
      {
        category: "presence",
        type: "Overhead presence sensor",
        standard: "A156.10 §8.2",
        notes: "Standard presence coverage for full swing arc.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + wind/stack compensation",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle fault check plus dynamic torque adjustment for stack pressure.",
      },
    ],
    floridaApproval: {
      status: "noa-certified",
      testStandards: ["TAS 201", "TAS 202", "TAS 203"],
      hvhz: true,
      notes: "Exterior-rated SW300 configurations carry NOA for HVHZ. Verify current NOA number. Interior applications do not require NOA.",
    },
    keySpecs: {
      "Housing dimensions": "6.5 in. deep × 2.75 in. high — compact profile",
      "Motor": "24V DC, 1/4 HP",
      "Max door weight": "621 lb",
      "Max door width": "48 in.",
      "Wind/stack/torque control": "Included — dynamic adjustment",
      "SW300-S": "App-configurable via smartphone (BAU 2025 debut)",
    },
    pmAngles: [
      {
        topic: "App-based configuration as platform play",
        insight:
          "The SW300-S app-based configuration (BAU 2025 debut) is an early signal of ASSA ABLOY's IoT/connected-building strategy. App configuration reduces commissioning time and enables remote adjustment — a capability that builds toward predictive maintenance and connected-building data plays.",
        useIn: "strategy",
      },
      {
        topic: "Compact housing as spec win in retrofit",
        insight:
          "At 2.75 in. high, the SW300 housing fits in very tight header spaces where competitors with larger operators cannot physically install. This is a technical moat in retrofit applications where header depth is constrained.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "healthcare", "hospitality", "education"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "2.75 in. housing height — fits the tightest retrofit headers",
      "App configuration (SW300-S) enables remote commissioning and adjustment",
      "Dual-certified: A156.10 full-energy and A156.19 low-energy in one platform",
      "621 lb door capacity covers virtually all commercial wood and glass swing doors",
    ],
    competitiveThreats: ["dk-ed250", "dk-ed-ohc", "st-magic-force", "st-m-force"],
    knownLimitations: [
      "New app-based features (SW300-S) require iOS/Android device for commissioning",
      "Not positioned for extremely heavy blast/lead-lined door applications (use M-Force equivalent)",
    ],
  },

  {
    id: "aa-sw60",
    brand: "assa_abloy",
    name: "SW60",
    fullName: "ASSA ABLOY SW60 Low-Energy Swing Door Operator",
    motion: "swing",
    energyClass: "low-energy",
    primaryApplication: ["ADA compliance", "light traffic"],
    description:
      "Low-energy swing operator. Safe, reliable, and code-compliant for ADA accessible entrances with light to moderate traffic. A156.19 certified.",
    standardCerts: [
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "A156.19-2019 low-energy certified. AUTOMATIC CAUTION DOOR sign required.",
        keyRequirements: ["AUTOMATIC CAUTION DOOR signage", "Max 15 lbf", "Max 5 lbf in-motion"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push-plate primary",
        standard: "A156.19",
        notes: "User-actuated for ADA compliance.",
      },
      {
        category: "safety",
        type: "Slow-open speed force limitation",
        standard: "A156.19",
        notes: "Slow opening speed limits contact forces instead of kinetic reversal.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior/non-HVHZ. For exterior HVHZ, use full-energy SW200i with NOA.",
    },
    keySpecs: {
      "Opening force": "Max 15 lbf from latched",
      "In-motion force": "Max 5 lbf",
      "Certification": "A156.19 low-energy",
      "Use case": "ADA accessible entrances, interior vestibule",
    },
    pmAngles: [
      {
        topic: "Low-energy vs. full-energy ADA compliance strategy",
        insight:
          "Many ADA accessible entrances only require A156.19 low-energy compliance — specifying full-energy A156.10 is often over-engineering and cost-inefficient. Understanding when each standard applies is a key PM/spec knowledge point.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "healthcare", "education"],
    priceRange: "economy",
    installedBase: "moderate",
    keyDifferentiators: [
      "Economy price point — lowest cost ASSA ABLOY swing operator",
      "A156.19 compliant for ADA path of travel",
    ],
    competitiveThreats: ["dk-ed50", "st-magic-access", "horton-4000"],
    knownLimitations: [
      "Not appropriate for high-traffic applications",
      "Requires AUTOMATIC CAUTION DOOR signage",
      "User-actuated only — no hands-free operation",
    ],
  },

  {
    id: "aa-versaMax",
    brand: "assa_abloy",
    name: "VersaMax 2.0",
    fullName: "ASSA ABLOY VersaMax 2.0 Healthcare Sliding Door System",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["ICU", "ORs", "patient corridors"],
    description:
      "FGI-compliant healthcare sliding door system. Delivers 44.5 in. clear opening on an 8 ft frame — engineered specifically for FGI Guidelines for healthcare facility design. Required clear opening width for ICU, OR, and patient transport corridors. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified. Meets all force, sensor, and signage requirements for healthcare corridor applications.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3", "Healthcare-specific breakout"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Hands-free wave sensor or foot sensor",
        standard: "A156.10 §8.1",
        notes: "Hands-free activation critical in healthcare for infection control. No-touch wave or foot-pedal activation standard.",
      },
      {
        category: "presence",
        type: "Overhead IR presence — covers patient transport width",
        standard: "A156.10 §8.2",
        notes: "Wide-zone presence coverage for stretchers and equipment carts passing through.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + breakout emergency egress",
        standard: "A156.10 §8.3",
        notes: "Breakout emergency egress must function independently of power. Critical for code compliance in occupied healthcare facilities.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior healthcare application. NOA not typically required for interior ICU/OR sliding doors.",
    },
    keySpecs: {
      "Clear opening width": "44.5 in. on 8 ft frame (FGI-compliant)",
      "FGI compliance": "Meets FGI Guidelines for healthcare facility design",
      "Breakout": "Emergency breakout for egress",
      "Activation": "Hands-free / no-touch",
      "Primary markets": "ICU, ORs, patient transport corridors, ED corridors",
    },
    pmAngles: [
      {
        topic: "FGI Guidelines as a demand-creation mechanism",
        insight:
          "FGI Guidelines specify minimum clear opening widths for healthcare spaces (44.5 in. for ICU/OR transport). This creates a product requirement that only dedicated healthcare door systems meet — generic commercial sliders cannot comply. FGI compliance is a market access requirement, not a differentiator.",
        useIn: "strategy",
      },
      {
        topic: "Infection control as a feature driver in healthcare",
        insight:
          "Hands-free activation in healthcare is driven by infection control policy, not convenience. The no-touch requirement shapes product design (foot pedals, wave sensors, auto-open on approach). PM lesson: policy-driven product requirements can be more durable than preference-driven ones.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare"],
    priceRange: "premium",
    installedBase: "strong",
    keyDifferentiators: [
      "44.5 in. COW on 8 ft frame — purpose-built to FGI Guideline dimensions",
      "Hands-free activation standard — infection control compliant",
      "Emergency breakout egress meets healthcare life-safety requirements",
      "Only ASSA ABLOY product specifically branded for FGI compliance",
    ],
    competitiveThreats: ["st-procare-8300", "st-procare-8300bp", "st-dura-care-7500", "horton-icu-2000"],
    knownLimitations: [
      "Interior application only — no HVHZ NOA",
      "Limited to healthcare vertical — premium pricing not justified for commercial applications",
      "Requires FGI-familiar specifier — sales complexity higher than standard commercial",
    ],
  },

  {
    id: "aa-rd3-rd4",
    brand: "assa_abloy",
    name: "RD3/RD4 Compact Revolving",
    fullName: "ASSA ABLOY RD3/RD4 Compact Revolving Door",
    motion: "revolving",
    energyClass: "power-assist",
    primaryApplication: ["hotels", "office", "retail"],
    description:
      "3- and 4-wing compact revolving door. Integrates into standard building entrances. Energy efficient — prevents air exchange between interior and exterior. Manual, power-assist, and automatic operation variants.",
    standardCerts: [
      {
        standard: "A156.27",
        edition: "2019",
        status: "certified",
        notes: "Revolving doors are governed by ANSI/BHMA A156.27-2019 (Revolving Doors) — NOT A156.10, which applies to sliding, swinging, and folding power-operated doors only. A156.27 sets max speed 4 RPM, breakout force ≤ 130 lbf, collapsed egress width ≥ 36 in., slow-speed ADA mode, and occupant detection requirements.",
        keyRequirements: ["Max 4 RPM rotation speed", "Breakout ≤ 130 lbf per wing", "Collapsed egress ≥ 36 in.", "Slow-speed ADA mode ≤ 2 RPM", "Occupant detection sensor"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Speed regulation sensor — automatic variant",
        standard: "A156.27-2019 §4",
        notes: "Automatic variant uses sensor to control rotation speed and detect occupants. Governed by A156.27, not A156.10.",
      },
      {
        category: "safety",
        type: "Emergency collapse / panic egress function",
        standard: "A156.27-2019 §5",
        notes: "Revolving door must collapse flat under emergency egress load per A156.27 §5, providing ≥ 36 in. aggregate clear egress width. Applied force ≤ 130 lbf on any one wing.",
      },
      {
        category: "obstruction",
        type: "Torque-limited drive — occupant safety",
        standard: "A156.27-2019 §4.3",
        notes: "Drive mechanism limits rotation torque per A156.27 §4.3 to prevent injury if occupant is caught. Not governed by A156.10 force limits.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Revolving doors in HVHZ exterior applications require specific testing. Verify product-specific certification for any Florida HVHZ installation.",
    },
    keySpecs: {
      "Wings": "3 or 4",
      "Type": "Compact — fits standard entrance dimension",
      "Operation": "Manual, power-assist, or automatic",
      "Energy benefit": "Eliminates air exchange — LEED credit potential",
      "Primary markets": "Hotels, office lobbies, retail",
    },
    pmAngles: [
      {
        topic: "Revolving doors as energy-efficiency LEED lever",
        insight:
          "A revolving door eliminates the open-air exchange of a swing or sliding door — no weather stripping gap, always sealed. This translates to measurable HVAC savings, which contributes to LEED energy credits. Revolving door ROI analysis is a key owner-conversation tool.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["hospitality", "retail", "government"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "Zero air exchange — highest thermal efficiency of any door type",
      "Emergency collapse function for code compliance",
      "3- and 4-wing options for different traffic and aesthetic requirements",
    ],
    competitiveThreats: ["dk-ktv3-ktv4", "dk-ktv-atrium"],
    knownLimitations: [
      "Cannot be primary ADA accessible entrance — must be paired with accessible swing/sliding",
      "Throughput limited by rotation speed — high-volume applications need large-diameter models",
      "Higher maintenance complexity than sliding or swing",
    ],
  },

  {
    id: "aa-rd600",
    brand: "assa_abloy",
    name: "RD600 UniTurn",
    fullName: "ASSA ABLOY RD600 UniTurn 2-Wing Revolving Door",
    motion: "revolving",
    energyClass: "power-assist",
    primaryApplication: ["airports", "high-rise lobbies"],
    description:
      "High-capacity 2-wing revolving door with superior energy efficiency. Larger diameter accommodates groups and luggage. Suitable for airports and high-rise lobbies where throughput and energy performance are co-priorities.",
    standardCerts: [
      {
        standard: "A156.27",
        edition: "2019",
        status: "certified",
        notes: "Revolving doors are governed by ANSI/BHMA A156.27-2019 (Revolving Doors) — NOT A156.10. A156.27 requirements: max 4 RPM; breakout ≤ 130 lbf per wing; collapsed egress ≥ 36 in.; slow-speed ADA mode; occupant detection.",
        keyRequirements: ["Max 4 RPM rotation speed", "Breakout ≤ 130 lbf per wing", "Collapsed egress ≥ 36 in.", "Slow-speed ADA mode ≤ 2 RPM", "Occupant detection sensor"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Automatic rotation control with occupant sensor",
        standard: "A156.27-2019 §4",
        notes: "2-wing configuration allows group entry; speed control governed by A156.27 §4 (≤ 4 RPM). Not governed by A156.10.",
      },
      {
        category: "safety",
        type: "Emergency collapse — straight-through egress",
        standard: "A156.27-2019 §5",
        notes: "2-wing collapse provides wide straight-through egress path per A156.27 §5. Applied force ≤ 130 lbf.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify HVHZ certification for exterior revolving door applications in Florida.",
    },
    keySpecs: {
      "Wings": "2",
      "Advantage": "Higher per-rotation capacity — accommodates groups and luggage",
      "Energy": "Superior thermal efficiency vs. multi-wing",
      "Primary markets": "Airports, high-rise office towers, convention centers",
    },
    pmAngles: [
      {
        topic: "2-wing vs. 4-wing revolving — capacity trade-off",
        insight:
          "2-wing revolving doors allow larger group entry per rotation (no dividing center wings) but require precise speed control to prevent entrapment. 4-wing models are safer for mixed-age traffic (children, elderly) because smaller compartments limit fall risk. This is a good example of design trade-offs driven by user safety profiles.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["airport", "hospitality"],
    priceRange: "premium",
    installedBase: "niche",
    keyDifferentiators: [
      "2-wing design enables group entry and luggage clearance",
      "Higher throughput per rotation than 3- or 4-wing",
      "Superior energy efficiency — largest sealed compartment",
    ],
    competitiveThreats: ["dk-ktc2"],
    knownLimitations: [
      "Most complex speed control — requires careful commissioning",
      "Not appropriate for healthcare (no-air-exchange plus infection control conflicts)",
      "Large diameter requires significant entrance lobby footprint",
    ],
  },

  {
    id: "aa-rd700",
    brand: "assa_abloy",
    name: "RD700 High Capacity",
    fullName: "ASSA ABLOY RD700 High-Capacity Revolving Door",
    motion: "revolving",
    energyClass: "power-assist",
    primaryApplication: ["airports", "transit hubs"],
    description:
      "Large 3-wing revolving door engineered for maximum pedestrian throughput in busy transportation entrances. Extra-large diameter accommodates peak-hour airport and transit terminal flows. Formerly marketed as RD3L for high-capacity applications.",
    standardCerts: [
      {
        standard: "A156.27",
        edition: "2019",
        status: "certified",
        notes: "Revolving doors are governed by ANSI/BHMA A156.27-2019 (Revolving Doors) — NOT A156.10. A156.27 governs speed limits (≤ 4 RPM), occupant detection, emergency collapse (≤ 130 lbf per wing, ≥ 36 in. aggregate egress), and slow-speed ADA mode.",
        keyRequirements: ["Max 4 RPM rotation speed", "Breakout ≤ 130 lbf per wing", "Collapsed egress ≥ 36 in.", "Slow-speed ADA mode"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Speed-adaptive rotation control",
        standard: "A156.27-2019 §4",
        notes: "Speed adapts to pedestrian flow rate — faster during peak, slower during off-peak. Governed by A156.27 §4 (≤ 4 RPM max), not A156.10.",
      },
      {
        category: "safety",
        type: "Emergency stop and collapse",
        standard: "A156.27-2019 §5",
        notes: "Emergency stop and wing collapse provides ADA egress path per A156.27 §5. Collapse force ≤ 130 lbf; egress width ≥ 36 in. aggregate.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Large-diameter exterior revolving in HVHZ requires specific certification. Verify.",
    },
    keySpecs: {
      "Wings": "3",
      "Diameter": "Large — extra-wide for peak airport/transit throughput",
      "Traffic": "Highest capacity revolving door in portfolio",
      "Primary markets": "International airports, major transit hubs",
    },
    pmAngles: [
      {
        topic: "Airport entrance as a brand showcase",
        insight:
          "Airport main entrances are among the most visible door installations — seen by millions annually. Winning an airport specification is brand marketing as much as product sales. ASSA ABLOY and dormakaba both aggressively pursue airport reference sites.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["airport"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Largest throughput in ASSA ABLOY revolving line",
      "Speed-adaptive rotation control for peak/off-peak flows",
    ],
    competitiveThreats: ["dk-ktc3-ktc4"],
    knownLimitations: [
      "Extremely large footprint — only appropriate for purpose-built entrance halls",
      "Ultra-premium pricing limits to large public infrastructure projects",
      "ADA accessible bypass required",
    ],
  },

  {
    id: "aa-rd300-ag",
    brand: "assa_abloy",
    name: "RD300 All-Glass",
    fullName: "ASSA ABLOY RD300 All-Glass Revolving Door",
    motion: "revolving",
    energyClass: "power-assist",
    primaryApplication: ["premium commercial", "hotels"],
    description:
      "All-glass 3- and 4-wing revolving door. Frameless glass construction for maximum visual openness. Aesthetics-forward product for luxury hotel lobbies, premium corporate headquarters, and high-end retail. Also referred to as RD3-300 for all-glass 3-wing configurations.",
    standardCerts: [
      {
        standard: "A156.27",
        edition: "2019",
        status: "certified",
        notes: "Revolving doors are governed by ANSI/BHMA A156.27-2019 (Revolving Doors) — NOT A156.10. A156.27 governs speed limits (≤ 4 RPM), occupant detection, wing collapse (≤ 130 lbf, ≥ 36 in. egress), and slow-speed ADA mode. Glass construction per A156.27 §4.1 (laminated safety glass required).",
        keyRequirements: ["Max 4 RPM rotation speed", "Laminated safety glass per §4.1", "Breakout ≤ 130 lbf per wing", "Collapsed egress ≥ 36 in.", "Slow-speed ADA mode"],
      },
    ],
    sensorSpecs: [
      {
        category: "safety",
        type: "Glass edge safety detection + torque limit",
        standard: "A156.27-2019 §4.3 / §7",
        notes: "All-glass wings require careful edge detection per A156.27 §7. Glass edges governed by A156.27 §4.1 (laminated safety glass). Torque limited per §4.3 to prevent injury. Not governed by A156.10.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "All-glass revolving in HVHZ exterior applications requires hurricane-rated glass verification in addition to structural/operational certification.",
    },
    keySpecs: {
      "Wings": "3 or 4",
      "Construction": "Frameless all-glass — maximum visual transparency",
      "Primary markets": "5-star hotels, luxury corporate HQ, premium retail flagship",
    },
    pmAngles: [
      {
        topic: "All-glass revolving door as brand positioning signal",
        insight:
          "An all-glass revolving door in a lobby signals luxury — it is a brand communication as much as a door. Property owners specify it because it impresses guests and elevates brand perception. PM lesson: some products are purchased for their signal value, not just their functional performance.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["hospitality", "retail"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Maximum visual openness — frameless all-glass construction",
      "Architect-preferred aesthetic for luxury lobby design",
    ],
    competitiveThreats: ["dk-ktv-atrium"],
    knownLimitations: [
      "Hurricane-rated glass required for HVHZ exterior",
      "Highest maintenance complexity — glass panels require careful cleaning and inspection",
      "Ultra-premium pricing; very small addressable market",
    ],
  },

  {
    id: "aa-rd3a-rd4a1",
    brand: "assa_abloy",
    name: "RD3A/RD4A1 Access Control Revolving",
    fullName: "ASSA ABLOY RD3A/RD4A1 Access Control Revolving Door",
    motion: "revolving",
    energyClass: "full-energy",
    primaryApplication: ["corporate", "government", "secure facilities"],
    description:
      "Revolving door with integrated access control. Card reader, biometric, or PIN access integrated into revolving door structure. One-person-at-a-time anti-tailgating enforcement. Primary for corporate headquarters, government buildings, and secure-access facilities.",
    standardCerts: [
      {
        standard: "A156.27",
        edition: "2019",
        status: "certified",
        notes: "Revolving doors are governed by ANSI/BHMA A156.27-2019 (Revolving Doors) — NOT A156.10. A156.27 governs speed limits (≤ 4 RPM), occupant detection, emergency collapse (≤ 130 lbf per wing), and slow-speed ADA mode. Access control integration does not change the governing operational standard — still A156.27.",
        keyRequirements: ["Max 4 RPM rotation speed", "Breakout ≤ 130 lbf per wing", "Collapsed egress ≥ 36 in.", "Anti-tailgating occupancy sensor"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Access control reader — card/biometric/PIN",
        standard: "A156.27-2019 §4 / A156.10 §accessibility (access control integration per UL 294)",
        notes: "Rotation authorized upon valid credential. Door remains locked in standby. Access control system units must be UL 294 listed. Governed by A156.27 for revolving door operational requirements.",
      },
      {
        category: "safety",
        type: "Occupancy sensor — anti-tailgating",
        standard: "A156.27-2019 §7",
        notes: "Detects more than one person in compartment and stops rotation per A156.27 §7 occupant detection requirements — core anti-tailgating function. Not governed by A156.10.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify for exterior HVHZ. Typically used at interior lobby access control points rather than building perimeter.",
    },
    keySpecs: {
      "Access control": "Card, biometric, PIN, or mobile credential",
      "Anti-tailgating": "Dual-occupancy detection stops door",
      "ASSA ABLOY integration": "Native integration with ASSA ABLOY access control ecosystem",
      "Primary markets": "Corporate HQ, federal buildings, data centers, pharma facilities",
    },
    pmAngles: [
      {
        topic: "Access control integration as an ecosystem lock-in play",
        insight:
          "The RD3A/RD4A1 integrates natively with ASSA ABLOY's access control platform. Once a facility standardizes on ASSA ABLOY access control + revolving doors, switching costs are very high (credential migration, software integration, facility reconfiguration). Classic ecosystem lock-in.",
        useIn: "strategy",
      },
      {
        topic: "Anti-tailgating as security-critical UX",
        insight:
          "Anti-tailgating revolving doors must balance security (one person per cycle) with throughput (no false stops) and user experience (not trapping or stressing users). Getting the occupancy sensor calibration right is a product quality challenge with direct safety and security implications.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["government", "healthcare"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Native ASSA ABLOY access control ecosystem integration",
      "Anti-tailgating enforcement — one-person-per-cycle enforcement",
      "Government/secure-facility spec alignment",
    ],
    competitiveThreats: [],
    knownLimitations: [
      "Very slow throughput vs. open revolving door — not suitable for high-volume lobby",
      "Requires integration with access control infrastructure",
      "ADA accessible bypass required alongside",
    ],
  },

  {
    id: "aa-ecoLOGIC",
    brand: "assa_abloy",
    name: "ecoLOGIC",
    fullName: "ASSA ABLOY ecoLOGIC AI Energy Management Module",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["IoT/connected building", "energy management"],
    description:
      "AI-driven energy management module for ASSA ABLOY automatic door systems. Analyzes traffic patterns, HVAC state, and ambient conditions to optimize door operation — hold-open times, speed, and sensor sensitivity — reducing energy usage and cost. Integrates with SL/SW operators. New in 2025.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "partial",
        notes: "ecoLOGIC is a management overlay on A156.10-certified hardware. Core door operation remains A156.10 certified; ecoLOGIC optimization must not reduce safety compliance below standard requirements.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "AI-optimized activation threshold adjustment",
        standard: "A156.10 §8.1",
        notes: "AI adjusts sensor sensitivity based on traffic patterns — reduces false activations during off-peak.",
      },
      {
        category: "presence",
        type: "AI presence dwell time optimization",
        standard: "A156.10 §8.2",
        notes: "Reduces unnecessary hold-open time after pedestrian clears zone — HVAC energy savings.",
      },
    ],
    floridaApproval: {
      status: "not-certified",
      hvhz: false,
      notes: "ecoLOGIC is a software/module overlay — NOA is not applicable. Underlying SL/SW hardware must retain its own NOA for HVHZ applications.",
    },
    keySpecs: {
      "Type": "AI energy management module — software + hardware add-on",
      "Integration": "ASSA ABLOY SL/SW automatic door operators",
      "Functions": "Traffic pattern analysis, hold-open optimization, speed adjustment, connected-building API",
      "Launch": "2025",
      "Energy savings": "Measurable HVAC load reduction via reduced unintended air exchange",
    },
    pmAngles: [
      {
        topic: "ecoLOGIC as ASSA ABLOY's IoT/connected-building platform signal",
        insight:
          "ecoLOGIC is the first explicit move by ASSA ABLOY Entrance Systems into the IoT/connected-building data layer. It is strategically important beyond energy savings — it creates a data relationship with the building owner that competitors without AI modules cannot match.",
        useIn: "strategy",
      },
      {
        topic: "AI optimization within hard safety constraints",
        insight:
          "ecoLOGIC must optimize energy while never violating A156.10 safety thresholds. The AI operates within a constrained envelope — it can reduce hold-open time but never below the presence-sensor requirement. PM framing: AI products in safety-critical domains must reason about hard vs. soft constraints.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "healthcare", "hospitality", "airport"],
    priceRange: "mid",
    installedBase: "niche",
    keyDifferentiators: [
      "First AI energy optimization module from a major automatic door OEM",
      "Integrates with existing SL/SW install base — retrofit-friendly",
      "Creates connected-building data layer on top of existing door hardware",
      "Measurable energy ROI — LEED/sustainability reporting compatible",
    ],
    competitiveThreats: [],
    knownLimitations: [
      "2025 launch — limited real-world deployment data and track record",
      "Requires compatible ASSA ABLOY SL/SW hardware — not multi-brand",
      "AI optimization value depends on traffic variability — low-traffic sites see less benefit",
      "Privacy considerations: traffic pattern data collection may require disclosure in some jurisdictions",
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // ASSA ABLOY — NEW 2025/2026 ADDITIONS
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: "sl500_r104",
    brand: "assa_abloy",
    name: "SL500 Resilience R104",
    fullName: "ASSA ABLOY SL500 Resilience R104 Hurricane/Security Variant",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["healthcare", "retail", "airport", "government", "education", "commercial"],
    description:
      "Hurricane-resistant automatic bi-parting sliding door system. Miami-Dade NOA approved. Tested to ASTM E1886/E1996 wind-borne debris impact standard. Grade 25 forced entry resistance per ASTM F842-17. Designed specifically for High-Velocity Hurricane Zone (HVHZ) applications.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2023",
        status: "certified",
        notes: "A156.10-2023 certified. Full force, sensor, and signage compliance. Hurricane-resistant framing does not affect ANSI certification.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Sensor fault monitoring §8.3",
          "Presence sensor 8 in. inactive zone",
          "50 in. AFF signage",
        ],
      },
      {
        standard: "A156.38",
        edition: "2019",
        status: "verify",
        notes: "Verify A156.38 low-energy configuration applicability for this variant.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave presence sensor",
        standard: "A156.10 §8.1",
        notes: "Microwave + IR presence sensors standard. Adjustable for HVHZ lobby configurations.",
      },
      {
        category: "presence",
        type: "IR safety sensor",
        standard: "A156.10 §8.2",
        notes: "IR safety sensor holds door open while occupant detected. Required for power-operated configuration.",
      },
      {
        category: "safety",
        type: "Electronic pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each closing cycle. Fault triggers safe-state hold-open.",
      },
      {
        category: "obstruction",
        type: "Access control integration — relay output",
        notes: "Access control integration available for secure HVHZ lobby configurations.",
        optional: true,
      },
    ],
    floridaApproval: {
      status: "noa-certified",
      noaNumber: "NOA 25-0311.04 through 25-0311.10 (issued March 2025, expires 2030-2031)",
      testStandards: ["ASTM E1886", "ASTM E1996", "ASTM F842-17", "FBC 8th Ed."],
      designPressure: "Per ASTM E1996 impact performance standard — verify product NOA for project-specific DP",
      hvhz: true,
      fbc9thNotes:
        "FBC 9th Edition takes effect Dec 31, 2026. Permits issued on/after that date must reference 9th Edition cycle approvals.",
      notes:
        "Current NOAs 25-0311.04 to .10 issued March 2025, expire 2030-2031. FBC 9th Edition transition Dec 31, 2026 — update product approvals for permits on/after that date. No 62-day expiry — NOAs are valid through 2030-2031. ASTM E1886 large/small missile impact certified. Grade 25 forced entry per ASTM F842-17. Primary HVHZ sliding door choice for secure government, healthcare, and airport applications.",
    },
    keySpecs: {
      "Max opening width": "16' bi-part",
      "Wind pressure rating": "Rated per ASTM E1996",
      "Impact rating": "ASTM E1886 large/small missile",
      "Forced entry grade": "Grade 25 (ASTM F842-17)",
      "Activation": "Microwave + IR presence sensors",
      "Energy management": "ecoLOGIC energy management compatible",
      "Header finish": "Brushed stainless header available",
    },
    pmAngles: [
      {
        topic: "HVHZ + forced entry as a dual-gate spec",
        insight:
          "The R104 bundles NOA/HVHZ certification with Grade 25 forced-entry resistance — two separate compliance gates in one product. This is rare in the automatic door market. PM angle: when a single product satisfies two independent regulatory requirements, the combined value proposition is significantly greater than the sum of its parts. Government and healthcare procurement teams value this consolidation.",
        useIn: "strategy",
      },
      {
        topic: "Forced entry grading as a competitive moat",
        insight:
          "ASTM F842-17 Grade 25 forced entry resistance is a specification few competitors can match on an automatic sliding door. When a spec sheet references this grade explicitly, ASSA ABLOY has an effective sole-source position. PM interview angle: identify regulatory requirements that create narrow markets where incumbents hold structural advantages.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "healthcare", "airport", "government", "education"],
    priceRange: "premium",
    installedBase: "niche",
    keyDifferentiators: [
      "HVHZ rated — ASTM E1886/E1996 certified for wind-borne debris impact",
      "Grade 25 forced entry resistance (ASTM F842-17) — rare in automatic sliding doors",
      "Miami-Dade NOA product approval — binary market-access requirement for FL HVHZ exterior",
      "Up to 16' bi-part opening width",
      "ecoLOGIC energy management compatible",
    ],
    competitiveThreats: ["st-dura-storm"],
    knownLimitations: [
      "Premium price premium over standard SL500 — GC value-engineering exposure",
      "NOA re-certification required when FBC 9th Ed. 160 mph mandate takes effect Dec 2026",
      "HVHZ-specific configurations limit supply chain flexibility",
    ],
    flKeyNote: "NOA certified for HVHZ. ASTM E1886/E1996 impact tested. Grade 25 forced entry rated. Verify NOA number and DP rating for project-specific requirements before FBC 9th Ed. transition.",
    sensorCompatibility: ["Microwave presence", "IR safety sensor", "Access control integration"],
  },

  {
    id: "sl500_r92",
    brand: "assa_abloy",
    name: "SL500 R92 Windload",
    fullName: "ASSA ABLOY SL500 R92 Windload Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["healthcare", "retail", "airport", "commercial"],
    description:
      "High-windload automatic sliding door with 55 PSF wind pressure rating in closed-and-locked position. Up to 96-inch single slide configuration. For coastal and high-wind applications not requiring full HVHZ certification.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2023",
        status: "certified",
        notes: "A156.10-2023 certified. Standard force, sensor, and signage requirements met. High-windload framing validated to FBC 8th Ed.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Sensor fault monitoring §8.3",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor — overhead mount",
        standard: "A156.10 §8.1",
        notes: "Standard overhead microwave activation. Adjustable range for single-slide configuration.",
      },
      {
        category: "presence",
        type: "Overhead IR presence sensor",
        standard: "A156.10 §8.2",
        notes: "Standard presence hold-open. Coastal-rated housing available.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each closing cycle.",
      },
    ],
    floridaApproval: {
      status: "hvhz-listed",
      testStandards: ["FBC 8th Ed."],
      designPressure: "55 PSF (closed/locked position)",
      hvhz: false,
      notes:
        "55 PSF wind pressure rating in closed-and-locked position. FBC 8th Ed. compliant for high-wind zones. NOT a full HVHZ Miami-Dade NOA product — for coastal and high-wind applications below HVHZ threshold. Verify requirements with AHJ for specific project zones.",
    },
    keySpecs: {
      "Wind pressure rating": "55 PSF (closed/locked position)",
      "Max single slide": "Up to 96 inches",
      "Application zone": "Coastal / high-wind, non-HVHZ",
      "Energy management": "Compatible with ecoLOGIC energy management",
      "Header finish": "Available in stainless finish",
    },
    pmAngles: [
      {
        topic: "Coastal market segmentation: HVHZ vs. high-wind",
        insight:
          "Florida and Gulf Coast projects split between full HVHZ (Miami-Dade/Broward) and high-wind coastal zones that don't require NOA. The R92 targets the latter — a larger geographic market that doesn't need the R104's price premium. PM angle: understanding how regulatory thresholds create product segmentation opportunities within a single geography.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["healthcare", "retail", "airport"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "55 PSF wind pressure rating — coastal application optimized",
      "Up to 96-inch single slide for wide openings",
      "Lower cost than R104 for non-HVHZ coastal applications",
      "ecoLOGIC compatible",
    ],
    competitiveThreats: ["st-dura-storm", "aa-sl500"],
    knownLimitations: [
      "Not Miami-Dade NOA certified — cannot be used in HVHZ without upgrade to R104",
      "Limited to closed-and-locked condition for maximum wind pressure rating",
    ],
  },

  {
    id: "sl500_r128",
    brand: "assa_abloy",
    name: "SL500 Resilience R128",
    fullName: "ASSA ABLOY SL500 Resilience R128 Over-Height",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "home center", "garden center", "large-format retail"],
    description:
      "Over-height door package for home centers, garden centers, and large-format retail. Accommodates tall opening heights beyond standard configurations. Combines R-series performance with extended height capability.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified. All standard force, sensor, and signage requirements apply. Over-height configuration validated for tall opening applications.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Sensor coverage for full over-height panel",
          "50 in. AFF signage",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Wide-angle microwave sensor — overhead mount",
        standard: "A156.10 §8.1",
        notes: "Wide-angle coverage for tall, wide-opening retail configurations.",
      },
      {
        category: "presence",
        type: "IR presence sensor",
        standard: "A156.10 §8.2",
        notes: "Standard presence hold-open. Configured for taller detection zone.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each closing cycle.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Over-height variant for interior/protected retail applications. Verify NOA requirements for any exterior HVHZ applications.",
    },
    keySpecs: {
      "Application": "Over-height home center / garden center / large-format retail",
      "Configuration": "Extended height beyond standard SL500 configurations",
      "Certification": "A156.10-2023 certified",
      "Market target": "Home improvement, garden center, big-box retail",
    },
    pmAngles: [
      {
        topic: "Over-height as vertical-market lock-in",
        insight:
          "Home centers and garden centers have non-standard opening heights that standard automatic door operators cannot handle. The R128 targets this architectural gap — a niche where standard competitors fall short. PM angle: product variants that address dimension-specific requirements often face less price competition because alternatives require significant modification.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["retail"],
    priceRange: "mid",
    installedBase: "niche",
    keyDifferentiators: [
      "Over-height configuration for home center and garden center applications",
      "Large-format retail optimized — addresses non-standard tall openings",
      "R-series platform reliability in extended-height package",
    ],
    competitiveThreats: ["st-dura-glide-2000", "horton-2000"],
    knownLimitations: [
      "Niche application — limited to large-format retail with tall openings",
      "No HVHZ NOA certification for exterior use",
    ],
  },

  {
    id: "sw60",
    brand: "assa_abloy",
    name: "SW60 Slim Swing",
    fullName: "ASSA ABLOY SW60 Slim Automatic Swing Door Operator",
    motion: "swing",
    energyClass: "low-energy",
    primaryApplication: ["healthcare", "commercial", "retail", "education", "retrofit"],
    description:
      "Newest slim-profile automatic swing door operator. App-compatible via Bluetooth (SW300-S platform). Designed for quick retrofit installation on existing manual swing doors. Converts manual doors to automatic with minimal header modification.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for power-operated swing door operation. All force, sensor, and signage requirements apply.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Sensor fault monitoring §8.3",
          "Soft-start / soft-stop compliance",
        ],
      },
      {
        standard: "A156.19",
        edition: "2023",
        status: "certified",
        notes: "A156.19 low-energy knowing-act mode certified. AUTOMATIC CAUTION DOOR signage required.",
        keyRequirements: [
          "Max 15 lbf opening force",
          "Max 5 lbf in-motion force",
          "AUTOMATIC CAUTION DOOR sign (6 in. diam., yellow, 50 in. AFF)",
        ],
      },
      {
        standard: "A156.38",
        edition: "2019",
        status: "certified",
        notes: "A156.38 low-energy certified. Supports knowing-act activation mode.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Motion/radar activation sensor",
        standard: "A156.10 §8.1",
        notes: "Motion/radar activation standard. Push-plate knowing-act mode also supported for A156.38 compliance.",
      },
      {
        category: "activation",
        type: "Bluetooth app configuration (SW300-S platform)",
        notes: "Bluetooth app enables remote diagnostics, parameter adjustment, and status monitoring. SW300-S platform compatible.",
        optional: true,
      },
      {
        category: "presence",
        type: "IR safety sensor",
        standard: "A156.10 §8.2",
        notes: "Standard presence detection for hold-open. Soft-start/soft-stop minimizes door-strike risk.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check. Fault = door remains closed (safe default for swing).",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior swing operator — HVHZ NOA typically not required for interior applications. Verify for any exterior swing door applications in FL HVHZ zones.",
    },
    keySpecs: {
      "Profile": "Slim — minimal header depth",
      "App compatibility": "Bluetooth app configuration (SW300-S compatible)",
      "Installation": "Quick retrofit — converts manual to automatic",
      "Energy mode": "Low-energy knowing-act (A156.38)",
      "ADA compliance": "ICC A117.1 compliant",
      "Operation": "Soft-start / soft-stop for smooth operation",
    },
    pmAngles: [
      {
        topic: "Retrofit as a growth market for smart swing operators",
        insight:
          "Millions of manual swing doors in the US installed base can be upgraded to automatic with operators like the SW60. The retrofit market is low-barrier (no major construction required) and recurring. PM angle: the retrofit opportunity is often larger than new-construction demand in mature building categories (offices, healthcare clinics, schools).",
        useIn: "strategy",
      },
      {
        topic: "Bluetooth app configuration as a serviceability differentiator",
        insight:
          "App-based configuration reduces truck rolls for parameter adjustments — a direct AAADM service cost reduction. PM angle: connectivity features that reduce service costs create a value story for building owners and distributors simultaneously, not just end-users.",
        useIn: "both",
      },
    ],
    marketVerticals: ["healthcare", "retail", "education"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "Slim profile — minimal header depth vs. standard swing operators",
      "Bluetooth app configuration — remote diagnostics and setup",
      "Quick retrofit — converts manual to automatic with minimal header modification",
      "A156.38 low-energy knowing-act certified",
      "ADA compliant (ICC A117.1)",
    ],
    competitiveThreats: ["dk-ed50", "dk-ed100", "horton-4000"],
    knownLimitations: [
      "Slim profile may limit torque capacity vs. heavy-door operators",
      "Bluetooth configuration requires app download and BLE proximity",
      "Low-energy knowing-act mode requires AUTOMATIC CAUTION DOOR signage",
    ],
    sensorCompatibility: ["Bluetooth app", "Motion/radar activation", "Push-plate knowing act", "Access control integration"],
  },

  {
    id: "sw200_ohc",
    brand: "assa_abloy",
    name: "SW200 OHC",
    fullName: "ASSA ABLOY SW200 OHC Concealed Overhead Swing Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["hospitality", "healthcare", "corporate", "luxury retail", "airport"],
    description:
      "Premium concealed overhead swing door operator with hidden arm system. Designed for high-aesthetic applications where visible hardware is undesirable. Used in hospitality, luxury retail, corporate headquarters, and premium healthcare environments.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2023",
        status: "certified",
        notes: "A156.10-2023 certified. All force, sensor, and signage requirements met. Concealed installation does not affect operational certification.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Integrated header sensor coverage",
          "Sensor fault monitoring §8.3",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Integrated header sensor — concealed",
        standard: "A156.10 §8.1",
        notes: "Sensors integrated into header unit — no visible external hardware. Required for high-aesthetic concealed-hardware applications.",
      },
      {
        category: "presence",
        type: "IR presence — concealed header mount",
        standard: "A156.10 §8.2",
        notes: "Presence detection integrated within concealed header. Maintains clean aesthetic.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check. Required for all power-operated configurations.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Typically interior or vestibule-protected applications. Verify NOA for exterior HVHZ swing doors. Concealed configuration may require separate product-specific NOA validation.",
    },
    keySpecs: {
      "Arm system": "Concealed — no visible hardware",
      "Aesthetic": "Premium design for hospitality and luxury applications",
      "Sensor integration": "Sensors concealed within header unit",
      "ADA compliance": "Full ADA compliance with concealed configuration (ICC A117.1)",
      "Primary markets": "5-star hotels, luxury retail, corporate HQ, premium healthcare",
    },
    pmAngles: [
      {
        topic: "Concealed hardware as an architect-driven spec",
        insight:
          "Architects on luxury hospitality and corporate headquarters projects frequently specify 'no visible hardware' as a design requirement. A concealed overhead operator like the SW200 OHC is the only automatic swing solution that meets this requirement. PM angle: understanding who drives product specifications (architects vs. general contractors vs. facility managers) determines the appropriate go-to-market approach.",
        useIn: "both",
      },
    ],
    marketVerticals: ["hospitality", "healthcare", "airport"],
    priceRange: "premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Concealed arm system — zero visible hardware",
      "Architect-preferred for luxury hospitality and corporate HQ",
      "Integrated sensors in header — clean sightlines",
      "Full ADA compliance with concealed configuration",
    ],
    competitiveThreats: ["dk-ed-ohc"],
    knownLimitations: [
      "Premium price premium over surface-mount swing operators",
      "Installation complexity higher than surface-mount — specialized installer required",
      "Concealed configuration limits field serviceability vs. surface-mount",
    ],
  },

  {
    id: "folding_door_aa",
    brand: "assa_abloy",
    name: "Automatic Folding Door",
    fullName: "ASSA ABLOY Automatic Folding Door System",
    motion: "folding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "healthcare", "airport", "commercial"],
    description:
      "Automatic bi-fold door system for openings requiring wide clear widths in limited space. Used in retail, healthcare, and airport applications where swing or slide clearance is constrained.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2023",
        status: "certified",
        notes: "A156.10-2023 certified for automatic folding door operation. All force, sensor, and signage requirements apply to bi-fold panel configuration.",
        keyRequirements: [
          "30 lbf force limit on all panel leading edges",
          "Sensor fault monitoring §8.3",
          "Panel pinch-point protection",
        ],
      },
      {
        standard: "A156.38",
        edition: "2019",
        status: "certified",
        notes: "A156.14-2024 sliding and folding door hardware standard compliance. ADA accessible configuration available.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Overhead microwave activation",
        standard: "A156.10 §8.1",
        notes: "Standard overhead activation zone covering bi-fold opening width.",
      },
      {
        category: "presence",
        type: "IR presence — full opening width",
        standard: "A156.10 §8.2",
        notes: "Presence detection across full folded opening to prevent close-on-pedestrian.",
      },
      {
        category: "safety",
        type: "Panel pinch-point detection",
        standard: "A156.10 §8.3",
        notes: "Fold-point sensors detect obstruction between panels during closing cycle.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Folding door configurations require product-specific NOA for exterior HVHZ applications. Typically interior-only. Verify for any exterior folding door installation in FL HVHZ zones.",
    },
    keySpecs: {
      "Configuration": "Automatic bi-fold panel system",
      "Advantage": "Wide clear opening in constrained space — no swing or slide clearance required",
      "Hardware standard": "A156.14-2024 sliding and folding door hardware",
      "ADA": "ADA accessible configuration available (ICC A117.1)",
      "Markets": "Retail, healthcare, airport applications with space constraints",
    },
    pmAngles: [
      {
        topic: "Folding doors as constrained-space solutions",
        insight:
          "Folding doors address a specific architectural constraint — maximum clear opening in minimum floor/wall space. When a sliding door would require too deep a pocket and a swing door would block pedestrian flow, a folding door is the only viable automatic option. PM angle: products that solve a geometric/spatial constraint often face less competition because alternatives require building modifications.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["retail", "healthcare", "airport"],
    priceRange: "mid",
    installedBase: "niche",
    keyDifferentiators: [
      "Maximum clear opening width in constrained space",
      "Bi-fold configuration eliminates need for slide pocket or swing clearance",
      "A156.14-2024 hardware standard compliance",
      "ADA accessible configuration available",
    ],
    competitiveThreats: ["st-magic-force-bifold", "horton-4200-bifold"],
    knownLimitations: [
      "Higher mechanical complexity than sliding or swing",
      "Panel fold-point is a potential obstruction/pinch risk requiring careful sensor configuration",
      "No HVHZ NOA for exterior use without specific product validation",
    ],
  },

  {
    id: "versamax_icu",
    brand: "assa_abloy",
    name: "VersaMax ICU/CCU",
    fullName: "ASSA ABLOY VersaMax ICU/CCU Telescoping",
    motion: "telescoping",
    energyClass: "full-energy",
    primaryApplication: ["healthcare", "ICU", "CCU", "critical care", "behavioral health"],
    description:
      "Automatic telescoping door system designed for ICU, CCU, and critical care environments. Provides maximum clear opening width for bed/gurney passage. Meets NFPA 101-2024 controlled-egress provisions and ASHRAE 170-2021 ventilation requirements. Infection control features.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2023",
        status: "certified",
        notes: "A156.10-2023 certified for telescoping ICU/CCU configuration. Full sensor coverage required across maximum clear opening width.",
        keyRequirements: [
          "30 lbf limit on all panel edges",
          "Full COW sensor array",
          "Sensor fault monitoring §8.3",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave presence sensor — hands-free",
        standard: "A156.10 §8.1",
        notes: "Hands-free activation for infection control. Microwave presence detection eliminates need for touch activation.",
      },
      {
        category: "activation",
        type: "Nurse call integration",
        notes: "Door activation via nurse call system. Integrates with facility nurse call infrastructure.",
        optional: true,
      },
      {
        category: "activation",
        type: "Access control / badge reader",
        notes: "Access control integration for behavioral health and locked-unit applications.",
        optional: true,
      },
      {
        category: "presence",
        type: "IR safety sensors — multiple array",
        standard: "A156.10 §8.2",
        notes: "Multi-sensor array covers full extended opening width. Required for gurney/bed passage safety.",
      },
      {
        category: "safety",
        type: "ASHRAE 170-2021 pressure monitoring integration",
        notes: "Hold-open timing coordinated with ASHRAE 170 air exchange requirements. Maintains positive/negative pressure differentials in critical care rooms.",
        optional: true,
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "ICU/CCU telescoping doors are interior clinical applications. HVHZ NOA not typically required. Verify for any exterior healthcare applications in FL HVHZ zones.",
    },
    keySpecs: {
      "Configuration": "Telescoping panels — wider opening in tighter headers",
      "Clear opening": "Maximum clear opening for bed/gurney passage (FGI min 44.5 in.)",
      "Pressure standard": "ASHRAE 170-2021 pressure differential maintenance",
      "Life safety": "NFPA 101-2024 controlled-egress compatible (memory care/behavioral health)",
      "Infection control": "Hands-free activation, infection control surface options",
      "FGI compliance": "FGI Guidelines 2022 — ICU/CCU minimum clear opening",
    },
    pmAngles: [
      {
        topic: "ASHRAE 170 + NFPA 101 as a dual-compliance specification",
        insight:
          "ICU/CCU doors must simultaneously satisfy ventilation pressure differential requirements (ASHRAE 170) and life safety egress provisions (NFPA 101). These standards can conflict — a door that holds open for egress may disrupt room pressurization. PM angle: products at the intersection of conflicting regulatory requirements command premium pricing and face almost no price competition.",
        useIn: "both",
      },
      {
        topic: "Hands-free activation as infection control infrastructure",
        insight:
          "In post-COVID healthcare design, hands-free door activation in clinical spaces is increasingly a design standard, not a premium option. The VersaMax ICU supports microwave presence activation that never requires touch — reducing HAI transmission vectors. PM angle: health-outcome metrics are increasingly influencing capital equipment purchasing in healthcare.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["healthcare"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Maximum clear opening for bed/gurney passage — FGI 44.5 in. minimum compliant",
      "Telescoping panels for wider openings in tighter headers",
      "NFPA 101-2024 controlled-egress compatible for memory care and behavioral health",
      "ASHRAE 170-2021 pressure differential maintenance",
      "Hands-free microwave activation for infection control",
      "Nurse call and access control integration",
    ],
    competitiveThreats: ["st-procare-8300bp", "horton-icu-series", "aa-versaMax"],
    knownLimitations: [
      "Ultra-premium price point — substantial cost premium over standard sliding ICU doors",
      "Requires specialized healthcare installation with ASHRAE 170 commissioning",
      "Telescoping panel complexity increases maintenance vs. standard sliding",
      "Small addressable market — ICU/CCU renovation projects only",
    ],
    flKeyNote: "Interior ICU/CCU clinical application. HVHZ NOA not typically required. Verify for exterior healthcare entrances in FL HVHZ zones.",
    sensorCompatibility: ["Microwave presence", "IR safety sensors", "Nurse call integration", "Access control/badge reader"],
  },

  // ─── ASSA ABLOY / RECORD — TSA Series (Telescopic Sliding, System 20 platform) ─

  {
    id: "aa-record-tsa20",
    brand: "assa_abloy",
    name: "RECORD TSA 20",
    fullName: "ASSA ABLOY RECORD TSA 20 Telescopic Sliding Door (Single-Leaf)",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "commercial", "healthcare", "hospitality"],
    description:
      "RECORD TSA 20 single-leaf telescopic sliding door on the System 20 platform. RECORD is a wholly-owned ASSA ABLOY subsidiary specializing in telescopic sliding door systems. Single-leaf configuration for standard commercial entrances. A156.10 certified. Designed for high-traffic applications requiring wide clear opening from a narrow pocket depth.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for power-operated telescopic sliding door. Full force, sensor, and signage compliance.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Pre-cycle sensor fault check §8.3",
          "Presence sensor 8 in. inactive zone",
          "50 in. AFF signage",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor — overhead mount",
        standard: "A156.10 §8.1",
        notes: "Standard overhead microwave activation for telescopic sliding configuration.",
      },
      {
        category: "presence",
        type: "Overhead IR presence sensor",
        standard: "A156.10 §8.2",
        notes: "Holds door open while occupant in detection zone.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each closing cycle. Required for A156.10-2017+ compliance.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify current NOA/HVHZ status for exterior Florida applications. Contact ASSA ABLOY ENS or RECORD for project-specific approval documentation.",
    },
    keySpecs: {
      "Configuration": "Single-leaf telescopic",
      "Platform": "System 20",
      "Brand lineage": "RECORD — wholly-owned ASSA ABLOY subsidiary",
      "Application": "Standard commercial, retail, healthcare, hospitality",
      "Certification": "A156.10-2024",
    },
    pmAngles: [
      {
        topic: "RECORD as ASSA ABLOY's telescopic door specialist",
        insight:
          "RECORD is a specialist telescopic sliding door brand within the ASSA ABLOY portfolio. The TSA series is the core product line. PM angle: ASSA ABLOY's brand portfolio strategy — keeping RECORD as a distinct brand preserves specialist credibility with architects and specifiers who associate the RECORD name with telescopic sliding door engineering heritage.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["retail", "healthcare", "hospitality"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "RECORD System 20 platform — engineered specifically for telescopic sliding",
      "Single-leaf configuration for standard commercial openings",
      "ASSA ABLOY group support — national service network",
    ],
    competitiveThreats: ["dk-esa300t", "aa-sl521"],
    knownLimitations: [
      "Telescopic configuration more complex than standard bi-parting — higher maintenance cadence",
      "HVHZ NOA requires product-specific verification for exterior FL applications",
    ],
    sensorCompatibility: ["Microwave motion", "IR presence", "Pre-cycle fault monitor"],
  },

  {
    id: "aa-record-tsa21",
    brand: "assa_abloy",
    name: "RECORD TSA 21",
    fullName: "ASSA ABLOY RECORD TSA 21 Bi-Parting/Telescopic Sliding Door",
    motion: "telescoping",
    energyClass: "full-energy",
    primaryApplication: ["commercial", "retail", "airport", "high-traffic entrances"],
    description:
      "RECORD TSA 21 bi-parting telescopic sliding door on the System 20 platform. Provides wide clear openings using telescoping panel stacks on each side. Ideal for high-traffic commercial and retail environments where maximum clear width is required with minimal pocket depth. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for power-operated bi-parting telescopic sliding door. Full force, sensor, and signage compliance.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Pre-cycle sensor fault check §8.3",
          "Presence sensor 8 in. inactive zone",
          "50 in. AFF signage",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor — overhead mount, bi-directional",
        standard: "A156.10 §8.1",
        notes: "Dual-direction overhead microwave sensors for bi-parting telescopic configuration.",
      },
      {
        category: "presence",
        type: "Overhead IR presence sensor — full clear-opening coverage",
        standard: "A156.10 §8.2",
        notes: "Full presence coverage across the wide clear opening.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each cycle.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Telescoping configurations require separate NOA from standard bi-parting. Verify product-specific NOA for exterior HVHZ applications.",
    },
    keySpecs: {
      "Configuration": "Bi-parting telescopic",
      "Platform": "System 20",
      "Brand lineage": "RECORD — wholly-owned ASSA ABLOY subsidiary",
      "Application": "High-traffic commercial, retail, airport entrances",
      "Certification": "A156.10-2024",
    },
    pmAngles: [
      {
        topic: "Telescoping as the wide-opening solution",
        insight:
          "A bi-parting telescopic system achieves the same clear opening width as a larger bi-parting unit with much smaller pocket depth on each side. This is a key architectural advantage in renovations where wall depth is constrained. PM angle: understanding door geometry constraints is essential for positioning telescopic vs. standard bi-parting systems in renovation vs. new construction contexts.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "airport", "healthcare"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "Wide clear opening from narrow pocket depth — bi-parting telescopic advantage",
      "RECORD System 20 platform engineered for telescopic reliability",
      "ASSA ABLOY national service network",
    ],
    competitiveThreats: ["dk-esa300t", "dk-esa500", "aa-sl521"],
    knownLimitations: [
      "More complex mechanical system vs. standard bi-parting — higher service requirements",
      "Higher price than standard sliding for same nominal opening width",
      "HVHZ exterior: NOA must be verified product-specifically for telescopic configuration",
    ],
    sensorCompatibility: ["Microwave motion (bi-directional)", "IR presence (full-width)", "Pre-cycle fault monitor"],
  },

  {
    id: "aa-record-tsa22",
    brand: "assa_abloy",
    name: "RECORD TSA 22",
    fullName: "ASSA ABLOY RECORD TSA 22 Multi-Leaf Telescopic Sliding Door",
    motion: "telescoping",
    energyClass: "full-energy",
    primaryApplication: ["airport", "hospital", "convention center", "high-traffic wide-opening"],
    description:
      "RECORD TSA 22 multi-leaf telescopic sliding door on the System 20 platform. Maximum clear opening width with minimum pocket depth using multiple telescoping panel leaves per side. Engineered for the widest high-traffic openings: airport terminals, convention centers, major hospital main entrances. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for power-operated multi-leaf telescopic sliding door. Full force, sensor, and signage compliance across extended panel system.",
        keyRequirements: [
          "30 lbf closing force limit across all panel leaf contacts",
          "Pre-cycle sensor fault check §8.3",
          "Full-width presence sensor coverage",
          "50 in. AFF signage",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor — extended overhead coverage",
        standard: "A156.10 §8.1",
        notes: "Extended overhead microwave coverage for very wide multi-leaf opening.",
      },
      {
        category: "presence",
        type: "IR presence sensor — full multi-leaf clear-opening coverage",
        standard: "A156.10 §8.2",
        notes: "Full presence detection across the entire multi-leaf clear opening width.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each closing cycle.",
      },
      {
        category: "obstruction",
        type: "Multi-leaf panel collision detection",
        notes: "Inter-panel obstruction sensing for multi-leaf synchronized movement.",
        optional: true,
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Multi-leaf telescopic configurations require product-specific NOA for exterior HVHZ applications. Verify with ASSA ABLOY ENS for specific project requirements.",
    },
    keySpecs: {
      "Configuration": "Multi-leaf telescopic",
      "Platform": "System 20",
      "Brand lineage": "RECORD — wholly-owned ASSA ABLOY subsidiary",
      "Application": "Airport terminal, convention center, hospital main entrance",
      "Certification": "A156.10-2024",
      "Key advantage": "Maximum clear width from minimum wall pocket depth",
    },
    pmAngles: [
      {
        topic: "Multi-leaf telescopic as an infrastructure-scale product",
        insight:
          "The TSA 22 addresses the widest openings where no standard sliding or bi-parting system is viable. It is specified by architects and engineers, not purchased off-catalog. PM angle: at this scale, the product is sold as part of a building system integration — engineering, commissioning, and lifecycle service are co-equal with the hardware. Relationship with the architecture and engineering community is the primary go-to-market.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["airport", "healthcare", "hospitality"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Maximum clear opening width of any RECORD/ASSA ABLOY telescopic product",
      "Multi-leaf System 20 platform — purpose-built for wide high-traffic openings",
      "Airport and convention center reference sites",
    ],
    competitiveThreats: ["dk-esa500", "horton-9000"],
    knownLimitations: [
      "Ultra-premium price — significant cost premium over bi-parting telescopic",
      "Long sales and commissioning cycle — project/specification sale only",
      "Multi-leaf mechanical complexity requires specialized technician training",
      "HVHZ NOA: must be verified for each project-specific configuration",
    ],
    sensorCompatibility: ["Extended microwave motion", "Full-width IR presence", "Pre-cycle fault monitor", "Multi-leaf panel detection"],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // dormakaba US PORTFOLIO
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: "dk-esa100",
    brand: "dormakaba",
    name: "ESA100",
    fullName: "dormakaba ESA100 Automatic Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "commercial"],
    description:
      "Standard commercial automatic sliding door with fixed side panel. Entry-level ANSI commercial automatic slider for retail and commercial applications. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified. Standard force, sensor, and signage requirements met.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3", "8 in. inactive zone"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor",
        standard: "A156.10 §8.1",
        notes: "Standard overhead microwave activation.",
      },
      {
        category: "presence",
        type: "Overhead IR presence",
        standard: "A156.10 §8.2",
        notes: "Standard presence hold-open.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each closing cycle.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify NOA status for HVHZ exterior applications. Standard commercial product may not carry Miami-Dade NOA.",
    },
    keySpecs: {
      "Configuration": "Bi-parting with fixed sidelite",
      "Certification": "A156.10",
      "Market": "Retail, commercial",
      "Mounting": "Surface-mount header",
    },
    pmAngles: [
      {
        topic: "ESA100 as a price-competitive alternative to Dura-Glide 2000",
        insight:
          "In retail replacement projects, dormakaba's ESA100 competes directly against the entrenched Dura-Glide 2000 installed base. dormakaba's pricing is often competitive but faces headwinds from Stanley's deep GC relationships and service network density.",
        useIn: "both",
      },
    ],
    marketVerticals: ["retail"],
    priceRange: "economy",
    installedBase: "moderate",
    keyDifferentiators: [
      "Competitive pricing vs. US market leaders",
      "A156.10 certified — meets all standard commercial requirements",
    ],
    competitiveThreats: ["st-dura-glide-2000", "aa-sl500", "horton-2000"],
    knownLimitations: [
      "No HVHZ NOA — cannot be used for exterior Miami-Dade/Broward projects",
      "Thinner US service network than ASSA ABLOY or Stanley",
      "Limited installed base vs. Dura-Glide 2000 — replacement parts ecosystem smaller",
    ],
  },

  {
    id: "dk-esa200",
    brand: "dormakaba",
    name: "ESA200",
    fullName: "dormakaba ESA200 Full Breakout Automatic Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["high-traffic commercial"],
    description:
      "Fine-frame full-breakout automatic sliding door. All panels break out for emergency egress or cleaning access. A156.10 certified. Slim aluminum frame profile.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified. Full breakout emergency egress function meets life-safety requirements.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3", "Full breakout egress"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor",
        standard: "A156.10 §8.1",
        notes: "Overhead activation. Full breakout does not affect sensor placement.",
      },
      {
        category: "safety",
        type: "Pre-cycle fault check + breakout monitoring",
        standard: "A156.10 §8.3",
        notes: "Monitors breakout panels for proper latching before normal operation resumes.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify NOA for exterior HVHZ. Full breakout models require separate structural validation for hurricane-zone wind load.",
    },
    keySpecs: {
      "Breakout": "Full — all panels break out for egress",
      "Frame": "Fine/slim aluminum profile",
      "Certification": "A156.10",
      "Primary markets": "High-traffic retail, commercial main entry",
    },
    pmAngles: [
      {
        topic: "Full breakout as a life-safety code requirement",
        insight:
          "In high-occupancy buildings, IBC may require power-operated sliding doors to provide clear egress without power (breakout function). Full breakout allows all panels to fold aside in an emergency. PM framing: life-safety code requirements drive product features that appear to be 'nice-to-have' but are actually code-mandated.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "healthcare"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "Full breakout — all panels egress-capable",
      "Fine-frame slim profile for aesthetic applications",
    ],
    competitiveThreats: ["st-dura-glide-3000", "aa-sl500", "horton-9000"],
    knownLimitations: [
      "No HVHZ NOA confirmed",
      "Thinner US service network",
    ],
  },

  {
    id: "dk-esa300",
    brand: "dormakaba",
    name: "ESA300",
    fullName: "dormakaba ESA300 Fixed Sidelite Automatic Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "healthcare"],
    description:
      "Commercial fixed sidelite automatic sliding door. Full breakout option available. Designed for retail and healthcare where fixed sidelites frame the entrance. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024. Standard force, sensor, and signage requirements. Full breakout option adds egress compliance.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor",
        standard: "A156.10 §8.1",
        notes: "Standard overhead activation.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check required.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify HVHZ NOA for exterior sidelite configurations in FL.",
    },
    keySpecs: {
      "Sidelite": "Fixed panels frame sliding opening",
      "Breakout option": "Available — full breakout for egress",
      "Primary markets": "Retail, healthcare, commercial",
    },
    pmAngles: [
      {
        topic: "Sidelite configurations as a GC coordination point",
        insight:
          "Fixed sidelite automatic doors require coordination between the door manufacturer and the glazing contractor. Sidelite glass is usually owner-supplied or specified separately. PM lesson: multi-contractor coordination at installation is a service quality opportunity.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "healthcare"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "Fixed sidelite framing for designed entrance aesthetic",
      "Full breakout option for life-safety compliance",
    ],
    competitiveThreats: ["st-dura-glide-2000", "aa-sl500"],
    knownLimitations: ["No confirmed HVHZ NOA", "Regional US service network"],
  },

  {
    id: "dk-esa300t",
    brand: "dormakaba",
    name: "ESA300T",
    fullName: "dormakaba ESA300T Telescoping Automatic Sliding Door",
    motion: "telescoping",
    energyClass: "full-energy",
    primaryApplication: ["hospitals", "airports"],
    description:
      "Full-breakout telescoping automatic sliding door. Maximum clear opening from constrained header. Full breakout on all panels. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 for telescoping configuration with full breakout. All panel edges must meet 30 lbf limit.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Wide-angle microwave motion sensor",
        standard: "A156.10 §8.1",
        notes: "Wide-zone sensor for extended telescoping COW.",
      },
      {
        category: "safety",
        type: "Edge sensors on all telescoping panels",
        standard: "A156.10 §8.3",
        notes: "All leading edges require detection. Full breakout monitoring also required.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Telescoping NOA separate from standard sliding. Verify for any FL exterior HVHZ use.",
    },
    keySpecs: {
      "Breakout": "Full — all panels",
      "COW": "Maximum from constrained header space",
      "Certification": "A156.10 telescoping",
      "Primary markets": "Hospitals, airports, large commercial",
    },
    pmAngles: [
      {
        topic: "Telescoping + full breakout as the premium healthcare sliding spec",
        insight:
          "Hospital main entries increasingly require both maximum clear opening (for patient transport equipment) and full breakout (life-safety egress). ESA300T combines both — but the combination adds cost and complexity that needs to be justified in the spec.",
        useIn: "both",
      },
    ],
    marketVerticals: ["healthcare", "airport"],
    priceRange: "premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Telescoping + full breakout in one system",
      "Maximum COW for hospital main entry equipment transport",
    ],
    competitiveThreats: ["aa-sl521", "st-dura-glide-tele"],
    knownLimitations: ["Higher installation complexity", "No confirmed HVHZ NOA"],
  },

  {
    id: "dk-esa400",
    brand: "dormakaba",
    name: "ESA400",
    fullName: "dormakaba ESA400 Enhanced Commercial Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["commercial", "education"],
    description:
      "Enhanced commercial sliding door with fixed panel. Higher performance than ESA100 for more demanding commercial and education applications. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 enhanced commercial specification.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor",
        standard: "A156.10 §8.1",
        notes: "Standard overhead activation.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle fault check.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify HVHZ NOA for exterior applications.",
    },
    keySpecs: {
      "Category": "Enhanced commercial — step above ESA100",
      "Certification": "A156.10",
      "Primary markets": "Commercial buildings, education facilities",
    },
    pmAngles: [
      {
        topic: "Product ladder from ESA100 to ESA500 as upsell strategy",
        insight:
          "dormakaba's ESA line is organized as a clear performance ladder. The commercial conversation is about matching the right tier to the project requirements — and finding upgrade opportunities when project specs change (e.g., breakout requirement added at permit stage).",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "education"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "Mid-tier performance above ESA100 at lower cost than ESA500",
    ],
    competitiveThreats: ["st-dura-glide-2000", "aa-sl500"],
    knownLimitations: ["No confirmed HVHZ NOA", "Regional service network"],
  },

  {
    id: "dk-esa500",
    brand: "dormakaba",
    name: "ESA500",
    fullName: "dormakaba ESA500 Full-Breakout Telescoping Wide-Span Sliding Door",
    motion: "telescoping",
    energyClass: "full-energy",
    primaryApplication: ["airports", "large retail"],
    description:
      "Full-breakout telescoping extra-wide sliding door for the highest throughput and widest opening requirements. A156.10 certified. Primary for airports and large-format retail entrances.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 for wide-span full-breakout telescoping configuration.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Wide-area microwave array",
        standard: "A156.10 §8.1",
        notes: "Multiple sensors required for extra-wide COW coverage.",
      },
      {
        category: "safety",
        type: "Full edge detection array + fault monitoring",
        standard: "A156.10 §8.3",
        notes: "All leading edges on all panels require detection. Most complex sensor configuration in ESA line.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify HVHZ certification for exterior airport/large retail applications in FL.",
    },
    keySpecs: {
      "Breakout": "Full — all panels",
      "Opening": "Extra-wide COW — airport and large retail main entry",
      "Certification": "A156.10 wide-span telescoping",
    },
    pmAngles: [
      {
        topic: "Wide-span airport entry as a showcase project",
        insight:
          "Winning an airport terminal main entry specification generates a reference that is seen by millions annually. dormakaba's airport reference sites across Europe are used to win US airport bids. Reference selling is the primary go-to-market for this product tier.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["airport", "retail"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Extra-wide COW — maximum airport/large-retail opening",
      "Full breakout on all panels for life-safety compliance",
    ],
    competitiveThreats: ["aa-sl521", "st-dura-glide-tele", "horton-9000"],
    knownLimitations: [
      "No confirmed HVHZ NOA for US exterior applications",
      "Very large project scope — long sales cycle and complex specification",
    ],
  },

  {
    id: "dk-ed50",
    brand: "dormakaba",
    name: "ED50",
    fullName: "dormakaba ED50 Low-Duty Swing Door Operator",
    motion: "swing",
    energyClass: "low-energy",
    primaryApplication: ["light-duty ADA"],
    description:
      "Low-duty electromechanical swing operator. Surface-applied. Economy entry point for ADA accessible entrances with light traffic. A156.19 certified.",
    standardCerts: [
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "A156.19-2019 low-energy. AUTOMATIC CAUTION DOOR signage required.",
        keyRequirements: ["AUTOMATIC CAUTION DOOR sign", "Max 15 lbf", "Max 5 lbf in-motion"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push-plate (primary)",
        standard: "A156.19",
        notes: "User-actuated. Slow-speed opening for force control.",
      },
      {
        category: "safety",
        type: "Slow-speed force limitation",
        standard: "A156.19",
        notes: "Low-energy speed controls contact force — no kinetic reversal needed.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior/non-HVHZ. Verify if HVHZ exterior swing use is required.",
    },
    keySpecs: {
      "Duty": "Low-duty — light traffic ADA paths",
      "Certification": "A156.19",
      "Mounting": "Surface applied",
    },
    pmAngles: [
      {
        topic: "Economy swing operator as a price-sensitive ADA-compliance purchase",
        insight:
          "ED50 buyers are typically smaller commercial buildings or retrofit ADA-path projects with tight budgets. Price is the primary decision driver — not performance or service network. PM lesson: understand which customer segment cares about price vs. performance vs. service.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "education"],
    priceRange: "economy",
    installedBase: "moderate",
    keyDifferentiators: [
      "Economy price point — lowest cost dormakaba swing operator",
      "A156.19 compliant for ADA path of travel",
    ],
    competitiveThreats: ["aa-sw60", "aa-sw100", "st-magic-access", "horton-4000"],
    knownLimitations: [
      "Not appropriate for high-traffic",
      "AUTOMATIC CAUTION DOOR signage required",
      "User-actuated — no hands-free",
    ],
  },

  {
    id: "dk-ed100",
    brand: "dormakaba",
    name: "ED100",
    fullName: "dormakaba ED100 Surface-Applied Swing Door Operator",
    motion: "swing",
    energyClass: "low-energy",
    primaryApplication: ["healthcare", "commercial"],
    description:
      "Medium-duty electromechanical swing operator. Doors up to 160 kg, 1100 mm wide. Low-energy standard with Upgrade Card option to add full-energy capability. 685×70×130 mm housing. Self-learning microprocessor, wind load control, Push & Go, cycle counter to 1M. A156.19 standard; A156.10 with Upgrade Card.",
    standardCerts: [
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "Standard A156.19 low-energy certification. AUTOMATIC CAUTION DOOR sign required.",
        keyRequirements: ["AUTOMATIC CAUTION DOOR sign", "Max 15 lbf", "Max 5 lbf in-motion"],
      },
      {
        standard: "A156.10",
        edition: "2024",
        status: "partial",
        notes: "Upgrade Card enables A156.10 full-energy operation. Requires separate card purchase and configuration — not standard out of box.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push & Go or push-plate",
        standard: "A156.19",
        notes: "Push & Go: manual push initiates automatic opening cycle. Hands-free optional with motion sensor upgrade.",
      },
      {
        category: "safety",
        type: "Wind load control + self-learning microprocessor",
        standard: "A156.19",
        notes: "Self-learning adjusts force and timing to door weight and current wind/stack conditions. Reduces improper force issues over product lifecycle.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior/non-HVHZ primary use. Verify for exterior HVHZ swing door applications.",
    },
    keySpecs: {
      "Max door weight": "160 kg",
      "Max door width": "1100 mm",
      "Housing": "685 × 70 × 130 mm",
      "Motor": "Electromechanical",
      "Self-learning": "Yes — adjusts to door weight and wind conditions",
      "Cycle counter": "Up to 1 million cycles",
      "Full-energy upgrade": "Upgrade Card required — additional cost",
    },
    pmAngles: [
      {
        topic: "Upgrade Card as a product tiering mechanism",
        insight:
          "The ED100 Upgrade Card to enable A156.10 full-energy operation is a clever product tiering tactic — it lowers the initial purchase price for buyers who don't need full-energy, while preserving revenue from those who do. PM framing: freemium-style feature gating in hardware products.",
        useIn: "strategy",
      },
      {
        topic: "Self-learning microprocessor as a maintenance-reducing feature",
        insight:
          "Self-learning door operators reduce service calls by adapting to changing conditions (door weight drift, seasonal temperature). A PM should understand that this feature reduces TCO for building owners — a powerful ROI argument vs. simpler operators that require manual recalibration.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare", "retail"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "Self-learning microprocessor — reduces lifecycle service calls",
      "Upgrade Card for A156.10 full-energy — flexible product tiering",
      "Push & Go mode — popular for healthcare staff use",
      "Wind load control — handles stack pressure without manual recalibration",
    ],
    competitiveThreats: ["aa-sw200i-surface", "aa-sw300", "st-magic-force"],
    knownLimitations: [
      "Full-energy upgrade requires additional card purchase — TCO calculation must include this",
      "1100 mm max door width — not suitable for wide commercial entrances",
      "No confirmed HVHZ NOA",
    ],
  },

  {
    id: "dk-ed250",
    brand: "dormakaba",
    name: "ED250",
    fullName: "dormakaba ED250 Heavy-Duty Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["high-traffic commercial", "hospitals", "exterior"],
    description:
      "Heavy-duty electromechanical full-energy swing operator. Doors up to 400 kg, 1600 mm wide. 685×70×130 mm housing. Max 240W. A156.10 certified. Highest capacity in dormakaba surface-applied swing line.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 full-energy. 400 kg / 1600 mm capacity. Max 240W power draw.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Motion sensor or push-plate",
        standard: "A156.10 §8.1",
        notes: "Full-energy: hands-free activation available via motion sensor.",
      },
      {
        category: "presence",
        type: "Overhead presence — full swing arc",
        standard: "A156.10 §8.2",
        notes: "Standard presence detection for full-energy operation.",
      },
      {
        category: "safety",
        type: "Electronic sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check. Fault = hold or safe slow-close.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Exterior swing in HVHZ requires NOA. Verify dormakaba ED250 NOA status for exterior HVHZ applications.",
    },
    keySpecs: {
      "Max door weight": "400 kg",
      "Max door width": "1600 mm",
      "Housing": "685 × 70 × 130 mm (same as ED100)",
      "Max power": "240W",
      "Certification": "A156.10 full-energy",
    },
    pmAngles: [
      {
        topic: "ED250 vs. SW200i surface — same housing, different brand ecosystem",
        insight:
          "ED250 (dormakaba) and SW200i Surface (ASSA ABLOY) compete on spec for the same heavy-duty hospital corridor swing door application. Both are A156.10 certified. dormakaba's edge is often price; ASSA ABLOY's edge is service network density and AAADM technician availability.",
        useIn: "both",
      },
    ],
    marketVerticals: ["healthcare", "retail", "government"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "400 kg capacity — highest in dormakaba surface swing line",
      "1600 mm door width — covers very wide hospital corridor doors",
      "Same compact housing as ED100 — consistent installation",
    ],
    competitiveThreats: ["aa-sw200i-surface", "aa-sw300", "st-magic-force", "st-m-force"],
    knownLimitations: [
      "No confirmed HVHZ NOA for exterior",
      "Thinner US service/parts network than ASSA ABLOY",
    ],
  },

  {
    id: "dk-ed-ohc",
    brand: "dormakaba",
    name: "ED OHC",
    fullName: "dormakaba ED OHC Overhead-Concealed Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["premium commercial", "healthcare"],
    description:
      "Overhead-concealed version of the dormakaba ED operator family. 4\"×6\" header package. Narrow profile for premium commercial and healthcare where header aesthetics matter. A156.10/A156.19 variants.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "Full-energy OHC variant certified to A156.10-2024.",
      },
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "Low-energy OHC variant certified to A156.19-2019.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push-plate or motion (external mount)",
        standard: "A156.10 / A156.19",
        notes: "Activation hardware surface-mounted externally since operator is concealed.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor (full-energy variant)",
        standard: "A156.10 §8.3",
        notes: "Required for A156.10 full-energy OHC variant.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "OHC mounting; door leaf NOA must be verified separately for HVHZ exterior use.",
    },
    keySpecs: {
      "Header package": "4\" × 6\" — narrow OHC profile",
      "Variants": "Full-energy (A156.10) and low-energy (A156.19)",
      "Primary markets": "Premium commercial, healthcare corridors with aesthetic requirements",
    },
    pmAngles: [
      {
        topic: "OHC pricing premium vs. aesthetic value",
        insight:
          "OHC operators cost more than surface-mounted operators for the same performance. The premium is paid for aesthetics. PM framing: understanding when buyers pay a premium for intangible benefits (appearance) vs. tangible performance benefits.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare", "hospitality"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "4\"×6\" compact OHC profile — fits tighter headers than ASSA ABLOY OHC",
      "Dual certification: A156.10 and A156.19 variants in same platform",
    ],
    competitiveThreats: ["aa-sw200-ohc", "st-magic-force"],
    knownLimitations: [
      "Requires header depth — limits retrofit applicability",
      "No confirmed HVHZ NOA",
    ],
  },

  {
    id: "dk-ed-ig",
    brand: "dormakaba",
    name: "ED-IG",
    fullName: "dormakaba ED-IG In-Ground Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["glass facades", "high-end lobbies"],
    description:
      "In-ground concealed floor installation swing operator. Aesthetically invisible — all hardware below finish floor. Full-energy A156.10 certified. Primary for glass facade lobbies, corporate HQ, high-end hospitality.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "Full-energy in-ground swing operator A156.10 certified.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Overhead or floor-level sensor",
        standard: "A156.10 §8.1",
        notes: "Activation sensor placed overhead or at floor level; no door-header mounting possible with in-ground operator.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Required pre-cycle check. All-invisible installation requires careful commissioning.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "In-ground operators in exterior glass facades require door leaf to carry independent NOA. Verify for HVHZ applications.",
    },
    keySpecs: {
      "Installation": "Under-floor concealed — zero visible hardware above floor",
      "Primary markets": "Glass facade lobbies, corporate HQ, 5-star hotels",
    },
    pmAngles: [
      {
        topic: "In-ground operator market as a duopoly",
        insight:
          "dormakaba ED-IG and ASSA ABLOY SW200i-IG are the two primary in-ground swing operator options in the US market. It is a true duopoly segment — very few other brands have a credible in-ground product. Competition is entirely on relationship, price, and project team preference.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["hospitality", "retail"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Zero visible hardware above floor",
      "Competitive with ASSA ABLOY SW200i-IG on price",
    ],
    competitiveThreats: ["aa-sw200i-ig"],
    knownLimitations: [
      "Slab coordination required before pour — no retrofit without major disruption",
      "Maintenance access requires floor access",
    ],
  },

  {
    id: "dk-ktv3-ktv4",
    brand: "dormakaba",
    name: "KTV 3/KTV 4",
    fullName: "dormakaba KTV 3/KTV 4 Revolving Door",
    motion: "revolving",
    energyClass: "power-assist",
    primaryApplication: ["hotels", "corporate", "retail"],
    description:
      "3- and 4-wing revolving doors. Manual, power-assist, or automatic operation. Diameter up to 3.8 m. Magnetic levitation bearing, electromechanical locking, night shield. EN 16005 compliant (European standard). Primary for hotel and corporate lobbies.",
    standardCerts: [
      {
        standard: "A156.27",
        edition: "2019",
        status: "verify",
        notes: "Revolving doors in the US market are governed by ANSI/BHMA A156.27-2019 (Revolving Doors) — NOT A156.10. dormakaba KTV carries EN 16005 European certification. Verify current US A156.27 certification status with dormakaba US before specifying for US projects. A156.27 requirements: max 4 RPM, breakout ≤ 130 lbf, collapsed egress ≥ 36 in., slow-speed ADA mode.",
      },
    ],
    sensorSpecs: [
      {
        category: "safety",
        type: "Magnetic levitation — low-friction rotation with stop detection",
        standard: "EN 16005 / A156.27-2019 (US equivalent)",
        notes: "Magnetic levitation reduces mechanical wear and enables precise rotation control with low-latency stop capability. US projects must meet A156.27 requirements.",
      },
      {
        category: "obstruction",
        type: "Torque-limited drive + emergency stop",
        standard: "EN 16005 / A156.27-2019 (US equivalent)",
        notes: "Emergency stop and collapse for ADA egress per A156.27 §5. Night shield locks door for after-hours security.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify HVHZ certification for exterior revolving door use in Florida.",
    },
    keySpecs: {
      "Wings": "3 or 4",
      "Diameter": "Up to 3.8 m",
      "Bearing": "Magnetic levitation — low friction, precise control",
      "Locking": "Electromechanical — night shield included",
      "Certification": "EN 16005 (European); verify US A156.27 (revolving doors)",
    },
    pmAngles: [
      {
        topic: "Magnetic levitation bearing as a maintenance-reducing differentiator",
        insight:
          "Magnetic levitation eliminates the main wear point in a revolving door — the center bearing. This dramatically reduces maintenance frequency and extends product life. PM lesson: mechanical innovations that reduce TCO are powerful selling tools in the facilities management segment.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["hospitality", "retail"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "Magnetic levitation bearing — market-leading maintenance reduction",
      "Night shield integrated — security without separate hardware",
      "EN 16005 European compliance — relevant for global hotel chains with US/European portfolios",
    ],
    competitiveThreats: ["aa-rd3-rd4", "aa-rd300-ag"],
    knownLimitations: [
      "European EN 16005 primary; verify US A156.27 certification (revolving door standard — NOT A156.10)",
      "No confirmed HVHZ NOA for exterior Florida applications",
      "Higher price than basic revolving options",
    ],
  },

  {
    id: "dk-ktv-atrium",
    brand: "dormakaba",
    name: "KTV ATRIUM FLEX",
    fullName: "dormakaba KTV ATRIUM FLEX All-Glass Revolving Door",
    motion: "revolving",
    energyClass: "power-assist",
    primaryApplication: ["premium lobbies", "airports"],
    description:
      "All-glass 3- and 4-wing revolving door. Laminated safety glass drum walls. Manual, power-assist, or automatic. EN 16005 compliant. Maximum architectural transparency for luxury lobby and airport entrances.",
    standardCerts: [
      {
        standard: "A156.27",
        edition: "2019",
        status: "verify",
        notes: "Revolving doors in the US market are governed by ANSI/BHMA A156.27-2019 (Revolving Doors) — NOT A156.10. dormakaba KTV ATRIUM FLEX carries EN 16005 European certification. Verify US A156.27 certification status with dormakaba US before specifying. A156.27 requires laminated safety glass per §4.1 — consistent with KTV ATRIUM glass construction.",
      },
    ],
    sensorSpecs: [
      {
        category: "safety",
        type: "Glass edge detection + torque limit",
        standard: "EN 16005",
        notes: "Laminated safety glass reduces injury risk from breakage. Edge detection for occupant safety.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "All-glass construction in HVHZ exterior requires hurricane-rated laminated glass — verify.",
    },
    keySpecs: {
      "Wings": "3 or 4",
      "Glass": "Laminated safety glass drum walls",
      "Primary markets": "Luxury hotel lobbies, premium corporate HQ, airport terminals",
    },
    pmAngles: [
      {
        topic: "All-glass revolving as a design-award product",
        insight:
          "KTV ATRIUM FLEX and ASSA ABLOY RD300 All-Glass compete for the same luxury spec. Both are often featured in architecture awards submissions. Design community engagement (AIA shows, specification training events) is the primary go-to-market for this product tier.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["hospitality", "airport"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Laminated safety glass drum — superior breakage protection vs. monolithic glass competitors",
      "Maximum visual transparency for luxury lobby design",
    ],
    competitiveThreats: ["aa-rd300-ag"],
    knownLimitations: [
      "Ultra-premium pricing",
      "EN 16005 primary; verify US A156.27 certification (revolving doors — NOT A156.10)",
      "Hurricane-rated glass required for HVHZ exterior",
    ],
  },

  {
    id: "dk-ktc3-ktc4",
    brand: "dormakaba",
    name: "KTC 3/KTC 4",
    fullName: "dormakaba KTC 3/KTC 4 High-Capacity Automatic Revolving Door",
    motion: "revolving",
    energyClass: "full-energy",
    primaryApplication: ["airports", "convention centers", "transit"],
    description:
      "High-capacity 3- and 4-wing automatic revolving door. Diameter up to 6.2 m. EN 16005. Primary for airports, convention centers, and major transit terminals with peak pedestrian throughput requirements.",
    standardCerts: [
      {
        standard: "A156.27",
        edition: "2019",
        status: "verify",
        notes: "Revolving doors in the US market are governed by ANSI/BHMA A156.27-2019 (Revolving Doors) — NOT A156.10. dormakaba KTC 3/4 carries EN 16005 European certification. Verify US A156.27 certification status with dormakaba US for large-diameter US airport installations. A156.27: max 4 RPM, breakout ≤ 130 lbf, collapsed egress ≥ 36 in.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Speed-adaptive automatic rotation control",
        standard: "EN 16005",
        notes: "Speed adapts to pedestrian flow — fast during peak, slow during off-peak.",
      },
      {
        category: "safety",
        type: "Emergency stop and collapse — wide egress path",
        standard: "EN 16005",
        notes: "6.2 m diameter collapse provides very wide straight-through emergency egress.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Large exterior revolving in HVHZ requires specific wind-load testing for the diameter. Verify.",
    },
    keySpecs: {
      "Wings": "3 or 4",
      "Diameter": "Up to 6.2 m — largest in dormakaba revolving line",
      "Traffic": "Highest capacity — airport/transit peak flow",
    },
    pmAngles: [
      {
        topic: "Large-diameter revolving door as an infrastructure product",
        insight:
          "KTC 3/4 at 6.2 m diameter is not a commercial door — it is an infrastructure element. The sales cycle is 18–36 months, involves architects, authorities, and transit operators, and is almost never a price competition (there are very few qualified suppliers globally). PM lesson: some products compete on capability and reference sites, not price.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["airport"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Up to 6.2 m diameter — largest certified revolving door available",
      "Speed-adaptive control for peak/off-peak airport flow management",
    ],
    competitiveThreats: ["aa-rd700"],
    knownLimitations: [
      "Ultra-large footprint — requires dedicated entrance hall design",
      "EN 16005 primary; verify US A156.27 for large-diameter revolving doors (NOT A156.10)",
      "18–36 month sales and installation cycle",
    ],
  },

  {
    id: "dk-ktc2",
    brand: "dormakaba",
    name: "KTC 2",
    fullName: "dormakaba KTC 2 High-Capacity 2-Wing Revolving Door",
    motion: "revolving",
    energyClass: "full-energy",
    primaryApplication: ["airports", "high-volume entrances"],
    description:
      "High-capacity 2-wing revolving door with integrated ST FLEX sliding door panel in drum wall. Night shield. EN 16005. Maximum per-rotation capacity with integrated ADA-bypass sliding door built into the drum.",
    standardCerts: [
      {
        standard: "A156.27",
        edition: "2019",
        status: "verify",
        notes: "Revolving door component governed by ANSI/BHMA A156.27-2019 (Revolving Doors) for US market. Integrated sliding panel (ST FLEX) is separately governed by A156.10-2024. dormakaba KTC 2 carries EN 16005 European certification for the revolving component. Verify US A156.27 + A156.10 dual-certification status with dormakaba US.",
      },
      {
        standard: "A156.10",
        edition: "2024",
        status: "partial",
        notes: "A156.10-2024 applies ONLY to the integrated ST FLEX sliding door panel component within the drum wall — not to the revolving door drive system, which is governed by A156.27.",
      },
    ],
    sensorSpecs: [
      {
        category: "safety",
        type: "Integrated ADA-bypass sliding door sensors + revolving door safety system",
        standard: "EN 16005 (revolving) / A156.10-2024 (sliding panel) / A156.27-2019 (US revolving)",
        notes: "Dual safety system: revolving door emergency stop/collapse per A156.27 §5 + sliding door sensor fault monitoring for integrated panel per A156.10 §8.3.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Integrated sliding door in drum requires separate verification for HVHZ applications.",
    },
    keySpecs: {
      "Wings": "2",
      "Integration": "ST FLEX sliding door built into drum wall — provides ADA-accessible bypass within the revolving door footprint",
      "Night shield": "Included",
      "Advantage": "2-wing capacity + integrated ADA bypass = one product solves both requirements",
    },
    pmAngles: [
      {
        topic: "Integrated ADA bypass as a space-planning innovation",
        insight:
          "KTC 2 integrates the ADA-accessible bypass directly into the revolving door drum wall. This eliminates the need for a separate adjacent swing or sliding door — the ADA bypass lives within the revolving door footprint. PM lesson: understanding regulatory compliance (ADA) as a product design constraint that creates innovation opportunities.",
        useIn: "both",
      },
    ],
    marketVerticals: ["airport"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Integrated ADA-bypass sliding door — eliminates separate accessible entry requirement",
      "2-wing high-capacity with group entry and luggage accommodation",
    ],
    competitiveThreats: ["aa-rd600"],
    knownLimitations: [
      "Most complex revolving product — very long sales and commissioning cycle",
      "EN 16005 primary; verify US A156.27 (revolving) + A156.10-2024 (integrated sliding panel) dual-certification scope",
    ],
  },

  {
    id: "dk-bst-fbst",
    brand: "dormakaba",
    name: "BST/FBST Curved Sliding",
    fullName: "dormakaba BST/FBST Curved Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["hotels", "airports", "hospitals"],
    description:
      "Curved sliding doors — Special Line. Half-circle, full-circle, and oval configurations. BST: max 130 kg/panel, COW 1000–2500 mm. FBST: max 110 kg/panel, German DIN 18650 type-approval for emergency/escape routes. Unique architectural statement product.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "partial",
        notes: "DIN 18650 German type-approval for FBST (escape route). US A156.10 certification — verify with dormakaba US for curved sliding configurations.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Curved-track motion sensor — custom installation",
        standard: "A156.10 §8.1",
        notes: "Sensor placement must account for curved panel travel arc — non-standard installation.",
      },
      {
        category: "safety",
        type: "Edge detection on curved leading panels",
        standard: "A156.10 §8.3",
        notes: "Curved panel edge detection requires specialized sensor configuration.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Curved sliding doors in HVHZ exterior applications require wind-load testing for the specific curved configuration. Verify.",
    },
    keySpecs: {
      "Configurations": "Half-circle, full-circle, oval",
      "BST max panel weight": "130 kg",
      "FBST max panel weight": "110 kg",
      "COW": "1000–2500 mm",
      "FBST escape route approval": "DIN 18650 German type-approval",
      "Primary markets": "Hotels (lobby feature entrances), airports, hospitals",
    },
    pmAngles: [
      {
        topic: "Curved sliding door as an architect-pull specialty product",
        insight:
          "Curved sliding doors are architect-driven — no building operator specifies a curved door for functional reasons. The architect uses it as a design statement. dormakaba is one of very few manufacturers globally that produces curved sliding doors at scale. This is a true specialty moat.",
        useIn: "strategy",
      },
      {
        topic: "DIN 18650 escape route approval as a European export advantage",
        insight:
          "FBST's DIN 18650 escape route approval is a European standard that demonstrates rigorous egress testing. While not directly a US standard, it signals product rigor to US architects who know European standards. Certification depth matters even for non-applicable standards.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["hospitality", "airport", "healthcare"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Half-circle/full-circle/oval curved sliding — unique in the market",
      "FBST DIN 18650 escape route approval — safety-certified curved sliding",
      "Architectural statement product with no direct US competitors",
    ],
    competitiveThreats: [],
    knownLimitations: [
      "No direct US A156.10 certification confirmed — verify with dormakaba",
      "Very long project coordination timeline — custom engineering per installation",
      "Ultra-premium pricing; extremely limited addressable market",
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // STANLEY ACCESS TECHNOLOGIES
  // ────────────────────────────────────────────────────────────────────────────

  {
    id: "st-dura-glide-2000",
    brand: "stanley",
    name: "Dura-Glide 2000",
    fullName: "Stanley Access Dura-Glide 2000 Automatic Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "grocery", "commercial", "big-box"],
    description:
      "The US #1 selling automatic sliding door. Most widely installed automatic slider in North American grocery and big-box retail. Partial breakout (sliding panels only). Surface or concealed mount. Highest HP motor in industry (as claimed). Panels up to 700+ lb. A156.10 certified. Deep US installed base creates strong replacement and service demand.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified. Updated to meet 30 lbf limit and current sensor fault monitoring requirements. Industry-leading installed base for this specification.",
        keyRequirements: ["30 lbf force limit", "Pre-cycle sensor fault check §8.3", "8 in. inactive zone", "50 in. AFF signage"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor — overhead",
        standard: "A156.10 §8.1",
        notes: "Standard overhead microwave. Adjustable sensitivity. Dual-sensor available for high-traffic.",
      },
      {
        category: "presence",
        type: "Overhead IR presence or safety mat",
        standard: "A156.10 §8.2",
        notes: "Presence hold-open. Mat or overhead sensor options.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each closing cycle per current A156.10.",
      },
      {
        category: "obstruction",
        type: "Kinetic reversal — force sensor",
        standard: "A156.10 §6.x",
        notes: "30 lbf max at last 10° (2024 ed.).",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      fbc9thNotes: "Dura-Glide 2000 standard configuration does not carry HVHZ NOA. For exterior FL HVHZ projects, Dura-Storm is the appropriate product.",
      notes: "Standard Dura-Glide 2000 is Florida-compliant for non-HVHZ applications. For Miami-Dade and Broward HVHZ exterior use, specify Dura-Storm 2000/3000 instead.",
    },
    keySpecs: {
      "Motor": "Highest HP in class — proprietary Stanley specification",
      "Max panel weight": "700+ lb",
      "Breakout": "Partial — sliding panels only",
      "Mounting": "Surface or concealed",
      "Installed base": "#1 in US retail/grocery — largest automatic sliding door installed base in North America",
    },
    pmAngles: [
      {
        topic: "Installed base as a service revenue moat",
        insight:
          "The Dura-Glide 2000 installed base in US retail is the largest single-product concentration in the automatic door industry. Every year, thousands of grocery and big-box stores need repairs, parts, and eventual replacement. Stanley's service revenue from this base is a durable recurring revenue stream that competitors cannot easily displace — even with a superior new product.",
        useIn: "strategy",
      },
      {
        topic: "Market share vs. innovation trade-off",
        insight:
          "The Dura-Glide 2000's market dominance has made it resistant to innovation: buyers spec it by name, GCs know how to install it, service techs know it by heart. Introducing meaningfully new features risks confusing this entrenched ecosystem. PM lesson: incumbent platforms often face lower innovation pressure — until a disruptive alternative arrives.",
        useIn: "both",
      },
    ],
    marketVerticals: ["retail", "healthcare"],
    priceRange: "mid",
    installedBase: "dominant",
    keyDifferentiators: [
      "US #1 market share in automatic sliding doors — dominant installed base",
      "Highest HP motor in class — handles heaviest panels",
      "Broadest US parts and service network for this product tier",
      "GC brand recognition — specified by name on thousands of projects",
    ],
    competitiveThreats: ["aa-sl500", "dk-esa100", "horton-2000"],
    knownLimitations: [
      "Partial breakout only — specify Dura-Glide 3000 when full breakout is required",
      "No HVHZ NOA — specify Dura-Storm for Florida HVHZ exterior applications",
      "Mature product — fewer new feature innovations vs. competitor introductions",
    ],
    flKeyNote: "No HVHZ NOA. Use Dura-Storm 2000/3000 for Miami-Dade and Broward exterior applications.",
    productUrl: "https://www.stanleyaccesstechnologies.com/",
  },

  {
    id: "st-dura-glide-3000",
    brand: "stanley",
    name: "Dura-Glide 3000",
    fullName: "Stanley Access Dura-Glide 3000 Full-Breakout Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["hospitals", "grocery", "high-traffic commercial"],
    description:
      "Full-breakout automatic sliding door. All panels break out for emergency egress. Requires track and threshold. Clean-room certified option available. A156.10 certified. Primary for hospitals, grocery, and high-traffic commercial where full egress is required.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 full breakout. All panels meet current force and sensor requirements.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3", "Full breakout egress function"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor",
        standard: "A156.10 §8.1",
        notes: "Standard overhead activation. Full breakout panels do not affect sensor placement.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + breakout panel latch monitoring",
        standard: "A156.10 §8.3",
        notes: "System monitors breakout panel latch status before allowing normal operation.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify HVHZ NOA. For exterior FL HVHZ full-breakout applications, confirm NOA availability — Dura-Storm 3000 may be the appropriate product.",
    },
    keySpecs: {
      "Breakout": "Full — all panels break out for egress",
      "Track/threshold": "Required for full breakout",
      "Clean-room option": "Available — see also dedicated SL500 Clean Room for extreme cleanroom specs",
      "Primary markets": "Hospitals, grocery chain, high-traffic commercial main entry",
    },
    pmAngles: [
      {
        topic: "Partial vs. full breakout as a specification decision",
        insight:
          "The decision between Dura-Glide 2000 (partial) and 3000 (full) is driven by the authority having jurisdiction (AHJ) reading of IBC egress requirements for the specific occupancy. Full breakout adds cost (track, threshold, panel hardware) but may be required for certain occupancies. Understanding AHJ interpretation variance by region is a key sales competency.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare", "retail"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "Full breakout — all panels egress-capable",
      "Clean-room certified option for hospital sterile applications",
      "Track/threshold design provides positive panel retention until breakout force applied",
    ],
    competitiveThreats: ["aa-sl500", "dk-esa200", "horton-9000"],
    knownLimitations: [
      "Track and threshold requirement adds installation cost vs. 2000",
      "Full breakout adds hardware complexity — more to maintain",
      "No confirmed HVHZ NOA — verify or use Dura-Storm",
    ],
    flKeyNote: "Dura-Storm 3000 is the HVHZ-rated equivalent for exterior Florida applications.",
  },

  {
    id: "st-dura-glide-ag",
    brand: "stanley",
    name: "Dura-Glide All-Glass",
    fullName: "Stanley Access Dura-Glide All-Glass Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["premium storefronts", "lobbies"],
    description:
      "Frameless all-glass panel automatic sliding door in 2000 and 3000 series configurations. 1/2 in. monolithic glass panels. A156.10 certified. Premium storefront and lobby aesthetic with Stanley's service and parts network.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024. 1/2 in. monolithic glass panels meet current requirements.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor",
        standard: "A156.10 §8.1",
        notes: "Standard overhead activation.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "1/2 in. monolithic glass not rated for HVHZ impact requirements. Use Dura-Storm with laminated/impact glass for HVHZ exterior.",
    },
    keySpecs: {
      "Glass": "1/2 in. monolithic — frameless panel appearance",
      "Series": "2000 (partial breakout) and 3000 (full breakout) configurations",
      "Primary markets": "Premium retail storefronts, corporate lobbies",
    },
    pmAngles: [
      {
        topic: "Frameless glass sliding as the aesthetic-commercial middle ground",
        insight:
          "All-glass sliding doors serve buyers who want aesthetics but cannot justify revolving door cost or footprint. They fill the premium sliding niche between standard aluminum-frame sliders and revolving doors.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "hospitality"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "1/2 in. monolithic glass — frameless premium aesthetic",
      "Stanley service network — competitive advantage vs. smaller aesthetic-sliding brands",
    ],
    competitiveThreats: ["aa-sl500", "dk-esa200"],
    knownLimitations: [
      "Monolithic glass not HVHZ-rated — use Dura-Storm for impact requirements",
      "Higher glass replacement cost vs. aluminum-frame panels",
    ],
    flKeyNote: "1/2 in. monolithic glass not impact-rated for HVHZ. Specify Dura-Storm with impact glass for Florida HVHZ exterior.",
  },

  {
    id: "st-dura-glide-gs",
    brand: "stanley",
    name: "Dura-Glide GreenStar",
    fullName: "Stanley Access Dura-Glide GreenStar Energy-Efficient Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["energy-code-critical commercial"],
    description:
      "Energy-efficient automatic sliding door variant. 61% reduction in air infiltration vs. standard 14 ft bi-part (ASTM E283 rated). LowE insulated glass option. Meets IECC energy code. A156.10 certified. Primary for LEED projects and energy-code-driven specifications.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified. Energy efficiency features do not modify operational certification.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor",
        standard: "A156.10 §8.1",
        notes: "Air-tight sealing requires proper sensor calibration to minimize unnecessary open cycles.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check required.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Energy efficiency features are not HVHZ-specific. LowE insulated glass option does not address HVHZ impact requirements. For FL HVHZ exterior, use Dura-Storm.",
    },
    keySpecs: {
      "Air infiltration reduction": "61% vs. standard 14 ft bi-part (ASTM E283)",
      "Glass option": "LowE insulated — thermal improvement",
      "Code": "Meets IECC energy code",
      "LEED applicability": "Contributes to energy efficiency credits",
    },
    pmAngles: [
      {
        topic: "Energy code compliance as a market segment driver",
        insight:
          "IECC and ASHRAE 90.1 mandate maximum air infiltration rates for commercial building envelopes. GreenStar directly addresses this code provision. PM lesson: building energy codes create new product segments when they mandate performance characteristics that standard products cannot meet.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["retail", "healthcare", "education"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "61% air infiltration reduction vs. standard bi-part (ASTM E283 tested)",
      "LowE insulated glass option — code-compliant thermal performance",
      "IECC/ASHRAE 90.1 compliance documentation for LEED submissions",
    ],
    competitiveThreats: ["aa-sl500", "dk-esa100"],
    knownLimitations: [
      "No HVHZ NOA — use Dura-Storm for Florida impact requirements",
      "LowE glass increases cost vs. standard glass panel",
    ],
    flKeyNote: "Energy-efficient sealing not applicable for HVHZ. Use Dura-Storm for exterior Florida HVHZ applications.",
  },

  {
    id: "st-dura-glide-tele",
    brand: "stanley",
    name: "Dura-Glide Telescopic 5200/5300",
    fullName: "Stanley Access Dura-Glide Telescopic 5200/5300 Sliding Door",
    motion: "telescoping",
    energyClass: "full-energy",
    primaryApplication: ["hospitals", "airports", "large retail"],
    description:
      "Extra-wide telescoping automatic sliding door. 5200 series: partial breakout. 5300 series: full breakout. Frame widths 84–144 in. Clean-room certified option. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 for extra-wide telescoping. All panel edges meet 30 lbf limit and sensor requirements.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Wide-angle microwave sensor array",
        standard: "A156.10 §8.1",
        notes: "Multiple sensors for 84–144 in. COW coverage.",
      },
      {
        category: "safety",
        type: "Edge detection array — all telescoping panel leading edges",
        standard: "A156.10 §8.3",
        notes: "Full edge coverage on all stacking panels plus inter-panel pinch detection.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Extra-wide telescoping in FL HVHZ exterior requires specific NOA. Verify.",
    },
    keySpecs: {
      "Frame widths": "84–144 in.",
      "5200": "Partial breakout",
      "5300": "Full breakout",
      "Clean-room option": "Available",
      "Primary markets": "Hospitals (OR/ICU main entry), airports, large-format retail",
    },
    pmAngles: [
      {
        topic: "144 in. frame width as a hospital main entry specification",
        insight:
          "Hospital main entries increasingly spec 144 in. clear to accommodate bariatric transport equipment and emergency scenarios. The 5300 (full breakout at 144 in.) is specified for life-safety compliance. PM framing: regulatory and operational requirements in healthcare create demand for extreme-specification products.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare", "airport", "retail"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "84–144 in. frame widths — widest standard telescoping in Stanley line",
      "5300 full breakout at max width — healthcare and airport egress compliance",
      "Clean-room certified option for hospital sterile processing",
    ],
    competitiveThreats: ["aa-sl521", "dk-esa300t", "dk-esa500"],
    knownLimitations: [
      "No HVHZ NOA for extra-wide exterior",
      "Header pocket depth requirement increases with panel count",
    ],
  },

  {
    id: "st-dura-fit",
    brand: "stanley",
    name: "Dura-Fit",
    fullName: "Stanley Access Dura-Fit Narrow Telescoping Sliding Door",
    motion: "telescoping",
    energyClass: "full-energy",
    primaryApplication: ["tight rough openings", "retrofit"],
    description:
      "Narrow telescoping sliding door for constrained rough openings. Reinforced construction for retrofit applications where standard telescoping operators cannot fit. A156.10 certified.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 for narrow telescoping configuration.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Compact microwave sensor",
        standard: "A156.10 §8.1",
        notes: "Compact sensor for tight header installation.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Retrofit product — verify HVHZ requirements for specific project location.",
    },
    keySpecs: {
      "Purpose": "Tight rough openings and retrofit",
      "Construction": "Reinforced for constrained opening conditions",
      "Certification": "A156.10 telescoping",
    },
    pmAngles: [
      {
        topic: "Retrofit-first product as a service channel play",
        insight:
          "Dura-Fit reaches customers who cannot install standard products due to existing building constraints. It is sold primarily through the service/retrofit channel, not new construction. PM lesson: retrofit products often have higher margin and less competition than new-construction equivalents.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["retail", "healthcare"],
    priceRange: "mid",
    installedBase: "niche",
    keyDifferentiators: [
      "Fits constrained rough openings where standard telescoping cannot install",
      "Reinforced construction for complex retrofit conditions",
    ],
    competitiveThreats: ["aa-sl521"],
    knownLimitations: [
      "Limited to retrofit/constrained applications — not a first-choice new-construction product",
      "No HVHZ NOA",
    ],
  },

  {
    id: "st-dura-guard",
    brand: "stanley",
    name: "Dura-Guard 2000/3000",
    fullName: "Stanley Access Dura-Guard Heavy-Duty Rugged Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["industrial", "high-abuse environments"],
    description:
      "Heavy-duty rugged version of the Dura-Glide platform. Lower repair costs and rugged construction for industrial and high-abuse environments. A156.10 certified. Designed for forklift-adjacent, high-impact, and harsh-environment applications.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for industrial heavy-duty configuration.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Heavy-duty microwave sensor — impact-resistant housing",
        standard: "A156.10 §8.1",
        notes: "Sensor housing rated for industrial environment — vibration, dust, moisture resistant.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check. Industrial environment requires more frequent sensor cleaning.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Industrial interior use typical. Verify HVHZ for any exterior industrial FL application.",
    },
    keySpecs: {
      "Construction": "Rugged/heavy-duty — impact-resistant components",
      "Repair costs": "Designed for lower repair cost in high-abuse environments",
      "Certifications": "A156.10",
      "Primary markets": "Manufacturing facilities, distribution centers, food processing, industrial buildings",
    },
    pmAngles: [
      {
        topic: "Industrial doors as a TCO (total cost of ownership) sale",
        insight:
          "Dura-Guard's primary value proposition is lower lifecycle cost in high-abuse environments. The upfront price premium is justified by fewer repairs and longer component life. PM lesson: TCO arguments require quantification — service call frequency × cost is the right metric to present.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["industrial"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "Rugged construction designed for forklift-adjacent and high-impact environments",
      "Lower lifecycle repair costs vs. standard Dura-Glide in industrial use",
    ],
    competitiveThreats: ["horton-9000"],
    knownLimitations: [
      "Not appropriate for aesthetic applications",
      "No HVHZ NOA",
    ],
  },

  {
    id: "st-dura-storm",
    brand: "stanley",
    name: "Dura-Storm 2000/3000",
    fullName: "Stanley Access Dura-Storm Hurricane-Rated Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["Florida", "Gulf Coast", "hurricane zones"],
    description:
      "Hurricane-rated automatic sliding door. Impact Level D and E rated. Non-impact and impact glass options: 1/4 in. monolithic, 1 in. insulated, 9/16 in. laminated. Wind pressure tested. A156.10 + ASTM E1996/E1886 impact certified. Stanley's HVHZ-capable exterior product.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for impact-rated configuration. All force, sensor, and signage requirements met.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3", "Impact-rated hardware components"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Impact-resistant microwave sensor",
        standard: "A156.10 §8.1",
        notes: "Sensor housing and mounting rated for impact zone installation.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check with impact-resistant sensor components.",
      },
    ],
    floridaApproval: {
      status: "hvhz-listed",
      testStandards: ["ASTM E1996", "ASTM E1886", "TAS 201", "TAS 202", "TAS 203"],
      hvhz: true,
      fbc9thNotes: "FBC 9th Ed. 160 mph mandate (HB 911 eff. Dec 2026) — verify Dura-Storm HVHZ rating covers 160 mph or confirm re-test timeline with Stanley.",
      notes: "Dura-Storm is Stanley's HVHZ exterior product. ASTM E1996/E1886 and TAS tested. Impact Level D and E ratings. Permanent impact label required. 9/16 in. laminated glass option provides highest impact protection.",
    },
    keySpecs: {
      "Impact ratings": "Level D and E",
      "Glass options": "1/4 in. monolithic (non-impact), 1 in. insulated, 9/16 in. laminated (highest impact)",
      "Testing": "ASTM E1996, ASTM E1886, TAS 201/202/203",
      "Series": "2000 (partial breakout) and 3000 (full breakout)",
      "Primary markets": "Florida exterior, Gulf Coast, Texas coast, Caribbean",
    },
    pmAngles: [
      {
        topic: "Dura-Storm as Stanley's Florida market access product",
        insight:
          "Without Dura-Storm, Stanley cannot compete for exterior Miami-Dade and Broward projects. Dura-Storm is the product that allows Stanley to defend its retail client relationships in Florida, where clients often upgrade from standard to hurricane-rated for exterior doors. Impact certification is a market-access requirement, not a premium.",
        useIn: "strategy",
      },
      {
        topic: "Glass selection as a cost vs. protection trade-off",
        insight:
          "1/4 in. monolithic (cheapest, non-impact), 1 in. insulated (energy + moderate impact), and 9/16 in. laminated (highest impact rating) create a three-tier glass selection for hurricane resistance. Specifiers and building owners navigate this trade-off on every coastal project.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "healthcare"],
    priceRange: "premium",
    installedBase: "strong",
    keyDifferentiators: [
      "Impact Level D and E rated — covers most extreme HVHZ exterior requirements",
      "Three glass options match different impact and thermal performance needs",
      "ASTM E1996/E1886 + TAS tested — full HVHZ documentation package",
      "Stanley service network in Florida to support post-storm inspection/repair",
    ],
    competitiveThreats: ["aa-sl500"],
    knownLimitations: [
      "Higher cost than standard Dura-Glide — must be budget-justified for exterior FL use",
      "Verify 160 mph coverage for FBC 9th Ed. transition in 2026",
    ],
    flKeyNote: "Primary HVHZ product for Stanley in Florida. Impact Level D and E. Verify 160 mph FBC 9th Ed. rating before specifying for post-2026 permit applications.",
  },

  {
    id: "st-dura-shield",
    brand: "stanley",
    name: "Dura-Shield Blast",
    fullName: "Stanley Access Dura-Shield Blast-Resistant Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["government", "military", "secure facilities"],
    description:
      "Blast-resistant automatic sliding door. Single slide 96–120 in. Primary for government, military, and secure facility applications requiring forced-entry and blast protection.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 compliant. Blast-resistance testing is separate from ANSI/BHMA certification (DoD or GSA blast standards apply).",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Access-controlled activation — card/biometric",
        standard: "A156.10 §8.1",
        notes: "Blast-rated doors typically use controlled activation rather than open-approach motion sensing.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Standard pre-cycle fault check maintained alongside blast-resistance features.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Blast-rated exterior doors in FL HVHZ may require additional wind-load certification beyond blast testing. Verify for specific project.",
    },
    keySpecs: {
      "Blast resistance": "Forced-entry and blast-resistant construction",
      "Width": "Single slide 96–120 in.",
      "Primary markets": "Federal buildings, embassies, military facilities, data centers, pharmaceutical secure areas",
    },
    pmAngles: [
      {
        topic: "Blast doors as a government-spec niche with DoD procurement complexity",
        insight:
          "Blast-resistant automatic sliding doors are specified through government procurement channels (GSA, DoD) with complex testing and certification requirements beyond standard ANSI/BHMA. PM lesson: government market product requirements are often dictated by procurement regulations, not just end-user functional needs.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["government"],
    priceRange: "ultra-premium",
    installedBase: "niche",
    keyDifferentiators: [
      "Automatic sliding door with blast and forced-entry resistance",
      "96–120 in. single-slide format for government entrance applications",
    ],
    competitiveThreats: [],
    knownLimitations: [
      "Very small addressable market — government/military procurement only",
      "Long sales and approval cycle",
      "No HVHZ NOA — verify for any Florida exterior government application",
    ],
  },

  {
    id: "st-dura-glide-dt",
    brand: "stanley",
    name: "Dura-Glide DT",
    fullName: "Stanley Access Dura-Glide DT Drive-Thru Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["QSR", "drive-thru restaurants"],
    description:
      "Drive-thru door and window dual-mode automatic door system. 32 in. clear door opening. Stainless steel construction with vinyl seals. Solenoid locks. A156.10 certified. Designed for QSR (quick service restaurant) drive-thru window efficiency.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for drive-thru sliding door configuration.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Solenoid-controlled activation — staff-triggered",
        standard: "A156.10 §8.1",
        notes: "Staff-controlled opening for drive-thru window transaction. Motion-sensor override available.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Drive-thru windows are typically interior-facing or have vehicle/canopy protection. Verify HVHZ for any exposed exterior drive-thru installation in FL.",
    },
    keySpecs: {
      "Clear opening": "32 in.",
      "Construction": "Stainless steel + vinyl seals — food service grade",
      "Locking": "Solenoid lock — staff-controlled",
      "Dual mode": "Drive-thru door and window functionality",
      "Primary markets": "McDonald's, Burger King, Wendy's, QSR chains; pharmacy drive-thru",
    },
    pmAngles: [
      {
        topic: "QSR drive-thru as a high-volume replacement market",
        insight:
          "QSR drive-thru windows are among the highest-cycle automatic door installations in existence — some see 500+ transactions/hour at peak. This creates rapid wear and frequent replacement demand. Stanley's Dura-Glide DT and Horton's S8000 compete for this replacement market with dedicated products.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["qsr"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "Stainless steel + vinyl seals — food-service grade durability",
      "Solenoid lock enables staff transaction control",
      "32 in. COW optimized for drive-thru window opening",
    ],
    competitiveThreats: ["horton-s8000"],
    knownLimitations: [
      "Application-specific — not a general commercial product",
      "Limited to QSR and pharmacy drive-thru market",
    ],
  },

  {
    id: "st-industrial-10k",
    brand: "stanley",
    name: "Industrial Slider 10,000",
    fullName: "Stanley Access Industrial Sliding Door 10,000",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["warehouses", "manufacturing"],
    description:
      "Heavy-duty industrial automatic sliding door. Panels up to 10 ft. Designed for warehouse, manufacturing, and industrial facility applications with large vehicle or equipment passage requirements.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 for heavy industrial sliding door configuration.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Industrial loop detector or heavy-duty motion sensor",
        standard: "A156.10 §8.1",
        notes: "Vehicle loop detection or heavy-duty motion sensor for industrial traffic.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + heavy-duty obstruction detection",
        standard: "A156.10 §8.3",
        notes: "Industrial grade obstruction detection — must handle fork truck passes without false trips.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Industrial interior use typical. Verify for any exterior FL HVHZ industrial application.",
    },
    keySpecs: {
      "Panel height": "Up to 10 ft",
      "Duty": "Heavy industrial",
      "Primary markets": "Warehouses, distribution centers, manufacturing plants",
    },
    pmAngles: [
      {
        topic: "Industrial automatic doors as a safety-critical compliance product",
        insight:
          "OSHA and state safety codes require automatic closure for temperature-controlled warehouse dock doors. The industrial automatic door market is driven as much by safety compliance as by convenience — a regulatory pull, not just a feature preference.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["industrial"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "10 ft panel height — covers large vehicle passage requirements",
      "Industrial-grade components designed for forklift-adjacent environments",
    ],
    competitiveThreats: ["horton-9000"],
    knownLimitations: [
      "Not suitable for aesthetic commercial applications",
      "No HVHZ NOA",
    ],
  },

  {
    id: "st-magic-access",
    brand: "stanley",
    name: "Magic-Access",
    fullName: "Stanley Access Magic-Access Low-Energy Swing Door",
    motion: "swing",
    energyClass: "low-energy",
    primaryApplication: ["ADA retrofit", "light commercial"],
    description:
      "Low-energy swing operator. Doors up to 42 in. wide and 125 lb. Push plate, wave sensor, or mat activation. 1/8 HP DC motor. UL listed. A156.19 certified. Economy ADA compliance product.",
    standardCerts: [
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "A156.19-2019. AUTOMATIC CAUTION DOOR signage required.",
        keyRequirements: ["AUTOMATIC CAUTION DOOR sign", "Max 15 lbf", "Max 5 lbf in-motion"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push plate, wave sensor, or floor mat",
        standard: "A156.19",
        notes: "Multiple activation options for ADA path of travel.",
      },
      {
        category: "safety",
        type: "Slow-speed force limitation",
        standard: "A156.19",
        notes: "1/8 HP motor at low speed limits contact force to safe levels.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior/non-HVHZ. For HVHZ exterior swing, use full-energy A156.10 product with NOA.",
    },
    keySpecs: {
      "Max door width": "42 in.",
      "Max door weight": "125 lb",
      "Motor": "1/8 HP DC",
      "UL listed": "Yes",
      "Certification": "A156.19",
      "Primary markets": "ADA accessible entrances, interior doors, light commercial",
    },
    pmAngles: [
      {
        topic: "UL listing as a spec requirement in certain jurisdictions",
        insight:
          "Some AHJs specifically require UL listing for automatic doors in addition to ANSI/BHMA certification. Magic-Access UL listing is a spec-win capability in those jurisdictions. PM lesson: product approvals from different bodies (ANSI, UL, ICC) can each unlock different market segments.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "healthcare", "education"],
    priceRange: "economy",
    installedBase: "strong",
    keyDifferentiators: [
      "UL listed — meets AHJ requirements that specify UL",
      "Economy price point for ADA retrofit",
      "Multiple activation options: push plate, wave, mat",
    ],
    competitiveThreats: ["aa-sw60", "aa-sw100", "dk-ed50", "horton-4000"],
    knownLimitations: [
      "42 in. max width — not suitable for wider doors",
      "125 lb max — light-duty only",
      "Requires AUTOMATIC CAUTION DOOR signage",
    ],
  },

  {
    id: "st-magic-force",
    brand: "stanley",
    name: "Magic-Force",
    fullName: "Stanley Access Magic-Force Full/Low-Energy Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["healthcare", "retail", "commercial"],
    description:
      "Full/low-energy field-selectable swing operator. Doors up to 48 in. wide and 350 lb. A156.10 (full) and A156.19 (low-energy) — field selectable. Encoder technology for precision control. Non-handed (installs push or pull side). ICC ESR-1751 listed.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 full-energy. Field-selectable to A156.19 low-energy. Single product covers both specifications.",
        keyRequirements: ["30 lbf force limit (full-energy mode)", "Sensor fault monitoring §8.3"],
      },
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "Field-selectable low-energy mode. AUTOMATIC CAUTION DOOR signage required when in A156.19 mode.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push-plate, wave, or motion sensor (mode-dependent)",
        standard: "A156.10 §8.1 / A156.19",
        notes: "Activation method depends on selected energy mode.",
      },
      {
        category: "presence",
        type: "Overhead presence — full swing arc",
        standard: "A156.10 §8.2",
        notes: "Required for full-energy mode.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + encoder feedback",
        standard: "A156.10 §8.3",
        notes: "Encoder provides precise position and force feedback for improved safety control.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify HVHZ NOA for exterior swing applications in FL.",
    },
    keySpecs: {
      "Max door width": "48 in.",
      "Max door weight": "350 lb",
      "Energy mode": "Field-selectable: full-energy (A156.10) or low-energy (A156.19)",
      "Control": "Encoder technology for precision position/force control",
      "Handed": "Non-handed — single SKU for push or pull installation",
      "ICC listing": "ESR-1751",
    },
    pmAngles: [
      {
        topic: "Field-selectable energy mode as an inventory simplification strategy",
        insight:
          "Magic-Force's field-selectable A156.10/A156.19 mode means distributors and contractors stock one SKU that covers two certification requirements. This dramatically simplifies inventory and reduces order errors. PM lesson: product platform decisions that reduce supply chain complexity can be as valuable as performance features.",
        useIn: "strategy",
      },
      {
        topic: "Non-handed design as an installation quality-of-life feature",
        insight:
          "Non-handed operators eliminate the risk of ordering the wrong handed unit for a push vs. pull door. This reduces job site errors and return-and-replace service calls. Simple design decision with significant field service impact.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare", "retail"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "Field-selectable A156.10/A156.19 — one product covers two certification tiers",
      "Non-handed — single SKU for push or pull installation",
      "ICC ESR-1751 listed — some jurisdictions require this",
      "Encoder technology for precision force and position control",
    ],
    competitiveThreats: ["aa-sw300", "aa-sw200i-surface", "dk-ed100", "dk-ed250"],
    knownLimitations: [
      "350 lb max — not suitable for heavy lead-lined or acoustic doors (use M-Force)",
      "48 in. max width limitation",
      "No confirmed HVHZ NOA for exterior",
    ],
  },

  {
    id: "st-m-force",
    brand: "stanley",
    name: "M-Force",
    fullName: "Stanley Access M-Force High-Performance Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["tall retail", "high-rise", "hospital lead-lined/acoustic doors"],
    description:
      "New high-performance swing operator. Replaces Magic-Force in the heavy-door segment. Handles panels up to 700 lb. Full and low-energy (A156.10/A156.19). iQ Controller with power assist technology — eliminates motor resistance in manual mode so door opens naturally. Wind/stack pressure compensation. Primary for tall retail, high-rise entrance, and heavy hospital door applications.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 full-energy for 700 lb door capacity. Wind/stack compensation and iQ Controller for precise force control.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3", "Power assist in manual mode"],
      },
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "Low-energy mode available. Field selectable.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Motion sensor, push-plate, or wave (iQ Controller configurable)",
        standard: "A156.10 §8.1",
        notes: "iQ Controller provides digital configuration of activation modes.",
      },
      {
        category: "presence",
        type: "Overhead presence — full swing arc",
        standard: "A156.10 §8.2",
        notes: "Required for full-energy mode on 700 lb door.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + power assist (manual mode zero resistance)",
        standard: "A156.10 §8.3",
        notes: "Power assist technology ensures no motor resistance in manual mode — critical safety feature for heavy doors.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify HVHZ NOA for exterior high-rise swing door applications in FL.",
    },
    keySpecs: {
      "Max door weight": "700 lb — highest capacity swing operator in Stanley line",
      "Controller": "iQ Controller — digital configuration and monitoring",
      "Power assist": "Zero motor resistance in manual mode",
      "Wind/stack compensation": "Included",
      "Energy mode": "Full-energy (A156.10) and low-energy (A156.19) — field selectable",
      "Applications": "Heavy lead-lined hospital doors, acoustic doors, tall retail, high-rise lobbies",
    },
    pmAngles: [
      {
        topic: "700 lb capacity as a hospital lead-lined door specification",
        insight:
          "Hospital radiation suites and nuclear medicine departments use lead-lined swing doors that can weigh 400–700+ lb. These doors require full-energy operators capable of handling the weight without stalling — a very specific, low-volume, high-margin niche that M-Force directly targets.",
        useIn: "strategy",
      },
      {
        topic: "Power assist in manual mode as a safety feature, not just a convenience",
        insight:
          "iQ Controller's power assist (zero motor resistance in manual mode) is critical for emergency manual operation of 700 lb doors. If the power operator fails and the door motor adds resistance, emergency egress is compromised. This is a safety-critical design requirement, not a user experience nicety.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare", "retail", "hospitality"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "700 lb door capacity — highest in the US swing operator market",
      "Power assist technology — zero motor resistance in manual mode (critical for heavy door safety)",
      "iQ Controller digital configuration — simplifies commissioning and diagnostics",
      "Wind/stack compensation — handles high-rise building pressures",
    ],
    competitiveThreats: ["aa-sw300", "aa-sw200i-surface", "dk-ed250"],
    knownLimitations: [
      "Premium pricing — must be justified for projects requiring 700 lb capacity",
      "No HVHZ NOA confirmed for exterior applications",
      "New product — shorter track record than Magic-Force",
    ],
  },

  {
    id: "st-procare-8300",
    brand: "stanley",
    name: "ProCare 8300/8300A",
    fullName: "Stanley Access ProCare 8300 Manual and Automatic ICU Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["ICU", "hospital corridors"],
    description:
      "Manual and automatic ICU sliding doors. Breakout function. Touchless activation option. Designed for ICU, hospital corridor, and patient room applications. Meets FGI healthcare facility design guidelines.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 for automatic (8300A) configuration. Manual 8300 variant meets dimensional and material requirements.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Touchless wave sensor or foot pedal",
        standard: "A156.10 §8.1",
        notes: "No-touch activation required for infection control in ICU environments.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + breakout emergency egress",
        standard: "A156.10 §8.3",
        notes: "Breakout must function without power for emergency patient evacuation.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior hospital use. NOA not typically applicable.",
    },
    keySpecs: {
      "Configuration": "Manual (8300) and Automatic (8300A)",
      "Breakout": "Emergency breakout for patient evacuation",
      "Touchless option": "Available — wave sensor or foot pedal",
      "Compliance": "FGI Guidelines for healthcare facility design",
    },
    pmAngles: [
      {
        topic: "ICU door as a life-safety regulatory product",
        insight:
          "FGI Guidelines and NFPA 101 Life Safety Code impose specific requirements on ICU/CCU sliding doors (clear width, breakout force, materials). These are regulatory requirements, not preferences. The hospital cannot choose not to comply — making ProCare's specification less price-sensitive than commercial doors.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["healthcare"],
    priceRange: "premium",
    installedBase: "strong",
    keyDifferentiators: [
      "Purpose-built for ICU/hospital corridor — FGI Guideline compliance",
      "Touchless activation — infection control compliant",
      "Emergency breakout for patient evacuation code compliance",
    ],
    competitiveThreats: ["aa-versaMax", "horton-icu-2000"],
    knownLimitations: [
      "Healthcare-only vertical — premium pricing not justified for commercial use",
      "Requires healthcare-familiar specifier and installer",
    ],
  },

  {
    id: "st-procare-8300bp",
    brand: "stanley",
    name: "ProCare 8300BP",
    fullName: "Stanley Access ProCare 8300BP Bi-Part ICU Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["hospital corridors"],
    description:
      "Bi-part ICU/hospital sliding door. Space-saving bi-parting configuration for hospital corridor applications where full single-panel swing clearance is not available.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 bi-parting configuration for hospital corridor.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Touchless wave sensor or foot pedal",
        standard: "A156.10 §8.1",
        notes: "Infection-control compliant activation.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior hospital. NOA not applicable.",
    },
    keySpecs: {
      "Configuration": "Bi-parting — both panels slide for maximum COW",
      "Space requirement": "Minimal swing clearance needed",
      "Primary markets": "Hospital corridors, nursing station doors, patient room ante-rooms",
    },
    pmAngles: [
      {
        topic: "Bi-part hospital doors as an architectural constraint solution",
        insight:
          "Hospital corridor widths and adjacent room layouts sometimes prohibit full single-panel sliding systems. Bi-part 8300BP solves the opening width constraint while meeting FGI clear opening requirements. Understanding how architectural constraints drive product choice is a key healthcare sales skill.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "Bi-part configuration for constrained hospital corridor geometry",
      "Same infection-control touchless activation as ProCare 8300",
    ],
    competitiveThreats: ["aa-versaMax", "horton-icu-2000"],
    knownLimitations: [
      "Healthcare vertical only",
      "Bi-part reduces maximum COW vs. single-panel telescoping",
    ],
  },

  {
    id: "st-dura-care-7500",
    brand: "stanley",
    name: "Dura-Care 7500A/TL",
    fullName: "Stanley Access Dura-Care 7500A/TL Telescoping ICU Sliding Door",
    motion: "telescoping",
    energyClass: "full-energy",
    primaryApplication: ["healthcare", "ICU"],
    description:
      "Telescoping ICU sliding door with breakout. Minimal swing footprint. Provides maximum clear opening for patient transport equipment while minimizing corridor obstruction when open.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 telescoping with breakout for healthcare application.",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Touchless activation (wave/foot pedal)",
        standard: "A156.10 §8.1",
        notes: "Infection-control compliant activation.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + breakout function",
        standard: "A156.10 §8.3",
        notes: "Breakout for emergency evacuation. Telescoping panel edge detection required.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Interior healthcare. NOA not applicable.",
    },
    keySpecs: {
      "Configuration": "Telescoping ICU with breakout",
      "Benefit": "Maximum COW with minimum open-position corridor obstruction",
      "Primary markets": "ICU, OR, patient transport corridors",
    },
    pmAngles: [
      {
        topic: "Telescoping as the ICU premium spec",
        insight:
          "For ICU rooms where both maximum clear opening and minimum corridor obstruction are required simultaneously, telescoping sliding is the only solution. The panel stacks behind itself rather than sliding far into the corridor. This is a functional requirement, not a feature preference.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["healthcare"],
    priceRange: "premium",
    installedBase: "moderate",
    keyDifferentiators: [
      "Telescoping in healthcare: maximum COW with minimum corridor obstruction",
      "Breakout emergency egress for hospital life-safety compliance",
    ],
    competitiveThreats: ["aa-versaMax", "dk-esa300t"],
    knownLimitations: [
      "Healthcare vertical only",
      "Higher complexity and cost vs. standard bi-parting hospital sliding",
    ],
  },

  {
    id: "st-magic-swing",
    brand: "stanley",
    name: "Magic-Swing (Bifold)",
    fullName: "Stanley Access Magic-Swing Automatic Folding Door",
    motion: "folding",
    energyClass: "full-energy",
    primaryApplication: ["high-traffic bi-directional"],
    description:
      "Automatic folding (bifold) door. 2- and 4-panel configurations. Opening widths 4–10 ft. Height 7.5–9 ft. Max 40 lbf emergency release force. A156.10 certified. Primary for high-traffic bi-directional applications where bi-fold maximizes opening while minimizing footprint.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 for full-energy automatic folding door. Emergency release force ≤40 lbf per code.",
        keyRequirements: ["40 lbf emergency release force limit", "Sensor coverage for fold arc", "Fault monitoring §8.3"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Motion sensor — ingress and egress sides",
        standard: "A156.10 §8.1",
        notes: "Bi-directional activation for two-way traffic.",
      },
      {
        category: "presence",
        type: "Presence sensor — covers folding panel arc",
        standard: "A156.10 §8.2",
        notes: "Sensor must cover collapsing panel path.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + fold-arc edge detection",
        standard: "A156.10 §8.3",
        notes: "Panel fold creates pinch-point risk at hinge. Edge detection on each panel recommended.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Folding door exterior HVHZ use requires specific NOA. Verify.",
    },
    keySpecs: {
      "Panels": "2 or 4",
      "Opening width": "4–10 ft",
      "Height range": "7.5–9 ft",
      "Emergency release": "≤40 lbf",
      "Primary markets": "High-traffic bi-directional: retail, food service, commercial",
    },
    pmAngles: [
      {
        topic: "Folding door as a space-optimization play",
        insight:
          "Automatic folding doors provide maximum clear opening with minimum footprint — the folding panels collapse into a compact stack. This is valuable where swing arc and sliding pocket space are both constrained. PM lesson: understanding geometric constraints in architecture drives product selection.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "industrial"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "Bi-directional traffic capability",
      "4–10 ft opening range in folding format",
      "40 lbf emergency release — code-compliant egress",
    ],
    competitiveThreats: ["dk-bst-fbst", "horton-4200-bifold"],
    knownLimitations: [
      "Pinch hazard at fold hinge requires careful sensor placement",
      "Opening speeds slower than sliding doors",
      "Not suitable for HVHZ exterior without NOA verification",
    ],
  },

  // ─── Stanley — Magic-Force Bifold ──────────────────────────────────────────

  {
    id: "st-magic-force-bifold",
    brand: "stanley",
    name: "Magic-Force Bifold",
    fullName: "Stanley Access Magic-Force Bifold Automatic Folding Door",
    motion: "folding",
    energyClass: "full-energy",
    primaryApplication: ["large commercial openings", "retail", "grocery"],
    description:
      "Automatic bifold door using the M-Force operator platform. Handles larger, heavier panels than the Magic-Swing. A156.10 certified. Suited for wide commercial openings where standard sliding pockets are not feasible.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "Full-energy A156.10-2024 certification. M-Force operator with bifold attachment.",
        keyRequirements: ["Sensor fault monitoring §8.3", "Force limits at last 10 deg", "Emergency egress release ≤40 lbf"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Motion sensor — bi-directional overhead",
        standard: "A156.10 §8.1",
        notes: "Overhead microwave sensors, ingress and egress.",
      },
      {
        category: "presence",
        type: "Presence sensor — fold arc coverage",
        standard: "A156.10 §8.2",
        notes: "Covers the full fold sweep path.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Pre-cycle check per 2024 requirements.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Exterior HVHZ use: verify NOA. Interior/non-HVHZ: FBC compliant.",
    },
    keySpecs: {
      "Operator": "M-Force platform",
      "Panels": "2 or 4",
      "Max panel weight": "Higher than Magic-Swing due to M-Force motor",
      "Opening width": "Up to ~12 ft",
      "Primary markets": "Large commercial openings, grocery",
    },
    pmAngles: [
      {
        topic: "Platform reuse — M-Force as a base operator",
        insight:
          "Stanley leverages the M-Force operator across swing, bifold, and specialty configurations. This platform strategy reduces R&D cost while extending addressable market. PM lesson: evaluate how a core mechanical platform can serve multiple door motion types.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["retail", "industrial"],
    priceRange: "mid",
    installedBase: "niche",
    keyDifferentiators: [
      "M-Force operator handles heavier panels than Magic-Swing",
      "Platform leverage from Stanley's M-Force investment",
      "Full-energy A156.10 with folding configuration",
    ],
    competitiveThreats: ["dk-bst-fbst", "horton-4200-bifold", "aa-ens-fold"],
    knownLimitations: [
      "Niche application; limited install base vs. sliding",
      "Pinch-point hazard requires robust sensor configuration",
      "Higher cost vs. standard sliding for same clear opening",
    ],
  },

  // ─── Stanley — Windcord 5400 (Windload Sliding Door, FL-certified) ──────────

  {
    id: "st-windcord-5400",
    brand: "stanley",
    name: "Windcord 5400",
    fullName: "Stanley Access Windcord 5400 Windload Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "commercial", "airport", "healthcare", "Florida HVHZ exterior"],
    description:
      "Stanley Access Windcord 5400 automatic sliding door with windload and HVHZ certification. FL Statewide Product Approval FL41647 (active Feb 2025) with HVHZ designation. Miami-Dade NOA 21-0630.07 expired March 2025 — valid HVHZ compliance path via FL41647. Tested to TAS 201/202/203. Designed for exterior applications in Florida's High-Velocity Hurricane Zone.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for power-operated automatic sliding door. Full force, sensor, and signage compliance.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Pre-cycle sensor fault check §8.3",
          "Presence sensor 8 in. inactive zone",
          "50 in. AFF signage",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor — overhead mount",
        standard: "A156.10 §8.1",
        notes: "Standard overhead microwave activation. Adjustable for HVHZ lobby configurations.",
      },
      {
        category: "presence",
        type: "Overhead IR presence sensor",
        standard: "A156.10 §8.2",
        notes: "Holds door open while occupant detected. Required for power-operated configuration.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each closing cycle.",
      },
    ],
    floridaApproval: {
      status: "hvhz-listed",
      noaNumber: "FL41647 (Statewide, active Feb 2025) | Miami-Dade NOA 21-0630.07 EXPIRED March 2025",
      testStandards: ["TAS 201", "TAS 202", "TAS 203"],
      designPressure: "Per FL41647 statewide approval — verify for project-specific DP",
      hvhz: true,
      fbc9thNotes:
        "FBC 9th Edition takes effect Dec 31, 2026. Permits issued on/after that date must reference 9th Edition cycle approvals.",
      notes:
        "FL Statewide Product Approval FL41647 (Feb 2025) active with HVHZ designation. Miami-Dade NOA 21-0630.07 expired March 2025 — confirm renewal status. Valid HVHZ compliance path available via FL41647.",
    },
    keySpecs: {
      "Application": "Florida HVHZ exterior windload sliding door",
      "Florida approval": "FL41647 (Statewide, active) — HVHZ designated",
      "Miami-Dade NOA": "21-0630.07 EXPIRED March 2025 — confirm renewal",
      "Test standards": "TAS 201/202/203",
      "HVHZ": "Yes — via FL41647",
    },
    pmAngles: [
      {
        topic: "NOA expiry vs. statewide approval path",
        insight:
          "The Windcord 5400 illustrates a common Florida compliance complexity: a local Miami-Dade NOA can expire while a statewide FL product approval (FL41647) remains active and provides an independent HVHZ compliance path. PM angle: understanding the two-track Florida approval system (local NOA vs. FL statewide) is essential for specifying exterior products in HVHZ zones.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["retail", "healthcare", "airport", "government"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "FL Statewide Approval FL41647 (Feb 2025) with HVHZ designation — active compliance path",
      "Impact-rated for Florida HVHZ exterior sliding applications",
      "TAS 201/202/203 tested",
    ],
    competitiveThreats: ["sl500_r104", "st-dura-storm"],
    knownLimitations: [
      "Miami-Dade NOA 21-0630.07 expired March 2025 — confirm renewal status before specifying as primary NOA basis",
      "FL41647 is the active HVHZ compliance path — verify project AHJ accepts statewide approval",
      "NOA renewal timing may create procurement uncertainty",
    ],
    flKeyNote: "HVHZ listed via FL41647 (Feb 2025). Miami-Dade NOA 21-0630.07 expired March 2025 — verify renewal. Valid HVHZ path available via statewide approval.",
    sensorCompatibility: ["Microwave motion", "IR presence", "Pre-cycle fault monitor"],
  },

  // ─── Stanley — Windcord 5500 (Non-Impact Windload, Non-HVHZ) ─────────────

  {
    id: "st-windcord-5500",
    brand: "stanley",
    name: "Windcord 5500",
    fullName: "Stanley Access Windcord 5500 Non-Impact Windload Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "commercial", "coastal non-HVHZ", "high-wind exterior"],
    description:
      "Stanley Access Windcord 5500 non-impact windload automatic sliding door. NON-IMPACT/WINDLOAD ONLY — not HVHZ rated. FL41647 covers non-HVHZ use only. For coastal and high-wind exterior applications that do NOT require full HVHZ/impact certification. Requires separately approved shutter system in HVHZ or windborne debris regions.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified for power-operated automatic sliding door. All force, sensor, and signage requirements apply.",
        keyRequirements: [
          "30 lbf closing force limit",
          "Pre-cycle sensor fault check §8.3",
          "Presence sensor 8 in. inactive zone",
          "50 in. AFF signage",
        ],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave motion sensor — overhead mount",
        standard: "A156.10 §8.1",
        notes: "Standard overhead microwave activation for windload exterior configurations.",
      },
      {
        category: "presence",
        type: "Overhead IR presence sensor",
        standard: "A156.10 §8.2",
        notes: "Holds door open while occupant detected.",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Electronic fault check before each closing cycle.",
      },
    ],
    floridaApproval: {
      status: "not-certified",
      noaNumber: "FL41647 (non-HVHZ use only)",
      testStandards: ["TAS 202", "TAS 203"],
      designPressure: "Per FL41647 non-HVHZ scope — verify for project-specific DP",
      hvhz: false,
      fbc9thNotes:
        "FBC 9th Edition takes effect Dec 31, 2026. Permits issued on/after that date must reference 9th Edition cycle approvals.",
      notes:
        "NON-IMPACT/WINDLOAD ONLY. No HVHZ NOA. Requires separately approved shutter system in HVHZ or windborne debris regions. FL41647 covers non-HVHZ use only.",
    },
    keySpecs: {
      "Impact rating": "NON-IMPACT — windload only",
      "HVHZ": "NOT certified for HVHZ",
      "Florida approval": "FL41647 — non-HVHZ scope only",
      "HVHZ shutter requirement": "Requires separately approved shutter in HVHZ/windborne debris zones",
      "Application": "Coastal non-HVHZ, high-wind exterior",
    },
    pmAngles: [
      {
        topic: "Non-impact vs. impact — critical specification distinction",
        insight:
          "The Windcord 5500 is a windload-only product, not impact-rated. Specifying it for an HVHZ project without an approved shutter would fail the AHJ plan check. PM lesson: non-impact windload products serve real coastal markets (non-HVHZ wind zones) but carry critical compliance risk if misapplied to full HVHZ exterior openings.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "commercial"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "Non-impact windload rating for coastal non-HVHZ exterior applications",
      "Lower cost than full impact-rated HVHZ products (Windcord 5400, Dura-Storm)",
      "FL41647 non-HVHZ scope — Florida-applicable outside windborne debris regions",
    ],
    competitiveThreats: ["sl500_r92", "st-windcord-5400"],
    knownLimitations: [
      "Non-impact only — requires shutter in HVHZ/windborne debris zones",
      "NOT HVHZ rated — cannot replace Windcord 5400 or Dura-Storm for full HVHZ exterior",
      "FL41647 scope does not include HVHZ designation for this product",
      "Shutter system must be separately approved and coordinated",
    ],
    flKeyNote: "NON-IMPACT/WINDLOAD ONLY. Not HVHZ rated. FL41647 non-HVHZ use only. Requires separately approved shutter in HVHZ or windborne debris regions.",
    sensorCompatibility: ["Microwave motion", "IR presence", "Pre-cycle fault monitor"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HORTON AUTOMATICS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "horton-2000",
    brand: "horton",
    name: "Horton 2000",
    fullName: "Horton Automatics 2000 Series Automatic Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["retail", "commercial", "grocery", "healthcare"],
    description:
      "Horton's flagship automatic sliding door — the largest installed base of any single automatic door product line in North American retail. Available in Belt Drive (2000), Linear Drive, 2001, and 2003 sub-variants. Synonymous with US grocery and big-box retail. Deep aftermarket parts network.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified. Horton 2000 series meets all current force, sensor fault monitoring, and signage requirements. Massive installed base pre-dates some recent edition updates — retrofit/upgrade advisory programs exist for legacy units.",
        keyRequirements: ["30 lbf closing force limit", "Pre-cycle sensor fault check §8.3", "8 in. inactive zone", "50 in. AFF signage"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave overhead motion sensor",
        standard: "A156.10 §8.1",
        notes: "Standard overhead microwave. Dual-sensor configuration available for high-traffic bi-parting.",
      },
      {
        category: "presence",
        type: "Infrared presence mat or overhead IR",
        standard: "A156.10 §8.2",
        notes: "Presence mat is traditional; overhead IR preferred for ADA-accessible paths (eliminates mat trip hazard).",
      },
      {
        category: "safety",
        type: "Pre-cycle sensor fault monitor",
        standard: "A156.10 §8.3",
        notes: "Required on all current production units. Legacy units may require upgrade.",
      },
      {
        category: "obstruction",
        type: "Kinetic force reversal",
        standard: "A156.10 §6.x",
        notes: "30 lbf max at last 10 deg per 2024 edition.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      fbc9thNotes: "Verify Horton 2000 NOA/TAS for HVHZ exterior applications. Horton has Florida-certified products; confirm current NOA for 160 mph FBC 9th Ed. threshold.",
      notes: "Horton maintains Florida approvals for some exterior configurations. Verify current NOA number with Horton for HVHZ projects. Horton's traditional strengths are US commercial interior/non-hurricane markets.",
    },
    keySpecs: {
      "Configuration": "Bi-parting, single-slide, pocket",
      "Drive types": "Belt Drive (2000), Linear Drive, 2001, 2003 variants",
      "Motor": "High-torque DC motor, field-adjustable speed",
      "Power": "120V / 15A",
      "Finish": "Anodized aluminum; painted options",
      "Parts availability": "Highest aftermarket parts availability of any US automatic sliding door brand",
    },
    pmAngles: [
      {
        topic: "Installed base dominance as a competitive moat",
        insight:
          "The Horton 2000's massive US retail installed base creates a self-reinforcing advantage: technicians are trained on it, distributors stock its parts, and facilities managers are familiar with it. A PM lesson in how install base density creates switching costs and aftermarket revenue streams that competitors cannot easily replicate.",
        useIn: "both",
      },
      {
        topic: "Legacy unit compliance gap as a service revenue driver",
        insight:
          "Every edition update to A156.10 (e.g., 2017 sensor fault monitoring requirement, 2024 force limit reduction) creates a compliance gap for the vast Horton 2000 legacy install base. This is a recurring service and upgrade revenue opportunity — and a risk for building owners who may not know their doors are non-compliant.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["retail", "healthcare", "education"],
    priceRange: "mid",
    installedBase: "dominant",
    keyDifferentiators: [
      "Largest US automatic sliding door installed base — retail/grocery dominance",
      "Richest aftermarket parts ecosystem of any automatic door brand",
      "Belt and linear drive variants for different traffic/noise needs",
      "Decades of US field service technician familiarity",
    ],
    competitiveThreats: ["st-dura-glide-2000", "aa-sl500", "dk-esa100"],
    knownLimitations: [
      "Limited HVHZ-certified exterior product portfolio vs. ASSA ABLOY",
      "Legacy install base creates compliance upgrade complexity",
      "Less architectural/aesthetic differentiation vs. dormakaba ES series (ES 200/250) — Note: Slimdrive is a GEZE trademark; dormakaba's sliding door line is the ES series",
    ],
    productUrl: "https://www.hortonautomatics.com/products/horton-2000/",
  },

  {
    id: "horton-4000",
    brand: "horton",
    name: "Horton 4000 Series",
    fullName: "Horton Automatics 4000 Series Automatic Swing Door Operator",
    motion: "swing",
    energyClass: "full-energy",
    primaryApplication: ["commercial", "healthcare", "retail", "ADA entrances"],
    description:
      "Horton's commercial swing door operator family. Full and low-energy variants. Covers a wide range of commercial swing applications from ADA-compliant accessible entrances to high-traffic push-pull configurations. Field-selectable full/low energy.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "Full-energy variant certified to A156.10-2024.",
        keyRequirements: ["30 lbf closing force limit", "Sensor fault monitoring", "Presence sensor coverage"],
      },
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "Low-energy variant certified to A156.19-2019. AUTOMATIC CAUTION DOOR signage required.",
        keyRequirements: ["AUTOMATIC CAUTION DOOR sign — 6 in. diam., yellow, 50 in. AFF", "Max 15 lbf opening force", "Max 5 lbf in-motion"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Push-plate or motion sensor",
        standard: "A156.10/A156.19",
        notes: "Full-energy: overhead motion sensor standard. Low-energy: push-plate activation typical.",
      },
      {
        category: "presence",
        type: "Overhead presence sensor — swing arc",
        standard: "A156.10 §8.2",
        notes: "Covers the door's swing arc to prevent closing on pedestrian.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor (full-energy) / force-limited speed (low-energy)",
        standard: "A156.10 §8.3 / A156.19",
        notes: "Full-energy: pre-cycle sensor check. Low-energy: slow open speed limits contact force.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Swing operator HVHZ use: verify NOA with Horton for exterior-rated configurations. Interior: no NOA required.",
    },
    keySpecs: {
      "Energy modes": "Full-energy and low-energy, field-selectable",
      "Mount": "Surface mount standard; concealed on request",
      "Power": "120V",
      "Door types": "Wood, metal, glass — push or pull",
      "Competitor parallel": "Competes with ASSA ABLOY SW300, Stanley M-Force, dormakaba ED250",
    },
    pmAngles: [
      {
        topic: "Field-selectable energy class as a stocking advantage",
        insight:
          "Horton's 4000 series field-selectable full/low energy mode means distributors can stock a single SKU that covers both A156.10 and A156.19 applications. This simplifies inventory and reduces lead times — a meaningful operational advantage in competitive bidding.",
        useIn: "both",
      },
    ],
    marketVerticals: ["retail", "healthcare", "education"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "Field-selectable full/low energy — one SKU covers two standards",
      "Leverages Horton's deep US service network",
      "Competitive pricing supported by high volume",
    ],
    competitiveThreats: ["aa-sw300", "st-m-force", "dk-ed250"],
    knownLimitations: [
      "Less aesthetic differentiation than premium competitors",
      "Limited concealed/in-ground options vs. ASSA ABLOY SW200i-IG",
    ],
    productUrl: "https://www.hortonautomatics.com/products/swing-doors/",
  },

  {
    id: "horton-7000",
    brand: "horton",
    name: "Horton 7000 Series",
    fullName: "Horton Automatics 7000 Series Swing/Folding Operator",
    motion: "folding",
    energyClass: "full-energy",
    primaryApplication: ["commercial folding", "retail", "healthcare", "commercial swing"],
    description:
      "Horton's 7000 series covers both swing and folding automatic door configurations. Used for applications requiring wider clear openings than standard swing, or bi-directional traffic flow. A156.10/A156.19 certified across the range.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "Full-energy swing/folding certified to A156.10-2024.",
        keyRequirements: ["Force limits", "Sensor fault monitoring §8.3", "Emergency egress release"],
      },
      {
        standard: "A156.19",
        edition: "2019",
        status: "certified",
        notes: "Low-energy variant per A156.19-2019.",
        keyRequirements: ["AUTOMATIC CAUTION DOOR sign", "Max 15 lbf opening force"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Motion sensor or push-plate",
        standard: "A156.10/A156.19",
        notes: "Full-energy: motion sensor. Low-energy: push-plate.",
      },
      {
        category: "presence",
        type: "Presence sensor — swing/fold arc",
        standard: "A156.10 §8.2",
        notes: "Covers door sweep path.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + edge detection",
        standard: "A156.10 §8.3",
        notes: "Required for full-energy configurations.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Verify NOA for exterior HVHZ folding/swing use with Horton.",
    },
    keySpecs: {
      "Configurations": "Swing and folding variants",
      "Traffic": "Commercial to high-traffic commercial",
      "Power": "120V",
      "Primary markets": "Commercial, healthcare, retail",
    },
    pmAngles: [
      {
        topic: "Portfolio breadth vs. depth trade-off",
        insight:
          "Horton's 7000 series demonstrates a product line strategy of covering multiple door motion types within a single family number. This portfolio breadth makes Horton a viable single-source vendor for some projects, but each variant may have shallower feature depth than a specialist competitor's dedicated product.",
        useIn: "interview",
      },
    ],
    marketVerticals: ["retail", "healthcare", "industrial"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "Combined swing/folding coverage in one product family",
      "Horton nationwide service network support",
      "Full and low-energy field-selectable",
    ],
    competitiveThreats: ["st-magic-swing", "dk-bst-fbst", "aa-sw300"],
    knownLimitations: [
      "Less dedicated feature depth than specialist folding or swing products",
      "Aesthetic options more limited than premium European brands",
    ],
  },

  {
    id: "horton-4200-bifold",
    brand: "horton",
    name: "Horton 4200 / 7600 Bifold",
    fullName: "Horton Automatics 4200/7600 Automatic Bi-Fold Door System",
    motion: "folding",
    energyClass: "full-energy",
    primaryApplication: ["commercial folding", "healthcare", "retail", "high-traffic bi-directional"],
    description:
      "Dedicated automatic bi-fold door system from Horton. 4200 and 7600 variants cover different panel sizes and weights. A156.10 certified. Provides wide clear openings with minimal footprint. Competes with Stanley Magic-Swing and dormakaba BST/FBST.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "Full-energy A156.10-2024. Emergency egress release ≤40 lbf.",
        keyRequirements: ["Sensor fault monitoring §8.3", "Force limits", "Emergency egress release"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Overhead motion sensor — bi-directional",
        standard: "A156.10 §8.1",
        notes: "Ingress and egress activation sensors.",
      },
      {
        category: "presence",
        type: "Presence sensor — fold arc",
        standard: "A156.10 §8.2",
        notes: "Must cover the full folding panel sweep.",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + panel-edge detection",
        standard: "A156.10 §8.3",
        notes: "Hinge pinch-point requires edge detection on each panel.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Exterior HVHZ bifold: verify NOA. Interior: no NOA required.",
    },
    keySpecs: {
      "Variants": "4200 and 7600 (different panel capacity)",
      "Configuration": "2- and 4-panel bi-fold",
      "Opening width": "Wide clear opening in compact footprint",
      "Emergency release": "≤40 lbf code-compliant",
      "Primary markets": "Commercial, healthcare, retail",
    },
    pmAngles: [
      {
        topic: "Bifold as an underappreciated niche with growing FGI relevance",
        insight:
          "FGI Guidelines for healthcare facility design increasingly call for wider clear openings in patient corridors and ICUs. Bi-fold doors can achieve these widths without the large swing arc or sliding pocket requirement. A PM framing: regulatory-driven demand creates a pull for niche products that might otherwise struggle to achieve scale.",
        useIn: "strategy",
      },
    ],
    marketVerticals: ["retail", "healthcare", "industrial"],
    priceRange: "mid",
    installedBase: "moderate",
    keyDifferentiators: [
      "Two-variant product line covers light to heavy bifold applications",
      "Wide clear opening with minimal footprint",
      "Backed by Horton's US service network",
    ],
    competitiveThreats: ["st-magic-swing", "st-magic-force-bifold", "dk-bst-fbst"],
    knownLimitations: [
      "Limited aesthetic differentiation",
      "Pinch-point safety engineering requires careful sensor planning",
      "Less known than Horton's core sliding products",
    ],
  },

  {
    id: "horton-9000",
    brand: "horton",
    name: "Horton 9000",
    fullName: "Horton Automatics 9000 Heavy-Duty Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["grocery", "big-box retail", "high-traffic commercial"],
    description:
      "Heavy-duty automatic sliding door for the highest-traffic commercial environments. Up-rated mechanical components vs. standard 2000 series. Deep groove track, heavier duty drive and carrier. Ideal for grocery store entrances, big-box retail, and any location with extremely high daily cycle counts.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 certified. All force, sensor, signage, and fault monitoring requirements met.",
        keyRequirements: ["30 lbf force limit", "Sensor fault monitoring §8.3", "8 in. inactive zone", "Signage 50 in. AFF"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Microwave overhead motion sensor — dual",
        standard: "A156.10 §8.1",
        notes: "Dual sensors for high-traffic bi-parting. Wide activation zone for shopping cart approaches.",
      },
      {
        category: "presence",
        type: "Overhead IR presence sensor",
        standard: "A156.10 §8.2",
        notes: "Preferred over mats for high-cart-traffic grocery environments.",
      },
      {
        category: "safety",
        type: "Pre-cycle fault monitor + kinetic reversal",
        standard: "A156.10 §8.3",
        notes: "Required on all current production. Heavy-duty drive components reduce risk of force overrun.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      fbc9thNotes: "Verify NOA for HVHZ exterior applications. Heavy-duty sliding: more likely to achieve wind resistance ratings but must carry specific NOA.",
      notes: "Horton 9000 for exterior HVHZ use: verify current NOA. Large heavy-duty sliding headers may have additional wind load considerations.",
    },
    keySpecs: {
      "Traffic rating": "Extreme high-frequency — up to 5M+ cycles/year",
      "Panel weight": "Up to 700+ lbs",
      "Drive system": "Heavy-duty belt drive with reinforced carrier",
      "Track depth": "Deep groove for stability at high panel weights",
      "Power": "120V / 20A (higher amperage than standard)",
    },
    pmAngles: [
      {
        topic: "Cycle rating as a maintenance cost predictor",
        insight:
          "Grocery and big-box retail entrances see dramatically higher cycle counts than standard commercial doors. Horton 9000's heavy-duty spec is a direct response to the ROI math: reduced mean time between failures (MTBF) × lower repair costs = lower total cost of ownership despite higher initial purchase price. PM framing: when does a premium product justify its price through lifecycle economics?",
        useIn: "both",
      },
    ],
    marketVerticals: ["retail", "industrial"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "Engineered for extreme cycle count environments",
      "Heavier duty drive and carrier than standard 2000 series",
      "Direct Horton aftermarket parts support",
    ],
    competitiveThreats: ["st-dura-guard", "aa-sl500", "dk-esa500"],
    knownLimitations: [
      "Higher initial cost vs. standard 2000 series",
      "Limited HVHZ NOA product portfolio",
      "Heavier hardware increases installation complexity",
    ],
    productUrl: "https://www.hortonautomatics.com/products/horton-9000/",
  },

  {
    id: "horton-icu-series",
    brand: "horton",
    name: "Horton ICU/CCU Series",
    fullName: "Horton Automatics ICU 2000/2001/2003 Healthcare Sliding Door",
    motion: "sliding",
    energyClass: "full-energy",
    primaryApplication: ["ICU", "CCU", "hospital corridors", "healthcare"],
    description:
      "Healthcare-specific automatic sliding door system for ICU and CCU environments. Three variants: 2000 (standard), 2001 (single slide), and 2003 (telescoping). Designed to meet FGI Guidelines for healthcare facility design. Breakout capability standard. Cleanable surfaces for infection control.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "certified",
        notes: "A156.10-2024 healthcare configuration. FGI-guideline-sensitive door hardware — wide clear openings, breakout, touchless options.",
        keyRequirements: ["Breakout force compliance", "Touchless activation compatibility", "Sensor fault monitoring §8.3"],
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Touchless wave sensor or motion sensor",
        standard: "A156.10 §8.1",
        notes: "Touchless preferred in ICU/CCU for infection control. Wave sensor allows hands-free activation.",
      },
      {
        category: "presence",
        type: "Overhead IR presence sensor",
        standard: "A156.10 §8.2",
        notes: "Ceiling mount preferred; no floor mats in clinical environments (infection control, trip hazard).",
      },
      {
        category: "safety",
        type: "Sensor fault monitor + gentle breakout force",
        standard: "A156.10 §8.3",
        notes: "Healthcare environments require reliable fault monitoring. Breakout force must be low enough for staff pushing gurneys.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      notes: "Healthcare ICU doors are typically interior; no NOA required. For any exterior ICU/CCU application in HVHZ, verify.",
    },
    keySpecs: {
      "Variants": "ICU 2000 (standard), 2001 (single-slide), 2003 (telescoping)",
      "Breakout": "Full breakout standard",
      "FGI compliance": "Meets FGI Guidelines for healthcare facility design",
      "Activation": "Touchless compatible (wave, motion)",
      "Surface treatment": "Cleanable/antimicrobial finish options",
    },
    pmAngles: [
      {
        topic: "FGI Guidelines as a healthcare market access requirement",
        insight:
          "The FGI Guidelines for the Design and Construction of Hospitals are the de facto design standard for US hospital construction. Products that can document FGI compliance are specified by healthcare architects by name. This is a soft market gate: no legal mandate, but practical barrier because architects won't deviate from FGI-referenced products without strong justification.",
        useIn: "strategy",
      },
      {
        topic: "Touchless activation as an infection-control spec driver",
        insight:
          "ICU/CCU procurement increasingly requires touchless activation (wave, motion, foot pedal). Products that shipped before 2020 as push-plate may need retrofit kits to win new healthcare business. COVID-19 significantly accelerated touchless specification adoption — a rare example of a macro event creating permanent product feature demand.",
        useIn: "both",
      },
    ],
    marketVerticals: ["healthcare"],
    priceRange: "premium",
    installedBase: "strong",
    keyDifferentiators: [
      "Three healthcare-tailored variants: standard, single-slide, telescoping",
      "FGI Guidelines compliance documentation available",
      "Cleanable surfaces and touchless activation support",
      "Backed by Horton's deep US service network",
    ],
    competitiveThreats: ["st-procare-8300", "aa-versaMax", "st-dura-care-7500"],
    knownLimitations: [
      "Healthcare-specific; limited commercial versatility",
      "Premium pricing for healthcare configuration vs. standard commercial sliding",
      "FGI documentation currency: verify against latest FGI edition",
    ],
    flKeyNote: "ICU/CCU doors in HVHZ-adjacent healthcare facilities: verify exterior opening NOA if applicable.",
    productUrl: "https://www.hortonautomatics.com/markets/healthcare/",
  },

  {
    id: "horton-s8000",
    brand: "horton",
    name: "Horton S8000 Drive-Thru Window",
    fullName: "Horton Automatics S8000 Drive-Thru Window/Pass-Through System",
    motion: "sliding",
    energyClass: "power-assist",
    primaryApplication: ["QSR", "pharmacy drive-thru", "bank", "drive-thru"],
    description:
      "Dedicated drive-thru window and pass-through system. Bi-part option. Designed for QSR, pharmacy drive-thru, and bank pass-through applications. Stainless steel and vinyl seals for weather and contamination control. Solenoid lock integration for secure transaction control.",
    standardCerts: [
      {
        standard: "A156.10",
        edition: "2024",
        status: "partial",
        notes: "Drive-thru windows are a specialty configuration. Verify applicable A156.10 requirements for the specific installation type (walk-up vs. vehicle drive-thru context).",
      },
    ],
    sensorSpecs: [
      {
        category: "activation",
        type: "Intercom trigger, push-button, or motion sensor",
        standard: "Custom per QSR spec",
        notes: "Drive-thru windows typically activated by intercom/POS system signal, not pedestrian motion sensor. Integration with QSR POS/timer system is standard.",
      },
      {
        category: "safety",
        type: "Obstruction reversal — vehicle/arm detection",
        standard: "A156.10 §6.x (adapt for drive-thru)",
        notes: "Must not close on customer arm during transaction. Force limits critical for customer-contact opening.",
      },
    ],
    floridaApproval: {
      status: "verify",
      hvhz: false,
      fbc9thNotes: "Drive-thru windows in HVHZ: may require FBC compliance for exterior openings. Verify with Horton for Florida locations.",
      notes: "Florida QSR drive-thru locations: verify applicable FBC and HVHZ provisions. Drive-thru windows may have separate compliance pathway from pedestrian automatic doors.",
    },
    keySpecs: {
      "Configuration": "Single and bi-part",
      "Material": "Stainless steel frame, vinyl weatherseals",
      "Integration": "QSR POS/intercom system, solenoid lock",
      "Clear opening": "Standard drive-thru transaction width",
      "Primary markets": "QSR (McDonald's, Chick-fil-A etc.), pharmacy drive-thru, bank",
    },
    pmAngles: [
      {
        topic: "QSR drive-thru as a distinct market with unique integration requirements",
        insight:
          "Drive-thru windows are not just small sliding doors — they require deep integration with QSR POS/timer systems, solenoid locks that can be controlled by the POS, and activation logic tied to the intercom system. Stanley Dura-Glide DT and Horton S8000 compete in this niche. PM framing: how does a niche application's distinct integration requirements create a specialized product category that a general-purpose operator cannot serve?",
        useIn: "both",
      },
    ],
    marketVerticals: ["qsr"],
    priceRange: "mid",
    installedBase: "strong",
    keyDifferentiators: [
      "POS/intercom system integration for QSR workflow",
      "Solenoid lock for transaction security",
      "Stainless + vinyl construction for food-service environment durability",
      "Bi-part option for higher-volume drive-thru windows",
    ],
    competitiveThreats: ["st-dura-glide-dt"],
    knownLimitations: [
      "Drive-thru-specific; not suitable for pedestrian entrances",
      "POS/intercom integration requires project-by-project coordination",
      "Weather sealing performance varies by installation quality",
    ],
    flKeyNote: "Florida drive-thru locations: hurricane shutters or impact glass may be required separately; verify with AHJ.",
    productUrl: "https://www.hortonautomatics.com/products/drive-thru-windows/",
  },

];


export const BRAND_MARKET_MAPS_LIST: BrandMarketMap[] = [
  {
    brand: "assa_abloy",
    verticalStrength: {
      retail: "strong",
      healthcare: "dominant",
      hospitality: "strong",
      airport: "strong",
      industrial: "moderate",
      government: "strong",
      qsr: "moderate",
      education: "strong",
    },
    flHvhzReady: true,
    usServiceFootprint: "national",
    priceIndex: 8,
    certificationDepth: "full",
  },
  {
    brand: "dormakaba",
    verticalStrength: {
      retail: "moderate",
      healthcare: "moderate",
      hospitality: "strong",
      airport: "moderate",
      industrial: "weak",
      government: "moderate",
      qsr: "weak",
      education: "moderate",
    },
    flHvhzReady: false,
    usServiceFootprint: "regional",
    priceIndex: 7,
    certificationDepth: "partial",
  },
  {
    brand: "stanley",
    verticalStrength: {
      retail: "dominant",
      healthcare: "strong",
      hospitality: "moderate",
      airport: "moderate",
      industrial: "strong",
      government: "strong",
      qsr: "strong",
      education: "strong",
    },
    flHvhzReady: false,
    usServiceFootprint: "national",
    priceIndex: 6,
    certificationDepth: "full",
  },
  {
    brand: "horton",
    verticalStrength: {
      retail: "dominant",
      healthcare: "strong",
      hospitality: "moderate",
      airport: "moderate",
      industrial: "strong",
      government: "moderate",
      qsr: "strong",
      education: "moderate",
    },
    flHvhzReady: false,
    usServiceFootprint: "national",
    priceIndex: 5,
    certificationDepth: "full",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STANDARDS GAP ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export const STANDARDS_GAP_DETAIL: StandardsGapEntry[] = [
  {
    standard: "ANSI/BHMA A156.10",
    description: "Power-operated pedestrian doors — full-energy automatic. Covers force limits (30 lbf / 2024), sensor fault monitoring §8.3, presence sensor 8 in. inactive zone, 50 in. AFF signage.",
    coveredProductIds: [
      "aa-sl500", "aa-sl500cr", "aa-sl521", "aa-sw200i-surface", "aa-sw200i-ig", "aa-sw200-ohc", "aa-sw300", "aa-versaMax",
      "sl500_r104", "sl500_r92", "sl500_r128", "sw60", "sw200_ohc", "folding_door_aa", "versamax_icu",
      "dk-esa100", "dk-esa200", "dk-esa300", "dk-esa300t", "dk-esa400", "dk-esa500", "dk-ed100", "dk-ed250", "dk-ed-ohc", "dk-ed-ig",
      "st-dura-glide-2000", "st-dura-glide-3000", "st-dura-glide-ag", "st-dura-glide-gs", "st-dura-glide-tele", "st-dura-fit",
      "st-dura-guard", "st-dura-storm", "st-dura-shield", "st-dura-glide-dt", "st-industrial-10k", "st-magic-force", "st-m-force",
      "st-procare-8300", "st-procare-8300bp", "st-dura-care-7500", "st-magic-swing", "st-magic-force-bifold",
      "horton-2000", "horton-4000", "horton-7000", "horton-4200-bifold", "horton-9000", "horton-icu-series",
    ],
    notCoveredProductIds: ["aa-rd3-rd4", "aa-rd600", "aa-rd700", "aa-rd300-ag", "aa-rd3a-rd4a1", "dk-ktv3-ktv4", "dk-ktv-atrium", "dk-ktc3-ktc4", "dk-ktc2"],
    verifyProductIds: ["horton-s8000", "aa-ecoLOGIC", "dk-ed50"],
  },
  {
    standard: "ANSI/BHMA A156.19",
    description: "Power-assist and low-energy power-operated doors. Requires AUTOMATIC CAUTION DOOR sign (6 in. diam., yellow, 50 in. AFF). Max 15 lbf opening force, max 5 lbf in-motion.",
    coveredProductIds: [
      "aa-sw100", "aa-sw60", "dk-ed50", "dk-ed100", "st-magic-access", "st-magic-force", "st-m-force",
      "horton-4000", "horton-7000",
    ],
    notCoveredProductIds: [],
    verifyProductIds: ["horton-s8000"],
  },
  {
    standard: "Florida NOA / TAS 201/202/203 (HVHZ)",
    description: "Miami-Dade NOA and TAS impact test certification required for all exterior openings in HVHZ (Miami-Dade and Broward counties). FBC 9th Ed. increases threshold to 160 mph.",
    coveredProductIds: ["aa-sl500", "aa-sl500cr", "aa-sw200i-surface", "sl500_r104"],
    notCoveredProductIds: ["dk-esa100", "dk-esa200", "dk-esa300", "dk-esa500"],
    verifyProductIds: [
      "aa-sl521", "aa-sw200-ohc", "aa-sw200i-ig", "aa-sw300",
      "sl500_r92", "sl500_r128", "sw60", "sw200_ohc", "folding_door_aa", "versamax_icu",
      "st-dura-glide-2000", "st-dura-glide-3000", "st-dura-storm",
      "horton-2000", "horton-9000", "dk-bst-fbst",
    ],
  },
  {
    standard: "FGI Guidelines for Healthcare Facility Design",
    description: "Not a law, but the de facto specification standard for US hospital construction. Requires wide clear openings (ICU: 44 in. min), breakout capability, touchless activation compatibility.",
    coveredProductIds: [
      "aa-versaMax", "versamax_icu", "st-procare-8300", "st-procare-8300bp", "st-dura-care-7500", "horton-icu-series",
      "aa-sl500cr", "st-dura-glide-3000",
    ],
    notCoveredProductIds: [],
    verifyProductIds: ["dk-esa300t", "dk-esa500", "aa-sl521"],
  },
  {
    standard: "ASTM E1996/E1886 (Hurricane Impact — Sliding Doors)",
    description: "Impact resistance testing for windows and doors in hurricane-prone areas. Stanley Dura-Storm carries Level D and E impact ratings. ASSA ABLOY SL500 R104 certified to ASTM E1886/E1996.",
    coveredProductIds: ["st-dura-storm", "sl500_r104"],
    notCoveredProductIds: [],
    verifyProductIds: ["aa-sl500", "horton-9000"],
  },
  {
    standard: "ICC ESR (Evaluation Service Report)",
    description: "ICC Evaluation Service reports provide code compliance documentation for AHJs. Stanley M-Force holds ICC ESR-1751.",
    coveredProductIds: ["st-m-force"],
    notCoveredProductIds: [],
    verifyProductIds: ["st-magic-force", "aa-sw300", "dk-ed250"],
  },
  {
    standard: "EN 16005 (European — Revolving Doors)",
    description: "European standard for power-operated pedestrian doors — revolving. dormakaba KTV and KTC series are EN 16005 compliant.",
    coveredProductIds: ["dk-ktv3-ktv4", "dk-ktv-atrium", "dk-ktc3-ktc4", "dk-ktc2"],
    notCoveredProductIds: ["aa-rd3-rd4", "aa-rd600", "aa-rd700", "aa-rd300-ag", "aa-rd3a-rd4a1"],
    verifyProductIds: [],
  },
  {
    standard: "ANSI/BHMA A156.27 (Revolving Doors)",
    description: "US standard governing power-operated revolving doors. Sets max speed 4 RPM, breakout force ≤ 130 lbf per wing, collapsed egress ≥ 36 in. aggregate, slow-speed ADA mode ≤ 2 RPM. NOT A156.10 — A156.10 only covers sliding, swinging, and folding doors. ASSA ABLOY RD series is certified to A156.27-2019. dormakaba KTV/KTC series carries EN 16005 (European equivalent); US A156.27 certification should be verified with dormakaba US before specifying for North American projects.",
    coveredProductIds: ["aa-rd3-rd4", "aa-rd600", "aa-rd700", "aa-rd300-ag", "aa-rd3a-rd4a1"],
    notCoveredProductIds: [],
    verifyProductIds: ["dk-ktv3-ktv4", "dk-ktv-atrium", "dk-ktc3-ktc4", "dk-ktc2"],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPETITIVE DISPLACEMENT TABLE
// ═══════════════════════════════════════════════════════════════════════════════

export interface CompetitiveMatchup {
  productId: string;
  directCompetitors: string[];
  winFactors: string[];   // reasons this product wins
  loseFactors: string[];  // reasons this product loses
}

export const COMPETITIVE_MATCHUPS: CompetitiveMatchup[] = [
  {
    productId: "aa-sl500",
    directCompetitors: ["st-dura-glide-2000", "horton-2000", "dk-esa100", "dk-esa200"],
    winFactors: ["NOA/HVHZ certification for Florida exterior", "AAADM service network density", "Broadest product family for upsell (VersaMax, ecoLOGIC)", "Healthcare + hospitality reference wins"],
    loseFactors: ["Higher price point vs. Stanley and Horton in retail bids", "Less installed base recognition in grocery/big-box vs. Stanley/Horton"],
  },
  {
    productId: "st-dura-glide-2000",
    directCompetitors: ["horton-2000", "aa-sl500", "dk-esa100"],
    winFactors: ["US retail #1 installed base — familiarity advantage", "Highest HP motor in class", "Strong GC and distributor relationships", "Competitive pricing"],
    loseFactors: ["Limited HVHZ NOA portfolio for Florida exterior bids", "Less differentiated in healthcare vs. ASSA ABLOY"],
  },
  {
    productId: "horton-2000",
    directCompetitors: ["st-dura-glide-2000", "aa-sl500", "dk-esa100"],
    winFactors: ["Massive US legacy parts/service network", "Lowest acquisition cost in many bids", "Strong grocery/big-box account relationships", "Dominant US installed base creates replacement demand"],
    loseFactors: ["Limited HVHZ-certified exterior portfolio", "Less feature depth in healthcare-specific configurations"],
  },
  {
    productId: "aa-sw300",
    directCompetitors: ["st-m-force", "horton-4000", "dk-ed250"],
    winFactors: ["Wind/stack pressure compensation for tall high-rise", "App-based configuration (SW300-S, 2025)", "NOA/HVHZ for exterior swing", "Ultra-compact housing (6.5 in. × 2.75 in.)"],
    loseFactors: ["Premium price vs. dormakaba ED250 and Horton 4000", "SW300-S app features require learning curve"],
  },
  {
    productId: "st-m-force",
    directCompetitors: ["aa-sw300", "aa-sw200i-surface", "horton-4000", "dk-ed250"],
    winFactors: ["Handles 700 lb panels — heaviest swing in class", "Power-assist: eliminates motor resistance in manual mode", "ICC ESR-1751 documentation", "iQ Controller feature depth"],
    loseFactors: ["Higher cost than ED250/Horton 4000", "Limited HVHZ NOA vs. ASSA ABLOY"],
  },
  {
    productId: "dk-ktv3-ktv4",
    directCompetitors: ["aa-rd3-rd4", "aa-rd300-ag", "aa-rd600"],
    winFactors: ["Magnetic levitation reduces maintenance", "Up to 3.8m diameter — wider than some competitors", "EN 16005 certified", "Night shield integration"],
    loseFactors: ["Limited US BHMA certification vs. ASSA ABLOY revolving", "Smaller US service footprint"],
  },
  {
    productId: "st-dura-storm",
    directCompetitors: ["aa-sl500"],
    winFactors: ["Level D and E hurricane impact ratings", "Multiple glass options for hurricane zones", "Lowest-cost ASTM E1996-rated automatic sliding in market"],
    loseFactors: ["Only available from Stanley — no ASSA ABLOY equivalent in this specific product category", "Limited to hurricane-zone applications"],
  },
  {
    productId: "aa-versaMax",
    directCompetitors: ["st-procare-8300", "horton-icu-series", "st-dura-care-7500"],
    winFactors: ["44.5 in. clear on 8 ft frame — FGI compliant spec", "ASSA ABLOY healthcare reference wins", "Single-source healthcare entrance solutions"],
    loseFactors: ["Premium price vs. standard healthcare sliding", "Horton and Stanley have deeper installed base in legacy hospital accounts"],
  },
  {
    productId: "sl500_r104",
    directCompetitors: ["st-dura-storm", "aa-sl500"],
    winFactors: ["ASTM E1886/E1996 + ASTM F842-17 Grade 25 dual certification — no direct competitor matches both", "Miami-Dade NOA approved", "Sole-source position in high-security HVHZ government specs"],
    loseFactors: ["Premium price premium over standard SL500", "Limited to HVHZ applications — not competitive outside FL/Gulf Coast"],
  },
  {
    productId: "versamax_icu",
    directCompetitors: ["st-procare-8300bp", "horton-icu-series", "aa-versaMax"],
    winFactors: ["ASHRAE 170-2021 + NFPA 101-2024 dual compliance", "Telescoping maximizes COW in tight headers", "Hands-free infection control activation", "Nurse call and access control integration"],
    loseFactors: ["Ultra-premium price point", "Specialized installation requirement limits installer pool"],
  },
  {
    productId: "sw60",
    directCompetitors: ["dk-ed50", "dk-ed100", "horton-4000"],
    winFactors: ["Slimmest profile in class", "Bluetooth app configuration — no competitors offer this", "Fastest retrofit installation", "A156.38 low-energy certified"],
    loseFactors: ["Lower torque capacity vs. heavy-door competitors", "App configuration adds learning curve for installers"],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Return all products for a given brand */
export function getProductsByBrand(brand: BrandId): Product[] {
  return PRODUCTS.filter((p) => p.brand === brand);
}

/** Return all products with HVHZ approval */
export function getHVHZProducts(): Product[] {
  return PRODUCTS.filter((p) => p.floridaApproval.hvhz === true);
}

/** Return products by motion type */
export function getProductsByMotion(motion: DoorMotion): Product[] {
  return PRODUCTS.filter((p) => p.motion === motion);
}

/** Return products that cover a given market vertical */
export function getProductsByVertical(vertical: string): Product[] {
  return PRODUCTS.filter((p) =>
    p.marketVerticals && (p.marketVerticals as string[]).includes(vertical)
  );
}

/** Return brand metadata */
export function getBrand(id: BrandId): Brand {
  return BRANDS[id];
}

/** Return all PM angles across all products, tagged by useIn */
export function getAllPMAngles(filter?: "interview" | "strategy" | "both"): Array<{ productId: string; productName: string; angle: PMAngle }> {
  const result: Array<{ productId: string; productName: string; angle: PMAngle }> = [];
  for (const product of PRODUCTS) {
    for (const angle of product.pmAngles) {
      if (!filter || angle.useIn === filter || angle.useIn === "both") {
        result.push({ productId: product.id, productName: product.name, angle });
      }
    }
  }
  return result;
}

/** Return competitive matchup for a product */
export function getCompetitiveMatchup(productId: string): CompetitiveMatchup | undefined {
  return COMPETITIVE_MATCHUPS.find((m) => m.productId === productId);
}

/** Return brand market map */
export function getBrandMarketMap(brand: BrandId): BrandMarketMap | undefined {
  return BRAND_MARKET_MAPS[brand];
}

/** Get products by price range */
export function getProductsByPriceRange(range: Product["priceRange"]): Product[] {
  return PRODUCTS.filter((p) => p.priceRange === range);
}

/** Get products by installed base strength */
export function getProductsByInstalledBase(base: Product["installedBase"]): Product[] {
  return PRODUCTS.filter((p) => p.installedBase === base);
}

/** Get all products with Florida-specific notes */
export function getFloridaNotableProducts(): Product[] {
  return PRODUCTS.filter((p) => p.floridaApproval.hvhz || p.flKeyNote);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT COUNT SUMMARY (compile-time reference)
// ═══════════════════════════════════════════════════════════════════════════════
// ASSA ABLOY:  23 products (aa-sl500, aa-sl500cr, aa-sl521, aa-sw100, aa-sw200i-surface,
//                           aa-sw200i-ig, aa-sw200-ohc, aa-sw300, aa-sw60, aa-versaMax,
//                           aa-rd3-rd4, aa-rd600, aa-rd700, aa-rd300-ag, aa-rd3a-rd4a1,
//                           aa-ecoLOGIC,
//                           sl500_r104, sl500_r92, sl500_r128, sw60, sw200_ohc,
//                           folding_door_aa, versamax_icu)  [+7 new]
// dormakaba:   16 products (dk-esa100, dk-esa200, dk-esa300, dk-esa300t, dk-esa400,
//                           dk-esa500, dk-ed50, dk-ed100, dk-ed250, dk-ed-ohc, dk-ed-ig,
//                           dk-ktv3-ktv4, dk-ktv-atrium, dk-ktc3-ktc4, dk-ktc2, dk-bst-fbst)
// Stanley:     19 products (st-dura-glide-2000, st-dura-glide-3000, st-dura-glide-ag,
//                           st-dura-glide-gs, st-dura-glide-tele, st-dura-fit, st-dura-guard,
//                           st-dura-storm, st-dura-shield, st-dura-glide-dt, st-industrial-10k,
//                           st-magic-access, st-magic-force, st-m-force, st-procare-8300,
//                           st-procare-8300bp, st-dura-care-7500, st-magic-swing,
//                           st-magic-force-bifold)
// Horton:       7 products (horton-2000, horton-4000, horton-7000, horton-4200-bifold,
//                           horton-9000, horton-icu-series, horton-s8000)
// TOTAL:       65 products

// ═══════════════════════════════════════════════════════════════════════════════
// MISSING EXPORTS — required by CrosswalkApp.tsx
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_MOTIONS: DoorMotion[] = ["sliding", "swing", "folding", "revolving", "telescoping", "hermetic"];
export const ALL_STANDARDS = ["A156.10", "A156.19", "A156.38"] as const;

// Extended standards reference (new 2025/2026 additions)
export const EXTENDED_STANDARDS_REFERENCE = [
  {
    code: "ASTM E1886",
    name: "ASTM E1886",
    description: "Impact Resistance Test Method (Hurricane)",
    pmInsight: "ASTM E1886 defines the test methodology for window and door assemblies subject to hurricane wind-borne debris impact. It is paired with ASTM E1996 (which sets the performance levels). Products carrying E1886 certification have been physically tested against large- and small-missile impacts at specified velocities. PM angle: ASTM E1886 is a physical evidence standard — not just a design calculation. This matters in bid disputes and insurance underwriting.",
  },
  {
    code: "ASTM E1996",
    name: "ASTM E1996",
    description: "Impact Resistance Performance Standard (Hurricane)",
    pmInsight: "ASTM E1996 specifies the performance requirements for impact-resistant products in hurricane-prone regions. It references E1886 as the test method and defines impact levels (from Level C through Level E) based on wind zone. FBC requires E1996 compliance for exterior glazed products in wind-borne debris regions. The SL500 R104 meets this standard, giving ASSA ABLOY sole-source positioning in HVHZ glazed sliding door bids.",
  },
  {
    code: "ASTM F842-17",
    name: "ASTM F842-17",
    description: "Forced Entry Resistance — Grade 25 = SL500 R104",
    pmInsight: "ASTM F842 grades door assemblies against forced entry attempts. Grade 25 represents resistance to concerted forced-entry attack. This standard is referenced in government and high-security facility specifications. Very few automatic sliding doors carry F842-17 Grade 25 certification — ASSA ABLOY’s R104 is one of the only products in this category, creating a near-sole-source position in high-security HVHZ government specifications.",
  },
  {
    code: "A156.38",
    name: "ANSI/BHMA A156.38",
    description: "Low-Energy Power Operated Sliding Doors",
    pmInsight: "A156.38 (2019, first edition) governs low-energy sliding and folding doors — distinct from A156.19 (which covers swing) and A156.10 (full-energy). As of 2025, it is still in its first certification cycle. PM angle: which brands moved fastest to certify against A156.38? Speed-to-certification is a competitive differentiator in bid specs that reference this standard explicitly.",
  },
  {
    code: "A156.14-2024",
    name: "ANSI/BHMA A156.14-2024",
    description: "Sliding & Folding Door Hardware (updated 2024)",
    pmInsight: "A156.14 covers the hardware standard for sliding and folding door systems. The 2024 update reflects current installation practices. ASSA ABLOY's Automatic Folding Door System is referenced against this standard. PM angle: hardware standards updates are often a lagging indicator of product evolution — new products appear first, standards follow.",
  },
  {
    code: "ASHRAE 170-2021",
    name: "ASHRAE 170-2021",
    description: "Ventilation of Health Care Facilities",
    pmInsight: "ASHRAE 170 is the HVAC standard referenced by FGI Guidelines for healthcare facility construction. It specifies minimum ventilation rates, pressure differentials, and air exchange requirements for clinical spaces. ICU/CCU doors must maintain these pressure differentials while being operable by clinical staff. PM angle: the intersection of HVAC and door standards creates a regulatory requirement that only specialized ICU door systems can satisfy, enabling premium pricing.",
  },
  {
    code: "NFPA 101-2024",
    name: "NFPA 101-2024",
    description: "Life Safety Code",
    pmInsight: "NFPA 101 is the foundational life safety code in the US, governing means of egress in all occupancy types. The 2024 edition's controlled-egress provisions (for memory care, behavioral health) allow automatic doors to be locked against egress under specific conditions. This directly affects VersaMax ICU and similar products. PM angle: each NFPA 101 edition cycle creates product update requirements that translate to replacement demand.",
  },
  {
    code: "ICC A117.1",
    name: "ICC A117.1",
    description: "Accessible and Usable Buildings and Facilities",
    pmInsight: "ICC A117.1 is the technical accessibility standard referenced by the ADA and adopted in state building codes. It specifies door force limits, hardware type, clear floor space, and threshold height requirements for accessible routes. All products on an accessible path of travel must comply. PM angle: ADA/A117.1 compliance is not a differentiator — it is a table stake. The differentiator is how elegantly a product meets accessibility while also meeting other performance requirements.",
  },
] as const;

export function getFloridaStatusLabel(status: FloridaStatus): string {
  const labels: Record<FloridaStatus, string> = {
    "noa-certified": "NOA Certified",
    "hvhz-listed": "HVHZ Listed",
    "noa-pending": "NOA Pending",
    "not-certified": "Not Certified",
    "verify": "Verify",
  };
  return labels[status] ?? status;
}

export function getCertStatusLabel(status: CertStatus): string {
  const labels: Record<CertStatus, string> = {
    "certified": "Certified",
    "partial": "Partial",
    "not-listed": "Not Listed",
    "verify": "Verify",
  };
  return labels[status] ?? status;
}
