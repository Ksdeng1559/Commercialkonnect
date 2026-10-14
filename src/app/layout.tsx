import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "KonstructionComOS", description: "Construction intelligence and capital origination" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html> }
