import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const supabase = createAdminClient();
    
    let query = supabase.from("faqs").select("*").order("sort_order", { ascending: true });
    if (activeOnly) {
      query = query.eq("active", true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json({ faqs: data || [] });
  } catch (error) {
    console.error("FAQs GET error:", error);
    return NextResponse.json({ error: "Failed to fetch faqs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from("faqs")
      .insert([
        {
          question: body.question,
          answer: body.answer,
          active: body.active ?? true,
          sort_order: body.sort_order || 0
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json({ faq: data });
  } catch (error) {
    console.error("FAQs POST error:", error);
    return NextResponse.json({ error: "Failed to create faq" }, { status: 500 });
  }
}
