// ─────────────────────────────────────────────────────────────────────────────
// Competitor Battle Card Data — v3.0 (Full NA Competitive Landscape)
// Brands: ASSA ABLOY Entrance Systems, dormakaba, Stanley Access, Horton Automatics,
//         NABCO Entrances, GEZE, TORMAX, Boon Edam, FAAC Group, Nabtesco,
//         Micom Americas (CA), Portalp, Automatic Systems, LCN/Norton (Allegion)
// Standards: ANSI/BHMA A156.10-2024, A156.19-2019, A156.38, A156.27-2019, FBC 8th/9th Ed.
// Sources: Company product pages, AAADM data, Miami-Dade Product Control,
//          ASTM E283, industry analyst notes, FGI Guidelines 2022,
//          Global Market Insights 2024, Stellar Market Research 2024
// ─────────────────────────────────────────────────────────────────────────────

export type CompetitorId =
  | "dormakaba"
  | "stanley"
  | "assa_abloy"
  | "horton"
  | "boon_edam"
  | "geze"
  | "tormax"
  | "nabtesco"
  | "faac_group"
  // Expanded — full NA landscape v3.0
  | "nabco"
  | "micom"
  | "portalp"
  | "automatic_systems"
  | "lcn_norton";

export type ContextId =
  | "customer_pitch"
  | "procurement"
  | "engineering"
  | "pm_interview"
  | "distributor"
  | "florida_hvhz"
  | "healthcare"
  | "iot_smart_building"
  | "revolving_door"
  | "iot_comparison";

// ── Expanded product interface ────────────────────────────────────────────────
export interface KeyProduct {
  name: string;
  type: string;           // door motion + energy class
  standard: string;       // A156.10 / A156.19 / A156.38
  notes: string;
  priceRange?: "economy" | "mid" | "premium" | "ultra-premium";
  keySpec?: string;       // one defining spec (max weight, clear opening, etc.)
  flHvhz?: "yes" | "no" | "verify" | "limited";
}

// ── Company profiles ──────────────────────────────────────────────────────────
export interface CompetitorProfile {
  id: CompetitorId;
  name: string;
  fullName: string;
  parentCompany?: string;
  hq: string;
  founded: string;
  color: string;
  tagline: string;
  marketPosition: string;
  primaryStrengths: string[];
  primaryWeaknesses: string[];
  keyProducts: KeyProduct[];
  thinkAboutThis: string;
}

// ── Battle card structure ─────────────────────────────────────────────────────
export interface BattleCard {
  competitor: CompetitorId;
  context: ContextId;
  headline: string;
  winThemes: WinTheme[];
  differentiators: Differentiator[];
  objectionHandlers: ObjectionHandler[];
  landmines: Landmine[];
  closingMove: string;
  talkTrack: string;
  winSignals: string[];
  loseSignals: string[];
  keyMetrics: string[];
}

export interface WinTheme {
  title: string;
  detail: string;
  proof?: string;
}

export interface Differentiator {
  dimension: string;
  ours: string;
  theirs: string;
  advantage: "strong" | "moderate" | "neutral" | "watch";
}

export interface ObjectionHandler {
  objection: string;
  response: string;
  bridgeTo?: string;
}

export interface Landmine {
  topic: string;
  risk: string;
  mitigation: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKET INTELLIGENCE DATA
// ─────────────────────────────────────────────────────────────────────────────

/** Approximate US/NA market share estimates (%) by segment — industry analyst composite, 2025 update
 *  North America automatic door market: ~$8.58B in 2024 (Stellar MR), $1.32B pedestrian segment
 *  Global automatic door market: $13.7B in 2024, growing 5.6% CAGR to $23.6B by 2034 (Global Market Insights)
 *  US pedestrian segment alone: ~$5.05B in 2023 growing 4.2% CAGR (Research & Markets)
 *  ASSA ABLOY Entrance Systems: global market leader, 4%+ global share
 *  Top 5 global players (ASSA ABLOY, dormakaba, GEZE, Horton, Nabtesco): ~12% combined global share
 *  Remaining 88%: highly fragmented across hundreds of regional and niche manufacturers
 *  NA pedestrian door key players: ASSA ABLOY, dormakaba, Stanley/Allegion, Horton, NABCO, TORMAX, GEZE,
 *    Boon Edam, FAAC, Nabtesco, Portalp, Automatic Systems, Micom (CA), LCN/Norton (Allegion)
 */
export const MARKET_SHARE_ESTIMATES = {
  usCommercialSliding: {
    assa_abloy: 35, stanley: 28, dormakaba: 14, horton: 11, other: 12,
  },
  usSwingOperators: {
    assa_abloy: 30, dormakaba: 23, stanley: 18, horton: 10, other: 19,
  },
  usHealthcare: {
    assa_abloy: 40, stanley: 27, dormakaba: 17, horton: 9, other: 7,
  },
  flHvhzSliding: {
    assa_abloy: 60, stanley: 20, dormakaba: 8, horton: 5, other: 7,
  },
  usRevolvingDoors: {
    assa_abloy: 42, dormakaba: 28, boon_edam: 18, stanley: 5, other: 7,
  },
  naAutoDoorTotal2025: {
    assa_abloy: 16, dormakaba: 13, stanley: 9, horton: 5, other: 57,
  },
};

/** Win likelihood by vertical, scored 1–5 (5 = strongest) */
export const WIN_LOSS_BY_VERTICAL: Record<
  CompetitorId,
  Record<string, number>
> = {
  assa_abloy: {
    retail: 4,
    healthcare: 5,
    hospitality: 5,
    airport: 5,
    industrial: 4,
    government: 5,
    qsr: 3,
    education: 4,
    florida_hvhz: 5,
  },
  dormakaba: {
    retail: 3,
    healthcare: 3,
    hospitality: 4,
    airport: 4,
    industrial: 3,
    government: 3,
    qsr: 2,
    education: 3,
    florida_hvhz: 2,
  },
  stanley: {
    retail: 5,
    healthcare: 3,
    hospitality: 3,
    airport: 3,
    industrial: 4,
    government: 4,
    qsr: 4,
    education: 4,
    florida_hvhz: 3,
  },
  horton: {
    retail: 4,
    healthcare: 2,
    hospitality: 2,
    airport: 2,
    industrial: 3,
    government: 2,
    qsr: 4,
    education: 3,
    florida_hvhz: 1,
  },
  boon_edam: {
    retail: 2,
    healthcare: 3,
    hospitality: 3,
    airport: 4,
    industrial: 2,
    government: 4,
    qsr: 1,
    education: 2,
    florida_hvhz: 1,
  },
  geze: {
    retail: 3,
    healthcare: 3,
    hospitality: 3,
    airport: 3,
    industrial: 2,
    government: 2,
    qsr: 1,
    education: 2,
    florida_hvhz: 1,
  },
  tormax: {
    retail: 3,
    healthcare: 2,
    hospitality: 2,
    airport: 2,
    industrial: 2,
    government: 2,
    qsr: 2,
    education: 2,
    florida_hvhz: 1,
  },
  nabtesco: {
    retail: 3,
    healthcare: 2,
    hospitality: 3,
    airport: 2,
    industrial: 2,
    government: 1,
    qsr: 1,
    education: 1,
    florida_hvhz: 1,
  },
  faac_group: {
    retail: 2,
    healthcare: 1,
    hospitality: 1,
    airport: 1,
    industrial: 2,
    government: 1,
    qsr: 1,
    education: 2,
    florida_hvhz: 1,
  },
};

/** Relative price positioning by SKU tier */
export const PRICING_SIGNAL_MATRIX = {
  economy: {
    assa_abloy: "SW60 (low-energy swing), SL500 (entry sliding)",
    dormakaba: "ED50 (light duty swing), ESA100 (standard sliding)",
    stanley: "Magic-Access 125 lb, Dura-Glide 2000 standard config",
    horton: "2000 Series (classic sliding)",
    indexNote: "Horton ≈ Stanley < dormakaba < ASSA ABLOY at economy tier",
  },
  mid: {
    assa_abloy: "SL500 full-feature, SW200i surface swing",
    dormakaba: "ESA200/300 full-breakout, ED100 surface swing",
    stanley: "Dura-Glide 3000, Magic-Force legacy, Dura-Glide GreenStar",
    horton: "9000 heavy-duty sliding, 4000 series swing",
    indexNote: "Stanley ≈ dormakaba; ASSA ABLOY 5–10% premium at mid tier",
  },
  premium: {
    assa_abloy: "SW300 slim/compact, VersaMax 2.0 healthcare, SL521 telescoping",
    dormakaba: "ED250 heavy-duty swing, KTV 3/4 revolving",
    stanley: "M-Force NEW 700 lb, Dura-Storm hurricane, ProCare 8300",
    horton: "ICU/CCU 2001/2003 healthcare, 7000 series swing",
    indexNote: "All brands converge at premium; ASSA ABLOY leads on spec compliance documentation",
  },
  ultra_premium: {
    assa_abloy: "RD300 all-glass revolving, RD700 high-capacity, ecoLOGIC AI platform",
    dormakaba: "KTC 3/4 high-capacity revolving (6.2m), KTV Atrium Flex all-glass",
    stanley: "Dura-Shield Blast, Industrial Slider 10,000",
    horton: "Not a significant player at ultra-premium tier",
    indexNote: "ASSA ABLOY and dormakaba compete directly at ultra-premium revolving; Stanley owns blast/industrial niche",
  },
};

/** 2025 Competitor Pricing Tier Matrix — by product category */
export const PRICING_TIER_DATA = {
  revolving: [
    { competitor: "ASSA ABLOY", tier: "Premium", note: "RD3–RD700, ecoLOGIC AI; broadest range", tierRank: 1 },
    { competitor: "Boon Edam", tier: "Premium", note: "Tourlock 180, Crystal; security niche premium", tierRank: 1 },
    { competitor: "dormakaba", tier: "Premium", note: "KTV magnetic levitation; European premium", tierRank: 1 },
    { competitor: "Horton", tier: "Not Present", note: "No revolving door line", tierRank: 4 },
    { competitor: "Allegion/Stanley", tier: "Not Present", note: "No revolving door line", tierRank: 4 },
  ],
  sliding: [
    { competitor: "ASSA ABLOY", tier: "Premium", note: "SL500/521, VersaMax; HVHZ certified", tierRank: 1 },
    { competitor: "GEZE", tier: "Premium", note: "Slimdrive 70mm; myGEZE IoT premium", tierRank: 1 },
    { competitor: "dormakaba", tier: "Mid", note: "ESA100–500; value-to-spec strength", tierRank: 2 },
    { competitor: "Allegion/Stanley", tier: "Mid", note: "Dura-Glide 2000; retail volume leader", tierRank: 2 },
    { competitor: "TORMAX", tier: "Mid", note: "TX9000 iMotion; 8–12% below ASSA ABLOY", tierRank: 2 },
    { competitor: "Horton", tier: "Value", note: "2000 Series; economy/legacy install base", tierRank: 3 },
    { competitor: "Nabtesco", tier: "Value", note: "AGD Systems OEM; precision value", tierRank: 3 },
  ],
  swing: [
    { competitor: "GEZE", tier: "Premium", note: "Powerturn; European glass-facade premium", tierRank: 1 },
    { competitor: "ASSA ABLOY", tier: "Premium", note: "SW300-S, SW200i; slim + healthcare", tierRank: 1 },
    { competitor: "dormakaba", tier: "Mid", note: "ED100/250; best value heavy-duty swing", tierRank: 2 },
    { competitor: "Allegion/Stanley", tier: "Mid", note: "M-Force NEW 700lb; iQ Controller", tierRank: 2 },
    { competitor: "TORMAX", tier: "Mid", note: "iMotion 1401; competitive mid-tier", tierRank: 2 },
    { competitor: "FAAC Group", tier: "Value", note: "A952 May 2025; market entry pricing", tierRank: 3 },
    { competitor: "Horton", tier: "Value", note: "4000/7000 series; regional Sun Belt", tierRank: 3 },
  ],
  security_entrance: [
    { competitor: "Boon Edam", tier: "Premium", note: "Tourlock 180 + Alcatraz biometric; anti-tailgating leader", tierRank: 1 },
    { competitor: "ASSA ABLOY", tier: "Premium", note: "RD3A/RD4A1 OSDP v2 integrated revolving", tierRank: 1 },
    { competitor: "dormakaba", tier: "Premium", note: "KTV access-control revolving", tierRank: 1 },
    { competitor: "Allegion/Stanley", tier: "Mid", note: "Schlage access control integration only; no revolving", tierRank: 2 },
    { competitor: "GEZE", tier: "Mid", note: "Boxer + myGEZE; no dedicated security revolving", tierRank: 2 },
  ],
};

/** IoT Platform Comparison — 2025 feature matrix */
export const IOT_COMPARISON_DATA = [
  {
    feature: "Remote diagnostics",
    assa_abloy: "ecoLOGIC + SW300-S Bluetooth App",
    geze: "myGEZE Control (cloud, Nov 2025)",
    dormakaba: "AI predictive platform (32% less downtime claimed)",
    allegion_stanley: "Limited — iQ Controller BLE local only",
  },
  {
    feature: "Predictive maintenance",
    assa_abloy: "SW300-S fault alerts + cycle count logging",
    geze: "myGEZE ML-based component prediction",
    dormakaba: "AI-based component wear prediction",
    allegion_stanley: "Basic — no ML/AI component",
  },
  {
    feature: "BMS/HVAC integration",
    assa_abloy: "ecoLOGIC BACnet/Modbus; ASHRAE 90.1 compatible",
    geze: "myGEZE BMS native; IQ windowdrive HVAC integration",
    dormakaba: "Partial BMS integration",
    allegion_stanley: "Schlage integration only; no door-level BMS",
  },
  {
    feature: "Biometric integration",
    assa_abloy: "OSDP v2 access-control ready; RD3A/RD4A1 integrated",
    geze: "Limited — relies on third-party access control",
    dormakaba: "dormakaba Kaba platform + biometric readers",
    allegion_stanley: "Schlage fingerprint + Stanley auto door (Seamless Access)",
  },
  {
    feature: "Over-the-air updates",
    assa_abloy: "SW300-S Bluetooth firmware update",
    geze: "myGEZE cloud OTA updates",
    dormakaba: "Partial — select products only",
    allegion_stanley: "Not available",
  },
  {
    feature: "Energy management",
    assa_abloy: "ecoLOGIC AI — up to 80% HVAC infiltration reduction",
    geze: "Energy monitoring via myGEZE; no AI optimization",
    dormakaba: "No equivalent AI energy platform for US market",
    allegion_stanley: "No AI energy platform",
  },
  {
    feature: "US deployment maturity",
    assa_abloy: "2025 launch — growing US install base",
    geze: "European-mature; limited US enterprise deployments",
    dormakaba: "In development for US market",
    allegion_stanley: "Not applicable",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPETITOR PROFILES
// ─────────────────────────────────────────────────────────────────────────────

export const COMPETITORS: Record<CompetitorId, CompetitorProfile> = {

  // ── ASSA ABLOY Entrance Systems ─────────────────────────────────────────────
  assa_abloy: {
    id: "assa_abloy",
    name: "ASSA ABLOY ENS",
    fullName: "ASSA ABLOY Entrance Systems",
    parentCompany: "ASSA ABLOY Group (Sweden)",
    hq: "Woking, UK (global); Canton, OH (US)",
    founded: "1994 (ASSA ABLOY Group)",
    color: "#003087",
    tagline: "Opening doors to a safer world",
    marketPosition:
      "Global #1 in automatic entrance systems. Broadest portfolio spanning sliding, swing, folding, revolving, and hermetic doors. Strongest US field-service and HVHZ-certified lineup. The reference standard for healthcare, hospitality, and government. ecoLOGIC AI energy management platform (2025) extends competitive moat into smart-building space.",
    primaryStrengths: [
      "Broadest product portfolio: sliding (SL500/521), swing (SW60-SW300), revolving (RD3–RD700), hermetic, healthcare",
      "Strongest FL HVHZ/NOA-certified exterior product lineup; TAS 201/202/203 test documentation available",
      "Deepest US AAADM-certified field service network — all 50 states",
      "ecoLOGIC AI energy management (2025) — real-time AI-driven energy savings, sensor fusion",
      "VersaMax 2.0 — purpose-built FGI-compliant healthcare platform with infection-control modes",
      "SW300-S BAU 2025: app-configured slim swing operator — fastest setup-to-open in class",
      "OSDP v2 + ABLOY ecosystem integration — enterprise access control depth",
      "Revolving door leadership: RD700 High Capacity for airports; RD300 All-Glass for hospitality",
    ],
    primaryWeaknesses: [
      "Premium price positioning — 5–15% above dormakaba and Stanley on comparable SKUs",
      "Complex product portfolio can overwhelm specifiers and distributors without training",
      "Slim-profile sliding header depth vs. GEZE Slimdrive (70mm): ASSA ABLOY is competitive but not class-leading",
      "ecoLOGIC AI is 2025 technology — limited field deployment data vs. mature competitor products",
      "Some specialty products (RD700, ecoLOGIC) require longer lead times vs. commodity SKUs",
    ],
    keyProducts: [
      { name: "SL500", type: "Sliding (full energy)", standard: "A156.10", notes: "Core commercial sliding door — reliable, broad opening sizes", priceRange: "mid", keySpec: "Up to 1800 mm clear opening", flHvhz: "yes" },
      { name: "SL500 Clean Room", type: "Sliding hermetic (full energy)", standard: "A156.10", notes: "Hospital/pharma hermetic sliding; positive pressure sealing", priceRange: "premium", keySpec: "IP54 rated, HEPA-compatible gaskets", flHvhz: "verify" },
      { name: "SL521 Telescoping", type: "Telescoping sliding (full energy)", standard: "A156.10", notes: "Narrow opening telescoping for space-constrained entrances", priceRange: "premium", keySpec: "Clear opening ≥ 1200 mm in tight fascia", flHvhz: "verify" },
      { name: "VersaMax 2.0", type: "Sliding (full energy, healthcare)", standard: "A156.10", notes: "Purpose-built FGI-compliant healthcare; antimicrobial finish, infection-control mode", priceRange: "ultra-premium", keySpec: "FGI 2022 compliant; 99.9% antimicrobial surface", flHvhz: "yes" },
      { name: "SW60", type: "Swing (low energy)", standard: "A156.19", notes: "Economy low-energy swing operator; compact retrofit", priceRange: "economy", keySpec: "Up to 125 lb / 57 kg door", flHvhz: "limited" },
      { name: "SW100", type: "Swing (low energy)", standard: "A156.19", notes: "Value swing operator for light-duty commercial", priceRange: "economy", keySpec: "Up to 150 lb door weight", flHvhz: "limited" },
      { name: "SW200i Surface", type: "Swing (full energy, surface mount)", standard: "A156.10", notes: "Mid-range full-energy surface swing; field-adjustable", priceRange: "mid", keySpec: "Up to 265 lb / 120 kg door", flHvhz: "yes" },
      { name: "SW200i-IG", type: "Swing (full energy, in-ground)", standard: "A156.10", notes: "In-ground actuator — clean aesthetic, no visible hardware", priceRange: "premium", keySpec: "Up to 800 lb / 360 kg door", flHvhz: "yes" },
      { name: "SW200 OHC", type: "Swing (full energy, overhead concealed)", standard: "A156.10", notes: "Hidden overhead concealed actuator; high-end retail and hospitality", priceRange: "premium", keySpec: "Max door width 1400 mm", flHvhz: "yes" },
      { name: "SW300", type: "Swing (full + low energy, slim)", standard: "A156.10 / A156.19", notes: "Slim compact operator fits 85 mm frame — one SKU for full and low energy modes", priceRange: "premium", keySpec: "85 mm header depth; dual-mode full/low energy", flHvhz: "yes" },
      { name: "SW300-S", type: "Swing (app-configured, BAU 2025)", standard: "A156.10 / A156.19", notes: "New BAU 2025 launch — smartphone app configuration, fastest field setup", priceRange: "premium", keySpec: "BLE app setup < 5 min; full + low energy modes", flHvhz: "yes" },
      { name: "RD3 / RD4 Compact", type: "Revolving (3- and 4-wing)", standard: "A156.27", notes: "Compact revolving for mid-traffic commercial; 2.0–2.5 m diameter", priceRange: "mid", keySpec: "2.0–2.5 m diameter; 1200 persons/hr", flHvhz: "no" },
      { name: "RD300 All-Glass", type: "Revolving (all-glass, 3/4-wing)", standard: "A156.27", notes: "Frameless all-glass revolving — premium hospitality and corporate lobbies", priceRange: "ultra-premium", keySpec: "Up to 3.6 m diameter; up to 2400 persons/hr", flHvhz: "no" },
      { name: "RD600 UniTurn", type: "Revolving (motorized)", standard: "A156.27", notes: "Motorized revolving; barrier-free compliant, ADA-compatible", priceRange: "premium", keySpec: "Up to 2800 persons/hr; ADA compliant", flHvhz: "no" },
      { name: "RD700 High Capacity", type: "Revolving (high-traffic)", standard: "A156.27", notes: "Airport and stadium revolving; highest throughput in class", priceRange: "ultra-premium", keySpec: "Up to 3600 persons/hr; 6 m diameter option", flHvhz: "no" },
      { name: "RD3A / RD4A1", type: "Revolving (access-control integrated)", standard: "A156.27", notes: "Revolving with integrated biometric/card access control; OSDP v2", priceRange: "ultra-premium", keySpec: "OSDP v2; integrated access control panel", flHvhz: "no" },
      { name: "ecoLOGIC AI", type: "AI energy management platform (2025)", standard: "ASHRAE 90.1 compatible", notes: "AI-driven door operation optimization — learns traffic patterns, reduces HVAC load", priceRange: "ultra-premium", keySpec: "Up to 80% energy savings vs. manual door; API for BAS integration", flHvhz: "yes" },
    ],
    thinkAboutThis: "ASSA ABLOY ENS wins on portfolio breadth, FL certification, healthcare compliance, and service network. Premium price is a given — anchor to lifecycle value and compliance depth.",
  },

  // ── dormakaba ───────────────────────────────────────────────────────────────
  dormakaba: {
    id: "dormakaba",
    name: "dormakaba",
    fullName: "dormakaba Group",
    hq: "Rümlang, Switzerland",
    founded: "2015 (merger of Dorma + Kaba)",
    color: "#C8102E",
    tagline: "Access — for a better world",
    marketPosition:
      "Global #2 in access and security. Strong European heritage and CE compliance pedigree. ED swing series (ED50/ED100/ED250) delivers excellent value-to-spec for medium and heavy-duty swing applications. KTV revolving series is the European aesthetic benchmark. Thinner US field-service and HVHZ-certification footprint than ASSA ABLOY.",
    primaryStrengths: [
      "ES series sliding (ESA100–ESA500) — comprehensive North American sliding portfolio with value-to-spec pricing",
      "ED swing series: ED50 (160 kg), ED100 (160 kg), ED250 (400 kg / 1600 mm) — best value in class",
      "KTV 3/4 revolving with magnetic levitation — ultra-quiet premium aesthetic",
      "KTC 3/4 high-capacity revolving (6.2 m diameter) — airport/convention center market",
      "ESA sliding series — comprehensive North American portfolio (ESA100 through ESA500)",
      "Strong Kaba access-control legacy — deep institutional integration history",
      "Competitive price point: 5–12% below ASSA ABLOY on like-for-like swing and sliding",
      "BST/FBST curved sliding — unique curved sliding for retail flagship stores",
    ],
    primaryWeaknesses: [
      "Limited HVHZ-certified exterior product line — verify NOA before FL HVHZ bids",
      "Thinner US field-service and AAADM-trained technician density vs. ASSA ABLOY",
      "Weaker healthcare/FGI-specific product marketing and specification support in US",
      "ES series header depth not class-leading vs. GEZE Slimdrive (70 mm) — ESA series is competitive but slim-profile glass facade commercial favors GEZE",
      "KTV/KTC revolving: primary certification is EN 16005 (European) — US ANSI/BHMA A156.27 status must be verified with dormakaba US before any North American specification",
      "KTV/KTC revolving lead times can be long on North American projects — 12–36 months for custom configurations",
      "ecoLOGIC equivalent not yet announced — no AI energy management platform in US market",
    ],
    keyProducts: [
      { name: "ESA100", type: "Sliding (full energy, standard)", standard: "A156.10", notes: "Standard North American sliding door — workhorse for commercial retail", priceRange: "mid", keySpec: "Up to 1800 mm clear opening", flHvhz: "verify" },
      { name: "ESA200", type: "Sliding (full breakout, fine-frame)", standard: "A156.10", notes: "Full-breakout bi-parting with fine-frame aesthetic — glass facades and retail", priceRange: "mid", keySpec: "Full breakout for egress; narrow stile visible", flHvhz: "verify" },
      { name: "ESA300", type: "Sliding (fixed sidelite)", standard: "A156.10", notes: "Integrated fixed sidelite for wider opening frames", priceRange: "mid", keySpec: "Fixed sidelite configuration; up to 2400 mm frame", flHvhz: "verify" },
      { name: "ESA300T", type: "Telescoping sliding", standard: "A156.10", notes: "Telescoping variant for narrow opening widths", priceRange: "mid", keySpec: "Telescoping: 30% wider clear opening in same fascia", flHvhz: "verify" },
      { name: "ESA400", type: "Sliding (enhanced)", standard: "A156.10", notes: "Enhanced sliding with improved thermal performance and sensor options", priceRange: "premium", keySpec: "Enhanced thermal break; ASTM E283 air infiltration option", flHvhz: "verify" },
      { name: "ESA500", type: "Telescoping sliding (extra-wide)", standard: "A156.10", notes: "Extra-wide telescoping for high-traffic retail and institutional", priceRange: "premium", keySpec: "Extra-wide: up to 3600 mm clear opening with telescoping leaves", flHvhz: "verify" },
      { name: "BST / FBST Curved Sliding", type: "Curved sliding", standard: "EN 16005", notes: "Curved sliding for premium retail flagship and hospitality lobbies — unique product niche", priceRange: "ultra-premium", keySpec: "Custom radius curved track; up to 3600 mm opening", flHvhz: "no" },
      { name: "ED50", type: "Swing (low energy, light)", standard: "A156.19", notes: "Light-duty surface-mount swing operator — economy/retrofit", priceRange: "economy", keySpec: "Up to 160 kg / 1100 mm door", flHvhz: "limited" },
      { name: "ED100", type: "Swing (medium, surface)", standard: "A156.19 / A156.10", notes: "Compact surface-mount swing — healthcare and institutional workhorse", priceRange: "mid", keySpec: "Up to 160 kg / 1100 mm door; dual-mode full/low energy", flHvhz: "verify" },
      { name: "ED250", type: "Swing (heavy, surface)", standard: "A156.10", notes: "Heavy-duty full-energy surface swing — high-traffic institutional and industrial", priceRange: "premium", keySpec: "Up to 400 kg / 1600 mm door — heaviest surface-mount in class", flHvhz: "verify" },
      { name: "ED OHC", type: "Swing (overhead concealed)", standard: "A156.10", notes: "Overhead-concealed actuator for clean interior aesthetics", priceRange: "premium", keySpec: "Concealed in floor/frame — zero visible hardware", flHvhz: "verify" },
      { name: "ED-IG", type: "Swing (in-ground)", standard: "A156.10", notes: "In-ground actuator for monumental entrances; no visible surface hardware", priceRange: "premium", keySpec: "In-ground; up to 400 kg door weight", flHvhz: "verify" },
      { name: "KTV 3/4", type: "Revolving (3- and 4-wing, magnetic levitation)", standard: "EN 16005 / A156.27 (verify US)", notes: "Premium revolving with magnetic levitation — ultra-quiet, 3.8 m diameter max. Primary certification EN 16005 (European); US A156.27 status must be verified with dormakaba US before North American specification.", priceRange: "ultra-premium", keySpec: "3.8 m diameter; magnetic levitation drive = near-silent operation", flHvhz: "no" },
      { name: "KTV Atrium Flex", type: "Revolving (all-glass, flex)", standard: "EN 16005 / A156.27 (verify US)", notes: "All-glass flexible-wing revolving for hospitality lobbies and airports. Primary certification EN 16005; verify US A156.27 certification before specifying for US projects.", priceRange: "ultra-premium", keySpec: "All-glass; collapsible wings for emergency egress", flHvhz: "no" },
      { name: "KTC 3/4", type: "Revolving (high-capacity)", standard: "EN 16005 / A156.27 (verify US)", notes: "High-capacity revolving for airports and convention centers; 6.2 m diameter. Primary certification EN 16005; US A156.27 status unconfirmed — verify with dormakaba US for US airport specifications.", priceRange: "ultra-premium", keySpec: "6.2 m diameter; highest dormakaba throughput", flHvhz: "no" },
      { name: "KTC 2", type: "Revolving (2-wing + sliding)", standard: "EN 16005 (revolving) / A156.10-2024 (sliding panel) / A156.27 (verify US)", notes: "2-wing revolving with integrated ST FLEX sliding bypass panel in drum wall. Dual-standard compliance: revolving component governed by A156.27 (verify with dormakaba US), sliding panel governed by A156.10-2024.", priceRange: "ultra-premium", keySpec: "Integrated bypass sliding + revolving in one assembly", flHvhz: "no" },
    ],
    thinkAboutThis: "dormakaba wins on aesthetics and ED swing value. Lose to them on header depth (ES series vs. GEZE Slimdrive), heavy-swing price/weight (ED250), and European hospitality spec. Win on FL HVHZ, US service density, and healthcare/FGI depth. Critical revolving door angle: KTV/KTC carry EN 16005 (European standard) as their primary certification — US ANSI/BHMA A156.27 status is unconfirmed. Always ask the customer to request A156.27 test documentation from dormakaba US before the revolving door bid closes. If they can't produce it, the spec closes for us on compliance alone.",
  },

  // ── Stanley Access Technologies (Allegion) ──────────────────────────────────
  stanley: {
    id: "stanley",
    name: "Allegion/Stanley",
    fullName: "Stanley Access Technologies (Allegion)",
    parentCompany: "Allegion plc — $2.9B+ revenue, integrates Schlage, Von Duprin, LCN, CISA, SimonsVoss",
    hq: "Farmington, CT (operations); Princeton, NJ (Allegion HQ)",
    founded: "1925 (Stanley); Allegion acquired Stanley Access Technologies July 5, 2022 for $900M",
    color: "#FFB900",
    tagline: "Access solutions built on trust",
    marketPosition:
      "Stanley Access Technologies was acquired by Allegion plc on July 5, 2022 for $900M, with the brand retained as 'Stanley Access Technologies', fundamentally reshaping the competitive threat. Under Allegion, Stanley is no longer a standalone automatic door company — it is the automatic door component of Allegion's Seamless Access strategy: a bundled platform combining automatic door operators (Stanley), door closers (LCN), exit devices (Von Duprin), electrified locks (Schlage), and access control software across every commercial opening. This integration means Allegion/Stanley can offer architects, facility managers, and institutional owners a single-vendor complete opening solution — door + hardware + access control + service — in a way standalone Stanley never could. The Dura-Glide 2000 remains the #1 installed US retail sliding door, now backed by Allegion's $2.9B+ enterprise distribution and Schlage/Von Duprin ecosystem. M-Force NEW (700 lb, iQ Controller) competes directly with SW300 in premium swing. The Allegion integration is a strategic escalation that demands updated competitive framing.",
    primaryStrengths: [
      "Dura-Glide 2000 — deepest US commercial/retail sliding install base; GC default spec",
      "Dura-Storm 2000/3000 — specifically hurricane-rated (Impact Level D and E); dedicated FL HVHZ portfolio",
      "Nationwide US distributor and service network — comparable density to ASSA ABLOY in retail",
      "M-Force NEW 700 lb with iQ Controller — premium swing for heavy doors; genuine competitor to SW300",
      "ProCare healthcare sliding line (8300/8300A/8300BP) — hospital-specific feature set",
      "Dura-Glide GreenStar: ASTM E283-tested, -61% air infiltration vs. standard sliding",
      "Dura-Shield Blast — blast-resistant automatic door; unique US government/DoD niche",
      "Allegion ecosystem integration (Schlage access control, LCN door closers, Von Duprin exit devices)",
      "Seamless access strategy bundling hardware + software across the opening — single vendor for GC and owner",
    ],
    primaryWeaknesses: [
      "Allegion integration is still maturing — cross-brand bundling requires significant channel re-education",
      "Swing line (Magic-Access, Magic-Force) remains narrower than ASSA ABLOY SW or dormakaba ED series",
      "No AI energy management / smart building platform comparable to ecoLOGIC",
      "Revolving door portfolio is absent — cannot serve hotel lobbies, airports, or revolving specs",
      "Healthcare FGI-compliance marketing less developed vs. VersaMax 2.0",
      "Access control integration now more unified via Schlage, but Allegion ecosystem is closed/proprietary vs. OSDP v2 open protocol",
      "Dura-Storm is FL-rated but limited HVHZ-certified product breadth beyond hurricane-specific SKUs",
    ],
    keyProducts: [
      { name: "Dura-Glide 2000", type: "Sliding (full energy, partial breakout)", standard: "A156.10", notes: "US retail/commercial #1 seller — most widely installed automatic sliding door in America", priceRange: "mid", keySpec: "Partial breakout panel; up to 1800 mm clear opening", flHvhz: "verify" },
      { name: "Dura-Glide 3000", type: "Sliding (full energy, full breakout)", standard: "A156.10", notes: "Full breakout bi-parting for egress compliance and emergency evacuation", priceRange: "mid", keySpec: "Full breakout; ADA/egress compliant opening", flHvhz: "verify" },
      { name: "Dura-Glide All-Glass", type: "Sliding (full energy, all-glass)", standard: "A156.10", notes: "Frameless all-glass sliding for premium retail and hospitality ground floor", priceRange: "premium", keySpec: "Frameless tempered glass panels; minimal header", flHvhz: "verify" },
      { name: "Dura-Glide GreenStar", type: "Sliding (energy-efficient)", standard: "A156.10 / ASTM E283", notes: "ASTM E283 air infiltration certified; -61% air infiltration vs. standard sliding. IECC/LEED credit eligible.", priceRange: "mid", keySpec: "ASTM E283 @ -1.57 psf; 0.18 cfm/ft² air infiltration", flHvhz: "yes" },
      { name: "Dura-Glide Telescopic 5200", type: "Telescoping sliding (2+2)", standard: "A156.10", notes: "Two-panel telescoping for narrow opening widths", priceRange: "premium", keySpec: "2+2 telescoping; wider clear opening in same fascia", flHvhz: "verify" },
      { name: "Dura-Glide Telescopic 5300", type: "Telescoping sliding (3+3)", standard: "A156.10", notes: "Three-panel telescoping for maximum clear opening in constrained openings", priceRange: "premium", keySpec: "3+3 telescoping; maximum clear opening in narrowest fascia", flHvhz: "verify" },
      { name: "Dura-Fit", type: "Narrow telescoping sliding", standard: "A156.10", notes: "Ultra-narrow profile telescoping for retrofit applications", priceRange: "mid", keySpec: "Fits in 8\" rough opening; retrofit-friendly", flHvhz: "verify" },
      { name: "Dura-Guard", type: "Sliding (heavy-duty)", standard: "A156.10", notes: "Heavy-duty commercial/industrial sliding for warehouses, hospitals, and high-traffic", priceRange: "premium", keySpec: "Heavy-duty track; up to 500 lb leaf weight", flHvhz: "verify" },
      { name: "Dura-Storm 2000", type: "Sliding (hurricane-rated, bi-parting)", standard: "A156.10 / ASTM E1886/E1996", notes: "Hurricane-rated sliding for FL HVHZ exterior; Impact Level D. NOA-eligible.", priceRange: "premium", keySpec: "Impact Level D (large missile 9 lb, 50 ft/s); ASTM E1886/E1996", flHvhz: "yes" },
      { name: "Dura-Storm 3000", type: "Sliding (hurricane-rated, breakout)", standard: "A156.10 / ASTM E1886/E1996", notes: "Full-breakout hurricane sliding for FL HVHZ exterior; Impact Level E", priceRange: "premium", keySpec: "Impact Level E (extra-large missile); full breakout for egress", flHvhz: "yes" },
      { name: "Dura-Shield Blast", type: "Blast-resistant sliding", standard: "GSA-TS01-2003 / DoD UFC", notes: "Blast-resistant automatic sliding for government, embassy, and DoD applications", priceRange: "ultra-premium", keySpec: "GSA-TS01-2003 Level 3 blast resistance", flHvhz: "verify" },
      { name: "Dura-Glide DT", type: "Sliding (drive-thru)", standard: "A156.10", notes: "Drive-through window application; temperature-controlled opening for QSR/banking", priceRange: "mid", keySpec: "Drive-thru pass-through; climate-seal gasket system", flHvhz: "limited" },
      { name: "Industrial Slider 10,000", type: "Sliding (industrial heavy-duty)", standard: "A156.10", notes: "Industrial-grade slider for large openings; warehouse, manufacturing, cold storage", priceRange: "ultra-premium", keySpec: "Up to 10,000 lb door panel; motor-driven track system", flHvhz: "limited" },
      { name: "Magic-Access", type: "Swing (low energy)", standard: "A156.19", notes: "Light-duty low-energy swing operator; most common US retail/light commercial install", priceRange: "economy", keySpec: "Up to 125 lb door; surface mount", flHvhz: "limited" },
      { name: "M-Force NEW", type: "Swing (full energy, heavy-duty)", standard: "A156.10 / A156.19", notes: "New generation M-Force with iQ Controller; 700 lb capacity, dual-mode full+low energy", priceRange: "premium", keySpec: "700 lb / 317 kg door capacity; iQ Controller BLE diagnostics", flHvhz: "verify" },
      { name: "ProCare 8300", type: "Sliding (healthcare)", standard: "A156.10", notes: "Healthcare-specific sliding with antimicrobial surfaces and low-force operation", priceRange: "premium", keySpec: "FGI-compatible; antimicrobial finish standard", flHvhz: "verify" },
      { name: "ProCare 8300A", type: "Sliding (healthcare, ADA)", standard: "A156.10", notes: "ADA-compliant healthcare sliding with integrated accessibility features", priceRange: "premium", keySpec: "ADA §4.13; low-force + automatic modes", flHvhz: "verify" },
      { name: "ProCare 8300BP", type: "Sliding (healthcare, bi-parting)", standard: "A156.10", notes: "Bi-parting healthcare sliding for wide ICU and surgical suite openings", priceRange: "premium", keySpec: "Bi-parting; up to 2400 mm clear opening for large-equipment corridors", flHvhz: "verify" },
      { name: "Dura-Care 7500A", type: "Sliding (long-term care)", standard: "A156.10", notes: "Long-term care and assisted living sliding; dementia-unit safe features", priceRange: "premium", keySpec: "Delayed close; quiet operation < 55 dB; wandering prevention mode", flHvhz: "verify" },
      { name: "Magic-Swing Bifold", type: "Folding (bifold swing)", standard: "A156.10", notes: "Bifold swing for narrow openings where standard swing clearance is unavailable", priceRange: "mid", keySpec: "Bifold: 50% door leaf width required for swing clearance", flHvhz: "limited" },
    ],
    thinkAboutThis: "The Allegion acquisition in July 2022 changed the competitive calculus fundamentally. This is no longer just a sliding door battle. Allegion/Stanley can now bundle automatic doors with Schlage access control, LCN closers, and Von Duprin exit devices in a single proposal. ASSA ABLOY must compete as a platform — ABLOY + ecoLOGIC + Entrance Systems — and make the case that our open-ecosystem OSDP v2 integration beats Allegion's closed Schlage/Stanley bundle for enterprise and institutional buyers. Win on revolving doors (zero Allegion coverage), healthcare FGI spec, smart building IoT (ecoLOGIC vs. nothing), and HVHZ FL exterior. Watch for Allegion bundling at national accounts where Schlage is already entrenched.",
  },

  // ── Horton Automatics ───────────────────────────────────────────────────────
  horton: {
    id: "horton",
    name: "Horton",
    fullName: "Horton Automatics",
    parentCompany: "Overhead Door Corporation / Sanwa Holdings",
    hq: "Corpus Christi, TX",
    founded: "1960",
    color: "#E87722",
    tagline: "Opening doors for a better world",
    marketPosition:
      "Division of Overhead Door Corporation (Sanwa Holdings, Japan). Strong US legacy install base, especially in grocery, QSR, and Sun Belt commercial. Horton 2000 Series has massive installed base — service revenue moat. Regional US player but with national distributor footprint. 9000 series heavy-duty sliding for industrial applications. ICU/CCU healthcare sliding (2000/2001/2003) for hospitals. S8000 drive-thru window. No revolving door portfolio.",
    primaryStrengths: [
      "Horton 2000 Series — massive US grocery and retail install base; decades of service revenue moat",
      "9000 Series heavy-duty sliding — industrial and high-traffic commercial applications",
      "ICU/CCU 2000/2001/2003 — dedicated healthcare hospital sliding door family",
      "S8000 Drive-thru Window — strong QSR/banking drive-through market presence",
      "4000 series swing operators — solid mid-tier commercial swing presence",
      "7000 series swing/folding — bifold and specialty configurations",
      "Competitive pricing: often 8–15% below ASSA ABLOY on standard sliding",
      "Regional service density in Sun Belt (TX, FL, SE) — fast local response time",
    ],
    primaryWeaknesses: [
      "Limited specific HVHZ/NOA certification data publicly available — verify before FL exterior bids",
      "No revolving door portfolio — cannot compete in hospitality, airport, or lobby revolving specs",
      "No AI/smart building platform — no equivalent to ecoLOGIC or connected building integration",
      "Thinner national service coverage outside Sun Belt — Northeast and Pacific Northwest gaps",
      "Smaller parent (Overhead Door / Sanwa) vs. ASSA ABLOY ($14B+) or SB&D",
      "Limited FGI-specific product marketing for healthcare spec — competes on price not compliance",
      "Swing operator line narrower and less technically differentiated vs. ASSA ABLOY SW or dormakaba ED",
      "Product innovation pace slower — 2000 Series design is decades old without major platform refresh",
    ],
    keyProducts: [
      { name: "2000 Series", type: "Sliding (full energy, classic)", standard: "A156.10", notes: "Classic US automatic sliding door with massive installed base in grocery, retail, QSR", priceRange: "economy", keySpec: "Most-installed automatic sliding door in US grocery; decades of parts availability", flHvhz: "limited" },
      { name: "2000 Series Telescoping", type: "Telescoping sliding", standard: "A156.10", notes: "Telescoping variant of 2000 series for narrow opening applications", priceRange: "mid", keySpec: "Telescoping; fits in openings too narrow for standard bi-parting", flHvhz: "limited" },
      { name: "9000 Series", type: "Sliding (heavy-duty)", standard: "A156.10", notes: "Heavy-duty commercial sliding for high-traffic and demanding environments", priceRange: "mid", keySpec: "Heavy-duty track; high daily cycle rating for grocery and industrial", flHvhz: "verify" },
      { name: "ICU/CCU 2000", type: "Sliding (healthcare)", standard: "A156.10", notes: "Hospital ICU/CCU sliding — low-force, quiet operation for critical care", priceRange: "premium", keySpec: "ICU/CCU rated; low decibel operation; delayed close", flHvhz: "verify" },
      { name: "ICU/CCU 2001", type: "Sliding (healthcare, bi-parting)", standard: "A156.10", notes: "Bi-parting ICU/CCU for wide critical care corridor openings", priceRange: "premium", keySpec: "Bi-parting; up to 2400 mm clear for large-equipment passages", flHvhz: "verify" },
      { name: "ICU/CCU 2003", type: "Sliding (healthcare, manual-open backup)", standard: "A156.10", notes: "Healthcare sliding with manual-open backup for power failure safety", priceRange: "premium", keySpec: "Fail-safe manual backup; auto-open on power loss option", flHvhz: "verify" },
      { name: "4000 Series Swing", type: "Swing (full + low energy)", standard: "A156.10 / A156.19", notes: "Commercial swing operator for standard commercial and institutional applications", priceRange: "mid", keySpec: "Up to 200 lb door; dual-mode full + low energy", flHvhz: "limited" },
      { name: "4200 Bifold", type: "Folding (bifold swing)", standard: "A156.10", notes: "Bifold swing for narrow openings", priceRange: "mid", keySpec: "Bifold for tight vestibule openings", flHvhz: "limited" },
      { name: "7000 Series Swing", type: "Swing (heavy-duty)", standard: "A156.10", notes: "Heavy-duty swing for large, heavy doors in institutional settings", priceRange: "premium", keySpec: "Up to 400 lb door; heavy-duty commercial swing", flHvhz: "limited" },
      { name: "7600 Bifold", type: "Folding (heavy bifold)", standard: "A156.10", notes: "Heavy-duty bifold for large openings where swing clearance is unavailable", priceRange: "premium", keySpec: "Heavy bifold; high-traffic institutional application", flHvhz: "limited" },
      { name: "S8000 Drive-thru Window", type: "Drive-thru sliding window", standard: "A156.10", notes: "Drive-through window for QSR, banking, pharmacy — dedicated pass-through product", priceRange: "mid", keySpec: "Climate-seal pass-through; audio system integration option", flHvhz: "limited" },
      { name: "Tormax iMotion (OEM)", type: "Sliding (full energy, OEM)", standard: "A156.10", notes: "Horton distributes select Tormax iMotion products in US channels for specialty applications", priceRange: "mid", keySpec: "Tormax OEM; specific configurations per project", flHvhz: "verify" },
    ],
    thinkAboutThis: "Horton's moat is service revenue from the massive 2000 Series install base — grocers know Horton techs by name. Win against them on revolving (zero competition), FL HVHZ cert, healthcare FGI spec, IoT/smart building, and projects outside Sun Belt. Don't try to displace them at a customer who's been buying 2000 Series for 30 years without a compelling reason to switch.",
  },

  // ── Boon Edam International ────────────────────────────────────────────
  boon_edam: {
    id: "boon_edam",
    name: "Boon Edam",
    fullName: "Boon Edam International",
    parentCompany: "Independent (private, Dutch)",
    hq: "Raleigh, NC (US HQ); Edam, Netherlands (global HQ)",
    founded: "1873",
    color: "#0057A8",
    tagline: "Securing entryways worldwide",
    marketPosition:
      "The global dominant force in security revolving doors, optical turnstiles, and anti-tailgating entrance technology. Founded 1873 in the Netherlands, Boon Edam has carved an unassailable niche in high-security corporate, data center, financial institution, government, and airport entrances. Their Tourlock 180 is the reference product for anti-tailgating security vestibules worldwide. ISC West 2026 demonstrated full biometric integration — Alcatraz Rock X facial recognition fused with Tourlock 180. Revenue approximately $400M. Core weakness: their portfolio is almost entirely revolving doors and speed gates — they do not compete meaningfully in everyday automatic sliding or swing applications, have no HVHZ-rated product line, and their US service network is thin compared to ASSA ABLOY's AAADM-certified national density.",
    primaryStrengths: [
      "Tourlock 180 — global reference product for anti-tailgating security vestibules; 150-year heritage",
      "Speedlane optical turnstiles — dominant in corporate lobby access control gates",
      "Biometric integration: ISC West 2026 Alcatraz Rock X facial recognition + Tourlock 180 — leading-edge identity verification at the door",
      "BoonAssist manual revolving — premium manual revolving for corporate lobbies and transit",
      "Crystal revolving door — all-glass manual revolving for architectural prestige projects",
      "Circlelock security portal — mantrap/airlock for high-security single-occupancy verification",
      "Deep expertise in physical security standards (ANSI/SIA, EN 17352) and anti-tailgating technology",
      "Strong relationships with corporate security specifiers, data center architects, and financial institution facility managers",
    ],
    primaryWeaknesses: [
      "Virtually no automatic sliding or swing door product — cannot serve 80%+ of a facility's everyday openings",
      "No HVHZ-rated product line — Florida hurricane zone projects require supplemental sourcing",
      "US service network is thinner than ASSA ABLOY AAADM-certified national coverage",
      "A156.10 compliance documentation depth limited vs. US-native competitors",
      "No healthcare FGI-compliant automatic sliding product for ICU/OR/clean room applications",
      "No AI energy management or BAS/BMS integration platform",
      "Premium price point with limited flexibility at budget-constrained projects",
    ],
    keyProducts: [
      { name: "Tourlock 180", type: "Security revolving door (anti-tailgating)", standard: "ANSI A156.27 / EN 17352", notes: "Reference product for anti-tailgating: one-person-at-a-time revolving with biometric/card integration. ISC West 2026: integrated with Alcatraz Rock X facial recognition.", priceRange: "premium", keySpec: "Anti-tailgating certified; 1-person occupancy; biometric-ready", flHvhz: "no" },
      { name: "Speedlane Swing / Slide", type: "Optical turnstile (speed gate)", standard: "IEC 62676", notes: "Corporate lobby optical turnstile with glass wing barriers; integrated with access control", priceRange: "premium", keySpec: "Throughput: up to 30 persons/min; glass wing barriers", flHvhz: "no" },
      { name: "Circlelock", type: "Security portal (mantrap)", standard: "EN 17352", notes: "Single-occupancy security airlock — weight or biometric verification between chambers. Data centers and embassies.", priceRange: "ultra-premium", keySpec: "Weight discrimination or biometric; single-occupancy airlock", flHvhz: "no" },
      { name: "BoonAssist TL", type: "Manual revolving (assisted)", standard: "A156.27", notes: "Motor-assisted manual revolving door for corporate and transit lobbies", priceRange: "mid", keySpec: "Motor-assist for ADA compliance; 3-wing and 4-wing options", flHvhz: "no" },
      { name: "Crystal", type: "Manual revolving (all-glass)", standard: "A156.27", notes: "All-glass manual revolving for prestige corporate and hotel lobbies", priceRange: "premium", keySpec: "Frameless all-glass; 2.0–2.4 m diameter", flHvhz: "no" },
      { name: "Lifeline", type: "Security revolving (motorized)", standard: "A156.27", notes: "Motorized security revolving for hospital, government, and institutional campuses", priceRange: "premium", keySpec: "Motorized; emergency egress mode; integrated access control", flHvhz: "no" },
    ],
    thinkAboutThis: "Boon Edam is a specialist, not a generalist. They own the anti-tailgating revolving door niche — and it is a real niche. The Tourlock 180 with Alcatraz biometric integration at ISC West 2026 is a genuine technology advance. However, the moment a spec asks for automatic sliding, swing, or any HVHZ exterior door, Boon Edam cannot compete. Position ASSA ABLOY as the complete opening solution — we can incorporate a Boon Edam revolving into a broader facility spec without losing the account, or win the security vestibule with our own RD3A/RD4A1 access-control integrated revolving. The key objection is: you cannot spec your entire facility through Boon Edam.",
  },

  // ── GEZE GmbH ─────────────────────────────────────────────────────────
  geze: {
    id: "geze",
    name: "GEZE",
    fullName: "GEZE GmbH",
    parentCompany: "Independent (private, Reinhold Veit family)",
    hq: "Leonberg, Germany (global); US operations based in Mid-Atlantic/Southeast",
    founded: "1863",
    color: "#E30613",
    tagline: "One source, unlimited solutions",
    marketPosition:
      "German precision-engineered automatic door and building systems manufacturer with 160+ years of heritage. GEZE competes directly with ASSA ABLOY in swing (Powerturn vs. SW series) and sliding (Slimdrive vs. SL500). Their myGEZE Control platform — significantly updated November 2025 — is arguably the most sophisticated cloud-connected door management system currently on the market in terms of European deployment: remote diagnostics, ML-based predictive maintenance, networked door drives, and BMS/HVAC native integration. Revenue approximately $600M. Critical weakness in the US: their service network is thin outside major metro areas, their products lack HVHZ/NOA certification for Florida hurricane zones, and A156 compliance documentation is less developed than US-native competitors. The myGEZE IoT platform is a genuine competitive threat for smart building spec — but their US field support infrastructure does not yet match their product ambition.",
    primaryStrengths: [
      "myGEZE Control platform (major Nov 2025 update): cloud-connected door management, ML-based predictive maintenance, BMS/HVAC integration — most advanced deployed IoT platform in market",
      "Powerturn automatic swing: premium full-energy swing operator, competes directly with Besam SW series in glass facade and institutional",
      "Slimdrive automatic sliding: 70mm header depth standard, competes directly with SL500",
      "ECdrive compact sliding: low-profile operator for tight facade installations",
      "IQ windowdrive: automated window control integrated with HVAC — unique BMS product extension",
      "Strong European smart building specification track record: hospitals, airports, corporate HQ",
      "Boxer door hold-open system: integrated hold-open with smoke/fire control",
      "160-year German engineering heritage — strong with architect and EOR community in smart building sector",
    ],
    primaryWeaknesses: [
      "No direct US/Canada subsidiary — sold through distributors in NA. Market presence is specification-driven; limited direct sales force.",
      "US service network thin outside major metros (NY, DC, Chicago, LA) — emergency response time in secondary markets is a liability",
      "No HVHZ-rated product line — German engineering not optimized or tested for US hurricane zones",
      "A156.10 compliance documentation limited vs. US-native competitors — fewer products with full ANSI test reports",
      "Limited AAADM dealer penetration — fewer AAADM-certified US technicians trained on GEZE products",
      "myGEZE platform is European-mature but has limited US enterprise customer deployment data",
      "No revolving door product line competitive with ASSA ABLOY RD series at US scale",
      "Price positioning at or above ASSA ABLOY at premium tier — hard to justify without US service to back it up",
    ],
    keyProducts: [
      { name: "Powerturn", type: "Swing (full energy, automatic)", standard: "EN 16005 / A156.10", notes: "Premium automatic swing operator for heavy-duty institutional and glass-facade entrances. Direct competitor to SW200i and SW300.", priceRange: "premium", keySpec: "Up to 300 kg door; in-ground and surface-mount variants", flHvhz: "no" },
      { name: "Slimdrive", type: "Sliding (full energy, slim)", standard: "EN 16005 / A156.10", notes: "70mm ultra-slim header sliding door system. GEZE trademark product. Directly competes with SL500 in glass-facade and retail.", priceRange: "premium", keySpec: "70mm header depth; up to 2000mm clear opening", flHvhz: "no" },
      { name: "ECdrive", type: "Sliding (compact)", standard: "EN 16005", notes: "Compact sliding for tight facade installations and retrofit. Smaller profile than standard Slimdrive.", priceRange: "mid", keySpec: "Compact profile; retrofit-optimized", flHvhz: "no" },
      { name: "Boxer", type: "Door hold-open system", standard: "EN 1155", notes: "Electromagnetic hold-open integrated with fire/smoke detection systems. BMS and fire panel integration.", priceRange: "mid", keySpec: "Integrated fire/smoke panel interface; fail-safe release", flHvhz: "no" },
      { name: "IQ windowdrive", type: "Automated window (HVAC-integrated)", standard: "EN 14351", notes: "Motorized window automation with myGEZE BMS integration. Unique product extension into HVAC-linked window control.", priceRange: "premium", keySpec: "BMS native; HVAC zone integration; remote operation", flHvhz: "no" },
      { name: "myGEZE Control", type: "IoT door management platform (Nov 2025)", standard: "ISO 27001 data security", notes: "Cloud-connected door management: remote diagnostics, ML predictive maintenance, BMS/HVAC integration. Updated major release Nov 2025.", priceRange: "premium", keySpec: "ML-based predictive maintenance; BMS native; remote diagnostics", flHvhz: "no" },
    ],
    thinkAboutThis: "GEZE is the IoT threat you need to take seriously in smart building specs. myGEZE Control (Nov 2025) genuinely competes with ecoLOGIC on features — and in European markets it has deployment depth we don't match yet. The US response: our ecoLOGIC + SW300-S Bluetooth App Configuration is equally capable and backed by an AAADM-certified technician network that GEZE cannot match outside major metros. When the hospital in Fort Lauderdale needs 2am emergency service, GEZE cannot deliver. We can. Lead with service network density and HVHZ certification before the IoT feature debate begins.",
  },

  // ── TORMAX (Landert Group) ────────────────────────────────────────────
  tormax: {
    id: "tormax",
    name: "TORMAX",
    fullName: "TORMAX (Landert Group)",
    parentCompany: "Landert Group (private, Swiss)",
    hq: "Faellanden, Switzerland (global); Dallas, TX (US operations)",
    founded: "1945",
    color: "#004B8D",
    tagline: "Perfection in motion",
    marketPosition:
      "Swiss precision automatic door manufacturer with a national US distributor network. TORMAX competes directly in the sliding door market with the TX9000 (competing against Besam SL500) and positions iMotion technology as a premium differentiator. Notable strategic threat: TORMAX actively markets service and repair for competitors' products including ASSA ABLOY — a service-first business model that can disintermediate AAADM-certified distributors and undercut our service revenue moat. Revenue approximately $200M. Limited HVHZ products, no revolving door line, and smaller brand awareness than top-3 competitors.",
    primaryStrengths: [
      "TX9000 sliding system: competitive feature-for-feature spec against Besam SL500",
      "iMotion linear drive technology: low-vibration, quiet, premium positioning in glass facade",
      "Service-first business model: markets repair and maintenance on all brands including ASSA ABLOY — revenue model not dependent on new product sales",
      "National US distributor network with established channel relationships",
      "Swiss engineering heritage: quality perception among architect and EOR community",
      "Competitive pricing vs. ASSA ABLOY — often 8–12% below on like-for-like sliding",
    ],
    primaryWeaknesses: [
      "No HVHZ-rated product line — cannot compete for Florida exterior hurricane zone applications",
      "No revolving door product line — cannot serve hospitality, airport, or corporate lobby revolving spec",
      "Service-competitor strategy can damage long-term distributor relationships with ASSA ABLOY channel",
      "Brand awareness significantly below ASSA ABLOY, dormakaba, and Stanley in US market",
      "No AI energy management / IoT platform comparable to ecoLOGIC",
      "Limited healthcare FGI-specific product documentation and marketing",
      "Limited swing door product range compared to ASSA ABLOY SW or dormakaba ED series",
    ],
    keyProducts: [
      { name: "TX9000", type: "Sliding (full energy)", standard: "A156.10 / EN 16005", notes: "Core competitive sliding door system. Feature-for-feature comparable to Besam SL500. iMotion linear drive for quiet operation.", priceRange: "mid", keySpec: "iMotion linear drive; up to 1800mm clear opening", flHvhz: "no" },
      { name: "iMotion 1302.XL", type: "Sliding (heavy-duty)", standard: "A156.10", notes: "Heavy-duty sliding for high-traffic institutional and commercial applications", priceRange: "premium", keySpec: "Up to 500 kg door panel; heavy-duty track", flHvhz: "no" },
      { name: "iMotion 1401", type: "Swing (automatic)", standard: "A156.10 / EN 16005", notes: "Automatic swing operator for commercial applications. Competes with SW100/SW200 series.", priceRange: "mid", keySpec: "Up to 180 kg door; surface-mount", flHvhz: "no" },
      { name: "iMotion 2201", type: "Swing (in-ground)", standard: "A156.10", notes: "In-ground swing actuator for monumental and prestige entrances", priceRange: "premium", keySpec: "In-ground; up to 300 kg door", flHvhz: "no" },
    ],
    thinkAboutThis: "TORMAX's most dangerous competitive move is the service-competitor play. Any account where they're servicing our installed product is an account they can eventually influence toward replacement. The counter is demonstrating that AAADM factory-certified service is qualitatively different — accountability, parts OEM quality, and documentation that third-party service cannot match. On new installations, TORMAX is a price competitor but loses on HVHZ, revolving doors, healthcare FGI, and IoT platform. Their service-first model is worth flagging to your channel team — it's a long-term account-erosion risk, not an immediate product threat.",
  },

  // ── Nabtesco Corporation / AGD Systems ─────────────────────────────────
  nabtesco: {
    id: "nabtesco",
    name: "Nabtesco",
    fullName: "Nabtesco Corporation (AGD Systems)",
    parentCompany: "Nabtesco Corporation (Tokyo, Japan; publicly traded)",
    hq: "Tokyo, Japan (global); US market through AGD Systems brand and OEM partnerships",
    founded: "2003 (merger of Teijin Seiki + Nabco)",
    color: "#1D3C6E",
    tagline: "Precision in motion",
    marketPosition:
      "Japanese precision engineering manufacturer. Nabtesco is primarily a tier-1 OEM motion control supplier — their automatic door technology is widely embedded in other manufacturers' products as components. In the US market, they operate through the AGD Systems brand and OEM partnerships. Key differentiator: exceptionally quiet, precise operators preferred for luxury retail and hospitality. Presented digital signage-integrated automatic doors at VIETBUILD 2024, signaling intent to move into value-added retail applications. Monitor closely as an OEM threat — they supply components to competitors and could emerge as a direct branded competitor. Not a tier-1 direct competitor today.",
    primaryStrengths: [
      "Exceptional precision and ultra-quiet operation — preferred for luxury retail and high-end hospitality",
      "OEM component supply relationships with multiple door system manufacturers — technology embedded in competitor products",
      "Japanese manufacturing quality standards and cost discipline",
      "Digital signage integration capability (VIETBUILD 2024) — early mover in door-as-retail-media",
      "Strong OEM industrial motion control reputation transfers to automatic door positioning",
    ],
    primaryWeaknesses: [
      "Limited US direct brand presence — AGD Systems not widely known to US architects, GCs, or specifiers",
      "No HVHZ-rated product line for Florida hurricane zone",
      "No AAADM-certified US service network of comparable density to ASSA ABLOY",
      "A156.10 compliance documentation depth limited in US market",
      "No healthcare FGI-specific or revolving door product line for US institutional market",
      "OEM model means limited direct channel and relationship depth with US distributors",
    ],
    keyProducts: [
      { name: "AGD Systems Series", type: "Sliding (full energy)", standard: "A156.10 / JIS A 4722", notes: "US-market sliding through AGD Systems brand. Quiet precision operation targeted at luxury retail and hospitality.", priceRange: "mid", keySpec: "Ultra-quiet operation; OEM precision engineering", flHvhz: "verify" },
      { name: "Nabtesco Auto Door OEM", type: "OEM motion control (sliding/swing)", standard: "Various", notes: "OEM component supply to other door system manufacturers. Not sold direct to end users in this configuration.", priceRange: "mid", keySpec: "OEM supply; integrated into competitor products", flHvhz: "no" },
    ],
    thinkAboutThis: "Nabtesco is a monitor-closely competitor, not a tier-1 threat today. The OEM supply angle is the strategic risk — if they supply motion control components to our competitors, they gain market intelligence and distribution reach without a direct sales force. Their VIETBUILD 2024 digital signage integration is a signal of product evolution worth tracking. In luxury retail or hospitality accounts where whisper-quiet operation is a spec criterion, be prepared to position our RD300 revolving and ecoLOGIC platform as the premium alternative with full US service backing.",
  },

  // ── FAAC Group ────────────────────────────────────────────────────────
  faac_group: {
    id: "faac_group",
    name: "FAAC Group",
    fullName: "FAAC Group",
    parentCompany: "FAAC SpA (private, Italian; Barozzi family)",
    hq: "Bologna, Italy (global); US operations via FAAC Technologies, Charlotte NC",
    founded: "1965",
    color: "#003082",
    tagline: "Opening new horizons",
    marketPosition:
      "Italian access automation specialist best known for gate automation, barriers, and access control systems. Launched the A952 swing door automation system in May 2025, entering the commercial automatic swing door market as a new competitor. Strong existing US distribution through gate automation and parking access control channels. Their channel relationships give them warm introductions at facilities where they already handle perimeter access. Emerging competitor — monitor for channel conflict and specification penetration as A952 gains market traction.",
    primaryStrengths: [
      "A952 swing door system (May 2025): new market entry in commercial automatic swing, targeting retrofit and new construction",
      "Existing US distribution network through gate automation and parking access control channels",
      "Strong access control + gate integration — complete perimeter-to-door bundling for parking/campus facilities",
      "Italian engineering quality perception in the architectural community",
      "Competitive price positioning as a market entrant — incentivized to win early reference projects",
    ],
    primaryWeaknesses: [
      "A952 is a new product with no significant US install base or service history",
      "No automatic sliding door product — cannot compete across the full entrance system spectrum",
      "No HVHZ-rated automatic door products for Florida hurricane zone",
      "No healthcare FGI-compliant door product",
      "No AAADM-certified US service network for door-specific maintenance",
      "Brand recognition in automatic doors is nascent — primarily known for gates and barriers",
    ],
    keyProducts: [
      { name: "A952", type: "Swing (automatic, surface-mount)", standard: "EN 16005", notes: "New May 2025 launch. Commercial automatic swing door operator targeting retrofit and new-construction markets. Competes at entry/mid tier of SW60/SW100 category.", priceRange: "mid", keySpec: "Surface-mount; commercial swing; retrofit-optimized", flHvhz: "no" },
      { name: "FAAC 415/422 Gate Operator", type: "Gate automation", standard: "EN 12453", notes: "Core FAAC product — hydraulic gate operator. Basis of their US distribution network and the channel that A952 now rides.", priceRange: "mid", keySpec: "Hydraulic; up to 1800 kg gate leaf", flHvhz: "no" },
    ],
    thinkAboutThis: "FAAC is an emerging monitor, not an immediate tier-1 threat. The A952 launch in May 2025 is their entry ticket to the automatic swing door market. Watch their channel strategy — if they bundle A952 with existing gate automation proposals at parking/campus facilities, they can win spec-under-the-radar. Counter with A156.10 compliance depth, AAADM service network, and the full opening solution argument. Their product history is perimeter access; our history is every opening in the building. That breadth argument should be decisive for any institutional or multi-use facility specifier.",
  },

  // ── NABCO Entrances (Nabtesco) ───────────────────────────────────────────────
  nabco: {
    id: "nabco",
    name: "NABCO",
    fullName: "NABCO Entrances, Inc.",
    parentCompany: "Nabtesco Corporation (Tokyo, Japan) — NABCO is Nabtesco's North American automatic door brand",
    hq: "Muskego, Wisconsin, USA",
    founded: "1963 (NA operations, 60+ year AAADM founding member)",
    color: "#1A5276",
    tagline: "Precision entrances, engineered to last",
    marketPosition:
      "NABCO Entrances is one of the oldest AAADM-founding members and a genuine full-line NA manufacturer with deep healthcare and ICU specialization. Parent Nabtesco is a global precision motion control company (20% global automatic door market share under NABCO/GILGEN brands). NABCO Entrances holds strong position in healthcare/hospital systems, federal government buildings, and national retail chains. Their GT1175 sliding platform is the workhouse competitor in mid-tier commercial sliding. Canadian footprint via NABCO Canada Inc. (Richmond Hill, ON) and Royal Doors Limited (Moncton, NB) for Atlantic Canada. Weaker on revolving doors and smart building IoT vs. ASSA ABLOY.",
    primaryStrengths: [
      "AAADM founding member (60+ years) — one of deepest service histories in North America",
      "GT1175 platform: ANSI A156.10, UL/cULC listed — proven mid-tier commercial and healthcare sliding",
      "ICU/CCU specialty: GT2400 series (manual/automatic/telescopic) with flush-bolt free breakout and smoke-rated packages — one of widest clear openings at 56.5\" on GT2400AT",
      "GT9000 Hermetic sliding door — cleanroom, OR, lab-grade hermetic sealing",
      "Hurricane-rated sliding and folding door products — GT1175 hurricane-rated and GT1400 hurricane folding",
      "Canadian presence: NABCO Canada (Richmond Hill, ON) + Royal Doors (Moncton, NB for Atlantic Canada)",
      "NABCO Connect IoT platform for remote diagnostics on swing door operators",
    ],
    primaryWeaknesses: [
      "No revolving door product — cannot compete on revolving specifications",
      "Weaker IoT/smart building depth vs. ecoLOGIC AI (ASSA ABLOY) or myGEZE (GEZE)",
      "Limited premium architectural presence vs. GEZE or ASSA ABLOY in high-design commercial",
      "Smaller US field-service density than Stanley or ASSA ABLOY in secondary markets",
      "No full-energy high-velocity product for industrial/transit equivalent to Horton 2000 heavy duty",
    ],
    keyProducts: [
      { name: "GT1175 Standard Sliding", type: "Sliding (full-energy)", standard: "A156.10", notes: "Core NA commercial sliding platform. ANSI A156.10, UL/cULC. Belt-drive, Opus Control microprocessor. Configurations: fixed sidelight, full breakout, all-glass, telescopic.", priceRange: "mid", keySpec: "ANSI A156.10; UL/cULC; breakout egress standard", flHvhz: "yes" },
      { name: "GT1175 Hurricane-Rated", type: "Sliding (hurricane)", standard: "A156.10", notes: "GT1175 series hurricane-rated variant for coastal applications.", priceRange: "mid", keySpec: "Hurricane-rated sliding; coastal specifications", flHvhz: "yes" },
      { name: "GT2400 ICU Manual", type: "ICU Sliding (manual)", standard: "A156.10", notes: "Manual ICU sliding door, flush-bolt free breakout. Smoke-rated package (UL1784). Up to 85\" clear opening. Healthcare cornerstone.", priceRange: "premium", keySpec: "Flush-bolt free; smoke-rated UL1784", flHvhz: "verify" },
      { name: "GT2400A ICU Automatic", type: "ICU Sliding (automatic)", standard: "A156.10", notes: "Automatic ICU sliding door, flush-bolt free breakout. Touch-free activation, anti-microbial coatings, electrified privacy glass option.", priceRange: "premium", keySpec: "Flush-bolt free automatic; touch-free activation", flHvhz: "verify" },
      { name: "GT2400AT ICU Auto Telescopic", type: "ICU Sliding (telescopic, automatic)", standard: "A156.10", notes: "Newest ICU product (June 2024). Largest clear opening: 56.5\" at 96\" frame width. Trackless, one-step full-open breakout. Electrified privacy glass available.", priceRange: "premium", keySpec: "56.5\" clear opening (widest class); trackless; 2024 launch", flHvhz: "verify" },
      { name: "GT9000 Hermetic", type: "Hermetic Sliding (automatic)", standard: "A156.10", notes: "Full hermetic sealing for OR, cleanroom, pharmaceutical. Airtight closure on all sides.", priceRange: "ultra-premium", keySpec: "Hermetic sealing; OR/cleanroom/pharma", flHvhz: "no" },
      { name: "GT500 / GT8500 Swing", type: "Swing (heavy duty, ADA)", standard: "A156.10", notes: "Heavy duty and low energy ADA swing operators. Surface-mount.", priceRange: "mid", keySpec: "Heavy duty swing; ADA compliant", flHvhz: "verify" },
      { name: "GT710 / GT8710 Swing", type: "Swing (low energy, ADA)", standard: "A156.19", notes: "Low energy ADA swing operator. NABCO Connect IoT for remote diagnostics.", priceRange: "mid", keySpec: "Low energy A156.19; NABCO Connect IoT", flHvhz: "verify" },
      { name: "GT1400 Standard Folding", type: "Folding (automatic)", standard: "A156.10", notes: "Standard automatic folding door. Space-saving for retrofits.", priceRange: "mid", keySpec: "Standard folding; retrofit-friendly", flHvhz: "no" },
      { name: "GT1400 Hurricane Folding", type: "Folding (hurricane-rated)", standard: "A156.10", notes: "Hurricane-rated folding door variant for coastal Florida and Gulf Coast.", priceRange: "mid", keySpec: "Hurricane-rated folding door", flHvhz: "yes" },
    ],
    thinkAboutThis: "NABCO is a full-line, AAADM-founding competitor with real heritage. Win on revolving (they have none), premium IoT/AI (ecoLOGIC vs. basic NABCO Connect), HVHZ NOA cert depth for SL500 R104, and architectural premium presence. Their GT2400AT ICU telescopic is genuinely competitive in healthcare — fight them with our ICU/healthcare FGI compliance depth and service SLA track record, not on specs alone. For Canada, they have real distribution (Richmond Hill + Atlantic Canada) — don't assume we're unchallenged north of the border.",
  },

  // ── Micom Americas Inc. (Canadian OEM) ───────────────────────────────
  micom: {
    id: "micom",
    name: "Micom Americas",
    fullName: "Micom Americas Inc.",
    parentCompany: "Independent (Canadian manufacturer)",
    hq: "Ontario, Canada",
    founded: "Est. 1990s",
    color: "#C0392B",
    tagline: "Smart swing. Smart slide.",
    marketPosition:
      "Micom Americas is a Canadian OEM manufacturer with a specifically strong position in Ontario and Western Canada. Primary product is the Smart Swing SW800 — an AODA-compliant (Accessibility for Ontarians with Disabilities Act) low-energy automatic swing door operator. Micom competes as a value-tier, locally-manufactured alternative to US multinationals in the Canadian institutional market: healthcare, education, government, and multi-residential. Their distribution runs through local dealers and barrier-free specialists, including Anchor Doors (Ontario). A niche, regional competitor in Canada that becomes relevant in provincial government tenders and AODA-compliance-driven specifications.",
    primaryStrengths: [
      "Canadian OEM manufacturer — buy-Canadian preference in provincial government and healthcare tenders",
      "AODA compliance — Smart Swing SW800 explicitly certified for Ontario accessibility requirements",
      "Smart Slide SL800: ANSI A156.10, UL/cUL listed — supports single, bi-part, and telescopic configurations",
      "Magnetic Linear MM Series: brushless motor, premium quiet operation at lower price point",
      "Value-tier pricing in Canadian market — competes on affordability vs. US multinationals",
      "Strong dealer relationships in Ontario, BC, and Western Canada",
    ],
    primaryWeaknesses: [
      "Narrow product line: swing + sliding only — no revolving, no ICU specialty, no hermetic",
      "No US distribution or service presence — Canada-only competitor",
      "No HVHZ / Florida NOA product",
      "Limited brand recognition outside Ontario and Western Canada",
      "No AAADM membership noted — service depth uncertainty for complex projects",
      "IoT/smart building integration not a differentiated offering",
    ],
    keyProducts: [
      { name: "Smart Swing SW800", type: "Swing (low energy, ADA/AODA)", standard: "A156.19", notes: "Flagship Canadian product. AODA-compliant low-energy swing operator. Used in Ontario healthcare, education, government. Fully automatic and low-energy in one unit. Optional battery backup. 24V lock compatible. Push-and-go function.", priceRange: "mid", keySpec: "AODA-certified; push-and-go; battery backup option", flHvhz: "no" },
      { name: "Smart Slide SL800", type: "Sliding (automatic)", standard: "A156.10", notes: "ANSI A156.10, UL/cUL. Single, bi-part, and telescopic configurations. Ferrite chip technology, brushless DC motor. Fits standard 7.5\" header height. NABCO-equivalent specs at lower price.", priceRange: "mid", keySpec: "ANSI A156.10; UL/cUL; 7.5\" slim header", flHvhz: "no" },
      { name: "Magnetic Linear MM Series", type: "Sliding (magnetic linear drive)", standard: "A156.10", notes: "Premium sliding operator with magnetic linear drive — ultra-quiet, minimal mechanical parts, low maintenance. Healthcare and education focus.", priceRange: "premium", keySpec: "Magnetic linear drive; near-silent operation", flHvhz: "no" },
    ],
    thinkAboutThis: "Micom is a Canadian-only niche player. Relevant in Ontario and Western Canada government/healthcare tenders where AODA compliance and buy-Canadian preference give them a policy advantage. Counter with our Canadian distribution network, AAADM-certified technicians in Canada, and our full opening solution breadth (revolving, ICU, hermetic) that Micom cannot match. In a bundled project — sliding + revolving + ICU — Micom is automatically out of scope.",
  },

  // ── Portalp USA ──────────────────────────────────────────────────
  portalp: {
    id: "portalp",
    name: "Portalp",
    fullName: "Portalp USA Inc.",
    parentCompany: "Portalp International SAS (France, private)",
    hq: "Naples, Florida, USA (US HQ)",
    founded: "1966 (France); US operations from Naples FL",
    color: "#1F618D",
    tagline: "Automated access — made in France",
    marketPosition:
      "Portalp is a French manufacturer of automatic doors with 60+ years of history and a growing US presence based in Naples, FL. Their differentiation is premium European design, hermetic door specialization (OR/cleanroom), and an RC2 burglar-resistant sliding door — a rare certification in the US market. Their US footprint is smaller than the European-rooted big players but their healthcare and high-security access DNA is genuine. Portalp USA targets architects, healthcare systems, and facility owners who want a European design aesthetic combined with US accessibility compliance. They are a monitor-level competitor, particularly in healthcare and high-security retail.",
    primaryStrengths: [
      "RC2-certified burglar-resistant sliding door — Class 2 burglar-proof certification; rare in the US pedestrian door market",
      "Strong hermetic door capability: airtight sliding doors for OR, lab, cleanroom, pharmaceutical",
      "60+ years French engineering heritage — premium positioning with architects",
      "Florida HQ (Naples) — active in Southeastern US market",
      "Full automatic door line: swing, sliding, folding, hermetic, revolving",
    ],
    primaryWeaknesses: [
      "Smaller US service and distribution network vs. ASSA ABLOY or Stanley",
      "No confirmed ANSI/BHMA AAADM membership or HVHZ Florida NOA documentation verified",
      "Brand recognition low among US AHJs, GCs, and institutional specifiers",
      "No meaningful US revolving door presence vs. ASSA ABLOY RD series",
      "Limited healthcare FGI documentation depth for US hospital specifications",
    ],
    keyProducts: [
      { name: "RS-RC2 Sliding Door", type: "Sliding (security, RC2)", standard: "EN 16005 / verify US", notes: "Class 2 burglar-resistant certified automatic sliding door. Rare in NA market. Motorized multipoint lock. Targets banks, jewelry stores, pharmacies, hospitals with high-security requirements.", priceRange: "ultra-premium", keySpec: "RC2 burglar resistance; motorized multipoint lock", flHvhz: "verify" },
      { name: "Hermetic Sliding Door", type: "Hermetic Sliding", standard: "EN 16005", notes: "Airtight sliding doors for OR, lab, cleanroom applications. 60-year heritage in hermetic access. Competes with NABCO GT9000 and TORMAX T2 Opac Hermetic.", priceRange: "ultra-premium", keySpec: "Full hermetic; OR/cleanroom/pharma", flHvhz: "no" },
      { name: "Automatic Swing Door", type: "Swing (automatic)", standard: "EN 16005 / verify US A156.10", notes: "Standard commercial automatic swing door. European-design focused. US A156.10 certification should be verified for project submissions.", priceRange: "premium", keySpec: "Commercial swing; European design aesthetic", flHvhz: "verify" },
      { name: "Automatic Revolving Door", type: "Revolving", standard: "EN 16005 / verify US A156.27", notes: "Revolving door offering with European standard. US A156.27 certification status should be verified with Portalp USA before NA specification.", priceRange: "ultra-premium", keySpec: "Revolving; European standard primary", flHvhz: "no" },
    ],
    thinkAboutThis: "Portalp is a niche European entrant with a genuine RC2 security door and hermetic capability. Watch for them in high-security retail and healthcare specs in Florida and Southeast US. Counter with US ANSI/BHMA certification depth, AAADM service network, HVHZ NOA documentation, and FGI healthcare compliance documentation. Their European primary certification is their vulnerability on any US project with an AHJ requiring ANSI/BHMA standards.",
  },

  // ── Automatic Systems ───────────────────────────────────────────────
  automatic_systems: {
    id: "automatic_systems",
    name: "Automatic Systems",
    fullName: "Automatic Systems S.A.",
    parentCompany: "Boliden AB (Sweden, via acquisition) / Operates independently from Belgium",
    hq: "Wavre, Belgium (global); North America distribution via partners",
    founded: "1963",
    color: "#117A65",
    tagline: "World leader in secure entrance control",
    marketPosition:
      "Automatic Systems is a Belgian-headquartered global specialist in pedestrian entrance security: speed gates, security doors, full-height turnstiles, mantrap portals, and optical turnstiles. Not a traditional automatic door company — their lane is access control-integrated security entrances for corporate campuses, data centers, critical infrastructure, transit systems, and government facilities. Limited North American market share in standard sliding or swing doors, but a genuine competitor in high-security entrance control where ASSA ABLOY RD3A/RD4A1 or Boon Edam Tourlock would be specified. Present in NA through distribution and system integrators.",
    primaryStrengths: [
      "Speed gate and security entrance control leader — deep product line for corporate campus and transit",
      "Mantrap / security portal expertise for critical infrastructure and data centers",
      "Full-height turnstile range for outdoor perimeter control",
      "Long history (60+ years) in access-controlled entrance management",
      "Integration with major PACS platforms (Lenel, CCURE, Genetec)",
    ],
    primaryWeaknesses: [
      "Not a standard automatic door manufacturer — no sliding, swing, or revolving door line",
      "US service and distribution thinner than direct competitors",
      "Premium price positioning vs. simpler turnstile solutions",
      "Limited North American brand recognition outside security integrators",
      "No HVHZ / Florida hurricane product",
    ],
    keyProducts: [
      { name: "SL Series Speed Gates", type: "Security entrance lane (speed gate)", standard: "EN 16005 / local codes", notes: "High-throughput optical speed gates for corporate lobbies, transit, and office buildings. Competes with Boon Edam Speedlane and Lifeline series.", priceRange: "premium", keySpec: "High throughput; optical sensing; bidirectional", flHvhz: "no" },
      { name: "Security Entry Door", type: "Security Door (mantrap / portal)", standard: "Verify per project", notes: "Physical + electronic security portal for controlled single-person entry. Competes with Boon Edam Circlelock and ASSA ABLOY interlocking solutions.", priceRange: "ultra-premium", keySpec: "Mantrap configuration; biometric-ready", flHvhz: "no" },
      { name: "Full-Height Turnstile", type: "Turnstile (perimeter)", standard: "Verify per project", notes: "Heavy-duty outdoor perimeter turnstile. Industrial, transit, stadium, correctional facilities.", priceRange: "mid", keySpec: "Perimeter control; weather-resistant", flHvhz: "no" },
      { name: "Tripod Turnstile", type: "Turnstile (waist-high)", standard: "Verify per project", notes: "Entry-level access control for gym, office, campus. Economical high-traffic solution.", priceRange: "economy", keySpec: "High volume; compact; economical", flHvhz: "no" },
    ],
    thinkAboutThis: "Automatic Systems is only relevant when the spec is security entrance control, not standard automatic doors. If they appear on a bid, the project has a security bias. We compete directly with our RD3A/RD4A1 access-control revolving doors and Boon Edam security revolving products are a more direct match for their Tourlock/Circlelock category. The ASSA ABLOY advantage in a full-building context: one vendor, full opening suite, single service relationship.",
  },

  // ── LCN / Norton (Allegion) ───────────────────────────────────────────
  lcn_norton: {
    id: "lcn_norton",
    name: "LCN / Norton",
    fullName: "LCN Closers / Norton Door Controls (Allegion brands)",
    parentCompany: "Allegion plc (Dublin, Ireland) — NYSE: ALLE",
    hq: "Princeton, Illinois (LCN); Monroe, North Carolina (Norton)",
    founded: "LCN: 1880; Norton: 1880 (both among oldest US door hardware brands)",
    color: "#6C3483",
    tagline: "Access control from the door closer to the lock",
    marketPosition:
      "LCN and Norton are Allegion’s automatic door operator brands — distinct from Stanley Access Technologies (which Allegion acquired in 2013). LCN and Norton compete specifically in low-energy swing door operators (A156.19 / ADA push-side) and electromechanical operators for retrofit and new construction swing door applications. These are the institutional door hardware workhorses: government buildings, schools, hospitals, and healthcare facilities. They don’t make sliding or revolving doors — their lane is exclusively swing operator and closer hardware. Strong distribution through institutional hardware dealers, Allegion’s Schlage channel, and door hardware distributors across the US and Canada. A constant presence in any swing door operator specification.",
    primaryStrengths: [
      "LCN 9500/9540 Senior Swing: ANSI/BHMA A156.19 UL-listed, ADA-compliant heavy-duty swing operator — institutional gold standard",
      "Norton 6000 Series: low-energy operator with integral grade-1 mechanical closer backup — dual-function resilience",
      "Allegion distribution breadth: widest institutional hardware dealer network in North America",
      "Schlage access control integration: natural bundled sell with Allegion’s lock and electrified hardware ecosystem",
      "Long install base: tens of thousands of units in schools, hospitals, government buildings — deep replacement/MRO business",
      "Price discipline: value-competitive at institutional bid stage",
    ],
    primaryWeaknesses: [
      "No sliding door product — cannot compete on sliding door specifications",
      "No revolving door, no ICU specialty door, no hermetic",
      "No HVHZ hurricane-rated product",
      "No full-energy full-speed automatic swing comparable to our SW300-S",
      "IoT/smart building not a strength — no AI diagnostics platform",
      "Not an AAADM member for door-specific technician certification (hardware channel vs. automatic door channel)",
    ],
    keyProducts: [
      { name: "LCN 9500 Series Senior Swing", type: "Swing (low energy, ADA)", standard: "A156.19", notes: "ANSI/BHMA A156.19, UL-listed. Heavy-duty surface-mount. Models: 9530 (single pull), 9540 (single push), 9550 (simultaneous double), 9560 (independent double). 2-year warranty. Power Boost closing force option. Push-N-Go at 5°.", priceRange: "mid", keySpec: "A156.19 UL listed; push-N-go; power boost option", flHvhz: "no" },
      { name: "LCN 2810/2850 Concealed Operator", type: "Swing (concealed mount, low energy)", standard: "A156.19", notes: "Overhead concealed operator for clean aesthetic applications. Single (2810) and simultaneous double (2850) versions.", priceRange: "premium", keySpec: "Overhead concealed; clean aesthetic; institutional", flHvhz: "no" },
      { name: "Norton 6000 Series", type: "Swing (low energy, integrated closer)", standard: "A156.19", notes: "Low-energy operator with integral Grade 1 mechanical door closer. Fail-safe: manual closer function if power fails. Surface-mount surface backplate serves as template. Single and double door applications.", priceRange: "mid", keySpec: "Integrated Grade 1 closer backup; fail-safe operation", flHvhz: "no" },
      { name: "Norton 5600 Series", type: "Swing (low energy, surface)", standard: "A156.19", notes: "Surface-mount low-energy swing operator for medium-duty applications. Compact, retrofit-friendly.", priceRange: "mid", keySpec: "Surface-mount; retrofit-friendly; medium duty", flHvhz: "no" },
    ],
    thinkAboutThis: "LCN and Norton are constant low-energy swing operator competitors in the institutional channel. They win on distribution depth, Allegion ecosystem integration, and install-base familiarity in schools and government buildings. Our counter: full-energy SW300-S for high-traffic vs. their low-energy limitation, IoT/smart building diagnostics, and the full-opening solution argument (sliding + swing + revolving from one manufacturer). The Allegion Schlage integration is also their single-brand lock story — we counter with OSDP v2 open standard (works with ANY access control system, not just Schlage). In Canada, they compete through Allegion Canada distribution, same product line.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const CONTEXTS: Record<ContextId, { label: string; sublabel: string; icon: string }> = {
  customer_pitch: {
    label: "Customer Pitch",
    sublabel: "Owner / Facilities Manager — emphasize reliability and lifecycle value",
    icon: "Users",
  },
  procurement: {
    label: "Procurement / Bid",
    sublabel: "Buyer / GC — lead with total cost of ownership and compliance",
    icon: "ClipboardList",
  },
  engineering: {
    label: "Engineering / Spec",
    sublabel: "Architect / Engineer of Record — standards, certifications, technical depth",
    icon: "Settings2",
  },
  pm_interview: {
    label: "PM Interview Prep",
    sublabel: "Interviewer context — frame insights as product thinking and strategy",
    icon: "Briefcase",
  },
  distributor: {
    label: "Distributor / Rep",
    sublabel: "Channel partner — margins, support, training, and sell-through tools",
    icon: "Handshake",
  },
  florida_hvhz: {
    label: "Florida / HVHZ",
    sublabel: "Miami-Dade, Broward, HVHZ exterior — NOA, TAS, FBC compliance dynamics",
    icon: "Wind",
  },
  healthcare: {
    label: "Healthcare",
    sublabel: "Hospital, ASC, FGI compliance — infection control, hermetic, ADA, HIPAA zones",
    icon: "Heart",
  },
  iot_smart_building: {
    label: "IoT / Smart Building",
    sublabel: "BAS integration, energy management, connected door platforms, predictive service",
    icon: "Wifi",
  },
  revolving_door: {
    label: "Revolving / Security",
    sublabel: "Revolving door and security entrance competitive positioning",
    icon: "RotateCcw",
  },
  iot_comparison: {
    label: "IoT Feature Comparison",
    sublabel: "Head-to-head IoT platform capabilities: ecoLOGIC vs. myGEZE vs. dormakaba AI vs. Allegion",
    icon: "Wifi",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BATTLE CARD DATA
// ─────────────────────────────────────────────────────────────────────────────

const CARDS: BattleCard[] = [

  // ════════════════════════════════════════════════════════════════════════════
  // DORMAKABA CARDS
  // ════════════════════════════════════════════════════════════════════════════

  // ── dormakaba × customer_pitch ────────────────────────────────────────────
  {
    competitor: "dormakaba",
    context: "customer_pitch",
    headline: "Global reach with local depth — dormakaba can't match both.",
    winThemes: [
      {
        title: "Service network you can call at 2am",
        detail: "ASSA ABLOY Entrance Systems has the deepest US field-service network in the industry. When a sliding door fails at a grocery chain on Black Friday, response time matters more than aesthetics.",
        proof: "AAADM-certified technician coverage across all 50 states",
      },
      {
        title: "Florida-ready out of the box",
        detail: "Exterior doors in Miami-Dade and Broward require a valid Notice of Acceptance. ASSA ABLOY products carry NOA and TAS 201/202/203 test documentation; dormakaba's US lineup has limited HVHZ-ready offerings.",
        proof: "NOA + TAS 201/202/203 certification for FL high-velocity hurricane zone",
      },
      {
        title: "Lifecycle cost, not purchase price",
        detail: "dormakaba can appear cost-competitive at purchase. Factor in parts availability, service call costs, and downtime risk over 10 years — the gap narrows or reverses.",
      },
      {
        title: "Healthcare FGI compliance depth",
        detail: "VersaMax 2.0 is purpose-built for FGI 2022 guidelines including infection-control mode, antimicrobial surfaces, and pressure differential sensing. dormakaba has no equivalent US healthcare platform.",
        proof: "FGI Guidelines for Design and Construction 2022 — sliding door requirements",
      },
    ],
    differentiators: [
      { dimension: "US Field Service Network", ours: "Deep national footprint, AAADM-certified nationwide", theirs: "Thinner US presence, relies more on distributors", advantage: "strong" },
      { dimension: "FL Hurricane Certification (NOA)", ours: "NOA / TAS certified exterior products", theirs: "Limited HVHZ portfolio — verify before FL bid", advantage: "strong" },
      { dimension: "Sliding Door Header Depth", ours: "Competitive but not class-leading", theirs: "ES series competitive but not class-leading on header depth; GEZE Slimdrive (70mm) leads this dimension", advantage: "watch" },
      { dimension: "Healthcare FGI Platform", ours: "VersaMax 2.0 purpose-built FGI 2022", theirs: "No dedicated FGI-marketed US healthcare platform", advantage: "strong" },
      { dimension: "Access Control Integration", ours: "ABLOY, OSDP v2, broad enterprise ecosystem", theirs: "Strong Kaba legacy but separate ecosystem", advantage: "moderate" },
      { dimension: "Price (standard config)", ours: "Premium — 5–15% above dormakaba", theirs: "Often lower initial cost", advantage: "watch" },
      { dimension: "Revolving Doors", ours: "RD3–RD700, full range", theirs: "KTV/KTC excellent but lead times can be long", advantage: "moderate" },
    ],
    objectionHandlers: [
      {
        objection: "dormakaba's ES series looks better for our all-glass facade.",
        response: "The ES series is competitive but not class-leading on header depth for glass facades — GEZE Slimdrive holds that position at 70mm. The question is what happens when you need a service call in year 3. Our service density in the US means faster response, more local parts, and AAADM-certified technicians already familiar with your system.",
        bridgeTo: "Ask about service contract expectations and uptime SLA requirements.",
      },
      {
        objection: "dormakaba came in lower on price.",
        response: "Pull apart the 10-year cost: initial unit, installation, scheduled maintenance, and emergency calls. Our service network typically reduces downtime cost, which is the hidden number in that comparison. For a facility open 365 days, even one extra service event per year eliminates the initial savings.",
        bridgeTo: "Lifecycle cost / total cost of ownership analysis.",
      },
      {
        objection: "We've used dormakaba in Europe and it worked well.",
        response: "Their European track record is solid. The US market is structured differently — distribution density, parts supply chain, and AAADM certification standards were built for a different service model. Our US infrastructure was purpose-built for this market.",
      },
      {
        objection: "dormakaba has great access control integration via Kaba.",
        response: "Kaba access control is strong — that's a legitimate heritage. The question is whether your access control platform is Kaba-based. If you're running a non-Kaba enterprise system, the ABLOY/OSDP v2 integration pathway we offer is more interoperable.",
      },
      {
        objection: "dormakaba's ED250 is rated for 400 kg doors — that covers everything we need.",
        response: "ED250 is an excellent heavy-duty swing operator — 400 kg is top of the surface-mount class. Our SW200i-IG in-ground actuator handles up to 800 lb with zero visible surface hardware if aesthetics matter for the project. What does the opening look like?",
        bridgeTo: "Explore whether concealed or surface-mount is the spec preference.",
      },
      {
        objection: "Their KTV revolving door is beautiful — we want that for our lobby.",
        response: "KTV with magnetic levitation is genuinely premium — ultra-quiet is a real differentiator. Our RD300 All-Glass reaches 3.6 m diameter and matches the aesthetic. The question is lead time: KTC/KTV can have long NA lead times. What's the project schedule?",
      },
      {
        objection: "dormakaba offers us better payment terms.",
        response: "Payment terms are negotiable. What I'd encourage you to also model is the service contract value — our AAADM inspection network creates predictable annual cost and eliminates emergency call variance. Often that predictability is worth more than the financing terms.",
      },
      {
        objection: "We have a relationship with the dormakaba rep.",
        response: "Relationships matter — I respect that. What I'd ask is whether the relationship extends to 24/7 service response, parts availability, and technical escalation. Those are the moments that test supplier partnerships. We'd like to earn that kind of relationship too.",
      },
    ],
    landmines: [
      { topic: "ES series header depth vs. GEZE Slimdrive", risk: "We don't match 70mm header depth on standard SKUs", mitigation: "Pivot to service reliability, total cost, and FL compliance. Don't fight aesthetics on a facade-first project." },
      { topic: "Initial pricing", risk: "dormakaba can undercut on standard SKUs by 5–12%", mitigation: "Always anchor to lifecycle cost and service SLA, not unit price." },
      { topic: "KTV revolving aesthetic preference", risk: "Magnetic levitation is a genuine differentiator", mitigation: "Compete on lead time, US service support, and RD300/RD700 comparable aesthetics." },
    ],
    closingMove: "Ask: 'What's your plan if this door needs a same-day service call?' Then show response-time data for your region.",
    talkTrack: "dormakaba makes good products — their European pedigree is real. Where we separate is the support infrastructure behind the door. In the US, ASSA ABLOY Entrance Systems has the deepest field-service network in the industry, AAADM-certified coverage nationally, and for Florida specifically, NOA-certified products for exterior applications in Miami-Dade and Broward. Add in VersaMax 2.0 for healthcare and ecoLOGIC AI for smart buildings — dormakaba has no US equivalent to either. When you're looking at a 10–15 year asset, the question isn't just which door looks best on day one — it's who's standing behind it on year 5.",
    winSignals: [
      "Multi-site owner outside dormakaba's core European-institutional stronghold",
      "Project has FL exterior openings requiring NOA certification",
      "Healthcare, government, or FGI-compliance-driven specification",
    ],
    loseSignals: [
      "All-glass curtain wall project where header depth is the architect's primary spec criterion",
      "Project is spec'd to GEZE Slimdrive or dormakaba ES series by name on an EOR-preferred basis",
      "Customer has an existing Kaba access-control system and wants unified vendor",
    ],
    keyMetrics: [
      "10-year total cost of ownership delta (service + parts + downtime) vs. unit price gap",
      "US AAADM-certified technician coverage radius — compare response time by zip code",
      "NOA certification count: ASSA ABLOY vs. dormakaba US exterior products in Miami-Dade Product Control database",
    ],
  },

  // ── dormakaba × procurement ───────────────────────────────────────────────
  {
    competitor: "dormakaba",
    context: "procurement",
    headline: "Compliance verification and parts availability are your total cost of ownership story.",
    winThemes: [
      {
        title: "NOA / TAS compliance — non-negotiable in FL HVHZ",
        detail: "In Miami-Dade and Broward, exterior automatic doors require a valid Notice of Acceptance. Non-compliant product can trigger AHJ rejection and costly re-work. Verify dormakaba's FL product roster before the bid closes.",
        proof: "FBC §1709.5 — permanent NOA label required post-installation",
      },
      {
        title: "Parts and lead times matter in multi-site bids",
        detail: "For portfolios of 10+ locations, parts standardization and lead-time predictability reduce O&M risk significantly. US-warehoused common SKUs = faster first-call resolution.",
      },
      {
        title: "AAADM annual inspection compliance",
        detail: "ANSI/BHMA A156.10 requires annual inspection by an AAADM-certified technician. Our service network ensures you can meet this obligation and bill it predictably. Verify the same with any competitor.",
        proof: "A156.10 §12 — annual safety inspection requirement",
      },
      {
        title: "Like-for-like ANSI compliance on all editions",
        detail: "Both products reference A156.10, but verify the edition year. The 2024 update includes revised dynamic force limits and sensor monitoring requirements. Request test reports referencing 2024.",
      },
    ],
    differentiators: [
      { dimension: "FL NOA Certification (exterior)", ours: "Certified — bid-ready for HVHZ", theirs: "Limited / verify before submitting bid", advantage: "strong" },
      { dimension: "Parts Lead Time (US)", ours: "US warehouse stocking for common SKUs", theirs: "May have longer lead times on US-specific parts", advantage: "moderate" },
      { dimension: "Annual Inspection Network", ours: "AAADM-certified national coverage", theirs: "Thinner US technician density", advantage: "strong" },
      { dimension: "Unit Price", ours: "Premium — justify with TCO", theirs: "Often 5–12% lower initial cost", advantage: "watch" },
      { dimension: "A156.10 Edition Compliance", ours: "2024 edition test data available", theirs: "Verify edition year in submittal documentation", advantage: "moderate" },
      { dimension: "Multi-site Standardization", ours: "Nationwide parts and service consistency", theirs: "Stronger in some regions, thinner in others", advantage: "moderate" },
    ],
    objectionHandlers: [
      {
        objection: "dormakaba's bid came in 12% lower.",
        response: "Deconstruct that delta. Get line-item pricing on: scheduled maintenance per unit per year, emergency call rate and response SLA, parts lead time. In a multi-site portfolio, one extended outage can cost more than 12% in a single incident.",
        bridgeTo: "Request a TCO side-by-side from your account team.",
      },
      {
        objection: "We already spec'd dormakaba on this project.",
        response: "If it's an open spec, our products are compliant with the same ANSI/BHMA standards. If it's a proprietary spec, confirm all FL certification requirements are covered before submittal.",
      },
      {
        objection: "dormakaba is a Tier 1 global brand — their quality is reliable.",
        response: "Their product quality is solid — that's not in question. What I'd verify is whether their US service network matches their global brand. Quality at installation is one thing; quality of support at year 3 service call is another.",
      },
      {
        objection: "We need the lowest total contract value for this bid.",
        response: "Understood. Let's work backward from the TCO. Annual inspection, emergency call rate, and parts availability all feed into total contract value over the building lifecycle. We'd rather compete on that number than just unit price.",
      },
      {
        objection: "Our spec already references dormakaba model numbers.",
        response: "If the spec is performance-based referencing A156.10, we can submit as an or-equal with a compliance matrix. If it's proprietary to dormakaba, it's worth asking the EOR whether the selection was made with FL HVHZ compliance in scope.",
      },
      {
        objection: "dormakaba has a long track record in this type of project.",
        response: "Their institutional track record in Europe is strong. For this project specifically, the questions I'd want answered on the bid are: NOA status for exterior openings, US parts availability, and AAADM inspection coverage for ongoing compliance.",
      },
      {
        objection: "We have preferred vendor status with dormakaba.",
        response: "Preferred vendor status affects procurement efficiency — I respect that. What I'd ask is whether the preferred vendor agreement covers service response commitments and parts pricing, or just product supply. Those are the elements that determine total contract value.",
      },
      {
        objection: "dormakaba's warranty is comparable.",
        response: "Warranty language matters. Compare: parts coverage period, labor inclusion, response time commitments, and whether AAADM-certified technicians are required under the warranty terms. I can pull our warranty documentation for a direct comparison.",
      },
    ],
    landmines: [
      { topic: "Competing purely on unit price", risk: "dormakaba can win this fight on standard SKUs", mitigation: "Always shift to TCO, compliance risk, and O&M cost over asset life." },
      { topic: "Spec already locked to dormakaba", risk: "Difficult to displace mid-bid", mitigation: "Compete on substitution grounds — FL compliance gaps or service network inferiority." },
    ],
    closingMove: "Walk through a compliance checklist — NOA, AAADM inspection, and A156.10-2024 requirements item by item.",
    talkTrack: "On a competitive bid, unit price is visible but compliance risk isn't always. For Florida projects specifically, the NOA requirement for exterior doors in Miami-Dade and Broward is non-negotiable — an AHJ rejection mid-project is expensive. Before I talk price delta, I'd want to confirm that dormakaba's products on this bid carry a valid NOA for the opening size and configuration. If they don't, the calculation changes completely. And on a multi-site portfolio, parts lead time and AAADM inspection coverage are the two variables that most affect O&M cost over the asset life.",
    winSignals: [
      "FL exterior openings on the project scope where NOA verification is required",
      "Multi-site national or regional portfolio where service consistency matters",
      "Buyer has had previous parts-availability or lead-time issues with European-HQ manufacturers",
    ],
    loseSignals: [
      "Purely European project reference where dormakaba CE compliance is the decision criteria",
      "Proprietary spec locked to dormakaba by name with no substitution clause",
      "Owner is price-driven with no interest in TCO modeling",
    ],
    keyMetrics: [
      "Unit price delta (%) vs. annual service cost per door",
      "Average parts lead time (days) for common SKUs — US-stocked vs. overseas sourced",
      "NOA count: ASSA ABLOY vs. dormakaba certified products in Miami-Dade Product Control",
    ],
  },

  // ── dormakaba × engineering ───────────────────────────────────────────────
  {
    competitor: "dormakaba",
    context: "engineering",
    headline: "Standards compliance depth and certification documentation close specifications.",
    winThemes: [
      {
        title: "A156.10-2024 compliance with current test documentation",
        detail: "ANSI/BHMA A156.10-2024 added stricter dynamic force limits (≤30 lbf at last 10° of travel vs. ≤40 lbf in 2011) and updated sensor monitoring requirements. Verify competitor documentation matches the 2024 edition.",
        proof: "A156.10-2024 §10.1 — revised dynamic force requirements",
      },
      {
        title: "Florida HVHZ — TAS 201/202/203 test reports available",
        detail: "For exterior applications in Miami-Dade and Broward, TAS 201 (large-missile impact), TAS 202 (cyclic wind loading), and TAS 203 (water infiltration) reports are required. We provide these on request for covered products.",
        proof: "Miami-Dade Product Control — NOA database searchable by manufacturer",
      },
      {
        title: "Sensor compliance: A156.10 §8 monitoring requirements",
        detail: "The 2017+ editions of A156.10 require electronic sensor fault monitoring — every closing cycle must verify sensor function. Verify competitor sensor hardware meets §8.3.",
      },
      {
        title: "FGI 2022 healthcare sliding compliance for VersaMax",
        detail: "For hospital and ASC specifications referencing FGI Guidelines 2022, VersaMax 2.0 includes engineering documentation for AIA/FGI-required pressure differential, antimicrobial surface, and operating-room door clearance requirements.",
        proof: "FGI Guidelines for Design and Construction of Hospitals 2022, §2.1-3",
      },
    ],
    differentiators: [
      { dimension: "A156.10-2024 Edition Compliance", ours: "2024 edition test documentation available", theirs: "Verify edition year — ESA series may reference earlier edition", advantage: "moderate" },
      { dimension: "TAS 201/202/203 Test Reports", ours: "Available for FL HVHZ exterior products", theirs: "Limited FL-certified products — verify NOA scope", advantage: "strong" },
      { dimension: "Sensor Fault Monitoring (§8.3)", ours: "Full A156.10 §8 compliance documentation", theirs: "Verify monitoring circuit specification in submittal", advantage: "moderate" },
      { dimension: "Slim-Profile Header Depth", ours: "Competitive but not class-leading", theirs: "ES series competitive; GEZE Slimdrive (70mm) leads this dimension — not dormakaba", advantage: "watch" },
      { dimension: "UL 10C Fire-Rated Listing", ours: "UL 10C listed operators available for fire-rated assemblies", theirs: "Verify UL listing for fire-rated applications", advantage: "moderate" },
      { dimension: "FGI Healthcare Compliance", ours: "VersaMax 2.0 engineered to FGI 2022", theirs: "No FGI-specific submittal package marketed in US", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "The spec only calls out A156.10 — both products qualify.",
        response: "Correct, both meet A156.10. The distinction is edition year. The 2024 edition has revised dynamic force limits and updated sensor monitoring requirements. Ask for test reports referencing the 2024 edition specifically.",
      },
      {
        objection: "GEZE Slimdrive is thinner — the architect prefers it for the curtain wall.",
        response: "GEZE Slimdrive's 70mm header is best-in-class for slim profile — that's a GEZE product, not dormakaba's ES series. If header depth is the driving constraint, it's worth acknowledging. If the project also has egress, fire-rating, or HVHZ requirements, those can be differentiating factors to run through with the EOR.",
      },
      {
        objection: "dormakaba's ESA series has equivalent ANSI compliance.",
        response: "ESA series meets A156.10 — that's correct. The question for the submittal package is which edition year, whether sensor monitoring meets §8.3 fault detection from 2017+ editions, and for exterior FL applications, which NOA numbers cover this exact opening size and configuration.",
      },
      {
        objection: "We need European CE compliance for a mixed US/EU project.",
        response: "That's a case where dormakaba's ESA-CE variants (or GEZE Slimdrive) have an advantage — their dual CE/ANSI compliance pedigree is genuine. For a purely US project, our compliance documentation depth is stronger.",
      },
      {
        objection: "dormakaba's curved BST sliding is the only product that fits our lobby design.",
        response: "BST curved sliding is a genuinely unique product for custom radius entrances. If the geometry truly requires curved sliding, that's their niche. I'd ask the architect whether a premium revolving door (RD300) could achieve the same visual effect within the design intent — and open more bidding competition.",
      },
      {
        objection: "The EOR specified dormakaba by name as basis-of-design.",
        response: "Basis-of-design specs are challenging to displace. The substitution route is a point-for-point A156.10 compliance matrix. I'd also review whether the FL HVHZ requirements are fully addressed by the basis-of-design product — that's a legitimate technical basis for or-equal consideration.",
      },
      {
        objection: "dormakaba's in-ground actuator (ED-IG) is what the spec calls for.",
        response: "Our SW200i-IG handles up to 800 lb / 360 kg in-ground with clean zero-visible-hardware aesthetics. I can provide a spec sheet and A156.10 compliance data today for an or-equal submittal.",
      },
      {
        objection: "We need UL-listed products for this fire-rated opening.",
        response: "We have UL 10C listed operators for fire-rated assemblies — I can provide the UL file number and certification scope. Please also verify dormakaba's UL 10C listing scope covers the door size and configuration in your spec.",
      },
    ],
    landmines: [
      { topic: "Slim-profile header depth comparison", risk: "GEZE Slimdrive genuinely leads on this dimension; dormakaba ES series is competitive but not class-leading", mitigation: "Don't anchor here. Redirect to compliance depth, test documentation, service support, and FGI healthcare applications." },
      { topic: "Curved BST sliding", risk: "dormakaba is the only mainstream manufacturer offering custom-radius curved sliding", mitigation: "Offer RD300 revolving as an alternative design solution. Don't fight a geometry the architect has already specified." },
    ],
    closingMove: "Offer to pull the TAS test reports and A156.10-2024 compliance matrix for the EOR's submittal package — have them in hand before the next meeting.",
    talkTrack: "From an engineering spec perspective, both products reference A156.10. The questions I'd want answered for the submittal package are: which edition year is the test data from, do the sensor monitoring circuits meet the §8.3 fault detection requirement from the 2017 and 2024 editions, and for exterior Florida applications, are the TAS 201/202/203 reports for this specific product in this opening size on file with Miami-Dade Product Control. For healthcare projects referencing FGI 2022, VersaMax 2.0 has a purpose-built submittal package. I can pull all of that today.",
    winSignals: [
      "EOR asks for TAS 201/202/203 or NOA documentation in the submittal package",
      "Project has FGI 2022 healthcare compliance requirement in the specification",
      "Spec references A156.10 without naming a manufacturer — open competition",
    ],
    loseSignals: [
      "Architect has designed to GEZE Slimdrive 70mm header depth in the building section drawings",
      "Project requires custom curved sliding — BST is the only real solution",
      "EOR is European-trained and defaults to EN 16005 rather than A156.10 as the compliance framework",
    ],
    keyMetrics: [
      "A156.10 edition year in competitor submittal vs. 2024 current edition",
      "Number of NOA-certified products by manufacturer in Miami-Dade Product Control database",
      "UL 10C listing file number and scope — verify door size/configuration coverage",
    ],
  },

  // ── dormakaba × pm_interview ──────────────────────────────────────────────
  {
    competitor: "dormakaba",
    context: "pm_interview",
    headline: "Frame dormakaba as a case study in segmentation, service moats, and compliance barriers.",
    winThemes: [
      {
        title: "Service network as a strategic moat",
        detail: "dormakaba competes well on product. ASSA ABLOY Entrance Systems' durable US advantage is the installed base + field-service density flywheel — switching costs are high once a customer is on your service contract and your technicians know their system.",
        proof: "Classic lock-in via complementary goods: door hardware + service contract + annual AAADM inspection",
      },
      {
        title: "Regulatory compliance as a market filter",
        detail: "NOA/TAS requirements in the Florida HVHZ effectively filter out competitors who haven't invested in certification. This is a textbook regulatory moat — as a PM, the question is: which other segments have underserved compliance complexity we could own?",
      },
      {
        title: "Product-market fit by vertical",
        detail: "dormakaba's ES series competes on value-to-spec in glass-facade commercial; GEZE Slimdrive leads on header depth in this segment. ASSA ABLOY ENS wins in healthcare, grocery, and hospitality. Recognizing vertical-specific fit — rather than competing everywhere — is a product strategy insight worth articulating in an interview.",
      },
      {
        title: "Platform vs. point-solution positioning",
        detail: "dormakaba Access + dormakaba Entrances are separate business units. ASSA ABLOY can position as a platform — door + operator + access control + service + ecoLOGIC AI. Platform integration is a different value proposition and a different sales motion.",
      },
    ],
    differentiators: [
      { dimension: "Vertical Fit — Healthcare", ours: "Strong: VersaMax FGI 2022, AAADM network, hermetic line", theirs: "Present but secondary to glass facade focus", advantage: "strong" },
      { dimension: "Vertical Fit — Retail/Grocery", ours: "Strong: SL500, NOA for FL stores, service density", theirs: "ESA series competitive but less entrenched in US retail spec", advantage: "moderate" },
      { dimension: "Vertical Fit — Glass Facade Commercial", ours: "Competitive", theirs: "ES series competes on value-to-spec; GEZE Slimdrive (not dormakaba) is reference spec on header depth", advantage: "watch" },
      { dimension: "Service as Revenue Stream", ours: "Service contracts = meaningful recurring revenue + retention driver", theirs: "Less developed US service revenue model", advantage: "strong" },
      { dimension: "AI/IoT Platform", ours: "ecoLOGIC AI (2025) — energy management, BAS integration", theirs: "No equivalent AI energy management platform announced", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "How would you grow against a competitor like dormakaba?",
        response: "Start with structural advantages — FL HVHZ compliance, service network density, and healthcare vertical depth — and deepen those moats. For segments where dormakaba has product advantage (slim-facade commercial), ask whether that's a segment we want to win or a segment we want to price-for-profit while directing R&D to higher-moat verticals.",
      },
      {
        objection: "What's a product gap you'd prioritize closing?",
        response: "The slim-profile header gap vs. GEZE Slimdrive (and to a lesser extent dormakaba's ES series) is visible to architects. Before committing R&D, I'd validate whether projects lost to dormakaba are actually header-depth driven or service/pricing driven. Often what looks like a product gap is a positioning or sales execution gap.",
      },
      {
        objection: "dormakaba is merging their Access and Entrances businesses — doesn't that close the platform gap?",
        response: "That's exactly the right PM lens. Organizational integration of Access + Entrances would close the platform gap over time. As a strategic response, ASSA ABLOY should accelerate ABLOY + ecoLOGIC integration to widen the moat before dormakaba's platform story becomes credible.",
      },
      {
        objection: "What would you do if dormakaba introduced an AI energy management platform?",
        response: "First, analyze whether it's a credible threat (product depth, US distribution, pricing) or a marketing announcement. If credible, accelerate ecoLOGIC API openness and third-party integrations to increase switching costs before they reach the market. Compete on ecosystem depth, not feature parity.",
      },
    ],
    landmines: [
      { topic: "Oversimplifying the competitive landscape", risk: "Interviewers notice if you flatten a nuanced market into 'we win, they lose'", mitigation: "Explicitly acknowledge dormakaba's genuine strengths. Credibility from honesty is worth more than false confidence." },
      { topic: "Confusing dormakaba Group with dormakaba Entrances", risk: "The two business units have different competitive positions", mitigation: "Be precise: dormakaba Entrances (automatic doors) vs. dormakaba Access (locks/access control) — they compete in different purchase processes." },
    ],
    closingMove: "Close with: 'The insight from dormakaba specifically is that aesthetics and price can open doors, but service density and compliance depth are what keep customers renewing 10 years later.'",
    talkTrack: "When I think about dormakaba as a PM exercise, it's a useful case in how market segmentation shapes competitive advantage. Their ES series competes on value-to-spec in glass-facade commercial — that's a genuine strength (note: GEZE Slimdrive, not dormakaba, leads on header depth in this segment). But in the US, the durable advantage for ASSA ABLOY Entrance Systems is the service network and compliance infrastructure. Once you're the installed base in a healthcare system or a grocery chain, switching costs are high, service contracts create recurring revenue, and your technicians become part of the customer's O&M workflow. That's a moat dormakaba is still building in the US. As a PM, the question I'd be asking is: which verticals should we deepen that moat, and where is the effort-to-return not justified?",
    winSignals: [
      "Interviewer asks about vertical segmentation strategy — you can name specific dormakaba weak verticals",
      "Discussion turns to regulatory compliance as competitive moat — Florida HVHZ is a textbook example",
      "Question about build-vs-buy or platform strategy — ecoLOGIC vs. dormakaba point solution is the case",
    ],
    loseSignals: [
      "You claim we beat dormakaba everywhere — loses credibility immediately",
      "You can't name dormakaba's strongest products (ESA series, ED250, KTV) by SKU — or you incorrectly attribute GEZE's Slimdrive to dormakaba",
      "You conflate dormakaba Access and dormakaba Entrances as one competitive entity",
    ],
    keyMetrics: [
      "US market share by vertical (healthcare, retail, revolving) — sourced from MARKET_SHARE_ESTIMATES",
      "Service contract renewal rate as a retention indicator",
      "FL HVHZ NOA product count as a regulatory moat quantifier",
    ],
  },

  // ── dormakaba × distributor ───────────────────────────────────────────────
  {
    competitor: "dormakaba",
    context: "distributor",
    headline: "Our pull-through, training, and parts support make you more profitable per door.",
    winThemes: [
      {
        title: "AAADM training and certification support",
        detail: "We support your technicians through AAADM certification — required for annual inspections under A156.10. This is a billable service your team can offer. dormakaba's US training infrastructure is thinner.",
        proof: "AAADM certification = recurring annual inspection revenue per door, every year",
      },
      {
        title: "Parts availability and first-call resolution",
        detail: "US warehouse stocking means faster parts delivery, fewer callbacks, and higher first-call resolution rate. That protects your labor margin on service calls — the profit center in a service business.",
      },
      {
        title: "FL compliance pull-through opens exclusive bids",
        detail: "In Florida HVHZ projects, GCs and owners ask for NOA documentation. Our pre-certified products let you close compliance-sensitive bids without back-and-forth. dormakaba reps in FL have to work harder on this — and sometimes lose.",
      },
      {
        title: "ecoLOGIC creates a new product category sale",
        detail: "ecoLOGIC AI is a new conversation opener — building operators can justify the investment through energy savings ROI. It creates a premium upsell opportunity in your existing account base that dormakaba can't match.",
      },
    ],
    differentiators: [
      { dimension: "AAADM Training Support", ours: "Full support — certification pathway for your team", theirs: "Less structured US technician training program", advantage: "strong" },
      { dimension: "Parts Margin / Availability", ours: "US-stocked common SKUs, predictable lead times", theirs: "Potentially longer lead times on US-spec parts", advantage: "moderate" },
      { dimension: "FL Compliance Pull (NOA)", ours: "Ready-to-submit NOA documentation", theirs: "Limited NOA portfolio — your reps do more work per FL bid", advantage: "strong" },
      { dimension: "Co-marketing / Spec Support", ours: "Architect outreach programs, specifier tools, CPD seminars", theirs: "Less aggressive in US specification pull-through", advantage: "moderate" },
      { dimension: "ecoLOGIC Upsell Opportunity", ours: "New premium product category = new revenue stream", theirs: "No equivalent IoT/AI product for distributor upsell", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "dormakaba gives us better unit margin.",
        response: "Unit margin is one number. Model lifetime gross profit per door: unit sale + 10 annual inspections + average parts spend over 10 years. Our first-call resolution rate and parts availability protect service margin. Where does your margin live — in units or in service?",
      },
      {
        objection: "dormakaba reps are easier to work with.",
        response: "I want to understand what 'easier' means — is it response time, documentation, or pricing flexibility? Those are specific things we can address. The structural advantages we bring (AAADM training, FL compliance, ecoLOGIC upsell) are harder to replicate.",
      },
      {
        objection: "dormakaba's ESA series has strong sell-through in our market.",
        response: "ESA is a solid product. The question is what percentage of your market has FL exterior requirements, healthcare spec, or smart building opportunities — those are segments where our pull-through is structurally stronger.",
      },
      {
        objection: "We can't afford to retrain our technicians on a new product line.",
        response: "AAADM certification is a common baseline — technicians certified on any A156.10 product can work across brands with product-specific training. We have a structured onboarding program. How many AAADM-certified techs do you have today?",
      },
    ],
    landmines: [
      { topic: "dormakaba unit margin", risk: "May be genuinely higher in some configurations", mitigation: "Redirect to lifetime margin per door: unit + service + parts + inspection." },
      { topic: "GEZE Slimdrive / dormakaba ES series pull in architectural accounts", risk: "Specifiers who favor slim-profile headers will drive GEZE or dormakaba ES specs", mitigation: "Focus distributor pitch on FL HVHZ, healthcare, and ecoLOGIC verticals where architect pull favors ASSA ABLOY." },
    ],
    closingMove: "Walk through the math: unit sale + 10 annual inspections + average parts spend. Show where the margin story lives.",
    talkTrack: "When we talk to distributors, unit margin comes first. But the distributors most profitable over time look at door-level lifetime gross margin — unit, service contract, annual inspection, and parts. Our AAADM training support, US parts stocking, FL compliance documentation, and now ecoLOGIC AI upsell make your team more effective and more billable. dormakaba competes on unit price. We compete on the full revenue lifecycle of each opening.",
    winSignals: [
      "Distributor has AAADM-certified technicians and wants to grow inspection revenue",
      "Distributor covers FL market and struggles with NOA compliance documentation",
      "Distributor has healthcare or government accounts with FGI or compliance-driven specs",
    ],
    loseSignals: [
      "Distributor is exclusively focused on architectural/glass-facade commercial and spec's GEZE Slimdrive or dormakaba ES series by preference",
      "Distributor's volume is 100% standard retail sliding — dormakaba ESA is a price competitor here",
      "Distributor has an existing preferred relationship with dormakaba that is contractually binding",
    ],
    keyMetrics: [
      "Lifetime gross margin per door: unit margin + annual inspection revenue (×10 years) + parts margin",
      "First-call resolution rate on service calls — proxy for parts availability quality",
      "FL HVHZ bid win rate with NOA-certified vs. non-certified products",
    ],
  },

  // ── dormakaba × florida_hvhz ──────────────────────────────────────────────
  {
    competitor: "dormakaba",
    context: "florida_hvhz",
    headline: "In FL HVHZ, dormakaba's thin certification portfolio is the bid-disqualifier.",
    winThemes: [
      {
        title: "NOA is non-negotiable — dormakaba's US lineup has limited coverage",
        detail: "Florida Building Code §1709.5 requires a valid Notice of Acceptance (NOA) for exterior automatic doors in Miami-Dade and Broward HVHZ. dormakaba's ESA series was designed for North American market but has limited TAS testing vs. ASSA ABLOY's comprehensive HVHZ portfolio.",
        proof: "FBC 8th Ed. §1709.5; Miami-Dade Product Control NOA database",
      },
      {
        title: "TAS 201/202/203 test reports available on demand",
        detail: "For the EOR submittal, TAS 201 (large-missile impact at 50 ft/s), TAS 202 (cyclic wind pressure), and TAS 203 (water infiltration) reports are required for exterior automatic doors in HVHZ. We can provide these by product and opening size on request.",
        proof: "Miami-Dade Test Protocol TAS 201, 202, 203",
      },
      {
        title: "HVHZ market share: 60% ASSA ABLOY vs. 8% dormakaba",
        detail: "In the FL HVHZ sliding door segment, ASSA ABLOY holds approximately 60% market share vs. dormakaba at ~8%. That gap exists because certification investment was made deliberately — and GCs in FL know which products close AHJ inspection.",
      },
    ],
    differentiators: [
      { dimension: "NOA-Certified Exterior Products", ours: "Comprehensive portfolio with valid NOAs", theirs: "Limited — verify each product by NOA number before bid", advantage: "strong" },
      { dimension: "TAS 201/202/203 Documentation", ours: "Available on request per product/size", theirs: "Limited availability — verify before submittal", advantage: "strong" },
      { dimension: "AHJ Inspector Familiarity", ours: "High — AHJs in Miami-Dade/Broward familiar with ASSA ABLOY NOAs", theirs: "Lower — less common in FL HVHZ projects", advantage: "strong" },
      { dimension: "FL HVHZ Market Share (sliding)", ours: "~60%", theirs: "~8%", advantage: "strong" },
      { dimension: "Price in FL Market", ours: "Premium — justified by compliance certainty", theirs: "Lower price but compliance risk shifts to owner/GC", advantage: "watch" },
    ],
    objectionHandlers: [
      {
        objection: "dormakaba says their product meets all Florida requirements.",
        response: "Ask for the specific NOA number and verify it in the Miami-Dade Product Control online database at miamidade.gov. A verbal representation isn't sufficient for an AHJ inspection — the NOA label must be permanently affixed to the product post-installation.",
      },
      {
        objection: "We're in Broward County, not Miami-Dade — different requirements.",
        response: "Broward County adopted the Florida Building Code including HVHZ requirements. The NOA standard applies throughout the HVHZ boundary. Verify the specific Broward AHJ interpretation, but NOA compliance is the safe assumption.",
      },
      {
        objection: "dormakaba's ESA series has ASTM E283 air infiltration certification — that's different from hurricane rating.",
        response: "Correct — ASTM E283 is an air infiltration test, not an impact/hurricane rating. For FL HVHZ exterior doors, you need TAS 201 (large-missile impact) and TAS 202 (cyclic wind load) — a completely different test protocol. Those are what the NOA covers.",
      },
      {
        objection: "The GC says they've installed dormakaba in Florida before without issues.",
        response: "There may be non-HVHZ Florida projects where dormakaba works fine. The NOA requirement is specific to the HVHZ zone (Miami-Dade, Broward, and portions of Palm Beach). If this project has exterior openings in that zone, the NOA is legally required regardless of prior experience elsewhere.",
      },
      {
        objection: "dormakaba will submit for NOA if we specify their product.",
        response: "NOA applications take 6–18 months and require testing at a Miami-Dade-approved lab. If they don't have an NOA today, they can't get one before your project's submittal deadline. Verify the current status in the Miami-Dade Product Control database.",
      },
      {
        objection: "It's an interior door — NOA doesn't apply.",
        response: "Correct — NOA is for exterior envelope products only. If this sliding door is fully interior with no exposure to exterior weather load, the standard A156.10 applies and dormakaba's ESA series is a legitimate competitor.",
      },
      {
        objection: "We can use a rated impact window + standard automatic door.",
        response: "That's one approach some projects use. The AHJ determines whether the impact glazing plus standard door combination meets FBC §1709.5 as a system. Get an AHJ pre-approval before committing to that approach — a rejected submittal is an expensive correction.",
      },
      {
        objection: "dormakaba's price in FL is 20% below yours.",
        response: "On an HVHZ exterior project, an AHJ rejection and product replacement can cost 3–5× the initial price delta. I'd rather win this bid at a higher price and deliver a compliant product than watch a competitor's NOA issue become a change order in the middle of construction.",
      },
    ],
    landmines: [
      { topic: "Interior door applications in FL", risk: "NOA doesn't apply to fully interior doors — dormakaba competes on equal footing", mitigation: "Confirm with owner/EOR whether any doors are in the exterior envelope. Don't make the HVHZ argument for interior-only scopes." },
      { topic: "Claiming competitor has no FL presence at all", risk: "dormakaba has some FL installations and some certified products — overstating their weakness backfires", mitigation: "Say 'limited HVHZ-certified portfolio — verify by product' rather than 'no FL certification at all.'" },
    ],
    closingMove: "Pull the Miami-Dade Product Control NOA search in the meeting — look up both manufacturers. The number difference closes the argument.",
    talkTrack: "In FL HVHZ, the question isn't whether dormakaba makes a good product globally — they do. The question is whether the specific product in your bid has a valid NOA covering the opening size and configuration you've specified. Florida Building Code §1709.5 requires that label to be permanently affixed to the product post-installation. An AHJ inspector will check it. If it's not there, the project fails inspection. ASSA ABLOY has approximately 60% of the FL HVHZ sliding door market because we've invested in that certification infrastructure — and GCs and AHJs in Miami-Dade and Broward know our products close without issues.",
    winSignals: [
      "Project has exterior openings in Miami-Dade or Broward HVHZ zone",
      "EOR or GC asks for NOA number and TAS test report numbers by product",
      "Owner has previous experience with an AHJ rejection on a non-certified product",
    ],
    loseSignals: [
      "All doors are interior — NOA doesn't apply",
      "Project is in FL but outside HVHZ boundary (e.g., interior Florida county)",
      "Owner accepts compliance risk and insists on dormakaba pricing without verification",
    ],
    keyMetrics: [
      "NOA count: ASSA ABLOY vs. dormakaba in Miami-Dade Product Control database (searchable at miamidade.gov)",
      "FL HVHZ sliding door market share: ~60% ASSA ABLOY vs. ~8% dormakaba",
      "AHJ rejection rate for non-NOA products — sourced from FL building department data",
    ],
  },

  // ── dormakaba × healthcare ─────────────────────────────────────────────────
  {
    competitor: "dormakaba",
    context: "healthcare",
    headline: "VersaMax 2.0 is purpose-built for FGI 2022 — dormakaba has no equivalent US healthcare platform.",
    winThemes: [
      {
        title: "FGI 2022 compliance platform — VersaMax 2.0",
        detail: "VersaMax 2.0 was engineered to FGI Guidelines for Design and Construction of Hospitals 2022, including pressure differential sensing, antimicrobial surface standard, infection-control mode (delayed re-opening), and quiet operation < 55 dB. dormakaba has no equivalent FGI-marketed US healthcare sliding door.",
        proof: "FGI Guidelines 2022 §2.1-3 sliding door requirements for hospitals and ASCs",
      },
      {
        title: "SL500 Clean Room hermetic sliding for pharma and OR",
        detail: "SL500 Clean Room provides positive-pressure sealing with HEPA-compatible gaskets for hospital operating rooms and pharmaceutical clean rooms. IP54 rated. dormakaba's US equivalent is less specifically marketed to this FGI/ASHRAE application.",
      },
      {
        title: "Healthcare service network and AAADM compliance coverage",
        detail: "Hospital facilities require annual AAADM inspection on all A156.10 doors. ASSA ABLOY's national AAADM network ensures healthcare clients can meet compliance obligations without sourcing additional inspection contractors.",
      },
    ],
    differentiators: [
      { dimension: "FGI 2022 Purpose-Built Platform", ours: "VersaMax 2.0 — engineered and marketed to FGI 2022", theirs: "No FGI-specific healthcare sliding platform in US market", advantage: "strong" },
      { dimension: "Hermetic/Clean Room Sliding", ours: "SL500 Clean Room — IP54, HEPA-compatible gaskets", theirs: "ESA series variants — less specifically marketed to healthcare", advantage: "moderate" },
      { dimension: "Infection Control Mode", ours: "Standard on VersaMax 2.0", theirs: "Not a marketed feature on US healthcare products", advantage: "strong" },
      { dimension: "Antimicrobial Surface Standard", ours: "99.9% antimicrobial on VersaMax 2.0", theirs: "Not a standard feature on ESA series", advantage: "strong" },
      { dimension: "Swing Operator for Bariatric/Heavy Doors", ours: "SW200i-IG: 800 lb in-ground; SW300: slim dual-mode", theirs: "ED250: 400 kg surface — excellent for heavy doors", advantage: "moderate" },
      { dimension: "Healthcare AAADM Network Density", ours: "Deep national coverage for annual inspections", theirs: "Thinner US AAADM-certified network", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "dormakaba's ED100 is in hospitals all over the country.",
        response: "ED100 is a reliable mid-duty swing operator with a good track record in healthcare. The differentiation question is whether the project references FGI 2022 for the specification — if it does, VersaMax 2.0 has an engineered submittal package for that standard that ED100 doesn't match.",
      },
      {
        objection: "The hospital already uses dormakaba hardware system-wide.",
        response: "Dormakaba access control and dormakaba entrances are separate purchasing decisions. The entrance system specification can be independent of the hardware platform. Has the hospital's facilities team reviewed the FGI 2022 requirements for the new wing?",
      },
      {
        objection: "dormakaba's ED250 handles heavier bariatric doors.",
        response: "ED250 at 400 kg surface-mount is excellent for heavy doors. For bariatric patient room doors where aesthetics and floor clearance matter, our SW200i-IG handles 800 lb in-ground with zero surface hardware. What does the specific door weight and frame clearance look like?",
      },
      {
        objection: "Healthcare specs are usually written to A156.10 generically — dormakaba qualifies.",
        response: "Correct at the A156.10 baseline. The differentiator is FGI 2022 language. If the healthcare architect references FGI guidelines (common in hospital new construction since 2022), the specification language for sliding doors includes pressure differential, quiet operation, and antimicrobial requirements that VersaMax 2.0 addresses specifically.",
      },
      {
        objection: "The infection control officer wants HEPA-rated doors — dormakaba has that too.",
        response: "Let's compare the specific models and their sealing certifications. SL500 Clean Room has IP54 rating and HEPA-compatible gasket documentation that we can provide to the ICO. What's dormakaba proposing by model number?",
      },
      {
        objection: "dormakaba's price for this healthcare project is lower.",
        response: "Healthcare projects have a long lifecycle and infection control failures are expensive — litigation risk, patient safety, and regulatory compliance. The question is whether the lower-price product carries an equivalent FGI compliance documentation package. If not, the EOR may not accept it in the submittal.",
      },
      {
        objection: "We specify NABCO hermetic for OR doors — dormakaba isn't even in the conversation.",
        response: "NABCO Gyro-Tech hermetic is a known product for operating rooms. Our SL500 Clean Room competes directly with hermetic sealing documentation. What's the project size — if there are non-hermetic sliding doors in the same facility, we can serve the full scope and reduce the number of service contracts.",
      },
      {
        objection: "The hospital needs rapid-response service — dormakaba has a distributor nearby.",
        response: "Response time is critical in healthcare. What's the distributor's committed response time SLA? We can compare AAADM-certified technician availability in this zip code specifically. Proximity is one variable — certification level is another.",
      },
    ],
    landmines: [
      { topic: "dormakaba ED100 existing hospital install base", risk: "Switching an existing hospital account from dormakaba ED to ASSA ABLOY SW is a large change-management ask", mitigation: "Focus on new construction, wing expansions, and FGI 2022 renovation projects where the spec is being freshly written." },
      { topic: "ED250 heavy swing capability", risk: "dormakaba ED250 at 400 kg is a genuine competitor for very heavy doors", mitigation: "Compete on in-ground actuator option (SW200i-IG) for aesthetics, or FGI compliance documentation for the overall package." },
    ],
    closingMove: "Offer the FGI 2022 compliance matrix for VersaMax 2.0 — send it to both the facilities manager and the architect before the next design team meeting.",
    talkTrack: "In healthcare new construction and major renovation, the specification driver since 2022 is the FGI Guidelines — and VersaMax 2.0 was engineered to those guidelines. Pressure differential sensing, infection-control delayed re-open mode, 99.9% antimicrobial surface, and quiet operation under 55 dB are the features the ICO and facilities manager care about. dormakaba's US sliding product line doesn't have an equivalent FGI 2022 submittal package. For the EOR, that translates to a cleaner submittal review and fewer RFI's during construction. For the facilities team, it means compliance documentation is already organized when JCAHO comes.",
    winSignals: [
      "Project references FGI Guidelines 2022 in the specification scope",
      "Healthcare system has infection control officer involved in specification review",
      "New hospital construction or major wing renovation (fresh spec, no incumbent product bias)",
    ],
    loseSignals: [
      "Hospital system has existing dormakaba swing operators and wants one-vendor service relationship",
      "Spec is written generically to A156.10 with no FGI or healthcare-specific requirements",
      "ED250 heavy-swing is the primary specified product — not a healthcare-specific application",
    ],
    keyMetrics: [
      "US healthcare automatic door market share: ASSA ABLOY ~40% vs. dormakaba ~18%",
      "FGI 2022 compliance item count: VersaMax 2.0 vs. dormakaba ESA documented features",
      "AAADM-certified technician count within 50 miles of project location — compare by region",
    ],
  },

  // ── dormakaba × iot_smart_building ────────────────────────────────────────
  {
    competitor: "dormakaba",
    context: "iot_smart_building",
    headline: "ecoLOGIC AI is in market. dormakaba has no US equivalent — yet.",
    winThemes: [
      {
        title: "ecoLOGIC: AI-driven energy management (2025)",
        detail: "ecoLOGIC uses sensor fusion and machine learning to learn traffic patterns and optimize door operation timing — reducing HVAC load by up to 80% vs. manually operated doors. API connects to building automation systems (BAS/BMS). dormakaba has not announced a competing platform for the US market.",
        proof: "Up to 80% energy savings vs. manual door operation; ASHRAE 90.1 compatible",
      },
      {
        title: "SW300-S app-configured swing (BAU 2025)",
        detail: "SW300-S introduced BLE smartphone configuration — setup time under 5 minutes, remote diagnostics, and firmware OTA updates. This is an IoT capability that reduces installation labor and enables predictive maintenance at scale.",
        proof: "BAU 2025 product launch — BLE app configuration, remote diagnostics",
      },
      {
        title: "OSDP v2 integration — enterprise-grade access control interoperability",
        detail: "OSDP v2 is the industry-standard open protocol for access control interoperability. ASSA ABLOY products support OSDP v2 natively, enabling integration with Lenel, CCURE, Genetec, and other major PACS platforms without proprietary gateways.",
      },
    ],
    differentiators: [
      { dimension: "AI Energy Management Platform", ours: "ecoLOGIC — in-market since 2025", theirs: "No equivalent announced for US market", advantage: "strong" },
      { dimension: "BLE App Configuration", ours: "SW300-S — BLE setup < 5 min, remote diagnostics", theirs: "No BLE-configured swing operator announced", advantage: "strong" },
      { dimension: "OSDP v2 Native Support", ours: "Native OSDP v2 on entrance hardware", theirs: "OSDP support exists but less prominently marketed on entrance products", advantage: "moderate" },
      { dimension: "BAS API Integration", ours: "ecoLOGIC API for BAS/BMS integration", theirs: "No entrance-specific BAS API marketed", advantage: "strong" },
      { dimension: "Predictive Maintenance Data", ours: "ecoLOGIC collects cycle data for predictive service alerts", theirs: "No predictive maintenance platform for entrance products", advantage: "strong" },
      { dimension: "Access Control Platform (Kaba)", ours: "ABLOY ecosystem deep integration", theirs: "Strong Kaba AC legacy — may have IoT integration not yet marketed", advantage: "neutral" },
    ],
    objectionHandlers: [
      {
        objection: "dormakaba has their own access control platform — they'll add IoT to it.",
        response: "That's the strategic risk to watch. dormakaba's Kaba access control platform is strong. But ecoLOGIC is in the market now with field deployments and BAS API documentation. The question for your project timeline is which platform is deployable today.",
      },
      {
        objection: "Our building uses a Siemens BAS — does ecoLOGIC integrate?",
        response: "ecoLOGIC provides an open API for BAS/BMS integration, and the Siemens Desigo CC integration path has been documented. I can connect you with our IoT integration team to scope the specific protocol your building uses.",
      },
      {
        objection: "We're not ready for AI in our entrance systems — this is too early stage.",
        response: "Understood. ecoLOGIC can be deployed in monitoring-only mode first — data collection without AI control — so your facilities team can build confidence in the system before enabling AI-driven optimization. Many customers start that way.",
      },
      {
        objection: "dormakaba's ED100 has been in our building for 10 years without a smart upgrade — why would we change now?",
        response: "You don't need to replace working hardware. ecoLOGIC is a gateway device that can layer onto existing ASSA ABLOY automatic door installations. The upgrade path doesn't require full hardware replacement — it's an add-on to qualifying installed products.",
      },
      {
        objection: "Smart building features add cost — our facilities budget is fixed.",
        response: "ecoLOGIC has an energy ROI model: up to 80% reduction in HVAC conditioning of infiltrated air. For a facility with high-traffic exterior doors, the payback period is typically 2–4 years depending on climate zone and door cycle volume. I can run the energy model for your specific facility.",
      },
    ],
    landmines: [
      { topic: "dormakaba Kaba IoT roadmap", risk: "dormakaba may announce a competing AI/connected entrance platform — when they do, the differentiation window closes", mitigation: "Accelerate ecoLOGIC deployment and build switching costs through BAS integrations and data ownership before a competitor launches." },
      { topic: "ecoLOGIC early-market field data", risk: "2025 launch means limited long-term field data vs. mature dormakaba products", mitigation: "Lead with energy ROI model and reference early-adopter pilots. Don't over-claim on unverified long-term reliability data." },
    ],
    closingMove: "Run the energy ROI model for their specific facility — present payback period and annual savings. Make the investment decision easy.",
    talkTrack: "The IoT/smart building conversation is where we have the widest competitive gap on dormakaba today. ecoLOGIC AI is in market — AI-driven door operation optimization with BAS API integration and up to 80% energy savings vs. manually operated doors. dormakaba hasn't announced a competing platform for the US market. Our SW300-S swing operator adds BLE app configuration and remote diagnostics for installers. And OSDP v2 native support means enterprise PACS systems can talk to our entrance hardware without proprietary gateways. For building owners increasingly under ASHRAE 90.1 pressure to reduce envelope energy loads, this is becoming a specification question, not just a feature question.",
    winSignals: [
      "Owner or FM asks about ASHRAE 90.1 envelope energy compliance or LEED/WELL points",
      "Building has a modern BAS/BMS system with open API integration capability",
      "Project is new construction with smart building specifications in the MEP scope",
    ],
    loseSignals: [
      "Retrofit project with existing dormakaba hardware — switching cost is too high",
      "Owner has no interest in IoT or smart building investment in current budget cycle",
      "Building's BAS is a legacy closed system with no integration pathway",
    ],
    keyMetrics: [
      "Energy savings: up to 80% reduction in HVAC load from door infiltration (ecoLOGIC claim)",
      "ROI payback period: 2–4 years in high-traffic exterior door applications",
      "OSDP v2 adoption rate among enterprise PACS platforms (Lenel, CCURE, Genetec, etc.)",
    ],
  },

  // ── dormakaba × revolving_door ─────────────────────────────────────────────
  {
    competitor: "dormakaba",
    context: "revolving_door",
    headline: "dormakaba KTV/KTC is European-certified. For US projects, the A156.27 gap is your opening.",
    winThemes: [
      {
        title: "ASSA ABLOY RD series: US A156.27 certified — no asterisk",
        detail: "Every ASSA ABLOY revolving door — RD3/RD4 through RD700 and RD3A/RD4A1 — carries confirmed ANSI/BHMA A156.27-2019 certification for the US market. This is the governing standard for power-operated revolving doors: max 4 RPM rotation, breakout force ≤ 130 lbf per wing, collapsed egress ≥ 36 in. aggregate, and slow-speed ADA mode ≤ 2 RPM. When an AHJ or owner asks for compliance documentation, our submittal package is complete.",
        proof: "ANSI/BHMA A156.27-2019 — US standard governing power-operated revolving doors",
      },
      {
        title: "dormakaba KTV/KTC: EN 16005 primary — US A156.27 status is unconfirmed",
        detail: "dormakaba's KTV and KTC revolving door series carries EN 16005 European certification — a genuine pedigree. However, EN 16005 is the European standard. For US projects, the governing standard is ANSI/BHMA A156.27, not EN 16005. dormakaba's US A156.27 certification status for KTV/KTC should be formally verified with dormakaba US before any North American specification. If a project AHJ requests A156.27 test documentation and dormakaba cannot produce it, the spec fails compliance review.",
        proof: "ANSI/BHMA A156.27-2019 §1 — scope explicitly covers power-operated revolving doors in the US market",
      },
      {
        title: "High-capacity revolving: RD700 at 6 m vs. KTC 3/4 at 6.2 m — we compete directly",
        detail: "For airports, convention centers, and major transit hubs, the KTC 3/4 at 6.2 m diameter is dormakaba's flagship. Our RD700 High Capacity goes to 6 m at up to 3,600 persons/hr. The 200mm diameter gap is not a meaningful operational difference on a project that likely has 12–18 months of lead time. What is meaningful is US compliance documentation and service infrastructure.",
      },
      {
        title: "Magnetic levitation is beautiful — not exclusive",
        detail: "dormakaba's KTV 3/4 uses magnetic levitation bearings — ultra-quiet, low-maintenance, and a genuine premium differentiator in hospitality lobbies. Our RD300 All-Glass and RD600 UniTurn match the aesthetic category with full A156.27 certification. If quiet operation is the spec driver, we can address it directly. If US compliance and service depth are the project priorities, we win clearly.",
      },
      {
        title: "US service infrastructure: AAADM national density vs. distributor-dependent",
        detail: "ASSA ABLOY Entrance Systems operates through AAADM-certified technicians with national US coverage. ANSI/BHMA A156.27, like A156.10, requires annual inspection by a qualified technician — and for a 6 m revolving door in a US airport, the service contract matters as much as the product. dormakaba's KTV/KTC service in North America runs through distributors, not a dense factory-direct network.",
        proof: "A156.27 §11 — annual safety inspection requirement for power-operated revolving doors",
      },
    ],
    differentiators: [
      { dimension: "US A156.27 Certification", ours: "Confirmed — all RD series products", theirs: "EN 16005 (European); US A156.27 status: verify with dormakaba US", advantage: "strong" },
      { dimension: "Revolving Door Range", ours: "RD3/RD4 compact → RD700 high-capacity (6 m), RD3A/RD4A1 access-control", theirs: "KTV 3/4 (3.8 m), KTV Atrium all-glass, KTC 3/4 (6.2 m), KTC 2 (2-wing + sliding)", advantage: "neutral" },
      { dimension: "All-Glass Revolving", ours: "RD300 All-Glass — motorized, up to 3.6 m", theirs: "KTV Atrium Flex — all-glass, collapsible wings, 3.8 m", advantage: "watch" },
      { dimension: "High-Capacity Revolving", ours: "RD700: up to 6 m, 3,600 persons/hr", theirs: "KTC 3/4: 6.2 m — marginally larger but US cert unconfirmed", advantage: "moderate" },
      { dimension: "Drive Technology", ours: "Electromechanical; soft-start/soft-stop", theirs: "Magnetic levitation (KTV) — ultra-quiet, low-friction; premium differentiator", advantage: "watch" },
      { dimension: "Access Control Integration", ours: "RD3A/RD4A1: OSDP v2 open standard; biometric-ready", theirs: "KTV access-control variant: Kaba ecosystem; less open", advantage: "moderate" },
      { dimension: "North America Lead Time", ours: "Standard US stocking and distribution", theirs: "KTC/KTV known for long NA lead times — 12–36 months on major projects", advantage: "strong" },
      { dimension: "US Field Service (Revolving)", ours: "AAADM-certified national coverage", theirs: "Distributor-dependent; thinner factory-direct density", advantage: "strong" },
      { dimension: "Florida HVHZ (Exterior)", ours: "No confirmed HVHZ revolving NOA (revolving doors typically interior)", theirs: "No confirmed HVHZ revolving NOA either", advantage: "neutral" },
    ],
    objectionHandlers: [
      {
        objection: "dormakaba KTV has magnetic levitation — it's quieter than anything else on the market.",
        response: "Magnetic levitation is a real differentiator — ultra-quiet operation is genuinely premium for a five-star hotel lobby or corporate headquarters where ambient noise matters. Two questions: first, does the project specification call for A156.27 compliance documentation? If yes, we need to verify that dormakaba can produce a US A156.27 test report for the KTV — their primary certification is EN 16005, the European standard. Second, what's the lead time requirement? KTV/KTC on North American projects has historically run long. Our RD300 and RD600 address the luxury lobby spec with full US compliance and predictable delivery.",
        bridgeTo: "Ask for the AHJ's compliance documentation requirements. If A156.27 is called out, the KTV cert gap becomes a live project risk.",
      },
      {
        objection: "The KTC 3/4 is bigger than your RD700 — 6.2 m vs. 6 m. It handles more people.",
        response: "The 200mm diameter difference translates to roughly a 3% throughput delta on a door with 18-month lead time, multi-year service contracts, and a US compliance obligation. The more meaningful question is: can dormakaba produce A156.27-2019 certification documentation for the KTC 3/4 when the AHJ submits for permit? We have it. Until dormakaba US can confirm it for KTC, you're carrying a compliance risk on a $500K+ entrance system.",
        bridgeTo: "Offer to pull the A156.27 submittal documentation right now vs. asking the customer to request it from dormakaba.",
      },
      {
        objection: "We've used dormakaba KTV in our European hotels and it worked perfectly.",
        response: "European project success is legitimate — EN 16005 is a solid standard and the KTV performs well. The US market has a different compliance framework. ANSI/BHMA A156.27 is the governing standard here, and AHJ permit reviewers in major US cities will call for it. The difference between EN 16005 and A156.27 isn't just paperwork — the force limits, egress geometry, and ADA slow-speed mode requirements have specific US values. Our RD series was engineered and certified to A156.27 from the ground up for this market.",
      },
      {
        objection: "dormakaba quoted a lower price on the KTV 3/4 vs. your RD300.",
        response: "Initial unit cost is one line. Add the US compliance verification process if A156.27 is required by the AHJ, the service contract over a 15-year asset life, and lead-time risk on a project schedule. KTV/KTC on North American projects is not a standard-stock item — long-lead custom procurement on a hotel opening date creates real schedule exposure. What's the owner's risk tolerance if the revolving door is the last item delaying a lobby opening?",
      },
      {
        objection: "The spec says A156.27 is required. dormakaba says their KTV meets it.",
        response: "Ask them to produce the A156.27-2019 test report. Not the EN 16005 certificate — the US A156.27 document from a BHMA-recognized test lab. KTV and KTC carry European EN 16005 certification. Whether that translates to formal US A156.27 test documentation is something dormakaba US needs to confirm in writing. We can produce our A156.27 submittal for any RD product today. Start there and see what comes back from their side.",
        bridgeTo: "This is the live landmine — if they can't produce it, the spec closes on us.",
      },
      {
        objection: "dormakaba's KTC 2 with the integrated sliding bypass is interesting — it handles ADA and high traffic in one unit.",
        response: "KTC 2 is a clever product — 2-wing revolving with integrated sliding panel in the drum wall is a genuinely compact solution for high-throughput ADA access. The compliance picture is more complex: the revolving component requires A156.27 and the integrated sliding panel requires A156.10-2024 — that's a dual-standard submission, and both need US certification. Our RD600 with an adjacent SL500 ADA bypass sliding door gives you the same traffic management in a well-understood two-unit configuration where every product certification is clean and established.",
      },
    ],
    landmines: [
      {
        topic: "A156.27 vs. EN 16005 — the certification gap",
        risk: "dormakaba KTV/KTC primary certification is EN 16005 (European). If a US AHJ or owner calls for ANSI/BHMA A156.27-2019 test documentation and dormakaba cannot produce it, the entire specification fails compliance review — potentially killing the project schedule on a long-lead custom door.",
        mitigation: "Always lead with our A156.27 submittal package. Ask the customer to formally request A156.27 test documentation from dormakaba US before the bid closes. If they can't produce it in the first meeting, the gap is real.",
      },
      {
        topic: "KTV magnetic levitation aesthetic preference",
        risk: "Magnetic levitation ultra-quiet operation is a genuine differentiator in premium hospitality. Architects and hospitality designers who've seen the KTV demo may specify by feature rather than by standard.",
        mitigation: "Don't fight the aesthetic — compete on compliance, lead time, and US service infrastructure. Pivot to: 'The KTV is beautiful; our obligation is to make sure it can get permitted and delivered on your timeline.'",
      },
      {
        topic: "KTC 3/4 large-diameter airport spec",
        risk: "For airport and convention center specs calling for 6+ meter revolving doors, the KTC 3/4 at 6.2m has a size advantage on paper. Airport procurement teams may cite the diameter spec specifically.",
        mitigation: "Compete on compliance documentation, AAADM service coverage, lead time certainty, and the fact that 200mm diameter is operationally immaterial. Run the throughput math — 3,600 persons/hr at 6m is sufficient for nearly all US airport gate concourses.",
      },
      {
        topic: "Long KTV/KTC lead times — can be a win or a miss",
        risk: "If the project owner doesn't understand KTV/KTC North American lead times upfront, dormakaba may win the spec and then struggle with delivery — creating a relationship opportunity for us at renewal, but also reputational risk for the revolving door product category broadly.",
        mitigation: "Name the lead time risk explicitly during the competitive evaluation. Ask the GC and owner when the lobby opening date is. Then ask dormakaba for a confirmed ship date in writing.",
      },
    ],
    closingMove: "Ask the customer to request A156.27-2019 test documentation from dormakaba US — not the EN 16005 certificate. If it comes back verified, the compliance gap is closed and you compete on lead time and service. If it doesn't come back clean, the spec closes in your favor without a single negative word about the competitor.",
    talkTrack: "dormakaba makes exceptional revolving doors — the KTV magnetic levitation bearing is genuinely premium engineering, and the KTC 3/4 at 6.2 meters is impressive hardware. The question in a US project is not which door looks better in a showroom. The question is which door can be permitted, delivered on schedule, and serviced for the next 15 years. ASSA ABLOY RD series carries confirmed ANSI/BHMA A156.27-2019 US certification across the full product line. dormakaba KTV and KTC carry EN 16005 — the European standard. That's not a knock; it's a different standard for a different market. When a US AHJ asks for A156.27 documentation on permit day, we produce it immediately. Until dormakaba US can confirm the same for KTV and KTC in writing, that gap is a live compliance risk on any US project. Add AAADM-certified national service coverage and predictable North American lead times, and the full-lifecycle case for ASSA ABLOY RD is clear.",
    winSignals: [
      "Project spec explicitly calls out ANSI/BHMA A156.27 compliance documentation as a submission requirement",
      "Project timeline is tight — hotel opening date, airport terminal milestone, or convention center event deadline",
      "Owner has multiple US locations and values standardized service contracts",
      "AHJ is known to be strict on permit documentation in Miami-Dade, NYC, Chicago, or major US markets",
      "Project includes both revolving and sliding/swing doors — full opening scope favors ASSA ABLOY breadth",
    ],
    loseSignals: [
      "Architect or designer has visited a dormakaba KTV installation and is specifying by feature (magnetic levitation by name)",
      "Project is in a European-headquartered brand's US portfolio where dormakaba is the global preferred vendor",
      "Procurement team prioritizes lowest initial unit cost and has minimal compliance documentation requirements",
    ],
    keyMetrics: [
      "A156.27-2019 certification: ASSA ABLOY RD series = confirmed; dormakaba KTV/KTC = verify with dormakaba US",
      "RD700 throughput: 3,600 persons/hr at 6 m vs. KTC 3/4: ~3,400 persons/hr at 6.2 m",
      "North America KTV/KTC lead time: 12–36 months (custom) vs. RD series: standard US distribution",
      "US market share, revolving doors: ASSA ABLOY 42% vs. dormakaba 28% (industry analyst composite, 2025)",
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // STANLEY ACCESS CARDS
  // ════════════════════════════════════════════════════════════════════════════

  // ── stanley × customer_pitch ──────────────────────────────────────────────
  {
    competitor: "stanley",
    context: "customer_pitch",
    headline: "Allegion/Stanley is now a bundled platform play — know what you're competing against.",
    winThemes: [
      {
        title: "The Allegion bundle has a gap: no revolving doors, no ecoLOGIC",
        detail: "Allegion acquired Stanley Access Technologies in July 2022 for $900M. Their Seamless Access strategy bundles Schlage access control, LCN closers, Von Duprin exit devices, and Stanley auto doors. Impressive breadth — but no revolving door product, no AI energy management, and their access control is a closed Schlage ecosystem vs. ASSA ABLOY's open OSDP v2 standard.",
        proof: "Allegion 2022 acquisition; Seamless Access product strategy; ASSA ABLOY OSDP v2 open protocol",
      },
      {
        title: "Revolving doors — Allegion/Stanley has none",
        detail: "If any location in your portfolio requires a revolving door — hotel lobby, airport terminal, corporate headquarters — Allegion/Stanley cannot bid. Their Seamless Access bundle stops at the sliding and swing door. ASSA ABLOY's RD series covers compact 2.0m through high-capacity 6.0m. No competitive overlap.",
      },
      {
        title: "Healthcare and FGI compliance depth",
        detail: "ASSA ABLOY VersaMax 2.0 is purpose-built for FGI 2022 healthcare specification including infection-control mode, antimicrobial surfaces, and pressure differential sensing. Allegion/Stanley's ProCare line competes, but lacks the FGI-engineered submittal package. For a hospital specifying FGI 2022, VersaMax is the documented solution.",
      },
      {
        title: "Open ecosystem vs. closed Schlage bundle",
        detail: "Allegion's Seamless Access bundles Schlage access control with Stanley auto doors — but if your facility already runs a non-Schlage access control platform, their bundle creates vendor lock-in, not integration. ASSA ABLOY's OSDP v2 open protocol integrates with virtually any enterprise access control system.",
      },
    ],
    differentiators: [
      { dimension: "Revolving Doors", ours: "Full RD3–RD700 range", theirs: "No revolving door product line (Allegion or Stanley)", advantage: "strong" },
      { dimension: "AI Energy Management", ours: "ecoLOGIC AI platform (2025)", theirs: "No equivalent IoT/AI entrance platform", advantage: "strong" },
      { dimension: "Healthcare FGI Compliance", ours: "VersaMax 2.0 — FGI 2022 engineered", theirs: "ProCare line — present but less FGI-document-specific", advantage: "moderate" },
      { dimension: "Access Control Ecosystem", ours: "ABLOY + OSDP v2 open protocol — works with any platform", theirs: "Schlage-native — bundled but proprietary ecosystem", advantage: "moderate" },
      { dimension: "Retail / Commercial Sliding", ours: "Competitive — SL500/SL521", theirs: "Dura-Glide 2000 is the dominant US reference product", advantage: "watch" },
      { dimension: "Single-Vendor Opening Bundle", ours: "ASSA ABLOY Group: door + hardware + access control + service", theirs: "Allegion: Schlage + LCN + Von Duprin + Stanley auto door", advantage: "neutral" },
      { dimension: "Innovation Velocity", ours: "Active R&D — ecoLOGIC, SW300-S BAU 2025, OSDP v2", theirs: "Allegion integration still maturing; channel re-education ongoing", advantage: "moderate" },
    ],
    objectionHandlers: [
      {
        objection: "We've used Dura-Glide for 20 years — it's proven.",
        response: "20 years of Dura-Glide is a real track record. The honest question is: are the requirements of your next project the same as your last? Allegion has changed Stanley's go-to-market — they'll now try to bundle their Schlage access control and LCN hardware into the same proposal. That's a different evaluation than a standalone door decision.",
        bridgeTo: "Ask about access control platform and whether Schlage is already in the ecosystem.",
      },
      {
        objection: "Allegion/Stanley's Seamless Access bundle is appealing — one vendor.",
        response: "The bundle is appealing until you look at what's in it. If you're already running a non-Schlage access control platform, the Allegion bundle creates lock-in rather than integration. And the bundle has no revolving doors and no AI energy management. We can offer the same single-vendor breadth with ASSA ABLOY Group — and we do it with an open OSDP v2 standard.",
        bridgeTo: "Map the full opening inventory — what percentage requires revolving or smart building integration?",
      },
      {
        objection: "Dura-Storm is already FL hurricane-rated — why would we change?",
        response: "Dura-Storm is a solid product for hurricane-rated sliding. The question is whether your project needs only sliding doors or also swing, folding, or revolving for the same property. A unified ASSA ABLOY solution covers all of those with one service relationship and one NOA portfolio.",
      },
      {
        objection: "Allegion's Schlage integration means better access control.",
        response: "Schlage is an excellent access control system — one of the best. If you're a Schlage shop, the Allegion/Stanley bundle has real appeal. The question is: do you want your access control vendor to also control your automatic door choice? Our OSDP v2 integration means you can have Schlage access control with ASSA ABLOY doors — best of both without the lock-in.",
      },
      {
        objection: "The M-Force NEW handles 700 lb doors — that covers everything we need.",
        response: "M-Force NEW is an impressive product — 700 lb is heavy-duty capacity. Our SW200i-IG handles 800 lb in-ground with zero visible hardware, and SW300 covers both full and low energy modes in one slim SKU at 85mm. What does the door look like — surface mount or concealed preferred?",
      },
      {
        objection: "Stanley's GreenStar meets our green building spec.",
        response: "GreenStar's ASTM E283 air infiltration data is solid. Our ecoLOGIC AI goes further — it's dynamic energy management, not just a better-sealed door. For LEED points and ASHRAE 90.1 compliance, both are relevant but serve different aspects of the envelope energy model.",
      },
      {
        objection: "We have an Allegion national account agreement.",
        response: "National account agreements are real procurement advantages. I'd ask whether that agreement covers all the door types in your portfolio — specifically revolving doors, hermetic healthcare doors, and smart building integration. If those are excluded, you're sourcing separately anyway and the 'one vendor' story has gaps.",
      },
      {
        objection: "Stanley's Dura-Shield covers our blast requirement.",
        response: "Dura-Shield is the right product for GSA-TS01 Level 3 blast requirements — that's a genuine Allegion/Stanley niche. For the rest of the project scope (standard sliding, healthcare, revolving, smart building), our portfolio is deeper. Is the blast application the majority of the project or a single opening?",
      },
    ],
    landmines: [
      { topic: "Allegion Seamless Access bundle appeal", risk: "The single-vendor story is compelling; Schlage is already entrenched in many institutional accounts", mitigation: "Counter with OSDP v2 open standard: you can have Schlage + ASSA ABLOY doors. The bundle isn't required." },
      { topic: "Dura-Glide installed base advantage", risk: "Switching costs are real — parts, technician familiarity, owner preference", mitigation: "Don't attack Dura-Glide directly. Focus on where Allegion/Stanley can't go: revolving, FGI healthcare, ecoLOGIC." },
      { topic: "Dura-Shield blast niche", risk: "Allegion/Stanley owns the GSA blast segment", mitigation: "Acknowledge the niche, then pivot to the rest of the project scope." },
    ],
    closingMove: "Ask: 'Is your facility already running Schlage access control? If so, let's talk about how OSDP v2 integration works with ASSA ABLOY doors — you don't have to bundle to get a great opening system.'",
    talkTrack: "Allegion's acquisition of Stanley in 2022 for $900M changed how you need to think about this competitor. They're positioning a Seamless Access bundle — Schlage locks, LCN closers, Von Duprin exit devices, and Stanley auto doors in one proposal. That's smart packaging, and for a Schlage-heavy institutional account it has real appeal. Where we win: ASSA ABLOY Group offers the same single-vendor breadth with an open OSDP v2 standard — meaning you're not locked into the Schlage ecosystem to get a bundled opening solution. More importantly, Allegion/Stanley has no revolving doors, no AI energy management platform, and no HVHZ revolving lineup. For a facility with hotel lobbies, airport connections, or FGI 2022 healthcare requirements, the Allegion bundle has visible gaps that our complete opening platform fills.",
    winSignals: [
      "Project includes revolving doors, hermetic healthcare doors, or smart building specification",
      "Owner is running a non-Schlage access control platform and doesn't want to switch",
      "FGI 2022 or ASHRAE 90.1 envelope energy compliance is in the project specification",
    ],
    loseSignals: [
      "Owner is deeply invested in Schlage access control and views Allegion bundle as a simplification",
      "Pure retail sliding door project with no special compliance or application requirements",
      "Project is entirely standard Dura-Glide spec and GC has existing Allegion/Stanley relationship",
    ],
    keyMetrics: [
      "Revolving door revenue opportunity: % of hospitality, airport, and corporate lobby projects that include revolving",
      "Healthcare market share: ASSA ABLOY ~40% vs. Allegion/Stanley ~27%",
      "OSDP v2 interoperability: ASSA ABLOY integrates with 200+ access control systems vs. Allegion Schlage-native bundle",
    ],
  },

  // ── stanley × procurement ─────────────────────────────────────────────────
  {
    competitor: "stanley",
    context: "procurement",
    headline: "Installed base inertia isn't best value — run the full TCO and portfolio comparison.",
    winThemes: [
      {
        title: "Like-for-like ANSI compliance on all standards",
        detail: "Both products meet A156.10. If a Stanley spec limits competition, push for performance-based language referencing ANSI/BHMA standards. Open competition almost always delivers better pricing for the owner.",
        proof: "ANSI/BHMA A156.10-2024 — performance-based standard, not manufacturer-specific",
      },
      {
        title: "Total cost of ownership over asset life",
        detail: "Service contract structure, parts availability, and annual inspection costs vary. A TCO model over 10–15 years frequently changes the buy decision from who's cheapest on day one.",
      },
      {
        title: "Revolving door gap — Stanley requires a second supplier",
        detail: "For any project with revolving doors, Stanley requires a separate supplier. That's two service contracts, two parts inventories, and two service networks. ASSA ABLOY covers sliding, swing, folding, and revolving from one relationship.",
      },
      {
        title: "FL HVHZ — verify specific Dura-Storm NOA scope",
        detail: "Dura-Storm has hurricane ratings but NOA certification is product-specific and size-specific. Verify the exact product variant and opening size in the bid carries a valid NOA covering Miami-Dade/Broward HVHZ.",
      },
    ],
    differentiators: [
      { dimension: "ANSI/BHMA Compliance", ours: "A156.10-2024 compliant", theirs: "A156.10 compliant — verify edition year", advantage: "neutral" },
      { dimension: "FL NOA (exterior)", ours: "Available for HVHZ exterior products", theirs: "Dura-Storm has hurricane ratings — verify NOA scope for exact configuration", advantage: "moderate" },
      { dimension: "Revolving Door Coverage", ours: "RD3–RD700 full range", theirs: "Not offered — requires second supplier", advantage: "strong" },
      { dimension: "Multi-site Parts Standardization", ours: "US-stocked, standard SKUs", theirs: "Strong — large US installed base = parts availability", advantage: "watch" },
      { dimension: "Proprietary Spec Risk", ours: "Encourage performance-based specs", theirs: "Dura-Glide is often basis-of-design — creates lock-in", advantage: "moderate" },
      { dimension: "Smart Building Integration", ours: "ecoLOGIC AI platform for energy management", theirs: "No equivalent IoT/smart building product", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "The spec was written around Dura-Glide.",
        response: "If it's a proprietary spec, it's worth asking the EOR whether it can be opened to or-equal based on ANSI/BHMA A156.10 performance. Open competition almost always produces better pricing for the owner.",
      },
      {
        objection: "Stanley's parts are everywhere — easy to source.",
        response: "True for Dura-Glide specifically. For their swing line or specialty products, parts availability may be more limited. And for revolving doors, there is no Stanley product — you'd be sourcing from a second vendor.",
      },
      {
        objection: "We have a national master service agreement with Stanley.",
        response: "MSAs are valuable procurement tools. I'd check whether the agreement covers all door types in your portfolio, or whether specialty products — revolving, healthcare hermetic, blast-resistant — are excluded. Those excluded categories are where the service model fragments.",
      },
      {
        objection: "SB&D's volume means Stanley can offer us better pricing.",
        response: "SB&D's procurement leverage is real for standard commercial products. We compete on total value: revolving door coverage, FGI healthcare compliance, and ecoLOGIC smart building capability are categories where Stanley's scale advantage doesn't apply because they don't have the products.",
      },
      {
        objection: "We need the lowest unit price on this bid.",
        response: "On a pure unit price bid for standard sliding doors, Stanley is competitive. The question is whether this is truly a pure unit price bid, or whether there are revolving doors, healthcare openings, or smart building requirements that require separate supplier negotiations.",
      },
      {
        objection: "The bid requires hurricane-rated sliding — Dura-Storm is specified.",
        response: "Dura-Storm is a solid product. Verify the specific NOA number covers the opening size and configuration in this project. For a complete bid comparison, also ask: what is the total door mix — is it all hurricane sliding, or is there a mix of standard, swing, and revolving that Stanley can't fully serve?",
      },
      {
        objection: "Stanley offers extended warranty on their products.",
        response: "Warranty terms are important. Compare warranty scope: parts coverage period, labor, response time, and whether AAADM-certified inspection is required. I can pull our warranty documentation side-by-side.",
      },
      {
        objection: "We've never had an issue with a Stanley product.",
        response: "A reliable track record is genuinely valuable. The question isn't whether Dura-Glide is reliable — it is. The question is whether your current portfolio requirements are entirely within the Dura-Glide lineup, or whether the needs have expanded to include product types Stanley doesn't offer.",
      },
    ],
    landmines: [
      { topic: "Basis-of-design spec locked to Dura-Glide", risk: "Hard to displace on price or compliance alone", mitigation: "Compete via or-equal substitution — document compliance point-for-point with A156.10. Use revolving door gap as the portfolio argument." },
      { topic: "SB&D national account leverage", risk: "Large corporate owners may have SB&D enterprise agreements", mitigation: "Focus on categories outside the agreement scope: revolving, healthcare, smart building." },
    ],
    closingMove: "Offer a substitution compliance matrix and a total portfolio comparison showing revolving door coverage gap.",
    talkTrack: "If the spec was written around Dura-Glide, the procurement question is whether that's the right basis-of-design for the owner's needs, or whether it was the path of least resistance for the designer. Both products are A156.10 compliant. The substantive differentiation is: revolving door coverage (Stanley doesn't have any), FGI 2022 healthcare compliance documentation, and ecoLOGIC smart building capability. For a multi-type project, Stanley requires a second supplier for revolving doors — that's a real procurement complication our single-vendor relationship avoids.",
    winSignals: [
      "Project includes revolving doors, healthcare, or smart building scope that Stanley can't cover",
      "Owner is open to or-equal consideration on a performance-based A156.10 spec",
      "GC has had supply chain or specification issues with previous Stanley projects",
    ],
    loseSignals: [
      "Project is purely standard sliding doors with SB&D national account discount applied",
      "Spec is proprietary to Dura-Glide with no substitution clause",
      "Owner's facilities team has standardized on Dura-Glide system-wide and sees no reason to change",
    ],
    keyMetrics: [
      "TCO delta over 10 years: unit price + annual service + AAADM inspection + parts",
      "Revolving door revenue: % of total project value in revolving door scope",
      "NOA count: products in Miami-Dade Product Control database — ASSA ABLOY vs. Stanley",
    ],
  },

  // ── stanley × engineering ─────────────────────────────────────────────────
  {
    competitor: "stanley",
    context: "engineering",
    headline: "Same base standard, different depth — ask for 2024-edition test data and revolving coverage.",
    winThemes: [
      {
        title: "A156.10-2024 vs. earlier editions",
        detail: "Stanley's ANSI self-certification documentation is publicly available. Verify it references the 2024 edition. The 2024 update includes revised dynamic force limits (≤30 lbf at last 10° vs. ≤40 lbf in 2011) and updated sensor monitoring language.",
        proof: "Stanley self-certification available at stanleyaccess.com — check edition year",
      },
      {
        title: "Revolving door spec coverage — Stanley has none",
        detail: "If the specification includes any revolving doors (A156.27), Stanley cannot respond. RD3–RD700 covers the full revolving spectrum from 2.0 m compact to 6.0 m high-capacity airport. This is an absolute exclusion from Stanley's scope.",
        proof: "A156.27 — ANSI/BHMA standard for revolving doors; no Stanley product listed",
      },
      {
        title: "FGI 2022 healthcare submittal package",
        detail: "VersaMax 2.0 has an engineered submittal package for FGI 2022 healthcare sliding door requirements: pressure differential documentation, antimicrobial certification, quiet operation specification, and infection-control mode description.",
        proof: "FGI Guidelines for Design and Construction of Hospitals 2022 §2.1-3",
      },
    ],
    differentiators: [
      { dimension: "A156.10 Edition Year (test data)", ours: "2024 edition compliance documented", theirs: "Self-cert available — verify edition year in submittal", advantage: "moderate" },
      { dimension: "Revolving Doors (A156.27)", ours: "Full range — RD3 to RD700", theirs: "No revolving door product — cannot bid revolving spec", advantage: "strong" },
      { dimension: "Sensor Monitoring (§8.3)", ours: "Full compliance documentation", theirs: "Verify sensor architecture meets §8.3 monitoring cycle requirement", advantage: "moderate" },
      { dimension: "NOA Scope (HVHZ exterior)", ours: "Product-specific NOA available", theirs: "Dura-Storm has hurricane ratings — verify NOA number and scope for exact configuration", advantage: "neutral" },
      { dimension: "FGI 2022 Healthcare Submittal", ours: "VersaMax 2.0 — purpose-built submittal package", theirs: "ProCare 8300 series — present but without FGI-specific engineered submittal", advantage: "strong" },
      { dimension: "Hermetic / Clean Room", ours: "SL500 Clean Room — IP54, HEPA gaskets", theirs: "Healthcare sliding present; hermetic option verify by model", advantage: "moderate" },
    ],
    objectionHandlers: [
      {
        objection: "Stanley publishes their ANSI self-certification — it's all compliant.",
        response: "Self-certification is the right starting point. The specific questions for the submittal package are edition year, sensor monitoring architecture per §8.3, and for FL exterior applications, the NOA number and scope for the exact opening. I can provide all three for our products right now.",
      },
      {
        objection: "The spec doesn't include revolving doors — Stanley covers everything.",
        response: "If the project scope is entirely sliding and swing without revolving, Stanley is a legitimate competitor. My question would be: does the building program have any potential future revolving door additions in Phase 2 or future renovation? Specifying a single-vendor relationship that can't serve future revolving requirements may create a procurement problem down the road.",
      },
      {
        objection: "ProCare 8300 meets healthcare compliance.",
        response: "ProCare 8300 is a solid healthcare sliding door. The question for FGI 2022 compliance is whether the submittal documentation includes pressure differential sensing specs, antimicrobial surface certification, and the infection-control delayed re-open mode. VersaMax 2.0 has an engineered FGI 2022 submittal package for each of those items.",
      },
      {
        objection: "Dura-Storm is rated for hurricanes — that's what the FL spec requires.",
        response: "Dura-Storm has Impact Level D/E hurricane ratings and is NOA-eligible. I'd verify the NOA number in the Miami-Dade Product Control database for the exact product model, size, and glass configuration specified. Size-specific NOA verification is required for the submittal.",
      },
      {
        objection: "GreenStar meets our LEED air infiltration requirement.",
        response: "GreenStar's ASTM E283 data at 0.18 cfm/ft² is a solid LEED contribution. Our ecoLOGIC AI energy management provides additional ASHRAE 90.1 compliance contributions that the EOR may want to model for the overall envelope energy budget.",
      },
      {
        objection: "Stanley's Dura-Shield is the only product that meets our blast requirement.",
        response: "For GSA-TS01 blast requirements, Stanley Dura-Shield is the right product — they own that niche. For the rest of the project scope, we can provide an or-equal submittal for all standard sliding, swing, healthcare, and revolving applications.",
      },
      {
        objection: "The EOR has used Stanley on 15 previous projects — they're comfortable with the submittals.",
        response: "EOR familiarity is a real procurement advantage for Stanley. The most effective path is to offer to provide our submittal documentation in the same format as Stanley's — A156.10 compliance matrix, NOA documentation, FGI healthcare package — so the comparison is side-by-side without additional EOR effort.",
      },
      {
        objection: "Stanley's M-Force NEW with iQ Controller is the swing spec.",
        response: "M-Force NEW is a strong 700 lb swing product with iQ Controller diagnostics. Our SW300 covers the same capacity range in 85mm header depth with BLE diagnostics and full + low energy dual-mode. I can provide a side-by-side spec sheet comparison.",
      },
    ],
    landmines: [
      { topic: "Stanley's public compliance documentation", risk: "It exists — don't claim they're non-compliant without evidence", mitigation: "Compete on documentation depth, edition year, and FGI-specific submittal completeness — not compliance vs. non-compliance." },
      { topic: "Dura-Storm hurricane legitimacy", risk: "It is a real hurricane-rated product with ASTM E1886/E1996 testing", mitigation: "Compete on NOA size-specific verification and full portfolio coverage, not on questioning the hurricane rating itself." },
    ],
    closingMove: "Offer to prepare a side-by-side submittal package — A156.10-2024 compliance matrix, A156.27 revolving coverage, FGI 2022 VersaMax documentation, and NOA for FL exterior openings.",
    talkTrack: "Both products are A156.10 compliant at the headline level. For the submittal package, the EOR will want: which edition year is the test data from, does the sensor monitoring meet the 2017+ per-cycle fault detection requirement, and for exterior Florida applications, does the NOA cover the specific product variant and opening size. Additionally, if the project has any revolving door requirements — today or in future phases — Stanley cannot respond to A156.27 specifications. I can provide A156.10-2024, FGI 2022 healthcare, and A156.27 revolving coverage in a single submittal package today.",
    winSignals: [
      "Project specification includes A156.27 revolving doors in any part of the scope",
      "Healthcare project with FGI 2022 reference in the specification language",
      "EOR asks for 2024 edition-specific A156.10 test data in the submittal requirements",
    ],
    loseSignals: [
      "Stanley's Dura-Shield is the primary product specified (blast application)",
      "Spec is 100% sliding doors with no revolving, healthcare, or smart building requirements",
      "EOR has developed a proprietary Stanley-based specification template for this building type",
    ],
    keyMetrics: [
      "A156.10 edition year in competitor submittal vs. 2024 current edition",
      "A156.27 product coverage: ASSA ABLOY 5 revolving SKUs vs. Stanley 0",
      "FGI 2022 compliance item count: VersaMax 2.0 submittal vs. ProCare 8300 submittal",
    ],
  },

  // ── stanley × pm_interview ────────────────────────────────────────────────
  {
    competitor: "stanley",
    context: "pm_interview",
    headline: "Stanley is a case study in installed base moats, product maturity, and acquisition integration risk.",
    winThemes: [
      {
        title: "Installed base as competitive moat — and risk",
        detail: "Dura-Glide's ubiquity in US retail is a textbook installed-base moat. Switching costs are high, parts are standardized, and technicians are familiar. The PM insight: this also creates inertia that can slow product innovation if not managed deliberately. SB&D's conglomerate incentives may not align with agile product development.",
        proof: "Classic razor-and-blade lock-in: door hardware + service contract",
      },
      {
        title: "Acquisition integration and innovation pace",
        detail: "Stanley Black & Decker acquired the automatic door division as part of a broader security platform. The PM question: does being inside a $14B conglomerate accelerate or constrain product innovation for a specialized entrance systems business? The perception (and arguably the evidence from product launch cadence) suggests constraint.",
      },
      {
        title: "Product portfolio gaps as strategic opportunity",
        detail: "Stanley has no revolving door product line, no AI energy management platform (ecoLOGIC equivalent), and no FGI-engineered healthcare platform. Each gap is an acquisition or R&D opportunity for them — and a market expansion opportunity for ASSA ABLOY ENS to deepen before Stanley fills the gaps.",
      },
    ],
    differentiators: [
      { dimension: "Innovation Velocity", ours: "Active R&D: ecoLOGIC 2025, SW300-S BAU 2025, VersaMax 2.0", theirs: "Perception of slower post-acquisition innovation; M-Force NEW is notable exception", advantage: "moderate" },
      { dimension: "Platform Integration Story", ours: "Door + operator + access control + ecoLOGIC ecosystem", theirs: "Primarily door hardware — Stanley Security is separate SB&D unit", advantage: "strong" },
      { dimension: "Vertical Specialization", ours: "Healthcare, hospitality, high-security, revolving", theirs: "Retail/commercial depth — narrower vertical coverage", advantage: "strong" },
      { dimension: "Portfolio Gap (Revolving)", ours: "Full revolving range", theirs: "Zero revolving door products — TAM ceiling", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "How do you compete against a product that's the default spec?",
        response: "Default specs are won on familiarity and loss aversion. You displace them by going earlier in the decision process: build relationships with EORs, make compliance documentation easy, and identify projects where the default doesn't fully meet the requirement. Revolving doors, FL HVHZ, FGI healthcare, and smart building are segments where Dura-Glide isn't the automatic answer.",
      },
      {
        objection: "Stanley has a bigger US service network.",
        response: "It's comparable in size, but vertical specialization differs. The honest PM framing: for retail sliding doors, their network is excellent and comparable. For healthcare, revolving doors, or smart building integration, the expertise depth differs significantly. Compete where specialization is the deciding factor.",
      },
      {
        objection: "What's the risk if Stanley introduces a revolving door product?",
        response: "That risk is real — the gap is knowable and any capable engineering team could address it. The strategic response is to deepen the moat while the gap exists: build specifier relationships for revolving door projects, develop co-specification packages that bundle revolving + sliding, and make switching from ASSA ABLOY revolving + entrance systems as friction-filled as possible before Stanley can enter.",
      },
      {
        objection: "What would you prioritize if you were Stanley's PM?",
        response: "Two things immediately: (1) a revolving door product — the TAM gap is obvious and addressable, and (2) an AI energy management platform — ecoLOGIC is in the market and ASHRAE 90.1 pressure is growing. Those two gaps are the most visible to specifiers and owners today.",
      },
    ],
    landmines: [
      { topic: "Dismissing the Dura-Glide's genuine quality", risk: "It's a good product with a real track record — claiming otherwise loses credibility", mitigation: "Acknowledge it directly. Then pivot to where requirements are evolving beyond Dura-Glide's core design." },
      { topic: "Claiming Stanley will never innovate", risk: "M-Force NEW with iQ Controller is a legitimate recent innovation", mitigation: "Give credit for M-Force NEW. Use it as an example of how Stanley can innovate when motivated — and pivot to where they're not yet motivated (revolving, AI, healthcare FGI)." },
    ],
    closingMove: "Frame it as a positioning question: 'Stanley owns the retail sliding door default. The strategic question is which segments should ASSA ABLOY ENS own the default in — and what investment does it take to get there before Stanley fills their gaps?'",
    talkTrack: "Stanley is one of the most interesting competitive cases in this market. Dura-Glide is the US retail sliding door default — an installed-base moat that took decades to build. From a PM perspective, the lesson is that being the reference product in a high-volume segment is enormously valuable, but it can also create complacency. The portfolio gaps are knowable: no revolving doors, no AI energy management platform, no FGI-engineered healthcare product. Each gap is a market Stanley could enter — and a moat ASSA ABLOY ENS should deepen now. The question I'd bring to a strategy session: what's our equivalent 'default' position in healthcare, hospitality, or revolving door specifications, and what investment gets us there before Stanley fills the gaps?",
    winSignals: [
      "Interviewer explores product portfolio gap analysis — you can name Stanley's three largest gaps",
      "Discussion about build-vs-buy for market expansion — revolving doors is the textbook ASSA ABLOY moat",
      "Question about acquisition integration risk — SB&D's conglomerate incentives vs. focused product organization",
    ],
    loseSignals: [
      "You claim Stanley has no innovation — interviewer knows about M-Force NEW",
      "You can't explain why Dura-Glide 2000 has maintained market leadership for decades",
      "You recommend attacking Stanley's retail stronghold directly rather than expanding vertically",
    ],
    keyMetrics: [
      "US retail/commercial sliding door market share: Stanley ~30% vs. ASSA ABLOY ~35%",
      "Revenue contribution from revolving doors: Stanley $0 vs. ASSA ABLOY meaningful segment",
      "Product launch cadence: new SKUs per year — proxy for innovation velocity comparison",
    ],
  },

  // ── stanley × distributor ─────────────────────────────────────────────────
  {
    competitor: "stanley",
    context: "distributor",
    headline: "Vertical specialization and revolving door coverage mean higher-margin projects.",
    winThemes: [
      {
        title: "Revolving doors — a bid category Stanley can't touch",
        detail: "Any project requiring revolving doors (hospitality, airport, corporate lobby) is exclusively available to ASSA ABLOY distributors. Stanley has no revolving product. That's a bid category your Stanley competitor cannot close.",
      },
      {
        title: "Healthcare and FGI specs carry premium margin",
        detail: "Healthcare sliding door projects with FGI 2022 compliance requirements carry 30–50% higher contract values than equivalent retail projects — and they're less price-sensitive. VersaMax 2.0 gives your team a differentiated product to specify.",
      },
      {
        title: "ecoLOGIC creates a new upsell conversation",
        detail: "ecoLOGIC AI energy management opens a new product category conversation with building owners. It's not a door replacement — it's an upgrade to existing or new installations. That creates upsell revenue with your existing account base.",
      },
      {
        title: "AAADM training builds a recurring revenue engine",
        detail: "Annual AAADM inspection is a billable service under A156.10. Our structured certification support means your technicians can bill inspection revenue every year on every door in your install base.",
      },
    ],
    differentiators: [
      { dimension: "Revolving Door Exclusivity", ours: "Full revolving range — distributors can bid categories Stanley can't", theirs: "No revolving product — closed to this bid category", advantage: "strong" },
      { dimension: "Healthcare Premium Margin", ours: "VersaMax 2.0 opens FGI-compliant healthcare projects", theirs: "ProCare line present but less FGI-differentiated", advantage: "moderate" },
      { dimension: "ecoLOGIC Upsell Revenue", ours: "New product category upgrade for existing accounts", theirs: "No IoT upsell product", advantage: "strong" },
      { dimension: "AAADM Training Support", ours: "Structured certification pathway — inspection revenue", theirs: "Less developed US training program", advantage: "strong" },
      { dimension: "Brand Pull (Retail GCs)", ours: "Competitive", theirs: "Dura-Glide is the reference — strong pull in retail", advantage: "watch" },
    ],
    objectionHandlers: [
      {
        objection: "Dura-Glide sells itself — my customers ask for it by name.",
        response: "It does in retail — that's real. What percentage of your pipeline is pure retail, and what margin are you making? Healthcare, hospitality revolving, and smart building bids are larger, less price-sensitive, and more defensible. Is that a segment you want to grow into?",
      },
      {
        objection: "Stanley's service network is better in my market.",
        response: "Stanley has strong retail service density. Where does that network have gaps — healthcare facilities, revolving door maintenance, or smart building integration? Those specializations are where our support structure adds differentiated value.",
      },
      {
        objection: "SB&D gives Stanley distributors better credit terms.",
        response: "Credit terms are real. Model lifetime gross profit per door: unit margin + 10 annual inspections + parts + ecoLOGIC upgrade. Revolving door bids are high-value projects unavailable to your Stanley competitor. Which matters more to your business — credit terms or exclusive bid access?",
      },
      {
        objection: "I can't take on another line — I'm already fully represented.",
        response: "I understand capacity constraints. The question is whether your current portfolio covers revolving doors and FGI healthcare. If not, you're sending projects to a competitor that should be in your pipeline. We're not asking you to replace Stanley — we're asking to fill the categories Stanley can't.",
      },
    ],
    landmines: [
      { topic: "Retail commodity margin projects", risk: "We may not win these — Dura-Glide has entrenched specification", mitigation: "Don't compete on commodity retail projects. Focus the distributor pitch on revolving, healthcare, and ecoLOGIC where the margin and win rate are better." },
      { topic: "SB&D procurement leverage", risk: "Large national accounts may have SB&D enterprise agreements", mitigation: "Focus on project types excluded from SB&D agreements: revolving, healthcare FGI, government, blast." },
    ],
    closingMove: "Ask: 'What percentage of your pipeline includes revolving doors or healthcare projects? Those are categories you can't close without us.'",
    talkTrack: "Dura-Glide will win retail sliding door bids — we won't argue that. The more interesting question for a distributor is where the margin lives. Healthcare, hospitality, and government projects carry higher contract values and lower price sensitivity. Revolving door projects are exclusively available to ASSA ABLOY distributors — Stanley simply doesn't have a product. ecoLOGIC creates a new upsell conversation with your existing account base. Add AAADM inspection revenue across your install base and the lifetime gross margin per door comparison changes dramatically in our favor.",
    winSignals: [
      "Distributor serves hospitality, airport, or corporate real estate clients requiring revolving doors",
      "Distributor has healthcare system accounts where FGI 2022 spec is being used",
      "Distributor wants to add ecoLOGIC as an upsell product in their smart building practice",
    ],
    loseSignals: [
      "Distributor is exclusively retail grocery/big box — Dura-Glide has entrenched specification in that channel",
      "Distributor has an exclusive Stanley arrangement that precludes other lines",
      "Market is predominantly QSR/drive-through where Horton S8000 and Stanley DT compete directly",
    ],
    keyMetrics: [
      "Revolving door bid opportunities per year in distributor's market (0 for Stanley, 100% ASSA ABLOY exclusive)",
      "Healthcare project average contract value vs. retail: 30–50% premium typical",
      "ecoLOGIC upsell attach rate: % of qualifying installations that can be upgraded",
    ],
  },

  // ── stanley × florida_hvhz ────────────────────────────────────────────────
  {
    competitor: "stanley",
    context: "florida_hvhz",
    headline: "Dura-Storm is real — but verify NOA scope and check whether it covers the full project.",
    winThemes: [
      {
        title: "Our FL HVHZ portfolio is broader than just hurricane sliding",
        detail: "Dura-Storm is Stanley's hurricane-rated product for sliding doors. It's a solid product. But for projects that also include swing operators, hermetic healthcare doors, or revolving entries — all of which require FL-compliant products — Stanley's HVHZ portfolio is thin beyond Dura-Storm.",
        proof: "FL market share: ASSA ABLOY ~60% vs. Stanley ~20% in HVHZ sliding segment",
      },
      {
        title: "NOA is size-specific and configuration-specific",
        detail: "A valid NOA for one Dura-Storm configuration doesn't extend to all configurations. Verify the NOA number in the Miami-Dade Product Control database covers the exact product model, glass specification, and opening size in the project bid.",
        proof: "Miami-Dade Product Control database — NOA scope verification",
      },
      {
        title: "ASSA ABLOY has 60% of FL HVHZ sliding — GC and AHJ familiarity matters",
        detail: "AHJ inspectors in Miami-Dade and Broward have extensive experience with ASSA ABLOY NOA documentation. Product familiarity reduces inspection friction and change-order risk on tight construction schedules.",
      },
    ],
    differentiators: [
      { dimension: "FL HVHZ Sliding (Hurricane)", ours: "Comprehensive NOA-certified portfolio", theirs: "Dura-Storm 2000/3000 — solid but verify NOA scope", advantage: "moderate" },
      { dimension: "FL HVHZ Swing Operators", ours: "SW200i, SW300 with FL compliance", theirs: "Limited hurricane-rated swing operator portfolio", advantage: "strong" },
      { dimension: "FL HVHZ Market Share", ours: "~60%", theirs: "~20%", advantage: "strong" },
      { dimension: "AHJ Familiarity with NOA", ours: "High — most common product in FL HVHZ", theirs: "Moderate — Dura-Storm is known but less dominant", advantage: "moderate" },
      { dimension: "Revolving Doors (FL)", ours: "RD series available — verify FL coastal application", theirs: "No revolving product at all", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "Dura-Storm is hurricane-rated at Impact Level D and E — that's what we need.",
        response: "Dura-Storm Impact Level D/E is a real rating — it's a solid product for hurricane sliding. Verify the specific NOA number covers your opening size and glass specification in the Miami-Dade Product Control database. Also check whether the project has swing operators or other door types that require separate FL compliance verification.",
      },
      {
        objection: "Stanley has done many FL projects with Dura-Storm.",
        response: "That track record is real. Our track record is deeper — approximately 60% of FL HVHZ sliding door projects use ASSA ABLOY products. AHJ inspectors in Miami-Dade and Broward have reviewed our NOA documentation more than any other manufacturer's. That familiarity reduces submittal friction.",
      },
      {
        objection: "Dura-Glide GreenStar meets our FL energy code requirement.",
        response: "GreenStar's ASTM E283 air infiltration rating contributes to FL energy code compliance. NOA is the separate hurricane impact requirement — they address different code sections. For HVHZ exterior doors, both are needed. Does the project require ASTM E283 in addition to the hurricane impact rating?",
      },
      {
        objection: "The GC says Dura-Storm is fine for this project.",
        response: "If the GC has used Dura-Storm on FL HVHZ projects before, that's a useful reference. I'd ask them to pull the specific NOA number for the product model and opening size on this project and verify it in the Miami-Dade Product Control database before the submittal is locked. That's a 10-minute check that avoids costly last-minute surprises.",
      },
      {
        objection: "We're specifying Dura-Storm for sliding and a different vendor for swing — that's fine.",
        response: "Multi-vendor is workable. The question is whether the 'different vendor for swing' is FL-certified for HVHZ exterior swing applications — that's a category where our portfolio is stronger than Stanley's. Consolidating to ASSA ABLOY for both saves the coordination overhead.",
      },
    ],
    landmines: [
      { topic: "Claiming Dura-Storm isn't a real hurricane product", risk: "It is — Impact Level D/E with ASTM E1886/E1996 testing is legitimate", mitigation: "Compete on NOA scope verification and portfolio breadth beyond hurricane sliding — not on questioning the hurricane rating." },
      { topic: "Dura-Glide GreenStar energy code", risk: "GreenStar ASTM E283 is a real energy compliance contribution", mitigation: "Acknowledge GreenStar for energy code. Separate the energy compliance conversation from the NOA/hurricane impact conversation — they're different code sections." },
    ],
    closingMove: "Pull the Miami-Dade Product Control database in the meeting. Show the NOA count and product scope for ASSA ABLOY vs. Stanley — the volume difference makes the argument.",
    talkTrack: "Dura-Storm is a real hurricane-rated product — Impact Level D and E, ASTM E1886/E1996 tested. That's not in question. What I'd want to verify before this bid is submitted is: does the specific Dura-Storm model number and opening size in this project have a valid NOA in the Miami-Dade Product Control database? NOA certification is size-specific. And if the project has swing operators, folding doors, or any other door types beyond standard sliding, Stanley's FL HVHZ portfolio gets thin quickly. ASSA ABLOY has approximately 60% of the FL HVHZ sliding market — not because we're the only game in town, but because we've invested most deeply in the certification infrastructure that makes FL projects close cleanly.",
    winSignals: [
      "Project scope includes swing operators or other door types beyond standard hurricane sliding",
      "EOR or GC asks for NOA verification documentation in the submittal package",
      "Project is in Miami-Dade or Broward County where AHJ familiarity with ASSA ABLOY NOAs is highest",
    ],
    loseSignals: [
      "Project is purely standard sliding with Dura-Storm already specified and GC comfortable with it",
      "Owner has a previous successful FL HVHZ project with Dura-Storm — no reason to change",
      "Project is outside HVHZ zone — NOA advantage doesn't apply",
    ],
    keyMetrics: [
      "FL HVHZ sliding market share: ASSA ABLOY ~60% vs. Stanley ~20%",
      "NOA count by manufacturer in Miami-Dade Product Control database — verify current numbers",
      "Door type mix in FL HVHZ projects: % requiring swing operators (Stanley weak) vs. sliding only",
    ],
  },

  // ── stanley × healthcare ───────────────────────────────────────────────────
  {
    competitor: "stanley",
    context: "healthcare",
    headline: "ProCare vs. VersaMax 2.0 — one is a healthcare-labeled product, one was engineered for FGI 2022.",
    winThemes: [
      {
        title: "FGI 2022 engineered submittal package — VersaMax 2.0",
        detail: "VersaMax 2.0 has a purpose-built submittal package for FGI Guidelines for Design and Construction of Hospitals 2022: pressure differential sensing, antimicrobial surface certification (99.9%), infection-control delayed re-open mode, and quiet operation < 55 dB. Stanley's ProCare 8300 series covers healthcare use cases but lacks an FGI-engineered submittal.",
        proof: "FGI Guidelines 2022 §2.1-3 hospital sliding door requirements",
      },
      {
        title: "Revolving doors for hospital main entry — Stanley has none",
        detail: "Hospital main entries frequently specify revolving doors for energy management and vestibule elimination. Stanley cannot bid this portion of the project. ASSA ABLOY RD series covers compact to high-capacity hospital entries.",
      },
      {
        title: "US healthcare market share: ASSA ABLOY 40% vs. Stanley 28%",
        detail: "ASSA ABLOY's lead in US healthcare reflects deeper FGI compliance pedigree, broader product range for hospital applications, and deeper AAADM inspection network in healthcare facilities.",
      },
    ],
    differentiators: [
      { dimension: "FGI 2022 Engineered Platform", ours: "VersaMax 2.0 — purpose-built for FGI 2022", theirs: "ProCare 8300 series — healthcare-positioned but not FGI-engineered", advantage: "strong" },
      { dimension: "Infection Control Mode", ours: "Standard on VersaMax 2.0", theirs: "Not a specifically marketed feature on ProCare", advantage: "strong" },
      { dimension: "Hospital Entry Revolving", ours: "RD3/RD600 hospital-entry revolving available", theirs: "No revolving product — second vendor required", advantage: "strong" },
      { dimension: "Hermetic/Clean Room Sliding", ours: "SL500 Clean Room — IP54, HEPA gaskets", theirs: "Specialty hermetic option — verify availability by model", advantage: "moderate" },
      { dimension: "Healthcare Market Share (US)", ours: "~40%", theirs: "~28%", advantage: "moderate" },
      { dimension: "AAADM Network for Healthcare", ours: "Deep national coverage", theirs: "Strong retail coverage; healthcare-specific density varies by market", advantage: "moderate" },
    ],
    objectionHandlers: [
      {
        objection: "ProCare 8300 is specifically designed for healthcare.",
        response: "ProCare 8300 is a legitimate healthcare product. The distinction is FGI 2022 submittal documentation. If the specification references FGI Guidelines — which is standard practice in hospital new construction since 2022 — VersaMax 2.0 has an engineered package for each of those requirements. ProCare 8300 doesn't have an equivalent published FGI submittal.",
      },
      {
        objection: "The hospital system has a SB&D enterprise agreement that includes Stanley doors.",
        response: "Enterprise agreements often cover standard products. Check whether the agreement explicitly covers VersaMax-equivalent healthcare sliding with FGI 2022 compliance documentation, and whether it covers revolving doors for hospital main entries. Those may be outside the agreement scope.",
      },
      {
        objection: "Stanley's service network is strong — they can support our hospital.",
        response: "Stanley has strong service coverage in retail markets. For healthcare-specific service — AAADM-certified technicians with hospital access protocols and FGI-compliant service documentation — I'd verify coverage density specifically in the hospital's location. Healthcare facilities have different service access requirements than retail.",
      },
      {
        objection: "Dura-Care 7500A covers our long-term care requirement.",
        response: "Dura-Care 7500A is a solid long-term care product with delayed close and wandering prevention. Our VersaMax 2.0 with infection-control mode serves acute care. For a healthcare system with both acute and long-term care, we can cover the full spectrum with one service relationship.",
      },
    ],
    landmines: [
      { topic: "ProCare line dismissal", risk: "ProCare 8300 is a real and functional healthcare product", mitigation: "Compete on FGI 2022 submittal documentation depth, not on claiming ProCare doesn't work." },
      { topic: "Dura-Care long-term care niche", risk: "Dura-Care 7500A has wandering prevention mode that VersaMax doesn't explicitly market", mitigation: "Verify VersaMax configuration options for LTC. If there's a gap, acknowledge it and keep the conversation on the acute care scope." },
    ],
    closingMove: "Provide the FGI 2022 compliance matrix for VersaMax 2.0 to the healthcare architect before the design development phase.",
    talkTrack: "In hospital new construction and renovation, the specification driver since 2022 is the FGI Guidelines. VersaMax 2.0 was engineered to those guidelines — pressure differential, infection control, antimicrobial, quiet operation. ProCare 8300 is a healthcare-positioned product, but it doesn't have a published FGI 2022 submittal package. For the healthcare architect, that means more RFI work during the submittal review phase. For the ICO, it means more validation work before sign-off. Additionally, hospital main entries frequently include revolving doors — a category Stanley cannot serve at all. ASSA ABLOY covers the full hospital entrance scope from one supplier.",
    winSignals: [
      "Project references FGI 2022 in the specification scope",
      "Hospital is building a new wing or major renovation with fresh specification",
      "Architect asks for pressure differential documentation or infection-control mode specs",
    ],
    loseSignals: [
      "Hospital system has SB&D enterprise agreement explicitly covering door hardware",
      "Spec is standard A156.10 with no FGI reference — ProCare is adequate",
      "Project is entirely long-term care/assisted living — Dura-Care 7500A may be well-positioned",
    ],
    keyMetrics: [
      "US healthcare automatic door market share: ASSA ABLOY ~40% vs. Stanley ~28%",
      "FGI 2022 compliance item checklist: VersaMax vs. ProCare documented feature set",
      "Hospital revolving door prevalence: % of new hospital main entries specifying revolving",
    ],
  },

  // ── stanley × iot_smart_building ──────────────────────────────────────────
  {
    competitor: "stanley",
    context: "iot_smart_building",
    headline: "Stanley has GreenStar air infiltration data. We have ecoLOGIC AI. Those aren't the same conversation.",
    winThemes: [
      {
        title: "ecoLOGIC AI vs. GreenStar — different technology levels",
        detail: "GreenStar's ASTM E283 certification reduces air infiltration through better sealing. ecoLOGIC uses AI to optimize door timing and reduce infiltration by learning traffic patterns. GreenStar is passive product design; ecoLOGIC is active system intelligence. For ASHRAE 90.1 envelope energy compliance, both contribute — but to different degrees.",
        proof: "ecoLOGIC: up to 80% energy savings vs. manual door; GreenStar: -61% air infiltration vs. standard sliding",
      },
      {
        title: "BAS API integration — Stanley has no announced equivalent",
        detail: "ecoLOGIC provides an open API for Building Automation System integration — data flows to Siemens Desigo, JCI Metasys, Honeywell EBI, and other major BAS platforms. This is a fundamentally different value proposition from a better-sealed door.",
      },
      {
        title: "SW300-S BLE configuration — installer productivity at scale",
        detail: "For facilities with dozens or hundreds of swing operators, BLE smartphone configuration and remote diagnostics reduce installation time and eliminate service truck rolls for parameter changes. Stanley's M-Force iQ Controller is hardware-diagnostic; SW300-S is network-connected.",
      },
    ],
    differentiators: [
      { dimension: "AI Energy Management", ours: "ecoLOGIC AI — active traffic learning, BAS API", theirs: "No AI energy management platform", advantage: "strong" },
      { dimension: "Passive Energy Performance", ours: "Competitive thermal performance", theirs: "GreenStar ASTM E283 -61% air infiltration — genuine differentiator", advantage: "watch" },
      { dimension: "BAS Integration", ours: "ecoLOGIC open API for major BAS platforms", theirs: "No entrance-specific BAS API", advantage: "strong" },
      { dimension: "BLE Remote Diagnostics", ours: "SW300-S BLE configuration and diagnostics", theirs: "M-Force iQ Controller — hardware diagnostics, not network-connected", advantage: "moderate" },
      { dimension: "OSDP v2 Access Integration", ours: "Native OSDP v2 support", theirs: "Access control is separate Stanley Security division", advantage: "moderate" },
    ],
    objectionHandlers: [
      {
        objection: "GreenStar already meets our building's energy code requirement.",
        response: "GreenStar's ASTM E283 data is a real contribution to energy code compliance. ecoLOGIC operates at a different level — it's not a product specification, it's a building system. For facilities targeting LEED v4 or ASHRAE 90.1-2022, the BAS integration and dynamic energy management data are increasingly required, not just the door's passive performance.",
      },
      {
        objection: "We don't have budget for an AI platform this cycle.",
        response: "ecoLOGIC can be phased — start with data collection mode (no AI control, just monitoring) and upgrade to active optimization in year 2 when you can model the ROI from year 1 data. The monitoring mode has minimal incremental cost over the standard product.",
      },
      {
        objection: "Stanley's iQ Controller gives us the diagnostics we need.",
        response: "iQ Controller is good hardware diagnostics. The difference is connectivity: SW300-S sends diagnostic data to a cloud dashboard and can trigger service alerts before failure. iQ Controller requires a technician on-site to read the diagnostic. At scale across multiple facilities, that's a meaningful maintenance cost difference.",
      },
      {
        objection: "Our building's BAS is closed-protocol — ecoLOGIC can't integrate anyway.",
        response: "A closed-protocol BAS is a real constraint. For those systems, ecoLOGIC can operate standalone with its own dashboard, or we can work with your BAS vendor on a protocol bridge. What BAS platform is it?",
      },
    ],
    landmines: [
      { topic: "GreenStar ASTM E283 energy data", risk: "GreenStar's -61% air infiltration claim is a real measurable improvement and may satisfy the owner's energy spec", mitigation: "Acknowledge GreenStar as a passive energy improvement. Compete on dynamic/active energy management — ecoLOGIC is a different product category, not a better version of the same thing." },
    ],
    closingMove: "Run the energy ROI model — show annual HVAC savings from ecoLOGIC vs. passive GreenStar improvement for this specific facility's door volume and climate zone.",
    talkTrack: "GreenStar is a well-specified product for air infiltration — the ASTM E283 data is real. But when we talk about ecoLOGIC, we're in a fundamentally different product category. GreenStar is a better-sealed door. ecoLOGIC is an AI system that learns your traffic patterns, optimizes door timing to minimize HVAC conditioning loss, and sends data to your BAS via open API. For a 100-door facility in a hot-humid climate, the HVAC savings from ecoLOGIC typically deliver a 2–4 year payback. Stanley doesn't have an equivalent — not because they can't build one, but because they haven't yet. That window is open today.",
    winSignals: [
      "Owner is under ASHRAE 90.1-2022 compliance pressure for envelope energy performance",
      "Building has modern BAS with open API integration capability",
      "Facilities manager tracks energy performance metrics and wants data-driven door management",
    ],
    loseSignals: [
      "Owner has specified GreenStar by ASTM E283 performance requirement and considers that sufficient",
      "Building's energy code compliance is met without ecoLOGIC — no budget justification",
      "Owner's primary concern is blast resistance (Dura-Shield) — IoT is not a priority",
    ],
    keyMetrics: [
      "ecoLOGIC energy savings: up to 80% HVAC load reduction from door infiltration vs. manual operation",
      "GreenStar baseline: -61% air infiltration vs. standard sliding (passive improvement only)",
      "ROI payback period: 2–4 years in high-traffic exterior door applications for ecoLOGIC",
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // HORTON AUTOMATICS CARDS
  // ════════════════════════════════════════════════════════════════════════════

  // ── horton × customer_pitch ───────────────────────────────────────────────
  {
    competitor: "horton",
    context: "customer_pitch",
    headline: "Horton's install base is massive — and it's also their ceiling.",
    winThemes: [
      {
        title: "National presence vs. regional reach",
        detail: "Horton's service strength is in the Texas and Sun Belt markets. For multi-location owners or projects outside their core region, service consistency is a real question. ASSA ABLOY covers all 50 states with AAADM-certified technicians.",
      },
      {
        title: "Portfolio completeness — revolving, healthcare, smart building",
        detail: "Horton is primarily a sliding door company with limited swing and no revolving door product. For projects that include revolving entries, FGI healthcare sliding, or smart building integration, ASSA ABLOY covers all of those from one relationship.",
      },
      {
        title: "Innovation: ecoLOGIC AI vs. 2000 Series platform age",
        detail: "The Horton 2000 Series design dates back decades without a major platform refresh. ecoLOGIC AI represents where the industry is going — active energy management, BAS integration, and predictive service. That's a gap Horton has not announced plans to close.",
      },
      {
        title: "FL HVHZ certification — limited publicly available Horton data",
        detail: "For Florida HVHZ exterior doors, NOA certification is required. Horton has limited specific HVHZ certification data publicly available. Verify before any FL exterior bid.",
      },
    ],
    differentiators: [
      { dimension: "Geographic Coverage", ours: "Nationwide — all 50 states", theirs: "Sun Belt primary; thinner outside core region", advantage: "strong" },
      { dimension: "Portfolio Breadth", ours: "Sliding, swing, folding, revolving — full + low energy", theirs: "Primarily sliding; swing limited; no revolving", advantage: "strong" },
      { dimension: "FL HVHZ (NOA)", ours: "NOA-certified exterior products", theirs: "Limited publicly available HVHZ certification data", advantage: "strong" },
      { dimension: "AI/IoT Platform", ours: "ecoLOGIC AI (2025)", theirs: "No announced smart building platform", advantage: "strong" },
      { dimension: "Healthcare FGI", ours: "VersaMax 2.0 FGI 2022 engineered", theirs: "ICU/CCU series — healthcare-positioned but no FGI submittal platform", advantage: "strong" },
      { dimension: "Parent Company Scale", ours: "$14B+ ASSA ABLOY Group resources", theirs: "Overhead Door / Sanwa Holdings — smaller scale", advantage: "strong" },
      { dimension: "Price", ours: "Premium positioning", theirs: "Competitive — often 8–15% below ASSA ABLOY on standard sliding", advantage: "watch" },
    ],
    objectionHandlers: [
      {
        objection: "Horton's pricing is meaningfully lower.",
        response: "Horton is price-competitive on standard sliding in their core region. The question is: does this project have any FL exterior requirements, swing doors, revolving doors, or locations outside the Sun Belt? Any of those answers change the comparison quickly. And on a multi-site portfolio, AAADM inspection consistency and parts availability across regions are factors Horton can't match nationally.",
      },
      {
        objection: "We've been buying Horton 2000 Series for 30 years — why change?",
        response: "30 years of 2000 Series is a real track record — those doors work. The question is whether your next 10 years of requirements are the same as your last 30. If you're adding locations outside the Sun Belt, adding FGI healthcare requirements, or evaluating smart building integration, those are places where the 2000 Series relationship needs to expand.",
      },
      {
        objection: "Horton's service is excellent in our stores.",
        response: "In the Sun Belt, Horton has real service density and their grocery/retail techs are well-trained on the 2000 Series. The question is whether all of your locations are in their core region, and whether your requirements stay within the 2000 Series product scope. If either answer is no, you have a service gap.",
      },
      {
        objection: "Horton's ICU/CCU doors work fine in our hospital.",
        response: "ICU/CCU 2001/2003 are functional healthcare sliding doors. For new construction or major renovation specifying FGI 2022, VersaMax 2.0 has an engineered submittal package covering pressure differential, antimicrobial, and infection-control mode that the ICU/CCU series doesn't match.",
      },
      {
        objection: "Horton has been serving our drive-through locations for years.",
        response: "Horton S8000 is a solid drive-through window product — they have real QSR strength. For the drive-through windows, continuing with a proven product makes sense. For the main entry sliding doors, swing operators, or any healthcare locations in your portfolio, our product suite is deeper.",
      },
      {
        objection: "The 2000 Series parts are everywhere — easy to service.",
        response: "The 2000 Series parts availability is one of its genuine strengths — decades of installed base means parts are commoditized. Our SL500 parts are stocked nationally and available with comparable lead times. The question is whether parts availability outside the Sun Belt is consistent for Horton.",
      },
      {
        objection: "Horton's rep knows our facilities personally.",
        response: "Personal relationships matter — I respect that. The question is whether the relationship includes 24/7 national service coverage, AAADM-certified technicians in all your markets, and the technical depth for healthcare, revolving, or smart building requirements. Those are the moments that test supplier relationships.",
      },
      {
        objection: "Overhead Door / Sanwa is a solid parent company.",
        response: "Overhead Door has a good reputation in the garage and commercial door market. For dedicated investment in automatic entrance systems — specifically healthcare, revolving, and smart building platforms — ASSA ABLOY is the $14B parent focused specifically on access solutions. The R&D investment reflects that focus.",
      },
    ],
    landmines: [
      { topic: "2000 Series grocery/retail install base", risk: "This is genuinely entrenched — 30-year relationships with grocery chains are not won in one pitch", mitigation: "Don't attack the 2000 Series on its home turf. Focus on expansion into categories Horton can't serve: revolving, healthcare FGI, smart building, locations outside Sun Belt." },
      { topic: "Horton S8000 drive-through niche", risk: "Horton has a dedicated product and strong QSR relationships in drive-through", mitigation: "Don't fight the drive-through window application. Compete on the main entry, healthcare, and any locations outside Horton's core service region." },
    ],
    closingMove: "Map out all door types, locations, and regions in the project — the comparison changes significantly once you go beyond standard Sun Belt sliding.",
    talkTrack: "Horton makes a solid sliding door for the Sun Belt market and the 2000 Series has earned real loyalty in grocery and QSR. Where we differ is breadth and reach. If this project is purely standard sliding doors in Texas, the comparison is closer. If there are FL exterior openings requiring NOA certification, swing operators, folding or revolving entries, FGI healthcare requirements, or facilities outside the Sun Belt, ASSA ABLOY covers everything from one national supplier relationship. And with ecoLOGIC AI for smart building integration, we're building toward the next 10 years while the 2000 Series platform reflects the last 30.",
    winSignals: [
      "Multi-location owner with facilities outside Sun Belt (Northeast, Pacific Northwest)",
      "Project includes revolving doors, FGI healthcare spec, or smart building requirements",
      "FL exterior openings requiring NOA certification verification",
    ],
    loseSignals: [
      "Pure standard sliding doors in Texas or Sun Belt with long-standing Horton 2000 Series relationship",
      "QSR drive-through application where S8000 is the established product",
      "Owner has 30+ year Horton relationship and no expansion into categories Horton can't serve",
    ],
    keyMetrics: [
      "Horton's geographic service coverage density outside Sun Belt vs. ASSA ABLOY national coverage",
      "Product category coverage: ASSA ABLOY (sliding + swing + revolving + healthcare + IoT) vs. Horton (sliding + limited swing)",
      "FL HVHZ NOA count: ASSA ABLOY comprehensive portfolio vs. Horton limited publicly available data",
    ],
  },

  // ── horton × procurement ──────────────────────────────────────────────────
  {
    competitor: "horton",
    context: "procurement",
    headline: "Low unit price is real, but verify FL compliance and test total portfolio coverage.",
    winThemes: [
      {
        title: "FL NOA — verify before bid submission",
        detail: "Horton has limited specific HVHZ certification data publicly available. For exterior doors in Miami-Dade and Broward HVHZ, a valid NOA is legally required. Verify in the Miami-Dade Product Control database before accepting any Horton bid for FL exterior applications.",
        proof: "FBC §1709.5; Miami-Dade Product Control database — searchable by manufacturer",
      },
      {
        title: "Single-vendor bid vs. multi-vendor for revolving",
        detail: "Horton has no revolving door product. Any project requiring revolving entries requires a second supplier if Horton wins the sliding scope. That's additional procurement complexity, separate service contracts, and potential service coverage gaps.",
      },
      {
        title: "AAADM inspection compliance nationally",
        detail: "Annual AAADM inspection under A156.10 is a compliance obligation. Outside Horton's Sun Belt core, technician density for Horton-certified AAADM inspections may be thinner. Verify coverage in the specific project markets.",
      },
    ],
    differentiators: [
      { dimension: "FL NOA (exterior)", ours: "Certified — bid-ready for HVHZ", theirs: "Limited publicly available certification data — verify", advantage: "strong" },
      { dimension: "Revolving Door Coverage", ours: "Full revolving range in bid", theirs: "No revolving product — second vendor required", advantage: "strong" },
      { dimension: "National AAADM Network", ours: "All 50 states, AAADM-certified", theirs: "Core Sun Belt density; thinner nationally", advantage: "strong" },
      { dimension: "Unit Price", ours: "Premium — justify with TCO", theirs: "Often 8–15% below ASSA ABLOY on standard sliding", advantage: "watch" },
      { dimension: "Smart Building Integration", ours: "ecoLOGIC AI for BAS integration", theirs: "No IoT/smart building product", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "Horton's pricing is 15% lower — that's significant budget savings.",
        response: "15% is real savings on unit price. Deconstruct the total contract value: annual AAADM inspection cost for multi-state portfolio, emergency service coverage outside Sun Belt, parts lead time outside their core region, and if there are revolving doors — Horton requires a second vendor. What does the project scope look like beyond standard sliding?",
      },
      {
        objection: "We'll handle revolving doors separately — Horton wins the sliding scope.",
        response: "That's workable. The question is what it costs to manage two service relationships, two parts inventories, and two annual inspection contracts. For a large multi-type project, the procurement complexity often exceeds the unit price savings. I can model the total contract value comparison.",
      },
      {
        objection: "Horton has national service partnerships — they're not Sun Belt only.",
        response: "Horton does have national distribution partnerships. I'd ask for specific AAADM-certified technician coverage commitments in the non-Sun Belt markets on this project, in writing, before awarding. The difference between 'we have a partner there' and a committed 4-hour response SLA is significant for a compliance audit.",
      },
      {
        objection: "We've gotten good prices with Horton on multi-site bids before.",
        response: "Prior positive experience is valuable data. I'd look at whether those bids were entirely in the Sun Belt, entirely standard sliding, and whether any had FL HVHZ requirements. If so, those conditions may not match this project.",
      },
    ],
    landmines: [
      { topic: "Horton's price advantage", risk: "8–15% below on standard sliding is real", mitigation: "Compete on total bid scope: revolving gap, FL compliance, national service coverage. Don't fight on unit price for standard sliding." },
      { topic: "Horton national service partnerships", risk: "Horton does have some national distribution — don't claim they have no national coverage", mitigation: "Compete on AAADM-certified technician density and committed SLA in non-Sun Belt markets, not on presence vs. absence." },
    ],
    closingMove: "Request a total contract value comparison: unit price + revolving door separate vendor + annual AAADM inspection across all markets + emergency service SLA commitments.",
    talkTrack: "Horton's unit price advantage on standard sliding is real. Before the bid closes, I'd want to verify three things: does the specific product have a valid NOA for FL exterior applications in Miami-Dade Product Control, does the bid include revolving doors that Horton simply can't serve, and what is the committed AAADM service SLA in non-Sun Belt markets? Those three questions change the total contract value calculation significantly on most multi-site or multi-type projects.",
    winSignals: [
      "Project has revolving doors or FL exterior requirements outside Sun Belt",
      "Multi-site portfolio with locations across multiple US regions",
      "Owner has had previous service issues with non-national vendor coverage",
    ],
    loseSignals: [
      "Pure standard sliding project in Sun Belt — Horton's price advantage is hardest to overcome here",
      "Owner is price-driven with no interest in TCO modeling or compliance verification",
      "Project is entirely QSR/drive-through in Sun Belt markets",
    ],
    keyMetrics: [
      "Unit price delta (%): Horton vs. ASSA ABLOY on standard sliding configurations",
      "Total contract value: unit + second vendor revolving + AAADM inspections + service SLA",
      "AAADM-certified technician density: Horton vs. ASSA ABLOY in non-Sun Belt markets",
    ],
  },

  // ── horton × engineering ──────────────────────────────────────────────────
  {
    competitor: "horton",
    context: "engineering",
    headline: "2000 Series meets A156.10 — but verify HVHZ, revolving coverage, and FGI compliance.",
    winThemes: [
      {
        title: "Revolving doors — Horton has no A156.27 products",
        detail: "For any specification referencing A156.27 revolving doors, Horton cannot respond. This is an absolute product gap. ASSA ABLOY's RD series covers the full A156.27 range from compact 2.0 m to high-capacity 6.0 m.",
        proof: "A156.27 — ANSI/BHMA standard for revolving doors",
      },
      {
        title: "FL HVHZ — limited publicly available NOA data",
        detail: "For exterior door specifications in Miami-Dade and Broward HVHZ, the engineer of record needs verified NOA numbers for submittal. Horton's HVHZ certification data is limited in the public domain — verify in Miami-Dade Product Control before including in a HVHZ specification.",
      },
      {
        title: "FGI 2022 healthcare submittal — no Horton equivalent",
        detail: "Hospital projects referencing FGI Guidelines 2022 require engineering documentation for pressure differential, antimicrobial surfaces, and infection-control door modes. Horton's ICU/CCU series is positioned for healthcare but has no published FGI 2022 engineered submittal package.",
      },
    ],
    differentiators: [
      { dimension: "A156.10 Compliance", ours: "2024 edition documentation available", theirs: "A156.10 compliant — verify edition year and test documentation", advantage: "moderate" },
      { dimension: "A156.27 Revolving Doors", ours: "Full RD range — A156.27 compliant", theirs: "No revolving product — cannot respond to A156.27 spec", advantage: "strong" },
      { dimension: "FL HVHZ NOA", ours: "Comprehensive NOA-certified exterior portfolio", theirs: "Limited publicly available NOA data — verify before HVHZ spec", advantage: "strong" },
      { dimension: "FGI 2022 Healthcare Submittal", ours: "VersaMax 2.0 — engineered FGI 2022 package", theirs: "ICU/CCU series — no published FGI 2022 submittal", advantage: "strong" },
      { dimension: "Smart Building / IoT Spec", ours: "ecoLOGIC API for BAS integration specification", theirs: "No IoT specification capability", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "The 2000 Series has been on specs for 30 years — it meets the standard.",
        response: "The 2000 Series meets A156.10 — that's correct. For a standard commercial sliding specification with no HVHZ, FGI, or revolving requirements, it qualifies. The questions I'd ask for completeness: which edition year is the test data from, and does the project have any exterior FL openings or revolving door requirements in any phase of the work?",
      },
      {
        objection: "The spec is all A156.10 sliding — Horton qualifies.",
        response: "Correct for a pure sliding spec. Is the spec performance-based referencing A156.10, or does it name Horton by model? If the former, we can submit as or-equal. What I'd also explore with the EOR is whether any future phases or additional facilities in the program might require revolving doors or FGI healthcare specifications — getting two suppliers locked in now for different project types creates complications later.",
      },
      {
        objection: "Horton's ICU/CCU doors work for hospital applications.",
        response: "ICU/CCU 2001/2003 are functional for hospital sliding. For FGI 2022 compliance documentation — which is increasingly required in hospital new construction — verify that Horton has published the pressure differential sensing specs, antimicrobial certification, and infection-control mode documentation needed for the FGI submittal.",
      },
      {
        objection: "We don't need revolving doors on this project.",
        response: "If the project scope is confirmed as no revolving doors, now or in future phases, then the A156.27 gap doesn't affect this bid. For completeness, is the building program final, or could future phases include lobby entry upgrades?",
      },
    ],
    landmines: [
      { topic: "2000 Series baseline A156.10 compliance", risk: "It is compliant — don't claim otherwise", mitigation: "Compete on edition year documentation, HVHZ verification, and revolving/FGI coverage gaps — not on baseline A156.10 compliance." },
    ],
    closingMove: "Offer to verify Horton's HVHZ NOA status in the Miami-Dade Product Control database in the meeting — pull it up together.",
    talkTrack: "From an engineering spec perspective, the 2000 Series meets A156.10 for standard commercial sliding — that's well-established. The submittal questions I'd prepare for are: which edition year is the test documentation, for exterior FL applications in HVHZ does the specific product have a valid NOA in the Miami-Dade Product Control database, and if the project has any revolving door requirements now or in future phases, Horton simply cannot respond to that A156.27 specification. I can provide A156.10-2024 documentation, A156.27 revolving coverage, and FGI 2022 VersaMax submittal in one package.",
    winSignals: [
      "Project has revolving doors in any part of the specification scope",
      "FL HVHZ exterior openings requiring NOA verification in the submittal",
      "Hospital or healthcare project with FGI 2022 reference",
    ],
    loseSignals: [
      "Pure standard commercial sliding spec in Sun Belt with no HVHZ, revolving, or FGI requirements",
      "EOR has specified Horton by model number as basis-of-design for a standard application",
      "Project is entirely drive-through/QSR with no main entry or healthcare scope",
    ],
    keyMetrics: [
      "A156.10 edition year in competitor test documentation",
      "NOA count in Miami-Dade Product Control: ASSA ABLOY comprehensive vs. Horton limited",
      "A156.27 revolving coverage: ASSA ABLOY 5+ SKUs vs. Horton 0",
    ],
  },

  // ── horton × pm_interview ─────────────────────────────────────────────────
  {
    competitor: "horton",
    context: "pm_interview",
    headline: "Horton is a case study in install-base service moats and the ceiling of regional focus.",
    winThemes: [
      {
        title: "Install base as service moat — Horton's core advantage",
        detail: "The 2000 Series install base in US grocery and QSR is enormous — decades of service revenue from a product that's essentially self-renewing through parts and annual inspections. The PM insight: this is a powerful moat, but it's also a ceiling. The install base revenue keeps Horton viable but limits R&D investment in new product categories.",
        proof: "Service revenue moat: annual AAADM inspection × millions of 2000 Series doors = recurring revenue baseline",
      },
      {
        title: "Regional focus as strategy — and ceiling",
        detail: "Horton built a defensible position in the Texas/Sun Belt market through regional density. The PM question: is regional focus a deliberate strategy or an unintentional ceiling? If the national TAM requires moving beyond Sun Belt, Horton's service infrastructure needs a fundamentally different investment.",
      },
      {
        title: "Product portfolio stagnation risk",
        detail: "The 2000 Series platform dates back decades without a major platform refresh. No revolving product. No AI/IoT platform. No FGI-engineered healthcare product. Each gap is a TAM ceiling — markets where Horton structurally can't grow because the products don't exist.",
      },
    ],
    differentiators: [
      { dimension: "Install Base Moat", ours: "Broad install base + diverse portfolio", theirs: "Deep install base in narrow segments (grocery, QSR, Sun Belt)", advantage: "moderate" },
      { dimension: "Product Innovation", ours: "Active R&D: ecoLOGIC, VersaMax, SW300-S", theirs: "Limited publicly announced new platform development", advantage: "strong" },
      { dimension: "Geographic TAM", ours: "National — all verticals and regions", theirs: "Sun Belt primary — TAM ceiling by geography", advantage: "strong" },
      { dimension: "Portfolio TAM", ours: "Sliding + swing + revolving + healthcare + IoT", theirs: "Primarily sliding — portfolio TAM ceiling", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "How would you address a regional competitor with lower costs in their home market?",
        response: "Regional incumbents win on familiarity and local relationships. The counter is to compete where they're not strong — projects outside their region, product types outside their core lineup, or compliance requirements they can't meet (FL HVHZ, revolving, FGI healthcare). Don't fight them on their home turf with their playbook.",
      },
      {
        objection: "Horton's 2000 Series is what our maintenance team knows — switching is a training cost.",
        response: "That's a real switching cost and worth quantifying. The question is whether that training cost is justified given what you get: broader product options as you expand, access to revolving doors for high-traffic entries, FL HVHZ compliance for exterior bids, and a service network that covers every geography. Most maintenance teams adapt in one training cycle.",
      },
      {
        objection: "Horton service response is fast in our region.",
        response: "That's a genuine advantage of regional density. The risk is what happens when you expand beyond their core region. ASSA ABLOY's national coverage ensures that a project in Michigan or Oregon gets the same service quality as one in Texas.",
      },
      {
        objection: "How would you grow against an entrenched install base competitor?",
        response: "I'd target greenfield projects and new verticals they can't serve — healthcare, revolving doors, FL HVHZ exterior, IoT-connected buildings. Trying to displace their grocery install base is expensive. Building share in segments they can't enter is a higher-return strategy.",
      },
    ],
    landmines: [
      { topic: "Service moat in their core grocery/QSR accounts", risk: "Extremely hard to displace — switching costs are high and their service network there is real", mitigation: "Don't attack their grocery heartland. Compete on new projects, new verticals, and geographies outside Sun Belt." },
      { topic: "2000 Series installed base revenue", risk: "Service revenue is a real and durable moat", mitigation: "Acknowledge it, then frame: their moat is in the past, ours is in where the market is going." },
    ],
    closingMove: "Frame it: 'Horton's 2000 Series moat is real but it's a maintenance story, not a growth story. The PM question is which segments can ASSA ABLOY own by default — and none of them are grocery in Texas.'",
    talkTrack: "Horton is an interesting study in durable but bounded competitive moats. The 2000 Series installed base in US grocery is enormous and the service revenue from annual inspections is genuinely recurring. That's a strong business — but it's also a ceiling. The markets Horton can't enter — revolving doors, FGI-engineered healthcare products, FL HVHZ exterior, IoT-connected building systems — are all growing segments. As a PM, I'd be asking which of those segments ASSA ABLOY can own the default spec in, and how to build the infrastructure to defend it the way Horton has defended grocery in the Sun Belt.",
    winSignals: [
      "Project involves revolving entrance, FGI healthcare, or IoT/energy management requirement",
      "Project geography is outside Texas/Sun Belt where Horton service density thins",
      "Multi-vertical or multi-location owner wants one national supplier relationship",
    ],
    loseSignals: [
      "Pure standard grocery or QSR sliding door replacement in Texas/Oklahoma/Louisiana",
      "EOR or owner has specified Horton 2000 Series by model for a like-for-like swap",
      "Price-only procurement with no compliance, healthcare, or FL exterior requirement",
    ],
    keyMetrics: [
      "Horton product portfolio count: ~8 SKUs vs. ASSA ABLOY 40+",
      "Revolving door market coverage: ASSA ABLOY full, Horton zero",
      "Geographic service density outside Sun Belt: ASSA ABLOY national vs. Horton regional",
    ],
  },

  // ── horton × distributor ──────────────────────────────────────────────────
  {
    competitor: "horton",
    context: "distributor",
    headline: "The 2000 Series service moat is real — but the margin frontier is beyond it.",
    winThemes: [
      {
        title: "Higher-margin verticals Horton can't serve",
        detail: "Horton's sweet spot is standard commercial sliding in grocery and QSR. Healthcare hermetic doors, FGI-compliant swing operators, revolving entrances, and FL HVHZ exterior doors all carry higher margin and are outside Horton's product lineup. ASSA ABLOY lets you compete in all of them.",
      },
      {
        title: "National coverage for multi-location customers",
        detail: "When a grocery chain or retail brand expands outside the Sun Belt, Horton's service consistency drops. ASSA ABLOY's national service footprint lets you service the same customer from coast to coast — that's a stickier distributor relationship.",
      },
      {
        title: "Revolving and swing door upsell",
        detail: "Airport terminals, hotels, and corporate headquarters often want a revolving door at the primary entrance — a high-ticket item with strong margin. Horton has no revolving product. ASSA ABLOY's RD series gives you a product line they simply can't match.",
      },
    ],
    differentiators: [
      { dimension: "Revolving Door Products", ours: "Full RD series — multiple configurations", theirs: "None", advantage: "strong" },
      { dimension: "Healthcare/FGI Portfolio", ours: "VersaMax, hermetic sliding, SW300 for FGI", theirs: "Limited healthcare-specific products", advantage: "strong" },
      { dimension: "FL HVHZ Bids", ours: "NOA-certified products for exterior HVHZ bids", theirs: "Limited FL HVHZ certification", advantage: "strong" },
      { dimension: "National Service Consistency", ours: "Uniform national coverage", theirs: "Strong in Sun Belt; thinner nationally", advantage: "strong" },
      { dimension: "Unit Price (standard sliding)", ours: "Premium", theirs: "Competitive / economy pricing", advantage: "watch" },
    ],
    objectionHandlers: [
      {
        objection: "My customers love Horton's service in this region.",
        response: "Horton's regional service density is real. The question is what happens as your customers expand nationally and as their project mix evolves. Healthcare expansions, airport terminals, revolving entrances — these are all outside Horton's coverage.",
      },
      {
        objection: "Horton parts are everywhere — easy to stock.",
        response: "For 2000 Series parts, yes. But if a customer ever needs a swing operator, a revolving door, or an FGI healthcare product, you'd have to go to a second supplier anyway. ASSA ABLOY keeps that relationship singular.",
      },
      {
        objection: "The margin on Horton units is better.",
        response: "Unit margin on standard sliding may be. But add in the product lines you can't sell with Horton — revolving, healthcare, FL exterior — and compare total revenue per customer over 5 years. That's the real comparison.",
      },
    ],
    landmines: [
      { topic: "Horton's grocery install base service revenue", risk: "Distributors already earning service revenue on 2000 Series in their territory may resist switching", mitigation: "Don't ask them to replace Horton — ask them to add ASSA ABLOY for the verticals Horton can't serve." },
    ],
    closingMove: "Map their current project mix against product categories Horton can't cover. Show the revenue gap as a growth opportunity, not a replacement conversation.",
    talkTrack: "Horton's 2000 Series is a real franchise in grocery and QSR. I'm not suggesting you replace that relationship — I'm asking what's next. When your customers start building healthcare wings, installing revolving doors at their flagship locations, or bidding on FL HVHZ exterior projects, Horton can't help. ASSA ABLOY can. The cleanest way to grow your book isn't to fight Horton for the standard grocery sliding door — it's to be the partner for everything above that.",
    winSignals: [
      "Distributor serves customers expanding into healthcare, hospitality, or airport verticals",
      "Customer has projects in multiple regions or outside Sun Belt",
      "Customer is asking about revolving doors, FGI healthcare doors, or FL HVHZ compliance",
    ],
    loseSignals: [
      "Distributor's customer base is entirely standard commercial sliding in Sun Belt with no vertical expansion",
      "Distributor has a long-standing Horton exclusive agreement or co-branded program",
      "Project is a 2000 Series replacement with no scope for upgrade",
    ],
    keyMetrics: [
      "Revenue per customer lifetime: single-product vs. full portfolio relationship",
      "Product lines unavailable with Horton: revolving, FGI healthcare, FL HVHZ certified, IoT/smart building",
      "AAADM inspection revenue per door per year across expanded portfolio",
    ],
  },

  // ── horton × florida_hvhz ─────────────────────────────────────────────────
  {
    competitor: "horton",
    context: "florida_hvhz",
    headline: "Horton's FL HVHZ exposure is your easiest disqualifier in South Florida bids.",
    winThemes: [
      {
        title: "Minimal HVHZ-certified product portfolio",
        detail: "Horton does not have a broad Florida HVHZ certified product lineup. Miami-Dade and Broward exterior automatic door applications require a valid NOA — products without one cannot be legally installed. Verify Horton's NOA status for any FL HVHZ exterior bid.",
        proof: "FBC 8th Edition §1709.5 — NOA required for HVHZ exterior glazing/door assemblies",
      },
      {
        title: "No hurricane-rated sliding variants comparable to Dura-Storm or SL500 HVHZ",
        detail: "ASSA ABLOY SL500 and VersaMax have HVHZ-applicable certifications. Horton's 2000 Series was not designed for hurricane-impact compliance. Impact Level D/E ratings require TAS 201/202/203 test documentation that Horton does not publish for this series.",
      },
      {
        title: "Sun Belt presence ≠ Florida HVHZ compliance",
        detail: "Horton has regional service density in Texas, but Texas has no HVHZ equivalent. Their Sun Belt footprint does not translate to Florida HVHZ compliance capability. The certification and product engineering are distinct requirements.",
      },
    ],
    differentiators: [
      { dimension: "NOA-Certified Products", ours: "Yes — SL500, VersaMax, exterior swing lineup", theirs: "Very limited — verify before submitting any FL HVHZ bid", advantage: "strong" },
      { dimension: "TAS 201/202/203 Test Reports", ours: "Available on request for HVHZ exterior SKUs", theirs: "Not publicly available for standard product lines", advantage: "strong" },
      { dimension: "FL Service Network", ours: "Active Florida presence — Miami, Tampa, Orlando coverage", theirs: "Limited FL service infrastructure despite Sun Belt positioning", advantage: "strong" },
      { dimension: "Hurricane-Rated Sliding", ours: "SL500/VersaMax with HVHZ option", theirs: "No impact-rated sliding product equivalent", advantage: "strong" },
      { dimension: "Pricing in FL Market", ours: "Premium — justified by compliance and availability", theirs: "Low pricing but product compliance gap", advantage: "moderate" },
    ],
    objectionHandlers: [
      {
        objection: "Horton is cheaper and the GC wants to bid them.",
        response: "Cheaper doesn't matter if the AHJ rejects the submittal. Get the NOA number from the Horton rep and verify it in the Miami-Dade Product Control database for the exact product, size, and glazing configuration on this project. That conversation usually ends the Horton discussion quickly.",
      },
      {
        objection: "The architect said any A156.10 compliant product is acceptable.",
        response: "A156.10 compliance is necessary but not sufficient for HVHZ exterior. The Florida Building Code §1709.5 requires a valid NOA specifically for the HVHZ. The EOR needs to add that requirement to the spec, and once it's there, Horton can't meet it.",
      },
      {
        objection: "Horton has a presence in Texas — they're established in the Sun Belt.",
        response: "Texas has no HVHZ equivalent. Florida's hurricane zone certification is a separate regulatory regime. Sun Belt presence in Texas doesn't translate to Florida HVHZ product compliance.",
      },
      {
        objection: "We'll just install Horton inside the building where NOA doesn't apply.",
        response: "For interior-only applications, NOA isn't required — correct. But check the drawings: any opening in the building envelope that's exterior-facing triggers the HVHZ requirement regardless of whether it 'feels' interior. Confirm the opening's FBC classification with the EOR first.",
      },
    ],
    landmines: [
      { topic: "Project mix of interior and exterior openings", risk: "If all Horton doors are interior, NOA argument doesn't apply", mitigation: "Verify building envelope classification for every opening before leading with the NOA disqualifier." },
    ],
    closingMove: "Pull up the Miami-Dade Product Control search and show the Horton vs. ASSA ABLOY NOA count in real time during the bid review conversation.",
    talkTrack: "In Miami-Dade and Broward, the NOA is a hard gate — not a nice-to-have. The AHJ will reject any exterior automatic door without a valid Notice of Acceptance on file. When I look at Horton's certified product list, I don't see HVHZ-applicable exterior automatic doors. Before that bid is submitted with Horton hardware, I'd want the GC to pull the NOA number and verify it against the Miami-Dade Product Control database for the exact product configuration. That's not a paperwork issue — it's a compliance issue that can stop a project.",
    winSignals: [
      "Exterior openings in Miami-Dade or Broward County on the project",
      "GC or owner has been burned by a non-compliant submittal rejection before",
      "FBC 8th Edition compliance is explicitly called out in the RFP/bid documents",
    ],
    loseSignals: [
      "All automatic doors in project are interior only — NOA not required",
      "Project is in Florida but outside the defined HVHZ boundary (Panhandle, North Florida)",
      "Horton has already provided a compliant NOA for the specific product and size (verify before assuming)",
    ],
    keyMetrics: [
      "Miami-Dade Product Control NOA count: ASSA ABLOY (many) vs. Horton (few/none for automatic sliding)",
      "TAS 201/202/203 test report availability: ASSA ABLOY provides on request; Horton not publicly documented",
      "AHJ rejection rate for non-NOA exterior doors: typically 100% — no exceptions in HVHZ",
    ],
  },

  // ── horton × healthcare ───────────────────────────────────────────────────
  {
    competitor: "horton",
    context: "healthcare",
    headline: "Horton has no FGI-compliant healthcare product line — this market is ours to close.",
    winThemes: [
      {
        title: "No FGI-specific healthcare product engineering",
        detail: "The FGI Guidelines and ASHE/ANSI standards for healthcare facilities require specific door operator performance, infection control compliance, and in some cases hermetic sealing. Horton's ICU/CCU 2000/2001/2003 series addresses some hospital applications but is not broadly FGI-engineered or tested for negative pressure room compliance.",
        proof: "FGI 2022 Guidelines §2.1-4.1 — hospital entrance door performance requirements",
      },
      {
        title: "ICU/CCU series is dated — not a current platform investment",
        detail: "Horton's ICU/CCU products are extensions of the legacy 2000 platform rather than purpose-built healthcare solutions. ASSA ABLOY VersaMax 2.0 was designed from the ground up for FGI healthcare compliance, including cross-contamination prevention and infection control features.",
      },
      {
        title: "No hermetic sliding capability",
        detail: "OR and isolation room applications require hermetic door sealing to maintain negative pressure. Horton does not offer hermetic sliding doors. ASSA ABLOY's hermetic sliding line covers these applications fully.",
      },
    ],
    differentiators: [
      { dimension: "FGI-Engineered Sliding", ours: "VersaMax 2.0 — purpose-built FGI healthcare sliding", theirs: "ICU/CCU 2000 series — legacy platform, limited FGI engineering", advantage: "strong" },
      { dimension: "Hermetic Sliding", ours: "Hermetic sliding line available for OR/isolation", theirs: "None", advantage: "strong" },
      { dimension: "A156.38 Low-Energy Swing (Healthcare)", ours: "SW300, SW200i for healthcare corridors and patient rooms", theirs: "4000/7000 swing series — not specifically FGI-optimized", advantage: "strong" },
      { dimension: "Infection Control Engineering", ours: "VersaMax gap sealing, sensor positioning for cross-contamination", theirs: "Standard sensor positioning — not infection-control specific", advantage: "strong" },
      { dimension: "Installed Base in Hospitals", ours: "Strong hospital network, especially in large health systems", theirs: "Some ICU/CCU installs but limited health system penetration", advantage: "moderate" },
    ],
    objectionHandlers: [
      {
        objection: "We've used Horton ICU/CCU products in our hospital and they've worked.",
        response: "ICU/CCU 2000 series is reliable for basic hospital sliding applications. The question is whether your compliance team has reviewed FGI 2022 requirements for new construction. Where the gap appears is in hermetic applications, infection control sensor positioning, and full FGI compliance documentation — that's where VersaMax 2.0 was specifically engineered.",
      },
      {
        objection: "Horton service is faster in our area.",
        response: "If your facilities are all in the Sun Belt, that may be true. For a health system with facilities nationally, service consistency matters more than regional speed. What's your footprint?",
      },
      {
        objection: "We don't have OR or isolation rooms — just standard corridors.",
        response: "For standard hospital corridors, ICU/CCU 2000 covers the basics. But FGI 2022 has specific requirements even for corridor doors in new construction — force limits, activation distance, and sensor positioning. I'd want to walk through the FGI checklist for each application type before assuming it's standard.",
      },
    ],
    landmines: [
      { topic: "Horton ICU/CCU legacy installs in older hospitals", risk: "Replacement decisions favor same platform for parts compatibility", mitigation: "Compete on FGI compliance for new wings/new construction — don't try to pull existing Horton ICU/CCU on a like-for-like swap." },
    ],
    closingMove: "Request a meeting with the infection control team in addition to facilities — FGI compliance and cross-contamination prevention are their language, not Horton's.",
    talkTrack: "In healthcare new construction, the FGI Guidelines drive the specification. Horton's ICU/CCU series addresses basic hospital sliding, but it's an extension of a legacy commercial platform — not purpose-built for FGI compliance. VersaMax 2.0 was engineered specifically for healthcare: infection control sensor positioning, gap sealing for cross-contamination prevention, and documentation packages built for FGI submittal. For OR and isolation rooms, hermetic sealing is required and Horton simply doesn't make that product. This is a market where Horton's portfolio has a structural ceiling.",
    winSignals: [
      "New hospital construction, patient tower expansion, or ambulatory surgery center project",
      "FGI 2022 or ASHE compliance explicitly required in the RFP",
      "Project includes OR, isolation rooms, or negative pressure spaces requiring hermetic doors",
    ],
    loseSignals: [
      "Existing hospital replacing like-for-like Horton ICU/CCU in legacy wings with no FGI new construction requirement",
      "Small rural hospital with no infection control compliance team reviewing door specifications",
      "Project is administrative/office portion of a hospital campus, not clinical area",
    ],
    keyMetrics: [
      "FGI 2022 compliance checklist items: VersaMax documented vs. Horton ICU/CCU gaps",
      "Hermetic door applications: ASSA ABLOY covers, Horton does not offer",
      "VersaMax 2.0 launched with specific FGI engineering documentation; Horton ICU/CCU product page references no FGI standard",
    ],
  },

  // ── horton × iot_smart_building ───────────────────────────────────────────
  {
    competitor: "horton",
    context: "iot_smart_building",
    headline: "Horton has no IoT platform — in smart building specs, this isn't a close call.",
    winThemes: [
      {
        title: "No connected building platform",
        detail: "Horton does not offer an AI energy management, IoT dashboard, or cloud-connected door monitoring system. ASSA ABLOY ecoLOGIC (2025) provides AI-driven energy management, remote monitoring, and building management system integration. In projects where LEED EA or energy commissioning is required, this is a direct gap.",
      },
      {
        title: "No BAS/BMS integration capability",
        detail: "Building Automation System integration is increasingly specified in commercial and healthcare new construction. Horton's control systems are standalone — no documented BAS/BMS integration pathway. ASSA ABLOY products with ecoLOGIC and OSDP support connect to BAS and access control platforms.",
      },
      {
        title: "No remote diagnostics or predictive maintenance",
        detail: "Modern facilities management expects remote door health monitoring, error logging, and predictive maintenance alerts. Horton's product line does not offer these capabilities. ASSA ABLOY's connected platform provides real-time status visibility for FM teams.",
      },
    ],
    differentiators: [
      { dimension: "AI Energy Management", ours: "ecoLOGIC — AI learning, LEED EA contribution", theirs: "None", advantage: "strong" },
      { dimension: "BAS/BMS Integration", ours: "Documented integration pathway — BACnet, OSDP", theirs: "None documented", advantage: "strong" },
      { dimension: "Remote Monitoring / Diagnostics", ours: "Cloud dashboard, real-time door health alerts", theirs: "None — standalone controller only", advantage: "strong" },
      { dimension: "App Configuration", ours: "SW300-S smartphone app configuration (BAU 2025)", theirs: "Physical DIP switch/manual configuration", advantage: "strong" },
      { dimension: "Predictive Maintenance", ours: "Cycle count logging, wear indicators, remote alerts", theirs: "Reactive maintenance only", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "We don't need smart building features — just reliable doors.",
        response: "That's completely valid for retrofit projects. For new construction, your mechanical/electrical engineer will likely be asked about LEED energy commissioning and BAS integration regardless of door type. When that question comes up, ecoLOGIC is documented and ready. Having that answer available costs nothing upfront.",
      },
      {
        objection: "Horton works and doesn't need an app.",
        response: "For a single facility, that's true. For a multi-site portfolio where FM manages 50+ locations, remote monitoring and app configuration reduce truck rolls and shorten response time significantly. The ROI appears at scale.",
      },
      {
        objection: "Smart building features add cost we can't justify.",
        response: "ecoLOGIC's energy savings — reported up to 40% reduction in HVAC loss from automatic door operation — can offset the feature cost within the first year in high-traffic facilities. What's the BTU cost of this facility's conditioning per hour?",
      },
    ],
    landmines: [
      { topic: "Pure standalone door replacement in a non-connected facility", risk: "IoT features add no value if the building has no BAS and no LEED requirement", mitigation: "Don't lead with IoT in these accounts. Lead with reliability and service coverage. Mention ecoLOGIC only if energy efficiency or lifecycle management comes up." },
    ],
    closingMove: "Ask about the building's LEED certification target and BAS platform. Once BAS integration is on the table, Horton's manual-only controls are a non-starter.",
    talkTrack: "For any project where the owner has a LEED target, a BAS system, or a facilities management team managing multiple sites, Horton's standalone door controllers are a mismatch. ecoLOGIC brings AI-driven energy management — learning traffic patterns, adjusting door hold-open timing, reducing HVAC conditioning loss — and connects to BAS platforms for centralized monitoring. Horton's controller is a discrete device with no integration pathway. In a 2025 smart building spec, that's not a product preference — it's a functionality gap.",
    winSignals: [
      "LEED EA credit required or owner has sustainability targets",
      "Building has BAS/BMS and the specification calls for integration",
      "Multi-site FM team wants centralized door monitoring",
    ],
    loseSignals: [
      "Retrofit project in an older building with no BAS and no LEED requirement",
      "Owner explicitly says 'no connected features' due to IT security concerns",
      "Project is a simple like-for-like door replacement with no energy or monitoring scope",
    ],
    keyMetrics: [
      "ecoLOGIC energy reduction claim: up to 40% HVAC loss reduction in high-traffic applications",
      "BAS integration: ASSA ABLOY documented; Horton not documented",
      "App configuration availability: SW300-S (ASSA ABLOY 2025) vs. DIP switch (Horton)",
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // BOON EDAM CARDS
  // ════════════════════════════════════════════════════════════════════════════

  // ── boon_edam × customer_pitch ────────────────────────────────────────────
  {
    competitor: "boon_edam",
    context: "customer_pitch",
    headline: "Boon Edam owns the security revolving niche — but 80% of your openings aren't revolving doors.",
    winThemes: [
      {
        title: "Complete opening solution vs. specialist niche",
        detail: "Boon Edam excels at security revolving doors and optical turnstiles. That's a real and valuable niche. But your facility also has sliding doors, swing doors, ICU doors, high-traffic vestibules, and ADA-compliant entrances. ASSA ABLOY is the only company that can spec every opening in your building to the same standard, service network, and platform.",
        proof: "ASSA ABLOY product portfolio: sliding (SL500), swing (SW series), revolving (RD3–RD700), hermetic, healthcare (VersaMax)",
      },
      {
        title: "AAADM service network density",
        detail: "Boon Edam's US service network is significantly thinner than ASSA ABLOY's AAADM-certified national footprint. For facilities outside major metros, emergency response time and parts availability differ materially.",
        proof: "AAADM-certified technician coverage across all 50 states",
      },
      {
        title: "ecoLOGIC energy management and ADA compliance",
        detail: "Boon Edam's revolving door portfolio does not include ecoLOGIC AI energy management, BAS/BMS integration, or ADA-compliant automatic sliding for NFPA 101 controlled-egress healthcare configurations. ASSA ABLOY VersaMax handles ICU and controlled-egress requirements that security revolving doors cannot.",
      },
      {
        title: "Security revolving + complete opening platform",
        detail: "For projects needing both security vestibules and everyday automatic doors, ASSA ABLOY can spec the entire project. We can also integrate a Boon Edam Tourlock 180 alongside our VersaMax or SL500 in a vestibule spec if that's what the owner requires — giving them the best of both without fragmenting their service relationship.",
      },
    ],
    differentiators: [
      { dimension: "Automatic Sliding Doors", ours: "SL500, SL521, VersaMax, hermetic — complete line", theirs: "Virtually no automatic sliding capability", advantage: "strong" },
      { dimension: "Automatic Swing Doors", ours: "SW60–SW300-S, surface/concealed/in-ground", theirs: "Not a meaningful product offering", advantage: "strong" },
      { dimension: "Healthcare / FGI", ours: "VersaMax 2.0 FGI 2022; NFPA 101 controlled-egress", theirs: "No FGI-compliant automatic sliding; revolving not NFPA 101 controlled-egress rated for ICU", advantage: "strong" },
      { dimension: "Security Revolving / Turnstile", ours: "RD3A/RD4A1 OSDP v2 integrated; anti-tailgating capable", theirs: "Tourlock 180 is the market reference product; ISC West 2026 biometric integration", advantage: "watch" },
      { dimension: "FL HVHZ Products", ours: "NOA-certified exterior products", theirs: "No HVHZ product line", advantage: "strong" },
      { dimension: "US Service Network", ours: "AAADM-certified national coverage, all 50 states", theirs: "Thinner US service network", advantage: "strong" },
      { dimension: "AI Energy Management", ours: "ecoLOGIC AI BAS integration", theirs: "None", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "Boon Edam has the most secure revolving door on the market.",
        response: "Their Tourlock 180 is excellent for anti-tailgating — that's a genuine strength. But for projects needing ADA-compliant automatic sliding alongside a secure vestibule, ASSA ABLOY delivers the complete opening solution. We can match the anti-tailgating requirement with our RD3A/RD4A1 access-control integrated revolving, or we can spec VersaMax sliding plus a Boon Edam Tourlock in the same vestibule — whichever the owner prefers.",
        bridgeTo: "Map the full facility opening inventory: what percentage actually requires anti-tailgating?",
      },
      {
        objection: "Our security director prefers Boon Edam for the entrance vestibule.",
        response: "That's a reasonable preference for the vestibule application. The question is: who handles the remaining 90% of openings in the facility? If we're bidding the whole project, our RD series can satisfy the security vestibule requirement while ASSA ABLOY handles everything else under one service agreement and one NOA portfolio.",
      },
      {
        objection: "Boon Edam's biometric integration at ISC West 2026 was impressive.",
        response: "The Alcatraz Rock X + Tourlock 180 integration is genuine innovation. Our RD3A/RD4A1 revolving door series supports OSDP v2, which integrates with essentially any biometric platform — Alcatraz, HID, IDEMIA — without being locked into a single vendor's biometric hardware.",
      },
      {
        objection: "We need a security portal for our data center entrance.",
        response: "For a pure mantrap/Circlelock application in a data center, Boon Edam is a strong choice. For the data center's sliding glass doors, server-room swing doors, and any outdoor HVHZ applications, those are our openings. We complement each other on a campus-scale project.",
      },
    ],
    landmines: [
      { topic: "Boon Edam Tourlock as specified product", risk: "Security consultant may have named Tourlock 180 in the spec", mitigation: "Position ASSA ABLOY RD3A as an or-equal for the security vestibule, then dominate the rest of the project scope." },
      { topic: "ISC West biometric demo", risk: "Boon Edam's 2026 ISC West Alcatraz integration generated significant press", mitigation: "Counter with OSDP v2 open standard — we integrate with more biometric vendors, not just one." },
    ],
    closingMove: "Ask: 'What percentage of openings in this facility actually require anti-tailgating?' Then demonstrate that ASSA ABLOY covers all of them, including the security vestibule.",
    talkTrack: "Boon Edam owns the security revolving door niche — and we respect that. The Tourlock 180 is a great product for anti-tailgating applications. But 80% of your facility's openings aren't revolving doors. They're sliding doors, swing doors, ICU doors, high-traffic vestibules. ASSA ABLOY is the only company that can spec every opening in your building to the same standard, the same service network, and the same platform. For the security vestibule specifically, our RD3A/RD4A1 with OSDP v2 access control integration matches the anti-tailgating requirement — and it's backed by AAADM-certified service nationwide. For your hospital ICU, your grocery store exterior, your airport boarding gates — Boon Edam has no answer.",
    winSignals: [
      "Large facility with diverse opening types beyond security entrance",
      "Healthcare project requiring NFPA 101 controlled-egress or FGI 2022 compliance",
      "FL project with exterior HVHZ openings",
    ],
    loseSignals: [
      "Project is purely a security entrance vestibule replacement with no other automatic door scope",
      "Customer is a data center or financial institution with a single entrance type requirement",
      "Security consultant has specified Tourlock 180 by name with no substitution clause",
    ],
    keyMetrics: [
      "Facility opening type breakdown: what % requires anti-tailgating vs. standard auto door",
      "ASSA ABLOY RD3A vs. Boon Edam Tourlock 180: OSDP v2 access control integration comparison",
      "US AAADM service network: ASSA ABLOY national vs. Boon Edam metro-only coverage",
    ],
  },

  // ── boon_edam × revolving_door ─────────────────────────────────────────
  {
    competitor: "boon_edam",
    context: "revolving_door",
    headline: "Security revolving and everyday revolving are different problems — ASSA ABLOY solves both.",
    winThemes: [
      {
        title: "ASSA ABLOY RD3A/RD4A1: security revolving with OSDP v2",
        detail: "For security entrance applications, our RD3A and RD4A1 revolving doors integrate access control via OSDP v2 — the open standard that interfaces with HID, Schlage, IDEMIA, Alcatraz, and essentially every enterprise access control system. Boon Edam's Tourlock integrates deeply with specific vendors; ours integrates broadly.",
        proof: "ASSA ABLOY OSDP v2 certification; RD3A/RD4A1 access-controlled revolving door series",
      },
      {
        title: "High-capacity revolving for airports and hotels: RD700",
        detail: "Boon Edam's highest-throughput revolving tops out at roughly 2,800 persons/hour. ASSA ABLOY's RD700 High Capacity handles up to 3,600 persons/hour at 6m diameter — the reference product for international airports and major transit hubs where Boon Edam cannot compete.",
      },
      {
        title: "Hospitality premium: RD300 All-Glass",
        detail: "The RD300 All-Glass revolving door — frameless, up to 3.6m diameter — is the standard for five-star hotel lobbies, luxury retail flagships, and premium corporate headquarters. Boon Edam's Crystal revolving is limited to 2.4m diameter and manual operation; our RD300 is motorized and larger.",
      },
    ],
    differentiators: [
      { dimension: "Anti-tailgating security vestibule", ours: "RD3A/RD4A1 OSDP v2; biometric-ready open standard", theirs: "Tourlock 180 — market reference; ISC West 2026 Alcatraz integration", advantage: "watch" },
      { dimension: "High-capacity transit revolving", ours: "RD700: 3,600 persons/hr, 6m diameter", theirs: "Max ~2,800 persons/hr; no comparable high-capacity product", advantage: "strong" },
      { dimension: "All-glass premium revolving", ours: "RD300: motorized, up to 3.6m, frameless", theirs: "Crystal: manual, max 2.4m", advantage: "strong" },
      { dimension: "Optical turnstile / speed gate", ours: "Through partnership / integrated spec", theirs: "Speedlane — market-leading in corporate lobby", advantage: "watch" },
      { dimension: "OSDP v2 access control integration", ours: "OSDP v2 open standard — any access control system", theirs: "Proprietary integration; deep with specific vendors", advantage: "moderate" },
      { dimension: "US service network for revolving", ours: "AAADM-certified national coverage", theirs: "Thinner US service network", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "Boon Edam's Tourlock 180 is the anti-tailgating standard.",
        response: "Tourlock 180 is excellent — we acknowledge the leadership. Our RD3A with OSDP v2 gives you the same one-person-at-a-time control with a broader access control ecosystem. If your project already runs HID, Schlage, or IDEMIA, the OSDP v2 integration is more open and more future-proof than a proprietary Boon Edam integration.",
      },
      {
        objection: "We need a speed gate for the lobby, not a revolving door.",
        response: "Speedlane is an excellent product for lobby access control gates. That's Boon Edam's home turf. Our strength is when that lobby also needs a motorized revolving door for visitor traffic plus an ADA bypass sliding door — we spec all three elements; Boon Edam specs one.",
      },
    ],
    landmines: [
      { topic: "Tourlock 180 security specification", risk: "Security architects often specify Tourlock by name for anti-tailgating applications", mitigation: "Compete on OSDP v2 openness, total project scope, and US service density." },
    ],
    closingMove: "Map the security entrance vs. total revolving door scope. If high-capacity transit, hotel, or mixed-use revolving is part of the project, ASSA ABLOY wins on throughput and premium aesthetics.",
    talkTrack: "Boon Edam is the revolving door security specialist. When you need anti-tailgating in a data center lobby, they have the reference product. Where we win is everywhere else on the revolving door spectrum: airport high-capacity (RD700 at 3,600 persons/hr), premium hospitality all-glass (RD300), and access-control integrated revolving via OSDP v2 open standard. Boon Edam's Crystal revolving is limited to 2.4m and manual operation; our RD300 is motorized and up to 3.6m. Their Speedlane turnstile is strong for corporate lobbies; when that lobby also needs a high-capacity motorized revolving, we cover both.",
    winSignals: [
      "High-capacity transit or airport revolving door application",
      "Five-star hotel or luxury corporate lobby requiring all-glass motorized revolving",
      "Mixed project with security vestibule plus high-throughput general access revolving",
    ],
    loseSignals: [
      "Pure anti-tailgating data center or financial institution with only one entrance type",
      "Security consultant has specifically named Tourlock 180 and speed gate combo with no other revolving scope",
    ],
    keyMetrics: [
      "RD700 throughput: 3,600 persons/hr vs. Boon Edam max ~2,800 persons/hr",
      "RD300 diameter: up to 3.6m motorized vs. Boon Edam Crystal max 2.4m manual",
      "OSDP v2 access control integrations: 200+ compatible platforms vs. Boon Edam proprietary",
    ],
  },

  // ── boon_edam × healthcare ───────────────────────────────────────────────
  {
    competitor: "boon_edam",
    context: "healthcare",
    headline: "For hospital vestibules, you need airlock control, ADA compliance, infection control, and staff credential integration — ASSA ABLOY delivers all four.",
    winThemes: [
      {
        title: "NFPA 101 controlled-egress: revolving doors are excluded",
        detail: "NFPA 101 Life Safety Code prohibits revolving doors as the primary means of egress in healthcare occupancy ICU configurations. Boon Edam's revolving doors, however secure, cannot serve as the primary entrance/exit for ICU, OR, or emergency department applications under FGI 2022 guidelines. ASSA ABLOY VersaMax sliding is NFPA 101 compliant.",
        proof: "NFPA 101-2021 Chapter 7.2.1.10 — revolving door egress limitations in healthcare occupancy",
      },
      {
        title: "Infection control and pressure differential sensing",
        detail: "VersaMax 2.0 includes antimicrobial surface finish, infection-control mode (delayed close, reduced air exchange), and pressure differential sensing for airlock vestibule control. Boon Edam's revolving doors do not offer FGI 2022-documented infection control features for clinical settings.",
        proof: "FGI Guidelines for Design and Construction of Hospitals 2022, §2.1-3",
      },
      {
        title: "Hermetic sliding for OR and clean room applications",
        detail: "Hermetic automatic sliding doors for operating rooms and pharmaceutical clean rooms require HEPA-compatible gasket systems and positive pressure sealing. ASSA ABLOY's SL500 Clean Room is purpose-built for this. Boon Edam has no hermetic sliding product.",
      },
    ],
    differentiators: [
      { dimension: "NFPA 101 Controlled-Egress Compliance", ours: "VersaMax — NFPA 101 compliant for ICU/OR primary egress", theirs: "Revolving doors not allowed as primary ICU egress under NFPA 101", advantage: "strong" },
      { dimension: "FGI 2022 Documentation", ours: "VersaMax 2.0 engineered to FGI 2022 with submittal package", theirs: "No FGI 2022 healthcare submittal package", advantage: "strong" },
      { dimension: "Infection Control Features", ours: "Antimicrobial, infection-control mode, pressure differential sensing", theirs: "No clinical infection control features", advantage: "strong" },
      { dimension: "Hermetic Clean Room Sliding", ours: "SL500 Clean Room: IP54, HEPA-compatible", theirs: "Not offered", advantage: "strong" },
      { dimension: "Security Vestibule Entry", ours: "RD3A/RD4A1 access-controlled revolving; or VersaMax with credential integration", theirs: "Tourlock 180 / Lifeline for hospital security", advantage: "neutral" },
    ],
    objectionHandlers: [
      {
        objection: "We want a Boon Edam revolving door for our hospital lobby vestibule.",
        response: "For a lobby vestibule where anti-tailgating is the requirement, Boon Edam is a reasonable choice. The critical question is the clinical areas behind that lobby. For ICU, OR, emergency department, and any area where NFPA 101 controlled-egress applies, revolving doors are not compliant as primary egress. Those openings require VersaMax or equivalent FGI 2022-documented automatic sliding.",
      },
      {
        objection: "Boon Edam's Lifeline revolving is designed for hospitals.",
        response: "The Lifeline is designed for hospital entry vestibules — a lobby security application. It's not an ICU door, OR door, or controlled-egress clinical sliding door. The FGI 2022 hospital specification covers many door types beyond the front entrance. ASSA ABLOY covers all of them.",
      },
    ],
    landmines: [
      { topic: "Security vestibule preference", risk: "Hospital security director may prefer Boon Edam for main entry", mitigation: "Concede the front lobby revolving if necessary; dominate the clinical area with VersaMax. Two different purchase decisions." },
    ],
    closingMove: "Walk through the FGI 2022 door type schedule for the facility. Show which openings require VersaMax (ICU, OR, controlled-egress) vs. which can use revolving (lobby vestibule only).",
    talkTrack: "For your hospital vestibule, you need airlock control, ADA compliance, infection control, and staff credential integration. Boon Edam's revolving doors are impressive for lobby security — but they don't meet NFPA 101 controlled-egress requirements in ICU configurations. Our VersaMax does. And for the operating rooms, clean rooms, and emergency department — the FGI 2022 compliance documentation exists for VersaMax. It doesn't exist for any Boon Edam product. Our opening is the entire clinical facility; their opening is the front door.",
    winSignals: [
      "Hospital project with ICU, OR, or emergency department openings requiring NFPA 101 compliance",
      "FGI 2022 is referenced in the project specification",
      "Clean room or positive-pressure pharmaceutical application",
    ],
    loseSignals: [
      "Hospital project limited to main lobby security vestibule replacement with no clinical area scope",
      "Security-driven spec where anti-tailgating at main entrance is the only door decision",
    ],
    keyMetrics: [
      "NFPA 101-2021 Chapter 7.2.1.10: revolving door egress limitations in healthcare",
      "FGI 2022 door type schedule: clinical areas requiring VersaMax vs. lobby areas",
      "VersaMax 2.0: only healthcare automatic sliding door with documented FGI 2022 compliance package",
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // GEZE CARDS
  // ════════════════════════════════════════════════════════════════════════════

  // ── geze × customer_pitch ──────────────────────────────────────────────────
  {
    competitor: "geze",
    context: "customer_pitch",
    headline: "GEZE makes excellent products for European specifiers — in the US, you need a technician, not a callback queue routed through Leonberg.",
    winThemes: [
      {
        title: "US service network — there when it matters",
        detail: "GEZE's US service network is thin outside major metros (NY, DC, Chicago, LA). When your hospital wing in Fort Lauderdale needs emergency service at 2am, you want an AAADM-certified technician with local parts, not a callback queue routed through Leonberg, Germany. ASSA ABLOY has AAADM-certified coverage in all 50 states.",
        proof: "AAADM-certified technician coverage: ASSA ABLOY nationwide vs. GEZE metro-only",
      },
      {
        title: "HVHZ certification: GEZE has none",
        detail: "GEZE's German-engineered product line has not been tested or certified for Florida's High Velocity Hurricane Zone (HVHZ). For any exterior opening in Miami-Dade or Broward County, the NOA requirement is non-negotiable. ASSA ABLOY holds NOA certification on its exterior product line; GEZE does not.",
        proof: "FBC 8th Ed. §1709.5; Miami-Dade Product Control NOA database",
      },
      {
        title: "myGEZE platform is European-mature, US-early",
        detail: "GEZE's myGEZE Control (updated Nov 2025) is impressive technology — ML-based predictive maintenance, BMS native integration. In European markets it has real deployment depth. In the US, deployment data is limited and their technician network can't service it nationally. Our ecoLOGIC + SW300-S Bluetooth App gives you the same capability with local support.",
      },
    ],
    differentiators: [
      { dimension: "US Service Network", ours: "AAADM-certified national coverage, all 50 states", theirs: "Metro-only (NY, DC, Chicago, LA) — secondary markets have slow response", advantage: "strong" },
      { dimension: "FL HVHZ Certification (NOA)", ours: "NOA-certified exterior products", theirs: "No HVHZ product line — cannot bid FL exterior", advantage: "strong" },
      { dimension: "IoT Platform (US)", ours: "ecoLOGIC AI + SW300-S Bluetooth — US-deployed 2025", theirs: "myGEZE Control — European-mature; limited US enterprise deployments", advantage: "moderate" },
      { dimension: "BMS/HVAC Integration", ours: "ecoLOGIC BACnet/Modbus; ASHRAE 90.1", theirs: "myGEZE BMS native — strong in European BMS protocols", advantage: "neutral" },
      { dimension: "A156.10 Compliance Depth", ours: "Full ANSI test documentation available", theirs: "A156 documentation less developed; primarily EN 16005", advantage: "moderate" },
      { dimension: "Healthcare FGI", ours: "VersaMax 2.0 FGI 2022 documented", theirs: "No FGI-specific healthcare product in US market", advantage: "strong" },
      { dimension: "Price", ours: "Premium", theirs: "At or above ASSA ABLOY at premium tier", advantage: "neutral" },
    ],
    objectionHandlers: [
      {
        objection: "GEZE's myGEZE platform is more advanced on IoT.",
        response: "myGEZE Control is impressive — it has real ML-based predictive maintenance and BMS native integration. In European markets where it's been deployed for years, that's a genuine advantage. In the US, our ecoLOGIC Energy Management and SW300-S Bluetooth App Configuration give you the same remote monitoring capability — with an AAADM-certified technician within driving distance to actually respond to what the system detects. GEZE's US service network cannot match that.",
      },
      {
        objection: "We've specified GEZE Slimdrive in Europe — we want the same product here.",
        response: "Slimdrive's 70mm header is an excellent product and we understand the preference. For this US project, the questions I'd want answered are: ANSI A156.10 test documentation for this specific opening, HVHZ certification for exterior applications if you're in Florida, and who services it in year 3. Our SL500 is the US-specification equivalent with better service support.",
      },
      {
        objection: "GEZE Powerturn is our architect's preferred swing operator.",
        response: "Powerturn is a premium product — the architect's preference is noted. Our SW300-S achieves the same slim profile at 85mm with smartphone app configuration and dual full/low energy modes. I'd ask the architect to run both through the A156.10-2024 compliance matrix and the HVHZ check if this is a Florida exterior application.",
      },
      {
        objection: "GEZE offers better BMS integration for our smart building spec.",
        response: "myGEZE's BMS native integration is strong — that's a legitimate claim for European BMS protocols. For US BAS systems using BACnet or Modbus, our ecoLOGIC integration is documented and field-deployed. What BAS platform is the building running? I can pull the specific integration documentation.",
      },
    ],
    landmines: [
      { topic: "IoT platform feature comparison", risk: "myGEZE Control (Nov 2025) has strong feature depth on paper", mitigation: "Compete on US deployment maturity and service network. myGEZE features don't matter if the technician can't get there." },
      { topic: "GEZE Slimdrive architectural preference", risk: "EOR may have designed to GEZE Slimdrive 70mm in the facade", mitigation: "Compete on US compliance documentation, service, and HVHZ if applicable. Offer an A156.10 or-equal submittal." },
    ],
    closingMove: "Ask: 'Who services this door if something goes wrong at 2am?' Then pull up AAADM technician coverage by zip code vs. GEZE service network.",
    talkTrack: "GEZE makes excellent products. In Germany and across Europe, they're a reference brand for building-integrated automatic doors and the myGEZE Control IoT platform is genuinely impressive engineering. In the US, the question isn't about product specs — it's about what happens when the door fails. GEZE's US service network outside major metros is thin. Our AAADM-certified technicians cover all 50 states. For Florida projects specifically, GEZE has no NOA-certified products — they simply cannot bid HVHZ exterior work. And ecoLOGIC gives you the same smart building integration that myGEZE offers — with an American service network to back it up.",
    winSignals: [
      "Project has FL HVHZ exterior openings",
      "Project location is outside a major metro where GEZE service coverage is thin",
      "Healthcare or FGI 2022 compliance is specified",
    ],
    loseSignals: [
      "Project is in a major metro (NY, DC, Chicago) where GEZE has service presence",
      "All-glass curtain wall where architect has designed to Slimdrive 70mm by name",
      "European-owned building with GEZE as a global preferred vendor",
    ],
    keyMetrics: [
      "US service coverage: ASSA ABLOY 50 states AAADM vs. GEZE metro-only",
      "FL HVHZ: ASSA ABLOY NOA-certified vs. GEZE zero NOA products",
      "myGEZE US deployments vs. ecoLOGIC US deployments: ask for reference list",
    ],
  },

  // ── geze × iot_comparison ──────────────────────────────────────────────
  {
    competitor: "geze",
    context: "iot_comparison",
    headline: "myGEZE Control vs. ecoLOGIC: the IoT showdown — features are table stakes, service network is the moat.",
    winThemes: [
      {
        title: "US deployment maturity: ecoLOGIC has the home-field advantage",
        detail: "myGEZE Control (Nov 2025 update) is European-mature. In Germany, Switzerland, and the UK, GEZE has years of deployment data for ML-based predictive maintenance. In the US, enterprise deployments are limited. ecoLOGIC launched in the US market in 2025 with purpose-built US infrastructure, ASHRAE 90.1 compatibility documentation, and BACnet/Modbus integration for US BAS platforms.",
      },
      {
        title: "Feature parity: both platforms offer remote diagnostics, predictive maintenance, BMS integration",
        detail: "myGEZE and ecoLOGIC are genuinely comparable on core IoT features. Remote diagnostics, fault alerts, predictive maintenance alerts, BMS integration — both platforms deliver these. The differentiator is not the feature list; it's who responds when the system triggers an alert. AAADM-certified US technicians vs. a service callback.",
      },
      {
        title: "ASSA ABLOY ecoLOGIC: energy savings with documented ROI",
        detail: "ecoLOGIC AI delivers up to 80% reduction in HVAC infiltration load through AI-driven hold-open time optimization. GEZE myGEZE offers energy monitoring but not AI-driven optimization. For LEED EA and ASHRAE 90.1 compliance, ecoLOGIC's ROI documentation is more actionable than myGEZE's monitoring data.",
        proof: "ASHRAE 90.1 building envelope; LEED EA credit — ecoLOGIC energy savings documentation available",
      },
    ],
    differentiators: [
      { dimension: "Remote Diagnostics", ours: "ecoLOGIC + SW300-S Bluetooth App", theirs: "myGEZE Control cloud dashboard (Nov 2025)", advantage: "neutral" },
      { dimension: "ML Predictive Maintenance", ours: "SW300-S fault alerts + cycle count", theirs: "myGEZE ML-based component prediction — European-mature", advantage: "watch" },
      { dimension: "BMS/HVAC Integration (US)", ours: "ecoLOGIC BACnet/Modbus; ASHRAE 90.1", theirs: "myGEZE BMS native — stronger in European protocols", advantage: "moderate" },
      { dimension: "Energy Optimization AI", ours: "ecoLOGIC AI: up to 80% HVAC infiltration reduction", theirs: "myGEZE: monitoring only, no AI optimization", advantage: "strong" },
      { dimension: "Over-the-Air Updates", ours: "SW300-S Bluetooth firmware update", theirs: "myGEZE cloud OTA", advantage: "neutral" },
      { dimension: "US Deployment Maturity", ours: "2025 US launch; growing enterprise base", theirs: "Limited US enterprise deployments", advantage: "moderate" },
      { dimension: "Service Response on Alert", ours: "AAADM-certified technician in 50 states", theirs: "Metro-only US coverage", advantage: "strong" },
    ],
    objectionHandlers: [
      {
        objection: "myGEZE ML-based predictive maintenance is more advanced than anything you offer.",
        response: "myGEZE's ML capability is real and deployed in European markets. The honest comparison: our SW300-S fault alerts and cycle count logging provide actionable maintenance triggers in the US market today, backed by AAADM-certified technicians who can respond to those alerts nationwide. The most advanced predictive maintenance platform is useless if no one can act on the prediction within 24 hours.",
      },
      {
        objection: "GEZE says myGEZE integrates with any BMS natively.",
        response: "myGEZE BMS integration is strong in European protocol environments. For US BAS systems — BACnet, Modbus, and the Johnson Controls, Siemens, or Honeywell platforms that dominate the US market — our ecoLOGIC BACnet/Modbus integration is purpose-built for the US BAS ecosystem. Ask GEZE for a US BAS integration reference list and compare it to ours.",
      },
      {
        objection: "The building spec calls for predictive maintenance capabilities.",
        response: "Both platforms satisfy that requirement on paper. The differentiating question for the spec: which platform has documented US BAS integration, which has US reference deployments, and which is backed by a US service network that can respond to predictive alerts? ecoLOGIC wins all three.",
      },
    ],
    landmines: [
      { topic: "myGEZE ML feature depth", risk: "On feature specifications alone, myGEZE Nov 2025 is very competitive", mitigation: "Always bring the conversation back to US deployment maturity and service response. Feature lists lose to operational reality." },
    ],
    closingMove: "Request a US BAS integration reference from both vendors. Then ask GEZE how many AAADM-certified US technicians they have in this region.",
    talkTrack: "The IoT platform comparison between myGEZE Control and ecoLOGIC is actually a near-tie on features. Remote diagnostics, predictive maintenance, BMS integration — both platforms do all of these. The contest is decided by two things: energy optimization and service response. ecoLOGIC AI delivers AI-driven hold-open optimization that reduces HVAC infiltration load up to 80% — myGEZE monitors energy, it doesn't optimize it. And when either platform triggers a maintenance alert, AAADM-certified ASSA ABLOY technicians cover all 50 states. GEZE's US service footprint tops out in a handful of major metros. A predictive alert that can't be acted on isn't an advantage — it's a liability.",
    winSignals: [
      "Project is in a secondary market outside major metros where GEZE lacks service presence",
      "LEED EA or ASHRAE 90.1 energy reduction documentation required in spec",
      "US BAS platform (BACnet/Modbus) integration is specified",
    ],
    loseSignals: [
      "Project is in a major European-influenced metro where myGEZE has deployment data (NYC high-rise, Chicago)" ,
      "Owner specifically wants ML-based predictive maintenance with existing GEZE products in the portfolio",
    ],
    keyMetrics: [
      "ecoLOGIC energy reduction: up to 80% HVAC infiltration reduction (AI-driven) vs. myGEZE monitoring only",
      "US BAS integration references: ecoLOGIC BACnet/Modbus documented vs. GEZE US reference list",
      "US AAADM service coverage: 50 states (ASSA ABLOY) vs. metro-only (GEZE)",
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // TORMAX CARDS
  // ════════════════════════════════════════════════════════════════════════════

  // ── tormax × customer_pitch ─────────────────────────────────────────────────
  {
    competitor: "tormax",
    context: "customer_pitch",
    headline: "TORMAX will service your door. Only ASSA ABLOY is accountable for it.",
    winThemes: [
      {
        title: "AAADM factory-certified vs. independent service — accountability is the difference",
        detail: "TORMAX markets the ability to service competitors' products including ASSA ABLOY doors. Any qualified technician can turn a wrench. But AAADM factory-certified service means the people touching your equipment were trained by the people who built it — they have access to OEM parts, factory diagnostic protocols, and full technical documentation. That's the difference between maintenance and accountability.",
        proof: "AAADM factory certification program; OEM parts availability vs. third-party service",
      },
      {
        title: "Innovation platform: ecoLOGIC and SW300-S",
        detail: "TORMAX's TX9000 is a solid sliding door system. But it has no AI energy management platform comparable to ecoLOGIC, no Bluetooth app configuration (SW300-S), and no smart building integration pathway. For projects with LEED targets, BAS integration, or multi-site FM management, ASSA ABLOY's technology platform wins on features TORMAX simply doesn't offer.",
      },
      {
        title: "FL HVHZ certification: TORMAX has none",
        detail: "TORMAX products are not certified for Florida's High Velocity Hurricane Zone. For exterior automatic doors in Miami-Dade or Broward, the NOA is non-negotiable. ASSA ABLOY holds NOA certification; TORMAX cannot legally bid HVHZ exterior work.",
      },
      {
        title: "Complete opening solution: revolving, healthcare, hermetic",
        detail: "TORMAX offers sliding and swing doors only. For a project with revolving doors, hermetic clean-room sliding, FGI 2022 healthcare, or HVHZ exterior requirements, TORMAX cannot cover the full scope. ASSA ABLOY can spec every opening in the building.",
      },
    ],
    differentiators: [
      { dimension: "FL HVHZ Certification", ours: "NOA-certified exterior products", theirs: "No HVHZ product line — cannot bid FL exterior", advantage: "strong" },
      { dimension: "Revolving Doors", ours: "Full RD3–RD700 range", theirs: "No revolving door line", advantage: "strong" },
      { dimension: "AI Energy Management", ours: "ecoLOGIC AI platform (2025)", theirs: "None", advantage: "strong" },
      { dimension: "Service Accountability", ours: "AAADM factory-certified OEM service", theirs: "Services all brands — generalist third-party service model", advantage: "strong" },
      { dimension: "Healthcare FGI Compliance", ours: "VersaMax 2.0 FGI 2022", theirs: "No FGI-specific healthcare product", advantage: "strong" },
      { dimension: "Sliding Door Head-to-Head", ours: "SL500 — HVHZ certified, ecoLOGIC ready", theirs: "TX9000 iMotion — competitive; 8–12% below ASSA ABLOY price", advantage: "moderate" },
      { dimension: "Price (standard sliding)", ours: "Premium — 5–12% above TORMAX on standard sliding", theirs: "Price advantage on standard configurations", advantage: "watch" },
    ],
    objectionHandlers: [
      {
        objection: "TORMAX can service our existing ASSA ABLOY doors for less.",
        response: "TORMAX can absolutely service our products — any technician can. The question is what you're getting. AAADM factory-certified service uses OEM parts, factory diagnostic protocols, and full technical documentation. Third-party service uses aftermarket parts and generalist technicians. For warranty compliance, AAADM certification is required under A156.10. What happens to your warranty if you use non-factory-certified service?",
        bridgeTo: "Review service contract terms and A156.10 warranty compliance requirements.",
      },
      {
        objection: "TORMAX TX9000 is spec-equivalent to the SL500 and 10% cheaper.",
        response: "TX9000 is a solid product at a competitive price — that's a fair comparison on standard commercial sliding. The differentiation is what happens at year 3 service call, whether your project has HVHZ exterior requirements, and whether the building has IoT/smart building integration in scope. Run those three questions and the picture changes.",
      },
      {
        objection: "TORMAX has a national US distribution network.",
        response: "They do — it's a legitimate channel. The distinction is AAADM-certified coverage depth and OEM parts stocking. On a multi-site portfolio, service consistency and parts lead time matter more than distributor footprint. How many of your sites are AAADM-inspected annually today?",
      },
    ],
    landmines: [
      { topic: "TORMAX service pricing", risk: "TORMAX's service-first model may price service lower than AAADM-certified service", mitigation: "Anchor to warranty compliance, OEM parts quality, and AAADM inspection certification requirements." },
      { topic: "TX9000 vs. SL500 price gap", risk: "TORMAX can win on price for standard commercial sliding", mitigation: "Compete on HVHZ, ecoLOGIC, revolving, and service accountability. Don't fight on unit price." },
    ],
    closingMove: "Ask: 'Does your service contract require AAADM-certified technicians? If so, can TORMAX fulfill that requirement?' Then show the A156.10 §12 annual inspection language.",
    talkTrack: "TORMAX will tell you they can service our doors. That's true — any technician can turn a wrench. But AAADM factory-certified service means the people touching your equipment were trained by the people who built it. That's the difference between maintenance and accountability. And on the product side, TORMAX TX9000 is a decent sliding door at a competitive price. But it has no ecoLOGIC AI energy management, no HVHZ certification for Florida exterior work, no revolving door line, and no healthcare FGI platform. For a standard commercial sliding door with no special requirements, they can compete on price. For anything beyond that — and most real projects have something beyond that — ASSA ABLOY is the only option.",
    winSignals: [
      "Project has FL HVHZ exterior openings",
      "Project includes revolving, healthcare, or smart building requirements",
      "Owner has A156.10 annual inspection compliance obligations and needs AAADM-certified service",
    ],
    loseSignals: [
      "Pure standard commercial sliding door replacement with no special requirements",
      "Owner has no AAADM certification requirement in their service contract",
      "TORMAX is already the service provider for the account",
    ],
    keyMetrics: [
      "A156.10 §12: annual inspection by AAADM-certified technician required",
      "TX9000 price delta vs. SL500 (8–12%) vs. ecoLOGIC energy savings ROI",
      "HVHZ: ASSA ABLOY NOA-certified vs. TORMAX zero NOA products",
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // NABTESCO CARDS
  // ════════════════════════════════════════════════════════════════════════════

  // ── nabtesco × customer_pitch ───────────────────────────────────────────────
  {
    competitor: "nabtesco",
    context: "customer_pitch",
    headline: "Nabtesco precision technology is real — their US presence, service network, and compliance depth are not yet.",
    winThemes: [
      {
        title: "US service infrastructure: Nabtesco is not yet set up for national support",
        detail: "Nabtesco/AGD Systems is primarily an OEM technology provider in the US market. Their AGD Systems brand has limited direct distribution, thin AAADM-certified technician coverage, and limited US reference deployments compared to ASSA ABLOY's established national service infrastructure. For a 100+ location portfolio, service consistency matters more than operator precision.",
      },
      {
        title: "A156.10 compliance documentation depth",
        detail: "Nabtesco's primary compliance framework is Japanese Industrial Standard JIS A 4722. A156.10 documentation for US specifications is limited. For architects and engineers requiring full ANSI test documentation — A156.10-2024, TAS 201/202/203 for FL exterior — ASSA ABLOY's submittal package is comprehensive; Nabtesco's is not.",
      },
      {
        title: "Complete opening solution vs. OEM components",
        detail: "Nabtesco is primarily a motion control technology company. Their automatic door offering covers basic sliding operators. ASSA ABLOY covers sliding, swing, folding, revolving, hermetic, healthcare, and high-capacity transit — a complete opening system for every application in the building.",
      },
    ],
    differentiators: [
      { dimension: "US Service Network", ours: "AAADM-certified national, 50 states", theirs: "Limited US direct service; OEM model", advantage: "strong" },
      { dimension: "A156.10 Compliance Documentation", ours: "Full ANSI test documentation available", theirs: "JIS-primary; A156.10 documentation limited", advantage: "strong" },
      { dimension: "FL HVHZ Certification", ours: "NOA-certified exterior products", theirs: "Not certified for HVHZ", advantage: "strong" },
      { dimension: "Revolving / Healthcare / Hermetic", ours: "Full portfolio across all door types", theirs: "Sliding operators only (US)", advantage: "strong" },
      { dimension: "Quiet/Precision Operation", ours: "Competitive — ecoLOGIC-optimized", theirs: "Genuine strength: ultra-quiet precision operation", advantage: "watch" },
      { dimension: "OEM Technology Relationships", ours: "Proprietary platform", theirs: "OEM supplier to multiple manufacturers — technology embedded broadly", advantage: "neutral" },
    ],
    objectionHandlers: [
      {
        objection: "Nabtesco/AGD has the quietest doors — our hospitality client wants whisper-quiet operation.",
        response: "Nabtesco's precision engineering is a real differentiator for whisper-quiet operation — that's a legitimate strength in luxury retail and hospitality. Our ecoLOGIC-optimized RD300 All-Glass revolving and SL500 are designed for the same premium market. The question is what happens when you need service at the hotel at 2am and what happens when the spec asks for A156.10-2024 compliance documentation.",
      },
      {
        objection: "Nabtesco is an OEM supplier — their technology is in many products already.",
        response: "That's true and it's an important point. Nabtesco's OEM technology is embedded in competitor products. The question for your project is whether you want the OEM technology as a branded AGD Systems product with limited US service and compliance documentation, or a purpose-built ASSA ABLOY system with the full US service and compliance infrastructure behind it.",
      },
    ],
    landmines: [
      { topic: "Ultra-quiet operation in luxury applications", risk: "Nabtesco precision engineering is genuine and can be a spec criterion", mitigation: "Compete on service network, compliance documentation, and complete opening solution. If whisper-quiet is the spec, demonstrate ecoLOGIC's hold-open optimization also reduces perceived noise from air movement." },
    ],
    closingMove: "Ask for a US reference list and A156.10-2024 compliance documentation from Nabtesco. Then compare to ASSA ABLOY's submittal package.",
    talkTrack: "Nabtesco makes excellent precision motion control technology — their OEM relationships are evidence of that. In the US market, as AGD Systems, they're an early-stage direct brand with limited service infrastructure, limited A156.10 compliance documentation, and no HVHZ-certified products for Florida. For a luxury hospitality project where whisper-quiet operation is the primary spec criterion, they're worth evaluating. For an institutional multi-site portfolio, a healthcare system, or any project with Florida exterior openings, the compliance and service infrastructure gaps are decisive. ASSA ABLOY offers the same precision engineering quality at scale, with the US infrastructure to support it.",
    winSignals: [
      "Multi-site portfolio requiring consistent service and compliance documentation",
      "FL HVHZ exterior openings",
      "Healthcare, government, or FGI 2022 specification",
    ],
    loseSignals: [
      "Luxury single-site hospitality project where whisper-quiet operation is the only decision criterion",
      "Owner is an OEM partner or technology-first buyer who values Nabtesco's precision engineering heritage",
    ],
    keyMetrics: [
      "A156.10-2024 compliance documentation: ASSA ABLOY comprehensive vs. Nabtesco limited",
      "US AAADM coverage: 50 states (ASSA ABLOY) vs. OEM model (Nabtesco/AGD)",
      "Product portfolio breadth: 15+ door types (ASSA ABLOY) vs. sliding only (Nabtesco US)",
    ],
  },

  // ════════════════════════════════════════════════════════════════════════════
  // FAAC GROUP CARDS
  // ════════════════════════════════════════════════════════════════════════════

  // ── faac_group × customer_pitch ───────────────────────────────────────────────
  {
    competitor: "faac_group",
    context: "customer_pitch",
    headline: "FAAC knows gates and barriers. ASSA ABLOY knows every opening in the building.",
    winThemes: [
      {
        title: "FAAC A952 is a market entrant — no US install base or service history",
        detail: "FAAC launched the A952 automatic swing door system in May 2025. There are no significant US commercial installations, no US AAADM-certified service history, and no FGI or HVHZ compliance documentation. ASSA ABLOY has decades of US automatic door deployment, full ANSI/BHMA compliance documentation, and AAADM-certified service nationally.",
        proof: "FAAC A952 launch May 2025; ASSA ABLOY SW series: decades of US commercial deployment",
      },
      {
        title: "FAAC's portfolio stops at the perimeter — ours covers every opening",
        detail: "FAAC's strength is gate automation, barriers, and parking access control. The A952 is their entry ticket into building automatic doors. ASSA ABLOY covers automatic sliding, swing, folding, revolving, hermetic healthcare, and high-capacity transit doors — every opening from the perimeter to the OR. FAAC's opening is the parking gate; ours is the whole building.",
      },
      {
        title: "AAADM service and annual inspection compliance",
        detail: "A156.10 requires annual inspection by AAADM-certified technicians. FAAC's A952 is an EN 16005 product from Italy — their US AAADM-certified service network does not exist in any meaningful form. For an owner with AAADM compliance obligations, FAAC cannot satisfy them.",
        proof: "A156.10 §12 — annual inspection by AAADM-certified technician required",
      },
    ],
    differentiators: [
      { dimension: "US Install Base", ours: "Decades of commercial deployment across all verticals", theirs: "A952 launched May 2025 — near-zero US installations", advantage: "strong" },
      { dimension: "AAADM Compliance", ours: "AAADM-certified national service network", theirs: "No US AAADM-certified service infrastructure", advantage: "strong" },
      { dimension: "A156.10 Test Documentation", ours: "Full ANSI test documentation; 2024 edition", theirs: "EN 16005 — verify ANSI documentation availability", advantage: "strong" },
      { dimension: "Product Breadth", ours: "Full opening solution: sliding, swing, revolving, healthcare, hermetic", theirs: "A952 swing only — cannot cover sliding, revolving, or healthcare", advantage: "strong" },
      { dimension: "FL HVHZ Certification", ours: "NOA-certified exterior products", theirs: "No HVHZ certification", advantage: "strong" },
      { dimension: "Perimeter Access Control Integration", ours: "ABLOY/OSDP v2 enterprise access control", theirs: "Strong gate + barrier access control; A952 swing door integration may be channel-bundled", advantage: "neutral" },
    ],
    objectionHandlers: [
      {
        objection: "FAAC already handles our gates and barriers — one more vendor to manage the swing door.",
        response: "FAAC's gate and barrier work is solid — that's their home turf. The A952 swing door is a brand new product with no US install base and no AAADM-certified service network. Adding a new unproven automatic door product to your facility doesn't simplify vendor management — it adds risk. And FAAC's A952 can't cover your sliding doors, revolving, or healthcare openings anyway.",
      },
      {
        objection: "FAAC's A952 is EN 16005 compliant — that meets international standards.",
        response: "EN 16005 is the European standard. For US commercial construction, the specification is ANSI/BHMA A156.10. Request FAAC's A156.10 test documentation — as a May 2025 product, it's not clear that full ANSI testing is complete. Our SW series has comprehensive A156.10-2024 test documentation available today.",
      },
      {
        objection: "FAAC is less expensive for this swing door project.",
        response: "New market entrants are typically priced aggressively to win reference projects. The question is what you're buying: a market entry price or a long-term service partner with AAADM certification and compliance documentation. What's the A156.10 annual inspection plan for an A952 installation?",
      },
    ],
    landmines: [
      { topic: "FAAC channel bundling with gate automation", risk: "If FAAC already has the parking/gate contract, they may bundle A952 into the proposal", mitigation: "Separate the evaluation: gate automation is one decision; building automatic doors are another. Compliance requirements (AAADM, A156.10) don't apply to gates but do to automatic doors." },
    ],
    closingMove: "Ask for FAAC's A156.10-2024 test documentation and AAADM service network reference for this region. Then compare to our submittal package.",
    talkTrack: "FAAC knows gates and barriers — they've been doing that well since 1965. The A952 swing door, launched in May 2025, is their entry ticket into building automatic doors. There's no US install base, no AAADM-certified service history, and the A156.10 test documentation for a May 2025 product launch is not fully established. ASSA ABLOY has been in the US automatic door market for decades. Our SW series has full A156.10-2024 compliance documentation, AAADM-certified service nationally, and is backed by the broadest automatic door portfolio in the industry — from the perimeter swing door to the OR hermetic sliding door. FAAC's opening is the parking gate. Our opening is every door in the building.",
    winSignals: [
      "Project has AAADM compliance obligations or A156.10 annual inspection requirements",
      "Project scope extends beyond swing doors to sliding, revolving, or healthcare doors",
      "Owner has FL exterior openings requiring HVHZ certification",
    ],
    loseSignals: [
      "Project is a simple swing door retrofit at a facility where FAAC already manages perimeter access",
      "Owner prioritizes single-vendor simplicity and values FAAC's existing gate relationship over compliance depth",
    ],
    keyMetrics: [
      "FAAC A952 US install base: near-zero (May 2025 launch) vs. ASSA ABLOY SW series: decades of US deployment",
      "A156.10-2024 compliance documentation: request from both vendors; compare completeness",
      "AAADM certification: ASSA ABLOY national vs. FAAC Group none in US",
    ],
  },
];
// LOOKUP HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getCard(
  competitor: CompetitorId,
  context: ContextId
): BattleCard | undefined {
  return CARDS.find((c) => c.competitor === competitor && c.context === context);
}

export function getAvailableContexts(competitor: CompetitorId): ContextId[] {
  return CARDS.filter((c) => c.competitor === competitor).map((c) => c.context);
}

export function getAllCompetitors(): CompetitorProfile[] {
  return Object.values(COMPETITORS);
}

export const COMPETITOR_ORDER: CompetitorId[] = [
  "dormakaba",
  "stanley",
  "horton",
  "boon_edam",
  "geze",
  "tormax",
  "nabtesco",
  "faac_group",
];

export const CONTEXT_ORDER: ContextId[] = [
  "customer_pitch",
  "procurement",
  "engineering",
  "pm_interview",
  "distributor",
  "florida_hvhz",
  "healthcare",
  "iot_smart_building",
  "revolving_door",
  "iot_comparison",
];
