"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, StarOff, Paperclip } from "lucide-react"
import { useBreakpoint } from "@/hooks/use-breakpoint"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EmailListProps extends React.HTMLAttributes<HTMLDivElement> {}

// Sample email data
const emails = [
  {
    id: "1",
    read: false,
    starred: true,
    from: "Sarah Johnson",
    subject: "Weekly Team Meeting Notes",
    preview:
      "Here are the notes from our meeting yesterday. We discussed the upcoming project deadlines and resource allocation...",
    time: "10:30 AM",
    hasAttachment: true,
    category: "primary",
  },
  {
    id: "2",
    read: true,
    starred: false,
    from: "Michael Chen",
    subject: "Project Update: Q3 Goals",
    preview: "I wanted to share some updates on our Q3 goals. We're making good progress on the main deliverables...",
    time: "Yesterday",
    hasAttachment: false,
    category: "primary",
  },
  {
    id: "3",
    read: true,
    starred: false,
    from: "Alex Rodriguez",
    subject: "Invitation: Product Launch Event",
    preview: "You're invited to our upcoming product launch event on July 15th. We'll be revealing our new line of...",
    time: "Jul 5",
    hasAttachment: false,
    category: "social",
  },
  {
    id: "4",
    read: false,
    starred: true,
    from: "Emily Wilson",
    subject: "Feedback on your presentation",
    preview:
      "I just wanted to say that your presentation yesterday was excellent. The way you explained the complex concepts...",
    time: "Jul 3",
    hasAttachment: false,
    category: "primary",
  },
  {
    id: "5",
    read: true,
    starred: false,
    from: "David Park",
    subject: "Invoice #1234 for June Services",
    preview: "Please find attached the invoice for services provided in June. Payment is due within 30 days...",
    time: "Jun 30",
    hasAttachment: true,
    category: "promotions",
  },
  {
    id: "6",
    read: true,
    starred: false,
    from: "LinkedIn",
    subject: "5 new job recommendations for you",
    preview: "Based on your profile, we've found 5 new job opportunities that might interest you...",
    time: "Jun 28",
    hasAttachment: false,
    category: "social",
  },
  {
    id: "7",
    read: true,
    starred: false,
    from: "Amazon",
    subject: "Your Order Has Shipped",
    preview: "Your recent order #302-5982741 has shipped and is on its way to you. Estimated delivery date is...",
    time: "Jun 27",
    hasAttachment: false,
    category: "promotions",
  },
  {
    id: "8",
    read: true,
    starred: false,
    from: "Netflix",
    subject: "New shows added to your list",
    preview: "We've added new shows that match your interests. Check out these titles this weekend...",
    time: "Jun 25",
    hasAttachment: false,
    category: "promotions",
  },
]

export default function EmailList({ className }: EmailListProps) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useBreakpoint(864)
  const [selectedCategory, setSelectedCategory] = useState<string>("primary")

  const handleEmailClick = (id: string) => {
    setSelectedEmail(id)
    if (isMobile) {
      // In a real app, you would navigate to the email view page
      window.location.href = `/email/${id}`
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <Tabs defaultValue="primary" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          {/* Tabs for larger screens */}
          <TabsList className={`grid w-full grid-cols-3 max-w-md ${isSmallScreen ? "hidden" : "grid"}`}>
            <TabsTrigger value="primary">Primary</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>

          {/* Dropdown for smaller screens */}
          <div className={`w-full ${isSmallScreen ? "block" : "hidden"}`}>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value)
              }}
            >
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
                  isSelected={selectedEmail === email.id}
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
                  isSelected={selectedEmail === email.id}
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
                  isSelected={selectedEmail === email.id}
                  onClick={() => handleEmailClick(email.id)}
                />
              ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

interface EmailItemProps {
  email: {
    id: string
    read: boolean
    starred: boolean
    from: string
    subject: string
    preview: string
    time: string
    hasAttachment: boolean
  }
  isSelected: boolean
  onClick: () => void
}

function EmailItem({ email, isSelected, onClick }: EmailItemProps) {
  const [isStarred, setIsStarred] = useState(email.starred)

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsStarred(!isStarred)
  }

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
  )
}

