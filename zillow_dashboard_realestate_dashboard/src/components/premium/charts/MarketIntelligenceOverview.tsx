import React from 'react';
import { Card } from '@/components/ui/card';
import { Info, Target, TrendingUp, AlertCircle } from 'lucide-react';

export const MarketIntelligenceOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">Zillow Home Value Forecast (ZHVF)</h3>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          The ZHVF provides a month-ahead, quarter-ahead, and year-ahead predictive analysis of the Zillow Home Value Index (ZHVI). 
          Based on the <span className="text-primary font-bold">neural Zestimate</span> engine, these forecasts leverage advanced data patterns 
          to appreciate market shifts before they occur in the public indices.
        </p>
        <div className="space-y-3">
          {[
            { label: 'Short-Term', desc: '1-Month MoM% Appreciation' },
            { label: 'Medium-Term', desc: '3-Month QoQ% Momentum' },
            { label: 'Long-Term', desc: '12-Month YoY% Terminal Value' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-3 bg-surface-container-high/40 rounded-xl border border-outline-variant/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary w-20">{item.label}</span>
              <span className="text-xs text-on-surface-variant font-medium">{item.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-surface-container/30 backdrop-blur-sm border-outline-variant/10 rounded-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-secondary" />
          </div>
          <h3 className="text-lg font-bold text-on-surface">Market Heat Index</h3>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          This metric captures the <span className="text-secondary font-bold">supply-demand equilibrium</span>. 
          A higher index indicates a Seller's Market, driven by high buyer engagement and low listing velocity.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-surface-container-high/40 rounded-xl border border-outline-variant/5 flex flex-col items-center">
            <span className="text-2xl font-black text-on-surface">82/100</span>
            <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] mt-1 text-center">Current Demand Velocity</p>
          </div>
          <div className="p-4 bg-surface-container-high/40 rounded-xl border border-outline-variant/5 flex flex-col items-center">
            <span className="text-2xl font-black text-on-surface">Seller</span>
            <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] mt-1 text-center">Market Dominance</p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-on-surface-variant italic">
            Note: Neural Zestimate upgrades (Jan 2023) have improved forecast accuracy for All Homes, mid-tier cuts.
          </p>
        </div>
      </Card>
    </div>
  );
};
