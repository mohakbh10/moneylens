"use client";
import { useRouter } from "next/navigation";
import { Upload, History, Wallet } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getStatementHistory, getInsights } from "@/lib/api";
import type { StatementHistoryItem } from "@/types/statement";
import { Skeleton } from "@/components/ui/skeleton";
import FadeIn from "@/components/animations/FadeIn";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import LatestStatementCard from "@/components/dashboard/LatestStatementCard";
import RecentStatements from "@/components/dashboard/RecentStatements";

type Insight = {
  total_income: number;
  total_expense: number;
  net_savings: number;
  top_category: string;
  largest_expense: number;
  largest_expense_description: string;
  transaction_count: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [latestStatement, setLatestStatement] =
    useState<StatementHistoryItem | null>(null);
  const [statements, setStatements] = useState<StatementHistoryItem[]>([]);
  const [latestInsight, setLatestInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
      setLoading(true);
      setError("");
      try {
        const uploads = await getStatementHistory();
        setStatements(uploads);
        if (uploads.length > 0) {
          const latest = uploads[0];
          setLatestStatement(latest);
          const insight = await getInsights(latest.id);
          setLatestInsight(insight);
        }
      } catch {
        console.error("Failed to load dashboard");
        setError("Unable to load your dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-60 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={loadData}>Try again</Button>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back 👋</h1>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s an overview of your financial activity.
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <QuickActionCard
            title="Upload Statement"
            description="Analyze a new bank statement."
            icon={Upload}
            onClick={() => router.push("/dashboard/uploads")}
          />
          <QuickActionCard
            title="Statement History"
            description="Browse previous analyses."
            icon={History}
            onClick={() => router.push("/dashboard/uploads")}
          />
          <QuickActionCard
            title="Budget Planner"
            description="Manage monthly budgets."
            icon={Wallet}
            onClick={() => {
              if (latestStatement) {
                router.push(`/dashboard/insights/${latestStatement.id}`);
              }
            }}
          />
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-5">Latest Statement</h2>
        <LatestStatementCard
          latestStatement={latestStatement}
          latestInsight={latestInsight}
          onViewAnalysis={(id) => router.push(`/dashboard/insights/${id}`)}
          onUploadNew={() => router.push("/dashboard/uploads")}
        />

        <RecentStatements
          statements={statements}
          onViewAll={() => router.push("/dashboard/uploads")}
          onViewStatement={(id) => router.push(`/dashboard/insights/${id}`)}
        />
      </div>
    </FadeIn>
  );
}
