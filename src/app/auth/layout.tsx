import { Navbar } from "@/components/layout/Navbar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Navbar />
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         <div className="w-full max-w-md space-y-8">
            {children}
         </div>
      </div>
    </div>
  )
}
