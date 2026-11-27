import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PICK! SOCIAL — Play. Connect. Grow.",
  description: "Your game. Your people. Your community. Find games, connect with players and grow through PICK! SOCIAL.",
  metadataBase: new URL("https://huynhbaothienlsts.github.io"),
  openGraph: {
    title: "PICK! SOCIAL — Play. Connect. Grow.",
    description: "Your game. Your people. Your community.",
    images: ["/PICK/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PICK! SOCIAL — Play. Connect. Grow.",
    description: "Your game. Your people. Your community.",
    images: ["/PICK/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
