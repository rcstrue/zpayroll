import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRMS Pro - Manpower Supplier Management System",
  description: "Comprehensive HRMS Cloud Software for Manpower Suppliers in India. Manage employees, payroll, compliance (EPF, ESI, PT, LWF), and clients efficiently.",
  keywords: ["HRMS", "Manpower Supplier", "Payroll", "EPF", "ESI", "PT", "LWF", "India", "Employee Management", "Compliance"],
  authors: [{ name: "HRMS Pro Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "HRMS Pro - Manpower Supplier Management",
    description: "Comprehensive HRMS for Indian Manpower Suppliers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
