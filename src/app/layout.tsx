import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DotBackground from "../components/DotBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Awaaz - Your Voice Can Fix Your City",
  description:
    "Awaaz is a civic engagement platform where your voice can fix your city. Raise issues, track progress, and solve problems in your community.",
  keywords:
    "civic engagement, city issues, community problems, government transparency, public participation",
  authors: [{ name: "Awaaz Team" }],
  icons: {
    icon: "/Favicon.png",
    shortcut: "/Favicon.png",
    apple: "/Favicon.png",
  },
  openGraph: {
    title: "Awaaz - Your Voice Can Fix Your City",
    description:
      "Awaaz is a civic engagement platform where your voice can fix your city. Raise issues, track progress, and solve problems in your community.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a0036",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning={true}
      >
        <ToastProvider>
          <AuthProvider>
            <DotBackground />
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
