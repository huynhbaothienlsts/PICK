import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PICK! SOCIAL — Play. Connect. Grow.",
  description: "Find partners, book courts, join events and grow your pickleball game with PICK! SOCIAL.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
