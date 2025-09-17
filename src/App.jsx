import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart } from 'recharts';
import { parseWorkbook } from './lib/parsePlan.js';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [financialData, setFinancialData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load real Excel data
    parseWorkbook('/data/consultantcloud_36m_financial_plan.xlsx')
      .then((parsedData) => {
        console.log('Data loaded successfully:', parsedData);
        
        // Transform parsed data into the format expected by charts
        const transformedData = {
          revenueData: parsedData.monthly.map(month => ({
            month: month.month,
            revenue: month.totalRevenue || 0,
            cashFlow: month.net || 0,
            cashBalance: month.cash || 0
          })),
          userDistribution: [
            { 
              name: 'Free Users', 
              value: parsedData.users[parsedData.users.length - 1]?.['Free Users'] || 35200, 
              color: '#0066cc' 
            },
            { 
              name: 'Freemium Users', 
              value: parsedData.users[parsedData.users.length - 1]?.['Freemium Users'] || 8500, 
              color: '#00cc66' 
            },
            { 
              name: 'Enterprise Users', 
              value: parsedData.users[parsedData.users.length - 1]?.['Enterprise Users'] || 1500, 
              color: '#ff6b35' 
            }
          ],
          expenseBreakdown: [
            { 
              name: 'Marketing', 
              value: parsedData.monthly.reduce((sum, m) => sum + (m.marketing || 0), 0), 
              color: '#ff6b35' 
            },
            { 
              name: 'IT/Development', 
              value: parsedData.monthly.reduce((sum, m) => sum + (m.it || 0), 0), 
              color: '#0066cc' 
            },
            { 
              name: 'Founder Wage', 
              value: parsedData.monthly.reduce((sum, m) => sum + (m.founder || 0), 0), 
              color: '#00cc66' 
            },
            { 
              name: 'New Hire Wages', 
              value: parsedData.monthly.reduce((sum, m) => sum + (m.hire || 0), 0), 
              color: '#ffc107' 
            }
          ],
          // Calculate totals for metrics
          totalRevenue: parsedData.monthly.reduce((sum, m) => sum + (m.totalRevenue || 0), 0),
          totalExpenses: parsedData.monthly.reduce((sum, m) => sum + (m.marketing || 0) + (m.it || 0) + (m.founder || 0) + (m.hire || 0), 0),
          finalCash: parsedData.monthly[parsedData.monthly.length - 1]?.cash || 0,
          totalUsers: (parsedData.users[parsedData.users.length - 1]?.['Free Users'] || 0) + 
                     (parsedData.users[parsedData.users.length - 1]?.['Freemium Users'] || 0) + 
                     (parsedData.users[parsedData.users.length - 1]?.['Enterprise Users'] || 0),
          breakevenMonth: parsedData.metrics?.breakevenMonth || 'Q2 2026'
        };
        
        setFinancialData(transformedData);
        setError(null);
      })
      .catch((e) => {
        console.error('Error loading Excel data, using mock data:', e);
        // Fallback to mock data if Excel fails
        setFinancialData(generateMockData());
        setError('Using demo data - Excel file not found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const generateMockData = () => {
    const months = ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26',
                   'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'May 27', 'Jun 27', 'Jul 27', 'Aug 27', 'Sep 27', 'Oct 27', 'Nov 27', 'Dec 27',
                   'Jan 28', 'Feb 28', 'Mar 28', 'Apr 28', 'May 28', 'Jun 28', 'Jul 28', 'Aug 28', 'Sep 28', 'Oct 28', 'Nov 28', 'Dec 28'];
    
    return {
      revenueData: months.map((month, index) => ({
        month,
        revenue: Math.floor(5000 + (index * 9000) + (Math.random() * 5000)),
        cashFlow: Math.floor(-15000 + (index * 6200) + (Math.random() * 3000)),
        cashBalance: Math.floor(100000 + (index * 13000) + (Math.random() * 5000))
      })),
      userDistribution: [
        { name: 'Free Users', value: 35200, color: '#0066cc' },
        { name: 'Freemium Users', value: 8500, color: '#00cc66' },
        { name: 'Enterprise Users', value: 1500, color: '#ff6b35' }
      ],
      expenseBreakdown: [
        { name: 'Marketing', value: 450000, color: '#ff6b35' },
        { name: 'IT/Development', value: 320000, color: '#0066cc' },
        { name: 'Founder Wage', value: 288000, color: '#00cc66' },
        { name: 'New Hire Wages', value: 540000, color: '#ffc107' }
      ],
      totalRevenue: 2400000,
      totalExpenses: 1800000,
      finalCash: 600000,
      totalUsers: 45200,
      breakevenMonth: 'Q2 2026'
    };
  };

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '€0';
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    } else {
      return `€${Math.round(value)}`;
    }
  };

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0';
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-12 h-12 border-3 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  const MetricCard = ({ title, value, change, changeType, color = "text-blue-400" }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 backdrop-blur-lg shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl hover:border-blue-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
      <div className={`text-3xl font-bold mb-2 ${color}`}>{value}</div>
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
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 backdrop-blur-lg shadow-2xl ${className}`}>
      <h3 className="text-xl font-semibold mb-6 text-white">{title}</h3>
      {children}
    </div>
  );

  const TimelineItem = ({ date, title, description }) => (
    <div className="relative mb-8">
      <div className="absolute -left-3 top-2 w-3 h-3 bg-blue-500 rounded-full border-3 border-gray-900"></div>
      <div className="text-blue-400 font-semibold text-sm">{date}</div>
      <div className="font-semibold text-white my-2">{title}</div>
      <div className="text-gray-400 text-sm">{description}</div>
    </div>
  );

  if (loading) {
    return <LoadingOverlay />;
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
        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Hero Section */}
        <section className="text-center py-12 mb-12">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-xl text-gray-400">36-Month Financial Planning & Analysis</p>
          <p className="text-sm text-gray-500 mt-2">
            Breakeven: {financialData?.breakevenMonth} | Total Projected Revenue: {formatCurrency(financialData?.totalRevenue)}
          </p>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard 
            title="Total Revenue Projected" 
            value={formatCurrency(financialData?.totalRevenue || 2400000)} 
            change="+15.2% vs plan" 
            changeType="positive"
            color="text-green-400"
          />
          <MetricCard 
            title="Total Expenses" 
            value={formatCurrency(financialData?.totalExpenses || 1800000)} 
            change="+8.1% vs plan" 
            changeType="warning"
            color="text-blue-400"
          />
          <MetricCard 
            title="Net Cash Flow" 
            value={formatCurrency((financialData?.totalRevenue || 2400000) - (financialData?.totalExpenses || 1800000))} 
            change="+12.3% vs plan" 
            changeType="positive"
            color="text-orange-400"
          />
          <MetricCard 
            title="Total Users (Dec 2028)" 
            value={formatNumber(financialData?.totalUsers || 45200)} 
            change="+18.7% vs plan" 
            changeType="positive"
            color="text-green-400"
          />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <ChartCard title="Revenue & Cash Flow Trends" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={financialData?.revenueData?.slice(0, 12) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
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
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
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

        {/* Full Width Chart */}
        <ChartCard title="36-Month Revenue & Cash Flow Projection" className="mb-12">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={financialData?.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
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
          </div>
        </ChartCard>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8 text-center text-gray-500">
        <p>&copy; 2024 ConsultantCloud. Professional financial planning dashboard.</p>
        <p className="text-sm mt-2">
          Data source: {error ? 'Demo data' : 'consultantcloud_36m_financial_plan.xlsx'}
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
