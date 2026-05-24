import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT_EMAIL, COMPANY_NAME } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    const businessName = String(body?.businessName ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !businessName || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 },
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || CONTACT_EMAIL;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email delivery is not configured. Add SMTP_HOST, SMTP_USER, and SMTP_PASS in your environment.",
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New SMS enquiry from ${name} - ${businessName}`,
      text: `Name: ${name}\nBusiness: ${businessName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a;">
          <h2>${COMPANY_NAME} SMS Enquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Business:</strong> ${businessName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry sent successfully.",
    });
  } catch (error) {
    console.error("contact email send failed", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send your enquiry right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}
