import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ComposeButton } from "@/components/compose-button"

interface EmailLayoutProps {
  children: React.ReactNode
}

export default function EmailLayout({ children }: EmailLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="hidden md:flex h-full w-64 flex-col border-r" />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">{children}</main>
        <ComposeButton className="fixed bottom-4 right-4 md:bottom-8 md:right-8" />
      </div>
    </div>
  )
}

