// ─────────────────────────────────────────────────────────────────────────────
// Code Change Tracker — Standards Data Library  (v4 — Data Corrections Applied)
// Covers: ANSI/BHMA A156.10, A156.19 (2019 ed.), A156.27, A156.38 (2019 ed.) | IBC/ICC 2024 | FBC 9th Ed.
//         AAADM Certification & Inspection Program
// Includes: product-level impact tagging, corporate implications, PM framing,
//           legislative/regulatory pipeline, FBC 9th Ed. water infiltration +
//           fenestration changes (user confirmed).
// CORRECTIONS v4: A156.27 fullName/scope fixed (revolving doors ONLY, not sliding);
//   A156.19 edition year corrected 2023->2019; A156.38 edition year corrected 2023->2019;
//   A156.10 product impacts updated (SL500/R92-R128, SW60 full-power, SW200 OHC, Windcord 5400/5500, RECORD TSA 20/21/22);
//   A156.19 product impacts updated (SW60 LE, SW100, VersaMax); A156.27-2024 RD700 added;
//   UL 294 edition updated to Edition 8 (2023, eff. May 24, 2025);
//   FBC scope updated: 8th Ed. currently in force, 9th Ed. transition Dec 31, 2026.
// ─────────────────────────────────────────────────────────────────────────────

export type TrackId = "bhma" | "icc" | "fbc" | "aaadm" | "energy" | "lifesafety" | "accessibility" | "astm" | "healthcare";
export type StatusCode = "stable" | "active-revision" | "pending-adoption" | "alert";
export type ChangeType = "requirement" | "terminology" | "test-method" | "scope" | "schedule";
export type Priority = "high" | "medium" | "low";
export type ImpactLevel = "critical" | "significant" | "minor" | "informational";
export type ImplicationType =
  | "market_access"
  | "compliance_cost"
  | "product_roadmap"
  | "competitive_advantage"
  | "competitive_risk";

// ─── New: Product-level impact tagging ────────────────────────────────────────

export interface ProductImpact {
  brand: string;
  model: string;
  impactLevel: ImpactLevel;
  impactDescription: string;
  actionRequired: string; // what PM/product team must do
  deadline?: string;
}

// ─── New: Corporate implication ───────────────────────────────────────────────

export interface CorporateImplication {
  type: ImplicationType;
  description: string;
  affectedBrands: string[];
  pmInsight: string;
}

// ─── New: Pipeline / regulatory watch ─────────────────────────────────────────

export interface PipelineItem {
  id: string;
  title: string;
  body: string;
  standard: string;          // e.g. "A156.10", "ADA", "IECC 2024"
  expectedDate: string;
  priority: Priority;
  affectedProducts: string[];
  actionRequired: string;
}

// ─── Existing interfaces (extended) ───────────────────────────────────────────

export interface Edition {
  version: string;
  year: number;
  effectiveDate: string;
  status: StatusCode;
  adoptedBy?: string[];
}

export interface Change {
  id: string;
  section: string;
  title: string;
  description: string;
  changeType: ChangeType;
  priority: Priority;
  previousValue?: string;
  newValue?: string;
  // Legacy plain-string product impact (kept for backward compat)
  productImpact?: string;
  // Extended fields
  productImpacts?: ProductImpact[];
  corporateImplications?: CorporateImplication[];
  industryReaction?: string;
  pmFraming?: string; // 2–3 sentences for interview / stakeholder communication
  source?: string;
  sourceUrl?: string;
}

export interface WatchItem {
  id: string;
  title: string;
  description: string;
  expectedDate?: string;
  priority: Priority;
  actionRequired?: string;
}

export interface TimelineEvent {
  date: string;
  label: string;
  type: "release" | "effective" | "revision-start" | "comment-period" | "vote" | "milestone";
  editionRef?: string;
}

export interface Standard {
  id: string;
  trackId: TrackId;
  designation: string;
  fullName: string;
  scope: string;
  currentEdition: Edition;
  pastEditions: Edition[];
  recentChanges: Change[];
  watchList: WatchItem[];
  timeline: TimelineEvent[];
  nextRevisionExpected?: string;
  governingBody: string;
  governingBodyUrl: string;
  lastVerified: string;
}

export interface Track {
  id: TrackId;
  label: string;
  shortLabel: string;
  description: string;
  standards: Standard[];
  overallStatus: StatusCode;
  alertCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// BHMA TRACK
// ─────────────────────────────────────────────────────────────────────────────

// ─── ANSI/BHMA A156.10-2024 ──────────────────────────────────────────────────

const a15610: Standard = {
  id: "a156.10",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.10",
  fullName: "Power Operated Pedestrian Doors — Full Energy",
  scope:
    "Covers ALL full-power (full-energy) pedestrian door types: sliding, swinging, and folding doors. Establishes force/timing limits, sensor zone geometry, presence sensor fault monitoring, signage placement, guide rail geometry, and cycle-test protocols for high-traffic automatic doors. The 2024 edition consolidates changes from 2017 (sensor fault monitoring, signage AFF) with new 2024 updates (30 lbf closing force, 8 in. inactive zone). Applies to: SL500 (R92/R104/R128), SW60 (full-power configuration), SW200 OHC (full power), Windcord 5400, Windcord 5500, and RECORD TSA 20/21/22 sliding products. Does NOT govern low-energy/power-assist doors (see A156.19) or revolving doors (see A156.27).",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2024",
    year: 2024,
    effectiveDate: "2024",
    status: "stable",
  },
  pastEditions: [
    {
      version: "2017",
      year: 2017,
      effectiveDate: "December 2017",
      status: "stable",
    },
    {
      version: "2011",
      year: 2011,
      effectiveDate: "2011",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "a15610-c1",
      section: "§10.2 — Dynamic Closing Force",
      title: "Closing force in last 10° of travel reduced from 40 lbf to 30 lbf",
      description:
        "A156.10-2024 §10.2 reduces the maximum dynamic closing force in the final 10 degrees of door travel from 40 lbf (2011 edition) to 30 lbf. This applies to both sliding and swing configurations. The change tightens the safety margin at the point of highest pedestrian entrapment risk — the zone where a person caught by a closing door has the least escape angle. Operators and motor/spring assemblies must be characterized against the new limit under controlled test conditions; products that borderline-passed at 35–40 lbf under the 2011 standard may require controller reprogramming, motor re-specification, or physical spring tuning to comply.",
      changeType: "requirement",
      priority: "high",
      previousValue: "40 lbf (2011 ed.)",
      newValue: "30 lbf (2024 ed.)",
      productImpact:
        "Operators and closers must be re-characterized under new force limits. May require motor/spring tuning for legacy operators being requalified.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 (R92/R104/R128)",
          impactLevel: "significant",
          impactDescription:
            "SL500 (all R-variants) sliding operator force profile must be re-validated in the last-10° zone. Controller firmware closing-speed ramp may need adjustment to meet 30 lbf at reduced speed. SL500 is a primary A156.10 product.",
          actionRequired:
            "Run closing-force characterization at rated spring tension. Update firmware if measured force exceeds 30 lbf. Re-submit for UL listing test if firmware changes are material.",
          deadline: "Before FBC 9th Ed. effective date (Dec 31, 2026) for FL projects.",
        },
        {
          brand: "ASSA ABLOY",
          model: "SW60 (full-power configuration)",
          impactLevel: "significant",
          impactDescription:
            "SW60 in full-power (full-energy) configuration is governed by A156.10. Full-power SW60 closing force must be validated in the last-10° zone against the 30 lbf limit. (Low-energy SW60 configuration is governed by A156.19.)",
          actionRequired:
            "Validate closing force profile for full-power SW60 configurations. Update product literature to distinguish full-power (A156.10) from low-energy (A156.19) variants.",
          deadline: "Q4 2026",
        },
        {
          brand: "ASSA ABLOY",
          model: "SW200 OHC (full power)",
          impactLevel: "significant",
          impactDescription:
            "SW200 overhead concealed swing door operator in full-power configuration is governed by A156.10. Closing speed profile affects trailing-edge force. Spring-calibration tables may produce closing forces above 30 lbf for heavy-door configurations.",
          actionRequired:
            "Audit spring-selection guide for doors above 150 lb to ensure compliance. Publish revised spring-selection charts in product literature.",
          deadline: "Q4 2026",
        },
        {
          brand: "ASSA ABLOY",
          model: "Windcord 5400",
          impactLevel: "significant",
          impactDescription:
            "Windcord 5400 full-power sliding door operator is governed by A156.10. Closing-force profile must be validated against 30 lbf limit in the last-10° zone.",
          actionRequired:
            "Conduct closing-force characterization per A156.10-2024 §10.2. Update certification documentation.",
          deadline: "Q4 2026",
        },
        {
          brand: "ASSA ABLOY",
          model: "Windcord 5500",
          impactLevel: "significant",
          impactDescription:
            "Windcord 5500 full-power sliding door operator is governed by A156.10. Closing-force profile must be validated against 30 lbf limit in the last-10° zone.",
          actionRequired:
            "Conduct closing-force characterization per A156.10-2024 §10.2. Update certification documentation.",
          deadline: "Q4 2026",
        },
        {
          brand: "RECORD",
          model: "TSA 20 / TSA 21 / TSA 22",
          impactLevel: "significant",
          impactDescription:
            "RECORD TSA 20, TSA 21, and TSA 22 sliding door systems are full-power automatic sliding doors governed by A156.10. Closing-force limits and sensor zone requirements of A156.10-2024 apply. These products are NOT governed by A156.27 (revolving doors).",
          actionRequired:
            "Validate TSA 20/21/22 closing-force profiles against A156.10-2024 §10.2 30 lbf limit. Confirm sensor zone geometry per §8.2. Update certification documentation to reference 2024 edition.",
          deadline: "Q4 2026",
        },
        {
          brand: "ASSA ABLOY",
          model: "Besam SW200i (full power)",
          impactLevel: "significant",
          impactDescription:
            "SW200i swing operator in full-power configuration is governed by A156.10. Closing speed profile affects trailing-edge force. Existing spring-calibration tables may produce closing forces above 30 lbf for heavy-door configurations.",
          actionRequired:
            "Audit spring-selection guide for doors above 150 lb to ensure compliance. Publish revised spring-selection charts in product literature.",
          deadline: "Q4 2026",
        },
        {
          brand: "dormakaba",
          model: "ES200 / ES500",
          impactLevel: "significant",
          impactDescription:
            "Full-energy swing door operators. ES200 at maximum door weight may produce closing force approaching previous 40 lbf limit. Must re-verify.",
          actionRequired:
            "Conduct test-lab closing-force audit across door-weight range. Update parameter tables in commissioning guide.",
          deadline: "Q4 2026",
        },
        {
          brand: "dormakaba",
          model: "ESA 300",
          impactLevel: "minor",
          impactDescription:
            "Automatic sliding operator. Already operates at lower force profile; verify last-10° characterization during next scheduled certification review.",
          actionRequired:
            "Include in next A156.10-2024 recertification cycle. No immediate re-design expected.",
          deadline: "2027 certification cycle",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide 2000",
          impactLevel: "significant",
          impactDescription:
            "High-traffic full-energy sliding operator. Force-reduction may require motor profile adjustment for heavy doors (>150 lb panel).",
          actionRequired:
            "Update closing-speed parameter map. Submit revised spec to A156.10 certification body.",
          deadline: "Q4 2026",
        },
        {
          brand: "Horton",
          model: "Series 4000",
          impactLevel: "significant",
          impactDescription:
            "Full-energy hermetic sliding system. Force reduction to 30 lbf at last 10° requires validation across full hermetic door weight range (up to 400 lb panels).",
          actionRequired:
            "Prioritize test-lab validation for hermetic configurations. Hermetic seal increases effective panel mass; compliance cannot be assumed from standard-door results.",
          deadline: "Q3 2026 — ahead of FL 9th Ed. effective date.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "All full-energy operator product lines require re-characterization testing and potentially firmware/hardware changes to meet the 30 lbf limit. Test lab costs, certification fees, and product literature updates are non-trivial across a broad product portfolio.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Frame this as a quality/safety upgrade that distinguishes certified products from non-certified installers. Build certification costs into product line budget for 2026; brands that recertify first can market compliance as a competitive differentiator for spec-writers.",
        },
        {
          type: "competitive_advantage",
          description:
            "Brands with modern variable-speed controllers (e.g., Besam SL500, dormakaba ESA) can achieve compliance via firmware update alone, while competitors with older electromechanical systems require hardware changes. First-movers to publish A156.10-2024 certified status gain spec preference.",
          affectedBrands: ["ASSA ABLOY", "dormakaba"],
          pmInsight:
            "Prioritize firmware-update certification path for smart-controller lines. Publish A156.10-2024 compliance date prominently in spec-writer portals to get ahead of competitors still working through hardware re-designs.",
        },
      ],
      industryReaction:
        "The 30 lbf limit has been anticipated since the 2017 revision discussion cycle. Most major OEMs have been preparing; the primary concern is for installed legacy operators that cannot be firmware-updated and will need physical adjustment at next inspection or service call.",
      pmFraming:
        "A156.10-2024 §10.2 tightens the closing-force limit from 40 to 30 lbf in the last 10 degrees of travel — the most dangerous zone for pedestrian entrapment. This matters to our product roadmap because full-energy operators at the upper end of our door-weight range may borderline-fail the new limit, requiring either firmware tuning or hardware re-specification before our 2024-standard recertification. From a go-to-market perspective, spec-writers and building inspectors are actively checking for A156.10-2024 certification, so brands that recertify first gain measurable specification advantage.",
      source: "BHMA / Industrial Hygiene Pub",
      sourceUrl:
        "https://industrialhygienepub.com/news-headlines/ansi-updates-for-automatic-doors-know-what-the-inspectors-know/",
    },
    {
      id: "a15610-c2",
      section: "§8.3 — Pre-Cycle Sensor Fault Monitoring",
      title: "System must verify sensor function before every close cycle (added 2017)",
      description:
        "Added in A156.10-2017 §8.3, this requirement mandates that a power-operated door system electronically verify sensor function before initiating each closing cycle. If the sensor self-test detects a fault — open circuit, degraded signal, blocked sensor face — the controller must either prevent door closure or enter a defined safe state (typically hold-open). The requirement is safety-critical: a door that closes without a functioning presence sensor can strike pedestrians who are not detected. The change affects all controller firmware; the pre-cycle check adds 50–200 ms of latency per close cycle and must be accounted for in timing specifications. UL listing tests for A156.10 compliance now include sensor-fault simulation test cases.",
      changeType: "requirement",
      priority: "high",
      previousValue: "No pre-cycle sensor verification required (pre-2017)",
      newValue:
        "Controller must verify sensor function before each closing cycle; fault must prevent closure or trigger safe state (§8.3, 2017 ed.)",
      productImpact:
        "Control software must implement pre-cycle sensor health check. Affects firmware validation and UL listing testing protocols.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500",
          impactLevel: "significant",
          impactDescription:
            "SL500 firmware already includes sensor health monitoring; verify §8.3 pre-cycle sequencing meets 2017 timing spec and is documented in UL file.",
          actionRequired:
            "Confirm UL file includes §8.3 sensor-fault test results. Update installation documentation to note sensor-fault LED behavior.",
        },
        {
          brand: "dormakaba",
          model: "ES200",
          impactLevel: "significant",
          impactDescription:
            "Firmware versions prior to the 2018 release may not fully implement the pre-cycle sensor verification loop. Field units on older firmware could be non-compliant.",
          actionRequired:
            "Audit installed base firmware versions. Issue service bulletin for firmware upgrade to 2018+ for any units operating under A156.10 listing claim.",
          deadline: "Immediately for any inspections under A156.10-2017+",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide 2000",
          impactLevel: "significant",
          impactDescription:
            "Sensor fault monitoring implemented in controller revisions post-2017. Older DURA-Glide 2000 units in field may pre-date §8.3 compliance.",
          actionRequired:
            "Identify production date cutoff for §8.3-compliant controllers. Advise service network of inspection risk for pre-compliance units.",
        },
        {
          brand: "Horton",
          model: "Series 4000",
          impactLevel: "significant",
          impactDescription:
            "Hermetic and non-hermetic Series 4000 controllers updated post-2017; confirm all production lines ship with sensor-fault loop enabled by default.",
          actionRequired:
            "Verify factory default configuration enables §8.3 sensor verification. Document in commissioning checklist.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Field units manufactured before 2017 firmware updates may carry AHJ inspection liability if cited as non-compliant with §8.3. Service network may receive elevated call volume for firmware upgrades.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Issue proactive service bulletins for pre-2018 production controllers — this is both a liability-reduction and brand-trust play. PM teams should track field firmware compliance rate as a product health KPI.",
        },
        {
          type: "product_roadmap",
          description:
            "Future AI/machine-vision sensor integration (A156.10 next revision watch) will require expanded pre-cycle verification logic. Current §8.3 framework is the foundation; roadmap should plan for more complex sensor-health APIs.",
          affectedBrands: ["ASSA ABLOY", "dormakaba"],
          pmInsight:
            "Treat §8.3 compliance infrastructure as a platform capability. When scoping AI sensor integration for the next revision cycle, the firmware team already has a sensor-verification hook — extend it rather than rebuild.",
        },
      ],
      industryReaction:
        "The 2017 requirement was broadly welcomed as overdue. Several incident reports involving sensor failure and door strikes on pedestrians preceded the change. The primary implementation challenge is false-fault triggering in dirty or high-humidity environments, which manufacturers addressed through hysteresis tuning and debounce logic.",
      pmFraming:
        "§8.3 pre-cycle sensor fault monitoring — added in 2017 — means our controllers must confirm the presence sensor is alive before every single closing action. This is safety-critical: a door that closes without a working sensor is a liability event waiting to happen. From a product management lens, this requirement drives our firmware architecture: we need a reliable, fast sensor-health API that future AI/machine-vision sensors can plug into, making §8.3 compliance a foundational platform investment rather than a one-time fix.",
      source: "I Dig Hardware 2017",
      sourceUrl:
        "https://idighardware.com/2017/10/decoded-new-requirements-for-pedestrian-automatic-door-operators-and-sensors-december-2017/",
    },
    {
      id: "a15610-c3",
      section: "§8.2 — Presence Sensor Inactive Zone",
      title: "Inactive zone at leading door edge expanded from 6 in. to 8 in.",
      description:
        "A156.10-2024 §8.2 expands the maximum permissible inactive zone of the presence sensor measured from the leading edge of the door from 6 in. (prior editions) to 8 in. This inactive zone is a dead band immediately adjacent to the door face where the sensor does not detect objects — necessary to prevent the door from holding open due to its own structure being detected. Expanding from 6 to 8 in. accommodates modern sensor housings that are physically larger and require more clearance. However, the wider inactive zone also means a person or object could stand 7 in. from the leading edge and not be detected; installers must account for this in site-specific risk assessment. The change also affects sensor mounting calibration procedures — installers must verify the inactive zone is ≤8 in. during commissioning.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "6 in. from leading edge of door",
      newValue: "8 in. from leading edge of door (§8.2, 2024 ed.)",
      productImpact:
        "Sensor housing dimensions and mounting positions must be verified against new 8 in. inactive zone specification.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 + Motion Sensor Kit",
          impactLevel: "significant",
          impactDescription:
            "Bundled sensor kit must be re-characterized to confirm inactive zone does not exceed 8 in. with current housing geometry. Mounting bracket offsets may need update.",
          actionRequired:
            "Perform inactive-zone measurement across full sensor temperature/voltage range. Update installation template drawings to reflect 8 in. limit.",
        },
        {
          brand: "dormakaba",
          model: "ESA Sensor Module",
          impactLevel: "significant",
          impactDescription:
            "ESA sensor module inactive zone measured at 5.5 in. in current production — already within new 8 in. limit. Verify with production tolerance range.",
          actionRequired:
            "Confirm tolerance envelope keeps inactive zone below 8 in. across production variation. No design change expected.",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide 2000 Sensor",
          impactLevel: "minor",
          impactDescription:
            "Inactive zone expansion is permissive — 8 in. is a maximum, not a minimum. DURA-Glide sensor is within spec. Update commissioning checklist to reference 8 in. limit.",
          actionRequired:
            "Update commissioning forms and installer training materials to reflect §8.2 (2024) 8 in. specification.",
        },
        {
          brand: "Horton",
          model: "Series 4000 Presence Sensor",
          impactLevel: "minor",
          impactDescription:
            "Hermetic door sensor housings are larger; 8 in. allowance accommodates current mounting geometry without redesign.",
          actionRequired:
            "Confirm via factory measurement. Document compliance in A156.10-2024 certification report.",
        },
      ],
      corporateImplications: [
        {
          type: "product_roadmap",
          description:
            "Sensor hardware teams should plan next-generation sensor housings to comfortably fit within 8 in. inactive zone while reducing blind-spot risk. Competitive differentiation is achievable through smaller inactive zones.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "The 8 in. limit is a maximum — a product that achieves a 4 in. inactive zone is a safety story. Frame sensor-detection precision as a differentiator in healthcare and high-traffic retail specs where pedestrian safety tolerance is lowest.",
        },
      ],
      industryReaction:
        "The expansion from 6 to 8 in. was driven by sensor manufacturers who need housing clearance for next-generation multi-beam and radar sensors. Safety advocates noted the wider blind spot as a concern; the standard committee balanced it with more rigorous commissioning documentation requirements.",
      pmFraming:
        "§8.2 expanded the sensor inactive zone from 6 to 8 inches — this accommodates modern sensor housings but also widens the potential blind spot at the door's leading edge. For product teams, this means our next-gen sensor specs should target a smaller inactive zone than the 8-inch maximum as a safety-story differentiator, especially in healthcare settings where any detection gap near the door face is a specification concern.",
      source: "BHMA 2024",
    },
    {
      id: "a15610-c4",
      section: "§11.5 — Signage Placement",
      title: "Required signage mounting height: 50 in. AFF (from 48 in.)",
      description:
        "A156.10 (2017 and confirmed 2024) moved required signage mounting height for automatic door warning placards to 50 in. above finished floor (AFF), with an acceptable range of 38 in. to 62 in. (±12 in.). The prior 2011 specification was 48 in. AFF with a tighter tolerance. The 50 in. center height aligns with ADA accessible reach range standards and provides greater flexibility for installers dealing with door frame obstructions. The change affects: (1) bracket height in signage kits included with products, (2) installation instruction diagrams, (3) existing installed signage on legacy doors being recertified.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "48 in. AFF (2011 ed.)",
      newValue: "50 in. AFF, range 38–62 in. (2017/2024 ed., §11.5)",
      productImpact:
        "Verify signage bracket designs and installation instructions reflect 50 in. center AFF, with acceptable range of 38 in. to 62 in.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All full-energy operators (SL500, SW200i, others)",
          impactLevel: "minor",
          impactDescription:
            "Signage kits shipped with operators must be verified to position placard center at 50 in. AFF using standard bracket. Installation guide must show 50 in. dimension.",
          actionRequired:
            "Audit current signage bracket height dimension in all product shipping kits. Update installation guide drawings.",
        },
        {
          brand: "dormakaba",
          model: "All A156.10 products",
          impactLevel: "minor",
          impactDescription:
            "Same as above — signage kit bracket must position center at 50 in. AFF.",
          actionRequired: "Update installation documentation across A156.10 product line.",
        },
        {
          brand: "Stanley",
          model: "All A156.10 products",
          impactLevel: "minor",
          impactDescription:
            "Confirm DURA-Glide and other A156.10 products ship with 50 in. AFF-compliant signage kits.",
          actionRequired: "Verify with product engineering and update spec sheets.",
        },
        {
          brand: "Horton",
          model: "All A156.10 products",
          impactLevel: "minor",
          impactDescription:
            "Signage kit for Series 4000 hermetic and standard configurations must be updated.",
          actionRequired: "Update signage bracket and installation documentation.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Low-cost change: primarily affects installation documentation and signage bracket sourcing. However, field inspectors do check signage height, so non-compliance on installed legacy doors can create inspection failures.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Include signage height update in any planned product literature refresh — it is a low-effort, high-visibility compliance fix that prevents unnecessary AHJ inspection failures.",
        },
      ],
      industryReaction:
        "Minor change; well-received as aligning automatic door signage requirements with ADA reach-range guidance. Some service technicians noted that the wider tolerance (±12 in.) reduces field adjustment disputes with inspectors.",
      pmFraming:
        "§11.5 moved signage height to 50 inches AFF — a small change that aligns automatic door warning placards with ADA accessible reach ranges. It matters because field inspectors check signage height, and a non-compliant placard at 48 instead of 50 inches can hold up a certificate of occupancy. PMs should ensure all product shipping kits and installation documents reflect the 50-inch specification to avoid installer-level compliance failures on job sites.",
      source: "I Dig Hardware 2017",
      sourceUrl:
        "https://idighardware.com/2017/10/decoded-new-requirements-for-pedestrian-automatic-door-operators-and-sensors-december-2017/",
    },
    {
      id: "a15610-c5",
      section: "§6.1 — Guide Rail Dimensions",
      title: "Guide rail height minimum 30 in.; clearance language restated with tolerance",
      description:
        "A156.10-2024 §6.1 reorganizes guide rail dimension requirements with a confirmed minimum guide rail height of 30 in. above finished floor. Clearance specifications have been restated with explicit tolerance language (e.g., ±1/8 in.) where prior editions stated nominal dimensions without tolerances. The reorganization does not change substantive performance requirements but brings language into alignment with how installers and fabricators specify guide rail assemblies in the field. Section references in submittal documents and spec sheets that cited prior §9.x guide rail exception clauses must be updated to reflect the new §6.1 location.",
      changeType: "scope",
      priority: "low",
      previousValue: "Guide rail requirements in §9.x (exception language); tolerances not explicit",
      newValue:
        "Consolidated in §6.1; guide rail height min 30 in. AFF; clearances with explicit ±1/8 in. tolerance",
      productImpact:
        "Update any spec sheets or submittal documents that cite A156.10 guide rail exception section numbers.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "SL500 Guide Rail System",
          impactLevel: "informational",
          impactDescription:
            "Guide rail drawings and submittal packages must reference §6.1 (not legacy §9.x) for section compliance citation.",
          actionRequired: "Update all submittal documents and CAD/BIM details to cite §6.1.",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide Guide Rail",
          impactLevel: "informational",
          impactDescription:
            "Same editorial update required for submittal documents.",
          actionRequired: "Update spec templates to reference A156.10-2024 §6.1.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Minimal cost — editorial document update. Risk is in specification packages that still reference old section numbers, which may confuse inspectors or create ambiguity during plan review.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Include in document refresh batch — combine with signage height update and force-limit recertification documentation into a single A156.10-2024 compliance package for the sales and spec team.",
        },
      ],
      industryReaction:
        "Seen as housekeeping. No significant reaction. Fabricators appreciate explicit tolerance language.",
      pmFraming:
        "§6.1 in A156.10-2024 consolidates guide rail geometry requirements with explicit tolerances — previously scattered in exception clauses. The practical impact for product teams is primarily documentation: submittal packages and spec sheets need updated section references to avoid inspector confusion. Bundle this update into your 2024-edition compliance documentation package rather than treating it as a standalone action item.",
      source: "BHMA 2024",
    },
    {
      id: "a15610-c6",
      section: "§12.5 — Cycle Test Protocol",
      title: "300,000-cycle test at 5–8 cycles/min — clarified (no limit change)",
      description:
        "A156.10-2024 §12.5 reaffirms the cycle endurance test at 300,000 cycles, operated at a rate of 5 to 8 cycles per minute. No change to the numeric requirement — the 2024 edition adds clarifying language specifying that cycles must be consecutive with no unscheduled maintenance stops, and that the test must be performed on a production-representative assembly (not a prototype with non-standard components). The clarification closes a loophole where some test submissions used pre-production units with better-than-production tolerances.",
      changeType: "schedule",
      priority: "low",
      previousValue: "300,000 cycles at 5–8/min (no protocol clarity on assembly type)",
      newValue:
        "300,000 cycles at 5–8/min; no unscheduled stops; must use production-representative assembly (§12.5, 2024 ed.)",
      productImpact:
        "Ensure cycle test submissions use production-representative units. Pre-production or prototype assemblies no longer acceptable for §12.5 certification.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All A156.10-certified products",
          impactLevel: "minor",
          impactDescription:
            "Next certification cycle must use production-line units. Confirm test lab protocol with certification body.",
          actionRequired:
            "Update test submission checklist to specify production-representative assembly requirement per §12.5 (2024).",
        },
        {
          brand: "dormakaba",
          model: "All A156.10-certified products",
          impactLevel: "minor",
          impactDescription: "Same as above.",
          actionRequired: "Update internal certification procedure documents.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Slight increase in test cost — must use production-representative assemblies which may cost more than purpose-built test units. However, the change is fair and closes a competitive loophole.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "If your product genuinely passes 300,000 cycles on a production unit, this change costs nothing. If you were depending on pre-production tolerances to pass, it is a forcing function to improve manufacturing quality — frame it internally as a product quality requirement, not just a compliance hurdle.",
        },
      ],
      industryReaction:
        "Mixed. Quality-focused OEMs welcomed the clarification. Some smaller manufacturers noted the cost of running cycle tests on production units vs. purpose-built test assemblies.",
      pmFraming:
        "§12.5 clarifies that the 300,000-cycle endurance test must use a production-representative assembly — closing a previous ambiguity that allowed pre-production prototypes. For product teams, this means the cycle test is now a true production quality gate, not just a one-time engineering certification. Build this into your manufacturing release process so production sampling feeds directly into certification documentation.",
      source: "BHMA 2024",
    },
  ],
  watchList: [
    {
      id: "a15610-w1",
      title: "A156.10 Next Revision (est. 2027–2028): AI/machine-vision sensor guidance",
      description:
        "The BHMA A156.10 committee is expected to begin the next revision cycle around 2027. Industry participants have flagged AI-based and machine-vision presence detection as the primary topic for new guidance. Current §8.x sensor requirements were written for traditional infrared microwave sensors; machine-vision cameras detecting body poses, trajectories, and intent require new zone-definition, privacy, and fault-monitoring frameworks. A new section or annex specifically addressing machine-vision-based presence detection is anticipated.",
      expectedDate: "2027–2028",
      priority: "medium",
      actionRequired:
        "Engage BHMA committee through membership. Contribute field data on sensor performance. Begin internal R&D scoping for machine-vision sensor integration to influence standard language in your favor.",
    },
    {
      id: "a15610-w2",
      title: "FBC 9th Ed. adoption of A156.10-2024 — confirm reference edition",
      description:
        "Florida Building Code 9th Edition (effective December 31, 2026) is based on 2024 I-Codes. The FBC TAC must explicitly confirm which edition of A156.10 is referenced — 2017 or 2024. If the 9th Edition references A156.10-2024, the 30 lbf force limit and 8 in. inactive zone become Florida law for all new construction. If it references A156.10-2017, the 2024 requirements are persuasive but not mandatory until FBC 10th Edition.",
      expectedDate: "Dec 31, 2026",
      priority: "high",
      actionRequired:
        "Track FBC TAC meeting minutes for A156.10 reference adoption decision. Confirm with legal/code consultant which edition Florida AHJs will enforce post-Dec 31, 2026.",
    },
  ],
  timeline: [
    { date: "2011", label: "A156.10-2011 Published", type: "release", editionRef: "2011" },
    {
      date: "Dec 2017",
      label: "A156.10-2017 — §8.3 sensor fault monitoring + 50 in. signage",
      type: "release",
      editionRef: "2017",
    },
    {
      date: "2024",
      label: "A156.10-2024 — 30 lbf limit, 8 in. inactive zone, §6.1 guide rail",
      type: "release",
      editionRef: "2024",
    },
    {
      date: "Dec 31, 2026",
      label: "FBC 9th Ed. effective — may adopt A156.10-2024 ref",
      type: "milestone",
    },
    {
      date: "2027–2028",
      label: "Next A156.10 revision expected — AI sensor guidance",
      type: "revision-start",
    },
  ],
  nextRevisionExpected: "2027–2028",
};

// ─── ANSI/BHMA A156.19-2019 ──────────────────────────────────────────────────

const a15619: Standard = {
  id: "a156.19",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.19",
  fullName: "Power Assist and Low-Energy Power-Operated Doors",
  scope:
    "Covers power-assist and low-energy power-operated SWINGING doors only. Defines force limits, activation requirements (including knowing-act and touchless wave sensor), hold-open timing, signage, and ADA accessibility performance for swing doors that require deliberate user actuation — as distinct from full-energy automatic doors covered by A156.10. Applies to: SW60 (low-energy variant), SW100, and VersaMax (power-assist). Does NOT govern full-energy sliding doors (A156.10/A156.38) or revolving doors (A156.27).",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2019",
    year: 2019,
    effectiveDate: "2019",
    status: "stable",
  },
  pastEditions: [
    {
      version: "2007",
      year: 2007,
      effectiveDate: "2007",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "a15619-c1",
      section: "General — Opening Speed",
      title: "Maximum opening speed clarified at 12 in./sec",
      description:
        "A156.19-2019 explicitly states the maximum door opening speed for low-energy power-operated doors as 12 inches per second. Prior editions addressed opening speed indirectly through force and timing provisions; this edition makes the 12 in./sec limit a standalone, directly testable parameter. The clarification closes a gray area where high-spring-rate operators could technically meet prior force limits at high speed by relying on deceleration curves. Operators must now demonstrate 12 in./sec or below at any point during the opening cycle.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "Opening speed implied through force/timing provisions; not stated as discrete limit",
      newValue: "Max 12 in./sec explicitly stated (A156.19-2019)",
      productImpact:
        "Low-energy operators must be tested for maximum linear opening speed. Confirm no point during the opening cycle exceeds 12 in./sec on high-spring configurations.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SW60 (low-energy variant)",
          impactLevel: "significant",
          impactDescription:
            "SW60 in low-energy (A156.19) configuration — NOT the full-power variant (A156.10). Heavy-door spring packs may produce opening speeds above 12 in./sec at initial push phase. Must verify across full spring-selection range.",
          actionRequired:
            "Run opening-speed test across spring options. Update spring-selection guide to flag any combos that approach or exceed 12 in./sec.",
          deadline: "Before next A156.19 certification renewal",
        },
        {
          brand: "ASSA ABLOY",
          model: "SW100",
          impactLevel: "significant",
          impactDescription:
            "SW100 low-energy swing door operator is governed by A156.19. Opening speed must be validated across the full door-weight and spring-selection range to confirm compliance with the 12 in./sec limit.",
          actionRequired:
            "Conduct opening-speed characterization per A156.19-2019 requirements. Update product certification documentation.",
          deadline: "Before next A156.19 certification renewal",
        },
        {
          brand: "ASSA ABLOY",
          model: "VersaMax (power-assist)",
          impactLevel: "significant",
          impactDescription:
            "VersaMax in power-assist configuration is governed by A156.19 (not A156.10 full-energy). Power-assist opening speed and force characteristics must comply with A156.19-2019 limits, including the 12 in./sec maximum opening speed.",
          actionRequired:
            "Validate VersaMax power-assist configuration against A156.19-2019 speed and force limits. Update product documentation to clearly identify A156.19 as the governing standard for power-assist mode.",
          deadline: "Before next A156.19 certification renewal",
        },
        {
          brand: "dormakaba",
          model: "ED50 Low-Energy Operator",
          impactLevel: "significant",
          impactDescription:
            "ED50 is a primary low-energy product. Opening speed must be validated for all door-weight/spring configurations. ADA-compliant mode (reduced force) unlikely to exceed limit; high-spring configurations need verification.",
          actionRequired:
            "Conduct opening-speed characterization test. Update certification documentation.",
        },
        {
          brand: "Stanley",
          model: "Magic-Access Low-Energy",
          impactLevel: "significant",
          impactDescription:
            "Magic-Access variants with high spring tension for exterior vestibule use need speed validation.",
          actionRequired:
            "Test and document speed compliance across spring range. Update product literature.",
        },
        {
          brand: "Horton",
          model: "Horton Low-Energy Series",
          impactLevel: "minor",
          impactDescription:
            "Low-energy sliding configurations are less likely to exceed 12 in./sec due to motor-controlled motion profile.",
          actionRequired:
            "Confirm via test data. Include in certification documentation.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Low-energy product lines need speed characterization testing across full spring/door-weight range — a moderate test cost. Spring-selection guides and product literature need update.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley"],
          pmInsight:
            "The 12 in./sec limit is actually a user-experience quality bar as much as a safety requirement — doors that open faster than 12 in./sec feel aggressive and are associated with higher injury perception. Frame speed compliance testing as part of a broader UX quality initiative.",
        },
      ],
      industryReaction:
        "Welcomed as a clarification. Some manufacturers noted the 12 in./sec limit had been industry practice for years; the explicit statement is helpful for AHJ enforcement and reduces disputes.",
      pmFraming:
        "A156.19-2019 makes the 12 in./sec opening-speed limit an explicit, directly testable requirement — previously it was implied through force and timing provisions. For low-energy product managers, this means spring-selection configuration guides must be audited against the speed limit, not just force limits, before the next certification cycle. It is also a user-experience quality bar: doors that open faster feel unsafe to users, making speed compliance a dual compliance-and-satisfaction metric.",
      source: "BHMA A156.19-2019",
    },
    {
      id: "a15619-c2",
      section: "Knowing-Act Definition",
      title: "Knowing-act definition expanded to include touchless wave sensors",
      description:
        "A156.19-2019 updates the 'knowing act' definition — the deliberate user action required to activate a low-energy or power-assist door — to explicitly include touchless wave sensors (gesture-based activation). Prior editions defined knowing-act as physical push-plate contact or push-button activation. The 2019 edition recognizes that a deliberate wave gesture in front of a sensor constitutes a knowing act that activates power-assist function. This brings the standard into alignment with post-COVID touchless access adoption. The definition update has ADA compliance implications: touchless wave activation on low-energy doors must now be evaluated under the knowing-act framework rather than treated as ambiguous or automatic-door territory.",
      changeType: "terminology",
      priority: "high",
      previousValue:
        "Knowing act limited to physical contact (push plate, push button, proximity card)",
      newValue:
        "Knowing act explicitly includes touchless wave sensors / gesture-based activation (A156.19-2019)",
      productImpact:
        "Wave-sensor activated low-energy operators now have a clear standard compliance path. Update product documentation to reference A156.19-2019 knowing-act definition for touchless activation configurations.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SW60 + Wave Sensor",
          impactLevel: "critical",
          impactDescription:
            "SW60 with wave sensor is a primary product for healthcare and post-COVID installations. A156.19-2019 knowing-act definition now formally supports this configuration's ADA compliance path. Update all SW60 + wave sensor spec sheets to cite A156.19-2019.",
          actionRequired:
            "Update product datasheets, ADA compliance statements, and submittal templates to reference A156.19-2019 §knowing-act definition for touchless activation. Train sales team on updated compliance path.",
          deadline: "Immediate — affects active specification work",
        },
        {
          brand: "dormakaba",
          model: "ED50 + Touchless Activation",
          impactLevel: "critical",
          impactDescription:
            "ED50 with touchless wave sensor now has explicit standard support for knowing-act classification. Critical for healthcare, K-12, and food service markets.",
          actionRequired:
            "Issue product bulletin confirming A156.19-2019 knowing-act compliance for touchless configurations. Update ADA documentation.",
          deadline: "Q3 2026",
        },
        {
          brand: "Stanley",
          model: "Magic-Access + Wave Sensor",
          impactLevel: "critical",
          impactDescription:
            "Magic-Access touchless configurations gain formal standard backing. High priority for healthcare spec.",
          actionRequired:
            "Update compliance documentation across Magic-Access touchless SKUs. Coordinate with regulatory affairs team on ADA position paper update.",
        },
        {
          brand: "Horton",
          model: "ICU / Healthcare Series + Touchless",
          impactLevel: "significant",
          impactDescription:
            "Healthcare-focused configurations rely heavily on touchless activation. A156.19-2019 compliance statement strengthens Horton's position in ICU/healthcare specifications.",
          actionRequired:
            "Update healthcare product compliance documentation. Inform spec-writer network of updated standard position.",
        },
      ],
      corporateImplications: [
        {
          type: "competitive_advantage",
          description:
            "Brands with touchless wave-sensor products already in market gain a formal standard backing that strengthens their ADA compliance narrative. This is a significant spec-writing opportunity: touchless activation is now a standard-compliant ADA pathway, not a gray area.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Immediately update all touchless low-energy product compliance documentation to cite A156.19-2019 knowing-act definition. This turns a previous 'ADA-compliant per manufacturer's interpretation' statement into 'ADA-compliant per ANSI/BHMA A156.19-2019' — a material difference in specification power.",
        },
        {
          type: "market_access",
          description:
            "Healthcare facilities, K-12 schools, and food service facilities are the primary growth markets for touchless access. The A156.19-2019 knowing-act update removes the last significant code ambiguity for specifying touchless low-energy operators in ADA-required applications.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Brief the healthcare and education sales verticals immediately. The ADA compliance ambiguity for wave sensors was the primary objection from cautious spec-writers and facility managers — this update eliminates that objection.",
        },
      ],
      industryReaction:
        "Broadly positive. Wave-sensor manufacturers and low-energy operator OEMs had lobbied for this inclusion since 2020. The COVID pandemic accelerated adoption of touchless activation; the standard needed to catch up. Some ADA advocates noted that wave gesture may be challenging for users with upper-limb motor impairments and called for alternative activation options to remain available.",
      pmFraming:
        "A156.19-2019 formally defines touchless wave-gesture activation as a valid 'knowing act' for low-energy doors — resolving a years-long ADA compliance ambiguity for wave-sensor products. This is a go-to-market unlock: our touchless low-energy configurations can now be specified with a clear ANSI/BHMA standard citation rather than a manufacturer-only ADA interpretation. For healthcare and food service verticals specifically, this removes the last major spec-writer objection to touchless activation.",
      source: "BHMA A156.19-2019",
    },
    {
      id: "a15619-c3",
      section: "§5.x — Force Limits",
      title: "Maximum 15 lbf to prevent movement restated",
      description:
        "A156.19-2019 restates the force requirement that a person must not be able to stop door movement with more than 15 lbf applied to prevent the door from opening. This is a continuation of the ADA-derived force threshold ensuring that powered door-assist provides meaningful benefit to users with mobility limitations — if a person can resist the door with only 15 lbf, the power assist is insufficient. The 2019 edition restates this with updated test method language specifying the measurement point (mid-height of the door leading edge) and test sequence (measured during assisted opening, not from latched position).",
      changeType: "requirement",
      priority: "medium",
      previousValue:
        "Max 15 lbf to prevent movement (prior editions); measurement point not specified",
      newValue:
        "Max 15 lbf to prevent movement; measured at mid-height of leading edge during assisted opening (A156.19-2019 §5.x)",
      productImpact:
        "Update test procedures to measure force at mid-height of leading edge during assisted opening. Confirm compliance at minimum assist-force setting.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SW60",
          impactLevel: "significant",
          impactDescription:
            "Test method update changes where force is measured. Confirm SW60 at minimum assist setting cannot be stopped with ≤15 lbf at mid-height leading edge.",
          actionRequired:
            "Re-run force compliance test using updated measurement protocol. Update certification documentation.",
        },
        {
          brand: "dormakaba",
          model: "ED50",
          impactLevel: "significant",
          impactDescription:
            "Same protocol update applies to ED50 across all door-weight configurations.",
          actionRequired:
            "Update internal test procedure to match A156.19-2019 §5.x measurement spec. Confirm compliance and update listing documentation.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Test method update requires re-running force tests using the new measurement point specification. Moderate test cost; no expected product changes if existing products pass.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley"],
          pmInsight:
            "Treat this as a test protocol update, not a product redesign. The 15 lbf limit is unchanged; only the measurement method is clarified. Coordinate with your test lab to update the measurement point spec before the next certification cycle.",
        },
      ],
      industryReaction:
        "Welcomed as a clarification that reduces ambiguity in certification test results. The explicit measurement point eliminates disputes about which test configuration applies.",
      pmFraming:
        "A156.19-2019 restates the 15 lbf 'cannot stop the door' force requirement with a precise measurement point — mid-height of the leading edge during assisted opening. The practical impact is test methodology: our certification lab must use the new measurement protocol on the next recertification cycle. Since the limit itself is unchanged, product redesign is unlikely; this is a test-procedure update with low risk of product non-compliance.",
      source: "BHMA A156.19-2019",
    },
    {
      id: "a15619-c4",
      section: "Hold-Open Time",
      title: "Minimum 5-second hold-open after activation device released",
      description:
        "A156.19-2019 specifies a minimum hold-open time of 5 seconds after the activation device (push plate, wave sensor, or other knowing-act device) is released before the door may begin to close. This ensures users — particularly those using wheelchairs, walkers, or carrying loads — have adequate time to pass through after triggering the door. The 5-second minimum is also the threshold at which most accessibility consultants consider a low-energy door to be ADA-compliant for self-service use. Doors with adjustable hold-open timers must be set to no less than 5 seconds, and default factory settings must comply.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "Hold-open time not previously stated as a discrete minimum",
      newValue: "Minimum 5 seconds after activation device released (A156.19-2019)",
      productImpact:
        "Default hold-open timer settings on all low-energy products must be ≥5 seconds. Adjust factory defaults if needed. Update commissioning documentation.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SW60",
          impactLevel: "significant",
          impactDescription:
            "SW60 factory default hold-open timer must be ≥5 seconds. Installer-adjustable range must allow values of 5 seconds and above.",
          actionRequired:
            "Verify factory default timer setting. Update controller programming documentation if default is below 5 seconds.",
        },
        {
          brand: "dormakaba",
          model: "ED50",
          impactLevel: "significant",
          impactDescription:
            "ED50 adjustable timer must be confirmed at ≥5-second default. Commissioning guide must explicitly reference the 5-second minimum.",
          actionRequired:
            "Check firmware default. Update commissioning checklist to include hold-open timer verification step.",
        },
        {
          brand: "Stanley",
          model: "Magic-Access",
          impactLevel: "minor",
          impactDescription:
            "Magic-Access typically ships with 5–7 second default. Confirm factory default is ≥5 seconds and document.",
          actionRequired: "Confirm default and update installation instructions.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Mostly a firmware default setting issue — low cost to fix if defaults are non-compliant. Larger risk is installed products with sub-5-second defaults that may be cited by AHJs or ADA compliance reviewers.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley"],
          pmInsight:
            "Audit factory default timer settings now and issue firmware update if any product ships below 5 seconds. Document the default value on every product spec sheet — spec-writers frequently ask about hold-open time defaults.",
        },
      ],
      industryReaction:
        "Positive across the board. The 5-second minimum had been industry practice consensus for years; codifying it removes ambiguity in ADA plan review.",
      pmFraming:
        "A156.19-2019 codifies the 5-second minimum hold-open time — which had been informal best practice — making it an explicit, enforceable requirement. This affects factory default settings: any low-energy product shipping with a hold-open timer defaulted below 5 seconds is potentially non-compliant. It is a simple firmware-default fix, but the PM team should confirm and document the factory default for every low-energy SKU, as spec-writers regularly ask about hold-open defaults in ADA accessibility submissions.",
      source: "BHMA A156.19-2019",
    },
    {
      id: "a15619-c5",
      section: "Definitions",
      title: "Power-assist definition clarified: distinct from low-energy automatic",
      description:
        "A156.19-2019 sharpens the definitional boundary between 'power assist' (requiring continuous user effort with motor augmentation) and 'low-energy automatic' (motor-powered door that moves on its own after knowing-act activation). Prior editions left ambiguity that led to products being mislabeled or misapplied. The 2023 clarification specifies: (1) power-assist doors require the user to push/pull throughout the entire swing and the motor reduces required force; (2) low-energy automatic doors activate on a knowing act and complete the swing without sustained user contact. This definitional clarity affects which test protocol applies, which signage is required, and how the door must be specified in ADA accessibility documentation.",
      changeType: "terminology",
      priority: "medium",
      previousValue:
        "Power-assist and low-energy automatic distinctions were loosely defined; products sometimes mislabeled",
      newValue:
        "Power-assist = continuous user effort + motor force reduction; Low-energy automatic = knowing-act activation + motor completes swing without sustained user contact (A156.19-2019)",
      productImpact:
        "Audit product classifications against updated definitions. Ensure power-assist products are not mislabeled as low-energy automatic, and vice versa. Signage requirements differ between the two categories.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Full low-energy product line",
          impactLevel: "significant",
          impactDescription:
            "Audit all A156.19-listed products to confirm correct classification against 2023 definitions. Products classified incorrectly may fail AHJ plan review.",
          actionRequired:
            "Conduct product classification audit against A156.19-2019 definitions. Update marketing/sales materials to use correct terminology.",
        },
        {
          brand: "dormakaba",
          model: "Full low-energy product line",
          impactLevel: "significant",
          impactDescription:
            "Same audit requirement. Particular attention to configurations where motor is set to partial-assist mode — confirm correct classification.",
          actionRequired: "Product classification audit and literature update.",
        },
        {
          brand: "Stanley",
          model: "Magic-Access variants",
          impactLevel: "minor",
          impactDescription:
            "Magic-Access is typically configured as low-energy automatic; confirm no variants are misclassified.",
          actionRequired: "Audit variant configurations against updated definitions.",
        },
      ],
      corporateImplications: [
        {
          type: "product_roadmap",
          description:
            "Sharper definitional boundaries create an opportunity to offer products explicitly marketed in each category with clear performance differentiation. A well-classified product line reduces plan-review friction.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley"],
          pmInsight:
            "Use the definitional update as an opportunity to audit and clean up your product taxonomy. A clearly classified and documented product line reduces sales-cycle friction — spec-writers and AHJs can match the correct product to the application without guessing.",
        },
      ],
      industryReaction:
        "Broadly welcomed. Code officials had been frustrated by ambiguous product classifications during plan review. The clearer definitions allow more consistent AHJ enforcement.",
      pmFraming:
        "A156.19-2019 draws a sharp line between power-assist (user pushes throughout, motor helps) and low-energy automatic (user triggers once, door completes swing). This definitional clarity is a product management issue because misclassification — a power-assist door spec'd and signed as low-energy automatic — will fail AHJ plan review. Run a classification audit against the 2019 definitions and clean up any product datasheets that use the terms interchangeably.",
      source: "BHMA A156.19-2019",
    },
  ],
  watchList: [
    {
      id: "a15619-w1",
      title: "DOJ ADA Technical Bulletin — Touchless Knowing-Act Guidance Expected",
      description:
        "Department of Justice is expected to issue updated ADA technical guidance on touchless/wave-sensor activation for accessible doors. This would complement A156.19-2019's knowing-act expansion by providing DOJ-endorsed ADA compliance language for touchless access. If issued, it would significantly accelerate touchless adoption in federally regulated facilities.",
      expectedDate: "2025–2026 (no confirmed date)",
      priority: "high",
      actionRequired:
        "Monitor DOJ ADA rulemaking docket. Prepare product compliance brief that can be updated immediately when DOJ bulletin is released.",
    },
    {
      id: "a15619-w2",
      title: "Next A156.19 revision cycle — estimated 2026–2028",
      description:
        "A156.19-2019 is the current edition. Next revision cycle expected around 2024–2026 based on BHMA's typical 3–5 year cadence. Expected topics: energy harvesting activation devices, touchless/wave-sensor knowing-act integration, biometric knowing-act, multi-ability activation options for users with upper-limb motor impairments.",
      expectedDate: "2026–2028",
      priority: "low",
      actionRequired:
        "Monitor BHMA ballot announcements. Consider BHMA membership participation to influence next revision.",
    },
  ],
  timeline: [
    { date: "2007", label: "A156.19-2007 Published", type: "release", editionRef: "2007" },
    {
      date: "2019",
      label: "A156.19-2019 — touchless knowing-act, 12 in./sec, 5-sec hold-open, power-assist/low-energy definitions (CURRENT EDITION)",
      type: "release",
      editionRef: "2019",
    },
    {
      date: "2024–2026 (est.)",
      label: "Next A156.19 revision expected",
      type: "revision-start",
    },
  ],
  nextRevisionExpected: "2024–2026 (est.)",
};

// ─── ANSI/BHMA A156.27 (Revolving Doors) ────────────────────────────────────

const a15627: Standard = {
  id: "a156.27",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.27",
  fullName: "Power and Manually Operated Revolving Pedestrian Doors",
  scope:
    "Governs power-operated and manually operated revolving pedestrian doors — NOT sliding doors. Establishes rotational speed limits (max 4 RPM power-operated), wing breakout force requirements (max 130 lbf), egress width minimums (36 in. aggregate breakout), and ADA adjacency requirements. Revolving doors may not serve as the sole means of egress — a compliant adjacent door is always required. Applies to RD700-series and all revolving door products; does not apply to sliding (A156.10/A156.38) or swing (A156.10/A156.19) door operators.",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2024",
    year: 2024,
    effectiveDate: "2024",
    status: "stable",
  },
  pastEditions: [],
  recentChanges: [
    {
      id: "a15627-c1",
      section: "Rotational Speed",
      title: "Maximum rotational speed: 4 RPM",
      description:
        "A156.27 establishes a maximum rotational speed of 4 RPM for power-operated revolving doors. This limit exists to ensure pedestrians — particularly those with mobility impairments — can enter and exit the compartment safely without being struck by a rotating wing. Speed sensors and electronic controllers must enforce this limit. Power-operated revolving doors are required to decelerate to a safe speed when the compartment is occupied, and a hold-open or slowdown mode is required when an occupant is detected near the wing edge.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "N/A (standing requirement)",
      newValue: "Max 4 RPM (A156.27 standing requirement)",
      productImpact:
        "Revolving door speed controllers must enforce 4 RPM maximum. Verify speed limiting under full load (occupied compartment with heaviest expected user load).",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "RD700 Revolving Door",
          impactLevel: "significant",
          impactDescription:
            "RD700 series revolving doors are governed exclusively by A156.27. Confirm 4 RPM maximum rotational speed is enforced across all operating modes, including push-start manual activation.",
          actionRequired:
            "Confirm test data in A156.27-2024 certification file. Update certification documentation to reference 2024 edition.",
        },
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam Tomsed / Tourniket",
          impactLevel: "informational",
          impactDescription:
            "Boon Edam revolving doors are designed to A156.27 requirements. Confirm 4 RPM max is enforced across all operating modes including push-start manual.",
          actionRequired:
            "Confirm test data in A156.27 certification file. No design change expected.",
        },
        {
          brand: "dormakaba",
          model: "Agile Revolving Door",
          impactLevel: "informational",
          impactDescription:
            "Agile revolving door certified to A156.27; confirm 4 RPM compliance documentation is current.",
          actionRequired: "Verify certification is current edition. No design change expected.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Standing requirement — compliance cost is built into existing product certification. No new action required if current certification is up to date.",
          affectedBrands: ["ASSA ABLOY", "dormakaba"],
          pmInsight:
            "Revolving door speed compliance is a feature, not just a safety requirement — 4 RPM is the maximum, and a revolving door that defaults to 2–3 RPM with faster option only on demand provides better user experience for mixed-ability users.",
        },
      ],
      industryReaction: "Standing requirement; no industry reaction.",
      pmFraming:
        "A156.27's 4 RPM speed limit for revolving doors is a standing safety requirement, but the product management angle is more interesting: products that intelligently slow below 4 RPM when the compartment is occupied — using occupancy sensors — are differentiating features in healthcare and high-traffic hospitality specs where user safety perception matters more than throughput. NOTE: A156.27 applies exclusively to revolving door products (e.g., RD700) — not to sliding (A156.10/A156.38) or swing (A156.10/A156.19) door operators.",
      source: "BHMA A156.27",
    },
    {
      id: "a15627-c2",
      section: "Egress — Breakout",
      title: "36 in. aggregate egress width required via breakout panels",
      description:
        "A156.27 requires that revolving doors provide at least 36 inches of aggregate clear egress width when wings are folded into the breakout position. This is achieved through collapsing wing panels that fold flat against the door structure in an emergency, creating a clear through-passage. The 36 in. minimum matches the IBC accessible route minimum and ADA clear width requirement. In practice, most four-wing revolving doors provide 36–40 in. of aggregate breakout width. The breakout mechanism must operate without tools and be achievable by a single person with a maximum force of 130 lbf (see §a15627-c3).",
      changeType: "requirement",
      priority: "high",
      previousValue: "N/A (standing requirement)",
      newValue: "36 in. aggregate egress width in breakout position (A156.27 standing requirement)",
      productImpact:
        "All revolving door configurations must provide ≥36 in. aggregate clear width in breakout mode. Verify with as-installed dimensions including any threshold transitions.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam Tomsed / All revolving",
          impactLevel: "significant",
          impactDescription:
            "Breakout width must be measured and certified at as-installed configuration, accounting for carpet, threshold, and any frame trim that may reduce clear width.",
          actionRequired:
            "Include breakout width measurement in commissioning checklist. Confirm 36 in. with as-installed conditions.",
        },
        {
          brand: "dormakaba",
          model: "Agile Revolving Door",
          impactLevel: "significant",
          impactDescription: "Same requirement — verify breakout width under installation conditions.",
          actionRequired: "Include in commissioning protocol.",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "Revolving doors cannot serve as the sole means of egress regardless of breakout width — an adjacent swing or sliding door is always required. This creates paired-product sales opportunities for every revolving door installation.",
          affectedBrands: ["ASSA ABLOY", "dormakaba"],
          pmInsight:
            "Every revolving door specification creates a guaranteed co-specification for an adjacent automatic or manual door. Train sales teams on the adjacency requirement as a natural upsell anchor — the architect designing the revolving door must also specify the adjacent accessible door.",
        },
      ],
      industryReaction: "Standing requirement; no recent reaction.",
      pmFraming:
        "A156.27 requires 36 inches of aggregate breakout egress width for revolving doors — meaning the wings must collapse to provide a clear egress path without tools in an emergency. The product management takeaway is less about the technical requirement and more about the co-spec opportunity: because revolving doors can never be the sole means of egress, every revolving door installation by code requires an adjacent compliant door, making revolving door projects consistent multi-unit sales opportunities.",
      source: "BHMA A156.27",
    },
    {
      id: "a15627-c3",
      section: "Wing Breakout Force",
      title: "Maximum wing breakout force: 130 lbf",
      description:
        "A156.27 limits the maximum force required to fold a revolving door wing into the breakout position to 130 lbf. This ensures that in an emergency evacuation scenario, a person of ordinary physical capability (or two people in collaboration) can collapse the wing to create the egress path. The 130 lbf force must be achievable at the leading edge of the wing, measured at mid-height. Any locking mechanism, magnetic hold, or mechanical detent that prevents breakout must release automatically under emergency conditions. Electronic revolving doors must fail-safe to allow breakout on power loss.",
      changeType: "requirement",
      priority: "high",
      previousValue: "N/A (standing requirement)",
      newValue: "Max 130 lbf at leading edge mid-height (A156.27 standing requirement)",
      productImpact:
        "Verify breakout force test data across all revolving door configurations including motorized and braked systems. Confirm fail-safe breakout on power loss.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam Tomsed Power / Manual",
          impactLevel: "significant",
          impactDescription:
            "Power-operated revolving doors with electromagnetic braking must confirm breakout force ≤130 lbf with power off. Regenerative braking systems must not hold force above threshold.",
          actionRequired:
            "Test breakout force with power off. Document in certification file. Include in commissioning checklist.",
        },
        {
          brand: "dormakaba",
          model: "Agile Revolving Door",
          impactLevel: "significant",
          impactDescription:
            "Same power-off breakout force verification required.",
          actionRequired: "Include in commissioning protocol and certification documentation.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Breakout force verification is a standard commissioning step. Risk is in field-installed systems where debris, wear, or unauthorized modifications increase breakout force above 130 lbf over time. Preventive maintenance programs should include periodic breakout force testing.",
          affectedBrands: ["ASSA ABLOY", "dormakaba"],
          pmInsight:
            "Sell preventive maintenance contracts that include annual breakout force testing — it is a compliance requirement that creates a recurring revenue opportunity for the service organization.",
        },
      ],
      industryReaction: "Standing requirement; no recent reaction.",
      pmFraming:
        "The 130 lbf wing breakout force limit for revolving doors is a life-safety requirement ensuring emergency evacuation capability. From a service business perspective, breakout force increases over time due to wear and debris — making annual breakout force testing a legitimate preventive maintenance contract line item that addresses a genuine compliance need.",
      source: "BHMA A156.27",
    },
    {
      id: "a15627-c4",
      section: "ADA Adjacency",
      title: "Adjacent accessible door required: sliding or swing, for wheelchair access",
      description:
        "A156.27 and IBC §1010.1 together require that every revolving door installation include an adjacent door — swing or sliding — that provides accessible entry and egress for wheelchair users and others who cannot use the revolving door. The adjacent door must provide a minimum 36 in. clear width, must be operable from both sides, and must be located in close proximity to the revolving door (typically within the same entrance assembly). Power-operated automatic adjacent doors are preferred in high-traffic applications. The ADA adjacency requirement cannot be satisfied by the revolving door breakout panels alone — a separate, always-available accessible door is required.",
      changeType: "requirement",
      priority: "high",
      previousValue: "N/A (standing requirement; codified in A156.27 and IBC §1010.1)",
      newValue:
        "Separate adjacent sliding or swing accessible door required; min 36 in. clear; always available (A156.27 / IBC §1010.1)",
      productImpact:
        "Every revolving door project requires a co-specified adjacent accessible door. Ensure project specifications include adjacent automatic or accessible manual door at same entrance assembly.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam + SL500 / SW200i Adjacent",
          impactLevel: "significant",
          impactDescription:
            "Revolving door projects should be standard-quoted with adjacent SL500 (sliding) or SW200i (swing) automatic door. ADA-compliant accessible approach path must be maintained.",
          actionRequired:
            "Update quoting templates to auto-include adjacent accessible door in revolving door specifications. Train sales team on code-required adjacency.",
        },
        {
          brand: "dormakaba",
          model: "Agile + ED50 / ESA Adjacent",
          impactLevel: "significant",
          impactDescription:
            "Adjacent door should be ED50 or ESA automatic to maximize ADA compliance and user experience.",
          actionRequired:
            "Configure quoting system to flag revolving door projects as requiring adjacent door spec.",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "The adjacency requirement creates a guaranteed two-product sale per revolving door entrance. The adjacent automatic door is often the higher-margin item in the entrance package.",
          affectedBrands: ["ASSA ABLOY", "dormakaba"],
          pmInsight:
            "Structure revolving door entrance packages as complete entrance systems — revolving door plus adjacent automatic door — rather than individual product sales. The code requirement is the sales rationale; the entrance system package is the margin opportunity.",
        },
      ],
      industryReaction:
        "Well-established requirement. Industry focus has shifted to ensuring the adjacent door is also high-quality and accessible — cheap manual doors installed as 'ADA compliant' adjacent doors are a common complaint from disability advocacy groups.",
      pmFraming:
        "A156.27 and IBC §1010.1 together require an accessible adjacent door at every revolving door installation — this is not optional and cannot be satisfied by breakout panels alone. For product and sales teams, this is the most important business implication of A156.27: every revolving door project is by code a two-product entrance specification. Bundle revolving door quotes with adjacent automatic door options as a complete entrance system.",
      source: "BHMA A156.27 / IBC §1010.1",
    },
  ],
  watchList: [
    {
      id: "a15627-w1",
      title: "Next A156.27 revision — timing unknown",
      description:
        "No announced revision cycle for A156.27. Monitor BHMA for ballot notices. Expected topics if revised: power-operated speed sensing with machine vision, enhanced ADA adjacency guidance, energy management for revolving door heating/cooling integration.",
      expectedDate: "TBD",
      priority: "low",
      actionRequired: "Monitor BHMA ballot announcements.",
    },
  ],
  timeline: [
    {
      date: "Current",
      label: "A156.27 Current Edition — 4 RPM, 130 lbf breakout, 36 in. egress",
      type: "release",
    },
  ],
  nextRevisionExpected: "TBD",
};

// ─── ANSI/BHMA A156.38-2019 (Low-Energy Sliding and Folding Door Closures) ───────

const a15638: Standard = {
  id: "a156.38",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.38",
  fullName: "Automatic Sliding and Folding Door Systems",
  scope:
    "Covers low-energy sliding AND folding door closures — not limited to slim-profile doors. Addresses performance testing, operator requirements, air infiltration compliance paths, and installation requirements for automatic sliding and folding door systems. The 2019 edition is the current edition. A future revision is expected to expand to system-level certification (operator + frame + glazing + hardware). Expected to be cited in FBC 10th Edition as a compliance path for automatic sliding door systems in Florida.",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2019",
    year: 2019,
    effectiveDate: "2019",
    status: "stable",
  },
  pastEditions: [
    {
      version: "Prior Edition",
      year: 2014,
      effectiveDate: "2014",
      status: "stable",
      adoptedBy: ["Low-energy sliding/folding (prior scope)"],
    },
  ],
  recentChanges: [
    {
      id: "a15638-c1",
      section: "Scope — Low-Energy Sliding and Folding Closures",
      title: "A156.38-2019 governs low-energy sliding AND folding door closures — not limited to slim-profile",
      description:
        "A156.38-2019 covers low-energy sliding AND folding door closure systems. The standard is not limited to slim-profile or narrow doors — it applies to the full range of low-energy automatic sliding and folding door operators. A156.38-2019 establishes performance testing requirements, operator force and timing limits, sensor specifications, and installation requirements applicable to this category. A future revision (anticipated as A156.38-2024 or later) is expected to expand to a full system-level certification framework (operator + frame + glazing + hardware as an integrated assembly).",
      changeType: "scope",
      priority: "high",
      previousValue:
        "A156.38 prior editions: limited scope, operators only",
      newValue:
        "A156.38-2019: low-energy sliding AND folding door closures (not slim-profile only); current edition",
      productImpact:
        "Low-energy automatic sliding and folding door operators must be certified under A156.38-2019. Specification documentation must reference A156.38, not A156.10, for low-energy configurations.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 System",
          impactLevel: "critical",
          impactDescription:
            "SL500 must be tested and listed as a complete system with ASSA ABLOY-approved frame and glazing configurations. Third-party frame pairings not included in the system listing may create compliance gaps in A156.38-citing jurisdictions.",
          actionRequired:
            "Define and list system configurations (operator + frame + glazing combos). Publish A156.38-2019 system listing documentation. Advise field sales of system-listing requirement.",
          deadline: "Before FBC 10th Edition adoption (est. 2029–2030)",
        },
        {
          brand: "dormakaba",
          model: "ESA 300 / ESA 500 System",
          impactLevel: "critical",
          impactDescription:
            "ESA sliding door systems require system-level A156.38-2019 certification. Dormakaba's integrated frame + operator offerings are well-positioned; third-party frame configurations need separate system listing.",
          actionRequired:
            "Initiate A156.38-2019 system certification for primary ESA configurations. Document compliant frame/glass combinations.",
          deadline: "Proactively — before A156.38 becomes FBC requirement",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide 2000 System",
          impactLevel: "critical",
          impactDescription:
            "DURA-Glide 2000 operator must be tested with approved frame/glass combinations for A156.38-2019 compliance. Stanley's historically operator-focused approach needs system-level certification investment.",
          actionRequired:
            "Prioritize A156.38-2019 system certification testing. Define approved system configurations. Update product documentation.",
        },
        {
          brand: "Horton",
          model: "Series 4000 System",
          impactLevel: "significant",
          impactDescription:
            "Horton's hermetic door systems are inherently integrated — the hermetic seal requires a fully integrated frame/operator/glass system. This positions Horton well for A156.38 system certification.",
          actionRequired:
            "Pursue A156.38-2019 system certification for standard and hermetic configurations. Use system-certification as marketing differentiator.",
        },
      ],
      corporateImplications: [
        {
          type: "product_roadmap",
          description:
            "A156.38-2019 system-level certification requirement favors manufacturers with fully integrated door system offerings over pure operator OEMs who rely on third-party frames. This is a strategic product roadmap inflection point for operator-only brands.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Operator-only brands that do not pursue system-level certification risk losing specification preference to integrated system suppliers when A156.38 is adopted by FBC and other jurisdictions. The roadmap question is: do you invest in certified system combinations, or do you partner with frame/glazing suppliers for co-certification?",
        },
        {
          type: "competitive_advantage",
          description:
            "Brands with integrated door system portfolios — frame, glass, operator, hardware all from one supplier — are naturally positioned for system-level A156.38 certification and can offer architects a single system listing across the full assembly.",
          affectedBrands: ["dormakaba", "Horton"],
          pmInsight:
            "Integrated system brands should pursue A156.38 certification aggressively and make single-system-listing a spec-writer value proposition: one listing, one accountability, one warranty. This directly addresses architect frustration with split system accountability.",
        },
        {
          type: "market_access",
          description:
            "Once FBC 10th Edition cites A156.38-2019 as the compliance path for automatic sliding doors in Florida, uncertified systems may not be permitted. This creates a hard market access gate for the Florida commercial construction market.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Florida is ~10% of US commercial construction value. FBC 10th Edition A156.38 citation would make system-level certification non-negotiable for the Florida market. Timeline: FBC 10th expected ~2029–2030 — plan certification by 2028.",
        },
      ],
      industryReaction:
        "Mixed. Integrated system manufacturers welcomed the change. Operator-only manufacturers raised concerns about testing cost for multiple frame/glass combinations. Some distributors noted complexity in advising customers on approved system combinations.",
      pmFraming:
        "A156.38-2019 is the current governing standard for low-energy sliding AND folding door closure systems. The key PM insight is scope clarity: A156.38-2019 covers the full range of low-energy automatic sliding and folding operators — not just slim-profile products. Ensure product specification documentation correctly references A156.38-2019 (not A156.10) for all low-energy configurations to avoid AHJ plan review rejections. A future revision is expected to expand to system-level certification (operator + frame + glazing), which will create new certification requirements when adopted.",
      source: "BHMA A156.38-2019",
    },
    {
      id: "a15638-c2",
      section: "Air Infiltration",
      title: "Air infiltration compliance path defined for automatic sliding door systems",
      description:
        "A156.38-2019 establishes an air infiltration compliance path specific to automatic sliding door systems. Prior standards for air infiltration (AAMA, NFRC) were designed for static fenestration — windows and fixed frames — and required significant interpretation to apply to automatic doors that move, seal dynamically, and have active seal compression systems. A156.38-2019 defines test conditions that replicate the operational state of the door (closed and sealed) and provides performance levels (leakage rates) appropriate for high-traffic automatic door applications. The compliance path is particularly relevant for the FBC 9th Edition water infiltration requirements and for IECC 2024 air infiltration tightening if adopted by Florida.",
      changeType: "test-method",
      priority: "high",
      previousValue:
        "Air infiltration for automatic sliding doors tested under AAMA/window standards not designed for operational door systems",
      newValue:
        "A156.38-2019 defines air infiltration test conditions and performance levels specific to automatic sliding door systems in operational (closed/sealed) state",
      productImpact:
        "Automatic sliding door systems can now demonstrate air infiltration compliance under a standard designed for their operational characteristics. Update product specifications to reference A156.38-2019 air infiltration compliance path.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 GreenStar / Insulated",
          impactLevel: "significant",
          impactDescription:
            "GreenStar and insulated SL500 variants are the primary energy-efficient automatic door products. A156.38-2019 air infiltration path provides a more appropriate compliance standard for these products than AAMA window tests.",
          actionRequired:
            "Test GreenStar configurations under A156.38-2019 air infiltration protocol. Update product energy compliance documentation.",
        },
        {
          brand: "dormakaba",
          model: "ESA 300/500 Insulated",
          impactLevel: "significant",
          impactDescription:
            "ESA insulated system benefits from the A156.38-specific air infiltration compliance path. Test and document.",
          actionRequired:
            "Conduct air infiltration testing per A156.38-2019. Update LEED and energy code compliance documentation.",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide Insulated",
          impactLevel: "significant",
          impactDescription:
            "Insulated DURA-Glide configurations should pursue A156.38-2019 air infiltration certification.",
          actionRequired:
            "Test and certify under A156.38-2019 air infiltration protocol.",
        },
      ],
      corporateImplications: [
        {
          type: "competitive_advantage",
          description:
            "A156.38-2019 air infiltration certification provides a more defensible energy-code compliance position than applying window standards to automatic doors. First movers gain advantage in LEED/energy code projects.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley"],
          pmInsight:
            "Position A156.38-2019 air infiltration certification as the gold standard for energy-compliant automatic sliding doors — better than any competitor using window standards not designed for operational automatic doors.",
        },
        {
          type: "market_access",
          description:
            "FBC 9th Edition's TAS 203 water infiltration requirement and potential IECC 2024 adoption by Florida create market access dependencies on air/water infiltration testing. A156.38-2019 provides the framework.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "The A156.38 air infiltration path and FBC TAS 203 water infiltration requirement are converging forces — products that proactively test and certify under both will be positioned for the FL 9th Edition market without last-minute scramble.",
        },
      ],
      industryReaction:
        "Welcomed by energy-conscious specifiers and LEED project teams who had long struggled with applying AAMA window air infiltration standards to automatic doors.",
      pmFraming:
        "A156.38-2019 provides an air infiltration compliance path specifically designed for automatic sliding door systems — not the window standards that were previously misapplied. This is critical for Florida, where FBC 9th Edition's water infiltration requirement (TAS 203) and potential IECC 2024 adoption both tighten envelope performance requirements. Products certified under A156.38-2019 air infiltration will have a cleaner compliance story in energy code submissions than competitors relying on inapplicable window standards.",
      source: "BHMA A156.38-2019",
    },
  ],
  watchList: [
    {
      id: "a15638-w1",
      title: "WATCH: FBC 10th Edition expected to cite A156.38-2019",
      description:
        "Florida Building Code 10th Edition (expected ~2029–2030) is anticipated to adopt A156.38-2019 as the reference standard for automatic sliding door system compliance in Florida. When adopted, it will create a hard system-level certification requirement for all automatic sliding doors installed under the Florida Building Code — making A156.38-2019 system listings mandatory for the Florida market.",
      expectedDate: "~2029–2030 (FBC 10th Edition)",
      priority: "high",
      actionRequired:
        "Begin A156.38-2019 system certification testing by 2027–2028 to be ready ahead of FBC 10th Edition adoption. Monitor FBC TAC for A156.38 reference language in draft 10th Edition provisions.",
    },
    {
      id: "a15638-w2",
      title: "Next revision cycle: est. 2024–2026",
      description:
        "A156.38-2019 is the current edition. A future revision is anticipated (est. 2024–2026) to expand scope to system-level certification (operator + frame + glazing + hardware as integrated assembly). Expected topics: system-level testing protocols, hermetic door performance paths, integration with A156.10 and A156.19 operator requirements, HVHZ-specific provisions, and air infiltration compliance.",
      expectedDate: "2024–2026 (est.)",
      priority: "medium",
      actionRequired:
        "Monitor BHMA for A156.38 revision ballot. Consider participation to influence system-level testing scope and HVHZ provisions.",
    },
  ],
  timeline: [
    {
      date: "2019",
      label: "A156.38-2019 — low-energy sliding AND folding door closures (CURRENT EDITION)",
      type: "release",
      editionRef: "2019",
    },
    {
      date: "2024–2026 (est.)",
      label: "Next A156.38 revision expected — system-level scope expansion anticipated",
      type: "revision-start",
    },
    {
      date: "~2029–2030",
      label: "FBC 10th Edition expected to adopt A156.38 citation for automatic sliding doors",
      type: "milestone",
    },
  ],
  nextRevisionExpected: "2024–2026 (est.)",
};

// ─────────────────────────────────────────────────────────────────────────────
// ICC / IBC TRACK
// ─────────────────────────────────────────────────────────────────────────────

const ibc2024: Standard = {
  id: "ibc-2024",
  trackId: "icc",
  designation: "IBC 2024 — §1010.1.4 / §1105.1.1",
  fullName:
    "International Building Code 2024 — Power-Operated Doors (Egress + Accessible Entrances)",
  scope:
    "Covers IBC 2024 requirements for power-operated doors in two primary contexts: (1) §1010.1.4 — power-operated doors in means of egress, including breakout force limits, fail-safe requirements, and emergency operation requirements for sliding egress doors; (2) §1105.1.1 — mandatory power-operated doors at accessible public entrances based on occupancy group and occupant load, including 2024 vestibule pair and mixed-use occupancy clarifications.",
  governingBody: "International Code Council (ICC)",
  governingBodyUrl: "https://www.iccsafe.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "IBC 2024",
    year: 2024,
    effectiveDate: "Varies by jurisdiction",
    status: "pending-adoption",
    adoptedBy: ["Model Code (2024)", "FBC 9th Edition basis (eff. Dec 31, 2026)"],
  },
  pastEditions: [
    {
      version: "IBC 2021",
      year: 2021,
      effectiveDate: "2021",
      status: "stable",
    },
    {
      version: "IBC 2018",
      year: 2018,
      effectiveDate: "2018",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "ibc-c1",
      section: "§1010.1.4.2 — Sliding Egress Door Breakout Force",
      title: "Breakout force maximum 50 lbf for sliding power-operated egress doors",
      description:
        "IBC 2024 §1010.1.4.2 establishes that power-operated sliding doors serving as a component of a means of egress must be capable of being opened with a maximum force of 50 lbf applied at the mid-height of the leading edge of the door panel, in the egress direction. This breakout force limit applies to the sliding panel(s) in the unlatched, de-energized state — simulating power failure or emergency conditions. The 50 lbf limit ensures that a person without special knowledge or tools can force the door open to escape in an emergency. Motor braking, magnetic latching, and track friction must all be accounted for in the 50 lbf measurement.",
      changeType: "requirement",
      priority: "high",
      previousValue:
        "Breakout force addressed in prior editions but with less specificity in measurement point and power-failure simulation",
      newValue:
        "Max 50 lbf at mid-height of leading edge in egress direction, de-energized state (IBC 2024 §1010.1.4.2)",
      productImpact:
        "All sliding automatic door operators installed in egress paths must be verified to permit breakout with ≤50 lbf in power-off condition. Test with motor de-energized, brakes released, and any magnetic holdbacks de-activated.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 (egress configurations)",
          impactLevel: "critical",
          impactDescription:
            "SL500 units installed in means of egress must demonstrate ≤50 lbf breakout force with power off. Regenerative braking and motor cogging must not hold force above threshold.",
          actionRequired:
            "Conduct power-off breakout force test per §1010.1.4.2 measurement protocol. Publish test results in egress configuration spec sheets. Update installation instructions for egress-path configurations.",
          deadline: "Required for all egress-path projects under IBC 2024-adopting jurisdictions",
        },
        {
          brand: "dormakaba",
          model: "ESA 300 / ESA 500 (egress configurations)",
          impactLevel: "critical",
          impactDescription:
            "ESA egress configurations must meet 50 lbf breakout. Motor cogging force in de-energized state is the primary risk factor.",
          actionRequired:
            "Measure cogging force contribution. If above threshold, specify minimum-cogging motor option for egress configurations. Document in spec sheets.",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide 2000 (egress configurations)",
          impactLevel: "critical",
          impactDescription:
            "DURA-Glide egress configurations require breakout force verification. Heavy hermetic-seal variants are at higher risk of exceeding 50 lbf.",
          actionRequired:
            "Test across door weight and track friction range. Update egress configuration selection guide.",
        },
        {
          brand: "Horton",
          model: "Series 4000 (egress configurations)",
          impactLevel: "critical",
          impactDescription:
            "Hermetic door seals significantly increase sliding resistance. Hermetic egress configurations are the highest-risk category for exceeding 50 lbf breakout force.",
          actionRequired:
            "Prioritize hermetic egress breakout force testing. May require dedicated low-friction egress hermetic configuration. Do not install standard hermetic Series 4000 in egress paths without verified breakout force data.",
          deadline: "Immediate — hermetic egress is highest-risk category across industry",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Egress breakout force testing is required for any automatic sliding door installed in a means of egress. Testing cost is moderate; the higher risk is liability for installed products that may not meet 50 lbf without power.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Make egress vs. non-egress a primary configuration dimension in your product selection tool. Egress configurations should automatically flag breakout force compliance status. Architects who specify an automatic sliding door in an egress path need a clear compliance statement.",
        },
        {
          type: "competitive_risk",
          description:
            "A manufacturer whose product fails egress breakout force requirements faces significant liability if that failure results in harm during an emergency evacuation. This is the highest legal risk in the automatic door standards space.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Egress breakout force compliance is a liability management issue as much as a product compliance issue. Every egress automatic door installation should include documented breakout force test data in the project file — both for certification and for litigation protection.",
        },
      ],
      industryReaction:
        "The explicit 50 lbf breakout force measurement protocol in IBC 2024 was welcomed by code officials who had previously struggled to enforce the requirement without a clear test method. Manufacturers noted that hermetic sliding doors — which use continuous perimeter seals — are the most challenged product category.",
      pmFraming:
        "IBC 2024 §1010.1.4.2 sets a hard 50 lbf breakout force limit for automatic sliding doors in egress paths, measured at mid-height of the leading edge with power off. This is a life-safety requirement with direct liability exposure: a sliding egress door that takes 80 lbf to force open during a power failure is a code violation and an injury risk. Product teams must ensure egress-configuration documentation includes verified breakout force data, and that motor braking and track friction are factored into the measurement.",
      source: "IBC 2024 §1010.1.4.2",
      sourceUrl: "https://www.iccsafe.org",
    },
    {
      id: "ibc-c2",
      section: "§1010.1.4.2(b) — Fail-Safe Egress Requirement",
      title: "Fail-safe: sliding egress door must open/remain open on power failure",
      description:
        "IBC 2024 §1010.1.4.2(b) requires that power-operated sliding doors in means of egress fail to a safe state on power failure — specifically, that the door either automatically opens (power-fail open) or can be manually pushed open without exceeding the 50 lbf breakout force limit. A door that locks, latches, or remains motor-held closed on power failure in the egress direction is a code violation. This requirement affects every power-operated sliding egress door: the controller must default to power-fail open or power-fail free-slide state. Electromagnetic locks and motor brakes must release on power loss unless supported by a code-compliant fail-safe power backup system.",
      changeType: "requirement",
      priority: "high",
      previousValue:
        "Fail-safe requirement addressed but with ambiguity about whether fail-open or fail-free was required",
      newValue:
        "Sliding egress door must open or remain in open position on power failure in egress direction; motor brakes / locks must release (IBC 2024 §1010.1.4.2(b))",
      productImpact:
        "All sliding egress door configurations must be verified for fail-safe behavior on power loss. Controller firmware must default to fail-open or fail-free mode. EM locks, motor brakes, and holdbacks must release on power loss.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 (egress configurations)",
          impactLevel: "critical",
          impactDescription:
            "SL500 controller must be configured for fail-open or fail-free default. Verify EM holdback release on power loss. Document in egress configuration installation guide.",
          actionRequired:
            "Publish explicit egress fail-safe configuration guide for SL500. Include commissioning step to test fail-safe behavior before certificate of occupancy.",
          deadline: "Immediate — FBC 9th Ed. eff. Dec 31, 2026 for FL projects",
        },
        {
          brand: "dormakaba",
          model: "ESA 300/500 (egress)",
          impactLevel: "critical",
          impactDescription:
            "ESA egress must default to fail-open or fail-free. Verify in commissioning. Document in certification literature.",
          actionRequired:
            "Update egress commissioning procedure. Add fail-safe behavior verification step.",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide 2000 (egress)",
          impactLevel: "critical",
          impactDescription: "Same fail-safe requirement applies across DURA-Glide egress configurations.",
          actionRequired:
            "Confirm factory default for egress configuration is fail-open or fail-free. Update documentation.",
        },
        {
          brand: "Horton",
          model: "Series 4000 (egress)",
          impactLevel: "critical",
          impactDescription:
            "Hermetic door seals create resistance that may prevent fail-free sliding. Fail-open mode (powered by battery backup) may be required for hermetic egress configurations.",
          actionRequired:
            "Evaluate fail-safe mode for hermetic egress. Battery backup fail-open may be necessary. Document and specify clearly.",
        },
      ],
      corporateImplications: [
        {
          type: "product_roadmap",
          description:
            "Battery backup systems for fail-safe egress operation are an emerging product category. Integrating UL-listed battery backup with automatic door controllers for egress applications creates a value-add product bundle.",
          affectedBrands: ["ASSA ABLOY", "dormakaba"],
          pmInsight:
            "Battery backup fail-open kits for egress doors are a high-margin accessory with a direct code compliance rationale. Bundle them with egress door configurations as a compliance package, particularly for healthcare and high-occupancy assembly use cases where egress reliability is critical.",
        },
        {
          type: "competitive_risk",
          description:
            "Egress fail-safe failures are the single highest-liability scenario in the automatic door industry. A door that holds closed during an emergency evacuation creates catastrophic product liability exposure.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Treat egress fail-safe testing as a non-negotiable commissioning step — not just a factory certification. Every egress installation should include a documented power-loss fail-safe test in the commissioning sign-off. Build this into the service contract as an annual test item.",
        },
      ],
      industryReaction:
        "The fail-safe requirement is broadly accepted. The 2024 edition's clearer language reduces ambiguity about which fail state is acceptable (open vs. free-slide). Healthcare facilities noted that fail-open is often impractical for infection-control sliding doors, increasing demand for battery-backup solutions.",
      pmFraming:
        "IBC 2024 §1010.1.4.2(b) requires automatic sliding egress doors to fail safe — either open or free-sliding with ≤50 lbf — when power is lost. This is the highest-liability requirement in the automatic door space: a door that locks closed on power failure during an emergency is both a code violation and a life-safety incident waiting to happen. PMs should build fail-safe commissioning verification into every egress installation protocol and consider battery-backup fail-open kits as a compliance product bundle.",
      source: "IBC 2024 §1010.1.4.2(b)",
      sourceUrl: "https://www.iccsafe.org",
    },
    {
      id: "ibc-c3",
      section: "§1010.1.4.2 — 2024 Assembly Occupancy Update",
      title: "Enhanced requirements for power-operated doors in assembly occupancies",
      description:
        "IBC 2024 §1010.1.4.2 includes enhanced language specifically addressing power-operated doors in assembly occupancies (Group A-1 through A-4). Assembly occupancies — theaters, arenas, stadiums, religious facilities — present heightened egress risk due to crowd loads and panic behavior during emergencies. The 2024 update adds provisions requiring that power-operated doors in assembly egress paths be designed and installed to remain operational under crowd-load lateral forces, and that fail-safe systems be rated for the occupant load. The changes align with lessons learned from several emergency evacuation incidents in assembly occupancies where automatic doors contributed to egress bottlenecks.",
      changeType: "requirement",
      priority: "high",
      previousValue:
        "General egress requirements applied to assembly occupancies without crowd-load specific provisions",
      newValue:
        "Assembly occupancy power-operated egress doors must be designed for crowd-load lateral forces and fail-safe systems rated for occupant load (IBC 2024 §1010.1.4.2)",
      productImpact:
        "Automatic doors specified in Group A assembly egress paths require structural and force verification under crowd-load conditions. Update assembly occupancy specification guides.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 / SW200i (assembly occupancy)",
          impactLevel: "significant",
          impactDescription:
            "SL500 and SW200i in assembly egress paths must be verified for crowd-load lateral force resistance. Header and frame structural specifications need to address crowd pressure.",
          actionRequired:
            "Develop assembly occupancy specification guide addressing crowd-load structural requirements. Coordinate with structural engineer for header/frame specs.",
        },
        {
          brand: "Horton",
          model: "Series 4000 (assembly occupancy)",
          impactLevel: "significant",
          impactDescription:
            "Series 4000 in large assembly facilities must meet enhanced crowd-load requirements. Heavy structural frames required.",
          actionRequired:
            "Develop assembly occupancy structural specification. Specify minimum frame and anchorage requirements.",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "Assembly occupancy projects (arenas, stadiums, large religious facilities) represent a high-value market segment. Enhanced IBC 2024 requirements create a barrier to entry for low-quality operators but also a specification opportunity for manufacturers with documented crowd-load capacity.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Develop a premium assembly occupancy egress door package with documented crowd-load structural specifications. This positions your product in a high-value project category where the enhanced requirements price out lower-quality alternatives.",
        },
      ],
      industryReaction:
        "Welcomed by life safety engineers and facility managers of large assembly venues. The specific crowd-load provisions address a real gap in prior editions.",
      pmFraming:
        "IBC 2024's enhanced assembly occupancy provisions for power-operated egress doors address crowd-load lateral forces — a real engineering challenge in arenas, theaters, and stadiums during emergency evacuations. For product teams, this creates both a compliance requirement and a market differentiation opportunity: document your product's structural capacity under crowd-load conditions and position it as the specified solution for high-occupancy assembly egress applications.",
      source: "IBC 2024 §1010.1.4.2",
      sourceUrl: "https://www.iccsafe.org",
    },
    {
      id: "ibc-c4",
      section: "§1105.1.1 — Accessible Entrances",
      title: "Mandatory power-operated doors at accessible entrances — vestibule and mixed-use clarifications",
      description:
        "IBC 2024 §1105.1.1 continues the mandatory power-operated door requirements first introduced in IBC 2021, with two significant 2024 clarifications: (1) Vestibule rule: in vestibule configurations with doors in series, at least one of each opposing pair must be power-operated — resolving prior ambiguity about whether only the exterior pair or both pairs required power operation; (2) Mixed-use occupancy: tenant spaces with dedicated exterior entrances are now treated as separate facilities for threshold occupant-load calculation purposes, meaning a large mixed-use building may contain multiple tenant-level calculations rather than a single aggregate building-level calculation. Mandatory thresholds remain: A-1 through A-4 assembly at >300 occupants; B and M occupancies at >500 occupants; R-1 transient residential at >500 occupants.",
      changeType: "requirement",
      priority: "high",
      previousValue:
        "Mandatory thresholds from IBC 2021; vestibule applicability ambiguous; mixed-use used aggregate building load",
      newValue:
        "Vestibule: at least one of each opposing pair must be power-operated; mixed-use: tenant-level calculation (IBC 2024 §1105.1.1)",
      productImpact:
        "Vestibule projects require minimum two operator units. Mixed-use projects require tenant-level occupant load analysis for each entrance.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All operator product lines",
          impactLevel: "significant",
          impactDescription:
            "Vestibule projects now reliably require two operator units minimum — one per pair of opposing doors. Update vestibule quoting templates.",
          actionRequired:
            "Update vestibule specification templates to include both pairs of opposing doors. Brief sales team on vestibule pair requirement.",
        },
        {
          brand: "dormakaba",
          model: "All operator product lines",
          impactLevel: "significant",
          impactDescription: "Same vestibule pair requirement update applies.",
          actionRequired: "Update quoting and specification templates for vestibule configurations.",
        },
        {
          brand: "Stanley",
          model: "All operator product lines",
          impactLevel: "significant",
          impactDescription: "Same.",
          actionRequired: "Update vestibule spec templates and train sales team.",
        },
        {
          brand: "Horton",
          model: "All operator product lines",
          impactLevel: "significant",
          impactDescription: "Same.",
          actionRequired: "Update vestibule configuration specification documentation.",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "Vestibule clarification reliably doubles the automatic door operator count for vestibule projects at qualifying occupancies. This is a clear market demand driver.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Build vestibule pair requirement into every qualifying occupancy quote — it is now a code requirement, not an upsell. Sales teams should present it as 'both pairs of vestibule doors are required to have at least one power-operated door' with the code citation, not as an optional upgrade.",
        },
        {
          type: "competitive_advantage",
          description:
            "Brands that train their spec-writing support teams on IBC 2024 vestibule and mixed-use calculation nuances can provide architects with more accurate compliance analysis than competitors still referencing IBC 2021.",
          affectedBrands: ["ASSA ABLOY", "dormakaba"],
          pmInsight:
            "Build a IBC 2024 §1105.1.1 occupancy threshold calculator into your spec-writer tool or online product selector. The mixed-use tenant-level calculation is complex; a tool that helps architects quickly determine which entrances require power-operated doors is a high-value spec-writer resource.",
        },
      ],
      industryReaction:
        "Vestibule clarification was broadly welcomed. The mixed-use occupancy calculation clarification created some consternation among large mixed-use building owners who thought they might have reduced obligations — in practice, the tenant-level calculation cuts both ways.",
      pmFraming:
        "IBC 2024 §1105.1.1 clarifies two important scenarios: vestibule pairs now each require at least one power-operated door, and mixed-use buildings calculate mandatory thresholds at the tenant level. The vestibule clarification is especially significant because it means virtually every code-mandated vestibule project now requires a minimum of two operator units — one per pair of opposing doors — which is a reliable market demand amplifier for the accessible entrance segment.",
      source: "IBC 2024 §1105.1.1 / I Dig Hardware 2025",
      sourceUrl:
        "https://idighardware.com/2025/07/decoded-accessibility-requirements-for-automatic-doors/",
    },
  ],
  watchList: [
    {
      id: "ibc-w1",
      title: "State adoption of IBC 2024 — Florida via FBC 9th Edition (Dec 31, 2026)",
      description:
        "IBC 2024 becomes Florida law via FBC 9th Edition on December 31, 2026. Other major states on IBC 2024 adoption watch: California (Title 24 update cycle), Texas (2025 legislative session), New York (NYC code update cycle). IBC 2024 adoption by major construction markets accelerates the mandatory demand driver at §1105.1.1 and brings §1010.1.4.2 egress provisions into force.",
      expectedDate: "Dec 31, 2026 (FL); varies by state",
      priority: "high",
      actionRequired:
        "Map target project states against IBC 2021 vs. 2024 adoption status. Update compliance checker with state-specific edition references. Flag any active projects in pre-2024 states for edition transition planning.",
    },
    {
      id: "ibc-w2",
      title: "IBC 2027 code development — §1105 and §1010 changes expected",
      description:
        "ICC Code Development Hearings for IBC 2027 are underway. Proposals under consideration include further expansion of mandatory power-operated door thresholds (lowering occupant load triggers), and additional ADA-aligned language on touchless activation under §1105. Monitor ICC public comment periods.",
      expectedDate: "2027 publication",
      priority: "medium",
      actionRequired:
        "Follow ICC public comment periods for §1105 and §1010 proposals. Submit comments supporting expanded mandatory thresholds (demand driver) and language clarifying touchless activation compliance.",
    },
  ],
  timeline: [
    { date: "2018", label: "IBC 2018 Published", type: "release", editionRef: "IBC 2018" },
    {
      date: "2021",
      label: "IBC 2021 — §1105.1.1 first mandatory automatic door thresholds",
      type: "release",
      editionRef: "IBC 2021",
    },
    {
      date: "2024",
      label: "IBC 2024 — §1010.1.4.2 egress, vestibule, mixed-use, assembly",
      type: "release",
      editionRef: "IBC 2024",
    },
    {
      date: "2025",
      label: "IBC 2027 code development hearings begin",
      type: "revision-start",
    },
    {
      date: "Dec 31, 2026",
      label: "FBC 9th Ed. effective — adopts IBC 2024 as basis",
      type: "effective",
    },
    { date: "2027", label: "IBC 2027 expected publication", type: "release" },
  ],
  nextRevisionExpected: "2027",
};

// ─────────────────────────────────────────────────────────────────────────────
// FBC TRACK
// ─────────────────────────────────────────────────────────────────────────────

const fbc9th: Standard = {
  id: "fbc-9th",
  trackId: "fbc",
  designation: "FBC 9th Edition",
  fullName: "Florida Building Code — 9th Edition (Effective December 31, 2026) | FBC 8th Edition Currently In Force",
  scope:
    "FBC 8th Edition currently in force (eff. Dec 31, 2023, based on IBC 2021). FBC 9th Edition transition: Dec 31, 2026 — this is the upcoming compliance deadline. FBC 9th Edition is based on the 2024 International Codes with Florida-specific amendments. For automatic door and fenestration products: introduces 160 mph wind envelope mandate via HB 911, adds TAS 203 water infiltration testing requirement (user confirmed), includes fenestration classification changes for automatic door systems (documents pending), continues HVHZ NOA requirements, and adopts IBC 2024 §1105.1.1 power-operated door accessibility provisions. All projects permitted after December 31, 2026 must comply with the 9th Edition.",
  governingBody: "Florida Building Commission (FBC)",
  governingBodyUrl: "https://floridabuilding.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "9th Edition",
    year: 2026,
    effectiveDate: "December 31, 2026",
    status: "alert",
  },
  pastEditions: [
    {
      version: "8th Edition",
      year: 2023,
      effectiveDate: "December 31, 2023",
      status: "stable",
    },
    {
      version: "7th Edition",
      year: 2020,
      effectiveDate: "January 1, 2021",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "fbc-c1",
      section: "HB 911 — Envelope / NOA",
      title: "ALERT: 160 mph wind-speed envelope mandate — all new exterior openings in Florida",
      description:
        "HB 911 (codified in FBC 9th Edition) mandates that all new exterior openings in Florida — including automatic sliding and swing door assemblies — meet 160 mph design wind speed. This is a statewide requirement, not limited to the HVHZ (Miami-Dade and Broward counties). Products without a current Notice of Acceptance (NOA) certifying performance at 160 mph must be re-tested and re-certified. For automatic door assemblies, the NOA must cover the complete assembly — operator, frame, glazing, hardware — as the structural unit. Products with existing NOA ratings below 160 mph, or issued under prior FBC editions that specified lower wind speeds, will not be compliant for post-December 31, 2026 permits. Re-testing and NOA issuance by Miami-Dade BOAF typically takes 6–12 months.",
      changeType: "requirement",
      priority: "high",
      previousValue:
        "HVHZ: prior design wind speed requirements varied by county; non-HVHZ: lower wind speed requirements per ASCE 7",
      newValue:
        "160 mph wind-speed design for all new exterior openings statewide; NOA certification required at 160 mph (HB 911 / FBC 9th Ed.)",
      productImpact:
        "All automatic door assemblies (operator + frame + glass) installed in Florida exterior openings after December 31, 2026 must carry current NOA certifying 160 mph performance. Products rated below 160 mph require re-testing now.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 (FL exterior, all configurations)",
          impactLevel: "critical",
          impactDescription:
            "SL500 exterior configurations installed in Florida must have NOA at 160 mph. Review current NOA coverage for SL500 frame/glass system combinations. Identify any configurations rated below 160 mph.",
          actionRequired:
            "Audit all SL500 NOA certificates for 160 mph coverage. Initiate re-testing for any configuration below 160 mph. Publish FL compliance matrix by Q3 2026.",
          deadline: "Testing must be complete and NOA issued before December 31, 2026 effective date",
        },
        {
          brand: "ASSA ABLOY",
          model: "Besam GreenStar (FL exterior)",
          impactLevel: "critical",
          impactDescription:
            "GreenStar insulated sliding door in Florida exterior applications must have 160 mph NOA. Insulated panels have different structural performance characteristics than standard glass.",
          actionRequired:
            "Separate NOA testing required for GreenStar insulated configuration. Initiate testing immediately.",
          deadline: "Q3 2026 to allow NOA processing time before Dec 31, 2026",
        },
        {
          brand: "dormakaba",
          model: "ESA 300 / ESA 500 (FL exterior)",
          impactLevel: "critical",
          impactDescription:
            "ESA exterior configurations in Florida require 160 mph NOA. System-level certification (operator + frame + glass) is needed.",
          actionRequired:
            "Audit ESA NOA certificate portfolio. Identify gaps. Initiate re-testing for sub-160 mph configurations.",
          deadline: "Q3 2026",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide 2000 (FL exterior)",
          impactLevel: "critical",
          impactDescription:
            "DURA-Glide Florida exterior configurations require 160 mph NOA audit and re-testing where needed.",
          actionRequired:
            "Conduct NOA audit. Prioritize high-volume FL configurations for testing.",
          deadline: "Q3 2026",
        },
        {
          brand: "Horton",
          model: "Series 4000 (FL exterior)",
          impactLevel: "critical",
          impactDescription:
            "Horton hermetic and non-hermetic exterior FL configurations require 160 mph NOA. Hermetic seal increases frame structural loading — may require enhanced frame specification for 160 mph compliance.",
          actionRequired:
            "Audit NOA portfolio. Hermetic configurations are highest priority for re-testing. Coordinate with structural engineering on frame reinforcement if needed.",
          deadline: "Q2 2026 — hermetic testing must begin immediately due to longer lead time",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "Products without 160 mph NOA cannot be installed in Florida exterior openings after December 31, 2026. Florida represents approximately 10% of US commercial construction value and a disproportionate share of automatic door volume due to climate-controlled building preference. Market exclusion for non-certified products is hard.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "160 mph NOA certification is a market access gate for Florida, not a feature. Every product team with Florida revenue exposure must have NOA re-testing on the product roadmap for H1 2026 execution — the December 31, 2026 deadline does not flex. Projects permitted after that date will require documentation of 160 mph compliance.",
        },
        {
          type: "compliance_cost",
          description:
            "NOA re-testing costs (structural, impact, and water infiltration testing) at Miami-Dade BOAF can range from $15,000 to $50,000 per product configuration. Multiple frame/glass combinations multiply this cost. The testing and approval cycle typically takes 6–12 months.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Budget NOA re-testing now and start testing in Q2 2026. Any delay risks missing the December 31, 2026 deadline. A product without a current 160 mph NOA on January 1, 2027 is unsellable into Florida exterior applications — the revenue impact vastly exceeds the testing cost.",
        },
        {
          type: "competitive_advantage",
          description:
            "Brands that complete 160 mph NOA certification early can publish compliance matrices and market 'Florida 9th Edition Ready' status while competitors scramble. This is a meaningful spec differentiation for the 2026 Florida project pipeline.",
          affectedBrands: ["ASSA ABLOY", "dormakaba"],
          pmInsight:
            "Race to publish FL 9th Edition compliance matrices for all exterior configurations before Q4 2026. Architects designing 2026 Florida projects are selecting products now — 'Florida 9th Edition Certified' is a decision-making factor for projects that will be permitted in 2027.",
        },
      ],
      industryReaction:
        "HB 911 generated significant concern in the fenestration and automatic door industries because the 160 mph mandate extends beyond the traditional HVHZ to all Florida exterior openings. Manufacturers with narrow NOA portfolios (few configurations tested) face the most disruption. Industry groups have lobbied for transition provisions for projects in design as of the effective date.",
      pmFraming:
        "HB 911 in FBC 9th Edition is a market-access forcing function: any automatic door installed in a Florida exterior opening after December 31, 2026 must have a 160 mph NOA certification — no exceptions, no grandfather provisions for designs in progress. The 6–12 month NOA process timeline means testing must begin by Q2 2026 to make the deadline. For product teams, the right question is not 'do we need to do this' but 'which configurations don't have 160 mph NOA yet and how fast can we test them.'",
      source: "USGlass Magazine / FBC 9th Edition",
      sourceUrl:
        "https://www.usglassmag.com/florida-building-code-update-signals-stronger-impact-requirements-for-building-envelopes/",
    },
    {
      id: "fbc-c2",
      section: "TAS 203 — Water Infiltration Testing",
      title: "CONFIRMED NEW: TAS 203 water infiltration testing required for exterior automatic door products in FL",
      description:
        "FBC 9th Edition adds a water infiltration testing requirement for exterior opening products in Florida — including automatic door assemblies — per TAS 203 (Test Application Standard 203, a Florida-specific water infiltration protocol developed for hurricane-resistant fenestration). User confirmed: this requirement is new and is specifically required for automatic door assemblies under the 9th Edition. TAS 203 tests simulate wind-driven rain conditions at specified pressures, verifying that the door assembly does not allow water infiltration through the frame, glazing edge, panel seals, or threshold. This is NEW territory for most automatic door operators, which have historically been tested under AAMA or ASTM static water infiltration methods less severe than TAS 203's dynamic simulation. Products that passed prior water tests may not pass TAS 203 without modifications to seals, threshold design, or glazing edge details. Documents are pending for exact section number and pressure thresholds — tracked as confirmed but documentation incomplete.",
      changeType: "test-method",
      priority: "high",
      previousValue:
        "Automatic door water infiltration tested under AAMA 101/ASTM E547 static methods; TAS 203 not previously required for automatic door operators",
      newValue:
        "TAS 203 dynamic water infiltration testing required for exterior automatic door assemblies in Florida (FBC 9th Ed.) — USER CONFIRMED, DOCUMENTS PENDING",
      productImpact:
        "All exterior automatic door assemblies installed in Florida after December 31, 2026 must have TAS 203 water infiltration test data. This is a new test requirement — most existing automatic door test portfolios do not include TAS 203 results. Testing must begin immediately.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 (FL exterior, all configurations)",
          impactLevel: "critical",
          impactDescription:
            "SL500 exterior FL configurations almost certainly lack TAS 203 test data — this is a new requirement. Threshold, bottom seal, and glazing edge details are the primary water infiltration risk points on automatic sliding doors.",
          actionRequired:
            "Immediately initiate TAS 203 testing for SL500 exterior FL configurations. Engage Florida-approved testing laboratory. Evaluate threshold and seal design for water infiltration performance before testing.",
          deadline: "Testing must begin Q2 2026 to allow processing time before Dec 31, 2026",
        },
        {
          brand: "ASSA ABLOY",
          model: "Besam GreenStar (FL exterior)",
          impactLevel: "critical",
          impactDescription:
            "Insulated panel edge seals are a specific water infiltration risk under TAS 203 dynamic conditions. GreenStar configurations need priority testing.",
          actionRequired:
            "TAS 203 testing for GreenStar — coordinate with glazing supplier on panel edge seal performance.",
          deadline: "Q2 2026",
        },
        {
          brand: "dormakaba",
          model: "ESA 300 / ESA 500 (FL exterior)",
          impactLevel: "critical",
          impactDescription:
            "ESA exterior FL configurations require TAS 203 testing. Perimeter frame seals and threshold details need evaluation prior to testing.",
          actionRequired:
            "Initiate TAS 203 testing. Evaluate frame and threshold design for dynamic water infiltration performance.",
          deadline: "Q2 2026",
        },
        {
          brand: "Stanley",
          model: "DURA-Glide 2000 (FL exterior)",
          impactLevel: "critical",
          impactDescription:
            "DURA-Glide exterior FL configurations require TAS 203. Sliding door bottom clearance and threshold design are the primary risk factors.",
          actionRequired:
            "Initiate TAS 203 testing for DURA-Glide exterior FL configurations. Threshold design review recommended prior to testing.",
          deadline: "Q2 2026",
        },
        {
          brand: "Horton",
          model: "Series 4000 Hermetic (FL exterior)",
          impactLevel: "critical",
          impactDescription:
            "Hermetic door seal systems provide excellent static water resistance but must be validated under TAS 203 dynamic conditions. The hermetic seal's operational characteristics (activated by door closure) must maintain integrity under TAS 203 pressure differential.",
          actionRequired:
            "Prioritize TAS 203 testing for hermetic exterior configurations. Hermetic seal performance under dynamic pressure is a differentiating feature if it passes — document prominently.",
          deadline: "Q2 2026 — hermetic testing has longer lead time",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "TAS 203 testing is a significant new compliance cost — all exterior automatic door product configurations require testing under a protocol many manufacturers have not previously encountered. Test laboratory capacity in Florida for TAS 203 is limited; early booking is essential.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Book TAS 203 test slots immediately — Florida-approved testing labs have limited capacity and will be backlogged as the December 31, 2026 deadline approaches. Every automatic door manufacturer in the Florida market is facing this simultaneously. Early movers get test slots; late movers get delays.",
        },
        {
          type: "market_access",
          description:
            "TAS 203 compliance is a market access gate for FL exterior automatic doors starting December 31, 2026. Products without TAS 203 data cannot be specified in Florida exterior openings under the 9th Edition. This is a complete market exclusion for non-compliant products.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "TAS 203 is not negotiable for the Florida exterior market. Frame this to leadership as a market access investment: the cost of TAS 203 testing is the cost of maintaining revenue from Florida exterior projects after December 31, 2026.",
        },
        {
          type: "competitive_advantage",
          description:
            "Hermetic door systems may have a structural advantage in TAS 203 testing due to their continuous perimeter seals. If hermetic products pass TAS 203 with better performance than sliding doors with discrete seals, hermetic becomes a Florida-preferred specification for high-moisture exterior applications.",
          affectedBrands: ["Horton", "dormakaba"],
          pmInsight:
            "If hermetic configurations pass TAS 203 with strong margins, publish test results prominently. A hermetic automatic door that outperforms standard automatic doors on TAS 203 water infiltration has a genuine specification advantage in Florida coastal and high-rainfall applications.",
        },
      ],
      industryReaction:
        "TAS 203 for automatic doors is generating significant concern in the industry. BHMA and the automatic door industry have noted that TAS 203 was developed for window and fixed fenestration systems, and its application to operable automatic door systems creates unique challenges — particularly for sliding door threshold and seal designs that were not engineered to resist dynamic water pressure. Industry working groups are engaged with the Florida Building Commission on implementation guidance.",
      pmFraming:
        "TAS 203 water infiltration testing is the most operationally disruptive requirement in FBC 9th Edition for automatic door manufacturers — it is a new test protocol, not previously applied to automatic door operators, that must be completed for every exterior Florida configuration before December 31, 2026. The practical risk is significant: sliding door thresholds, bottom seals, and glazing edge details that have never been designed to TAS 203 dynamic pressure conditions may not pass without modification. Product teams must initiate TAS 203 testing now and should engage engineering on threshold and seal design prior to testing to maximize first-pass probability.",
      source: "FBC 9th Edition (user confirmed) / USGlass Magazine",
      sourceUrl:
        "https://www.usglassmag.com/florida-building-code-update-signals-stronger-impact-requirements-for-building-envelopes/",
    },
    {
      id: "fbc-c3",
      section: "Fenestration Classification — Automatic Door Systems",
      title: "CONFIRMED PENDING: Fenestration classification changes for automatic door systems",
      description:
        "FBC 9th Edition is confirmed by the user to include changes to fenestration classification for automatic door systems — affecting how automatic door assemblies are categorized for thermal, solar, structural, and water infiltration performance purposes. The specific text and section numbers are not yet available (documents pending). Expected impact: changes to fenestration classification will affect which performance certifications and test protocols apply to automatic door assemblies installed in Florida, particularly regarding frame/glass integration specifications and thermal/solar performance requirements for HVHZ applications. This item is tracked as CONFIRMED but DOCUMENTS PENDING — section details will be updated when the full 9th Edition document is obtained.",
      changeType: "scope",
      priority: "high",
      previousValue:
        "Automatic door systems fenestration classification per FBC 8th Edition / AAMA/WDMA/CSA 101",
      newValue:
        "Fenestration classification changes for automatic door systems — CONFIRMED, documents pending. Expected to affect frame/glass integration and thermal/solar performance requirements. (FBC 9th Ed.)",
      productImpact:
        "When documents are available: review fenestration chapter for automatic door classification changes. Update product certification portfolio to match new classification requirements. Expected impact on frame/glass integration specifications.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All FL exterior automatic door configurations",
          impactLevel: "significant",
          impactDescription:
            "Fenestration classification changes may affect which thermal/solar certifications are required for SL500, GreenStar, and other FL exterior products.",
          actionRequired:
            "Obtain 9th Edition fenestration chapter when available. Immediate review of automatic door classification language. Assess certification gap.",
          deadline: "Within 30 days of 9th Edition document availability",
        },
        {
          brand: "dormakaba",
          model: "All FL exterior automatic door configurations",
          impactLevel: "significant",
          impactDescription: "Same — await document and assess classification changes.",
          actionRequired: "Same — immediate review upon document availability.",
        },
        {
          brand: "Stanley",
          model: "All FL exterior automatic door configurations",
          impactLevel: "significant",
          impactDescription: "Same.",
          actionRequired: "Same.",
        },
        {
          brand: "Horton",
          model: "All FL exterior automatic door configurations",
          impactLevel: "significant",
          impactDescription: "Same.",
          actionRequired: "Same.",
        },
      ],
      corporateImplications: [
        {
          type: "product_roadmap",
          description:
            "Fenestration classification changes may require additional certifications (thermal, solar, energy) for automatic door assemblies — expanding the certification portfolio beyond structural/impact/water testing.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Place a high-priority flag on obtaining and reviewing the fenestration chapter of the FBC 9th Edition document. If classification changes impose new thermal or solar performance certifications, these will require NFRC or equivalent testing that has a separate timeline and cost from structural/NOA testing.",
        },
      ],
      industryReaction:
        "Industry is waiting for the full document. Fenestration classification changes for automatic doors is a novel area — most fenestration classification frameworks were built for fixed windows and do not naturally accommodate dynamic automatic door systems.",
      pmFraming:
        "The FBC 9th Edition fenestration classification changes for automatic door systems are confirmed but documents are pending. This is the highest-uncertainty item in the 9th Edition compliance picture: we know something is changing in how automatic door assemblies are classified for fenestration purposes, but the specific requirements are not yet available. Product teams should treat this as a priority read-immediately item when the 9th Edition document is published and engage code consultants to assess classification impact on certification requirements.",
      source: "FBC 9th Edition (user confirmed, documents pending)",
      sourceUrl: "https://floridabuilding.org",
    },
    {
      id: "fbc-c4",
      section: "§1709.5 — NOA Label",
      title: "HVHZ NOA label requirement continued — no change",
      description:
        "FBC 9th Edition continues the requirement under §1709.5 that all products installed in the High-Velocity Hurricane Zone (Miami-Dade and Broward counties) must bear a Notice of Acceptance (NOA) label issued by the Miami-Dade Building and Neighborhood Compliance Department (formerly BOAF). No change to the NOA label requirement — it remains mandatory for HVHZ installations. The key update in the 9th Edition context is that the NOA must cover the product at the new 160 mph wind speed standard (see fbc-c1). An existing NOA that covers 130 mph is not compliant for 9th Edition projects, even if the label is current.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "NOA label required in HVHZ (Miami-Dade + Broward) — continuing requirement",
      newValue:
        "NOA label required in HVHZ (Miami-Dade + Broward) — continuing, but NOA must now certify 160 mph performance (§1709.5 / FBC 9th Ed.)",
      productImpact:
        "All HVHZ products must have current NOA. 160 mph NOA recertification (see fbc-c1) will result in new NOA issuance — ensure all HVHZ product installations reference the new 160 mph NOA number.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All HVHZ-installed products",
          impactLevel: "significant",
          impactDescription:
            "When new 160 mph NOA is issued (following fbc-c1 re-testing), update all HVHZ product labels, submittal packages, and installation documentation to reference the new NOA number.",
          actionRequired:
            "Update NOA tracking database upon new certificate issuance. Distribute new NOA numbers to field sales and distributors.",
        },
        {
          brand: "dormakaba",
          model: "All HVHZ-installed products",
          impactLevel: "significant",
          impactDescription: "Same NOA update requirement.",
          actionRequired: "Track and update NOA numbers upon new certificate issuance.",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "NOA label tracking and updating is an ongoing compliance cost. New NOA issuance from 160 mph re-testing creates a documentation refresh requirement across all HVHZ product installations.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Maintain a live NOA tracking database linked to the product catalog. Every time a new NOA is issued, it must flow immediately to product labels, submittal packages, distributor documentation, and online specification tools.",
        },
      ],
      industryReaction: "No change to NOA label requirement itself; accepted as continuing requirement.",
      pmFraming:
        "FBC 9th Edition continues the HVHZ NOA label requirement under §1709.5 — no change in the requirement itself, but the underlying NOA must now certify 160 mph performance. Products with sub-160 mph NOAs effectively have invalid NOAs for 9th Edition purposes, making the 160 mph re-testing (fbc-c1) directly linked to maintaining a valid NOA label for HVHZ installations.",
      source: "FBC 9th Edition §1709.5",
      sourceUrl: "https://floridabuilding.org",
    },
    {
      id: "fbc-c5",
      section: "HVHZ — County Scope",
      title: "HVHZ county list unchanged: Miami-Dade + Broward remain HVHZ",
      description:
        "FBC 9th Edition does not change the High-Velocity Hurricane Zone county boundaries. Miami-Dade and Broward counties remain the designated HVHZ. No other counties have been added to the HVHZ in the 9th Edition. Note: HB 911's 160 mph mandate applies statewide, not just to HVHZ — so all Florida exterior openings are affected by the wind-speed increase, but only Miami-Dade and Broward require NOA label per §1709.5.",
      changeType: "scope",
      priority: "low",
      previousValue: "HVHZ: Miami-Dade + Broward counties (FBC 8th Ed.)",
      newValue:
        "HVHZ: Miami-Dade + Broward counties — no change (FBC 9th Ed.); HB 911 160 mph mandate is statewide separate from HVHZ designation",
      productImpact:
        "No change to HVHZ county designation. Confirm project county before applying HVHZ vs. non-HVHZ compliance requirements. Note: 160 mph wind speed applies statewide regardless of HVHZ status.",
      productImpacts: [],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "No change to HVHZ scope. Compliance resources are well-established for HVHZ. Key risk is confusion between HVHZ NOA requirements (Miami-Dade + Broward only) and 160 mph statewide mandate (all FL) — these are distinct but related requirements.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Train sales teams on the distinction: 160 mph NOA is required statewide for exterior openings, but the §1709.5 NOA label requirement is specific to HVHZ (Miami-Dade + Broward). Projects in Palm Beach, Pinellas, or other coastal non-HVHZ counties still need 160 mph certified products, but without the full HVHZ NOA process.",
        },
      ],
      industryReaction: "No reaction — no change.",
      pmFraming:
        "The HVHZ county list is unchanged in FBC 9th Edition — Miami-Dade and Broward remain the only HVHZ counties. However, the 160 mph wind-speed mandate from HB 911 applies to all Florida exterior openings, not just HVHZ. This distinction matters for product compliance strategy: HVHZ requires full NOA per §1709.5; non-HVHZ counties require 160 mph certified products without the full NOA process.",
      source: "FBC 9th Edition",
      sourceUrl: "https://floridabuilding.org",
    },
    {
      id: "fbc-c6",
      section: "§1105.1.1 (IBC 2024 basis) — Accessible Entrances",
      title: "IBC 2024 §1105.1.1 power-operated door requirements adopted into FBC 9th Ed.",
      description:
        "FBC 9th Edition adopts IBC 2024 as its base code, bringing all IBC 2024 §1105.1.1 power-operated door accessibility requirements into force in Florida as of December 31, 2026. This includes: mandatory power-operated doors for assembly occupancies (A-1 through A-4) at >300 occupants and business/mercantile/R-1 at >500 occupants; vestibule pair rule (at least one of each opposing pair must be power-operated); and tenant-level mixed-use occupancy calculation. Florida-specific amendments to §1105.1.1 (if any) are pending full document review.",
      changeType: "requirement",
      priority: "high",
      previousValue:
        "FBC 8th Edition referenced IBC 2021 §1105.1.1 — no vestibule pair clarification, aggregate mixed-use calculation",
      newValue:
        "FBC 9th Edition adopts IBC 2024 §1105.1.1 — vestibule pair requirement, tenant-level mixed-use calculation effective December 31, 2026 in Florida",
      productImpact:
        "Florida projects permitted after December 31, 2026 must comply with IBC 2024 §1105.1.1 vestibule and mixed-use provisions. Update Florida project specification templates.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All FL operator product lines",
          impactLevel: "significant",
          impactDescription:
            "FL vestibule projects now require at least one power-operated door per opposing pair. Update FL project specification templates and sales quoting.",
          actionRequired:
            "Update FL-specific spec templates. Brief FL sales team on vestibule pair requirement under FBC 9th Ed.",
          deadline: "Before Dec 31, 2026",
        },
        {
          brand: "dormakaba",
          model: "All FL operator product lines",
          impactLevel: "significant",
          impactDescription: "Same update required.",
          actionRequired: "Update FL spec templates and train FL sales team.",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "IBC 2024 §1105.1.1 vestibule pair requirement applied in Florida creates additional mandatory automatic door demand in qualifying occupancies starting December 31, 2026.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "The vestibule pair requirement in Florida is a direct market demand driver — it mandates a second operator unit in vestibule configurations that previously required only one. This is incremental revenue for every qualifying Florida vestibule project permitted after December 31, 2026.",
        },
      ],
      industryReaction:
        "Positive from automatic door manufacturers. Florida has a large volume of qualifying occupancy projects in the pipeline.",
      pmFraming:
        "FBC 9th Edition brings IBC 2024 §1105.1.1 into Florida law — including the vestibule pair rule that mandates at least one power-operated door per opposing pair of vestibule doors. For Florida market revenue planning, this is a demand amplifier: every qualifying vestibule project in Florida permitted after December 31, 2026 requires a minimum of two operator units where previously one might have been specified.",
      source: "FBC 9th Edition / IBC 2024 §1105.1.1",
      sourceUrl: "https://floridabuilding.org",
    },
  ],
  watchList: [
    {
      id: "fbc-w1",
      title: "ALERT: FBC 9th Edition effective December 31, 2026 — all items below are time-critical",
      description:
        "The FBC 9th Edition becomes Florida law on December 31, 2026. Projects permitted after this date must comply with: 160 mph NOA (fbc-c1), TAS 203 water infiltration testing (fbc-c2, user confirmed), fenestration classification changes (fbc-c3, documents pending), and IBC 2024 §1105.1.1 accessibility provisions. Projects currently in design may straddle editions — determine permit submission target date for all active FL projects.",
      expectedDate: "December 31, 2026",
      priority: "high",
      actionRequired:
        "1. Audit all active FL project pipeline for edition applicability. 2. Begin 160 mph NOA re-testing immediately. 3. Book TAS 203 test slots now. 4. Obtain 9th Edition document and review fenestration chapter. 5. Update FL standard spec packages for IBC 2024 §1105.1.1 provisions.",
    },
    {
      id: "fbc-w2",
      title: "Obtain full FBC 9th Edition document — fenestration chapter review critical",
      description:
        "Full FBC 9th Edition document is pending. Fenestration classification changes for automatic door systems (fbc-c3) cannot be fully assessed until the document is obtained. Review fenestration chapter, §1709.5 HVHZ provisions, TAS 203 section references, and any Florida-specific amendments to IBC 2024 §1105.1.1 upon document availability.",
      expectedDate: "Available prior to Dec 31, 2026",
      priority: "high",
      actionRequired:
        "Obtain FBC 9th Edition document from floridabuilding.org. Immediate priority review: fenestration chapter, §1709.5, TAS 203 references, and HVHZ amendments.",
    },
    {
      id: "fbc-w3",
      title: "TAS 203 testing lab capacity — book immediately",
      description:
        "Florida-approved testing laboratories authorized to conduct TAS 203 water infiltration testing have limited capacity. Every automatic door manufacturer in the Florida market faces the same December 31, 2026 deadline. Testing labs will be backlogged by Q3 2026. Early booking is essential.",
      expectedDate: "Book now; testing Q2–Q3 2026",
      priority: "high",
      actionRequired:
        "Immediately contact Florida-approved TAS 203 testing laboratories to reserve test slots. Prioritize exterior automatic door configurations with highest Florida revenue volume.",
    },
    {
      id: "fbc-w4",
      title: "TAC public comment and Commission vote schedule through 2026",
      description:
        "FBC Technical Advisory Committees reviewed 1,500+ proposed I-Code changes and 556 public code modifications. Posted online December 22, 2025. Public comment periods and Commission votes ongoing through 2026. Monitor for any changes that affect fenestration, HVHZ, or automatic door provisions.",
      expectedDate: "Ongoing through 2026",
      priority: "medium",
      actionRequired:
        "Monitor FBC Commission meeting schedule. Submit public comments on door/fenestration provisions if warranted. Particularly monitor any changes to TAS 203 implementation guidance.",
    },
  ],
  timeline: [
    {
      date: "Dec 31, 2023",
      label: "FBC 8th Edition effective",
      type: "effective",
      editionRef: "8th Edition",
    },
    {
      date: "Feb 2024",
      label: "FBC 9th Ed. development begins — TAC review of 2024 I-Codes",
      type: "revision-start",
    },
    {
      date: "Dec 22, 2025",
      label: "9th Ed. draft posted online for public review",
      type: "comment-period",
    },
    {
      date: "2026 (ongoing)",
      label: "TAC public comment periods and Commission votes",
      type: "vote",
    },
    {
      date: "Dec 31, 2026",
      label: "FBC 9th Edition effective — all new FL permits must comply",
      type: "effective",
      editionRef: "9th Edition",
    },
  ],
  nextRevisionExpected: "~2029–2030 (10th Edition)",
};

// ─────────────────────────────────────────────────────────────────────────────
// REGULATORY PIPELINE — Cross-Standard Watch Items
// ─────────────────────────────────────────────────────────────────────────────

export const regulatoryPipeline: PipelineItem[] = [
  {
    id: "pipeline-1",
    title: "A156.10 Next Revision (est. 2027–2028): AI/Machine-Vision Sensor Integration",
    body: "The next A156.10 revision cycle is expected to address AI-based and machine-vision presence detection as the primary new topic. Current §8.x sensor requirements were written for infrared/microwave sensors and do not address camera-based systems that detect body poses, trajectories, and intent. A new section or annex is anticipated covering: machine-vision sensor zone definitions, privacy requirements for camera-based detection, fault monitoring protocols for AI inference systems (extending §8.3), and integration with access control and building management systems. Brands with R&D in machine-vision door sensors should engage the BHMA committee to influence standard language.",
    standard: "A156.10",
    expectedDate: "2027–2028",
    priority: "medium",
    affectedProducts: [
      "ASSA ABLOY Besam SL500 (next gen sensor)",
      "dormakaba ESA sensor module",
      "Stanley DURA-Glide 2000 sensor",
      "Horton Series 4000 sensor",
      "All sensor-integrated full-energy operators",
    ],
    actionRequired:
      "Engage BHMA A156.10 committee through membership. Contribute field performance data on sensor types. Begin internal R&D scoping for machine-vision sensor integration to position your standard language contributions before the draft phase.",
  },
  {
    id: "pipeline-2",
    title: "A156.38 FBC 10th Edition Adoption — System-Level Compliance Path for FL Sliding Doors",
    body: "FBC 10th Edition (expected ~2029–2030) is anticipated to cite A156.38-2019 as the compliance standard for automatic sliding door systems in Florida. When adopted, it creates a system-level certification requirement — operator + frame + glass + hardware tested together — for all automatic sliding doors installed under the Florida Building Code. This is a major market access gate for the Florida sliding door market. Brands that proactively pursue A156.38-2019 system certifications by 2027–2028 will be positioned to market 'FBC 10th Edition Ready' ahead of competitors.",
    standard: "A156.38 / FBC",
    expectedDate: "~2029–2030 (FBC 10th Edition)",
    priority: "high",
    affectedProducts: [
      "ASSA ABLOY Besam SL500 (FL exterior)",
      "dormakaba ESA 300/500 (FL exterior)",
      "Stanley DURA-Glide 2000 (FL exterior)",
      "Horton Series 4000 (FL exterior)",
    ],
    actionRequired:
      "Begin A156.38-2019 system certification testing by 2027 to be positioned before FBC 10th Edition adoption. Monitor FBC TAC for A156.38 citation language in draft 10th Edition. Develop certified system configuration matrix for FL market.",
  },
  {
    id: "pipeline-3",
    title: "DOJ ADA Technical Bulletin — Touchless/Wave-Sensor Knowing-Act Guidance",
    body: "The U.S. Department of Justice is expected to issue updated ADA technical guidance addressing touchless/wave-sensor activation as a valid 'knowing act' for accessible door applications. A156.19-2019 has already addressed this in the BHMA standard framework, but DOJ technical guidance would provide federal-level ADA endorsement — significantly strengthening the compliance position for touchless low-energy operators in federally regulated facilities (federal buildings, healthcare facilities with Medicaid/Medicare funding, transit facilities). If issued, expect rapid acceleration of touchless adoption in specification-driven markets.",
    standard: "ADA / DOJ",
    expectedDate: "2025–2026 (no confirmed date)",
    priority: "high",
    affectedProducts: [
      "ASSA ABLOY Besam SW60 + wave sensor",
      "dormakaba ED50 + touchless activation",
      "Stanley Magic-Access + wave sensor",
      "Horton ICU/Healthcare + touchless",
      "All A156.19 touchless configurations",
    ],
    actionRequired:
      "Monitor DOJ ADA rulemaking docket (regulations.gov). Prepare a product compliance brief that can be updated immediately when DOJ bulletin is released. Pre-draft 'ADA Compliant per A156.19-2019 and DOJ Technical Guidance' marketing language for touchless product lines.",
  },
  {
    id: "pipeline-4",
    title: "IECC 2024 Florida Adoption — Air Infiltration Tightening for Exterior Automatic Doors",
    body: "If Florida adopts IECC 2024 (International Energy Conservation Code 2024), air infiltration requirements for exterior building envelope — including automatic door systems — would tighten significantly compared to current IECC standards referenced in FBC. IECC 2024 imposes more stringent maximum air leakage rates for commercial building envelopes. For automatic doors, this creates pressure to reduce air infiltration through improved seal design, threshold engineering, and integration with vestibule systems. A156.38-2019's air infiltration compliance path would become the relevant test standard for automatic sliding doors under this scenario.",
    standard: "IECC 2024 / FBC",
    expectedDate: "TBD — Florida IECC adoption timeline not announced",
    priority: "medium",
    affectedProducts: [
      "ASSA ABLOY Besam GreenStar (primary)",
      "ASSA ABLOY Besam SL500 exterior",
      "dormakaba ESA 300/500 exterior",
      "Stanley DURA-Glide insulated exterior",
      "Horton Series 4000 HVHZ exterior",
      "All exterior automatic door products in FL",
    ],
    actionRequired:
      "Monitor Florida IECC adoption legislation and FBC commission activity. Proactively test exterior automatic door configurations under A156.38-2019 air infiltration protocol (addresses both IECC readiness and current TAS 203 water infiltration compliance pathway). GreenStar and insulated product lines should be prioritized for air infiltration testing.",
  },
  {
    id: "pipeline-5",
    title: "FGI 2022 Healthcare Facility Guidelines — Automatic Sliding Door Requirements for ICU",
    body: "The FGI 2022 Guidelines for Design and Construction of Hospitals are experiencing growing state adoption (currently cited by 42+ states). FGI 2022 includes specific automatic sliding door requirements for ICU and critical care environments: minimum 5 ft clear opening width for patient transport; infection-control compliant materials for door surfaces and hardware; touchless activation requirement in infectious isolation rooms; maximum door opening/closing speed limits consistent with BHMA A156.10 and A156.19; and airborne infection isolation (AII) room door coordination with HVAC pressurization systems. This is a growing compliance framework for healthcare automatic door specifications.",
    standard: "FGI 2022",
    expectedDate: "Ongoing — growing state adoption",
    priority: "medium",
    affectedProducts: [
      "dormakaba ESA healthcare (VersaMax, ProCare series)",
      "Horton ICU / Healthcare Series 4000",
      "ASSA ABLOY Besam healthcare configurations",
      "dormakaba ESA 300 ICU configuration",
      "All healthcare-configured automatic sliding doors",
    ],
    actionRequired:
      "Develop FGI 2022-compliant automatic door specification guide for healthcare sales team. Identify which current products meet FGI 2022 ICU requirements (clear width, materials, touchless, speed limits, AII integration). Update healthcare product line marketing to reference FGI 2022 compliance for high-growth healthcare vertical.",
  },
  {
    id: "pipeline-aaadm-legislation",
    title: "Watch \u2014 State/Local Mandatory AAADM Certification Legislation",
    body: "Multiple states and municipalities have considered or are considering legislation requiring AAADM certification for any work on automatic pedestrian doors, analogous to elevator and escalator technician licensing requirements. No federal mandate exists. Florida and California are the most likely first movers. If passed, companies without AAADM-certified service networks would be locked out of those markets for automatic door service work. ASSA ABLOY's national AAADM-certified technician coverage is a strategic hedge against this regulatory risk.",
    standard: "AAADM",
    expectedDate: "2026\u20132028",
    priority: "low",
    affectedProducts: [
      "All full-energy automatic door products (A156.10)",
      "All revolving door products (A156.27)",
      "All service-eligible installed base in FL and CA",
    ],
    actionRequired:
      "Monitor Florida and California legislative sessions for certification mandate bills. Engage AAADM advocacy. Ensure 100% AAADM-certified technician coverage in FL and CA service territories ahead of any mandate. If state-level mandates pass, companies without certified service networks will be locked out of those markets.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AAADM TRACK
// ─────────────────────────────────────────────────────────────────────────────

const aaadmCertification: Standard = {
  id: "aaadm",
  trackId: "aaadm",
  designation: "AAADM",
  fullName: "AAADM Certification & Inspection Program",
  scope:
    "The American Association of Automatic Door Manufacturers (AAADM) administers a technician certification program and an annual inspection protocol that governs service work on full-energy (A156.10) and revolving (A156.27) automatic pedestrian doors. AAADM certification is referenced in A156.10 \u00a7E4 and is required by many AHJs and insurance carriers for any electronic system adjustments on automatic doors.",
  governingBody: "American Association of Automatic Door Manufacturers (AAADM)",
  governingBodyUrl: "https://www.aaadm.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "Current",
    year: 2024,
    effectiveDate: "Ongoing",
    status: "stable",
  },
  pastEditions: [],
  recentChanges: [
    {
      id: "aaadm-cert-eligibility",
      section: "AAADM Certification Program",
      title: "AAADM Tech Certification \u2014 Eligibility & Scope",
      description:
        "Certification is open to anyone with 6+ months in the automatic door industry OR 90 days + factory training from an AAADM member company. Covers technicians working on A156.10 and A156.27 doors. Facility maintenance staff (retail, hospital, etc.) can AUDIT the course but CANNOT certify. Mandatory scope: ANY adjustment of electronic systems, sensors, speed/force settings, or controller programming on full-energy (A156.10) or revolving (A156.27) doors requires an AAADM-certified technician. NOT required for: glass replacement, cylinder rekeying, or mechanical hardware replacement.",
      changeType: "requirement",
      priority: "high",
      productImpact:
        "ALL full-energy sliding/swing/folding/revolving products from all brands require AAADM-certified service technicians for electronic work.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All Full-Energy Portfolio (A156.10 / A156.27)",
          impactLevel: "significant",
          impactDescription:
            "All electronic service work on full-energy sliding, swinging, folding, and revolving doors requires AAADM-certified technician. Largest certified service network in North America is a competitive moat.",
          actionRequired:
            "Ensure all service technicians maintain active AAADM certification. Document certifications in CRM for warranty and liability purposes.",
        },
        {
          brand: "dormakaba",
          model: "All Full-Energy Portfolio (A156.10 / A156.27)",
          impactLevel: "significant",
          impactDescription:
            "AAADM certification required for all electronic adjustments, sensor calibration, and controller programming on full-energy doors.",
          actionRequired:
            "Verify and maintain AAADM certification coverage across service technician workforce. Highlight certification in service contracts.",
        },
        {
          brand: "Stanley",
          model: "All Full-Energy Portfolio (A156.10)",
          impactLevel: "significant",
          impactDescription:
            "All electronic service work requires AAADM-certified technician. Service contracts should specify certification requirement.",
          actionRequired:
            "Audit technician certification status. Include AAADM cert requirement in all service agreements.",
        },
        {
          brand: "Horton",
          model: "All Full-Energy Portfolio (A156.10)",
          impactLevel: "significant",
          impactDescription:
            "All electronic adjustments and sensor/controller work requires AAADM-certified technician per certification program scope.",
          actionRequired:
            "Maintain AAADM certification for service staff. Use certification as differentiator in service network marketing.",
        },
      ],
      corporateImplications: [
        {
          type: "competitive_advantage",
          description:
            "ASSA ABLOY has the largest AAADM-certified service network in North America. This creates a durable moat: only certified technicians can touch controllers and sensors on the full-energy portfolio, directly tying recurring service revenue to an installed base that commodity competitors cannot easily service.",
          affectedBrands: ["ASSA ABLOY"],
          pmInsight:
            "AAADM certification is the service moat in automatic doors \u2014 it means only trained, annually-tested technicians can touch the controllers and sensors on the full-energy portfolio. From a PM perspective, this creates a recurring service revenue stream tied directly to the installed base, and it raises the barrier to entry for commodity competitors who don't have AAADM-trained service networks.",
        },
        {
          type: "compliance_cost",
          description:
            "Training and annual certification maintenance is an ongoing cost of the service business. All brands with full-energy automatic door service operations must budget for AAADM technician certification and renewal.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Certification maintenance is a real cost center, but it is also the price of admission to the full-energy service market. Brands that treat it as a cost-of-doing-business and invest proactively end up with the largest certified networks \u2014 which then become a revenue advantage.",
        },
      ],
      pmFraming:
        "AAADM certification is the service moat in automatic doors \u2014 it means only trained, annually-tested technicians can touch the controllers and sensors on our full-energy portfolio. From a PM perspective, this creates a recurring service revenue stream tied directly to our installed base, and it raises the barrier to entry for commodity competitors who don't have AAADM-trained service networks.",
      source: "AAADM Certification Program",
      sourceUrl: "https://www.aaadm.com",
    },
    {
      id: "aaadm-annual-inspection",
      section: "A156.10 \u00a7E4 Reference",
      title: "AAADM Annual Inspection \u2014 A156.10 \u00a7E4 Reference",
      description:
        "A156.10 \u00a7E4 strongly recommends (SHOULD, not SHALL \u2014 not mandatory) annual inspection by an AAADM-certified inspector. Some AHJs and insurance carriers treat this recommendation as effectively mandatory. High-traffic environments (hospitals, grocery stores) benefit from semi-annual inspections. A daily safety check by facility staff is recommended in addition to the annual certified inspection.",
      changeType: "requirement",
      priority: "medium",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All A156.10 and A156.27 Installed Products",
          impactLevel: "significant",
          impactDescription:
            "Annual inspection by AAADM-certified inspector is strongly recommended under A156.10 \u00a7E4. Many AHJs and insurers treat this as mandatory. Drives recurring service revenue for certified service organizations.",
          actionRequired:
            "Offer annual inspection as a service contract line item. Document inspection reports for liability protection. Target high-traffic sites (hospitals, grocery) for semi-annual upsells.",
        },
        {
          brand: "dormakaba",
          model: "All A156.10 and A156.27 Installed Products",
          impactLevel: "significant",
          impactDescription:
            "Annual AAADM inspection recommended by A156.10 \u00a7E4. AHJ and insurer enforcement creates consistent service demand.",
          actionRequired:
            "Include annual inspection in service agreement offerings. Build inspection cadence into CRM workflows.",
        },
        {
          brand: "Stanley",
          model: "All A156.10 Installed Products",
          impactLevel: "minor",
          impactDescription:
            "Annual inspection demand creates recurring service revenue opportunity. AHJ enforcement varies by jurisdiction.",
          actionRequired:
            "Promote annual inspection packages to existing installed base. Track AHJ requirements by market.",
        },
        {
          brand: "Horton",
          model: "All A156.10 Installed Products",
          impactLevel: "minor",
          impactDescription:
            "Annual AAADM inspection is a recurring revenue driver for service-capable distributors and service networks.",
          actionRequired:
            "Equip distributors with inspection program materials. Develop an inspection report template for certified technicians.",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "Annual inspection demand \u2014 driven by A156.10 \u00a7E4 SHOULD language increasingly treated as mandatory by AHJs and insurers \u2014 creates a structural recurring revenue stream for any organization with a large AAADM-certified service network. This benefits ASSA ABLOY disproportionately given its network scale.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "The 'should' language in A156.10 \u00a7E4 creates a market opportunity \u2014 as more AHJs and insurance carriers require documented annual inspections, demand for AAADM-certified service visits grows. This is a recurring revenue driver that favors manufacturers with large, certified service organizations.",
        },
        {
          type: "competitive_advantage",
          description:
            "ASSA ABLOY's national AAADM-certified technician coverage positions it to capture annual inspection revenue across the broadest installed base in the market. Competitors with smaller certified service networks cannot match this geographic coverage.",
          affectedBrands: ["ASSA ABLOY"],
          pmInsight:
            "Annual inspection demand disproportionately benefits service organizations with nationwide certified technician coverage. This is a structural advantage for ASSA ABLOY's service business that compounds as the installed base grows.",
        },
      ],
      pmFraming:
        "The 'should' language in A156.10 \u00a7E4 creates a market opportunity \u2014 as more AHJs and insurance carriers require documented annual inspections, demand for AAADM-certified service visits grows. This is a recurring revenue driver that favors manufacturers with large, certified service organizations.",
      source: "ANSI/BHMA A156.10-2024 \u00a7E4",
      sourceUrl: "https://www.buildershardware.com",
    },
    {
      id: "aaadm-scope-clarification",
      section: "AAADM Scope",
      title: "AAADM Scope: Electronic Adjustments vs. Mechanical Work",
      description:
        "Industry debate ongoing \u2014 AAADM position: ALL work on full-energy automatic doors requires a certified technician. Industry counter-position: mechanical-only work (glass, hardware, cylinders) does not require certification. Litigation history: in any injury claim, the last service record is subpoenaed \u2014 uncertified technicians who adjusted electronic systems face liability regardless of formal requirement status. Some jurisdictions have adopted AAADM certification as a de facto requirement for any service work.",
      changeType: "scope",
      priority: "medium",
      corporateImplications: [
        {
          type: "competitive_advantage",
          description:
            "Certified service organizations are insulated from the litigation risk that uncertified technicians create. As injury claims increasingly subpoena service records, customers preferentially choose manufacturers and service providers with documented AAADM-certified service histories.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "The litigation risk around uncertified technicians touching automatic door electronics is creating a de facto certification mandate \u2014 even where it's not legally required. For a PM, this means the service certification moat around A156.10 products is likely to strengthen over time as liability risk drives broader adoption of certified technicians.",
        },
        {
          type: "compliance_cost",
          description:
            "Ongoing certification maintenance \u2014 annual renewal, continuing education, and recordkeeping \u2014 is a cost center for any service organization, but the liability protection and competitive differentiation justify the investment.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley", "Horton"],
          pmInsight:
            "Certification maintenance costs are fixed; the liability exposure of NOT maintaining certification is unbounded. Any service organization that lets certification lapse is exposed in the discovery phase of any injury litigation.",
        },
      ],
      pmFraming:
        "The litigation risk around uncertified technicians touching automatic door electronics is creating a de facto certification mandate \u2014 even where it's not legally required. For a PM, this means the service certification moat around A156.10 products is likely to strengthen over time as liability risk drives broader adoption of certified technicians.",
      source: "AAADM Industry Position",
      sourceUrl: "https://www.aaadm.com",
    },
  ],
  watchList: [
    {
      id: "aaadm-watch-legislation",
      title: "Watch \u2014 State/Local Mandatory AAADM Certification Legislation",
      description:
        "Multiple states and municipalities have considered or are considering legislation requiring AAADM certification for any work on automatic pedestrian doors, analogous to elevator and escalator technician licensing requirements. No federal mandate exists. Florida and California are the most likely states to act first.",
      expectedDate: "2026\u20132028",
      priority: "medium",
      actionRequired:
        "Monitor Florida and California legislative sessions. Engage with AAADM advocacy efforts. Ensure service network achieves 100% certified coverage in FL and CA ahead of any mandate.",
    },
  ],
  timeline: [
    {
      date: "2024",
      label: "A156.10-2024 \u00a7E4 annual inspection language confirmed",
      type: "milestone",
    },
    {
      date: "2026",
      label: "FL/CA mandatory certification legislation watch period begins",
      type: "revision-start",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ADDITIONAL ANSI/BHMA STANDARDS
// ─────────────────────────────────────────────────────────────────────────────

// ─── ANSI/BHMA A156.27-2024 ──────────────────────────────────────────────────

const a15627_2024: Standard = {
  id: "a156.27-2024",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.27",
  fullName: "Power & Manual Operated Revolving Pedestrian Doors",
  scope:
    "Governs full-power and manually operated revolving pedestrian doors including UniTurn, Crystal series, and similar products. The 2024 edition tightens sensor field requirements for the rotating door leaf zone, updates ADA turn diameter minimums for powered revolving doors, establishes door speed limits, and codifies emergency breakout provisions. This standard is critical for any revolving door product in the ASSA ABLOY and Boon Edam portfolios.",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2024",
    year: 2024,
    effectiveDate: "2024",
    status: "stable",
  },
  pastEditions: [
    {
      version: "2019",
      year: 2019,
      effectiveDate: "2019",
      status: "stable",
    },
    {
      version: "2012",
      year: 2012,
      effectiveDate: "2012",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "a15627-c1",
      section: "§7 — Safety Sensor Requirements",
      title: "2024 update tightened sensor field requirements — retest may be needed for older installations",
      description:
        "A156.27-2024 §7 significantly revises the sensor detection zone geometry for power-operated revolving doors. The updated standard requires that presence sensors cover the full arc of travel for each rotating leaf panel, with no dead-zone tolerance in the leading-edge approach sector. This is a material change from the 2019 edition, which permitted a narrow unprotected zone near the pivot point. Any revolving door product certified under the 2019 edition must be re-evaluated to confirm sensor field coverage meets 2024 geometry specifications. For installed products in the field, particularly high-throughput entries certified prior to 2024, a sensor field validation protocol should be established before warranty renewals or service contract renewals reference A156.27-2024 compliance.",
      changeType: "requirement",
      priority: "high",
      previousValue: "2019 edition sensor field — narrow unprotected zone near pivot allowed",
      newValue: "2024 edition — full arc sensor coverage required, no dead-zone tolerance",
      productImpact:
        "All power revolving door products must be re-validated against new sensor field geometry. Older installations may require sensor upgrades or repositioning.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "RD700 Revolving Door",
          impactLevel: "critical",
          impactDescription:
            "RD700 series revolving doors are governed exclusively by A156.27-2024. Sensor field geometry must be validated against the updated 2024 §7 requirements. Any gaps in pivot-zone sensor coverage must be addressed before claiming 2024 compliance.",
          actionRequired:
            "Conduct sensor field validation test per A156.27-2024 §7. Update product certification documentation to reference 2024 edition. Publish compliance statement for spec-writers.",
          deadline: "Q2 2027 — before widespread IBC 2024 adoption in key states",
        },
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam UniTurn",
          impactLevel: "critical",
          impactDescription:
            "UniTurn sensor layout must be re-validated under A156.27-2024 §7 sensor field geometry. Products certified under 2019 edition may have sensor coverage gaps at pivot zone. Retest required before claiming 2024 compliance in project specifications.",
          actionRequired:
            "Conduct sensor field validation test per A156.27-2024 §7. If coverage gaps identified, update sensor positioning or firmware detection logic. Update product literature to reference 2024 edition.",
          deadline: "Q2 2027 — before widespread IBC 2024 adoption in key states",
        },
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam Crystal",
          impactLevel: "significant",
          impactDescription:
            "Crystal series full-energy revolving door. Sensor configuration should be validated against 2024 §7 requirements. High-traffic installations benefit from proactive revalidation.",
          actionRequired:
            "Schedule sensor field validation testing. Publish updated compliance documentation referencing A156.27-2024.",
          deadline: "Q3 2027",
        },
      ],
      corporateImplications: [
        {
          type: "competitive_advantage",
          description:
            "Brands that proactively retest and publish A156.27-2024 compliance will have a documented specification advantage as spec-writers and consultants update their revolving door boilerplates to reference the 2024 edition.",
          affectedBrands: ["ASSA ABLOY / Boon Edam", "Dorma Kaba", "Stanley"],
          pmInsight:
            "Completing A156.27-2024 sensor validation ahead of competitors creates a durable spec-writer trust advantage. This is a low-cost compliance win that directly supports the Boon Edam commercial positioning in high-traffic institutional entries.",
        },
      ],
      pmFraming:
        "A156.27-2024 tightened sensor zone requirements represent a near-term certification action item for all power revolving door products. For the Boon Edam portfolio, proactive validation and updated specification documentation creates a differentiation opportunity — especially as architects and consultants refresh their revolving door boilerplates to reflect the 2024 edition.",
    },
    {
      id: "a15627-c2",
      section: "§5.3 — ADA Turn Diameter & Door Speed Limits",
      title: "ADA minimum turn diameter 72\" for powered revolving doors; 12 RPM power / 20 RPM manual speed limits codified",
      description:
        "A156.27-2024 §5.3 codifies the minimum turn diameter for ADA-compliant power-operated revolving doors at 72 inches (6 feet) clear internal diameter. This reflects existing ADA guidance but formally integrates it into the BHMA standard, eliminating ambiguity in project specifications. The standard also establishes maximum door rotation speed limits: 12 RPM for power-operated revolving doors and 20 RPM for manually operated revolving doors. These speed limits are consistent with safe pedestrian throughput and are measurable test parameters for listing certification. Products exceeding these speed limits under worst-case loading conditions must be addressed through governor mechanisms or software speed-limiting routines.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "72\" ADA diameter guidance not formally in prior BHMA edition; no codified RPM limits",
      newValue: "72\" ADA minimum turn diameter (powered); 12 RPM max (power), 20 RPM max (manual) codified",
      productImpact:
        "Power revolving doors must verify ≥72\" clear diameter for ADA compliance documentation. Speed governors must limit rotation to ≤12 RPM under test conditions.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam UniTurn",
          impactLevel: "significant",
          impactDescription:
            "UniTurn diameter configuration must be confirmed at ≥72\" for ADA-compliant power-operated applications. Speed governor settings must be validated to stay within 12 RPM limit at maximum throughput.",
          actionRequired:
            "Confirm 72\" clear diameter in product specifications. Validate speed governor settings under A156.27-2024 test protocol.",
        },
      ],
      pmFraming:
        "Codifying the 72\" ADA turn diameter removes a common specification ambiguity that caused change orders in the field. This is a positive clarification for ASSA ABLOY — the UniTurn and Crystal lines already meet this threshold, so the change is a compliance confirmation rather than a redesign requirement.",
    },
  ],
  watchList: [
    {
      id: "a15627-watch-emergency-breakout",
      title: "Watch — Emergency Breakout Force Provisions Across State Adoptions",
      description:
        "A156.27-2024 updated emergency breakout force requirements. As states adopt IBC 2024 (which references updated BHMA standards), verify all power revolving door installations include compliant breakout panels tested to the new force limits. Some legacy installations certified under 2019 may not meet 2024 breakout provisions.",
      priority: "medium",
      actionRequired:
        "Audit emergency breakout panel specifications in UniTurn and Crystal product lines against A156.27-2024 breakout provisions. Update installation documentation.",
    },
  ],
  timeline: [
    {
      date: "2024",
      label: "A156.27-2024 published — tightened sensor field, speed limits, 72\" ADA diameter",
      type: "release",
    },
    {
      date: "2019",
      label: "A156.27-2019 — prior edition now superseded",
      type: "release",
    },
  ],
  nextRevisionExpected: "2028–2029",
};

// ─── ANSI/BHMA A156.38 — Low-Energy Power Operated Sliding Doors ─────────────
// Note: The existing a15638 covers the 2023 system-level standard.
// A156.38 also has a distinct "Knowing Act" low-energy provision distinct from A156.10.
// We create a supplementary entry documenting the "Knowing Act" provisions.

const a156LowEnergyKnowingAct: Standard = {
  id: "a156.38-le",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.38 (Low-Energy)",
  fullName: "Low-Energy Power Operated Sliding Doors — Knowing Act Activation",
  scope:
    "Covers the 'knowing act' (low-energy) activation category of automatic sliding doors — a distinct and separately regulated subset from full-power automatic doors (A156.10). Knowing-act activation means the door only opens in response to a deliberate human act: push-and-go from the push rail, wave-sensor wave, or access control trigger. The standard establishes different (lower) activation force limits, opening time requirements, and sensor specifications compared to full-power auto doors. The SW60 slim swing and certain low-energy configurations of other operators fall under this standard rather than A156.10.",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "active",
    year: 2023,
    effectiveDate: "Current",
    status: "stable",
  },
  pastEditions: [],
  recentChanges: [
    {
      id: "a15638le-c1",
      section: "§4 — Knowing Act vs. Automatic Distinction",
      title: "Low-energy 'knowing act' activation is distinct from full-power automatic — different force and timing limits",
      description:
        "A fundamental point of specification confusion is the difference between A156.10 full-power automatic doors and A156.38 low-energy knowing-act doors. Full-power doors (A156.10) operate automatically based on presence detection alone — no human act required. Low-energy knowing-act doors (A156.38) require a deliberate triggering action. This distinction has direct implications for accessibility compliance: knowing-act doors satisfy ADA requirements for 'power-operated doors' but require the occupant to initiate the activation, whereas full-power auto doors require no initiation act. Force limits, opening time, and sensor specifications differ meaningfully: knowing-act activation force limits are slightly higher, opening times are longer, and the sensor suite differs substantially from full-power presence-sensor arrays. Products positioned as ADA-compliant low-energy operators must clearly reference A156.38, not A156.10, in specification documentation.",
      changeType: "terminology",
      priority: "medium",
      productImpact:
        "Specification documentation for low-energy operators must clearly reference A156.38 (not A156.10) to avoid AHJ rejection. Sales and specification teams must understand and communicate the knowing-act vs. automatic distinction.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "SW60 Slim Swing",
          impactLevel: "significant",
          impactDescription:
            "SW60 is a low-energy power-operated swing door operator. Spec sheets and project documentation must reference A156.38 knowing-act provisions, not A156.10. Misclassification can result in AHJ rejection of the specification or post-installation compliance issues.",
          actionRequired:
            "Verify SW60 product literature explicitly references A156.38. Train sales team on knowing-act vs. full-power distinction. Update DoorSpec tool to correctly categorize low-energy products.",
        },
      ],
      pmFraming:
        "The knowing-act vs. automatic distinction in A156.38 is a recurring specification error in the field. For the SW60 and similar low-energy products, proactively ensuring all project documentation correctly references A156.38 prevents costly AHJ corrections and demonstrates specification expertise to consultants and architects.",
    },
  ],
  watchList: [
    {
      id: "a15638le-watch-ada",
      title: "Watch — DOJ ADA Technical Bulletin on Knowing-Act Activation",
      description:
        "An anticipated DOJ ADA technical bulletin may clarify whether push-and-go, wave sensor, and similar knowing-act mechanisms fully satisfy ADA 'operable parts' and 'accessible route' requirements. If the bulletin requires full-power automatic activation for primary accessible entrances, it could significantly narrow the market for low-energy knowing-act products in ADA-governed facilities.",
      priority: "high",
      actionRequired:
        "Monitor DOJ ADA rulemaking. Prepare product positioning documents for both outcomes. Ensure SW60 and low-energy product line ADA compliance documentation is current.",
    },
  ],
  timeline: [
    {
      date: "Current",
      label: "A156.38 low-energy knowing-act provisions — active standard",
      type: "milestone",
    },
  ],
};

// ─── ANSI/BHMA A156.3-2025 — Exit Devices ────────────────────────────────────

const a1563_2025: Standard = {
  id: "a156.3-2025",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.3",
  fullName: "Exit Devices — 2025 Edition",
  scope:
    "Covers panic hardware (exit devices) used in egress paths. The 2025 edition is significant for automatic door integrators because IBC 2024 now references A156.3-2025 for access-controlled egress doors in egress paths. Key updates align delayed egress latch timing with NFPA 101-2024, address fail-safe provisions at power-off conditions, and clarify mag-lock release coordination for auto door + exit device combinations.",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2025",
    year: 2025,
    effectiveDate: "2025",
    status: "stable",
  },
  pastEditions: [
    {
      version: "2020",
      year: 2020,
      effectiveDate: "2020",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "a1563-c1",
      section: "§10 — Auto Door Integration with Exit Devices in Egress Paths",
      title: "2025 update directly affects auto door + exit device combos; IBC 2024 now references this edition for access-controlled egress",
      description:
        "A156.3-2025 adds substantive requirements for how automatic doors integrate with exit devices in egress paths. The critical change is the power-off condition: the force required to operate an exit device on an auto door when power is lost must not exceed the limits specified in §10. This applies to mag-lock + auto door combinations in egress paths — if the mag-lock fails to release on power loss, and the exit device force exceeds the standard limit, the installation is non-compliant. The 2025 edition also aligns delayed egress latch timing with NFPA 101-2024 (15 second standard delay, 30 second AHJ-approved delay), ensuring that auto door + delayed egress configurations comply with both standards simultaneously. IBC 2024 Chapter 10 explicitly cites A156.3-2025 for access-controlled egress door requirements, making this a mandatory reference for any ASSA ABLOY product installed in an IBC 2024 jurisdiction egress path with access control.",
      changeType: "requirement",
      priority: "high",
      previousValue: "Prior edition — delayed egress timing and power-off force requirements loosely specified",
      newValue: "2025 — power-off exit device force limits codified; delayed egress timing aligned with NFPA 101-2024; IBC 2024 Chapter 10 cross-reference",
      productImpact:
        "All ASSA ABLOY auto door + exit device combinations in egress paths must be validated for power-off force limits per A156.3-2025. Delayed egress configurations must align with both NFPA 101-2024 and A156.3-2025 timing requirements.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "VersaMax (egress path configurations)",
          impactLevel: "critical",
          impactDescription:
            "VersaMax installed in egress paths with mag-lock access control must be validated for power-off exit device force compliance under A156.3-2025 §10. Fail-safe behavior must release the mag-lock and permit exit device operation within the prescribed force limits at power loss.",
          actionRequired:
            "Conduct power-off force testing on representative VersaMax + mag-lock + exit device configurations. Document fail-safe release sequencing. Update installation guide with A156.3-2025 compliance notes.",
          deadline: "Q4 2026 — ahead of IBC 2024 adoption wave",
        },
        {
          brand: "ASSA ABLOY",
          model: "SL500 (egress path configurations)",
          impactLevel: "significant",
          impactDescription:
            "SL500 sliding door configurations in egress paths with integrated mag-lock must meet A156.3-2025 power-off exit device provisions. Delayed egress SL500 configurations must align timing with NFPA 101-2024.",
          actionRequired:
            "Review SL500 egress-path installation specs against A156.3-2025 §10. Update technical specification documentation.",
          deadline: "Q4 2026",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Power-off force testing and documentation for auto door + exit device combinations in egress paths is a material compliance cost. However, this creates a moat for brands with fully tested and documented egress combinations — reducing AHJ approval friction significantly.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Stanley"],
          pmInsight:
            "Documenting A156.3-2025 compliance for ASSA ABLOY auto door + exit device combinations in egress paths is both a compliance requirement and a competitive differentiator. Spec-writers and AHJs increasingly require this documentation, and brands that provide it pre-packaged will win specifications over competitors who leave the compliance burden to the installer.",
        },
      ],
      pmFraming:
        "A156.3-2025's integration with IBC 2024 for access-controlled egress is a critical compliance convergence point. For every ASSA ABLOY project where an auto door is in an egress path with mag-lock access control, the product team needs to confirm the fail-safe sequence meets A156.3-2025 + NFPA 101-2024 jointly. This is a PM-level coordination requirement between the auto door, hardware, and access control product lines.",
    },
  ],
  watchList: [
    {
      id: "a1563-watch-ibc2024-adoption",
      title: "Watch — State-by-State IBC 2024 Adoption Triggering A156.3-2025 Reference",
      description:
        "As states adopt IBC 2024, A156.3-2025 becomes a mandatory reference standard for access-controlled egress doors. Monitor adoption tracker — some states are on IBC 2021 or older, which may not require A156.3-2025. Compliance documentation should be edition-specific.",
      priority: "high",
      actionRequired:
        "Maintain a state adoption matrix for IBC 2024. Tag project specifications with the appropriate exit device standard edition based on the jurisdiction's adopted code cycle.",
    },
  ],
  timeline: [
    {
      date: "2025",
      label: "A156.3-2025 published — IBC 2024 Chapter 10 cross-reference",
      type: "release",
    },
    {
      date: "2020",
      label: "A156.3-2020 — prior edition",
      type: "release",
    },
  ],
  nextRevisionExpected: "2030",
};

// ─── ANSI/BHMA A156.21-2025 — Thresholds ─────────────────────────────────────

const a15621_2025: Standard = {
  id: "a156.21-2025",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.21",
  fullName: "Thresholds — 2025 Edition",
  scope:
    "Covers threshold hardware used at door openings, including automatic door installations. The 2025 edition directly impacts automatic door installation specifications: ADA maximum threshold height is ½ inch at powered openings, beveled if greater than ¼ inch. This is a measurable compliance point for all ASSA ABLOY automatic door product installations.",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2025",
    year: 2025,
    effectiveDate: "2025",
    status: "stable",
  },
  pastEditions: [
    {
      version: "2019",
      year: 2019,
      effectiveDate: "2019",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "a15621-c1",
      section: "§6 — ADA Threshold Height at Auto Door Openings",
      title: "½\" max threshold height at auto door openings; beveled if > ¼\"",
      description:
        "A156.21-2025 §6 codifies ADA threshold height limits at automatic door openings: maximum ½ inch total height, with a bevel requirement (maximum 1:2 slope) for any portion of the threshold above ¼ inch. This is a direct installation specification impact for all ASSA ABLOY automatic door products. Thresholds that exceed ½ inch create a non-compliant accessible route under ADA and ICC A117.1, and will be flagged during AHJ inspections in IBC 2024 jurisdictions. Installers and project managers must verify threshold specification meets A156.21-2025 as part of project closeout documentation.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "Prior editions — threshold height limits referenced ADA but less specifically codified in BHMA standard",
      newValue: "2025 — ½\" max threshold height, beveled ≥ ¼\", explicitly codified per ADA requirements",
      productImpact:
        "All automatic door installations must include A156.21-2025 compliant thresholds. Threshold specification must appear in project submittals. Non-compliant thresholds create ADA liability for building owner.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All automatic door product lines",
          impactLevel: "minor",
          impactDescription:
            "Threshold specification at all ASSA ABLOY automatic door installations must reference A156.21-2025 compliance. Update installation guide to include threshold compliance check as part of commissioning protocol.",
          actionRequired:
            "Add threshold compliance check (A156.21-2025 ½\" max, bevel ≥ ¼\") to commissioning checklist for all automatic door installations. Reference A156.21-2025 in submittal template.",
        },
      ],
      pmFraming:
        "The threshold requirement is a low-visibility but high-liability compliance point. A non-compliant threshold at an automatic door is an ADA violation regardless of how well the door operator performs. Including A156.21-2025 threshold compliance in the standard commissioning checklist is a low-cost way to protect the customer and reduce post-installation liability.",
    },
  ],
  watchList: [],
  timeline: [
    {
      date: "2025",
      label: "A156.21-2025 published",
      type: "release",
    },
  ],
  nextRevisionExpected: "2030",
};

// ─── ANSI/BHMA A156.14-2024 — Sliding & Folding Door Hardware ─────────────────

const a15614_2024: Standard = {
  id: "a156.14-2024",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.14",
  fullName: "Sliding & Folding Door Hardware — 2024 Edition",
  scope:
    "Hardware specification requirements for sliding and folding door systems — tracks, rollers, trolleys, lock hardware integration, and force limits for sliding operation. The 2024 update directly affects hardware specification for all ASSA ABLOY sliding door products including the SL500 and SW series.",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2024",
    year: 2024,
    effectiveDate: "2024",
    status: "stable",
  },
  pastEditions: [
    {
      version: "2017",
      year: 2017,
      effectiveDate: "2017",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "a15614-c1",
      section: "§8 — Track Loading & Roller/Trolley Requirements",
      title: "Updated 2024 track loading, roller/trolley requirements, and force limits for sliding operation",
      description:
        "A156.14-2024 updates track loading specifications and roller/trolley performance requirements for sliding door hardware systems. Key changes include revised static and dynamic load ratings for top-hung and bottom-rolling configurations, updated force limits for manual sliding operation (relevant for low-energy and manual bi-parting configurations), and new lock hardware integration requirements that ensure integrated locking hardware does not compromise structural track performance under rated loads. For automatic sliding doors, the lock hardware integration provisions are particularly relevant — integrated electric strikes and mag-locks must be spec'd to not reduce the track assembly's rated load capacity.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "2017 edition — track loading and lock integration requirements",
      newValue: "2024 — updated load ratings, revised force limits, new lock hardware integration provisions",
      productImpact:
        "SL500 and sliding door hardware specifications must reference A156.14-2024. Lock hardware integration specs must confirm no track load capacity reduction.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500",
          impactLevel: "significant",
          impactDescription:
            "SL500 track and hardware configuration must be validated against A156.14-2024 updated load ratings and lock integration provisions. Integrated mag-lock configurations must be confirmed to maintain full track load capacity.",
          actionRequired:
            "Review SL500 hardware specification against A156.14-2024 §8. Confirm integrated lock hardware does not reduce track load rating. Update product specification sheets to reference 2024 edition.",
          deadline: "Q3 2026",
        },
      ],
      pmFraming:
        "A156.14-2024 hardware specifications are the foundation for any sliding door project specification. Ensuring ASSA ABLOY sliding door specifications reference the 2024 edition maintains compliance and positions the product favorably in AHJ reviews. The lock integration provisions are a direct selling point for integrated access control configurations.",
    },
  ],
  watchList: [],
  timeline: [
    {
      date: "2024",
      label: "A156.14-2024 published — updated track loading, lock integration",
      type: "release",
    },
  ],
  nextRevisionExpected: "2029",
};

// ─── ANSI/BHMA A156.16-2023 — Auxiliary Hardware ─────────────────────────────

const a15616_2023: Standard = {
  id: "a156.16-2023",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.16",
  fullName: "Auxiliary Hardware — Overhead Stops, Holders, Closers — 2023 Edition",
  scope:
    "Covers overhead stops, holders, and door closers used adjacent to automatic door operators. Affects swing door installations with LCN or similar closer brands. The 2023 update addresses performance specifications for auxiliary hardware when used in combination with automatic swing operators — including force limits and coordination requirements.",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2023",
    year: 2023,
    effectiveDate: "2023",
    status: "stable",
  },
  pastEditions: [
    {
      version: "2017",
      year: 2017,
      effectiveDate: "2017",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "a15616-c1",
      section: "§5 — Overhead Stop/Holder Adjacent to Auto Operators",
      title: "2023 update addresses auxiliary hardware coordination with automatic swing operators",
      description:
        "A156.16-2023 clarifies performance requirements for overhead stops and holders when installed alongside automatic swing door operators. This is relevant for installations where an LCN or similar overhead closer is mounted alongside an automatic swing operator (such as the SW200i or SW60) — the combined force interaction between the automatic operator and the overhead hardware must remain within force limits specified by both A156.16-2023 and the applicable A156.10 or A156.38 operator standard. Overhead holders used in hold-open configurations must release cleanly to permit automatic close-and-reopen cycles without exceeding operator motor current limits.",
      changeType: "requirement",
      priority: "low",
      productImpact:
        "Swing door installations using LCN or similar overhead hardware with ASSA ABLOY automatic operators must be validated for combined force compliance.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "SW200i + LCN Overhead",
          impactLevel: "minor",
          impactDescription:
            "Combined force of SW200i operator and LCN overhead hardware must be within A156.10-2024 limits. Overhead holder release must be coordinated with automatic operator cycle.",
          actionRequired:
            "Review SW200i installation guide for overhead hardware compatibility notes. Add A156.16-2023 compliance note to combined-hardware installation specifications.",
        },
      ],
      pmFraming:
        "A156.16-2023 is a low-priority but field-relevant standard for swing door combination installations. The main action item is ensuring installation guides cover combined-force compliance when overhead hardware is specified alongside ASSA ABLOY automatic swing operators.",
    },
  ],
  watchList: [],
  timeline: [
    {
      date: "2023",
      label: "A156.16-2023 published",
      type: "release",
    },
  ],
  nextRevisionExpected: "2028",
};

// ─── ANSI/BHMA A156.11-2024 — Cabinet Locks ──────────────────────────────────

const a15611_2024: Standard = {
  id: "a156.11-2024",
  trackId: "bhma",
  designation: "ANSI/BHMA A156.11",
  fullName: "Cabinet Locks — 2024 Edition (Access Control Adjacent)",
  scope:
    "Covers cabinet lock hardware. Adjacent to access control integration specifications for automatic door systems. The 2024 update is primarily relevant to the access control integration side of ASSA ABLOY's portfolio where cabinet lock hardware intersects with broader access control specifications.",
  governingBody: "Builders Hardware Manufacturers Association (BHMA)",
  governingBodyUrl: "https://www.buildershardware.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2024",
    year: 2024,
    effectiveDate: "2024",
    status: "stable",
  },
  pastEditions: [
    {
      version: "2020",
      year: 2020,
      effectiveDate: "2020",
      status: "stable",
    },
  ],
  recentChanges: [
    {
      id: "a15611-c1",
      section: "Access Control Integration — Cabinet Locks",
      title: "A156.11-2024 update — adjacent to access control integration specifications",
      description:
        "A156.11-2024 is a maintenance update to cabinet lock hardware standards. While primarily relevant to cabinet hardware, it intersects with access control integration specifications where cabinet-style locks are used as locking devices in ADA-compliant credential readers and access control panels adjacent to automatic door systems. For ASSA ABLOY, awareness of this standard is relevant to the access control product lines rather than the automatic door operators directly.",
      changeType: "scope",
      priority: "low",
      productImpact:
        "Low-medium relevance. Monitor for any access control integration implications.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Access Control Integration Hardware",
          impactLevel: "informational",
          impactDescription:
            "A156.11-2024 may affect cabinet lock hardware used in access control panels adjacent to automatic door systems. Review for any integration specification implications.",
          actionRequired:
            "Monitor for any AHJ or spec-writer references to A156.11-2024 in access control + auto door project specifications.",
        },
      ],
      pmFraming:
        "A156.11-2024 is low-priority for the automatic door product management function but should be on the access control product team's radar. Note in the standards tracker for completeness.",
    },
  ],
  watchList: [],
  timeline: [
    {
      date: "2024",
      label: "A156.11-2024 published",
      type: "release",
    },
  ],
  nextRevisionExpected: "2029",
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILDING & ENERGY CODES
// ─────────────────────────────────────────────────────────────────────────────

// ─── IBC 2024 Chapter 10 Egress Updates ──────────────────────────────────────

const ibc2024Ch10Egress: Standard = {
  id: "ibc2024-ch10",
  trackId: "icc",
  designation: "IBC 2024 — Chapter 10",
  fullName: "International Building Code 2024 — Chapter 10 Egress Updates",
  scope:
    "IBC 2024 Chapter 10 is the primary egress code for commercial buildings. The 2024 edition includes significant updates affecting automatic door installations in egress paths: new elevator lobby locking language aligned with NFPA 101, clarified access-control free-egress requirements, new Emergency Action Plan requirements, maneuvering clearance revisions for power-operated doors, and vestibule equivalency for powered revolving doors per ASHRAE 90.1 cross-reference. Not yet universally adopted — check state adoption tracker.",
  governingBody: "International Code Council (ICC)",
  governingBodyUrl: "https://www.iccsafe.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2024",
    year: 2024,
    effectiveDate: "2024",
    status: "pending-adoption",
    adoptedBy: ["Select jurisdictions — state-by-state adoption in progress"],
  },
  pastEditions: [
    { version: "2021", year: 2021, effectiveDate: "2021", status: "stable" },
    { version: "2018", year: 2018, effectiveDate: "2018", status: "stable" },
  ],
  recentChanges: [
    {
      id: "ibc2024ch10-c1",
      section: "§1010.1.9.7 — Access-Controlled Egress Doors",
      title: "Clarified access-control free-egress: doors in egress paths must have sensor-release mags or delayed-egress, not hard-lock",
      description:
        "IBC 2024 §1010.1.9.7 clarifies that doors in required egress paths with access control must provide free egress without special knowledge or effort. Hard-lock configurations (where the door is electronically locked with no automatic release mechanism) are not permitted in egress paths. Compliant configurations include: (1) sensor-release mag-locks that release upon motion detection in the egress direction, (2) delayed-egress hardware per NFPA 101-2024 provisions (15-second delay standard), or (3) fail-safe locking with fire alarm and manual release. This directly affects every VersaMax and SL500 installation where access control is integrated into an egress path — the fail-safe + sensor-release documentation must be part of project submittals.",
      changeType: "requirement",
      priority: "high",
      previousValue: "IBC 2021 — access-control egress language less specific on sensor-release vs. hard-lock distinction",
      newValue: "IBC 2024 — hard-lock in egress paths prohibited; sensor-release mag or delayed-egress required for compliant access-controlled egress",
      productImpact:
        "VersaMax and SL500 installations in egress paths with access control must document sensor-release or delayed-egress compliance. Submittal packages must include fail-safe documentation.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "VersaMax (access-controlled egress)",
          impactLevel: "critical",
          impactDescription:
            "VersaMax in IBC 2024 jurisdictions must be configured with sensor-release mag-lock or delayed-egress for all egress path installations with access control. Hard-lock configuration is non-compliant. Submittal package must include fail-safe sequence documentation.",
          actionRequired:
            "Update VersaMax installation guide to specify sensor-release + fail-safe requirements for egress path configurations. Update submittal template with IBC 2024 §1010.1.9.7 compliance documentation.",
          deadline: "Q4 2026 — prior to peak IBC 2024 adoption",
        },
        {
          brand: "ASSA ABLOY",
          model: "SL500 (access-controlled egress)",
          impactLevel: "significant",
          impactDescription:
            "SL500 with integrated access control in egress paths must follow IBC 2024 §1010.1.9.7 sensor-release provisions. Update project specification documentation.",
          actionRequired:
            "Review SL500 egress-path configuration guide against IBC 2024 §1010.1.9.7. Confirm sensor-release is standard configuration for egress-path applications.",
          deadline: "Q4 2026",
        },
      ],
      corporateImplications: [
        {
          type: "compliance_cost",
          description:
            "Updating submittal packages and installation documentation for IBC 2024 §1010.1.9.7 compliance is a moderate compliance cost. However, the clear sensor-release requirement eliminates field ambiguity and reduces post-installation compliance disputes — a net positive for project closeout.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Allegion"],
          pmInsight:
            "This is a documentation-driven compliance requirement more than a product redesign requirement. ASSA ABLOY's VersaMax already supports sensor-release configurations; the action item is ensuring the documentation package explicitly certifies IBC 2024 §1010.1.9.7 compliance to reduce AHJ friction.",
        },
      ],
      pmFraming:
        "IBC 2024 §1010.1.9.7 formalizes what best-practice installers have been doing — but it creates a hard compliance gate for projects in IBC 2024 jurisdictions. For ASSA ABLOY, the product capability is there; the gap is documentation. Proactively updating the VersaMax and SL500 submittal templates to explicitly certify §1010.1.9.7 compliance is the highest-ROI near-term action.",
    },
    {
      id: "ibc2024ch10-c2",
      section: "§1005.7 — Maneuvering Clearance at Power-Operated Doors",
      title: "Power-operated doors: 12\" latch-side pull, 0\" latch-side push — reduced clearance vs. manual doors",
      description:
        "IBC 2024 §1005.7, aligned with ICC A117.1, establishes that power-operated automatic doors require only 12 inches of latch-side maneuvering clearance on the pull side and 0 inches on the push side — significantly less than the 18 inches required for manual doors. This is a direct specification advantage for automatic door products in constrained spaces: corridors, elevator lobbies, and renovated entries where 18-inch manual door clearances are unachievable. Specifying an automatic door instead of a manual door can resolve an ADA maneuvering clearance non-compliance in tight spaces. This is a strong talking point for sales teams working on accessibility-driven renovation projects.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "IBC 2021 — power door clearance reduction less prominently specified",
      newValue: "IBC 2024 §1005.7 — 12\" latch-side pull, 0\" latch-side push for automatic doors (vs. 18\" for manual)",
      productImpact:
        "Major specification selling point: auto doors solve ADA maneuvering clearance constraints that prevent manual door ADA compliance in tight spaces.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All automatic door products",
          impactLevel: "significant",
          impactDescription:
            "The 0\" latch-side push clearance for automatic doors is a powerful sales tool for renovation projects with ADA compliance constraints. Arm sales and specification teams with this data point for all tight-clearance entry projects.",
          actionRequired:
            "Add IBC 2024 §1005.7 maneuvering clearance advantage to sales materials and specification guides. Highlight in DoorSpec tool for accessibility-constrained projects.",
        },
      ],
      pmFraming:
        "The reduced maneuvering clearance requirement for auto doors versus manual doors (0\" vs. 18\" latch-side push) is an underutilized specification advantage. In renovation and healthcare projects where accessible entries are constrained, specifying a VersaMax or SW200i resolves ADA clearance requirements that a manual door cannot meet. This is a direct ROI argument for the upgrade to automatic.",
    },
    {
      id: "ibc2024ch10-c3",
      section: "§1010.1.4.2 / §1011 — Vestibule Equivalency for Powered Revolving Doors",
      title: "Powered revolving doors now count as vestibule equivalent per ASHRAE 90.1-2022 cross-reference",
      description:
        "IBC 2024 adds a cross-reference to ASHRAE 90.1-2022, which explicitly recognizes powered revolving doors as a vestibule equivalent for energy code compliance purposes. Buildings that are required to provide vestibules (typically > 1 story or > 10,000 SF in Climate Zones 3-8) can satisfy that requirement with a powered revolving door — eliminating the construction cost and space penalty of a traditional swing door vestibule. This is a major commercial positioning advantage for ASSA ABLOY's Boon Edam revolving door products.",
      changeType: "scope",
      priority: "high",
      productImpact:
        "Powered revolving doors (Boon Edam portfolio) can replace vestibules in code-mandated energy provisions. Major specification advantage for new construction in Climate Zones 3-8.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam UniTurn / Crystal / Tourniket",
          impactLevel: "critical",
          impactDescription:
            "Powered revolving doors satisfy vestibule requirements under IBC 2024 / ASHRAE 90.1-2022. This is a significant commercial advantage — a powered revolving door replaces 60-80 SF of vestibule, saving construction cost and lease value while meeting energy code.",
          actionRequired:
            "Develop ROI calculator showing vestibule elimination savings vs. revolving door cost. Update specification guide to cite IBC 2024 + ASHRAE 90.1-2022 vestibule equivalency. Train sales team on vestibule-replacement selling motion.",
        },
      ],
      corporateImplications: [
        {
          type: "competitive_advantage",
          description:
            "Vestibule equivalency for powered revolving doors creates a compelling new sales motion — sell revolving doors as a vestibule replacement that saves construction cost, saves space, and meets energy code. Competitors without revolving door product lines cannot make this argument.",
          affectedBrands: ["ASSA ABLOY / Boon Edam"],
          pmInsight:
            "The vestibule-replacement selling motion enabled by IBC 2024 / ASHRAE 90.1-2022 vestibule equivalency is a durable competitive advantage for the Boon Edam revolving door portfolio. No swing door competitor can match this — the code advantage is product-specific. This should be the #1 specification positioning update for the Boon Edam sales team in IBC 2024 jurisdictions.",
        },
      ],
      pmFraming:
        "IBC 2024's vestibule equivalency for powered revolving doors (via ASHRAE 90.1-2022 cross-reference) creates a new, code-backed selling motion. Instead of positioning the revolving door as a premium, position it as the energy code compliance solution that also eliminates vestibule construction cost. This reframes the purchase from 'expensive upgrade' to 'code-compliant cost savings' — a fundamentally different buyer conversation.",
    },
  ],
  watchList: [
    {
      id: "ibc2024ch10-watch-adoption",
      title: "Watch — State-by-State IBC 2024 Adoption Progress",
      description:
        "IBC 2024 is not yet universally adopted. As of 2026, many states remain on IBC 2021 or IBC 2018. The access-controlled egress and vestibule equivalency provisions only apply in IBC 2024 jurisdictions. Monitor the ICC adoption tracker to identify which states have adopted IBC 2024 for permitting purposes.",
      priority: "high",
      actionRequired:
        "Maintain state IBC adoption matrix. Tag project specifications with the applicable IBC edition for the project jurisdiction. Prioritize documentation updates for states that have adopted IBC 2024.",
    },
  ],
  timeline: [
    {
      date: "2024",
      label: "IBC 2024 published — Chapter 10 egress updates, vestibule equivalency, access-control clarifications",
      type: "release",
    },
    {
      date: "2025–2027",
      label: "Ongoing state adoption of IBC 2024 — watch for jurisdiction-specific effective dates",
      type: "milestone",
    },
  ],
  nextRevisionExpected: "2027",
};

// ─── NFPA 101-2024 Life Safety Code ───────────────────────────────────────────

const nfpa101_2024: Standard = {
  id: "nfpa101-2024",
  trackId: "lifesafety",
  designation: "NFPA 101-2024",
  fullName: "Life Safety Code — 2024 Edition",
  scope:
    "NFPA 101 is the Life Safety Code — the primary reference for means of egress, fire protection, and special locking arrangements in buildings. Critical for healthcare automatic door applications. The 2024 edition updates delayed egress provisions, adds controlled-egress provisions for memory care/behavioral health, and clarifies sensor-release mag-lock requirements for automatic doors in fire-rated openings.",
  governingBody: "National Fire Protection Association (NFPA)",
  governingBodyUrl: "https://www.nfpa.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2024",
    year: 2024,
    effectiveDate: "2024",
    status: "pending-adoption",
    adoptedBy: ["Healthcare facilities under CMS — broad adoption expected 2025–2027"],
  },
  pastEditions: [
    { version: "2021", year: 2021, effectiveDate: "2021", status: "stable" },
    { version: "2018", year: 2018, effectiveDate: "2018", status: "stable" },
  ],
  recentChanges: [
    {
      id: "nfpa101-c1",
      section: "§13.2.6 / §22.2.6 — Controlled-Egress for Healthcare",
      title: "Memory care / behavioral health controlled-egress: must auto-release on fire alarm, sprinkler, or power failure",
      description:
        "NFPA 101-2024 §13.2.6 (new occupancies) and §22.2.6 (existing occupancies) now explicitly address controlled-egress doors in memory care, behavioral health, and pediatric facilities where residents/patients may wander. These doors may be locked to prevent wandering but must be configured to automatically release on: (1) activation of the building fire alarm system, (2) activation of the automatic sprinkler system, (3) loss of power, and (4) manual release at a staff station with direct line-of-sight to the door. This is the most detailed NFPA 101 treatment of healthcare controlled-egress to date and directly governs ASSA ABLOY VersaMax installations in these occupancy types. Any VersaMax in a memory care or behavioral health facility must have compliant automatic release wiring and documentation for AHJ approval.",
      changeType: "requirement",
      priority: "high",
      previousValue: "NFPA 101-2021 — controlled-egress provisions less specific on release conditions",
      newValue: "NFPA 101-2024 — explicit 4-condition release requirements for memory care/behavioral health controlled-egress",
      productImpact:
        "VersaMax in memory care and behavioral health must be wired for 4-condition automatic release. Fire alarm, sprinkler, power failure, and manual station release are all required.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "VersaMax (healthcare controlled-egress)",
          impactLevel: "critical",
          impactDescription:
            "VersaMax in memory care, behavioral health, and pediatric wandering-prevention configurations must be wired and documented for 4-condition automatic release per NFPA 101-2024 §13.2.6/§22.2.6. Non-compliant configurations are a fire code violation. Healthcare AHJs are actively enforcing this during inspections.",
          actionRequired:
            "Update VersaMax healthcare installation guide to include NFPA 101-2024 §13.2.6/§22.2.6 wiring diagram and checklist. Add compliance documentation to healthcare project submittal template. Train sales team on controlled-egress compliance requirements.",
          deadline: "Immediate — healthcare AHJs actively enforcing",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "NFPA 101-2024 controlled-egress compliance documentation is a hard requirement for any VersaMax specification in healthcare memory care or behavioral health facilities. Without this documentation, the product cannot be specified — it is a market access gate for this vertical.",
          affectedBrands: ["ASSA ABLOY"],
          pmInsight:
            "Healthcare controlled-egress is a high-margin, recurring-revenue vertical for ASSA ABLOY VersaMax. Ensuring the NFPA 101-2024 compliance documentation package is complete and current is the single most important action for protecting and growing this vertical. Healthcare AHJs are not lenient on NFPA 101 compliance — missing documentation kills specifications.",
        },
      ],
      pmFraming:
        "NFPA 101-2024 controlled-egress provisions are the compliance foundation for the memory care and behavioral health market segment. This is a high-value, high-margin use case for VersaMax, and compliance documentation quality is the key differentiator between winning and losing these specifications. The 4-condition release wiring documentation needs to be packaged, current, and proactively provided in every healthcare submittal.",
    },
    {
      id: "nfpa101-c2",
      section: "§7.2.1.6 — Sensor-Release Mag-Lock Requirements",
      title: "Sensor-release mag-locks: must release on fire alarm, sprinkler, loss of power, or manual release",
      description:
        "NFPA 101-2024 §7.2.1.6 establishes the complete release condition set for sensor-release mag-locks used as locking devices in automatic door assemblies: the mag-lock must release on any of — (1) fire alarm activation, (2) sprinkler system activation, (3) loss of power to the locking device, or (4) actuation of a readily accessible manual release. This codifies the fail-safe principle that no mag-lock used in an egress-path assembly may remain locked under any fire emergency condition. For ASSA ABLOY automatic door products with integrated mag-locks, this 4-condition release requirement must be reflected in the wiring diagram, commissioning documentation, and UL listing documentation. Any IBC 2024-jurisdiction project will also trigger NFPA 101 fire alarm interface requirements through the code cross-referencing.",
      changeType: "requirement",
      priority: "high",
      previousValue: "NFPA 101-2021 — sensor-release conditions covered but less comprehensively enumerated",
      newValue: "NFPA 101-2024 — explicit 4-condition release set: fire alarm, sprinkler, power loss, manual release",
      productImpact:
        "All ASSA ABLOY automatic doors with integrated mag-locks in egress paths must document 4-condition release compliance. UL listing and submittal package must reflect NFPA 101-2024 §7.2.1.6.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "SL500 + mag-lock (egress path)",
          impactLevel: "significant",
          impactDescription:
            "SL500 mag-lock configurations in egress paths must document NFPA 101-2024 §7.2.1.6 4-condition release compliance. Update installation guide wiring diagram to include all four release paths.",
          actionRequired:
            "Update SL500 mag-lock installation guide with NFPA 101-2024 §7.2.1.6 wiring diagram and compliance checklist.",
          deadline: "Q3 2026",
        },
        {
          brand: "ASSA ABLOY",
          model: "VersaMax + mag-lock (egress path)",
          impactLevel: "critical",
          impactDescription:
            "VersaMax mag-lock installations in egress paths must explicitly document all 4 NFPA 101-2024 release conditions. This is a hard AHJ requirement in healthcare and high-occupancy facilities.",
          actionRequired:
            "Include NFPA 101-2024 §7.2.1.6 4-condition release wiring diagram in all VersaMax egress-path submittal packages.",
          deadline: "Immediate",
        },
      ],
      pmFraming:
        "The NFPA 101-2024 4-condition mag-lock release requirement is a clear, documentable compliance standard. ASSA ABLOY's ability to provide pre-packaged submittal documentation covering all four release conditions is a direct selling advantage — it reduces the specifier's liability exposure and streamlines AHJ approval. This is a documentation quality story, not a hardware redesign story.",
    },
  ],
  watchList: [
    {
      id: "nfpa101-watch-cms",
      title: "Watch — CMS Healthcare Facility NFPA 101-2024 Adoption Timeline",
      description:
        "CMS (Centers for Medicare & Medicaid Services) determines which NFPA 101 edition applies to healthcare facilities receiving Medicare/Medicaid funding. CMS has historically adopted NFPA 101 editions with a 1-3 year lag after publication. Monitor CMS rulemaking for NFPA 101-2024 adoption date, as this triggers mandatory compliance for hospitals and skilled nursing facilities.",
      priority: "high",
      actionRequired:
        "Monitor CMS Federal Register for NFPA 101-2024 adoption rulemaking. Prepare product compliance documentation ahead of CMS effective date.",
    },
  ],
  timeline: [
    {
      date: "2024",
      label: "NFPA 101-2024 published — controlled-egress, sensor-release mag-lock updates",
      type: "release",
    },
    {
      date: "2025–2027",
      label: "CMS adoption of NFPA 101-2024 expected for healthcare facilities",
      type: "milestone",
    },
  ],
  nextRevisionExpected: "2027",
};

// ─── ASHRAE 90.1-2022 Energy Standard ────────────────────────────────────────

const ashrae901_2022: Standard = {
  id: "ashrae-90.1-2022",
  trackId: "energy",
  designation: "ASHRAE 90.1-2022",
  fullName: "Energy Standard for Buildings Except Low-Rise Residential Buildings — 2022 Edition",
  scope:
    "THE energy code for commercial buildings nationwide — widely adopted or referenced in state energy codes across the US. The 2022 edition is particularly significant for ASSA ABLOY: revolving doors are explicitly recognized as vestibule equivalents, air curtains are codified as an alternative to vestibules, and a new 1.0 CFM/SF air leakage limit for automatic doors creates a measurable certification point. Over 80 addenda since 90.1-2019 have been incorporated.",
  governingBody: "American Society of Heating, Refrigerating and Air-Conditioning Engineers (ASHRAE)",
  governingBodyUrl: "https://www.ashrae.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2022",
    year: 2022,
    effectiveDate: "Widely adopted 2024–2025 via state energy code cycles",
    status: "stable",
    adoptedBy: ["Referenced in IECC 2024", "Adopted by 30+ states via energy code updates"],
  },
  pastEditions: [
    { version: "2019", year: 2019, effectiveDate: "2019", status: "stable" },
    { version: "2016", year: 2016, effectiveDate: "2016", status: "stable" },
  ],
  recentChanges: [
    {
      id: "ashrae901-c1",
      section: "§5.4.3.4 — Vestibule Requirements & Revolving Door Equivalency",
      title: "Revolving doors explicitly recognized as vestibule equivalent — major spec advantage for Boon Edam revolving doors",
      description:
        "ASHRAE 90.1-2022 §5.4.3.4 explicitly codifies powered revolving doors as a vestibule equivalent for energy code compliance. Buildings in Climate Zones 3-8 with more than one story or greater than 10,000 SF that require vestibules at primary entries can satisfy this requirement with a powered revolving door instead of a traditional swing door vestibule. The standard also exempts Climate Zones 1-2 (including South Florida — Zone 1) from vestibule requirements entirely. This is a direct commercial advantage for the ASSA ABLOY / Boon Edam revolving door portfolio: the energy code now explicitly supports replacing a costly vestibule with a revolving door that delivers equivalent or superior energy performance. Revolving doors have been documented to reduce HVAC load by up to 26% compared to a swing door vestibule, making the vestibule-replacement argument both code-compliant and ROI-positive.",
      changeType: "scope",
      priority: "high",
      previousValue: "ASHRAE 90.1-2019 — revolving door equivalency less explicitly codified",
      newValue: "ASHRAE 90.1-2022 — revolving door explicitly = vestibule equivalent; Climate Zones 1-2 exempt from vestibule requirement",
      productImpact:
        "Powered revolving doors (Boon Edam portfolio) can replace code-mandated vestibules. This is the single most commercially significant energy code development for the revolving door product line.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam Revolving Door Portfolio",
          impactLevel: "critical",
          impactDescription:
            "ASHRAE 90.1-2022 vestibule equivalency for powered revolving doors is a tier-1 specification advantage. Buildings in Climate Zones 3-8 required to have vestibules can specify a Boon Edam revolving door instead — saving 60-80 SF of vestibule construction, reducing lease loss, and meeting energy code.",
          actionRequired:
            "Develop ASHRAE 90.1-2022 vestibule equivalency ROI toolkit for sales team. Quantify vestibule construction cost savings. Create spec guide citing §5.4.3.4 directly. Train specification reps on climate zone map and applicability.",
          deadline: "Immediate — widely adopted standard",
        },
      ],
      corporateImplications: [
        {
          type: "competitive_advantage",
          description:
            "The ASHRAE 90.1-2022 vestibule equivalency creates a durable, code-backed competitive advantage for powered revolving doors. No swing door, no sliding door, no folding door can claim this equivalency — it is exclusive to revolving door geometry and air-retention characteristics. This is a structural competitive moat.",
          affectedBrands: ["ASSA ABLOY / Boon Edam", "Dorma Kaba (limited revolving door line)"],
          pmInsight:
            "ASHRAE 90.1-2022 vestibule equivalency is the most underutilized commercial positioning tool in the Boon Edam portfolio. The revolving door sales team should lead with this code provision in every new construction or major renovation conversation for Climate Zone 3-8 buildings over 10,000 SF. The code does the selling — the PM job is making sure every rep knows how to cite it.",
        },
      ],
      pmFraming:
        "ASHRAE 90.1-2022 vestibule equivalency converts the revolving door from a premium amenity to a code compliance solution. The value proposition shift is profound: instead of persuading a cost-conscious GC to upgrade to a revolving door, the ASSA ABLOY rep is now showing the GC how to eliminate an entire vestibule from the construction scope. This is a 'sell the savings' motion, not a 'justify the cost' motion.",
    },
    {
      id: "ashrae901-c2",
      section: "§5.4.3.3 — Air Leakage Limit for Automatic Doors",
      title: "New 1.0 CFM/SF air leakage limit for automatic sliding and swing doors (at 0.3 in wg) — measurable certification point",
      description:
        "ASHRAE 90.1-2022 §5.4.3.3 establishes a new maximum air leakage rate of 1.0 CFM per square foot of door area for automatic sliding and swing doors, measured at 0.3 inches water gauge differential pressure. This is a measurable, testable certification requirement. Automatic doors that exceed 1.0 CFM/SF fail the ASHRAE 90.1-2022 energy performance specification and cannot be used as the primary entry system in buildings subject to this standard without supplemental air sealing or an air curtain. For ASSA ABLOY, this creates a certification documentation requirement for all automatic sliding and swing door products. Products with superior air sealing geometry (particularly the SL500 and hermetic door lines) have a performance advantage.",
      changeType: "requirement",
      priority: "high",
      previousValue: "ASHRAE 90.1-2019 — no explicit CFM/SF air leakage limit for automatic doors",
      newValue: "ASHRAE 90.1-2022 §5.4.3.3 — 1.0 CFM/SF maximum at 0.3 in wg differential",
      productImpact:
        "All automatic sliding and swing door products must be tested and certified to ≤1.0 CFM/SF at 0.3 in wg. Test data must be available for project submittals.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500",
          impactLevel: "significant",
          impactDescription:
            "SL500 must be tested and certified to ASHRAE 90.1-2022 §5.4.3.3 1.0 CFM/SF air leakage limit. Test results should be published in product literature and available for project submittals. SL500 geometry should achieve this limit comfortably.",
          actionRequired:
            "Conduct air leakage testing per ASHRAE 90.1-2022 §5.4.3.3 test method. Publish results in product literature. Add to submittal template.",
          deadline: "Q3 2026",
        },
        {
          brand: "ASSA ABLOY",
          model: "ecoLOGIC Energy Monitoring",
          impactLevel: "significant",
          impactDescription:
            "The ecoLOGIC energy monitoring system can quantify real-time air exchange at automatic door openings, supporting ASHRAE 90.1-2022 air leakage compliance documentation. This is a direct product application for the air leakage certification requirement.",
          actionRequired:
            "Develop ecoLOGIC application note for ASHRAE 90.1-2022 §5.4.3.3 air leakage monitoring and documentation. Position as certification support tool.",
        },
      ],
      corporateImplications: [
        {
          type: "product_roadmap",
          description:
            "ASHRAE 90.1-2022 air leakage certification is a new documentation requirement that creates both a compliance cost (testing) and a competitive advantage opportunity (published performance data). Products with superior air sealing can use test data as a differentiator.",
          affectedBrands: ["ASSA ABLOY", "dormakaba", "Horton"],
          pmInsight:
            "The ASHRAE 90.1-2022 air leakage certification requirement is an opportunity to quantify and publish the SL500's air sealing superiority over competitors. Hermetic door products already test to air sealing standards; extending this certification to the broader automatic door line strengthens the energy performance story.",
        },
      ],
      pmFraming:
        "ASHRAE 90.1-2022's air leakage limit creates a new, quantifiable performance certification for automatic doors. For ASSA ABLOY, the SL500's architecture should comfortably meet 1.0 CFM/SF — the priority is conducting the test and publishing the data so it can be used in specifications. This is a low-cost action that delivers durable specification value.",
    },
  ],
  watchList: [
    {
      id: "ashrae901-watch-addenda",
      title: "Watch — ASHRAE 90.1 Addenda (80+ since 2019 edition)",
      description:
        "ASHRAE 90.1-2022 has incorporated over 80 addenda since the 2019 edition. Addenda may affect air leakage limits, vestibule exemptions, or other provisions relevant to automatic door systems. Monitor ASHRAE addenda tracker for any changes affecting §5.4.3 (vestibule/automatic door provisions).",
      priority: "medium",
      actionRequired:
        "Subscribe to ASHRAE 90.1 addenda notifications. Review any new addenda affecting §5.4.3 for automatic door compliance implications.",
    },
  ],
  timeline: [
    {
      date: "2022",
      label: "ASHRAE 90.1-2022 published — revolving door vestibule equivalency, air leakage limit",
      type: "release",
    },
    {
      date: "2024–2025",
      label: "Widespread state energy code adoption via IECC 2024 / state energy code cycles",
      type: "milestone",
    },
  ],
  nextRevisionExpected: "2025 (cycle)",
};

// ─── IECC 2024 International Energy Conservation Code ─────────────────────────

const iecc2024: Standard = {
  id: "iecc-2024",
  trackId: "energy",
  designation: "IECC 2024",
  fullName: "International Energy Conservation Code 2024 — Commercial Provisions",
  scope:
    "The International Energy Conservation Code 2024 commercial provisions are aligned with ASHRAE 90.1-2022 and govern energy efficiency requirements for commercial building envelopes, including automatic door air leakage and vestibule requirements. Vestibule exemptions by climate zone are significant — Climate Zones 1-2 (including South Florida) are exempt. Florida-specific note: the DoorSpec FL tool should flag this exemption for Florida projects.",
  governingBody: "International Code Council (ICC)",
  governingBodyUrl: "https://www.iccsafe.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2024",
    year: 2024,
    effectiveDate: "2024",
    status: "pending-adoption",
    adoptedBy: ["State-by-state adoption in progress — check state energy code tracker"],
  },
  pastEditions: [
    { version: "2021", year: 2021, effectiveDate: "2021", status: "stable" },
    { version: "2018", year: 2018, effectiveDate: "2018", status: "stable" },
  ],
  recentChanges: [
    {
      id: "iecc2024-c1",
      section: "C402.5 — Commercial Automatic Door Air Leakage",
      title: "IECC 2024 C402.5 — automatic door air leakage testing requirements aligned with ASHRAE 90.1-2022",
      description:
        "IECC 2024 §C402.5 aligns commercial automatic door air leakage testing requirements with ASHRAE 90.1-2022 §5.4.3.3. Automatic sliding and swing doors in commercial applications must meet the 1.0 CFM/SF maximum air leakage rate at 0.3 in wg. The testing documentation requirement under IECC 2024 is more prescriptive than the prior edition — test results must be from a recognized testing laboratory and must reference the IECC 2024 test protocol. For Florida projects, this applies to buildings outside Climate Zones 1-2. However, Florida is primarily Climate Zone 1-2, so the vestibule requirement (and by extension the air leakage trigger) has limited application within Florida proper.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "IECC 2021 — air leakage testing requirements less prescriptive",
      newValue: "IECC 2024 §C402.5 — 1.0 CFM/SF max air leakage, certified test from recognized lab, ASHRAE 90.1-2022 aligned",
      productImpact:
        "Automatic door products must have certified air leakage test data per IECC 2024 §C402.5 for projects in adopting jurisdictions outside Climate Zones 1-2.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All commercial automatic door products",
          impactLevel: "significant",
          impactDescription:
            "Projects in IECC 2024 jurisdictions (zones 3-8) require certified air leakage test data. ASSA ABLOY products must have IECC 2024 §C402.5 compliant test documentation available for submittals.",
          actionRequired:
            "Obtain certified air leakage test data per IECC 2024 §C402.5 for SL500, SW200i, and primary automatic door product lines. Include in submittal documentation package.",
          deadline: "Q4 2026",
        },
      ],
      pmFraming:
        "IECC 2024 air leakage certification is the commercial energy code partner to ASHRAE 90.1-2022. For Florida-specific projects, the Climate Zone 1-2 exemption reduces urgency — but for national specification materials, ASSA ABLOY needs certified IECC 2024 air leakage data. This is a test-and-document action, not a product redesign.",
    },
    {
      id: "iecc2024-c2",
      section: "C402.5 Climate Zone Table — Vestibule Exemptions",
      title: "Florida Climate Zones 1-2 EXEMPT from IECC 2024 vestibule requirement — key for DoorSpec FL tool",
      description:
        "IECC 2024 §C402.5 vestibule requirements do not apply to Climate Zones 1-2. South Florida (Miami-Dade, Broward, Palm Beach) is Climate Zone 1. Central and North Florida is Zone 2. The practical effect is that no Florida commercial building is required to provide a vestibule by the IECC 2024 energy code. This is significant for the DoorSpec FL compliance tool — it should display a Florida vestibule exemption flag for any project in Climate Zones 1-2. Note: the ASHRAE 90.1-2022 revolving door vestibule equivalency is still relevant in Florida as a voluntary premium option, but the mandatory vestibule trigger does not apply in most of Florida.",
      changeType: "scope",
      priority: "medium",
      previousValue: "IECC 2021 — climate zone exemptions less prominently flagged",
      newValue: "IECC 2024 — Zones 1-2 EXPLICITLY EXEMPT from vestibule requirement; Florida is Zones 1-2",
      productImpact:
        "DoorSpec FL tool should flag Florida vestibule exemption. Revolving door sales in Florida is a premium/voluntary decision, not a code-mandatory one.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "DoorSpec FL Compliance Tool",
          impactLevel: "significant",
          impactDescription:
            "DoorSpec FL must reflect IECC 2024 Climate Zone 1-2 vestibule exemption for Florida projects. Compliance tool outputs for Florida entries should not recommend vestibule as code-required.",
          actionRequired:
            "Update DoorSpec FL tool vestibule compliance logic to reflect IECC 2024 §C402.5 Climate Zone 1-2 exemption. Add Florida climate zone map reference.",
          deadline: "Before DoorSpec FL next release",
        },
      ],
      pmFraming:
        "The Florida vestibule exemption under IECC 2024 is a critical accuracy point for the DoorSpec FL tool. Incorrectly flagging vestibule as required in Florida would undermine tool credibility. This is a must-fix for the DoorSpec FL product roadmap.",
    },
  ],
  watchList: [
    {
      id: "iecc2024-watch-state-adoption",
      title: "Watch — State IECC 2024 Adoption — Florida Energy Code Alignment",
      description:
        "Florida uses the Florida Energy Code (FEC), which is based on IECC but includes Florida-specific amendments. Monitor FEC adoption cycle to determine when IECC 2024 provisions (including §C402.5 air leakage and vestibule exemptions) become effective in Florida. FEC is typically updated on a 3-year cycle following the FBC update.",
      priority: "high",
      actionRequired:
        "Monitor Florida Building Commission energy code update cycle. Update DoorSpec FL compliance logic to reflect any FEC IECC 2024 alignment.",
    },
  ],
  timeline: [
    {
      date: "2024",
      label: "IECC 2024 published — aligned with ASHRAE 90.1-2022; Florida zones 1-2 vestibule exempt",
      type: "release",
    },
    {
      date: "2025–2027",
      label: "State adoption of IECC 2024 — state-by-state effective dates vary",
      type: "milestone",
    },
  ],
  nextRevisionExpected: "2027",
};

// ─────────────────────────────────────────────────────────────────────────────
// ACCESSIBILITY STANDARDS
// ─────────────────────────────────────────────────────────────────────────────

// ─── ICC A117.1 — Accessible and Usable Buildings ────────────────────────────

const iccA1171: Standard = {
  id: "icc-a117.1",
  trackId: "accessibility",
  designation: "ICC A117.1",
  fullName: "Accessible and Usable Buildings and Facilities",
  scope:
    "ICC A117.1 (2017 edition, referenced by ADA and IBC) governs ADA compliance for automatic doors. This is the primary technical accessibility standard for door hardware and accessibility compliance. All ASSA ABLOY automatic door products should cite A117.1 compliance in product specification sheets. Key provisions include maneuvering clearance, clear opening width, activation timing, vestibule sizing, and revolving door bypass requirements.",
  governingBody: "International Code Council (ICC)",
  governingBodyUrl: "https://www.iccsafe.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2017",
    year: 2017,
    effectiveDate: "Referenced by IBC 2021 and IBC 2024",
    status: "stable",
  },
  pastEditions: [
    { version: "2009", year: 2009, effectiveDate: "2009", status: "stable" },
    { version: "2003", year: 2003, effectiveDate: "2003", status: "stable" },
  ],
  recentChanges: [
    {
      id: "a1171-c1",
      section: "§404.3 — Maneuvering Clearances for Power-Operated Doors",
      title: "Automatic doors: 12\" latch-side pull, 0\" latch-side push (vs. 18\" for manual doors) — major ADA compliance advantage",
      description:
        "ICC A117.1-2017 §404.3 establishes reduced maneuvering clearance requirements for power-operated automatic doors versus manual doors. Power-operated doors require only 12 inches of clear floor space on the latch side (pull) and 0 inches on the latch side (push). Manual doors require 18 inches on both sides. This 18-inch reduction is the most commercially relevant ADA provision for automatic door sales: in any renovation project where a manual door fails ADA maneuvering clearance requirements due to constrained space, replacing it with an automatic door resolves the non-compliance. This applies to corridor entries, elevator lobbies, accessible restrooms, and any ADA-required primary entry where 18-inch clearance is unachievable. All ASSA ABLOY automatic door product specification sheets should prominently cite this clearance advantage.",
      changeType: "requirement",
      priority: "high",
      previousValue: "Manual doors: 18\" latch-side clearance required on both sides",
      newValue: "Automatic power-operated doors: 12\" latch-side pull, 0\" latch-side push",
      productImpact:
        "Automatic doors resolve ADA maneuvering clearance constraints that manual doors cannot meet. This is a specification selling point for renovation and retrofit projects.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "All automatic door products (SW200i, SL500, VersaMax, SW60)",
          impactLevel: "significant",
          impactDescription:
            "All ASSA ABLOY automatic door product lines benefit from the 0\" latch-side push clearance advantage under A117.1 §404.3. This should be highlighted in all specification guides, sales materials, and the DoorSpec FL tool for ADA-constrained projects.",
          actionRequired:
            "Add A117.1 §404.3 maneuvering clearance comparison (automatic vs. manual) to product specification sheets. Include in DoorSpec FL ADA compliance outputs. Train sales team on renovation/retrofit ADA clearance selling point.",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "The A117.1 maneuvering clearance advantage for automatic doors versus manual doors is an underutilized market access argument for renovation and retrofit sales. ADA compliance upgrades in existing buildings are a significant and growing market segment.",
          affectedBrands: ["ASSA ABLOY"],
          pmInsight:
            "The ADA clearance story (0\" vs. 18\" latch-side push) is one of the strongest renovation market sales arguments ASSA ABLOY has. Any building with a tight entry that fails ADA inspection is a qualified automatic door prospect. The PM team should develop a 'solve your ADA problem' campaign targeting building owners who have received ADA non-compliance notices.",
        },
      ],
      pmFraming:
        "ICC A117.1 §404.3 creates a clear, code-backed selling motion for automatic doors in renovation projects: replace a non-compliant manual door with an ASSA ABLOY automatic door, and the ADA maneuvering clearance problem goes away. This is a 'problem-solution' selling frame backed by a federal accessibility standard. Every sales rep should be able to cite this provision and draw the clearance comparison.",
    },
    {
      id: "a1171-c2",
      section: "§404.3.6 — Revolving Doors Require Adjacent Accessible Bypass",
      title: "Revolving doors must have adjacent accessible manual or automatic door bypass per A117.1",
      description:
        "ICC A117.1-2017 §404.3.6 requires that revolving doors be accompanied by an adjacent accessible door (manual or automatic) providing an equivalent accessible route. The revolving door itself does not constitute the accessible route — the bypass does. For ASSA ABLOY, this means every Boon Edam revolving door installation must include an adjacent accessible door in the project specification. The adjacent door creates an upsell opportunity: pair the revolving door with a VersaMax, SL500, or SW200i as the accessible bypass, increasing the per-project revenue. Properly documenting the revolving door + accessible bypass combination as an integrated ADA-compliant entry system is a specification best practice.",
      changeType: "requirement",
      priority: "medium",
      productImpact:
        "Every Boon Edam revolving door project requires an adjacent accessible door bypass. This is an upsell opportunity to pair with VersaMax, SL500, or SW200i.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Boon Edam + VersaMax / SL500 combination",
          impactLevel: "significant",
          impactDescription:
            "A117.1 §404.3.6 requires accessible bypass at every revolving door. Specifying ASSA ABLOY's accessible bypass door (VersaMax, SL500, or SW200i) as part of the revolving door package increases per-project value and ensures full ADA compliance documentation.",
          actionRequired:
            "Develop revolving door + accessible bypass integrated specification package. Promote combined Boon Edam + VersaMax/SL500 specification to architects.",
        },
      ],
      pmFraming:
        "The A117.1 accessible bypass requirement for revolving doors creates a natural product bundling opportunity. Every revolving door specification must include an accessible automatic door bypass — which ASSA ABLOY can supply from its own product portfolio. Developing a pre-packaged specification bundle (revolving door + accessible bypass) with integrated ADA documentation is a high-value product management initiative.",
    },
  ],
  watchList: [
    {
      id: "a1171-watch-2022-update",
      title: "Watch — ICC A117.1-2022 Edition Update",
      description:
        "A 2022 edition of ICC A117.1 may include updates to automatic door accessibility provisions. Monitor ICC publication schedule and review any changes affecting §404.3 maneuvering clearances, activation provisions, or revolving door bypass requirements.",
      priority: "medium",
      actionRequired:
        "Obtain ICC A117.1-2022 when published. Compare §404.3 provisions against 2017 edition. Update product specification documentation if changes affect automatic door requirements.",
    },
  ],
  timeline: [
    {
      date: "2017",
      label: "ICC A117.1-2017 published — current edition referenced by IBC 2021 and IBC 2024",
      type: "release",
    },
  ],
  nextRevisionExpected: "2022/2023 (monitor)",
};

// ─── UL 294 — Access Control System Units ────────────────────────────────────

const ul294: Standard = {
  id: "ul-294",
  trackId: "accessibility",
  designation: "UL 294",
  fullName: "Access Control System Units",
  scope:
    "UL 294 is the safety listing standard for access control system components. IBC 2024 now explicitly clarifies that mag-locks used as locking devices in egress paths at automatic doors require UL 294 listing. This affects any ASSA ABLOY VersaMax or SL500 with integrated mag-lock or electric strike in an egress path. UL 294 listed components are required for code-compliant access-controlled automatic door installations in IBC 2024 jurisdictions.",
  governingBody: "Underwriters Laboratories (UL)",
  governingBodyUrl: "https://www.ul.com",
  lastVerified: "May 2026",
  currentEdition: {
    version: "Edition 8",
    year: 2023,
    effectiveDate: "Edition 8 (2023, effective May 24, 2025)",
    status: "stable",
  },
  pastEditions: [],
  recentChanges: [
    {
      id: "ul294-c1",
      section: "IBC 2024 §1010.1.9.7 Cross-Reference",
      title: "IBC 2024 explicitly requires UL 294 listing for mag-locks used as locking devices in egress paths at auto doors",
      description:
        "IBC 2024 §1010.1.9.7 clarifies which access control components at automatic doors require UL 294 listing. The provision explicitly states that mag-locks used as locking devices in egress paths must be UL 294 listed as access control system units. This eliminates the previous ambiguity around whether a mag-lock used with an automatic door needed a separate UL 294 listing or whether the door's UL listing was sufficient. Any ASSA ABLOY VersaMax or SL500 installation in an IBC 2024 jurisdiction egress path with integrated mag-lock must use UL 294 listed mag-lock components. This is a purchasing specification requirement that flows through to the hardware schedule on all affected projects.",
      changeType: "requirement",
      priority: "medium",
      previousValue: "IBC 2021 — UL 294 requirement for mag-locks in auto door egress paths was implicit",
      newValue: "IBC 2024 — explicit UL 294 listing requirement for mag-locks as locking devices in egress path auto door assemblies",
      productImpact:
        "All VersaMax and SL500 mag-lock configurations in egress paths must specify UL 294 listed mag-lock components. Update hardware schedule templates and submittal packages.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "VersaMax + Mag-Lock (egress path)",
          impactLevel: "significant",
          impactDescription:
            "VersaMax mag-lock configurations in egress paths in IBC 2024 jurisdictions must use UL 294 listed mag-lock components. Hardware schedule and submittal must confirm UL 294 listing.",
          actionRequired:
            "Confirm ASSA ABLOY mag-lock products used with VersaMax in egress paths carry UL 294 listing. Update VersaMax egress-path hardware schedule template to specify UL 294 listed mag-lock. Add compliance note to submittal documentation.",
          deadline: "Q4 2026",
        },
        {
          brand: "ASSA ABLOY",
          model: "SL500 + Mag-Lock (egress path)",
          impactLevel: "significant",
          impactDescription:
            "SL500 sliding door mag-lock configurations in egress paths must specify UL 294 listed mag-lock per IBC 2024 explicit requirement.",
          actionRequired:
            "Update SL500 egress-path hardware schedule template to specify UL 294 listed mag-lock.",
          deadline: "Q4 2026",
        },
      ],
      pmFraming:
        "The IBC 2024 explicit UL 294 requirement for mag-locks in egress path automatic door assemblies is primarily a documentation and hardware specification update. ASSA ABLOY should confirm its mag-lock product line carries UL 294 listings and ensure all egress-path project hardware schedules reference UL 294 listed components. This prevents last-minute AHJ corrections at project closeout.",
    },
  ],
  watchList: [],
  timeline: [
    {
      date: "2024",
      label: "IBC 2024 §1010.1.9.7 explicit UL 294 cross-reference for egress-path mag-locks at auto doors",
      type: "milestone",
    },
  ],
  nextRevisionExpected: "Ongoing UL updates",
};

// ─────────────────────────────────────────────────────────────────────────────
// ASTM STANDARDS
// ─────────────────────────────────────────────────────────────────────────────

// ─── ASTM E1886 / E1996 — Impact Resistance (Hurricane) ──────────────────────

const astmE1886E1996: Standard = {
  id: "astm-e1886-e1996",
  trackId: "astm",
  designation: "ASTM E1886 / E1996",
  fullName: "Impact Resistance — Wind-Borne Debris Impact and Pressure Cycling (Hurricane Zones)",
  scope:
    "E1886 is the test method for wind-borne debris impact resistance and cyclic pressure loading. E1996 establishes the performance level requirements (missile impact grades) based on geographic zone exposure. Required for any automatic door product in the High Velocity Hurricane Zone (HVHZ) — Miami-Dade and Broward counties. The SL500 R104 (Resilience) is tested to these standards and holds a Miami-Dade Notice of Acceptance (NOA) — a major competitive differentiator. Competitors largely cannot match this hurricane-resistance certification.",
  governingBody: "ASTM International",
  governingBodyUrl: "https://www.astm.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "active",
    year: 2023,
    effectiveDate: "Current — required for HVHZ Miami-Dade NOA",
    status: "stable",
  },
  pastEditions: [
    { version: "E1886-05", year: 2005, effectiveDate: "2005", status: "stable" },
    { version: "E1996-14", year: 2014, effectiveDate: "2014", status: "stable" },
  ],
  recentChanges: [
    {
      id: "astme1886-c1",
      section: "HVHZ Miami-Dade NOA Requirement",
      title: "SL500 R104 passes E1886/E1996 — NOA required for HVHZ; major competitive differentiator",
      description:
        "Any automatic door installed in the High Velocity Hurricane Zone (HVHZ) — defined as Miami-Dade and Broward counties in Florida — must hold a Miami-Dade Product Approval (Notice of Acceptance, or NOA) demonstrating compliance with ASTM E1886 impact test method and ASTM E1996 performance levels. The SL500 R104 (Resilience) product has been tested to these standards and holds a valid NOA number. This is a critical competitive differentiator: no other automatic sliding door from major competitors has successfully obtained a full HVHZ NOA for the automatic door operator assembly. The NOA covers the complete door system — operator, frame, glazing, and hardware — under the extreme wind and impact conditions of a Category 5 hurricane environment. For any HVHZ project requiring automatic doors, the SL500 R104 is the only fully code-compliant automatic sliding door option that carries its own NOA.",
      changeType: "requirement",
      priority: "high",
      previousValue: "Competitors: no HVHZ NOA for automatic sliding door systems",
      newValue: "SL500 R104: holds Miami-Dade NOA — passes ASTM E1886/E1996 as complete system",
      productImpact:
        "SL500 R104 is the specification-required automatic sliding door for HVHZ projects. No competitor has a directly comparable HVHZ-certified automatic door system.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 R104 (Resilience)",
          impactLevel: "critical",
          impactDescription:
            "SL500 R104 holds Miami-Dade NOA under ASTM E1886/E1996. This is the required product for HVHZ automatic door installations. Maintain NOA currency — renewal and any system configuration changes require re-testing.",
          actionRequired:
            "Maintain active Miami-Dade NOA. Monitor NOA expiration and renewal calendar. Any hardware or glazing configuration change must be evaluated for NOA impact. Prominently feature NOA number in HVHZ project submittals.",
          deadline: "Ongoing — NOA renewal calendar",
        },
      ],
      corporateImplications: [
        {
          type: "competitive_advantage",
          description:
            "The SL500 R104 HVHZ NOA is the most durable competitive moat in the ASSA ABLOY automatic door portfolio. Miami-Dade and Broward represent billions of dollars of commercial construction annually. Any project requiring automatic sliding doors in HVHZ must specify the SL500 R104 by name — no competitor can substitute.",
          affectedBrands: ["ASSA ABLOY"],
          pmInsight:
            "The HVHZ NOA for SL500 R104 is not just a compliance certification — it is a specification lock-out. In HVHZ projects, the specification can say 'SL500 R104 or equivalent with active Miami-Dade NOA' and there is no equivalent. This is the closest thing to a natural monopoly in the automatic door market. Maintain the NOA, protect it, and build every HVHZ sales motion around it.",
        },
        {
          type: "market_access",
          description:
            "Without an HVHZ NOA, automatic sliding door products are legally non-installable in Miami-Dade and Broward counties. The NOA is the market access gate for the most valuable commercial construction market in Florida.",
          affectedBrands: ["ASSA ABLOY — SL500 R104 has NOA; all others do not"],
          pmInsight:
            "HVHZ NOA is the market access gate for South Florida commercial construction. Every competitor entering the Florida market without a full HVHZ NOA for their automatic door system is shut out of Miami-Dade and Broward entirely. ASSA ABLOY must maintain NOA currency as a non-negotiable product management priority.",
        },
      ],
      pmFraming:
        "The SL500 R104 HVHZ NOA is ASSA ABLOY's single most valuable compliance certification in the Florida market. It converts South Florida commercial construction from a competitive market into a specification lock-out. Every HVHZ project is an ASSA ABLOY project by default, provided the NOA is maintained and sales reps know how to use it. This is the product management equivalent of a patent — protect it with the same urgency.",
    },
  ],
  watchList: [
    {
      id: "astme1886-watch-noa-renewal",
      title: "Watch — Miami-Dade NOA Renewal for SL500 R104",
      description:
        "Miami-Dade Product Approvals (NOAs) have expiration dates and must be renewed. Any configuration change to the SL500 R104 system (operator, frame, glazing, hardware) must be evaluated for NOA impact. Monitor NOA expiration calendar and initiate renewal testing with sufficient lead time (typically 6–12 months for HVHZ testing protocol).",
      priority: "high",
      actionRequired:
        "Maintain active NOA renewal calendar for SL500 R104. Flag any product configuration change for NOA impact assessment. Ensure NOA number is published and current in all HVHZ project submittals.",
    },
  ],
  timeline: [
    {
      date: "Current",
      label: "SL500 R104 holds active Miami-Dade NOA — ASTM E1886/E1996 certified",
      type: "milestone",
    },
  ],
  nextRevisionExpected: "ASTM periodic review",
};

// ─── ASTM F842-17 — Forced Entry Resistance ───────────────────────────────────

const astmF842: Standard = {
  id: "astm-f842",
  trackId: "astm",
  designation: "ASTM F842-17",
  fullName: "Standard Test Methods for Measuring the Forced Entry Resistance of Sliding Door Assemblies",
  scope:
    "ASTM F842-17 establishes graded forced entry resistance ratings for sliding door assemblies. Grades 10 through 50 (in increments) represent increasing levels of forced entry resistance. The SL500 R104 holds a Grade 25 rating under ASTM F842-17 — relevant for government, corrections, corporate security, and high-security commercial specifications.",
  governingBody: "ASTM International",
  governingBodyUrl: "https://www.astm.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "F842-17",
    year: 2017,
    effectiveDate: "2017",
    status: "stable",
  },
  pastEditions: [
    { version: "F842-10", year: 2010, effectiveDate: "2010", status: "stable" },
  ],
  recentChanges: [
    {
      id: "astmf842-c1",
      section: "Grades 10–50 — Forced Entry Resistance Grading",
      title: "SL500 R104 = Grade 25 forced entry resistance — key for security-sensitive project specifications",
      description:
        "ASTM F842-17 defines a graded scale for sliding door forced entry resistance: Grade 10 (basic forced entry resistance) through Grade 50 (extreme security applications). The SL500 R104 has been tested and rated at Grade 25, placing it in the mid-upper tier of commercial sliding door security performance. Grade 25 meets the specification requirements for most government office, institutional, and corporate security applications. Corrections facilities and critical infrastructure typically require Grade 40 or above. The Grade 25 rating is a documented, testable specification talking point for security-sensitive projects and differentiates the SL500 R104 from standard commercial automatic sliding doors with no forced entry rating.",
      changeType: "test-method",
      priority: "medium",
      productImpact:
        "SL500 R104 Grade 25 forced entry resistance is a specification selling point for security-sensitive projects. Promote in government, institutional, and corporate security specifications.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "Besam SL500 R104 (Resilience)",
          impactLevel: "significant",
          impactDescription:
            "SL500 R104 Grade 25 ASTM F842-17 forced entry resistance rating differentiates it from standard automatic doors in security-sensitive specifications. Prominently feature in government and security project submittals.",
          actionRequired:
            "Include ASTM F842-17 Grade 25 certification in SL500 R104 product literature and project submittal templates for security-sensitive applications. Train sales team on Grade 25 vs. competitors' ratings.",
        },
      ],
      corporateImplications: [
        {
          type: "competitive_advantage",
          description:
            "SL500 R104 ASTM F842-17 Grade 25 forced entry resistance is a documented competitive differentiator for security-sensitive specifications. Most automatic sliding doors have no forced entry resistance certification — the Grade 25 rating is a moat for government, institutional, and corporate security verticals.",
          affectedBrands: ["ASSA ABLOY"],
          pmInsight:
            "The ASTM F842-17 Grade 25 rating for SL500 R104 is an underutilized security vertical talking point. Government, corrections, and corporate security specifiers write ASTM F842 grade requirements into specifications. Being the only automatic sliding door with a published Grade 25 rating means ASSA ABLOY is specified by default in those projects — without that knowledge, sales reps leave this advantage on the table.",
        },
      ],
      pmFraming:
        "ASTM F842-17 Grade 25 is a specification-level security credential for the SL500 R104. In government and institutional projects where forced entry resistance is a specification line item, the Grade 25 rating is the answer to the spec. Sales reps need to know to ask 'does your specification include forced entry resistance requirements?' — because if it does, the SL500 R104 is the only automatic sliding door that can answer yes.",
    },
  ],
  watchList: [],
  timeline: [
    {
      date: "2017",
      label: "ASTM F842-17 current edition — SL500 R104 holds Grade 25",
      type: "release",
    },
  ],
  nextRevisionExpected: "ASTM periodic review",
};

// ─────────────────────────────────────────────────────────────────────────────
// HEALTHCARE STANDARDS
// ─────────────────────────────────────────────────────────────────────────────

// ─── ASHRAE 170-2021 — Ventilation of Health Care Facilities ─────────────────

const ashrae170_2021: Standard = {
  id: "ashrae-170-2021",
  trackId: "healthcare",
  designation: "ASHRAE 170-2021",
  fullName: "Ventilation of Health Care Facilities — 2021 Edition",
  scope:
    "ASHRAE 170-2021 governs ventilation requirements in healthcare facilities, with direct implications for automatic door installations in pressure-sensitive spaces: ICU/CCU vestibules, operating room corridors, isolation rooms, and pharmacy areas. Automatic doors must maintain pressure differentials, and hold-open timing affects air exchange compliance. Sensor requirements for infection control are specifically addressed. VersaMax is the primary ASSA ABLOY product for ICU/CCU healthcare applications.",
  governingBody: "American Society of Heating, Refrigerating and Air-Conditioning Engineers (ASHRAE)",
  governingBodyUrl: "https://www.ashrae.org",
  lastVerified: "May 2026",
  currentEdition: {
    version: "2021",
    year: 2021,
    effectiveDate: "2021 — referenced by CMS and Joint Commission for hospital certification",
    status: "stable",
  },
  pastEditions: [
    { version: "2017", year: 2017, effectiveDate: "2017", status: "stable" },
    { version: "2013", year: 2013, effectiveDate: "2013", status: "stable" },
  ],
  recentChanges: [
    {
      id: "ashrae170-c1",
      section: "§7.1 — Pressure Differentials at Automatic Door Openings",
      title: "Hospital pressure differential maintenance requirements at automatic door openings — hold-open timing and sensor requirements for infection control",
      description:
        "ASHRAE 170-2021 §7.1 requires that automatic doors in pressure-critical healthcare spaces — ICU/CCU vestibules, negative pressure isolation rooms, positive pressure clean rooms, and operating room corridors — maintain specified minimum pressure differentials between adjacent spaces. The standard establishes that automatic doors must be configured to minimize the pressure equalization time during each door cycle, which directly constrains the hold-open time setting on the automatic door operator. Extended hold-open times (common in high-traffic commercial settings) are not compliant in pressure-critical healthcare spaces — the door must close promptly after each passage to restore the pressure differential. ASHRAE 170-2021 also introduces specific requirements for hands-free or minimal-contact sensor activation in infection control zones, aligning with A156.19's contactless wave sensor provisions. For ICU/CCU vestibule configurations (common in VersaMax applications), the standard specifically addresses the dual-door interlocking requirement — only one door in the vestibule sequence may be open at any time to prevent pressure equalization.",
      changeType: "requirement",
      priority: "high",
      previousValue: "ASHRAE 170-2017 — pressure differential hold-open timing requirements less specific",
      newValue: "ASHRAE 170-2021 §7.1 — explicit hold-open timing constraints and hands-free sensor requirements for infection control zones",
      productImpact:
        "VersaMax ICU/CCU configurations must be commissioned with ASHRAE 170-2021 hold-open timing. Sales and installation teams must understand infection control zone requirements.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "VersaMax (ICU/CCU)",
          impactLevel: "critical",
          impactDescription:
            "VersaMax in ICU/CCU and pressure-critical healthcare spaces must be programmed to ASHRAE 170-2021 hold-open timing constraints. Extended hold-open settings non-compliant in pressure-differential zones. Dual-door interlocking for vestibule configurations is a hard requirement.",
          actionRequired:
            "Develop ASHRAE 170-2021 hold-open timing compliance guide for VersaMax healthcare installations. Create ICU/CCU commissioning checklist covering pressure differential maintenance, hold-open timing, dual-door interlock, and hands-free activation.",
          deadline: "Immediate — healthcare AHJs and CMS are enforcing",
        },
      ],
      corporateImplications: [
        {
          type: "market_access",
          description:
            "ASHRAE 170-2021 compliance documentation is a prerequisite for VersaMax specifications in ICU/CCU and infection-controlled healthcare spaces. Without compliant commissioning documentation, VersaMax cannot be specified in CMS-regulated healthcare facilities.",
          affectedBrands: ["ASSA ABLOY"],
          pmInsight:
            "Healthcare is the highest-margin, highest-switching-cost vertical for VersaMax. ASHRAE 170-2021 compliance is a market access gate — not because the product can't meet the requirement, but because the documentation and commissioning protocol need to be complete and current. The PM team must invest in healthcare-specific installation and commissioning guides that explicitly address ASHRAE 170-2021 pressure differential requirements.",
        },
      ],
      pmFraming:
        "ASHRAE 170-2021 compliance for VersaMax in ICU/CCU settings is a high-stakes documentation challenge. The product can meet the requirements — the risk is incomplete commissioning documentation that fails AHJ or Joint Commission inspection. Investing in a complete ASHRAE 170-2021 + NFPA 101-2024 joint healthcare commissioning protocol for VersaMax is a direct revenue protection action for the healthcare vertical.",
    },
    {
      id: "ashrae170-c2",
      section: "§8.2 — ICU/CCU Vestibule Airlock Configurations",
      title: "ICU/CCU vestibule airlock dual-door interlock specifically addressed in 2021 edition",
      description:
        "ASHRAE 170-2021 §8.2 specifically addresses ICU and CCU vestibule airlock configurations — requiring that the two-door vestibule sequence (entry door and interior door) operate with electronic interlocking to ensure only one door opens at a time. This is the classic airlock pattern used to maintain positive pressure in ICU corridors. The 2021 edition adds clarity on the interlock timing tolerance (the delay between door 1 closing and door 2 opening may not exceed 3 seconds to limit pressure equalization window) and the sensor placement requirements for motion-free or hands-free activation in critical care areas. VersaMax is the primary ASSA ABLOY product for this configuration, and the installation guide must reflect ASHRAE 170-2021 §8.2 interlock specifications.",
      changeType: "requirement",
      priority: "high",
      productImpact:
        "VersaMax ICU/CCU vestibule configurations must implement ASHRAE 170-2021 §8.2 dual-door interlock with ≤3 second delay. Update commissioning documentation.",
      productImpacts: [
        {
          brand: "ASSA ABLOY",
          model: "VersaMax (ICU/CCU Vestibule)",
          impactLevel: "critical",
          impactDescription:
            "ICU/CCU VersaMax vestibule interlocking must comply with ASHRAE 170-2021 §8.2 ≤3 second door 1 close to door 2 open delay. Install guide and commissioning checklist must reference this provision.",
          actionRequired:
            "Update VersaMax ICU/CCU vestibule interlock commissioning protocol to specify ASHRAE 170-2021 §8.2 ≤3 second interlock timing. Add to Joint Commission survey preparation checklist.",
          deadline: "Immediate — included in Joint Commission healthcare surveys",
        },
      ],
      pmFraming:
        "The ASHRAE 170-2021 ICU/CCU vestibule airlock interlock specification (§8.2) is a technical requirement that must be built into the VersaMax healthcare commissioning guide. This is not a product change — it is a documentation and programming change that has direct Joint Commission survey implications. A VersaMax installation that fails Joint Commission inspection due to incorrect interlock timing is a customer relationship problem that documentation precision can prevent.",
    },
  ],
  watchList: [
    {
      id: "ashrae170-watch-cms",
      title: "Watch — CMS Adoption of ASHRAE 170-2021 for Healthcare Facility Certification",
      description:
        "CMS (Centers for Medicare & Medicaid Services) and the Joint Commission reference ASHRAE 170 for hospital certification requirements. Monitor CMS adoption timeline for ASHRAE 170-2021. Current CMS reference edition may be 2017. When CMS adopts 170-2021, the hold-open timing and interlock requirements become mandatory for all CMS-regulated healthcare facilities.",
      priority: "high",
      actionRequired:
        "Monitor CMS Federal Register for ASHRAE 170-2021 adoption. Update VersaMax healthcare compliance documentation upon CMS adoption.",
    },
  ],
  timeline: [
    {
      date: "2021",
      label: "ASHRAE 170-2021 published — ICU/CCU vestibule interlock, hold-open timing, infection control sensor requirements",
      type: "release",
    },
    {
      date: "2024–2026",
      label: "Expected CMS adoption of ASHRAE 170-2021 for healthcare facility certification",
      type: "milestone",
    },
  ],
  nextRevisionExpected: "2025",
};

// ─────────────────────────────────────────────────────────────────────────────
// Assembled Tracks
// ─────────────────────────────────────────────────────────────────────────────

export const tracks: Track[] = [
  {
    id: "bhma",
    label: "ANSI/BHMA Standards",
    shortLabel: "BHMA",
    description:
      "A156 series standards for power-operated, low-energy, power-assist, and revolving pedestrian doors",
    standards: [a15610, a15619, a15627, a15638, a15627_2024, a156LowEnergyKnowingAct, a1563_2025, a15621_2025, a15614_2024, a15616_2023, a15611_2024],
    overallStatus: "stable",
    alertCount: 0,
  },
  {
    id: "icc",
    label: "ICC / International Building Code",
    shortLabel: "IBC",
    description:
      "IBC 2024 §1010.1.4.2 egress breakout/fail-safe + §1105.1.1 mandatory power-operated door thresholds. Chapter 10 egress updates including access-control free-egress, vestibule equivalency, and maneuvering clearances.",
    standards: [ibc2024, ibc2024Ch10Egress],
    overallStatus: "pending-adoption",
    alertCount: 1,
  },
  {
    id: "lifesafety",
    label: "Life Safety Code",
    shortLabel: "Life Safety",
    description:
      "NFPA 101 Life Safety Code — controlled-egress, sensor-release mag-lock, and healthcare automatic door provisions",
    standards: [nfpa101_2024],
    overallStatus: "pending-adoption",
    alertCount: 0,
  },
  {
    id: "energy",
    label: "Energy Codes",
    shortLabel: "Energy",
    description:
      "ASHRAE 90.1-2022 and IECC 2024 — vestibule equivalency for revolving doors, air leakage limits, climate zone vestibule exemptions",
    standards: [ashrae901_2022, iecc2024],
    overallStatus: "pending-adoption",
    alertCount: 0,
  },
  {
    id: "accessibility",
    label: "Accessibility Standards",
    shortLabel: "Accessibility",
    description:
      "ICC A117.1 ADA compliance for automatic doors; UL 294 access control system listings for egress-path mag-locks",
    standards: [iccA1171, ul294],
    overallStatus: "stable",
    alertCount: 0,
  },
  {
    id: "astm",
    label: "ASTM Standards",
    shortLabel: "ASTM",
    description:
      "E1886/E1996 hurricane impact resistance (HVHZ NOA); F842-17 forced entry resistance for SL500 R104",
    standards: [astmE1886E1996, astmF842],
    overallStatus: "stable",
    alertCount: 0,
  },
  {
    id: "healthcare",
    label: "Healthcare Standards",
    shortLabel: "Healthcare",
    description:
      "ASHRAE 170-2021 healthcare ventilation — pressure differentials, ICU/CCU vestibule interlock, infection control sensor requirements",
    standards: [ashrae170_2021],
    overallStatus: "stable",
    alertCount: 0,
  },
  {
    id: "fbc",
    label: "Florida Building Commission",
    shortLabel: "FBC",
    description:
      "FBC 9th Edition (eff. Dec 31, 2026): 160 mph NOA, TAS 203 water infiltration (confirmed), fenestration changes (documents pending), HVHZ, IBC 2024 §1105.1.1 adoption",
    standards: [fbc9th],
    overallStatus: "alert",
    alertCount: 3,
  },
  {
    id: "aaadm",
    label: "AAADM Certification Program",
    shortLabel: "AAADM",
    description:
      "Industry certification & inspection program for automatic door technicians. Referenced in A156.10 \u00a7E4. Required by many AHJs and insurers for electronic service work on full-energy doors.",
    standards: [aaadmCertification],
    overallStatus: "stable",
    alertCount: 0,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

export function getTrack(id: TrackId): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getAllStandards(): Standard[] {
  return tracks.flatMap((t) => t.standards);
}

export function getHighPriorityChanges(): Change[] {
  return getAllStandards()
    .flatMap((s) => s.recentChanges)
    .filter((c) => c.priority === "high");
}

export function getHighPriorityWatchItems(): WatchItem[] {
  return getAllStandards()
    .flatMap((s) => s.watchList)
    .filter((w) => w.priority === "high");
}

export function getStatusLabel(status: StatusCode): string {
  switch (status) {
    case "stable":
      return "Stable";
    case "active-revision":
      return "Active Revision";
    case "pending-adoption":
      return "Pending Adoption";
    case "alert":
      return "Action Required";
    default:
      return status;
  }
}

export function getAllTimelineEvents(): (TimelineEvent & {
  standardId: string;
  trackId: TrackId;
})[] {
  return getAllStandards().flatMap((s) =>
    s.timeline.map((e) => ({ ...e, standardId: s.id, trackId: s.trackId }))
  );
}

export function getChangesByImpactLevel(level: ImpactLevel): Change[] {
  return getAllStandards()
    .flatMap((s) => s.recentChanges)
    .filter((c) =>
      c.productImpacts?.some((pi) => pi.impactLevel === level)
    );
}

export function getCriticalChanges(): Change[] {
  return getChangesByImpactLevel("critical");
}

export function getPipelineByPriority(priority: Priority): PipelineItem[] {
  return regulatoryPipeline.filter((p) => p.priority === priority);
}

export function getHighPriorityPipeline(): PipelineItem[] {
  return getPipelineByPriority("high");
}

export function getChangesByBrand(brand: string): Change[] {
  return getAllStandards()
    .flatMap((s) => s.recentChanges)
    .filter((c) =>
      c.productImpacts?.some((pi) =>
        pi.brand.toLowerCase().includes(brand.toLowerCase())
      )
    );
}

export function getImplicationsByType(type: ImplicationType): CorporateImplication[] {
  return getAllStandards()
    .flatMap((s) => s.recentChanges)
    .flatMap((c) => c.corporateImplications ?? [])
    .filter((ci) => ci.type === type);
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE CODE ADOPTION DATA
// ─────────────────────────────────────────────────────────────────────────────

export interface StateCodeAdoption {
  stateCode: string;
  stateName: string;
  region: "Northeast" | "Southeast" | "Midwest" | "Southwest" | "West";
  ibc: { edition: string; notes: string; status: "adopted" | "amended" | "state-specific" | "pending" };
  iecc: { edition: string; notes: string; status: "adopted" | "amended" | "state-specific" | "pending" };
  ashrae901: { edition: string; notes: string; status: "adopted" | "amended" | "state-specific" | "pending" };
  flBuildingCode?: { edition: string; notes: string };
  autoDoorsNote: string;
  hvhzCounties?: string[];
  keyMarket?: boolean;
}

export const STATE_CODE_ADOPTIONS: StateCodeAdoption[] = [
  {
    stateCode: "FL",
    stateName: "Florida",
    region: "Southeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Adopted via FBC 8th Ed (effective Dec 31 2023). FBC 9th Ed (IBC 2024 basis) takes effect Dec 31 2026.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "FBC 8th Ed Energy Volume. FBC 9th Ed energy provisions effective Dec 31 2026.",
      status: "amended",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via FBC 8th Energy Volume referencing 90.1-2019.",
      status: "amended",
    },
    flBuildingCode: {
      edition: "FBC 9th Ed (Dec 31 2026)",
      notes: "IBC 2024 basis. Critical transition for automatic door specifications — wind load, HVHZ, and energy compliance requirements update.",
    },
    autoDoorsNote: "HVHZ requirements (Miami-Dade, Broward) mandate NOA compliance for automatic doors. FBC 9th transition Dec 31 2026 affects SL500 R104/R128 and Windcord 5400/5500. Energy vestibule provisions update with FBC 9th. Wind-borne debris region rules stricter than IBC base.",
    hvhzCounties: ["Miami-Dade", "Broward", "Palm Beach (partial)", "Monroe"],
    keyMarket: true,
  },
  {
    stateCode: "CA",
    stateName: "California",
    region: "West",
    ibc: {
      edition: "CBC 2022 (IBC 2021 basis)",
      notes: "California Building Code Title 24 Part 2. IBC 2021 + extensive CA amendments. Effective Jan 1 2023.",
      status: "state-specific",
    },
    iecc: {
      edition: "Title 24 Part 6 (2022)",
      notes: "California Energy Code — stricter than IECC 2021. Effective Jan 1 2023.",
      status: "state-specific",
    },
    ashrae901: {
      edition: "Title 24 Part 6 (ASHRAE 90.1-2019 influenced)",
      notes: "CalGreen (Part 11) adds mandatory sustainability requirements beyond 90.1. Title 24 Part 6 governs commercial energy.",
      status: "state-specific",
    },
    autoDoorsNote: "Title 24 Part 6 vestibule requirements apply in climate zones 1-16 with specific door-type exemptions. Automatic sliding doors in high-traffic entries may qualify for vestibule exemption with air curtain compliance. Seismic Zone D requirements affect door frame anchoring specifications.",
    keyMarket: true,
  },
  {
    stateCode: "TX",
    stateName: "Texas",
    region: "Southwest",
    ibc: {
      edition: "IBC 2021 (local adoption)",
      notes: "No statewide commercial building code. Municipalities adopt locally — most major cities on IBC 2021. TDLR governs accessibility statewide.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2015",
      notes: "Texas adopted IECC 2015 for commercial energy statewide via SECO. Has not adopted IECC 2018/2021/2024 at state level.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2013",
      notes: "Referenced by IECC 2015 commercial provisions. Local jurisdictions may adopt newer editions.",
      status: "adopted",
    },
    autoDoorsNote: "No statewide building code creates jurisdiction-by-jurisdiction variation. Dallas, Houston, Austin, San Antonio each adopt codes independently. TDLR accessibility requirements apply statewide for automatic door activation. Wind zone requirements apply in Gulf Coast counties (ASCE 7-16 wind maps).",
    keyMarket: true,
  },
  {
    stateCode: "NY",
    stateName: "New York",
    region: "Northeast",
    ibc: {
      edition: "IBC 2020 (NYS) / NYC BC 2022",
      notes: "NYS uses 2020 BCNYS (based on IBC 2018). NYC Building Code 2022 (IBC 2018 basis with local amendments) adopted 2022.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2016",
      notes: "NY Energy Conservation Construction Code based on IECC 2016. NYC has separate Appendix CA energy requirements.",
      status: "amended",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by NYS energy code. NYC may require 90.1-2019 compliance for certain project types.",
      status: "adopted",
    },
    autoDoorsNote: "NYC Local Law 97 (2019) energy performance requirements affect large commercial buildings — door air infiltration and vestibule provisions apply. NYC requires vestibules for buildings over 10,000 sf. Automatic revolving door provisions in NYC Building Code Section 1010. NYS accessibility code (ANSI A117.1) governs activation hardware.",
    keyMarket: true,
  },
  {
    stateCode: "IL",
    stateName: "Illinois",
    region: "Midwest",
    ibc: {
      edition: "IBC 2021",
      notes: "Illinois adopted IBC 2021. Chicago has own building code with local amendments (2022 Chicago Building Code).",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Illinois Energy Conservation Code based on IECC 2021. Effective January 2023.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Referenced by IECC 2021 commercial provisions. Illinois Commerce Commission applies 90.1-2019.",
      status: "adopted",
    },
    autoDoorsNote: "Chicago vestibule ordinance requires heated vestibules for all ground-floor commercial entries in buildings over 10,000 sf. IECC 2021 Section C402.5 air barrier requirements affect door frame specifications. Cold climate (Zone 5) demands higher door energy performance ratings.",
  },
  {
    stateCode: "GA",
    stateName: "Georgia",
    region: "Southeast",
    ibc: {
      edition: "IBC 2018",
      notes: "Georgia State Minimum Standard Codes adopted IBC 2018. Considering transition to IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2015",
      notes: "Georgia Energy Code based on IECC 2015 commercial provisions. DCA considering IECC 2021 adoption.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2013",
      notes: "Referenced by Georgia commercial energy code. Proposed update to 90.1-2019 pending state adoption.",
      status: "adopted",
    },
    autoDoorsNote: "IBC 2018 vestibule requirements apply in climate zones 3A (Atlanta metro). Coastal counties (Brunswick, Savannah) subject to wind-borne debris region requirements. Georgia has strong automatic door market in healthcare (Grady, Emory, Piedmont systems). ANSI A117.1-2009 accessibility requirements.",
  },
  {
    stateCode: "VA",
    stateName: "Virginia",
    region: "Southeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Virginia Construction Code (VCC) 2021 — based on IBC 2021 with Virginia amendments. Effective July 1 2023.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Virginia Energy Code 2021 — based on IECC 2021. Effective July 1 2023.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021 referencing 90.1-2019. DHCD enforces.",
      status: "adopted",
    },
    autoDoorsNote: "IECC 2021 Section C402.5 air barrier provisions apply. Virginia coastal areas (Virginia Beach, Hampton Roads) in wind-borne debris zone per ASCE 7-16. Northern Virginia (DC metro) has additional local amendments. Vestibule requirements per IBC 2021 Section 1013.",
  },
  {
    stateCode: "NC",
    stateName: "North Carolina",
    region: "Southeast",
    ibc: {
      edition: "IBC 2018",
      notes: "NC Building Code 2018 based on IBC 2018. NCBC 2021 in review process.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "NC Energy Conservation Code 2018. Includes modifications to commercial provisions.",
      status: "amended",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by NC commercial energy code via IECC 2018.",
      status: "adopted",
    },
    autoDoorsNote: "Coastal NC counties (Brunswick, New Hanover, Pender) subject to 130+ mph wind speed requirements per ASCE 7-16 — affects automatic door wind resistance ratings. IBC 2018 vestibule provisions apply in climate zone 4A (Piedmont region). Hurricane-resistant door specifications critical for Wilmington, Outer Banks projects.",
  },
  {
    stateCode: "WA",
    stateName: "Washington",
    region: "West",
    ibc: {
      edition: "IBC 2021",
      notes: "Washington State Building Code Council (SBCC) adopted IBC 2021 with Washington amendments. Effective Mar 15 2024.",
      status: "amended",
    },
    iecc: {
      edition: "WSEC 2021",
      notes: "Washington State Energy Code 2021 — one of the most stringent in the US. More aggressive than IECC 2021 baseline.",
      status: "state-specific",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019 (exceeded)",
      notes: "WSEC 2021 exceeds 90.1-2019 requirements. Commercial buildings must meet WSEC C-codes which are stricter.",
      status: "state-specific",
    },
    autoDoorsNote: "WSEC 2021 requires vestibules at all commercial entries in Climate Zones 5-6 (most of WA state). Strict air infiltration limits for automatic doors — WSEC C402.5 requires tested door assemblies. Seattle has additional local energy amendments. Seismic Zone D requirements affect door frame anchoring.",
  },
  {
    stateCode: "MA",
    stateName: "Massachusetts",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "9th Edition MA State Building Code based on IBC 2021. Effective Jan 1 2023.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "MA Energy Code 2021. Stretch Energy Code (Appendix RC/CC) available for municipalities — stricter than base IECC 2021.",
      status: "amended",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial compliance via IECC 2021. Stretch Code municipalities may require higher performance.",
      status: "adopted",
    },
    autoDoorsNote: "MA Stretch Energy Code (adopted by 300+ municipalities including Boston, Cambridge) imposes stricter door air infiltration limits. Climate Zone 5A vestibule requirements broadly apply. IECC 2021 Section C402.5 air barrier mandatory. Boston has highest concentration of Stretch Code jurisdictions — affects specification for commercial projects.",
  },
  {
    stateCode: "OH",
    stateName: "Ohio",
    region: "Midwest",
    ibc: {
      edition: "IBC 2017",
      notes: "Ohio Building Code based on IBC 2017. OBC 2020 (IBC 2018 basis) adopted for some occupancies.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2017",
      notes: "Ohio Energy Code based on IECC 2017 commercial provisions.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Ohio commercial energy code.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 5A (most of OH) — vestibule requirements apply per IECC 2017. Ohio has large healthcare and commercial construction market (Cleveland Clinic, OhioHealth). Automatic door activation requirements under OBC accessibility provisions.",
  },
  {
    stateCode: "PA",
    stateName: "Pennsylvania",
    region: "Northeast",
    ibc: {
      edition: "IBC 2018",
      notes: "Pennsylvania Construction Code Act (Uniform Construction Code) adopted IBC 2018. Philadelphia has own amendments.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Pennsylvania Energy Code based on IECC 2018 commercial provisions.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Pennsylvania commercial energy code.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zones 4A-5A across PA — vestibule requirements apply in most commercial applications. Philadelphia commercial corridor has significant automatic door specification volume. IECC 2018 air infiltration requirements for door assemblies apply statewide.",
  },
  {
    stateCode: "MI",
    stateName: "Michigan",
    region: "Midwest",
    ibc: {
      edition: "IBC 2021",
      notes: "Michigan Building Code 2021 (MBC 2021) adopted. Effective November 2023.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Michigan Energy Code based on IECC 2021. Effective November 2023.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021 referencing 90.1-2019.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 5A (southern MI) and 6A (northern MI) — vestibule requirements broadly apply. IECC 2021 Section C402.5 air barrier mandates tested door assemblies. Detroit/Grand Rapids commercial markets have strong automatic door demand. Winter climate performance critical for door specifications.",
  },
  {
    stateCode: "NJ",
    stateName: "New Jersey",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "New Jersey Uniform Construction Code adopted IBC 2021 with NJ amendments. Effective July 2022.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "New Jersey Energy Subcode based on IECC 2021. Effective July 2022.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021 referencing 90.1-2019.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 4A — vestibule requirements apply per IECC 2021. Coastal NJ (Atlantic City, Cape May) subject to wind-borne debris zone requirements from ASCE 7-16. Dense commercial construction in NJ Transit corridors. IECC 2021 air infiltration limits require tested door assemblies.",
  },
  {
    stateCode: "AZ",
    stateName: "Arizona",
    region: "Southwest",
    ibc: {
      edition: "IBC 2018",
      notes: "International Building Code 2018 adopted by Arizona. Local jurisdictions may adopt newer editions.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Arizona adopts IECC 2018 for commercial energy. Phoenix and Tucson have local amendments.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by commercial energy provisions. Hot-arid climate (Zone 2B/3B) reduces vestibule demand.",
      status: "adopted",
    },
    autoDoorsNote: "Hot-arid climate zones (2B Phoenix, 3B Tucson) — vestibule requirements less common due to cooling-dominant climate. However, IECC 2018 air leakage provisions still apply. Automatic door sealing critical for energy performance in extreme heat. Desert dust infiltration requires robust door seal specifications.",
  },
  {
    stateCode: "CO",
    stateName: "Colorado",
    region: "West",
    ibc: {
      edition: "IBC 2021",
      notes: "Colorado adopted IBC 2021. Denver has own building code with local amendments.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Colorado Energy Code based on IECC 2021. Effective 2023.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Referenced by Colorado commercial energy code.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 5B (Denver/Front Range) — vestibule requirements apply. High altitude and extreme temperature swings affect door seal performance. Colorado Green Building adoption increasing — energy code strictness growing. Denver International Airport sets automatic door performance benchmark for CO market.",
  },
  {
    stateCode: "TN",
    stateName: "Tennessee",
    region: "Southeast",
    ibc: {
      edition: "IBC 2018",
      notes: "Tennessee Building Codes adopted IBC 2018. Tennessee does not have mandatory statewide building code for all occupancies.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Tennessee Energy Code based on IECC 2018 for commercial.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Tennessee commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Mixed climate (Zone 3A-4A) across TN — vestibule requirements apply in Zone 4A (Nashville, Knoxville). Memphis (Zone 3A) has lower vestibule demand. Strong healthcare construction market (Vanderbilt, HCA Healthcare HQ Nashville). Tornado wind zone provisions apply per ASCE 7-16.",
  },
  {
    stateCode: "MD",
    stateName: "Maryland",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Maryland Building Performance Standards adopted IBC 2021. Effective January 2023.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Maryland Building Energy Performance Standards based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 4A — vestibule requirements apply. Baltimore and DC-metro areas have high commercial construction density. Maryland Chesapeake Bay coastal areas subject to wind-borne debris zone requirements. IECC 2021 air infiltration mandates tested door assemblies.",
  },
  {
    stateCode: "MN",
    stateName: "Minnesota",
    region: "Midwest",
    ibc: {
      edition: "IBC 2020",
      notes: "Minnesota State Building Code adopted IBC 2018 (published as 2020 MSBC). Amendments pending for IBC 2021.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Minnesota Commercial Energy Code based on IECC 2018 with Minnesota amendments.",
      status: "amended",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Minnesota commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 6A (southern MN) and 7 (northern MN) — vestibule requirements mandatory for virtually all commercial entries. Extreme cold climate demands highest door insulation and air-seal ratings. Air infiltration performance critical — Minnesota has some of the coldest commercial conditions in US. Minneapolis skyway system creates unique automatic door specification requirements.",
  },
  {
    stateCode: "OR",
    stateName: "Oregon",
    region: "West",
    ibc: {
      edition: "IBC 2021",
      notes: "Oregon Structural Specialty Code 2022 based on IBC 2021. Effective October 2022.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2021 / OEESC",
      notes: "Oregon Energy Efficiency Specialty Code 2021 based on IECC 2021 with Oregon amendments.",
      status: "amended",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Referenced by Oregon commercial energy code.",
      status: "adopted",
    },
    autoDoorsNote: "Climate zones vary (4C Portland, 5B eastern OR) — vestibule requirements apply in Zone 4C and above. Oregon has aggressive energy reduction goals affecting door performance specifications. Portland and Eugene have additional local energy amendments. Seismic Zone D3 (Cascadia subduction zone) — significant door frame structural requirements.",
  },
  {
    stateCode: "WI",
    stateName: "Wisconsin",
    region: "Midwest",
    ibc: {
      edition: "IBC 2015",
      notes: "Wisconsin Commercial Building Code based on IBC 2015. DHS reviewing IBC 2021 adoption.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2015",
      notes: "Wisconsin Energy Code based on IECC 2015 commercial provisions.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2013",
      notes: "Referenced by Wisconsin commercial energy code via IECC 2015.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 6A — vestibule requirements mandatory for most commercial entries. Extreme winter conditions (Milwaukee, Green Bay) demand highest door air-seal performance. Older code base (IBC 2015) means some newer automatic door energy provisions not yet required, but high-performance specs still recommended.",
  },
  {
    stateCode: "MO",
    stateName: "Missouri",
    region: "Midwest",
    ibc: {
      edition: "IBC 2018",
      notes: "Missouri does not have a statewide building code. St. Louis and Kansas City adopt locally — both on IBC 2018.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Missouri Energy Code based on IECC 2018. St. Louis City has additional local energy requirements.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by commercial energy provisions in Missouri jurisdictions.",
      status: "adopted",
    },
    autoDoorsNote: "Mixed climate (Zone 4A St. Louis, 5A Kansas City) — vestibule requirements apply in both markets. No statewide code creates jurisdiction variation. Tornado Alley location — wind provisions per ASCE 7-16 apply. Large retail and healthcare construction markets in KC and STL metros.",
  },
  {
    stateCode: "NV",
    stateName: "Nevada",
    region: "West",
    ibc: {
      edition: "IBC 2018",
      notes: "Nevada Revised Statutes adopt IBC 2018. Clark County (Las Vegas) has own amendments. Washoe County (Reno) adopts separately.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Nevada Energy Code based on IECC 2018 commercial provisions.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Nevada commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Hot-arid climate (Zone 3B Las Vegas) — vestibule requirements less common. Desert heat and dust require robust door sealing for cooling energy efficiency. Casino/hospitality sector dominates automatic door market in Las Vegas — high-traffic, high-performance applications. Reno (Zone 5B) has vestibule requirements.",
  },
  {
    stateCode: "SC",
    stateName: "South Carolina",
    region: "Southeast",
    ibc: {
      edition: "IBC 2018",
      notes: "South Carolina Building Codes adopted IBC 2018. SCbuildingcodes.org governs adoption.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2015",
      notes: "South Carolina Energy Conservation Code based on IECC 2015.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2013",
      notes: "Referenced by South Carolina commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Coastal SC (Myrtle Beach, Hilton Head, Charleston) subject to wind-borne debris zone requirements — 120+ mph design wind speeds per ASCE 7-16. Hurricane door ratings critical for coastal projects. IBC 2018 provisions apply. Mixed climate (Zone 3A) — vestibule requirements less common inland.",
  },
  {
    stateCode: "AL",
    stateName: "Alabama",
    region: "Southeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Alabama Building Commission adopted IBC 2021. Effective January 2024.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Alabama Energy Code based on IECC 2021. Effective January 2024.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021.",
      status: "adopted",
    },
    autoDoorsNote: "Gulf Coast counties (Mobile, Baldwin) subject to wind-borne debris zone requirements. Warm humid climate (Zone 2A/3A) — vestibule requirements limited. IECC 2021 air leakage provisions apply. Tornado risk (ASCE 7-16 wind provisions). Growing commercial construction in Huntsville, Birmingham, and Gulf Coast.",
  },
  {
    stateCode: "LA",
    stateName: "Louisiana",
    region: "Southeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Louisiana State Uniform Construction Code adopted IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Louisiana Energy Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021.",
      status: "adopted",
    },
    autoDoorsNote: "Gulf Coast location — entire southern Louisiana coastline subject to 130+ mph wind-borne debris zone requirements (post-Katrina/Ida provisions). New Orleans and coastal parishes require hurricane-rated automatic door assemblies. Hot-humid climate (Zone 2A) — vestibule requirements minimal. Storm surge and flood provisions affect ground-floor door specifications.",
  },
  {
    stateCode: "KY",
    stateName: "Kentucky",
    region: "Southeast",
    ibc: {
      edition: "IBC 2018",
      notes: "Kentucky Building Code adopted IBC 2018. Louisville and Lexington adopt independently.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Kentucky Energy Code based on IECC 2018.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Kentucky commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Mixed climate (Zone 4A) — vestibule requirements apply per IECC 2018. Strong healthcare and distribution center construction markets. Louisville airport corridor has significant commercial door specification volume. Tornado risk (ASCE 7-16 provisions apply).",
  },
  {
    stateCode: "OK",
    stateName: "Oklahoma",
    region: "Southwest",
    ibc: {
      edition: "IBC 2021",
      notes: "Oklahoma adopted IBC 2021. Oklahoma City and Tulsa adopt independently with local amendments.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Oklahoma Energy Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Referenced by Oklahoma commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Tornado Alley — ASCE 7-16 wind provisions apply statewide. Extreme wind events require storm-rated automatic door assemblies for critical facilities. Mixed climate (Zone 3A-4A) — vestibule requirements in northern OK. Strong energy sector (oil and gas) office construction market in OKC and Tulsa.",
  },
  {
    stateCode: "CT",
    stateName: "Connecticut",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Connecticut State Building Code adopted IBC 2021. Effective October 2022.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Connecticut Energy Code based on IECC 2021. Effective October 2022.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 5A — vestibule requirements apply. IECC 2021 air barrier and infiltration provisions mandate tested door assemblies. Coastal CT subject to 115+ mph wind design speeds per ASCE 7-16. Hartford and New Haven commercial corridors have significant automatic door specification volume.",
  },
  {
    stateCode: "UT",
    stateName: "Utah",
    region: "West",
    ibc: {
      edition: "IBC 2021",
      notes: "Utah State Construction Code adopted IBC 2021. Effective January 2023.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Utah Energy Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Referenced by Utah commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "High desert climate (Zone 5B Salt Lake City) — vestibule requirements apply. Seismic Zone D (Wasatch Front) — door frame structural requirements significant. Salt Lake City metro has strong commercial construction growth. Winter inversion events create extreme temperature differentials requiring high-performance door seals.",
  },
  {
    stateCode: "IA",
    stateName: "Iowa",
    region: "Midwest",
    ibc: {
      edition: "IBC 2021",
      notes: "Iowa State Building Code adopted IBC 2021. Effective 2023.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Iowa Energy Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Referenced by Iowa commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 5A/6A — vestibule requirements apply broadly. Cold winters demand high door insulation performance. Data center construction corridor (I-80) creates specialized automatic door requirements. Tornado risk per ASCE 7-16.",
  },
  {
    stateCode: "AR",
    stateName: "Arkansas",
    region: "Southeast",
    ibc: {
      edition: "IBC 2018",
      notes: "Arkansas Fire Prevention Code and building standards reference IBC 2018.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Arkansas Energy Code based on IECC 2018.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Arkansas commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Mixed climate (Zone 3A) — vestibule requirements limited. Tornado risk statewide (ASCE 7-16). Growing industrial and logistics construction market in NW Arkansas (Walmart, Tyson corridor). River valley humidity requires corrosion-resistant door hardware.",
  },
  {
    stateCode: "MS",
    stateName: "Mississippi",
    region: "Southeast",
    ibc: {
      edition: "IBC 2018",
      notes: "Mississippi State Building Code based on IBC 2018. Coastal counties under stricter Gulf Coast provisions.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2015",
      notes: "Mississippi Energy Code based on IECC 2015.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2013",
      notes: "Referenced by Mississippi commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Gulf Coast counties (Hancock, Harrison, Jackson) subject to 130+ mph wind-borne debris zone requirements. Hurricane-rated automatic door assemblies required for coastal projects. Hot-humid climate (Zone 2A) — vestibule requirements minimal. Post-Katrina coastal construction standards are stringent.",
  },
  {
    stateCode: "KS",
    stateName: "Kansas",
    region: "Midwest",
    ibc: {
      edition: "IBC 2018",
      notes: "Kansas State Building Code based on IBC 2018. Municipalities adopt independently — Wichita and Kansas City (KS) on IBC 2018.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Kansas Energy Code based on IECC 2018.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Kansas commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Tornado Alley center — ASCE 7-16 extreme wind provisions. Mixed climate (Zone 4A/5A) — vestibule requirements in northern and central KS. Aviation/aerospace industry in Wichita creates specialized facility door requirements. Strong agricultural facility automatic door market.",
  },
  {
    stateCode: "NM",
    stateName: "New Mexico",
    region: "Southwest",
    ibc: {
      edition: "IBC 2018",
      notes: "New Mexico Construction Industries Division adopted IBC 2018.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "New Mexico Energy Conservation Code based on IECC 2018.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by New Mexico commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "High desert climate (Zone 4B Albuquerque, 3B Las Cruces) — vestibule requirements in Zone 4B+. Significant altitude variation (5,000-7,500 ft) affects door seal performance. Native American tribal jurisdictions have separate code authority. Albuquerque and Santa Fe commercial construction have moderate automatic door demand.",
  },
  {
    stateCode: "NE",
    stateName: "Nebraska",
    region: "Midwest",
    ibc: {
      edition: "IBC 2018",
      notes: "Nebraska State Building Code based on IBC 2018. Omaha and Lincoln adopt independently.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Nebraska Energy Code based on IECC 2018.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Nebraska commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 5A — vestibule requirements apply. Tornado and extreme wind events (ASCE 7-16). Omaha's financial/healthcare corridor is a key automatic door market. Winter temperature extremes require high door insulation performance.",
  },
  {
    stateCode: "WV",
    stateName: "West Virginia",
    region: "Southeast",
    ibc: {
      edition: "IBC 2018",
      notes: "West Virginia State Fire Code and building standards reference IBC 2018.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "West Virginia Energy Code based on IECC 2018.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by West Virginia commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Mixed climate (Zone 4A/5A) — vestibule requirements in most commercial applications. Mountainous terrain creates extreme wind exposure for some sites. Limited large commercial construction — healthcare (WVUH, Charleston Area Medical) is primary automatic door market.",
  },
  {
    stateCode: "ID",
    stateName: "Idaho",
    region: "West",
    ibc: {
      edition: "IBC 2021",
      notes: "Idaho Division of Building Safety adopted IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Idaho Energy Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Referenced by Idaho commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "High desert and mountain climate (Zone 5B/6B Boise, 7 northern ID) — vestibule requirements broadly apply. Seismic Zone D (southern ID). Boise metro rapid growth driving commercial construction. Extreme temperature differentials require high door seal performance.",
  },
  {
    stateCode: "HI",
    stateName: "Hawaii",
    region: "West",
    ibc: {
      edition: "IBC 2018",
      notes: "Hawaii State Building Code based on IBC 2018 with Hawaii amendments. Each county (Honolulu, Maui, Hawaii, Kauai) has own adoption.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Hawaii Energy Code based on IECC 2018 with amendments for tropical climate.",
      status: "amended",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Hawaii has unique energy requirements due to tropical climate — cooling-dominant provisions take precedence.",
      status: "amended",
    },
    autoDoorsNote: "Tropical climate — no vestibule heating requirements. Hurricane wind provisions mandatory (130+ mph design speeds per ASCE 7-16 for coastal areas). Corrosion resistance critical for all door hardware — salt air environment requires stainless or coated components. Honolulu high-rise commercial projects have significant automatic door specifications.",
  },
  {
    stateCode: "ME",
    stateName: "Maine",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Maine Uniform Building and Energy Code (MUBEC) adopted IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "MUBEC energy provisions based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 6A/7 — vestibule requirements mandatory for virtually all commercial entries. Extreme cold winters demand highest door insulation and air-seal performance. Coastal Maine subject to 115+ mph wind provisions. Limited large commercial construction — Portland metro is primary market.",
  },
  {
    stateCode: "NH",
    stateName: "New Hampshire",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "New Hampshire Building Code adopted IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "New Hampshire Energy Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 6A — vestibule requirements mandatory. IECC 2021 air infiltration limits require tested door assemblies. Manchester-Nashua corridor is primary commercial market. Extreme winter performance is critical specification factor.",
  },
  {
    stateCode: "RI",
    stateName: "Rhode Island",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Rhode Island State Building Code adopted IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Rhode Island Energy Conservation Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 5A — vestibule requirements apply. Coastal exposure requires wind and corrosion resistance provisions. Small state with concentrated Providence commercial market. IECC 2021 air barrier mandates tested door assemblies.",
  },
  {
    stateCode: "MT",
    stateName: "Montana",
    region: "West",
    ibc: {
      edition: "IBC 2021",
      notes: "Montana Building Codes Program adopted IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Montana Energy Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Referenced by Montana commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Cold climate (Zone 6B Billings, 7 northern MT) — vestibule requirements broadly apply. Extreme winter conditions (temperatures to -40F) demand highest door insulation. Limited commercial construction volume — Billings and Missoula are primary markets. Mining and energy industry facilities are significant automatic door customers.",
  },
  {
    stateCode: "DE",
    stateName: "Delaware",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Delaware State Fire Prevention Regulations and Building Code adopted IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Delaware Energy Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 4A — vestibule requirements apply. Coastal DE (Rehoboth, Lewes) subject to wind-borne debris zone provisions. Wilmington financial district is primary commercial market. IECC 2021 air infiltration limits apply.",
  },
  {
    stateCode: "SD",
    stateName: "South Dakota",
    region: "Midwest",
    ibc: {
      edition: "IBC 2018",
      notes: "South Dakota Building Codes are primarily locally adopted. Sioux Falls and Rapid City on IBC 2018.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "South Dakota Energy Code based on IECC 2018.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by South Dakota commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Cold climate (Zone 6A/7) — vestibule requirements broadly apply. Extreme winter conditions. Tornado risk statewide (ASCE 7-16). Limited commercial construction — Sioux Falls is primary market. Agricultural and tribal facility automatic door requirements.",
  },
  {
    stateCode: "ND",
    stateName: "North Dakota",
    region: "Midwest",
    ibc: {
      edition: "IBC 2018",
      notes: "North Dakota State Building Code based on IBC 2018.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "North Dakota Energy Code based on IECC 2018.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by North Dakota commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Coldest commercial climate in the US (Zone 7) — vestibule requirements mandatory. Extreme temperature performance critical. Energy sector (Bakken oil) and healthcare are primary automatic door markets. Wind provisions per ASCE 7-16 for open prairie exposure.",
  },
  {
    stateCode: "AK",
    stateName: "Alaska",
    region: "West",
    ibc: {
      edition: "IBC 2021",
      notes: "Alaska Statutes adopt IBC 2021. Municipalities adopt independently — Anchorage and Fairbanks have local amendments.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Alaska Energy Conservation Code based on IECC 2021 with Alaska climate amendments.",
      status: "amended",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Commercial energy compliance via IECC 2021. Alaska climate zones (7/8) among coldest in the world.",
      status: "adopted",
    },
    autoDoorsNote: "Most extreme climate conditions in the US (Zone 7-8 Fairbanks reaches -60F) — vestibule requirements critical and often exceed code minimums. Door air infiltration at extreme temperatures requires specialized testing and product selection. Seismic Zone D-E throughout much of Alaska — door frame anchoring provisions critical. Limited but critical commercial construction in Anchorage metro.",
  },
  {
    stateCode: "VT",
    stateName: "Vermont",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "Vermont Fire and Building Safety Code adopted IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Vermont Commercial Building Energy Standards based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Vermont requires commercial compliance with 90.1-2019 per IECC 2021.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 6A/7 — vestibule requirements mandatory. Very cold winters. Limited commercial construction — Burlington metro is primary market. Vermont Comprehensive Energy Plan drives aggressive energy efficiency — door air infiltration specifications are important. Ski resort and hospitality facilities are specialized automatic door customers.",
  },
  {
    stateCode: "WY",
    stateName: "Wyoming",
    region: "West",
    ibc: {
      edition: "IBC 2021",
      notes: "Wyoming Building Codes adopted IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "Wyoming Energy Code based on IECC 2021.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "Referenced by Wyoming commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Cold and high-altitude climate (Zone 6B/7 — Cheyenne 6,062 ft, Casper 5,150 ft) — vestibule requirements apply. Extreme wind (some of highest average wind speeds in the US) requires storm-rated door assemblies. Oil and gas industry facilities are primary commercial automatic door customers.",
  },
  {
    stateCode: "IN",
    stateName: "Indiana",
    region: "Midwest",
    ibc: {
      edition: "IBC 2020",
      notes: "Indiana Building Code based on IBC 2018 (published as IBC 2020 IN edition). Reviewing IBC 2021.",
      status: "adopted",
    },
    iecc: {
      edition: "IECC 2018",
      notes: "Indiana Energy Conservation Code based on IECC 2018.",
      status: "adopted",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2016",
      notes: "Referenced by Indiana commercial energy provisions.",
      status: "adopted",
    },
    autoDoorsNote: "Climate Zone 5A — vestibule requirements apply. Indianapolis is a major commercial construction market. Industrial and distribution center automatic door demand is high. Tornado risk (ASCE 7-16 provisions).",
  },
  {
    stateCode: "DC",
    stateName: "District of Columbia",
    region: "Northeast",
    ibc: {
      edition: "IBC 2021",
      notes: "DC Building Code 2021 based on IBC 2021 with DC amendments. Administered by DCRA.",
      status: "amended",
    },
    iecc: {
      edition: "IECC 2021",
      notes: "DC Energy Conservation Code 2021. DC has adopted Green Building Act requirements exceeding IECC baseline.",
      status: "amended",
    },
    ashrae901: {
      edition: "ASHRAE 90.1-2019",
      notes: "DC Green Building Act mandates 90.1-2019 compliance plus DC-specific energy performance benchmarks (BEPS).",
      status: "amended",
    },
    autoDoorsNote: "Climate Zone 4A — vestibule requirements apply. DC Green Building Act and Building Energy Performance Standards (BEPS) impose strict air infiltration requirements on commercial buildings. Federal building projects (GSA) require additional security provisions for automatic door hardware. Dense urban commercial construction with high automatic door specification volume.",
  },
];