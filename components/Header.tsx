"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

import CartButton from "@/components/CartButton";
import MobileMenu from "@/components/MobileMenu";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressActivated = useRef(false);

  const isHome = pathname === "/";
  const isCatalog = pathname.startsWith("/catalogo");

  // Mantener presionado durante 3 segundos
  const handlePressStart = () => {
    longPressActivated.current = false;

    pressTimer.current = setTimeout(() => {
      longPressActivated.current = true;

      // Acceso secreto al administrador
      router.push("/admin");
    }, 3000);
  };

  // Soltar el logo
  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }

    // Si NO llegó a los 4 segundos, funciona como clic normal
    if (!longPressActivated.current) {
      router.push("/");
    }
  };

  // Si el usuario mueve el mouse fuera del logo, cancelar
  const handlePressCancel = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <button
          type="button"
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressCancel}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onTouchCancel={handlePressCancel}
          onContextMenu={(e) => e.preventDefault()}
          className="group flex touch-none items-center bg-transparent p-0"
          aria-label="Ir al inicio"
        >
          <Image
            src="/logo-meraki.png"
            alt="Meraki"
            width={140}
            height={50}
            priority
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="h-auto w-auto select-none touch-none transition duration-300 group-hover:scale-105"
            style={{
              WebkitTouchCallout: "none",
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
          />
        </button>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-8 md:flex">

          {/* Inicio */}
          <Link
            href="/"
            className={`group relative py-2 text-sm font-medium transition ${
              isHome
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Inicio

            <span
              className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-gray-900 transition-all duration-300 ${
                isHome
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          {/* Catálogo */}
          <Link
            href="/catalogo"
            className={`group relative py-2 text-sm font-medium transition ${
              isCatalog
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Catálogo

            <span
              className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-gray-900 transition-all duration-300 ${
                isCatalog
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          {/* Separador */}
          <div className="h-5 w-px bg-gray-200" />

          {/* Carrito */}
          <CartButton />

        </nav>

        {/* Navegación móvil */}
        <div className="flex items-center gap-3 md:hidden">
          <CartButton />
          <MobileMenu />
        </div>

      </div>
    </header>
  );
}