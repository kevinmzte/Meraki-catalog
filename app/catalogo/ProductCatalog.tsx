"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Category = {
  id?: number | string;
  name: string;
};

type Product = {
  id: number | string;
  name: string;
  slug: string;
  price: number | string;
  stock: number;
  image_url?: string | null;
  categories?: Category | Category[] | null;
};

type Props = {
  products: Product[];
};

export default function ProductCatalog({ products }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  /*
   * Obtenemos automáticamente las categorías
   * existentes entre los productos.
   */
  const categories = useMemo(() => {
    const names = products
      .flatMap((product) => {
        if (Array.isArray(product.categories)) {
          return product.categories.map((category) => category?.name);
        }

        return product.categories?.name
          ? [product.categories.name]
          : [];
      })
      .filter((name): name is string => Boolean(name));

    return ["Todos", ...Array.from(new Set(names))];
  }, [products]);

  /*
   * Filtramos los productos según la categoría.
   */
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todos") {
      return products;
    }

    return products.filter((product) => {
      const productCategories = Array.isArray(product.categories)
        ? product.categories
        : product.categories
          ? [product.categories]
          : [];

      return productCategories.some(
        (category) => category?.name === selectedCategory
      );
    });
  }, [products, selectedCategory]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">

      {/* Encabezado */}
      <div className="border-b border-gray-100 pb-8">

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
          Nuestra colección
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Catálogo
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Descubrí nuestros productos y encontrá algo especial para vos.
            </p>
          </div>

          {products.length > 0 && (
            <p className="text-sm text-gray-400">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto"
                : "productos"}
            </p>
          )}

        </div>
      </div>

      {/* FILTROS */}
      {products.length > 0 && (
        <div className="py-7">

          <div className="flex items-center gap-3 overflow-x-auto pb-2">

            {categories.map((category) => {
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    shrink-0 rounded-full border px-5 py-2.5
                    text-sm font-medium transition-all duration-200
                    ${
                      active
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}

          </div>

        </div>
      )}

      {/* Sin productos */}
      {products.length === 0 ? (

        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 text-center">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>

          </div>

          <h2 className="mt-5 text-base font-semibold text-gray-900">
            No hay productos disponibles
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Estamos preparando nuevos productos. Volvé pronto para descubrir
            las novedades.
          </p>

        </div>

      ) : filteredProducts.length === 0 ? (

        /* Categoría vacía */
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl bg-gray-50 px-6 text-center">

          <h2 className="text-base font-semibold text-gray-900">
            No encontramos productos
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            No hay productos disponibles en esta categoría.
          </p>

          <button
            type="button"
            onClick={() => setSelectedCategory("Todos")}
            className="mt-5 text-sm font-semibold text-gray-900 underline underline-offset-4"
          >
            Ver todos los productos
          </button>

        </div>

      ) : (

        /* PRODUCTOS */
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">

          {filteredProducts.map((product) => {
            const category = Array.isArray(product.categories)
              ? product.categories[0]
              : product.categories;

            const hasStock = product.stock > 0;

            return (
              <Link
                key={product.id}
                href={`/catalogo/${product.slug}`}
                className="group block"
              >

                {/* Imagen */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">

                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xs text-gray-400">
                        Sin imagen
                      </span>
                    </div>
                  )}

                  {/* Stock */}
                  {!hasStock && (
                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-medium text-gray-600 shadow-sm backdrop-blur">
                      Sin stock
                    </div>
                  )}

                  {/* Ver producto */}
                  <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-xl bg-white/95 px-4 py-3 text-center text-sm font-medium text-gray-900 shadow-sm backdrop-blur">
                      Ver producto
                    </div>
                  </div>

                </div>

                {/* Información */}
                <div className="pt-4">

                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                    {category?.name ?? "Sin categoría"}
                  </p>

                  <div className="mt-1.5 flex items-start justify-between gap-3">

                    <h2 className="line-clamp-2 text-sm font-medium leading-5 text-gray-900 transition group-hover:text-gray-600 sm:text-base">
                      {product.name}
                    </h2>

                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">

                    <p className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
                      {Number(product.price).toLocaleString("es-PY")}{" "}
                      <span className="text-xs font-medium text-gray-500">
                        Gs.
                      </span>
                    </p>

                    {hasStock && (
                      <span className="hidden text-xs text-gray-400 sm:inline">
                        Disponible
                      </span>
                    )}

                  </div>

                </div>

              </Link>
            );
          })}

        </div>
      )}

    </section>
  );
}