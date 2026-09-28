"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Botón */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-xl transition hover:bg-gray-100"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
      >
        {open ? "×" : "☰"}
      </button>

      {/* Menú móvil */}
      {open && (
        <div className="fixed left-0 right-0 top-20 z-40 border-b border-gray-100 bg-white shadow-lg">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-5">

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="border-b border-gray-100 py-4 text-base font-medium text-gray-900 transition-colors hover:text-gray-500"
            >
              Inicio
            </Link>

            <Link
              href="/catalogo"
              onClick={() => setOpen(false)}
              className="py-4 text-base font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Catálogo
            </Link>

          </nav>
        </div>
      )}
    </div>
  );
}