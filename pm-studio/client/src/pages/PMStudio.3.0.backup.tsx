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
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  AreaChart, Area,
} from "recharts";
import {
  roadmapItems, stageCriteria, handoffTemplates, vocEntries, resourceData,
  marketVerticals, stateMarketData, teamMembers,
  gateOrder, gateFullName, gateShortName, getNextGate, getGateCriteria,
  getPortfolioStats, getLinkedItems, getTeamMember,
  statusColors, impactColors, brandColors,
  type RoadmapItem, type RoadmapStatus, type GateStage, type HandoffType,
  type Brand, type Vertical, type Comment, type TeamMember, type StateMarketData,
} from "@/lib/pmStudio";

// ─── Tab Config ───────────────────────────────────────────────────────────────

const tabList = [
  { id: "portfolio", label: "Portfolio", icon: "⬡" },
  { id: "roadmap", label: "Roadmap", icon: "◈" },
  { id: "stagegate", label: "Stage-Gate", icon: "◇" },
  { id: "handoffs", label: "Handoffs", icon: "⇌" },
  { id: "voc", label: "VOC", icon: "◉" },
  { id: "capacity", label: "Capacity", icon: "▤" },
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
              <p className="text-xs text-muted-foreground text-center py-6">No results for "{q}"</p>
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

            {/* Owner */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-secondary rounded-lg">
              <Avatar name={item.owner} size="md" />
              <div>
                <p className="text-xs font-semibold">{item.owner}</p>
                <p className="text-[10px] text-muted-foreground">Initiative Owner</p>
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

// ─── PORTFOLIO TAB ─────────────────────────────────────────────────────────

function PortfolioTab({
  allItems,
  onNewInitiative,
  onExport,
}: {
  allItems: RoadmapItem[];
  onNewInitiative: () => void;
  onExport: () => void;
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
          </div>
        </div>
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
        {/* Header: Year + Month labels */}
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
                  {MONTHS.map((m, mi) => (
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
              {/* Left label */}
              <div style={{ width: LEFT_COL_WIDTH, minWidth: LEFT_COL_WIDTH }} className="flex items-center px-3 border-r border-border flex-shrink-0 py-1">
                <p className="text-[10px] font-semibold text-foreground truncate">{pl}</p>
              </div>
              {/* Timeline grid */}
              <div className="relative flex-1 flex items-center" style={{ height: ROW_HEIGHT + 8 }}>
                {/* Month grid lines */}
                {Array.from({ length: TOTAL_MONTHS }).map((_, idx) => (
                  <div key={idx} style={{ position: "absolute", left: idx * MONTH_WIDTH, top: 0, bottom: 0, width: MONTH_WIDTH }} className="border-r border-border/20" />
                ))}

                {/* Today marker */}
                {todayIdx >= 0 && todayIdx < TOTAL_MONTHS && (
                  <div
                    style={{ position: "absolute", left: todayIdx * MONTH_WIDTH + MONTH_WIDTH / 2, top: 0, bottom: 0, width: 2 }}
                    className="bg-rose-500/70 z-10"
                  />
                )}

                {/* Item bars */}
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
                        position: "absolute",
                        left,
                        width: Math.min(width, (TOTAL_MONTHS - Math.max(0, startIdx)) * MONTH_WIDTH),
                        height: 22,
                        backgroundColor: barColor,
                        opacity,
                        borderRadius: 4,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 5,
                      }}
                      className="flex items-center px-1.5 overflow-hidden hover:opacity-100 hover:shadow-lg transition-all group"
                      title={`${item.initiative} (${item.effort})`}
                      onClick={() => onSelectItem(item)}
                    >
                      <span className="text-[9px] text-white font-semibold truncate">{item.initiative}</span>
                      {/* Gate diamond marker */}
                      <span
                        style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%) rotate(45deg)", width: 8, height: 8, background: barColor, border: "2px solid white", zIndex: 6 }}
                      />
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

  const getCommentCount = (item: RoadmapItem): number => {
    return (item as any).comments?.length || Math.floor(Math.random() * 5);
  };

  const getLinkedCount = (item: RoadmapItem): number => {
    try { return getLinkedItems?.(item.id)?.length || 0; } catch { return 0; }
  };

  const getCompletion = (item: RoadmapItem): number => {
    return (item as any).completionPct || Math.floor(Math.random() * 80 + 10);
  };

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
              const { initials: ownerInitials, color: ownerColor } = getMemberInitials(item.owner);
              return (
                <button
                  key={item.id}
                  data-testid={`kanban-item-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className="w-full text-left p-2.5 bg-card border border-border rounded-lg hover:border-primary transition-colors group"
                >
                  {/* Top: priority dot + name */}
                  <div className="flex items-start gap-1.5 mb-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${priorityColors[priority] || "bg-slate-400"}`} title={priority} />
                    <p className="text-[11px] font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors flex-1">{item.initiative}</p>
                  </div>
                  {/* Badges */}
                  <div className="flex gap-1 flex-wrap mb-1.5">
                    <Badge className={`text-[9px] px-1 py-0 ${brandColors[item.brand]}`}>{item.brand === "RECORD" ? "REC" : "AA"}</Badge>
                    <Badge className={`text-[9px] px-1 py-0 ${impactColors[item.impact]}`}>{item.impact}</Badge>
                    <span className={`text-[9px] font-mono font-bold px-1 py-0 rounded ${gateProgressColors[item.gateStage]} text-white`}>{gateShortName[item.gateStage]}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${completion}%` }} />
                  </div>
                  {/* Footer: avatar + stats */}
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-4 h-4 ${ownerColor} rounded-full flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0`}>
                      {ownerInitials}
                    </div>
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
                <td className="py-2.5 px-3 font-medium max-w-[200px]">
                  <p className="truncate">{item.initiative}</p>
                </td>
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

  const members = getTeamMembers();

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

          <div className="flex gap-2">
            <Button data-testid="btn-go" onClick={() => handleGoNoGo("go")} className={`flex-1 ${allRequiredMet ? "bg-teal-600 hover:bg-teal-700 text-white" : "opacity-50"}`} size="sm">GO ↑</Button>
            <Button data-testid="btn-no-go" variant="outline" onClick={() => handleGoNoGo("no-go")} className="flex-1 border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30" size="sm">NO-GO</Button>
          </div>

          {/* Gate History */}
          {history.length > 0 && (
            <Card className="border border-border">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Gate History</p>
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${h.decision.includes("GO") && !h.decision.includes("NO") ? "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300" : "bg-rose-100 text-rose-700"}`}>{h.gate}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{h.decision}</p>
                        <p className="text-[10px] text-muted-foreground">{h.date} · {h.reviewer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Criteria + Stakeholders */}
        <div className="md:col-span-3 space-y-4">
          {/* Required Criteria */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Required Criteria</p>
            <div className="space-y-2">
              {required.map(c => (
                <div key={c.id} data-testid={`criterion-${c.id}`} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${checkState[c.id] ? "bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900" : "bg-card border-border"}`}>
                  <Checkbox id={c.id} checked={!!checkState[c.id]} onCheckedChange={v => setCheckState(prev => ({ ...prev, [c.id]: !!v }))} className="mt-0.5" />
                  <div className="min-w-0">
                    <Label htmlFor={c.id} className="text-sm font-medium cursor-pointer">{c.criterion}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.description}</p>
                    <div className="flex gap-2 mt-1.5">
                      <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">Owner: {c.responsible}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Criteria */}
          {optional.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Optional / Recommended</p>
              <div className="space-y-2">
                {optional.map(c => (
                  <div key={c.id} data-testid={`criterion-opt-${c.id}`} className={`flex items-start gap-3 p-3 rounded-lg border border-dashed transition-colors ${checkState[c.id] ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900" : "bg-card/50 border-border"}`}>
                    <Checkbox id={c.id} checked={!!checkState[c.id]} onCheckedChange={v => setCheckState(prev => ({ ...prev, [c.id]: !!v }))} className="mt-0.5" />
                    <div className="min-w-0">
                      <Label htmlFor={c.id} className="text-sm font-medium cursor-pointer text-muted-foreground">{c.criterion}</Label>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stakeholder Sign-offs */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Stakeholder Sign-offs</p>
            <div className="space-y-2">
              {stageApprovers.map(approver => (
                <div key={approver.role} data-testid={`approver-${approver.role}`} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${approvals[approver.role]?.checked ? "bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900" : "bg-card border-border"}`}>
                  <Checkbox
                    id={`approver-${approver.role}`}
                    checked={!!approvals[approver.role]?.checked}
                    onCheckedChange={v => setApprovals(prev => ({
                      ...prev,
                      [approver.role]: { checked: !!v, date: !!v ? new Date().toLocaleDateString() : "" },
                    }))}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{approver.name}</p>
                    <p className="text-[10px] text-muted-foreground">{approver.role}{approver.required ? " · required" : " · optional"}</p>
                  </div>
                  {approvals[approver.role]?.checked && (
                    <span className="text-[10px] text-teal-600 dark:text-teal-400">Signed {approvals[approver.role].date}</span>
                  )}
                  {!approvals[approver.role]?.checked && approver.required && (
                    <Badge className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">Required</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── HANDOFFS TAB ──────────────────────────────────────────────────────────

const recentHandoffs = [
  { from: "PM", to: "Engineering", initiative: "SW300-S App Configuration", date: "Mar 15, 2025", template: "Concept to Engineering" },
  { from: "Engineering", to: "Manufacturing", initiative: "VersaMax FGI Compliance Update", date: "Mar 8, 2025", template: "Engineering to Manufacturing" },
  { from: "QA", to: "Launch", initiative: "ecoLOGIC OTA Phase 1", date: "Feb 28, 2025", template: "QA to Launch" },
];

function HandoffsTab({ allItems }: { allItems: RoadmapItem[] }) {
  const [selectedType, setSelectedType] = useState<HandoffType>("concept_to_engineering");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [checkState, setCheckState] = useState<Record<string, boolean>>({});
  const [templateStatus, setTemplateStatus] = useState<Record<HandoffType, "not_started" | "in_progress" | "completed">>(
    Object.fromEntries(handoffTemplates.map(t => [t.type, "not_started"])) as Record<HandoffType, "not_started" | "in_progress" | "completed">
  );
  const { toast } = useToast();

  const template = handoffTemplates.find(t => t.type === selectedType)!;
  const checkedCount = template.checklist.filter((_, i) => checkState[`check-${i}`]).length;
  const checkPct = Math.round(checkedCount / template.checklist.length * 100);

  // Detect if form is being filled
  useEffect(() => {
    const hasValues = Object.values(formValues).some(v => v.trim().length > 0);
    const hasChecks = Object.values(checkState).some(v => v);
    if (hasValues || hasChecks) {
      const isComplete = checkPct === 100;
      setTemplateStatus(prev => ({ ...prev, [selectedType]: isComplete ? "completed" : "in_progress" }));
    }
  }, [formValues, checkState, checkPct, selectedType]);

  const handleCopy = () => {
    const lines: string[] = [
      `HANDOFF: ${template.title}`,
      `From: ${template.from}  →  To: ${template.to}`,
      `Purpose: ${template.purpose}`,
      "",
      "--- FIELD VALUES ---",
      ...template.fields.map(f => `${f.label}: ${formValues[f.id] || "(empty)"}`),
      "",
      "--- CHECKLIST ---",
      ...template.checklist.map((c, i) => `${checkState[`check-${i}`] ? "[x]" : "[ ]"} ${c}`),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    toast({ title: "Handoff document copied", description: "Paste into email, Confluence, or your project tracker." });
  };

  const handleReset = () => {
    setFormValues({});
    setCheckState({});
  };

  const handleSendEmail = () => {
    toast({ title: "Coming Soon", description: "Email sending will be available in the next release." });
  };

  const statusBadge: Record<"not_started" | "in_progress" | "completed", string> = {
    not_started: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    completed: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  };

  return (
    <PageWrap>
      <SectionTitle sub="Full NPD handoff suite — fill in, check off, copy to clipboard or email">Handoff Templates</SectionTitle>

      {/* Template Status Tracker */}
      <div className="mb-5 p-4 bg-card border border-border rounded-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Template Status Tracker</p>
        <div className="flex flex-wrap gap-2">
          {handoffTemplates.map(t => {
            const status = templateStatus[t.type] || "not_started";
            return (
              <button
                key={t.type}
                data-testid={`handoff-status-${t.type}`}
                onClick={() => { setSelectedType(t.type); setFormValues({}); setCheckState({}); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${selectedType === t.type ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
              >
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${statusBadge[status]}`}>
                  {status.replace("_", " ")}
                </span>
                {t.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Handoffs */}
      <div className="mb-5 p-4 bg-card border border-border rounded-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent Handoffs</p>
        <div className="space-y-2">
          {recentHandoffs.map((h, i) => (
            <div key={i} className="flex items-center gap-3 text-xs p-2.5 bg-secondary rounded-lg">
              <span className="text-muted-foreground">{h.from} → {h.to}</span>
              <Separator orientation="vertical" className="h-3" />
              <span className="font-medium text-foreground flex-1 truncate">{h.initiative}</span>
              <span className="text-muted-foreground flex-shrink-0">{h.date}</span>
              <Badge variant="outline" className="text-[10px] flex-shrink-0">{h.template}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Template Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {handoffTemplates.map(t => (
          <button
            key={t.type}
            data-testid={`handoff-select-${t.type}`}
            onClick={() => { setSelectedType(t.type); setFormValues({}); setCheckState({}); }}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${selectedType === t.type ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Form */}
        <div>
          <div className="mb-4 p-4 bg-secondary rounded-xl">
            <p className="text-sm font-bold">{template.title}</p>
            <p className="text-xs text-muted-foreground">{template.from} → {template.to}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">{template.purpose}</p>
          </div>

          <div className="space-y-4">
            {template.fields.map(field => (
              <div key={field.id}>
                <Label className="text-xs font-medium text-foreground flex items-center gap-1 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-rose-500">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea data-testid={`field-${field.id}`} placeholder={field.placeholder} value={formValues[field.id] || ""} onChange={e => setFormValues(p => ({ ...p, [field.id]: e.target.value }))} className="text-xs min-h-[80px]" />
                ) : field.type === "select" ? (
                  <Select value={formValues[field.id] || ""} onValueChange={v => setFormValues(p => ({ ...p, [field.id]: v }))}>
                    <SelectTrigger data-testid={`field-${field.id}`} className="text-xs"><SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} /></SelectTrigger>
                    <SelectContent>{field.options?.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent>
                  </Select>
                ) : field.type === "number" ? (
                  <Input data-testid={`field-${field.id}`} type="number" placeholder={field.placeholder} value={formValues[field.id] || ""} onChange={e => setFormValues(p => ({ ...p, [field.id]: e.target.value }))} className="text-xs" />
                ) : field.type === "date" ? (
                  <Input data-testid={`field-${field.id}`} type="date" value={formValues[field.id] || ""} onChange={e => setFormValues(p => ({ ...p, [field.id]: e.target.value }))} className="text-xs" />
                ) : (
                  <Input data-testid={`field-${field.id}`} placeholder={field.placeholder} value={formValues[field.id] || ""} onChange={e => setFormValues(p => ({ ...p, [field.id]: e.target.value }))} className="text-xs" />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-5 flex-wrap">
            <Button data-testid="btn-copy-handoff" onClick={handleCopy} className="flex-1 text-xs">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copy Handoff Doc
            </Button>
            <Button data-testid="btn-send-email-handoff" variant="outline" onClick={handleSendEmail} className="text-xs gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              Send via Email
            </Button>
            <Button data-testid="btn-reset-handoff" variant="outline" onClick={handleReset} className="text-xs">Reset</Button>
          </div>
        </div>

        {/* Right: Checklist */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Handoff Checklist</p>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${checkPct === 100 ? "bg-teal-500" : "bg-primary"}`} style={{ width: `${checkPct}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{checkedCount}/{template.checklist.length}</span>
            </div>
          </div>
          <div className="space-y-2">
            {template.checklist.map((item, i) => (
              <div key={i} data-testid={`checklist-item-${i}`} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${checkState[`check-${i}`] ? "bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900" : "bg-card border-border"}`}>
                <Checkbox id={`check-${i}`} checked={!!checkState[`check-${i}`]} onCheckedChange={v => setCheckState(p => ({ ...p, [`check-${i}`]: !!v }))} className="mt-0.5" />
                <Label htmlFor={`check-${i}`} className="text-xs leading-relaxed cursor-pointer">{item}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── VOC MODAL ─────────────────────────────────────────────────────────────

function AddVocModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (e: typeof vocEntries[0]) => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ quote: "", insight: "", source: "distributor", vertical: "Healthcare", region: "National", type: "pain_point", priority: "medium", contact: "" });
  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (!form.quote.trim() || !form.contact.trim()) {
      toast({ title: "Required fields missing", description: "Quote and contact are required.", variant: "destructive" });
      return;
    }
    onAdd({
      id: `voc-new-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      source: form.source as any,
      contact: form.contact,
      vertical: form.vertical as Vertical,
      region: form.region as any,
      type: form.type as any,
      quote: form.quote,
      insight: form.insight || "Needs PM analysis",
      priority: form.priority as any,
      actionable: true,
      tags: [],
    });
    toast({ title: "VOC entry added" });
    onClose();
  };

  if (!open) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} className="bg-card border border-border rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()} data-testid="add-voc-modal">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold">Add VOC Entry</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground" data-testid="close-voc-modal">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Contact / Company <span className="text-rose-500">*</span></Label>
              <Input data-testid="voc-contact" value={form.contact} onChange={e => set("contact", e.target.value)} placeholder="e.g. J. Smith, ABC Distributors" className="text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Source</Label>
                <Select value={form.source} onValueChange={v => set("source", v)}>
                  <SelectTrigger className="text-xs" data-testid="voc-source"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["distributor", "architect", "end_user", "field_tech", "sales", "installer"].map(s => (
                      <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Type</Label>
                <Select value={form.type} onValueChange={v => set("type", v)}>
                  <SelectTrigger className="text-xs" data-testid="voc-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[["pain_point", "Pain Point"], ["feature_request", "Feature Request"], ["competitive_intelligence", "Competitive Intel"], ["compliance_concern", "Compliance"], ["pricing_feedback", "Pricing"]].map(([k, l]) => (
                      <SelectItem key={k} value={k}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Vertical</Label>
                <Select value={form.vertical} onValueChange={v => set("vertical", v)}>
                  <SelectTrigger className="text-xs" data-testid="voc-vertical"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Healthcare", "Retail", "Airport/Transit", "Education", "Hospitality", "Multi-Family", "Office/Commercial", "Government"].map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Priority</Label>
                <Select value={form.priority} onValueChange={v => set("priority", v)}>
                  <SelectTrigger className="text-xs" data-testid="voc-priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Quote <span className="text-rose-500">*</span></Label>
              <Textarea data-testid="voc-quote" value={form.quote} onChange={e => set("quote", e.target.value)} placeholder="Direct quote from the customer..." className="text-xs min-h-[60px]" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">PM Insight</Label>
              <Textarea data-testid="voc-insight" value={form.insight} onChange={e => set("insight", e.target.value)} placeholder="What does this mean for the roadmap?" className="text-xs min-h-[60px]" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button data-testid="submit-voc" onClick={handleSubmit} className="flex-1 text-xs">Add Entry</Button>
            <Button variant="outline" onClick={onClose} className="text-xs" data-testid="cancel-voc">Cancel</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── VOC TAB ───────────────────────────────────────────────────────────────

function VocTab() {
  const [filterSource, setFilterSource] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterVertical, setFilterVertical] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selected, setSelected] = useState<typeof vocEntries[0] | null>(null);
  const [localEntries, setLocalEntries] = useState<typeof vocEntries>([...vocEntries]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return localEntries.filter(e => {
      if (filterSource !== "all" && e.source !== filterSource) return false;
      if (filterType !== "all" && e.type !== filterType) return false;
      if (filterVertical !== "all" && e.vertical !== filterVertical) return false;
      if (filterPriority !== "all" && e.priority !== filterPriority) return false;
      return true;
    });
  }, [localEntries, filterSource, filterType, filterVertical, filterPriority]);

  const typeCounts = useMemo(() => {
    const map: Record<string, number> = {};
    localEntries.forEach(e => { map[e.type] = (map[e.type] || 0) + 1; });
    return map;
  }, [localEntries]);

  const verticalCounts = useMemo(() => {
    const map: Record<string, number> = {};
    localEntries.forEach(e => { map[e.vertical] = (map[e.vertical] || 0) + 1; });
    return map;
  }, [localEntries]);

  const stateHeatmap: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    localEntries.forEach(e => { map[e.region] = (map[e.region] || 0) + 1; });
    return map;
  }, [localEntries]);

  const sourceChartData = ["distributor", "architect", "end_user", "field_tech", "sales", "installer"].map(s => ({
    name: s.replace("_", " "),
    count: localEntries.filter(e => e.source === s).length,
  }));

  const priorityColorsBorder: Record<string, string> = {
    critical: "border-l-rose-500 bg-rose-50/50 dark:bg-rose-950/10",
    high: "border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/10",
    medium: "border-l-sky-400 bg-sky-50/50 dark:bg-sky-950/10",
    low: "border-l-slate-300 bg-slate-50/50 dark:bg-slate-950/10",
  };

  const typeLabel: Record<string, string> = {
    pain_point: "Pain Point", feature_request: "Feature Request", competitive_intelligence: "Competitive Intel",
    compliance_concern: "Compliance", pricing_feedback: "Pricing",
  };

  const typeColors: Record<string, string> = {
    pain_point: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    feature_request: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    competitive_intelligence: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    compliance_concern: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    pricing_feedback: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };

  const allVerticals = Array.from(new Set(localEntries.map(e => e.vertical))).sort();

  const handleExport = () => {
    const header = ["ID", "Date", "Source", "Contact", "Vertical", "Region", "Type", "Priority", "Quote", "Insight", "Actionable"];
    const rows = filtered.map(e => [e.id, e.date, e.source, `"${e.contact}"`, e.vertical, e.region, e.type, e.priority, `"${e.quote.replace(/"/g, "'")}"`, `"${e.insight.replace(/"/g, "'")}"`, e.actionable]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pm-studio-voc.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "VOC data exported" });
  };

  const regionRows = [
    { region: "National", label: "National" },
    { region: "Northeast", label: "Northeast" },
    { region: "Southeast", label: "Southeast" },
    { region: "Midwest", label: "Midwest" },
    { region: "Southwest", label: "Southwest" },
    { region: "West", label: "West" },
    { region: "Canada", label: "Canada" },
  ];

  const maxRegionCount = Math.max(...Object.values(stateHeatmap), 1);

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <SectionTitle sub="Structured customer intelligence from distributors, AORs, facility managers, and field technicians">Voice of Customer</SectionTitle>
        <div className="flex gap-2">
          <Button data-testid="btn-add-voc" size="sm" onClick={() => setAddModalOpen(true)} className="text-xs gap-1.5">+ Add VOC Entry</Button>
          <Button data-testid="btn-export-voc" size="sm" variant="outline" onClick={handleExport} className="text-xs gap-1.5">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export
          </Button>
        </div>
      </div>

      {/* VOC Heatmap — Region Grid */}
      <div className="mb-5 p-4 bg-card border border-border rounded-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">VOC Density by Region</p>
        <div className="flex flex-wrap gap-2">
          {regionRows.map(({ region, label }) => {
            const count = stateHeatmap[region] || 0;
            const intensity = count / maxRegionCount;
            const bg = intensity > 0.75 ? "bg-teal-500" : intensity > 0.5 ? "bg-teal-400" : intensity > 0.25 ? "bg-teal-300" : intensity > 0 ? "bg-teal-200" : "bg-secondary";
            const textColor = intensity > 0.5 ? "text-white" : intensity > 0 ? "text-teal-800 dark:text-teal-200" : "text-muted-foreground";
            return (
              <div key={region} data-testid={`voc-region-${region}`} className={`${bg} ${textColor} rounded-lg px-4 py-3 text-center min-w-[90px] transition-all`}>
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-[10px] opacity-75">entries</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Filters + Cards */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-36 h-8 text-xs" data-testid="voc-filter-source"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {["distributor", "architect", "end_user", "field_tech", "sales", "installer"].map(s => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-44 h-8 text-xs" data-testid="voc-filter-type"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(typeLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterVertical} onValueChange={setFilterVertical}>
              <SelectTrigger className="w-40 h-8 text-xs" data-testid="voc-filter-vertical"><SelectValue placeholder="Vertical" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verticals</SelectItem>
                {allVerticals.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32 h-8 text-xs" data-testid="voc-filter-priority"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[520px] pr-2">
            <div className="space-y-3">
              {filtered.map(entry => (
                <button
                  key={entry.id}
                  data-testid={`voc-entry-${entry.id}`}
                  onClick={() => setSelected(entry)}
                  className={`w-full text-left p-4 rounded-xl border-l-4 border border-border transition-all hover:shadow-sm ${priorityColorsBorder[entry.priority]}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge className={`text-[10px] ${typeColors[entry.type]}`}>{typeLabel[entry.type]}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{entry.vertical}</Badge>
                        <span className="text-[10px] text-muted-foreground">{entry.source.replace("_", " ")} · {entry.region}</span>
                        {entry.actionable && <span className="text-[10px] bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 px-1.5 rounded">actionable</span>}
                      </div>
                      <p className="text-sm italic text-foreground leading-relaxed line-clamp-2">"{entry.quote}"</p>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{entry.insight}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded flex-shrink-0 ${impactColors[entry.priority]}`}>{entry.priority}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Charts */}
        <div className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">By Source</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={sourceChartData} layout="vertical" margin={{ top: 0, right: 10, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
                  <Bar dataKey="count" fill="hsl(186 80% 38%)" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">By Type</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{typeLabel[type]}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(count / localEntries.length) * 100}%` }} />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">By Vertical</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {Object.entries(verticalCounts).sort(([, a], [, b]) => b - a).map(([v, count]) => (
                  <div key={v} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate">{v}</span>
                    <span className="text-xs font-mono text-muted-foreground ml-2">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* VOC Detail Sheet */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="absolute right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className={`text-xs mb-2 ${typeColors[selected.type]}`}>{typeLabel[selected.type]}</Badge>
                    <p className="text-xs text-muted-foreground">{selected.source.replace("_", " ")} · {selected.company || "Anonymous"} · {selected.date}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground" data-testid="close-voc">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
                <blockquote className="text-base italic text-foreground leading-relaxed mb-4 border-l-4 border-primary pl-4">"{selected.quote}"</blockquote>
                <div className="p-3 bg-secondary rounded-lg mb-4">
                  <p className="text-xs font-semibold mb-1">PM Insight</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selected.insight}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div><p className="text-muted-foreground">Vertical</p><p className="font-medium">{selected.vertical}</p></div>
                  <div><p className="text-muted-foreground">Region</p><p className="font-medium">{selected.region}</p></div>
                  <div><p className="text-muted-foreground">Priority</p><p className="font-medium">{selected.priority}</p></div>
                  <div><p className="text-muted-foreground">Product Line</p><p className="font-medium">{selected.productLine || "General"}</p></div>
                </div>
                {selected.linkedInitiative && (
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 rounded-lg">
                    <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 mb-1">Linked Roadmap Initiative</p>
                    <p className="text-xs text-teal-600 dark:text-teal-400">{roadmapItems.find(r => r.id === selected.linkedInitiative)?.initiative || selected.linkedInitiative}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addModalOpen && <AddVocModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={e => setLocalEntries(prev => [e, ...prev])} />}
      </AnimatePresence>
    </PageWrap>
  );
}

// ─── CAPACITY TAB ──────────────────────────────────────────────────────────

function CapacityTab() {
  const deptColors: Record<string, string> = {
    "PM": "bg-teal-500",
    "Engineering": "bg-indigo-500",
    "QA/Regulatory": "bg-amber-500",
    "Marketing": "bg-violet-500",
    "Sales Enablement": "bg-sky-500",
    "Manufacturing": "bg-orange-500",
    "UX/Design": "bg-pink-500",
  };

  const deptSummary = useMemo(() => {
    const map: Record<string, { total: number; used: number; count: number }> = {};
    resourceData.forEach(r => {
      if (!map[r.department]) map[r.department] = { total: 0, used: 0, count: 0 };
      const used = r.allocations.reduce((sum, a) => sum + a.percent, 0);
      map[r.department].total += 100;
      map[r.department].used += used;
      map[r.department].count += 1;
    });
    return Object.entries(map).map(([dept, d]) => ({
      dept,
      utilization: Math.round(d.used / d.total * 100),
      headcount: d.count,
    }));
  }, []);

  const radarData = deptSummary.map(d => ({
    subject: d.dept.split("/")[0],
    utilization: d.utilization,
  }));

  const overloaded = resourceData.filter(r => r.allocations.reduce((s, a) => s + a.percent, 0) > 95);

  return (
    <PageWrap>
      <SectionTitle sub="Team bandwidth and initiative allocation by person and department">Resource Capacity</SectionTitle>

      {/* Overload warning */}
      {overloaded.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-3" data-testid="overload-banner">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <div>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Overloaded Team Members</p>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">{overloaded.map(p => p.name).join(", ")} — allocated over 95%. Action required.</p>
          </div>
        </motion.div>
      )}

      {/* Dept Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {deptSummary.map(d => (
          <div key={d.dept} className="p-4 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${deptColors[d.dept] || "bg-slate-400"}`} />
              <p className="text-xs font-medium truncate">{d.dept}</p>
            </div>
            <p className={`text-2xl font-bold ${d.utilization > 90 ? "text-rose-500" : d.utilization > 75 ? "text-amber-500" : "text-teal-500"}`}>{d.utilization}%</p>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-1.5">
              <div className={`h-1.5 rounded-full ${d.utilization > 90 ? "bg-rose-500" : d.utilization > 75 ? "bg-amber-500" : "bg-teal-500"}`} style={{ width: `${Math.min(d.utilization, 100)}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{d.headcount} headcount</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Department Utilization (%)</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptSummary} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="dept" type="category" tick={{ fontSize: 10 }} width={80} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={v => [`${v}%`]} />
                <Bar dataKey="utilization" radius={[0, 4, 4, 0]}>
                  {deptSummary.map((d, i) => <Cell key={i} fill={d.utilization > 90 ? "#f43f5e" : d.utilization > 75 ? "#f59e0b" : "#14b8a6"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Capacity Radar</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                <Radar name="Utilization" dataKey="utilization" stroke="hsl(186 80% 38%)" fill="hsl(186 80% 38%)" fillOpacity={0.25} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} formatter={v => [`${v}%`]} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sprint Planning View */}
      <Card className="border border-border mb-5">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold">Current Sprint — 2-Week Grid</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Person</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Tasks This Sprint</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Load</th>
                  <th className="py-2 px-3 text-muted-foreground font-semibold text-right">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {sprintData.map((s, i) => {
                  const isOverloaded = s.pct > 95;
                  return (
                    <tr key={i} data-testid={`sprint-row-${i}`} className={`border-b border-border/50 ${isOverloaded ? "bg-rose-50/50 dark:bg-rose-950/10" : ""}`}>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={s.person} size="xs" />
                          <span className="font-medium">{s.person}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex gap-1 flex-wrap">
                          {s.tasks.map((t, ti) => (
                            <Badge key={ti} variant="secondary" className="text-[9px]">{t}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isOverloaded ? "bg-rose-500" : s.pct > 75 ? "bg-amber-500" : "bg-teal-500"}`} style={{ width: `${Math.min(s.pct, 100)}%` }} />
                          </div>
                          <span className={`font-mono text-[10px] ${isOverloaded ? "text-rose-500 font-bold" : "text-muted-foreground"}`}>{s.pct}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`text-[10px] font-medium ${isOverloaded ? "text-rose-500" : "text-teal-600 dark:text-teal-400"}`}>
                          {isOverloaded ? "OVER" : `${100 - s.pct}% free`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Gantt-style resource timeline */}
      <Card className="border border-border mb-5">
        <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-sm font-semibold">Resource Timeline — Q2 2025 (CSS Gantt)</CardTitle></CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-2">
            {sprintData.map((person, i) => (
              <div key={i} className="flex items-center gap-3" data-testid={`gantt-row-${i}`}>
                <div className="w-24 text-[10px] font-medium text-muted-foreground flex-shrink-0 truncate">{person.person}</div>
                <div className="flex-1 relative h-6 bg-secondary rounded-md overflow-hidden">
                  {person.tasks.map((task, ti) => {
                    const segW = Math.floor(person.pct / person.tasks.length);
                    const colors = ["bg-teal-500", "bg-indigo-500", "bg-violet-500", "bg-amber-500"];
                    return (
                      <div
                        key={ti}
                        style={{ left: `${ti * segW}%`, width: `${segW}%` }}
                        className={`absolute top-0 h-full ${colors[ti % colors.length]} opacity-80 flex items-center px-1.5`}
                        title={task}
                      >
                        <span className="text-[9px] text-white font-medium truncate">{task}</span>
                      </div>
                    );
                  })}
                </div>
                <span className="text-[10px] text-muted-foreground w-10 text-right flex-shrink-0">{person.pct}%</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1"><span className="w-3 h-2 bg-teal-500 inline-block rounded" /> Task 1</div>
            <div className="flex items-center gap-1"><span className="w-3 h-2 bg-indigo-500 inline-block rounded" /> Task 2</div>
            <div className="flex items-center gap-1"><span className="w-3 h-2 bg-violet-500 inline-block rounded" /> Task 3</div>
            <div className="flex items-center gap-1"><span className="w-3 h-2 bg-amber-500 inline-block rounded" /> Task 4</div>
          </div>
        </CardContent>
      </Card>

      {/* Person-Level Allocation */}
      <div className="space-y-4">
        <p className="text-sm font-semibold">Individual Allocations</p>
        {resourceData.map(person => {
          const totalAlloc = person.allocations.reduce((sum, a) => sum + a.percent, 0);
          const available = 100 - totalAlloc;
          const capacityClass = available < 0 ? "text-rose-500" : available < 15 ? "text-amber-500" : "text-teal-500";
          return (
            <div key={person.id} className="p-4 bg-card border border-border rounded-xl" data-testid={`allocation-${person.id}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Avatar name={person.name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.department} · {person.role}</p>
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

// ─── STATE MARKET MAP DATA ─────────────────────────────────────────────────

const STATIC_STATE_DATA: StateMarketData[] = [
  { state: "Alabama", region: "Southeast", buildingCode: "IBC 2021", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Retail", "Government"], hvhz: false, annualConstructionVolume: 14.2, notes: "Growing healthcare construction. Huntsville/Birmingham metro driving growth." },
  { state: "Alaska", region: "West", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Government", "Healthcare"], hvhz: false, annualConstructionVolume: 2.1, notes: "Small market; government/military contracts primary channel." },
  { state: "Arizona", region: "Southwest", buildingCode: "IBC 2018", marketOpportunity: "high", keyVerticals: ["Healthcare", "Retail", "Office/Commercial"], hvhz: false, annualConstructionVolume: 31.6, notes: "Phoenix metro boom. Semiconductor fab and healthcare campus growth." },
  { state: "Arkansas", region: "Southwest", buildingCode: "IBC 2012", marketOpportunity: "low", keyVerticals: ["Retail", "Healthcare"], hvhz: false, annualConstructionVolume: 6.8, notes: "Older code cycle; limited high-value commercial development." },
  { state: "California", region: "West", buildingCode: "CBC 2022", marketOpportunity: "critical", keyVerticals: ["Healthcare", "Airport/Transit", "Office/Commercial", "Retail"], hvhz: false, annualConstructionVolume: 145.0, notes: "Largest US market. Title 24 energy compliance essential. Bay Area + LA major hubs." },
  { state: "Colorado", region: "West", buildingCode: "IBC 2021", marketOpportunity: "high", keyVerticals: ["Healthcare", "Office/Commercial", "Hospitality"], hvhz: false, annualConstructionVolume: 28.9, notes: "Denver metro growth. Tech campus and healthcare expansion." },
  { state: "Connecticut", region: "Northeast", buildingCode: "CT SBC 2022", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Education", "Government"], hvhz: false, annualConstructionVolume: 10.4, notes: "Dense institutional market. Yale/Hartford hospital networks significant." },
  { state: "Delaware", region: "Northeast", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Office/Commercial", "Healthcare"], hvhz: false, annualConstructionVolume: 3.9, notes: "Small state; corporate HQ driven. Limited large-scale construction." },
  { state: "Florida", region: "Southeast", buildingCode: "FBC 9th Ed.", marketOpportunity: "critical", keyVerticals: ["Healthcare", "Hospitality", "Retail"], hvhz: true, annualConstructionVolume: 52.4, notes: "HVHZ exposure; NOA required. Airport + hospital major growth sectors." },
  { state: "Georgia", region: "Southeast", buildingCode: "IBC 2018", marketOpportunity: "high", keyVerticals: ["Airport/Transit", "Healthcare", "Office/Commercial"], hvhz: false, annualConstructionVolume: 36.1, notes: "Atlanta Hartsfield-Jackson expansion. Major logistics + healthcare investment." },
  { state: "Hawaii", region: "West", buildingCode: "HBC 2021", marketOpportunity: "medium", keyVerticals: ["Hospitality", "Government", "Retail"], hvhz: true, annualConstructionVolume: 7.2, notes: "High wind exposure. Tourism-driven hospitality construction." },
  { state: "Idaho", region: "West", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Retail"], hvhz: false, annualConstructionVolume: 8.5, notes: "Boise growth market but small base. Tech migration driving office construction." },
  { state: "Illinois", region: "Midwest", buildingCode: "IBC 2021", marketOpportunity: "high", keyVerticals: ["Healthcare", "Airport/Transit", "Office/Commercial"], hvhz: false, annualConstructionVolume: 44.3, notes: "Chicago metro significant. O'Hare expansion and hospital network growth." },
  { state: "Indiana", region: "Midwest", buildingCode: "IBC 2021", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Manufacturing", "Retail"], hvhz: false, annualConstructionVolume: 18.7, notes: "Indianapolis healthcare hub. Life sciences manufacturing campus development." },
  { state: "Iowa", region: "Midwest", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Retail"], hvhz: false, annualConstructionVolume: 8.3, notes: "Steady but slow growth. Agriculture and healthcare primary sectors." },
  { state: "Kansas", region: "Midwest", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Retail", "Government"], hvhz: false, annualConstructionVolume: 7.9, notes: "Wichita aviation and healthcare primary drivers." },
  { state: "Kentucky", region: "Southeast", buildingCode: "IBC 2018", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Retail", "Manufacturing"], hvhz: false, annualConstructionVolume: 12.1, notes: "Louisville healthcare + Amazon logistics hub construction." },
  { state: "Louisiana", region: "Southeast", buildingCode: "IBC 2021", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Government", "Retail"], hvhz: true, annualConstructionVolume: 15.6, notes: "Gulf Coast HVHZ zones. Petrochemical industrial facilities significant." },
  { state: "Maine", region: "Northeast", buildingCode: "IBC 2021", marketOpportunity: "low", keyVerticals: ["Healthcare", "Hospitality"], hvhz: false, annualConstructionVolume: 4.1, notes: "Small market; tourism and healthcare primary." },
  { state: "Maryland", region: "Northeast", buildingCode: "IBC 2021", marketOpportunity: "high", keyVerticals: ["Healthcare", "Government", "Education"], hvhz: false, annualConstructionVolume: 22.8, notes: "Baltimore/DC corridor. NIH + federal campus growth. Hopkins healthcare system." },
  { state: "Massachusetts", region: "Northeast", buildingCode: "MA SBC 9th Ed.", marketOpportunity: "high", keyVerticals: ["Healthcare", "Education", "Office/Commercial"], hvhz: false, annualConstructionVolume: 34.2, notes: "Boston biotech corridor. Longwood Medical Area significant hospital construction." },
  { state: "Michigan", region: "Midwest", buildingCode: "IBC 2021", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Manufacturing", "Retail"], hvhz: false, annualConstructionVolume: 23.1, notes: "Detroit automotive + healthcare. Battery plant construction boom." },
  { state: "Minnesota", region: "Midwest", buildingCode: "MN SBC 2020", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Office/Commercial", "Retail"], hvhz: false, annualConstructionVolume: 21.4, notes: "Mayo Clinic ecosystem. Minneapolis healthcare network significant." },
  { state: "Mississippi", region: "Southeast", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Retail"], hvhz: false, annualConstructionVolume: 5.8, notes: "Limited large commercial development. Healthcare primary sector." },
  { state: "Missouri", region: "Midwest", buildingCode: "IBC 2018", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Retail", "Office/Commercial"], hvhz: false, annualConstructionVolume: 17.9, notes: "St. Louis and KC healthcare hubs. Gateway arch tourism adjacent." },
  { state: "Montana", region: "West", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Hospitality"], hvhz: false, annualConstructionVolume: 4.7, notes: "Small, slow-growth market. Remote location logistics challenges." },
  { state: "Nebraska", region: "Midwest", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Retail"], hvhz: false, annualConstructionVolume: 8.1, notes: "Omaha healthcare + financial services. Stable but limited growth." },
  { state: "Nevada", region: "West", buildingCode: "IBC 2018", marketOpportunity: "high", keyVerticals: ["Hospitality", "Retail", "Airport/Transit"], hvhz: false, annualConstructionVolume: 22.3, notes: "Las Vegas resort/casino construction. Harry Reid airport expansion. High automated door demand." },
  { state: "New Hampshire", region: "Northeast", buildingCode: "IBC 2015", marketOpportunity: "low", keyVerticals: ["Healthcare", "Retail"], hvhz: false, annualConstructionVolume: 5.2, notes: "Small market; no sales tax drives retail construction." },
  { state: "New Jersey", region: "Northeast", buildingCode: "NJ UCC 2021", marketOpportunity: "high", keyVerticals: ["Healthcare", "Office/Commercial", "Retail"], hvhz: false, annualConstructionVolume: 32.7, notes: "Pharma corridor Rt-1. Major hospital systems. NYC metro spillover." },
  { state: "New Mexico", region: "Southwest", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Government", "Healthcare"], hvhz: false, annualConstructionVolume: 6.4, notes: "Federal/military facilities. Limited commercial base." },
  { state: "New York", region: "Northeast", buildingCode: "NYC BC 2022", marketOpportunity: "critical", keyVerticals: ["Healthcare", "Office/Commercial", "Airport/Transit", "Retail"], hvhz: false, annualConstructionVolume: 98.4, notes: "NYC is the largest single metro. JFK/LGA/EWR expansion. Major hospital networks. High pedestrian door volume." },
  { state: "North Carolina", region: "Southeast", buildingCode: "NC BC 2018", marketOpportunity: "high", keyVerticals: ["Healthcare", "Office/Commercial", "Education"], hvhz: false, annualConstructionVolume: 38.9, notes: "Research Triangle healthcare and tech growth. Bank of America/Truist HQ construction." },
  { state: "North Dakota", region: "Midwest", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Government"], hvhz: false, annualConstructionVolume: 4.3, notes: "Oil-driven economy. Limited diversified commercial growth." },
  { state: "Ohio", region: "Midwest", buildingCode: "OBC 2021", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Manufacturing", "Retail"], hvhz: false, annualConstructionVolume: 30.8, notes: "Cleveland/Columbus/Cincinnati healthcare hubs. Intel semiconductor campus construction." },
  { state: "Oklahoma", region: "Southwest", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Government"], hvhz: false, annualConstructionVolume: 9.4, notes: "Energy sector-driven. Limited premium commercial development." },
  { state: "Oregon", region: "West", buildingCode: "ORS Ch.455 2021", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Office/Commercial", "Education"], hvhz: false, annualConstructionVolume: 16.8, notes: "Portland tech and healthcare. Nike/Adidas campus adjacency." },
  { state: "Pennsylvania", region: "Northeast", buildingCode: "PA UCC 2018", marketOpportunity: "high", keyVerticals: ["Healthcare", "Education", "Office/Commercial"], hvhz: false, annualConstructionVolume: 38.5, notes: "Philadelphia hospital corridor. Pittsburgh life sciences growth." },
  { state: "Rhode Island", region: "Northeast", buildingCode: "IBC 2021", marketOpportunity: "low", keyVerticals: ["Healthcare", "Education"], hvhz: false, annualConstructionVolume: 3.7, notes: "Small market; hospital and university primary drivers." },
  { state: "South Carolina", region: "Southeast", buildingCode: "IBC 2021", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Manufacturing", "Hospitality"], hvhz: true, annualConstructionVolume: 17.3, notes: "Coastal HVHZ exposure. BMW + Volvo manufacturing campus. Charleston port growth." },
  { state: "South Dakota", region: "Midwest", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Retail"], hvhz: false, annualConstructionVolume: 4.1, notes: "Small market; no state income tax attracts some financial services." },
  { state: "Tennessee", region: "Southeast", buildingCode: "IBC 2018", marketOpportunity: "high", keyVerticals: ["Healthcare", "Manufacturing", "Retail"], hvhz: false, annualConstructionVolume: 31.2, notes: "Nashville healthcare + entertainment growth. Ford EV plant construction." },
  { state: "Texas", region: "Southwest", buildingCode: "IBC 2021", marketOpportunity: "critical", keyVerticals: ["Healthcare", "Office/Commercial", "Retail", "Airport/Transit"], hvhz: false, annualConstructionVolume: 89.1, notes: "Largest non-CA market. Dallas-Ft Worth airport expansion. Houston medical center significant." },
  { state: "Utah", region: "West", buildingCode: "IBC 2021", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Office/Commercial", "Retail"], hvhz: false, annualConstructionVolume: 19.6, notes: "Salt Lake City tech hub. Goldman Sachs west coast HQ. Growing healthcare system." },
  { state: "Vermont", region: "Northeast", buildingCode: "IBC 2015", marketOpportunity: "low", keyVerticals: ["Healthcare", "Education"], hvhz: false, annualConstructionVolume: 2.9, notes: "Small market; university and hospital primary." },
  { state: "Virginia", region: "Northeast", buildingCode: "USBC 2021", marketOpportunity: "high", keyVerticals: ["Government", "Office/Commercial", "Healthcare"], hvhz: false, annualConstructionVolume: 35.6, notes: "Pentagon/Northern Virginia data center and federal campus. Amazon HQ2 construction." },
  { state: "Washington", region: "West", buildingCode: "WAC 51-50", marketOpportunity: "high", keyVerticals: ["Healthcare", "Office/Commercial", "Airport/Transit"], hvhz: false, annualConstructionVolume: 38.2, notes: "Seattle tech campus (Amazon/Microsoft/Boeing). SEA-TAC airport expansion." },
  { state: "West Virginia", region: "Southeast", buildingCode: "WV BC 2018", marketOpportunity: "low", keyVerticals: ["Healthcare", "Government"], hvhz: false, annualConstructionVolume: 4.0, notes: "Declining population; limited commercial opportunity." },
  { state: "Wisconsin", region: "Midwest", buildingCode: "SPS 361-366", marketOpportunity: "medium", keyVerticals: ["Healthcare", "Manufacturing", "Education"], hvhz: false, annualConstructionVolume: 18.4, notes: "Milwaukee/Madison healthcare. UW-Madison campus. Johnson Controls HQ adjacency." },
  { state: "Wyoming", region: "West", buildingCode: "IBC 2018", marketOpportunity: "low", keyVerticals: ["Government", "Healthcare"], hvhz: false, annualConstructionVolume: 2.5, notes: "Smallest commercial market. Energy sector primary." },
  { state: "DC", region: "Northeast", buildingCode: "DC BC 2021", marketOpportunity: "high", keyVerticals: ["Government", "Healthcare", "Office/Commercial"], hvhz: false, annualConstructionVolume: 11.2, notes: "Federal and embassy construction. World Bank/IMF campus. Hospital and university presence." },
];

// ─── INTELLIGENCE TAB ─────────────────────────────────────────────────────────

function IntelligenceTab() {
  const [activeSection, setActiveSection] = useState<"market" | "standards" | "competitive" | "interview" | "statemap">("market");
  const [stateSearch, setStateSearch] = useState("");
  const [stateRegion, setStateRegion] = useState("all");
  const [stateOpp, setStateOpp] = useState("all");
  const [stateHvhz, setStateHvhz] = useState("all");
  const [stateSortCol, setStateSortCol] = useState<"volume" | "opp" | "state">("volume");

  const sections = [
    { id: "market" as const, label: "Market Signals" },
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

  return (
    <PageWrap>
      <SectionTitle sub="Market signals, standards watch, competitive gaps, PM interview preparation, and state-by-state market map">PM Intelligence</SectionTitle>

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

      {/* Market Signals */}
      {activeSection === "market" && (
        <div className="space-y-4">
          {marketVerticals.sort((a, b) => b.growthRate - a.growthRate).map((v) => (
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
              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div className="p-2.5 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                  <p className="text-teal-700 dark:text-teal-300 font-semibold mb-0.5">Top Driver</p>
                  <p className="text-muted-foreground">{v.topDriver}</p>
                </div>
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                  <p className="text-rose-600 dark:text-rose-400 font-semibold mb-0.5">Top Risk</p>
                  <p className="text-muted-foreground">{v.topRisk}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Key Accounts</p>
                <div className="flex flex-wrap gap-1">
                  {v.keyAccounts.map((a) => <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>)}
                </div>
              </div>
            </div>
          ))}
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
            <div key={i} className="p-4 bg-card border border-border rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <p className="font-semibold text-foreground text-sm">{g.gap}</p>
                <Badge className={`text-[10px] flex-shrink-0 ml-2 ${g.priority === "critical" ? "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300" : g.priority === "high" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" : "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"}`}>{g.priority}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                  <p className="text-rose-600 dark:text-rose-400 font-semibold mb-0.5">Current State (ASSA ABLOY)</p>
                  <p className="text-muted-foreground">{g.ours}</p>
                </div>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <p className="text-amber-700 dark:text-amber-300 font-semibold mb-0.5">Market Context</p>
                  <p className="text-muted-foreground">{g.theirs}</p>
                </div>
              </div>
              {g.linkedInitiative && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-teal-600 dark:text-teal-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  Roadmap: {roadmapItems.find((r) => r.id === g.linkedInitiative)?.initiative}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Interview Prep */}
      {activeSection === "interview" && (
        <div className="space-y-4">
          {interviewInsights.map((item, i) => (
            <details key={i} className="group" data-testid={`interview-q-${i}`}>
              <summary className="flex items-center justify-between p-4 bg-card border border-border rounded-xl cursor-pointer hover:border-primary transition-colors list-none">
                <p className="text-sm font-medium pr-4">{item.question}</p>
                <span className="text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0 text-base">›</span>
              </summary>
              <div className="mx-1 p-4 bg-secondary border-x border-b border-border rounded-b-xl -mt-px">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      )}

      {/* State-by-State Market Map */}
      {activeSection === "statemap" && (
        <div>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {(["critical", "high", "medium", "low"] as const).map((opp) => {
              const count = STATIC_STATE_DATA.filter((s) => s.marketOpportunity === opp).length;
              const vol = STATIC_STATE_DATA.filter((s) => s.marketOpportunity === opp).reduce((sum, s) => sum + s.annualConstructionVolume, 0);
              return (
                <div key={opp} className={`p-3 rounded-xl border border-border ${oppRowBg[opp]}`}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{opp} opportunity</p>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">${vol.toFixed(0)}B annl. vol.</p>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Input
              data-testid="state-search"
              placeholder="Search state..."
              value={stateSearch}
              onChange={(e) => setStateSearch(e.target.value)}
              className="w-40 h-8 text-xs"
            />
            <Select value={stateRegion} onValueChange={setStateRegion}>
              <SelectTrigger className="w-36 h-8 text-xs" data-testid="state-filter-region">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {["Northeast", "Southeast", "Midwest", "Southwest", "West"].map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stateOpp} onValueChange={setStateOpp}>
              <SelectTrigger className="w-36 h-8 text-xs" data-testid="state-filter-opp">
                <SelectValue placeholder="Opportunity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Opportunity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateHvhz} onValueChange={setStateHvhz}>
              <SelectTrigger className="w-28 h-8 text-xs" data-testid="state-filter-hvhz">
                <SelectValue placeholder="HVHZ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All HVHZ</SelectItem>
                <SelectItem value="yes">HVHZ Yes</SelectItem>
                <SelectItem value="no">HVHZ No</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {(["volume", "opp", "state"] as const).map((col) => (
                <button
                  key={col}
                  data-testid={`state-sort-${col}`}
                  onClick={() => setStateSortCol(col)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded transition-colors ${stateSortCol === col ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {col === "volume" ? "Volume" : col === "opp" ? "Opportunity" : "A-Z"}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground self-center ml-1">{filteredStates.length} states/DC</span>
          </div>

          {/* Table */}
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
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${oppBadge[s.marketOpportunity]}`}>{s.marketOpportunity}</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1">
                        {s.keyVerticals.slice(0, 2).map((v) => (
                          <span key={v} className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">{v.split("/")[0]}</span>
                        ))}
                        {s.keyVerticals.length > 2 && <span className="text-[10px] text-muted-foreground">+{s.keyVerticals.length - 2}</span>}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      {s.hvhz
                        ? <span className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">YES</span>
                        : <span className="text-[10px] text-muted-foreground">—</span>
                      }
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-foreground">{s.annualConstructionVolume.toFixed(1)}</td>
                    <td className="py-2 px-3 text-muted-foreground max-w-xs">
                      <p className="truncate text-[11px] leading-relaxed">{s.notes}</p>
                    </td>
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function PMStudio() {
  const [activeTab, setActiveTab] = useState<TabId>("portfolio");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalItems, setGlobalItems] = useState<RoadmapItem[]>(roadmapItems);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNewInitiative, setShowNewInitiative] = useState(false);
  const [openDrawerFor, setOpenDrawerFor] = useState<RoadmapItem | null>(null);
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleDark = () => {
    setDarkMode((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
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
            <svg viewBox="0 0 36 36" className="w-7 h-7 text-primary" fill="none" aria-label="PM Studio Logo">
              <rect x="2" y="2" width="14" height="14" rx="2" fill="currentColor" opacity="0.9" />
              <rect x="20" y="2" width="14" height="14" rx="2" fill="currentColor" opacity="0.5" />
              <rect x="2" y="20" width="14" height="14" rx="2" fill="currentColor" opacity="0.5" />
              <rect x="20" y="20" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.7" />
            </svg>
            <div>
              <div className="text-sm font-semibold leading-none">
                PM Studio <span className="text-primary text-[10px] ml-1 font-bold align-top">3.0</span>
              </div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5">ASSA ABLOY + RECORD · NA Pedestrian</div>
            </div>
          </div>

          {/* Desktop Tab Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {tabList.map((tab) => (
              <button
                key={tab.id}
                data-testid={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
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
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
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
              className="lg:hidden border-t border-border bg-card/95 overflow-hidden"
            >
              <div className="flex flex-wrap gap-1 p-3">
                {tabList.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                  >
                    <span>{tab.icon}</span>{tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-14 min-h-screen" onClick={() => { setNotifOpen(false); setProfileOpen(false); }}>
        <AnimatePresence mode="wait">
          {activeTab === "portfolio" && (
            <PortfolioTab
              key="portfolio"
              allItems={globalItems}
              onNewInitiative={() => setShowNewInitiative(true)}
              onExport={handleExport}
            />
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
          {activeTab === "voc" && (
            <VocTab key="voc" />
          )}
          {activeTab === "capacity" && (
            <CapacityTab key="capacity" />
          )}
          {activeTab === "intelligence" && (
            <IntelligenceTab key="intelligence" />
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
    </div>
  );
}
