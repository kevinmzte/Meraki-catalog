"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CategoryState = {
  success: boolean;
  message: string;
};

function createSlug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createCategory(
  _previousState: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  const supabase = await createClient();

  const name = formData.get("name")?.toString().trim();

  if (!name) {
    return {
      success: false,
      message: "Ingresá un nombre para la categoría.",
    };
  }

  if (name.length < 2) {
    return {
      success: false,
      message: "El nombre debe tener al menos 2 caracteres.",
    };
  }

  const slug = createSlug(name);

  if (!slug) {
    return {
      success: false,
      message: "No se pudo generar un slug válido.",
    };
  }

  // Verificamos si ya existe
  const { data: existingCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingCategory) {
    return {
      success: false,
      message: "Ya existe una categoría con ese nombre.",
    };
  }

  const { error } = await supabase
    .from("categories")
    .insert({
      name,
      slug,
    });

  if (error) {
    console.error("Error creando categoría:", error);

    return {
      success: false,
      message: "No se pudo crear la categoría. Intentá nuevamente.",
    };
  }

  revalidatePath("/admin/categorias");

  return {
    success: true,
    message: "Categoría creada correctamente.",
  };
}
export async function updateCategory(
  _previousState: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  const supabase = await createClient();

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();

  if (!id) {
    return {
      success: false,
      message: "No se pudo identificar la categoría.",
    };
  }

  if (!name) {
    return {
      success: false,
      message: "Ingresá un nombre para la categoría.",
    };
  }

  if (name.length < 2) {
    return {
      success: false,
      message: "El nombre debe tener al menos 2 caracteres.",
    };
  }

  const slug = createSlug(name);

  if (!slug) {
    return {
      success: false,
      message: "No se pudo generar un slug válido.",
    };
  }

  // Comprobar que otra categoría no tenga el mismo slug
  const { data: existingCategory, error: checkError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (checkError) {
    console.error("Error verificando categoría:", checkError);

    return {
      success: false,
      message: "No se pudo verificar la categoría.",
    };
  }

  if (existingCategory) {
    return {
      success: false,
      message: "Ya existe otra categoría con ese nombre.",
    };
  }

  // Actualizar
  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
    })
    .eq("id", id);

  if (error) {
    console.error("Error actualizando categoría:", error);

    return {
      success: false,
      message: "No se pudo actualizar la categoría.",
    };
  }

  revalidatePath("/admin/categorias");

  return {
    success: true,
    message: "Categoría actualizada correctamente.",
  };
}

export async function deleteCategory(
  _previousState: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  const supabase = await createClient();

  const id = formData.get("id")?.toString();

  if (!id) {
    return {
      success: false,
      message: "No se pudo identificar la categoría.",
    };
  }

  // Verificar que la categoría exista
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", id)
    .single();

  if (categoryError || !category) {
    return {
      success: false,
      message: "La categoría no existe.",
    };
  }

  // Contar productos asociados
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("category_id", id);

  if (countError) {
    console.error(
      "Error verificando productos de la categoría:",
      countError
    );

    return {
      success: false,
      message:
        "No se pudo verificar si la categoría tiene productos.",
    };
  }

  if (count && count > 0) {
    return {
      success: false,
      message: `No podés eliminar "${category.name}" porque tiene ${count} ${
        count === 1 ? "producto asociado" : "productos asociados"
      }.`,
    };
  }

  // Eliminar
  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error(
      "Error eliminando categoría:",
      deleteError
    );

    return {
      success: false,
      message: "No se pudo eliminar la categoría.",
    };
  }

  revalidatePath("/admin/categorias");

  return {
    success: true,
    message: "Categoría eliminada correctamente.",
  };
}