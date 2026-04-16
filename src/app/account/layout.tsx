import * as React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { AccountLayoutClient } from "@/components/account/AccountLayoutClient"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />
      <AccountLayoutClient>{children}</AccountLayoutClient>
      <Footer />
    </div>
  )
}
