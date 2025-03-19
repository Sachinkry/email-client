import EmailLayout from "@/components/email-layout"
import { ThemeProvider } from "@/components/theme-provider"

export default function EmailClientPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <EmailLayout>
        
      </EmailLayout>
    </ThemeProvider>
  )
}

