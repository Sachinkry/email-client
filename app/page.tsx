import EmailLayout from "@/components/email-layout"
import EmailList from "@/components/email-list"
import EmailView from "@/components/email-view"
import { ThemeProvider } from "@/components/theme-provider"

export default function EmailClientPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <EmailLayout>
        <div className="flex flex-col md:flex-row h-full">
          <EmailList className="w-full md:w-1/3 lg:w-2/5 border-r" />
          <EmailView className="hidden md:block w-full md:w-2/3 lg:w-3/5" />
        </div>
      </EmailLayout>
    </ThemeProvider>
  )
}

