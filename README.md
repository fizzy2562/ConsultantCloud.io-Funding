# ConsultantCloud Funding Snapshot

Static, crawlable export of the ConsultantCloud.io 36-month financial plan. The site now ships complete HTML at build time so investors, search engines, and copilots can read the operating model without executing client-side JavaScript.

## Why This Rewrite
- **Static-first delivery:** All funding tables, user growth numbers, and research citations are rendered during the Next.js build.
- **Machine-friendly:** Structured HTML lets LLMs ingest the full dataset straight from the initial response.
- **Lightweight deployment:** `next export` produces a portable `out/` directory deployable to any static host (Render, Netlify, Vercel, S3, etc.).

## Getting Started

```bash
git clone https://github.com/fizzy2562/ConsultantCloud.io-Funding.git
cd ConsultantCloud.io-Funding
npm install
npm run dev
# Site available at http://localhost:3000
```

The Excel workbook powering the plan lives at `public/data/consultantcloud_36m_financial_plan.xlsx`. Modify or replace it before running `npm run dev`/`npm run export` to rebuild the static dataset.

## Available Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Launch a Next.js dev server with hot reloading. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build (useful for previews). |
| `npm run export` | Build and statically export the site to `out/`. |
| `npm run lint` | Run Next.js lint rules. |

## Architecture Notes
- `lib/financialPlan.js` parses the Excel workbook during `getStaticProps`, exposing monthly cash flow, user growth, and summary metrics.
- `pages/index.js` outputs semantic tables for financials and user cohorts plus citation grids for market research.
- Global styling lives in `styles/globals.css` and focuses on semantic readability over client-side animation.
- Static assets (logos, spreadsheets) remain under `public/` and are copied to the export output.

## Deployment (Render Static Site)

`render.yaml` already targets the static workflow:

- **Build Command:** `npm install && npm run export`
- **Publish Directory:** `out`

Any static host that can serve the exported directory will work.

## Contributing

Pull requests are welcome—especially improvements to accessibility, structured data, or additional build-time datasets. Open an issue first if you plan significant structural work.

---

Built with Next.js static export to keep ConsultantCloud funding data transparent and LLM-friendly.
