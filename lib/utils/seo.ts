import { Metadata } from 'next';
import { siteConfig, SEOConfig } from '@/app/config';

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    siteName,
    locale,
    alternateLocales,
  } = config;

  const metaTitle = title || siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;
  const metaUrl = url || siteConfig.url;

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: tags || siteConfig.keywords,
    authors: authors ? authors.map(name => ({ name })) : [{ name: siteConfig.author }],
    
    // Basic Open Graph
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: siteName || siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: locale || siteConfig.locale,
      type: type,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },

    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: metaUrl,
      languages: alternateLocales ? 
        Object.fromEntries(alternateLocales.map(lang => [lang, `${metaUrl}?lang=${lang}`])) : 
        undefined,
    },

    // Additional metadata
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': metaTitle,
    },
  };

  // Article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: authors,
      section,
      tags,
    };
  }

  return metadata;
}

export function generateJsonLd(config: SEOConfig = {}) {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
  } = config;

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    name: title || siteConfig.name,
    description: description || siteConfig.description,
    url: url || siteConfig.url,
    image: image || siteConfig.ogImage,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  if (type === 'article') {
    return {
      ...baseSchema,
      '@type': 'Article',
      headline: title,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: authors ? authors.map(name => ({
        '@type': 'Person',
        name,
      })) : [{
        '@type': 'Person',
        name: siteConfig.author,
      }],
    };
  }

  return baseSchema;
}

// Platform-specific optimizations
export function getDiscordEmbedMeta(config: SEOConfig = {}) {
  const metaTitle = config.title || siteConfig.name;
  const metaDescription = config.description || siteConfig.description;
  const metaImage = config.image || siteConfig.ogImage;
  
  return {
    'og:title': metaTitle,
    'og:description': metaDescription,
    'og:image': metaImage,
    'og:type': 'website',
    'theme-color': '#10b981', // Your brand color
  };
}

export function getLinkedInOptimizedMeta(config: SEOConfig = {}) {
  const metaTitle = config.title || siteConfig.name;
  const metaDescription = config.description || siteConfig.description;
  const metaImage = config.image || siteConfig.ogImage;
  
  return {
    'og:title': metaTitle,
    'og:description': metaDescription,
    'og:image': metaImage,
    'og:type': config.type || 'website',
    'og:site_name': siteConfig.name,
    'article:author': config.authors?.[0] || siteConfig.author,
  };
}

export function getSlackOptimizedMeta(config: SEOConfig = {}) {
  const metaTitle = config.title || siteConfig.name;
  const metaDescription = config.description || siteConfig.description;
  const metaImage = config.image || siteConfig.ogImage;
  
  return {
    'og:title': metaTitle,
    'og:description': metaDescription,
    'og:image': metaImage,
    'og:url': config.url || siteConfig.url,
    'og:type': 'website',
  };
}