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
      <body className="bg-[#060608] text-white">
        <div className="relative min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,59,48,0.12),_transparent_55%)]" aria-hidden />
          <aside className="relative hidden border-r border-white/5 bg-[radial-gradient(circle_at_top,_rgba(255,59,48,0.35),_rgba(11,11,15,0.95))] lg:block">
            <Sidebar />
          </aside>
          <main className="relative min-h-screen bg-[linear-gradient(150deg,rgba(255,59,48,0.08),rgba(15,15,22,0.92))]">
            <Header />
            <div className="px-4 pb-20 pt-24 sm:px-6 lg:px-12 xl:px-16">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
