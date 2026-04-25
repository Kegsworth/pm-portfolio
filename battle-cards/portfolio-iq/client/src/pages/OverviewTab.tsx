import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PORTFOLIO_STATS, REVENUE_BY_LINE, GM_BY_LINE, ABC_SUMMARY, LINE_COLORS } from '@/lib/portfolioData';

const KPI_CARDS = [
  {
    label: 'Total Portfolio Revenue',
    value: `$${PORTFOLIO_STATS.totalRevenue}M`,
    sub: 'FY2024 Actuals',
    delta: '+8.2% YoY',
    up: true,
    color: 'text-primary',
  },
  {
    label: 'Weighted Avg GM%',
    value: `${PORTFOLIO_STATS.weightedAvgGM}%`,
    sub: 'Blended gross margin',
    delta: '-0.4pp YoY',
    up: false,
    color: 'text-yellow-400',
  },
  {
    label: 'SKUs to Rationalize',
    value: String(PORTFOLIO_STATS.skusToRationalize),
    sub: 'Sunset candidates',
    delta: 'Action required',
    up: false,
    color: 'text-red-400',
  },
  {
    label: 'Value at Risk',
    value: `$${PORTFOLIO_STATS.valueAtRisk}M`,
    sub: 'Revenue from Sunset SKUs',
    delta: 'Recoverable margin: +$180K',
    up: true,
    color: 'text-orange-400',
  },
];

const HEALTH_DRIVERS = [
  { label: 'Revenue concentration (A-class)', value: 68, target: 65, up: true },
  { label: 'Portfolio GM% vs target (40%)', value: -1.3, isGap: true, up: false },
  { label: 'Innovation index (% rev <3yr)', value: 22, target: 25, up: false },
];

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
        <div className="font-semibold text-foreground mb-1">{payload[0].name}</div>
        <div className="text-primary">${payload[0].value.toFixed(1)}M</div>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
        <div className="font-medium text-foreground mb-1">{label}</div>
        <div style={{ color: payload[0].fill }}>{payload[0].value}% GM</div>
      </div>
    );
  }
  return null;
};

// Health Score SVG Arc
function HealthGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const cx = 70;
  const cy = 70;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <svg width="140" height="90" viewBox="0 0 140 90">
        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="hsl(220 18% 14%)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="hsl(16 90% 58%)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ filter: 'drop-shadow(0 0 6px hsl(16 90% 58% / 0.5))' }}
        />
        {/* Score text */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="hsl(210 15% 92%)" fontSize="28" fontWeight="800" fontFamily="'Cabinet Grotesk', sans-serif">
          {score}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="hsl(215 10% 48%)" fontSize="11" fontFamily="'Satoshi', sans-serif">
          / 100
        </text>
      </svg>
      <div className="text-xs text-muted-foreground mt-1">Portfolio Health Score</div>
    </div>
  );
}

export default function OverviewTab() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4" data-testid="kpi-row">
        {KPI_CARDS.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="text-xs text-muted-foreground mb-2">{card.label}</div>
            <div className={`text-2xl font-bold mb-1 ${card.color}`} style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              {card.value}
            </div>
            <div className="text-[11px] text-muted-foreground">{card.sub}</div>
            <div className={`text-[11px] mt-2 flex items-center gap-1 ${card.up ? 'text-green-400' : 'text-red-400'}`}>
              <span>{card.up ? '↑' : '↓'}</span>
              {card.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Revenue by Line PieChart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Revenue by Product Line
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={REVENUE_BY_LINE}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={80}
                  strokeWidth={1}
                  stroke="hsl(220 22% 8%)"
                >
                  {REVENUE_BY_LINE.map((entry, i) => (
                    <Cell key={i} fill={LINE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {REVENUE_BY_LINE.map((line, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: LINE_COLORS[i] }} />
                  <span className="text-muted-foreground truncate flex-1">{line.name.replace('ASSA ABLOY ', '').replace('RECORD ', '')}</span>
                  <span className="text-foreground font-medium">${line.revenue.toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GM% by Line BarChart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Gross Margin % by Product Line
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={GM_BY_LINE} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(220 18% 14%)" />
              <XAxis type="number" domain={[0, 60]} tickFormatter={(v) => `${v}%`} tick={{ fill: 'hsl(215 10% 48%)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(215 10% 48%)', fontSize: 10 }} axisLine={false} tickLine={false} width={72} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="gm" radius={[0, 3, 3, 0]}>
                {GM_BY_LINE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex gap-4 mt-3 text-[11px]">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-green-500" /><span className="text-muted-foreground">&gt;45%</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-yellow-400" /><span className="text-muted-foreground">35–45%</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-red-500" /><span className="text-muted-foreground">&lt;35%</span></div>
          </div>
        </div>
      </div>

      {/* Health Score + ABC Summary */}
      <div className="grid grid-cols-3 gap-4">
        {/* Health Gauge */}
        <div className="bg-card border border-border rounded-xl p-5 col-span-1">
          <HealthGauge score={PORTFOLIO_STATS.healthScore} />
          <div className="space-y-3 mt-2">
            {HEALTH_DRIVERS.map((d) => (
              <div key={d.label} className="flex items-start justify-between gap-2">
                <div className="text-[11px] text-muted-foreground leading-tight flex-1">{d.label}</div>
                <div className={`text-[11px] font-semibold flex items-center gap-1 ${d.up ? 'text-green-400' : 'text-red-400'}`}>
                  {d.up ? '↑' : '↓'}
                  {d.isGap ? `${d.value}pp` : `${d.value}%`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ABC Summary */}
        <div className="bg-card border border-border rounded-xl p-5 col-span-2">
          <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            ABC Classification Summary
          </h3>
          <div className="space-y-3">
            {ABC_SUMMARY.map((row) => (
              <div key={row.tier} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  row.tier === 'A' ? 'bg-green-500/15 text-green-400' :
                  row.tier === 'B' ? 'bg-yellow-500/15 text-yellow-400' :
                  'bg-red-500/15 text-red-400'
                }`}>
                  {row.tier}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">{row.count} SKUs</span>
                    <span className="text-muted-foreground">${row.revenue}M</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        row.tier === 'A' ? 'bg-green-500' :
                        row.tier === 'B' ? 'bg-yellow-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${(row.revenue / PORTFOLIO_STATS.totalRevenue) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {((row.revenue / PORTFOLIO_STATS.totalRevenue) * 100).toFixed(1)}% of portfolio revenue
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-primary" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>12</div>
              <div className="text-[11px] text-muted-foreground">Invest candidates</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>19</div>
              <div className="text-[11px] text-muted-foreground">Optimize targets</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>7</div>
              <div className="text-[11px] text-muted-foreground">Consolidate pairs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
