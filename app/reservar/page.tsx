"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "595984303286";

export default function ReservarPage() {
  const {
    items,
    totalItems,
    totalPrice,
    isLoaded,
  } = useCart();

  const deposit = totalPrice * 0.5;

  const productsMessage = items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name}
  ${(item.price * item.quantity).toLocaleString("es-PY")} Gs.`
    )
    .join("\n\n");

  const whatsappMessage = encodeURIComponent(
    `Hola, quiero confirmar la reserva de mi pedido.

Pedido:

${productsMessage}

Total: ${totalPrice.toLocaleString("es-PY")} Gs.
Adelanto realizado (50%): ${deposit.toLocaleString("es-PY")} Gs.

Adjunto el comprobante de transferencia.`
  );

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-400">
          Cargando pedido...
        </p>
      </main>
    );
  }

  /*
   * Si alguien entra directamente a /reservar
   * sin tener productos.
   */
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Header />

        <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
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

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            No hay productos para reservar
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Agregá productos al carrito antes de realizar una reserva.
          </p>

          <Link
            href="/catalogo"
            className="mt-7 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Ver catálogo
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* Encabezado */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Reserva de pedido
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Completá tu reserva
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
            Realizá el adelanto del 50% y envianos el comprobante
            para confirmar la reserva de tu pedido.
          </p>
        </div>

        {/* Resumen */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Tu pedido
                </p>

                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                  Resumen de la reserva
                </h2>
              </div>

              <p className="hidden text-sm text-gray-400 sm:block">
                {totalItems}{" "}
                {totalItems === 1 ? "producto" : "productos"}
              </p>
            </div>
          </div>

          {/* Productos */}
          <div className="divide-y divide-gray-100 px-6 sm:px-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-5"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.quantity} ×{" "}
                    {item.price.toLocaleString("es-PY")} Gs.
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-gray-900 sm:text-base">
                  {(item.price * item.quantity).toLocaleString(
                    "es-PY"
                  )}{" "}
                  Gs.
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium text-gray-600">
                Total del pedido
              </p>

              <p className="text-xl font-bold tracking-tight text-gray-900">
                {totalPrice.toLocaleString("es-PY")} Gs.
              </p>
            </div>
          </div>

          {/* Adelanto */}
          <div className="m-4 rounded-2xl bg-gray-900 px-5 py-5 text-white sm:m-6 sm:flex sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm text-gray-300">
                Adelanto requerido
              </p>

              <p className="mt-1 text-xs text-gray-400">
                50% del valor total del pedido
              </p>
            </div>

            <p className="mt-3 text-2xl font-bold tracking-tight sm:mt-0 sm:text-3xl">
              {deposit.toLocaleString("es-PY")} Gs.
            </p>
          </div>
        </div>

        {/* Transferencia + proceso */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Proceso */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Proceso
            </p>

            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              ¿Cómo reservar?
            </h2>

            <div className="mt-7 space-y-6">
              <ReservationStep
                number="1"
                title="Realizá la transferencia"
                description="Transferí el 50% del valor total del pedido utilizando los datos indicados."
                active
              />

              <ReservationStep
                number="2"
                title="Guardá el comprobante"
                description="Conservá la captura o comprobante emitido por tu banco."
              />

              <ReservationStep
                number="3"
                title="Envialo por WhatsApp"
                description="Envianos el comprobante para que podamos verificar tu pago."
              />

              <ReservationStep
                number="4"
                title="Confirmamos tu reserva"
                description="Una vez verificado el pago, te confirmaremos la reserva del pedido."
              />
            </div>
          </div>

          {/* Datos bancarios */}
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Pago
              </p>

              <h2 className="mt-2 text-xl font-semibold text-gray-900">
                Datos para la transferencia
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Utilizá estos datos para realizar el adelanto.
              </p>
            </div>

            <div className="px-6 py-2 sm:px-8">
              <BankRow
                label="Banco"
                value="UENO BANK"
              />

              <BankRow
                label="Titular"
                value="KEVIN BRAHIAN MAZACOTE SILVA"
              />

              <BankRow
                label="Número de cuenta"
                value="6191674132"
                mono
              />

              <BankRow
                label="Alias"
                value="5107179"
                mono
                last
              />
            </div>

            {/* Monto */}
            <div className="m-4 mt-2 rounded-2xl bg-gray-50 p-5 sm:m-6 sm:mt-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Monto a transferir
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Adelanto correspondiente al 50%
                  </p>
                </div>

                <p className="text-2xl font-bold tracking-tight text-gray-900">
                  {deposit.toLocaleString("es-PY")} Gs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="mt-8">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button group flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Enviar comprobante por WhatsApp

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>

          <p className="mt-3 text-center text-xs leading-5 text-gray-400">
            Al enviar el comprobante podremos verificar el pago
            y confirmar tu reserva.
          </p>
        </div>

        {/* Volver */}
        <div className="mt-10 border-t border-gray-100 pt-8 text-center">
          <p className="text-sm text-gray-500">
            ¿Querés modificar tu pedido?
          </p>

          <Link
            href="/carrito"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-gray-500"
          >
            Volver al carrito
            <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
/* Pasos */

function ReservationStep({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          active
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {number}
      </div>

      <div>
        <p className="font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* Datos bancarios */

function BankRow({
  label,
  value,
  mono = false,
  last = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`py-5 ${
        !last ? "border-b border-gray-100" : ""
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 font-semibold text-gray-900 ${
          mono
            ? "font-mono text-lg tracking-wide"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}