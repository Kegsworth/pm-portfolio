import { useState, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  DoorOpen,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  ExternalLink,
  Zap,
  Shield,
  FileText,
  Tag,
  MapPin,
  Building2,
  Settings,
  Copy,
  Check,
  ClipboardCopy,
  Filter,
  Award,
  Ruler,
  HardHat,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  runComplianceCheck,
  generateSpecSheet,
  getForceTimingSpecs,
  getSensorSpecs,
  getSignageRequirements,
  getGuideRailSpec,
  evaluateFloridaHVHZ,
  evaluateIECCVestibule,
  evaluateEgressCompliance,
  evaluateADACompliance,
  CODE_REFERENCES,
  type DoorConfig,
  type DoorType,
  type EnergyClass,
  type County,
  type OccupancyType,
  DOOR_TYPE_LABELS,
  ENERGY_CLASS_LABELS,
  COUNTY_LABELS,
  OCCUPANCY_LABELS,
  type SpecSheet,
  type ComplianceResult,
  type EnhancedProduct,
  type IECCVestibuleResult,
  type EgressComplianceResult,
  type ADAComplianceResult,
  getAAADMRequirement,
  getAAADMChecklist,
  getArchSpec,
  type AAADMChecklistItem,
} from "@/lib/compliance";

// ── Theme toggle ────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", dark);
  }
  return { dark, toggle };
}

// ── Door type metadata ───────────────────────────────────────────────────────
const DOOR_META: Record<DoorType, { desc: string; standard: string; icon: React.ReactNode }> = {
  sliding: {
    desc: "Horizontal sliding panels — retail, hospital, commercial entrances",
    standard: "ANSI/BHMA A156.10-2024",
    icon: <DoorOpen size={18} />,
  },
  swinging: {
    desc: "Single or double swing — offices, vestibules, interior openings",
    standard: "A156.10-2024 / A156.19-2019",
    icon: <DoorOpen size={18} />,
  },
  folding: {
    desc: "Accordion or bi-fold — space-saving, high-traffic corridors",
    standard: "A156.10-2024 / A156.38-2019",
    icon: <DoorOpen size={18} />,
  },
  revolving: {
    desc: "Rotating compartment — hotels, airports, energy-conserving lobbies",
    standard: "ANSI/BHMA A156.27-2024",
    icon: <DoorOpen size={18} />,
  },
  telescoping: {
    desc: "Multi-panel telescoping — wide openings, transit, industrial",
    standard: "ANSI/BHMA A156.10-2024",
    icon: <DoorOpen size={18} />,
  },
  hermetic: {
    desc: "Pressure-sealed, airtight — cleanrooms, operating suites",
    standard: "A156.10-2024 + FGI 2022",
    icon: <Shield size={18} />,
  },
  ICU: {
    desc: "ICU / Patient Room — healthcare traffic control, infection prevention",
    standard: "A156.10-2024 + FGI 2022",
    icon: <Shield size={18} />,
  },
  power_assist: {
    desc: "Motor-reduced opening force — accessibility at low-traffic entrances",
    standard: "ANSI/BHMA A156.19-2019 §3",
    icon: <Zap size={18} />,
  },
};

// Energy class options per door type
const ENERGY_COMPAT: Record<EnergyClass, { label: string; desc: string; applicableTo: DoorType[]; note?: string }> = {
  full_energy: {
    label: "Full Energy",
    desc: "Sensor-activated, high-speed — most common for commercial and healthcare. Governed by A156.10-2024.",
    applicableTo: ["sliding", "swinging", "folding", "revolving", "telescoping", "hermetic", "ICU"],
  },
  low_energy: {
    label: "Low Energy",
    desc: "Knowing-act activation (push plate, wave) — accessibility use at lower traffic. A156.19-2019 (swinging) / A156.38-2019 (sliding/folding).",
    applicableTo: ["sliding", "swinging", "folding", "telescoping"],
  },
  power_assist: {
    label: "Power Assist",
    desc: "Motor reduces push force only — not automatic. A156.19-2019 §3. Ideal for ADA path of travel at residential or office entrances.",
    applicableTo: ["swinging", "folding", "power_assist"],
    note: "A156.19-2019 §3 healthcare provisions apply when used in patient areas.",
  },
};

// Florida counties (non-HVHZ, abbreviated list)
const FL_COUNTIES = [
  "Alachua","Baker","Bay","Bradford","Brevard","Broward","Calhoun","Charlotte","Citrus",
  "Clay","Collier","Columbia","DeSoto","Dixie","Duval","Escambia","Flagler","Franklin",
  "Gadsden","Gilchrist","Glades","Gulf","Hamilton","Hardee","Hendry","Hernando","Highlands",
  "Hillsborough","Holmes","Indian River","Jackson","Jefferson","Lafayette","Lake","Lee",
  "Leon","Levy","Liberty","Madison","Manatee","Marion","Martin","Miami-Dade","Monroe",
  "Nassau","Okaloosa","Okeechobee","Orange","Osceola","Palm Beach","Pasco","Pinellas",
  "Polk","Putnam","Saint Johns","Saint Lucie","Santa Rosa","Sarasota","Seminole","Sumter",
  "Suwannee","Taylor","Union","Volusia","Wakulla","Walton","Washington",
];

// Map FL county display name to County type
function toCounty(countyName: string): County {
  if (countyName === "Miami-Dade") return "miami_dade";
  if (countyName === "Broward") return "broward";
  if (countyName === "Palm Beach") return "palm_beach";
  if (countyName === "Monroe") return "monroe";
  if (countyName === "") return "non_florida";
  return "other_florida";
}

// Occupancy display options
type OccupancyUI = { value: OccupancyType; label: string; desc: string };
const OCCUPANCY_OPTIONS: OccupancyUI[] = [
  { value: "A", label: "Assembly (A)", desc: "Theaters, restaurants, houses of worship" },
  { value: "M", label: "Mercantile (M)", desc: "Retail, stores, malls — high public traffic" },
  { value: "I", label: "Institutional (I)", desc: "Hospitals, healthcare, detention" },
  { value: "B", label: "Business (B)", desc: "Offices, banks, clinics" },
  { value: "E", label: "Educational (E)", desc: "Schools, daycare" },
  { value: "R1", label: "Residential Transient (R-1)", desc: "Hotels, motels" },
  { value: "other", label: "Other", desc: "Industrial, utility, or other occupancy" },
];

// Traffic volume options
const TRAFFIC_OPTIONS = [
  { value: "low", label: "Low", desc: "< 100 cycles/day" },
  { value: "medium", label: "Medium", desc: "100–500 cycles/day" },
  { value: "high", label: "High", desc: "500–2,000 cycles/day" },
  { value: "very_high", label: "Very High", desc: "> 2,000 cycles/day" },
];

// ── Shared UI components ────────────────────────────────────────────────────

function OptionCard({
  label,
  sublabel,
  badge,
  selected,
  onClick,
  icon,
  testId,
  disabled,
  dimmed,
}: {
  label: string;
  sublabel?: string;
  badge?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  testId?: string;
  disabled?: boolean;
  dimmed?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      data-testid={testId}
      disabled={disabled}
      className={`w-full text-left p-3.5 rounded-lg border transition-all duration-150 ${
        disabled
          ? "border-border bg-muted/30 opacity-40 cursor-not-allowed"
          : dimmed
          ? "border-border bg-card opacity-60 hover:opacity-80 hover:border-primary/30"
          : selected
          ? "border-primary bg-primary/8 ring-1 ring-primary"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/50"
      }`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <span className={`mt-0.5 flex-shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`}>{icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}>{label}</div>
            {badge && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">{badge}</span>
            )}
          </div>
          {sublabel && <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{sublabel}</div>}
        </div>
        {selected && (
          <div className="ml-auto flex-shrink-0">
            <CheckCircle2 size={16} className="text-primary" />
          </div>
        )}
      </div>
    </button>
  );
}

function ToggleOption({
  label,
  sublabel,
  checked,
  onChange,
  id,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1 pr-4">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {sublabel && <div className="text-xs text-muted-foreground mt-0.5">{sublabel}</div>}
      </div>
      <button
        data-testid={`toggle-${id}`}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-primary" : "bg-muted"
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-primary">{icon}</span>}
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── Config state ─────────────────────────────────────────────────────────────

interface UIConfig {
  doorType: DoorType;
  energyClass: EnergyClass;
  isExterior: boolean;
  flCounty: string; // display name or "" for non-FL
  occupancyType: OccupancyType;
  trafficVolume: string;
  adaPathOfTravel: boolean;
  isFireRated: boolean;
  accessControl: boolean;
  cleanRoom: boolean;
}

const defaultConfig: UIConfig = {
  doorType: "sliding",
  energyClass: "full_energy",
  isExterior: true,
  flCounty: "Orange",
  occupancyType: "M",
  trafficVolume: "high",
  adaPathOfTravel: true,
  isFireRated: false,
  accessControl: false,
  cleanRoom: false,
};

function uiConfigToDoorConfig(ui: UIConfig): DoorConfig {
  const county = ui.flCounty ? toCounty(ui.flCounty) : "non_florida";
  const isHealthcare = ui.occupancyType === "I" || ui.doorType === "hermetic" || ui.doorType === "ICU";
  return {
    doorType: ui.doorType,
    energyClass: ui.energyClass,
    activationMethod: ui.energyClass === "full_energy" ? "sensor" : ui.energyClass === "power_assist" ? "knowing_act" : "knowing_act",
    county,
    occupancyType: ui.occupancyType,
    occupantLoad: ui.trafficVolume === "very_high" ? 2000 : ui.trafficVolume === "high" ? 800 : ui.trafficVolume === "medium" ? 200 : 50,
    isExterior: ui.isExterior,
    isEgressPath: true,
    isFireRated: ui.isFireRated,
    hasVestibule: false,
    isHealthcareFacility: isHealthcare,
    hasAccessControl: ui.accessControl,
  };
}

// ── Steps definition ─────────────────────────────────────────────────────────

const WIZARD_STEPS = [
  { id: "door-type", title: "Door Type", icon: <DoorOpen size={14} /> },
  { id: "energy-class", title: "Energy Class", icon: <Zap size={14} /> },
  { id: "location", title: "Location", icon: <MapPin size={14} /> },
  { id: "occupancy", title: "Occupancy", icon: <Building2 size={14} /> },
  { id: "requirements", title: "Requirements", icon: <Settings size={14} /> },
];

// ── AAADM Tab Component ──────────────────────────────────────────────────────

function AAADMTab({ doorType }: { doorType: DoorType }) {
  const req = getAAADMRequirement(doorType);
  const checklist = getAAADMChecklist();
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | "na" | "">>({});
  const [expandedMethods, setExpandedMethods] = useState<Record<string, boolean>>({});
  const { copied, copy } = useCopyText();

  const allItems: AAADMChecklistItem[] = checklist.flatMap(cat => cat.items);
  const totalItems = allItems.length;
  const passCount = allItems.filter(item => itemStatus[item.id] === "pass").length;
  const failCount = allItems.filter(item => itemStatus[item.id] === "fail").length;
  const naCount = allItems.filter(item => itemStatus[item.id] === "na").length;
  const assessedCount = passCount + failCount + naCount;

  const toggleMethod = (id: string) =>
    setExpandedMethods(prev => ({ ...prev, [id]: !prev[id] }));

  const setStatus = (id: string, status: "pass" | "fail" | "na" | "") =>
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? "" : status }));

  const exportReport = () => {
    const lines = [
      `AAADM Inspection Report — ${DOOR_TYPE_LABELS[doorType]}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      "",
      `Certification Required: ${req.certificationRequired ? "YES" : "NO (Recommended)"}`,
      `Who Must Be Certified: ${req.whoMustBeCertified}`,
      `Prerequisite: ${req.prerequisite}`,
      `Renewal: ${req.renewalFrequency}`,
      `Inspection Frequency: ${req.inspectionFrequency}`,
      "",
      "─── INSPECTION CHECKLIST ───",
      ...checklist.flatMap(cat => [
        "",
        `[${cat.category.toUpperCase()}]`,
        ...cat.items.map(item => {
          const s = itemStatus[item.id];
          const label = s === "pass" ? "[PASS]" : s === "fail" ? "[FAIL]" : s === "na" ? "[N/A]" : "[----]";
          return `${label} ${item.id}: ${item.item}\n       Standard: ${item.referenceStandard}\n       Criteria: ${item.passFailCriteria}`;
        })
      ]),
      "",
      `─── SUMMARY: ${passCount} passed / ${failCount} failed / ${naCount} N/A of ${totalItems} items ───`,
    ];
    copy(lines.join("\n"));
  };

  const certColor = req.certificationRequired
    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800"
    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800";

  return (
    <div className="flex flex-col gap-4">
      {/* Cert required banner */}
      <div className={`flex items-center gap-3 p-3 rounded-lg ${certColor}`}>
        <Award size={18} className="flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold">
            {req.certificationRequired ? "AAADM Certification Required" : "AAADM Certification Recommended (Not Mandatory)"}
          </div>
          <div className="text-xs mt-0.5 opacity-80">{req.certificationScope}</div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Who Must Be Certified</div>
          <div className="text-xs text-foreground">{req.whoMustBeCertified}</div>
        </div>
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Prerequisite</div>
          <div className="text-xs text-foreground">{req.prerequisite}</div>
        </div>
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Renewal Frequency</div>
          <div className="text-xs text-foreground">{req.renewalFrequency}</div>
        </div>
        <div className="p-3 bg-card border border-border rounded-lg">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Inspection Frequency</div>
          <div className="text-xs text-foreground">{req.inspectionFrequency}</div>
        </div>
      </div>

      {/* Mechanical exemption */}
      <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="text-[10px] font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-1">Mechanical-Only Exemption (What Facility Staff May Do)</div>
        <div className="text-xs text-green-800 dark:text-green-300">{req.mechanicalOnlyExemption}</div>
      </div>

      {/* Liability note */}
      <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
        <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-[10px] font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide mb-1">Liability Note</div>
          <div className="text-xs text-red-800 dark:text-red-300">{req.liabilityNote}</div>
        </div>
      </div>

      {/* Inspection Checklist */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={14} className="text-primary" />
            <span className="text-xs font-semibold text-foreground">AAADM Inspection Checklist</span>
          </div>
          <div className="flex items-center gap-2">
            {assessedCount > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {passCount} pass · {failCount} fail · {naCount} N/A
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[10px] px-2"
              onClick={exportReport}
              data-testid="btn-export-aaadm"
            >
              {copied ? <Check size={10} className="mr-1" /> : <ClipboardCopy size={10} className="mr-1" />}
              Export Report
            </Button>
          </div>
        </div>

        {checklist.map((cat) => (
          <div key={cat.category} className="border-b border-border last:border-b-0">
            <div className="px-3 py-1.5 bg-muted/30">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{cat.category}</span>
            </div>
            {cat.items.map((item) => {
              const status = itemStatus[item.id] || "";
              const expanded = expandedMethods[item.id];
              return (
                <div key={item.id} className="border-b border-border/50 last:border-b-0 p-2.5">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      data-testid={`chk-aaadm-${item.id}`}
                      className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 accent-primary"
                      checked={status === "pass"}
                      onChange={() => setStatus(item.id, "pass")}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs text-foreground leading-snug">{item.item}</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            data-testid={`toggle-aaadm-${item.id}`}
                            onClick={() => setStatus(item.id, "pass")}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors ${
                              status === "pass"
                                ? "bg-green-500 text-white"
                                : "bg-muted text-muted-foreground hover:bg-green-100 dark:hover:bg-green-900/30"
                            }`}
                          >
                            PASS
                          </button>
                          <button
                            onClick={() => setStatus(item.id, "fail")}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors ${
                              status === "fail"
                                ? "bg-red-500 text-white"
                                : "bg-muted text-muted-foreground hover:bg-red-100 dark:hover:bg-red-900/30"
                            }`}
                          >
                            FAIL
                          </button>
                          <button
                            onClick={() => setStatus(item.id, "na")}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors ${
                              status === "na"
                                ? "bg-slate-500 text-white"
                                : "bg-muted text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            N/A
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded">{item.referenceStandard}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">{item.id}</span>
                      </div>
                      <div className="mt-1">
                        <div className="text-[10px] text-muted-foreground">
                          <span className="font-semibold">Criteria:</span> {item.passFailCriteria}
                        </div>
                      </div>
                      {status === "fail" && (
                        <div className="mt-1.5 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-[10px] text-red-700 dark:text-red-300">
                          <span className="font-semibold">Action: </span>{item.failureAction}
                        </div>
                      )}
                      <button
                        onClick={() => toggleMethod(item.id)}
                        className="flex items-center gap-1 mt-1 text-[10px] text-primary/60 hover:text-primary transition-colors"
                      >
                        {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                        {expanded ? "Hide" : "Show"} test method
                      </button>
                      {expanded && (
                        <div className="mt-1 p-2 bg-muted/40 rounded text-[10px] text-muted-foreground">
                          <span className="font-semibold">Test method:</span> {item.testMethod}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Summary bar */}
        {assessedCount > 0 && (
          <div className="px-3 py-2 bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-green-600 font-semibold">{passCount} passed</span>
              <span className="text-red-500 font-semibold">{failCount} failed</span>
              <span className="text-muted-foreground">{naCount} N/A</span>
              <span className="text-muted-foreground">of {totalItems} total</span>
            </div>
            {failCount === 0 && assessedCount === totalItems && (
              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> All items resolved — eligible for certificate
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Arch Specs Tab Component ──────────────────────────────────────────────────

function ArchSpecsTab({ doorType }: { doorType: DoorType }) {
  const spec = getArchSpec(doorType);
  const [cowIn, setCowIn] = useState("");
  const [doorHeightIn, setDoorHeightIn] = useState("");
  const { copied, copy } = useCopyText();

  const cowNum = parseFloat(cowIn);
  const heightNum = parseFloat(doorHeightIn);
  const roughWidth = !isNaN(cowNum) ? (cowNum + 8).toFixed(1) + " in. (" + ((cowNum + 8) / 12).toFixed(2) + " ft)" : null;
  const roughHeight = !isNaN(heightNum) ? (heightNum + 10).toFixed(1) + " in. (" + ((heightNum + 10) / 12).toFixed(2) + " ft)" : null;

  return (
    <div className="flex flex-col gap-4">
      {/* CSI Section badge */}
      <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <HardHat size={16} className="text-primary" />
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">CSI MasterFormat Section</div>
            <div className="text-sm font-bold text-foreground font-mono">{spec.csiSection}</div>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-[10px] px-2"
          onClick={() => copy(spec.csiSection)}
          data-testid="btn-copy-csi"
        >
          {copied ? <Check size={10} className="mr-1" /> : <Copy size={10} className="mr-1" />}
          Copy
        </Button>
      </div>

      {/* Rough Opening Calculator */}
      <div className="p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">Rough Opening Calculator</span>
        </div>
        <div className="text-[10px] text-muted-foreground mb-2">
          Formula: {spec.roughOpening.widthFormula}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
              Clear Opening Width (in.)
            </label>
            <input
              type="number"
              value={cowIn}
              onChange={(e) => setCowIn(e.target.value)}
              placeholder="e.g. 48"
              data-testid="input-cow"
              className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
              Door Height (in.)
            </label>
            <input
              type="number"
              value={doorHeightIn}
              onChange={(e) => setDoorHeightIn(e.target.value)}
              placeholder="e.g. 84"
              data-testid="input-height"
              className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        {(roughWidth || roughHeight) && (
          <div className="flex gap-3">
            {roughWidth && (
              <div className="flex-1 p-2 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Rough Opening Width</div>
                <div className="text-sm font-bold text-primary font-mono">{roughWidth}</div>
              </div>
            )}
            {roughHeight && (
              <div className="flex-1 p-2 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Rough Opening Height</div>
                <div className="text-sm font-bold text-primary font-mono">{roughHeight}</div>
              </div>
            )}
          </div>
        )}
        <div className="mt-2 text-[10px] text-muted-foreground">Min. width: {spec.roughOpening.minimumWidth} · Min. height: {spec.roughOpening.minimumHeight}</div>
        <div className="mt-1 text-[10px] text-amber-700 dark:text-amber-400">{spec.roughOpening.notes}</div>
      </div>

      {/* Header Spec */}
      <div className="p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Ruler size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">Header Specification</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Depth", value: spec.headerSpec.standardDepth },
            { label: "Height", value: spec.headerSpec.standardHeight },
            { label: "Max Span", value: spec.headerSpec.maxSpan },
            { label: "Material", value: spec.headerSpec.material },
            { label: "Access Panel", value: spec.headerSpec.accessPanel },
            { label: "Sensor Cap", value: spec.headerSpec.sensorCapHeight },
          ].map(({ label, value }) => (
            <div key={label} className="">
              <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</div>
              <div className="text-[11px] text-foreground mt-0.5">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Threshold Spec */}
      <div className="p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Ruler size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">Threshold Specification</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Max Height", value: spec.thresholdSpec.maxHeight },
            { label: "Material", value: spec.thresholdSpec.material },
            { label: "Width", value: spec.thresholdSpec.width },
            { label: "Bevel Required", value: spec.thresholdSpec.bevelRequired },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</div>
              <div className="text-[11px] text-foreground mt-0.5">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded text-[10px] text-blue-700 dark:text-blue-300">
          <span className="font-semibold">ADA Note: </span>{spec.thresholdSpec.adaNote}
        </div>
      </div>

      {/* Clearance Requirements */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-3 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-semibold text-foreground">Clearance Requirements</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left font-semibold text-muted-foreground px-3 py-2">Location</th>
              <th className="text-left font-semibold text-muted-foreground px-3 py-2">Dimension</th>
              <th className="text-left font-semibold text-muted-foreground px-3 py-2 hidden sm:table-cell">Reference</th>
            </tr>
          </thead>
          <tbody>
            {spec.clearanceRequirements.map((cr, i) => (
              <tr key={i} className="border-b border-border/50 last:border-b-0">
                <td className="px-3 py-2 font-medium text-foreground">{cr.location}</td>
                <td className="px-3 py-2 text-primary font-mono font-semibold">{cr.dimension}</td>
                <td className="px-3 py-2 text-[10px] text-muted-foreground hidden sm:table-cell">
                  <div>{cr.referenceCode}</div>
                  <div className="text-[9px] mt-0.5">{cr.note}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Material Specs */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-3 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-semibold text-foreground">Material Specifications</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left font-semibold text-muted-foreground px-3 py-2">Component</th>
              <th className="text-left font-semibold text-muted-foreground px-3 py-2 hidden sm:table-cell">Material</th>
              <th className="text-left font-semibold text-muted-foreground px-3 py-2 hidden md:table-cell">Min. Thickness</th>
            </tr>
          </thead>
          <tbody>
            {spec.materialSpecs.map((ms, i) => (
              <tr key={i} className="border-b border-border/50 last:border-b-0">
                <td className="px-3 py-2">
                  <div className="font-medium text-foreground">{ms.component}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{ms.finish}</div>
                  {ms.note && <div className="text-[9px] text-primary/70 mt-0.5">{ms.note}</div>}
                </td>
                <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">{ms.material}</td>
                <td className="px-3 py-2 font-mono text-primary/70 hidden md:table-cell">{ms.minThickness}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Glazing Spec */}
      <div className="p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">Glazing Specification</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Min Thickness", value: spec.glazingSpec.minThickness },
            { label: "Type", value: spec.glazingSpec.type },
            { label: "Edge Distance", value: spec.glazingSpec.edgeDistance },
            { label: "Sealant", value: spec.glazingSpec.sealant },
            { label: "Impact Rating", value: spec.glazingSpec.impactRating },
            { label: "Insulated Unit", value: spec.glazingSpec.insulated },
          ].map(({ label, value }) => (
            <div key={label} className="">
              <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</div>
              <div className="text-[11px] text-foreground mt-0.5">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Frame Spec */}
      <div className="p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Settings size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">Frame Specification</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Profile Depth", value: spec.frameSpec.profileDepth },
            { label: "Wall Thickness", value: spec.frameSpec.wallThickness },
            { label: "Material", value: spec.frameSpec.material },
            { label: "Anchorage", value: spec.frameSpec.anchorage },
            { label: "Thermal Break", value: spec.frameSpec.thermalBreak },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</div>
              <div className="text-[11px] text-foreground mt-0.5">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Engineer note */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <AlertTriangle size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-[10px] text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Engineer Coordination: </span>
          Coordinate with structural engineer for openings &gt; 10 ft COW. Verify header bearing and anchorage capacity before final design.
        </div>
      </div>
    </div>
  );
}

// ── TCO Calculator Tab Component ────────────────────────────────────────────

const CLIMATE_ZONES = [
  { id: "1", label: "Zone 1 (Hot-Humid, e.g. Miami FL)", multiplier: 0.72, isFlorida: true },
  { id: "2", label: "Zone 2 (Hot-Humid, e.g. Orlando FL)", multiplier: 0.78, isFlorida: true },
  { id: "3", label: "Zone 3 (Mixed-Humid, e.g. Atlanta)", multiplier: 0.85, isFlorida: false },
  { id: "4", label: "Zone 4 (Mixed, e.g. New York)", multiplier: 0.92, isFlorida: false },
  { id: "5", label: "Zone 5 (Cool, e.g. Chicago)", multiplier: 1.05, isFlorida: false },
  { id: "6", label: "Zone 6 (Cold, e.g. Minneapolis)", multiplier: 1.18, isFlorida: false },
  { id: "7", label: "Zone 7 (Very Cold, e.g. Duluth)", multiplier: 1.32, isFlorida: false },
  { id: "8", label: "Zone 8 (Subarctic, e.g. Fairbanks)", multiplier: 1.45, isFlorida: false },
  { id: "hvhz", label: "Florida HVHZ (Miami-Dade/Broward)", multiplier: 0.70, isFlorida: true },
];

const DOOR_TYPES_ENERGY = [
  { id: "auto_sliding", label: "Automatic Sliding", baseReduction: 0.22, isRevolving: false },
  { id: "manual_sliding", label: "Manual Sliding", baseReduction: 0.05, isRevolving: false },
  { id: "manual_swing", label: "Manual Swing", baseReduction: 0.03, isRevolving: false },
  { id: "revolving", label: "Revolving Door", baseReduction: 0.33, isRevolving: true },
  { id: "vestibule", label: "Vestibule Configuration", baseReduction: 0.28, isRevolving: false },
];

const BUILDING_TYPES = [
  { id: "office", label: "Office / Commercial", baseLoad: 18.5 },
  { id: "healthcare", label: "Healthcare / Hospital", baseLoad: 24.2 },
  { id: "retail", label: "Retail / Big-Box", baseLoad: 21.0 },
  { id: "hotel", label: "Hotel / Hospitality", baseLoad: 16.8 },
  { id: "airport", label: "Airport / Transit", baseLoad: 28.5 },
  { id: "education", label: "Education", baseLoad: 14.2 },
  { id: "government", label: "Government / Institutional", baseLoad: 17.6 },
];

const HVAC_TYPES = [
  { id: "central", label: "Central Air", efficiencyFactor: 1.0 },
  { id: "packaged", label: "Packaged Unit", efficiencyFactor: 0.88 },
  { id: "vrf", label: "VRF (Variable Refrigerant Flow)", efficiencyFactor: 0.78 },
  { id: "chiller", label: "Chiller System", efficiencyFactor: 0.72 },
];

const PRODUCT_CATEGORIES = [
  { id: "std_sliding", label: "Standard Sliding", unitCost: 8500, installCost: 2200 },
  { id: "hurricane_sliding", label: "Hurricane-Rated Sliding (R104)", unitCost: 14200, installCost: 3800 },
  { id: "revolving", label: "Revolving Door (RD300/RD700)", unitCost: 32000, installCost: 6500 },
  { id: "swing_op", label: "Swing Operator", unitCost: 4800, installCost: 1400 },
  { id: "healthcare_icu", label: "Healthcare ICU", unitCost: 22000, installCost: 5200 },
];

const COMPETITORS = [
  { id: "baseline", label: "vs. ASSA ABLOY (Baseline)", priceFactor: 1.0, serviceMultiplier: 1.0 },
  { id: "dormakaba", label: "vs. dormakaba", priceFactor: 0.91, serviceMultiplier: 1.38 },
  { id: "stanley", label: "vs. Allegion / Stanley", priceFactor: 0.93, serviceMultiplier: 1.42 },
  { id: "geze", label: "vs. GEZE", priceFactor: 0.89, serviceMultiplier: 1.35 },
  { id: "tormax", label: "vs. TORMAX", priceFactor: 0.88, serviceMultiplier: 1.44 },
];

const CO2_PER_KWH = 0.000386; // metric tons CO2 per kWh (US avg EPA)

function TCOCalculatorTab() {
  // ── Energy Savings State ─────────────────────────────────────────────────
  const [energyDoorType, setEnergyDoorType] = useState("auto_sliding");
  const [climateZone, setClimateZone] = useState("2");
  const [buildingType, setBuildingType] = useState("office");
  const [annualTraffic, setAnnualTraffic] = useState(250000);
  const [operatingHours, setOperatingHours] = useState(12);
  const [energyCost, setEnergyCost] = useState(0.12);
  const [hvacType, setHvacType] = useState("central");
  const [ecoLogicAI, setEcoLogicAI] = useState(false);

  // ── TCO Model State ──────────────────────────────────────────────────────
  const [productCategory, setProductCategory] = useState("std_sliding");
  const [competitor, setCompetitor] = useState("dormakaba");
  const [installCount, setInstallCount] = useState(5);
  const [aaadmService, setAaadmService] = useState(true);
  const [projectLife, setProjectLife] = useState(10);
  const [financingRate, setFinancingRate] = useState(5);

  // ── Energy Savings Calculations ──────────────────────────────────────────
  const energyResults = useMemo(() => {
    const doorDef = DOOR_TYPES_ENERGY.find(d => d.id === energyDoorType)!;
    const climateDef = CLIMATE_ZONES.find(c => c.id === climateZone)!;
    const buildingDef = BUILDING_TYPES.find(b => b.id === buildingType)!;
    const hvacDef = HVAC_TYPES.find(h => h.id === hvacType)!;

    // Traffic factor: scale linearly from 0.7 (low traffic) to 1.3 (high traffic)
    const trafficFactor = 0.7 + (annualTraffic / 2000000) * 0.6;
    // Operating hours factor (more hours = more energy impact)
    const hoursFactor = operatingHours / 12;

    // Base kWh/door/year calculation
    // baseLoad (kBtu/sqft/yr) * infiltration reduction * climate multiplier
    let infiltrationReduction = doorDef.baseReduction;
    if (ecoLogicAI) infiltrationReduction = Math.min(0.80, infiltrationReduction * 1.25);

    // Estimated building envelope infiltration load (kWh) assuming 10,000 sqft per door
    const envelopeLoadKwh = buildingDef.baseLoad * 10000 * 0.29307; // kBtu -> kWh
    const annualSavingsKwh = Math.round(
      envelopeLoadKwh * infiltrationReduction * climateDef.multiplier *
      trafficFactor * hoursFactor * hvacDef.efficiencyFactor
    );

    const annualSavingsDollars = Math.round(annualSavingsKwh * energyCost);
    const tenYearSavings = Math.round(annualSavingsDollars * 10);
    const co2TonsPerYear = parseFloat((annualSavingsKwh * CO2_PER_KWH).toFixed(2));

    // LEED credits: 1 credit per 5% better than baseline
    const leedCredits = Math.min(4, Math.floor(infiltrationReduction * 20));

    const vestibuleEquivalent = doorDef.isRevolving;
    const floridaNote = climateDef.isFlorida;

    return {
      annualSavingsKwh,
      annualSavingsDollars,
      tenYearSavings,
      co2TonsPerYear,
      leedCredits,
      vestibuleEquivalent,
      floridaNote,
      infiltrationReduction: Math.round(infiltrationReduction * 100),
    };
  }, [energyDoorType, climateZone, buildingType, annualTraffic, operatingHours, energyCost, hvacType, ecoLogicAI]);

  // ── TCO Calculations ─────────────────────────────────────────────────────
  const tcoResults = useMemo(() => {
    const prodDef = PRODUCT_CATEGORIES.find(p => p.id === productCategory)!;
    const compDef = COMPETITORS.find(c => c.id === competitor)!;
    const rate = financingRate / 100;

    // ASSA ABLOY costs per door
    const aaDoorCost = prodDef.unitCost;
    const aaInstallCost = prodDef.installCost;
    const aaServiceCostPerYear = aaadmService ? aaDoorCost * 0.04 : aaDoorCost * 0.055;
    // AAADM-certified: 35% fewer callbacks -> lower downtime cost
    const aaDowntimeCostPerYear = aaadmService ? 800 : 1400;
    const aaEnergyCostPerYear = Math.max(0, 2000 - energyResults.annualSavingsDollars);

    // Competitor costs per door
    const compDoorCost = prodDef.unitCost * compDef.priceFactor;
    const compInstallCost = prodDef.installCost * (compDef.id === "baseline" ? 1.0 : 0.95);
    const compServiceCostPerYear = aaServiceCostPerYear * compDef.serviceMultiplier;
    const compDowntimeCostPerYear = aaDowntimeCostPerYear * compDef.serviceMultiplier;
    const compEnergyCostPerYear = aaEnergyCostPerYear * 1.15; // competitor door less efficient

    // Build year-by-year chart data
    const chartData = [];
    let aaCumulative = 0;
    let compCumulative = 0;

    for (let year = 1; year <= projectLife; year++) {
      if (year === 1) {
        aaCumulative += (aaDoorCost + aaInstallCost) * installCount;
        compCumulative += (compDoorCost + compInstallCost) * installCount;
      }
      aaCumulative += (aaServiceCostPerYear + aaDowntimeCostPerYear + aaEnergyCostPerYear) * installCount;
      compCumulative += (compServiceCostPerYear + compDowntimeCostPerYear + compEnergyCostPerYear) * installCount;
      chartData.push({
        year: `Yr ${year}`,
        "ASSA ABLOY": Math.round(aaCumulative / 1000),
        [compDef.label.replace("vs. ", "")]: Math.round(compCumulative / 1000),
      });
    }

    // Stacked bar breakdown for Year 1 and project life total
    const aaTotal = (aaDoorCost + aaInstallCost + (aaServiceCostPerYear + aaDowntimeCostPerYear + aaEnergyCostPerYear) * projectLife) * installCount;
    const compTotal = (compDoorCost + compInstallCost + (compServiceCostPerYear + compDowntimeCostPerYear + compEnergyCostPerYear) * projectLife) * installCount;

    const savings = compTotal - aaTotal;

    // NPV of savings
    let npv = 0;
    const annualCompSavings = ((compServiceCostPerYear + compDowntimeCostPerYear + compEnergyCostPerYear) -
      (aaServiceCostPerYear + aaDowntimeCostPerYear + aaEnergyCostPerYear)) * installCount;
    for (let y = 1; y <= projectLife; y++) {
      npv += annualCompSavings / Math.pow(1 + rate, y);
    }
    npv = Math.round(npv - (aaDoorCost - compDoorCost) * installCount);

    // Break-even year
    const initialPremium = (aaDoorCost + aaInstallCost - compDoorCost - compInstallCost) * installCount;
    const breakEvenYear = initialPremium > 0 && annualCompSavings > 0
      ? parseFloat((initialPremium / annualCompSavings).toFixed(1))
      : null;

    // Stacked bar chart data for cost breakdown
    const stackedData = [
      {
        name: "ASSA ABLOY",
        "Unit Cost": Math.round(aaDoorCost * installCount / 1000),
        "Installation": Math.round(aaInstallCost * installCount / 1000),
        "Annual Service": Math.round(aaServiceCostPerYear * projectLife * installCount / 1000),
        "Energy": Math.round(aaEnergyCostPerYear * projectLife * installCount / 1000),
        "Downtime": Math.round(aaDowntimeCostPerYear * projectLife * installCount / 1000),
      },
      {
        name: compDef.label.replace("vs. ", ""),
        "Unit Cost": Math.round(compDoorCost * installCount / 1000),
        "Installation": Math.round(compInstallCost * installCount / 1000),
        "Annual Service": Math.round(compServiceCostPerYear * projectLife * installCount / 1000),
        "Energy": Math.round(compEnergyCostPerYear * projectLife * installCount / 1000),
        "Downtime": Math.round(compDowntimeCostPerYear * projectLife * installCount / 1000),
      },
    ];

    return {
      aaTotal: Math.round(aaTotal),
      compTotal: Math.round(compTotal),
      savings: Math.round(savings),
      npv,
      breakEvenYear,
      chartData,
      stackedData,
      compName: compDef.label.replace("vs. ", ""),
    };
  }, [productCategory, competitor, installCount, aaadmService, projectLife, financingRate, energyResults.annualSavingsDollars]);

  // ── Download Report ───────────────────────────────────────────────────────
  const handleDownload = useCallback(() => {
    const doorLabel = DOOR_TYPES_ENERGY.find(d => d.id === energyDoorType)?.label ?? energyDoorType;
    const zoneLabel = CLIMATE_ZONES.find(c => c.id === climateZone)?.label ?? climateZone;
    const buildLabel = BUILDING_TYPES.find(b => b.id === buildingType)?.label ?? buildingType;
    const prodLabel = PRODUCT_CATEGORIES.find(p => p.id === productCategory)?.label ?? productCategory;

    const lines = [
      "ASSA ABLOY ENTRANCE SYSTEMS — TCO & ENERGY SAVINGS REPORT",
      "Generated: " + new Date().toLocaleDateString(),
      "",
      "=== ENERGY SAVINGS CALCULATOR ===",
      "Door Type: " + doorLabel,
      "Climate Zone: " + zoneLabel,
      "Building Type: " + buildLabel,
      "Annual Traffic: " + annualTraffic.toLocaleString() + " persons/year",
      "Operating Hours: " + operatingHours + " hrs/day",
      "Local Energy Cost: $" + energyCost.toFixed(2) + "/kWh",
      "ecoLOGIC AI Enabled: " + (ecoLogicAI ? "Yes" : "No"),
      "",
      "RESULTS:",
      "Infiltration Reduction vs. Manual Door: " + energyResults.infiltrationReduction + "%",
      "Annual HVAC Energy Savings: " + energyResults.annualSavingsKwh.toLocaleString() + " kWh/year",
      "Annual Dollar Savings: $" + energyResults.annualSavingsDollars.toLocaleString(),
      "10-Year Cumulative Savings: $" + energyResults.tenYearSavings.toLocaleString(),
      "CO2 Reduction: " + energyResults.co2TonsPerYear + " tons/year",
      "LEED Credit Eligibility: " + energyResults.leedCredits + " Innovation/Energy credits",
      energyResults.vestibuleEquivalent ? "ASHRAE 90.1-2022: Revolving door qualifies as vestibule equivalent under §6.4.7.3" : "",
      "",
      "=== TOTAL COST OF OWNERSHIP MODEL ===",
      "Product: " + prodLabel,
      "Competitor Comparison: " + tcoResults.compName,
      "Door Count: " + installCount,
      "Service Contract: " + (aaadmService ? "AAADM Certified" : "Third-Party"),
      "Project Life: " + projectLife + " years",
      "Financing Rate: " + financingRate + "%",
      "",
      "ASSA ABLOY " + projectLife + "-Year TCO: $" + tcoResults.aaTotal.toLocaleString(),
      tcoResults.compName + " " + projectLife + "-Year TCO: $" + tcoResults.compTotal.toLocaleString(),
      "ASSA ABLOY Advantage: $" + tcoResults.savings.toLocaleString(),
      "NPV of Savings: $" + tcoResults.npv.toLocaleString(),
      tcoResults.breakEvenYear ? "Break-Even: " + tcoResults.breakEvenYear + " years" : "ASSA ABLOY lower initial cost — no break-even required",
      "",
      "References:",
      "- ASHRAE 90.1-2022 §6.4.7.3 (Revolving Door Vestibule Equivalency)",
      "- IECC 2024 Table C402.5.2 (Air Leakage: 1.0 CFM/SF for automatic doors)",
      "- AAADM Certification Program (www.aaadm.com)",
      "- EPA eGRID 2022 (CO2 factor: 0.386 kg/kWh)",
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ASSA_ABLOY_TCO_Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [energyDoorType, climateZone, buildingType, annualTraffic, operatingHours, energyCost, hvacType, ecoLogicAI, productCategory, competitor, installCount, aaadmService, projectLife, financingRate, energyResults, tcoResults]);

  const fmt = (n: number) => n.toLocaleString("en-US");
  const fmtDollar = (n: number) => "$" + fmt(n);

  return (
    <div className="space-y-6 p-1">
      {/* Download button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FileText size={13} />
          Download TCO Report
        </button>
      </div>

      {/* ── SECTION 1: Energy Savings Calculator ── */}
      <div className="p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={15} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Energy Savings Calculator</h3>
          <span className="ml-2 text-[10px] text-muted-foreground">ASHRAE 90.1-2022 basis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-3">
            {/* Door Type */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Door Type</label>
              <select
                value={energyDoorType}
                onChange={e => setEnergyDoorType(e.target.value)}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {DOOR_TYPES_ENERGY.map(d => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Climate Zone */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Climate Zone (ASHRAE 90.1)</label>
              <select
                value={climateZone}
                onChange={e => setClimateZone(e.target.value)}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CLIMATE_ZONES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Building Type */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Building Type</label>
              <select
                value={buildingType}
                onChange={e => setBuildingType(e.target.value)}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {BUILDING_TYPES.map(b => (
                  <option key={b.id} value={b.id}>{b.label}</option>
                ))}
              </select>
            </div>

            {/* Traffic Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Annual Traffic Volume</label>
                <span className="text-[10px] font-mono text-primary">{fmt(annualTraffic)} persons/yr</span>
              </div>
              <input
                type="range"
                min={1000}
                max={2000000}
                step={1000}
                value={annualTraffic}
                onChange={e => setAnnualTraffic(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                <span>1,000</span><span>2,000,000</span>
              </div>
            </div>

            {/* Operating Hours */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Operating Hours / Day</label>
                <span className="text-[10px] font-mono text-primary">{operatingHours} hrs</span>
              </div>
              <input
                type="range"
                min={8}
                max={24}
                step={1}
                value={operatingHours}
                onChange={e => setOperatingHours(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                <span>8 hrs</span><span>24 hrs</span>
              </div>
            </div>

            {/* Energy Cost */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Local Energy Cost ($/kWh)</label>
              <input
                type="number"
                min={0.05}
                max={0.50}
                step={0.01}
                value={energyCost}
                onChange={e => setEnergyCost(Number(e.target.value))}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            {/* HVAC System */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">HVAC System</label>
              <select
                value={hvacType}
                onChange={e => setHvacType(e.target.value)}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {HVAC_TYPES.map(h => (
                  <option key={h.id} value={h.id}>{h.label}</option>
                ))}
              </select>
            </div>

            {/* ecoLOGIC AI Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-primary/5 border border-primary/20 rounded-lg">
              <div>
                <div className="text-xs font-semibold text-foreground">ecoLOGIC AI</div>
                <div className="text-[10px] text-muted-foreground">+20-30% additional savings on baseline</div>
              </div>
              <button
                onClick={() => setEcoLogicAI(!ecoLogicAI)}
                className={`relative inline-block h-5 w-9 rounded-full transition-colors ${
                  ecoLogicAI ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
                    ecoLogicAI ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Outputs */}
          <div className="space-y-3">
            {/* Vestibule Equivalent Badge */}
            {energyResults.vestibuleEquivalent && (
              <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-700 rounded-lg">
                <CheckCircle2 size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-green-800 dark:text-green-300">Vestibule Equivalent (ASHRAE 90.1-2022 §6.4.7.3)</div>
                  <div className="text-[10px] text-green-700 dark:text-green-400 mt-0.5">Revolving door qualifies as vestibule equivalent for energy code compliance. Eliminates need for separate vestibule construction.</div>
                </div>
              </div>
            )}

            {/* Florida Note */}
            {energyResults.floridaNote && (
              <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <Info size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-[10px] text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Florida / IECC 2024 Note: </span>
                  Climate Zones 1-2 (Florida) have specific vestibule exemptions under IECC 2024 Table C402.5.2. Revolving doors and automatic sliding doors with &lt;1.0 CFM/SF air leakage qualify for vestibule exemptions. HVHZ projects require FBC-approved product approval numbers.
                </div>
              </div>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-background border border-border rounded-lg">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">Annual kWh Savings</div>
                <div className="text-lg font-bold text-primary mt-1">{fmt(energyResults.annualSavingsKwh)}</div>
                <div className="text-[10px] text-muted-foreground">kWh / year</div>
              </div>
              <div className="p-3 bg-background border border-border rounded-lg">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">Annual $ Savings</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">{fmtDollar(energyResults.annualSavingsDollars)}</div>
                <div className="text-[10px] text-muted-foreground">/ year</div>
              </div>
              <div className="p-3 bg-background border border-border rounded-lg">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">10-Year Cumulative</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">{fmtDollar(energyResults.tenYearSavings)}</div>
                <div className="text-[10px] text-muted-foreground">total savings</div>
              </div>
              <div className="p-3 bg-background border border-border rounded-lg">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">CO₂ Reduction</div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{energyResults.co2TonsPerYear}</div>
                <div className="text-[10px] text-muted-foreground">tons / year</div>
              </div>
            </div>

            {/* Infiltration Reduction */}
            <div className="p-3 bg-background border border-border rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">HVAC Infiltration Reduction</div>
                <span className="text-sm font-bold text-primary">{energyResults.infiltrationReduction}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: energyResults.infiltrationReduction + "%" }}
                />
              </div>
              <div className="text-[9px] text-muted-foreground mt-1">vs. manual door baseline</div>
            </div>

            {/* LEED */}
            <div className="p-3 bg-background border border-border rounded-lg">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">LEED Point Contribution</div>
              <div className="text-xs text-foreground">Eligible for <span className="font-bold text-primary">{energyResults.leedCredits}</span> Innovation / Energy credits</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Based on % improvement over ASHRAE 90.1-2022 baseline</div>
            </div>

            {/* ASHRAE Citation */}
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-[10px] text-blue-800 dark:text-blue-300">
                <span className="font-semibold">Reference: </span>
                ASHRAE 90.1-2022 §6.4.7.3 — Revolving doors recognized as vestibule equivalents; air curtains codified as alternative compliance path; 1.0 CFM/SF air leakage limit for automatic sliding/swing doors.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Total Cost of Ownership Model</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── SECTION 2: TCO Model ── */}
      <div className="p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={15} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">TCO Model</h3>
          <span className="ml-2 text-[10px] text-muted-foreground">ASSA ABLOY vs. Competitor — {projectLife}-year lifecycle</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TCO Inputs */}
          <div className="space-y-3">
            {/* Product Category */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Product Category</label>
              <select
                value={productCategory}
                onChange={e => setProductCategory(e.target.value)}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {PRODUCT_CATEGORIES.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Competitor */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Competitor Comparison</label>
              <select
                value={competitor}
                onChange={e => setCompetitor(e.target.value)}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {COMPETITORS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Door Count */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Installation Count</label>
              <input
                type="number"
                min={1}
                max={50}
                value={installCount}
                onChange={e => setInstallCount(Math.max(1, Math.min(50, Number(e.target.value))))}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            {/* Service Contract Toggle */}
            <div className="flex items-center justify-between p-2.5 border border-border rounded-lg">
              <div>
                <div className="text-xs font-semibold text-foreground">
                  {aaadmService ? "AAADM Certified Service" : "Third-Party Service"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {aaadmService ? "2-4 hr response · 35% fewer callbacks" : "24-48 hr response · standard callback rate"}
                </div>
              </div>
              <button
                onClick={() => setAaadmService(!aaadmService)}
                className={`relative inline-block h-5 w-9 rounded-full transition-colors ${
                  aaadmService ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
                    aaadmService ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Project Life */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Project Life</label>
                <span className="text-[10px] font-mono text-primary">{projectLife} years</span>
              </div>
              <input
                type="range"
                min={5}
                max={20}
                step={5}
                value={projectLife}
                onChange={e => setProjectLife(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                <span>5 yr</span><span>10 yr</span><span>15 yr</span><span>20 yr</span>
              </div>
            </div>

            {/* Financing Rate */}
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Financing Rate (% for NPV)</label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={financingRate}
                onChange={e => setFinancingRate(Number(e.target.value))}
                className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            {/* Key Assumptions */}
            <div className="p-2.5 bg-background border border-border rounded-lg">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Key Assumptions</div>
              <ul className="space-y-0.5">
                {[
                  "AAADM certified: 2-4 hr response (vs. 24-48 hr competitor avg)",
                  "AAADM reduces callback rate by ~35% vs. third-party",
                  "Competitor price delta: 8-12% (dormakaba), 5-10% (Stanley)",
                  "Energy savings from Section 1 applied to annual operating cost",
                  "ecoLOGIC AI: up to 80% HVAC infiltration reduction",
                ].map((a, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                    <span className="text-primary mt-0.5">·</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* TCO Outputs */}
          <div className="space-y-3">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-background border border-border rounded-lg">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">ASSA ABLOY {projectLife}yr TCO</div>
                <div className="text-base font-bold text-primary mt-1">{fmtDollar(tcoResults.aaTotal)}</div>
                <div className="text-[10px] text-muted-foreground">{installCount} door{installCount !== 1 ? "s" : ""}</div>
              </div>
              <div className="p-3 bg-background border border-border rounded-lg">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">{tcoResults.compName} {projectLife}yr TCO</div>
                <div className="text-base font-bold text-red-500 mt-1">{fmtDollar(tcoResults.compTotal)}</div>
                <div className="text-[10px] text-muted-foreground">{installCount} door{installCount !== 1 ? "s" : ""}</div>
              </div>
              <div className="p-3 bg-background border border-border rounded-lg">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">ASSA ABLOY Advantage</div>
                <div className={`text-base font-bold mt-1 ${tcoResults.savings >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {tcoResults.savings >= 0 ? "+" : ""}{fmtDollar(tcoResults.savings)}
                </div>
                <div className="text-[10px] text-muted-foreground">vs. {tcoResults.compName}</div>
              </div>
              <div className="p-3 bg-background border border-border rounded-lg">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">NPV of Savings</div>
                <div className={`text-base font-bold mt-1 ${tcoResults.npv >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {fmtDollar(tcoResults.npv)}
                </div>
                <div className="text-[10px] text-muted-foreground">@ {financingRate}% discount rate</div>
              </div>
            </div>

            {/* Break-Even */}
            <div className="p-3 bg-background border border-border rounded-lg">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Break-Even Analysis</div>
              {tcoResults.breakEvenYear !== null ? (
                <div className="text-xs text-foreground">
                  ASSA ABLOY premium pays back in{" "}
                  <span className="font-bold text-primary">{tcoResults.breakEvenYear} years</span>
                </div>
              ) : (
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">ASSA ABLOY lower initial cost — immediate advantage</div>
              )}
              {tcoResults.breakEvenYear !== null && tcoResults.breakEvenYear <= projectLife && (
                <div className="text-[10px] text-muted-foreground mt-0.5">Break-even within {projectLife}-year project life</div>
              )}
            </div>

            {/* Stacked Bar Chart */}
            <div className="p-3 bg-background border border-border rounded-lg">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">{projectLife}-Year Cost Breakdown ($K)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tcoResults.stackedData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "currentColor" }} />
                  <YAxis tick={{ fontSize: 9, fill: "currentColor" }} tickFormatter={(v: number) => `$${v}K`} />
                  <Tooltip
                    formatter={(value: number, name: string) => [`$${value}K`, name]}
                    contentStyle={{ fontSize: 11, backgroundColor: "hsl(220 22% 8%)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Unit Cost" stackId="a" fill="hsl(210 85% 62%)" />
                  <Bar dataKey="Installation" stackId="a" fill="hsl(210 60% 45%)" />
                  <Bar dataKey="Annual Service" stackId="a" fill="hsl(210 40% 35%)" />
                  <Bar dataKey="Energy" stackId="a" fill="hsl(142 60% 40%)" />
                  <Bar dataKey="Downtime" stackId="a" fill="hsl(24 80% 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Output tab definitions ───────────────────────────────────────────────────

type OutputTab = "summary" | "sensors" | "force" | "signage" | "codes" | "specsheet" | "aaadm" | "archspecs" | "energy" | "tco";
const OUTPUT_TABS: { id: OutputTab; label: string }[] = [
  { id: "summary", label: "Compliance Summary" },
  { id: "sensors", label: "Sensor Requirements" },
  { id: "force", label: "Force & Timing" },
  { id: "signage", label: "Signage" },
  { id: "codes", label: "Code References" },
  { id: "energy", label: "Energy Code" },
  { id: "specsheet", label: "Spec Sheet" },
  { id: "aaadm", label: "AAADM Requirements" },
  { id: "archspecs", label: "Architectural Specs" },
  { id: "tco", label: "TCO / Energy" },
];

// ── Copy to clipboard ────────────────────────────────────────────────────────

function useCopyText() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  return { copied, copy };
}

// ── Severity badge ────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: "required" | "not_required" | "recommended" | "conditional" }) {
  if (severity === "required") return <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 font-medium">Required</Badge>;
  if (severity === "recommended") return <Badge variant="secondary" className="text-[10px] font-medium">Recommended</Badge>;
  if (severity === "conditional") return <Badge variant="secondary" className="text-[10px] font-medium text-amber-700 dark:text-amber-400">Conditional</Badge>;
  return <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">Not Required</Badge>;
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

// ── Suite URLs ──────────────────────────────────────────────────────────────
const SUITE_TOOLS = [
  { id: "doorspec",    label: "DoorSpec",    url: "https://doorspec-aadm.vercel.app" },
  { id: "battlecard", label: "BattleCard",  url: "https://battlecard-aadm.vercel.app" },
  { id: "codetracker",label: "CodeTracker", url: "https://codetracker-aadm.vercel.app" },
  { id: "crosswalkdb",label: "CrosswalkDB", url: "https://crosswalkdb-aadm.vercel.app" },
  { id: "pmstudio",   label: "PM Studio",   url: "https://pmstudio-aadm.vercel.app" },
  { id: "portfolioiq",label: "PortfolioIQ", url: "https://portfolioiq-aadm.vercel.app" },
  { id: "iptracker",  label: "IP Tracker",  url: "https://iptracker-aadm.vercel.app" },
] as const;

function SuiteNav({ activeTool }: { activeTool: string }) {
  return (
    <div className="w-full bg-zinc-900 dark:bg-zinc-950 border-b border-zinc-700/60 px-4 py-1 flex items-center gap-1 overflow-x-auto scrollbar-none">
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mr-2 shrink-0">PM Suite</span>
      {SUITE_TOOLS.map((tool) => {
        const isActive = tool.id === activeTool;
        return (
          <button
            key={tool.id}
            onClick={() => !isActive && window.open(tool.url, "_blank")}
            className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              isActive
                ? "bg-orange-600 text-white cursor-default"
                : "text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800 cursor-pointer"
            }`}
          >
            {tool.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ComplianceChecker() {
  const { dark, toggle } = useTheme();
  const [wizardStep, setWizardStep] = useState(0);
  const [config, setConfig] = useState<UIConfig>(defaultConfig);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<OutputTab>("summary");
  const [codeFilter, setCodeFilter] = useState<string>("all");
  const [specSheet, setSpecSheet] = useState<SpecSheet | null>(null);
  const [specGenerated, setSpecGenerated] = useState(false);
  const { copied, copy } = useCopyText();
  const [noaBannerDismissed, setNoaBannerDismissed] = useState(false);
  const [fbcBannerDismissed, setFbcBannerDismissed] = useState(false);

  const doorConfig = uiConfigToDoorConfig(config);

  // Run compliance on demand
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [stdPanelOpen, setStdPanelOpen] = useState(false);

  const update = <K extends keyof UIConfig>(key: K, value: UIConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleRun = () => {
    // runComplianceCheck expects ConfigInput (legacy)
    const legacyInput = {
      doorType: doorConfig.doorType,
      activationMethod: doorConfig.activationMethod,
      energyLevel: config.energyClass === "full_energy" ? "full" as const : "low" as const,
      county: doorConfig.county,
      occupancyType: doorConfig.occupancyType,
      occupantLoad: doorConfig.occupantLoad,
      isExterior: doorConfig.isExterior,
      isEgressPath: doorConfig.isEgressPath,
      isFireRated: doorConfig.isFireRated,
      hasVestibule: doorConfig.hasVestibule,
    };
    const result = runComplianceCheck(legacyInput);
    setComplianceResult(result);
    setSpecSheet(null);
    setSpecGenerated(false);
    setActiveTab("summary");
    setShowResults(true);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    setComplianceResult(null);
    setSpecSheet(null);
    setSpecGenerated(false);
    setShowResults(false);
    setWizardStep(0);
  };

  const isLastStep = wizardStep === WIZARD_STEPS.length - 1;

  // Derived data for output tabs
  const sensors = getSensorSpecs(doorConfig.doorType, doorConfig.energyClass);
  const forceSpecs = getForceTimingSpecs(doorConfig.doorType, doorConfig.energyClass);
  const signage = getSignageRequirements(doorConfig.doorType, doorConfig.energyClass, doorConfig.activationMethod, doorConfig.isEgressPath, doorConfig.isExterior, doorConfig.county);
  const hvhzResult = evaluateFloridaHVHZ(doorConfig.county, doorConfig.isExterior);
  const iecc = evaluateIECCVestibule(doorConfig.county);
  const egressResult = evaluateEgressCompliance(
    doorConfig.doorType,
    doorConfig.energyClass,
    config.accessControl,
    true,
    false
  );
  const adaResult = evaluateADACompliance(
    doorConfig.doorType,
    doorConfig.energyClass,
    doorConfig.occupancyType,
    config.accessControl
  );

  // Filtered code references
  const relevantCodes = CODE_REFERENCES.filter(
    (cr) => cr.applicability.length === 0 || cr.applicability.includes(doorConfig.doorType)
  );
  const filteredCodes = codeFilter === "all" ? relevantCodes : relevantCodes.filter((cr) => cr.code.includes(codeFilter));
  const codeBodyOptions = ["all", "ADA", "IBC", "FBC", "FGI", "NFPA", "IECC", "A156"];

  // Spec sheet generation
  const handleGenerateSpec = () => {
    const sheet = generateSpecSheet(doorConfig);
    setSpecSheet(sheet);
    setSpecGenerated(true);
  };

  const specSheetText = specSheet
    ? [
        `=== DOORSPEC FL COMPLIANCE SPEC SHEET ===`,
        `Generated: ${specSheet.generatedDate}`,
        `Door Type: ${DOOR_TYPE_LABELS[specSheet.doorType]}`,
        `Energy Class: ${ENERGY_CLASS_LABELS[specSheet.energyClass]}`,
        `Location: ${specSheet.location}`,
        `Occupancy: ${OCCUPANCY_LABELS[specSheet.occupancyType]}`,
        ``,
        `--- REQUIRED SENSORS ---`,
        specSheet.requiredSensors.filter((s) => s.severity === "required").map((s) => `• ${s.type} [${s.technology}]: ${s.requirement}`).join("\n"),
        ``,
        `--- FORCE & TIMING ---`,
        specSheet.forceTimingSpecs.map((f) => `• ${f.label}: ${f.value} ${f.unit} (${f.standard})`).join("\n"),
        ``,
        `--- SIGNAGE ---`,
        specSheet.signageRequirements.filter((s) => s.severity === "required").map((s) => `• "${s.text}" — ${s.size}, ${s.placement}`).join("\n"),
        ``,
        `--- APPLICABLE CODE REFERENCES ---`,
        specSheet.codeReferences.map((cr) => `• ${cr.code} ${cr.section}: ${cr.requirement.slice(0, 100)}...`).join("\n"),
        ``,
        `--- PM NOTES ---`,
        specSheet.pmNotes.map((n) => `• ${n}`).join("\n"),
        ``,
        `--- RECOMMENDED PRODUCTS ---`,
        specSheet.recommendedProducts.map((p) => `• ${p.brand} ${p.model}: ${p.rationale}`).join("\n"),
      ].join("\n")
    : "";

  // Traffic light status
  const criticals = complianceResult?.flags.filter((f) => f.level === "critical") ?? [];
  const warnings = complianceResult?.flags.filter((f) => f.level === "warning") ?? [];
  const statusColor = criticals.length > 0 ? "red" : warnings.length > 0 ? "amber" : "green";
  const statusLabel = criticals.length > 0 ? "Non-Compliant" : warnings.length > 0 ? "Review Required" : "Pass";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      {/* ── Suite Nav ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-[60]">
        <SuiteNav activeTool="doorspec" />
      </div>
      <header className="border-b border-border bg-card sticky top-[32px] z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg
              aria-label="DoorSpec logo"
              viewBox="0 0 32 32"
              fill="none"
              className="w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <rect x="7" y="6" width="12" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
              <circle cx="17.5" cy="16" r="1.5" fill="currentColor" className="text-primary" />
              <path d="M21 10 L26 10 M21 14 L26 14 M21 18 L24 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground" />
            </svg>
            <div>
              <div className="text-sm font-semibold leading-tight text-foreground">DoorSpec</div>
              <div className="text-[10px] text-muted-foreground leading-tight">FL Compliance Checker</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">A156.10-2024 · FBC 9th Ed.</span>
            {showResults && (
              <Button
                data-testid="btn-reset"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs h-7"
              >
                <RotateCcw size={12} className="mr-1" />
                New Check
              </Button>
            )}
            <button
              data-testid="btn-theme-toggle"
              onClick={toggle}
              aria-label="Toggle theme"
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout ─────────────────────────────────────────────────────── */}
      {/* NOA Alert Banner */}
      <AnimatePresence>
        {!noaBannerDismissed ? (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-800/60"
            data-testid="noa-alert-banner"
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle size={14} className="text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-xs font-semibold text-red-700 dark:text-red-300 truncate">
                  ⚠ FBC 9TH EDITION TRANSITION: Effective Dec 31, 2026 (261 days). Update product approvals for SL500 R104/R128 + Windcord 5400 for permits on/after that date. Current NOAs (25-0311.04–.10) expire 2030–2031.
                </p>
              </div>
              <button
                onClick={() => setNoaBannerDismissed(true)}
                data-testid="noa-banner-dismiss"
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shrink-0"
                aria-label="Dismiss NOA alert"
              >
                <XCircle size={14} className="text-red-500" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-red-50/50 dark:bg-red-950/10 border-b border-red-200/40 dark:border-red-800/30 px-4 py-1">
            <span className="text-xs text-red-600 dark:text-red-400">1 NOA alert dismissed</span>
          </div>
        )}
      </AnimatePresence>

      {/* FBC 8th Edition Banner */}
      <AnimatePresence>
        {!fbcBannerDismissed && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800/40"
            data-testid="fbc-alert-chip"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Info size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 truncate">
                  🔵 FBC 8TH EDITION (DEC 2026): Be first to market with updated spec templates and NOA renewals. 8 months to prepare.
                </p>
              </div>
              <button
                onClick={() => setFbcBannerDismissed(true)}
                data-testid="fbc-banner-dismiss"
                className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shrink-0"
                aria-label="Dismiss FBC alert"
              >
                <XCircle size={13} className="text-blue-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className={`flex flex-col ${showResults ? "lg:flex-row" : ""} gap-6`}>

          {/* ═══════════════════════════════════════════════════════════════════
              LEFT PANEL: Configuration Wizard
          ═══════════════════════════════════════════════════════════════════ */}
          <div className={`${showResults ? "lg:w-[380px] flex-shrink-0" : "max-w-2xl mx-auto w-full"}`}>

            {/* Step progress */}
            <div className="mb-5">
              <div className="flex items-center gap-1 mb-3">
                {WIZARD_STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => !showResults && setWizardStep(i)}
                    className={`flex-1 h-1.5 rounded-full transition-all ${
                      i < wizardStep
                        ? "bg-primary/60"
                        : i === wizardStep
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                    title={s.title}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Step {wizardStep + 1} of {WIZARD_STEPS.length}
                </span>
                <span className="text-xs font-medium text-foreground">{WIZARD_STEPS[wizardStep].title}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={wizardStep}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                {/* ── Step 1: Door Type ───────────────────────────────────── */}
                {wizardStep === 0 && (
                  <div>
                    <h1 className="text-lg font-semibold text-foreground mb-1">What type of door?</h1>
                    <p className="text-xs text-muted-foreground mb-4">
                      Door type determines governing ANSI/BHMA standard, safety zone geometry, and required sensor set.
                    </p>
                    <div className="flex flex-col gap-2">
                      {(Object.keys(DOOR_META) as DoorType[]).map((dt) => (
                        <OptionCard
                          key={dt}
                          label={DOOR_TYPE_LABELS[dt]}
                          sublabel={`${DOOR_META[dt].desc} · ${DOOR_META[dt].standard}`}
                          selected={config.doorType === dt}
                          onClick={() => update("doorType", dt)}
                          icon={DOOR_META[dt].icon}
                          testId={`door-type-${dt}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Step 2: Energy Class ────────────────────────────────── */}
                {wizardStep === 1 && (
                  <div>
                    <h1 className="text-lg font-semibold text-foreground mb-1">Energy Class</h1>
                    <p className="text-xs text-muted-foreground mb-4">
                      The energy class determines governing standard, maximum opening speed, sensor requirements, and force limits.
                    </p>
                    <div className="flex flex-col gap-2">
                      {(["full_energy", "low_energy", "power_assist"] as EnergyClass[]).map((ec) => {
                        const meta = ENERGY_COMPAT[ec];
                        const applicable = meta.applicableTo.includes(config.doorType) || config.doorType === "power_assist";
                        const isHealthcareNote = (config.doorType === "hermetic" || config.doorType === "ICU") && ec !== "full_energy";
                        return (
                          <OptionCard
                            key={ec}
                            label={meta.label}
                            sublabel={
                              isHealthcareNote
                                ? "Not applicable — hermetic/ICU doors require Full Energy (A156.10 healthcare provisions apply)"
                                : meta.desc
                            }
                            badge={
                              ec === "full_energy" && (config.doorType === "hermetic" || config.doorType === "ICU")
                                ? "A156.10 Healthcare"
                                : ec === "full_energy"
                                ? "Most Common"
                                : undefined
                            }
                            selected={config.energyClass === ec}
                            onClick={() => update("energyClass", ec)}
                            disabled={isHealthcareNote}
                            dimmed={!applicable && !isHealthcareNote}
                            testId={`energy-class-${ec}`}
                          />
                        );
                      })}
                    </div>
                    {(config.doorType === "hermetic" || config.doorType === "ICU") && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex gap-2 items-start">
                          <Info size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            Hermetic and ICU doors must comply with A156.10-2024 healthcare provisions. FGI 2022 Guidelines for Design and Construction of Hospitals also apply. Pre-cycle fault monitoring (§8.3) is mandatory.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 3: Location & Environment ─────────────────────── */}
                {wizardStep === 2 && (
                  <div>
                    <h1 className="text-lg font-semibold text-foreground mb-1">Location & Environment</h1>
                    <p className="text-xs text-muted-foreground mb-4">
                      Florida county selection triggers HVHZ evaluation. Miami-Dade and Broward require NOA product approval and TAS testing.
                    </p>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-foreground mb-2">Installation</div>
                      <div className="flex gap-2">
                        <OptionCard
                          label="Interior"
                          sublabel="Not exposed to weather"
                          selected={!config.isExterior}
                          onClick={() => update("isExterior", false)}
                          testId="location-interior"
                        />
                        <OptionCard
                          label="Exterior"
                          sublabel="Exposed — HVHZ check applies"
                          selected={config.isExterior}
                          onClick={() => update("isExterior", true)}
                          testId="location-exterior"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-foreground mb-2">Florida County</div>
                      <select
                        data-testid="select-fl-county"
                        value={config.flCounty}
                        onChange={(e) => update("flCounty", e.target.value)}
                        className="w-full border border-border rounded-lg bg-card text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">— Not in Florida —</option>
                        {FL_COUNTIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {config.isExterior && (config.flCounty === "Miami-Dade" || config.flCounty === "Broward") && (
                        <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div className="flex gap-2 items-start">
                            <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                              <strong>HVHZ detected.</strong> Miami-Dade and Broward exterior doors require a Florida Product Approval (NOA). TAS 201/202/203 test standards apply. FBC 9th Ed. §1709.5.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-foreground mb-2">Climate Zone (IECC)</div>
                      <div className="grid grid-cols-3 gap-2">
                        {["1A (Hot-Humid)", "2A (Mixed-Humid)", "3A (Warm-Humid)"].map((zone) => (
                          <button
                            key={zone}
                            data-testid={`location-${zone.split(" ")[0]}`}
                            className="text-xs border border-border rounded-lg p-2 text-center hover:border-primary/40 bg-card text-muted-foreground hover:text-foreground transition-all"
                          >
                            {zone.split(" ")[0]}
                            <div className="text-[10px] mt-0.5 opacity-70">{zone.split(" ").slice(1).join(" ")}</div>
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5">Florida is IECC Climate Zones 1A–2A. Infiltration standard IECC C402.5 applies to exterior automatic doors.</p>
                    </div>
                  </div>
                )}

                {/* ── Step 4: Occupancy & Use ────────────────────────────── */}
                {wizardStep === 3 && (
                  <div>
                    <h1 className="text-lg font-semibold text-foreground mb-1">Occupancy & Use</h1>
                    <p className="text-xs text-muted-foreground mb-4">
                      IBC 2024 §1105.1.1 mandates at least one automatic door at accessible entrances above certain occupant loads. Adopted in FBC 9th Ed. (eff. Dec 31, 2026).
                    </p>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-foreground mb-2">Occupancy Type</div>
                      <div className="flex flex-col gap-2">
                        {OCCUPANCY_OPTIONS.map((o) => (
                          <OptionCard
                            key={o.value}
                            label={o.label}
                            sublabel={o.desc}
                            selected={config.occupancyType === o.value}
                            onClick={() => update("occupancyType", o.value)}
                            testId={`occupancy-${o.value}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-foreground mb-2">Traffic Volume</div>
                      <div className="grid grid-cols-2 gap-2">
                        {TRAFFIC_OPTIONS.map((t) => (
                          <OptionCard
                            key={t.value}
                            label={t.label}
                            sublabel={t.desc}
                            selected={config.trafficVolume === t.value}
                            onClick={() => update("trafficVolume", t.value)}
                            testId={`occupancy-traffic-${t.value}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="border border-border rounded-lg px-4 py-1 bg-card">
                      <ToggleOption
                        id="ada"
                        label="ADA Path of Travel"
                        sublabel="Door is on an accessible route — ADA §404.3 force, timing, and sensor zone requirements apply"
                        checked={config.adaPathOfTravel}
                        onChange={(v) => update("adaPathOfTravel", v)}
                      />
                    </div>
                  </div>
                )}

                {/* ── Step 5: Additional Requirements ────────────────────── */}
                {wizardStep === 4 && (
                  <div>
                    <h1 className="text-lg font-semibold text-foreground mb-1">Additional Requirements</h1>
                    <p className="text-xs text-muted-foreground mb-4">
                      Select all conditions that apply. Each triggers specific code provisions and product requirements.
                    </p>

                    {/* HVHZ pre-fill indicator */}
                    {config.isExterior && (config.flCounty === "Miami-Dade" || config.flCounty === "Broward") && (
                      <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex gap-2 items-start">
                          <Shield size={13} className="text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-foreground">
                            <strong>HVHZ pre-filled</strong> from Step 3 — {config.flCounty} exterior door requires Florida NOA. TAS 201/202/203 water infiltration test (FBC 9th Ed.) applies.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="border border-border rounded-lg px-4 py-1 bg-card mb-4">
                      <ToggleOption
                        id="fire-rated"
                        label="Fire-Rated Assembly"
                        sublabel="Door is in a fire-rated wall — operator must comply with UL 10C or NFPA 252; FBC §706 applies"
                        checked={config.isFireRated}
                        onChange={(v) => update("isFireRated", v)}
                      />
                      <ToggleOption
                        id="access-control"
                        label="Access Control Integration"
                        sublabel="Card reader, keypad, or biometric integrated — affects fail-safe/fail-secure mode, egress must remain always-operable"
                        checked={config.accessControl}
                        onChange={(v) => update("accessControl", v)}
                      />
                      <ToggleOption
                        id="clean-room"
                        label="Clean Room / Controlled Environment"
                        sublabel="ISO 3 or higher clean room — triggers hermetic/airtight seal requirements and pressure differential control"
                        checked={config.cleanRoom}
                        onChange={(v) => update("cleanRoom", v)}
                      />
                    </div>

                    {config.cleanRoom && config.doorType !== "hermetic" && (
                      <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex gap-2 items-start">
                          <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-700 dark:text-amber-300">
                            Clean room environments typically require a Hermetic door type for ISO 3 pressure differential. Consider changing door type to Hermetic.
                          </p>
                        </div>
                      </div>
                    )}

                    {config.isFireRated && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex gap-2 items-start">
                          <AlertTriangle size={13} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-red-700 dark:text-red-300">
                            Fire-rated automatic doors require separate UL 10C listing for the operator assembly. The door, frame, hardware, and operator must all be tested as a system. Coordinate with the AHJ early.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Navigation buttons ───────────────────────────────────────── */}
            <div className="flex items-center gap-3 mt-6">
              {wizardStep > 0 && (
                <Button
                  data-testid="btn-back"
                  variant="outline"
                  size="sm"
                  onClick={() => setWizardStep((s) => s - 1)}
                  className="flex items-center gap-1.5"
                >
                  <ChevronLeft size={14} />
                  Back
                </Button>
              )}
              <div className="flex-1" />
              {!isLastStep ? (
                <Button
                  data-testid="btn-next"
                  size="sm"
                  onClick={() => setWizardStep((s) => s + 1)}
                  className="flex items-center gap-1.5"
                >
                  Next
                  <ChevronRight size={14} />
                </Button>
              ) : (
                <Button
                  data-testid="btn-run-check"
                  size="sm"
                  onClick={handleRun}
                  className="flex items-center gap-1.5 bg-primary text-primary-foreground"
                >
                  <Shield size={14} />
                  Run Compliance Check
                </Button>
              )}
            </div>

            {/* Quick config summary (if results showing) */}
            {showResults && (
              <div className="mt-5 p-3 bg-muted/30 border border-border rounded-lg">
                <div className="text-xs font-medium text-foreground mb-2">Current Configuration</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div><span className="font-medium text-foreground">Door:</span> {DOOR_TYPE_LABELS[config.doorType]}</div>
                  <div><span className="font-medium text-foreground">Energy:</span> {ENERGY_CLASS_LABELS[config.energyClass]}</div>
                  <div><span className="font-medium text-foreground">Location:</span> {config.isExterior ? "Exterior" : "Interior"}{config.flCounty ? ` · ${config.flCounty}, FL` : ""}</div>
                  <div><span className="font-medium text-foreground">Occupancy:</span> {OCCUPANCY_LABELS[config.occupancyType]}</div>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              RIGHT PANEL: Compliance Output
          ═══════════════════════════════════════════════════════════════════ */}
          {showResults && complianceResult && (
            <AnimatePresence>
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Tab navigation */}
                <div className="flex gap-0.5 mb-4 overflow-x-auto pb-1">
                  {OUTPUT_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      data-testid={`tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >

                    {/* ════════════════════════════════════════════════════
                        TAB 1: Compliance Summary
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "summary" && (
                      <div>
                        {/* Governing standard banner */}
                        <div className="mb-4 p-3 bg-primary/8 border border-primary/20 rounded-lg flex items-center gap-3">
                          <FileText size={18} className="text-primary flex-shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-primary">{complianceResult.primaryStandard}</div>
                            <div className="text-xs text-muted-foreground">{complianceResult.summaryLabel}</div>
                          </div>
                        </div>

                        {/* Traffic light */}
                        <div className={`mb-4 p-4 rounded-lg border flex items-center gap-4 ${
                          statusColor === "red"
                            ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                            : statusColor === "amber"
                            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                            : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                            statusColor === "red" ? "bg-red-500" : statusColor === "amber" ? "bg-amber-500" : "bg-green-500"
                          }`}>
                            {statusColor === "red" ? (
                              <XCircle size={20} className="text-white" />
                            ) : statusColor === "amber" ? (
                              <AlertTriangle size={20} className="text-white" />
                            ) : (
                              <CheckCircle2 size={20} className="text-white" />
                            )}
                          </div>
                          <div>
                            <div className={`text-base font-bold ${
                              statusColor === "red" ? "text-red-700 dark:text-red-400" : statusColor === "amber" ? "text-amber-700 dark:text-amber-400" : "text-green-700 dark:text-green-400"
                            }`}>{statusLabel}</div>
                            <div className="text-xs text-muted-foreground">
                              {criticals.length} critical flag{criticals.length !== 1 ? "s" : ""} · {warnings.length} warning{warnings.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                          <div className="ml-auto flex gap-2">
                            <Badge className="bg-primary text-primary-foreground text-xs">{complianceResult.primaryStandard.split(" ")[0]}</Badge>
                          </div>
                        </div>

                        {/* Flags */}
                        {complianceResult.flags.length > 0 && (
                          <Section title="Compliance Flags" icon={<AlertTriangle size={14} />}>
                            <div className="flex flex-col gap-2">
                              {complianceResult.flags.map((flag, i) => (
                                <div
                                  key={i}
                                  data-testid={`flag-${i}`}
                                  className={`p-3 rounded-lg border ${
                                    flag.level === "critical"
                                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                                      : flag.level === "warning"
                                      ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                                      : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900"
                                  }`}
                                >
                                  <div className="flex gap-2 items-start">
                                    {flag.level === "critical" ? (
                                      <XCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                                    ) : flag.level === "warning" ? (
                                      <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div>
                                      <div className="text-sm font-medium text-foreground">{flag.title}</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">{flag.detail}</div>
                                      {flag.standard && (
                                        <div className="text-[10px] text-primary/80 mt-1 font-mono">{flag.standard}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Section>
                        )}

                        {/* Applicable Standards */}
                        <Section title="Applicable Standards" icon={<FileText size={14} />}>
                          <div className="flex flex-col gap-2">
                            {complianceResult.applicableStandards.map((s, i) => (
                              <div
                                key={i}
                                data-testid={`standard-${i}`}
                                className="flex items-start justify-between gap-3 p-3 bg-card border border-border rounded-lg"
                              >
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-foreground">{s.code}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">{s.description}</div>
                                  <Badge variant="secondary" className="mt-1.5 text-[10px] font-medium">{s.section}</Badge>
                                </div>
                                {s.url && (
                                  <a
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 transition-colors flex-shrink-0 mt-0.5"
                                  >
                                    <ExternalLink size={13} />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </Section>

                        {/* What's required vs. optional */}
                        <Section title="Quick Reference" icon={<CheckCircle2 size={14} />}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">Required</div>
                              <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                                {sensors.filter((s) => s.severity === "required").slice(0, 4).map((s, i) => (
                                  <li key={i} className="flex gap-1.5"><CheckCircle2 size={11} className="mt-0.5 flex-shrink-0" />{s.type}</li>
                                ))}
                                {signage.filter((s) => s.severity === "required").slice(0, 2).map((s, i) => (
                                  <li key={i} className="flex gap-1.5"><CheckCircle2 size={11} className="mt-0.5 flex-shrink-0" />Sign: "{s.text}"</li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                              <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Optional / Recommended</div>
                              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                {sensors.filter((s) => s.severity === "recommended").slice(0, 4).map((s, i) => (
                                  <li key={i} className="flex gap-1.5"><Info size={11} className="mt-0.5 flex-shrink-0" />{s.type}</li>
                                ))}
                                {sensors.filter((s) => s.severity === "recommended").length === 0 && (
                                  <li className="text-muted-foreground italic">No optional sensors for this configuration</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </Section>

                        {/* HVHZ callout if applicable */}
                        {hvhzResult.isHVHZ && config.isExterior && (
                          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700 rounded-lg mb-4">
                            <div className="flex gap-2 items-start">
                              <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-semibold text-amber-800 dark:text-amber-300">HVHZ — Florida NOA Required</div>
                                <div className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{hvhzResult.designPressure}</div>
                                <div className="text-xs text-amber-700 dark:text-amber-400">{hvhzResult.windSpeed}</div>
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {hvhzResult.tasStandards.map((t, i) => (
                                    <Badge key={i} className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300">{t}</Badge>
                                  ))}
                                </div>
                                {hvhzResult.astmStandards && hvhzResult.astmStandards.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {hvhzResult.astmStandards.map((a, i) => (
                                      <Badge key={i} className="text-[10px] bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-300">{a}</Badge>
                                    ))}
                                  </div>
                                )}
                                {hvhzResult.sl500R104Callout && (
                                  <div className="text-[10px] text-amber-800 dark:text-amber-200 mt-1.5 font-medium">{hvhzResult.sl500R104Callout}</div>
                                )}
                                <div
                                  className="mt-2 pt-2 border-t border-amber-300/60 dark:border-amber-700/40 text-[10px] text-red-700 dark:text-red-400 font-medium"
                                  data-testid="noa-expiry-note"
                                >
                                  Note: SL500 R104 current NOAs (25-0311.04 to 25-0311.10) issued March 2025, expire 2030–2031. FBC 9th Edition takes effect Dec 31, 2026 — update product approvals for permits on/after that date.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* IECC 2024 Vestibule Exemption card */}
                        <motion.div
                          data-testid="iecc-vestibule-card"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mb-4 p-3 rounded-lg border ${
                            iecc.isExempt
                              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                              : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          <div className="flex gap-2 items-start">
                            <CheckCircle2 size={14} className={`mt-0.5 flex-shrink-0 ${
                              iecc.isExempt ? "text-green-600 dark:text-green-400" : "text-blue-500"
                            }`} />
                            <div>
                              <div className={`text-xs font-semibold ${
                                iecc.isExempt ? "text-green-800 dark:text-green-300" : "text-blue-800 dark:text-blue-300"
                              }`}>
                                IECC 2024 — Climate Zone {iecc.climateZone}{iecc.isExempt ? " — Vestibule Not Mandatory" : " — Vestibule May Be Required"}
                              </div>
                              <div className={`text-[10px] mt-0.5 ${
                                iecc.isExempt ? "text-green-700 dark:text-green-400" : "text-blue-700 dark:text-blue-400"
                              }`}>{iecc.exemptionNote}</div>
                              <div className="text-[10px] text-muted-foreground mt-1">{iecc.ashrae901Note}</div>
                              <div className="text-[10px] font-mono text-primary/70 mt-1">{iecc.applicableCode}</div>
                            </div>
                          </div>
                        </motion.div>

                        {/* ADA Compliance Summary */}
                        <Section title="ADA / ICC A117.1 Compliance" icon={<Shield size={14} />}>
                          <div className="flex flex-col gap-2">
                            {adaResult.items.map((item, i) => (
                              <div
                                key={i}
                                data-testid={`ada-item-${i}`}
                                className={`p-3 rounded-lg border ${
                                  item.level === "required"
                                    ? "bg-card border-border"
                                    : item.level === "recommended"
                                    ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
                                    : "bg-muted/20 border-border"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="text-xs font-semibold text-foreground">{item.category}</div>
                                  <Badge
                                    className={`text-[10px] flex-shrink-0 ${
                                      item.level === "required"
                                        ? "bg-primary/10 text-primary border-primary/20"
                                        : item.level === "recommended"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {item.level}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">{item.requirement}</div>
                                <div className="text-[10px] font-semibold text-foreground mt-1">{item.value}</div>
                                {item.note && <div className="text-[10px] text-muted-foreground/70 italic mt-0.5">{item.note}</div>}
                                <div className="text-[10px] font-mono text-primary/60 mt-1">{item.standard}</div>
                              </div>
                            ))}
                          </div>
                        </Section>

                        {/* IBC 2024 Egress Checks */}
                        {egressResult.checks.length > 0 && (
                          <Section title="IBC 2024 Egress Compliance" icon={<HardHat size={14} />}>
                            <div className="flex flex-col gap-2">
                              {egressResult.checks.map((check, i) => (
                                <div
                                  key={check.id}
                                  data-testid={`egress-check-${i}`}
                                  className={`p-3 rounded-lg border ${
                                    check.level === "critical"
                                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                                      : check.level === "warning"
                                      ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                                      : "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
                                  }`}
                                >
                                  <div className="flex gap-2 items-start">
                                    {check.level === "critical" ? (
                                      <XCircle size={13} className="text-red-500 mt-0.5 flex-shrink-0" />
                                    ) : check.level === "warning" ? (
                                      <AlertTriangle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <Info size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div>
                                      <div className="text-xs font-semibold text-foreground">{check.title}</div>
                                      <div className="text-[10px] text-muted-foreground mt-0.5">{check.detail}</div>
                                      <div className="text-[10px] font-mono text-primary/60 mt-1">{check.standard}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {egressResult.reducedManeuvering && (
                                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg text-xs">
                                  <div className="font-semibold text-green-800 dark:text-green-300 mb-1">Reduced Maneuvering Clearance Benefit</div>
                                  <div className="text-green-700 dark:text-green-400">Pull side: {egressResult.reducedManeuvering.latchSidePull}</div>
                                  <div className="text-green-700 dark:text-green-400">Push side: {egressResult.reducedManeuvering.latchSidePush}</div>
                                  <div className="text-[10px] text-green-700/70 dark:text-green-400/70 mt-0.5">{egressResult.reducedManeuvering.note}</div>
                                  <div className="text-[10px] font-mono text-primary/60 mt-1">{egressResult.reducedManeuvering.standard}</div>
                                </div>
                              )}
                            </div>
                          </Section>
                        )}

                        {/* Product Recommendations with EnhancedProduct fields */}
                        {complianceResult.recommendedProducts.length > 0 && (
                          <Section title="Recommended Products" icon={<Award size={14} />}>
                            <div className="flex flex-col gap-3">
                              {complianceResult.recommendedProducts.map((p, i) => (
                                <div
                                  key={i}
                                  data-testid={`product-card-${i}`}
                                  className={`p-3.5 rounded-lg border ${
                                    p.isPrimaryRecommendation
                                      ? "bg-primary/5 border-primary/30"
                                      : "bg-card border-border"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <div>
                                      <div className="text-xs text-muted-foreground">{p.brand}</div>
                                      <div className="text-sm font-semibold text-foreground">{p.model}</div>
                                    </div>
                                    {p.isPrimaryRecommendation && (
                                      <Badge className="text-[10px] bg-primary text-primary-foreground flex-shrink-0">Primary</Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground mb-2">{p.rationale}</div>
                                  {/* Compliance score bar */}
                                  <div className="mb-2">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[10px] text-muted-foreground">Compliance Score</span>
                                      <span className="text-[10px] font-semibold text-foreground">{p.complianceScore}%</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${p.complianceScore}%` }}
                                      />
                                    </div>
                                  </div>
                                  {/* Standards met badges */}
                                  {p.standardsMet.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {p.standardsMet.map((std, j) => (
                                        <Badge key={j} variant="secondary" className="text-[10px]">{std}</Badge>
                                      ))}
                                    </div>
                                  )}
                                  {/* Crosswalk hint */}
                                  {p.crosswalkHint && (
                                    <button
                                      onClick={() => window.open("https://crosswalkdb-aadm.vercel.app", "_blank")}
                                      className="text-[10px] text-primary/80 italic mt-1 hover:text-primary hover:underline text-left block"
                                    >
                                      {p.crosswalkHint} → See matching ASSA ABLOY products in CrosswalkDB
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </Section>
                        )}

                        {/* AAADM Network Callout */}
                        <div
                          data-testid="aaadm-network-callout"
                          className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                        >
                          <div className="flex gap-2 items-start">
                            <Award size={14} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs font-semibold text-blue-800 dark:text-blue-300">AAADM Certified Technician Network</div>
                              <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">
                                ASSA ABLOY Entrance Systems products are serviced by AAADM-certified technicians. Certification is required for service on full-energy automatic doors in Florida — non-certified service voids product approvals and exposes owners to ADA and FBC liability. Use the AAADM tab to generate a full inspection checklist.
                              </div>
                              <button
                                data-testid="btn-goto-aaadm"
                                onClick={() => setActiveTab("aaadm")}
                                className="text-[10px] font-medium text-blue-700 dark:text-blue-300 underline mt-1 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                              >
                                View AAADM Requirements →
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Standards Reference panel */}
                        <div className="mt-4">
                          <button
                            data-testid="btn-standards-reference"
                            onClick={() => setStdPanelOpen(v => !v)}
                            className="flex items-center gap-2 w-full text-left p-3 bg-muted/40 hover:bg-muted/60 rounded-lg border border-border transition-colors"
                            aria-expanded={stdPanelOpen}
                          >
                            <FileText size={13} className="text-primary flex-shrink-0" />
                            <span className="text-xs font-semibold text-foreground flex-1">Standards Reference — Editions Applied</span>
                            {stdPanelOpen ? <ChevronUp size={13} className="text-muted-foreground" /> : <ChevronDown size={13} className="text-muted-foreground" />}
                          </button>
                          <AnimatePresence>
                            {stdPanelOpen && (
                              <motion.div
                                data-testid="standards-reference-panel"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="border border-t-0 border-border rounded-b-lg p-3 bg-card">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {[
                                      { code: "ANSI/BHMA A156.10", edition: "2024", scope: "Full-energy automatic pedestrian doors" },
                                      { code: "ANSI/BHMA A156.19", edition: "2019", scope: "Low-energy & power-assist swing doors" },
                                      { code: "ANSI/BHMA A156.38", edition: "2019", scope: "Low-energy automatic sliding doors" },
                                      { code: "ANSI/BHMA A156.27", edition: "2024", scope: "Revolving doors" },
                                      { code: "ADA Standards", edition: "2010", scope: "Accessible design for doors & entrances" },
                                      { code: "IBC", edition: "2024", scope: "Building code — egress & occupancy" },
                                      { code: "FBC", edition: "9th Ed. (eff. 12/31/2026)", scope: "Florida Building Code" },
                                      { code: "IECC", edition: "2024 C402.5.6", scope: "Energy code — vestibule requirements" },
                                      { code: "ASHRAE 90.1", edition: "2022", scope: "Energy efficiency — revolving door equivalency" },
                                      { code: "ICC A117.1", edition: "2017", scope: "Accessible & usable buildings" },
                                      { code: "FGI Guidelines", edition: "2022", scope: "Healthcare facilities design" },
                                      { code: "NFPA 101", edition: "2024", scope: "Life Safety Code" },
                                      { code: "ASHRAE 170", edition: "2021", scope: "Ventilation for healthcare facilities" },
                                      { code: "ASTM E1886/E1996", edition: "Current", scope: "HVHZ — impact resistance testing" },
                                      { code: "ASTM F842", edition: "2017", scope: "HVHZ — forced entry resistance" },
                                      { code: "Miami-Dade NOA / TAS", edition: "201/202/203", scope: "High-velocity hurricane zone product approval" },
                                    ].map((ref, i) => (
                                      <div key={i} className="flex flex-col gap-0.5 p-2 bg-muted/30 rounded">
                                        <div className="font-semibold text-foreground">{ref.code} <span className="font-normal text-primary/80">{ref.edition}</span></div>
                                        <div className="text-[10px] text-muted-foreground">{ref.scope}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* ════════════════════════════════════════════════════
                        TAB 2: Sensor Requirements
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "sensors" && (
                      <div>
                        {/* PM insight callout */}
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex gap-2 items-start">
                            <Info size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              <strong>Why sensor fault monitoring matters:</strong> Pre-cycle fault monitoring (A156.10-2024 §8.3, mandatory since 2017) prevents door activation when a sensor has failed, eliminating the most common cause of pedestrian impact incidents. Field service data shows sensor faults account for over 60% of automatic door liability claims.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {sensors.map((s, i) => (
                            <div
                              key={i}
                              data-testid={`sensor-card-${i}`}
                              className={`p-3.5 rounded-lg border ${
                                s.severity === "required"
                                  ? "bg-card border-border"
                                  : s.severity === "not_required"
                                  ? "bg-muted/20 border-border border-dashed opacity-60"
                                  : "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  {s.severity === "required" ? (
                                    <CheckCircle2 size={13} className="text-primary flex-shrink-0" />
                                  ) : s.severity === "not_required" ? (
                                    <XCircle size={13} className="text-muted-foreground flex-shrink-0" />
                                  ) : (
                                    <Info size={13} className="text-blue-500 flex-shrink-0" />
                                  )}
                                  <span className="text-sm font-medium text-foreground">{s.type}</span>
                                </div>
                                <SeverityBadge severity={s.severity} />
                              </div>
                              <Badge variant="secondary" className="text-[10px] mb-2">{s.technology}</Badge>
                              {s.monitoring && (
                                <Badge className="text-[10px] ml-1 mb-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                  §8.3 Monitored
                                </Badge>
                              )}
                              <p className="text-xs text-muted-foreground mb-1.5">{s.requirement}</p>
                              {s.coverageZone && (
                                <div className="text-[10px] text-foreground bg-muted/50 px-2 py-1 rounded font-mono mb-1">
                                  Zone: {s.coverageZone}
                                </div>
                              )}
                              {s.heightSpec && (
                                <div className="text-[10px] text-foreground bg-muted/50 px-2 py-1 rounded font-mono mb-1">
                                  {s.heightSpec}
                                </div>
                              )}
                              {s.adjustmentNote && (
                                <p className="text-[10px] text-muted-foreground italic">{s.adjustmentNote}</p>
                              )}
                              <div className="text-[10px] text-primary/70 font-mono mt-1">{s.standard}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ════════════════════════════════════════════════════
                        TAB 3: Force & Timing Specs
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "force" && (
                      <div>
                        {/* PM callout */}
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div className="flex gap-2 items-start">
                            <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                              <strong>The 30 lbf update:</strong> The 2024 edition of A156.10 reduced maximum obstacle detection force from 40 lbf to 30 lbf. This single change required motor torque recalibration and firmware recertification across virtually every major operator brand — representing a significant mid-cycle engineering cost for installed fleets.
                            </p>
                          </div>
                        </div>

                        {forceSpecs.length > 0 ? (
                          <div className="overflow-x-auto rounded-lg border border-border">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/60 border-b border-border">
                                  <th className="text-left text-xs font-semibold text-muted-foreground px-3 py-2">Requirement</th>
                                  <th className="text-right text-xs font-semibold text-muted-foreground px-3 py-2">Value</th>
                                  <th className="text-left text-xs font-semibold text-muted-foreground px-3 py-2">Unit</th>
                                  <th className="text-left text-xs font-semibold text-muted-foreground px-3 py-2 hidden sm:table-cell">Standard</th>
                                  <th className="text-center text-xs font-semibold text-muted-foreground px-3 py-2">2024</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {forceSpecs.map((spec, i) => {
                                  const is2024 = spec.editionYear >= 2024;
                                  return (
                                    <tr key={i} className={`hover:bg-muted/30 transition-colors ${is2024 ? "bg-amber-50/30 dark:bg-amber-950/10" : ""}`}>
                                      <td className="px-3 py-2.5">
                                        <div className="text-xs font-medium text-foreground">{spec.label}</div>
                                        {spec.note && <div className="text-[10px] text-muted-foreground mt-0.5">{spec.note}</div>}
                                      </td>
                                      <td className="px-3 py-2.5 text-right font-mono text-sm font-semibold text-foreground">{spec.value}</td>
                                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{spec.unit}</td>
                                      <td className="px-3 py-2.5 text-[10px] text-primary/70 font-mono hidden sm:table-cell">{spec.standard}</td>
                                      <td className="px-3 py-2.5 text-center">
                                        {is2024 && (
                                          <Badge className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Updated</Badge>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                            No force/timing specifications found for this door type and energy class combination.
                          </div>
                        )}

                        {/* Guide rail if applicable */}
                        {(() => {
                          const gr = getGuideRailSpec(doorConfig.doorType, doorConfig.energyClass);
                          if (!gr) return null;
                          return (
                            <div className="mt-4 p-3 bg-card border border-border rounded-lg">
                              <div className="text-xs font-semibold text-foreground mb-2">Guide Rail Requirement</div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div><span className="text-muted-foreground">Required:</span> <span className={gr.required ? "text-primary font-medium" : "text-muted-foreground"}>{gr.required ? "Yes" : "No"}</span></div>
                                <div><span className="text-muted-foreground">Side:</span> {gr.side}</div>
                                <div><span className="text-muted-foreground">Min Height:</span> {gr.minHeight}</div>
                                <div><span className="text-muted-foreground">Extent:</span> {gr.extent}</div>
                              </div>
                              {gr.note && <p className="text-xs text-muted-foreground mt-2 italic">{gr.note}</p>}
                              <div className="text-[10px] text-primary/70 font-mono mt-1">{gr.standard}</div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* ════════════════════════════════════════════════════
                        TAB 4: Signage Requirements
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "signage" && (
                      <div>
                        {signage.length === 0 ? (
                          <div className="p-8 text-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                            No signage requirements for this configuration.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {signage.map((s, i) => (
                              <div
                                key={i}
                                data-testid={`sign-${i}`}
                                className={`p-3.5 rounded-lg border ${
                                  s.severity === "required"
                                    ? "bg-card border-border"
                                    : "bg-muted/20 border-dashed border-border"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <Tag size={13} className="text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm font-mono font-semibold text-foreground">"{s.text}"</span>
                                  </div>
                                  <SeverityBadge severity={s.severity} />
                                </div>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                  <div className="flex gap-2">
                                    <span className="font-medium text-foreground w-20 flex-shrink-0">Size:</span>
                                    <span>{s.size}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="font-medium text-foreground w-20 flex-shrink-0">Height AFF:</span>
                                    <span>50 in. (A156.10-2024 §12.1, updated 2017)</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="font-medium text-foreground w-20 flex-shrink-0">Location:</span>
                                    <span>{s.placement}</span>
                                  </div>
                                  {s.background && (
                                    <div className="flex gap-2 items-center">
                                      <span className="font-medium text-foreground w-20 flex-shrink-0">Color:</span>
                                      <span
                                        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                                        style={{
                                          background: s.background === "Red" ? "#dc2626" : s.background === "Yellow" ? "#eab308" : "#374151",
                                          color: s.background === "Yellow" ? "black" : "white",
                                        }}
                                      >
                                        {s.background} bg
                                      </span>
                                      {s.letterColor && <span className="text-muted-foreground">/ {s.letterColor} letters</span>}
                                    </div>
                                  )}
                                </div>
                                <div className="text-[10px] text-primary/70 font-mono mt-2">{s.standard}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ════════════════════════════════════════════════════
                        TAB 5: Code References
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "codes" && (
                      <div>
                        {/* Filter bar */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <Filter size={13} className="text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">Filter by code body:</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {codeBodyOptions.map((body) => (
                              <button
                                key={body}
                                data-testid={`code-filter-${body}`}
                                onClick={() => setCodeFilter(body)}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                                  codeFilter === body
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                                }`}
                              >
                                {body === "all" ? "All" : body}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* HVHZ water infiltration warning */}
                        {hvhzResult.isHVHZ && config.isExterior && (
                          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700 rounded-lg">
                            <div className="flex gap-2 items-start">
                              <AlertTriangle size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">FBC 9th Ed. — TAS 203 Water Infiltration Warning</div>
                                <div className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                                  HVHZ exterior automatic doors must pass TAS 203 water infiltration testing (FBC 9th Ed.). This test was tightened in the 9th Edition. Many pre-2024 NOA certifications do not include TAS 203 — verify the product approval covers this test before specification.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="overflow-x-auto rounded-lg border border-border">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-muted/60 border-b border-border">
                                <th className="text-left font-semibold text-muted-foreground px-3 py-2 w-24">Code</th>
                                <th className="text-left font-semibold text-muted-foreground px-3 py-2 w-20">Section</th>
                                <th className="text-left font-semibold text-muted-foreground px-3 py-2">Requirement</th>
                                <th className="text-center font-semibold text-muted-foreground px-3 py-2 hidden md:table-cell w-16">Link</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {filteredCodes.map((cr, i) => {
                                const isHVHZRow = cr.code.includes("FBC") && hvhzResult.isHVHZ && config.isExterior;
                                return (
                                  <tr
                                    key={i}
                                    data-testid={`code-row-${i}`}
                                    className={`hover:bg-muted/30 transition-colors ${isHVHZRow ? "bg-amber-50/40 dark:bg-amber-950/10" : ""}`}
                                  >
                                    <td className="px-3 py-2.5">
                                      <div className="flex items-center gap-1.5">
                                        <Badge variant="secondary" className="text-[10px] font-semibold whitespace-nowrap">{cr.code}</Badge>
                                        {isHVHZRow && <AlertTriangle size={10} className="text-amber-500 flex-shrink-0" />}
                                      </div>
                                    </td>
                                    <td className="px-3 py-2.5 font-mono text-primary/80">{cr.section}</td>
                                    <td className="px-3 py-2.5 text-muted-foreground max-w-xs">
                                      <div className="line-clamp-2">{cr.requirement}</div>
                                    </td>
                                    <td className="px-3 py-2.5 text-center hidden md:table-cell">
                                      {cr.url && (
                                        <a
                                          href={cr.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:text-primary/70 transition-colors"
                                        >
                                          <ExternalLink size={12} />
                                        </a>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Showing {filteredCodes.length} of {CODE_REFERENCES.length} total references applicable to {DOOR_TYPE_LABELS[config.doorType]}
                        </div>
                      </div>
                    )}

                    {/* ════════════════════════════════════════════════════
                        TAB 6 (NEW): Energy Code
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "energy" && (
                      <div data-testid="energy-code-tab">
                        {/* Header */}
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex gap-2 items-start">
                            <Zap size={14} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-semibold text-green-800 dark:text-green-300">Energy Code — IECC 2024 + ASHRAE 90.1-2022</div>
                              <div className="text-xs text-green-700 dark:text-green-400 mt-0.5">Climate zone classification, vestibule exemption status, and energy performance opportunities for this configuration.</div>
                            </div>
                          </div>
                        </div>

                        {/* Climate Zone Card */}
                        <Section title="IECC 2024 Climate Zone" icon={<MapPin size={14} />}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 bg-card border border-border rounded-lg">
                              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Climate Zone</div>
                              <div className="text-2xl font-bold text-primary">{iecc.climateZone === "non_florida" ? "N/A" : iecc.climateZone}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {iecc.climateZone === "1A" ? "Hot-Humid — South Florida (Miami-Dade, Monroe, Broward, Palm Beach)" :
                                 iecc.climateZone === "2A" ? "Mixed-Humid — Central/North Florida" :
                                 "Non-Florida Jurisdiction — verify local climate zone"}
                              </div>
                            </div>
                            <div className={`p-3 rounded-lg border ${
                              iecc.isExempt
                                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                            }`}>
                              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Vestibule Mandate</div>
                              <div className={`text-sm font-bold ${
                                iecc.isExempt ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"
                              }`}>{iecc.isExempt ? "EXEMPT" : "MAY APPLY"}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">{iecc.applicableCode}</div>
                            </div>
                          </div>
                        </Section>

                        {/* Exemption Detail */}
                        <Section title="IECC 2024 C402.5.6 — Exemption Detail" icon={<CheckCircle2 size={14} />}>
                          <div className="p-3 bg-card border border-border rounded-lg">
                            <div className="text-xs text-foreground mb-2">{iecc.exemptionNote}</div>
                            <div className="text-xs text-muted-foreground border-t border-border pt-2 mt-2">
                              <span className="font-semibold">ASHRAE 90.1-2022 Note:</span> {iecc.ashrae901Note}
                            </div>
                          </div>
                        </Section>

                        {/* Energy Benefit */}
                        <Section title="Energy Performance Opportunity" icon={<Zap size={14} />}>
                          <div className="flex flex-col gap-3">
                            <div className="p-3 bg-card border border-border rounded-lg">
                              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Infiltration Reduction</div>
                              <div className="text-xs text-foreground">{iecc.energyBenefitNote}</div>
                            </div>
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                              <div className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">LEED Credit Opportunity</div>
                              <div className="text-xs text-foreground">{iecc.leedNote}</div>
                            </div>
                          </div>
                        </Section>

                        {/* ASHRAE 90.1-2022 Note */}
                        <div className="p-3 bg-muted/30 border border-border rounded-lg">
                          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">ASHRAE 90.1-2022 §5.4.3 — Revolving Door Equivalency</div>
                          <div className="text-xs text-muted-foreground">
                            ASHRAE 90.1-2022 recognizes revolving doors as vestibule equivalents for energy code compliance. A revolving door entry in a Florida project can be documented as equivalent to or better than a vestibule in energy models. This is a key differentiator for ASSA ABLOY revolving door products vs. swing/sliding in LEED-certified projects.
                          </div>
                          <div className="text-[10px] font-mono text-primary/70 mt-1">ASHRAE 90.1-2022 §5.4.3 / IECC 2024 C402.5.6</div>
                        </div>
                      </div>
                    )}

                    {/* ════════════════════════════════════════════════════
                        TAB 7: Spec Sheet
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "specsheet" && (
                      <div>
                        {!specGenerated ? (
                          <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="p-4 bg-primary/5 rounded-full">
                              <FileText size={32} className="text-primary" />
                            </div>
                            <div className="text-center">
                              <h3 className="text-base font-semibold text-foreground mb-1">Generate Spec Sheet</h3>
                              <p className="text-sm text-muted-foreground max-w-sm">
                                Compile a complete project specification from your configuration — sensors, force/timing, signage, code references, recommended products, and PM notes.
                              </p>
                            </div>
                            <Button
                              data-testid="btn-generate-spec"
                              onClick={handleGenerateSpec}
                              className="flex items-center gap-2"
                            >
                              <FileText size={15} />
                              Generate Spec Sheet
                            </Button>
                          </div>
                        ) : specSheet ? (
                          <div data-testid="spec-sheet-output">
                            {/* Header actions */}
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-sm font-semibold text-foreground">Project Specification</h3>
                                <p className="text-xs text-muted-foreground">Generated {specSheet.generatedDate}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  data-testid="btn-copy-spec"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copy(specSheetText)}
                                  className="flex items-center gap-1.5 text-xs"
                                >
                                  {copied ? <Check size={13} className="text-green-500" /> : <ClipboardCopy size={13} />}
                                  {copied ? "Copied!" : "Copy as Text"}
                                </Button>
                                <Button
                                  data-testid="btn-regenerate-spec"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleGenerateSpec}
                                  className="text-xs"
                                >
                                  Regenerate
                                </Button>
                              </div>
                            </div>

                            {/* Config summary */}
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                              <div className="text-xs font-semibold text-primary mb-2">Project Configuration</div>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                <div><span className="text-muted-foreground">Door Type:</span> <span className="font-medium text-foreground">{DOOR_TYPE_LABELS[specSheet.doorType]}</span></div>
                                <div><span className="text-muted-foreground">Energy Class:</span> <span className="font-medium text-foreground">{ENERGY_CLASS_LABELS[specSheet.energyClass]}</span></div>
                                <div><span className="text-muted-foreground">Location:</span> <span className="font-medium text-foreground">{specSheet.location}</span></div>
                                <div><span className="text-muted-foreground">Occupancy:</span> <span className="font-medium text-foreground">{OCCUPANCY_LABELS[specSheet.occupancyType]}</span></div>
                              </div>
                            </div>

                            {/* Required Sensors */}
                            <Section title="Required Sensors" icon={<Zap size={14} />}>
                              <div className="flex flex-col gap-1.5">
                                {specSheet.requiredSensors.filter((s) => s.severity === "required").map((s, i) => (
                                  <div key={i} className="flex items-start gap-2 p-2.5 bg-card border border-border rounded-lg">
                                    <CheckCircle2 size={12} className="text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="text-xs font-medium text-foreground">{s.type}</div>
                                      <div className="text-[10px] text-muted-foreground">{s.requirement}</div>
                                      <div className="text-[10px] font-mono text-primary/70">{s.standard}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Section>

                            {/* Force & Timing */}
                            <Section title="Force & Timing" icon={<Shield size={14} />}>
                              {specSheet.forceTimingSpecs.length > 0 ? (
                                <div className="overflow-x-auto rounded-lg border border-border">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="bg-muted/60 border-b border-border">
                                        <th className="text-left font-semibold text-muted-foreground px-3 py-2">Requirement</th>
                                        <th className="text-right font-semibold text-muted-foreground px-3 py-2">Value</th>
                                        <th className="text-left font-semibold text-muted-foreground px-3 py-2">Unit</th>
                                        <th className="text-left font-semibold text-muted-foreground px-3 py-2 hidden sm:table-cell">Standard</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                      {specSheet.forceTimingSpecs.map((f, i) => (
                                        <tr key={i} className="hover:bg-muted/30">
                                          <td className="px-3 py-2 font-medium text-foreground">{f.label}</td>
                                          <td className="px-3 py-2 text-right font-mono font-bold text-foreground">{f.value}</td>
                                          <td className="px-3 py-2 text-muted-foreground">{f.unit}</td>
                                          <td className="px-3 py-2 font-mono text-primary/70 hidden sm:table-cell">{f.standard}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">No force/timing specs for this configuration.</p>
                              )}
                            </Section>

                            {/* Signage */}
                            <Section title="Signage Requirements" icon={<Tag size={14} />}>
                              <div className="flex flex-col gap-1.5">
                                {specSheet.signageRequirements.filter((s) => s.severity === "required").map((s, i) => (
                                  <div key={i} className="flex items-start gap-2 p-2.5 bg-card border border-border rounded-lg">
                                    <Tag size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="text-xs font-mono font-semibold text-foreground">"{s.text}"</div>
                                      <div className="text-[10px] text-muted-foreground">{s.size} · {s.placement}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Section>

                            {/* Applicable Code References */}
                            <Section title="Applicable Code References" icon={<FileText size={14} />}>
                              <div className="flex flex-col gap-1.5">
                                {specSheet.codeReferences.slice(0, 8).map((cr, i) => (
                                  <div key={i} className="flex items-start gap-2 p-2.5 bg-card border border-border rounded-lg">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="secondary" className="text-[10px]">{cr.code} {cr.section}</Badge>
                                        {cr.url && (
                                          <a href={cr.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/70">
                                            <ExternalLink size={10} />
                                          </a>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{cr.requirement}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Section>

                            {/* Recommended Products (EnhancedProduct) */}
                            {specSheet.recommendedProducts.length > 0 && (
                              <Section title="Recommended Products" icon={<Award size={14} />}>
                                <div className="flex flex-col gap-2">
                                  {specSheet.recommendedProducts.map((p, i) => (
                                    <div
                                      key={i}
                                      data-testid={`spec-product-${i}`}
                                      className={`p-3 rounded-lg border ${
                                        p.isPrimaryRecommendation
                                          ? "bg-primary/5 border-primary/30"
                                          : "bg-card border-border"
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                          <div className="text-[10px] text-muted-foreground">{p.brand}</div>
                                          <div className="text-xs font-semibold text-foreground">{p.model}</div>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                          {p.isPrimaryRecommendation && (
                                            <Badge className="text-[10px] bg-primary text-primary-foreground">Primary</Badge>
                                          )}
                                          <Badge variant="secondary" className="text-[10px]">{p.complianceScore}%</Badge>
                                        </div>
                                      </div>
                                      <div className="text-[10px] text-muted-foreground mb-1.5">{p.rationale}</div>
                                      {p.standardsMet.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-1">
                                          {p.standardsMet.map((std, j) => (
                                            <Badge key={j} variant="outline" className="text-[10px]">{std}</Badge>
                                          ))}
                                        </div>
                                      )}
                                      {p.crosswalkHint && (
                                        <button
                                          onClick={() => window.open("https://crosswalkdb-aadm.vercel.app", "_blank")}
                                          className="text-[10px] text-primary/80 italic hover:text-primary hover:underline text-left block"
                                        >
                                          {p.crosswalkHint} → See matching ASSA ABLOY products in CrosswalkDB
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </Section>
                            )}

                            {/* PM Notes */}
                            {specSheet.pmNotes.length > 0 && (
                              <Section title="PM Notes" icon={<Info size={14} />}>
                                <div className="flex flex-col gap-2">
                                  {specSheet.pmNotes.map((note, i) => (
                                    <div key={i} className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                      <Info size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                      <p className="text-xs text-blue-700 dark:text-blue-300">{note}</p>
                                    </div>
                                  ))}
                                </div>
                              </Section>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* ════════════════════════════════════════════════════
                        TAB 7: AAADM Requirements
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "aaadm" && (
                      <AAADMTab doorType={doorConfig.doorType} />
                    )}

                    {/* ════════════════════════════════════════════════════
                        TAB 8: Architectural Specs
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "archspecs" && (
                      <ArchSpecsTab doorType={doorConfig.doorType} />
                    )}

                    {/* ════════════════════════════════════════════════════
                        TAB 9: TCO / Energy Calculator
                    ════════════════════════════════════════════════════ */}
                    {activeTab === "tco" && (
                      <TCOCalculatorTab />
                    )}

                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
