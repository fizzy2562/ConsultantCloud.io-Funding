# ConsultantCloud 36‑Month Funding Dashboard

Interactive static dashboard built with Vite + React + Recharts. It parses the attached Excel (`consultantcloud_36m_financial_plan.xlsx`) client‑side to visualize users, revenue, expenses, net cash flow, and cash balance.

## Local development

```bash
npm install
npm run dev
```

Place the workbook at `public/data/consultantcloud_36m_financial_plan.xlsx` (already added).

## Build

```bash
npm run build
```
Outputs to `dist/`.

## Deploy to Render (Static Site)

1. Push this folder to a Git repo.
2. In Render, Create New → Static Site.
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
3. Optionally keep `render.yaml` at repo root to enable auto‑config.

## Data format assumptions

Workbook sheets:
- `Financial Plan`: rows named `Free Users`, `Freemium Users`, `Enterprise Users`, `Opening Funding Balance €`, `Total Revenue €`, `Marketing €`, `IT Supplier (Dev/Hosting) €`, `Founder Wage €`, `New Hire Wage €` with month columns like `Jan-26` … `Dec-28`.
- `Summary`: `Breakeven Month`, `Lowest Cash Month`, `Lowest Cash Balance €`, `Ending Cash Dec-28 €`.

If you change labels, update selectors in `src/lib/parsePlan.js`.

