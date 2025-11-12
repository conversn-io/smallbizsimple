# SmallBizSimple

Small business growth platform providing direct, easy-to-use tools for funding, tax credits, marketing, and lead generation.

## About

SmallBizSimple empowers small business owners across industries with practical tools and resources. We serve time-starved business owners who want clear, actionable support — not jargon or complexity.

**Tagline:** "Simple tools. Real growth."

## Tech Stack

- **Framework:** Next.js 15.4.6 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **CMS:** Publishare CMS
- **Deployment:** Vercel
- **CRM:** CallReady CRM
- **Lead Delivery:** GoHighLevel (GHL) Webhooks

## Content Pillars

1. **Business Funding** - Access to capital and financing options
2. **Tax Credits** - ERC and other tax credit programs (Primary Revenue Driver)
3. **Marketing Tools** - Lead generation and marketing resources
4. **Business Growth** - Strategies and tools for scaling
5. **Resources** - Guides, calculators, and educational content

## Brand Identity

- **Primary Color:** Midnight Blue (#1A1F36)
- **Secondary Color:** Blue (#2B4D79)
- **Accent Color:** Orange (#FF8C42)
- **Success Color:** Green (#4CAF50)
- **Background:** Soft Gray (#F5F7FA)
- **Text:** Charcoal (#333333)
- **Typography:** Inter (headlines), Open Sans (body), IBM Plex Sans (callouts)

## Getting Started

1. Clone the repository:
```bash
cd 02-Expansion-Operations-Planning/Publisher-Platforms/05-SmallBizSimple
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env-template-smallbizsimple.txt .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `env-template-smallbizsimple.txt` for required environment variables including:
- Supabase configuration
- Google Analytics 4
- Meta Pixel
- GoHighLevel webhooks
- OTP verification settings

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── api/         # API routes
│   │   ├── leads/   # Lead capture and OTP verification
│   │   └── ...
│   └── ...
├── components/       # React components
│   ├── navigation/  # Header, footer, menus
│   └── ui/          # Reusable UI components
├── lib/             # Utilities and configurations
│   ├── supabase.ts  # CMS Supabase client
│   ├── callready-quiz-db.ts  # CallReady CRM client
│   └── temp-tracking.ts  # Analytics tracking
├── contexts/        # React contexts
├── utils/           # Helper functions
└── styles/          # Additional styles
```

## Deployment

This project is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

## License

Proprietary - All rights reserved

