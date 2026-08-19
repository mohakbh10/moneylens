"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IndianRupee,
  Wallet,
  TrendingUp,
  Receipt,
  PieChart,
  ArrowLeft,
} from "lucide-react";

import {
  getInsights,
  getTransactions,
  getAISummary,
  getAIRecommendations,
} from "@/lib/api";

import { formatCurrency } from "@/lib/utils";
import SpendingPieChart from "@/components/dashboard/SpendingPieChart";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import AISummaryCard from "@/components/dashboard/AISummaryCard";
import FloatingChat from "@/components/dashboard/chat/FloatingChat";
import MonthlyTrendChart from "@/components/dashboard/MonthlyTrendChart";
import BudgetPlanner from "@/components/dashboard/budget/BudgetPlanner";
import AIRecommendationCard from "@/components/dashboard/AIRecommendationCard";
import { Skeleton } from "@/components/ui/skeleton";
import FadeIn from "@/components/animations/FadeIn";
import TransactionTable from "@/components/dashboard/TransactionTable";

type Insight = {
  total_income: number;
  total_expense: number;
  net_savings: number;
  top_category: string;
  largest_expense: number;
  largest_expense_description: string;
  transaction_count: number;
};

type Transaction = {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  transaction_type: string;
  category: string;
};

export default function InsightsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [insightData, transactionData] = await Promise.all([
          getInsights(id as string),
          getTransactions(id as string),
        ]);
        setInsight(insightData);
        setTransactions(transactionData);
      } catch {
        console.error("Failed to load statement insights");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const loadAIContent = async () => {
      try {
        const [summaryData, recommendationData] = await Promise.all([
          getAISummary(id as string),
          getAIRecommendations(id as string),
        ]);
        setSummary(summaryData.summary);
        setRecommendations(recommendationData.recommendations);
      } catch {
        console.error("Failed to load AI content");
      }
    };
    loadAIContent();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6 sm:space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-2xl font-semibold">Insight not found.</h2>
      </div>
    );
  }

  const statementDate =
    transactions.length > 0
      ? new Date(transactions[0].transaction_date)
      : null;

  const statementMonth = statementDate
    ? statementDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Statement";

  return (
    <FadeIn>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
        <button
          onClick={() => router.push("/dashboard/uploads")}
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={16} />
          Back to statements
        </button>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">{statementMonth} Insights</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered analysis of your {statementMonth} bank statement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-card border rounded-2xl p-5 shadow-sm min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <IndianRupee size={20} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mt-3 text-green-600 break-words">
              {formatCurrency(insight.total_income)}
            </h2>
          </div>

          <div className="bg-card border rounded-2xl p-5 shadow-sm min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Expense</p>
              <Wallet size={20} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mt-3 text-red-500 break-words">
              {formatCurrency(insight.total_expense)}
            </h2>
          </div>

          <div className="bg-card border rounded-2xl p-5 shadow-sm min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Net Savings</p>
              <TrendingUp size={20} />
            </div>
            <h2
              className={`text-2xl font-bold mt-3 ${
                insight.net_savings >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {formatCurrency(insight.net_savings)}
            </h2>
          </div>

          <div className="bg-card border rounded-2xl p-5 shadow-sm min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Transactions</p>
              <Receipt size={20} />
            </div>
            <h2 className="text-2xl font-bold mt-3">
              {insight.transaction_count}
            </h2>
          </div>
        </div>

        {summary && (
          <div className="mt-8">
            <AISummaryCard summary={summary} />
          </div>
        )}

        {recommendations && (
          <div className="mt-6">
            <AIRecommendationCard recommendations={recommendations} />
          </div>
        )}

        <div className="mt-7 mb-5">
          <h2 className="text-xl font-semibold">Spending Overview</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border rounded-2xl p-5 shadow-sm min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Top Spending Category
              </p>
              <PieChart size={20} />
            </div>
            <h2 className="text-2xl font-semibold mt-3 break-words">
              {insight.top_category}
            </h2>
          </div>

          <div className="bg-card border rounded-2xl p-5 shadow-sm min-w-0">
            <p className="text-sm text-muted-foreground">Largest Expense</p>
            <h2 className="text-2xl font-bold mt-3 break-words">
              {formatCurrency(insight.largest_expense)}
            </h2>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {insight.largest_expense_description}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-5">Spending Analytics</h2>
          <MonthlyTrendChart transactions={transactions} />
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SpendingPieChart transactions={transactions} />
            <IncomeExpenseChart
              income={insight.total_income}
              expense={insight.total_expense}
            />
          </div>
        </div>

        <BudgetPlanner transactions={transactions} />

        <div className="mt-10">
          <FloatingChat uploadId={id as string} />
        </div>

        <TransactionTable transactions={transactions} />
      </div>
    </FadeIn>
  );
}
