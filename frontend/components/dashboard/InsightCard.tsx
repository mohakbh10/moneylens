import { Card, CardContent } from "@/components/ui/card";

type Props = {
  insight: string;
};

export default function InsightCard({ insight }: Props) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="p-5">
        <p className="text-sm leading-6">
          {insight}
        </p>
      </CardContent>
    </Card>
  );
}