import { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
export const metadata: Metadata = {
  title: {
    template: "%s | codex",
    default: "codex",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
