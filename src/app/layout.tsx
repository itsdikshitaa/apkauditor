import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "APK Auditor | Privacy-First Android Security Scanner",
  description:
    "100% client-side Android APK security scanner. MASVS-aligned checks for permissions, secrets, trackers, and manifest issues. Your APK never leaves your device.",
  keywords: [
    "APK",
    "Android",
    "Security",
    "Scanner",
    "OWASP",
    "MASVS",
    "Privacy",
    "Static Analysis",
  ],
  authors: [{ name: "APK Auditor" }],
  openGraph: {
    title: "APK Auditor | Privacy-First Android Security Scanner",
    description:
      "100% client-side security analysis. Your APK never leaves your device.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
