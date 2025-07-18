export const siteConfig = {
  name: "Greenplate",
  description: "Inspired by Supaplate",
  url: "https://greenplate.vercel.app",
  ogImage: "https://greenplate.vercel.app/og-image.png",
  twitterHandle: "@greenplate",
  keywords: ["greenplate", "supaplate", "nextjs", "react", "typescript"],
  author: "Greenplate Team",
  locale: "en_US",
};

export interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
}

export function generateSEOConfig(config: SEOConfig = {}): SEOConfig {
  const baseUrl = siteConfig.url;
  const defaultConfig: SEOConfig = {
    title: siteConfig.name,
    description: siteConfig.description,
    image: siteConfig.ogImage,
    url: baseUrl,
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    authors: [siteConfig.author],
  };
  
  return {
    ...defaultConfig,
    ...config,
    url: config.url ? `${baseUrl}${config.url}` : baseUrl,
  };
} 