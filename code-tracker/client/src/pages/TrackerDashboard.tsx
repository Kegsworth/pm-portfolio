import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  tracks,
  getAllStandards,
  getChangesByImpactLevel,
  getCriticalChanges,
  getPipelineByPriority,
  getChangesByBrand,
  getImplicationsByType,
  regulatoryPipeline,
  getStatusLabel,
  STATE_CODE_ADOPTIONS,
  type Track,
  type Standard,
  type Change,
  type ProductImpact,
  type CorporateImplication,
  type PipelineItem,
  type TrackId,
  type StatusCode,
  type ImpactLevel,
  type ImplicationType,
  type StateCodeAdoption,
} from "@/lib/standards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Moon,
  Sun,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  CircleDot,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Filter,
  TrendingUp,
  Shield,
  Globe,
  Package,
  Building2,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  Pin,
  Map as MapIcon,
  Search,
  MapPin,
  Star,
} from "lucide-react";

// ─── Theme ────────────────────────────────────────────────────────────────────

function useTheme() {
  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  useState(() => {
    document.documentElement.classList.toggle("dark", dark);
  });

  return { dark, toggle };
}

// ─── Helper: status display ───────────────────────────────────────────────────

function statusClass(status: StatusCode) {
  switch (status) {
    case "stable":           return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "pending-adoption": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "alert":            return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "active-revision":  return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    default:                 return "";
  }
}

function StatusIcon({ status, size = 14 }: { status: StatusCode; size?: number }) {
  switch (status) {
    case "stable":           return <CheckCircle2 size={size} className="text-green-600 dark:text-green-400" />;
    case "pending-adoption": return <RefreshCw size={size} className="text-amber-600 dark:text-amber-400" />;
    case "alert":            return <AlertTriangle size={size} className="text-red-500 dark:text-red-400" />;
    case "active-revision":  return <CircleDot size={size} className="text-purple-600 dark:text-purple-400" />;
    default:                 return null;
  }
}

// ─── Helper: impact level display ─────────────────────────────────────────────

function impactClass(level: ImpactLevel) {
  switch (level) {
    case "critical":      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    case "significant":   return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "minor":         return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    case "informational": return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    default:              return "bg-muted text-muted-foreground";
  }
}

function impactDotClass(level: ImpactLevel) {
  switch (level) {
    case "critical":      return "bg-red-500";
    case "significant":   return "bg-amber-500";
    case "minor":         return "bg-blue-500";
    case "informational": return "bg-slate-400";
    default:              return "bg-muted-foreground";
  }
}

// ─── Helper: implication type display ─────────────────────────────────────────

function implicationClass(type: ImplicationType) {
  switch (type) {
    case "market_access":        return "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300";
    case "compliance_cost":      return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300";
    case "product_roadmap":      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    case "competitive_advantage": return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    case "competitive_risk":     return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    default:                     return "bg-muted text-muted-foreground";
  }
}

function implicationLabel(type: ImplicationType) {
  switch (type) {
    case "market_access":        return "Market Access";
    case "compliance_cost":      return "Compliance Cost";
    case "product_roadmap":      return "Product Roadmap";
    case "competitive_advantage": return "Competitive Advantage";
    case "competitive_risk":     return "Competitive Risk";
    default:                     return type;
  }
}

// ─── Helper: track display ────────────────────────────────────────────────────

function trackBorderClass(trackId: TrackId) {
  switch (trackId) {
    case "bhma":          return "border-l-amber-500";
    case "icc":           return "border-l-blue-500";
    case "fbc":           return "border-l-red-500";
    case "aaadm":         return "border-l-orange-500";
    case "energy":        return "border-l-emerald-500";
    case "lifesafety":    return "border-l-rose-600";
    case "accessibility": return "border-l-purple-500";
    case "astm":          return "border-l-sky-500";
    case "healthcare":    return "border-l-teal-500";
    default:              return "border-l-slate-400";
  }
}

function trackBgClass(trackId: TrackId) {
  switch (trackId) {
    case "bhma":          return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "icc":           return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "fbc":           return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "aaadm":         return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
    case "energy":        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "lifesafety":    return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
    case "accessibility": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    case "astm":          return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300";
    case "healthcare":    return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300";
    default:              return "bg-muted text-muted-foreground";
  }
}

// ─── Helper: days remaining ───────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <svg
      aria-label="CodeTracker"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16 L16 4" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 16 L26 10" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="16" cy="16" r="2.5" fill="hsl(var(--primary))" />
      <circle cx="16" cy="16" r="7" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
    </svg>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent }: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
}) {
  const isLong = typeof value === "string" && value.length > 5;
  return (
    <Card className="border-border/60">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label}</p>
            <p className={`${isLong ? "text-lg" : "text-2xl"} font-bold`} style={accent ? { color: accent } : undefined}>{value}</p>
          </div>
          <div className="text-muted-foreground/60">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── PM Framing Callout ───────────────────────────────────────────────────────

function PMFramingCallout({ text }: { text: string }) {
  return (
    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 rounded-md p-3 mb-2">
      <div className="flex items-start gap-2">
        <Lightbulb size={13} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide mb-0.5">PM Framing</p>
          <p className="text-xs text-teal-800 dark:text-teal-200 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Enhanced Change Card (Priority Feed) ────────────────────────────────────

function EnhancedChangeCard({
  change,
  standard,
  trackId,
  pinned,
  onPin,
}: {
  change: Change;
  standard: Standard;
  trackId: TrackId;
  pinned: boolean;
  onPin: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const productCount = change.productImpacts?.length ?? 0;
  const highestImpact: ImpactLevel | null = useMemo(() => {
    if (!change.productImpacts || change.productImpacts.length === 0) return null;
    const order: ImpactLevel[] = ["critical", "significant", "minor", "informational"];
    for (const lvl of order) {
      if (change.productImpacts.some((pi) => pi.impactLevel === lvl)) return lvl;
    }
    return null;
  }, [change.productImpacts]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`border-l-4 ${trackBorderClass(trackId)} border-border/50 hover:shadow-md transition-shadow`}
        data-testid={`change-card-${change.id}`}
      >
        <CardContent className="pt-4 pb-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-start gap-2 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trackBgClass(trackId)}`}>
                    {standard.designation}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trackBgClass(trackId)} opacity-70`}>
                    {standard.currentEdition.version}
                  </span>
                  {highestImpact && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${impactClass(highestImpact)}`}>
                      {highestImpact}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold leading-snug">{change.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{change.section}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-7 w-7"
              onClick={() => onPin(change.id)}
              data-testid={`btn-pin-${change.id}`}
              title={pinned ? "Remove from pinboard" : "Pin to pinboard"}
            >
              {pinned ? (
                <BookmarkCheck size={14} className="text-primary" />
              ) : (
                <Bookmark size={14} className="text-muted-foreground" />
              )}
            </Button>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {change.description.slice(0, 220)}{change.description.length > 220 ? "..." : ""}
          </p>

          {/* Corporate implication chips */}
          {change.corporateImplications && change.corporateImplications.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {change.corporateImplications.map((ci, i) => (
                <span
                  key={i}
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${implicationClass(ci.type)}`}
                >
                  {implicationLabel(ci.type)}
                </span>
              ))}
            </div>
          )}

          {/* Product impact count button */}
          {productCount > 0 && (
            <div className="mb-2">
              <button
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                onClick={() => setExpanded((e) => !e)}
                data-testid={`expand-products-${change.id}`}
              >
                <Package size={12} />
                Affects {productCount} product{productCount !== 1 ? "s" : ""}
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-2 border border-border/40 rounded-md p-2 bg-muted/30">
                      {change.productImpacts!.map((pi, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className={`inline-block w-2 h-2 rounded-full shrink-0 mt-1 ${impactDotClass(pi.impactLevel)}`} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold">{pi.brand}</span>
                              <span className="text-muted-foreground">{pi.model}</span>
                              <span className={`px-1.5 py-0.5 rounded-full capitalize font-medium ${impactClass(pi.impactLevel)}`}>
                                {pi.impactLevel}
                              </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed mt-0.5">{pi.impactDescription}</p>
                            {pi.deadline && (
                              <p className="text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                                Deadline: {pi.deadline}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Impact on AA Products + CrosswalkDB hint */}
          {change.productImpacts && change.productImpacts.some((pi) => pi.brand === "ASSA ABLOY") && (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded px-2 py-1">
                <Package size={11} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-semibold text-blue-700 dark:text-blue-300">ASSA ABLOY products affected:</span>
                <span className="text-blue-800 dark:text-blue-200">
                  {change.productImpacts
                    .filter((pi) => pi.brand === "ASSA ABLOY")
                    .map((pi) => pi.model)
                    .join(", ")}
                </span>
              </div>
              <a
                className="text-xs text-primary/70 hover:text-primary cursor-pointer italic"
                data-testid={`crosswalk-hint-${change.id}`}
                onClick={() => window.open("https://www.perplexity.ai/computer/a/crosswalkdb-product-standard-c-XJ6fTEzDTwi0G8I9Vu1sVQ", "_blank")}
              >
                → View affected products in CrosswalkDB
              </a>
            </div>
          )}

          {/* PM Framing */}
          {change.pmFraming && <PMFramingCallout text={change.pmFraming} />}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Tab 1: Priority Feed ─────────────────────────────────────────────────────

const STANDARDS_FILTER = ["All", "A156.10", "A156.19", "A156.27", "A156.38", "IBC 2024", "FBC 9th Ed.", "AAADM"] as const;
const IMPACT_FILTER = ["All", "Critical", "Significant", "Minor", "Informational"] as const;
const BRAND_FILTER = ["All", "ASSA ABLOY", "dormakaba", "Stanley", "Horton"] as const;
const CATEGORY_FILTER = ["All", "ANSI/BHMA", "Building Code", "Energy Codes", "Life Safety", "Accessibility", "ASTM", "Healthcare"] as const;

type StandardsFilter = typeof STANDARDS_FILTER[number];
type ImpactFilter = typeof IMPACT_FILTER[number];
type BrandFilter = typeof BRAND_FILTER[number];
type CategoryFilter = typeof CATEGORY_FILTER[number];

function categoryForTrackId(trackId: TrackId): CategoryFilter {
  switch (trackId) {
    case "bhma":          return "ANSI/BHMA";
    case "icc":           return "Building Code";
    case "fbc":           return "Building Code";
    case "energy":        return "Energy Codes";
    case "lifesafety":    return "Life Safety";
    case "accessibility": return "Accessibility";
    case "astm":          return "ASTM";
    case "healthcare":    return "Healthcare";
    case "aaadm":         return "ANSI/BHMA";
    default:              return "All";
  }
}

// ─── State adoption badges for specific standards ──────────────────────────────

const STATE_ADOPTION_MAP: Record<string, { label: string; color: string }> = {
  "ibc2024":       { label: "Adoption in progress", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  "ibc2024-ch10": { label: "Adoption in progress", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  "iecc-2024":     { label: "Adoption in progress", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  "ashrae-90.1-2022": { label: "Widely adopted 2024–2025", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
};

function StateAdoptionBadge({ standardId }: { standardId: string }) {
  const info = STATE_ADOPTION_MAP[standardId];
  if (!info) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${info.color}`}
      data-testid={`adoption-badge-${standardId}`}
    >
      <Globe size={10} />
      {info.label}
    </span>
  );
}

function PriorityFeed({ pinned, onPin }: { pinned: Set<string>; onPin: (id: string) => void }) {
  const [stdFilter, setStdFilter] = useState<StandardsFilter>("All");
  const [impactFilter, setImpactFilter] = useState<ImpactFilter>("All");
  const [brandFilter, setBrandFilter] = useState<BrandFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");

  const allStds = useMemo(() => getAllStandards(), []);

  const allChangesWithMeta = useMemo(() => {
    return allStds.flatMap((std) =>
      std.recentChanges.map((c) => ({ change: c, standard: std, trackId: std.trackId }))
    );
  }, [allStds]);

  const filtered = useMemo(() => {
    return allChangesWithMeta.filter(({ change, standard }) => {
      // Category filter (new)
      if (categoryFilter !== "All") {
        if (categoryForTrackId(standard.trackId) !== categoryFilter) return false;
      }

      // Standard filter
      if (stdFilter !== "All") {
        const desig = standard.designation;
        if (stdFilter === "A156.10" && !desig.includes("A156.10")) return false;
        if (stdFilter === "A156.19" && !desig.includes("A156.19")) return false;
        if (stdFilter === "A156.27" && !desig.includes("A156.27")) return false;
        if (stdFilter === "A156.38" && !desig.includes("A156.38")) return false;
        if (stdFilter === "IBC 2024" && standard.id !== "ibc2024") return false;
        if (stdFilter === "FBC 9th Ed." && standard.id !== "fbc9th") return false;
        if (stdFilter === "AAADM" && standard.trackId !== "aaadm") return false;
      }

      // Impact filter
      if (impactFilter !== "All") {
        const lvl = impactFilter.toLowerCase() as ImpactLevel;
        if (!change.productImpacts?.some((pi) => pi.impactLevel === lvl)) return false;
      }

      // Brand filter
      if (brandFilter !== "All") {
        if (!change.productImpacts?.some((pi) => pi.brand === brandFilter)) return false;
      }

      return true;
    });
  }, [allChangesWithMeta, stdFilter, impactFilter, brandFilter, categoryFilter]);

  const criticalCount = useMemo(() => getCriticalChanges().length, []);
  const totalStdsCount = useMemo(() => allStds.length, [allStds]);

  return (
    <div data-testid="priority-feed">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          Active Standards Monitoring
          <span
            className="ml-1 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20"
            data-testid="standards-count-badge"
          >
            {totalStdsCount} Standards Tracked
          </span>
          <span className="text-sm font-normal text-muted-foreground">— {criticalCount} Critical Changes</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Showing {filtered.length} of {allChangesWithMeta.length} tracked changes</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-5 p-3 bg-muted/40 rounded-lg border border-border/40">
        {/* Category filter (new) */}
        <div className="flex items-center gap-2 flex-wrap w-full border-b border-border/30 pb-2 mb-1">
          <Filter size={12} className="text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground">Category:</span>
          {CATEGORY_FILTER.map((f) => (
            <button
              key={f}
              onClick={() => { setCategoryFilter(f); setStdFilter("All"); }}
              data-testid={`filter-category-${f.replace(/\s+/g, "-")}`}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                categoryFilter === f
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-background border border-border hover:bg-muted text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Standard:</span>
          {STANDARDS_FILTER.map((f) => (
            <button
              key={f}
              onClick={() => setStdFilter(f)}
              data-testid={f === "AAADM" ? "filter-standard-aaadm" : `filter-std-${f}`}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                stdFilter === f
                  ? f === "AAADM"
                    ? "bg-orange-500 text-white font-semibold"
                    : "bg-primary text-primary-foreground font-semibold"
                  : f === "AAADM"
                  ? "bg-orange-100 border border-orange-300 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300"
                  : "bg-background border border-border hover:bg-muted text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Impact:</span>
          {IMPACT_FILTER.map((f) => (
            <button
              key={f}
              onClick={() => setImpactFilter(f)}
              data-testid={`filter-impact-${f}`}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                impactFilter === f
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-background border border-border hover:bg-muted text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Brand:</span>
          {BRAND_FILTER.map((f) => (
            <button
              key={f}
              onClick={() => setBrandFilter(f)}
              data-testid={`filter-brand-${f}`}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                brandFilter === f
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-background border border-border hover:bg-muted text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-muted-foreground"
              data-testid="priority-feed-empty"
            >
              <Filter size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No changes match the current filters.</p>
            </motion.div>
          ) : (
            filtered.map(({ change, standard, trackId }) => (
              <EnhancedChangeCard
                key={change.id}
                change={change}
                standard={standard}
                trackId={trackId}
                pinned={pinned.has(change.id)}
                onPin={onPin}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Tab 2: Standards Library ─────────────────────────────────────────────────

// AAADM-specific library card (distinct from standard cards)
function AADMLibraryCard({ pinned, onPin }: { pinned: Set<string>; onPin: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const aaadmStd = useMemo(() => getAllStandards().find((s) => s.trackId === "aaadm"), []);
  if (!aaadmStd) return null;

  return (
    <motion.div layout>
      <Card
        className="border-border/50 ring-1 ring-orange-300 dark:ring-orange-700/60"
        data-testid="library-card-aaadm"
      >
        <CardContent className="pt-4 pb-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">
                  AAADM
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                  Industry Certification Body
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-green-600 dark:text-green-400" />
                    Active
                  </span>
                </span>
              </div>
              <p className="text-sm font-semibold leading-snug">{aaadmStd.fullName}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {aaadmStd.scope.slice(0, 150)}{aaadmStd.scope.length > 150 ? "..." : ""}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-bold text-foreground">Current</p>
              <p className="text-xs text-muted-foreground">aaadm.com</p>
            </div>
          </div>

          {/* AAADM callout */}
          <div className="mt-3 mb-3 p-2.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded text-xs">
            <span className="font-semibold text-orange-700 dark:text-orange-300">Note: </span>
            <span className="text-orange-800 dark:text-orange-200">
              AAADM is not a code body \u2014 it administers the industry certification program. AAADM cert is
              referenced in A156.10 \u00a7E4 (strongly recommended) and required by many AHJs and insurers for any
              electronic system adjustments on automatic doors.
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp size={11} className="text-orange-500" />
              <strong className="text-foreground">{aaadmStd.recentChanges.length}</strong> tracked items
            </span>
            <span className="flex items-center gap-1">
              <Globe size={11} className="text-orange-500" />
              <strong className="text-foreground">{aaadmStd.watchList.length}</strong> watch items
            </span>
          </div>

          {/* Expand/collapse */}
          <button
            className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium"
            onClick={() => setExpanded((e) => !e)}
            data-testid="library-expand-aaadm"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? "Collapse" : "View all AAADM items"}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  <Separator />
                  {aaadmStd.recentChanges.map((c) => (
                    <EnhancedChangeCard
                      key={c.id}
                      change={c}
                      standard={aaadmStd}
                      trackId={aaadmStd.trackId}
                      pinned={pinned.has(c.id)}
                      onPin={onPin}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Products Affected Lookup (by standard designation) ────────────────────────
const PRODUCTS_AFFECTED_MAP: Record<string, { count: number; products: string[] }> = {
  "A156.27-2024": { count: 5, products: ["SL500 R104","SL500 R92","SL500 R128","TSA 200","TSA 160"] },
  "A156.10-2024": { count: 4, products: ["SW60","SW200 OHC","SL500 R92","Windcord 5500"] },
  "A156.19-2022": { count: 4, products: ["SW60","SW200 OHC","VersaMax ICU","VersaMax CCU"] },
  "A156.38-2024": { count: 1, products: ["SW60 Slim Retrofit"] },
  "A156.3-2025":  { count: 1, products: ["RD3-T3 Revolving"] },
  "A156.14-2024": { count: 2, products: ["Windcord 5500","Windcord 5400"] },
  "IBC 2024":     { count: 8, products: ["SL500 R104","SL500 R92","SW60","SW200 OHC","VersaMax ICU","VersaMax CCU","TSA 200","RD3-T3"] },
  "FBC 8th Ed":   { count: 4, products: ["SL500 R104","SL500 R92","SW60","SW200 OHC"] },
  "FBC 9th Ed.":  { count: 4, products: ["SL500 R104","SL500 R92","SW60","SW200 OHC"] },
  "NFPA 101":     { count: 3, products: ["SW60","SW200 OHC","VersaMax ICU"] },
  "ASHRAE 90.1":  { count: 3, products: ["SL500 R92","SW60","RD3-T3"] },
  "IECC 2024":    { count: 3, products: ["SL500 R92","SW60","SL500 R104"] },
  "ICC A117.1":   { count: 4, products: ["SW60","SW200 OHC","VersaMax ICU","VersaMax CCU"] },
  "UL 294":       { count: 1, products: ["ConnectGateway IoT"] },
  "FGI 2022":     { count: 2, products: ["VersaMax ICU","VersaMax CCU"] },
  "ASHRAE 170":   { count: 2, products: ["VersaMax ICU","VersaMax CCU"] },
};

// Helper: get products affected by designation (flexible key matching)
function getProductsAffected(designation: string): { count: number; products: string[] } | null {
  // Try direct match first
  if (PRODUCTS_AFFECTED_MAP[designation]) return PRODUCTS_AFFECTED_MAP[designation];
  // Try prefix match
  for (const key of Object.keys(PRODUCTS_AFFECTED_MAP)) {
    if (designation.startsWith(key.split("-")[0]) && designation.includes(key.split("-")[0])) {
      const found = PRODUCTS_AFFECTED_MAP[key];
      if (found) return found;
    }
  }
  return null;
}

// ─── Products Affected Badge ──────────────────────────────────────────────────
function ProductsAffectedBadge({ designation }: { designation: string }) {
  const data = getProductsAffected(designation);
  if (!data) return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: "rgba(0,229,255,0.12)", color: "#00b8d9", border: "1px solid rgba(0,229,255,0.25)" }}
      data-testid={`products-affected-badge-${designation.replace(/[^a-z0-9]/gi,"-")}`}
      title={data.products.join(", ")}
    >
      <Zap size={10} />
      {data.count} ASSA Products
    </span>
  );
}

// ─── Auto-Propagation Note ────────────────────────────────────────────────────
function AutoPropagationNote({ designation, status, trackId }: { designation: string; status: StatusCode; trackId: TrackId }) {
  if (status !== "pending-adoption" && status !== "active-revision" && status !== "alert") return null;
  const data = getProductsAffected(designation);
  const n = data?.count ?? 0;
  const borderColorClass = trackBorderClass(trackId);
  return (
    <div
      className={`mt-2 pl-3 py-2 pr-2 rounded border-l-2 ${borderColorClass} bg-muted/30 text-xs text-muted-foreground leading-relaxed`}
      data-testid={`auto-propagation-${designation.replace(/[^a-z0-9]/gi,"-")}`}
    >
      <span className="text-foreground font-medium">→ On adoption:</span>{" "}
      CrosswalkDB risk scores recalculate for{" "}
      <span className="font-semibold text-foreground">{n} products</span>{" · "}
      PM Studio cert initiatives auto-created{" · "}
      BattleCard objection scripts updated
    </div>
  );
}

// ─── Portfolio Impact Summary ─────────────────────────────────────────────────
function PortfolioImpactSummary() {
  return (
    <div
      className="mb-6 rounded-xl border border-primary/25 bg-primary/5 dark:bg-primary/10 p-4"
      data-testid="portfolio-impact-summary"
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={16} className="text-primary" />
        <span className="text-sm font-bold text-foreground">Portfolio Impact Summary</span>
        <span className="text-xs text-muted-foreground ml-auto">Live across all tracked standards</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Standards in Transition", value: "6", color: "text-amber-600 dark:text-amber-400" },
          { label: "Products with Active Exposure", value: "12", color: "text-rose-600 dark:text-rose-400" },
          { label: "Revenue with Code Risk", value: "$28.4M", color: "text-red-600 dark:text-red-400" },
          { label: "Estimated Compliance Cycle", value: "120–210 days", color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-background/60 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</p>
            <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Business Impact Lookup ──────────────────────────────────────────────────
const BUSINESS_IMPACT_MAP: Record<string, string> = {
  "ibc-2024":        "All AAES products sold in IBC jurisdictions must comply. Affects SL500, SW200, VersaMax lines.",
  "nfpa101-2024":    "Fire door operators (SW60, SW200) must maintain UL listing for life safety egress.",
  "ashrae-90.1-2022":"Vestibule requirements affect system design specs in >10,000 sqft commercial builds.",
  "iecc-2024":       "Climate zone vestibule exemptions directly affect FL and TX market specs.",
  "a156-10-2023":    "All automatic sliding door operators must meet updated kinetic energy limits. Affects SL500 and SW series.",
  "fbc9th":          "Florida-specific mandate triggers NOA re-certification for all HVHZ exterior door systems.",
  "a156-38-2023":    "New ANSI A156.38 definitions impact sensor specification for SW60 and SW200 OHC.",
  "a156-19-2024":    "Low-energy door requirements touch TSA 200 and all push-and-go operators.",
};

// ─── State Adoption Data ──────────────────────────────────────────────────────
const STATE_ADOPTION_DATA = [
  { state: "FL", name: "Florida",        ibcVersion: "2020", ieccVersion: "2021", notes: "HVHZ overlay, FBC Chapter 48" },
  { state: "TX", name: "Texas",          ibcVersion: "2021", ieccVersion: "2021", notes: "Statewide adoption 2024" },
  { state: "CA", name: "California",     ibcVersion: "2022", ieccVersion: "2022", notes: "Title 24 energy overlay" },
  { state: "NY", name: "New York",       ibcVersion: "2020", ieccVersion: "2021", notes: "NYC amendments" },
  { state: "IL", name: "Illinois",       ibcVersion: "2021", ieccVersion: "2021", notes: "Chicago amendments" },
  { state: "GA", name: "Georgia",        ibcVersion: "2018", ieccVersion: "2018", notes: "Lagging adoption" },
  { state: "OH", name: "Ohio",           ibcVersion: "2017", ieccVersion: "2018", notes: "Lagging adoption" },
  { state: "WA", name: "Washington",     ibcVersion: "2021", ieccVersion: "2021", notes: "Energy focus" },
  { state: "CO", name: "Colorado",       ibcVersion: "2021", ieccVersion: "2021", notes: "Growing market" },
  { state: "NC", name: "North Carolina", ibcVersion: "2018", ieccVersion: "2018", notes: "Hurricane zone overlay" },
];

function codeRecency(version: string): "current" | "one-behind" | "lagging" {
  const year = parseInt(version, 10);
  if (year >= 2022) return "current";
  if (year >= 2020) return "one-behind";
  return "lagging";
}

function CodeVersionCell({ version }: { version: string }) {
  const recency = codeRecency(version);
  const cls =
    recency === "current"    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
    recency === "one-behind" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                               "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {version}
    </span>
  );
}

function StateAdoptionView() {
  return (
    <div data-testid="state-adoption-view">
      <div className="mb-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Globe size={14} className="text-primary" />
          State Code Adoption Map
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">10 key markets — IBC and IECC adoption status with AAES business context</p>
      </div>
      <div className="flex gap-3 mb-4 text-xs">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-green-500 opacity-70"></span>Current (2022+)</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-amber-500 opacity-70"></span>1 Cycle Behind (2020-2021)</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-red-500 opacity-70"></span>2+ Cycles Behind (&lt;2020)</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-sm" data-testid="state-adoption-table">
          <thead>
            <tr className="bg-muted/60 dark:bg-muted/30">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-12">State</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-32">Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-32">IBC Version</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-32">IECC Version</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Unique Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {STATE_ADOPTION_DATA.map((row, i) => (
              <tr key={row.state} className={i % 2 === 0 ? "" : "bg-muted/20"} data-testid={`state-row-${row.state.toLowerCase()}`}>
                <td className="px-4 py-2.5">
                  <span className="font-mono font-bold text-xs text-foreground">{row.state}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-xs text-foreground">{row.name}</span>
                </td>
                <td className="px-4 py-2.5">
                  <CodeVersionCell version={row.ibcVersion} />
                </td>
                <td className="px-4 py-2.5">
                  <CodeVersionCell version={row.ieccVersion} />
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">{row.notes}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StandardsLibrary({ pinned, onPin }: { pinned: Set<string>; onPin: (id: string) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [libCategoryFilter, setLibCategoryFilter] = useState<CategoryFilter>("All");
  const [libView, setLibView] = useState<"list" | "adoption">("list");
  const allStds = useMemo(() => getAllStandards().filter((s) => s.trackId !== "aaadm"), []);
  const filteredLibStds = useMemo(() => {
    if (libCategoryFilter === "All") return allStds;
    return allStds.filter((s) => categoryForTrackId(s.trackId) === libCategoryFilter);
  }, [allStds, libCategoryFilter]);

  const fbcDays = daysUntil("2026-12-31");

  return (
    <div data-testid="standards-library">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          Standards Library
          <span className="ml-1 text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
            {allStds.length + 1} Standards
          </span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">{allStds.length} standards + AAADM certification program actively monitored</p>
        {/* View toggle */}
        <div className="flex gap-1 bg-secondary p-1 rounded-lg flex-shrink-0">
          <button
            onClick={() => setLibView("list")}
            data-testid="lib-view-standards-list"
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              libView === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Standards List
          </button>
          <button
            onClick={() => setLibView("adoption")}
            data-testid="lib-view-state-adoption"
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              libView === "adoption" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            State Adoption
          </button>
        </div>
      </div>

      {/* State Adoption View */}
      {libView === "adoption" && (
        <StateAdoptionView />
      )}

      {libView === "list" && (<>

      {/* Portfolio Impact Summary */}
      <PortfolioImpactSummary />

      {/* Category filter for library */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {CATEGORY_FILTER.map((f) => (
          <button
            key={f}
            onClick={() => setLibCategoryFilter(f)}
            data-testid={`lib-filter-category-${f.replace(/\s+/g, "-")}`}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              libCategoryFilter === f
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-background border border-border hover:bg-muted text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* FBC countdown banner */}
      <div className="mb-4 flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-lg px-4 py-2.5">
        <Calendar size={16} className="text-red-500 shrink-0" />
        <div>
          <span className="text-sm font-semibold text-red-700 dark:text-red-400">
            FBC 9th Edition effective in {fbcDays} days
          </span>
          <span className="text-xs text-red-600 dark:text-red-400 ml-2">(Dec 31, 2026)</span>
        </div>
      </div>

      <div className="space-y-3">
        {filteredLibStds.map((std) => {
          const isExpanded = expandedId === std.id;
          const isFBC9 = std.id === "fbc9th";

          // AA products affected across all changes in this standard
          const aaProductsAffected = Array.from(
            new Set(
              std.recentChanges
                .flatMap((c) => c.productImpacts ?? [])
                .filter((pi) => pi.brand === "ASSA ABLOY")
                .map((pi) => pi.model)
            )
          );

          return (
            <motion.div key={std.id} layout>
              <Card
                className={`border-border/50 ${isFBC9 ? "ring-1 ring-red-300 dark:ring-red-700/60" : ""}`}
                data-testid={`library-card-${std.id}`}
              >
                <CardContent className="pt-4 pb-4">
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trackBgClass(std.trackId)}`}>
                          {std.designation}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass(std.currentEdition.status)}`}>
                          <span className="flex items-center gap-1">
                            <StatusIcon status={std.currentEdition.status} size={11} />
                            {getStatusLabel(std.currentEdition.status)}
                          </span>
                        </span>
                        {isFBC9 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                            PENDING FENESTRATION
                          </span>
                        )}
                        <StateAdoptionBadge standardId={std.id} />
                        <ProductsAffectedBadge designation={std.designation} />
                      </div>
                      <p className="text-sm font-semibold leading-snug">{std.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{std.scope.slice(0, 150)}{std.scope.length > 150 ? "..." : ""}</p>
                      <AutoPropagationNote designation={std.designation} status={std.currentEdition.status} trackId={std.trackId} />
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-foreground">{std.currentEdition.version}</p>
                      <p className="text-xs text-muted-foreground">{std.governingBody.split("(")[0].trim()}</p>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 mt-3 mb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp size={11} className="text-primary" />
                      <strong className="text-foreground">{std.recentChanges.length}</strong> tracked changes
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe size={11} className="text-primary" />
                      <strong className="text-foreground">{std.watchList.length}</strong> watch items
                    </span>
                    {isFBC9 && (
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                        <Clock size={11} />
                        {fbcDays}d remaining
                      </span>
                    )}
                  </div>

                  {/* ASSA ABLOY Products Affected row */}
                  {aaProductsAffected.length > 0 && (
                    <div className="flex items-start gap-1.5 mb-2 text-xs">
                      <Package size={11} className="text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-blue-700 dark:text-blue-300">ASSA ABLOY products: </span>
                        <span className="text-muted-foreground">{aaProductsAffected.slice(0, 3).join(", ")}{aaProductsAffected.length > 3 ? ` +${aaProductsAffected.length - 3} more` : ""}</span>
                        <a
                          className="ml-2 text-primary/70 italic cursor-pointer hover:text-primary"
                          data-testid={`lib-crosswalk-hint-${std.id}`}
                          onClick={() => window.open("https://www.perplexity.ai/computer/a/crosswalkdb-product-standard-c-XJ6fTEzDTwi0G8I9Vu1sVQ", "_blank")}
                        >
                          → View affected products in CrosswalkDB
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Business Impact for ASSA ABLOY */}
                  {BUSINESS_IMPACT_MAP[std.id] && (
                    <div className="flex items-start gap-1.5 mb-2 text-xs" data-testid={`lib-business-impact-${std.id}`}>
                      <Target size={11} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-primary">Business Impact: </span>
                        <span className="text-muted-foreground">{BUSINESS_IMPACT_MAP[std.id]}</span>
                      </div>
                    </div>
                  )}

                  {/* FL Compliance deep link */}
                  {isFBC9 && (
                    <div className="mb-2">
                      <button
                        onClick={() => window.open("https://www.perplexity.ai/computer/a/doorspec-fl-compliance-checker-mArd4vh0SLKQrSaF37VB3A", "_blank")}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 px-2.5 py-1 rounded-full transition-colors"
                      >
                        <span>Check FL compliance for this standard</span>
                        <span>→</span>
                      </button>
                    </div>
                  )}

                  {/* FBC9 fenestration note */}
                  {isFBC9 && (
                    <div className="mb-3 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded text-xs">
                      <span className="font-semibold text-amber-700 dark:text-amber-300">NEW — TAS 203 Water Infiltration:</span>
                      <span className="text-amber-800 dark:text-amber-200 ml-1">
                        Fenestration products now require TAS 203 water infiltration testing for Florida projects. Full document review pending. Flag all exterior door/window products.
                      </span>
                    </div>
                  )}

                  {/* Expand/collapse toggle */}
                  <button
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    onClick={() => setExpandedId(isExpanded ? null : std.id)}
                    data-testid={`library-expand-${std.id}`}
                  >
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {isExpanded ? "Collapse" : "View all changes"}
                  </button>

                  {/* Expanded changes list */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3">
                          <Separator />
                          {std.recentChanges.map((c) => (
                            <EnhancedChangeCard
                              key={c.id}
                              change={c}
                              standard={std}
                              trackId={std.trackId}
                              pinned={pinned.has(c.id)}
                              onPin={onPin}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {/* AAADM card — always rendered at the bottom of the library */}
        <AADMLibraryCard pinned={pinned} onPin={onPin} />
      </div>
      </>)}
    </div>
  );
}

// ─── Tab 3: Product Impact Tracker ───────────────────────────────────────────

const BRAND_TABS = ["All", "ASSA ABLOY", "dormakaba", "Stanley", "Horton"] as const;
type BrandTab = typeof BRAND_TABS[number];

interface ProductRow {
  brand: string;
  model: string;
  impacts: Array<{ changeTitle: string; changeId: string; standardLabel: string; impactLevel: ImpactLevel; actionRequired: string; deadline?: string }>;
  highestImpact: ImpactLevel;
}

const IMPACT_ORDER: ImpactLevel[] = ["critical", "significant", "minor", "informational"];

function impactRank(level: ImpactLevel): number {
  return IMPACT_ORDER.indexOf(level);
}

function ProductImpactTracker() {
  const [brandTab, setBrandTab] = useState<BrandTab>("All");

  const allStds = useMemo(() => getAllStandards(), []);

  const productRows = useMemo((): ProductRow[] => {
    const map = new Map<string, ProductRow>();

    for (const std of allStds) {
      for (const change of std.recentChanges) {
        if (!change.productImpacts) continue;
        for (const pi of change.productImpacts) {
          const key = `${pi.brand}||${pi.model}`;
          if (!map.has(key)) {
            map.set(key, {
              brand: pi.brand,
              model: pi.model,
              impacts: [],
              highestImpact: pi.impactLevel,
            });
          }
          const row = map.get(key)!;
          row.impacts.push({
            changeTitle: change.title,
            changeId: change.id,
            standardLabel: std.designation,
            impactLevel: pi.impactLevel,
            actionRequired: pi.actionRequired,
            deadline: pi.deadline,
          });
          if (impactRank(pi.impactLevel) < impactRank(row.highestImpact)) {
            row.highestImpact = pi.impactLevel;
          }
        }
      }
    }

    let rows = Array.from(map.values());

    if (brandTab !== "All") {
      rows = rows.filter((r) => r.brand === brandTab);
    }

    rows.sort((a, b) => {
      const diff = impactRank(a.highestImpact) - impactRank(b.highestImpact);
      if (diff !== 0) return diff;
      const aDl = a.impacts.find((i) => i.deadline)?.deadline ?? "";
      const bDl = b.impacts.find((i) => i.deadline)?.deadline ?? "";
      return aDl.localeCompare(bDl);
    });

    return rows;
  }, [allStds, brandTab]);

  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  return (
    <div data-testid="product-impact-tracker">
      <div className="mb-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Package size={16} className="text-primary" />
          Product Impact Tracker
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">What your product team needs to do, sorted by impact and deadline.</p>
      </div>

      {/* Brand filter tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap border-b border-border/50 pb-3">
        {BRAND_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setBrandTab(tab)}
            data-testid={`brand-tab-${tab}`}
            className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
              brandTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground mb-3">{productRows.length} products affected</div>

      {/* Product rows */}
      <div className="space-y-2">
        {productRows.map((row) => {
          const key = `${row.brand}||${row.model}`;
          const isOpen = expandedProduct === key;
          const nearestDeadline = row.impacts.filter((i) => i.deadline).sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))[0]?.deadline;

          return (
            <Card
              key={key}
              className="border-border/50"
              data-testid={`product-row-${row.model.replace(/\s+/g, "-")}`}
            >
              <CardContent className="pt-3 pb-3">
                <div
                  className="flex items-center justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedProduct(isOpen ? null : key)}
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{row.model}</span>
                        <span className="text-xs text-muted-foreground">{row.brand}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${impactClass(row.highestImpact)}`}>
                          {row.highestImpact}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Impacted by {row.impacts.length} change{row.impacts.length !== 1 ? "s" : ""}
                        {nearestDeadline && (
                          <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                            · Nearest deadline: {nearestDeadline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2 border-t border-border/40 pt-3">
                        {row.impacts.map((imp, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <span className={`inline-block w-2 h-2 rounded-full shrink-0 mt-1 ${impactDotClass(imp.impactLevel)}`} />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                <span className="font-semibold text-muted-foreground">{imp.standardLabel}</span>
                                <span className="text-foreground font-medium">{imp.changeTitle.slice(0, 60)}{imp.changeTitle.length > 60 ? "..." : ""}</span>
                                <span className={`px-1.5 py-0.5 rounded-full capitalize font-medium ${impactClass(imp.impactLevel)}`}>
                                  {imp.impactLevel}
                                </span>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">{imp.actionRequired}</p>
                              {imp.deadline && (
                                <p className="text-amber-600 dark:text-amber-400 font-medium mt-0.5">Deadline: {imp.deadline}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab 4: Regulatory Pipeline ───────────────────────────────────────────────

function pipelineStatusBadge(priority: string) {
  switch (priority) {
    case "high":   return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    case "medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    default:       return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

function pipelineStatusLabel(priority: string) {
  switch (priority) {
    case "high":   return "Confirmed";
    case "medium": return "Expected";
    default:       return "Watch";
  }
}

function RegulatoryPipeline() {
  const sorted = useMemo(() => {
    return [...regulatoryPipeline].sort((a, b) => {
      // Put high priority first, then sort by title
      if (a.priority !== b.priority) {
        const ord = ["high", "medium", "low"];
        return ord.indexOf(a.priority) - ord.indexOf(b.priority);
      }
      return a.title.localeCompare(b.title);
    });
  }, []);

  const [expanded, setExpanded] = useState<string | null>(null);
  const fbcDays = daysUntil("2026-12-31");

  return (
    <div data-testid="regulatory-pipeline">
      <div className="mb-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          Regulatory Pipeline
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Upcoming regulatory items sorted by urgency</p>
      </div>

      {/* Hard deadline callout */}
      <div className="mb-5 flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-700/60 rounded-lg px-4 py-3">
        <Clock size={16} className="text-red-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-700 dark:text-red-400">
            Nearest Hard Deadline: FBC 9th Edition — Dec 31, 2026 ({fbcDays} days)
          </p>
          <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5">
            All Florida projects permitted after this date must comply. No extension expected.
          </p>
        </div>
      </div>

      {/* Pipeline items */}
      <div className="relative pl-6 space-y-4">
        {/* Timeline line */}
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

        {sorted.map((item, index) => {
          const isOpen = expanded === item.id;
          return (
            <div key={item.id} className="relative" data-testid={`pipeline-item-${item.id}`}>
              {/* Dot */}
              <div className={`absolute -left-4 top-3 w-3.5 h-3.5 rounded-full border-2 border-background ${
                item.priority === "high" ? "bg-red-500" : item.priority === "medium" ? "bg-amber-500" : "bg-slate-400"
              }`} />

              <Card className="border-border/50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pipelineStatusBadge(item.priority)}`}>
                          {pipelineStatusLabel(item.priority)}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{item.standard}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={10} />
                          {item.expectedDate}
                        </span>
                      </div>
                      <p className="text-sm font-semibold leading-snug">{item.title}</p>
                    </div>
                  </div>

                  {/* Affected products */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.affectedProducts.slice(0, 3).map((p, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {p}
                      </span>
                    ))}
                    {item.affectedProducts.length > 3 && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        +{item.affectedProducts.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action required */}
                  <div className="bg-muted/50 rounded p-2.5 mb-2">
                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-0.5">Action Required</p>
                    <p className="text-xs text-foreground/80 leading-relaxed">{item.actionRequired.slice(0, 160)}{item.actionRequired.length > 160 ? "..." : ""}</p>
                  </div>

                  {/* Expand for full body + PM insight */}
                  <button
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                    onClick={() => setExpanded(isOpen ? null : item.id)}
                    data-testid={`pipeline-expand-${item.id}`}
                  >
                    {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    {isOpen ? "Collapse" : "View full details"}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 border-t border-border/40 pt-3 space-y-3">
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 rounded-md p-2.5">
                            <div className="flex items-start gap-2">
                              <Lightbulb size={12} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide mb-0.5">PM Insight</p>
                                <p className="text-xs text-teal-800 dark:text-teal-200 leading-relaxed">{item.actionRequired}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab 5: Corporate Intelligence ───────────────────────────────────────────

const IMPLICATION_TYPES: ImplicationType[] = [
  "market_access",
  "compliance_cost",
  "product_roadmap",
  "competitive_advantage",
  "competitive_risk",
];

const KEY_PM_TAKEAWAYS = [
  "FBC 9th Edition (Dec 31, 2026) is the single most time-sensitive compliance gate — all exterior automatic door products in Florida must be re-validated for 160 mph NOA, TAS 203 water infiltration, and IBC 2024 §1105.1.1 vestibule requirements before this date.",
  "The 30 lbf closing force reduction in A156.10-2024 creates a product-level compliance cost for all full-energy operator brands, but brands that recertify first can position compliance as a competitive advantage with spec-writers and code-conscious buyers.",
  "A156.19-2023's contactless activation (wave sensor) provision directly enables a market access play in healthcare, federal facilities, and transit — especially if the anticipated DOJ ADA technical bulletin endorses wave sensors as a valid knowing-act mechanism.",
  "A156.38-2023 introduces a system-level certification path (operator + frame + glass + hardware tested together), which could become a market access gate for Florida sliding doors when FBC 10th Edition cites it — brands that certify early have a durable competitive advantage.",
  "dormakaba's early adoption of A156.27 for low-energy power-assist positions it as the default spec in LEED/sustainability-driven commercial projects, while competitors without compliant product lines face a growing competitive risk in that segment.",
  "AAADM certification is the service moat in automatic doors — ASSA ABLOY's largest-in-North-America certified service network directly ties recurring service revenue to the installed base. This moat strengthens as litigation risk around uncertified technicians drives de facto certification mandates, even ahead of formal state legislation in FL and CA.",
];

function CorporateIntelligence() {
  const [typeFilter, setTypeFilter] = useState<ImplicationType | "all">("all");

  const allImplications = useMemo(() => {
    const allStds = getAllStandards();
    return allStds.flatMap((std) =>
      std.recentChanges.flatMap((c) =>
        (c.corporateImplications ?? []).map((ci) => ({
          ...ci,
          changeTitle: c.title,
          changeId: c.id,
          standardLabel: std.designation,
        }))
      )
    );
  }, []);

  const filtered = useMemo(() => {
    if (typeFilter === "all") return allImplications;
    return allImplications.filter((ci) => ci.type === typeFilter);
  }, [allImplications, typeFilter]);

  return (
    <div data-testid="corporate-intelligence">
      <div className="mb-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Building2 size={16} className="text-primary" />
          Corporate Intelligence
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Strategic implications of standards changes for PM and leadership</p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        <button
          onClick={() => setTypeFilter("all")}
          data-testid="ci-filter-all"
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            typeFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All Types
        </button>
        {IMPLICATION_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            data-testid={`ci-filter-${t}`}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              typeFilter === t
                ? "bg-primary text-primary-foreground"
                : `${implicationClass(t)} hover:opacity-80`
            }`}
          >
            {implicationLabel(t)}
          </button>
        ))}
      </div>

      {/* Implication cards */}
      <div className="space-y-3 mb-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((ci, i) => (
            <motion.div
              key={`${ci.changeId}-${i}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <Card className="border-border/50" data-testid={`ci-card-${i}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${implicationClass(ci.type)}`}>
                      {implicationLabel(ci.type)}
                    </span>
                    <span className="text-xs text-muted-foreground">{ci.standardLabel} · {ci.changeTitle.slice(0, 50)}{ci.changeTitle.length > 50 ? "..." : ""}</span>
                  </div>

                  <p className="text-sm text-foreground/90 leading-relaxed mb-3">{ci.description}</p>

                  {/* Affected brands */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ci.affectedBrands.map((brand, j) => (
                      <span key={j} className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                        {brand}
                      </span>
                    ))}
                  </div>

                  {/* PM insight */}
                  <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 rounded-md p-2.5">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={12} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide mb-0.5">PM Insight</p>
                        <p className="text-xs text-teal-800 dark:text-teal-200 leading-relaxed">{ci.pmInsight}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground" data-testid="ci-empty">
            <Building2 size={28} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No implications match this filter.</p>
          </div>
        )}
      </div>

      {/* Key PM Takeaways summary */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target size={15} className="text-primary" />
            Key PM Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ol className="space-y-3">
            {KEY_PM_TAKEAWAYS.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-foreground/85">{item}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab 6: Pinboard ──────────────────────────────────────────────────────────

function Pinboard({ pinned, onPin }: { pinned: Set<string>; onPin: (id: string) => void }) {
  const allStds = useMemo(() => getAllStandards(), []);

  const pinnedChanges = useMemo(() => {
    return allStds.flatMap((s) =>
      s.recentChanges
        .filter((c) => pinned.has(c.id))
        .map((c) => ({ change: c, standard: s }))
    );
  }, [pinned, allStds]);

  if (pinnedChanges.length === 0) {
    return (
      <div
        className="text-center py-16 text-muted-foreground"
        data-testid="pinboard-empty-state"
      >
        <Pin size={32} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">Pin changes from the Priority Feed to track them here</p>
        <p className="text-xs mt-1">Click the bookmark icon on any change card to pin it here.</p>
      </div>
    );
  }

  return (
    <div data-testid="pinboard-items" className="space-y-3">
      <p className="text-xs text-muted-foreground mb-4">
        {pinnedChanges.length} item{pinnedChanges.length !== 1 ? "s" : ""} pinned
      </p>
      {pinnedChanges.map(({ change, standard }) => (
        <EnhancedChangeCard
          key={change.id}
          change={change}
          standard={standard}
          trackId={standard.trackId}
          pinned={true}
          onPin={onPin}
        />
      ))}
    </div>
  );
}


// ─── Tab 7: State Codes ───────────────────────────────────────────────────────

type RegionFilter = "All" | "Northeast" | "Southeast" | "Midwest" | "Southwest" | "West";
type CodeFilter = "All" | "IBC" | "IECC" | "ASHRAE 90.1";

function adoptionStatusClass(status: StateCodeAdoption["ibc"]["status"]) {
  switch (status) {
    case "adopted":       return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    case "amended":       return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "state-specific": return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
    case "pending":       return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    default:              return "bg-muted text-muted-foreground";
  }
}

function adoptionStatusDot(status: StateCodeAdoption["ibc"]["status"]) {
  switch (status) {
    case "adopted":        return "bg-green-500";
    case "amended":        return "bg-amber-500";
    case "state-specific": return "bg-purple-500";
    case "pending":        return "bg-slate-400";
    default:               return "bg-muted-foreground";
  }
}

function AdoptionBadge({ edition, status, tooltip }: {
  edition: string;
  status: StateCodeAdoption["ibc"]["status"];
  tooltip: string;
}) {
  return (
    <div className="group relative">
      <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${adoptionStatusClass(status)}`}>
        <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${adoptionStatusDot(status)}`} />
        {edition}
      </div>
      <div className="absolute z-10 bottom-full left-0 mb-1 hidden group-hover:block w-56 bg-popover border border-border rounded-md p-2 shadow-lg text-xs text-muted-foreground leading-relaxed">
        {tooltip}
      </div>
    </div>
  );
}

function StateCodeCard({ state }: { state: StateCodeAdoption }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className={`border-border/60 hover:shadow-md transition-shadow ${state.keyMarket ? "ring-1 ring-primary/30" : ""}`}>
      <CardContent className="pt-3 pb-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-mono tracking-tight text-foreground">{state.stateCode}</span>
            <span className="text-sm text-muted-foreground">{state.stateName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {state.keyMarket && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary uppercase tracking-wide">
                <Star size={9} />
                Key Market
              </span>
            )}
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
              {state.region}
            </span>
          </div>
        </div>

        {/* Code badges */}
        <div className="grid grid-cols-3 gap-1.5 mb-2">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 font-medium">IBC</p>
            <AdoptionBadge edition={state.ibc.edition} status={state.ibc.status} tooltip={state.ibc.notes} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 font-medium">IECC</p>
            <AdoptionBadge edition={state.iecc.edition} status={state.iecc.status} tooltip={state.iecc.notes} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 font-medium">ASHRAE</p>
            <AdoptionBadge edition={state.ashrae901.edition} status={state.ashrae901.status} tooltip={state.ashrae901.notes} />
          </div>
        </div>

        {/* FBC note for Florida */}
        {state.flBuildingCode && (
          <div className="mb-2 flex items-start gap-1.5 text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 rounded px-2 py-1.5">
            <AlertTriangle size={11} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-red-700 dark:text-red-300">FBC transition: </span>
              <span className="text-red-800 dark:text-red-200">{state.flBuildingCode.edition} — {state.flBuildingCode.notes}</span>
            </div>
          </div>
        )}

        {/* HVHZ counties */}
        {state.hvhzCounties && state.hvhzCounties.length > 0 && (
          <div className="mb-2 flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wide">HVHZ:</span>
            {state.hvhzCounties.map((c) => (
              <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-medium">{c}</span>
            ))}
          </div>
        )}

        {/* Auto doors note toggle */}
        <button
          className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          onClick={() => setExpanded((e) => !e)}
        >
          <MapPin size={10} />
          Auto Door Impact
          {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-1.5">
                {state.autoDoorsNote}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function StateCodesTab() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("All");
  const [codeFilter, setCodeFilter] = useState<CodeFilter>("All");

  // Days until FBC 9th
  const fbcDays = daysUntil("2026-12-31");

  // KPI: states on IBC 2021+
  const ibc2021Count = STATE_CODE_ADOPTIONS.filter((s) =>
    s.ibc.edition.includes("2021") || s.ibc.edition.includes("2022") || s.ibc.edition.includes("2024")
  ).length;

  // KPI: states on IECC 2021+
  const iecc2021Count = STATE_CODE_ADOPTIONS.filter((s) =>
    s.iecc.edition.includes("2021") || s.iecc.edition.includes("2022") || s.iecc.edition.includes("WSEC 2021")
  ).length;

  // KPI: vestibule-required states (cold climates)
  const vestibuleCount = STATE_CODE_ADOPTIONS.filter((s) =>
    s.autoDoorsNote.toLowerCase().includes("vestibule requirement") ||
    s.autoDoorsNote.toLowerCase().includes("vestibule requirements")
  ).length;

  const regions: RegionFilter[] = ["All", "Northeast", "Southeast", "Midwest", "Southwest", "West"];
  const codeTypes: CodeFilter[] = ["All", "IBC", "IECC", "ASHRAE 90.1"];

  const filtered = useMemo(() => {
    return STATE_CODE_ADOPTIONS.filter((s) => {
      const matchSearch = !search || 
        s.stateName.toLowerCase().includes(search.toLowerCase()) ||
        s.stateCode.toLowerCase().includes(search.toLowerCase());
      const matchRegion = regionFilter === "All" || s.region === regionFilter;
      const matchCode =
        codeFilter === "All" ||
        (codeFilter === "IBC" && s.ibc.edition) ||
        (codeFilter === "IECC" && s.iecc.edition) ||
        (codeFilter === "ASHRAE 90.1" && s.ashrae901.edition);
      return matchSearch && matchRegion && matchCode;
    });
  }, [search, regionFilter, codeFilter]);

  const flState = STATE_CODE_ADOPTIONS.find((s) => s.stateCode === "FL")!;

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/60">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">States on IBC 2021+</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{ibc2021Count}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">States on IECC 2021+</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{iecc2021Count}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Vestibule Required</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{vestibuleCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 ring-1 ring-red-400/40">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">FBC 9th Transition</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{fbcDays}d</p>
            <p className="text-[10px] text-muted-foreground">Dec 31 2026</p>
          </CardContent>
        </Card>
      </div>

      {/* FL Highlight Box */}
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
          <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Florida Critical Transition — FBC 8th to 9th Edition</h3>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-red-200 dark:bg-red-900/60 text-red-800 dark:text-red-200">
            {fbcDays} days remaining
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div className="bg-white/60 dark:bg-black/20 rounded-md p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-red-700 dark:text-red-400 mb-1">Current: FBC 8th Edition</p>
            <p className="text-xs text-red-800 dark:text-red-200">IBC 2021 basis. IECC 2021 energy provisions. In force since Dec 31 2023.</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-md p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300 mb-1">Upcoming: FBC 9th Edition</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">IBC 2024 basis. Effective Dec 31 2026. Wind load, HVHZ, and energy provisions update.</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-red-700 dark:text-red-400 mb-1.5">Affected Products (ASSA ABLOY)</p>
          <div className="flex flex-wrap gap-1.5">
            {["SL500 R104", "SL500 R128", "Windcord 5400", "Windcord 5500"].map((p) => (
              <span key={p} className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200">
                {p}
              </span>
            ))}
          </div>
        </div>
        {flState.hvhzCounties && (
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wide">HVHZ Counties:</span>
            {flState.hvhzCounties.map((c) => (
              <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-medium">{c}</span>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search states..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-muted/50 border border-border/60 rounded-md px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={12} className="text-muted-foreground shrink-0" />
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                regionFilter === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <span className="font-medium">Status:</span>
        {[
          { status: "adopted" as const, label: "Adopted" },
          { status: "amended" as const, label: "Amended" },
          { status: "state-specific" as const, label: "State-Specific" },
          { status: "pending" as const, label: "Pending" },
        ].map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded-full ${adoptionStatusDot(status)}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* State Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((state) => (
          <StateCodeCard key={state.stateCode} state={state} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Globe size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No states match your filters.</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Sources: ICC, ASHRAE, state building department websites, NCSL. Data current as of Q2 2026. Hover over edition badges for full adoption notes. Local jurisdiction amendments may differ from state baseline.
      </p>
    </div>
  );
}


// ─── Main Dashboard ───────────────────────────────────────────────────────────

// ── Suite URLs ──────────────────────────────────────────────────────────────
const SUITE_TOOLS = [
  { id: "doorspec",    label: "DoorSpec",    url: "https://www.perplexity.ai/computer/a/doorspec-fl-compliance-checker-mArd4vh0SLKQrSaF37VB3A" },
  { id: "battlecard", label: "BattleCard",  url: "https://www.perplexity.ai/computer/a/battlecard-competitive-intel-4Mif6CAuTo6iJjchoSDR6g" },
  { id: "codetracker",label: "CodeTracker", url: "https://www.perplexity.ai/computer/a/codetracker-standards-monitor-FgkV.eRtRB6F9EjhOkerBQ" },
  { id: "crosswalkdb",label: "CrosswalkDB", url: "https://www.perplexity.ai/computer/a/crosswalkdb-product-standard-c-XJ6fTEzDTwi0G8I9Vu1sVQ" },
  { id: "pmstudio",   label: "PM Studio",   url: "https://www.perplexity.ai/computer/a/pm-studio-enterprise-npd-platf-34GvBY.6Qde3JnTdr2.etw" },
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
                ? "bg-emerald-600 text-white cursor-default"
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

export default function TrackerDashboard() {
  const { dark, toggle } = useTheme();
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("priority-feed");

  const togglePin = (id: string) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalAlerts = tracks.reduce((sum, t) => sum + t.alertCount, 0);
  const allStds = useMemo(() => getAllStandards(), []);
  const criticalCount = useMemo(() => getCriticalChanges().length, []);
  const totalChanges = useMemo(() => allStds.flatMap((s) => s.recentChanges).length, [allStds]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Suite Nav ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-[60]">
        <SuiteNav activeTool="codetracker" />
      </div>
      {/* ── Top Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-[32px] z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5" data-testid="header-brand">
            <Logo />
            <div>
              <span className="font-bold text-sm tracking-tight">CodeTracker</span>
              <span className="text-xs text-muted-foreground ml-1.5 hidden sm:inline">
                Standards Monitor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalAlerts > 0 && (
              <div
                className="flex items-center gap-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-full text-xs font-semibold"
                data-testid="header-alert-count"
              >
                <AlertTriangle size={12} className="animate-pulse" />
                {totalAlerts} alert{totalAlerts !== 1 ? "s" : ""}
              </div>
            )}
            <span className="text-xs text-muted-foreground hidden md:block">Verified Apr 2026</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              data-testid="theme-toggle"
              className="h-8 w-8"
              title="Toggle dark mode"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Standards Tracked"
            value={`${allStds.length} Standards`}
            icon={<BookOpen size={22} />}
            accent="hsl(var(--primary))"
          />
          <StatCard
            label="Total Changes"
            value={totalChanges}
            icon={<BarChart3 size={22} />}
          />
          <StatCard
            label="Critical Changes"
            value={criticalCount}
            icon={<AlertTriangle size={22} />}
            accent="hsl(var(--destructive))"
          />
          <StatCard
            label="Pinned Items"
            value={pinned.size}
            icon={<Pin size={22} />}
          />
        </div>

        {/* FBC Alert Banner */}
        <div
          className="mb-6 rounded-lg border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/20 px-4 py-3 flex items-start gap-3"
          data-testid="fbc-alert-banner"
        >
          <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              FBC 9th Edition — Effective December 31, 2026
            </p>
            <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5 leading-relaxed">
              Florida projects permitted after Dec 31, 2026 must comply with IBC 2024 §1105.1.1
              vestibule requirements, 160 mph envelope mandate (HB 911), and new TAS 203 water
              infiltration testing. Fenestration document review pending.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="main-tabs">
          <TabsList className="mb-5 h-9 flex-wrap gap-1" data-testid="tab-list">
            <TabsTrigger value="priority-feed" data-testid="tab-priority-feed" className="text-xs">
              Priority Feed
            </TabsTrigger>
            <TabsTrigger value="standards-library" data-testid="tab-standards-library" className="text-xs">
              Standards Library
            </TabsTrigger>
            <TabsTrigger value="product-impact" data-testid="tab-product-impact" className="text-xs">
              Product Impact
            </TabsTrigger>
            <TabsTrigger value="pipeline" data-testid="tab-pipeline" className="text-xs">
              Regulatory Pipeline
            </TabsTrigger>
            <TabsTrigger value="corporate-intel" data-testid="tab-corporate-intel" className="text-xs">
              Corporate Intelligence
            </TabsTrigger>
            <TabsTrigger value="pinboard" data-testid="tab-pinboard" className="text-xs">
              Pinboard {pinned.size > 0 && `(${pinned.size})`}
            </TabsTrigger>
            <TabsTrigger value="state-codes" data-testid="tab-state-codes" className="text-xs">
              <MapIcon size={12} className="mr-1" />
              State Codes
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Priority Feed */}
          <TabsContent value="priority-feed" className="mt-0">
            <PriorityFeed pinned={pinned} onPin={togglePin} />
          </TabsContent>

          {/* Tab 2: Standards Library */}
          <TabsContent value="standards-library" className="mt-0">
            <StandardsLibrary pinned={pinned} onPin={togglePin} />
          </TabsContent>

          {/* Tab 3: Product Impact Tracker */}
          <TabsContent value="product-impact" className="mt-0">
            <ProductImpactTracker />
          </TabsContent>

          {/* Tab 4: Regulatory Pipeline */}
          <TabsContent value="pipeline" className="mt-0">
            <RegulatoryPipeline />
          </TabsContent>

          {/* Tab 5: Corporate Intelligence */}
          <TabsContent value="corporate-intel" className="mt-0">
            <CorporateIntelligence />
          </TabsContent>

          {/* Tab 6: Pinboard */}
          <TabsContent value="pinboard" className="mt-0">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookmarkCheck size={16} className="text-primary" />
                  My Pinboard
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Changes you have bookmarked for follow-up or interview prep
                </p>
              </CardHeader>
              <CardContent>
                <Pinboard pinned={pinned} onPin={togglePin} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 7: State Codes */}
          <TabsContent value="state-codes" className="mt-0">
            <StateCodesTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Logo />
            <span>CodeTracker — Auto Door Standards Monitor</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Sources: BHMA · ICC · NFPA · ASHRAE · IECC · FBC · ASTM · UL · AAADM · Miami-Dade NOA</span>
            <span>Last verified: Apr 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
