"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStatementHistory } from "@/lib/api";

export default function InsightsPage() {
    const router = useRouter();

    useEffect(() => {
        async function redirectToLatestInsight() {
            try {
                const statements = await getStatementHistory();
                const destination = statements[0]
                    ? `/dashboard/insights/${statements[0].id}`
                    : "/dashboard/uploads";

                router.replace(destination);
            } catch {
                router.replace("/dashboard/uploads");
            }
        }

        redirectToLatestInsight();
    }, [router]);

    return null;
}
