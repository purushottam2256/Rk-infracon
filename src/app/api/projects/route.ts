import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ projects: data || [] });
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const adminClient = createAdminClient();

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { data, error } = await adminClient
      .from("projects")
      .insert({
        title: body.title,
        slug,
        location: body.location || "",
        description: body.description || "",
        short_description: body.short_description || "",
        price: body.price || "",
        price_range: body.price_range || "",
        plot_sizes: body.plot_sizes || "",
        total_area: body.total_area || "",
        total_plots: body.total_plots || 0,
        status: body.status || "ongoing",
        featured: body.featured || false,
        thumbnail: body.thumbnail || "",
        hero_image: body.hero_image || "",
        gallery_images: body.gallery_images || [],
        layout_image: body.layout_image || "",
        amenities: body.amenities || [],
        highlights: body.highlights || [],
        lat: body.lat || 0,
        lng: body.lng || 0,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json({ success: true, project: data }, { status: 201 });
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
