import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Viewport } from "next"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Omegagu - Card Game Tracker",
  description: "Professional card game match tracker with comprehensive statistics and reporting features",
  keywords: ["card game", "tracker", "statistics", "match history", "gaming", "analytics"],
  authors: [{ name: "Omegagu Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Omegagu - Card Game Tracker",
    description: "Track your card game matches with detailed statistics and beautiful reports",
    type: "website",
    locale: "ko_KR",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">{children}</div>
        <ToastContainer position="top-center" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnHover={false} draggable={false} theme="light" limit={2} />
      </body>
    </html>
  )
}
