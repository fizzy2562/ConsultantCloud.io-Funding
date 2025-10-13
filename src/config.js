export function getChartVariant() {
  try {
    const url = new URL(window.location.href)
    const qp = url.searchParams.get('chart')
    const ls = window.localStorage.getItem('chartVariant')
    const env = import.meta?.env?.VITE_CHART_VARIANT
    const val = (qp || ls || env || 'chartjs').toLowerCase()
    return val === 'recharts' ? 'recharts' : 'chartjs'
  } catch {
    return 'chartjs'
  }
}

