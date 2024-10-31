import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SidebarWrapper from "@/components/Layout/SidebarWrapper";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SessionProviderWrapper from "@/components/SessionProviderWrapper/page"; // Componente cliente para o SessionProvider

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Statements Online",
  description: "Statements Online",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <SidebarWrapper>{children}</SidebarWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
