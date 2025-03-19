import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import AuthProvider from '@/components/auth-provider'
import { EmailProvider } from '@/lib/email-context'

export const metadata: Metadata = {
  title: 'Email Client',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body >
      <AuthProvider>
        <EmailProvider>{children}</EmailProvider>
      </AuthProvider>
      </body>
    </html>
  )
}
