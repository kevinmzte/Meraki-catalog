import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriasPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      created_at,
      products (
        id
      )
    `)
    .order("created_at", { ascending: false });

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
            href="/admin"
            className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← Volver al panel
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Encabezado */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
              Administración
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Categorías
            </h2>

            <p className="mt-3 text-gray-500">
              Administrá las categorías utilizadas en tu catálogo.
            </p>
          </div>

          <Link
            href="/admin/categorias/nuevo"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Nueva categoría
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              No se pudieron cargar las categorías.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          </div>
        )}

        {/* Lista */}
        {!error && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {categories && categories.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {categories.map((category) => {
                  const productCount = category.products?.length ?? 0;

                  return (
                    <div
                      key={category.id}
                      className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Información */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl">
                          🏷️
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {category.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            /{category.slug}
                          </p>

                          <p className="mt-2 text-sm text-gray-400">
                            {productCount}{" "}
                            {productCount === 1
                              ? "producto"
                              : "productos"}
                          </p>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/catalogo?categoria=${category.slug}`}
                          target="_blank"
                          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                        >
                          Ver
                        </Link>

                        <Link
                          href={`/admin/categorias/${category.id}/editar`}
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Estado vacío */
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  🏷️
                </div>

                <p className="mt-5 text-lg font-medium text-gray-900">
                  No hay categorías todavía.
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Creá tu primera categoría para organizar tus productos.
                </p>

                <Link
                  href="/admin/categorias/nuevo"
                  className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Crear categoría
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}