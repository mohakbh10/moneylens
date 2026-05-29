import { Card, CardContent } from "@/components/ui/card";

type Props = {
    title: string;
    value: string;
    color?: string;
};

export default function SummaryCard({
    title,
    value,
    color,
}: Props) {
    return (
        <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
            {title}
            </p>

            <h2
            className="text-3xl font-bold mt-2"
            style={{ color }}
            >
            {value}
            </h2>
        </CardContent>
        </Card>
    );
}