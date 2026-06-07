import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { AnalysisOperation } from "@/lib/queryEngine";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QueryResultsProps {
  result: {
    data: Record<string, any>[];
    operation: AnalysisOperation;
    explanation: string;
    chartType: "bar" | "line" | "pie" | "table" | "comparison" | "heatmap" | "radar";
    columns: string[];
  };
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
  "#14b8a6",
];

const formatValue = (value: number, metric: string): string => {
  if (metric.includes("yield") || metric.includes("growth") || metric.includes("cagr") || metric.includes("volatility")) {
    return `${value.toFixed(1)}%`;
  }
  if (metric.includes("value") || metric.includes("price")) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return value.toLocaleString();
};

export function QueryResults({ result }: QueryResultsProps) {
  const chartData = useMemo(() => {
    if (!result.data.length) return [];

    const groupField = result.operation.groupBy || "state";
    
    return result.data.map((d) => ({
      name: d[groupField] || d.region || d.city || d.state || "Unknown",
      value: d.avg_value || d.value || 0,
      yoy_growth: d.yoy_growth || 0,
      rental_yield: d.rental_yield || 0,
      volatility: d.volatility || 0,
      cagr: d.cagr || 0,
      count: d.count || 0,
      min: d.min_value || 0,
      max: d.max_value || 0,
    }));
  }, [result]);

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data to display
        </div>
      );
    }

    const showMultipleMetrics = result.operation.metrics?.some(m => 
      ["yoy_growth", "rental_yield", "cagr", "volatility"].includes(m)
    );

    if (result.chartType === "line" || result.operation.analysisType === "time_series") {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#888" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              yAxisId="left" 
              stroke="#888" 
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#888"
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [formatValue(value, name), name.replace(/_/g, " ")]}
            />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="value" 
              fill="#6366f1" 
              fillOpacity={0.2}
              stroke="#6366f1" 
              strokeWidth={2}
              name="avg_value"
            />
            {showMultipleMetrics && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="yoy_growth" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: "#22c55e" }}
                name="yoy_growth"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      );
    }

    if (result.chartType === "radar" || (result.operation.analysisType === "risk" && chartData.length > 0)) {
      // For radar chart, we normalize metrics to 0-100 scale or use their relative values
      return (
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="name" tick={{ fill: "#888", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: "#888", fontSize: 10 }} />
            <Radar
              name="Avg Value"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.5}
            />
            {showMultipleMetrics && (
              <Radar
                name="YoY Growth"
                dataKey="yoy_growth"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.3}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [formatValue(value, name), name.replace(/_/g, " ")]}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      );
    }

    if (result.chartType === "comparison" || result.operation.compareRegions) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#888"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left" 
              stroke="#888" 
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#888"
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [formatValue(value, name), name.replace(/_/g, " ")]}
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="value" 
              fill="#6366f1" 
              radius={[4, 4, 0, 0]}
              name="avg_value"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="yoy_growth" 
              stroke="#22c55e" 
              strokeWidth={2}
              name="yoy_growth"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="rental_yield" 
              stroke="#f97316" 
              strokeWidth={2}
              name="rental_yield"
            />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }

    // Default: Horizontal bar chart for rankings
    return (
      <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 40)}>
        <BarChart
          data={chartData.slice().sort((a, b) => b.value - a.value)}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            type="number" 
            stroke="#888" 
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#888" 
            width={110}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string) => [formatValue(value, name), name.replace(/_/g, " ")]}
          />
          <Bar 
            dataKey="value" 
            fill="#6366f1" 
            radius={[0, 4, 4, 0]}
            name="avg_value"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderMetricsTable = () => {
    if (!result.data.length) return null;

    const groupField = result.operation.groupBy || "state";
    const showMetrics = result.operation.metrics?.some(m => 
      ["yoy_growth", "rental_yield", "cagr", "volatility", "price_to_rent"].includes(m)
    );

    const columns = showMetrics
      ? [groupField, "avg_value", "yoy_growth", "rental_yield", "cagr", "volatility", "count"]
      : [groupField, "avg_value", "min_value", "max_value", "count"];

    return (
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/50">
            {columns.map((col) => (
              <TableHead key={col} className="text-muted-foreground text-xs">
                {col === "avg_value" ? "Avg Value" : 
                 col === "min_value" ? "Min" : 
                 col === "max_value" ? "Max" : 
                 col === "yoy_growth" ? "YoY Growth" :
                 col === "rental_yield" ? "Yield" :
                 col === "cagr" ? "CAGR" :
                 col === "volatility" ? "Volatility" :
                 col === "count" ? "Records" :
                 col.charAt(0).toUpperCase() + col.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.data.slice(0, 20).map((row, idx) => (
            <TableRow key={idx} className="hover:bg-secondary/30 border-border/30">
              {columns.map((col) => {
                const val = row[col as keyof typeof row];
                const isNumeric = typeof val === "number";
                
                return (
                  <TableCell key={col} className="text-foreground text-sm py-2">
                    {isNumeric && col !== groupField
                      ? formatValue(val, col)
                      : val || "—"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-foreground">
            {result.data.length} results
          </h3>
          <p className="text-xs text-muted-foreground">{result.explanation}</p>
        </div>
      </div>

      <Card className="bg-secondary/20 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {result.operation.groupBy 
              ? `Analysis by ${result.operation.groupBy.charAt(0).toUpperCase() + result.operation.groupBy.slice(1)}`
              : "Analysis Results"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      <Card className="bg-secondary/20 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Detailed Metrics</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-80 overflow-auto">
            {renderMetricsTable()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}