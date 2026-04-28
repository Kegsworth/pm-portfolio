import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRODUCTS,
  BRANDS,
  BRAND_MARKET_MAPS,
  COMPETITIVE_MATCHUPS,
  EXTENDED_STANDARDS_REFERENCE,
  getFloridaStatusLabel,
  getCertStatusLabel,
  getAllPMAngles,
  getCompetitiveMatchup,
  type Product,
  type BrandId,
  type DoorMotion,
  type CertStatus,
  type FloridaStatus,
  type MarketVertical,
  type PriceRange,
  ALL_MOTIONS,
  ALL_STANDARDS,
} from "@/lib/crosswalk";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Moon,
  Sun,
  Search,
  X,
  ExternalLink,
  Zap,
  Shield,
  Eye,
  Building2,
  ChevronRight,
  Filter,
  Lightbulb,
  Info,
  BadgeCheck,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  BarChart3,
  MapPin,
  Award,
  Target,
  Layers,
  ChevronDown,
  ChevronUp,
  Wifi,
  Radio,
  BarChart2,
  Globe,
  Cpu,
} from "lucide-react";

// ─── Theme ────────────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  useState(() => { document.documentElement.classList.toggle("dark", dark); });
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };
  return { dark, toggle };
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <svg
      aria-label="CrosswalkDB"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="17" y="3" width="12" height="12" rx="2" stroke="hsl(var(--primary))" strokeWidth="1.8" fill="hsl(var(--primary) / 0.12)" />
      <rect x="3" y="17" width="12" height="12" rx="2" stroke="hsl(var(--primary))" strokeWidth="1.8" fill="hsl(var(--primary) / 0.12)" />
      <rect x="17" y="17" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <line x1="16" y1="6" x2="16" y2="26" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="6" y1="16" x2="26" y2="16" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

// ─── Cert badge ───────────────────────────────────────────────────────────────
function CertBadge({ status }: { status: CertStatus }) {
  const cls = {
    certified:    "cert-certified",
    partial:      "cert-partial",
    verify:       "cert-verify",
    "not-listed": "cert-not-listed",
  }[status] || "cert-verify";

  const Icon = {
    certified:    CheckCircle2,
    partial:      AlertTriangle,
    verify:       HelpCircle,
    "not-listed": XCircle,
  }[status] || HelpCircle;

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${cls}`}>
      <Icon size={10} />
      {getCertStatusLabel(status)}
    </span>
  );
}

// ─── FL badge ─────────────────────────────────────────────────────────────────
function FLBadge({ status, hvhz }: { status: FloridaStatus; hvhz: boolean }) {
  const cls = {
    "noa-certified": "fl-certified",
    "hvhz-listed":   "fl-certified",
    "noa-pending":   "fl-verify",
    "not-certified": "fl-not-certified",
    "verify":        "fl-verify",
  }[status] || "fl-verify";

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${cls}`}>
      {hvhz && <BadgeCheck size={10} />}
      {getFloridaStatusLabel(status)}
      {hvhz && <span className="opacity-70 ml-0.5">HVHZ</span>}
    </span>
  );
}

// ─── Brand badge ──────────────────────────────────────────────────────────────
function BrandBadge({ brand }: { brand: BrandId }) {
  const cls = {
    assa_abloy: "brand-assa",
    dormakaba:  "brand-dormakaba",
    stanley:    "brand-stanley",
    horton:     "brand-horton",
  }[brand] || "brand-horton";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {BRANDS[brand].name}
    </span>
  );
}

// ─── Motion dot ───────────────────────────────────────────────────────────────
function MotionDot({ motion }: { motion: DoorMotion }) {
  const cls = {
    sliding:     "motion-dot-sliding",
    swing:       "motion-dot-swing",
    folding:     "motion-dot-folding",
    telescoping: "motion-dot-telescoping",
    revolving:   "motion-dot-sliding",
    hermetic:    "motion-dot-hermetic",
  }[motion] || "bg-muted-foreground";
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${cls}`} />;
}

// ─── Energy class badge ───────────────────────────────────────────────────────
function EnergyBadge({ cls: energyClass }: { cls: string }) {
  const label: Record<string, string> = {
    "full-energy":   "Full Energy",
    "low-energy":    "Low Energy",
    "power-assist":  "Power Assist",
    "manual-open":   "Manual Open",
  };
  const color: Record<string, string> = {
    "full-energy":  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    "low-energy":   "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    "power-assist": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    "manual-open":  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${color[energyClass] || ""}`}>
      {label[energyClass] || energyClass}
    </span>
  );
}

// ─── Price badge ──────────────────────────────────────────────────────────────
function PriceBadge({ range }: { range: PriceRange }) {
  const map: Record<PriceRange, { label: string; cls: string }> = {
    economy:       { label: "$", cls: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300" },
    mid:           { label: "$$", cls: "text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300" },
    premium:       { label: "$$$", cls: "text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300" },
    "ultra-premium": { label: "$$$$", cls: "text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300" },
  };
  const { label, cls } = map[range] || map.mid;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-bold ${cls}`}>
      {label}
    </span>
  );
}

// ─── Sensor category icon ─────────────────────────────────────────────────────
function SensorIcon({ cat }: { cat: string }) {
  switch (cat) {
    case "activation":  return <Zap size={13} className="text-amber-500" />;
    case "presence":    return <Eye size={13} className="text-blue-500" />;
    case "safety":      return <Shield size={13} className="text-red-500" />;
    case "obstruction": return <AlertTriangle size={13} className="text-orange-500" />;
    default: return <Info size={13} />;
  }
}

// ─── Crosswalk cell (mini grid inside drawer) ─────────────────────────────────
function CrosswalkCell({ standard, product }: { standard: string; product: Product }) {
  const cert = product.standardCerts.find((c) => c.standard === standard);
  if (!cert) return (
    <div className="p-2 rounded bg-muted/40 text-center">
      <XCircle size={14} className="mx-auto text-muted-foreground/40 mb-1" />
      <p className="text-xs text-muted-foreground">Not applicable</p>
    </div>
  );
  return (
    <div className="p-2 rounded bg-card border border-border/60">
      <CertBadge status={cert.status} />
      <p className="text-xs text-muted-foreground mt-1">{cert.edition}</p>
      <p className="text-xs mt-1 leading-relaxed">{cert.notes}</p>
      {cert.keyRequirements && cert.keyRequirements.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {cert.keyRequirements.map((r, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-1">
              <span className="text-primary">›</span> {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Product Detail Drawer ────────────────────────────────────────────────────
function ProductDrawer({
  product,
  open,
  onClose,
  onSelectProduct,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}) {
  const [pmTab, setPmTab] = useState<"all" | "interview" | "strategy">("all");

  if (!product) return null;

  const matchup = getCompetitiveMatchup(product.id);
  const allAngles = product.pmAngles;
  const filteredAngles = pmTab === "all"
    ? allAngles
    : allAngles.filter((a) => a.useIn === pmTab || a.useIn === "both");

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto"
        data-testid="product-drawer"
      >
        <SheetHeader className="mb-4">
          <div className="flex items-start gap-3">
            <MotionDot motion={product.motion} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <BrandBadge brand={product.brand} />
                <span className="text-xs text-muted-foreground capitalize">{product.motion}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <EnergyBadge cls={product.energyClass} />
                <PriceBadge range={product.priceRange} />
              </div>
              <SheetTitle className="text-lg leading-snug">{product.fullName}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-5 slide-in">

          {/* Market verticals */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Market Verticals
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.marketVerticals.map((v) => (
                <Badge key={v} variant="secondary" className="text-xs capitalize">{v}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Standards crosswalk */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              ANSI/BHMA Certifications
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ALL_STANDARDS.map((std) => (
                <div key={std}>
                  <p className="text-xs font-bold text-center mb-1 font-mono">{std}</p>
                  <CrosswalkCell standard={std} product={product} />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Florida approval */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
              <Building2 size={13} />
              Florida Compliance
            </p>
            <div className="bg-card border border-border/60 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <FLBadge status={product.floridaApproval.status} hvhz={product.floridaApproval.hvhz} />
                {product.floridaApproval.testStandards && (
                  <div className="flex gap-1 flex-wrap">
                    {product.floridaApproval.testStandards.map((t) => (
                      <span key={t} className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              {product.floridaApproval.noaNumber && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">NOA:</span> {product.floridaApproval.noaNumber}
                </p>
              )}
              {product.floridaApproval.designPressure && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Design Pressure:</span> {product.floridaApproval.designPressure}
                </p>
              )}
              <p className="text-xs leading-relaxed text-muted-foreground">
                {product.floridaApproval.notes}
              </p>
              {product.floridaApproval.fbc9thNotes && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded p-2 mt-1">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">FBC 9th Ed. (eff. Dec 31, 2026)</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400/80 leading-relaxed">
                    {product.floridaApproval.fbc9thNotes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Key specs */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Key Specifications
            </p>
            <div className="rounded-lg border border-border/60 overflow-hidden">
              {Object.entries(product.keySpecs).map(([k, v], i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 px-3 py-2 text-xs ${
                    i % 2 === 0 ? "bg-muted/30" : "bg-card"
                  }`}
                >
                  <span className="font-medium text-muted-foreground shrink-0 w-36">{k}</span>
                  <span className="text-foreground leading-relaxed">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sensor ecosystem */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
              <Zap size={13} />
              Sensor Ecosystem
            </p>
            <div className="space-y-2">
              {product.sensorSpecs.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 rounded bg-muted/40"
                  data-testid={`sensor-row-${i}`}
                >
                  <SensorIcon cat={s.category} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold capitalize">{s.category}</span>
                      {s.standard && (
                        <span className="text-xs text-muted-foreground font-mono">{s.standard}</span>
                      )}
                      {s.optional && (
                        <span className="text-xs text-muted-foreground">(optional)</span>
                      )}
                    </div>
                    <p className="text-xs font-medium mt-0.5">{s.type}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sensor Compatibility Badges */}
          {(product as Product & { sensorCompatibility?: string[] }).sensorCompatibility?.length ? (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-2">
                  <Wifi size={13} className="text-violet-500" />
                  Sensor Compatibility
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(product as Product & { sensorCompatibility?: string[] }).sensorCompatibility!.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border border-violet-200 dark:border-violet-800"
                      data-testid={`sensor-compat-badge-${i}`}
                    >
                      <Radio size={9} className="shrink-0" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          <Separator />

          {/* Key differentiators */}
          {product.keyDifferentiators && product.keyDifferentiators.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-2">
                <TrendingUp size={13} className="text-emerald-500" />
                Key Differentiators
              </p>
              <ul className="space-y-1">
                {product.keyDifferentiators.map((d, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex gap-2">
                    <span className="text-emerald-500 shrink-0">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Known limitations */}
          {product.knownLimitations && product.knownLimitations.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-2">
                <TrendingDown size={13} className="text-red-400" />
                Known Limitations
              </p>
              <ul className="space-y-1">
                {product.knownLimitations.map((l, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex gap-2">
                    <span className="text-red-400 shrink-0">–</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Competitive threats */}
          {product.competitiveThreats && product.competitiveThreats.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-2">
                <Target size={13} className="text-amber-500" />
                Competitive Threats
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.competitiveThreats.map((tid) => {
                  const threat = PRODUCTS.find((p) => p.id === tid);
                  if (!threat) return null;
                  return (
                    <button
                      key={tid}
                      onClick={() => onSelectProduct(tid)}
                      className="text-xs px-2 py-1 rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-300 transition-colors flex items-center gap-1"
                      data-testid={`threat-link-${tid}`}
                    >
                      <BrandBadge brand={threat.brand} />
                      <span>{threat.name}</span>
                      <ChevronRight size={10} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* PM Angles — the most important section */}
          {product.pmAngles.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <Lightbulb size={13} className="text-amber-500" />
                PM Intelligence
              </p>
              {/* PM angle tab filter */}
              <div className="flex gap-1 mb-3">
                {(["all", "interview", "strategy"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPmTab(t)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
                      pmTab === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                    data-testid={`pm-tab-${t}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {filteredAngles.map((a, i) => (
                  <div
                    key={i}
                    className="border border-primary/20 bg-primary/5 rounded-lg p-3"
                    data-testid={`pm-angle-${i}`}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-xs font-bold">{a.topic}</p>
                      {a.useIn && (
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground capitalize">
                          {a.useIn}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{a.insight}</p>
                  </div>
                ))}
                {filteredAngles.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No angles for this filter.</p>
                )}
              </div>
            </div>
          )}

          {/* Competitive matchup if available */}
          {matchup && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                  <BarChart3 size={13} />
                  Competitive Summary
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-3">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
                      <TrendingUp size={11} /> Win Factors
                    </p>
                    <ul className="space-y-1">
                      {matchup.winFactors.map((w, i) => (
                        <li key={i} className="text-xs text-emerald-800 dark:text-emerald-300 flex gap-1">
                          <span className="shrink-0">+</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 p-3">
                    <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
                      <TrendingDown size={11} /> Lose Factors
                    </p>
                    <ul className="space-y-1">
                      {matchup.loseFactors.map((l, i) => (
                        <li key={i} className="text-xs text-red-800 dark:text-red-300 flex gap-1">
                          <span className="shrink-0">–</span> {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Related Tools — BattleCard deep link */}
          <div className="pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Related Tools</p>
            <button
              onClick={() => window.open("https://battlecard-aadm.vercel.app", "_blank")}
              className="inline-flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 px-3 py-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              data-testid="battlecard-link"
            >
              See competitive talk track → BattleCard
            </button>
          </div>

          {product.productUrl && (
            <a
              href={product.productUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              data-testid="product-url-link"
            >
              <ExternalLink size={11} />
              Official Product Page
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Tab 1: Product Matrix ────────────────────────────────────────────────────

interface Filters {
  search: string;
  brands: BrandId[];
  motions: DoorMotion[];
  energyClasses: string[];
  verticals: MarketVertical[];
  priceRanges: PriceRange[];
  hvhzOnly: boolean;
  sensorTypes: string[];
}

const ALL_BRANDS: BrandId[] = ["assa_abloy", "dormakaba", "stanley", "horton"];
const ALL_VERTICALS: MarketVertical[] = ["retail", "healthcare", "hospitality", "airport", "industrial", "government", "qsr", "education"];
const ALL_PRICE_RANGES: PriceRange[] = ["economy", "mid", "premium", "ultra-premium"];
const ALL_ENERGY_CLASSES = ["full-energy", "low-energy", "power-assist", "manual-open"];
const ALL_SENSOR_TYPES = ["Microwave", "IR", "Bluetooth/App", "Radar", "Access Control", "Nurse Call"] as const;
type SensorFilterType = typeof ALL_SENSOR_TYPES[number];

function matchesSensorFilter(product: Product, sensorTypes: string[]): boolean {
  if (sensorTypes.length === 0) return true;
  const compat = (product as Product & { sensorCompatibility?: string[] }).sensorCompatibility || [];
  const sensorText = [
    ...compat,
    ...product.sensorSpecs.map((s) => s.type),
  ].join(" ").toLowerCase();
  return sensorTypes.every((t) => {
    switch (t) {
      case "Microwave": return sensorText.includes("microwave");
      case "IR": return sensorText.includes("ir ") || sensorText.includes("ir safety") || sensorText.includes("infrared");
      case "Bluetooth/App": return sensorText.includes("bluetooth") || sensorText.includes("app");
      case "Radar": return sensorText.includes("radar");
      case "Access Control": return sensorText.includes("access control") || sensorText.includes("badge");
      case "Nurse Call": return sensorText.includes("nurse call");
      default: return false;
    }
  });
}

function FilterBar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }
  function clearAll() {
    onChange({ search: "", brands: [], motions: [], energyClasses: [], verticals: [], priceRanges: [], hvhzOnly: false, sensorTypes: [] });
  }
  const hasFilters = filters.search || filters.brands.length || filters.motions.length ||
    filters.energyClasses.length || filters.verticals.length || filters.priceRanges.length || filters.hvhzOnly || filters.sensorTypes.length;

  return (
    <div className="space-y-3" data-testid="filter-bar">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8 h-8 text-sm"
          placeholder="Search products, brands, applications..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          data-testid="search-input"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Brand chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground font-medium">Brand:</span>
        {ALL_BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => onChange({ ...filters, brands: toggle(filters.brands, b) })}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              filters.brands.includes(b)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted"
            }`}
            data-testid={`filter-brand-${b}`}
          >
            {BRANDS[b].name}
          </button>
        ))}
      </div>

      {/* Motion + Energy chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground font-medium">Motion:</span>
        {ALL_MOTIONS.map((m) => (
          <button
            key={m}
            onClick={() => onChange({ ...filters, motions: toggle(filters.motions, m) })}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
              filters.motions.includes(m)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted"
            }`}
            data-testid={`filter-motion-${m}`}
          >
            {m}
          </button>
        ))}
        <span className="w-px h-4 bg-border" />
        <span className="text-xs text-muted-foreground font-medium">Energy:</span>
        {ALL_ENERGY_CLASSES.map((e) => (
          <button
            key={e}
            onClick={() => onChange({ ...filters, energyClasses: toggle(filters.energyClasses, e) })}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              filters.energyClasses.includes(e)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted"
            }`}
            data-testid={`filter-energy-${e}`}
          >
            {e.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Vertical + Price + HVHZ */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground font-medium">Vertical:</span>
        {ALL_VERTICALS.map((v) => (
          <button
            key={v}
            onClick={() => onChange({ ...filters, verticals: toggle(filters.verticals, v) })}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
              filters.verticals.includes(v)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted"
            }`}
            data-testid={`filter-vertical-${v}`}
          >
            {v}
          </button>
        ))}
        <span className="w-px h-4 bg-border" />
        <button
          onClick={() => onChange({ ...filters, hvhzOnly: !filters.hvhzOnly })}
          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
            filters.hvhzOnly
              ? "border-green-600 bg-green-600 text-white"
              : "border-border bg-card hover:bg-muted"
          }`}
          data-testid="filter-hvhz"
        >
          HVHZ Only
        </button>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground flex items-center gap-1"
            data-testid="filter-clear"
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      {/* Sensor Type filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <Wifi size={11} /> Sensor:
        </span>
        {ALL_SENSOR_TYPES.map((s) => (
          <button
            key={s}
            onClick={() => onChange({ ...filters, sensorTypes: toggle(filters.sensorTypes, s) })}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              filters.sensorTypes.includes(s)
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-border bg-card hover:bg-muted"
            }`}
            data-testid={`filter-sensor-${s.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
          >
            {s}
          </button>
        ))}
        {filters.sensorTypes.length > 0 && (
          <span className="text-xs text-muted-foreground italic">
            Showing products with ALL selected sensors
          </span>
        )}
      </div>
    </div>
  );
}

function ProductMatrix({ onSelectProduct }: { onSelectProduct: (p: Product) => void }) {
  const [filters, setFilters] = useState<Filters>({
    search: "", brands: [], motions: [], energyClasses: [], verticals: [], priceRanges: [], hvhzOnly: false, sensorTypes: [],
  });

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.motions.length && !filters.motions.includes(p.motion)) return false;
      if (filters.energyClasses.length && !filters.energyClasses.includes(p.energyClass)) return false;
      if (filters.verticals.length && !filters.verticals.some((v) => p.marketVerticals?.includes(v))) return false;
      if (filters.hvhzOnly && !p.floridaApproval.hvhz) return false;
      if (filters.sensorTypes.length && !matchesSensorFilter(p, filters.sensorTypes)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.fullName.toLowerCase().includes(q) ||
          BRANDS[p.brand].name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.primaryApplication.some((a) => a.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-4">
      <FilterBar filters={filters} onChange={setFilters} />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredProducts.length}</span> of {PRODUCTS.length} products
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Filter size={11} />
          Click any row to see full detail
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-sm min-w-[1050px]" data-testid="crosswalk-table">
          <thead>
            <tr className="bg-muted/60 dark:bg-muted/30">
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[170px]">Product</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[110px]">Brand</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[80px]">Motion</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[100px]">Energy</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[88px] font-mono">A156.10</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[88px] font-mono">A156.19</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[88px] font-mono">A156.38</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[130px]">FL / HVHZ</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[50px]">Price</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Installed Base</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[130px]">GM Tier</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[100px]">Cost-to-Serve</th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[110px]">Revenue Exp.</th>
              <th className="text-center px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[60px]">Risk</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredProducts.map((p, i) => {
              const a15610 = p.standardCerts.find((c) => c.standard === "A156.10");
              const a15619 = p.standardCerts.find((c) => c.standard === "A156.19");
              const a15638 = p.standardCerts.find((c) => c.standard === "A156.38");
              const revRisk = getRevenueRisk(p.name);
              return (
                <tr
                  key={p.id}
                  className={`cursor-pointer hover:bg-primary/5 transition-colors ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                  onClick={() => onSelectProduct(p)}
                  data-testid={`table-row-${p.id}`}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <MotionDot motion={p.motion} />
                      <p className="font-semibold text-xs leading-tight">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-3 py-2.5"><BrandBadge brand={p.brand} /></td>
                  <td className="px-3 py-2.5"><span className="text-xs capitalize text-muted-foreground">{p.motion}</span></td>
                  <td className="px-3 py-2.5"><EnergyBadge cls={p.energyClass} /></td>
                  <td className="px-3 py-2.5">
                    {a15610 ? <CertBadge status={a15610.status} /> : <span className="text-xs text-muted-foreground/40">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {a15619 ? <CertBadge status={a15619.status} /> : <span className="text-xs text-muted-foreground/40">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {a15638 ? <CertBadge status={a15638.status} /> : <span className="text-xs text-muted-foreground/40">—</span>}
                  </td>
                  <td className="px-3 py-2.5"><FLBadge status={p.floridaApproval.status} hvhz={p.floridaApproval.hvhz} /></td>
                  <td className="px-3 py-2.5"><PriceBadge range={p.priceRange} /></td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs capitalize text-muted-foreground">{p.installedBase}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <GmTierBadge tier={getGmTier(p.id)} />
                  </td>
                  <td className="px-3 py-2.5">
                    <CostToServeDots value={getCostToServe(p.id)} />
                  </td>
                  <td className="px-3 py-2.5">
                    {revRisk ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground">{revRisk.revenue}</span>
                        <RiskBadge risk={revRisk.risk} />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {revRisk ? (
                      <RiskSignalIcon risk={revRisk.risk} drivers={revRisk.drivers} />
                    ) : (
                      <span className="text-xs text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-2 py-2.5"><ChevronRight size={13} className="text-muted-foreground/40" /></td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={15} className="px-3 py-12 text-center text-sm text-muted-foreground">
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-muted/60 dark:bg-muted/30 border-t border-border/60">
              <td colSpan={13} className="px-3 py-2 text-xs text-muted-foreground font-medium">
                Products tracked: 15 · Revenue in matrix: $48.5M
              </td>
              <td colSpan={2} className="px-3 py-2 text-xs">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">High/Medium risk: $28.4M</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 2: Market Coverage Map ───────────────────────────────────────────────

const STRENGTH_CONFIG = {
  dominant: { label: "Dominant", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800" },
  strong:   { label: "Strong",   cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-200 dark:border-blue-800" },
  moderate: { label: "Moderate", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-200 dark:border-amber-800" },
  weak:     { label: "Weak",     cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700" },
  absent:   { label: "Absent",   cls: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800" },
};

function MarketCoverageMap() {
  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground font-medium mr-1">Strength:</span>
        {Object.entries(STRENGTH_CONFIG).map(([k, v]) => (
          <span key={k} className={`text-xs px-2 py-0.5 rounded border ${v.cls}`}>{v.label}</span>
        ))}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-xs min-w-[700px]" data-testid="market-coverage-grid">
          <thead>
            <tr className="bg-muted/60 dark:bg-muted/30">
              <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground uppercase tracking-wide w-[130px]">Brand</th>
              {ALL_VERTICALS.map((v) => (
                <th key={v} className="text-center px-2 py-2.5 font-semibold text-muted-foreground uppercase tracking-wide capitalize">{v}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {ALL_BRANDS.map((brand, i) => {
              const map = BRAND_MARKET_MAPS[brand];
              return (
                <tr key={brand} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="px-3 py-2.5">
                    <BrandBadge brand={brand} />
                  </td>
                  {ALL_VERTICALS.map((v) => {
                    const strength = map?.verticalStrength[v] || "absent";
                    const cfg = STRENGTH_CONFIG[strength];
                    return (
                      <td key={v} className="px-2 py-2.5 text-center">
                        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded border text-xs ${cfg.cls}`}>
                          {cfg.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Brand comparison cards */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Brand Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {ALL_BRANDS.map((brand) => {
            const b = BRANDS[brand];
            const map = BRAND_MARKET_MAPS[brand];
            const products = PRODUCTS.filter((p) => p.brand === brand);
            const hvhzCount = products.filter((p) => p.floridaApproval.hvhz).length;
            return (
              <Card key={brand} className="border-border/60" data-testid={`market-brand-card-${brand}`}>
                <CardHeader className="pb-2 pt-4">
                  <BrandBadge brand={brand} />
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.marketPosition}</p>
                </CardHeader>
                <CardContent className="pb-4 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div className="bg-muted/40 rounded p-2">
                      <p className="text-muted-foreground">Service Footprint</p>
                      <p className="font-semibold capitalize mt-0.5">{map?.usServiceFootprint || "—"}</p>
                    </div>
                    <div className={`rounded p-2 ${map?.flHvhzReady ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-muted/40"}`}>
                      <p className="text-muted-foreground">FL HVHZ Ready</p>
                      <p className={`font-semibold mt-0.5 ${map?.flHvhzReady ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                        {map?.flHvhzReady ? "Yes" : "No"} ({hvhzCount} products)
                      </p>
                    </div>
                    <div className="bg-muted/40 rounded p-2">
                      <p className="text-muted-foreground">Price Index</p>
                      <p className="font-semibold mt-0.5">{map?.priceIndex ?? "—"} / 10</p>
                    </div>
                    <div className="bg-muted/40 rounded p-2">
                      <p className="text-muted-foreground">Cert Depth</p>
                      <p className="font-semibold capitalize mt-0.5">{map?.certificationDepth || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Standards Gap Analysis ───────────────────────────────────────────

interface GapStandard {
  id: string;
  name: string;
  description: string;
  pmInsight: string;
  getCovered: (p: Product) => boolean;
  getVerify: (p: Product) => boolean;
}

const GAP_STANDARDS: GapStandard[] = [
  {
    id: "a15610",
    name: "ANSI/BHMA A156.10",
    description: "Power-Operated Pedestrian Doors (full-energy sliding, swing, folding, revolving)",
    pmInsight: "A156.10 is the primary safety standard for full-energy automatic doors. A 2024 update reduced max closing force from 40 lbf to 30 lbf, triggering controller updates across all major brands. PM angle: how does a standards change propagate through product roadmap, firmware certification, and install-base advisories?",
    getCovered: (p) => p.standardCerts.some((c) => c.standard === "A156.10" && c.status === "certified"),
    getVerify: (p) => p.standardCerts.some((c) => c.standard === "A156.10" && c.status === "verify"),
  },
  {
    id: "a15619",
    name: "ANSI/BHMA A156.19",
    description: "Power Assist and Low-Energy Power-Operated Doors",
    pmInsight: "A156.19 governs low-energy and power-assist doors requiring user actuation. The key PM gap: many products serving healthcare and accessibility markets are A156.19 territory, but not all are explicitly listed. Verify before specifying for ADA accessible route compliance.",
    getCovered: (p) => p.standardCerts.some((c) => c.standard === "A156.19" && c.status === "certified"),
    getVerify: (p) => p.standardCerts.some((c) => c.standard === "A156.19" && c.status === "verify"),
  },
  {
    id: "a15638",
    name: "ANSI/BHMA A156.38",
    description: "Low Energy Sliding and Folding Doors (first edition 2019)",
    pmInsight: "A156.38 is the newest standard, still seeing first-cycle certification. PM angle: which competitors moved fastest to certify against A156.38? This is an active differentiator in bid specs that reference the standard explicitly.",
    getCovered: (p) => p.standardCerts.some((c) => c.standard === "A156.38" && c.status === "certified"),
    getVerify: (p) => p.standardCerts.some((c) => c.standard === "A156.38" && c.status === "verify"),
  },
  {
    id: "hvhz-noa",
    name: "Florida NOA / TAS 201-203 (HVHZ)",
    description: "Miami-Dade / Broward County High-Velocity Hurricane Zone exterior product approval",
    pmInsight: "NOA certification is a binary market-access gate for exterior automatic doors in Florida HVHZ. ASSA ABLOY has invested most deeply in this area. FBC 9th Ed. (eff. Dec 31, 2026) raises the envelope to 160 mph, requiring re-certification for many products. PM angle: anticipate the re-cert wave as a displacement opportunity.",
    getCovered: (p) => p.floridaApproval.hvhz && p.floridaApproval.status === "noa-certified",
    getVerify: (p) => p.floridaApproval.status === "verify" || p.floridaApproval.status === "noa-pending",
  },
  {
    id: "fgi",
    name: "FGI Guidelines (Healthcare)",
    description: "Facility Guidelines Institute: healthcare-specific door width (44.5 in. clear) and motion requirements",
    pmInsight: "FGI compliance for hospital ICU/CCU requires minimum 44.5 in. clear opening on 8 ft frames — this restricts which standard sliding operators can serve this market. Only dedicated healthcare variants (VersaMax, ProCare 8300BP, Horton ICU) meet this spec explicitly. PM interview angle: how do you identify regulatory-driven market segments in a capital equipment category?",
    getCovered: (p) => p.primaryApplication.some((a) => a.toLowerCase().includes("healthcare") || a.toLowerCase().includes("hospital") || a.toLowerCase().includes("icu")),
    getVerify: (p) => false,
  },
  {
    id: "astm-e1996",
    name: "ASTM E1996 (Hurricane Impact)",
    description: "ASTM E1996 / AAMA 506 impact-rated glazing for wind-borne debris regions",
    pmInsight: "ASTM E1996 is the glazing impact standard referenced by FBC for windborne debris zones. Stanley Dura-Storm explicitly targets this. Only a handful of automatic door products carry E1996-rated glazing. PM angle: when a geographic market (Florida, Gulf Coast) has a regulatory requirement that most incumbents cannot meet, that is a durable niche. How does Stanley price this premium?",
    getCovered: (p) => p.name.toLowerCase().includes("storm") || p.name.toLowerCase().includes("shield") || (p.keySpecs && Object.values(p.keySpecs).some((v) => v.toLowerCase().includes("astm") || v.toLowerCase().includes("e1996"))),
    getVerify: (p) => p.floridaApproval.status === "verify",
  },
];

function GapCard({ std }: { std: GapStandard }) {
  const [expanded, setExpanded] = useState(false);
  const covered = PRODUCTS.filter(std.getCovered);
  const verify = PRODUCTS.filter((p) => !std.getCovered(p) && std.getVerify(p));
  const notCovered = PRODUCTS.filter((p) => !std.getCovered(p) && !std.getVerify(p));

  return (
    <Card className="border-border/60" data-testid={`gap-card-${std.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BadgeCheck size={15} className="text-primary shrink-0" />
              <span className="text-xs font-mono font-bold text-primary">{std.name}</span>
            </div>
            <CardTitle className="text-sm">{std.description}</CardTitle>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-2 p-1 rounded hover:bg-muted transition-colors"
            data-testid={`gap-expand-${std.id}`}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        {/* Summary counts */}
        <div className="flex gap-2 mt-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 size={10} /> {covered.length} covered
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            <HelpCircle size={10} /> {verify.length} verify
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <XCircle size={10} /> {notCovered.length} not covered
          </span>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pb-4 space-y-3">
          {/* PM insight */}
          <div className="border border-primary/20 bg-primary/5 rounded-lg p-3">
            <p className="text-xs font-bold mb-1 flex items-center gap-1">
              <Lightbulb size={11} className="text-amber-500" /> PM Insight
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{std.pmInsight}</p>
          </div>

          {covered.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Covered ({covered.length})</p>
              <div className="flex flex-wrap gap-1">
                {covered.map((p) => (
                  <span key={p.id} className="text-xs bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                    <BrandBadge brand={p.brand} />
                    <span>{p.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {verify.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Needs Verification ({verify.length})</p>
              <div className="flex flex-wrap gap-1">
                {verify.map((p) => (
                  <span key={p.id} className="text-xs bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                    <BrandBadge brand={p.brand} />
                    <span>{p.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {notCovered.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Not Covered ({notCovered.length})</p>
              <div className="flex flex-wrap gap-1">
                {notCovered.map((p) => (
                  <span key={p.id} className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <BrandBadge brand={p.brand} />
                    <span>{p.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function StandardsGapAnalysis() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Standards coverage across all {PRODUCTS.length} products. Click any card to expand product lists and PM insights.
      </p>
      {GAP_STANDARDS.map((std) => (
        <GapCard key={std.id} std={std} />
      ))}
    </div>
  );
}

// ─── Tab 4: Head-to-Head ──────────────────────────────────────────────────────

function HeadToHead({ onSelectProduct }: { onSelectProduct: (p: Product) => void }) {
  const [selectedId, setSelectedId] = useState<string>(PRODUCTS[0]?.id || "");

  const product = PRODUCTS.find((p) => p.id === selectedId);
  const matchup = selectedId ? getCompetitiveMatchup(selectedId) : undefined;

  const competitors = matchup
    ? matchup.directCompetitors.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as Product[]
    : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium">Select product:</span>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-72 h-8 text-sm" data-testid="h2h-product-select">
            <SelectValue placeholder="Choose a product..." />
          </SelectTrigger>
          <SelectContent>
            {ALL_BRANDS.map((brand) => (
              <div key={brand}>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/40 mt-1">
                  {BRANDS[brand].name}
                </div>
                {PRODUCTS.filter((p) => p.brand === brand).map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-sm">
                    {p.name}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {product && (
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-5"
        >
          {/* Selected product overview */}
          <Card className="border-border/60">
            <CardHeader className="pb-2 pt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <BrandBadge brand={product.brand} />
                <EnergyBadge cls={product.energyClass} />
                <PriceBadge range={product.priceRange} />
              </div>
              <CardTitle className="text-base">{product.fullName}</CardTitle>
              <p className="text-xs text-muted-foreground leading-relaxed">{product.description}</p>
            </CardHeader>
            <CardContent className="pb-4">
              <button
                onClick={() => onSelectProduct(product)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
                data-testid="h2h-open-drawer"
              >
                <ExternalLink size={10} /> View full product detail
              </button>
            </CardContent>
          </Card>

          {/* Matchup */}
          {matchup && matchup.directCompetitors.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Target size={14} className="text-amber-500" />
                Direct Competitors ({competitors.length})
              </h3>
              <div className="space-y-4">
                {competitors.map((comp) => (
                  <Card key={comp.id} className="border-border/60" data-testid={`h2h-vs-${comp.id}`}>
                    <CardHeader className="pb-2 pt-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">vs.</span>
                          <BrandBadge brand={comp.brand} />
                          <span className="font-semibold text-sm">{comp.name}</span>
                          <EnergyBadge cls={comp.energyClass} />
                        </div>
                        <button
                          onClick={() => onSelectProduct(comp)}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                          data-testid={`h2h-view-${comp.id}`}
                        >
                          <ExternalLink size={10} /> View detail
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{comp.description.slice(0, 120)}...</p>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 p-3">
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
                            <TrendingUp size={11} /> Why {product.name} wins
                          </p>
                          <ul className="space-y-1">
                            {matchup.winFactors.map((w, i) => (
                              <li key={i} className="text-xs text-emerald-800 dark:text-emerald-300 flex gap-1.5">
                                <span className="shrink-0">+</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/20 p-3">
                          <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
                            <TrendingDown size={11} /> Where {product.name} loses
                          </p>
                          <ul className="space-y-1">
                            {matchup.loseFactors.map((l, i) => (
                              <li key={i} className="text-xs text-red-800 dark:text-red-300 flex gap-1.5">
                                <span className="shrink-0">–</span> {l}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* Recommended positioning */}
                      <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs font-bold mb-1 flex items-center gap-1">
                          <Lightbulb size={11} className="text-amber-500" /> Recommended Positioning
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Lead with {product.name}'s strengths where they map to the project spec: {matchup.winFactors.slice(0, 2).join("; ")}. When competing on price with {comp.name}, focus on TCO and service network depth rather than sticker price.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-6 text-center">
              <Info size={20} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No competitive matchup data available for this product yet.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Tab 5: PM Intelligence ───────────────────────────────────────────────────

function CopyButton({ text, idx }: { text: string; idx: number }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2 py-1 rounded border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1 shrink-0"
      data-testid={`btn-copy-angle-${idx}`}
    >
      {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function PMIntelligence() {
  const [tagFilter, setTagFilter] = useState<"all" | "interview" | "strategy" | "both">("all");
  const [brandFilter, setBrandFilter] = useState<BrandId | "all">("all");
  const [keyword, setKeyword] = useState("");

  const allAngles = useMemo(() => getAllPMAngles(), []);

  const filtered = useMemo(() => {
    return allAngles.filter((item) => {
      const p = PRODUCTS.find((x) => x.id === item.productId);
      if (!p) return false;
      if (brandFilter !== "all" && p.brand !== brandFilter) return false;
      if (tagFilter !== "all") {
        if (tagFilter === "both" && item.angle.useIn !== "both") return false;
        if (tagFilter === "interview" && item.angle.useIn !== "interview" && item.angle.useIn !== "both") return false;
        if (tagFilter === "strategy" && item.angle.useIn !== "strategy" && item.angle.useIn !== "both") return false;
      }
      if (keyword) {
        const q = keyword.toLowerCase();
        return (
          item.angle.topic.toLowerCase().includes(q) ||
          item.angle.insight.toLowerCase().includes(q) ||
          item.productName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allAngles, tagFilter, brandFilter, keyword]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Tag filter */}
        <div className="flex gap-1">
          {(["all", "interview", "strategy", "both"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
                tagFilter === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              }`}
              data-testid={`pm-filter-tag-${t}`}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="w-px h-4 bg-border" />
        {/* Brand filter */}
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setBrandFilter("all")}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              brandFilter === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted"
            }`}
            data-testid="pm-filter-brand-all"
          >
            All brands
          </button>
          {ALL_BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrandFilter(b)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                brandFilter === b
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              }`}
              data-testid={`pm-filter-brand-${b}`}
            >
              {BRANDS[b].name}
            </button>
          ))}
        </div>
        <span className="w-px h-4 bg-border" />
        {/* Keyword */}
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-7 h-7 text-xs w-52"
            placeholder="Search topic or insight..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            data-testid="pm-keyword-search"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{filtered.length}</span> angles across {PRODUCTS.length} products
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item, idx) => {
          const p = PRODUCTS.find((x) => x.id === item.productId);
          if (!p) return null;
          const copyText = `[${p.name}] ${item.angle.topic}\n\n${item.angle.insight}`;
          return (
            <motion.div
              key={`${item.productId}-${idx}`}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.3) }}
              className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex flex-col gap-2"
              data-testid={`pm-angle-card-${idx}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <BrandBadge brand={p.brand} />
                    <span className="text-xs text-muted-foreground">{p.name}</span>
                    {item.angle.useIn && (
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground capitalize">
                        {item.angle.useIn}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold leading-snug">{item.angle.topic}</p>
                </div>
                <CopyButton text={copyText} idx={idx} />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.angle.insight}</p>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-sm text-muted-foreground">
            No PM angles match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Financial Context Lookup Maps ───────────────────────────────────────────
// GM Tier: A = >45%, B = 35-45%, C = <35%

// Revenue Exposure + Risk Data
type RiskLevel = "HIGH" | "MEDIUM" | "LOW-MEDIUM" | "MEDIUM-HIGH" | "LOW";

const REVENUE_RISK_MAP: Record<string, { revenue: string; risk: RiskLevel; drivers: string }> = {
  "SL500 R104":       { revenue: "$4.2M", risk: "HIGH",        drivers: "NOA + FBC 8th + A156.27" },
  "SL500 R92":        { revenue: "$6.8M", risk: "MEDIUM",      drivers: "A156.27 + ASHRAE 90.1" },
  "SL500 R128":       { revenue: "$2.1M", risk: "LOW",         drivers: "Stable cert status" },
  "SW60":             { revenue: "$3.1M", risk: "MEDIUM",      drivers: "A156.38 + NFPA 101" },
  "SW200 OHC":        { revenue: "$5.2M", risk: "LOW-MEDIUM",  drivers: "Mature cert coverage" },
  "VersaMax ICU":     { revenue: "$3.4M", risk: "LOW",         drivers: "Advantaged by FGI/ASHRAE 170" },
  "VersaMax CCU":     { revenue: "$2.2M", risk: "LOW",         drivers: "Advantaged by FGI/ASHRAE 170" },
  "TSA 200":          { revenue: "$1.7M", risk: "MEDIUM",      drivers: "A156.27 + BIM gap" },
  "TSA 160":          { revenue: "$2.6M", risk: "MEDIUM",      drivers: "A156.27" },
  "Windcord 5500":    { revenue: "$2.4M", risk: "LOW-MEDIUM",  drivers: "A156.14 minor" },
  "Windcord 5400":    { revenue: "$1.9M", risk: "MEDIUM",      drivers: "A156.14" },
  "ConnectGateway":   { revenue: "$1.2M", risk: "MEDIUM-HIGH", drivers: "UL 294 v8" },
  "RD3-T3":           { revenue: "$2.8M", risk: "LOW",         drivers: "Stable cert status" },
  "SmartSense Radar": { revenue: "$2.1M", risk: "LOW",         drivers: "Stable cert status" },
  "SmartSense Mwave": { revenue: "$3.8M", risk: "LOW",         drivers: "Stable cert status" },
};

function getRevenueRisk(productName: string): { revenue: string; risk: RiskLevel; drivers: string } | null {
  for (const [key, val] of Object.entries(REVENUE_RISK_MAP)) {
    if (productName === key || productName.startsWith(key) || productName.includes(key)) return val;
  }
  return null;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; pill: string; icon: string }> = {
  "HIGH":        { label: "HIGH",     pill: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",                icon: "\uD83D\uDD34" },
  "MEDIUM-HIGH": { label: "MED-HIGH", pill: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",    icon: "\uD83D\uDFE0" },
  "MEDIUM":      { label: "MEDIUM",   pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",        icon: "\uD83D\uDFE1" },
  "LOW-MEDIUM":  { label: "LOW-MED",  pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",            icon: "\uD83D\uDFE1" },
  "LOW":         { label: "LOW",      pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", icon: "\uD83D\uDFE2" },
};

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const cfg = RISK_CONFIG[risk];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold ${cfg.pill}`}>
      {cfg.label}
    </span>
  );
}

function RiskSignalIcon({ risk, drivers }: { risk: RiskLevel; drivers: string }) {
  const cfg = RISK_CONFIG[risk];
  return (
    <span
      title={`Risk based on: ${drivers}`}
      className="cursor-help text-sm leading-none"
      data-testid="risk-signal-icon"
    >
      {cfg.icon}
    </span>
  );
}

const GM_TIER_MAP: Record<string, "A" | "B" | "C"> = {
  "aa-versaMax": "A",
  "versamax_icu": "A",
  "aa-ecoLOGIC": "A",
  "aa-sl500": "B",
  "aa-sl500cr": "B",
  "aa-sl521": "B",
  "sl500_r104": "B",
  "sl500_r92": "B",
  "sl500_r128": "B",
  "aa-sw60": "B",
  "sw60": "B",
  "aa-sw100": "B",
  "aa-sw200i-surface": "B",
  "aa-sw200i-ig": "B",
  "aa-sw200-ohc": "B",
  "sw200_ohc": "B",
  "aa-sw300": "B",
  "aa-rd3-rd4": "B",
  "aa-rd600": "B",
  "aa-rd700": "B",
  "aa-rd300-ag": "B",
  "aa-rd3a-rd4a1": "B",
  "folding_door_aa": "B",
};

const COST_TO_SERVE_MAP: Record<string, number> = {
  "aa-versaMax": 4,
  "versamax_icu": 4,
  "aa-ecoLOGIC": 2,
  "aa-sl500": 3,
  "aa-sl500cr": 3,
  "aa-sl521": 3,
  "sl500_r104": 3,
  "sl500_r92": 3,
  "sl500_r128": 3,
  "aa-sw60": 3,
  "sw60": 3,
  "aa-sw100": 2,
  "aa-sw200i-surface": 3,
  "aa-sw200i-ig": 3,
  "aa-sw200-ohc": 3,
  "sw200_ohc": 3,
  "aa-sw300": 3,
  "aa-rd3-rd4": 4,
  "aa-rd600": 4,
  "aa-rd700": 4,
  "aa-rd300-ag": 5,
  "aa-rd3a-rd4a1": 5,
  "folding_door_aa": 3,
};

function getGmTier(id: string): "A" | "B" | "C" {
  return GM_TIER_MAP[id] ?? "C";
}
function getCostToServe(id: string): number {
  return COST_TO_SERVE_MAP[id] ?? 5;
}

function GmTierBadge({ tier }: { tier: "A" | "B" | "C" }) {
  const config = {
    A: { label: "High Margin", cls: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-700" },
    B: { label: "Mid Margin",  cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-700" },
    C: { label: "Thin Margin", cls: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-700" },
  }[tier];
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${config.cls}`}>
      {tier} · {config.label}
    </span>
  );
}

function CostToServeDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${i <= value ? (value >= 4 ? "bg-red-500" : value >= 3 ? "bg-amber-500" : "bg-green-500") : "bg-muted-foreground/20"}`}
        />
      ))}
      <span className="text-[10px] text-muted-foreground ml-1">{value}/5</span>
    </div>
  );
}

// ─── Channel Health Widget ──────────────────────────────────────────────────────────
function ChannelHealthWidget() {
  const [expanded, setExpanded] = useState(true);

  const metrics = [
    { label: "Sell-Through Velocity",        value: "↑ +8.2%",          valueClass: "text-green-500 dark:text-green-400 font-bold" },
    { label: "Distributor Coverage",         value: "47 / 52 branches", valueClass: "text-foreground font-semibold" },
    { label: "Spec Win Rate (trailing 90d)", value: "62%",              valueClass: "text-primary font-semibold" },
    { label: "Days Inventory @ Channel",     value: "34 days",          valueClass: "text-foreground font-semibold" },
  ];

  return (
    <Card
      className="border shadow-none"
      style={{ background: "hsl(220 15% 10%)", borderColor: "hsl(16 90% 58% / 0.35)" }}
      data-testid="channel-health-widget"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={15} style={{ color: "#F2631F" }} />
            <CardTitle className="text-sm" style={{ color: "#F2631F" }}>Channel Health — NA Pedestrian</CardTitle>
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-1 rounded transition-colors"
            style={{ color: "#F2631F" }}
            data-testid="channel-health-toggle"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pb-4">
              <div className="space-y-2 mb-3">
                {metrics.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-1" style={{ borderBottom: "1px solid hsl(16 90% 58% / 0.15)" }}>
                    <span className="text-xs" style={{ color: "hsl(0 0% 65%)" }}>{m.label}</span>
                    <span className={`text-xs ${m.valueClass}`}>{m.value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-md p-2.5" style={{ background: "hsl(16 90% 58% / 0.08)", border: "1px solid hsl(16 90% 58% / 0.2)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "#F2631F" }}>Top Spec'd Products</p>
                <div className="flex flex-wrap gap-1.5">
                  {["SL500 R92", "SW200 OHC", "VersaMax ICU"].map(label => (
                    <span key={label} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{ background: "hsl(16 90% 58% / 0.18)", color: "#F2631F", border: "1px solid hsl(16 90% 58% / 0.3)" }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] mt-2" style={{ color: "hsl(0 0% 45%)" }}>Data as of Q1 2026</p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Market Context Widget ────────────────────────────────────────────────────
function MarketContextWidget() {
  const [expanded, setExpanded] = useState(true);

  const stats = [
    {
      label: "NA Auto Door Market (2025)",
      value: "$1.32B",
      sub: "→ $1.88B by 2035 at 3.6% CAGR",
      color: "text-primary",
      icon: <Globe size={13} className="text-primary" />,
    },
    {
      label: "Sliding Doors Market Share",
      value: "41%",
      sub: "Largest single category",
      color: "text-blue-600 dark:text-blue-400",
      icon: <BarChart3 size={13} className="text-blue-500" />,
    },
    {
      label: "Healthcare Growth (YoY)",
      value: "+12%",
      sub: "Top vertical by growth rate",
      color: "text-emerald-600 dark:text-emerald-400",
      icon: <TrendingUp size={13} className="text-emerald-500" />,
    },
    {
      label: "Government Growth (YoY)",
      value: "+15%",
      sub: "Driven by security upgrades",
      color: "text-emerald-600 dark:text-emerald-400",
      icon: <TrendingUp size={13} className="text-emerald-500" />,
    },
    {
      label: "Sensor Market (2024)",
      value: "$1.03B",
      sub: "6.14% CAGR — smart door growth vector",
      color: "text-violet-600 dark:text-violet-400",
      icon: <Cpu size={13} className="text-violet-500" />,
    },
  ];

  return (
    <Card className="border-border/60" data-testid="market-context-widget">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 size={15} className="text-primary" />
            <CardTitle className="text-sm">Market Context</CardTitle>
            <span className="text-xs text-muted-foreground">
              Global Market Insights, Dec 2025 / SkyQuest 2025
            </span>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded hover:bg-muted transition-colors"
            data-testid="market-context-toggle"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                {stats.map((s, i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-3" data-testid={`market-stat-${i}`}>
                    <div className="flex items-center gap-1 mb-1">
                      {s.icon}
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    </div>
                    <p className={`text-xl font-bold tabular ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* HVHZ market highlight */}
              <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-2.5 flex items-start gap-2.5 mb-3" data-testid="hvhz-market-note">
                <MapPin size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    HVHZ Market Spotlight
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400/80 leading-relaxed">
                    Miami-Dade + Broward = largest HVHZ commercial door market in North America.
                    NOA certification is a binary market-access gate — ASSA ABLOY's SL500 R104 holds sole-source
                    position in high-security HVHZ sliding door specs.
                  </p>
                </div>
              </div>

              {/* Sensor market highlight */}
              <div className="rounded-lg border border-violet-200 dark:border-violet-800/60 bg-violet-50 dark:bg-violet-950/20 px-4 py-2.5 flex items-start gap-2.5" data-testid="sensor-market-note">
                <Cpu size={14} className="text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                    Smart Door / Sensor Market
                  </p>
                  <p className="text-xs text-violet-600 dark:text-violet-400/80 leading-relaxed">
                    $1.03B sensor market in 2024 growing at 6.14% CAGR — fastest-growing component of the
                    auto door ecosystem. Bluetooth-connected operators (SW60), microwave presence, and
                    access control integration are the primary growth vectors.
                  </p>
                </div>
              </div>

              {/* Compliance Risk Window */}
              <div
                className="mt-3 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/20 px-4 py-3"
                data-testid="compliance-risk-window"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Compliance Risk Window</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs mb-2">
                  {[
                    ["Standards in Transition", "6"],
                    ["Products Exposed",         "12"],
                    ["Revenue at Code Risk",      "$28.4M"],
                    ["FBC 9th Ed. Transition",    "Dec 31, 2026"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-800/40 py-0.5">
                      <span className="text-amber-700 dark:text-amber-400/80">{label}</span>
                      <span className="font-semibold text-amber-800 dark:text-amber-300">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic">
                  → Full analysis in PM Command Center
                </p>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Sources: Global Market Insights, Dec 2025 · SkyQuest 2025
              </p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Extended Standards Reference Widget ──────────────────────────────────────
function ExtendedStandardsWidget() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border/60" data-testid="extended-standards-widget">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeCheck size={15} className="text-primary" />
            <CardTitle className="text-sm">Extended Standards Reference</CardTitle>
            <Badge variant="secondary" className="text-xs">2025/2026 additions</Badge>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded hover:bg-muted transition-colors"
            data-testid="ext-standards-toggle"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          ASTM E1886/E1996, ASTM F842-17, ASHRAE 170-2021, NFPA 101-2024, ICC A117.1, A156.14-2024
        </p>
      </CardHeader>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pb-4 space-y-3">
              {EXTENDED_STANDARDS_REFERENCE.map((std, i) => (
                <div key={i} className="border border-border/60 rounded-lg p-3" data-testid={`ext-std-${std.code.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-primary">{std.code}</span>
                    <span className="text-xs text-muted-foreground">{std.description}</span>
                  </div>
                  <div className="border border-primary/20 bg-primary/5 rounded p-2 mt-2">
                    <p className="text-xs font-bold mb-0.5 flex items-center gap-1">
                      <Lightbulb size={10} className="text-amber-500" /> PM Insight
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{std.pmInsight}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
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
                ? "bg-blue-600 text-white cursor-default"
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

export default function CrosswalkApp() {
  const { dark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState("matrix");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openProduct(product: Product) {
    setSelectedProduct(product);
    setDrawerOpen(true);
  }

  function openProductById(id: string) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) openProduct(p);
  }

  // KPI counts
  const totalProducts = PRODUCTS.length;
  const hvhzReady = PRODUCTS.filter((p) => p.floridaApproval.hvhz).length;
  const noaCertified = PRODUCTS.filter((p) => p.floridaApproval.status === "noa-certified").length;
  const verifyRequired = PRODUCTS.filter((p) =>
    p.floridaApproval.status === "verify" || p.standardCerts.some((c) => c.status === "verify")
  ).length;
  const pmAngleCount = getAllPMAngles().length;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Suite Nav ── */}
      <div className="sticky top-0 z-[60]">
        <SuiteNav activeTool="crosswalkdb" />
      </div>
      {/* ── Header ── */}
      <header className="sticky top-[32px] z-50 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5" data-testid="header-brand">
            <Logo />
            <div>
              <span className="font-bold text-sm tracking-tight">CrosswalkDB</span>
              <span className="text-xs text-muted-foreground ml-1.5 hidden sm:inline">
                Product-Standard Crosswalk
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden md:block">
              ASSA ABLOY · dormakaba · Stanley · Horton — A156.10 / A156.19 / A156.38 / FL NOA
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              data-testid="theme-toggle"
              className="h-8 w-8"
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Products Mapped", value: totalProducts, color: "text-primary" },
            { label: "NOA Certified", value: noaCertified, color: "text-green-600 dark:text-green-400" },
            { label: "HVHZ Ready", value: hvhzReady, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Needs Verification", value: verifyRequired, color: "text-amber-600 dark:text-amber-400" },
            { label: "PM Angles", value: pmAngleCount, color: "text-blue-600 dark:text-blue-400" },
          ].map((s) => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{s.label}</p>
                <p className={`text-2xl font-bold tabular ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Context Widget — always visible */}
        <div className="mb-5">
          <MarketContextWidget />
        </div>

        {/* Channel Health Widget */}
        <div className="mb-5">
          <ChannelHealthWidget />
        </div>

        {/* FBC 9th Ed. notice */}
        <div
          className="mb-5 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 flex items-start gap-2.5"
          data-testid="fbc-notice"
        >
          <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <span className="font-semibold">FBC 9th Edition effective Dec 31, 2026.</span> Products marked
            {" "}Verify for Florida HVHZ may require updated NOA under the new 160 mph envelope mandate (HB 911).
            Confirm design pressure ratings before specifying exterior HVHZ products after that date.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="main-tabs">
          <TabsList className="mb-5 h-9 flex-wrap">
            <TabsTrigger value="matrix" data-testid="tab-matrix" className="text-xs">
              Product Matrix
            </TabsTrigger>
            <TabsTrigger value="market" data-testid="tab-market" className="text-xs">
              Market Coverage
            </TabsTrigger>
            <TabsTrigger value="gaps" data-testid="tab-gaps" className="text-xs">
              Standards Gaps
            </TabsTrigger>
            <TabsTrigger value="h2h" data-testid="tab-h2h" className="text-xs">
              Head-to-Head
            </TabsTrigger>
            <TabsTrigger value="pm" data-testid="tab-pm" className="text-xs">
              PM Intelligence
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              {/* Tab 1: Product Matrix */}
              <TabsContent value="matrix" className="mt-0" forceMount={activeTab === "matrix" ? true : undefined}>
                {activeTab === "matrix" && (
                  <ProductMatrix onSelectProduct={openProduct} />
                )}
              </TabsContent>

              {/* Tab 2: Market Coverage Map */}
              <TabsContent value="market" className="mt-0" forceMount={activeTab === "market" ? true : undefined}>
                {activeTab === "market" && (
                  <div className="space-y-6">
                    <MarketContextWidget />
                    <MarketCoverageMap />
                  </div>
                )}
              </TabsContent>

              {/* Tab 3: Standards Gap Analysis */}
              <TabsContent value="gaps" className="mt-0" forceMount={activeTab === "gaps" ? true : undefined}>
                {activeTab === "gaps" && (
                  <div className="space-y-4">
                    <ExtendedStandardsWidget />
                    <StandardsGapAnalysis />
                  </div>
                )}
              </TabsContent>

              {/* Tab 4: Head-to-Head */}
              <TabsContent value="h2h" className="mt-0" forceMount={activeTab === "h2h" ? true : undefined}>
                {activeTab === "h2h" && <HeadToHead onSelectProduct={openProduct} />}
              </TabsContent>

              {/* Tab 5: PM Intelligence */}
              <TabsContent value="pm" className="mt-0" forceMount={activeTab === "pm" ? true : undefined}>
                {activeTab === "pm" && <PMIntelligence />}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Product detail drawer */}
      <ProductDrawer
        product={selectedProduct}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectProduct={(id) => {
          setDrawerOpen(false);
          setTimeout(() => openProductById(id), 50);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Logo />
            <span>CrosswalkDB — Product-Standard Crosswalk</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Sources: BHMA · ICC · Miami-Dade BOAF · Manufacturer product pages</span>
            <span>Verified Apr 2026 · Confirm current NOA before specifying</span>
            <a
              href="https://www.miamidade.gov/economy/building/product-control.asp"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              data-testid="footer-miami-dade-link"
            >
              <ExternalLink size={10} />
              Miami-Dade Product Control
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
