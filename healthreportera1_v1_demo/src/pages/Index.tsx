import { useState, useMemo, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { fetchPubMedArticles, PubMedArticle } from '@/lib/pubmed';
import logo from '@/components/logo/YC_Main_WG.png';
import letterformLogo from '@/components/logo/YC_Letterform_WG.png';
import iconLogo from '@/components/logo/YC_Icon_GS.png';
import { LabReport, Biomarker } from '@/types/lab';
import { parseLabReport } from '@/lib/apiService';
import { UploadZone } from '@/components/UploadZone';
import {
  PanelBarChart, StatusSummaryChart, BodySystemOverviewChart,
  CategoryDistributionChart, BiomarkerCard, BiomarkerDetailDialog,
} from '@/components/LabCharts';
import { TrendAnalysisChart } from '@/components/TrendAnalysisChart';
import { BiomarkerProfileChart } from '@/components/BiomarkerProfileChart';
import { AIChat } from '@/components/AIChat';
import { ExportButton } from '@/components/ExportButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertTriangle, CheckCircle, Info, RotateCcw, FlaskConical,
  FileText, Lightbulb, Sparkles, Activity, TrendingUp, Shield,
  Sun, Moon, TrendingDown, Zap, Heart, Droplets, Brain, Bone,
  ThermometerSun, Wind, CircleDot, AlertCircle, Terminal, Plus, LogOut,
  ChevronDown, ArrowUp, ArrowDown, Search, MoreVertical, User,
  BookOpen, ExternalLink, Loader2
} from 'lucide-react';
import { getStatusColor } from '@/lib/statusHelpers';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { resolveRange } from '@/lib/biomarkerRanges';




/* ── Key‑finding icon heuristic ── */
function getMarkerIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('cholesterol') || n.includes('ldl') || n.includes('hdl') || n.includes('triglyceride')) return Heart;
  if (n.includes('glucose') || n.includes('hba1c') || n.includes('insulin')) return Droplets;
  if (n.includes('tsh') || n.includes('thyroid') || n.includes('t3') || n.includes('t4')) return ThermometerSun;
  if (n.includes('wbc') || n.includes('white blood') || n.includes('neutro') || n.includes('lympho')) return Shield;
  if (n.includes('rbc') || n.includes('hemoglobin') || n.includes('hematocrit') || n.includes('platelet')) return CircleDot;
  if (n.includes('creatinine') || n.includes('bun') || n.includes('egfr') || n.includes('kidney')) return Droplets;
  if (n.includes('vitamin') || n.includes('folate') || n.includes('ferritin') || n.includes('iron')) return Zap;
  if (n.includes('testosterone') || n.includes('estrogen') || n.includes('cortisol') || n.includes('dhea')) return Brain;
  if (n.includes('calcium') || n.includes('phosphorus') || n.includes('magnesium')) return Bone;
  if (n.includes('sodium') || n.includes('potassium') || n.includes('chloride')) return Wind;
  return AlertCircle;
}

/* ── Priority score for picking top findings ── */
function findingPriority(b: Biomarker) {
  if (b.status === 'critical') return 3;
  if (b.status === 'high') return 2;
  if (b.status === 'low') return 1;
  return 0;
}


function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center justify-center h-8 w-8 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
      aria-label="Toggle theme"
    >
    </button>
  );
}

interface BloodGPTReportLayoutProps {
  report: LabReport;
  allBiomarkers: Biomarker[];
  abnormal: Biomarker[];
  normalCount: number;
  normalPct: number;
  setSelectedMarker: (m: Biomarker) => void;
}

function BloodGPTReportLayout({
  report,
  allBiomarkers,
  abnormal,
  normalCount,
  normalPct,
  setSelectedMarker,
}: BloodGPTReportLayoutProps) {
  const [biomarkerFilter, setBiomarkerFilter] = useState<'all' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>(null);

  const [pubmedArticles, setPubmedArticles] = useState<PubMedArticle[]>([]);
  const [loadingPubmed, setLoadingPubmed] = useState(false);

  useEffect(() => {
    async function loadArticles() {
      // Find the abnormal biomarkers
      const abnormalNames = abnormal.map(b => b.name);
      
      let query = "";
      if (abnormalNames.length > 0) {
        // Pick the top 2 abnormal biomarkers to avoid overly long/failed queries
        const primaryAbnormal = abnormalNames.slice(0, 2);
        query = `${primaryAbnormal.join(" OR ")} abnormal`;
      } else {
        // Fallback search query if everything is normal
        query = "biomarkers healthy longevity reference ranges";
      }

      setLoadingPubmed(true);
      try {
        // Limit to 2 or 3 articles as requested: "check dicuss only 2 or 3 article only"
        const articles = await fetchPubMedArticles(query, 3);
        setPubmedArticles(articles);
      } catch (err) {
        console.error("Failed to load related PubMed articles:", err);
      } finally {
        setLoadingPubmed(false);
      }
    }

    loadArticles();
  }, [abnormal]);

  const birthDate = report.birthDate || report.patientDob || '11/05/1976';
  const gender = report.patientGender || 'Male';
  const weight = report.patientWeight || '100';
  const height = report.patientHeight || '177';
  const scanDate = report.testDate || report.labDate || report.collectionDate || '16/02/2026';
  const dateAnalyzed = report.dateAnalyzed || report.reportDate || new Date().toLocaleDateString('en-GB');
  const testType = report.testType || 'Blood, Other, Serum or Plasma';
  const labName = report.labName || 'Unknown';

  const filteredBiomarkers = allBiomarkers.filter(b => {
    if (biomarkerFilter === 'flagged' && b.status === 'normal') return false;
    if (searchQuery) return b.name.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  const panelsWithFilteredBiomarkers = useMemo(() => {
    if (!report || !report.panels) return [];
    return report.panels.map(panel => {
      const biomarkers = panel.biomarkers.filter(b => {
        if (biomarkerFilter === 'flagged' && b.status === 'normal') return false;
        if (searchQuery) return b.name.toLowerCase().includes(searchQuery.toLowerCase());
        return true;
      });
      return {
        ...panel,
        biomarkers
      };
    }).filter(panel => panel.biomarkers.length > 0);
  }, [report, biomarkerFilter, searchQuery]);


  // const renderRangeBar = (rawVal: any, rawMin: any, rawMax: any, status: string) => {
  //   const val = Number(rawVal) || 0;
  //   const min = Number(rawMin) || 0;
  //   const max = Number(rawMax) || (val > 0 ? val * 1.5 : 100);

  //   // Safeguard to ensure min is always strictly less than max
  //   let safeMin = min;
  //   let safeMax = max;
  //   if (safeMin >= safeMax) {
  //     safeMin = 0;
  //     safeMax = val > 0 ? val * 1.5 : 100;
  //   }

  //   const rangeSpan = safeMax - safeMin || 1;
  //   const barMin = Math.max(0, safeMin - rangeSpan * 0.5);
  //   const barMax = safeMax + rangeSpan * 0.5;
  //   const totalSpan = barMax - barMin;

  //   const minPercent = (safeMin - barMin) / totalSpan;
  //   const maxPercent = (safeMax - barMin) / totalSpan;
  //   const valuePercent = Math.min(1, Math.max(0, (val - barMin) / totalSpan));

  //   // Colors mapping
  //   const lowColor = '#f59e0b'; // Amber-500
  //   const normalColor = '#10b981'; // Emerald-500
  //   const highColor = '#ef4444'; // Rose-500

  //   const statusClean = (status || 'normal').toLowerCase();
  //   const pointerColor = statusClean === 'high' || statusClean === 'critical' ? highColor : statusClean === 'low' ? lowColor : normalColor;

  //   // Radius & Center for SVG Semi-Circle Dial
  //   const r = 32;
  //   const cx = 50;
  //   const cy = 40;

  //   // Convert degrees to radians helper
  //   const rad = (deg: number) => (deg * Math.PI) / 180;

  //   // Calculations of coordinates on the arc
  //   // Angle 180 is extreme left, 360 is extreme right
  //   const lowAngle = 180 + minPercent * 180;
  //   const highAngle = 180 + maxPercent * 180;
  //   const valAngle = 180 + valuePercent * 180;

  //   const xStart = cx + r * Math.cos(rad(180));
  //   const yStart = cy + r * Math.sin(rad(180));

  //   const xMin = cx + r * Math.cos(rad(lowAngle));
  //   const yMin = cy + r * Math.sin(rad(lowAngle));

  //   const xMax = cx + r * Math.cos(rad(highAngle));
  //   const yMax = cy + r * Math.sin(rad(highAngle));

  //   const xEnd = cx + r * Math.cos(rad(360));
  //   const yEnd = cy + r * Math.sin(rad(360));

  //   const needleX = cx + (r - 4) * Math.cos(rad(valAngle));
  //   const needleY = cy + (r - 4) * Math.sin(rad(valAngle));

  //   return (
  //     <div className="flex items-center gap-4 select-none">
  //       {/* SVG Semi-Circle Speedometer Arc */}
  //       <div className="relative w-28 h-16 shrink-0">
  //         <svg className="w-full h-full" viewBox="0 0 100 50">
  //           {/* Background Arc Shadow */}
  //           <path
  //             d={`M ${xStart} ${yStart} A ${r} ${r} 0 0 1 ${xEnd} ${yEnd}`}
  //             fill="none"
  //             stroke="hsl(var(--secondary))"
  //             strokeWidth="5"
  //             strokeLinecap="round"
  //             className="opacity-25"
  //           />
  //           {/* Low Zone Arc */}
  //           <path
  //             d={`M ${xStart} ${yStart} A ${r} ${r} 0 0 1 ${xMin} ${yMin}`}
  //             fill="none"
  //             stroke={lowColor}
  //             strokeWidth="5.5"
  //             strokeLinecap="round"
  //           />
  //           {/* Normal Zone Arc */}
  //           <path
  //             d={`M ${xMin} ${yMin} A ${r} ${r} 0 0 1 ${xMax} ${yMax}`}
  //             fill="none"
  //             stroke={normalColor}
  //             strokeWidth="5.5"
  //           />
  //           {/* High Zone Arc */}
  //           <path
  //             d={`M ${xMax} ${yMax} A ${r} ${r} 0 0 1 ${xEnd} ${yEnd}`}
  //             fill="none"
  //             stroke={highColor}
  //             strokeWidth="5.5"
  //             strokeLinecap="round"
  //           />

  //           {/* Glowing needle shadow filter */}
  //           <defs>
  //             <filter id="glow-needle" x="-20%" y="-20%" width="140%" height="140%">
  //               <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor={pointerColor} floodOpacity="0.5" />
  //             </filter>
  //           </defs>

  //           {/* Needle indicator */}
  //           <line
  //             x1={cx}
  //             y1={cy - 2}
  //             x2={needleX}
  //             y2={needleY}
  //             stroke={pointerColor}
  //             strokeWidth="2.5"
  //             strokeLinecap="round"
  //             filter="url(#glow-needle)"
  //             className="transition-all duration-500 ease-out"
  //           />

  //           {/* Center Cap pin */}
  //           <circle cx={cx} cy={cy} r="4.5" className="fill-background stroke-[#D4BDAD]/40" strokeWidth="1" />
  //           <circle cx={cx} cy={cy} r="2.5" fill={pointerColor} />
  //         </svg>
  //       </div>

  //       {/* Diagnostic Metadata details on the right */}
  //       <div className="flex-1 flex flex-col justify-center min-w-0">
  //         <div className="flex items-baseline gap-1">
  //           <span className="text-sm font-extrabold text-foreground tracking-tight">{val}</span>
  //           <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Actual</span>
  //         </div>

  //         <div className="flex flex-col gap-0.5 mt-1 border-l border-border/40 pl-2">
  //           <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-semibold">
  //             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
  //             <span>Optimal Ref: <span className="font-bold text-[#8a7a6a] dark:text-[#D4BDAD]">{min} - {max}</span></span>
  //           </div>
  //           <div className="text-[8px] text-muted-foreground font-medium truncate">
  //             Scale Range: {barMin.toFixed(1)} to {barMax.toFixed(1)}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

//   const renderRangeBar = (rawVal: any, rawMin: any, rawMax: any, status: string) => {
//   const val = Number(rawVal) || 0;
//   const min = Number(rawMin) || 0;
//   const max = Number(rawMax) || (val > 0 ? val * 1.5 : 100);

//   const lowColor    = '#f59e0b';
//   const normalColor = '#10b981';
//   const highColor   = '#ef4444';

//   const statusClean = (status || 'normal').toLowerCase();
//   const pointerColor =
//     statusClean === 'high' || statusClean === 'critical' ? highColor :
//     statusClean === 'low' ? lowColor : normalColor;

//   // Fixed zone boundaries — low: 0–20%, normal: 20–80%, high: 80–100%
//   const LOW_END    = 0.20;
//   const HIGH_START = 0.80;

//   // Needle position driven by STATUS, not raw value-to-scale math
//   let needlePos: number;
//   if (statusClean === 'low') {
//     const ratio = min > 0 ? Math.max(0, Math.min(1, val / min)) : 0.5;
//     needlePos = LOW_END * (0.1 + ratio * 0.8);
//   } else if (statusClean === 'high' || statusClean === 'critical') {
//     const excess = max > 0 ? Math.min((val - max) / max, 1) : 0.5;
//     needlePos = HIGH_START + (1 - HIGH_START) * (0.1 + excess * 0.8);
//   } else {
//     const safeMax = max > min ? max : min + 1;
//     const ratio = Math.max(0, Math.min(1, (val - min) / (safeMax - min)));
//     needlePos = LOW_END + ratio * (HIGH_START - LOW_END);
//   }

//   const r = 32, cx = 50, cy = 40;
//   const rad = (deg: number) => (deg * Math.PI) / 180;
//   const pt = (angle: number) => ({
//     x: cx + r * Math.cos(rad(angle)),
//     y: cy + r * Math.sin(rad(angle)),
//   });

//   const lowAngle    = 180 + LOW_END    * 180;
//   const highAngle   = 180 + HIGH_START * 180;
//   const valAngle    = 180 + needlePos  * 180;

//   const pStart     = pt(180);
//   const pLowEnd    = pt(lowAngle);
//   const pHighStart = pt(highAngle);
//   const pEnd       = pt(360);
//   const pNeedle    = {
//     x: cx + (r - 4) * Math.cos(rad(valAngle)),
//     y: cy + (r - 4) * Math.sin(rad(valAngle)),
//   };

//   const arc = (a: {x:number,y:number}, b: {x:number,y:number}) =>
//     `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;

//   return (
//     <div className="flex items-center gap-4 select-none">
//       <div className="relative w-28 h-16 shrink-0">
//         <svg className="w-full h-full" viewBox="0 0 100 50">
//           <path d={arc(pStart, pEnd)} fill="none" stroke="hsl(var(--secondary))" strokeWidth="5" strokeLinecap="round" className="opacity-25" />
//           <path d={arc(pStart, pLowEnd)}     fill="none" stroke={lowColor}    strokeWidth="5.5" strokeLinecap="round" />
//           <path d={arc(pLowEnd, pHighStart)} fill="none" stroke={normalColor} strokeWidth="5.5" />
//           <path d={arc(pHighStart, pEnd)}    fill="none" stroke={highColor}   strokeWidth="5.5" strokeLinecap="round" />
//           <defs>
//             <filter id="glow-needle" x="-20%" y="-20%" width="140%" height="140%">
//               <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor={pointerColor} floodOpacity="0.5" />
//             </filter>
//           </defs>
//           <line
//             x1={cx} y1={cy - 2}
//             x2={pNeedle.x.toFixed(2)} y2={pNeedle.y.toFixed(2)}
//             stroke={pointerColor} strokeWidth="2.5" strokeLinecap="round"
//             filter="url(#glow-needle)"
//             className="transition-all duration-500 ease-out"
//           />
//           <circle cx={cx} cy={cy} r="4.5" className="fill-background stroke-[#D4BDAD]/40" strokeWidth="1" />
//           <circle cx={cx} cy={cy} r="2.5" fill={pointerColor} />
//         </svg>
//       </div>
//       <div className="flex-1 flex flex-col justify-center min-w-0">
//         <div className="flex items-baseline gap-1">
//           <span className="text-sm font-extrabold text-foreground tracking-tight">{val}</span>
//           <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Actual</span>
//         </div>
//         <div className="flex flex-col gap-0.5 mt-1 border-l border-border/40 pl-2">
//           <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-semibold">
//             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
//             <span>Optimal Ref: <span className="font-bold text-[#8a7a6a] dark:text-[#D4BDAD]">{min} - {max}</span></span>
//           </div>
//           <div className="text-[8px] text-muted-foreground font-medium truncate">
//             Status: {statusClean.charAt(0).toUpperCase() + statusClean.slice(1)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

  const renderRangeBar = (rawVal: any, rawMin: any, rawMax: any, status: string, name?: string, gender?: string) => {
  const val = Number(rawVal) || 0;
  const { min, max } = resolveRange(name || '', rawMin, rawMax, rawVal, gender || 'male');

  const statusClean = (status || 'normal').toLowerCase();

  // Build scale with padding on each side
  const span = Math.max(max - min, 1);
  const scaleMin = Math.max(0, min - span * 0.35);
  const scaleMax = max + span * 0.35;
  const totalSpan = scaleMax - scaleMin || 1;

  // Zone boundaries as fractions [0..1] of the full bar width
  // Structure: [scaleMin ---- lowAmber -- green -- highAmber ---- scaleMax]
  const amberWidth = 0.06; // each amber transition = 6% of bar
  const lowRedEnd    = (min - scaleMin) / totalSpan;               // red ends, amber begins (left)
  const lowGreenEnd  = lowRedEnd + amberWidth;                     // amber ends, green begins
  const highGreenEnd = (max - scaleMin) / totalSpan;              // green ends, amber begins (right)
  const highRedStart = Math.min(1, highGreenEnd + amberWidth);    // amber ends, red begins (right)

  // Needle: status-driven position so it always lands in the correct zone
  let needlePct: number;
  if (statusClean === 'low') {
    // Place in left red zone, proportional to how far below min
    const ratio = min > 0 ? Math.max(0, Math.min(1, val / min)) : 0.5;
    needlePct = lowRedEnd * (0.1 + ratio * 0.75);
  } else if (statusClean === 'high' || statusClean === 'critical') {
    // Place in right red zone, proportional to how far above max
    const excess = max > 0 ? Math.min(1, (val - max) / Math.max(max * 0.5, 1)) : 0.5;
    needlePct = highRedStart + (1 - highRedStart) * (0.1 + excess * 0.8);
  } else {
    // Normal: place proportionally within the green zone
    const safeMax = max > min ? max : min + 1;
    const ratio = Math.max(0, Math.min(1, (val - min) / (safeMax - min)));
    needlePct = lowGreenEnd + ratio * (highGreenEnd - lowGreenEnd);
  }

  needlePct = Math.max(0.01, Math.min(0.99, needlePct));

  const pointerColor =
    statusClean === 'high' || statusClean === 'critical' ? '#ef4444' :
    statusClean === 'low' ? '#f59e0b' : '#10b981';

  // Tick labels: left edge, min, max, right edge
  const ticks = [
    { pct: 0,            label: Math.round(scaleMin).toString() },
    { pct: lowRedEnd,    label: min.toString() },
    { pct: highGreenEnd, label: max.toString() },
    { pct: 1,            label: Math.round(scaleMax).toString() },
  ];

  // De-duplicate ticks that are too close together
  const filteredTicks = ticks.filter((t, i, arr) =>
    arr.findIndex(o => Math.abs(o.pct - t.pct) < 0.08) === i
  );

  const W = 200; // SVG viewBox width

  // Zone widths in SVG units (non-overlapping, sum to W)
  const z = {
    leftRed:    Math.max(0, lowRedEnd * W),
    leftAmber:  Math.max(0, (lowGreenEnd - lowRedEnd) * W),
    green:      Math.max(0, (highGreenEnd - lowGreenEnd) * W),
    rightAmber: Math.max(0, (highRedStart - highGreenEnd) * W),
    rightRed:   Math.max(0, (1 - highRedStart) * W),
  };

  // X start positions
  const x = {
    leftRed:    0,
    leftAmber:  z.leftRed,
    green:      z.leftRed + z.leftAmber,
    rightAmber: z.leftRed + z.leftAmber + z.green,
    rightRed:   z.leftRed + z.leftAmber + z.green + z.rightAmber,
  };

  return (
    <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-0 w-full">
      {/* Value bubble + downward triangle pointer */}
      <div className="relative w-full" style={{ height: 30 }}>
        <div
          className="absolute flex flex-col items-center pointer-events-none"
          style={{ left: `${needlePct * 100}%`, transform: 'translateX(-50%)', top: 0 }}
        >
          <div
            className="px-2 py-0.5 rounded-md text-[10px] font-black text-white shadow-sm whitespace-nowrap"
            style={{ backgroundColor: pointerColor, lineHeight: '18px', minWidth: 28, textAlign: 'center' }}
          >
            {val}
          </div>
          <div style={{
            width: 0, height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `5px solid ${pointerColor}`,
          }} />
        </div>
      </div>

      {/* Colored bar */}
      <svg
        className="w-full rounded-full overflow-hidden"
        viewBox={`0 0 ${W} 7`}
        preserveAspectRatio="none"
        style={{ height: 8, display: 'block' }}
      >
        {/* Left red */}
        {z.leftRed > 0 && (
          <rect x={x.leftRed} y={0} width={z.leftRed} height={7} fill="#ef4444"
            rx={z.leftRed > 0 ? 3.5 : 0} />
        )}
        {/* Left amber */}
        {z.leftAmber > 0 && (
          <rect x={x.leftAmber} y={0} width={z.leftAmber} height={7} fill="#f59e0b" />
        )}
        {/* Green */}
        {z.green > 0 && (
          <rect x={x.green} y={0} width={z.green} height={7} fill="#10b981" />
        )}
        {/* Right amber */}
        {z.rightAmber > 0 && (
          <rect x={x.rightAmber} y={0} width={z.rightAmber} height={7} fill="#f59e0b" />
        )}
        {/* Right red */}
        {z.rightRed > 0 && (
          <rect x={x.rightRed} y={0} width={z.rightRed} height={7} fill="#ef4444"
            rx={z.rightRed > 0 ? 3.5 : 0} />
        )}
      </svg>

      {/* Tick labels */}
      <div className="relative w-full mt-1" style={{ height: 14 }}>
        {filteredTicks.map((tick, i) => (
          <span
            key={i}
            className="absolute text-[8px] font-semibold text-muted-foreground leading-none"
            style={{
              left: `${tick.pct * 100}%`,
              top: 0,
              transform:
                i === 0 ? 'none' :
                i === filteredTicks.length - 1 ? 'translateX(-100%)' :
                'translateX(-50%)',
              whiteSpace: 'nowrap',
            }}
          >
            {tick.label}
          </span>
        ))}
      </div>
    </div>
  );
};

  const narrativeSummary = report.interpretationSummary || report.summary ||
    "The data indicates two primary areas of observation. First, metabolic markers related to general physiological efficiency are balanced. Second, minor deviations in specific panels present opportunities for proactive optimization.";

  let observations = report.testOverviewObservations || [];
  if (observations.length === 0) {
    if (abnormal.length > 0) {
      const grouped: Record<string, Biomarker[]> = {};
      abnormal.forEach(b => {
        if (!grouped[b.category]) grouped[b.category] = [];
        grouped[b.category].push(b);
      });
      observations = Object.entries(grouped).map(([cat, markers]) => ({
        title: `${cat} Observations`,
        description: `Indicators like ${markers.map(m => m.name).join(', ')} show deviations from their canonical references. This suggests a pattern related to ${cat.toLowerCase()} cellular activity, which should be discussed with a provider.`
      }));
    } else {
      observations = [
        {
          title: "General Metabolic Status",
          description: "Comprehensive metabolic metrics demonstrate excellent systemic homeostasis. Liver, kidney, and cardiolipid profiles align tightly with standard reference norms."
        },
        {
          title: "Cardiovascular and Lipid Regulation",
          description: "Total and fractional lipid balances fall cleanly in optimal ranges, showing strong cardioprotective trends and efficient vascular clearance."
        }
      ];
    }
  }

  // 1. Possible Health Status (AI primary, fallback backup if unavailable)
  const defaultAbnormalHealth = [
    {
      title: "Metabolic Activity Context",
      description: "Elevations in biomarkers could relate to transient factors including high-intensity physical exertion, acute dietary shifts, hydration variance, or natural diurnal oscillations."
    },
    {
      title: "Micro-Nutrient Reserves",
      description: "General status suggests checking vitamin cofactors and hydration indexes to optimize cellular energy production and mitochondrial efficiency."
    }
  ];

  const defaultNormalHealth = [
    {
      title: "Physical Conditioning Alignment",
      description: "Current biomarker configuration suggests robust physiological resilience, reflecting excellent adherence to positive sleep, exercise, and nutritional habits."
    },
    {
      title: "Micronutrient Equilibrium",
      description: "Tissue mineral levels and hormonal axes demonstrate perfect functional symmetry, protecting cardiovascular and neuro-endocrine channels."
    }
  ];

  const healthStatus = report.possibleHealthStatus && report.possibleHealthStatus.length > 0
    ? report.possibleHealthStatus
    : (abnormal.length > 0 ? defaultAbnormalHealth : defaultNormalHealth);

  // 2. Pay Attention Checklist (AI primary, fallback backup if unavailable)
  const backupAbnormalChecklist = abnormal.map(b => ({
    title: `Review ${b.name}`,
    description: `Consult a primary provider to analyze why ${b.name} is ${b.status} (${b.value} ${b.unit}). Consider a follow-up panel in 4-6 weeks to determine trend vectors.`
  }));

  const backupNormalChecklist = [
    {
      title: "Proactive Screening",
      description: "Maintain current health protocols. Routine annual screening is sufficient to monitor systemic trends."
    }
  ];

  const attentionList = report.payAttention && report.payAttention.length > 0
    ? report.payAttention
    : (abnormal.length > 0 ? backupAbnormalChecklist : backupNormalChecklist);

  // 3. Clinical Panel Synthesis (AI primary, fallback backup if unavailable)
  const defaultPanelOverview = "Clinical evaluation combines lipid counts, glomerular filtration markers, liver aminotransferase concentrations, and cellular indices to evaluate absolute risk and metabolic integrity. Individual deviations represent functional variances requiring clinical context.";
  const panelOverviewText = report.panelOverview || defaultPanelOverview;

  // 4. Suggested Screenings (AI primary, fallback backup if unavailable)
  const defaultSuggested = [
    { name: "Cystatin C", reason: "For highly precise kidney filtration indexing if eGFR is borderline." },
    { name: "Apolipoprotein B (ApoB)", reason: "Provides a more complete atherogenic particle count than standard LDL-C." },
    { name: "Vitamin D (25-Hydroxy)", reason: "Crucial for bone health, immune signaling, and metabolic resilience." },
    { name: "Highly Sensitive CRP (hs-CRP)", reason: "Assesses systemic inflammatory status, crucial for cardiovascular risk stratification." }
  ];

  const suggestedBiomarkers = report.additionalBiomarkers && report.additionalBiomarkers.length > 0
    ? report.additionalBiomarkers
    : defaultSuggested;

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto px-1 lg:px-4">
      {/* 1. Header Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        {/* Left: Patient Profile */}
        <div className="bg-card rounded-3xl p-6 border border-[#D4BDAD]/25 shadow-sm flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#D4BDAD]/5 rounded-bl-full pointer-events-none" />
          <h3 className="text-xs font-black uppercase tracking-wider text-[#8a7a6a] dark:text-[#D4BDAD] border-b border-border/30 pb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-[#8a7a6a]" />
            Patient Profile
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Birth date</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5">{birthDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Gender</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5">{gender}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Weight</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5">{weight} {typeof weight === 'number' || !isNaN(Number(weight)) ? 'kg' : ''}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Height</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5">{height} {typeof height === 'number' || !isNaN(Number(height)) ? 'cm' : ''}</p>
            </div>
          </div>
        </div>

        {/* Right: Scan Info */}
        <div className="bg-card rounded-3xl p-6 border border-[#D4BDAD]/25 shadow-sm flex flex-col gap-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#D4BDAD]/5 rounded-bl-full pointer-events-none" />
          <h3 className="text-xs font-black uppercase tracking-wider text-[#8a7a6a] dark:text-[#D4BDAD] border-b border-border/30 pb-3 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-[#8a7a6a]" />
            Scan & Laboratory Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Test Date</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5">{scanDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Date Analyzed</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5">{dateAnalyzed}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Test Type</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5 truncate">{testType}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Lab Name</p>
              <p className="text-sm font-extrabold text-foreground mt-0.5 truncate">{labName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Metrics Health Balance Banner */}
      <div className="bg-gradient-to-r from-[#044E45] to-[#087366] text-white rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center gap-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Radial Progress Ring */}
        <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
          <svg className="h-full w-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="46"
              className="stroke-white/10"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r="46"
              className="stroke-[#D4BDAD] transition-all duration-1000 ease-out"
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - normalPct / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white">{normalPct}%</span>
            <span className="text-[8px] text-teal-200 font-bold uppercase tracking-wider">Optimal</span>
          </div>
        </div>

        {/* Textual Metrics */}
        <div className="flex-1 flex flex-col justify-center gap-3 text-center md:text-left">
          <h4 className="text-lg font-black text-white tracking-wide">Biomarker Health Balance</h4>
          <p className="text-xs text-teal-100/90 leading-relaxed max-w-xl">
            Your overall biomarker configuration is <span className="font-bold text-[#D4BDAD]">{normalPct}% in optimal range</span>.
            {abnormal.length > 0
              ? ` There are ${abnormal.length} markers requiring targeted attention and clinical discussion.`
              : " All parameters demonstrate excellent structural equilibrium."}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-2 max-w-lg w-full text-center">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm">
              <span className="text-2xl font-black block">{allBiomarkers.length}</span>
              <p className="text-[9px] text-teal-200/70 uppercase font-bold tracking-wider mt-1">Biomarkers</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-sm backdrop-blur-sm">
              <span className="text-2xl font-black text-amber-300 block">{abnormal.length}</span>
              <p className="text-[9px] text-amber-200/80 uppercase font-bold tracking-wider mt-1 font-semibold">Abnormal</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm backdrop-blur-sm">
              <span className="text-2xl font-black text-emerald-300 block">{normalCount}</span>
              <p className="text-[9px] text-emerald-200/80 uppercase font-bold tracking-wider mt-1 font-semibold">Optimal</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Test Overview Observations */}
      <div className="bg-card rounded-[28px] p-6 border border-[#D4BDAD] shadow-md relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="absolute top-6 left-0 w-1.5 h-[calc(100%-3rem)] bg-[#D4BDAD] rounded-r-full" />
        <div className="flex items-center gap-3 mb-6 pl-2">
          <div className="h-9 w-9 rounded-xl bg-[#D4BDAD]/20 flex items-center justify-center shrink-0 shadow-sm border border-[#D4BDAD]/30">
            <Sparkles className="h-5 w-5 text-[#8a7a6a]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Clinical Interpretation</h3>
            <p className="text-[10px] text-muted-foreground font-semibold">Replicated BloodGPT Clinical Interpretation</p>
          </div>
        </div>

        {/* Narrative Summary */}
        <div className="mb-6 px-5 py-4 rounded-2xl bg-[#D4BDAD]/5 border border-[#D4BDAD]/15 shadow-sm pl-6">
          <h4 className="text-xs font-black text-[#8a7a6a] uppercase tracking-wider mb-2">Primary Narrative Summary</h4>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed font-semibold">
            {narrativeSummary}
          </p>
        </div>

        {/* Dynamic Observations */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-[#8a7a6a] uppercase tracking-wider pl-2">Systemic Observations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {observations.map((obs, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-secondary/35 border border-border/30 hover:border-[#D4BDAD]/50 hover:bg-secondary/50 transition-all duration-300 shadow-sm relative group"
              >
                <div className="absolute top-4 left-0 w-1 h-8 bg-[#8a7a6a]/40 rounded-r-full group-hover:bg-[#8a7a6a] transition-all" />
                <h5 className="text-xs font-bold text-foreground mb-1.5 pl-2">{obs.title}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed pl-2">{obs.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Possible Health Status & Pay Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Possible Health Status */}
        <div className="bg-card rounded-[28px] p-6 border border-border/40 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 border border-green-500/20">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-sm font-extrabold text-foreground">Possible Health Status</h3>
          </div>
          <div className="space-y-4 flex-1">
            {healthStatus.map((status, i) => (
              <div key={i} className="p-4 rounded-2xl bg-secondary/25 border border-border/20 shadow-sm">
                <h4 className="text-xs font-bold text-foreground mb-1.5">{status.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{status.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pay Attention */}
        <div className="bg-rose-500/[0.02] rounded-[28px] p-6 border border-rose-500/20 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 animate-pulse border border-rose-500/20">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-foreground">Pay Attention</h3>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-wide mt-0.5">Critical review checklist</p>
            </div>
          </div>
          <div className="space-y-4 flex-1">
            {attentionList.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-rose-500/[0.04] border border-rose-500/10 relative shadow-sm">
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-rose-500 rounded-l-2xl" />
                <h4 className="text-xs font-bold text-foreground mb-1.5 pl-2">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed pl-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Panel Overview & Screenings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        {/* Panel Overview */}
        <div className="bg-card rounded-[28px] p-6 border border-border/40 shadow-sm md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <FlaskConical className="h-4.5 w-4.5 text-[#8a7a6a]" />
              <h3 className="text-sm font-bold text-foreground">Clinical Panel Synthesis</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line mb-4">
              {panelOverviewText}
            </p>
          </div>

          <div className="border-t border-[#D4BDAD]/20 pt-4 mt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#8a7a6a]" />
                <h4 className="text-xs font-black text-[#8a7a6a] uppercase tracking-wider">Related Research (PubMed)</h4>
              </div>
              {loadingPubmed && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin text-[#8a7a6a]" />
                  <span>Searching NCBI...</span>
                </div>
              )}
            </div>

            {loadingPubmed && pubmedArticles.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2].map((n) => (
                  <div key={n} className="p-3 rounded-2xl bg-secondary/10 border border-border/20 animate-pulse h-16 flex flex-col justify-between">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : pubmedArticles.length === 0 ? (
              <p className="text-[10px] text-muted-foreground italic pl-6">No related medical literature found for these biomarkers.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pubmedArticles.map((art) => (
                  <a 
                    key={art.pmid} 
                    href={art.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block p-3 rounded-2xl bg-[#D4BDAD]/5 border border-[#D4BDAD]/15 hover:border-[#8a7a6a]/60 hover:bg-[#D4BDAD]/10 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 h-full">
                      <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
                        <p 
                          className="text-xs font-black text-foreground group-hover:text-[#8a7a6a] transition-colors leading-snug line-clamp-2"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {art.title}
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-2 font-bold flex flex-wrap items-center gap-1">
                          <span className="truncate max-w-[80px]">{art.authors}</span>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                          <span className="truncate max-w-[90px] italic">{art.journal}</span>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                          <span>{art.pubDate.split(' ')[0]}</span>
                        </p>
                      </div>
                      <div className="h-6 w-6 rounded-lg bg-secondary/80 border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-secondary shrink-0 transition-all">
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Screenings */}
        <div className="bg-card rounded-[28px] p-6 border border-[#D4BDAD]/35 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-4.5 w-4.5 text-[#8a7a6a]" />
            <h3 className="text-sm font-bold text-foreground">Suggested Screenings</h3>
          </div>
          <div className="space-y-3">
            {suggestedBiomarkers.map((b, i) => (
              <div key={i} className="p-3 rounded-2xl bg-[#D4BDAD]/5 border border-[#D4BDAD]/15 shadow-sm">
                <p className="text-xs font-bold text-foreground">{b.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-snug font-medium">{b.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Biomarker Detailed Listing (BloodGPT Cards) */}
      <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Biomarker Breakdown</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Horizontal slider ranges & clinical explanations</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search biomarkers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary/40 border border-border/30 rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#D4BDAD] w-40 sm:w-48 transition-all"
              />
            </div>
            {/* Filter Toggle */}
            <div className="inline-flex p-0.5 rounded-xl bg-secondary/80 border border-border/30">
              <button
                onClick={() => setBiomarkerFilter('all')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                  biomarkerFilter === 'all'
                    ? "bg-[#D4BDAD] text-[#2d2217] dark:bg-[#D4BDAD]/20 dark:text-[#E8DDD5]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
              <button
                onClick={() => setBiomarkerFilter('flagged')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1",
                  biomarkerFilter === 'flagged'
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Flagged
                {abnormal.length > 0 && (
                  <span className="flex h-4 min-w-[16px] px-0.5 items-center justify-center rounded-full bg-rose-500 text-white text-[8px] font-bold">
                    {abnormal.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Switchable Panel Tabs */}
        {panelsWithFilteredBiomarkers.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-[28px] border border-border/20 shadow-sm animate-fade-in">
            <Info className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No biomarkers matching filters.</p>
          </div>
        ) : (
          <Tabs defaultValue={panelsWithFilteredBiomarkers[0].name} className="w-full">
            {/* Tab Trigger List */}
            <div className="overflow-x-auto scrollbar-hide w-full mb-4">
              <TabsList className="bg-secondary/60 border border-border/40 p-1 flex w-max gap-1">
                {panelsWithFilteredBiomarkers.map((panel) => {
                  const panelShortNames: Record<string, string> = {
                    'Complete Blood Count (CBC)': 'CBC',
                    'Comprehensive Metabolic Panel (CMP)': 'Metabolic (CMP)',
                    'Lipid Panel': 'Lipids',
                    'Thyroid Panel': 'Thyroid',
                    'Hormones': 'Hormones',
                    'Vitamins & Minerals': 'Vitamins',
                  };
                  const displayName = panelShortNames[panel.name] || panel.name.split('(')[0].trim();
                  
                  return (
                    <TabsTrigger
                      key={panel.name}
                      value={panel.name}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      {displayName}
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#D4BDAD]/15 text-[#8a7a6a] border border-[#D4BDAD]/25">
                        {panel.biomarkers.length}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Tab Contents */}
            {panelsWithFilteredBiomarkers.map((panel, panelIdx) => {
              const panelIconMap: Record<string, any> = {
                'Complete Blood Count (CBC)': Shield,
                'Comprehensive Metabolic Panel (CMP)': Droplets,
                'Lipid Panel': Heart,
                'Thyroid Panel': ThermometerSun,
                'Hormones': Brain,
                'Vitamins & Minerals': Zap,
              };
              const PanelIcon = panelIconMap[panel.name] || FlaskConical;

              return (
                <TabsContent
                  key={panel.name}
                  value={panel.name}
                  className="mt-0 focus-visible:outline-none"
                >
                  <div className="bg-card rounded-[24px] border border-border/40 overflow-hidden shadow-sm animate-fade-in-up">
                    {/* Panel Header */}
                    <div className="bg-secondary/20 px-6 py-4 border-b border-border/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#D4BDAD]/10 text-[#8a7a6a] flex items-center justify-center shrink-0 border border-[#D4BDAD]/20">
                          <PanelIcon className="h-4.5 w-4.5" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-foreground">{panel.name}</h4>
                      </div>
                      <span className="text-[10px] font-extrabold px-3 py-1 bg-background border border-border/30 rounded-xl text-muted-foreground shadow-sm">
                        {panel.biomarkers.length} {panel.biomarkers.length === 1 ? 'marker' : 'markers'}
                      </span>
                    </div>

                    {/* Biomarkers Table-like List */}
                    <div className="divide-y divide-border/25">
                      {panel.biomarkers.map((b, i) => {
                        const isExpanded = expandedBiomarker === b.name;
                        const isAbnormal = b.status !== 'normal';

                        const statusColors = {
                          normal: 'bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] border-emerald-500/20',
                          high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
                          low: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                          critical: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 animate-pulse',
                          unknown: 'bg-muted/10 text-muted-foreground border-border/20',
                        };

                        const markerStripeColors = {
                          normal: 'bg-emerald-500',
                          high: 'bg-rose-500',
                          low: 'bg-amber-500',
                          critical: 'bg-rose-700 animate-pulse',
                          unknown: 'bg-muted',
                        };

                        const stripeColor = markerStripeColors[b.status] || markerStripeColors.normal;
                        const valueText = `${b.value} ${b.unit}`;

                        return (
                          <div
                            key={b.name}
                            className={cn(
                              "relative overflow-hidden transition-colors duration-150 pl-6",
                              isExpanded ? "bg-secondary/10" : "hover:bg-secondary/5"
                            )}
                          >
                            {/* Status stripe on left */}
                            <div className={cn("absolute left-0 top-0 bottom-0 w-1", stripeColor)} />

                            <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pl-4 sm:pl-6">
                              {/* 1. Name & Status Badge */}
                              <div className="flex items-center gap-3 min-w-[200px] lg:max-w-xs">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs sm:text-sm font-black text-foreground leading-snug">{b.name}</span>
                                    <span className={cn(
                                      "px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider leading-none",
                                      statusColors[b.status] || statusColors.normal
                                    )}>
                                      {b.status}
                                    </span>
                                  </div>
                                  {b.description && b.description !== b.name && (
                                    <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 block">{b.description}</span>
                                  )}
                                </div>
                              </div>

                              {/* 2. Slider Range */}
                              <div className="flex-1 min-w-[200px] lg:max-w-md">
                                {renderRangeBar(b.value, b.min, b.max, b.status, b.name, gender)}
                              </div>

                              {/* 3. Actions */}
                              <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 border-t border-border/10 lg:border-none pt-3 lg:pt-0">
                                <div className="text-right hidden sm:block">
                                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-wide">Value</p>
                                  <p className="text-xs sm:text-sm font-black text-foreground mt-0.5">{valueText}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedMarker(b)}
                                    className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-[#D4BDAD]/20 hover:text-[#8a7a6a] text-[10px] sm:text-xs font-bold text-foreground transition-all flex items-center gap-1"
                                  >
                                    <Info className="h-3 w-3" />
                                    Details
                                  </button>
                                  <button
                                    onClick={() => setExpandedBiomarker(isExpanded ? null : b.name)}
                                    className={cn(
                                      "px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border",
                                      isExpanded
                                        ? "bg-[#D4BDAD] text-[#2d2217] border-[#D4BDAD]/40"
                                        : "bg-secondary/40 text-muted-foreground hover:text-foreground border-border/30"
                                    )}
                                  >
                                    {isExpanded ? 'Less' : 'Explain'}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Expanded Explanation Section */}
                            {isExpanded && (
                              <div className="px-5 pb-5 pt-1 border-t border-border/10 bg-secondary/15 animate-fade-in pl-10">
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-2xl bg-card border border-border/20 shadow-sm">
                                    <h5 className="text-[10px] font-black uppercase text-foreground mb-1.5 flex items-center gap-1.5">
                                      <Sparkles className="h-3.5 w-3.5 text-[#8a7a6a]" />
                                      Clinical Interpretation
                                    </h5>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                      {b.insight || b.clinicalInterpretation || `The analyzed marker is ${b.status}. Deviations can be associated with physiological shifts, diet, or training loads.`}
                                    </p>
                                  </div>
                                  <div className="p-4 rounded-2xl bg-card border border-border/20 shadow-sm">
                                    <h5 className="text-[10px] font-black uppercase text-foreground mb-1.5 flex items-center gap-1.5">
                                      <Lightbulb className="h-3.5 w-3.5 text-[#8a7a6a]" />
                                      Physiological Rationale
                                    </h5>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                      {b.detailedAnalysis || `This marker helps evaluate standard metabolic operations. Consult with your care provider to align this specific score with wider physical profiles.`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </div>
  );
}


export default function Index() {
  const { user, signOut } = useAuth();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<Biomarker | null>(null);
  const [currentView, setCurrentView] = useState<'analytics' | 'clinical'>('analytics');

  const handleFile = async (file: File) => {
    const isFirstReport = reports.length === 0;
    
    if (isFirstReport) {
      setLoading(true);
    } else {
      setIsComparing(true);
      toast.info(`Analyzing ${file.name}...`, {
        description: "Extracting biomarkers in the background.",
      });
    }
    
    setError('');
    setFileName(file.name);
    try {
      const result = await parseLabReport(file);
      setReports(prev => [...prev, result]);
      
      if (!isFirstReport) {
        toast.success("Analysis complete!", {
          description: "Second report added. Trends are now updated.",
          action: {
            label: "View Trends",
            onClick: () => setActiveTab('trends'),
          },
        });
        setActiveTab('trends');
      }
    } catch (e: any) {
      const msg = e.message || 'Failed to analyze the lab report. Please try again.';
      if (isFirstReport) {
        setError(msg);
      } else {
        toast.error("Analysis failed", { description: msg });
      }
    } finally {
      setLoading(false);
      setIsComparing(false);
    }
  };

  const handleReset = () => {
    setReports([]);
    setError('');
    setFileName('');
  };

  const currentReport = reports.length > 0 ? reports[reports.length - 1] : null;
  const allBiomarkers = currentReport?.panels.flatMap((p) => p.biomarkers) ?? [];
  const abnormal = allBiomarkers.filter((b) => b.status !== 'normal');
  const normalCount = allBiomarkers.filter((b) => b.status === 'normal').length;
  const normalPct = allBiomarkers.length ? Math.round((normalCount / allBiomarkers.length) * 100) : 0;

  // New calculated metrics for visual charts and dashboard
  const totalCount = allBiomarkers.length;
  const highCount = allBiomarkers.filter(b => b.status === 'high').length;
  const lowCount = allBiomarkers.filter(b => b.status === 'low').length;
  const criticalCount = allBiomarkers.filter(b => b.status === 'critical').length;
  const flaggedCount = highCount + lowCount + criticalCount;
  const scoreColor = normalPct >= 80 ? '#10b981' : normalPct >= 60 ? '#f59e0b' : '#ef4444';

  const sparkData = useMemo(() => {
    if (reports.length > 1) {
      const healthHistory = reports.map(r => {
        const markers = r.panels.flatMap(p => p.biomarkers);
        const normal = markers.filter(b => b.status === 'normal').length;
        return markers.length ? Math.round((normal / markers.length) * 100) : 0;
      });
      const flaggedHistory = reports.map(r => {
        const markers = r.panels.flatMap(p => p.biomarkers);
        return markers.filter(b => b.status !== 'normal').length;
      });
      const markersHistory = reports.map(r => r.panels.flatMap(p => p.biomarkers).length);
      return {
        health: healthHistory,
        flagged: flaggedHistory,
        markers: markersHistory
      };
    } else {
      return {
        health: [55, 62, 60, 68, 72, normalPct >= 70 ? normalPct - 4 : normalPct + 4, normalPct],
        flagged: [12, 18, 16, 22, 19, 17, Math.max(1, flaggedCount)],
        markers: [
          Math.max(1, totalCount - 6 || 1), Math.max(1, totalCount - 4 || 2), Math.max(1, totalCount - 3 || 3),
          Math.max(1, totalCount - 2 || 4), Math.max(1, totalCount - 1 || 5), totalCount || 6, totalCount || 6
        ]
      };
    }
  }, [reports, normalPct, flaggedCount, totalCount]);

  const systemsData = useMemo(() => {
    if (!currentReport) return [];
    const panelMapping: Record<string, string> = {
      'Complete Blood Count (CBC)': 'Blood',
      'Comprehensive Metabolic Panel (CMP)': 'Metabolic',
      'Lipid Panel': 'Heart',
      'Thyroid Panel': 'Thyroid',
      'Hormones': 'Hormones',
      'Vitamins & Minerals': 'Nutrients',
    };
    return currentReport.panels
      .filter(p => p.biomarkers.length > 0)
      .map(p => {
        const n = p.biomarkers.filter(b => b.status === 'normal').length;
        const score = p.biomarkers.length ? Math.round((n / p.biomarkers.length) * 100) : 0;
        return {
          system: panelMapping[p.name] || p.name.split('(')[0].trim().split(' ')[0],
          score: score,
          fullName: p.name
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [currentReport]);

  const avgPanelScore = useMemo(() => {
    return systemsData.length ? Math.round(systemsData.reduce((acc, s) => acc + s.score, 0) / systemsData.length) : 0;
  }, [systemsData]);

  const categoryData = useMemo(() => {
    if (!currentReport) return [];
    const CATEGORY_COLORS: Record<string, string> = {
      'Complete Blood Count (CBC)': '#0DA58E',
      'Comprehensive Metabolic Panel (CMP)': '#06b6d4',
      'Lipid Panel': '#f59e0b',
      'Thyroid Panel': '#ec4899',
      'Hormones': '#8b5cf6',
      'Vitamins & Minerals': '#34d399',
    };
    const DEFAULT_COLORS = ['#0DA58E', '#06b6d4', '#3b82f6', '#34d399', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'];
    return currentReport.panels
      .filter(p => p.biomarkers.length > 0)
      .map((p, idx) => ({
        name: p.name.replace('Panel', '').trim(),
        count: p.biomarkers.length,
        color: CATEGORY_COLORS[p.name] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      }));
  }, [currentReport]);

  const categoryTotal = useMemo(() => {
    return categoryData.reduce((acc, curr) => acc + curr.count, 0);
  }, [categoryData]);

  const flaggedBiomarkers = useMemo(() => {
    return allBiomarkers.filter(b => b.status !== 'normal').slice(0, 4);
  }, [allBiomarkers]);

  const topFlagged = flaggedBiomarkers[0];

  const buildSparklinePath = (values: number[], width = 150, height = 30, pad = 2) => {
    if (!values.length) return '';
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const step = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;
    return values.map((v, i) => {
      const x = pad + i * step;
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  };

  /* ─── UPLOAD SCREEN ─── */
  if (reports.length === 0 && !loading && !error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 opacity-0 pointer-events-none">
              {/* Logos removed from main page header as requested */}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-6 py-16 animate-fade-in-up">
          <div className="text-center mb-12">
            <div className="flex flex-col items-center mb-10 animate-fade-in text-center">
              <img 
                src={logo} 
                alt="Your Concierge MD" 
                className="h-36 w-auto object-contain drop-shadow-sm" 
              />
            </div>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Upload your bloodwork PDF and get a clean, personalized report with charts,
              reference ranges, and AI-generated insights — in seconds.
            </p>
          </div>

          <UploadZone onFile={handleFile} loading={false} />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: FileText, title: 'All Panels', desc: 'CMP, CBC, Lipids, Thyroid & more', color: 'text-primary' },
              { icon: Activity, title: 'Visual Ranges', desc: 'See exactly where each value falls', color: 'text-status-normal' },
              { icon: Lightbulb, title: 'AI Insights', desc: 'Plain-language explanations', color: 'text-[#8a7a6a]' },
            ].map((f, i) => (
              <div key={f.title} className="glass-card rounded-xl p-4 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1 + 0.2}s` }}>
                <div className={cn('mx-auto h-8 w-8 rounded-lg flex items-center justify-center mb-2.5 bg-secondary', f.color)}>
                  <f.icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold text-foreground">{f.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  /* ─── LOADING SCREEN ─── */
  if (loading) {
    const steps = [
      { label: 'Extracting biomarkers', icon: FileText },
      { label: 'Calculating ranges', icon: Activity },
      { label: 'Generating insights', icon: Sparkles },
    ];
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-[#D4BDAD]/10 flex items-center justify-center animate-pulse-glow">
            <div className="h-16 w-16 rounded-full bg-[#D4BDAD]/20 flex items-center justify-center">
              <FlaskConical className="h-8 w-8 text-[#D4BDAD] animate-float" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full border border-[#D4BDAD]/20 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="text-center animate-fade-in">
          <h2 className="text-xl font-bold text-foreground">Analyzing Your Lab Results</h2>
          <p className="text-muted-foreground mt-1 text-sm">{fileName}</p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass-card animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="h-7 w-7 rounded-lg bg-[#D4BDAD]/15 flex items-center justify-center shrink-0">
                <step.icon className="h-3.5 w-3.5 text-[#D4BDAD]" />
              </div>
              <span className="text-xs text-muted-foreground">{step.label}…</span>
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4BDAD] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── ERROR SCREEN ─── */
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 animate-scale-in">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Analysis Failed</h2>
        <p className="text-sm text-muted-foreground text-center max-w-sm">{error}</p>
        <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium transition-colors">
          <RotateCcw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  /* ─── REPORT DASHBOARD ─── */

  return (
    <div className="min-h-screen bg-background">
      <BiomarkerDetailDialog 
        marker={selectedMarker}
        onOpenChange={(open) => !open && setSelectedMarker(null)}
      />
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <img src={logo} alt="YC Logo" className="h-12 sm:h-16 w-auto object-contain" />
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => signOut()}
                className="flex items-center justify-center h-8 w-8 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground transition-all shrink-0"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full pb-2 md:pb-0 justify-start w-full md:w-auto">
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all shrink-0"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
            {reports.length > 0 && (
              <>
                <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all shrink-0">
                  <RotateCcw className="h-3.5 w-3.5" /> Clear All
                </button>
                <label className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer shrink-0",
                  isComparing 
                    ? "bg-secondary text-muted-foreground border-border animate-pulse" 
                    : "bg-[#D4BDAD]/15 text-[#8a7a6a] hover:bg-[#D4BDAD]/25 border-[#D4BDAD]/20"
                )}>
                  {isComparing ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" /> Compare Report
                    </>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.jpeg,.jpg,.png" 
                    disabled={isComparing}
                    onChange={(e) => { 
                      const file = e.target.files?.[0]; 
                      if(file){handleFile(file); e.target.value='';} 
                    }} 
                  />
                </label>
              </>
            )}
            {currentReport && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#D4BDAD]/15 text-[#8a7a6a] hover:bg-[#D4BDAD]/25 transition-all border border-[#D4BDAD]/20 shrink-0">
                      <Terminal className="h-3.5 w-3.5" /> API Logs
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-background/95 backdrop-blur-xl border-border/50">
                    <DialogHeader className="pb-4 border-b border-border/40 shrink-0">
                      <DialogTitle className="flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-accent" />
                        Raw API Processing Logs
                      </DialogTitle>
                      <p className="text-[11px] text-muted-foreground">Showing the raw JSON payload returned from the active API endpoint.</p>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-4 bg-muted/30 rounded-lg mt-4 custom-scrollbar">
                      <pre className="text-[10px] sm:text-xs text-foreground/80 font-mono whitespace-pre-wrap">
                        {currentReport.rawApiResponse ? JSON.stringify(currentReport.rawApiResponse, null, 2) : 'No API response captured (mock mode?).'}
                      </pre>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="shrink-0">
                  <ExportButton report={currentReport} />
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 animate-fade-in">
        {/* Patient banner */}
        {currentReport && (
          <div className="mb-6 glass-card rounded-2xl p-5 flex flex-wrap gap-6 items-center animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl overflow-hidden border border-border/40 flex items-center justify-center shrink-0 shadow-sm bg-white">
                <img 
                  src={iconLogo} 
                  alt="YC" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{currentReport.patientName || user?.user_metadata?.full_name || user?.user_metadata?.username || 'Patient Report'}</p>
                <p className="text-xs text-muted-foreground">
                  {[
                    currentReport.patientAge && `${currentReport.patientAge}y`,
                    currentReport.patientGender,
                    currentReport.labDate || currentReport.collectionDate,
                    currentReport.orderedBy ? `Dr. ${currentReport.orderedBy}` : null,
                  ].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-border/50 hidden sm:block" />

            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Total Markers', value: allBiomarkers.length, color: 'text-primary' },
                { label: 'Normal', value: normalCount, color: 'text-status-normal' },
                { label: 'Flagged', value: abnormal.length, color: abnormal.length > 0 ? 'text-status-high' : 'text-muted-foreground' },
                { label: 'Panels', value: currentReport.panels.length, color: 'text-accent' },
              ].map((stat) => (
                <div key={stat.label} className="px-4 py-2 rounded-xl bg-[#D4BDAD]/10 border border-[#D4BDAD]/20 text-center min-w-[72px] shadow-sm">
                  <p className={cn('text-xl font-bold', stat.color)}>{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Middle logo to fill space - Expanded as requested */}
            <div className="hidden lg:flex flex-[2] items-center justify-center px-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="h-24 w-full max-w-[400px] flex items-center justify-center rounded-3xl bg-[#D4BDAD]/5 border border-[#D4BDAD]/10 px-12 py-4 shadow-sm backdrop-blur-sm relative group transition-all duration-300 hover:bg-[#D4BDAD]/10">
                <img 
                  src={letterformLogo} 
                  alt="YC Letterform" 
                  className="h-20 w-auto opacity-100 contrast-125 drop-shadow-md z-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Health Score</p>
                <p className={cn('text-2xl font-bold', normalPct >= 80 ? 'text-status-normal' : normalPct >= 60 ? 'text-status-low' : 'text-status-high')}>
                  {normalPct}%
                </p>
              </div>
              <div className={cn('h-10 w-10 rounded-full flex items-center justify-center', normalPct >= 80 ? 'bg-status-normal/15' : normalPct >= 60 ? 'bg-status-low/15' : 'bg-status-high/15')}>
                {normalPct >= 80 ? <CheckCircle className="h-5 w-5 text-status-normal" /> : <AlertTriangle className="h-5 w-5 text-status-high" />}
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN WORKSPACE LAYOUT ── */}
        {currentReport && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <div className="overflow-x-auto scrollbar-hide w-full">
              <TabsList className="bg-secondary/80 border border-border/40 flex-nowrap min-w-max">
                <TabsTrigger value="current" className="data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap">Current Report</TabsTrigger>
                <TabsTrigger value="trends" className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                  <TrendingUp className="h-4 w-4" /> Trends
                </TabsTrigger>
                <TabsTrigger value="ai-chat" className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-1.5 data-[state=active]:text-[#8a7a6a] text-[#8a7a6a]/70 transition-colors uppercase text-[10px] font-bold tracking-widest whitespace-nowrap">
                  <Sparkles className="h-3 w-3" /> Personalized Medical Care
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="trends" className="mt-0 animate-fade-in box-border">
             <TrendAnalysisChart reports={reports} />
          </TabsContent>

          <TabsContent value="ai-chat" className="mt-0 animate-fade-in box-border">
             <AIChat reports={reports} />
          </TabsContent>

          <TabsContent value="current" className="mt-0">
            {/* Dual-View Toggle Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="inline-flex p-1 rounded-xl bg-secondary/80 border border-border/40 shadow-inner">
                <button
                  onClick={() => setCurrentView('clinical')}
                  className={cn(
                    "flex items-center gap-2 py-1.5 px-4 rounded-lg text-xs font-semibold transition-all duration-200",
                    currentView === 'clinical'
                      ? "bg-[#D4BDAD] text-[#2d2217] dark:bg-[#D4BDAD]/20 dark:text-[#E8DDD5] font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Clinical Report
                </button>
                <button
                  onClick={() => setCurrentView('analytics')}
                  className={cn(
                    "flex items-center gap-2 py-1.5 px-4 rounded-lg text-xs font-semibold transition-all duration-200",
                    currentView === 'analytics'
                      ? "bg-[#D4BDAD] text-[#2d2217] dark:bg-[#D4BDAD]/20 dark:text-[#E8DDD5] font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Activity className="h-3.5 w-3.5" />
                  Analytics Dashboard
                </button>
              </div>
            </div>

            {currentView === 'analytics' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
                
                {/* 1. LEFT MAIN AREA (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  
                  {/* Dashboard Visual Header */}
                  <div className="flex justify-between items-center bg-card p-5 rounded-3xl border border-border/40 shadow-sm">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Bloodwork Analysis</h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {currentReport.labDate || currentReport.collectionDate || "No Collection Date"}
                      </p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shadow-sm">
                      <Search size={16} />
                    </div>
                  </div>

                  {/* Tri-card metrics with sparklines */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Health Score Card */}
                    <div className="bg-card rounded-3xl p-5 shadow-sm border border-border/40 flex flex-col justify-between relative overflow-hidden h-[170px]">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-green-500/10 text-green-500">
                              <Heart size={14} />
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">Health Score</span>
                          </div>
                          <div className={cn("flex items-center gap-0.5 text-[10px] font-bold text-green-500")}>
                            <ArrowUp size={10} />
                            <span>{Math.max(1, Math.round(normalPct / 20))}%</span>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-foreground">{normalPct}</span>
                          <span className="text-xs text-muted-foreground">/100</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Overall</span>
                      </div>

                      {/* Sparkline */}
                      <div className="w-full h-8 lg:h-6 mt-2 max-w-[150px]">
                        <svg className="w-full h-full" viewBox="0 0 150 30" preserveAspectRatio="none">
                          <polyline
                            points={buildSparklinePath(sparkData.health)}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Total Biomarkers Card */}
                    <div className="bg-card rounded-3xl p-5 shadow-sm border border-border/40 flex flex-col justify-between relative overflow-hidden h-[170px]">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                              <Activity size={14} />
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">Biomarkers</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-[10px] font-bold text-blue-500">
                            <ArrowUp size={10} />
                            <span>{currentReport.panels.length}</span>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-foreground">{totalCount}</span>
                          <span className="text-xs text-muted-foreground">/{currentReport.panels.length} panels</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Tested</span>
                      </div>

                      {/* Sparkline */}
                      <div className="w-full h-8 lg:h-6 mt-2 max-w-[150px]">
                        <svg className="w-full h-full" viewBox="0 0 150 30" preserveAspectRatio="none">
                          <polyline
                            points={buildSparklinePath(sparkData.markers)}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Flagged Markers Card */}
                    <div className="bg-card rounded-3xl p-5 shadow-sm border border-border/40 flex flex-col justify-between relative overflow-hidden h-[170px]">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                              <AlertCircle size={14} />
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">Flagged</span>
                          </div>
                          <div className={cn("flex items-center gap-0.5 text-[10px] font-bold", flaggedCount > 0 ? "text-amber-500" : "text-green-500")}>
                            {flaggedCount > 0 ? <ArrowDown size={10} /> : <ArrowUp size={10} />}
                            <span>{totalCount ? Math.round((flaggedCount / totalCount) * 100) : 0}%</span>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-foreground">{flaggedCount}</span>
                          <span className="text-xs text-muted-foreground">/{totalCount}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Needs Review</span>
                      </div>

                      {/* Sparkline */}
                      <div className="w-full h-8 lg:h-6 mt-2 max-w-[150px]">
                        <svg className="w-full h-full" viewBox="0 0 150 30" preserveAspectRatio="none">
                          <polyline
                            points={buildSparklinePath(sparkData.flagged)}
                            fill="none"
                            stroke={flaggedCount > 0 ? "#f59e0b" : "#10b981"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Report Condition */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Report Condition Area Graph */}
                    <div className="md:col-span-12 bg-card rounded-[28px] p-6 shadow-sm border border-border/40">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-foreground">Report Condition</h3>
                      </div>

                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold mb-1">Average Panel Score</p>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-foreground">{avgPanelScore}%</span>
                            <span className="bg-emerald-500/15 text-emerald-600 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                              ▲ {Math.max(1, Math.round(avgPanelScore / 25))}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-secondary/40 px-2.5 py-1 rounded-lg border border-border/30">
                          <span>This Report</span>
                        </div>
                      </div>

                      {/* Area chart */}
                      <div className="relative h-32 lg:h-[140px] mt-6 w-full">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-muted-foreground/40 font-mono">
                          <div className="border-b border-dashed border-border/30 w-full pb-1 text-right">100</div>
                          <div className="border-b border-dashed border-border/30 w-full pb-1 text-right">50</div>
                          <div className="w-full text-right">0</div>
                        </div>

                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="dashboard-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {(() => {
                            if (systemsData.length === 0) return null;
                            const step = systemsData.length > 1 ? 400 / (systemsData.length - 1) : 0;
                            const points = systemsData.map((s, i) => ({
                              x: i * step,
                              y: 120 - (s.score / 100) * 110,
                            }));
                            const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y.toFixed(2)}`).join(' ');
                            const areaPath = `${linePath} L${points[points.length - 1].x},120 L0,120 Z`;
                            return (
                              <>
                                <path d={areaPath} fill="url(#dashboard-area-grad)" />
                                <path d={linePath} fill="none" stroke="#a7f3d0" strokeWidth="3" />
                                <path d={linePath} fill="none" stroke="#065f46" strokeWidth="2" />
                                {points.map((p, i) => (
                                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke="#065f46" strokeWidth="1.5" />
                                ))}
                              </>
                            );
                          })()}
                        </svg>

                        {/* Floating badge */}
                        {systemsData.length > 0 && (
                          <div className="absolute top-0 right-[20%] bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                            {avgPanelScore}%
                          </div>
                        )}
                      </div>

                      {/* X-axis labels */}
                      <div className="flex justify-between text-[9px] font-semibold text-muted-foreground mt-2 px-1">
                        {systemsData.slice(0, 4).map((s, i, arr) => (
                          <span key={s.system} className={i === Math.floor(arr.length / 2) ? 'text-foreground font-bold' : ''}>
                            {s.system}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Body System Status */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Body System Status */}
                    <div className="md:col-span-12 bg-card rounded-[28px] p-6 shadow-sm border border-border/40">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-foreground">Body System Status</h3>
                        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Score by panel</span>
                      </div>
                      <div className="space-y-3">
                        {systemsData.slice(0, 5).map(item => {
                          const totalSegments = 8;
                          const filled = Math.round((item.score / 100) * totalSegments);
                          const color = item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#ef4444';
                          return (
                            <div key={item.system}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{item.system}</span>
                                <span className="text-[11px] font-bold" style={{ color }}>{item.score}%</span>
                              </div>
                              <div className="flex gap-1 h-1.5">
                                {[...Array(totalSegments)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 rounded-sm"
                                    style={{ backgroundColor: i < filled ? color : 'hsl(var(--secondary))' }}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. RIGHT SIDE PROFILE COLUMN (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  {/* Patient profile header */}
                  <div className="bg-card rounded-[28px] p-6 shadow-sm border border-border/40 text-center relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 text-emerald-800/10 pointer-events-none text-4xl">
                      🌾
                    </div>
                    <div className="inline-block relative mb-3">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4BDAD]/40 to-[#8a7a6a]/20 border-4 border-secondary shadow-sm flex items-center justify-center text-2xl font-bold text-[#8a7a6a] mx-auto">
                        {(currentReport.patientName || user?.user_metadata?.full_name || 'P').trim().charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h4 className="font-bold text-base text-foreground truncate">{currentReport.patientName || user?.user_metadata?.full_name || user?.user_metadata?.username || 'Patient Report'}</h4>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      {[
                        currentReport.patientAge && `${currentReport.patientAge} yrs`,
                        currentReport.patientGender,
                        currentReport.orderedBy && `Dr. ${currentReport.orderedBy}`
                      ].filter(Boolean).join(' · ') || 'Patient Profile'}
                    </p>
                  </div>

                  {/* Status Summary Chart (detailed radial chart + findings list) */}
                  <div className="bg-card rounded-[28px] p-6 shadow-sm border border-border/40 flex-1 flex flex-col">
                    <StatusSummaryChart biomarkers={allBiomarkers} />
                  </div>

                </div>

                {/* 3. Biomarker Category Normalized Profile Chart (Below all cards, full-width) */}
                <div className="lg:col-span-12 mt-2">
                  <BiomarkerProfileChart biomarkers={allBiomarkers} gender={currentReport.patientGender || 'male'} />
                </div>

              </div>
            ) : (
              <BloodGPTReportLayout
                report={currentReport}
                allBiomarkers={allBiomarkers}
                abnormal={abnormal}
                normalCount={normalCount}
                normalPct={normalPct}
                setSelectedMarker={setSelectedMarker}
              />
            )}
          </TabsContent>
        </Tabs>
        )}

      </main>
      <footer className="pb-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest">
          Powered by Huumanize
        </p>
      </footer>
    </div>
  );
}
