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

const directResearchSources = [
  {
    year: '2024',
    claim: 'Salesforce economy will create 11.6M jobs and $2.02T in business revenues (2022-2028) powered by AI',
    source: 'Salesforce Press Release (IDC Study)',
    href: 'https://www.salesforce.com/news/stories/idc-salesforce-economy-ai/'
  },
  {
    year: '2024',
    claim: 'AI-powered cloud solutions expected to generate $948B in 2028 (triple from 2022)',
    source: 'Salesforce Ben (IDC Report)',
    href: 'https://www.salesforceben.com/salesforce-economy-to-create-11-6m-jobs-between-2022-and-2028-says-idc/'
  },
  {
    year: '2021',
    claim: 'Salesforce ecosystem will generate $6.19 for every $1 Salesforce makes by 2026',
    source: 'Salesforce Press Release (IDC Study)',
    href: 'https://www.salesforce.com/news/press-releases/2021/09/20/idc-salesforce-economy-2021/'
  },
  {
    year: '2021',
    claim: 'Salesforce economy created 9.3 million jobs and $1.6 trillion by 2026',
    source: 'Salesforce Press Release (IDC Study)',
    href: 'https://www.salesforce.com/news/press-releases/2021/09/20/idc-salesforce-economy-2021/'
  },
  {
    year: '2019',
    claim: '4.2 million new jobs and $1.2 trillion in business revenues (2019-2024)',
    source: 'Salesforce Press Release (IDC Study)',
    href: 'https://investor.salesforce.com/press-releases/press-release-details/2019/New-Research-Finds-The-Salesforce-Economy-Will-Create-More-than-1-Trillion-in-New-Business-Revenues-and-42-Million-Jobs-between-2019-and-2024/default.aspx'
  },
  {
    year: '2017',
    claim: 'Ecosystem expected to generate $5.18 for every $1 Salesforce makes by 2022',
    source: 'Salesforce Press Release (IDC Study)',
    href: 'https://investor.salesforce.com/news/news-details/2017/Salesforce-Releases-New-Research-on-the-Salesforce-Economy----Creating-33-Million-New-Jobs-and-859-Billion-in-New-Business-Revenues-Worldwide-by-2022/default.aspx'
  }
]

const supplementaryResearchSources = [
  {
    year: '2025',
    claim: '48+ Salesforce certifications available, ranging from $75-$6000',
    source: 'Apex Hours',
    href: 'https://www.apexhours.com/salesforce-certifications/'
  },
  {
    year: '2025',
    claim: 'Salesforce professionals with certifications earn 25% more than non-certified peers',
    source: 'JanBask Training',
    href: 'https://www.janbasktraining.com/blog/demand-of-salesforce-certifications/'
  },
  {
    year: '2025',
    claim: 'Demand for Salesforce professionals outstrips supply by 10:1 ratio',
    source: 'JanBask Training',
    href: 'https://www.janbasktraining.com/blog/demand-of-salesforce-certifications/'
  },
  {
    year: '2025',
    claim: 'Average salary ranges: Admin ($90K-$140K), Developer ($100K-$178K+), Architect ($180K-$220K)',
    source: 'CX Today Career Guide',
    href: 'https://www.cxtoday.com/crm/the-ultimate-salesforce-career-guide-for-2025-jobs-salaries-certifications/'
  },
  {
    year: '2025',
    claim: 'Online education market expected to reach $203.81B in 2025, growing at 8.20% CAGR',
    source: 'eLearning Statistics',
    href: 'https://elearningstats.education/'
  },
  {
    year: '2025',
    claim: 'Mobile learning boosts productivity by 43%, with 45% faster completion and 45% better retention',
    source: 'eLearning Statistics',
    href: 'https://elearningstats.education/'
  },
  {
    year: '2025',
    claim: '93% of businesses will adopt eLearning in 2025 to boost engagement and ROI',
    source: 'eLearning Statistics',
    href: 'https://elearningstats.education/'
  }
]

const tableWrapperStyle = {
  background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
  borderRadius: 8,
  padding: 16,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  overflowX: 'auto'
}

function SourcesTable({ title, data, compact = false }) {
  const headingFontSize = compact ? 11 : 12
  const bodyFontSize = compact ? 13 : 14
  const bodyLineHeight = compact ? 1.5 : 1.6

  return (
    <div style={tableWrapperStyle}>
      <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: compact ? 11 : 12, fontWeight: 600, color: '#94A3B8' }}>{title}</h3>
      <div style={{ width: '100%', maxWidth: '100%' }}>
        <table style={{ width: '100%', maxWidth: '100%', borderCollapse: 'collapse', color: '#E5E7EB', minWidth: 600 }}>
          <thead>
            <tr>
              {['Year', 'Claim', 'Source', 'Link'].map((heading) => (
                <th
                  key={heading}
                  style={{
                    textAlign: heading === 'Claim' ? 'left' : 'center',
                    padding: '12px 16px',
                    fontSize: headingFontSize,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    color: '#9CA3AF',
                    borderBottom: '1px solid #374151',
                    background: '#1F2937',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={`${entry.year}-${entry.source}-${index}`}>
                <td style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #374151', fontWeight: 600, fontSize: bodyFontSize }}>
                  {entry.year}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #374151', lineHeight: bodyLineHeight, fontSize: bodyFontSize }}>
                  {entry.claim}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #374151', fontSize: bodyFontSize }}>
                  {entry.source}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #374151', fontSize: bodyFontSize }}>
                  <a href={entry.href} target="_blank" rel="noreferrer" style={{ color: '#60A5FA' }}>
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isSmall, setIsSmall] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)

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

    const onResize = () => setIsSmall(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <a href="https://www.consultantcloud.io/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <img src="/assets/consultantcloud-logo-full.png" alt="ConsultantCloud" style={{ height: 64, width: 'auto', display: 'block' }} />
            </a>
            <div role="tablist" aria-label="Dashboard Sections" style={{ display: 'flex', gap: isSmall ? 12 : 32, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              {['overview', 'financials', 'personas', 'about', 'sources'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: activeTab === tab ? 'white' : '#9CA3AF',
                    border: 'none',
                    padding: '12px 16px',
                    minHeight: 44,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  role="tab"
                  aria-selected={activeTab === tab}
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
                  {tab === 'about'
                    ? 'About me'
                    : tab === 'personas'
                      ? 'Personas'
                      : tab === 'sources'
                        ? 'Sources'
                        : tab}
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
            <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: isSmall ? 16 : 24 }}>
              <div style={{
                background: 'linear-gradient(to bottom right, #374151, #1F2937)',
                border: '1px solid #374151',
                borderRadius: 16,
                padding: 24
              }}>
                <div style={{ textAlign: 'center' }}>
                  <img loading="lazy" src="/assets/persona-b2b.png" alt="B2B Persona" style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                </div>
                <h3 style={{ marginTop: 0, marginBottom: 12 }}>B2B Sales Persona</h3>
                <ul style={{ color: '#D1D5DB', lineHeight: 1.6, paddingLeft: 18 }}>
                  <li><strong>Role:</strong> Head of Enablement / RevOps / PS Lead in SMB–Mid‑Market Salesforce consultancies.</li>
                  <li><strong>Goals:</strong>
                    <ul style={{ marginTop: 6 }}>
                      <li>Ramp new hires 2–3× faster</li>
                      <li>Standardize delivery & quality</li>
                      <li>Reduce billable ramp‑time & shadowing needs</li>
                    </ul>
                  </li>
                  <li><strong>Pains:</strong>
                    <ul style={{ marginTop: 6 }}>
                      <li>Fragmented, inconsistent learning</li>
                      <li>Expensive bench time</li>
                      <li>Limited bandwidth for coaching/mentoring</li>
                    </ul>
                  </li>
                  <li><strong>Buying Drivers:</strong>
                    <ul style={{ marginTop: 6 }}>
                      <li>Proven outcomes + benchmarks (time‑to‑cert, reduced ramp cost)</li>
                      <li>Easy rollout (no heavy lift, admin‑friendly)</li>
                      <li>Budget‑friendly vs. external trainers</li>
                    </ul>
                  </li>
                  <li><strong>Preferred Proof:</strong> Case studies, peer referrals, team dashboards</li>
                </ul>
                <h4 style={{ marginTop: 16, marginBottom: 8 }}>B2B Sales Strategy</h4>
                <ul style={{ color: '#D1D5DB', lineHeight: 1.6, paddingLeft: 18 }}>
                  <li><strong>Outbound:</strong> Target boutique SIs, agencies, and mid‑tier partners.</li>
                  <li><strong>Partnerships:</strong> Community groups (Admin/Architect), events (Irish Dreamin’), guest podcasts/webinars.</li>
                  <li><strong>Pilot Offers:</strong> Team trials, enablement starter packs, manager dashboards showing progress.</li>
                  <li><strong>Pricing:</strong> Tiered seat bundles, annual discounts, PO/invoice support.</li>
                  <li><strong>KPIs:</strong> Trial→Paid conversion, Avg. Time‑to‑First Cert, Seat Expansion, Manager NPS.</li>
                </ul>
              </div>

              <div style={{
                background: 'linear-gradient(to bottom right, #374151, #1F2937)',
                border: '1px solid #374151',
                borderRadius: 16,
                padding: 24
              }}>
                <div style={{ textAlign: 'center' }}>
                  <img loading="lazy" src="/assets/persona-b2c.png" alt="B2C Persona" style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                </div>
                <h3 style={{ marginTop: 0, marginBottom: 12 }}>B2C Persona</h3>
                <ul style={{ color: '#D1D5DB', lineHeight: 1.6, paddingLeft: 18 }}>
                  <li><strong>Profile:</strong> Career switchers + junior Admins/Consultants pursuing first or next Salesforce cert.</li>
                  <li><strong>Goals:</strong>
                    <ul style={{ marginTop: 6 }}>
                      <li>Land first Salesforce role or upgrade job</li>
                      <li>Pass Admin/Consultant certs on first attempt</li>
                      <li>Build confidence with practical exercises & portfolio projects</li>
                    </ul>
                  </li>
                  <li><strong>Pains:</strong>
                    <ul style={{ marginTop: 6 }}>
                      <li>Overwhelmed by scattered blogs/YouTube</li>
                      <li>High cost of bootcamps & official prep</li>
                      <li>Unsure if they’re “ready” for interviews/certs</li>
                    </ul>
                  </li>
                  <li><strong>Motivations:</strong>
                    <ul style={{ marginTop: 6 }}>
                      <li>Clear, step‑by‑step study paths</li>
                      <li>Quick wins (badges, streaks, checklists)</li>
                      <li>Community validation + mentorship signals</li>
                    </ul>
                  </li>
                </ul>
                <h4 style={{ marginTop: 16, marginBottom: 8 }}>B2C Sales Strategy</h4>
                <ul style={{ color: '#D1D5DB', lineHeight: 1.6, paddingLeft: 18 }}>
                  <li><strong>Acquisition:</strong> SEO blog content, free Learning Hub, newsletter growth loops, TikTok/LinkedIn micro‑demos.</li>
                  <li><strong>Activation:</strong> Guided learning paths, checklists, practice exams, gamified streaks.</li>
                  <li><strong>Monetization:</strong> Freemium→Pro (mock exams, toolkits, AI‑powered study buddy), student/early‑career discounts.</li>
                  <li><strong>Community:</strong> Peer study circles, office hours, shareable “I passed!” progress cards.</li>
                  <li><strong>KPIs:</strong> Signup→Activation Rate, WAU, Cert Pass Rate uplift, Retention (renewals, streaks kept).</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Hero Section (hidden on About/Personas/Sources) */}
        {!(activeTab === 'about' || activeTab === 'personas' || activeTab === 'sources') && (
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
        )}

        {activeTab === 'about' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: isSmall ? 16 : 24, alignItems: 'start' }}>
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
                <img loading="lazy" src="/assets/about-irish-dreamin.jpeg" alt="Irish Dreamin Presentation" style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover', borderRadius: 12, border: '1px solid #374151' }} />
              </div>
            </div>
          </section>
        )}

        {activeTab === 'sources' && (
          <section style={{ marginBottom: '48px', maxWidth: '100%', width: '100%', padding: '24px 16px', overflowX: 'hidden' }}>
            <h2 style={{ marginTop: 0, marginBottom: 32, textTransform: 'none', fontSize: 24, fontWeight: 600, textAlign: 'center' }}>
              ConsultantCloud - Supporting Research Sources
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr',
              gap: isSmall ? 16 : 32,
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 16px'
            }}>
              <SourcesTable title="Direct Salesforce Research" data={directResearchSources} />
              <SourcesTable title="Supplementary Research Sources" data={supplementaryResearchSources} compact />
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
            <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '2fr 1fr', gap: isSmall ? 16 : 32, marginBottom: '48px' }}>
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
            <div style={{
              marginTop: 16,
              background: 'linear-gradient(to bottom right, #111827, #1F2937)',
              border: '1px solid #374151',
              borderRadius: 12,
              padding: 16,
              color: '#E5E7EB'
            }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>📊 ConsultantCloud — Key SaaS Metrics</div>
              <div style={{ lineHeight: 1.7, fontVariantNumeric: 'tabular-nums' }}>
                <div>Total Users (Jan 2026 → Dec 2028): 230 → 8,600</div>
                <div>Enterprise Users (Dec 2028): 2,000</div>
                <div>Freemium Users (Dec 2028): 600</div>
                <div>CAGR (Users, 2026–2028): 234% per year</div>
                <div>ARR (Annual Recurring Revenue, 2028): ~€708K</div>
                <div>Enterprise ARR: €600K</div>
                <div>Freemium ARR: ~€108K</div>
                <div>MRR (Monthly Recurring Revenue, Dec 2028): ~€59K</div>
                <div>Monthly ARPU (All Users, Dec 2028): €6.86</div>
                <div>Enterprise ARPU: €25/user/month</div>
                <div>Freemium ARPU: €14.99/user/month</div>
                <div>Net Cash Flow (36 months): +€465K</div>
                <div>Cash Runway (with €50K funding + reserves): Sustainable through 36 months with €497K ending balance</div>
                <div>Breakeven: Achieved well before end of projection (positive net cash flow average by Year 2)</div>
              </div>
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
