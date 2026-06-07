import { TrendingUp, TrendingDown, Home, DollarSign, BarChart3, Percent } from "lucide-react";
import type { GrowthRow } from "@/lib/dataProcessing";

interface StatsCardsProps {
  data: GrowthRow[];
}

export function StatsCards({ data }: StatsCardsProps) {
  const homeValues = data.filter((r) => r.type === "home_value");
  const rents = data.filter((r) => r.type === "rent");

  const latestHome = homeValues.length
    ? homeValues.sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;
  const latestRent = rents.length
    ? rents.sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;

  const avgYoY =
    homeValues.filter((r) => r.yoyGrowth !== null).length > 0
      ? homeValues
          .filter((r) => r.yoyGrowth !== null)
          .reduce((sum, r) => sum + (r.yoyGrowth || 0), 0) /
        homeValues.filter((r) => r.yoyGrowth !== null).length
      : null;

  const avgYield =
    data.filter((r) => r.rentalYield !== null).length > 0
      ? data
          .filter((r) => r.rentalYield !== null)
          .reduce((sum, r) => sum + (r.rentalYield || 0), 0) /
        data.filter((r) => r.rentalYield !== null).length
      : null;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Primary: Median Home Value */}
      <div className="col-span-12 md:col-span-4 bg-card rounded-xl p-5 flex flex-col justify-between relative overflow-hidden border border-border/30">
        <div className="relative z-10">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Median Home Value (ZHVI)</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold headline-font tracking-tight text-foreground">
              {latestHome ? `$${Math.round(latestHome.value).toLocaleString()}` : "—"}
            </span>
          </div>
          {latestHome?.yoyGrowth !== null && latestHome?.yoyGrowth !== undefined && (
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>{latestHome.yoyGrowth >= 0 ? "+" : ""}{latestHome.yoyGrowth.toFixed(1)}% YoY</span>
            </div>
          )}
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
          <Home className="h-24 w-24" />
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div className="bg-primary w-3/4 h-full shadow-[0_0_8px_rgba(186,195,255,0.4)]"></div>
          </div>
          <span className="text-xs text-muted-foreground">75% Target</span>
        </div>
      </div>

      {/* Market Trend YoY */}
      <div className="col-span-12 md:col-span-4 bg-card rounded-xl p-5 flex flex-col justify-between border border-border/30">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Market Trend (YoY)</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold headline-font tracking-tight text-primary">
              {avgYoY !== null ? `${avgYoY >= 0 ? "+" : ""}${avgYoY.toFixed(1)}%` : "—"}
            </span>
          </div>
          <p className="text-muted-foreground text-xs font-light">Year-over-year appreciation</p>
        </div>
        <div className="flex gap-1 mt-4 h-16">
          {[40, 60, 55, 90, 75, 85, 95, 80].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/20 rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Rental Yield */}
      <div className="col-span-12 md:col-span-4 bg-card rounded-xl p-5 border border-border/30">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Avg Rental Yield</p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold headline-font tracking-tight text-foreground">
            {avgYield !== null ? `${avgYield.toFixed(2)}%` : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
          <DollarSign className="h-4 w-4" />
          <span>Median Rent: {latestRent ? `$${Math.round(latestRent.value).toLocaleString()}` : "—"}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-border/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Rent Trend</span>
            {latestRent?.yoyGrowth !== null && latestRent?.yoyGrowth !== undefined && (
              <span className={`font-semibold ${latestRent.yoyGrowth >= 0 ? "text-primary" : "text-destructive"}`}>
                {latestRent.yoyGrowth >= 0 ? "+" : ""}{latestRent.yoyGrowth.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}