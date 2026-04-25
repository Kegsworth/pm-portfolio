import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { skus, PRODUCT_LINES, LINE_COLORS } from '@/lib/portfolioData';

// Compute shared component overlap matrix between lines
function computeOverlapMatrix() {
  const n = PRODUCT_LINES.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    const lineI = skus.filter((s) => s.lineIndex === i);
    // Diagonal = average total components
    matrix[i][i] = Math.round(lineI.reduce((sum, s) => sum + s.components, 0) / Math.max(lineI.length, 1));

    for (let j = i + 1; j < n; j++) {
      const lineJ = skus.filter((s) => s.lineIndex === j);
      // Estimate shared based on average shared components of each line's SKUs — normalized
      const avgSharedI = lineI.reduce((sum, s) => sum + s.sharedComponents, 0) / Math.max(lineI.length, 1);
      const avgSharedJ = lineJ.reduce((sum, s) => sum + s.sharedComponents, 0) / Math.max(lineJ.length, 1);
      // Use geometric mean as rough overlap estimate
      const overlap = Math.round(Math.sqrt(avgSharedI * avgSharedJ) * 0.25);
      matrix[i][j] = overlap;
      matrix[j][i] = overlap;
    }
  }
  return matrix;
}

const overlapMatrix = computeOverlapMatrix();

function matrixCellColor(value: number, isDiag: boolean) {
  if (isDiag) return '#4A9EFF22';
  if (value >= 4) return '#3DD68C33';
  if (value >= 2) return '#F5C51833';
  return '#22222244';
}

function matrixCellTextColor(value: number, isDiag: boolean) {
  if (isDiag) return '#4A9EFF';
  if (value >= 4) return '#3DD68C';
  if (value >= 2) return '#F5C518';
  return 'hsl(215 10% 48%)';
}

const LINE_LABELS = ['AA Sliding', 'AA Swing', 'AA Revolving', 'AA Folding', 'VersaMax', 'RC TSA', 'RC Windcord', 'Sensors'];

// Complexity score: ratio of unique to total
const complexityData = skus
  .map((s) => ({
    name: s.name.length > 20 ? s.name.slice(0, 18) + '…' : s.name,
    full: s.name,
    uniqueRatio: parseFloat(((s.components - s.sharedComponents) / s.components).toFixed(2)),
    components: s.components,
    sharedComponents: s.sharedComponents,
    unique: s.components - s.sharedComponents,
    lineIndex: s.lineIndex,
    id: s.id,
  }))
  .sort((a, b) => b.uniqueRatio - a.uniqueRatio);

const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
        <div className="font-medium text-foreground mb-1">{d.full || label}</div>
        <div className="text-muted-foreground">Unique ratio: <span className="text-primary">{(d.uniqueRatio * 100).toFixed(0)}%</span></div>
        <div className="text-muted-foreground">Unique: {d.unique} / Total: {d.components}</div>
      </div>
    );
  }
  return null;
};

const SUNSET_SKUS = skus.filter((s) => s.recommendation === 'Sunset');
const HEURISTIC = 8000; // $8K per unique component per year

export default function ComponentNetworkTab() {
  const [checkedSunset, setCheckedSunset] = useState<Set<string>>(
    new Set(SUNSET_SKUS.map((s) => s.id))
  );

  const toggleSku = (id: string) => {
    setCheckedSunset((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const savings = useMemo(() => {
    const selected = SUNSET_SKUS.filter((s) => checkedSunset.has(s.id));
    const totalUnique = selected.reduce((sum, s) => sum + (s.components - s.sharedComponents), 0);
    const totalComponents = selected.reduce((sum, s) => sum + s.components, 0);
    const supplySavings = totalUnique * HEURISTIC;
    const mfgSetupSavings = totalComponents * 1200; // $1200/component setup estimate
    return {
      totalUnique,
      totalComponents,
      supplySavings,
      mfgSetupSavings,
      count: selected.length,
    };
  }, [checkedSunset]);

  return (
    <div className="p-6 space-y-5">
      {/* Overlap Matrix */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Component Overlap Matrix
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Estimated shared component count between product lines · Diagonal = avg total components
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse">
            <thead>
              <tr>
                <th className="w-24 p-2" />
                {LINE_LABELS.map((l) => (
                  <th key={l} className="p-2 text-center text-[10px] text-muted-foreground font-medium" style={{ minWidth: 72 }}>
                    {l}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINE_LABELS.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 text-[11px] text-muted-foreground text-right pr-3">{row}</td>
                  {overlapMatrix[i].map((val, j) => {
                    const isDiag = i === j;
                    return (
                      <td
                        key={j}
                        className="p-1 text-center"
                        title={isDiag ? `${LINE_LABELS[i]}: avg ${val} total components` : `${LINE_LABELS[i]} ↔ ${LINE_LABELS[j]}: ~${val} shared`}
                      >
                        <div
                          className="rounded text-[11px] font-semibold py-1.5 px-2"
                          style={{
                            backgroundColor: matrixCellColor(val, isDiag),
                            color: matrixCellTextColor(val, isDiag),
                            border: `1px solid ${isDiag ? '#4A9EFF33' : val >= 4 ? '#3DD68C33' : '#33333355'}`,
                          }}
                        >
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-3 text-[11px]">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-green-500/60" />High overlap (≥4) — rationalization savings</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-yellow-400/60" />Medium (2-3)</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-blue-400/60" />Diagonal — own components</div>
        </div>
      </div>

      {/* Complexity Score Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          Complexity Score by SKU
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">Unique components / total components — higher = greater complexity burden if discontinued</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={complexityData.slice(0, 20)} layout="vertical" margin={{ left: 8, right: 32, top: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(220 18% 14%)" />
            <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fill: 'hsl(215 10% 48%)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(215 10% 48%)', fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip content={<BarTooltip />} />
            <Bar dataKey="uniqueRatio" radius={[0, 3, 3, 0]}>
              {complexityData.slice(0, 20).map((entry, i) => (
                <Cell key={i} fill={LINE_COLORS[entry.lineIndex]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rationalization Savings Estimator */}
      <div className="bg-card border border-primary/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          Rationalization Savings Estimator
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Check/uncheck Sunset SKUs to estimate supply chain and manufacturing savings · Heuristic: $8K/unique component/year
        </p>

        <div className="grid grid-cols-2 gap-6">
          {/* Checkboxes */}
          <div className="space-y-2">
            {SUNSET_SKUS.map((sku) => (
              <label key={sku.id} className="flex items-center gap-3 cursor-pointer group" data-testid={`sunset-toggle-${sku.id}`}>
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    checkedSunset.has(sku.id) ? 'bg-primary border-primary' : 'border-border bg-secondary'
                  }`}
                  onClick={() => toggleSku(sku.id)}
                >
                  {checkedSunset.has(sku.id) && (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-xs text-foreground group-hover:text-primary transition-colors">{sku.name}</span>
                  <span className="text-[11px] text-muted-foreground ml-2">{sku.components - sku.sharedComponents} unique parts</span>
                </div>
              </label>
            ))}
          </div>

          {/* Savings summary */}
          <div className="bg-secondary/60 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Estimated Impact</div>

            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-primary" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  ${(savings.supplySavings / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-muted-foreground">Annual supply chain savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  ${(savings.mfgSetupSavings / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-muted-foreground">Manufacturing setup reduction</div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs border-t border-border pt-4">
              <div className="flex justify-between"><span className="text-muted-foreground">SKUs selected</span><span className="text-foreground">{savings.count}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Unique components freed</span><span className="text-foreground">{savings.totalUnique}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total components affected</span><span className="text-foreground">{savings.totalComponents}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
