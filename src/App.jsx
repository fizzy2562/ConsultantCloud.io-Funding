import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import ModernPieChart from './components/ModernPieChart.jsx'
import { getChartVariant } from './config.js'
import { parseWorkbook } from './lib/parsePlan.js'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    console.log('🚀 App starting...')
    
    const loadData = async () => {
      try {
        console.log('📊 Loading Excel data...')
        const parsedData = await parseWorkbook('/data/consultantcloud_36m_financial_plan.xlsx')
        console.log('✅ Excel data loaded:', parsedData)
        
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
          totalRevenue: parsedData.monthly.reduce((sum, m) => sum + (m.totalRevenue || 0), 0),
          totalExpenses: parsedData.monthly.reduce((sum, m) => sum + (m.marketing || 0) + (m.it || 0) + (m.founder || 0) + (m.hire || 0), 0),
          finalCash: parsedData.monthly[parsedData.monthly.length - 1]?.cash || 0,
          totalUsers: (parsedData.users[parsedData.users.length - 1]?.['Free Users'] || 0) + 
                     (parsedData.users[parsedData.users.length - 1]?.['Freemium Users'] || 0) + 
                     (parsedData.users[parsedData.users.length - 1]?.['Enterprise Users'] || 0),
          // full sheet for financials tab
          financialSheetRows: parsedData.financialSheetRows || []
        }
        
        setData(transformedData)
        setError(null)
        console.info('✅ Dashboard loaded successfully! (Live data)')
      } catch (e) {
        console.warn('⚠️ Excel loading failed, using mock data:', e)
        setData(generateMockData())
        setError('Demo mode - Excel file not found')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const generateMockData = () => {
    const months = ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26']
    
    return {
      revenueData: months.map((month, index) => ({
        month,
        revenue: 5000 + (index * 9000),
        cashFlow: -15000 + (index * 6200),
        cashBalance: 100000 + (index * 13000)
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
      totalUsers: 45200
    }
  }

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '€0'
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`
    return `€${Math.round(value)}`
  }

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return '0'
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }

  // Loading screen
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #111827, #374151, #111827)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #374151',
            borderTop: '3px solid #3B82F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading ConsultantCloud Dashboard...</p>
        </div>
      </div>
    )
  }

  // Error screen
  if (!data) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom right, #111827, #374151, #111827)',
        color: 'white',
        padding: '32px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: '#EF4444', fontSize: '32px', marginBottom: '16px' }}>Dashboard Error</h1>
          <p style={{ marginBottom: '16px' }}>Unable to load data. Check console for details.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Main dashboard
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #111827, #374151, #111827)',
      color: 'white'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="https://www.consultantcloud.io/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <img src="/assets/consultantcloud-logo-full.png" alt="ConsultantCloud" style={{ height: 64, width: 'auto', display: 'block' }} />
            </a>
            <div style={{ display: 'flex', gap: '32px' }}>
              {['overview', 'financials', 'personas', 'about'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: activeTab === tab ? 'white' : '#9CA3AF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab) {
                      e.target.style.color = 'white'
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab) {
                      e.target.style.color = '#9CA3AF'
                      e.target.style.background = 'transparent'
                    }
                  }}
                >
                  {tab === 'about' ? 'About me' : tab === 'personas' ? 'Personas' : tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Error Banner */}
        {error && (
          <div style={{
            background: 'rgba(251, 191, 36, 0.2)',
            border: '1px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#FCD34D', fontSize: '14px', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {activeTab === 'personas' && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Personas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{
                background: 'linear-gradient(to bottom right, #374151, #1F2937)',
                border: '1px solid #374151',
                borderRadius: 16,
                padding: 24
              }}>
                <h3 style={{ marginTop: 0, marginBottom: 12 }}>B2B Sales Persona</h3>
                <ul style={{ color: '#D1D5DB', lineHeight: 1.6, paddingLeft: 18 }}>
                  <li><strong>Role:</strong> Head of Enablement / RevOps / PS Lead in SMB–Mid Market consultancies.</li>
                  <li><strong>Goals:</strong> Ramp new hires faster; standardize delivery; reduce billable ramp time.</li>
                  <li><strong>Pain:</strong> Fragmented learning, inconsistent quality, limited time for coaching.</li>
                  <li><strong>Buying Drivers:</strong> Proven outcomes, time‑to‑value, easy rollout, budget‑friendly.</li>
                </ul>
                <h4 style={{ marginTop: 16, marginBottom: 8 }}>B2B Sales Strategy</h4>
                <ul style={{ color: '#D1D5DB', lineHeight: 1.6, paddingLeft: 18 }}>
                  <li><strong>Outbound:</strong> Target SI partners, boutiques, agencies with problem‑solution messaging.</li>
                  <li><strong>Partnerships:</strong> Community groups (Admin/Architect), events (Irish Dreamin’), podcasts.</li>
                  <li><strong>Pilot Offers:</strong> Team trials, enablement packs, manager dashboards.</li>
                  <li><strong>Pricing:</strong> Tiered seats with annual discounts; PO/invoice support.</li>
                  <li><strong>KPIs:</strong> Trials→paid conversion, time‑to‑first‑cert, seat expansion, NPS.</li>
                </ul>
              </div>

              <div style={{
                background: 'linear-gradient(to bottom right, #374151, #1F2937)',
                border: '1px solid #374151',
                borderRadius: 16,
                padding: 24
              }}>
                <h3 style={{ marginTop: 0, marginBottom: 12 }}>B2C Persona</h3>
                <ul style={{ color: '#D1D5DB', lineHeight: 1.6, paddingLeft: 18 }}>
                  <li><strong>Profile:</strong> Career switchers and junior admins/consultants pursuing certs.</li>
                  <li><strong>Goals:</strong> Land role upgrades, pass certs, build portfolio confidence.</li>
                  <li><strong>Pain:</strong> Info overload, expensive prep, lack of structured path.</li>
                  <li><strong>Motivation:</strong> Community, practical guides, quick wins, mentor signals.</li>
                </ul>
                <h4 style={{ marginTop: 16, marginBottom: 8 }}>B2C Sales Strategy</h4>
                <ul style={{ color: '#D1D5DB', lineHeight: 1.6, paddingLeft: 18 }}>
                  <li><strong>Acquisition:</strong> SEO content, Learning Hub, newsletter, social micro‑demos.</li>
                  <li><strong>Activation:</strong> Guided paths, checklists, practice exams, streaks.</li>
                  <li><strong>Monetization:</strong> Freemium→Pro (mock exams, toolkits), student discounts.</li>
                  <li><strong>Community:</strong> Study circles, office hours, shareable progress.</li>
                  <li><strong>KPIs:</strong> Signup→activation, WAU, cert pass rate, retention.</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '48px 0', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '60px',
            fontWeight: '800',
            marginBottom: '16px',
            background: 'linear-gradient(to right, #60A5FA, #34D399, #FB923C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 16px 0'
          }}>
            Financial Dashboard
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', margin: 0 }}>36-Month Financial Planning & Analysis</p>
        </section>

        {activeTab === 'about' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
              <div>
                <h2 style={{ marginTop: 0, marginBottom: 12, textTransform: 'none' }}>build cool things, help people.</h2>
                <p style={{ color: '#D1D5DB' }}>
                  I studied chemistry, started in compliance, and honestly thought my future would involve lab coats, spreadsheets, and maybe saving the world one regulation at a time. Instead, a sharp left turn landed me in a Dublin tech start‑up called Social Talent, just as they were about to roll out Salesforce.
                </p>
                <p style={{ color: '#D1D5DB' }}>
                  With no budget, no playbook, and definitely no clue, I suddenly found myself as an accidental admin tasked with making SteelBrick CPQ and DocuSign work for 50 users. Imagine being told: “Here’s a rocket ship. You’ve never flown one before, but please get it into orbit by next Tuesday.”
                </p>
                <p style={{ color: '#D1D5DB' }}>
                  It was pure sink‑or‑swim — and after a lot of flailing, Googling, and muttering at my laptop, I discovered something unexpected: I actually loved it. That trial by fire lit the spark that became my career in Salesforce.
                </p>
                <p style={{ color: '#D1D5DB' }}>
                  From there, I moved into consultancy, joining Bluewave and working with some of the best mentors in the ecosystem. They taught me the value of curiosity, asking questions, and learning by doing. I also learned another important consultant skill: how to look calm while silently panicking inside a client workshop. Later, I struck out on my own as a freelancer, delivering projects across industries and spotting the same theme everywhere: talented people eager to grow, but struggling with a fragmented, expensive, and often overwhelming learning journey.
                </p>
                <p style={{ color: '#D1D5DB' }}>
                  Community has always been the difference. As co‑leader of the{' '}
                  <a href="https://trailblazercommunitygroups.com/salesforce-admin-group-dublin-ireland/?utm_source=chatgpt.com" target="_blank" rel="noreferrer" style={{ color: '#60A5FA' }}>Salesforce Admin Group in Dublin</a>{' '}and co‑founder of{' '}
                  <a href="https://irishdreamin.ie/about-us/?utm_source=chatgpt.com" target="_blank" rel="noreferrer" style={{ color: '#60A5FA' }}>Irish Dreamin’</a>, I’ve seen how shared knowledge and collaboration can accelerate careers. Sitting with others, trading tips, or simply hearing “yep, I broke that flow too” — that’s where the magic happens.
                </p>
                <p style={{ color: '#D1D5DB' }}>
                  That experience inspired me to build{' '}
                  <a href="https://www.consultantcloud.io/" target="_blank" rel="noreferrer" style={{ color: '#60A5FA' }}>ConsultantCloud.io</a>. The goal is simple: to give Salesforce professionals the kind of structured, supportive resource I wish I’d had starting out. ConsultantCloud curates high‑quality study guides, practice exams, Chrome extensions, blogs, and podcasts — plus a growing set of community‑driven features. Whether you’re an Admin, Consultant, or Architect, the platform is designed to make certification and career growth simpler, faster, and more accessible.
                </p>
                <p style={{ color: '#D1D5DB' }}>
                  For me, it all comes back to one mantra: <strong>build cool things, help people.</strong> That’s what this ecosystem gave me, and it’s what ConsultantCloud aims to give back.
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <img src="/assets/about-irish-dreamin.jpeg" alt="Irish Dreamin Presentation" style={{ maxWidth: '100%', height: 'auto', borderRadius: 12, border: '1px solid #374151' }} />
              </div>
            </div>
          </section>
        )}

        

        {activeTab === 'overview' && (
          <>
            {/* Metrics Grid */}
            <section style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '24px', 
              marginBottom: '48px' 
            }}>
          {[
            { title: 'Total Revenue (36 months)', value: formatCurrency(data.totalRevenue), color: '#34D399' },
            { title: 'Total Expenses (36 months)', value: formatCurrency(data.totalExpenses), color: '#60A5FA' },
            { title: 'Net Cash Flow (36 months)', value: formatCurrency(data.totalRevenue - data.totalExpenses), color: '#FB923C' },
            { title: 'Total Users (Dec 2028)', value: formatNumber(data.totalUsers), color: '#34D399' }
          ].map((metric, index) => (
            <div key={index} style={{
                  background: 'linear-gradient(to bottom right, #374151, #1F2937)',
                  border: '1px solid #374151',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(to right, #3B82F6, #10B981)'
                  }}></div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: metric.color, marginBottom: '8px' }}>
                    {metric.value}
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {metric.title}
                  </div>
                </div>
              ))}
            </section>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '48px' }}>
              {/* Revenue Chart */}
              <div style={{
                background: 'linear-gradient(to bottom right, #374151, #1F2937)',
                border: '1px solid #374151',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: 'white', margin: '0 0 24px 0' }}>
                  Revenue & Cash Flow Trends
                </h3>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenueData.slice(0, 12)}>
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
                </div>
              </div>

          {/* User Distribution (feature-flagged) */}
          <div style={{
            background: 'linear-gradient(to bottom right, #374151, #1F2937)',
            border: '1px solid #374151',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: 'white', margin: '0 0 24px 0' }}>
              User Distribution
            </h3>
            <div style={{ width: '100%', height: '300px' }}>
              {getChartVariant() === 'chartjs' ? (
                <ModernPieChart data={data.userDistribution} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.userDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {data.userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatNumber(value), '']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
            </div>

            {/* Success message is now only printed to console */}
          </>
        )}

        {activeTab === 'financials' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Full Financial Plan</h3>
              <a href="/data/consultantcloud_36m_financial_plan.xlsx" target="_blank" rel="noreferrer" style={{ color: '#60A5FA' }}>Open original</a>
            </div>
            <div style={{
              overflow: 'auto',
              maxHeight: '70vh',
              border: '1px solid #374151',
              borderRadius: 12,
              background: 'linear-gradient(to bottom right, #111827, #1F2937)'
            }}>
              <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%', color: '#E5E7EB' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    {(data.financialSheetRows?.[0] || []).map((h, i) => (
                      <th key={i} style={{
                        position: i === 0 ? 'sticky' : 'static',
                        left: i === 0 ? 0 : 'auto',
                        background: '#1F2937',
                        borderBottom: '1px solid #374151',
                        padding: '10px 12px',
                        textAlign: i === 0 ? 'left' : 'right',
                        fontWeight: 600,
                        fontSize: 12,
                        color: '#9CA3AF'
                      }}>{h || (i === 0 ? 'index' : '')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.financialSheetRows?.slice(1).map((row, rIdx) => {
                    const rowLabel = row?.[0] ?? ''
                    const isUserRow = typeof rowLabel === 'string' && rowLabel.toLowerCase().includes('users')
                    const isCurrencyRow = typeof rowLabel === 'string' && (rowLabel.includes('€') || /revenue|marketing|wage|supplier|it/i.test(rowLabel))
                    return (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} style={{
                          position: cIdx === 0 ? 'sticky' : 'static',
                          left: cIdx === 0 ? 0 : 'auto',
                          background: cIdx === 0 ? '#111827' : 'transparent',
                          borderBottom: '1px solid #374151',
                          padding: '8px 12px',
                          whiteSpace: 'nowrap',
                          textAlign: cIdx === 0 ? 'left' : 'right',
                          fontVariantNumeric: 'tabular-nums'
                        }}>
                          {cIdx === 0
                            ? (cell ?? '')
                            : (typeof cell === 'number'
                                ? (isUserRow ? formatNumber(cell) : (isCurrencyRow ? formatCurrency(cell) : cell.toLocaleString()))
                                : (cell ?? ''))}
                        </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        borderTop: '1px solid #374151',
        padding: '24px',
        textAlign: 'center',
        color: '#9CA3AF'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span>Made with ❤️ in Brussels | made by</span>
          <a href="https://www.consultantcloud.io/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img src="/assets/consultantcloud-logo-full.png" alt="ConsultantCloud" style={{ height: 36, width: 'auto', display: 'block' }} />
          </a>
        </div>
      </footer>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        body { 
          margin: 0; 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
        }
        
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}
