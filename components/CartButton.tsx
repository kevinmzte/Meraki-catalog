"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const {
    totalItems,
    isLoaded,
  } = useCart();

  return (
    <Link
      href="/carrito"
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
      aria-label="Ver carrito"
    >
      {/* Carrito */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h7.78a2 2 0 0 0 1.95-1.57L20.13 7H5.12" />
      </svg>

      {isLoaded && totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white ring-2 ring-white group-hover:bg-white group-hover:text-gray-900">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}