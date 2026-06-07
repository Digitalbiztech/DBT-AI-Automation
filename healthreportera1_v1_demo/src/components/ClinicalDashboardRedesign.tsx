import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    PolarAngleAxis,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Bell,
    Bot,
    ChevronRight,
    Droplet,
    FileText,
    HeartPulse,
    LayoutDashboard,
    Sparkles,
    Stethoscope,
    Syringe,
    Upload,
    User,
} from 'lucide-react'

const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Patient Cases', icon: User },
    { label: 'Medication Check', icon: Syringe },
    { label: 'AI Assistant', icon: Bot },
    { label: 'Diagnosis', icon: Stethoscope },
    { label: 'Reports', icon: FileText },
    { label: 'Case History', icon: Activity },
    { label: 'Export', icon: ArrowUpRight },
]

const reports = [
    {
        title: 'Complete Blood Count',
        value: '12.5 x10/L',
        status: 'Suggested',
        trend: [11.8, 12.1, 12.0, 12.3, 12.4, 12.5, 12.5],
        accent: '#8b5cf6',
    },
    {
        title: 'Glucose',
        value: '142 mg/dL',
        status: 'Review',
        trend: [128, 134, 131, 138, 140, 145, 142],
        accent: '#f59e0b',
    },
    {
        title: 'Hemoglobin',
        value: '13.2 g/dL',
        status: 'Stable',
        trend: [13.0, 13.1, 13.0, 13.2, 13.2, 13.3, 13.2],
        accent: '#10b981',
    },
    {
        title: 'CRP',
        value: '8.2 mg/L',
        status: 'Attention',
        trend: [4.1, 5.2, 6.0, 7.4, 7.9, 8.5, 8.2],
        accent: '#ef4444',
    },
]

const medicalHistory = [
    { title: 'Blood Data', male: 16, female: 19, cholesterol: '112 mg/dL' },
    { title: 'Genetic Data', male: 14, female: 16, cholesterol: '181 mg/dL' },
    { title: 'Metabolic', male: 13, female: 15, cholesterol: '132 mg/dL' },
    { title: 'Devices', male: 15, female: 17, cholesterol: '125/75 mmHg' },
]

const heartRateData = [
    { t: '00', bpm: 68 },
    { t: '03', bpm: 64 },
    { t: '06', bpm: 72 },
    { t: '09', bpm: 88 },
    { t: '12', bpm: 102 },
    { t: '15', bpm: 96 },
    { t: '18', bpm: 110 },
    { t: '21', bpm: 84 },
    { t: '24', bpm: 76 },
]

const biomarkerOverview = [
    { name: 'Glucose', value: 78, fill: '#8b5cf6' },
    { name: 'Lipids', value: 65, fill: '#a855f7' },
    { name: 'Thyroid', value: 88, fill: '#06b6d4' },
    { name: 'Liver', value: 72, fill: '#f59e0b' },
]

const timelineData = [
    { day: 'Mon', blood: 3, genetic: 2, imaging: 1 },
    { day: 'Tue', blood: 4, genetic: 3, imaging: 2 },
    { day: 'Wed', blood: 6, genetic: 4, imaging: 3 },
    { day: 'Thu', blood: 5, genetic: 5, imaging: 4 },
    { day: 'Fri', blood: 7, genetic: 6, imaging: 4 },
    { day: 'Sat', blood: 5, genetic: 4, imaging: 3 },
    { day: 'Sun', blood: 4, genetic: 3, imaging: 2 },
]

const statusColor: Record<string, string> = {
    Suggested: 'bg-violet-100 text-violet-700',
    Review: 'bg-amber-100 text-amber-700',
    Stable: 'bg-emerald-100 text-emerald-700',
    Attention: 'bg-rose-100 text-rose-700',
}

export default function ClinicalDashboardRedesign() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f1ff] via-[#f9fbff] to-[#f4f4f8] p-6 text-slate-900">
            <div className="mx-auto flex max-w-[1600px] gap-6 rounded-[36px] border border-white/50 bg-white/40 p-5 shadow-[0_20px_80px_rgba(124,58,237,0.08)] backdrop-blur-2xl">
                {/* Sidebar */}
                <aside className="flex w-[280px] flex-col rounded-[30px] border border-white/60 bg-white/70 p-5 backdrop-blur-xl">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 text-lg font-bold text-white shadow-lg shadow-violet-300/50">
                            C
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold">Clinical AI</h1>
                            <p className="text-sm text-slate-500">Medical Intelligence</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon
                            const active = index === 1
                            return (
                                <button
                                    key={item.label}
                                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                                        active
                                            ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-200'
                                            : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700'
                                    }`}
                                >
                                    <Icon
                                        className={`h-4 w-4 ${
                                            active ? 'text-white' : 'text-slate-400'
                                        }`}
                                    />
                                    {item.label}
                                </button>
                            )
                        })}
                    </nav>

                    <div className="mt-auto rounded-[28px] border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-5 shadow-inner">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-200">
                            <Sparkles className="h-6 w-6" />
                        </div>

                        <h3 className="text-lg font-semibold">Expert Insights</h3>

                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            Actionable analysis from AI powered clinical systems.
                        </p>

                        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02]">
                            Unlock Insights
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 space-y-6">
                    {/* Topbar */}
                    <div className="flex items-center justify-between rounded-[28px] border border-white/50 bg-white/60 px-6 py-5 backdrop-blur-xl">
                        <div className="flex w-[360px] items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <input
                                placeholder="Search patients, reports, biomarkers..."
                                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-5">
                            <button className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-violet-200">
                                <Bell className="h-4 w-4 text-slate-500" />
                                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-sm font-semibold text-white">
                                    DL
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold">Devon Lane</h4>
                                    <p className="text-xs text-slate-500">@example.com</p>
                                </div>
                            </div>

                            <button className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200">
                                Patient Directory
                            </button>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Patient Card */}
                        <div className="col-span-4 rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_10px_40px_rgba(124,58,237,0.06)] backdrop-blur-xl">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 text-xl font-semibold text-white shadow-lg shadow-violet-200">
                                        SM
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-semibold">Sarah Mitchell</h2>
                                        <p className="text-sm text-slate-500">Mild Hypertension</p>
                                    </div>
                                </div>

                                <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:border-violet-200 hover:text-violet-600">
                                    Share
                                </button>
                            </div>

                            <div className="mt-8 grid grid-cols-3 gap-3">
                                <MetricCard
                                    label="Heart Rate"
                                    value="112"
                                    suffix="bpm"
                                    icon={<HeartPulse className="h-3.5 w-3.5" />}
                                    tone="rose"
                                />
                                <MetricCard
                                    label="Glucose"
                                    value="9,000"
                                    suffix="/ml"
                                    icon={<Droplet className="h-3.5 w-3.5" />}
                                    tone="violet"
                                />
                                <MetricCard
                                    label="Blood Group"
                                    value="O-"
                                    icon={<Activity className="h-3.5 w-3.5" />}
                                    tone="emerald"
                                />
                            </div>

                            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-4 font-medium text-white shadow-xl shadow-violet-200 transition hover:scale-[1.01]">
                                Get in Touch
                                <ArrowRight className="h-4 w-4" />
                            </button>

                            {/* Heart Rate Live Chart */}
                            <div className="mt-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-[1.5px] shadow-lg shadow-violet-200">
                                <div className="rounded-[26px] bg-slate-900 p-5">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-violet-200">
                                                24h Heart Rate
                                            </p>
                                            <p className="text-lg font-semibold text-white">
                                                Avg 86{' '}
                                                <span className="text-xs font-normal text-violet-200">
                                                    bpm
                                                </span>
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-white">
                                            Live
                                        </span>
                                    </div>

                                    <ResponsiveContainer width="100%" height={140}>
                                        <AreaChart
                                            data={heartRateData}
                                            margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="hrFill"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="#c4b5fd"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="#7c3aed"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                type="monotone"
                                                dataKey="bpm"
                                                stroke="#c4b5fd"
                                                strokeWidth={2}
                                                fill="url(#hrFill)"
                                            />
                                            <XAxis
                                                dataKey="t"
                                                stroke="rgba(255,255,255,0.4)"
                                                fontSize={9}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Lab Reports */}
                        <div className="col-span-4 space-y-6">
                            <div className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_10px_40px_rgba(124,58,237,0.06)] backdrop-blur-xl">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold">Lab Reports</h3>
                                        <p className="text-sm text-slate-500">
                                            Last 7 day trends
                                        </p>
                                    </div>

                                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:border-violet-200 hover:text-violet-600">
                                        Filter
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {reports.map((report) => (
                                        <div
                                            key={report.title}
                                            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-semibold">{report.value}</h4>
                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                    {report.title}
                                                </p>
                                            </div>

                                            <div className="h-10 w-20 shrink-0">
                                                <Sparkline
                                                    data={report.trend}
                                                    color={report.accent}
                                                />
                                            </div>

                                            <div
                                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                                                    statusColor[report.status] ??
                                                    'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {report.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_10px_40px_rgba(124,58,237,0.06)] backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">Upload Data</h3>
                                        <p className="text-xs text-slate-500">
                                            Drop files to begin analysis
                                        </p>
                                    </div>
                                    <Upload className="h-4 w-4 text-violet-500" />
                                </div>
                                <div className="space-y-3">
                                    <UploadCard
                                        title="Blood Report"
                                        subtitle="PDF report upload"
                                        badge="PDF"
                                    />

                                    <UploadCard
                                        title="Genetic Data"
                                        subtitle="CSV genome analysis"
                                        badge="CSV"
                                    />

                                    <UploadCard
                                        title="Microbiome Data"
                                        subtitle="FASTQ sequencing"
                                        badge="FASTQ"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div className="col-span-4 space-y-6">
                            <div className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_10px_40px_rgba(124,58,237,0.06)] backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">Biomarker Index</h3>
                                        <p className="text-xs text-slate-500">
                                            Aggregate panel coverage
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                                        Live
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-[170px] w-[170px] shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadialBarChart
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="40%"
                                                outerRadius="100%"
                                                barSize={10}
                                                data={biomarkerOverview}
                                                startAngle={90}
                                                endAngle={-270}
                                            >
                                                <PolarAngleAxis
                                                    type="number"
                                                    domain={[0, 100]}
                                                    angleAxisId={0}
                                                    tick={false}
                                                />
                                                <RadialBar
                                                    background={{ fill: '#f1f5f9' }}
                                                    cornerRadius={8}
                                                    dataKey="value"
                                                />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        {biomarkerOverview.map((item) => (
                                            <div
                                                key={item.name}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="h-2.5 w-2.5 rounded-full"
                                                        style={{ backgroundColor: item.fill }}
                                                    />
                                                    <span className="text-slate-600">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-slate-900">
                                                    {item.value}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_10px_40px_rgba(124,58,237,0.06)] backdrop-blur-xl">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Medical History</h3>
                                    <p className="text-xs text-slate-500">
                                        Historical biomarker analytics
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {medicalHistory.map((item) => (
                                        <div
                                            key={item.title}
                                            className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm transition hover:border-violet-200"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-medium">{item.title}</h4>
                                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                                        Cholesterol: {item.cholesterol}
                                                    </p>
                                                </div>

                                                <button className="rounded-full p-1 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600">
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="mt-3 h-12">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={[
                                                            { name: 'Male', val: item.male },
                                                            { name: 'Female', val: item.female },
                                                        ]}
                                                        layout="vertical"
                                                        margin={{
                                                            top: 0,
                                                            right: 16,
                                                            bottom: 0,
                                                            left: 0,
                                                        }}
                                                    >
                                                        <XAxis
                                                            type="number"
                                                            hide
                                                            domain={[0, 25]}
                                                        />
                                                        <YAxis
                                                            type="category"
                                                            dataKey="name"
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{
                                                                fontSize: 10,
                                                                fill: '#94a3b8',
                                                            }}
                                                            width={45}
                                                        />
                                                        <Bar
                                                            dataKey="val"
                                                            radius={[6, 6, 6, 6]}
                                                            barSize={10}
                                                        >
                                                            <Cell fill="#8b5cf6" />
                                                            <Cell fill="#10b981" />
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Activity Chart */}
                    <section className="rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_10px_40px_rgba(124,58,237,0.06)] backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold">Patient Activity</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    03.19.2026 — 04.25.2026
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Legend
                                    payload={[]}
                                    wrapperStyle={{ display: 'none' }}
                                />
                                <div className="hidden items-center gap-4 text-xs text-slate-500 md:flex">
                                    <LegendDot color="#8b5cf6" label="Blood" />
                                    <LegendDot color="#06b6d4" label="Genetic" />
                                    <LegendDot color="#f59e0b" label="Imaging" />
                                </div>
                                <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-violet-200 hover:text-violet-600">
                                    Edit Goals
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={timelineData}
                                    margin={{ top: 10, right: 16, bottom: 0, left: -16 }}
                                >
                                    <defs>
                                        <linearGradient id="bloodFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="#8b5cf6"
                                                stopOpacity={0.35}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#8b5cf6"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="geneticFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#06b6d4"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#06b6d4"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="imagingFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#f59e0b"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#f59e0b"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 6"
                                        stroke="#e2e8f0"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(255,255,255,0.95)',
                                            border: '1px solid #ede9fe',
                                            borderRadius: 12,
                                            boxShadow:
                                                '0 10px 40px rgba(124,58,237,0.12)',
                                            fontSize: 12,
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="blood"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        fill="url(#bloodFill)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="genetic"
                                        stroke="#06b6d4"
                                        strokeWidth={2}
                                        fill="url(#geneticFill)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="imaging"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        fill="url(#imagingFill)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

function MetricCard({
    label,
    value,
    suffix,
    icon,
    tone = 'violet',
}: {
    label: string
    value: string
    suffix?: string
    icon?: React.ReactNode
    tone?: 'violet' | 'rose' | 'emerald'
}) {
    const toneMap = {
        violet: 'bg-violet-50 text-violet-600',
        rose: 'bg-rose-50 text-rose-600',
        emerald: 'bg-emerald-50 text-emerald-600',
    } as const

    return (
        <div className="rounded-2xl border border-slate-100 bg-white/70 p-3 shadow-sm">
            <div className="flex items-center gap-2">
                {icon && (
                    <span
                        className={`flex h-6 w-6 items-center justify-center rounded-lg ${toneMap[tone]}`}
                    >
                        {icon}
                    </span>
                )}
                <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
            </div>
            <h4 className="mt-2 text-base font-semibold">
                {value}
                {suffix && (
                    <span className="ml-1 text-xs font-normal text-slate-500">{suffix}</span>
                )}
            </h4>
        </div>
    )
}

function UploadCard({
    title,
    subtitle,
    badge,
}: {
    title: string
    subtitle: string
    badge: string
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <FileText className="h-4 w-4" />
                </div>
                <div>
                    <h4 className="font-medium">{title}</h4>
                    <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
                </div>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {badge}
            </div>
        </div>
    )
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
    const points = data.map((value, index) => ({ index, value }))
    const gradientId = `spark-${color.replace('#', '')}`

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={color} stopOpacity={1} />
                    </linearGradient>
                </defs>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
            />
            {label}
        </span>
    )
}
