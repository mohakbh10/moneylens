# 💸 MoneyLens

> AI-powered personal finance dashboard that transforms raw bank statements into meaningful financial insights.

MoneyLens automatically extracts transactions from uploaded bank statements, categorizes them using AI, and generates spending insights through a modern dashboard.

---

## Features

### Authentication
- User authentication with Supabase Auth
- Protected dashboard routes

### Statement Upload
- Upload PDF bank statements
- Secure file storage using Supabase Storage
- Upload history

### AI Transaction Processing
- PDF text extraction
- AI-powered transaction parsing
- Automatic credit/debit detection
- Merchant extraction

### AI Categorization
Transactions are automatically categorized into categories such as:

- Food
- Bills
- Shopping
- Entertainment
- Education
- Transfer
- Income
- Transport
- Others

Powered by Google Gemini.

### Financial Insights

For every uploaded statement MoneyLens generates:

- Total Income
- Total Expense
- Net Savings
- Top Spending Category
- Largest Expense
- Transaction Count

### Dashboard

Current dashboard includes:

- KPI cards
- Spending overview
- Recent transactions
- Upload history

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide Icons

## Backend

- FastAPI
- Python

## Database

- Supabase PostgreSQL
- Supabase Storage
- Supabase Authentication

## AI

- Google Gemini

---

# Project Structure

```
MoneyLens/

frontend/
│
├── app/
│   ├── dashboard/
│   ├── login/
│   └── ...
│
├── components/
├── lib/
└── ...

backend/
│
├── routes/
├── services/
├── helpers/
├── models/
└── ...
```

---

# Current Pipeline

```
Upload PDF

        ↓

Supabase Storage

        ↓

uploads table

        ↓

FastAPI

        ↓

Extract raw text

        ↓

AI extracts transactions

        ↓

Transactions stored

        ↓

AI categorizes transactions

        ↓

Insights generated

        ↓

Dashboard
```

---

# Current APIs

## Processing

```
POST /process-statement
```

Runs the complete processing pipeline.

---

## Dashboard

```
GET /uploads
```

Returns uploaded statements.

```
GET /transactions/{upload_id}
```

Returns all extracted transactions.

```
GET /insights/{upload_id}
```

Returns generated insights.

---

# Example Insight

```
Income:            ₹3,038

Expense:           ₹2,888.76

Net Savings:       ₹149.24

Top Category:      Transfer

Largest Expense:   ₹1,459

Transactions:      15
```

---

# Screenshots

*(To be added)*

- Upload Dashboard
- Insights Dashboard
- Charts
- AI Summary

---

# Roadmap

## Completed

- [x] Authentication
- [x] PDF Upload
- [x] PDF Storage
- [x] Transaction Extraction
- [x] AI Categorization
- [x] Insight Generation
- [x] Dashboard APIs
- [x] Upload Dashboard
- [x] Dynamic Insights Page
- [x] Recent Transactions

---

## In Progress

- [ ] Charts
- [ ] AI-generated monthly summary
- [ ] Ask AI about spending
- [ ] Dashboard polish
- [ ] Landing page

---

## Future Improvements

- Server-side pagination
- Search & filter transactions
- CSV/Excel export
- Multi-bank statement support
- Budget tracking
- Monthly trend analysis
- Spending forecasts
- Recurring payment detection
- AI financial recommendations
- Mobile responsive optimization
- Dark mode
- Docker deployment

---

# Why MoneyLens?

Most banking applications simply display transactions.

MoneyLens focuses on helping users understand their financial behavior by combining document processing, AI-powered categorization, and intelligent financial insights into a single workflow.

---

# Author

Mohak Bhattacharya

Computer Science Engineering Student

KIIT University