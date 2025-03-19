// components/email-view.tsx
"use client";

import { useEffect, useState } from "react";
import { Paperclip, Reply, Forward, Trash2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import sanitizeHtml from "sanitize-html";
import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";
import { useEmailContext } from "@/lib/email-context";

interface EmailViewProps {
  emailId?: string;
  className?: string;
}

interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  to: string;
  body: string;
  hasAttachment: boolean;
  isHtml: boolean;
}

export function EmailView({ emailId: propEmailId, className }: EmailViewProps) {
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { status } = useSession();
  const { selectedEmailId, setSelectedEmailId } = useEmailContext();
  const effectiveEmailId = propEmailId || selectedEmailId;

  useEffect(() => {
    if (status === "authenticated" && effectiveEmailId) {
      fetchEmail();
    } else if (!effectiveEmailId) {
      setEmail(null);
      setError(null);
      setLoading(false);
    }
  }, [effectiveEmailId, status]);

  const fetchEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/email/${effectiveEmailId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch email");
      }
      const data = await response.json();
      setEmail(data);
    } catch (err) {
      setError("Failed to load email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: string) => {
    toast({ title: `${action} not implemented yet`, description: "This feature is coming soon!" });
  };

  const handleBack = () => {
    setSelectedEmailId(null); // Clear the selected email to show the list
  };

  if (status === "unauthenticated") {
    return <div className={cn("p-4", className)}>Please sign in to view emails.</div>;
  }

  if (!effectiveEmailId) {
    return <div className={cn("p-4 text-muted-foreground", className)}>Select an email to view.</div>;
  }

  if (loading) {
    return <div className={cn("p-4", className)}>Loading email...</div>;
  }

  if (error || !email) {
    return (
      <div className={cn("p-4", className)}>
        {error || "Email not found"}
        <Button onClick={fetchEmail} className="mt-2">Retry</Button>
      </div>
    );
  }

  const sanitizedBody = email.isHtml
    ? DOMPurify.sanitize(email.body, {
        ADD_TAGS: ["style"],
        ADD_ATTR: ["style"],
      })
    : email.body;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold truncate">{email.subject}</h1>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">From:</span> {email.from}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">To:</span> {email.to}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Date:</span> {email.date}
            </p>
            {email.hasAttachment && (
              <p className="text-sm text-muted-foreground flex items-center">
                <Paperclip className="h-4 w-4 mr-2" />
                Attachment(s) present (download not implemented yet)
              </p>
            )}
          </div>
          {email.isHtml ? (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />
          ) : (
            <div className="prose prose-sm max-w-none">{sanitizedBody}</div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => handleAction("Reply")}>
          <Reply className="h-4 w-4 mr-2" />
          Reply
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleAction("Forward")}>
          <Forward className="h-4 w-4 mr-2" />
          Forward
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleAction("Delete")}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}