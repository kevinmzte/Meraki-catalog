import Link from "next/link";
import { getProducts } from "@/lib/products";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";

export default async function Home() {
  const products = await getProducts();

  const featuredProducts = products.slice(0, 4);
  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <AnnouncementBar />
      <Header />
      {/* HERO */}
      <section className="relative min-h-[600px] overflow-hidden">
        {/* Imagen de fondo */}
        <img
          src="/hero-fondo.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Contenido */}
        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-6">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-medium uppercase tracking-[0.2em]">
              MERAKI
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
              Encontrá algo creativo para vos o para ese alguien.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Productos para regalar, decorar y darle
              un toque diferente a tus cosas.
            </p>

            <Link
              href="/catalogo"
              className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-medium text-black transition hover:bg-gray-100"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
<section className="bg-white px-6 py-20 sm:py-24">
  <div className="mx-auto max-w-7xl">

    {/* Encabezado */}
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
          Nuestra selección
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Productos destacados
        </h2>

        <p className="mt-4 max-w-xl leading-7 text-gray-500">
          Descubrí algunos de nuestros productos y encontrá
          algo especial para vos.
        </p>
      </div>

      <Link
        href="/catalogo"
        className="group inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 transition-all duration-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
      >
        Ver catálogo completo

        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>

    {/* Productos */}
    <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {featuredProducts.map((product) => {
        const category = Array.isArray(product.categories)
          ? product.categories[0]
          : product.categories;

        return (
          <Link
            key={product.id}
            href={`/catalogo/${product.slug}`}
            className="group block"
          >
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl">

              {/* Imagen */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Sin imagen
                  </div>
                )}

                {/* Categoría */}
                {category?.name && (
                  <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-gray-700 shadow-sm backdrop-blur sm:px-3 sm:py-1.5 sm:text-xs">
                      {category.name}
                    </span>
                  </div>
                )}

                {/* Overlay sutil */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.02]" />
              </div>

              {/* Información */}
              <div className="flex flex-1 flex-col p-3 sm:p-5">

                {/* Nombre */}
                <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 transition-colors duration-300 group-hover:text-gray-600 sm:min-h-[48px] sm:text-base sm:leading-6">
                  {product.name}
                </h3>

                {/* Precio + enlace */}
                <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:pt-4">

                  <p className="text-base font-bold text-gray-900 sm:text-lg">
                    {Number(product.price).toLocaleString("es-PY")}
                    <span className="ml-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                      Gs.
                    </span>
                  </p>

                  <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-gray-400 transition-all duration-300 group-hover:text-gray-900 md:inline-flex">
                    Ver
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>

                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>

  </div>
</section> 
{/* SOBRE MERAKI */}
<section className="bg-gray-50 px-6 py-20 sm:py-24">
  <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

    {/* Imagen */}
    <div className="relative">
      <div className="overflow-hidden rounded-3xl">
        <img
          src="/meraki.jpeg"
          alt="Meraki y sus productos"
          loading="lazy"
          className="aspect-[4/5] h-full w-full object-cover"
        />
      </div>

      {/* Detalle decorativo */}
      <div className="absolute -bottom-5 -right-3 hidden rounded-2xl bg-white px-6 py-4 shadow-lg sm:block">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
          Hecho con
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          dedicación y cariño ♡
        </p>
      </div>
    </div>

    {/* Texto */}
    <div className="lg:max-w-xl">

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
        Detrás de Meraki
      </p>

      <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
        Un emprendimiento hecho con propósito.
      </h2>

      <div className="mt-6 space-y-4 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
        <p>
          Meraki nació con la idea de crear algo propio y ofrecer
          productos que puedan convertirse en un detalle especial
          para alguien.
        </p>

        <p>
          Detrás de cada producto hay tiempo, dedicación y muchas
          ganas de seguir haciendo crecer este emprendimiento poco
          a poco.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-px w-10 bg-gray-300" />

        <p className="text-sm font-medium italic text-gray-500">
          Gracias por apoyar este pequeño emprendimiento.
        </p>
      </div>

      <Link
        href="/catalogo"
        className="group mt-9 inline-flex items-center gap-2 text-sm font-semibold text-gray-900"
      >
        Conocé nuestros productos

        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </Link>

    </div>
  </div>
</section>     
{/* FOOTER / CTA */}
      <footer className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gray-100 px-6 py-14 text-center">
          <h2 className="text-3xl font-bold">
            ¿Buscás algo específico?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
            Si no encontrás lo que buscás en nuestro catálogo,
            escribinos y consultá por disponibilidad.
          </p>

          <a
             href="https://wa.me/595984303286"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-xl bg-black px-7 py-3.5 font-medium text-white transition hover:bg-gray-800"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </footer>
    </main>
  );
}