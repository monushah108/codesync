import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://codesync.dev"),

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

        <Toaster
          position="top-center"
          duration={3000}
          toastOptions={{
            classNames: {
              toast: "bg-[#0d1117] border border-[#30363d] text-[#f0f6fc]",
              title: "text-[#f0f6fc]",
              description: "text-[#8b949e]",
            },
          }}
        />
      </body>
    </html>
  );
}
