import { createClient } from "@/lib/supabase/server";

export default async function TestSupabasePage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .limit(1);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Prueba de Supabase
      </h1>

      <pre className="mt-4">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}