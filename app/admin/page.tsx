import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navbar */}
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

          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              Administrador
            </p>

            <p className="text-xs text-gray-500">
              {user?.email}
            </p>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
            Panel
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Bienvenido a MERAKI
          </h2>

          <p className="mt-3 text-gray-500">
            Administrá los productos y categorías de tu tienda.
          </p>
        </div>

        {/* Opciones */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">

          <a
            href="/admin/productos"
            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                📦
              </div>

              <span className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-6 text-lg font-semibold text-gray-900">
              Productos
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Crear, editar, eliminar y administrar el stock de tus productos.
            </p>
          </a>

          <a
            href="/admin/categorias"
            className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                🏷️
              </div>

              <span className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-6 text-lg font-semibold text-gray-900">
              Categorías
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Administrar las categorías utilizadas en tu catálogo.
            </p>
          </a>

        </div>
      </div>
    </main>
  );
}