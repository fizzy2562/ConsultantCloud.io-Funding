# 🚀 ConsultantCloud — Financial Analytics Dashboard

<div align="center">

![ConsultantCloud](https://img.shields.io/badge/ConsultantCloud-Financial%20Analytics-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgM0gyMVY5SDNWM1oiIGZpbGw9IiMzQjgyRjYiLz4KPHBhdGggZD0iTTMgMTFIMjFWMjFIM1YxMVoiIGZpbGw9IiMxMEI5ODEiLz4KPC9zdmc+)

**Enterprise-Grade Financial Analytics Dashboard**
*Interactive 36-Month Planning & Visualization Platform*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Dashboard-green?style=for-the-badge)](https://fundingatconsultantcloud-io.onrender.com/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-3.2.1-FF6B6B?style=flat)](https://recharts.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-38B2AC?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ✨ Dashboard Overview

Transform your financial data into compelling visual narratives with ConsultantCloud's premium analytics dashboard. Built for **Series A presentations**, **investor meetings**, and **executive reporting**.

### 🎯 Key Features

- **🌙 Premium Dark Theme** — Professional glassmorphism design with gradient accents
- **📊 Interactive Visualizations** — 6 chart types with hover effects and animations
- **💰 Financial Intelligence** — Revenue, expenses, cash flow, and user analytics
- **📱 Fully Responsive** — Optimized for desktop, tablet, and mobile presentations
- **⚡ Real-time Processing** — Client-side Excel parsing with instant visualization updates
- **🎨 Investor-Ready** — Professional styling designed for funding presentations

---

## 🖼️ Dashboard Showcase

### **Hero Section & Navigation**
![Dashboard Hero](https://via.placeholder.com/800x400/1F2937/FFFFFF?text=Dark+Theme+Hero+Section+with+Gradient+Title)
*Professional dark theme with gradient branding and tab-based navigation*

### **Financial Metrics Cards**
![Metrics Grid](https://via.placeholder.com/800x300/374151/FFFFFF?text=Interactive+Metric+Cards+with+Hover+Effects)
*Real-time KPIs with status indicators and performance comparisons*

### **Revenue & Cash Flow Analytics**
![Revenue Charts](https://via.placeholder.com/800x400/1F2937/FFFFFF?text=Area+Charts+for+Revenue+and+Cash+Flow+Trends)
*Interactive area charts with gradient fills and professional tooltips*

### **Distribution Analysis**
![Distribution Charts](https://via.placeholder.com/800x300/374151/FFFFFF?text=Pie+Charts+for+User+and+Expense+Distribution)
*User segmentation and expense breakdown with custom color schemes*

### **36-Month Projections**
![Projection Timeline](https://via.placeholder.com/800x400/1F2937/FFFFFF?text=Comprehensive+36-Month+Financial+Projections)
*Complete trend analysis with multiple data series and milestone tracking*

---

## 📊 Chart Types & Visualizations

| Chart Type | Purpose | Features |
|------------|---------|----------|
| **📈 Area Charts** | Revenue & Cash Flow Trends | Gradient fills, interactive tooltips |
| **🥧 Pie Charts** | User & Expense Distribution | Custom colors, percentage labels |
| **📊 Bar Charts** | Monthly Cash Balance | Professional styling, hover effects |
| **📉 Line Charts** | 36-Month Projections | Multi-series, trend analysis |
| **⏱️ Timeline** | Business Milestones | Interactive markers, status tracking |
| **💳 Metric Cards** | Key Performance Indicators | Real-time updates, status badges |

---

## 🚀 Quick Start

### **1. Clone & Install**
```bash
git clone https://github.com/fizzy2562/ConsultantCloud.io-Funding.git
cd ConsultantCloud.io-Funding
npm install
```

### **2. Local Development**
```bash
npm run dev
# Dashboard available at http://localhost:5173
```

### **3. Add Your Financial Data**
Place your Excel file at `public/data/consultantcloud_36m_financial_plan.xlsx`

### **4. Build for Production**
```bash
npm run build
# Optimized build created in dist/
```

---

## 📋 Excel Data Format

The dashboard expects a specific Excel structure for optimal visualization:

### **Financial Plan Sheet**
| Row Label | Jan-26 | Feb-26 | ... | Dec-28 |
|-----------|--------|--------|-----|--------|
| Free Users | 100 | 150 | ... | 3000 |
| Freemium Users | 50 | 75 | ... | 2000 |
| Enterprise Users | 10 | 15 | ... | 500 |
| Total Revenue € | 5000 | 7500 | ... | 50000 |
| Marketing € | 2000 | 2500 | ... | 8000 |
| IT Supplier € | 1000 | 1200 | ... | 5000 |
| Founder Wage € | 3000 | 3000 | ... | 5000 |
| New Hire Wage € | 0 | 0 | ... | 15000 |

### **Summary Sheet**
| Metric | Value |
|--------|-------|
| Breakeven Month | Month 18 |
| Lowest Cash Month | Month 12 |
| Lowest Cash Balance € | 15000 |
| Ending Cash Dec-28 € | 250000 |

---

## 🔧 Technical Architecture

### **Frontend Stack**
- **React 19.1.1** — Modern UI framework with hooks and context
- **Vite 7.1.2** — Lightning-fast build tool and dev server
- **TailwindCSS 4.1.13** — Utility-first CSS with custom design system
- **Recharts 3.2.1** — Composable charting library built on D3

### **Data Processing**
- **SheetJS (xlsx)** — Client-side Excel parsing and validation
- **Custom Data Pipeline** — Transforms Excel data into chart-ready formats
- **Real-time Calculations** — Aggregates, percentages, and trend analysis

### **Performance Optimizations**
- **Code Splitting** — Separate chunks for React, charts, and Excel processing
- **Component Memoization** — Optimized re-renders with React.memo
- **Responsive Images** — Adaptive layouts for all screen sizes
- **Bundle Analysis** — Optimized build size with manual chunk configuration

---

## 🌐 Deployment Options

### **Render (Recommended)**
1. Connect your GitHub repository to Render
2. Configure build settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Deploy automatically on every push

### **Vercel / Netlify**
```bash
npm run build
# Upload dist/ folder to your preferred static hosting
```

### **Custom Server**
```bash
npm run build
# Serve dist/ folder with any static file server
```

---

## 💼 Use Cases

### **💰 Series A Funding**
- Professional investor presentations
- Financial projection visualization
- Growth trajectory demonstration
- Cash runway analysis

### **📈 Executive Reporting**
- Board meeting dashboards
- Quarterly business reviews
- Strategic planning sessions
- Performance tracking

### **👥 Stakeholder Communication**
- Team alignment on financial goals
- Progress tracking and milestones
- Scenario planning and modeling
- Investment thesis validation

---

## 🛠️ Customization

### **Branding & Colors**
Update the color scheme in `src/App.jsx`:
```javascript
const colors = {
  revenue: '#10b981',     // Emerald green
  marketing: '#f97316',   // Orange
  it: '#8b5cf6',          // Purple
  // ... customize your brand colors
}
```

### **Chart Configuration**
Modify chart types and styling in the respective components:
- Area charts for trend analysis
- Pie charts for distribution
- Bar charts for comparative data
- Line charts for projections

### **Metric Cards**
Add new KPIs by extending the MetricCard components with:
- Custom icons and colors
- Performance indicators
- Trend arrows and percentages
- Interactive hover effects

---

## 📞 Support & Contributing

### **🐛 Issues**
Found a bug or have a feature request? [Open an issue](https://github.com/fizzy2562/ConsultantCloud.io-Funding/issues)

### **🤝 Contributing**
We welcome contributions! Please read our contributing guidelines and submit pull requests.

### **📧 Contact**
For enterprise inquiries or custom implementations, reach out through the dashboard contact form.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Financial Analytics**

[![GitHub stars](https://img.shields.io/github/stars/fizzy2562/ConsultantCloud.io-Funding?style=social)](https://github.com/fizzy2562/ConsultantCloud.io-Funding)
[![GitHub forks](https://img.shields.io/github/forks/fizzy2562/ConsultantCloud.io-Funding?style=social)](https://github.com/fizzy2562/ConsultantCloud.io-Funding/fork)

[Live Demo](https://fundingatconsultantcloud-io.onrender.com/) • [Documentation](https://github.com/fizzy2562/ConsultantCloud.io-Funding/wiki) • [Issues](https://github.com/fizzy2562/ConsultantCloud.io-Funding/issues)

</div>