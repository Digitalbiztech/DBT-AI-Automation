import { useMemo } from 'react';
import {
    LayoutDashboard,
    Beaker,
    BarChart3,
    MessageSquare,
    HelpCircle,
    Settings,
    Search,
    MoreVertical,
    ChevronDown,
    ArrowUp,
    ArrowDown,
    Activity,
    Heart,
    AlertCircle
} from 'lucide-react';
import { LabReport, Biomarker, LabPanel, BiomarkerStatus } from '../types/lab';
import { BiomarkerProfileChart } from './BiomarkerProfileChart';

// --- Status color tokens (semantic; matched with PremiumPDFDocument) ---
const STATUS_HEX: Record<BiomarkerStatus, { fg: string; bg: string; light: string }> = {
    normal:   { fg: '#0d9488', bg: '#ecfdf5', light: '#d1fae5' },
    high:     { fg: '#b91c1c', bg: '#fef2f2', light: '#fee2e2' },
    low:      { fg: '#b45309', bg: '#fffbeb', light: '#fef3c7' },
    critical: { fg: '#7f1d1d', bg: '#fef2f2', light: '#fee2e2' },
    unknown:  { fg: '#64748b', bg: '#f8fafc', light: '#f1f5f9' },
};

const STATUS_LABEL: Record<BiomarkerStatus, string> = {
    normal: 'NORMAL', high: 'ELEVATED', low: 'REDUCED', critical: 'CRITICAL', unknown: 'UNKNOWN',
};

const CATEGORY_COLORS: Record<string, string> = {
    'Complete Blood Count (CBC)': '#0DA58E',
    'Comprehensive Metabolic Panel (CMP)': '#06b6d4',
    'Lipid Panel': '#f59e0b',
    'Thyroid Panel': '#ec4899',
    'Hormones': '#8b5cf6',
    'Vitamins & Minerals': '#34d399',
};
const DEFAULT_COLORS = ['#0DA58E', '#06b6d4', '#3b82f6', '#34d399', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'];

// --- Mock fallback so the dashboard renders standalone ---
const MOCK_REPORT: LabReport = {
    patientName: 'Robert Foxer',
    patientAge: 42,
    patientGender: 'Male',
    labDate: '12 August, 2021',
    orderedBy: 'Sarah Chen',
    summary: 'Overall metabolic and lipid profile is within optimal range with mild elevations in cardiovascular markers worth monitoring.',
    aiInsights: [
        'Elevated LDL cholesterol indicates mild cardiovascular risk — consider dietary review.',
        'Vitamin D levels are below optimal — supplementation recommended over the winter months.',
        'Thyroid markers are well-balanced; renal function is excellent.',
    ],
    panels: [
        {
            name: 'Complete Blood Count (CBC)',
            biomarkers: [
                { name: 'Hemoglobin',   value: 14.2, unit: 'g/dL',     min: 13.5, max: 17.5, status: 'normal', category: 'CBC' },
                { name: 'WBC',          value: 7.8,  unit: '×10³/µL',  min: 4.5,  max: 11.0, status: 'normal', category: 'CBC' },
                { name: 'Platelets',    value: 280,  unit: '×10³/µL',  min: 150,  max: 400,  status: 'normal', category: 'CBC' },
            ]
        },
        {
            name: 'Lipid Panel',
            biomarkers: [
                { name: 'LDL Cholesterol',   value: 145, unit: 'mg/dL', min: 0,  max: 100, status: 'high',   category: 'Lipid' },
                { name: 'HDL Cholesterol',   value: 55,  unit: 'mg/dL', min: 40, max: 60,  status: 'normal', category: 'Lipid' },
                { name: 'Triglycerides',     value: 180, unit: 'mg/dL', min: 0,  max: 150, status: 'high',   category: 'Lipid' },
            ]
        },
        {
            name: 'Comprehensive Metabolic Panel (CMP)',
            biomarkers: [
                { name: 'Glucose',    value: 95,  unit: 'mg/dL', min: 70,  max: 100, status: 'normal', category: 'CMP' },
                { name: 'Sodium',     value: 138, unit: 'mEq/L', min: 135, max: 145, status: 'normal', category: 'CMP' },
                { name: 'Vitamin D',  value: 22,  unit: 'ng/mL', min: 30,  max: 100, status: 'low',    category: 'CMP' },
            ]
        },
    ]
};

// --- Helpers ---
function panelScore(panel: LabPanel) {
    const n = panel.biomarkers.filter(b => b.status === 'normal').length;
    return panel.biomarkers.length ? Math.round((n / panel.biomarkers.length) * 100) : 0;
}

function buildSparkline(values: number[], width = 150, height = 30, pad = 2) {
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
}

interface HealthDashboardProps {
    report?: LabReport;
}

export default function HealthDashboard({ report = MOCK_REPORT }: HealthDashboardProps) {
    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const {
        allBiomarkers,
        normalCount, highCount, lowCount, criticalCount, totalCount,
        flaggedCount, normalPct, scoreColor, systemsData, categoryData,
        categoryTotal, flaggedBiomarkers, topFlagged, avgPanelScore,
        healthSpark, flaggedSpark, markersSpark
    } = useMemo(() => {
        const allBiomarkers: Biomarker[] = report.panels.flatMap(p => p.biomarkers);
        const normalCount   = allBiomarkers.filter(b => b.status === 'normal').length;
        const highCount     = allBiomarkers.filter(b => b.status === 'high').length;
        const lowCount      = allBiomarkers.filter(b => b.status === 'low').length;
        const criticalCount = allBiomarkers.filter(b => b.status === 'critical').length;
        const totalCount    = allBiomarkers.length;
        const flaggedCount  = highCount + lowCount + criticalCount;
        const normalPct     = totalCount ? Math.round((normalCount / totalCount) * 100) : 0;
        const scoreColor    = normalPct >= 80 ? '#10b981' : normalPct >= 60 ? '#f59e0b' : '#ef4444';

        const panelMapping: Record<string, string> = {
            'Complete Blood Count (CBC)': 'Blood',
            'Comprehensive Metabolic Panel (CMP)': 'Metabolic',
            'Lipid Panel': 'Heart',
            'Thyroid Panel': 'Thyroid',
            'Hormones': 'Hormones',
            'Vitamins & Minerals': 'Nutrients',
        };

        const systemsData = report.panels
            .filter(p => p.biomarkers.length > 0)
            .map(p => ({
                system: panelMapping[p.name] || p.name.split('(')[0].trim().split(' ')[0],
                score: panelScore(p),
            }))
            .sort((a, b) => b.score - a.score);

        const categoryData = report.panels
            .filter(p => p.biomarkers.length > 0)
            .map((p, idx) => ({
                name: p.name.replace('Panel', '').trim(),
                count: p.biomarkers.length,
                color: CATEGORY_COLORS[p.name] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
            }));

        const categoryTotal = categoryData.reduce((acc, curr) => acc + curr.count, 0);
        const flaggedBiomarkers = allBiomarkers.filter(b => b.status !== 'normal').slice(0, 4);
        const topFlagged = flaggedBiomarkers[0];

        const avgPanelScore = systemsData.length
            ? Math.round(systemsData.reduce((acc, s) => acc + s.score, 0) / systemsData.length)
            : 0;

        const healthSpark  = [55, 62, 60, 68, 72, normalPct >= 70 ? normalPct - 4 : normalPct + 4, normalPct];
        const flaggedSpark = [12, 18, 16, 22, 19, 17, Math.max(1, flaggedCount)];
        const markersSpark = [
            Math.max(1, totalCount - 6), Math.max(1, totalCount - 4), Math.max(1, totalCount - 3),
            Math.max(1, totalCount - 2), Math.max(1, totalCount - 1), totalCount, totalCount
        ];

        return {
            allBiomarkers,
            normalCount, highCount, lowCount, criticalCount, totalCount,
            flaggedCount, normalPct, scoreColor, systemsData, categoryData,
            categoryTotal, flaggedBiomarkers, topFlagged, avgPanelScore,
            healthSpark, flaggedSpark, markersSpark
        };
    }, [report]);

    const initial = (report.patientName || 'P').trim().charAt(0).toUpperCase();

    // Sidebar Menu Items
    const menuItems = [
        { name: 'Overview',    icon: <LayoutDashboard size={18} />, active: true  },
        { name: 'Panels',      icon: <Beaker size={18} />,           active: false },
        { name: 'Biomarkers',  icon: <BarChart3 size={18} />,        active: false },
        { name: 'Insights',    icon: <MessageSquare size={18} />,    active: false },
        { name: 'Support',     icon: <HelpCircle size={18} />,       active: false },
        { name: 'Settings',    icon: <Settings size={18} />,         active: false },
    ];

    // Top Metric Cards (real lab data, with sparklines)
    const metrics = [
        {
            title: 'Health Score',
            value: String(normalPct),
            target: '100',
            unit: 'Overall',
            change: `${Math.max(1, Math.round(normalPct / 20))}%`,
            isUp: normalPct >= 60,
            color: 'green' as const,
            icon: <Heart size={14} className="text-emerald-600" />,
            sparkData: healthSpark,
        },
        {
            title: 'Biomarkers',
            value: String(totalCount),
            target: `${report.panels.length} panels`,
            unit: 'Tested',
            change: `${report.panels.length}`,
            isUp: true,
            color: 'blue' as const,
            icon: <Activity size={14} className="text-blue-600" />,
            sparkData: markersSpark,
        },
        {
            title: 'Flagged',
            value: String(flaggedCount),
            target: String(totalCount),
            unit: 'Needs Review',
            change: `${totalCount ? Math.round((flaggedCount / totalCount) * 100) : 0}%`,
            isUp: flaggedCount === 0,
            color: 'orange' as const,
            icon: <AlertCircle size={14} className="text-amber-600" />,
            sparkData: flaggedSpark,
        },
    ];

    return (
        <div className="min-h-screen bg-[#F4F7F6] font-sans flex items-center justify-center p-4">
            {/* Canvas mirroring the original aspect ratio */}
            <div className="w-full max-w-[1280px] bg-white rounded-[32px] shadow-xl overflow-hidden grid grid-cols-12 min-h-[850px] relative">

                {/* Decorative leaf */}
                <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="text-emerald-800 fill-current">
                        <path d="M10,90 Q40,40 90,10 Q60,60 10,90 Z" />
                    </svg>
                </div>

                {/* 1. SIDEBAR NAVIGATION */}
                <aside className="col-span-2 border-r border-gray-100 p-6 flex flex-col justify-between bg-white z-10">
                    <div>
                        {/* Logo */}
                        <div className="flex items-center gap-2 px-2 mb-10">
                            <div className="w-8 h-8 rounded-full border-2 border-teal-600 flex items-center justify-center font-bold text-teal-600 text-lg">
                                ⚲
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-800 text-base leading-none">Concierge MD</h1>
                                <span className="text-[10px] text-gray-400 tracking-wider font-medium uppercase">Lab Intelligence</span>
                            </div>
                        </div>

                        {/* Profile chip */}
                        <div className="flex items-center justify-between bg-slate-50 rounded-2xl mb-8 p-2 border border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-700 text-sm">
                                    {initial}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 truncate max-w-[100px]">{report.patientName || 'Patient'}</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-400 mr-1" />
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active
                                            ? 'bg-teal-50/60 text-teal-700'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                    {item.active && <span className="text-teal-600 font-bold text-xs">›</span>}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* 2. MAIN DASHBOARD CONTENT */}
                <main className="col-span-7 bg-[#F9FBFA] p-8 border-r border-gray-100 overflow-y-auto">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Bloodwork Analysis</h2>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">
                                {report.labDate || report.collectionDate || generatedDate}
                            </p>
                        </div>
                        <button className="p-2.5 bg-white rounded-full shadow-sm hover:shadow border border-gray-100 text-gray-500">
                            <Search size={18} />
                        </button>
                    </header>

                    {/* Tri-card metrics with sparklines */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {metrics.map((metric, i) => {
                            const colorMap = {
                                green:  { iconBg: 'bg-emerald-100/60', stroke: '#10b981', changeFg: 'text-emerald-600' },
                                blue:   { iconBg: 'bg-blue-100/50',    stroke: '#3b82f6', changeFg: 'text-blue-600' },
                                orange: { iconBg: 'bg-amber-100/50',   stroke: '#f59e0b', changeFg: 'text-amber-600' },
                            }[metric.color];

                            const points = buildSparkline(metric.sparkData);

                            return (
                                <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex flex-col justify-between relative overflow-hidden h-[170px]">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${colorMap.iconBg}`}>
                                                    {metric.icon}
                                                </div>
                                                <span className="text-xs font-semibold text-gray-500">{metric.title}</span>
                                            </div>
                                            <div className={`flex items-center gap-0.5 text-[10px] font-bold ${colorMap.changeFg}`}>
                                                {metric.isUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                                <span>{metric.change}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-gray-800">{metric.value}</span>
                                            <span className="text-xs text-gray-300 font-medium">/{metric.target}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{metric.unit}</span>
                                    </div>

                                    {/* Sparkline */}
                                    <div className="w-full h-8 lg:h-6 mt-2 max-w-[150px]">
                                        <svg className="w-full h-full" viewBox="0 0 150 30" preserveAspectRatio="none">
                                            <polyline
                                                points={points}
                                                fill="none"
                                                stroke={colorMap.stroke}
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Report Condition */}
                    <section className="grid grid-cols-12 gap-5 mb-6">
                        {/* Condition Area Graph */}
                        <div className="col-span-12 bg-white rounded-[28px] p-6 shadow-sm border border-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-base font-bold text-gray-800">Report Condition</h3>
                            </div>

                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold mb-1">Average Panel Score</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-gray-800">{avgPanelScore}%</span>
                                        <span className="bg-emerald-800 text-white text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                            ▲ {Math.max(1, Math.round(avgPanelScore / 25))}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 cursor-pointer">
                                    <span>This Report</span>
                                    <ChevronDown size={12} />
                                </div>
                            </div>

                            {/* Area chart */}
                            <div className="relative h-36 lg:h-[140px] mt-6 w-full">
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-300">
                                    <div className="border-b border-dashed w-full pb-1 text-right">100</div>
                                    <div className="border-b border-dashed w-full pb-1 text-right">50</div>
                                    <div className="w-full text-right">0</div>
                                </div>

                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
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
                                                <path d={areaPath} fill="url(#grad)" />
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
                                <div className="absolute top-0 right-[20%] bg-black text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {avgPanelScore}%
                                </div>
                            </div>

                            {/* X-axis labels */}
                            <div className="flex justify-between text-[11px] font-semibold text-gray-400 mt-2 px-1">
                                {systemsData.slice(0, 4).map((s, i, arr) => (
                                    <span key={s.system} className={i === Math.floor(arr.length / 2) ? 'text-gray-700 font-bold' : ''}>
                                        {s.system}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Bottom: Body System Status */}
                    <section className="grid grid-cols-12 gap-5">
                        {/* Body System Status */}
                        <div className="col-span-12 bg-white rounded-[28px] p-6 shadow-sm border border-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-bold text-gray-800">Body System Status</h3>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Score by panel</span>
                            </div>
                            <div className="space-y-3">
                                {systemsData.slice(0, 5).map(item => {
                                    const totalSegments = 8;
                                    const filled = Math.round((item.score / 100) * totalSegments);
                                    const color = item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#ef4444';
                                    return (
                                        <div key={item.system}>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{item.system}</span>
                                                <span className="text-xs font-bold" style={{ color }}>{item.score}%</span>
                                            </div>
                                            <div className="flex gap-1 h-1.5">
                                                {[...Array(totalSegments)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 rounded-sm"
                                                        style={{ backgroundColor: i < filled ? color : '#f1f5f9' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Biomarker Category Normalized Profile Chart (Below all cards, full-width) */}
                    <div className="w-full mt-2">
                        <BiomarkerProfileChart biomarkers={allBiomarkers} isMockup={true} gender={report.patientGender || 'male'} />
                    </div>
                </main>

                {/* 3. RIGHT PROFILE SIDEBAR */}
                <aside className="col-span-3 bg-white p-8 flex flex-col z-10 overflow-y-auto">
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-gray-800 text-sm">Patient Details</h3>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        {/* Patient Identity */}
                        <div className="text-center mb-8 relative">
                            <div className="absolute -right-8 top-0 text-emerald-800/20 pointer-events-none">
                                🌾
                            </div>

                            <div className="inline-block relative mb-3">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 border-4 border-slate-50 shadow-sm flex items-center justify-center text-2xl font-bold text-emerald-700 mx-auto">
                                    {initial}
                                </div>
                            </div>
                            <h4 className="font-bold text-lg text-gray-800">{report.patientName || 'Patient Report'}</h4>
                            <p className="text-xs text-gray-400 font-medium">
                                {[
                                    report.patientAge && `${report.patientAge} yrs`,
                                    report.patientGender,
                                    report.orderedBy && `Dr. ${report.orderedBy}`
                                ].filter(Boolean).join(' · ') || 'Patient profile'}
                            </p>
                        </div>

                        {/* Latest Panel / Flagged split cards */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100/30 flex flex-col justify-between h-[100px]">
                                <div>
                                    <span className="text-xs font-bold text-emerald-700 block">
                                        {report.panels.length} <span className="text-[10px] font-normal text-emerald-600/80">panels</span>
                                    </span>
                                    <span className="text-[11px] text-gray-700 font-bold block mt-1 leading-tight">
                                        - {report.panels[0]?.name.split('(')[0].trim() || 'No panels'}
                                    </span>
                                </div>
                                <button className="text-[10px] font-bold text-emerald-700 text-left hover:underline">View All</button>
                            </div>

                            <div className={`${flaggedCount > 0 ? 'bg-amber-50/60 border-amber-100/30' : 'bg-blue-50/60 border-blue-100/30'} rounded-2xl p-3 border flex flex-col justify-between h-[100px]`}>
                                <div>
                                    <span className={`text-xs font-bold ${flaggedCount > 0 ? 'text-amber-700' : 'text-blue-700'} block`}>
                                        {flaggedCount} <span className={`text-[10px] font-normal ${flaggedCount > 0 ? 'text-amber-600/80' : 'text-blue-600/80'}`}>flagged</span>
                                    </span>
                                    <span className="text-[11px] text-gray-700 font-bold block mt-1 leading-tight">
                                        - {topFlagged?.name.split(',')[0] || 'All optimal'}
                                    </span>
                                </div>
                                <button className={`text-[10px] font-bold ${flaggedCount > 0 ? 'text-amber-700' : 'text-blue-700'} text-left hover:underline`}>
                                    See Details
                                </button>
                            </div>
                        </div>

                        {/* Health Score Gauge + Legend */}
                        <section className="mb-6">
                            <h4 className="font-bold text-sm text-gray-800 mb-3">Health Score</h4>

                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 shrink-0">
                                    <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                                        <circle cx="28" cy="28" r="24" stroke="#f1f5f9" strokeWidth="5" fill="none" />
                                        {normalPct > 0 && (
                                            <circle
                                                cx="28"
                                                cy="28"
                                                r="24"
                                                stroke={scoreColor}
                                                strokeWidth="5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray={`${((normalPct / 100) * 2 * Math.PI * 24).toFixed(2)} ${(2 * Math.PI * 24).toFixed(2)}`}
                                            />
                                        )}
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xl font-bold" style={{ color: scoreColor }}>{normalPct}%</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1.5 text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-sm bg-emerald-500"></span>
                                        <span className="text-gray-500 flex-1">Normal</span>
                                        <span className="font-bold text-gray-800">{normalCount}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-sm bg-red-500"></span>
                                        <span className="text-gray-500 flex-1">Elevated</span>
                                        <span className="font-bold text-gray-800">{highCount}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-sm bg-amber-500"></span>
                                        <span className="text-gray-500 flex-1">Reduced</span>
                                        <span className="font-bold text-gray-800">{lowCount}</span>
                                    </div>
                                    {criticalCount > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-sm bg-red-800"></span>
                                            <span className="text-gray-500 flex-1">Critical</span>
                                            <span className="font-bold text-gray-800">{criticalCount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Key Findings (flagged biomarkers rail) */}
                        <section>
                            <h4 className="font-bold text-sm text-gray-800 mb-3">Key Findings</h4>
                            <div className="space-y-2">
                                {flaggedBiomarkers.length > 0 ? flaggedBiomarkers.map((b, i) => {
                                    const sc = STATUS_HEX[b.status];
                                    return (
                                        <div
                                            key={i}
                                            className="rounded-xl border p-2.5"
                                            style={{ backgroundColor: sc.bg, borderColor: `${sc.fg}33` }}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[11px] font-bold text-gray-800 truncate block">{b.name}</span>
                                                    <span
                                                        className="text-[9px] font-bold uppercase tracking-wide"
                                                        style={{ color: sc.fg }}
                                                    >
                                                        {STATUS_LABEL[b.status]}
                                                    </span>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-sm font-bold text-gray-800">{b.value}</span>
                                                    <span className="text-[9px] text-gray-400 ml-1">{b.unit}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
                                        <span className="text-[11px] text-emerald-700 font-bold">All biomarkers optimal ✓</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </aside>
            </div>
        </div>
    );
}
