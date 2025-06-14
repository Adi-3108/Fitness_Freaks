import type React from "react"
import type { Metadata } from "next/types"
import "./globals.css"
import PushNotificationSetup from "@/components/PushNotificationSetup"

export const metadata: Metadata = {
  title: "Fitness Freaks",
  description: "Your fitness journey starts here",
    
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <PushNotificationSetup />
      </body>
    </html>
  )
}
