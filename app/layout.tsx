import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stocks App",
  description:
    "Track real-time stock data, get personalized alerts and explore detaied company insights",
};

/**
 * Provides the application's root HTML structure and applies global layout classes and fonts.
 *
 * Renders an <html lang="en"> element (with dark mode class) containing a <body> that applies the configured Geist font variables and the `antialiased` class, and mounts the supplied children inside the body.
 *
 * @param children - React nodes to render inside the root body element
 * @returns A React element containing the root HTML and body with the provided children
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}