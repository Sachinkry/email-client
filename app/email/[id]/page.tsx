// app/email/[id]/page.tsx
import { EmailView } from "@/components/email-view";

export default function EmailPage({ params }: { params: { id: string } }) {
  return <EmailView emailId={params.id} />;
}