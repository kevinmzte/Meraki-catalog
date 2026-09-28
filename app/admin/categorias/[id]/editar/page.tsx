import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteCategoryButton from "./DeleteCategoryButton";

import EditCategoryForm from "./EditCategoryForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarCategoriaPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: category, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug
    `)
    .eq("id", id)
    .single();

  if (error || !category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold tracking-[0.15em]">
              MERAKI
            </h1>

            <p className="text-xs text-gray-500">
              Administración
            </p>
          </div>

          <Link
            href="/admin/categorias"
            className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← Volver a categorías
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Encabezado */}
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
            Categorías
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Editar categoría
          </h2>

          <p className="mt-3 text-gray-500">
            Modificá la información de{" "}
            <span className="font-medium text-gray-700">
              {category.name}
            </span>
            .
          </p>
        </div>

        <EditCategoryForm category={category} />

        <DeleteCategoryButton
        category={{
            id: category.id,
            name: category.name,
        }}
        />
      </div>
    </main>
  );
}