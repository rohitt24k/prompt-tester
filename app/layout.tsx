import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'

export const metadata = {
  title: 'Prompt Playground',
  description: 'A Next.js prompt playground with Jinja2 templating and OpenAI integration',
}

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
