import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ReservarPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const price = Number(product.price);
  const deposit = price * 0.5;

  const whatsappMessage = encodeURIComponent(
  `Hola, quiero reservar el producto "${product.name}".

Precio total: ${price.toLocaleString("es-PY")} Gs.
Adelanto del 50%: ${deposit.toLocaleString("es-PY")} Gs.

Adjunto el comprobante de transferencia.`
);

  return (
    <main className="min-h-screen bg-white">
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center"
          >
            <Image
                         src="/logo-meraki.png"
                         alt="Meraki"
                         width={140}
                         height={50}
                         priority
                         className="h-auto w-auto transition duration-300 group-hover:scale-105"
                       />
          </Link>

          {/* Navegación */}
          <nav className="flex items-center gap-8">

            <Link
              href={`/catalogo/${product.slug}`}
              className="group relative py-2 text-sm font-medium text-gray-900"
            >
              Volver

              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-gray-900" />
            </Link>
          </nav>
        </div>
      </header>

     <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">

  {/* Encabezado */}
  <div className="mx-auto max-w-2xl text-center">
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
      Reserva de producto
    </p>

    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
      Completá tu reserva
    </h1>

    <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
      Realizá el adelanto del 50% y envianos el comprobante
      para confirmar la reserva.
    </p>
  </div>


  {/* Resumen del producto */}
  <div className="mt-12 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
    <div className="p-6 sm:p-8">

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Producto seleccionado
          </p>

          <h2 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
            {product.name}
          </h2>
        </div>

        <div className="sm:text-right">
          <p className="text-sm text-gray-500">
            Precio total
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {price.toLocaleString("es-PY")} Gs.
          </p>
        </div>

      </div>

      {/* Adelanto */}
      <div className="mt-7 flex flex-col gap-2 rounded-2xl bg-gray-900 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">

        <div>
          <p className="text-sm text-gray-300">
            Adelanto requerido
          </p>

          <p className="mt-1 text-xs text-gray-400">
            50% del valor del producto
          </p>
        </div>

        <p className="text-2xl font-bold tracking-tight sm:text-3xl">
          {deposit.toLocaleString("es-PY")} Gs.
        </p>

      </div>
    </div>
  </div>


  {/* Transferencia + pasos */}
  <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

    {/* Cómo reservar */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
          Proceso
        </p>

        <h2 className="mt-2 text-xl font-semibold text-gray-900">
          ¿Cómo reservar?
        </h2>
      </div>

      <div className="mt-7 space-y-6">

        {/* Paso 1 */}
        <div className="flex gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            1
          </div>

          <div>
            <p className="font-medium text-gray-900">
              Realizá la transferencia
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Transferí el 50% del valor del producto utilizando
              los datos indicados.
            </p>
          </div>
        </div>

        {/* Paso 2 */}
        <div className="flex gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
            2
          </div>

          <div>
            <p className="font-medium text-gray-900">
              Guardá el comprobante
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Conservá la captura o comprobante emitido por tu banco.
            </p>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="flex gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
            3
          </div>

          <div>
            <p className="font-medium text-gray-900">
              Envialo por WhatsApp
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Envianos el comprobante para que podamos verificar
              tu pago.
            </p>
          </div>
        </div>

        {/* Paso 4 */}
        <div className="flex gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
            4
          </div>

          <div>
            <p className="font-medium text-gray-900">
              Confirmamos tu reserva
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Una vez verificado el pago, te confirmaremos
              la reserva del producto.
            </p>
          </div>
        </div>

      </div>
    </div>


    {/* Datos para transferencia */}
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Cabecera */}
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


      {/* Datos bancarios */}
      <div className="px-6 py-2 sm:px-8">

        {/* Banco */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Banco
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              UENO BANK
            </p>
          </div>
        </div>


        {/* Titular */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Titular
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              KEVIN BRAHIAN MAZACOTE SILVA
            </p>
          </div>
        </div>


        {/* Cuenta */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Número de cuenta
            </p>

            <p className="mt-1 font-mono text-lg font-semibold tracking-wide text-gray-900">
              6191674132
            </p>
          </div>
        </div>


        {/* Alias */}
        <div className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Alias
            </p>

            <p className="mt-1 font-mono text-lg font-semibold tracking-wide text-gray-900">
              5107179
            </p>
          </div>
        </div>

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
      href={`https://wa.me/595984303286?text=${whatsappMessage}`}
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
      Al enviar el comprobante podremos verificar el pago y
      confirmar tu reserva.
    </p>

  </div>


  {/* Alternativa */}
  <div className="mt-10 border-t border-gray-100 pt-8 text-center">

    <p className="text-sm text-gray-500">
      ¿Todavía no querés realizar la reserva?
    </p>

    <a
      href={`https://wa.me/595984303286?text=${encodeURIComponent(
        `Hola, quiero consultar la disponibilidad del producto "${product.name}".`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition hover:text-gray-500"
    >
      Consultar disponibilidad
      <span>→</span>
    </a>

  </div>

</section>
    </main>
  );
}