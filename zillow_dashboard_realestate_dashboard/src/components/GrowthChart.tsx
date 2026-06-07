import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { GrowthRow } from "@/lib/dataProcessing";

interface GrowthChartProps {
  data: GrowthRow[];
}

export function GrowthChart({ data }: GrowthChartProps) {
  // Get latest YoY growth per region
  const regionGrowth = new Map<string, number>();
  const sorted = [...data]
    .filter((r) => r.yoyGrowth !== null && r.type === "home_value")
    .sort((a, b) => b.date.localeCompare(a.date));

  for (const row of sorted) {
    if (!regionGrowth.has(row.region)) {
      regionGrowth.set(row.region, row.yoyGrowth!);
    }
  }

  const chartData = [...regionGrowth.entries()]
    .map(([region, growth]) => ({ region, growth: parseFloat(growth.toFixed(1)) }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 10);

  if (chartData.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">
          YoY Growth by Region
        </h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          Need more data points for growth calculation
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-sm font-medium text-foreground mb-4">
        Top Regions by YoY Growth
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
          <XAxis
            type="number"
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="region"
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 9%)",
              border: "1px solid hsl(222, 30%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 96%)",
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value}%`, "YoY Growth"]}
          />
          <Bar dataKey="growth" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.growth >= 0
                    ? "hsl(152, 69%, 41%)"
                    : "hsl(0, 72%, 51%)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
