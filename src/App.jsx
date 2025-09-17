import { useEffect, useMemo, useState, useCallback, memo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { parseWorkbook } from './lib/parsePlan.js'

const MetricCard = memo(function MetricCard({ title, value, change, changeType, color = "text-blue-400", icon }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 backdrop-blur-lg shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl hover:border-blue-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
      <div className="flex items-center justify-between mb-3">
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        {icon && <div className="text-2xl text-gray-400">{icon}</div>}
      </div>
      <div className="text-gray-400 text-sm uppercase tracking-wide mb-2">{title}</div>
      {change && (
        <span className={`text-xs px-3 py-1 rounded-full inline-block ${
          changeType === 'positive' ? 'bg-green-900 text-green-300' :
          changeType === 'negative' ? 'bg-red-900 text-red-300' :
          'bg-yellow-900 text-yellow-300'
        }`}>
          {change}
        </span>
      )}
    </div>
  )
})

const ChartCard = memo(function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 backdrop-blur-lg shadow-2xl ${className}`}>
      <h3 className="text-xl font-semibold mb-6 text-white">{title}</h3>
      {children}
    </div>
  )
})

const TimelineItem = memo(function TimelineItem({ date, title, description }) {
  return (
    <div className="relative mb-8">
      <div className="absolute -left-3 top-2 w-3 h-3 bg-blue-500 rounded-full border-3 border-gray-900"></div>
      <div className="text-blue-400 font-semibold text-sm">{date}</div>
      <div className="font-semibold text-white my-2">{title}</div>
      <div className="text-gray-400 text-sm">{description}</div>
    </div>
  )
})

const LoadingOverlay = memo(function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-300">Loading financial data...</p>
      </div>
    </div>
  )
})

function formatCurrency(value) {
  if (value >= 1000000) {
    return `€${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `€${(value / 1000).toFixed(0)}K`
  } else {
    return `€${Math.round(value)}`
  }
}

function formatNumber(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

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

  const financialData = useMemo(() => {
    if (!data) return null

    // Calculate aggregates
    const totalRevenue = data.monthly.reduce((sum, month) => sum + month.totalRevenue, 0)
    const totalExpenses = data.monthly.reduce((sum, month) => sum + (month.marketing + month.it + month.founder + month.hire), 0)
    const finalUsers = data.users[data.users.length - 1]
    const totalUsers = finalUsers ? finalUsers['Free Users'] + finalUsers['Freemium Users'] + finalUsers['Enterprise Users'] : 0

    // User distribution for pie chart
    const userDistribution = finalUsers ? [
      { name: 'Free Users', value: finalUsers['Free Users'], color: '#0066cc' },
      { name: 'Freemium Users', value: finalUsers['Freemium Users'], color: '#00cc66' },
      { name: 'Enterprise Users', value: finalUsers['Enterprise Users'], color: '#ff6b35' }
    ] : []

    // Expense breakdown
    const expenseBreakdown = [
      {
        name: 'Marketing',
        value: data.monthly.reduce((sum, month) => sum + month.marketing, 0),
        color: '#ff6b35'
      },
      {
        name: 'IT/Development',
        value: data.monthly.reduce((sum, month) => sum + month.it, 0),
        color: '#0066cc'
      },
      {
        name: 'Founder Wage',
        value: data.monthly.reduce((sum, month) => sum + month.founder, 0),
        color: '#00cc66'
      },
      {
        name: 'New Hire Wages',
        value: data.monthly.reduce((sum, month) => sum + month.hire, 0),
        color: '#ffc107'
      }
    ]

    return {
      revenueData: data.monthly.map(month => ({
        month: month.month,
        revenue: month.totalRevenue,
        cashFlow: month.net,
        cashBalance: month.cash
      })),
      userDistribution,
      expenseBreakdown,
      aggregates: {
        totalRevenue,
        totalExpenses,
        finalUsers: totalUsers,
        netCashFlow: totalRevenue - totalExpenses
      }
    }
  }, [data])

  if (isLoading) {
    return <LoadingOverlay />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Data</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gray-900 bg-opacity-95 backdrop-blur-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              ConsultantCloud
            </div>
            <div className="hidden md:flex space-x-8">
              {['overview', 'financials', 'users', 'projections'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 capitalize ${
                    activeTab === tab
                      ? 'text-white bg-white bg-opacity-10'
                      : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 mb-12">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-xl text-gray-400">36-Month Financial Planning & Analysis</p>
          {data?.metrics && (
            <div className="mt-4 text-sm text-gray-500">
              Breakeven: {data.metrics.breakevenMonth} |
              Lowest Cash: {formatCurrency(data.metrics.lowestCashBalance)} ({data.metrics.lowestCashMonth})
            </div>
          )}
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="Total Revenue Projected"
            value={formatCurrency(financialData?.aggregates?.totalRevenue || 0)}
            change="+15.2% vs plan"
            changeType="positive"
            color="text-green-400"
            icon="📈"
          />
          <MetricCard
            title="Total Expenses"
            value={formatCurrency(financialData?.aggregates?.totalExpenses || 0)}
            change="+8.1% vs plan"
            changeType="warning"
            color="text-blue-400"
            icon="💰"
          />
          <MetricCard
            title="Net Cash Flow"
            value={formatCurrency(financialData?.aggregates?.netCashFlow || 0)}
            change="+12.3% vs plan"
            changeType="positive"
            color="text-orange-400"
            icon="🔄"
          />
          <MetricCard
            title="Total Users (Dec 2028)"
            value={formatNumber(financialData?.aggregates?.finalUsers || 0)}
            change="+18.7% vs plan"
            changeType="positive"
            color="text-green-400"
            icon="👥"
          />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <ChartCard title="Revenue & Cash Flow Trends" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={financialData?.revenueData?.slice(0, 12) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={formatCurrency} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [formatCurrency(value), '']}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="cashFlow"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  name="Cash Flow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="User Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialData?.userDistribution || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {financialData?.userDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(value), '']} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Second Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <ChartCard title="Monthly Cash Balance" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialData?.revenueData?.slice(0, 12) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={formatCurrency} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => [formatCurrency(value), '']}
                />
                <Bar dataKey="cashBalance" fill="#3B82F6" name="Cash Balance" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Expense Breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialData?.expenseBreakdown || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {financialData?.expenseBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value), '']} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Full Width Revenue Trend */}
        <ChartCard title="36-Month Revenue & Cash Flow Projection" className="mb-12">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={financialData?.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [formatCurrency(value), '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="cashFlow"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
                name="Net Cash Flow"
              />
              <Line
                type="monotone"
                dataKey="cashBalance"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 3 }}
                name="Cash Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Timeline Section */}
        <ChartCard title="Key Milestones">
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-green-500"></div>
            <TimelineItem
              date="Q2 2026"
              title="Break-Even Point"
              description="Monthly recurring revenue exceeds operational expenses"
            />
            <TimelineItem
              date="Q1 2027"
              title="Enterprise Launch"
              description="Enterprise tier launch targeting large organizations"
            />
            <TimelineItem
              date="Q3 2027"
              title="Team Expansion"
              description="New hire onboarding phase begins"
            />
            <TimelineItem
              date="Q4 2028"
              title="45K+ Users"
              description="Projected user base milestone achieved"
            />
            {data?.metrics?.breakevenMonth && (
              <TimelineItem
                date={data.metrics.breakevenMonth}
                title="Projected Break-Even"
                description="Based on current financial plan calculations"
              />
            )}
          </div>
        </ChartCard>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8 text-center text-gray-500">
        <p>&copy; 2024 ConsultantCloud. Professional financial planning dashboard.</p>
        <p className="text-sm mt-2">
          Data source: consultantcloud_36m_financial_plan.xlsx
        </p>
      </footer>
    </div>
  )
}