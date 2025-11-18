import Footer from "@/components/shadcn-studio/blocks/hero-section-01/footer";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify all weights needed
  subsets: ["latin"], // Required subsets
  display: "swap", // Improves loading behavior
  variable: "--font-poppins", // Optional: Use a CSS variable
});

export const metadata: Metadata = {
  title: "CodeRedMap",
  description:
    "An Emergency Map Marker Application to Request and Provide Help During Disasters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
