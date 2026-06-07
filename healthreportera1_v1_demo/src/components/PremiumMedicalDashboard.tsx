'use client'

import {
    Activity,
    Brain,
    HeartPulse,
    ShieldCheck,
    Sparkles,
    Upload,
    Waves,
} from 'lucide-react'

const biomarkers = [
    {
        name: 'LDL Cholesterol',
        value: '154',
        unit: 'mg/dL',
        status: 'Elevated',
        color: 'bg-red-500',
        progress: '78%',
        insight:
            'Elevated LDL levels may increase long-term cardiovascular risk.',
    },
    {
        name: 'Vitamin D',
        value: '21',
        unit: 'ng/mL',
        status: 'Low',
        color: 'bg-amber-500',
        progress: '42%',
        insight:
            'Vitamin D deficiency may contribute to fatigue and low immunity.',
    },
    {
        name: 'HbA1c',
        value: '5.9',
        unit: '%',
        status: 'Borderline',
        color: 'bg-violet-500',
        progress: '63%',
        insight:
            'Glucose regulation patterns indicate mild insulin resistance.',
    },
]

const systems = [
    {
        title: 'Heart Health',
        score: 72,
        icon: HeartPulse,
    },
    {
        title: 'Inflammation',
        score: 58,
        icon: Activity,
    },
    {
        title: 'Neurological',
        score: 88,
        icon: Brain,
    },
    {
        title: 'Immune System',
        score: 81,
        icon: ShieldCheck,
    },
]

export default function PremiumMedicalDashboard() {
    return (
        <div className="min-h-screen bg-[#F8F8FA] p-6 text-slate-900">
            <div className="mx-auto max-w-[1600px]">
                {/* NAVBAR */}
                <div className="mb-6 flex items-center justify-between rounded-[32px] border border-white/70 bg-white/70 px-8 py-5 shadow-[0_10px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 text-white shadow-lg shadow-violet-200">
                            <Sparkles size={24} />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                Clinical Intelligence
                            </h1>

                            <p className="text-sm text-slate-500">
                                AI-Powered Executive Health Reports
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                            Reports
                        </button>

                        <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02]">
                            <Upload size={16} />
                            Upload Report
                        </button>
                    </div>
                </div>

                {/* HERO */}
                <section className="grid grid-cols-12 gap-6">
                    {/* LEFT */}
                    <div className="col-span-8 rounded-[36px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-violet-500">
                                    Executive Summary
                                </p>

                                <h2 className="mt-4 text-5xl font-semibold tracking-tight">
                                    Sarah Mitchell
                                </h2>

                                <p className="mt-3 max-w-2xl text-[15px] leading-8 text-slate-600">
                                    AI analysis detected elevated cardiovascular markers and mild
                                    inflammatory patterns. Metabolic function appears stable with
                                    strong neurological indicators.
                                </p>
                            </div>

                            <div className="rounded-[28px] border border-violet-100 bg-violet-50 px-8 py-6 text-center">
                                <p className="text-xs uppercase tracking-[0.3em] text-violet-500">
                                    Health Score
                                </p>

                                <h1 className="mt-2 text-6xl font-semibold tracking-tight text-violet-600">
                                    82
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Optimal Stability
                                </p>
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="mt-10 grid grid-cols-4 gap-4">
                            <StatCard label="Biomarkers" value="126" />
                            <StatCard label="Abnormalities" value="08" />
                            <StatCard label="Risk Level" value="Moderate" />
                            <StatCard label="AI Confidence" value="97%" />
                        </div>

                        {/* AI INSIGHT */}
                        <div className="mt-10 rounded-[30px] bg-gradient-to-br from-violet-500 to-purple-500 p-[1px] shadow-xl shadow-violet-200">
                            <div className="rounded-[29px] bg-[#121217] p-8 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-white/10 p-3">
                                        <Sparkles size={20} />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold">
                                            AI Clinical Insight
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Generated using longitudinal biomarker analysis
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-6 max-w-3xl text-[15px] leading-8 text-slate-300">
                                    Persistent LDL elevation combined with CRP inflammatory
                                    markers may indicate early-stage cardiovascular stress. Sleep
                                    optimization and anti-inflammatory nutrition protocols are
                                    strongly recommended.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-span-4 space-y-6">
                        {/* DNA */}
                        <div className="overflow-hidden rounded-[36px] border border-white/60 bg-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Genetic Analysis</p>

                                    <h3 className="mt-1 text-2xl font-semibold">
                                        DNA Stability
                                    </h3>
                                </div>

                                <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
                                    <Waves />
                                </div>
                            </div>

                            <div className="mt-8 flex h-[280px] items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-400 via-fuchsia-400 to-purple-600 text-7xl font-light text-white shadow-inner">
                                DNA
                            </div>
                        </div>

                        {/* QUICK STATUS */}
                        <div className="rounded-[36px] border border-white/60 bg-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">Quick Status</h3>

                                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                                    Stable
                                </div>
                            </div>

                            <div className="mt-6 space-y-5">
                                <StatusRow
                                    label="Cardiovascular"
                                    percentage={72}
                                    color="bg-red-500"
                                />

                                <StatusRow
                                    label="Hormonal"
                                    percentage={84}
                                    color="bg-violet-500"
                                />

                                <StatusRow
                                    label="Inflammation"
                                    percentage={58}
                                    color="bg-amber-500"
                                />

                                <StatusRow
                                    label="Neurological"
                                    percentage={91}
                                    color="bg-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* BIOMARKERS */}
                <section className="mt-6 rounded-[36px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-violet-500">
                                Biomarker Intelligence
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                                Critical Biomarker Analysis
                            </h2>
                        </div>

                        <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600">
                            Export PDF
                        </button>
                    </div>

                    <div className="mt-10 grid grid-cols-3 gap-6">
                        {biomarkers.map((item) => (
                            <div
                                key={item.name}
                                className="rounded-[30px] border border-slate-100 bg-[#FCFCFD] p-6 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">{item.name}</p>

                                        <div className="mt-3 flex items-end gap-2">
                                            <h3 className="text-4xl font-semibold tracking-tight">
                                                {item.value}
                                            </h3>

                                            <span className="pb-1 text-sm text-slate-500">
                                                {item.unit}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`rounded-full px-3 py-1 text-xs font-medium text-white ${item.color}`}
                                    >
                                        {item.status}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Reference Range</span>

                                        <span className="font-medium text-slate-700">
                                            {item.progress}
                                        </span>
                                    </div>

                                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{
                                                width: item.progress,
                                            }}
                                        />
                                    </div>
                                </div>

                                <p className="mt-8 text-[15px] leading-7 text-slate-600">
                                    {item.insight}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BODY SYSTEMS */}
                <section className="mt-6 rounded-[36px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-violet-500">
                            Body Intelligence
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                            System Performance Analysis
                        </h2>
                    </div>

                    <div className="mt-10 grid grid-cols-4 gap-6">
                        {systems.map((item) => {
                            const Icon = item.icon

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-[30px] border border-slate-100 bg-[#FCFCFD] p-6 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="rounded-2xl bg-violet-100 p-4 text-violet-600">
                                            <Icon size={22} />
                                        </div>

                                        <h3 className="text-4xl font-semibold tracking-tight text-violet-600">
                                            {item.score}
                                        </h3>
                                    </div>

                                    <h4 className="mt-8 text-xl font-semibold">
                                        {item.title}
                                    </h4>

                                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                                            style={{
                                                width: `${item.score}%`,
                                            }}
                                        />
                                    </div>

                                    <p className="mt-4 text-sm leading-7 text-slate-500">
                                        System performance remains within acceptable health
                                        thresholds.
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>
        </div>
    )
}

function StatCard({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="rounded-[26px] border border-slate-100 bg-[#FCFCFD] p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>

            <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                {value}
            </h3>
        </div>
    )
}

function StatusRow({
    label,
    percentage,
    color,
}: {
    label: string
    percentage: number
    color: string
}) {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-slate-600">{label}</span>

                <span className="text-sm font-medium text-slate-700">
                    {percentage}%
                </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                    className={`h-full rounded-full ${color}`}
                    style={{
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    )
}