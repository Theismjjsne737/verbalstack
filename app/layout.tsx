import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VerbalStack – Speech Pronunciation Feedback',
  description: 'Practice and improve your pronunciation with AI-powered feedback',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
