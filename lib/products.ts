import { createClient } from "@/lib/supabase/server";

export async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
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
      category_id,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }

  return data;
}
export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
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
      category_id,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error) {
    console.error("Error obteniendo producto:", error);
    return null;
  }

  return data;
}