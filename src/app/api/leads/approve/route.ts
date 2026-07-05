import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    
    // Get lead details
    const { data: lead, error: fetchError } = await adminClient
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Update status to in-progress
    const { error: updateError } = await adminClient
      .from("leads")
      .update({ status: "in-progress" })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to approve visit" }, { status: 500 });
    }

    // Send email reminder
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

        await transporter.sendMail({
          from: `"RK Infracon System" <${process.env.SMTP_USER}>`,
          to: "rkopenplots@gmail.com", // Sent to admin
          subject: `Reminder: Approved Visit for ${lead.name}`,
          html: `
            <h2>Visit Appointment Approved</h2>
            <p>A site visit appointment has been approved and the customer is incoming.</p>
            <p><strong>Customer Name:</strong> ${lead.name}</p>
            <p><strong>Phone:</strong> ${lead.phone}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Project Interest:</strong> ${lead.project_interest || "General"}</p>
            <p><strong>Date:</strong> ${lead.preferred_date || "Not specified"}</p>
            <p><strong>Time:</strong> ${lead.preferred_time || "Not specified"}</p>
            <br/>
            <p>Please ensure the site staff is ready to receive them.</p>
          `,
        });
      } catch (emailError: any) {
        console.error("Failed to send approval email:", emailError);
      }
    }

    return NextResponse.json({ success: true, status: "in-progress" });
  } catch (error) {
    console.error("Approve visit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
