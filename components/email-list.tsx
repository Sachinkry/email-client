// components/email-list.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, StarOff, Paperclip } from "lucide-react";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useEmailContext } from "@/lib/email-context";
import { Button } from "@/components/ui/button";

interface EmailListProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Email {
  id: string;
  read: boolean;
  starred: boolean;
  from: string;
  subject: string;
  preview: string;
  time: string;
  hasAttachment: boolean;
  category: string;
}

export default function EmailList({ className }: EmailListProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useBreakpoint(864);
  const [selectedCategory, setSelectedCategory] = useState<string>("primary");
  const { status } = useSession();
  const { selectedEmailId, setSelectedEmailId } = useEmailContext();

  useEffect(() => {
    if (status === "authenticated") {
      fetchEmails();
    }
  }, [status]);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/emails");
      if (!response.ok) {
        throw new Error("Failed to fetch emails");
      }
      const data = await response.json();
      setEmails(data);
    } catch (err) {
      setError("Failed to load emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = (id: string) => {
    setSelectedEmailId(id === selectedEmailId ? null : id); // Toggle selection
  };

  if (status === "unauthenticated") {
    return <div className={cn("p-4", className)}>Please sign in to view your emails.</div>;
  }

  if (loading) {
    return <div className={cn("p-4", className)}>Loading emails...</div>;
  }

  if (error) {
    return (
      <div className={cn("p-4", className)}>
        {error}
        <Button onClick={fetchEmails} className="mt-2">Retry</Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full w-full min-w-0", className)}>
      <Tabs defaultValue="primary" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList className={`grid w-full grid-cols-3 max-w-md ${isSmallScreen ? "hidden" : "grid"}`}>
            <TabsTrigger value="primary">Primary</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>
          <div className={`w-full ${isSmallScreen ? "block" : "hidden"}`}>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="promotions">Promotions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="primary" className="m-0">
            {emails
              .filter((email) => email.category === "primary")
              .map((email) => (
                <EmailItem
                  key={email.id}
                  email={email}
                  isSelected={selectedEmailId === email.id}
                  onClick={() => handleEmailClick(email.id)}
                />
              ))}
          </TabsContent>
          <TabsContent value="social" className="m-0">
            {emails
              .filter((email) => email.category === "social")
              .map((email) => (
                <EmailItem
                  key={email.id}
                  email={email}
                  isSelected={selectedEmailId === email.id}
                  onClick={() => handleEmailClick(email.id)}
                />
              ))}
          </TabsContent>
          <TabsContent value="promotions" className="m-0">
            {emails
              .filter((email) => email.category === "promotions")
              .map((email) => (
                <EmailItem
                  key={email.id}
                  email={email}
                  isSelected={selectedEmailId === email.id}
                  onClick={() => handleEmailClick(email.id)}
                />
              ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

// EmailItem component remains unchanged
interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

function EmailItem({ email, isSelected, onClick }: EmailItemProps) {
  const [isStarred, setIsStarred] = useState(email.starred);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
    // TODO: Implement starring email via Gmail API
  };

  return (
    <div
      className={cn(
        "flex items-start gap-2 p-3 border-b cursor-pointer transition-colors",
        isSelected ? "bg-muted" : "hover:bg-muted/50",
        !email.read && "font-medium",
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2 pt-1">
        <Checkbox id={`email-${email.id}`} className="data-[state=checked]:bg-muted-foreground" />
        <button onClick={handleStarClick} className="text-muted-foreground hover:text-amber-400">
          {isStarred ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : <StarOff className="h-4 w-4" />}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <div className="font-medium truncate">{email.from}</div>
          <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">{email.time}</div>
        </div>
        <div className="text-sm truncate">{email.subject}</div>
        <div className="text-xs text-muted-foreground truncate">{email.preview}</div>
      </div>
      {email.hasAttachment && <Paperclip className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />}
      {!email.read && <Badge variant="secondary" className="rounded-full h-2 w-2 p-0 bg-primary mt-1" />}
    </div>
  );
}