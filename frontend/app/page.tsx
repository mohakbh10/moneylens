"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  CreditCard,
  ShieldCheck,
  Wallet,
  BarChart3,
  Sparkles,
  Database,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">

      {/* ================= Navbar ================= */}

      <nav className="border-b">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">

          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold whitespace-nowrap"
          >
            💸 MoneyLens
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">

            <a href="#features" className="hover:text-foreground transition">
              Features
            </a>

            <a href="#workflow" className="hover:text-foreground transition">
              Workflow
            </a>

            <a href="#tech" className="hover:text-foreground transition">
              Tech Stack
            </a>

          </div>

          <Link href="/login">
            <Button>
              Login
            </Button>
          </Link>

        </div>
      </nav>

      {/* ================= Hero ================= */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 -z-10">

          <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}

          <div>

            <span className="inline-flex items-center rounded-full border px-4 py-2 text-sm mb-6">

              <Sparkles className="mr-2 h-4 w-4" />

              AI Powered Finance

            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">

              Understand Your

              <span className="text-primary">

                {" "}Money

              </span>

              <br />

              Smarter.

            </h1>

            <p className="mt-6 sm:mt-8 text-base sm:text-lg text-muted-foreground max-w-xl leading-7 sm:leading-8">

              Upload your bank statement and let MoneyLens automatically
              extract transactions, categorize spending with AI,
              generate financial insights, and answer questions
              about your finances.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link href="/login">

                <Button size="lg">

                  Get Started

                  <ArrowRight className="ml-2 h-4 w-4" />

                </Button>

              </Link>

              <a
                href="https://github.com/yourusername/moneylens"
                target="_blank"
              >
                <Button
                  size="lg"
                  variant="outline"
                >
                  GitHub
                </Button>
              </a>

            </div>

          </div>

          {/* Dashboard Preview */}

          <div>

            <div className="rounded-3xl border bg-card shadow-xl p-5 sm:p-8">

              <h2 className="text-xl font-semibold">

                Financial Snapshot

              </h2>

              <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-4 mt-6 sm:mt-8">

                <div className="rounded-xl border p-5">

                  <p className="text-xs text-muted-foreground">

                    Income

                  </p>

                  <p className="text-2xl font-bold text-green-600">

                    ₹42,000

                  </p>

                </div>

                <div className="rounded-xl border p-5">

                  <p className="text-xs text-muted-foreground">

                    Expense

                  </p>

                  <p className="text-2xl font-bold text-red-500">

                    ₹31,500

                  </p>

                </div>

                <div className="rounded-xl border p-5">

                  <p className="text-xs text-muted-foreground">

                    Savings

                  </p>

                  <p className="text-2xl font-bold">

                    ₹10,500

                  </p>

                </div>

                <div className="rounded-xl border p-5">

                  <p className="text-xs text-muted-foreground">

                    Top Category

                  </p>

                  <p className="text-xl font-semibold">

                    Food 🍔

                  </p>

                </div>

              </div>

              <div className="rounded-xl border mt-6 p-5">

                <p className="font-medium">

                  AI Summary

                </p>

                <p className="text-sm text-muted-foreground mt-3 leading-7">

                  Your spending remained stable this month.
                  Dining expenses increased by 12%, while
                  shopping expenses decreased compared to last month.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= Features ================= */}

      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20"
      >

        <h2 className="text-3xl sm:text-4xl font-bold text-center">

          Everything You Need

        </h2>

        <p className="text-muted-foreground text-center mt-4">

          Powerful AI features designed to simplify personal finance.

        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10 sm:mt-14">

          <FeatureCard
            icon={<CreditCard className="h-8 w-8 text-primary" />}
            title="Upload Statements"
            description="Upload PDF bank or credit card statements securely with Supabase Storage."
          />

          <FeatureCard
            icon={<Brain className="h-8 w-8 text-primary" />}
            title="AI Processing"
            description="Google Gemini extracts, categorizes, and understands every transaction."
          />

          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-primary" />}
            title="Financial Insights"
            description="Instantly discover income, expenses, savings, spending trends, and AI recommendations."
          />

        </div>

      </section>

      {/* ================= Workflow ================= */}

      <section
        id="workflow"
        className="bg-muted/30 py-20"
      >

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <h2 className="text-3xl sm:text-4xl font-bold text-center">

            How MoneyLens Works

          </h2>

          <div className="grid md:grid-cols-5 gap-4 sm:gap-6 mt-10 sm:mt-14 text-center">

            {[
              "Upload PDF",
              "Extract Text",
              "AI Processing",
              "Generate Insights",
              "Dashboard",
            ].map((step) => (

              <div
                key={step}
                className="rounded-2xl border bg-card p-6"
              >

                <p className="font-semibold">

                  {step}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= Tech ================= */}

      <section
        id="tech"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20"
      >

        <h2 className="text-3xl sm:text-4xl font-bold text-center">

          Built With

        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-14">

          <TechCard icon={<Wallet />} title="Next.js" />
          <TechCard icon={<Database />} title="Supabase" />
          <TechCard icon={<Brain />} title="Gemini AI" />
          <TechCard icon={<ShieldCheck />} title="FastAPI" />

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">

        <div className="rounded-3xl border bg-card p-6 sm:p-12 text-center">

          <h2 className="text-3xl sm:text-4xl font-bold">

            Ready to Understand Your Spending?

          </h2>

          <p className="text-muted-foreground mt-5">

            Start analyzing your bank statements with AI in minutes.

          </p>

          <Link href="/login">

            <Button
              size="lg"
              className="mt-8"
            >

              Get Started

              <ArrowRight className="ml-2 h-4 w-4" />

            </Button>

          </Link>

        </div>

      </section>

      {/* ================= Footer ================= */}

      <footer className="border-t">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">

          <div>

            <h3 className="font-bold text-lg">

              💸 MoneyLens

            </h3>

            <p className="text-sm text-muted-foreground mt-2">

              AI-powered personal finance dashboard.

            </p>

          </div>

          <p className="text-sm text-muted-foreground">

            Built by Mohak Bhattacharya

          </p>

        </div>

      </footer>

    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-8 hover:-translate-y-1 hover:shadow-md transition-all">

      {icon}

      <h3 className="font-semibold text-xl mt-6">

        {title}

      </h3>

      <p className="text-muted-foreground mt-4 leading-7">

        {description}

      </p>

    </div>
  );
}

function TechCard({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-8 text-center hover:-translate-y-1 hover:shadow-md transition-all">

      <div className="flex justify-center mb-4">

        {icon}

      </div>

      <p className="font-semibold">

        {title}

      </p>

    </div>
  );
}
