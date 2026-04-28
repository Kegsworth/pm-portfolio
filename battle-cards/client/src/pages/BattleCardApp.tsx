import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChevronDown,
  Sun,
  Moon,
  Shield,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Zap,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Eye,
  Printer,
  RotateCcw,
  Briefcase,
  Users,
  ClipboardList,
  Settings2,
  Handshake,
  Wind,
  Heart,
  Wifi,
  Search,
  Copy,
  Check,
  BarChart2,
  Layers,
  DollarSign,
  Activity,
  X,
  FileWarning,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getCard,
  getAvailableContexts,
  getAllCompetitors,
  CONTEXTS,
  CONTEXT_ORDER,
  COMPETITOR_ORDER,
  COMPETITORS,
  MARKET_SHARE_ESTIMATES,
  WIN_LOSS_BY_VERTICAL,
  PRICING_SIGNAL_MATRIX,
  PRICING_TIER_DATA,
  IOT_COMPARISON_DATA,
  type CompetitorId,
  type ContextId,
  type BattleCard,
  type Differentiator,
  type KeyProduct,
} from "@/lib/competitors";

// ── Theme hook ───────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );
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

// ── Advantage icon ───────────────────────────────────────────────────────────
function AdvantageIcon({ adv }: { adv: Differentiator["advantage"] }) {
  if (adv === "strong")
    return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
  if (adv === "moderate")
    return <CheckCircle2 className="w-4 h-4 text-primary shrink-0 opacity-70" />;
  if (adv === "neutral")
    return <MinusCircle className="w-4 h-4 text-muted-foreground shrink-0" />;
  return <Eye className="w-4 h-4 text-amber-500 shrink-0" />;
}

function advantageLabel(adv: Differentiator["advantage"]) {
  if (adv === "strong") return { label: "We win", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
  if (adv === "moderate") return { label: "Advantage", cls: "bg-primary/10 text-primary" };
  if (adv === "neutral") return { label: "Even", cls: "bg-muted text-muted-foreground" };
  return { label: "Watch", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
}

// ── Context icon map ─────────────────────────────────────────────────────────
function ContextIcon({ id, className }: { id: ContextId; className?: string }) {
  const cls = className ?? "w-4 h-4";
  if (id === "customer_pitch") return <Users className={cls} />;
  if (id === "procurement") return <ClipboardList className={cls} />;
  if (id === "engineering") return <Settings2 className={cls} />;
  if (id === "pm_interview") return <Briefcase className={cls} />;
  if (id === "distributor") return <Handshake className={cls} />;
  if (id === "florida_hvhz") return <Wind className={cls} />;
  if (id === "healthcare") return <Heart className={cls} />;
  if (id === "iot_smart_building") return <Wifi className={cls} />;
  return <Handshake className={cls} />;
}

// ── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-primary">{icon}</span>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
    </div>
  );
}

// ── Competitor selector pill ─────────────────────────────────────────────────
function CompPill({
  name,
  selected,
  onClick,
  testId,
}: {
  name: string;
  selected: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-accent"
      }`}
    >
      {name}
    </button>
  );
}

// ── Context tab ──────────────────────────────────────────────────────────────
function ContextTab({
  id,
  selected,
  available,
  onClick,
}: {
  id: ContextId;
  selected: boolean;
  available: boolean;
  onClick: () => void;
}) {
  const ctx = CONTEXTS[id];
  return (
    <button
      data-testid={`ctx-${id}`}
      onClick={onClick}
      disabled={!available}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border ${
        !available
          ? "opacity-30 cursor-not-allowed border-transparent text-muted-foreground"
          : selected
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-accent"
      }`}
    >
      <ContextIcon id={id} className="w-3.5 h-3.5" />
      <span>{ctx.label}</span>
    </button>
  );
}

// ── Collapsible section wrapper ───────────────────────────────────────────────
function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  count,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-accent/50 transition-colors"
        data-testid={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-primary">{icon}</span>
          <span className="font-semibold text-foreground text-sm">{title}</span>
          {count !== undefined && (
            <Badge variant="secondary" className="text-xs h-5 px-1.5">
              {count}
            </Badge>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Differentiator row ────────────────────────────────────────────────────────
function DiffRow({ d }: { d: Differentiator }) {
  const { label, cls } = advantageLabel(d.advantage);
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-start py-3 border-b border-border last:border-0">
      <div className="text-sm text-foreground">{d.ours}</div>
      <div className="flex flex-col items-center gap-1 min-w-[90px]">
        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${cls}`}>
          {label}
        </span>
        <AdvantageIcon adv={d.advantage} />
        <span className="text-[10px] text-muted-foreground text-center leading-tight">
          {d.dimension}
        </span>
      </div>
      <div className={`text-sm text-right ${d.advantage === "watch" ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}`}>
        {d.theirs}
      </div>
    </div>
  );
}

// ── Objection card ────────────────────────────────────────────────────────────
function ObjectionCard({
  objection,
  response,
  bridgeTo,
  index,
}: {
  objection: string;
  response: string;
  bridgeTo?: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-accent/40 transition-colors"
        data-testid={`objection-${index}`}
      >
        <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <span className="text-sm font-medium text-foreground flex-1">{objection}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 mt-0.5 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-2 border-t border-border">
              <p className="text-sm text-foreground pt-3 leading-relaxed">{response}</p>
              {bridgeTo && (
                <div className="flex items-center gap-2 mt-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-xs text-primary font-medium">Bridge to: {bridgeTo}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Landmine card ─────────────────────────────────────────────────────────────
function LandmineCard({
  topic,
  risk,
  mitigation,
}: {
  topic: string;
  risk: string;
  mitigation: string;
}) {
  return (
    <div className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{topic}</span>
      </div>
      <p className="text-xs text-amber-700/80 dark:text-amber-400/70 leading-relaxed">
        <span className="font-medium">Risk: </span>{risk}
      </p>
      <p className="text-xs text-amber-700/80 dark:text-amber-400/70 leading-relaxed">
        <span className="font-medium">Play: </span>{mitigation}
      </p>
    </div>
  );
}

// ── Win theme card ────────────────────────────────────────────────────────────
function WinThemeCard({
  title,
  detail,
  proof,
  index,
}: {
  title: string;
  detail: string;
  proof?: string;
  index: number;
}) {
  return (
    <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 space-y-2">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{title}</p>
          <p className="text-sm text-foreground leading-relaxed mt-1">{detail}</p>
          {proof && (
            <div className="flex items-center gap-1.5 mt-2">
              <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">{proof}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Talk track box ────────────────────────────────────────────────────────────
function TalkTrackBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-5 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Talk Track — say this
          </span>
        </div>
        <button
          onClick={copy}
          data-testid="btn-copy-talk-track"
          className="text-xs text-primary hover:text-primary/70 font-medium transition-colors px-2 py-1 rounded border border-primary/20 hover:border-primary/40"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-sm text-foreground leading-relaxed italic">{text}</p>
    </div>
  );
}

// ── Win/Lose signals ─────────────────────────────────────────────────────────
function SignalsRow({ winSignals, loseSignals, keyMetrics }: { winSignals: string[]; loseSignals: string[]; keyMetrics: string[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Win signals */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Win Signals
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">You are winning this deal if you see...</p>
        <ul className="space-y-2">
          {winSignals.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-foreground">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
              {s}
            </li>
          ))}
        </ul>
      </div>
      {/* Lose signals */}
      <div className="rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50/50 dark:bg-rose-900/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            Lose Signals
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">Walk away or defend if you see...</p>
        <ul className="space-y-2">
          {loseSignals.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-foreground">
              <XCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
              {s}
            </li>
          ))}
        </ul>
      </div>
      {/* Key metrics */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Key Metrics
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">Cite these numbers in the conversation</p>
        <ul className="space-y-2">
          {keyMetrics.map((m, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-foreground">
              <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Closing move box ──────────────────────────────────────────────────────────
function ClosingMoveBox({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
      <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Closing Move
        </p>
        <p className="text-sm text-foreground">{text}</p>
      </div>
    </div>
  );
}

// ── Deal Economics Data ─────────────────────────────────────────────────────────────
const DEAL_ECONOMICS: Record<string, {
  compAvgDeal: number;
  ourWinRate: number;
  pricePremium: string;
  marginAtRisk: string;
  breakEven: string;
}> = {
  dormakaba:  { compAvgDeal: 24200, ourWinRate: 48, pricePremium: "+12-18%", marginAtRisk: "~3.2 GM pts", breakEven: "Max 14% off list" },
  allegion:   { compAvgDeal: 31000, ourWinRate: 44, pricePremium: "+8-14%",  marginAtRisk: "~2.8 GM pts", breakEven: "Max 11% off list" },
  geze:       { compAvgDeal: 22800, ourWinRate: 67, pricePremium: "+15-22%", marginAtRisk: "~3.5 GM pts", breakEven: "Max 16% off list" },
  tormax:     { compAvgDeal: 19600, ourWinRate: 72, pricePremium: "+18-26%", marginAtRisk: "~3.8 GM pts", breakEven: "Max 18% off list" },
  boon_edam:  { compAvgDeal: 45000, ourWinRate: 55, pricePremium: "-8 to -4%",  marginAtRisk: "~1.5 GM pts", breakEven: "Max 7% off list" },
  nabtesco:   { compAvgDeal: 18400, ourWinRate: 74, pricePremium: "+20-28%", marginAtRisk: "~4.0 GM pts", breakEven: "Max 20% off list" },
  faac:       { compAvgDeal: 21200, ourWinRate: 69, pricePremium: "+16-24%", marginAtRisk: "~3.6 GM pts", breakEven: "Max 17% off list" },
};

const AAES_AVG_DEAL = 28400;

function DealEconomicsBox({ competitorId, competitorName }: { competitorId: string; competitorName: string }) {
  const data = DEAL_ECONOMICS[competitorId];
  if (!data) return null;

  const rows = [
    { label: "Avg Deal Size (AAES)",                  value: "$" + AAES_AVG_DEAL.toLocaleString() },
    { label: "Avg Deal Size (" + competitorName + ")", value: "$" + data.compAvgDeal.toLocaleString() },
    { label: "Price Premium",                          value: data.pricePremium + " (justified by AAADM + IoT)" },
    { label: "Margin at Risk if Discounted to Match",  value: data.marginAtRisk + " if discounted to match" },
    { label: "Win Rate",                               value: data.ourWinRate + "% overall, 71% when IoT/service leads" },
    { label: "Break-Even on Discount",                 value: data.breakEven + " to preserve 35% GM floor" },
  ];

  return (
    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Deal Economics vs. {competitorName}
        </p>
      </div>
      <div className="space-y-1.5 mb-4">
        {rows.map((row, i) => (
          <div key={i} className="flex items-start justify-between gap-2">
            <span className="text-xs text-muted-foreground shrink-0">{row.label}</span>
            <span className="text-xs font-semibold text-foreground text-right">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-emerald-950/30 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Talk Track — Financial Objection</p>
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          When they say &lsquo;Your price is too high&rsquo;: &lsquo;Our 5-year total cost of ownership including AAADM service network,
          IoT monitoring, and reduced downtime is 18% lower than {competitorName}. Here&rsquo;s the math.&rsquo;
        </p>
      </div>
    </div>
  );
}

// ── Objection → Counter → Proof table ────────────────────────────────────────
function ObjectionProofTable() {
  const rows = [
    {
      objection: '"Your price is too high"',
      counter: "5-yr TCO is 18% lower — service + uptime",
      proof: "AAADM SLA + IoT monitoring uptime data",
    },
    {
      objection: '"You don\'t have their certifications"',
      counter: "We hold A156.27-2024, UL-325, ANSI — and HVHZ which they don\'t",
      proof: "Cert matrix available in CrosswalkDB",
    },
    {
      objection: '"We\'ve always used [competitor]"',
      counter: "AAADM inspection attach converts to recurring revenue — no competitor offers this",
      proof: "AAADM contract template",
    },
    {
      objection: '"They can deliver faster"',
      counter: "Our FL distribution: 3-5d lead. ATL and DFW hubs in stock",
      proof: "Regional inventory data",
    },
  ];
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <ArrowRight className="w-4 h-4 text-primary shrink-0" />
        <p className="text-xs font-semibold text-primary uppercase tracking-wider">Objection → Counter → Proof</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-primary/15">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-primary/10 border-b border-primary/15">
              <th className="text-left px-3 py-2 font-semibold text-primary">Objection</th>
              <th className="text-left px-3 py-2 font-semibold text-primary">Counter</th>
              <th className="text-left px-3 py-2 font-semibold text-primary">Proof Point</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-primary/10 last:border-0 hover:bg-primary/5 transition-colors">
                <td className="px-3 py-2.5 text-amber-700 dark:text-amber-400 font-medium">{row.objection}</td>
                <td className="px-3 py-2.5 text-foreground">{row.counter}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                    <Shield className="w-3 h-3 shrink-0" />
                    {row.proof}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Log Loss Modal ─────────────────────────────────────────────────────────────
function LogLossModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [competitor, setCompetitor] = useState("dormakaba");
  const [reason, setReason] = useState("Certification Gap");
  const [dealValue, setDealValue] = useState("");
  const [state, setState] = useState("FL");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    setDealValue("");
    setNotes("");
  };

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      data-testid="log-loss-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.18 }}
        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6"
        data-testid="log-loss-modal"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-foreground text-base">Log Loss Reason</h2>
          </div>
          <button
            onClick={onClose}
            data-testid="log-loss-modal-close"
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Competitor</label>
              <select
                data-testid="loss-competitor"
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/50"
              >
                {["dormakaba","Horton","Stanley/Allegion","Nabco","RECORD","Boon Edam","GEZE","TORMAX","Nabtesco"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Loss Reason</label>
              <select
                data-testid="loss-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/50"
              >
                {["Certification Gap","Price","Lead Time","Integration/Ecosystem","Incumbent Lock-in"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Deal Value ($)</label>
              <input
                data-testid="loss-deal-value"
                type="number"
                placeholder="e.g. 48000"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">State</label>
              <select
                data-testid="loss-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/50"
              >
                {["FL","TX","CA","NY","IL","GA","WA","OH","CO","NC"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Notes</label>
            <textarea
              data-testid="loss-notes"
              placeholder="Context, deal details, what they said..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>
          <button
            type="submit"
            data-testid="loss-submit"
            className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors"
          >
            Log & Update Intelligence
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Loss Intelligence Strip ────────────────────────────────────────────────────
function LossIntelligenceStrip({ lossCount }: { lossCount: number }) {
  return (
    <div
      data-testid="loss-intelligence-strip"
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {[
        { label: "Total Losses Logged", value: String(lossCount), cls: "text-rose-600 dark:text-rose-400" },
        { label: "Top Loss Reason", value: "Certification Gap (38%)", cls: "text-amber-600 dark:text-amber-400" },
        { label: "Action Escalated", value: "3 items → Roadmap", cls: "text-primary" },
        { label: "Win Rate (90d)", value: "53%", cls: "text-emerald-600 dark:text-emerald-400" },
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</p>
          <p className={`text-base font-bold ${stat.cls}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Loss Toast ─────────────────────────────────────────────────────────────────
function LossToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-6 right-6 z-50 bg-amber-500 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2"
          data-testid="loss-toast"
        >
          <CheckCircle2 className="w-4 h-4" />
          Loss logged — Deal Intelligence updated, Roadmap escalation flagged
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Competitor profile mini card ──────────────────────────────────────────────
function CompProfileCard({ competitorId }: { competitorId: CompetitorId }) {
  const profile = getAllCompetitors().find((c) => c.id === competitorId);
  if (!profile) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{profile.fullName}</h3>
          {profile.parentCompany && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {profile.parentCompany}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{profile.hq}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{profile.founded}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground italic mb-3 leading-relaxed">
        {profile.marketPosition}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            Their strengths
          </p>
          <ul className="space-y-1">
            {profile.primaryStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5">
            Their weaknesses
          </p>
          <ul className="space-y-1">
            {profile.primaryWeaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                <XCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-start gap-2">
          <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground italic">{profile.thinkAboutThis}</p>
        </div>
      </div>
      {/* PM Roadmap deep link */}
      <div className="mt-3 pt-2 border-t border-border/50">
        <button
          onClick={() => window.open("https://pmstudio-aadm.vercel.app", "_blank")}
          className="inline-flex items-center gap-2 text-[11px] font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700/50 px-2.5 py-1 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
          data-testid="pm-roadmap-link"
        >
          View roadmap signals → PM Studio
        </button>
      </div>
    </div>
  );
}

// ── Header SVG logo ───────────────────────────────────────────────────────────
function Logo() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className="w-8 h-8"
      aria-label="BattleCard logo"
    >
      <path
        d="M16 3L4 8v8c0 6.627 5.373 12 12 12s12-5.373 12-12V8L16 3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        className="text-primary"
        fill="hsl(var(--primary) / 0.12)"
      />
      <line x1="10" y1="12" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
      <line x1="22" y1="12" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1: Battle Cards
// ─────────────────────────────────────────────────────────────────────────────
function BattleCardsTab({ lossCount }: { lossCount: number }) {
  const [selectedComp, setSelectedComp] = useState<CompetitorId>("dormakaba");
  const [selectedCtx, setSelectedCtx] = useState<ContextId>("customer_pitch");

  const competitors = getAllCompetitors();
  const availableContexts = getAvailableContexts(selectedComp);
  const card = getCard(selectedComp, selectedCtx);

  useEffect(() => {
    if (!availableContexts.includes(selectedCtx)) {
      const fallback = CONTEXT_ORDER.find((c) => availableContexts.includes(c));
      if (fallback) setSelectedCtx(fallback);
    }
  }, [selectedComp]);

  return (
    <div className="space-y-4">
      {/* Loss Intelligence Strip */}
      <LossIntelligenceStrip lossCount={lossCount} />

      {/* Competitor and context selectors */}
      <div className="border border-border rounded-xl bg-card px-5 py-4 space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">vs.</span>
          {COMPETITOR_ORDER.map((id) => {
            const c = competitors.find((x) => x.id === id)!;
            return (
              <CompPill
                key={id}
                name={c.name}
                selected={selectedComp === id}
                onClick={() => setSelectedComp(id)}
                testId={`comp-${id}`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {CONTEXT_ORDER.map((id) => (
            <ContextTab
              key={id}
              id={id}
              selected={selectedCtx === id}
              available={availableContexts.includes(id)}
              onClick={() => setSelectedCtx(id)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {card ? (
          <motion.div
            key={`${selectedComp}-${selectedCtx}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-5"
          >
            {/* Card header */}
            <div className="rounded-xl border border-primary/25 bg-primary/5 dark:bg-primary/10 px-6 py-5">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="text-xs">
                  vs. {competitors.find((c) => c.id === selectedComp)?.name}
                </Badge>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <ContextIcon id={selectedCtx} className="w-3 h-3" />
                  {CONTEXTS[selectedCtx].label}
                </Badge>
              </div>
              <h1 className="text-lg font-bold text-foreground leading-snug mb-2">
                {card.headline}
              </h1>
              <p className="text-xs text-muted-foreground">
                {CONTEXTS[selectedCtx].sublabel}
              </p>
            </div>

            {/* Win / Lose / Metrics row */}
            {(card.winSignals?.length > 0 || card.loseSignals?.length > 0 || card.keyMetrics?.length > 0) && (
              <SignalsRow
                winSignals={card.winSignals ?? []}
                loseSignals={card.loseSignals ?? []}
                keyMetrics={card.keyMetrics ?? []}
              />
            )}

            {/* 2-col layout */}
            <div className="grid md:grid-cols-[1fr_340px] gap-5">
              {/* Left column */}
              <div className="space-y-4">
                <CollapsibleSection
                  title="Win Themes"
                  icon={<Trophy className="w-4 h-4" />}
                  count={card.winThemes.length}
                >
                  <div className="space-y-3">
                    {card.winThemes.map((t, i) => (
                      <WinThemeCard key={i} {...t} index={i} />
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Head-to-Head"
                  icon={<TrendingUp className="w-4 h-4" />}
                  count={card.differentiators.length}
                >
                  <div className="mb-2">
                    <div className="grid grid-cols-[1fr_auto_1fr] text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-0 mb-2">
                      <span>ASSA ABLOY ENS</span>
                      <span className="text-center min-w-[90px]">Dimension</span>
                      <span className="text-right">
                        {competitors.find((c) => c.id === selectedComp)?.name}
                      </span>
                    </div>
                    <Separator className="mb-1" />
                  </div>
                  <div>
                    {card.differentiators.map((d, i) => (
                      <DiffRow key={i} d={d} />
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Objection Handlers"
                  icon={<MessageSquare className="w-4 h-4" />}
                  count={card.objectionHandlers.length}
                >
                  <div className="space-y-2">
                    {card.objectionHandlers.map((o, i) => (
                      <ObjectionCard key={i} {...o} index={i} />
                    ))}
                  </div>
                </CollapsibleSection>

                {card.landmines.length > 0 && (
                  <CollapsibleSection
                    title="Landmines — Avoid These"
                    icon={<AlertTriangle className="w-4 h-4" />}
                    count={card.landmines.length}
                  >
                    <div className="space-y-3">
                      {card.landmines.map((l, i) => (
                        <LandmineCard key={i} {...l} />
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                <TalkTrackBox text={card.talkTrack} />
                <ClosingMoveBox text={card.closingMove} />
                <DealEconomicsBox
                  competitorId={selectedComp}
                  competitorName={competitors.find((c) => c.id === selectedComp)?.name ?? selectedComp}
                />
                <ObjectionProofTable />
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div>
                  <SectionHeader icon={<Shield className="w-4 h-4" />} title="Competitor Intel" />
                  <CompProfileCard competitorId={selectedComp} />
                </div>

                {selectedCtx === "pm_interview" && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">PM Interview Tip</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Frame every competitive insight as a <span className="font-semibold text-foreground">product strategy observation</span>, not a sales point. Interviewers want to see how you think — not just what you know.
                    </p>
                    <ul className="mt-2 space-y-1">
                      {["Acknowledge competitor strengths genuinely", "Use frameworks: moats, TAM, GTM motion, switching costs", "Always close with a strategic question, not a sales pitch"].map((t, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                          <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <RotateCcw className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">No card available for this combination yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different context or competitor.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2: Product Intel
// ─────────────────────────────────────────────────────────────────────────────
const PRICE_RANGE_COLORS: Record<string, string> = {
  economy: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  mid: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  premium: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "ultra-premium": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

const HVHZ_BADGES: Record<string, { label: string; cls: string }> = {
  yes: { label: "HVHZ: Yes", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  no: { label: "HVHZ: No", cls: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
  verify: { label: "HVHZ: Verify", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  limited: { label: "HVHZ: Limited", cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

function ProductIntelTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterComp, setFilterComp] = useState<CompetitorId | "all">("all");
  const [filterStandard, setFilterStandard] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [copiedComp, setCopiedComp] = useState<string | null>(null);

  const competitors = getAllCompetitors().filter((c) => c.id !== "assa_abloy");

  const allProducts: { comp: typeof competitors[0]; product: KeyProduct }[] = competitors.flatMap(
    (comp) => comp.keyProducts.map((p) => ({ comp, product: p }))
  );

  const filtered = allProducts.filter(({ comp, product: p }) => {
    if (filterComp !== "all" && comp.id !== filterComp) return false;
    if (filterStandard !== "all" && !p.standard.includes(filterStandard)) return false;
    if (filterPrice !== "all" && p.priceRange !== filterPrice) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q) ||
        comp.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const copyProductList = (compId: CompetitorId) => {
    const comp = competitors.find((c) => c.id === compId);
    if (!comp) return;
    const text = comp.keyProducts
      .map((p) => `${p.name} | ${p.type} | ${p.standard} | ${p.priceRange ?? "—"} | FL HVHZ: ${p.flHvhz ?? "—"} | ${p.notes}`)
      .join("\n");
    navigator.clipboard.writeText(`${comp.fullName} Products:\n${text}`).catch(() => {});
    setCopiedComp(compId);
    setTimeout(() => setCopiedComp(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center p-4 rounded-xl border border-border bg-card">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="product-search"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
        <select
          data-testid="filter-competitor"
          value={filterComp}
          onChange={(e) => setFilterComp(e.target.value as CompetitorId | "all")}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/50"
        >
          <option value="all">All Competitors</option>
          {competitors.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          data-testid="filter-standard"
          value={filterStandard}
          onChange={(e) => setFilterStandard(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/50"
        >
          <option value="all">All Standards</option>
          <option value="A156.10">A156.10</option>
          <option value="A156.19">A156.19</option>
          <option value="A156.27">A156.27</option>
          <option value="A156.38">A156.38</option>
        </select>
        <select
          data-testid="filter-price"
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary/50"
        >
          <option value="all">All Price Tiers</option>
          <option value="economy">Economy</option>
          <option value="mid">Mid</option>
          <option value="premium">Premium</option>
          <option value="ultra-premium">Ultra-Premium</option>
        </select>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} products
        </span>
      </div>

      {/* Per-competitor expandable sections */}
      {competitors.map((comp) => {
        const compProducts = filtered.filter((x) => x.comp.id === comp.id);
        if (filterComp !== "all" && comp.id !== filterComp) return null;
        return (
          <CollapsibleSection
            key={comp.id}
            title={`${comp.fullName} (${compProducts.length} products)`}
            icon={<Layers className="w-4 h-4" />}
            defaultOpen={filterComp === comp.id || filterComp === "all"}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground italic">{comp.tagline}</span>
              <button
                data-testid={`copy-products-${comp.id}`}
                onClick={() => copyProductList(comp.id)}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/70 px-2 py-1 rounded border border-primary/20 hover:border-primary/40 transition-colors"
              >
                {copiedComp === comp.id ? (
                  <><Check className="w-3 h-3" /> Copied!</>
                ) : (
                  <><Copy className="w-3 h-3" /> Copy product list</>
                )}
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Product</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Type</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Standard</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Price Tier</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">FL HVHZ</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Key Spec</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {compProducts.map(({ product: p }, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{p.name}</td>
                      <td className="px-3 py-2.5 text-muted-foreground max-w-[160px]">{p.type}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px] h-4 px-1">{p.standard}</Badge>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {p.priceRange && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRICE_RANGE_COLORS[p.priceRange] ?? ""}`}>
                            {p.priceRange}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {p.flHvhz && HVHZ_BADGES[p.flHvhz] && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${HVHZ_BADGES[p.flHvhz].cls}`}>
                            {HVHZ_BADGES[p.flHvhz].label}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground max-w-[150px] text-[11px]">{p.keySpec ?? "—"}</td>
                      <td className="px-3 py-2.5 text-muted-foreground max-w-[200px]">{p.notes}</td>
                    </tr>
                  ))}
                  {compProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground italic">
                        No products match the current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CollapsibleSection>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3: Market Share
// ─────────────────────────────────────────────────────────────────────────────
const BRAND_COLORS: Record<string, string> = {
  assa_abloy: "#003087",
  dormakaba: "#C8102E",
  stanley: "#FFB900",
  horton: "#E87722",
  boon_edam: "#0057A8",
  geze: "#E30613",
  tormax: "#004B8D",
  nabtesco: "#1D3C6E",
  faac_group: "#003082",
  nabco: "#1A5276",
  micom: "#C0392B",
  portalp: "#1F618D",
  automatic_systems: "#117A65",
  lcn_norton: "#6C3483",
  other: "#94a3b8",
};

const BRAND_LABELS: Record<string, string> = {
  assa_abloy: "ASSA ABLOY",
  dormakaba: "dormakaba",
  stanley: "Allegion/Stanley",
  horton: "Horton",
  boon_edam: "Boon Edam",
  geze: "GEZE",
  tormax: "TORMAX",
  nabtesco: "Nabtesco",
  faac_group: "FAAC Group",
  nabco: "NABCO",
  micom: "Micom (CA)",
  portalp: "Portalp",
  automatic_systems: "Automatic Systems",
  lcn_norton: "LCN / Norton",
  other: "Other",
};

const SEGMENT_INSIGHTS: Record<string, string> = {
  "US Commercial Sliding":
    "ASSA ABLOY holds the plurality at 35%. Allegion/Stanley (Dura-Glide 2000) remains the dominant retail install base but the Allegion integration is gradually shifting their go-to-market toward bundled proposals. Winning commercial sliding head-on requires lifecycle cost and service arguments — pure spec wins come from HVHZ and healthcare compliance mandates.",
  "US Swing Operators":
    "The swing market is more distributed with new entrants GEZE (Powerturn) and FAAC (A952) adding complexity. dormakaba's ED series remains best value-to-spec for heavy-duty applications. ASSA ABLOY's SW300-S (BAU 2025) slim platform creates a specification moat in glass-facade and healthcare.",
  "US Healthcare":
    "Healthcare is ASSA ABLOY's most dominant vertical at 40%, driven by VersaMax 2.0 and FGI 2022 compliance depth. Allegion/Stanley at ~27% via ProCare. Winning healthcare deals is less about price and more about FGI documentation, NFPA 101 controlled-egress compliance, and AAADM service response SLAs.",
  "FL HVHZ Sliding":
    "Florida HVHZ is ASSA ABLOY's clearest moat at 60%+ share. NOA certification and TAS 201/202/203 testing documentation are table-stakes requirements — GEZE, TORMAX, Nabtesco, and FAAC have zero NOA-certified products. Competitors without certified products cannot legally bid FL exterior work in HVHZ.",
  "US Revolving Doors":
    "Boon Edam is now a meaningful share holder (18%) in the revolving door segment, concentrated in security revolving/anti-tailgating applications. ASSA ABLOY dominates at 42% via breadth — from compact RD3 to high-capacity RD700. Allegion/Stanley and Horton are essentially absent from revolving, which is a structural win opportunity in hospitality and airport specs.",
  "NA Auto Door Market 2025":
    "North America automatic door market: $1.32B in 2025, growing 3.6% CAGR to $1.88B by 2035. The top 5 players (ASSA ABLOY, Allegion/Stanley, dormakaba, Boon Edam, Nabtesco) account for only ~30% combined. 70% is fragmented regional players — the largest untapped consolidation opportunity in the market.",
};

function MarketShareTab() {
  const segments = [
    {
      key: "usCommercialSliding",
      label: "US Commercial Sliding",
      data: MARKET_SHARE_ESTIMATES.usCommercialSliding,
    },
    {
      key: "usSwingOperators",
      label: "US Swing Operators",
      data: MARKET_SHARE_ESTIMATES.usSwingOperators,
    },
    {
      key: "usHealthcare",
      label: "US Healthcare",
      data: MARKET_SHARE_ESTIMATES.usHealthcare,
    },
    {
      key: "flHvhzSliding",
      label: "FL HVHZ Sliding",
      data: MARKET_SHARE_ESTIMATES.flHvhzSliding,
    },
    {
      key: "usRevolvingDoors",
      label: "US Revolving Doors",
      data: MARKET_SHARE_ESTIMATES.usRevolvingDoors,
    },
    {
      key: "naAutoDoorTotal2025",
      label: "NA Auto Door Market 2025",
      data: MARKET_SHARE_ESTIMATES.naAutoDoorTotal2025,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {segments.map(({ label, data }) => {
          const chartData = Object.entries(data).map(([brand, pct]) => ({
            brand: BRAND_LABELS[brand] ?? brand,
            pct,
            brandKey: brand,
          }));

          return (
            <div key={label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">{label}</h3>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
                >
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="brand" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, "Est. Market Share"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.brandKey} fill={BRAND_COLORS[entry.brandKey] ?? "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* PM Insight */}
              {SEGMENT_INSIGHTS[label] && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">PM Insight: </span>
                      {SEGMENT_INSIGHTS[label]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 rounded-xl border border-border bg-card">
        {Object.entries(BRAND_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BRAND_COLORS[key] }} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
        <p className="text-[10px] text-muted-foreground ml-auto italic">
          Estimates based on industry analyst composite data
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 4: Win/Loss by Vertical
// ─────────────────────────────────────────────────────────────────────────────
const VERTICAL_LABELS: Record<string, string> = {
  retail: "Retail",
  healthcare: "Healthcare",
  hospitality: "Hospitality",
  airport: "Airport",
  industrial: "Industrial",
  government: "Government",
  qsr: "QSR",
  education: "Education",
  florida_hvhz: "FL HVHZ",
};

const SCORE_RATIONALE: Record<CompetitorId, Record<string, string>> = {
  assa_abloy: {
    retail: "Strong ASSA ABLOY retail presence via SL500, but Stanley Dura-Glide has entrenched GC specification inertia. Score reflects ASSA ABLOY advantage over most, but challenge vs. Stanley specifically.",
    healthcare: "VersaMax 2.0 + FGI 2022 compliance + antimicrobial surfaces = class-leading healthcare position. No competitor has a dedicated FGI platform at this depth.",
    hospitality: "RD300 all-glass revolving + SW200 OHC concealed = premium hospitality specification dominance. dormakaba KTV is the only real competitor in high-end revolving.",
    airport: "RD700 High Capacity at 3600 persons/hr. No competitor matches this throughput-to-certification combination for major airport projects.",
    industrial: "Solid industrial portfolio, but Stanley Industrial Slider 10,000 and Horton 9000 have strong established positions in heavy-industrial. Score reflects competitive but not dominant position.",
    government: "Broadest ANSI compliance documentation, OSDP v2 access control integration, and Dura-Shield Blast alternative. Government spec writers tend to default to ASSA ABLOY on compliance depth.",
    qsr: "QSR is Horton S8000 and Stanley Dura-Glide DT territory. ASSA ABLOY competes but does not own this vertical. Score reflects above-average but not dominant position.",
    education: "Good education presence via SW200 and SL500. No unique education-specific product, but strong compliance and service support drives specification wins.",
    florida_hvhz: "60%+ market share in FL HVHZ sliding. NOA + TAS 201/202/203 documentation is the clearest competitive moat — legal barrier to entry for competitors without certification.",
  },
  dormakaba: {
    retail: "ESA sliding series competes on price and aesthetics in retail. Slimdrive ES wins glass-facade premium retail but is not a mainstream US product. Mid-tier retail is competitive.",
    healthcare: "ED100 surface swing used in healthcare, but no FGI-dedicated platform. Lacks the marketing and spec-support depth of VersaMax or ProCare. Competes on price, not compliance.",
    hospitality: "KTV magnetic levitation revolving is a genuine high-end competitor to RD300. Strong in European-heritage hospitality projects. BST curved sliding is unique for luxury retail lobbies.",
    airport: "KTC 3/4 at 6.2m diameter competes at top of airport market. But RD700 throughput advantage and ASSA ABLOY service density give edge in major US airport projects.",
    industrial: "ED250 at 400kg / 1600mm is the heaviest surface-mount swing in class. Competes well in industrial swing. ESA500 telescoping for industrial sliding.",
    government: "Kaba access control legacy gives institutional credibility. But US government spec tends to ASSA ABLOY for NOA/TAS documentation depth and OSDP v2 native support.",
    qsr: "No drive-through specific product. Standard ESA sliding can be used but QSR channel is dominated by Horton S8000 and Stanley Dura-Glide DT. Limited QSR presence.",
    education: "ED100 swing is used in education. Competitive on price but thinner education-specific marketing and support resources vs. ASSA ABLOY.",
    florida_hvhz: "Limited HVHZ-certified US product lineup. ESA series require NOA verification on a project-by-project basis. Effectively closed out of FL HVHZ exterior commercial sliding.",
  },
  stanley: {
    retail: "Dura-Glide 2000 is the single most-installed automatic sliding door in US commercial/retail. Deepest GC specification inertia of any competitor. Dominant in retail.",
    healthcare: "ProCare 8300 series is a legitimate healthcare platform, but lags VersaMax 2.0 on FGI documentation depth and infection-control technology. Holds via installed base and price.",
    hospitality: "No revolving door portfolio. Cannot serve hotel lobby revolving specs. Competes with Dura-Glide All-Glass at ground-floor retail/hospitality entries.",
    airport: "No revolving door portfolio, which eliminates Stanley from most major airport terminal specs. Industrial Slider serves cargo/service applications but not main terminal.",
    industrial: "Industrial Slider 10,000 at 10,000lb capacity is a niche leader in heavy-industrial. Dura-Storm serves hurricane-rated industrial. Strong industrial sliding vertical.",
    government: "Dura-Shield Blast-resistant sliding is a unique DoD/government niche where Stanley has near-exclusive position. Strong government blast/security vertical.",
    qsr: "Dura-Glide DT drive-through window plus massive Dura-Glide 2000 grocery install base. QSR is a Stanley-owned vertical via channel relationships and brand recognition.",
    education: "Dura-Glide 2000 and 3000 installed widely in K-12 and higher education. Not highly differentiated for education, but spec inertia is strong.",
    florida_hvhz: "Dura-Storm 2000/3000 with NOA-eligible ASTM E1886/E1996 hurricane certification. Real FL HVHZ competitor but with narrower certified portfolio vs. ASSA ABLOY.",
  },
  horton: {
    retail: "Horton 2000 Series massive grocery/retail install base, particularly in Sun Belt. Service revenue moat from decades of installed systems. Second-strongest retail position after Stanley.",
    healthcare: "ICU/CCU 2000/2001/2003 series covers basic healthcare needs. But no FGI compliance marketing, no antimicrobial technology platform, no infection-control mode. Competes on price.",
    hospitality: "No revolving door portfolio. Cannot serve hotel lobby specs. Limited hospitality-specific product differentiation beyond standard sliding.",
    airport: "No revolving door and no high-throughput sliding specifically certified for major airport use. Limited airport vertical presence.",
    industrial: "9000 Series heavy-duty sliding handles demanding industrial environments. Solid industrial sliding position, particularly in Sun Belt manufacturing and warehouse.",
    government: "No blast-resistant products, no OSDP v2 access control integration, smaller parent company. Limited government specification footprint outside commodity sliding replacement.",
    qsr: "S8000 drive-through window is purpose-built for QSR and banking. Strong QSR presence particularly in Sun Belt fast food chains with existing Horton relationships.",
    education: "2000 Series installed in education via service relationships. Not strategically differentiated for education but holds existing accounts.",
    florida_hvhz: "Limited publicly available NOA/HVHZ certification documentation. Regional Sun Belt service strength helps in FL, but HVHZ exterior bids require verification — effectively limits FL exterior commercial work.",
  },
  boon_edam: {
    retail: "Boon Edam is not a retail automatic door competitor. Speedlane optical turnstiles may appear in flagship retail, but standard sliding/swing retail specs are outside their product range.",
    healthcare: "Tourlock 180 security vestibule can appear in hospital main entry specs. However, Boon Edam cannot serve ICU/OR/clinical sliding due to NFPA 101 controlled-egress limitations on revolving doors. Healthcare score is limited to lobby security only.",
    hospitality: "Boon Edam's Crystal revolving and BoonAssist manual revolving serve premium hospitality lobbies. A narrow but real hospitality presence, limited to lobby vestibule applications.",
    airport: "Tourlock 180 and speed gates appear in airport security checkpoints and corporate terminal entrances. Real airport security presence but not high-throughput main concourse.",
    industrial: "No industrial automatic door products. Score 2 reflects occasional security vestibule at industrial facilities with strict access control.",
    government: "Circlelock security portal and Tourlock 180 appear in government high-security facilities. Real government security presence, particularly for classified facilities and embassies.",
    qsr: "No QSR-relevant products whatsoever. Score 1 reflects essentially zero competitive presence.",
    education: "Occasional speed gate or Tourlock in campus security upgrade projects. Limited education presence.",
    florida_hvhz: "No HVHZ-certified products. Essentially unable to bid Florida exterior automatic door work in HVHZ.",
  },
  geze: {
    retail: "GEZE competes in retail with Slimdrive for glass-facade flagship stores. Limited US retail reference deployments outside major metros. Competes primarily in European-heritage retail brands.",
    healthcare: "No FGI 2022 documented healthcare platform. Powerturn and Slimdrive are used in European hospitals but lack US FGI compliance documentation. Limited US healthcare vertical presence.",
    hospitality: "Slimdrive and Powerturn appear in European hospitality. US hospitality presence limited due to thin US service network and no revolving door line comparable to RD300.",
    airport: "GEZE products appear in European airports. US airport presence is limited — no RD700-class revolving, thin US service network. Score reflects European capability not yet translated to US.",
    industrial: "No industrial-specific product line for US market. Limited industrial presence.",
    government: "GEZE products have European government presence, but US government specs require A156.10 compliance documentation and AAADM service that GEZE cannot fully deliver in the US.",
    qsr: "No QSR-relevant products. Score 1 reflects essentially zero competitive presence.",
    education: "GEZE products appear in European educational facilities. US education presence is minimal due to service network limitations.",
    florida_hvhz: "No HVHZ-certified products. Cannot legally bid FL HVHZ exterior automatic door work.",
  },
  tormax: {
    retail: "TX9000 is a legitimate retail sliding door competitor at a competitive price point. 8-12% below ASSA ABLOY on standard commercial sliding. National US distributor network gives retail access.",
    healthcare: "No FGI-specific healthcare product or compliance documentation. Can supply standard sliding for non-clinical areas. Thin healthcare vertical presence.",
    hospitality: "No revolving door product line. Cannot serve hotel lobby revolving specs. Limited hospitality differentiation.",
    airport: "No high-throughput revolving door comparable to RD700. No major US airport reference deployments. Limited airport vertical presence.",
    industrial: "iMotion 1302.XL heavy-duty sliding competes in industrial. Limited but present industrial sliding capability.",
    government: "No blast-resistant products. No OSDP v2 certification. Limited government specification footprint.",
    qsr: "Standard sliding can serve some QSR applications but no dedicated QSR product. Limited QSR presence.",
    education: "Standard sliding and swing for education. No unique education positioning but accessible price may win standard commercial replacements.",
    florida_hvhz: "No HVHZ-certified products. Cannot bid FL HVHZ exterior automatic door work.",
  },
  nabtesco: {
    retail: "AGD Systems ultra-quiet operation has appeal in luxury retail. Limited US brand recognition but precision engineering reputation can win high-end single-site projects.",
    healthcare: "No FGI-specific healthcare product. Limited US healthcare presence. Standard sliding only.",
    hospitality: "Quiet precision operation has genuine appeal for luxury hospitality. Single-site premium projects are possible wins. Limited multi-site or major chain presence.",
    airport: "Limited US airport presence. OEM technology embedded in some competitor products but no direct Nabtesco/AGD branded airport reference deployments.",
    industrial: "OEM supply relationships give some industrial exposure. Direct AGD Systems industrial presence is limited.",
    government: "No government-specific certifications or AAADM service infrastructure for government compliance. Score 1 reflects essentially no government vertical presence.",
    qsr: "No QSR-relevant products. Score 1 reflects essentially zero competitive presence.",
    education: "No education-specific products or marketing. Score 1 reflects essentially no education vertical presence.",
    florida_hvhz: "No HVHZ-certified products. Cannot bid FL HVHZ exterior automatic door work.",
  },
  faac_group: {
    retail: "A952 is a new market entrant. Some retail swing door opportunities via existing gate/barrier channel relationships, but no established retail automatic door presence.",
    healthcare: "No healthcare FGI-compliant products. No AAADM-certified service. Score 1 reflects inability to serve healthcare vertical.",
    hospitality: "No hospitality-specific products. No revolving door. Score 1 reflects essentially zero hospitality presence.",
    airport: "No airport automatic door products or certifications. Score 1 reflects essentially zero airport vertical presence.",
    industrial: "Gate automation heritage gives some industrial perimeter access presence. A952 may appear in industrial facility swing door applications. Limited industrial building automatic door.",
    government: "No government-specific certifications. Gate and barrier government presence exists but building automatic door government spec is outside FAAC's current capability.",
    qsr: "No QSR-relevant products. Score 1 reflects essentially zero competitive presence.",
    education: "Possible campus swing door application via A952 at facilities with existing FAAC gate relationships. Emerging but nascent education presence.",
    florida_hvhz: "No HVHZ-certified products. Cannot bid FL HVHZ exterior automatic door work.",
  },
  nabco: {
    retail: "GT1175 is a legitimate retail sliding competitor. AAADM founding member with 60+ years NA history. Strong in grocery, pharmacy, and institutional retail. Competes squarely vs. Stanley Dura-Glide and Horton 2000.",
    healthcare: "GT2400 ICU series (including new 2024 GT2400AT telescopic) is a genuine healthcare competitor with flush-bolt free breakout, UL1784 smoke-rated packages, and wide clear opening. Real threat in hospital specifications.",
    hospitality: "No revolving door product. Cannot compete in hotel lobby revolving specs. GT1175 all-glass sliding may appear in hotel entrances at mid-tier.",
    airport: "No revolving door for high-throughput applications. GT1175 used in airport terminals for standard service areas. Limited major terminal presence.",
    industrial: "No heavy-duty industrial sliding comparable to Horton 9000 or Stanley 10,000lb. Limited industrial vertical.",
    government: "AAADM founding member credentials and federal building install base. GT1175 used widely in federal buildings, VA hospitals, and government offices. Real government presence.",
    qsr: "GT1175 can serve QSR applications but no dedicated QSR product. Some QSR presence via national account relationships.",
    education: "Strong education presence via GT1175 and swing door operators. NABCO Connect IoT diagnostics useful for multi-site school districts.",
    florida_hvhz: "GT1175 hurricane-rated and GT1400 hurricane folding provide real FL HVHZ coverage. One of few true HVHZ competitors outside ASSA ABLOY in sliding and folding.",
  },
  micom: {
    retail: "Canada-only competitor. No US retail presence. Ontario and BC institutional commercial only.",
    healthcare: "Smart Swing SW800 AODA-compliant and used in Ontario healthcare. No ICU specialty, no hermetic. Narrow healthcare scope.",
    hospitality: "No revolving door. No hospitality presence.",
    airport: "No airport automatic door products. Not present in airport vertical.",
    industrial: "No industrial products.",
    government: "Buy-Canadian preference gives real Ontario provincial government traction for swing door operators. AODA compliance is a policy requirement in Ontario government buildings.",
    qsr: "No QSR products.",
    education: "AODA compliance and buy-Canadian preference drives Ontario school and university specification wins. Real education presence in Ontario/BC.",
    florida_hvhz: "No HVHZ products. Canada-only.",
  },
  portalp: {
    retail: "RC2 burglar-resistant sliding door is relevant for high-security retail (jewelry, pharmacy, banks) in Southeast US. Limited standard retail presence.",
    healthcare: "Hermetic sliding door competes in OR/cleanroom/pharmaceutical. Florida HQ gives Southeast US healthcare access. Limited FGI documentation depth vs. US-native competitors.",
    hospitality: "Revolving door offered but US A156.27 certification status unclear. Limited hospitality track record in US market.",
    airport: "No major US airport presence. European airport references exist.",
    industrial: "No industrial-specific product line.",
    government: "No government-specific certifications for US market. European public-sector references only.",
    qsr: "No QSR products.",
    education: "No education-specific products or US education market presence.",
    florida_hvhz: "Florida HQ but no verified HVHZ NOA documentation. Cannot legally bid FL HVHZ exterior work without certification.",
  },
  automatic_systems: {
    retail: "Speed gates may appear in flagship retail security upgrades. Not a standard retail automatic door competitor.",
    healthcare: "Security vestibule/mantrap at hospital main entry is their lane. Cannot serve ICU, OR, or clinical sliding due to product portfolio limitations.",
    hospitality: "Speed gates in premium hotel lobbies alongside revolving doors. Narrow hospitality lane.",
    airport: "Speed gates and full-height turnstiles at transit and airport security checkpoints. Real but narrow airport security lane.",
    industrial: "Full-height turnstiles and perimeter control for industrial facilities. Real industrial security presence.",
    government: "Security portals and mantrap solutions for government, military, data centers, and embassies. Strong government security lane.",
    qsr: "No QSR products.",
    education: "Speed gates appear in campus security upgrade projects. Moderate education security presence.",
    florida_hvhz: "No HVHZ products. Not a traditional automatic door competitor in FL.",
  },
  lcn_norton: {
    retail: "LCN 9500 and Norton 6000 appear in retail for ADA swing operators at secondary entries. Standard institutional swing operator presence in retail.",
    healthcare: "Widely installed in hospitals and healthcare facilities for ADA swing doors. Strong healthcare swing operator presence, but no sliding, no ICU, no hermetic. Competes on price and install base.",
    hospitality: "Low-energy swing operators at interior hospitality doors. Not a primary hospitality entrance competitor.",
    airport: "Interior airport doors only (offices, restrooms, service entries). Not a terminal automatic door competitor.",
    industrial: "Limited industrial presence. Low-energy swing is insufficient for high-abuse industrial environments.",
    government: "Very strong government presence — standard specification in federal buildings, schools, VA hospitals, and courthouses. Allegion distribution depth makes LCN/Norton the default ADA swing operator in government specs.",
    qsr: "No QSR-specific products. Occasional interior swing door use.",
    education: "Most-installed ADA swing operator in K-12 and higher education. Extremely strong education vertical via Allegion dealer channel and decade-long install base.",
    florida_hvhz: "No HVHZ-certified products.",
  },
};

function scoreColor(score: number): string {
  if (score >= 5) return "bg-emerald-500";
  if (score >= 4) return "bg-blue-500";
  if (score >= 3) return "bg-amber-500";
  if (score >= 2) return "bg-orange-500";
  return "bg-rose-500";
}

function scoreTextColor(score: number): string {
  if (score >= 5) return "text-emerald-700 dark:text-emerald-300";
  if (score >= 4) return "text-blue-700 dark:text-blue-300";
  if (score >= 3) return "text-amber-700 dark:text-amber-300";
  if (score >= 2) return "text-orange-700 dark:text-orange-300";
  return "text-rose-700 dark:text-rose-300";
}

function scoreBgColor(score: number): string {
  if (score >= 5) return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50";
  if (score >= 4) return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50";
  if (score >= 3) return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50";
  if (score >= 2) return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50";
  return "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50";
}

function WinLossTab() {
  const [selectedCell, setSelectedCell] = useState<{ brand: CompetitorId; vertical: string } | null>(null);

  const brands: CompetitorId[] = ["assa_abloy", "dormakaba", "stanley", "horton", "boon_edam", "geze", "tormax", "nabtesco", "faac_group", "nabco", "micom", "portalp", "automatic_systems", "lcn_norton"];
  const verticals = Object.keys(VERTICAL_LABELS);

  const brandLabels: Record<CompetitorId, string> = {
    assa_abloy: "ASSA ABLOY",
    dormakaba: "dormakaba",
    stanley: "Allegion/Stanley",
    horton: "Horton",
    boon_edam: "Boon Edam",
    geze: "GEZE",
    tormax: "TORMAX",
    nabtesco: "Nabtesco",
    faac_group: "FAAC Group",
    nabco: "NABCO",
    micom: "Micom (CA)",
    portalp: "Portalp",
    automatic_systems: "Automatic Systems",
    lcn_norton: "LCN / Norton",
  };

  return (
    <div className="space-y-5">
      {/* Heatmap grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Win Likelihood by Vertical — Score 1-5</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Click any cell to see the strategic rationale. Scores represent ASSA ABLOY competitive strength vs. that brand in each vertical.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Brand</th>
                {verticals.map((v) => (
                  <th key={v} className="text-center px-2 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    {VERTICAL_LABELS[v]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: BRAND_COLORS[brand] }}
                      />
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {brandLabels[brand]}
                      </span>
                    </div>
                  </td>
                  {verticals.map((v) => {
                    const score = WIN_LOSS_BY_VERTICAL[brand]?.[v] ?? 0;
                    const isSelected = selectedCell?.brand === brand && selectedCell?.vertical === v;
                    return (
                      <td key={v} className="px-2 py-3 text-center">
                        <button
                          data-testid={`cell-${brand}-${v}`}
                          onClick={() =>
                            setSelectedCell(isSelected ? null : { brand, vertical: v })
                          }
                          className={`w-9 h-9 rounded-lg text-sm font-bold text-white transition-all duration-150 ${scoreColor(score)} ${
                            isSelected ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105 hover:opacity-90"
                          }`}
                        >
                          {score}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Summary row — ASSA ABLOY position */}
              <tr className="border-t-2 border-primary/30 bg-primary/5">
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    AA Avg
                  </span>
                </td>
                {verticals.map((v) => {
                  const scores = brands.filter((b) => b !== "assa_abloy").map(
                    (b) => WIN_LOSS_BY_VERTICAL.assa_abloy?.[v] ?? 0
                  );
                  const aaScore = WIN_LOSS_BY_VERTICAL.assa_abloy?.[v] ?? 0;
                  const competitorAvg = brands
                    .filter((b) => b !== "assa_abloy")
                    .reduce((sum, b) => sum + (WIN_LOSS_BY_VERTICAL[b]?.[v] ?? 0), 0) /
                    brands.filter((b) => b !== "assa_abloy").length;
                  const delta = aaScore - competitorAvg;
                  return (
                    <td key={v} className="px-2 py-3 text-center">
                      <span className={`text-xs font-bold ${delta > 0 ? "text-emerald-600 dark:text-emerald-400" : delta < 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
                        {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected cell detail */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`rounded-xl border p-5 ${scoreBgColor(WIN_LOSS_BY_VERTICAL[selectedCell.brand]?.[selectedCell.vertical] ?? 0)}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-8 h-8 rounded-lg text-white flex items-center justify-center text-sm font-bold ${scoreColor(WIN_LOSS_BY_VERTICAL[selectedCell.brand]?.[selectedCell.vertical] ?? 0)}`}
              >
                {WIN_LOSS_BY_VERTICAL[selectedCell.brand]?.[selectedCell.vertical] ?? 0}
              </div>
              <div>
                <span className={`font-semibold text-sm ${scoreTextColor(WIN_LOSS_BY_VERTICAL[selectedCell.brand]?.[selectedCell.vertical] ?? 0)}`}>
                  {brandLabels[selectedCell.brand]} — {VERTICAL_LABELS[selectedCell.vertical]}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Score {WIN_LOSS_BY_VERTICAL[selectedCell.brand]?.[selectedCell.vertical] ?? 0}/5 win likelihood
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {SCORE_RATIONALE[selectedCell.brand]?.[selectedCell.vertical] ?? "Strategic rationale not available."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score legend */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-border bg-card">
        {[
          { score: 5, label: "Dominant (5)" },
          { score: 4, label: "Strong (4)" },
          { score: 3, label: "Competitive (3)" },
          { score: 2, label: "Weak (2)" },
          { score: 1, label: "Absent (1)" },
        ].map(({ score, label }) => (
          <div key={score} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded text-white text-[10px] font-bold flex items-center justify-center ${scoreColor(score)}`}>
              {score}
            </div>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 5: Pricing Intelligence
// ─────────────────────────────────────────────────────────────────────────────
const TIER_META: Record<string, { label: string; color: string; bg: string; border: string; insight: string }> = {
  economy: {
    label: "Economy",
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-50 dark:bg-slate-900/30",
    border: "border-slate-200 dark:border-slate-700",
    insight: "Economy tier conversations are about replacement cycles and installed-base loyalty, not innovation. Horton and Stanley own this conversation in sliding. ASSA ABLOY rarely wins on lowest initial price — reframe to service call frequency and downtime cost.",
  },
  mid: {
    label: "Mid-Tier",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-700",
    insight: "Mid-tier is the largest volume segment by units. Stanley Dura-Glide 3000 and dormakaba ESA200 are the primary competition. ASSA ABLOY SL500 wins here on service network and compliance documentation, not price. The 5-10% premium is defensible with lifecycle cost arguments.",
  },
  premium: {
    label: "Premium",
    color: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-700",
    insight: "Premium tier is where specification wins are decisive. VersaMax 2.0, SW300, and SL521 compete primarily on compliance documentation and certifications, not price. A specifying architect who writes VersaMax into a healthcare project has effectively locked out all competitors.",
  },
  ultra_premium: {
    label: "Ultra-Premium",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-700",
    insight: "Ultra-premium is a small-volume, high-margin segment. RD300 all-glass and RD700 airport revolving face dormakaba KTV/KTC as primary competition. Procurement conversations at this tier are ROI-driven (energy savings via ecoLOGIC, brand statement for lobbies). Price sensitivity is lowest here.",
  },
};

const TIER_KEYS = ["economy", "mid", "premium", "ultra_premium"] as const;

function PricingIntelTab() {
  return (
    <div className="space-y-5">
      {/* Price ladder visual */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Price Tier Positioning</h3>
        </div>
        <div className="flex items-end gap-2 h-16">
          {[
            { label: "Economy", height: "h-4", color: "bg-slate-400" },
            { label: "Mid", height: "h-8", color: "bg-blue-500" },
            { label: "Premium", height: "h-12", color: "bg-purple-500" },
            { label: "Ultra", height: "h-16", color: "bg-amber-500" },
          ].map(({ label, height, color }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{label}</span>
              <div className={`w-full ${height} ${color} rounded-t-sm opacity-80`} />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 italic text-center">
          Relative price index — visualizing tier positioning across the portfolio
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {TIER_KEYS.map((tier) => {
          const data = PRICING_SIGNAL_MATRIX[tier];
          if (!data) return null;
          const meta = TIER_META[tier];
          return (
            <div key={tier} className={`rounded-xl border ${meta.border} ${meta.bg} p-5 space-y-4`}>
              <div className="flex items-center gap-2">
                <DollarSign className={`w-4 h-4 ${meta.color}`} />
                <h3 className={`font-bold text-sm ${meta.color}`}>{meta.label}</h3>
              </div>
              <div className="space-y-3">
                {(["assa_abloy", "dormakaba", "stanley", "horton"] as const).map((brand) => {
                  const products = (data as Record<string, string>)[brand];
                  if (!products) return null;
                  return (
                    <div key={brand}>
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: BRAND_COLORS[brand] }}
                        />
                        <span className="text-xs font-semibold text-foreground">
                          {BRAND_LABELS[brand]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground ml-4 leading-relaxed">{products}</p>
                    </div>
                  );
                })}
              </div>
              {/* Index note */}
              {(data as Record<string, string>).indexNote && (
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-start gap-2">
                    <TrendingUp className={`w-3.5 h-3.5 ${meta.color} shrink-0 mt-0.5`} />
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      {(data as Record<string, string>).indexNote}
                    </p>
                  </div>
                </div>
              )}
              {/* PM Insight */}
              <div className={`rounded-lg border ${meta.border} bg-white/50 dark:bg-black/10 p-3`}>
                <div className="flex items-start gap-2">
                  <Briefcase className={`w-3.5 h-3.5 ${meta.color} shrink-0 mt-0.5`} />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Procurement insight: </span>
                    {meta.insight}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 6: IoT / Tech Comparison
// ─────────────────────────────────────────────────────────────────────────────
function TechComparisonTab() {
  const TIER_COLORS: Record<string, string> = {
    Premium: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800/50",
    Mid: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800/50",
    Value: "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/50",
    "Not Present": "bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50",
  };

  const categoryLabels: Record<keyof typeof PRICING_TIER_DATA, string> = {
    revolving: "Revolving Doors",
    sliding: "Sliding Doors",
    swing: "Swing Doors",
    security_entrance: "Security Entrances",
  };

  return (
    <div className="space-y-8">
      {/* IoT Comparison Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">IoT Platform Capability Comparison — 2025</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Head-to-head comparison of connected door platform capabilities across top competitors.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-foreground w-40">Feature</th>
                <th className="text-left px-4 py-3 font-semibold text-primary">ASSA ABLOY</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: BRAND_COLORS.geze }}>GEZE</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: BRAND_COLORS.dormakaba }}>dormakaba</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: BRAND_COLORS.stanley }}>Allegion/Stanley</th>
              </tr>
            </thead>
            <tbody>
              {IOT_COMPARISON_DATA.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <td className="px-4 py-3 font-medium text-foreground align-top">{row.feature}</td>
                  <td className="px-4 py-3 text-muted-foreground align-top leading-relaxed">
                    <span className="inline-flex items-start gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                      {row.assa_abloy}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground align-top leading-relaxed">{row.geze}</td>
                  <td className="px-4 py-3 text-muted-foreground align-top leading-relaxed">{row.dormakaba}</td>
                  <td className="px-4 py-3 text-muted-foreground align-top leading-relaxed">
                    <span className="inline-flex items-start gap-1">
                      {row.allegion_stanley.toLowerCase().includes("not") || row.allegion_stanley.toLowerCase().includes("no ") || row.allegion_stanley.toLowerCase().includes("limited") ? (
                        <XCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <MinusCircle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      {row.allegion_stanley}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground italic">
            Sources: ASSA ABLOY ecoLOGIC 2025 launch; GEZE myGEZE Control Nov 2025 update; dormakaba AI predictive maintenance announcement; Allegion Seamless Access platform. All data as of 2025.
          </p>
        </div>
      </div>

      {/* Pricing Tier Matrix */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">2025 Pricing Tier Matrix — by Product Category</h3>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
          Competitive pricing tier positioning across automatic door categories. Premium = market-rate leader; Mid = competitive; Value = price challenger.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {(Object.keys(categoryLabels) as Array<keyof typeof PRICING_TIER_DATA>).map((cat) => (
            <div key={cat} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h4 className="font-semibold text-sm text-foreground">{categoryLabels[cat]}</h4>
              <div className="space-y-2">
                {PRICING_TIER_DATA[cat].map((entry) => (
                  <div key={entry.competitor} className="flex items-start gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 mt-0.5 ${
                      TIER_COLORS[entry.tier] ?? "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {entry.tier}
                    </span>
                    <div>
                      <span className="text-xs font-medium text-foreground">{entry.competitor}</span>
                      <span className="text-xs text-muted-foreground ml-1">— {entry.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
type MainTab = "battle-cards" | "product-intel" | "market-share" | "win-loss" | "pricing" | "tech-intel";

const MAIN_TABS: { id: MainTab; label: string; icon: React.ReactNode }[] = [
  { id: "battle-cards", label: "Battle Cards", icon: <Shield className="w-4 h-4" /> },
  { id: "product-intel", label: "Product Intel", icon: <Layers className="w-4 h-4" /> },
  { id: "market-share", label: "Market Share", icon: <BarChart2 className="w-4 h-4" /> },
  { id: "win-loss", label: "Win/Loss by Vertical", icon: <Activity className="w-4 h-4" /> },
  { id: "pricing", label: "Pricing Intelligence", icon: <DollarSign className="w-4 h-4" /> },
  { id: "tech-intel", label: "Tech / IoT Compare", icon: <Wifi className="w-4 h-4" /> },
];

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
                ? "bg-rose-600 text-white cursor-default"
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

export default function BattleCardApp() {
  const { dark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState<MainTab>("battle-cards");
  const [lossModalOpen, setLossModalOpen] = useState(false);
  const [lossCount, setLossCount] = useState(8);
  const [showToast, setShowToast] = useState(false);

  const handleLogLoss = () => {
    setLossModalOpen(false);
    setLossCount((c) => c + 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LossToast show={showToast} />
      <LogLossModal
        open={lossModalOpen}
        onClose={() => setLossModalOpen(false)}
        onSubmit={handleLogLoss}
      />
      {/* Suite Nav */}
      <div className="sticky top-0 z-[60]">
        <SuiteNav activeTool="battlecard" />
      </div>
      {/* Navbar */}
      <header className="sticky top-[32px] z-20 bg-background/90 backdrop-blur border-b border-border px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="font-bold text-foreground leading-none">BattleCard</p>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">
              Automatic Doors — Competitive Intel
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLossModalOpen(true)}
            data-testid="btn-log-loss"
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 border border-amber-300 dark:border-amber-700 rounded-lg px-3 py-1.5 transition-colors"
          >
            <FileWarning className="w-3.5 h-3.5" />
            Log Loss →
          </button>
          <button
            onClick={handlePrint}
            data-testid="btn-print"
            className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:border-primary/40 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            data-testid="btn-theme-toggle"
            onClick={toggle}
            className="p-2 rounded-lg border border-border hover:border-primary/40 hover:bg-accent transition-colors"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="border-b border-border bg-background px-4 md:px-6">
        <nav className="flex gap-1 overflow-x-auto">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <span className={activeTab === tab.id ? "text-primary" : "text-muted-foreground"}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 md:px-6 py-6 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {activeTab === "battle-cards" && <BattleCardsTab lossCount={lossCount} />}
            {activeTab === "product-intel" && <ProductIntelTab />}
            {activeTab === "market-share" && <MarketShareTab />}
            {activeTab === "win-loss" && <WinLossTab />}
            {activeTab === "pricing" && <PricingIntelTab />}
            {activeTab === "tech-intel" && <TechComparisonTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 md:px-6 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          BattleCard &middot; ASSA ABLOY Entrance Systems &middot; Based on ANSI/BHMA A156.10/19/38, FBC 8th Ed.
        </p>
      </footer>
    </div>
  );
}
