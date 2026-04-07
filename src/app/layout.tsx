import type { Metadata } from "next";
import { Source_Sans_3, Source_Code_Pro } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/Providers";
import "./globals.css";

const appSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const appMono = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Official Website of Iin Fibriastuti",
  description: "Official Website of Iin Fibriastuti",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${appSans.variable} ${appMono.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
