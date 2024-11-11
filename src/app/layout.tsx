import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SidebarWrapper from "@/components/Layout/SidebarWrapper";
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

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode; // Torna `children` opcional
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          {/* SidebarWrapper agora envolve a sidebar e o conteúdo */}
          <SidebarWrapper>
            {/* Main Content Area */}
            <div className="flex-grow overflow-x-hidden h-full h-screen">
              {children}
            </div>
          </SidebarWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
