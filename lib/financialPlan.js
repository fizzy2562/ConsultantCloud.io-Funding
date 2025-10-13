import fs from 'fs'
import path from 'path'
import * as XLSX from 'xlsx'

function coerceNumber(value) {
  if (value == null || value === '') return 0
  if (typeof value === 'number') return value
  const normalised = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(normalised) ? normalised : 0
}

function validateSheetData(rows, requiredLabels, sheetName) {
  if (!rows || rows.length < 2) {
    throw new Error(`${sheetName} sheet is empty or has insufficient data`)
  }

  const labels = rows.slice(1).map((row) => row[0]).filter(Boolean)
  const missing = requiredLabels.filter((label) => !labels.includes(label))

  if (missing.length > 0) {
    throw new Error(`Missing required rows in ${sheetName}: ${missing.join(', ')}`)
  }

  const header = rows[0].slice(1).filter(Boolean)
  if (header.length < 12) {
    throw new Error(`${sheetName} should have at least 12 months of data`)
  }

  return { labels, header }
}

export function loadFinancialPlan() {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'consultantcloud_36m_financial_plan.xlsx')
  const buffer = fs.readFileSync(dataPath)
  const workbook = XLSX.read(buffer, { type: 'buffer' })

  const financialSheet = workbook.Sheets['Financial Plan']
  if (!financialSheet) {
    throw new Error('Sheet "Financial Plan" not found in workbook')
  }

  const financialRows = XLSX.utils.sheet_to_json(financialSheet, { header: 1 })

  const requiredLabels = [
    'Free Users',
    'Freemium Users',
    'Enterprise Users',
    'Opening Funding Balance €',
    'Total Revenue €',
    'Marketing €',
    'IT Supplier (Dev/Hosting) €',
    'Founder Wage €',
    'New Hire Wage €'
  ]

  const { labels, header } = validateSheetData(financialRows, requiredLabels, 'Financial Plan')

  const rowFor = (name) => financialRows[labels.indexOf(name) + 1] || []
  const months = header

  // Users
  const users = months.map((month, index) => ({
    month,
    free: coerceNumber(rowFor('Free Users')[index + 1]),
    freemium: coerceNumber(rowFor('Freemium Users')[index + 1]),
    enterprise: coerceNumber(rowFor('Enterprise Users')[index + 1])
  }))

  // Financials
  const openingFunding = coerceNumber(rowFor('Opening Funding Balance €')[1])
  const totalRevenueRow = rowFor('Total Revenue €')
  const marketingRow = rowFor('Marketing €')
  const itRow = rowFor('IT Supplier (Dev/Hosting) €')
  const founderRow = rowFor('Founder Wage €')
  const hireRow = rowFor('New Hire Wage €')

  let rollingCash = openingFunding
  const monthly = months.map((month, index) => {
    const revenue = coerceNumber(totalRevenueRow[index + 1])
    const marketing = coerceNumber(marketingRow[index + 1])
    const it = coerceNumber(itRow[index + 1])
    const founder = coerceNumber(founderRow[index + 1])
    const hire = coerceNumber(hireRow[index + 1])
    const expenses = marketing + it + founder + hire
    const net = revenue - expenses
    rollingCash += net
    return {
      month,
      revenue,
      marketing,
      it,
      founder,
      hire,
      expenses,
      net,
      cash: Math.max(0, Math.round(rollingCash))
    }
  })

  const summarySheet = workbook.Sheets['Summary']
  let metrics = {
    openingFunding,
    breakevenMonth: null,
    lowestCashMonth: null,
    lowestCashBalance: null,
    endingCashDec28: null
  }
  if (summarySheet) {
    const summaryRows = XLSX.utils.sheet_to_json(summarySheet, { header: 1 })
    const findValue = (label) => {
      const entry = summaryRows.find((row) => row[0] === label)
      return entry ? entry[1] : undefined
    }

    metrics = {
      ...metrics,
      breakevenMonth: findValue('Breakeven Month') ?? null,
      lowestCashMonth: findValue('Lowest Cash Month') ?? null,
      lowestCashBalance: coerceNumber(findValue('Lowest Cash Balance €') ?? 0),
      endingCashDec28: coerceNumber(findValue('Ending Cash Dec-28 €') ?? 0)
    }
  }

  return {
    months,
    users,
    monthly,
    metrics,
    financialSheetRows: financialRows
  }
}
