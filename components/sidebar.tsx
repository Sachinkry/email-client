import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Archive, File, Inbox, MailPlus, Send, Star, Trash2, Users, AlertCircle, Tag } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Mail</h2>
        <div className="space-y-1">
          <Button variant="secondary" className="w-full justify-start" asChild>
            <Link href="#">
              <MailPlus className="mr-2 h-4 w-4" />
              Compose
            </Link>
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">Folders</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <Inbox className="mr-2 h-4 w-4" />
                Inbox
                <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">24</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <Star className="mr-2 h-4 w-4" />
                Starred
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <Send className="mr-2 h-4 w-4" />
                Sent
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <File className="mr-2 h-4 w-4" />
                Drafts
                <span className="ml-auto bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">3</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <AlertCircle className="mr-2 h-4 w-4" />
                Spam
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <Trash2 className="mr-2 h-4 w-4" />
                Trash
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">Labels</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <Tag className="mr-2 h-4 w-4 text-red-500" />
                Important
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <Tag className="mr-2 h-4 w-4 text-blue-500" />
                Work
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <Tag className="mr-2 h-4 w-4 text-green-500" />
                Personal
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">Contacts</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#">
                <Users className="mr-2 h-4 w-4" />
                All Contacts
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
      <div className="mt-auto p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Storage:</span> 45% used
          </div>
        </div>
        <div className="mt-2 h-2 rounded-full bg-muted">
          <div className="h-full w-[45%] rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  )
}

