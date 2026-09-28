import Link from "next/link";
import Header from "@/components/Header";
import { getProducts } from "@/lib/products";
import ProductCatalog from "./ProductCatalog";

export default async function CatalogoPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}
      <Header />
      
      {/* CATÁLOGO */}
      <ProductCatalog products={products} />

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