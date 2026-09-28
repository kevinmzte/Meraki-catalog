import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductosPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      stock,
      active,
      image_url,
      categories (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50">
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
              Productos
            </h2>

            <p className="mt-3 text-gray-500">
              Administrá los productos disponibles en tu catálogo.
            </p>
          </div>

          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Nuevo producto
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              No se pudieron cargar los productos.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          </div>
        )}

        {/* Productos */}
        {!error && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {products && products.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {products.map((product) => {
                  const category = Array.isArray(product.categories)
                    ? product.categories[0]
                    : product.categories;

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Información */}
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              Sin imagen
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {product.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {category?.name ?? "Sin categoría"}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                            <span className="font-semibold text-gray-900">
                              {Number(product.price).toLocaleString("es-PY")} Gs.
                            </span>

                            <span className="text-gray-400">
                              Stock: {product.stock}
                            </span>

                            {product.active ? (
                              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                Activo
                              </span>
                            ) : (
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                                Inactivo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/catalogo/${product.slug}`}
                          target="_blank"
                          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                        >
                          Ver
                        </Link>

                        <Link
                          href={`/admin/productos/${product.id}/editar`}
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
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-medium text-gray-900">
                  No hay productos todavía.
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Creá tu primer producto para comenzar.
                </p>

                <Link
                  href="/admin/productos/nuevo"
                  className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Crear producto
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}