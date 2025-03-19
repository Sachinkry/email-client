// app/api/emails/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get("pageToken") || undefined;

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 20, // Keep the page size at 20
      q: "in:inbox",
      pageToken,
    });

    const messages = response.data.messages || [];
    const nextPageToken = response.data.nextPageToken || null;

    const emails = await Promise.all(
      messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "full",
        });

        const headers = email.data.payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find((h) => (h.name?.toLowerCase() === name.toLowerCase()))?.value;

        const from = getHeader("From") || "Unknown";
        const subject = getHeader("Subject") || "No Subject";
        const date = getHeader("Date") || new Date().toISOString();
        const snippet = email.data.snippet || "";
        const hasAttachment = !!email.data.payload?.parts?.some(
          (part) => part.filename && part.filename.length > 0
        );

        const labels = email.data.labelIds || [];
        let category = "primary";
        if (labels.includes("CATEGORY_SOCIAL")) {
          category = "social";
        } else if (labels.includes("CATEGORY_PROMOTIONS")) {
          category = "promotions";
        } else if (labels.includes("CATEGORY_PERSONAL")) {
          category = "primary";
        }

        return {
          id: message.id!,
          read: email.data.labelIds?.includes("UNREAD") === false,
          starred: email.data.labelIds?.includes("STARRED") || false,
          from,
          subject,
          preview: snippet,
          time: new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          hasAttachment,
          category,
        };
      })
    );

    return NextResponse.json({ emails, nextPageToken });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}