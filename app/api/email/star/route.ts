// app/api/email/star/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    console.error("Unauthorized: No session or access token found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { emailId, star } = await request.json();

  if (!emailId) {
    console.error("Bad Request: Email ID is missing");
    return NextResponse.json({ error: "Email ID is required" }, { status: 400 });
  }

  console.log(`Attempting to ${star ? "star" : "unstar"} email with ID: ${emailId}`);

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const response = await gmail.users.messages.modify({
      userId: "me",
      id: emailId,
      requestBody: {
        addLabelIds: star ? ["STARRED"] : [],
        removeLabelIds: star ? [] : ["STARRED"],
      },
    });
    console.log(`Successfully ${star ? "starred" : "unstarred"} email with ID: ${emailId}`, response.data);
    return NextResponse.json({ message: `Email ${star ? "starred" : "unstarred"} successfully` });
  } catch (error) {
    console.error(`Error updating star status for email ID ${emailId}:`, error);
    return NextResponse.json({ error: "Failed to update star status" }, { status: 500 });
  }
}