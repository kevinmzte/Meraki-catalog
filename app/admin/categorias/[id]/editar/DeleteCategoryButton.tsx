"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteCategory,
  type CategoryState,
} from "@/app/admin/categorias/actions";

type Props = {
  category: {
    id: string;
    name: string;
  };
};

const initialState: CategoryState = {
  success: false,
  message: "",
};

export default function DeleteCategoryButton({
  category,
}: Props) {
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);

  const [state, formAction, pending] = useActionState(
    deleteCategory,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.push("/admin/categorias");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Eliminar categoría
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Esta acción no se puede deshacer.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center justify-center rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Eliminar categoría
          </button>
        </div>

        {state.message && !state.success && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {state.message}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900">
              ¿Eliminar categoría?
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Estás por eliminar{" "}
              <span className="font-semibold text-gray-700">
                {category.name}
              </span>
              . Esta acción no se puede deshacer.
            </p>

            <form action={formAction}>
              <input
                type="hidden"
                name="id"
                value={category.id}
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setShowConfirm(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-w-28 items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  {pending ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Eliminando...
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}