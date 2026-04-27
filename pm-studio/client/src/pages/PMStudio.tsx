import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { TrendingUp, Globe2, BarChart3, Signal, Eye, Cpu, Target, Zap, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  AreaChart, Area, LineChart, Line, ReferenceLine,
} from "recharts";
import {
  roadmapItems, stageCriteria, handoffTemplates, vocEntries, resourceData,
  marketVerticals, stateMarketData, teamMembers,
  gateOrder, gateFullName, gateShortName, getNextGate, getGateCriteria,
  getPortfolioStats, getLinkedItems, getTeamMember,
  statusColors, impactColors, brandColors,
  productLineHealthData, verticalForecasts, constructionSignals, opportunityStates,
  regulatoryTimeline, revenueScenarios, activeDeals, signalFeed, npsTrendData, ttmKpis,
  WIN_LOSS_DATA, MARKET_INTELLIGENCE, iotRoadmapItems,
  type RoadmapItem, type RoadmapStatus, type GateStage, type HandoffType,
  type Brand, type Vertical, type Comment, type TeamMember, type StateMarketData,
  type ProductLineHealth, type VerticalForecast, type DealVelocityItem, type MarketSignalFeed,
  type RegEventItem, type RevenueScenario, type WinLossEntry,
} from "@/lib/pmStudio";

// ─── STATIC_STATE_DATA — flattened view of stateMarketData for Intelligence tab ─────
const STATIC_STATE_DATA = stateMarketData.map((s) => ({
  state: s.stateName,
  stateCode: s.stateCode,
  region: s.region,
  buildingCode: s.primaryBuildingCode,
  marketOpportunity: s.marketOpportunity,
  keyVerticals: s.keyVerticals,
  hvhz: s.hvhzCounties.length > 0,
  annualConstructionVolume: s.annualConstructionBillions,
  notes: s.complianceNotes,
  distributorCount: s.aaDistributorCount,
}));

// ─── Tab Config ───────────────────────────────────────────────────────────────

const tabList = [
  { id: "portfolio", label: "Portfolio", icon: "⬡" },
  { id: "roadmap", label: "Roadmap", icon: "◈" },
  { id: "analytics", label: "Analytics", icon: "◎" },
  { id: "stagegate", label: "Stage-Gate", icon: "◇" },
  { id: "handoffs", label: "Handoffs", icon: "⇌" },
  { id: "launch-readiness", label: "Launch", icon: "◎" },
  { id: "voc", label: "VOC", icon: "◉" },
  { id: "winloss", label: "Win/Loss", icon: "◐" },
  { id: "capacity", label: "Capacity", icon: "▤" },
  { id: "forecast", label: "Forecast", icon: "◬" },
  { id: "intelligence", label: "Intelligence", icon: "◆" },
  { id: "market-intel", label: "Market Intel", icon: "◎" },
] as const;

type TabId = (typeof tabList)[number]["id"];

// ─── Palette ──────────────────────────────────────────────────────────────────

const PIE_COLORS = ["#14b8a6", "#3b82f6", "#f59e0b", "#a78bfa", "#f43f5e", "#22c55e"];

const gateProgressColors: Record<GateStage, string> = {
  G0_idea: "bg-slate-400",
  G1_scoping: "bg-sky-500",
  G2_business_case: "bg-blue-500",
  G3_development: "bg-indigo-500",
  G4_testing: "bg-amber-500",
  G5_launch: "bg-teal-500",
  sustain: "bg-green-500",
  eol: "bg-red-500",
};

const gateTextColors: Record<GateStage, string> = {
  G0_idea: "text-slate-500",
  G1_scoping: "text-sky-600",
  G2_business_case: "text-blue-600",
  G3_development: "text-indigo-600",
  G4_testing: "text-amber-600",
  G5_launch: "text-teal-600",
  sustain: "text-green-600",
  eol: "text-red-600",
};

const statusDot: Record<RoadmapStatus, string> = {
  concept: "bg-slate-400",
  development: "bg-blue-500",
  testing: "bg-amber-500",
  launch: "bg-teal-500",
  sustain: "bg-green-500",
  eol: "bg-red-500",
};

const priorityColors: Record<string, string> = {
  P0: "bg-rose-500",
  P1: "bg-orange-500",
  P2: "bg-yellow-500",
  P3: "bg-slate-400",
};

// ─── Static Activity Feed Data ─────────────────────────────────────────────

const activityFeed = [
  { id: 1, user: "J. Tubbs", initials: "JT", color: "bg-teal-500", action: "commented on", item: "SW300-S App Configuration", time: "2 hours ago", type: "comment" },
  { id: 2, user: "M. Rivera", initials: "MR", color: "bg-indigo-500", action: "updated", item: "RD100 HVHZ Re-Testing to G4", time: "4 hours ago", type: "update" },
  { id: 3, user: "A. Chen", initials: "AC", color: "bg-violet-500", action: "added comment on", item: "RECORD TSA 160 NA Certification", time: "Yesterday", type: "comment" },
  { id: 4, user: "S. Patel", initials: "SP", color: "bg-amber-500", action: "completed gate review for", item: "VersaMax FGI 2022 Compliance", time: "Yesterday", type: "gate" },
  { id: 5, user: "J. Tubbs", initials: "JT", color: "bg-teal-500", action: "linked VOC entry to", item: "SW300 Slim-Header Initiative", time: "2 days ago", type: "link" },
  { id: 6, user: "K. Lawson", initials: "KL", color: "bg-sky-500", action: "uploaded spec for", item: "RECORD INORA NA Launch", time: "2 days ago", type: "upload" },
  { id: 7, user: "M. Rivera", initials: "MR", color: "bg-indigo-500", action: "flagged risk on", item: "SL521 NOA Recertification", time: "3 days ago", type: "risk" },
  { id: 8, user: "A. Chen", initials: "AC", color: "bg-violet-500", action: "moved", item: "ecoLOGIC AI Rollout to G4", time: "3 days ago", type: "gate" },
  { id: 9, user: "S. Patel", initials: "SP", color: "bg-amber-500", action: "added KPI to", item: "Hermetic Sliding Door Concept", time: "4 days ago", type: "update" },
  { id: 10, user: "J. Tubbs", initials: "JT", color: "bg-teal-500", action: "created initiative", item: "OSDP v2 Access Integration", time: "5 days ago", type: "create" },
];

const activityTypeIcon: Record<string, string> = {
  comment: "💬",
  update: "✏️",
  gate: "◇",
  link: "🔗",
  upload: "📎",
  risk: "⚠️",
  create: "✨",
};

// ─── Static gate history per item ─────────────────────────────────────────
const gateHistory: Record<string, { gate: string; date: string; decision: string; reviewer: string }[]> = {
  "rm-001": [
    { gate: "G0", date: "Oct 12, 2024", decision: "GO", reviewer: "J. Tubbs" },
    { gate: "G1", date: "Nov 18, 2024", decision: "GO", reviewer: "VP PM" },
    { gate: "G2", date: "Jan 8, 2025", decision: "GO", reviewer: "VP PM + Finance" },
  ],
  "rm-002": [
    { gate: "G0", date: "Aug 5, 2024", decision: "GO", reviewer: "J. Tubbs" },
    { gate: "G1", date: "Sep 12, 2024", decision: "GO", reviewer: "VP PM" },
    { gate: "G2", date: "Oct 22, 2024", decision: "GO", reviewer: "VP PM + Finance" },
    { gate: "G3", date: "Dec 3, 2024", decision: "GO", reviewer: "Full Review Board" },
  ],
  "rm-003": [
    { gate: "G0", date: "Mar 2, 2024", decision: "GO", reviewer: "M. Rivera" },
    { gate: "G1", date: "Apr 15, 2024", decision: "GO", reviewer: "VP PM" },
    { gate: "G2", date: "Jun 10, 2024", decision: "GO — with conditions", reviewer: "VP PM + Regulatory" },
    { gate: "G3", date: "Aug 20, 2024", decision: "GO", reviewer: "Full Review Board" },
  ],
};

// ─── Static stakeholder approvers ─────────────────────────────────────────
const stageApprovers = [
  { name: "VP Product Management", role: "VP PM", required: true },
  { name: "VP Engineering", role: "VP Eng", required: true },
  { name: "Finance Controller", role: "Finance", required: true },
  { name: "Regulatory Affairs Lead", role: "Regulatory", required: false },
  { name: "Marketing Lead", role: "Marketing", required: false },
];

// ─── Static sprint data ────────────────────────────────────────────────────
const sprintData = [
  { person: "J. Tubbs", tasks: ["SW300-S App Review", "Gate Prep G4"], pct: 85 },
  { person: "A. Chen", tasks: ["ecoLOGIC Testing", "OTA Monitoring"], pct: 95 },
  { person: "M. Rivera", tasks: ["SL521 NOA Lab", "FBC Audit Review"], pct: 78 },
  { person: "S. Patel", tasks: ["VersaMax FGI Compliance"], pct: 60 },
  { person: "K. Lawson", tasks: ["TSA 160 Sales Training", "Distributor Onboarding"], pct: 72 },
  { person: "R. Nguyen", tasks: ["INORA Spec Sheet", "OSDP v2 Docs"], pct: 90 },
  { person: "D. Martinez", tasks: ["Hermetic Door Concept", "Regulatory Research"], pct: 45 },
];

// ─── Static team members fallback ─────────────────────────────────────────
const fallbackTeamMembers: TeamMember[] = [
  { id: "tm-001", name: "J. Tubbs", initials: "JT", role: "Senior Product Manager", color: "bg-teal-500", department: "PM" },
  { id: "tm-002", name: "A. Chen", initials: "AC", role: "Product Manager", color: "bg-violet-500", department: "PM" },
  { id: "tm-003", name: "M. Rivera", initials: "MR", role: "Regulatory PM", color: "bg-indigo-500", department: "PM" },
  { id: "tm-004", name: "S. Patel", initials: "SP", role: "Engineering PM", color: "bg-amber-500", department: "Engineering" },
  { id: "tm-005", name: "K. Lawson", initials: "KL", role: "Sales Enablement", color: "bg-sky-500", department: "Sales Enablement" },
  { id: "tm-006", name: "R. Nguyen", initials: "RN", role: "UX Designer", color: "bg-pink-500", department: "UX/Design" },
  { id: "tm-007", name: "D. Martinez", initials: "DM", role: "QA Engineer", color: "bg-orange-500", department: "QA/Regulatory" },
];

const getTeamMembers = (): TeamMember[] => {
  try {
    return teamMembers?.length ? teamMembers : fallbackTeamMembers;
  } catch {
    return fallbackTeamMembers;
  }
};

const getMemberByName = (name: string): TeamMember | undefined => {
  return getTeamMembers().find(m => m.name === name || m.name.includes(name.split(".")[0]?.trim() || ""));
};

const getMemberInitials = (name: string): { initials: string; color: string } => {
  const member = getMemberByName(name);
  if (member) return { initials: member.initials, color: member.color };
  const parts = name.split(" ");
  const initials = parts.map(p => p[0] || "").join("").slice(0, 2).toUpperCase();
  return { initials, color: "bg-slate-500" };
};

// ─── Utility helpers ───────────────────────────────────────────────────────

function Avatar({ name, size = "sm" }: { name: string; size?: "xs" | "sm" | "md" }) {
  const { initials, color } = getMemberInitials(name);
  const sizeClass = size === "xs" ? "w-5 h-5 text-[9px]" : size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`} title={name}>
      {initials}
    </div>
  );
}

const effortMonths: Record<string, number> = { XL: 12, L: 6, M: 3, S: 1 };

function getItemDateRange(item: RoadmapItem): { startMonth: number; startYear: number; endMonth: number; endYear: number } {
  const qMap: Record<string, number> = { Q1: 3, Q2: 6, Q3: 9, Q4: 12 };
  const endMonth = qMap[item.quarter];
  const endYear = item.year;
  const dur = effortMonths[item.effort] || 3;
  let startMonth = endMonth - dur + 1;
  let startYear = endYear;
  if (startMonth <= 0) {
    startYear -= 1;
    startMonth += 12;
  }
  return { startMonth, startYear, endMonth, endYear };
}

function exportCSV(items: RoadmapItem[]) {
  const header = ["ID", "Initiative", "Brand", "Product Line", "Status", "Gate", "Quarter", "Year", "Impact", "Effort", "Owner", "Budget", "Region"];
  const rows = items.map(i => [
    i.id, `"${i.initiative}"`, i.brand, i.productLine, i.status,
    gateShortName[i.gateStage], i.quarter, i.year, i.impact, i.effort, i.owner,
    i.budget ? `$${i.budget}k` : "", i.region,
  ]);
  const csv = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pm-studio-roadmap.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Health Score Color ────────────────────────────────────────────────────
function healthColor(score: number): string {
  if (score >= 70) return "text-teal-500";
  if (score >= 50) return "text-amber-500";
  return "text-rose-500";
}
function healthBg(score: number): string {
  if (score >= 70) return "bg-teal-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

// ─── Shared Components ─────────────────────────────────────────────────────

const PageWrap = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35 }}
    className="p-4 md:p-6 max-w-screen-2xl mx-auto"
  >
    {children}
  </motion.div>
);

const SectionTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div className="mb-5">
    <h2 className="text-lg font-semibold text-foreground">{children}</h2>
    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

const KpiCard = ({
  label, value, sub, color = "text-primary",
}: {
  label: string; value: string | number; sub?: string; color?: string;
}) => (
  <Card className="bg-card border border-border">
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </CardContent>
  </Card>
);

// ─── Toast Helper ─────────────────────────────────────────────────────────

function ToastMsg({ title, desc }: { title: string; desc?: string }) {
  return (
    <div>
      <p className="font-semibold text-sm">{title}</p>
      {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
    </div>
  );
}

// ─── NEW INITIATIVE MODAL ──────────────────────────────────────────────────

interface NewInitiativeModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: RoadmapItem) => void;
}

function NewInitiativeModal({ open, onClose, onAdd }: NewInitiativeModalProps) {
  const { toast } = useToast();
  const members = getTeamMembers();
  const [form, setForm] = useState({
    initiative: "", brand: "ASSA ABLOY" as Brand, productLine: "", status: "concept" as RoadmapStatus,
    gateStage: "G0_idea" as GateStage, owner: "J. Tubbs", impact: "medium" as "low" | "medium" | "high" | "critical",
    effort: "M" as "S" | "M" | "L" | "XL", quarter: "Q3", year: "2026",
    description: "", budget: "", region: "National" as const, priority: "P2",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.initiative.trim()) e.initiative = "Initiative name is required";
    if (!form.productLine.trim()) e.productLine = "Product line is required";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newItem: RoadmapItem = {
      id: `rm-new-${Date.now()}`,
      initiative: form.initiative,
      brand: form.brand as Brand,
      productLine: form.productLine,
      category: "sliding",
      status: form.status,
      year: parseInt(form.year),
      quarter: form.quarter as "Q1" | "Q2" | "Q3" | "Q4",
      gateStage: form.gateStage,
      owner: form.owner,
      impact: form.impact,
      effort: form.effort,
      description: form.description,
      region: form.region,
      verticals: ["Office/Commercial"],
      budget: form.budget ? parseInt(form.budget) : undefined,
      tags: [],
    };
    onAdd(newItem);
    toast({ title: "Initiative created", description: `${form.initiative} added to roadmap.` });
    onClose();
    setForm({ initiative: "", brand: "ASSA ABLOY", productLine: "", status: "concept", gateStage: "G0_idea", owner: "J. Tubbs", impact: "medium", effort: "M", quarter: "Q3", year: "2026", description: "", budget: "", region: "National", priority: "P2" });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="new-initiative-modal-backdrop"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
          data-testid="new-initiative-modal"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold">New Initiative</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Add to ASSA ABLOY + RECORD portfolio</p>
              </div>
              <button data-testid="close-new-initiative" onClick={onClose} className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-xs font-medium mb-1.5 block">Initiative Name <span className="text-rose-500">*</span></Label>
                <Input data-testid="new-initiative-name" value={form.initiative} onChange={e => set("initiative", e.target.value)} placeholder="e.g. SW300 OSDP v3 Integration" className="text-xs" />
                {errors.initiative && <p className="text-xs text-rose-500 mt-1">{errors.initiative}</p>}
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Brand</Label>
                <Select value={form.brand} onValueChange={v => set("brand", v)}>
                  <SelectTrigger className="text-xs" data-testid="new-initiative-brand"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASSA ABLOY">ASSA ABLOY</SelectItem>
                    <SelectItem value="RECORD">RECORD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Product Line <span className="text-rose-500">*</span></Label>
                <Input data-testid="new-initiative-product-line" value={form.productLine} onChange={e => set("productLine", e.target.value)} placeholder="e.g. SW300, SL500" className="text-xs" />
                {errors.productLine && <p className="text-xs text-rose-500 mt-1">{errors.productLine}</p>}
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Status</Label>
                <Select value={form.status} onValueChange={v => set("status", v)}>
                  <SelectTrigger className="text-xs" data-testid="new-initiative-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["concept", "development", "testing", "launch", "sustain", "eol"] as RoadmapStatus[]).map(s => (
                      <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Gate Stage</Label>
                <Select value={form.gateStage} onValueChange={v => set("gateStage", v)}>
                  <SelectTrigger className="text-xs" data-testid="new-initiative-gate"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {gateOrder.map(g => (
                      <SelectItem key={g} value={g}>{gateShortName[g]} — {gateFullName[g]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Owner</Label>
                <Select value={form.owner} onValueChange={v => set("owner", v)}>
                  <SelectTrigger className="text-xs" data-testid="new-initiative-owner"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {members.map(m => <SelectItem key={m.id} value={m.name}>{m.name} — {m.role}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Impact</Label>
                <Select value={form.impact} onValueChange={v => set("impact", v)}>
                  <SelectTrigger className="text-xs" data-testid="new-initiative-impact"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Effort</Label>
                <Select value={form.effort} onValueChange={v => set("effort", v)}>
                  <SelectTrigger className="text-xs" data-testid="new-initiative-effort"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S — 1 month</SelectItem>
                    <SelectItem value="M">M — 3 months</SelectItem>
                    <SelectItem value="L">L — 6 months</SelectItem>
                    <SelectItem value="XL">XL — 12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Quarter</Label>
                <Select value={form.quarter} onValueChange={v => set("quarter", v)}>
                  <SelectTrigger className="text-xs" data-testid="new-initiative-quarter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1">Q1</SelectItem>
                    <SelectItem value="Q2">Q2</SelectItem>
                    <SelectItem value="Q3">Q3</SelectItem>
                    <SelectItem value="Q4">Q4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Year</Label>
                <Select value={form.year} onValueChange={v => set("year", v)}>
                  <SelectTrigger className="text-xs" data-testid="new-initiative-year"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Budget ($k)</Label>
                <Input data-testid="new-initiative-budget" type="number" value={form.budget} onChange={e => set("budget", e.target.value)} placeholder="e.g. 350" className="text-xs" />
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Region</Label>
                <Select value={form.region} onValueChange={v => set("region", v)}>
                  <SelectTrigger className="text-xs" data-testid="new-initiative-region"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["National", "Northeast", "Southeast", "Midwest", "Southwest", "West", "Canada"].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs font-medium mb-1.5 block">Description <span className="text-rose-500">*</span></Label>
                <Textarea data-testid="new-initiative-description" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the initiative, its scope, and strategic rationale..." className="text-xs min-h-[80px]" />
                {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button data-testid="submit-new-initiative" onClick={handleSubmit} className="flex-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                Create Initiative
              </Button>
              <Button data-testid="cancel-new-initiative" variant="outline" onClick={onClose} className="text-xs">Cancel</Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── GLOBAL SEARCH OVERLAY ────────────────────────────────────────────────

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
  allItems: RoadmapItem[];
  onSelectItem: (item: RoadmapItem) => void;
}

function GlobalSearch({ open, onClose, allItems, onSelectItem }: GlobalSearchProps) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQ("");
    }
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lower = q.toLowerCase();
    return allItems.filter(i =>
      i.initiative.toLowerCase().includes(lower) ||
      i.productLine.toLowerCase().includes(lower) ||
      i.tags.some(t => t.toLowerCase().includes(lower))
    ).slice(0, 8);
  }, [q, allItems]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
      data-testid="global-search-overlay"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: -8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            data-testid="global-search-input"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search initiatives, product lines, tags..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <kbd className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        {q.trim() && (
          <div className="p-2">
            {results.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No results for &quot;{q}&quot;</p>
            ) : (
              results.map(item => (
                <button
                  key={item.id}
                  data-testid={`search-result-${item.id}`}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => { onSelectItem(item); onClose(); }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[item.status]}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.initiative}</p>
                    <p className="text-xs text-muted-foreground">{item.productLine} · {gateShortName[item.gateStage]} · {item.quarter} {item.year}</p>
                  </div>
                  <div className="ml-auto flex gap-1 flex-shrink-0">
                    <Badge className={`text-[10px] ${brandColors[item.brand]}`}>{item.brand === "RECORD" ? "REC" : "AA"}</Badge>
                    <Badge className={`text-[10px] ${impactColors[item.impact]}`}>{item.impact}</Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
        {!q.trim() && (
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Recent</p>
            <div className="space-y-1">
              {allItems.slice(0, 4).map(item => (
                <button
                  key={item.id}
                  className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary transition-colors"
                  onClick={() => { onSelectItem(item); onClose(); }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[item.status]}`} />
                  <p className="text-xs text-muted-foreground truncate">{item.initiative}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────

function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
      data-testid="notification-panel"
    >
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <p className="text-sm font-semibold">Notifications</p>
        <Badge className="text-[10px] bg-primary text-primary-foreground">3 new</Badge>
      </div>
      <div className="divide-y divide-border max-h-72 overflow-y-auto">
        {activityFeed.slice(0, 5).map((item, i) => (
          <button
            key={item.id}
            className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
            data-testid={`notification-${i}`}
          >
            <div className={`w-7 h-7 ${item.color} rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 mt-0.5`}>
              {item.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-foreground">
                <span className="font-semibold">{item.user}</span>{" "}
                {item.action}{" "}
                <span className="text-primary">{item.item}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
            </div>
            {i < 3 && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
          </button>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-border">
        <button className="text-xs text-primary hover:underline w-full text-center" data-testid="mark-all-read" onClick={onClose}>
          Mark all as read
        </button>
      </div>
    </motion.div>
  );
}

// ─── PROFILE DROPDOWN ─────────────────────────────────────────────────────

function ProfileDropdown({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50"
      data-testid="profile-dropdown"
    >
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">JT</div>
          <div>
            <p className="text-sm font-semibold">J. Tubbs</p>
            <p className="text-[10px] text-muted-foreground">Senior Product Manager</p>
          </div>
        </div>
      </div>
      <div className="p-1.5">
        {["My Profile", "Preferences", "Keyboard Shortcuts", "Help & Docs"].map(item => (
          <button key={item} className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors" data-testid={`profile-menu-${item.toLowerCase().replace(/ /g, "-")}`}>
            {item}
          </button>
        ))}
        <Separator className="my-1.5" />
        <button className="w-full text-left px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors" data-testid="profile-sign-out">
          Sign Out
        </button>
      </div>
    </motion.div>
  );
}


// ─── ITEM DETAIL DRAWER ────────────────────────────────────────────────────

interface DrawerProps {
  item: RoadmapItem | null;
  onClose: () => void;
  allItems: RoadmapItem[];
}

function ItemDetailDrawer({ item, onClose, allItems }: DrawerProps) {
  const { toast } = useToast();
  const members = getTeamMembers();

  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [linkedTasks, setLinkedTasks] = useState<RoadmapItem[]>([]);
  const [commentText, setCommentText] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [linkTarget, setLinkTarget] = useState("");
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    if (item) {
      const linked = (() => {
        try { return getLinkedItems?.(item.id) || []; } catch { return []; }
      })();
      setLinkedTasks(linked);
      const itemComments = (item as any).comments || [];
      setLocalComments(itemComments);
      setReactions({});
    }
  }, [item?.id]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: "J. Tubbs",
      role: "Senior PM",
      avatar: "JT",
      body: commentText,
      timestamp: "Just now",
      mentions: [],
      reactions: [],
    };
    setLocalComments(prev => [...prev, newComment]);
    setCommentText("");
    toast({ title: "Comment added" });
  };

  const handleLinkTask = () => {
    if (!linkTarget) return;
    const found = allItems.find(i => i.id === linkTarget);
    if (found && !linkedTasks.find(t => t.id === found.id)) {
      setLinkedTasks(prev => [...prev, found]);
      setLinkTarget("");
      toast({ title: "Task linked", description: found.initiative });
    }
  };

  const handleUnlinkTask = (id: string) => {
    setLinkedTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleReaction = (commentId: string, emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [commentId]: {
        ...(prev[commentId] || {}),
        [emoji]: ((prev[commentId] || {})[emoji] || 0) + 1,
      },
    }));
  };

  const renderCommentBody = (body: string) => {
    const parts = body.split(/(@\w+[\w.]*)/g);
    return parts.map((part, i) =>
      part.startsWith("@")
        ? <span key={i} className="text-primary font-medium">{part}</span>
        : <span key={i}>{part}</span>
    );
  };

  if (!item) return null;

  const completionPct = (item as any).completionPct || Math.floor(Math.random() * 60 + 20);
  const priority = (item as any).priority || "P2";
  const unlinkableItems = allItems.filter(i => i.id !== item.id && !linkedTasks.find(t => t.id === i.id));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border overflow-y-auto"
          onClick={e => e.stopPropagation()}
          data-testid="item-detail-drawer"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge className={`text-xs ${brandColors[item.brand]}`}>{item.brand}</Badge>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${gateProgressColors[item.gateStage]} text-white`}>{gateShortName[item.gateStage]}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded text-white ${priorityColors[priority] || "bg-slate-400"}`}>{priority}</span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-tight">{item.initiative}</h2>
                <p className="text-xs text-muted-foreground mt-1">{item.productLine} · {item.quarter} {item.year} · {item.region}</p>
              </div>
              <button data-testid="close-detail" onClick={onClose} className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={statusColors[item.status]}>{item.status}</Badge>
              <Badge className={impactColors[item.impact]}>{item.impact} impact</Badge>
              <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded font-mono">Effort: {item.effort}</span>
              {item.budget && <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">${item.budget}k budget</span>}
            </div>

            {/* Health Ring */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-secondary rounded-lg">
              <Avatar name={item.owner} size="md" />
              <div className="flex-1">
                <p className="text-xs font-semibold">{item.owner}</p>
                <p className="text-[10px] text-muted-foreground">Initiative Owner</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${completionPct >= 80 ? "text-teal-500" : completionPct >= 60 ? "text-amber-500" : "text-rose-500"}`}>{completionPct}%</p>
                <p className="text-[10px] text-muted-foreground">health</p>
              </div>
            </div>

            {/* Completion */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-foreground">Completion</p>
                <span className="text-xs font-mono text-muted-foreground">{completionPct}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${completionPct >= 80 ? "bg-teal-500" : completionPct >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>

            {item.notes && (
              <div className="mb-4 p-3 bg-secondary rounded-lg">
                <p className="text-xs font-semibold text-foreground mb-1">Notes</p>
                <p className="text-xs text-muted-foreground">{item.notes}</p>
              </div>
            )}
            {item.risks && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg">
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">Risk</p>
                <p className="text-xs text-rose-600 dark:text-rose-400">{item.risks}</p>
              </div>
            )}
            {item.kpis && item.kpis.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-foreground mb-2">Success KPIs</p>
                <ul className="space-y-1">
                  {item.kpis.map((kpi, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                      {kpi}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {item.linkedStandards && item.linkedStandards.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-foreground mb-2">Linked Standards</p>
                <div className="flex flex-wrap gap-1">
                  {item.linkedStandards.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                </div>
              </div>
            )}
            {item.verticals.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-foreground mb-2">Target Verticals</p>
                <div className="flex flex-wrap gap-1">
                  {item.verticals.map(v => <Badge key={v} variant="secondary" className="text-[10px]">{v}</Badge>)}
                </div>
              </div>
            )}
            {item.linkedCompetitorSignal && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Competitive Signal</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">{item.linkedCompetitorSignal}</p>
              </div>
            )}

            <Separator className="my-5" />

            {/* Linked Tasks */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <span>🔗</span> Linked Tasks
                <span className="ml-auto text-muted-foreground font-normal">{linkedTasks.length}</span>
              </p>
              <div className="space-y-2 mb-3">
                {linkedTasks.length === 0 && (
                  <p className="text-xs text-muted-foreground">No linked tasks yet.</p>
                )}
                {linkedTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[t.status]} flex-shrink-0`} />
                    <p className="text-xs font-medium flex-1 truncate">{t.initiative}</p>
                    <Badge className={`text-[10px] ${impactColors[t.impact]}`}>{t.impact}</Badge>
                    <button
                      data-testid={`unlink-task-${t.id}`}
                      onClick={() => handleUnlinkTask(t.id)}
                      className="text-muted-foreground hover:text-rose-500 ml-1 text-sm font-bold leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={linkTarget} onValueChange={setLinkTarget}>
                  <SelectTrigger className="flex-1 text-xs h-8" data-testid="link-task-select">
                    <SelectValue placeholder="Link a task..." />
                  </SelectTrigger>
                  <SelectContent>
                    {unlinkableItems.slice(0, 20).map(i => (
                      <SelectItem key={i.id} value={i.id} className="text-xs">{i.initiative}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button data-testid="btn-link-task" size="sm" variant="outline" onClick={handleLinkTask} className="text-xs h-8">Link</Button>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Comments Thread */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                <span>💬</span> Comments
                <span className="ml-auto text-muted-foreground font-normal">{localComments.length}</span>
              </p>
              <div className="space-y-4 mb-4">
                {localComments.length === 0 && (
                  <p className="text-xs text-muted-foreground">No comments yet. Be the first.</p>
                )}
                {localComments.map((c: Comment) => {
                  const reactionMap = reactions[c.id] || {};
                  const existingReactions: Record<string, number> = {};
                  (c.reactions || []).forEach((r: any) => {
                    existingReactions[r.emoji || r] = (existingReactions[r.emoji || r] || 0) + (r.count || 1);
                  });
                  const merged = { ...existingReactions, ...reactionMap };
                  return (
                    <div key={c.id} className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5 ${getMemberInitials(c.author).color}`}>
                        {c.avatar || getMemberInitials(c.author).initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-semibold">{c.author}</span>
                          {c.role && <span className="text-[10px] text-muted-foreground">{c.role}</span>}
                          <span className="text-[10px] text-muted-foreground ml-auto">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">{renderCommentBody(c.body)}</p>
                        {Object.keys(merged).length > 0 && (
                          <div className="flex gap-1.5 mt-1.5 flex-wrap">
                            {Object.entries(merged).map(([emoji, count]) => (
                              <button
                                key={emoji}
                                data-testid={`reaction-${c.id}-${emoji}`}
                                onClick={() => handleReaction(c.id, emoji)}
                                className="flex items-center gap-0.5 text-[10px] bg-secondary hover:bg-border rounded-full px-1.5 py-0.5 transition-colors"
                              >
                                {emoji} {count}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 mt-1.5">
                          {["👍", "🔥"].map(emoji => (
                            <button
                              key={emoji}
                              data-testid={`add-reaction-${c.id}-${emoji}`}
                              onClick={() => handleReaction(c.id, emoji)}
                              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add comment */}
              <div className="space-y-2">
                <div className="relative">
                  <Textarea
                    data-testid="add-comment-textarea"
                    placeholder="Add a comment... (@ to mention)"
                    value={commentText}
                    onChange={e => {
                      setCommentText(e.target.value);
                      setMentionOpen(e.target.value.endsWith("@"));
                    }}
                    className="text-xs min-h-[60px] resize-none"
                  />
                  <AnimatePresence>
                    {mentionOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-full left-0 mb-1 bg-card border border-border rounded-lg shadow-lg w-48 z-10"
                        data-testid="mention-dropdown"
                      >
                        {members.slice(0, 5).map(m => (
                          <button
                            key={m.id}
                            data-testid={`mention-${m.id}`}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-secondary text-xs transition-colors"
                            onClick={() => {
                              setCommentText(prev => prev.slice(0, -1) + `@${m.name} `);
                              setMentionOpen(false);
                            }}
                          >
                            <div className={`w-5 h-5 ${m.color} rounded-full flex items-center justify-center text-white text-[8px] font-bold`}>{m.initials}</div>
                            {m.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Button data-testid="btn-submit-comment" size="sm" onClick={handleAddComment} className="text-xs">Post Comment</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── PM PERSONAL DASHBOARD WIDGET ────────────────────────────────────────

function PMPersonalDashboard({ allItems }: { allItems: RoadmapItem[] }) {
  const myItems = allItems.filter(i => i.owner.includes("Tubbs"));
  const overdue = myItems.filter(i => {
    const targetYear = i.year;
    const qEnd = { Q1: 3, Q2: 6, Q3: 9, Q4: 12 }[i.quarter] || 12;
    const now = new Date();
    return (targetYear < now.getFullYear()) || (targetYear === now.getFullYear() && qEnd < now.getMonth() + 1);
  });
  const gateReviewsDue = myItems.filter(i =>
    ["G2_business_case", "G3_development", "G4_testing"].includes(i.gateStage)
  );
  const myCapacity = sprintData.find(s => s.person === "J. Tubbs");
  const remainingBw = myCapacity ? 100 - myCapacity.pct : 15;

  return (
    <Card className="border border-border" data-testid="pm-personal-dashboard">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-[11px] font-bold">JT</div>
          <div>
            <CardTitle className="text-sm font-semibold">J. Tubbs — Personal View</CardTitle>
            <p className="text-[10px] text-muted-foreground">Senior Product Manager</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Your Initiatives</p>
            <p className="text-xl font-bold text-primary">{myItems.length}</p>
            <p className="text-[10px] text-muted-foreground">owned or assigned</p>
          </div>
          <div className={`p-3 rounded-lg ${overdue.length > 0 ? "bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900" : "bg-secondary"}`}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Overdue</p>
            <p className={`text-xl font-bold ${overdue.length > 0 ? "text-rose-500" : "text-teal-500"}`}>{overdue.length}</p>
            <p className="text-[10px] text-muted-foreground">past target</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Gate Reviews Due</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{gateReviewsDue.length}</p>
            <p className="text-[10px] text-muted-foreground">this quarter</p>
          </div>
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Sprint Bandwidth</p>
            <p className={`text-xl font-bold ${remainingBw < 10 ? "text-rose-500" : "text-teal-500"}`}>{remainingBw}%</p>
            <p className="text-[10px] text-muted-foreground">remaining</p>
          </div>
        </div>
        {gateReviewsDue.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Gate Review Items</p>
            <div className="space-y-1">
              {gateReviewsDue.slice(0, 3).map(i => (
                <div key={i.id} className="flex items-center gap-2 text-xs">
                  <span className={`text-[10px] font-mono font-bold px-1 py-0.5 rounded ${gateProgressColors[i.gateStage]} text-white`}>{gateShortName[i.gateStage]}</span>
                  <span className="truncate text-muted-foreground">{i.initiative}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── PORTFOLIO TAB ─────────────────────────────────────────────────────────

function PortfolioTab({
  allItems,
  onNewInitiative,
  onExport,
  onExecDigest,
}: {
  allItems: RoadmapItem[];
  onNewInitiative: () => void;
  onExport: () => void;
  onExecDigest: () => void;
}) {
  const { toast } = useToast();
  const stats = getPortfolioStats();
  const members = getTeamMembers();

  const statusChartData = (["concept", "development", "testing", "launch", "sustain", "eol"] as RoadmapStatus[]).map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    count: stats.byStatus[s] || 0,
  }));

  const gateChartData = gateOrder.map(g => ({
    name: gateShortName[g],
    count: stats.byGate[g] || 0,
    full: gateFullName[g],
  }));

  const brandPieData = [
    { name: "ASSA ABLOY", value: stats.byBrand["ASSA ABLOY"] || 0 },
    { name: "RECORD", value: stats.byBrand["RECORD"] || 0 },
  ];

  const impactPieData = ["critical", "high", "medium", "low"].map(impact => ({
    name: impact.charAt(0).toUpperCase() + impact.slice(1),
    value: allItems.filter(i => i.impact === impact).length,
  }));

  const verticalBudget = marketVerticals.map(v => ({
    vertical: v.vertical.split("/")[0],
    tam: v.tamMillions,
    aaShare: Math.round(v.tamMillions * v.aaSharePercent / 100),
    recordShare: Math.round(v.tamMillions * v.recordSharePercent / 100),
    growth: v.growthRate,
  })).sort((a, b) => b.tam - a.tam);

  const totalTAM = marketVerticals.reduce((sum, v) => sum + v.tamMillions, 0);
  const totalAA = marketVerticals.reduce((sum, v) => sum + v.tamMillions * v.aaSharePercent / 100, 0);
  const atRisk = allItems.filter(i => i.impact === "critical" && ["G0_idea", "G1_scoping", "G2_business_case", "G3_development", "G4_testing"].includes(i.gateStage));

  const teamLoadPcts: Record<string, number> = {
    "J. Tubbs": 85, "A. Chen": 95, "M. Rivera": 78, "S. Patel": 60,
    "K. Lawson": 72, "R. Nguyen": 90, "D. Martinez": 45,
  };

  return (
    <PageWrap>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">PM Studio · Portfolio View</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">ASSA ABLOY + RECORD — NA Pedestrian Portfolio</h1>
            <p className="text-sm text-muted-foreground mt-1">North America (excl. Mexico) · Pedestrian Automatic Doors · {allItems.length} total initiatives</p>
          </div>
          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button data-testid="btn-new-initiative" size="sm" onClick={onNewInitiative} className="text-xs gap-1.5">
              <span>+</span> New Initiative
            </Button>
            <Button data-testid="btn-export-csv" size="sm" variant="outline" onClick={onExport} className="text-xs gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Export CSV
            </Button>
            <Button data-testid="btn-generate-report" size="sm" variant="outline" onClick={() => toast({ title: "Report generation started", description: "PDF report will be ready in 30 seconds." })} className="text-xs gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              Generate Report
            </Button>
            <Button data-testid="btn-exec-digest" size="sm" variant="outline" onClick={onExecDigest} className="text-xs gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Exec Digest
            </Button>
          </div>
        </div>
      </div>

      {/* PM Personal Dashboard */}
      <div className="mb-5">
        <PMPersonalDashboard allItems={allItems} />
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <KpiCard label="Total Initiatives" value={stats.total} sub="ASSA ABLOY + RECORD" />
        <KpiCard label="Active (non-EOL)" value={stats.activeItems} sub="concept through launch" color="text-blue-500" />
        <KpiCard label="Critical Impact" value={stats.criticalCount} sub="items" color="text-rose-500" />
        <KpiCard label="Total Budget" value={`$${(stats.totalBudget / 1000).toFixed(1)}M`} sub="est. all initiatives" color="text-teal-500" />
        <KpiCard label="NA TAM" value={`$${totalTAM}M`} sub="pedestrian segment" color="text-indigo-500" />
        <KpiCard label="ASSA ABLOY Share" value={`$${Math.round(totalAA)}M`} sub={`${Math.round(totalAA / totalTAM * 100)}% of TAM`} color="text-violet-500" />
      </div>

      {/* Team Load indicator */}
      <div className="mb-5 p-4 bg-card border border-border rounded-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Team Load</p>
        <div className="flex items-center gap-4 flex-wrap">
          {members.slice(0, 7).map(m => {
            const pct = teamLoadPcts[m.name] || 50;
            const loadColor = pct > 90 ? "bg-rose-500" : pct > 75 ? "bg-amber-500" : "bg-teal-500";
            return (
              <div key={m.id} className="flex items-center gap-2" data-testid={`team-load-${m.id}`}>
                <div className={`relative w-7 h-7 ${m.color} rounded-full flex items-center justify-center text-white text-[9px] font-bold`} title={`${m.name}: ${pct}%`}>
                  {m.initials}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${loadColor}`} />
                </div>
                <div>
                  <p className="text-[10px] font-medium">{m.name}</p>
                  <p className={`text-[10px] font-bold ${pct > 90 ? "text-rose-500" : pct > 75 ? "text-amber-500" : "text-teal-500"}`}>{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="border border-border col-span-1">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">By Status</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(186 80% 38%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border border-border col-span-1">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">By Gate Stage</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gateChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }} formatter={(v, _, props) => [v, props.payload?.full]} />
                <Bar dataKey="count" fill="hsl(186 80% 38%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border border-border col-span-1">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Brand Mix & Impact</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={brandPieData} cx="50%" cy="50%" innerRadius={32} outerRadius={55} dataKey="value" paddingAngle={3}>
                    {brandPieData.map((_, i) => <Cell key={i} fill={["hsl(186 80% 38%)", "hsl(258 75% 55%)"][i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={impactPieData} cx="50%" cy="50%" innerRadius={32} outerRadius={55} dataKey="value" paddingAngle={3}>
                    {impactPieData.map((_, i) => <Cell key={i} fill={["#f43f5e", "#6366f1", "#0ea5e9", "#94a3b8"][i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TAM Chart + Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="border border-border col-span-1 md:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Market TAM by Vertical ($M)</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={verticalBudget} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="vertical" type="category" tick={{ fontSize: 10 }} width={60} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={v => [`$${v}M`]} />
                <Bar dataKey="tam" name="Total TAM" fill="hsl(186 80% 38% / 0.3)" radius={[0, 3, 3, 0]} />
                <Bar dataKey="aaShare" name="AA Share" fill="hsl(186 80% 38%)" radius={[0, 3, 3, 0]} />
                <Bar dataKey="recordShare" name="RECORD Share" fill="hsl(258 75% 55%)" radius={[0, 3, 3, 0]} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Activity Feed</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ScrollArea className="h-[296px]">
              <div className="space-y-3 pr-2">
                {activityFeed.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5" data-testid={`activity-${item.id}`}>
                    <div className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5`}>
                      {item.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground leading-snug">
                        <span className="font-semibold">{item.user}</span>{" "}
                        {item.action}{" "}
                        <span className="text-primary font-medium">{item.item}</span>
                        {" "}<span className="text-[10px]">{activityTypeIcon[item.type]}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk + Growth Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold text-rose-500">Critical Items — G0/G1/G2 Risk</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ScrollArea className="h-[220px]">
              <div className="space-y-2">
                {atRisk.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900">
                    <span className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${statusDot[item.status]}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.initiative}</p>
                      <p className="text-xs text-muted-foreground">{item.brand} · {item.productLine} · {gateShortName[item.gateStage]}</p>
                      {item.risks && <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5 line-clamp-2">{item.risks}</p>}
                    </div>
                  </div>
                ))}
                {atRisk.length === 0 && <p className="text-sm text-muted-foreground">No critical early-stage items flagged.</p>}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Vertical Growth Rate YoY (%)</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
              {marketVerticals.sort((a, b) => b.growthRate - a.growthRate).map(v => (
                <div key={v.vertical} className="p-2.5 bg-secondary rounded-lg">
                  <p className="text-[10px] font-medium text-muted-foreground truncate">{v.vertical}</p>
                  <p className={`text-lg font-bold mt-0.5 ${v.growthRate > 10 ? "text-teal-500" : v.growthRate > 5 ? "text-blue-500" : "text-foreground"}`}>
                    +{v.growthRate}%
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{v.topDriver}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrap>
  );
}

// ─── CALENDAR VIEW ─────────────────────────────────────────────────────────

const CALENDAR_YEARS = [2026, 2027, 2028];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_WIDTH = 56; // px per month
const ROW_HEIGHT = 36;
const LEFT_COL_WIDTH = 140;
const TOTAL_MONTHS = CALENDAR_YEARS.length * 12;

function monthIndex(month: number, year: number): number {
  const baseYear = CALENDAR_YEARS[0];
  return (year - baseYear) * 12 + (month - 1);
}

function CalendarView({ items, onSelectItem }: { items: RoadmapItem[]; onSelectItem: (item: RoadmapItem) => void }) {
  const today = new Date();
  const todayIdx = monthIndex(today.getMonth() + 1, today.getFullYear());

  const productLines = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => set.add(i.productLine));
    return Array.from(set).sort();
  }, [items]);

  const brandColorHex: Record<Brand, string> = {
    "ASSA ABLOY": "#14b8a6",
    "RECORD": "#8b5cf6",
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <div style={{ minWidth: LEFT_COL_WIDTH + TOTAL_MONTHS * MONTH_WIDTH }}>
        {/* Header */}
        <div className="flex sticky top-0 z-10 bg-card border-b border-border">
          <div style={{ width: LEFT_COL_WIDTH, minWidth: LEFT_COL_WIDTH }} className="flex-shrink-0 px-3 py-2 border-r border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Product Line</p>
          </div>
          <div className="flex">
            {CALENDAR_YEARS.map(year => (
              <div key={year} style={{ width: MONTH_WIDTH * 12 }} className="border-r border-border">
                <div className="text-center py-1 border-b border-border">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">FY {year}</p>
                </div>
                <div className="flex">
                  {MONTHS.map((m) => (
                    <div key={m} style={{ width: MONTH_WIDTH }} className="text-center py-1 border-r border-border/30 last:border-r-0">
                      <p className="text-[9px] text-muted-foreground">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {productLines.map(pl => {
          const rowItems = items.filter(i => i.productLine === pl);
          return (
            <div key={pl} className="flex border-b border-border/50 hover:bg-secondary/10 transition-colors" style={{ minHeight: ROW_HEIGHT + 8 }}>
              <div style={{ width: LEFT_COL_WIDTH, minWidth: LEFT_COL_WIDTH }} className="flex items-center px-3 border-r border-border flex-shrink-0 py-1">
                <p className="text-[10px] font-semibold text-foreground truncate">{pl}</p>
              </div>
              <div className="relative flex-1 flex items-center" style={{ height: ROW_HEIGHT + 8 }}>
                {Array.from({ length: TOTAL_MONTHS }).map((_, idx) => (
                  <div key={idx} style={{ position: "absolute", left: idx * MONTH_WIDTH, top: 0, bottom: 0, width: MONTH_WIDTH }} className="border-r border-border/20" />
                ))}
                {todayIdx >= 0 && todayIdx < TOTAL_MONTHS && (
                  <div style={{ position: "absolute", left: todayIdx * MONTH_WIDTH + MONTH_WIDTH / 2, top: 0, bottom: 0, width: 2 }} className="bg-rose-500/70 z-10" />
                )}
                {rowItems.map(item => {
                  const { startMonth, startYear, endMonth, endYear } = getItemDateRange(item);
                  const startIdx = monthIndex(startMonth, startYear);
                  const endIdx = monthIndex(endMonth, endYear);
                  const left = Math.max(0, startIdx) * MONTH_WIDTH;
                  const width = Math.max((endIdx - Math.max(0, startIdx) + 1) * MONTH_WIDTH, MONTH_WIDTH / 2);
                  const barColor = brandColorHex[item.brand] || "#14b8a6";
                  const opacity = item.status === "eol" ? 0.3 : item.status === "sustain" ? 0.6 : 0.85;
                  if (startIdx > TOTAL_MONTHS || endIdx < 0) return null;
                  return (
                    <button
                      key={item.id}
                      data-testid={`cal-item-${item.id}`}
                      style={{
                        position: "absolute", left, width: Math.min(width, (TOTAL_MONTHS - Math.max(0, startIdx)) * MONTH_WIDTH),
                        height: 22, backgroundColor: barColor, opacity, borderRadius: 4,
                        top: "50%", transform: "translateY(-50%)", zIndex: 5,
                      }}
                      className="flex items-center px-1.5 overflow-hidden hover:opacity-100 hover:shadow-lg transition-all group"
                      title={`${item.initiative} (${item.effort})`}
                      onClick={() => onSelectItem(item)}
                    >
                      <span className="text-[9px] text-white font-semibold truncate">{item.initiative}</span>
                      <span style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%) rotate(45deg)", width: 8, height: 8, background: barColor, border: "2px solid white", zIndex: 6 }} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── KANBAN VIEW ───────────────────────────────────────────────────────────

function computeKanbanHealth(item: RoadmapItem): number {
  const completion = (item as any).completionPct || 50;
  const gateIdx = gateOrder.indexOf(item.gateStage);
  const gateProgress = Math.round((gateIdx / (gateOrder.length - 1)) * 100);
  const impactScore = { critical: 100, high: 80, medium: 60, low: 40 }[item.impact] || 60;
  return Math.round((completion * 0.4) + (gateProgress * 0.3) + (impactScore * 0.3));
}

function KanbanView({ items, onSelectItem }: { items: RoadmapItem[]; onSelectItem: (item: RoadmapItem) => void }) {
  const byStatus = useMemo(() => {
    const map: Record<RoadmapStatus, RoadmapItem[]> = {
      concept: [], development: [], testing: [], launch: [], sustain: [], eol: [],
    };
    items.forEach(i => map[i.status].push(i));
    return map;
  }, [items]);

  const getPriority = (item: RoadmapItem): string => {
    return (item as any).priority || (item.impact === "critical" ? "P0" : item.impact === "high" ? "P1" : item.impact === "medium" ? "P2" : "P3");
  };
  const getCommentCount = (item: RoadmapItem): number => (item as any).comments?.length || Math.floor(Math.random() * 5);
  const getLinkedCount = (item: RoadmapItem): number => { try { return getLinkedItems?.(item.id)?.length || 0; } catch { return 0; } };
  const getCompletion = (item: RoadmapItem): number => (item as any).completionPct || Math.floor(Math.random() * 80 + 10);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {(["concept", "development", "testing", "launch", "sustain", "eol"] as RoadmapStatus[]).map(status => (
        <div key={status} className="bg-secondary/40 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${statusDot[status]}`} />
            <p className="text-xs font-semibold uppercase tracking-wide">{status}</p>
            <span className="ml-auto text-xs text-muted-foreground">{byStatus[status].length}</span>
          </div>
          <div className="space-y-2">
            {byStatus[status].map(item => {
              const priority = getPriority(item);
              const commentCount = getCommentCount(item);
              const linkedCount = getLinkedCount(item);
              const completion = getCompletion(item);
              const health = computeKanbanHealth(item);
              const { initials: ownerInitials, color: ownerColor } = getMemberInitials(item.owner);
              const ringColor = health >= 80 ? "#14b8a6" : health >= 60 ? "#f59e0b" : "#f43f5e";
              return (
                <button
                  key={item.id}
                  data-testid={`kanban-item-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className="w-full text-left p-2.5 bg-card border border-border rounded-lg hover:border-primary transition-colors group"
                >
                  <div className="flex items-start gap-1.5 mb-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${priorityColors[priority] || "bg-slate-400"}`} title={priority} />
                    <p className="text-[11px] font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors flex-1">{item.initiative}</p>
                    {/* Health ring */}
                    <div className="relative w-5 h-5 flex-shrink-0" title={`Health: ${health}/100`}>
                      <svg viewBox="0 0 20 20" className="w-5 h-5 -rotate-90">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                        <circle cx="10" cy="10" r="8" fill="none" stroke={ringColor} strokeWidth="2.5"
                          strokeDasharray={`${2 * Math.PI * 8}`}
                          strokeDashoffset={`${2 * Math.PI * 8 * (1 - health / 100)}`}
                          strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold" style={{ color: ringColor }}>{health}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap mb-1.5">
                    <Badge className={`text-[9px] px-1 py-0 ${brandColors[item.brand]}`}>{item.brand === "RECORD" ? "REC" : "AA"}</Badge>
                    <Badge className={`text-[9px] px-1 py-0 ${impactColors[item.impact]}`}>{item.impact}</Badge>
                    <span className={`text-[9px] font-mono font-bold px-1 py-0 rounded ${gateProgressColors[item.gateStage]} text-white`}>{gateShortName[item.gateStage]}</span>
                  </div>
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${completion}%` }} />
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-4 h-4 ${ownerColor} rounded-full flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0`}>{ownerInitials}</div>
                    <span className="text-[9px] text-muted-foreground flex-1 truncate">{item.owner}</span>
                    <span className="text-[9px] text-muted-foreground">💬{commentCount}</span>
                    {linkedCount > 0 && <span className="text-[9px] text-muted-foreground">🔗{linkedCount}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LIST VIEW ─────────────────────────────────────────────────────────────

function ListView({ items, onSelectItem }: { items: RoadmapItem[]; onSelectItem: (item: RoadmapItem) => void }) {
  const getCompletion = (item: RoadmapItem) => (item as any).completionPct || Math.floor(Math.random() * 80 + 10);
  const getCommentCount = (item: RoadmapItem) => (item as any).comments?.length || Math.floor(Math.random() * 5);
  const getPriority = (item: RoadmapItem) =>
    (item as any).priority || (item.impact === "critical" ? "P0" : item.impact === "high" ? "P1" : item.impact === "medium" ? "P2" : "P3");

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            {["Initiative", "Brand", "Product Line", "Status", "Gate", "Priority", "Quarter", "Impact", "Effort", "Owner", "Completion", "Comments", "Budget"].map(h => (
              <th key={h} className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const pct = getCompletion(item);
            const priority = getPriority(item);
            return (
              <tr
                key={item.id}
                data-testid={`list-row-${item.id}`}
                onClick={() => onSelectItem(item)}
                className="border-b border-border/50 hover:bg-secondary/40 cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-3 font-medium max-w-[200px]"><p className="truncate">{item.initiative}</p></td>
                <td className="py-2.5 px-3"><Badge className={`text-[10px] ${brandColors[item.brand]}`}>{item.brand}</Badge></td>
                <td className="py-2.5 px-3 text-muted-foreground">{item.productLine}</td>
                <td className="py-2.5 px-3"><Badge className={`text-[10px] ${statusColors[item.status]}`}>{item.status}</Badge></td>
                <td className="py-2.5 px-3"><span className={`font-mono font-semibold ${gateTextColors[item.gateStage]}`}>{gateShortName[item.gateStage]}</span></td>
                <td className="py-2.5 px-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${priorityColors[priority] || "bg-slate-400"}`}>{priority}</span>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">{item.quarter} {item.year}</td>
                <td className="py-2.5 px-3"><Badge className={`text-[10px] ${impactColors[item.impact]}`}>{item.impact}</Badge></td>
                <td className="py-2.5 px-3"><span className="font-mono text-muted-foreground">{item.effort}</span></td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={item.owner} size="xs" />
                    <span className="text-muted-foreground truncate max-w-[80px]">{item.owner}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-muted-foreground font-mono">{pct}%</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">💬 {getCommentCount(item)}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{item.budget ? `$${item.budget}k` : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── SAVED VIEWS ──────────────────────────────────────────────────────────

interface SavedView {
  id: string;
  name: string;
  brand: string;
  status: string;
  impact: string;
  vertical: string;
  priority: string;
  assignee: string;
  state: string;
  myItemsOnly: boolean;
  search: string;
}

const defaultSavedViews: SavedView[] = [
  { id: "sv-001", name: "My Initiatives", brand: "all", status: "all", impact: "all", vertical: "all", priority: "all", assignee: "J. Tubbs", state: "all", myItemsOnly: true, search: "" },
  { id: "sv-002", name: "Critical P0", brand: "all", status: "all", impact: "critical", vertical: "all", priority: "P0", assignee: "all", state: "all", myItemsOnly: false, search: "" },
  { id: "sv-003", name: "RECORD Only", brand: "RECORD", status: "all", impact: "all", vertical: "all", priority: "all", assignee: "all", state: "all", myItemsOnly: false, search: "" },
  { id: "sv-004", name: "Florida Scope", brand: "all", status: "all", impact: "all", vertical: "all", priority: "all", assignee: "all", state: "Southeast", myItemsOnly: false, search: "FL" },
];

// ─── ROADMAP TAB ──────────────────────────────────────────────────────────

function RoadmapTab({
  allItems,
  onItemsChange,
  openDrawerFor,
  onOpenDrawer,
  onNewInitiative,
  onExport,
}: {
  allItems: RoadmapItem[];
  onItemsChange: (items: RoadmapItem[]) => void;
  openDrawerFor: RoadmapItem | null;
  onOpenDrawer: (item: RoadmapItem | null) => void;
  onNewInitiative: () => void;
  onExport: () => void;
}) {
  const { toast } = useToast();
  const [view, setView] = useState<"calendar" | "kanban" | "list">("calendar");
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterImpact, setFilterImpact] = useState<string>("all");
  const [filterVertical, setFilterVertical] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterState, setFilterState] = useState<string>("all");
  const [myItemsOnly, setMyItemsOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [savedViews, setSavedViews] = useState<SavedView[]>(defaultSavedViews);
  const [saveViewName, setSaveViewName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  const members = getTeamMembers();

  const currentFilterState = (): Omit<SavedView, "id" | "name"> => ({
    brand: filterBrand,
    status: filterStatus,
    impact: filterImpact,
    vertical: filterVertical,
    priority: filterPriority,
    assignee: filterAssignee,
    state: filterState,
    myItemsOnly,
    search,
  });

  const applyView = (v: SavedView) => {
    setFilterBrand(v.brand);
    setFilterStatus(v.status);
    setFilterImpact(v.impact);
    setFilterVertical(v.vertical);
    setFilterPriority(v.priority);
    setFilterAssignee(v.assignee);
    setFilterState(v.state);
    setMyItemsOnly(v.myItemsOnly);
    setSearch(v.search);
    toast({ title: `View restored: ${v.name}` });
  };

  const saveCurrentView = () => {
    if (!saveViewName.trim()) return;
    const newView: SavedView = {
      id: `sv-${Date.now()}`,
      name: saveViewName.trim(),
      ...currentFilterState(),
    };
    setSavedViews(prev => [...prev, newView]);
    setSaveViewName("");
    setShowSaveInput(false);
    toast({ title: "View saved", description: `"${newView.name}" added to saved views.` });
  };

  const filtered = useMemo(() => {
    return allItems.filter(item => {
      if (filterBrand !== "all" && item.brand !== filterBrand) return false;
      if (filterStatus !== "all" && item.status !== filterStatus) return false;
      if (filterImpact !== "all" && item.impact !== filterImpact) return false;
      if (filterVertical !== "all" && !item.verticals.includes(filterVertical as Vertical)) return false;
      if (filterAssignee !== "all" && item.owner !== filterAssignee) return false;
      if (filterState !== "all" && item.region !== filterState) return false;
      if (myItemsOnly && !item.owner.includes("Tubbs")) return false;
      if (filterPriority !== "all") {
        const p = (item as any).priority || (item.impact === "critical" ? "P0" : item.impact === "high" ? "P1" : item.impact === "medium" ? "P2" : "P3");
        if (p !== filterPriority) return false;
      }
      if (search && !item.initiative.toLowerCase().includes(search.toLowerCase()) && !item.productLine.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [allItems, filterBrand, filterStatus, filterImpact, filterVertical, filterAssignee, filterState, myItemsOnly, filterPriority, search]);

  const allVerticals = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach(i => i.verticals.forEach(v => set.add(v)));
    return Array.from(set).sort();
  }, [allItems]);

  return (
    <PageWrap>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <SectionTitle sub={`${filtered.length} of ${allItems.length} initiatives`}>Product Roadmap</SectionTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            {(["calendar", "kanban", "list"] as const).map(v => (
              <button
                key={v}
                data-testid={`view-${v}`}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <Button data-testid="roadmap-new-initiative" size="sm" variant="outline" onClick={onNewInitiative} className="text-xs">+ New</Button>
          <Button data-testid="roadmap-export-csv" size="sm" variant="outline" onClick={onExport} className="text-xs">Export CSV</Button>
        </div>
      </div>

      {/* Saved Views Chips */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Saved Views:</span>
        {savedViews.map(sv => (
          <button
            key={sv.id}
            data-testid={`saved-view-${sv.id}`}
            onClick={() => applyView(sv)}
            className="px-2.5 py-1 text-[10px] font-medium bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full border border-border transition-colors"
          >
            {sv.name}
          </button>
        ))}
        {showSaveInput ? (
          <div className="flex items-center gap-1">
            <Input
              data-testid="save-view-name-input"
              value={saveViewName}
              onChange={e => setSaveViewName(e.target.value)}
              placeholder="View name..."
              className="h-7 w-32 text-xs"
              onKeyDown={e => { if (e.key === "Enter") saveCurrentView(); }}
            />
            <Button data-testid="btn-confirm-save-view" size="sm" onClick={saveCurrentView} className="h-7 text-xs px-2">Save</Button>
            <button data-testid="btn-cancel-save-view" onClick={() => setShowSaveInput(false)} className="text-muted-foreground hover:text-foreground text-xs">×</button>
          </div>
        ) : (
          <button
            data-testid="btn-save-current-view"
            onClick={() => setShowSaveInput(true)}
            className="px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary rounded-full transition-colors"
          >
            + Save Current View
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <Input
          data-testid="roadmap-search"
          placeholder="Search initiatives..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-48 h-8 text-xs"
        />
        <Select value={filterBrand} onValueChange={setFilterBrand}>
          <SelectTrigger className="w-32 h-8 text-xs" data-testid="filter-brand"><SelectValue placeholder="Brand" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            <SelectItem value="ASSA ABLOY">ASSA ABLOY</SelectItem>
            <SelectItem value="RECORD">RECORD</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 h-8 text-xs" data-testid="filter-status"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(["concept", "development", "testing", "launch", "sustain", "eol"] as RoadmapStatus[]).map(s => (
              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterImpact} onValueChange={setFilterImpact}>
          <SelectTrigger className="w-28 h-8 text-xs" data-testid="filter-impact"><SelectValue placeholder="Impact" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Impact</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-24 h-8 text-xs" data-testid="filter-priority"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="P0">P0 — Critical</SelectItem>
            <SelectItem value="P1">P1 — High</SelectItem>
            <SelectItem value="P2">P2 — Medium</SelectItem>
            <SelectItem value="P3">P3 — Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAssignee} onValueChange={setFilterAssignee}>
          <SelectTrigger className="w-32 h-8 text-xs" data-testid="filter-assignee"><SelectValue placeholder="Assignee" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {members.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterVertical} onValueChange={setFilterVertical}>
          <SelectTrigger className="w-36 h-8 text-xs" data-testid="filter-vertical"><SelectValue placeholder="Vertical" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verticals</SelectItem>
            {allVerticals.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterState} onValueChange={setFilterState}>
          <SelectTrigger className="w-32 h-8 text-xs" data-testid="filter-region"><SelectValue placeholder="Region" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {["National", "Northeast", "Southeast", "Midwest", "Southwest", "West", "Canada"].map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          data-testid="filter-my-items"
          onClick={() => setMyItemsOnly(v => !v)}
          className={`px-3 py-1 h-8 text-xs font-medium rounded-md border transition-colors ${myItemsOnly ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}
        >
          My Items
        </button>
      </div>

      {/* Views */}
      <AnimatePresence mode="wait">
        {view === "calendar" && (
          <motion.div key="calendar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="mb-3 flex items-center gap-4 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-teal-500 opacity-80 inline-block" /> ASSA ABLOY</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-violet-500 opacity-80 inline-block" /> RECORD</div>
              <div className="flex items-center gap-1.5"><span className="w-0.5 h-4 bg-rose-500 inline-block" /> Today</div>
              <div className="flex items-center gap-1.5">◆ Gate milestone</div>
            </div>
            <CalendarView items={filtered} onSelectItem={onOpenDrawer} />
          </motion.div>
        )}
        {view === "kanban" && (
          <motion.div key="kanban" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <KanbanView items={filtered} onSelectItem={onOpenDrawer} />
          </motion.div>
        )}
        {view === "list" && (
          <motion.div key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ListView items={filtered} onSelectItem={onOpenDrawer} />
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrap>
  );
}

// ─── STAGE-GATE TAB ────────────────────────────────────────────────────────

function StageGateTab({ allItems }: { allItems: RoadmapItem[] }) {
  const [selectedItem, setSelectedItem] = useState<RoadmapItem>(allItems[0] || roadmapItems[0]);
  const [checkState, setCheckState] = useState<Record<string, boolean>>({});
  const [approvals, setApprovals] = useState<Record<string, { checked: boolean; date: string }>>({});
  const { toast } = useToast();

  const criteria = getGateCriteria(selectedItem.gateStage);
  const required = criteria.filter(c => c.required);
  const optional = criteria.filter(c => !c.required);
  const checkedRequired = required.filter(c => checkState[c.id]).length;
  const allRequiredMet = checkedRequired === required.length && required.length > 0;
  const completionPct = required.length > 0 ? Math.round(checkedRequired / required.length * 100) : 100;
  const gateIdx = gateOrder.indexOf(selectedItem.gateStage);
  const history = gateHistory[selectedItem.id] || [];

  const handleGoNoGo = (decision: "go" | "no-go") => {
    if (decision === "go" && !allRequiredMet) {
      toast({ title: "Missing required criteria", description: `${required.length - checkedRequired} required item(s) not yet satisfied.`, variant: "destructive" });
      return;
    }
    toast({ title: decision === "go" ? "GO decision recorded" : "NO-GO — returned to team", description: decision === "go" ? `${selectedItem.initiative} advancing to ${gateFullName[getNextGate(selectedItem.gateStage) || "sustain"]}` : "Item flagged for revision." });
  };

  const handleExportGatePackage = () => {
    const lines = [
      `GATE REVIEW PACKAGE — ${gateFullName[selectedItem.gateStage]}`,
      `Initiative: ${selectedItem.initiative}`,
      `Brand: ${selectedItem.brand} | Product: ${selectedItem.productLine}`,
      `Owner: ${selectedItem.owner} | Target: ${selectedItem.quarter} ${selectedItem.year}`,
      `Readiness: ${completionPct}% (${checkedRequired}/${required.length} required criteria met)`,
      "",
      "--- REQUIRED CRITERIA ---",
      ...required.map(c => `${checkState[c.id] ? "[X]" : "[ ]"} ${c.criterion}\n    ${c.description}`),
      "",
      "--- OPTIONAL CRITERIA ---",
      ...optional.map(c => `${checkState[c.id] ? "[X]" : "[ ]"} ${c.criterion}`),
      "",
      "--- STAKEHOLDER SIGN-OFFS ---",
      ...stageApprovers.map(a => `${approvals[a.role]?.checked ? `[X] ${a.name} — signed ${approvals[a.role]?.date}` : `[ ] ${a.name}${a.required ? " (required)" : ""}`}`),
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      toast({ title: "Gate package copied", description: "Paste into Confluence, email, or project tracker." });
    });
  };

  return (
    <PageWrap>
      <SectionTitle sub="Cooper Stage-Gate (G0–G5) · Select an initiative to review gate criteria and record a go/no-go decision">Stage-Gate Review</SectionTitle>

      <div className="flex flex-wrap gap-3 mb-5">
        <Select value={selectedItem.id} onValueChange={v => { const item = allItems.find(i => i.id === v); if (item) { setSelectedItem(item); setCheckState({}); setApprovals({}); } }}>
          <SelectTrigger className="w-full md:w-[480px]" data-testid="stagegate-item-select"><SelectValue /></SelectTrigger>
          <SelectContent>
            {allItems.map(item => (
              <SelectItem key={item.id} value={item.id}>
                <span className="text-xs"><span className={`font-mono font-bold ${gateTextColors[item.gateStage]}`}>{gateShortName[item.gateStage]}</span> · {item.initiative}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button data-testid="btn-export-gate-package" variant="outline" size="sm" onClick={handleExportGatePackage} className="text-xs gap-1.5">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export Gate Package
        </Button>
      </div>

      {/* Gate Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {gateOrder.map((gate, idx) => {
            const isActive = gate === selectedItem.gateStage;
            const isPast = idx < gateIdx;
            return (
              <div key={gate} className="flex items-center gap-1 flex-shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isActive ? `${gateProgressColors[gate]} text-white shadow-md` : isPast ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-secondary text-muted-foreground"}`}>
                  {isPast && <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>}
                  {gateShortName[gate]}
                </div>
                {idx < gateOrder.length - 1 && <span className="text-muted-foreground text-xs">›</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left: Info + Score + History */}
        <div className="space-y-3">
          <Card className="border border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Gate</p>
              <p className="text-base font-bold text-foreground">{gateFullName[selectedItem.gateStage]}</p>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground mb-1">Initiative</p>
              <p className="text-sm font-medium leading-tight">{selectedItem.initiative}</p>
              <Separator className="my-3" />
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="font-medium">{selectedItem.owner}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Target</span>
                  <span className="font-medium">{selectedItem.quarter} {selectedItem.year}</span>
                </div>
                {selectedItem.budget && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">${selectedItem.budget}k</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Gate Readiness</p>
              <div className="flex items-end gap-2 mb-2">
                <p className={`text-3xl font-bold ${completionPct === 100 ? "text-teal-500" : completionPct > 60 ? "text-amber-500" : "text-rose-500"}`}>{completionPct}%</p>
                <p className="text-xs text-muted-foreground mb-1">required</p>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mb-3">
                <div className={`h-2 rounded-full transition-all ${completionPct === 100 ? "bg-teal-500" : completionPct > 60 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${completionPct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{checkedRequired}/{required.length} required criteria met</p>
            </CardContent>
          </Card>

          {/* Gate History */}
          {history.length > 0 && (
            <Card className="border border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Gate History</p>
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${h.decision.startsWith("GO") ? "bg-teal-500" : "bg-rose-500"}`} />
                      <span className="font-semibold">{h.gate}</span>
                      <span className={`text-[10px] font-bold ${h.decision.startsWith("GO") ? "text-teal-500" : "text-rose-500"}`}>{h.decision}</span>
                      <span className="text-muted-foreground ml-auto">{h.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Go/No-Go */}
          <div className="flex gap-2">
            <Button
              data-testid="btn-go-decision"
              onClick={() => handleGoNoGo("go")}
              className={`flex-1 text-xs ${allRequiredMet ? "bg-teal-500 hover:bg-teal-600 text-white" : "bg-secondary text-muted-foreground"}`}
            >
              GO ✓
            </Button>
            <Button
              data-testid="btn-nogo-decision"
              variant="outline"
              onClick={() => handleGoNoGo("no-go")}
              className="flex-1 text-xs text-rose-500 border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            >
              NO-GO ✗
            </Button>
          </div>
        </div>

        {/* Right: Criteria */}
        <div className="md:col-span-3 space-y-4">
          {/* Required Criteria */}
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                Required Criteria
                <Badge className="text-[10px] ml-2">{checkedRequired}/{required.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {required.map(c => (
                  <div key={c.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${checkState[c.id] ? "bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900" : "bg-secondary border border-transparent"}`}>
                    <Checkbox
                      id={c.id}
                      data-testid={`criteria-${c.id}`}
                      checked={!!checkState[c.id]}
                      onCheckedChange={v => setCheckState(prev => ({ ...prev, [c.id]: !!v }))}
                      className="mt-0.5"
                    />
                    <div className="min-w-0">
                      <label htmlFor={c.id} className="text-xs font-semibold cursor-pointer">{c.criterion}</label>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optional Criteria */}
          {optional.length > 0 && (
            <Card className="border border-border">
              <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold text-muted-foreground">Optional / Recommended</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {optional.map(c => (
                    <div key={c.id} className="flex items-center gap-3">
                      <Checkbox
                        id={`opt-${c.id}`}
                        data-testid={`opt-criteria-${c.id}`}
                        checked={!!checkState[c.id]}
                        onCheckedChange={v => setCheckState(prev => ({ ...prev, [c.id]: !!v }))}
                      />
                      <label htmlFor={`opt-${c.id}`} className="text-xs text-muted-foreground cursor-pointer">{c.criterion}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stakeholder Sign-offs */}
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Stakeholder Sign-offs</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {stageApprovers.map(approver => (
                  <div key={approver.role} className="flex items-center gap-3 p-2.5 bg-secondary rounded-lg">
                    <Checkbox
                      id={`approver-${approver.role}`}
                      data-testid={`approver-${approver.role}`}
                      checked={!!approvals[approver.role]?.checked}
                      onCheckedChange={v => setApprovals(prev => ({
                        ...prev,
                        [approver.role]: { checked: !!v, date: new Date().toLocaleDateString() },
                      }))}
                    />
                    <div className="flex-1 min-w-0">
                      <label htmlFor={`approver-${approver.role}`} className="text-xs font-medium cursor-pointer">{approver.name}</label>
                      {approvals[approver.role]?.checked && (
                        <p className="text-[10px] text-teal-500">Signed {approvals[approver.role]?.date}</p>
                      )}
                    </div>
                    {approver.required && <Badge className="text-[10px] bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300">Required</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── HANDOFFS TAB ──────────────────────────────────────────────────────────

function HandoffsTab({ allItems }: { allItems: RoadmapItem[] }) {
  const handoffTypeList: { key: HandoffType; label: string }[] = [
    { key: "concept_to_engineering", label: "Concept → Eng" },
    { key: "engineering_to_manufacturing", label: "Eng → Mfg" },
    { key: "pm_to_marketing", label: "PM → Marketing" },
    { key: "pm_to_sales", label: "PM → Sales" },
    { key: "manufacturing_to_qa", label: "Mfg → QA" },
    { key: "qa_to_launch", label: "QA → Launch" },
    { key: "launch_to_sustain", label: "Launch → Sustain" },
  ];
  const [selectedType, setSelectedType] = useState<HandoffType>("concept_to_engineering");
  const [checkState, setCheckState] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const template = handoffTemplates.find(t => t.type === selectedType);

  const toggleCheck = (item: string) => setCheckState(prev => ({ ...prev, [item]: !prev[item] }));

  const handleCopy = () => {
    if (!template) return;
    const lines = [
      `=== ${template.title} ===`,
      `From: ${template.from}  →  To: ${template.to}`,
      `Purpose: ${template.purpose}`,
      "",
      "--- CHECKLIST ---",
      ...(template.checklist || []).map((c, i) => `${checkState[c] ? "[x]" : "[ ]"} ${c}`),
      "",
      "--- REQUIRED FIELDS ---",
      ...(template.fields || []).map(f => `${f.label}: _________________________`),
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      toast({ title: "Handoff template copied to clipboard" });
    });
  };

  if (!template) return <PageWrap><p className="text-sm text-muted-foreground">Template not found.</p></PageWrap>;

  const checkedCount = (template.checklist || []).filter(c => checkState[c]).length;
  const totalCount = (template.checklist || []).length;
  const pct = totalCount > 0 ? Math.round(checkedCount / totalCount * 100) : 0;

  return (
    <PageWrap>
      <SectionTitle sub="Structured NPD handoff templates — from Concept through Launch to Sustain">
        Handoff Templates
      </SectionTitle>

      {/* Type Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {handoffTypeList.map(({ key, label }) => (
          <button
            key={key}
            data-testid={`handoff-tab-${key}`}
            onClick={() => { setSelectedType(key); setCheckState({}); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedType === key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Checklist */}
        <div className="md:col-span-2 space-y-4">
          {/* Header card */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{template.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{template.purpose}</p>
                </div>
                <Button data-testid="btn-copy-handoff" size="sm" variant="outline" onClick={handleCopy} className="text-xs gap-1.5 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  Copy
                </Button>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-2 rounded-full transition-all ${pct === 100 ? "bg-teal-500" : pct > 50 ? "bg-amber-500" : "bg-rose-400"}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-foreground">{checkedCount}/{totalCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Pre-Handoff Checklist</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {(template.checklist || []).map((item, i) => (
                  <div
                    key={i}
                    data-testid={`handoff-check-${i}`}
                    onClick={() => toggleCheck(item)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                      checkState[item] ? "bg-teal-500 border-teal-500" : "border-border"
                    }`}>
                      {checkState[item] && <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <p className={`text-xs leading-relaxed ${checkState[item] ? "line-through text-muted-foreground" : "text-foreground"}`}>{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Required Fields */}
          {template.fields && template.fields.length > 0 && (
            <Card className="border border-border">
              <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Required Fields</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-3">
                  {template.fields.map(field => (
                    <div key={field.id} data-testid={`handoff-field-${field.id}`}>
                      <label className="text-xs font-medium text-foreground block mb-1">
                        {field.label}{field.required && <span className="text-rose-500 ml-1">*</span>}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          placeholder={field.placeholder || ""}
                          rows={3}
                          className="w-full text-xs bg-secondary border border-border rounded-lg p-2.5 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      ) : field.type === "select" ? (
                        <select className="w-full text-xs bg-secondary border border-border rounded-lg p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                          <option value="">Select...</option>
                          {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={field.type === "number" ? "number" : "text"}
                          placeholder={field.placeholder || ""}
                          className="w-full text-xs bg-secondary border border-border rounded-lg p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-3">
          <Card className="border border-border">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Template Info</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From</span>
                  <span className="font-medium">{template.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-medium">{template.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Checklist items</span>
                  <span className="font-medium">{totalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required fields</span>
                  <span className="font-medium">{(template.fields || []).filter(f => f.required).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. fill time</span>
                  <span className="font-medium">15–20 min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Linked Initiatives</p>
              <div className="space-y-2">
                {allItems.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[item.status]}`} />
                    <span className="truncate text-muted-foreground">{item.initiative}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">All Templates</p>
              <div className="space-y-1">
                {handoffTypeList.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedType(key); setCheckState({}); }}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                      selectedType === key ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── LAUNCH READINESS TAB ─────────────────────────────────────────────────

const LRS_PRODUCTS = [
  {
    id: "sl500",
    label: "SL500 R104 HVHZ Upgrade",
    score: 94,
    status: "ready" as const,
    workstreams: [
      { name: "Engineering Readiness", weight: 20, score: 98, items: [
        { text: "DVT complete", status: "pass" as const },
        { text: "Cycle testing ≥500K", status: "pass" as const },
        { text: "Safety validation", status: "pass" as const },
      ]},
      { name: "Manufacturing Readiness", weight: 15, score: 95, items: [
        { text: "Line qualified", status: "pass" as const },
        { text: "Yield ≥98%", status: "pass" as const },
        { text: "Supplier secured", status: "pass" as const },
      ]},
      { name: "Regulatory/Compliance", weight: 15, score: 100, items: [
        { text: "UL listed", status: "pass" as const },
        { text: "ANSI/BHMA certified", status: "pass" as const },
        { text: "NOA (HVHZ)", status: "pass" as const },
      ]},
      { name: "Field Service Readiness", weight: 15, score: 90, items: [
        { text: "AAADM certified techs", status: "pass" as const },
        { text: "Spare parts (8-wk supply)", status: "pass" as const },
        { text: "Service manual published", status: "pass" as const },
      ]},
      { name: "Channel/Distribution Readiness", weight: 10, score: 92, items: [
        { text: "Distributor trained", status: "pass" as const },
        { text: "Pricing loaded", status: "pass" as const },
        { text: "Availability confirmed", status: "pass" as const },
      ]},
      { name: "Marketing/Collateral", weight: 10, score: 95, items: [
        { text: "BIM object available", status: "pass" as const },
        { text: "Spec guide published", status: "pass" as const },
        { text: "Sell sheet complete", status: "pass" as const },
      ]},
      { name: "GTM / Sales Enablement", weight: 15, score: 88, items: [
        { text: "Sales trained", status: "pass" as const },
        { text: "Demo units deployed", status: "pass" as const },
        { text: "Battlecard updated", status: "warn" as const },
      ]},
    ],
    gates: [
      { label: "DVT Cycle Testing Complete (≥500K cycles)", pass: true },
      { label: "Field Service Infrastructure Ready", pass: true },
      { label: "Regulatory Approvals Complete (UL, ANSI, state codes)", pass: true },
      { label: "BIM Object Published (Openings Studio / ASSA ABLOY BIM library)", pass: true },
    ],
  },
  {
    id: "sw60",
    label: "SW60 Slim Retrofit",
    score: 87,
    status: "at-risk" as const,
    workstreams: [
      { name: "Engineering Readiness", weight: 20, score: 96, items: [
        { text: "DVT complete", status: "pass" as const },
        { text: "Cycle testing ≥500K", status: "pass" as const },
        { text: "Safety validation", status: "pass" as const },
      ]},
      { name: "Manufacturing Readiness", weight: 15, score: 90, items: [
        { text: "Line qualified", status: "pass" as const },
        { text: "Yield ≥98%", status: "warn" as const },
        { text: "Supplier secured", status: "pass" as const },
      ]},
      { name: "Regulatory/Compliance", weight: 15, score: 92, items: [
        { text: "UL listed", status: "pass" as const },
        { text: "ANSI/BHMA certified", status: "pass" as const },
        { text: "ADA compliant", status: "pass" as const },
      ]},
      { name: "Field Service Readiness", weight: 15, score: 62, items: [
        { text: "AAADM certified techs", status: "warn" as const },
        { text: "Spare parts (8-wk supply)", status: "fail" as const },
        { text: "Service manual published", status: "warn" as const },
      ]},
      { name: "Channel/Distribution Readiness", weight: 10, score: 88, items: [
        { text: "Distributor trained", status: "pass" as const },
        { text: "Pricing loaded", status: "pass" as const },
        { text: "Availability confirmed", status: "warn" as const },
      ]},
      { name: "Marketing/Collateral", weight: 10, score: 90, items: [
        { text: "BIM object available", status: "pass" as const },
        { text: "Spec guide published", status: "pass" as const },
        { text: "Sell sheet complete", status: "pass" as const },
      ]},
      { name: "GTM / Sales Enablement", weight: 15, score: 85, items: [
        { text: "Sales trained", status: "pass" as const },
        { text: "Demo units deployed", status: "warn" as const },
        { text: "Battlecard updated", status: "pass" as const },
      ]},
    ],
    gates: [
      { label: "DVT Cycle Testing Complete (≥500K cycles)", pass: true },
      { label: "Field Service Infrastructure Ready", pass: false },
      { label: "Regulatory Approvals Complete (UL, ANSI, state codes)", pass: true },
      { label: "BIM Object Published (Openings Studio / ASSA ABLOY BIM library)", pass: true },
    ],
  },
  {
    id: "versamax",
    label: "VersaMax ICU",
    score: 96,
    status: "ready" as const,
    workstreams: [
      { name: "Engineering Readiness", weight: 20, score: 100, items: [
        { text: "DVT complete", status: "pass" as const },
        { text: "Cycle testing ≥500K", status: "pass" as const },
        { text: "Safety validation", status: "pass" as const },
      ]},
      { name: "Manufacturing Readiness", weight: 15, score: 98, items: [
        { text: "Line qualified", status: "pass" as const },
        { text: "Yield ≥98%", status: "pass" as const },
        { text: "Supplier secured", status: "pass" as const },
      ]},
      { name: "Regulatory/Compliance", weight: 15, score: 100, items: [
        { text: "UL listed", status: "pass" as const },
        { text: "ANSI/BHMA certified", status: "pass" as const },
        { text: "ADA compliant", status: "pass" as const },
      ]},
      { name: "Field Service Readiness", weight: 15, score: 95, items: [
        { text: "AAADM certified techs", status: "pass" as const },
        { text: "Spare parts (8-wk supply)", status: "pass" as const },
        { text: "Service manual published", status: "pass" as const },
      ]},
      { name: "Channel/Distribution Readiness", weight: 10, score: 94, items: [
        { text: "Distributor trained", status: "pass" as const },
        { text: "Pricing loaded", status: "pass" as const },
        { text: "Availability confirmed", status: "pass" as const },
      ]},
      { name: "Marketing/Collateral", weight: 10, score: 96, items: [
        { text: "BIM object available", status: "pass" as const },
        { text: "Spec guide published", status: "pass" as const },
        { text: "Sell sheet complete", status: "pass" as const },
      ]},
      { name: "GTM / Sales Enablement", weight: 15, score: 92, items: [
        { text: "Sales trained", status: "pass" as const },
        { text: "Demo units deployed", status: "pass" as const },
        { text: "Battlecard updated", status: "pass" as const },
      ]},
    ],
    gates: [
      { label: "DVT Cycle Testing Complete (≥500K cycles)", pass: true },
      { label: "Field Service Infrastructure Ready", pass: true },
      { label: "Regulatory Approvals Complete (UL, ANSI, state codes)", pass: true },
      { label: "BIM Object Published (Openings Studio / ASSA ABLOY BIM library)", pass: true },
    ],
  },
  {
    id: "tsa200",
    label: "TSA 200 Telescopic",
    score: 78,
    status: "not-ready" as const,
    workstreams: [
      { name: "Engineering Readiness", weight: 20, score: 90, items: [
        { text: "DVT complete", status: "pass" as const },
        { text: "Cycle testing ≥500K", status: "warn" as const },
        { text: "Safety validation", status: "pass" as const },
      ]},
      { name: "Manufacturing Readiness", weight: 15, score: 82, items: [
        { text: "Line qualified", status: "pass" as const },
        { text: "Yield ≥98%", status: "warn" as const },
        { text: "Supplier secured", status: "pass" as const },
      ]},
      { name: "Regulatory/Compliance", weight: 15, score: 75, items: [
        { text: "UL listed", status: "pass" as const },
        { text: "ANSI/BHMA certified", status: "warn" as const },
        { text: "ADA compliant", status: "pass" as const },
      ]},
      { name: "Field Service Readiness", weight: 15, score: 72, items: [
        { text: "AAADM certified techs", status: "warn" as const },
        { text: "Spare parts (8-wk supply)", status: "warn" as const },
        { text: "Service manual published", status: "pass" as const },
      ]},
      { name: "Channel/Distribution Readiness", weight: 10, score: 80, items: [
        { text: "Distributor trained", status: "warn" as const },
        { text: "Pricing loaded", status: "pass" as const },
        { text: "Availability confirmed", status: "warn" as const },
      ]},
      { name: "Marketing/Collateral", weight: 10, score: 55, items: [
        { text: "BIM object available", status: "fail" as const },
        { text: "Spec guide published", status: "warn" as const },
        { text: "Sell sheet complete", status: "pass" as const },
      ]},
      { name: "GTM / Sales Enablement", weight: 15, score: 78, items: [
        { text: "Sales trained", status: "warn" as const },
        { text: "Demo units deployed", status: "warn" as const },
        { text: "Battlecard updated", status: "fail" as const },
      ]},
    ],
    gates: [
      { label: "DVT Cycle Testing Complete (≥500K cycles)", pass: false },
      { label: "Field Service Infrastructure Ready", pass: false },
      { label: "Regulatory Approvals Complete (UL, ANSI, state codes)", pass: false },
      { label: "BIM Object Published (Openings Studio / ASSA ABLOY BIM library)", pass: false },
    ],
  },
  {
    id: "connectgateway",
    label: "ConnectGateway IoT",
    score: 82,
    status: "at-risk" as const,
    workstreams: [
      { name: "Engineering Readiness", weight: 20, score: 90, items: [
        { text: "DVT complete", status: "pass" as const },
        { text: "Cycle testing ≥500K", status: "pass" as const },
        { text: "Safety validation", status: "pass" as const },
      ]},
      { name: "Manufacturing Readiness", weight: 15, score: 88, items: [
        { text: "Line qualified", status: "pass" as const },
        { text: "Yield ≥98%", status: "pass" as const },
        { text: "Supplier secured", status: "warn" as const },
      ]},
      { name: "Regulatory/Compliance", weight: 15, score: 60, items: [
        { text: "UL listed", status: "pass" as const },
        { text: "ANSI/BHMA certified", status: "warn" as const },
        { text: "Regulatory approval (pending)", status: "fail" as const },
      ]},
      { name: "Field Service Readiness", weight: 15, score: 85, items: [
        { text: "AAADM certified techs", status: "pass" as const },
        { text: "Spare parts (8-wk supply)", status: "pass" as const },
        { text: "Service manual published", status: "warn" as const },
      ]},
      { name: "Channel/Distribution Readiness", weight: 10, score: 82, items: [
        { text: "Distributor trained", status: "pass" as const },
        { text: "Pricing loaded", status: "warn" as const },
        { text: "Availability confirmed", status: "pass" as const },
      ]},
      { name: "Marketing/Collateral", weight: 10, score: 88, items: [
        { text: "BIM object available", status: "pass" as const },
        { text: "Spec guide published", status: "pass" as const },
        { text: "Sell sheet complete", status: "warn" as const },
      ]},
      { name: "GTM / Sales Enablement", weight: 15, score: 85, items: [
        { text: "Sales trained", status: "pass" as const },
        { text: "Demo units deployed", status: "warn" as const },
        { text: "Battlecard updated", status: "pass" as const },
      ]},
    ],
    gates: [
      { label: "DVT Cycle Testing Complete (≥500K cycles)", pass: true },
      { label: "Field Service Infrastructure Ready", pass: true },
      { label: "Regulatory Approvals Complete (UL, ANSI, state codes)", pass: false },
      { label: "BIM Object Published (Openings Studio / ASSA ABLOY BIM library)", pass: true },
    ],
  },
];

function LaunchReadinessTab() {
  const [selectedProductId, setSelectedProductId] = useState(LRS_PRODUCTS[0].id);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { toast } = useToast();

  const product = LRS_PRODUCTS.find(p => p.id === selectedProductId) ?? LRS_PRODUCTS[0];
  const allGatesPass = product.gates.every(g => g.pass);
  const canLaunch = product.score >= 90 && allGatesPass;

  const scoreColor = product.score >= 90 ? "text-green-500" : product.score >= 70 ? "text-amber-500" : "text-red-500";
  const gaugeFill = product.score >= 90 ? "#22c55e" : product.score >= 70 ? "#f59e0b" : "#ef4444";
  const statusBadge = product.status === "ready"
    ? "bg-green-500/15 text-green-600 border-green-500/30"
    : product.status === "at-risk"
    ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
    : "bg-red-500/15 text-red-600 border-red-500/30";
  const statusLabel = product.status === "ready" ? "Ready to Launch" : product.status === "at-risk" ? "At Risk" : "Not Ready";

  const itemIcon = (s: "pass" | "warn" | "fail") =>
    s === "pass" ? <span className="text-green-500 font-bold">✓</span>
    : s === "warn" ? <span className="text-amber-500 font-bold">⚠</span>
    : <span className="text-red-500 font-bold">✗</span>;

  // Gauge SVG parameters
  const pct = product.score / 100;

  return (
    <PageWrap>
      <SectionTitle sub="Hardware Launch Readiness Scorecard — LRS ≥ 90 required to launch (hardware cannot be rolled back)">
        Launch Readiness
      </SectionTitle>

      {/* Product Selector */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Select Product</label>
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger className="w-72 text-sm" data-testid="lrs-product-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LRS_PRODUCTS.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge}`}>{statusLabel}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LRS Gauge */}
        <Card className="border border-border bg-card flex flex-col items-center justify-center py-6 px-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">LRS Score</p>
          <div className="relative flex flex-col items-center" style={{ width: 180, height: 110 }}>
            <svg width="180" height="110" viewBox="0 0 180 100" className="overflow-visible">
              {/* Background arc */}
              <path
                d={`M 10 100 A 80 80 0 0 1 170 100`}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Value arc */}
              <path
                d={`M 10 100 A 80 80 0 0 1 170 100`}
                fill="none"
                stroke={gaugeFill}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${251.2 * pct} 251.2`}
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
              {/* Threshold tick at 90 */}
              <line
                x1="90" y1="20" x2="90" y2="10"
                stroke="#94a3b8"
                strokeWidth="2"
                transform={`rotate(${(90/100)*180 - 90}, 90, 100)`}
              />
            </svg>
            <div className="absolute bottom-0 flex flex-col items-center">
              <span className={`text-5xl font-black tabular-nums ${scoreColor}`}>{product.score}</span>
              <span className="text-xs text-muted-foreground mt-0.5">/ 100</span>
            </div>
          </div>
          <div className="mt-4 flex gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500"></span>&lt;70 Not Ready</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span>70-89 At Risk</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>≥90 Ready</span>
          </div>
          <div className="mt-5 w-full">
            <p className="text-[10px] text-muted-foreground text-center mb-1">Hardware LRS threshold</p>
            <div className="relative h-2 bg-secondary rounded-full">
              <div
                className="absolute h-2 rounded-full transition-all duration-500"
                style={{ width: `${product.score}%`, backgroundColor: gaugeFill }}
              />
              <div className="absolute h-full w-0.5 bg-slate-400" style={{ left: "90%" }} title="Launch threshold: 90" />
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
              <span>0</span>
              <span className="ml-auto">90▲ 100</span>
            </div>
          </div>
        </Card>

        {/* Workstream Scorecards */}
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.workstreams.map((ws) => {
            const wsColor = ws.score >= 90 ? "bg-green-500" : ws.score >= 70 ? "bg-amber-500" : "bg-red-500";
            const wsText = ws.score >= 90 ? "text-green-600" : ws.score >= 70 ? "text-amber-600" : "text-red-600";
            return (
              <Card key={ws.name} className="border border-border bg-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{ws.name}</p>
                    <p className="text-[10px] text-muted-foreground">Weight: {ws.weight}%</p>
                  </div>
                  <span className={`text-lg font-black tabular-nums ${wsText}`}>{ws.score}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full mb-3">
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${wsColor}`} style={{ width: `${ws.score}%` }} />
                </div>
                <ul className="space-y-1">
                  {ws.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      {itemIcon(item.status)}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Must-Pass Gates */}
      <Card className="border border-border bg-card mt-6">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold">Must-Pass Gates — Hardware</CardTitle>
          <p className="text-xs text-muted-foreground">All 4 gates must pass before a launch can be authorized</p>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.gates.map((gate, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${
                gate.pass ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
              }`}>
                <span className={`text-xl font-black ${gate.pass ? "text-green-500" : "text-red-500"}`}>
                  {gate.pass ? "✓" : "✗"}
                </span>
                <span className="text-xs font-medium text-foreground">{gate.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clear for Launch Button */}
      <div className="mt-6 flex items-center gap-4">
        <Button
          data-testid="btn-clear-for-launch"
          disabled={!canLaunch}
          onClick={() => setShowConfirmModal(true)}
          className={`px-6 py-2 text-sm font-semibold ${
            canLaunch
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          ✓ Clear for Launch
        </Button>
        {!canLaunch && (
          <p className="text-xs text-muted-foreground">
            {product.score < 90 ? `LRS ${product.score} < 90 threshold. ` : ""}
            {!allGatesPass ? "One or more must-pass gates not cleared." : ""}
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <span className="text-5xl">🚀</span>
                <h3 className="text-lg font-bold text-foreground mt-3">Confirm Launch Authorization</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  You are about to authorize <strong className="text-foreground">{product.label}</strong> for launch.
                  LRS score: <strong className="text-green-500">{product.score}/100</strong>. All must-pass gates cleared.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setShowConfirmModal(false);
                    toast({ title: `${product.label} cleared for launch`, description: `LRS ${product.score} · All gates passed` });
                  }}
                >
                  Authorize Launch
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrap>
  );
}

// ─── VOC TAB ──────────────────────────────────────────────────────────────

function VocTab() {
  const [activeView, setActiveView] = useState<"insights" | "interviews" | "themes">("insights");
  const { toast } = useToast();

  const themeData = [
    { theme: "Door speed complaints", vertical: "Healthcare", count: 23, sentiment: "negative" },
    { theme: "Header depth — retrofit", vertical: "Office", count: 19, sentiment: "negative" },
    { theme: "Remote diagnostics request", vertical: "Airport", count: 16, sentiment: "request" },
    { theme: "OSDP v2 compatibility", vertical: "Government", count: 14, sentiment: "request" },
    { theme: "Positive: TSA 160 installation", vertical: "Healthcare", count: 11, sentiment: "positive" },
    { theme: "BACnet/Modbus integration", vertical: "Office", count: 9, sentiment: "request" },
  ];

  return (
    <PageWrap>
      <SectionTitle sub="Voice of Customer — distributor interviews, specifier insights, and recurring themes">VOC Hub</SectionTitle>

      <div className="flex gap-1 bg-secondary p-1 rounded-lg mb-6 w-fit">
        {(["insights", "interviews", "themes"] as const).map(v => (
          <button
            key={v}
            data-testid={`voc-view-${v}`}
            onClick={() => setActiveView(v)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeView === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {activeView === "insights" && (
        <div className="space-y-3">
          {vocEntries.map(entry => {
            const typeStyle =
              entry.type === "pain_point" ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300" :
              entry.type === "feature_request" ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300" :
              entry.type === "compliance_concern" ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" :
              entry.type === "competitive_intelligence" ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300" :
              "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300";
            const typeLabel =
              entry.type === "pain_point" ? "Pain Point" :
              entry.type === "feature_request" ? "Feature Request" :
              entry.type === "compliance_concern" ? "Compliance" :
              entry.type === "competitive_intelligence" ? "Competitive Intel" :
              entry.type === "pricing_feedback" ? "Pricing" : entry.type;
            return (
              <div key={entry.id} className="p-4 bg-card border border-border rounded-xl" data-testid={`voc-entry-${entry.id}`}>
                <div className="flex items-start justify-between mb-2 gap-3">
                  <p className="text-sm font-medium text-foreground leading-snug">{entry.quote}</p>
                  <Badge className={`text-[10px] flex-shrink-0 ${typeStyle}`}>{typeLabel}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{entry.source} · {entry.vertical} · {entry.date}</p>
                {entry.insight && <p className="text-xs text-muted-foreground italic mb-2">{entry.insight}</p>}
                <div className="flex flex-wrap gap-1">
                  {(entry.tags || []).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeView === "themes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Top Recurring Themes</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-3">
                {themeData.map(t => (
                  <div key={t.theme} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium truncate">{t.theme}</p>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{t.count} mentions</span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full">
                        <div
                          className={`h-full rounded-full ${t.sentiment === "positive" ? "bg-teal-500" : t.sentiment === "negative" ? "bg-rose-500" : "bg-sky-500"}`}
                          style={{ width: `${(t.count / 25) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] flex-shrink-0">{t.vertical}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Sentiment by Vertical</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={[
                    { name: "Healthcare", value: 38 },
                    { name: "Office", value: 28 },
                    { name: "Airport", value: 17 },
                    { name: "Government", value: 14 },
                    { name: "Retail", value: 9 },
                  ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                    {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeView === "interviews" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border border-border" data-testid={`voc-interview-${i}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {["DI", "AE", "FC", "SP"][i - 1]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{["District Manager — Southeast", "AOR Specifier — NYC", "Field Consultant — TX", "System Integrator — CA"][i - 1]}</p>
                    <p className="text-[10px] text-muted-foreground">{["Jan 2026", "Dec 2025", "Nov 2025", "Oct 2025"][i - 1]}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {[
                    "The TSA 160 is winning specs in medical office buildings where the header space is tight. Distributors want faster lead time — 8 weeks is too long for renovation projects.",
                    "We spec ASSA ABLOY by default for hospital sliding doors. The FGI timing requirement is driving more VersaMax specs. Need a hermetic option badly.",
                    "Lost two airport deals to dormakaba because of the 700 lb panel weight limit. The SL500 capacity gap is real and it is costing us bids.",
                    "ecoLOGIC is interesting but the integration story with Siemens BAS is not clean enough. Facility managers want BACnet native, not an add-on module."
                  ][i - 1]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageWrap>
  );
}

// ─── CAPACITY TAB ──────────────────────────────────────────────────────────

function CapacityTab() {
  const members = getTeamMembers();

  return (
    <PageWrap>
      <SectionTitle sub="Team capacity, sprint allocation, and resource planning across PM, Engineering, and Regulatory">
        Capacity Planning
      </SectionTitle>

      {/* Sprint overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Team Size" value={members.length} sub="active PM team" />
        <KpiCard label="Avg Load" value="74%" sub="team-wide" color="text-amber-500" />
        <KpiCard label="Overloaded" value="2" sub="above 90%" color="text-rose-500" />
        <KpiCard label="Sprint Velocity" value="14" sub="story points/sprint" color="text-teal-500" />
      </div>

      {/* Sprint Cards */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Current Sprint — Active Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sprintData.map(p => (
            <Card key={p.person} className="border border-border" data-testid={`sprint-card-${p.person.replace(/\s/g, "-")}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={p.person} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{p.person}</p>
                    <p className={`text-[10px] font-bold ${p.pct > 90 ? "text-rose-500" : p.pct > 75 ? "text-amber-500" : "text-teal-500"}`}>{p.pct}% loaded</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full mb-3">
                  <div className={`h-2 rounded-full transition-all ${p.pct > 90 ? "bg-rose-500" : p.pct > 75 ? "bg-amber-500" : "bg-teal-500"}`} style={{ width: `${p.pct}%` }} />
                </div>
                <div className="space-y-1">
                  {p.tasks.map(t => (
                    <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resource allocation (from library) */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Resource Allocation by Initiative</h3>
        {resourceData.map(person => {
          const totalAlloc = person.allocations.reduce((sum, a) => sum + a.percent, 0);
          const available = 100 - totalAlloc;
          const capacityClass = available < 0 ? "text-rose-500" : available < 20 ? "text-amber-500" : "text-teal-500";
          return (
            <div key={person.name} className="mb-3 p-4 bg-card border border-border rounded-xl" data-testid={`resource-${person.name.replace(/\s/g, "-")}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar name={person.name} size="sm" />
                  <div>
                    <p className="text-xs font-semibold">{person.name}</p>
                    <p className="text-[10px] text-muted-foreground">{person.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${capacityClass}`}>{available < 0 ? `${Math.abs(available)}% over` : `${available}% free`}</p>
                  <p className="text-[10px] text-muted-foreground">{totalAlloc}% allocated</p>
                </div>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden mb-2 gap-px">
                {person.allocations.map((alloc, i) => (
                  <div key={i} title={`${alloc.label}: ${alloc.percent}%`} style={{ width: `${alloc.percent}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} className="transition-all" />
                ))}
                {available > 0 && <div style={{ width: `${available}%` }} className="bg-secondary" />}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {person.allocations.map((alloc, i) => (
                  <div key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {alloc.label} ({alloc.percent}%)
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PageWrap>
  );
}

// ─── FORECAST TAB ─────────────────────────────────────────────────────────

function ForecastTab() {
  const [selectedVertical, setSelectedVertical] = useState("Healthcare");
  const [activeScenario, setActiveScenario] = useState<"Base Case" | "Bull Case" | "Bear Case">("Base Case");
  const [marketGrowthRate, setMarketGrowthRate] = useState([8]);
  const [winRateImprovement, setWinRateImprovement] = useState([5]);
  const [recordExpansion, setRecordExpansion] = useState([3]);

  const currentForecast = verticalForecasts.find(f => f.vertical === selectedVertical) || verticalForecasts[0];
  const currentScenario = revenueScenarios.find(s => s.label === activeScenario) || revenueScenarios[0];

  // What-if calculation
  const baseRevenue2027 = 56.2;
  const marketImpact = baseRevenue2027 * (marketGrowthRate[0] - 8) / 100 * 0.5;
  const winRateImpact = baseRevenue2027 * winRateImprovement[0] / 100 * 0.8;
  const recordImpact = recordExpansion[0] * 2.1;
  const whatIfRevenue2027 = Math.round((baseRevenue2027 + marketImpact + winRateImpact + recordImpact) * 10) / 10;

  const regColors = {
    tailwind: "border-teal-500 bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-300",
    headwind: "border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300",
    opportunity: "border-violet-500 bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300",
  };
  const regDot = {
    tailwind: "bg-teal-500",
    headwind: "bg-rose-500",
    opportunity: "bg-violet-500",
  };

  return (
    <PageWrap>
      <SectionTitle sub="Market demand forecasts 2025–2028, construction signals, regulatory timeline, and revenue scenarios">
        Forecast Engine
      </SectionTitle>

      {/* A. Market Demand Forecast */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-semibold text-muted-foreground">Vertical:</p>
        <div className="flex flex-wrap gap-1.5">
          {verticalForecasts.map(vf => (
            <button
              key={vf.vertical}
              data-testid={`forecast-vertical-${vf.vertical.replace(/\//g, "-")}`}
              onClick={() => setSelectedVertical(vf.vertical)}
              className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors ${selectedVertical === vf.vertical ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}
            >
              {vf.vertical}
            </button>
          ))}
        </div>
      </div>
      </div>
      <Card className="border border-border mb-6">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold">{selectedVertical} — TAM Forecast ($M) 2025–2028</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={currentForecast.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentForecast.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={currentForecast.color} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="aaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${v}M`} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={(v: number) => [`$${v}M`]} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="value" name="Total TAM" stroke={currentForecast.color} fill="url(#forecastGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="aaTarget" name="AA Target Share" stroke="#6366f1" fill="url(#aaGrad)" strokeWidth={2} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* B. Construction Pipeline Signals */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Construction Pipeline Signals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {constructionSignals.map(signal => (
            <Card key={signal.region} className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold">{signal.region}</p>
                  <span className={`text-xs font-bold ${signal.trend === "up" ? "text-teal-500" : signal.trend === "down" ? "text-rose-500" : "text-muted-foreground"}`}>
                    {signal.trend === "up" ? "↑" : signal.trend === "down" ? "↓" : "→"}
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Demand Heat Index</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${signal.demandHeatIndex >= 85 ? "bg-teal-500" : signal.demandHeatIndex >= 70 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${signal.demandHeatIndex}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${signal.demandHeatIndex >= 85 ? "text-teal-500" : signal.demandHeatIndex >= 70 ? "text-amber-500" : "text-rose-500"}`}>
                      {signal.demandHeatIndex}/100
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mt-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Starts</p>
                    <p className="text-xs font-bold">{signal.starts.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Permits</p>
                    <p className="text-xs font-bold">{signal.permits.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Dodge</p>
                    <p className="text-xs font-bold">{signal.dodgeProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <p className="text-xs font-semibold mb-3">High-Opportunity States</p>
          <div className="flex flex-wrap gap-2">
            {opportunityStates.map(s => (
              <div key={s.state} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-lg">
                <span className="text-xs font-bold text-foreground">{s.state}</span>
                <span className="text-[10px] text-muted-foreground">{s.region}</span>
                <span className="text-xs font-mono text-muted-foreground">{s.projects} proj</span>
                <span className={`text-xs font-bold ${s.trend === "up" ? "text-teal-500" : s.trend === "down" ? "text-rose-500" : "text-muted-foreground"}`}>
                  {s.trend === "up" ? "↑" : s.trend === "down" ? "↓" : "→"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* C. Regulatory Timeline */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Regulatory Tailwinds / Headwinds Timeline (2025–2028)</h3>
        <div className="relative p-4 bg-card border border-border rounded-xl overflow-x-auto">
          <div className="relative h-2 bg-secondary rounded-full mb-8" style={{ minWidth: 600 }}>
            {/* Year markers */}
            {[0, 25, 50, 75, 100].map((pct, i) => (
              <div key={i} style={{ left: `${pct}%` }} className="absolute top-0 h-full flex flex-col items-center">
                <div className="w-px h-4 bg-border mt-0 absolute -top-1" />
                <span className="absolute top-4 text-[9px] text-muted-foreground whitespace-nowrap -translate-x-1/2">
                  {["2025", "Q1'26", "Q2–Q3'26", "2027", "2028"][i]}
                </span>
              </div>
            ))}
            {/* Events */}
            {regulatoryTimeline.map((evt, i) => (
              <div
                key={evt.date}
                style={{ left: `${evt.xPct}%` }}
                className="absolute -top-2.5 flex flex-col items-center"
                data-testid={`reg-event-${i}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 border-background ${regDot[evt.type]} flex items-center justify-center`}>
                  <span className="text-[8px] text-white font-bold">{i + 1}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {regulatoryTimeline.map((evt, i) => (
              <div key={evt.date} className={`p-3 rounded-lg border-l-4 text-xs ${regColors[evt.type]}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${regDot[evt.type]}`}>{i + 1}</span>
                  <span className="font-bold">{evt.date}</span>
                  <Badge className={`text-[9px] ml-auto px-1.5 ${evt.type === "tailwind" ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300" : evt.type === "headwind" ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300" : "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"}`}>
                    {evt.type}
                  </Badge>
                </div>
                <p className="font-semibold text-foreground mb-0.5">{evt.title}</p>
                <p className="text-[10px] opacity-80 leading-relaxed">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* D. Revenue Projection Scenarios */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Revenue Projection Scenarios</h3>
        <div className="flex gap-2 mb-4">
          {revenueScenarios.map(sc => (
            <button
              key={sc.label}
              data-testid={`scenario-${sc.label.replace(/ /g, "-")}`}
              onClick={() => setActiveScenario(sc.label as "Base Case" | "Bull Case" | "Bear Case")}
              className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${activeScenario === sc.label ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary"}`}
            >
              {sc.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left py-2.5 px-4 font-semibold text-muted-foreground uppercase tracking-wide">Fiscal Year</th>
                {revenueScenarios.map(sc => (
                  <th key={sc.label} className={`text-right py-2.5 px-4 font-semibold uppercase tracking-wide ${activeScenario === sc.label ? "text-primary bg-primary/5" : "text-muted-foreground"}`}>
                    {sc.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["FY2025", "FY2026", "FY2027", "FY2028"].map((fy, rowIdx) => (
                <tr key={fy} className={`border-b border-border/50 ${rowIdx % 2 === 0 ? "" : "bg-secondary/20"}`}>
                  <td className="py-2.5 px-4 font-semibold text-foreground">{fy}</td>
                  {revenueScenarios.map(sc => (
                    <td key={sc.label} className={`py-2.5 px-4 text-right font-mono ${activeScenario === sc.label ? "font-bold bg-primary/5 text-foreground" : "text-muted-foreground"}`}>
                      ${sc.data[rowIdx]?.revenue.toFixed(1)}M
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          {revenueScenarios.find(s => s.label === activeScenario)?.description}
        </p>
      </div>

      {/* E. What-If Scenario Sliders */}
      <Card className="border border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold">What-If Scenario Engine — FY2027 Revenue Impact</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-xs font-medium">Market Growth Rate</Label>
                <span className="text-xs font-bold text-primary">{marketGrowthRate[0]}%</span>
              </div>
              <Slider
                data-testid="slider-market-growth"
                min={3} max={15} step={1}
                value={marketGrowthRate}
                onValueChange={setMarketGrowthRate}
                className="mb-1"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>3%</span><span>15%</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-xs font-medium">AA Win Rate Improvement</Label>
                <span className="text-xs font-bold text-primary">+{winRateImprovement[0]}%</span>
              </div>
              <Slider
                data-testid="slider-win-rate"
                min={0} max={10} step={1}
                value={winRateImprovement}
                onValueChange={setWinRateImprovement}
                className="mb-1"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0%</span><span>+10%</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-xs font-medium">RECORD NA Expansion Speed</Label>
                <span className="text-xs font-bold text-primary">{recordExpansion[0]} prod/yr</span>
              </div>
              <Slider
                data-testid="slider-record-expansion"
                min={1} max={5} step={1}
                value={recordExpansion}
                onValueChange={setRecordExpansion}
                className="mb-1"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1</span><span>5</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
            <div>
              <p className="text-xs text-muted-foreground">Projected FY2027 Revenue</p>
              <p className="text-2xl font-bold text-primary">${whatIfRevenue2027}M</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">vs. Base Case</p>
              <p className={`text-lg font-bold ${whatIfRevenue2027 >= 56.2 ? "text-teal-500" : "text-rose-500"}`}>
                {whatIfRevenue2027 >= 56.2 ? "+" : ""}{(whatIfRevenue2027 - 56.2).toFixed(1)}M
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageWrap>
  );
}

// ─── WIN/LOSS INTELLIGENCE TAB ────────────────────────────────────────────

function WinLossTab() {
  const [filterOutcome, setFilterOutcome] = useState<"all" | "win" | "loss" | "no_decision">("all");
  const [filterVertical, setFilterVertical] = useState("all");
  const [filterCompetitor, setFilterCompetitor] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const allCompetitors = useMemo(() => {
    const s = new Set(WIN_LOSS_DATA.map(e => e.competitor));
    return Array.from(s).sort();
  }, []);

  const allVerticals = useMemo(() => {
    const s = new Set(WIN_LOSS_DATA.map(e => e.vertical));
    return Array.from(s).sort();
  }, []);

  const allRegions = useMemo(() => {
    const s = new Set(WIN_LOSS_DATA.map(e => e.region));
    return Array.from(s).sort();
  }, []);

  const filtered = useMemo(() => {
    return WIN_LOSS_DATA.filter(e => {
      if (filterOutcome !== "all" && e.outcome !== filterOutcome) return false;
      if (filterVertical !== "all" && e.vertical !== filterVertical) return false;
      if (filterCompetitor !== "all" && e.competitor !== filterCompetitor) return false;
      if (filterRegion !== "all" && e.region !== filterRegion) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [filterOutcome, filterVertical, filterCompetitor, filterRegion]);

  const totalDeals = WIN_LOSS_DATA.length;
  const wins = WIN_LOSS_DATA.filter(e => e.outcome === "win").length;
  const losses = WIN_LOSS_DATA.filter(e => e.outcome === "loss").length;
  const winRate = Math.round((wins / totalDeals) * 100);

  const lossReasonCounts = useMemo(() => {
    const m: Record<string, number> = {};
    WIN_LOSS_DATA.filter(e => e.outcome === "loss").forEach(e => {
      m[e.primaryReason] = (m[e.primaryReason] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, []);

  const winReasonCounts = useMemo(() => {
    const m: Record<string, number> = {};
    WIN_LOSS_DATA.filter(e => e.outcome === "win").forEach(e => {
      m[e.primaryReason] = (m[e.primaryReason] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, []);

  const topLossReason = lossReasonCounts[0]?.[0] || "—";
  const topWinReason = winReasonCounts[0]?.[0] || "—";

  const winByVertical = useMemo(() => {
    const m: Record<string, { wins: number; total: number }> = {};
    WIN_LOSS_DATA.filter(e => e.outcome !== "no_decision").forEach(e => {
      if (!m[e.vertical]) m[e.vertical] = { wins: 0, total: 0 };
      m[e.vertical].total++;
      if (e.outcome === "win") m[e.vertical].wins++;
    });
    return Object.entries(m)
      .map(([v, d]) => ({ vertical: v, winRate: Math.round((d.wins / d.total) * 100), total: d.total }))
      .sort((a, b) => b.winRate - a.winRate);
  }, []);

  const competitorStats = useMemo(() => {
    const m: Record<string, { wins: number; losses: number }> = {};
    WIN_LOSS_DATA.filter(e => e.outcome !== "no_decision").forEach(e => {
      if (!m[e.competitor]) m[e.competitor] = { wins: 0, losses: 0 };
      if (e.outcome === "win") m[e.competitor].wins++;
      else m[e.competitor].losses++;
    });
    return Object.entries(m)
      .map(([c, d]) => ({
        competitor: c,
        wins: d.wins,
        losses: d.losses,
        total: d.wins + d.losses,
        winRate: Math.round((d.wins / (d.wins + d.losses)) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const outcomeColors: Record<string, string> = {
    win: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    loss: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    no_decision: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };
  const outcomeLabel: Record<string, string> = {
    win: "WIN",
    loss: "LOSS",
    no_decision: "NO DECISION",
  };
  const competitorLabel: Record<string, string> = {
    dormakaba: "dormakaba",
    allegion_stanley: "Allegion/Stanley",
    geze: "GEZE",
    boon_edam: "Boon Edam",
    horton: "Horton",
    nabco: "NABCO",
    dorma: "DORMA",
    tormax: "TORMAX",
  };

  const toggleNotes = (id: string) => {
    setExpandedNotes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const lossChartData = lossReasonCounts.slice(0, 6).map(([name, value]) => ({ name, value }));
  const winChartData = winReasonCounts.slice(0, 6).map(([name, value]) => ({ name, value }));

  return (
    <PageWrap>
      <SectionTitle sub="Structured competitive intelligence from field outcomes">
        Win/Loss Intelligence Engine
      </SectionTitle>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Total Deals Tracked" value={totalDeals} sub="2025 YTD" />
        <KpiCard label="Win Rate" value={`${winRate}%`} sub={`${wins} wins of ${wins + losses} decided`} color={winRate >= 60 ? "text-teal-500" : winRate >= 45 ? "text-amber-500" : "text-rose-500"} />
        <KpiCard label="Top Loss Reason" value={topLossReason} sub="Most frequent primary loss driver" color="text-rose-500" />
        <KpiCard label="Top Win Reason" value={topWinReason} sub="Most frequent primary win driver" color="text-teal-500" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <Select value={filterOutcome} onValueChange={v => setFilterOutcome(v as typeof filterOutcome)}>
          <SelectTrigger className="w-36 h-8 text-xs" data-testid="wl-filter-outcome"><SelectValue placeholder="Outcome" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Outcomes</SelectItem>
            <SelectItem value="win">Win</SelectItem>
            <SelectItem value="loss">Loss</SelectItem>
            <SelectItem value="no_decision">No Decision</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterVertical} onValueChange={setFilterVertical}>
          <SelectTrigger className="w-40 h-8 text-xs" data-testid="wl-filter-vertical"><SelectValue placeholder="Vertical" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verticals</SelectItem>
            {allVerticals.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCompetitor} onValueChange={setFilterCompetitor}>
          <SelectTrigger className="w-44 h-8 text-xs" data-testid="wl-filter-competitor"><SelectValue placeholder="Competitor" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Competitors</SelectItem>
            {allCompetitors.map(c => <SelectItem key={c} value={c}>{competitorLabel[c] || c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterRegion} onValueChange={setFilterRegion}>
          <SelectTrigger className="w-36 h-8 text-xs" data-testid="wl-filter-region"><SelectValue placeholder="Region" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {allRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground flex items-center">{filtered.length} deal{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Deal Cards */}
        <div className="xl:col-span-2">
          <ScrollArea className="h-[680px] pr-2">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="bg-card border border-border rounded-xl p-4"
                    data-testid={`wl-card-${entry.id}`}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${outcomeColors[entry.outcome]}`}>
                          {outcomeLabel[entry.outcome]}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{entry.date}</span>
                        <Badge variant="secondary" className="text-[10px]">{entry.dealSize}</Badge>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">{competitorLabel[entry.competitor] || entry.competitor}</Badge>
                    </div>

                    {/* Location & type */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{entry.projectType}</span>
                      <span>·</span>
                      <span>{entry.vertical}</span>
                      <span>·</span>
                      <span className="font-mono font-bold">{entry.state}</span>
                      <span>·</span>
                      <span>{entry.region}</span>
                    </div>

                    {/* Primary reason */}
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Primary Reason</p>
                      <p className="text-sm font-semibold text-foreground">{entry.primaryReason}</p>
                    </div>

                    {/* Secondary reasons */}
                    {entry.secondaryReasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {entry.secondaryReasons.map((r, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">{r}</Badge>
                        ))}
                      </div>
                    )}

                    {/* Notes collapsible */}
                    <button
                      data-testid={`wl-toggle-notes-${entry.id}`}
                      onClick={() => toggleNotes(entry.id)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
                    >
                      <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 transition-transform ${expandedNotes.has(entry.id) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                      {expandedNotes.has(entry.id) ? "Hide notes" : "Show notes"}
                    </button>
                    <AnimatePresence>
                      {expandedNotes.has(entry.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3 p-2.5 bg-secondary/40 rounded-lg">
                            {entry.notes}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Actionable insight */}
                    <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-[10px] text-primary uppercase tracking-wider font-semibold mb-0.5">Actionable Insight</p>
                      <p className="text-xs text-foreground leading-snug">{entry.actionable}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-sm">No deals match the current filters.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Pattern Analysis Sidebar */}
        <div className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Win Rate by Vertical</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={winByVertical} layout="vertical" margin={{ top: 0, right: 30, left: 90, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                  <YAxis dataKey="vertical" type="category" tick={{ fontSize: 9 }} width={90} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={(v: number) => [`${v}%`, "Win Rate"]} />
                  <Bar dataKey="winRate" radius={[0, 4, 4, 0]}>
                    {winByVertical.map((entry, i) => (
                      <Cell key={i} fill={entry.winRate >= 60 ? "#14b8a6" : entry.winRate >= 40 ? "#f59e0b" : "#f43f5e"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Top Loss Reasons</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={lossChartData} layout="vertical" margin={{ top: 0, right: 20, left: 110, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 8 }} width={110} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
                  <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Losses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Top Win Reasons</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={winChartData} layout="vertical" margin={{ top: 0, right: 20, left: 110, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 8 }} width={110} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
                  <Bar dataKey="value" fill="#14b8a6" radius={[0, 4, 4, 0]} name="Wins" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Competitor W/L Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary/40">
                      {["Competitor", "Wins", "Losses", "Win %"].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {competitorStats.map((row, i) => (
                      <tr key={row.competitor} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-secondary/20"}`} data-testid={`wl-comp-row-${row.competitor}`}>
                        <td className="py-2 px-3 font-medium">{competitorLabel[row.competitor] || row.competitor}</td>
                        <td className="py-2 px-3 text-teal-600 dark:text-teal-400 font-bold">{row.wins}</td>
                        <td className="py-2 px-3 text-rose-500 font-bold">{row.losses}</td>
                        <td className="py-2 px-3">
                          <span className={`font-bold font-mono ${row.winRate >= 60 ? "text-teal-600 dark:text-teal-400" : row.winRate >= 40 ? "text-amber-600 dark:text-amber-400" : "text-rose-500"}`}>
                            {row.winRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── ENHANCED INTELLIGENCE TAB ────────────────────────────────────────────

function IntelligenceTab() {
  const [activeSection, setActiveSection] = useState<"market" | "standards" | "competitive" | "interview" | "statemap" | "marketintel">("market");
  const [stateSearch, setStateSearch] = useState("");
  const [stateRegion, setStateRegion] = useState("all");
  const [stateOpp, setStateOpp] = useState("all");
  const [stateHvhz, setStateHvhz] = useState("all");
  const [stateSortCol, setStateSortCol] = useState<"volume" | "opp" | "state">("volume");

  const sections = [
    { id: "market" as const, label: "Market Signals" },
    { id: "marketintel" as const, label: "Market Intelligence" },
    { id: "standards" as const, label: "Standards Watch" },
    { id: "competitive" as const, label: "Competitive Gaps" },
    { id: "interview" as const, label: "PM Interview Prep" },
    { id: "statemap" as const, label: "State Map" },
  ];

  const standardsWatch = [
    { standard: "ANSI/BHMA A156.10-2024", change: "Updated cycle test to 2M; revised safety sensor validation protocol.", impactItems: ["SL500", "VersaMax", "RECORD TSA 200"], timeline: "Q4 2025 cert deadline", severity: "high" },
    { standard: "FBC 9th Edition", change: "Adds water infiltration (TAS 203) and fenestration provisions. Eff. Dec 31, 2026.", impactItems: ["SL500", "RD100", "VersaMax exterior", "RECORD TSA 160"], timeline: "Dec 31, 2026", severity: "critical" },
    { standard: "FGI 2022", change: "New door timing and closing force limits for hospital vestibule applications.", impactItems: ["VersaMax", "RECORD TSA 320"], timeline: "Active — hospital projects specifying now", severity: "critical" },
    { standard: "UL 325:2023", change: "Revised entrapment detection sensitivity. Affects sensor logic firmware.", impactItems: ["RECORD TSA 160", "RECORD TSA 200", "SL500"], timeline: "Required for new UL listings", severity: "high" },
    { standard: "NBC 2025 (Canada)", change: "Updated accessibility + power-operated door provisions. Effective Jan 2026.", impactItems: ["All NA products sold in Canada"], timeline: "Jan 1, 2026", severity: "medium" },
    { standard: "AAADM Annual Inspection", change: "Annual inspection requirement for all power-operated pedestrian doors. Liability exposure if not followed.", impactItems: ["All operators in field"], timeline: "Ongoing — 12-month interval", severity: "medium" },
  ];

  const competitiveGaps = [
    { gap: "700 lb capacity operator", ours: "SL500 max 550 lb", theirs: "Industry moving to 700 lb for large glass panels (airports, convention centers)", linkedInitiative: "rm-006", priority: "critical" },
    { gap: "45mm retrofit header (swing)", ours: "SW300 header too deep for most retrofit jobs", theirs: "Slim-profile headers from competitors winning retrofit bids", linkedInitiative: "rm-007", priority: "critical" },
    { gap: "Hermetic sliding (healthcare)", ours: "No ASSA ABLOY product in hermetic sliding", theirs: "Tormax gaining in Canadian/US hospital OR and ICU spec", linkedInitiative: "rm-010", priority: "high" },
    { gap: "LEED v5 BMS integration", ours: "ecoLOGIC add-on module; no native BACnet/Modbus", theirs: "Smart building mandates require BMS-native door operators", linkedInitiative: "rm-011", priority: "high" },
    { gap: "RECORD INORA (luxury)", ours: "Not NA-certified", theirs: "AORs specifying INORA by name in hotel/luxury commercial from EU exposure", linkedInitiative: "rm-r04", priority: "high" },
    { gap: "Package vestibule automation", ours: "No integrated delivery solution", theirs: "No dominant competitor either — first-mover opportunity", linkedInitiative: "rm-016", priority: "medium" },
  ];

  const interviewInsights = [
    { question: "How do you prioritize a roadmap when everything is critical?", answer: "I use a two-axis framework — impact vs. strategic fit — and stack-rank. At ASSA ABLOY, regulatory compliance (FBC, FGI, NOA renewals) always gets a risk-adjusted premium because non-compliance risks active project specs. I layer competitive signals (like the 700 lb capacity gap) on top based on deal-loss evidence from field sales, not just gut. Everything else goes through a VOC-weighted opportunity score." },
    { question: "Tell me about a product launch decision you made with incomplete data.", answer: "The ecoLOGIC OTA rollout had to proceed before we had full carrier-grade reliability data across all install vintages. I built a phased rollout plan — starting with the newest install cohort where firmware delta risk was lowest — and built in automatic rollback triggers. The key was making the risk visible to engineering and QA, not minimizing it. We got to 14,000 units with zero bricked units." },
    { question: "How do you manage cross-functional alignment at gate reviews?", answer: "Cooper Stage-Gate works because the gate decision is owned by a defined set — VP PM, VP Engineering, Finance. My job is to make the gate meeting boring: all blockers resolved before the room. I circulate a gate readiness scorecard 5 days prior, close open items bilaterally, and come in with a clear recommendation. No surprises. Engineering trusts the process because I do the prep." },
    { question: "How do you handle a VOC insight that contradicts your roadmap?", answer: "I treat it as a potential signal, not a command. When 12 distributor interviews said our SW300 header was too deep for retrofit jobs, that was convergent — same pain, same cause, revenue impact visible in the data (lost bids to dormakaba). That moved the slim-header initiative from G0 to G1 in one sprint. A single interview that contradicts the roadmap gets documented and watched. Three or more identical signals trigger a scoping sprint." },
    { question: "What does good PM-Engineering communication look like?", answer: "I prototype the requirements document to be as anti-ambiguous as possible: acceptance criteria, not feature descriptions. For hardware, that means force values, cycle counts, and sensor response times — not open smoothly. I do weekly standups during G3 development with a shared risk register. Every blocker gets a named owner and a date. I manage information flow, not people." },
    { question: "How do you think about RECORD integration into ASSA ABLOY NA portfolio?", answer: "RECORD gives ASSA ABLOY genuine product breadth gaps filled — heavy-duty (TSA 320), compact (TSA 160), and design-forward (INORA). The NA adaptation work is real: UL cert, wiring, and channel onboarding. My job is to sequence these by market pull (TSA 160 for retrofit, INORA for luxury AOR demand) and make sure the co-engineering protocol does not create a second-class product." },
    { question: "How would you structure a GTM for the hermetic sliding door concept?", answer: "Start with a beachhead vertical — ICU/OR construction in Magnet-designated hospitals — where infection control requirements are highest and decision-makers are accessible for VOC. Prove the product, build 3 flagship references, then expand to pharmacy and isolation rooms. Price at a 35% premium to standard hermetic doors; position ASSA ABLOY brand and AAADM inspection program as risk mitigation." },
    { question: "What is your framework for a make vs. buy decision?", answer: "Three factors: strategic differentiation (should we own this IP?), time-to-market, and total cost of ownership vs. capability build time. For the ecoLOGIC AI firmware, owning the algorithm is a moat — we build. For the BMS API connectors (Siemens, JCI), we do not need proprietary — we partner." },
    { question: "Walk me through how you would handle a missed NOA renewal.", answer: "Immediate: notify the 43 affected Florida projects with an honest timeline and an interim spec solution (use compliant alternate product + LOI for recertification date). Parallel: escalate lab scheduling to emergency priority. Communicate proactively — do not wait for the GC to call us. Post-mortem: build an NOA renewal tracker with 6-month advance alerts." },
    { question: "How do you earn trust with a technical team as a PM?", answer: "By being precise about what I know and honest about what I do not. Engineers lose faith in PMs who oversimplify or overpromise. I learned force values, sensor response specs, and BHMA test protocols because those are the building blocks of conversations with engineering. When I wrote the acceptance criteria for the OSDP v2 integration, the firmware lead said it was the best he had seen from a PM." },
  ];

  const verticalPipelineData: Record<string, { specs: number; aaSpecPct: number }> = {
    "Healthcare": { specs: 847, aaSpecPct: 41 },
    "Airport/Transit": { specs: 124, aaSpecPct: 38 },
    "Retail": { specs: 1203, aaSpecPct: 29 },
    "Office/Commercial": { specs: 2891, aaSpecPct: 31 },
    "Education": { specs: 567, aaSpecPct: 45 },
    "Hospitality": { specs: 334, aaSpecPct: 22 },
    "Government": { specs: 412, aaSpecPct: 48 },
  };

  const oppRowBg: Record<string, string> = {
    critical: "bg-rose-50/50 dark:bg-rose-950/10",
    high: "bg-indigo-50/50 dark:bg-indigo-950/10",
    medium: "bg-sky-50/50 dark:bg-sky-950/10",
    low: "",
  };
  const oppBadge: Record<string, string> = {
    critical: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    high: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    medium: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };
  const oppOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const severityBadge: Record<string, string> = {
    critical: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    high: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    medium: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  const categoryColor: Record<string, string> = {
    regulatory: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    competitive: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    market: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    internal: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };

  const filteredStates = useMemo(() => {
    let data = STATIC_STATE_DATA.filter((s) => {
      if (stateSearch && !s.state.toLowerCase().includes(stateSearch.toLowerCase())) return false;
      if (stateRegion !== "all" && s.region !== stateRegion) return false;
      if (stateOpp !== "all" && s.marketOpportunity !== stateOpp) return false;
      if (stateHvhz === "yes" && !s.hvhz) return false;
      if (stateHvhz === "no" && s.hvhz) return false;
      return true;
    });
    if (stateSortCol === "volume") data = [...data].sort((a, b) => b.annualConstructionVolume - a.annualConstructionVolume);
    else if (stateSortCol === "opp") data = [...data].sort((a, b) => (oppOrder[a.marketOpportunity] ?? 9) - (oppOrder[b.marketOpportunity] ?? 9));
    else data = [...data].sort((a, b) => a.state.localeCompare(b.state));
    return data;
  }, [stateSearch, stateRegion, stateOpp, stateHvhz, stateSortCol]);

  const stageProbColor = (p: number) => p >= 70 ? "text-teal-600 dark:text-teal-400" : p >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-500";

  return (
    <PageWrap>
      <SectionTitle sub="Market signals, deal velocity, standards watch, competitive gaps, PM interview preparation, and state-by-state market map">PM Intelligence</SectionTitle>

      {/* Section Nav */}
      <div className="flex flex-wrap gap-1 bg-secondary p-1 rounded-lg mb-6 w-fit">
        {sections.map((s) => (
          <button
            key={s.id}
            data-testid={`intel-section-${s.id}`}
            onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Market Signals — Enhanced */}
      {activeSection === "market" && (
        <div className="space-y-6">
          {/* Vertical Deep-Dive Cards */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Vertical Deep-Dive</h3>
            <div className="space-y-4">
              {marketVerticals.sort((a, b) => b.growthRate - a.growthRate).map((v) => {
                const pipeData = verticalPipelineData[v.vertical] || { specs: 0, aaSpecPct: 0 };
                return (
                  <div key={v.vertical} className="p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{v.vertical}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">${v.tamMillions}M TAM · AA {v.aaSharePercent}% · RECORD {v.recordSharePercent}%</p>
                      </div>
                      <span className={`text-sm font-bold px-2 py-1 rounded ${v.growthRate > 10 ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300" : v.growthRate > 5 ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-secondary text-muted-foreground"}`}>
                        +{v.growthRate}% YoY
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                      <div className="p-2.5 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                        <p className="text-teal-700 dark:text-teal-300 font-semibold mb-0.5">Top Driver</p>
                        <p className="text-muted-foreground">{v.topDriver}</p>
                      </div>
                      <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                        <p className="text-rose-600 dark:text-rose-400 font-semibold mb-0.5">Top Risk</p>
                        <p className="text-muted-foreground">{v.topRisk}</p>
                      </div>
                      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                        <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-0.5">Pipeline Projects</p>
                        <p className="text-foreground font-bold">{pipeData.specs.toLocaleString()} active specs</p>
                      </div>
                      <div className="p-2.5 bg-violet-50 dark:bg-violet-950/20 rounded-lg">
                        <p className="text-violet-600 dark:text-violet-400 font-semibold mb-0.5">AA Spec Penetration</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pipeData.aaSpecPct}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className="h-full bg-violet-500 rounded-full"
                            />
                          </div>
                          <span className="text-foreground font-bold text-[11px]">{pipeData.aaSpecPct}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Key Accounts</p>
                      <div className="flex flex-wrap gap-1">
                        {v.keyAccounts.map((a) => <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deal Velocity Tracker */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Deal Velocity Tracker — Top Active Deals</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    {["Project", "State", "Size", "Vertical", "Product", "Stage", "Close Prob."].map(h => (
                      <th key={h} className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeDeals.map((deal, i) => (
                    <tr key={deal.id} data-testid={`deal-row-${deal.id}`} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                      <td className="py-2.5 px-3 font-medium max-w-[220px]"><p className="truncate">{deal.projectName}</p></td>
                      <td className="py-2.5 px-3"><span className="font-mono font-bold text-muted-foreground">{deal.state}</span></td>
                      <td className="py-2.5 px-3 font-bold text-foreground">${deal.sizeMillion}M</td>
                      <td className="py-2.5 px-3"><Badge variant="secondary" className="text-[10px]">{deal.vertical.split("/")[0]}</Badge></td>
                      <td className="py-2.5 px-3 text-muted-foreground max-w-[140px]"><p className="truncate">{deal.product}</p></td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${deal.stage === "Spec'd" ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300" : deal.stage === "Bidding" ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                          {deal.stage}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${deal.closeProbability >= 70 ? "bg-teal-500" : deal.closeProbability >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${deal.closeProbability}%` }} />
                          </div>
                          <span className={`font-bold font-mono ${stageProbColor(deal.closeProbability)}`}>{deal.closeProbability}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signal Feed */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Live Market Signal Feed</h3>
            <ScrollArea className="h-[480px] border border-border rounded-xl bg-card">
              <div className="p-3 space-y-2 pr-4">
                {signalFeed.map((sig) => (
                  <div key={sig.id} data-testid={`signal-${sig.id}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <span className="text-lg flex-shrink-0 mt-0.5">{sig.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-snug">{sig.headline}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-muted-foreground">{sig.timeAgo}</span>
                        <Badge className={`text-[9px] px-1.5 ${severityBadge[sig.severity]}`}>{sig.severity}</Badge>
                        <Badge className={`text-[9px] px-1.5 ${categoryColor[sig.category]}`}>{sig.category}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}


      {/* Market Intelligence Section */}
      {activeSection === "marketintel" && (
        <div className="space-y-6">
          {/* TAM Growth Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">NA Automatic Door Market TAM — 2025→2035</CardTitle>
                <p className="text-xs text-muted-foreground">Source: {MARKET_INTELLIGENCE.naAutoDoorsMarket.source}</p>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[
                    { year: "2025", tam: MARKET_INTELLIGENCE.naAutoDoorsMarket.tam2025, fill: "#14b8a6" },
                    { year: "2030 (est.)", tam: Math.round(MARKET_INTELLIGENCE.naAutoDoorsMarket.tam2025 * Math.pow(1 + MARKET_INTELLIGENCE.naAutoDoorsMarket.cagr / 100, 5)), fill: "#3b82f6" },
                    { year: "2035", tam: MARKET_INTELLIGENCE.naAutoDoorsMarket.tam2035, fill: "#8b5cf6" },
                  ]} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${v}M`} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={(v: number) => [`$${v}M`, "TAM"]} />
                    <Bar dataKey="tam" radius={[4, 4, 0, 0]}>
                      {[{ fill: "#14b8a6" }, { fill: "#3b82f6" }, { fill: "#8b5cf6" }].map((c, i) => (
                        <Cell key={i} fill={c.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-teal-50 dark:bg-teal-950/20 rounded-lg text-center">
                    <p className="text-teal-700 dark:text-teal-300 font-bold">${MARKET_INTELLIGENCE.naAutoDoorsMarket.tam2025}M</p>
                    <p className="text-muted-foreground">2025 TAM</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                    <p className="text-blue-700 dark:text-blue-300 font-bold">{MARKET_INTELLIGENCE.naAutoDoorsMarket.cagr}%</p>
                    <p className="text-muted-foreground">CAGR</p>
                  </div>
                  <div className="p-2 bg-violet-50 dark:bg-violet-950/20 rounded-lg text-center">
                    <p className="text-violet-700 dark:text-violet-300 font-bold">${MARKET_INTELLIGENCE.naAutoDoorsMarket.tam2035}M</p>
                    <p className="text-muted-foreground">2035 TAM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitive Share */}
            <Card className="border border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Competitive Market Share Structure</CardTitle>
                <p className="text-xs text-muted-foreground">{MARKET_INTELLIGENCE.competitiveShare.note}</p>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Top 5 Players", value: MARKET_INTELLIGENCE.competitiveShare.top5Combined },
                        { name: "Fragmented Market", value: MARKET_INTELLIGENCE.competitiveShare.fragmented },
                      ]}
                      cx="50%" cy="50%" outerRadius={70} innerRadius={35}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      <Cell fill="#14b8a6" />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={(v: number) => [`${v}%`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2 text-xs">
                  <div className="flex justify-between items-center p-2 bg-teal-50 dark:bg-teal-950/20 rounded">
                    <span className="font-medium">Top 5 Combined</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{MARKET_INTELLIGENCE.competitiveShare.top5Combined}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/40 rounded">
                    <span className="font-medium">AA + dormakaba (combined)</span>
                    <span className="font-bold">{MARKET_INTELLIGENCE.competitiveShare.aaBlumetaShare}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/40 rounded">
                    <span className="font-medium">Fragmented regional players</span>
                    <span className="font-bold text-muted-foreground">{MARKET_INTELLIGENCE.competitiveShare.fragmented}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vertical Growth Rates */}
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Vertical Growth Rates (YoY %)</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={[
                    { name: "Government", yoy: MARKET_INTELLIGENCE.verticalGrowth.government.yoy, driver: MARKET_INTELLIGENCE.verticalGrowth.government.driver },
                    { name: "Healthcare", yoy: MARKET_INTELLIGENCE.verticalGrowth.healthcare.yoy, driver: MARKET_INTELLIGENCE.verticalGrowth.healthcare.driver },
                    { name: "Airport/Transit", yoy: MARKET_INTELLIGENCE.verticalGrowth.airportTransit.yoy, driver: MARKET_INTELLIGENCE.verticalGrowth.airportTransit.driver },
                    { name: "Office/Commercial", yoy: MARKET_INTELLIGENCE.verticalGrowth.officeCommercial.yoy, driver: MARKET_INTELLIGENCE.verticalGrowth.officeCommercial.driver },
                    { name: "Retail", yoy: MARKET_INTELLIGENCE.verticalGrowth.retail.yoy, driver: MARKET_INTELLIGENCE.verticalGrowth.retail.driver },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `+${v}%`} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }}
                    formatter={(v: number, _name: string, props: any) => [`+${v}% YoY`, props.payload?.driver || ""]}
                  />
                  <Bar dataKey="yoy" radius={[4, 4, 0, 0]}>
                    {[15, 12, 11, 5, 4].map((v, i) => (
                      <Cell key={i} fill={v >= 12 ? "#14b8a6" : v >= 8 ? "#3b82f6" : "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { label: "Government", yoy: 15, driver: MARKET_INTELLIGENCE.verticalGrowth.government.driver },
                  { label: "Healthcare", yoy: 12, driver: MARKET_INTELLIGENCE.verticalGrowth.healthcare.driver },
                  { label: "Airport/Transit", yoy: 11, driver: MARKET_INTELLIGENCE.verticalGrowth.airportTransit.driver },
                ].map(v => (
                  <div key={v.label} className="flex items-start gap-2 p-2 bg-secondary/30 rounded">
                    <span className="font-bold text-teal-600 dark:text-teal-400 shrink-0">+{v.yoy}%</span>
                    <div><span className="font-semibold">{v.label}:</span> <span className="text-muted-foreground">{v.driver}</span></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sensor Market + Touchless Trend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Sensor Market — ${MARKET_INTELLIGENCE.sensorMarket.size2024}M, {MARKET_INTELLIGENCE.sensorMarket.cagr}% CAGR</CardTitle>
                <p className="text-xs text-muted-foreground">Source: {MARKET_INTELLIGENCE.sensorMarket.source}</p>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                    <p className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Infrared Dominant — {MARKET_INTELLIGENCE.sensorMarket.irShare}% Share</p>
                    <p className="text-muted-foreground">Motion-detection standard across sliding, swing, and revolving applications.</p>
                  </div>
                  <div className="p-3 bg-violet-50 dark:bg-violet-950/20 rounded-lg">
                    <p className="font-semibold text-violet-700 dark:text-violet-300 mb-1">LiDAR — Premium Emerging</p>
                    <p className="text-muted-foreground">{MARKET_INTELLIGENCE.sensorMarket.lidarGrowth}</p>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                    <p className="font-semibold text-teal-700 dark:text-teal-300 mb-1">AI Vision Trend</p>
                    <p className="text-muted-foreground">{MARKET_INTELLIGENCE.sensorMarket.aiVisionTrend}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground uppercase tracking-wider text-[10px] font-semibold mb-1.5">Key OEM Partners</p>
                    <div className="flex gap-1 flex-wrap">
                      {MARKET_INTELLIGENCE.sensorMarket.keyOEMs.map(oem => (
                        <Badge key={oem} variant="secondary" className="text-[10px]">{oem}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Touchless & IoT Adoption Trends</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">+{MARKET_INTELLIGENCE.touchlessTrend.biometricAdoptionIncrease}%</span>
                      <span className="text-muted-foreground text-xs">biometric door adoption</span>
                    </div>
                    <p className="text-muted-foreground">{MARKET_INTELLIGENCE.touchlessTrend.touchlessDemandDriver}</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Competitor Benchmark</p>
                    <p className="text-muted-foreground">{MARKET_INTELLIGENCE.touchlessTrend.iotPredictiveMaintenance}</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">US Market Concentration</p>
                    <p className="text-muted-foreground">{MARKET_INTELLIGENCE.naAutoDoorsMarket.usPct}% of NA automatic door market is US ({MARKET_INTELLIGENCE.naAutoDoorsMarket.slidingDoorShare}% sliding doors)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Standards Watch */}
      {activeSection === "standards" && (
        <div className="space-y-3">
          {standardsWatch.map((s, i) => (
            <div key={i} className={`p-4 bg-card border border-border rounded-xl border-l-4 ${s.severity === "critical" ? "border-l-rose-500" : s.severity === "high" ? "border-l-amber-500" : "border-l-sky-400"}`}>
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-foreground text-sm">{s.standard}</p>
                <Badge className={`text-[10px] flex-shrink-0 ml-2 ${s.severity === "critical" ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300" : s.severity === "high" ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" : "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"}`}>{s.severity}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{s.change}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {s.impactItems.map((item) => <Badge key={item} variant="outline" className="text-[10px]">{item}</Badge>)}
              </div>
              <p className="text-[10px] text-muted-foreground">Timeline: {s.timeline}</p>
            </div>
          ))}
        </div>
      )}

      {/* Competitive Gaps */}
      {activeSection === "competitive" && (
        <div className="space-y-3">
          {competitiveGaps.map((g, i) => (
            <div key={i} data-testid={`comp-gap-${i}`} className={`p-4 bg-card border border-border rounded-xl ${oppRowBg[g.priority]}`}>
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm text-foreground">{g.gap}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${oppBadge[g.priority]}`}>{g.priority}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                  <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 mb-0.5">Our Gap</p>
                  <p className="text-xs text-muted-foreground">{g.ours}</p>
                </div>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mb-0.5">Market Context</p>
                  <p className="text-xs text-muted-foreground">{g.theirs}</p>
                </div>
              </div>
              {g.linkedInitiative && (
                <p className="text-[10px] text-teal-600 dark:text-teal-400">
                  Linked initiative: {roadmapItems.find(r => r.id === g.linkedInitiative)?.initiative || g.linkedInitiative}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PM Interview Prep */}
      {activeSection === "interview" && (
        <div className="space-y-3">
          {interviewInsights.map((q, i) => (
            <details key={i} className="p-4 bg-card border border-border rounded-xl group" data-testid={`interview-q-${i}`}>
              <summary className="list-none cursor-pointer flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground pr-2">{q.question}</p>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">{q.answer}</p>
              </div>
            </details>
          ))}
        </div>
      )}

      {/* State Map */}
      {activeSection === "statemap" && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Input data-testid="state-search" placeholder="Search state..." value={stateSearch} onChange={(e) => setStateSearch(e.target.value)} className="w-40 h-8 text-xs" />
            <Select value={stateRegion} onValueChange={setStateRegion}>
              <SelectTrigger className="w-36 h-8 text-xs" data-testid="state-filter-region"><SelectValue placeholder="Region" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {["Northeast", "Southeast", "Midwest", "Southwest", "West"].map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={stateOpp} onValueChange={setStateOpp}>
              <SelectTrigger className="w-36 h-8 text-xs" data-testid="state-filter-opp"><SelectValue placeholder="Opportunity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Opportunity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateHvhz} onValueChange={setStateHvhz}>
              <SelectTrigger className="w-28 h-8 text-xs" data-testid="state-filter-hvhz"><SelectValue placeholder="HVHZ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All HVHZ</SelectItem>
                <SelectItem value="yes">HVHZ Yes</SelectItem>
                <SelectItem value="no">HVHZ No</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {(["volume", "opp", "state"] as const).map((col) => (
                <button key={col} data-testid={`state-sort-${col}`} onClick={() => setStateSortCol(col)} className={`px-2.5 py-1 text-[10px] font-medium rounded transition-colors ${stateSortCol === col ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {col === "volume" ? "Volume" : col === "opp" ? "Opportunity" : "A-Z"}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground self-center ml-1">{filteredStates.length} states/DC</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/60">
                  <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">State</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Region</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Building Code</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Opportunity</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Key Verticals</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">HVHZ</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Constr. Vol ($B)</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground uppercase tracking-wide">Key Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredStates.map((s, i) => (
                  <tr key={s.state} data-testid={`state-row-${s.state.replace(/\s/g, "-")}`} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-secondary/20"} ${oppRowBg[s.marketOpportunity]}`}>
                    <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">{s.state}</td>
                    <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">{s.region}</td>
                    <td className="py-2 px-3 text-muted-foreground font-mono whitespace-nowrap text-[10px]">{s.buildingCode}</td>
                    <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${oppBadge[s.marketOpportunity]}`}>{s.marketOpportunity}</span></td>
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1">
                        {s.keyVerticals.slice(0, 2).map((v) => (<span key={v} className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">{v.split("/")[0]}</span>))}
                        {s.keyVerticals.length > 2 && <span className="text-[10px] text-muted-foreground">+{s.keyVerticals.length - 2}</span>}
                      </div>
                    </td>
                    <td className="py-2 px-3">{s.hvhz ? <span className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">YES</span> : <span className="text-[10px] text-muted-foreground">—</span>}</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-foreground">{s.annualConstructionVolume.toFixed(1)}</td>
                    <td className="py-2 px-3 text-muted-foreground max-w-xs"><p className="truncate text-[11px] leading-relaxed">{s.notes}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageWrap>
  );
}

// ─── ANALYTICS TAB ────────────────────────────────────────────────────────

function AnalyticsTab() {
  const healthColor = (score: number) => score >= 70 ? "text-teal-600 dark:text-teal-400" : score >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-500";
  const healthBg = (score: number) => score >= 70 ? "bg-teal-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";
  const lifecycleBadge: Record<string, string> = {
    "Growth": "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    "Mature": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "Sustain": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    "EOL-Risk": "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  };
  const trendIcon = (t: string) => t === "up" ? "↑" : t === "down" ? "↓" : "→";
  const trendColor = (t: string) => t === "up" ? "text-teal-500" : t === "down" ? "text-rose-500" : "text-muted-foreground";

  // Waterfall data for revenue mix
  const waterfallData = productLineHealthData.map(pl => ({
    name: pl.name.replace("RECORD ", "").replace(" Swing", " Sw"),
    revenue: pl.revenueMid,
    brand: pl.brand,
    fill: pl.brand === "RECORD" ? "#8b5cf6" : "#14b8a6",
  })).sort((a, b) => b.revenue - a.revenue);

  return (
    <PageWrap>
      <SectionTitle sub="Product line health, revenue mix, NPS trends, competitive win rates, and time-to-market KPIs">
        Analytics Dashboard
      </SectionTitle>

      {/* A. Product Line Health Scorecard */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Product Line Health Scorecard</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Product Line", "Brand", "Revenue Range", "Health Score", "NPS", "Lifecycle", "Win Rate", "Top Vertical", "Sparkline"].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productLineHealthData.sort((a, b) => b.healthScore - a.healthScore).map((pl, i) => (
                <tr key={pl.name} data-testid={`health-row-${pl.name.replace(/\s/g, "-")}`} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                  <td className="py-2.5 px-3 font-semibold text-foreground whitespace-nowrap">{pl.name}</td>
                  <td className="py-2.5 px-3">
                    <Badge className={`text-[9px] ${pl.brand === "RECORD" ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300" : "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"}`}>
                      {pl.brand === "RECORD" ? "REC" : "AA"}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground font-mono text-[10px]">{pl.revenueRange}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${healthBg(pl.healthScore)}`} style={{ width: `${pl.healthScore}%` }} />
                      </div>
                      <span className={`font-bold font-mono ${healthColor(pl.healthScore)}`}>{pl.healthScore}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-muted-foreground">{pl.nps}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${lifecycleBadge[pl.lifecycle]}`}>{pl.lifecycle}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`font-bold ${pl.winRate >= 65 ? "text-teal-600 dark:text-teal-400" : pl.winRate >= 50 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                      {pl.winRate > 0 ? `${pl.winRate}%` : "—"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">{pl.topVertical.split("/")[0]}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-end gap-px h-6">
                      {pl.sparkline.map((v, si) => {
                        const maxV = Math.max(...pl.sparkline);
                        const pct = Math.round((v / maxV) * 100);
                        return (
                          <div
                            key={si}
                            style={{ height: `${pct}%`, width: 6 }}
                            className={`rounded-sm ${si === pl.sparkline.length - 1 ? (pl.trend === "up" ? "bg-teal-500" : pl.trend === "down" ? "bg-rose-500" : "bg-slate-400") : "bg-muted-foreground/30"}`}
                            title={`Month ${si + 1}: ${v}`}
                          />
                        );
                      })}
                      <span className={`text-[10px] font-bold ml-1 ${trendColor(pl.trend)}`}>{trendIcon(pl.trend)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* B. Revenue Mix + C. NPS Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold">Revenue Mix by Product Line ($M)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={waterfallData} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `$${v}M`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={80} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={(v: number) => [`$${v}M`, "Revenue (mid)"]} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1"><span className="w-3 h-2 bg-teal-500 inline-block rounded" /> AA</div>
              <div className="flex items-center gap-1"><span className="w-3 h-2 bg-violet-500 inline-block rounded" /> RECORD</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold">NPS Trend — Top 4 Products (Q3 2024–Q4 2025)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={npsTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[55, 85]} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="SL500" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="VersaMax" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="TSA 160" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ecoLOGIC" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* D. Competitive Win/Loss Dashboard */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Competitive Win/Loss Dashboard</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Product", "Win Rate", "Primary Competitor", "Deal Loss Reason", "Trend"].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productLineHealthData.filter(pl => pl.winRate > 0).sort((a, b) => b.winRate - a.winRate).map((pl, i) => (
                <tr key={pl.name} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-secondary/20"}`} data-testid={`win-loss-${pl.name.replace(/\s/g, "-")}`}>
                  <td className="py-2.5 px-3 font-semibold text-foreground">{pl.name}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pl.winRate >= 65 ? "bg-teal-500" : pl.winRate >= 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${pl.winRate}%` }} />
                      </div>
                      <span className={`font-bold font-mono ${pl.winRate >= 65 ? "text-teal-600 dark:text-teal-400" : pl.winRate >= 50 ? "text-amber-600 dark:text-amber-400" : "text-rose-500"}`}>{pl.winRate}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">{pl.competitor}</td>
                  <td className="py-2.5 px-3 text-muted-foreground max-w-[200px]"><p className="truncate">{pl.dealLossReason}</p></td>
                  <td className="py-2.5 px-3">
                    <span className={`text-base font-bold ${trendColor(pl.trend)}`}>{trendIcon(pl.trend)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* E. Time-to-Market KPIs */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Time-to-Market KPIs — Avg Days per Gate Stage</h3>
        <Card className="border border-border">
          <CardContent className="px-4 pt-4 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ttmKpis} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} label={{ value: "Days", angle: -90, position: "insideLeft", fontSize: 10, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={(v: number) => [`${v} days`]} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="avgDays" name="AA Avg Days" fill="hsl(186 80% 38%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmarkDays" name="Industry Benchmark" fill="hsl(258 75% 55%)" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </PageWrap>
  );
}

// ─── KEYBOARD SHORTCUTS PANEL ─────────────────────────────────────────────

function KeyboardShortcutsPanel({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { key: "⌘K", desc: "Open search" },
    { key: "T", desc: "Go to Roadmap" },
    { key: "P", desc: "Go to Portfolio" },
    { key: "A", desc: "Go to Analytics" },
    { key: "I", desc: "Go to Intelligence" },
    { key: "F", desc: "Go to Forecast" },
    { key: "G", desc: "Go to Stage-Gate" },
    { key: "N", desc: "New Initiative" },
    { key: "D", desc: "Toggle Dark Mode" },
    { key: "?", desc: "This Panel" },
    { key: "Esc", desc: "Close overlays" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="shortcuts-panel-backdrop"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
        data-testid="shortcuts-panel"
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <p className="text-sm font-bold">Keyboard Shortcuts</p>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-md text-muted-foreground" data-testid="close-shortcuts">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 space-y-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.desc}</span>
              <kbd className="text-[11px] font-mono bg-secondary px-2 py-0.5 rounded border border-border">{s.key}</kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── EXEC DIGEST MODAL ────────────────────────────────────────────────────

function ExecDigestModal({ allItems, onClose }: { allItems: RoadmapItem[]; onClose: () => void }) {
  const { toast } = useToast();
  const stats = getPortfolioStats();

  const topInitiatives = allItems
    .filter(i => i.impact === "critical" || i.impact === "high")
    .sort((a, b) => (a.impact === "critical" ? -1 : 1))
    .slice(0, 5);

  const digestText = [
    "EXECUTIVE DIGEST — PM Studio 4.0",
    `Generated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    "",
    "PORTFOLIO HEALTH",
    `Total Initiatives: ${stats.total} (ASSA ABLOY: ${stats.byBrand["ASSA ABLOY"] || 0}, RECORD: ${stats.byBrand["RECORD"] || 0})`,
    `Estimated Portfolio Revenue: $44.3M (base case FY2025)`,
    `Critical Impact Items: ${stats.criticalCount}`,
    `Total Budget Allocated: $${(stats.totalBudget / 1000).toFixed(1)}M`,
    "",
    "TOP 5 INITIATIVES BY STRATEGIC IMPACT",
    ...topInitiatives.map((item, i) => `  ${i + 1}. ${item.initiative} — ${item.brand} · ${item.productLine} · ${gateShortName[item.gateStage]} · Owner: ${item.owner}`),
    "",
    "KEY RISKS",
    "  • 6000 Swing and 8000 HD Swing approaching EOL — channel displacement risk Q3 2026",
    "  • ANSI A156.10-2024 cert deadline Q4 2025 — 3 products at risk",
    "  • SW300 header depth gap — active deal losses to dormakaba",
    "",
    "MARKET SIGNALS TO WATCH",
    "  1. Florida DOT $2.1B MIA terminal expansion — high door automation potential",
    "  2. dormakaba NA auto door revenue decline 8% — competitive displacement window",
    "  3. Stanley Access acquires Horton Automatics — competitive landscape shift",
    "",
    "NEXT GATE REVIEWS",
    "  • VersaMax FGI 2022 Compliance — G4 review due Q2 2025",
    "  • RECORD TSA 160 NA Certification — G3 review due Q2 2025",
    "  • ecoLOGIC AI Rollout — G4 review due Q3 2025",
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(digestText).then(() => {
      toast({ title: "Copied to clipboard", description: "Exec digest ready to paste." });
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="exec-digest-backdrop"
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0 }}
          className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
          data-testid="exec-digest-modal"
        >
          <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-sm font-bold">Executive Digest</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">One-page portfolio summary</p>
            </div>
            <div className="flex gap-2">
              <Button data-testid="copy-exec-digest" size="sm" variant="outline" onClick={handleCopy} className="text-xs gap-1.5 h-7">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                Copy
              </Button>
              <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground" data-testid="close-exec-digest">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <ScrollArea className="flex-1 p-6">
            <pre className="text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap">{digestText}</pre>
          </ScrollArea>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── MARKET INTEL TAB ───────────────────────────────────────────────────────────

function MarketIntelTab() {
  const mi = MARKET_INTELLIGENCE;

  // Vertical growth data sorted descending
  const verticalGrowthData = [
    { name: "Government", yoy: mi.verticalGrowth.government.yoy, driver: mi.verticalGrowth.government.driver },
    { name: "Healthcare", yoy: mi.verticalGrowth.healthcare.yoy, driver: mi.verticalGrowth.healthcare.driver },
    { name: "Airport/Transit", yoy: mi.verticalGrowth.airportTransit.yoy, driver: mi.verticalGrowth.airportTransit.driver },
    { name: "Office/Comm.", yoy: mi.verticalGrowth.officeCommercial.yoy, driver: mi.verticalGrowth.officeCommercial.driver },
    { name: "Retail", yoy: mi.verticalGrowth.retail.yoy, driver: mi.verticalGrowth.retail.driver },
  ].sort((a, b) => b.yoy - a.yoy);

  const competitiveDonutData = [
    { name: "ASSA ABLOY + dormakaba", value: mi.competitiveShare.aaBlumetaShare, color: "#06b6d4" },
    { name: "Other Top 5", value: mi.competitiveShare.top5Combined - mi.competitiveShare.aaBlumetaShare, color: "#818cf8" },
    { name: "Fragmented Regional", value: mi.competitiveShare.fragmented, color: "#334155" },
  ];

  const sensorShareData = [
    { name: "Infrared (IR)", value: mi.sensorMarket.irShare, color: "#06b6d4" },
    { name: "Other / LiDAR", value: 100 - mi.sensorMarket.irShare, color: "#334155" },
  ];

  const barColor = (yoy: number) => yoy >= 12 ? "#06b6d4" : yoy >= 8 ? "#818cf8" : "#f59e0b";

  return (
    <PageWrap>
      <SectionTitle sub="TAM/SAM sizing, vertical growth rates, sensor market trends, and competitive landscape">
        Market Intelligence
      </SectionTitle>

      {/* A. NA Market Overview — KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="border border-border bg-card">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe2 size={14} className="text-cyan-400" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">NA Auto Door 2025</span>
            </div>
            <p className="text-2xl font-bold text-foreground">${mi.naAutoDoorsMarket.tam2025}M</p>
            <p className="text-xs text-cyan-400 mt-0.5">TAM — North America</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-violet-400" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Growth CAGR</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{mi.naAutoDoorsMarket.cagr}%</p>
            <p className="text-xs text-violet-400 mt-0.5">${mi.naAutoDoorsMarket.tam2035}M by 2035</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={14} className="text-amber-400" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">US Share of NA</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{mi.naAutoDoorsMarket.usPct}%</p>
            <p className="text-xs text-amber-400 mt-0.5">${mi.naAutoDoorsMarket.usSize2025}M US SAM 2025</p>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-rose-400" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Sliding Door Share</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{mi.naAutoDoorsMarket.slidingDoorShare}%</p>
            <p className="text-xs text-rose-400 mt-0.5">of total NA market</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-[10px] text-muted-foreground mb-6 -mt-4">Source: {mi.naAutoDoorsMarket.source}</p>

      {/* B. Vertical Growth Rates + C. Competitive Landscape */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* B. Vertical Growth Rates */}
        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 size={14} className="text-cyan-400" />
              Vertical Growth Rates (YoY)
            </CardTitle>
            <p className="text-xs text-muted-foreground">Sorted by growth rate descending</p>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={verticalGrowthData}
                layout="vertical"
                margin={{ top: 0, right: 40, left: 80, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `+${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={75} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }}
                  formatter={(v: number, _n: string, props: { payload?: { driver?: string } }) => [`+${v}% YoY`, props.payload?.driver ?? ""]}
                />
                <Bar dataKey="yoy" radius={[0, 4, 4, 0]}>
                  {verticalGrowthData.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.yoy)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1 text-xs">
              {verticalGrowthData.map((v) => (
                <div key={v.name} className="flex gap-2 p-1.5 bg-secondary/20 rounded">
                  <span className="font-bold text-cyan-400 shrink-0 w-8 text-right">+{v.yoy}%</span>
                  <span className="text-muted-foreground truncate">{v.driver}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* C. Competitive Landscape */}
        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target size={14} className="text-violet-400" />
              Competitive Landscape
            </CardTitle>
            <p className="text-xs text-muted-foreground">{mi.competitiveShare.note}</p>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={competitiveDonutData}
                  cx="50%" cy="50%"
                  outerRadius={75} innerRadius={40}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {competitiveDonutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }}
                  formatter={(v: number, name: string) => [`${v}%`, name]}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1 text-xs">
              <div className="flex justify-between items-center p-2 rounded" style={{ background: "rgba(6,182,212,0.08)" }}>
                <span className="font-medium">ASSA ABLOY + dormakaba</span>
                <span className="font-bold text-cyan-400">{mi.competitiveShare.aaBlumetaShare}% ({Math.round(mi.naAutoDoorsMarket.tam2025 * mi.competitiveShare.aaBlumetaShare / 100)}M)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary/30 rounded">
                <span className="font-medium">Other Top 5 Players</span>
                <span className="font-bold text-violet-400">{mi.competitiveShare.top5Combined - mi.competitiveShare.aaBlumetaShare}% ({Math.round(mi.naAutoDoorsMarket.tam2025 * (mi.competitiveShare.top5Combined - mi.competitiveShare.aaBlumetaShare) / 100)}M)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                <span className="font-medium">Fragmented Regional</span>
                <span className="font-bold text-muted-foreground">{mi.competitiveShare.fragmented}% ({Math.round(mi.naAutoDoorsMarket.tam2025 * mi.competitiveShare.fragmented / 100)}M)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* D. Sensor Market Intelligence */}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sensor Market Intelligence</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Card className="border border-border">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center gap-2 mb-3">
              <Signal size={16} className="text-cyan-400" />
              <span className="text-sm font-semibold">Infrared Dominant</span>
            </div>
            <p className="text-3xl font-bold text-cyan-400 mb-1">{mi.sensorMarket.irShare}%</p>
            <p className="text-xs text-muted-foreground mb-3">Market share — motion-detection standard across sliding, swing, and revolving</p>
            <div className="flex gap-1 flex-wrap">
              {mi.sensorMarket.keyOEMs.map((oem) => (
                <Badge key={oem} variant="secondary" className="text-[10px]">{oem}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={16} className="text-violet-400" />
              <span className="text-sm font-semibold">LiDAR — Premium</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{mi.sensorMarket.lidarGrowth}</p>
            <div className="p-2 rounded text-xs" style={{ background: "rgba(129,140,248,0.1)" }}>
              <span className="font-semibold text-violet-400">Total Sensor Market 2024:</span>
              <span className="ml-1">${mi.sensorMarket.size2024}M</span>
            </div>
            <div className="p-2 rounded text-xs mt-1" style={{ background: "rgba(129,140,248,0.1)" }}>
              <span className="font-semibold text-violet-400">CAGR:</span>
              <span className="ml-1">{mi.sensorMarket.cagr}% (SkyQuest/GMI 2025)</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={16} className="text-amber-400" />
              <span className="text-sm font-semibold">AI Vision — Emerging</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{mi.sensorMarket.aiVisionTrend}</p>
            <ResponsiveContainer width="100%" height={80}>
              <PieChart>
                <Pie data={sensorShareData} cx="50%" cy="50%" outerRadius={35} innerRadius={18} dataKey="value" paddingAngle={3}>
                  {sensorShareData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 10 }} formatter={(v: number) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* E. Trend Cards */}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Market Trend Signals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="p-4 bg-card border border-border rounded-xl border-l-4 border-l-cyan-500">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={13} className="text-cyan-400" />
            <span className="text-xs font-semibold">Touchless Demand Surge</span>
          </div>
          <p className="text-2xl font-bold text-cyan-400 mb-1">+{mi.touchlessTrend.biometricAdoptionIncrease}%</p>
          <p className="text-xs text-muted-foreground">{mi.touchlessTrend.touchlessDemandDriver}. Biometric integration accelerating via Boon Edam at ISC West 2026 + Alcatraz Rock X partnership.</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={13} className="text-amber-400" />
            <span className="text-xs font-semibold">AI Predictive Maintenance</span>
          </div>
          <p className="text-xs text-muted-foreground">{mi.touchlessTrend.iotPredictiveMaintenance}. Benchmark: dormakaba reporting 32% downtime reduction in connected door fleet deployments.</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl border-l-4 border-l-violet-500">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={13} className="text-violet-400" />
            <span className="text-xs font-semibold">Biometric Integration Trend</span>
          </div>
          <p className="text-xs text-muted-foreground">Boon Edam showcasing biometric-integrated revolving doors at ISC West 2026. Alcatraz Rock X facial recognition integrated into automatic door access control. Growing spec-in-request from corporate campuses and Class A office.</p>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={13} className="text-green-400" />
            <span className="text-xs font-semibold">ASHRAE 90.1-2022 Energy Mandate</span>
          </div>
          <p className="text-xs text-muted-foreground">ASHRAE 90.1-2022 classifies revolving doors as vestibule equivalent for energy code compliance. Creates new energy savings selling point for revolving door portfolio in states adopting 90.1-2022 energy code.</p>
        </div>
      </div>

      {/* F. ASSA ABLOY Strategic Position */}
      <Card className="border border-cyan-500/30 bg-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target size={14} className="text-cyan-400" />
            Our Position — ASSA ABLOY Entrance Systems NA
          </CardTitle>
          <p className="text-xs text-muted-foreground">Key market share positions as of 2025</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg text-center" style={{ background: "rgba(6,182,212,0.08)" }}>
              <p className="text-xl font-bold text-cyan-400">60%+</p>
              <p className="text-xs font-medium text-foreground mt-0.5">FL HVHZ Market</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Hurricane impact rated doors — NOA-certified portfolio</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: "rgba(129,140,248,0.08)" }}>
              <p className="text-xl font-bold text-violet-400">42%</p>
              <p className="text-xs font-medium text-foreground mt-0.5">US Revolving Door</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Combined Boon Edam + ASSA ABLOY revolving</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: "rgba(245,158,11,0.08)" }}>
              <p className="text-xl font-bold text-amber-400">40%</p>
              <p className="text-xs font-medium text-foreground mt-0.5">US Healthcare Sliding</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">SL500 + VersaMax in hospital/medical verticals</p>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: "rgba(34,197,94,0.08)" }}>
              <p className="text-xl font-bold text-green-400">Only</p>
              <p className="text-xs font-medium text-foreground mt-0.5">ecoLOGIC AI Platform</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Tier-1 OEM with AI energy platform in US market (2025)</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-secondary/20 rounded-lg text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">ecoLOGIC AI:</span> Only AI-powered energy optimization platform from a tier-1 automatic door OEM in the US market as of 2025. Competitors offer rule-based scheduling; ecoLOGIC delivers adaptive learning with OTA firmware updates across 14,000+ connected units.
          </div>
        </CardContent>
      </Card>
    </PageWrap>
  );
}

// ─── SUITE NAV ───────────────────────────────────────────────────────────────

const SUITE_TOOLS = [
  { id: "doorspec",    label: "DoorSpec",    url: "https://doorspec-aadm.vercel.app" },
  { id: "battlecard", label: "BattleCard",  url: "https://battlecard-aadm.vercel.app" },
  { id: "codetracker",label: "CodeTracker", url: "https://codetracker-aadm.vercel.app" },
  { id: "crosswalkdb",label: "CrosswalkDB", url: "https://crosswalkdb-aadm.vercel.app" },
  { id: "pmstudio",   label: "PM Studio",   url: "https://pmstudio-aadm.vercel.app" },
  { id: "portfolioiq",label: "PortfolioIQ", url: "https://portfolioiq-aadm.vercel.app" },
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
                ? "bg-primary text-white cursor-default"
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function PMStudio() {
  const [activeTab, setActiveTab] = useState<TabId>("portfolio");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalItems, setGlobalItems] = useState<RoadmapItem[]>([...roadmapItems, ...iotRoadmapItems]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNewInitiative, setShowNewInitiative] = useState(false);
  const [openDrawerFor, setOpenDrawerFor] = useState<RoadmapItem | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExecDigest, setShowExecDigest] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleDark = () => {
    setDarkMode((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
        setShowShortcuts(false);
        setShowExecDigest(false);
        return;
      }
      if (isTyping) return;
      if (e.key === "?") { setShowShortcuts(v => !v); return; }
      if (e.key === "d" || e.key === "D") { toggleDark(); return; }
      if (e.key === "n" || e.key === "N") { setShowNewInitiative(true); return; }
      if (e.key === "p" || e.key === "P") { setActiveTab("portfolio"); return; }
      if (e.key === "t" || e.key === "T") { setActiveTab("roadmap"); return; }
      if (e.key === "g" || e.key === "G") { setActiveTab("stagegate"); return; }
      if (e.key === "i" || e.key === "I") { setActiveTab("intelligence"); return; }
      if (e.key === "f" || e.key === "F") { setActiveTab("forecast"); return; }
      if (e.key === "a" || e.key === "A") { setActiveTab("analytics"); return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  const handleExport = useCallback(() => {
    exportCSV(globalItems);
    toast({ title: "CSV exported", description: `${globalItems.length} initiatives exported.` });
  }, [globalItems, toast]);

  const handleAddItem = useCallback((item: RoadmapItem) => {
    setGlobalItems((prev) => [...prev, item]);
    toast({ title: "Initiative added", description: `${item.initiative} added to roadmap.` });
  }, [toast]);

  const handleCloseNotif = useCallback(() => setNotifOpen(false), []);
  const handleCloseProfile = useCallback(() => setProfileOpen(false), []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-screen-2xl mx-auto gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-7 h-7 text-primary flex-shrink-0" fill="none" aria-label="PM Studio Logo">
              <rect x="2" y="2" width="14" height="14" rx="2" fill="currentColor" opacity="0.9" />
              <rect x="20" y="2" width="14" height="14" rx="2" fill="currentColor" opacity="0.5" />
              <rect x="2" y="20" width="14" height="14" rx="2" fill="currentColor" opacity="0.5" />
              <rect x="20" y="20" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.7" />
            </svg>
            {!sidebarCollapsed && (
              <div>
                <div className="text-sm font-semibold leading-none">
                  PM Studio <span className="text-primary text-[10px] ml-1 font-bold align-top">4.0</span>
                </div>
                <div className="text-[10px] text-muted-foreground leading-none mt-0.5">ASSA ABLOY + RECORD · NA Pedestrian</div>
              </div>
            )}
            {/* Collapse toggle */}
            <button
              data-testid="btn-sidebar-collapse"
              onClick={() => setSidebarCollapsed(v => !v)}
              className="hidden lg:flex p-1.5 rounded-md text-muted-foreground hover:bg-secondary transition-colors text-[10px] font-mono"
              title={sidebarCollapsed ? "Expand nav" : "Collapse nav"}
            >
              {sidebarCollapsed ? "»" : "«"}
            </button>
          </div>

          {/* Desktop Tab Nav — scrollable strip so all 10+ tabs stay accessible */}
          <nav className="hidden lg:flex items-center flex-1 min-w-0 overflow-x-auto scrollbar-none px-1" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center gap-0.5 mx-auto">
              {tabList.map((tab) => (
                <button
                  key={tab.id}
                  data-testid={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  title={tab.label}
                >
                  <span className="text-sm leading-none">{tab.icon}</span>
                  <span className="hidden xl:inline">{tab.label}</span>
                  <span className="xl:hidden text-[10px] font-semibold">{tab.label.slice(0,5)}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Search trigger */}
            <button
              data-testid="btn-global-search"
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 h-8 px-3 text-xs text-muted-foreground bg-secondary border border-border rounded-md hover:border-primary transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              Search
              <span className="hidden xl:flex items-center ml-1 px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono">⌘K</span>
            </button>

            {/* New Initiative */}
            <Button
              data-testid="btn-new-initiative-nav"
              size="sm"
              className="hidden md:flex h-7 text-xs px-2.5"
              onClick={() => setShowNewInitiative(true)}
            >
              + New
            </Button>

            {/* Keyboard shortcuts */}
            <button
              data-testid="btn-shortcuts"
              onClick={() => setShowShortcuts(true)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors hidden md:flex"
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
              </svg>
            </button>

            {/* Dark mode */}
            <button
              data-testid="btn-dark-mode"
              onClick={toggleDark}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                data-testid="btn-notifications"
                onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">3</span>
              </button>
              <AnimatePresence>
                {notifOpen && <NotificationPanel onClose={handleCloseNotif} />}
              </AnimatePresence>
            </div>

            {/* User Avatar */}
            <div className="relative">
              <button
                data-testid="btn-user-avatar"
                onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
                className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
              >
                JT
              </button>
              <AnimatePresence>
                {profileOpen && <ProfileDropdown onClose={handleCloseProfile} />}
              </AnimatePresence>
            </div>

            {/* Mobile menu toggle */}
            <button
              data-testid="btn-mobile-menu"
              className="lg:hidden p-2 rounded-md text-foreground hover:bg-secondary border border-border"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen
                ? <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                : <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="lg:hidden border-t border-border bg-card shadow-lg overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-1 p-3">
                {tabList.map((tab) => (
                  <button
                    key={tab.id}
                    data-testid={`mobile-tab-${tab.id}`}
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary border border-border"
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Suite Nav */}
      <div className="fixed top-14 left-0 right-0 z-40">
        <SuiteNav activeTool="pmstudio" />
      </div>

      {/* Main Content */}
      <main className="pt-20 min-h-screen" onClick={() => { setNotifOpen(false); setProfileOpen(false); }}>
        <AnimatePresence mode="wait">
          {activeTab === "portfolio" && (
            <PortfolioTab
              key="portfolio"
              allItems={globalItems}
              onNewInitiative={() => setShowNewInitiative(true)}
              onExport={handleExport}
              onExecDigest={() => setShowExecDigest(true)}
            />
          )}
          {activeTab === "analytics" && (
            <AnalyticsTab key="analytics" />
          )}
          {activeTab === "roadmap" && (
            <RoadmapTab
              key="roadmap"
              allItems={globalItems}
              onItemsChange={setGlobalItems}
              openDrawerFor={openDrawerFor}
              onOpenDrawer={setOpenDrawerFor}
              onNewInitiative={() => setShowNewInitiative(true)}
              onExport={handleExport}
            />
          )}
          {activeTab === "stagegate" && (
            <StageGateTab key="stagegate" allItems={globalItems} />
          )}
          {activeTab === "handoffs" && (
            <HandoffsTab key="handoffs" allItems={globalItems} />
          )}
          {activeTab === "launch-readiness" && (
            <LaunchReadinessTab key="launch-readiness" />
          )}
          {activeTab === "voc" && (
            <VocTab key="voc" />
          )}
          {activeTab === "winloss" && (
            <WinLossTab key="winloss" />
          )}
          {activeTab === "capacity" && (
            <CapacityTab key="capacity" />
          )}
          {activeTab === "forecast" && (
            <ForecastTab key="forecast" />
          )}
          {activeTab === "intelligence" && (
            <IntelligenceTab key="intelligence" />
          )}
          {activeTab === "market-intel" && (
            <MarketIntelTab key="market-intel" />
          )}
        </AnimatePresence>
      </main>

      {/* Global Search Overlay */}
      <GlobalSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        allItems={globalItems}
        onSelectItem={(item) => {
          setActiveTab("roadmap");
          setOpenDrawerFor(item);
          setSearchOpen(false);
        }}
      />

      {/* New Initiative Modal */}
      <NewInitiativeModal
        open={showNewInitiative}
        onClose={() => setShowNewInitiative(false)}
        onAdd={handleAddItem}
      />

      {/* Keyboard Shortcuts Panel */}
      <AnimatePresence>
        {showShortcuts && <KeyboardShortcutsPanel onClose={() => setShowShortcuts(false)} />}
      </AnimatePresence>

      {/* Exec Digest Modal */}
      <AnimatePresence>
        {showExecDigest && <ExecDigestModal allItems={globalItems} onClose={() => setShowExecDigest(false)} />}
      </AnimatePresence>
    </div>
  );
}
