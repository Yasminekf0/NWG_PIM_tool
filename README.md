# NWG Product Hub

Mock internal product information manager for Nordic Well Group.

**Live at: [nwg-pim-tool.vercel.app](https://nwg-pim-tool.vercel.app/)**

## What it does

Loads all 50 Wellvita products from a CSV, displays them in a three-panel interface, lets you edit product fields, and generates AI-enriched content (SEO title, meta description, product bullets) for each product using Groq's Llama 3.3 model. Updated data can be exported back to CSV.

## Stack

- Next.js 15 + TypeScript
- Tailwind CSS + shadcn/ui
- Papaparse for CSV parsing
- Groq API (llama-3.3-70b-versatile) for content generation
- Deployed on Vercel

## Features

- Reads and parses product data from CSV including nested rich-text JSON descriptions
- Three-panel layout: product list with search, editable product detail, AI enrichment panel
- Edit any product field inline and save to local state
- Generate SEO title, meta description, and bullet points per product in English
- Export all products (including edits) back to CSV

## Setup
```bash
git clone https://github.com/Yasminekf0/NWG_PIM_tool
cd NWG_PIM_tool
npm install
```

Create `.env.local` in the project root:
```
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

Get a free key at [console.groq.com](https://console.groq.com).
```bash
npm run dev
```

Open `http://localhost:3000`.

## Project structure
```
app/
  page.tsx              # root layout, loads CSV, manages state
components/
  header.tsx            # top navigation bar
  product-list.tsx      # left panel — searchable product list
  product-detail.tsx    # center panel — editable product fields + export
  ai-enrichment.tsx     # right panel — Groq API call + generated content
lib/
  parseProducts.ts      # CSV fetch, parse, and JSON description extractor
  generateContent.ts    # Groq API call and prompt
public/
  product-data.csv      # source product data
```
