# 💸 MoneyLens

> MoneyLens is an AI-powered personal finance dashboard that transforms PDF bank statements into structured transactions, intelligent financial insights, AI-generated summaries, and personalized spending recommendations.

MoneyLens helps users understand where their money goes by automatically extracting transactions from bank statements, categorizing expenses using AI, and presenting spending insights through an intuitive dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)
![Gemini](https://img.shields.io/badge/Google-Gemini-blue)

🌐 **Live Demo:** Coming Soon

📽 **Demo Video:** Coming Soon

---

# 📑 Table of Contents

- Features
- Highlights
- Financial Insights
- AI Assistant
- Budget Planner
- Dashboard
- System Architecture
- Tech Stack
- Project Structure
- Processing Pipeline
- Backend API
- Example Insight
- Screenshots
- Getting Started
- Environment Variables
- Deployment
- Completed Features
- Future Improvements
- What I Learned
- Why MoneyLens?
- Author
- License

---

# ✨ Highlights

- 🤖 AI-powered transaction extraction from PDF bank statements
- 📄 Automatic transaction parsing & categorization
- 💰 Interactive financial insights dashboard
- 💬 AI financial assistant powered by Gemini
- 💵 Monthly budget planner
- 🔒 Secure authentication with Supabase
- ⚡ Full-stack architecture using Next.js + FastAPI

---

# 🚀 Features

## 🔐 Authentication

- Secure user authentication with Supabase Auth
- Protected dashboard routes
- User-specific financial data

---

## 📄 Statement Upload

- Upload PDF bank or credit card statements
- Secure storage using Supabase Storage
- Upload history
- Delete uploaded statements

---

## 🤖 AI-powered Transaction Processing

- PDF text extraction
- AI-powered transaction parsing
- Automatic merchant detection
- Credit & debit identification
- Transaction normalization

---

## 🏷️ AI-powered Categorization

Transactions are automatically categorized into:

- Food
- Shopping
- Bills
- Entertainment
- Education
- Transport
- Transfer
- Income
- Others

Powered by **Google Gemini 2.5 Flash**.

---

# 📊 Financial Insights

MoneyLens automatically generates:

- 💰 Total Income
- 💸 Total Expenses
- 📈 Net Savings
- 🏆 Top Spending Category
- 💳 Largest Expense
- 📑 Transaction Count
- 🤖 AI Financial Summary
- 💡 Personalized AI Recommendations

---

# 💬 AI Assistant

Ask questions about your spending, including:

- "Where did I spend the most?"
- "How can I reduce expenses?"
- "Summarize my statement."
- "How much did I spend on shopping?"
- "What's my biggest transaction?"

Responses are generated using Google Gemini AI.

---

# 💵 Budget Planner

- Create monthly category budgets
- Compare planned vs actual spending
- Budget management dashboard
- Secure per-user budget storage

---

# 📈 Dashboard

The dashboard includes:

- Quick Actions
- Latest Statement Overview
- KPI Cards
- AI Summary
- Spending Overview
- Recent Transactions
- Statement History
- Financial Snapshot
- Upload History

---

# 🏗️ System Architecture

```text
                Next.js Frontend
                        │
                        ▼
             Supabase Authentication
                        │
                        ▼
               Upload PDF Statement
                        │
                        ▼
             Supabase Storage Bucket
                        │
                        ▼
                FastAPI Backend
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
 PDF Text Extraction             Google Gemini AI
        │                               │
        └───────────────┬───────────────┘
                        ▼
             Transaction Processing
                        ▼
          PostgreSQL (Supabase Database)
                        ▼
            Dashboard & Financial Insights
```

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- Sonner Toasts

### Backend

- FastAPI
- Python
- Pydantic
- pdfplumber

### Database & Storage

- Supabase PostgreSQL
- Supabase Storage
- Supabase Authentication

### AI

- Google Gemini 2.5 Flash

---

# 📂 Project Structure

```text
MoneyLens/

frontend/
│
├── app/
│   ├── dashboard/
│   ├── login/
│   └── ...
│
├── components/
├── hooks/
├── lib/
├── types/
└── ...

backend/
│
├── routes/
├── services/
├── models/
├── dependencies/
├── helpers/
└── ...
```

---

# ⚙️ Processing Pipeline

```text
Upload PDF
      │
      ▼
Supabase Storage
      │
      ▼
uploads table
      │
      ▼
FastAPI Backend
      │
      ▼
Extract PDF Text
      │
      ▼
Gemini AI extracts transactions
      │
      ▼
Transactions stored in PostgreSQL
      │
      ▼
Gemini categorizes transactions
      │
      ▼
Generate Financial Insights
      │
      ▼
Dashboard + AI Assistant
```

---

# 🌐 Backend API

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/process-statement` | Runs the complete statement processing pipeline |
| GET | `/uploads` | Retrieve the current user's uploaded statements |
| GET | `/transactions/{upload_id}` | Retrieve extracted transactions |
| GET | `/insights/{upload_id}` | Retrieve generated financial insights |
| POST | `/ai-summary` | Generate or retrieve an AI financial summary |
| POST | `/ai-recommendations` | Generate or retrieve AI spending recommendations |
| POST | `/ask-ai` | Chat with your financial data |
| GET | `/budgets` | Retrieve monthly budgets |
| POST | `/budgets` | Create or update budgets |
| GET | `/statement-history` | Retrieve the current user's statement history |
| DELETE | `/statements/{upload_id}` | Delete a statement and its associated analysis |

---

# 📈 Example Insight

```text
Income            ₹3,038

Expense           ₹2,888.76

Net Savings       ₹149.24

Top Category      Transfer

Largest Expense   ₹1,459

Transactions      15
```

---

# 📸 Screenshots

> *(To be added after deployment)*

- Login
- Dashboard
- Upload Statement
- AI Summary
- AI Chat
- Budget Planner
- Statement History
- Insights Dashboard

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/yourusername/moneylens.git
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

---

# 🔑 Environment Variables

## Frontend

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_API_URL=
```

## Backend

```env
SUPABASE_URL=

SUPABASE_KEY=

GEMINI_API_KEY=
```

---

# 🔐 Security and Data Isolation

- **Supabase Auth:** Users authenticate with Supabase; the frontend uses only the public anon key.
- **FastAPI verification:** Protected API requests include the Supabase access token. FastAPI verifies its claims and uses the authenticated user ID for every user-scoped operation.
- **Statement ownership:** Every active endpoint that receives an upload ID confirms the statement belongs to the authenticated user before it reads, processes, sends data to AI, or deletes it.
- **PostgreSQL RLS:** Row Level Security isolates uploads, transactions, insights, budgets, and chat messages to their owner or to records linked to an owned upload.
- **Private Storage:** Bank statements stay in the private `bank-statements` bucket. Storage policies limit access to objects whose first path segment is the authenticated user's ID.
- **Secrets:** `GEMINI_API_KEY` and any Supabase service-role key remain backend-only. Never expose them through `NEXT_PUBLIC_*` variables or commit local environment files.

Configure `FRONTEND_ORIGIN` in the backend environment with the exact deployed frontend origin. Local development continues to allow `http://localhost:3000`.

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Railway / Render |
| Database | Supabase |
| Storage | Supabase Storage |
| AI | Google Gemini |

---

# ✅ Completed Features

- Authentication
- PDF Upload
- Secure File Storage
- PDF Text Extraction
- AI Transaction Parsing
- AI Transaction Categorization
- Financial Insight Generation
- AI Financial Summary
- AI Chat Assistant
- Budget Planner
- Dashboard
- Statement History
- Delete Statements
- Recent Transactions
- Loading Skeletons
- Toast Notifications
- Protected Backend APIs

---

# 🔮 Future Improvements

- Interactive charts
- Monthly trend analysis
- CSV / Excel export
- Advanced transaction search
- Filters & sorting
- Multi-bank statement support
- Spending forecasts
- Recurring payment detection
- Investment insights
- Mobile optimization
- Dark mode
- Docker deployment

---

# 📚 What I Learned

Building MoneyLens gave me hands-on experience with:

- Full-stack application architecture
- Next.js App Router
- FastAPI backend development
- REST API design
- PostgreSQL data modeling
- Supabase Authentication & Storage
- Google Gemini AI integration
- AI-powered document processing
- Component-driven React development
- TypeScript best practices

---

# 🎯 Why MoneyLens?

Most banking applications simply display transactions.

MoneyLens goes a step further by transforming raw financial data into meaningful insights using AI, helping users better understand their spending habits, identify trends, and make smarter financial decisions.

---

# 👨‍💻 Author

**Mohak Bhattacharya**

Computer Science Engineering Student

KIIT University

GitHub: https://github.com/mohakbh10

LinkedIn: https://www.linkedin.com/in/mohak-bhattacharya-a74184285/

---

# 📄 License

This project was built for educational and portfolio purposes.
