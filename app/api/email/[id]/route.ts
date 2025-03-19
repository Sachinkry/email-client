// app/api/email/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const emailId = params.id;
  if (!emailId) {
    return NextResponse.json({ error: "Email ID is required" }, { status: 400 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const response = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "full",
    });

    const email = response.data;
    const headers = email.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name && h.name.toLowerCase() === name.toLowerCase())?.value;

    // Extract email details
    const from = getHeader("From") || "Unknown";
    const subject = getHeader("Subject") || "No Subject";
    const date = getHeader("Date") || new Date().toISOString();
    const to = getHeader("To") || "Unknown";

    // Extract body (plain text or HTML)
    let body = "";
    if (email.payload?.parts) {
      // Handle multipart emails (e.g., text/plain and text/html)
      const htmlPart = email.payload.parts.find((part) => part.mimeType === "text/html");
      const textPart = email.payload.parts.find((part) => part.mimeType === "text/plain");
      if (htmlPart?.body?.data) {
        body = Buffer.from(htmlPart.body.data, "base64").toString("utf-8");
      } else if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
      }
    } else if (email.payload?.body?.data) {
      // Single-part email
      body = Buffer.from(email.payload.body.data, "base64").toString("utf-8");
    }

    const hasAttachment = !!email.payload?.parts?.some(
      (part) => part.filename && part.filename.length > 0
    );

    return NextResponse.json({
      id: email.id,
      from,
      subject,
      date: new Date(date).toLocaleString(),
      to,
      body,
      hasAttachment,
      isHtml: !!email.payload?.parts?.some((part) => part.mimeType === "text/html"),
    });
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json({ error: "Failed to fetch email" }, { status: 500 });
  }
}