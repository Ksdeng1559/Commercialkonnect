import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CommercialKonnect | Mission Control",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
    <ClerkProvider>{children}</ClerkProvider>
  ) : (
    children
  );
}
