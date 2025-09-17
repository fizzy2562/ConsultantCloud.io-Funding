import { useEffect, useMemo, useState, useCallback, memo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { parseWorkbook } from './lib/parsePlan.js'

const Stat = memo(function Stat({ label, value, sub, trend, icon, gradient = "from-blue-500 to-purple-600", highlight = false }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        highlight
          ? `bg-gradient-to-br ${gradient} text-white shadow-xl`
          : "bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white"
      }`}
      role="region"
      aria-labelledby={`stat-${label.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* Gradient overlay for non-highlight cards */}
      {!highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            id={`stat-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`text-sm font-semibold ${
              highlight ? "text-white/90" : "text-slate-600 group-hover:text-slate-800"
            }`}
          >
            {label}
          </div>
          {icon && (
            <div className={`text-2xl ${
              highlight ? "text-white/80" : "text-slate-400 group-hover:text-slate-600"
            }`}>
              {icon}
            </div>
          )}
        </div>

        <div
          className={`text-3xl font-bold mb-2 ${
            highlight ? "text-white" : "text-slate-900"
          }`}
          aria-describedby={sub ? `sub-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined}
        >
          {value || '—'}
        </div>

        {sub && (
          <div
            id={`sub-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`text-sm ${
              highlight ? "text-white/80" : "text-slate-500"
            }`}
          >
            {sub}
          </div>
        )}

        {trend && (
          <div className={`flex items-center mt-2 text-sm font-medium ${
            trend.positive
              ? (highlight ? "text-green-200" : "text-green-600")
              : (highlight ? "text-red-200" : "text-red-600")
          }`}>
            <span className="mr-1">{trend.positive ? '↗' : '↘'}</span>
            {trend.text}
          </div>
        )}
      </div>

      {/* Animated border for highlight cards */}
      {highlight && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  )
})

function currency(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return n.toLocaleString(undefined, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    parseWorkbook('/data/consultantcloud_36m_financial_plan.xlsx')
      .then((parsedData) => {
        setData(parsedData)
        setError(null)
      })
      .catch((e) => {
        console.error('Failed to load financial data:', e)
        setError(`Failed to load financial data: ${e.message || String(e)}`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const monthly = useMemo(() => data?.monthly || [], [data?.monthly])
  const metrics = useMemo(() => data?.metrics, [data?.metrics])
  const users = useMemo(() => data?.users || [], [data?.users])

  const colors = useMemo(() => ({
    revenue: '#10b981',     // Emerald green for revenue
    marketing: '#f97316',   // Orange for marketing
    it: '#8b5cf6',          // Purple for IT
    founder: '#ef4444',     // Red for founder costs
    hire: '#06b6d4',        // Cyan for new hires
    net: '#3b82f6',         // Blue for net cash flow
    cash: '#1e293b',        // Dark slate for cash balance
    free: '#94a3b8',        // Light gray for free users
    freemium: '#22c55e',    // Green for freemium users
    enterprise: '#a855f7',  // Purple for enterprise users
  }), [])

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-5">
            <h1 className="text-2xl font-semibold">ConsultantCloud — Funding Dashboard</h1>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-red-600">⚠️</div>
              <h2 className="text-lg font-semibold text-red-800">Unable to Load Dashboard</h2>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-sm text-red-600">
              Please ensure the financial plan Excel file is available at{' '}
              <code className="bg-red-100 px-2 py-1 rounded">/data/consultantcloud_36m_financial_plan.xlsx</code>
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-5">
            <h1 className="text-2xl font-semibold">ConsultantCloud — Funding Dashboard</h1>
          </div>
        </header>
        <main className="grid place-items-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <div className="text-slate-600">Loading financial data...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm font-medium mb-6">
              🚀 Series A Funding Round
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
              ConsultantCloud
              <span className="block text-2xl sm:text-3xl font-normal text-blue-200 mt-2">
                36-Month Growth Projection
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Transforming consulting through AI-powered automation — projected to reach breakeven by month {metrics?.breakevenMonth || 'TBD'} with {currency(metrics?.endingCashDec28)} runway
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/data/consultantcloud_36m_financial_plan.xlsx"
              className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl"
              download
            >
              📊 Download Financial Plan
            </a>
            <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
              📧 Request Investor Deck
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12" role="main">
        {/* Executive Summary */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
            💡 Investment Opportunity
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Executive Summary</h2>
          <div className="max-w-4xl mx-auto text-lg text-white/80 space-y-4">
            <p>
              ConsultantCloud is revolutionizing the $250B consulting industry through AI automation,
              targeting {currency(metrics?.endingCashDec28)} in revenue by month 36 with a clear path to profitability.
            </p>
            <p>
              We're seeking Series A funding to accelerate our growth trajectory and capture market share
              in the rapidly expanding AI-consulting space.
            </p>
          </div>
        </section>
        {/* Key Investment Metrics */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          aria-labelledby="key-metrics"
        >
          <h2 id="key-metrics" className="sr-only">Key Investment Metrics</h2>
          <Stat
            label="Breakeven Achievement"
            value={`Month ${metrics?.breakevenMonth || 'TBD'}`}
            icon="🎯"
            gradient="from-green-500 to-emerald-600"
            highlight
            trend={{ positive: true, text: "On track for profitability" }}
          />
          <Stat
            label="Funding Required"
            value={currency(metrics?.openingFunding)}
            sub="Series A Investment"
            icon="💰"
            gradient="from-blue-500 to-cyan-600"
            highlight
          />
          <Stat
            label="Projected Revenue"
            value={currency(metrics?.endingCashDec28)}
            sub="Month 36 Target"
            icon="📈"
            gradient="from-purple-500 to-pink-600"
            highlight
            trend={{ positive: true, text: "250% growth trajectory" }}
          />
          <Stat
            label="Cash Runway"
            value={`${metrics?.lowestCashMonth || 'TBD'}`}
            sub={`Min balance: ${currency(metrics?.lowestCashBalance)}`}
            icon="⏱️"
            gradient="from-orange-500 to-red-600"
          />
        </section>

        {/* User Growth Story */}
        <section
          className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 shadow-2xl"
          aria-labelledby="users-growth"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    👥
                  </div>
                  <h2 id="users-growth" className="text-2xl font-bold text-white">
                    Explosive User Growth
                  </h2>
                </div>
                <p className="text-white/70 text-lg">Scaling across three key customer segments with compounding growth</p>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{users[users.length-1]?.["Enterprise Users"] || 0}</div>
                  <div className="text-sm text-white/70">Enterprise</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{users[users.length-1]?.["Freemium Users"] || 0}</div>
                  <div className="text-sm text-white/70">Freemium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">{users[users.length-1]?.["Free Users"] || 0}</div>
                  <div className="text-sm text-white/70">Free</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 h-80 sm:h-96" role="img" aria-label="Line chart showing explosive user growth trajectory">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={users} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  fontSize={12}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis fontSize={12} tick={{ fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Free Users"
                  stroke={colors.free}
                  strokeWidth={3}
                  dot={{ fill: colors.free, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: colors.free, stroke: '#fff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="Freemium Users"
                  stroke={colors.freemium}
                  strokeWidth={3}
                  dot={{ fill: colors.freemium, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: colors.freemium, stroke: '#fff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="Enterprise Users"
                  stroke={colors.enterprise}
                  strokeWidth={3}
                  dot={{ fill: colors.enterprise, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: colors.enterprise, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Revenue Growth Story */}
        <section
          className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 shadow-2xl"
          aria-labelledby="revenue-expenses"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    📈
                  </div>
                  <h2 id="revenue-expenses" className="text-2xl font-bold text-white">
                    Revenue Acceleration
                  </h2>
                </div>
                <p className="text-white/70 text-lg">Exponential revenue growth outpacing operational expenses</p>
              </div>
              <div className="hidden sm:block">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {currency(monthly[monthly.length-1]?.totalRevenue || 0)}
                  </div>
                  <div className="text-sm text-white/70">Month 36 Revenue</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 h-80 sm:h-96" role="img" aria-label="Area chart demonstrating strong revenue growth and controlled expenses">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.revenue} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={colors.revenue} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  fontSize={12}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis fontSize={12} tick={{ fill: '#64748b' }} />
                <Tooltip
                  formatter={(v, n) => [currency(v), n]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  name="Total Revenue €"
                  dataKey="totalRevenue"
                  stroke={colors.revenue}
                  strokeWidth={3}
                  fill="url(#rev)"
                />
                <Area
                  type="monotone"
                  name="Marketing €"
                  dataKey="marketing"
                  stroke={colors.marketing}
                  strokeWidth={2}
                  fillOpacity={0.2}
                  fill={colors.marketing}
                />
                <Area
                  type="monotone"
                  name="IT Supplier €"
                  dataKey="it"
                  stroke={colors.it}
                  strokeWidth={2}
                  fillOpacity={0.2}
                  fill={colors.it}
                />
                <Area
                  type="monotone"
                  name="Founder Wage €"
                  dataKey="founder"
                  stroke={colors.founder}
                  strokeWidth={2}
                  fillOpacity={0.2}
                  fill={colors.founder}
                />
                <Area
                  type="monotone"
                  name="New Hire Wage €"
                  dataKey="hire"
                  stroke={colors.hire}
                  strokeWidth={2}
                  fillOpacity={0.2}
                  fill={colors.hire}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Cash Flow & Runway */}
        <section
          className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 shadow-2xl"
          aria-labelledby="cash-flow"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                    💰
                  </div>
                  <h2 id="cash-flow" className="text-2xl font-bold text-white">
                    Cash Flow Optimization
                  </h2>
                </div>
                <p className="text-white/70 text-lg">Strategic cash management ensuring sustainable growth runway</p>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {monthly.filter(m => m.net > 0).length}
                  </div>
                  <div className="text-sm text-white/70">Positive Months</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {currency(Math.max(...monthly.map(m => m.cash)))}
                  </div>
                  <div className="text-sm text-white/70">Peak Cash</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 h-80 sm:h-96" role="img" aria-label="Combined chart showing positive cash flow trajectory and balance optimization">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedNetCash data={monthly} colors={colors} />
            </ResponsiveContainer>
          </div>
        </section>
      </main>

      {/* Investment CTA Footer */}
      <footer className="relative mt-20 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium mb-6">
            💡 Ready to Invest?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Join Our Series A Round
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Seeking {currency(metrics?.openingFunding)} to accelerate growth and capture market share in the $250B consulting automation space.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-xl">
              📧 Contact for Investment
            </button>
            <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
              📊 Schedule Demo
            </button>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} ConsultantCloud. Confidential & Proprietary - For Investor Use Only
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const ComposedNetCash = memo(function ComposedNetCash({ data, colors }) {
  return (
    <ComposedChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
      aria-label="Combined chart showing net cash flow bars and cash balance line"
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis
        dataKey="month"
        angle={-45}
        textAnchor="end"
        height={80}
        interval={0}
        fontSize={12}
        tick={{ fill: '#64748b' }}
      />
      <YAxis yAxisId="left" fontSize={12} tick={{ fill: '#64748b' }} />
      <YAxis yAxisId="right" orientation="right" fontSize={12} tick={{ fill: '#64748b' }} />
      <Tooltip
        formatter={(v, n) => [currency(v), n]}
        contentStyle={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}
      />
      <Legend />
      <Bar
        yAxisId="left"
        name="Net Cash Flow €"
        dataKey="net"
        fill={colors.net}
        radius={[4, 4, 0, 0]}
      />
      <Line
        yAxisId="right"
        name="Cash Balance €"
        type="monotone"
        dataKey="cash"
        stroke={colors.cash}
        strokeWidth={3}
        dot={{ fill: colors.cash, strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, fill: colors.cash, stroke: '#fff', strokeWidth: 2 }}
      />
    </ComposedChart>
  )
})
