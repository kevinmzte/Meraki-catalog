import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductActions from "@/components/ProductActions";
import Header from "@/components/Header";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = Array.isArray(product.categories)
    ? product.categories[0]
    : product.categories;

  return (
    <main className="min-h-screen bg-white">
        <Header />
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2">
        {/* Imagen */}
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400">
              Sin imagen
            </span>
          )}
        </div>

        {/* Información */}
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">
            {category?.name ?? "Sin categoría"}
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-bold">
            {Number(product.price).toLocaleString("es-PY")} Gs.
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>
      
          {/* Características */}
          {product.features?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">
                Características
              </h2>

              <ul className="mt-3 space-y-2">
                {product.features.map(
                  (feature: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <span>✓</span>
                      {feature}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Stock */}
          <div className="mt-8">
            {product.stock > 0 ? (
              <p className="font-medium text-green-600">
                Stock disponible: {product.stock}
              </p>
            ) : (
              <p className="font-medium text-red-600">
                Sin stock
              </p>
            )}
          </div>

        <ProductActions
            product={{
              id: String(product.id),
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              stock: Number(product.stock),
              image_url: product.image_url,
            }}
          />
        </div>
      </section>
    </main>
  );
}