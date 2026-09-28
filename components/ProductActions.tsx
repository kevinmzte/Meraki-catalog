"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
};

type Props = {
  product: Product;
};

export default function ProductActions({
  product,
}: Props) {
  const { addItem, items } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const existingItem = items.find(
    (item) => item.id === product.id
  );

  const quantityInCart = existingItem?.quantity ?? 0;

  const availableQuantity = Math.max(
    product.stock - quantityInCart,
    0
  );

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(current + 1, availableQuantity)
    );
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(current - 1, 1)
    );
  };

  const handleAddToCart = () => {
    if (availableQuantity <= 0) {
      return;
    }

    addItem(product, quantity);

    setAdded(true);
    setQuantity(1);

    setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  if (product.stock <= 0) {
    return (
      <div className="mt-8">
        <div className="rounded-2xl bg-red-50 px-5 py-4">
          <p className="text-sm font-medium text-red-700">
            Este producto se encuentra sin stock.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">

      {/* Cantidad */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">
            Cantidad
          </p>

          <p className="text-xs text-gray-400">
            {availableQuantity} disponibles
          </p>
        </div>

        <div className="mt-3 flex w-fit items-center overflow-hidden rounded-xl border border-gray-200">

          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="flex h-11 w-11 items-center justify-center text-lg text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
            aria-label="Disminuir cantidad"
          >
            −
          </button>

          <div className="flex h-11 min-w-12 items-center justify-center border-x border-gray-200 px-4 text-sm font-semibold text-gray-900">
            {quantity}
          </div>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={
              quantity >= availableQuantity
            }
            className="flex h-11 w-11 items-center justify-center text-lg text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
            aria-label="Aumentar cantidad"
          >
            +
          </button>

        </div>
      </div>

      {/* Botón carrito */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={availableQuantity <= 0}
        className="mt-5 flex w-full items-center justify-center rounded-xl bg-gray-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {availableQuantity <= 0
          ? "Stock agregado al carrito"
          : "Agregar al carrito"}
      </button>

      {/* Confirmación */}
      {added && (
        <div className="mt-3 flex items-center justify-between gap-4 rounded-xl bg-green-50 px-4 py-3">

          <p className="text-sm font-medium text-green-700">
            ✓ Producto agregado
          </p>

          <Link
            href="/carrito"
            className="shrink-0 text-sm font-semibold text-green-800 underline underline-offset-4"
          >
            Ver carrito
          </Link>

        </div>
      )}

      {/* Ya hay unidades */}
      {quantityInCart > 0 && !added && (
        <p className="mt-3 text-sm text-gray-500">
          Ya tenés{" "}
          <span className="font-semibold text-gray-900">
            {quantityInCart}
          </span>{" "}
          {quantityInCart === 1 ? "unidad" : "unidades"} en el carrito.
        </p>
      )}

      {/* WhatsApp */}
      <a
        href={`https://wa.me/595984303286?text=${encodeURIComponent(
          `Hola, estoy interesado/a en el producto "${product.name}". ¿Podrían darme más información?`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block w-full rounded-xl border border-gray-200 px-6 py-3.5 text-center text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
      >
        Consultar por WhatsApp
      </a>

    </div>
  );
}