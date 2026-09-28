"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/cliente";

type Category = {
  id: string;
  name: string;
};

export default function NuevoProductoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [features, setFeatures] = useState("");
  const [active, setActive] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) {
        setError("No se pudieron cargar las categorías.");
        return;
      }

      setCategories(data ?? []);
    }

    loadCategories();
  }, []);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (!name.trim()) {
        throw new Error("El nombre del producto es obligatorio.");
      }

      if (!price || Number(price) < 0) {
        throw new Error("Ingresá un precio válido.");
      }

      if (!stock || Number(stock) < 0) {
        throw new Error("Ingresá un stock válido.");
      }

      if (!categoryId) {
        throw new Error("Seleccioná una categoría.");
      }

      const slug = createSlug(name);

      // Verificar que no exista otro producto con el mismo slug
      const { data: existingProduct } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existingProduct) {
        throw new Error(
          "Ya existe un producto con un nombre similar. Elegí otro nombre."
        );
      }

      let imageUrl: string | null = null;

      // Subir imagen
      if (imageFile) {
        const extension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${slug}-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            `No se pudo subir la imagen: ${uploadError.message}`
          );
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const featureList = features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean);

      const { error: insertError } = await supabase
        .from("products")
        .insert({
          name: name.trim(),
          slug,
          description: description.trim() || null,
          price: Number(price),
          stock: Number(stock),
          category_id: categoryId,
          features: featureList,
          image_url: imageUrl,
          active,
        });

      if (insertError) {
        throw new Error(
          `No se pudo crear el producto: ${insertError.message}`
        );
      }

      router.push("/admin/productos");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold tracking-[0.15em]">
              MERAKI
            </h1>
            <p className="text-xs text-gray-500">
              Administración
            </p>
          </div>

          <Link
            href="/admin/productos"
            className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← Volver a productos
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
            Productos
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Nuevo producto
          </h2>

          <p className="mt-3 text-gray-500">
            Agregá un nuevo producto al catálogo de MERAKI.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8"
        >
          {/* Información básica */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Información básica
            </h3>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ej. Lámpara LED Minecraft"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describí el producto..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Categoría
                </label>

                <select
                  id="category"
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value="">
                    Seleccioná una categoría
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Precio y stock */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Precio y stock
            </h3>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Precio (Gs.)
                </label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="120000"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) =>
                    setStock(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>
          </section>

          {/* Características */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Características
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Escribí una característica por línea.
            </p>

            <textarea
              value={features}
              onChange={(event) =>
                setFeatures(event.target.value)
              }
              placeholder={`Alimentación USB
Diseño decorativo
Fácil instalación`}
              rows={5}
              className="mt-5 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </section>

          {/* Imagen */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Imagen
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Subí una imagen para mostrarla en el catálogo.
            </p>

            <div className="mt-5">
              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-6 py-10 text-center transition hover:border-gray-400"
              >
                <span className="text-sm font-medium text-gray-700">
                  Seleccionar imagen
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  JPG, PNG o WEBP
                </span>

                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {imagePreview && (
              <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="max-h-80 w-full object-contain bg-gray-50"
                />
              </div>
            )}
          </section>

          {/* Estado */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Producto activo
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Los productos activos aparecen en el catálogo público.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  active ? "bg-gray-900" : "bg-gray-200"
                }`}
                aria-label="Cambiar estado del producto"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                    active ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/productos"
              className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}