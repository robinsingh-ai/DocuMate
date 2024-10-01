"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RecoilRoot>
            {children}
            <Toaster />
          </RecoilRoot>
        </ThemeProvider>
      </body>
    </html>
  );
}