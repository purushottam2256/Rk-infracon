import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { createAdminClient } from "@/lib/supabase/server";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from("testimonials")
      .update({
        name: body.name,
        role: body.role,
        text: body.text,
        rating: body.rating,
        active: body.active,
        sort_order: body.sort_order
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json({ testimonial: data });
  } catch (error) {
    console.error("Testimonial PUT error:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();
    
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
