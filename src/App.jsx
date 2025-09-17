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

const Stat = memo(function Stat({ label, value, sub, trend }) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
      role="region"
      aria-labelledby={`stat-${label.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div
        id={`stat-${label.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-sm font-medium text-slate-600 mb-1"
      >
        {label}
      </div>
      <div
        className="text-2xl font-bold text-slate-900 mb-1"
        aria-describedby={sub ? `sub-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined}
      >
        {value || '—'}
      </div>
      {sub && (
        <div
          id={`sub-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-xs text-slate-500"
        >
          {sub}
        </div>
      )}
      {trend && (
        <div className={`text-xs font-medium mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.positive ? '↗' : '↘'} {trend.text}
        </div>
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
    revenue: '#10b981',
    marketing: '#f97316',
    it: '#6366f1',
    founder: '#ef4444',
    hire: '#22d3ee',
    net: '#0ea5e9',
    cash: '#111827',
    free: '#6b7280',
    freemium: '#84cc16',
    enterprise: '#a855f7',
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">ConsultantCloud — 36‑Month Funding Dashboard</h1>
            <p className="text-slate-600 text-sm mt-1">Interactive view of growth, revenue, costs, and cash runway.</p>
          </div>
          <a
            href="/data/consultantcloud_36m_financial_plan.xlsx"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            download
          >
            📊 Download Plan
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6" role="main">
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          aria-labelledby="key-metrics"
        >
          <h2 id="key-metrics" className="sr-only">Key Financial Metrics</h2>
          <Stat label="Breakeven Month" value={metrics?.breakevenMonth || '—'} />
          <Stat
            label="Lowest Cash Month"
            value={metrics?.lowestCashMonth || '—'}
            sub={`Balance ${currency(metrics?.lowestCashBalance)}`}
          />
          <Stat label="Ending Cash (Dec-28)" value={currency(metrics?.endingCashDec28)} />
          <Stat label="Opening Funding" value={currency(metrics?.openingFunding)} />
        </section>

        <section
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
          aria-labelledby="users-growth"
        >
          <div className="mb-4">
            <h2 id="users-growth" className="text-lg font-semibold text-slate-900 mb-1">
              Users Growth
            </h2>
            <p className="text-sm text-slate-600">Growth trajectory across user segments</p>
          </div>
          <div className="h-64 sm:h-80" role="img" aria-label="Line chart showing user growth over time">
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
                <Line type="monotone" dataKey="Free Users" stroke={colors.free} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Freemium Users" stroke={colors.freemium} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Enterprise Users" stroke={colors.enterprise} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
          aria-labelledby="revenue-expenses"
        >
          <div className="mb-4">
            <h2 id="revenue-expenses" className="text-lg font-semibold text-slate-900 mb-1">
              Revenue and Expenses
            </h2>
            <p className="text-sm text-slate-600">Monthly revenue vs operational costs</p>
          </div>
          <div className="h-72 sm:h-80" role="img" aria-label="Area chart showing revenue and expenses over time">
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
                <Area type="monotone" name="Total Revenue €" dataKey="totalRevenue" stroke={colors.revenue} fill="url(#rev)" />
                <Area type="monotone" name="Marketing €" dataKey="marketing" stroke={colors.marketing} fillOpacity={0.15} fill={colors.marketing} />
                <Area type="monotone" name="IT Supplier €" dataKey="it" stroke={colors.it} fillOpacity={0.15} fill={colors.it} />
                <Area type="monotone" name="Founder Wage €" dataKey="founder" stroke={colors.founder} fillOpacity={0.15} fill={colors.founder} />
                <Area type="monotone" name="New Hire Wage €" dataKey="hire" stroke={colors.hire} fillOpacity={0.15} fill={colors.hire} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section
          className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
          aria-labelledby="cash-flow"
        >
          <div className="mb-4">
            <h2 id="cash-flow" className="text-lg font-semibold text-slate-900 mb-1">
              Net Cash Flow and Cash Balance
            </h2>
            <p className="text-sm text-slate-600">Monthly cash flow vs cumulative cash balance</p>
          </div>
          <div className="h-72 sm:h-80" role="img" aria-label="Combined chart showing cash flow and balance">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedNetCash data={monthly} colors={colors} />
            </ResponsiveContainer>
          </div>
        </section>
      </main>

      <footer className="text-center text-xs text-slate-500 py-8">© {new Date().getFullYear()} ConsultantCloud</footer>
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
      <Bar yAxisId="left" name="Net Cash Flow €" dataKey="net" fill={colors.net} />
      <Line yAxisId="right" name="Cash Balance €" type="monotone" dataKey="cash" stroke={colors.cash} strokeWidth={2} dot={false} />
    </ComposedChart>
  )
})
