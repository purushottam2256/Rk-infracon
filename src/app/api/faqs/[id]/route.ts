import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from("faqs")
      .update({
        question: body.question,
        answer: body.answer,
        active: body.active,
        sort_order: body.sort_order
      })
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    
    revalidatePath("/");
    return NextResponse.json({ faq: data });
  } catch (error) {
    console.error("FAQ PUT error:", error);
    return NextResponse.json({ error: "Failed to update faq" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();
    
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw error;
    
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FAQ DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete faq" }, { status: 500 });
  }
}
