// components/email-layout.tsx
"use client";

import type React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ComposeButton } from "@/components/compose-button";
import  EmailList  from "@/components/email-list";
import { EmailView } from "@/components/email-view";
import { useEmailContext } from "@/lib/email-context";

interface EmailLayoutProps {
  children?: React.ReactNode;
}

export default function EmailLayout({ children }: EmailLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { selectedEmailId } = useEmailContext();

  return (
    <div className="flex h-screen w-full max-w-[100vw] bg-background overflow-x-hidden">
      <Sidebar className="hidden md:flex h-full w-64 flex-col border-r shrink-0" />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 flex overflow-auto">
          {selectedEmailId ? (
            <div className="w-full">
              <EmailView emailId={selectedEmailId} />
            </div>
          ) : (
            <div className="w-full">
              <EmailList />
            </div>
          )}
        </main>
        <ComposeButton className="fixed bottom-4 right-4 md:bottom-8 md:right-8" />
      </div>
    </div>
  );
}