import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, projectInterest, source } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS for insert (public form submission)
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        phone,
        message: message || "",
        project_interest: projectInterest || "General",
        source: source || "website",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit inquiry. Please try again." },
        { status: 500 }
      );
    }

    // Send email notification
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"RK Infracon Website" <${process.env.SMTP_USER}>`,
          to: "info@rkinfracon.in",
          subject: `New Lead: ${name} - ${projectInterest || "General"}`,
          html: `
            <h2>New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Project Interest:</strong> ${projectInterest || "General"}</p>
            <p><strong>Message:</strong></p>
            <p>${message || "No message provided."}</p>
            <p><strong>Source:</strong> ${source || "website"}</p>
            <br/>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">View Lead in Admin Panel</a></p>
          `,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Continue and return success since it's saved in DB
      }
    }

    return NextResponse.json(
      { success: true, message: "Inquiry submitted successfully", id: data.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Auth check — only logged-in admin can read leads
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Use admin client to bypass RLS for reading leads
    const adminClient = createAdminClient();

    let query = adminClient
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: leads, count, error } = await query;

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      leads: leads || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
