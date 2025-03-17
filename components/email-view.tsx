import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Archive,
  ArrowLeft,
  Clock,
  Download,
  Forward,
  MoreHorizontal,
  Reply,
  ReplyAll,
  Star,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EmailViewProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function EmailView({ className }: EmailViewProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-lg font-semibold">Weekly Team Meeting Notes</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Archive className="h-4 w-4" />
            <span className="sr-only">Archive</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Add star</DropdownMenuItem>
              <DropdownMenuItem>Snooze</DropdownMenuItem>
              <DropdownMenuItem>Move to</DropdownMenuItem>
              <DropdownMenuItem>Label as</DropdownMenuItem>
              <DropdownMenuItem>Block sender</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Johnson" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <div className="font-semibold">Sarah Johnson</div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">To: me, team@company.com</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              10:30 AM (2 hours ago)
            </div>
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>Hi Team,</p>
          <p>
            Here are the notes from our meeting yesterday. We discussed the upcoming project deadlines and resource
            allocation for the next quarter.
          </p>
          <h3>Key Points:</h3>
          <ul>
            <li>Project Alpha is on track for delivery by the end of the month</li>
            <li>We need to allocate additional resources to Project Beta</li>
            <li>The client meeting for Project Gamma is scheduled for next Tuesday</li>
            <li>All team members should update their timesheets by Friday</li>
          </ul>
          <p>
            Please review the attached documents for more detailed information. Let me know if you have any questions or
            concerns.
          </p>
          <p>
            Best regards,
            <br />
            Sarah
          </p>
        </div>

        <div className="mt-6 border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Meeting_Notes.pdf</div>
            <Button variant="ghost" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">PDF Document - 2.4 MB</div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" className="hidden sm:flex">
            <ReplyAll className="mr-2 h-4 w-4" />
            Reply All
          </Button>
          <Button variant="outline" className="hidden sm:flex">
            <Forward className="mr-2 h-4 w-4" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  )
}

