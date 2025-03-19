// components/compose-button.tsx
"use client";

import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface ComposeButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ComposeButton({ className }: ComposeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();
  const { status } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast({ title: "Error", description: "Please sign in to send emails.", variant: "destructive" });
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast({ title: "Success", description: "Email sent successfully!" });
      setIsOpen(false);
      setTo("");
      setSubject("");
      setBody("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to send email.", variant: "destructive" });
    }
  };

  return (
    <div className={cn(className)}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="lg" className="rounded-full">
            <Send className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <Textarea
                placeholder="Type your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[200px]"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" disabled>
                <Paperclip className="mr-2 h-4 w-4" />
                Attach (Coming Soon)
              </Button>
              <div className="space-x-2">
                <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                  Discard
                </Button>
                <Button type="submit">Send</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}