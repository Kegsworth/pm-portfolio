import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
  type RoadmapItem, type RoadmapStatus, type GateStage, type HandoffType,
  type Brand, type Vertical, type Comment, type TeamMember, type StateMarketData,
  type ProductLineHealth, type VerticalForecast, type DealVelocityItem, type MarketSignalFeed,
  type RegEventItem, type RevenueScenario,
} from "@/lib/pmStudio";

// ─── Tab Config ───────────────────────────────────────────────────────────────

const tabList = [
  { id: "portfolio", label: "Portfolio", icon: "⬡" },
  { id: "roadmap", label: "Roadmap", icon: "◈" },
  { id: "analytics", label: "Analytics", icon: "◎" },
  { id: "stagegate", label: "Stage-Gate", icon: "◇" },
  { id: "handoffs", label: "Handoffs", icon: "⇌" },
  { id: "voc", label: "VOC", icon: "◉" },
  { id: "capacity", label: "Capacity", icon: "▤" },
  { id: "forecast", label: "Forecast", icon: "◬" },
  { id: "intelligence", label: "Intelligence", icon: "◆" },
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
    effort: "M" as "S" | "M" | "L" | "XL", quarter: "Q3", year: "2025",
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
    setForm({ initiative: "", brand: "ASSA ABLOY", productLine: "", status: "concept", gateStage: "G0_idea", owner: "J. Tubbs", impact: "medium", effort: "M", quarter: "Q3", year: "2025", description: "", budget: "", region: "National", priority: "P2" });
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

// ─── KEYBOARD SHORTCUTS PANEL ──────────────────────────────────────────────

function KeyboardShortcutsPanel({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { keys: "⌘K", desc: "Global Search" },
    { keys: "T", desc: "Roadmap tab" },
    { keys: "P", desc: "Portfolio tab" },
    { keys: "I", desc: "Intelligence tab" },
    { keys: "F", desc: "Forecast tab" },
    { keys: "G", desc: "Stage-Gate tab" },
    { keys: "A", desc: "Analytics tab" },
    { keys: "N", desc: "New Initiative" },
    { keys: "D", desc: "Toggle Dark Mode" },
    { keys: "?", desc: "This panel" },
    { keys: "Esc", desc: "Close overlays" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="shortcuts-panel-backdrop"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
        data-testid="shortcuts-panel"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold">Keyboard Shortcuts</h3>
          <button data-testid="close-shortcuts" onClick={onClose} className="p-1 hover:bg-secondary rounded text-muted-foreground">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map(s => (
            <div key={s.keys} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.desc}</span>
              <kbd className="text-[10px] font-mono bg-secondary border border-border px-2 py-0.5 rounded">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── EXEC DIGEST MODAL ─────────────────────────────────────────────────────

function ExecDigestModal({ open, onClose, allItems }: { open: boolean; onClose: () => void; allItems: RoadmapItem[] }) {
  const { toast } = useToast();
  const stats = getPortfolioStats();
  const topItems = allItems
    .filter(i => i.impact === "critical" || i.impact === "high")
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a.impact] || 3) - (order[b.impact] || 3);
    })
    .slice(0, 5);

  const digestText = `EXEC DIGEST — PM Studio 4.0
Generated: ${new Date().toLocaleDateString()}

PORTFOLIO HEALTH
• ${stats.total} total initiatives (ASSA ABLOY + RECORD NA)
• $${(stats.totalBudget / 1000).toFixed(1)}M estimated budget
• ${stats.criticalCount} critical-impact items in pipeline
• ${stats.activeItems} active (concept through launch)

KEY RISKS
• SL521 NOA recertification overdue — FL project exposure
• SW300 header depth losing retrofit bids vs. dormakaba
• ecoLOGIC BMS integration gap — LEED v5 risk
• 6000/8000 Swing platforms approaching EOL — no succession plan

TOP 5 STRATEGIC INITIATIVES
${topItems.map((i, idx) => `${idx + 1}. ${i.initiative} (${i.brand} · ${gateShortName[i.gateStage]} · ${i.impact} impact)`).join("\n")}

MARKET SIGNALS TO WATCH
1. FBC 9th Edition (Dec 2026) — FL HVHZ surge expected, NOA pipeline critical
2. dormakaba 8% NA revenue decline — displacement window open
3. ADA Title II digital accessibility (2027) — government retrofit play

Prepared by J. Tubbs, Senior PM — ASSA ABLOY + RECORD NA Pedestrian`;

  const handleCopy = () => {
    navigator.clipboard.writeText(digestText).then(() => {
      toast({ title: "Copied to clipboard", description: "Exec digest ready to paste." });
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="exec-digest-backdrop"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
          data-testid="exec-digest-modal"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="text-base font-bold">Exec Digest</h2>
              <p className="text-xs text-muted-foreground mt-0.5">One-page portfolio summary — ready to copy</p>
            </div>
            <div className="flex items-center gap-2">
              <Button data-testid="btn-copy-digest" size="sm" onClick={handleCopy} className="text-xs gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                Copy
              </Button>
              <button data-testid="close-exec-digest" onClick={onClose} className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <ScrollArea className="flex-1 p-6">
            <pre className="text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed">{digestText}</pre>
          </ScrollArea>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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

const CALENDAR_YEARS = [2025, 2026, 2027];
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

// ─── ANALYTICS TAB ────────────────────────────────────────────────────────

function AnalyticsTab() {
  const lifecycleBadge: Record<ProductLineHealth["lifecycle"], string> = {
    Growth: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    Mature: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    Sustain: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    "EOL-Risk": "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  };

  const revenueWaterfallData = productLineHealthData.map(p => ({
    name: p.name,
    AA: p.brand === "ASSA ABLOY" ? p.revenueMid : 0,
    RECORD: p.brand === "RECORD" ? p.revenueMid : 0,
  })).filter(p => p.AA > 0 || p.RECORD > 0);

  return (
    <PageWrap>
      <SectionTitle sub="Product line health, revenue mix, NPS trends, competitive win/loss, and time-to-market KPIs">
        Analytics
      </SectionTitle>

      {/* A. Product Line Health Scorecard */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Product Line Health Scorecard</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Product", "Brand", "Revenue", "NPS", "Lifecycle", "Win Rate", "Top Vertical", "Health", "6-mo Trend"].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productLineHealthData.map(p => (
                <tr key={p.name} data-testid={`analytics-row-${p.name.replace(/\s/g, "-")}`} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-foreground whitespace-nowrap">{p.name}</td>
                  <td className="py-2.5 px-3">
                    <Badge className={`text-[9px] ${p.brand === "RECORD" ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300" : "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"}`}>
                      {p.brand === "RECORD" ? "REC" : "AA"}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{p.revenueRange}</td>
                  <td className="py-2.5 px-3">
                    <span className={`font-bold ${p.nps >= 70 ? "text-teal-500" : p.nps >= 60 ? "text-amber-500" : "text-rose-500"}`}>{p.nps}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${lifecycleBadge[p.lifecycle]}`}>{p.lifecycle}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    {p.winRate > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${p.winRate >= 65 ? "bg-teal-500" : p.winRate >= 55 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${p.winRate}%` }} />
                        </div>
                        <span className="font-mono text-muted-foreground">{p.winRate}%</span>
                      </div>
                    ) : <span className="text-muted-foreground">EOL</span>}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{p.topVertical}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-8 h-8">
                        <svg viewBox="0 0 32 32" className="w-8 h-8 -rotate-90">
                          <circle cx="16" cy="16" r="12" fill="none" stroke="var(--border)" strokeWidth="3" />
                          <circle cx="16" cy="16" r="12" fill="none" stroke={p.healthScore >= 70 ? "#14b8a6" : p.healthScore >= 50 ? "#f59e0b" : "#f43f5e"} strokeWidth="3"
                            strokeDasharray={`${2 * Math.PI * 12}`}
                            strokeDashoffset={`${2 * Math.PI * 12 * (1 - p.healthScore / 100)}`}
                            strokeLinecap="round" />
                        </svg>
                        <span className={`absolute inset-0 flex items-center justify-center text-[8px] font-bold ${healthColor(p.healthScore)}`}>{p.healthScore}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    {/* Mini sparkline */}
                    <div className="flex items-end gap-0.5 h-6">
                      {p.sparkline.map((v, i) => {
                        const min = Math.min(...p.sparkline);
                        const max = Math.max(...p.sparkline);
                        const pct = max === min ? 50 : Math.round(((v - min) / (max - min)) * 100);
                        return (
                          <div
                            key={i}
                            className={`w-1.5 rounded-sm ${p.trend === "up" ? "bg-teal-500" : p.trend === "down" ? "bg-rose-500" : "bg-amber-500"}`}
                            style={{ height: `${Math.max(4, pct * 0.2)}px` }}
                          />
                        );
                      })}
                      <span className="ml-1 text-[10px]">{p.trend === "up" ? "↑" : p.trend === "down" ? "↓" : "→"}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* B + C: Revenue Mix Waterfall + NPS Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Revenue Mix by Product Line ($M ARR)</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueWaterfallData} margin={{ top: 0, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={v => [`$${v}M`]} />
                <Bar dataKey="AA" name="ASSA ABLOY" fill="hsl(186 80% 38%)" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="RECORD" name="RECORD" fill="hsl(258 75% 55%)" radius={[3, 3, 0, 0]} stackId="a" />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">NPS Trend — Top 4 Product Lines (Q3 2024 – Q4 2025)</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={npsTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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

      {/* D. Competitive Win/Loss */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Competitive Win/Loss Dashboard</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Product", "Win Rate", "Primary Competitor", "Top Deal Loss Reason", "Trend"].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-muted-foreground font-semibold uppercase tracking-wide whitespace-nowrap text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productLineHealthData.filter(p => p.winRate > 0).map(p => (
                <tr key={p.name} data-testid={`competitive-row-${p.name.replace(/\s/g, "-")}`} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="py-2.5 px-3 font-semibold">{p.name}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${p.winRate >= 65 ? "text-teal-500" : p.winRate >= 55 ? "text-amber-500" : "text-rose-500"}`}>{p.winRate}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">{p.competitor}</td>
                  <td className="py-2.5 px-3 text-muted-foreground max-w-xs">
                    <p className="truncate">{p.dealLossReason}</p>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-base ${p.trend === "up" ? "text-teal-500" : p.trend === "down" ? "text-rose-500" : "text-amber-500"}`}>
                      {p.trend === "up" ? "↑" : p.trend === "down" ? "↓" : "→"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* E. Time-to-Market KPIs */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Time-to-Market KPIs — Avg Days per Gate Stage</h3>
        <Card className="border border-border">
          <CardContent className="px-4 pb-4 pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ttmKpis} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} label={{ value: "Days", angle: -90, position: "insideLeft", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={v => [`${v} days`]} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="avgDays" name="Avg Days (AA)" fill="hsl(186 80% 38%)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="benchmarkDays" name="Industry Benchmark" fill="hsl(258 75% 55%)" radius={[3, 3, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2 text-center">AA exceeds industry benchmark at every gate stage — strongest gap at G3→G4 Development (30 days over)</p>
          </CardContent>
        </Card>
      </div>
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
  const [selectedType, setSelectedType] = useState<HandoffType>("engineering");
  const { toast } = useToast();
  const template = handoffTemplates[selectedType];

  const handleCopy = () => {
    navigator.clipboard.writeText(template.body).then(() => {
      toast({ title: "Template copied to clipboard" });
    });
  };

  return (
    <PageWrap>
      <SectionTitle sub="Structured handoff templates for each function — Engineering, Marketing, Sales, Regulatory">
        Handoff Templates
      </SectionTitle>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["engineering", "marketing", "sales", "regulatory"] as HandoffType[]).map(t => (
          <button
            key={t}
            data-testid={`handoff-tab-${t}`}
            onClick={() => setSelectedType(t)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${selectedType === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{template.title}</CardTitle>
                <Button data-testid="btn-copy-handoff" size="sm" variant="outline" onClick={handleCopy} className="text-xs gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed bg-secondary rounded-lg p-4 max-h-[500px] overflow-y-auto">{template.body}</pre>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Card className="border border-border">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Template Info</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{selectedType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sections</span>
                  <span className="font-medium">{template.sections?.length || 5}</span>
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
                {allItems.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[item.status]}`} />
                    <span className="truncate text-muted-foreground">{item.initiative}</span>
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
          {vocEntries.map(entry => (
            <div key={entry.id} className="p-4 bg-card border border-border rounded-xl" data-testid={`voc-entry-${entry.id}`}>
              <div className="flex items-start justify-between mb-2 gap-3">
                <p className="text-sm font-medium text-foreground leading-snug">{entry.quote}</p>
                <Badge className={`text-[10px] flex-shrink-0 ${entry.sentiment === "positive" ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300" : entry.sentiment === "negative" ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300" : "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"}`}>
                  {entry.sentiment}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{entry.source} · {entry.vertical} · {entry.date}</p>
              <div className="flex flex-wrap gap-1">
                {entry.themes.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
              </div>
            </div>
          ))}
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
            <div key={person.person} className="mb-3 p-4 bg-card border border-border rounded-xl" data-testid={`resource-${person.person.replace(/\s/g, "-")}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar name={person.person} size="sm" />
                  <div>
                    <p className="text-xs font-semibold">{person.person}</p>
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