import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RealEstateRow } from "@/lib/dataProcessing";
import { getChartData, getTopRegions } from "@/lib/dataProcessing";

const CHART_COLORS = [
  "hsl(231, 74%, 70%)",
  "hsl(262, 83%, 58%)",
  "hsl(199, 89%, 48%)",
  "hsl(43, 96%, 56%)",
  "hsl(0, 72%, 51%)",
];

interface PriceChartProps {
  data: RealEstateRow[];
  type: "home_value" | "rent";
  title: string;
}

export function PriceChart({ data, type, title }: PriceChartProps) {
  const chartData = getChartData(data, type);
  const topRegions = getTopRegions(
    data.filter((r) => r.type === type),
    5
  );

  if (chartData.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-sm font-medium text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            tickFormatter={(v) =>
              type === "rent"
                ? `$${v.toLocaleString()}`
                : `$${(v / 1000).toFixed(0)}K`
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 9%)",
              border: "1px solid hsl(222, 30%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 96%)",
              fontSize: 12,
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "hsl(215, 20%, 55%)" }}
          />
          {topRegions.map((region, i) => (
            <Line
              key={region}
              type="monotone"
              dataKey={region}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              dot={false}
              name={region}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
