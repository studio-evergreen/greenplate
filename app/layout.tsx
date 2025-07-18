import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./components/LanguageProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ToastProvider";
import { generateSEOConfig } from "./config";
import { generateMetadata as generateSEOMetadata, generateJsonLd } from "@/lib/utils/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateSEOMetadata(generateSEOConfig());

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = generateJsonLd(generateSEOConfig());
  
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body
        className={`flex flex-col min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
