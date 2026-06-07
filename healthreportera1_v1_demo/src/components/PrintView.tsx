import React from 'react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
  PieChart, Pie,
} from 'recharts';
import { LabReport, Biomarker, LabPanel } from '@/types/lab';
import { getPercentInRange } from '@/lib/statusHelpers';
import logo from '@/components/logo/YC_Main_WG.png';
import iconLogo from '@/components/logo/YC_Icon_GS.png';

// ─── Status colour tokens (must be raw hex for print / SVG) ───────────────────
const STATUS_HEX: Record<string, { fg: string; bg: string; light: string; bar: string }> = {
  normal:   { fg: '#0d9488', bg: '#f0fdfa', light: '#ccfbf1', bar: '#0d9488' },
  high:     { fg: '#b91c1c', bg: '#fef2f2', light: '#fee2e2', bar: '#b91c1c' },
  low:      { fg: '#b45309', bg: '#fffbeb', light: '#fef3c7', bar: '#b45309' },
  critical: { fg: '#7f1d1d', bg: '#fef2f2', light: '#fee2e2', bar: '#7f1d1d' },
};

const STATUS_ICON: Record<string, string> = {
  normal: '✓', high: '↑', low: '↓', critical: '!',
};

const STATUS_LABEL: Record<string, string> = {
  normal: 'NORMAL', high: 'ELEVATED', low: 'REDUCED', critical: 'CRITICAL',
};

// Brand palette
const YC_GOLD  = '#D4BDAD';
const YC_WARM  = '#8a7a6a';
const SLATE_900 = '#0f172a';
const SLATE_700 = '#334155';
const SLATE_500 = '#64748b';
const SLATE_200 = '#e2e8f0';
const SLATE_50  = '#f8fafc';

const CHART_COLORS = ['#0ea5e9', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// ─── Panel colour pick ────────────────────────────────────────────────────────
function panelScore(panel: LabPanel) {
  const n = panel.biomarkers.filter(b => b.status === 'normal').length;
  return panel.biomarkers.length ? Math.round((n / panel.biomarkers.length) * 100) : 0;
}

// ─── Needle position (mirrors BiomarkerCard logic) ────────────────────────────
function needlePct(m: Biomarker) {
  const rawPct = getPercentInRange(m.value, m.min, m.max);
  if (m.status === 'normal') return 20 + rawPct * 0.6;
  if (m.status === 'low') return Math.max(5, (m.value / (m.min || 1)) * 20);
  const excess = m.max > 0 ? (m.value - m.max) / m.max : 0.5;
  return Math.min(95, 80 + excess * 20);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{
      background: SLATE_900, borderRadius: 10, padding: '10px 18px',
      marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        height: 28, width: 4, background: YC_GOLD,
        borderRadius: 4, flexShrink: 0,
      }} />
      <div>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ color: '#94a3b8', fontSize: 9, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{
      background: '#fff', border: `1.5px solid ${color}`, borderRadius: 10,
      padding: '8px 14px', textAlign: 'center', minWidth: 70,
    }}>
      <div style={{ color, fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{count}</div>
      <div style={{ color: SLATE_500, fontSize: 8, fontWeight: 600, textTransform: 'uppercase', marginTop: 4, letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}

function RangeBar({ m }: { m: Biomarker }) {
  const pct = needlePct(m);
  const sc = STATUS_HEX[m.status] || STATUS_HEX.normal;
  return (
    <div style={{ marginTop: 6, marginBottom: 2 }}>
      <div style={{ position: 'relative', height: 8, borderRadius: 999, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '20%', background: 'rgba(180,83,9,0.18)', height: '100%' }} />
        <div style={{ width: '60%', background: 'rgba(13,148,136,0.16)', height: '100%' }} />
        <div style={{ width: '20%', background: 'rgba(185,28,28,0.18)', height: '100%' }} />
        {/* Fill bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: `${pct}%`, background: sc.bar + 'aa', borderRadius: 999, transition: 'none',
        }} />
        {/* Dividers */}
        <div style={{ position: 'absolute', top: 0, left: '20%', height: '100%', width: 1, background: 'rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', top: 0, left: '80%', height: '100%', width: 1, background: 'rgba(255,255,255,0.6)' }} />
        {/* Needle */}
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 12, height: 12, borderRadius: '50%',
          background: sc.fg, border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span style={{ color: SLATE_500, fontSize: 8 }}>Low ({m.min})</span>
        <span style={{ color: SLATE_500, fontSize: 8 }}>High ({m.max})</span>
      </div>
    </div>
  );
}

function BiomarkerRow({ m }: { m: Biomarker }) {
  const sc = STATUS_HEX[m.status] || STATUS_HEX.normal;
  const isAbnormal = m.status !== 'normal';
  return (
    <div style={{
      borderRadius: 12,
      border: `1px solid ${isAbnormal ? sc.fg + '55' : SLATE_200}`,
      borderLeft: isAbnormal ? `3px solid ${sc.fg}` : `1px solid ${SLATE_200}`,
      background: isAbnormal ? sc.bg : '#fff',
      padding: '10px 14px',
      pageBreakInside: 'avoid',
      marginBottom: 8,
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Status icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: sc.light, color: sc.fg, fontWeight: 800, fontSize: 14,
          border: `1px solid ${sc.fg}33`,
        }}>
          {STATUS_ICON[m.status] || '•'}
        </div>

        {/* Name + ref range */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: SLATE_900, lineHeight: 1.2 }}>{m.name}</div>
          <div style={{ color: SLATE_500, fontSize: 9, marginTop: 2 }}>
            Ref: <span style={{ fontWeight: 600, color: SLATE_700 }}>{m.min} – {m.max} {m.unit}</span>
          </div>
        </div>

        {/* Value + badge */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 20, color: SLATE_900, lineHeight: 1 }}>{m.value}</span>
            <span style={{ fontSize: 10, color: SLATE_500, marginLeft: 3 }}>{m.unit}</span>
          </div>
          <div style={{
            marginTop: 4, display: 'inline-block',
            background: sc.light, color: sc.fg, border: `1px solid ${sc.fg}44`,
            borderRadius: 999, padding: '2px 8px', fontSize: 8, fontWeight: 700, letterSpacing: '0.05em',
          }}>
            {STATUS_LABEL[m.status] || m.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Range track */}
      <RangeBar m={m} />

      {/* AI interpretation */}
      {m.clinicalInterpretation && (
        <div style={{
          marginTop: 8, padding: '6px 10px', borderRadius: 8,
          background: 'rgba(212,189,173,0.12)', border: `1px solid ${YC_GOLD}55`,
          display: 'flex', gap: 6, alignItems: 'flex-start',
        }}>
          <span style={{ color: YC_WARM, fontWeight: 800, fontSize: 8, flexShrink: 0, marginTop: 1 }}>AI</span>
          <p style={{ color: SLATE_700, fontSize: 9.5, lineHeight: 1.5, margin: 0 }}>{m.clinicalInterpretation}</p>
        </div>
      )}
    </div>
  );
}

// Panel bar chart (SVG via Recharts) — uses fixed pixel height, not % responsive
function PanelMiniBarChart({ panel }: { panel: LabPanel }) {
  const data = panel.biomarkers.map((m) => ({
    name: m.name.length > 12 ? m.name.slice(0, 11) + '…' : m.name,
    fullName: m.name,
    pct: getPercentInRange(m.value, m.min, m.max),
    status: m.status,
  }));

  return (
    <BarChart data={data} width={560} height={160} margin={{ top: 4, right: 8, left: -24, bottom: 50 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={SLATE_200} />
      <XAxis
        dataKey="name"
        tick={{ fontSize: 8, fill: SLATE_500 }}
        angle={-30}
        textAnchor="end"
        interval={0}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        domain={[0, 100]}
        tick={{ fontSize: 8, fill: SLATE_500 }}
        tickFormatter={(v) => `${v}%`}
        axisLine={false}
        tickLine={false}
      />
      <ReferenceLine y={50} stroke="#0d9488" strokeDasharray="4 2" opacity={0.35} />
      <Bar dataKey="pct" maxBarSize={28} radius={[3, 3, 0, 0]} isAnimationActive={false}>
        {data.map((entry, i) => (
          <Cell key={i} fill={STATUS_HEX[entry.status]?.bar || '#94a3b8'} />
        ))}
      </Bar>
    </BarChart>
  );
}

// Donut health score chart
function HealthDonut({ biomarkers }: { biomarkers: Biomarker[] }) {
  const counts = {
    normal:   biomarkers.filter(b => b.status === 'normal').length,
    high:     biomarkers.filter(b => b.status === 'high').length,
    low:      biomarkers.filter(b => b.status === 'low').length,
    critical: biomarkers.filter(b => b.status === 'critical').length,
  };
  const total = biomarkers.length;
  const normalPct = total ? Math.round((counts.normal / total) * 100) : 0;

  const data = [
    { name: 'Normal',   value: counts.normal,   fill: '#0d9488' },
    { name: 'Elevated', value: counts.high,     fill: '#b91c1c' },
    { name: 'Reduced',  value: counts.low,      fill: '#b45309' },
    { name: 'Critical', value: counts.critical, fill: '#7f1d1d' },
  ].filter(d => d.value > 0);

  const scoreColor = normalPct >= 80 ? '#0d9488' : normalPct >= 60 ? '#b45309' : '#b91c1c';
  const scoreLabel = normalPct >= 80 ? 'Excellent' : normalPct >= 60 ? 'Fair' : 'Needs Work';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {/* Donut */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <RadialBarChart
          cx={75} cy={75} innerRadius={48} outerRadius={68}
          barSize={12} data={data} startAngle={90} endAngle={-270}
          width={150} height={150}
        >
          <RadialBar dataKey="value" cornerRadius={5} background={{ fill: '#f1f5f9' }} isAnimationActive={false}>
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </RadialBar>
        </RadialBarChart>
        {/* Centre text */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{normalPct}%</span>
          <span style={{ fontSize: 9, color: SLATE_500, marginTop: 3 }}>{scoreLabel}</span>
        </div>
      </div>

      {/* Legend + counts */}
      <div style={{ flex: 1 }}>
        {[
          { label: 'Normal',   count: counts.normal,   color: '#0d9488' },
          { label: 'Elevated', count: counts.high,     color: '#b91c1c' },
          { label: 'Reduced',  count: counts.low,      color: '#b45309' },
          { label: 'Critical', count: counts.critical, color: '#7f1d1d' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: SLATE_700, flex: 1 }}>{label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: SLATE_900 }}>{count}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${SLATE_200}`, marginTop: 8, paddingTop: 8 }}>
          <span style={{ fontSize: 9, color: SLATE_500 }}>Total markers: </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: SLATE_900 }}>{total}</span>
        </div>
      </div>
    </div>
  );
}

// Category pie chart
function CategoryPie({ report }: { report: LabReport }) {
  const data = report.panels.map((p, i) => ({
    name: p.name.split('(')[0].trim(),
    value: p.biomarkers.length,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div>
      <PieChart width={240} height={160}>
        <Pie
          data={data} cx={80} cy={75}
          innerRadius={38} outerRadius={62}
          paddingAngle={3} dataKey="value" strokeWidth={0}
          isAnimationActive={false}
        >
          {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Pie>
      </PieChart>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 4 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.fill, flexShrink: 0 }} />
            <span style={{ fontSize: 8.5, color: SLATE_500 }}>{d.name}</span>
            <span style={{ fontSize: 8.5, fontWeight: 700, color: SLATE_900 }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Body system bars
function BodySystemBars({ report }: { report: LabReport }) {
  const panelMapping: Record<string, string> = {
    'Complete Blood Count (CBC)': 'Blood',
    'Comprehensive Metabolic Panel (CMP)': 'Metabolic',
    'Lipid Panel': 'Heart',
    'Thyroid Panel': 'Thyroid',
    'Hormones': 'Hormones',
    'Vitamins & Minerals': 'Nutrients',
  };

  const data = report.panels
    .filter(p => p.biomarkers.length > 0)
    .map(p => ({
      system: panelMapping[p.name] || p.name.split('(')[0].trim().split(' ')[0],
      score: panelScore(p),
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map(item => {
        const segs = Math.round(item.score / 20);
        const color = item.score >= 80 ? '#0d9488' : item.score >= 60 ? '#b45309' : '#b91c1c';
        return (
          <div key={item.system}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: SLATE_700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.system}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color }}>{item.score}%</span>
            </div>
            <div style={{ display: 'flex', gap: 3, height: 7 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: 2,
                  background: i < segs ? color : '#e2e8f0',
                }} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN PRINT VIEW ─────────────────────────────────────────────────────────

interface PrintViewProps {
  report: LabReport;
  userName?: string;
}

export function PrintView({ report, userName }: PrintViewProps) {
  const allBiomarkers = report.panels.flatMap(p => p.biomarkers);
  const normalCount   = allBiomarkers.filter(b => b.status === 'normal').length;
  const highCount     = allBiomarkers.filter(b => b.status === 'high').length;
  const lowCount      = allBiomarkers.filter(b => b.status === 'low').length;
  const criticalCount = allBiomarkers.filter(b => b.status === 'critical').length;
  const normalPct     = allBiomarkers.length ? Math.round((normalCount / allBiomarkers.length) * 100) : 0;
  const scoreColor    = normalPct >= 80 ? '#0d9488' : normalPct >= 60 ? '#b45309' : '#b91c1c';
  const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const baseStyle: React.CSSProperties = {
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: SLATE_900,
    background: '#fff',
    maxWidth: 860,
    margin: '0 auto',
    padding: '0 0 40px 0',
  };

  return (
    <div style={baseStyle}>
      {/* ── PAGE HEADER ── */}
      <div style={{
        background: SLATE_900, padding: '20px 32px 0 32px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Gold accent bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: YC_GOLD }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={logo} alt="Your Concierge MD" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: YC_GOLD, fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bloodwork Analysis Report</div>
            <div style={{ color: '#94a3b8', fontSize: 9, marginTop: 4 }}>Generated: {generatedDate}</div>
            <div style={{ color: '#94a3b8', fontSize: 9, marginTop: 2 }}>
              REF: {Math.random().toString(36).substr(2, 8).toUpperCase()}
            </div>
          </div>
        </div>
        <div style={{ height: 20 }} />
      </div>

      <div style={{ padding: '24px 32px 0 32px' }}>

        {/* ── PATIENT BANNER ── */}
        <div style={{
          background: SLATE_50, border: `1px solid ${SLATE_200}`,
          borderRadius: 14, padding: '16px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={iconLogo} alt="YC" style={{ height: 44, width: 44, borderRadius: 10, objectFit: 'cover', border: `1px solid ${SLATE_200}` }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: SLATE_900 }}>
                {report.patientName || userName || 'Patient Report'}
              </div>
              <div style={{ color: SLATE_500, fontSize: 10, marginTop: 3 }}>
                {[
                  report.patientAge && `${report.patientAge} yrs`,
                  report.patientGender,
                  report.labDate || report.collectionDate,
                  report.orderedBy && `Dr. ${report.orderedBy}`,
                ].filter(Boolean).join(' · ')}
              </div>
            </div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <StatPill label="Normal" count={normalCount} color="#0d9488" />
            <StatPill label="Elevated" count={highCount} color="#b91c1c" />
            <StatPill label="Reduced" count={lowCount} color="#b45309" />
            {criticalCount > 0 && <StatPill label="Critical" count={criticalCount} color="#7f1d1d" />}
            <div style={{
              border: `2px solid ${scoreColor}`, borderRadius: 10,
              padding: '8px 16px', textAlign: 'center', minWidth: 80,
              background: `${scoreColor}11`,
            }}>
              <div style={{ color: scoreColor, fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{normalPct}%</div>
              <div style={{ color: SLATE_500, fontSize: 8, fontWeight: 600, textTransform: 'uppercase', marginTop: 4, letterSpacing: '0.06em' }}>Health Score</div>
            </div>
          </div>
        </div>

        {/* ── OVERVIEW: DONUT + PIE + BODY SYSTEMS ── */}
        <SectionHeader title="Clinical Overview" subtitle="Health score distribution, biomarker categories, and body system status" />
        
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16, marginBottom: 28, pageBreakInside: 'avoid',
        }}>
          {/* Health donut */}
          <div style={{
            border: `1px solid ${SLATE_200}`, borderRadius: 12, padding: 16,
            background: '#fff',
          }}>
            <div style={{ fontWeight: 700, fontSize: 10, color: SLATE_500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Health Score</div>
            <HealthDonut biomarkers={allBiomarkers} />
          </div>

          {/* Category pie */}
          <div style={{
            border: `1px solid ${SLATE_200}`, borderRadius: 12, padding: 16,
            background: '#fff',
          }}>
            <div style={{ fontWeight: 700, fontSize: 10, color: SLATE_500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Biomarkers by Category</div>
            <CategoryPie report={report} />
          </div>

          {/* Body systems */}
          <div style={{
            border: `1px solid ${SLATE_200}`, borderRadius: 12, padding: 16,
            background: '#fff',
          }}>
            <div style={{ fontWeight: 700, fontSize: 10, color: SLATE_500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Body System Status</div>
            <BodySystemBars report={report} />
          </div>
        </div>

        {/* ── AI OVERVIEW SUMMARY ── */}
        {report.summary && (
          <>
            <SectionHeader title="AI Clinical Summary" subtitle="AI-generated clinical overview and key findings" />
            <div style={{
              border: `1px solid ${YC_GOLD}55`, borderLeft: `4px solid ${YC_GOLD}`,
              borderRadius: 12, padding: '14px 18px', marginBottom: 28,
              background: 'rgba(212,189,173,0.08)', pageBreakInside: 'avoid',
            }}>
              <p style={{ color: SLATE_700, fontSize: 11, lineHeight: 1.7, margin: 0 }}>{report.summary}</p>
            </div>
          </>
        )}

        {/* AI insights bullets */}
        {report.aiInsights && report.aiInsights.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 9.5, color: YC_WARM, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Key Insights</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.aiInsights.map((insight, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  border: `1px solid ${YC_GOLD}33`, borderRadius: 10,
                  padding: '9px 13px', background: 'rgba(212,189,173,0.06)',
                  pageBreakInside: 'avoid',
                }}>
                  <div style={{
                    background: YC_WARM, color: '#fff', borderRadius: '50%',
                    width: 18, height: 18, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 8, fontWeight: 800, flexShrink: 0, marginTop: 1,
                  }}>{i + 1}</div>
                  <p style={{ color: SLATE_700, fontSize: 10, lineHeight: 1.6, margin: 0 }}>{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PER-PANEL SECTIONS ── */}
        {report.panels.map((panel) => {
          const pPct = panelScore(panel);
          const pColor = pPct >= 80 ? '#0d9488' : pPct >= 60 ? '#b45309' : '#b91c1c';
          const flagged = panel.biomarkers.filter(b => b.status !== 'normal');

          return (
            <div key={panel.name} style={{ marginBottom: 36, pageBreakInside: 'avoid' }}>
              {/* Panel heading */}
              <div style={{
                background: '#f8fafc', border: `1px solid ${SLATE_200}`,
                borderRadius: 12, padding: '12px 18px', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: SLATE_900 }}>{panel.name}</div>
                  <div style={{ color: SLATE_500, fontSize: 9, marginTop: 2 }}>
                    {panel.biomarkers.length} markers ·{' '}
                    {flagged.length > 0
                      ? <span style={{ color: '#b91c1c', fontWeight: 600 }}>{flagged.length} flagged</span>
                      : <span style={{ color: '#0d9488', fontWeight: 600 }}>all normal</span>
                    }
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: pColor, fontWeight: 800, fontSize: 22 }}>{pPct}%</div>
                  <div style={{ color: SLATE_500, fontSize: 8 }}>Panel Score</div>
                </div>
              </div>

              {/* Bar chart for this panel */}
              {panel.biomarkers.length > 0 && (
                <div style={{
                  border: `1px solid ${SLATE_200}`, borderRadius: 12, padding: '12px 8px 4px',
                  background: '#fff', marginBottom: 14, overflow: 'hidden',
                }}>
                  <div style={{ fontWeight: 600, fontSize: 10, color: SLATE_500, padding: '0 8px', marginBottom: 4 }}>
                    {panel.name} — Value vs. Reference Range (%)
                  </div>
                  <PanelMiniBarChart panel={panel} />
                </div>
              )}

              {/* Biomarker rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {panel.biomarkers.map(m => (
                  <BiomarkerRow key={m.name} m={m} />
                ))}
              </div>
            </div>
          );
        })}

        {/* ── DISCLAIMER FOOTER ── */}
        <div style={{
          marginTop: 32, padding: '14px 18px',
          border: `1px solid ${SLATE_200}`, borderRadius: 10,
          background: SLATE_50,
        }}>
          <p style={{ color: SLATE_500, fontSize: 8.5, lineHeight: 1.7, margin: 0, textAlign: 'center' }}>
            <strong style={{ color: SLATE_700 }}>Medical Disclaimer:</strong>{' '}
            This report is generated by an AI system for educational and informational purposes only.
            It does not constitute medical advice, diagnosis, or treatment. Always consult a licensed healthcare
            professional before making any medical decisions.
          </p>
        </div>
      </div>

      {/* ── DOCUMENT FOOTER ── */}
      <div style={{
        background: SLATE_900, padding: '10px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32,
      }}>
        <img src={logo} alt="Your Concierge MD" style={{ height: 28, width: 'auto', opacity: 0.85 }} />
        <span style={{ color: '#64748b', fontSize: 8 }}>Powered by Huumanize · Confidential Patient Document</span>
      </div>
    </div>
  );
}
