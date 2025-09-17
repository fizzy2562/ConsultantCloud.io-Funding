import * as XLSX from 'xlsx'

function coerceNumber(v) {
  if (v == null || v === '') return 0
  if (typeof v === 'number') return v
  const n = Number(String(v).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function validateSheetData(rows, requiredLabels, sheetName = 'Financial Plan') {
  if (!rows || rows.length < 2) {
    throw new Error(`${sheetName} sheet is empty or has insufficient data`)
  }

  const labels = rows.slice(1).map(r => r[0]).filter(Boolean)
  const missingLabels = requiredLabels.filter(label => !labels.includes(label))

  if (missingLabels.length > 0) {
    throw new Error(`Missing required rows in ${sheetName}: ${missingLabels.join(', ')}`)
  }

  const header = rows[0].slice(1).filter(Boolean)
  if (header.length < 12) {
    throw new Error(`${sheetName} should have at least 12 months of data`)
  }

  return { labels, header }
}

export async function parseWorkbook(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to load workbook (${res.status}): ${res.statusText}`)
    }
    const ab = await res.arrayBuffer()
    const wb = XLSX.read(ab, { type: 'array' })

    const fp = wb.Sheets['Financial Plan']
    if (!fp) throw new Error('Sheet "Financial Plan" not found in workbook')

    const rows = XLSX.utils.sheet_to_json(fp, { header: 1 })

    const requiredLabels = [
      'Free Users', 'Freemium Users', 'Enterprise Users',
      'Opening Funding Balance €', 'Total Revenue €', 'Marketing €',
      'IT Supplier (Dev/Hosting) €', 'Founder Wage €', 'New Hire Wage €'
    ]

    const { labels, header } = validateSheetData(rows, requiredLabels)

    const idx = (name) => labels.findIndex((l) => l === name)
    const getRow = (name) => rows[idx(name) + 1] || []

    const months = header

    // Users
    const free = getRow('Free Users')
    const freemium = getRow('Freemium Users')
    const enterprise = getRow('Enterprise Users')

    const users = months.map((m, i) => ({
      month: m,
      'Free Users': coerceNumber(free[i + 1]),
      'Freemium Users': coerceNumber(freemium[i + 1]),
      'Enterprise Users': coerceNumber(enterprise[i + 1]),
    }))

    // Financials
    const openingFunding = coerceNumber(getRow('Opening Funding Balance €')[1])
    const totalRevenue = getRow('Total Revenue €')
    const marketing = getRow('Marketing €')
    const it = getRow('IT Supplier (Dev/Hosting) €')
    const founder = getRow('Founder Wage €')
    const hire = getRow('New Hire Wage €')

    let cash = openingFunding
    const monthly = months.map((m, i) => {
      const rev = coerceNumber(totalRevenue[i + 1])
      const expMarketing = coerceNumber(marketing[i + 1])
      const expIt = coerceNumber(it[i + 1])
      const expFounder = coerceNumber(founder[i + 1])
      const expHire = coerceNumber(hire[i + 1])
      const expenses = expMarketing + expIt + expFounder + expHire
      const net = rev - expenses
      cash += net
      return {
        month: m,
        totalRevenue: rev,
        marketing: expMarketing,
        it: expIt,
        founder: expFounder,
        hire: expHire,
        net,
        cash: Math.max(0, Math.round(cash)),
      }
    })

    // Summary sheet
    const summary = wb.Sheets['Summary']
    let metrics = { openingFunding }
    if (summary) {
      const srows = XLSX.utils.sheet_to_json(summary, { header: 1 })
      const findVal = (label) => {
        const row = srows.find((r) => r[0] === label)
        return row ? row[1] : undefined
      }
      metrics = {
        ...metrics,
        breakevenMonth: findVal('Breakeven Month'),
        lowestCashMonth: findVal('Lowest Cash Month'),
        lowestCashBalance: coerceNumber(findVal('Lowest Cash Balance €')),
        endingCashDec28: coerceNumber(findVal('Ending Cash Dec-28 €')),
      }
    }

    return { months, users, monthly, metrics }
  } catch (error) {
    console.error('Error parsing workbook:', error)
    throw error
  }
}

