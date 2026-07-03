import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RK Infracon – Premium Plots & Real Estate Development",
  description:
    "RK Infracon offers premium DTCP approved & RERA registered open plots in prime locations. Invest in your dream plot with transparent transactions and world-class amenities.",
  keywords: [
    "real estate",
    "plots for sale",
    "open plots",
    "RK Infracon",
    "DTCP approved plots",
    "RERA registered",
    "land investment",
  ],
  openGraph: {
    title: "RK Infracon – Premium Plots & Real Estate Development",
    description:
      "Invest in premium open plots with world-class amenities. DTCP Approved & RERA Registered.",
    url: "https://www.rkinfracon.in",
    siteName: "RK Infracon",
    type: "website",
  },
};

import FloatingContact from "@/components/FloatingContact";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
