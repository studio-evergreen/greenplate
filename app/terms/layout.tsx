import { Metadata } from "next";
import { siteConfig, generateSEOConfig } from "@/app/config";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generateSEOMetadata(generateSEOConfig({
  title: `Terms of Service - ${siteConfig.name}`,
  description: `Terms of Service for ${siteConfig.name}. Read our terms and conditions for using our platform.`,
  url: "/terms",
  type: "website",
}));

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
} 