import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

const STORAGE_BUCKET = "site-images";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ project: data });
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const adminClient = createAdminClient();

    // If title changed, regenerate slug
    const updates: Record<string, unknown> = { ...body };
    if (body.title) {
      updates.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    // Remove fields that shouldn't be directly updated
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;

    const { data, error } = await adminClient
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, project: data });
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const adminClient = createAdminClient();

    // Fetch project to get image paths for cleanup
    const { data: project } = await adminClient
      .from("projects")
      .select("thumbnail, hero_image, gallery_images, layout_image")
      .eq("id", id)
      .single();

    if (project) {
      // Collect all Supabase Storage paths to delete
      const pathsToDelete: string[] = [];
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const storagePrefix = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`;

      const extractPath = (url: string) => {
        if (url && url.startsWith(storagePrefix)) {
          return url.replace(storagePrefix, "");
        }
        return null;
      };

      [project.thumbnail, project.hero_image, project.layout_image].forEach((url) => {
        const path = extractPath(url);
        if (path) pathsToDelete.push(path);
      });

      (project.gallery_images || []).forEach((url: string) => {
        const path = extractPath(url);
        if (path) pathsToDelete.push(path);
      });

      if (pathsToDelete.length > 0) {
        await adminClient.storage.from(STORAGE_BUCKET).remove(pathsToDelete);
      }
    }

    const { error } = await adminClient.from("projects").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project delete error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
