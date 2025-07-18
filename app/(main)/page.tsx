import { Metadata } from "next";
import { siteConfig, generateSEOConfig } from "@/app/config";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generateSEOMetadata(generateSEOConfig({
  title: `${siteConfig.name} - Home`,
  description: `${siteConfig.description}. Modern web application built with Next.js and React.`,
  url: "/",
  type: "website",
}));

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full select-none">
      <h1 className="text-[var(--foreground)] text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 font-inter tracking-tight text-center">
          {siteConfig.name}
      </h1>
      <p className="text-[var(--foreground)] text-lg sm:text-xl font-medium font-inter text-center">
        Inspired by Supaplate
      </p>
    </main>
  );
}
