import { Metadata } from "next";
import { siteConfig, generateSEOConfig } from "@/app/config";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generateSEOMetadata(generateSEOConfig({
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}. Learn about how we collect, use, and protect your personal information.`,
  url: "/privacy",
  type: "website",
}));

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
} 