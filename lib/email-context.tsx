// lib/email-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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

interface EmailContextType {
  selectedEmailId: string | null;
  setSelectedEmailId: (id: string | null) => void;
  emails: Email[];
  setEmails: React.Dispatch<React.SetStateAction<Email[]>>; // Updated type
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: ReactNode }) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("primary");

  return (
    <EmailContext.Provider
      value={{
        selectedEmailId,
        setSelectedEmailId,
        emails,
        setEmails,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
}

export function useEmailContext() {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmailContext must be used within an EmailProvider");
  }
  return context;
}