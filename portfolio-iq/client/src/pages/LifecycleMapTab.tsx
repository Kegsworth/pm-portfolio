import { useState } from 'react';
import { skus, SKU, PRODUCT_LINES, LINE_COLORS } from '@/lib/portfolioData';

// Approximate relative market share by lifecycle and revenue
function getMarketShare(sku: SKU): number {
  // Higher revenue + A class = higher relative market share
  const baseShare = sku.revenue / 7.0; // normalize to SL500 R92 max
  const abcBoost = sku.abcClass === 'A' ? 0.3 : sku.abcClass === 'B' ? 0.0 : -0.25;
  return Math.min(0.95, Math.max(0.05, baseShare + abcBoost));
}

function getGrowthRate(sku: SKU): number {
  if (sku.lifecycle === 'Growth') return 0.6 + Math.random() * 0.3;
  if (sku.lifecycle === 'Maturity') return 0.2 + Math.random() * 0.2;
  return -0.1 + Math.random() * 0.15;
}

// Seed-based "random" for consistent rendering
const seededValues: Record<string, { ms: number; growth: number }> = {};
skus.forEach((sku) => {
  seededValues[sku.id] = {
    ms: getMarketShare(sku),
    growth: sku.lifecycle === 'Growth' ? 0.65 + (sku.revenue / 20) : sku.lifecycle === 'Maturity' ? 0.3 + (sku.revenue / 40) : 0.05 + (sku.revenue / 100),
  };
});

function SKUDot({ sku, onClick, selected }: { sku: SKU; onClick: () => void; selected: boolean }) {
  const { ms, growth } = seededValues[sku.id];
  const size = Math.max(8, Math.min(24, sku.revenue * 4));
  const color = LINE_COLORS[sku.lineIndex];

  return (
    <div
      className="absolute cursor-pointer transition-transform hover:scale-125"
      style={{
        left: `${ms * 92 + 2}%`,
        bottom: `${growth * 92 + 2}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, 50%)',
        zIndex: selected ? 20 : 10,
      }}
      onClick={onClick}
      title={sku.name}
      data-testid={`bcg-dot-${sku.id}`}
    >
      <div
        className="w-full h-full rounded-full border-2 transition-all"
        style={{
          backgroundColor: color + (selected ? 'ff' : '99'),
          borderColor: selected ? color : 'transparent',
          boxShadow: selected ? `0 0 8px ${color}` : 'none',
        }}
      />
    </div>
  );
}

function SKUPopover({ sku, onClose }: { sku: SKU; onClose: () => void }) {
  return (
    <div className="absolute top-4 right-4 z-30 bg-card border border-border rounded-xl p-4 w-64 shadow-2xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{sku.name}</div>
          <div className="text-[11px] text-muted-foreground">{sku.line}</div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
      </div>
      <div className="space-y-1.5 text-xs">
        {[
          ['Revenue', `$${sku.revenue}M`],
          ['GM%', `${sku.gmPercent}%`],
          ['Lifecycle', sku.lifecycle],
          ['ABC Class', sku.abcClass],
          ['Recommendation', sku.recommendation],
          ['Score', `${sku.score}/100`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-muted-foreground">{k}</span>
            <span className="text-foreground font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LifecycleMapTab() {
  const [selected, setSelected] = useState<SKU | null>(null);

  const avgYearsByLine = PRODUCT_LINES.map((line, i) => {
    const lineSkus = skus.filter((s) => s.lineIndex === i);
    const avg = lineSkus.reduce((sum, s) => sum + s.yearsInPortfolio, 0) / lineSkus.length;
    return { line: line.replace('ASSA ABLOY ', '').replace('RECORD ', 'RC ').replace('Sensors + Accessories', 'Sensors'), avg: parseFloat(avg.toFixed(1)), color: LINE_COLORS[i] };
  });

  // Recent innovation: revenue from products < 4 years
  const recentRevenue = skus.filter((s) => s.yearsInPortfolio <= 3).reduce((sum, s) => sum + s.revenue, 0);
  const recentPct = ((recentRevenue / 62.4) * 100).toFixed(1);

  // SKUs hitting age thresholds
  const reviewTriggers = skus.filter((s) => [5, 10, 15].includes(s.yearsInPortfolio) || (s.yearsInPortfolio >= 14 && s.yearsInPortfolio <= 16));

  return (
    <div className="p-6 space-y-5">
      {/* BCG Matrix */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>BCG Matrix — Portfolio Positioning</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Bubble size = revenue · Color = product line · Click bubble to inspect</p>
          </div>
          <div className="flex gap-2 flex-wrap max-w-xs">
            {PRODUCT_LINES.map((line, i) => (
              <div key={i} className="flex items-center gap-1 text-[10px]">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: LINE_COLORS[i] }} />
                <span className="text-muted-foreground">{line.replace('ASSA ABLOY ', '').replace('RECORD ', '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative" style={{ height: 400 }}>
          {/* Axis labels */}
          <div className="absolute inset-0 flex flex-col">
            <div className="flex flex-1">
              {/* Y axis label */}
              <div className="flex items-center justify-center w-8">
                <div className="text-[10px] text-muted-foreground -rotate-90 whitespace-nowrap">Market Growth Rate →</div>
              </div>
              {/* Grid */}
              <div className="flex-1 relative border border-border rounded-lg overflow-hidden">
                {/* Quadrant backgrounds */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
                  <div className="border-b border-r border-border/40 bg-yellow-500/5 flex items-center justify-center">
                    <span className="text-[11px] text-yellow-400/40 font-semibold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>? Question Marks</span>
                  </div>
                  <div className="border-b border-border/40 bg-green-500/5 flex items-center justify-center">
                    <span className="text-[11px] text-green-400/40 font-semibold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>★ Stars</span>
                  </div>
                  <div className="border-r border-border/40 bg-red-500/5 flex items-center justify-center">
                    <span className="text-[11px] text-red-400/40 font-semibold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>◼ Dogs</span>
                  </div>
                  <div className="bg-blue-500/5 flex items-center justify-center">
                    <span className="text-[11px] text-blue-400/40 font-semibold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>☾ Cash Cows</span>
                  </div>
                </div>

                {/* SKU Dots */}
                {skus.map((sku) => (
                  <SKUDot
                    key={sku.id}
                    sku={sku}
                    onClick={() => setSelected(selected?.id === sku.id ? null : sku)}
                    selected={selected?.id === sku.id}
                  />
                ))}

                {/* Popover */}
                {selected && <SKUPopover sku={selected} onClose={() => setSelected(null)} />}
              </div>
            </div>
            {/* X axis label */}
            <div className="flex justify-center pl-8 pt-1">
              <div className="text-[10px] text-muted-foreground">← Relative Market Share</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Timeline + Age Analysis */}
      <div className="grid grid-cols-3 gap-4">
        {/* Lifecycle Timeline */}
        <div className="bg-card border border-border rounded-xl p-5 col-span-2">
          <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Avg Portfolio Age by Product Line
          </h3>
          <div className="space-y-3">
            {avgYearsByLine.map((item) => (
              <div key={item.line} className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground w-28 flex-shrink-0 text-right">{item.line}</div>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(item.avg / 18) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="text-xs font-medium text-foreground w-12">{item.avg}yr</div>
              </div>
            ))}
          </div>

          {/* Review Triggers */}
          <div className="mt-5 pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Upcoming Review Triggers (Age Thresholds)</h4>
            <div className="flex flex-wrap gap-2">
              {reviewTriggers.slice(0, 8).map((sku) => (
                <div key={sku.id} className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-lg text-[11px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="text-muted-foreground">{sku.name}</span>
                  <span className="text-yellow-400 font-medium">{sku.yearsInPortfolio}yr</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Age Analysis */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Portfolio Age Analysis
          </h3>
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-primary" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{recentPct}%</div>
            <div className="text-xs text-muted-foreground mt-1">of revenue from products</div>
            <div className="text-xs text-muted-foreground">launched in last 3 years</div>
          </div>

          <div className="space-y-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Current innovation index</span>
              <span className="text-xs font-bold text-primary">{recentPct}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${recentPct}%` }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">ASSA ABLOY target</span>
              <span className="text-xs font-bold text-green-400">25%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-green-500" style={{ width: '25%' }} />
            </div>
          </div>

          <div className={`mt-4 px-3 py-2 rounded-lg text-xs ${parseFloat(recentPct) >= 25 ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'}`}>
            {parseFloat(recentPct) >= 25
              ? '✓ Meeting innovation target'
              : `⚠ ${(25 - parseFloat(recentPct)).toFixed(1)}pp below target — prioritize new launches`}
          </div>

          <div className="mt-4 space-y-1.5 text-[11px]">
            <div className="flex justify-between"><span className="text-muted-foreground">Products ≤ 3yr old</span><span className="text-foreground">{skus.filter(s => s.yearsInPortfolio <= 3).length} SKUs</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Products ≥ 10yr old</span><span className="text-red-400">{skus.filter(s => s.yearsInPortfolio >= 10).length} SKUs</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Avg portfolio age</span><span className="text-foreground">{(skus.reduce((s, k) => s + k.yearsInPortfolio, 0) / skus.length).toFixed(1)}yr</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
