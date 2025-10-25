import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "MMA Friends League",
  description: "Organize safe, friendly combat sport events with your crew.",
  icons: [{ rel: "icon", url: "/favicon.ico" }]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0B0F] text-white">
        <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
          <aside className="hidden lg:block border-r border-white/5 bg-surface-muted/60 backdrop-blur-xl">
            <Sidebar />
          </aside>
          <main className="relative min-h-screen">
            <Header />
            <div className="px-4 pb-20 pt-24 sm:px-6 lg:px-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
