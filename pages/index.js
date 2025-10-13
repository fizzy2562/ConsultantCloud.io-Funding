import Head from 'next/head'
import { loadFinancialPlan } from '../lib/financialPlan'

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
    claim: 'Average salary ranges: Admin (€90K-€140K), Developer (€100K-€178K+), Architect (€180K-€220K)',
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

function formatCurrency(euroValue) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(Math.round(euroValue))
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IE').format(Math.round(value))
}

export default function Home({ plan }) {
  const { monthly, users, metrics } = plan

  const totals = monthly.reduce(
    (acc, item) => {
      acc.revenue += item.revenue
      acc.expenses += item.expenses
      return acc
    },
    { revenue: 0, expenses: 0 }
  )

  const latestUsers = users[users.length - 1]
  const totalUsers = latestUsers.free + latestUsers.freemium + latestUsers.enterprise

  return (
    <>
      <Head>
        <title>ConsultantCloud Funding Plan</title>
        <meta
          name="description"
          content="Full static view of ConsultantCloud.io's 36 month funding plan, including revenue ramp, expense mix, user growth, and research sources."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <main>
        <section className="hero">
          <p className="tagchips" aria-label="Tags">
            <span className="tagchip">Static Export</span>
            <span className="tagchip">Funding Narrative</span>
            <span className="tagchip">Salesforce Ecosystem</span>
          </p>
          <h1 className="hero__title">ConsultantCloud Funding Readiness Kit</h1>
          <p className="hero__subtitle">
            Every figure on this page is rendered at build-time so search engines, copilots, and investors have immediate access to
            the entire 36-month plan. Scroll for the full financial schedule, user growth curve, and source library that backs the
            assumptions.
          </p>
        </section>

        <section className="grid grid--summary" aria-label="Headline metrics">
          <article className="card">
            <div className="card__label">Total revenue (36 months)</div>
            <div className="card__value">{formatCurrency(totals.revenue)}</div>
            <p className="card__context">Revenue compounds on product-led growth tied to certifications and enterprise adoption.</p>
          </article>
          <article className="card">
            <div className="card__label">Total operating spend</div>
            <div className="card__value">{formatCurrency(totals.expenses)}</div>
            <p className="card__context">Marketing, engineering, founder and hiring costs mapped month-by-month with zero hidden rows.</p>
          </article>
          <article className="card">
            <div className="card__label">Ending cash</div>
            <div className="card__value">{formatCurrency(monthly[monthly.length - 1].cash)}</div>
            <p className="card__context">Starting from an opening balance of {formatCurrency(metrics.openingFunding)} and tracked after every net cash flow.</p>
          </article>
          <article className="card">
            <div className="card__label">Users at scale</div>
            <div className="card__value">{formatNumber(totalUsers)}</div>
            <p className="card__context">
              Breakdown: {formatNumber(latestUsers.free)} free, {formatNumber(latestUsers.freemium)} freemium, {formatNumber(latestUsers.enterprise)} enterprise.
            </p>
          </article>
        </section>

        <section className="section" aria-labelledby="financial-schedule">
          <header className="section__header">
            <h2 id="financial-schedule">Financial Schedule</h2>
            <p className="section__description">
              The complete 36-month schedule is provided below, including revenue, expense categories, net cash flow, and ending cash balance
              per month. Because the data is pre-rendered, downstream tools can extract the series without executing JavaScript.
            </p>
          </header>

          <div className="table-wrapper" role="region" aria-live="polite">
            <table>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Revenue</th>
                  <th scope="col">Marketing</th>
                  <th scope="col">IT / Dev</th>
                  <th scope="col">Founder</th>
                  <th scope="col">New Hire</th>
                  <th scope="col">Net Cash Flow</th>
                  <th scope="col">Ending Cash</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{formatCurrency(row.revenue)}</td>
                    <td>{formatCurrency(row.marketing)}</td>
                    <td>{formatCurrency(row.it)}</td>
                    <td>{formatCurrency(row.founder)}</td>
                    <td>{formatCurrency(row.hire)}</td>
                    <td>{formatCurrency(row.net)}</td>
                    <td>{formatCurrency(row.cash)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" aria-labelledby="user-growth">
          <header className="section__header">
            <h2 id="user-growth">User Growth Path</h2>
            <p className="section__description">
              Volume-focused acquisition fuels a three-tier funnel: free learning paths, freemium AI copilots, and enterprise deployments. The
              table highlights run-rate milestones for each cohort.
            </p>
          </header>

          <div className="table-wrapper" role="region">
            <table>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Free Users</th>
                  <th scope="col">Freemium Users</th>
                  <th scope="col">Enterprise Users</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {users.map((row) => {
                  const total = row.free + row.freemium + row.enterprise
                  return (
                    <tr key={`users-${row.month}`}>
                      <td>{row.month}</td>
                      <td>{formatNumber(row.free)}</td>
                      <td>{formatNumber(row.freemium)}</td>
                      <td>{formatNumber(row.enterprise)}</td>
                      <td>{formatNumber(total)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section" aria-labelledby="narrative-highlights">
          <header className="section__header">
            <h2 id="narrative-highlights">Narrative Highlights</h2>
            <p className="section__description">
              Key notes distilled from the operating model to surface fundraising talking points alongside their supporting data.
            </p>
          </header>

          <div className="grid">
            <article className="card">
              <div className="card__label">Breakeven Month</div>
              <div className="card__value">{metrics.breakevenMonth ?? 'TBC'}</div>
              <p className="card__context">
                Path to profitability is modelled directly from operating costs and growth rates captured in the schedule.
              </p>
            </article>
            <article className="card">
              <div className="card__label">Lowest cash point</div>
              <div className="card__value">{metrics.lowestCashMonth ?? '—'}</div>
              <p className="card__context">
                Minimum cash reserve of {formatCurrency(metrics.lowestCashBalance || 0)} informs the fundraising ask and buffer.
              </p>
            </article>
            <article className="card">
              <div className="card__label">Ending cash (Dec-28)</div>
              <div className="card__value">{formatCurrency(metrics.endingCashDec28 || 0)}</div>
              <p className="card__context">Reaches scale with positive cash balance while continuing to invest in product and enablement.</p>
            </article>
          </div>
        </section>

        <section className="section" aria-labelledby="direct-sources">
          <header className="section__header">
            <h2 id="direct-sources">Primary Research Citations</h2>
            <p className="section__description">
              Evidence underpinning Salesforce ecosystem growth assumptions is catalogued for diligence-ready referencing.
            </p>
          </header>

          <div className="sources-grid">
            {directResearchSources.map((item) => (
              <article key={`${item.year}-${item.source}`} className="source-card">
                <span className="source-card__year">{item.year}</span>
                <p className="source-card__claim">{item.claim}</p>
                <span className="source-card__source">{item.source}</span>
                <a href={item.href} target="_blank" rel="noreferrer">View Source</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="supplementary-sources">
          <header className="section__header">
            <h2 id="supplementary-sources">Supplementary Market Proof</h2>
            <p className="section__description">
              Certification demand, learning outcomes, and salary data framing the addressable market for ConsultantCloud.io.
            </p>
          </header>

          <div className="sources-grid">
            {supplementaryResearchSources.map((item) => (
              <article key={`${item.year}-${item.source}`} className="source-card">
                <span className="source-card__year">{item.year}</span>
                <p className="source-card__claim">{item.claim}</p>
                <span className="source-card__source">{item.source}</span>
                <a href={item.href} target="_blank" rel="noreferrer">View Source</a>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export async function getStaticProps() {
  const plan = loadFinancialPlan()

  return {
    props: {
      plan
    }
  }
}
