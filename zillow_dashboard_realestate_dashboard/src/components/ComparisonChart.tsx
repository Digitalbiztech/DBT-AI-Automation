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

interface ComparisonChartProps {
  data: RealEstateRow[];
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  // Build combined chart data: avg home value and avg rent per date
  const byDate = new Map<string, { homeSum: number; homeCount: number; rentSum: number; rentCount: number }>();

  for (const row of data) {
    if (!byDate.has(row.date)) {
      byDate.set(row.date, { homeSum: 0, homeCount: 0, rentSum: 0, rentCount: 0 });
    }
    const entry = byDate.get(row.date)!;
    if (row.type === "home_value") {
      entry.homeSum += row.value;
      entry.homeCount++;
    } else {
      entry.rentSum += row.value;
      entry.rentCount++;
    }
  }

  const chartData = [...byDate.entries()]
    .map(([date, v]) => ({
      date,
      "Home Value": v.homeCount > 0 ? Math.round(v.homeSum / v.homeCount) : null,
      "Monthly Rent": v.rentCount > 0 ? Math.round(v.rentSum / v.rentCount) : null,
    }))
    .filter((d) => d["Home Value"] !== null || d["Monthly Rent"] !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  const hasHome = chartData.some((d) => d["Home Value"] !== null);
  const hasRent = chartData.some((d) => d["Monthly Rent"] !== null);

  if (chartData.length === 0 || (!hasHome && !hasRent)) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Price vs Rent Comparison
        </h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          Upload both ZHVI and ZORI files to compare
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-sm font-medium text-foreground mb-4">
        Price vs Rent Comparison
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            tickFormatter={(v) => new Date(v).getFullYear().toString()}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
            tickFormatter={(v) =>
              hasHome ? `$${(v / 1000).toFixed(0)}K` : `$${v.toLocaleString()}`
            }
          />
          {hasHome && hasRent && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 9%)",
              border: "1px solid hsl(222, 30%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 96%)",
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {hasHome && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Home Value"
              stroke="hsl(174, 72%, 46%)"
              strokeWidth={2}
              dot={false}
            />
          )}
          {hasRent && (
            <Line
              yAxisId={hasHome ? "right" : "left"}
              type="monotone"
              dataKey="Monthly Rent"
              stroke="hsl(43, 96%, 56%)"
              strokeWidth={2}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
