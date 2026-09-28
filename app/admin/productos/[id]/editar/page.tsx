"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/cliente";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  features: string[];
  image_url: string | null;
  active: boolean;
  category_id: string | null;
};

function createSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditarProductoPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [features, setFeatures] = useState("");
  const [active, setActive] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [currentImagePath, setCurrentImagePath] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      const [
        { data: productData, error: productError },
        { data: categoryData, error: categoryError },
      ] = await Promise.all([
        supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            description,
            price,
            stock,
            features,
            image_url,
            active,
            category_id
          `)
          .eq("id", productId)
          .single(),

        supabase
          .from("categories")
          .select("id, name")
          .order("name"),
      ]);

      if (productError) {
        setError("No se pudo cargar el producto.");
        setLoading(false);
        return;
      }

      if (categoryError) {
        setError("No se pudieron cargar las categorías.");
        setLoading(false);
        return;
      }

      const loadedProduct = productData as Product;

      setProduct(loadedProduct);

      setName(loadedProduct.name);
      setDescription(loadedProduct.description ?? "");
      setPrice(String(loadedProduct.price));
      setStock(String(loadedProduct.stock));
      setCategoryId(loadedProduct.category_id ?? "");
      setFeatures(loadedProduct.features?.join("\n") ?? "");
      setActive(loadedProduct.active);

        const imageUrl = loadedProduct.image_url ?? "";

        setCurrentImage(imageUrl);

        if (imageUrl) {
        const marker =
            "/storage/v1/object/public/product-images/";

        const index = imageUrl.indexOf(marker);

        if (index !== -1) {
            const imagePath = decodeURIComponent(
            imageUrl.substring(index + marker.length)
            );

            setCurrentImagePath(imagePath);
        }
    }

      setCategories(categoryData ?? []);

      setLoading(false);
    }

    loadData();
  }, [productId]);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  }

  function getStoragePathFromUrl(url: string | null) {
  if (!url) return null;

  const marker = "/storage/v1/object/public/product-images/";

  const index = url.indexOf(marker);

  if (index === -1) return null;

  return decodeURIComponent(
    url.substring(index + marker.length)
  );
}
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setError("");
  setSaving(true);

  try {
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      setSaving(false);
      return;
    }

    if (!price || Number(price) < 0) {
      setError("El precio no es válido.");
      setSaving(false);
      return;
    }

    if (!stock || Number(stock) < 0) {
      setError("El stock no es válido.");
      setSaving(false);
      return;
    }

    if (!categoryId) {
      setError("Seleccioná una categoría.");
      setSaving(false);
      return;
    }

    const newSlug = createSlug(name);

    // Comprobar si el slug ya pertenece a otro producto
    const { data: existingProduct, error: slugError } = await supabase
      .from("products")
      .select("id")
      .eq("slug", newSlug)
      .neq("id", productId)
      .maybeSingle();

    if (slugError) {
      setError("No se pudo comprobar el slug.");
      setSaving(false);
      return;
    }

    if (existingProduct) {
      setError("Ya existe otro producto con ese nombre.");
      setSaving(false);
      return;
    }

    const oldImageUrl = currentImage || null;

    let imageUrl = oldImageUrl;
    let newImagePath: string | null = null;

    // =========================================================
    // 1. Si se seleccionó una imagen nueva, subirla
    // =========================================================
    if (imageFile) {
      const extension =
        imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${newSlug}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        setError(
          `No se pudo subir la nueva imagen: ${uploadError.message}`
        );
        setSaving(false);
        return;
      }

      newImagePath = fileName;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const featureList = features
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean);

    // =========================================================
    // 2. Actualizar el producto
    // =========================================================
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name: name.trim(),
        slug: newSlug,
        description: description.trim() || null,
        price: Number(price),
        stock: Number(stock),
        category_id: categoryId,
        features: featureList,
        image_url: imageUrl,
        active,
      })
      .eq("id", productId);

    // =========================================================
    // 3. Si todo salió bien, eliminar la imagen anterior
    // =========================================================

    if (imageFile && currentImagePath) {
        console.log(
            "Intentando eliminar imagen anterior:",
            currentImagePath
        );

        const response = await fetch("/api/admin/storage/delete", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            path: currentImagePath,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(
            "No se pudo eliminar la imagen anterior:",
            result.error
            );
        } else {
            console.log("Imagen anterior eliminada:", result.data);
        }
        }
    // =========================================================
    // 4. Volver a la lista
    // =========================================================
    router.push("/admin/productos");
    router.refresh();
  } catch {
    setError("Ocurrió un error inesperado.");
    setSaving(false);
  }
}

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-gray-500">
            Cargando producto...
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-red-600">
            No se encontró el producto.
          </p>
          <Link
            href="/admin/productos"
            className="mt-4 inline-block text-sm font-medium underline"
          >
            Volver a productos
          </Link>
        </div>
      </main>
    );
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
              Editar producto
            </p>
          </div>

          <Link
            href="/admin/productos"
            className="text-sm font-medium text-gray-600 transition hover:text-black"
          >
            ← Volver
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">
            Producto
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Editar producto
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Modificá la información del producto.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="text-sm font-medium text-gray-900">
              Nombre
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
              placeholder="Ej. Lámpara LED Minecraft"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">
              Descripción
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
              placeholder="Descripción del producto..."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-900">
                Precio
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="120000"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900">
                Stock
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="3"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">
              Categoría
            </label>

            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
            >
              <option value="">Seleccionar categoría</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">
              Características
            </label>

            <p className="mt-1 text-xs text-gray-500">
              Escribí una característica por línea.
            </p>

            <textarea
              value={features}
              onChange={(event) => setFeatures(event.target.value)}
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
              placeholder={`Alimentación USB
Diseño decorativo
Fácil instalación`}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">
              Imagen
            </label>

            <div className="mt-3 space-y-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Nueva imagen"
                  className="h-56 w-full rounded-xl object-cover"
                />
              ) : currentImage ? (
                <img
                  src={currentImage}
                  alt={name}
                  className="h-56 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                  Sin imagen
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500"
              />

              <p className="text-xs text-gray-400">
                Si no seleccionás una imagen nueva, se conservará la
                actual.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Producto activo
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Los productos inactivos no aparecen en el catálogo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`relative h-6 w-11 rounded-full transition ${
                active ? "bg-black" : "bg-gray-300"
              }`}
              aria-label={
                active
                  ? "Desactivar producto"
                  : "Activar producto"
              }
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  active ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href="/admin/productos"
              className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}