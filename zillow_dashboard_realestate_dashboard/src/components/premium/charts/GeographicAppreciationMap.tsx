import React, { useEffect, useState } from 'react';
import { USStateMap, MapData } from '../USStateMap';
import { calculateStateAppreciation } from '@/utils/forecastProcessor';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const GeographicAppreciationMap: React.FC = () => {
  const [data, setData] = useState<MapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/archive/State_Zhvi_AllHomes.csv');
        const csvText = await response.text();
        const appreciationData = calculateStateAppreciation(csvText);

        const min = Math.min(...appreciationData.map(d => d.value));
        const max = Math.max(...appreciationData.map(d => d.value));

        const finalMapData: MapData[] = appreciationData.map(d => {
          const intensity = (d.value - min) / (max - min);
          
          let color;
          if (d.value > 0) {
            // Growth: Teal-Green
            color = `rgba(0, 150, 136, ${0.3 + (d.value / max) * 0.7})`;
          } else {
            // Decline: Red
            color = `rgba(244, 67, 54, ${0.3 + (Math.abs(d.value) / Math.abs(min)) * 0.7})`;
          }

          return {
            stateId: d.stateId,
            value: d.value,
            color,
            label: d.stateName,
          };
        });

        setData(finalMapData);
      } catch (err) {
        console.error('Failed to fetch appreciation data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-outline-variant/30 rounded-2xl bg-surface-container/10">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50 mb-4" />
        <p className="text-sm text-on-surface-variant font-medium">Crunching Regional Appreciation Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-on-surface mb-1">State Appreciation Map</h3>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">YoY Price Momentum</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-high/40 p-2 px-4 rounded-full border border-outline-variant/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#009688]" title="Growth" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Appreciating</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F44336]" title="Decline" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Correcting</span>
          </div>
        </div>
      </div>
      
      <div className="h-[450px] w-full">
        <USStateMap data={data} className="h-full" />
      </div>

      <p className="text-[10px] text-on-surface-variant/80 mt-4 italic text-right">
        * Based on trailing 12-month ZHVI terminal values. Tooltips show YoY % Appreciation.
      </p>
    </div>
  );
};
