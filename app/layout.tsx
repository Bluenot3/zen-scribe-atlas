import type { Metadata } from "next";
import "./globals.css";
import "./executive-polish.css";
export const metadata: Metadata = {
 title: "One Page. Always Advancing. | AI & Automation Proposal by ZEN",
 description: "A company-specific AI and automation proposal for One Page Business Plan: six practical builds, 18 opportunities, available tools, customer growth and a measured rollout.",
 robots: { index: false, follow: false },
 icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
