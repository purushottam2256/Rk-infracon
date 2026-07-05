import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const supabase = createAdminClient();
    
    let query = supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
    if (activeOnly) {
      query = query.eq("active", true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json({ testimonials: data || [] });
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from("testimonials")
      .insert([
        {
          name: body.name,
          role: body.role,
          text: body.text,
          rating: body.rating || 5,
          active: body.active ?? true,
          sort_order: body.sort_order || 0
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    revalidatePath("/");
    return NextResponse.json({ testimonial: data });
  } catch (error) {
    console.error("Testimonials POST error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
