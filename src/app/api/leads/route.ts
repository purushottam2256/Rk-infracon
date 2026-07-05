import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, projectInterest, source, type, preferredDate, preferredTime } = body;

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
        type: type || "enquiry",
        preferred_date: preferredDate || "",
        preferred_time: preferredTime || "",
        status: "pending",
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
          secure: process.env.SMTP_PORT === "465" || process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const isVisitBooking = type === "visit-booking";
        const subject = isVisitBooking
          ? `Interested Visit Booking: ${name} - ${preferredDate || "No date"}`
          : `Interested Lead: ${name} - ${projectInterest || "General"}`;

        await transporter.sendMail({
          from: `"RK Infracon Website" <${process.env.SMTP_USER}>`,
          to: "rkopenplots@gmail.com",
          subject,
          html: `
            <h2>${isVisitBooking ? "New Visit Booking" : "New Inquiry"} Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${isVisitBooking ? `<p><strong>Preferred Date:</strong> ${preferredDate || "Not specified"}</p>
            <p><strong>Preferred Time:</strong> ${preferredTime || "Not specified"}</p>` : ""}
            <p><strong>Project Interest:</strong> ${projectInterest || "General"}</p>
            <p><strong>Message:</strong></p>
            <p>${message || "No message provided."}</p>
            <p><strong>Source:</strong> ${source || "website"}</p>
            <br/>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">View in Admin Panel</a></p>
          `,
        });
      } catch (emailError: any) {
        console.error("Email sending failed! Please check your SMTP settings in .env.local");
        console.error("SMTP Error Details:", emailError.message || emailError);
        // Continue and return success since it's saved in DB
      }
    }

    return NextResponse.json(
      { success: true, message: type === "visit-booking" ? "Visit booked successfully" : "Inquiry submitted successfully", id: data.id },
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
    const type = searchParams.get("type");

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
      if (status === "active") {
        query = query.in("status", ["pending", "in-progress"]);
      } else {
        query = query.eq("status", status);
      }
    }

    if (type && type !== "all") {
      query = query.eq("type", type);
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

// PATCH — Admin only: update lead status
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

// DELETE — Admin only: delete a lead
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead delete error:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
