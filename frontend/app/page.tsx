import {supabase} from "@/lib/supabase";
export default function Home() {
  console.log(supabase);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">MoneyLens</h1>
      <p className="text-muted-foreground mt-2">
        See where your money really goes.
      </p>
    </main>
  );
}
