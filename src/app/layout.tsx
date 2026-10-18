import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/content";
export const dynamic = "force-dynamic";
export async function generateMetadata():Promise<Metadata>{const s=await getSettings();const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";return {metadataBase:new URL(base),title:{default:s.seoTitle||s.siteTitle,template:`%s | ${s.siteTitle}`},description:s.seoDescription||s.tagline,openGraph:{title:s.seoTitle||s.siteTitle,description:s.seoDescription||s.tagline,type:"website",images:s.profileUrl?[s.profileUrl]:[]},robots:{index:true,follow:true}}}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
