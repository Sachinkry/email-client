"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, X, Paperclip, Bold, Italic, List, ListOrdered, LinkIcon, Image } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ComposeButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ComposeButton({ className }: ComposeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="rounded-full shadow-lg">
            <Pencil className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="flex flex-row items-center justify-between border-b p-4">
            <DialogTitle>New Message</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-auto flex flex-col">
            <div className="border-b">
              <div className="p-4 flex items-center gap-2">
                <Label htmlFor="to" className="w-16 text-right">
                  To
                </Label>
                <Input
                  id="to"
                  placeholder="recipient@example.com"
                  className="flex-1 border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="p-4 flex items-center gap-2 border-t">
                <Label htmlFor="cc" className="w-16 text-right">
                  Cc
                </Label>
                <Input
                  id="cc"
                  placeholder="cc@example.com"
                  className="flex-1 border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="p-4 flex items-center gap-2 border-t">
                <Label htmlFor="subject" className="w-16 text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Enter subject"
                  className="flex-1 border-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="p-2 border-b flex items-center gap-1 flex-wrap">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert Link</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Image className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Insert Image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex-1 p-4">
              <Textarea
                placeholder="Compose your message..."
                className="min-h-[200px] h-full w-full resize-none border-0 focus-visible:ring-0 p-0"
              />
            </div>
          </div>

          <div className="border-t p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="mr-2 h-4 w-4" />
                Attach
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Discard
              </Button>
              <Button type="submit">Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

