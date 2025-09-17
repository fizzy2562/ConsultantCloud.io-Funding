import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { parseWorkbook } from './lib/parsePlan.js'

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub ? <div className="text-xs text-slate-500 mt-1">{sub}</div> : null}
    </div>
  )
}

function currency(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return n.toLocaleString(undefined, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    parseWorkbook('/data/consultantcloud_36m_financial_plan.xlsx')
      .then(setData)
      .catch((e) => setError(String(e)))
  }, [])

  const monthly = data?.monthly || []
  const metrics = data?.metrics
  const users = data?.users || []

  const colors = {
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
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Funding Dashboard</h1>
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="grid place-items-center min-h-screen">
        <div className="text-slate-500">Loading dashboard…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">ConsultantCloud — 36‑Month Funding Dashboard</h1>
            <p className="text-slate-500 text-sm">Interactive view of growth, revenue, costs, and cash runway.</p>
          </div>
          <a href="/data/consultantcloud_36m_financial_plan.xlsx" className="text-sm text-indigo-600 hover:underline">Download Plan</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Breakeven Month" value={metrics.breakevenMonth || '—'} />
          <Stat label="Lowest Cash Month" value={metrics.lowestCashMonth || '—'} sub={`Balance ${currency(metrics.lowestCashBalance)}`} />
          <Stat label="Ending Cash (Dec-28)" value={currency(metrics.endingCashDec28)} />
          <Stat label="Opening Funding" value={currency(metrics.openingFunding)} />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 font-medium">Users Growth</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={users}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-30} textAnchor="end" height={50} interval={2} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Free Users" stroke={colors.free} dot={false} />
                <Line type="monotone" dataKey="Freemium Users" stroke={colors.freemium} dot={false} />
                <Line type="monotone" dataKey="Enterprise Users" stroke={colors.enterprise} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 font-medium">Revenue and Expenses</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.revenue} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={colors.revenue} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-30} textAnchor="end" height={50} interval={2} />
                <YAxis />
                <Tooltip formatter={(v, n) => [currency(v), n]} />
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

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 font-medium">Net Cash Flow and Cash Balance</div>
          <div className="h-72">
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

function ComposedNetCash({ data, colors }) {
  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" angle={-30} textAnchor="end" height={50} interval={2} />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip formatter={(v, n) => [currency(v), n]} />
      <Legend />
      <Bar yAxisId="left" name="Net Cash Flow €" dataKey="net" fill={colors.net} />
      <Line yAxisId="right" name="Cash Balance €" type="monotone" dataKey="cash" stroke={colors.cash} dot={false} />
    </BarChart>
  )
}
