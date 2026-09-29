import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Cerrar sesión
  async function logout() {
    "use server";

    const supabase = await createClient();

    await supabase.auth.signOut();

    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo / título */}
          <div>
            <h1 className="text-xl font-bold tracking-[0.15em]">
              MERAKI
            </h1>

            <p className="text-xs text-gray-500">
              Administración
            </p>
          </div>

          {/* Usuario + cerrar sesión */}
          <div className="flex shrink-0 items-center gap-3">

            {/* Datos del administrador - solo desktop */}
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-gray-900">
                Administrador
              </p>

              <p className="text-xs text-gray-500">
                {user?.email}
              </p>
            </div>

            {/* Cerrar sesión */}
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
                aria-label="Cerrar sesión"
              >
                {/* Icono */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                </svg>

                <span className="hidden sm:inline">
                  Cerrar sesión
                </span>
              </button>
            </form>

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

          {/* Productos */}
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

          {/* Categorías */}
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