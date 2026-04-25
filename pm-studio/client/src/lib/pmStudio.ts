// PM Studio 3.0 — Data Library
// Scope: ASSA ABLOY Entrance Systems + RECORD (acquired, engineer on-site)
// Segment: Pedestrian Automatic Doors | Geography: North America — US (50 states + DC) + Canada (excl. Mexico)
// Framework: Cooper Stage-Gate (G0–G5), Full NPD Handoff Suite, VOC, Capacity, State Market Data

// ─── Types ───────────────────────────────────────────────────────────────────

export type RoadmapStatus = "concept" | "development" | "testing" | "launch" | "sustain" | "eol";
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type GateStage =
  | "G0_idea"
  | "G1_scoping"
  | "G2_business_case"
  | "G3_development"
  | "G4_testing"
  | "G5_launch"
  | "sustain"
  | "eol";

export type Brand = "ASSA ABLOY" | "RECORD";
export type ProductCategory = "sliding" | "swing" | "revolving" | "folding" | "platform" | "sensor" | "software" | "regulatory" | "security_flow";
export type NARegion = "Northeast" | "Southeast" | "Midwest" | "Southwest" | "West" | "Canada" | "National";
export type Vertical = "Healthcare" | "Retail" | "Airport/Transit" | "Education" | "Hospitality" | "Multi-Family" | "Office/Commercial" | "Government";
export type HandoffType =
  | "concept_to_engineering"
  | "engineering_to_manufacturing"
  | "pm_to_marketing"
  | "pm_to_sales"
  | "manufacturing_to_qa"
  | "qa_to_launch"
  | "launch_to_sustain";

// ─── New 3.0 Interfaces ───────────────────────────────────────────────────────

export interface Comment {
  id: string;
  author: string;
  role: string;
  avatar: string; // initials, e.g. "JT"
  body: string;
  timestamp: string;
  mentions: string[]; // @mentioned names
  reactions: { emoji: string; count: number; users: string[] }[];
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  color: string; // tailwind color class
}

export interface StateMarketData {
  stateCode: string;
  stateName: string;
  region: "Northeast" | "Southeast" | "Midwest" | "Southwest" | "West" | "Canada";
  hvhzCounties: string[];
  primaryBuildingCode: string;
  adoptionStatus: "adopted" | "amended" | "pending" | "state_specific";
  keyVerticals: Vertical[];
  marketOpportunity: "low" | "medium" | "high" | "critical";
  annualConstructionBillions: number;
  aaDistributorCount: number;
  keyProjects: string[];
  complianceNotes: string;
}

// ─── Enhanced RoadmapItem (3.0) ───────────────────────────────────────────────

export interface RoadmapItem {
  id: string;
  productLine: string;
  brand: Brand;
  category: ProductCategory;
  initiative: string;
  description: string;
  status: RoadmapStatus;
  year: number;
  quarter: Quarter;
  gateStage: GateStage;
  owner: string;
  tags: string[];
  linkedStandards?: string[];
  linkedCompetitorSignal?: string; // kept for intelligence cross-ref only, not a competitor roadmap item
  effort: "S" | "M" | "L" | "XL";
  impact: "low" | "medium" | "high" | "critical";
  region: NARegion;
  verticals: Vertical[];
  budget?: number; // $k
  notes?: string;
  risks?: string;
  kpis?: string[];
  // ── 3.0 additions ──
  comments: Comment[];
  linkedTasks: string[]; // IDs of other roadmap items this depends on / is linked to
  assignees: string[];
  priority: "p0" | "p1" | "p2" | "p3";
  completionPct: number; // 0–100
  stateScope: string[]; // state codes where this applies; [] = all
}

export interface GateCriterion {
  id: string;
  gate: GateStage;
  category: "technical" | "financial" | "market" | "regulatory" | "manufacturing" | "go_no_go";
  criterion: string;
  description: string;
  responsible: string;
  required: boolean;
}

export interface HandoffTemplate {
  type: HandoffType;
  from: string;
  to: string;
  title: string;
  purpose: string;
  fields: HandoffField[];
  checklist: string[];
}

export interface HandoffField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect" | "date" | "number";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface VOCEntry {
  id: string;
  date: string;
  source: "distributor" | "architect" | "end_user" | "field_tech" | "sales" | "installer";
  contact: string;
  company?: string;
  vertical: Vertical;
  region: NARegion;
  productLine?: string;
  type: "pain_point" | "feature_request" | "competitive_intelligence" | "compliance_concern" | "pricing_feedback";
  quote: string;
  insight: string;
  priority: "low" | "medium" | "high" | "critical";
  linkedInitiative?: string;
  actionable: boolean;
  tags: string[];
}

export interface ResourceEntry {
  id: string;
  name: string;
  department: "Engineering" | "UX/Design" | "QA/Regulatory" | "Marketing" | "Sales Enablement" | "Manufacturing" | "PM";
  role: string;
  capacity: number; // % available this sprint
  allocations: { initiativeId: string; label: string; percent: number }[];
}

export interface MarketVerticalData {
  vertical: Vertical;
  tamMillions: number;
  aaSharePercent: number;
  recordSharePercent: number;
  growthRate: number; // YoY %
  topDriver: string;
  topRisk: string;
  keyAccounts: string[];
}

// ─── Team Members ─────────────────────────────────────────────────────────────

export const teamMembers: TeamMember[] = [
  {
    id: "tm-001",
    name: "J. Tubbs",
    initials: "JT",
    role: "Product Manager, Pedestrian Sliding",
    department: "PM",
    color: "teal",
  },
  {
    id: "tm-002",
    name: "A. Chen",
    initials: "AC",
    role: "Product Manager, Platform & IoT",
    department: "PM",
    color: "indigo",
  },
  {
    id: "tm-003",
    name: "S. Patel",
    initials: "SP",
    role: "Principal Engineer, Sliding Operators",
    department: "Engineering",
    color: "blue",
  },
  {
    id: "tm-004",
    name: "M. Rivera",
    initials: "MR",
    role: "Regulatory Affairs Manager",
    department: "QA/Regulatory",
    color: "amber",
  },
  {
    id: "tm-005",
    name: "T. Williams",
    initials: "TW",
    role: "Mechanical Engineer, Swing Operators",
    department: "Engineering",
    color: "violet",
  },
  {
    id: "tm-006",
    name: "B. Kim",
    initials: "BK",
    role: "Software / Firmware Engineer",
    department: "Engineering",
    color: "sky",
  },
  {
    id: "tm-007",
    name: "D. Torres",
    initials: "DT",
    role: "Product Marketing Manager",
    department: "Marketing",
    color: "rose",
  },
  {
    id: "tm-008",
    name: "RECORD Eng",
    initials: "RE",
    role: "RECORD Systems Engineer (on-site)",
    department: "Engineering",
    color: "purple",
  },
];

// ─── Roadmap Data — ASSA ABLOY + RECORD, NA, Pedestrian ──────────────────────

export const roadmapItems: RoadmapItem[] = [
  // ── ASSA ABLOY ─────────────────────────────────────────────────────────────
  {
    id: "rm-001",
    productLine: "SW300",
    brand: "ASSA ABLOY",
    category: "swing",
    initiative: "SW300-S Bluetooth App Configuration",
    description:
      "Replace DIP-switch setup with iOS/Android companion app for SW300-S low-energy swing operator. Reduces install time by ~40 min, eliminates mis-configuration callbacks. BLE-based; requires firmware 3.2+ and updated master carton labeling.",
    status: "development",
    year: 2025,
    quarter: "Q3",
    gateStage: "G3_development",
    owner: "J. Tubbs",
    tags: ["software", "hardware", "ble", "app"],
    linkedStandards: ["ANSI/BHMA A156.19-2023"],
    linkedCompetitorSignal: "dormakaba KTV digital configurator (ISC West 2024)",
    effort: "L",
    impact: "high",
    region: "National",
    verticals: ["Healthcare", "Office/Commercial", "Education"],
    budget: 420,
    notes: "App UX approved Q1 2025. iOS TestFlight beta closed. Android build in sprint 14.",
    risks: "BLE interference in high-density EMF environments (hospitals); add EMC testing to G4.",
    kpis: ["Install time < 12 min", "Callback rate < 0.5%", "App Store rating ≥ 4.2"],
    // 3.0 fields
    priority: "p1",
    completionPct: 65,
    assignees: ["J. Tubbs", "B. Kim", "D. Torres"],
    linkedTasks: ["rm-013"],
    stateScope: [],
    comments: [
      {
        id: "c-001-01",
        author: "B. Kim",
        role: "Software / Firmware Engineer",
        avatar: "BK",
        body: "Android build sprint 14 is complete — pushed to internal TestFlight equivalent. BLE pairing latency is averaging 1.8 sec, well under the 3-sec UX threshold. One edge case on Android 12 with Bluetooth permissions dialog; @J. Tubbs can we get QA to repro before we close sprint?",
        timestamp: "2025-04-02T09:14:00Z",
        mentions: ["J. Tubbs"],
        reactions: [{ emoji: "👍", count: 3, users: ["J. Tubbs", "D. Torres", "S. Patel"] }],
      },
      {
        id: "c-001-02",
        author: "J. Tubbs",
        role: "Product Manager, Pedestrian Sliding",
        avatar: "JT",
        body: "Good catch @B. Kim — I'll get M. Rivera's QA team on the Android 12 repro today. Also flagging: the EMC testing slot at Intertek is booked for May 6. We need firmware freeze by April 28 or we miss the window. That would push G4 entry to Q3.",
        timestamp: "2025-04-02T11:30:00Z",
        mentions: ["B. Kim"],
        reactions: [
          { emoji: "✅", count: 2, users: ["B. Kim", "M. Rivera"] },
          { emoji: "🔥", count: 1, users: ["D. Torres"] },
        ],
      },
      {
        id: "c-001-03",
        author: "D. Torres",
        role: "Product Marketing Manager",
        avatar: "DT",
        body: "Distribution collateral is ready pending firmware freeze. I've pre-briefed 4 key distributors — appetite is strong. One asked if we'd support NFC tap-to-configure as a future rev. Logging as VOC. @J. Tubbs should we note this as a sustain enhancement?",
        timestamp: "2025-04-03T08:45:00Z",
        mentions: ["J. Tubbs"],
        reactions: [{ emoji: "👍", count: 2, users: ["J. Tubbs", "B. Kim"] }],
      },
    ],
  },
  {
    id: "rm-002",
    productLine: "ecoLOGIC",
    brand: "ASSA ABLOY",
    category: "software",
    initiative: "ecoLOGIC AI Energy Optimization — NA Rollout",
    description:
      "OTA firmware update delivering AI-driven energy management to all US/Canada installed base (~14,000 units). Leverages occupancy sensor data to reduce HVAC leakage at door threshold. Pilot in 3 healthcare campuses: 18% avg energy savings. FIPS 140-2 encryption validated.",
    status: "testing",
    year: 2025,
    quarter: "Q2",
    gateStage: "G4_testing",
    owner: "A. Chen",
    tags: ["software", "iot", "energy", "ota"],
    linkedStandards: ["ASHRAE 90.1-2022", "ANSI/BHMA A156.10-2024"],
    effort: "XL",
    impact: "critical",
    region: "National",
    verticals: ["Healthcare", "Office/Commercial", "Retail", "Airport/Transit"],
    budget: 1100,
    notes: "OTA infrastructure requires carrier-grade reliability. Rollout phased by install vintage.",
    risks: "OTA failure mid-update could brick field units; rollback mechanism required.",
    kpis: ["Energy savings ≥ 15%", "0 bricked units", "FIPS compliance confirmed"],
    priority: "p0",
    completionPct: 80,
    assignees: ["A. Chen", "B. Kim"],
    linkedTasks: ["rm-011", "rm-012"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-003",
    productLine: "SL500",
    brand: "ASSA ABLOY",
    category: "sliding",
    initiative: "SL521 HVHZ NOA Recertification — FBC 9th Ed.",
    description:
      "Recertify SL521 sliding operator for Florida HVHZ under FBC 9th Edition structural loads. TAS 203 cyclic wind pressure testing at 160 mph. Current NOA expires Q3 2025. Affects 43 active Florida projects.",
    status: "testing",
    year: 2025,
    quarter: "Q2",
    gateStage: "G4_testing",
    owner: "M. Rivera",
    tags: ["certification", "FL_hvhz", "hardware"],
    linkedStandards: ["FBC 9th Ed.", "TAS 203", "NOA", "ANSI/BHMA A156.10-2024"],
    effort: "M",
    impact: "critical",
    region: "Southeast",
    verticals: ["Healthcare", "Retail", "Office/Commercial", "Government"],
    budget: 280,
    notes: "Lab scheduled at Architectural Testing Inc., York PA. Miami-Dade product approval required.",
    risks: "Lab schedule slippage delays NOA by 60+ days; 43 FL projects at risk.",
    kpis: ["NOA issued before Q3 expiry", "0 spec defections", "Miami-Dade approval in hand"],
    priority: "p0",
    completionPct: 75,
    assignees: ["M. Rivera", "S. Patel"],
    linkedTasks: ["rm-008", "rm-009"],
    stateScope: ["FL"],
    comments: [
      {
        id: "c-003-01",
        author: "M. Rivera",
        role: "Regulatory Affairs Manager",
        avatar: "MR",
        body: "Lab confirmed our slot at ATI York PA for April 14–16. Pre-test submission package sent Friday. @S. Patel can you confirm the gasket spec change from Rev D to Rev E is reflected in the test sample? Miami-Dade will ask for production-representative samples.",
        timestamp: "2025-04-07T10:22:00Z",
        mentions: ["S. Patel"],
        reactions: [{ emoji: "✅", count: 2, users: ["S. Patel", "J. Tubbs"] }],
      },
      {
        id: "c-003-02",
        author: "S. Patel",
        role: "Principal Engineer, Sliding Operators",
        avatar: "SP",
        body: "Confirmed — Rev E gasket is in the test samples shipped Monday. FYI the seal compression spec was tightened 0.3mm per the FEA analysis. @M. Rivera this should actually help us on the cyclic DP numbers. One risk: the perimeter sealant cure time is 72 hrs — samples need to sit until April 17 before testing begins.",
        timestamp: "2025-04-07T14:05:00Z",
        mentions: ["M. Rivera"],
        reactions: [{ emoji: "👍", count: 3, users: ["M. Rivera", "J. Tubbs", "RECORD Eng"] }],
      },
      {
        id: "c-003-03",
        author: "J. Tubbs",
        role: "Product Manager, Pedestrian Sliding",
        avatar: "JT",
        body: "Good news — just got word from the FL Sales team that one of the 43 at-risk projects (Aventura Medical Pavilion) has extended their bid hold to June 15. That buys us a little buffer. @M. Rivera let's do a 5-min daily standup during the test week so we can escalate fast if anything fails.",
        timestamp: "2025-04-08T08:55:00Z",
        mentions: ["M. Rivera"],
        reactions: [
          { emoji: "🔥", count: 1, users: ["M. Rivera"] },
          { emoji: "👍", count: 2, users: ["S. Patel", "D. Torres"] },
        ],
      },
    ],
  },
  {
    id: "rm-004",
    productLine: "VersaMax",
    brand: "ASSA ABLOY",
    category: "sliding",
    initiative: "VersaMax FGI 2022 Healthcare Compliance",
    description:
      "Update VersaMax high-traffic sliding operator door timing and force parameters to meet FGI 2022 Guidelines for hospital vestibule applications. Hospital segment = 31% of VersaMax revenue. Non-compliance risks spec loss on all hospital projects.",
    status: "development",
    year: 2025,
    quarter: "Q3",
    gateStage: "G3_development",
    owner: "S. Patel",
    tags: ["hardware", "certification", "healthcare"],
    linkedStandards: ["FGI 2022", "ANSI/BHMA A156.10-2024", "ADA 2010 Standards"],
    effort: "M",
    impact: "high",
    region: "National",
    verticals: ["Healthcare"],
    budget: 340,
    notes: "3 hospital system GCs on hold pending compliance confirmation.",
    risks: "FGI interpretation ambiguity on vestibule timing — engage FGI technical committee.",
    kpis: ["FGI compliance confirmed by accredited lab", "No spec losses in H2 2025"],
    priority: "p1",
    completionPct: 50,
    assignees: ["S. Patel", "M. Rivera"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-005",
    productLine: "SL500",
    brand: "ASSA ABLOY",
    category: "sliding",
    initiative: "SL500 A156.10-2024 Recertification — Full Family",
    description:
      "Full recertification of SL500 product family (SL510, SL515, SL521) to ANSI/BHMA A156.10-2024. Includes revised 2M cycle test, updated safety sensor validation, and updated installer declaration of conformity. Current certs reference 2022 edition.",
    status: "concept",
    year: 2025,
    quarter: "Q4",
    gateStage: "G1_scoping",
    owner: "J. Tubbs",
    tags: ["certification", "hardware"],
    linkedStandards: ["ANSI/BHMA A156.10-2024"],
    effort: "L",
    impact: "high",
    region: "National",
    verticals: ["Healthcare", "Retail", "Airport/Transit", "Office/Commercial"],
    budget: 520,
    notes: "BHMA lab queue currently 14 weeks out. Schedule immediately to avoid 2026 slip.",
    risks: "Cycle test failures require hardware mods — budget and timeline impact TBD.",
    kpis: ["All 3 SKUs certified by Q1 2026", "No distributor NOC complaints"],
    priority: "p1",
    completionPct: 10,
    assignees: ["J. Tubbs", "M. Rivera"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-006",
    productLine: "SL500",
    brand: "ASSA ABLOY",
    category: "sliding",
    initiative: "SL500 XL Heavy-Duty Variant (700 lb)",
    description:
      "New SL500 XL variant with 700 lb door panel capacity. Competitive response to industry movement toward heavier all-glass panels in airport and transit applications. Targets airport terminal, convention center, and data center sectors. NA-only initial launch.",
    status: "concept",
    year: 2025,
    quarter: "Q4",
    gateStage: "G1_scoping",
    owner: "J. Tubbs",
    tags: ["hardware"],
    linkedCompetitorSignal: "Industry trend toward heavy-duty operators (700+ lb) for large glass panels",
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Airport/Transit", "Office/Commercial", "Government"],
    budget: 1800,
    notes: "Market research: airports = 8% of sliding operator volume, 22% of revenue. Strong margin profile.",
    risks: "Motor/gearbox redesign required. ANSI/BHMA A156.10-2024 entrapment recertification needed.",
    kpis: ["First article by Q3 2026", "≥ 3 airport LOIs before G2"],
    priority: "p2",
    completionPct: 5,
    assignees: ["J. Tubbs", "S. Patel"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-007",
    productLine: "SW300",
    brand: "ASSA ABLOY",
    category: "swing",
    initiative: "SW300 Slim-Profile Retrofit Header (45mm)",
    description:
      "Redesigned SW300 header reducing mounting depth to 45mm for retrofit markets where existing header clearance is constrained — a growing pain in commercial renovation projects. VOC from 12 distributor interviews confirms retrofit barrier as #1 reason for operator substitution.",
    status: "concept",
    year: 2026,
    quarter: "Q1",
    gateStage: "G0_idea",
    owner: "T. Williams",
    tags: ["hardware", "retrofit"],
    linkedCompetitorSignal: "Industry demand for slimmer headers in retrofit applications",
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Office/Commercial", "Retail", "Healthcare", "Education"],
    budget: 2100,
    notes: "12 distributor VOC interviews completed. Top ask: slim header for retrofit jobs.",
    risks: "Motor miniaturization may reduce torque. Requires structural FEA validation.",
    kpis: ["Header depth ≤ 45mm", "Full torque spec maintained", "Retrofit win rate +12%"],
    priority: "p2",
    completionPct: 0,
    assignees: ["T. Williams", "J. Tubbs"],
    linkedTasks: [],
    stateScope: [],
    comments: [
      {
        id: "c-007-01",
        author: "T. Williams",
        role: "Mechanical Engineer, Swing Operators",
        avatar: "TW",
        body: "Ran preliminary FEA on a 45mm housing with the existing EC motor topology. We can maintain ~95% of rated torque if we accept a 12% longer hold-open arm. @J. Tubbs — that may be a spec issue for installers. Need your call on whether the arm length change is a showstopper before I go deeper.",
        timestamp: "2025-04-10T15:30:00Z",
        mentions: ["J. Tubbs"],
        reactions: [{ emoji: "👍", count: 2, users: ["J. Tubbs", "S. Patel"] }],
      },
      {
        id: "c-007-02",
        author: "J. Tubbs",
        role: "Product Manager, Pedestrian Sliding",
        avatar: "JT",
        body: "12% longer arm is borderline — the VOC data shows retrofit jobs fail spec when arm length conflicts with door stop clearance. @T. Williams can we explore a parallel arm geometry instead of standard geometry? Installers in Northeast said parallel arm is less sensitive to header offset.",
        timestamp: "2025-04-10T17:00:00Z",
        mentions: ["T. Williams"],
        reactions: [{ emoji: "🔥", count: 2, users: ["T. Williams", "RECORD Eng"] }],
      },
      {
        id: "c-007-03",
        author: "RECORD Eng",
        role: "RECORD Systems Engineer (on-site)",
        avatar: "RE",
        body: "Worth looking at what RECORD uses for the TSA 20 NA adaptation — we solved a similar depth constraint with a distributed capacitor bank that allows the motor frame to be 8mm shallower. @T. Williams I can share the CAD if helpful. The co-engineering protocol covers this kind of cross-pollination.",
        timestamp: "2025-04-11T09:10:00Z",
        mentions: ["T. Williams"],
        reactions: [{ emoji: "✅", count: 3, users: ["T. Williams", "J. Tubbs", "S. Patel"] }],
      },
    ],
  },
  {
    id: "rm-008",
    productLine: "Regulatory",
    brand: "ASSA ABLOY",
    category: "regulatory",
    initiative: "FBC 9th Ed. TAS 203 — Full Exterior Line Audit",
    description:
      "Systematic audit of all NA exterior automatic door products for FBC 9th Edition compliance. Map NOA expiration dates, prioritize re-testing queue, schedule lab time for 2025–2026. Affected: SL500, SL521, RD-series, VersaMax exterior. Legal exposure if any NOA lapses.",
    status: "development",
    year: 2025,
    quarter: "Q1",
    gateStage: "G2_business_case",
    owner: "M. Rivera",
    tags: ["certification", "FL_hvhz", "regulatory"],
    linkedStandards: ["FBC 9th Ed.", "TAS 203", "NOA"],
    effort: "L",
    impact: "critical",
    region: "Southeast",
    verticals: ["Healthcare", "Retail", "Office/Commercial", "Government", "Hospitality"],
    budget: 180,
    notes: "NOA tracker spreadsheet active. 4 products expire within 18 months.",
    risks: "Concurrent lab bookings create scheduling conflicts. May need two testing windows.",
    kpis: ["100% products mapped", "No lapsed NOAs", "Testing queue locked by Q2 2025"],
    priority: "p0",
    completionPct: 60,
    assignees: ["M. Rivera"],
    linkedTasks: [],
    stateScope: ["FL"],
    comments: [],
  },
  {
    id: "rm-009",
    productLine: "RD Series",
    brand: "ASSA ABLOY",
    category: "revolving",
    initiative: "RD100 HVHZ Re-Testing — 160 mph",
    description:
      "TAS 203 cyclic wind pressure re-testing for RD100 three-wing revolving door at 160 mph under FBC 9th Edition. NOA expires August 2025. Affects 43 active Florida projects specifying RD100.",
    status: "testing",
    year: 2025,
    quarter: "Q2",
    gateStage: "G4_testing",
    owner: "M. Rivera",
    tags: ["certification", "FL_hvhz", "hardware"],
    linkedStandards: ["FBC 9th Ed.", "TAS 203", "NOA"],
    effort: "M",
    impact: "critical",
    region: "Southeast",
    verticals: ["Hospitality", "Airport/Transit", "Office/Commercial"],
    budget: 210,
    notes: "Testing at Architectural Testing Inc., York PA. Miami-Dade PA required.",
    risks: "Test failure requires design mod — 90-day delay minimum.",
    kpis: ["Pass TAS 203 first attempt", "NOA issued July 2025"],
    priority: "p0",
    completionPct: 70,
    assignees: ["M. Rivera", "S. Patel"],
    linkedTasks: [],
    stateScope: ["FL"],
    comments: [],
  },
  {
    id: "rm-010",
    productLine: "Healthcare",
    brand: "ASSA ABLOY",
    category: "sliding",
    initiative: "Hermetic Sliding Door System — New Product Concept",
    description:
      "New product concept: hermetically-sealed automatic sliding door for sterile environments (ICU, OR, isolation rooms, pharmacy). Air leakage rate target: 0.04 CFM/sq ft @ 0.3 in. w.c. Addresses post-COVID healthcare construction boom. TAM estimate $280M. No current ASSA ABLOY product in category.",
    status: "concept",
    year: 2026,
    quarter: "Q2",
    gateStage: "G0_idea",
    owner: "A. Chen",
    tags: ["hardware", "sensor", "healthcare"],
    linkedStandards: ["FGI 2022", "ASHRAE 170-2021", "NFPA 101"],
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Healthcare"],
    budget: 3500,
    notes: "TAM: $280M. No ASSA ABLOY product today. VOC: 7 hospital AOR interviews scheduled.",
    risks: "Long regulatory path (FGI + ASHRAE + NFPA). IP landscape unclear.",
    kpis: ["G1 gate by Q3 2025", "≥ 5 hospital LOIs", "Air leakage spec confirmed by AOR"],
    priority: "p2",
    completionPct: 5,
    assignees: ["A. Chen", "S. Patel"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-011",
    productLine: "ecoLOGIC",
    brand: "ASSA ABLOY",
    category: "platform",
    initiative: "IoT-Native Operator — ecoLOGIC Integrated Platform",
    description:
      "Next-gen automatic door operator with native IoT, ecoLOGIC energy management, and BMS integration (BACnet IP, Modbus TCP) built-in. Eliminates the current add-on module. Targets smart building mandates in LEED v5 and WELL Building Standard.",
    status: "concept",
    year: 2026,
    quarter: "Q3",
    gateStage: "G1_scoping",
    owner: "A. Chen",
    tags: ["hardware", "software", "iot", "bms"],
    linkedStandards: ["ANSI/BHMA A156.10-2024", "ASHRAE 90.1-2022", "BACnet ANSI/ASHRAE 135"],
    effort: "XL",
    impact: "critical",
    region: "National",
    verticals: ["Office/Commercial", "Healthcare", "Education", "Government"],
    budget: 4200,
    notes: "BACnet cert path ~18 months. Patent landscape review in progress. Strategic differentiator.",
    risks: "Chip supply chain volatility. BACnet IP certification lead time.",
    kpis: ["BACnet cert by Q2 2027", "LEED v5 points eligible", "Module eliminated — cost -$180/unit"],
    priority: "p1",
    completionPct: 15,
    assignees: ["A. Chen", "B. Kim"],
    linkedTasks: ["rm-002", "rm-012"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-012",
    productLine: "ecoLOGIC",
    brand: "ASSA ABLOY",
    category: "software",
    initiative: "Facility Manager Portal — ecoLOGIC Dashboard",
    description:
      "Web-based portal providing facility managers real-time energy dashboards, door cycle counts, predictive maintenance alerts, and API integration with Siemens Desigo CC and Johnson Controls Metasys BMS platforms.",
    status: "development",
    year: 2025,
    quarter: "Q3",
    gateStage: "G3_development",
    owner: "A. Chen",
    tags: ["software", "iot", "dashboard"],
    linkedStandards: ["BACnet ANSI/ASHRAE 135", "REST API"],
    effort: "L",
    impact: "high",
    region: "National",
    verticals: ["Healthcare", "Office/Commercial", "Airport/Transit"],
    budget: 760,
    notes: "Siemens partnership MOU signed. JCI API access granted. Beta with 3 accounts.",
    risks: "BMS vendor API changes can break integration on short notice.",
    kpis: ["API uptime ≥ 99.5%", "MTTR < 4 hrs", "NPS ≥ 45 from beta accounts"],
    priority: "p1",
    completionPct: 55,
    assignees: ["A. Chen", "B. Kim", "D. Torres"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-013",
    productLine: "SL500",
    brand: "ASSA ABLOY",
    category: "sliding",
    initiative: "SL500 Access Control Integration — ASSA ABLOY Ecosystem",
    description:
      "Native integration between SL500 operator and ASSA ABLOY Access Control portfolio (OSDP v2 protocol over RS-485). Enables unified access + door automation management from ASSA ABLOY CLIQ or third-party PACS. Eliminates field-wired adaptors.",
    status: "development",
    year: 2025,
    quarter: "Q4",
    gateStage: "G3_development",
    owner: "J. Tubbs",
    tags: ["software", "hardware", "access_control", "osdp"],
    linkedStandards: ["SIA OSDP v2.2", "ANSI/BHMA A156.10-2024"],
    effort: "L",
    impact: "high",
    region: "National",
    verticals: ["Government", "Healthcare", "Airport/Transit", "Education"],
    budget: 590,
    notes: "OSDP v2 implementation by firmware team. PACS interop test matrix: 8 platforms.",
    risks: "Third-party PACS vendors slow to certify. Maintain list of certified pairings.",
    kpis: ["OSDP v2 certified", "8 PACS platforms verified", "Install time -30 min vs. legacy"],
    priority: "p1",
    completionPct: 45,
    assignees: ["J. Tubbs", "B. Kim"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-014",
    productLine: "VersaMax",
    brand: "ASSA ABLOY",
    category: "sliding",
    initiative: "VersaMax Bi-Parting Retrofit Kit",
    description:
      "Field-installable bi-parting conversion kit for existing VersaMax single-slide installations. Targets retrofit market in grocery and retail. Est. 8,000 eligible units in field across NA. SKU: VX-BPK-01.",
    status: "launch",
    year: 2025,
    quarter: "Q1",
    gateStage: "G5_launch",
    owner: "S. Patel",
    tags: ["hardware", "retrofit"],
    linkedStandards: ["ANSI/BHMA A156.10-2024"],
    effort: "M",
    impact: "medium",
    region: "National",
    verticals: ["Retail"],
    budget: 210,
    notes: "Distributor pricing approved. Installation guide v2 published. 1,200 units sold in Q1.",
    kpis: ["8,000 eligible units contacted", "Attach rate ≥ 15%", "NPS ≥ 40"],
    priority: "p2",
    completionPct: 100,
    assignees: ["S. Patel", "D. Torres"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-015",
    productLine: "SW300",
    brand: "ASSA ABLOY",
    category: "swing",
    initiative: "SW300 Touchless Entry — Wave & Mobile Credential",
    description:
      "Dual-mode touchless activation for SW300: infrared wave sensor (hands-free) and mobile credential push notification via iOS/Android companion app. Targets post-COVID healthcare and high-footfall retail demand for hygienic entry.",
    status: "development",
    year: 2026,
    quarter: "Q1",
    gateStage: "G2_business_case",
    owner: "J. Tubbs",
    tags: ["hardware", "software", "sensor", "iot", "touchless"],
    linkedStandards: ["ANSI/BHMA A156.19-2023", "ADA 2010 Standards"],
    effort: "L",
    impact: "high",
    region: "National",
    verticals: ["Healthcare", "Retail", "Office/Commercial", "Multi-Family"],
    budget: 680,
    notes: "Business case approved Q4 2024. Mobile credential leverages ASSA ABLOY Seos platform.",
    risks: "Seos SDK licensing cost impact on unit margin.",
    kpis: ["Activation latency < 300ms", "False trigger rate < 0.01%", "ADA compliant confirmed"],
    priority: "p2",
    completionPct: 30,
    assignees: ["J. Tubbs", "B. Kim"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-016",
    productLine: "Multi-Family",
    brand: "ASSA ABLOY",
    category: "swing",
    initiative: "Multi-Family Package Entry System — NA Launch",
    description:
      "Integrated package delivery vestibule solution combining SW300 low-energy swing operator, video intercom, and cloud-based delivery management software. Addresses surge in package delivery volume at multi-family buildings. TAM: $140M NA.",
    status: "concept",
    year: 2026,
    quarter: "Q3",
    gateStage: "G1_scoping",
    owner: "T. Williams",
    tags: ["hardware", "software", "iot"],
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Multi-Family"],
    budget: 2800,
    notes: "VOC: 6 multifamily property managers interviewed. Top ask: carrier-agnostic delivery.",
    risks: "Carrier API fragmentation. Hardware BOM cost pressure.",
    kpis: ["LOIs from ≥ 3 REIT property managers before G2", "BOM target < $3,200/door"],
    priority: "p2",
    completionPct: 10,
    assignees: ["T. Williams", "A. Chen"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-017",
    productLine: "AAADM",
    brand: "ASSA ABLOY",
    category: "regulatory",
    initiative: "AAADM Inspector Certification Program — NA Technician Training",
    description:
      "Launch AAADM-accredited annual inspection certification program for ASSA ABLOY field technicians and distributor service partners across NA. Target: 750 certified technicians. LMS integration with distributor portal. Reduces liability exposure and drives service revenue.",
    status: "launch",
    year: 2025,
    quarter: "Q2",
    gateStage: "G5_launch",
    owner: "J. Tubbs",
    tags: ["certification", "training", "aaadm"],
    linkedStandards: ["AAADM Standards", "ANSI/BHMA A156.10-2024", "ANSI/BHMA A156.19-2023"],
    effort: "M",
    impact: "high",
    region: "National",
    verticals: ["Healthcare", "Retail", "Airport/Transit", "Education", "Government"],
    budget: 320,
    notes: "AAADM partnership signed Q1 2025. LMS vendor selected. 3 pilot training cohorts complete.",
    kpis: ["750 certified techs by EOY", "Inspection ticket volume +30%", "Service revenue +$2.1M"],
    priority: "p1",
    completionPct: 90,
    assignees: ["J. Tubbs", "D. Torres"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-018",
    productLine: "Canada",
    brand: "ASSA ABLOY",
    category: "regulatory",
    initiative: "NBC 2025 Compliance Review — Canada",
    description:
      "Review all ASSA ABLOY NA pedestrian door products against National Building Code of Canada 2025 (NBC 2025) accessibility and power-operated door provisions. Identify gaps, update declaration of conformity, and publish compliant product guide for Canadian distributor network.",
    status: "concept",
    year: 2026,
    quarter: "Q1",
    gateStage: "G1_scoping",
    owner: "M. Rivera",
    tags: ["certification", "regulatory", "canada"],
    linkedStandards: ["NBC 2025", "CSA B651-18", "ANSI/BHMA A156.10-2024"],
    effort: "M",
    impact: "medium",
    region: "Canada",
    verticals: ["Government", "Healthcare", "Office/Commercial"],
    budget: 190,
    notes: "Canadian market = 12% of NA revenue. NBC 2025 effective Jan 2026.",
    kpis: ["All products assessed by Q2 2026", "Compliant product guide published"],
    priority: "p2",
    completionPct: 5,
    assignees: ["M. Rivera"],
    linkedTasks: [],
    stateScope: ["CA_BC", "CA_ON", "CA_AB", "CA_QC"],
    comments: [],
  },

  // ── RECORD (ASSA ABLOY acquired) — Original Items ──────────────────────────
  {
    id: "rm-r01",
    productLine: "RECORD TSA 20",
    brand: "RECORD",
    category: "sliding",
    initiative: "RECORD TSA 20 NA Market Introduction",
    description:
      "Full market introduction of RECORD TSA 20 compact sliding operator for the NA pedestrian market. Product proven in Europe; requires ANSI/BHMA A156.10-2024 certification, NA voltage/wiring adaptation (120V/60Hz), and distributor channel onboarding. Targets retrofit and light-commercial applications.",
    status: "development",
    year: 2025,
    quarter: "Q3",
    gateStage: "G3_development",
    owner: "J. Tubbs",
    tags: ["hardware", "certification", "record", "na_adaptation"],
    linkedStandards: ["ANSI/BHMA A156.10-2024", "NEC Article 700"],
    effort: "XL",
    impact: "critical",
    region: "National",
    verticals: ["Retail", "Office/Commercial", "Multi-Family"],
    budget: 2200,
    notes: "RECORD engineer on-site at AA campus. A156.10 testing vendor selected. Wiring diagram in review.",
    risks: "A156.10 testing lead time 20 weeks. NA header depth expectations differ from EU spec.",
    kpis: ["ANSI/BHMA A156.10-2024 cert by Q1 2026", "Distributor PO ≥ 200 units", "NA BOM delta < 8% vs. EU"],
    priority: "p0",
    completionPct: 55,
    assignees: ["J. Tubbs", "RECORD Eng", "B. Kim"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [
      {
        id: "c-r01-01",
        author: "RECORD Eng",
        role: "RECORD Systems Engineer (on-site)",
        avatar: "RE",
        body: "Completed the NA voltage adaptation review. The EU 230V transformer topology can be swapped to a 120V/60Hz design with minimal PCB revision — mainly the EMI filter network and primary winding. @J. Tubbs the BOM delta looks like it'll land around 5–6%, well inside the 8% target. Shipping the red-line schematic now.",
        timestamp: "2025-04-04T11:00:00Z",
        mentions: ["J. Tubbs"],
        reactions: [{ emoji: "🔥", count: 3, users: ["J. Tubbs", "B. Kim", "S. Patel"] }],
      },
      {
        id: "c-r01-02",
        author: "J. Tubbs",
        role: "Product Manager, Pedestrian Sliding",
        avatar: "JT",
        body: "Great news on BOM delta. @B. Kim A156.10-2024 certification submission package needs the revised schematic. Can you incorporate RECORD Eng's changes and freeze the firmware at the same time? The lab slot is June 9 — we need the complete submission at least 3 weeks prior.",
        timestamp: "2025-04-04T14:30:00Z",
        mentions: ["B. Kim"],
        reactions: [{ emoji: "✅", count: 2, users: ["B. Kim", "RECORD Eng"] }],
      },
      {
        id: "c-r01-03",
        author: "B. Kim",
        role: "Software / Firmware Engineer",
        avatar: "BK",
        body: "On it. Firmware freeze is set for May 16. A156.10 certification submission package will be ready May 19 — that gives us a 3-week buffer to June 9. One flag: the certification listing for the EU version references EN 12978 safety sensors. @M. Rivera do we need to re-test sensors against A156.10 Annex C entrapment parameters, or can we reference the existing ANSI A156.10 sensor data?",
        timestamp: "2025-04-05T09:45:00Z",
        mentions: ["M. Rivera"],
        reactions: [{ emoji: "👍", count: 2, users: ["M. Rivera", "J. Tubbs"] }],
      },
    ],
  },
  {
    id: "rm-r02",
    productLine: "RECORD TSA 22",
    brand: "RECORD",
    category: "sliding",
    initiative: "RECORD TSA 22 A156.10-2024 Certification",
    description:
      "ANSI/BHMA A156.10-2024 certification for RECORD TSA 22 standard sliding operator. Positions TSA 22 as a premium ASSA ABLOY offering in mid-market sliding operator segment, competing on European engineering quality and feature depth.",
    status: "development",
    year: 2025,
    quarter: "Q4",
    gateStage: "G2_business_case",
    owner: "J. Tubbs",
    tags: ["certification", "hardware", "record"],
    linkedStandards: ["ANSI/BHMA A156.10-2024"],
    effort: "L",
    impact: "high",
    region: "National",
    verticals: ["Healthcare", "Retail", "Office/Commercial"],
    budget: 640,
    notes: "Business case: TSA 22 fills gap in $3,200–$4,500 price band between SL515 and VersaMax.",
    risks: "European sensor profile may not meet NA entrapment test with same parameters.",
    kpis: ["A156.10-2024 cert by Q2 2026", "Launch price ≤ $4,200 MSRP", "≥ 5 distributor stocking orders"],
    priority: "p1",
    completionPct: 25,
    assignees: ["J. Tubbs", "RECORD Eng", "M. Rivera"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r03",
    productLine: "RECORD TSA 320",
    brand: "RECORD",
    category: "sliding",
    initiative: "RECORD TSA 320 Heavy-Duty Healthcare Positioning",
    description:
      "Position RECORD TSA 320 heavy-duty sliding operator as ASSA ABLOY's premium healthcare sliding platform. Supports 770 lb door panels. A156.10-2024 certification path + FGI 2022 compliance validation. Addresses gap in heavy-duty hospital sliding segment.",
    status: "concept",
    year: 2026,
    quarter: "Q1",
    gateStage: "G1_scoping",
    owner: "A. Chen",
    tags: ["hardware", "certification", "record", "healthcare"],
    linkedStandards: ["ANSI/BHMA A156.10-2024", "FGI 2022"],
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Healthcare"],
    budget: 1900,
    notes: "RECORD TSA 320 supports 770 lb — already heavy-duty. Main work is NA cert and healthcare positioning.",
    risks: "FGI 2022 timing spec may require firmware tuning. RECORD engineer coordination required.",
    kpis: ["A156.10-2024 cert", "FGI 2022 compliance confirmed", "≥ 3 hospital system LOIs"],
    priority: "p2",
    completionPct: 10,
    assignees: ["A. Chen", "RECORD Eng"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r04",
    productLine: "RECORD INORA",
    brand: "RECORD",
    category: "sliding",
    initiative: "RECORD INORA Design-Forward Line — NA Luxury Commercial",
    description:
      "Introduce RECORD INORA design-forward minimalist sliding door system to NA luxury commercial and hospitality market. Frameless glass, concealed operator, 4K sensor — targets high-end hotel lobbies, luxury retail, corporate HQ. Pairs with ASSA ABLOY architectural hardware.",
    status: "concept",
    year: 2026,
    quarter: "Q2",
    gateStage: "G0_idea",
    owner: "T. Williams",
    tags: ["hardware", "design", "record", "luxury"],
    linkedStandards: ["ANSI/BHMA A156.10-2024"],
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Hospitality", "Office/Commercial", "Retail"],
    budget: 3100,
    notes: "INORA proven in EU luxury segment. NA AOR interviews underway. Frameless glass spec coordination needed.",
    risks: "NA glass certification path unclear. Custom header dimensions differ from AA standard.",
    kpis: ["AOR spec-in rate ≥ 60% in target segment", "MSRP ≥ $12,000 system", "≥ 4 flagship project wins Y1"],
    priority: "p2",
    completionPct: 5,
    assignees: ["T. Williams", "D. Torres", "RECORD Eng"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [
      {
        id: "c-r04-01",
        author: "D. Torres",
        role: "Product Marketing Manager",
        avatar: "DT",
        body: "Did a soft-touch intro call with HOK's hospitality studio in NYC — they've specified INORA on 2 European projects and are actively asking when it's available NA. They said they'd fast-track a spec if we can show them a physical sample. @T. Williams what's the earliest we could get a demo unit to NYC?",
        timestamp: "2025-04-01T16:00:00Z",
        mentions: ["T. Williams"],
        reactions: [{ emoji: "🔥", count: 2, users: ["T. Williams", "J. Tubbs"] }],
      },
      {
        id: "c-r04-02",
        author: "T. Williams",
        role: "Mechanical Engineer, Swing Operators",
        avatar: "TW",
        body: "The EU demo unit could be shipped from the RECORD facility in Switzerland with about 3 weeks lead time — but it's 230V and won't operate on NA power without a step-down transformer, which is awkward for a client demo. @RECORD Eng — is there a battery-operated demo mode or a 120V demo kit we can request from Eindhoven?",
        timestamp: "2025-04-02T10:15:00Z",
        mentions: ["RECORD Eng"],
        reactions: [{ emoji: "👍", count: 2, users: ["D. Torres", "J. Tubbs"] }],
      },
      {
        id: "c-r04-03",
        author: "RECORD Eng",
        role: "RECORD Systems Engineer (on-site)",
        avatar: "RE",
        body: "Yes — RECORD has a 'showroom mode' that runs on 24V DC with a lab power supply, fully operational at reduced panel weight. I'll request the demo kit from the Eindhoven applications team. Realistically 4-week lead time. @D. Torres should we target the NeoCon show in June for a first NA market appearance? That would be perfect timing.",
        timestamp: "2025-04-03T09:30:00Z",
        mentions: ["D. Torres"],
        reactions: [
          { emoji: "✅", count: 3, users: ["D. Torres", "T. Williams", "J. Tubbs"] },
          { emoji: "🔥", count: 2, users: ["J. Tubbs", "A. Chen"] },
        ],
      },
    ],
  },
  {
    id: "rm-r05",
    productLine: "RECORD",
    brand: "RECORD",
    category: "platform",
    initiative: "RECORD-ASSA ABLOY Co-Engineering Protocol — NA",
    description:
      "Establish formal co-engineering protocol between RECORD (Sweden) and ASSA ABLOY Entrance Systems (NA) for joint product adaptation. Covers shared CAD library, BOM harmonization, firmware co-development workflow, and on-site engineer exchange program. Foundation for all RECORD NA initiatives.",
    status: "development",
    year: 2025,
    quarter: "Q1",
    gateStage: "G3_development",
    owner: "J. Tubbs",
    tags: ["process", "record", "engineering"],
    effort: "M",
    impact: "critical",
    region: "National",
    verticals: ["Healthcare", "Retail", "Office/Commercial"],
    budget: 95,
    notes: "RECORD engineer embedded on-site. CAD library sync in progress. First protocol review Q3.",
    risks: "Time zone and language coordination. IP protection for shared firmware.",
    kpis: ["Protocol document v1.0 signed", "CAD library synced", "2 joint product adaptations underway"],
    priority: "p0",
    completionPct: 70,
    assignees: ["J. Tubbs", "RECORD Eng"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },

  // ── RECORD New Products (3.0 catalog additions) ───────────────────────────
  {
    id: "rm-r06",
    productLine: "RECORD Windcord 5400",
    brand: "RECORD",
    category: "sliding",
    initiative: "Windcord 5400 Hurricane-Rated Sliding — NA Launch",
    description:
      "RECORD Windcord 5400 hurricane-rated impact sliding door. Level D & E missile impact certified (HVHZ). DP ±70 psf bi-part, ±75 psf single. Bi-part sizes 120\"–192\", single 80\"–108\", max height 104\". ANSI/BHMA A156.10 certified. The only RECORD product rated for HVHZ without shutters. Target: FL/SE hurricane zones, coastal healthcare/hospitality.",
    status: "development",
    year: 2025,
    quarter: "Q4",
    gateStage: "G3_development",
    owner: "J. Tubbs",
    tags: ["hardware", "hurricane", "FL_hvhz", "record", "impact"],
    linkedStandards: ["ANSI/BHMA A156.10-2024", "FBC 9th Ed.", "TAS 203", "NOA"],
    effort: "XL",
    impact: "critical",
    region: "Southeast",
    verticals: ["Healthcare", "Hospitality", "Office/Commercial", "Retail"],
    budget: 2800,
    notes: "Only RECORD product rated HVHZ without shutters. Miami-Dade NOA path initiated. Level D/E missile cert in hand from EU testing.",
    risks: "Miami-Dade NOA process 6–9 months. Lab queue at ATI York PA backed up.",
    kpis: ["Miami-Dade NOA issued", "Windcord 5400 in 10+ FL specifications", "HVHZ spec win rate >30% in coastal FL"],
    priority: "p0",
    completionPct: 40,
    assignees: ["J. Tubbs", "RECORD Eng", "M. Rivera"],
    linkedTasks: ["rm-r05", "rm-008"],
    stateScope: ["FL"],
    comments: [],
  },
  {
    id: "rm-r07",
    productLine: "RECORD Windcord 5500",
    brand: "RECORD",
    category: "sliding",
    initiative: "Windcord 5500 Wind-Load Sliding — NA Introduction",
    description:
      "RECORD Windcord 5500 wind-load (non-impact) sliding door. Same dimensions as 5400 (bi-part 120\"–192\", single 80\"–108\"). Requires hurricane shutter for windborne debris regions. DP ±70/75 psf. Florida Product Approval. Lower cost than 5400. Target: high-wind but non-HVHZ coastal markets.",
    status: "concept",
    year: 2026,
    quarter: "Q1",
    gateStage: "G1_scoping",
    owner: "J. Tubbs",
    tags: ["hardware", "wind_load", "record", "coastal"],
    linkedStandards: ["ANSI/BHMA A156.10-2024", "FBC 9th Ed.", "Florida Product Approval"],
    effort: "L",
    impact: "high",
    region: "Southeast",
    verticals: ["Healthcare", "Hospitality", "Retail", "Office/Commercial"],
    budget: 890,
    notes: "Lower cost alternative to 5400 for non-HVHZ coastal zones. Shutter requirement limits scope vs. 5400.",
    risks: "Market education needed: shutter requirement may confuse specifiers vs. 5400.",
    kpis: ["Florida Product Approval obtained", "≥ 5 coastal project specifications", "Price positioned 15–20% below Windcord 5400"],
    priority: "p2",
    completionPct: 10,
    assignees: ["J. Tubbs", "RECORD Eng"],
    linkedTasks: ["rm-r06", "rm-r05"],
    stateScope: ["FL", "TX", "LA", "SC", "NC"],
    comments: [],
  },
  {
    id: "rm-r08",
    productLine: "RECORD 5100 Series",
    brand: "RECORD",
    category: "sliding",
    initiative: "RECORD 5100 Series — NA Standard Sliding Platform",
    description:
      "RECORD 5100 Series standard NA sliding door platform. Microprocessor belt-drive, lifetime track warranty. All ANSI configurations supported. ANSI/BHMA A156.10. Interior and exterior. The RECORD workhorse NA sliding product targeting retail, healthcare, and commercial.",
    status: "sustain",
    year: 2025,
    quarter: "Q1",
    gateStage: "sustain",
    owner: "J. Tubbs",
    tags: ["hardware", "record", "na_platform"],
    linkedStandards: ["ANSI/BHMA A156.10-2024"],
    effort: "S",
    impact: "high",
    region: "National",
    verticals: ["Healthcare", "Retail", "Office/Commercial"],
    budget: 50,
    notes: "Sustain phase. Lifetime track warranty is key differentiator. Annual AAADM compliance check on schedule.",
    risks: "Belt-drive maintenance cost vs. newer direct-drive platforms.",
    kpis: ["Field failure rate < 0.4%", "NPS ≥ 42", "Warranty claims flat YoY"],
    priority: "p3",
    completionPct: 100,
    assignees: ["J. Tubbs"],
    linkedTasks: [],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r09",
    productLine: "RECORD 4500 Slide-Fold",
    brand: "RECORD",
    category: "folding",
    initiative: "RECORD 4500 Slide-Fold — NA Channel Introduction",
    description:
      "RECORD 4500 Slide-Fold door system for narrow entrance applications. Surface or between-jamb mounting. Uses 5100 Series drive and control platform. Targets restaurants, hotels, hospitals, elder care, and office applications where standard sliding geometry is too wide.",
    status: "concept",
    year: 2026,
    quarter: "Q2",
    gateStage: "G1_scoping",
    owner: "J. Tubbs",
    tags: ["hardware", "record", "fold", "narrow_entrance"],
    linkedStandards: ["ANSI/BHMA A156.10-2024", "ADA 2010 Standards"],
    effort: "M",
    impact: "medium",
    region: "National",
    verticals: ["Hospitality", "Healthcare", "Office/Commercial"],
    budget: 450,
    notes: "Leverages proven 5100 drive/control. Narrow entrance niche — TAM ~$35M NA. Elder care + restaurant growing rapidly.",
    risks: "ADA compliance for slide-fold geometry requires specific approach angles — validate early.",
    kpis: ["ANSI/BHMA A156.10-2024 cert path confirmed", "≥ 3 architect LOIs in hospitality/healthcare", "Distributor stocking plan developed"],
    priority: "p3",
    completionPct: 5,
    assignees: ["J. Tubbs", "RECORD Eng"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r10",
    productLine: "RECORD TSA 20",
    brand: "RECORD",
    category: "sliding",
    initiative: "RECORD TSA 20 Telescopic Sliding — NA Certification",
    description:
      "RECORD TSA 20 telescopic sliding door, 2–4 leaf, opening up to 4000mm. System 20 platform. 90/130 kg leaf weights. Global platform adapted for NA. Targets large-opening applications: airport terminals, convention centers, transit hubs.",
    status: "concept",
    year: 2026,
    quarter: "Q3",
    gateStage: "G0_idea",
    owner: "J. Tubbs",
    tags: ["hardware", "record", "telescopic", "large_opening"],
    linkedStandards: ["ANSI/BHMA A156.10-2024"],
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Airport/Transit", "Government", "Office/Commercial"],
    budget: 2400,
    notes: "Global platform with proven EU track record. NA adaptation: 120V, A156.10 cert, sensor recal. Airport terminal TAM growing.",
    risks: "Large test aperture needed for A156.10 certification — limited lab availability. Long NA lead time.",
    kpis: ["ANSI/BHMA A156.10-2024 cert obtained", "≥ 2 airport specification wins", "G2 gate by Q1 2027"],
    priority: "p3",
    completionPct: 0,
    assignees: ["J. Tubbs", "RECORD Eng"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r11",
    productLine: "RECORD TSA 21",
    brand: "RECORD",
    category: "sliding",
    initiative: "RECORD TSA 21 Light-Medium Telescopic — NA Scoping",
    description:
      "RECORD TSA 21 light-to-medium telescopic sliding. Opening up to 2500mm/3000mm. 80 kg max leaf. System 20 platform. Targets mid-range commercial applications where standard bi-part sliding is insufficient but full TSA 22 heavy-duty is overspec.",
    status: "concept",
    year: 2026,
    quarter: "Q4",
    gateStage: "G0_idea",
    owner: "J. Tubbs",
    tags: ["hardware", "record", "telescopic"],
    linkedStandards: ["ANSI/BHMA A156.10-2024"],
    effort: "L",
    impact: "medium",
    region: "National",
    verticals: ["Healthcare", "Retail", "Office/Commercial"],
    budget: 1200,
    notes: "Bridges gap between standard bi-part sliding and heavy TSA 22. 80 kg leaf suitable for large glass panels.",
    risks: "Market sizing unclear — needs VOC with architects specifying mid-range telescopic.",
    kpis: ["Market sizing confirmed ≥ $25M NA", "G1 gate by Q2 2027"],
    priority: "p3",
    completionPct: 0,
    assignees: ["J. Tubbs"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r12",
    productLine: "RECORD TSA 22",
    brand: "RECORD",
    category: "sliding",
    initiative: "RECORD TSA 22 Heavy-Duty Telescopic — Special Applications",
    description:
      "RECORD TSA 22 heavy-duty telescopic sliding door. Up to 4000mm opening. 170 kg leaf weight. Special applications: industrial clean rooms, large healthcare facilities, data center access, convention centers. Highest capacity telescopic in RECORD portfolio.",
    status: "concept",
    year: 2027,
    quarter: "Q1",
    gateStage: "G0_idea",
    owner: "A. Chen",
    tags: ["hardware", "record", "telescopic", "heavy_duty"],
    linkedStandards: ["ANSI/BHMA A156.10-2024"],
    effort: "XL",
    impact: "medium",
    region: "National",
    verticals: ["Healthcare", "Government", "Airport/Transit"],
    budget: 2100,
    notes: "170 kg leaf capacity is category-leading. Niche but high-value applications. Long certification path.",
    risks: "Very long ANSI/BHMA A156.10-2024 cert path for this capacity class. Requires specialized lab fixtures.",
    kpis: ["Market study complete by Q2 2026", "G1 gate by Q3 2027"],
    priority: "p3",
    completionPct: 0,
    assignees: ["A. Chen", "RECORD Eng"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r13",
    productLine: "RECORD 6000 SimpleSwing LE",
    brand: "RECORD",
    category: "swing",
    initiative: "RECORD 6000 SimpleSwing LE — NA Channel Launch",
    description:
      "RECORD 6000 Series (SimpleSwing LE) low-energy interior swing operator. 175 lb max door. ANSI 156.19. 1/8 HP Eco-Pulse motor. Interior only. Complements ASSA ABLOY SW300 as the RECORD-branded entry in low-energy swing. Target: office, retail, light commercial.",
    status: "concept",
    year: 2026,
    quarter: "Q2",
    gateStage: "G1_scoping",
    owner: "T. Williams",
    tags: ["hardware", "record", "swing", "low_energy"],
    linkedStandards: ["ANSI/BHMA A156.19-2023", "ADA 2010 Standards"],
    effort: "M",
    impact: "medium",
    region: "National",
    verticals: ["Office/Commercial", "Retail", "Education"],
    budget: 480,
    notes: "Eco-Pulse motor differentiator. Positions RECORD brand in swing alongside AA SW300 without channel conflict.",
    risks: "Channel conflict with SW300 if not positioned carefully. Needs clear SKU boundary.",
    kpis: ["ANSI 156.19 cert by Q4 2026", "Distinct market position vs. SW300 confirmed", "≥ 50 distributor orders Y1"],
    priority: "p3",
    completionPct: 5,
    assignees: ["T. Williams", "J. Tubbs"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r14",
    productLine: "RECORD 8000/8100 Series",
    brand: "RECORD",
    category: "swing",
    initiative: "RECORD 8000/8100 Heavy-Duty Swing — NA Certification",
    description:
      "RECORD 8000/8100 Series heavy-duty interior/exterior swing operator. 400 lb max door. ANSI 156.10 and 156.19. 1/4 HP Eco-Pulse motor. Balanced door capable. 120° swing. -40°F to +140°F temperature range. Targets healthcare, government, and high-traffic commercial.",
    status: "concept",
    year: 2026,
    quarter: "Q3",
    gateStage: "G0_idea",
    owner: "T. Williams",
    tags: ["hardware", "record", "swing", "heavy_duty"],
    linkedStandards: ["ANSI/BHMA A156.10-2024", "ANSI/BHMA A156.19-2023", "ADA 2010 Standards"],
    effort: "L",
    impact: "high",
    region: "National",
    verticals: ["Healthcare", "Government", "Office/Commercial"],
    budget: 980,
    notes: "-40°F to +140°F range critical for Northern climate government and healthcare. Balanced door capability is differentiator.",
    risks: "Dual ANSI cert path (156.10 + 156.19) doubles lab cost and time.",
    kpis: ["Both ANSI certs obtained by Q2 2027", "≥ 3 government project specifications", "Price competitive vs. LCN/Norton range"],
    priority: "p2",
    completionPct: 0,
    assignees: ["T. Williams", "RECORD Eng"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r15",
    productLine: "RECORD FlipFlow Standard",
    brand: "RECORD",
    category: "security_flow",
    initiative: "FlipFlow Standard — NA Airport/Transit Introduction",
    description:
      "RECORD FlipFlow Standard one-way pedestrian flow control. Folding door + barrier system. Anti-backtrack sensor. Airport and transit exit lanes. High throughput. NA introduction targeting major hub airports and transit agencies.",
    status: "concept",
    year: 2026,
    quarter: "Q3",
    gateStage: "G1_scoping",
    owner: "A. Chen",
    tags: ["hardware", "record", "security_flow", "airport", "transit"],
    linkedStandards: ["ANSI/BHMA A156.10-2024", "TSA Security Directives"],
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Airport/Transit", "Government"],
    budget: 1600,
    notes: "Proven in EU airports. NA adaptation requires TSA compliance review and A156.10 certification. High-value niche.",
    risks: "TSA regulatory engagement required early. Long airport procurement cycles.",
    kpis: ["ANSI/BHMA A156.10-2024 cert obtained", "TSA compliance review complete", "≥ 2 airport authority LOIs"],
    priority: "p2",
    completionPct: 5,
    assignees: ["A. Chen", "RECORD Eng", "M. Rivera"],
    linkedTasks: ["rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r16",
    productLine: "RECORD FlipFlow Advanced",
    brand: "RECORD",
    category: "security_flow",
    initiative: "FlipFlow Advanced — Airport Security Zones NA",
    description:
      "RECORD FlipFlow Advanced anti-backtrack with kick-in/throw-in detection. 20x20x20mm minimum object detection. Airport security zones. Landside/airside separation. Targets TSA-mandated sterile area enforcement at US domestic terminals.",
    status: "concept",
    year: 2027,
    quarter: "Q1",
    gateStage: "G0_idea",
    owner: "A. Chen",
    tags: ["hardware", "record", "security_flow", "airport", "airside"],
    linkedStandards: ["TSA Security Directives SD-1542", "ANSI/BHMA A156.10-2024"],
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Airport/Transit", "Government"],
    budget: 2200,
    notes: "Advanced detection at 20x20x20mm — industry-leading. TSA ADA and FAA must both be satisfied.",
    risks: "TSA certification path undefined for automated door security. Long regulatory engagement.",
    kpis: ["TSA pilot approved at one hub airport", "G1 gate by Q2 2027"],
    priority: "p3",
    completionPct: 0,
    assignees: ["A. Chen", "RECORD Eng"],
    linkedTasks: ["rm-r15", "rm-r05"],
    stateScope: [],
    comments: [],
  },
  {
    id: "rm-r17",
    productLine: "RECORD FlipFlow Wide",
    brand: "RECORD",
    category: "security_flow",
    initiative: "FlipFlow Wide — Baggage/Customs ADA Egress NA",
    description:
      "RECORD FlipFlow Wide variant for wide exit lanes. Baggage reclaim and customs egress. ADA accessible. Targets international terminal customs halls and large baggage claim areas.",
    status: "concept",
    year: 2027,
    quarter: "Q2",
    gateStage: "G0_idea",
    owner: "A. Chen",
    tags: ["hardware", "record", "security_flow", "airport", "ada"],
    linkedStandards: ["ANSI/BHMA A156.10-2024", "ADA 2010 Standards", "TSA Security Directives"],
    effort: "L",
    impact: "medium",
    region: "National",
    verticals: ["Airport/Transit", "Government"],
    budget: 980,
    notes: "ADA accessible wide-lane variant. Natural follow-on to FlipFlow Standard after airport relationship established.",
    risks: "Depends on FlipFlow Standard NA foothold first.",
    kpis: ["ADA compliance confirmed", "≥ 1 international terminal pilot"],
    priority: "p3",
    completionPct: 0,
    assignees: ["A. Chen"],
    linkedTasks: ["rm-r15", "rm-r16"],
    stateScope: [],
    comments: [],
  },
];

// ─── Stage-Gate Criteria ──────────────────────────────────────────────────────

export const stageCriteria: GateCriterion[] = [
  // G0 — Idea Screen
  { id: "g0-01", gate: "G0_idea", category: "market", criterion: "Customer Problem Validated", description: "At least 3 VOC data points (customer interviews, field complaints, NPS feedback) confirm the problem exists and is significant.", responsible: "PM", required: true },
  { id: "g0-02", gate: "G0_idea", category: "financial", criterion: "Revenue Opportunity Estimate", description: "Rough order-of-magnitude TAM estimate: ≥ $20M addressable in NA pedestrian segment to continue.", responsible: "PM", required: true },
  { id: "g0-03", gate: "G0_idea", category: "technical", criterion: "No Fundamental Technical Blocker", description: "Engineering pre-screen confirms no known IP, physics, or supply-chain blocker that would prevent development.", responsible: "Engineering", required: true },
  { id: "g0-04", gate: "G0_idea", category: "go_no_go", criterion: "Strategic Fit Check", description: "Initiative aligns with ASSA ABLOY Entrance Systems NA 3-year roadmap and pedestrian segment focus.", responsible: "Director PM", required: true },

  // G1 — Scoping
  { id: "g1-01", gate: "G1_scoping", category: "market", criterion: "Market Sizing — NA Pedestrian", description: "SAM and SOM documented for NA pedestrian segment. Vertical-by-vertical breakdown with growth rates.", responsible: "PM", required: true },
  { id: "g1-02", gate: "G1_scoping", category: "market", criterion: "VOC — 5+ Qualified Interviews", description: "Minimum 5 structured interviews (AOR, contractor, facility manager, distributor, end user). Affinity map of insights completed.", responsible: "PM", required: true },
  { id: "g1-03", gate: "G1_scoping", category: "technical", criterion: "Preliminary Technical Assessment", description: "Engineering pre-feasibility: key technical risks identified, rough BOM estimate, IP landscape reviewed.", responsible: "Engineering Lead", required: true },
  { id: "g1-04", gate: "G1_scoping", category: "regulatory", criterion: "Standards Applicability Map", description: "All applicable ANSI/BHMA, UL, FBC, ADA, FGI standards identified. Certification path and lead time estimated.", responsible: "Regulatory", required: true },
  { id: "g1-05", gate: "G1_scoping", category: "financial", criterion: "Preliminary Business Case", description: "P&L outline: target MSRP, BOM budget, gross margin target, breakeven volume. Requires CFO review if investment > $1M.", responsible: "PM + Finance", required: true },
  { id: "g1-06", gate: "G1_scoping", category: "go_no_go", criterion: "Resource Commitment", description: "Engineering, QA, and Marketing capacity confirmed for next phase. Named resource owners documented.", responsible: "Director PM", required: true },

  // G2 — Business Case
  { id: "g2-01", gate: "G2_business_case", category: "market", criterion: "Competitive Positioning Map", description: "Feature-by-feature comparison vs. top 3 NA competitors. Win/loss thesis documented. Price-to-value position defined.", responsible: "PM", required: true },
  { id: "g2-02", gate: "G2_business_case", category: "financial", criterion: "Full Financial Model Approved", description: "5-year P&L with sensitivity analysis. NPV, IRR, payback period. Approved by Finance and VP Engineering.", responsible: "PM + Finance", required: true },
  { id: "g2-03", gate: "G2_business_case", category: "technical", criterion: "Confirmed Architecture & BOM", description: "Final product architecture, key component selections, confirmed BOM at ± 15% accuracy.", responsible: "Engineering Lead", required: true },
  { id: "g2-04", gate: "G2_business_case", category: "regulatory", criterion: "Certification Cost & Timeline Locked", description: "Lab vendor selected, cost quoted, test slot reserved. Regulatory timeline built into project plan.", responsible: "Regulatory", required: true },
  { id: "g2-05", gate: "G2_business_case", category: "manufacturing", criterion: "Manufacturing Feasibility Confirmed", description: "Operations assessment: can current NA manufacturing handle volume? Tooling cost included in BOM.", responsible: "Manufacturing", required: true },
  { id: "g2-06", gate: "G2_business_case", category: "go_no_go", criterion: "Executive Approval", description: "VP PM and VP Engineering formal go/no-go decision documented. Investment level approved by CFO if > $500k.", responsible: "VP PM", required: true },

  // G3 — Development
  { id: "g3-01", gate: "G3_development", category: "technical", criterion: "Engineering Prototype Complete", description: "Alpha prototype built and bench-tested. Meets core functional specifications. All safety interlocks operational.", responsible: "Engineering", required: true },
  { id: "g3-02", gate: "G3_development", category: "technical", criterion: "Software / Firmware Alpha Released", description: "Firmware alpha passes internal code review. Key use cases pass smoke tests. No P0/P1 blockers.", responsible: "Software Lead", required: true },
  { id: "g3-03", gate: "G3_development", category: "regulatory", criterion: "Pre-Certification Audit Passed", description: "Internal regulatory audit confirms no known test blockers before submitting to UL/BHMA/lab. All safety-critical items resolved.", responsible: "Regulatory", required: true },
  { id: "g3-04", gate: "G3_development", category: "manufacturing", criterion: "Pilot Build Plan Approved", description: "Pilot manufacturing run plan documented: 25 units minimum. Assembly instructions v0.1 complete. Production tooling ordered.", responsible: "Manufacturing", required: true },
  { id: "g3-05", gate: "G3_development", category: "market", criterion: "GTM Strategy Drafted", description: "Launch vertical, channel strategy, distributor pricing, and sales enablement plan drafted. Marketing brief approved.", responsible: "PM + Marketing", required: true },
  { id: "g3-06", gate: "G3_development", category: "go_no_go", criterion: "On Track vs. Business Case", description: "Actual spend and timeline within 20% of G2 commitments. Material deviations require VP PM notification.", responsible: "PM", required: true },

  // G4 — Testing & Validation
  { id: "g4-01", gate: "G4_testing", category: "technical", criterion: "All Certification Tests Passed", description: "UL 325, ANSI/BHMA A156.10 or A156.19, and all applicable standards certification test reports in hand.", responsible: "Regulatory", required: true },
  { id: "g4-02", gate: "G4_testing", category: "technical", criterion: "Field Pilot — 10+ Sites", description: "Minimum 10 pilot installations across ≥ 2 target verticals in NA. 30-day field soak with zero safety incidents.", responsible: "Engineering + PM", required: true },
  { id: "g4-03", gate: "G4_testing", category: "technical", criterion: "Reliability Targets Met", description: "MTTF ≥ 2M cycles confirmed in accelerated life test. MTTR ≤ 2 hrs in field pilot data.", responsible: "QA", required: true },
  { id: "g4-04", gate: "G4_testing", category: "manufacturing", criterion: "Production Pilot at Rate", description: "Production pilot (25 units) assembled at target rate, yield ≥ 97%, cost within ±5% of BOM.", responsible: "Manufacturing", required: true },
  { id: "g4-05", gate: "G4_testing", category: "market", criterion: "Sales & Distributor Training Complete", description: "Training materials, CPD deck, and install guide finalized. Distributor training sessions completed in ≥ 3 regions.", responsible: "Sales Enablement", required: true },
  { id: "g4-06", gate: "G4_testing", category: "financial", criterion: "Confirmed Unit Economics", description: "BOM cost ± 3% of target, gross margin confirmed vs. G2 commitment. Any variance ≥ 5% requires Finance re-approval.", responsible: "PM + Finance", required: true },
  { id: "g4-07", gate: "G4_testing", category: "regulatory", criterion: "AAADM Compliance Verified (if applicable)", description: "For all operators: AAADM annual inspection checklist verified against production unit. Inspection documentation published.", responsible: "Regulatory", required: false },
  { id: "g4-08", gate: "G4_testing", category: "go_no_go", criterion: "Launch Readiness Score ≥ 80%", description: "All required G4 criteria met. Optional criteria ≥ 60% complete. VP PM formal launch approval.", responsible: "VP PM", required: true },

  // G5 — Launch
  { id: "g5-01", gate: "G5_launch", category: "market", criterion: "NA Distribution Channel Live", description: "Product available in distributor ordering system. Pricing published. Lead times communicated.", responsible: "Sales Ops", required: true },
  { id: "g5-02", gate: "G5_launch", category: "market", criterion: "Marketing Collateral Published", description: "Product page, spec sheet, install video, and CPD presentation live. Press release issued to trade media.", responsible: "Marketing", required: true },
  { id: "g5-03", gate: "G5_launch", category: "technical", criterion: "Technical Documentation Complete", description: "Installation guide, service manual, parts list, and wiring diagrams published on knowledge base.", responsible: "Technical Publications", required: true },
  { id: "g5-04", gate: "G5_launch", category: "regulatory", criterion: "Regulatory Filings Current", description: "All certifications published. Declaration of conformity issued. Florida NOA (if applicable) in hand.", responsible: "Regulatory", required: true },
  { id: "g5-05", gate: "G5_launch", category: "manufacturing", criterion: "Production at Full Rate", description: "Manufacturing rate ≥ 90% of launch forecast. Safety stock ≥ 4 weeks at projected demand.", responsible: "Manufacturing", required: true },
  { id: "g5-06", gate: "G5_launch", category: "go_no_go", criterion: "30-Day Post-Launch Review Scheduled", description: "Sustain review meeting scheduled. KPI dashboard live. Escalation path defined for launch issues.", responsible: "PM", required: true },

  // Sustain
  { id: "sus-01", gate: "sustain", category: "market", criterion: "NPS ≥ 40", description: "Net Promoter Score maintained ≥ 40 across distributor and end-user surveys. Quarterly pulse check.", responsible: "PM", required: true },
  { id: "sus-02", gate: "sustain", category: "technical", criterion: "Field Failure Rate < 0.5%", description: "Annualized field failure rate below 0.5% of installed base. Warranty claims tracked monthly.", responsible: "QA", required: true },
  { id: "sus-03", gate: "sustain", category: "financial", criterion: "GM Maintenance ≥ G2 Commitment", description: "Gross margin maintained within 3 pts of G2 commitment. Annual cost reduction roadmap in place.", responsible: "Finance", required: true },
  { id: "sus-04", gate: "sustain", category: "regulatory", criterion: "Certifications Current", description: "All product certifications tracked. Renewals initiated ≥ 6 months before expiration.", responsible: "Regulatory", required: true },

  // EOL
  { id: "eol-01", gate: "eol", category: "market", criterion: "EOL Communication Published", description: "EOL notice sent to all distributors and registered installers ≥ 12 months before last ship date.", responsible: "PM + Marketing", required: true },
  { id: "eol-02", gate: "eol", category: "technical", criterion: "Parts Availability Plan", description: "Spare parts stocked for 10-year service life post-EOL. Service documentation archived.", responsible: "Supply Chain", required: true },
  { id: "eol-03", gate: "eol", category: "market", criterion: "Migration Path to Successor Product", description: "Successor product and migration guide available. Sales team briefed. Trade-in/upgrade program defined.", responsible: "PM", required: false },
];

// ─── Handoff Templates ────────────────────────────────────────────────────────

export const handoffTemplates: HandoffTemplate[] = [
  {
    type: "concept_to_engineering",
    from: "PM",
    to: "Engineering",
    title: "Concept → Engineering Handoff",
    purpose: "Transfer validated concept with business requirements, VOC summary, and scope boundaries so Engineering can begin feasibility and architecture work.",
    checklist: [
      "Product Requirements Document (PRD) v1.0 attached",
      "VOC summary (min. 5 interviews) included",
      "Competitive positioning brief attached",
      "Rough BOM budget constraint communicated ($k)",
      "Target launch date and key milestones documented",
      "Standards/certification requirements identified",
      "NA-specific compliance constraints (UL 325, A156.10/A156.19) noted",
      "Engineering lead and QA contact named",
      "Open questions log initialized",
      "G1 gate deliverables reviewed together",
    ],
    fields: [
      { id: "product_name", label: "Product / Initiative Name", type: "text", placeholder: "e.g. SW300-S Bluetooth App Configuration", required: true },
      { id: "prd_version", label: "PRD Version", type: "text", placeholder: "e.g. v1.0", required: true },
      { id: "pm_owner", label: "PM Owner", type: "text", placeholder: "e.g. J. Tubbs", required: true },
      { id: "engineering_lead", label: "Engineering Lead", type: "text", placeholder: "e.g. A. Chen", required: true },
      { id: "target_launch", label: "Target Launch Quarter", type: "select", options: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"], required: true },
      { id: "bom_budget", label: "BOM Budget Target ($k)", type: "number", placeholder: "e.g. 420", required: true },
      { id: "key_requirements", label: "Top 3 Must-Have Requirements", type: "textarea", placeholder: "1. ...\n2. ...\n3. ...", required: true },
      { id: "standards", label: "Applicable Standards / Certifications", type: "textarea", placeholder: "e.g. ANSI/BHMA A156.10-2024, UL 325:2023, ADA 2010", required: true },
      { id: "open_questions", label: "Open Questions / Engineering Asks", type: "textarea", placeholder: "Questions PM has for Engineering before kick-off..." },
      { id: "voc_summary", label: "VOC Summary (key insights)", type: "textarea", placeholder: "Top themes from customer interviews...", required: true },
    ],
  },
  {
    type: "engineering_to_manufacturing",
    from: "Engineering",
    to: "Manufacturing",
    title: "Engineering → Manufacturing Handoff",
    purpose: "Transfer finalized design package so Manufacturing can plan tooling, build pilot units, and begin production ramp.",
    checklist: [
      "Released CAD package (BOM + drawings) in PDM system",
      "Assembly instructions v1.0 complete and reviewed",
      "First Article Inspection (FAI) criteria defined",
      "Pilot build quantity confirmed (min. 25 units)",
      "Critical-to-quality (CTQ) characteristics flagged in drawings",
      "Supplier qualification status confirmed for all LTI components",
      "Production tooling ordered (or tooling plan documented)",
      "Failure modes and mitigations communicated (DFMEA shared)",
      "AAADM inspection points mapped to production unit",
      "Target unit cost and yield confirmed",
    ],
    fields: [
      { id: "product_name", label: "Product / Initiative Name", type: "text", required: true },
      { id: "bom_revision", label: "BOM Revision", type: "text", placeholder: "e.g. Rev C", required: true },
      { id: "engineering_lead", label: "Engineering Lead", type: "text", required: true },
      { id: "mfg_lead", label: "Manufacturing Lead", type: "text", required: true },
      { id: "pilot_qty", label: "Pilot Build Quantity (units)", type: "number", placeholder: "e.g. 25", required: true },
      { id: "unit_cost_target", label: "Unit Cost Target ($)", type: "number", placeholder: "e.g. 1840", required: true },
      { id: "ctq_items", label: "Critical-to-Quality (CTQ) Items", type: "textarea", placeholder: "List CTQ characteristics from drawings...", required: true },
      { id: "tooling_status", label: "Tooling Status", type: "select", options: ["Not started", "Ordered", "In fabrication", "Ready", "N/A"], required: true },
      { id: "supplier_gaps", label: "Supplier / LTI Gaps", type: "textarea", placeholder: "Any unqualified suppliers or long lead items..." },
      { id: "dfmea_ref", label: "DFMEA Reference / Key Risk Mitigations", type: "textarea", placeholder: "Top failure modes and mitigation actions..." },
    ],
  },
  {
    type: "pm_to_marketing",
    from: "PM",
    to: "Marketing",
    title: "PM → Marketing Handoff",
    purpose: "Provide Marketing with positioning, audience, and messaging foundation to develop campaign, launch collateral, and trade media strategy.",
    checklist: [
      "Product positioning statement finalized",
      "Target customer personas defined (primary + secondary)",
      "Key benefits (3 max) and proof points documented",
      "Competitive differentiation brief attached",
      "Pricing and packaging confirmed",
      "Launch vertical prioritization confirmed (e.g. Healthcare → Retail → Airport)",
      "Trade publication target list (SDM, Door + Access Systems, etc.)",
      "CPD presentation outline approved",
      "NA launch date and regional rollout order locked",
      "Product naming and SKU confirmed",
    ],
    fields: [
      { id: "product_name", label: "Product / Initiative Name", type: "text", required: true },
      { id: "positioning_statement", label: "Positioning Statement", type: "textarea", placeholder: "For [target customer] who [need], [product] is [category] that [benefit]. Unlike [competitor], we [differentiator].", required: true },
      { id: "primary_persona", label: "Primary Buyer Persona", type: "select", options: ["Architect/Specifier (AOR)", "Facility Manager", "GC / Contractor", "Distributor", "Hospital Procurement", "Property Manager", "IT/Building Systems"], required: true },
      { id: "launch_verticals", label: "Launch Verticals (priority order)", type: "textarea", placeholder: "1. Healthcare  2. Retail  3. Airport/Transit...", required: true },
      { id: "key_benefits", label: "Top 3 Customer Benefits", type: "textarea", placeholder: "1. ...\n2. ...\n3. ...", required: true },
      { id: "competitive_diff", label: "vs. Competitors (key differentiators)", type: "textarea", placeholder: "vs. dormakaba: ...\nvs. Stanley: ...", required: true },
      { id: "msrp", label: "MSRP / Launch Price", type: "text", placeholder: "e.g. $4,200 per operator system", required: true },
      { id: "launch_date", label: "NA Launch Target Date", type: "date", required: true },
      { id: "campaign_asks", label: "Campaign Assets Requested", type: "textarea", placeholder: "e.g. Spec sheet, install video, 1-pager for distributors, trade ad, CPD deck..." },
    ],
  },
  {
    type: "pm_to_sales",
    from: "PM",
    to: "Sales Enablement",
    title: "PM → Sales Handoff",
    purpose: "Equip field sales and distributor channel with positioning, objection handling, competitive intelligence, and deal qualification criteria.",
    checklist: [
      "Sales battle card drafted (vs. top 3 NA competitors)",
      "Top 5 objections and responses prepared",
      "Ideal customer profile (ICP) and qualification criteria defined",
      "Target account list for NA launch confirmed",
      "Distributor pricing and margin communicated",
      "Lead qualification fields updated in CRM",
      "Product demo / CPD presentation ready",
      "Sample/demo units committed for launch period",
      "Pipeline tracking dashboard configured",
      "Q&A document for field questions ready",
    ],
    fields: [
      { id: "product_name", label: "Product / Initiative Name", type: "text", required: true },
      { id: "icp", label: "Ideal Customer Profile (ICP)", type: "textarea", placeholder: "Who is the ideal buyer? Describe the account, role, vertical, deal size, trigger events...", required: true },
      { id: "top_objections", label: "Top 3 Objections + Responses", type: "textarea", placeholder: "1. Objection: ...  Response: ...\n2. ...\n3. ...", required: true },
      { id: "competitor_context", label: "Competitive Context (vs. dormakaba / Stanley / Horton)", type: "textarea", placeholder: "Key wins/losses, pricing position, where we win, where we lose...", required: true },
      { id: "target_accounts", label: "Priority Target Accounts / Regions", type: "textarea", placeholder: "List key accounts or regions for launch priority..." },
      { id: "distributor_price", label: "Distributor Net Price ($)", type: "number", placeholder: "e.g. 2850", required: true },
      { id: "deal_size_range", label: "Typical Deal Size Range", type: "text", placeholder: "e.g. $8k–$45k installed" },
      { id: "sample_units", label: "Demo/Sample Units Available", type: "select", options: ["0", "1–2", "3–5", "5–10", "10+"], required: true },
      { id: "crm_fields", label: "New CRM Fields / Qualification Criteria", type: "textarea", placeholder: "Any new fields added to opportunity qualification..." },
    ],
  },
  {
    type: "manufacturing_to_qa",
    from: "Manufacturing",
    to: "QA / Regulatory",
    title: "Manufacturing → QA Handoff",
    purpose: "Transfer pilot build units to QA for final validation testing, AAADM inspection, and regulatory audit before launch clearance.",
    checklist: [
      "Pilot units (min. 25) built to Rev C BOM or later",
      "FAI report complete and attached",
      "All CTQ items passed in-process inspection",
      "Unit serial numbers documented and traceable",
      "Known defects or non-conformances documented",
      "AAADM inspection checklist pre-populated from unit build data",
      "Safety sensor calibration records attached",
      "Cert lab submission package prepared",
      "Pre-production test fixtures available to QA",
      "Build notes and any process deviations logged",
    ],
    fields: [
      { id: "product_name", label: "Product / Initiative Name", type: "text", required: true },
      { id: "pilot_serial_range", label: "Pilot Unit Serial Number Range", type: "text", placeholder: "e.g. SL500-2501 to SL500-2525", required: true },
      { id: "bom_revision", label: "BOM Revision at Build", type: "text", required: true },
      { id: "mfg_lead", label: "Manufacturing Lead", type: "text", required: true },
      { id: "qa_lead", label: "QA Lead", type: "text", required: true },
      { id: "fai_status", label: "FAI Status", type: "select", options: ["Complete — Passed", "Complete — Conditional Pass", "In Progress", "Not Started"], required: true },
      { id: "known_ncrs", label: "Known Non-Conformances (NCRs)", type: "textarea", placeholder: "List any open NCRs, deviations, or known defects..." },
      { id: "cert_package_ready", label: "Cert Lab Submission Package", type: "select", options: ["Ready", "In preparation", "Not started"], required: true },
      { id: "aaadm_precheck", label: "AAADM Inspection Pre-Check Notes", type: "textarea", placeholder: "Any concerns or notes from pre-check against AAADM checklist..." },
    ],
  },
  {
    type: "qa_to_launch",
    from: "QA / Regulatory",
    to: "PM + Sales",
    title: "QA → Launch Clearance",
    purpose: "Confirm all test, certification, and regulatory requirements are met, granting PM formal clearance to proceed to commercial launch.",
    checklist: [
      "All required certifications received (UL 325, ANSI/BHMA, Florida NOA if applicable)",
      "Field pilot soak complete (30-day minimum, 10+ sites)",
      "Zero safety incidents in pilot",
      "MTTF ≥ 2M cycles confirmed",
      "AAADM inspection protocol validated on production unit",
      "All open P0/P1 bugs resolved",
      "Regulatory filing tracker updated",
      "Product liability review complete with Legal",
      "Customer-facing warranty document finalized",
      "Declaration of conformity signed",
    ],
    fields: [
      { id: "product_name", label: "Product / Initiative Name", type: "text", required: true },
      { id: "qa_lead", label: "QA / Regulatory Lead", type: "text", required: true },
      { id: "cert_summary", label: "Certifications Obtained", type: "textarea", placeholder: "List all cert reports received with dates...", required: true },
      { id: "pilot_sites", label: "Pilot Sites Completed", type: "number", placeholder: "e.g. 12", required: true },
      { id: "safety_incidents", label: "Safety Incidents in Pilot", type: "number", placeholder: "Must be 0 to proceed", required: true },
      { id: "open_bugs", label: "Open P0/P1 Defects", type: "number", placeholder: "Must be 0 to proceed", required: true },
      { id: "noa_status", label: "Florida NOA Status (if applicable)", type: "select", options: ["N/A", "Obtained", "In process", "Not required"] },
      { id: "launch_clearance", label: "QA Launch Clearance Decision", type: "select", options: ["GO — Full Clearance", "GO with conditions (list below)", "NO-GO — Issues blocking launch"], required: true },
      { id: "conditions", label: "Conditions / Blockers (if any)", type: "textarea", placeholder: "List any conditions that must be met before ship..." },
    ],
  },
  {
    type: "launch_to_sustain",
    from: "PM + Marketing",
    to: "Sustain Team (PM + Engineering + Sales)",
    title: "Launch → Sustain Transition",
    purpose: "Formalize transfer of product to sustain phase with KPI baselines, escalation path, and owner assignments for ongoing performance management.",
    checklist: [
      "Launch KPI dashboard live and baselined",
      "Product manager assigned for sustain phase",
      "30-60-90 day review cadence set in calendar",
      "Field escalation path documented (Tier 1 → 2 → 3)",
      "Warranty claim tracking active",
      "Distributor feedback loop established (quarterly NPS)",
      "Annual AAADM inspection reminder campaign scheduled",
      "Competitive watch alerts configured",
      "Next enhancement roadmap item (if any) in backlog",
      "Cost reduction roadmap item identified",
    ],
    fields: [
      { id: "product_name", label: "Product / Initiative Name", type: "text", required: true },
      { id: "sustain_owner", label: "Sustain PM Owner", type: "text", required: true },
      { id: "engineering_sustain", label: "Engineering Sustain Lead", type: "text", required: true },
      { id: "launch_date_actual", label: "Actual Launch Date", type: "date", required: true },
      { id: "y1_revenue_target", label: "Year 1 Revenue Target ($k)", type: "number", required: true },
      { id: "nps_baseline", label: "NPS Baseline (from pilot)", type: "number", placeholder: "e.g. 43" },
      { id: "fail_rate_baseline", label: "Field Failure Rate Baseline (%)", type: "number", placeholder: "e.g. 0.3" },
      { id: "known_issues", label: "Known Post-Launch Issues / Watch Items", type: "textarea", placeholder: "Any issues from launch week or early field reports..." },
      { id: "next_enhancement", label: "Next Enhancement Initiative (roadmap ID)", type: "text", placeholder: "e.g. rm-001 — SW300-S firmware v3.3" },
      { id: "cost_reduction_target", label: "Cost Reduction Target (% BOM, Year 2)", type: "number", placeholder: "e.g. 5" },
    ],
  },
];

// ─── VOC Data ─────────────────────────────────────────────────────────────────

export const vocEntries: VOCEntry[] = [
  {
    id: "voc-001",
    date: "2025-03-14",
    source: "distributor",
    contact: "Regional Sales Manager",
    company: "Allegion Distributor — Southeast",
    vertical: "Healthcare",
    region: "Southeast",
    productLine: "SW300",
    type: "pain_point",
    quote: "The DIP switch setup is the number one callback issue. Techs get it wrong half the time, and we end up re-rolling a truck. If there was an app, we'd sell twice as many.",
    insight: "DIP-switch misconfiguration is top callback driver for SW300 in Southeast. App configuration = direct revenue unlock for distribution.",
    priority: "critical",
    linkedInitiative: "rm-001",
    actionable: true,
    tags: ["sw300", "install", "callback", "app"],
  },
  {
    id: "voc-002",
    date: "2025-02-28",
    source: "architect",
    contact: "Principal Architect",
    company: "HDR Architecture — Healthcare Studio",
    vertical: "Healthcare",
    region: "Midwest",
    productLine: "VersaMax",
    type: "compliance_concern",
    quote: "We're specifying FGI 2022 on every hospital project now. If VersaMax doesn't have a documented compliance statement by Q3, I'm switching to Horton for ICU vestibule applications.",
    insight: "AOR attrition risk in hospital segment is real if FGI 2022 compliance is not documented. Non-compliance = spec loss at design phase.",
    priority: "critical",
    linkedInitiative: "rm-004",
    actionable: true,
    tags: ["versaMax", "fgi2022", "healthcare", "aro_risk"],
  },
  {
    id: "voc-003",
    date: "2025-01-20",
    source: "field_tech",
    contact: "Service Technician",
    company: "ASSA ABLOY Service — Northeast",
    vertical: "Office/Commercial",
    region: "Northeast",
    productLine: "ecoLOGIC",
    type: "feature_request",
    quote: "Facility managers want a dashboard that shows them cycle counts and energy data without calling us. They're asking every service visit. If we had a portal, they'd stop bugging us and we'd sell more service contracts.",
    insight: "Demand for self-serve facility manager portal is organic and strong. ecoLOGIC dashboard is pull, not push.",
    priority: "high",
    linkedInitiative: "rm-012",
    actionable: true,
    tags: ["ecoLOGIC", "dashboard", "facility_manager", "portal"],
  },
  {
    id: "voc-004",
    date: "2025-03-01",
    source: "end_user",
    contact: "Facilities Director",
    company: "Regional Healthcare Network — Southeast",
    vertical: "Healthcare",
    region: "Southeast",
    productLine: "ecoLOGIC",
    type: "feature_request",
    quote: "We're pushing for LEED v5 on our new tower. The door energy data needs to feed our BMS — right now it's a data island. Can it talk to Metasys?",
    insight: "LEED v5 and smart building mandates are creating pull for BMS integration. ecoLOGIC must speak BACnet/Modbus or it's not specifiable on green projects.",
    priority: "critical",
    linkedInitiative: "rm-011",
    actionable: true,
    tags: ["ecoLOGIC", "bms", "leed", "bacnet", "healthcare"],
  },
  {
    id: "voc-005",
    date: "2025-02-10",
    source: "distributor",
    contact: "Branch Manager",
    company: "Assa Abloy Distributor — Pacific Northwest",
    vertical: "Retail",
    region: "West",
    productLine: "SL500",
    type: "competitive_intelligence",
    quote: "We lost a grocery chain deal to Stanley M-Force because the panels were 650 lb and SL500 tops out at 550. Stanley's 700 lb claim is hitting us in big-box and airport bids now.",
    insight: "700 lb capacity gap is a documented deal loss driver in high-traffic sliding. Competitive signal from Stanley is real and hitting pipeline.",
    priority: "high",
    linkedInitiative: "rm-006",
    actionable: true,
    tags: ["sl500", "competitive", "stanley", "heavy_duty", "airport"],
  },
  {
    id: "voc-006",
    date: "2025-01-15",
    source: "installer",
    contact: "Lead Installer",
    company: "Commercial Door Solutions Inc. — Midwest",
    vertical: "Office/Commercial",
    region: "Midwest",
    productLine: "SW300",
    type: "pain_point",
    quote: "The header on the SW300 is too deep for most of my retrofit jobs. I can't fit it without adding a bulkhead header which the GC won't approve. I've been quoting dormakaba ED250 instead — it fits.",
    insight: "Header depth is a hard disqualifier in retrofit, not a soft preference. Every lost retrofit job is a dormakaba win.",
    priority: "critical",
    linkedInitiative: "rm-007",
    actionable: true,
    tags: ["sw300", "retrofit", "header_depth", "dormakaba", "lost_deal"],
  },
  {
    id: "voc-007",
    date: "2025-03-22",
    source: "end_user",
    contact: "IT Director / Smart Building Lead",
    company: "Fortune 500 Corporate HQ — Northeast",
    vertical: "Office/Commercial",
    region: "Northeast",
    productLine: "SL500",
    type: "feature_request",
    quote: "We want our doors in the same PACS dashboard as our card readers. Right now automatic doors are completely separate from our Lenel S2 system. It's two screens for security.",
    insight: "Access control + door automation integration is a genuine enterprise pain point. OSDP v2 integration is the technical path.",
    priority: "high",
    linkedInitiative: "rm-013",
    actionable: true,
    tags: ["sl500", "access_control", "osdp", "pacs", "enterprise"],
  },
  {
    id: "voc-008",
    date: "2025-02-18",
    source: "architect",
    contact: "Associate Principal, Healthcare",
    company: "Stantec Architecture — Canada",
    vertical: "Healthcare",
    region: "Canada",
    productLine: "RECORD TSA 320",
    type: "feature_request",
    quote: "We're designing a new OR suite and need a hermetic sliding door that also handles high traffic. ASSA ABLOY doesn't have anything. We're looking at Tormax. If RECORD has something, get it certified here.",
    insight: "Hermetic sliding demand is strong in Canadian healthcare construction. RECORD TSA 320 heavy-duty spec is the candidate. Tormax is the competitive risk.",
    priority: "high",
    linkedInitiative: "rm-r03",
    actionable: true,
    tags: ["record", "tsa320", "hermetic", "healthcare", "canada"],
  },
  {
    id: "voc-009",
    date: "2025-03-05",
    source: "sales",
    contact: "Regional Account Manager",
    company: "ASSA ABLOY Entrance Systems — West",
    vertical: "Hospitality",
    region: "West",
    productLine: "RECORD INORA",
    type: "competitive_intelligence",
    quote: "I'm getting asked about RECORD INORA at least twice a month on hotel lobby bids. AORs have seen it in European projects and want it here. Right now I have nothing to show them.",
    insight: "INORA brand pull exists in NA luxury hospitality — AORs are already specifying it by name from European exposure. Time-to-market is competitive advantage.",
    priority: "high",
    linkedInitiative: "rm-r04",
    actionable: true,
    tags: ["record", "inora", "hospitality", "luxury", "aor"],
  },
  {
    id: "voc-010",
    date: "2025-01-30",
    source: "distributor",
    contact: "Technical Sales Specialist",
    company: "National Distributor — Northeast",
    vertical: "Multi-Family",
    region: "Northeast",
    productLine: "SW300",
    type: "feature_request",
    quote: "Multi-family is our fastest growing vertical. Property managers want package delivery vestibules — a door that knows a FedEx delivery is happening and opens automatically. There's nothing on the market that does this well.",
    insight: "Package delivery vestibule automation is an emerging multi-family pain point with no dominant solution. First-mover opportunity.",
    priority: "high",
    linkedInitiative: "rm-016",
    actionable: true,
    tags: ["sw300", "multi-family", "package", "iot", "vestibule"],
  },
  {
    id: "voc-011",
    date: "2025-02-05",
    source: "field_tech",
    contact: "AAADM-Certified Inspector",
    company: "Door Systems Service Co. — Southeast",
    vertical: "Retail",
    region: "Southeast",
    productLine: "SL500",
    type: "compliance_concern",
    quote: "I'm an AAADM inspector. Half the operators I inspect have never been touched since install. There's a huge liability gap. When an ASSA ABLOY door hurts someone, the first question is 'was it inspected annually?' — usually the answer is no.",
    insight: "AAADM inspection gap is a liability exposure AND a service revenue opportunity. Annual inspection program = recurring revenue + risk mitigation.",
    priority: "high",
    linkedInitiative: "rm-017",
    actionable: true,
    tags: ["aaadm", "inspection", "liability", "service_revenue"],
  },
  {
    id: "voc-012",
    date: "2025-03-18",
    source: "end_user",
    contact: "Hospital Infection Control Manager",
    company: "Major Academic Medical Center — Northeast",
    vertical: "Healthcare",
    region: "Northeast",
    productLine: "Healthcare",
    type: "pain_point",
    quote: "Every door that opens in ICU is a potential infection vector. We need doors that seal. The ones we have leak air even when closed. After COVID, this is non-negotiable for new construction.",
    insight: "Post-COVID infection control standards are hardening. Hermetic sealing is becoming spec-table for ICU, OR, and isolation rooms. $280M TAM.",
    priority: "critical",
    linkedInitiative: "rm-010",
    actionable: true,
    tags: ["healthcare", "hermetic", "infection_control", "icu", "post_covid"],
  },
  {
    id: "voc-013",
    date: "2025-03-28",
    source: "architect",
    contact: "Project Architect, Aviation Studio",
    company: "HOK Architecture — Aviation Practice",
    vertical: "Airport/Transit",
    region: "Southeast",
    productLine: "RECORD Windcord 5400",
    type: "feature_request",
    quote: "Miami International is designing a new terminal. The owner spec requires hurricane-rated automatic sliding — not shutters. I've heard RECORD has something that qualifies for HVHZ without shutters. When can we get submittal documents?",
    insight: "Airport/transit in HVHZ zones is an underserved segment. Windcord 5400 without shutters is a significant differentiator vs. competitors requiring shutters.",
    priority: "critical",
    linkedInitiative: "rm-r06",
    actionable: true,
    tags: ["windcord5400", "hvhz", "airport", "miami", "hurricane"],
  },
  {
    id: "voc-014",
    date: "2025-04-01",
    source: "distributor",
    contact: "Commercial Door Specialist",
    company: "Gulf Coast Door & Hardware — FL",
    vertical: "Healthcare",
    region: "Southeast",
    productLine: "RECORD FlipFlow Standard",
    type: "competitive_intelligence",
    quote: "Tampa International is asking about one-way pedestrian control for their security checkpoint exit lanes. I've seen Gunnebo and Skidata do it in Europe, but there's no ASSA ABLOY offering I can spec here. This is a gap.",
    insight: "FlipFlow product family has no NA-available version. Airport security flow control is a gap vs. European competitors in a growing US airport construction cycle.",
    priority: "high",
    linkedInitiative: "rm-r15",
    actionable: true,
    tags: ["flipflow", "airport", "security_flow", "gunnebo", "transit"],
  },
];

// ─── Resource & Capacity Data ─────────────────────────────────────────────────

export const resourceData: ResourceEntry[] = [
  {
    id: "res-001",
    name: "J. Tubbs",
    department: "PM",
    role: "Product Manager, Pedestrian Sliding",
    capacity: 20,
    allocations: [
      { initiativeId: "rm-001", label: "SW300-S App Config", percent: 25 },
      { initiativeId: "rm-005", label: "SL500 A156.10 Recert", percent: 20 },
      { initiativeId: "rm-006", label: "SL500 XL 700lb", percent: 20 },
      { initiativeId: "rm-013", label: "SL500 OSDP Integration", percent: 15 },
      { initiativeId: "rm-r01", label: "RECORD TSA 20 NA Launch", percent: 20 },
    ],
  },
  {
    id: "res-002",
    name: "A. Chen",
    department: "PM",
    role: "Product Manager, Platform & IoT",
    capacity: 15,
    allocations: [
      { initiativeId: "rm-002", label: "ecoLOGIC AI OTA Rollout", percent: 35 },
      { initiativeId: "rm-011", label: "IoT-Native Operator", percent: 25 },
      { initiativeId: "rm-012", label: "Facility Manager Portal", percent: 25 },
      { initiativeId: "rm-010", label: "Hermetic Sliding Concept", percent: 15 },
    ],
  },
  {
    id: "res-003",
    name: "S. Patel",
    department: "Engineering",
    role: "Principal Engineer, Sliding Operators",
    capacity: 10,
    allocations: [
      { initiativeId: "rm-004", label: "VersaMax FGI 2022", percent: 40 },
      { initiativeId: "rm-014", label: "VersaMax Retrofit Kit", percent: 20 },
      { initiativeId: "rm-006", label: "SL500 XL 700lb", percent: 40 },
    ],
  },
  {
    id: "res-004",
    name: "M. Rivera",
    department: "QA/Regulatory",
    role: "Regulatory Affairs Manager",
    capacity: 25,
    allocations: [
      { initiativeId: "rm-003", label: "SL521 HVHZ NOA Recert", percent: 30 },
      { initiativeId: "rm-008", label: "FBC 9th Ed. Audit", percent: 25 },
      { initiativeId: "rm-009", label: "RD100 HVHZ Re-test", percent: 25 },
      { initiativeId: "rm-018", label: "NBC 2025 Canada Review", percent: 20 },
    ],
  },
  {
    id: "res-005",
    name: "T. Williams",
    department: "Engineering",
    role: "Mechanical Engineer, Swing Operators",
    capacity: 30,
    allocations: [
      { initiativeId: "rm-007", label: "SW300 Slim Header", percent: 50 },
      { initiativeId: "rm-016", label: "Multi-Family Package Entry", percent: 30 },
      { initiativeId: "rm-r04", label: "RECORD INORA NA", percent: 20 },
    ],
  },
  {
    id: "res-006",
    name: "B. Kim",
    department: "Engineering",
    role: "Software / Firmware Engineer",
    capacity: 5,
    allocations: [
      { initiativeId: "rm-001", label: "SW300-S Bluetooth", percent: 35 },
      { initiativeId: "rm-002", label: "ecoLOGIC OTA", percent: 35 },
      { initiativeId: "rm-013", label: "SL500 OSDP", percent: 30 },
    ],
  },
  {
    id: "res-007",
    name: "D. Torres",
    department: "Marketing",
    role: "Product Marketing Manager",
    capacity: 20,
    allocations: [
      { initiativeId: "rm-017", label: "AAADM Cert Program", percent: 30 },
      { initiativeId: "rm-014", label: "VersaMax Retrofit Kit", percent: 25 },
      { initiativeId: "rm-001", label: "SW300-S App Launch", percent: 25 },
      { initiativeId: "rm-r01", label: "RECORD TSA 20 Launch", percent: 20 },
    ],
  },
  {
    id: "res-008",
    name: "RECORD Engineer",
    department: "Engineering",
    role: "Embedded RECORD Systems Engineer (on-site)",
    capacity: 10,
    allocations: [
      { initiativeId: "rm-r05", label: "RECORD-AA Co-Engineering Protocol", percent: 30 },
      { initiativeId: "rm-r01", label: "RECORD TSA 20 NA Adapt", percent: 40 },
      { initiativeId: "rm-r02", label: "RECORD TSA 22 Cert", percent: 30 },
    ],
  },
];

// ─── Market Vertical Data ─────────────────────────────────────────────────────

export const marketVerticals: MarketVerticalData[] = [
  {
    vertical: "Healthcare",
    tamMillions: 310,
    aaSharePercent: 34,
    recordSharePercent: 4,
    growthRate: 8.2,
    topDriver: "Post-COVID infection control + hospital construction boom",
    topRisk: "FGI 2022 compliance gaps; Tormax gaining in hermetic segment",
    keyAccounts: ["HKS Architects", "HDR", "Kaiser Permanente", "HCA Healthcare", "Cleveland Clinic"],
  },
  {
    vertical: "Retail",
    tamMillions: 220,
    aaSharePercent: 41,
    recordSharePercent: 2,
    growthRate: 2.1,
    topDriver: "Retrofit cycle in big-box and grocery; touchless post-COVID",
    topRisk: "Private label competition; price pressure from imports",
    keyAccounts: ["Kroger", "Walmart", "Home Depot", "Target", "Whole Foods"],
  },
  {
    vertical: "Airport/Transit",
    tamMillions: 185,
    aaSharePercent: 28,
    recordSharePercent: 6,
    growthRate: 11.4,
    topDriver: "Airport modernization wave; high-capacity door demand",
    topRisk: "700 lb capacity gap vs. competition; long bid cycles",
    keyAccounts: ["Delta Terminal Group", "LAX Authority", "JFK International", "O'Hare Modernization"],
  },
  {
    vertical: "Education",
    tamMillions: 140,
    aaSharePercent: 38,
    recordSharePercent: 1,
    growthRate: 4.8,
    topDriver: "Security upgrades; ADA retrofits in older buildings",
    topRisk: "Budget pressure in K-12; long procurement cycles",
    keyAccounts: ["USC", "UCLA", "Miami-Dade County Schools", "LAUSD"],
  },
  {
    vertical: "Hospitality",
    tamMillions: 115,
    aaSharePercent: 22,
    recordSharePercent: 8,
    growthRate: 9.1,
    topDriver: "Hotel renovation cycle; RECORD INORA design demand from AORs",
    topRisk: "INORA not yet NA-certified; luxury segment thin SKU coverage",
    keyAccounts: ["Marriott", "Hilton", "Ennead Architects", "HOK"],
  },
  {
    vertical: "Multi-Family",
    tamMillions: 95,
    aaSharePercent: 18,
    recordSharePercent: 1,
    growthRate: 14.7,
    topDriver: "Package delivery vestibule demand; smart building integration",
    topRisk: "No dominant product in package vestibule; first-mover risk",
    keyAccounts: ["AvalonBay", "Equity Residential", "Related Companies", "Greystar"],
  },
  {
    vertical: "Office/Commercial",
    tamMillions: 260,
    aaSharePercent: 36,
    recordSharePercent: 3,
    growthRate: 1.8,
    topDriver: "Touchless entry; smart building LEED v5 mandates",
    topRisk: "Office vacancy headwinds; slow RTO in some markets",
    keyAccounts: ["CBRE", "JLL", "Google RE", "Amazon Corporate", "TIAA Real Estate"],
  },
  {
    vertical: "Government",
    tamMillions: 130,
    aaSharePercent: 45,
    recordSharePercent: 2,
    growthRate: 3.3,
    topDriver: "GSA accessibility mandates; ADA compliance retrofits",
    topRisk: "Government procurement cycles 18–24 months; lowest-bid rules",
    keyAccounts: ["GSA Public Buildings Service", "VA Facilities", "DoD NAVFAC", "TSA Procurement"],
  },
];

// ─── State Market Data — All 50 US States + DC ───────────────────────────────

export const stateMarketData: StateMarketData[] = [
  // ── Northeast ─────────────────────────────────────────────────────────────
  {
    stateCode: "CT",
    stateName: "Connecticut",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "CT State Building Code (IBC 2018 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Healthcare", "Office/Commercial", "Education"],
    marketOpportunity: "medium",
    annualConstructionBillions: 6.8,
    aaDistributorCount: 4,
    keyProjects: ["Yale New Haven Hospital expansion", "UConn Health Center renovations", "Hartford Healthcare capital program"],
    complianceNotes: "CT adopts IBC with local amendments. No HVHZ. ADA enforcement active in state-funded projects.",
  },
  {
    stateCode: "ME",
    stateName: "Maine",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "Maine Uniform Building and Energy Code (IBC 2015 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Healthcare", "Hospitality", "Government"],
    marketOpportunity: "low",
    annualConstructionBillions: 2.1,
    aaDistributorCount: 2,
    keyProjects: ["MaineHealth system expansion", "Bar Harbor resort renovations", "Augusta State House accessibility upgrades"],
    complianceNotes: "Rural market. Limited distributor coverage. IBC 2015 base — older standard in use.",
  },
  {
    stateCode: "MA",
    stateName: "Massachusetts",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "MA State Building Code 9th Ed. (IBC 2015 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Healthcare", "Education", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 22.4,
    aaDistributorCount: 8,
    keyProjects: ["Mass General Brigham campus expansion", "MIT campus modernization", "Boston Seaport mixed-use development"],
    complianceNotes: "MA 521 CMR (architectural access) more stringent than ADA. Stretch Energy Code requires ASHRAE 90.1 compliance. Active healthcare construction market.",
  },
  {
    stateCode: "NH",
    stateName: "New Hampshire",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "NH Building Code (IBC 2015 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Office/Commercial", "Retail"],
    marketOpportunity: "low",
    annualConstructionBillions: 3.4,
    aaDistributorCount: 2,
    keyProjects: ["Dartmouth Health system projects", "Manchester Airport terminal upgrades", "Concord commercial development"],
    complianceNotes: "Small market. No special wind or seismic requirements. Standard IBC compliance.",
  },
  {
    stateCode: "NJ",
    stateName: "New Jersey",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "NJ Uniform Construction Code (IBC 2018 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Healthcare", "Multi-Family", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 25.6,
    aaDistributorCount: 9,
    keyProjects: ["RWJBarnabas Health capital projects", "Hudson Yards South development", "Newark airport terminal renovations"],
    complianceNotes: "NJ UCC requires specific accessibility standards. NYC metro overflow drives high commercial activity. Post-Sandy coastal resilience codes apply in shore counties.",
  },
  {
    stateCode: "NY",
    stateName: "New York",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "NY Building Code 2022 (IBC 2018 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Office/Commercial", "Healthcare", "Multi-Family"],
    marketOpportunity: "critical",
    annualConstructionBillions: 72.0,
    aaDistributorCount: 15,
    keyProjects: ["JFK Terminal 6 redevelopment", "NYC Health + Hospitals capital program", "Hudson Yards Phase 2"],
    complianceNotes: "NYC Local Law 97 (carbon emissions) drives energy-efficient door compliance. NYC-specific amendments to IBC. Largest NA market by construction volume.",
  },
  {
    stateCode: "PA",
    stateName: "Pennsylvania",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "PA Uniform Construction Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Education", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 28.3,
    aaDistributorCount: 10,
    keyProjects: ["UPMC health system capital expansion", "Penn Medicine hospital tower", "Philadelphia 30th Street Station renovations"],
    complianceNotes: "Large healthcare and education market. No special wind requirements. Standard IBC.",
  },
  {
    stateCode: "RI",
    stateName: "Rhode Island",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "Rhode Island Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Education", "Hospitality"],
    marketOpportunity: "low",
    annualConstructionBillions: 2.8,
    aaDistributorCount: 2,
    keyProjects: ["Lifespan Health System projects", "Brown University campus upgrades", "Providence Place Mall renovation"],
    complianceNotes: "Small market. Coastal exposure on Narragansett Bay — some wind load awareness.",
  },
  {
    stateCode: "VT",
    stateName: "Vermont",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "Vermont Fire and Building Safety Code (IBC 2015 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Hospitality", "Education"],
    marketOpportunity: "low",
    annualConstructionBillions: 1.4,
    aaDistributorCount: 1,
    keyProjects: ["UVM Medical Center expansion", "Stowe resort development", "Burlington City Center"],
    complianceNotes: "Small rural market. Cold climate — operator temp range important. IBC 2015 base.",
  },
  {
    stateCode: "DC",
    stateName: "District of Columbia",
    region: "Northeast",
    hvhzCounties: [],
    primaryBuildingCode: "DC Building Code 2018 (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Government", "Office/Commercial", "Healthcare"],
    marketOpportunity: "high",
    annualConstructionBillions: 9.8,
    aaDistributorCount: 5,
    keyProjects: ["GSA federal building modernization program", "MedStar Health capital projects", "Capitol complex renovations"],
    complianceNotes: "High proportion of federal government projects. GSA standards apply. ADA and Section 508 strictly enforced on federal properties.",
  },

  // ── Southeast ─────────────────────────────────────────────────────────────
  {
    stateCode: "AL",
    stateName: "Alabama",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "Alabama Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Education"],
    marketOpportunity: "medium",
    annualConstructionBillions: 10.2,
    aaDistributorCount: 4,
    keyProjects: ["UAB Hospital expansion", "Huntsville aerospace facility development", "Birmingham airport modernization"],
    complianceNotes: "Gulf Coast counties have wind exposure but not formal HVHZ. Growing healthcare and aerospace construction.",
  },
  {
    stateCode: "AR",
    stateName: "Arkansas",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "Arkansas Fire Prevention Code (IBC 2012 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Healthcare", "Retail", "Government"],
    marketOpportunity: "low",
    annualConstructionBillions: 5.6,
    aaDistributorCount: 3,
    keyProjects: ["UAMS Medical Center campus projects", "Walmart HQ retail development (Bentonville)", "Little Rock National Airport renovation"],
    complianceNotes: "Walmart HQ proximity drives retail construction. Older IBC base (2012). Limited distributor network.",
  },
  {
    stateCode: "FL",
    stateName: "Florida",
    region: "Southeast",
    hvhzCounties: [
      "Miami-Dade",
      "Broward",
      "Palm Beach (eastern portions)",
    ],
    primaryBuildingCode: "Florida Building Code 8th Ed. (current); FBC 9th Ed. transition Dec 31, 2026",
    adoptionStatus: "state_specific",
    keyVerticals: ["Healthcare", "Hospitality", "Office/Commercial"],
    marketOpportunity: "critical",
    annualConstructionBillions: 68.0,
    aaDistributorCount: 14,
    keyProjects: ["Miami International Airport terminal expansion", "Orlando Health hospital projects", "Brickell City Centre Phase 3"],
    complianceNotes: "HVHZ mandatory in Miami-Dade, Broward, and eastern Palm Beach. NOA required for all exterior products in HVHZ. FBC 8th Ed. currently in force; FBC 9th Ed. TAS 203 structural wind testing requirements take effect Dec 31, 2026. Miami-Dade Product Approval mandatory. Highest regulatory complexity in NA.",
  },
  {
    stateCode: "GA",
    stateName: "Georgia",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "Georgia State Minimum Standard Codes (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Airport/Transit", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 31.5,
    aaDistributorCount: 8,
    keyProjects: ["Hartsfield-Jackson ATL Concourse expansion", "Piedmont Healthcare system capital", "Midtown Atlanta mixed-use development"],
    complianceNotes: "Atlanta is major hub for healthcare and airport projects. No HVHZ but coastal counties have wind exposure. Growing data center construction.",
  },
  {
    stateCode: "KY",
    stateName: "Kentucky",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "Kentucky Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Education"],
    marketOpportunity: "medium",
    annualConstructionBillions: 8.7,
    aaDistributorCount: 4,
    keyProjects: ["University of Kentucky Medical Center expansion", "Louisville Airport modernization", "Norton Healthcare capital program"],
    complianceNotes: "Stable mid-size market. No HVHZ. Significant healthcare and university construction.",
  },
  {
    stateCode: "LA",
    stateName: "Louisiana",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "Louisiana State Uniform Construction Code (IBC 2018 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Healthcare", "Government", "Airport/Transit"],
    marketOpportunity: "medium",
    annualConstructionBillions: 10.4,
    aaDistributorCount: 4,
    keyProjects: ["Louis Armstrong Airport terminal renovation", "Ochsner Health capital expansion", "New Orleans convention center upgrades"],
    complianceNotes: "Gulf Coast wind exposure — not formal HVHZ but wind-rated products preferred. Post-Katrina resilience codes in effect. Petrochemical construction adds industrial volume.",
  },
  {
    stateCode: "MS",
    stateName: "Mississippi",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "Mississippi State Building Code (IBC 2015 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Retail"],
    marketOpportunity: "low",
    annualConstructionBillions: 4.2,
    aaDistributorCount: 2,
    keyProjects: ["UMMC Medical Center projects", "Jackson-Medgar Wiley Evers Airport upgrades", "Biloxi casino resort development"],
    complianceNotes: "Small market. Gulf Coast counties have wind exposure. Casino hospitality in Biloxi is notable vertical.",
  },
  {
    stateCode: "NC",
    stateName: "North Carolina",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "NC State Building Code 2018 (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Education", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 29.8,
    aaDistributorCount: 8,
    keyProjects: ["Atrium Health Carolinas capital program", "Duke University hospital expansion", "RTP tech corridor development"],
    complianceNotes: "Rapidly growing market. Research Triangle Park tech construction booming. Coastal counties have wind exposure from Atlantic. No formal HVHZ.",
  },
  {
    stateCode: "SC",
    stateName: "South Carolina",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "South Carolina Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Hospitality", "Retail"],
    marketOpportunity: "medium",
    annualConstructionBillions: 13.6,
    aaDistributorCount: 5,
    keyProjects: ["MUSC Health capital expansion", "Hilton Head resort renovations", "BMW Manufacturing plant expansion"],
    complianceNotes: "Coastal wind exposure on barrier islands. No formal HVHZ but wind-rated preferred. Strong hospitality market in coastal zones.",
  },
  {
    stateCode: "TN",
    stateName: "Tennessee",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "Tennessee State Fire Marshal Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Office/Commercial", "Airport/Transit"],
    marketOpportunity: "high",
    annualConstructionBillions: 18.9,
    aaDistributorCount: 6,
    keyProjects: ["Vanderbilt University Medical Center expansion", "Nashville BNA airport modernization", "Nashville mixed-use development boom"],
    complianceNotes: "Nashville growth market — one of the fastest-growing metros. Strong healthcare and hospitality construction. No special wind or seismic requirements.",
  },
  {
    stateCode: "VA",
    stateName: "Virginia",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "Virginia Uniform Statewide Building Code 2018 (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Government", "Healthcare", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 27.1,
    aaDistributorCount: 8,
    keyProjects: ["Amazon HQ2 (Arlington) development", "Inova Health System capital expansion", "Dulles Airport renovation"],
    complianceNotes: "Large government and defense construction market near DC/Northern VA. Amazon HQ2 driving significant commercial construction. No HVHZ.",
  },
  {
    stateCode: "WV",
    stateName: "West Virginia",
    region: "Southeast",
    hvhzCounties: [],
    primaryBuildingCode: "West Virginia State Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Education"],
    marketOpportunity: "low",
    annualConstructionBillions: 2.9,
    aaDistributorCount: 2,
    keyProjects: ["WVU Medicine capital projects", "Cabell Huntington Hospital expansion", "Charleston state facility renovations"],
    complianceNotes: "Small market. Rural geography. Healthcare and government are dominant verticals.",
  },

  // ── Midwest ───────────────────────────────────────────────────────────────
  {
    stateCode: "IL",
    stateName: "Illinois",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Illinois Accessibility Code / IBC 2021",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Office/Commercial", "Airport/Transit"],
    marketOpportunity: "high",
    annualConstructionBillions: 34.2,
    aaDistributorCount: 10,
    keyProjects: ["O'Hare Airport Modernization Program", "Northwestern Medicine capital expansion", "Chicago Riverwalk development"],
    complianceNotes: "Illinois Accessibility Code (IAC) supplements IBC. O'Hare modernization is a multi-year major project. Chicago Local Law equivalent energy codes.",
  },
  {
    stateCode: "IN",
    stateName: "Indiana",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Indiana Building Code (IBC 2020 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Education"],
    marketOpportunity: "medium",
    annualConstructionBillions: 13.4,
    aaDistributorCount: 5,
    keyProjects: ["IU Health system capital expansion", "Indianapolis Airport renovation", "Purdue University campus development"],
    complianceNotes: "Stable mid-size market. Strong healthcare and university construction. No special wind or climate requirements.",
  },
  {
    stateCode: "IA",
    stateName: "Iowa",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Iowa State Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Education", "Government"],
    marketOpportunity: "low",
    annualConstructionBillions: 7.1,
    aaDistributorCount: 3,
    keyProjects: ["University of Iowa Hospitals expansion", "UnityPoint Health capital program", "Des Moines mixed-use development"],
    complianceNotes: "Agricultural state with solid healthcare and education market. Limited commercial density.",
  },
  {
    stateCode: "KS",
    stateName: "Kansas",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Kansas Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Airport/Transit"],
    marketOpportunity: "low",
    annualConstructionBillions: 6.8,
    aaDistributorCount: 3,
    keyProjects: ["University of Kansas Health System capital", "Wichita Airport renovation", "Kansas Statehouse complex projects"],
    complianceNotes: "Tornado zone — some structural wind considerations but no automatic door-specific HVHZ equivalent.",
  },
  {
    stateCode: "MI",
    stateName: "Michigan",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Michigan Building Code (IBC 2015 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Healthcare", "Office/Commercial", "Education"],
    marketOpportunity: "high",
    annualConstructionBillions: 22.8,
    aaDistributorCount: 7,
    keyProjects: ["Henry Ford Health hospital expansion", "Detroit Metro Airport renovation", "University of Michigan campus projects"],
    complianceNotes: "Large healthcare market anchored by Henry Ford, Beaumont, Spectrum. Michigan-specific amendments to IBC 2015. Cold climate — operator temperature range important.",
  },
  {
    stateCode: "MN",
    stateName: "Minnesota",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Minnesota State Building Code (IBC 2020 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Office/Commercial", "Education"],
    marketOpportunity: "high",
    annualConstructionBillions: 20.1,
    aaDistributorCount: 7,
    keyProjects: ["Mayo Clinic campus expansion (Rochester)", "M Health Fairview capital", "MSP Airport Terminal upgrade"],
    complianceNotes: "Very cold climate — operator rated to -40°F important for exterior applications. Mayo Clinic is a major account. IBC 2020 adopted.",
  },
  {
    stateCode: "MO",
    stateName: "Missouri",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Missouri Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Airport/Transit", "Office/Commercial"],
    marketOpportunity: "medium",
    annualConstructionBillions: 14.6,
    aaDistributorCount: 5,
    keyProjects: ["BJC HealthCare capital expansion", "STL Airport modernization", "St. Louis City SC stadium development"],
    complianceNotes: "Solid mid-tier market. Seismic zone consideration in New Madrid area. No HVHZ.",
  },
  {
    stateCode: "NE",
    stateName: "Nebraska",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Nebraska Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Education"],
    marketOpportunity: "low",
    annualConstructionBillions: 5.9,
    aaDistributorCount: 3,
    keyProjects: ["Nebraska Medicine capital program", "Omaha Airport renovation", "University of Nebraska campus development"],
    complianceNotes: "Small market. Agricultural/government economy. Standard IBC.",
  },
  {
    stateCode: "ND",
    stateName: "North Dakota",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "North Dakota Building Code (IBC 2015 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Education"],
    marketOpportunity: "low",
    annualConstructionBillions: 3.2,
    aaDistributorCount: 1,
    keyProjects: ["Sanford Health Fargo expansion", "North Dakota State University projects", "Bismarck federal building upgrades"],
    complianceNotes: "Very cold climate. Extreme low temperature performance (-40°F) critical. Minimal market volume.",
  },
  {
    stateCode: "OH",
    stateName: "Ohio",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Ohio Building Code 2019 (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Office/Commercial", "Education"],
    marketOpportunity: "high",
    annualConstructionBillions: 28.4,
    aaDistributorCount: 9,
    keyProjects: ["Cleveland Clinic capital expansion", "Ohio State Wexner Medical Center", "Columbus airport renovation"],
    complianceNotes: "Very strong healthcare market (Cleveland Clinic, Ohio State, Nationwide). Large distributor network. Cold climate.",
  },
  {
    stateCode: "SD",
    stateName: "South Dakota",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "South Dakota Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Education"],
    marketOpportunity: "low",
    annualConstructionBillions: 2.8,
    aaDistributorCount: 1,
    keyProjects: ["Avera Health capital expansion", "Sanford Health Sioux Falls projects", "SD State University campus"],
    complianceNotes: "Very small market. Extreme cold climate. Limited distributor coverage.",
  },
  {
    stateCode: "WI",
    stateName: "Wisconsin",
    region: "Midwest",
    hvhzCounties: [],
    primaryBuildingCode: "Wisconsin Commercial Building Code (IBC 2015 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Healthcare", "Education", "Office/Commercial"],
    marketOpportunity: "medium",
    annualConstructionBillions: 14.8,
    aaDistributorCount: 6,
    keyProjects: ["UW Health capital program", "Froedtert Hospital expansion", "Milwaukee Fiserv Forum development"],
    complianceNotes: "Cold climate. IBC 2015 with WI amendments. University and healthcare market strong. Growing Milwaukee commercial market.",
  },

  // ── Southwest ─────────────────────────────────────────────────────────────
  {
    stateCode: "AZ",
    stateName: "Arizona",
    region: "Southwest",
    hvhzCounties: [],
    primaryBuildingCode: "International Building Code 2018 (locally adopted)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Multi-Family", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 28.6,
    aaDistributorCount: 7,
    keyProjects: ["Banner Health system capital expansion", "Sky Harbor Airport renovation", "Phoenix metro mixed-use boom"],
    complianceNotes: "Extreme heat (+120°F) — operator high-temperature range important. Fastest-growing metro in NA. Large retirement community healthcare market.",
  },
  {
    stateCode: "CO",
    stateName: "Colorado",
    region: "Southwest",
    hvhzCounties: [],
    primaryBuildingCode: "Colorado Building Code (IBC 2021 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Airport/Transit", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 21.4,
    aaDistributorCount: 6,
    keyProjects: ["UCHealth capital expansion", "DIA Great Hall renovation", "Denver mixed-use development"],
    complianceNotes: "IBC 2021. Denver International Airport is major ongoing project. High altitude — no special door codes but HVAC integration sensitivity.",
  },
  {
    stateCode: "NM",
    stateName: "New Mexico",
    region: "Southwest",
    hvhzCounties: [],
    primaryBuildingCode: "New Mexico Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Education"],
    marketOpportunity: "low",
    annualConstructionBillions: 5.1,
    aaDistributorCount: 2,
    keyProjects: ["Presbyterian Healthcare capital", "Albuquerque Sunport Airport renovation", "Sandia National Labs facility upgrades"],
    complianceNotes: "Federal lab and defense presence. Small commercial market. No special climate requirements.",
  },
  {
    stateCode: "OK",
    stateName: "Oklahoma",
    region: "Southwest",
    hvhzCounties: [],
    primaryBuildingCode: "Oklahoma Uniform Building Code (IBC 2015 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Education"],
    marketOpportunity: "medium",
    annualConstructionBillions: 9.8,
    aaDistributorCount: 4,
    keyProjects: ["OU Health System capital expansion", "Tulsa International Airport renovation", "Oklahoma Energy Center development"],
    complianceNotes: "Tornado zone. Wind exposure but not HVHZ-equivalent regulation for pedestrian doors. Energy sector construction.",
  },
  {
    stateCode: "TX",
    stateName: "Texas",
    region: "Southwest",
    hvhzCounties: [],
    primaryBuildingCode: "International Building Code 2021 (locally adopted)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Office/Commercial", "Airport/Transit"],
    marketOpportunity: "critical",
    annualConstructionBillions: 95.0,
    aaDistributorCount: 18,
    keyProjects: ["Texas Medical Center Houston campus expansion", "DFW Airport Terminal F", "Austin tech corridor commercial development"],
    complianceNotes: "Second-largest NA market by construction volume. Texas Energy Code (IECC 2021) requires ASHRAE 90.1 compliance. Houston Gulf Coast wind exposure. No HVHZ but coastal counties have elevated wind requirements. Large and growing distributor network.",
  },
  {
    stateCode: "UT",
    stateName: "Utah",
    region: "Southwest",
    hvhzCounties: [],
    primaryBuildingCode: "Utah Building Code (IBC 2021 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Office/Commercial", "Hospitality"],
    marketOpportunity: "medium",
    annualConstructionBillions: 14.2,
    aaDistributorCount: 4,
    keyProjects: ["Intermountain Health capital program", "SLC Airport expansion", "Park City resort development"],
    complianceNotes: "Fast-growing market. Salt Lake City tech boom driving commercial construction. Mountain resort hospitality significant. IBC 2021.",
  },

  // ── West ──────────────────────────────────────────────────────────────────
  {
    stateCode: "AK",
    stateName: "Alaska",
    region: "West",
    hvhzCounties: [],
    primaryBuildingCode: "Alaska Building Code (IBC 2012 base)",
    adoptionStatus: "amended",
    keyVerticals: ["Government", "Healthcare", "Airport/Transit"],
    marketOpportunity: "low",
    annualConstructionBillions: 3.8,
    aaDistributorCount: 1,
    keyProjects: ["Providence Alaska Medical Center expansion", "Anchorage Ted Stevens Airport renovations", "Alaska Native Tribal Health Consortium projects"],
    complianceNotes: "Extreme cold climate (-50°F). Very limited commercial market. Federal and tribal construction dominant. Minimal distributor coverage. IBC 2012 base (older).",
  },
  {
    stateCode: "CA",
    stateName: "California",
    region: "West",
    hvhzCounties: [],
    primaryBuildingCode: "California Building Code 2022 (CBC 2022, IBC 2021 base with extensive amendments)",
    adoptionStatus: "state_specific",
    keyVerticals: ["Healthcare", "Office/Commercial", "Airport/Transit"],
    marketOpportunity: "critical",
    annualConstructionBillions: 110.0,
    aaDistributorCount: 20,
    keyProjects: ["LAX Automated People Mover terminal", "Kaiser Permanente capital program", "Bay Area tech campus development"],
    complianceNotes: "Largest NA market. California Title 24 (energy) requires door energy compliance. CBC 2022 with seismic requirements. ADA strictly enforced. OSHPD (now HCAI) for all healthcare. LA and SF Bay Area are dominant submarkets.",
  },
  {
    stateCode: "HI",
    stateName: "Hawaii",
    region: "West",
    hvhzCounties: [],
    primaryBuildingCode: "Hawaii State Building Code (IBC 2018 base, wind-specific amendments)",
    adoptionStatus: "amended",
    keyVerticals: ["Hospitality", "Healthcare", "Government"],
    marketOpportunity: "medium",
    annualConstructionBillions: 5.6,
    aaDistributorCount: 2,
    keyProjects: ["Queen's Medical Center expansion", "Honolulu Airport renovations", "Ko Olina resort development"],
    complianceNotes: "Hurricane and high-wind zone — product wind ratings important. Some counties have wind design requirements approaching HVHZ levels. Island logistics add lead time. Primarily hospitality and healthcare.",
  },
  {
    stateCode: "ID",
    stateName: "Idaho",
    region: "West",
    hvhzCounties: [],
    primaryBuildingCode: "Idaho Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Education", "Government"],
    marketOpportunity: "low",
    annualConstructionBillions: 5.9,
    aaDistributorCount: 2,
    keyProjects: ["Saint Alphonsus Health System projects", "Boise Airport expansion", "Micron semiconductor facility"],
    complianceNotes: "Small but growing market as Boise expands. Tech manufacturing growth (Micron). Cold climate.",
  },
  {
    stateCode: "MT",
    stateName: "Montana",
    region: "West",
    hvhzCounties: [],
    primaryBuildingCode: "Montana Building Codes (IBC 2021 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Hospitality"],
    marketOpportunity: "low",
    annualConstructionBillions: 3.1,
    aaDistributorCount: 1,
    keyProjects: ["Billings Clinic expansion", "Glacier National Park facility upgrades", "Montana State University projects"],
    complianceNotes: "Very cold climate. Small market. Glacier/Yellowstone proximity drives resort hospitality construction.",
  },
  {
    stateCode: "NV",
    stateName: "Nevada",
    region: "West",
    hvhzCounties: [],
    primaryBuildingCode: "Nevada Building Code (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Hospitality", "Healthcare", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 18.4,
    aaDistributorCount: 6,
    keyProjects: ["Las Vegas resort expansion (MSG Sphere area)", "Renown Health Reno expansion", "Tesla/tech gigafactory development"],
    complianceNotes: "Extreme heat (+115°F in Las Vegas). High-temperature operator performance important. Hospitality (Las Vegas Strip) is dominant vertical. Growing tech manufacturing.",
  },
  {
    stateCode: "OR",
    stateName: "Oregon",
    region: "West",
    hvhzCounties: [],
    primaryBuildingCode: "Oregon Structural Specialty Code (IBC 2021 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Office/Commercial", "Education"],
    marketOpportunity: "medium",
    annualConstructionBillions: 14.6,
    aaDistributorCount: 5,
    keyProjects: ["OHSU Hospital expansion", "PDX Airport terminal renovation", "Portland tech campus development"],
    complianceNotes: "Oregon energy codes are stringent — ASHRAE 90.1 compliance required. Seismic zone (Cascadia subduction). PDX Airport is major ongoing project. Growing Portland tech sector.",
  },
  {
    stateCode: "WA",
    stateName: "Washington",
    region: "West",
    hvhzCounties: [],
    primaryBuildingCode: "Washington State Building Code (IBC 2021 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Airport/Transit", "Office/Commercial"],
    marketOpportunity: "high",
    annualConstructionBillions: 32.8,
    aaDistributorCount: 9,
    keyProjects: ["UW Medicine capital expansion", "SEA-TAC Airport expansion", "Amazon/Microsoft campus development"],
    complianceNotes: "Strong tech sector drives commercial construction. Seismic zone (Cascadia). SEA-TAC major project. Washington State energy code requires ASHRAE 90.1.",
  },
  {
    stateCode: "WY",
    stateName: "Wyoming",
    region: "West",
    hvhzCounties: [],
    primaryBuildingCode: "Wyoming Building Codes (IBC 2018 base)",
    adoptionStatus: "adopted",
    keyVerticals: ["Healthcare", "Government", "Hospitality"],
    marketOpportunity: "low",
    annualConstructionBillions: 2.2,
    aaDistributorCount: 1,
    keyProjects: ["Wyoming Medical Center expansion", "Yellowstone facility upgrades", "Cheyenne VA Medical Center"],
    complianceNotes: "Very small market. Extreme cold and wind. Limited distributor network. Resort and park facilities.",
  },
];

// ─── Resource & Capacity Data ─────────────────────────────────────────────────

// (see resourceData above — same section, not duplicated)

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const gateOrder: GateStage[] = [
  "G0_idea",
  "G1_scoping",
  "G2_business_case",
  "G3_development",
  "G4_testing",
  "G5_launch",
  "sustain",
  "eol",
];

export const gateShortName: Record<GateStage, string> = {
  G0_idea: "G0",
  G1_scoping: "G1",
  G2_business_case: "G2",
  G3_development: "G3",
  G4_testing: "G4",
  G5_launch: "G5",
  sustain: "SUS",
  eol: "EOL",
};

export const gateFullName: Record<GateStage, string> = {
  G0_idea: "G0 — Idea Screen",
  G1_scoping: "G1 — Scoping",
  G2_business_case: "G2 — Business Case",
  G3_development: "G3 — Development",
  G4_testing: "G4 — Testing & Validation",
  G5_launch: "G5 — Launch",
  sustain: "Sustain",
  eol: "End of Life",
};

export const statusColors: Record<RoadmapStatus, string> = {
  concept: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  development: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  testing: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  launch: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  sustain: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  eol: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export const impactColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  medium: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  high: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  critical: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
};

export const brandColors: Record<Brand, string> = {
  "ASSA ABLOY": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  "RECORD": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
};

export const priorityColors: Record<string, string> = {
  p0: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  p1: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  p2: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  p3: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export const teamMemberColors: Record<string, string> = {
  "J. Tubbs": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  "A. Chen": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "S. Patel": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "M. Rivera": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  "T. Williams": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
  "B. Kim": "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300",
  "D. Torres": "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
  "RECORD Eng": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

// ─── Helper Functions (existing) ──────────────────────────────────────────────

export function getNextGate(current: GateStage): GateStage | null {
  const idx = gateOrder.indexOf(current);
  if (idx < 0 || idx >= gateOrder.length - 1) return null;
  return gateOrder[idx + 1];
}

export function getGateCriteria(gate: GateStage): GateCriterion[] {
  return stageCriteria.filter((c) => c.gate === gate);
}

export function getPortfolioStats() {
  const total = roadmapItems.length;
  const byStatus = roadmapItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<RoadmapStatus, number>);
  const byGate = roadmapItems.reduce((acc, item) => {
    acc[item.gateStage] = (acc[item.gateStage] || 0) + 1;
    return acc;
  }, {} as Record<GateStage, number>);
  const byBrand = roadmapItems.reduce((acc, item) => {
    acc[item.brand] = (acc[item.brand] || 0) + 1;
    return acc;
  }, {} as Record<Brand, number>);
  const criticalCount = roadmapItems.filter((i) => i.impact === "critical").length;
  const totalBudget = roadmapItems.reduce((sum, i) => sum + (i.budget || 0), 0);
  const activeItems = roadmapItems.filter((i) => !["sustain", "eol"].includes(i.status));
  const atRiskItems = roadmapItems.filter((i) => i.impact === "critical" && ["concept", "development"].includes(i.status));
  return { total, byStatus, byGate, byBrand, criticalCount, totalBudget, activeItems: activeItems.length, atRiskItems: atRiskItems.length };
}

// ─── Helper Functions (3.0 additions) ────────────────────────────────────────

/** Get state market data by 2-letter state code */
export function getStateData(code: string): StateMarketData | undefined {
  return stateMarketData.find((s) => s.stateCode === code.toUpperCase());
}

/** Get all comments for a given roadmap item ID */
export function getItemComments(id: string): Comment[] {
  const item = roadmapItems.find((i) => i.id === id);
  return item?.comments ?? [];
}

/** Get all roadmap items linked to the given item ID (via linkedTasks) */
export function getLinkedItems(id: string): RoadmapItem[] {
  const item = roadmapItems.find((i) => i.id === id);
  if (!item) return [];
  return roadmapItems.filter((i) => item.linkedTasks.includes(i.id));
}

/** Get a team member by their display name */
export function getTeamMember(name: string): TeamMember | undefined {
  return teamMembers.find(
    (m) => m.name.toLowerCase() === name.toLowerCase() ||
           m.initials.toLowerCase() === name.toLowerCase()
  );
}

/** Get all roadmap items scoped to a specific state */
export function getItemsByState(stateCode: string): RoadmapItem[] {
  const code = stateCode.toUpperCase();
  return roadmapItems.filter(
    (i) => i.stateScope.length === 0 || i.stateScope.includes(code)
  );
}

/** Get all roadmap items for a given assignee */
export function getItemsByAssignee(name: string): RoadmapItem[] {
  return roadmapItems.filter((i) => i.assignees.includes(name));
}

/** Get roadmap items by priority */
export function getItemsByPriority(priority: "p0" | "p1" | "p2" | "p3"): RoadmapItem[] {
  return roadmapItems.filter((i) => i.priority === priority);
}

/** Get states by market opportunity level */
export function getStatesByOpportunity(level: "low" | "medium" | "high" | "critical"): StateMarketData[] {
  return stateMarketData.filter((s) => s.marketOpportunity === level);
}

/** Get all HVHZ-designated states (states with non-empty hvhzCounties) */
export function getHVHZStates(): StateMarketData[] {
  return stateMarketData.filter((s) => s.hvhzCounties.length > 0);
}

/** Get roadmap items with HVHZ scope */
export function getHVHZItems(): RoadmapItem[] {
  return roadmapItems.filter(
    (i) => i.stateScope.includes("FL") || i.tags.includes("FL_hvhz") || i.tags.includes("hurricane") || i.tags.includes("hvhz")
  );
}

/** Summarize completion across all active items */
export function getPortfolioCompletion(): { avgCompletionPct: number; byPriority: Record<string, number> } {
  const active = roadmapItems.filter((i) => !["sustain", "eol"].includes(i.status));
  const avg = active.length > 0
    ? Math.round(active.reduce((sum, i) => sum + i.completionPct, 0) / active.length)
    : 0;
  const byPriority: Record<string, number> = { p0: 0, p1: 0, p2: 0, p3: 0 };
  (["p0", "p1", "p2", "p3"] as const).forEach((p) => {
    const items = active.filter((i) => i.priority === p);
    byPriority[p] = items.length > 0
      ? Math.round(items.reduce((sum, i) => sum + i.completionPct, 0) / items.length)
      : 0;
  });
  return { avgCompletionPct: avg, byPriority };
}

// ─── PM STUDIO 4.0 — NEW DATA STRUCTURES ──────────────────────────────────

// ─── Product Line Health ───────────────────────────────────────────────────

export interface ProductLineHealth {
  name: string;
  brand: "ASSA ABLOY" | "RECORD";
  revenueRange: string; // e.g. "$8–12M/yr"
  revenueMid: number;   // numeric mid for charts
  nps: number;
  lifecycle: "Growth" | "Mature" | "Sustain" | "EOL-Risk";
  winRate: number;      // percent
  topVertical: string;
  healthScore: number;  // 0–100
  sparkline: number[];  // 6-month relative revenue index
  competitor: string;
  dealLossReason: string;
  trend: "up" | "down" | "flat";
}

export const productLineHealthData: ProductLineHealth[] = [
  {
    name: "SL500",
    brand: "ASSA ABLOY",
    revenueRange: "$8–12M/yr",
    revenueMid: 10,
    nps: 72,
    lifecycle: "Mature",
    winRate: 58,
    topVertical: "Retail",
    healthScore: 74,
    sparkline: [82, 85, 88, 84, 90, 92],
    competitor: "dormakaba",
    dealLossReason: "Price competitiveness",
    trend: "up",
  },
  {
    name: "SW300",
    brand: "ASSA ABLOY",
    revenueRange: "$4–6M/yr",
    revenueMid: 5,
    nps: 61,
    lifecycle: "Sustain",
    winRate: 52,
    topVertical: "Office/Commercial",
    healthScore: 57,
    sparkline: [55, 58, 56, 54, 57, 55],
    competitor: "dormakaba",
    dealLossReason: "Header depth — retrofit losses",
    trend: "flat",
  },
  {
    name: "VersaMax",
    brand: "ASSA ABLOY",
    revenueRange: "$6–9M/yr",
    revenueMid: 7.5,
    nps: 68,
    lifecycle: "Growth",
    winRate: 63,
    topVertical: "Healthcare",
    healthScore: 78,
    sparkline: [60, 65, 70, 72, 75, 80],
    competitor: "Tormax",
    dealLossReason: "Hermetic sliding capability gap",
    trend: "up",
  },
  {
    name: "RECORD TSA 20",
    brand: "RECORD",
    revenueRange: "$2–4M/yr",
    revenueMid: 3,
    nps: 74,
    lifecycle: "Growth",
    winRate: 71,
    topVertical: "Healthcare",
    healthScore: 82,
    sparkline: [40, 50, 60, 68, 74, 82],
    competitor: "Stanley Access",
    dealLossReason: "Channel awareness (newer to NA)",
    trend: "up",
  },
  {
    name: "RECORD TSA 22",
    brand: "RECORD",
    revenueRange: "$3–5M/yr",
    revenueMid: 4,
    nps: 71,
    lifecycle: "Growth",
    winRate: 66,
    topVertical: "Airport/Transit",
    healthScore: 77,
    sparkline: [45, 52, 58, 63, 68, 75],
    competitor: "Tormax",
    dealLossReason: "UL certification lag",
    trend: "up",
  },
  {
    name: "RECORD TSA 320",
    brand: "RECORD",
    revenueRange: "$1.5–2.5M/yr",
    revenueMid: 2,
    nps: 65,
    lifecycle: "Growth",
    winRate: 61,
    topVertical: "Airport/Transit",
    healthScore: 69,
    sparkline: [30, 35, 38, 40, 44, 48],
    competitor: "Tormax",
    dealLossReason: "Distributor onboarding incomplete",
    trend: "up",
  },
  {
    name: "Windcord 5400",
    brand: "ASSA ABLOY",
    revenueRange: "$1–2M/yr",
    revenueMid: 1.5,
    nps: 69,
    lifecycle: "Mature",
    winRate: 55,
    topVertical: "Education",
    healthScore: 63,
    sparkline: [48, 50, 49, 51, 50, 52],
    competitor: "Stanley Access",
    dealLossReason: "Price in commodity segment",
    trend: "flat",
  },
  {
    name: "Windcord 5500",
    brand: "ASSA ABLOY",
    revenueRange: "$0.5–1.5M/yr",
    revenueMid: 1,
    nps: 66,
    lifecycle: "Sustain",
    winRate: 50,
    topVertical: "Retail",
    healthScore: 55,
    sparkline: [38, 36, 37, 35, 36, 34],
    competitor: "dormakaba",
    dealLossReason: "Aging platform vs. slim competitors",
    trend: "down",
  },
  {
    name: "FlipFlow",
    brand: "ASSA ABLOY",
    revenueRange: "$0.8–1.5M/yr",
    revenueMid: 1.15,
    nps: 70,
    lifecycle: "Growth",
    winRate: 67,
    topVertical: "Healthcare",
    healthScore: 72,
    sparkline: [42, 45, 48, 50, 54, 58],
    competitor: "Tormax",
    dealLossReason: "Limited install base references",
    trend: "up",
  },
  {
    name: "6000 Swing",
    brand: "ASSA ABLOY",
    revenueRange: "$0.4–0.8M/yr",
    revenueMid: 0.6,
    nps: 60,
    lifecycle: "EOL-Risk",
    winRate: 0,
    topVertical: "Government",
    healthScore: 42,
    sparkline: [45, 42, 40, 38, 36, 32],
    competitor: "dormakaba",
    dealLossReason: "Platform EOL — no new spec wins",
    trend: "down",
  },
  {
    name: "8000 HD Swing",
    brand: "ASSA ABLOY",
    revenueRange: "$0.3–0.6M/yr",
    revenueMid: 0.45,
    nps: 58,
    lifecycle: "EOL-Risk",
    winRate: 0,
    topVertical: "Government",
    healthScore: 38,
    sparkline: [30, 28, 26, 25, 23, 20],
    competitor: "Stanley Access",
    dealLossReason: "Platform EOL — parts availability risk",
    trend: "down",
  },
  {
    name: "ecoLOGIC",
    brand: "ASSA ABLOY",
    revenueRange: "$0.5–1M/yr",
    revenueMid: 0.75,
    nps: 80,
    lifecycle: "Growth",
    winRate: 78,
    topVertical: "Office/Commercial",
    healthScore: 88,
    sparkline: [40, 48, 56, 64, 74, 85],
    competitor: "Siemens (BMS)",
    dealLossReason: "BMS native integration gap",
    trend: "up",
  },
];

// ─── Forecast Data ─────────────────────────────────────────────────────────

export interface ForecastDataPoint {
  year: number;
  value: number;
  aaTarget: number;
}

export interface VerticalForecast {
  vertical: string;
  color: string;
  data: ForecastDataPoint[];
}

export const verticalForecasts: VerticalForecast[] = [
  {
    vertical: "Healthcare",
    color: "#14b8a6",
    data: [
      { year: 2025, value: 285, aaTarget: 96.9 },
      { year: 2026, value: 312, aaTarget: 109.2 },
      { year: 2027, value: 341, aaTarget: 122.8 },
      { year: 2028, value: 370, aaTarget: 136.9 },
    ],
  },
  {
    vertical: "Airport/Transit",
    color: "#6366f1",
    data: [
      { year: 2025, value: 310, aaTarget: 105.4 },
      { year: 2026, value: 338, aaTarget: 118.3 },
      { year: 2027, value: 369, aaTarget: 132.8 },
      { year: 2028, value: 402, aaTarget: 148.7 },
    ],
  },
  {
    vertical: "Retail",
    color: "#f59e0b",
    data: [
      { year: 2025, value: 195, aaTarget: 66.3 },
      { year: 2026, value: 208, aaTarget: 72.8 },
      { year: 2027, value: 222, aaTarget: 79.9 },
      { year: 2028, value: 237, aaTarget: 87.7 },
    ],
  },
  {
    vertical: "Office/Commercial",
    color: "#8b5cf6",
    data: [
      { year: 2025, value: 178, aaTarget: 60.5 },
      { year: 2026, value: 185, aaTarget: 64.8 },
      { year: 2027, value: 193, aaTarget: 69.5 },
      { year: 2028, value: 201, aaTarget: 74.4 },
    ],
  },
  {
    vertical: "Education",
    color: "#22c55e",
    data: [
      { year: 2025, value: 142, aaTarget: 48.3 },
      { year: 2026, value: 152, aaTarget: 53.2 },
      { year: 2027, value: 163, aaTarget: 58.7 },
      { year: 2028, value: 175, aaTarget: 64.8 },
    ],
  },
];

// ─── Construction Pipeline Signals ────────────────────────────────────────

export interface ConstructionSignal {
  region: string;
  demandHeatIndex: number;
  starts: number;
  permits: number;
  dodgeProjects: number;
  trend: "up" | "down" | "flat";
}

export const constructionSignals: ConstructionSignal[] = [
  { region: "Northeast", demandHeatIndex: 78, starts: 14200, permits: 16800, dodgeProjects: 342, trend: "up" },
  { region: "Southeast", demandHeatIndex: 91, starts: 28900, permits: 34100, dodgeProjects: 618, trend: "up" },
  { region: "Midwest", demandHeatIndex: 65, starts: 11200, permits: 13400, dodgeProjects: 287, trend: "flat" },
  { region: "Southwest", demandHeatIndex: 88, starts: 22400, permits: 26700, dodgeProjects: 491, trend: "up" },
  { region: "West", demandHeatIndex: 82, starts: 18600, permits: 22100, dodgeProjects: 407, trend: "up" },
];

export interface OpportunityState {
  state: string;
  region: string;
  projects: number;
  trend: "up" | "down" | "flat";
}

export const opportunityStates: OpportunityState[] = [
  { state: "TX", region: "Southwest", projects: 847, trend: "up" },
  { state: "FL", region: "Southeast", projects: 712, trend: "up" },
  { state: "CA", region: "West", projects: 1203, trend: "flat" },
  { state: "AZ", region: "Southwest", projects: 428, trend: "up" },
  { state: "NY", region: "Northeast", projects: 634, trend: "flat" },
  { state: "GA", region: "Southeast", projects: 389, trend: "up" },
];

// ─── Regulatory Timeline ──────────────────────────────────────────────────

export interface RegEventItem {
  date: string;
  title: string;
  description: string;
  type: "tailwind" | "headwind" | "opportunity";
  xPct: number; // 0–100 % position on 2025–2028 timeline
}

export const regulatoryTimeline: RegEventItem[] = [
  {
    date: "Jan 2026",
    title: "NBC 2025 Canada effective",
    description: "Expands power-operated door requirements — tailwind for all NA products sold in Canada.",
    type: "tailwind",
    xPct: 25,
  },
  {
    date: "Q2 2026",
    title: "ANSI A156.10-2024 cert deadline",
    description: "Recertification cost and lab scheduling risk for SL500, VersaMax, TSA 22.",
    type: "headwind",
    xPct: 31,
  },
  {
    date: "Dec 2026",
    title: "FBC 9th Edition (HVHZ)",
    description: "Florida Building Code 9th Ed. effective — HVHZ tailwind, expected FL market surge.",
    type: "tailwind",
    xPct: 50,
  },
  {
    date: "2027",
    title: "ADA Title II digital accessibility",
    description: "ADA Title II rules for state/local gov — swing door retrofit opportunity in government vertical.",
    type: "opportunity",
    xPct: 62,
  },
  {
    date: "2028",
    title: "LEED v5 adoption expected",
    description: "BMS-native door operators likely required — ecoLOGIC integration opportunity.",
    type: "opportunity",
    xPct: 88,
  },
];

// ─── Revenue Scenarios ────────────────────────────────────────────────────

export interface RevenueScenario {
  label: "Base Case" | "Bull Case" | "Bear Case";
  color: string;
  description: string;
  data: { fy: string; revenue: number }[];
}

export const revenueScenarios: RevenueScenario[] = [
  {
    label: "Base Case",
    color: "#14b8a6",
    description: "Organic growth, RECORD NA ramp as planned",
    data: [
      { fy: "FY2025", revenue: 44.3 },
      { fy: "FY2026", revenue: 49.8 },
      { fy: "FY2027", revenue: 56.2 },
      { fy: "FY2028", revenue: 63.1 },
    ],
  },
  {
    label: "Bull Case",
    color: "#6366f1",
    description: "FBC 9th surge + INORA NA launch + high win rate",
    data: [
      { fy: "FY2025", revenue: 44.3 },
      { fy: "FY2026", revenue: 54.1 },
      { fy: "FY2027", revenue: 63.8 },
      { fy: "FY2028", revenue: 75.2 },
    ],
  },
  {
    label: "Bear Case",
    color: "#f43f5e",
    description: "Supply chain disruption + interest rate headwind",
    data: [
      { fy: "FY2025", revenue: 44.3 },
      { fy: "FY2026", revenue: 46.2 },
      { fy: "FY2027", revenue: 49.1 },
      { fy: "FY2028", revenue: 52.0 },
    ],
  },
];

// ─── Deal Velocity ────────────────────────────────────────────────────────

export interface DealVelocityItem {
  id: string;
  projectName: string;
  state: string;
  sizeMillion: number;
  vertical: string;
  product: string;
  stage: "Concept" | "Spec'd" | "Bidding" | "Awarded";
  closeProbability: number;
}

export const activeDeals: DealVelocityItem[] = [
  { id: "dv-001", projectName: "Miami Int'l Airport Terminal D", state: "FL", sizeMillion: 4.2, vertical: "Airport/Transit", product: "Windcord 5400", stage: "Spec'd", closeProbability: 82 },
  { id: "dv-002", projectName: "Mass General Brigham Hospital Expansion", state: "MA", sizeMillion: 2.8, vertical: "Healthcare", product: "VersaMax + TSA 320", stage: "Spec'd", closeProbability: 74 },
  { id: "dv-003", projectName: "Hudson Yards Phase 3", state: "NY", sizeMillion: 3.1, vertical: "Office/Commercial", product: "SW300-S", stage: "Bidding", closeProbability: 61 },
  { id: "dv-004", projectName: "Whole Foods Distribution Center", state: "TX", sizeMillion: 1.4, vertical: "Retail", product: "SL500", stage: "Bidding", closeProbability: 55 },
  { id: "dv-005", projectName: "DFW Airport Concourse H", state: "TX", sizeMillion: 5.1, vertical: "Airport/Transit", product: "Windcord 5500", stage: "Concept", closeProbability: 38 },
];

// ─── Market Signal Feed ───────────────────────────────────────────────────

export interface MarketSignalFeed {
  id: string;
  headline: string;
  timeAgo: string;
  severity: "critical" | "high" | "medium" | "low";
  icon: string;
  category: "regulatory" | "competitive" | "market" | "internal";
}

export const signalFeed: MarketSignalFeed[] = [
  { id: "sf-001", headline: "Florida DOT announces $2.1B terminal expansion at MIA — high door automation potential", timeAgo: "2 days ago", severity: "critical", icon: "✈️", category: "market" },
  { id: "sf-002", headline: "Hospital construction starts up 14% in Southeast Q1 2026 — tailwind for VersaMax/TSA 320", timeAgo: "3 days ago", severity: "high", icon: "🏥", category: "market" },
  { id: "sf-003", headline: "dormakaba reports 8% decline in NA automatic door revenue — window for competitive displacement", timeAgo: "5 days ago", severity: "high", icon: "⚔️", category: "competitive" },
  { id: "sf-004", headline: "ANSI A156.10 subcommittee meeting — FBC 9th Edition integration discussion", timeAgo: "1 week ago", severity: "medium", icon: "📋", category: "regulatory" },
  { id: "sf-005", headline: "Amazon logistics announces 23 new facilities in Sun Belt 2026 — high-traffic sliding door opportunity", timeAgo: "1 week ago", severity: "high", icon: "📦", category: "market" },
  { id: "sf-006", headline: "Canadian federal budget allocates C$4.2B for transit infrastructure — accessibility door play", timeAgo: "10 days ago", severity: "high", icon: "🇨🇦", category: "market" },
  { id: "sf-007", headline: "Stanley Access acquires Horton Automatics North American distribution", timeAgo: "2 weeks ago", severity: "critical", icon: "⚠️", category: "competitive" },
  { id: "sf-008", headline: "LEED v5 draft released — BMS-native door operators likely required", timeAgo: "2 weeks ago", severity: "high", icon: "🌿", category: "regulatory" },
  { id: "sf-009", headline: "UL 325:2023 enforcement begins — non-compliant operators face field recall risk", timeAgo: "3 weeks ago", severity: "critical", icon: "🔴", category: "regulatory" },
  { id: "sf-010", headline: "New York City Local Law 97 fines begin — energy-efficient vestibule opportunity", timeAgo: "3 weeks ago", severity: "medium", icon: "🏙️", category: "market" },
  { id: "sf-011", headline: "GSA announces federal building modernization — government vertical opportunity", timeAgo: "1 month ago", severity: "medium", icon: "🏛️", category: "market" },
  { id: "sf-012", headline: "RECORD TSA 20 wins spec at UC San Diego Medical Center — first US healthcare reference", timeAgo: "1 month ago", severity: "high", icon: "🏆", category: "internal" },
];

// ─── NPS Trend Data ───────────────────────────────────────────────────────

export interface NpsTrendPoint {
  quarter: string;
  SL500: number;
  VersaMax: number;
  "TSA 20": number;
  ecoLOGIC: number;
}

export const npsTrendData: NpsTrendPoint[] = [
  { quarter: "Q3'24", SL500: 65, VersaMax: 60, "TSA 20": 62, ecoLOGIC: 70 },
  { quarter: "Q4'24", SL500: 67, VersaMax: 62, "TSA 20": 65, ecoLOGIC: 73 },
  { quarter: "Q1'25", SL500: 69, VersaMax: 64, "TSA 20": 68, ecoLOGIC: 75 },
  { quarter: "Q2'25", SL500: 70, VersaMax: 65, "TSA 20": 70, ecoLOGIC: 77 },
  { quarter: "Q3'25", SL500: 71, VersaMax: 67, "TSA 20": 72, ecoLOGIC: 79 },
  { quarter: "Q4'25", SL500: 72, VersaMax: 68, "TSA 20": 74, ecoLOGIC: 80 },
];

// ─── Time-to-Market KPIs ──────────────────────────────────────────────────

export interface TtmKpi {
  stage: string;
  avgDays: number;
  benchmarkDays: number;
}

export const ttmKpis: TtmKpi[] = [
  { stage: "G0→G1", avgDays: 45, benchmarkDays: 30 },
  { stage: "G1→G2", avgDays: 90, benchmarkDays: 60 },
  { stage: "G2→G3", avgDays: 120, benchmarkDays: 90 },
  { stage: "G3→G4", avgDays: 180, benchmarkDays: 150 },
  { stage: "G4→G5", avgDays: 60, benchmarkDays: 45 },
];

// ─── Market Intelligence ──────────────────────────────────────────────────

export const MARKET_INTELLIGENCE = {
  naAutoDoorsMarket: {
    tam2025: 1320, // $M
    tam2035: 1880, // $M
    cagr: 3.6, // %
    usPct: 89, // % of NA market
    usSize2025: 1175, // $M
    slidingDoorShare: 41, // % of total
    source: "Global Market Insights, Dec 2025",
  },
  competitiveShare: {
    top5Combined: 30, // % — ASSA ABLOY, Allegion/Stanley, dormakaba, Boon Edam, Nabtesco
    aaBlumetaShare: 29, // % — ASSA ABLOY + dormakaba combined (from brief)
    fragmented: 70, // % remaining fragmented
    note: "70% of market fragmented across regional players and service companies",
  },
  sensorMarket: {
    size2024: 1030, // $M
    cagr: 6.14, // %
    irShare: 38, // % infrared dominates
    lidarGrowth: "Premium emerging — 31% better response time vs IR",
    aiVisionTrend: "AI-powered computer vision for intent prediction emerging",
    keyOEMs: ["BEA", "Optex", "Pepperl+Fuchs"],
    source: "SkyQuest/GMI 2025",
  },
  verticalGrowth: {
    healthcare: { yoy: 12, driver: "Touchless/infection control mandates, aging population, hospital expansion" },
    government: { yoy: 15, driver: "Infrastructure bills, security upgrades, federal facility modernization" },
    airportTransit: { yoy: 11, driver: "Airport modernization wave, high-capacity door demand" },
    officeCommercial: { yoy: 5, driver: "Return-to-office, smart building integration" },
    retail: { yoy: 4, driver: "Big-box renovation cycles, energy efficiency mandates" },
  },
  touchlessTrend: {
    biometricAdoptionIncrease: 38, // % increase in biometric-enabled doors at corporate facilities
    touchlessDemandDriver: "Post-pandemic hygiene mandates drove 38% increase",
    iotPredictiveMaintenance: "Competitors using AI predictive maintenance cutting downtime by 32% (dormakaba benchmark)",
  },
};

// ─── Win/Loss Data ────────────────────────────────────────────────────────

export interface WinLossEntry {
  id: string;
  date: string;
  outcome: "win" | "loss" | "no_decision";
  competitor: string;
  projectType: string;
  vertical: string;
  region: string;
  state: string;
  primaryReason: string;
  secondaryReasons: string[];
  dealSize: string;
  notes: string;
  actionable: string;
}

export const WIN_LOSS_DATA: WinLossEntry[] = [
  {
    id: "wl001",
    date: "2025-01-15",
    outcome: "loss",
    competitor: "dormakaba",
    projectType: "New Construction",
    vertical: "Healthcare",
    region: "Southeast",
    state: "GA",
    primaryReason: "Price",
    secondaryReasons: ["AI predictive maintenance feature request", "Existing dormakaba relationship"],
    dealSize: "$150K-$500K",
    notes: "Hospital in Atlanta — spec'd on dormakaba's predictive maintenance platform. Our ecoLOGIC pitch didn't close the gap. They valued the AI diagnostics dashboard over our AAADM service network density in that market.",
    actionable: "Develop ecoLOGIC AI diagnostics feature. Quantify AAADM response time vs dormakaba in Southeast — we should be faster.",
  },
  {
    id: "wl002",
    date: "2025-02-03",
    outcome: "loss",
    competitor: "dormakaba",
    projectType: "Renovation",
    vertical: "Airport/Transit",
    region: "Northeast",
    state: "NY",
    primaryReason: "Existing relationship",
    secondaryReasons: ["700lb capacity gap vs Stanley", "Price"],
    dealSize: "$200K-$500K",
    notes: "JFK terminal — lost on capacity. SL500 tops at 550lb, Stanley M-Force hits 700lb. Distributor said the heavy-duty capacity was a hard spec requirement for baggage handling areas.",
    actionable: "SL500 heavy-duty variant roadmap item. 700lb capacity gap is documented. Escalate to engineering.",
  },
  {
    id: "wl003",
    date: "2025-01-28",
    outcome: "win",
    competitor: "allegion_stanley",
    projectType: "New Construction",
    vertical: "Healthcare",
    region: "Southeast",
    state: "FL",
    primaryReason: "HVHZ certification",
    secondaryReasons: ["AAADM service network", "ecoLOGIC energy management"],
    dealSize: "$50K-$150K",
    notes: "Hospital expansion in Miami-Dade — Stanley had no HVHZ-rated product. Our SL500 R104 was the only auto sliding door with Miami-Dade NOA approval. Closed without discount.",
    actionable: "HVHZ advantage is a winner in FL — make sure every FL distributor knows R104 specs cold.",
  },
  {
    id: "wl004",
    date: "2025-02-18",
    outcome: "win",
    competitor: "allegion_stanley",
    projectType: "Renovation",
    vertical: "Retail",
    region: "Southeast",
    state: "FL",
    primaryReason: "Service network",
    secondaryReasons: ["Allegion integration concerns", "Lead time"],
    dealSize: "$25K-$75K",
    notes: "Big box retrofit — distributor concerned about post-Allegion acquisition service responsiveness for Stanley. AAADM certified service story won the day. Allegion integration uncertainty is a real customer concern.",
    actionable: "Allegion acquisition confusion is a selling point window — some customers uncertain about Stanley support post-acquisition.",
  },
  {
    id: "wl005",
    date: "2025-03-05",
    outcome: "win",
    competitor: "geze",
    projectType: "New Construction",
    vertical: "Office/Commercial",
    region: "Southwest",
    state: "TX",
    primaryReason: "US service network",
    secondaryReasons: ["AAADM certification", "Lead time"],
    dealSize: "$75K-$200K",
    notes: "Corporate HQ in Austin — architect initially spec'd GEZE for myGEZE IoT platform. Distributor countered with ecoLOGIC + SW300-S Bluetooth config. Closed on service network — GEZE cannot match our AAADM density in Texas.",
    actionable: "IoT is GEZE's strongest pitch — our ecoLOGIC + SW300-S needs stronger marketing.",
  },
  {
    id: "wl006",
    date: "2025-03-22",
    outcome: "loss",
    competitor: "geze",
    projectType: "New Construction",
    vertical: "Office/Commercial",
    region: "West",
    state: "CA",
    primaryReason: "IoT/BMS integration",
    secondaryReasons: ["myGEZE platform features", "European brand preference"],
    dealSize: "$100K-$300K",
    notes: "San Francisco tech HQ — architect hard-spec'd BACnet/Modbus native integration for their BMS. myGEZE Control had native plug-and-play they'd verified in a prior project. Our ecoLOGIC BACnet integration required additional config that the specifier didn't want to deal with.",
    actionable: "BACnet native integration needs to be plug-and-play like myGEZE. Engineering ticket.",
  },
  {
    id: "wl007",
    date: "2025-02-12",
    outcome: "loss",
    competitor: "boon_edam",
    projectType: "New Construction",
    vertical: "Government",
    region: "Northeast",
    state: "MA",
    primaryReason: "Security requirement",
    secondaryReasons: ["Anti-tailgating spec", "Biometric integration"],
    dealSize: "$200K-$500K",
    notes: "Federal building in Boston — hard spec for anti-tailgating portal with biometric integration. Boon Edam's Tourlock 180 with Alcatraz facial recognition was the only product that met the security spec. We don't have a revolving door with equivalent biometric integration.",
    actionable: "Government security segment: need biometric integration partnership or revolving door product. Boon Edam owns this niche.",
  },
  {
    id: "wl008",
    date: "2025-01-10",
    outcome: "win",
    competitor: "horton",
    projectType: "New Construction",
    vertical: "Healthcare",
    region: "Southeast",
    state: "FL",
    primaryReason: "VersaMax ICU features",
    secondaryReasons: ["NFPA 101 compliance", "AAADM service"],
    dealSize: "$75K-$200K",
    notes: "New hospital ICU wing in Tampa — VersaMax won on full NFPA 101-2024 controlled-egress compatibility and ASHRAE 170-2021 pressure differential maintenance. Horton's Profiler ICU was specced initially but couldn't document the same compliance package.",
    actionable: "NFPA 101 controlled-egress + ASHRAE 170 is a healthcare winning combo. Document this win for healthcare case study.",
  },
  {
    id: "wl009",
    date: "2025-03-30",
    outcome: "no_decision",
    competitor: "dorma",
    projectType: "New Construction",
    vertical: "Multi-Family",
    region: "Southeast",
    state: "FL",
    primaryReason: "Budget delayed",
    secondaryReasons: ["Package delivery vestibule indecision", "General contractor delays"],
    dealSize: "$25K-$75K",
    notes: "Multi-family package delivery vestibule in Orlando — project delayed due to GC budget reforecast. No competitor won, deal pushed to Q3 2025.",
    actionable: "Follow up Q3. Multi-family package vestibule is emerging segment — no AA dominant product yet.",
  },
  {
    id: "wl010",
    date: "2025-01-22",
    outcome: "loss",
    competitor: "nabco",
    projectType: "Renovation",
    vertical: "Retail",
    region: "Midwest",
    state: "IL",
    primaryReason: "Price",
    secondaryReasons: ["Incumbent relationship", "Speed of install"],
    dealSize: "$15K-$50K",
    notes: "Grocery chain retrofit in Chicago — NABCO was 15% cheaper and already had a service relationship. We couldn't justify the premium on a basic sliding door retrofit.",
    actionable: "Retail retrofit segment: need competitive pricing tier for high-volume low-complexity installs.",
  },
  {
    id: "wl011",
    date: "2025-02-28",
    outcome: "win",
    competitor: "tormax",
    projectType: "New Construction",
    vertical: "Education",
    region: "Southwest",
    state: "AZ",
    primaryReason: "AAADM certification",
    secondaryReasons: ["Warranty terms", "Lead time"],
    dealSize: "$50K-$150K",
    notes: "University building in Phoenix — facilities manager had been burned by TORMAX service delays. AAADM factory-certified story + 3-year warranty sealed the deal.",
    actionable: "TORMAX service issues are documented in the field — AAADM certification is a tangible differentiator.",
  },
  {
    id: "wl012",
    date: "2025-03-18",
    outcome: "win",
    competitor: "allegion_stanley",
    projectType: "New Construction",
    vertical: "Airport/Transit",
    region: "Southeast",
    state: "FL",
    primaryReason: "HVHZ + capacity",
    secondaryReasons: ["AAADM", "ecoLOGIC energy monitoring"],
    dealSize: "$300K-$800K",
    notes: "Airport terminal expansion in Fort Lauderdale — HVHZ was a hard requirement. Stanley had no HVHZ-rated high-traffic door. SL500 R104 in high-traffic configuration with ecoLOGIC won it.",
    actionable: "Airport + HVHZ combo is where we're unbeatable. Build a case study.",
  },
  {
    id: "wl013",
    date: "2025-04-02",
    outcome: "loss",
    competitor: "dormakaba",
    projectType: "New Construction",
    vertical: "Healthcare",
    region: "Midwest",
    state: "OH",
    primaryReason: "Pricing",
    secondaryReasons: ["Distributor preference", "Existing install base"],
    dealSize: "$100K-$250K",
    notes: "Ohio hospital system — dormakaba already had 60% of the existing install base. Switch cost to us wasn't justified without a clear technical differentiation they cared about.",
    actionable: "Install base incumbency is hard to break on price. Need to get in early in design phase.",
  },
  {
    id: "wl014",
    date: "2025-04-08",
    outcome: "win",
    competitor: "nabco",
    projectType: "Renovation",
    vertical: "Healthcare",
    region: "Southeast",
    state: "GA",
    primaryReason: "VersaMax compliance",
    secondaryReasons: ["NFPA 101", "Service network"],
    dealSize: "$40K-$100K",
    notes: "Assisted living renovation in Atlanta — NABCO couldn't document NFPA 101-2024 controlled-egress compliance for memory care unit. VersaMax with documented compliance package won.",
    actionable: "NFPA 101-2024 controlled-egress is a healthcare compliance closer. Get this in every healthcare sales kit.",
  },
  {
    id: "wl015",
    date: "2025-04-11",
    outcome: "win",
    competitor: "geze",
    projectType: "Renovation",
    vertical: "Office/Commercial",
    region: "Southeast",
    state: "FL",
    primaryReason: "Service network",
    secondaryReasons: ["Lead time", "HVHZ awareness"],
    dealSize: "$60K-$150K",
    notes: "Corporate campus in Orlando — GEZE pitched myGEZE cloud platform aggressively. We won on AAADM certified service + ecoLOGIC + superior lead times from regional distribution. GEZE's US service response time was a concern.",
    actionable: "Lead time + AAADM = winning combo in Southeast where GEZE service is thin.",
  },
];

// ─── IoT/Connected Platform Roadmap Items ────────────────────────────────

export const iotRoadmapItems: RoadmapItem[] = [
  {
    id: "iot001",
    productLine: "IoT/Connected Platform",
    brand: "ASSA ABLOY",
    category: "software",
    initiative: "ecoLOGIC Native BACnet/Modbus Plug-and-Play",
    description: "Engineer plug-and-play BACnet/Modbus integration for ecoLOGIC Energy Management module. Currently requires integration configuration; GEZE myGEZE offers native zero-config BMS connection. This is blocking wins in smart building spec market.",
    status: "concept",
    year: 2026,
    quarter: "Q2",
    gateStage: "G1_scoping",
    owner: "J. Tubbs",
    tags: ["iot", "bms", "bacnet", "modbus", "ecologic", "smart-building"],
    linkedStandards: ["LEED v5", "ASHRAE 135"],
    linkedCompetitorSignal: "GEZE myGEZE native BACnet zero-config — 3 documented losses 2025",
    effort: "L",
    impact: "critical",
    region: "National",
    verticals: ["Office/Commercial", "Healthcare"],
    budget: 280,
    notes: "Three documented losses to GEZE in 2025 on BACnet native integration. Smart building specs increasingly require plug-and-play BMS connectivity. P0 for ecoLOGIC competitiveness.",
    risks: "BACnet certification timeline 6–9 months. Requires firmware team bandwidth from SW300-S app work.",
    kpis: ["Zero-config BMS connection < 5 min", "BACnet certification complete Q1 2026", "Win rate in smart-building specs +15%"],
    priority: "p0",
    completionPct: 5,
    assignees: ["J. Tubbs", "B. Kim", "A. Chen"],
    linkedTasks: ["rm-011", "iot003"],
    stateScope: [],
    comments: [
      {
        id: "c-iot001-01",
        author: "J. Tubbs",
        role: "Product Manager, Pedestrian Sliding",
        avatar: "JT",
        body: "Three separate loss reports in 2025 where GEZE won on BACnet plug-and-play. This is a P0 item — starting scoping sprint with B. Kim's firmware team.",
        timestamp: "2025-04-10T09:00:00Z",
        mentions: ["B. Kim"],
        reactions: [{ emoji: "🔥", count: 2, users: ["A. Chen", "D. Torres"] }],
      },
    ],
  },
  {
    id: "iot002",
    productLine: "IoT/Connected Platform",
    brand: "ASSA ABLOY",
    category: "software",
    initiative: "SW300-S AI Predictive Maintenance Module",
    description: "Add ML-based predictive maintenance module to SW300-S platform. Monitor motor current draw, cycle count, sensor response time, and door speed to predict failure 30–60 days ahead. Alert AAADM technician before failure occurs.",
    status: "concept",
    year: 2026,
    quarter: "Q4",
    gateStage: "G0_idea",
    owner: "J. Tubbs",
    tags: ["iot", "ai", "predictive-maintenance", "sw300", "ml"],
    linkedCompetitorSignal: "dormakaba AI predictive maintenance benchmark — 32% downtime reduction",
    effort: "XL",
    impact: "high",
    region: "National",
    verticals: ["Healthcare", "Airport/Transit", "Office/Commercial"],
    budget: 420,
    notes: "dormakaba AI predictive maintenance cuts downtime 32% — their pitch is resonating in healthcare and airport segments. This is the feature request coming from field most frequently in 2025.",
    risks: "Requires ML model training data from installed base. Privacy/data considerations for hospital networks.",
    kpis: ["Predict failure 30+ days ahead", "False-positive rate < 5%", "Customer downtime reduction ≥ 25%"],
    priority: "p1",
    completionPct: 2,
    assignees: ["J. Tubbs", "A. Chen", "B. Kim"],
    linkedTasks: ["rm-001", "iot001"],
    stateScope: [],
    comments: [
      {
        id: "c-iot002-01",
        author: "A. Chen",
        role: "Product Manager, Platform & IoT",
        avatar: "AC",
        body: "dormakaba is actively pitching this in hospital bids. VOC from Southeast distributor confirms it's coming up as a question in nearly every healthcare RFP now. We need to at least have a credible roadmap answer.",
        timestamp: "2025-04-12T14:30:00Z",
        mentions: ["J. Tubbs"],
        reactions: [{ emoji: "👍", count: 3, users: ["J. Tubbs", "D. Torres", "S. Patel"] }],
      },
    ],
  },
  {
    id: "iot003",
    productLine: "IoT/Connected Platform",
    brand: "ASSA ABLOY",
    category: "software",
    initiative: "ecoLOGIC Occupancy Analytics Dashboard",
    description: "Add occupancy analytics to ecoLOGIC dashboard — door cycles per hour, peak traffic periods, directional flow analysis. Feed to BMS for HVAC optimization. Show energy savings realized vs baseline. Supports LEED ongoing monitoring credits.",
    status: "concept",
    year: 2026,
    quarter: "Q3",
    gateStage: "G0_idea",
    owner: "J. Tubbs",
    tags: ["iot", "analytics", "occupancy", "ecologic", "leed", "hvac"],
    linkedStandards: ["LEED v5", "ASHRAE 55"],
    effort: "M",
    impact: "high",
    region: "National",
    verticals: ["Office/Commercial", "Retail", "Airport/Transit"],
    budget: 180,
    notes: "Smart building market demands occupancy data. Competitors integrating door cycle data with BMS for HVAC optimization. LEED v5 ongoing monitoring likely to require this data.",
    risks: "Data privacy compliance — CCPA/GDPR implications for occupancy tracking. Need legal review.",
    kpis: ["LEED v5 monitoring credit support", "HVAC savings ≥ 8% documented", "Dashboard NPS ≥ 4.0"],
    priority: "p1",
    completionPct: 0,
    assignees: ["J. Tubbs", "A. Chen"],
    linkedTasks: ["iot001", "rm-011"],
    stateScope: [],
    comments: [],
  },
];
