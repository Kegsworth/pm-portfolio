import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  ExternalLink, Award, Globe2, BookOpen, Layers, ChevronDown,
  Menu, X, Shield, Building2, BarChart3, Zap, Database, TrendingUp,
  Linkedin,
} from 'lucide-react';

// ─── Animated counter hook ─────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1.4, decimals = 0) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (inView) {
      motionVal.set(target);
    }
  }, [inView, target, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      setDisplay(v.toFixed(decimals));
    });
    return unsubscribe;
  }, [spring, decimals]);

  return { ref, display };
}

// ─── Tool data ─────────────────────────────────────────────────────────────

const tools = [
  {
    id: 'doorspec',
    slug: 'doorspec',
    name: 'DoorSpec',
    subtitle: 'FL Compliance Checker',
    competency: 'Compliance · Regulatory',
    description:
      'A 5-step configurator mapping door type, activation method, climate zone, and occupancy to ANSI/BHMA standards, IECC 2024 vestibule exemptions, IBC 2024 egress logic, ICC A117.1 ADA clearances, and Florida Building Code flags — including HVHZ/NOA requirements. Includes a TCO/Energy Calculator: real-time HVAC savings, 10-year TCO comparison vs. competitors, NPV, and ASHRAE 90.1-2022 vestibule equivalency analysis.',
    pm_angle:
      'Demonstrates requirements decomposition, regulatory edge-case handling, and translating field expertise into structured compliance decision logic. TCO Calculator shows financial acumen — 10-year cost modeling, break-even analysis, and LEED credit quantification.',
    tag: 'Compliance · TCO Calculator · ASHRAE 90.1 · ADA',
    colorVar: '--tool-doorspec',
    cardClass: 'card-doorspec',
    url: 'https://www.perplexity.ai/computer/a/doorspec-fl-compliance-checker-mArd4vh0SLKQrSaF37VB3A',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
        <circle cx="6" cy="10" r="1" fill="currentColor" stroke="none" />
        <path d="M13 8h5M13 12h5M13 16h3" />
      </svg>
    ),
  },
  {
    id: 'battlecard',
    slug: 'battlecard',
    name: 'BattleCard',
    subtitle: 'Competitive Intel',
    competency: 'Competitive Strategy',
    description:
      'Win/loss intelligence across 8 competitors — Allegion/Stanley (post-$900M acquisition), dormakaba, Boon Edam, GEZE, TORMAX, NABCO, Nabtesco, and FAAC — organized by audience context with objection handlers, talk tracks, IoT feature comparison, and pricing tier matrix.',
    pm_angle:
      'Shows competitive positioning, audience-first communication, and structured product differentiation across multiple market segments. Includes updated Allegion ecosystem framing and IoT/predictive maintenance competitive analysis.',
    tag: 'Competitive · 8 Vendors · IoT · Suite-Linked',
    colorVar: '--tool-battlecard',
    cardClass: 'card-battlecard',
    url: 'https://www.perplexity.ai/computer/a/battlecard-competitive-intel-4Mif6CAuTo6iJjchoSDR6g',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'codetracker',
    slug: 'codetracker',
    name: 'CodeTracker',
    subtitle: 'Standards Monitor',
    competency: 'Regulatory Intelligence',
    description:
      'Live dashboard tracking 30+ standards across 7 categories: ANSI/BHMA A156 series, IBC 2024 Ch.10 egress, NFPA 101-2024 life safety, ASHRAE 90.1-2022 energy, IECC 2024, ICC A117.1 accessibility, ASTM E1886/F842 impact/forced-entry, and ASHRAE 170-2021 healthcare ventilation.',
    pm_angle:
      'Illustrates roadmap risk management, regulatory tracking across energy/safety/accessibility codes, and proactive standards monitoring with ASSA ABLOY product impact callouts on every standard.',
    tag: 'Regulatory · 50-State Code Tracker · 30+ Standards',
    colorVar: '--tool-codetracker',
    cardClass: 'card-codetracker',
    url: 'https://www.perplexity.ai/computer/a/codetracker-standards-monitor-FgkV.eRtRB6F9EjhOkerBQ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'crosswalk',
    slug: 'crosswalk',
    name: 'CrosswalkDB',
    subtitle: 'Product-Standard Crosswalk',
    competency: 'Portfolio Mapping',
    description:
      'Interactive matrix mapping 18+ ASSA ABLOY product lines — including SL500 R104 (HVHZ/ASTM E1886), SW60 slim retrofit, VersaMax ICU/CCU, and RECORD TSA series — to their certifications, sensor compatibility, and Florida NOA status. Includes sensor-type filter and market context widget ($1.32B TAM).',
    pm_angle:
      'Demonstrates data-driven product portfolio analysis, certification gap identification, sensor ecosystem positioning, and market sizing framing across NA pedestrian door verticals.',
    tag: 'Portfolio · 65+ Products · Suite-Linked · $1.32B TAM',
    colorVar: '--tool-crosswalk',
    cardClass: 'card-crosswalk',
    url: 'https://www.perplexity.ai/computer/a/crosswalkdb-product-standard-c-XJ6fTEzDTwi0G8I9Vu1sVQ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'pmstudio',
    slug: 'pmstudio',
    name: 'PM Studio',
    subtitle: 'Enterprise NPD Platform',
    competency: 'NPD Management',
    description:
      'Enterprise PM command center for ASSA ABLOY + RECORD NA pedestrian portfolio. 11 tabs: Portfolio Dashboard, Roadmap (Calendar + Kanban + List), Analytics, Stage-Gate G0–G5, NPD Handoffs, VOC, Win/Loss Intelligence Engine, Capacity, Forecast, Launch Readiness, and Market Intelligence. 38 active initiatives, IoT roadmap track, and Win/Loss pattern analysis across 15 deal records.',
    pm_angle:
      'Demonstrates enterprise SaaS product thinking: Gantt calendar with initiative bars, Kanban with stage columns, Win/Loss engine with pattern charts (53% win rate, top driver: AAADM service network), Market Intelligence with $1.32B→$1.88B TAM, and state-by-state regulatory intel across 53 markets.',
    tag: 'Roadmap · Kanban · Win/Loss · $1.32B Market Intel · 11 Tabs',
    colorVar: '--tool-pmstudio',
    cardClass: 'card-pmstudio',
    url: 'https://www.perplexity.ai/computer/a/pm-studio-roadmap-npd-34GvBY.6Qde3JnTdr2.etw',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="3" y="13" width="7" height="5" rx="1" />
        <rect x="14" y="13" width="7" height="5" rx="1" />
        <path d="M6.5 8v5M17.5 8v5M10 5.5h4M10 15.5h4" />
      </svg>
    ),
  },
  {
    id: 'portfolioiq',
    slug: 'portfolioiq',
    name: 'PortfolioIQ',
    subtitle: 'SKU Rationalization Engine',
    competency: 'Portfolio Rationalization',
    description:
      'Enterprise product portfolio rationalization engine for ASSA ABLOY NA pedestrian division. ABC/XYZ classification across 47 SKUs with margin heat maps, component network overlap analysis, lifecycle stage scoring (BCG-aligned), and AI-driven invest/optimize/sunset recommendations.',
    pm_angle:
      'Demonstrates business-owner thinking: financial fluency (gross margin bps, cost-to-serve per SKU), portfolio-level framing, documented trade-offs, and the ability to defend go/no-go decisions with data — exactly what VP-level interviewers screen for.',
    tag: 'Portfolio · ABC Analysis · Margin · Lifecycle',
    colorVar: '--tool-portfolioiq',
    cardClass: 'card-portfolioiq',
    url: 'https://www.perplexity.ai/computer/a/portfolioiq-sku-rationalizatio-vEecF6HBTDKsRuAiBZYviA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-6 4 4 4-8" />
        <circle cx="19" cy="6" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

// ─── Stats data ────────────────────────────────────────────────────────────

const stats = [
  { value: 6, suffix: '', label: 'PM Tools', decimals: 0 },
  { value: 8, suffix: '', label: 'Competitors tracked', decimals: 0 },
  { value: 30, suffix: '+', label: 'Standards monitored', decimals: 0 },
  { value: 47, suffix: '', label: 'SKUs analyzed', decimals: 0 },
  { value: 1.32, suffix: 'B', label: 'Market mapped', prefix: '$', decimals: 2 },
];

// ─── Value propositions ────────────────────────────────────────────────────

const valueProps = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Business-Owner Framing',
    body: 'Every tool shows financial outcomes, margin impacts, and documented trade-offs — not just features.',
    colorVar: '--tool-doorspec',
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Deep Domain Intelligence',
    body: 'Built from 4 years of ASSA ABLOY institutional knowledge: sensor specs, HVHZ compliance, stage-gate reviews, Win/Loss data.',
    colorVar: '--tool-crosswalk',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Enterprise-Grade UX',
    body: '11 tabs, Gantt calendars, Kanban boards, SKU heat maps, and competitive intel engines — not student projects.',
    colorVar: '--tool-pmstudio',
  },
];

// ─── Experience timeline ───────────────────────────────────────────────────

const timeline = [
  {
    icon: <Shield className="w-4 h-4" />,
    org: 'Military Service',
    role: 'U.S. Armed Forces',
    period: 'Prior to ASSA ABLOY',
    colorVar: '--tool-codetracker',
  },
  {
    icon: <Building2 className="w-4 h-4" />,
    org: 'Daifuku — Amazon Facilities',
    role: 'Systems Engineering',
    period: 'Automated material handling',
    colorVar: '--tool-battlecard',
  },
  {
    icon: <Layers className="w-4 h-4" />,
    org: 'ASSA ABLOY Entrance Systems',
    role: 'Design Engineer (3 yrs) · Project Manager (1 yr)',
    period: '4 years total',
    colorVar: '--tool-pmstudio',
  },
];

// ─── Credentials ───────────────────────────────────────────────────────────

const credentials = [
  { icon: <Globe2 className="w-4 h-4" />, label: 'Global product deployment across international markets' },
  { icon: <BookOpen className="w-4 h-4" />, label: 'Lean Six Sigma Green Belt' },
  { icon: <Layers className="w-4 h-4" />, label: 'Led CPI engineering team at ASSA ABLOY' },
  { icon: <Award className="w-4 h-4" />, label: 'HVHZ compliance specialist — Florida market' },
  { icon: <Shield className="w-4 h-4" />, label: 'U.S. military — technical role, Secret clearance' },
  { icon: <Building2 className="w-4 h-4" />, label: 'Daifuku / Amazon automated facilities' },
];

// ─── Animation variants ────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

// ─── Animated stat ─────────────────────────────────────────────────────────

function AnimatedStat({
  value, suffix, prefix, label, decimals,
}: { value: number; suffix: string; prefix?: string; label: string; decimals: number }) {
  const { ref, display } = useAnimatedCounter(value, 1.4, decimals);
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold text-foreground font-display tabular-nums">
        {prefix ?? ''}<span ref={ref}>{display}</span>{suffix}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

// ─── Logo SVG ──────────────────────────────────────────────────────────────

function Logo() {
  return (
    <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8" aria-label="James Tubbs PM Toolkit logo">
      {/* 2x2 grid — one cell highlighted in cyan */}
      <rect x="2" y="2" width="14" height="14" rx="2.5" fill="hsl(187 100% 50% / 0.15)" stroke="hsl(187 100% 50% / 0.5)" strokeWidth="1" />
      <rect x="20" y="2" width="14" height="14" rx="2.5" fill="hsl(187 100% 50% / 0.06)" stroke="hsl(220 18% 14% / 0.8)" strokeWidth="1" />
      <rect x="2" y="20" width="14" height="14" rx="2.5" fill="hsl(187 100% 50% / 0.06)" stroke="hsl(220 18% 14% / 0.8)" strokeWidth="1" />
      <rect x="20" y="20" width="14" height="14" rx="2.5" fill="hsl(187 100% 50% / 0.06)" stroke="hsl(220 18% 14% / 0.8)" strokeWidth="1" />
      {/* Cyan accent dot in highlighted cell */}
      <circle cx="9" cy="9" r="2.5" fill="hsl(187 100% 50%)" />
    </svg>
  );
}

// ─── Tool Card ─────────────────────────────────────────────────────────────

function ToolCard({ tool, index }: { tool: typeof tools[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`card-glow ${tool.cardClass} rounded-xl bg-card relative group cursor-default flex flex-col overflow-hidden`}
      data-testid={`card-tool-${tool.slug}`}
    >
      {/* Radial bloom on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(var(${tool.colorVar}) / 0.1) 0%, transparent 70%)` }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />

      <div className="p-6 flex flex-col flex-1 gap-4 relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `hsl(var(${tool.colorVar}) / 0.15)`, color: `hsl(var(${tool.colorVar}))` }}
          >
            {tool.icon}
          </div>
          {/* PM Competency tag */}
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full mt-0.5 text-center tracking-wide"
            style={{ backgroundColor: `hsl(var(${tool.colorVar}) / 0.12)`, color: `hsl(var(${tool.colorVar}))` }}
          >
            {tool.competency}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-foreground font-display">{tool.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium uppercase tracking-wide">{tool.subtitle}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{tool.description}</p>

        {/* PM Angle */}
        <div
          className="rounded-lg p-3 text-xs leading-relaxed"
          style={{ backgroundColor: `hsl(var(${tool.colorVar}) / 0.07)`, borderLeft: `2px solid hsl(var(${tool.colorVar}) / 0.5)` }}
        >
          <span className="font-semibold" style={{ color: `hsl(var(${tool.colorVar}))` }}>PM angle: </span>
          <span className="text-muted-foreground">{tool.pm_angle}</span>
        </div>

        {/* CTA button */}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`link-open-${tool.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors mt-auto w-fit"
          style={{
            borderColor: `hsl(var(${tool.colorVar}) / 0.4)`,
            color: `hsl(var(${tool.colorVar}))`,
            backgroundColor: `hsl(var(${tool.colorVar}) / 0.08)`,
          }}
        >
          Open tool
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-background noise-overlay">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5" data-testid="nav-logo">
            <Logo />
            <span className="text-sm font-semibold text-foreground font-display">James Tubbs</span>
          </div>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-6" aria-label="Page navigation">
            <button
              onClick={() => scrollTo('tools')}
              data-testid="nav-tools"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              The Suite
            </button>
            <button
              onClick={() => scrollTo('about')}
              data-testid="nav-about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <a
              href="mailto:tubbs.james1@gmail.com"
              data-testid="nav-contact"
              className="text-sm font-medium px-3.5 py-1.5 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md border border-border text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMobileNavOpen(v => !v)}
            data-testid="nav-mobile-toggle"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen
              ? <X className="w-4 h-4" />
              : <Menu className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="sm:hidden overflow-hidden border-t border-border bg-background/95"
            >
              <div className="flex flex-col divide-y divide-border">
                <button
                  onClick={() => scrollTo('tools')}
                  className="px-6 py-3.5 text-sm text-foreground text-left hover:bg-secondary transition-colors"
                >
                  The Suite
                </button>
                <button
                  onClick={() => scrollTo('about')}
                  className="px-6 py-3.5 text-sm text-foreground text-left hover:bg-secondary transition-colors"
                >
                  About
                </button>
                <a
                  href="mailto:tubbs.james1@gmail.com"
                  className="px-6 py-3.5 text-sm font-medium text-primary hover:bg-secondary transition-colors"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Contact
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Cyan structural rule ── */}
      <div className="hero-rule fixed top-14 inset-x-0 z-40 pointer-events-none" />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-4 sm:px-6 ruled-grid overflow-hidden" aria-label="Hero">
        {/* Ambient glows — cyan + blue, very low opacity */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, hsl(187 100% 50% / 0.07) 0%, transparent 70%)' }} />
        <div className="absolute top-10 right-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, hsl(210 85% 58% / 0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48" style={{ background: 'radial-gradient(ellipse, hsl(187 100% 50% / 0.04) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary mb-8"
            data-testid="hero-badge"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Product Manager Portfolio · Spring 2026
          </motion.div>

          {/* H1 — Name + Product line format */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="leading-tight tracking-tight"
            data-testid="hero-title"
          >
            <span className="block text-4xl sm:text-6xl lg:text-7xl font-extrabold text-foreground font-display">
              James Tubbs
            </span>
            <span className="block text-3xl sm:text-5xl lg:text-6xl font-bold gradient-text font-display mt-1">
              PM Intelligence Suite
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            data-testid="hero-description"
          >
Six enterprise-grade PM tools built from four years inside ASSA ABLOY Entrance Systems — spanning competitive intelligence, FL/HVHZ compliance, standards tracking, SKU rationalization, and full NPD lifecycle management. Translating deep domain expertise into the structured, data-driven decisions that separate business-owner PMs from feature factories.
          </motion.p>

          {/* Stats row — animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-center"
            data-testid="hero-stats"
          >
            {stats.map((s) => (
              <AnimatedStat key={s.label} {...s} />
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => scrollTo('tools')}
              data-testid="hero-cta-tools"
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/85 transition-colors shadow-lg shadow-primary/20"
            >
              Explore the Suite
            </button>
            <button
              onClick={() => scrollTo('about')}
              data-testid="hero-cta-about"
              className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
            >
              About James
            </button>
            <a
              href="mailto:tubbs.james1@gmail.com"
              data-testid="hero-cta-email"
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              tubbs.james1@gmail.com
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            onClick={() => scrollTo('tools')}
            data-testid="hero-scroll-arrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 mx-auto flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
            aria-label="Scroll to tools"
          >
            <span className="text-xs tracking-widest uppercase font-semibold">THE SUITE ↓</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </motion.button>
        </div>
      </section>

      {/* ── Value Proposition section ── */}
      <section className="px-4 sm:px-6 pb-20" aria-label="Why these tools">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {valueProps.map((vp, i) => (
              <motion.div
                key={vp.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="card-glow rounded-xl bg-card p-6 flex flex-col gap-3"
                data-testid={`value-prop-${i}`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `hsl(var(${vp.colorVar}) / 0.15)`, color: `hsl(var(${vp.colorVar}))` }}
                >
                  {vp.icon}
                </div>
                <h3 className="text-sm font-bold text-foreground font-display">{vp.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{vp.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Tools grid ── */}
      <section id="tools" className="px-4 sm:px-6 py-20" aria-label="PM Tools">
        <div className="max-w-6xl mx-auto">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">THE SUITE</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display">Eight tools. One entity graph. Zero silos.</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Each tool targets a distinct PM competency — compliance, competitive strategy, regulatory intelligence, portfolio analysis, NPD management, portfolio rationalization, and unified systems ops — all wired to a shared entity graph across 15 products × 15 standards × 8 competitors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" data-testid="tools-grid">
            {tools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Interconnected Architecture ── */}
      <section className="px-4 sm:px-6 py-20" aria-label="Interconnected Architecture" data-testid="entity-graph-section">
        <div className="max-w-6xl mx-auto">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">ARCHITECTURE</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display">One entity graph. Six tools. Zero silos.</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every tool shares the same underlying data layer — a live entity graph spanning 15 products, 15 standards, 10 jurisdictions, and 8 competitors. A NOA expiry in DoorSpec cascades to CodeTracker, surfaces in CrosswalkDB revenue risk, and triggers BattleCard positioning updates automatically.
            </p>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative flex items-center justify-center"
            data-testid="entity-graph-visual"
          >
            <svg
              viewBox="0 0 520 320"
              className="w-full max-w-2xl"
              aria-label="Entity graph showing 6 PM tools connected to central hub"
              role="img"
            >
              {/* Connection lines — drawn first so nodes sit on top */}
              <line x1="260" y1="160" x2="130" y2="60"  stroke="hsl(210 85% 58% / 0.35)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="260" y1="160" x2="390" y2="60"  stroke="hsl(265 80% 65% / 0.35)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="260" y1="160" x2="60"  y2="170" stroke="hsl(38 95% 58% / 0.35)"  strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="260" y1="160" x2="460" y2="170" stroke="hsl(152 70% 50% / 0.35)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="260" y1="160" x2="130" y2="270" stroke="hsl(187 100% 50% / 0.35)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="260" y1="160" x2="390" y2="270" stroke="hsl(16 90% 58% / 0.35)"  strokeWidth="1.5" strokeDasharray="4 3" />


              {/* Central node — Entity Graph */}
              <circle cx="260" cy="160" r="38" fill="hsl(187 100% 50% / 0.08)" stroke="hsl(187 100% 50% / 0.6)" strokeWidth="2" />
              <circle cx="260" cy="160" r="28" fill="hsl(187 100% 50% / 0.12)" stroke="hsl(187 100% 50% / 0.4)" strokeWidth="1" />
              <text x="260" y="155" textAnchor="middle" fill="hsl(187 100% 50%)" fontSize="8" fontWeight="700" fontFamily="system-ui" letterSpacing="0.08em">ENTITY</text>
              <text x="260" y="167" textAnchor="middle" fill="hsl(187 100% 50%)" fontSize="8" fontWeight="700" fontFamily="system-ui" letterSpacing="0.08em">GRAPH</text>

              {/* Tool nodes */}
              {/* DoorSpec — top left */}
              <circle cx="130" cy="60" r="26" fill="hsl(210 85% 58% / 0.1)" stroke="hsl(210 85% 58% / 0.55)" strokeWidth="1.5" />
              <text x="130" y="55" textAnchor="middle" fill="hsl(210 85% 58%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">DOOR</text>
              <text x="130" y="65" textAnchor="middle" fill="hsl(210 85% 58%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">SPEC</text>

              {/* BattleCard — top right */}
              <circle cx="390" cy="60" r="26" fill="hsl(265 80% 65% / 0.1)" stroke="hsl(265 80% 65% / 0.55)" strokeWidth="1.5" />
              <text x="390" y="55" textAnchor="middle" fill="hsl(265 80% 65%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">BATTLE</text>
              <text x="390" y="65" textAnchor="middle" fill="hsl(265 80% 65%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">CARD</text>

              {/* CodeTracker — left */}
              <circle cx="60" cy="170" r="26" fill="hsl(38 95% 58% / 0.1)" stroke="hsl(38 95% 58% / 0.55)" strokeWidth="1.5" />
              <text x="60" y="165" textAnchor="middle" fill="hsl(38 95% 58%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">CODE</text>
              <text x="60" y="175" textAnchor="middle" fill="hsl(38 95% 58%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">TRACK</text>

              {/* CrosswalkDB — right */}
              <circle cx="460" cy="170" r="26" fill="hsl(152 70% 50% / 0.1)" stroke="hsl(152 70% 50% / 0.55)" strokeWidth="1.5" />
              <text x="460" y="165" textAnchor="middle" fill="hsl(152 70% 50%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">CROSS</text>
              <text x="460" y="175" textAnchor="middle" fill="hsl(152 70% 50%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">WALK</text>

              {/* PM Studio — bottom left */}
              <circle cx="130" cy="270" r="26" fill="hsl(187 100% 50% / 0.1)" stroke="hsl(187 100% 50% / 0.55)" strokeWidth="1.5" />
              <text x="130" y="265" textAnchor="middle" fill="hsl(187 100% 50%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">PM</text>
              <text x="130" y="275" textAnchor="middle" fill="hsl(187 100% 50%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">STUDIO</text>

              {/* PortfolioIQ — bottom right */}
              <circle cx="390" cy="270" r="26" fill="hsl(16 90% 58% / 0.1)" stroke="hsl(16 90% 58% / 0.55)" strokeWidth="1.5" />
              <text x="390" y="265" textAnchor="middle" fill="hsl(16 90% 58%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">PORTFOLIO</text>
              <text x="390" y="275" textAnchor="middle" fill="hsl(16 90% 58%)" fontSize="7" fontWeight="700" fontFamily="system-ui" letterSpacing="0.06em">IQ</text>

              {/* PM Studio — top center, repositioned */}
            </svg>
          </motion.div>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 text-center text-xs text-muted-foreground/60 italic max-w-xl mx-auto"
          >
            "Linear, Productboard, and LaunchDarkly all built compound value through shared state — one change propagates everywhere. This suite applies the same principle to PM intelligence."
          </motion.p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── About ── */}
      <section id="about" className="px-4 sm:px-6 py-24" aria-label="About James Tubbs">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Left: narrative */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-3 space-y-5"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">About</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display">James Tubbs</h2>
                <p className="text-sm text-muted-foreground mt-1">Military Service → Industrial Systems → Design Engineer → MBA → Product Manager</p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="about-para-1">
                Over four years at ASSA ABLOY Entrance Systems, I moved between the engineering bench and global deployments — from specifying sensor packages across the company portfolio, to maintaining compliance across hurricane-rated doors in the HVHZ market, to coordinating IoT product rollouts globally, to leading the CPI engineering team in maintaining quality and competitiveness.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="about-para-2">
                That breadth — sharpened by prior experience in military service and Daifuku automated facilities — taught me that the most valuable skill in hardware product management is translating deep domain knowledge into decisions that scale. Compliance tables, competitor positioning, regulatory watch lists, and certification matrices are the raw material for great PM work.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="about-para-3">
                I built this suite to demonstrate exactly that: six tools that take 4+ years of automatic door expertise and turn it into structured, interactive, enterprise-grade intelligence.
              </p>

              {/* Looking for */}
              <div
                className="rounded-xl p-4 text-sm leading-relaxed"
                style={{ backgroundColor: 'hsl(187 100% 50% / 0.06)', borderLeft: '2px solid hsl(187 100% 50% / 0.4)' }}
                data-testid="about-looking-for"
              >
                <span className="font-semibold text-primary">Looking for: </span>
                <span className="text-muted-foreground">PM roles in engineering, technology, or industrial SaaS. Available Summer 2026.</span>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="mailto:tubbs.james1@gmail.com"
                  data-testid="about-contact-link"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Get in touch
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://linkedin.com/in/james-tubbs"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="about-linkedin-link"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              </div>
            </motion.div>

            {/* Right: credentials + experience timeline */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-5"
            >
              {/* Education */}
              <div className="card-glow rounded-xl bg-card p-5 space-y-3" data-testid="about-education">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Education</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-bold text-foreground font-display">USC Marshall School of Business</p>
                    <p className="text-xs text-muted-foreground">MBA · Graduating Spring 2026</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground font-display">ECPI University</p>
                    <p className="text-xs text-muted-foreground">B.S. Electronic Engineering Technology · Mechatronics</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Lean Six Sigma</p>
                    <p className="text-xs text-muted-foreground">Green Belt Certified</p>
                  </div>
                </div>
              </div>

              {/* Experience timeline */}
              <div className="card-glow rounded-xl bg-card p-5 space-y-4" data-testid="about-experience">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Experience</p>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-3 bottom-3 w-px bg-border" />
                  <div className="space-y-5">
                    {timeline.map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-4 relative" data-testid={`timeline-entry-${idx}`}>
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 z-10"
                          style={{ backgroundColor: `hsl(var(${entry.colorVar}) / 0.15)`, color: `hsl(var(${entry.colorVar}))` }}
                        >
                          {entry.icon}
                        </div>
                        <div className="pt-0.5">
                          <p className="text-sm font-bold text-foreground font-display">{entry.org}</p>
                          <p className="text-xs text-muted-foreground">{entry.role}</p>
                          <p className="text-xs text-muted-foreground/60 mt-0.5">{entry.period}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="card-glow rounded-xl bg-card p-5 space-y-3" data-testid="about-credentials">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Highlights</p>
                <ul className="space-y-2.5">
                  {credentials.map((c, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-primary shrink-0">{c.icon}</span>
                      <span className="text-sm text-muted-foreground">{c.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5" data-testid="footer-logo">
            <Logo />
            <span className="text-sm font-medium text-muted-foreground">James Tubbs — PM Intelligence Suite</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://linkedin.com/in/james-tubbs"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-linkedin"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
            <a
              href="mailto:tubbs.james1@gmail.com"
              data-testid="footer-email"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              tubbs.james1@gmail.com
            </a>
            <p className="text-xs text-muted-foreground text-center sm:text-right">
              Six PM tools demonstrating enterprise-grade product thinking · Spring 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
