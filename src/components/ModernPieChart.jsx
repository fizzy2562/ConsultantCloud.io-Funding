import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ModernPieChart({ data }) {
  const labels = data.map((d) => d.name)
  const values = data.map((d) => d.value)

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderColor: '#111827',
        borderWidth: 2,
        cutout: '65%',
        hoverOffset: 15,
      },
    ],
  }

  const fmt = (v) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`
    return `${v}`
  }

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#D1D5DB' },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${fmt(ctx.parsed)}`,
        },
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

