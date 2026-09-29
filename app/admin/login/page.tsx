"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/cliente";

export default function AdminLoginPage() {
  const router = useRouter();

  // Evita crear una instancia nueva en cada render
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/admin");
      }
    }

    checkSession();
  }, [router, supabase]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-6"
      style={{
        backgroundImage: "url('/heroLogin-fondo.jpg')",
      }}
    >
      {/* Capa oscura sobre el fondo */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Login */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">

        {/* Encabezado */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-[0.15em] text-gray-900">
            MERAKI
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@meraki.py"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-12 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />

              {/* Mostrar / ocultar contraseña */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  /* Ojo tachado */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m2 2 20 20" />
                    <path d="M6.71 6.71C4.95 7.83 3.58 9.63 3 12c1.5 4 4.5 6 9 6 1.46 0 2.75-.21 3.88-.62" />
                    <path d="M10.73 10.73a2 2 0 0 0 2.54 2.54" />
                    <path d="M9.88 4.24A10.8 10.8 0 0 1 12 4c4.5 0 7.5 2 9 6a10.1 10.1 0 0 1-1.17 2.25" />
                  </svg>
                ) : (
                  /* Ojo */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.64 7.6 7.42 5 12 5c4.58 0 8.36 2.6 9.94 6.65a1 1 0 0 1 0 .7C20.36 16.4 16.58 19 12 19c-4.58 0-8.36-2.6-9.94-6.65" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>

        {/* Texto inferior */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Acceso exclusivo para administración
        </p>

      </div>
    </main>
  );
}