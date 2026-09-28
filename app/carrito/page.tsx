"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "595984303286";

export default function CarritoPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    isLoaded,
  } = useCart();

  const whatsappMessage = encodeURIComponent(
    `Hola, quiero realizar el siguiente pedido:

${items
  .map(
    (item) =>
      `• ${item.quantity}x ${item.name}
  ${(item.price * item.quantity).toLocaleString("es-PY")} Gs.`
  )
  .join("\n\n")}

Total: ${totalPrice.toLocaleString("es-PY")} Gs.

Quisiera consultar disponibilidad y coordinar la compra.`
  );

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-400">
          Cargando carrito...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
        <Header />
      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        {/* Encabezado */}
        <div className="border-b border-gray-100 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Tu selección
          </p>

          <div className="mt-3 flex items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Carrito
              </h1>

              {items.length > 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "producto seleccionado"
                    : "productos seleccionados"}
                </p>
              )}
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="hidden text-sm font-medium text-gray-400 transition hover:text-red-500 sm:block"
              >
                Vaciar carrito
              </button>
            )}
          </div>
        </div>

        {/* Carrito vacío */}
        {items.length === 0 ? (
          <div className="mx-auto flex max-w-lg flex-col items-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h7.78a2 2 0 0 0 1.95-1.57L20.13 7H5.12" />
              </svg>
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              Tu carrito está vacío
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Explorá nuestro catálogo y agregá los productos
              que quieras comprar o reservar.
            </p>

            <Link
              href="/catalogo"
              className="mt-7 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Productos */}
            <div>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex gap-4 py-6 first:pt-0 sm:gap-6"
                  >
                    {/* Imagen */}
                    <Link
                      href={`/catalogo/${item.slug}`}
                      className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-36 sm:w-32"
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          Sin imagen
                        </div>
                      )}
                    </Link>

                    {/* Información */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/catalogo/${item.slug}`}
                            className="font-semibold text-gray-900 transition hover:text-gray-500"
                          >
                            {item.name}
                          </Link>

                          <p className="mt-1 text-sm text-gray-500">
                            {item.price.toLocaleString("es-PY")} Gs. c/u
                          </p>
                        </div>

                        <p className="shrink-0 font-semibold text-gray-900">
                          {(
                            item.price * item.quantity
                          ).toLocaleString("es-PY")}{" "}
                          Gs.
                        </p>
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-5">
                        {/* Cantidad */}
                        <div>
                          <p className="mb-2 text-xs text-gray-400">
                            Cantidad
                          </p>

                          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                              aria-label="Disminuir cantidad"
                            >
                              −
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-200 px-2 text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                item.quantity >= item.stock
                              }
                              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>

                          <p className="mt-2 text-[11px] text-gray-400">
                            {item.stock} disponibles
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="text-xs font-medium text-gray-400 transition hover:text-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Vaciar móvil */}
              <button
                type="button"
                onClick={clearCart}
                className="mt-5 text-sm font-medium text-gray-400 transition hover:text-red-500 sm:hidden"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Resumen */}
            <aside>
              <div className="sticky top-28 rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-7">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resumen del pedido
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Productos
                    </span>

                    <span className="font-medium text-gray-900">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-900">
                      {totalPrice.toLocaleString("es-PY")} Gs.
                    </span>
                  </div>
                </div>

                <div className="my-6 border-t border-gray-200" />

                <div className="flex items-end justify-between gap-4">
                  <span className="font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-xl font-bold tracking-tight text-gray-900">
                    {totalPrice.toLocaleString("es-PY")} Gs.
                  </span>
                </div>

                {/* Reserva */}
                <Link
                  href="/reservar"
                  className="mt-7 flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Reservar pedido
                </Link>

                <p className="mt-2 text-center text-xs leading-5 text-gray-400">
                  La reserva requiere un adelanto del 50%.
                </p>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-button mt-4 flex w-full items-center justify-center rounded-xl px-5 py-4 text-sm font-semibold shadow-sm transition hover:shadow-md"
                >
                  Comprar por WhatsApp
                </a>

                <p className="mt-3 text-center text-[11px] leading-5 text-gray-400">
                  Podés consultar disponibilidad y coordinar
                  directamente la compra.
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}