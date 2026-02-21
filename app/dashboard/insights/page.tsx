import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InsightsPage() {
    return (
        <div className="space-y-8">

        <div>
            <h1 className="text-3xl font-bold">AI Insights</h1>
            <p className="text-muted-foreground">
            Understand your financial behavior.
            </p>
        </div>

        {/* AI Summary Card */}
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Monthly Summary</h2>

            <div className="space-y-2 text-sm">
                <p>• Your spending increased 18% compared to last month.</p>
                <p>• Food delivery is your highest expense category.</p>
                <p>• Subscriptions cost you ₹1,200 this month.</p>
            </div>
            </CardContent>
        </Card>

        {/* Ask AI Section */}
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Ask about your spending</h2>

            <div className="flex gap-2">
                <Input placeholder="Why was my spending high this month?" />
                <Button>Ask</Button>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
                AI response will appear here.
            </div>
            </CardContent>
        </Card>

        </div>
    );
}