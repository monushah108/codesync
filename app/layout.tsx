import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://codesync.dev"),

  alternates: {
    canonical: "/",
  },

  title: {
    default: "CodeSync — Real-Time Collaborative Coding",
    template: "%s | CodeSync",
  },

  description:
    "CodeSync is a real-time collaborative coding workspace where developers can code, communicate, and build together.",

  applicationName: "CodeSync",

  keywords: [
    "CodeSync",
    "collaborative coding",
    "online code editor",
    "real-time coding",
    "developer workspace",
    "code collaboration",
    "AI coding",
  ],

  authors: [
    {
      name: "CodeSync",
    },
  ],

  creator: "CodeSync",
  publisher: "CodeSync",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CodeSync",
    title: "CodeSync — Real-Time Collaborative Coding",
    description:
      "Code together in real time with CodeSync. A collaborative workspace for coding, communication, and building together.",
    url: "https://codesync.dev",
  },

  twitter: {
    card: "summary_large_image",
    title: "CodeSync — Real-Time Collaborative Coding",
    description: "A real-time collaborative coding workspace for developers.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
