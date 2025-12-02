import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "ZoniTrack+ | Geo-Intelligent Decision Support System",
  description: "A Mobile-Enabled Geo-Intelligent Decision Support System for Location Assessment and Zoning Compliance with Land Use Suitability Analysis - Municipal Planning & Development Office, Santo Tomas, Davao del Norte",
  keywords: ["zoning", "GIS", "compliance", "business permits", "land use", "Santo Tomas", "Davao del Norte", "MPDO"],
  authors: [{ name: "Municipal Planning & Development Office" }],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "ZoniTrack+ | Geo-Intelligent Decision Support System",
    description: "Automated zoning compliance and location assessment system for Santo Tomas, Davao del Norte",
    type: "website",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
