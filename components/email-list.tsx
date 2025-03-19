// components/email-list.tsx
"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Paperclip } from "lucide-react";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useEmailContext } from "@/lib/email-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// In-memory cache
const emailCache = new Map<string, { emails: Email[]; nextPageToken: string | null }>();

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
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useBreakpoint(864);
  const { status, data: session } = useSession();
  const { selectedEmailId, setSelectedEmailId, selectedCategory, setSelectedCategory } = useEmailContext();
  const { toast } = useToast();

  // Define userId from session
  const userId = session?.user?.email || "anonymous";

  useEffect(() => {
    if (status === "authenticated") {
      fetchEmails();
    }
    // Clear cache on sign-out
    if (status === "unauthenticated") {
      emailCache.clear();
      setEmails([]);
    }
  }, [status]);

  const fetchEmails = async (pageToken?: string) => {
    const cacheKey = `email-list-${userId}-${pageToken || "initial"}`;
    const cachedData = emailCache.get(cacheKey);

    if (cachedData) {
      setEmails((prev) => (pageToken ? [...prev, ...cachedData.emails] : cachedData.emails));
      setNextPageToken(cachedData.nextPageToken);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    if (pageToken) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }
    try {
      const url = pageToken ? `/api/emails?pageToken=${pageToken}` : "/api/emails";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch emails");
      }
      const data = await response.json();
      const newEmails = data.emails || [];
      emailCache.set(cacheKey, { emails: newEmails, nextPageToken: data.nextPageToken || null });
      setEmails((prev) => (pageToken ? [...prev, ...newEmails] : newEmails));
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      if (pageToken) {
        toast({ title: "Error", description: "Failed to load more emails", variant: "destructive" });
      } else {
        setError("Failed to load emails. Please try again.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (nextPageToken) {
      fetchEmails(nextPageToken);
    }
  };

  const handleEmailClick = (id: string, category: string) => {
    setSelectedEmailId(id === selectedEmailId ? null : id);
    setSelectedCategory(category);
  };

  const getUnreadCount = (category: string) => {
    return emails.filter((e) => e.category === category && !e.read).length;
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
        <Button onClick={() => fetchEmails()} className="mt-2">Retry</Button>
      </div>
    );
  }

  const renderEmailList = (category: string) => {
    const filteredEmails = emails.filter((email) => email.category === category);
    if (filteredEmails.length === 0) {
      return <div className="p-4 text-muted-foreground">No emails in this category.</div>;
    }
    return filteredEmails.map((email) => (
      <EmailItem
        key={email.id}
        email={email}
        isSelected={selectedEmailId === email.id}
        onClick={() => handleEmailClick(email.id, email.category)}
      />
    ));
  };

  return (
    <div className={cn("flex flex-col h-full w-full min-w-0", className)}>
      <Tabs defaultValue="primary" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList className={`grid w-full grid-cols-3 max-w-md ${isSmallScreen ? "hidden" : "grid"}`}>
            <TabsTrigger value="primary">
              Primary {getUnreadCount("primary") > 0 && (
                <Badge className="ml-2">{getUnreadCount("primary")}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="social">
              Social {getUnreadCount("social") > 0 && (
                <Badge className="ml-2">{getUnreadCount("social")}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="promotions">
              Promotions {getUnreadCount("promotions") > 0 && (
                <Badge className="ml-2">{getUnreadCount("promotions")}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <div className={`w-full ${isSmallScreen ? "block" : "hidden"}`}>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary {getUnreadCount("primary") > 0 && `(${getUnreadCount("primary")})`}</SelectItem>
                <SelectItem value="social">Social {getUnreadCount("social") > 0 && `(${getUnreadCount("social")})`}</SelectItem>
                <SelectItem value="promotions">Promotions {getUnreadCount("promotions") > 0 && `(${getUnreadCount("promotions")})`}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="primary" className="m-0">
            {renderEmailList("primary")}
          </TabsContent>
          <TabsContent value="social" className="m-0">
            {renderEmailList("social")}
          </TabsContent>
          <TabsContent value="promotions" className="m-0">
            {renderEmailList("promotions")}
          </TabsContent>
          {nextPageToken && (
            <div className="p-4 flex justify-center">
              <Button onClick={handleLoadMore} variant="outline" disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
}

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

function EmailItem({ email, isSelected, onClick }: EmailItemProps) {
  const [isStarred, setIsStarred] = useState(email.starred);
  const { toast } = useToast();
  const { setEmails } = useEmailContext();
  const { data: session } = useSession();
  const userId = session?.user?.email || "anonymous";

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStarredStatus = !isStarred;
    try {
      const response = await fetch("/api/email/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: email.id, star: newStarredStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update star status");
      }
      setIsStarred(newStarredStatus);
      setEmails((prevEmails) => {
        const updatedEmails = prevEmails.map((e) =>
          e.id === email.id ? { ...e, starred: newStarredStatus } : e
        );
        // Update the cache with the new email list
        const cacheKey = `email-list-${userId}-initial`; // Adjust based on the page token if needed
        if (emailCache.has(cacheKey)) {
          emailCache.set(cacheKey, {
            emails: updatedEmails,
            nextPageToken: emailCache.get(cacheKey)!.nextPageToken,
          });
        }
        return updatedEmails;
      });
      toast({ title: `Email ${newStarredStatus ? "starred" : "unstarred"}` });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update star status",
        variant: "destructive",
      });
    }
  };

  const senderName = email.from.split("<")[0].trim() || email.from;

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
        <button disabled onClick={handleStarClick} className="text-muted-foreground ">
          <Star
            className={cn(
              "h-4 w-4 hover:cursor-not-allowed ",
              isStarred ? "fill-amber-400 text-amber-400" : "fill-none"
            )}
          />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <div className="font-medium truncate">{senderName}</div>
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