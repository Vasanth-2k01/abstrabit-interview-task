import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-loading-skeleton/dist/skeleton.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartMark | Modern Bookmark Manager",
  description: "Save, organize, and manage your bookmarks with real-time sync and smart metadata fetching.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

