import { useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import { skus, LINE_COLORS } from '@/lib/portfolioData';

const gmColor = (gm: number) => {
  if (gm > 45) return '#3DD68C';
  if (gm >= 35) return '#F5C518';
  if (gm >= 25) return '#FB923C';
  return '#EF4444';
};

const recColor: Record<string, string> = {
  Invest: '#3DD68C',
  Optimize: '#4A9EFF',
  Consolidate: '#F5C518',
  Sunset: '#EF4444',
};

function HeatMapCell({ sku, onHover, hovered }: { sku: typeof skus[0]; onHover: (s: typeof skus[0] | null) => void; hovered: typeof skus[0] | null }) {
  const bg = gmColor(sku.gmPercent);
  const isHovered = hovered?.id === sku.id;
  return (
    <div
      onMouseEnter={() => onHover(sku)}
      onMouseLeave={() => onHover(null)}
      className="rounded text-[9px] font-medium flex items-center justify-center cursor-default"
      style={{
        backgroundColor: bg + (isHovered ? 'ee' : '28'),
        border: `1px solid ${bg}${isHovered ? 'cc' : '44'}`,
        color: isHovered ? '#fff' : bg,
        padding: '2px 4px',
        minHeight: '28px',
        fontSize: '9px',
        outline: isHovered ? `2px solid ${bg}` : 'none',
        outlineOffset: '1px',
      }}
      title={`${sku.name}: ${sku.gmPercent}%`}
    >
      {sku.gmPercent}%
    </div>
  );
}

const ScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg max-w-[200px]">
        <div className="font-semibold text-foreground mb-1">{d.name}</div>
        <div className="space-y-0.5 text-muted-foreground">
          <div>Revenue: <span className="text-foreground">${d.revenue}M</span></div>
          <div>GM%: <span className="text-foreground">{d.gm}%</span></div>
          <div>Rec: <span style={{ color: recColor[d.rec] }}>{d.rec}</span></div>
        </div>
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
        <div className="font-medium text-foreground mb-1 max-w-[160px] truncate">{label}</div>
        <div className="text-orange-400">Cost-to-Serve: {payload[0].value}%</div>
      </div>
    );
  }
  return null;
};

export default function MarginAnalysisTab() {
  const [hovered, setHovered] = useState<typeof skus[0] | null>(null);

  // Group by line for heatmap
  const lineGroups = Array.from({ length: 8 }, (_, i) =>
    skus.filter((s) => s.lineIndex === i)
  );

  // Scatter data
  const scatterData = skus.map((s) => ({
    name: s.name,
    revenue: s.revenue,
    gm: s.gmPercent,
    components: s.components,
    rec: s.recommendation,
    lineIndex: s.lineIndex,
  }));

  // Top 15 Cost-to-Serve
  const topCosts = [...skus]
    .sort((a, b) => b.costToServe - a.costToServe)
    .slice(0, 15)
    .map((s) => ({
      name: s.name.length > 20 ? s.name.slice(0, 18) + '…' : s.name,
      full: s.name,
      value: s.costToServe,
      color: s.costToServe > 30 ? '#EF4444' : s.costToServe > 20 ? '#FB923C' : '#F5C518',
    }));

  const LINE_LABELS = ['AA Sliding', 'AA Swing', 'AA Revolving', 'AA Folding', 'VersaMax', 'RC TSA', 'RC Windcord', 'Sensors'];

  return (
    <div className="p-6 space-y-5">
      {/* Heatmap */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Gross Margin Heat Map
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">All 47 SKUs — hover for details</p>
          </div>
          <div className="flex gap-3 text-[11px]">
            {[{ label: '>45%', color: '#3DD68C' }, { label: '35–45%', color: '#F5C518' }, { label: '25–35%', color: '#FB923C' }, { label: '<25%', color: '#EF4444' }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: l.color }} />
                <span className="text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip — always rendered to prevent layout shift */}
        <div className="mb-3 px-3 py-2 bg-secondary border border-border rounded-lg text-xs flex items-center gap-4" style={{ visibility: hovered ? 'visible' : 'hidden' }}>
          <span className="font-semibold text-foreground">{hovered?.name ?? '—'}</span>
          <span className="text-muted-foreground">{hovered?.line ?? ''}</span>
          <span style={{ color: hovered ? gmColor(hovered.gmPercent) : 'transparent' }}>GM: {hovered?.gmPercent ?? 0}%</span>
          <span className="text-muted-foreground">Rev: ${hovered?.revenue ?? 0}M</span>
          <span className="text-muted-foreground">{hovered?.recommendation ?? ''}</span>
        </div>

        <div className="space-y-3">
          {lineGroups.map((lineSkus, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-[11px] text-muted-foreground w-24 flex-shrink-0 text-right pr-2">{LINE_LABELS[i]}</div>
              <div className="flex gap-1.5 flex-wrap">
                {lineSkus.map((sku) => (
                  <HeatMapCell key={sku.id} sku={sku} onHover={setHovered} hovered={hovered} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Scatter Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Revenue vs. Margin Portfolio Map
          </h3>
          <p className="text-[11px] text-muted-foreground mb-4">Bubble size = component count · Color = recommendation</p>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 18% 87%)" />
              <XAxis
                type="number" dataKey="revenue" name="Revenue"
                tickFormatter={(v) => `$${v}M`}
                tick={{ fill: 'hsl(25 12% 48%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(30 18% 87%)' }} tickLine={false}
                label={{ value: 'Revenue ($M)', position: 'insideBottom', offset: -12, fill: 'hsl(25 12% 48%)', fontSize: 10 }}
              />
              <YAxis
                type="number" dataKey="gm" name="GM%"
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: 'hsl(25 12% 48%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(30 18% 87%)' }} tickLine={false}
                domain={[10, 65]}
              />
              <ZAxis type="number" dataKey="components" range={[50, 250]} />
              <Tooltip content={<ScatterTooltip />} />
              {Object.entries(recColor).map(([rec, color]) => (
                <Scatter
                  key={rec}
                  name={rec}
                  data={scatterData.filter((d) => d.rec === rec)}
                  fill={color}
                  fillOpacity={0.75}
                  stroke={color}
                  strokeWidth={1}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-[10px]">
            {Object.entries(recColor).map(([rec, color]) => (
              <div key={rec} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />{rec}</div>
            ))}
          </div>
        </div>

        {/* Cost-to-Serve Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Top 15 Cost-to-Serve Burden
          </h3>
          <p className="text-[11px] text-muted-foreground mb-4">As % of revenue — higher = operational complexity drag</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topCosts} layout="vertical" margin={{ left: 4, right: 32, top: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(30 18% 87%)" />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fill: 'hsl(25 12% 48%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(25 12% 48%)', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                {topCosts.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Impact Summary */}
      <div className="bg-card border border-primary/20 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="hsl(16 90% 58%)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Financial Impact: Sunset SKU Rationalization
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If the 9 Sunset SKUs are discontinued, the projected portfolio impact is:
            </p>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[
                { label: 'Revenue Reduction', value: '-$3.2M', sub: '5.1% portfolio exposure', color: 'text-red-400' },
                { label: 'GM Improvement', value: '+$180K', sub: 'Margin drag eliminated', color: 'text-green-400' },
                { label: 'Supply Chain Savings', value: '-19%', sub: 'Complexity reduction', color: 'text-blue-400' },
                { label: 'Mfg Cost Savings', value: '~$420K', sub: 'Setup & tooling', color: 'text-primary' },
              ].map((item) => (
                <div key={item.label} className="bg-secondary/60 rounded-lg p-3">
                  <div className={`text-lg font-bold ${item.color}`} style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{item.value}</div>
                  <div className="text-[11px] text-foreground mt-0.5">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
