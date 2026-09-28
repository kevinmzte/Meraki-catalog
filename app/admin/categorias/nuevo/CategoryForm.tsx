"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createCategory,
  type CategoryState,
} from "../actions";

const initialState: CategoryState = {
  success: false,
  message: "",
};

export default function CategoryForm() {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    createCategory,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.push("/admin/categorias");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form
      action={formAction}
      className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre de la categoría
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          autoFocus
          disabled={pending}
          placeholder="Ej: Vestidos"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <p className="mt-2 text-sm text-gray-400">
          El slug se generará automáticamente a partir del nombre.
        </p>
      </div>

      {/* Mensaje de error */}
      {state.message && !state.success && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {state.message}
          </p>
        </div>
      )}

      {/* Botones */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/admin/categorias"
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-w-40 items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {pending ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creando...
            </>
          ) : (
            "Crear categoría"
          )}
        </button>
      </div>
    </form>
  );
}