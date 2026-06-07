import React, { useState, useRef } from 'react';
import USAMap from "react-usa-map";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface MapData {
  stateId: string;
  value: number;
  color: string;
  label?: string;
}

interface USStateMapProps {
  data: MapData[];
  onStateClick?: (stateId: string) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

export const USStateMap: React.FC<USStateMapProps> = ({ data, onStateClick, formatValue, className }) => {
  const [hoveredState, setHoveredState] = useState<MapData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const dataMap = new Map(data.map(d => [d.stateId.toUpperCase(), d]));

  const mapHandler = (event: any) => {
    const stateId = event.target.dataset.name;
    onStateClick?.(stateId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    const target = e.target as SVGPathElement;
    if (target.tagName === 'path' && target.dataset.name) {
      const stateId = target.dataset.name;
      const stateData = dataMap.get(stateId);
      if (stateData) {
        setHoveredState(stateData);
      }
    } else {
      setHoveredState(null);
    }
  };

  const statesCustomConfig = () => {
    const config: Record<string, any> = {};
    data.forEach(d => {
      config[d.stateId] = {
        fill: d.color,
      };
    });
    return config;
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full min-h-[400px] bg-surface-container-lowest rounded-3xl overflow-hidden p-6 border border-outline-variant/10 shadow-inner", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredState(null)}
    >
      <div className="w-full h-full flex items-center justify-center transform scale-[0.85] origin-center">
        <USAMap 
          customize={statesCustomConfig()} 
          onClick={mapHandler} 
          defaultFill="rgba(255, 255, 255, 0.05)"
        />

      </div>

      {/* Premium Multi-Stage Legend */}
      <div className="absolute bottom-6 left-6 p-4 bg-surface-container/80 backdrop-blur-xl rounded-2xl border border-outline-variant/10 shadow-2xl">
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Zillow Market Intensity</p>
        <div className="flex flex-col gap-2">
          <div className="h-2 w-48 bg-gradient-to-r from-[#ba9bff]/10 via-[#ba9bff]/50 to-[#ba9bff] rounded-full ring-1 ring-white/10" />
          <div className="flex justify-between text-[8px] font-bold text-on-surface-variant/60 uppercase">
            <span>Stable</span>
            <span>High Momentum</span>
          </div>
        </div>
      </div>

      {/* Dynamic Hover Tooltip */}
      <AnimatePresence>
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute z-[1000] pointer-events-none bg-surface-container-high/95 backdrop-blur-2xl border border-primary/20 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-1 min-w-[140px]"
            style={{ 
              left: mousePos.x + 15,
              top: mousePos.y - 80,
            }}
          >
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2 mb-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{hoveredState.stateId}</span>
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            </div>
            <p className="text-xs font-black text-on-surface uppercase tracking-tight truncate">
              {hoveredState.label}
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-on-surface headline-font">
                {formatValue ? formatValue(hoveredState.value) : `$${(hoveredState.value / 1000).toFixed(1)}k`}
              </span>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase mb-1">Avg</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        svg path {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          stroke: rgba(255, 255, 255, 0.1);
        }
        svg path:hover {
          filter: drop-shadow(0 0 12px rgba(186, 155, 255, 0.6));
          stroke: #fff !important;
          stroke-width: 2px !important;
          opacity: 1;
          transform: translateY(-2px);
        }
      `}} />
    </div>
  );
};
