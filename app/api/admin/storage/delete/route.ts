import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const path = body.path;

  if (typeof path !== "string" || !path.trim()) {
    return NextResponse.json(
      { error: "Ruta de imagen inválida" },
      { status: 400 }
    );
  }

  const adminSupabase = createAdminClient();

  const { data, error } = await adminSupabase.storage
    .from("product-images")
    .remove([path]);

  if (error) {
    console.error("Error al eliminar imagen:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}