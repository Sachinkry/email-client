// components/header.tsx
"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Bell, Menu, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar className="h-full" />
        </SheetContent>
      </Sheet>

      <div className={`${isSearchExpanded ? "flex-1" : "w-72"} transition-all duration-200 md:flex-1`}>
        <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search emails..."
            className="w-full bg-background pl-8 md:w-2/3 lg:w-1/3"
            onFocus={() => setIsSearchExpanded(true)}
            onBlur={() => setIsSearchExpanded(false)}
          />
        </form>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <ThemeToggle />
        {status === "authenticated" ? (
          <>
            <Avatar>
              <AvatarImage src={session.user?.image || "/placeholder.svg?height=32&width=32"} alt={session.user?.name || "User"} />
              <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => signIn("google")}>Sign In</Button>
        )}
      </div>
    </header>
  );
}