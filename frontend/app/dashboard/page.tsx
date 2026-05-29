import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
    return (
        <div className="space-y-8">

        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
            Here’s how your money moved this month.
            </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6">
            <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Total Spending</p>
                <h2 className="text-3xl font-bold mt-2 text-emerald-600">
                ₹12,400
                </h2>
            </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Top Category</p>
                <h2 className="text-2xl font-semibold mt-2">
                Food Delivery
                </h2>
            </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <h2 className="text-2xl font-semibold mt-2">
                28%
                </h2>
            </CardContent>
            </Card>
        </div>

        {/* Chart Placeholder */}
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-8">
            <div className="h-64 flex items-center justify-center text-muted-foreground">
                Spending Trend Chart (Coming Soon)
            </div>
            </CardContent>
        </Card>

        </div>
    );
}