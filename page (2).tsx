import React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, Inter } from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Digital Twin III | Cyber-Hardened Portfolio",
  description:
    "A cyber-hardened personal portfolio with integrated AI agents, real-time threat detection, and security analytics. Built by DigitalMind Team.",
  keywords: ["cybersecurity", "portfolio", "AI agents", "threat detection", "Next.js"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
