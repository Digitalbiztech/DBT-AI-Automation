
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface Metric {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
  shadowColor: string;
  glowColor: string;
  trend: string;
}

interface MetricsGridProps {
  metrics: Metric[];
  onConfigureSupabase?: (tableName: string) => void;
  showSettings?: boolean;
}

export const MetricsGrid = ({ metrics, onConfigureSupabase, showSettings = false }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          className={cn(
            "group relative overflow-hidden border-0 bg-white/70 backdrop-blur-xl transition-all duration-700 rounded-3xl hover:scale-108 hover:-translate-y-3",
            metric.shadowColor,
            metric.glowColor
          )}
          style={{
            boxShadow: '0 10px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}></div>
          
          <CardContent className="relative p-8">
            {showSettings && onConfigureSupabase && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-purple-400 hover:text-purple-600 hover:bg-white/60"
                onClick={() => onConfigureSupabase('metrics')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-3">
                <p className="text-sm font-bold text-purple-700/80 uppercase tracking-wider">{metric.title}</p>
                <p className="text-4xl font-black bg-gradient-to-r from-purple-800 to-blue-800 bg-clip-text text-transparent">
                  0
                </p>
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <p className="text-sm font-bold text-emerald-600">+0 vs baseline</p>
                </div>
              </div>
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${metric.bgGradient} group-hover:scale-125 group-hover:rotate-6 transition-all duration-700 shadow-xl`}>
                <metric.icon className={`h-7 w-7 ${metric.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
